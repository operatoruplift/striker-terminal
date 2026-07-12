# Striker Terminal: The Programmable Season Pass

Striker Terminal is a high-performance sports prediction ecosystem engineered to transform passive football viewership into active yield on the Solana blockchain. By merging an elite, modern interface with advanced programmable finance primitives, Striker Terminal solves the timezone constraints of international sports tracking for global fans.

---

## The Core Innovation: Timezone Arbitrage

For fans in Southeast Asia and other non-US/European regions, premier World Cup matches broadcast at volatile local hours like 3:00 AM. Traditional sports platforms demand active live-viewing to manage positions, while traditional payment rails cannot execute conditional operations while a user is asleep.

Striker Terminal bridges this gap by leveraging the speed, ultra-low fees, and programmability of the Solana blockchain alongside the automated subscription flows of the pay.sh protocol. Users can deploy automated trading conditions, lock in continuous access, and collect high-end digital assets entirely in the background.

---

## Key Features

### 1. Cinematic Glass Interface
* **Stadium-at-Night Backdrop:** Deep navy tones with electric blue floodlight vector fields, high-performance canvas grain, and layout vignette effects optimized for low motion latency.
* **Liquid-Glass Navigation:** Translucent layout containers built with gradient boundary techniques that dynamically shift composition states upon scrolling.
* **Polymarket-Style Live Matrix:** Real-time data presentation grids presenting match statistics, dynamic odds distributions, country team arrays, and predictive vectors.

### 2. Auto-Strike (Sleep Mode)
* **Programmable Limit Orders:** Allows users to configure strict conditional thresholds (such as "Execute position if Brazil match odds hit +150") before going to bed.
* **Automated Asset Execution:** Staged logic blocks that monitor conditions and instantly execute order parameters via smart contract hooks without requiring manual client validation at the moment of kickoff.
* **Automation Tracking Deck:** A dedicated interface within the primary workflow showing active conditional loops, live node status, and pending execution targets.

### 3. Holographic 3D cNFT Receipts
* **Immersive Tilt Mechanics:** Uses advanced CSS transformation matrices and mouse-tracking parameters to apply fluid 3D tilt effects to prediction slips.
* **Holographic Foil Shimmer:** Dynamic alpha-channel gradients that respond directly to layout coordinates, giving each collectible trading card a rare digital luster.
* **Metaplex Bubblegum Integration:** Built-in structural scaffolding to compress and mint these dynamic position summaries directly into Compressed NFTs (cNFTs) for sub-cent gas fees on Solana Devnet.

### 4. Continuous access via pay.sh
* **Tokenized Paywall Guards:** Strict checkout loops that validate active weekly passes using the USDG currency layer before unlocking execution components.
* **State-Linked Progress Trackers:** Step-by-step modal verification cycles that track network status through clear states: Awaiting Signature, Confirming Block, and Transaction Verified.

---

## Tech Stack

* **Frontend Framework:** Next.js 16 (App Router)
* **Styling System:** Tailwind CSS v4 with @theme color tokens
* **Animation Protocol:** CSS 3D transforms + spring physics (zero-dependency)
* **Blockchain Core:** Solana Web3.js + @solana/wallet-adapter-react
* **Smart Contract Layer:** Anchor Rust Program (stub deployed)
* **Payment Infrastructure:** pay.sh SDK recurring subscription protocol
* **Asset Minting:** Metaplex Bubblegum Protocol (scaffolded seams)
* **Odds Oracle:** TXODDS txline (on-chain TXL subscription + token-gated World Cup odds API)

---

## Architecture Blueprint

```text
                                  +-----------------------+
                                  |  Cinematic UI Layer   |
                                  |   (Next.js + TSX)     |
                                  +-----------+-----------+
                                              |
                       +----------------------+----------------------+
                       |                                             |
            +----------v----------+                       +----------v----------+
            |  React Context      |                       |  CSS 3D Transform   |
            |  Global State Store |                       |  Card Components    |
            +----------+----------+                       +---------------------+
                       |
        +--------------+--------------+
        |                             |
+-------v-------+             +-------v-------+
| Solana Web3   |             |  pay.sh SDK   |
| Wallet Adapter|             | Subscription  |
+-------+-------+             +-------+-------+
        |                             |
        +--------------+--------------+
                       |
            +----------v----------+
            | Solana Cluster      |
            | (Devnet Execution)  |
            +---------------------+
```

---

## Environment Setup

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SOLANA_CLUSTER=devnet
NEXT_PUBLIC_RPC_ENDPOINT=https://api.devnet.solana.com
NEXT_PUBLIC_PAY_SH_CLIENT_ID=YOUR_PAY_SH_CLIENT_IDENTIFIER
NEXT_PUBLIC_USDG_MINT_ADDRESS=YOUR_DEVNET_TOKEN_MINT_ADDRESS

# TXODDS txline odds oracle (server-side only, never commit the real token).
# Obtained via the on-chain subscribe + activate flow documented below.
TXLINE_API_TOKEN=YOUR_ACTIVATED_TXLINE_API_TOKEN
```

---

## Live Odds Oracle: TXODDS txline

Striker Terminal sources professional World Cup odds and fixture data from the TXODDS txline oracle. Access is token-gated on Solana: you subscribe on-chain with TXL tokens, sign an activation message with your wallet, and receive an API token for the txline REST/stream endpoints.

* Quickstart docs: [txline-docs.txodds.com/documentation/quickstart](https://txline-docs.txodds.com/documentation/quickstart)
* World Cup data docs: [txline-docs.txodds.com/documentation/worldcup](https://txline-docs.txodds.com/documentation/worldcup)

### 1. Install the oracle client dependencies

```bash
npm install @coral-xyz/anchor @solana/web3.js @solana/spl-token axios tweetnacl
```

### 2. Subscribe on-chain and activate your API token

Download the matching `txoracle.json` IDL and `Txoracle` types for your network from the txline docs, then run the flow below with your Anchor wallet. Free tier: `SERVICE_LEVEL_ID = 1` is real-time on devnet (60 second sampling on mainnet); `SERVICE_LEVEL_ID = 12` is the mainnet real-time World Cup and International Friendlies bundle.

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
const SERVICE_LEVEL_ID = 1;  // Devnet: samplingIntervalSec = 0; mainnet: 60 seconds
// const SERVICE_LEVEL_ID = 12; // Mainnet real-time World Cup & Int Friendlies
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

### 3. Wire the token into Striker Terminal

Store the activated token in `.env.local` as `TXLINE_API_TOKEN` (server-side only; do not prefix it with `NEXT_PUBLIC_` and never commit it). The market feed boundary at `src/lib/data/live.ts` and the oracle settlement seam in the terminal store are the two drop-in points for the txline World Cup endpoints documented at [txline-docs.txodds.com/documentation/worldcup](https://txline-docs.txodds.com/documentation/worldcup).

---

## Quick Start Guide

### 1. Clone the Codebase

```bash
git clone https://github.com/operatoruplift/striker-terminal.git
cd striker-terminal
```

### 2. Install Project Dependencies

```bash
pnpm install
```

### 3. Run Production Audits

```bash
pnpm tsc
pnpm lint
```

### 4. Launch the Local Development Cluster

```bash
pnpm run dev
```

Open your browser and navigate to: `http://localhost:3000`

* **Landing Page:** `http://localhost:3000/`
* **Terminal:** `http://localhost:3000/terminal`

---

## Hackathon Project Information

* **Project Name:** Striker Terminal
* **Tagline:** The Programmable Season Pass
* **GitHub Repository:** [github.com/operatoruplift/striker-terminal](https://github.com/operatoruplift/striker-terminal)
* **Live Demo URL:** [strikerterminal.vercel.app](https://strikerterminal.vercel.app/)
* **Pitch Deck URL:** [Google Drive Presentation Link](https://drive.google.com/file/d/1TNTdpYH7fFGlU-dV9lNJ8MBBA2Nj1ccW/view?usp=sharing)
* **Video Demo URL:** [Google Drive Screen Recording Walkthrough](https://drive.google.com/file/d/1gkHdDcdZm2Mt6ZCDiBHOgvoh-URdgkmO/view?usp=sharing)
