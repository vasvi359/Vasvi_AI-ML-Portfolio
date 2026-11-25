import { motion, useReducedMotion } from "framer-motion";
import { EASE } from "./motion-kit";

const SHAPES = [0, 1, 2, 3, 4, 5, 6];

/**
 * Signature transition between About and Skills: a row of petals progressively
 * squares off into pixels, from intuition on the left to engineering on the
 * right. One-shot, seven elements, border-radius + transform only.
 */
export default function PetalPixelDivider() {
  const reduceMotion = useReducedMotion();

  return (
    <div aria-hidden className="relative overflow-hidden bg-paper">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-b from-paper via-cream/70 to-cream" />

      <div className="relative mx-auto flex max-w-6xl flex-col items-center px-5 pb-12 pt-6 sm:pb-16 sm:pt-8">
        <div className="flex items-center gap-2.5 sm:gap-4">
          {SHAPES.map((index) => {
            const t = index / (SHAPES.length - 1);
            const size = 22 + Math.round(Math.sin(t * Math.PI) * 12);
            const round = Math.round((1 - t) * 100);

            return (
              <motion.span
                key={index}
                className="block"
                style={{
                  width: size,
                  height: size,
                  background:
                    t < 0.5
                      ? "linear-gradient(140deg, #f8dce5, #efa9c0)"
                      : "linear-gradient(140deg, #efa9c0, #d96f96)",
                  borderRadius: `${round}% ${Math.round(t * 6)}% ${round}% ${round}%`,
                  rotate: `${(1 - t) * -18}deg`,
                }}
                initial={
                  reduceMotion ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.4, y: 10 }
                }
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.85, delay: 0.08 + index * 0.06, ease: EASE }}
              />
            );
          })}
        </div>

        <div className="mt-6 flex w-full max-w-sm items-center gap-3 font-mono text-[9px] uppercase tracking-[0.24em] text-muted">
          <span className="whitespace-nowrap">intuition</span>
          <span className="relative h-px flex-1 overflow-hidden bg-blush">
            <motion.span
              className="absolute inset-y-0 left-0 w-full origin-left bg-gradient-to-r from-petal to-rose"
              initial={reduceMotion ? { scaleX: 1 } : { scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 1.1, delay: 0.35, ease: EASE }}
            />
          </span>
          <span className="whitespace-nowrap text-accent">engineering</span>
        </div>
      </div>
    </div>
  );
}
