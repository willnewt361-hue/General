import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, ArrowLeft, ArrowRight, Check, CheckCircle2, Clock, Flag, RotateCcw, Sparkles, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "../utils/cn";
import { gradeFor, markAnswer, type Question } from "../data/questions";
import { getTopic } from "../data/curriculum";
import { useApp } from "../lib/store";
import { Badge, Btn, Card, Progress, Ring, ease } from "./Kit";
import type { Answer } from "../lib/types";

export interface QuizConfig {
  title: string;
  subjectId: string;
  topicIds: string[];
  questions: Question[];
  kind: "practice" | "assignment" | "mock";
  durationMin?: number;
  assignmentId?: string;
}

export function Quiz({ config, onExit }: { config: QuizConfig; onExit: () => void }) {
  const { saveAttempt, issueCertificate } = useApp();
  const [idx, setIdx] = useState(0);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [flagged, setFlagged] = useState<Set<string>>(new Set());
  const [submitted, setSubmitted] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [left, setLeft] = useState((config.durationMin ?? 0) * 60);
  const started = useRef(Date.now());
  const savedRef = useRef(false);

  const qs = config.questions;
  const q = qs[idx];
  const answeredCount = qs.filter((x) => responses[x.id]?.trim()).length;

  // countdown
  useEffect(() => {
    if (!config.durationMin || submitted) return;
    const t = setInterval(() => {
      setLeft((v) => {
        if (v <= 1) {
          clearInterval(t);
          setSubmitted(true);
          return 0;
        }
        return v - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [config.durationMin, submitted]);

  const result = useMemo(() => {
    if (!submitted) return null;
    const answers: Answer[] = qs.map((question) => {
      const given = responses[question.id] ?? "";
      const { correct, marks } = markAnswer(question, given);
      return { questionId: question.id, given, correct, marks, max: question.marks };
    });
    const score = answers.reduce((s, a) => s + a.marks, 0);
    const total = qs.reduce((s, x) => s + x.marks, 0);
    const percent = total ? Math.round((score / total) * 100) : 0;
    return { answers, score, total, percent, grade: gradeFor(percent) };
  }, [submitted, qs, responses]);

  // persist once
  useEffect(() => {
    if (!result || savedRef.current) return;
    savedRef.current = true;
    saveAttempt({
      kind: config.kind,
      title: config.title,
      subjectId: config.subjectId,
      topicIds: config.topicIds,
      answers: result.answers,
      score: result.score,
      total: result.total,
      percent: result.percent,
      grade: result.grade.grade,
      durationSec: Math.round((Date.now() - started.current) / 1000),
      assignmentId: config.assignmentId,
    });
    if (result.percent >= 80 && config.kind !== "practice") {
      issueCertificate(config.subjectId, result.percent, result.grade.grade, `${config.title} — Distinction`);
    }
  }, [result, config, saveAttempt, issueCertificate]);

  const mmss = `${String(Math.floor(left / 60)).padStart(2, "0")}:${String(left % 60).padStart(2, "0")}`;
  const lowTime = config.durationMin ? left < 60 : false;

  /* ---------------- Results view ---------------- */
  if (submitted && result) {
    return (
      <div className="mx-auto max-w-4xl">
        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, ease }}>
          <Card className="overflow-hidden">
            <div className="relative bg-ink-900 px-6 py-10 text-center text-white noise">
              <div aria-hidden className="absolute inset-0 grid-pattern-dark [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
              <div aria-hidden className="pointer-events-none absolute -top-20 left-1/2 h-64 w-96 -translate-x-1/2 rounded-full bg-brand-600/30 blur-3xl" />
              <div className="relative">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-300">{config.kind === "mock" ? "Mock exam result" : config.kind === "assignment" ? "Assignment submitted" : "Practice complete"}</p>
                <h2 className="mt-2 font-display text-2xl font-bold sm:text-3xl">{config.title}</h2>
                <div className="mt-7 flex flex-wrap items-center justify-center gap-8">
                  <div className="rounded-3xl bg-white/5 p-4 ring-1 ring-white/10">
                    <Ring value={result.percent} size={132} label={`${result.percent}%`} sub="score" />
                  </div>
                  <div className="text-left">
                    <p className="font-display text-5xl font-bold">{result.grade.grade}</p>
                    <p className="mt-1 text-sm text-slate-300">{result.grade.label} · UNEB scale</p>
                    <p className="mt-4 text-sm text-slate-400">
                      {result.score} of {result.total} marks · {result.answers.filter((a) => a.correct).length}/{qs.length} correct
                    </p>
                    <p className="mt-1 text-sm text-slate-400">Time taken {Math.round((Date.now() - started.current) / 60000)} min</p>
                  </div>
                </div>
                {result.percent >= 80 && (
                  <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="mt-6 inline-flex items-center gap-2 rounded-full bg-gold-400/15 px-4 py-2 text-sm font-semibold text-gold-300">
                    <Sparkles className="h-4 w-4" /> Distinction! {config.kind !== "practice" && "A certificate has been added to your profile."}
                  </motion.p>
                )}
              </div>
            </div>

            <div className="p-5 sm:p-6">
              <h3 className="font-display text-lg font-bold text-slate-900">Question review</h3>
              <p className="mt-1 text-sm text-slate-500">Read every explanation — this is where the marks come from next time.</p>
              <ol className="mt-5 space-y-4">
                {qs.map((question, i) => {
                  const a = result.answers[i];
                  const isMcq = question.type === "mcq";
                  return (
                    <motion.li key={question.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }} className={cn("rounded-2xl border p-4", a.correct ? "border-mint-500/30 bg-mint-500/5" : a.marks > 0 ? "border-amber-200 bg-amber-50/60" : "border-rose-200 bg-rose-50/50")}>
                      <div className="flex items-start gap-3">
                        <span className={cn("mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full text-white", a.correct ? "bg-mint-500" : a.marks > 0 ? "bg-amber-500" : "bg-rose-500")}>
                          {a.correct ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : <X className="h-3.5 w-3.5" strokeWidth={3} />}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-slate-900">
                            {i + 1}. {question.prompt}
                          </p>
                          <div className="mt-2 space-y-1 text-[13px]">
                            <p className="text-slate-600">
                              <span className="font-medium text-slate-500">Your answer: </span>
                              {a.given ? (isMcq ? question.options![Number(a.given)] : a.given) : <em className="text-slate-400">not answered</em>}
                            </p>
                            {isMcq && !a.correct && (
                              <p className="text-mint-700">
                                <span className="font-medium">Correct answer: </span>
                                {question.options![question.answer as number]}
                              </p>
                            )}
                            {question.type === "short" && !a.correct && (
                              <p className="text-mint-700">
                                <span className="font-medium">Accepted: </span>
                                {(question.answer as string[])[0]}
                              </p>
                            )}
                          </div>
                          <p className="mt-2.5 rounded-lg bg-white/70 px-3 py-2 text-[13px] leading-relaxed text-slate-600 ring-1 ring-slate-200/60">
                            <span className="font-semibold text-slate-800">Why: </span>
                            {question.explanation}
                          </p>
                        </div>
                        <span className="shrink-0 text-xs font-bold tabular-nums text-slate-500">
                          {a.marks}/{a.max}
                        </span>
                      </div>
                    </motion.li>
                  );
                })}
              </ol>

              <div className="mt-7 flex flex-wrap gap-3">
                <Btn onClick={onExit} icon={<ArrowLeft className="h-4 w-4" />} variant="ghost">
                  Back
                </Btn>
                <Btn
                  onClick={() => {
                    setResponses({});
                    setSubmitted(false);
                    setIdx(0);
                    setLeft((config.durationMin ?? 0) * 60);
                    savedRef.current = false;
                    started.current = Date.now();
                  }}
                  icon={<RotateCcw className="h-4 w-4" />}
                >
                  Try again
                </Btn>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  /* ---------------- Quiz view ---------------- */
  return (
    <div className="mx-auto max-w-4xl">
      <Card className="overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
          <div className="min-w-0">
            <h2 className="truncate font-display text-base font-bold text-slate-900">{config.title}</h2>
            <p className="mt-0.5 text-xs text-slate-500">
              {getTopic(config.topicIds[0])?.title ?? "Mixed topics"} · {qs.length} questions · {qs.reduce((s, x) => s + x.marks, 0)} marks
            </p>
          </div>
          <div className="flex items-center gap-3">
            {!!config.durationMin && (
              <span className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-bold tabular-nums", lowTime ? "animate-pulse bg-rose-50 text-rose-600" : "bg-slate-100 text-slate-700")}>
                <Clock className="h-4 w-4" /> {mmss}
              </span>
            )}
            <button onClick={onExit} className="grid h-9 w-9 place-items-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700" aria-label="Exit quiz">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="border-b border-slate-100 px-5 py-3">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>
              Question {idx + 1} of {qs.length}
            </span>
            <span>
              {answeredCount} answered · {qs.length - answeredCount} remaining
            </span>
          </div>
          <Progress value={(answeredCount / qs.length) * 100} className="mt-2" tone="mint" />
        </div>

        {/* question navigator */}
        <div className="flex flex-wrap gap-1.5 border-b border-slate-100 px-5 py-3">
          {qs.map((question, i) => {
            const done = !!responses[question.id]?.trim();
            return (
              <button
                key={question.id}
                onClick={() => setIdx(i)}
                aria-label={`Go to question ${i + 1}`}
                className={cn(
                  "relative h-8 w-8 rounded-lg text-xs font-bold transition",
                  i === idx ? "bg-brand-600 text-white shadow-md shadow-brand-500/30" : done ? "bg-mint-500/15 text-mint-700 hover:bg-mint-500/25" : "bg-slate-100 text-slate-500 hover:bg-slate-200",
                )}
              >
                {i + 1}
                {flagged.has(question.id) && <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-amber-400 ring-2 ring-white" />}
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={q.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }} className="p-5 sm:p-7">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="brand">{q.marks} {q.marks === 1 ? "mark" : "marks"}</Badge>
              <Badge tone={q.difficulty === 1 ? "mint" : q.difficulty === 2 ? "amber" : "rose"}>
                {q.difficulty === 1 ? "Foundation" : q.difficulty === 2 ? "Standard" : "Challenge"}
              </Badge>
              {!!q.years.length && <Badge tone="slate">UNEB {q.years.slice(0, 3).join(", ")}</Badge>}
              <button
                onClick={() => setFlagged((f) => { const n = new Set(f); n.has(q.id) ? n.delete(q.id) : n.add(q.id); return n; })}
                className={cn("ml-auto inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold transition", flagged.has(q.id) ? "border-amber-300 bg-amber-50 text-amber-700" : "border-slate-200 text-slate-500 hover:border-slate-300")}
              >
                <Flag className="h-3.5 w-3.5" /> {flagged.has(q.id) ? "Flagged" : "Flag"}
              </button>
            </div>

            <p className="mt-5 font-display text-lg font-semibold leading-relaxed text-slate-900 sm:text-xl">{q.prompt}</p>

            {q.type === "mcq" && (
              <div className="mt-6 space-y-2.5">
                {q.options!.map((opt, i) => {
                  const selected = responses[q.id] === String(i);
                  return (
                    <button
                      key={i}
                      onClick={() => setResponses((r) => ({ ...r, [q.id]: String(i) }))}
                      className={cn(
                        "flex w-full items-center gap-3.5 rounded-xl border p-4 text-left transition-all duration-200",
                        selected ? "border-brand-500 bg-brand-50 ring-2 ring-brand-500/20" : "border-slate-200 hover:border-brand-300 hover:bg-slate-50",
                      )}
                    >
                      <span className={cn("grid h-7 w-7 shrink-0 place-items-center rounded-lg text-xs font-bold transition", selected ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-600")}>
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span className={cn("text-[15px]", selected ? "font-medium text-slate-900" : "text-slate-700")}>{opt}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {q.type === "short" && (
              <div className="mt-6">
                <input
                  value={responses[q.id] ?? ""}
                  onChange={(e) => setResponses((r) => ({ ...r, [q.id]: e.target.value }))}
                  placeholder="Type your answer…"
                  className="h-14 w-full rounded-xl border border-slate-200 px-4 text-base outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10"
                />
                <p className="mt-2 text-xs text-slate-500">Short answers are marked automatically. Spelling variations and units are accepted.</p>
              </div>
            )}

            {q.type === "structured" && (
              <div className="mt-6">
                <textarea
                  value={responses[q.id] ?? ""}
                  onChange={(e) => setResponses((r) => ({ ...r, [q.id]: e.target.value }))}
                  rows={9}
                  placeholder="Write your full answer here. Include each stage of your working or argument…"
                  className="w-full rounded-xl border border-slate-200 p-4 text-[15px] leading-relaxed outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10"
                />
                <p className="mt-2 flex items-start gap-1.5 text-xs text-slate-500">
                  <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  Structured answers are marked against the official mark scheme using keyword analysis. Cover every point for full marks.
                </p>
              </div>
            )}

            <div className="mt-8 flex items-center justify-between gap-3">
              <Btn variant="ghost" disabled={idx === 0} onClick={() => setIdx((i) => i - 1)} icon={<ArrowLeft className="h-4 w-4" />}>
                Previous
              </Btn>
              {idx < qs.length - 1 ? (
                <Btn onClick={() => setIdx((i) => i + 1)}>
                  Next <ArrowRight className="h-4 w-4" />
                </Btn>
              ) : (
                <Btn variant="success" onClick={() => setConfirmOpen(true)} icon={<CheckCircle2 className="h-4 w-4" />}>
                  Submit for marking
                </Btn>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </Card>

      <AnimatePresence>
        {confirmOpen && (
          <div className="fixed inset-0 z-[70] grid place-items-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setConfirmOpen(false)} className="absolute inset-0 bg-ink-950/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, y: 24, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }} className="relative w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-2xl">
              <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-brand-50 text-brand-600">
                <CheckCircle2 className="h-6 w-6" />
              </span>
              <h3 className="mt-4 font-display text-lg font-bold text-slate-900">Submit for marking?</h3>
              <p className="mt-2 text-sm text-slate-500">
                You have answered {answeredCount} of {qs.length} questions.
                {answeredCount < qs.length && " Unanswered questions score zero."}
              </p>
              <div className="mt-6 flex gap-3">
                <Btn variant="ghost" className="flex-1" onClick={() => setConfirmOpen(false)}>
                  Keep working
                </Btn>
                <Btn variant="success" className="flex-1" onClick={() => { setConfirmOpen(false); setSubmitted(true); }}>
                  Submit
                </Btn>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
