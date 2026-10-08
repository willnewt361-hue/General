import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

const SECTIONS = [
  {
    key: "general",
    title: "General",
    desc: "Open to all students. School-wide announcements, discussions, and polls.",
    icon: "🏫",
    href: "/leaders/discussions",
    badge: "badge-brand",
    gradient: "gradient-brand-text",
    stats: { members: "2,400+", posts: "320", active: "45" },
  },
  {
    key: "council",
    title: "Student Council",
    desc: "Council members only. Plan events, manage budgets, and coordinate activities.",
    icon: "🏛️",
    href: "/leaders/council",
    badge: "badge-leader",
    gradient: "gradient-leader-text",
    stats: { members: "24", posts: "87", active: "12" },
  },
  {
    key: "prefect",
    title: "Prefects",
    desc: "Prefect body. Discipline coordination, duty rosters, and school秩序 management.",
    icon: "👑",
    href: "/leaders/prefects",
    badge: "badge-blog",
    gradient: "gradient-blog-text",
    stats: { members: "18", posts: "56", active: "8" },
  },
];

const RECENT_ANNOUNCEMENTS = [
  { title: "End of Term Exams Schedule Released", section: "general", priority: "urgent", time: "2h ago", author: "Head Teacher" },
  { title: "Inter-School Sports Day — Register Now!", section: "general", priority: "high", time: "5h ago", author: "Sports Captain" },
  { title: "Council Meeting: Budget Review", section: "council", priority: "normal", time: "1d ago", author: "Council Chair" },
  { title: "Prefect Duty Roster for Week 12", section: "prefect", priority: "normal", time: "1d ago", author: "Head Prefect" },
];

const RECENT_DISCUSSIONS = [
  { title: "Should we have a school talent show?", replies: 34, section: "general", time: "3h ago" },
  { title: "Proposed changes to the dress code", replies: 56, section: "council", time: "6h ago" },
  { title: "Library hours extension request", replies: 23, section: "prefect", time: "1d ago" },
];

export default function LeadersPage() {
  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-[60vh] overflow-hidden pt-28 pb-10">
        <div className="pointer-events-none absolute top-10 right-10 h-72 w-72 rounded-full bg-blue-500/15 blur-[100px]" />
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="badge badge-leader mb-4 animate-fade-down">👑 Student Leader</span>
            <h1 className="mt-4 text-[clamp(2.2rem,6vw,4rem)] font-extrabold leading-tight tracking-tight text-white animate-fade-up">
              Lead. <span className="gradient-leader-text">Organize.</span> Inspire.
            </h1>
            <p className="mt-5 text-lg text-slate-400 animate-fade-up delay-200">
              Announcements, discussions, and coordination — for general students, council members, and prefects. Lead your school effectively.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4 animate-fade-up delay-300">
              <Link href="/leaders/announcements" className="btn-primary !bg-gradient-to-r !from-blue-600 !to-indigo-500 text-base">
                <span>📢 Announcements</span>
              </Link>
              <Link href="/leaders/discussions" className="btn-secondary text-base">
                💬 Discussions
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Three sections */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="reveal text-center mb-12">
            <h2 className="text-2xl font-bold text-white">Three Sections, <span className="gradient-leader-text">One Purpose</span></h2>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {SECTIONS.map((s, i) => (
              <Link key={s.key} href={s.href} className="reveal glass-card group p-7" data-delay={String(i * 150)}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-4xl">{s.icon}</span>
                  <span className={`badge ${s.badge}`}>{s.key}</span>
                </div>
                <h3 className={`text-xl font-bold ${s.gradient}`}>{s.title}</h3>
                <p className="mt-2 text-sm text-slate-400">{s.desc}</p>
                <div className="mt-5 grid grid-cols-3 gap-2">
                  <div className="text-center rounded-lg bg-white/5 p-2">
                    <div className="text-sm font-bold text-white">{s.stats.members}</div>
                    <div className="text-[10px] text-slate-400">Members</div>
                  </div>
                  <div className="text-center rounded-lg bg-white/5 p-2">
                    <div className="text-sm font-bold text-white">{s.stats.posts}</div>
                    <div className="text-[10px] text-slate-400">Posts</div>
                  </div>
                  <div className="text-center rounded-lg bg-white/5 p-2">
                    <div className="text-sm font-bold text-white">{s.stats.active}</div>
                    <div className="text-[10px] text-slate-400">Active</div>
                  </div>
                </div>
                <div className="mt-4 text-sm font-medium text-slate-300 group-hover:text-white transition-colors">
                  Enter Section →
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Announcements */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="reveal flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white">📢 Recent Announcements</h2>
              <p className="text-sm text-slate-400 mt-1">Stay updated with the latest</p>
            </div>
            <Link href="/leaders/announcements" className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors">
              View All →
            </Link>
          </div>
          <div className="space-y-3">
            {RECENT_ANNOUNCEMENTS.map((a, i) => (
              <div key={i} className="reveal glass-card flex items-center justify-between p-5" data-delay={String(i * 80)}>
                <div className="flex items-center gap-4">
                  <span className={`h-2.5 w-2.5 rounded-full shrink-0 ${a.priority === "urgent" ? "bg-red-400 animate-pulse" : a.priority === "high" ? "bg-amber-400" : "bg-blue-400"}`} />
                  <div>
                    <h4 className="text-sm font-semibold text-white">{a.title}</h4>
                    <div className="mt-0.5 text-xs text-slate-400">{a.author} • {a.time}</div>
                  </div>
                </div>
                <span className={`badge ${a.section === "general" ? "badge-brand" : a.section === "council" ? "badge-leader" : "badge-blog"} text-[10px] hidden sm:inline-flex`}>
                  {a.section}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Discussions */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="reveal flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white">💬 Active Discussions</h2>
              <p className="text-sm text-slate-400 mt-1">Join the conversation</p>
            </div>
            <Link href="/leaders/discussions" className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors">
              View All →
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {RECENT_DISCUSSIONS.map((d, i) => (
              <div key={i} className="reveal glass-card p-5" data-delay={String(i * 100)}>
                <span className={`badge ${d.section === "general" ? "badge-brand" : d.section === "council" ? "badge-leader" : "badge-blog"} text-[10px] mb-3`}>
                  {d.section}
                </span>
                <h4 className="text-sm font-semibold text-white">{d.title}</h4>
                <div className="mt-2 flex items-center gap-3 text-xs text-slate-400">
                  <span>💬 {d.replies} replies</span>
                  <span>{d.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
