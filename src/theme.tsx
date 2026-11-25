import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ReactNode } from "react";
import { flushSync } from "react-dom";

export type Theme = "light" | "dark";

export type ThemeOrigin = {
  /** Viewport coordinates of the theme toggle's centre. */
  x: number;
  y: number;
};

const STORAGE_KEY = "vasvi-theme";
const RIPPLE_DURATION = 820;

type ViewTransitionLike = {
  ready: Promise<void>;
  finished: Promise<void>;
};

type ThemeDocument = Document & {
  startViewTransition?: (callback: () => void) => ViewTransitionLike;
};

type ThemeValue = {
  theme: Theme;
  toggle: (origin?: ThemeOrigin) => void;
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeValue>({
  theme: "light",
  toggle: () => {},
  setTheme: () => {},
});

function themeFromDocument(): Theme {
  if (typeof document === "undefined") return "light";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function setMetaThemeColor(theme: Theme) {
  const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  if (meta) meta.content = theme === "dark" ? "#17141A" : "#FFFFFF";
}

/**
 * Theme state is owned above the router, so both the homepage and the project
 * pages read the same value. The `.dark` class is applied to <html> by an
 * inline script before React mounts; this provider syncs with that class.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(themeFromDocument);
  const transitionTimer = useRef<number | null>(null);
  const rippleActive = useRef(false);

  const apply = useCallback((next: Theme, persist: boolean, animate = true) => {
    const root = document.documentElement;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (animate && !reduceMotion) {
      root.classList.add("theme-transition");
      if (transitionTimer.current !== null) window.clearTimeout(transitionTimer.current);
      transitionTimer.current = window.setTimeout(() => {
        root.classList.remove("theme-transition");
        transitionTimer.current = null;
      }, 320);
    } else {
      root.classList.remove("theme-transition");
      if (transitionTimer.current !== null) {
        window.clearTimeout(transitionTimer.current);
        transitionTimer.current = null;
      }
    }

    root.classList.toggle("dark", next === "dark");
    root.style.colorScheme = next;
    setMetaThemeColor(next);
    setThemeState(next);

    if (persist) {
      try {
        window.localStorage.setItem(STORAGE_KEY, next);
      } catch {
        /* the choice still holds for this visit */
      }
    }
  }, []);

  useEffect(() => {
    const initial = themeFromDocument();
    setThemeState(initial);
    document.documentElement.style.colorScheme = initial;
    setMetaThemeColor(initial);
  }, []);

  // Follow the system only while the visitor has not made an explicit choice.
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (event: MediaQueryListEvent) => {
      let stored: string | null = null;
      try {
        stored = window.localStorage.getItem(STORAGE_KEY);
      } catch {
        /* treat as no preference */
      }
      if (!stored) apply(event.matches ? "dark" : "light", false);
    };

    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [apply]);

  useEffect(
    () => () => {
      if (transitionTimer.current !== null) window.clearTimeout(transitionTimer.current);
    },
    [],
  );

  const setTheme = useCallback(
    (next: Theme) => {
      apply(next, true);
    },
    [apply],
  );

  /**
   * Circular reveal driven by the View Transitions API. The incoming theme is
   * rendered as the `new(root)` snapshot and clipped from the toggle's centre
   * to the furthest viewport corner. Browsers without view transitions (and
   * reduced-motion visitors) fall back to the existing short cross-fade.
   */
  const toggle = useCallback(
    (origin?: ThemeOrigin) => {
      const next = theme === "dark" ? "light" : "dark";
      const doc = document as ThemeDocument;
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const supportsRipple = typeof doc.startViewTransition === "function";

      if (!origin || reduceMotion || !supportsRipple) {
        apply(next, true);
        return;
      }

      if (rippleActive.current) return;
      rippleActive.current = true;

      const root = document.documentElement;
      const x = Math.round(origin.x);
      const y = Math.round(origin.y);
      const radius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y),
      );

      root.style.setProperty("--ripple-x", `${x}px`);
      root.style.setProperty("--ripple-y", `${y}px`);
      root.classList.add("theme-rippling");

      let rippleAnimation: Animation | null = null;
      let safetyTimer: number | null = null;

      const cleanup = () => {
        if (safetyTimer !== null) {
          window.clearTimeout(safetyTimer);
          safetyTimer = null;
        }
        rippleAnimation?.cancel();
        rippleAnimation = null;
        rippleActive.current = false;
        root.classList.remove("theme-rippling");
      };

      // If a browser never resolves `finished`, never leave the toggle locked.
      safetyTimer = window.setTimeout(cleanup, RIPPLE_DURATION + 1200);

      let transition: ViewTransitionLike;
      try {
        transition = doc.startViewTransition!(() => {
          // Commit the destination theme before the new snapshot is taken.
          flushSync(() => apply(next, true, false));
        });
      } catch {
        cleanup();
        apply(next, true);
        return;
      }

      transition.ready
        .then(() => {
          rippleAnimation = root.animate(
            {
              clipPath: [
                `circle(0px at ${x}px ${y}px)`,
                `circle(${radius}px at ${x}px ${y}px)`,
              ],
            },
            {
              duration: RIPPLE_DURATION,
              easing: "cubic-bezier(0.4, 0, 0.2, 1)",
              fill: "forwards",
              pseudoElement: "::view-transition-new(root)",
            },
          );
        })
        .catch(() => {
          /* the transition was skipped; the theme is already applied */
        });

      transition.finished.finally(cleanup);
    },
    [apply, theme],
  );

  const value = useMemo(() => ({ theme, toggle, setTheme }), [theme, toggle, setTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
