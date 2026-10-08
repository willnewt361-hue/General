import { motion } from "framer-motion";
import {
  ArrowLeft, ArrowRight, BookOpen, Bookmark, BookmarkCheck, Brain, CheckCircle2, ChevronRight, Clock,
  ExternalLink, FlaskConical, Flame, GraduationCap, Lightbulb, Maximize2, Play, Plus, Search, Sigma, Target, Trophy,
} from "lucide-react";
import { useState } from "react";
import { cn } from "../../utils/cn";
import { Link, useRouter } from "../../router";
import { SUBJECTS, getSubject, getTopic } from "../../data/curriculum";
import { byTopic } from "../../data/questions";
import { useApp, useStudentStats, usePredictor } from "../../lib/store";
import { Badge, Btn, Card, CardHead, Empty, Field, Modal, PageTitle, Progress, Ring, Sparkline, Stat, Tabs, ago, inputCls } from "../Kit";
import { Quiz, type QuizConfig } from "../Quiz";

/* ============================ DASHBOARD ============================ */
export function Dashboard() {
  const { user, state, progress } = useApp();
  const stats = useStudentStats(user?.id);
  const predictor = usePredictor(user?.id);
  const { navigate } = useRouter();
  if (!user) return null;

  const due = state.assignments
    .filter((a) => a.published && a.classes.includes(user.className ?? "") && !state.attempts.some((t) => t.userId === user.id && t.assignmentId === a.id))
    .sort((a, b) => a.dueAt - b.dueAt);
  const tasks = state.tasks.filter((t) => t.userId === user.id);
  const doneTasks = tasks.filter((t) => t.done).length;
  const hour = new Date().getHours();
  const greet = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div>
      <PageTitle title={`${greet}, ${user.name.split(" ")[1] ?? user.name.split(" ")[0]} 👋`} subtitle={`${user.className ?? "Mengo Senior School"} · Let's keep your learning streak alive.`} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Average score" value={`${stats.avg}%`} sub={`${stats.attempts.length} assessments taken`} icon={<Target className="h-5 w-5" />} tone="brand" delay={0} />
        <Stat label="Revision streak" value={`${progress.streak} days`} sub="Keep it going 🔥" icon={<Flame className="h-5 w-5" />} tone="amber" delay={0.06} />
        <Stat label="UNEB readiness" value={`${stats.readiness}%`} sub={stats.readiness > 75 ? "Excellent progress" : "Build with daily practice"} icon={<GraduationCap className="h-5 w-5" />} tone="mint" delay={0.12} />
        <Stat label="Experience points" value={stats.xp.toLocaleString()} sub={`${stats.topicsRead}/${stats.topicsTotal} topics read`} icon={<Trophy className="h-5 w-5" />} tone="violet" delay={0.18} />
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHead title="Your progress over time" subtitle="Percentage score across every assessment" action={<Badge tone={stats.trend.length > 1 && stats.trend[stats.trend.length - 1] >= stats.trend[0] ? "mint" : "amber"}>{stats.trend.length > 1 ? `${stats.trend[stats.trend.length - 1] - stats.trend[0] >= 0 ? "+" : ""}${stats.trend[stats.trend.length - 1] - stats.trend[0]}% overall` : "New"}</Badge>} />
          <div className="p-5">
            {stats.trend.length > 1 ? <Sparkline data={stats.trend} className="h-32" /> : <Empty icon={<Target className="h-6 w-6" />} title="No data yet" body="Complete a practice set and your progress curve will appear here." action={<Btn onClick={() => navigate("app/practice")}>Start practising</Btn>} />}
          </div>
        </Card>

        <Card>
          <CardHead title="UNEB readiness" subtitle="Based on scores, coverage and consistency" />
          <div className="flex flex-col items-center p-5">
            <Ring value={stats.readiness} size={148} sub="ready" />
            <div className="mt-5 w-full space-y-2.5 text-sm">
              {[
                { l: "Assessment average", v: stats.avg },
                { l: "Syllabus coverage", v: Math.round((stats.topicsRead / stats.topicsTotal) * 100) },
                { l: "Practice consistency", v: Math.min(100, stats.attempts.length * 8) },
              ].map((r) => (
                <div key={r.l}>
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>{r.l}</span>
                    <span className="font-semibold tabular-nums text-slate-700">{r.v}%</span>
                  </div>
                  <Progress value={r.v} className="mt-1 h-1.5" />
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHead title="Subject performance" subtitle="Your average in each subject" action={<Link to="app/performance" className="text-xs font-semibold text-brand-600 hover:text-brand-700">View details →</Link>} />
          <div className="divide-y divide-slate-50">
            {SUBJECTS.filter((s) => (user.subjects ?? []).includes(s.id)).map((s, i) => {
              const b = stats.bySubject[s.id];
              return (
                <motion.button
                  key={s.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => navigate(`app/subject/${s.id}`)}
                  className="flex w-full items-center gap-4 px-5 py-3.5 text-left transition hover:bg-slate-50"
                >
                  <span className={cn("grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br text-lg", s.gradient)}>{s.emoji}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-slate-900">{s.name}</span>
                    <Progress value={b?.avg ?? 0} className="mt-1.5 h-1.5" tone={(b?.avg ?? 0) >= 70 ? "mint" : (b?.avg ?? 0) >= 50 ? "brand" : "amber"} />
                  </span>
                  <span className="shrink-0 text-right">
                    <span className="block font-display text-base font-bold tabular-nums text-slate-900">{b ? `${b.avg}%` : "—"}</span>
                    <span className="block text-[11px] text-slate-400">{b?.count ?? 0} tests</span>
                  </span>
                  <ChevronRight className="h-4 w-4 shrink-0 text-slate-300" />
                </motion.button>
              );
            })}
          </div>
        </Card>

        <div className="space-y-5">
          <Card>
            <CardHead title="Due soon" subtitle={`${due.length} assignment${due.length === 1 ? "" : "s"} waiting`} icon={<Clock className="h-4 w-4 text-amber-500" />} />
            <div className="space-y-2 p-4">
              {due.slice(0, 3).map((a) => {
                const days = Math.ceil((a.dueAt - Date.now()) / 86_400_000);
                return (
                  <button key={a.id} onClick={() => navigate("app/assignments")} className="block w-full rounded-xl border border-slate-200 p-3 text-left transition hover:border-brand-300 hover:bg-brand-50/50">
                    <p className="text-[13px] font-semibold text-slate-900">{a.title}</p>
                    <p className="mt-0.5 text-xs text-slate-500">{getSubject(a.subjectId)?.name} · {a.teacherName}</p>
                    <Badge tone={days <= 2 ? "rose" : "amber"} className="mt-2">Due in {days} day{days === 1 ? "" : "s"}</Badge>
                  </button>
                );
              })}
              {!due.length && <p className="py-6 text-center text-sm text-slate-400">Nothing due. Great work! 🎉</p>}
            </div>
          </Card>

          <Card>
            <CardHead title="Today's plan" subtitle={`${doneTasks}/${tasks.length} complete`} action={<Link to="app/planner" className="text-xs font-semibold text-brand-600">Open</Link>} />
            <div className="space-y-2 p-4">
              {tasks.slice(0, 4).map((t) => (
                <div key={t.id} className="flex items-center gap-2.5 text-[13px]">
                  <span className={cn("grid h-4 w-4 shrink-0 place-items-center rounded-full border", t.done ? "border-mint-500 bg-mint-500 text-white" : "border-slate-300")}>{t.done && <CheckCircle2 className="h-3 w-3" />}</span>
                  <span className={cn("flex-1 truncate", t.done ? "text-slate-400 line-through" : "text-slate-700")}>{t.title}</span>
                  <span className="shrink-0 text-xs text-slate-400">{t.minutes}m</span>
                </div>
              ))}
              {!tasks.length && <p className="py-4 text-center text-sm text-slate-400">No tasks yet.</p>}
            </div>
          </Card>
        </div>
      </div>

      <Card className="mt-5">
        <CardHead title="Exam predictor — focus here first" subtitle="Ranked by past-paper frequency, recency and your own weak spots" icon={<Brain className="h-4 w-4 text-brand-500" />} action={<Link to="app/mocks" className="text-xs font-semibold text-brand-600">Full predictor →</Link>} />
        <div className="grid gap-3 p-5 sm:grid-cols-2">
          {predictor.slice(0, 4).map((p, i) => (
            <motion.button
              key={p.topic.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              onClick={() => navigate(`app/topic/${p.topic.id}`)}
              className="group rounded-xl border border-slate-200 p-4 text-left transition hover:border-brand-300 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-[13.5px] font-semibold text-slate-900">{p.topic.title}</p>
                  <p className="mt-0.5 text-xs text-slate-500">{getSubject(p.topic.subjectId)?.name} · seen in {p.years.slice(0, 4).join(", ")}</p>
                </div>
                <span className="shrink-0 font-display text-lg font-bold text-brand-600">{p.likelihood}%</span>
              </div>
              <Progress value={p.likelihood} className="mt-3 h-1.5" tone={p.likelihood > 75 ? "rose" : "brand"} />
            </motion.button>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* ============================ SUBJECTS ============================ */
export function Subjects() {
  const { user, progress } = useApp();
  const stats = useStudentStats(user?.id);
  const [q, setQ] = useState("");
  const list = SUBJECTS.filter((s) => s.name.toLowerCase().includes(q.toLowerCase()) || s.topics.some((t) => t.title.toLowerCase().includes(q.toLowerCase())));

  return (
    <div>
      <PageTitle title="Subjects & Notes" subtitle="Complete UNEB-aligned summaries, virtual labs and question banks for every subject." />
      <div className="relative mb-6 max-w-md">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search subjects or topics…" className="h-11 w-full rounded-xl border border-slate-200 pl-10 pr-4 text-sm outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((s, i) => {
          const read = s.topics.filter((t) => progress.topicsRead.includes(t.id)).length;
          const pct = Math.round((read / s.topics.length) * 100);
          const avg = stats.bySubject[s.id]?.avg;
          const simCount = s.topics.reduce((n, t) => n + (t.sims?.length ?? 0), 0);
          return (
            <motion.div key={s.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
              <Link to={`app/subject/${s.id}`} className="block h-full">
                <Card hover className="group h-full overflow-hidden">
                  <div className={cn("relative h-24 bg-gradient-to-br p-5", s.gradient)}>
                    <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_80%_-20%,rgba(255,255,255,0.35),transparent_60%)]" />
                    <span className="relative text-3xl">{s.emoji}</span>
                    <span className="absolute right-4 top-4 rounded-full bg-white/20 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur">{s.code}</span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-display text-lg font-bold tracking-tight text-slate-900">{s.name}</h3>
                    <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-slate-500">{s.description}</p>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      <Badge tone="slate">{s.topics.length} topics</Badge>
                      {!!simCount && <Badge tone="sky">{simCount} labs</Badge>}
                      {avg !== undefined && <Badge tone={avg >= 70 ? "mint" : "amber"}>{avg}% avg</Badge>}
                    </div>
                    <div className="mt-4">
                      <div className="flex justify-between text-xs text-slate-500">
                        <span>{read}/{s.topics.length} topics read</span>
                        <span className="font-semibold">{pct}%</span>
                      </div>
                      <Progress value={pct} className="mt-1.5 h-1.5" tone="mint" />
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>
          );
        })}
      </div>
      {!list.length && <Empty icon={<Search className="h-6 w-6" />} title="No subjects found" body={`Nothing matches “${q}”.`} />}
    </div>
  );
}

/* ============================ SUBJECT DETAIL ============================ */
export function SubjectDetail({ subjectId }: { subjectId: string }) {
  const { user, progress } = useApp();
  const stats = useStudentStats(user?.id);
  const subject = getSubject(subjectId);
  const [tab, setTab] = useState<"topics" | "labs" | "papers">("topics");
  const { navigate } = useRouter();
  if (!subject) return <Empty title="Subject not found" body="Check the link and try again." />;

  const read = subject.topics.filter((t) => progress.topicsRead.includes(t.id)).length;
  const sims = subject.topics.flatMap((t) => (t.sims ?? []).map((s) => ({ ...s, topic: t })));

  return (
    <div>
      <button onClick={() => navigate("app/subjects")} className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-slate-900">
        <ArrowLeft className="h-4 w-4" /> All subjects
      </button>

      <Card className="mb-6 overflow-hidden">
        <div className={cn("relative bg-gradient-to-br px-6 py-8 text-white", subject.gradient)}>
          <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_85%_-10%,rgba(255,255,255,0.35),transparent_55%)]" />
          <div className="relative flex flex-wrap items-center justify-between gap-6">
            <div>
              <span className="text-4xl">{subject.emoji}</span>
              <h1 className="mt-3 font-display text-3xl font-bold tracking-tight">{subject.name}</h1>
              <p className="mt-1.5 max-w-xl text-sm text-white/85">{subject.description}</p>
            </div>
            <div className="flex gap-6">
              <div><p className="font-display text-3xl font-bold">{subject.topics.length}</p><p className="text-xs text-white/75">Topics</p></div>
              <div><p className="font-display text-3xl font-bold">{sims.length}</p><p className="text-xs text-white/75">Virtual labs</p></div>
              <div><p className="font-display text-3xl font-bold">{stats.bySubject[subject.id]?.avg ?? "—"}{stats.bySubject[subject.id] ? "%" : ""}</p><p className="text-xs text-white/75">Your average</p></div>
            </div>
          </div>
          <div className="relative mt-6">
            <div className="flex justify-between text-xs text-white/80"><span>{read} of {subject.topics.length} topics completed</span><span>{Math.round((read / subject.topics.length) * 100)}%</span></div>
            <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-black/20">
              <motion.div initial={{ width: 0 }} animate={{ width: `${(read / subject.topics.length) * 100}%` }} transition={{ duration: 1 }} className="h-full rounded-full bg-white" />
            </div>
          </div>
        </div>
      </Card>

      <div className="mb-5">
        <Tabs id="subject" active={tab} onChange={setTab} tabs={[{ id: "topics", label: "Topics & Notes", count: subject.topics.length }, { id: "labs", label: "Virtual Labs", count: sims.length }, { id: "papers", label: "Past Papers" }]} />
      </div>

      {tab === "topics" && (
        <div className="grid gap-4 lg:grid-cols-2">
          {subject.topics.map((t, i) => {
            const done = progress.topicsRead.includes(t.id);
            const qCount = byTopic(t.id).length;
            return (
              <motion.div key={t.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Link to={`app/topic/${t.id}`}>
                  <Card hover className="group h-full p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge tone={t.level === "A" ? "violet" : t.level === "O" ? "sky" : "slate"}>{t.level === "Both" ? "O & A Level" : `${t.level}-Level`}</Badge>
                          {done && <Badge tone="mint"><CheckCircle2 className="h-3 w-3" /> Read</Badge>}
                          {!!t.sims?.length && <Badge tone="brand"><FlaskConical className="h-3 w-3" /> {t.sims.length} lab{t.sims.length > 1 ? "s" : ""}</Badge>}
                        </div>
                        <h3 className="mt-2.5 font-display text-base font-bold tracking-tight text-slate-900 transition group-hover:text-brand-600">{t.title}</h3>
                        <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-slate-500">{t.overview}</p>
                        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
                          <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {t.minutes} min</span>
                          <span className="inline-flex items-center gap-1"><Sigma className="h-3.5 w-3.5" /> {qCount} questions</span>
                          <span className="inline-flex items-center gap-1"><GraduationCap className="h-3.5 w-3.5" /> UNEB {t.years.slice(0, 3).join(", ")}</span>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-brand-500" />
                    </div>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}

      {tab === "labs" && <LabGrid sims={sims.map((s) => ({ id: s.url, title: s.title, url: s.url, provider: s.provider, description: s.description, subjectId: subject.id, topicId: s.topic.id }))} />}

      {tab === "papers" && <PastPapers subjectId={subject.id} />}
    </div>
  );
}

/* ============================ TOPIC DETAIL ============================ */
export function TopicDetail({ topicId }: { topicId: string }) {
  const { markTopicRead, toggleBookmark, progress, user } = useApp();
  const { navigate } = useRouter();
  const topic = getTopic(topicId);
  const [quiz, setQuiz] = useState<QuizConfig | null>(null);
  const [activeSim, setActiveSim] = useState<number | null>(null);

  if (!topic) return <Empty title="Topic not found" />;
  const subject = getSubject(topic.subjectId)!;
  const questions = byTopic(topic.id);
  const isRead = progress.topicsRead.includes(topic.id);
  const isSaved = progress.bookmarks.includes(topic.id);

  if (quiz) return <Quiz config={quiz} onExit={() => setQuiz(null)} />;

  return (
    <div>
      <button onClick={() => navigate(`app/subject/${subject.id}`)} className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-slate-900">
        <ArrowLeft className="h-4 w-4" /> {subject.name}
      </button>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="overflow-hidden">
            <div className={cn("bg-gradient-to-br px-6 py-6 text-white", subject.gradient)}>
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="border-white/25 bg-white/15 !text-white">{subject.emoji} {subject.name}</Badge>
                <Badge className="border-white/25 bg-white/15 !text-white">{topic.level === "Both" ? "O & A Level" : `${topic.level}-Level`}</Badge>
                <Badge className="border-white/25 bg-white/15 !text-white"><Clock className="h-3 w-3" /> {topic.minutes} min read</Badge>
              </div>
              <h1 className="mt-3 font-display text-2xl font-bold tracking-tight sm:text-3xl">{topic.title}</h1>
              <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-white/90">{topic.overview}</p>
            </div>

            <div className="p-6">
              <section>
                <h2 className="flex items-center gap-2 font-display text-lg font-bold text-slate-900">
                  <span className="grid h-7 w-7 place-items-center rounded-lg bg-brand-50 text-brand-600"><BookOpen className="h-4 w-4" /></span>
                  Key points to master
                </h2>
                <ul className="mt-4 space-y-3">
                  {topic.keyPoints.map((p, i) => (
                    <motion.li key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }} className="flex gap-3 rounded-xl bg-slate-50 p-3.5">
                      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-white text-xs font-bold text-brand-600 shadow-sm">{i + 1}</span>
                      <p className="text-[14.5px] leading-relaxed text-slate-700">{p}</p>
                    </motion.li>
                  ))}
                </ul>
              </section>

              {!!topic.formulas?.length && (
                <section className="mt-8">
                  <h2 className="flex items-center gap-2 font-display text-lg font-bold text-slate-900">
                    <span className="grid h-7 w-7 place-items-center rounded-lg bg-violet-50 text-violet-600"><Sigma className="h-4 w-4" /></span>
                    Formulae you must know
                  </h2>
                  <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
                    {topic.formulas.map((f, i) => (
                      <motion.div key={i} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }} className="rounded-xl border border-violet-100 bg-gradient-to-br from-violet-50 to-white px-4 py-3 font-mono text-[14px] text-violet-900">
                        {f}
                      </motion.div>
                    ))}
                  </div>
                </section>
              )}

              <section className="mt-8">
                <h2 className="flex items-center gap-2 font-display text-lg font-bold text-slate-900">
                  <span className="grid h-7 w-7 place-items-center rounded-lg bg-amber-50 text-amber-600"><Lightbulb className="h-4 w-4" /></span>
                  Examiner tips
                </h2>
                <ul className="mt-4 space-y-2.5">
                  {topic.examTips.map((t, i) => (
                    <li key={i} className="flex gap-3 rounded-xl border border-amber-100 bg-amber-50/60 p-3.5">
                      <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                      <p className="text-[14px] leading-relaxed text-amber-900">{t}</p>
                    </li>
                  ))}
                </ul>
              </section>

              {/* PhET labs */}
              {!!topic.sims?.length && (
                <section className="mt-8">
                  <h2 className="flex items-center gap-2 font-display text-lg font-bold text-slate-900">
                    <span className="grid h-7 w-7 place-items-center rounded-lg bg-sky-50 text-sky-600"><FlaskConical className="h-4 w-4" /></span>
                    Virtual laboratory
                  </h2>
                  <p className="mt-1.5 text-sm text-slate-500">Interactive PhET simulations from the University of Colorado Boulder. Experiment, then answer the questions below.</p>
                  <div className="mt-4 space-y-4">
                    {topic.sims.map((s, i) => (
                      <div key={s.url} className="overflow-hidden rounded-2xl border border-slate-200">
                        <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 px-4 py-3">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-slate-900">{s.title}</p>
                            <p className="mt-0.5 line-clamp-1 text-xs text-slate-500">{s.description}</p>
                          </div>
                          <div className="flex shrink-0 gap-2">
                            <Btn size="xs" variant="ghost" onClick={() => setActiveSim(activeSim === i ? null : i)} icon={activeSim === i ? <Maximize2 className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}>
                              {activeSim === i ? "Close" : "Launch"}
                            </Btn>
                            <a href={s.url} target="_blank" rel="noreferrer noopener" className="inline-flex h-8 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 transition hover:bg-slate-50">
                              <ExternalLink className="h-3.5 w-3.5" /> New tab
                            </a>
                          </div>
                        </div>
                        {activeSim === i && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} className="overflow-hidden">
                            <iframe src={s.url} title={s.title} className="h-[420px] w-full border-0 bg-black sm:h-[500px]" allowFullScreen loading="lazy" />
                          </motion.div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </Card>
        </div>

        {/* sidebar */}
        <div className="space-y-5">
          <Card className="p-5">
            <h3 className="font-display text-base font-bold text-slate-900">Practise this topic</h3>
            <p className="mt-1.5 text-sm text-slate-500">{questions.length} auto-marked questions from UNEB past papers and the Mengo Hub bank.</p>
            <div className="mt-4 space-y-2">
              <Btn
                className="w-full"
                disabled={!questions.length}
                onClick={() => setQuiz({ title: `${topic.title} — Practice`, subjectId: topic.subjectId, topicIds: [topic.id], questions, kind: "practice" })}
                icon={<Target className="h-4 w-4" />}
              >
                Start practice ({questions.length}Q)
              </Btn>
              <Btn
                variant="ghost"
                className="w-full"
                disabled={questions.length < 3}
                onClick={() => setQuiz({ title: `${topic.title} — Timed Test`, subjectId: topic.subjectId, topicIds: [topic.id], questions, kind: "mock", durationMin: Math.max(10, questions.length * 3) })}
                icon={<Clock className="h-4 w-4" />}
              >
                Timed test
              </Btn>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <Btn size="sm" variant={isRead ? "success" : "soft"} className="w-full" onClick={() => markTopicRead(topic.id)} icon={<CheckCircle2 className="h-3.5 w-3.5" />}>
                {isRead ? "Completed" : "Mark read"}
              </Btn>
              <Btn size="sm" variant="ghost" className="w-full" onClick={() => toggleBookmark(topic.id)} icon={isSaved ? <BookmarkCheck className="h-3.5 w-3.5" /> : <Bookmark className="h-3.5 w-3.5" />}>
                {isSaved ? "Saved" : "Save"}
              </Btn>
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="font-display text-base font-bold text-slate-900">UNEB appearance</h3>
            <p className="mt-1 text-sm text-slate-500">Years this topic appeared in past papers.</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {topic.years.map((y) => (
                <span key={y} className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">{y}</span>
              ))}
            </div>
            <div className="mt-4 rounded-xl bg-brand-50 p-3.5">
              <p className="text-xs font-semibold uppercase tracking-wider text-brand-700">Predictor verdict</p>
              <p className="mt-1 text-sm text-brand-900">
                Appeared in {topic.years.length} of the last 9 sittings — {topic.years.length >= 5 ? "very likely" : topic.years.length >= 3 ? "likely" : "possible"} this year.
              </p>
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="font-display text-base font-bold text-slate-900">Ask the AI tutor</h3>
            <p className="mt-1.5 text-sm text-slate-500">Stuck on something here? Get an explanation in seconds.</p>
            <Btn variant="dark" className="mt-4 w-full" onClick={() => navigate(`app/tutor?t=${topic.id}`)} icon={<Brain className="h-4 w-4" />}>
              Open tutor
            </Btn>
            {user?.plan === "free" && <p className="mt-2 text-center text-[11px] text-slate-400">Free plan: 50 questions per day</p>}
          </Card>
        </div>
      </div>
    </div>
  );
}

/* ============================ LABS ============================ */
export function LabGrid({ sims }: { sims: { id: string; title: string; url: string; provider: string; description: string; subjectId: string; topicId?: string }[] }) {
  const [open, setOpen] = useState<string | null>(null);
  if (!sims.length) return <Empty icon={<FlaskConical className="h-6 w-6" />} title="No simulations yet" body="Simulations added by your school will appear here." />;
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {sims.map((s, i) => (
        <motion.div key={s.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
          <Card className="overflow-hidden">
            <div className="flex items-start gap-3 p-5">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-sky-500 to-cyan-600 text-white shadow-lg shadow-sky-500/25">
                <FlaskConical className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-display text-[15px] font-bold text-slate-900">{s.title}</h3>
                  <Badge tone="sky">{s.provider}</Badge>
                </div>
                <p className="mt-1.5 text-[13px] leading-relaxed text-slate-500">{s.description}</p>
                {s.topicId && (
                  <Link to={`app/topic/${s.topicId}`} className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700">
                    {getTopic(s.topicId)?.title} <ArrowRight className="h-3 w-3" />
                  </Link>
                )}
                <div className="mt-3.5 flex gap-2">
                  <Btn size="sm" onClick={() => setOpen(open === s.id ? null : s.id)} icon={<Play className="h-3.5 w-3.5" />}>
                    {open === s.id ? "Close lab" : "Launch lab"}
                  </Btn>
                  <a href={s.url} target="_blank" rel="noreferrer noopener" className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 text-[13px] font-semibold text-slate-700 transition hover:bg-slate-50">
                    <ExternalLink className="h-3.5 w-3.5" /> Open
                  </a>
                </div>
              </div>
            </div>
            {open === s.id && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} className="overflow-hidden border-t border-slate-100">
                <iframe src={s.url} title={s.title} className="h-[440px] w-full border-0 bg-black" allowFullScreen loading="lazy" />
                <p className="bg-slate-50 px-4 py-2 text-[11px] text-slate-500">
                  Simulation by PhET Interactive Simulations, University of Colorado Boulder — licensed CC-BY 4.0. If the frame does not load, use “Open”.
                </p>
              </motion.div>
            )}
          </Card>
        </motion.div>
      ))}
    </div>
  );
}

export function Labs() {
  const { state, user, addSim } = useApp();
  const [subj, setSubj] = useState<string>("all");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", url: "", subjectId: "physics", description: "" });
  const sims = state.sims.filter((s) => subj === "all" || s.subjectId === subj);
  const canAdd = user?.role === "teacher" || user?.role === "admin";
  return (
    <div>
      <PageTitle
        title="Virtual Laboratories"
        subtitle="Run real physics, chemistry, biology and maths experiments right in your browser — no apparatus needed."
        action={canAdd ? <Btn onClick={() => setOpen(true)} icon={<Plus className="h-4 w-4" />}>Add simulation</Btn> : undefined}
      />
      <Modal open={open} onClose={() => setOpen(false)} title="Add a simulation">
        <div className="space-y-4">
          <Field label="Title">
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Gravity and Orbits" className={inputCls} />
          </Field>
          <Field label="Embed URL" hint="PhET: https://phet.colorado.edu/sims/html/<name>/latest/<name>_en.html">
            <input value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="https://phet.colorado.edu/sims/html/…" className={inputCls} />
          </Field>
          <Field label="Subject">
            <select value={form.subjectId} onChange={(e) => setForm({ ...form, subjectId: e.target.value })} className={inputCls}>
              {SUBJECTS.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </Field>
          <Field label="Description">
            <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="What will learners do in this simulation?" className={inputCls} />
          </Field>
          <Btn
            className="w-full"
            disabled={!form.title.trim() || !form.url.startsWith("http")}
            onClick={() => {
              addSim({ ...form, title: form.title.trim(), url: form.url.trim(), provider: form.url.includes("phet.colorado.edu") ? "PhET" : "Custom", description: form.description.trim() || "Interactive simulation added by your school." });
              setForm({ title: "", url: "", subjectId: "physics", description: "" });
              setOpen(false);
            }}
          >
            Add to library
          </Btn>
        </div>
      </Modal>
      <div className="mb-5 flex flex-wrap gap-2">
        <button onClick={() => setSubj("all")} className={cn("rounded-xl border px-3.5 py-2 text-[13px] font-semibold transition", subj === "all" ? "border-brand-500 bg-brand-50 text-brand-700" : "border-slate-200 bg-white text-slate-600 hover:border-slate-300")}>
          All ({state.sims.length})
        </button>
        {SUBJECTS.filter((s) => state.sims.some((x) => x.subjectId === s.id)).map((s) => (
          <button key={s.id} onClick={() => setSubj(s.id)} className={cn("rounded-xl border px-3.5 py-2 text-[13px] font-semibold transition", subj === s.id ? "border-brand-500 bg-brand-50 text-brand-700" : "border-slate-200 bg-white text-slate-600 hover:border-slate-300")}>
            {s.emoji} {s.name}
          </button>
        ))}
      </div>
      <LabGrid sims={sims} />
    </div>
  );
}

/* ============================ PAST PAPERS ============================ */
function PastPapers({ subjectId }: { subjectId: string }) {
  const { state } = useApp();
  const res = state.resources.filter((r) => r.subjectId === subjectId);
  const years = [2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016];
  return (
    <div className="space-y-5">
      <Card>
        <CardHead title="UNEB past papers" subtitle="Download and revise offline. Marking guides included." />
        <div className="grid gap-2 p-4 sm:grid-cols-3">
          {years.map((y, i) => (
            <motion.a
              key={y}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              href={`https://www.google.com/search?q=UNEB+${encodeURIComponent(getSubject(subjectId)?.name ?? "")}+${y}+past+paper`}
              target="_blank"
              rel="noreferrer noopener"
              className="group flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3 transition hover:border-brand-300 hover:bg-brand-50/50"
            >
              <span>
                <span className="block text-sm font-semibold text-slate-900">{y} Paper 1 & 2</span>
                <span className="block text-xs text-slate-500">With marking guide</span>
              </span>
              <ExternalLink className="h-4 w-4 text-slate-300 transition group-hover:text-brand-500" />
            </motion.a>
          ))}
        </div>
      </Card>
      <Card>
        <CardHead title="School resources" subtitle={`${res.length} items shared by your teachers`} />
        <div className="divide-y divide-slate-50">
          {res.map((r) => (
            <div key={r.id} className="flex items-center gap-3 px-5 py-3.5">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-slate-100 text-slate-600">
                {r.kind === "audio" ? "🎧" : r.kind === "past-paper" ? "📄" : "📘"}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-900">{r.title}</p>
                <p className="text-xs text-slate-500">{r.by} · {r.size} · {ago(r.at)}</p>
              </div>
              <Badge tone="slate">{r.kind}</Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
