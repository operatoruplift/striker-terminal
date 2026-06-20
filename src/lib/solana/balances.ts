// Token balance reads (CONDUCTOR seam 1). SOL is read live from the cluster.
// USDG is read from the wallet's associated token account when a USDG_MINT is
// configured; otherwise it falls back to a mocked balance (no mint deployed yet).

import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { getAssociatedTokenAddress, getAccount, TokenAccountNotFoundError } from "@solana/spl-token";
import { USDG_MINT, MOCK_USDG_BALANCE } from "../config";
import type { TokenBalances } from "../types";

export async function getSolBalance(connection: Connection, owner: PublicKey): Promise<number> {
  const lamports = await connection.getBalance(owner);
  return lamports / LAMPORTS_PER_SOL;
}

export async function getUsdgBalance(connection: Connection, owner: PublicKey): Promise<number> {
  if (!USDG_MINT) return MOCK_USDG_BALANCE;
  try {
    const ata = await getAssociatedTokenAddress(USDG_MINT, owner);
    const account = await getAccount(connection, ata);
    // USDG uses 6 decimals (USDC convention); adjust if the real mint differs.
    return Number(account.amount) / 1_000_000;
  } catch (error) {
    if (error instanceof TokenAccountNotFoundError) return 0;
    throw error;
  }
}

export async function getBalances(connection: Connection, owner: PublicKey): Promise<TokenBalances> {
  const [sol, usdg] = await Promise.all([
    getSolBalance(connection, owner),
    getUsdgBalance(connection, owner),
  ]);
  return { sol, usdg };
}
