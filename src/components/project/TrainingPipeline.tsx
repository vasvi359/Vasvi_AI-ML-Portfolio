import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { EASE } from "../ui";

type Stage = {
  id: string;
  title: string;
  sub: string;
  description: string;
  points: readonly string[];
};

const STAGES: readonly Stage[] = [
  {
    id: "data",
    title: "Dataset",
    sub: "28K samples",
    description:
      "A labelled sarcasm corpus of roughly 28,000 samples, with each text paired to a sarcastic / not-sarcastic label.",
    points: ["Text and label pairs", "Labels normalised for training", "Source and licence documented separately"],
  },
  {
    id: "prompts",
    title: "Prompt formats",
    sub: "Zero / few-shot",
    description:
      "The same task is expressed in three formats — a direct zero-shot instruction, a few-shot prompt with labelled examples, and the instruction format used for fine-tuning.",
    points: ["Shared instruction wording", "Identical label set across conditions", "Baselines use the untouched base model"],
  },
  {
    id: "tokenise",
    title: "Tokenisation",
    sub: "Qwen chat template",
    description:
      "Samples are rendered through the Qwen 2.5 chat template and tokenised for causal language modelling, with padding and truncation handled by the training configuration.",
    points: ["Chat-template formatting", "Causal LM targets", "Consistent max sequence length"],
  },
  {
    id: "quantise",
    title: "4-bit base",
    sub: "NF4 quantisation",
    description:
      "The Qwen 2.5 1.5B base weights are loaded in 4-bit NF4 precision with double quantisation, substantially reducing memory while keeping the base model frozen.",
    points: ["Base weights frozen", "NF4 with double quantisation", "Lower memory footprint for training"],
  },
  {
    id: "adapters",
    title: "LoRA adapters",
    sub: "PEFT",
    description:
      "Low-rank adapter matrices are attached to the model's linear layers. Only these parameters are trained; the quantised base stays untouched.",
    points: ["Small trainable parameter set", "Adapters saved separately", "Base model recoverable unchanged"],
  },
  {
    id: "train",
    title: "QLoRA training",
    sub: "PyTorch + Transformers",
    description:
      "Quantised base plus trainable adapters is the QLoRA setup. Training runs through PyTorch and Hugging Face Transformers with PEFT managing the adapter lifecycle.",
    points: ["Supervised fine-tuning on labelled samples", "Standard causal-LM loss", "Checkpoints of adapters only"],
  },
  {
    id: "evaluate",
    title: "Evaluation",
    sub: "Three conditions",
    description:
      "The trained adapter is compared with zero-shot and few-shot prompting of the same base model, using one shared held-out evaluation path so the comparison is like-for-like.",
    points: ["Zero-shot baseline", "Few-shot baseline", "Fine-tuned adapter"],
  },
  {
    id: "metrics",
    title: "Metrics",
    sub: "Precision / Recall / F1",
    description:
      "Precision, recall and F1-score are computed for each condition. This page reports the methodology only — no scores are published here.",
    points: ["Class-aware precision and recall", "Macro/weighted F1 as configured", "Confusion patterns reviewed qualitatively"],
  },
];

export default function TrainingPipeline() {
  const [activeId, setActiveId] = useState<string>(STAGES[0].id);
  const reduceMotion = useReducedMotion();
  const active = STAGES.find((stage) => stage.id === activeId) ?? STAGES[0];
  const activeIndex = STAGES.findIndex((stage) => stage.id === active.id);

  return (
    <div className="rounded-[1.8rem] border border-blush bg-surface p-5 shadow-[0_34px_70px_-58px_rgba(52,48,57,0.55)] sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted">
          Training pipeline · 8 stages
        </p>
        <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-accent">
          Select a stage
        </p>
      </div>

      <div className="relative mt-6">
        <span
          aria-hidden
          className="absolute left-4 top-4 hidden h-px w-[calc(100%-2rem)] bg-gradient-to-r from-petal/60 via-petal/40 to-transparent lg:block"
        />

        <motion.div
          initial={reduceMotion ? "show" : "hidden"}
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
          className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {STAGES.map((stage, index) => {
            const isActive = stage.id === active.id;
            return (
              <motion.button
                key={stage.id}
                type="button"
                onClick={() => setActiveId(stage.id)}
                aria-pressed={isActive}
                variants={{
                  hidden: { opacity: 0, y: 14 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
                }}
                className={`relative flex items-start gap-2.5 rounded-2xl border p-3.5 text-left transition-all duration-300 ${
                  isActive
                    ? "border-rose-deep bg-cream shadow-[0_18px_36px_-30px_rgba(179,78,115,0.7)]"
                    : "border-blush bg-surface hover:-translate-y-0.5 hover:border-petal"
                }`}
              >
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-mono text-[9px] transition-colors duration-300 ${
                    isActive ? "bg-rose-deep text-white" : "bg-cream text-accent"
                  }`}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0">
                  <span className="block text-[12.5px] font-medium leading-snug text-ink">
                    {stage.title}
                  </span>
                  <span className="mt-0.5 block font-mono text-[8px] uppercase tracking-[0.1em] text-muted">
                    {stage.sub}
                  </span>
                </span>
                {index < STAGES.length - 1 && (
                  <ArrowRight
                    aria-hidden
                    className="absolute -right-[13px] top-1/2 hidden h-3 w-3 -translate-y-1/2 text-petal lg:block"
                    strokeWidth={1.6}
                  />
                )}
              </motion.button>
            );
          })}
        </motion.div>
      </div>

      <div className="mt-7 rounded-2xl border border-blush bg-cream/50 p-5 sm:p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -6 }}
            transition={{ duration: 0.3, ease: EASE }}
          >
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-accent">
                Stage {String(activeIndex + 1).padStart(2, "0")}
              </span>
              <h3 className="font-serif text-[1.35rem] leading-tight text-ink">{active.title}</h3>
            </div>
            <p className="mt-2.5 max-w-3xl text-[13px] leading-[1.75] text-muted">
              {active.description}
            </p>
            <ul className="mt-4 flex flex-wrap gap-1.5 border-t border-blush/70 pt-4">
              {active.points.map((point) => (
                <li
                  key={point}
                  className="rounded-full border border-blush bg-surface px-2.5 py-1 font-mono text-[8.5px] uppercase tracking-[0.08em] text-accent"
                >
                  {point}
                </li>
              ))}
            </ul>
          </motion.div>
        </AnimatePresence>
      </div>

      <p className="mt-4 font-mono text-[8.5px] uppercase leading-relaxed tracking-[0.14em] text-muted/80">
        Pipeline diagram — illustrative of the workflow, not of measured results.
      </p>
    </div>
  );
}
