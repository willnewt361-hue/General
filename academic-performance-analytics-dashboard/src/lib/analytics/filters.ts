/**
 * Filters = everything the user picked in the filter bar.
 * Every analytics query receives the same Filters object, so all charts
 * always agree with each other.
 */
import { pool } from "@/db";

export type Role = "head" | "teacher" | "student";

export interface Filters {
  role: Role;
  start: string; // YYYY-MM-DD (inclusive)
  end: string; // YYYY-MM-DD (inclusive)
  className: string | null; // e.g. "S3"
  stream: string | null; // e.g. "A"
  subject: string | null;
  gender: string | null; // "M" | "F"
  examType: string | null; // Quiz | Test | Mid-Term | End of Term
  studentId: string | null; // set when role = student
  teacherId: string | null; // set when role = teacher
  scopeLabel: string; // human text shown in the UI, e.g. "S3 A · Mr. Kato"
}

export interface DateRange {
  start: string;
  end: string;
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function addDays(iso: string, days: number): string {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return isoDate(d);
}

export function daysBetween(start: string, end: string): number {
  return Math.round((Date.parse(`${end}T00:00:00Z`) - Date.parse(`${start}T00:00:00Z`)) / 86_400_000) + 1;
}

/** The period of equal length right before the selected one (used for trend arrows). */
export function previousRange(r: DateRange): DateRange {
  const len = daysBetween(r.start, r.end);
  const end = addDays(r.start, -1);
  return { start: addDays(end, -(len - 1)), end };
}

function clean(v: string | null): string | null {
  if (!v || v === "all") return null;
  return v.slice(0, 100);
}

/** Read filters from the URL query string (?start=...&end=...&class=...). */
export function parseFilters(sp: URLSearchParams): Filters {
  const today = isoDate(new Date());
  let end = sp.get("end") ?? "";
  let start = sp.get("start") ?? "";
  if (!DATE_RE.test(end)) end = today;
  if (!DATE_RE.test(start)) start = addDays(end, -89);
  if (start > end) [start, end] = [end, start];

  const roleParam = sp.get("role");
  const role: Role = roleParam === "teacher" || roleParam === "student" ? roleParam : "head";

  return {
    role,
    start,
    end,
    className: clean(sp.get("class")),
    stream: clean(sp.get("stream")),
    subject: clean(sp.get("subject")),
    gender: clean(sp.get("gender")),
    examType: clean(sp.get("exam_type")),
    studentId: role === "student" ? clean(sp.get("student_id")) : null,
    teacherId: role === "teacher" ? clean(sp.get("teacher_id")) : null,
    scopeLabel: "Whole school",
  };
}

/**
 * Lock the filters to what the viewer is allowed to see:
 *  - class teacher -> only their class + stream
 *  - student       -> only themselves
 * (In Flask, take the id from the logged-in session instead of the URL.)
 */
export async function applyRoleScope(f: Filters): Promise<Filters> {
  if (f.role === "teacher" && f.teacherId) {
    const { rows } = await pool.query("SELECT fullname, class, stream FROM teachers WHERE id = $1", [f.teacherId]);
    if (rows[0]) {
      return { ...f, className: rows[0].class, stream: rows[0].stream, scopeLabel: `${rows[0].class} ${rows[0].stream} · ${rows[0].fullname}` };
    }
  }
  if (f.role === "student" && f.studentId) {
    const { rows } = await pool.query("SELECT fullname, class, stream FROM students WHERE id = $1", [f.studentId]);
    if (rows[0]) {
      return { ...f, className: rows[0].class, stream: rows[0].stream, gender: null, scopeLabel: `${rows[0].fullname} · ${rows[0].class} ${rows[0].stream}` };
    }
  }
  return { ...f, role: f.role === "head" ? "head" : f.role, scopeLabel: f.className ? `${f.className}${f.stream ? " " + f.stream : ""}` : "Whole school" };
}

/** Same scope but for the student's classmates (used for "vs class average"). */
export function classmatesOf(f: Filters): Filters {
  return { ...f, studentId: null };
}

/** Collects $1, $2 ... placeholders so queries stay injection-safe. */
export class SqlParams {
  values: unknown[] = [];
  add(v: unknown): string {
    this.values.push(v);
    return `$${this.values.length}`;
  }
}

/** WHERE conditions on the students table (alias s). */
export function studentConditions(p: SqlParams, f: Filters): string[] {
  const c: string[] = [];
  if (f.studentId) c.push(`s.id = ${p.add(f.studentId)}`);
  if (f.className) c.push(`s.class = ${p.add(f.className)}`);
  if (f.stream) c.push(`s.stream = ${p.add(f.stream)}`);
  if (f.gender) c.push(`s.gender = ${p.add(f.gender)}`);
  return c;
}

/** FROM + WHERE for marks (student_performance p JOIN students s). */
export function marksSource(p: SqlParams, f: Filters, r: DateRange): string {
  const c = [`p.created_at >= ${p.add(r.start)}::date`, `p.created_at < ${p.add(r.end)}::date + 1`, ...studentConditions(p, f)];
  if (f.subject) c.push(`p.subject = ${p.add(f.subject)}`);
  if (f.examType) c.push(`p.exam_type = ${p.add(f.examType)}`);
  return `FROM student_performance p JOIN students s ON s.id = p.student_id WHERE ${c.join(" AND ")}`;
}

/** FROM + WHERE for attendance (subject / exam filters do not apply). */
export function attendanceSource(p: SqlParams, f: Filters, r: DateRange): string {
  const c = [`a.date >= ${p.add(r.start)}::date`, `a.date <= ${p.add(r.end)}::date`, ...studentConditions(p, f)];
  return `FROM attendance a JOIN students s ON s.id = a.student_id WHERE ${c.join(" AND ")}`;
}

/** FROM + WHERE for assignments. */
export function assignmentSource(p: SqlParams, f: Filters, r: DateRange): string {
  const c = [`g.due_date >= ${p.add(r.start)}::date`, `g.due_date <= ${p.add(r.end)}::date`, ...studentConditions(p, f)];
  if (f.subject) c.push(`g.subject = ${p.add(f.subject)}`);
  return `FROM assignment_submissions g JOIN students s ON s.id = g.student_id WHERE ${c.join(" AND ")}`;
}
