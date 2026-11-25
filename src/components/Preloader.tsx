import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { EASE } from "./motion-kit";

const SESSION_KEY = "vasvi-intro-seen";

/**
 * Minimal branded introduction. Pointer-events pass through, it never blocks
 * input or scroll, and it is skipped entirely for reduced motion and repeat
 * visits within the same session.
 */
export default function Preloader() {
  const reduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      return window.sessionStorage.getItem(SESSION_KEY) !== "1";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (!visible) return;

    try {
      window.sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      /* storage can be unavailable in private modes — the intro just repeats. */
    }

    const timer = window.setTimeout(() => setVisible(false), 650);
    return () => window.clearTimeout(timer);
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && !reduceMotion ? (
        <motion.div
          aria-hidden
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.45, ease: EASE } }}
          className="pointer-events-none fixed inset-0 z-[80] flex items-center justify-center bg-paper"
        >
          <div className="flex flex-col items-center">
            <svg viewBox="0 0 64 64" className="h-12 w-12 text-petal" fill="none">
              {[0, 1, 2, 3].map((petal) => (
                <motion.ellipse
                  key={petal}
                  cx="32"
                  cy="20"
                  rx="8"
                  ry="13"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  style={{ transformOrigin: "32px 32px", rotate: `${petal * 90}deg` }}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.9 }}
                  transition={{
                    duration: 0.9,
                    delay: 0.05 + petal * 0.1,
                    ease: EASE,
                  }}
                />
              ))}
              <motion.circle
                cx="32"
                cy="32"
                r="3"
                fill="#d96f96"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.45, ease: EASE }}
                style={{ transformOrigin: "32px 32px" }}
              />
            </svg>

            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35, ease: EASE }}
              className="mt-4 font-serif text-2xl italic leading-none text-ink"
            >
              vasvi
            </motion.p>
            <motion.span
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.9, delay: 0.5, ease: EASE }}
              className="mt-3 block h-px w-16 origin-left bg-gradient-to-r from-petal to-transparent"
            />
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
