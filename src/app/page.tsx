import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { LandingNav } from "../components/landing/LandingNav";
import { Reveal } from "../components/landing/Reveal";
import { WorldCupHero } from "../components/landing/WorldCupHero";
import { LandingMark } from "../components/landing/LandingMark";
import { Flag } from "../components/terminal/flags";

export const metadata: Metadata = {
  title: "Striker Terminal - Trade the World Cup",
  description:
    "Turn passive World Cup viewership into active yield. One recurring pay.sh subscription unlocks every prediction market, settled on Solana in milliseconds.",
};

/* ---------- hero data ---------- */

// Tech-stack trust bar: actual logo assets from /public/logos rendered as
// monochrome images (brightness(0) invert(1) filter tints them white on the
// navy background). pay.sh has no logo file so keeps a clean inline SVG.
const STACK: { name: string; src?: string; h: number; w: number; svg?: React.ReactNode }[] = [
  { name: "Solana", src: "/logos/solana.png", h: 20, w: 20 },
  { name: "Phantom", src: "/logos/phantom.png", h: 24, w: 24 },
  { name: "Anchor", h: 24, w: 24, svg: (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="5" r="3" /><line x1="12" y1="8" x2="12" y2="21" /><path d="M5 12H2a10 10 0 0 0 20 0h-3" /></svg>
  ) },
  { name: "Jupiter", src: "/logos/jupiter.svg", h: 24, w: 24 },
  { name: "Superteam", h: 22, w: 22, svg: (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
  ) },
  {
    name: "pay.sh", h: 20, w: 20,
    svg: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M4 6l4 4-4 4" /><path d="M11 16h7" />
      </svg>
    ),
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

export default function Landing() {
  return (
    <div id="top" className="bg-paper font-display text-ink antialiased">
      <LandingNav />

      <WorldCupHero />

      <main className="mx-auto max-w-7xl px-6">
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
                        {l.src ? (
                          <Image
                            src={l.src}
                            alt={l.name}
                            width={l.w}
                            height={l.h}
                            className="brightness-0 invert opacity-60 transition-opacity duration-200 group-hover:opacity-100"
                            aria-hidden="true"
                          />
                        ) : l.svg ? (
                          l.svg
                        ) : null}
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
        <section id="alpha" className="border-t border-ink/[0.08] py-24">
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

        {/* ===== COLLECTIBLES ===== */}
        <section id="collectibles" className="border-t border-ink/[0.08] py-24">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <Reveal>
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-blue-500">Digital collectibles</p>
              <h2 className="mt-3 text-4xl font-bold tracking-tight">Every prediction is a mintable receipt.</h2>
              <p className="mt-4 max-w-md leading-relaxed text-ink/55">When you place a prediction, it becomes a holographic Alpha Card in your collection. Share it to X or mint it as a compressed NFT on Solana - a verifiable, on-chain receipt of your alpha call.</p>
              <ul className="mt-8 space-y-4">
                {[
                  ["3D holographic cards.", "Mouse-tracked tilt with a foil sheen overlay that shifts with your cursor. Premium digital trading card feel."],
                  ["Mint as cNFT.", "One tap turns your prediction slip into a compressed NFT in your Phantom wallet via Metaplex Bubblegum."],
                  ["Share your alpha.", "Generate a canvas card image and post it to X with a single click. Tail bait for the timeline."],
                ].map(([h, b]) => (
                  <li key={h} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-blue-500/15 text-blue-500"><Check /></span>
                    <p className="text-sm leading-relaxed text-ink/75"><span className="font-semibold text-ink">{h}</span> {b}</p>
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="mx-auto max-w-[280px]">
                <div className="relative aspect-[5/7] overflow-hidden rounded-xl border border-blue-500/30 bg-card p-4 shadow-lift">
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(37,99,235,0.18),transparent_50%)]"></div>
                  <div className="relative flex h-full flex-col">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-muted">Alpha Card</span>
                      <span className="inline-flex items-center gap-1 rounded-md bg-green/15 px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase text-green">
                        <span className="h-1.5 w-1.5 rounded-full bg-green"></span>Success
                      </span>
                    </div>
                    <div className="mt-5 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Flag code="USA" className="h-5 w-7" />
                        <span className="font-mono text-sm font-bold">USA</span>
                      </div>
                      <span className="font-mono text-[10px] uppercase text-muted">vs</span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-sm font-bold">AUS</span>
                        <Flag code="AUS" className="h-5 w-7" />
                      </div>
                    </div>
                    <div className="mt-5 flex flex-1 flex-col items-center justify-center rounded-lg border border-ink/[0.08] bg-well p-3 text-center">
                      <Flag code="USA" className="h-10 w-14" />
                      <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted">prediction</p>
                      <p className="mt-1 text-base font-black tracking-tight">United States</p>
                    </div>
                    <div className="mt-3 grid grid-cols-3 gap-1.5 font-mono">
                      <div className="rounded-md border border-ink/[0.08] bg-well px-2 py-1.5">
                        <p className="text-[8px] uppercase text-muted">stake</p>
                        <p className="text-[11px] font-bold">50</p>
                      </div>
                      <div className="rounded-md border border-ink/[0.08] bg-well px-2 py-1.5">
                        <p className="text-[8px] uppercase text-muted">odds</p>
                        <p className="text-[11px] font-bold text-blue-500">1.52x</p>
                      </div>
                      <div className="rounded-md border border-ink/[0.08] bg-well px-2 py-1.5">
                        <p className="text-[8px] uppercase text-muted">payout</p>
                        <p className="text-[11px] font-bold text-green">76</p>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-center gap-2 rounded-lg bg-blue-500 px-3 py-2 text-xs font-bold text-white shadow-glow-blue">
                      <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0l1.6 4.4L14 6l-4.4 1.6L8 12 6.4 7.6 2 6l4.4-1.6L8 0z"></path></svg>
                      Mint as cNFT Receipt
                    </div>
                  </div>
                </div>
              </div>
              <p className="mt-3 text-center font-mono text-[11px] text-muted">holographic Alpha Card - tap to mint on Solana</p>
            </Reveal>
          </div>
        </section>

        {/* ===== AUTO-STRIKE ===== */}
        <section id="auto-strike" className="border-t border-ink/[0.08] py-24">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <Reveal delay={0.1} className="order-2 lg:order-1">
              <div className="mx-auto max-w-sm">
                <div className="rounded-2xl border border-ink/[0.08] bg-card p-5 shadow-soft">
                  <div className="grid grid-cols-2 gap-1 rounded-lg border border-ink/[0.08] bg-well p-1">
                    <span className="rounded-md bg-well py-2 text-center text-xs font-bold text-muted">Live Market</span>
                    <span className="rounded-md bg-purple-600 py-2 text-center text-xs font-bold text-white">Auto-Strike</span>
                  </div>
                  <div className="mt-4 rounded-lg border border-ink/[0.08] bg-well p-3">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span>USA v AUS</span>
                      <span className="text-muted">pick <span className="text-blue-500">USA</span> - 1.52x</span>
                    </div>
                    <div className="mt-2 flex items-center gap-2 rounded-md border border-ink/[0.08] bg-card px-2.5 py-1.5">
                      <span className="flex-1 font-mono text-sm font-bold">50.00</span>
                      <span className="font-mono text-[10px] text-muted">USDG</span>
                    </div>
                  </div>
                  <div className="mt-3 rounded-lg border border-purple-500/25 bg-purple-500/[0.04] p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold">Target Trigger</span>
                      <div className="flex rounded-md border border-purple-500/20 bg-card p-0.5">
                        <span className="rounded bg-purple-600 px-2 py-1 font-mono text-[10px] text-white">Odds</span>
                        <span className="rounded px-2 py-1 font-mono text-[10px] text-muted">Kickoff</span>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center justify-between font-mono text-[11px]">
                      <span className="text-muted">Execute when odds hit</span>
                      <span className="font-bold text-purple-500">+200</span>
                    </div>
                    <div className="mt-2 h-1.5 rounded-full bg-ink/10">
                      <div className="h-full w-[40%] rounded-full bg-purple-500"></div>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-center gap-2 rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_0_0_1px_rgba(139,92,246,0.5),0_8px_24px_rgba(139,92,246,0.35)]">
                    <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="8" r="5.5"></circle><circle cx="8" cy="8" r="2"></circle><path d="M8 8 12 4"></path></svg>
                    Deploy Auto-Strike
                  </div>
                  <div className="mt-3 rounded-lg border border-purple-500/25 bg-purple-500/[0.04] p-2.5">
                    <div className="flex items-center gap-2 text-xs font-bold">
                      <svg className="h-3.5 w-3.5 text-purple-400" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="8" r="5.5"></circle><circle cx="8" cy="8" r="2"></circle><path d="M8 8 12 4"></path></svg>
                      Active Automations
                      <span className="rounded bg-purple-500/20 px-1.5 py-0.5 font-mono text-[9px] text-purple-500">1</span>
                    </div>
                    <div className="mt-2 rounded-md border border-ink/[0.08] bg-card px-2.5 py-2">
                      <p className="font-mono text-[11px] font-bold">USA v AUS - 50 USDG</p>
                      <p className="mt-0.5 font-mono text-[10px] text-muted">odds hit +200 - listening for trigger...</p>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
            <Reveal className="order-1 lg:order-2">
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-purple-500">Programmable orders</p>
              <h2 className="mt-3 text-4xl font-bold tracking-tight">Set it. Sleep. Auto-execute.</h2>
              <p className="mt-4 max-w-md leading-relaxed text-ink/55">World Cup games air at 3:00 AM in Malaysia. Traditional apps need you awake to trade momentum. Striker Terminal lets you program conditional orders that execute while you sleep.</p>
              <ul className="mt-8 space-y-4">
                {[
                  ["Timezone arbitrage.", "Set a target: 'If USA odds hit +200, deploy 50 USDG.' Close your laptop and go to sleep."],
                  ["Programmable money.", "Solana enables conditional execution. Your smart contract acts as an automated trading agent on your behalf."],
                  ["Sleep mode UI.", "A dedicated purple Auto-Strike panel with trigger sliders, pending order queue, and one-tap deployment."],
                ].map(([h, b]) => (
                  <li key={h} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-purple-500/15 text-purple-500"><Check /></span>
                    <p className="text-sm leading-relaxed text-ink/75"><span className="font-semibold text-ink">{h}</span> {b}</p>
                  </li>
                ))}
              </ul>
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
