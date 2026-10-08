"""
Filters = everything picked in the dashboard filter bar.
Every query receives the same Filters object, so all charts agree.
Mirrors src/lib/analytics/filters.ts.
"""
import re
from dataclasses import dataclass, replace
from datetime import date, timedelta

from .db import query

DATE_RE = re.compile(r"^\d{4}-\d{2}-\d{2}$")


@dataclass
class Filters:
    role: str = "head"            # head | teacher | student
    start: str = ""               # YYYY-MM-DD inclusive
    end: str = ""                 # YYYY-MM-DD inclusive
    class_name: str = None        # e.g. "S3"
    stream: str = None            # e.g. "A"
    subject: str = None
    gender: str = None            # "M" | "F"
    exam_type: str = None
    student_id: str = None
    teacher_id: str = None
    scope_label: str = "Whole school"


@dataclass
class DateRange:
    start: str
    end: str


def to_date(iso):
    return date.fromisoformat(iso)


def add_days(iso, days):
    return (to_date(iso) + timedelta(days=days)).isoformat()


def days_between(start, end):
    return (to_date(end) - to_date(start)).days + 1


def previous_range(r):
    """The period of equal length right before the selected one (for trend arrows)."""
    length = days_between(r.start, r.end)
    end = add_days(r.start, -1)
    return DateRange(add_days(end, -(length - 1)), end)


def _clean(v):
    if not v or v == "all":
        return None
    return str(v)[:100]


def parse_filters(args):
    """Build Filters from request.args (?start=..&end=..&class=..)."""
    today = date.today().isoformat()
    end = args.get("end", "")
    start = args.get("start", "")
    if not DATE_RE.match(end):
        end = today
    if not DATE_RE.match(start):
        start = add_days(end, -89)
    if start > end:
        start, end = end, start

    role = args.get("role")
    role = role if role in ("teacher", "student") else "head"
    return Filters(
        role=role,
        start=start,
        end=end,
        class_name=_clean(args.get("class")),
        stream=_clean(args.get("stream")),
        subject=_clean(args.get("subject")),
        gender=_clean(args.get("gender")),
        exam_type=_clean(args.get("exam_type")),
        student_id=_clean(args.get("student_id")) if role == "student" else None,
        teacher_id=_clean(args.get("teacher_id")) if role == "teacher" else None,
    )


def apply_role_scope(f):
    """Lock filters to what the viewer may see (teacher -> own class, student -> self)."""
    if f.role == "teacher" and f.teacher_id:
        rows = query("SELECT fullname, class, stream FROM teachers WHERE id = %(id)s", {"id": f.teacher_id})
        if rows:
            t = rows[0]
            return replace(f, class_name=t["class"], stream=t["stream"],
                           scope_label=f"{t['class']} {t['stream']} · {t['fullname']}")
    if f.role == "student" and f.student_id:
        rows = query("SELECT fullname, class, stream FROM students WHERE id = %(id)s", {"id": f.student_id})
        if rows:
            s = rows[0]
            return replace(f, class_name=s["class"], stream=s["stream"], gender=None,
                           scope_label=f"{s['fullname']} · {s['class']} {s['stream']}")
    label = f"{f.class_name}{' ' + f.stream if f.stream else ''}" if f.class_name else "Whole school"
    return replace(f, scope_label=label)


def classmates_of(f):
    """Same scope minus the student (for 'vs class average')."""
    return replace(f, student_id=None)


class SqlParams:
    """Collects named placeholders %(p1)s, %(p2)s ... so queries stay injection-safe."""

    def __init__(self):
        self.values = {}

    def add(self, value):
        key = f"p{len(self.values) + 1}"
        self.values[key] = value
        return f"%({key})s"


def student_conditions(p, f):
    c = []
    if f.student_id:
        c.append(f"s.id = {p.add(f.student_id)}")
    if f.class_name:
        c.append(f"s.class = {p.add(f.class_name)}")
    if f.stream:
        c.append(f"s.stream = {p.add(f.stream)}")
    if f.gender:
        c.append(f"s.gender = {p.add(f.gender)}")
    return c


def marks_source(p, f, r):
    c = [f"p.created_at >= {p.add(r.start)}::date", f"p.created_at < {p.add(r.end)}::date + 1", *student_conditions(p, f)]
    if f.subject:
        c.append(f"p.subject = {p.add(f.subject)}")
    if f.exam_type:
        c.append(f"p.exam_type = {p.add(f.exam_type)}")
    return "FROM student_performance p JOIN students s ON s.id = p.student_id WHERE " + " AND ".join(c)


def attendance_source(p, f, r):
    c = [f"a.date >= {p.add(r.start)}::date", f"a.date <= {p.add(r.end)}::date", *student_conditions(p, f)]
    return "FROM attendance a JOIN students s ON s.id = a.student_id WHERE " + " AND ".join(c)


def assignment_source(p, f, r):
    c = [f"g.due_date >= {p.add(r.start)}::date", f"g.due_date <= {p.add(r.end)}::date", *student_conditions(p, f)]
    if f.subject:
        c.append(f"g.subject = {p.add(f.subject)}")
    return "FROM assignment_submissions g JOIN students s ON s.id = g.student_id WHERE " + " AND ".join(c)
