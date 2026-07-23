"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// The signature piece: slots-remaining rendered like an airport/train
// departure board. Each digit flips independently when the value changes -
// which is exactly the right metaphor for a booking system built around
// queues and waiting, unlike a generic animated number ticker.
function Flap({ char }: { char: string }) {
  return (
    <span className="relative inline-block h-[1.15em] w-[0.72em] overflow-hidden rounded-[3px] bg-ink-raised text-center align-top">
      <AnimatePresence mode="popLayout">
        <motion.span
          key={char}
          initial={{ rotateX: 90, opacity: 0 }}
          animate={{ rotateX: 0, opacity: 1 }}
          exit={{ rotateX: -90, opacity: 0 }}
          transition={{ duration: 0.28, ease: "easeInOut" }}
          className="absolute inset-0 flex items-center justify-center"
          style={{ transformOrigin: "center" }}
        >
          {char}
        </motion.span>
      </AnimatePresence>
      <span className="absolute inset-x-0 top-1/2 h-px bg-black/40" />
    </span>
  );
}

export default function FlapCounter({
  value,
  digits = 2,
}: {
  value: number;
  digits?: number;
}) {
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    setDisplay(value);
  }, [value]);

  const str = String(Math.max(0, display)).padStart(digits, "0").split("");

  return (
    <div
      className="flex gap-[3px] font-[family-name:var(--font-flap)] text-4xl font-semibold text-paper sm:text-5xl"
      role="status"
      aria-label={`${display} slots remaining`}
    >
      {str.map((char, i) => (
        <Flap key={i} char={char} />
      ))}
    </div>
  );
}
