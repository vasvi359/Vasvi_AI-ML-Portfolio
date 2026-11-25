import { useRef } from "react";
import type { CSSProperties, MouseEvent } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { ArrowUpRight, Check, Github, ScrollText } from "lucide-react";
import { PROJECTS } from "../data";
import { EASE, Reveal, SectionHeading } from "./ui";
import { Link } from "../router";

type Project = (typeof PROJECTS)[number];

function ProjectCard({ project, reverse }: { project: Project; reverse: boolean }) {
  const reduceMotion = useReducedMotion();
  const cardRef = useRef<HTMLElement>(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const rotateX = useSpring(rawX, { stiffness: 180, damping: 22 });
  const rotateY = useSpring(rawY, { stiffness: 180, damping: 22 });

  const handleMove = (event: MouseEvent<HTMLElement>) => {
    if (reduceMotion) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    rawY.set(x * 3.5);
    rawX.set(y * -3.5);
  };

  const handleLeave = () => {
    rawX.set(0);
    rawY.set(0);
  };

  return (
    <Reveal>
      <div style={{ perspective: 1400 }}>
        <Link
          to={project.detailPath}
          aria-label={`${project.name} — read the project case study`}
          className="block rounded-[1.8rem] focus-visible:outline-none"
        >
        <motion.article
          ref={cardRef}
          onMouseMove={handleMove}
          onMouseLeave={handleLeave}
          style={reduceMotion ? undefined : { rotateX, rotateY }}
          whileHover={reduceMotion ? undefined : { y: -4 }}
          transition={{ y: { duration: 0.4, ease: EASE } }}
          className="shimmer-border group grid overflow-hidden rounded-[1.8rem] border border-blush/90 bg-surface shadow-[0_30px_70px_-58px_rgba(52,48,57,0.55)] transition-shadow duration-500 hover:shadow-[0_48px_90px_-56px_rgba(179,78,115,0.5)] lg:grid-cols-2"
        >
          {/* project screenshot */}
          <div
            style={{ viewTransitionName: project.visualId } as unknown as CSSProperties}
            className={`relative flex min-h-[300px] items-center justify-center overflow-hidden bg-gradient-to-br ${project.accent} p-6 dark:from-[#241a22] dark:via-[#432c39] dark:to-[#7a4a60] sm:min-h-[360px] sm:p-8 lg:min-h-[480px] ${
              reverse ? "lg:order-last" : ""
            }`}
          >
            <div aria-hidden className="absolute inset-0 grain opacity-60" />
            <div
              aria-hidden
              className="absolute -right-16 -top-16 h-56 w-56 rounded-full border border-white/40"
            />
            <div
              aria-hidden
              className="absolute -bottom-20 -left-12 h-64 w-64 rounded-full border border-white/30"
            />

            <div className="relative w-full max-w-[30rem] overflow-hidden rounded-xl border border-white/60 bg-[#1b1520] p-1.5 shadow-[0_26px_55px_-30px_rgba(24,15,22,0.75)] transition-transform duration-700 ease-out group-hover:scale-[1.03]">
              <img
                src={project.image}
                alt={project.imageAlt}
                width={1400}
                height={788}
                loading="lazy"
                decoding="async"
                className="h-auto w-full rounded-lg border border-white/10 object-cover"
              />
            </div>

            <span className="absolute bottom-5 left-6 font-mono text-[9px] uppercase tracking-[0.22em] text-ink/45">
              Preview / {project.index}
            </span>
          </div>

          {/* content */}
          <div className="flex flex-col p-7 sm:p-9 lg:p-10">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
              Project {project.index}
            </p>
            <h3 className="mt-3 font-serif text-[2.1rem] leading-none text-ink sm:text-[2.5rem]">
              {project.name}
            </h3>
            <p className="mt-2.5 font-serif text-[1.05rem] italic text-muted">
              {project.tagline}
            </p>
            <p className="mt-5 text-[14px] leading-[1.75] text-muted">
              {project.description}
            </p>

            <motion.ul
              className="mt-6 flex flex-wrap gap-1.5"
              initial={reduceMotion ? "show" : "hidden"}
              whileInView="show"
              viewport={{ once: true, margin: "-50px" }}
              variants={{
                hidden: {},
                show: {
                  transition: { staggerChildren: 0.055, delayChildren: 0.08 },
                },
              }}
            >
              {project.stack.map((tech) => (
                <motion.li
                  key={tech}
                  variants={{
                    hidden: { opacity: 0, y: 9, scale: 0.94 },
                    show: {
                      opacity: 1,
                      y: 0,
                      scale: 1,
                      transition: { duration: 0.45, ease: EASE },
                    },
                  }}
                  className="rounded-full border border-blush bg-cream/60 px-2.5 py-1 font-mono text-[9.5px] uppercase tracking-[0.08em] text-accent"
                >
                  {tech}
                </motion.li>
              ))}
            </motion.ul>

            <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
              {project.features.map((feature) => (
                <li key={feature} className="flex gap-2.5">
                  <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-blush text-accent">
                    <Check className="h-2.5 w-2.5" strokeWidth={2.6} aria-hidden />
                  </span>
                  <span className="text-[12.5px] leading-relaxed text-muted">{feature}</span>
                </li>
              ))}
            </ul>

            {project.highlight && (
              <div className="mt-6 flex gap-3 rounded-xl border border-blush bg-cream/70 p-3.5">
                <ScrollText
                  className="mt-0.5 h-4 w-4 shrink-0 text-accent"
                  strokeWidth={1.6}
                  aria-hidden
                />
                <p className="text-[11.5px] leading-relaxed text-muted">{project.highlight}</p>
              </div>
            )}

            <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-7">
              {project.github ? (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="group/link inline-flex items-center gap-2 text-sm font-medium text-ink transition-colors hover:text-accent"
                >
                  <Github className="h-4 w-4" strokeWidth={1.7} aria-hidden />
                  View on GitHub
                  <ArrowUpRight
                    className="h-4 w-4 transition-transform duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
                    strokeWidth={1.7}
                    aria-hidden
                  />
                </a>
              ) : (
                <span
                  title="Repository URL not provided — placeholder"
                  className="inline-flex cursor-not-allowed items-center gap-2 rounded-full border border-dashed border-blush px-4 py-2 font-mono text-[9.5px] uppercase tracking-[0.14em] text-muted"
                >
                  <Github className="h-3.5 w-3.5" strokeWidth={1.6} aria-hidden />
                  GitHub link — available on request
                </span>
              )}
              <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-ink transition-colors duration-300 group-hover:text-accent">
                Read case study
                <ArrowUpRight
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  strokeWidth={1.7}
                  aria-hidden
                />
              </span>
            </div>
          </div>
        </motion.article>
        </Link>
      </div>
    </Reveal>
  );
}

export default function Projects() {
  return (
    <section id="projects" className="relative bg-cream py-24 sm:py-28 lg:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          index="04"
          eyebrow="Selected work"
          title={
            <>
              Projects with <span className="italic text-accent">intent.</span>
            </>
          }
          description="Two systems that show how I think: one grounded in documents, one trained on language."
        />

        <div className="mt-14 space-y-8 sm:space-y-10">
          {PROJECTS.map((project, index) => (
            <ProjectCard key={project.name} project={project} reverse={index % 2 === 1} />
          ))}
        </div>

        <Reveal delay={0.1}>
          <p className="mt-6 max-w-2xl font-mono text-[9.5px] uppercase leading-relaxed tracking-[0.16em] text-muted/80">
            Project previews are the supplied dashboard screenshots. Metrics and repository
            links remain unclaimed, rather than invented.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
