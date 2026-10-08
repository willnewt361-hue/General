import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Github } from "../ui/GithubIcon";
import { useEffect, useState } from "react";
import { cn } from "../../utils/cn";
import { Link, useRouter } from "../../router";
import { Container, ExternalButton, LinkButton, Logo } from "../ui/Primitives";
import { useApp } from "../../lib/store";

const NAV: { label: string; to: string }[] = [
  { label: "Learners", to: "learners" },
  { label: "Teachers", to: "teachers" },
  { label: "UNEB", to: "uneb" },
  { label: "Features", to: "features" },
  { label: "Pricing", to: "pricing" },
  { label: "FAQ", to: "faq" },
];

export const GITHUB_URL = "https://github.com/willnewt361-hue/MHS";

export function Navbar() {
  const { segments } = useRouter();
  const route = segments[0] ?? "";
  const { user } = useApp();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.3 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => setOpen(false), [route]);

  const darkHero = route === "" || route === "uneb" || route === "about";
  const onDark = darkHero && !scrolled;

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-slate-900 focus:shadow-lg"
      >
        Skip to content
      </a>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-x-0 top-0 z-50"
      >
        <motion.div
          style={{ scaleX: progress }}
          className="absolute inset-x-0 top-0 h-[2px] origin-left bg-gradient-to-r from-brand-500 via-mint-400 to-gold-400"
          aria-hidden
        />
        <div
          className={cn(
            "transition-all duration-500",
            scrolled ? "glass shadow-[0_8px_40px_-12px_rgba(15,23,42,0.18)]" : "bg-transparent",
          )}
        >
          <Container className="flex h-[72px] items-center justify-between">
            <Link to="home" aria-label="Mengo Hub System home" className="transition-transform hover:scale-[1.02]">
              <Logo dark={onDark} />
            </Link>

            <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
              {NAV.map((n) => {
                const active = route === n.to;
                return (
                  <Link
                    key={n.to}
                    to={n.to}
                    className={cn(
                      "relative rounded-full px-4 py-2 text-sm font-medium transition-colors",
                      onDark ? "text-slate-200 hover:text-white" : "text-slate-600 hover:text-slate-900",
                      active && (onDark ? "text-white" : "text-slate-900"),
                    )}
                  >
                    {n.label}
                    {active && (
                      <motion.span
                        layoutId="nav-pill"
                        className={cn("absolute inset-0 -z-10 rounded-full", onDark ? "bg-white/10" : "bg-slate-900/[0.06]")}
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            <div className="hidden items-center gap-3 lg:flex">
              <ExternalButton href={GITHUB_URL} variant={onDark ? "outline-dark" : "ghost"} size="sm" aria-label="View on GitHub">
                <Github className="h-4 w-4" /> GitHub
              </ExternalButton>
              {user ? (
                <LinkButton to="app" size="sm" icon>
                  My Dashboard
                </LinkButton>
              ) : (
                <>
                  <Link to="login" className={cn("rounded-full px-4 py-2 text-sm font-semibold transition", onDark ? "text-white hover:bg-white/10" : "text-slate-700 hover:bg-slate-900/5")}>
                    Sign in
                  </Link>
                  <LinkButton to="signup" size="sm" icon>
                    Get Started
                  </LinkButton>
                </>
              )}
            </div>

            <button
              className={cn(
                "grid h-11 w-11 place-items-center rounded-full transition lg:hidden",
                onDark ? "text-white hover:bg-white/10" : "text-slate-900 hover:bg-slate-900/5",
              )}
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
            >
              {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </Container>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 bg-ink-900/95 backdrop-blur-xl lg:hidden"
          >
            <div className="flex h-full flex-col px-6 pb-10 pt-28">
              <nav className="flex flex-col gap-2" aria-label="Mobile">
                {NAV.map((n, i) => (
                  <motion.div
                    key={n.to}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * i + 0.1, duration: 0.4 }}
                  >
                    <Link
                      to={n.to}
                      className={cn(
                        "block rounded-2xl px-4 py-4 font-display text-2xl font-semibold text-white/80 transition hover:bg-white/5 hover:text-white",
                        route === n.to && "text-white",
                      )}
                    >
                      {n.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
                className="mt-auto flex flex-col gap-3"
              >
                <LinkButton to={user ? "app" : "signup"} size="lg" icon className="w-full">
                  {user ? "Open my dashboard" : "Get Started Free"}
                </LinkButton>
                {!user && (
                  <LinkButton to="login" variant="outline-dark" size="lg" className="w-full">
                    Sign in
                  </LinkButton>
                )}
                <ExternalButton href={GITHUB_URL} variant="outline-dark" size="lg" className="w-full">
                  <Github className="h-4 w-4" /> Star on GitHub
                </ExternalButton>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
