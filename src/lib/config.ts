// Central runtime configuration + the single mock<->live switch.
//
// USE_MOCKS (default true) selects the demo data sources and the mock chain
// gateway. With it true the terminal runs fully offline (what judges see by
// default and what visual-regression screenshots capture). Set
// NEXT_PUBLIC_USE_MOCKS=false to exercise the real devnet wallet + tx pipeline
// and the live read/transform path (which surfaces the RPC error view cleanly
// while no program is deployed).
//
// All on-chain identifiers are optional: none are deployed yet, so the live
// gateway falls back to honest placeholders (a Memo transaction for the tx
// lifecycle, a mocked USDG balance) until real values are supplied.

import { clusterApiUrl, PublicKey } from "@solana/web3.js";

/** Master switch. Defaults to mock mode unless explicitly disabled. */
export const USE_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS !== "false";

/** Solana cluster the wallet + tx layer targets. */
export const RPC_ENDPOINT =
  process.env.NEXT_PUBLIC_RPC_ENDPOINT ?? clusterApiUrl("devnet");

/** Optional USDG SPL mint. When set, balances read the wallet's ATA. */
export const USDG_MINT: PublicKey | null = safePublicKey(
  process.env.NEXT_PUBLIC_USDG_MINT,
);

/** Optional Anchor program ids (placeholder until deployed). */
export const PREDICTION_PROGRAM_ID: PublicKey | null = safePublicKey(
  process.env.NEXT_PUBLIC_PREDICTION_PROGRAM_ID,
);
export const FUTURES_PROGRAM_ID: PublicKey | null = safePublicKey(
  process.env.NEXT_PUBLIC_FUTURES_PROGRAM_ID,
);

/** Optional pay.sh stream parameters. */
export const PAYSH_DELEGATE: PublicKey | null = safePublicKey(
  process.env.NEXT_PUBLIC_PAYSH_DELEGATE,
);

/** Season Pass economics (display + stub amounts). */
export const SEASON_PASS_USDG_PER_WEEK = 10;

/** Fallback USDG balance shown before a real mint is wired. */
export const MOCK_USDG_BALANCE = 250;

function safePublicKey(value: string | undefined): PublicKey | null {
  if (!value) return null;
  try {
    return new PublicKey(value);
  } catch {
    return null;
  }
}
