"use client";

import { useEffect, useRef } from "react";

type Splash = {
  x: number;
  y: number;
  born: number;
  size: number;
  color: string;
};

// Replaces the system cursor with a small dot, and leaves an expanding,
// fading ring of color wherever the pointer moves - a "splash" trail. Clicks
// spawn a bigger splash so booking/pay actions get a satisfying pop.
export default function SplashCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const splashes = useRef<Splash[]>([]);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return; // skip on touch devices
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canvas = canvasRef.current;
    const dot = dotRef.current;
    if (!canvas || !dot) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);

    let lastSpawn = 0;
    const onMove = (e: PointerEvent) => {
      dot.style.transform = `translate(${e.clientX - 4}px, ${e.clientY - 4}px)`;
      const now = performance.now();
      if (now - lastSpawn > 40) {
        lastSpawn = now;
        splashes.current.push({
          x: e.clientX,
          y: e.clientY,
          born: now,
          size: 18,
          color: Math.random() > 0.5 ? "53, 208, 192" : "255, 122, 51",
        });
      }
    };
    const onDown = (e: PointerEvent) => {
      splashes.current.push({
        x: e.clientX,
        y: e.clientY,
        born: performance.now(),
        size: 44,
        color: "255, 122, 51",
      });
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerdown", onDown);

    let raf: number;
    const LIFE_MS = 650;
    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const now = performance.now();
      splashes.current = splashes.current.filter((s) => now - s.born < LIFE_MS);
      for (const s of splashes.current) {
        const age = (now - s.born) / LIFE_MS;
        const radius = s.size * (0.3 + age * 1.4);
        const alpha = 1 - age;
        ctx.beginPath();
        ctx.arc(s.x, s.y, radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${s.color}, ${alpha * 0.6})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-50 hidden h-full w-full sm:block"
      />
      <div
        ref={dotRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-50 hidden h-2 w-2 rounded-full bg-paper sm:block"
        style={{ willChange: "transform" }}
      />
    </>
  );
}
