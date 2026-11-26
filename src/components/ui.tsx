import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { Github, Linkedin, Mail } from "lucide-react";

export const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
};

export function Reveal({ children, className, delay = 0, y = 26 }: RevealProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px 0px -60px 0px" }}
      transition={{ duration: 0.8, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

type SectionHeadingProps = {
  index: string;
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  tone?: "light" | "dark";
};

export function SectionHeading({
  index,
  eyebrow,
  title,
  description,
  align = "left",
  tone = "light",
}: SectionHeadingProps) {
  const centered = align === "center";
  const isDark = tone === "dark";

  return (
    <div
      className={
        centered
          ? "mx-auto max-w-2xl text-center"
          : "flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
      }
    >
      <div className={centered ? "" : "max-w-2xl"}>
        <Reveal>
          <div
            className={`flex items-center gap-3 ${centered ? "justify-center" : ""}`}
          >
            <span
              className={`h-px w-8 ${isDark ? "bg-white/40" : "bg-petal"}`}
              aria-hidden
            />
            <p
              className={`font-mono text-[11px] uppercase tracking-[0.22em] ${
                isDark ? "text-blush" : "text-accent"
              }`}
            >
              {index} — {eyebrow}
            </p>
          </div>
        </Reveal>
        <Reveal delay={0.06}>
          <h2
            className={`mt-4 text-balance font-serif text-[2.35rem] leading-[1.1] sm:text-5xl md:text-[3.4rem] ${
              isDark ? "text-white" : "text-ink"
            }`}
          >
            {title}
          </h2>
        </Reveal>
      </div>
      {description ? (
        <Reveal delay={0.12} className={centered ? "mt-5" : "md:max-w-sm md:pb-2"}>
          <p
            className={`text-[15px] leading-relaxed ${
              isDark ? "text-white/80" : "text-muted"
            }`}
          >
            {description}
          </p>
        </Reveal>
      ) : null}
    </div>
  );
}

type SocialLinksProps = {
  tone?: "light" | "dark";
  className?: string;
};

export function SocialLinks({ tone = "light", className = "" }: SocialLinksProps) {
  const base =
    "group inline-flex h-11 w-11 items-center justify-center rounded-full border transition-all duration-300 hover:-translate-y-1";
  const styles =
    tone === "dark"
      ? "border-white/25 text-white hover:border-white hover:bg-surface hover:text-accent"
      : "border-blush bg-surface text-ink hover:border-rose-deep hover:bg-rose-deep hover:text-white";

  const links = [
    { label: "GitHub", href: "https://github.com/vasvi359", Icon: Github },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/vasvi-bali-69a3b730a",
      Icon: Linkedin,
    },
    { label: "Email Vasvi Bali", href: "mailto:vasvibali@gmail.com", Icon: Mail },
  ];

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {links.map(({ label, href, Icon }) => {
        const external = href.startsWith("http");

        return (
          <a
            key={label}
            href={href}
            target={external ? "_blank" : undefined}
            rel={external ? "noopener noreferrer" : undefined}
            aria-label={label}
            className={`${base} ${styles}`}
          >
            <Icon
              className="h-[18px] w-[18px] transition-transform duration-300 group-hover:scale-110"
              strokeWidth={1.6}
              aria-hidden
            />
          </a>
        );
      })}
    </div>
  );
}

export function Sparkle({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className={className}
    >
      <path
        d="M12 2c.6 5.4 4.6 9.4 10 10-5.4.6-9.4 4.6-10 10-.6-5.4-4.6-9.4-10-10 5.4-.6 9.4-4.6 10-10Z"
        fill="currentColor"
      />
    </svg>
  );
}
