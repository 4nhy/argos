"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { LiquidMetalButton } from "@/components/ui/liquid-metal-button";

const LiquidText = dynamic(() => import("./LiquidText"), { ssr: false });

export default function Hero() {
  const goto = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section
      id="top"
      className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center"
    >
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="eyebrow mb-7"
      >
        Systematic · Market-Neutral · Uncorrelated
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1.1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        style={{ filter: "drop-shadow(0 0 60px rgba(120,160,205,0.18))" }}
      >
        <h1 className="sr-only">ARGOS</h1>
        <LiquidText text="ARGOS" speed={0.4} />
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.7 }}
        className="mt-7 max-w-xl text-base leading-relaxed sm:text-lg"
        style={{ color: "var(--text-dim)" }}
      >
        A five-strategy, market-neutral book. Each edge is weak on its own —
        combined and uncorrelated, they compound into something that doesn&apos;t
        care which way the market moves.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.9 }}
        className="mt-10 flex items-center gap-4"
      >
        <LiquidMetalButton label="Track record" onClick={() => goto("performance")} />
        <a href="#strategy" className="btn btn-ghost">
          How it works
        </a>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2"
          style={{ color: "var(--text-faint)" }}
        >
          <span className="mono text-[10px] tracking-[0.3em]">SCROLL</span>
          <span style={{ fontSize: 18 }}>↓</span>
        </motion.div>
      </motion.div>
    </section>
  );
}
