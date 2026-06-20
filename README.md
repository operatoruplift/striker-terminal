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
```

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
