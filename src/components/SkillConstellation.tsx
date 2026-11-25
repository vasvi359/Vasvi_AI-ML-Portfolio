import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { EASE } from "./motion-kit";
import { SKILL_DETAILS } from "../data";

type Node = {
  id: string;
  label: string;
  group: string;
  /** Virgo star this node is pinned to. */
  star: string;
  x: number;
  y: number;
  /** Spica, the brightest star in Virgo, anchors the stack. */
  featured?: boolean;
};

/**
 * Node positions follow the Virgo asterism: the two arms run left through
 * Zaniah/Zavijava and up through Auva/Vindemiatrix from the Porrima vertex,
 * the stem drops through Theta to Spica, then the eastern leg trails out
 * through Heze, Syrma and Rijl al Awwa.
 */
const NODES: Node[] = [
  { id: "mysql", label: "MySQL", group: "Backend", star: "Zavijava", x: 76, y: 214 },
  { id: "docker", label: "Docker", group: "Backend", star: "Zaniah", x: 172, y: 244 },
  { id: "fastapi", label: "FastAPI", group: "Backend", star: "Porrima", x: 256, y: 266 },
  { id: "chromadb", label: "ChromaDB", group: "Tools", star: "Auva", x: 302, y: 196 },
  { id: "langchain", label: "LangChain", group: "Tools", star: "Vindemiatrix", x: 342, y: 96 },
  { id: "rag", label: "RAG", group: "AI & Data", star: "Theta", x: 332, y: 308 },
  { id: "python", label: "Python", group: "Programming", star: "Spica", x: 398, y: 372, featured: true },
  { id: "nlp", label: "NLP", group: "AI & Data", star: "Heze", x: 454, y: 256 },
  { id: "pytorch", label: "PyTorch", group: "AI / ML", star: "Syrma", x: 534, y: 310 },
  { id: "tensorflow", label: "TensorFlow", group: "AI / ML", star: "Rijl al Awwa", x: 614, y: 332 },
];

const SPICA = NODES.find((node) => node.featured)!;

const EDGES: Array<[string, string]> = [
  ["mysql", "docker"],
  ["docker", "fastapi"],
  ["fastapi", "chromadb"],
  ["chromadb", "langchain"],
  ["fastapi", "rag"],
  ["rag", "python"],
  ["python", "nlp"],
  ["nlp", "pytorch"],
  ["pytorch", "tensorflow"],
];

/** Scattered background stars so the chart reads as a sky, not a diagram. */
const BACKDROP_STARS = [
  { x: 44, y: 96, r: 1.1, o: 0.5 },
  { x: 118, y: 358, r: 0.9, o: 0.4 },
  { x: 152, y: 74, r: 1.4, o: 0.55 },
  { x: 226, y: 400, r: 1, o: 0.35 },
  { x: 284, y: 56, r: 0.9, o: 0.4 },
  { x: 356, y: 430, r: 1.2, o: 0.45 },
  { x: 430, y: 88, r: 1, o: 0.35 },
  { x: 486, y: 182, r: 0.9, o: 0.4 },
  { x: 512, y: 404, r: 1.3, o: 0.5 },
  { x: 574, y: 148, r: 1, o: 0.35 },
  { x: 632, y: 236, r: 1.1, o: 0.45 },
  { x: 664, y: 372, r: 0.9, o: 0.4 },
  { x: 660, y: 78, r: 1.2, o: 0.5 },
  { x: 208, y: 168, r: 0.8, o: 0.3 },
];

function pointOf(id: string) {
  const node = NODES.find((item) => item.id === id);
  return node ? { x: node.x, y: node.y } : { x: 0, y: 0 };
}

export default function SkillConstellation() {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState<string | null>(null);

  const activeNode = NODES.find((node) => node.id === active) ?? null;
  const activeDetail = active ? SKILL_DETAILS[active] : null;

  const isConnected = (id: string) =>
    EDGES.some((edge) => edge.includes(id) && edge.includes(active ?? ""));

  return (
    <div
      className="relative mt-14 overflow-hidden rounded-[1.8rem] border border-blush/80 bg-surface/70 p-4 backdrop-blur-sm sm:p-6"
      onPointerLeave={(event) => {
        if (event.pointerType === "mouse") setActive(null);
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute right-1/4 top-0 h-56 w-56 -translate-y-1/3 rounded-full bg-cream blur-3xl"
      />

      <div className="relative flex items-center justify-between gap-4 px-1 pb-2">
        <p className="font-mono text-[9.5px] uppercase tracking-[0.2em] text-muted">
          Virgo tech constellation
        </p>
        <p className="hidden font-mono text-[9px] uppercase tracking-[0.18em] text-petal sm:block">
          10 technologies · one stack
        </p>
      </div>

      <div className="relative mt-1 grid gap-5 lg:grid-cols-[1.55fr_1fr] lg:items-center">
        <div className="relative aspect-[700/470] w-full">
          <svg aria-hidden viewBox="0 0 700 470" className="h-full w-full overflow-visible">
            <defs>
              <radialGradient id="spicaGlow">
                <stop offset="0%" stopColor="#efa9c0" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#efa9c0" stopOpacity="0" />
              </radialGradient>
            </defs>

            <g
              style={{
                filter: active ? "blur(2.2px)" : "none",
                opacity: active ? 0.5 : 1,
                transition: "filter 0.4s ease, opacity 0.4s ease",
              }}
            >
              {BACKDROP_STARS.map((star, index) => (
                <circle
                  key={`bg-${index}`}
                  cx={star.x}
                  cy={star.y}
                  r={star.r}
                  fill="var(--color-rose)"
                  fillOpacity={star.o}
                />
              ))}
            </g>

            <motion.circle
              cx={SPICA.x}
              cy={SPICA.y}
              r="78"
              fill="url(#spicaGlow)"
              style={{
                filter: active && active !== "python" ? "blur(3px)" : "none",
                opacity: active && active !== "python" ? 0.4 : 1,
                transition: "filter 0.4s ease, opacity 0.4s ease",
              }}
              initial={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 1, delay: 0.2, ease: EASE }}
            />

            {EDGES.map(([a, b], index) => {
              const from = pointOf(a);
              const to = pointOf(b);
              const highlighted = Boolean(active) && (a === active || b === active);

              return (
                <motion.line
                  key={`${a}-${b}`}
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                  stroke={highlighted ? "var(--color-accent)" : "var(--color-petal)"}
                  strokeOpacity={active ? (highlighted ? 0.95 : 0.35) : 0.5}
                  strokeWidth={highlighted ? 1.7 : 1}
                  strokeLinecap="round"
                  style={{
                    transition: "stroke-opacity 0.4s ease, stroke 0.4s ease, filter 0.4s ease",
                    filter: active && !highlighted ? "blur(2.2px)" : "none",
                  }}
                  initial={reduceMotion ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
                  whileInView={{ pathLength: 1, opacity: 1 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.9, delay: 0.1 + index * 0.06, ease: EASE }}
                />
              );
            })}

            {NODES.map((node, index) => {
              const highlighted = active === node.id;
              const related = Boolean(active) && isConnected(node.id);
              const dimmed = Boolean(active) && !highlighted && !related;
              const radius = node.featured ? 8 : 6;

              return (
                <motion.g
                  key={node.id}
                  initial={reduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.6 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.35 + index * 0.05, ease: EASE }}
                  style={{ transformOrigin: `${node.x}px ${node.y}px`, cursor: "pointer" }}
                  onPointerEnter={() => setActive(node.id)}
                  onPointerDown={() => setActive(node.id)}
                >
                  <g
                    style={{
                      opacity: dimmed ? 0.35 : 1,
                      filter: active && !highlighted ? "blur(2.2px)" : "none",
                      transition: "opacity 0.4s ease, filter 0.4s ease",
                    }}
                  >
                    <circle cx={node.x} cy={node.y} r="22" fill="transparent" />
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={highlighted ? radius + 3 : radius}
                      fill={highlighted ? "var(--color-rose-deep)" : "var(--color-surface)"}
                      stroke={
                        highlighted
                          ? "var(--color-petal)"
                          : node.featured
                            ? "var(--color-rose)"
                            : "var(--color-petal)"
                      }
                      strokeWidth={node.featured ? 2 : 1.5}
                      style={{ transition: "r 0.25s ease, fill 0.25s ease" }}
                    />
                    {node.featured && !highlighted && (
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r="16"
                        fill="none"
                        stroke="var(--color-petal)"
                        strokeOpacity="0.55"
                        strokeDasharray="1.5 4"
                      />
                    )}
                    {highlighted && (
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={radius + 9}
                        fill="none"
                        stroke="var(--color-rose)"
                        strokeOpacity="0.45"
                        strokeDasharray="2 3"
                      />
                    )}
                    <text
                      x={node.x}
                      y={node.y + 26}
                      textAnchor="middle"
                      className={`hidden sm:block font-mono uppercase ${
                        highlighted ? "fill-ink" : "fill-muted"
                      }`}
                      fontSize="10"
                      letterSpacing="1.4"
                    >
                      {node.label}
                    </text>
                  </g>
                </motion.g>
              );
            })}
          </svg>
        </div>

        <div className="relative flex min-h-[168px] flex-col justify-center rounded-2xl border border-blush/70 bg-surface/60 p-4 sm:p-5 lg:min-h-[268px]">
          <AnimatePresence mode="wait" initial={false}>
            {activeNode && activeDetail ? (
              <motion.div
                key={activeNode.id}
                initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? { opacity: 1 } : { opacity: 0, y: -8 }}
                transition={{ duration: 0.3, ease: EASE }}
              >
                <p className="font-mono text-[8.5px] uppercase tracking-[0.2em] text-petal">
                  {activeNode.star} · {activeNode.group}
                </p>
                <h3 className="mt-1 font-serif text-2xl italic leading-none text-ink">
                  {activeNode.label}
                </h3>
                <p className="mt-2.5 text-[12.5px] leading-relaxed text-ink/80">
                  {activeDetail.summary}
                </p>
                <ul className="mt-3 space-y-2.5">
                  {activeDetail.evidence.map((item) => (
                    <li key={item.where}>
                      <p className="font-mono text-[8.5px] uppercase tracking-[0.16em] text-accent">
                        {item.where}
                      </p>
                      <p className="mt-0.5 text-[12px] leading-relaxed text-muted">{item.text}</p>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ) : (
              <motion.div
                key="idle"
                initial={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.25, ease: EASE }}
              >
                <p className="font-mono text-[8.5px] uppercase tracking-[0.2em] text-petal">
                  Virgo · 10 stars
                </p>
                <p className="mt-2 font-serif text-xl italic leading-snug text-ink">
                  Hover or tap a star to see where it&apos;s been used.
                </p>
                <p className="mt-2 text-[12px] leading-relaxed text-muted">
                  Each point is a technology; each line, the work it connects to — internships,
                  projects and research.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
