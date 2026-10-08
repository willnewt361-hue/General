import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect } from "react";
import { cn } from "../utils/cn";

export const ease = [0.22, 1, 0.36, 1] as const;

export function Card({ children, className, hover, ...rest }: { children: ReactNode; className?: string; hover?: boolean } & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-200/80 bg-white shadow-sm",
        hover && "transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-brand-500/10 hover:border-brand-200",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

export function CardHead({ title, subtitle, action, icon }: { title: ReactNode; subtitle?: ReactNode; action?: ReactNode; icon?: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4">
      <div className="flex min-w-0 items-start gap-3">
        {icon && <span className="mt-0.5 shrink-0">{icon}</span>}
        <div className="min-w-0">
          <h3 className="truncate font-display text-[15px] font-semibold tracking-tight text-slate-900">{title}</h3>
          {subtitle && <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>}
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function Btn({
  children,
  variant = "primary",
  size = "md",
  className,
  icon,
  ...rest
}: {
  children: ReactNode;
  variant?: "primary" | "soft" | "ghost" | "danger" | "dark" | "success";
  size?: "xs" | "sm" | "md" | "lg";
  icon?: ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const variants = {
    primary: "bg-gradient-to-r from-brand-600 to-brand-500 text-white shadow-sm shadow-brand-500/30 hover:shadow-md hover:shadow-brand-500/40",
    soft: "bg-brand-50 text-brand-700 hover:bg-brand-100 border border-brand-100",
    ghost: "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300",
    danger: "bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100",
    success: "bg-mint-500 text-white hover:bg-mint-600 shadow-sm shadow-mint-500/30",
    dark: "bg-slate-900 text-white hover:bg-slate-800",
  };
  const sizes = { xs: "h-8 px-3 text-xs", sm: "h-9 px-3.5 text-[13px]", md: "h-10 px-4 text-sm", lg: "h-12 px-6 text-[15px]" };
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        sizes[size],
        className,
      )}
      {...rest}
    >
      {icon}
      {children}
    </button>
  );
}

export function Badge({ children, tone = "slate", className }: { children: ReactNode; tone?: "slate" | "brand" | "mint" | "amber" | "rose" | "sky" | "violet"; className?: string }) {
  const tones = {
    slate: "bg-slate-100 text-slate-700 border-slate-200",
    brand: "bg-brand-50 text-brand-700 border-brand-200",
    mint: "bg-mint-500/10 text-mint-700 border-mint-500/20",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    rose: "bg-rose-50 text-rose-700 border-rose-200",
    sky: "bg-sky-50 text-sky-700 border-sky-200",
    violet: "bg-violet-50 text-violet-700 border-violet-200",
  };
  return <span className={cn("inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold", tones[tone], className)}>{children}</span>;
}

export function Progress({ value, className, tone = "brand" }: { value: number; className?: string; tone?: "brand" | "mint" | "amber" | "rose" }) {
  const tones = { brand: "from-brand-500 to-brand-400", mint: "from-mint-500 to-mint-400", amber: "from-amber-500 to-amber-400", rose: "from-rose-500 to-rose-400" };
  return (
    <div className={cn("h-2 w-full overflow-hidden rounded-full bg-slate-100", className)}>
      <motion.div initial={{ width: 0 }} animate={{ width: `${Math.max(0, Math.min(100, value))}%` }} transition={{ duration: 0.9, ease }} className={cn("h-full rounded-full bg-gradient-to-r", tones[tone])} />
    </div>
  );
}

export function Stat({ label, value, sub, icon, tone = "brand", delay = 0 }: { label: string; value: ReactNode; sub?: ReactNode; icon?: ReactNode; tone?: "brand" | "mint" | "amber" | "violet"; delay?: number }) {
  const tones = {
    brand: "from-brand-500 to-brand-600 shadow-brand-500/25",
    mint: "from-mint-500 to-emerald-600 shadow-mint-500/25",
    amber: "from-amber-400 to-orange-500 shadow-amber-500/25",
    violet: "from-violet-500 to-purple-600 shadow-violet-500/25",
  };
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.5, ease }}>
      <Card hover className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-xs font-medium uppercase tracking-wider text-slate-500">{label}</p>
            <p className="mt-2 font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{value}</p>
            {sub && <p className="mt-1 text-xs text-slate-500">{sub}</p>}
          </div>
          {icon && <span className={cn("grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br text-white shadow-lg", tones[tone])}>{icon}</span>}
        </div>
      </Card>
    </motion.div>
  );
}

export function Field({
  label,
  hint,
  children,
  className,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1.5 block text-sm font-medium text-slate-700">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-slate-500">{hint}</span>}
    </label>
  );
}

export const inputCls =
  "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10";

export function Modal({ open, onClose, title, children, wide }: { open: boolean; onClose: () => void; title: string; children: ReactNode; wide?: boolean }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[70] flex items-end justify-center p-0 sm:items-center sm:p-6">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-ink-950/60 backdrop-blur-sm" />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.3, ease }}
            className={cn("relative max-h-[92vh] w-full overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl", wide ? "sm:max-w-3xl" : "sm:max-w-lg")}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white/95 px-5 py-4 backdrop-blur">
              <h2 className="font-display text-lg font-bold tracking-tight text-slate-900">{title}</h2>
              <button onClick={onClose} aria-label="Close dialog" className="grid h-9 w-9 place-items-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-900">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-5">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export function Empty({ icon, title, body, action }: { icon?: ReactNode; title: string; body?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 px-6 py-14 text-center">
      {icon && <span className="mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-white text-slate-400 shadow-sm">{icon}</span>}
      <h3 className="font-display text-base font-semibold text-slate-900">{title}</h3>
      {body && <p className="mt-1.5 max-w-sm text-sm text-slate-500">{body}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function Avatar({ name, hue, size = 40, className }: { name: string; hue: number; size?: number; className?: string }) {
  const initials = name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  return (
    <span
      className={cn("inline-grid shrink-0 place-items-center rounded-full font-semibold text-white shadow-sm", className)}
      style={{ width: size, height: size, fontSize: size * 0.36, background: `linear-gradient(135deg, hsl(${hue} 72% 55%), hsl(${(hue + 40) % 360} 68% 42%))` }}
      aria-hidden
    >
      {initials}
    </span>
  );
}

export function PageTitle({ title, subtitle, action, children }: { title: string; subtitle?: string; action?: ReactNode; children?: ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{title}</h1>
        {subtitle && <p className="mt-1.5 text-sm text-slate-500">{subtitle}</p>}
        {children}
      </div>
      {action}
    </motion.div>
  );
}

export function Sparkline({ data, className, tone = "#6366f1" }: { data: number[]; className?: string; tone?: string }) {
  if (data.length < 2) return <div className={cn("h-16", className)} />;
  const w = 300;
  const h = 64;
  const max = Math.max(...data, 100);
  const min = Math.min(...data, 0);
  const pts = data.map((v, i) => [(i / (data.length - 1)) * w, h - ((v - min) / (max - min || 1)) * (h - 6) - 3]);
  const d = pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
  const area = `${d} L${w},${h} L0,${h} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className={cn("h-16 w-full", className)} aria-hidden>
      <defs>
        <linearGradient id={`sg-${tone.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={tone} stopOpacity="0.28" />
          <stop offset="100%" stopColor={tone} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#sg-${tone.replace("#", "")})`} />
      <motion.path initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2, ease }} d={d} fill="none" stroke={tone} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

export function Ring({ value, size = 120, label, sub }: { value: number; size?: number; label?: string; sub?: string }) {
  const r = (size - 14) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e2e8f0" strokeWidth="9" />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="url(#ringGrad)"
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c - (Math.min(100, value) / 100) * c }}
          transition={{ duration: 1.3, ease }}
        />
        <defs>
          <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute text-center">
        <p className="font-display text-2xl font-bold text-slate-900">{label ?? `${value}%`}</p>
        {sub && <p className="text-[10px] uppercase tracking-wider text-slate-500">{sub}</p>}
      </div>
    </div>
  );
}

export function Tabs<T extends string>({ tabs, active, onChange, id }: { tabs: { id: T; label: string; count?: number }[]; active: T; onChange: (t: T) => void; id: string }) {
  return (
    <div role="tablist" aria-label={id} className="flex flex-wrap gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1">
      {tabs.map((t) => (
        <button
          key={t.id}
          role="tab"
          aria-selected={active === t.id}
          onClick={() => onChange(t.id)}
          className={cn("relative rounded-lg px-3.5 py-2 text-[13px] font-semibold transition-colors", active === t.id ? "text-slate-900" : "text-slate-500 hover:text-slate-800")}
        >
          {active === t.id && <motion.span layoutId={`tab-${id}`} className="absolute inset-0 rounded-lg bg-white shadow-sm" transition={{ type: "spring", stiffness: 380, damping: 30 }} />}
          <span className="relative">
            {t.label}
            {t.count !== undefined && <span className="ml-1.5 rounded-full bg-slate-200/80 px-1.5 py-0.5 text-[10px] tabular-nums">{t.count}</span>}
          </span>
        </button>
      ))}
    </div>
  );
}

export function Toast({ message, show }: { message: string; show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.97 }}
          className="fixed bottom-6 left-1/2 z-[90] -translate-x-1/2 rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white shadow-2xl"
          role="status"
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export const fmtDate = (ts: number) =>
  new Date(ts).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
export const fmtTime = (ts: number) => new Date(ts).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
export const ago = (ts: number) => {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  if (s < 604800) return `${Math.floor(s / 86400)}d ago`;
  return fmtDate(ts);
};
export const fmtUGX = (n: number) => `UGX ${n.toLocaleString("en-UG")}`;
