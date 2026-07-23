"use client";

import { useEffect, useState } from "react";

// Covers its children with a grid of tiles that dissolve away in a
// staggered wave, revealing the content underneath. Used for state changes
// that deserve a moment of ceremony - e.g. a booking flipping from "held"
// to "confirmed" - rather than the number just silently changing.
export default function PixelTransition({
  triggerKey,
  children,
  cols = 12,
  rows = 6,
}: {
  triggerKey: string | number;
  children: React.ReactNode;
  cols?: number;
  rows?: number;
}) {
  const [covering, setCovering] = useState(false);

  useEffect(() => {
    setCovering(true);
    const timer = setTimeout(() => setCovering(false), 650);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerKey]);

  const tiles = Array.from({ length: cols * rows });

  return (
    <div className="relative">
      {children}
      {covering && (
        <div
          className="pointer-events-none absolute inset-0 grid overflow-hidden rounded-2xl"
          style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
          aria-hidden="true"
        >
          {tiles.map((_, i) => {
            const col = i % cols;
            const row = Math.floor(i / cols);
            const delay = (col + row) * 14;
            return (
              <span
                key={i}
                className="bg-signal-amber"
                style={{
                  animation: `pixel-dissolve 450ms ease forwards`,
                  animationDelay: `${delay}ms`,
                }}
              />
            );
          })}
        </div>
      )}
      <style>{`
        @keyframes pixel-dissolve {
          0% { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(0); }
        }
      `}</style>
    </div>
  );
}
