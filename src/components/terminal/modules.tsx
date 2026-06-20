"use client";
// striker-modules: gamification + momentum layer. Pure presentational modules.
// TickerBar, MarketToggle, AlphaBoard, TournamentBracket, BracketModal.
// Markup ported verbatim; only module wrapper + prop types added.

import * as React from "react";
import { Flag } from "./flags";
import { Avatar } from "./live";
import { IconCheck, IconX, BlueButton } from "./components";
import type { TickerResult, AlphaRow, AlphaYou, Tie, TieSlot, FuturesPosition } from "../../lib/types";

/* ---------- TickerBar: resolved-result marquee under the header ---------- */
/* items: { home, hs, away, as } where hs/as are final scores. Winner shown in green. */

function TickerBar({ results, settledVol }: { results: TickerResult[]; settledVol: string }) {
  const Result = ({ r }: { r: TickerResult }) => {
    const homeWin = r.hs > r.as;
    const awayWin = r.as > r.hs;
    return (
      <span className="flex items-center gap-1.5">
        <Flag code={r.home} className="h-2.5 w-3.5"></Flag>
        <span className={"font-semibold " + (homeWin ? "text-green" : "text-fg/70")}>{r.home}</span>
        <span className="font-mono text-fg/90">{r.hs}</span>
        <span className="text-fg/35">-</span>
        <span className="font-mono text-fg/90">{r.as}</span>
        <span className={"font-semibold " + (awayWin ? "text-green" : "text-fg/70")}>{r.away}</span>
        <Flag code={r.away} className="h-2.5 w-3.5"></Flag>
        <span className="rounded bg-fg/[0.06] px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-muted">{r.payout} paid</span>
      </span>
    );
  };
  return (
    <div className="flex h-9 shrink-0 items-center gap-3 border-b border-line/10 bg-inset/80 px-4 font-mono text-[11px]">
      <span className="flex shrink-0 items-center gap-1.5 font-bold uppercase tracking-widest text-green">
        <span className="h-1.5 w-1.5 rounded-full bg-green"></span>Settled
      </span>
      <div className="ticker-mask relative flex-1 overflow-hidden">
        <div className="ticker-track flex w-max items-center gap-8 whitespace-nowrap text-muted">
          {[0, 1].map((d) => (
            <div key={d} className="flex items-center gap-8">
              {results.map((r, i) => (
                <React.Fragment key={i}>
                  <Result r={r}></Result>
                  <span className="text-fg/25">|</span>
                </React.Fragment>
              ))}
              <span className="flex items-center gap-1.5 text-green"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green"></span>{settledVol} USDG settled today</span>
              <span className="text-fg/25">|</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- MarketToggle: segmented control above the feed ---------- */

function ToggleTab({ id, label, badge, view, setView }: { id: string; label: string; badge: number; view: string; setView: (id: string) => void }) {
  return (
    <button
      onClick={() => setView(id)}
      className={
        "relative flex items-center gap-2 rounded-md px-4 py-1.5 text-xs font-semibold transition " +
        (view === id ? "bg-blue-500 text-white shadow-glow-blue" : "text-muted hover:text-fg")
      }
    >
      {label}
      {badge > 0 ? <span className={"rounded px-1.5 py-0.5 font-mono text-[9px] font-bold " + (view === id ? "bg-white/25 text-white" : "bg-blue-500/15 text-accent")}>{badge}</span> : null}
    </button>
  );
}

function MarketToggle({ view, setView, futuresBadge }: { view: string; setView: (id: string) => void; futuresBadge: number }) {
  return (
    <div className="inline-flex items-center gap-1 rounded-lg border border-line/10 bg-surface shadow-card p-1">
      <ToggleTab id="daily" label="Daily Matches" badge={0} view={view} setView={setView}></ToggleTab>
      <ToggleTab id="futures" label="Futures Bracket" badge={futuresBadge} view={view} setView={setView}></ToggleTab>
    </div>
  );
}

/* ---------- AlphaBoard: top wallets by profit, below the pay.sh console ---------- */

function AlphaBoard({ rows, you }: { rows: AlphaRow[]; you: AlphaYou }) {
  const medal = (i: number) => (i === 0 ? "text-accent" : i === 1 ? "text-fg/70" : "text-fg/55");
  return (
    <div className="rounded-xl border border-line/10 bg-surface p-4 shadow-card">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold tracking-tight">Alpha Leaderboard</h3>
        <span className="font-mono text-[10px] uppercase tracking-wider text-muted">7d ROI</span>
      </div>
      <div className="mt-3 space-y-1.5">
        {rows.map((r, i) => (
          <div
            key={r.addr}
            className={
              "flex items-center justify-between rounded-lg border px-2.5 py-2 " +
              (i === 0 ? "border-blue-500/40 bg-blue-500/[0.08] shadow-glow-blue" : "border-line/[0.08] bg-inset/60")
            }
          >
            <div className="flex items-center gap-2.5">
              <span className={"w-4 text-center font-mono text-xs font-bold " + medal(i)}>{i + 1}</span>
              <Avatar id={r.addr} className="h-6 w-6"></Avatar>
              <span className="font-mono text-xs text-fg/85">{r.addr}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-xs font-bold text-green">+{r.profit} USDG</span>
              <span className="font-mono text-[10px] text-muted">{r.roi}%</span>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-2 flex items-center justify-between rounded-lg border border-dashed border-line/15 px-2.5 py-2">
        <div className="flex items-center gap-2.5">
          <span className="w-4 text-center font-mono text-xs font-bold text-muted">{you.rank}</span>
          <span className="font-mono text-xs text-fg/70">{you.addr} <span className="text-muted">(you)</span></span>
        </div>
        <span className={"font-mono text-xs font-bold " + (you.profit >= 0 ? "text-green" : "text-red")}>{you.profit >= 0 ? "+" : ""}{you.profit} USDG</span>
      </div>
    </div>
  );
}

/* ---------- TournamentBracket: Round-of-32 futures tree, CSS connectors ---------- */

const BR_H = 520;            // total bracket height in px
const BR_CLEAN = "1.5px solid rgba(255,255,255,0.10)"; // border-clean connector color
interface BracketCol { key: string; label: string; n: number; w: number }
const BR_COLS: BracketCol[] = [
  { key: "r32", label: "Round of 32", n: 8, w: 200 },
  { key: "r16", label: "Round of 16", n: 4, w: 138 },
  { key: "qf", label: "Quarter-final", n: 2, w: 138 },
  { key: "sf", label: "Semi-final", n: 1, w: 138 }
];

function BracketSlot({ slot, lead }: { slot: TieSlot; lead: boolean }) {
  return (
    <div className="flex items-center justify-between gap-1">
      <div className="flex min-w-0 items-center gap-1.5">
        <span className="shrink-0 rounded bg-inset px-1 py-0.5 font-mono text-[9px] font-bold text-muted ring-1 ring-line/10">{slot.seed}</span>
        <Flag code={slot.code} className="h-3 w-[18px]"></Flag>
        <span className={"truncate text-[11px] " + (lead ? "font-semibold text-fg" : "text-fg/60")}>{slot.team}</span>
      </div>
      <span className={"shrink-0 font-mono text-[11px] font-bold " + (lead ? "text-accent" : "text-muted")}>{slot.pct}%</span>
    </div>
  );
}

function BracketConnector({ pairs }: { pairs: number }) {
  return (
    <div className="flex shrink-0 flex-col" style={{ width: 26, height: BR_H }}>
      {Array.from({ length: pairs }).map((_, i) => (
        <div key={i} className="flex flex-1 flex-col">
          <div className="flex-1"></div>
          <div className="flex-[2]" style={{ borderRight: BR_CLEAN, borderTop: BR_CLEAN, borderBottom: BR_CLEAN }}></div>
          <div className="flex-1"></div>
        </div>
      ))}
    </div>
  );
}

interface TournamentBracketProps {
  ties: Tie[];
  futures: Record<string, FuturesPosition>;
  onPickTie: (tie: Tie) => void;
}
function TournamentBracket({ ties, futures, onPickTie }: TournamentBracketProps) {
  const colNodes = (col: BracketCol, c: number) =>
    Array.from({ length: col.n }).map((_, j) => {
      const inner = (() => {
        if (c === 0) {
          const tie = ties[j];
          const pos = futures[tie.id];
          const leadA = tie.a.pct >= tie.b.pct;
          return (
            <button
              onClick={() => onPickTie(tie)}
              className={
                "flex w-full flex-col gap-1 rounded-lg border px-2.5 py-1.5 text-left transition " +
                (pos ? "border-blue-500 bg-blue-500/[0.1] shadow-glow-blue" : "border-line/10 bg-surface hover:border-blue-500/50")
              }
            >
              <BracketSlot slot={tie.a} lead={pos ? pos.pick === "a" : leadA}></BracketSlot>
              <div className="h-px w-full bg-fg/[0.06]"></div>
              <BracketSlot slot={tie.b} lead={pos ? pos.pick === "b" : !leadA}></BracketSlot>
              {pos ? (
                <span className="mt-0.5 flex items-center gap-1 font-mono text-[9px] font-bold uppercase tracking-wider text-accent">
                  <IconCheck className="h-2.5 w-2.5"></IconCheck>{pos.team} · {pos.amount} USDG
                </span>
              ) : null}
            </button>
          );
        }
        return (
          <div className="flex w-full items-center justify-center rounded-lg border border-dashed border-line/10 bg-inset/50 py-3 font-mono text-[10px] text-muted">
            {col.key === "sf" ? "Finalist TBD" : "Advances"}
          </div>
        );
      })();
      return (
        <div key={col.key + j} className="flex flex-1 items-center">
          {inner}
        </div>
      );
    });

  return (
    <div className="rounded-xl border border-line/10 bg-surface/60 p-4 shadow-card">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold tracking-tight">Futures: Round of 32</h2>
          <p className="font-mono text-[11px] text-muted">long-term liquidity pool · predict who advances · tap a Round of 32 tie</p>
        </div>
        <span className="hidden rounded-md border border-line/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-muted sm:block">scroll to pan</span>
      </div>

      {/* column header row */}
      <div className="mt-4 flex min-w-[692px] items-center">
        {BR_COLS.map((col, c) => (
          <React.Fragment key={col.key}>
            <div className="font-mono text-[9px] uppercase tracking-[0.15em] text-muted" style={{ width: col.w }}>{col.label}</div>
            {c < BR_COLS.length - 1 ? <div style={{ width: 26 }}></div> : null}
          </React.Fragment>
        ))}
      </div>

      <div className="overflow-x-auto pb-1">
        <div className="flex min-w-[692px]" style={{ height: BR_H }}>
          {BR_COLS.map((col, c) => (
            <React.Fragment key={col.key}>
              <div className="flex flex-col" style={{ width: col.w, height: BR_H }}>
                {colNodes(col, c)}
              </div>
              {c < BR_COLS.length - 1 ? <BracketConnector pairs={BR_COLS[c + 1].n}></BracketConnector> : null}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- BracketModal: predict the advancing team in a tie ---------- */

interface BracketModalProps {
  tie: Tie;
  pick: "a" | "b";
  stake: string;
  busy: boolean;
  balance: number;
  onPick: (id: "a" | "b") => void;
  onStake: (value: string) => void;
  onConfirm: () => void;
  onClose: () => void;
}
function BracketChoice({ id, s, pick, onPick }: { id: "a" | "b"; s: TieSlot; pick: "a" | "b"; onPick: (id: "a" | "b") => void }) {
  return (
    <button
      onClick={() => onPick(id)}
      className={
        "flex flex-1 flex-col items-start gap-1 rounded-lg border px-3 py-2.5 text-left transition " +
        (pick === id ? "border-blue-500 bg-blue-500/10" : "border-line/10 bg-inset hover:border-blue-500/50")
      }
    >
      <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-muted">{s.seed}</span>
      <span className={"flex items-center gap-1.5 text-sm font-semibold " + (pick === id ? "text-fg" : "text-fg/70")}><Flag code={s.code} className="h-3.5 w-5"></Flag>{s.team}</span>
      <span className={"font-mono text-base font-bold " + (pick === id ? "text-accent" : "text-muted")}>{s.pct}%</span>
    </button>
  );
}

function BracketModal({ tie, pick, stake, busy, balance, onPick, onStake, onConfirm, onClose }: BracketModalProps) {
  const slot = pick === "a" ? tie.a : tie.b;
  const odds = 100 / slot.pct;
  const amt = parseFloat(stake) || 0;
  const tooMuch = amt > balance;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-scrim/55 p-6 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-sm rounded-xl border border-line/10 bg-surface p-5 shadow-2xl" onClick={(e) => e.stopPropagation()} style={{ animation: "modalIn 0.22s ease" }}>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-base font-bold tracking-tight">Round of 32 Futures</p>
            <p className="mt-0.5 font-mono text-[10px] text-muted">{tie.label} · who advances?</p>
          </div>
          <button onClick={onClose} className="text-muted transition hover:text-fg"><IconX className="h-4 w-4"></IconX></button>
        </div>

        <div className="mt-3 flex gap-2">
          <BracketChoice id="a" s={tie.a} pick={pick} onPick={onPick}></BracketChoice>
          <BracketChoice id="b" s={tie.b} pick={pick} onPick={onPick}></BracketChoice>
        </div>

        <div className="mt-3 flex items-center gap-2 rounded-lg border border-line/10 bg-inset px-3 py-2 focus-within:border-blue-500/60">
          <input
            type="text" inputMode="decimal" value={stake}
            onChange={(e) => onStake(e.target.value.replace(/[^0-9.]/g, ""))}
            placeholder="0.00"
            className="w-full bg-transparent font-mono text-base font-bold text-fg outline-none placeholder:text-muted"
          ></input>
          <span className="font-mono text-[10px] text-muted">USDG</span>
        </div>

        <div className="mt-3 space-y-1.5 rounded-lg border border-line/10 bg-inset/60 p-3 font-mono text-xs">
          <div className="flex justify-between"><span className="text-muted">pick</span><span className="font-bold text-accent">{slot.team}</span></div>
          <div className="flex justify-between"><span className="text-muted">odds</span><span className="text-fg/80">{odds.toFixed(2)}x</span></div>
          <div className="flex justify-between border-t border-line/10 pt-1.5"><span className="text-muted">potential return</span><span className="font-bold text-green">{(amt * odds).toFixed(2)} USDG</span></div>
        </div>

        <BlueButton onClick={onConfirm} loading={busy} disabled={amt <= 0 || tooMuch} className="mt-4 w-full">
          {tooMuch ? "Insufficient USDG" : busy ? "Confirming on chain..." : "Lock Futures Position"}
        </BlueButton>
        <p className="mt-2.5 text-center font-mono text-[10px] text-muted">settles at Round of 32 qualification</p>
      </div>
    </div>
  );
}

export { TickerBar, MarketToggle, AlphaBoard, TournamentBracket, BracketModal };
