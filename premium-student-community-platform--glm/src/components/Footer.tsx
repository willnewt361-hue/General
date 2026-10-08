import Link from "next/link";

const FOOTER_SECTIONS = [
  {
    title: "Gaming Society",
    links: [
      { label: "Leaderboard", href: "/gaming/leaderboard" },
      { label: "Games", href: "/gaming/games" },
      { label: "Clips", href: "/gaming/clips" },
      { label: "Tournaments", href: "/gaming/tournaments" },
    ],
  },
  {
    title: "Blog Spot",
    links: [
      { label: "Latest Posts", href: "/blog" },
      { label: "Write a Post", href: "/blog/create" },
      { label: "Creative Corner", href: "/blog?category=creative" },
      { label: "Trending", href: "/blog?sort=trending" },
    ],
  },
  {
    title: "Student Leader",
    links: [
      { label: "Announcements", href: "/leaders/announcements" },
      { label: "Council", href: "/leaders/council" },
      { label: "Prefects", href: "/leaders/prefects" },
      { label: "Discussions", href: "/leaders/discussions" },
    ],
  },
  {
    title: "Platform",
    links: [
      { label: "About Us", href: "/#about" },
      { label: "API Docs", href: "/api/health" },
      { label: "Privacy Policy", href: "/#privacy" },
      { label: "Contact", href: "/#contact" },
    ],
  },
] as const;

export default function Footer() {
  return (
    <footer className="relative mt-32 border-t border-white/5 bg-surface-2/50">
      {/* Gradient accent line */}
      <div className="h-px w-full gradient-brand opacity-40" />

      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-brand text-lg font-bold shadow-lg">
                S
              </div>
              <span className="text-lg font-bold tracking-tight text-white">
                Student<span className="gradient-brand-text">Hub</span>
              </span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-slate-400">
              The ultimate platform for Ugandan students. Game, create, and lead — all in one place.
            </p>
            <div className="mt-5 flex gap-3">
              {["𝕏", "IG", "TT"].map((s) => (
                <span
                  key={s}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-xs font-bold text-slate-400 transition-all hover:bg-white/10 hover:text-white cursor-pointer"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {FOOTER_SECTIONS.map((section) => (
            <div key={section.title}>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
                {section.title}
              </h4>
              <ul className="mt-4 space-y-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-400 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 sm:flex-row">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} StudentHub Uganda. Built for students, by students.
          </p>
          <div className="flex gap-2">
            <span className="badge badge-brand text-[10px]">UNEB</span>
            <span className="badge badge-leader text-[10px]">Cambridge</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
