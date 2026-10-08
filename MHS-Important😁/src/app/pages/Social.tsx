import { AnimatePresence, motion } from "framer-motion";
import { Bell, Bookmark, Brain, Hash, Lightbulb, Megaphone, Pin, Send, Sparkles, Users } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "../../utils/cn";
import { useRouter } from "../../router";
import { ALL_TOPICS, SUBJECTS, getSubject, getTopic, type Topic } from "../../data/curriculum";
import { byTopic } from "../../data/questions";
import { useApp } from "../../lib/store";
import { Avatar, Badge, Btn, Card, CardHead, Empty, Field, Modal, PageTitle, ago, fmtDate, inputCls } from "../Kit";
import { Quiz, type QuizConfig } from "../Quiz";

/* ============================ AI TUTOR ============================ */
interface Msg {
  id: string;
  role: "user" | "tutor";
  text: string;
  topic?: Topic;
  suggestions?: string[];
}

const STOP = new Set(["what", "how", "why", "the", "and", "for", "you", "can", "explain", "tell", "about", "does", "with", "this", "that", "give", "some", "please", "help", "understand", "difference", "between", "define", "definition", "meaning", "mean", "example", "examples", "a", "an", "is", "are", "of", "in", "on", "to", "me", "my", "i"]);

function findTopic(query: string): { topic: Topic; score: number } | null {
  const words = query.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter((w) => w.length > 2 && !STOP.has(w));
  if (!words.length) return null;
  let best: { topic: Topic; score: number } | null = null;
  for (const t of ALL_TOPICS) {
    const hay = `${t.title} ${t.overview} ${t.keyPoints.join(" ")} ${(t.formulas ?? []).join(" ")}`.toLowerCase();
    let score = 0;
    for (const w of words) {
      if (t.title.toLowerCase().includes(w)) score += 5;
      else if (hay.includes(w)) score += 1.5;
    }
    const subject = getSubject(t.subjectId)!;
    if (words.some((w) => subject.name.toLowerCase().includes(w))) score += 1;
    if (!best || score > best.score) best = { topic: t, score };
  }
  return best && best.score >= 3 ? best : null;
}

function buildAnswer(query: string): Msg {
  const q = query.toLowerCase();
  const hit = findTopic(query);

  if (/^(hi|hello|hey|yo|good (morning|afternoon|evening))\b/.test(q.trim())) {
    return {
      id: String(Math.random()),
      role: "tutor",
      text: "Hello! 👋 I'm your Mengo Hub tutor. I know every topic in the UNEB syllabus loaded on this platform — Mathematics, Physics, Chemistry, Biology, History, English, Geography and ICT.\n\nAsk me to explain a concept, give you a formula, or quiz you on a topic.",
      suggestions: ["Explain projectile motion", "What is esterification?", "Quiz me on genetics", "Formulas for quadratic equations"],
    };
  }

  if (!hit) {
    return {
      id: String(Math.random()),
      role: "tutor",
      text: "I couldn't match that to a topic in the loaded syllabus yet. Try naming the concept directly — for example “Ohm's law”, “the mole concept”, “the Buganda Agreement” or “osmosis”.\n\nYou can also browse Subjects & Notes to see everything I cover.",
      suggestions: ["Explain Ohm's law", "The mole concept", "Buganda Agreement 1900", "What is osmosis?"],
    };
  }

  const t = hit.topic;
  const subject = getSubject(t.subjectId)!;
  const wantsFormula = /formula|equation|expression/.test(q);
  const wantsTips = /tip|exam|mark|score|pass/.test(q);
  const wantsQuiz = /quiz|test|question|practi/.test(q);

  if (wantsQuiz) {
    return {
      id: String(Math.random()),
      role: "tutor",
      topic: t,
      text: `Let's test you on **${t.title}** (${subject.name}). There are ${byTopic(t.id).length} auto-marked questions ready, including past-paper items from ${t.years.slice(0, 3).join(", ")}.\n\nTap “Start quiz” below and I'll mark every answer with a full explanation.`,
      suggestions: [`Explain ${t.title}`, `Exam tips for ${t.title}`],
    };
  }

  let body = `**${t.title}** — ${subject.name}\n\n${t.overview}\n\n`;
  if (wantsFormula && t.formulas?.length) {
    body += `**Key formulae**\n${t.formulas.map((f) => `• ${f}`).join("\n")}\n\n`;
    body += `**Remember:** ${t.examTips[0]}`;
  } else if (wantsTips) {
    body += `**Examiner tips**\n${t.examTips.map((x) => `• ${x}`).join("\n")}`;
  } else {
    body += `**The key things to know**\n${t.keyPoints.slice(0, 4).map((k) => `• ${k}`).join("\n")}`;
    if (t.formulas?.length) body += `\n\n**Formulae:** ${t.formulas.slice(0, 3).join("  ·  ")}`;
  }
  body += `\n\nThis topic appeared in UNEB papers in ${t.years.slice(0, 5).join(", ")}${t.sims?.length ? `. There is also a ${t.sims[0].provider} virtual lab you can run for it.` : "."}`;

  return {
    id: String(Math.random()),
    role: "tutor",
    topic: t,
    text: body,
    suggestions: [`Quiz me on ${t.title}`, `Exam tips for ${t.title}`, t.formulas?.length ? `Formulas for ${t.title}` : `Explain ${t.title} simply`],
  };
}

function Markdownish({ text }: { text: string }) {
  return (
    <div className="space-y-2">
      {text.split("\n").map((line, i) => {
        if (!line.trim()) return null;
        const parts = line.split(/(\*\*[^*]+\*\*)/g);
        return (
          <p key={i} className={cn("text-[14.5px] leading-relaxed", line.startsWith("•") && "pl-3")}>
            {parts.map((p, j) =>
              p.startsWith("**") && p.endsWith("**") ? (
                <b key={j} className="font-semibold text-slate-900">{p.slice(2, -2)}</b>
              ) : (
                <span key={j}>{p}</span>
              ),
            )}
          </p>
        );
      })}
    </div>
  );
}

export function Tutor() {
  const { user } = useApp();
  const { path } = useRouter();
  const initialTopic = useMemo(() => {
    const m = window.location.hash.match(/t=([\w-]+)/);
    return m ? getTopic(m[1]) : undefined;
  }, [path]);

  const [msgs, setMsgs] = useState<Msg[]>(() => [
    {
      id: "welcome",
      role: "tutor",
      text: `Hello ${user?.name.split(" ")[1] ?? ""}! 👋 I'm your Mengo Hub AI tutor, trained on the full UNEB syllabus loaded in this system.\n\nAsk me to **explain a concept**, list **formulae**, share **examiner tips**, or **quiz you** on any topic.`,
      suggestions: initialTopic ? [`Explain ${initialTopic.title}`, `Quiz me on ${initialTopic.title}`] : ["Explain projectile motion", "What is the mole concept?", "Quiz me on genetics", "Exam tips for summary writing"],
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [quiz, setQuiz] = useState<QuizConfig | null>(null);
  const [used, setUsed] = useState(0);
  const endRef = useRef<HTMLDivElement>(null);

  const limit = user?.plan === "free" ? 50 : Infinity;

  useEffect(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), [msgs, typing]);

  const send = (text: string) => {
    if (!text.trim() || typing || used >= limit) return;
    setMsgs((m) => [...m, { id: String(Math.random()), role: "user", text: text.trim() }]);
    setInput("");
    setTyping(true);
    setUsed((u) => u + 1);
    setTimeout(() => {
      setMsgs((m) => [...m, buildAnswer(text)]);
      setTyping(false);
    }, 700 + Math.random() * 500);
  };

  if (quiz) return <Quiz config={quiz} onExit={() => setQuiz(null)} />;

  return (
    <div>
      <PageTitle title="AI Tutor" subtitle="Your 24/7 study companion — trained on the Mengo Hub UNEB knowledge base." action={<Badge tone={user?.plan === "free" ? "amber" : "mint"}>{user?.plan === "free" ? `${limit - used} questions left today` : "Unlimited"}</Badge>} />

      <div className="grid gap-5 lg:grid-cols-4">
        <Card className="flex h-[70vh] flex-col overflow-hidden lg:col-span-3">
          <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-3.5">
            <span className="relative grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-mint-500 text-white">
              <Brain className="h-4.5 w-4.5" />
              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-mint-400 ring-2 ring-white" />
            </span>
            <div>
              <p className="text-sm font-bold text-slate-900">Mengo Hub Tutor</p>
              <p className="text-xs text-mint-600">Online · knows {ALL_TOPICS.length} topics</p>
            </div>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto p-5">
            {msgs.map((m) => (
              <motion.div key={m.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className={cn("flex gap-3", m.role === "user" && "flex-row-reverse")}>
                {m.role === "tutor" ? (
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-mint-500 text-white"><Brain className="h-4 w-4" /></span>
                ) : (
                  <Avatar name={user?.name ?? "You"} hue={user?.hue ?? 240} size={32} />
                )}
                <div className={cn("max-w-[85%] rounded-2xl px-4 py-3", m.role === "user" ? "rounded-br-md bg-brand-600 text-white" : "rounded-bl-md bg-slate-100 text-slate-700")}>
                  {m.role === "user" ? <p className="text-[14.5px]">{m.text}</p> : <Markdownish text={m.text} />}
                  {m.topic && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button onClick={() => setQuiz({ title: `${m.topic!.title} — Tutor Quiz`, subjectId: m.topic!.subjectId, topicIds: [m.topic!.id], questions: byTopic(m.topic!.id), kind: "practice" })} className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-brand-700">
                        <Sparkles className="h-3 w-3" /> Start quiz ({byTopic(m.topic.id).length}Q)
                      </button>
                      <a href={`#/app/topic/${m.topic.id}`} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50">
                        <Bookmark className="h-3 w-3" /> Read full notes
                      </a>
                    </div>
                  )}
                  {!!m.suggestions?.length && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {m.suggestions.map((s) => (
                        <button key={s} onClick={() => send(s)} className="rounded-full border border-slate-300 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-600 transition hover:border-brand-400 hover:text-brand-600">
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
            <AnimatePresence>
              {typing && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex gap-3">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-mint-500 text-white"><Brain className="h-4 w-4" /></span>
                  <div className="flex items-center gap-1 rounded-2xl rounded-bl-md bg-slate-100 px-4 py-3.5">
                    {[0, 1, 2].map((i) => (
                      <motion.span key={i} animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }} className="h-2 w-2 rounded-full bg-slate-400" />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={endRef} />
          </div>

          <form
            onSubmit={(e) => { e.preventDefault(); send(input); }}
            className="flex items-center gap-2 border-t border-slate-100 p-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={used >= limit ? "Daily limit reached — upgrade for unlimited" : "Ask anything about your subjects…"}
              disabled={used >= limit}
              className="h-11 flex-1 rounded-xl border border-slate-200 px-4 text-sm outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 disabled:bg-slate-50"
            />
            <Btn type="submit" disabled={!input.trim() || typing || used >= limit} className="h-11 w-11 !px-0" aria-label="Send">
              <Send className="h-4 w-4" />
            </Btn>
          </form>
        </Card>

        <div className="space-y-5">
          <Card className="p-5">
            <h3 className="flex items-center gap-2 font-display text-sm font-bold text-slate-900"><Lightbulb className="h-4 w-4 text-amber-500" /> Try asking</h3>
            <div className="mt-3 space-y-2">
              {["Explain Ohm's law", "Formulas for differentiation", "Quiz me on the mole concept", "Exam tips for the Buganda Agreement", "What is total internal reflection?"].map((s) => (
                <button key={s} onClick={() => send(s)} className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-left text-[13px] text-slate-600 transition hover:border-brand-300 hover:bg-brand-50/50 hover:text-brand-700">
                  {s}
                </button>
              ))}
            </div>
          </Card>
          <Card className="p-5">
            <h3 className="font-display text-sm font-bold text-slate-900">What the tutor knows</h3>
            <div className="mt-3 space-y-2">
              {SUBJECTS.map((s) => (
                <div key={s.id} className="flex items-center justify-between text-[13px]">
                  <span className="text-slate-600">{s.emoji} {s.name}</span>
                  <span className="font-semibold text-slate-400">{s.topics.length}</span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-[11px] leading-relaxed text-slate-400">The tutor answers strictly from the loaded UNEB knowledge base, so it never invents facts. It will not answer graded assignment questions for you.</p>
          </Card>
        </div>
      </div>
    </div>
  );
}

/* ============================ COMMUNITY CHAT ============================ */
export function Community() {
  const { state, user, postMessage } = useApp();
  const [room, setRoom] = useState("math");
  const [text, setText] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  const msgs = state.messages.filter((m) => m.room === room).sort((a, b) => a.at - b.at);

  useEffect(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), [msgs.length, room]);
  if (!user) return null;

  return (
    <div>
      <PageTitle title="Class Chat" subtitle="Teacher-moderated subject rooms. Ask questions, share resources, help each other." />
      <div className="grid gap-5 lg:grid-cols-4">
        <Card className="h-fit lg:col-span-1">
          <CardHead title="Rooms" subtitle={`${SUBJECTS.length} subject channels`} icon={<Hash className="h-4 w-4 text-brand-500" />} />
          <div className="p-2">
            {SUBJECTS.map((s) => {
              const count = state.messages.filter((m) => m.room === s.id).length;
              return (
                <button key={s.id} onClick={() => setRoom(s.id)} className={cn("flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-[13.5px] transition", room === s.id ? "bg-brand-50 font-semibold text-brand-700" : "text-slate-600 hover:bg-slate-50")}>
                  <span>{s.emoji}</span>
                  <span className="flex-1 truncate">{s.name}</span>
                  {!!count && <span className="rounded-full bg-slate-200/70 px-1.5 text-[10px] font-bold text-slate-600">{count}</span>}
                </button>
              );
            })}
          </div>
        </Card>

        <Card className="flex h-[70vh] flex-col overflow-hidden lg:col-span-3">
          <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-3.5">
            <span className="text-xl">{getSubject(room)?.emoji}</span>
            <div>
              <p className="text-sm font-bold text-slate-900">#{getSubject(room)?.name.toLowerCase().replace(/\s+/g, "-")}</p>
              <p className="text-xs text-slate-500">{msgs.length} messages · moderated by teachers</p>
            </div>
            <Badge tone="mint" className="ml-auto"><Users className="h-3 w-3" /> {state.users.filter((u) => u.role === "student").length} members</Badge>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto p-5">
            {msgs.map((m) => {
              const mine = m.userId === user.id;
              return (
                <motion.div key={m.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={cn("flex gap-3", mine && "flex-row-reverse")}>
                  <Avatar name={m.name} hue={m.hue} size={34} />
                  <div className={cn("max-w-[78%]", mine && "text-right")}>
                    <div className={cn("flex items-center gap-2", mine && "flex-row-reverse")}>
                      <span className="text-[13px] font-semibold text-slate-900">{mine ? "You" : m.name}</span>
                      {m.role === "teacher" && <Badge tone="brand">Teacher</Badge>}
                      <span className="text-[11px] text-slate-400">{ago(m.at)}</span>
                    </div>
                    <div className={cn("mt-1 inline-block rounded-2xl px-4 py-2.5 text-left text-[14.5px] leading-relaxed", mine ? "rounded-br-md bg-brand-600 text-white" : m.role === "teacher" ? "rounded-bl-md border border-brand-200 bg-brand-50 text-slate-800" : "rounded-bl-md bg-slate-100 text-slate-700")}>
                      {m.text}
                    </div>
                  </div>
                </motion.div>
              );
            })}
            {!msgs.length && <Empty icon={<Hash className="h-6 w-6" />} title="No messages yet" body="Be the first to start the conversation in this room." />}
            <div ref={endRef} />
          </div>

          <form onSubmit={(e) => { e.preventDefault(); postMessage(room, text); setText(""); }} className="flex items-center gap-2 border-t border-slate-100 p-3">
            <input value={text} onChange={(e) => setText(e.target.value)} placeholder={`Message #${getSubject(room)?.name.toLowerCase()}…`} className="h-11 flex-1 rounded-xl border border-slate-200 px-4 text-sm outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10" />
            <Btn type="submit" disabled={!text.trim()} className="h-11 w-11 !px-0" aria-label="Send message">
              <Send className="h-4 w-4" />
            </Btn>
          </form>
        </Card>
      </div>
    </div>
  );
}

/* ============================ ANNOUNCEMENTS ============================ */
export function Announcements() {
  const { state, user, addAnnouncement } = useApp();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [audience, setAudience] = useState<"all" | "students" | "teachers">("all");
  if (!user) return null;

  const canPost = user.role !== "student";
  const list = state.announcements
    .filter((a) => user.role !== "student" || a.audience === "all" || a.audience === "students")
    .sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0) || b.at - a.at);

  return (
    <div>
      <PageTitle
        title="Announcements"
        subtitle="Official notices from the school administration and your teachers."
        action={canPost ? <Btn onClick={() => setOpen(true)} icon={<Megaphone className="h-4 w-4" />}>New announcement</Btn> : undefined}
      />

      <div className="space-y-4">
        {list.map((a, i) => (
          <motion.div key={a.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
            <Card className={cn("p-5", a.pinned && "border-brand-300 bg-brand-50/40")}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex min-w-0 items-start gap-3">
                  <span className={cn("grid h-10 w-10 shrink-0 place-items-center rounded-xl", a.authorRole === "admin" ? "bg-gradient-to-br from-amber-400 to-orange-500 text-white" : "bg-gradient-to-br from-brand-500 to-brand-600 text-white")}>
                    {a.pinned ? <Pin className="h-5 w-5" /> : <Bell className="h-5 w-5" />}
                  </span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-display text-base font-bold text-slate-900">{a.title}</h3>
                      {a.pinned && <Badge tone="brand">Pinned</Badge>}
                      <Badge tone="slate">{a.audience === "all" ? "Everyone" : a.audience}</Badge>
                    </div>
                    <p className="mt-2 text-[14.5px] leading-relaxed text-slate-600">{a.body}</p>
                    <p className="mt-3 text-xs text-slate-400">{a.authorName} · {a.authorRole} · {fmtDate(a.at)}</p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
        {!list.length && <Empty icon={<Bell className="h-6 w-6" />} title="No announcements" body="Notices posted by staff will appear here." />}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Post an announcement">
        <div className="space-y-4">
          <Field label="Title">
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Mid-term break dates confirmed" className={inputCls} />
          </Field>
          <Field label="Message">
            <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={5} placeholder="Write the full notice…" className={inputCls} />
          </Field>
          <Field label="Audience">
            <select value={audience} onChange={(e) => setAudience(e.target.value as typeof audience)} className={inputCls}>
              <option value="all">Everyone</option>
              <option value="students">Students only</option>
              <option value="teachers">Teachers only</option>
            </select>
          </Field>
          <Btn className="w-full" disabled={!title.trim() || !body.trim()} onClick={() => { addAnnouncement({ title: title.trim(), body: body.trim(), audience }); setTitle(""); setBody(""); setOpen(false); }}>
            Publish announcement
          </Btn>
        </div>
      </Modal>
    </div>
  );
}
