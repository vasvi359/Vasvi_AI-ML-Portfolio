import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  BrainCircuit,
  Database,
  FileQuestion,
  Gauge,
  Network,
  Sparkles,
  UserRound,
} from "lucide-react";
import { EASE } from "../ui";

type ArchNode = {
  id: string;
  label: string;
  sub: string;
  description: string;
  inputs: string;
  outputs: string;
  Icon: typeof Network;
};

const NODES: readonly ArchNode[] = [
  {
    id: "orchestrator",
    label: "Orchestrator",
    sub: "MicroAgent router",
    description:
      "Reads the learner's intent and dispatches it to the specialist agent that owns the job. Each agent receives only what it needs, so responsibilities stay isolated and the flow is easy to extend.",
    inputs: "Learner query · session context",
    outputs: "Task assignment to one specialist agent",
    Icon: Network,
  },
  {
    id: "retrieval",
    label: "Retrieval agent",
    sub: "ChromaDB + LangChain",
    description:
      "Embeds the query, searches the subject's vector store and returns the most relevant passages. Retrieved text is the evidence the response agent is allowed to use.",
    inputs: "Query embedding · course document index",
    outputs: "Ranked source passages",
    Icon: Database,
  },
  {
    id: "response",
    label: "Response agent",
    sub: "Grounded generation",
    description:
      "Composes an answer from retrieved passages instead of relying on the model's general knowledge, keeping the explanation tied to the uploaded course material.",
    inputs: "Ranked passages · learner question",
    outputs: "Grounded explanation with source context",
    Icon: Sparkles,
  },
  {
    id: "mcq",
    label: "Assessment agent",
    sub: "MCQ generation",
    description:
      "Turns the same retrieved material into multiple-choice and short-answer practice, so revision is generated from the subject the learner is actually studying.",
    inputs: "Source passages · requested topic and count",
    outputs: "Questions, options and reference answers",
    Icon: FileQuestion,
  },
  {
    id: "evaluation",
    label: "Evaluation agent",
    sub: "Personalised feedback",
    description:
      "Compares a learner's answer with the reference material and produces targeted feedback — what was missed and what to revisit — rather than a bare score.",
    inputs: "Learner answer · reference answer",
    outputs: "Feedback and areas to revise",
    Icon: Gauge,
  },
];

function Connector({ label }: { label?: string }) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="flex flex-col items-center py-2" aria-hidden>
      <motion.span
        initial={reduceMotion ? { scaleY: 1 } : { scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: EASE }}
        className="h-6 w-px origin-top border-l border-dashed border-petal"
      />
      {label ? (
        <span className="my-1 rounded-full border border-blush bg-surface px-3 py-1 font-mono text-[8.5px] uppercase tracking-[0.16em] text-muted">
          {label}
        </span>
      ) : (
        <span className="my-1 h-1.5 w-1.5 rounded-full bg-petal" />
      )}
      <span className="h-4 w-px border-l border-dashed border-petal" />
    </div>
  );
}

/** Click / tap a node to read what it does and what it passes on. */
export default function EduMindArchitecture() {
  const [activeId, setActiveId] = useState<string>("orchestrator");
  const reduceMotion = useReducedMotion();
  const active = NODES.find((node) => node.id === activeId) ?? NODES[0];

  return (
    <div className="rounded-[1.8rem] border border-blush bg-surface p-5 shadow-[0_34px_70px_-58px_rgba(52,48,57,0.55)] sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted">
          EduMind · request flow
        </p>
        <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-accent">
          Tap a node to inspect it
        </p>
      </div>

      <div className="mt-6">
        <div className="mx-auto flex w-fit items-center gap-2.5 rounded-full border border-blush bg-cream/70 px-4 py-2.5">
          <UserRound className="h-3.5 w-3.5 text-accent" strokeWidth={1.7} aria-hidden />
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink">
            Learner query
          </span>
        </div>

        <Connector />

        <motion.button
          type="button"
          onClick={() => setActiveId("orchestrator")}
          aria-pressed={activeId === "orchestrator"}
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: EASE }}
          className={`mx-auto flex w-full max-w-md items-center gap-3 rounded-2xl border px-4 py-3.5 text-left transition-all duration-300 ${
            activeId === "orchestrator"
              ? "border-rose-deep bg-cream shadow-[0_18px_36px_-28px_rgba(179,78,115,0.7)]"
              : "border-blush bg-surface hover:border-petal"
          }`}
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blush text-accent">
            <Network className="h-4 w-4" strokeWidth={1.7} aria-hidden />
          </span>
          <span className="min-w-0">
            <span className="block font-serif text-[1.1rem] leading-tight text-ink">
              Orchestrator
            </span>
            <span className="mt-0.5 block font-mono text-[8.5px] uppercase tracking-[0.14em] text-muted">
              MicroAgent router
            </span>
          </span>
          <BrainCircuit
            className="ml-auto h-4 w-4 shrink-0 text-petal"
            strokeWidth={1.6}
            aria-hidden
          />
        </motion.button>

        <Connector label="routes to one specialist" />

        <motion.div
          initial={reduceMotion ? "show" : "hidden"}
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07 } } }}
          className="grid gap-2.5 sm:grid-cols-2"
        >
          {NODES.filter((node) => node.id !== "orchestrator").map((node) => {
            const isActive = activeId === node.id;
            return (
              <motion.button
                key={node.id}
                type="button"
                onClick={() => setActiveId(node.id)}
                aria-pressed={isActive}
                variants={{
                  hidden: { opacity: 0, y: 12 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
                }}
                className={`flex items-start gap-3 rounded-2xl border p-3.5 text-left transition-all duration-300 ${
                  isActive
                    ? "border-rose-deep bg-cream shadow-[0_18px_36px_-30px_rgba(179,78,115,0.7)]"
                    : "border-blush bg-surface hover:-translate-y-0.5 hover:border-petal"
                }`}
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blush/80 text-accent">
                  <node.Icon className="h-4 w-4" strokeWidth={1.7} aria-hidden />
                </span>
                <span className="min-w-0">
                  <span className="block text-[13px] font-medium leading-snug text-ink">
                    {node.label}
                  </span>
                  <span className="mt-0.5 block font-mono text-[8.5px] uppercase tracking-[0.12em] text-muted">
                    {node.sub}
                  </span>
                </span>
              </motion.button>
            );
          })}
        </motion.div>

        <Connector label="composes response" />

        <div className="flex flex-wrap justify-center gap-2">
          {["Grounded answer", "Practice set", "Targeted feedback"].map((item) => (
            <span
              key={item}
              className="rounded-full border border-blush bg-cream/70 px-3.5 py-2 font-mono text-[9px] uppercase tracking-[0.12em] text-accent"
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-blush bg-cream/50 p-5 sm:p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -6 }}
            transition={{ duration: 0.3, ease: EASE }}
          >
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <h3 className="font-serif text-[1.35rem] leading-tight text-ink">
                {active.label}
              </h3>
              <span className="font-mono text-[8.5px] uppercase tracking-[0.14em] text-accent">
                {active.sub}
              </span>
            </div>
            <p className="mt-2.5 max-w-3xl text-[13px] leading-[1.75] text-muted">
              {active.description}
            </p>
            <dl className="mt-4 grid gap-3 border-t border-blush/70 pt-4 sm:grid-cols-2">
              <div>
                <dt className="font-mono text-[8.5px] uppercase tracking-[0.16em] text-muted">
                  Receives
                </dt>
                <dd className="mt-1 text-[12.5px] leading-relaxed text-ink">{active.inputs}</dd>
              </div>
              <div>
                <dt className="font-mono text-[8.5px] uppercase tracking-[0.16em] text-muted">
                  Returns
                </dt>
                <dd className="mt-1 text-[12.5px] leading-relaxed text-ink">{active.outputs}</dd>
              </div>
            </dl>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
