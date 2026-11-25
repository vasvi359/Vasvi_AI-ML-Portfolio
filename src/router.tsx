import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import { flushSync } from "react-dom";

type RouterValue = {
  path: string;
  navigate: (to: string) => void;
};

const RouterContext = createContext<RouterValue>({
  path: "/",
  navigate: () => {},
});

type ViewTransitionDocument = Document & {
  startViewTransition?: (callback: () => void) => unknown;
};

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Waits for a section to exist (it may mount a frame after navigation). */
function scrollToHash(hash: string, attempt = 0) {
  const id = hash.replace(/^#/, "");
  if (!id) {
    window.scrollTo({ top: 0, behavior: "auto" });
    return;
  }

  const target = document.getElementById(id);
  if (target) {
    target.scrollIntoView({
      behavior: prefersReducedMotion() ? "auto" : "smooth",
      block: "start",
    });
    return;
  }

  if (attempt < 40) {
    requestAnimationFrame(() => scrollToHash(hash, attempt + 1));
  }
}

export function RouterProvider({ children }: { children: ReactNode }) {
  const [path, setPath] = useState(() => window.location.pathname);

  const navigate = useCallback((to: string) => {
    const url = new URL(to, window.location.href);

    if (url.origin !== window.location.origin) {
      window.location.assign(url.href);
      return;
    }

    const samePath = url.pathname === window.location.pathname;
    const sameHash = url.hash === window.location.hash;

    if (samePath) {
      if (!sameHash) {
        window.history.pushState(null, "", url.pathname + url.search + url.hash);
      }
      if (url.hash) scrollToHash(url.hash);
      else window.scrollTo({ top: 0, behavior: "auto" });
      return;
    }

    const commit = () => {
      window.history.pushState(null, "", url.pathname + url.search + url.hash);
      flushSync(() => setPath(url.pathname));
      if (url.hash) scrollToHash(url.hash);
      else window.scrollTo({ top: 0, behavior: "auto" });
    };

    const doc = document as ViewTransitionDocument;
    if (!prefersReducedMotion() && typeof doc.startViewTransition === "function") {
      doc.startViewTransition(commit);
    } else {
      commit();
    }
  }, []);

  useEffect(() => {
    const onPop = () => {
      setPath(window.location.pathname);
      if (window.location.hash) scrollToHash(window.location.hash);
      else window.scrollTo({ top: 0, behavior: "auto" });
    };

    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => {
    if (window.location.hash) scrollToHash(window.location.hash);
  }, []);

  const value = useMemo(() => ({ path, navigate }), [path, navigate]);

  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}

export function useRouter() {
  return useContext(RouterContext);
}

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { to: string };

/** Anchor that keeps navigation client-side but still renders a real href. */
export function Link({ to, onClick, ...rest }: LinkProps) {
  const { navigate } = useRouter();

  return (
    <a
      {...rest}
      href={to}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        if (event.button !== 0) return;
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        if (rest.target && rest.target !== "_self") return;
        event.preventDefault();
        navigate(to);
      }}
    />
  );
}
