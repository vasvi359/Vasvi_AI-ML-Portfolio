import { BadgeCheck, CalendarDays, GraduationCap, MapPin } from "lucide-react";
import { CERTIFICATIONS } from "../data";
import { Reveal, SectionHeading } from "./ui";

export default function Education() {
  return (
    <section id="education" className="relative bg-cream py-24 sm:py-28 lg:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          index="06"
          eyebrow="Foundations"
          title={
            <>
              Education &amp;{" "}
              <span className="italic text-accent">certifications.</span>
            </>
          }
          description="A formal grounding in computer science, rounded out by focused coursework in AI."
        />

        <div className="mt-14 grid gap-4 lg:grid-cols-[1.05fr_0.95fr] lg:gap-5">
          <Reveal>
            <article className="relative h-full overflow-hidden rounded-[1.8rem] border border-blush bg-surface p-7 sm:p-9">
              <div
                aria-hidden
                className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-cream"
              />
              <div className="relative flex items-start justify-between gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cream text-accent">
                  <GraduationCap className="h-5 w-5" strokeWidth={1.6} aria-hidden />
                </div>
                <span className="font-mono text-[9.5px] uppercase tracking-[0.2em] text-accent">
                  Degree
                </span>
              </div>

              <h3 className="relative mt-6 font-serif text-[1.9rem] leading-tight text-ink">
                IILM University
              </h3>
              <p className="relative mt-2 max-w-md text-[14px] leading-relaxed text-muted">
                B.Tech — Computer Science Engineering (Artificial Intelligence)
              </p>

              <div className="relative mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" strokeWidth={1.6} aria-hidden />
                  Greater Noida, India
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="h-3.5 w-3.5" strokeWidth={1.6} aria-hidden />
                  Aug 2023 — May 2027
                </span>
              </div>

              <div className="relative mt-8 rounded-2xl border border-blush/70 bg-cream/70 p-5">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted">
                      CGPA
                    </p>
                    <p className="mt-1 font-serif text-[2.5rem] leading-none text-accent">
                      8.2 <span className="text-base text-muted">/ 10</span>
                    </p>
                  </div>
                  <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted">
                    In progress
                  </span>
                </div>
                <div
                  role="progressbar"
                  aria-valuenow={82}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="CGPA 8.2 out of 10"
                  className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-blush"
                >
                  <div className="h-full w-[82%] rounded-full bg-rose-deep" />
                </div>
              </div>
            </article>
          </Reveal>

          <div className="flex flex-col gap-3">
            {CERTIFICATIONS.map((cert, index) => (
              <Reveal key={cert.name} delay={index * 0.07}>
                <article className="group flex items-center gap-4 rounded-2xl border border-blush/80 bg-surface p-5 transition-all duration-500 hover:-translate-y-1 hover:border-petal sm:p-6">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cream text-accent transition-colors duration-500 group-hover:bg-rose-deep group-hover:text-white">
                    <BadgeCheck className="h-[18px] w-[18px]" strokeWidth={1.6} aria-hidden />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-[14px] font-medium leading-snug text-ink">
                      {cert.name}
                    </h3>
                    <p className="mt-1 font-mono text-[9.5px] uppercase tracking-[0.14em] text-muted">
                      {cert.issuer}
                    </p>
                  </div>
                  <span className="shrink-0 font-mono text-[9px] uppercase tracking-[0.12em] text-muted">
                    {cert.date}
                  </span>
                </article>
              </Reveal>
            ))}

            <Reveal delay={0.22}>
              <p className="px-1 pt-1 font-mono text-[9px] uppercase leading-relaxed tracking-[0.16em] text-muted/80">
                Certifications as listed on the resume — no additional credentials implied.
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
