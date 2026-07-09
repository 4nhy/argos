"use client";

import { LiquidMetal } from "@paper-design/shaders-react";
import { motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** A word (or multi-line phrase) rendered in flowing liquid metal — the paper.design
 *  liquid-metal shader fed an SVG mask of the text, transparent background.
 *  The shader is LAZY: it only mounts when scrolled near the viewport (and unmounts
 *  when far away), so many of these can live on one page without melting the GPU. */
export default function LiquidText({
  text = "",
  lines,
  width = "min(760px, 94vw)",
  height = "min(200px, 26vw)",
  fontSize = 200,
  weight = 800,
  speed = 0.4,
  align = "middle",
}: {
  text?: string;
  lines?: string[];
  width?: string;
  height?: string;
  fontSize?: number;
  weight?: number;
  speed?: number;
  align?: "start" | "middle";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);

  // Mount the shader well BEFORE it enters view, then keep it mounted (sticky) so
  // scrolling past and back never unmounts/reprocesses it (no harsh pop / disappear).
  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { rootMargin: "500px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [seen]);

  // A backgrounded tab throttles the shader's animation frames, so the GL canvas
  // comes back frozen/choppy. Remount it when the tab becomes visible again so it
  // repaints fresh (and fades back in via the motion.div below) instead of popping.
  const [wake, setWake] = useState(0);
  useEffect(() => {
    const onVis = () => {
      if (document.visibilityState === "visible") setWake((w) => w + 1);
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  const image = useMemo(() => {
    const arr = lines && lines.length ? lines : [text];
    const lineH = fontSize * 1.08;
    const w = 1600;
    const h = Math.round(lineH * arr.length + fontSize * 0.5);
    const anchor = align === "start" ? "start" : "middle";
    const tx = align === "start" ? 24 : 800;
    const texts = arr
      .map(
        (ln, i) =>
          `<text x="${tx}" y="${Math.round((i + 0.5) * lineH + fontSize * 0.2)}" text-anchor="${anchor}" font-family="Arial, Helvetica, sans-serif" font-weight="${weight}" font-size="${fontSize}" letter-spacing="-4" fill="#ffffff">${esc(ln)}</text>`,
      )
      .join("");
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${texts}</svg>`;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  }, [text, lines, fontSize, weight, align]);

  return (
    <div ref={ref} style={{ width, height }}>
      {seen ? (
        <motion.div
          key={wake}
          style={{ width: "100%", height: "100%" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        >
          <LiquidMetal
            image={image}
            style={{ width: "100%", height: "100%" }}
            colorBack="rgba(0, 0, 0, 0)"
            colorTint="#ffffff"
            repetition={2}
            softness={0.1}
            shiftRed={0.3}
            shiftBlue={0.3}
            distortion={0.07}
            contour={0.4}
            angle={70}
            speed={speed}
            scale={1}
            fit="contain"
          />
        </motion.div>
      ) : null}
    </div>
  );
}
