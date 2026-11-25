import { BrainCircuit, Code2, Layers3, Server, Sparkles, Wrench } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { SKILL_GROUPS } from "../data";
import { Reveal, SectionHeading } from "./ui";
import SkillConstellation from "./SkillConstellation";

const ICONS: Record<string, LucideIcon> = {
  code: Code2,
  layers: Layers3,
  server: Server,
  brain: BrainCircuit,
  sparkles: Sparkles,
  wrench: Wrench,
};

const ALL_SKILLS = Array.from(new Set(SKILL_GROUPS.flatMap((group) => group.items)));

function SkillRibbon({ reverse = false }: { reverse?: boolean }) {
  return (
    <div className="relative flex overflow-hidden py-2.5">
      <div
        className={`flex w-max items-center ${
          reverse ? "animate-marquee-reverse" : "animate-marquee"
        }`}
      >
        {[0, 1].map((copy) => (
          <ul
            key={copy}
            aria-hidden={copy === 1}
            className="flex items-center gap-3 pr-3"
          >
            {ALL_SKILLS.map((skill) => (
              <li
                key={`${copy}-${skill}`}
                className="flex items-center gap-3 whitespace-nowrap"
              >
                <span className="rounded-full border border-blush bg-surface/80 px-3.5 py-1.5 font-mono text-[9.5px] uppercase tracking-[0.14em] text-muted">
                  {skill}
                </span>
                <span aria-hidden className="h-1 w-1 rounded-full bg-petal/70" />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}

export default function Skills() {
  return (
    <section id="skills" className="relative overflow-hidden bg-cream py-24 sm:py-28 lg:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-0 h-80 w-80 rounded-full bg-blush/60 blur-3xl"
      />

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          index="02"
          eyebrow="Skills"
          title={
            <>
              Technical <span className="italic text-accent">skills.</span>
            </>
          }
          description="The languages, models and tools I work with — from algorithms on paper to APIs in production."
        />
      </div>

      {/* infinite technology marquee */}
      <div className="relative mt-12 border-y border-blush/70 bg-surface/45">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-cream to-transparent sm:w-24"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-cream to-transparent sm:w-24"
        />
        <SkillRibbon />
        <div aria-hidden className="mx-auto h-px w-[92%] bg-blush/60" />
        <div className="hidden sm:block">
          <SkillRibbon reverse />
        </div>
      </div>

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <SkillConstellation />

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {SKILL_GROUPS.map((group, index) => {
            const Icon = ICONS[group.icon] ?? Code2;
            return (
              <Reveal key={group.id} delay={index * 0.05} className="h-full">
                <article className="group relative h-full overflow-hidden rounded-[1.4rem] border border-blush/90 bg-surface p-6 transition-all duration-500 hover:-translate-y-1.5 hover:border-petal hover:shadow-[0_34px_60px_-40px_rgba(179,78,115,0.55)] sm:p-7">
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-cream opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
                  />
                  <div className="relative flex items-start justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-cream text-accent transition-all duration-500 group-hover:bg-rose-deep group-hover:text-white">
                      <Icon className="h-5 w-5" strokeWidth={1.6} aria-hidden />
                    </div>
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-petal">
                      0{index + 1}
                    </span>
                  </div>

                  <h3 className="relative mt-6 font-serif text-[1.6rem] leading-none text-ink">
                    {group.title}
                  </h3>
                  <p className="relative mt-2 text-xs text-muted">{group.blurb}</p>

                  <ul className="relative mt-5 flex flex-wrap gap-2">
                    {group.items.map((skill) => (
                      <li key={skill}>
                        <span className="inline-block cursor-default rounded-full border border-blush bg-surface px-3 py-1.5 text-[11.5px] text-muted transition-all duration-300 hover:border-petal hover:bg-blush hover:text-ink group-hover:border-blush">
                          {skill}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <span
                    aria-hidden
                    className="absolute inset-x-0 bottom-0 h-[2px] scale-x-0 bg-gradient-to-r from-petal via-rose to-petal transition-transform duration-500 group-hover:scale-x-100"
                  />
                </article>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={0.1}>
          <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
            Also comfortable with model evaluation, benchmarking, and probability &amp;
            statistics.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
