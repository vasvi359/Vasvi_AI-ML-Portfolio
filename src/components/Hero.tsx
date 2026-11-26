import type { Variants } from "framer-motion";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import type { PointerEvent as ReactPointerEvent } from "react";
import { ArrowDown, Download } from "lucide-react";
import { HERO_STATS, MARQUEE_WORDS } from "../data";
import { EASE, SocialLinks, Sparkle } from "./ui";
import { assetPath } from "../paths";
import {
  HandUnderline,
  Magnetic,
  PetalParticles,
  WordReveal,
  useFinePointer,
} from "./motion-kit";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.085, delayChildren: 0.12 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.85, ease: EASE } },
};

export default function Hero() {
  const reduceMotion = useReducedMotion();
  const finePointer = useFinePointer();
  const tiltEnabled = finePointer && !reduceMotion;

  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const rotateX = useSpring(tiltX, { stiffness: 140, damping: 20, mass: 0.4 });
  const rotateY = useSpring(tiltY, { stiffness: 140, damping: 20, mass: 0.4 });

  const handlePortraitTilt = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!tiltEnabled) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    tiltY.set(x * 8);
    tiltX.set(y * -7);
  };

  const resetTilt = () => {
    tiltX.set(0);
    tiltY.set(0);
  };

  return (
    <section id="home" className="relative overflow-hidden pt-32 sm:pt-36 lg:pt-40">
      {/* ambient blush shapes */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -right-32 top-16 h-[440px] w-[440px] rounded-full bg-blush/45 blur-3xl animate-float-slow" />
        <div className="absolute -left-40 bottom-16 h-[360px] w-[360px] rounded-full bg-cream blur-3xl" />
        <div className="absolute right-[18%] top-24 h-3 w-3 rounded-full bg-petal/70 animate-float" />
        <div className="absolute left-[8%] top-[58%] h-2 w-2 rounded-full bg-rose/40 animate-float-slow" />
      </div>

      <div className="mx-auto grid max-w-6xl items-center gap-14 px-5 pb-16 sm:px-8 lg:grid-cols-[1.04fr_0.96fr] lg:gap-10 lg:pb-24">
        <motion.div
          variants={container}
          initial={reduceMotion ? false : "hidden"}
          animate="show"
          className="relative z-10"
        >
          <motion.p
            variants={item}
            className="flex items-center gap-2 font-serif text-xl italic text-muted sm:text-2xl"
          >
            Hello, I&apos;m <span className="text-ink">Vasvi Bali</span>
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-rose" aria-hidden />
          </motion.p>

          <h1 className="mt-4 text-balance font-serif text-[2.9rem] leading-[1.06] tracking-[-0.02em] text-ink sm:text-[3.6rem] lg:text-[4.15rem] xl:text-[4.5rem]">
            <WordReveal
              delay={0.5}
              stagger={0.085}
              label="Building intelligent solutions with AI."
              words={[
                { text: "Building" },
                {
                  node: (
                    <span className="relative inline-block italic text-accent">
                      intelligent
                      <HandUnderline
                        mode="mount"
                        delay={1.35}
                        className="absolute -bottom-1.5 left-0 h-2.5 w-full text-petal/80"
                      />
                    </span>
                  ),
                },
                { text: "solutions" },
                { text: "with" },
                {
                  node: (
                    <>
                      AI<span className="text-rose">.</span>
                    </>
                  ),
                },
              ]}
            />
          </h1>

          <motion.p
            variants={item}
            className="mt-6 flex flex-wrap items-center gap-x-2.5 gap-y-2 font-mono text-[10.5px] uppercase tracking-[0.16em] text-muted sm:text-[11px]"
          >
            {["AI/ML Engineer", "Backend Developer", "NLP", "RAG", "Computer Vision"].map(
              (word, index, arr) => (
                <span key={word} className="flex items-center gap-2.5">
                  {word}
                  {index < arr.length - 1 && (
                    <span className="text-petal" aria-hidden>
                      /
                    </span>
                  )}
                </span>
              ),
            )}
          </motion.p>

          <motion.p
            variants={item}
            className="mt-7 max-w-[34rem] text-[15px] leading-[1.75] text-muted sm:text-base"
          >
            I turn research-grade AI into systems people can actually use — grounded RAG
            pipelines, fine-tuned language models and the FastAPI backends underneath them.
          </motion.p>

          <motion.div variants={item} className="mt-9 flex flex-wrap items-center gap-3">
            <Magnetic strength={9}>
              <a
                href="#projects"
                className="group inline-flex items-center gap-2.5 rounded-full bg-rose-deep px-6 py-3.5 text-sm font-medium text-white shadow-[0_20px_40px_-24px_rgba(179,78,115,0.9)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-cta-hover"
              >
                Explore my work
                <ArrowDown
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5"
                  strokeWidth={1.8}
                  aria-hidden
                />
              </a>
            </Magnetic>
            <Magnetic strength={7}>
              <a
                href={assetPath("/Vasvi_Bali_Resume.pdf")}
                download="Vasvi_Bali_Resume.pdf"
                className="group inline-flex items-center gap-2.5 rounded-full border border-blush bg-surface/70 px-6 py-3.5 text-sm font-medium text-ink backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-petal hover:bg-cream"
              >
                <Download
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5"
                  strokeWidth={1.8}
                  aria-hidden
                />
                Download resume
              </a>
            </Magnetic>
          </motion.div>

          <motion.div variants={item} className="mt-9 flex flex-wrap items-center gap-4">
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
              Find me
            </span>
            <span className="h-px w-6 bg-blush" aria-hidden />
            <SocialLinks />
          </motion.div>

          <motion.dl
            variants={item}
            className="mt-10 flex max-w-md items-stretch gap-6 border-t border-blush/70 pt-6 sm:gap-8"
          >
            {HERO_STATS.map((stat, index) => (
              <div
                key={stat.label}
                className={`flex-1 ${index > 0 ? "border-l border-blush/70 pl-6 sm:pl-8" : ""}`}
              >
                <dt className="sr-only">{stat.label}</dt>
                <dd className="font-serif text-[1.7rem] leading-none text-accent">
                  {stat.value}
                </dd>
                <p className="mt-2 font-mono text-[9.5px] uppercase leading-relaxed tracking-[0.14em] text-muted">
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.dl>
        </motion.div>

        {/* portrait */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, scale: 0.94, y: 26 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.05, delay: 0.3, ease: EASE }}
          onPointerMove={handlePortraitTilt}
          onPointerLeave={resetTilt}
          style={
            tiltEnabled
              ? { rotateX, rotateY, transformPerspective: 1100, transformStyle: "preserve-3d" }
              : undefined
          }
          className="relative mx-auto w-[min(100%,390px)] lg:w-[min(100%,405px)]"
        >
          <div aria-hidden className="absolute -inset-8 -z-10 sm:-inset-12">
            <PetalParticles count={16} />
          </div>
          <div
            aria-hidden
            className="absolute -inset-6 rounded-full bg-cream sm:-inset-8"
          />
          <div
            aria-hidden
            className="absolute inset-0 arch translate-x-3 translate-y-3 border border-petal/60 sm:translate-x-4 sm:translate-y-4"
          />
          <div
            aria-hidden
            className="absolute -inset-4 rounded-full border border-dashed border-petal/40 animate-spin-slow sm:-inset-6"
          />

          <div className="relative arch border border-blush bg-surface p-2.5 shadow-[0_50px_90px_-50px_rgba(179,78,115,0.55)] sm:p-3">
            <div className="arch relative overflow-hidden">
              <img
                src={assetPath("/images/portrait.jpg")}
                alt="Portrait of Vasvi Bali"
                width={720}
                height={960}
                fetchPriority="high"
                decoding="async"
                className="arch h-auto w-full object-cover"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-rose-deep/20 to-transparent"
              />
            </div>
          </div>

          <motion.div
            animate={reduceMotion ? undefined : { y: [0, -8, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -left-3 top-12 z-20 flex items-center gap-2 rounded-full border border-blush bg-surface/95 px-3.5 py-2.5 shadow-[0_18px_30px_-22px_rgba(52,48,57,0.5)] backdrop-blur sm:-left-7"
          >
            <span className="relative flex h-2 w-2" aria-hidden>
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-rose-deep" />
            </span>
            <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-ink">
              Open to AI/ML roles
            </span>
          </motion.div>

          <motion.div
            animate={reduceMotion ? undefined : { y: [0, 9, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
            className="absolute -right-2 bottom-9 z-20 rounded-2xl border border-blush bg-surface/95 px-4 py-3 shadow-[0_18px_36px_-24px_rgba(52,48,57,0.5)] backdrop-blur sm:-right-6"
          >
            <p className="font-mono text-[8.5px] uppercase tracking-[0.2em] text-muted">
              Currently
            </p>
            <p className="mt-1 text-xs font-medium text-ink">
              AI Junior Engineer <span className="text-rose">@</span> Cerebree
            </p>
          </motion.div>

          <Sparkle className="absolute -right-2 top-2 h-7 w-7 text-petal animate-float" />
          <Sparkle className="absolute -left-1 bottom-20 h-4 w-4 text-rose/70 animate-float-slow" />
          <span
            aria-hidden
            className="absolute -right-4 top-1/2 h-2.5 w-2.5 rounded-full bg-rose/50"
          />
        </motion.div>
      </div>

      {/* keyword ribbon */}
      <div className="group relative overflow-hidden border-y border-blush/70 bg-paper/50 py-4">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-paper to-transparent"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-paper to-transparent"
        />
        <div className="flex w-max animate-marquee items-center group-hover:[animation-play-state:paused]">
          {[0, 1].map((copy) => (
            <div
              key={copy}
              aria-hidden={copy === 1}
              className="flex items-center gap-8 whitespace-nowrap pr-8"
            >
              {MARQUEE_WORDS.map((word) => (
                <span key={`${copy}-${word}`} className="flex items-center gap-8">
                  <span className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-muted">
                    {word}
                  </span>
                  <Sparkle className="h-2.5 w-2.5 text-petal" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
