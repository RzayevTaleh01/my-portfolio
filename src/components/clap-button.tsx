"use client";

import { AnimatePresence, motion, useAnimate } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export interface ClapStrings {
  label: string;
  thanks: string;
  already: string;
  count: string;
}

/** Remembers the clap in this browser too, as a backup to the server cookie. */
const STORAGE_KEY = "portfolio-clapped";
const NOTE_TIME = 2200;
const SPARKS = 8;

function rememberedClap() {
  try {
    return localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

function rememberClap() {
  try {
    localStorage.setItem(STORAGE_KEY, "1");
  } catch {}
}

/** A raised hand with three motion lines - the "clap". Paths after lucide's Hand icon. */
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

/**
 * Medium-style applause, pinned to the bottom-left corner. One clap per
 * visitor (a cookie on the server, localStorage in the browser); the total
 * is shared by everyone and stored with the site's Vercel Blob store.
 */
export function ClapButton({ t }: { t: ClapStrings }) {
  const [count, setCount] = useState<number | null>(null);
  const [clapped, setClapped] = useState(false);
  const [burst, setBurst] = useState(0);
  const [note, setNote] = useState<"thanks" | "already" | null>(null);
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
        setClapped(data.clapped || rememberedClap());
      })
      // Offline or failed: at least show this browser's own clap.
      .catch(() => active && setClapped(rememberedClap()));
    return () => {
      active = false;
      clearTimeout(noteTimer.current);
    };
  }, []);

  function showNote(kind: "thanks" | "already") {
    clearTimeout(noteTimer.current);
    setNote(kind);
    noteTimer.current = setTimeout(() => setNote(null), NOTE_TIME);
  }

  async function clap() {
    if (clapped) {
      animate(scope.current, { x: [0, -5, 5, -3, 3, 0] }, { duration: 0.4 });
      showNote("already");
      return;
    }

    // Optimistic: the animation and +1 play at once, the server catches up.
    const before = count ?? 0;
    setClapped(true);
    setCount(before + 1);
    setBurst((b) => b + 1);
    rememberClap();
    showNote("thanks");
    animate(scope.current, { scale: [1, 1.22, 0.94, 1], rotate: [0, -12, 8, 0] }, { duration: 0.55, ease: "easeOut" });

    try {
      const res = await fetch("/api/claps", { method: "POST" });
      if (!res.ok) throw new Error(String(res.status));
      const data = (await res.json()) as { count: number };
      // A freshly written blob can be missing from the first listing.
      setCount(Math.max(data.count, before + 1));
    } catch {
      setClapped(false);
      setCount(before);
      setNote(null);
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {}
    }
  }

  const showCount = count !== null && count > 0;

  return (
    <div className="no-print fixed bottom-10 left-5 z-40 lg:bottom-12 lg:left-6">
      <div className="relative">
        {/* The note floats above the button, like Medium's "+1" bubble. */}
        <AnimatePresence>
          {note && (
            <motion.div
              key={note}
              role="status"
              initial={{ opacity: 0, y: 8, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="absolute bottom-full left-0 mb-3 flex items-center gap-2 whitespace-nowrap rounded-full bg-primary py-1.5 pl-1.5 pr-3.5 text-xs font-medium text-primary-foreground shadow-[0_10px_30px_-12px_rgb(0_0_0/0.5)]"
            >
              {note === "thanks" && (
                <span className="flex size-6 items-center justify-center rounded-full bg-accent text-[11px] font-semibold text-white">+1</span>
              )}
              <span className={cn(note === "already" && "pl-2")}>{note === "thanks" ? t.thanks : t.already}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Burst: a ring and sparks thrown out from the button on the clap. */}
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
                    className={cn("absolute left-1/2 top-1/2 -ml-[3px] -mt-[3px] size-1.5", i % 2 ? "rounded-full bg-accent" : "rotate-45 rounded-[1px] bg-primary")}
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
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.9 }}
          aria-label={showCount ? `${t.label} (${t.count.replace("{count}", String(count))})` : t.label}
          aria-pressed={clapped}
          title={clapped ? t.already : t.label}
          className={cn(
            "relative flex size-14 flex-col items-center justify-center rounded-full border bg-surface shadow-[0_10px_30px_-12px_rgb(0_0_0/0.35)] transition-colors",
            clapped ? "border-accent bg-accent-soft text-accent" : "text-muted-foreground hover:border-border-strong hover:text-foreground",
          )}
        >
          {/* The count sits inside the button, so it stays readable over any page content. */}
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
