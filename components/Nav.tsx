"use client";

import { useEffect, useState } from "react";

const LINKS = [
  { href: "/#about", label: "About" },
  { href: "/#strategy", label: "Strategy" },
  { href: "/#performance", label: "Performance" },
  { href: "/live", label: "Live" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        transition: "background 0.3s, border-color 0.3s, backdrop-filter 0.3s",
        background: scrolled ? "rgba(5,6,10,0.6)" : "transparent",
        borderBottom: `1px solid ${scrolled ? "var(--line)" : "transparent"}`,
        backdropFilter: scrolled ? "blur(12px)" : "none",
      }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="/" className="flex items-center gap-2.5 group">
          <span
            className="inline-block h-3.5 w-3.5 rounded-full"
            style={{
              background:
                "radial-gradient(circle at 30% 25%, #ffffff, #cdd6e2 35%, #6a7286 60%, #1b2028)",
              boxShadow: "0 0 14px rgba(180,205,240,0.55), inset 0 0 4px rgba(255,255,255,0.7)",
            }}
          />
          <span className="chrome-text text-sm font-semibold tracking-[0.28em]">
            ARGOS
          </span>
        </a>
        <div className="hidden items-center gap-8 sm:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-[13px] tracking-wide transition-colors"
              style={{ color: "var(--text-dim)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-dim)")}
            >
              {l.label}
            </a>
          ))}
          <a href="/live" className="btn">
            View live book
          </a>
        </div>
      </div>
    </nav>
  );
}
