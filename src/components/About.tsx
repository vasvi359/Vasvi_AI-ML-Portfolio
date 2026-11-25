import { GraduationCap, Mic, Sparkles } from "lucide-react";
import { Reveal, SectionHeading } from "./ui";

const highlights = [
  {
    value: "2×",
    label: "Smart India Hackathon national-round qualifier",
    icon: Sparkles,
  },
  {
    value: "2",
    label: "Internships across AI/ML and backend engineering",
    icon: Mic,
  },
  {
    value: "8.2",
    label: "CGPA — B.Tech CSE (Artificial Intelligence)",
    icon: GraduationCap,
  },
];

export default function About() {
  return (
    <section id="about" className="relative bg-paper py-24 sm:py-28 lg:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          index="01"
          eyebrow="About"
          title={
            <>
              A little about <span className="italic text-accent">me.</span>
            </>
          }
          description="An engineer with a research mindset and a builder's instinct — happiest somewhere between the model and the API."
        />

        <div className="mt-14 grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div>
            <Reveal>
              <p className="text-[15.5px] leading-[1.8] text-muted">
                I&apos;m a Computer Science undergraduate pursuing a{" "}
                <span className="text-ink">
                  B.Tech in Computer Science Engineering (Artificial Intelligence)
                </span>{" "}
                at IILM University, Greater Noida, graduating in 2027.
              </p>
            </Reveal>
            <Reveal delay={0.06}>
              <p className="mt-5 text-[15.5px] leading-[1.8] text-muted">
                My interests sit at the intersection of artificial intelligence and backend
                engineering: machine learning, NLP, computer vision and RAG, built into
                practical systems rather than demos. I like the full path — shaping the model,
                designing the API, and making the result feel effortless to the person using it.
              </p>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-5 text-[15.5px] leading-[1.8] text-muted">
                Alongside coursework, I have qualified twice for the national round of Smart
                India Hackathon and completed two internships spanning AI/ML research and
                production-style backend development.
              </p>
            </Reveal>

            <Reveal delay={0.18}>
              <blockquote className="mt-9 border-l-2 border-petal pl-5">
                <p className="font-serif text-xl italic leading-relaxed text-ink sm:text-[1.4rem]">
                  &ldquo;The most interesting work happens when rigorous research meets a
                  system someone can actually use.&rdquo;
                </p>
              </blockquote>
            </Reveal>
          </div>

          <div className="flex flex-col gap-4">
            {highlights.map(({ value, label, icon: Icon }, index) => (
              <Reveal key={label} delay={index * 0.08}>
                <div className="group flex items-center gap-5 rounded-2xl border border-blush/80 bg-surface p-5 transition-all duration-500 hover:-translate-y-1 hover:border-petal hover:shadow-[0_24px_50px_-34px_rgba(179,78,115,0.55)] sm:p-6">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-cream text-accent transition-colors duration-500 group-hover:bg-rose-deep group-hover:text-white">
                    <Icon className="h-5 w-5" strokeWidth={1.5} aria-hidden />
                  </div>
                  <div className="flex items-baseline gap-4">
                    <span className="font-serif text-[2rem] leading-none text-accent">
                      {value}
                    </span>
                    <span className="text-[13.5px] leading-snug text-muted">{label}</span>
                  </div>
                </div>
              </Reveal>
            ))}

            <Reveal delay={0.26}>
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 px-1 font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
                <span>Based in India</span>
                <span className="h-1 w-1 rounded-full bg-petal" aria-hidden />
                <span>B.Tech, 2027</span>
                <span className="h-1 w-1 rounded-full bg-petal" aria-hidden />
                <span>Open to opportunities</span>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
