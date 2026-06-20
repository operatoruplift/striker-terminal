// CONDUCTOR seam 7: chat backend.
//
// TrollboxFeed is the integration boundary for the social feed. The mock feed
// drips the demo banter pool (the prototype's TROLL_POOL + setInterval); the
// live feed is a websocket/pubsub stub that keeps the exact TrollMessage shape.
// Selected by USE_MOCKS. The user's own outgoing messages are appended by the
// component with you:true and never flow through the feed.

import { USE_MOCKS } from "../config";
import type { TrollMessage } from "../types";

export interface TrollboxFeed {
  /** Initial messages rendered before the live stream warms up. */
  seed(): TrollMessage[];
  /** Subscribe to incoming messages. Returns an unsubscribe function. */
  subscribe(onMessage: (message: TrollMessage) => void): () => void;
}

const TROLL_POOL: ReadonlyArray<Pick<TrollMessage, "addr" | "text">> = [
  { addr: "0x7b...9a", text: "USA looking dangerous on the counter" },
  { addr: "0x3f...2c", text: "just hedged my position on Morocco" },
  { addr: "0x9d...41", text: "Brazil 88% is free money, tailing" },
  { addr: "0x12...e8", text: "who is fading Argentina in the futures lol" },
  { addr: "0xa4...77", text: "scotland keeper having a nightmare" },
  { addr: "0x5e...b0", text: "up 3 streak, season pass paid for itself" },
  { addr: "0xc1...3d", text: "paraguay value bet, mark my words" },
  { addr: "0x88...1f", text: "that yellow card swung the whole market" },
  { addr: "0x6a...92", text: "liquidity on this pool is insane today" },
  { addr: "0xf0...4b", text: "tailing the alpha leaderboard #1 every time" },
  { addr: "0x2b...d7", text: "turkiye to nick it late, calling it now" },
  { addr: "0xe9...05", text: "anyone else all in on the round of 32?" },
];

const DRIP_MS = 3200;

const mockFeed: TrollboxFeed = {
  seed() {
    return TROLL_POOL.slice(0, 4).map((m, i) => ({ ...m, id: "seed" + i }));
  },
  subscribe(onMessage) {
    let idx = 4;
    const id = setInterval(() => {
      const next = TROLL_POOL[idx % TROLL_POOL.length];
      idx++;
      onMessage({ ...next, id: "m" + Date.now() });
    }, DRIP_MS);
    return () => clearInterval(id);
  },
};

// Live feed: subscribe to a websocket / pubsub topic emitting TrollMessage.
// Stubbed until an endpoint exists; keeps the identical contract.
const liveFeed: TrollboxFeed = {
  seed() {
    return [];
  },
  subscribe() {
    // TODO: connect to the chat websocket and forward messages via onMessage.
    return () => {};
  },
};

export const trollboxFeed: TrollboxFeed = USE_MOCKS ? mockFeed : liveFeed;
