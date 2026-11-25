import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import {
  ChevronDown,
  Info,
  Lock,
  ScrollText,
  ShieldCheck,
} from "lucide-react";
import type { ReactNode } from "react";
import { EASE, Reveal } from "../ui";

/** Sets the document title for a project page and restores it on leave. */
export function usePageMeta(title: string, description: string) {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = title;

    const meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    const previousDescription = meta?.content;
    if (meta) meta.content = description;

    return () => {
      document.title = previousTitle;
      if (meta && previousDescription !== undefined) meta.content = previousDescription;
    };
  }, [title, description]);
}

export function TechBadges({ items }: { items: readonly string[] }) {
  return (
    <ul className="flex flex-wrap gap-2" aria-label="Technology stack">
      {items.map((item, index) => (
        <motion.li
          key={item}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45 + index * 0.06, ease: EASE }}
          className="rounded-full border border-blush bg-cream/70 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-accent"
        >
          {item}
        </motion.li>
      ))}
    </ul>
  );
}

type CalloutProps = {
  title: string;
  children: ReactNode;
  tone?: "blush" | "plain";
  icon?: "info" | "lock" | "scroll";
};

/** Quiet, bordered aside used for scope, status and licensing transparency. */
export function Callout({ title, children, tone = "blush", icon = "info" }: CalloutProps) {
  const Icon = icon === "lock" ? Lock : icon === "scroll" ? ScrollText : Info;

  return (
    <div
      className={`flex gap-3.5 rounded-2xl border p-4 sm:p-5 ${
        tone === "blush"
          ? "border-blush bg-cream/70"
          : "border-blush/70 bg-surface"
      }`}
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-accent" strokeWidth={1.6} aria-hidden />
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-accent">
          {title}
        </p>
        <div className="mt-2 text-[13px] leading-[1.75] text-muted">{children}</div>
      </div>
    </div>
  );
}

type TechItem = {
  name: string;
  role: string;
  license: string;
  detail: string;
};

/** Click-to-expand technology cards — each opens its role in the project. */
export function TechCards({ items }: { items: readonly TechItem[] }) {
  const [open, setOpen] = useState<string | null>(items[0]?.name ?? null);

  return (
    <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item, index) => {
        const isOpen = open === item.name;

        return (
          <Reveal key={item.name} delay={index * 0.05}>
            <div
              className={`group h-full overflow-hidden rounded-2xl border bg-surface transition-all duration-400 ${
                isOpen
                  ? "border-petal shadow-[0_26px_50px_-40px_rgba(179,78,115,0.55)]"
                  : "border-blush hover:-translate-y-1 hover:border-petal"
              }`}
            >
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : item.name)}
                aria-expanded={isOpen}
                className="flex w-full items-start justify-between gap-3 p-4 text-left sm:p-5"
              >
                <span>
                  <span className="block font-serif text-[1.25rem] leading-tight text-ink">
                    {item.name}
                  </span>
                  <span className="mt-1.5 block text-[12.5px] leading-relaxed text-muted">
                    {item.role}
                  </span>
                  <span className="mt-3 inline-block rounded-full bg-cream px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.12em] text-accent">
                    {item.license}
                  </span>
                </span>
                <ChevronDown
                  className={`mt-1 h-4 w-4 shrink-0 text-petal transition-transform duration-300 ${
                    isOpen ? "rotate-180 text-accent" : ""
                  }`}
                  strokeWidth={1.8}
                  aria-hidden
                />
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: EASE }}
                    className="overflow-hidden"
                  >
                    <p className="border-t border-blush/70 px-4 py-3.5 text-[12.5px] leading-[1.7] text-muted sm:px-5">
                      {item.detail}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Reveal>
        );
      })}
    </div>
  );
}

type Step = {
  title: string;
  body: string;
  detail?: readonly string[];
};

/** Vertical methodology with a scroll-driven progress line. */
export function ScrollSteps({ steps }: { steps: readonly Step[] }) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 78%", "end 62%"],
  });
  const scale = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 28,
    restDelta: 0.001,
  });

  return (
    <div ref={ref} className="relative mt-12">
      <span aria-hidden className="absolute bottom-3 left-4 top-3 w-px bg-blush/80" />
      <motion.span
        aria-hidden
        style={reduceMotion ? { scaleY: 1 } : { scaleY: scale }}
        className="absolute bottom-3 left-4 top-3 w-px origin-top bg-gradient-to-b from-rose-deep via-rose to-petal"
      />

      <ol className="space-y-8">
        {steps.map((step, index) => (
          <li key={step.title}>
            <Reveal delay={index * 0.04}>
              <div className="relative pl-12 sm:pl-14">
                <span className="absolute left-0 top-0 flex h-8 w-8 items-center justify-center rounded-full border border-blush bg-surface font-mono text-[10px] text-accent">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="font-serif text-[1.35rem] leading-snug text-ink">
                  {step.title}
                </h3>
                <p className="mt-2 max-w-2xl text-[13.5px] leading-[1.75] text-muted">
                  {step.body}
                </p>
                {step.detail?.length ? (
                  <ul className="mt-3 flex flex-wrap gap-1.5">
                    {step.detail.map((item) => (
                      <li
                        key={item}
                        className="rounded-full border border-blush/80 bg-cream/60 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.08em] text-accent"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </Reveal>
          </li>
        ))}
      </ol>
    </div>
  );
}

export type AttributionRow = {
  label: string;
  value: ReactNode;
};

type CopyrightSectionProps = {
  intro: ReactNode;
  rows: readonly AttributionRow[];
  notice: ReactNode;
  status: string;
};

/** Shared legal / attribution panel with a staggered reveal. */
export function CopyrightBlock({
  intro,
  rows,
  notice,
  status,
}: CopyrightSectionProps) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="mt-12 overflow-hidden rounded-[1.8rem] border border-blush bg-cream/60">
      <div className="border-b border-blush/70 p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-accent">
            <ShieldCheck className="h-4 w-4" strokeWidth={1.6} aria-hidden />
            Attribution &amp; usage
          </p>
          <span className="rounded-full border border-petal/60 bg-surface px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.12em] text-accent">
            {status}
          </span>
        </div>
        <div className="mt-4 max-w-3xl text-[13px] leading-[1.8] text-muted">{intro}</div>
      </div>

      <motion.dl
        initial={reduceMotion ? "show" : "hidden"}
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.06 } },
        }}
        className="divide-y divide-blush/60"
      >
        {rows.map((row) => (
          <motion.div
            key={row.label}
            variants={{
              hidden: { opacity: 0, x: -12 },
              show: { opacity: 1, x: 0, transition: { duration: 0.55, ease: EASE } },
            }}
            className="grid gap-1.5 px-6 py-4 sm:grid-cols-[180px_1fr] sm:gap-6 sm:px-8"
          >
            <dt className="font-mono text-[9.5px] uppercase leading-relaxed tracking-[0.14em] text-accent">
              {row.label}
            </dt>
            <dd className="text-[12.5px] leading-[1.75] text-muted">{row.value}</dd>
          </motion.div>
        ))}
      </motion.dl>

      <div className="border-t border-blush/70 bg-surface/70 px-6 py-4 sm:px-8">
        <p className="text-[11px] leading-[1.75] text-muted">{notice}</p>
      </div>
    </div>
  );
}
