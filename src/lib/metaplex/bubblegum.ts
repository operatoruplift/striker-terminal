// =============================================================================
// CONDUCTOR-SEAM: INJECT METAPLEX BUBBLEGUM MINT LOGIC HERE
// =============================================================================
// Mintable prediction-slip receipt: turn a confirmed position into a compressed
// NFT (cNFT) collectible + verifiable on-chain receipt of the user's alpha.
//
// buildReceiptMetadata() produces the exact cNFT payload (name, symbol,
// attributes) from the share card. buildMintReceiptInstructions() is where the
// Metaplex Bubblegum mintV1 call goes once the Merkle tree + collection are
// provisioned on devnet:
//
//   import { createTree, mintV1 } from "@metaplex-foundation/mpl-bubblegum";
//   const ix = await mintV1(umi, { leafOwner: owner, merkleTree, metadata: {
//     name: meta.name, symbol: meta.symbol, uri, sellerFeeBasisPoints: 0,
//     creators: [...], collection: { key: collectionMint, verified: false },
//   }});
//   return [ix];
//
// Until then this returns null and the store sends the real tx lifecycle
// placeholder so the full sign -> submit -> confirm flow still runs on devnet.
//
// Formatting: regular hyphens only, no em or en dashes.
// =============================================================================

import type { PublicKey, TransactionInstruction } from "@solana/web3.js";
import type { ShareItem } from "../types";

export interface ReceiptAttribute {
  trait_type: string;
  value: string;
}

export interface ReceiptMetadata {
  name: string;
  symbol: string;
  description: string;
  attributes: ReceiptAttribute[];
}

/** Build the cNFT metadata payload for a prediction-slip share card. */
export function buildReceiptMetadata(item: ShareItem): ReceiptMetadata {
  return {
    name: "Striker Slip - " + item.teamName,
    symbol: "STRIKR",
    description:
      item.amount.toFixed(2) + " USDG on " + item.teamName + " to " + item.verb + " (" + item.matchLabel + ")",
    attributes: [
      { trait_type: "Match", value: item.matchLabel },
      { trait_type: "Pick", value: item.teamName },
      { trait_type: "Side", value: item.pick },
      { trait_type: "Stake", value: item.amount.toFixed(2) + " USDG" },
      { trait_type: "Odds", value: item.odds.toFixed(2) + "x" },
      { trait_type: "To Win", value: item.potential.toFixed(2) + " USDG" },
    ],
  };
}

/**
 * CONDUCTOR-SEAM: return the Bubblegum mintV1 instruction set for the receipt,
 * or null until the Merkle tree + collection exist on devnet (the store then
 * sends the real tx lifecycle placeholder).
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- seam stub: these params describe the mint contract for when Bubblegum is wired
export function buildMintReceiptInstructions(owner: PublicKey, metadata: ReceiptMetadata): TransactionInstruction[] | null {
  return null;
}
