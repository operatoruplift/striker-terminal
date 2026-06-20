// Read-side integration boundary. Each getter returns mock data when USE_MOCKS
// is true and reads/transforms on-chain accounts when false. With no program
// deployed, the live path throws a clear error, which the store surfaces through
// the RpcErrorState view - exactly the resilience path we want to prove.

import { USE_MOCKS, PREDICTION_PROGRAM_ID, FUTURES_PROGRAM_ID } from "../config";
import type { MatchData, TickerResult, Tie, AlphaRow } from "../types";
import {
  MOCK_MARKETS,
  MOCK_RESULTS,
  MOCK_SETTLED_VOL,
  MOCK_TIES,
  MOCK_ALPHA,
} from "./mock";

const NOT_WIRED = "Live feed not yet wired (awaiting program IDL deployment)";

export async function getMarkets(): Promise<MatchData[]> {
  if (USE_MOCKS) return MOCK_MARKETS;
  if (!PREDICTION_PROGRAM_ID) throw new Error("Prediction market program not deployed");
  // TODO: const program = loadProgram(provider, predictionIdl, PREDICTION_PROGRAM_ID);
  //       const accts = await program.account.market.all();
  //       return accts.map((a) => toMatchData(a.publicKey.toBase58(), a.account));
  throw new Error(NOT_WIRED);
}

export async function getResults(): Promise<{ results: TickerResult[]; settledVol: string }> {
  if (USE_MOCKS) return { results: MOCK_RESULTS, settledVol: MOCK_SETTLED_VOL };
  if (!PREDICTION_PROGRAM_ID) throw new Error("Prediction market program not deployed");
  throw new Error(NOT_WIRED);
}

export async function getTies(): Promise<Tie[]> {
  if (USE_MOCKS) return MOCK_TIES;
  if (!FUTURES_PROGRAM_ID) throw new Error("Futures program not deployed");
  throw new Error(NOT_WIRED);
}

export async function getAlpha(): Promise<AlphaRow[]> {
  if (USE_MOCKS) return MOCK_ALPHA;
  // Leaderboard comes from an off-chain indexer; empty until that ships.
  return [];
}
