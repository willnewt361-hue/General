"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

const CATEGORIES = ["creative", "tech", "opinion", "academics", "jazz", "general"] as const;
const TAGS_SUGGESTED = ["UNEB", "Cambridge", "Uganda", "SchoolLife", "Gaming", "Leadership", "Creative", "Tech"];

export default function BlogCreatePage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<string>("general");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]);
  };

  const handleSubmit = async () => {
    setError("");
    if (!title.trim() || !content.trim()) {
      setError("Title and content are required.");
      return;
    }
    if (title.trim().length < 5) {
      setError("Title must be at least 5 characters.");
      return;
    }
    try {
      const res = await fetch("/api/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, category, tags: selectedTags, excerpt: content.slice(0, 150) }),
      });
      if (!res.ok) throw new Error("Failed to publish post");
      setSubmitted(true);
    } catch {
      setError("Failed to publish. Please try again.");
    }
  };

  if (submitted) {
    return (
      <>
        <Navbar />
        <section className="pt-28 pb-16 min-h-screen flex items-center justify-center">
          <div className="glass-card p-10 text-center max-w-md">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-white">Post Published!</h2>
            <p className="mt-2 text-slate-400">Your creative piece is now live for all students to see.</p>
            <Link href="/blog" className="mt-6 btn-primary inline-block">
              <span>View Blog →</span>
            </Link>
          </div>
        </section>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <section className="pt-28 pb-16">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <Link href="/blog" className="text-sm text-orange-400 hover:text-orange-300 mb-4 inline-block">← Back to Blog Spot</Link>
          <div className="text-center mb-10">
            <span className="badge badge-blog mb-3">✍️ New Post</span>
            <h1 className="text-3xl font-extrabold text-white">Write Something <span className="gradient-blog-text">Amazing</span></h1>
          </div>

          <div className="glass-card p-6 sm:p-8">
            {error && (
              <div className="mb-4 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-300">
                ⚠️ {error}
              </div>
            )}

            {/* Title */}
            <div className="mb-5">
              <label className="block text-sm font-semibold text-slate-300 mb-2">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Give your post a catchy title..."
                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder:text-slate-500 focus:border-orange-500/50 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all"
              />
            </div>

            {/* Content */}
            <div className="mb-5">
              <label className="block text-sm font-semibold text-slate-300 mb-2">Content</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Express yourself... Share your thoughts, stories, poems, ideas..."
                rows={8}
                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder:text-slate-500 focus:border-orange-500/50 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all resize-y"
              />
              <div className="text-right text-xs text-slate-500 mt-1">{content.length} characters</div>
            </div>

            {/* Category */}
            <div className="mb-5">
              <label className="block text-sm font-semibold text-slate-300 mb-2">Category</label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCategory(c)}
                    className={`rounded-xl px-4 py-2 text-sm font-medium transition-all capitalize ${category === c ? "gradient-blog text-white shadow-lg" : "bg-white/5 text-slate-300 hover:bg-white/10"}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-300 mb-2">Tags</label>
              <div className="flex flex-wrap gap-2">
                {TAGS_SUGGESTED.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${selectedTags.includes(tag) ? "bg-orange-500/20 text-orange-300 border border-orange-500/30" : "bg-white/5 text-slate-400 hover:bg-white/10"}`}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit */}
            <button onClick={handleSubmit} className="btn-primary w-full !bg-gradient-to-r !from-orange-600 !to-amber-500 text-base">
              <span>🚀 Publish Post</span>
            </button>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
