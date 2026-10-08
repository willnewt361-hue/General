"""
All SQL for the dashboard - one small function per question.
Mirrors src/lib/analytics/queries.ts function-for-function.
"""
from .db import query
from .filters import (
    SqlParams, add_days, assignment_source, attendance_source, days_between,
    marks_source, student_conditions,
)

PASS_MARK = 50

# Grade bands used across the school (edit to match your grading policy).
GRADE_BANDS = [
    {"grade": "A", "min": 80},
    {"grade": "B", "min": 70},
    {"grade": "C", "min": 60},
    {"grade": "D", "min": 50},
    {"grade": "E", "min": 40},
    {"grade": "F", "min": 0},
]

EXAM_TYPES = ["Quiz", "Test", "Mid-Term", "End of Term"]


def grade_of(score):
    if score is None:
        return None
    for band in GRADE_BANDS:
        if score >= band["min"]:
            return band["grade"]
    return "F"


def status_of(avg_score, attendance, trend):
    """Simple, explainable early-warning rules."""
    if avg_score is None:
        return "No data"
    att = 100 if attendance is None else attendance
    if avg_score < PASS_MARK or att < 85:
        return "At risk"
    if avg_score < 60 or att < 90 or (trend or 0) <= -5:
        return "Watch"
    if avg_score >= 80:
        return "Excellent"
    return "On track"


# ------------------------------------------------------------------ summaries

def marks_summary(f, r):
    p = SqlParams()
    return query(f"""
        SELECT round(avg(p.score), 1)::float AS avg_score,
               round(100.0 * avg(CASE WHEN p.score >= {PASS_MARK} THEN 1 ELSE 0 END), 1)::float AS pass_rate,
               round(100.0 * avg(CASE WHEN p.score >= 80 THEN 1 ELSE 0 END), 1)::float AS distinction_rate,
               count(*)::int AS assessments,
               count(DISTINCT p.student_id)::int AS students
        {marks_source(p, f, r)}""", p.values)[0]


def attendance_summary(f, r):
    p = SqlParams()
    return query(f"""
        SELECT round(100.0 * avg(CASE WHEN a.status IN ('present', 'late') THEN 1 ELSE 0 END), 1)::float AS rate,
               count(*) FILTER (WHERE a.status = 'absent')::int AS absences
        {attendance_source(p, f, r)}""", p.values)[0]


def assignment_summary(f, r):
    p = SqlParams()
    return query(f"""
        SELECT round(100.0 * avg(CASE WHEN g.status <> 'missing' THEN 1 ELSE 0 END), 1)::float AS completion,
               round(100.0 * avg(CASE WHEN g.status = 'on_time' THEN 1 ELSE 0 END), 1)::float AS on_time
        {assignment_source(p, f, r)}""", p.values)[0]


# ------------------------------------------------------------------ per student

def student_stats(f, r):
    """One row per student: marks, attendance and assignments in the period."""
    p = SqlParams()
    mid = p.add(add_days(r.start, days_between(r.start, r.end) // 2))
    where = student_conditions(p, f)
    rows = query(f"""
        WITH mark_stats AS (
            SELECT p.student_id, avg(p.score) AS avg_score, max(p.score) AS best, count(*) AS n,
                   avg(p.score) FILTER (WHERE p.created_at <  {mid}::date) AS first_half,
                   avg(p.score) FILTER (WHERE p.created_at >= {mid}::date) AS second_half
            {marks_source(p, f, r)}
            GROUP BY p.student_id),
          att_stats AS (
            SELECT a.student_id,
                   avg(CASE WHEN a.status IN ('present', 'late') THEN 100.0 ELSE 0 END) AS attendance,
                   count(*) FILTER (WHERE a.status = 'absent') AS absences
            {attendance_source(p, f, r)}
            GROUP BY a.student_id),
          asg_stats AS (
            SELECT g.student_id, avg(CASE WHEN g.status <> 'missing' THEN 100.0 ELSE 0 END) AS completion
            {assignment_source(p, f, r)}
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
        {"WHERE " + " AND ".join(where) if where else ""}
        ORDER BY m.avg_score DESC NULLS LAST, s.fullname""", p.values)
    for i, row in enumerate(rows):
        row["rank"] = i + 1
        row["grade"] = grade_of(row["avg_score"])
        row["status"] = status_of(row["avg_score"], row["attendance"], row["trend"])
    return rows


# ------------------------------------------------------------------ time series

def bucket_for(r):
    days = days_between(r.start, r.end)
    if days <= 21:
        return "day"
    if days <= 180:
        return "week"
    return "month"


def score_series(f, r, unit):
    assert unit in ("day", "week", "month")
    p = SqlParams()
    return query(f"""
        SELECT to_char(date_trunc('{unit}', p.created_at), 'YYYY-MM-DD') AS bucket,
               round(avg(p.score), 1)::float AS value
        {marks_source(p, f, r)} GROUP BY 1 ORDER BY 1""", p.values)


def attendance_series(f, r, unit):
    assert unit in ("day", "week", "month")
    p = SqlParams()
    return query(f"""
        SELECT to_char(date_trunc('{unit}', a.date), 'YYYY-MM-DD') AS bucket,
               round(100.0 * avg(CASE WHEN a.status IN ('present', 'late') THEN 1 ELSE 0 END), 1)::float AS value
        {attendance_source(p, f, r)} GROUP BY 1 ORDER BY 1""", p.values)


# ------------------------------------------------------------------ breakdowns

def _group_avg(label_sql, group_sql, order_sql, f, r):
    p = SqlParams()
    return query(f"""
        SELECT {label_sql} AS label, round(avg(p.score), 1)::float AS avg,
               round(100.0 * avg(CASE WHEN p.score >= {PASS_MARK} THEN 1 ELSE 0 END), 1)::float AS pass_rate,
               count(*)::int AS n
        {marks_source(p, f, r)} GROUP BY {group_sql} ORDER BY {order_sql}""", p.values)


def by_subject(f, r):
    return _group_avg("p.subject", "p.subject", "p.subject", f, r)


def by_class(f, r):
    return _group_avg("s.class || ' ' || s.stream", "s.class, s.stream", "s.class, s.stream", f, r)


def by_exam_type(f, r):
    return _group_avg("p.exam_type", "p.exam_type",
                      "array_position(ARRAY['Quiz','Test','Mid-Term','End of Term']::varchar[], p.exam_type)", f, r)


def score_histogram(f, r):
    """Count of marks in 10-point bins: index 0 = 0-9 ... index 9 = 90-100."""
    p = SqlParams()
    rows = query(f"SELECT LEAST(9, floor(p.score / 10))::int AS bin, count(*)::int AS n {marks_source(p, f, r)} GROUP BY 1", p.values)
    bins = [0] * 10
    for row in rows:
        bins[row["bin"]] = row["n"]
    return bins


def attendance_by_status(f, r):
    p = SqlParams()
    out = {"present": 0, "late": 0, "absent": 0, "excused": 0}
    for row in query(f"SELECT a.status, count(*)::int AS n {attendance_source(p, f, r)} GROUP BY a.status", p.values):
        out[row["status"]] = row["n"]
    return out


def attendance_by_weekday(f, r):
    p = SqlParams()
    rows = query(f"""
        SELECT extract(isodow FROM a.date)::int AS dow,
               round(100.0 * avg(CASE WHEN a.status IN ('present', 'late') THEN 1 ELSE 0 END), 1)::float AS rate
        {attendance_source(p, f, r)} GROUP BY 1 ORDER BY 1""", p.values)
    names = ["", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    return [{"day": names[row["dow"]], "rate": row["rate"]} for row in rows if row["dow"] <= 5]


def assignment_by_status(f, r):
    p = SqlParams()
    out = {"on_time": 0, "late": 0, "missing": 0}
    for row in query(f"SELECT g.status, count(*)::int AS n {assignment_source(p, f, r)} GROUP BY g.status", p.values):
        out[row["status"]] = row["n"]
    return out


def class_subject_heatmap(f, r):
    p = SqlParams()
    return query(f"""
        SELECT s.class || ' ' || s.stream AS row, p.subject AS col, round(avg(p.score), 1)::float AS value
        {marks_source(p, f, r)} GROUP BY s.class, s.stream, p.subject ORDER BY s.class, s.stream, p.subject""", p.values)


def recent_marks(f, r, limit=10):
    p = SqlParams()
    limit = max(1, min(50, int(limit)))
    return query(f"""
        SELECT to_char(p.created_at, 'YYYY-MM-DD') AS date, p.subject, p.exam_type, p.score::float AS score
        {marks_source(p, f, r)} ORDER BY p.created_at DESC LIMIT {limit}""", p.values)


# ------------------------------------------------------------------ lookup lists

def lookups():
    rng = query("SELECT to_char(min(created_at), 'YYYY-MM-DD') AS min, to_char(max(created_at), 'YYYY-MM-DD') AS max FROM student_performance")
    return {
        "classes": [r["v"] for r in query("SELECT DISTINCT class AS v FROM students WHERE class IS NOT NULL ORDER BY 1")],
        "streams": [r["v"] for r in query("SELECT DISTINCT stream AS v FROM students WHERE stream IS NOT NULL ORDER BY 1")],
        "subjects": [r["v"] for r in query("SELECT DISTINCT subject AS v FROM student_performance WHERE subject IS NOT NULL ORDER BY 1")],
        "examTypes": EXAM_TYPES,
        "teachers": query("SELECT id, fullname AS name, class, stream, subjects FROM teachers ORDER BY class, stream"),
        "students": query("SELECT id, fullname AS name, class, stream FROM students ORDER BY fullname"),
        "dataRange": rng[0] if rng else None,
        "gradeBands": GRADE_BANDS,
        "passMark": PASS_MARK,
    }
