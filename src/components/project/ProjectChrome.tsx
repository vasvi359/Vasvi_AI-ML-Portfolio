import type { CSSProperties, ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import Nav from "../Nav";
import { Link } from "../../router";
import { EASE, SocialLinks } from "../ui";
import { WordReveal } from "../motion-kit";
import { TechBadges } from "./blocks";

type Crumb = { label: string; to?: string };

function Breadcrumb({ items }: { items: readonly Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-2 font-mono text-[9.5px] uppercase tracking-[0.16em] text-muted">
        {items.map((item, index) => {
          const last = index === items.length - 1;
          return (
            <li key={item.label} className="flex items-center gap-2">
              {index > 0 && (
                <span className="text-petal" aria-hidden>
                  /
                </span>
              )}
              {item.to && !last ? (
                <Link
                  to={item.to}
                  className="rounded-sm transition-colors hover:text-accent"
                >
                  {item.label}
                </Link>
              ) : (
                <span aria-current={last ? "page" : undefined} className="text-accent">
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/** Decorative project plate. Deliberately not presented as a screenshot. */
export function ProjectPlate({
  index,
  variant,
  transitionName,
}: {
  index: string;
  variant: "edumind" | "sarcasm";
  transitionName?: string;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, scale: 0.95, y: 22 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.25, ease: EASE }}
      className="relative mx-auto w-full max-w-[26rem] lg:max-w-none"
    >
      <div
        aria-hidden
        className="absolute -inset-5 rounded-[2.4rem] bg-cream/80 sm:-inset-6"
      />
      <div
        className="relative aspect-[4/4.2] overflow-hidden rounded-[2rem] border border-blush bg-gradient-to-br from-cream via-blush to-petal p-6 shadow-[0_46px_80px_-54px_rgba(179,78,115,0.6)] dark:from-[#241a22] dark:via-[#3d2a36] dark:to-[#7a4a60] sm:p-7"
        style={
          transitionName
            ? ({ viewTransitionName: transitionName } as unknown as CSSProperties)
            : undefined
        }
      >
        <div aria-hidden className="absolute inset-0 grain opacity-60" />
        <div
          aria-hidden
          className="absolute -right-14 -top-16 h-52 w-52 rounded-full border border-white/40"
        />
        <div
          aria-hidden
          className="absolute -bottom-20 -left-14 h-64 w-64 rounded-full border border-white/30"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute -left-1 top-2 select-none font-serif text-[8rem] leading-none text-white/40 sm:text-[9.5rem]"
        >
          {index}
        </span>

        <div className="relative flex h-full flex-col justify-between pt-20 sm:pt-24">
          {variant === "edumind" ? <EduMindMotif /> : <SarcasmMotif />}

          <p className="mt-6 font-mono text-[8.5px] uppercase leading-relaxed tracking-[0.16em] text-ink/50">
            Illustrative diagram — not a product screenshot
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function EduMindMotif() {
  const rows = [
    { label: "Retrieve", tag: "ChromaDB" },
    { label: "Reason", tag: "LangChain" },
    { label: "Assess", tag: "Evaluator" },
  ];

  return (
    <div className="relative rounded-2xl border border-white/70 bg-surface/55 p-4 backdrop-blur-sm">
      <span aria-hidden className="absolute bottom-6 left-[26px] top-6 w-px border-l border-dashed border-rose/40" />
      <div className="space-y-2.5">
        {rows.map((row, index) => (
          <motion.div
            key={row.label}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 + index * 0.14, ease: EASE }}
            className="relative flex items-center gap-3 rounded-xl border border-blush/80 bg-surface/90 px-3 py-2.5"
          >
            <span className="relative flex h-2 w-2" aria-hidden>
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose opacity-50" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-rose-deep" />
            </span>
            <span className="text-[12px] font-medium text-ink">{row.label}</span>
            <span className="ml-auto font-mono text-[8.5px] uppercase tracking-[0.12em] text-muted">
              {row.tag}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function SarcasmMotif() {
  const tokens = ["literal", "vs", "figurative", "intent"];

  return (
    <div className="rounded-2xl border border-white/70 bg-surface/55 p-4 backdrop-blur-sm">
      <div className="flex flex-wrap gap-1.5">
        {tokens.map((token, index) => (
          <motion.span
            key={token}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 + index * 0.1, ease: EASE }}
            className="rounded-md border border-blush bg-surface/90 px-2 py-1 font-mono text-[9.5px] text-accent"
          >
            {token}
          </motion.span>
        ))}
      </div>

      <div className="mt-4 space-y-3">
        {[
          { label: "literal reading", width: "38%" },
          { label: "figurative reading", width: "78%" },
        ].map((bar, index) => (
          <div key={bar.label}>
            <p className="font-mono text-[8px] uppercase tracking-[0.14em] text-ink/50">
              {bar.label}
            </p>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-surface/70">
              <motion.span
                initial={{ width: 0 }}
                animate={{ width: bar.width }}
                transition={{ duration: 1, delay: 0.9 + index * 0.15, ease: EASE }}
                className="block h-full rounded-full bg-gradient-to-r from-petal to-rose-deep"
              />
            </div>
          </div>
        ))}
      </div>
      <p className="mt-3 font-mono text-[8px] uppercase tracking-[0.12em] text-ink/45">
        Conceptual — no measured values shown
      </p>
    </div>
  );
}

type ProjectHeroProps = {
  index: string;
  eyebrow: string;
  name: string;
  titleLines: readonly string[];
  summary: string;
  tags: readonly string[];
  meta: readonly { label: string; value: string }[];
  variant: "edumind" | "sarcasm";
  transitionName: string;
  children?: ReactNode;
};

export function ProjectHero({
  index,
  eyebrow,
  name,
  titleLines,
  summary,
  tags,
  meta,
  variant,
  transitionName,
  children,
}: ProjectHeroProps) {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden pt-28 pb-16 sm:pt-32 sm:pb-20">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -right-32 top-10 h-[420px] w-[420px] rounded-full bg-blush/40 blur-3xl animate-float-slow" />
        <div className="absolute -left-40 bottom-0 h-[300px] w-[300px] rounded-full bg-cream blur-3xl" />
        <div className="absolute left-[6%] top-[42%] h-2 w-2 rounded-full bg-petal/70 animate-float" />
      </div>

      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Breadcrumb
          items={[
            { label: "vasvi", to: "/" },
            { label: "Projects", to: "/#projects" },
            { label: name },
          ]}
        />

        <div className="mt-9 grid items-center gap-12 lg:grid-cols-[1.06fr_0.94fr] lg:gap-12">
          <div>
            <motion.p
              initial={reduceMotion ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE }}
              className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.22em] text-accent"
            >
              <span className="h-px w-8 bg-petal" aria-hidden />
              {index} — {eyebrow}
            </motion.p>

            <h1 className="mt-5 text-balance font-serif text-[3rem] leading-[0.98] tracking-[-0.02em] text-ink sm:text-[3.9rem] lg:text-[4.3rem]">
              <span className="block">
                <WordReveal
                  delay={0.12}
                  stagger={0.06}
                  label={name}
                  words={name.split(" ").map((word) => ({ text: word }))}
                />
              </span>
              {titleLines.map((line, index) => (
                <span
                  key={line}
                  className={`mt-2 block font-serif text-[1.35rem] leading-[1.25] italic text-accent sm:text-[1.6rem] ${
                    index === 0 ? "" : "mt-1"
                  }`}
                >
                  <WordReveal
                    delay={0.35 + index * 0.1}
                    stagger={0.05}
                    label={line}
                    words={line.split(" ").map((word) => ({ text: word }))}
                  />
                </span>
              ))}
            </h1>

            <motion.p
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: EASE }}
              className="mt-6 max-w-[36rem] text-[15px] leading-[1.8] text-muted sm:text-base"
            >
              {summary}
            </motion.p>

            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease: EASE }}
              className="mt-7"
            >
              <TechBadges items={tags} />
            </motion.div>

            <motion.dl
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: EASE }}
              className="mt-8 grid gap-x-8 gap-y-4 border-t border-blush/70 pt-6 sm:grid-cols-2"
            >
              {meta.map((item) => (
                <div key={item.label}>
                  <dt className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted">
                    {item.label}
                  </dt>
                  <dd className="mt-1.5 text-[13px] leading-snug text-ink">{item.value}</dd>
                </div>
              ))}
            </motion.dl>

            {children}
          </div>

          <ProjectPlate index={index} variant={variant} transitionName={transitionName} />
        </div>
      </div>
    </section>
  );
}

type ProjectSectionProps = {
  id: string;
  index: string;
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  tone?: "white" | "cream";
  className?: string;
};

/** Consistent section frame for both case studies. */
export function ProjectSection({
  id,
  index,
  eyebrow,
  title,
  description,
  children,
  tone = "white",
  className = "",
}: ProjectSectionProps) {
  return (
    <section
      id={id}
      className={`relative scroll-mt-24 py-16 sm:py-20 ${
        tone === "cream" ? "bg-cream" : "bg-paper"
      } ${className}`}
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-petal" aria-hidden />
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
                {index} — {eyebrow}
              </p>
            </div>
            <h2 className="mt-4 text-balance font-serif text-[2.1rem] leading-[1.1] text-ink sm:text-[2.65rem]">
              {title}
            </h2>
          </div>
          {description ? (
            <p className="max-w-sm text-[13.5px] leading-[1.75] text-muted md:pb-2">
              {description}
            </p>
          ) : null}
        </div>
        <div className="mt-10">{children}</div>
      </div>
    </section>
  );
}

type ProjectNavProps = {
  previous?: { name: string; to: string; index: string };
  next?: { name: string; to: string; index: string };
};

export function ProjectFooterNav({ previous, next }: ProjectNavProps) {
  return (
    <section className="border-t border-blush/70 bg-paper py-14 sm:py-16">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-[9.5px] uppercase tracking-[0.2em] text-muted">
              Continue exploring
            </p>
            <Link
              to="/#projects"
              className="group mt-3 inline-flex items-center gap-2 font-serif text-[1.6rem] text-ink transition-colors hover:text-accent sm:text-[1.9rem]"
            >
              <ArrowLeft
                className="h-5 w-5 text-petal transition-transform duration-300 group-hover:-translate-x-1"
                strokeWidth={1.6}
                aria-hidden
              />
              Back to all projects
            </Link>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            {previous && (
              <Link
                to={previous.to}
                className="group flex min-w-[15rem] flex-col rounded-2xl border border-blush bg-cream/50 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-petal hover:bg-cream"
              >
                <span className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.16em] text-muted">
                  <ArrowLeft className="h-3 w-3" strokeWidth={2} aria-hidden />
                  Previous · {previous.index}
                </span>
                <span className="mt-2 flex items-center justify-between gap-4 font-serif text-[1.2rem] text-ink">
                  {previous.name}
                  <ArrowUpRight
                    className="h-4 w-4 text-petal transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    strokeWidth={1.6}
                    aria-hidden
                  />
                </span>
              </Link>
            )}
            {next && (
              <Link
                to={next.to}
                className="group flex min-w-[15rem] flex-col rounded-2xl border border-blush bg-cream/50 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-petal hover:bg-cream"
              >
                <span className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.16em] text-muted">
                  Next · {next.index}
                  <ArrowRight className="h-3 w-3" strokeWidth={2} aria-hidden />
                </span>
                <span className="mt-2 flex items-center justify-between gap-4 font-serif text-[1.2rem] text-ink">
                  {next.name}
                  <ArrowUpRight
                    className="h-4 w-4 text-petal transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    strokeWidth={1.6}
                    aria-hidden
                  />
                </span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export function ProjectShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen overflow-x-hidden bg-paper text-ink">
      <a
        href="#main"
        className="pointer-events-none fixed left-5 top-4 z-[60] -translate-y-24 rounded-full bg-ink px-4 py-2 text-sm text-white transition-transform duration-200 focus:pointer-events-auto focus:translate-y-0"
      >
        Skip to content
      </a>
      <Nav homeLinks />
      <main id="main">{children}</main>
      <footer className="border-t border-blush/70 bg-cream/60 py-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted">
            © Vasvi Bali · Project case study
          </p>
          <SocialLinks />
          <Link
            to="/"
            className="group inline-flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.16em] text-accent"
          >
            Back to portfolio
            <ArrowUpRight
              className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              strokeWidth={1.8}
              aria-hidden
            />
          </Link>
        </div>
      </footer>
    </div>
  );
}
