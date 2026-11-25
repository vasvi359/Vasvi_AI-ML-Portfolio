import { ArrowUp, ArrowUpRight, Github, Linkedin, Mail, Phone } from "lucide-react";
import { SOCIALS } from "../data";
import { Reveal, SocialLinks, Sparkle } from "./ui";
import { HandUnderline, WordReveal } from "./motion-kit";

const channels = [
  {
    label: "Email",
    value: SOCIALS.email,
    href: `mailto:${SOCIALS.email}`,
    Icon: Mail,
    external: false,
  },
  {
    label: "LinkedIn",
    value: "linkedin.com/in/vasvi-bali",
    href: SOCIALS.linkedin,
    Icon: Linkedin,
    external: true,
  },
  {
    label: "GitHub",
    value: "github.com/vasvibali",
    href: SOCIALS.github,
    Icon: Github,
    external: true,
  },
  {
    label: "Phone",
    value: SOCIALS.phone,
    href: `tel:${SOCIALS.phoneHref}`,
    Icon: Phone,
    external: false,
  },
];

export default function Contact() {
  return (
    <section id="contact" className="relative bg-paper pb-10 pt-20 sm:pt-24 lg:pt-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-[1.8rem] bg-rose-deep px-6 py-12 text-white sm:rounded-[2.5rem] sm:px-10 sm:py-14 lg:px-16 lg:py-16">
            <div aria-hidden className="pointer-events-none absolute inset-0">
              <div className="absolute -right-24 -top-32 h-80 w-80 rounded-full border border-white/15" />
              <div className="absolute -right-10 top-10 h-52 w-52 rounded-full bg-blush/20 blur-2xl" />
              <div className="absolute -bottom-24 left-1/3 h-64 w-64 rounded-full border border-white/10" />
              <div className="absolute inset-0 grain opacity-[0.15]" />
              <span className="absolute -bottom-10 right-4 select-none font-serif text-[10rem] italic leading-none text-white/[0.06] sm:text-[14rem]">
                AI
              </span>
            </div>

            <div className="relative grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
              <div>
                <div className="flex items-center gap-3">
                  <span className="h-px w-8 bg-surface/40" aria-hidden />
                  <p className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-[#f8dce5]">
                    07 — Contact
                  </p>
                </div>
                <h2 className="mt-5 max-w-xl text-balance font-serif text-[2.6rem] leading-[1.06] text-white sm:text-[3.2rem] lg:text-[3.75rem]">
                  <WordReveal
                    mode="view"
                    delay={0.05}
                    stagger={0.08}
                    label="Let's build something intelligent together."
                    words={[
                      { text: "Let’s" },
                      { text: "build" },
                      { text: "something" },
                      {
                        node: (
                          <span className="relative inline-block italic text-[#f8dce5]">
                            intelligent
                            <HandUnderline
                              delay={0.55}
                              className="absolute -bottom-1.5 left-0 h-2.5 w-full text-[#f8dce5]/70"
                            />
                          </span>
                        ),
                      },
                      { text: "together." },
                    ]}
                  />
                </h2>
                <p className="mt-5 max-w-md text-[14.5px] leading-[1.75] text-white/85">
                  I&apos;m open to AI/ML and backend engineering opportunities, research
                  collaborations and thoughtful conversations about building useful
                  intelligent systems.
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <a
                    href={`mailto:${SOCIALS.email}`}
                    className="group inline-flex items-center gap-2.5 rounded-full bg-surface px-6 py-3.5 text-sm font-medium text-ink transition-all duration-300 hover:-translate-y-0.5 hover:bg-blush"
                  >
                    <Mail className="h-4 w-4" strokeWidth={1.7} aria-hidden />
                    Say hello
                    <ArrowUpRight
                      className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      strokeWidth={1.8}
                      aria-hidden
                    />
                  </a>
                  <a
                    href={`tel:${SOCIALS.phoneHref}`}
                    className="inline-flex items-center gap-2 rounded-full border border-white/30 px-5 py-3.5 font-mono text-[11px] tracking-[0.06em] text-white transition-all duration-300 hover:-translate-y-0.5 hover:border-white hover:bg-surface/10"
                  >
                    <Phone className="h-3.5 w-3.5" strokeWidth={1.7} aria-hidden />
                    {SOCIALS.phone}
                  </a>
                </div>

                <div className="mt-8 flex items-center gap-4">
                  <span className="font-mono text-[9.5px] uppercase tracking-[0.2em] text-white/70">
                    Elsewhere
                  </span>
                  <span className="h-px w-6 bg-surface/25" aria-hidden />
                  <SocialLinks tone="dark" />
                </div>
              </div>

              <div className="flex flex-col gap-2.5">
                {channels.map(({ label, value, href, Icon, external }) => (
                  <a
                    key={label}
                    href={href}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noreferrer noopener" : undefined}
                    className="group flex items-center gap-4 rounded-2xl border border-white/15 bg-surface/[0.07] px-4 py-3.5 backdrop-blur-sm transition-all duration-300 hover:translate-x-1 hover:border-white/35 hover:bg-surface/[0.13] sm:px-5"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface/10 text-white transition-colors duration-300 group-hover:bg-surface group-hover:text-accent">
                      <Icon className="h-4 w-4" strokeWidth={1.6} aria-hidden />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-mono text-[8.5px] uppercase tracking-[0.2em] text-[#f8dce5]/90">
                        {label}
                      </span>
                      <span className="mt-0.5 block truncate text-[13px] text-white">
                        {value}
                      </span>
                    </span>
                    <ArrowUpRight
                      className="h-4 w-4 shrink-0 text-white/50 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white"
                      strokeWidth={1.6}
                      aria-hidden
                    />
                  </a>
                ))}

                <div className="mt-2 flex items-center gap-2 px-1 font-mono text-[9px] uppercase tracking-[0.16em] text-white/60">
                  <Sparkle className="h-2.5 w-2.5 text-[#f8dce5]" />
                  Based in India · Available for remote
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      <footer className="mx-auto mt-10 max-w-6xl px-5 sm:px-8">
        <div className="flex flex-col gap-5 border-t border-blush/60 py-7 sm:flex-row sm:items-center sm:justify-between">
          <a
            href="#home"
            className="group flex items-baseline gap-0.5 font-serif text-2xl italic leading-none text-ink"
          >
            vasvi
            <span className="h-1.5 w-1.5 rounded-full bg-rose transition-transform duration-300 group-hover:scale-125" />
          </a>
          <p className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-muted">
            © 2026 Vasvi Bali · Built with care
          </p>
          <a
            href="#home"
            className="group inline-flex items-center gap-2 self-start font-mono text-[9.5px] uppercase tracking-[0.16em] text-muted transition-colors hover:text-accent sm:self-auto"
          >
            Back to top
            <ArrowUp
              className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5"
              strokeWidth={1.7}
              aria-hidden
            />
          </a>
        </div>
      </footer>
    </section>
  );
}
