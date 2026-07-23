"use client";

import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  homeVx: number;
  homeVy: number;
  vx: number;
  vy: number;
  r: number;
  color: string;
};

// A field of small drifting dots that gently repel away from the pointer -
// mouse on desktop, finger on mobile (Pointer Events cover both). Each dot
// drifts on its own slow random path, and when the pointer gets close it
// pushes the dot away, then the dot eases back to its normal drift. This is
// the "things move away when you touch them" effect.
export default function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      init();
    };

    const colors = ["255, 122, 51", "53, 208, 192", "242, 240, 234"];
    // Fewer particles on small screens - keeps it light on phones.
    const COUNT = width < 640 ? 34 : 60;
    const REPEL_RADIUS = width < 640 ? 90 : 130;

    let particles: Particle[] = [];
    function init() {
      particles = Array.from({ length: COUNT }).map(() => {
        const homeVx = (Math.random() - 0.5) * 0.15;
        const homeVy = (Math.random() - 0.5) * 0.15;
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          homeVx,
          homeVy,
          vx: homeVx,
          vy: homeVy,
          r: 1 + Math.random() * 1.8,
          color: colors[Math.floor(Math.random() * colors.length)],
        };
      });
    }
    init();
    window.addEventListener("resize", resize);

    const pointer = { x: -9999, y: -9999, active: false };
    const onMove = (e: PointerEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.active = true;
    };
    const onLeave = () => {
      pointer.active = false;
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointerdown", onMove);

    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      for (const p of particles) {
        // Repulsion: if the pointer is close, push the particle directly
        // away from it, stronger the closer it is.
        if (pointer.active) {
          const dx = p.x - pointer.x;
          const dy = p.y - pointer.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < REPEL_RADIUS && dist > 0.001) {
            const force = (1 - dist / REPEL_RADIUS) * 1.8;
            p.vx += (dx / dist) * force;
            p.vy += (dy / dist) * force;
          }
        }

        // Ease back toward the particle's own gentle drift speed, so it
        // doesn't fly off forever - it settles back into ambient motion.
        p.vx += (p.homeVx - p.vx) * 0.02;
        p.vy += (p.homeVy - p.vy) * 0.02;

        p.x += p.vx;
        p.y += p.vy;

        // Wrap around edges instead of bouncing - keeps the field feeling
        // continuous rather than boxed in.
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, 0.5)`;
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerdown", onMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 h-full w-full"
    />
  );
}
