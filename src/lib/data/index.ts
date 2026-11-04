// Read-side integration boundary. Each getter returns mock data when USE_MOCKS
// is true. When false, it fetches real World Cup 2026 data from the
// worldcup26.ir free API via the live data layer. Futures and leaderboard data
// still fall back to mocks / empty arrays until on-chain programs are deployed.

import { USE_MOCKS, FUTURES_PROGRAM_ID } from "../config";
import type { MatchData, TickerResult, Tie, AlphaRow } from "../types";
import {
  MOCK_MARKETS,
  MOCK_RESULTS,
  MOCK_SETTLED_VOL,
  MOCK_TIES,
  MOCK_ALPHA,
} from "./mock";
import { fetchLiveMarkets, fetchLiveResults } from "./live";

export async function getMarkets(): Promise<MatchData[]> {
  if (USE_MOCKS) return MOCK_MARKETS;
  return fetchLiveMarkets();
}

export async function getResults(): Promise<{ results: TickerResult[]; settledVol: string }> {
  if (USE_MOCKS) return { results: MOCK_RESULTS, settledVol: MOCK_SETTLED_VOL };
  return fetchLiveResults();
}

export async function getTies(): Promise<Tie[]> {
  if (USE_MOCKS) return MOCK_TIES;
  if (!FUTURES_PROGRAM_ID) throw new Error("Futures program not deployed");
  throw new Error("Live feed not yet wired (awaiting program IDL deployment)");
}

export async function getAlpha(): Promise<AlphaRow[]> {
  if (USE_MOCKS) return MOCK_ALPHA;
  // Leaderboard comes from an off-chain indexer; empty until that ships.
  return [];
}
