import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useRef } from "react";
import { Container } from "../ui/Primitives";
import { Reveal, Stagger, Item } from "../ui/Reveal";

const partners = [
  "Mengo Senior School",
  "UNEB Syllabus",
  "NCDC Curriculum",
  "Ministry of Education & Sports",
  "Makerere University",
  "Kyambogo University",
  "UCE · UACE",
  "Kampala Schools Network",
];

function Counter({ to, suffix = "", decimals = 0 }: { to: number; suffix?: string; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { stiffness: 60, damping: 20, mass: 1 });

  useEffect(() => {
    if (inView) mv.set(to);
  }, [inView, to, mv]);

  useEffect(() => {
    const unsub = spring.on("change", (v) => {
      if (ref.current) ref.current.textContent = v.toFixed(decimals) + suffix;
    });
    return unsub;
  }, [spring, suffix, decimals]);

  return <span ref={ref}>0{suffix}</span>;
}

const stats = [
  { to: 12.5, suffix: "k+", decimals: 1, label: "Active learners" },
  { to: 480, suffix: "+", decimals: 0, label: "Teachers onboarded" },
  { to: 38, suffix: "k+", decimals: 0, label: "Past-paper questions" },
  { to: 94, suffix: "%", decimals: 0, label: "Report better UNEB readiness" },
];

export function SocialProof() {
  return (
    <section aria-labelledby="proof-heading" className="relative border-b border-slate-100 bg-white py-14 sm:py-16">
      <Container>
        <Reveal>
          <p id="proof-heading" className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Trusted by learners & educators across Uganda · Aligned with
          </p>
        </Reveal>

        <div className="relative mt-8 mask-fade-x overflow-hidden">
          <div className="flex w-max animate-marquee gap-12 pr-12 hover:[animation-play-state:paused]">
            {[...partners, ...partners].map((p, i) => (
              <span
                key={i}
                className="flex shrink-0 items-center gap-3 font-display text-lg font-semibold tracking-tight text-slate-400 transition hover:text-slate-800 sm:text-xl"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-brand-500 to-mint-500" />
                {p}
              </span>
            ))}
          </div>
        </div>

        <Stagger className="mt-14 grid grid-cols-2 gap-6 lg:grid-cols-4" delay={0.1}>
          {stats.map((s) => (
            <Item key={s.label}>
              <motion.div
                whileHover={{ y: -4 }}
                className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-gradient-to-b from-white to-slate-50 p-6 text-center shadow-sm transition-shadow hover:shadow-lg hover:shadow-brand-500/10"
              >
                <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-400/60 to-transparent opacity-0 transition group-hover:opacity-100" />
                <p className="font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                  <Counter to={s.to} suffix={s.suffix} decimals={s.decimals} />
                </p>
                <p className="mt-1.5 text-sm text-slate-500">{s.label}</p>
              </motion.div>
            </Item>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}
