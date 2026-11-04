# TXODDS txline odds oracle

**Planned, not wired.** Nothing in this repository calls txline or reads `TXLINE_API_TOKEN` yet, which is why the variable is not in `.env.example`. These notes were written in July 2026 for the odds feed and settlement that would replace the terminal's placeholder odds; the [README status](../README.md#status) says what runs today. The program ids, mints and endpoints below match the txline quickstart as checked on 4 November 2026.

The plan is for Striker Terminal to take World Cup odds and fixture data from the TXODDS txline oracle. Access is token-gated on Solana: you subscribe on-chain with TXL tokens, sign an activation message with your wallet, and receive an API token for the txline REST and stream endpoints.

- Quickstart: [txline-docs.txodds.com/documentation/quickstart](https://txline-docs.txodds.com/documentation/quickstart)
- Odds: [txline-docs.txodds.com/documentation/odds/overview](https://txline-docs.txodds.com/documentation/odds/overview)
- Soccer scores feed: [txline-docs.txodds.com/documentation/scores/soccer-feed](https://txline-docs.txodds.com/documentation/scores/soccer-feed)
- Subscription tiers: [txline-docs.txodds.com/documentation/subscription-tiers](https://txline-docs.txodds.com/documentation/subscription-tiers)

## 1. Install the oracle client dependencies

```bash
npm install @coral-xyz/anchor @solana/web3.js @solana/spl-token axios tweetnacl
```

This repository already depends on the first three and uses pnpm, so here only the last two are new: `pnpm add axios tweetnacl`.

## 2. Subscribe on-chain and activate your API token

Download the matching `txoracle.json` IDL and `Txoracle` types for your network from the txline docs, then run the flow below with your Anchor wallet. Both listed tiers are free and cover NFL, MLS, the Premier League, the World Cup and international friendlies: on mainnet, `SERVICE_LEVEL_ID = 1` has a 60 second delay and `SERVICE_LEVEL_ID = 12` is real time; devnet offers only `1`, with a 120 second delay. Subscriptions run in multiples of 4 weeks, up to 52.

```ts
import * as anchor from "@coral-xyz/anchor";
import type { Txoracle } from "./types/txoracle"; // Use the matching mainnet/devnet type
import txoracleIdl from "./idl/txoracle.json"; // Use the matching mainnet/devnet IDL
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_2022_PROGRAM_ID,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";
import { Connection, PublicKey, SystemProgram } from "@solana/web3.js";
import axios from "axios";
import nacl from "tweetnacl";

const NETWORK: "mainnet" | "devnet" = "devnet";

const CONFIG = {
  mainnet: {
    rpcUrl: "https://api.mainnet-beta.solana.com",
    apiOrigin: "https://txline.txodds.com",
    programId: new PublicKey("9ExbZjAapQww1vfcisDmrngPinHTEfpjYRWMunJgcKaA"),
    txlTokenMint: new PublicKey("Zhw9TVKp68a1QrftncMSd6ELXKDtpVMNuMGr1jNwdeL"),
  },
  devnet: {
    rpcUrl: "https://api.devnet.solana.com",
    apiOrigin: "https://txline-dev.txodds.com",
    programId: new PublicKey("6pW64gN1s2uqjHkn1unFeEjAwJkPGHoppGvS715wyP2J"),
    txlTokenMint: new PublicKey("4Zao8ocPhmMgq7PdsYWyxvqySMGx7xb9cMftPMkEokRG"),
  },
} as const;

const { rpcUrl, apiOrigin, programId, txlTokenMint } = CONFIG[NETWORK];
const apiBaseUrl = `${apiOrigin}/api`;

// `wallet` is your Anchor wallet (adapter or local keypair wallet).
const connection = new Connection(rpcUrl, "confirmed");
const provider = new anchor.AnchorProvider(connection, wallet, {
  commitment: "confirmed",
});
anchor.setProvider(provider);

const program = new anchor.Program<Txoracle>(
  txoracleIdl as Txoracle,
  provider
);

if (!program.programId.equals(programId)) {
  throw new Error(
    `Loaded IDL program ${program.programId.toBase58()} does not match ${NETWORK} program ${programId.toBase58()}`
  );
}

// Free tier configuration - choose one:
const SERVICE_LEVEL_ID = 1;  // Free bundle: 120 second delay on devnet, 60 seconds on mainnet
// const SERVICE_LEVEL_ID = 12; // Mainnet only: the same bundle in real time
const DURATION_WEEKS = 4; // Subscribe for 4 weeks at a time
const SELECTED_LEAGUES: number[] = []; // Empty for standard bundle

const [tokenTreasuryPda] = PublicKey.findProgramAddressSync(
  [Buffer.from("token_treasury_v2")],
  program.programId
);

const tokenTreasuryVault = getAssociatedTokenAddressSync(
  txlTokenMint,
  tokenTreasuryPda,
  true,
  TOKEN_2022_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID
);

const [pricingMatrixPda] = PublicKey.findProgramAddressSync(
  [Buffer.from("pricing_matrix")],
  program.programId
);

const userTokenAccount = getAssociatedTokenAddressSync(
  txlTokenMint,
  provider.wallet.publicKey,
  false,
  TOKEN_2022_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID
);

// Subscribe on-chain
const txSig = await program.methods
  .subscribe(SERVICE_LEVEL_ID, DURATION_WEEKS)
  .accounts({
    user: provider.wallet.publicKey,
    pricingMatrix: pricingMatrixPda,
    tokenMint: txlTokenMint,
    userTokenAccount,
    tokenTreasuryVault,
    tokenTreasuryPda,
    tokenProgram: TOKEN_2022_PROGRAM_ID,
    associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
    systemProgram: SystemProgram.programId,
  })
  .rpc();

console.log("Subscription transaction:", txSig);

// Get guest authentication token
const authResponse = await axios.post(`${apiOrigin}/auth/guest/start`);
const jwt = authResponse.data.token;

// Create message to sign
const messageString = `${txSig}:${SELECTED_LEAGUES.join(",")}:${jwt}`;
const message = new TextEncoder().encode(messageString);

// For SELECTED_LEAGUES = [], this signs `${txSig}::${jwt}`.
async function signActivationMessage(message: Uint8Array): Promise<Uint8Array> {
  if ("signMessage" in wallet && wallet.signMessage) {
    return wallet.signMessage(message);
  }

  const localPayer = (provider.wallet as anchor.Wallet & {
    payer?: anchor.web3.Keypair;
  }).payer;

  if (localPayer) {
    return nacl.sign.detached(message, localPayer.secretKey);
  }

  throw new Error("Wallet must support signMessage, or run with a local Anchor payer.");
}

const signatureBytes = await signActivationMessage(message);
const walletSignature = Buffer.from(signatureBytes).toString("base64");

// Activate your API access
const activationResponse = await axios.post(
  `${apiBaseUrl}/token/activate`,
  {
    txSig,
    walletSignature,
    leagues: SELECTED_LEAGUES,
  },
  {
    headers: { Authorization: `Bearer ${jwt}` }
  }
);

// Save your API token
const apiToken = activationResponse.data.token || activationResponse.data;
console.log("API Token activated successfully!");
```

## 3. Wire the token into Striker Terminal

Store the activated token in `.env.local` as `TXLINE_API_TOKEN` (server-side only; do not prefix it with `NEXT_PUBLIC_` and never commit it). The terminal renders in the browser, and a variable without the `NEXT_PUBLIC_` prefix never reaches browser code, so the token has to sit behind a server route, such as a Next.js route handler, that the market feed calls. The feed in `src/lib/data/live.ts` and the oracle settlement seam in the terminal store are the two drop-in points.
