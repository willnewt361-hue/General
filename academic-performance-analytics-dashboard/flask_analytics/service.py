"""
Service layer: combines small queries into the JSON the dashboard renders.
Mirrors src/lib/analytics/service.ts. Endpoint -> function:

    GET /api/analytics/meta           -> get_meta()
    GET /api/analytics/dashboard      -> get_dashboard(filters)
    GET /api/analytics/table          -> get_table(filters)
    GET /api/analytics/student/<id>   -> get_student_detail(id, filters)
"""
from dataclasses import replace

from . import queries as Q
from .filters import DateRange, classmates_of, days_between, previous_range


def _kpi(key, label, value, prev, unit, higher_is_better, hint):
    return {"key": key, "label": label, "value": value, "prev": prev,
            "unit": unit, "higherIsBetter": higher_is_better, "hint": hint}


def _align(series):
    """Put several time series on one shared axis."""
    buckets = sorted({p["bucket"] for points in series.values() for p in points})
    out = {"buckets": buckets}
    for name, points in series.items():
        m = {p["bucket"]: p["value"] for p in points}
        out[name] = [m.get(b) for b in buckets]
    return out


def get_meta():
    return Q.lookups()


def get_dashboard(f):
    rng = DateRange(f.start, f.end)
    prev = previous_range(rng)
    unit = Q.bucket_for(rng)
    is_student = f.role == "student"
    # Students compare with their class; class teachers with the whole school.
    peers = classmates_of(f) if is_student else (replace(f, class_name=None, stream=None) if f.role == "teacher" else None)
    stats_scope = classmates_of(f) if is_student else f

    marks, marks_prev = Q.marks_summary(f, rng), Q.marks_summary(f, prev)
    att, att_prev = Q.attendance_summary(f, rng), Q.attendance_summary(f, prev)
    asg, asg_prev = Q.assignment_summary(f, rng), Q.assignment_summary(f, prev)
    stats, stats_prev = Q.student_stats(stats_scope, rng), Q.student_stats(stats_scope, prev)
    subjects, subjects_prev = Q.by_subject(f, rng), Q.by_subject(f, prev)
    peer_subjects = Q.by_subject(peers, rng) if peers else []
    histogram = Q.score_histogram(f, rng)
    att_status = Q.attendance_by_status(f, rng)
    weekday = Q.attendance_by_weekday(f, rng)
    asg_status = Q.assignment_by_status(f, rng)
    classes = [] if is_student else Q.by_class(f, rng)

    # ---- KPI cards
    at_risk = sum(1 for s in stats if s["status"] == "At risk")
    at_risk_prev = sum(1 for s in stats_prev if s["status"] == "At risk")
    kpis = [
        _kpi("avg", "My average" if is_student else "Average score", marks["avg_score"], marks_prev["avg_score"], "%", True, "Mean of all marks in the period"),
        _kpi("pass", "Pass rate", marks["pass_rate"], marks_prev["pass_rate"], "%", True, f"Share of marks at or above {Q.PASS_MARK}%"),
        _kpi("att", "Attendance", att["rate"], att_prev["rate"], "%", True, "Present or late, out of school days"),
        _kpi("asg", "Assignments done", asg["completion"], asg_prev["completion"], "%", True, "Submitted (on time or late)"),
    ]
    if is_student:
        rank = next((s["rank"] for s in stats if s["id"] == f.student_id), None)
        rank_prev = next((s["rank"] for s in stats_prev if s["id"] == f.student_id), None)
        kpis.append(_kpi("rank", f"Class position /{len(stats)}", rank, rank_prev, "#", False, "Position among classmates by average"))
    else:
        kpis.append(_kpi("risk", "Students at risk", at_risk, at_risk_prev, "", False, "Average below 50% or attendance below 85%"))
    kpis.append(_kpi("dist", "Distinctions (A)", marks["distinction_rate"], marks_prev["distinction_rate"], "%", True, "Share of marks at 80% or above"))

    # ---- Grade distribution derived from the histogram
    grades = [{"grade": b["grade"], "min": b["min"], "n": 0} for b in Q.GRADE_BANDS]
    for i, n in enumerate(histogram):
        g = Q.grade_of(i * 10 + 5)
        next(x for x in grades if x["grade"] == g)["n"] += n

    prev_map = {s["label"]: s["avg"] for s in subjects_prev}
    peer_map = {s["label"]: s["avg"] for s in peer_subjects}
    subject_rows = [{**s, "prev_avg": prev_map.get(s["label"]), "peer_avg": peer_map.get(s["label"])} for s in subjects]

    ranked_risk = sorted([s for s in stats if s["status"] == "At risk"], key=lambda s: s["avg_score"] or 0)
    status_counts = {}
    for s in stats:
        if not is_student or s["id"] == f.student_id:
            status_counts[s["status"]] = status_counts.get(s["status"], 0) + 1

    return {
        "scope": {"role": f.role, "label": f.scope_label, "start": f.start, "end": f.end,
                  "prevStart": prev.start, "prevEnd": prev.end, "unit": unit},
        "peerLabel": "Class average" if is_student else ("School average" if f.role == "teacher" else None),
        "kpis": kpis,
        "trend": _align({
            "score": Q.score_series(f, rng, unit),
            "attendance": Q.attendance_series(f, rng, unit),
            "peer": Q.score_series(peers, rng, unit) if peers else [],
        }),
        "subjects": subject_rows,
        "classes": classes,
        "examTypes": Q.by_exam_type(f, rng),
        "histogram": histogram,
        "grades": grades,
        "attendance": {"status": att_status, "weekday": weekday},
        "assignments": asg_status,
        "heatmap": [] if is_student else Q.class_subject_heatmap(f, rng),
        "recent": Q.recent_marks(f, rng, 8) if is_student else [],
        "top": [] if is_student else [s for s in stats if s["avg_score"] is not None][:5],
        "atRisk": [] if is_student else ranked_risk[:8],
        "statusCounts": status_counts,
        "insights": _insights(f, subject_rows, classes, weekday, asg_status, at_risk, at_risk_prev, att["rate"]),
    }


def _insights(f, subjects, classes, weekday, asg, at_risk, at_risk_prev, att_rate):
    """Plain-language findings so non-technical users get the story at a glance."""
    out = []
    you = f.role == "student"
    subs = [s for s in subjects if s["avg"] is not None]
    if len(subs) > 1:
        best = max(subs, key=lambda s: s["avg"])
        worst = min(subs, key=lambda s: s["avg"])
        out.append({"tone": "good", "text": f"{'Your strongest' if you else 'Strongest'} subject is {best['label']} at {best['avg']}% average."})
        if worst["label"] != best["label"]:
            out.append({"tone": "bad", "text": f"{worst['label']} needs attention - {worst['avg']}% average, {worst['pass_rate']}% pass rate."})
        moves = [(s, s["avg"] - s["prev_avg"]) for s in subs if s["prev_avg"] is not None]
        if moves:
            up = max(moves, key=lambda m: m[1])
            down = min(moves, key=lambda m: m[1])
            if up[1] > 0.5:
                out.append({"tone": "good", "text": f"{up[0]['label']} improved the most: +{up[1]:.1f} pts vs previous period."})
            if down[1] < -0.5:
                out.append({"tone": "bad", "text": f"{down[0]['label']} dropped {abs(down[1]):.1f} pts vs previous period."})
        if you:
            gaps = sorted([(s, s["avg"] - s["peer_avg"]) for s in subs if s["peer_avg"] is not None and s["avg"] < s["peer_avg"]], key=lambda g: g[1])
            if gaps:
                out.append({"tone": "info", "text": f"You are {abs(gaps[0][1]):.1f} pts below the class average in {gaps[0][0]['label']} - a good focus area."})
    if len(classes) > 1:
        top = max(classes, key=lambda c: c["avg"] or 0)
        out.append({"tone": "info", "text": f"Top performing class: {top['label']} ({top['avg']}% average)."})
    wd = [w for w in weekday if w["rate"] is not None]
    if wd:
        low = min(wd, key=lambda w: w["rate"])
        full = {"Mon": "Monday", "Tue": "Tuesday", "Wed": "Wednesday", "Thu": "Thursday", "Fri": "Friday"}
        out.append({"tone": "info", "text": f"Attendance is lowest on {full.get(low['day'], low['day'])}s ({low['rate']}%)."})
    total = asg["on_time"] + asg["late"] + asg["missing"]
    if total:
        missing = 100 * asg["missing"] / total
        out.append({"tone": "bad" if missing > 8 else "good", "text": f"{missing:.1f}% of assignments were not submitted."})
    if not you:
        d = at_risk - at_risk_prev
        out.append({"tone": "bad" if d > 0 else "good",
                    "text": f"{at_risk} student{'' if at_risk == 1 else 's'} at risk ({'+' if d > 0 else ''}{d} vs previous period)."})
    elif att_rate is not None:
        out.append({"tone": "good" if att_rate >= 90 else "bad",
                    "text": f"Your attendance is {att_rate}% - {'great, keep it up!' if att_rate >= 90 else 'aim for at least 90%.'}"})
    return out


def get_table(f):
    """Rows for the data table: students (head / teacher) or subjects (student)."""
    rng = DateRange(f.start, f.end)
    if f.role == "student":
        mine, peers = Q.by_subject(f, rng), Q.by_subject(classmates_of(f), rng)
        marks = Q.recent_marks(f, rng, 50)
        peer_map = {p["label"]: p["avg"] for p in peers}
        rows = []
        for s in mine:
            lst = [m for m in marks if m["subject"] == s["label"]]
            latest = lst[0]["score"] if lst else None
            oldest = lst[-1]["score"] if lst else None
            peer = peer_map.get(s["label"])
            rows.append({
                "id": s["label"], "subject": s["label"], "avg_score": s["avg"], "class_avg": peer,
                "vs_class": round(s["avg"] - peer, 1) if s["avg"] is not None and peer is not None else None,
                "latest": latest,
                "trend": round(latest - oldest, 1) if latest is not None and oldest is not None and len(lst) > 1 else None,
                "assessments": s["n"], "grade": Q.grade_of(s["avg"]),
            })
        return {"kind": "subjects", "rows": rows, "columns": [
            {"key": "subject", "label": "Subject", "type": "text"},
            {"key": "avg_score", "label": "My avg", "type": "pct"},
            {"key": "class_avg", "label": "Class avg", "type": "pct"},
            {"key": "vs_class", "label": "vs Class", "type": "delta"},
            {"key": "latest", "label": "Latest", "type": "pct"},
            {"key": "trend", "label": "Trend", "type": "delta"},
            {"key": "assessments", "label": "Marks", "type": "num"},
            {"key": "grade", "label": "Grade", "type": "grade"},
        ]}
    rows = [{**s, "class_label": f"{s['class']} {s['stream']}"} for s in Q.student_stats(f, rng)]
    return {"kind": "students", "rows": rows, "columns": [
        {"key": "rank", "label": "#", "type": "num"},
        {"key": "name", "label": "Student", "type": "text"},
        {"key": "class_label", "label": "Class", "type": "text"},
        {"key": "gender", "label": "Sex", "type": "text"},
        {"key": "avg_score", "label": "Average", "type": "pct"},
        {"key": "grade", "label": "Grade", "type": "grade"},
        {"key": "trend", "label": "Trend", "type": "delta"},
        {"key": "attendance", "label": "Attendance", "type": "pct"},
        {"key": "completion", "label": "Assignments", "type": "pct"},
        {"key": "status", "label": "Status", "type": "status"},
    ]}


def get_student_detail(student_id, base):
    """Everything for the student profile pop-up."""
    rng = DateRange(base.start, base.end)
    meta = Q.lookups()
    student = next((s for s in meta["students"] if s["id"] == student_id), None)
    if not student:
        return None
    me = replace(base, role="student", student_id=student_id, gender=None, class_name=student["class"], stream=student["stream"])
    peers = classmates_of(me)
    unit = Q.bucket_for(rng)
    marks, att, asg = Q.marks_summary(me, rng), Q.attendance_summary(me, rng), Q.assignment_summary(me, rng)
    class_stats = Q.student_stats(peers, rng)
    mine = next((s for s in class_stats if s["id"] == student_id), None)
    class_map = {s["label"]: s["avg"] for s in Q.by_subject(peers, rng)}
    return {
        "student": {**student, "status": mine["status"] if mine else "No data",
                    "rank": mine["rank"] if mine else None, "classSize": len(class_stats)},
        "summary": {"avg": marks["avg_score"], "pass": marks["pass_rate"], "attendance": att["rate"],
                    "absences": att["absences"], "completion": asg["completion"], "grade": Q.grade_of(marks["avg_score"])},
        "trend": _align({"score": Q.score_series(me, rng, unit), "peer": Q.score_series(peers, rng, unit)}),
        "subjects": [{"label": s["label"], "avg": s["avg"], "peer_avg": class_map.get(s["label"])} for s in Q.by_subject(me, rng)],
        "recent": Q.recent_marks(me, rng, 6),
    }
