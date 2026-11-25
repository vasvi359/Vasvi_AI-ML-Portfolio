import { ArrowLeft } from "lucide-react";
import Nav from "../components/Nav";
import { Link } from "../router";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <Nav homeLinks />
      <main
        id="main"
        className="mx-auto flex min-h-[70vh] max-w-3xl flex-col justify-center px-5 pt-28 pb-16 sm:px-8"
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent">
          404 — Page not found
        </p>
        <h1 className="mt-4 text-balance font-serif text-[2.6rem] leading-[1.08] text-ink sm:text-[3.4rem]">
          This page hasn&apos;t been <span className="italic text-accent">written yet.</span>
        </h1>
        <p className="mt-4 max-w-md text-[14px] leading-[1.8] text-muted">
          The link may be outdated. The two available case studies are EduMind and Sarcasm
          Detection.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/"
            className="group inline-flex items-center gap-2 rounded-full bg-rose-deep px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-cta-hover"
          >
            <ArrowLeft
              className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5"
              strokeWidth={1.8}
              aria-hidden
            />
            Back to portfolio
          </Link>
          <Link
            to="/#projects"
            className="inline-flex items-center gap-2 rounded-full border border-blush px-5 py-3 text-sm font-medium text-ink transition-colors hover:border-petal hover:bg-cream"
          >
            View projects
          </Link>
        </div>
      </main>
    </div>
  );
}
