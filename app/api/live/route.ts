// Server-side Alpaca proxy. Reads credentials from env vars only — never ship
// keys to the browser. On Vercel: Project Settings → Environment Variables →
// add ALPACA_API_KEY, ALPACA_SECRET_KEY (and optionally ALPACA_PAPER=false to
// hit live). Locally: put them in .env.local (git-ignored by default).

import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type Account = {
  equity: string;
  last_equity: string;
  cash: string;
  long_market_value: string;
  short_market_value: string;
  buying_power: string;
  status: string;
};

type Position = {
  symbol: string;
  qty: string;
  market_value: string;
  unrealized_pl: string;
  side: string;
};

type PortfolioHistory = {
  timestamp: number[];
  equity: (number | null)[];
  profit_loss: (number | null)[];
  profit_loss_pct: (number | null)[];
  base_value: number;
  timeframe: string;
};

async function alpacaGet<T>(
  base: string,
  path: string,
  key: string,
  secret: string,
): Promise<T> {
  const res = await fetch(`${base}${path}`, {
    headers: {
      "APCA-API-KEY-ID": key,
      "APCA-API-SECRET-KEY": secret,
      accept: "application/json",
    },
    next: { revalidate: 60 }, // 60s edge cache
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Alpaca ${path} ${res.status}: ${body.slice(0, 160)}`);
  }
  return (await res.json()) as T;
}

export async function GET() {
  const key = process.env.ALPACA_API_KEY;
  const secret = process.env.ALPACA_SECRET_KEY;
  const paper = process.env.ALPACA_PAPER !== "false";
  const base = paper
    ? "https://paper-api.alpaca.markets"
    : "https://api.alpaca.markets";

  if (!key || !secret) {
    return NextResponse.json({ configured: false }, { status: 200 });
  }

  try {
    const [account, positions, history] = await Promise.all([
      alpacaGet<Account>(base, "/v2/account", key, secret),
      alpacaGet<Position[]>(base, "/v2/positions", key, secret),
      alpacaGet<PortfolioHistory>(
        base,
        "/v2/account/portfolio/history?period=3M&timeframe=1D",
        key,
        secret,
      ),
    ]);

    // Trim pre-funding zero rows and normalize to base=1 so EquityChart can plot
    // it as a "% since inception" style curve (matches the research chart).
    const raw = history.timestamp
      .map((ts, i) => ({ ts, eq: history.equity[i] }))
      .filter((r): r is { ts: number; eq: number } => r.eq != null);
    const firstFunded = raw.findIndex((r) => r.eq > 0);
    const funded = firstFunded >= 0 ? raw.slice(firstFunded) : raw;
    const baseline = funded[0]?.eq ?? history.base_value ?? 1;

    const equityCurve = funded.map((r) => ({
      date: new Date(r.ts * 1000).toISOString().slice(0, 10),
      v: baseline > 0 ? r.eq / baseline : 1,
    }));

    const equity = Number(account.equity);
    const lastEq = Number(account.last_equity);
    const dayPL = equity - lastEq;
    const dayPLPct = lastEq ? (dayPL / lastEq) * 100 : 0;
    const totalReturnPct = baseline > 0 ? ((equity - baseline) / baseline) * 100 : 0;
    const longMV = Number(account.long_market_value);
    const shortMV = Number(account.short_market_value);
    const gross = Math.abs(longMV) + Math.abs(shortMV);

    return NextResponse.json({
      configured: true,
      paper,
      status: account.status,
      inception: equityCurve[0]?.date ?? null,
      as_of: equityCurve[equityCurve.length - 1]?.date ?? null,
      stats: {
        equity,
        day_pl: dayPL,
        day_pl_pct: dayPLPct,
        total_return_pct: totalReturnPct,
        gross,
        long_mv: longMV,
        short_mv: shortMV,
        n_positions: positions.length,
        n_long: positions.filter((p) => Number(p.qty) > 0).length,
        n_short: positions.filter((p) => Number(p.qty) < 0).length,
      },
      equity: equityCurve,
    });
  } catch (e) {
    return NextResponse.json(
      { configured: true, error: (e as Error).message },
      { status: 502 },
    );
  }
}
