import {
  AlertTriangle,
  BarChart3,
  BookOpen,
  Check,
  Database,
  Layers,
  Microscope,
  SlidersHorizontal,
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
import TrainingPipeline from "../components/project/TrainingPipeline";

const STACK = [
  {
    name: "PyTorch",
    role: "Training and tensor runtime.",
    license: "BSD-3-Clause",
    detail:
      "PyTorch runs the fine-tuning loop and the evaluation passes over the held-out data.",
  },
  {
    name: "Transformers",
    role: "Model loading, tokenisation and inference.",
    license: "Apache 2.0",
    detail:
      "Hugging Face Transformers loads Qwen 2.5 1.5B, applies the chat template and handles generation in every evaluation condition.",
  },
  {
    name: "PEFT",
    role: "LoRA adapter management.",
    license: "Apache 2.0",
    detail:
      "PEFT attaches the low-rank adapters, keeps the quantised base frozen and saves only the adapter weights.",
  },
  {
    name: "Datasets",
    role: "Dataset loading and preprocessing.",
    license: "Apache 2.0",
    detail:
      "The labelled corpus is loaded, normalised and mapped into the instruction format through the Datasets library.",
  },
  {
    name: "bitsandbytes",
    role: "4-bit NF4 quantisation.",
    license: "MIT",
    detail:
      "bitsandbytes provides the 4-bit NF4 quantisation and paged optimiser support that make QLoRA training fit the available memory.",
  },
  {
    name: "Qwen 2.5 1.5B",
    role: "Base language model being adapted.",
    license: "Apache 2.0",
    detail:
      "The 1.5B-parameter decoder-only base model. Its weights stay frozen; only the adapters are trained. Terms follow the published model card.",
  },
] as const;

const METHOD = [
  {
    title: "Assemble and normalise the labelled corpus",
    body: "Roughly 28,000 text–label samples are loaded, labels are normalised to a binary sarcasm target and the data is split for training and evaluation.",
    detail: ["28K samples", "Binary labels"],
  },
  {
    title: "Format the instruction data",
    body: "Each sample is rendered as an instruction with the text and the expected label, so supervised fine-tuning sees the same task that evaluation will test.",
    detail: ["Instruction format", "Shared label set"],
  },
  {
    title: "Load the base model in 4-bit NF4",
    body: "Qwen 2.5 1.5B is loaded quantised to 4-bit NF4 with double quantisation. This cuts memory use; the base weights are not updated during training.",
    detail: ["4-bit NF4", "Frozen base"],
  },
  {
    title: "Attach LoRA adapters",
    body: "Low-rank adapter matrices are added to the model's linear layers. Only their parameters are trainable, which keeps the run small and the checkpoint portable.",
    detail: ["LoRA", "Adapter-only training"],
  },
  {
    title: "Run supervised fine-tuning with QLoRA",
    body: "Quantised base plus trainable adapters is the QLoRA recipe. Training moves through PyTorch and Transformers with PEFT managing the adapters; checkpoints contain adapter weights only.",
    detail: ["PyTorch", "Transformers", "PEFT"],
  },
  {
    title: "Evaluate against prompting baselines",
    body: "The fine-tuned adapter is scored on the same held-out data as zero-shot and few-shot prompting of the base model, using one shared evaluation path.",
    detail: ["Zero-shot", "Few-shot", "Fine-tuned"],
  },
] as const;

export default function SarcasmDetectionPage() {
  usePageMeta(
    "Sarcasm Detection — Fine-Tuned Language Model | Vasvi Bali",
    "Sarcasm detection case study: Qwen 2.5 1.5B fine-tuned with QLoRA and 4-bit NF4 quantisation, evaluated against zero-shot and few-shot baselines.",
  );

  return (
    <ProjectShell>
      <ProjectHero
        index="02"
        eyebrow="Case study · NLP research"
        name="Sarcasm Detection"
        titleLines={["Fine-Tuned Language Model"]}
        summary="A small, open language model adapted to recognise sarcasm. Qwen 2.5 1.5B is fine-tuned with QLoRA and 4-bit NF4 quantisation on a 28K-sample corpus, then compared with zero-shot and few-shot prompting under one evaluation harness."
        tags={["PyTorch", "Transformers", "PEFT", "bitsandbytes", "QLoRA"]}
        meta={[
          { label: "Role", value: "Fine-tuning, prompt design & evaluation" },
          { label: "Base model", value: "Qwen 2.5 1.5B" },
          { label: "Method", value: "QLoRA · 4-bit NF4 quantisation" },
          { label: "Data", value: "≈ 28,000 labelled samples" },
        ]}
        variant="sarcasm"
        transitionName="project-visual-sarcasm"
      />

      <ProjectSection
        id="problem"
        index="01"
        eyebrow="Problem & objective"
        title={
          <>
            Literal words, <span className="italic text-accent">opposite meaning.</span>
          </>
        }
        description="Sarcasm inverts sentiment, which is precisely what literal classifiers miss."
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <Reveal>
            <article className="h-full rounded-2xl border border-blush bg-cream/50 p-6 sm:p-7">
              <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-accent">
                The problem
              </p>
              <h3 className="mt-3 font-serif text-[1.45rem] leading-snug text-ink">
                Positive words do not imply a positive intent.
              </h3>
              <p className="mt-3 text-[13.5px] leading-[1.8] text-muted">
                Sarcasm depends on context, tone and shared knowledge rather than on the literal
                words used. A sentiment model reading &ldquo;great, another delay&rdquo; sees praise
                where a person sees complaint. Large models handle many of these cases, but their
                behaviour depends heavily on how the task is prompted.
              </p>
            </article>
          </Reveal>

          <Reveal delay={0.08}>
            <article className="h-full rounded-2xl border border-blush bg-surface p-6 sm:p-7">
              <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-accent">
                The objective
              </p>
              <h3 className="mt-3 font-serif text-[1.45rem] leading-snug text-ink">
                Adapt a small model, then measure it fairly.
              </h3>
              <ul className="mt-3 space-y-2.5">
                {[
                  "Fine-tune a 1.5B-parameter open model on labelled sarcasm data.",
                  "Fit the run within a memory budget using 4-bit quantisation and LoRA.",
                  "Compare the fine-tuned model with zero-shot and few-shot prompting.",
                  "Score all three conditions the same way, with precision, recall and F1.",
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
        id="dataset"
        index="02"
        eyebrow="Dataset"
        title={
          <>
            28K samples, <span className="italic text-accent">one binary target.</span>
          </>
        }
        description="Enough supervision to adapt a small model, small enough to train and evaluate reproducibly."
        tone="cream"
      >
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              icon: Database,
              value: "≈ 28K",
              label: "Labelled samples",
              body: "Text samples paired with a sarcasm / non-sarcasm label, loaded and normalised before training.",
            },
            {
              icon: SlidersHorizontal,
              value: "Binary",
              label: "Classification target",
              body: "The task is framed as a two-way decision, matching the label set used by all evaluation conditions.",
            },
            {
              icon: Layers,
              value: "3",
              label: "Evaluation conditions",
              body: "The same held-out evaluation path scores zero-shot, few-shot and the fine-tuned adapter.",
            },
          ].map((item, index) => (
            <Reveal key={item.label} delay={index * 0.07}>
              <article className="h-full rounded-2xl border border-blush bg-surface p-6">
                <item.icon className="h-5 w-5 text-accent" strokeWidth={1.6} aria-hidden />
                <p className="mt-5 font-serif text-[2.3rem] leading-none text-ink">{item.value}</p>
                <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.16em] text-accent">
                  {item.label}
                </p>
                <p className="mt-3 text-[13px] leading-[1.75] text-muted">{item.body}</p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <div className="mt-5">
            <Callout title="Dataset provenance & usage">
              The corpus is an existing labelled sarcasm dataset used for research and
              educational purposes under its own terms. Its source, licence and exact train /
              validation / test split sizes are intentionally not restated on this page — refer to
              the project records. No dataset files are redistributed from this portfolio.
            </Callout>
          </div>
        </Reveal>
      </ProjectSection>

      <ProjectSection
        id="model"
        index="03"
        eyebrow="Model"
        title={
          <>
            Qwen 2.5 1.5B, <span className="italic text-accent">adapted not retrained.</span>
          </>
        }
        description="A compact decoder-only base, kept frozen and paired with trainable adapters."
      >
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <Reveal>
            <div className="rounded-2xl border border-blush bg-surface p-6 sm:p-7">
              <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-accent">
                Configuration at a glance
              </p>
              <dl className="mt-4 divide-y divide-blush/70">
                {[
                  { label: "Base model", value: "Qwen 2.5 1.5B" },
                  { label: "Parameters", value: "≈ 1.5 billion" },
                  { label: "Architecture", value: "Decoder-only causal language model" },
                  { label: "Prompt format", value: "Model chat template" },
                  { label: "Base precision", value: "4-bit NF4 (frozen)" },
                  { label: "Trainable weights", value: "LoRA adapters only" },
                ].map((row) => (
                  <div key={row.label} className="flex flex-wrap gap-2 py-3 first:pt-0 last:pb-0">
                    <dt className="font-mono text-[8.5px] uppercase tracking-[0.16em] text-muted">
                      {row.label}
                    </dt>
                    <dd className="ml-auto text-right text-[12.5px] leading-relaxed text-ink">
                      {row.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>

          <div className="space-y-4">
            <Reveal delay={0.05}>
              <article className="rounded-2xl border border-blush bg-cream/50 p-6">
                <h3 className="font-serif text-[1.35rem] text-ink">
                  Why a 1.5B model instead of a frontier API
                </h3>
                <p className="mt-2.5 text-[13px] leading-[1.8] text-muted">
                  A small open model keeps the entire pipeline reproducible and runnable on modest
                  hardware. It also makes the interesting question measurable: how far can
                  parameter-efficient adaptation take a compact model on a narrow task?
                </p>
              </article>
            </Reveal>
            <Reveal delay={0.1}>
              <article className="rounded-2xl border border-blush bg-cream/50 p-6">
                <h3 className="font-serif text-[1.35rem] text-ink">
                  What stays frozen, what learns
                </h3>
                <p className="mt-2.5 text-[13px] leading-[1.8] text-muted">
                  The quantised base weights never change during training. Only the low-rank
                  adapter matrices learn from the labelled data, which keeps checkpoints small and
                  the base model reusable for other tasks.
                </p>
              </article>
            </Reveal>
          </div>
        </div>
      </ProjectSection>

      <ProjectSection
        id="methodology"
        index="04"
        eyebrow="Fine-tuning methodology"
        title={
          <>
            QLoRA, <span className="italic text-accent">explained plainly.</span>
          </>
        }
        description="Quantise the base for memory, train adapters for behaviour."
        tone="cream"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Reveal>
            <article className="h-full rounded-2xl border border-blush bg-surface p-6">
              <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-accent">
                QLoRA
              </span>
              <h3 className="mt-3 font-serif text-[1.35rem] text-ink">Adapters on a frozen base</h3>
              <p className="mt-2.5 text-[13px] leading-[1.8] text-muted">
                QLoRA combines quantisation with Low-Rank Adaptation: the base model is loaded in
                reduced precision and never updated, while small low-rank matrices are trained to
                adapt its behaviour. The result is adapter-only training with a fraction of the
                memory cost of full fine-tuning.
              </p>
            </article>
          </Reveal>
          <Reveal delay={0.06}>
            <article className="h-full rounded-2xl border border-blush bg-surface p-6">
              <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-accent">
                4-bit NF4
              </span>
              <h3 className="mt-3 font-serif text-[1.35rem] text-ink">
                A precision chosen for weights
              </h3>
              <p className="mt-2.5 text-[13px] leading-[1.8] text-muted">
                NF4 is a 4-bit data type designed for normally distributed weights. Loading the
                frozen base in NF4, with double quantisation of the quantisation constants, reduces
                the memory footprint substantially — at the cost of some numerical approximation.
              </p>
            </article>
          </Reveal>
        </div>

        <ScrollSteps steps={METHOD} />

        <Reveal delay={0.1}>
          <div className="mt-6">
            <Callout title="Reproducibility note" icon="scroll">
              Exact hyperparameters — rank, scaling factor, learning rate, batch size, epochs and
              seed — belong in the project's training configuration and are not restated here.
              Training was run within the available compute budget, which shaped the model size and
              adapter settings.
            </Callout>
          </div>
        </Reveal>
      </ProjectSection>

      <ProjectSection
        id="pipeline"
        index="05"
        eyebrow="Model-training pipeline"
        title={
          <>
            From raw text to <span className="italic text-accent">scored predictions.</span>
          </>
        }
        description="Select a stage to inspect its role in the pipeline."
      >
        <Reveal>
          <TrainingPipeline />
        </Reveal>
      </ProjectSection>

      <ProjectSection
        id="evaluation"
        index="06"
        eyebrow="Evaluation"
        title={
          <>
            Three conditions, <span className="italic text-accent">one fair comparison.</span>
          </>
        }
        description="Prompting baselines and the fine-tuned adapter are scored on the same data with the same label mapping."
        tone="cream"
      >
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              title: "Zero-shot",
              tag: "Base model · no examples",
              body: "The frozen base model is asked to classify the text with an instruction only. This establishes what the model can do before any task-specific examples.",
            },
            {
              title: "Few-shot",
              tag: "Base model · in-context examples",
              body: "A small number of labelled examples are included in the prompt. This measures how much in-context demonstration alone can shift behaviour.",
            },
            {
              title: "Fine-tuned",
              tag: "Adapter · QLoRA",
              body: "The trained adapter answers the same task. Comparing it with the two prompt-only conditions shows the effect of adaptation rather than of wording.",
            },
          ].map((item, index) => (
            <Reveal key={item.title} delay={index * 0.07}>
              <article
                className={`flex h-full flex-col rounded-2xl border bg-surface p-6 ${
                  index === 2 ? "border-petal shadow-[0_28px_50px_-44px_rgba(179,78,115,0.6)]" : "border-blush"
                }`}
              >
                <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-accent">
                  {item.tag}
                </span>
                <h3 className="mt-2.5 font-serif text-[1.35rem] text-ink">{item.title}</h3>
                <p className="mt-2 text-[13px] leading-[1.75] text-muted">{item.body}</p>
                {index === 2 && (
                  <span className="mt-auto inline-flex w-fit items-center gap-1.5 pt-4 font-mono text-[8.5px] uppercase tracking-[0.14em] text-accent">
                    <Check className="h-3 w-3" strokeWidth={2.4} aria-hidden />
                    Adapted model
                  </span>
                )}
              </article>
            </Reveal>
          ))}
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {[
            {
              icon: Target,
              title: "Precision",
              body: "Of the samples predicted sarcastic, the share that truly are. High precision means fewer false accusations of sarcasm.",
            },
            {
              icon: BookOpen,
              title: "Recall",
              body: "Of the samples that are sarcastic, the share the model finds. High recall means fewer missed cases.",
            },
            {
              icon: BarChart3,
              title: "F1-score",
              body: "The harmonic mean of precision and recall, summarising the precision–recall trade-off in one number.",
            },
          ].map((metric, index) => (
            <Reveal key={metric.title} delay={index * 0.06}>
              <article className="h-full rounded-2xl border border-blush bg-surface p-5">
                <metric.icon className="h-4 w-4 text-accent" strokeWidth={1.7} aria-hidden />
                <h3 className="mt-3 font-serif text-[1.2rem] text-ink">{metric.title}</h3>
                <p className="mt-2 text-[12.5px] leading-[1.75] text-muted">{metric.body}</p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <div className="mt-5">
            <Callout title="No scores are published here" icon="lock">
              This page deliberately contains no precision, recall or F1 values and no improvement
              percentages. Evaluated numbers will be added only from the project's recorded output,
              with the corresponding configuration — never estimated or rounded for presentation.
            </Callout>
          </div>
        </Reveal>
      </ProjectSection>

      <ProjectSection
        id="findings"
        index="07"
        eyebrow="Findings & limitations"
        title={
          <>
            What it shows, <span className="italic text-accent">and what it doesn't.</span>
          </>
        }
        description="A clear boundary between the project's method and its unpublished results."
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <Reveal>
            <div className="h-full rounded-2xl border border-blush bg-cream/50 p-6 sm:p-7">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-surface text-accent">
                <Microscope className="h-[18px] w-[18px]" strokeWidth={1.6} aria-hidden />
              </span>
              <h3 className="mt-4 font-serif text-[1.4rem] text-ink">Research framing</h3>
              <p className="mt-2.5 text-[13px] leading-[1.8] text-muted">
                The study is built to answer a narrow question: does parameter-efficient adaptation
                of a compact open model change sarcasm-classification behaviour relative to
                prompting alone? Because all three conditions share one evaluation path and label
                set, the comparison isolates adaptation instead of prompt formatting.
              </p>
              <p className="mt-3 text-[13px] leading-[1.8] text-muted">
                Measured outcomes live in the project's evaluation records. This page reports the
                methodology and the author's contribution, not a headline score.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="h-full rounded-2xl border border-blush bg-surface p-6 sm:p-7">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-cream text-accent">
                <AlertTriangle className="h-[18px] w-[18px]" strokeWidth={1.6} aria-hidden />
              </span>
              <h3 className="mt-4 font-serif text-[1.4rem] text-ink">Known limitations</h3>
              <ul className="mt-3 space-y-2.5">
                {[
                  "Sarcasm is subjective; human labels carry disagreement that caps achievable accuracy.",
                  "The corpus is narrow in domain and language, so results should not be read as general sarcasm ability.",
                  "Class balance and split sizes are not published on this page, which limits how scores should be interpreted.",
                  "4-bit NF4 quantisation introduces numerical approximation relative to full precision.",
                  "Zero-shot and few-shot results are sensitive to prompt wording; a single template per condition is a simplification.",
                  "Training ran within a constrained compute budget, and cross-domain generalisation is not claimed.",
                ].map((item) => (
                  <li key={item} className="flex gap-3">
                    <span aria-hidden className="mt-[9px] h-px w-3 shrink-0 bg-petal" />
                    <span className="text-[12.5px] leading-[1.75] text-muted">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </ProjectSection>

      <ProjectSection
        id="stack"
        index="08"
        eyebrow="Technology stack"
        title={
          <>
            An open, <span className="italic text-accent">auditable toolchain.</span>
          </>
        }
        description="Open the cards for the role each library played and its licence."
        tone="cream"
      >
        <TechCards items={STACK} />
        <Reveal delay={0.1}>
          <p className="mt-5 font-mono text-[9px] uppercase leading-relaxed tracking-[0.14em] text-muted/80">
            Licences as published by each upstream project at the time of writing. Version pins
            live in the project's environment files.
          </p>
        </Reveal>
      </ProjectSection>

      <ProjectSection
        id="copyright"
        index="09"
        eyebrow="Copyright & attribution"
        title={
          <>
            The model, the data and <span className="italic text-accent">the boundaries.</span>
          </>
        }
        description="Original work, third-party model terms and dataset conditions stated separately."
        tone="cream"
      >
        <CopyrightBlock
          status="No scores or registrations claimed"
          intro={
            <>
              This project builds on an open-weight model and an existing labelled dataset. The
              code and configuration are the author's work; the model and data remain subject to
              their own terms. Nothing is redistributed from this page.
            </>
          }
          rows={[
            {
              label: "Project & authorship",
              value:
                "Sarcasm Detection — a research project by Vasvi Bali covering fine-tuning, prompting baselines and evaluation.",
            },
            {
              label: "Individual contribution",
              value:
                "Dataset preparation and instruction formatting, prompt design for the baseline conditions, the QLoRA training configuration, the evaluation harness and computation of precision, recall and F1.",
            },
            {
              label: "Copyright",
              value:
                "Original code, training configuration and evaluation harness are the author's work. No copyright registration number or certificate is claimed on this page.",
            },
            {
              label: "Model licensing",
              value:
                "Qwen 2.5 1.5B is used under the licence published with the model (Apache 2.0 at the time of writing). Adapter weights are derived from that base; the upstream model terms continue to apply.",
            },
            {
              label: "Dataset attribution",
              value:
                "The approximately 28,000-sample sarcasm corpus is third-party data used under its own terms. Its source and licence are recorded in the project documentation rather than asserted here, and the dataset is not redistributed.",
            },
            {
              label: "Third-party software",
              value:
                "PyTorch (BSD-3-Clause), Transformers, PEFT and Datasets (Apache 2.0) and bitsandbytes (MIT) remain under their respective licences and copyright holders.",
            },
            {
              label: "Usage & redistribution",
              value:
                "No model weights, adapter checkpoints, dataset files or source code are distributed through this portfolio. The work is presented for research and educational purposes; reuse of third-party components follows their licences.",
            },
            {
              label: "Results",
              value:
                "No performance figures are published on this page. Any future reporting of precision, recall or F1 will reference the recorded evaluation configuration rather than an estimated value.",
            },
          ]}
          notice="This section is an attribution statement, not legal advice. Verify current model and dataset licence terms against their official cards before redistributing any derived artefact."
        />
      </ProjectSection>

      <ProjectFooterNav
        previous={{ name: "EduMind", to: "/projects/edumind", index: "01" }}
      />
    </ProjectShell>
  );
}
