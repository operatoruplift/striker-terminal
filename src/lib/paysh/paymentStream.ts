// pay.sh recurring subscription gateway (CONDUCTOR seam 3).
//
// The Season Pass is a $10 USDG / week recurring pay.sh stream that gates every
// prediction. This module is the integration boundary for the pay.sh SDK: it
// exposes the stream parameters, the next-charge date, and a place to build the
// subscribe instruction set. The exact pay.sh package + delegate are not wired
// yet, so buildSubscribeInstructions returns null and the store falls back to
// the real tx lifecycle (sendPlaceholderTx) in live mode / staged timers in
// mock mode. When the SDK lands, return its instructions here unchanged.

import { PublicKey, TransactionInstruction } from "@solana/web3.js";
import { SEASON_PASS_USDG_PER_WEEK, PAYSH_DELEGATE } from "../config";

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

/** Human next-charge date, e.g. "Jun 23 2026" (one week out). */
export function nextChargeDate(from: Date = new Date()): string {
  const d = new Date(from.getTime() + WEEK_MS);
  return d
    .toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    .replace(",", "");
}

export interface PaymentStreamClient {
  /** USDG charged per weekly interval. */
  ratePerWeek: number;
  /** Configured pay.sh delegate authority, when present. */
  delegate: PublicKey | null;
  /** Next charge date for display. */
  nextCharge(): string;
  /**
   * Build the pay.sh subscribe instruction set for the connected owner.
   * Returns null until the SDK + delegate are wired; the store then sends the
   * real tx lifecycle placeholder instead.
   */
  buildSubscribeInstructions(owner: PublicKey): TransactionInstruction[] | null;
}

export const paymentStream: PaymentStreamClient = {
  ratePerWeek: SEASON_PASS_USDG_PER_WEEK,
  delegate: PAYSH_DELEGATE,
  nextCharge: () => nextChargeDate(),
  buildSubscribeInstructions() {
    // TODO: return paysh.subscribe({ delegate: PAYSH_DELEGATE, amount, interval })
    //       instructions once the pay.sh SDK + delegate are provided.
    return null;
  },
};
