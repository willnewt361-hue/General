import { motion } from "framer-motion";
import {
  AlertTriangle, BarChart3, BookOpen, CheckCircle2, ClipboardList, Download, FileText, Plus,
  Sparkles, Target, Trash2, TrendingUp, Users,
} from "lucide-react";
import { Fragment, useMemo, useState } from "react";
import { cn } from "../../utils/cn";
import { useRouter } from "../../router";
import { SUBJECTS, getSubject, getTopic } from "../../data/curriculum";
import { byTopic, gradeFor } from "../../data/questions";
import { useApp, useClassAnalytics } from "../../lib/store";
import { Avatar, Badge, Btn, Card, CardHead, Empty, Field, Modal, PageTitle, Progress, Sparkline, Stat, ago, fmtDate, inputCls } from "../Kit";

/* ============================ TEACHER DASHBOARD ============================ */
export function TeacherDashboard() {
  const { user, state } = useApp();
  const { navigate } = useRouter();
  const analytics = useClassAnalytics(user?.subjects?.[0]);
  if (!user) return null;

  const students = state.users.filter((u) => u.role === "student");
  const myAssignments = state.assignments.filter((a) => a.teacherId === user.id);
  const submissions = state.attempts.filter((a) => myAssignments.some((x) => x.id === a.assignmentId));
  const allAvg = state.attempts.length ? Math.round(state.attempts.reduce((s, a) => s + a.percent, 0) / state.attempts.length) : 0;
  const trend = useMemo(() => {
    const buckets: number[] = [];
    for (let w = 7; w >= 0; w--) {
      const from = Date.now() - (w + 1) * 7 * 86_400_000;
      const to = Date.now() - w * 7 * 86_400_000;
      const rel = state.attempts.filter((a) => a.at >= from && a.at < to);
      buckets.push(rel.length ? Math.round(rel.reduce((s, a) => s + a.percent, 0) / rel.length) : buckets[buckets.length - 1] ?? 55);
    }
    return buckets;
  }, [state.attempts]);

  const hour = new Date().getHours();
  return (
    <div>
      <PageTitle title={`${hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening"}, ${user.name.split(" ")[0]}`} subtitle="Here's how your classes are performing today." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Students" value={students.length} sub={`${analytics.classes.length} classes`} icon={<Users className="h-5 w-5" />} />
        <Stat label="Class average" value={`${allAvg}%`} sub={gradeFor(allAvg).label} icon={<TrendingUp className="h-5 w-5" />} tone="mint" />
        <Stat label="Assignments set" value={myAssignments.length} sub={`${submissions.length} submissions`} icon={<ClipboardList className="h-5 w-5" />} tone="violet" />
        <Stat label="Need support" value={analytics.atRisk.length} sub="below 55% average" icon={<AlertTriangle className="h-5 w-5" />} tone="amber" />
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHead title="Cohort performance" subtitle="Weekly average across all assessments" action={<Badge tone="mint">+{Math.max(0, trend[trend.length - 1] - trend[0])}% over 8 weeks</Badge>} />
          <div className="p-5"><Sparkline data={trend} className="h-36" tone="#10b981" /></div>
        </Card>
        <Card>
          <CardHead title="Students needing support" subtitle="Reach out this week" icon={<AlertTriangle className="h-4 w-4 text-amber-500" />} />
          <div className="divide-y divide-slate-50">
            {analytics.atRisk.slice(0, 5).map((r) => (
              <div key={r.user.id} className="flex items-center gap-3 px-5 py-3">
                <Avatar name={r.user.name} hue={r.user.hue} size={34} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-semibold text-slate-900">{r.user.name}</p>
                  <p className="text-xs text-slate-500">{r.user.className}</p>
                </div>
                <span className="font-display text-sm font-bold text-rose-600">{r.avg}%</span>
              </div>
            ))}
            {!analytics.atRisk.length && <p className="px-5 py-8 text-center text-sm text-slate-400">Everyone is above 55%. 🎉</p>}
          </div>
        </Card>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <Card>
          <CardHead title="Recent submissions" subtitle="Auto-marked the moment students submit" action={<button onClick={() => navigate("app/gradebook")} className="text-xs font-semibold text-brand-600">Gradebook →</button>} />
          <div className="divide-y divide-slate-50">
            {[...state.attempts].sort((a, b) => b.at - a.at).slice(0, 6).map((a) => {
              const st = state.users.find((u) => u.id === a.userId);
              const g = gradeFor(a.percent);
              return (
                <div key={a.id} className="flex items-center gap-3 px-5 py-3">
                  {st && <Avatar name={st.name} hue={st.hue} size={30} />}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-medium text-slate-900">{st?.name}</p>
                    <p className="truncate text-xs text-slate-500">{a.title} · {ago(a.at)}</p>
                  </div>
                  <span className={cn("rounded-full border px-2 py-0.5 text-[11px] font-bold", g.tone)}>{g.grade}</span>
                  <span className="w-10 text-right text-sm font-bold tabular-nums text-slate-900">{a.percent}%</span>
                </div>
              );
            })}
          </div>
        </Card>

        <Card>
          <CardHead title="Quick actions" subtitle="The things you do most" />
          <div className="grid gap-3 p-5 sm:grid-cols-2">
            {[
              { l: "Set assignment", i: Plus, to: "app/manage-assignments" },
              { l: "View analytics", i: BarChart3, to: "app/analytics" },
              { l: "Open gradebook", i: FileText, to: "app/gradebook" },
              { l: "Post announcement", i: Sparkles, to: "app/announcements" },
            ].map((a) => (
              <button key={a.l} onClick={() => navigate(a.to)} className="flex items-center gap-3 rounded-xl border border-slate-200 p-4 text-left transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-md">
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-50 text-brand-600"><a.i className="h-4 w-4" /></span>
                <span className="text-[13.5px] font-semibold text-slate-800">{a.l}</span>
              </button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ============================ CLASSES ============================ */
export function Classes() {
  const { state } = useApp();
  const [cls, setCls] = useState<string | null>(null);
  const classes = Array.from(new Set(state.users.filter((u) => u.role === "student").map((u) => u.className!).filter(Boolean)));

  const students = state.users.filter((u) => u.role === "student" && (!cls || u.className === cls));

  return (
    <div>
      <PageTitle title="My Classes" subtitle="Every learner you teach, with live performance data." />
      <div className="mb-5 flex flex-wrap gap-2">
        <button onClick={() => setCls(null)} className={cn("rounded-xl border px-3.5 py-2 text-[13px] font-semibold transition", !cls ? "border-brand-500 bg-brand-50 text-brand-700" : "border-slate-200 bg-white text-slate-600")}>
          All ({state.users.filter((u) => u.role === "student").length})
        </button>
        {classes.map((c) => (
          <button key={c} onClick={() => setCls(c)} className={cn("rounded-xl border px-3.5 py-2 text-[13px] font-semibold transition", cls === c ? "border-brand-500 bg-brand-50 text-brand-700" : "border-slate-200 bg-white text-slate-600")}>
            {c} ({state.users.filter((u) => u.className === c).length})
          </button>
        ))}
      </div>

      <Card>
        <CardHead title={cls ?? "All students"} subtitle={`${students.length} learners`} action={<Btn size="sm" variant="ghost" icon={<Download className="h-3.5 w-3.5" />} onClick={() => {
          const rows = ["Name,Class,Average,Assessments", ...students.map((s) => {
            const at = state.attempts.filter((a) => a.userId === s.id);
            const avg = at.length ? Math.round(at.reduce((x, a) => x + a.percent, 0) / at.length) : 0;
            return `${s.name},${s.className},${avg},${at.length}`;
          })].join("\n");
          const url = URL.createObjectURL(new Blob([rows], { type: "text/csv" }));
          const a = document.createElement("a");
          a.href = url; a.download = `${cls ?? "all-students"}.csv`; a.click();
        }}>Export CSV</Btn>} />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-5 py-3 font-semibold">Student</th>
                <th className="px-5 py-3 font-semibold">Class</th>
                <th className="px-5 py-3 font-semibold">Average</th>
                <th className="px-5 py-3 font-semibold">Grade</th>
                <th className="px-5 py-3 font-semibold">Assessments</th>
                <th className="px-5 py-3 font-semibold">Last active</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students.map((s) => {
                const at = state.attempts.filter((a) => a.userId === s.id);
                const avg = at.length ? Math.round(at.reduce((x, a) => x + a.percent, 0) / at.length) : 0;
                const g = gradeFor(avg);
                const last = at.length ? Math.max(...at.map((a) => a.at)) : 0;
                return (
                  <tr key={s.id} className="transition hover:bg-slate-50">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <Avatar name={s.name} hue={s.hue} size={32} />
                        <div>
                          <p className="font-medium text-slate-900">{s.name}</p>
                          <p className="text-xs text-slate-400">{s.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-slate-600">{s.className}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <Progress value={avg} className="h-1.5 w-20" tone={avg >= 70 ? "mint" : avg >= 50 ? "brand" : "rose"} />
                        <span className="font-semibold tabular-nums text-slate-900">{avg}%</span>
                      </div>
                    </td>
                    <td className="px-5 py-3"><span className={cn("rounded-full border px-2 py-0.5 text-[11px] font-bold", g.tone)}>{at.length ? g.grade : "—"}</span></td>
                    <td className="px-5 py-3 text-slate-600">{at.length}</td>
                    <td className="px-5 py-3 text-slate-500">{last ? ago(last) : "Never"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

/* ============================ GRADEBOOK ============================ */
export function Gradebook() {
  const { state } = useApp();
  const [subject, setSubject] = useState("math");
  const students = state.users.filter((u) => u.role === "student");
  const assignments = state.assignments.filter((a) => a.subjectId === subject);

  return (
    <div>
      <PageTitle title="Gradebook" subtitle="Every mark, auto-computed. Export to CSV for your records." />
      <div className="mb-5 flex flex-wrap gap-2">
        {SUBJECTS.map((s) => (
          <button key={s.id} onClick={() => setSubject(s.id)} className={cn("rounded-xl border px-3.5 py-2 text-[13px] font-semibold transition", subject === s.id ? "border-brand-500 bg-brand-50 text-brand-700" : "border-slate-200 bg-white text-slate-600")}>
            {s.emoji} {s.name}
          </button>
        ))}
      </div>

      <Card>
        <CardHead title={`${getSubject(subject)?.name} gradebook`} subtitle={`${students.length} students × ${assignments.length} assignments`} />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="sticky left-0 z-10 bg-slate-50 px-5 py-3 font-semibold">Student</th>
                {assignments.map((a) => (
                  <th key={a.id} className="px-4 py-3 text-center font-semibold">
                    <span className="block max-w-[100px] truncate" title={a.title}>{a.title}</span>
                  </th>
                ))}
                <th className="px-5 py-3 text-center font-semibold">Subject avg</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students.map((s) => {
                const subjectAttempts = state.attempts.filter((a) => a.userId === s.id && a.subjectId === subject);
                const avg = subjectAttempts.length ? Math.round(subjectAttempts.reduce((x, a) => x + a.percent, 0) / subjectAttempts.length) : 0;
                return (
                  <tr key={s.id} className="transition hover:bg-slate-50">
                    <td className="sticky left-0 z-10 bg-white px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <Avatar name={s.name} hue={s.hue} size={28} />
                        <span className="whitespace-nowrap font-medium text-slate-900">{s.name}</span>
                      </div>
                    </td>
                    {assignments.map((a) => {
                      const sub = state.attempts.find((x) => x.userId === s.id && x.assignmentId === a.id);
                      return (
                        <td key={a.id} className="px-4 py-3 text-center">
                          {sub ? (
                            <span className={cn("inline-block rounded-lg px-2 py-1 text-xs font-bold", sub.percent >= 70 ? "bg-mint-500/15 text-mint-700" : sub.percent >= 50 ? "bg-amber-50 text-amber-700" : "bg-rose-50 text-rose-700")}>
                              {sub.percent}%
                            </span>
                          ) : (
                            <span className="text-xs text-slate-300">—</span>
                          )}
                        </td>
                      );
                    })}
                    <td className="px-5 py-3 text-center font-bold tabular-nums text-slate-900">{avg ? `${avg}%` : "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {!assignments.length && <Empty icon={<FileText className="h-6 w-6" />} title="No assignments in this subject" body="Create one from the Assignments page and results will appear here." />}
      </Card>
    </div>
  );
}

/* ============================ CLASS ANALYTICS ============================ */
export function Analytics() {
  const [subject, setSubject] = useState("math");
  const { grid, atRisk, subject: subj } = useClassAnalytics(subject);
  const { state } = useApp();

  const color = (v: number | null) => {
    if (v === null) return "bg-slate-100 text-slate-400";
    if (v >= 80) return "bg-mint-500 text-white";
    if (v >= 65) return "bg-mint-400/80 text-white";
    if (v >= 50) return "bg-amber-300 text-amber-900";
    return "bg-rose-400 text-white";
  };

  const weakest = useMemo(() => {
    const flat = grid.flatMap((r) => r.cells.filter((c) => c.value !== null).map((c) => ({ cls: r.cls, ...c })));
    return flat.sort((a, b) => (a.value ?? 0) - (b.value ?? 0)).slice(0, 4);
  }, [grid]);

  return (
    <div>
      <PageTitle title="Class Analytics" subtitle="Topic mastery heatmaps, at-risk alerts and AI teaching suggestions." />
      <div className="mb-5 flex flex-wrap gap-2">
        {SUBJECTS.map((s) => (
          <button key={s.id} onClick={() => setSubject(s.id)} className={cn("rounded-xl border px-3.5 py-2 text-[13px] font-semibold transition", subject === s.id ? "border-brand-500 bg-brand-50 text-brand-700" : "border-slate-200 bg-white text-slate-600")}>
            {s.emoji} {s.name}
          </button>
        ))}
      </div>

      <Card className="mb-5">
        <CardHead title={`Topic mastery — ${subj.name}`} subtitle="Average score per class per topic. Red means re-teach." icon={<Target className="h-4 w-4 text-brand-500" />} />
        <div className="overflow-x-auto p-5">
          <div className="min-w-[640px]">
            <div className="grid gap-1.5" style={{ gridTemplateColumns: `140px repeat(${subj.topics.length}, minmax(0,1fr))` }}>
              <span />
              {subj.topics.map((t) => (
                <span key={t.id} className="px-1 text-center text-[10px] font-medium leading-tight text-slate-500" title={t.title}>
                  {t.title.split(" ").slice(0, 2).join(" ")}
                </span>
              ))}
              {grid.map((row, ri) => (
                <Fragment key={row.cls}>
                  <span className="flex items-center pr-2 text-right text-xs font-semibold text-slate-700">{row.cls}</span>
                  {row.cells.map((c, ci) => (
                    <motion.span
                      key={`${ri}-${ci}`}
                      initial={{ opacity: 0, scale: 0.7 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: (ri * subj.topics.length + ci) * 0.02 }}
                      className={cn("grid aspect-square place-items-center rounded-md text-[11px] font-bold", color(c.value))}
                      title={`${row.cls} · ${c.topic.title}: ${c.value ?? "no data"}`}
                    >
                      {c.value ?? "–"}
                    </motion.span>
                  ))}
                </Fragment>
              ))}
            </div>
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-4 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-mint-500" /> 80%+ mastered</span>
            <span className="inline-flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-mint-400/80" /> 65–79% secure</span>
            <span className="inline-flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-amber-300" /> 50–64% fragile</span>
            <span className="inline-flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-rose-400" /> under 50% re-teach</span>
          </div>
        </div>
      </Card>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardHead title="AI teaching suggestions" subtitle="Generated from the heatmap" icon={<Sparkles className="h-4 w-4 text-brand-500" />} />
          <div className="space-y-3 p-5">
            {weakest.map((w, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }} className="rounded-xl border border-brand-100 bg-brand-50/60 p-4">
                <p className="text-sm font-semibold text-slate-900">{w.cls} · {w.topic.title}</p>
                <p className="mt-1 text-[13px] leading-relaxed text-slate-600">
                  Averaging <b>{w.value}%</b>. Suggested action: re-teach using the {w.topic.sims?.length ? `${w.topic.sims[0].provider} “${w.topic.sims[0].title}” simulation` : "worked examples in the notes"}, then set a {byTopic(w.topic.id).length}-question check-up.
                </p>
                <p className="mt-2 text-xs text-brand-700">Key tip: {w.topic.examTips[0]}</p>
              </motion.div>
            ))}
            {!weakest.length && <Empty title="Not enough data" body="Once students complete assessments, suggestions appear here." />}
          </div>
        </Card>

        <Card>
          <CardHead title="At-risk learners" subtitle={`${atRisk.length} students below 55%`} icon={<AlertTriangle className="h-4 w-4 text-rose-500" />} />
          <div className="divide-y divide-slate-50">
            {atRisk.map((r) => (
              <div key={r.user.id} className="flex items-center gap-3 px-5 py-3.5">
                <Avatar name={r.user.name} hue={r.user.hue} size={34} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-900">{r.user.name}</p>
                  <p className="text-xs text-slate-500">{r.user.className} · {r.attempts} assessments</p>
                </div>
                <Progress value={r.avg} className="h-1.5 w-16" tone="rose" />
                <span className="w-10 text-right font-bold text-rose-600">{r.avg}%</span>
              </div>
            ))}
            {!atRisk.length && <p className="px-5 py-10 text-center text-sm text-slate-400">No learners currently at risk. 🎉</p>}
          </div>
        </Card>
      </div>

      <Card className="mt-5">
        <CardHead title="Engagement overview" subtitle="Platform activity across the school" />
        <div className="grid gap-4 p-5 sm:grid-cols-4">
          {[
            { l: "Total assessments", v: state.attempts.length },
            { l: "Topics read", v: Object.values(state.progress).reduce((s, p) => s + p.topicsRead.length, 0) },
            { l: "Chat messages", v: state.messages.length },
            { l: "Active streaks", v: Object.values(state.progress).filter((p) => p.streak > 0).length },
          ].map((s) => (
            <div key={s.l} className="rounded-xl bg-slate-50 p-4 text-center">
              <p className="font-display text-2xl font-bold text-slate-900">{s.v}</p>
              <p className="mt-0.5 text-xs text-slate-500">{s.l}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* ============================ MANAGE ASSIGNMENTS ============================ */
export function ManageAssignments() {
  const { state, user, addAssignment, removeAssignment } = useApp();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [subjectId, setSubjectId] = useState("math");
  const [topicId, setTopicId] = useState("math-quadratics");
  const [classes, setClasses] = useState<string[]>(["S.4 East"]);
  const [days, setDays] = useState(5);
  const [duration, setDuration] = useState(30);
  const [instructions, setInstructions] = useState("Answer all questions. Show your working where required.");
  if (!user) return null;

  const allClasses = Array.from(new Set(state.users.filter((u) => u.role === "student").map((u) => u.className!).filter(Boolean)));
  const mine = state.assignments.filter((a) => a.teacherId === user.id);
  const topics = getSubject(subjectId)?.topics ?? [];
  const questionCount = byTopic(topicId).length;

  const create = () => {
    addAssignment({
      title: title.trim(),
      subjectId,
      topicIds: [topicId],
      questionIds: byTopic(topicId).map((q) => q.id),
      classes,
      dueAt: Date.now() + days * 86_400_000,
      durationMin: duration,
      published: true,
      instructions,
    });
    setTitle("");
    setOpen(false);
  };

  return (
    <div>
      <PageTitle title="Assignments" subtitle="Create auto-marked work in under a minute." action={<Btn onClick={() => setOpen(true)} icon={<Plus className="h-4 w-4" />}>New assignment</Btn>} />

      <div className="grid gap-4 lg:grid-cols-2">
        {mine.map((a, i) => {
          const subs = state.attempts.filter((x) => x.assignmentId === a.id);
          const target = state.users.filter((u) => u.role === "student" && a.classes.includes(u.className ?? "")).length;
          const avg = subs.length ? Math.round(subs.reduce((s, x) => s + x.percent, 0) / subs.length) : 0;
          return (
            <motion.div key={a.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
              <Card className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge tone="brand">{getSubject(a.subjectId)?.name}</Badge>
                      <Badge tone="slate">{a.classes.join(", ")}</Badge>
                      {a.published ? <Badge tone="mint">Published</Badge> : <Badge tone="amber">Draft</Badge>}
                    </div>
                    <h3 className="mt-2.5 font-display text-base font-bold text-slate-900">{a.title}</h3>
                    <p className="mt-1 text-xs text-slate-500">{a.questionIds.length} questions · {a.durationMin} min · due {fmtDate(a.dueAt)}</p>
                  </div>
                  <button onClick={() => removeAssignment(a.id)} aria-label="Delete assignment" className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-slate-300 transition hover:bg-rose-50 hover:text-rose-500">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-3 border-t border-slate-100 pt-4 text-center">
                  <div><p className="font-display text-lg font-bold text-slate-900">{subs.length}/{target}</p><p className="text-[11px] text-slate-500">Submitted</p></div>
                  <div><p className="font-display text-lg font-bold text-slate-900">{avg || "—"}{avg ? "%" : ""}</p><p className="text-[11px] text-slate-500">Average</p></div>
                  <div><p className="font-display text-lg font-bold text-slate-900">{subs.length ? gradeFor(avg).grade : "—"}</p><p className="text-[11px] text-slate-500">Class grade</p></div>
                </div>
                <Progress value={target ? (subs.length / target) * 100 : 0} className="mt-3 h-1.5" tone="mint" />
              </Card>
            </motion.div>
          );
        })}
      </div>
      {!mine.length && <Empty icon={<ClipboardList className="h-6 w-6" />} title="No assignments yet" body="Create your first auto-marked assignment — it takes about 30 seconds." action={<Btn onClick={() => setOpen(true)} icon={<Plus className="h-4 w-4" />}>New assignment</Btn>} />}

      <Modal open={open} onClose={() => setOpen(false)} title="Create assignment" wide>
        <div className="space-y-4">
          <Field label="Assignment title">
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Vectors Check-up" className={inputCls} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Subject">
              <select value={subjectId} onChange={(e) => { setSubjectId(e.target.value); setTopicId(getSubject(e.target.value)!.topics[0].id); }} className={inputCls}>
                {SUBJECTS.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </Field>
            <Field label="Topic" hint={`${questionCount} questions will be pulled from the bank`}>
              <select value={topicId} onChange={(e) => setTopicId(e.target.value)} className={inputCls}>
                {topics.map((t) => <option key={t.id} value={t.id}>{t.title}</option>)}
              </select>
            </Field>
          </div>
          <Field label="Assign to classes">
            <div className="flex flex-wrap gap-2">
              {allClasses.map((c) => (
                <button key={c} type="button" onClick={() => setClasses((p) => (p.includes(c) ? p.filter((x) => x !== c) : [...p, c]))} className={cn("rounded-xl border px-3 py-2 text-[13px] font-semibold transition", classes.includes(c) ? "border-brand-500 bg-brand-50 text-brand-700" : "border-slate-200 text-slate-600")}>
                  {classes.includes(c) && <CheckCircle2 className="mr-1 inline h-3.5 w-3.5" />}{c}
                </button>
              ))}
            </div>
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Due in (days)">
              <input type="number" min={1} max={60} value={days} onChange={(e) => setDays(Number(e.target.value))} className={inputCls} />
            </Field>
            <Field label="Time limit (minutes)">
              <input type="number" min={5} max={180} value={duration} onChange={(e) => setDuration(Number(e.target.value))} className={inputCls} />
            </Field>
          </div>
          <Field label="Instructions to students">
            <textarea value={instructions} onChange={(e) => setInstructions(e.target.value)} rows={3} className={inputCls} />
          </Field>
          <div className="rounded-xl bg-brand-50 p-4 text-sm text-brand-900">
            <p className="font-semibold">Preview</p>
            <p className="mt-1 text-[13px] text-brand-800/80">
              {questionCount} auto-marked questions from <b>{getTopic(topicId)?.title}</b>, worth {byTopic(topicId).reduce((s, q) => s + q.marks, 0)} marks, for {classes.length} class{classes.length === 1 ? "" : "es"} ({state.users.filter((u) => u.role === "student" && classes.includes(u.className ?? "")).length} students).
            </p>
          </div>
          <Btn className="w-full" disabled={!title.trim() || !classes.length || !questionCount} onClick={create} icon={<BookOpen className="h-4 w-4" />}>
            Publish assignment
          </Btn>
        </div>
      </Modal>
    </div>
  );
}
