"use client";

import { useState } from "react";
import Link from "next/link";

const NAV_ITEMS = [
  { label: "Gaming Society", href: "/gaming", icon: "🎮" },
  { label: "Blog Spot", href: "/blog", icon: "✍️" },
  { label: "Student Leader", href: "/leaders", icon: "👑" },
] as const;

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="glass-nav fixed top-0 right-0 left-0 z-50">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-brand text-lg font-bold shadow-lg transition-transform group-hover:scale-110">
            S
          </div>
          <span className="text-lg font-bold tracking-tight text-white">
            Student<span className="gradient-brand-text">Hub</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-slate-300 transition-all hover:bg-white/10 hover:text-white"
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden items-center gap-3 md:flex">
          <Link href="/api/health" className="text-sm font-medium text-slate-400 transition-colors hover:text-white">
            Status
          </Link>
          <button className="btn-primary !py-2.5 !px-5 !text-sm !rounded-xl">
            <span>Join Now</span>
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-300 transition-colors hover:bg-white/10 hover:text-white md:hidden"
          aria-label="Toggle menu"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {mobileOpen ? (
              <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>
            ) : (
              <><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="glass-strong animate-fade-down border-t border-white/5 px-5 pb-5 pt-3 md:hidden">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-300 transition-all hover:bg-white/10 hover:text-white"
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </Link>
          ))}
          <div className="mt-3">
            <button className="btn-primary w-full !text-sm">
              <span>Join Now</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
