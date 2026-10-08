import { motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { BrainCircuit, CheckCircle2, Flame, ShieldCheck, Sparkles, TrendingUp } from "lucide-react";
import { useRef } from "react";
import { Container, ExternalButton, LinkButton, Logo } from "../ui/Primitives";
import { GITHUB_URL } from "../layout/Navbar";
import { Github } from "../ui/GithubIcon";

const ease = [0.22, 1, 0.36, 1] as const;

function FloatCard({
  className,
  delay,
  children,
}: {
  className?: string;
  delay: number;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.9, ease }}
      className={`absolute z-20 ${className}`}
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 6 + delay * 2, repeat: Infinity, ease: "easeInOut" }}
        className="glass-dark rounded-2xl p-3.5 shadow-2xl shadow-black/40 sm:p-4"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.2]);

  // Mouse tilt
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [6, -6]), { stiffness: 120, damping: 20 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-8, 8]), { stiffness: 120, damping: 20 });

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <div ref={ref} className="relative overflow-hidden bg-ink-900 pt-[72px] text-white noise">
      {/* Ambient background */}
      <div aria-hidden className="absolute inset-0 grid-pattern-dark [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 top-10 h-[34rem] w-[34rem] rounded-full bg-brand-600/30 blur-[120px] animate-float-slow" />
        <div className="absolute -right-40 top-40 h-[30rem] w-[30rem] rounded-full bg-mint-500/20 blur-[120px] animate-float" />
        <div className="absolute left-1/2 top-[60%] h-[24rem] w-[40rem] -translate-x-1/2 rounded-full bg-brand-500/20 blur-[120px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-ink-900" />
      </div>

      <Container className="relative">
        <div className="mx-auto max-w-4xl pb-16 pt-14 text-center sm:pt-20 lg:pt-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease }}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 py-1.5 pl-1.5 pr-4 text-xs font-medium text-slate-200 backdrop-blur"
          >
            <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-brand-500 to-mint-500 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
              <Sparkles className="h-3 w-3" /> New
            </span>
            AI Exam Predictor now supports UCE & UACE past papers
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.9, delay: 0.1, ease }}
            className="mt-7 font-display text-[2.6rem] font-bold leading-[1.02] tracking-[-0.03em] sm:text-6xl lg:text-[4.75rem]"
          >
            The smart school system built for{" "}
            <span className="shimmer-text animate-shimmer">Mengo</span> — and every learner in Uganda.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25, ease }}
            className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg lg:text-xl"
          >
            Mengo Hub System unites learners, teachers and UNEB-aligned assessment in one beautiful platform — AI tutoring,
            mock exams, analytics and certification, from S.1 to S.6.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease }}
            className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <LinkButton to="signup" size="lg" icon className="w-full sm:w-auto">
              Start learning free
            </LinkButton>
            <ExternalButton href={GITHUB_URL} variant="outline-dark" size="lg" className="w-full sm:w-auto">
              <Github className="h-4 w-4" /> View source on GitHub
            </ExternalButton>
          </motion.div>

          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-slate-400"
          >
            {["Free for students", "UNEB syllabus aligned", "Works offline on mobile", "Open source"].map((t) => (
              <li key={t} className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-mint-400" /> {t}
              </li>
            ))}
          </motion.ul>
        </div>

        {/* Product shot */}
        <motion.div style={{ y, opacity }} className="relative mx-auto max-w-6xl pb-24 [perspective:2000px] sm:pb-32">
          <motion.div
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.5, ease }}
            style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
            onMouseMove={onMove}
            onMouseLeave={onLeave}
            className="relative"
          >
            <div aria-hidden className="absolute -inset-1 rounded-[26px] bg-gradient-to-b from-white/20 via-brand-400/20 to-transparent blur-sm" />
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-ink-800 shadow-[0_40px_120px_-20px_rgba(79,70,229,0.45)]">
              <div className="flex items-center gap-2 border-b border-white/5 bg-ink-900/80 px-4 py-3">
                <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
                <span className="h-3 w-3 rounded-full bg-[#28c840]" />
                <span className="ml-4 hidden rounded-md bg-white/5 px-3 py-1 text-xs text-slate-400 sm:inline-block">app.mengohub.ug/dashboard</span>
              </div>
              <div className="relative">
                <img
                  src="images/dashboard.png"
                  alt="Mengo Hub System learner dashboard showing UNEB readiness, subject progress and the AI tutor"
                  className="block w-full"
                  width={1568}
                  height={1004}
                  loading="eager"
                  fetchPriority="high"
                />
                {/* Brand overlay masking mock logo */}
                <div className="absolute left-[1.6%] top-[2.2%] flex h-[7%] w-[14.5%] items-center rounded-lg bg-[#0d1428] pl-[1%]">
                  <Logo dark className="origin-left scale-[0.55] sm:scale-75 lg:scale-90" />
                </div>
              </div>
            </div>

            <FloatCard delay={1.0} className="-left-3 top-[18%] hidden sm:block lg:-left-10">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-mint-500/20 text-mint-300">
                  <TrendingUp className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-slate-400">Class average</p>
                  <p className="font-display text-lg font-bold">+18% <span className="text-xs font-medium text-mint-300">this term</span></p>
                </div>
              </div>
            </FloatCard>

            <FloatCard delay={1.2} className="-right-3 top-[38%] hidden sm:block lg:-right-10">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-500/20 text-brand-200">
                  <BrainCircuit className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-slate-400">AI predictor</p>
                  <p className="font-display text-lg font-bold">Likely Q: Titration</p>
                </div>
              </div>
            </FloatCard>

            <FloatCard delay={1.4} className="bottom-[10%] left-[8%] hidden md:block">
              <div className="flex items-center gap-3">
                <span className="relative grid h-10 w-10 place-items-center rounded-xl bg-gold-400/20 text-gold-300">
                  <Flame className="h-5 w-5" />
                  <span className="absolute inset-0 rounded-xl border border-gold-400/40 animate-pulse-ring" />
                </span>
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-slate-400">Revision streak</p>
                  <p className="font-display text-lg font-bold">21 days 🔥</p>
                </div>
              </div>
            </FloatCard>

            <FloatCard delay={1.6} className="-bottom-4 right-[10%] hidden md:block">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 text-white">
                  <ShieldCheck className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-slate-400">Certificate</p>
                  <p className="font-display text-lg font-bold">Verified ✓</p>
                </div>
              </div>
            </FloatCard>
          </motion.div>
        </motion.div>
      </Container>
    </div>
  );
}
