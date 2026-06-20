"use client";
// striker-components: presentational layer. Pure components, no app state.
// Markup, Tailwind classes, and inline animation styles ported verbatim from the
// prototype; only the module wrapper and prop types were added.

import * as React from "react";
import { Flag } from "./flags";
import type {
  MatchData,
  Outcome,
  ProbabilitySplit,
  BetPosition,
  SlipLine as SlipLineData,
  SettleResult,
  ResultLine,
  Toast,
  Wallet,
  ShareItem,
  TxStage,
  SubscriptionStatus,
  SlipMode,
  AutoStrike,
} from "../../lib/types";

const { useState, useEffect, useRef } = React;

type IconProps = { className?: string };

/* ---------- glyphs ---------- */

function IconLock({ className = "h-3.5 w-3.5" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="3" y="7" width="10" height="7" rx="1.5"></rect>
      <path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2"></path>
    </svg>
  );
}
function IconCheck({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 8.5 6.5 12 13 4"></path>
    </svg>
  );
}
function IconUp({ className = "h-3 w-3" }: IconProps) {
  return <svg className={className} viewBox="0 0 12 12" fill="currentColor"><path d="M6 2 10 8H2z"></path></svg>;
}
function IconDown({ className = "h-3 w-3" }: IconProps) {
  return <svg className={className} viewBox="0 0 12 12" fill="currentColor"><path d="M6 10 2 4h8z"></path></svg>;
}
function IconX({ className = "h-3.5 w-3.5" }: IconProps) {
  return <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 4l8 8M12 4l-8 8"></path></svg>;
}
function IconShare({ className = "h-3.5 w-3.5" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 5.5 8 2.5 5 5.5"></path><path d="M8 2.5V10"></path>
      <path d="M4 8H3v5.5h10V8h-1"></path>
    </svg>
  );
}
function Spinner({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg className={className + " animate-spin"} viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2"></circle>
      <path d="M14 8a6 6 0 0 0-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"></path>
    </svg>
  );
}
function IconRadar({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="8" r="5.5"></circle>
      <circle cx="8" cy="8" r="2"></circle>
      <path d="M8 8 12 4"></path>
    </svg>
  );
}

function IconSun({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="10" cy="10" r="3.5"></circle>
      <path strokeLinecap="round" d="M10 2v2M10 16v2M2 10h2M16 10h2M4.2 4.2l1.4 1.4M14.4 14.4l1.4 1.4M15.8 4.2l-1.4 1.4M5.6 14.4l-1.4 1.4"></path>
    </svg>
  );
}
function IconMoon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor">
      <path d="M16 11.5A6.5 6.5 0 0 1 8.5 4c0-.5.06-1 .17-1.46A7 7 0 1 0 17.46 11.3c-.46.13-.95.2-1.46.2z"></path>
    </svg>
  );
}

/* ---------- buttons ---------- */

function StrikerMark({ className = "h-9 w-9" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" aria-label="Striker Terminal" role="img">
      <path d="M33 16.5c0-4-4-6.7-9.4-6.7-6 0-9.9 3-9.9 7.6 0 4.1 3.3 6 8.9 7.3 5.6 1.3 7.4 2.2 7.4 4.6 0 2.6-2.8 4.2-6.6 4.2-4 0-7-1.6-8.2-4.4"
        stroke="currentColor" strokeWidth="5.6" strokeLinecap="round"></path>
      <polygon points="0,-4.5 4.28,-1.39 2.65,3.64 -2.65,3.64 -4.28,-1.39" fill="#2563EB" transform="translate(28 15.5)"></polygon>
      <polygon points="0,-4.5 4.28,-1.39 2.65,3.64 -2.65,3.64 -4.28,-1.39" fill="#2563EB" transform="translate(20 32)"></polygon>
    </svg>
  );
}

interface BlueButtonProps {
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
}
function BlueButton({ loading = false, disabled = false, onClick, children, className = "", size = "md" }: BlueButtonProps) {
  const off = disabled || loading;
  const pad = size === "sm" ? "px-3 py-1.5 text-sm" : size === "lg" ? "px-6 py-3 text-base" : "px-4 py-2.5 text-sm";
  return (
    <button
      onClick={off ? undefined : onClick}
      disabled={off}
      className={
        "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition active:scale-[0.98] " + pad + " " +
        (off ? "cursor-not-allowed bg-blue-500/40 text-white/80 " : "bg-blue-500 text-white shadow-glow-blue hover:bg-blue-400 ") +
        className
      }
    >
      {loading ? <Spinner></Spinner> : null}
      {children}
    </button>
  );
}

/* ---------- header ---------- */

interface HeaderProps {
  wallet: Wallet;
  onConnect: () => void;
  onDisconnect: () => void;
  clock: string;
  theme: string;
  onToggleTheme: () => void;
}
function Header({ wallet, onConnect, onDisconnect, clock, theme, onToggleTheme }: HeaderProps) {
  const connected = wallet.status === "connected";
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-line/10 bg-surface/80 px-5 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <StrikerMark className="h-9 w-9"></StrikerMark>
        <div className="leading-none">
          <p className="text-[15px] font-bold tracking-tight">Striker Terminal</p>
          <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted">wc26 · prediction market</p>
        </div>
        <span className="ml-3 hidden items-center gap-1.5 rounded-md border border-line/10 bg-inset px-2 py-1 font-mono text-[10px] text-muted lg:flex">
          <span className="h-1.5 w-1.5 rounded-full bg-green"></span>{clock} UTC
        </span>
      </div>

      <div className="flex items-center gap-2.5">
        <button
          onClick={onToggleTheme}
          title={theme === "dark" ? "Switch to light" : "Switch to dark"}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-line/10 bg-inset text-muted transition hover:border-blue-500/40 hover:text-fg"
        >
          {theme === "dark" ? <IconSun></IconSun> : <IconMoon></IconMoon>}
        </button>
        {connected ? (
          <React.Fragment>
            <div className="hidden items-center gap-2 sm:flex">
              <span className="flex items-center gap-1.5 rounded-lg border border-line/10 bg-inset px-3 py-1.5 font-mono text-xs">
                <span className="text-muted">USDG</span><span className="font-bold text-fg">{wallet.usdg.toFixed(2)}</span>
              </span>
              <span className="flex items-center gap-1.5 rounded-lg border border-line/10 bg-inset px-3 py-1.5 font-mono text-xs">
                <span className="text-muted">SOL</span><span className="font-bold text-fg">{wallet.sol.toFixed(2)}</span>
              </span>
            </div>
            <button
              onClick={onDisconnect}
              title="Click to disconnect"
              className="flex items-center gap-2 rounded-lg border border-line/10 bg-inset px-3 py-1.5 transition hover:border-blue-500/50"
            >
              <span className="h-2 w-2 rounded-full bg-green"></span>
              <span className="font-mono text-xs text-fg/90">Connected: {wallet.address}</span>
            </button>
          </React.Fragment>
        ) : (
          <BlueButton onClick={onConnect} loading={wallet.status === "connecting"}>
            {wallet.status === "connecting" ? "Connecting..." : "Connect Phantom"}
          </BlueButton>
        )}
      </div>
    </header>
  );
}

/* ---------- live ticker ---------- */

interface TickerItem { text: string; tone?: string }
function Ticker({ items }: { items: TickerItem[] }) {
  return (
    <div className="flex h-9 shrink-0 items-center gap-3 border-b border-line/10 bg-inset/80 px-5 font-mono text-[11px] text-muted">
      <span className="flex shrink-0 items-center gap-1.5 font-bold uppercase tracking-widest text-red">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red"></span>Live
      </span>
      <div className="ticker-mask relative flex-1 overflow-hidden">
        <div className="ticker-track flex w-max items-center gap-7 whitespace-nowrap">
          {[0, 1].map((d) => (
            <div key={d} className="flex items-center gap-7">
              {items.map((it, i) => (
                <span key={i} className="flex items-center gap-2">
                  <span className={it.tone === "up" ? "text-green" : it.tone === "down" ? "text-red" : "text-fg/70"}>{it.text}</span>
                  <span className="text-fg/25">|</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- market feed ---------- */

function ProbabilityBar({ pct }: { pct: ProbabilitySplit }) {
  // pct: { home, draw, away } summing to 100. Blue home, slate draw, red away.
  return (
    <div className="flex h-1.5 overflow-hidden rounded-full bg-inset">
      <div className="bg-blue-500 transition-all duration-500" style={{ width: pct.home + "%" }}></div>
      <div className="bg-slate-600 transition-all duration-500" style={{ width: pct.draw + "%" }}></div>
      <div className="bg-red transition-all duration-500" style={{ width: pct.away + "%" }}></div>
    </div>
  );
}

function Delta({ value }: { value: number }) {
  if (!value) return <span className="font-mono text-[10px] text-muted">flat</span>;
  const up = value > 0;
  return (
    <span className={"flex items-center gap-0.5 font-mono text-[10px] font-medium " + (up ? "text-green" : "text-red")}>
      {up ? <IconUp></IconUp> : <IconDown></IconDown>}{Math.abs(value).toFixed(1)}
    </span>
  );
}

interface OutcomeButtonProps {
  label: string;
  sub: string;
  pct: number;
  delta: number;
  tone: Outcome;
  selected?: boolean;
  locked?: boolean;
  onClick: () => void;
}
function OutcomeButton({ label, sub, pct, delta, tone, selected, locked, onClick }: OutcomeButtonProps) {
  // tone: home | draw | away -> drives selected accent
  const accent = tone === "away" ? "red" : tone === "draw" ? "slate" : "blue";
  const ring =
    accent === "red" ? "border-red bg-red/10" : accent === "slate" ? "border-slate-500 bg-slate-500/10" : "border-blue-500 bg-blue-500/10";
  const hover =
    accent === "red" ? "hover:border-red/50 hover:bg-red/[0.06]" : accent === "slate" ? "hover:border-slate-500/50 hover:bg-fg/[0.05]" : "hover:border-blue-500/50 hover:bg-blue-500/[0.06]";
  const pctColor = accent === "red" ? "text-red" : accent === "slate" ? "text-fg/80" : "text-accent";
  return (
    <button
      onClick={onClick}
      disabled={locked}
      className={
        "group flex flex-col items-start gap-1 rounded-lg border px-3 py-2.5 text-left transition active:scale-[0.96] " +
        (locked ? "cursor-not-allowed border-line/[0.08] bg-fg/[0.04]" : selected ? ring : "border-line/10 bg-inset " + hover)
      }
    >
      <div className="flex w-full items-center justify-between">
        <span className={"text-xs font-semibold " + (locked ? "text-fg/35" : "text-fg")}>{label}</span>
        {locked ? <IconLock className="h-3 w-3 text-fg/35"></IconLock> : <Delta value={delta}></Delta>}
      </div>
      <div className="flex w-full items-end justify-between">
        <span className="font-mono text-[10px] text-muted">{sub}</span>
        <span className={"font-mono text-lg font-bold leading-none " + (locked ? "text-fg/35" : pctColor)}>{pct}%</span>
      </div>
    </button>
  );
}

interface MarketCardProps {
  match: MatchData;
  locked: boolean;
  selectedPick: Outcome | null;
  position?: BetPosition;
  onSelect: (pick: Outcome) => void;
  onShare?: (match: MatchData, position: BetPosition) => void;
}
function MarketCard({ match, locked, selectedPick, position, onSelect, onShare }: MarketCardProps) {
  const live = match.status === "live";
  const done = match.status === "ft";
  const subLock = locked && !done;   // gated behind the Season Pass (settled games never gate)
  const code = (k: Outcome) => (k === "home" ? match.home.code : k === "away" ? match.away.code : "Draw");

  return (
    <div
      className={"card-spring rounded-xl border bg-surface p-4 shadow-card hover:-translate-y-0.5 hover:scale-[1.006] hover:shadow-[0_10px_34px_rgba(37,99,235,0.16)] " + (position ? "border-blue-500/40" : "border-line/10 hover:border-blue-500/30")}
      data-screen-label={"Market " + match.home.code + " v " + match.away.code}
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">{match.tag}</span>
        {live ? (
          <span className="inline-flex items-center gap-1.5 rounded-md bg-red/15 px-2 py-0.5 font-mono text-[10px] font-bold uppercase text-red">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red"></span>Live {match.minute}&apos;
          </span>
        ) : done ? (
          <span className="rounded-md border border-line/10 px-2 py-0.5 font-mono text-[10px] uppercase text-muted">FT · Settled</span>
        ) : (
          <span className="rounded-md border border-line/10 px-2 py-0.5 font-mono text-[10px] uppercase text-muted">{match.kickoff}</span>
        )}
      </div>

      <div className="mt-3 grid grid-cols-[1fr_auto_1fr] items-center gap-2">
        <div className="flex min-w-0 items-center gap-2.5">
          <Flag code={match.home.code} className="h-7 w-10"></Flag>
          <div className="min-w-0">
            <p className="text-sm font-bold leading-tight">{match.home.code}</p>
            <p className="truncate font-mono text-[10px] text-muted">{match.home.name}</p>
          </div>
        </div>
        <div className="shrink-0 px-1 text-center">
          {live || done ? (
            <p className="font-mono text-xl font-bold tabular-nums">{match.score[0]} : {match.score[1]}</p>
          ) : (
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted">vs</p>
          )}
        </div>
        <div className="flex min-w-0 items-center justify-end gap-2.5">
          <div className="min-w-0 text-right">
            <p className="text-sm font-bold leading-tight">{match.away.code}</p>
            <p className="truncate font-mono text-[10px] text-muted">{match.away.name}</p>
          </div>
          <Flag code={match.away.code} className="h-7 w-10"></Flag>
        </div>
      </div>

      <div className="mt-3">
        <ProbabilityBar pct={match.pct}></ProbabilityBar>
      </div>

      <div className="relative mt-3">
        <div className="grid grid-cols-3 gap-2">
          {(["home", "draw", "away"] as Outcome[]).map((k) => (
            <OutcomeButton
              key={k}
              label={code(k)}
              sub={k === "draw" ? "Draw" : "Win"}
              pct={match.pct[k]}
              delta={match.delta[k]}
              tone={k}
              locked={done}
              selected={(selectedPick === k) || (!!position && position.pick === k)}
              onClick={() => onSelect(k)}
            ></OutcomeButton>
          ))}
        </div>
        {/* Season Pass gate: heavy glass overlay that dissolves the instant the user subscribes */}
        {!done ? (
          <div
            className={
              "absolute -inset-1 flex items-center justify-center rounded-xl transition-all duration-500 " +
              (subLock ? "border border-line/10 bg-scrim/40 backdrop-blur-md opacity-100" : "pointer-events-none opacity-0")
            }
          >
            <div className="flex items-center gap-2 rounded-full border border-line/10 bg-surface/85 px-3.5 py-1.5 shadow-card">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent/15 text-accent"><IconLock className="h-3 w-3"></IconLock></span>
              <span className="text-[11px] font-semibold tracking-tight">Requires Season Pass</span>
            </div>
          </div>
        ) : null}
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-line/[0.08] pt-2.5 font-mono text-[10px] text-muted">
        <span>{match.vol} volume</span>
        {position ? (
          <button onClick={() => onShare && onShare(match, position)} className="flex items-center gap-1.5 rounded-md px-1.5 py-0.5 text-accent transition hover:bg-accent/10" title="Share this position">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>Position: {code(position.pick)} · {position.amount} USDG
            <IconShare className="h-3 w-3"></IconShare>
          </button>
        ) : (
          <span>{match.liquidity} liquidity</span>
        )}
      </div>
    </div>
  );
}

/* ---------- right console: subscription ---------- */

interface SubscriptionConsoleProps {
  status: SubscriptionStatus;
  nextCharge: string;
  onSubscribe: () => void;
}
function SubscriptionConsole({ status, nextCharge, onSubscribe }: SubscriptionConsoleProps) {
  const active = status === "active";
  return (
    <div className={"rounded-xl border p-4 shadow-card " + (active ? "border-green/40 bg-green/[0.06]" : "border-blue-500/40 bg-blue-500/[0.06]")}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">Access · pay.sh</span>
        </div>
        {active ? (
          <span className="inline-flex items-center gap-1 rounded-md bg-green/15 px-2 py-0.5 font-mono text-[10px] font-bold uppercase text-green">
            <IconCheck className="h-3 w-3"></IconCheck>Active
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-md bg-fg/[0.06] px-2 py-0.5 font-mono text-[10px] font-bold uppercase text-muted">
            <IconLock className="h-3 w-3"></IconLock>Locked
          </span>
        )}
      </div>

      <div className="mt-3 flex items-end justify-between">
        <div>
          <p className="text-base font-bold tracking-tight">Season Pass</p>
          <p className="mt-0.5 text-xs text-muted">{active ? "Markets unlocked all tournament" : "Unlock every World Cup market"}</p>
        </div>
        <p className="font-mono text-2xl font-bold leading-none">
          <span className={active ? "text-green" : "text-accent"}>$10</span>
          <span className="ml-1 text-xs font-medium text-muted">/ wk</span>
        </p>
      </div>

      {active ? (
        <div className="mt-3 flex items-center justify-between rounded-lg border border-line/10 bg-inset px-3 py-2 font-mono text-[11px]">
          <span className="text-muted">next charge</span><span className="text-fg/80">{nextCharge}</span>
        </div>
      ) : (
        <BlueButton onClick={onSubscribe} loading={status === "signing"} className="mt-3 w-full">
          {status === "signing" ? "Authorizing pay.sh..." : "Subscribe with pay.sh"}
        </BlueButton>
      )}
      <p className="mt-2 text-center font-mono text-[10px] text-muted">$10 USDG / week · cancel anytime · revocable on chain</p>
    </div>
  );
}

/* ---------- right console: betting slip ---------- */

interface SlipLineProps {
  line: SlipLineData;
  match: MatchData;
  onAmount: (value: string) => void;
  onRemove: () => void;
}
function SlipLine({ line, match, onAmount, onRemove }: SlipLineProps) {
  const code = (k: Outcome) => (k === "home" ? match.home.code : k === "away" ? match.away.code : "Draw");
  const odds = (100 / match.pct[line.pick]);
  const amt = parseFloat(line.amount) || 0;
  const tone = line.pick === "away" ? "text-red" : line.pick === "draw" ? "text-fg/80" : "text-accent";
  return (
    <div className="slip-in rounded-lg border border-line/10 bg-inset p-2.5">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-xs font-semibold">{match.home.code} v {match.away.code}</p>
          <p className="mt-0.5 font-mono text-[10px] text-muted">
            pick <span className={tone}>{code(line.pick)}</span> · {odds.toFixed(2)}x · {match.pct[line.pick]}%
          </p>
        </div>
        <button onClick={onRemove} className="text-muted transition hover:text-red"><IconX></IconX></button>
      </div>
      <div className="mt-2 flex items-center gap-2">
        <div className="flex flex-1 items-center gap-2 rounded-md border border-line/10 bg-surface px-2.5 py-1.5 focus-within:border-blue-500/60">
          <input
            type="text" inputMode="decimal" value={line.amount}
            onChange={(e) => onAmount(e.target.value.replace(/[^0-9.]/g, ""))}
            placeholder="0.00"
            className="w-full bg-transparent font-mono text-sm font-bold text-fg outline-none placeholder:text-muted"
          ></input>
          <span className="font-mono text-[10px] text-muted">USDG</span>
        </div>
        <div className="text-right">
          <p className="font-mono text-[9px] uppercase tracking-wider text-muted">payout</p>
          <p className="font-mono text-sm font-bold text-green">{(amt * odds).toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}

interface CollectiblePredictionCardProps {
  position: BetPosition;
  match: MatchData;
  onShare: () => void;
}
function CollectiblePredictionCard({ position, match, onShare }: CollectiblePredictionCardProps) {
  const side = position.pick === "home" ? match.home : position.pick === "away" ? match.away : null;
  const status = match.status === "ft" ? "Success" : match.status === "live" ? "Active" : "Locked";
  const potential = position.amount * position.odds;
  const onMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const el = event.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    const ry = ((x - 50) / 50) * 8;
    const rx = ((50 - y) / 50) * 8;
    el.style.setProperty("--mx", x.toFixed(2) + "%");
    el.style.setProperty("--my", y.toFixed(2) + "%");
    el.style.setProperty("--rx", rx.toFixed(2) + "deg");
    el.style.setProperty("--ry", ry.toFixed(2) + "deg");
  };
  const onLeave = (event: React.PointerEvent<HTMLDivElement>) => {
    const el = event.currentTarget;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
    el.style.setProperty("--mx", "50%");
    el.style.setProperty("--my", "50%");
  };
  return (
    <div className="holo-scene">
      <div
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        className="holo-card relative aspect-[5/7] overflow-hidden rounded-xl border border-blue-500/30 bg-surface p-3 shadow-card"
      >
        <div className="holo-foil"></div>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(37,99,235,0.24),transparent_42%),linear-gradient(180deg,rgba(255,255,255,0.08),transparent_28%)]"></div>
        <div className="relative flex h-full flex-col">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-muted">Alpha Card</span>
            <span className={"inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase " + (status === "Success" ? "bg-green/15 text-green" : status === "Active" ? "bg-blue-500/15 text-accent" : "bg-fg/[0.06] text-muted")}>
              <span className={"h-1.5 w-1.5 rounded-full " + (status === "Success" ? "bg-green" : status === "Active" ? "animate-pulse bg-blue-500" : "bg-muted")}></span>{status}
            </span>
          </div>
          <div className="mt-5 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Flag code={match.home.code} className="h-6 w-9"></Flag>
              <span className="font-mono text-sm font-bold">{match.home.code}</span>
            </div>
            <span className="font-mono text-[10px] uppercase text-muted">vs</span>
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-sm font-bold">{match.away.code}</span>
              <Flag code={match.away.code} className="h-6 w-9"></Flag>
            </div>
          </div>
          <div className="mt-5 flex flex-1 flex-col justify-center rounded-lg border border-line/10 bg-inset/70 p-3 text-center">
            {side ? <Flag code={side.code} className="mx-auto h-12 w-16"></Flag> : <span className="mx-auto flex h-12 w-16 items-center justify-center rounded-lg border border-line/10 font-mono text-xs text-muted">DRAW</span>}
            <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-muted">prediction</p>
            <p className="mt-1 text-lg font-black tracking-tight">{side ? side.name : "Match Draw"}</p>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-1.5 font-mono">
            <div className="rounded-md border border-line/10 bg-inset px-2 py-1.5">
              <p className="text-[8px] uppercase text-muted">stake</p>
              <p className="text-[11px] font-bold">{position.amount.toFixed(0)}</p>
            </div>
            <div className="rounded-md border border-line/10 bg-inset px-2 py-1.5">
              <p className="text-[8px] uppercase text-muted">odds</p>
              <p className="text-[11px] font-bold text-accent">{position.odds.toFixed(2)}x</p>
            </div>
            <div className="rounded-md border border-line/10 bg-inset px-2 py-1.5">
              <p className="text-[8px] uppercase text-muted">payout</p>
              <p className="text-[11px] font-bold text-green">{potential.toFixed(0)}</p>
            </div>
          </div>
          <button
            onClick={onShare}
            className="holo-cta relative mt-3 inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-blue-500 px-3 py-2 text-xs font-bold text-white shadow-glow-blue transition hover:bg-blue-400"
          >
            <IconShare className="h-3.5 w-3.5"></IconShare>Share Alpha
          </button>
        </div>
      </div>
    </div>
  );
}

function AutoStrikeOrders({ orders, onCancel }: { orders: AutoStrike[]; onCancel: (id: string) => void }) {
  const [open, setOpen] = useState(true);
  if (orders.length === 0) return null;
  return (
    <div className="mx-3 mt-3 rounded-lg border border-purple-500/25 bg-purple-500/[0.045]">
      <button onClick={() => setOpen((v) => !v)} className="flex min-h-10 w-full items-center justify-between px-3 py-2 text-left">
        <span className="flex items-center gap-2 text-xs font-bold">
          <IconRadar className="h-3.5 w-3.5 text-purple-400"></IconRadar>Active Automations
          <span className="rounded bg-purple-500/20 px-1.5 py-0.5 font-mono text-[9px] text-purple-300">{orders.length}</span>
        </span>
        <span className="font-mono text-[10px] text-muted">{open ? "hide" : "show"}</span>
      </button>
      {open ? (
        <div className="space-y-1.5 border-t border-purple-500/15 p-2">
          {orders.map((order) => (
            <div key={order.id} className="rounded-md border border-line/10 bg-surface px-2.5 py-2">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate font-mono text-[11px] font-bold">{order.label} · {order.amount.toFixed(0)} USDG</p>
                  <p className="mt-0.5 font-mono text-[10px] text-muted">{order.trigger} · listening for trigger...</p>
                </div>
                <button onClick={() => onCancel(order.id)} className="shrink-0 rounded p-1 text-muted transition hover:bg-red/10 hover:text-red" aria-label="Cancel Auto-Strike">
                  <IconX></IconX>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

interface BettingSlipProps {
  lines: SlipLineData[];
  matches: MatchData[];
  positions: Record<string, BetPosition>;
  subscribed: boolean;
  busy: boolean;
  totalStake: number;
  totalReturn: number;
  balance: number;
  slipMode: SlipMode;
  autoStrikes: AutoStrike[];
  onSlipMode: (mode: SlipMode) => void;
  onAmount: (matchId: string, value: string) => void;
  onRemove: (matchId: string) => void;
  onClear: () => void;
  onPlace: () => void;
  onDeployAutoStrike: (trigger: string) => void;
  onCancelAutoStrike: (id: string) => void;
  onSharePosition: (match: MatchData, position: BetPosition) => void;
}
function BettingSlip({
  lines,
  matches,
  positions,
  subscribed,
  busy,
  totalStake,
  totalReturn,
  balance,
  slipMode,
  autoStrikes,
  onSlipMode,
  onAmount,
  onRemove,
  onClear,
  onPlace,
  onDeployAutoStrike,
  onCancelAutoStrike,
  onSharePosition,
}: BettingSlipProps) {
  const empty = lines.length === 0;
  const [panel, setPanel] = useState<"slip" | "collection">("slip");
  const [triggerMode, setTriggerMode] = useState<"odds" | "kickoff">("odds");
  const [targetOdds, setTargetOdds] = useState(150);
  const trigger = triggerMode === "kickoff" ? "at Kickoff" : "odds hit +" + targetOdds;
  const collection = Object.entries(positions)
    .map(([matchId, position]) => {
      const match = matches.find((m) => m.id === matchId);
      return match ? { match, position } : null;
    })
    .filter((item): item is { match: MatchData; position: BetPosition } => item !== null);
  return (
    <div className="flex min-h-[260px] flex-1 flex-col rounded-xl border border-line/10 bg-surface shadow-card lg:min-h-0">
      <div className="flex items-center justify-between border-b border-line/10 px-4 py-3">
        <div className="flex items-center gap-2">
          <button onClick={() => setPanel("slip")} className={"rounded-md px-2 py-1 text-xs font-bold transition " + (panel === "slip" ? "bg-blue-500 text-white" : "text-muted hover:text-fg")}>Bet Slip</button>
          <button onClick={() => setPanel("collection")} className={"rounded-md px-2 py-1 text-xs font-bold transition " + (panel === "collection" ? "bg-blue-500 text-white" : "text-muted hover:text-fg")}>My Collection</button>
          {panel === "slip" && lines.length > 0 ? <span className="rounded-md bg-blue-500/15 px-1.5 py-0.5 font-mono text-[10px] font-bold text-accent">{lines.length}</span> : null}
          {panel === "collection" && collection.length > 0 ? <span className="rounded-md bg-blue-500/15 px-1.5 py-0.5 font-mono text-[10px] font-bold text-accent">{collection.length}</span> : null}
        </div>
        {panel === "slip" && lines.length > 0 ? (
          <button onClick={onClear} className="font-mono text-[10px] uppercase tracking-wider text-muted transition hover:text-red">clear</button>
        ) : null}
      </div>

      {panel === "collection" ? (
        <div className="flex-1 space-y-3 p-3 lg:min-h-0 lg:overflow-y-auto">
          {collection.length === 0 ? (
            <div className="flex h-full min-h-[180px] flex-col items-center justify-center px-4 text-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-line/10 bg-inset font-mono text-muted">NFT</div>
              <p className="mt-3 text-xs font-medium text-fg/65">No prediction cards yet</p>
              <p className="mt-1 font-mono text-[10px] text-muted">Open a position to generate a collectible Alpha Card</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {collection.map(({ match, position }) => (
                <CollectiblePredictionCard
                  key={match.id}
                  match={match}
                  position={position}
                  onShare={() => onSharePosition(match, position)}
                ></CollectiblePredictionCard>
              ))}
            </div>
          )}
        </div>
      ) : (
        <React.Fragment>
          <div className="border-b border-line/10 p-3">
            <div className="grid grid-cols-2 gap-1 rounded-lg border border-line/10 bg-inset p-1">
              {(["live", "auto"] as SlipMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => onSlipMode(mode)}
                  className={"min-h-9 rounded-md px-2 text-xs font-bold transition " + (slipMode === mode ? (mode === "auto" ? "bg-purple-600 text-white" : "bg-blue-500 text-white") : "text-muted hover:text-fg")}
                >
                  {mode === "auto" ? "Auto-Strike" : "Live Market"}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1 space-y-2 p-3 lg:min-h-0 lg:overflow-y-auto">
            {empty ? (
              <div className="flex h-full min-h-[150px] flex-col items-center justify-center px-4 text-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-line/10 bg-inset font-mono text-muted">+</div>
                <p className="mt-3 text-xs font-medium text-fg/65">{subscribed ? "Slip is empty" : "Markets locked"}</p>
                <p className="mt-1 font-mono text-[10px] text-muted">{subscribed ? "Tap an outcome to add a selection" : "Activate the Season Pass above to begin"}</p>
              </div>
            ) : (
              lines.map((l) => {
                const match = matches.find((m) => m.id === l.matchId);
                if (!match) return null;
                return (
                  <SlipLine key={l.matchId} line={l} match={match} onAmount={(v) => onAmount(l.matchId, v)} onRemove={() => onRemove(l.matchId)}></SlipLine>
                );
              })
            )}
          </div>
          {!empty && slipMode === "auto" ? (
            <div className="border-t border-line/10 px-3 py-3">
              <div className="rounded-lg border border-purple-500/25 bg-purple-500/[0.045] p-3">
                <div className="flex items-center justify-between gap-2">
                  <label className="text-xs font-bold" htmlFor="auto-target">Target Trigger</label>
                  <div className="flex rounded-md border border-purple-500/20 bg-surface p-0.5">
                    <button onClick={() => setTriggerMode("odds")} className={"rounded px-2 py-1 font-mono text-[10px] " + (triggerMode === "odds" ? "bg-purple-600 text-white" : "text-muted")}>Odds</button>
                    <button onClick={() => setTriggerMode("kickoff")} className={"rounded px-2 py-1 font-mono text-[10px] " + (triggerMode === "kickoff" ? "bg-purple-600 text-white" : "text-muted")}>Kickoff</button>
                  </div>
                </div>
                {triggerMode === "odds" ? (
                  <div className="mt-3">
                    <div className="flex items-center justify-between font-mono text-[11px]">
                      <span className="text-muted">Execute when odds hit</span>
                      <span className="font-bold text-purple-300">+{targetOdds}</span>
                    </div>
                    <input
                      id="auto-target"
                      type="range"
                      min="100"
                      max="400"
                      step="25"
                      value={targetOdds}
                      onChange={(e) => setTargetOdds(parseInt(e.target.value, 10))}
                      className="mt-2 w-full accent-purple-500"
                    ></input>
                  </div>
                ) : (
                  <p className="mt-3 rounded-md border border-line/10 bg-surface px-3 py-2 font-mono text-[11px] text-muted">Execute at kickoff when the keeper sees the match clock open.</p>
                )}
              </div>
            </div>
          ) : null}
          <AutoStrikeOrders orders={autoStrikes} onCancel={onCancelAutoStrike}></AutoStrikeOrders>
          {!empty ? (
            <div className="border-t border-line/10 p-3">
              <div className="space-y-1.5 font-mono text-xs">
                <div className="flex justify-between"><span className="text-muted">total stake</span><span className="font-bold text-fg">{totalStake.toFixed(2)} USDG</span></div>
                <div className="flex justify-between"><span className="text-muted">{slipMode === "auto" ? "target return" : "potential return"}</span><span className="font-bold text-green">{totalReturn.toFixed(2)} USDG</span></div>
                <div className="flex justify-between border-t border-line/[0.08] pt-1.5"><span className="text-muted">balance after</span><span className={(balance - totalStake) < 0 ? "font-bold text-red" : "text-fg/70"}>{(balance - totalStake).toFixed(2)} USDG</span></div>
              </div>
              {slipMode === "auto" ? (
                <button
                  onClick={() => onDeployAutoStrike(trigger)}
                  disabled={busy || totalStake <= 0 || totalStake > balance}
                  className="auto-strike-btn mt-3 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white transition active:scale-[0.98] hover:bg-purple-500 disabled:cursor-not-allowed disabled:bg-purple-600/40 disabled:text-white/60"
                >
                  {busy ? <Spinner></Spinner> : <IconRadar></IconRadar>}
                  {busy ? "Deploying Auto-Strike..." : "Deploy Auto-Strike"}
                </button>
              ) : (
                <BlueButton onClick={onPlace} loading={busy} disabled={totalStake <= 0 || totalStake > balance} className="mt-3 w-full">
                  {totalStake > balance ? "Insufficient USDG" : "Place " + lines.length + (lines.length > 1 ? " predictions" : " prediction")}
                </BlueButton>
              )}
            </div>
          ) : null}
        </React.Fragment>
      )}
    </div>
  );
}

/* ---------- modal + toasts ---------- */

const TX_STAGES: string[] = ["signing", "submitting", "confirming", "confirmed"];
const TX_LABEL: Record<string, string> = {
  signing: "Awaiting signature in Phantom",
  submitting: "Submitting to Solana",
  confirming: "Confirming block",
  confirmed: "Confirmed on chain"
};

function TxProgress({ stage }: { stage: TxStage }) {
  const idx = TX_STAGES.indexOf(stage);
  return (
    <div className="mt-4 rounded-lg border border-accent/30 bg-accent/[0.06] p-3">
      <div className="flex items-center gap-2">
        {stage === "confirmed" ? <IconCheck className="h-4 w-4 text-green"></IconCheck> : <Spinner className="h-4 w-4 text-accent"></Spinner>}
        <span className={"font-mono text-xs font-semibold " + (stage === "confirmed" ? "text-green" : "text-accent")}>{TX_LABEL[stage]}</span>
      </div>
      <div className="mt-2.5 flex items-center gap-1.5">
        {TX_STAGES.map((s, i) => (
          <div key={s} className={"h-1 flex-1 rounded-full transition-colors duration-300 " + (i < idx ? "bg-green" : i === idx ? (stage === "confirmed" ? "bg-green" : "bg-accent") : "bg-line/15")}></div>
        ))}
      </div>
    </div>
  );
}

interface ModalRow { k: string; v: string; total?: boolean; accent?: boolean; blue?: boolean }
interface ModalProps {
  title: string;
  rows: ModalRow[];
  cta: string;
  busy: boolean;
  stage: TxStage;
  onConfirm: () => void;
  onClose: () => void;
  footnote?: string;
}
function Modal({ title, rows, cta, busy, stage, onConfirm, onClose, footnote }: ModalProps) {
  const active = busy && stage && stage !== "idle";
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-scrim/55 p-6 backdrop-blur-sm" onClick={active ? undefined : onClose}>
      <div className="w-full max-w-sm rounded-xl border border-line/10 bg-surface p-5 shadow-2xl" onClick={(e) => e.stopPropagation()} style={{ animation: "modalIn 0.22s ease" }}>
        <div className="flex items-start justify-between">
          <p className="text-base font-bold tracking-tight">{title}</p>
          <button onClick={onClose} disabled={!!active} className="text-muted transition hover:text-fg disabled:opacity-30"><IconX className="h-4 w-4"></IconX></button>
        </div>
        <div className="mt-3 space-y-2 rounded-lg border border-line/10 bg-inset p-3 font-mono text-xs">
          {rows.map((r, i) => (
            <div key={i} className={"flex justify-between " + (r.total ? "border-t border-line/10 pt-2" : "")}>
              <span className="text-muted">{r.k}</span>
              <span className={r.accent ? "font-bold text-green" : r.blue ? "font-bold text-accent" : "text-fg/80"}>{r.v}</span>
            </div>
          ))}
        </div>
        {active ? (
          <TxProgress stage={stage}></TxProgress>
        ) : (
          <BlueButton onClick={onConfirm} className="mt-4 w-full">{cta}</BlueButton>
        )}
        {footnote ? <p className="mt-2.5 text-center font-mono text-[10px] text-muted">{footnote}</p> : null}
      </div>
    </div>
  );
}

/* ---------- ResultModal: payout celebration on settlement ---------- */

function ResultModal({ result, onClose }: { result: SettleResult | null; onClose: () => void }) {
  if (!result) return null;
  const won = result.payout > 0;
  const net = +(result.payout - result.staked).toFixed(2);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-scrim/60 p-6 backdrop-blur-sm" onClick={onClose}>
      {/* confetti */}
      {won ? (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {Array.from({ length: 36 }).map((_, i) => {
            const colors = ["#2563EB", "#3B82F6", "#10B981", "#fff"];
            const left = (i * 37) % 100;
            const delay = (i % 12) * 0.12;
            const dur = 1.8 + (i % 5) * 0.3;
            return (
              <span key={i} className="confetti absolute top-[-12px] h-2.5 w-2.5 rounded-[1px]"
                style={{ left: left + "%", background: colors[i % 4], animationDelay: delay + "s", animationDuration: dur + "s" }}></span>
            );
          })}
        </div>
      ) : null}
      <div className="relative w-full max-w-sm overflow-hidden rounded-xl border border-line/10 bg-surface p-6 shadow-2xl" onClick={(e) => e.stopPropagation()} style={{ animation: "modalIn 0.24s ease" }}>
        <div className={"pointer-events-none absolute -top-16 left-1/2 h-44 w-44 -translate-x-1/2 rounded-full blur-3xl " + (won ? "bg-green/25" : "bg-red/20")}></div>
        <div className="relative text-center">
          <span className={"mx-auto flex h-14 w-14 items-center justify-center rounded-full " + (won ? "bg-green/15 text-green" : "bg-red/15 text-red")}>
            {won ? <IconCheck className="h-7 w-7"></IconCheck> : <IconX className="h-7 w-7"></IconX>}
          </span>
          <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">Final whistle · markets settled</p>
          <h3 className="mt-1 text-2xl font-bold tracking-tight">{won ? "Positions paid out" : "Markets resolved"}</h3>
          <p className={"mt-2 font-mono text-3xl font-bold " + (won ? "text-green" : "text-fg")}>
            {won ? "+" : ""}{result.payout.toFixed(2)} <span className="text-base font-medium text-muted">USDG</span>
          </p>
          {net !== 0 ? (
            <p className={"mt-1 font-mono text-xs font-semibold " + (net > 0 ? "text-green" : "text-red")}>net {net > 0 ? "+" : ""}{net.toFixed(2)} USDG</p>
          ) : null}
        </div>
        <div className="relative mt-4 max-h-48 space-y-1.5 overflow-y-auto">
          {result.lines.map((l: ResultLine, i: number) => (
            <div key={i} className={"flex items-center justify-between rounded-lg border px-3 py-2 font-mono text-xs " + (l.win ? "border-green/30 bg-green/[0.06]" : "border-line/10 bg-inset")}>
              <span className="flex items-center gap-2">
                <span className={"h-1.5 w-1.5 rounded-full " + (l.win ? "bg-green" : "bg-red")}></span>
                <span className="text-fg/85">{l.label}</span>
              </span>
              <span className={l.win ? "font-bold text-green" : "text-muted"}>{l.win ? "+" + l.payout.toFixed(2) : "-" + l.stake.toFixed(2)}</span>
            </div>
          ))}
        </div>
        <button onClick={onClose} className="relative mt-4 w-full rounded-lg bg-blue-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-400">Continue trading</button>
      </div>
    </div>
  );
}

/* ---------- edge states: loading skeleton + RPC error ---------- */

// MatchCardSkeleton: mirrors the 3-column MarketCard layout with a subtle pulse.
function MatchCardSkeleton() {
  const bar = "rounded bg-fg/10";
  return (
    <div className="animate-pulse rounded-xl border border-line/10 bg-surface p-4 shadow-card" aria-hidden="true">
      <div className="flex items-center justify-between">
        <span className={bar + " h-2.5 w-24"}></span>
        <span className={bar + " h-4 w-12 rounded-md"}></span>
      </div>
      <div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <div className="flex items-center gap-2.5">
          <span className={bar + " h-9 w-9 rounded-lg"}></span>
          <span className="flex flex-col gap-1.5"><span className={bar + " h-2.5 w-16"}></span><span className={bar + " h-2 w-10"}></span></span>
        </div>
        <span className={bar + " h-6 w-10"}></span>
        <div className="flex items-center justify-end gap-2.5">
          <span className="flex flex-col items-end gap-1.5"><span className={bar + " h-2.5 w-16"}></span><span className={bar + " h-2 w-10"}></span></span>
          <span className={bar + " h-9 w-9 rounded-lg"}></span>
        </div>
      </div>
      <div className={bar + " mt-4 h-1.5 w-full rounded-full"}></div>
      <div className="mt-3 grid grid-cols-3 gap-2">
        <span className={bar + " h-12"}></span>
        <span className={bar + " h-12"}></span>
        <span className={bar + " h-12"}></span>
      </div>
      <div className="mt-3 flex items-center justify-between border-t border-line/[0.06] pt-2.5">
        <span className={bar + " h-2 w-20"}></span>
        <span className={bar + " h-2 w-16"}></span>
      </div>
    </div>
  );
}

// RpcErrorState: data-dense fallback when the Solana connection fails.
function RpcErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-red/30 bg-red/[0.05] px-6 py-14 text-center" role="alert">
      <span className="flex h-12 w-12 items-center justify-center rounded-full border border-red/40 bg-red/10 text-red">
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 9v4M12 17h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"></path></svg>
      </span>
      <p className="mt-4 font-mono text-sm font-bold uppercase tracking-[0.15em] text-red">RPC Connection Terminated</p>
      <p className="mt-2 max-w-xs font-mono text-[11px] leading-relaxed text-muted">The Solana cluster stopped responding while streaming market accounts. No funds are at risk. Retry to re-open the connection.</p>
      <button onClick={onRetry} className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-500 px-5 py-2.5 text-sm font-semibold text-white shadow-glow-blue transition hover:bg-blue-400">
        <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13.6 6A6 6 0 1 0 14 9"></path><path d="M14 3v3h-3"></path></svg>
        Retry Connection
      </button>
    </div>
  );
}

function ToastStack({ toasts }: { toasts: Toast[] }) {
  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-50 flex w-80 flex-col gap-2">
      {toasts.map((t) => (
        <div key={t.id} className={"flex items-center gap-3 rounded-lg border bg-surface/95 p-3 shadow-xl backdrop-blur-xl " + (t.kind === "ok" ? "border-green/40" : t.kind === "err" ? "border-red/40" : "border-blue-500/40")} style={{ animation: "toastIn 0.28s ease" }}>
          <span className={"flex h-7 w-7 shrink-0 items-center justify-center rounded-md " + (t.kind === "ok" ? "bg-green/15 text-green" : t.kind === "err" ? "bg-red/15 text-red" : "bg-blue-500/15 text-accent")}>
            {t.kind === "ok" ? <IconCheck></IconCheck> : t.kind === "err" ? <IconX className="h-4 w-4"></IconX> : <span className="font-mono text-xs">i</span>}
          </span>
          <div className="min-w-0">
            <p className="text-xs font-semibold leading-tight">{t.title}</p>
            {t.sub ? <p className="mt-0.5 truncate font-mono text-[10px] text-muted">{t.sub}</p> : null}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------- share to X: canvas-rendered bet slip card ---------- */

function drawShareCard(canvas: HTMLCanvasElement, item: ShareItem) {
  const W = 1200, H = 675;
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  // background
  ctx.fillStyle = "#060814"; ctx.fillRect(0, 0, W, H);
  // accent glow top-right
  const g = ctx.createRadialGradient(W - 120, -60, 60, W - 120, -60, 620);
  g.addColorStop(0, "rgba(37,99,235,0.45)"); g.addColorStop(1, "rgba(37,99,235,0)");
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  // faint grid
  ctx.strokeStyle = "rgba(255,255,255,0.04)"; ctx.lineWidth = 1;
  for (let x = 0; x <= W; x += 60) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
  for (let y = 0; y <= H; y += 60) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
  // border frame
  ctx.strokeStyle = "rgba(255,255,255,0.10)"; ctx.lineWidth = 2;
  ctx.strokeRect(20, 20, W - 40, H - 40);
  const PAD = 80;
  // logo tile
  ctx.fillStyle = "#2563EB";
  const r = 14, lx = PAD, ly = 70, ls = 64;
  ctx.beginPath();
  ctx.moveTo(lx + r, ly); ctx.arcTo(lx + ls, ly, lx + ls, ly + ls, r); ctx.arcTo(lx + ls, ly + ls, lx, ly + ls, r);
  ctx.arcTo(lx, ly + ls, lx, ly, r); ctx.arcTo(lx, ly, lx + ls, ly, r); ctx.closePath(); ctx.fill();
  ctx.fillStyle = "#fff"; ctx.font = "900 42px Inter, sans-serif"; ctx.textBaseline = "middle"; ctx.textAlign = "center";
  ctx.fillText("S", lx + ls / 2, ly + ls / 2 + 2);
  ctx.textAlign = "left"; ctx.fillStyle = "#fff"; ctx.font = "700 30px Inter, sans-serif";
  ctx.fillText("STRIKER TERMINAL", lx + ls + 22, ly + ls / 2 - 10);
  ctx.fillStyle = "#64748B"; ctx.font = "500 18px 'JetBrains Mono', monospace";
  ctx.fillText("WC26 · PREDICTION MARKET", lx + ls + 22, ly + ls / 2 + 16);
  // eyebrow
  ctx.fillStyle = "#3B82F6"; ctx.font = "700 22px 'JetBrains Mono', monospace";
  ctx.fillText("MY POSITION · " + item.matchLabel, PAD, 250);
  // headline
  ctx.fillStyle = "#fff"; ctx.font = "800 84px Inter, sans-serif";
  ctx.fillText(item.amount.toFixed(0) + " USDG on " + item.teamName, PAD, 320);
  ctx.fillStyle = "#94A3B8"; ctx.font = "500 30px Inter, sans-serif";
  ctx.fillText("to " + item.verb + " · settles on the final whistle", PAD, 380);
  // stat chips
  const chips = [
    { k: "STAKE", v: item.amount.toFixed(2) + " USDG", c: "#fff" },
    { k: "ODDS", v: item.odds.toFixed(2) + "x", c: "#3B82F6" },
    { k: "TO WIN", v: item.potential.toFixed(2) + " USDG", c: "#10B981" }
  ];
  let cx = PAD;
  chips.forEach((ch) => {
    ctx.fillStyle = "rgba(255,255,255,0.04)"; ctx.strokeStyle = "rgba(255,255,255,0.10)"; ctx.lineWidth = 1.5;
    const cw = 300, cy = 440, chh = 100, rr = 12;
    ctx.beginPath();
    ctx.moveTo(cx + rr, cy); ctx.arcTo(cx + cw, cy, cx + cw, cy + chh, rr); ctx.arcTo(cx + cw, cy + chh, cx, cy + chh, rr);
    ctx.arcTo(cx, cy + chh, cx, cy, rr); ctx.arcTo(cx, cy, cx + cw, cy, rr); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = "#64748B"; ctx.font = "600 18px 'JetBrains Mono', monospace"; ctx.textAlign = "left";
    ctx.fillText(ch.k, cx + 24, cy + 34);
    ctx.fillStyle = ch.c; ctx.font = "700 36px 'JetBrains Mono', monospace";
    ctx.fillText(ch.v, cx + 24, cy + 70);
    cx += cw + 24;
  });
  // footer
  ctx.fillStyle = "#3B82F6"; ctx.font = "700 26px Inter, sans-serif";
  ctx.fillText("Fade me or tail me.", PAD, H - 70);
  ctx.fillStyle = "#64748B"; ctx.font = "500 22px 'JetBrains Mono', monospace"; ctx.textAlign = "right";
  ctx.fillText("striker.terminal", W - PAD, H - 70);
}

function ShareModal({ item, onClose, onMint, minting = false, minted = false }: { item: ShareItem | null; onClose: () => void; onMint?: () => void; minting?: boolean; minted?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    if (!item || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const render = () => { drawShareCard(canvas, item); setUrl(canvas.toDataURL("image/png")); };
    if (document.fonts && document.fonts.ready) { document.fonts.ready.then(render); } else { render(); }
  }, [item]);
  if (!item) return null;
  const tweet = "I just put " + item.amount.toFixed(0) + " USDG on " + item.teamName + " to " + item.verb + " on Striker Terminal. Fade me or tail me.";
  const intent = "https://twitter.com/intent/tweet?text=" + encodeURIComponent(tweet);
  const download = () => {
    if (!url) return;
    const a = document.createElement("a"); a.href = url; a.download = "striker-slip.png"; a.click();
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-scrim/55 p-6 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-lg rounded-xl border border-line/10 bg-surface p-5 shadow-2xl" onClick={(e) => e.stopPropagation()} style={{ animation: "modalIn 0.22s ease" }}>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-base font-bold tracking-tight">Share your slip</p>
            <p className="mt-0.5 font-mono text-[11px] text-muted">tail bait for the timeline</p>
          </div>
          <button onClick={onClose} className="text-muted transition hover:text-fg"><IconX className="h-4 w-4"></IconX></button>
        </div>
        <div className="mt-3 overflow-hidden rounded-lg border border-line/10">
          <canvas ref={canvasRef} className="block h-auto w-full"></canvas>
        </div>
        <div className="mt-3 flex items-center gap-2">
          {/* Mint as cNFT receipt: the digital-collectible viral loop */}
          {onMint ? (
            <button
              onClick={minted ? undefined : onMint}
              disabled={minting || minted}
              className={
                "relative inline-flex flex-[1.4] items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition active:scale-[0.98] " +
                (minted
                  ? "border border-green/40 bg-green/15 text-green"
                  : minting
                    ? "cursor-wait bg-blue-500/60 text-white"
                    : "bg-blue-500 text-white shadow-glow-blue ring-1 ring-blue-400/40 hover:bg-blue-400")
              }
            >
              {minting ? <Spinner className="h-4 w-4"></Spinner> : minted ? <IconCheck className="h-4 w-4"></IconCheck> : (
                <svg className="h-4 w-4" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M8 0l1.6 4.4L14 6l-4.4 1.6L8 12 6.4 7.6 2 6l4.4-1.6L8 0z"></path></svg>
              )}
              {minting ? "Minting cNFT..." : minted ? "Minted to Phantom" : "Mint as cNFT Receipt"}
            </button>
          ) : null}
          <a href={intent} target="_blank" rel="noopener noreferrer" className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-line/10 bg-inset px-4 py-2.5 text-sm font-semibold text-fg/80 transition hover:border-blue-500/40 hover:text-fg">
            <IconShare className="h-4 w-4"></IconShare>Post to X
          </a>
        </div>
        <button onClick={download} className="mt-2 w-full rounded-lg border border-line/10 bg-inset py-2 text-xs font-semibold text-fg/70 transition hover:border-blue-500/40 hover:text-fg">
          Download card
        </button>
        <p className="mt-2.5 text-center font-mono text-[10px] text-muted">cNFT mints to your wallet on Solana · image renders locally · no upload</p>
      </div>
    </div>
  );
}

export {
  IconLock, IconCheck, IconUp, IconDown, IconX, IconShare, IconSun, IconMoon, IconRadar, Spinner, StrikerMark,
  BlueButton, Header, Ticker, ProbabilityBar, Delta, OutcomeButton, MarketCard,
  SubscriptionConsole, SlipLine, CollectiblePredictionCard, BettingSlip, Modal, ToastStack, ShareModal, ResultModal,
  MatchCardSkeleton, RpcErrorState,
};
