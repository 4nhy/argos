import Reveal from "./Reveal";
import LiquidText from "./LiquidText";
import perf from "@/lib/performance.json";

const KIND_ACCENT: Record<string, string> = {
  Momentum: "#a9c1e0",
  Attention: "#c9b8e0",
  Intermarket: "#8fd0c4",
  "Mean-reversion": "#e0b89a",
};

export default function Strategy() {
  return (
    <section id="strategy" className="relative mx-auto max-w-6xl px-6 py-28 sm:py-36">
      <Reveal>
        <p className="eyebrow mb-5">02 — The Strategy</p>
        <h2 className="sr-only">Many weak edges, one uncorrelated book.</h2>
        <LiquidText
          lines={["Many weak edges,", "one uncorrelated book."]}
          width="min(720px, 94vw)"
          height="min(180px, 30vw)"
          fontSize={104}
          speed={0.4}
        />
      </Reveal>

      <Reveal delay={0.1}>
        <p className="mt-6 max-w-2xl leading-relaxed" style={{ color: "var(--text-dim)" }}>
          A single strategy lives and dies by one idea. Argos holds five
          that barely correlate — so when one is wrong, the others carry it. The
          maths is simple and unforgiving: diversification across genuinely
          independent edges compounds Sharpe far faster than chasing one strong
          signal ever could.
        </p>
      </Reveal>

      {/* the formula strip */}
      <Reveal delay={0.15}>
        <div className="glass metal-edge mt-10 flex flex-col items-center justify-center gap-2 px-6 py-8">
          <div
            className="mono text-center"
            style={{ fontSize: "clamp(1.1rem,2.4vw,1.7rem)", color: "var(--chrome)" }}
          >
            Sharpe<sub>book</sub> ≈ s̄ · √( N / (1 + (N−1)·ρ) )
          </div>
          <p className="mono mt-1 text-[11px] tracking-wide" style={{ color: "var(--text-faint)" }}>
            LOW ρ · MANY N · MODEST s̄ → A BOOK THAT COMPOUNDS
          </p>
        </div>
      </Reveal>

      {/* component grid */}
      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {perf.components.map((c, i) => (
          <Reveal key={c.id} delay={0.05 * i}>
            <div className="glass metal-edge h-full p-6">
              <div className="flex items-center justify-between">
                <span
                  className="mono text-[11px] tracking-[0.18em]"
                  style={{ color: KIND_ACCENT[c.kind] ?? "var(--accent)" }}
                >
                  {c.kind.toUpperCase()}
                </span>
                <span className="mono text-[11px]" style={{ color: "var(--text-faint)" }}>
                  0{i + 1}
                </span>
              </div>
              <h3 className="mt-4 text-lg font-semibold" style={{ color: "var(--text)" }}>
                {c.name}
              </h3>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--text-dim)" }}>
                {c.role}
              </p>
            </div>
          </Reveal>
        ))}
        <Reveal delay={0.05 * perf.components.length}>
          <div
            className="flex h-full flex-col justify-center rounded-2xl p-6"
            style={{ border: "1px dashed var(--line-strong)" }}
          >
            <div className="mono text-[11px] tracking-[0.18em]" style={{ color: "var(--text-faint)" }}>
              ALWAYS HUNTING
            </div>
            <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--text-dim)" }}>
              An autonomous research loop proposes, codes and back-tests new edges
              around the clock — only out-of-sample survivors join the book.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
