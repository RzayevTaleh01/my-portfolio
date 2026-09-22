"use client";

import { motion } from "motion/react";
import { createPortal } from "react-dom";

export interface Piece {
  left: number;
  top: number;
  xs: number[];
  ys: number[];
  rotate: number;
  size: number;
  shape: "square" | "circle" | "strip";
  color: string;
  delay: number;
  duration: number;
}

const COLORS = ["var(--accent)", "var(--accent)", "var(--accent)", "var(--primary)", "#f5b83d", "#f06292", "#8b7cf6", "#34c3a4"];
const SHAPES = ["square", "circle", "strip"] as const;

const pick = <T,>(list: readonly T[]) => list[Math.floor(Math.random() * list.length)];

function looks() {
  return {
    rotate: (Math.random() - 0.5) * 1440,
    size: 8 + Math.random() * 9,
    shape: pick(SHAPES),
    color: pick(COLORS),
  };
}

export function makePieces(origin: { x: number; y: number }, width: number, height: number): Piece[] {
  const reach = Math.max(width, height);
  const burst = Array.from({ length: 110 }, () => {
    const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.4;
    const speed = reach * (0.25 + Math.random() * 0.55);
    const x = Math.cos(angle) * speed;
    const y = Math.sin(angle) * speed;
    return {
      ...looks(),
      left: origin.x,
      top: origin.y,
      xs: [0, x * 0.8, x * 1.05],
      ys: [0, y * 0.85, y + height * (0.6 + Math.random() * 0.5)],
      delay: Math.random() * 0.15,
      duration: 2 + Math.random() * 1.2,
    };
  });
  const rain = Array.from({ length: 120 }, () => {
    const sway = (Math.random() - 0.5) * 160;
    return {
      ...looks(),
      left: Math.random() * width,
      top: -30,
      xs: [0, sway, sway * -0.4],
      ys: [0, height * 0.55, height + 80],
      delay: 0.1 + Math.random() * 0.9,
      duration: 2.4 + Math.random() * 1.6,
    };
  });
  return [...burst, ...rain];
}

export function Celebration({ pieces }: { pieces: Piece[] }) {
  return createPortal(
    <div className="pointer-events-none fixed inset-0 z-[60] overflow-hidden" aria-hidden>
      {pieces.map((p, i) => (
        <motion.span
          key={i}
          className="absolute block"
          style={{
            left: p.left,
            top: p.top,
            width: p.shape === "strip" ? p.size * 0.45 : p.size,
            height: p.shape === "strip" ? p.size * 1.8 : p.size,
            marginLeft: -p.size / 2,
            marginTop: -p.size / 2,
            background: p.color,
            borderRadius: p.shape === "circle" ? "9999px" : "2px",
          }}
          initial={{ x: 0, y: 0, rotate: 0, opacity: 1, scale: 0.6 }}
          animate={{ x: p.xs, y: p.ys, rotate: p.rotate, opacity: [1, 1, 0], scale: [0.6, 1, 0.9] }}
          transition={{ duration: p.duration, delay: p.delay, ease: ["easeOut", "easeIn"], times: [0, 0.35, 1] }}
        />
      ))}
    </div>,
    document.body,
  );
}
