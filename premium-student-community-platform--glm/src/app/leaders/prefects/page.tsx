import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

const PREFECTS = [
  { role: "Head Prefect", name: "Emmanuel Ssekiziyi", school: "SMACK", emoji: "👑" },
  { role: "Deputy Head Prefect", name: "Hannah Nabwire", school: "Nabisunsa", emoji: "⭐" },
  { role: "Time Keeper", name: "Peter Wasswa", school: "Kisubi", emoji: "⏰" },
  { role: "Library Prefect", name: "Grace Atim", school: "Maryhill", emoji: "📚" },
  { role: "Dining Hall Prefect", name: "Ivan Mukasa", school: "Gayaza HS", emoji: "🍽️" },
  { role: "Dormitory Prefect", name: "David Ochieng", school: "SMACK", emoji: "🏠" },
];

const DUTY_ROSTER = [
  { day: "Monday", prefect: "Emmanuel S.", duty: "Assembly coordination", time: "7:00 AM" },
  { day: "Tuesday", prefect: "Hannah N.", duty: "Library supervision", time: "3:00 PM" },
  { day: "Wednesday", prefect: "Peter W.", duty: "Time keeping", time: "All day" },
  { day: "Thursday", prefect: "Grace A.", duty: "Dining hall duty", time: "12:00 PM" },
  { day: "Friday", prefect: "Ivan M.", duty: "Sports coordination", time: "4:00 PM" },
];

export default function PrefectsPage() {
  return (
    <>
      <Navbar />
      <section className="pt-28 pb-16">
        <div className="mx-auto max-w-5xl px-5 sm:px-8">
          <Link href="/leaders" className="text-sm text-blue-400 hover:text-blue-300 mb-4 inline-block">← Back to Student Leader</Link>
          <div className="text-center mb-12">
            <span className="badge badge-blog mb-3">👑 Prefect Body</span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
              Prefect <span className="gradient-blog-text">Command</span>
            </h1>
            <p className="mt-3 text-slate-400">Duty rosters, discipline coordination, and school management</p>
          </div>

          {/* Prefects list */}
          <div className="mb-14">
            <h2 className="text-xl font-bold text-white mb-6">👥 Prefect Body</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {PREFECTS.map((p, i) => (
                <div key={p.role} className="reveal glass-card p-5 flex items-center gap-4" data-delay={String(i * 80)}>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full gradient-blog text-xl">{p.emoji}</div>
                  <div>
                    <div className="text-sm font-bold text-white">{p.name}</div>
                    <div className="text-xs text-amber-300 font-medium">{p.role}</div>
                    <div className="text-xs text-slate-400">{p.school}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Duty Roster */}
          <div className="mb-14">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">📋 Duty Roster (This Week)</h2>
              <button className="btn-secondary !py-2 !px-4 !text-xs !rounded-lg">
                Edit Roster
              </button>
            </div>
            <div className="glass-card overflow-hidden p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-400">Day</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-400">Prefect</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-400 hidden sm:table-cell">Duty</th>
                      <th className="px-5 py-3 text-right text-xs font-semibold uppercase text-slate-400">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {DUTY_ROSTER.map((d) => (
                      <tr key={d.day} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="px-5 py-4 text-sm font-semibold text-white">{d.day}</td>
                        <td className="px-5 py-4 text-sm text-slate-300">{d.prefect}</td>
                        <td className="px-5 py-4 text-sm text-slate-400 hidden sm:table-cell">{d.duty}</td>
                        <td className="px-5 py-4 text-right text-sm text-amber-300">{d.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <h2 className="text-xl font-bold text-white mb-6">⚡ Quick Actions</h2>
            <div className="grid gap-3 sm:grid-cols-4">
              {[
                { label: "Post Announcement", icon: "📢", href: "/leaders/announcements" },
                { label: "Discussion", icon: "💬", href: "/leaders/discussions" },
                { label: "Discipline Log", icon: "📝", href: "/leaders/discussions" },
                { label: "Report Issue", icon: "🚨", href: "/leaders/discussions" },
              ].map((a) => (
                <Link key={a.label} href={a.href} className="glass-card p-5 text-center group">
                  <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{a.icon}</div>
                  <div className="text-sm font-semibold text-white group-hover:text-amber-300 transition-colors">{a.label}</div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
