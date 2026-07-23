"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export type DropCard = {
  id: string;
  name: string;
  slotsRemaining: number;
  totalSlots: number;
  status: string;
};

// Cards arranged along a shallow arc, each tilted toward the viewer based on
// its position - a simplified "dome" rather than a flat grid. The centre
// card sits forward and upright; cards further from centre rotate and sink
// back slightly, like standing in front of a curved shop window.
export default function DomeGallery({ drops }: { drops: DropCard[] }) {
  const [active, setActive] = useState<number | null>(null);
  const count = drops.length;
  const mid = (count - 1) / 2;

  if (count === 0) {
    return (
      <p className="py-16 text-center text-paper-dim">
        No drops are live right now. Check back soon.
      </p>
    );
  }

  return (
    <div
      className="flex flex-wrap items-end justify-center gap-4 py-12"
      style={{ perspective: "1400px" }}
    >
      {drops.map((drop, i) => {
        const offset = i - mid;
        const rotateY = offset * -8;
        const translateZ = -Math.abs(offset) * 24;
        const translateY = Math.abs(offset) * 10;
        const isActive = active === i;

        return (
          <motion.div
            key={drop.id}
            onMouseEnter={() => setActive(i)}
            onMouseLeave={() => setActive(null)}
            animate={{
              rotateY: isActive ? 0 : rotateY,
              z: isActive ? 40 : translateZ,
              y: isActive ? -8 : translateY,
            }}
            transition={{ type: "spring", stiffness: 220, damping: 24 }}
            style={{ transformStyle: "preserve-3d" }}
            className="w-64 shrink-0"
          >
            <Link
              href={`/drops/${drop.id}`}
              className="block rounded-2xl border border-ink-line bg-ink-raised p-5 transition-colors hover:border-signal-cyan/50"
            >
              <p className="mb-4 text-xs uppercase tracking-widest text-paper-dim">
                {drop.status === "live" ? "Live now" : drop.status}
              </p>
              <h3 className="mb-6 font-[family-name:var(--font-display)] text-lg font-medium">
                {drop.name}
              </h3>
              <div className="flex items-baseline gap-1 font-[family-name:var(--font-flap)]">
                <span className="text-3xl font-semibold text-signal-cyan">
                  {drop.slotsRemaining}
                </span>
                <span className="text-sm text-paper-dim">
                  / {drop.totalSlots} left
                </span>
              </div>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
