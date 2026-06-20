// Anchor program client factory (CONDUCTOR seams 4-6).
//
// Wraps the wallet adapter into an AnchorProvider and loads a Program<Idl> from
// an IDL + program id. The prediction and futures programs are not deployed yet,
// so loadProgram is exercised only when an IDL and program id are supplied; until
// then the live data path surfaces a clean RPC error. The decode -> transform
// pipeline (data/transform.ts) is already built so wiring a real program is just:
//   const program = loadProgram(provider, predictionIdl, PREDICTION_PROGRAM_ID);
//   const accounts = await program.account.market.all();
//   return accounts.map((a) => toMatchData(a.publicKey.toBase58(), a.account));

import { AnchorProvider, Program, type Idl } from "@coral-xyz/anchor";
import { type Connection, type PublicKey, type Transaction, type VersionedTransaction } from "@solana/web3.js";

/** The minimal signing surface AnchorProvider needs from the wallet adapter. */
export interface AnchorCompatWallet {
  publicKey: PublicKey;
  signTransaction<T extends Transaction | VersionedTransaction>(tx: T): Promise<T>;
  signAllTransactions<T extends Transaction | VersionedTransaction>(txs: T[]): Promise<T[]>;
}

export function createAnchorProvider(
  connection: Connection,
  wallet: AnchorCompatWallet,
): AnchorProvider {
  return new AnchorProvider(connection, wallet, { commitment: "confirmed" });
}

export function loadProgram<T extends Idl>(
  provider: AnchorProvider,
  idl: T,
  programId?: PublicKey,
): Program<T> {
  // Anchor 0.30 reads the program id from idl.address; allow a config override.
  const resolved = programId ? { ...idl, address: programId.toBase58() } : idl;
  return new Program<T>(resolved, provider);
}
