"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

const POSTS = [
  { id: "1", title: "Why Chess Should Be a UNEB Subject", excerpt: "As a chess enthusiast, I believe strategic thinking should be part of our curriculum. Here's my argument...", author: "Grace Atim", school: "Maryhill", curriculum: "UNEB", category: "opinion", likes: 87, comments: 23, time: "2h ago", emoji: "♟️" },
  { id: "2", title: "My First Hackathon Experience", excerpt: "Last weekend, our school participated in the National Hackathon. It was wild — here's what happened...", author: "Joshua Mutyaba", school: "SMACK", curriculum: "Cambridge", category: "tech", likes: 134, comments: 45, time: "5h ago", emoji: "💻" },
  { id: "3", title: "A Poem for Kampala", excerpt: "City of seven hills, where dreams are born on boda bodas and matatus hum like angry bees...", author: "Amina Nalubega", school: "Gayaza HS", curriculum: "UNEB", category: "creative", likes: 201, comments: 56, time: "1d ago", emoji: "✨" },
  { id: "4", title: "How I Scored 20/20 in Math PAPER 2", excerpt: "It wasn't talent. It was 3 months of focused practice. Here's the exact strategy I used for UNEB...", author: "Peter Wasswa", school: "Kisubi", curriculum: "UNEB", category: "academics", likes: 312, comments: 89, time: "2d ago", emoji: "📊" },
  { id: "5", title: "The State of School WiFi in Uganda", excerpt: "I surveyed 15 schools and the results are surprising. Only 3 have reliable internet...", author: "David Ochieng", school: "SMACK", curriculum: "Cambridge", category: "tech", likes: 156, comments: 67, time: "3d ago", emoji: "📡" },
  { id: "6", title: "Jazz, Afrobeats & Me", excerpt: "Music is the universal language. In this post, I explore how jazz and Afrobeats shaped my school experience...", author: "Patricia Aine", school: "Nabisunsa", curriculum: "UNEB", category: "jazz", likes: 98, comments: 31, time: "4d ago", emoji: "🎵" },
];

const CATEGORIES = [
  { key: "all", label: "🔥 All", color: "" },
  { key: "creative", label: "✨ Creative", color: "badge-blog" },
  { key: "tech", label: "💻 Tech", color: "badge-brand" },
  { key: "opinion", label: "💬 Opinion", color: "badge-leader" },
  { key: "academics", label: "📚 Academics", color: "badge-gaming" },
  { key: "jazz", label: "🎵 Jazz", color: "badge-blog" },
];

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const filtered = activeCategory === "all" ? POSTS : POSTS.filter((p) => p.category === activeCategory);

  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-[60vh] overflow-hidden pt-28 pb-10">
        <div className="pointer-events-none absolute top-10 left-10 h-72 w-72 rounded-full bg-orange-500/15 blur-[100px]" />
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="badge badge-blog mb-4 animate-fade-down">✍️ Blog Spot</span>
            <h1 className="mt-4 text-[clamp(2.2rem,6vw,4rem)] font-extrabold leading-tight tracking-tight text-white animate-fade-up">
              Express. <span className="gradient-blog-text">Create.</span> Inspire.
            </h1>
            <p className="mt-5 text-lg text-slate-400 animate-fade-up delay-200">
              Poetry, tech, opinions, jazz — your imagination has no limits. Share your voice with students across Uganda.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4 animate-fade-up delay-300">
              <Link href="/blog/create" className="btn-primary !bg-gradient-to-r !from-orange-600 !to-amber-500 text-base">
                <span>✍️ Write a Post</span>
              </Link>
              <Link href="/blog" className="btn-secondary text-base">
                Browse Posts
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Category filter */}
      <section className="py-6">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {CATEGORIES.map((c) => (
              <button
                key={c.key}
                onClick={() => setActiveCategory(c.key)}
                className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all ${activeCategory === c.key ? "gradient-blog text-white shadow-lg" : "bg-white/5 text-slate-300 hover:bg-white/10"}`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Posts grid */}
      <section className="py-10 pb-16">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p, i) => (
              <Link key={p.id} href={`/blog/post/${p.id}`} className="reveal glass-card group overflow-hidden p-0" data-delay={String(i * 80)}>
                {/* Cover gradient */}
                <div className="h-32 gradient-blog opacity-20 relative">
                  <span className="absolute inset-0 flex items-center justify-center text-5xl opacity-40 group-hover:scale-110 transition-transform">{p.emoji}</span>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`badge ${p.curriculum === "UNEB" ? "badge-brand" : "badge-leader"} text-[10px]`}>{p.curriculum}</span>
                    <span className="badge badge-blog text-[10px]">{p.category}</span>
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-orange-300 transition-colors line-clamp-2">{p.title}</h3>
                  <p className="mt-2 text-sm text-slate-400 line-clamp-2">{p.excerpt}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-orange-500/20 text-[10px] font-bold text-orange-300">
                        {p.author.split(" ").map(w => w[0]).join("")}
                      </div>
                      <div>
                        <div className="text-xs font-medium text-slate-300">{p.author}</div>
                        <div className="text-[10px] text-slate-500">{p.school} • {p.time}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span>❤️ {p.likes}</span>
                      <span>💬 {p.comments}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
