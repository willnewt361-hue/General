import { db } from "@/db";
import { sql } from "drizzle-orm";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const dynamic = "force-dynamic";

/* ──────────── DATA CONSTANTS ──────────── */
const STATS = [
  { value: "2,400+", label: "Active Students", icon: "👥" },
  { value: "150+", label: "Games Available", icon: "🎮" },
  { value: "850+", label: "Blog Posts", icon: "📝" },
  { value: "45", label: "Schools Connected", icon: "🏫" },
];

const FEATURES = [
  {
    icon: "🎮",
    title: "Gaming Society",
    desc: "Compete on leaderboards, join tournaments, share epic clips from FC & CODMW, and discover games you can play online or offline.",
    href: "/gaming",
    gradient: "gradient-gaming-text",
    badge: "badge-gaming",
    tag: "Play & Compete",
  },
  {
    icon: "✍️",
    title: "Blog Spot",
    desc: "Express your imagination, share stories, spark discussions, and connect with creative minds — like WhatsApp groups but better.",
    href: "/blog",
    gradient: "gradient-blog-text",
    badge: "badge-blog",
    tag: "Create & Share",
  },
  {
    icon: "👑",
    title: "Student Leader",
    desc: "General, Council & Prefect sections. Post announcements, lead discussions, and coordinate school activities with ease.",
    href: "/leaders",
    gradient: "gradient-leader-text",
    badge: "badge-leader",
    tag: "Lead & Organize",
  },
];

const GAMES_ONLINE = [
  { name: "Call of Duty: Mobile", players: "120+", genre: "FPS", img: "🔫" },
  { name: "FIFA / FC Mobile", players: "95+", genre: "Sports", img: "⚽" },
  { name: "PUBG Mobile", players: "80+", genre: "Battle Royale", img: "🪖" },
  { name: "Clash Royale", players: "60+", genre: "Strategy", img: "👑" },
];

const GAMES_OFFLINE = [
  { name: "Chess", players: "200+", genre: "Strategy", img: "♟️" },
  { name: "Ludo", players: "180+", genre: "Board", img: "🎲" },
  { name: "Sudoku", players: "150+", genre: "Puzzle", img: "🧩" },
  { name: "Snake & Ladder", players: "130+", genre: "Board", img: "🐍" },
];

const TESTIMONIALS = [
  {
    name: "Amina Nalubega",
    school: "Gayaza High School",
    curriculum: "UNEB",
    text: "StudentHub changed how we connect. The gaming tournaments bring everyone together, and the blog lets me share my poetry with the whole school.",
    avatar: "AN",
  },
  {
    name: "Joshua Mutyaba",
    school: "St. Mary's College Kisubi",
    curriculum: "Cambridge",
    text: "As a prefect, the Student Leader section makes announcements so easy. No more WhatsApp chaos — everything is organized in one place.",
    avatar: "JM",
  },
  {
    name: "Patricia Ainembabazi",
    school: "Nabisunsa Girls School",
    curriculum: "UNEB",
    text: "I discovered so many creative writers on Blog Spot. It's like having a school magazine that everyone can contribute to in real time.",
    avatar: "PA",
  },
];

const FAQS = [
  {
    q: "Is StudentHub free for all students?",
    a: "Yes! StudentHub is completely free for all students in Uganda. Schools can optionally upgrade to premium features for advanced analytics and custom branding.",
  },
  {
    q: "Does it work for both UNEB and Cambridge students?",
    a: "Absolutely. StudentHub is designed specifically for Ugandan students following either UNEB or Cambridge curricula. You can filter content, discussions, and leaderboards by your curriculum.",
  },
  {
    q: "Can I upload game clips and highlights?",
    a: "Yes! Share your best moments from FC, CODMW, PUBG, and more. Clips are uploaded and viewed by the community — compete for the most liked clip of the week!",
  },
  {
    q: "How do Student Leader sections work?",
    a: "There are three sections: General (for all students), Council (student council members), and Prefects. Each has announcements, discussions, and polls. Access is role-based so the right people see the right content.",
  },
  {
    q: "Can my school integrate StudentHub with our existing system?",
    a: "Yes! StudentHub provides a REST API and Flask integration guides. Your school's IT team can connect it with your existing Flask or Django backend seamlessly.",
  },
  {
    q: "What games can I play on Gaming Society?",
    a: "We support both online games (COD Mobile, FC Mobile, PUBG, Clash Royale) and offline games (Chess, Ludo, Sudoku, Scrabble). Plus, schools can add their own games to the platform.",
  },
];

const PRICING = [
  {
    name: "Free",
    price: "0",
    desc: "Perfect for individual students",
    features: ["Access all 3 sections", "Join tournaments", "Post blogs & clips", "View leaderboards", "Basic discussions"],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "School",
    price: "150K",
    desc: "USh per month per school",
    features: ["Everything in Free", "Custom school branding", "Admin dashboard", "Advanced analytics", "Flask API integration", "Priority support", "Unlimited students"],
    cta: "Start Trial",
    popular: true,
  },
  {
    name: "District",
    price: "500K",
    desc: "USh per month per district",
    features: ["Everything in School", "Multi-school management", "District-wide tournaments", "Cross-school discussions", "Dedicated account manager", "Custom integrations"],
    cta: "Contact Us",
    popular: false,
  },
];

/* ──────────── PAGE ──────────── */
export default async function HomePage() {
  // Verify DB connection at build time
  try {
    await db.execute(sql`select 1`);
  } catch {
    // DB may not be ready yet — page still renders
  }

  return (
    <>
      <Navbar />

      {/* ══════════════ HERO ══════════════ */}
      <section className="gradient-hero relative min-h-screen overflow-hidden pt-28 pb-20">
        {/* Ambient orbs */}
        <div className="pointer-events-none absolute top-20 left-10 h-72 w-72 rounded-full bg-brand-600/20 blur-[100px] animate-float" />
        <div className="pointer-events-none absolute right-10 bottom-20 h-80 w-80 rounded-full bg-cyan-500/15 blur-[120px] animate-float delay-300" />
        <div className="pointer-events-none absolute top-1/2 left-1/2 h-60 w-60 -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-500/10 blur-[80px] animate-float delay-500" />

        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
          <div className="mx-auto max-w-4xl text-center">
            {/* Badge */}
            <div className="animate-fade-down inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-5 py-2 text-sm font-medium text-brand-300">
              <span className="h-2 w-2 rounded-full bg-brand-400 animate-pulse" />
              Now live across 45+ Ugandan schools
            </div>

            {/* Heading */}
            <h1 className="mt-8 text-[clamp(2.5rem,7vw,5rem)] font-extrabold leading-[1.05] tracking-tight text-white animate-fade-up text-balance">
              Game. Create.{" "}
              <span className="gradient-brand-text">Lead.</span>
            </h1>

            {/* Subheading */}
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-400 animate-fade-up delay-200 text-balance">
              The all-in-one platform built for Ugandan students — whether you&apos;re UNEB or Cambridge.
              Compete in games, express your creativity, and lead your school community.
            </p>

            {/* CTAs */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4 animate-fade-up delay-300">
              <a href="/gaming" className="btn-primary text-base">
                <span>Explore Gaming Society →</span>
              </a>
              <a href="/blog" className="btn-secondary text-base">
                Start Blogging
              </a>
            </div>

            {/* Curriculum tags */}
            <div className="mt-8 flex items-center justify-center gap-3 animate-fade-in delay-500">
              <span className="badge badge-brand">UNEB</span>
              <span className="text-xs text-slate-500">•</span>
              <span className="badge badge-leader">Cambridge</span>
              <span className="text-xs text-slate-500">•</span>
              <span className="badge badge-gaming">All Curricula</span>
            </div>
          </div>

          {/* Hero visual — Three floating cards */}
          <div className="mx-auto mt-20 grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-3 animate-fade-up delay-400">
            {FEATURES.map((f, i) => (
              <a
                key={f.href}
                href={f.href}
                className={`glass-card group relative p-7 text-center ${i === 1 ? "sm:-mt-4" : ""}`}
              >
                <span className={`badge ${f.badge} mb-4`}>{f.tag}</span>
                <div className="text-5xl mb-4 transition-transform group-hover:scale-110">{f.icon}</div>
                <h3 className={`text-xl font-bold ${f.gradient}`}>{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{f.desc}</p>
                <div className="mt-4 text-sm font-medium text-slate-300 group-hover:text-white transition-colors">
                  Explore →
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ SOCIAL PROOF / STATS ══════════════ */}
      <section className="relative py-20">
        <div className="section-divider mb-16" />
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {STATS.map((s, i) => (
              <div key={s.label} className={`reveal text-center`} data-delay={String(i * 100)}>
                <div className="text-3xl mb-2">{s.icon}</div>
                <div className="text-3xl font-extrabold text-white sm:text-4xl">{s.value}</div>
                <div className="mt-1 text-sm font-medium text-slate-400">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ FEATURES DEEP DIVE ══════════════ */}
      <section className="relative py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="reveal text-center">
            <span className="badge badge-brand mb-4">Why StudentHub?</span>
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Three worlds. <span className="gradient-brand-text">One platform.</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-400">
              Each section is independent yet connected. Jump between gaming, blogging, and leadership seamlessly.
            </p>
          </div>

          <div className="mt-16 grid gap-8 lg:grid-cols-3">
            {FEATURES.map((f, i) => (
              <a
                key={f.href}
                href={f.href}
                className={`reveal glass-card group overflow-hidden p-0`}
                data-delay={String(i * 150)}
              >
                {/* Gradient header bar */}
                <div className={`h-1.5 w-full ${f.href === "/gaming" ? "gradient-gaming" : f.href === "/blog" ? "gradient-blog" : "gradient-leader"}`} />
                <div className="p-7">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-4xl">{f.icon}</span>
                    <div>
                      <span className={`badge ${f.badge}`}>{f.tag}</span>
                    </div>
                  </div>
                  <h3 className={`text-2xl font-bold ${f.gradient}`}>{f.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-400">{f.desc}</p>
                  <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-slate-300 group-hover:text-white transition-colors">
                    Visit Section
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ PRODUCT SHOWCASE — GAMES ══════════════ */}
      <section className="relative py-24 overflow-hidden">
        <div className="pointer-events-none absolute top-0 right-0 h-96 w-96 rounded-full bg-gaming-500/10 blur-[120px]" />
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="reveal text-center">
            <span className="badge badge-gaming mb-4">Gaming Society</span>
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Play <span className="gradient-gaming-text">online</span> or <span className="gradient-gaming-text">offline</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-slate-400">
              From FPS shooters to classic board games — there&apos;s something for every student.
            </p>
          </div>

          <div className="mt-14 grid gap-8 lg:grid-cols-2">
            {/* Online games */}
            <div className="reveal glass-card p-6" data-delay="100">
              <h3 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-green-400 animate-pulse" />
                Online Games
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {GAMES_ONLINE.map((g) => (
                  <div key={g.name} className="rounded-xl bg-white/5 p-4 transition-all hover:bg-white/8 border border-white/5">
                    <div className="text-2xl mb-2">{g.img}</div>
                    <div className="text-sm font-semibold text-white">{g.name}</div>
                    <div className="mt-1 flex items-center gap-2 text-xs text-slate-400">
                      <span>{g.genre}</span>
                      <span>•</span>
                      <span>{g.players} playing</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Offline games */}
            <div className="reveal glass-card p-6" data-delay="200">
              <h3 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                Offline Games
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {GAMES_OFFLINE.map((g) => (
                  <div key={g.name} className="rounded-xl bg-white/5 p-4 transition-all hover:bg-white/8 border border-white/5">
                    <div className="text-2xl mb-2">{g.img}</div>
                    <div className="text-sm font-semibold text-white">{g.name}</div>
                    <div className="mt-1 flex items-center gap-2 text-xs text-slate-400">
                      <span>{g.genre}</span>
                      <span>•</span>
                      <span>{g.players} playing</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-10 text-center reveal" data-delay="300">
            <a href="/gaming/games" className="btn-secondary inline-flex items-center gap-2">
              View All Games
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </a>
          </div>
        </div>
      </section>

      {/* ══════════════ BENEFITS ══════════════ */}
      <section className="relative py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="reveal text-center">
            <span className="badge badge-brand mb-4">Benefits</span>
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Built for <span className="gradient-brand-text">Ugandan students</span>
            </h2>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: "🏆", title: "Weekly Tournaments", desc: "Compete in weekly gaming tournaments with real prizes. Climb the leaderboard and earn your school bragging rights." },
              { icon: "🎬", title: "Clip Highlights", desc: "Upload your best FC and CODMW moments. The community votes on the clip of the week — go viral within your school." },
              { icon: "📊", title: "Live Leaderboards", desc: "Real-time rankings across all games. See where you stand against students from 45+ schools across Uganda." },
              { icon: "💡", title: "Creative Expression", desc: "Blog Spot isn't just blogging — it's poetry, stories, tech articles, opinions, and creative writing all in one place." },
              { icon: "📢", title: "Instant Announcements", desc: "Student leaders can post announcements that reach the right audience instantly. No more scattered WhatsApp messages." },
              { icon: "🔗", title: "Flask Integration", desc: "Seamlessly integrates with your school's Flask backend. REST API ready with comprehensive documentation." },
              { icon: "📱", title: "Mobile-First Design", desc: "Built mobile-first for students on the go. Works perfectly on any device — phone, tablet, or desktop." },
              { icon: "🔒", title: "Role-Based Access", desc: "Prefects, council members, and students each see content relevant to their role. Secure and organized." },
              { icon: "🌍", title: "UNEB & Cambridge", desc: "Content and discussions filtered by curriculum. Whether UNEB or Cambridge, your feed is tailored for you." },
            ].map((b, i) => (
              <div key={b.title} className="reveal glass-card p-6" data-delay={String(i * 80)}>
                <div className="text-3xl mb-3">{b.icon}</div>
                <h3 className="text-lg font-bold text-white">{b.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ TESTIMONIALS ══════════════ */}
      <section className="relative py-24">
        <div className="pointer-events-none absolute bottom-0 left-0 h-96 w-96 rounded-full bg-brand-600/10 blur-[120px]" />
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="reveal text-center">
            <span className="badge badge-brand mb-4">Testimonials</span>
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Loved by <span className="gradient-brand-text">students</span>
            </h2>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <div key={t.name} className="reveal glass-card p-7" data-delay={String(i * 150)}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full gradient-brand text-sm font-bold text-white">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">{t.name}</div>
                    <div className="text-xs text-slate-400">{t.school}</div>
                  </div>
                  <span className={`badge ${t.curriculum === "UNEB" ? "badge-brand" : "badge-leader"} ml-auto text-[10px]`}>
                    {t.curriculum}
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-slate-300 italic">&ldquo;{t.text}&rdquo;</p>
                <div className="mt-4 flex gap-1">
                  {[1,2,3,4,5].map((s) => (
                    <span key={s} className="text-amber-400 text-sm">★</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ PRICING ══════════════ */}
      <section className="relative py-24" id="pricing">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="reveal text-center">
            <span className="badge badge-brand mb-4">Pricing</span>
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Free for students. <span className="gradient-brand-text">Affordable for schools.</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-slate-400">
              No student ever pays. Schools can unlock premium features at prices that make sense for Uganda.
            </p>
          </div>

          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {PRICING.map((p, i) => (
              <div
                key={p.name}
                className={`reveal glass-card relative p-7 ${p.popular ? "ring-2 ring-brand-500/50 glow-brand" : ""}`}
                data-delay={String(i * 150)}
              >
                {p.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full gradient-brand px-4 py-1 text-xs font-bold text-white">
                    Most Popular
                  </div>
                )}
                <div className="text-lg font-bold text-white">{p.name}</div>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-white">USh {p.price}</span>
                </div>
                <div className="mt-1 text-sm text-slate-400">{p.desc}</div>
                <ul className="mt-6 space-y-3">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-slate-300">
                      <span className="mt-0.5 text-brand-400">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <button className={`mt-8 w-full ${p.popular ? "btn-primary" : "btn-secondary"}`}>
                  <span>{p.cta}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ FAQ ══════════════ */}
      <section className="relative py-24" id="faq">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <div className="reveal text-center mb-14">
            <span className="badge badge-brand mb-4">FAQ</span>
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Common <span className="gradient-brand-text">questions</span>
            </h2>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, i) => (
              <details key={i} className="reveal glass-card group p-0 overflow-hidden" data-delay={String(i * 60)}>
                <summary className="flex cursor-pointer items-center justify-between p-5 text-left text-sm font-semibold text-white transition-colors hover:text-brand-300 list-none">
                  {faq.q}
                  <svg className="h-5 w-5 shrink-0 text-slate-400 transition-transform group-open:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m6 9 6 6 6-6"/></svg>
                </summary>
                <div className="border-t border-white/5 px-5 pb-5 pt-3 text-sm leading-relaxed text-slate-400">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ FINAL CTA ══════════════ */}
      <section className="relative py-24 overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-brand-900/30 via-brand-800/20 to-transparent" />
        <div className="pointer-events-none absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-500/20 blur-[100px]" />
        <div className="relative mx-auto max-w-3xl px-5 text-center sm:px-8">
          <div className="reveal">
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
              Ready to <span className="gradient-brand-text">join?</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-slate-400">
              Join 2,400+ students already on StudentHub. Game, create, and lead — starting today.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <a href="/gaming" className="btn-primary text-base animate-pulse-glow">
                <span>Get Started Free →</span>
              </a>
              <a href="/leaders" className="btn-secondary text-base">
                I&apos;m a Student Leader
              </a>
            </div>
            <p className="mt-4 text-sm text-slate-500">No credit card. No sign-up fee. Just you and your school.</p>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
