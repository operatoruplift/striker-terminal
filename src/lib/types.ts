// Strict data contracts for Striker Terminal. Ported from the prototype handoff
// spec (Hackathon ZIP `types.ts`) and extended with the runtime UI shapes the
// store and presentational components consume. The visual components import
// these unchanged; on-chain account data and pay.sh SDK responses are mapped
// onto them in the data/transform + gateway layers.
//
// Formatting: regular hyphens only, no em or en dashes.

/* ===========================================================================
 * Shared primitives
 * =========================================================================== */

/** Outcome side of a 3-way match market. */
export type Outcome = "home" | "draw" | "away";
/** CONDUCTOR alias for Outcome. */
export type Side = Outcome;

/** Lifecycle of a single market. up = upcoming, live = in play, ft = full time. */
export type MarketStatus = "up" | "live" | "ft";

/** Wallet adapter connection state. */
export type WalletStatus = "idle" | "connecting" | "connected";

/** pay.sh subscription stream state. */
export type SubscriptionStatus = "none" | "signing" | "active";

/** Solana transaction lifecycle, surfaced in the confirm modal progress bar. */
export type TxStage = "idle" | "signing" | "submitting" | "confirming" | "confirmed";

/** Health of the market-feed data source (Solana RPC). */
export type FeedStatus = "ready" | "loading" | "error";

/** A team entry. code is the 3-letter tag rendered on cards and chips. */
export interface Team {
  /** 3-letter uppercase code, e.g. "USA". */
  code: string;
  /** Full display name, e.g. "United States". */
  name: string;
}

/** Implied-probability split across the three outcomes. Should sum to 100. */
export interface ProbabilitySplit {
  home: number;
  draw: number;
  away: number;
}

/* ===========================================================================
 * MatchData: a World Cup fixture / prediction market.
 * Renders MarketCard, MatchTracker, and the probability bar.
 * Maps to one Market account in the prediction-market program.
 * =========================================================================== */

export interface MatchData {
  /** Stable market id, derived from the Market account pubkey. */
  id: string;
  /** Eyebrow label, e.g. "Group D - Live". */
  tag: string;
  status: MarketStatus;
  /** Live match clock in minutes. 0 when not live. */
  minute: number;
  /** Current score as [home, away]. [0, 0] before kickoff. */
  score: [number, number];
  /** Kickoff time string, e.g. "18:00 UTC". Empty when status is not "up". */
  kickoff: string;
  home: Team;
  away: Team;
  /** Implied probability per outcome (sums to 100). Drives odds = 100 / pct. */
  pct: ProbabilitySplit;
  /** 24h probability move per outcome, in points. Positive up, negative down. */
  delta: ProbabilitySplit;
  /** Total pool volume, preformatted for display, e.g. "$1.6M". */
  vol: string;
  /** Available liquidity in the pool, preformatted, e.g. "$380K". */
  liquidity: string;
}

/* Convenience alias: the prototype/store call this shape `Market`. */
export type Market = MatchData;

/* ===========================================================================
 * Wallet + balances
 * =========================================================================== */

export interface TokenBalances {
  /** Native SOL balance. */
  sol: number;
  /** USDG (prediction token) balance available to stake. */
  usdg: number;
}

export interface UserProfile {
  status: WalletStatus;
  /** Full base58 public key. Null until connected. */
  publicKey: string | null;
  /** Truncated address for display, e.g. "4xKp...9b2c". */
  address: string;
  /** True when the pay.sh Season Pass stream is active. Gates every market. */
  hasActiveSeasonPass: boolean;
  balances: TokenBalances;
}

/** Flat wallet object the Header and other components read directly. */
export interface Wallet {
  status: WalletStatus;
  address: string;
  sol: number;
  usdg: number;
}

/* ===========================================================================
 * Positions, slip, futures
 * =========================================================================== */

/** A working line in the slip before submission. amount is a raw input string. */
export interface SlipLine {
  matchId: string;
  pick: Outcome;
  amount: string;
}

/** A confirmed on-chain position. Keyed by market id in the positions map. */
export interface BetPosition {
  pick: Outcome;
  /** Stake in USDG, locked at fill. */
  amount: number;
  /** Leverage: odds multiplier locked at fill (100 / implied pct). */
  odds: number;
}

/** A confirmed Round of 32 futures position. Keyed by tie id. */
export interface FuturesPosition {
  /** Which slot of the tie was backed to advance. */
  pick: "a" | "b";
  /** Resolved team name for display. */
  team: string;
  amount: number;
  odds: number;
}

/* ===========================================================================
 * Round of 32 bracket
 * =========================================================================== */

export interface TieSlot {
  seed: string;
  team: string;
  code: string;
  /** Implied probability this slot advances. */
  pct: number;
}
export interface Tie {
  id: string;
  label: string;
  a: TieSlot;
  b: TieSlot;
}

/* ===========================================================================
 * Leaderboard, ticker, settlement, share, chat, toasts
 * =========================================================================== */

export interface AlphaRow {
  addr: string;
  profit: number;
  roi: number;
}

/** "You" row appended under the AlphaBoard. */
export interface AlphaYou {
  rank: number;
  addr: string;
  profit: number;
}

/** A settled result feeding the TickerBar marquee. */
export interface TickerResult {
  home: string;
  hs: number;
  away: string;
  as: number;
  payout: string;
}

/** One resolved line in the settlement result modal. */
export interface ResultLine {
  label: string;
  win: boolean;
  payout: number;
  stake: number;
}
/** Payload for the payout celebration modal after settlement. */
export interface SettleResult {
  payout: number;
  staked: number;
  lines: ResultLine[];
}

/** Working payload for the share-to-X canvas card. */
export interface ShareItem {
  matchLabel: string;
  teamName: string;
  pick: Outcome;
  verb: string;
  odds: number;
  amount: number;
  potential: number;
}

/** One line in the Trollbox social feed (render shape). */
export interface TrollMessage {
  id: string;
  /** Truncated wallet or handle, e.g. "0x7b...9a". */
  addr: string;
  text: string;
  /** True for the connected user's own messages (renders in accent). */
  you?: boolean;
}

export type ToastKind = "ok" | "err" | "info";
export interface Toast {
  id: number;
  title: string;
  sub: string;
  kind: ToastKind;
}

/* ===========================================================================
 * Auto-Strike (Sleep Mode): programmable conditional limit orders, executed by
 * a keeper while the user is asleep (the 3am-kickoff timezone insight).
 * =========================================================================== */

/** Bet slip working mode. */
export type SlipMode = "live" | "auto";

/** Lifecycle of a deployed Auto-Strike order. */
export type AutoStrikeStatus = "listening" | "armed" | "executed";

/** A deployed conditional order waiting on a trigger. */
export interface AutoStrike {
  id: string;
  /** Market this order targets (MatchData.id). */
  matchId: string;
  /** Display label, e.g. "USA v AUS". */
  label: string;
  pick: Outcome;
  /** Stake in USDG to deploy when the trigger fires. */
  amount: number;
  /** Human trigger condition, e.g. "odds hit +150" or "at Kickoff". */
  trigger: string;
  status: AutoStrikeStatus;
}

/** Status badge on a collectible Alpha Card. */
export type CardStatus = "Active" | "Locked" | "Success";
