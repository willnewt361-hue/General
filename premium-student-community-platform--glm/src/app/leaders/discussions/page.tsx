"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

const DISCUSSIONS = [
  { id: "1", title: "Should we have a school talent show?", content: "I think a talent show would be a great way to end the term. Music, drama, poetry — let's discuss!", section: "general", category: "events", replies: 34, views: 156, time: "3h ago", author: "Amina N." },
  { id: "2", title: "Proposed changes to the dress code", content: "The council is considering updating the dress code policy. We want your input before the next meeting.", section: "council", category: "welfare", replies: 56, views: 230, time: "6h ago", author: "Joshua M." },
  { id: "3", title: "Library hours extension request", content: "Many students have asked for extended library hours. Prefects, can we make this happen?", section: "prefect", category: "academics", replies: 23, views: 89, time: "1d ago", author: "Grace A." },
  { id: "4", title: "Best study strategies for UNEB P2?", content: "Share your top tips for Paper 2 across subjects. Let's help each other ace these exams!", section: "general", category: "academics", replies: 45, views: 312, time: "2d ago", author: "Peter W." },
  { id: "5", title: "Weekend activities proposal", content: "What activities should we organize for weekends? Sports, movies, debates? Drop your ideas below.", section: "general", category: "events", replies: 28, views: 145, time: "3d ago", author: "Ivan M." },
  { id: "6", title: "Anti-bullying campaign ideas", content: "We need a fresh approach to bullying awareness. Creative ideas welcome from all sections.", section: "prefect", category: "welfare", replies: 19, views: 78, time: "4d ago", author: "Hannah N." },
];

export default function DiscussionsPage() {
  const [section, setSection] = useState<"all" | "general" | "council" | "prefect">("all");
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [error, setError] = useState("");

  const filtered = section === "all" ? DISCUSSIONS : DISCUSSIONS.filter((d) => d.section === section);

  const handleCreate = async () => {
    setError("");
    if (!newTitle.trim() || !newContent.trim()) {
      setError("Title and content are required.");
      return;
    }
    try {
      const res = await fetch("/api/discussions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle, content: newContent, section: "general", category: "general" }),
      });
      if (!res.ok) throw new Error("Failed");
      setShowNew(false);
      setNewTitle("");
      setNewContent("");
    } catch {
      setError("Failed to create discussion. Try again.");
    }
  };

  return (
    <>
      <Navbar />
      <section className="pt-28 pb-16">
        <div className="mx-auto max-w-4xl px-5 sm:px-8">
          <Link href="/leaders" className="text-sm text-blue-400 hover:text-blue-300 mb-4 inline-block">← Back to Student Leader</Link>
          <div className="flex items-start sm:items-center justify-between flex-col sm:flex-row gap-4 mb-8">
            <div>
              <span className="badge badge-leader mb-3">💬 Discussions</span>
              <h1 className="text-3xl font-extrabold text-white">Let&apos;s <span className="gradient-leader-text">Talk</span></h1>
            </div>
            <button onClick={() => setShowNew(!showNew)} className="btn-primary !bg-gradient-to-r !from-blue-600 !to-indigo-500 !text-sm">
              <span>+ New Discussion</span>
            </button>
          </div>

          {/* New discussion form */}
          {showNew && (
            <div className="glass-card p-6 mb-8 animate-fade-down">
              <h3 className="text-lg font-bold text-white mb-4">Start a New Discussion</h3>
              {error && <div className="mb-4 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-300">⚠️ {error}</div>}
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Discussion title..."
                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder:text-slate-500 focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-sm mb-3"
              />
              <textarea
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="What's on your mind?"
                rows={4}
                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder:text-slate-500 focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all resize-y text-sm"
              />
              <div className="mt-4 flex gap-3">
                <button onClick={handleCreate} className="btn-primary !bg-gradient-to-r !from-blue-600 !to-indigo-500 !text-sm !py-2 !px-5">
                  <span>Post Discussion</span>
                </button>
                <button onClick={() => setShowNew(false)} className="btn-secondary !text-sm !py-2 !px-5">Cancel</button>
              </div>
            </div>
          )}

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

          {/* Discussions list */}
          <div className="space-y-4">
            {filtered.map((d, i) => (
              <div key={d.id} className="reveal glass-card p-6 group" data-delay={String(i * 80)}>
                <div className="flex items-center gap-2 mb-3">
                  <span className={`badge ${d.section === "general" ? "badge-brand" : d.section === "council" ? "badge-leader" : "badge-blog"} text-[10px]`}>{d.section}</span>
                  <span className="badge badge-gaming text-[10px]">{d.category}</span>
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-blue-300 transition-colors">{d.title}</h3>
                <p className="mt-2 text-sm text-slate-400 line-clamp-2">{d.content}</p>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span>by {d.author}</span>
                    <span>• {d.time}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span>💬 {d.replies}</span>
                    <span>👁 {d.views}</span>
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
