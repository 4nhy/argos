import perf from "@/lib/performance.json";

type Monthly = Record<string, Record<string, number>>;

export default function MonthlyHeatmap() {
  const monthly = perf.monthly as Monthly;
  const months = perf.months as string[];
  const yearly = perf.yearly as Record<string, number>;
  const years = Object.keys(monthly).sort();

  const all: number[] = [];
  years.forEach((y) => months.forEach((m) => {
    const v = monthly[y]?.[m];
    if (typeof v === "number") all.push(Math.abs(v));
  }));
  const maxAbs = Math.max(...all, 1);

  const cell = (v: number | undefined) => {
    if (typeof v !== "number") return { bg: "transparent", fg: "var(--text-faint)" };
    const a = Math.min(0.9, 0.1 + (Math.abs(v) / maxAbs) * 0.8);
    return {
      bg: v >= 0 ? `rgba(120, 158, 205, ${a})` : `rgba(196, 96, 96, ${a})`,
      fg: a > 0.5 ? "#f2f6fc" : "rgba(226,234,246,0.82)",
    };
  };

  return (
    <div className="glass metal-edge overflow-hidden p-5 sm:p-7">
      <div className="mb-5 flex items-center justify-between">
        <div className="mono text-[11px] tracking-[0.2em]" style={{ color: "var(--text-faint)" }}>
          MONTHLY RETURNS · %
        </div>
        <div className="flex items-center gap-3 text-[10px]" style={{ color: "var(--text-faint)" }}>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: "rgba(120,158,205,0.85)" }} />
            gain
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: "rgba(196,96,96,0.85)" }} />
            loss
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div style={{ minWidth: 640 }}>
          {/* header */}
          <div
            className="mono mb-1.5 grid text-[10px]"
            style={{ gridTemplateColumns: "44px repeat(12, 1fr) 56px", color: "var(--text-faint)" }}
          >
            <div />
            {months.map((m) => (
              <div key={m} className="text-center">{m}</div>
            ))}
            <div className="text-center" style={{ color: "var(--accent)" }}>YEAR</div>
          </div>

          {/* rows */}
          {years.map((y) => {
            const yr = yearly[y];
            const ys = cell(yr);
            return (
              <div
                key={y}
                className="mb-1 grid items-stretch gap-1"
                style={{ gridTemplateColumns: "44px repeat(12, 1fr) 56px" }}
              >
                <div className="mono flex items-center text-[11px]" style={{ color: "var(--text-dim)" }}>
                  {y}
                </div>
                {months.map((m) => {
                  const v = monthly[y]?.[m];
                  const c = cell(v);
                  return (
                    <div
                      key={m}
                      className="mono flex h-9 items-center justify-center rounded-[5px] text-[10px] tabular-nums transition-transform hover:scale-[1.08]"
                      style={{ background: c.bg, color: c.fg, border: "1px solid rgba(180,200,228,0.05)" }}
                      title={`${m} ${y}: ${typeof v === "number" ? v + "%" : "—"}`}
                    >
                      {typeof v === "number" ? v : ""}
                    </div>
                  );
                })}
                <div
                  className="mono flex h-9 items-center justify-center rounded-[5px] text-[11px] font-semibold tabular-nums"
                  style={{ background: ys.bg, color: ys.fg, border: "1px solid rgba(180,200,228,0.12)" }}
                >
                  {typeof yr === "number" ? (yr >= 0 ? "+" : "") + yr : ""}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
