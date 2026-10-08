/**
 * Service layer: combines small queries into the JSON the dashboard renders.
 * Endpoint -> function:
 *   GET /api/analytics/meta            -> getMeta()
 *   GET /api/analytics/dashboard       -> getDashboard(filters)
 *   GET /api/analytics/table           -> getTable(filters)
 *   GET /api/analytics/student/<id>    -> getStudentDetail(id, filters)
 */
import { classmatesOf, previousRange, type DateRange, type Filters } from "./filters";
import * as Q from "./queries";

export interface Kpi {
  key: string;
  label: string;
  value: number | null;
  prev: number | null;
  unit: "%" | "" | "#";
  higherIsBetter: boolean;
  hint: string;
}

function kpi(key: string, label: string, value: number | null, prev: number | null, unit: Kpi["unit"], higherIsBetter: boolean, hint: string): Kpi {
  return { key, label, value, prev, unit, higherIsBetter, hint };
}

/** Put two or more series on the same time axis. */
function alignSeries(series: Record<string, Q.SeriesPoint[]>) {
  const buckets = Array.from(new Set(Object.values(series).flatMap((s) => s.map((p) => p.bucket)))).sort();
  const out: Record<string, (number | null)[]> = {};
  for (const [name, points] of Object.entries(series)) {
    const map = new Map(points.map((p) => [p.bucket, p.value]));
    out[name] = buckets.map((b) => map.get(b) ?? null);
  }
  return { buckets, ...out };
}

export async function getMeta() {
  return Q.lookups();
}

export async function getDashboard(f: Filters) {
  const range: DateRange = { start: f.start, end: f.end };
  const prev = previousRange(range);
  const unit = Q.bucketFor(range);
  const isStudent = f.role === "student";
  // Comparison group: students compare with their class, teachers with the whole school.
  const peers: Filters | null = isStudent
    ? classmatesOf(f)
    : f.role === "teacher"
      ? { ...f, className: null, stream: null }
      : null;

  const [
    marks, marksPrev, att, attPrev, asg, asgPrev, stats, statsPrev,
    scoreS, attS, peerS, subjects, subjectsPrev, peerSubjects,
    classes, examTypes, histogram, attStatus, weekday, asgStatus, heatmap, recent,
  ] = await Promise.all([
    Q.marksSummary(f, range),
    Q.marksSummary(f, prev),
    Q.attendanceSummary(f, range),
    Q.attendanceSummary(f, prev),
    Q.assignmentSummary(f, range),
    Q.assignmentSummary(f, prev),
    Q.studentStats(isStudent ? classmatesOf(f) : f, range),
    Q.studentStats(isStudent ? classmatesOf(f) : f, prev),
    Q.scoreSeries(f, range, unit),
    Q.attendanceSeries(f, range, unit),
    peers ? Q.scoreSeries(peers, range, unit) : Promise.resolve([]),
    Q.bySubject(f, range),
    Q.bySubject(f, prev),
    peers ? Q.bySubject(peers, range) : Promise.resolve([]),
    isStudent ? Promise.resolve([]) : Q.byClass(f, range),
    Q.byExamType(f, range),
    Q.scoreHistogram(f, range),
    Q.attendanceByStatus(f, range),
    Q.attendanceByWeekday(f, range),
    Q.assignmentByStatus(f, range),
    isStudent ? Promise.resolve([]) : Q.classSubjectHeatmap(f, range),
    isStudent ? Q.recentMarks(f, range, 8) : Promise.resolve([]),
  ]);

  // ---- KPI cards
  const atRisk = stats.filter((s) => s.status === "At risk").length;
  const atRiskPrev = statsPrev.filter((s) => s.status === "At risk").length;
  const kpis: Kpi[] = [
    kpi("avg", isStudent ? "My average" : "Average score", marks.avg_score, marksPrev.avg_score, "%", true, "Mean of all marks in the period"),
    kpi("pass", "Pass rate", marks.pass_rate, marksPrev.pass_rate, "%", true, `Share of marks at or above ${Q.PASS_MARK}%`),
    kpi("att", "Attendance", att.rate, attPrev.rate, "%", true, "Present or late, out of school days"),
    kpi("asg", "Assignments done", asg.completion, asgPrev.completion, "%", true, "Submitted (on time or late)"),
  ];
  if (isStudent) {
    const rank = stats.find((s) => s.id === f.studentId)?.rank ?? null;
    const rankPrev = statsPrev.find((s) => s.id === f.studentId)?.rank ?? null;
    kpis.push(kpi("rank", `Class position /${stats.length}`, rank, rankPrev, "#", false, "Position among classmates by average"));
  } else {
    kpis.push(kpi("risk", "Students at risk", atRisk, atRiskPrev, "", false, "Average below 50% or attendance below 85%"));
  }
  kpis.push(kpi("dist", "Distinctions (A)", marks.distinction_rate, marksPrev.distinction_rate, "%", true, "Share of marks at 80% or above"));

  // ---- Grade distribution (derived from histogram bins)
  const grades = Q.GRADE_BANDS.map((b) => ({ grade: b.grade, min: b.min, n: 0 }));
  histogram.forEach((n, bin) => {
    const g = Q.gradeOf(bin * 10 + 5);
    const target = grades.find((x) => x.grade === g);
    if (target) target.n += n;
  });

  const prevSubjectMap = new Map(subjectsPrev.map((s) => [s.label, s.avg]));
  const peerSubjectMap = new Map(peerSubjects.map((s) => [s.label, s.avg]));
  const subjectRows = subjects.map((s) => ({
    ...s,
    prev_avg: prevSubjectMap.get(s.label) ?? null,
    peer_avg: peerSubjectMap.get(s.label) ?? null,
  }));

  const trend = alignSeries({ score: scoreS, attendance: attS, peer: peerS });

  return {
    scope: { role: f.role, label: f.scopeLabel, start: f.start, end: f.end, prevStart: prev.start, prevEnd: prev.end, unit },
    peerLabel: isStudent ? "Class average" : f.role === "teacher" ? "School average" : null,
    kpis,
    trend,
    subjects: subjectRows,
    classes,
    examTypes,
    histogram,
    grades,
    attendance: { status: attStatus, weekday },
    assignments: asgStatus,
    heatmap,
    recent,
    top: isStudent ? [] : stats.filter((s) => s.avg_score !== null).slice(0, 5),
    atRisk: isStudent
      ? []
      : stats
          .filter((s) => s.status === "At risk")
          .sort((a, b) => (a.avg_score ?? 0) - (b.avg_score ?? 0))
          .slice(0, 8),
    statusCounts: countBy(stats.filter((s) => !isStudent || s.id === f.studentId), (s) => s.status ?? "No data"),
    insights: buildInsights({ f, subjects: subjectRows, classes, weekday, asg: asgStatus, atRisk, atRiskPrev, att: att.rate, marks }),
  };
}

function countBy<T>(items: T[], key: (t: T) => string): Record<string, number> {
  return items.reduce<Record<string, number>>((acc, it) => {
    acc[key(it)] = (acc[key(it)] ?? 0) + 1;
    return acc;
  }, {});
}

interface InsightInput {
  f: Filters;
  subjects: (Q.GroupAvg & { prev_avg: number | null; peer_avg: number | null })[];
  classes: Q.GroupAvg[];
  weekday: { day: string; rate: number | null }[];
  asg: Record<string, number>;
  atRisk: number;
  atRiskPrev: number;
  att: number | null;
  marks: Q.MarksSummary;
}

export interface Insight {
  tone: "good" | "bad" | "info";
  text: string;
}

/** Plain-language findings, so non-technical users get the story at a glance. */
function buildInsights(i: InsightInput): Insight[] {
  const out: Insight[] = [];
  const subs = i.subjects.filter((s) => s.avg !== null);
  const you = i.f.role === "student";
  if (subs.length > 1) {
    const best = subs.reduce((a, b) => ((a.avg ?? 0) >= (b.avg ?? 0) ? a : b));
    const worst = subs.reduce((a, b) => ((a.avg ?? 0) <= (b.avg ?? 0) ? a : b));
    out.push({ tone: "good", text: `${you ? "Your strongest" : "Strongest"} subject is ${best.label} at ${best.avg}% average.` });
    if (worst.label !== best.label) {
      out.push({ tone: "bad", text: `${worst.label} needs attention - ${worst.avg}% average, ${worst.pass_rate}% pass rate.` });
    }
    const moves = subs.filter((s) => s.prev_avg !== null).map((s) => ({ s, d: (s.avg ?? 0) - (s.prev_avg ?? 0) }));
    if (moves.length) {
      const up = moves.reduce((a, b) => (a.d >= b.d ? a : b));
      const down = moves.reduce((a, b) => (a.d <= b.d ? a : b));
      if (up.d > 0.5) out.push({ tone: "good", text: `${up.s.label} improved the most: +${up.d.toFixed(1)} pts vs previous period.` });
      if (down.d < -0.5) out.push({ tone: "bad", text: `${down.s.label} dropped ${Math.abs(down.d).toFixed(1)} pts vs previous period.` });
    }
    if (you) {
      const gap = subs.filter((s) => s.peer_avg !== null).map((s) => ({ s, d: (s.avg ?? 0) - (s.peer_avg ?? 0) }));
      const behind = gap.filter((g) => g.d < 0).sort((a, b) => a.d - b.d)[0];
      if (behind) out.push({ tone: "info", text: `You are ${Math.abs(behind.d).toFixed(1)} pts below the class average in ${behind.s.label} - a good focus area.` });
    }
  }
  if (i.classes.length > 1) {
    const top = i.classes.reduce((a, b) => ((a.avg ?? 0) >= (b.avg ?? 0) ? a : b));
    out.push({ tone: "info", text: `Top performing class: ${top.label} (${top.avg}% average).` });
  }
  const wd = i.weekday.filter((w) => w.rate !== null);
  if (wd.length) {
    const low = wd.reduce((a, b) => ((a.rate ?? 100) <= (b.rate ?? 100) ? a : b));
    const fullDay: Record<string, string> = { Mon: "Monday", Tue: "Tuesday", Wed: "Wednesday", Thu: "Thursday", Fri: "Friday" };
    out.push({ tone: "info", text: `Attendance is lowest on ${fullDay[low.day] ?? low.day}s (${low.rate}%).` });
  }
  const totalAsg = (i.asg.on_time ?? 0) + (i.asg.late ?? 0) + (i.asg.missing ?? 0);
  if (totalAsg) {
    const missing = (100 * (i.asg.missing ?? 0)) / totalAsg;
    out.push({ tone: missing > 8 ? "bad" : "good", text: `${missing.toFixed(1)}% of assignments were not submitted.` });
  }
  if (!you) {
    const d = i.atRisk - i.atRiskPrev;
    out.push({
      tone: d > 0 ? "bad" : "good",
      text: `${i.atRisk} student${i.atRisk === 1 ? "" : "s"} at risk (${d > 0 ? "+" : ""}${d} vs previous period).`,
    });
  } else if (i.att !== null) {
    out.push({ tone: i.att >= 90 ? "good" : "bad", text: `Your attendance is ${i.att}% - ${i.att >= 90 ? "great, keep it up!" : "aim for at least 90%."}` });
  }
  return out;
}

/** Rows for the data table: students (head / teacher) or subjects (student). */
export async function getTable(f: Filters) {
  const range: DateRange = { start: f.start, end: f.end };
  if (f.role === "student") {
    const [mine, peers, marks] = await Promise.all([
      Q.bySubject(f, range),
      Q.bySubject(classmatesOf(f), range),
      Q.recentMarks(f, range, 50),
    ]);
    const peerMap = new Map(peers.map((p) => [p.label, p.avg]));
    const rows = mine.map((s) => {
      const list = marks.filter((m) => m.subject === s.label);
      const latest = list[0]?.score ?? null;
      const oldest = list[list.length - 1]?.score ?? null;
      return {
        id: s.label,
        subject: s.label,
        avg_score: s.avg,
        class_avg: peerMap.get(s.label) ?? null,
        vs_class: s.avg !== null && peerMap.get(s.label) != null ? +(s.avg - (peerMap.get(s.label) ?? 0)).toFixed(1) : null,
        latest,
        trend: latest !== null && oldest !== null && list.length > 1 ? +(latest - oldest).toFixed(1) : null,
        assessments: s.n,
        grade: Q.gradeOf(s.avg),
      };
    });
    return {
      kind: "subjects" as const,
      columns: [
        { key: "subject", label: "Subject", type: "text" },
        { key: "avg_score", label: "My avg", type: "pct" },
        { key: "class_avg", label: "Class avg", type: "pct" },
        { key: "vs_class", label: "vs Class", type: "delta" },
        { key: "latest", label: "Latest", type: "pct" },
        { key: "trend", label: "Trend", type: "delta" },
        { key: "assessments", label: "Marks", type: "num" },
        { key: "grade", label: "Grade", type: "grade" },
      ],
      rows,
    };
  }
  const rows = (await Q.studentStats(f, range)).map((s) => ({ ...s, class_label: `${s.class} ${s.stream}` }));
  return {
    kind: "students" as const,
    columns: [
      { key: "rank", label: "#", type: "num" },
      { key: "name", label: "Student", type: "text" },
      { key: "class_label", label: "Class", type: "text" },
      { key: "gender", label: "Sex", type: "text" },
      { key: "avg_score", label: "Average", type: "pct" },
      { key: "grade", label: "Grade", type: "grade" },
      { key: "trend", label: "Trend", type: "delta" },
      { key: "attendance", label: "Attendance", type: "pct" },
      { key: "completion", label: "Assignments", type: "pct" },
      { key: "status", label: "Status", type: "status" },
    ],
    rows,
  };
}

/** Everything for the student profile pop-up. */
export async function getStudentDetail(studentId: string, base: Filters) {
  const range: DateRange = { start: base.start, end: base.end };
  const studentFilters: Filters = { ...base, role: "student", studentId, gender: null };
  const meta = await Q.lookups();
  const student = meta.students.find((s) => s.id === studentId);
  if (!student) return null;
  const me: Filters = { ...studentFilters, className: student.class, stream: student.stream };
  const unit = Q.bucketFor(range);
  const [marks, att, asg, subjects, classSubjects, scoreS, classS, recent, classStats] = await Promise.all([
    Q.marksSummary(me, range),
    Q.attendanceSummary(me, range),
    Q.assignmentSummary(me, range),
    Q.bySubject(me, range),
    Q.bySubject(classmatesOf(me), range),
    Q.scoreSeries(me, range, unit),
    Q.scoreSeries(classmatesOf(me), range, unit),
    Q.recentMarks(me, range, 6),
    Q.studentStats(classmatesOf(me), range),
  ]);
  const mine = classStats.find((s) => s.id === studentId);
  const classMap = new Map(classSubjects.map((s) => [s.label, s.avg]));
  return {
    student: { ...student, status: mine?.status ?? "No data", rank: mine?.rank ?? null, classSize: classStats.length },
    summary: { avg: marks.avg_score, pass: marks.pass_rate, attendance: att.rate, absences: att.absences, completion: asg.completion, grade: Q.gradeOf(marks.avg_score) },
    trend: alignSeries({ score: scoreS, peer: classS }),
    subjects: subjects.map((s) => ({ label: s.label, avg: s.avg, peer_avg: classMap.get(s.label) ?? null })),
    recent,
  };
}
