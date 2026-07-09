import Reveal from "./Reveal";
import LiquidText from "./LiquidText";

export default function About() {
  return (
    <section id="about" className="relative mx-auto max-w-6xl px-6 py-28 sm:py-36">
      <div className="grid gap-12 md:grid-cols-[0.9fr_1.1fr] md:gap-16">
        <Reveal>
          <p className="eyebrow mb-5">01 — The Operator</p>
          <h2 className="sr-only">Arnav Lokhande</h2>
          <LiquidText
            lines={["Arnav", "Lokhande"]}
            width="min(360px, 80vw)"
            height="min(150px, 34vw)"
            fontSize={190}
            speed={0.4}
          />
          <p className="mono mt-3 text-sm" style={{ color: "var(--accent)" }}>
            Quant researcher · systematic trader
          </p>
        </Reveal>

        <div className="flex flex-col gap-6">
          <Reveal delay={0.1}>
            <p className="text-lg leading-relaxed" style={{ color: "var(--text)" }}>
              I build systematic trading strategies the slow, honest way — mining
              weak, uncorrelated edges and combining them into a book that stays
              market-neutral through any regime.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="leading-relaxed" style={{ color: "var(--text-dim)" }}>
              No single-strategy hero bets. No curve-fit fantasies. Every component
              is proven on a decade of out-of-sample history the search never saw
              before it earns a place in the book — because the only backtest that
              matters is the one you didn&apos;t optimise for.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="hairline mt-2 flex flex-wrap gap-x-10 gap-y-4 pt-6">
              {[
                ["Approach", "Multi-strategy · market-neutral"],
                ["Universe", "US large-cap equities"],
                ["Edge", "Uncorrelated components, combined"],
              ].map(([k, v]) => (
                <div key={k}>
                  <div className="mono text-[11px] tracking-[0.2em]" style={{ color: "var(--text-faint)" }}>
                    {k.toUpperCase()}
                  </div>
                  <div className="mt-1 text-sm" style={{ color: "var(--text)" }}>
                    {v}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
