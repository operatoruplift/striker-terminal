"use client";
// =============================================================================
// TerminalStore: the single centralized state layer for Striker Terminal.
//
// Ported from the prototype's striker-store.jsx React Context. The public action
// names and state shapes are unchanged so the presentational components render
// identically. The CONDUCTOR seams are now wired through a mock<->live switch
// (USE_MOCKS): mock mode reproduces the prototype demo exactly; live mode drives
// the real Phantom wallet adapter, the real Solana tx lifecycle, the live data
// reads, and the pay.sh stream client.
// =============================================================================

import * as React from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Transaction } from "@solana/web3.js";

import { USE_MOCKS, SEASON_PASS_USDG_PER_WEEK } from "../lib/config";
import {
  truncateAddress,
  truncateSig,
  makeSig,
  oddsFor,
  codeFor,
} from "../lib/format";
import { getMarkets, getResults, getTies, getAlpha } from "../lib/data";
import {
  MOCK_MARKETS,
  MOCK_RESULTS,
  MOCK_SETTLED_VOL,
  MOCK_TIES,
  MOCK_ALPHA,
  MOCK_ADDRESS,
  MOCK_PUBLIC_KEY,
  DEMO_KEY,
  DEMO_FRESH,
  type DemoPersisted,
} from "../lib/data/mock";
import { sendTransactionLifecycle, placeholderInstruction, type StageSetter } from "../lib/solana/tx";
import { getBalances } from "../lib/solana/balances";
import { paymentStream } from "../lib/paysh/paymentStream";
import { buildReceiptMetadata } from "../lib/metaplex/bubblegum";
import type {
  MatchData,
  Outcome,
  MarketStatus,
  WalletStatus,
  SubscriptionStatus,
  TxStage,
  FeedStatus,
  TokenBalances,
  BetPosition,
  FuturesPosition,
  SlipLine,
  Tie,
  AlphaRow,
  TickerResult,
  ResultLine,
  SettleResult,
  ShareItem,
  Toast,
  ToastKind,
  UserProfile,
  Wallet,
  SlipMode,
  AutoStrike,
} from "../lib/types";

const { createContext, useContext, useState, useEffect, useRef, useMemo, useCallback } = React;

type ModalKind = "subscribe" | "confirm" | "auto" | "bracket" | null;
type TxExec = (setStage: StageSetter) => Promise<string>;

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return "Unexpected error";
}

function loadDemo(): DemoPersisted {
  if (!USE_MOCKS || typeof window === "undefined") return { ...DEMO_FRESH };
  try {
    return Object.assign({}, DEMO_FRESH, JSON.parse(localStorage.getItem(DEMO_KEY) || "{}"));
  } catch {
    return { ...DEMO_FRESH };
  }
}

export interface TerminalStoreValue {
  // data (live reads or mock)
  MARKETS: MatchData[];
  RESULTS: TickerResult[];
  SETTLED_VOL: string;
  TIES: Tie[];
  ALPHA: AlphaRow[];
  // domain state
  walletStatus: WalletStatus;
  balances: TokenBalances;
  subStatus: SubscriptionStatus;
  positions: Record<string, BetPosition>;
  futures: Record<string, FuturesPosition>;
  slip: SlipLine[];
  busy: boolean;
  txStage: TxStage;
  feedStatus: FeedStatus;
  // derived
  connected: boolean;
  subscribed: boolean;
  user: UserProfile;
  wallet: Wallet;
  totalStake: number;
  totalReturn: number;
  oddsFor: (m: MatchData, pick: Outcome) => number;
  codeFor: (m: MatchData, k: Outcome) => string;
  nextCharge: string;
  // overlay / flow state
  modal: ModalKind;
  activeTie: Tie | null;
  futPick: "a" | "b";
  futStake: string;
  shareItem: ShareItem | null;
  resultModal: SettleResult | null;
  toasts: Toast[];
  banter: string | null;
  setModal: (m: ModalKind) => void;
  setFutPick: (p: "a" | "b") => void;
  setFutStake: (s: string) => void;
  setShareItem: (s: ShareItem | null) => void;
  setResultModal: (r: SettleResult | null) => void;
  // wallet actions
  setWalletConnected: (connected: boolean) => void;
  connect: () => void;
  disconnect: () => void;
  // subscription actions
  openSubscribe: () => void;
  activateSeasonPass: () => void;
  cancelSubscribeModal: () => void;
  // slip + prediction actions
  addPositionToSlip: (matchId: string, pick: Outcome) => void;
  setStake: (matchId: string, amount: string) => void;
  removeFromSlip: (matchId: string) => void;
  clearSlip: () => void;
  placeBets: () => void;
  confirmBets: () => void;
  // auto-strike (sleep mode)
  slipMode: SlipMode;
  setSlipMode: (m: SlipMode) => void;
  autoStrikes: AutoStrike[];
  deployAutoStrike: (trigger: string) => void;
  cancelAutoStrike: (id: string) => void;
  // futures actions
  openTie: (tie: Tie) => void;
  confirmFuture: () => void;
  closeBracketModal: () => void;
  // settlement + share + feed
  settleLive: () => void;
  openShare: (match: MatchData, pos: BetPosition) => void;
  // cNFT receipt (CONDUCTOR seam: Metaplex Bubblegum)
  mintReceipt: () => void;
  mintedSig: string | null;
  setFeedStatus: (status: FeedStatus) => void;
  retryConnection: () => void;
  // misc
  resetDemo: () => void;
  toast: (title: string, sub: string, kind?: ToastKind) => void;
}

const TerminalContext = createContext<TerminalStoreValue | null>(null);

export function useTerminalStore(): TerminalStoreValue {
  const ctx = useContext(TerminalContext);
  if (!ctx) throw new Error("useTerminalStore must be called inside <TerminalProvider>");
  return ctx;
}

export function TerminalProvider({ children }: { children: React.ReactNode }) {
  const { connection } = useConnection();
  const walletAdapter = useWallet();
  const saved = useMemo(() => loadDemo(), []);

  /* ----- data (live reads or mock) ----- */
  const [markets, setMarkets] = useState<MatchData[]>(USE_MOCKS ? MOCK_MARKETS : []);
  const [results, setResults] = useState<TickerResult[]>(USE_MOCKS ? MOCK_RESULTS : []);
  const [settledVol, setSettledVol] = useState<string>(USE_MOCKS ? MOCK_SETTLED_VOL : "$0");
  const [ties, setTies] = useState<Tie[]>(USE_MOCKS ? MOCK_TIES : []);
  const [alpha, setAlpha] = useState<AlphaRow[]>(USE_MOCKS ? MOCK_ALPHA : []);

  /* ----- domain state ----- */
  const [walletStatus, setWalletStatus] = useState<WalletStatus>(saved.connected ? "connected" : "idle");
  const [address, setAddress] = useState<string>(saved.connected ? MOCK_ADDRESS : "");
  const [pubkey, setPubkey] = useState<string | null>(saved.connected ? MOCK_PUBLIC_KEY : null);
  const [bal, setBal] = useState<TokenBalances>({ sol: saved.sol, usdg: saved.usdg });
  const [subStatus, setSubStatus] = useState<SubscriptionStatus>(saved.subscribed ? "active" : "none");
  const [positions, setPositions] = useState<Record<string, BetPosition>>(saved.positions);
  const [futures, setFutures] = useState<Record<string, FuturesPosition>>(saved.futures || {});
  const [slip, setSlip] = useState<SlipLine[]>([]);
  const [slipMode, setSlipMode] = useState<SlipMode>("live");
  const [autoStrikes, setAutoStrikes] = useState<AutoStrike[]>([]);
  const [busy, setBusy] = useState(false);
  const [txStage, setTxStage] = useState<TxStage>("idle");
  const [feedStatus, setFeedStatus] = useState<FeedStatus>(USE_MOCKS ? "ready" : "loading");
  const [reloadKey, setReloadKey] = useState(0);
  const [nextCharge, setNextCharge] = useState<string>(paymentStream.nextCharge());

  /* ----- overlay + flow state ----- */
  const [modal, setModal] = useState<ModalKind>(null);
  const [activeTie, setActiveTie] = useState<Tie | null>(null);
  const [futPick, setFutPick] = useState<"a" | "b">("a");
  const [futStake, setFutStake] = useState<string>("25");
  const [shareItem, setShareItem] = useState<ShareItem | null>(null);
  const [mintedSig, setMintedSig] = useState<string | null>(null);
  const [resultModal, setResultModal] = useState<SettleResult | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [banter, setBanter] = useState<string | null>(null);

  const subscribed = subStatus === "active";
  const connected = walletStatus === "connected";

  const user: UserProfile = {
    status: walletStatus,
    publicKey: connected ? pubkey : null,
    address,
    hasActiveSeasonPass: subscribed,
    balances: bal,
  };
  const wallet: Wallet = { status: walletStatus, address, sol: bal.sol, usdg: bal.usdg };

  /* ----- toasts ----- */
  const toast = useCallback((title: string, sub: string, kind: ToastKind = "ok") => {
    const id = Date.now() + Math.random();
    setToasts((ts) => [...ts, { id, title, sub, kind }]);
    setTimeout(() => setToasts((ts) => ts.filter((x) => x.id !== id)), 4400);
  }, []);

  /* ----- demo persistence (mock mode only; dropped for live chain reads) ----- */
  useEffect(() => {
    if (!USE_MOCKS) return;
    localStorage.setItem(DEMO_KEY, JSON.stringify({ connected, subscribed, sol: bal.sol, usdg: bal.usdg, positions, futures }));
  }, [connected, subscribed, bal, positions, futures]);

  /* ----- live data load (CONDUCTOR: prediction/futures/leaderboard reads) ----- */
  useEffect(() => {
    if (USE_MOCKS) return;
    let cancelled = false;
    setFeedStatus("loading");
    Promise.all([getMarkets(), getResults(), getTies(), getAlpha()])
      .then(([m, r, t, a]) => {
        if (cancelled) return;
        setMarkets(m); setResults(r.results); setSettledVol(r.settledVol); setTies(t); setAlpha(a);
        setFeedStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setFeedStatus("error");
      });
    return () => { cancelled = true; };
  }, [reloadKey]);

  // ===========================================================================
  // CONDUCTOR seam 2: SOLANA TRANSACTION LIFECYCLE (single choke point).
  // Mock mode keeps the staged demo timers; live mode awaits exec() which runs
  // sign -> sendRawTransaction -> confirmTransaction and returns the real
  // signature. The four stage strings are never renamed (<TxProgress> keys off
  // them). On error: clear busy, reset stage, fire an error toast.
  // ===========================================================================
  const txTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const runTx = useCallback((onDone: (signature: string) => void, exec?: TxExec) => {
    txTimersRef.current.forEach(clearTimeout);
    if (USE_MOCKS || !exec) {
      setBusy(true);
      const seq: [TxStage, number][] = [["signing", 0], ["submitting", 750], ["confirming", 1350], ["confirmed", 2150]];
      txTimersRef.current = seq.map(([stage, at]) => setTimeout(() => setTxStage(stage), at));
      txTimersRef.current.push(setTimeout(() => { setBusy(false); setTxStage("idle"); onDone(makeSig()); }, 2650));
      return;
    }
    setBusy(true);
    exec(setTxStage)
      .then((signature) => {
        setTxStage("confirmed");
        setTimeout(() => { setBusy(false); setTxStage("idle"); onDone(signature); }, 450);
      })
      .catch((error: unknown) => {
        setBusy(false);
        setTxStage("idle");
        toast("Transaction failed", getErrorMessage(error), "err");
      });
  }, [toast]);

  // Build the live exec for a write flow, or undefined to fall back to timers.
  const buildExec = useCallback((): TxExec | undefined => {
    if (USE_MOCKS) return undefined;
    const pk = walletAdapter.publicKey;
    const signTransaction = walletAdapter.signTransaction;
    if (!pk || !signTransaction) return undefined;
    return (setStage) =>
      sendTransactionLifecycle(
        { connection, publicKey: pk, signTransaction: signTransaction as <T extends Transaction>(tx: T) => Promise<T> },
        [placeholderInstruction(pk)],
        setStage,
      );
  }, [walletAdapter.publicKey, walletAdapter.signTransaction, connection]);

  // ===========================================================================
  // CONDUCTOR seam 1: WALLET. Mock mode simulates a connection (offline demo);
  // live mode drives the Phantom adapter and reads real balances.
  // ===========================================================================
  const setWalletConnected = useCallback((isConnected: boolean) => setWalletStatus(isConnected ? "connected" : "idle"), []);

  const connect = useCallback(() => {
    if (USE_MOCKS) {
      setWalletStatus("connecting");
      setTimeout(() => {
        setWalletStatus("connected");
        setAddress(MOCK_ADDRESS);
        setPubkey(MOCK_PUBLIC_KEY);
        toast("Wallet connected", "Phantom · " + MOCK_ADDRESS);
      }, 1300);
      return;
    }
    setWalletStatus("connecting");
    const target = walletAdapter.wallets.find((w) => w.adapter.name === "Phantom") ?? walletAdapter.wallets[0];
    if (target) walletAdapter.select(target.adapter.name);
    else { setWalletStatus("idle"); toast("Phantom not found", "Install the Phantom wallet to connect", "err"); }
  }, [toast, walletAdapter]);

  // Live: connect once a wallet is selected; sync adapter state into the store.
  useEffect(() => {
    if (USE_MOCKS) return;
    if (walletStatus === "connecting" && walletAdapter.wallet && !walletAdapter.connected && !walletAdapter.connecting) {
      walletAdapter.connect().catch((error: unknown) => {
        setWalletStatus("idle");
        toast("Wallet connection failed", getErrorMessage(error), "err");
      });
    }
  }, [walletStatus, walletAdapter, toast]);

  useEffect(() => {
    if (USE_MOCKS) return;
    const pk = walletAdapter.publicKey;
    if (walletAdapter.connected && pk) {
      const base58 = pk.toBase58();
      setPubkey(base58);
      setAddress(truncateAddress(base58));
      setWalletStatus("connected");
      getBalances(connection, pk)
        .then(setBal)
        .catch(() => toast("Balance read failed", "Could not load wallet balances", "err"));
    } else if (!walletAdapter.connecting) {
      setWalletStatus((s) => (s === "connecting" ? s : "idle"));
    }
  }, [walletAdapter.connected, walletAdapter.publicKey, walletAdapter.connecting, connection, toast]);

  const disconnect = useCallback(() => {
    if (!USE_MOCKS) walletAdapter.disconnect().catch(() => {});
    setWalletStatus("idle");
    setAddress("");
    setPubkey(null);
    setSlip([]);
    toast("Wallet disconnected", "Session kept in local cache", "info");
  }, [toast, walletAdapter]);

  // ===========================================================================
  // CONDUCTOR seam 3: PAY.SH SUBSCRIPTION STREAM ($10 USDG / week).
  // ===========================================================================
  const openSubscribe = useCallback(() => {
    if (!connected) { connect(); return; }
    setModal("subscribe");
  }, [connected, connect]);

  const activateSeasonPass = useCallback(() => {
    setSubStatus("signing");
    const charge = paymentStream.nextCharge();
    runTx((signature) => {
      setModal(null);
      setSubStatus("active");
      setNextCharge(charge);
      setBal((b) => ({ ...b, usdg: +(b.usdg - SEASON_PASS_USDG_PER_WEEK).toFixed(2) }));
      toast("Season Pass active", "tx " + truncateSig(signature) + " · next charge " + charge);
    }, buildExec());
  }, [runTx, buildExec, toast]);

  const cancelSubscribeModal = useCallback(() => { setModal(null); setSubStatus("none"); }, []);

  /* ----- prediction gate ----- */
  const guard = useCallback((): boolean => {
    if (!connected) { connect(); return false; }
    if (!subscribed) { toast("Markets locked", "Activate the Season Pass to predict", "info"); return false; }
    return true;
  }, [connected, subscribed, connect, toast]);

  const addPositionToSlip = useCallback((matchId: string, pick: Outcome) => {
    const m = markets.find((x) => x.id === matchId);
    if (!m || m.status === "ft") return;
    if (!guard()) return;
    if (positions[matchId]) { toast("Position open", "You already hold this market", "info"); return; }
    setSlip((s) => {
      const existing = s.find((l) => l.matchId === matchId);
      if (existing && existing.pick === pick) return s.filter((l) => l.matchId !== matchId);
      if (existing) return s.map((l) => (l.matchId === matchId ? { ...l, pick } : l));
      return [...s, { matchId, pick, amount: "10" }];
    });
  }, [markets, positions, guard, toast]);

  const setStake = useCallback((matchId: string, amount: string) => setSlip((s) => s.map((l) => (l.matchId === matchId ? { ...l, amount } : l))), []);
  const removeFromSlip = useCallback((matchId: string) => setSlip((s) => s.filter((l) => l.matchId !== matchId)), []);
  const clearSlip = useCallback(() => setSlip([]), []);

  /* ----- slip math ----- */
  const totalStake = slip.reduce((s, l) => s + (parseFloat(l.amount) || 0), 0);
  const totalReturn = slip.reduce((s, l) => {
    const m = markets.find((x) => x.id === l.matchId);
    return s + (parseFloat(l.amount) || 0) * (m ? oddsFor(m, l.pick) : 0);
  }, 0);

  const placeBets = useCallback(() => { if (totalStake <= 0 || totalStake > bal.usdg) return; setModal("confirm"); }, [totalStake, bal.usdg]);

  // ===========================================================================
  // CONDUCTOR seam 4: PREDICTION MARKET ORDER (one placePrediction per slip line).
  // Live submit currently runs the real tx lifecycle (placeholder ix); the
  // resulting positions are computed locally until the program reads back.
  // ===========================================================================
  const confirmBets = useCallback(() => {
    const snapshot = slip;
    const stake = totalStake;
    runTx((signature) => {
      setModal(null);
      const add: Record<string, BetPosition> = {};
      snapshot.forEach((l) => {
        const m = markets.find((x) => x.id === l.matchId);
        if (!m) return;
        add[l.matchId] = { pick: l.pick, amount: +(parseFloat(l.amount)).toFixed(2), odds: oddsFor(m, l.pick) };
      });
      setPositions((p) => ({ ...p, ...add }));
      setBal((b) => ({ ...b, usdg: +(b.usdg - stake).toFixed(2) }));
      const n = snapshot.length;
      setSlip([]);
      toast(n + (n > 1 ? " predictions placed" : " prediction placed"), "tx " + truncateSig(signature) + " · " + stake.toFixed(2) + " USDG staked");
      setBanter("locked " + n + (n > 1 ? " predictions" : " prediction") + " for " + stake.toFixed(2) + " USDG");
    }, buildExec());
  }, [slip, totalStake, markets, runTx, buildExec, toast]);

  // ===========================================================================
  // AUTO-STRIKE (SLEEP MODE): deploy the slip as conditional limit orders that
  // fire while the user is asleep (the 3am-kickoff timezone insight). Deploying
  // registers the orders through the tx wizard; the keeper executes them.
  //
  // CONDUCTOR-SEAM: INJECT CRON/KEEPER LOGIC HERE
  //   Register each AutoStrike with a Solana keeper (Clockwork thread / Helius
  //   webhook / off-chain cron) that watches the trigger and, when it fires,
  //   runs the confirmBets-equivalent placePrediction at the optimized odds.
  // ===========================================================================
  const deployAutoStrike = useCallback((trigger: string) => {
    const snapshot = slip;
    if (snapshot.length === 0) return;
    const cond = trigger.trim() || "at Kickoff";
    runTx((signature) => {
      setModal(null);
      const stamp = Date.now();
      const orders: AutoStrike[] = snapshot.map((l, i) => {
        const m = markets.find((x) => x.id === l.matchId);
        return {
          id: l.matchId + "-" + stamp + "-" + i,
          matchId: l.matchId,
          label: m ? m.home.code + " v " + m.away.code : l.matchId,
          pick: l.pick,
          amount: +(parseFloat(l.amount) || 0).toFixed(2),
          trigger: cond,
          status: "listening",
        };
      });
      setAutoStrikes((a) => [...a, ...orders]);
      setSlip([]);
      const n = orders.length;
      toast("Auto-Strike deployed", n + (n > 1 ? " orders" : " order") + " listening · tx " + truncateSig(signature));
      setBanter("deployed " + n + " Auto-Strike order" + (n > 1 ? "s" : "") + " for sleep mode (" + cond + ")");
    }, buildExec());
  }, [slip, markets, runTx, buildExec, toast]);

  const cancelAutoStrike = useCallback((id: string) => {
    setAutoStrikes((a) => a.filter((x) => x.id !== id));
    toast("Auto-Strike cancelled", "Order pulled from the keeper queue", "info");
  }, [toast]);

  /* ----- futures bracket ----- */
  const openTie = useCallback((tie: Tie) => {
    if (!guard()) return;
    if (futures[tie.id]) { toast("Futures locked in", "You already hold this tie", "info"); return; }
    setActiveTie(tie); setFutPick(tie.a.pct >= tie.b.pct ? "a" : "b"); setFutStake("25"); setModal("bracket");
  }, [guard, futures, toast]);

  // ===========================================================================
  // CONDUCTOR seam 5: FUTURES (ROUND OF 32) ORDER.
  // ===========================================================================
  const confirmFuture = useCallback(() => {
    if (!activeTie) return;
    const tie = activeTie;
    const pick = futPick;
    const slot = pick === "a" ? tie.a : tie.b;
    const amt = parseFloat(futStake) || 0;
    if (amt <= 0 || amt > bal.usdg) return;
    runTx((signature) => {
      setModal(null);
      setFutures((f) => ({ ...f, [tie.id]: { pick, team: slot.team, amount: +amt.toFixed(2), odds: 100 / slot.pct } }));
      setBal((b) => ({ ...b, usdg: +(b.usdg - amt).toFixed(2) }));
      toast("Futures position locked", "tx " + truncateSig(signature) + " · " + slot.team + " to advance · " + amt.toFixed(2) + " USDG");
      setBanter("locked futures: " + slot.team + " to advance for " + amt.toFixed(2) + " USDG");
      setActiveTie(null);
    }, buildExec());
  }, [activeTie, futPick, futStake, bal.usdg, runTx, buildExec, toast]);

  const closeBracketModal = useCallback(() => { setModal(null); setActiveTie(null); }, []);

  // ===========================================================================
  // CONDUCTOR seam 6: ORACLE SETTLEMENT. In production this becomes a READ that
  // subscribes to Market resolution and credits payouts; mock mode resolves from
  // the demo scores. The SettleResult contract is unchanged either way.
  // ===========================================================================
  const settleLive = useCallback(() => {
    const ids = Object.keys(positions);
    if (ids.length === 0) return;
    let payout = 0, staked = 0;
    const lines: ResultLine[] = [];
    ids.forEach((id) => {
      const m = markets.find((x) => x.id === id);
      const p = positions[id];
      if (!m || !p) return;
      const [h, a] = m.score;
      let result: Outcome;
      const status: MarketStatus = m.status;
      if (status === "live" || status === "ft") result = h > a ? "home" : a > h ? "away" : "draw";
      else result = (["home", "draw", "away"] as Outcome[]).reduce((best, k) => (m.pct[k] > m.pct[best] ? k : best), "home" as Outcome);
      const win = p.pick === result;
      const ret = win ? +(p.amount * p.odds).toFixed(2) : 0;
      payout += ret; staked += p.amount;
      lines.push({ label: m.home.code + " v " + m.away.code + " · " + codeFor(m, p.pick), win, payout: ret, stake: p.amount });
    });
    payout = +payout.toFixed(2); staked = +staked.toFixed(2);
    setBal((b) => ({ ...b, usdg: +(b.usdg + payout).toFixed(2) }));
    setPositions({});
    setResultModal({ payout, staked, lines });
    if (payout > 0) {
      toast("Payout settled", "tx " + makeSig() + " · +" + payout.toFixed(2) + " USDG credited");
      setBanter("just settled +" + payout.toFixed(2) + " USDG on the whistle");
    } else {
      toast("Markets resolved", "No winning positions this round", "info");
    }
  }, [positions, markets, toast]);

  /* ----- share ----- */
  const openShare = useCallback((match: MatchData, pos: BetPosition) => {
    const teamName = pos.pick === "home" ? match.home.name : pos.pick === "away" ? match.away.name : "the Draw";
    setMintedSig(null); // each share opens a fresh, un-minted receipt
    setShareItem({
      matchLabel: match.home.code + " v " + match.away.code,
      teamName, pick: pos.pick, verb: pos.pick === "draw" ? "hold" : "win",
      odds: pos.odds, amount: pos.amount, potential: +(pos.amount * pos.odds).toFixed(2),
    });
  }, []);

  // ===========================================================================
  // CONDUCTOR seam: MINT cNFT RECEIPT (Metaplex Bubblegum). Turns the open share
  // slip into a compressed-NFT collectible through the single tx lifecycle. The
  // mint payload is built in lib/metaplex/bubblegum.ts (buildReceiptMetadata);
  // the real Bubblegum mintV1 instructions go in buildMintReceiptInstructions.
  // ===========================================================================
  const mintReceipt = useCallback(() => {
    if (!shareItem) return;
    const meta = buildReceiptMetadata(shareItem);
    runTx((signature) => {
      setMintedSig(signature);
      toast("Minted to Phantom", meta.name + " · cNFT " + truncateSig(signature));
      setBanter("minted my " + shareItem.teamName + " slip as a cNFT receipt");
    }, buildExec());
  }, [shareItem, runTx, buildExec, toast]);

  // ===========================================================================
  // CONDUCTOR: RPC RETRY. Mock mode replays the demo reconnect; live mode
  // re-runs the data load effect (loading -> ready/error).
  // ===========================================================================
  const retryConnection = useCallback(() => {
    if (USE_MOCKS) {
      setFeedStatus("loading");
      setTimeout(() => { setFeedStatus("ready"); toast("RPC reconnected", "Market feed restored"); }, 1400);
      return;
    }
    setReloadKey((k) => k + 1);
  }, [toast]);

  const resetDemo = useCallback(() => {
    if (typeof window !== "undefined") localStorage.removeItem(DEMO_KEY);
    if (!USE_MOCKS) walletAdapter.disconnect().catch(() => {});
    setWalletStatus("idle"); setAddress(""); setPubkey(null); setSubStatus("none");
    setPositions({}); setFutures({}); setSlip([]);
    setBal({ sol: DEMO_FRESH.sol, usdg: DEMO_FRESH.usdg }); setModal(null); setFeedStatus(USE_MOCKS ? "ready" : "loading");
    toast("Demo reset", "Back to a cold wallet", "info");
  }, [toast, walletAdapter]);

  const store: TerminalStoreValue = {
    MARKETS: markets, RESULTS: results, SETTLED_VOL: settledVol, TIES: ties, ALPHA: alpha,
    walletStatus, balances: bal, subStatus, positions, futures, slip, busy, txStage, feedStatus,
    connected, subscribed, user, wallet, totalStake, totalReturn, oddsFor, codeFor, nextCharge,
    modal, activeTie, futPick, futStake, shareItem, resultModal, toasts, banter,
    setModal, setFutPick, setFutStake, setShareItem, setResultModal,
    setWalletConnected, connect, disconnect,
    openSubscribe, activateSeasonPass, cancelSubscribeModal,
    addPositionToSlip, setStake, removeFromSlip, clearSlip, placeBets, confirmBets,
    slipMode, setSlipMode, autoStrikes, deployAutoStrike, cancelAutoStrike,
    openTie, confirmFuture, closeBracketModal,
    settleLive, openShare, mintReceipt, mintedSig, setFeedStatus, retryConnection,
    resetDemo, toast,
  };

  return <TerminalContext.Provider value={store}>{children}</TerminalContext.Provider>;
}
