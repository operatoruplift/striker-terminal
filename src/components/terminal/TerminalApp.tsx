"use client";
// TerminalApp: the VIEW layer. All domain state + actions live in the
// TerminalStore (store/TerminalStore.tsx); this file only renders the store and
// holds view-only state (daily/futures toggle, theme, clock, tweaks). Markup
// ported verbatim from the prototype striker-app.jsx; the manual ReactDOM mount
// was removed (Providers + page.tsx render the tree), and the hardcoded next
// charge date / delegate now come from the pay.sh client.

import * as React from "react";
import { useTerminalStore } from "../../store/TerminalStore";
import { useTweaks, TweaksPanel, TweakSection, TweakToggle } from "./tweaks";
import {
  Header,
  BlueButton,
  IconLock,
  Spinner,
  MarketCard,
  SubscriptionConsole,
  BettingSlip,
  Modal,
  ToastStack,
  ShareModal,
  ResultModal,
  MatchCardSkeleton,
  RpcErrorState,
} from "./components";
import { TickerBar, MarketToggle, AlphaBoard, TournamentBracket, BracketModal } from "./modules";
import { MatchTracker, Trollbox } from "./live";
import { paymentStream } from "../../lib/paysh/paymentStream";
import { truncateAddress } from "../../lib/format";
import type { FeedStatus, Outcome } from "../../lib/types";

const { useState: useS, useEffect: useE } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "showTicker": true,
  "accentGlow": true
}/*EDITMODE-END*/;

const DELEGATE_DISPLAY = paymentStream.delegate ? truncateAddress(paymentStream.delegate.toBase58()) : "paysh...9fKw";

export function TerminalApp() {
  const store = useTerminalStore();
  const {
    MARKETS, RESULTS, SETTLED_VOL, TIES, ALPHA,
    walletStatus, balances: bal, subStatus, positions, futures, slip, busy, txStage, feedStatus,
    connected, subscribed, wallet, totalStake, totalReturn, oddsFor, codeFor, nextCharge,
    modal, activeTie, futPick, futStake, shareItem, resultModal, toasts, banter,
    setFutPick, setFutStake, setShareItem, setResultModal, cancelSubscribeModal, setModal,
    connect, disconnect, openSubscribe, activateSeasonPass,
    addPositionToSlip, setStake, removeFromSlip, clearSlip, placeBets, confirmBets,
    slipMode, setSlipMode, autoStrikes, deployAutoStrike, cancelAutoStrike,
    openTie, confirmFuture, closeBracketModal,
    settleLive, openShare, mintReceipt, mintedSig, retryConnection,
    resetDemo
  } = store;

  /* ----- view-only state ----- */
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [view, setView] = useS("daily");                     // "daily" | "futures"
  const [clock, setClock] = useS("00:00:00");
  const [theme, setTheme] = useS<string>(() => (typeof localStorage !== "undefined" && localStorage.getItem("striker_theme")) || "light");
  const [autoTrigger, setAutoTrigger] = useS("odds hit +150");

  useE(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("striker_theme", theme);
  }, [theme]);
  const toggleTheme = () => setTheme((v) => (v === "dark" ? "light" : "dark"));

  useE(() => {
    const tick = () => setClock(new Date().toISOString().slice(11, 19));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  /* ----- derived ----- */
  const openCount = Object.keys(positions).length;
  const futuresCount = Object.keys(futures).length;
  const liveMatch = MARKETS.find((m) => m.status === "live");
  const code = codeFor;
  const youRank = { rank: 14, addr: wallet.address || "you", profit: 0 };

  const subscribeRows = [
    { k: "product", v: "Season Pass" },
    { k: "rate", v: "$10 USDG / week", blue: true },
    { k: "first charge", v: "now" },
    { k: "next charge", v: nextCharge },
    { k: "delegate", v: DELEGATE_DISPLAY },
    { k: "balance after", v: (bal.usdg - 10).toFixed(2) + " USDG", total: true, accent: true }
  ];

  const confirmRows = [
    ...slip
      .map((l) => {
        const m = MARKETS.find((x) => x.id === l.matchId);
        if (!m) return null;
        return { k: m.home.code + " v " + m.away.code + " · " + code(m, l.pick), v: parseFloat(l.amount).toFixed(2) + " @ " + oddsFor(m, l.pick).toFixed(2) + "x" };
      })
      .filter((r): r is { k: string; v: string } => r !== null),
    { k: "total stake", v: totalStake.toFixed(2) + " USDG", total: true },
    { k: "potential return", v: totalReturn.toFixed(2) + " USDG", accent: true }
  ];

  const autoRows = [
    ...slip
      .map((l) => {
        const m = MARKETS.find((x) => x.id === l.matchId);
        if (!m) return null;
        return { k: m.home.code + " v " + m.away.code + " · " + code(m, l.pick), v: parseFloat(l.amount).toFixed(2) + " @ " + oddsFor(m, l.pick).toFixed(2) + "x" };
      })
      .filter((r): r is { k: string; v: string } => r !== null),
    { k: "trigger", v: autoTrigger, blue: true },
    { k: "reserved stake", v: totalStake.toFixed(2) + " USDG", total: true },
    { k: "target return", v: totalReturn.toFixed(2) + " USDG", accent: true }
  ];

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-bg font-display text-fg">
      <Header wallet={wallet} onConnect={connect} onDisconnect={disconnect} clock={clock} theme={theme} onToggleTheme={toggleTheme}></Header>
      {t.showTicker ? <TickerBar results={RESULTS} settledVol={SETTLED_VOL}></TickerBar> : null}

      {!connected ? (
        /* gate */
        <div className="flex flex-1 flex-col items-center justify-center px-6 text-center" data-screen-label="Gate">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent">striker terminal · wc26</p>
          <h1 className="mt-4 max-w-2xl text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl">Trade the World Cup.<br></br>One weekly pass. Every market.</h1>
          <p className="mt-4 max-w-md text-sm text-muted">A recurring pay.sh subscription turns into playable tokens. Predict daily matches, lock long-term futures, and settle automatically on the whistle.</p>
          <BlueButton onClick={connect} loading={walletStatus === "connecting"} size="lg" className="mt-8">
            {walletStatus === "connecting" ? "Connecting..." : "Connect Phantom"}
          </BlueButton>
          <p className="mt-4 font-mono text-[11px] text-muted">demo build · no real transactions</p>
        </div>
      ) : (
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto lg:flex-row lg:overflow-hidden">
          {/* PENDING TRANSACTION LOCK: while a tx confirms, the feed + console behind
              the modal go inert (pointer-events-none) so a user cannot double-submit.
              The modal is rendered outside these regions and stays interactive. */}
          {/* left on desktop / below console on mobile: market center */}
          <main className={"order-2 min-w-0 flex-1 px-4 py-5 sm:px-5 lg:order-1 lg:overflow-y-auto " + (busy ? "pointer-events-none select-none" : "")}>
            <div className="mx-auto max-w-3xl">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <MarketToggle view={view} setView={setView} futuresBadge={futuresCount}></MarketToggle>
                <button onClick={resetDemo} className="rounded-md border border-line/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-muted transition hover:border-blue-500/40 hover:text-accent">reset demo</button>
              </div>

              {!subscribed ? (
                <div className="mt-3 flex items-center gap-3 rounded-lg border border-blue-500/30 bg-blue-500/[0.06] px-4 py-2.5">
                  <IconLock className="h-4 w-4 text-accent"></IconLock>
                  <p className="text-xs text-fg/80">Markets are locked. Activate the <span className="font-semibold text-accent">Season Pass</span> in the console to place predictions.</p>
                </div>
              ) : null}

              {feedStatus === "loading" ? (
                /* RPC fetching: skeletons mirror the real feed layout */
                <div className="mt-4 space-y-4" data-screen-label="Feed Loading">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-bold tracking-tight">Daily Match Feed</h2>
                      <p className="font-mono text-[11px] text-muted">fetching markets from Solana RPC...</p>
                    </div>
                    <span className="flex items-center gap-1.5 font-mono text-[11px] text-muted"><Spinner className="h-3.5 w-3.5"></Spinner>loading</span>
                  </div>
                  <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                    <MatchCardSkeleton></MatchCardSkeleton>
                    <MatchCardSkeleton></MatchCardSkeleton>
                    <MatchCardSkeleton></MatchCardSkeleton>
                    <MatchCardSkeleton></MatchCardSkeleton>
                  </div>
                </div>
              ) : feedStatus === "error" ? (
                <div className="mt-4" data-screen-label="RPC Error">
                  <RpcErrorState onRetry={retryConnection}></RpcErrorState>
                </div>
              ) : view === "daily" ? (
                <div className="mt-4 space-y-4" data-screen-label="Daily Matches">
                  <MatchTracker match={liveMatch}></MatchTracker>
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-bold tracking-tight">Daily Match Feed</h2>
                      <p className="font-mono text-[11px] text-muted">{MARKETS.length} markets · Jun 20 fixtures · implied probability</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                    {MARKETS.map((m) => (
                      <MarketCard
                        key={m.id}
                        match={m}
                        locked={!subscribed}
                        selectedPick={((slip.find((l) => l.matchId === m.id) || {}) as { pick?: Outcome }).pick || null}
                        position={positions[m.id]}
                        onSelect={(pick) => addPositionToSlip(m.id, pick)}
                        onShare={openShare}
                      ></MarketCard>
                    ))}
                  </div>
                </div>
              ) : (
                <div className={"mt-4 " + (!subscribed ? "opacity-60" : "")} data-screen-label="Futures Bracket">
                  <TournamentBracket ties={TIES} futures={futures} onPickTie={openTie}></TournamentBracket>
                </div>
              )}

              <div className="mt-4">
                <Trollbox pinnedEvent={banter} connected={connected} handle={wallet.address}></Trollbox>
              </div>
            </div>
          </main>

          {/* right on desktop / top on mobile: console */}
          <aside className={"order-1 flex w-full shrink-0 flex-col gap-3 border-b border-line/10 bg-inset/60 p-4 lg:order-2 lg:w-[360px] lg:border-b-0 lg:border-l lg:overflow-y-auto " + (busy ? "pointer-events-none select-none" : "")}>
            <SubscriptionConsole status={subStatus} nextCharge={nextCharge} onSubscribe={openSubscribe}></SubscriptionConsole>

            {/* Bet slip is rendered high in the sidebar so it is always visible.
                The Alpha leaderboard, position stats, and settle button follow
                below the slip to avoid pushing it off screen. */}
            <BettingSlip
              lines={slip}
              matches={MARKETS}
              positions={positions}
              subscribed={subscribed}
              busy={false}
              totalStake={totalStake}
              totalReturn={totalReturn}
              balance={bal.usdg}
              slipMode={slipMode}
              autoStrikes={autoStrikes}
              onSlipMode={setSlipMode}
              onAmount={setStake}
              onRemove={removeFromSlip}
              onClear={clearSlip}
              onPlace={placeBets}
              onDeployAutoStrike={(trigger) => { setAutoTrigger(trigger); setModal("auto"); }}
              onCancelAutoStrike={cancelAutoStrike}
              onSharePosition={openShare}
            ></BettingSlip>

            <AlphaBoard rows={ALPHA} you={youRank}></AlphaBoard>

            {openCount + futuresCount > 0 ? (
              <div className="grid grid-cols-3 gap-2">
                <div className="rounded-lg border border-line/10 bg-surface p-2.5 text-center">
                  <p className="font-mono text-[9px] uppercase tracking-wider text-muted">open</p>
                  <p className="font-mono text-base font-bold">{openCount + futuresCount}</p>
                </div>
                <div className="rounded-lg border border-line/10 bg-surface p-2.5 text-center">
                  <p className="font-mono text-[9px] uppercase tracking-wider text-muted">staked</p>
                  <p className="font-mono text-base font-bold">{(Object.values(positions).reduce((s, p) => s + p.amount, 0) + Object.values(futures).reduce((s, p) => s + p.amount, 0)).toFixed(0)}</p>
                </div>
                <div className="rounded-lg border border-line/10 bg-surface p-2.5 text-center">
                  <p className="font-mono text-[9px] uppercase tracking-wider text-muted">to win</p>
                  <p className="font-mono text-base font-bold text-green">{(Object.values(positions).reduce((s, p) => s + p.amount * p.odds, 0) + Object.values(futures).reduce((s, p) => s + p.amount * p.odds, 0)).toFixed(0)}</p>
                </div>
              </div>
            ) : null}

            {openCount > 0 ? (
              <button onClick={settleLive} className="flex items-center justify-center gap-2 rounded-lg border border-green/40 bg-green/[0.06] px-4 py-2.5 text-sm font-semibold text-green transition hover:bg-green/15">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green"></span>
                Settle on final whistle (demo)
              </button>
            ) : null}
          </aside>
        </div>
      )}

      {/* modals (outside the pending-tx lock so they stay interactive) */}
      {modal === "subscribe" ? (
        <Modal
          title="Authorize pay.sh stream"
          rows={subscribeRows}
          cta="Sign with Phantom" busy={busy} stage={txStage}
          onConfirm={activateSeasonPass}
          onClose={() => { if (!busy) cancelSubscribeModal(); }}
          footnote="recurring weekly · revocable on chain"
        ></Modal>
      ) : null}

      {modal === "confirm" ? (
        <Modal
          title={"Confirm " + slip.length + (slip.length > 1 ? " predictions" : " prediction")}
          rows={confirmRows}
          cta="Sign with Phantom" busy={busy} stage={txStage}
          onConfirm={confirmBets}
          onClose={() => { if (!busy) setModal(null); }}
          footnote="settles on the final whistle via oracle"
        ></Modal>
      ) : null}

      {modal === "auto" ? (
        <Modal
          title="Deploy Auto-Strike"
          rows={autoRows}
          cta="Sign with Phantom" busy={busy} stage={txStage}
          onConfirm={() => deployAutoStrike(autoTrigger)}
          onClose={() => { if (!busy) setModal(null); }}
          footnote="keeper trigger queued for sleep mode"
        ></Modal>
      ) : null}

      {modal === "bracket" && activeTie ? (
        <BracketModal
          tie={activeTie} pick={futPick} stake={futStake} busy={busy} balance={bal.usdg}
          onPick={setFutPick} onStake={setFutStake} onConfirm={confirmFuture}
          onClose={() => { if (!busy) closeBracketModal(); }}
        ></BracketModal>
      ) : null}

      <ToastStack toasts={toasts}></ToastStack>
      <ShareModal item={shareItem} onClose={() => setShareItem(null)} onMint={mintReceipt} minting={busy && txStage !== "idle"} minted={!!mintedSig}></ShareModal>
      <ResultModal result={resultModal} onClose={() => setResultModal(null)}></ResultModal>

      <TweaksPanel>
        <TweakSection label="Display"></TweakSection>
        <TweakToggle label="Settled ticker" value={t.showTicker} onChange={(v) => setTweak("showTicker", v)}></TweakToggle>
        <TweakToggle label="Accent glow" value={t.accentGlow} onChange={(v) => setTweak("accentGlow", v)}></TweakToggle>
        <TweakSection label="RPC feed state (demo)"></TweakSection>
        <FeedStateControl></FeedStateControl>
      </TweaksPanel>
    </div>
  );
}

/* Small tweak control to demo the loading / error / ready feed states. */
function FeedStateControl() {
  const { feedStatus, setFeedStatus } = useTerminalStore();
  const opts: [FeedStatus, string][] = [["ready", "Ready"], ["loading", "Loading"], ["error", "Error"]];
  return (
    <div className="flex gap-1.5">
      {opts.map(([val, label]) => (
        <button
          key={val}
          onClick={() => setFeedStatus(val)}
          className={"flex-1 rounded-md border px-2 py-1.5 font-mono text-[10px] uppercase tracking-wider transition " +
            (feedStatus === val ? "border-blue-500 bg-blue-500/15 text-accent" : "border-line/10 text-muted hover:border-blue-500/40")}
        >{label}</button>
      ))}
    </div>
  );
}
