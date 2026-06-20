// Isolated demo data pool. Every value here is mock-only; the live data layer
// (data/index.ts + transform.ts) replaces these with on-chain reads when
// USE_MOCKS is false. Nothing else in the app references these constants
// directly, so the demo can be turned off in one place.

import { MOCK_USDG_BALANCE } from "../config";
import type { MatchData, TickerResult, Tie, AlphaRow, BetPosition, FuturesPosition } from "../types";

export const MOCK_MARKETS: MatchData[] = [
  { id: "m1", tag: "Group D · Live", status: "live", minute: 58, score: [2, 0], kickoff: "",
    home: { code: "USA", name: "United States" }, away: { code: "AUS", name: "Australia" },
    pct: { home: 66, draw: 22, away: 12 }, delta: { home: 5.4, draw: -1.2, away: -4.2 }, vol: "$1.6M", liquidity: "$380K" },
  { id: "m2", tag: "Group B · Today", status: "up", minute: 0, score: [0, 0], kickoff: "18:00 UTC",
    home: { code: "SCO", name: "Scotland" }, away: { code: "MAR", name: "Morocco" },
    pct: { home: 28, draw: 27, away: 45 }, delta: { home: -2.1, draw: 0.3, away: 1.8 }, vol: "$910K", liquidity: "$220K" },
  { id: "m3", tag: "Group C · Live", status: "live", minute: 31, score: [3, 0], kickoff: "",
    home: { code: "BRA", name: "Brazil" }, away: { code: "HAI", name: "Haiti" },
    pct: { home: 88, draw: 9, away: 3 }, delta: { home: 2.6, draw: -1.4, away: -1.2 }, vol: "$2.3M", liquidity: "$610K" },
  { id: "m4", tag: "Group F · Today", status: "up", minute: 0, score: [0, 0], kickoff: "21:00 UTC",
    home: { code: "TUR", name: "Turkiye" }, away: { code: "PAR", name: "Paraguay" },
    pct: { home: 52, draw: 27, away: 21 }, delta: { home: 1.1, draw: 0.2, away: -1.3 }, vol: "$740K", liquidity: "$170K" },
];

export const MOCK_RESULTS: TickerResult[] = [
  { home: "USA", hs: 4, away: "PAR", as: 1, payout: "$1.2M" },
  { home: "GER", hs: 7, away: "CUR", as: 1, payout: "$2.4M" },
  { home: "BRA", hs: 1, away: "MAR", as: 1, payout: "$880K" },
  { home: "ARG", hs: 3, away: "JPN", as: 0, payout: "$1.6M" },
  { home: "ESP", hs: 2, away: "USA", as: 2, payout: "$1.1M" },
];
export const MOCK_SETTLED_VOL = "$9.8M";

export const MOCK_TIES: Tie[] = [
  { id: "t1", label: "A1 vs B2", a: { seed: "A1", team: "Argentina", code: "ARG", pct: 71 }, b: { seed: "B2", team: "Croatia", code: "CRO", pct: 29 } },
  { id: "t2", label: "C1 vs D2", a: { seed: "C1", team: "Brazil", code: "BRA", pct: 64 }, b: { seed: "D2", team: "Senegal", code: "SEN", pct: 36 } },
  { id: "t3", label: "E1 vs F2", a: { seed: "E1", team: "France", code: "FRA", pct: 68 }, b: { seed: "F2", team: "Mexico", code: "MEX", pct: 32 } },
  { id: "t4", label: "G1 vs H2", a: { seed: "G1", team: "England", code: "ENG", pct: 58 }, b: { seed: "H2", team: "Morocco", code: "MAR", pct: 42 } },
  { id: "t5", label: "B1 vs A2", a: { seed: "B1", team: "Spain", code: "ESP", pct: 62 }, b: { seed: "A2", team: "Netherlands", code: "NED", pct: 38 } },
  { id: "t6", label: "D1 vs C2", a: { seed: "D1", team: "Portugal", code: "POR", pct: 55 }, b: { seed: "C2", team: "Uruguay", code: "URU", pct: 45 } },
  { id: "t7", label: "F1 vs E2", a: { seed: "F1", team: "Germany", code: "GER", pct: 60 }, b: { seed: "E2", team: "Japan", code: "JPN", pct: 40 } },
  { id: "t8", label: "H1 vs G2", a: { seed: "H1", team: "Belgium", code: "BEL", pct: 53 }, b: { seed: "G2", team: "USA", code: "USA", pct: 47 } },
];

export const MOCK_ALPHA: AlphaRow[] = [
  { addr: "9xQr...4m1a", profit: 4820, roi: 312 },
  { addr: "3kLp...8c0d", profit: 2640, roi: 188 },
  { addr: "7vNw...2t9e", profit: 1410, roi: 96 },
];

/** localStorage demo persistence shape (dropped for live wallet + chain state). */
export interface DemoPersisted {
  connected: boolean;
  subscribed: boolean;
  sol: number;
  usdg: number;
  positions: Record<string, BetPosition>;
  futures: Record<string, FuturesPosition>;
}

export const DEMO_KEY = "striker_terminal_v2";
export const DEMO_FRESH: DemoPersisted = {
  connected: false,
  subscribed: false,
  sol: 4.2,
  usdg: MOCK_USDG_BALANCE,
  positions: {},
  futures: {},
};

export const MOCK_ADDRESS = "4xKp...9b2c";
export const MOCK_PUBLIC_KEY = "4xKp9bRkq2vNcd1111111111111111111111119b2c";
