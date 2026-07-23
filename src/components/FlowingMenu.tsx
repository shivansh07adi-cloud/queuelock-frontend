"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

type MenuItem = { label: string; href: string };

export default function FlowingMenu({ items }: { items: MenuItem[] }) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <nav
      className="relative flex items-center gap-1 rounded-full border border-ink-line bg-ink-raised/60 p-1 backdrop-blur-sm"
      onMouseLeave={() => setHovered(null)}
    >
      {items.map((item, i) => (
        <Link
          key={item.href}
          href={item.href}
          onMouseEnter={() => setHovered(i)}
          className="relative z-10 px-4 py-2 text-sm font-medium text-paper-dim transition-colors"
          style={{ color: hovered === i ? "var(--ink)" : undefined }}
        >
          {hovered === i && (
            <motion.span
              layoutId="flowing-menu-highlight"
              className="absolute inset-0 -z-10 rounded-full bg-signal-cyan"
              transition={{ type: "spring", stiffness: 500, damping: 35 }}
            />
          )}
          <span className="relative">{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}
