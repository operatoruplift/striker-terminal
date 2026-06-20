// Real Solana transaction lifecycle (CONDUCTOR seam 2). This is the single send
// pipeline every live write flow inherits: sign -> sendRawTransaction ->
// confirmTransaction, advancing the four TxStage strings the <TxProgress> bar
// keys off. Until the Anchor/pay.sh instructions are deployed it sends a real
// zero-lamport self-transfer on devnet so the lifecycle (Phantom signature,
// broadcast, confirmation, real signature string) is genuinely exercised. Swap
// the instruction for the program ix and the lifecycle is unchanged.

import {
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import type { TxStage } from "../types";

export type StageSetter = (stage: TxStage) => void;

export interface SendContext {
  connection: Connection;
  publicKey: PublicKey;
  signTransaction: <T extends Transaction>(tx: T) => Promise<T>;
}

/** Send a built instruction set through the full lifecycle, returning the real signature. */
export async function sendTransactionLifecycle(
  ctx: SendContext,
  instructions: TransactionInstruction[],
  setStage: StageSetter,
): Promise<string> {
  const { connection, publicKey, signTransaction } = ctx;
  const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash("confirmed");
  const tx = new Transaction({ feePayer: publicKey, blockhash, lastValidBlockHeight });
  tx.add(...instructions);

  setStage("signing");
  const signed = await signTransaction(tx);

  setStage("submitting");
  const signature = await connection.sendRawTransaction(signed.serialize());

  setStage("confirming");
  await connection.confirmTransaction({ signature, blockhash, lastValidBlockHeight }, "confirmed");

  return signature;
}

/** Placeholder instruction (no-op self-transfer) standing in for a program ix. */
export function placeholderInstruction(owner: PublicKey): TransactionInstruction {
  return SystemProgram.transfer({ fromPubkey: owner, toPubkey: owner, lamports: 0 });
}

/** Convenience: run the lifecycle with the placeholder instruction. */
export function sendPlaceholderTx(ctx: SendContext, setStage: StageSetter): Promise<string> {
  return sendTransactionLifecycle(ctx, [placeholderInstruction(ctx.publicKey)], setStage);
}
