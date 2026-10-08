import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

const LEADERBOARD = [
  { rank: 1, name: "Ivan Mukasa", school: "Gayaza HS", game: "COD Mobile", score: 12450, wins: 87, losses: 12 },
  { rank: 2, name: "Sarah Nakamya", school: "Nabisunsa", game: "FC Mobile", score: 11200, wins: 72, losses: 18 },
  { rank: 3, name: "David Ochieng", school: "SMACK", game: "PUBG Mobile", score: 10800, wins: 65, losses: 20 },
  { rank: 4, name: "Grace Atim", school: "Maryhill", game: "Chess", score: 9900, wins: 58, losses: 5 },
  { rank: 5, name: "Peter Wasswa", school: "St. Kisubi", game: "Clash Royale", score: 9450, wins: 61, losses: 22 },
  { rank: 6, name: "Amina Nalubega", school: "Gayaza HS", game: "Ludo", score: 8700, wins: 48, losses: 15 },
  { rank: 7, name: "Joshua Mutyaba", school: "SMACK", game: "Sudoku", score: 8200, wins: 42, losses: 8 },
  { rank: 8, name: "Patricia Aine", school: "Nabisunsa", game: "COD Mobile", score: 7900, wins: 55, losses: 30 },
  { rank: 9, name: "Emmanuel Ssekiziyi", school: "Maryhill", game: "FC Mobile", score: 7500, wins: 40, losses: 25 },
  { rank: 10, name: "Hannah Nabwire", school: "Gayaza HS", game: "PUBG Mobile", score: 7100, wins: 38, losses: 28 },
];

export default function LeaderboardPage() {
  return (
    <>
      <Navbar />
      <section className="pt-28 pb-16">
        <div className="mx-auto max-w-5xl px-5 sm:px-8">
          <Link href="/gaming" className="text-sm text-emerald-400 hover:text-emerald-300 mb-4 inline-block">← Back to Gaming Society</Link>
          <div className="text-center mb-12">
            <span className="badge badge-gaming mb-3">🏆 Leaderboard</span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
              Top <span className="gradient-gaming-text">Players</span>
            </h1>
            <p className="mt-3 text-slate-400">Ranked by score across all games this week</p>
          </div>

          {/* Top 3 podium */}
          <div className="grid grid-cols-3 gap-4 mb-10">
            {[LEADERBOARD[1], LEADERBOARD[0], LEADERBOARD[2]].map((p, i) => {
              const pos = i === 0 ? 2 : i === 1 ? 1 : 3;
              return (
                <div key={p.name} className={`glass-card text-center p-6 ${pos === 1 ? "ring-2 ring-amber-500/40 -mt-4" : ""}`}>
                  <div className="text-3xl mb-2">{pos === 1 ? "🥇" : pos === 2 ? "🥈" : "🥉"}</div>
                  <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-full gradient-gaming text-sm font-bold text-white">
                    {p.name.split(" ").map(w => w[0]).join("")}
                  </div>
                  <div className="mt-3 text-sm font-bold text-white">{p.name}</div>
                  <div className="text-xs text-slate-400">{p.school}</div>
                  <div className="mt-2 text-lg font-extrabold text-emerald-300">{p.score.toLocaleString()}</div>
                  <div className="text-xs text-slate-500">{p.game}</div>
                </div>
              );
            })}
          </div>

          {/* Full table */}
          <div className="glass-card overflow-hidden p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-400">#</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-400">Player</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-400 hidden sm:table-cell">School</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-400 hidden md:table-cell">Game</th>
                    <th className="px-5 py-3 text-right text-xs font-semibold uppercase text-slate-400">W/L</th>
                    <th className="px-5 py-3 text-right text-xs font-semibold uppercase text-slate-400">Score</th>
                  </tr>
                </thead>
                <tbody>
                  {LEADERBOARD.map((p) => (
                    <tr key={p.rank} className="border-b border-white/5 transition-colors hover:bg-white/5">
                      <td className="px-5 py-4 text-sm font-bold text-slate-300">{p.rank}</td>
                      <td className="px-5 py-4 text-sm font-semibold text-white">{p.name}</td>
                      <td className="px-5 py-4 text-sm text-slate-400 hidden sm:table-cell">{p.school}</td>
                      <td className="px-5 py-4 text-sm text-slate-400 hidden md:table-cell">{p.game}</td>
                      <td className="px-5 py-4 text-right text-sm text-slate-400">{p.wins}/{p.losses}</td>
                      <td className="px-5 py-4 text-right text-sm font-bold text-emerald-300">{p.score.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
