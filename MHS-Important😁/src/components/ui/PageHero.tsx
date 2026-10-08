import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "../../utils/cn";
import { Container, Eyebrow } from "./Primitives";

const ease = [0.22, 1, 0.36, 1] as const;

export function PageHero({
  eyebrow,
  title,
  description,
  actions,
  dark,
  aside,
  className,
}: {
  eyebrow: string;
  title: ReactNode;
  description: ReactNode;
  actions?: ReactNode;
  dark?: boolean;
  aside?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("relative overflow-hidden pt-[72px]", dark ? "bg-ink-900 text-white noise" : "bg-gradient-to-b from-brand-50/70 via-white to-white", className)}>
      <div aria-hidden className={cn("absolute inset-0", dark ? "grid-pattern-dark" : "grid-pattern", "[mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]")} />
      <div aria-hidden className={cn("pointer-events-none absolute -left-32 top-10 h-96 w-96 rounded-full blur-[110px] animate-float-slow", dark ? "bg-brand-600/30" : "bg-brand-300/40")} />
      <div aria-hidden className={cn("pointer-events-none absolute -right-32 top-32 h-80 w-80 rounded-full blur-[110px] animate-float", dark ? "bg-mint-500/20" : "bg-mint-300/40")} />

      <Container className="relative">
        <div className={cn("grid items-center gap-12 py-16 sm:py-24", aside && "lg:grid-cols-2")}>
          <div className={cn(!aside && "mx-auto max-w-3xl text-center")}>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }}>
              <Eyebrow dark={dark}>{eyebrow}</Eyebrow>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 28, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.9, delay: 0.1, ease }}
              className={cn("mt-6 font-display text-4xl font-bold leading-[1.05] tracking-[-0.03em] sm:text-5xl lg:text-6xl", dark ? "text-white" : "text-slate-900")}
            >
              {title}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.22, ease }}
              className={cn("mt-6 text-lg leading-relaxed sm:text-xl", dark ? "text-slate-300" : "text-slate-600", !aside && "mx-auto max-w-2xl")}
            >
              {description}
            </motion.p>
            {actions && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.34, ease }}
                className={cn("mt-9 flex flex-col gap-3 sm:flex-row", !aside && "items-center justify-center")}
              >
                {actions}
              </motion.div>
            )}
          </div>
          {aside && (
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3, ease }}
              className="relative"
            >
              {aside}
            </motion.div>
          )}
        </div>
      </Container>
    </div>
  );
}
