import { AnimatePresence, motion } from "framer-motion";
import {
  Award, BarChart3, Bell, BookOpen, Brain, CalendarCheck, ChevronDown, ClipboardList, CreditCard,
  FlaskConical, GraduationCap, Home, LayoutGrid, LogOut, Menu, MessageSquare, Search, Settings,
  Trophy, Users, X, FileText, Sparkles, ShieldCheck,
} from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { cn } from "../utils/cn";
import { Link, useRouter } from "../router";
import { useApp } from "../lib/store";
import { Avatar, Badge, Btn } from "./Kit";
import { SUBJECTS } from "../data/curriculum";
import type { Role } from "../lib/types";

interface NavItem {
  to: string;
  label: string;
  icon: typeof Home;
  roles: Role[];
  badge?: number;
}

export function useNav(): { group: string; items: NavItem[] }[] {
  const { state, user } = useApp();
  return useMemo(() => {
    const myAssignments = user?.role === "student"
      ? state.assignments.filter((a) => a.published && a.classes.includes(user.className ?? "") && !state.attempts.some((t) => t.userId === user.id && t.assignmentId === a.id)).length
      : 0;
    return [
      {
        group: "Learn",
        items: [
          { to: "app", label: "Dashboard", icon: Home, roles: ["student", "teacher", "admin"] },
          { to: "app/subjects", label: "Subjects & Notes", icon: BookOpen, roles: ["student", "teacher"] },
          { to: "app/labs", label: "Virtual Labs", icon: FlaskConical, roles: ["student", "teacher", "admin"] },
          { to: "app/practice", label: "Practice", icon: ClipboardList, roles: ["student"] },
          { to: "app/assignments", label: "Assignments", icon: FileText, roles: ["student"], badge: myAssignments },
          { to: "app/mocks", label: "Mock Exams", icon: GraduationCap, roles: ["student"] },
          { to: "app/tutor", label: "AI Tutor", icon: Brain, roles: ["student", "teacher"] },
        ],
      },
      {
        group: "Track",
        items: [
          { to: "app/performance", label: "My Performance", icon: BarChart3, roles: ["student"] },
          { to: "app/planner", label: "Study Planner", icon: CalendarCheck, roles: ["student"] },
          { to: "app/leaderboard", label: "Leaderboard", icon: Trophy, roles: ["student", "teacher"] },
          { to: "app/certificates", label: "Certificates", icon: Award, roles: ["student", "teacher", "admin"] },
        ],
      },
      {
        group: "Teach",
        items: [
          { to: "app/classes", label: "My Classes", icon: Users, roles: ["teacher"] },
          { to: "app/gradebook", label: "Gradebook", icon: LayoutGrid, roles: ["teacher"] },
          { to: "app/analytics", label: "Class Analytics", icon: BarChart3, roles: ["teacher", "admin"] },
          { to: "app/manage-assignments", label: "Assignments", icon: ClipboardList, roles: ["teacher"] },
        ],
      },
      {
        group: "School",
        items: [
          { to: "app/community", label: "Class Chat", icon: MessageSquare, roles: ["student", "teacher", "admin"] },
          { to: "app/announcements", label: "Announcements", icon: Bell, roles: ["student", "teacher", "admin"] },
          { to: "app/users", label: "People", icon: Users, roles: ["admin"] },
          { to: "app/finance", label: "Fees & Payments", icon: CreditCard, roles: ["admin", "student"] },
          { to: "app/exams-board", label: "Exams Board", icon: ShieldCheck, roles: ["admin"] },
          { to: "app/settings", label: "Settings", icon: Settings, roles: ["student", "teacher", "admin"] },
        ],
      },
    ];
  }, [state.assignments, state.attempts, user]);
}

function SearchPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState("");
  const { navigate } = useRouter();
  const results = useMemo(() => {
    if (!q.trim()) return [];
    const needle = q.toLowerCase();
    const topics = SUBJECTS.flatMap((s) => s.topics)
      .filter((t) => t.title.toLowerCase().includes(needle) || t.overview.toLowerCase().includes(needle))
      .slice(0, 6)
      .map((t) => ({ label: t.title, sub: SUBJECTS.find((s) => s.id === t.subjectId)!.name, to: `app/topic/${t.id}` }));
    const subs = SUBJECTS.filter((s) => s.name.toLowerCase().includes(needle)).map((s) => ({ label: s.name, sub: "Subject", to: `app/subject/${s.id}` }));
    return [...subs, ...topics].slice(0, 8);
  }, [q]);

  useEffect(() => {
    if (!open) setQ("");
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[80] flex items-start justify-center p-4 pt-[12vh]">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-ink-950/60 backdrop-blur-sm" />
          <motion.div initial={{ opacity: 0, y: -16, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8 }} className="relative w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center gap-3 border-b border-slate-100 px-4">
              <Search className="h-5 w-5 text-slate-400" />
              <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search subjects, topics, notes…" className="h-14 flex-1 bg-transparent text-[15px] outline-none placeholder:text-slate-400" />
              <kbd className="rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] text-slate-500">ESC</kbd>
            </div>
            <div className="max-h-80 overflow-y-auto p-2">
              {!q && <p className="px-3 py-6 text-center text-sm text-slate-400">Type to search the whole curriculum.</p>}
              {q && !results.length && <p className="px-3 py-6 text-center text-sm text-slate-400">No results for “{q}”.</p>}
              {results.map((r) => (
                <button
                  key={r.to + r.label}
                  onClick={() => { navigate(r.to); onClose(); }}
                  className="flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left transition hover:bg-brand-50"
                >
                  <span className="truncate text-sm font-medium text-slate-800">{r.label}</span>
                  <span className="shrink-0 text-xs text-slate-400">{r.sub}</span>
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const { user, logout, state } = useApp();
  const { path, navigate } = useRouter();
  const nav = useNav();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState(false);
  const [menu, setMenu] = useState(false);
  const [notif, setNotif] = useState(false);

  useEffect(() => setOpen(false), [path]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearch(true);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  if (!user) return null;

  const groups = nav
    .map((g) => ({ ...g, items: g.items.filter((i) => i.roles.includes(user.role)) }))
    .filter((g) => g.items.length);

  const announcements = state.announcements.filter((a) => a.audience === "all" || a.audience === `${user.role}s`).slice(0, 5);

  const isActive = (to: string) => (to === "app" ? path === "app" : path === to || path.startsWith(to + "/"));

  const SidebarContent = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center gap-2.5 border-b border-white/10 px-5">
        <span className="relative grid h-9 w-9 place-items-center overflow-hidden rounded-xl bg-gradient-to-br from-brand-500 via-brand-600 to-mint-500 shadow-lg shadow-brand-500/30">
          <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M4 19V6l8 5 8-5v13" />
            <path d="M4 12l8 5 8-5" />
          </svg>
        </span>
        <div className="leading-none">
          <p className="font-display text-[15px] font-bold text-white">Mengo Hub</p>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-300">System</p>
        </div>
        <button onClick={() => setOpen(false)} className="ml-auto grid h-9 w-9 place-items-center rounded-lg text-slate-400 hover:bg-white/10 hover:text-white lg:hidden" aria-label="Close menu">
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5" aria-label="Portal">
        {groups.map((g) => (
          <div key={g.group}>
            <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">{g.group}</p>
            <ul className="space-y-0.5">
              {g.items.map((item) => {
                const active = isActive(item.to);
                return (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      className={cn(
                        "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13.5px] font-medium transition-colors",
                        active ? "text-white" : "text-slate-400 hover:text-white",
                      )}
                    >
                      {active && <motion.span layoutId="side-active" className="absolute inset-0 rounded-xl bg-gradient-to-r from-brand-600/90 to-brand-500/60 shadow-lg shadow-brand-900/30" transition={{ type: "spring", stiffness: 360, damping: 32 }} />}
                      <item.icon className={cn("relative h-[18px] w-[18px] shrink-0 transition", active ? "text-white" : "text-slate-500 group-hover:text-brand-300")} />
                      <span className="relative truncate">{item.label}</span>
                      {!!item.badge && <span className="relative ml-auto rounded-full bg-mint-500 px-1.5 py-0.5 text-[10px] font-bold text-white">{item.badge}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {user.plan === "free" && user.role === "student" && (
        <div className="mx-3 mb-3 rounded-2xl border border-white/10 bg-gradient-to-br from-brand-600/30 to-mint-500/20 p-4">
          <Sparkles className="h-5 w-5 text-gold-300" />
          <p className="mt-2 font-display text-sm font-bold text-white">Unlock Learner Plus</p>
          <p className="mt-1 text-xs text-slate-300">Unlimited AI tutor, exam predictor and unlimited mocks.</p>
          <button onClick={() => navigate("app/finance")} className="mt-3 w-full rounded-lg bg-white py-2 text-xs font-bold text-slate-900 transition hover:bg-slate-100">
            Upgrade — UGX 15,000
          </button>
        </div>
      )}

      <div className="border-t border-white/10 p-3">
        <button onClick={logout} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13.5px] font-medium text-slate-400 transition hover:bg-white/5 hover:text-white">
          <LogOut className="h-[18px] w-[18px]" /> Sign out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[268px] bg-ink-900 lg:block">{SidebarContent}</aside>

      {/* mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} className="fixed inset-0 z-40 bg-ink-950/60 backdrop-blur-sm lg:hidden" />
            <motion.aside initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }} transition={{ type: "spring", stiffness: 340, damping: 34 }} className="fixed inset-y-0 left-0 z-50 w-[280px] bg-ink-900 lg:hidden">
              {SidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="lg:pl-[268px]">
        {/* top bar */}
        <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl">
          <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
            <button onClick={() => setOpen(true)} className="grid h-10 w-10 place-items-center rounded-xl text-slate-600 transition hover:bg-slate-100 lg:hidden" aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </button>

            <button
              onClick={() => setSearch(true)}
              className="group flex h-10 flex-1 max-w-sm items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-400 transition hover:border-slate-300 hover:bg-white"
            >
              <Search className="h-4 w-4" />
              <span className="flex-1 text-left">Search topics, notes…</span>
              <kbd className="hidden rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-medium sm:block">⌘K</kbd>
            </button>

            <div className="ml-auto flex items-center gap-1.5">
              <div className="relative">
                <button onClick={() => { setNotif((v) => !v); setMenu(false); }} className="relative grid h-10 w-10 place-items-center rounded-xl text-slate-600 transition hover:bg-slate-100" aria-label="Notifications">
                  <Bell className="h-5 w-5" />
                  {!!announcements.length && <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />}
                </button>
                <AnimatePresence>
                  {notif && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setNotif(false)} />
                      <motion.div initial={{ opacity: 0, y: 8, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 4 }} className="absolute right-0 z-20 mt-2 w-80 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
                        <p className="border-b border-slate-100 px-4 py-3 font-display text-sm font-bold text-slate-900">Notifications</p>
                        <div className="max-h-80 overflow-y-auto">
                          {announcements.map((a) => (
                            <button key={a.id} onClick={() => { navigate("app/announcements"); setNotif(false); }} className="block w-full border-b border-slate-50 px-4 py-3 text-left transition hover:bg-slate-50">
                              <p className="text-[13px] font-semibold text-slate-900">{a.title}</p>
                              <p className="mt-0.5 line-clamp-2 text-xs text-slate-500">{a.body}</p>
                              <p className="mt-1 text-[10px] uppercase tracking-wider text-slate-400">{a.authorName}</p>
                            </button>
                          ))}
                          {!announcements.length && <p className="px-4 py-8 text-center text-sm text-slate-400">You're all caught up.</p>}
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              <div className="relative">
                <button onClick={() => { setMenu((v) => !v); setNotif(false); }} className="flex items-center gap-2 rounded-xl py-1.5 pl-1.5 pr-2 transition hover:bg-slate-100" aria-label="Account menu">
                  <Avatar name={user.name} hue={user.hue} size={34} />
                  <span className="hidden text-left sm:block">
                    <span className="block text-[13px] font-semibold leading-tight text-slate-900">{user.name.split(" ")[0]}</span>
                    <span className="block text-[11px] capitalize leading-tight text-slate-500">{user.role}</span>
                  </span>
                  <ChevronDown className="hidden h-4 w-4 text-slate-400 sm:block" />
                </button>
                <AnimatePresence>
                  {menu && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setMenu(false)} />
                      <motion.div initial={{ opacity: 0, y: 8, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 4 }} className="absolute right-0 z-20 mt-2 w-60 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl">
                        <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
                          <Avatar name={user.name} hue={user.hue} size={40} />
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-slate-900">{user.name}</p>
                            <p className="truncate text-xs text-slate-500">{user.email}</p>
                          </div>
                        </div>
                        <div className="mt-2 flex items-center justify-between px-3 py-2">
                          <span className="text-xs text-slate-500">Plan</span>
                          <Badge tone={user.plan === "free" ? "slate" : "mint"}>{user.plan === "plus" ? "Learner Plus" : user.plan === "school" ? "School" : "Free"}</Badge>
                        </div>
                        <button onClick={() => { navigate("app/settings"); setMenu(false); }} className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-slate-700 transition hover:bg-slate-50">
                          <Settings className="h-4 w-4" /> Settings
                        </button>
                        <Link to="" className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-slate-700 transition hover:bg-slate-50" onClick={() => setMenu(false)}>
                          <Home className="h-4 w-4" /> Public website
                        </Link>
                        <button onClick={logout} className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-rose-600 transition hover:bg-rose-50">
                          <LogOut className="h-4 w-4" /> Sign out
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 sm:py-8">
          <AnimatePresence mode="wait">
            <motion.div key={path} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.25 }}>
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <SearchPalette open={search} onClose={() => setSearch(false)} />
    </div>
  );
}

export { Btn };
