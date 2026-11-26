import { useEffect, useMemo, useState } from "react";
import type { CSSProperties, PointerEvent as ReactPointerEvent, ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { EASE } from "./ui";

export { EASE };

/** True only on desktop-style pointers — gates every expensive pointer effect. */
export function useFinePointer() {
  const [fine, setFine] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setFine(query.matches);

    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return fine;
}

/**
 * True when the visitor has mouse-style input. `useFinePointer` alone is not
 * enough in the wild: hybrid laptops and convertible tablets can report a
 * coarse primary pointer (or `hover: none`) even though a real mouse/trackpad is
 * in use, which silently disabled the custom cursor. A genuine mouse pointer
 * event is the most reliable signal, while touch input never enables it.
 */
export function useMouseInput() {
  const [mouse, setMouse] = useState(false);

  useEffect(() => {
    if (mouse) return;

    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const anyFine = window.matchMedia("(any-hover: hover) and (any-pointer: fine)");
    const update = () => setMouse(fine.matches || anyFine.matches);

    update();
    fine.addEventListener("change", update);
    anyFine.addEventListener("change", update);

    const handlePointer = (event: PointerEvent) => {
      if (event.pointerType === "mouse") setMouse(true);
    };

    window.addEventListener("pointermove", handlePointer, { passive: true });
    window.addEventListener("pointerdown", handlePointer, { passive: true });

    return () => {
      fine.removeEventListener("change", update);
      anyFine.removeEventListener("change", update);
      window.removeEventListener("pointermove", handlePointer);
      window.removeEventListener("pointerdown", handlePointer);
    };
  }, [mouse]);

  return mouse;
}

type MagneticProps = {
  children: ReactNode;
  className?: string;
  /** Max travel in pixels at the edges of the element. */
  strength?: number;
};

/** Pulls a CTA gently toward the cursor. Desktop only, transform-only. */
export function Magnetic({ children, className = "", strength = 10 }: MagneticProps) {
  const reduceMotion = useReducedMotion();
  const finePointer = useFinePointer();
  const enabled = finePointer && !reduceMotion;

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 260, damping: 18, mass: 0.35 });
  const springY = useSpring(y, { stiffness: 260, damping: 18, mass: 0.35 });

  const handleMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!enabled) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const offsetX = (event.clientX - rect.left) / rect.width - 0.5;
    const offsetY = (event.clientY - rect.top) / rect.height - 0.5;

    x.set(offsetX * strength * 2);
    y.set(offsetY * strength * 1.4);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      className={`inline-flex ${className}`}
      style={enabled ? { x: springX, y: springY } : undefined}
      onPointerMove={handleMove}
      onPointerLeave={reset}
      onBlur={reset}
    >
      {children}
    </motion.div>
  );
}

export type RevealWord = {
  text?: string;
  node?: ReactNode;
  className?: string;
};

type WordRevealProps = {
  words: RevealWord[];
  /** Screen-reader friendly full sentence. */
  label: string;
  className?: string;
  delay?: number;
  stagger?: number;
  mode?: "mount" | "view";
};

/**
 * Word-by-word mask reveal. Each word rises out of its own clip box so the
 * typography feels typeset rather than merely faded in.
 */
export function WordReveal({
  words,
  label,
  className = "",
  delay = 0,
  stagger = 0.07,
  mode = "mount",
}: WordRevealProps) {
  const reduceMotion = useReducedMotion();
  const viewProps =
    mode === "view"
      ? { whileInView: "show" as const, viewport: { once: true, margin: "-80px" } }
      : { animate: "show" as const };

  if (reduceMotion) {
    return (
      <span className={className}>
        {words.map((word, index) => (
          <span key={index} className={word.className}>
            {word.node ?? word.text}
            {index < words.length - 1 ? " " : null}
          </span>
        ))}
      </span>
    );
  }

  return (
    <span className={className}>
      <span className="sr-only">{label}</span>
      <motion.span
        aria-hidden
        initial="hidden"
        {...viewProps}
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: stagger, delayChildren: delay } },
        }}
        className="inline"
      >
        {words.map((word, index) => (
          <span key={`${word.text ?? "word"}-${index}`}>
            <span className="inline-block overflow-hidden pb-3 align-bottom -mb-3">
              <motion.span
                variants={{
                  hidden: { y: "110%", opacity: 0 },
                  show: {
                    y: "0%",
                    opacity: 1,
                    transition: { duration: 0.95, ease: EASE },
                  },
                }}
                className={`inline-block ${word.className ?? ""}`}
              >
                {word.node ?? word.text}
              </motion.span>
            </span>
            {index < words.length - 1 ? " " : null}
          </span>
        ))}
      </motion.span>
    </span>
  );
}

type HandUnderlineProps = {
  className?: string;
  delay?: number;
  strokeWidth?: number;
  /** Draw on mount (hero) or when scrolled into view. */
  mode?: "mount" | "view";
};

/** Loose, hand-drawn marker stroke that draws itself on. */
export function HandUnderline({
  className = "",
  delay = 0.5,
  strokeWidth = 2.5,
  mode = "view",
}: HandUnderlineProps) {
  const reduceMotion = useReducedMotion();
  const viewProps =
    mode === "view"
      ? { whileInView: { pathLength: 1, opacity: 1 }, viewport: { once: true, margin: "-40px" } }
      : { animate: { pathLength: 1, opacity: 1 } };

  return (
    <svg
      aria-hidden
      viewBox="0 0 240 14"
      preserveAspectRatio="none"
      className={className}
      fill="none"
    >
      <motion.path
        d="M2 10C46 4 96 3 140 5c30 1.5 62 3.5 98 1"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        initial={reduceMotion ? false : { pathLength: 0, opacity: 0 }}
        {...viewProps}
        transition={{
          pathLength: { duration: 1.1, delay, ease: EASE },
          opacity: { duration: 0.25, delay },
        }}
      />
    </svg>
  );
}

type PetalParticlesProps = {
  count?: number;
  className?: string;
};

/**
 * Deterministic pink motes. Pure CSS drift (transform/opacity), so there is no
 * per-frame JavaScript and it degrades to nothing under reduced motion.
 */
export function PetalParticles({ count = 14, className = "" }: PetalParticlesProps) {
  const reduceMotion = useReducedMotion();

  const motes = useMemo(
    () =>
      Array.from({ length: count }, (_, index) => {
        const angle = (index * 137.5 * Math.PI) / 180;
        const radius = 26 + ((index * 41) % 40);
        const x = 50 + Math.cos(angle) * radius * 0.62;
        const y = 50 + Math.sin(angle) * radius * 0.7;

        return {
          left: `${x}%`,
          top: `${y}%`,
          size: 3 + (index % 3),
          delay: `${-(index * 1.73).toFixed(2)}s`,
          duration: `${11 + (index % 5) * 2.5}s`,
          drift: `${(index % 2 === 0 ? 1 : -1) * (10 + (index % 4) * 6)}px`,
          opacity: 0.35 + (index % 4) * 0.12,
        };
      }),
    [count],
  );

  if (reduceMotion) return null;

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {motes.map((mote, index) => (
        <span
          key={index}
          className="absolute rounded-full bg-petal animate-drift"
          style={
            {
              left: mote.left,
              top: mote.top,
              width: `${mote.size}px`,
              height: `${mote.size}px`,
              animationDelay: mote.delay,
              animationDuration: mote.duration,
              "--dx": mote.drift,
              "--particle-opacity": mote.opacity,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
