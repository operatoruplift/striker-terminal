import type { Metadata } from "next";
import Link from "next/link";
import { LandingNav } from "../components/landing/LandingNav";
import { Reveal } from "../components/landing/Reveal";
import { CinematicBackground } from "../components/landing/CinematicBackground";
import { LandingMark } from "../components/landing/LandingMark";
import { Flag } from "../components/terminal/flags";

export const metadata: Metadata = {
  title: "Striker Terminal - Trade the World Cup",
  description:
    "Turn passive World Cup viewership into active yield. One recurring pay.sh subscription unlocks every prediction market, settled on Solana in milliseconds.",
};

/* ---------- hero data ---------- */

const WINNER: { code: string; name: string; pct: number; move: "up" | "down" | "flat" }[] = [
  { code: "ARG", name: "Argentina", pct: 24, move: "up" },
  { code: "BRA", name: "Brazil", pct: 18, move: "up" },
  { code: "FRA", name: "France", pct: 16, move: "down" },
  { code: "ESP", name: "Spain", pct: 13, move: "up" },
  { code: "ENG", name: "England", pct: 11, move: "flat" },
  { code: "GER", name: "Germany", pct: 9, move: "down" },
];

const SETTLED = [
  { m: "USA 4 - 1 PAR", p: "+$1.2M paid" },
  { m: "GER 7 - 1 CUR", p: "+$2.4M paid" },
  { m: "BRA 1 - 1 MAR", p: "+$880K paid" },
  { m: "ARG 3 - 0 JPN", p: "+$1.6M paid" },
  { m: "ESP 2 - 2 USA", p: "+$1.1M paid" },
];

// Tech-stack marks: clean monochrome inline SVGs (fill/stroke currentColor) so
// they tint to any text color and load instantly. Solana = official 3-bar mark,
// Jupiter = the real vectorized wordmark glyph, plus Phantom, Anchor, Superteam
// (star), and a pay.sh terminal-prompt wordmark.
const STACK = [
  {
    name: "Solana", vb: "0 0 398 312", w: "h-4 w-auto", fill: true,
    svg: (
      <>
        <path d="M64.6 237.9c2.4-2.4 5.7-3.8 9.2-3.8h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1l62.7-62.7z" />
        <path d="M64.6 3.8C67.1 1.4 70.4 0 73.8 0h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1L64.6 3.8z" />
        <path d="M333.1 120.1c-2.4-2.4-5.7-3.8-9.2-3.8H6.5c-5.8 0-8.7 7-4.6 11.1l62.7 62.7c2.4 2.4 5.7 3.8 9.2 3.8h317.4c5.8 0 8.7-7 4.6-11.1l-62.7-62.7z" />
      </>
    ),
  },
  {
    name: "Phantom", vb: "0 0 24 24", w: "h-6 w-auto", fill: true,
    svg: <path d="M12 3C7 3 3 7 3 12v6.5c0 .9 1 1.4 1.7.8.5-.4 1.2-.4 1.7 0l1 .8c.5.4 1.2.4 1.7 0l1-.8c.5-.4 1.2-.4 1.7 0l1 .8c.5.4 1.2.4 1.7 0l1-.8c.5-.4 1.2-.4 1.7 0 .7.6 1.7.1 1.7-.8V12c0-5-4-9-9-9Zm-3 8.2a1.3 1.3 0 1 1 0-2.6 1.3 1.3 0 0 1 0 2.6Zm6 0a1.3 1.3 0 1 1 0-2.6 1.3 1.3 0 0 1 0 2.6Z" />,
  },
  {
    name: "Anchor", vb: "0 0 24 24", w: "h-6 w-auto", fill: false,
    svg: <><circle cx="12" cy="5" r="2.4" /><path d="M12 7.4V21" /><path d="M6 12H18" /><path d="M5 14a7 7 0 0 0 14 0" /></>,
  },
  {
    name: "Jupiter", vb: "0 0 256 256", w: "h-6 w-auto", fill: true,
    svg: (
      <>
        <path d="M26.1 199.6c10.6 14.7 24.1 27 39.8 36.1 15.6 9.1 33 14.8 51 16.7-9.3-13.9-22.7-26.8-39.5-36.5-16.8-9.8-34.6-15.1-51.3-16.3z" />
        <path d="M99.9 177c-32.3-18.8-67.4-23.6-92.4-15.1 2.4 8 5.6 15.7 9.5 23.1 21.8-.5 45.6 5.4 67.7 18.3 22.1 12.8 39 30.6 49.4 49.7 8.4-.3 16.7-1.3 24.8-3.2-5-26-26.6-54-58.9-72.8z" />
        <path d="M254.2 100.7c-4.1-16.8-11.5-32.5-21.9-46.3-10.3-13.8-23.3-25.4-38.2-34-14.9-8.7-31.4-14.2-48.5-16.4-17.1-2.1-34.5-.8-51 3.9 27.7 3.4 58.4 13.8 88.6 31.3 30.1 17.5 54.4 39.1 71 61.5z" />
        <path d="M213.9 162c-14.2-23.5-38.5-46.1-68.4-63.5C115.6 81.2 84 71.3 56.6 70.6 32.4 70 14.3 77.1 6.9 89.9c0 .1-.1.1-.1.2-.7 2.4-1.3 4.8-1.8 7.2 10.4-4.1 22.4-6.4 35.8-6.6 29.8-.6 63.1 8.9 93.8 26.8 30.7 17.9 55.5 42.1 69.8 68.2 6.4 11.8 10.4 23.4 12 34.5 1.8-1.6 3.6-3.3 5.4-5.1 0-.1.1-.2.1-.2 7.5-12.9 4.6-32.1-7.8-52.7z" />
        <path d="M122.8 137.8C76.9 111.1 26.3 107 2 125.5c0 5.8.5 11.6 1.3 17.4 7.2-2.2 14.6-3.5 22-4.1 27.2-2 57.2 5.6 84.4 21.4 27.2 15.8 48.7 38.1 60.4 62.8 3.2 6.7 5.7 13.8 7.4 21.1 5.4-2.1 10.7-4.6 15.8-7.4 4-30.4-24.7-72.3-70.5-98.9z" />
        <path d="M237.5 122.6c-14.3-23.5-38.8-46.1-68.9-63.6-30.2-17.5-61.9-27.6-89.5-28.4-21-.6-37.2 4.5-45.7 14.1 35-5.9 81.2 4.1 125.9 30.1 44.8 26 76.3 61.2 88.5 94.5 4.2-12 .5-28.7-10.3-46.7z" />
      </>
    ),
  },
  {
    name: "Superteam", vb: "0 0 24 24", w: "h-5 w-auto", fill: true,
    svg: <path d="M12 2l2.6 6.3L21 9l-5 4.2L17.5 20 12 16.3 6.5 20 8 13.2 3 9l6.4-.7L12 2Z" />,
  },
  {
    name: "pay.sh", vb: "0 0 24 24", w: "h-5 w-auto", fill: false,
    svg: <><path d="M4 6l4 4-4 4" /><path d="M11 16h7" /></>,
  },
];

const FAQ = [
  { q: "What is a Programmable Season Pass?", a: "It is a recurring pay.sh payment stream that gates the terminal. Instead of a one-off purchase, it renews itself weekly in USDG and can be revoked on chain whenever you want." },
  { q: "Do I keep custody of my funds?", a: "Yes. You authorize a delegate for the subscription amount only. Your wallet stays in your control, and you can revoke the delegate in a single transaction." },
  { q: "How fast are payouts?", a: "Markets settle on the final whistle through an on-chain oracle. Median settlement is 412ms. Winning positions pay straight to your wallet with no manual claim." },
  { q: "What can I predict?", a: "Daily match outcomes (home, draw, away) and long-term Round of 32 futures on which teams advance. Each market shows live implied probability and 24h movement." },
  { q: "Which wallet do I need?", a: "Phantom on Solana. Connect in one tap. The terminal runs a full demo mode first so you can explore the flow before committing any funds." },
  { q: "Can I cancel anytime?", a: "Always. The pay.sh stream is revocable on chain. Cancel and the terminal relocks at the end of your current period. No lock-ins, no penalties." },
];

const Check = ({ className = "h-3.5 w-3.5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 8.5 6.5 12 13 4" /></svg>
);
const Arrow = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 8h10M9 4l4 4-4 4" /></svg>
);

function Move({ dir }: { dir: "up" | "down" | "flat" }) {
  if (dir === "flat") return <span className="font-mono text-[10px] text-white/40">flat</span>;
  const up = dir === "up";
  return (
    <span className={"flex items-center gap-0.5 font-mono text-[10px] font-medium " + (up ? "text-green" : "text-red")}>
      <svg className="h-2.5 w-2.5" viewBox="0 0 12 12" fill="currentColor">{up ? <path d="M6 2 10 8H2z" /> : <path d="M6 10 2 4h8z" />}</svg>
    </span>
  );
}

export default function Landing() {
  return (
    <div id="top" className="bg-paper font-display text-ink antialiased">
      <LandingNav />

      {/* ===== HERO ===== */}
      <header className="relative min-h-screen overflow-hidden">
        <CinematicBackground />
        <div className="relative z-10 mx-auto grid min-h-[calc(100vh-64px)] max-w-6xl items-center gap-12 px-6 pb-16 pt-32 lg:grid-cols-[1.05fr_0.95fr] lg:pb-20 lg:pt-36">
          {/* left: copy */}
          <div className="max-w-xl">
            <div className="flex flex-wrap items-center gap-2">
              {["Trending", "Live 6", "FIFA World Cup 2026", "Sports"].map((label, index) => (
                <span key={label} className={"liquid-glass inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 font-mono text-xs " + (index === 1 ? "text-green" : "text-white/80")}>
                  {index === 1 ? <span className="h-1.5 w-1.5 rounded-full bg-green"></span> : null}
                  {label}
                </span>
              ))}
            </div>
            <h1 className="mt-6 text-5xl font-bold leading-[1.03] tracking-tight text-white sm:text-6xl lg:text-7xl">
              Don&apos;t watch the Cup.
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent">Trade it.</span>
            </h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-white/65">
              Turn passive World Cup viewership into active yield. One recurring pay.sh subscription unlocks every prediction market, settled on Solana in milliseconds.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link href="/terminal" className="inline-flex items-center gap-2 rounded-xl bg-blue-500 px-6 py-3.5 text-base font-semibold text-white shadow-glow-blue transition hover:bg-blue-600">
                Launch Terminal
                <Arrow />
              </Link>
              <a href="#how" className="liquid-glass inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-base font-semibold text-white transition hover:bg-white/5">
                See how it works
              </a>
            </div>
            <div className="mt-12 grid max-w-md grid-cols-3 gap-3">
              {[
                { v: "$4.2M", l: "Value locked", c: "text-white" },
                { v: "120K", l: "Predictions", c: "text-white" },
                { v: "412ms", l: "Median payout", c: "text-green" },
              ].map((s) => (
                <div key={s.l} className="liquid-glass rounded-xl px-3 py-4">
                  <p className={"font-mono text-2xl font-bold tracking-tight " + s.c}>{s.v}</p>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-white/45">{s.l}</p>
                </div>
              ))}
            </div>
          </div>

          {/* right: World Cup Winner odds card */}
          <div className="liquid-glass rounded-2xl p-5 text-white shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/45">Sports · Soccer</p>
                <p className="mt-1 text-base font-bold tracking-tight">World Cup Winner</p>
              </div>
              <div className="text-right">
                <span className="rounded-md bg-white/10 px-2 py-1 font-mono text-[10px] font-bold text-white/70">$4.2M Vol</span>
                <p className="mt-1 font-mono text-[10px] text-white/40">Jul 20, 2026</p>
              </div>
            </div>
            <div className="mt-4 space-y-3.5">
              {WINNER.map((t) => (
                <div key={t.code} className="rounded-xl border border-white/10 bg-white/[0.035] p-3">
                  <div className="flex items-center gap-3">
                  <Flag code={t.code} className="h-5 w-7" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-white/90">{t.name}</span>
                      <span className="flex items-center gap-1.5">
                        <Move dir={t.move} />
                        <span className="font-mono text-sm font-bold text-blue-400">{t.pct}%</span>
                      </span>
                    </div>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/10">
                      <div className="h-full rounded-full bg-blue-500" style={{ width: t.pct + "%" }}></div>
                    </div>
                  </div>
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-2 font-mono text-[10px] font-bold">
                    <Link href="/terminal" className="rounded-md bg-blue-500/20 px-2 py-1.5 text-center text-blue-200 transition hover:bg-blue-500/30">Buy Yes {(t.pct + 0.4).toFixed(1)}c</Link>
                    <Link href="/terminal" className="rounded-md bg-white/10 px-2 py-1.5 text-center text-white/70 transition hover:bg-white/15">Buy No {(100 - t.pct + 0.5).toFixed(1)}c</Link>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/terminal" className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-white/10 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-white transition hover:bg-white/15">
              Trade all 32 markets <Arrow className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* settled ticker */}
        <div className="relative z-10 border-y border-white/10 bg-white/[0.03] py-3 backdrop-blur-sm">
          <div className="marquee overflow-hidden">
            <div className="marquee-track flex w-max items-center gap-8 whitespace-nowrap px-4 font-mono text-xs text-white/60">
              {[0, 1].map((dup) => (
                <span key={dup} className="flex items-center gap-8" aria-hidden={dup === 1}>
                  <span className="font-bold uppercase tracking-widest text-green">Settled</span>
                  {SETTLED.map((s, i) => (
                    <span key={i} className="flex items-center gap-8">
                      <span>{s.m} <span className="text-green">{s.p}</span></span>
                      <span className="text-white/15">|</span>
                    </span>
                  ))}
                </span>
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6">
        {/* ===== HOW IT WORKS ===== */}
        <section id="how" className="py-24">
          <Reveal className="max-w-2xl">
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-blue-500">How it works</p>
            <h2 className="mt-3 text-4xl font-bold tracking-tight">From subscription to settled payout in three steps.</h2>
          </Reveal>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            <Reveal className="rounded-2xl border border-ink/[0.08] bg-card p-6 shadow-soft">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500 text-sm font-bold text-white">1</span>
                <h3 className="text-lg font-bold">Lock in with pay.sh</h3>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-ink/55">Activate your Season Pass with a single tap. Recurring, gasless, and revocable on chain.</p>
              <div className="mt-5 flex items-center gap-2 rounded-xl border border-ink/[0.08] bg-well px-3 py-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-blue-500/15 font-mono text-[10px] font-bold text-blue-500">you</span>
                <div className="flex flex-1 items-center justify-center gap-1.5">
                  {[0, 1, 2, 3, 4].map((i) => <span key={i} className="h-1.5 w-1.5 rounded-full bg-blue-500/70"></span>)}
                </div>
                <span className="rounded-md bg-blue-500 px-2 py-1 font-mono text-[10px] font-bold text-white">$10 / wk</span>
              </div>
            </Reveal>
            <Reveal delay={0.08} className="rounded-2xl border border-ink/[0.08] bg-card p-6 shadow-soft">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500 text-sm font-bold text-white">2</span>
                <h3 className="text-lg font-bold">Predict the markets</h3>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-ink/55">Read live implied odds, size your stake, and place predictions like a trader.</p>
              <div className="mt-5 rounded-xl border border-ink/[0.08] bg-well p-3">
                <div className="flex items-center justify-between font-mono text-[11px]">
                  <span className="font-bold text-blue-500">USA 66%</span><span className="text-muted">Draw 22%</span><span className="text-red">AUS 12%</span>
                </div>
                <div className="barfill mt-2 h-1.5 overflow-hidden rounded-full bg-ink/10"><i></i></div>
                <div className="mt-3 grid grid-cols-3 gap-1.5">
                  <span className="rounded-md border border-blue-500 bg-blue-500/10 py-1 text-center font-mono text-[10px] font-bold text-blue-500">YES</span>
                  <span className="rounded-md border border-ink/10 py-1 text-center font-mono text-[10px] text-ink/50">Draw</span>
                  <span className="rounded-md border border-ink/10 py-1 text-center font-mono text-[10px] text-ink/50">NO</span>
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.16} className="rounded-2xl border border-ink/[0.08] bg-card p-6 shadow-soft">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500 text-sm font-bold text-white">3</span>
                <h3 className="text-lg font-bold">Settle on the whistle</h3>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-ink/55">An on-chain oracle resolves each market at full time. Winners pay out automatically.</p>
              <div className="mt-5 flex items-center justify-between rounded-xl border border-green/30 bg-green/[0.07] px-3 py-3">
                <span className="flex items-center gap-2 font-mono text-xs text-green"><Check />Position won</span>
                <span className="font-mono text-lg font-bold text-green">+84.00</span>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ===== SEASON PASS + PREVIEW ===== */}
        <section id="pass" className="grid items-center gap-12 border-t border-ink/[0.08] py-24 lg:grid-cols-2">
          <Reveal>
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-blue-500">Powered by pay.sh</p>
            <h2 className="mt-3 text-4xl font-bold tracking-tight">One pass. Every market. Settled automatically.</h2>
            <p className="mt-4 max-w-md leading-relaxed text-ink/55">The Season Pass is a programmable payment stream, not a static purchase. It renews itself, gates the full terminal, and you can revoke it on chain at any time.</p>
            <ul className="mt-8 space-y-4">
              {[
                ["Recurring and gasless.", "pay.sh streams $10 USDG per week from your wallet. No manual renewals."],
                ["Revocable on chain.", "Cancel the delegate in one transaction. You stay in custody the entire time."],
                ["Full terminal access.", "Daily markets, futures bracket, live match-cast, alpha leaderboard, and the trader trollbox."],
              ].map(([h, b]) => (
                <li key={h} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-blue-500/15 text-blue-500"><Check /></span>
                  <p className="text-sm leading-relaxed text-ink/75"><span className="font-semibold text-ink">{h}</span> {b}</p>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="relative rounded-2xl border border-ink/[0.08] bg-card p-5 shadow-soft">
              <div className="pointer-events-none absolute -right-8 -top-10 h-40 w-40 rounded-full bg-blue-500/15 blur-3xl"></div>
              <div className="relative flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">Group D - Live</span>
                <span className="inline-flex items-center gap-1.5 rounded-md bg-red/15 px-2 py-0.5 font-mono text-[10px] font-bold uppercase text-red"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red"></span>Live 58&apos;</span>
              </div>
              <div className="relative mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Flag code="USA" className="h-9 w-12" />
                  <div><p className="text-sm font-semibold leading-tight">United States</p><p className="font-mono text-[10px] text-muted">vs Australia</p></div>
                </div>
                <p className="font-mono text-2xl font-bold tabular-nums">2 : 0</p>
                <div className="flex items-center gap-2.5">
                  <div className="text-right"><p className="text-sm font-semibold leading-tight">Australia</p><p className="font-mono text-[10px] text-muted">AUS</p></div>
                  <Flag code="AUS" className="h-9 w-12" />
                </div>
              </div>
              <div className="relative mt-4 flex h-1.5 overflow-hidden rounded-full bg-ink/10">
                <div className="bg-blue-500" style={{ width: "66%" }}></div>
                <div className="bg-slate-400" style={{ width: "22%" }}></div>
                <div className="bg-red" style={{ width: "12%" }}></div>
              </div>
              <div className="relative mt-4 grid grid-cols-3 gap-2">
                <div className="rounded-lg border border-blue-500 bg-blue-500/10 px-3 py-2.5"><p className="text-[11px] text-blue-500">USA</p><p className="mt-0.5 font-mono text-lg font-bold leading-none text-blue-500">66%</p></div>
                <div className="rounded-lg border border-ink/10 bg-well px-3 py-2.5"><p className="text-[11px] text-ink/50">Draw</p><p className="mt-0.5 font-mono text-lg font-bold leading-none text-ink/80">22%</p></div>
                <div className="rounded-lg border border-ink/10 bg-well px-3 py-2.5"><p className="text-[11px] text-ink/50">AUS</p><p className="mt-0.5 font-mono text-lg font-bold leading-none text-red">12%</p></div>
              </div>
              <div className="relative mt-3 flex items-center justify-between rounded-lg border border-green/30 bg-green/[0.07] px-3 py-2.5">
                <span className="flex items-center gap-2 font-mono text-xs text-green"><Check />Position won 1.52x</span>
                <span className="font-mono text-sm font-bold text-green">+38.00 USDG</span>
              </div>
            </div>
            <p className="mt-3 text-center font-mono text-[11px] text-muted">live preview - the real thing is one click away</p>
          </Reveal>
        </section>

        {/* ===== STACK (trust bar) ===== */}
        <section id="stack" className="py-16">
          <Reveal className="relative overflow-hidden rounded-3xl border border-navy bg-navy px-6 py-10">
            <div className="pointer-events-none absolute inset-x-0 -top-24 h-44 bg-blue-500/10 blur-3xl"></div>
            <p className="relative text-center font-mono text-[11px] uppercase tracking-[0.3em] text-white/40">Built on the Solana stack</p>
            {/* margin-tiled marquee: each set ends with a trailing gap so the -50% loop is seamless */}
            <div className="marquee relative mt-8 overflow-hidden">
              <div className="marquee-track flex w-max items-center">
                {[0, 1].map((dup) => (
                  <div key={dup} className="flex shrink-0 items-center" aria-hidden={dup === 1}>
                    {STACK.map((l) => (
                      <span key={l.name} className="group flex shrink-0 items-center gap-2.5 pr-14 text-white/45 transition-colors duration-200 hover:text-white">
                        <svg viewBox={l.vb} className={l.w} fill={l.fill ? "currentColor" : "none"} stroke={l.fill ? "none" : "currentColor"} strokeWidth={l.fill ? undefined : 2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{l.svg}</svg>
                        <span className="text-lg font-semibold tracking-tight">{l.name}</span>
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </div>
            <p className="relative mt-7 text-center text-sm text-white/35">Real-time settlement at 412ms median. Phantom in, payout out.</p>
          </Reveal>
        </section>

        {/* ===== ALPHA ===== */}
        <section className="border-t border-ink/[0.08] py-24">
          <Reveal className="max-w-2xl">
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-blue-500">Social alpha</p>
            <h2 className="mt-3 text-4xl font-bold tracking-tight">A competitive lobby, not a spreadsheet.</h2>
            <p className="mt-4 max-w-md leading-relaxed text-ink/55">Every read matters. Track the sharpest wallets, talk trash in the trollbox, and tail the leaders in real time.</p>
          </Reveal>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            <Reveal className="rounded-2xl border border-ink/[0.08] bg-card p-5 shadow-soft">
              <div className="flex items-center justify-between border-b border-ink/[0.08] pb-3">
                <h3 className="text-sm font-bold">Alpha Leaderboard</h3>
                <span className="font-mono text-[10px] uppercase tracking-wider text-muted">by realized PnL</span>
              </div>
              <div className="mt-3 space-y-2">
                {[["1", "9xQr...4m1a", "+4,820 USDG", true], ["2", "3kLp...8c0d", "+2,640 USDG", false], ["3", "7vNw...2t9e", "+1,410 USDG", false]].map(([r, a, p, top]) => (
                  <div key={a as string} className={"flex items-center justify-between rounded-lg border px-3 py-2.5 " + (top ? "border-blue-500/40 bg-blue-500/[0.07] shadow-glow-blue" : "border-ink/[0.08] bg-well")}>
                    <span className="flex items-center gap-2.5"><span className={"w-4 text-center font-mono text-xs font-bold " + (top ? "text-blue-500" : "text-ink/70")}>{r}</span><span className="font-mono text-xs">{a}</span></span>
                    <span className="font-mono text-xs font-bold text-green">{p}</span>
                  </div>
                ))}
              </div>
            </Reveal>
            <Reveal delay={0.08} className="rounded-2xl border border-ink/[0.08] bg-card p-5 shadow-soft">
              <div className="flex items-center justify-between border-b border-ink/[0.08] pb-3">
                <h3 className="flex items-center gap-2 text-sm font-bold">Trollbox <span className="inline-flex items-center gap-1 font-mono text-[10px] font-medium text-green"><span className="h-1.5 w-1.5 rounded-full bg-green"></span>2,481 online</span></h3>
                <span className="font-mono text-[10px] uppercase tracking-wider text-muted">global</span>
              </div>
              <div className="mt-3 space-y-2.5 font-mono text-xs">
                <p><span className="text-muted">0x7b...9a:</span> <span className="text-ink/80">USA looking dangerous on the counter</span></p>
                <p><span className="text-muted">0x3f...2c:</span> <span className="text-ink/80">just hedged my position on Morocco</span></p>
                <p><span className="text-muted">0x9d...41:</span> <span className="text-ink/80">BRA 88% is free money, tailing</span></p>
                <p><span className="text-blue-500">you:</span> <span className="text-ink/80">up 3 streak, season pass paid for itself</span></p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ===== PRICING ===== */}
        <section id="pricing" className="border-t border-ink/[0.08] py-24">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-blue-500">Pricing</p>
            <h2 className="mt-3 text-4xl font-bold tracking-tight">Pick your stream.</h2>
            <p className="mt-4 text-ink/55">Every tier is a revocable pay.sh subscription, billed weekly in USDG. Cancel on chain anytime.</p>
          </Reveal>
          <div className="mt-12 grid items-stretch gap-5 md:grid-cols-3">
            <Reveal className="flex flex-col rounded-2xl border border-ink/[0.08] bg-card p-6 shadow-soft">
              <h3 className="text-lg font-bold">Kickoff</h3>
              <p className="mt-1 text-sm text-ink/50">For the casual fan testing the waters.</p>
              <p className="mt-5 font-mono text-3xl font-bold">$4 <span className="text-sm font-medium text-muted">USDG / wk</span></p>
              <ul className="mt-5 space-y-2.5 text-sm text-ink/70">
                <li className="flex items-center gap-2"><span className="text-blue-500">+</span>Daily match markets</li>
                <li className="flex items-center gap-2"><span className="text-blue-500">+</span>Live match-cast tracker</li>
                <li className="flex items-center gap-2"><span className="text-muted">-</span><span className="text-ink/40">Futures bracket</span></li>
                <li className="flex items-center gap-2"><span className="text-muted">-</span><span className="text-ink/40">Alpha rooms</span></li>
              </ul>
              <Link href="/terminal" className="mt-6 rounded-xl border border-ink/10 bg-well py-3 text-center text-sm font-semibold text-ink/80 transition hover:border-blue-500/40 hover:text-ink">Start Kickoff</Link>
            </Reveal>
            <Reveal delay={0.08} className="flex flex-col rounded-2xl border-2 border-blue-500 bg-card p-6 shadow-lift">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold">Season Pass</h3>
                <span className="rounded-full bg-blue-500 px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase text-white">Most picked</span>
              </div>
              <p className="mt-1 text-sm text-ink/50">The full programmable terminal.</p>
              <p className="mt-5 font-mono text-3xl font-bold">$10 <span className="text-sm font-medium text-muted">USDG / wk</span></p>
              <ul className="mt-5 space-y-2.5 text-sm text-ink/80">
                <li className="flex items-center gap-2"><span className="text-blue-500">+</span>Everything in Kickoff</li>
                <li className="flex items-center gap-2"><span className="text-blue-500">+</span>Round of 32 futures bracket</li>
                <li className="flex items-center gap-2"><span className="text-blue-500">+</span>Alpha leaderboard and trollbox</li>
                <li className="flex items-center gap-2"><span className="text-blue-500">+</span>Share-to-X bet slips</li>
              </ul>
              <Link href="/terminal" className="mt-6 rounded-xl bg-blue-500 py-3 text-center text-sm font-semibold text-white shadow-glow-blue transition hover:bg-blue-600">Get the Season Pass</Link>
            </Reveal>
            <Reveal delay={0.16} className="flex flex-col rounded-2xl border border-ink/[0.08] bg-card p-6 shadow-soft">
              <h3 className="text-lg font-bold">Syndicate</h3>
              <p className="mt-1 text-sm text-ink/50">For groups and high-volume traders.</p>
              <p className="mt-5 font-mono text-3xl font-bold">$30 <span className="text-sm font-medium text-muted">USDG / wk</span></p>
              <ul className="mt-5 space-y-2.5 text-sm text-ink/70">
                <li className="flex items-center gap-2"><span className="text-blue-500">+</span>Everything in Season Pass</li>
                <li className="flex items-center gap-2"><span className="text-blue-500">+</span>Priority oracle settlement</li>
                <li className="flex items-center gap-2"><span className="text-blue-500">+</span>Private syndicate rooms</li>
                <li className="flex items-center gap-2"><span className="text-blue-500">+</span>Boosted leaderboard rewards</li>
              </ul>
              <Link href="/terminal" className="mt-6 rounded-xl border border-ink/10 bg-well py-3 text-center text-sm font-semibold text-ink/80 transition hover:border-blue-500/40 hover:text-ink">Start Syndicate</Link>
            </Reveal>
          </div>
        </section>

        {/* ===== FAQ ===== */}
        <section id="faq" className="border-t border-ink/[0.08] py-24">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
            <Reveal>
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-blue-500">FAQ</p>
              <h2 className="mt-3 text-4xl font-bold tracking-tight">Questions, answered.</h2>
              <p className="mt-4 max-w-xs text-ink/55">Still curious? Launch the terminal and try it in demo mode, no real transactions required.</p>
            </Reveal>
            <Reveal className="divide-y divide-ink/[0.08] border-y border-ink/[0.08]">
              {FAQ.map((f) => (
                <details key={f.q} className="group py-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between text-base font-semibold">{f.q}<span className="font-mono text-blue-500 transition group-open:rotate-45">+</span></summary>
                  <p className="mt-3 text-sm leading-relaxed text-ink/55">{f.a}</p>
                </details>
              ))}
            </Reveal>
          </div>
        </section>

        {/* ===== FINAL CTA ===== */}
        <section className="py-24">
          <Reveal className="relative overflow-hidden rounded-3xl border border-navy bg-navy p-12 text-center">
            <div className="pointer-events-none absolute -bottom-24 left-1/2 h-72 w-[640px] -translate-x-1/2 rounded-full bg-blue-500/30 blur-[100px]"></div>
            <div className="relative">
              <LandingMark className="mx-auto h-16 w-16" tone="white" />
              <h2 className="mx-auto mt-5 max-w-2xl text-4xl font-bold tracking-tight text-white sm:text-5xl">Stop watching. Start trading the Cup.</h2>
              <p className="mx-auto mt-4 max-w-md text-white/60">Connect Phantom, activate your Season Pass, and place your first prediction in under a minute.</p>
              <Link href="/terminal" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-blue-500 px-7 py-3.5 text-base font-semibold text-white shadow-glow-blue transition hover:bg-blue-600">
                Launch Terminal
                <Arrow />
              </Link>
            </div>
          </Reveal>
        </section>
      </main>

      {/* ===== FOOTER ===== */}
      <footer className="border-t border-ink/[0.08] bg-card">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-10">
          <div className="flex items-center gap-2.5">
            <LandingMark className="h-8 w-8" tone="ink" />
            <span className="text-sm font-bold">Striker Terminal</span>
          </div>
          <p className="font-mono text-xs text-muted">WC26 prediction market · built on Solana + pay.sh · demo build</p>
          <p className="font-mono text-xs text-muted">Not financial advice. 18+.</p>
        </div>
      </footer>
    </div>
  );
}
