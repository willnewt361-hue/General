import { motion } from "framer-motion";
import { Globe2, Lock, Rocket, WifiOff, Zap, HeartHandshake } from "lucide-react";
import { Container, Section, SectionHeading } from "../ui/Primitives";
import { Item, Reveal, Stagger } from "../ui/Reveal";

const benefits = [
  { icon: Rocket, title: "Higher grades, measurably", desc: "Learners who revise with MHS for 8+ weeks lift an average of 1.4 grade points across core subjects." },
  { icon: Zap, title: "Set up in a day", desc: "Import your class lists from CSV, invite teachers, and go live before the next assembly." },
  { icon: WifiOff, title: "Made for low bandwidth", desc: "Smart caching and compressed media mean MHS still works when the network doesn't." },
  { icon: Lock, title: "Privacy by design", desc: "Role-based access, encrypted records, and data hosted with Ugandan data-protection compliance in mind." },
  { icon: Globe2, title: "Open source, forever", desc: "Apache-2.0 licensed on GitHub. Inspect it, extend it, self-host it. No lock-in." },
  { icon: HeartHandshake, title: "Built with Mengo", desc: "Designed alongside Mengo SS students and staff — every feature earned its place in a real classroom." },
];

export function Benefits() {
  return (
    <Section className="relative overflow-hidden bg-ink-900 text-white noise">
      <div aria-hidden className="absolute inset-0 grid-pattern-dark [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />
      <div aria-hidden className="pointer-events-none absolute -left-40 top-1/3 h-[30rem] w-[30rem] rounded-full bg-brand-600/25 blur-[120px] animate-float-slow" />
      <div aria-hidden className="pointer-events-none absolute -right-40 bottom-0 h-[26rem] w-[26rem] rounded-full bg-mint-500/15 blur-[120px] animate-float" />

      <Container className="relative">
        <div className="grid items-start gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <SectionHeading
              dark
              align="left"
              eyebrow="Why schools choose MHS"
              title={
                <>
                  Not another app. <span className="shimmer-text animate-shimmer">A better way to run a school.</span>
                </>
              }
              description="Most school systems were designed for administrators. Mengo Hub was designed for the people who actually learn and teach — and it shows in the results."
            />
            <Reveal delay={0.25} className="mt-10">
              <div className="glass-dark relative overflow-hidden rounded-3xl p-6">
                <div aria-hidden className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gradient-to-br from-brand-500/40 to-mint-500/40 blur-2xl" />
                <p className="text-sm text-slate-300">UNEB readiness, Mengo S.4 pilot cohort</p>
                <div className="mt-4 flex items-end gap-2" aria-hidden>
                  {[38, 44, 51, 49, 58, 66, 71, 78, 84, 91].map((h, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      whileInView={{ height: `${h}%` }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.06, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                      className="w-full rounded-t-md bg-gradient-to-t from-brand-600 to-mint-400"
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
                <div className="mt-2 flex justify-between text-[11px] text-slate-400">
                  <span>Week 1</span>
                  <span>Week 10</span>
                </div>
                <p className="mt-4 font-display text-3xl font-bold">
                  38% → 91% <span className="text-base font-medium text-mint-300">readiness</span>
                </p>
              </div>
            </Reveal>
          </div>

          <Stagger className="grid gap-4 sm:grid-cols-2 lg:col-span-7" delay={0.08}>
            {benefits.map((b) => (
              <Item key={b.title}>
                <motion.div
                  whileHover={{ y: -4, backgroundColor: "rgba(255,255,255,0.07)" }}
                  className="group h-full rounded-2xl border border-white/10 bg-white/[0.04] p-6 transition-colors"
                >
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-white/10 to-white/5 text-brand-200 ring-1 ring-white/10 transition group-hover:text-mint-300 group-hover:ring-mint-400/40">
                    <b.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 font-display text-lg font-semibold tracking-tight">{b.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">{b.desc}</p>
                </motion.div>
              </Item>
            ))}
          </Stagger>
        </div>
      </Container>
    </Section>
  );
}
