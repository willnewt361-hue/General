import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

const LEADERBOARD_DATA = [
  { rank: 1, name: "Ivan Mukasa", school: "Gayaza HS", game: "COD Mobile", score: 12450, avatar: "IM" },
  { rank: 2, name: "Sarah Nakamya", school: "Nabisunsa", game: "FC Mobile", score: 11200, avatar: "SN" },
  { rank: 3, name: "David Ochieng", school: "SMACK", game: "PUBG", score: 10800, avatar: "DO" },
  { rank: 4, name: "Grace Atim", school: "Maryhill", game: "Chess", score: 9900, avatar: "GA" },
  { rank: 5, name: "Peter Wasswa", school: "Kisubi", game: "Clash Royale", score: 9450, avatar: "PW" },
];

const CLIPS = [
  { title: "Insane CODMW Snipe!", game: "COD Mobile", likes: 342, views: 1200, user: "Ivan M.", emoji: "🔫" },
  { title: "FC 25 Last-Minute Winner", game: "FC Mobile", likes: 287, views: 980, user: "Sarah N.", emoji: "⚽" },
  { title: "PUBG Chicken Dinner!", game: "PUBG Mobile", likes: 198, views: 650, user: "David O.", emoji: "🪖" },
  { title: "Chess Checkmate in 4!", game: "Chess", likes: 156, views: 430, user: "Grace A.", emoji: "♟️" },
];

const TOURNAMENTS = [
  { title: "COD Mobile Showdown", status: "live", players: "28/32", prize: "USh 50K", date: "Now" },
  { title: "FC 25 Inter-School Cup", status: "upcoming", players: "12/16", prize: "USh 100K", date: "Dec 20" },
  { title: "Chess Championship", status: "upcoming", players: "8/16", prize: "USh 30K", date: "Jan 5" },
  { title: "PUBG Solo Showdown", status: "completed", players: "32/32", prize: "USh 50K", date: "Dec 1" },
];

export default function GamingPage() {
  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-[70vh] overflow-hidden pt-28 pb-16">
        <div className="pointer-events-none absolute top-10 left-10 h-72 w-72 rounded-full bg-gaming-500/20 blur-[100px]" />
        <div className="pointer-events-none absolute right-10 bottom-10 h-60 w-60 rounded-full bg-emerald-400/15 blur-[80px]" />

        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="badge badge-gaming mb-4 animate-fade-down">🎮 Gaming Society</span>
            <h1 className="mt-4 text-[clamp(2.2rem,6vw,4rem)] font-extrabold leading-tight tracking-tight text-white animate-fade-up">
              Play. <span className="gradient-gaming-text">Compete.</span> Dominate.
            </h1>
            <p className="mt-5 text-lg text-slate-400 animate-fade-up delay-200">
              Join tournaments, climb leaderboards, share your best clips, and discover games — online and offline. Built for students who game.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4 animate-fade-up delay-300">
              <Link href="/gaming/leaderboard" className="btn-primary !bg-gradient-to-r !from-emerald-600 !to-cyan-500 text-base">
                <span>View Leaderboard →</span>
              </Link>
              <Link href="/gaming/tournaments" className="btn-secondary text-base">
                Join Tournament
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { label: "Active Players", value: "1,200+", icon: "🎮" },
              { label: "Games Available", value: "50+", icon: "🕹️" },
              { label: "Tournaments Run", value: "28", icon: "🏆" },
              { label: "Clips Shared", value: "450+", icon: "🎬" },
            ].map((s) => (
              <div key={s.label} className="glass-card text-center p-5">
                <div className="text-2xl mb-1">{s.icon}</div>
                <div className="text-2xl font-extrabold text-white">{s.value}</div>
                <div className="text-xs text-slate-400 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leaderboard Preview */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="reveal flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white">🏆 Live Leaderboard</h2>
              <p className="text-sm text-slate-400 mt-1">Top players this week</p>
            </div>
            <Link href="/gaming/leaderboard" className="text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors">
              View All →
            </Link>
          </div>
          <div className="reveal glass-card overflow-hidden p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-400">Rank</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-400">Player</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-400 hidden sm:table-cell">School</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-400 hidden md:table-cell">Game</th>
                    <th className="px-5 py-3 text-right text-xs font-semibold uppercase text-slate-400">Score</th>
                  </tr>
                </thead>
                <tbody>
                  {LEADERBOARD_DATA.map((p) => (
                    <tr key={p.rank} className="border-b border-white/5 transition-colors hover:bg-white/5">
                      <td className="px-5 py-4">
                        <span className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${p.rank <= 3 ? "gradient-gaming text-white" : "bg-white/10 text-slate-300"}`}>
                          {p.rank}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/20 text-sm font-bold text-emerald-300">
                            {p.avatar}
                          </div>
                          <span className="text-sm font-semibold text-white">{p.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-400 hidden sm:table-cell">{p.school}</td>
                      <td className="px-5 py-4 text-sm text-slate-400 hidden md:table-cell">{p.game}</td>
                      <td className="px-5 py-4 text-right text-sm font-bold text-emerald-300">{p.score.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Clips */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="reveal flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white">🎬 Top Clips</h2>
              <p className="text-sm text-slate-400 mt-1">Best moments from the community</p>
            </div>
            <Link href="/gaming/clips" className="text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors">
              View All →
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {CLIPS.map((c, i) => (
              <div key={c.title} className="reveal glass-card p-5" data-delay={String(i * 100)}>
                <div className="text-4xl mb-3">{c.emoji}</div>
                <div className="text-sm font-semibold text-white">{c.title}</div>
                <div className="mt-1 text-xs text-slate-400">{c.game} • by {c.user}</div>
                <div className="mt-3 flex items-center gap-3 text-xs text-slate-400">
                  <span>❤️ {c.likes}</span>
                  <span>👁 {c.views}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tournaments */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="reveal flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white">🏆 Tournaments</h2>
              <p className="text-sm text-slate-400 mt-1">Compete and win prizes</p>
            </div>
            <Link href="/gaming/tournaments" className="text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors">
              View All →
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {TOURNAMENTS.map((t, i) => (
              <div key={t.title} className="reveal glass-card p-6" data-delay={String(i * 100)}>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-lg font-bold text-white">{t.title}</div>
                    <div className="mt-1 flex items-center gap-3 text-sm text-slate-400">
                      <span>👥 {t.players}</span>
                      <span>🎁 {t.prize}</span>
                      <span>📅 {t.date}</span>
                    </div>
                  </div>
                  <span className={`badge ${t.status === "live" ? "badge-gaming" : t.status === "upcoming" ? "badge-brand" : "badge-blog"}`}>
                    {t.status}
                  </span>
                </div>
                {t.status !== "completed" && (
                  <button className="mt-4 btn-secondary !py-2 !px-4 !text-xs !rounded-lg w-full sm:w-auto">
                    {t.status === "live" ? "Watch Now" : "Register"}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
