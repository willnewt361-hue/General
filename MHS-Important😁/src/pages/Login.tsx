import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Eye, EyeOff, GraduationCap, Loader2, Lock, Mail, Presentation, ShieldCheck, User as UserIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "../utils/cn";
import { Link, useRouter } from "../router";
import { useApp } from "../lib/store";
import type { Role } from "../lib/types";

const DEMOS: { role: Role; label: string; email: string; icon: typeof GraduationCap; desc: string }[] = [
  { role: "student", label: "Student", email: "student@mengohub.ug", icon: GraduationCap, desc: "S.6 Sciences · Learner Plus" },
  { role: "teacher", label: "Teacher", email: "teacher@mengohub.ug", icon: Presentation, desc: "Head of Mathematics" },
  { role: "admin", label: "Administrator", email: "admin@mengohub.ug", icon: ShieldCheck, desc: "Head Teacher · full access" },
];

const CLASSES = ["S.1", "S.2", "S.3", "S.4 East", "S.4 West", "S.5 Sciences", "S.5 Arts", "S.6 Sciences", "S.6 Arts"];

export function Login() {
  const { login, signup, user } = useApp();
  const { navigate, path } = useRouter();
  const [mode, setMode] = useState<"login" | "signup">(path === "signup" ? "signup" : "login");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<Role>("student");
  const [className, setClassName] = useState("S.4 East");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (user) navigate("app");
  }, [user, navigate]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    setTimeout(() => {
      const res = mode === "login" ? login(email, pass) : signup({ name, email, pass, role, className });
      setBusy(false);
      if (!res.ok) setError(res.error ?? "Something went wrong.");
      else navigate("app");
    }, 600);
  };

  const useDemo = (demoEmail: string) => {
    setMode("login");
    setEmail(demoEmail);
    setPass("mengo123");
    setError("");
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left — brand panel */}
      <div className="relative hidden overflow-hidden bg-ink-900 lg:block noise">
        <div aria-hidden className="absolute inset-0 grid-pattern-dark [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
        <div aria-hidden className="pointer-events-none absolute -left-32 top-20 h-[30rem] w-[30rem] rounded-full bg-brand-600/30 blur-[120px] animate-float-slow" />
        <div aria-hidden className="pointer-events-none absolute -right-20 bottom-0 h-96 w-96 rounded-full bg-mint-500/20 blur-[120px] animate-float" />

        <div className="relative flex h-full flex-col justify-between p-12">
          <Link to="" className="inline-flex items-center gap-2.5">
            <span className="relative grid h-10 w-10 place-items-center overflow-hidden rounded-xl bg-gradient-to-br from-brand-500 via-brand-600 to-mint-500 shadow-lg shadow-brand-500/30">
              <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M4 19V6l8 5 8-5v13" />
                <path d="M4 12l8 5 8-5" />
              </svg>
            </span>
            <span className="leading-none">
              <span className="block font-display text-lg font-bold text-white">Mengo Hub</span>
              <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-300">System</span>
            </span>
          </Link>

          <div className="max-w-md">
            <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }} className="font-display text-4xl font-bold leading-[1.1] tracking-tight text-white">
              Welcome back to the <span className="shimmer-text animate-shimmer">smartest classroom</span> in Uganda.
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.25 }} className="mt-5 text-lg text-slate-300">
              Your notes, past papers, virtual labs, AI tutor and results — all in one place, ready when you are.
            </motion.p>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }} className="mt-10 grid grid-cols-3 gap-4">
              {[
                { v: "38k+", l: "Past papers" },
                { v: "24", l: "PhET labs" },
                { v: "32", l: "Topics" },
              ].map((s) => (
                <div key={s.l} className="glass-dark rounded-2xl p-4">
                  <p className="font-display text-2xl font-bold text-white">{s.v}</p>
                  <p className="text-xs text-slate-400">{s.l}</p>
                </div>
              ))}
            </motion.div>
          </div>

          <p className="text-xs text-slate-500">© {new Date().getFullYear()} Mengo Hub System · Apache-2.0 open source</p>
        </div>
      </div>

      {/* Right — form */}
      <div className="flex items-center justify-center bg-white px-5 py-10 sm:px-10">
        <div className="w-full max-w-md">
          <Link to="" className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900 lg:hidden">
            ← Back to website
          </Link>

          <div className="mb-8">
            <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900">{mode === "login" ? "Sign in to your hub" : "Create your account"}</h2>
            <p className="mt-2 text-slate-500">
              {mode === "login" ? "Enter your details to continue learning." : "Free forever for learners. No card required."}
            </p>
          </div>

          {/* demo accounts */}
          <div className="mb-6 rounded-2xl border border-brand-100 bg-brand-50/60 p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-brand-700">Try a demo account</p>
            <div className="mt-3 grid gap-2">
              {DEMOS.map((d) => (
                <button
                  key={d.role}
                  onClick={() => useDemo(d.email)}
                  className="group flex items-center gap-3 rounded-xl border border-white bg-white px-3 py-2.5 text-left shadow-sm transition hover:border-brand-300 hover:shadow-md"
                >
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-brand-500 to-brand-600 text-white">
                    <d.icon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[13px] font-semibold text-slate-900">{d.label}</span>
                    <span className="block truncate text-[11px] text-slate-500">{d.desc}</span>
                  </span>
                  <ArrowRight className="h-4 w-4 shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-brand-500" />
                </button>
              ))}
            </div>
            <p className="mt-2.5 text-[11px] text-brand-700/70">Password for all demo accounts: <b>mengo123</b></p>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <AnimatePresence mode="popLayout">
              {mode === "signup" && (
                <motion.div key="name" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-medium text-slate-700">Full name</span>
                    <div className="relative">
                      <UserIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Nakato Priscilla" className="h-12 w-full rounded-xl border border-slate-200 pl-10 pr-4 text-sm outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10" />
                    </div>
                  </label>
                </motion.div>
              )}
            </AnimatePresence>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">Email address</span>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@mengohub.ug" className="h-12 w-full rounded-xl border border-slate-200 pl-10 pr-4 text-sm outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10" />
              </div>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">Password</span>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input required type={show ? "text" : "password"} value={pass} onChange={(e) => setPass(e.target.value)} placeholder="••••••••" className="h-12 w-full rounded-xl border border-slate-200 pl-10 pr-11 text-sm outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10" />
                <button type="button" onClick={() => setShow((v) => !v)} aria-label={show ? "Hide password" : "Show password"} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700">
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </label>

            <AnimatePresence mode="popLayout">
              {mode === "signup" && (
                <motion.div key="role" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="space-y-4 overflow-hidden">
                  <div>
                    <span className="mb-1.5 block text-sm font-medium text-slate-700">I am a…</span>
                    <div className="grid grid-cols-2 gap-2">
                      {(["student", "teacher"] as Role[]).map((r) => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => setRole(r)}
                          className={cn("rounded-xl border px-4 py-3 text-sm font-semibold capitalize transition", role === r ? "border-brand-500 bg-brand-50 text-brand-700 ring-2 ring-brand-500/20" : "border-slate-200 text-slate-600 hover:border-slate-300")}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>
                  {role === "student" && (
                    <label className="block">
                      <span className="mb-1.5 block text-sm font-medium text-slate-700">Class</span>
                      <select value={className} onChange={(e) => setClassName(e.target.value)} className="h-12 w-full rounded-xl border border-slate-200 px-3.5 text-sm outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10">
                        {CLASSES.map((c) => (
                          <option key={c}>{c}</option>
                        ))}
                      </select>
                    </label>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {error && (
                <motion.p initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={busy}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 text-sm font-semibold text-white shadow-lg shadow-brand-500/30 transition hover:shadow-xl hover:shadow-brand-500/40 active:scale-[0.99] disabled:opacity-70"
            >
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {busy ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}
              {!busy && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            {mode === "login" ? "New to Mengo Hub?" : "Already have an account?"}{" "}
            <button onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); }} className="font-semibold text-brand-600 transition hover:text-brand-700">
              {mode === "login" ? "Create a free account" : "Sign in instead"}
            </button>
          </p>

          <p className="mt-8 text-center text-[11px] leading-relaxed text-slate-400">
            Accounts are stored securely in your browser for this deployment. By continuing you agree to the Mengo Hub acceptable-use policy.
          </p>
        </div>
      </div>
    </div>
  );
}
