import type { LucideIcon } from "lucide-react";
import { Code2, ScrollText, Sparkles, Trophy } from "lucide-react";
import { ACHIEVEMENTS } from "../data";
import { Reveal, SectionHeading } from "./ui";

const ICONS: Record<string, LucideIcon> = {
  trophy: Trophy,
  sparkle: Sparkles,
  code: Code2,
  scroll: ScrollText,
};

export default function Achievements() {
  const featured = ACHIEVEMENTS.filter((item) => item.featured);
  const rest = ACHIEVEMENTS.filter((item) => !item.featured);

  return (
    <section id="achievements" className="relative bg-paper py-24 sm:py-28 lg:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          index="05"
          eyebrow="Achievements"
          title={
            <>
              Made <span className="italic text-accent">meaningful.</span>
            </>
          }
          description="Hackathons, research and steady practice — the moments that shaped how I build."
        />

        <div className="mt-14 grid gap-4 sm:grid-cols-2">
          {featured.map((item, index) => {
            const Icon = ICONS[item.icon] ?? Trophy;
            return (
              <Reveal key={item.title} delay={index * 0.08}>
                <article className="group relative h-full overflow-hidden rounded-[1.6rem] border border-blush bg-cream/60 p-7 transition-all duration-500 hover:-translate-y-1 hover:border-petal hover:bg-cream sm:p-8">
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -bottom-8 -right-2 select-none font-serif text-[6rem] leading-none text-paper/70"
                  >
                    {item.year}
                  </span>
                  <div className="relative flex items-center justify-between gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface text-accent shadow-[0_10px_24px_-18px_rgba(52,48,57,0.6)] transition-colors duration-500 group-hover:bg-rose-deep group-hover:text-white">
                      <Icon className="h-5 w-5" strokeWidth={1.6} aria-hidden />
                    </div>
                    <span className="rounded-full border border-blush bg-surface/70 px-3 py-1 font-mono text-[9.5px] uppercase tracking-[0.16em] text-accent">
                      {item.year}
                    </span>
                  </div>
                  <h3 className="relative mt-6 max-w-[24rem] font-serif text-[1.45rem] leading-snug text-ink">
                    {item.title}
                  </h3>
                  <p className="relative mt-2.5 max-w-[26rem] text-[13px] leading-relaxed text-muted">
                    {item.description}
                  </p>
                </article>
              </Reveal>
            );
          })}
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          {rest.map((item, index) => {
            const Icon = ICONS[item.icon] ?? Trophy;
            return (
              <Reveal key={item.title} delay={index * 0.06}>
                <article className="group flex h-full flex-col rounded-[1.4rem] border border-blush/80 bg-surface p-6 transition-all duration-500 hover:-translate-y-1 hover:border-petal hover:shadow-[0_30px_50px_-40px_rgba(179,78,115,0.45)]">
                  <div className="flex items-center justify-between">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-cream text-accent transition-colors duration-500 group-hover:bg-rose-deep group-hover:text-white">
                      <Icon className="h-4 w-4" strokeWidth={1.6} aria-hidden />
                    </div>
                    <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted">
                      {item.year}
                    </span>
                  </div>
                  <h3 className="mt-4 font-serif text-[1.2rem] leading-snug text-ink">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-[12.5px] leading-relaxed text-muted">
                    {item.description}
                  </p>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
