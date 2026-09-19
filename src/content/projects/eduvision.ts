import type { Project } from "../types";

export const eduvision: Project = {
  slug: "eduvision",
  title: "EduVision",
  tagline: "An adaptive intelligent tutoring system with a neuro-symbolic architecture.",
  kind: "research",
  year: 2026,
  featured: true,
  links: {
    repo: "https://github.com/RzayevTaleh01/intelligent-tutor-system",
    docs: "https://rzayevtaleh01.github.io/intelligent-tutor-system/docs/",
  },
  facts: [
    { label: "Engines", value: "5 + RL agent" },
    { label: "LLM", value: "Llama 3.1 8B" },
    { label: "Learner model", value: "BKT + SRS" },
    { label: "Policy", value: "PPO" },
  ],
  overview: [
    "EduVision simulates one-on-one human tutoring. It models what each student knows, decides what to teach next, explains it in natural language and grades the answer - then updates its model of the student and repeats.",
    "Instead of wrapping a language model, the system separates decisions from language: probabilistic and learned components decide what happens pedagogically, and the LLM only turns that decision into dialogue.",
  ],
  problem: [
    "LLM chatbots answer questions, but they do not teach: they have no persistent model of the learner, no notion of difficulty, and they may state things that are not in the course material.",
    "A tutor needs memory (what does this student know?), strategy (what should come next?) and grounding (is the explanation correct for this course?).",
  ],
  architecture: {
    summary:
      "Five decoupled engines communicate through the Pedagogy Engine, which acts as the decision centre. A reinforcement-learning agent tunes difficulty, while platform services handle experiments, explainability and cost.",
    layers: [
      {
        name: "Clients",
        nodes: [
          { name: "Student", detail: "Adaptive chat & submissions" },
          { name: "Teacher", detail: "Lessons, PDFs & rubrics" },
          { name: "API consumers", detail: "Swagger / OpenAPI" },
        ],
      },
      {
        name: "API",
        nodes: [
          { name: "FastAPI", detail: "Courses, sessions, chat, learner state" },
          { name: "Auth", detail: "JWT · bcrypt" },
        ],
      },
      {
        name: "Engines",
        nodes: [
          { name: "Tutor", detail: "Dialogue & persona" },
          { name: "Pedagogy", detail: "Strategy + PPO agent" },
          { name: "Learner", detail: "BKT mastery & SRS" },
          { name: "Assessment", detail: "Rubric & code grading" },
          { name: "Knowledge", detail: "RAG + concept graph" },
        ],
      },
      {
        name: "Platform",
        nodes: [
          { name: "Plugins", detail: "Domain-specific content" },
          { name: "Experiments", detail: "A/B tests · bandit optimizer" },
          { name: "Explainability", detail: "Why was this chosen?" },
          { name: "Runtime", detail: "Cost control · rate limits · metrics" },
        ],
      },
      {
        name: "Models & data",
        nodes: [
          { name: "Llama 3.1 8B", detail: "via Together AI" },
          { name: "MiniLM-L6-v2", detail: "Sentence embeddings" },
          { name: "PostgreSQL", detail: "pgvector · async SQLAlchemy" },
          { name: "PPO policy", detail: "stable-baselines3" },
        ],
      },
    ],
  },
  components: [
    {
      name: "Knowledge Engine",
      role: "Long-term memory of the course",
      points: [
        "Ingests PDFs and text, chunks them into ~512-token units and embeds each chunk.",
        "Stores vectors in PostgreSQL with pgvector and relations between concepts in a NetworkX graph.",
        "Serves top-k context to the tutor so explanations stay grounded in course material.",
      ],
      tech: "pypdf · sentence-transformers · pgvector · NetworkX",
    },
    {
      name: "Learner Engine",
      role: "Probabilistic model of the student",
      points: [
        "Tracks a mastery probability per skill with Bayesian Knowledge Tracing.",
        "Schedules reviews with spaced repetition before a skill is forgotten.",
        "Classifies errors with an error taxonomy to select remediation.",
      ],
      tech: "BKT · SRS · PostgreSQL",
    },
    {
      name: "Pedagogy Engine",
      role: "Decides what and how to teach",
      points: [
        "Combines learner state and retrieved context into an instructional strategy (Socratic questioning, scaffolding, Feynman).",
        "Delegates difficulty to a PPO agent that observes mastery, accuracy, latency, fatigue and current difficulty.",
      ],
      tech: "Gymnasium · stable-baselines3",
    },
    {
      name: "Tutor Engine",
      role: "Turns strategy into dialogue",
      points: [
        "Generates explanations, hints and questions with Llama 3.1 8B Instruct Turbo.",
        "Prompted as an educational guide, constrained by the Pedagogy Engine's chosen strategy.",
        "LLM access goes through a provider interface, so the model vendor can be swapped.",
      ],
      tech: "Together AI · provider abstraction",
    },
    {
      name: "Assessment Engine",
      role: "Grades and gives feedback",
      points: [
        "AST analysis for code, semantic similarity for text, and LLM grading against teacher rubrics.",
        "Feeds correctness back into the Learner Engine, closing the loop.",
      ],
    },
  ],
  flow: [
    { title: "Ingest", detail: "A teacher uploads material; the Knowledge Engine chunks, embeds and links it." },
    { title: "Start session", detail: "The Learner Engine loads the student's mastery profile; the Pedagogy Engine picks a first topic." },
    { title: "Teach", detail: "The Tutor Engine presents the topic in the chosen style, grounded by retrieved chunks." },
    { title: "Assess", detail: "The student answers; the Assessment Engine grades it and returns feedback." },
    { title: "Adapt", detail: "BKT updates mastery; the PPO agent raises, keeps or lowers difficulty; the loop repeats." },
  ],
  deepDives: [
    {
      title: "Bayesian Knowledge Tracing",
      body: [
        "Mastery is a hidden variable. Each answer is evidence, weighted by the probability of guessing correctly without knowing (G) and slipping despite knowing (S). After the posterior is computed, the model accounts for learning during the attempt (T).",
      ],
      formula:
        "P(L_t \\mid \\text{correct}) = \\frac{P(L_t)(1-S)}{P(L_t)(1-S) + (1-P(L_t))\\,G} \\qquad P(L_{t+1}) = P(L_t \\mid \\text{obs}) + \\big(1 - P(L_t \\mid \\text{obs})\\big)\\,T",
      code: {
        lang: "python",
        title: "src/core/adaptive/bkt.py",
        source: `if is_correct:
    numerator = L_prev * (1 - skill.p_slip)
    denominator = numerator + (1 - L_prev) * skill.p_guess
else:
    numerator = L_prev * skill.p_slip
    denominator = numerator + (1 - L_prev) * (1 - skill.p_guess)

L_given_evidence = numerator / (denominator + 1e-10)
L_new = L_given_evidence + (1 - L_given_evidence) * skill.p_learn
skill.p_mastery = min(0.99, max(0.01, L_new))`,
      },
    },
    {
      title: "Difficulty as a reinforcement-learning problem",
      body: [
        "The agent observes a 5-dimensional state - mastery, last-answer accuracy, normalised latency, a fatigue index and current difficulty - and chooses one of three actions: decrease, keep or increase difficulty.",
        "The reward trades off learning gain, staying in the flow zone and session fatigue. A small discrete action space keeps the policy stable and easy to explain.",
      ],
      formula: "R_t = \\alpha\\,(m_{t+1} - m_t) + \\beta\\,\\mathbb{1}[\\text{flow}_t] - \\gamma\\,\\text{fatigue}_t",
    },
    {
      title: "Grounded answers with retrieval",
      body: [
        "Each question is embedded and compared to course chunks by cosine similarity. The top-k chunks are injected into the tutor's system prompt as context, so the model explains the course - not the internet.",
      ],
      formula: "\\operatorname{sim}(a, b) = \\frac{a \\cdot b}{\\lVert a \\rVert\\,\\lVert b \\rVert}",
    },
  ],
  decisions: [
    {
      title: "Neuro-symbolic instead of an LLM wrapper",
      detail: "Pedagogical decisions are made by interpretable models and the LLM only generates language. Every decision can be traced and explained.",
    },
    {
      title: "BKT over deep knowledge tracing",
      detail: "Four interpretable parameters per skill, cheap per-answer updates and reasonable behaviour with very little data per student.",
    },
    {
      title: "pgvector inside PostgreSQL",
      detail: "Vectors, learner state and course data live in one transactional store - no separate vector database to operate.",
    },
    {
      title: "Evaluation built in",
      detail: "A/B experiment and bandit modules compare the RL policy with a static difficulty progression on learning gain, engagement and dropout.",
    },
  ],
  stack: [
    { group: "AI", items: ["Llama 3.1 8B (Together AI)", "sentence-transformers", "stable-baselines3 (PPO)", "Gymnasium", "faster-whisper"] },
    { group: "Backend", items: ["Python 3.11", "FastAPI", "SQLAlchemy (async)", "Pydantic", "JWT auth"] },
    { group: "Data", items: ["PostgreSQL", "pgvector", "NetworkX"] },
    { group: "Ops & docs", items: ["Docker Compose", "GitHub Actions", "Docusaurus (EN / AZ)"] },
  ],
  next: [
    "Voice and image input (Whisper, vision) for multimodal tutoring.",
    "Teacher analytics dashboard with real-time mastery maps.",
    "Optimising the policy for long-term retention rather than per-session reward.",
  ],
};
