"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

const ANNOUNCEMENTS = [
  { id: "1", title: "End of Term Exams Schedule Released", content: "All UNEB and Cambridge exam schedules are now available. Check the downloads section for your curriculum.", section: "general", priority: "urgent", time: "2 hours ago", author: "Head Teacher", pinned: true },
  { id: "2", title: "Inter-School Sports Day — Register Now!", content: "Registration for the annual inter-school sports day is open. See your sports captain for details.", section: "general", priority: "high", time: "5 hours ago", author: "Sports Captain", pinned: true },
  { id: "3", title: "Council Meeting: Budget Review", content: "Monthly budget review meeting this Friday at 3pm in the council room. All council members must attend.", section: "council", priority: "normal", time: "1 day ago", author: "Council Chair", pinned: false },
  { id: "4", title: "Prefect Duty Roster for Week 12", content: "The new duty roster has been published. Check your assigned duties and report any conflicts to the Head Prefect.", section: "prefect", priority: "normal", time: "1 day ago", author: "Head Prefect", pinned: false },
  { id: "5", title: "School Trip to Source of the Nile", content: "Senior students (S4-S6) can sign up for the educational trip to Jinja. Limited to 40 students.", section: "general", priority: "high", time: "2 days ago", author: "Trip Coordinator", pinned: false },
  { id: "6", title: "New Library Hours Effective Monday", content: "Library will now open at 7am and close at 8pm on weekdays. Saturday hours remain 9am-5pm.", section: "general", priority: "normal", time: "3 days ago", author: "Head Prefect", pinned: false },
];

export default function AnnouncementsPage() {
  const [section, setSection] = useState<"all" | "general" | "council" | "prefect">("all");
  const filtered = section === "all" ? ANNOUNCEMENTS : ANNOUNCEMENTS.filter((a) => a.section === section);

  return (
    <>
      <Navbar />
      <section className="pt-28 pb-16">
        <div className="mx-auto max-w-4xl px-5 sm:px-8">
          <Link href="/leaders" className="text-sm text-blue-400 hover:text-blue-300 mb-4 inline-block">← Back to Student Leader</Link>
          <div className="flex items-start sm:items-center justify-between flex-col sm:flex-row gap-4 mb-8">
            <div>
              <span className="badge badge-leader mb-3">📢 Announcements</span>
              <h1 className="text-3xl font-extrabold text-white">Stay <span className="gradient-leader-text">Informed</span></h1>
            </div>
            <button className="btn-primary !bg-gradient-to-r !from-blue-600 !to-indigo-500 !text-sm">
              <span>+ New Announcement</span>
            </button>
          </div>

          {/* Section filter */}
          <div className="flex flex-wrap gap-2 mb-8">
            {(["all", "general", "council", "prefect"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSection(s)}
                className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all capitalize ${section === s ? "gradient-leader text-white shadow-lg" : "bg-white/5 text-slate-300 hover:bg-white/10"}`}
              >
                {s === "all" ? "📋 All" : s === "general" ? "🏫 General" : s === "council" ? "🏛️ Council" : "👑 Prefect"}
              </button>
            ))}
          </div>

          {/* Pinned first */}
          <div className="space-y-4">
            {filtered.filter(a => a.pinned).map((a) => (
              <div key={a.id} className="glass-card p-6 ring-1 ring-amber-500/20">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-amber-400">📌 Pinned</span>
                    <span className={`h-2 w-2 rounded-full ${a.priority === "urgent" ? "bg-red-400 animate-pulse" : "bg-amber-400"}`} />
                    <span className={`badge ${a.priority === "urgent" ? "badge-blog" : "badge-brand"} text-[10px]`}>{a.priority}</span>
                  </div>
                  <span className={`badge ${a.section === "general" ? "badge-brand" : a.section === "council" ? "badge-leader" : "badge-blog"} text-[10px]`}>{a.section}</span>
                </div>
                <h3 className="text-lg font-bold text-white">{a.title}</h3>
                <p className="mt-2 text-sm text-slate-400">{a.content}</p>
                <div className="mt-3 text-xs text-slate-500">{a.author} • {a.time}</div>
              </div>
            ))}

            {filtered.filter(a => !a.pinned).map((a, i) => (
              <div key={a.id} className="reveal glass-card p-6" data-delay={String(i * 80)}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${a.priority === "urgent" ? "bg-red-400 animate-pulse" : a.priority === "high" ? "bg-amber-400" : "bg-blue-400"}`} />
                    <span className={`badge ${a.priority === "urgent" ? "badge-blog" : a.priority === "high" ? "badge-brand" : "badge-leader"} text-[10px]`}>{a.priority}</span>
                  </div>
                  <span className={`badge ${a.section === "general" ? "badge-brand" : a.section === "council" ? "badge-leader" : "badge-blog"} text-[10px]`}>{a.section}</span>
                </div>
                <h3 className="text-base font-bold text-white">{a.title}</h3>
                <p className="mt-2 text-sm text-slate-400">{a.content}</p>
                <div className="mt-3 text-xs text-slate-500">{a.author} • {a.time}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
