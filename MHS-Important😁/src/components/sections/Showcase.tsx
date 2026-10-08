import { AnimatePresence, motion } from "framer-motion";
import { Check, GraduationCap, Landmark, Presentation } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "../../utils/cn";
import { Container, LinkButton, Section, SectionHeading } from "../ui/Primitives";
import { Reveal } from "../ui/Reveal";
import type { Route } from "../../router";

const tabs: {
  id: string;
  label: string;
  icon: typeof GraduationCap;
  title: string;
  desc: string;
  bullets: string[];
  to: Route;
  image: string;
  stat: { k: string; v: string };
}[] = [
  {
    id: "learners",
    label: "For Learners",
    icon: GraduationCap,
    title: "Your personal path to a Division 1.",
    desc: "Adaptive study plans, AI explanations in seconds, and mock exams marked exactly the way UNEB marks — so nothing on exam day is a surprise.",
    bullets: ["Personalised daily revision planner", "38,000+ past-paper questions with worked solutions", "Streaks, leaderboards & house competitions", "Works offline on any Android phone"],
    to: "learners",
    image: "images/students.jpg",
    stat: { k: "Avg. grade lift", v: "+1.4 grades" },
  },
  {
    id: "teachers",
    label: "For Teachers",
    icon: Presentation,
    title: "Teach more. Mark less.",
    desc: "Set assignments in minutes, let MHS auto-mark objective papers, and see instantly which topics your class hasn't grasped — before the end-of-term shock.",
    bullets: ["Auto-marking with UNEB grading scales", "Topic mastery heatmaps per class & stream", "Lesson-plan library aligned to NCDC", "One-click report cards & parent SMS"],
    to: "teachers",
    image: "images/teacher.jpg",
    stat: { k: "Marking time saved", v: "9 hrs / week" },
  },
  {
    id: "uneb",
    label: "For UNEB & Exams",
    icon: Landmark,
    title: "Assessment integrity, at national scale.",
    desc: "Secure exam delivery, item banks with psychometric analysis, and verifiable digital certification — built for continuous assessment under the new lower-secondary curriculum.",
    bullets: ["Encrypted exam sessions with proctoring signals", "Item analysis: difficulty, discrimination, reliability", "Continuous assessment (CA) score pipelines", "QR-verifiable certificates & transcripts"],
    to: "uneb",
    image: "images/dashboard.png",
    stat: { k: "Result verification", v: "< 2 seconds" },
  },
];

export function Showcase() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setActive((a) => (a + 1) % tabs.length), 7000);
    return () => clearInterval(t);
  }, [paused]);

  const tab = tabs[active];

  return (
    <Section id="showcase" className="overflow-hidden bg-white">
      <Container>
        <SectionHeading
          eyebrow="Product tour"
          title={
            <>
              Built for everyone in the <span className="text-gradient">classroom</span>.
            </>
          }
          description="Three experiences, one connected system. Switch roles to see how MHS adapts."
        />

        <Reveal delay={0.2} className="mt-12 flex justify-center">
          <div role="tablist" aria-label="Choose a role" className="glass inline-flex flex-wrap justify-center gap-1 rounded-full p-1.5 shadow-lg shadow-slate-900/5">
            {tabs.map((t, i) => {
              const isActive = i === active;
              return (
                <button
                  key={t.id}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`panel-${t.id}`}
                  id={`tab-${t.id}`}
                  onClick={() => {
                    setActive(i);
                    setPaused(true);
                  }}
                  className={cn(
                    "relative inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-colors sm:px-5",
                    isActive ? "text-white" : "text-slate-600 hover:text-slate-900",
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="showcase-pill"
                      className="absolute inset-0 rounded-full bg-slate-900 shadow-lg"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                  <t.icon className="relative h-4 w-4" />
                  <span className="relative">{t.label}</span>
                </button>
              );
            })}
          </div>
        </Reveal>

        <div
          className="relative mt-12 grid items-center gap-10 lg:grid-cols-2 lg:gap-16"
          onMouseEnter={() => setPaused(true)}
          role="tabpanel"
          id={`panel-${tab.id}`}
          aria-labelledby={`tab-${tab.id}`}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={tab.id + "-text"}
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 24 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="order-2 lg:order-1"
            >
              <h3 className="font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{tab.title}</h3>
              <p className="mt-4 text-lg leading-relaxed text-slate-600">{tab.desc}</p>
              <ul className="mt-7 space-y-3">
                {tab.bullets.map((b, i) => (
                  <motion.li
                    key={b}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 + i * 0.08 }}
                    className="flex items-start gap-3 text-slate-700"
                  >
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-mint-500/15 text-mint-600">
                      <Check className="h-3 w-3" strokeWidth={3} />
                    </span>
                    {b}
                  </motion.li>
                ))}
              </ul>
              <div className="mt-8">
                <LinkButton to={tab.to} variant="secondary" icon>
                  Explore {tab.label.replace("For ", "").toLowerCase()} experience
                </LinkButton>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="relative order-1 lg:order-2">
            <div aria-hidden className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-br from-brand-500/15 via-transparent to-mint-500/15 blur-2xl" />
            <AnimatePresence mode="wait">
              <motion.div
                key={tab.id + "-img"}
                initial={{ opacity: 0, scale: 0.96, rotate: 1 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-slate-200 shadow-2xl shadow-slate-900/15"
              >
                <img src={tab.image} alt={tab.label} className="h-full w-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-900/70 via-transparent to-transparent" />
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="glass-dark absolute bottom-5 left-5 rounded-2xl px-4 py-3 text-white"
                >
                  <p className="text-[11px] uppercase tracking-wider text-slate-300">{tab.stat.k}</p>
                  <p className="font-display text-xl font-bold">{tab.stat.v}</p>
                </motion.div>
              </motion.div>
            </AnimatePresence>

            {/* progress dots */}
            <div className="mt-5 flex justify-center gap-2" aria-hidden>
              {tabs.map((t, i) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setActive(i);
                    setPaused(true);
                  }}
                  className="relative h-1.5 w-10 overflow-hidden rounded-full bg-slate-200"
                  tabIndex={-1}
                >
                  {i === active && (
                    <motion.span
                      key={paused ? "p" : "r"}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: paused ? 0.3 : 7, ease: "linear" }}
                      className="absolute inset-0 origin-left rounded-full bg-gradient-to-r from-brand-500 to-mint-500"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
