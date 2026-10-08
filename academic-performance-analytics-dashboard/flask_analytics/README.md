# MHS Analytics – Flask integration guide

A plug-in academic analytics dashboard for the **Mengo Hub System**. It is aimed at
**Head Teachers**, **Class Teachers** and **Students**.

* Frontend: plain **HTML + CSS + JavaScript** (Chart.js is bundled locally, so it works offline)
* Backend: **Python / Flask Blueprint + psycopg2 + PostgreSQL** (the same stack MHS uses)
* The same files also run in the Next.js preview. Both backends return identical JSON.

---

## 1. What you get

| View (keys 1–5) | Head / Class teacher | Student |
|---|---|---|
| **Overview** | 6 KPI cards with trend arrows, trend line (score + attendance), grade donut, top 3 insights | Same, plus "Class position" KPI and "vs class average" line |
| **Academics** | Subject bars, score histogram, assessment-type mix chart, class × subject heatmap | Subject bars vs class, recent marks |
| **Attendance** | Attendance trend vs 90% target, status donut, weekday bars, assignment donut | Same (personal) |
| **Students / My Subjects** | Sortable, searchable table with status chips, grade filter, paging, CSV export, click → profile | Per-subject table: my avg vs class avg, latest mark, trend |
| **Insights** | Auto insights, at-risk list, top performers, class ranking | Auto insights, "Me vs class" radar, grade goals |

Extras: live refresh (every 30s), dark mode (`D` key), print / save as PDF, student profile
pop-up, date presets (7D, 30D, 90D, **Term** based on the Ugandan calendar, YTD, 12M), filters
remembered between visits, and a fully responsive mobile layout.

---

## 2. Files

```
analytics_sql/
  schema.sql          <- creates / extends tables (safe to re-run)
  seed.sql            <- realistic SAMPLE data (demo only)
public/dashboard/     <- the dashboard UI (copy into flask_analytics/static/)
  index.html  styles.css  app.js  config.js  vendor/chart.umd.min.js
flask_analytics/
  __init__.py         <- init_analytics(app)
  routes.py           <- Blueprint: /analytics/ page + /api/analytics/* JSON
  service.py          <- builds each JSON response (KPIs, insights, table ...)
  queries.py          <- one SQL query per function
  filters.py          <- request args -> Filters, role scoping, safe SQL params
  bootstrap.py        <- runs schema.sql (and seed.sql only if tables are empty)
  db.py               <- psycopg2 connection pool
  example_app.py      <- run the dashboard standalone
```

---

## 3. Add it to your MHS project (5 steps)

1. **Copy files** into your MHS repo root:
   ```
   flask_analytics/                 (whole folder)
   flask_analytics/sql/             <- copy analytics_sql/*.sql here
   flask_analytics/static/          <- copy public/dashboard/* here
   ```
2. **Install** (MHS already has these): `pip install flask psycopg2-binary`
3. **Register** in `flask_app.py`:
   ```python
   from flask_analytics import init_analytics
   init_analytics(app)     # -> http://your-server/analytics/
   ```
4. **Database**: set `DATABASE_URL` (MHS already uses it). On first request the blueprint
   runs `schema.sql`, which only **adds** what is missing:
   * `students.gender`, `student_performance.exam_type`
   * new tables `attendance` and `assignment_submissions`

   In production set `ANALYTICS_SEED_SAMPLE_DATA=0` so demo data is never inserted.
5. **Lock the view to the logged-in user** (recommended). Without this, anyone can switch
   roles in the dropdown (demo mode):
   ```python
   from flask import session

   def analytics_scope():
       if session.get("is_admin"):
           return "head", None
       if session.get("user_type") == "teacher":
           return "teacher", session.get("user_id")
       return "student", session.get("user_id")

   app.config["ANALYTICS_SCOPE_RESOLVER"] = analytics_scope
   ```
   Then edit `static/config.js` (or render it from a template) so the dropdown is hidden:
   ```js
   window.MHS_ANALYTICS_CONFIG = { apiBase: "/api/analytics", role: "student", personId: "STU0007", lockRole: true };
   ```

---

## 4. Feeding real data

The dashboard reads 5 tables. Keep writing to them from your existing MHS features:

| Table | Write a row when… | Key columns |
|---|---|---|
| `students` | a student is registered | `id, fullname, class, stream, gender` |
| `teachers` | a teacher is registered (class teacher = `class` + `stream`) | `id, fullname, class, stream` |
| `student_performance` | a mark is recorded | `student_id, subject, score (0-100), exam_type, created_at` |
| `attendance` | the register is taken | `student_id, date, status` (`present / late / absent / excused`) |
| `assignment_submissions` | an assignment is due | `student_id, subject, due_date, status` (`on_time / late / missing`) |

Example, saving a mark from your assessment service:
```python
cur.execute(
    "INSERT INTO student_performance (student_id, subject, score, exam_type) VALUES (%s, %s, %s, %s)",
    (student_id, "Mathematics", 74.5, "Mid-Term"),
)
```

---

## 5. API reference (all GET, JSON)

Common query parameters: `start`, `end` (YYYY-MM-DD), `class`, `stream`, `subject`, `gender`
(`M`/`F`), `exam_type`, `role` (`head`/`teacher`/`student`), `teacher_id`, `student_id`.

| Endpoint | Returns |
|---|---|
| `/api/analytics/meta` | classes, streams, subjects, exam types, teachers, students, grade bands |
| `/api/analytics/dashboard` | `kpis[]` (value + previous period), `trend`, `subjects`, `classes`, `grades`, `histogram`, `examTypes`, `attendance`, `assignments`, `heatmap`, `top`, `atRisk`, `insights` |
| `/api/analytics/table` | `{kind, columns[], rows[]}`: students (staff) or subjects (student) |
| `/api/analytics/student/<id>` | profile, summary, trend vs class, subjects vs class, recent marks |

---

## 6. Customising

* **Grading / pass mark**: `GRADE_BANDS` and `PASS_MARK` in `queries.py`. The UI reads them from `/meta`.
* **At-risk rules**: `status_of()` in `queries.py`.
* **Insight sentences**: `_insights()` in `service.py`.
* **Colours / fonts**: CSS variables at the top of `styles.css` (light and dark).
* **Refresh interval**: `liveRefreshMs` in `config.js`.

Run standalone to test: `python -m flask_analytics.example_app`, then open http://127.0.0.1:5000/analytics/
