"use client";

import { X } from "lucide-react";
import { AnimatePresence, motion, useAnimate } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Celebration, makePieces, type Piece } from "@/components/celebration";
import { cn } from "@/lib/utils";

export interface ClapStrings {
  label: string;
  thanks: string;
  already: string;
  count: string;
  prompt: string;
  dismiss: string;
}

const STORAGE_KEY = "portfolio-clapped";
const PROMPT_KEY = "portfolio-clap-prompt";
const NOTE_TIME = 2200;
const PROMPT_DELAY = 25000;
const PARTY_TIME = 5200;
const SPARKS = 10;

function promptDismissed() {
  try {
    return sessionStorage.getItem(PROMPT_KEY) === "1";
  } catch {
    return false;
  }
}

function dismissPrompt() {
  try {
    sessionStorage.setItem(PROMPT_KEY, "1");
  } catch {}
}

function rememberedClap() {
  try {
    return localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

function forgetClap() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
}

function rememberClap() {
  try {
    localStorage.setItem(STORAGE_KEY, "1");
  } catch {}
}

function ClapIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden className={className}>
      <g transform="rotate(-14 13 14) translate(1.5 1.5) scale(0.9)">
        <path d="M18 11V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2" />
        <path d="M14 10V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v2" />
        <path d="M10 10.5V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2v8" />
        <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
      </g>
      <path d="M2.5 6.5 1 5M4.5 4 4 2M7 3.2 7.6 1.3" strokeWidth={1.5} />
    </svg>
  );
}

export function ClapButton({ t }: { t: ClapStrings }) {
  const [count, setCount] = useState<number | null>(null);
  const [clapped, setClapped] = useState(false);
  const [burst, setBurst] = useState(0);
  const [note, setNote] = useState<"thanks" | "already" | null>(null);
  const [prompt, setPrompt] = useState(false);
  const [ready, setReady] = useState(false);
  const [party, setParty] = useState<{ key: number; pieces: Piece[] } | null>(null);
  const partyTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [scope, animate] = useAnimate();
  const noteTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    let active = true;
    fetch("/api/claps")
      .then((res) => res.json())
      .then((data: { count: number; clapped: boolean }) => {
        if (!active) return;
        setCount(data.count);
        if (data.clapped) rememberClap();
        else forgetClap();
        setClapped(data.clapped);
        setReady(true);
      })
      .catch(() => {
        if (!active) return;
        setClapped(rememberedClap());
        setReady(true);
      });
    return () => {
      active = false;
      clearTimeout(noteTimer.current);
      clearTimeout(partyTimer.current);
    };
  }, []);

  useEffect(() => {
    if (!ready || clapped || promptDismissed()) return;
    const timer = setTimeout(() => setPrompt(true), PROMPT_DELAY);
    return () => clearTimeout(timer);
  }, [ready, clapped]);

  function closePrompt() {
    setPrompt(false);
    dismissPrompt();
  }

  function showNote(kind: "thanks" | "already") {
    clearTimeout(noteTimer.current);
    setNote(kind);
    noteTimer.current = setTimeout(() => setNote(null), NOTE_TIME);
  }

  async function clap() {
    if (prompt) closePrompt();
    if (clapped) {
      animate(scope.current, { x: [0, -5, 5, -3, 3, 0] }, { duration: 0.4 });
      showNote("already");
      return;
    }

    const rect = (scope.current as HTMLElement | null)?.getBoundingClientRect();
    if (rect) {
      clearTimeout(partyTimer.current);
      setParty({
        key: Date.now(),
        pieces: makePieces({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }, window.innerWidth, window.innerHeight),
      });
      partyTimer.current = setTimeout(() => setParty(null), PARTY_TIME);
    }

    const before = count ?? 0;
    setClapped(true);
    setCount(before + 1);
    setBurst((b) => b + 1);
    rememberClap();
    showNote("thanks");
    animate(scope.current, { scale: [1, 1.22, 0.94, 1], rotate: [0, -12, 8, 0] }, { duration: 0.55, ease: "easeOut" });

    try {
      const res = await fetch("/api/claps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ page: window.location.pathname }),
      });
      if (!res.ok) throw new Error(String(res.status));
      const data = (await res.json()) as { count: number };
      setCount(Math.max(data.count, before + 1));
    } catch {
      setClapped(false);
      setCount(before);
      setNote(null);
      forgetClap();
    }
  }

  const showCount = count !== null && count > 0;

  return (
    <div className="no-print fixed bottom-10 left-5 z-40 lg:bottom-12 lg:left-6">
      {party && <Celebration key={party.key} pieces={party.pieces} />}
      <div className="relative">
        <AnimatePresence>
          {prompt && !note && (
            <motion.div
              key="prompt"
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="always-light absolute bottom-full left-0 mb-2 flex w-max max-w-[15rem] items-start gap-2 rounded-2xl rounded-bl-sm border bg-surface py-2.5 pl-3.5 pr-2 text-sm leading-snug text-foreground shadow-[0_16px_40px_-20px_rgb(0_0_0/0.4)]"
            >
              <button type="button" onClick={clap} className="text-left">
                {t.prompt}
              </button>
              <button
                type="button"
                onClick={closePrompt}
                aria-label={t.dismiss}
                className="-mt-0.5 grid size-6 shrink-0 place-items-center rounded-md text-subtle-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <X className="size-3.5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {note && (
            <motion.div
              key={note}
              role="status"
              initial={{ opacity: 0, y: 8, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="absolute bottom-full left-0 mb-2 flex items-center gap-2 whitespace-nowrap rounded-full bg-primary py-1.5 pl-1.5 pr-3.5 text-xs font-medium text-primary-foreground shadow-[0_10px_30px_-12px_rgb(0_0_0/0.5)]"
            >
              {note === "thanks" && (
                <span className="flex size-6 items-center justify-center rounded-full bg-accent text-[11px] font-semibold text-white">+1</span>
              )}
              <span className={cn(note === "already" && "pl-2")}>{note === "thanks" ? t.thanks : t.already}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {burst > 0 && (
            <motion.span key={burst} className="pointer-events-none absolute inset-0" initial={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <motion.span
                className="absolute inset-0 rounded-full border-2 border-accent"
                initial={{ scale: 1, opacity: 0.7 }}
                animate={{ scale: 1.9, opacity: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
              {Array.from({ length: SPARKS }, (_, i) => {
                const angle = (i / SPARKS) * Math.PI * 2 - Math.PI / 2;
                return (
                  <motion.span
                    key={i}
                    className={cn("absolute left-1/2 top-1/2 -ml-[3px] -mt-[3px] size-1.5", i % 2 ? "rounded-full bg-accent" : "rotate-45 rounded-[1px] bg-accent/60")}
                    initial={{ x: 0, y: 0, scale: 0.4, opacity: 1 }}
                    animate={{ x: Math.cos(angle) * 44, y: Math.sin(angle) * 44, scale: [0.4, 1.3, 0.2], opacity: [1, 1, 0] }}
                    transition={{ duration: 0.65, ease: "easeOut", delay: 0.04 }}
                  />
                );
              })}
            </motion.span>
          )}
        </AnimatePresence>

        <motion.button
          ref={scope}
          type="button"
          onClick={clap}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.9 }}
          aria-label={showCount ? `${t.label} (${t.count.replace("{count}", String(count))})` : t.label}
          aria-pressed={clapped}
          title={clapped ? t.already : t.label}
          className={cn(
            "relative flex size-14 flex-col items-center justify-center rounded-full border bg-surface shadow-[0_10px_30px_-12px_rgb(0_0_0/0.35)] transition-colors",
            clapped ? "border-accent text-accent" : "text-muted-foreground hover:border-border-strong hover:text-accent",
          )}
        >
          <ClapIcon className={cn("transition-all", showCount ? "-mt-1 size-6" : "size-7")} />
          {showCount && (
            <span className="-mb-0.5 h-3.5 overflow-hidden text-[11px] font-semibold leading-3.5 tabular-nums">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={count}
                  className="block"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -10, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                >
                  {count}
                </motion.span>
              </AnimatePresence>
            </span>
          )}
        </motion.button>
      </div>
    </div>
  );
}
