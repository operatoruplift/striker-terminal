import Link from "next/link";
import { CinematicBackground } from "./CinematicBackground";
import { LandingMark } from "./LandingMark";
import { Flag } from "../terminal/flags";

const OUTCOMES = [
  { code: "FRA", name: "France", pct: 18.4, volume: "$63.2M", yes: 18.5, no: 81.6 },
  { code: "ESP", name: "Spain", pct: 13.7, volume: "$54.2M", yes: 13.7, no: 86.4 },
  { code: "ENG", name: "England", pct: 12.6, volume: "$47.5M", yes: 12.6, no: 87.5 },
  { code: "ARG", name: "Argentina", pct: 11.8, volume: "$61.3M", yes: 11.8, no: 88.3 },
  { code: "USA", name: "USA", pct: 3.3, volume: "$86.2M", yes: 3.3, no: 96.8 },
];

const FEATURED = [
  { label: "Winner", value: "France", pct: "18.4%" },
  { label: "Volume", value: "$2.72B", pct: "live" },
  { label: "Resolves", value: "Jul 20", pct: "2026" },
];

function Arrow({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  );
}

function TrendDot({ label, tone }: { label: string; tone?: "green" | "blue" | "red" }) {
  const dot = tone === "green" ? "bg-green" : tone === "blue" ? "bg-blue-500" : "bg-red";
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/75">
      <span className={"h-1.5 w-1.5 rounded-full " + dot}></span>
      {label}
    </span>
  );
}

function OutcomeRow({ row }: { row: (typeof OUTCOMES)[number] }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3 transition hover:border-blue-500/40 hover:bg-white/[0.07]">
      <div className="flex items-center gap-3">
        <Flag code={row.code} className="h-6 w-9 shrink-0" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <span className="truncate text-sm font-semibold text-white">{row.name}</span>
            <span className="font-mono text-sm font-bold text-blue-300">{row.pct.toFixed(1)}%</span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-gradient-to-r from-blue-400 to-blue-600" style={{ width: row.pct * 4 + "%" }}></div>
          </div>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <Link href="/terminal" className="rounded-lg bg-blue-500 px-3 py-2 text-center text-xs font-bold text-white transition hover:bg-blue-400">
          Buy Yes {row.yes}c
        </Link>
        <Link href="/terminal" className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-center text-xs font-bold text-white/70 transition hover:bg-white/[0.08] hover:text-white">
          Buy No {row.no}c
        </Link>
      </div>
    </div>
  );
}

export function WorldCupHero() {
  return (
    <header className="relative min-h-screen overflow-hidden bg-black">
      <CinematicBackground />

      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-64px)] max-w-7xl items-center gap-10 px-6 pb-16 pt-28 lg:grid-cols-[0.95fr_1.05fr] lg:pb-10 lg:pt-20">
        <div className="max-w-2xl">
          <div className="flex flex-wrap gap-2">
            <TrendDot label="Trending" tone="green" />
            <TrendDot label="Live 6" tone="blue" />
            <TrendDot label="FIFA World Cup 2026" />
          </div>

          <div className="mt-8 inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 backdrop-blur-xl">
            <LandingMark className="h-10 w-10" tone="white" />
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/45">Programmable sports finance</p>
              <p className="text-sm font-semibold text-white">Prediction pools, payments, and receipts on Solana</p>
            </div>
          </div>

          <h1 className="mt-8 text-5xl font-black leading-[0.98] tracking-tight text-white sm:text-6xl lg:text-7xl xl:text-8xl">
            Trade the Cup
            <br />
            <span className="bg-gradient-to-r from-blue-300 via-blue-400 to-purple-400 bg-clip-text text-transparent">before kickoff.</span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/65 sm:text-lg">
            A Fanatics-style World Cup hub meets a Polymarket-grade prediction terminal. Pick winners, set Auto-Strike sleep orders, and turn every slip into a shareable cNFT receipt.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="/terminal" className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-base font-bold text-black transition hover:bg-white/90 active:scale-[0.98]">
              Launch Terminal
              <Arrow />
            </Link>
            <a href="#markets" className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-6 py-3.5 text-base font-bold text-white backdrop-blur-xl transition hover:bg-white/[0.1] active:scale-[0.98]">
              Explore markets
            </a>
          </div>

          <div className="mt-10 grid max-w-xl grid-cols-3 gap-3">
            <div className="liquid-glass rounded-2xl px-4 py-4">
              <p className="font-mono text-2xl font-black tabular-nums text-white">$2.72B</p>
              <p className="mt-1 text-xs text-white/45">market signal</p>
            </div>
            <div className="liquid-glass rounded-2xl px-4 py-4">
              <p className="font-mono text-2xl font-black tabular-nums text-green">3:00 AM</p>
              <p className="mt-1 text-xs text-white/45">sleep mode</p>
            </div>
            <div className="liquid-glass rounded-2xl px-4 py-4">
              <p className="font-mono text-2xl font-black tabular-nums text-blue-300">cNFT</p>
              <p className="mt-1 text-xs text-white/45">receipts</p>
            </div>
          </div>
        </div>

        <div className="w-full">
          <div className="liquid-glass relative overflow-hidden rounded-3xl p-5 shadow-2xl">
            <div className="pointer-events-none absolute inset-x-0 -top-24 h-56 bg-blue-500/20 blur-3xl"></div>
            <div className="relative">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/45">Sports · Soccer</p>
                  <h2 className="mt-1 text-xl font-bold tracking-tight text-white">World Cup Winner</h2>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-lg bg-white/10 px-3 py-1.5 font-mono text-[10px] font-bold text-white/70">$2.72B Vol</span>
                  <span className="rounded-lg bg-green/15 px-3 py-1.5 font-mono text-[10px] font-bold text-green">Live</span>
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {FEATURED.map((item) => (
                  <div key={item.label} className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
                    <p className="font-mono text-[10px] uppercase tracking-wider text-white/45">{item.label}</p>
                    <p className="mt-1 font-mono text-lg font-black text-white">{item.value}</p>
                    <p className="mt-1 text-xs text-white/45">{item.pct}</p>
                  </div>
                ))}
              </div>

              <div className="mt-5 space-y-3">
                {OUTCOMES.map((row) => (
                  <OutcomeRow key={row.code} row={row}></OutcomeRow>
                ))}
              </div>

              <Link href="/terminal" className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-blue-500 px-4 py-3 text-sm font-bold text-white shadow-glow-blue transition hover:bg-blue-400">
                Trade all 32 markets
                <Arrow className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {["Winner", "Group D", "Golden Boot", "Finals"].map((label) => (
              <Link key={label} href="/terminal" className="liquid-glass rounded-2xl px-4 py-4 text-center transition hover:bg-white/[0.08]">
                <p className="font-mono text-[10px] uppercase tracking-wider text-white/45">Market</p>
                <p className="mt-1 text-sm font-bold text-white">{label}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <section id="markets" className="relative z-10 border-y border-white/10 bg-black/30 py-4 backdrop-blur-xl">
        <div className="marquee mx-auto max-w-7xl overflow-hidden px-6">
          <div className="marquee-track flex w-max items-center gap-8 whitespace-nowrap font-mono text-xs text-white/55">
            <span className="flex items-center gap-8">
              <span className="font-bold uppercase tracking-widest text-green">Settled</span>
              <span>USA 4 - 1 PAR <span className="text-green">+$1.2M paid</span></span>
              <span>GER 7 - 1 CUR <span className="text-green">+$2.4M paid</span></span>
              <span>BRA 1 - 1 MAR <span className="text-green">+$880K paid</span></span>
              <span>ARG 3 - 0 JPN <span className="text-green">+$1.6M paid</span></span>
            </span>
            <span className="flex items-center gap-8" aria-hidden="true">
              <span className="font-bold uppercase tracking-widest text-green">Settled</span>
              <span>USA 4 - 1 PAR <span className="text-green">+$1.2M paid</span></span>
              <span>GER 7 - 1 CUR <span className="text-green">+$2.4M paid</span></span>
              <span>BRA 1 - 1 MAR <span className="text-green">+$880K paid</span></span>
              <span>ARG 3 - 0 JPN <span className="text-green">+$1.6M paid</span></span>
            </span>
          </div>
        </div>
      </section>
    </header>
  );
}
