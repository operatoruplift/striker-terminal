"use client";
// striker-live: high-engagement live modules: MatchTracker (2D match-cast),
// Trollbox (social feed), and a deterministic Avatar generator. Markup ported
// verbatim from the prototype. The Trollbox demo banter pool + drip interval are
// now isolated behind trollboxFeed (CONDUCTOR seam 7); render is unchanged.

import * as React from "react";
import { Flag } from "./flags";
import { trollboxFeed } from "../../lib/chat/feed";
import type { MatchData, TrollMessage } from "../../lib/types";

const { useState: useLS, useEffect: useLE, useRef: useLR } = React;

/* ---------- Avatar: deterministic geometric identicon from a wallet string ---------- */

const AV_PALETTE = ["#2563EB", "#3B82F6", "#10B981", "#0EA5E9", "#6366F1", "#EF4444", "#14B8A6", "#8B5CF6"];
function hashStr(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return Math.abs(h);
}
function Avatar({ id, className = "h-6 w-6" }: { id?: string; className?: string }) {
  const h = hashStr(id || "anon");
  const c1 = AV_PALETTE[h % AV_PALETTE.length];
  const c2 = AV_PALETTE[(h >> 3) % AV_PALETTE.length];
  const rot = h % 360;
  const cx = 10 + (h % 12);
  const cy = 10 + ((h >> 4) % 12);
  return (
    <span className={"inline-flex shrink-0 overflow-hidden rounded-full ring-1 ring-line/10 " + className} aria-hidden="true">
      <svg viewBox="0 0 32 32" className="h-full w-full">
        <rect width="32" height="32" fill={c1}></rect>
        <g transform={"rotate(" + rot + " 16 16)"}>
          <rect x="-4" y="16" width="40" height="40" fill={c2} opacity="0.9"></rect>
          <circle cx={cx} cy={cy} r="7" fill="#fff" opacity="0.22"></circle>
        </g>
      </svg>
    </span>
  );
}

/* ---------- MatchTracker: stylized 2D match-cast for the featured live match ---------- */

interface MatchStat { poss: number; shotsH: number; shotsA: number; cornersH: number; cornersA: number; ycH: number; ycA: number }

function Stat({ label, h, a }: { label: string; h: number; a: number }) {
  return (
    <div className="flex items-center justify-between gap-2 font-mono text-[11px]">
      <span className="w-5 text-right font-bold text-accent">{h}</span>
      <span className="flex-1 text-center text-[9px] uppercase tracking-wider text-muted">{label}</span>
      <span className="w-5 font-bold text-red">{a}</span>
    </div>
  );
}

function MatchTracker({ match }: { match?: MatchData | null }) {
  // ball position + which side is attacking, drifting on an interval
  const [ball, setBall] = useLS<{ x: number; y: number }>({ x: 150, y: 80 });
  const [att, setAtt] = useLS<"home" | "away">("home");
  const [stat, setStat] = useLS<MatchStat>({ poss: 58, shotsH: 4, shotsA: 2, cornersH: 5, cornersA: 3, ycH: 1, ycA: 2 });
  const [event, setEvent] = useLS("Kickoff: second half underway");

  useLE(() => {
    if (!match) return;
    const events = [
      match.home.name + " win a corner",
      match.away.name + " counter attack",
      "Shot on target by " + match.home.name,
      "Yellow card: " + match.away.name,
      match.home.name + " keep possession",
      "Free kick in a dangerous area",
      match.away.name + " press high up the pitch"
    ];
    const id = setInterval(() => {
      const attackingHome = Math.random() > 0.42;
      setAtt(attackingHome ? "home" : "away");
      setBall({
        x: attackingHome ? 190 + Math.random() * 90 : 30 + Math.random() * 90,
        y: 28 + Math.random() * 104
      });
      setStat((s) => {
        const n = { ...s };
        n.poss = Math.max(38, Math.min(68, s.poss + Math.round((Math.random() - 0.5) * 6)));
        if (Math.random() > 0.7) { if (attackingHome) n.shotsH++; else n.shotsA++; }
        if (Math.random() > 0.82) { if (attackingHome) n.cornersH++; else n.cornersA++; }
        if (Math.random() > 0.94) { if (attackingHome) n.ycH++; else n.ycA++; }
        return n;
      });
      setEvent(events[Math.floor(Math.random() * events.length)]);
    }, 2600);
    return () => clearInterval(id);
  }, [match]);

  if (!match) return null;
  const possA = 100 - stat.poss;

  return (
    <div className="card-spring rounded-xl border border-line/10 bg-surface p-4 shadow-card">
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-red">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red"></span>Live Match-Cast
        </span>
        <span className="font-mono text-[10px] uppercase tracking-wider text-muted">{match.tag} · {match.minute}&apos;</span>
      </div>

      <div className="mt-3 flex items-center gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <Flag code={match.home.code} className="h-6 w-9"></Flag>
          <span className="text-sm font-bold">{match.home.code}</span>
        </div>
        <span className="font-mono text-xl font-bold tabular-nums">{match.score[0]} : {match.score[1]}</span>
        <div className="flex min-w-0 items-center justify-end gap-2">
          <span className="text-sm font-bold">{match.away.code}</span>
          <Flag code={match.away.code} className="h-6 w-9"></Flag>
        </div>
        <span className="ml-auto inline-flex items-center gap-1.5 rounded-md bg-accent/10 px-2 py-1 font-mono text-[10px] font-bold uppercase text-accent">
          <span>{att === "home" ? match.home.code : match.away.code} attacking</span>
        </span>
      </div>

      {/* 2D pitch */}
      <div className="mt-3 overflow-hidden rounded-lg border border-line/10 bg-inset/60">
        <svg viewBox="0 0 300 160" className="h-auto w-full" preserveAspectRatio="xMidYMid meet">
          <g fill="none" stroke="currentColor" strokeWidth="1.2" className="text-line/20">
            <rect x="6" y="6" width="288" height="148" rx="4"></rect>
            <line x1="150" y1="6" x2="150" y2="154"></line>
            <circle cx="150" cy="80" r="24"></circle>
            <circle cx="150" cy="80" r="1.6" fill="currentColor"></circle>
            <rect x="6" y="42" width="44" height="76"></rect>
            <rect x="6" y="60" width="18" height="40"></rect>
            <rect x="250" y="42" width="44" height="76"></rect>
            <rect x="276" y="60" width="18" height="40"></rect>
          </g>
          {/* possession ball with glow */}
          <g style={{ transform: "translate(" + ball.x + "px," + ball.y + "px)", transition: "transform 1.6s cubic-bezier(0.4,0,0.2,1)" }}>
            <circle r="11" fill="#2563EB" opacity="0.18"></circle>
            <circle r="5" fill="#3B82F6" opacity="0.45"></circle>
            <circle r="2.6" fill="#fff"></circle>
          </g>
        </svg>
      </div>

      {/* possession bar */}
      <div className="mt-3">
        <div className="flex justify-between font-mono text-[10px] text-muted">
          <span className="text-accent">{stat.poss}%</span>
          <span className="uppercase tracking-wider">Possession</span>
          <span className="text-red">{possA}%</span>
        </div>
        <div className="mt-1 flex h-1.5 overflow-hidden rounded-full bg-inset">
          <div className="bg-accent transition-all duration-700" style={{ width: stat.poss + "%" }}></div>
          <div className="bg-red transition-all duration-700" style={{ width: possA + "%" }}></div>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-x-4 gap-y-1.5 border-t border-line/[0.08] pt-3">
        <Stat label="Shots OT" h={stat.shotsH} a={stat.shotsA}></Stat>
        <Stat label="Corners" h={stat.cornersH} a={stat.cornersA}></Stat>
        <Stat label="Yellows" h={stat.ycH} a={stat.ycA}></Stat>
      </div>

      <div className="mt-3 flex items-center gap-2 rounded-lg bg-inset/60 px-3 py-2">
        <span className="h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-accent"></span>
        <span key={event} className="msg-in truncate font-mono text-[11px] text-fg/70">{event}</span>
      </div>
    </div>
  );
}

/* ---------- Trollbox: scrolling social feed (CONDUCTOR seam 7 lives in lib/chat/feed) ---------- */

interface TrollboxProps {
  pinnedEvent?: string | null;
  connected: boolean;
  handle?: string;
}

function Trollbox({ pinnedEvent, connected, handle = "you" }: TrollboxProps) {
  const [msgs, setMsgs] = useLS<TrollMessage[]>(() => trollboxFeed.seed());
  const [draft, setDraft] = useLS("");
  const scrollRef = useLR<HTMLDivElement>(null);

  useLE(() => {
    return trollboxFeed.subscribe((m) => setMsgs((prev) => [...prev.slice(-12), m]));
  }, []);

  // append a system line when the user acts (their own bet shows up in chat)
  useLE(() => {
    if (!pinnedEvent) return;
    setMsgs((m) => [...m.slice(-12), { addr: "you", text: pinnedEvent, you: true, id: "you" + Date.now() }]);
  }, [pinnedEvent]);

  useLE(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [msgs]);

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    setMsgs((m) => [...m.slice(-12), { addr: handle, text, you: true, id: "self" + Date.now() }]);
    setDraft("");
  };

  return (
    <div className="flex flex-col rounded-xl border border-line/10 bg-surface shadow-card">
      <div className="flex items-center justify-between border-b border-line/10 px-4 py-2.5">
        <h3 className="flex items-center gap-2 text-sm font-bold tracking-tight">
          Trollbox
          <span className="inline-flex items-center gap-1 font-mono text-[10px] font-medium text-green"><span className="h-1.5 w-1.5 rounded-full bg-green"></span>2,481 online</span>
        </h3>
        <span className="font-mono text-[10px] uppercase tracking-wider text-muted">global</span>
      </div>
      <div ref={scrollRef} className="flex h-44 flex-col gap-1.5 overflow-y-auto px-3 py-2.5">
        {msgs.map((m) => (
          <div key={m.id} className="msg-in flex items-start gap-2">
            {m.you ? (
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/15 font-mono text-[9px] font-bold text-accent ring-1 ring-line/10">Y</span>
            ) : (
              <Avatar id={m.addr} className="h-6 w-6"></Avatar>
            )}
            <p className="pt-0.5 text-[12px] leading-snug">
              <span className={"font-mono text-[11px] font-semibold " + (m.you ? "text-accent" : "text-muted")}>{m.you ? "you" : m.addr}:</span>{" "}
              <span className="text-fg/80">{m.text}</span>
            </p>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 border-t border-line/10 px-3 py-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value.slice(0, 140))}
          onKeyDown={(e) => { if (e.key === "Enter") send(); }}
          disabled={!connected}
          maxLength={140}
          placeholder={connected ? "Message the desk..." : "Connect wallet to chat..."}
          className="w-full bg-transparent font-mono text-[11px] text-fg outline-none placeholder:text-muted disabled:cursor-not-allowed"
        ></input>
        {connected ? (
          <button
            onClick={send}
            disabled={!draft.trim()}
            className="rounded-md bg-blue-500 px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:bg-blue-500/30"
          >Send</button>
        ) : (
          <span className="font-mono text-[10px] uppercase tracking-wider text-muted">locked</span>
        )}
      </div>
    </div>
  );
}

export { Avatar, MatchTracker, Trollbox };
