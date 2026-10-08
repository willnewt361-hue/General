import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { Announcement, AppState, Assignment, Attempt, Certificate, ChatMessage, Payment, PlannerTask, Progress, Resource, Role, Sim, User } from "./types";
import { ALL_TOPICS, SUBJECTS } from "../data/curriculum";
import { QUESTIONS, byTopic, gradeFor } from "../data/questions";

const KEY = "mhs.state.v1";
const VERSION = 3;

export const uid = (p = "id") => `${p}_${Math.random().toString(36).slice(2, 9)}${Date.now().toString(36).slice(-3)}`;
export const today = () => new Date().toISOString().slice(0, 10);
const daysAgo = (d: number) => Date.now() - d * 86_400_000;

/** Lightweight reversible obfuscation — this is a client-side demo system, not a secret store. */
export const enc = (v: string) => btoa(unescape(encodeURIComponent(`mhs:${v}`)));
export const matches = (plain: string, stored: string) => enc(plain) === stored;

const STUDENT_NAMES = [
  "Nakato Priscilla", "Kizza Emmanuel", "Achan Deborah", "Mugisha Alex", "Namutebi Sarah", "Okello Brian",
  "Nabirye Faith", "Ssentongo Derrick", "Atim Gloria", "Wasswa Joseph", "Nalubega Ritah", "Kato Ivan",
  "Amongin Mercy", "Lubega Martin", "Nassuna Esther", "Byaruhanga Peter", "Akello Winnie", "Ssekandi Trevor",
  "Nankya Diana", "Odongo Samuel", "Nabukenya Joan", "Tumusiime Arnold", "Auma Patricia", "Kirabo Melissa",
];

const CLASSES = ["S.4 East", "S.4 West", "S.5 Sciences", "S.6 Sciences"];

function seedUsers(): User[] {
  const users: User[] = [
    { id: "u_student", name: "Nakato Priscilla", email: "student@mengohub.ug", pass: enc("mengo123"), role: "student", className: "S.6 Sciences", plan: "plus", hue: 262, createdAt: daysAgo(120), subjects: ["math", "physics", "chemistry", "biology"] },
    { id: "u_teacher", name: "Ssemakula Ronald", email: "teacher@mengohub.ug", pass: enc("mengo123"), role: "teacher", plan: "school", hue: 160, createdAt: daysAgo(300), subjects: ["math", "physics"] },
    { id: "u_admin", name: "Nabbosa Christine", email: "admin@mengohub.ug", pass: enc("mengo123"), role: "admin", plan: "school", hue: 24, createdAt: daysAgo(400) },
    { id: "u_teacher2", name: "Mukasa Julius", email: "julius@mengohub.ug", pass: enc("mengo123"), role: "teacher", plan: "school", hue: 200, createdAt: daysAgo(260), subjects: ["chemistry", "biology"] },
  ];
  STUDENT_NAMES.forEach((name, i) => {
    if (i === 0) return;
    users.push({
      id: `u_s${i}`,
      name,
      email: `${name.split(" ")[1].toLowerCase()}${i}@student.mengohub.ug`,
      pass: enc("mengo123"),
      role: "student",
      className: CLASSES[i % CLASSES.length],
      plan: i % 4 === 0 ? "plus" : "free",
      hue: (i * 47) % 360,
      createdAt: daysAgo(90 - i),
      subjects: ["math", "physics", "chemistry", "biology"],
    });
  });
  return users;
}

function seedAttempts(users: User[]): Attempt[] {
  const out: Attempt[] = [];
  const students = users.filter((u) => u.role === "student");
  const subjects = ["math", "physics", "chemistry", "biology"];
  students.forEach((st, si) => {
    const skill = 45 + ((si * 13) % 45);
    const count = si === 0 ? 14 : 4 + (si % 5);
    for (let k = 0; k < count; k++) {
      const subjectId = subjects[(si + k) % subjects.length];
      const subj = SUBJECTS.find((s) => s.id === subjectId)!;
      const topic = subj.topics[(k + si) % subj.topics.length];
      const drift = si === 0 ? k * 3.2 : k * 1.4;
      const percent = Math.max(22, Math.min(98, Math.round(skill + drift + (((si * 7 + k * 31) % 17) - 8))));
      const total = 10;
      const score = Math.round((percent / 100) * total);
      out.push({
        id: uid("at"),
        userId: st.id,
        kind: k % 4 === 3 ? "mock" : "practice",
        title: `${topic.title} ${k % 4 === 3 ? "Mock" : "Practice"}`,
        subjectId,
        topicIds: [topic.id],
        answers: [],
        score,
        total,
        percent,
        grade: gradeFor(percent).grade,
        durationSec: 600 + ((si * k) % 900),
        at: daysAgo(count - k + (si % 3)) + k * 3_600_000,
      });
    }
  });
  return out;
}

function seedAssignments(): Assignment[] {
  const mk = (title: string, subjectId: string, topicId: string, classes: string[], dueDays: number, teacherId: string, teacherName: string): Assignment => ({
    id: uid("as"),
    teacherId,
    teacherName,
    title,
    subjectId,
    topicIds: [topicId],
    questionIds: byTopic(topicId).slice(0, 5).map((q) => q.id),
    classes,
    dueAt: Date.now() + dueDays * 86_400_000,
    durationMin: 30,
    createdAt: daysAgo(2),
    published: true,
    instructions: "Answer all questions. Show your working where required. This assignment is auto-marked on submission.",
  });
  return [
    mk("Quadratics Check-up", "math", "math-quadratics", ["S.4 East", "S.4 West"], 3, "u_teacher", "Ssemakula Ronald"),
    mk("Projectile Motion Drill", "physics", "phy-projectile", ["S.6 Sciences", "S.5 Sciences"], 5, "u_teacher", "Ssemakula Ronald"),
    mk("Mole Concept Test", "chemistry", "chem-equations", ["S.6 Sciences"], 7, "u_teacher2", "Mukasa Julius"),
    mk("Genetics Homework", "biology", "bio-genetics", ["S.4 East", "S.6 Sciences"], 2, "u_teacher2", "Mukasa Julius"),
  ];
}

function seedAnnouncements(): Announcement[] {
  return [
    { id: uid("an"), authorId: "u_admin", authorName: "Nabbosa Christine", authorRole: "admin", title: "End of term examinations begin Monday", body: "All candidates should report to their examination rooms by 7:45 am. Bring your own mathematical set, pens and your student ID. Mock results will be published on Mengo Hub within 48 hours of each paper.", audience: "all", at: daysAgo(1), pinned: true },
    { id: uid("an"), authorId: "u_teacher", authorName: "Ssemakula Ronald", authorRole: "teacher", title: "Extra Mathematics clinic — Saturday 9 am", body: "We will cover quadratic inequalities and vector geometry proofs, the two areas the class heatmap shows as weakest. Attempt the Quadratics Check-up assignment before you come.", audience: "students", at: daysAgo(2) },
    { id: uid("an"), authorId: "u_teacher2", authorName: "Mukasa Julius", authorRole: "teacher", title: "Chemistry practical groups posted", body: "Titration practicals run in the lab on Tuesday and Thursday. Revise the Acids, Bases and pH notes and run the PhET pH Scale simulation before your session.", audience: "students", at: daysAgo(4) },
  ];
}

function seedMessages(): ChatMessage[] {
  const base = daysAgo(1);
  return [
    { id: uid("m"), room: "math", userId: "u_teacher", name: "Ssemakula Ronald", role: "teacher", text: "Reminder: the Quadratics Check-up closes on Friday. Attempt it after reading the summary notes.", at: base, hue: 160 },
    { id: uid("m"), room: "math", userId: "u_s3", name: "Achan Deborah", role: "student", text: "Sir, for inequalities do we always use a number line?", at: base + 900_000, hue: 141 },
    { id: uid("m"), room: "math", userId: "u_teacher", name: "Ssemakula Ronald", role: "teacher", text: "A number line or a sketch of the parabola — either is accepted, but you must show the critical values.", at: base + 1_500_000, hue: 160 },
    { id: uid("m"), room: "physics", userId: "u_s5", name: "Namutebi Sarah", role: "student", text: "The PhET projectile simulation really helped me see why 45° gives maximum range 🎯", at: base + 2_000_000, hue: 235 },
    { id: uid("m"), room: "chemistry", userId: "u_teacher2", name: "Mukasa Julius", role: "teacher", text: "Practical tip: always rinse the burette with the solution it will hold, never with water only.", at: base + 2_600_000, hue: 200 },
  ];
}

function seedSims(): Sim[] {
  const out: Sim[] = [];
  ALL_TOPICS.forEach((t) =>
    (t.sims ?? []).forEach((s) =>
      out.push({ id: uid("sim"), subjectId: t.subjectId, topicId: t.id, title: s.title, url: s.url, provider: s.provider, description: s.description }),
    ),
  );
  return out;
}

function seedResources(): Resource[] {
  const r: Resource[] = [];
  SUBJECTS.forEach((s) => {
    r.push({ id: uid("r"), title: `${s.name} — Complete Revision Notes`, subjectId: s.id, kind: "notes", by: "Mengo Hub Academics", at: daysAgo(20), size: "2.4 MB" });
    r.push({ id: uid("r"), title: `${s.name} UNEB Past Papers 2016–2024`, subjectId: s.id, kind: "past-paper", by: "UNEB Archive", at: daysAgo(35), size: "8.1 MB" });
    s.topics.slice(0, 2).forEach((t) => r.push({ id: uid("r"), title: `${t.title} — Audio Lesson`, subjectId: s.id, topicId: t.id, kind: "audio", by: "Mengo Hub Academics", at: daysAgo(10), size: "12 MB" }));
  });
  return r;
}

function seedPayments(users: User[]): Payment[] {
  return users
    .filter((u) => u.plan === "plus")
    .slice(0, 6)
    .map((u, i) => ({
      id: uid("pay"),
      userId: u.id,
      userName: u.name,
      plan: "plus" as const,
      amount: 15000,
      method: i % 2 ? "Airtel Money" : "MTN MoMo",
      phone: `+2567${(60000000 + i * 1234567).toString().slice(0, 8)}`,
      ref: `MHS${(100000 + i * 7919).toString()}`,
      at: daysAgo(15 - i),
      status: "success" as const,
    }));
}

function seedTasks(): PlannerTask[] {
  const d = today();
  return [
    { id: uid("t"), userId: "u_student", title: "Read: Organic Chemistry — Esterification", subjectId: "chemistry", topicId: "chem-organic", minutes: 25, done: true, day: d },
    { id: uid("t"), userId: "u_student", title: "Practice: Quadratic Inequalities", subjectId: "math", topicId: "math-quadratics", minutes: 30, done: true, day: d },
    { id: uid("t"), userId: "u_student", title: "Run PhET: Projectile Motion lab", subjectId: "physics", topicId: "phy-projectile", minutes: 20, done: false, day: d },
    { id: uid("t"), userId: "u_student", title: "Mock: Biology Genetics paper", subjectId: "biology", topicId: "bio-genetics", minutes: 45, done: false, day: d },
  ];
}

function freshState(): AppState {
  const users = seedUsers();
  return {
    users,
    attempts: seedAttempts(users),
    assignments: seedAssignments(),
    announcements: seedAnnouncements(),
    messages: seedMessages(),
    sims: seedSims(),
    tasks: seedTasks(),
    certificates: [
      { id: uid("c"), userId: "u_student", userName: "Nakato Priscilla", title: "Chemistry: Acids, Bases & pH Mastery", subjectId: "chemistry", percent: 88, grade: "D1", serial: "MHS-2026-0001", at: daysAgo(12) },
    ],
    payments: seedPayments(users),
    resources: seedResources(),
    progress: {
      u_student: { topicsRead: ["chem-organic", "math-quadratics", "phy-projectile", "bio-genetics", "chem-acids"], bookmarks: ["phy-projectile", "chem-acids"], streak: 21, lastActiveDay: today(), xp: 4820 },
    },
    sessionId: null,
    version: VERSION,
  };
}

function loadState(): AppState {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return freshState();
    const parsed = JSON.parse(raw) as AppState;
    if (parsed.version !== VERSION) return freshState();
    return parsed;
  } catch {
    return freshState();
  }
}

interface Ctx {
  state: AppState;
  user: User | null;
  progress: Progress;
  login: (email: string, pass: string) => { ok: boolean; error?: string };
  signup: (data: { name: string; email: string; pass: string; role: Role; className?: string }) => { ok: boolean; error?: string };
  logout: () => void;
  update: (fn: (draft: AppState) => void) => void;
  resetDemo: () => void;
  // domain actions
  saveAttempt: (a: Omit<Attempt, "id" | "at" | "userId">) => Attempt;
  markTopicRead: (topicId: string) => void;
  toggleBookmark: (topicId: string) => void;
  addTask: (task: Omit<PlannerTask, "id" | "userId">) => void;
  toggleTask: (id: string) => void;
  removeTask: (id: string) => void;
  postMessage: (room: string, text: string) => void;
  addAnnouncement: (a: Pick<Announcement, "title" | "body" | "audience">) => void;
  addAssignment: (a: Omit<Assignment, "id" | "createdAt" | "teacherId" | "teacherName">) => void;
  removeAssignment: (id: string) => void;
  addSim: (s: Omit<Sim, "id" | "custom">) => void;
  removeSim: (id: string) => void;
  upgradePlan: (plan: "plus", method: string, phone: string) => Payment;
  issueCertificate: (subjectId: string, percent: number, grade: string, title: string) => Certificate;
  updateUser: (patch: Partial<User>) => void;
  setUserRole: (userId: string, role: Role) => void;
  removeUser: (userId: string) => void;
}

const AppCtx = createContext<Ctx | null>(null);
const EMPTY_PROGRESS: Progress = { topicsRead: [], bookmarks: [], streak: 0, lastActiveDay: today(), xp: 0 };

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(loadState);
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* quota — ignore */
    }
  }, [state]);

  const update = useCallback((fn: (draft: AppState) => void) => {
    setState((prev) => {
      const draft = JSON.parse(JSON.stringify(prev)) as AppState;
      fn(draft);
      return draft;
    });
  }, []);

  const user = useMemo(() => state.users.find((u) => u.id === state.sessionId) ?? null, [state.users, state.sessionId]);
  const progress = useMemo(() => (user ? state.progress[user.id] ?? EMPTY_PROGRESS : EMPTY_PROGRESS), [state.progress, user]);

  // streak maintenance
  useEffect(() => {
    if (!user) return;
    const p = state.progress[user.id];
    if (p && p.lastActiveDay !== today()) {
      const yesterday = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10);
      update((d) => {
        const pp = d.progress[user.id];
        pp.streak = p.lastActiveDay === yesterday ? pp.streak + 1 : 1;
        pp.lastActiveDay = today();
      });
    }
    if (!p) update((d) => { d.progress[user.id] = { ...EMPTY_PROGRESS, streak: 1, lastActiveDay: today() }; });
  }, [user, state.progress, update]);

  const login: Ctx["login"] = useCallback(
    (email, pass) => {
      const u = state.users.find((x) => x.email.toLowerCase() === email.trim().toLowerCase());
      if (!u) return { ok: false, error: "No account found with that email address." };
      if (!matches(pass, u.pass)) return { ok: false, error: "Incorrect password. Please try again." };
      update((d) => {
        d.sessionId = u.id;
      });
      return { ok: true };
    },
    [state.users, update],
  );

  const signup: Ctx["signup"] = useCallback(
    ({ name, email, pass, role, className }) => {
      if (state.users.some((u) => u.email.toLowerCase() === email.trim().toLowerCase())) return { ok: false, error: "That email is already registered. Try logging in." };
      if (pass.length < 6) return { ok: false, error: "Password must be at least 6 characters." };
      const id = uid("u");
      const newUser: User = {
        id,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        pass: enc(pass),
        role,
        className: role === "student" ? className || "S.4 East" : undefined,
        plan: role === "student" ? "free" : "school",
        hue: Math.floor(Math.random() * 360),
        createdAt: Date.now(),
        subjects: ["math", "physics", "chemistry", "biology"],
      };
      update((d) => {
        d.users.push(newUser);
        d.progress[id] = { ...EMPTY_PROGRESS, streak: 1, lastActiveDay: today() };
        d.sessionId = id;
      });
      return { ok: true };
    },
    [state.users, update],
  );

  const logout = useCallback(() => update((d) => { d.sessionId = null; }), [update]);
  const resetDemo = useCallback(() => {
    localStorage.removeItem(KEY);
    setState(freshState());
  }, []);

  const saveAttempt: Ctx["saveAttempt"] = useCallback(
    (a) => {
      const attempt: Attempt = { ...a, id: uid("at"), userId: user?.id ?? "anon", at: Date.now() };
      update((d) => {
        d.attempts.push(attempt);
        if (user) {
          const p = d.progress[user.id] ?? { ...EMPTY_PROGRESS };
          p.xp += Math.round(attempt.percent * 1.5);
          p.lastActiveDay = today();
          d.progress[user.id] = p;
        }
      });
      return attempt;
    },
    [update, user],
  );

  const markTopicRead = useCallback(
    (topicId: string) => {
      if (!user) return;
      update((d) => {
        const p = d.progress[user.id] ?? { ...EMPTY_PROGRESS };
        if (!p.topicsRead.includes(topicId)) {
          p.topicsRead.push(topicId);
          p.xp += 40;
        }
        d.progress[user.id] = p;
      });
    },
    [update, user],
  );

  const toggleBookmark = useCallback(
    (topicId: string) => {
      if (!user) return;
      update((d) => {
        const p = d.progress[user.id] ?? { ...EMPTY_PROGRESS };
        p.bookmarks = p.bookmarks.includes(topicId) ? p.bookmarks.filter((b) => b !== topicId) : [...p.bookmarks, topicId];
        d.progress[user.id] = p;
      });
    },
    [update, user],
  );

  const addTask: Ctx["addTask"] = useCallback(
    (task) => {
      if (!user) return;
      update((d) => d.tasks.push({ ...task, id: uid("t"), userId: user.id }));
    },
    [update, user],
  );
  const toggleTask = useCallback((id: string) => update((d) => { const t = d.tasks.find((x) => x.id === id); if (t) t.done = !t.done; }), [update]);
  const removeTask = useCallback((id: string) => update((d) => { d.tasks = d.tasks.filter((t) => t.id !== id); }), [update]);

  const postMessage = useCallback(
    (room: string, text: string) => {
      if (!user || !text.trim()) return;
      update((d) => d.messages.push({ id: uid("m"), room, userId: user.id, name: user.name, role: user.role, text: text.trim(), at: Date.now(), hue: user.hue }));
    },
    [update, user],
  );

  const addAnnouncement: Ctx["addAnnouncement"] = useCallback(
    (a) => {
      if (!user) return;
      update((d) => d.announcements.unshift({ ...a, id: uid("an"), authorId: user.id, authorName: user.name, authorRole: user.role, at: Date.now() }));
    },
    [update, user],
  );

  const addAssignment: Ctx["addAssignment"] = useCallback(
    (a) => {
      if (!user) return;
      update((d) => d.assignments.unshift({ ...a, id: uid("as"), createdAt: Date.now(), teacherId: user.id, teacherName: user.name }));
    },
    [update, user],
  );
  const removeAssignment = useCallback((id: string) => update((d) => { d.assignments = d.assignments.filter((a) => a.id !== id); }), [update]);

  const addSim: Ctx["addSim"] = useCallback((s) => update((d) => d.sims.unshift({ ...s, id: uid("sim"), custom: true })), [update]);
  const removeSim = useCallback((id: string) => update((d) => { d.sims = d.sims.filter((s) => s.id !== id); }), [update]);

  const upgradePlan: Ctx["upgradePlan"] = useCallback(
    (plan, method, phone) => {
      const payment: Payment = {
        id: uid("pay"),
        userId: user?.id ?? "anon",
        userName: user?.name ?? "Guest",
        plan,
        amount: 15000,
        method,
        phone,
        ref: `MHS${Math.floor(100000 + Math.random() * 899999)}`,
        at: Date.now(),
        status: "success",
      };
      update((d) => {
        d.payments.unshift(payment);
        const u = d.users.find((x) => x.id === user?.id);
        if (u) u.plan = plan;
      });
      return payment;
    },
    [update, user],
  );

  const issueCertificate: Ctx["issueCertificate"] = useCallback(
    (subjectId, percent, grade, title) => {
      const cert: Certificate = {
        id: uid("cert"),
        userId: user?.id ?? "anon",
        userName: user?.name ?? "Guest",
        title,
        subjectId,
        percent,
        grade,
        serial: `MHS-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 8999)}`,
        at: Date.now(),
      };
      update((d) => d.certificates.unshift(cert));
      return cert;
    },
    [update, user],
  );

  const updateUser = useCallback(
    (patch: Partial<User>) => {
      if (!user) return;
      update((d) => {
        const u = d.users.find((x) => x.id === user.id);
        if (u) Object.assign(u, patch);
      });
    },
    [update, user],
  );

  const setUserRole = useCallback((userId: string, role: Role) => update((d) => { const u = d.users.find((x) => x.id === userId); if (u) u.role = role; }), [update]);
  const removeUser = useCallback((userId: string) => update((d) => { d.users = d.users.filter((u) => u.id !== userId); }), [update]);

  const value: Ctx = {
    state, user, progress, login, signup, logout, update, resetDemo,
    saveAttempt, markTopicRead, toggleBookmark, addTask, toggleTask, removeTask,
    postMessage, addAnnouncement, addAssignment, removeAssignment, addSim, removeSim,
    upgradePlan, issueCertificate, updateUser, setUserRole, removeUser,
  };

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export function useApp() {
  const c = useContext(AppCtx);
  if (!c) throw new Error("useApp must be used inside AppProvider");
  return c;
}

/* ------------------------- derived selectors ------------------------- */

export function useStudentStats(userId?: string) {
  const { state, progress } = useApp();
  return useMemo(() => {
    const mine = state.attempts.filter((a) => a.userId === userId);
    const avg = mine.length ? Math.round(mine.reduce((s, a) => s + a.percent, 0) / mine.length) : 0;
    const bySubject: Record<string, { total: number; count: number; avg: number }> = {};
    mine.forEach((a) => {
      const b = (bySubject[a.subjectId] ??= { total: 0, count: 0, avg: 0 });
      b.total += a.percent;
      b.count++;
      b.avg = Math.round(b.total / b.count);
    });
    const recent = [...mine].sort((a, b) => b.at - a.at).slice(0, 8);
    const trend = [...mine].sort((a, b) => a.at - b.at).map((a) => a.percent);
    const readiness = Math.min(99, Math.round(avg * 0.7 + Math.min(progress.topicsRead.length, 20) * 1.2 + Math.min(mine.length, 20) * 0.6));
    const topicsTotal = ALL_TOPICS.length;
    return { attempts: mine, avg, bySubject, recent, trend, readiness, topicsRead: progress.topicsRead.length, topicsTotal, xp: progress.xp, streak: progress.streak };
  }, [state.attempts, userId, progress]);
}

export function useLeaderboard() {
  const { state } = useApp();
  return useMemo(() => {
    const rows = state.users
      .filter((u) => u.role === "student")
      .map((u) => {
        const mine = state.attempts.filter((a) => a.userId === u.id);
        const avg = mine.length ? Math.round(mine.reduce((s, a) => s + a.percent, 0) / mine.length) : 0;
        const xp = (state.progress[u.id]?.xp ?? 0) + avg * 12 + mine.length * 30;
        return { user: u, avg, attempts: mine.length, xp, streak: state.progress[u.id]?.streak ?? 0 };
      })
      .sort((a, b) => b.xp - a.xp);
    return rows;
  }, [state.users, state.attempts, state.progress]);
}

/** Exam predictor — weights topic likelihood from past-paper frequency + recency + your weakness */
export function usePredictor(userId?: string) {
  const { state } = useApp();
  return useMemo(() => {
    const mine = state.attempts.filter((a) => a.userId === userId);
    const perTopic: Record<string, { total: number; count: number }> = {};
    mine.forEach((a) => a.topicIds.forEach((t) => { const p = (perTopic[t] ??= { total: 0, count: 0 }); p.total += a.percent; p.count++; }));
    const thisYear = new Date().getFullYear();
    return ALL_TOPICS.map((t) => {
      const qYears = QUESTIONS.filter((q) => q.topicId === t.id).flatMap((q) => q.years);
      const years = Array.from(new Set([...t.years, ...qYears]));
      const freq = years.length / 9;
      const recency = years.length ? 1 - Math.min(6, thisYear - Math.max(...years)) / 8 : 0.3;
      const perf = perTopic[t.id] ? perTopic[t.id].total / perTopic[t.id].count / 100 : 0.5;
      const weakness = 1 - perf;
      const raw = freq * 0.5 + recency * 0.28 + weakness * 0.22;
      return { topic: t, likelihood: Math.max(18, Math.min(97, Math.round(raw * 100))), years: years.sort((a, b) => b - a), yourAvg: perTopic[t.id] ? Math.round(perTopic[t.id].total / perTopic[t.id].count) : null };
    }).sort((a, b) => b.likelihood - a.likelihood);
  }, [state.attempts, userId]);
}

/** Class-level topic mastery heatmap for teachers */
export function useClassAnalytics(subjectId?: string) {
  const { state } = useApp();
  return useMemo(() => {
    const classes = Array.from(new Set(state.users.filter((u) => u.role === "student").map((u) => u.className!).filter(Boolean)));
    const subject = SUBJECTS.find((s) => s.id === subjectId) ?? SUBJECTS[0];
    const grid = classes.map((cls) => {
      const studentIds = state.users.filter((u) => u.className === cls).map((u) => u.id);
      const cells = subject.topics.map((t) => {
        const rel = state.attempts.filter((a) => studentIds.includes(a.userId) && a.subjectId === subject.id);
        if (!rel.length) return { topic: t, value: null as number | null };
        const seeded = rel.filter((a) => a.topicIds.includes(t.id));
        const pool = seeded.length ? seeded : rel;
        return { topic: t, value: Math.round(pool.reduce((s, a) => s + a.percent, 0) / pool.length) };
      });
      return { cls, cells };
    });
    const atRisk = state.users
      .filter((u) => u.role === "student")
      .map((u) => {
        const mine = state.attempts.filter((a) => a.userId === u.id);
        const avg = mine.length ? Math.round(mine.reduce((s, a) => s + a.percent, 0) / mine.length) : 0;
        return { user: u, avg, attempts: mine.length };
      })
      .filter((r) => r.attempts > 0 && r.avg < 55)
      .sort((a, b) => a.avg - b.avg);
    return { classes, subject, grid, atRisk };
  }, [state.users, state.attempts, subjectId]);
}
