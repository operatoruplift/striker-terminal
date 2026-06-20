// Strict on-chain -> UI transformation pipeline (CONDUCTOR section 2).
//
// Anchor account data is decoded by the program client, then mapped here onto
// the exact MatchData / Tie / AlphaRow shapes the components render. The mappers
// clean, parse, clamp, and normalize untrusted chain data so a malformed account
// can never break a property the UI depends on (team names, the probability
// split that must sum to 100, the preformatted volume strings, etc.).
//
// The raw account interfaces below describe the expected program layout. When
// the real IDL ships, decode with Anchor and feed the decoded account straight
// into these mappers - the UI contracts do not change.

import type {
  MatchData,
  MarketStatus,
  ProbabilitySplit,
  Tie,
  AlphaRow,
  TickerResult,
} from "../types";

/* ---------- expected raw program account shapes ---------- */

export interface RawTeam {
  code?: unknown;
  name?: unknown;
}

export interface RawMarketAccount {
  tag?: unknown;
  status?: unknown;
  minute?: unknown;
  scoreHome?: unknown;
  scoreAway?: unknown;
  kickoff?: unknown;
  home?: RawTeam;
  away?: RawTeam;
  /** Implied probability, in basis points or points; normalized to sum 100. */
  pctHome?: unknown;
  pctDraw?: unknown;
  pctAway?: unknown;
  deltaHome?: unknown;
  deltaDraw?: unknown;
  deltaAway?: unknown;
  /** Pool volume + liquidity in base units (lamports of the quote token). */
  volume?: unknown;
  liquidity?: unknown;
}

/* ---------- primitives ---------- */

function str(value: unknown, fallback = ""): string {
  return typeof value === "string" && value.length > 0 ? value : fallback;
}

function code3(value: unknown): string {
  return str(value).toUpperCase().slice(0, 3) || "TBD";
}

function num(value: unknown, fallback = 0): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "bigint") return Number(value);
  if (typeof value === "string") {
    const n = Number(value);
    if (Number.isFinite(n)) return n;
  }
  // Anchor BN: { toNumber() }
  if (value && typeof value === "object" && "toNumber" in value) {
    try {
      const n = (value as { toNumber: () => number }).toNumber();
      if (Number.isFinite(n)) return n;
    } catch {
      /* fall through */
    }
  }
  return fallback;
}

const VALID_STATUS: ReadonlySet<MarketStatus> = new Set(["up", "live", "ft"]);
function marketStatus(value: unknown): MarketStatus {
  return VALID_STATUS.has(value as MarketStatus) ? (value as MarketStatus) : "up";
}

/** Force the three implied probabilities to sum to exactly 100. */
export function normalizeSplit(home: number, draw: number, away: number): ProbabilitySplit {
  const h = Math.max(0, home), d = Math.max(0, draw), a = Math.max(0, away);
  const total = h + d + a;
  if (total <= 0) return { home: 34, draw: 33, away: 33 };
  const scale = 100 / total;
  const rh = Math.round(h * scale);
  const rd = Math.round(d * scale);
  const ra = 100 - rh - rd; // absorb rounding drift into away so it always sums to 100
  return { home: rh, draw: rd, away: Math.max(0, ra) };
}

/** Compact USD display string, e.g. 1_600_000 -> "$1.6M". */
export function formatUsd(value: number): string {
  const v = Math.abs(value);
  if (v >= 1_000_000) return "$" + (value / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (v >= 1_000) return "$" + Math.round(value / 1_000) + "K";
  return "$" + Math.round(value);
}

/* ---------- account mappers ---------- */

export function toMatchData(id: string, acc: RawMarketAccount): MatchData {
  const status = marketStatus(acc.status);
  const scoreHome = Math.max(0, Math.round(num(acc.scoreHome)));
  const scoreAway = Math.max(0, Math.round(num(acc.scoreAway)));
  const pct = normalizeSplit(num(acc.pctHome), num(acc.pctDraw), num(acc.pctAway));
  return {
    id,
    tag: str(acc.tag, "Group · Match"),
    status,
    minute: status === "live" ? Math.max(0, Math.round(num(acc.minute))) : 0,
    score: [scoreHome, scoreAway],
    kickoff: status === "up" ? str(acc.kickoff) : "",
    home: { code: code3(acc.home?.code), name: str(acc.home?.name, code3(acc.home?.code)) },
    away: { code: code3(acc.away?.code), name: str(acc.away?.name, code3(acc.away?.code)) },
    pct,
    delta: {
      home: round1(num(acc.deltaHome)),
      draw: round1(num(acc.deltaDraw)),
      away: round1(num(acc.deltaAway)),
    },
    vol: formatUsd(num(acc.volume)),
    liquidity: formatUsd(num(acc.liquidity)),
  };
}

export interface RawTieAccount {
  label?: unknown;
  aSeed?: unknown; aTeam?: unknown; aCode?: unknown; aPct?: unknown;
  bSeed?: unknown; bTeam?: unknown; bCode?: unknown; bPct?: unknown;
}
export function toTie(id: string, acc: RawTieAccount): Tie {
  const aPct = Math.max(0, Math.min(100, Math.round(num(acc.aPct))));
  return {
    id,
    label: str(acc.label, "Tie"),
    a: { seed: str(acc.aSeed), team: str(acc.aTeam, "TBD"), code: code3(acc.aCode), pct: aPct },
    b: { seed: str(acc.bSeed), team: str(acc.bTeam, "TBD"), code: code3(acc.bCode), pct: 100 - aPct },
  };
}

export interface RawAlphaAccount {
  addr?: unknown;
  profit?: unknown;
  roi?: unknown;
}
export function toAlphaRow(acc: RawAlphaAccount): AlphaRow {
  return {
    addr: str(acc.addr, "unknown"),
    profit: Math.round(num(acc.profit)),
    roi: Math.round(num(acc.roi)),
  };
}

export interface RawResultAccount {
  home?: unknown; scoreHome?: unknown; away?: unknown; scoreAway?: unknown; payout?: unknown;
}
export function toTickerResult(acc: RawResultAccount): TickerResult {
  return {
    home: code3(acc.home),
    hs: Math.max(0, Math.round(num(acc.scoreHome))),
    away: code3(acc.away),
    as: Math.max(0, Math.round(num(acc.scoreAway))),
    payout: formatUsd(num(acc.payout)),
  };
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}
