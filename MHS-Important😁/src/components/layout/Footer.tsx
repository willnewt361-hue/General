import { Mail, MapPin, ArrowUpRight } from "lucide-react";
import { Github } from "../ui/GithubIcon";
import { Link, type Route } from "../../router";
import { Container, Logo } from "../ui/Primitives";
import { GITHUB_URL } from "./Navbar";

const cols: { title: string; links: { label: string; to: Route; anchor?: string }[] }[] = [
  {
    title: "Product",
    links: [
      { label: "Features", to: "features" },
      { label: "Product tour", to: "home", anchor: "showcase" },
      { label: "Pricing", to: "pricing" },
      { label: "Roadmap", to: "about", anchor: "roadmap" },
    ],
  },
  {
    title: "Solutions",
    links: [
      { label: "For Learners", to: "learners" },
      { label: "For Teachers", to: "teachers" },
      { label: "For UNEB & Exams", to: "uneb" },
      { label: "For School Admins", to: "features", anchor: "admin" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "FAQ", to: "faq" },
      { label: "About MHS", to: "about" },
      { label: "Testimonials", to: "home", anchor: "testimonials" },
      { label: "Contact", to: "about", anchor: "contact" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-ink-950 text-slate-300">
      <div aria-hidden className="absolute inset-0 grid-pattern-dark opacity-40 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
      <div aria-hidden className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[60rem] -translate-x-1/2 rounded-full bg-brand-600/20 blur-3xl" />
      <Container className="relative">
        <div className="grid gap-12 py-16 sm:py-20 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <Logo dark />
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-slate-400">
              Mengo Hub System is the open, AI-powered school platform built for Mengo Senior School and secondary schools across
              Uganda — uniting learners, teachers and UNEB-aligned assessment in one place.
            </p>
            <div className="mt-6 flex flex-col gap-3 text-sm text-slate-400">
              <span className="inline-flex items-center gap-2">
                <MapPin className="h-4 w-4 text-brand-300" /> Mengo, Kampala, Uganda
              </span>
              <a href="mailto:hello@mengohub.ug" className="inline-flex items-center gap-2 transition hover:text-white">
                <Mail className="h-4 w-4 text-brand-300" /> hello@mengohub.ug
              </a>
              <a href={GITHUB_URL} target="_blank" rel="noreferrer noopener" className="inline-flex items-center gap-2 transition hover:text-white">
                <Github className="h-4 w-4 text-brand-300" /> github.com/willnewt361-hue/MHS
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-7">
            {cols.map((c) => (
              <div key={c.title}>
                <h3 className="font-display text-sm font-semibold uppercase tracking-[0.16em] text-white">{c.title}</h3>
                <ul className="mt-5 space-y-3">
                  {c.links.map((l) => (
                    <li key={l.label}>
                      <Link
                        to={l.to}
                        anchor={l.anchor}
                        className="group inline-flex items-center gap-1 text-sm text-slate-400 transition hover:text-white"
                      >
                        {l.label}
                        <ArrowUpRight className="h-3 w-3 opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-start justify-between gap-4 border-t border-white/10 py-8 text-xs text-slate-500 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} Mengo Hub System. Open source under the Apache-2.0 License.</p>
          <p className="inline-flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-mint-400 shadow-[0_0_12px_2px_rgba(52,211,153,0.6)]" />
            All systems operational · Built in Uganda 🇺🇬
          </p>
        </div>
      </Container>
    </footer>
  );
}
