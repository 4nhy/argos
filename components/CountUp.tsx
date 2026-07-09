"use client";

import { motion } from "framer-motion";
import { useRef, useState } from "react";

/** Counts smoothly from 0 to `value` each time it scrolls into view — and RESETS
 *  to 0 when it scrolls out, so it replays every time you scroll back to it. */
export function CountUp({
  value,
  decimals = 2,
  prefix = "",
  suffix = "",
  duration = 1.6,
}: {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
}) {
  const [n, setN] = useState(0);
  const raf = useRef<number | null>(null);

  const run = () => {
    if (raf.current) cancelAnimationFrame(raf.current);
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / (duration * 1000));
      const eased = 1 - Math.pow(1 - p, 3);
      setN(value * eased);
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
  };

  const reset = () => {
    if (raf.current) cancelAnimationFrame(raf.current);
    raf.current = null;
    setN(0);
  };

  return (
    <motion.span
      className="tabular-nums"
      onViewportEnter={run}
      onViewportLeave={reset}
      viewport={{ margin: "-40px" }}
    >
      {prefix}
      {n.toFixed(decimals)}
      {suffix}
    </motion.span>
  );
}
