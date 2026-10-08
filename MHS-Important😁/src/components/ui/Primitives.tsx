import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { ReactNode, ButtonHTMLAttributes, AnchorHTMLAttributes } from "react";
import { cn } from "../../utils/cn";
import { Link, type Route } from "../../router";
import { Reveal } from "./Reveal";

export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10", className)}>{children}</div>;
}

export function Section({ id, children, className }: { id?: string; children: ReactNode; className?: string }) {
  return (
    <section id={id} className={cn("relative py-20 sm:py-28 lg:py-32 scroll-mt-24", className)}>
      {children}
    </section>
  );
}

export function Eyebrow({ children, className, dark }: { children: ReactNode; className?: string; dark?: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.14em]",
        dark
          ? "border-white/10 bg-white/5 text-brand-200"
          : "border-brand-200/70 bg-brand-50 text-brand-700",
        className,
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", dark ? "bg-mint-400" : "bg-brand-500")} />
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  dark,
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "center" | "left";
  dark?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("max-w-3xl", align === "center" ? "mx-auto text-center" : "text-left", className)}>
      {eyebrow && (
        <Reveal>
          <Eyebrow dark={dark}>{eyebrow}</Eyebrow>
        </Reveal>
      )}
      <Reveal delay={0.08}>
        <h2
          className={cn(
            "mt-5 font-display text-3xl font-bold leading-[1.1] tracking-[-0.02em] sm:text-4xl lg:text-[2.85rem]",
            dark ? "text-white" : "text-slate-900",
          )}
        >
          {title}
        </h2>
      </Reveal>
      {description && (
        <Reveal delay={0.16}>
          <p className={cn("mt-5 text-base leading-relaxed sm:text-lg", dark ? "text-slate-300" : "text-slate-600")}>{description}</p>
        </Reveal>
      )}
    </div>
  );
}

type BtnBase = {
  variant?: "primary" | "secondary" | "ghost" | "white" | "outline-dark";
  size?: "sm" | "md" | "lg";
  icon?: boolean;
  className?: string;
  children: ReactNode;
};

const variants = {
  primary:
    "bg-gradient-to-r from-brand-600 via-brand-500 to-brand-600 bg-[length:200%_auto] text-white shadow-lg shadow-brand-500/30 hover:bg-right hover:shadow-xl hover:shadow-brand-500/40 focus-visible:outline-brand-500",
  secondary:
    "bg-slate-900 text-white shadow-lg shadow-slate-900/20 hover:bg-slate-800",
  ghost: "bg-white/70 text-slate-900 border border-slate-200 hover:bg-white hover:border-slate-300 shadow-sm backdrop-blur",
  white: "bg-white text-slate-900 shadow-xl shadow-black/20 hover:bg-slate-50",
  "outline-dark": "border border-white/15 bg-white/5 text-white backdrop-blur hover:bg-white/10 hover:border-white/25",
};
const sizes = {
  sm: "h-10 px-4 text-sm",
  md: "h-12 px-6 text-sm sm:text-[15px]",
  lg: "h-14 px-8 text-base",
};

const btnClass = ({ variant = "primary", size = "md", className }: Pick<BtnBase, "variant" | "size" | "className">) =>
  cn(
    "group relative inline-flex items-center justify-center gap-2 rounded-full font-semibold tracking-tight transition-all duration-300 ease-out active:scale-[0.98] cursor-pointer select-none whitespace-nowrap",
    variants[variant],
    sizes[size],
    className,
  );

const Arrow = () => (
  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
);

export function Button({ variant, size, icon, className, children, ...rest }: BtnBase & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }} className={btnClass({ variant, size, className })} {...(rest as object)}>
      {children}
      {icon && <Arrow />}
    </motion.button>
  );
}

export function LinkButton({
  to,
  anchor,
  variant,
  size,
  icon,
  className,
  children,
}: BtnBase & { to: Route; anchor?: string }) {
  return (
    <motion.span whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }} className="inline-flex">
      <Link to={to} anchor={anchor} className={btnClass({ variant, size, className })}>
        {children}
        {icon && <Arrow />}
      </Link>
    </motion.span>
  );
}

export function ExternalButton({
  href,
  variant,
  size,
  icon,
  className,
  children,
  ...rest
}: BtnBase & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  return (
    <motion.a
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className={btnClass({ variant, size, className })}
      {...(rest as object)}
    >
      {children}
      {icon && <Arrow />}
    </motion.a>
  );
}

export function Logo({ dark, className }: { dark?: boolean; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span className="relative grid h-9 w-9 place-items-center overflow-hidden rounded-xl bg-gradient-to-br from-brand-500 via-brand-600 to-mint-500 shadow-lg shadow-brand-500/30">
        <span className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.45),transparent_55%)]" />
        <svg viewBox="0 0 24 24" className="relative h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M4 19V6l8 5 8-5v13" />
          <path d="M4 12l8 5 8-5" />
        </svg>
      </span>
      <span className="flex flex-col leading-none">
        <span className={cn("font-display text-[17px] font-bold tracking-tight", dark ? "text-white" : "text-slate-900")}>Mengo Hub</span>
        <span className={cn("text-[10px] font-semibold uppercase tracking-[0.2em]", dark ? "text-brand-300" : "text-brand-600")}>System</span>
      </span>
    </span>
  );
}

export function GlowOrb({ className }: { className?: string }) {
  return <div aria-hidden className={cn("pointer-events-none absolute rounded-full blur-3xl", className)} />;
}
