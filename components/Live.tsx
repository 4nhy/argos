"use client";

import { useEffect, useState } from "react";
import Reveal from "./Reveal";
import EquityChart from "./EquityChart";
import GraphBorder from "./GraphBorder";
import LiquidText from "./LiquidText";
import { CountUp } from "./CountUp";

type LiveStats = {
  equity: number;
  day_pl: number;
  day_pl_pct: number;
  total_return_pct: number;
  gross: number;
  long_mv: number;
  short_mv: number;
  n_positions: number;
  n_long: number;
  n_short: number;
};

type LiveData = {
  configured: boolean;
  paper?: boolean;
  status?: string;
  inception?: string | null;
  as_of?: string | null;
  stats?: LiveStats;
  equity?: { date: string; v: number }[];
  error?: string;
};

const usd0 = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export default function Live() {
  const [data, setData] = useState<LiveData | null>(null);

  useEffect(() => {
    let cancelled = false;
    const pull = async () => {
      try {
        const res = await fetch("/api/live", { cache: "no-store" });
        const body = (await res.json()) as LiveData;
        if (!cancelled) setData(body);
      } catch {
        /* leave last-known data in place on a transient failure */
      }
    };
    pull();
    const iv = setInterval(pull, 60_000);
    return () => {
      cancelled = true;
      clearInterval(iv);
    };
  }, []);

  // Never render a broken section on the public site: if keys aren't set on the
  // deploy, or the feed erred, this section simply doesn't appear.
  if (data && (data.configured === false || data.error)) return null;

  const s = data?.stats;
  const curve = data?.equity ?? [];
  const hasCurve = curve.length >= 2;

  const plPositive = (s?.day_pl ?? 0) >= 0;

  const metrics: {
    k: string;
    sub: string;
    value?: number;
    decimals?: number;
    prefix?: string;
    suffix?: string;
    staticVal?: string;
    tone?: "up" | "down";
  }[] = s
    ? [
        {
          k: "Account equity",
          sub: data?.paper ? "paper account" : "live account",
          value: s.equity,
          decimals: 0,
          prefix: "$",
        },
        {
          k: "Today's P&L",
          sub: "vs previous close",
          value: s.day_pl_pct,
          decimals: 2,
          prefix: plPositive ? "+" : "",
          suffix: "%",
          tone: plPositive ? "up" : "down",
        },
        {
          k: "Gross exposure",
          sub: `${usd0.format(s.long_mv)} long · ${usd0.format(Math.abs(s.short_mv))} short`,
          value: s.gross,
          decimals: 0,
          prefix: "$",
        },
        {
          k: "Positions",
          sub: `${s.n_long} long · ${s.n_short} short`,
          value: s.n_positions,
          decimals: 0,
        },
        { k: "Market beta", sub: "market-neutral", staticVal: "≈ 0" },
        {
          k: "Net exposure",
          sub: "dollar-neutral",
          value: s.long_mv + s.short_mv,
          decimals: 0,
          prefix: s.long_mv + s.short_mv >= 0 ? "+$" : "-$",
        },
      ]
    : [];

  return (
    <section id="live" className="relative mx-auto max-w-6xl px-6 py-28 sm:py-36">
      <Reveal>
        <div className="mb-5 flex items-center gap-3">
          <p className="eyebrow">04 — Live Book</p>
          <span
            className="mono inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] tracking-[0.18em]"
            style={{
              color: "var(--text-dim)",
              border: "1px solid var(--line)",
              background: "rgba(120,200,150,0.06)",
            }}
          >
            <span
              className="inline-block h-1.5 w-1.5 rounded-full"
              style={{
                background: "#5fd08a",
                boxShadow: "0 0 8px rgba(95,208,138,0.9)",
                animation: "livePulse 2s ease-in-out infinite",
              }}
            />
            {data?.paper === false ? "LIVE" : "PAPER"} · REAL-TIME
          </span>
        </div>
        <h2 className="sr-only">The book, trading live.</h2>
        <LiquidText
          lines={["The book,", "trading live."]}
          width="min(760px, 94vw)"
          height="min(200px, 34vw)"
          fontSize={122}
          speed={0.4}
          align="start"
        />
      </Reveal>

      {/* live equity curve */}
      <Reveal delay={0.1}>
        <div className="glass metal-edge relative mt-10 p-5 sm:p-8">
          <GraphBorder />
          <div className="mb-4 flex items-end justify-between">
            <div>
              <div
                className="mono text-[11px] tracking-[0.2em]"
                style={{ color: "var(--text-faint)" }}
              >
                LIVE EQUITY CURVE · ALPACA {data?.paper === false ? "" : "PAPER"}
              </div>
              <div className="mt-1 text-sm" style={{ color: "var(--text-dim)" }}>
                {data?.inception ?? "—"} → {data?.as_of ?? "—"}
              </div>
            </div>
            <div className="text-right">
              <div className="stat-num text-2xl font-bold sm:text-3xl">
                {s ? (
                  <CountUp
                    value={s.total_return_pct}
                    decimals={2}
                    prefix={s.total_return_pct >= 0 ? "+" : ""}
                    suffix="%"
                  />
                ) : (
                  "—"
                )}
              </div>
              <div
                className="mono text-[11px]"
                style={{ color: "var(--text-faint)" }}
              >
                SINCE INCEPTION
              </div>
            </div>
          </div>
          {hasCurve ? (
            <EquityChart data={curve} />
          ) : (
            <div
              className="flex h-[280px] items-center justify-center text-sm"
              style={{ color: "var(--text-faint)" }}
            >
              {data
                ? "Building track record — equity history appears after the first full session."
                : "Loading live book…"}
            </div>
          )}
        </div>
      </Reveal>

      {/* metric grid */}
      {s ? (
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3">
          {metrics.map((m, i) => (
            <Reveal key={m.k} delay={0.04 * i}>
              <div className="glass metal-edge h-full p-5">
                <div
                  className="stat-num text-2xl font-bold sm:text-3xl"
                  style={
                    m.tone === "up"
                      ? { color: "#7fe0a3" }
                      : m.tone === "down"
                        ? { color: "#e58f9b" }
                        : undefined
                  }
                >
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
                <div
                  className="mono mt-0.5 text-[11px]"
                  style={{ color: "var(--text-faint)" }}
                >
                  {m.sub}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      ) : null}

      <Reveal delay={0.1}>
        <p
          className="mono mt-6 text-[11px] leading-relaxed"
          style={{ color: "var(--text-faint)" }}
        >
          Live figures stream from the Alpaca {data?.paper === false ? "" : "paper "}
          brokerage account running the combined book, refreshed each minute. The
          strategy trades market-neutral, so gross exposure is deployed long and
          short in roughly equal measure. Past and live performance do not
          guarantee future results — this is a research record, not investment
          advice.
        </p>
      </Reveal>
    </section>
  );
}
