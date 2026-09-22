"use client";

import { motion } from "motion/react";
import { createPortal } from "react-dom";

export interface Piece {
  x: number;
  y: number;
  drop: number;
  rotate: number;
  size: number;
  shape: "square" | "circle" | "strip";
  color: string;
  delay: number;
  duration: number;
}

const COLORS = ["var(--accent)", "var(--accent)", "var(--accent)", "var(--primary)", "#f5b83d", "#f06292", "#8b7cf6", "#34c3a4"];

export function makePieces(count: number): Piece[] {
  return Array.from({ length: count }, () => {
    const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.25;
    const speed = 160 + Math.random() * 320;
    const shapes = ["square", "circle", "strip"] as const;
    return {
      x: Math.cos(angle) * speed,
      y: Math.sin(angle) * speed,
      drop: 260 + Math.random() * 320,
      rotate: (Math.random() - 0.5) * 900,
      size: 6 + Math.random() * 6,
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      delay: Math.random() * 0.12,
      duration: 1.5 + Math.random() * 0.9,
    };
  });
}

export function Celebration({ origin, pieces }: { origin: { x: number; y: number }; pieces: Piece[] }) {
  return createPortal(
    <div className="pointer-events-none fixed inset-0 z-[60] overflow-hidden" aria-hidden>
      {pieces.map((p, i) => (
        <motion.span
          key={i}
          className="absolute block"
          style={{
            left: origin.x,
            top: origin.y,
            width: p.shape === "strip" ? p.size * 0.45 : p.size,
            height: p.shape === "strip" ? p.size * 1.8 : p.size,
            marginLeft: -p.size / 2,
            marginTop: -p.size / 2,
            background: p.color,
            borderRadius: p.shape === "circle" ? "9999px" : "2px",
          }}
          initial={{ x: 0, y: 0, rotate: 0, opacity: 1, scale: 0.6 }}
          animate={{
            x: [0, p.x * 0.75, p.x],
            y: [0, p.y * 0.8, p.y + p.drop],
            rotate: p.rotate,
            opacity: [1, 1, 0],
            scale: [0.6, 1, 0.9],
          }}
          transition={{ duration: p.duration, delay: p.delay, ease: ["easeOut", "easeIn"], times: [0, 0.35, 1] }}
        />
      ))}
    </div>,
    document.body,
  );
}
