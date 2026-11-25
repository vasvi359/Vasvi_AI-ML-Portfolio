import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  FileText,
  Landmark,
  ListChecks,
  Network,
  ScrollText,
  Target,
} from "lucide-react";
import { Reveal } from "../components/ui";
import {
  Callout,
  CopyrightBlock,
  ScrollSteps,
  TechCards,
  usePageMeta,
} from "../components/project/blocks";
import {
  ProjectFooterNav,
  ProjectHero,
  ProjectSection,
  ProjectShell,
} from "../components/project/ProjectChrome";
import EduMindArchitecture from "../components/project/EduMindArchitecture";

const FEATURES = [
  {
    title: "Retrieval-Augmented Generation",
    icon: BookOpen,
    body: "Course documents are chunked, embedded and stored in a vector index. At question time, the relevant passages are retrieved first and the answer is composed from them — a retrieval-first design rather than general model recall.",
    points: [
      "Document ingestion and embedding",
      "Similarity search over course material",
      "Answers grounded in retrieved context",
    ],
  },
  {
    title: "Multi-agent architecture",
    icon: Network,
    body: "The platform is decomposed into small agents, each responsible for one part of the learning loop. An orchestrator routes the learner's request, and each agent hands back a narrow, predictable result.",
    points: ["Orchestrated task routing", "Single-responsibility agents", "Composable and extensible flow"],
  },
  {
    title: "MCQ generation",
    icon: ListChecks,
    body: "Practice material is generated from the same retrieved source passages, so revision questions stay tied to the syllabus the learner supplied rather than to an open-ended model prompt.",
    points: ["Multiple-choice question generation", "Short-answer practice", "Reference answers from source text"],
  },
  {
    title: "Personalized evaluation",
    icon: Target,
    body: "Submitted answers are compared against the reference material and turned into targeted feedback, pointing the learner at what was missed and what to revisit instead of returning a bare score.",
    points: ["Answer comparison against sources", "Feedback on gaps", "Revision guidance"],
  },
] as const;

const STACK = [
  {
    name: "Python",
    role: "Application language — orchestration, retrieval and evaluation logic.",
    license: "PSF License",
    detail:
      "The whole platform is written in Python: agent orchestration, the RAG pipeline, question generation and the answer-evaluation logic.",
  },
  {
    name: "LangChain",
    role: "Agent composition and retrieval chains.",
    license: "MIT",
    detail:
      "LangChain supplies the LLM plumbing — retrieval chains and the composition layer that lets the MicroAgents operate as one flow.",
  },
  {
    name: "ChromaDB",
    role: "Vector store for course embeddings and similarity search.",
    license: "Apache 2.0",
    detail:
      "Course material is embedded into ChromaDB and queried by similarity so each response can be traced back to specific source passages.",
  },
  {
    name: "Streamlit",
    role: "The learner-facing interface.",
    license: "Apache 2.0",
    detail:
      "Streamlit provides the interactive surface where a learner asks questions, generates practice sets and reviews evaluation feedback.",
  },
] as const;

const METHOD = [
  {
    title: "Frame the learning problem",
    body: "Start from a familiar failure: generic assistants answer confidently without the course context. The design brief becomes grounding, practice generation and feedback over supplied material.",
    detail: ["Course-scoped", "Grounded answers"],
  },
  {
    title: "Ingest and embed the material",
    body: "Subject documents are split into chunks, converted to embeddings and written to a vector store, forming the retrievable knowledge base for the platform.",
    detail: ["Chunking", "Embeddings", "ChromaDB"],
  },
  {
    title: "Decompose into MicroAgents",
    body: "Rather than one monolithic prompt, responsibilities are split into small agents — retrieval, response, question generation and evaluation — coordinated by an orchestrator.",
    detail: ["Single responsibility", "Orchestration"],
  },
  {
    title: "Wire the grounded learning loop",
    body: "A learner question flows through routing, retrieval and generation; practice and evaluation reuse the same retrieval layer, so all three outputs draw on the same source material.",
    detail: ["RAG", "MCQ", "Feedback"],
  },
  {
    title: "Review against source material",
    body: "Sample interactions were reviewed during development against the passages they cited, with prompt and retrieval adjustments made iteratively. No benchmark scores are claimed on this page.",
    detail: ["Iterative review", "No published metrics"],
  },
] as const;

export default function EduMindPage() {
  usePageMeta(
    "EduMind — Intelligent Learning Through AI | Vasvi Bali",
    "EduMind case study: a grounded, multi-agent educational assistant built with RAG, LangChain, ChromaDB and Streamlit.",
  );

  const reduceMotion = useReducedMotion();

  return (
    <ProjectShell>
      <ProjectHero
        index="01"
        eyebrow="Case study · Educational AI"
        name="EduMind"
        titleLines={["Intelligent Learning Through AI"]}
        summary="A course-grounded learning assistant. EduMind answers from the material a learner supplies, generates practice questions from the same sources, and evaluates answers with targeted feedback — built as a modular multi-agent system instead of a single prompt."
        tags={["Python", "LangChain", "ChromaDB", "Streamlit", "RAG"]}
        meta={[
          { label: "Role", value: "Project contributor & research co-author" },
          { label: "Focus", value: "RAG · multi-agent systems · educational AI" },
          { label: "Status", value: "Research prototype · copyright registered with the Government of India" },
          { label: "Interface", value: "Streamlit application" },
        ]}
        variant="edumind"
        transitionName="project-visual-edumind"
      />

      <ProjectSection
        id="problem"
        index="01"
        eyebrow="Problem & objective"
        title={
          <>
            Grounded help, not <span className="italic text-accent">confident guesswork.</span>
          </>
        }
        description="Why a general-purpose assistant is the wrong tool for course-specific study."
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <Reveal>
            <article className="h-full rounded-2xl border border-blush bg-cream/50 p-6 sm:p-7">
              <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-accent">
                The problem
              </p>
              <h3 className="mt-3 font-serif text-[1.45rem] leading-snug text-ink">
                Study material is scattered, and generic answers are unanchored.
              </h3>
              <p className="mt-3 text-[13.5px] leading-[1.8] text-muted">
                A learner's syllabus lives across PDFs, notes and slides. General-purpose
                language models respond fluently, but their answers are not tied to those
                documents — which makes them hard to trust for revision. Practice questions are
                usually pulled from elsewhere, and feedback rarely explains what was missing.
              </p>
            </article>
          </Reveal>

          <Reveal delay={0.08}>
            <article className="h-full rounded-2xl border border-blush bg-surface p-6 sm:p-7">
              <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-accent">
                The objective
              </p>
              <h3 className="mt-3 font-serif text-[1.45rem] leading-snug text-ink">
                One pipeline for answering, practising and evaluating.
              </h3>
              <ul className="mt-3 space-y-2.5">
                {[
                  "Answer questions using only the supplied course material.",
                  "Generate practice questions from the same retrieved sources.",
                  "Turn submitted answers into feedback that points to gaps.",
                  "Keep the system modular so each part of the loop can evolve.",
                ].map((item) => (
                  <li key={item} className="flex gap-3">
                    <span aria-hidden className="mt-[9px] h-px w-3 shrink-0 bg-petal" />
                    <span className="text-[13.5px] leading-[1.75] text-muted">{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          </Reveal>
        </div>
      </ProjectSection>

      <ProjectSection
        id="solution"
        index="02"
        eyebrow="Solution overview"
        title={
          <>
            Retrieval first, <span className="italic text-accent">then everything else.</span>
          </>
        }
        description="EduMind treats the course document as the source of truth and builds the whole learning loop on top of it."
        tone="cream"
      >
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              step: "01",
              title: "Ingest",
              body: "Subject documents are chunked and embedded into a vector store, creating a retrievable knowledge base for that course.",
            },
            {
              step: "02",
              title: "Retrieve",
              body: "A learner's question is embedded and matched against the index. The most relevant passages become the evidence for the response.",
            },
            {
              step: "03",
              title: "Teach & check",
              body: "Agents use that evidence to explain, generate practice questions, and evaluate an answer with feedback tied back to the material.",
            },
          ].map((item, index) => (
            <Reveal key={item.title} delay={index * 0.07}>
              <article className="group h-full rounded-2xl border border-blush bg-surface p-6 transition-all duration-500 hover:-translate-y-1 hover:border-petal hover:shadow-[0_30px_55px_-45px_rgba(179,78,115,0.6)]">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-accent">
                    {item.step}
                  </span>
                  <ArrowRight
                    className="h-4 w-4 text-petal transition-transform duration-300 group-hover:translate-x-1"
                    strokeWidth={1.6}
                    aria-hidden
                  />
                </div>
                <h3 className="mt-4 font-serif text-[1.35rem] text-ink">{item.title}</h3>
                <p className="mt-2.5 text-[13px] leading-[1.75] text-muted">{item.body}</p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <div className="mt-5">
            <Callout title="Scope note">
              EduMind is a research prototype built as an academic project. This page describes
              its design and the author's contribution; it does not publish usage metrics, user
              numbers or benchmark scores.
            </Callout>
          </div>
        </Reveal>
      </ProjectSection>

      <ProjectSection
        id="features"
        index="03"
        eyebrow="Core features"
        title={
          <>
            Four parts that make the <span className="italic text-accent">loop work.</span>
          </>
        }
        description="Each feature exists to keep the learner inside their own material."
      >
        <div className="grid gap-4 md:grid-cols-2">
          {FEATURES.map((feature, index) => (
            <Reveal key={feature.title} delay={index * 0.06}>
              <motion.article
                whileHover={reduceMotion ? undefined : { y: -4 }}
                transition={{ duration: 0.35 }}
                className="group h-full rounded-2xl border border-blush bg-surface p-6 transition-colors duration-400 hover:border-petal sm:p-7"
              >
                <div className="flex items-start gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cream text-accent transition-colors duration-300 group-hover:bg-blush">
                    <feature.icon className="h-[18px] w-[18px]" strokeWidth={1.6} aria-hidden />
                  </span>
                  <div>
                    <h3 className="font-serif text-[1.35rem] leading-snug text-ink">
                      {feature.title}
                    </h3>
                    <p className="mt-2.5 text-[13px] leading-[1.8] text-muted">{feature.body}</p>
                    <ul className="mt-4 space-y-1.5">
                      {feature.points.map((point) => (
                        <li
                          key={point}
                          className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.1em] text-accent"
                        >
                          <span className="h-1 w-1 rounded-full bg-petal" aria-hidden />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.article>
            </Reveal>
          ))}
        </div>
      </ProjectSection>

      <ProjectSection
        id="stack"
        index="04"
        eyebrow="Technology stack"
        title={
          <>
            Small stack, <span className="italic text-accent">deliberate layers.</span>
          </>
        }
        description="Open the cards to see exactly what each piece does inside the project."
        tone="cream"
      >
        <TechCards items={STACK} />
        <Reveal delay={0.1}>
          <p className="mt-5 font-mono text-[9px] uppercase leading-relaxed tracking-[0.14em] text-muted/80">
            Licences listed as published by each upstream project at the time of writing.
          </p>
        </Reveal>
      </ProjectSection>

      <ProjectSection
        id="architecture"
        index="05"
        eyebrow="System architecture"
        title={
          <>
            One router, <span className="italic text-accent">four specialists.</span>
          </>
        }
        description="Select any node to see what it receives and what it returns."
      >
        <Reveal>
          <EduMindArchitecture />
        </Reveal>
      </ProjectSection>

      <ProjectSection
        id="methodology"
        index="06"
        eyebrow="Methodology & MicroAgent design"
        title={
          <>
            Built in small, <span className="italic text-accent">testable pieces.</span>
          </>
        }
        description="The architecture is intentionally boring: narrow agents, one shared retrieval layer, predictable hand-offs."
        tone="cream"
      >
        <ScrollSteps steps={METHOD} />

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {[
            {
              icon: Network,
              title: "Single responsibility",
              body: "Each MicroAgent owns exactly one task — retrieve, respond, question-generate or evaluate — which keeps prompts and failure modes narrow.",
            },
            {
              icon: BookOpen,
              title: "Shared evidence",
              body: "All agents read from the same vector store, so explanations, practice questions and feedback stay consistent with one another.",
            },
            {
              icon: ListChecks,
              title: "Predictable hand-offs",
              body: "The orchestrator passes a small, typed result between agents, making the flow easier to debug and extend with new capabilities.",
            },
          ].map((item, index) => (
            <Reveal key={item.title} delay={index * 0.07}>
              <article className="h-full rounded-2xl border border-blush bg-surface p-6">
                <item.icon className="h-5 w-5 text-accent" strokeWidth={1.6} aria-hidden />
                <h3 className="mt-4 font-serif text-[1.25rem] text-ink">{item.title}</h3>
                <p className="mt-2 text-[13px] leading-[1.75] text-muted">{item.body}</p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.12}>
          <div className="mt-5">
            <Callout title="On the term MicroAgent" icon="scroll">
              MicroAgent describes the platform's own agent decomposition — small,
              single-purpose units coordinated by an orchestrator. It is a design pattern used in
              this project, not a separately published framework.
            </Callout>
          </div>
        </Reveal>
      </ProjectSection>

      <ProjectSection
        id="research"
        index="07"
        eyebrow="Research & innovation"
        title={
          <>
            Written up, disclosed <span className="italic text-accent">and supported.</span>
          </>
        }
        description="Three pieces of work sit alongside the prototype. Status is stated plainly — nothing is claimed beyond what exists."
      >
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              icon: FileText,
              label: "Publication",
              title: "Co-authored research paper",
              body: "The approach behind EduMind was written up in a co-authored research paper covering the architecture, retrieval method and educational use case.",
              note: "Citation and venue will be added only once verified.",
            },
            {
              icon: ScrollText,
              label: "Disclosure",
              title: "Invention Disclosure Form",
              body: "An Invention Disclosure Form documents the platform as part of the institutional disclosure process, so the work is recorded before any public release.",
              note: "Filing and approval status are not asserted here.",
            },
            {
              icon: Landmark,
              label: "Support",
              title: "Government grant",
              body: "A government grant was secured to support copyright registration of the EduMind platform, covering the registration process for the work.",
              note: "Certificate SW-2026023795 is reproduced in §09.",
            },
          ].map((item, index) => (
            <Reveal key={item.title} delay={index * 0.07}>
              <article className="flex h-full flex-col rounded-2xl border border-blush bg-surface p-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-cream text-accent">
                  <item.icon className="h-[18px] w-[18px]" strokeWidth={1.6} aria-hidden />
                </span>
                <p className="mt-4 font-mono text-[9px] uppercase tracking-[0.18em] text-accent">
                  {item.label}
                </p>
                <h3 className="mt-2 font-serif text-[1.3rem] leading-snug text-ink">
                  {item.title}
                </h3>
                <p className="mt-2.5 text-[13px] leading-[1.75] text-muted">{item.body}</p>
                <p className="mt-auto pt-4 font-mono text-[8.5px] uppercase leading-relaxed tracking-[0.12em] text-muted/80">
                  {item.note}
                </p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <div className="mt-8 rounded-2xl border border-blush bg-cream/50 p-6 sm:p-8">
            <h3 className="font-serif text-[1.45rem] text-ink">What the innovation is</h3>
            <p className="mt-3 max-w-3xl text-[13.5px] leading-[1.8] text-muted">
              The contribution is architectural rather than a new model: a course-scoped
              educational loop that combines retrieval-grounded answering, multi-agent
              decomposition and source-derived assessment in one pipeline, with a design intended
              to be extended subject by subject.
            </p>
          </div>
        </Reveal>
      </ProjectSection>

      <ProjectSection
        id="contributions"
        index="08"
        eyebrow="My contribution"
        title={
          <>
            What I actually <span className="italic text-accent">built.</span>
          </>
        }
        description="Responsibilities on EduMind, described as work rather than as outcomes."
        tone="cream"
      >
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <ul className="space-y-3.5">
              {[
                "Designed and implemented the multi-agent MicroAgent structure and the routing between specialist agents.",
                "Built the retrieval-augmented pipeline — document ingestion, embedding, ChromaDB indexing and similarity search via LangChain.",
                "Implemented the MCQ and short-answer generation flow from retrieved course material.",
                "Implemented the answer-evaluation logic and the targeted feedback it returns.",
                "Built the Streamlit learning interface that ties answering, practice and evaluation together.",
                "Co-authored the accompanying research paper and contributed to the invention disclosure documentation.",
              ].map((item, index) => (
                <Reveal key={item} delay={index * 0.04}>
                  <li className="flex gap-3.5 rounded-xl border border-blush bg-surface p-4">
                    <span className="mt-[7px] h-px w-3 shrink-0 bg-petal" aria-hidden />
                    <span className="text-[13px] leading-[1.75] text-muted">{item}</span>
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>

          <Reveal delay={0.1}>
            <div className="rounded-2xl border border-blush bg-surface p-6">
              <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-accent">
                At a glance
              </p>
              <dl className="mt-4 divide-y divide-blush/70">
                {[
                  { label: "Project", value: "EduMind" },
                  { label: "Domain", value: "AI in education" },
                  { label: "My focus", value: "RAG pipeline, agent design, evaluation logic" },
                  { label: "Research", value: "Co-authored paper · invention disclosure" },
                  { label: "Funding", value: "Government grant for copyright registration" },
                ].map((row) => (
                  <div key={row.label} className="py-3 first:pt-0 last:pb-0">
                    <dt className="font-mono text-[8.5px] uppercase tracking-[0.16em] text-muted">
                      {row.label}
                    </dt>
                    <dd className="mt-1 text-[12.5px] leading-relaxed text-ink">{row.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>
        </div>
      </ProjectSection>

      <ProjectSection
        id="copyright"
        index="09"
        eyebrow="Copyright & attribution"
        title={
          <>
            Ownership, credits and <span className="italic text-accent">honest status.</span>
          </>
        }
        description="What is claimed, what is licensed to others, and what remains unverified."
        tone="cream"
      >
        <Reveal>
          <figure className="overflow-hidden rounded-[1.8rem] border border-blush bg-surface">
            <a
              href="/images/edumind-copyright-certificate.png"
              target="_blank"
              rel="noopener noreferrer"
              className="group block bg-cream/60 p-4 sm:p-6"
              aria-label="Open the copyright registration certificate in a new tab"
            >
              <img
                src="/images/edumind-copyright-certificate.png"
                alt="Certificate of Registration SW-2026023795 from the Copyright Office, Government of India, for EduMind, listing Vasvi Bali, Dr. Himanshu Sharma, Dr. Vijaya Chaudhary and Dr. Alok Aggarwal as authors and IIM University, Greater Noida as owner."
                width={645}
                height={852}
                loading="lazy"
                className="mx-auto h-auto w-full max-w-[26rem] rounded-lg border border-blush shadow-[0_24px_50px_-38px_rgba(52,48,57,0.6)] transition-transform duration-500 group-hover:-translate-y-1"
              />
            </a>
            <figcaption className="flex flex-wrap items-center justify-between gap-3 border-t border-blush/70 px-6 py-4 sm:px-8">
              <span>
                <span className="block font-mono text-[9px] uppercase tracking-[0.18em] text-accent">
                  Certificate of registration · Copyright Office, Government of India
                </span>
                <span className="mt-1.5 block text-[12px] leading-relaxed text-muted">
                  No. SW-2026023795 · Diary No. SW-34263/2026-CO, filed 22 July 2026 · work
                  title as registered: “EduMind: An Intelligent Personalized Student Assistant
                  Using Retrieval Augmented Generation, Micro Agent Orchestration, and
                  Persistent Memory”
                </span>
              </span>
              <a
                href="/images/edumind-copyright-certificate.png"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-blush px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.12em] text-accent transition-colors duration-300 hover:border-petal hover:bg-cream"
              >
                Open full document
                <ArrowRight className="h-3 w-3" strokeWidth={1.8} aria-hidden />
              </a>
            </figcaption>
          </figure>
        </Reveal>

        <CopyrightBlock
          status="Registered · SW-2026023795"
          intro={
            <>
              EduMind is an academic project with multiple contributors and third-party
              dependencies. The registration certificate supplied by the author team is
              reproduced above; the statements below are limited to what that document and the
              project record actually establish.
            </>
          }
          rows={[
            {
              label: "Project & authorship",
              value:
                "EduMind — co-developed by Vasvi Bali with project collaborators as part of academic work. Individual authorship is attributed to the project's author team.",
            },
            {
              label: "Individual contribution",
              value:
                "Vasvi Bali's contribution covers the multi-agent architecture, the RAG pipeline, MCQ generation, answer-evaluation logic, the Streamlit interface and co-authorship of the research paper.",
            },
            {
              label: "Copyright ownership",
              value:
                "The Copyright Office of India certificate (No. SW-2026023795) names IIM University, Greater Noida as the owner of the work, and Vasvi Bali, Dr. Himanshu Sharma, Dr. Vijaya Chaudhary and Dr. Alok Aggarwal as authors. The certificate is reproduced above.",
            },
            {
              label: "Registration",
              value:
                "Registered with the Copyright Office, Government of India, under diary number SW-34263/2026-CO, filed 22 July 2026. The registered work title and the names above are transcribed from the certificate itself.",
            },
            {
              label: "Research & publication",
              value:
                "The platform is described in a co-authored research paper. Venue, date and full citation are omitted until they can be verified, rather than approximated.",
            },
            {
              label: "Invention disclosure",
              value:
                "An Invention Disclosure Form records the platform for institutional review. Its filing and approval status are not claimed here.",
            },
            {
              label: "Government grant",
              value:
                "A government grant supported copyright registration of the EduMind platform. The resulting certificate is reproduced above; no grant amount or further terms are published here.",
            },
            {
              label: "Third-party software",
              value:
                "Python (PSF License), LangChain (MIT), ChromaDB (Apache 2.0) and Streamlit (Apache 2.0) remain under their respective licences and copyright holders.",
            },
            {
              label: "Usage & redistribution",
              value:
                "No source code, dataset or documentation from EduMind is redistributed on this portfolio. All rights in the original work are reserved by the author team unless a separate written licence states otherwise.",
            },
          ]}
          notice="This section is an attribution statement, not legal advice. Certificate numbers, dates, names and the work title are transcribed from the document displayed above. No ownership transfer, grant amount or publication credit has been invented."
        />
      </ProjectSection>

      <ProjectFooterNav
        next={{ name: "Sarcasm Detection", to: "/projects/sarcasm-detection", index: "02" }}
      />
    </ProjectShell>
  );
}
