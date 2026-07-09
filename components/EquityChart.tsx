"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

type Pt = { date: string; v: number };

export default function EquityChart({ data }: { data: Pt[] }) {
  const W = 1000;
  const H = 340;
  const pad = { t: 20, r: 16, b: 28, l: 44 };

  const { line, area, ticks, yTicks, last } = useMemo(() => {
    const vals = data.map((d) => d.v);
    const min = Math.min(...vals);
    const max = Math.max(...vals);
    const range = max - min || 1;
    const iw = W - pad.l - pad.r;
    const ih = H - pad.t - pad.b;
    const x = (i: number) => pad.l + (i / (data.length - 1)) * iw;
    const y = (v: number) => pad.t + ih - ((v - min) / range) * ih;

    const line = data.map((d, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(d.v).toFixed(1)}`).join(" ");
    const area = `${line} L${x(data.length - 1).toFixed(1)},${(pad.t + ih).toFixed(1)} L${pad.l.toFixed(1)},${(pad.t + ih).toFixed(1)} Z`;

    // year ticks
    const ticks: { x: number; label: string }[] = [];
    let lastYear = "";
    data.forEach((d, i) => {
      const yr = d.date.slice(0, 4);
      if (yr !== lastYear) {
        ticks.push({ x: x(i), label: yr });
        lastYear = yr;
      }
    });

    const yTicks = [min, min + range / 2, max].map((v) => ({
      y: y(v),
      label: `${((v - 1) * 100).toFixed(0)}%`,
    }));

    return { line, area, ticks, yTicks, last: { x: x(data.length - 1), y: y(data[data.length - 1].v) } };
  }, [data]);

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ overflow: "visible" }}>
        <defs>
          <linearGradient id="eqFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(169,193,224,0.28)" />
            <stop offset="100%" stopColor="rgba(169,193,224,0)" />
          </linearGradient>
          <linearGradient id="eqLine" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#8fa6c4" />
            <stop offset="50%" stopColor="#eaf0f8" />
            <stop offset="100%" stopColor="#cfe0f2" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* y grid */}
        {yTicks.map((t, i) => (
          <g key={i}>
            <line x1={pad.l} y1={t.y} x2={W - pad.r} y2={t.y} stroke="rgba(180,196,220,0.07)" />
            <text x={pad.l - 10} y={t.y + 3} textAnchor="end" fontSize="11" fill="#565e6c" fontFamily="monospace">
              {t.label}
            </text>
          </g>
        ))}
        {/* x year ticks */}
        {ticks.map((t, i) => (
          <text key={i} x={t.x} y={H - 6} textAnchor="middle" fontSize="11" fill="#565e6c" fontFamily="monospace">
            {t.label}
          </text>
        ))}

        <motion.path
          d={area}
          fill="url(#eqFill)"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.6 }}
        />
        <motion.path
          d={line}
          fill="none"
          stroke="url(#eqLine)"
          strokeWidth={2.2}
          strokeLinecap="round"
          filter="url(#glow)"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.8, ease: "easeInOut" }}
        />
        <motion.circle
          cx={last.x}
          cy={last.y}
          r={4}
          fill="#eaf0f8"
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 1.8 }}
          style={{ filter: "drop-shadow(0 0 6px rgba(200,220,245,0.9))" }}
        />
      </svg>
    </div>
  );
}
