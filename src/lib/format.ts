// Pure formatting + derivation helpers. No state, no side effects.
// These mirror the prototype's inline helpers so the components render unchanged.

import type { MatchData, Outcome } from "./types";

/** Truncate a base58 public key for display, e.g. "4xKp...9b2c". */
export function truncateAddress(address: string, head = 4, tail = 4): string {
  if (address.length <= head + tail + 3) return address;
  return address.slice(0, head) + "..." + address.slice(-tail);
}

/** Mock signature in the prototype's "abcd...wxyz" shape (demo only). */
export function makeSig(): string {
  const cs = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz123456789";
  const seg = (n: number) =>
    Array.from({ length: n }, () => cs[Math.floor(Math.random() * cs.length)]).join("");
  return seg(4) + "..." + seg(4);
}

/** Truncate a real signature to the same display shape. */
export function truncateSig(signature: string): string {
  return truncateAddress(signature, 4, 4);
}

/** Odds multiplier derived from implied probability: 100 / pct. */
export function oddsFor(m: MatchData, pick: Outcome): number {
  return 100 / m.pct[pick];
}

/** Display label for an outcome on a given match. */
export function codeFor(m: MatchData, k: Outcome): string {
  return k === "home" ? m.home.code : k === "away" ? m.away.code : "Draw";
}
