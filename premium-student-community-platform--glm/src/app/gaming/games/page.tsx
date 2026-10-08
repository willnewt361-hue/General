"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

const ALL_GAMES = [
  { name: "Call of Duty: Mobile", genre: "FPS", type: "online", emoji: "🔫", players: 120, rating: 4.8 },
  { name: "FIFA / FC Mobile", genre: "Sports", type: "online", emoji: "⚽", players: 95, rating: 4.7 },
  { name: "PUBG Mobile", genre: "Battle Royale", type: "online", emoji: "🪖", players: 80, rating: 4.6 },
  { name: "Clash Royale", genre: "Strategy", type: "online", emoji: "👑", players: 60, rating: 4.5 },
  { name: "Free Fire", genre: "Battle Royale", type: "online", emoji: "🔥", players: 55, rating: 4.3 },
  { name: "Among Us", genre: "Social Deduction", type: "online", emoji: "🚀", players: 40, rating: 4.4 },
  { name: "Chess", genre: "Strategy", type: "offline", emoji: "♟️", players: 200, rating: 4.9 },
  { name: "Ludo", genre: "Board", type: "offline", emoji: "🎲", players: 180, rating: 4.5 },
  { name: "Sudoku", genre: "Puzzle", type: "offline", emoji: "🧩", players: 150, rating: 4.6 },
  { name: "Snake & Ladder", genre: "Board", type: "offline", emoji: "🐍", players: 130, rating: 4.2 },
  { name: "Scrabble", genre: "Word", type: "offline", emoji: "📝", players: 90, rating: 4.7 },
  { name: "Checkers", genre: "Strategy", type: "offline", emoji: "⬛", players: 75, rating: 4.3 },
];

export default function GamesPage() {
  const [filter, setFilter] = useState<"all" | "online" | "offline">("all");

  const filtered = filter === "all" ? ALL_GAMES : ALL_GAMES.filter((g) => g.type === filter);

  return (
    <>
      <Navbar />
      <section className="pt-28 pb-16">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <Link href="/gaming" className="text-sm text-emerald-400 hover:text-emerald-300 mb-4 inline-block">← Back to Gaming Society</Link>
          <div className="text-center mb-10">
            <span className="badge badge-gaming mb-3">🕹️ Games Catalog</span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
              Browse <span className="gradient-gaming-text">Games</span>
            </h1>
            <p className="mt-3 text-slate-400">Online multiplayer and offline classics — all in one place</p>
          </div>

          {/* Filter tabs */}
          <div className="flex justify-center gap-2 mb-10">
            {(["all", "online", "offline"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition-all ${filter === f ? "gradient-gaming text-white shadow-lg" : "bg-white/5 text-slate-300 hover:bg-white/10"}`}
              >
                {f === "all" ? "🎮 All" : f === "online" ? "🌐 Online" : "📴 Offline"}
              </button>
            ))}
          </div>

          {/* Games grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((g, i) => (
              <div key={g.name} className="glass-card p-6 group" style={{ animationDelay: `${i * 60}ms` }}>
                <div className="flex items-start justify-between">
                  <div className="text-4xl">{g.emoji}</div>
                  <span className={`badge ${g.type === "online" ? "badge-gaming" : "badge-blog"} text-[10px]`}>
                    {g.type}
                  </span>
                </div>
                <h3 className="mt-3 text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">{g.name}</h3>
                <div className="mt-2 flex items-center gap-3 text-sm text-slate-400">
                  <span>{g.genre}</span>
                  <span>•</span>
                  <span>{g.players} playing</span>
                </div>
                <div className="mt-3 flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <span key={s} className={`text-sm ${s < Math.floor(g.rating) ? "text-amber-400" : "text-slate-600"}`}>★</span>
                  ))}
                  <span className="text-xs text-slate-400 ml-1">{g.rating}</span>
                </div>
                <button className="mt-4 btn-secondary !py-2 !px-4 !text-xs !rounded-lg w-full">
                  {g.type === "online" ? "Play Now" : "Start Game"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
