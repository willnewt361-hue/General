/**
 * All SQL for the dashboard lives here - one small function per question.
 * The Flask version (flask_analytics/analytics_queries.py) mirrors these 1:1.
 */
import { pool } from "@/db";
import {
  assignmentSource,
  attendanceSource,
  daysBetween,
  addDays,
  marksSource,
  SqlParams,
  studentConditions,
  type DateRange,
  type Filters,
} from "./filters";

export const PASS_MARK = 50;

/** Grade bands used across the school (edit to match your grading policy). */
export const GRADE_BANDS = [
  { grade: "A", min: 80 },
  { grade: "B", min: 70 },
  { grade: "C", min: 60 },
  { grade: "D", min: 50 },
  { grade: "E", min: 40 },
  { grade: "F", min: 0 },
] as const;

export function gradeOf(score: number | null): string | null {
  if (score === null || Number.isNaN(score)) return null;
  return GRADE_BANDS.find((b) => score >= b.min)?.grade ?? "F";
}

async function query<T>(text: string, values: unknown[]): Promise<T[]> {
  const { rows } = await pool.query(text, values);
  return rows as T[];
}

// ---------------------------------------------------------------- summaries

export interface MarksSummary {
  avg_score: number | null;
  pass_rate: number | null;
  distinction_rate: number | null;
  assessments: number;
  students: number;
}

export async function marksSummary(f: Filters, r: DateRange): Promise<MarksSummary> {
  const p = new SqlParams();
  const rows = await query<MarksSummary>(
    `SELECT round(avg(p.score), 1)::float AS avg_score,
            round(100.0 * avg(CASE WHEN p.score >= ${PASS_MARK} THEN 1 ELSE 0 END), 1)::float AS pass_rate,
            round(100.0 * avg(CASE WHEN p.score >= 80 THEN 1 ELSE 0 END), 1)::float AS distinction_rate,
            count(*)::int AS assessments,
            count(DISTINCT p.student_id)::int AS students
     ${marksSource(p, f, r)}`,
    p.values,
  );
  return rows[0];
}

export async function attendanceSummary(f: Filters, r: DateRange): Promise<{ rate: number | null; absences: number }> {
  const p = new SqlParams();
  const rows = await query<{ rate: number | null; absences: number }>(
    `SELECT round(100.0 * avg(CASE WHEN a.status IN ('present', 'late') THEN 1 ELSE 0 END), 1)::float AS rate,
            count(*) FILTER (WHERE a.status = 'absent')::int AS absences
     ${attendanceSource(p, f, r)}`,
    p.values,
  );
  return rows[0];
}

export async function assignmentSummary(f: Filters, r: DateRange): Promise<{ completion: number | null; on_time: number | null }> {
  const p = new SqlParams();
  const rows = await query<{ completion: number | null; on_time: number | null }>(
    `SELECT round(100.0 * avg(CASE WHEN g.status <> 'missing' THEN 1 ELSE 0 END), 1)::float AS completion,
            round(100.0 * avg(CASE WHEN g.status = 'on_time' THEN 1 ELSE 0 END), 1)::float AS on_time
     ${assignmentSource(p, f, r)}`,
    p.values,
  );
  return rows[0];
}

// ---------------------------------------------------------------- per student

export interface StudentStat {
  id: string;
  name: string;
  gender: string | null;
  class: string;
  stream: string;
  avg_score: number | null;
  best: number | null;
  assessments: number;
  trend: number | null; // 2nd half average minus 1st half average
  attendance: number | null;
  absences: number;
  completion: number | null;
  grade?: string | null;
  status?: string;
  rank?: number;
}

/** One row per student: marks, attendance and assignments in the period. */
export async function studentStats(f: Filters, r: DateRange): Promise<StudentStat[]> {
  const p = new SqlParams();
  const mid = addDays(r.start, Math.floor(daysBetween(r.start, r.end) / 2));
  const midParam = p.add(mid);
  const where = studentConditions(p, f);
  const rows = await query<StudentStat>(
    `WITH mark_stats AS (
        SELECT p.student_id, avg(p.score) AS avg_score, max(p.score) AS best, count(*) AS n,
               avg(p.score) FILTER (WHERE p.created_at <  ${midParam}::date) AS first_half,
               avg(p.score) FILTER (WHERE p.created_at >= ${midParam}::date) AS second_half
        ${marksSource(p, f, r)}
        GROUP BY p.student_id),
      att_stats AS (
        SELECT a.student_id,
               avg(CASE WHEN a.status IN ('present', 'late') THEN 100.0 ELSE 0 END) AS attendance,
               count(*) FILTER (WHERE a.status = 'absent') AS absences
        ${attendanceSource(p, f, r)}
        GROUP BY a.student_id),
      asg_stats AS (
        SELECT g.student_id, avg(CASE WHEN g.status <> 'missing' THEN 100.0 ELSE 0 END) AS completion
        ${assignmentSource(p, f, r)}
        GROUP BY g.student_id)
     SELECT s.id, s.fullname AS name, s.gender, s.class, s.stream,
            round(m.avg_score, 1)::float AS avg_score,
            round(m.best, 1)::float AS best,
            coalesce(m.n, 0)::int AS assessments,
            round(m.second_half - m.first_half, 1)::float AS trend,
            round(a.attendance, 1)::float AS attendance,
            coalesce(a.absences, 0)::int AS absences,
            round(g.completion, 1)::float AS completion
     FROM students s
     LEFT JOIN mark_stats m ON m.student_id = s.id
     LEFT JOIN att_stats a ON a.student_id = s.id
     LEFT JOIN asg_stats g ON g.student_id = s.id
     ${where.length ? `WHERE ${where.join(" AND ")}` : ""}
     ORDER BY m.avg_score DESC NULLS LAST, s.fullname`,
    p.values,
  );
  return rows.map((row, i) => ({ ...row, rank: i + 1, grade: gradeOf(row.avg_score), status: statusOf(row) }));
}

/** Simple, explainable early-warning rules. */
export function statusOf(s: Pick<StudentStat, "avg_score" | "attendance" | "trend">): string {
  if (s.avg_score === null) return "No data";
  if (s.avg_score < PASS_MARK || (s.attendance ?? 100) < 85) return "At risk";
  if (s.avg_score < 60 || (s.attendance ?? 100) < 90 || (s.trend ?? 0) <= -5) return "Watch";
  if (s.avg_score >= 80) return "Excellent";
  return "On track";
}

// ---------------------------------------------------------------- time series

export type Bucket = "day" | "week" | "month";

export function bucketFor(r: DateRange): Bucket {
  const days = daysBetween(r.start, r.end);
  if (days <= 21) return "day";
  if (days <= 180) return "week";
  return "month";
}

export interface SeriesPoint {
  bucket: string;
  value: number | null;
}

export async function scoreSeries(f: Filters, r: DateRange, unit: Bucket): Promise<SeriesPoint[]> {
  const p = new SqlParams();
  return query<SeriesPoint>(
    `SELECT to_char(date_trunc('${unit}', p.created_at), 'YYYY-MM-DD') AS bucket, round(avg(p.score), 1)::float AS value
     ${marksSource(p, f, r)} GROUP BY 1 ORDER BY 1`,
    p.values,
  );
}

export async function attendanceSeries(f: Filters, r: DateRange, unit: Bucket): Promise<SeriesPoint[]> {
  const p = new SqlParams();
  return query<SeriesPoint>(
    `SELECT to_char(date_trunc('${unit}', a.date), 'YYYY-MM-DD') AS bucket,
            round(100.0 * avg(CASE WHEN a.status IN ('present', 'late') THEN 1 ELSE 0 END), 1)::float AS value
     ${attendanceSource(p, f, r)} GROUP BY 1 ORDER BY 1`,
    p.values,
  );
}

// ---------------------------------------------------------------- breakdowns

export interface GroupAvg {
  label: string;
  avg: number | null;
  pass_rate: number | null;
  n: number;
}

export async function bySubject(f: Filters, r: DateRange): Promise<GroupAvg[]> {
  const p = new SqlParams();
  return query<GroupAvg>(
    `SELECT p.subject AS label, round(avg(p.score), 1)::float AS avg,
            round(100.0 * avg(CASE WHEN p.score >= ${PASS_MARK} THEN 1 ELSE 0 END), 1)::float AS pass_rate,
            count(*)::int AS n
     ${marksSource(p, f, r)} GROUP BY p.subject ORDER BY p.subject`,
    p.values,
  );
}

export async function byClass(f: Filters, r: DateRange): Promise<GroupAvg[]> {
  const p = new SqlParams();
  return query<GroupAvg>(
    `SELECT s.class || ' ' || s.stream AS label, round(avg(p.score), 1)::float AS avg,
            round(100.0 * avg(CASE WHEN p.score >= ${PASS_MARK} THEN 1 ELSE 0 END), 1)::float AS pass_rate,
            count(*)::int AS n
     ${marksSource(p, f, r)} GROUP BY s.class, s.stream ORDER BY s.class, s.stream`,
    p.values,
  );
}

export async function byExamType(f: Filters, r: DateRange): Promise<GroupAvg[]> {
  const p = new SqlParams();
  return query<GroupAvg>(
    `SELECT p.exam_type AS label, round(avg(p.score), 1)::float AS avg,
            round(100.0 * avg(CASE WHEN p.score >= ${PASS_MARK} THEN 1 ELSE 0 END), 1)::float AS pass_rate,
            count(*)::int AS n
     ${marksSource(p, f, r)} GROUP BY p.exam_type
     ORDER BY array_position(ARRAY['Quiz','Test','Mid-Term','End of Term']::varchar[], p.exam_type)`,
    p.values,
  );
}

/** Count of marks in 10-point bins: index 0 = 0-9 ... index 9 = 90-100. */
export async function scoreHistogram(f: Filters, r: DateRange): Promise<number[]> {
  const p = new SqlParams();
  const rows = await query<{ bin: number; n: number }>(
    `SELECT LEAST(9, floor(p.score / 10))::int AS bin, count(*)::int AS n ${marksSource(p, f, r)} GROUP BY 1`,
    p.values,
  );
  const bins = Array<number>(10).fill(0);
  rows.forEach((row) => (bins[row.bin] = row.n));
  return bins;
}

export async function attendanceByStatus(f: Filters, r: DateRange): Promise<Record<string, number>> {
  const p = new SqlParams();
  const rows = await query<{ status: string; n: number }>(
    `SELECT a.status, count(*)::int AS n ${attendanceSource(p, f, r)} GROUP BY a.status`,
    p.values,
  );
  const out: Record<string, number> = { present: 0, late: 0, absent: 0, excused: 0 };
  rows.forEach((row) => (out[row.status] = row.n));
  return out;
}

export async function attendanceByWeekday(f: Filters, r: DateRange): Promise<{ day: string; rate: number | null }[]> {
  const p = new SqlParams();
  const rows = await query<{ dow: number; rate: number | null }>(
    `SELECT extract(isodow FROM a.date)::int AS dow,
            round(100.0 * avg(CASE WHEN a.status IN ('present', 'late') THEN 1 ELSE 0 END), 1)::float AS rate
     ${attendanceSource(p, f, r)} GROUP BY 1 ORDER BY 1`,
    p.values,
  );
  const names = ["", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return rows.filter((row) => row.dow <= 5).map((row) => ({ day: names[row.dow], rate: row.rate }));
}

export async function assignmentByStatus(f: Filters, r: DateRange): Promise<Record<string, number>> {
  const p = new SqlParams();
  const rows = await query<{ status: string; n: number }>(
    `SELECT g.status, count(*)::int AS n ${assignmentSource(p, f, r)} GROUP BY g.status`,
    p.values,
  );
  const out: Record<string, number> = { on_time: 0, late: 0, missing: 0 };
  rows.forEach((row) => (out[row.status] = row.n));
  return out;
}

/** Class x subject average grid. */
export async function classSubjectHeatmap(f: Filters, r: DateRange): Promise<{ row: string; col: string; value: number }[]> {
  const p = new SqlParams();
  return query<{ row: string; col: string; value: number }>(
    `SELECT s.class || ' ' || s.stream AS row, p.subject AS col, round(avg(p.score), 1)::float AS value
     ${marksSource(p, f, r)} GROUP BY s.class, s.stream, p.subject ORDER BY s.class, s.stream, p.subject`,
    p.values,
  );
}

export interface MarkRow {
  date: string;
  subject: string;
  exam_type: string;
  score: number;
}

export async function recentMarks(f: Filters, r: DateRange, limit = 10): Promise<MarkRow[]> {
  const p = new SqlParams();
  return query<MarkRow>(
    `SELECT to_char(p.created_at, 'YYYY-MM-DD') AS date, p.subject, p.exam_type, p.score::float AS score
     ${marksSource(p, f, r)} ORDER BY p.created_at DESC LIMIT ${Math.min(50, Math.max(1, limit))}`,
    p.values,
  );
}

// ---------------------------------------------------------------- lookup lists

export async function lookups() {
  const [classes, streams, subjects, teachers, students, range] = await Promise.all([
    query<{ v: string }>("SELECT DISTINCT class AS v FROM students WHERE class IS NOT NULL ORDER BY 1", []),
    query<{ v: string }>("SELECT DISTINCT stream AS v FROM students WHERE stream IS NOT NULL ORDER BY 1", []),
    query<{ v: string }>("SELECT DISTINCT subject AS v FROM student_performance WHERE subject IS NOT NULL ORDER BY 1", []),
    query<{ id: string; name: string; class: string; stream: string; subjects: string }>(
      "SELECT id, fullname AS name, class, stream, subjects FROM teachers ORDER BY class, stream",
      [],
    ),
    query<{ id: string; name: string; class: string; stream: string }>(
      "SELECT id, fullname AS name, class, stream FROM students ORDER BY fullname",
      [],
    ),
    query<{ min: string | null; max: string | null }>(
      "SELECT to_char(min(created_at), 'YYYY-MM-DD') AS min, to_char(max(created_at), 'YYYY-MM-DD') AS max FROM student_performance",
      [],
    ),
  ]);
  return {
    classes: classes.map((r) => r.v),
    streams: streams.map((r) => r.v),
    subjects: subjects.map((r) => r.v),
    examTypes: ["Quiz", "Test", "Mid-Term", "End of Term"],
    teachers,
    students,
    dataRange: range[0],
    gradeBands: GRADE_BANDS,
    passMark: PASS_MARK,
  };
}
