import { motion } from "framer-motion";
import { Check } from "lucide-react";
import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "../../utils/cn";
import { Container, Section, SectionHeading } from "./Primitives";
import { Item, Reveal, Stagger, scaleIn } from "./Reveal";

/** Alternating image/text feature rows */
export function FeatureRow({
  eyebrow,
  title,
  description,
  bullets,
  visual,
  reverse,
  id,
}: {
  eyebrow: string;
  title: ReactNode;
  description: ReactNode;
  bullets: string[];
  visual: ReactNode;
  reverse?: boolean;
  id?: string;
}) {
  return (
    <div id={id} className="scroll-mt-24 grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
      <Reveal className={cn(reverse && "lg:order-2")}>
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">{eyebrow}</span>
        <h3 className="mt-3 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{title}</h3>
        <p className="mt-4 text-lg leading-relaxed text-slate-600">{description}</p>
        <ul className="mt-7 grid gap-3 sm:grid-cols-2">
          {bullets.map((b) => (
            <li key={b} className="flex items-start gap-2.5 text-[15px] text-slate-700">
              <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-mint-500/15 text-mint-600">
                <Check className="h-3 w-3" strokeWidth={3} />
              </span>
              {b}
            </li>
          ))}
        </ul>
      </Reveal>
      <Reveal variants={scaleIn} className={cn("relative", reverse && "lg:order-1")}>
        <div aria-hidden className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-brand-500/10 via-transparent to-mint-500/10 blur-2xl" />
        <div className="relative">{visual}</div>
      </Reveal>
    </div>
  );
}

/** Simple icon card grid */
export function IconGrid({
  eyebrow,
  title,
  description,
  items,
  cols = 3,
  className,
  id,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  items: { icon: LucideIcon; title: string; desc: string }[];
  cols?: 2 | 3 | 4;
  className?: string;
  id?: string;
}) {
  return (
    <Section id={id} className={cn("bg-white", className)}>
      <Container>
        <SectionHeading eyebrow={eyebrow} title={title} description={description} />
        <Stagger className={cn("mt-14 grid gap-5 sm:grid-cols-2", cols === 3 && "lg:grid-cols-3", cols === 4 && "lg:grid-cols-4")} delay={0.07}>
          {items.map((it) => (
            <Item key={it.title} variants={scaleIn}>
              <motion.div
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300, damping: 24 }}
                className="group h-full rounded-3xl border border-slate-200/80 bg-white p-7 shadow-sm transition-shadow hover:shadow-xl hover:shadow-brand-500/10"
              >
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-brand-50 to-brand-100 text-brand-600 ring-1 ring-brand-200/60 transition group-hover:from-brand-500 group-hover:to-brand-600 group-hover:text-white">
                  <it.icon className="h-6 w-6" />
                </span>
                <h3 className="mt-5 font-display text-lg font-semibold tracking-tight text-slate-900">{it.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-slate-600">{it.desc}</p>
              </motion.div>
            </Item>
          ))}
        </Stagger>
      </Container>
    </Section>
  );
}

/** Numbered steps */
export function Steps({
  eyebrow,
  title,
  description,
  steps,
  dark,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  steps: { title: string; desc: string }[];
  dark?: boolean;
}) {
  return (
    <Section className={cn(dark ? "bg-ink-900 text-white noise" : "bg-slate-50/70")}>
      {dark && <div aria-hidden className="absolute inset-0 grid-pattern-dark [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />}
      <Container className="relative">
        <SectionHeading eyebrow={eyebrow} title={title} description={description} dark={dark} />
        <Stagger className="relative mt-16 grid gap-8 md:grid-cols-4" delay={0.12}>
          <div aria-hidden className={cn("absolute left-0 right-0 top-7 hidden h-px md:block", dark ? "bg-gradient-to-r from-transparent via-white/20 to-transparent" : "bg-gradient-to-r from-transparent via-brand-300 to-transparent")} />
          {steps.map((s, i) => (
            <Item key={s.title}>
              <div className="relative">
                <span
                  className={cn(
                    "relative z-10 grid h-14 w-14 place-items-center rounded-2xl font-display text-lg font-bold shadow-lg",
                    dark ? "bg-gradient-to-br from-brand-500 to-mint-500 text-white shadow-brand-500/30" : "bg-white text-brand-600 ring-1 ring-brand-200",
                  )}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className={cn("mt-5 font-display text-lg font-semibold tracking-tight", dark ? "text-white" : "text-slate-900")}>{s.title}</h3>
                <p className={cn("mt-2 text-[15px] leading-relaxed", dark ? "text-slate-400" : "text-slate-600")}>{s.desc}</p>
              </div>
            </Item>
          ))}
        </Stagger>
      </Container>
    </Section>
  );
}

/** Framed screenshot */
export function Frame({ src, alt, className, overlay }: { src: string; alt: string; className?: string; overlay?: ReactNode }) {
  return (
    <div className={cn("relative overflow-hidden rounded-3xl border border-slate-200 bg-ink-800 shadow-2xl shadow-slate-900/20", className)}>
      <img src={src} alt={alt} className="block h-full w-full object-cover" loading="lazy" />
      {overlay}
    </div>
  );
}
