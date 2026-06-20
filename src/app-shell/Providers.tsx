"use client";
// Client provider tree: Solana Connection + Wallet adapter (Phantom) + the
// centralized TerminalStore, with the whole terminal under a crash boundary.
// Loaded via a dynamic ssr:false boundary (TerminalClient) because the wallet
// adapter and the store's localStorage access touch window.

import { Buffer } from "buffer";
import { useMemo } from "react";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { RPC_ENDPOINT } from "../lib/config";
import { TerminalProvider } from "../store/TerminalStore";
import { TerminalApp } from "../components/terminal/TerminalApp";
import { ErrorBoundary } from "../components/terminal/ErrorBoundary";

// web3.js expects a global Buffer in the browser.
if (typeof globalThis.Buffer === "undefined") {
  globalThis.Buffer = Buffer;
}

export function AppRoot() {
  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);
  return (
    <ConnectionProvider endpoint={RPC_ENDPOINT}>
      <WalletProvider wallets={wallets} autoConnect>
        <TerminalProvider>
          <ErrorBoundary>
            <TerminalApp />
          </ErrorBoundary>
        </TerminalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
