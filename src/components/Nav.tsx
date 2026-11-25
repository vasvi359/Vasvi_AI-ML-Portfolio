import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { NAV_LINKS } from "../data";
import { Link } from "../router";
import ThemeToggle from "./ThemeToggle";

const SECTION_IDS = NAV_LINKS.map((link) => link.id);

function useActiveSection() {
  const [active, setActive] = useState<string>("home");

  useEffect(() => {
    let frame = 0;

    const update = () => {
      const probe = window.scrollY + window.innerHeight * 0.34;
      let current = SECTION_IDS[0];

      for (const id of SECTION_IDS) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= probe) current = id;
      }

      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 8;
      if (atBottom) current = SECTION_IDS[SECTION_IDS.length - 1];

      setActive(current);
    };

    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return active;
}

type NavProps = {
  /** Project pages live on their own routes, so section links need a path prefix. */
  homeLinks?: boolean;
};

export default function Nav({ homeLinks = false }: NavProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const active = useActiveSection();
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const close = () => setOpen(false);
  const sectionHref = (id: string) => (homeLinks ? `/#${id}` : `#${id}`);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled || open
          ? "border-b border-blush/60 bg-paper/88 shadow-[0_18px_40px_-34px_rgba(52,48,57,0.4)] backdrop-blur-xl"
          : "border-b border-transparent bg-paper/40 backdrop-blur-sm"
      }`}
    >
      <motion.div
        aria-hidden
        style={{ scaleX: progress }}
        className="absolute inset-x-0 top-0 h-[2px] origin-left bg-rose"
      />

      <nav
        aria-label="Primary"
        className="mx-auto flex h-[72px] max-w-6xl items-center justify-between px-5 sm:px-8"
      >
        <Link
          to={homeLinks ? "/" : "#home"}
          onClick={close}
          className="group flex items-baseline gap-0.5 font-serif text-[1.6rem] italic leading-none tracking-tight text-ink"
        >
          vasvi
          <span className="h-1.5 w-1.5 rounded-full bg-rose transition-transform duration-300 group-hover:scale-125" />
          <span className="sr-only">Vasvi Bali — back to top</span>
        </Link>

        <ul className="hidden items-center gap-0.5 lg:flex">
          {NAV_LINKS.map((link) => {
            const isActive = !homeLinks && active === link.id;
            return (
              <li key={link.id}>
                <Link
                  to={sectionHref(link.id)}
                  aria-current={isActive ? "true" : undefined}
                  className={`relative block rounded-full px-3.5 py-2 font-mono text-[11px] uppercase tracking-[0.13em] transition-colors duration-300 ${
                    isActive ? "text-ink" : "text-muted hover:text-ink"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-active-pill"
                      className="absolute inset-0 -z-10 rounded-full bg-cream"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            to={homeLinks ? "/#contact" : "#contact"}
            className="group hidden items-center gap-1.5 rounded-full border border-blush bg-surface px-4 py-2.5 font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink transition-all duration-300 hover:border-cta-hover hover:bg-cta-hover hover:text-white md:inline-flex"
          >
            Let&apos;s talk
            <ArrowUpRight
              className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              strokeWidth={1.8}
              aria-hidden
            />
          </Link>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close navigation menu" : "Open navigation menu"}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-blush text-ink transition hover:bg-cream lg:hidden"
          >
            {open ? (
              <X className="h-4 w-4" strokeWidth={1.8} aria-hidden />
            ) : (
              <Menu className="h-4 w-4" strokeWidth={1.8} aria-hidden />
            )}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            key="mobile-menu"
            initial={reduceMotion ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-blush/60 bg-paper lg:hidden"
          >
            <div className="max-h-[calc(100dvh-72px)] overflow-y-auto">
              <ul className="mx-auto max-w-6xl px-5 py-5 sm:px-8">
                {NAV_LINKS.map((link, index) => (
                  <li key={link.id}>
                    <Link
                      to={sectionHref(link.id)}
                      onClick={close}
                      className={`flex items-center justify-between border-b border-blush/40 py-3.5 ${
                        !homeLinks && active === link.id ? "text-accent" : "text-ink"
                      }`}
                    >
                      <span className="font-serif text-2xl">{link.label}</span>
                      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
                        0{index + 1}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mx-auto max-w-6xl px-5 pb-6 sm:px-8">
                <Link
                  to={homeLinks ? "/#contact" : "#contact"}
                  onClick={close}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-rose-deep px-5 py-3.5 text-sm font-medium text-white"
                >
                  Let&apos;s talk
                  <ArrowUpRight className="h-4 w-4" strokeWidth={1.8} aria-hidden />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
