"use client";
// Scroll-aware liquid-glass navbar. Over the cinematic hero it is translucent
// with white text; after scrolling into the light body it becomes a solid light
// bar with ink text. Includes a glass mobile menu. Dependency-free (inline SVG).

import { useEffect, useState } from "react";
import Link from "next/link";
import { LandingMark } from "./LandingMark";

const LINKS = [
  { label: "Markets", href: "#markets" },
  { label: "How it works", href: "#how" },
  { label: "Collectibles", href: "#collectibles" },
  { label: "Auto-Strike", href: "#auto-strike" },
  { label: "Pricing", href: "#pricing" },
];

export function LandingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const dark = !scrolled; // white text over the hero

  return (
    <header
      className={
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300 " +
        (scrolled ? "border-b border-ink/[0.07] bg-card/85 backdrop-blur-xl" : "border-b border-transparent")
      }
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
        <Link href="#top" className="flex items-center gap-2.5">
          <LandingMark className="h-9 w-9" tone={dark ? "white" : "ink"} />
          <span className={"text-base font-bold tracking-tight " + (dark ? "text-white" : "text-ink")}>Striker Terminal</span>
        </Link>

        {/* center link pill */}
        <nav
          className={
            "hidden items-center gap-1 rounded-xl px-2 py-1.5 text-sm font-medium md:flex " +
            (dark ? "liquid-glass" : "")
          }
        >
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={
                "rounded-lg px-3 py-1.5 transition-colors " +
                (dark ? "text-white/75 hover:bg-white/10 hover:text-white" : "text-ink/60 hover:text-ink")
              }
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2.5">
          <Link
            href="/terminal"
            className="hidden items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-glow-blue transition hover:bg-blue-600 sm:inline-flex"
          >
            Launch Terminal
          </Link>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
            className={
              "rounded-lg p-2 transition md:hidden " +
              (dark ? "liquid-glass text-white" : "border border-ink/10 text-ink")
            }
          >
            {menuOpen ? (
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
            ) : (
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
            )}
          </button>
        </div>
      </div>

      {menuOpen ? (
        <div className="mx-4 mb-3 flex flex-col gap-1 rounded-2xl border border-ink/[0.07] bg-card/95 p-3 shadow-soft backdrop-blur-xl md:hidden">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="rounded-lg px-4 py-3 text-sm font-medium text-ink/70 transition hover:bg-well hover:text-ink"
            >
              {l.label}
            </a>
          ))}
          <Link
            href="/terminal"
            className="mt-1 rounded-lg bg-blue-500 px-4 py-3 text-center text-sm font-semibold text-white shadow-glow-blue"
          >
            Launch Terminal
          </Link>
        </div>
      ) : null}
    </header>
  );
}
