import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Route = string;

interface RouterCtx {
  path: string;
  query: string;
  segments: string[];
  navigate: (to: string, anchor?: string) => void;
  back: () => void;
}

const Ctx = createContext<RouterCtx>({ path: "", query: "", segments: [], navigate: () => {}, back: () => {} });

function parse(): { path: string; anchor?: string; query: string } {
  const raw = window.location.hash.replace(/^#\/?/, "");
  const [pathAndQuery, anchor] = raw.split("#");
  const [path, query = ""] = pathAndQuery.split("?");
  return { path: path.replace(/\/+$/, ""), anchor, query };
}

export function RouterProvider({ children }: { children: ReactNode }) {
  const [path, setPath] = useState<string>(() => parse().path);
  const [query, setQuery] = useState<string>(() => parse().query);

  useEffect(() => {
    const onHash = () => {
      const { path: p, anchor, query: qs } = parse();
      setPath(p);
      setQuery(qs);
      requestAnimationFrame(() => {
        if (anchor) {
          const el = document.getElementById(anchor);
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
            return;
          }
        }
        window.scrollTo({ top: 0 });
      });
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const navigate = useCallback((to: string, anchor?: string) => {
    const clean = to.replace(/^\/+/, "").replace(/\/+$/, "");
    const next = `#/${clean}${anchor ? `#${anchor}` : ""}`;
    if (window.location.hash === next) {
      if (anchor) document.getElementById(anchor)?.scrollIntoView({ behavior: "smooth" });
      else window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    window.location.hash = next;
  }, []);

  const back = useCallback(() => window.history.back(), []);

  const value = useMemo(() => ({ path, query, segments: path ? path.split("/") : [], navigate, back }), [path, query, navigate, back]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useRouter = () => useContext(Ctx);

export function Link({
  to,
  anchor,
  className,
  children,
  onClick,
  ...rest
}: {
  to: string;
  anchor?: string;
  className?: string;
  children: ReactNode;
  onClick?: () => void;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "onClick">) {
  const { navigate } = useRouter();
  const clean = to.replace(/^\/+/, "");
  const href = `#/${clean}${anchor ? `#${anchor}` : ""}`;
  return (
    <a
      href={href}
      className={className}
      onClick={(e) => {
        e.preventDefault();
        onClick?.();
        navigate(clean, anchor);
      }}
      {...rest}
    >
      {children}
    </a>
  );
}
