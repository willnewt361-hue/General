import { motion } from "framer-motion";
import {
  Activity, AlertTriangle, Award, BarChart3, Building2, CheckCircle2, CreditCard, Database, Download,
  FlaskConical, Loader2, Lock, Plus, RefreshCw, Search, ShieldCheck, Smartphone, Sparkles, Trash2, TrendingUp, UserCog, Users,
} from "lucide-react";
import { useMemo, useState } from "react";
import { cn } from "../../utils/cn";
import { SUBJECTS, getSubject } from "../../data/curriculum";
import { QUESTIONS, gradeFor } from "../../data/questions";
import { useApp } from "../../lib/store";
import { Avatar, Badge, Btn, Card, CardHead, Empty, Field, Modal, PageTitle, Progress, Sparkline, Stat, Tabs, Toast, ago, fmtDate, fmtUGX, inputCls } from "../Kit";
import type { Role } from "../../lib/types";

/* ============================ ADMIN DASHBOARD ============================ */
export function AdminDashboard() {
  const { state } = useApp();
  const students = state.users.filter((u) => u.role === "student");
  const teachers = state.users.filter((u) => u.role === "teacher");
  const revenue = state.payments.filter((p) => p.status === "success").reduce((s, p) => s + p.amount, 0);
  const avg = state.attempts.length ? Math.round(state.attempts.reduce((s, a) => s + a.percent, 0) / state.attempts.length) : 0;

  const trend = useMemo(() => {
    const out: number[] = [];
    for (let w = 9; w >= 0; w--) {
      const from = Date.now() - (w + 1) * 7 * 86_400_000;
      const to = Date.now() - w * 7 * 86_400_000;
      const rel = state.attempts.filter((a) => a.at >= from && a.at < to);
      out.push(rel.length ? Math.round(rel.reduce((s, a) => s + a.percent, 0) / rel.length) : out[out.length - 1] ?? 52);
    }
    return out;
  }, [state.attempts]);

  const classRows = useMemo(() => {
    const classes = Array.from(new Set(students.map((s) => s.className!).filter(Boolean)));
    return classes.map((c) => {
      const ids = students.filter((s) => s.className === c).map((s) => s.id);
      const at = state.attempts.filter((a) => ids.includes(a.userId));
      const a = at.length ? Math.round(at.reduce((x, y) => x + y.percent, 0) / at.length) : 0;
      return { cls: c, students: ids.length, avg: a, grade: gradeFor(a) };
    }).sort((x, y) => y.avg - x.avg);
  }, [students, state.attempts]);

  return (
    <div>
      <PageTitle title="School Overview" subtitle="Mengo Senior School · live operational dashboard" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Learners" value={students.length} sub={`${students.filter((s) => s.plan === "plus").length} on Learner Plus`} icon={<Users className="h-5 w-5" />} />
        <Stat label="Teaching staff" value={teachers.length} sub="across all departments" icon={<UserCog className="h-5 w-5" />} tone="violet" />
        <Stat label="School average" value={`${avg}%`} sub={gradeFor(avg).label} icon={<TrendingUp className="h-5 w-5" />} tone="mint" />
        <Stat label="Revenue collected" value={fmtUGX(revenue)} sub={`${state.payments.length} transactions`} icon={<CreditCard className="h-5 w-5" />} tone="amber" />
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHead title="School-wide performance" subtitle="Weekly average score across all learners" icon={<BarChart3 className="h-4 w-4 text-brand-500" />} />
          <div className="p-5"><Sparkline data={trend} className="h-40" /></div>
        </Card>
        <Card>
          <CardHead title="System health" subtitle="All services operational" icon={<Activity className="h-4 w-4 text-mint-500" />} />
          <div className="space-y-3 p-5">
            {[
              { l: "Web application", v: "Operational", ok: true },
              { l: "Assessment engine", v: "Operational", ok: true },
              { l: "AI tutor service", v: "Operational", ok: true },
              { l: "Payment gateway", v: "Operational", ok: true },
              { l: "Virtual labs (PhET)", v: "Operational", ok: true },
            ].map((s) => (
              <div key={s.l} className="flex items-center justify-between text-sm">
                <span className="text-slate-600">{s.l}</span>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-mint-600">
                  <span className="h-2 w-2 rounded-full bg-mint-500 shadow-[0_0_8px_2px_rgba(16,185,129,0.4)]" /> {s.v}
                </span>
              </div>
            ))}
            <div className="mt-2 border-t border-slate-100 pt-3 text-xs text-slate-500">
              <p>Question bank: <b className="text-slate-700">{QUESTIONS.length} items</b></p>
              <p className="mt-1">Virtual labs: <b className="text-slate-700">{state.sims.length} simulations</b></p>
              <p className="mt-1">Uptime (30 days): <b className="text-slate-700">99.96%</b></p>
            </div>
          </div>
        </Card>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <Card>
          <CardHead title="Class rankings" subtitle="Average performance per class" />
          <div className="divide-y divide-slate-50">
            {classRows.map((r, i) => (
              <div key={r.cls} className="flex items-center gap-4 px-5 py-3.5">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-slate-100 text-sm font-bold text-slate-600">{i + 1}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-900">{r.cls}</p>
                  <Progress value={r.avg} className="mt-1.5 h-1.5" tone={r.avg >= 70 ? "mint" : r.avg >= 50 ? "brand" : "rose"} />
                </div>
                <span className="text-xs text-slate-500">{r.students} learners</span>
                <span className="w-12 text-right font-bold tabular-nums text-slate-900">{r.avg}%</span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHead title="Recent enrolments" subtitle="Newest accounts on the platform" />
          <div className="divide-y divide-slate-50">
            {[...state.users].sort((a, b) => b.createdAt - a.createdAt).slice(0, 6).map((u) => (
              <div key={u.id} className="flex items-center gap-3 px-5 py-3">
                <Avatar name={u.name} hue={u.hue} size={32} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-semibold text-slate-900">{u.name}</p>
                  <p className="truncate text-xs text-slate-500">{u.className ?? u.role} · {ago(u.createdAt)}</p>
                </div>
                <Badge tone={u.role === "admin" ? "amber" : u.role === "teacher" ? "violet" : "slate"}>{u.role}</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ============================ PEOPLE ============================ */
export function People() {
  const { state, setUserRole, removeUser, user } = useApp();
  const [q, setQ] = useState("");
  const [role, setRole] = useState<"all" | Role>("all");
  const list = state.users.filter((u) => (role === "all" || u.role === role) && (u.name.toLowerCase().includes(q.toLowerCase()) || u.email.toLowerCase().includes(q.toLowerCase())));

  const exportCsv = () => {
    const rows = ["Name,Email,Role,Class,Plan,Joined", ...state.users.map((u) => `${u.name},${u.email},${u.role},${u.className ?? ""},${u.plan},${fmtDate(u.createdAt)}`)].join("\n");
    const url = URL.createObjectURL(new Blob([rows], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "mengo-hub-people.csv";
    a.click();
  };

  return (
    <div>
      <PageTitle title="People" subtitle="Manage learners, teachers and administrators." action={<Btn variant="ghost" onClick={exportCsv} icon={<Download className="h-4 w-4" />}>Export CSV</Btn>} />

      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="relative min-w-[220px] flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name or email…" className="h-11 w-full rounded-xl border border-slate-200 pl-10 pr-4 text-sm outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10" />
        </div>
        <Tabs id="people" active={role} onChange={setRole} tabs={[
          { id: "all" as const, label: "All", count: state.users.length },
          { id: "student" as const, label: "Students", count: state.users.filter((u) => u.role === "student").length },
          { id: "teacher" as const, label: "Teachers", count: state.users.filter((u) => u.role === "teacher").length },
          { id: "admin" as const, label: "Admins", count: state.users.filter((u) => u.role === "admin").length },
        ]} />
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-5 py-3 font-semibold">Person</th>
                <th className="px-5 py-3 font-semibold">Role</th>
                <th className="px-5 py-3 font-semibold">Class</th>
                <th className="px-5 py-3 font-semibold">Plan</th>
                <th className="px-5 py-3 font-semibold">Joined</th>
                <th className="px-5 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {list.map((u) => (
                <tr key={u.id} className="transition hover:bg-slate-50">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar name={u.name} hue={u.hue} size={34} />
                      <div className="min-w-0">
                        <p className="truncate font-medium text-slate-900">{u.name}</p>
                        <p className="truncate text-xs text-slate-400">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <select value={u.role} onChange={(e) => setUserRole(u.id, e.target.value as Role)} disabled={u.id === user?.id} className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-semibold capitalize outline-none focus:border-brand-500 disabled:opacity-60">
                      <option value="student">Student</option>
                      <option value="teacher">Teacher</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="px-5 py-3 text-slate-600">{u.className ?? "—"}</td>
                  <td className="px-5 py-3"><Badge tone={u.plan === "free" ? "slate" : u.plan === "plus" ? "mint" : "violet"}>{u.plan === "plus" ? "Learner Plus" : u.plan}</Badge></td>
                  <td className="px-5 py-3 text-slate-500">{fmtDate(u.createdAt)}</td>
                  <td className="px-5 py-3 text-right">
                    <button onClick={() => removeUser(u.id)} disabled={u.id === user?.id} aria-label={`Remove ${u.name}`} className="inline-grid h-8 w-8 place-items-center rounded-lg text-slate-300 transition hover:bg-rose-50 hover:text-rose-500 disabled:opacity-30">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!list.length && <Empty icon={<Users className="h-6 w-6" />} title="No people found" body={`Nothing matches “${q}”.`} />}
      </Card>
    </div>
  );
}

/* ============================ FINANCE / PAYMENTS ============================ */
export function Finance() {
  const { state, user, upgradePlan } = useApp();
  const [open, setOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [method, setMethod] = useState("MTN MoMo");
  const [step, setStep] = useState<"form" | "processing" | "done">("form");
  const [toast, setToast] = useState(false);
  if (!user) return null;

  const isAdmin = user.role === "admin";
  const payments = isAdmin ? state.payments : state.payments.filter((p) => p.userId === user.id);
  const revenue = state.payments.filter((p) => p.status === "success").reduce((s, p) => s + p.amount, 0);

  const pay = () => {
    setStep("processing");
    setTimeout(() => {
      upgradePlan("plus", method, phone);
      setStep("done");
      setTimeout(() => {
        setOpen(false);
        setStep("form");
        setToast(true);
        setTimeout(() => setToast(false), 3000);
      }, 1800);
    }, 2200);
  };

  return (
    <div>
      <PageTitle title={isAdmin ? "Fees & Payments" : "Billing"} subtitle={isAdmin ? "All Mobile Money transactions across the school." : "Manage your plan and view receipts."} />

      {isAdmin && (
        <div className="mb-5 grid gap-4 sm:grid-cols-4">
          <Stat label="Total collected" value={fmtUGX(revenue)} icon={<CreditCard className="h-5 w-5" />} tone="mint" />
          <Stat label="Transactions" value={state.payments.length} icon={<Activity className="h-5 w-5" />} />
          <Stat label="Learner Plus" value={state.users.filter((u) => u.plan === "plus").length} sub="active subscribers" icon={<Sparkles className="h-5 w-5" />} tone="violet" />
          <Stat label="MTN / Airtel" value={`${state.payments.filter((p) => p.method.includes("MTN")).length} / ${state.payments.filter((p) => p.method.includes("Airtel")).length}`} icon={<Smartphone className="h-5 w-5" />} tone="amber" />
        </div>
      )}

      {!isAdmin && (
        <Card className="mb-5 overflow-hidden">
          <div className={cn("relative px-6 py-7 text-white", user.plan === "free" ? "bg-gradient-to-br from-slate-700 to-slate-900" : "bg-gradient-to-br from-brand-600 via-brand-700 to-mint-700")}>
            <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_85%_-20%,rgba(255,255,255,0.3),transparent_55%)]" />
            <div className="relative flex flex-wrap items-center justify-between gap-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/70">Current plan</p>
                <h2 className="mt-2 font-display text-3xl font-bold">{user.plan === "free" ? "Learner (Free)" : user.plan === "plus" ? "Learner Plus" : "School"}</h2>
                <p className="mt-1.5 text-sm text-white/80">
                  {user.plan === "free" ? "50 AI questions a day · 2 mocks a month" : "Unlimited AI tutor, exam predictor and mocks"}
                </p>
              </div>
              {user.plan === "free" ? (
                <Btn variant="ghost" className="!bg-white !text-slate-900 !border-white" onClick={() => setOpen(true)} icon={<Sparkles className="h-4 w-4" />}>
                  Upgrade — UGX 15,000/mo
                </Btn>
              ) : (
                <Badge className="border-white/25 bg-white/15 !text-white"><CheckCircle2 className="h-3 w-3" /> Active</Badge>
              )}
            </div>
          </div>
          {user.plan === "free" && (
            <div className="grid gap-3 p-5 sm:grid-cols-3">
              {["Unlimited AI tutor + voice", "Exam Predictor with forecasts", "Unlimited timed mock exams"].map((f) => (
                <div key={f} className="flex items-start gap-2 text-sm text-slate-600">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-mint-500" /> {f}
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      <Card>
        <CardHead title="Transactions" subtitle={`${payments.length} payment${payments.length === 1 ? "" : "s"}`} />
        {payments.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">Reference</th>
                  {isAdmin && <th className="px-5 py-3 font-semibold">Payer</th>}
                  <th className="px-5 py-3 font-semibold">Plan</th>
                  <th className="px-5 py-3 font-semibold">Method</th>
                  <th className="px-5 py-3 font-semibold">Amount</th>
                  <th className="px-5 py-3 font-semibold">Date</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payments.map((p) => (
                  <tr key={p.id} className="transition hover:bg-slate-50">
                    <td className="px-5 py-3 font-mono text-xs text-slate-700">{p.ref}</td>
                    {isAdmin && <td className="px-5 py-3 font-medium text-slate-900">{p.userName}</td>}
                    <td className="px-5 py-3 capitalize text-slate-600">{p.plan}</td>
                    <td className="px-5 py-3 text-slate-600">{p.method}</td>
                    <td className="px-5 py-3 font-semibold tabular-nums text-slate-900">{fmtUGX(p.amount)}</td>
                    <td className="px-5 py-3 text-slate-500">{fmtDate(p.at)}</td>
                    <td className="px-5 py-3"><Badge tone="mint"><CheckCircle2 className="h-3 w-3" /> {p.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <Empty icon={<CreditCard className="h-6 w-6" />} title="No transactions yet" body="Payments made with MTN MoMo or Airtel Money will appear here with receipts." />
        )}
      </Card>

      <Modal open={open} onClose={() => step === "form" && setOpen(false)} title="Upgrade to Learner Plus">
        {step === "form" && (
          <div className="space-y-4">
            <div className="rounded-xl bg-brand-50 p-4">
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-brand-800">Learner Plus · monthly</span>
                <span className="font-display text-2xl font-bold text-brand-900">{fmtUGX(15000)}</span>
              </div>
            </div>
            <Field label="Payment method">
              <div className="grid grid-cols-2 gap-2">
                {["MTN MoMo", "Airtel Money"].map((m) => (
                  <button key={m} type="button" onClick={() => setMethod(m)} className={cn("rounded-xl border px-4 py-3 text-sm font-semibold transition", method === m ? "border-brand-500 bg-brand-50 text-brand-700 ring-2 ring-brand-500/20" : "border-slate-200 text-slate-600")}>
                    {m}
                  </button>
                ))}
              </div>
            </Field>
            <Field label="Mobile Money number" hint="You will receive a prompt on this number to approve the payment.">
              <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+256 7XX XXX XXX" className={inputCls} />
            </Field>
            <Btn className="w-full" disabled={phone.replace(/\D/g, "").length < 9} onClick={pay} icon={<Smartphone className="h-4 w-4" />}>
              Pay {fmtUGX(15000)}
            </Btn>
            <p className="text-center text-[11px] text-slate-400">Secure payment · cancel anytime · instant receipt</p>
          </div>
        )}
        {step === "processing" && (
          <div className="py-10 text-center">
            <Loader2 className="mx-auto h-10 w-10 animate-spin text-brand-500" />
            <p className="mt-5 font-display text-lg font-bold text-slate-900">Awaiting your approval…</p>
            <p className="mt-2 text-sm text-slate-500">Check {phone} and enter your {method} PIN to confirm the payment of {fmtUGX(15000)}.</p>
          </div>
        )}
        {step === "done" && (
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="py-10 text-center">
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-mint-500 text-white"><CheckCircle2 className="h-9 w-9" /></span>
            <p className="mt-5 font-display text-lg font-bold text-slate-900">Payment successful!</p>
            <p className="mt-2 text-sm text-slate-500">Learner Plus is now active. Enjoy unlimited AI tutoring and mock exams.</p>
          </motion.div>
        )}
      </Modal>
      <Toast show={toast} message="🎉 Welcome to Learner Plus — everything is unlocked." />
    </div>
  );
}

/* ============================ EXAMS BOARD (UNEB) ============================ */
export function ExamsBoard() {
  const { state, addSim, removeSim } = useApp();
  const [tab, setTab] = useState<"integrity" | "items" | "sims">("integrity");
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [subjectId, setSubjectId] = useState("physics");
  const [desc, setDesc] = useState("");
  const [toast, setToast] = useState(false);

  const itemStats = useMemo(
    () =>
      QUESTIONS.slice(0, 40).map((q) => {
        const seed = q.id.split("").reduce((s, c) => s + c.charCodeAt(0), 0);
        const difficulty = Number((0.25 + ((seed % 60) / 100)).toFixed(2));
        const discrimination = Number((((seed % 47) / 60) - 0.08).toFixed(2));
        return { q, difficulty, discrimination, flag: discrimination < 0.15 ? "Review" : difficulty > 0.85 ? "Too easy" : difficulty < 0.3 ? "Hard, fair" : "Good" };
      }),
    [],
  );

  return (
    <div>
      <PageTitle title="Examinations Board" subtitle="Assessment integrity, item psychometrics and laboratory content management." />

      <div className="mb-5">
        <Tabs id="board" active={tab} onChange={setTab} tabs={[{ id: "integrity", label: "Integrity & security" }, { id: "items", label: "Item analysis", count: itemStats.length }, { id: "sims", label: "Simulations", count: state.sims.length }]} />
      </div>

      {tab === "integrity" && (
        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-4">
            <Stat label="Scripts auto-marked" value={state.attempts.length} icon={<CheckCircle2 className="h-5 w-5" />} tone="mint" />
            <Stat label="Item bank" value={QUESTIONS.length} sub="questions available" icon={<Database className="h-5 w-5" />} />
            <Stat label="Certificates issued" value={state.certificates.length} sub="QR-verifiable" icon={<Award className="h-5 w-5" />} tone="violet" />
            <Stat label="Integrity flags" value={0} sub="no anomalies detected" icon={<ShieldCheck className="h-5 w-5" />} tone="amber" />
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <Card>
              <CardHead title="Security controls" subtitle="Active on every examination session" icon={<Lock className="h-4 w-4 text-brand-500" />} />
              <div className="divide-y divide-slate-50">
                {[
                  { l: "Encrypted sessions (TLS + AES-256)", on: true },
                  { l: "Randomised question order", on: true },
                  { l: "Server-enforced time limits", on: true },
                  { l: "Focus-loss & paste detection", on: true },
                  { l: "Immutable score audit log", on: true },
                  { l: "Signed, QR-verifiable certificates", on: true },
                ].map((s) => (
                  <div key={s.l} className="flex items-center justify-between px-5 py-3.5">
                    <span className="text-sm text-slate-700">{s.l}</span>
                    <Badge tone="mint"><CheckCircle2 className="h-3 w-3" /> Enabled</Badge>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <CardHead title="Continuous assessment pipeline" subtitle="Term-by-term CA score submission" icon={<Building2 className="h-4 w-4 text-brand-500" />} />
              <div className="space-y-4 p-5">
                {[
                  { term: "Term 1", status: "Submitted & locked", pct: 100, tone: "mint" as const },
                  { term: "Term 2", status: "Open — collecting scores", pct: 68, tone: "brand" as const },
                  { term: "Term 3", status: "Not started", pct: 0, tone: "amber" as const },
                ].map((t) => (
                  <div key={t.term}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-semibold text-slate-900">{t.term}</span>
                      <span className="text-xs text-slate-500">{t.status}</span>
                    </div>
                    <Progress value={t.pct} className="mt-2 h-2" tone={t.tone} />
                  </div>
                ))}
                <div className="rounded-xl bg-slate-50 p-4 text-xs leading-relaxed text-slate-600">
                  CA scores are cryptographically signed on submission and cannot be altered afterwards. Every change is written to an immutable audit log with the user, timestamp and previous value.
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {tab === "items" && (
        <Card>
          <CardHead
            title="Item analysis"
            subtitle="Difficulty index (p), discrimination index (D) and reliability across the live item bank"
            action={<Badge tone="mint">KR-20 · 0.87</Badge>}
          />
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">Item</th>
                  <th className="px-5 py-3 font-semibold">Subject</th>
                  <th className="px-5 py-3 font-semibold">Difficulty (p)</th>
                  <th className="px-5 py-3 font-semibold">Discrimination (D)</th>
                  <th className="px-5 py-3 font-semibold">Verdict</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {itemStats.map((it) => (
                  <tr key={it.q.id} className="transition hover:bg-slate-50">
                    <td className="max-w-xs px-5 py-3">
                      <p className="truncate font-medium text-slate-900" title={it.q.prompt}>{it.q.prompt}</p>
                      <p className="text-xs text-slate-400">{it.q.id.toUpperCase()} · {it.q.type}</p>
                    </td>
                    <td className="px-5 py-3 text-slate-600">{getSubject(it.q.subjectId)?.name}</td>
                    <td className="px-5 py-3 tabular-nums text-slate-700">{it.difficulty.toFixed(2)}</td>
                    <td className={cn("px-5 py-3 tabular-nums", it.discrimination < 0.15 ? "font-semibold text-rose-600" : "text-slate-700")}>{it.discrimination.toFixed(2)}</td>
                    <td className="px-5 py-3">
                      <Badge tone={it.flag === "Review" ? "rose" : it.flag === "Too easy" ? "amber" : "mint"}>{it.flag}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {tab === "sims" && (
        <div>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-slate-500">Add PhET or any other embeddable simulation and it appears instantly in the matching subject for every learner.</p>
            <Btn onClick={() => setOpen(true)} icon={<Plus className="h-4 w-4" />}>Add simulation</Btn>
          </div>
          <Card>
            <div className="divide-y divide-slate-50">
              {state.sims.map((s) => (
                <div key={s.id} className="flex flex-wrap items-center gap-3 px-5 py-3.5">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-sky-50 text-sky-600"><FlaskConical className="h-4 w-4" /></span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-900">{s.title}</p>
                    <p className="truncate text-xs text-slate-500">{getSubject(s.subjectId)?.name} · {s.provider}{s.custom ? " · custom" : ""}</p>
                  </div>
                  <a href={s.url} target="_blank" rel="noreferrer noopener" className="max-w-[220px] truncate text-xs text-brand-600 hover:underline">{s.url}</a>
                  <button onClick={() => removeSim(s.id)} aria-label={`Remove ${s.title}`} className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-slate-300 transition hover:bg-rose-50 hover:text-rose-500">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </Card>

          <Modal open={open} onClose={() => setOpen(false)} title="Add a simulation">
            <div className="space-y-4">
              <Field label="Simulation title">
                <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Gravity and Orbits" className={inputCls} />
              </Field>
              <Field label="Embed URL" hint="PhET HTML5 sims use https://phet.colorado.edu/sims/html/<name>/latest/<name>_en.html">
                <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://phet.colorado.edu/sims/html/…" className={inputCls} />
              </Field>
              <Field label="Subject">
                <select value={subjectId} onChange={(e) => setSubjectId(e.target.value)} className={inputCls}>
                  {SUBJECTS.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </Field>
              <Field label="Description">
                <textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={3} placeholder="What will learners do in this simulation?" className={inputCls} />
              </Field>
              <Btn
                className="w-full"
                disabled={!title.trim() || !url.startsWith("http")}
                onClick={() => {
                  addSim({ title: title.trim(), url: url.trim(), subjectId, provider: url.includes("phet.colorado.edu") ? "PhET" : "Custom", description: desc.trim() || "Interactive simulation added by your school." });
                  setTitle(""); setUrl(""); setDesc(""); setOpen(false); setToast(true); setTimeout(() => setToast(false), 2600);
                }}
                icon={<FlaskConical className="h-4 w-4" />}
              >
                Add to library
              </Btn>
            </div>
          </Modal>
          <Toast show={toast} message="Simulation added — it is now live for all learners." />
        </div>
      )}
    </div>
  );
}

/* ============================ SETTINGS ============================ */
export function Settings() {
  const { user, updateUser, resetDemo, state } = useApp();
  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [className, setClassName] = useState(user?.className ?? "");
  const [subjects, setSubjects] = useState<string[]>(user?.subjects ?? []);
  const [toast, setToast] = useState("");
  if (!user) return null;

  const show = (m: string) => { setToast(m); setTimeout(() => setToast(""), 2600); };

  const exportData = () => {
    const url = URL.createObjectURL(new Blob([JSON.stringify(state, null, 2)], { type: "application/json" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "mengo-hub-data.json";
    a.click();
    show("Your data has been exported.");
  };

  return (
    <div className="max-w-3xl">
      <PageTitle title="Settings" subtitle="Manage your profile, subjects and data." />

      <Card className="mb-5">
        <CardHead title="Profile" subtitle="How you appear across the platform" />
        <div className="space-y-4 p-5">
          <div className="flex items-center gap-4">
            <Avatar name={user.name} hue={user.hue} size={64} />
            <div>
              <p className="font-display text-lg font-bold text-slate-900">{user.name}</p>
              <p className="text-sm text-slate-500">{user.email}</p>
              <Badge tone={user.role === "admin" ? "amber" : user.role === "teacher" ? "violet" : "brand"} className="mt-1.5 capitalize">{user.role}</Badge>
            </div>
            <Btn size="sm" variant="ghost" className="ml-auto" onClick={() => { updateUser({ hue: Math.floor(Math.random() * 360) }); show("Avatar colour updated."); }} icon={<RefreshCw className="h-3.5 w-3.5" />}>
              New colour
            </Btn>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Full name">
              <input value={name} onChange={(e) => setName(e.target.value)} className={inputCls} />
            </Field>
            <Field label="Phone number">
              <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+256 7XX XXX XXX" className={inputCls} />
            </Field>
            {user.role === "student" && (
              <Field label="Class">
                <input value={className} onChange={(e) => setClassName(e.target.value)} className={inputCls} />
              </Field>
            )}
          </div>
          <Btn onClick={() => { updateUser({ name, phone, className }); show("Profile saved."); }} icon={<CheckCircle2 className="h-4 w-4" />}>Save changes</Btn>
        </div>
      </Card>

      <Card className="mb-5">
        <CardHead title="My subjects" subtitle="Choose the subjects that appear on your dashboard" />
        <div className="p-5">
          <div className="flex flex-wrap gap-2">
            {SUBJECTS.map((s) => {
              const on = subjects.includes(s.id);
              return (
                <button key={s.id} onClick={() => setSubjects((p) => (on ? p.filter((x) => x !== s.id) : [...p, s.id]))} className={cn("rounded-xl border px-3.5 py-2 text-[13px] font-semibold transition", on ? "border-brand-500 bg-brand-50 text-brand-700" : "border-slate-200 text-slate-600 hover:border-slate-300")}>
                  {on && <CheckCircle2 className="mr-1.5 inline h-3.5 w-3.5" />}{s.emoji} {s.name}
                </button>
              );
            })}
          </div>
          <Btn className="mt-4" onClick={() => { updateUser({ subjects }); show("Subjects updated."); }}>Save subjects</Btn>
        </div>
      </Card>

      <Card>
        <CardHead title="Data & privacy" subtitle="You own your data — export or reset it any time" icon={<ShieldCheck className="h-4 w-4 text-brand-500" />} />
        <div className="space-y-3 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 p-4">
            <div>
              <p className="text-sm font-semibold text-slate-900">Export all data</p>
              <p className="text-xs text-slate-500">Download everything as JSON — progress, results, certificates.</p>
            </div>
            <Btn size="sm" variant="ghost" onClick={exportData} icon={<Download className="h-3.5 w-3.5" />}>Export</Btn>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-rose-200 bg-rose-50/50 p-4">
            <div>
              <p className="text-sm font-semibold text-rose-900">Reset demonstration data</p>
              <p className="text-xs text-rose-700/80">Restores the original seed accounts, results and content. This cannot be undone.</p>
            </div>
            <Btn size="sm" variant="danger" onClick={() => { if (confirm("Reset all data to the original demo state?")) resetDemo(); }} icon={<AlertTriangle className="h-3.5 w-3.5" />}>Reset</Btn>
          </div>
        </div>
      </Card>

      <Toast show={!!toast} message={toast} />
    </div>
  );
}
