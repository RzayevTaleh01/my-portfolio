"use client";

import { MotionConfig, motion, type HTMLMotionProps } from "motion/react";

/** Respects the user's "reduce motion" OS setting for every animation. */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

/** A short, quiet fade the first time a section scrolls into view. */
export function Reveal(props: HTMLMotionProps<"div">) {
  return (
    <motion.div
      data-reveal
      initial={{ opacity: 0, y: 6 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -40px 0px" }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      {...props}
    />
  );
}
