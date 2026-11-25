import { useEffect, useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { MapPin } from "lucide-react";
import { EXPERIENCE } from "../data";
import { Reveal, SectionHeading } from "./ui";

export default function Experience() {
  const reduceMotion = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const [trackHeight, setTrackHeight] = useState(0);

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start 74%", "end 58%"],
  });
  const lineScale = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 28,
    restDelta: 0.001,
  });
  const lineProgress = useTransform(lineScale, (value) =>
    Math.min(Math.max(value, 0), 1),
  );
  const headY = useTransform(
    lineProgress,
    (value) => value * Math.max(trackHeight - 16, 0),
  );

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const observer = new ResizeObserver(([entry]) => {
      setTrackHeight(entry.contentRect.height);
    });

    observer.observe(track);
    setTrackHeight(track.getBoundingClientRect().height);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="experience" className="relative bg-paper py-24 sm:py-28 lg:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          index="03"
          eyebrow="Experience"
          title={
            <>
              Where I&apos;ve <span className="italic text-accent">built.</span>
            </>
          }
          description="Two internships, one thread: taking AI from experiment to a working product surface."
        />

        <div ref={trackRef} className="relative mt-14 sm:mt-16">
          <span
            aria-hidden
            className="absolute bottom-2 left-[6px] top-2 w-px bg-blush/70"
          />
          <motion.span
            aria-hidden
            style={reduceMotion ? undefined : { scaleY: lineProgress }}
            className="absolute bottom-2 left-[6px] top-2 w-px origin-top bg-gradient-to-b from-rose-deep via-rose to-petal"
          />
          {!reduceMotion && (
            <motion.span
              aria-hidden
              style={{ y: headY }}
              className="absolute left-[6px] top-2 z-10 block h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-rose-deep shadow-[0_0_0_4px_var(--color-cream),0_0_18px_4px_rgba(217,111,150,0.45)]"
            />
          )}

          <div className="space-y-10 sm:space-y-12">
            {EXPERIENCE.map((job, index) => (
              <Reveal key={job.company} delay={index * 0.08}>
                <div className="relative pl-9 sm:pl-12">
                  <motion.span
                    aria-hidden
                    initial={reduceMotion ? { scale: 1, opacity: 1 } : { scale: 0.4, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                    className={`absolute left-0 top-[26px] flex h-[13px] w-[13px] items-center justify-center rounded-full border-2 ${
                      job.current
                        ? "border-rose bg-rose-deep"
                        : "border-petal bg-surface"
                    }`}
                  >
                    <span className="milestone-glow absolute -inset-3 rounded-full" />
                    {job.current && (
                      <span className="absolute inset-0 animate-ping rounded-full bg-rose opacity-40" />
                    )}
                  </motion.span>

                  <article className="group rounded-[1.6rem] border border-blush/80 bg-surface p-6 transition-all duration-500 hover:border-petal hover:shadow-[0_34px_60px_-42px_rgba(179,78,115,0.5)] sm:p-8">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
                      <div>
                        <h3 className="font-serif text-[1.65rem] leading-tight text-ink sm:text-[1.9rem]">
                          {job.company}
                        </h3>
                        <p className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted">
                          <span className="font-medium text-accent">{job.role}</span>
                          <span className="text-petal" aria-hidden>
                            /
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5" strokeWidth={1.6} aria-hidden />
                            {job.place}
                          </span>
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        {job.current && (
                          <span className="rounded-full bg-cream px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.14em] text-accent">
                            Current
                          </span>
                        )}
                        <span className="rounded-full border border-blush px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
                          {job.period}
                        </span>
                      </div>
                    </div>

                    <ul className="mt-6 space-y-3.5">
                      {job.points.map((point) => (
                        <li key={point} className="flex gap-3.5">
                          <span
                            aria-hidden
                            className="mt-[9px] h-px w-3 shrink-0 bg-petal transition-all duration-300 group-hover:w-5 group-hover:bg-rose"
                          />
                          <p className="text-[14px] leading-[1.7] text-muted">{point}</p>
                        </li>
                      ))}
                    </ul>
                  </article>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
