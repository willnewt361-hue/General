import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

const ease = [0.22, 1, 0.36, 1] as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28, filter: "blur(6px)" },
  show: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease, delay },
  }),
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: (delay: number = 0) => ({ opacity: 1, transition: { duration: 0.8, ease, delay } }),
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.94, y: 16 },
  show: (delay: number = 0) => ({ opacity: 1, scale: 1, y: 0, transition: { duration: 0.8, ease, delay } }),
};

export const stagger = (delay = 0.08, delayChildren = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: delay, delayChildren } },
});

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  variants?: Variants;
  once?: boolean;
  amount?: number;
  as?: "div" | "section" | "li" | "span" | "p" | "h1" | "h2" | "h3";
}

export function Reveal({ children, className, delay = 0, variants = fadeUp, once = true, amount = 0.25, as = "div" }: RevealProps) {
  const Comp = motion[as] as typeof motion.div;
  return (
    <Comp className={className} initial="hidden" whileInView="show" viewport={{ once, amount }} variants={variants} custom={delay}>
      {children}
    </Comp>
  );
}

export function Stagger({
  children,
  className,
  delay = 0.08,
  delayChildren = 0,
  amount = 0.2,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  delayChildren?: number;
  amount?: number;
  as?: "div" | "ul" | "section";
}) {
  const Comp = motion[as] as typeof motion.div;
  return (
    <Comp className={className} initial="hidden" whileInView="show" viewport={{ once: true, amount }} variants={stagger(delay, delayChildren)}>
      {children}
    </Comp>
  );
}

export function Item({ children, className, variants = fadeUp, as = "div" }: { children: ReactNode; className?: string; variants?: Variants; as?: "div" | "li" }) {
  const Comp = motion[as] as typeof motion.div;
  return (
    <Comp className={className} variants={variants} custom={0}>
      {children}
    </Comp>
  );
}
