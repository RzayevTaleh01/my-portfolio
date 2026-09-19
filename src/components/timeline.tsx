"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";
import { useRef } from "react";

/**
 * Vertical timeline whose accent line fills as the reader scrolls through it.
 * Children should render a <TimelineDot /> as their first element.
 */
export function Timeline({ children, gap = "space-y-12" }: { children: React.ReactNode; gap?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 60%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });

  return (
    <div ref={ref} className="relative pl-8">
      <span aria-hidden className="absolute bottom-2 left-[7px] top-2 w-px bg-border" />
      <motion.span
        aria-hidden
        className="timeline-fill absolute bottom-2 left-[7px] top-2 w-px origin-top bg-accent"
        style={{ scaleY: reduce ? 1 : progress }}
      />
      <div className={gap}>{children}</div>
    </div>
  );
}

/** Marker on the line; lights up as the fill reaches it. */
export function TimelineDot() {
  return (
    <motion.span
      aria-hidden
      className="absolute -left-8 top-1 flex size-[15px] items-center justify-center rounded-full border bg-background"
      initial={{ borderColor: "var(--border-strong)" }}
      whileInView={{ borderColor: "var(--accent)" }}
      viewport={{ once: true, margin: "0px 0px -40% 0px" }}
      transition={{ duration: 0.4 }}
    >
      <motion.span
        className="size-[7px] rounded-full bg-accent"
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, margin: "0px 0px -40% 0px" }}
        transition={{ type: "spring", stiffness: 400, damping: 20, delay: 0.1 }}
      />
    </motion.span>
  );
}
