"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

const TOURNAMENTS = [
  { id: "1", title: "COD Mobile Showdown", game: "COD Mobile", status: "live", max: 32, current: 28, prize: "USh 50,000", date: "Dec 15, 2025", emoji: "🔫" },
  { id: "2", title: "FC 25 Inter-School Cup", game: "FC Mobile", status: "upcoming", max: 16, current: 12, prize: "USh 100,000", date: "Dec 20, 2025", emoji: "⚽" },
  { id: "3", title: "Chess Championship", game: "Chess", status: "upcoming", max: 16, current: 8, prize: "USh 30,000", date: "Jan 5, 2026", emoji: "♟️" },
  { id: "4", title: "PUBG Solo Showdown", game: "PUBG Mobile", status: "completed", max: 32, current: 32, prize: "USh 50,000", date: "Dec 1, 2025", emoji: "🪖" },
  { id: "5", title: "Ludo King Tournament", game: "Ludo", status: "upcoming", max: 64, current: 20, prize: "USh 20,000", date: "Jan 10, 2026", emoji: "🎲" },
  { id: "6", title: "Clash Royale League", game: "Clash Royale", status: "completed", max: 16, current: 16, prize: "USh 40,000", date: "Nov 25, 2025", emoji: "👑" },
];

export default function TournamentsPage() {
  const [status, setStatus] = useState<"all" | "live" | "upcoming" | "completed">("all");
  const filtered = status === "all" ? TOURNAMENTS : TOURNAMENTS.filter((t) => t.status === status);

  return (
    <>
      <Navbar />
      <section className="pt-28 pb-16">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <Link href="/gaming" className="text-sm text-emerald-400 hover:text-emerald-300 mb-4 inline-block">← Back to Gaming Society</Link>
          <div className="flex items-start sm:items-center justify-between flex-col sm:flex-row gap-4 mb-10">
            <div>
              <span className="badge badge-gaming mb-3">🏆 Tournaments</span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
                Compete & <span className="gradient-gaming-text">Win</span>
              </h1>
              <p className="mt-2 text-slate-400">Join tournaments and win real prizes</p>
            </div>
            <button className="btn-primary !bg-gradient-to-r !from-emerald-600 !to-cyan-500 !text-sm">
              <span>+ Create Tournament</span>
            </button>
          </div>

          {/* Status filter */}
          <div className="flex flex-wrap gap-2 mb-8">
            {(["all", "live", "upcoming", "completed"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all capitalize ${status === s ? "gradient-gaming text-white shadow-lg" : "bg-white/5 text-slate-300 hover:bg-white/10"}`}
              >
                {s === "live" && "🔴 "}{s}
              </button>
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {filtered.map((t, i) => (
              <div key={t.id} className="reveal glass-card p-6" data-delay={String(i * 80)}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{t.emoji}</span>
                    <div>
                      <h3 className="text-lg font-bold text-white">{t.title}</h3>
                      <div className="text-sm text-slate-400">{t.game}</div>
                    </div>
                  </div>
                  <span className={`badge ${t.status === "live" ? "badge-gaming" : t.status === "upcoming" ? "badge-brand" : "badge-blog"}`}>
                    {t.status === "live" && "🔴 "}{t.status}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="mb-3">
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>{t.current} / {t.max} players</span>
                    <span>{Math.round((t.current / t.max) * 100)}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                    <div className="h-full gradient-gaming rounded-full transition-all" style={{ width: `${(t.current / t.max) * 100}%` }} />
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-slate-400">
                  <span>🎁 {t.prize}</span>
                  <span>📅 {t.date}</span>
                </div>

                {t.status !== "completed" && (
                  <button className={`mt-4 w-full ${t.status === "live" ? "btn-primary !bg-gradient-to-r !from-emerald-600 !to-cyan-500 !text-sm" : "btn-secondary !text-sm"}`}>
                    <span>{t.status === "live" ? "⚡ Watch Live" : "✋ Register"}</span>
                  </button>
                )}
                {t.status === "completed" && (
                  <button className="mt-4 w-full btn-secondary !text-sm">
                    View Results
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
