export default function Footer() {
  return (
    <footer className="hairline relative mx-auto mt-10 max-w-6xl px-6 py-14">
      <div className="flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-center">
        <div>
          <div className="chrome-text text-lg font-semibold tracking-[0.28em]">ARGOS</div>
          <p className="mt-2 max-w-sm text-sm" style={{ color: "var(--text-dim)" }}>
            A systematic market-neutral research programme by Arnav Lokhande.
          </p>
        </div>
        <div className="flex flex-col gap-2 text-sm sm:items-end">
          <a
            href="mailto:arnavlokhande2006@gmail.com"
            className="transition-colors"
            style={{ color: "var(--text-dim)" }}
          >
            arnavlokhande2006@gmail.com
          </a>
          <span className="mono text-[11px]" style={{ color: "var(--text-faint)" }}>
            © {new Date().getFullYear()} · Built, not bought.
          </span>
        </div>
      </div>
    </footer>
  );
}
