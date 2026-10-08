import { AnimatePresence, motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { useState } from "react";
import { cn } from "../../utils/cn";
import { Container, LinkButton, ExternalButton, Section, SectionHeading } from "../ui/Primitives";
import { Item, Reveal, Stagger, scaleIn } from "../ui/Reveal";
import { GITHUB_URL } from "../layout/Navbar";

const plans = [
  {
    name: "Learner",
    tagline: "For every student. Free, forever.",
    monthly: 0,
    yearly: 0,
    cta: { label: "Create free account", to: "signup" as const, anchor: undefined },
    features: ["Full UNEB past-paper bank", "AI tutor (50 questions / day)", "Daily revision planner & streaks", "Offline notes on mobile", "Class chat & announcements"],
  },
  {
    name: "Learner Plus",
    tagline: "Serious about that Division 1.",
    monthly: 15000,
    yearly: 12000,
    highlight: true,
    cta: { label: "Upgrade with MoMo", to: "signup" as const, anchor: undefined },
    features: [
      "Everything in Learner",
      "Unlimited AI tutor + voice mode",
      "Exam Predictor with topic forecasts",
      "Unlimited timed mock exams, auto-marked",
      "Audio lessons & essay dictation",
      "Verified digital certificates",
      "Priority support on WhatsApp",
    ],
  },
  {
    name: "School",
    tagline: "For teachers, admins & whole schools.",
    monthly: null,
    yearly: null,
    cta: { label: "Talk to us", to: "about" as const, anchor: "contact" },
    features: [
      "Unlimited teacher & admin seats",
      "Auto-marking & analytics dashboards",
      "Report cards, SMS & email automations",
      "Fees & payments (MTN MoMo, Airtel)",
      "Continuous assessment (CA) pipelines",
      "Self-host or managed cloud",
      "Onboarding & staff training",
    ],
  },
];

const fmt = (n: number) => `UGX ${n.toLocaleString("en-UG")}`;

export function Pricing({ standalone }: { standalone?: boolean }) {
  const [yearly, setYearly] = useState(true);

  return (
    <Section id="pricing" className="bg-slate-50/70">
      <div aria-hidden className="absolute inset-0 grid-pattern [mask-image:radial-gradient(ellipse_at_bottom,black,transparent_70%)]" />
      <Container className="relative">
        <SectionHeading
          eyebrow="Pricing"
          title={
            <>
              Free for learners. <span className="text-gradient">Fair for schools.</span>
            </>
          }
          description={
            standalone
              ? "No credit cards. Pay with MTN Mobile Money or Airtel Money. Cancel any time — your data and certificates stay yours."
              : "Every student in Uganda deserves great tools. Core learning features are free — premium and school plans keep the lights on."
          }
        />

        <Reveal delay={0.2} className="mt-10 flex justify-center">
          <div className="glass inline-flex items-center gap-1 rounded-full p-1.5 shadow-lg shadow-slate-900/5" role="group" aria-label="Billing period">
            {(["monthly", "yearly"] as const).map((k) => {
              const on = (k === "yearly") === yearly;
              return (
                <button
                  key={k}
                  aria-pressed={on}
                  onClick={() => setYearly(k === "yearly")}
                  className={cn("relative rounded-full px-5 py-2 text-sm font-semibold capitalize transition-colors", on ? "text-white" : "text-slate-600")}
                >
                  {on && <motion.span layoutId="billing-pill" className="absolute inset-0 rounded-full bg-slate-900" transition={{ type: "spring", stiffness: 350, damping: 30 }} />}
                  <span className="relative">
                    {k}
                    {k === "yearly" && <span className="ml-2 rounded-full bg-mint-500/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-mint-600">Save 20%</span>}
                  </span>
                </button>
              );
            })}
          </div>
        </Reveal>

        <Stagger className="mt-12 grid gap-6 lg:grid-cols-3 lg:items-stretch" delay={0.1}>
          {plans.map((p) => {
            const price = yearly ? p.yearly : p.monthly;
            return (
              <Item key={p.name} variants={scaleIn} className={cn(p.highlight && "lg:-my-4")}>
                <motion.div
                  whileHover={{ y: -6 }}
                  transition={{ type: "spring", stiffness: 300, damping: 24 }}
                  className={cn(
                    "relative flex h-full flex-col overflow-hidden rounded-3xl p-8",
                    p.highlight
                      ? "bg-ink-900 text-white shadow-2xl shadow-brand-600/30 ring-1 ring-white/10"
                      : "border border-slate-200/80 bg-white shadow-sm",
                  )}
                >
                  {p.highlight && (
                    <>
                      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(99,102,241,0.45),transparent_55%),radial-gradient(ellipse_at_bottom_left,rgba(16,185,129,0.3),transparent_55%)]" />
                      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-300 to-transparent" />
                      <span className="absolute right-6 top-6 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-brand-500 to-mint-500 px-3 py-1 text-[11px] font-bold uppercase tracking-wider">
                        <Sparkles className="h-3 w-3" /> Most popular
                      </span>
                    </>
                  )}
                  <div className="relative">
                    <h3 className="font-display text-xl font-semibold tracking-tight">{p.name}</h3>
                    <p className={cn("mt-1 text-sm", p.highlight ? "text-slate-300" : "text-slate-500")}>{p.tagline}</p>
                    <div className="mt-6 flex items-baseline gap-2">
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={String(price)}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.25 }}
                          className="font-display text-4xl font-bold tracking-tight"
                        >
                          {price === null ? "Custom" : price === 0 ? "Free" : fmt(price)}
                        </motion.span>
                      </AnimatePresence>
                      {price ? <span className={cn("text-sm", p.highlight ? "text-slate-300" : "text-slate-500")}>/ month{yearly ? ", billed yearly" : ""}</span> : null}
                    </div>
                    <div className="mt-7">
                      <LinkButton to={p.cta.to} anchor={p.cta.anchor} variant={p.highlight ? "primary" : "ghost"} className="w-full" icon>
                        {p.cta.label}
                      </LinkButton>
                    </div>
                    <ul className="mt-8 space-y-3">
                      {p.features.map((f) => (
                        <li key={f} className={cn("flex items-start gap-3 text-sm", p.highlight ? "text-slate-200" : "text-slate-700")}>
                          <span className={cn("mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full", p.highlight ? "bg-mint-400/20 text-mint-300" : "bg-brand-500/10 text-brand-600")}>
                            <Check className="h-3 w-3" strokeWidth={3} />
                          </span>
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              </Item>
            );
          })}
        </Stagger>

        <Reveal delay={0.2} className="mt-12 text-center">
          <p className="text-sm text-slate-500">
            Prefer to run it yourself? MHS is open source.{" "}
            <ExternalButton href={GITHUB_URL} variant="ghost" size="sm" className="ml-2 align-middle">
              Self-host from GitHub
            </ExternalButton>
          </p>
        </Reveal>
      </Container>
    </Section>
  );
}
