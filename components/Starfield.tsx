"use client";

import { useEffect, useRef } from "react";

/** Subtle drifting, twinkling starfield on pure black — the backdrop for the chrome. */
export default function Starfield() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0,
      h = 0,
      raf = 0;
    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    let stars: {
      x: number;
      y: number;
      z: number;
      r: number;
      tw: number;
      phase: number;
    }[] = [];

    const build = () => {
      w = canvas.width = window.innerWidth * DPR;
      h = canvas.height = window.innerHeight * DPR;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      const count = Math.min(340, Math.floor((window.innerWidth * window.innerHeight) / 6500));
      stars = Array.from({ length: count }, () => {
        const z = Math.random();
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          z,
          r: (z * 1.5 + 0.25) * DPR,
          tw: 0.4 + Math.random() * 0.6,
          phase: Math.random() * Math.PI * 2,
        };
      });
    };

    let t = 0;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      t += 0.006;
      for (const s of stars) {
        // slow parallax drift up-left, wrap around
        s.x -= s.z * 0.12 * DPR;
        s.y -= s.z * 0.05 * DPR;
        if (s.x < 0) s.x = w;
        if (s.y < 0) s.y = h;
        const a = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t * s.tw * 3 + s.phase));
        const cool = s.z > 0.7;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = cool
          ? `rgba(200, 220, 245, ${a * 0.9})`
          : `rgba(235, 240, 248, ${a * 0.8})`;
        ctx.shadowBlur = s.z > 0.85 ? 6 * DPR : 0;
        ctx.shadowColor = "rgba(180,205,240,0.7)";
        ctx.fill();
      }
      ctx.shadowBlur = 0;
      raf = requestAnimationFrame(draw);
    };

    build();
    draw();
    window.addEventListener("resize", build);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", build);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      style={{ position: "fixed", inset: 0, zIndex: -1, pointerEvents: "none" }}
    />
  );
}
