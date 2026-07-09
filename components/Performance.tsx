import Reveal from "./Reveal";
import EquityChart from "./EquityChart";
import MonthlyHeatmap from "./MonthlyHeatmap";
import GraphBorder from "./GraphBorder";
import LiquidText from "./LiquidText";
import { CountUp } from "./CountUp";
import perf from "@/lib/performance.json";

const s = perf.stats;

type Metric = {
  k: string;
  sub: string;
  value?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  staticVal?: string;
};

const METRICS: Metric[] = [
  { k: "Sharpe (in-sample)", sub: "net of costs", value: s.sharpe_is, decimals: 2 },
  { k: "Sharpe (out-of-sample)", sub: "2008–2018, unseen", value: s.sharpe_oos, decimals: 2 },
  { k: "Max drawdown", sub: "peak to trough", value: s.max_drawdown, decimals: 1, suffix: "%" },
  { k: "Market beta", sub: "market-neutral", staticVal: "≈ 0" },
  { k: "Components", sub: "uncorrelated", value: s.n_components, decimals: 0 },
  { k: "Avg pairwise ρ", sub: "near-zero", value: s.avg_corr, decimals: 2 },
];

export default function Performance() {
  return (
    <section id="performance" className="relative mx-auto max-w-6xl px-6 py-28 sm:py-36">
      <Reveal>
        <p className="eyebrow mb-5">03 — The Track Record</p>
        <h2 className="sr-only">Steady compounding, low correlation to everything.</h2>
        <LiquidText
          lines={["Steady compounding,", "low correlation", "to everything."]}
          width="min(760px, 94vw)"
          height="min(240px, 40vw)"
          fontSize={122}
          speed={0.4}
        />
      </Reveal>

      {/* equity curve */}
      <Reveal delay={0.1}>
        <div className="glass metal-edge relative mt-10 p-5 sm:p-8">
          <GraphBorder />
          <div className="mb-4 flex items-end justify-between">
            <div>
              <div className="mono text-[11px] tracking-[0.2em]" style={{ color: "var(--text-faint)" }}>
                COMBINED EQUITY CURVE · NET OF 10BPS
              </div>
              <div className="mt-1 text-sm" style={{ color: "var(--text-dim)" }}>
                {s.start} → {s.end}
              </div>
            </div>
            <div className="text-right">
              <div className="stat-num text-2xl font-bold sm:text-3xl">
                <CountUp value={s.total_return} decimals={1} prefix="+" suffix="%" />
              </div>
              <div className="mono text-[11px]" style={{ color: "var(--text-faint)" }}>
                CUMULATIVE
              </div>
            </div>
          </div>
          <EquityChart data={perf.equity} />
          <div className="mt-6 flex justify-end">
            <a href="/live" className="btn">
              See it trading live →
            </a>
          </div>
        </div>
      </Reveal>

      {/* metric grid */}
      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3">
        {METRICS.map((m, i) => (
          <Reveal key={m.k} delay={0.04 * i}>
            <div className="glass metal-edge h-full p-5">
              <div className="stat-num text-2xl font-bold sm:text-3xl">
                {m.staticVal ? (
                  m.staticVal
                ) : (
                  <CountUp
                    value={m.value as number}
                    decimals={m.decimals ?? 2}
                    prefix={m.prefix ?? ""}
                    suffix={m.suffix ?? ""}
                  />
                )}
              </div>
              <div className="mt-2 text-[13px]" style={{ color: "var(--text)" }}>
                {m.k}
              </div>
              <div className="mono mt-0.5 text-[11px]" style={{ color: "var(--text-faint)" }}>
                {m.sub}
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      {/* monthly returns heatmap */}
      <Reveal delay={0.1}>
        <div className="mt-6">
          <MonthlyHeatmap />
        </div>
      </Reveal>

      <Reveal delay={0.1}>
        <p className="mono mt-6 text-[11px] leading-relaxed" style={{ color: "var(--text-faint)" }}>
          Backtested results, net of 10bps round-trip costs. In-sample window 2019–2024;
          out-of-sample Sharpe measured on 2008–2018 data the research never saw. Survivorship
          caveats apply. Past performance does not guarantee future results — this is a research
          record, not investment advice.
        </p>
      </Reveal>
    </section>
  );
}
