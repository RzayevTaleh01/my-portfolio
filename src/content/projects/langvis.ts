import type { Project } from "../types";

export const langvis: Project = {
  slug: "langvis",
  title: "LangVis",
  tagline: "A real-time voice language tutor that corrects every sentence and takes learners from A2 to B2.",
  category: "ai",
  status: "active",
  year: 2026,
  featured: true,
  links: { repo: "https://github.com/RzayevTaleh01/LangVis_AI" },
  facts: [
    { label: "Course", value: "24 units · A2→B2" },
    { label: "Skills tracked", value: "~40" },
    { label: "Teaching methods", value: "18" },
    { label: "Audio", value: "16 kHz in · 24 kHz out" },
  ],
  overview: [
    "LangVis is a desktop speaking course. The learner talks; the tutor listens, corrects the sentence, asks for a repeat, and offers a stronger way to say it. It remembers mistakes and turns repeated ones into short drills.",
    "It is deliberately not an assistant: it has one job - to make the learner speak better - and every part of the architecture serves that loop.",
  ],
  problem: [
    "Speaking practice needs instant, low-latency conversation, but good correction needs careful analysis of each sentence. Doing both in one model call either slows the conversation or makes feedback shallow.",
  ],
  architecture: {
    summary:
      "Two model paths run side by side: a live audio session keeps the conversation fluid, while a small, fast model analyses each sentence in the background and updates the learner model that shapes the next prompt.",
    layers: [
      {
        name: "Interface",
        nodes: [
          { name: "Syllabus", detail: "Stages, units, rules" },
          { name: "Coaching", detail: "Corrections, tips, upgrades" },
          { name: "Dictionary", detail: "Words one step above level" },
          { name: "Tutor face", detail: "Drawn at runtime from audio level" },
        ],
      },
      {
        name: "Live session",
        nodes: [
          { name: "Audio I/O", detail: "Mic & speaker streams" },
          { name: "Gemini Live", detail: "Two-way real-time voice" },
          { name: "Reconnect", detail: "Session resumption" },
        ],
      },
      {
        name: "Tutor domain",
        nodes: [
          { name: "Language tutor", detail: "observe → measure → teach" },
          { name: "Analysis", detail: "Per-sentence, off the hot path" },
          { name: "Curriculum", detail: "Skills, units, methods" },
          { name: "Progress", detail: "Level, skills, vocabulary" },
        ],
      },
      {
        name: "Core",
        nodes: [
          { name: "Plugin loader", detail: "Tools, observers, prompt blocks" },
          { name: "Wake word", detail: "Optional, fully offline" },
          { name: "Self-log", detail: "Own output & errors" },
        ],
      },
      {
        name: "Local storage",
        nodes: [
          { name: "level.json", detail: "Source of truth" },
          { name: "progress.md", detail: "Readable, regenerated" },
          { name: "memory/", detail: "Settings & API key" },
        ],
      },
    ],
  },
  components: [
    {
      name: "Live session",
      role: "Conversation without waiting",
      points: [
        "Streams 16 kHz microphone audio to the Gemini Live API and plays 24 kHz responses.",
        "Handles server GoAway messages and settings changes with a controlled reconnect that can keep or drop conversation context.",
      ],
      tech: "google-genai · sounddevice · asyncio TaskGroup",
    },
    {
      name: "Sentence analysis",
      role: "Measures every utterance",
      points: [
        "A lightweight model returns structured JSON per sentence: errors, corrected form, skill tags, CEFR evidence.",
        "Runs in the background, so the live model never waits for it.",
        "Local word-level checks answer cheap questions (was this word used?) without a model call.",
      ],
      tech: "gemini-flash-lite · tolerant JSON parsing",
    },
    {
      name: "Curriculum & progress",
      role: "What to teach next",
      points: [
        "6 stages × 4 units with target forms, model sentences and named teaching methods.",
        "~40 grammar skills, each with mastery, real mistakes and a review date.",
        "The three weakest skills become the focus that is injected into the next session prompt.",
      ],
    },
    {
      name: "Plugin system",
      role: "Extensible without touching the core",
      points: [
        "Any file in plugins/ with a PLUGIN dict and run() becomes a tool the tutor can call.",
        "Optional hooks let a plugin observe every sentence, add standing prompt instructions or appear in the UI.",
      ],
    },
  ],
  flow: [
    { title: "Speak", detail: "Audio streams to the live model; the tutor answers with correction first, then continues." },
    { title: "Analyse", detail: "The transcript goes to the background analyser, which tags errors and skills." },
    { title: "Update", detail: "Level, skill mastery and vocabulary are written to level.json; progress.md is regenerated." },
    { title: "Adapt", detail: "The same mistake three times triggers a drill; weakest skills shape the next prompt." },
    { title: "Progress", detail: "When target forms are strong, the next unit starts without restarting the session." },
  ],
  deepDives: [
    {
      title: "Two models, two speeds",
      body: [
        "The live model is optimised for latency, the analysis model for structure and cost. Splitting them means the conversation stays natural while every sentence still gets a full grammatical review.",
        "Results flow back through the plugin hook format_for_prompt(), so the next turn of the tutor knows what to focus on.",
      ],
    },
    {
      title: "Controlled reconnects",
      body: [
        "Long voice sessions end, devices change and the language can be switched mid-session. Instead of crashing, a reconnect signal is raised inside the session's TaskGroup. A keep_context flag decides whether the session-resumption handle survives - kept for an audio-device change, dropped for a new language.",
      ],
      code: {
        lang: "python",
        title: "main.py (simplified)",
        source: `class _ReconnectSignal(Exception):
    """Raised inside the session TaskGroup to force a clean reconnect."""

def request_reconnect(self, keep_context: bool = True, reason: str = ""):
    self._reconnect_keep = keep_context   # False → drop resumption handle
    self._reconnect_reason = reason
    self._reconnect_event.set()

# e.g. switching language starts a fresh context,
# changing the microphone keeps the conversation
self.request_reconnect(keep_context=False, reason="new language")
self.request_reconnect(keep_context=True, reason="audio device")`,
      },
    },
    {
      title: "Plugin contract",
      body: [
        "Plugins are discovered at start-up. The same interface powers the language tutor itself, which keeps the core small and makes adding a language a data change rather than a code change.",
      ],
      code: {
        lang: "python",
        title: "plugins/_template.py (condensed)",
        source: `PLUGIN = {
    "name": "my_plugin",          # unique snake_case tool name
    "description": "When the tutor should call this tool.",
    "parameters": {"type": "OBJECT", "properties": {...}, "required": []},
}

def run(parameters: dict, player=None, session_memory=None) -> str:
    # Return a short sentence - it is spoken back to the learner.
    # Never raise: catch errors and return them as text.
    ...

# Optional hooks
def observe(text, player): ...             # see every sentence
def format_for_prompt() -> str: ...        # add standing instructions
def set_language(name: str): ...           # react to the language select`,
      },
    },
  ],
  decisions: [
    {
      title: "Level is measured, never guessed",
      detail: "CEFR level is a rolling score over the learner's own recent sentences, not a placement quiz.",
    },
    {
      title: "Local-first privacy",
      detail: "API key, settings and all progress files stay on the machine and are git-ignored; audio goes only to the model during a session.",
    },
    {
      title: "No shipped images",
      detail: "The tutor's face, icons and progress bars are drawn at runtime, so the interface stays sharp at any display scale.",
    },
    {
      title: "Languages as data",
      detail: "Adding a language means writing its skills and stages in the curriculum and a word-level detector - the interface already supports it.",
    },
  ],
  stack: [
    { group: "AI", items: ["Gemini Live API", "Gemini Flash / Flash-Lite", "openWakeWord (optional)"] },
    { group: "App", items: ["Python", "PyQt6", "asyncio", "sounddevice", "NumPy"] },
    { group: "Storage", items: ["JSON (level.json)", "Markdown (progress.md)"] },
  ],
  next: ["Slovak course (curriculum and detector already planned).", "Pronunciation scoring from the audio stream."],
};
