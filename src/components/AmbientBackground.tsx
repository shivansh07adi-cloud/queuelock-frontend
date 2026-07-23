"use client";

import { useEffect, useRef } from "react";

// Stands in for "a video background" without needing a video asset: a small
// number of soft, slow-drifting light beams on canvas, colored with the two
// signal hues. Deliberately subtle and slow - this is ambience behind a
// booking flow, not a hero animation competing for attention.
export default function AmbientBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);

    const beams = [
      { x: 0.2, y: 0.15, r: 420, hue: "255, 122, 51", speed: 0.00012, phase: 0 },
      { x: 0.8, y: 0.3, r: 500, hue: "53, 208, 192", speed: 0.00009, phase: 2 },
      { x: 0.5, y: 0.8, r: 380, hue: "255, 122, 51", speed: 0.00015, phase: 4 },
    ];

    let frame = 0;
    let raf: number;

    const draw = (t: number) => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "#0a0b0f";
      ctx.fillRect(0, 0, width, height);

      for (const beam of beams) {
        const drift = prefersReducedMotion ? 0 : t * beam.speed;
        const x = (beam.x + Math.sin(drift + beam.phase) * 0.06) * width;
        const y = (beam.y + Math.cos(drift * 0.8 + beam.phase) * 0.06) * height;
        const grad = ctx.createRadialGradient(x, y, 0, x, y, beam.r);
        grad.addColorStop(0, `rgba(${beam.hue}, 0.16)`);
        grad.addColorStop(1, `rgba(${beam.hue}, 0)`);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
      }

      frame++;
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 -z-10 h-full w-full"
    />
  );
}
