import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

const COUNCIL_MEMBERS = [
  { role: "Chairperson", name: "Joshua Mutyaba", school: "SMACK", emoji: "🏛️" },
  { role: "Vice Chair", name: "Amina Nalubega", school: "Gayaza HS", emoji: "⚖️" },
  { role: "Secretary", name: "Patricia Aine", school: "Nabisunsa", emoji: "📝" },
  { role: "Treasurer", name: "David Ochieng", school: "SMACK", emoji: "💰" },
  { role: "Sports Rep", name: "Ivan Mukasa", school: "Gayaza HS", emoji: "⚽" },
  { role: "Academics Rep", name: "Grace Atim", school: "Maryhill", emoji: "📚" },
];

const COUNCIL_DISCUSSIONS = [
  { title: "Proposed changes to the school dress code", replies: 56, time: "6h ago", category: "welfare" },
  { title: "Budget allocation for Term 1 events", replies: 34, time: "1d ago", category: "academics" },
  { title: "New club registration process", replies: 23, time: "2d ago", category: "events" },
  { title: "Feedback on last week's assembly", replies: 18, time: "3d ago", category: "general" },
];

export default function CouncilPage() {
  return (
    <>
      <Navbar />
      <section className="pt-28 pb-16">
        <div className="mx-auto max-w-5xl px-5 sm:px-8">
          <Link href="/leaders" className="text-sm text-blue-400 hover:text-blue-300 mb-4 inline-block">← Back to Student Leader</Link>
          <div className="text-center mb-12">
            <span className="badge badge-leader mb-3">🏛️ Student Council</span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
              Council <span className="gradient-leader-text">Hub</span>
            </h1>
            <p className="mt-3 text-slate-400">Where student council members plan, discuss, and execute</p>
          </div>

          {/* Council members */}
          <div className="mb-14">
            <h2 className="text-xl font-bold text-white mb-6">👥 Council Members</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {COUNCIL_MEMBERS.map((m, i) => (
                <div key={m.role} className="reveal glass-card p-5 flex items-center gap-4" data-delay={String(i * 80)}>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full gradient-leader text-xl">{m.emoji}</div>
                  <div>
                    <div className="text-sm font-bold text-white">{m.name}</div>
                    <div className="text-xs text-blue-300 font-medium">{m.role}</div>
                    <div className="text-xs text-slate-400">{m.school}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick actions */}
          <div className="mb-14">
            <h2 className="text-xl font-bold text-white mb-6">⚡ Quick Actions</h2>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { label: "Post Announcement", icon: "📢", href: "/leaders/announcements" },
                { label: "Start Discussion", icon: "💬", href: "/leaders/discussions" },
                { label: "Create Poll", icon: "📊", href: "/leaders/discussions" },
              ].map((a) => (
                <Link key={a.label} href={a.href} className="glass-card p-5 text-center group">
                  <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{a.icon}</div>
                  <div className="text-sm font-semibold text-white group-hover:text-blue-300 transition-colors">{a.label}</div>
                </Link>
              ))}
            </div>
          </div>

          {/* Council discussions */}
          <div>
            <h2 className="text-xl font-bold text-white mb-6">💬 Council Discussions</h2>
            <div className="space-y-3">
              {COUNCIL_DISCUSSIONS.map((d, i) => (
                <div key={d.title} className="reveal glass-card flex items-center justify-between p-5" data-delay={String(i * 80)}>
                  <div>
                    <h4 className="text-sm font-semibold text-white">{d.title}</h4>
                    <div className="mt-1 flex items-center gap-3 text-xs text-slate-400">
                      <span className="badge badge-leader text-[10px]">{d.category}</span>
                      <span>💬 {d.replies} replies</span>
                      <span>{d.time}</span>
                    </div>
                  </div>
                  <svg className="h-5 w-5 text-slate-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
