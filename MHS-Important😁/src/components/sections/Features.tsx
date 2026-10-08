import { motion } from "framer-motion";
import {
  BarChart3,
  BookOpenCheck,
  BrainCircuit,
  FileBadge2,
  MessageSquareText,
  Mic,
  Smartphone,
  Workflow,
  Wallet,
} from "lucide-react";
import { Container, Section, SectionHeading } from "../ui/Primitives";
import { Item, Stagger, scaleIn } from "../ui/Reveal";
import { cn } from "../../utils/cn";

const features = [
  {
    icon: BrainCircuit,
    title: "AI Tutor & Exam Predictor",
    desc: "A 24/7 tutor that explains any topic in plain English (or Luganda), plus an ML model trained on decades of UNEB past papers to forecast likely questions.",
    span: "lg:col-span-2",
    accent: "from-brand-500 to-brand-700",
    visual: "predictor",
  },
  {
    icon: BookOpenCheck,
    title: "Mock Exams & Assessments",
    desc: "Timed UCE/UACE-style papers, auto-marked with UNEB grading scales and examiner-style feedback.",
    accent: "from-mint-500 to-emerald-700",
  },
  {
    icon: BarChart3,
    title: "Analytics that teach",
    desc: "Per-topic mastery heatmaps for learners, class-level insights for teachers, and cohort trends for heads of department.",
    accent: "from-gold-400 to-orange-600",
  },
  {
    icon: MessageSquareText,
    title: "Real-time class chat",
    desc: "Moderated subject rooms, teacher announcements and study groups — with websockets for instant delivery.",
    accent: "from-sky-500 to-blue-700",
  },
  {
    icon: FileBadge2,
    title: "Verified certificates",
    desc: "Tamper-proof digital certificates for courses, clubs and achievements — QR-verifiable by any school or employer.",
    accent: "from-fuchsia-500 to-purple-700",
  },
  {
    icon: Smartphone,
    title: "Mobile-first, offline-ready",
    desc: "Download notes and papers on Wi-Fi, revise anywhere, sync when you're back online. Built for real Ugandan bandwidth.",
    span: "lg:col-span-2",
    accent: "from-slate-700 to-slate-900",
    visual: "mobile",
  },
  {
    icon: Mic,
    title: "Audio lessons & dictation",
    desc: "Listen to summarised notes on the go, or dictate essays and get instant structure feedback.",
    accent: "from-rose-500 to-red-700",
  },
  {
    icon: Wallet,
    title: "Mobile Money payments",
    desc: "Fees, premium plans and club dues via MTN MoMo & Airtel Money with automatic receipts.",
    accent: "from-amber-500 to-yellow-600",
  },
  {
    icon: Workflow,
    title: "Automations (n8n)",
    desc: "Parent SMS on missed classes, weekly progress emails, report card generation — no code required.",
    accent: "from-teal-500 to-cyan-700",
  },
];

function PredictorVisual() {
  const rows = [
    { q: "Organic chemistry – esterification", p: 92 },
    { q: "Projectile motion (UACE P1)", p: 87 },
    { q: "Buganda Agreement, 1900", p: 81 },
    { q: "Quadratic inequalities", p: 74 },
  ];
  return (
    <div className="mt-6 space-y-2.5">
      {rows.map((r, i) => (
        <motion.div
          key={r.q}
          initial={{ opacity: 0, x: -12 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
          className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white/80 px-3.5 py-2.5 text-sm shadow-sm"
        >
          <span className="flex-1 truncate text-slate-700">{r.q}</span>
          <div className="h-1.5 w-24 overflow-hidden rounded-full bg-slate-100">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${r.p}%` }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 + i * 0.1, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="h-full rounded-full bg-gradient-to-r from-brand-500 to-mint-400"
            />
          </div>
          <span className="w-9 text-right font-semibold text-slate-900">{r.p}%</span>
        </motion.div>
      ))}
    </div>
  );
}

function MobileVisual() {
  return (
    <div className="mt-6 flex items-center gap-4">
      <div className="flex-1 space-y-2">
        {["Notes downloaded · 42 MB", "Mock UCE Maths P2 · ready", "Sync pending · 3 items"].map((t, i) => (
          <motion.div
            key={t}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 + i * 0.12 }}
            className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-xs text-slate-200"
          >
            <span className={cn("h-1.5 w-1.5 rounded-full", i === 2 ? "bg-gold-400 animate-pulse" : "bg-mint-400")} />
            {t}
          </motion.div>
        ))}
      </div>
      <motion.img
        src="images/mobile.png"
        alt=""
        aria-hidden
        initial={{ opacity: 0, y: 20, rotate: -4 }}
        whileInView={{ opacity: 1, y: 0, rotate: -6 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="h-36 w-auto rounded-xl object-cover shadow-2xl sm:h-44"
      />
    </div>
  );
}

export function Features({ compact }: { compact?: boolean }) {
  return (
    <Section id="features" className="bg-slate-50/70">
      <div aria-hidden className="absolute inset-0 grid-pattern [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
      <Container className="relative">
        {!compact && (
          <SectionHeading
            eyebrow="Everything in one hub"
            title={
              <>
                One platform. <span className="text-gradient">Every part</span> of school life.
              </>
            }
            description="From the first lesson of S.1 to the last UACE paper, MHS gives learners, teachers and administrators the tools they need — designed to work beautifully on a phone in Mengo or a lab in Gulu."
          />
        )}

        <Stagger className={cn("grid gap-5 sm:grid-cols-2 lg:grid-cols-3", !compact && "mt-16")} delay={0.07}>
          {features.map((f) => {
            const dark = f.visual === "mobile";
            return (
              <Item key={f.title} variants={scaleIn} className={cn(f.span)}>
                <motion.article
                  whileHover={{ y: -6 }}
                  transition={{ type: "spring", stiffness: 300, damping: 24 }}
                  className={cn(
                    "group relative flex h-full flex-col overflow-hidden rounded-3xl border p-7 transition-shadow duration-300",
                    dark
                      ? "border-white/10 bg-ink-800 text-white shadow-xl shadow-ink-900/30"
                      : "border-slate-200/80 bg-white shadow-sm hover:shadow-2xl hover:shadow-brand-500/10",
                  )}
                >
                  <div
                    aria-hidden
                    className={cn(
                      "pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-gradient-to-br opacity-0 blur-3xl transition duration-500 group-hover:opacity-30",
                      f.accent,
                    )}
                  />
                  <div
                    className={cn(
                      "relative grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br text-white shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3",
                      f.accent,
                    )}
                  >
                    <f.icon className="h-6 w-6" />
                  </div>
                  <h3 className={cn("mt-5 font-display text-xl font-semibold tracking-tight", dark ? "text-white" : "text-slate-900")}>{f.title}</h3>
                  <p className={cn("mt-2.5 text-[15px] leading-relaxed", dark ? "text-slate-300" : "text-slate-600")}>{f.desc}</p>
                  {f.visual === "predictor" && <PredictorVisual />}
                  {f.visual === "mobile" && <MobileVisual />}
                </motion.article>
              </Item>
            );
          })}
        </Stagger>
      </Container>
    </Section>
  );
}
