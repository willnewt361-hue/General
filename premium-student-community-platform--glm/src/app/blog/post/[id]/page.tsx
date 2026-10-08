"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useParams } from "next/navigation";

const MOCK_POST = {
  title: "How I Scored 20/20 in Math PAPER 2",
  content: `It wasn't talent. It was 3 months of focused practice. Here's the exact strategy I used for UNEB Mathematics Paper 2 that got me a perfect score.

**Month 1: Foundation Building**
I went back to every P1-P4 topic and redid them from scratch. No shortcuts. I used the UNEB past papers from 2015-2020 as my guide, focusing on the most repeated question types.

**Month 2: Speed & Accuracy**
I set a timer for every practice session. Paper 2 gives you 2.5 hours — I trained myself to finish in 2 hours, leaving 30 minutes for review. The key is not just getting answers right, but getting them right FAST.

**Month 3: Exam Simulation**
Every Saturday morning, I did a full paper under exam conditions. No phone, no breaks, no looking at solutions until I finished. This built my exam temperament.

The result? 20/20. Not because I'm a genius, but because I treated preparation like a system. You can do it too.`,
  author: "Peter Wasswa",
  school: "St. Mary's College Kisubi",
  curriculum: "UNEB",
  category: "academics",
  likes: 312,
  comments: 89,
  time: "2 days ago",
  emoji: "📊",
  tags: ["UNEB", "Mathematics", "StudyTips"],
};

const MOCK_COMMENTS = [
  { author: "Grace Atim", content: "This is incredible! I'm definitely trying the timer method for my Chemistry prep.", time: "1d ago", likes: 23 },
  { author: "Ivan Mukasa", content: "Which past papers did you find most helpful? I'm struggling with integration.", time: "1d ago", likes: 15 },
  { author: "Amina Nalubega", content: "The exam simulation tip is gold. I always freeze under time pressure. Going to try this!", time: "20h ago", likes: 31 },
];

export default function BlogPostPage() {
  const params = useParams();
  const [newComment, setNewComment] = useState("");
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState(MOCK_COMMENTS);
  const [commentError, setCommentError] = useState("");

  const handleAddComment = () => {
    setCommentError("");
    if (!newComment.trim()) {
      setCommentError("Comment cannot be empty.");
      return;
    }
    setComments((prev) => [...prev, { author: "You", content: newComment, time: "Just now", likes: 0 }]);
    setNewComment("");
  };

  return (
    <>
      <Navbar />
      <section className="pt-28 pb-16">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <Link href="/blog" className="text-sm text-orange-400 hover:text-orange-300 mb-4 inline-block">← Back to Blog</Link>

          {/* Post */}
          <article className="glass-card p-6 sm:p-10">
            <div className="flex items-center gap-2 mb-4">
              <span className={`badge ${MOCK_POST.curriculum === "UNEB" ? "badge-brand" : "badge-leader"} text-[10px]`}>{MOCK_POST.curriculum}</span>
              <span className="badge badge-blog text-[10px]">{MOCK_POST.category}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">{MOCK_POST.title}</h1>

            <div className="mt-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full gradient-blog text-sm font-bold text-white">
                {MOCK_POST.author.split(" ").map(w => w[0]).join("")}
              </div>
              <div>
                <div className="text-sm font-semibold text-white">{MOCK_POST.author}</div>
                <div className="text-xs text-slate-400">{MOCK_POST.school} • {MOCK_POST.time}</div>
              </div>
            </div>

            {/* Tags */}
            <div className="mt-4 flex flex-wrap gap-2">
              {MOCK_POST.tags.map((tag) => (
                <span key={tag} className="rounded-lg bg-white/5 px-2.5 py-1 text-xs text-slate-400">#{tag}</span>
              ))}
            </div>

            {/* Divider */}
            <div className="section-divider my-6" />

            {/* Content */}
            <div className="prose prose-invert max-w-none text-slate-300 leading-relaxed whitespace-pre-wrap text-sm sm:text-base">
              {MOCK_POST.content}
            </div>

            {/* Actions */}
            <div className="mt-8 flex items-center gap-4">
              <button
                onClick={() => setLiked(!liked)}
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${liked ? "bg-red-500/20 text-red-300 border border-red-500/30" : "bg-white/5 text-slate-300 hover:bg-white/10"}`}
              >
                ❤️ {MOCK_POST.likes + (liked ? 1 : 0)}
              </button>
              <span className="flex items-center gap-2 rounded-xl bg-white/5 px-4 py-2.5 text-sm text-slate-400">
                💬 {MOCK_POST.comments}
              </span>
              <button className="flex items-center gap-2 rounded-xl bg-white/5 px-4 py-2.5 text-sm text-slate-300 hover:bg-white/10 transition-all">
                🔗 Share
              </button>
            </div>
          </article>

          {/* Comments */}
          <div className="mt-10">
            <h2 className="text-xl font-bold text-white mb-6">💬 Comments ({comments.length})</h2>

            {/* Add comment */}
            <div className="glass-card p-5 mb-6">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts..."
                rows={3}
                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder:text-slate-500 focus:border-orange-500/50 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all resize-y text-sm"
              />
              {commentError && <p className="text-xs text-red-400 mt-1">{commentError}</p>}
              <button onClick={handleAddComment} className="mt-3 btn-primary !bg-gradient-to-r !from-orange-600 !to-amber-500 !text-sm !py-2 !px-5">
                <span>Post Comment</span>
              </button>
            </div>

            {/* Comment list */}
            <div className="space-y-4">
              {comments.map((c, i) => (
                <div key={i} className="glass-card p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500/20 text-xs font-bold text-orange-300">
                      {c.author.split(" ").map(w => w[0]).join("")}
                    </div>
                    <span className="text-sm font-semibold text-white">{c.author}</span>
                    <span className="text-xs text-slate-500">{c.time}</span>
                  </div>
                  <p className="text-sm text-slate-300">{c.content}</p>
                  <div className="mt-2 text-xs text-slate-400">❤️ {c.likes}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
