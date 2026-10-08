import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

const CLIPS = [
  { id: "1", title: "Insane CODMW Quickscope!", game: "COD Mobile", likes: 342, views: 1200, user: "Ivan M.", emoji: "🔫", duration: "0:45" },
  { id: "2", title: "FC 25 Last-Minute Winner", game: "FC Mobile", likes: 287, views: 980, user: "Sarah N.", emoji: "⚽", duration: "1:12" },
  { id: "3", title: "PUBG 1v3 Clutch!", game: "PUBG Mobile", likes: 198, views: 650, user: "David O.", emoji: "🪖", duration: "0:38" },
  { id: "4", title: "Chess Checkmate in 4 Moves", game: "Chess", likes: 156, views: 430, user: "Grace A.", emoji: "♟️", duration: "0:22" },
  { id: "5", title: "Clash Royale 3-Crown Rush", game: "Clash Royale", likes: 134, views: 390, user: "Peter W.", emoji: "👑", duration: "0:55" },
  { id: "6", title: "CODMW Killstreak Nuke!", game: "COD Mobile", likes: 421, views: 1500, user: "Emmanuel S.", emoji: "🔫", duration: "1:30" },
  { id: "7", title: "FC 25 Bicycle Kick!", game: "FC Mobile", likes: 367, views: 1100, user: "Hannah N.", emoji: "⚽", duration: "0:28" },
  { id: "8", title: "Ludo 6-6-6 Triple Win", game: "Ludo", likes: 89, views: 210, user: "Amina N.", emoji: "🎲", duration: "0:15" },
];

export default function ClipsPage() {
  return (
    <>
      <Navbar />
      <section className="pt-28 pb-16">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <Link href="/gaming" className="text-sm text-emerald-400 hover:text-emerald-300 mb-4 inline-block">← Back to Gaming Society</Link>
          <div className="flex items-start sm:items-center justify-between flex-col sm:flex-row gap-4 mb-10">
            <div>
              <span className="badge badge-gaming mb-3">🎬 Game Clips</span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
                Epic <span className="gradient-gaming-text">Moments</span>
              </h1>
              <p className="mt-2 text-slate-400">Best clips from FC, CODMW, PUBG and more</p>
            </div>
            <button className="btn-primary !bg-gradient-to-r !from-emerald-600 !to-cyan-500 !text-sm">
              <span>+ Upload Clip</span>
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CLIPS.map((c, i) => (
              <div key={c.id} className="reveal glass-card overflow-hidden p-0 group" data-delay={String(i * 80)}>
                {/* Thumbnail placeholder */}
                <div className="relative h-40 bg-gradient-to-br from-emerald-900/40 to-slate-900/60 flex items-center justify-center">
                  <span className="text-6xl opacity-60 group-hover:scale-110 transition-transform">{c.emoji}</span>
                  {/* Play overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="white"><polygon points="5,3 19,12 5,21"/></svg>
                    </div>
                  </div>
                  <span className="absolute bottom-2 right-2 rounded-md bg-black/60 px-2 py-0.5 text-xs text-white">{c.duration}</span>
                </div>
                <div className="p-5">
                  <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">{c.title}</h3>
                  <div className="mt-1 text-xs text-slate-400">{c.game} • by {c.user}</div>
                  <div className="mt-3 flex items-center gap-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1">❤️ {c.likes}</span>
                    <span className="flex items-center gap-1">👁 {c.views}</span>
                  </div>
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
