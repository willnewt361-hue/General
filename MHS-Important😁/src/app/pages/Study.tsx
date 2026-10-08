import { motion } from "framer-motion";
import {
  Award, BarChart3, Brain, Calendar, CheckCircle2, Clock, Download, FileText, Flame, GraduationCap,
  Medal, Plus, Shuffle, Target, Trash2, Trophy, Zap,
} from "lucide-react";
import { useMemo, useState } from "react";
import { cn } from "../../utils/cn";
import { useRouter } from "../../router";
import { SUBJECTS, getSubject, getTopic } from "../../data/curriculum";
import { byIds, bySubject, byTopic, divisionFor, gradeFor, gradePoints } from "../../data/questions";
import { useApp, useLeaderboard, usePredictor, useStudentStats, today } from "../../lib/store";
import { Avatar, Badge, Btn, Card, CardHead, Empty, Field, Modal, PageTitle, Progress, Sparkline, Stat, Tabs, ago, fmtDate, inputCls } from "../Kit";
import { Quiz, type QuizConfig } from "../Quiz";

const shuffle = <T,>(arr: T[]) => [...arr].sort(() => Math.random() - 0.5);

/* ============================ PRACTICE ============================ */
export function Practice() {
  const [quiz, setQuiz] = useState<QuizConfig | null>(null);
  const [subject, setSubject] = useState("math");
  const subj = getSubject(subject)!;
  if (quiz) return <Quiz config={quiz} onExit={() => setQuiz(null)} />;

  const quickSets = [
    { label: "Quick 5", count: 5, icon: Zap, desc: "A five-question warm-up", tone: "from-amber-400 to-orange-500" },
    { label: "Standard 10", count: 10, icon: Target, desc: "Ten mixed questions", tone: "from-brand-500 to-brand-600" },
    { label: "Marathon 20", count: 20, icon: Flame, desc: "Twenty questions, full stretch", tone: "from-rose-500 to-red-600" },
  ];

  return (
    <div>
      <PageTitle title="Practice" subtitle="Drill any topic with auto-marked questions and instant examiner-style feedback." />

      <Card className="mb-6">
        <CardHead title="Mixed practice" subtitle="Random questions across a whole subject" icon={<Shuffle className="h-4 w-4 text-brand-500" />} />
        <div className="p-5">
          <div className="flex flex-wrap gap-2">
            {SUBJECTS.map((s) => (
              <button key={s.id} onClick={() => setSubject(s.id)} className={cn("rounded-xl border px-3 py-2 text-[13px] font-semibold transition", subject === s.id ? "border-brand-500 bg-brand-50 text-brand-700" : "border-slate-200 text-slate-600 hover:border-slate-300")}>
                {s.emoji} {s.name}
              </button>
            ))}
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {quickSets.map((set, i) => {
              const pool = bySubject(subject);
              const available = Math.min(set.count, pool.length);
              return (
                <motion.button
                  key={set.label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  onClick={() => setQuiz({ title: `${subj.name} — ${set.label}`, subjectId: subject, topicIds: subj.topics.map((t) => t.id), questions: shuffle(pool).slice(0, available), kind: "practice" })}
                  className="group rounded-2xl border border-slate-200 p-5 text-left transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-lg"
                >
                  <span className={cn("grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br text-white shadow-lg", set.tone)}>
                    <set.icon className="h-5 w-5" />
                  </span>
                  <p className="mt-3.5 font-display text-base font-bold text-slate-900">{set.label}</p>
                  <p className="mt-1 text-[13px] text-slate-500">{set.desc}</p>
                  <p className="mt-3 text-xs font-semibold text-brand-600">{available} questions available →</p>
                </motion.button>
              );
            })}
          </div>
        </div>
      </Card>

      <Card>
        <CardHead title={`${subj.name} — practise by topic`} subtitle="Target exactly what you're weak at" />
        <div className="divide-y divide-slate-50">
          {subj.topics.map((t) => {
            const qs = byTopic(t.id);
            return (
              <div key={t.id} className="flex flex-wrap items-center gap-3 px-5 py-4">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-900">{t.title}</p>
                  <p className="mt-0.5 text-xs text-slate-500">{qs.length} questions · {qs.reduce((s, q) => s + q.marks, 0)} marks · UNEB {t.years.slice(0, 3).join(", ")}</p>
                </div>
                <Btn size="sm" variant="soft" disabled={!qs.length} onClick={() => setQuiz({ title: `${t.title} — Practice`, subjectId: subject, topicIds: [t.id], questions: qs, kind: "practice" })}>
                  Practise
                </Btn>
                <Btn size="sm" variant="ghost" disabled={qs.length < 3} onClick={() => setQuiz({ title: `${t.title} — Timed`, subjectId: subject, topicIds: [t.id], questions: qs, kind: "mock", durationMin: qs.length * 3 })} icon={<Clock className="h-3.5 w-3.5" />}>
                  Timed
                </Btn>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

/* ============================ ASSIGNMENTS ============================ */
export function Assignments() {
  const { user, state } = useApp();
  const [quiz, setQuiz] = useState<QuizConfig | null>(null);
  if (!user) return null;
  if (quiz) return <Quiz config={quiz} onExit={() => setQuiz(null)} />;

  const mine = state.assignments.filter((a) => a.published && a.classes.includes(user.className ?? ""));
  const submissions = state.attempts.filter((a) => a.userId === user.id && a.assignmentId);
  const pending = mine.filter((a) => !submissions.some((s) => s.assignmentId === a.id));
  const done = mine.filter((a) => submissions.some((s) => s.assignmentId === a.id));

  return (
    <div>
      <PageTitle title="Assignments" subtitle="Work set by your teachers, marked the moment you submit." />
      <div className="grid gap-5 lg:grid-cols-2">
        <div>
          <h2 className="mb-3 flex items-center gap-2 font-display text-sm font-bold uppercase tracking-wider text-slate-500">
            <Clock className="h-4 w-4 text-amber-500" /> To do ({pending.length})
          </h2>
          <div className="space-y-3">
            {pending.map((a, i) => {
              const days = Math.ceil((a.dueAt - Date.now()) / 86_400_000);
              const qs = byIds(a.questionIds);
              return (
                <motion.div key={a.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                  <Card hover className="p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge tone="brand">{getSubject(a.subjectId)?.name}</Badge>
                          <Badge tone={days <= 1 ? "rose" : days <= 3 ? "amber" : "slate"}>{days < 0 ? "Overdue" : `Due in ${days}d`}</Badge>
                        </div>
                        <h3 className="mt-2.5 font-display text-base font-bold text-slate-900">{a.title}</h3>
                        <p className="mt-1 text-[13px] text-slate-500">Set by {a.teacherName} · {qs.length} questions · {a.durationMin} min</p>
                        {a.instructions && <p className="mt-2 rounded-lg bg-slate-50 p-2.5 text-xs leading-relaxed text-slate-600">{a.instructions}</p>}
                      </div>
                    </div>
                    <Btn className="mt-4 w-full" disabled={!qs.length} onClick={() => setQuiz({ title: a.title, subjectId: a.subjectId, topicIds: a.topicIds, questions: qs, kind: "assignment", durationMin: a.durationMin, assignmentId: a.id })} icon={<FileText className="h-4 w-4" />}>
                      Start assignment
                    </Btn>
                  </Card>
                </motion.div>
              );
            })}
            {!pending.length && <Empty icon={<CheckCircle2 className="h-6 w-6" />} title="All caught up!" body="You have submitted every assignment set for your class." />}
          </div>
        </div>

        <div>
          <h2 className="mb-3 flex items-center gap-2 font-display text-sm font-bold uppercase tracking-wider text-slate-500">
            <CheckCircle2 className="h-4 w-4 text-mint-500" /> Submitted ({done.length})
          </h2>
          <div className="space-y-3">
            {done.map((a) => {
              const sub = submissions.find((s) => s.assignmentId === a.id)!;
              const g = gradeFor(sub.percent);
              return (
                <Card key={a.id} className="p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="truncate font-display text-[15px] font-bold text-slate-900">{a.title}</h3>
                      <p className="mt-0.5 text-xs text-slate-500">{getSubject(a.subjectId)?.name} · submitted {ago(sub.at)}</p>
                      <p className="mt-2 text-sm text-slate-600">{sub.score}/{sub.total} marks</p>
                    </div>
                    <div className="shrink-0 text-center">
                      <p className="font-display text-2xl font-bold text-slate-900">{sub.percent}%</p>
                      <span className={cn("mt-1 inline-block rounded-full border px-2 py-0.5 text-[11px] font-bold", g.tone)}>{g.grade}</span>
                    </div>
                  </div>
                </Card>
              );
            })}
            {!done.length && <Empty icon={<FileText className="h-6 w-6" />} title="Nothing submitted yet" body="Your marked assignments will be listed here." />}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================ MOCK EXAMS + PREDICTOR ============================ */
export function Mocks() {
  const { user } = useApp();
  const stats = useStudentStats(user?.id);
  const predictor = usePredictor(user?.id);
  const [quiz, setQuiz] = useState<QuizConfig | null>(null);
  const [tab, setTab] = useState<"exams" | "predictor" | "results">("exams");
  const { navigate } = useRouter();

  if (quiz) return <Quiz config={quiz} onExit={() => setQuiz(null)} />;

  const mocks = SUBJECTS.map((s) => {
    const pool = bySubject(s.id);
    return { subject: s, pool, marks: pool.reduce((a, q) => a + q.marks, 0) };
  }).filter((m) => m.pool.length >= 4);

  const mockResults = stats.attempts.filter((a) => a.kind === "mock").sort((a, b) => b.at - a.at);
  const bestBySubject = Object.entries(stats.bySubject).map(([id, v]) => ({ id, ...v, grade: gradeFor(v.avg).grade }));
  const aggregate = bestBySubject.reduce((s, b) => s + gradePoints[b.grade], 0);
  const division = divisionFor(aggregate, bestBySubject.length);

  return (
    <div>
      <PageTitle title="Mock Examinations" subtitle="Sit the exam before the exam. Timed, auto-marked, graded on the UNEB scale." />

      <div className="mb-5 grid gap-4 sm:grid-cols-3">
        <Stat label="Mocks completed" value={mockResults.length} icon={<GraduationCap className="h-5 w-5" />} tone="brand" />
        <Stat label="Best mock score" value={mockResults.length ? `${Math.max(...mockResults.map((m) => m.percent))}%` : "—"} icon={<Trophy className="h-5 w-5" />} tone="mint" />
        <Stat label="Predicted division" value={division} sub={`Aggregate ${aggregate || "—"} from ${bestBySubject.length} subjects`} icon={<Award className="h-5 w-5" />} tone="violet" />
      </div>

      <div className="mb-5">
        <Tabs id="mocks" active={tab} onChange={setTab} tabs={[{ id: "exams", label: "Sit a mock", count: mocks.length }, { id: "predictor", label: "Exam predictor" }, { id: "results", label: "My results", count: mockResults.length }]} />
      </div>

      {tab === "exams" && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {mocks.map((m, i) => (
            <motion.div key={m.subject.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card hover className="h-full overflow-hidden">
                <div className={cn("bg-gradient-to-br px-5 py-5 text-white", m.subject.gradient)}>
                  <span className="text-2xl">{m.subject.emoji}</span>
                  <h3 className="mt-2 font-display text-lg font-bold">{m.subject.name}</h3>
                  <p className="text-xs text-white/80">Paper code {m.subject.code}</p>
                </div>
                <div className="p-5">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Questions</span>
                    <span className="font-semibold text-slate-900">{Math.min(12, m.pool.length)}</span>
                  </div>
                  <div className="mt-1.5 flex justify-between text-sm">
                    <span className="text-slate-500">Total marks</span>
                    <span className="font-semibold text-slate-900">{shuffle(m.pool).slice(0, 12).reduce((a, q) => a + q.marks, 0)}</span>
                  </div>
                  <div className="mt-1.5 flex justify-between text-sm">
                    <span className="text-slate-500">Duration</span>
                    <span className="font-semibold text-slate-900">40 min</span>
                  </div>
                  <Btn className="mt-4 w-full" onClick={() => setQuiz({ title: `${m.subject.name} Mock Examination`, subjectId: m.subject.id, topicIds: m.subject.topics.map((t) => t.id), questions: shuffle(m.pool).slice(0, 12), kind: "mock", durationMin: 40 })} icon={<Clock className="h-4 w-4" />}>
                    Begin mock
                  </Btn>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {tab === "predictor" && (
        <Card>
          <CardHead title="AI Exam Predictor" subtitle="Topics ranked by past-paper frequency, recency and your personal performance" icon={<Brain className="h-4 w-4 text-brand-500" />} />
          <div className="p-5">
            <div className="mb-5 rounded-xl bg-brand-50 p-4 text-sm text-brand-900">
              <p className="font-semibold">How this works</p>
              <p className="mt-1 leading-relaxed text-brand-800/80">
                We analyse how often each topic appeared in UNEB papers from 2016–2024, weight recent sittings more heavily, then boost topics where your own scores are lowest. This tells you where revision time pays back the most — it does not predict actual exam content.
              </p>
            </div>
            <div className="space-y-2.5">
              {predictor.slice(0, 14).map((p, i) => (
                <motion.button
                  key={p.topic.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  onClick={() => navigate(`app/topic/${p.topic.id}`)}
                  className="flex w-full items-center gap-4 rounded-xl border border-slate-200 p-4 text-left transition hover:border-brand-300 hover:bg-brand-50/40"
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-slate-100 text-sm font-bold text-slate-600">{i + 1}</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-900">{p.topic.title}</p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {getSubject(p.topic.subjectId)?.name} · appeared {p.years.length}× · last {p.years[0]}
                      {p.yourAvg !== null && ` · your avg ${p.yourAvg}%`}
                    </p>
                    <Progress value={p.likelihood} className="mt-2 h-1.5" tone={p.likelihood > 78 ? "rose" : p.likelihood > 60 ? "amber" : "brand"} />
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="font-display text-xl font-bold text-slate-900">{p.likelihood}%</p>
                    <p className="text-[10px] uppercase tracking-wider text-slate-400">likely</p>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </Card>
      )}

      {tab === "results" && (
        <Card>
          <CardHead title="Mock results history" subtitle="Every timed paper you have sat" />
          {mockResults.length ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[620px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-5 py-3 font-semibold">Paper</th>
                    <th className="px-5 py-3 font-semibold">Subject</th>
                    <th className="px-5 py-3 font-semibold">Score</th>
                    <th className="px-5 py-3 font-semibold">Grade</th>
                    <th className="px-5 py-3 font-semibold">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {mockResults.map((r) => {
                    const g = gradeFor(r.percent);
                    return (
                      <tr key={r.id} className="transition hover:bg-slate-50">
                        <td className="px-5 py-3.5 font-medium text-slate-900">{r.title}</td>
                        <td className="px-5 py-3.5 text-slate-600">{getSubject(r.subjectId)?.name}</td>
                        <td className="px-5 py-3.5 font-semibold tabular-nums text-slate-900">{r.percent}%</td>
                        <td className="px-5 py-3.5"><span className={cn("rounded-full border px-2 py-0.5 text-[11px] font-bold", g.tone)}>{g.grade}</span></td>
                        <td className="px-5 py-3.5 text-slate-500">{fmtDate(r.at)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <Empty icon={<GraduationCap className="h-6 w-6" />} title="No mocks yet" body="Sit your first timed paper and your results will be tracked here." />
          )}
        </Card>
      )}
    </div>
  );
}

/* ============================ PERFORMANCE ============================ */
export function Performance() {
  const { user } = useApp();
  const stats = useStudentStats(user?.id);
  const predictor = usePredictor(user?.id);

  const weakest = useMemo(() => predictor.filter((p) => p.yourAvg !== null).sort((a, b) => (a.yourAvg ?? 0) - (b.yourAvg ?? 0)).slice(0, 5), [predictor]);
  const subjectRows = Object.entries(stats.bySubject).map(([id, v]) => ({ subject: getSubject(id)!, ...v, grade: gradeFor(v.avg) }));
  const aggregate = subjectRows.reduce((s, r) => s + gradePoints[r.grade.grade], 0);

  return (
    <div>
      <PageTitle title="My Performance" subtitle="Every score, every subject, every trend — so you know exactly where to push." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Overall average" value={`${stats.avg}%`} sub={gradeFor(stats.avg).label} icon={<BarChart3 className="h-5 w-5" />} />
        <Stat label="Assessments" value={stats.attempts.length} sub="practice, assignments & mocks" icon={<Target className="h-5 w-5" />} tone="mint" />
        <Stat label="Aggregate" value={aggregate || "—"} sub={divisionFor(aggregate, subjectRows.length)} icon={<Award className="h-5 w-5" />} tone="violet" />
        <Stat label="Topics covered" value={`${stats.topicsRead}/${stats.topicsTotal}`} sub={`${Math.round((stats.topicsRead / stats.topicsTotal) * 100)}% of syllabus`} icon={<CheckCircle2 className="h-5 w-5" />} tone="amber" />
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHead title="Score trend" subtitle="Chronological performance across all assessments" />
          <div className="p-5">
            {stats.trend.length > 1 ? <Sparkline data={stats.trend} className="h-40" /> : <Empty title="Not enough data" body="Take at least two assessments to see your trend." />}
          </div>
        </Card>
        <Card>
          <CardHead title="Grade distribution" subtitle="How your results break down" />
          <div className="space-y-2.5 p-5">
            {["D1", "D2", "C3", "C4", "C5", "C6", "P7", "P8", "F9"].map((g) => {
              const count = stats.attempts.filter((a) => gradeFor(a.percent).grade === g).length;
              const pct = stats.attempts.length ? (count / stats.attempts.length) * 100 : 0;
              if (!count) return null;
              return (
                <div key={g}>
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-700">{g}</span>
                    <span className="text-slate-500">{count} result{count > 1 ? "s" : ""}</span>
                  </div>
                  <Progress value={pct} className="mt-1 h-2" tone={g.startsWith("D") ? "mint" : g.startsWith("C") ? "brand" : g.startsWith("P") ? "amber" : "rose"} />
                </div>
              );
            })}
            {!stats.attempts.length && <p className="py-6 text-center text-sm text-slate-400">No results yet.</p>}
          </div>
        </Card>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <Card>
          <CardHead title="Subject breakdown" subtitle="Average and UNEB grade per subject" />
          <div className="divide-y divide-slate-50">
            {subjectRows.map((r) => (
              <div key={r.subject.id} className="flex items-center gap-4 px-5 py-4">
                <span className={cn("grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br text-lg", r.subject.gradient)}>{r.subject.emoji}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-900">{r.subject.name}</p>
                  <Progress value={r.avg} className="mt-1.5 h-1.5" tone={r.avg >= 70 ? "mint" : r.avg >= 50 ? "brand" : "rose"} />
                  <p className="mt-1 text-xs text-slate-500">{r.count} assessment{r.count > 1 ? "s" : ""}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="font-display text-lg font-bold text-slate-900">{r.avg}%</p>
                  <span className={cn("rounded-full border px-2 py-0.5 text-[10px] font-bold", r.grade.tone)}>{r.grade.grade}</span>
                </div>
              </div>
            ))}
            {!subjectRows.length && <Empty title="No subject data" body="Complete assessments to build your profile." />}
          </div>
        </Card>

        <Card>
          <CardHead title="Focus areas" subtitle="Your five weakest topics — fix these first" icon={<Target className="h-4 w-4 text-rose-500" />} />
          <div className="space-y-3 p-5">
            {weakest.map((w) => (
              <div key={w.topic.id} className="rounded-xl border border-rose-100 bg-rose-50/50 p-3.5">
                <div className="flex items-center justify-between gap-3">
                  <p className="truncate text-sm font-semibold text-slate-900">{w.topic.title}</p>
                  <span className="shrink-0 font-display text-base font-bold text-rose-600">{w.yourAvg}%</span>
                </div>
                <p className="mt-0.5 text-xs text-slate-500">{getSubject(w.topic.subjectId)?.name} · {w.likelihood}% exam likelihood</p>
              </div>
            ))}
            {!weakest.length && <Empty title="No weak areas yet" body="Take a few more assessments and we'll pinpoint exactly where to focus." />}
          </div>
        </Card>
      </div>

      <Card className="mt-5">
        <CardHead title="Recent activity" subtitle="Your last assessments" />
        <div className="divide-y divide-slate-50">
          {stats.recent.map((a) => {
            const g = gradeFor(a.percent);
            return (
              <div key={a.id} className="flex flex-wrap items-center gap-3 px-5 py-3.5">
                <Badge tone={a.kind === "mock" ? "violet" : a.kind === "assignment" ? "amber" : "slate"}>{a.kind}</Badge>
                <p className="min-w-0 flex-1 truncate text-sm font-medium text-slate-900">{a.title}</p>
                <span className="text-xs text-slate-400">{ago(a.at)}</span>
                <span className="text-sm font-bold tabular-nums text-slate-900">{a.percent}%</span>
                <span className={cn("rounded-full border px-2 py-0.5 text-[11px] font-bold", g.tone)}>{g.grade}</span>
              </div>
            );
          })}
          {!stats.recent.length && <Empty title="No activity yet" />}
        </div>
      </Card>
    </div>
  );
}

/* ============================ PLANNER ============================ */
export function Planner() {
  const { user, state, addTask, toggleTask, removeTask } = useApp();
  const predictor = usePredictor(user?.id);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [minutes, setMinutes] = useState(30);
  const [topicId, setTopicId] = useState("");
  if (!user) return null;

  const tasks = state.tasks.filter((t) => t.userId === user.id);
  const done = tasks.filter((t) => t.done);
  const totalMin = tasks.reduce((s, t) => s + t.minutes, 0);
  const doneMin = done.reduce((s, t) => s + t.minutes, 0);

  const generate = () => {
    predictor.slice(0, 4).forEach((p) => {
      addTask({ title: `Revise: ${p.topic.title}`, subjectId: p.topic.subjectId, topicId: p.topic.id, minutes: 30, done: false, day: today(), auto: true });
    });
  };

  return (
    <div>
      <PageTitle
        title="Study Planner"
        subtitle="A daily plan that adapts to your weakest topics and the exam predictor."
        action={
          <div className="flex gap-2">
            <Btn variant="ghost" onClick={generate} icon={<Brain className="h-4 w-4" />}>Auto-generate</Btn>
            <Btn onClick={() => setOpen(true)} icon={<Plus className="h-4 w-4" />}>Add task</Btn>
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Tasks today" value={`${done.length}/${tasks.length}`} icon={<Calendar className="h-5 w-5" />} />
        <Stat label="Study minutes" value={`${doneMin}/${totalMin}`} sub="completed / planned" icon={<Clock className="h-5 w-5" />} tone="mint" />
        <Stat label="Completion" value={`${totalMin ? Math.round((doneMin / totalMin) * 100) : 0}%`} icon={<Target className="h-5 w-5" />} tone="violet" />
      </div>

      <Card className="mt-5">
        <CardHead title={`Today · ${new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}`} subtitle={`${tasks.length} task${tasks.length === 1 ? "" : "s"} planned`} />
        <div className="divide-y divide-slate-50">
          {tasks.map((t, i) => (
            <motion.div key={t.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }} className="flex items-center gap-3.5 px-5 py-4">
              <button onClick={() => toggleTask(t.id)} aria-label={t.done ? "Mark incomplete" : "Mark complete"} className={cn("grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 transition", t.done ? "border-mint-500 bg-mint-500 text-white" : "border-slate-300 hover:border-brand-400")}>
                {t.done && <CheckCircle2 className="h-4 w-4" />}
              </button>
              <div className="min-w-0 flex-1">
                <p className={cn("text-sm font-medium", t.done ? "text-slate-400 line-through" : "text-slate-900")}>{t.title}</p>
                <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                  {t.subjectId && <span>{getSubject(t.subjectId)?.emoji} {getSubject(t.subjectId)?.name}</span>}
                  <span>· {t.minutes} min</span>
                  {t.auto && <Badge tone="brand">AI suggested</Badge>}
                </div>
              </div>
              <button onClick={() => removeTask(t.id)} aria-label="Delete task" className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-slate-300 transition hover:bg-rose-50 hover:text-rose-500">
                <Trash2 className="h-4 w-4" />
              </button>
            </motion.div>
          ))}
          {!tasks.length && <Empty icon={<Calendar className="h-6 w-6" />} title="Your day is clear" body="Add tasks manually or let the AI build a plan from your weakest topics." action={<Btn onClick={generate} icon={<Brain className="h-4 w-4" />}>Auto-generate plan</Btn>} />}
        </div>
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title="Add a study task">
        <div className="space-y-4">
          <Field label="What will you study?">
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Revise projectile motion" className={inputCls} />
          </Field>
          <Field label="Link to a topic (optional)">
            <select value={topicId} onChange={(e) => setTopicId(e.target.value)} className={inputCls}>
              <option value="">No topic</option>
              {SUBJECTS.map((s) => (
                <optgroup key={s.id} label={s.name}>
                  {s.topics.map((t) => (
                    <option key={t.id} value={t.id}>{t.title}</option>
                  ))}
                </optgroup>
              ))}
            </select>
          </Field>
          <Field label="Minutes">
            <input type="number" min={5} max={240} value={minutes} onChange={(e) => setMinutes(Number(e.target.value))} className={inputCls} />
          </Field>
          <Btn
            className="w-full"
            disabled={!title.trim()}
            onClick={() => {
              const topic = topicId ? getTopic(topicId) : undefined;
              addTask({ title: title.trim(), subjectId: topic?.subjectId, topicId: topicId || undefined, minutes, done: false, day: today() });
              setTitle("");
              setTopicId("");
              setOpen(false);
            }}
          >
            Add to plan
          </Btn>
        </div>
      </Modal>
    </div>
  );
}

/* ============================ LEADERBOARD ============================ */
export function Leaderboard() {
  const board = useLeaderboard();
  const { user } = useApp();
  const [scope, setScope] = useState<"school" | "class">("school");
  const rows = scope === "class" ? board.filter((r) => r.user.className === user?.className) : board;
  const myRank = rows.findIndex((r) => r.user.id === user?.id) + 1;

  const medal = (i: number) => (i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : null);

  return (
    <div>
      <PageTitle title="Leaderboard" subtitle="Consistency beats cramming. Earn XP by reading topics, practising and scoring well." />

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <Tabs id="board" active={scope} onChange={setScope} tabs={[{ id: "school", label: "Whole school", count: board.length }, { id: "class", label: user?.className ?? "My class", count: board.filter((r) => r.user.className === user?.className).length }]} />
        {myRank > 0 && <Badge tone="brand"><Medal className="h-3 w-3" /> You are #{myRank}</Badge>}
      </div>

      {/* podium */}
      <div className="mb-5 grid gap-4 sm:grid-cols-3">
        {rows.slice(0, 3).map((r, i) => (
          <motion.div key={r.user.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className={cn(i === 0 && "sm:order-2", i === 1 && "sm:order-1", i === 2 && "sm:order-3")}>
            <Card className={cn("relative overflow-hidden p-6 text-center", i === 0 && "ring-2 ring-gold-400")}>
              {i === 0 && <div aria-hidden className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-gold-300 via-gold-400 to-gold-300" />}
              <span className="text-3xl">{medal(i)}</span>
              <div className="mt-3 flex justify-center"><Avatar name={r.user.name} hue={r.user.hue} size={56} /></div>
              <p className="mt-3 font-display text-base font-bold text-slate-900">{r.user.name}</p>
              <p className="text-xs text-slate-500">{r.user.className}</p>
              <p className="mt-3 font-display text-2xl font-bold text-brand-600">{r.xp.toLocaleString()} XP</p>
              <p className="text-xs text-slate-500">{r.avg}% average · {r.attempts} tests</p>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card>
        <CardHead title="Full ranking" subtitle="Updated in real time" icon={<Trophy className="h-4 w-4 text-gold-500" />} />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-5 py-3 font-semibold">#</th>
                <th className="px-5 py-3 font-semibold">Student</th>
                <th className="px-5 py-3 font-semibold">Class</th>
                <th className="px-5 py-3 font-semibold">Average</th>
                <th className="px-5 py-3 font-semibold">Streak</th>
                <th className="px-5 py-3 text-right font-semibold">XP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((r, i) => (
                <tr key={r.user.id} className={cn("transition hover:bg-slate-50", r.user.id === user?.id && "bg-brand-50/60")}>
                  <td className="px-5 py-3 font-bold text-slate-400">{medal(i) ?? i + 1}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2.5">
                      <Avatar name={r.user.name} hue={r.user.hue} size={30} />
                      <span className="font-medium text-slate-900">{r.user.name}{r.user.id === user?.id && <span className="ml-1.5 text-xs text-brand-600">(you)</span>}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-slate-500">{r.user.className}</td>
                  <td className="px-5 py-3 font-semibold tabular-nums text-slate-900">{r.avg}%</td>
                  <td className="px-5 py-3 text-slate-600">🔥 {r.streak}</td>
                  <td className="px-5 py-3 text-right font-bold tabular-nums text-brand-600">{r.xp.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

/* ============================ CERTIFICATES ============================ */
export function Certificates() {
  const { state, user, issueCertificate } = useApp();
  const stats = useStudentStats(user?.id);
  const mine = state.certificates.filter((c) => c.userId === user?.id);
  const [view, setView] = useState<string | null>(null);

  const eligible = Object.entries(stats.bySubject)
    .filter(([id, v]) => v.avg >= 75 && v.count >= 2 && !mine.some((c) => c.subjectId === id))
    .map(([id, v]) => ({ subject: getSubject(id)!, avg: v.avg }));

  const cert = mine.find((c) => c.id === view);

  return (
    <div>
      <PageTitle title="Certificates" subtitle="Verifiable digital certificates for your achievements — shareable with any school or employer." />

      {!!eligible.length && (
        <Card className="mb-5 border-mint-500/30 bg-mint-500/5">
          <div className="p-5">
            <h3 className="flex items-center gap-2 font-display text-base font-bold text-slate-900"><Award className="h-4 w-4 text-mint-600" /> You've earned new certificates</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {eligible.map((e) => (
                <div key={e.subject.id} className="flex items-center justify-between gap-3 rounded-xl border border-mint-500/20 bg-white p-4">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900">{e.subject.name} Mastery</p>
                    <p className="text-xs text-slate-500">{e.avg}% average · {gradeFor(e.avg).label}</p>
                  </div>
                  <Btn size="sm" variant="success" onClick={() => issueCertificate(e.subject.id, e.avg, gradeFor(e.avg).grade, `${e.subject.name} Mastery`)}>
                    Claim
                  </Btn>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {mine.length ? (
        <div className="grid gap-5 sm:grid-cols-2">
          {mine.map((c, i) => (
            <motion.button key={c.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} onClick={() => setView(c.id)} className="text-left">
              <Card hover className="relative overflow-hidden">
                <div className="relative bg-gradient-to-br from-ink-900 via-ink-800 to-brand-800 p-6 text-white">
                  <div aria-hidden className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-gold-400/20 blur-2xl" />
                  <div className="relative flex items-start justify-between">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold-300">Verified certificate</p>
                      <h3 className="mt-2 font-display text-xl font-bold">{c.title}</h3>
                      <p className="mt-1 text-sm text-slate-300">{c.userName}</p>
                    </div>
                    <Award className="h-8 w-8 text-gold-300" />
                  </div>
                  <div className="relative mt-6 flex items-end justify-between">
                    <div>
                      <p className="text-xs text-slate-400">Serial</p>
                      <p className="font-mono text-sm">{c.serial}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-display text-2xl font-bold">{c.grade}</p>
                      <p className="text-xs text-slate-400">{c.percent}% · {fmtDate(c.at)}</p>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.button>
          ))}
        </div>
      ) : (
        <Empty icon={<Award className="h-6 w-6" />} title="No certificates yet" body="Score 75% or more across two assessments in any subject to earn your first verified certificate." />
      )}

      <Modal open={!!cert} onClose={() => setView(null)} title="Certificate" wide>
        {cert && (
          <div>
            <div className="relative overflow-hidden rounded-2xl border-4 border-double border-gold-400/50 bg-gradient-to-br from-white to-amber-50/50 p-8 text-center">
              <div aria-hidden className="absolute inset-0 grid-pattern opacity-40" />
              <div className="relative">
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-brand-600">Mengo Hub System</p>
                <h2 className="mt-4 font-display text-2xl font-bold tracking-tight text-slate-900">Certificate of Achievement</h2>
                <p className="mt-6 text-sm text-slate-500">This is to certify that</p>
                <p className="mt-2 font-display text-3xl font-bold text-slate-900">{cert.userName}</p>
                <p className="mt-4 text-sm text-slate-500">has successfully demonstrated mastery in</p>
                <p className="mt-2 font-display text-xl font-bold text-brand-700">{cert.title}</p>
                <p className="mt-4 text-sm text-slate-600">achieving <b>{cert.percent}%</b> — grade <b>{cert.grade}</b> on the UNEB scale</p>
                <div className="mt-8 flex flex-wrap items-end justify-between gap-6 text-left">
                  <div>
                    <p className="border-t border-slate-300 pt-1.5 font-display text-sm font-semibold text-slate-800">Head Teacher</p>
                    <p className="text-xs text-slate-500">Mengo Senior School</p>
                  </div>
                  <div className="text-center">
                    <div className="grid h-16 w-16 place-items-center rounded-lg bg-slate-900 text-white">
                      <div className="grid grid-cols-4 gap-0.5">
                        {Array.from({ length: 16 }).map((_, i) => (
                          <span key={i} className={cn("h-1.5 w-1.5 rounded-[1px]", (cert.serial.charCodeAt(i % cert.serial.length) + i) % 3 ? "bg-white" : "bg-transparent")} />
                        ))}
                      </div>
                    </div>
                    <p className="mt-1 font-mono text-[10px] text-slate-500">{cert.serial}</p>
                  </div>
                  <div>
                    <p className="border-t border-slate-300 pt-1.5 font-display text-sm font-semibold text-slate-800">{fmtDate(cert.at)}</p>
                    <p className="text-xs text-slate-500">Date issued</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <Btn onClick={() => window.print()} icon={<Download className="h-4 w-4" />}>Print / Save PDF</Btn>
              <Btn variant="ghost" onClick={() => navigator.clipboard?.writeText(`Verify ${cert.serial} at mengohub.ug/verify`)}>Copy verification link</Btn>
            </div>
            <p className="mt-3 text-xs text-slate-500">Anyone can verify this certificate using serial <b>{cert.serial}</b>. The record is signed and cannot be altered.</p>
          </div>
        )}
      </Modal>
    </div>
  );
}
