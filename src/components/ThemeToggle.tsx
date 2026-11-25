import { useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../theme";
import { EASE } from "./ui";

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const reduceMotion = useReducedMotion();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const isDark = theme === "dark";
  const label = isDark ? "Switch to light mode" : "Switch to dark mode";

  const handleToggle = () => {
    const rect = buttonRef.current?.getBoundingClientRect();
    toggle(
      rect
        ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
        : undefined,
    );
  };

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={handleToggle}
      aria-label={label}
      title={label}
      className="group relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-blush bg-surface/70 text-ink transition-all duration-300 hover:-translate-y-0.5 hover:border-petal hover:text-accent hover:shadow-[0_0_22px_-6px_rgba(217,111,150,0.5)]"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={isDark ? "sun" : "moon"}
          initial={reduceMotion ? false : { opacity: 0, rotate: -45, scale: 0.7 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={
            reduceMotion
              ? { opacity: 0 }
              : { opacity: 0, rotate: 45, scale: 0.7 }
          }
          transition={{ duration: reduceMotion ? 0 : 0.24, ease: EASE }}
          className="flex items-center justify-center"
        >
          {isDark ? (
            <Sun className="h-[17px] w-[17px]" strokeWidth={1.6} aria-hidden />
          ) : (
            <Moon className="h-[17px] w-[17px]" strokeWidth={1.6} aria-hidden />
          )}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
