"use client";

import { Bot, RotateCcw, X } from "lucide-react";
import Link from "next/link";
import { Popover } from "radix-ui";
import { useEffect, useRef, useState } from "react";
import { startRouteProgress } from "@/components/top-loader";
import { cn } from "@/lib/utils";

export interface AssistantTopic {
  id: string;
  label: string;
  answer: string;
  link?: { label: string; href: string };
}

export interface AssistantStrings {
  open: string;
  close: string;
  title: string;
  subtitle: string;
  greeting: string;
  note: string;
  reset: string;
  teaser: string;
  dismiss: string;
  typing: string;
}

interface Turn {
  question: string;
  topic: AssistantTopic;
}

const TEASER_DELAY = 1500;
const THINKING_TIME = 900;
const TEASER_DISMISSED = "assistant-teaser-dismissed";

/**
 * Floating "AI assistant". The answers are scripted from the site content -
 * no model behind it yet, and the panel says so.
 */
export function Assistant({ topics, t }: { topics: AssistantTopic[]; t: AssistantStrings }) {
  const [open, setOpen] = useState(false);
  const [turns, setTurns] = useState<Turn[]>([]);
  const [thinking, setThinking] = useState<Turn | null>(null);
  const [teaser, setTeaser] = useState(false);
  const feed = useRef<HTMLDivElement>(null);

  const asked = new Set(turns.map((turn) => turn.topic.id));
  const remaining = topics.filter((topic) => !asked.has(topic.id) && topic.id !== thinking?.topic.id);

  // Nudge first-time visitors once the page has settled.
  useEffect(() => {
    let dismissed = false;
    try {
      dismissed = sessionStorage.getItem(TEASER_DISMISSED) === "1";
    } catch {
      // Private mode or blocked storage: just show it.
    }
    if (dismissed) return;
    const timer = setTimeout(() => setTeaser(true), TEASER_DELAY);
    return () => clearTimeout(timer);
  }, []);

  // Follow the conversation like a real chat (the container scrolls smoothly via CSS).
  useEffect(() => {
    const el = feed.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [turns, thinking]);

  const hideTeaser = () => {
    setTeaser(false);
    try {
      sessionStorage.setItem(TEASER_DISMISSED, "1");
    } catch {
      // Nothing to remember if storage is unavailable.
    }
  };

  const ask = (topic: AssistantTopic) => {
    const turn = { question: topic.label, topic };
    setThinking(turn);
    setTimeout(() => {
      setTurns((prev) => [...prev, turn]);
      setThinking(null);
    }, THINKING_TIME);
  };

  return (
    <Popover.Root
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next) hideTeaser();
      }}
    >
      {/* Same backdrop as the search dialog, so the chat reads as a layer above the page. */}
      {open && <div className="assistant-overlay fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px]" aria-hidden />}

      <div className="no-print fixed bottom-10 right-5 z-50 flex flex-col items-end gap-3 lg:bottom-12 lg:right-6">
        {teaser && !open && (
          <div className="msg-in flex max-w-[15rem] items-start gap-2 rounded-2xl rounded-br-sm border bg-surface px-3.5 py-3 text-[13px] leading-relaxed shadow-[0_16px_40px_-20px_rgb(0_0_0/0.4)]">
            <button onClick={() => setOpen(true)} className="text-left">
              {t.teaser}
            </button>
            <button
              onClick={hideTeaser}
              aria-label={t.dismiss}
              className="-mr-1 -mt-1 flex size-6 shrink-0 items-center justify-center rounded-lg text-subtle-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <X className="size-3" />
            </button>
          </div>
        )}

        <Popover.Trigger
          aria-label={open ? t.close : t.open}
          className="relative flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_10px_30px_-10px_rgb(0_0_0/0.45)] transition-transform hover:scale-105 data-[state=open]:scale-95"
        >
          {open ? <X className="size-5" /> : <Bot className="size-7" />}
          {/* "Online" dot, hidden while the panel is open */}
          {!open && (
            <span className="absolute right-0.5 top-0.5 flex size-3">
              <span className="status-ping absolute inline-flex size-full rounded-full bg-accent" />
              <span className="relative inline-flex size-3 rounded-full border-2 border-primary bg-accent" />
            </span>
          )}
        </Popover.Trigger>
      </div>

      <Popover.Portal>
        <Popover.Content
          align="end"
          side="top"
          sideOffset={12}
          collisionPadding={16}
          className="popover-content z-50 flex max-h-[min(80vh,660px)] w-[min(26rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border bg-surface shadow-[0_24px_60px_-20px_rgb(0_0_0/0.35)]"
        >
          <header className="flex items-center gap-2.5 border-b px-4 py-3">
            <Bot className="size-5 shrink-0 text-muted-foreground" />
            <div className="min-w-0">
              <p className="text-sm font-semibold tracking-tight">{t.title}</p>
              <p className="truncate text-xs text-muted-foreground">{t.subtitle}</p>
            </div>
            <div className="ml-auto flex items-center gap-1">
              {turns.length > 0 && (
                <button
                  onClick={() => setTurns([])}
                  aria-label={t.reset}
                  title={t.reset}
                  className="flex size-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <RotateCcw className="size-3.5" />
                </button>
              )}
              <Popover.Close
                aria-label={t.close}
                className="flex size-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <X className="size-3.5" />
              </Popover.Close>
            </div>
          </header>

          <div ref={feed} className="flex-1 space-y-3 overflow-y-auto scroll-smooth px-4 py-4">
            <Bubble>{t.greeting}</Bubble>

            {turns.map((turn, i) => (
              <div key={`${turn.topic.id}-${i}`} className="space-y-3">
                <Question>{turn.question}</Question>
                <Bubble>
                  {turn.topic.answer}
                  {turn.topic.link && (
                    <Link
                      href={turn.topic.link.href}
                      onClick={() => {
                        startRouteProgress();
                        setOpen(false);
                      }}
                      className="mt-2 flex w-fit items-center gap-1 text-[13px] font-medium underline decoration-border-strong underline-offset-4 transition-colors hover:decoration-foreground"
                    >
                      {turn.topic.link.label} →
                    </Link>
                  )}
                </Bubble>
              </div>
            ))}

            {thinking && (
              <div className="space-y-3">
                <Question>{thinking.question}</Question>
                <div className="msg-in w-fit rounded-2xl rounded-bl-sm bg-muted px-3.5 py-3" aria-label={t.typing}>
                  <span className="flex gap-1">
                    <Dot delay="0ms" />
                    <Dot delay="150ms" />
                    <Dot delay="300ms" />
                  </span>
                </div>
              </div>
            )}
          </div>

          {remaining.length > 0 && (
            <div className="flex flex-wrap gap-1.5 border-t px-4 py-3">
              {remaining.map((topic) => (
                <button
                  key={topic.id}
                  onClick={() => ask(topic)}
                  disabled={thinking !== null}
                  className="rounded-full border px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:border-border-strong hover:text-foreground disabled:opacity-50"
                >
                  {topic.label}
                </button>
              ))}
            </div>
          )}

          <p className={cn("px-4 pb-3 text-[11px] text-subtle-foreground", remaining.length > 0 && "pt-0")}>{t.note}</p>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

function Bubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="msg-in w-fit max-w-[90%] rounded-2xl rounded-bl-sm bg-muted px-3 py-2 text-[13px] leading-relaxed">
      {children}
    </div>
  );
}

function Question({ children }: { children: React.ReactNode }) {
  return (
    <p className="msg-in ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-3 py-2 text-[13px] leading-relaxed text-primary-foreground">
      {children}
    </p>
  );
}

function Dot({ delay }: { delay: string }) {
  return <span className="typing-dot size-1.5 rounded-full bg-subtle-foreground" style={{ animationDelay: delay }} />;
}
