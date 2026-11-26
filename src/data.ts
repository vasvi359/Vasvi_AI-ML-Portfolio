import { assetPath } from "./paths";

export const NAV_LINKS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "achievements", label: "Achievements" },
  { id: "contact", label: "Contact" },
] as const;

export const SOCIALS = {
  github: "https://github.com/vasvi359",
  linkedin: "https://www.linkedin.com/in/vasvi-bali-69a3b730a",
  email: "vasvibali@gmail.com",
  phone: "+91-91039 07192",
  phoneHref: "+919103907192",
};

export const HERO_STATS = [
  { value: "2×", label: "SIH national rounds" },
  { value: "2", label: "Internships" },
  { value: "8.2", label: "CGPA" },
];

export const MARQUEE_WORDS = [
  "NLP",
  "Retrieval-Augmented Generation",
  "Computer Vision",
  "FastAPI",
  "LLM Fine-Tuning",
  "Multi-Agent Systems",
  "Backend Engineering",
];

export const SKILL_GROUPS = [
  {
    id: "programming",
    icon: "code",
    title: "Programming",
    blurb: "Languages I think in.",
    items: ["Python", "C", "C++", "SQL"],
  },
  {
    id: "core",
    icon: "layers",
    title: "Core CS",
    blurb: "The fundamentals underneath.",
    items: ["DSA", "OOP", "DBMS", "Operating Systems", "System Design"],
  },
  {
    id: "backend",
    icon: "server",
    title: "Backend",
    blurb: "APIs built to ship.",
    items: ["FastAPI", "REST API Design", "MySQL", "Git", "GitHub", "Docker", "CI/CD"],
  },
  {
    id: "ml",
    icon: "brain",
    title: "AI / ML",
    blurb: "Models, trained and evaluated.",
    items: ["TensorFlow", "PyTorch", "Scikit-learn", "CNN", "LSTM", "YOLO", "DBSCAN", "Random Forest"],
  },
  {
    id: "data",
    icon: "sparkles",
    title: "AI & Data",
    blurb: "Where intelligence meets data.",
    items: [
      "NLP",
      "Computer Vision",
      "RAG",
      "LLMs",
      "Multi-Agent Systems",
      "Prompt Engineering",
      "Pandas",
      "NumPy",
      "Matplotlib",
    ],
  },
  {
    id: "tools",
    icon: "wrench",
    title: "Tools",
    blurb: "The day-to-day toolkit.",
    items: ["LangChain", "ChromaDB", "Streamlit", "OpenAI API", "Microsoft Azure"],
  },
] as const;

export type SkillDetail = {
  summary: string;
  evidence: { where: string; text: string }[];
};

/** Keyed by constellation node id — where each star has actually been used. */
export const SKILL_DETAILS: Record<string, SkillDetail> = {
  python: {
    summary: "The language every build here runs on — APIs, pipelines and models.",
    evidence: [
      {
        where: "Cerebree · Current",
        text: "CV Parser REST API, Pandas job-ranking engine and the LLM extraction pipeline, all in Python.",
      },
      {
        where: "EduMind",
        text: "Multi-agent orchestration, RAG retrieval and the answer-evaluation logic.",
      },
      { where: "LeetCode", text: "27+ data-structures problems solved in Python." },
    ],
  },
  fastapi: {
    summary: "The API layer: routing, validation, clean JSON out.",
    evidence: [
      {
        where: "Cerebree · Current",
        text: "Designed and built a CV Parser REST API that takes PDF, DOCX and TXT and returns structured JSON, end to end.",
      },
    ],
  },
  mysql: {
    summary: "Relational fundamentals under the backend work.",
    evidence: [
      {
        where: "Core CS",
        text: "SQL and DBMS coursework — schema design, joins and query work.",
      },
    ],
  },
  docker: {
    summary: "Packaging services so they run the same everywhere.",
    evidence: [
      {
        where: "Backend toolkit",
        text: "Docker alongside Git-based CI/CD — reproducible builds and deployable service images.",
      },
    ],
  },
  rag: {
    summary: "Answers grounded in course material, not model guesswork.",
    evidence: [
      {
        where: "EduMind",
        text: "Retrieval-augmented responses over subject-specific documents — the core of the platform.",
      },
      {
        where: "Research",
        text: "The approach behind the co-authored paper and the copyright-registration grant.",
      },
    ],
  },
  chromadb: {
    summary: "The vector store holding EduMind's knowledge.",
    evidence: [
      {
        where: "EduMind",
        text: "Embeddings and similarity search that keep every answer tied to source material.",
      },
    ],
  },
  langchain: {
    summary: "Multi-agent plumbing and retrieval chains.",
    evidence: [
      {
        where: "EduMind",
        text: "A modular MicroAgent architecture with LangChain retrieval — agents that each own one job.",
      },
    ],
  },
  nlp: {
    summary: "Text in, meaning out — extraction, classification, evaluation.",
    evidence: [
      {
        where: "Cerebree · Current",
        text: "LLM-assisted field extraction from resumes, with a rules-based fallback for the hard cases.",
      },
      {
        where: "Sarcasm Detection",
        text: "A fine-tuned language model benchmarked against zero-shot and few-shot baselines.",
      },
    ],
  },
  pytorch: {
    summary: "Training, quantising and honestly measuring models.",
    evidence: [
      {
        where: "Sarcasm Detection",
        text: "Qwen 2.5 1.5B fine-tuned with QLoRA and 4-bit NF4 quantisation, scored on precision, recall and F1.",
      },
      {
        where: "Evaluation harness",
        text: "A reproducible PyTorch + Hugging Face pipeline for baseline comparison.",
      },
    ],
  },
  tensorflow: {
    summary: "Deep learning for real-time computer vision.",
    evidence: [
      {
        where: "Enfuse Solutions · Jun–Jul 2025",
        text: "CNN, LSTM and YOLO models for an AI exam-proctoring system — real-time monitoring and anomaly flagging.",
      },
      {
        where: "Research",
        text: "Model outputs and metrics analysed against literature, then written up into a paper.",
      },
    ],
  },
};

export const EXPERIENCE = [
  {
    company: "Cerebree",
    role: "AI Junior Engineer Intern",
    place: "Remote",
    period: "Jul 2026 — Present",
    current: true,
    points: [
      "Designed and built a CV Parser REST API using FastAPI, handling PDF, DOCX and TXT formats and returning structured JSON — covering routing, request validation and API design end to end.",
      "Built a Python/Pandas Job Matching & Ranking Engine that scores postings against role, experience, skills, location, freshness and seniority signals for candidate shortlisting.",
      "Integrated an LLM-assisted extraction pipeline with a Python rules-based fallback, using pdfplumber and python-docx for multi-format text extraction and refined prompts for complex fields.",
    ],
  },
  {
    company: "Enfuse Solutions Pvt. Ltd.",
    role: "AI/ML Intern",
    place: "Mumbai, India",
    period: "Jun 2025 — Jul 2025",
    current: false,
    points: [
      "Contributed to an AI-powered exam-proctoring system combining CNN, LSTM, YOLO, DBSCAN and Random Forest for real-time monitoring and anomaly flagging.",
      "Analyzed model outputs and performance metrics against research literature and authored a paper covering system architecture, methodology and model evaluation.",
    ],
  },
] as const;

export const PROJECTS = [
  {
    index: "01",
    name: "EduMind",
    detailPath: "/projects/edumind",
    visualId: "project-visual-edumind",
    tagline: "A grounded, multi-agent educational assistant.",
    description:
      "A multi-agent educational assistant built with Python, LangChain, ChromaDB, Streamlit and Retrieval-Augmented Generation, so answers stay grounded in course-specific material instead of general LLM knowledge.",
    stack: ["Python", "LangChain", "ChromaDB", "Streamlit", "RAG"],
    features: [
      "Course-specific grounded responses.",
      "Automatic MCQ and short-answer generation.",
      "Personalized answer evaluation.",
      "Modular MicroAgent architecture.",
    ],
    highlight:
      "Co-authored research paper · Government grant secured for copyright registration of the platform.",
    github: null,
    accent: "from-cream via-blush to-petal",
    image: assetPath("/images/edumind-dashboard.webp"),
    imageAlt:
      "EduMind dashboard showing 12 courses, 8 completed tasks, 92% average performance and a six-month performance chart.",
  },
  {
    index: "02",
    name: "Sarcasm Detection",
    detailPath: "/projects/sarcasm-detection",
    visualId: "project-visual-sarcasm",
    tagline: "A fine-tuned LLM, measured honestly.",
    description:
      "Fine-tuned Qwen 2.5 1.5B with QLoRA and 4-bit NF4 quantization on a 28K-sample sarcasm detection dataset, paired with an evaluation harness that compares it against zero-shot and few-shot baselines.",
    stack: ["PyTorch", "Hugging Face", "QLoRA", "PEFT", "bitsandbytes"],
    features: [
      "Fine-tuned language model.",
      "Zero-shot, few-shot and fine-tuned comparison.",
      "Precision, recall and F1-score evaluation.",
      "Reproducible PyTorch and Hugging Face pipeline.",
    ],
    highlight: null,
    github: null,
    accent: "from-blush via-petal to-rose",
    image: assetPath("/images/sarcasm-detector-dashboard.webp"),
    imageAlt:
      "Sarcasm Detector dashboard with a text input, a 92% highly sarcastic result and a weekly insight chart.",
  },
] as const;

export const ACHIEVEMENTS = [
  {
    year: "2025",
    title: "Smart India Hackathon — National Round Qualifier",
    description: "Qualified for the national round and led the computer vision module design.",
    icon: "trophy",
    featured: true,
  },
  {
    year: "2024",
    title: "Smart India Hackathon — National Round Qualifier",
    description: "Second consecutive national-round qualification; contributed to system architecture and documentation.",
    icon: "trophy",
    featured: true,
  },
  {
    year: "2023",
    title: "Dark Pattern Buster Hackathon — Nodal Centre Qualifier",
    description: "Responsible for frontend design and UI/UX.",
    icon: "sparkle",
    featured: false,
  },
  {
    year: "Ongoing",
    title: "27+ DSA problems on LeetCode",
    description: "A steady practice of data structures and algorithms.",
    icon: "code",
    featured: false,
  },
  {
    year: "Research",
    title: "Research & copyright grant",
    description:
      "Co-authored research and secured a government grant supporting copyright registration of the EduMind AI education platform.",
    icon: "scroll",
    featured: false,
  },
] as const;

export const CERTIFICATIONS = [
  { name: "AI Fundamentals", issuer: "AWS", date: "Feb 2025" },
  {
    name: "ChatGPT for Everyone",
    issuer: "Guvi HCL",
    date: "Apr 2025",
  },
  {
    name: "Generative AI Landscape",
    issuer: "Guvi HCL",
    date: "May 2025",
  },
] as const;
