# Quicksilver — strategy site

Dark, metallic, interactive one-page site for the Quicksilver market-neutral book.
Next.js (App Router) + Tailwind v4 + Framer Motion. Chrome-on-black theme.

## Run locally
```bash
npm install
npm run dev        # http://localhost:3000
```

## Deploy to Vercel
1. Push this folder to its own GitHub repo.
2. On vercel.com → New Project → import the repo → framework auto-detects **Next.js** → Deploy.
   (No env vars needed for the site itself.)

## Structure
- `app/` — layout, page, global metallic theme (`globals.css`)
- `components/` — Starfield, Nav, Hero, About, Strategy, Performance, EquityChart, Footer
- `lib/performance.json` — real combined-book numbers + weekly equity curve

## Update the performance numbers
`lib/performance.json` is generated from the research book. Re-run the generator in the
`local_llm` project to refresh it, then copy the file here. The site reads it at build time.

## Edit the copy
- About / bio → `components/About.tsx`
- Strategy abstract → `components/Strategy.tsx`
- Headline / tagline → `components/Hero.tsx`

## Next (not yet built)
- Live layer: local scanner + Alpaca execution, feeding a private dashboard route.
