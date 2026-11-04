// Live data layer - fetches real World Cup 2026 match data from worldcup26.ir
// and transforms it into the app's MatchData / TickerResult shapes.
//
// Falls back to empty arrays on any network or parse error so the UI degrades
// gracefully (the store shows an empty state rather than crashing).

import type { MatchData, MarketStatus, TickerResult } from "../types";

/* ===========================================================================
 * API types (external contract - worldcup26.ir)
 * =========================================================================== */

interface ApiGame {
  id: string;
  home_team_id: string;
  away_team_id: string;
  home_team_name_en: string;
  away_team_name_en: string;
  home_score: string;
  away_score: string;
  finished: string; // "TRUE" | "FALSE"
  time_elapsed: string; // "finished" | "notstarted" | "1H" | "2H" | "HT"
  local_date: string; // "06/20/2026 16:00"
  group: string;
  type: string;
  // knockout placeholders (no team names yet)
  home_team_label?: string;
  away_team_label?: string;
}

interface ApiTeam {
  id: string;
  name_en: string;
  fifa_code: string;
}

interface GamesResponse {
  games: ApiGame[];
}

interface TeamsResponse {
  teams: ApiTeam[];
}

/* ===========================================================================
 * Constants
 * =========================================================================== */

const API_BASE = "https://worldcup26.ir";
const FETCH_TIMEOUT_MS = 8_000;

/* ===========================================================================
 * Helpers
 * =========================================================================== */

/** Fetch with a timeout so the UI is never blocked indefinitely. */
async function fetchWithTimeout(url: string, ms: number): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    return await fetch(url, { signal: controller.signal, cache: "no-store" });
  } finally {
    clearTimeout(timer);
  }
}

/** Parse the API date string "MM/DD/YYYY HH:mm" into a Date (UTC). */
function parseApiDate(raw: string): Date {
  // raw format: "06/20/2026 16:00"
  const [datePart, timePart] = raw.split(" ");
  const [month, day, year] = datePart.split("/");
  const [hour, minute] = timePart.split(":");
  return new Date(
    Date.UTC(
      Number(year),
      Number(month) - 1,
      Number(day),
      Number(hour),
      Number(minute),
    ),
  );
}

/** Check if a date string falls on a given YYYY-MM-DD (UTC). */
function isOnDate(apiDate: string, yyyy: number, mm: number, dd: number): boolean {
  const d = parseApiDate(apiDate);
  return (
    d.getUTCFullYear() === yyyy &&
    d.getUTCMonth() === mm - 1 &&
    d.getUTCDate() === dd
  );
}

/** Today and yesterday in UTC. */
function getTodayYesterday(): { ty: number; tm: number; td: number; yy: number; ym: number; yd: number } {
  const now = new Date();
  const ty = now.getUTCFullYear();
  const tm = now.getUTCMonth() + 1;
  const td = now.getUTCDate();

  const yest = new Date(Date.UTC(ty, now.getUTCMonth(), td - 1));
  return {
    ty, tm, td,
    yy: yest.getUTCFullYear(),
    ym: yest.getUTCMonth() + 1,
    yd: yest.getUTCDate(),
  };
}

/** Map API status fields to our MarketStatus. */
function resolveStatus(game: ApiGame): MarketStatus {
  if (game.finished === "TRUE") return "ft";
  const te = game.time_elapsed.toLowerCase();
  if (te === "1h" || te === "2h" || te === "ht") return "live";
  return "up";
}

/**
 * Estimate live minute from time_elapsed. The API does not give an exact
 * minute, so we infer a rough value. For finished games the minute is 90.
 */
function estimateMinute(game: ApiGame): number {
  const te = game.time_elapsed.toLowerCase();
  if (te === "finished") return 90;
  if (te === "notstarted") return 0;
  if (te === "ht") return 45;
  // For 1H / 2H, estimate using wall-clock offset from kickoff
  const kickoff = parseApiDate(game.local_date);
  const elapsed = Math.max(0, Math.floor((Date.now() - kickoff.getTime()) / 60_000));
  if (te === "1h") return Math.min(elapsed, 45);
  if (te === "2h") return Math.min(45 + Math.max(0, elapsed - 60), 90); // ~15 min halftime
  return 0;
}

/** Build a kickoff string like "16:00 UTC" for upcoming games. */
function formatKickoff(apiDate: string): string {
  const d = parseApiDate(apiDate);
  const hh = String(d.getUTCHours()).padStart(2, "0");
  const mm = String(d.getUTCMinutes()).padStart(2, "0");
  return `${hh}:${mm} UTC`;
}

/** Group label for display, e.g. "Group A" or "R16". */
function formatGroupTag(group: string, status: MarketStatus): string {
  const suffix = status === "live" ? " - Live" : status === "ft" ? " - FT" : " - Today";
  if (group.length <= 2 && /^[A-L]$/i.test(group)) {
    return `Group ${group.toUpperCase()}${suffix}`;
  }
  // Knockout labels
  const labels: Record<string, string> = {
    r16: "Round of 16",
    qf: "Quarter-Final",
    sf: "Semi-Final",
    final: "Final",
    "3rd": "3rd Place",
  };
  return `${labels[group.toLowerCase()] ?? group}${suffix}`;
}

/**
 * Generate realistic-looking implied probabilities. For live/ft games the score
 * shifts probabilities. For upcoming games we use a deterministic pseudo-random
 * spread seeded by game id so values are stable across refreshes.
 */
function generateProbabilities(
  game: ApiGame,
  status: MarketStatus,
): { pct: { home: number; draw: number; away: number }; delta: { home: number; draw: number; away: number } } {
  const hs = Number(game.home_score) || 0;
  const as = Number(game.away_score) || 0;

  if (status === "ft") {
    // Settled - reflect the result
    if (hs > as) return { pct: { home: 95, draw: 3, away: 2 }, delta: { home: 0, draw: 0, away: 0 } };
    if (hs < as) return { pct: { home: 2, draw: 3, away: 95 }, delta: { home: 0, draw: 0, away: 0 } };
    return { pct: { home: 3, draw: 94, away: 3 }, delta: { home: 0, draw: 0, away: 0 } };
  }

  if (status === "live") {
    // Shift probabilities based on current score
    const diff = hs - as;
    if (diff > 1) return { pct: { home: 82, draw: 12, away: 6 }, delta: { home: 8.2, draw: -3.4, away: -4.8 } };
    if (diff === 1) return { pct: { home: 62, draw: 24, away: 14 }, delta: { home: 5.1, draw: -1.8, away: -3.3 } };
    if (diff === 0) return { pct: { home: 38, draw: 30, away: 32 }, delta: { home: -1.2, draw: 2.4, away: -1.2 } };
    if (diff === -1) return { pct: { home: 14, draw: 24, away: 62 }, delta: { home: -3.3, draw: -1.8, away: 5.1 } };
    return { pct: { home: 6, draw: 12, away: 82 }, delta: { home: -4.8, draw: -3.4, away: 8.2 } };
  }

  // Upcoming - deterministic spread from game id
  const seed = Number(game.id) || 1;
  const base = ((seed * 7 + 13) % 40) + 25; // home pct between 25-64
  const drawBase = ((seed * 3 + 7) % 15) + 20; // draw pct between 20-34
  const away = 100 - base - drawBase;
  const home = base;
  const draw = drawBase;

  // Small random-ish deltas
  const dh = Number((((seed * 11) % 50) / 10 - 2.5).toFixed(1));
  const dd = Number((((seed * 13) % 30) / 10 - 1.5).toFixed(1));
  const da = Number((-(dh + dd)).toFixed(1));

  return {
    pct: { home, draw, away: Math.max(away, 5) },
    delta: { home: dh, draw: dd, away: da },
  };
}

/** Deterministic fake volume string from game id. */
function fakeVolume(gameId: string): string {
  const n = Number(gameId) || 1;
  const k = ((n * 137 + 42) % 900) + 200; // 200-1099
  if (k >= 1000) return `$${(k / 1000).toFixed(1)}M`;
  return `$${k}K`;
}

/** Deterministic fake liquidity string from game id. */
function fakeLiquidity(gameId: string): string {
  const n = Number(gameId) || 1;
  const k = ((n * 89 + 17) % 400) + 80; // 80-479
  return `$${k}K`;
}

/* ===========================================================================
 * Public API
 * =========================================================================== */

/**
 * Fetch live match markets for today (and yesterday's finished results).
 * Returns an empty array on any failure - the UI shows an empty state.
 */
export async function fetchLiveMarkets(): Promise<MatchData[]> {
  try {
    const [gamesRes, teamsRes] = await Promise.all([
      fetchWithTimeout(`${API_BASE}/get/games`, FETCH_TIMEOUT_MS),
      fetchWithTimeout(`${API_BASE}/get/teams`, FETCH_TIMEOUT_MS),
    ]);

    if (!gamesRes.ok || !teamsRes.ok) return [];

    const gamesData: GamesResponse = await gamesRes.json();
    const teamsData: TeamsResponse = await teamsRes.json();

    // Build team lookup: id -> { name, code }
    const teamMap = new Map<string, { name: string; code: string }>();
    for (const t of teamsData.teams) {
      teamMap.set(t.id, { name: t.name_en, code: t.fifa_code });
    }

    const { ty, tm, td, yy, ym, yd } = getTodayYesterday();

    const markets: MatchData[] = [];

    for (const game of gamesData.games) {
      const isToday = isOnDate(game.local_date, ty, tm, td);
      const isYesterday = isOnDate(game.local_date, yy, ym, yd);

      if (!isToday && !isYesterday) continue;
      // Only include yesterday's games if they are finished (settled results)
      if (isYesterday && game.finished !== "TRUE") continue;

      // Skip knockout placeholders that have no teams assigned yet
      if (game.home_team_id === "0" && game.away_team_id === "0") continue;

      const homeTeam = teamMap.get(game.home_team_id);
      const awayTeam = teamMap.get(game.away_team_id);

      // Use the API team names with fifa_code; fall back if lookup fails
      const homeName = homeTeam?.name ?? game.home_team_name_en ?? "TBD";
      const homeCode = homeTeam?.code ?? game.home_team_name_en?.substring(0, 3).toUpperCase() ?? "TBD";
      const awayName = awayTeam?.name ?? game.away_team_name_en ?? "TBD";
      const awayCode = awayTeam?.code ?? game.away_team_name_en?.substring(0, 3).toUpperCase() ?? "TBD";

      const status = resolveStatus(game);
      const { pct, delta } = generateProbabilities(game, status);

      markets.push({
        id: `wc-${game.id}`,
        tag: formatGroupTag(game.group, status),
        status,
        minute: estimateMinute(game),
        score: [Number(game.home_score) || 0, Number(game.away_score) || 0],
        kickoff: status === "up" ? formatKickoff(game.local_date) : "",
        home: { code: homeCode, name: homeName },
        away: { code: awayCode, name: awayName },
        pct,
        delta,
        vol: fakeVolume(game.id),
        liquidity: fakeLiquidity(game.id),
      });
    }

    // Sort: live first, then upcoming by kickoff, then finished
    const statusOrder: Record<MarketStatus, number> = { live: 0, up: 1, ft: 2 };
    markets.sort((a, b) => {
      const so = statusOrder[a.status] - statusOrder[b.status];
      if (so !== 0) return so;
      return a.id.localeCompare(b.id);
    });

    return markets;
  } catch {
    // Network error, timeout, JSON parse failure, etc.
    return [];
  }
}

/**
 * Fetch finished results for the ticker marquee.
 * Pulls all finished games from the last two days.
 */
export async function fetchLiveResults(): Promise<{ results: TickerResult[]; settledVol: string }> {
  try {
    const [gamesRes, teamsRes] = await Promise.all([
      fetchWithTimeout(`${API_BASE}/get/games`, FETCH_TIMEOUT_MS),
      fetchWithTimeout(`${API_BASE}/get/teams`, FETCH_TIMEOUT_MS),
    ]);

    if (!gamesRes.ok || !teamsRes.ok) return { results: [], settledVol: "$0" };

    const gamesData: GamesResponse = await gamesRes.json();
    const teamsData: TeamsResponse = await teamsRes.json();

    const teamMap = new Map<string, string>(); // id -> fifa_code
    for (const t of teamsData.teams) {
      teamMap.set(t.id, t.fifa_code);
    }

    const { ty, tm, td, yy, ym, yd } = getTodayYesterday();

    const results: TickerResult[] = [];
    let totalVolK = 0;

    for (const game of gamesData.games) {
      if (game.finished !== "TRUE") continue;

      const isToday = isOnDate(game.local_date, ty, tm, td);
      const isYesterday = isOnDate(game.local_date, yy, ym, yd);
      if (!isToday && !isYesterday) continue;

      const homeCode = teamMap.get(game.home_team_id) ?? game.home_team_name_en?.substring(0, 3).toUpperCase() ?? "???";
      const awayCode = teamMap.get(game.away_team_id) ?? game.away_team_name_en?.substring(0, 3).toUpperCase() ?? "???";
      const hs = Number(game.home_score) || 0;
      const as = Number(game.away_score) || 0;

      // Generate a payout figure from the fake volume
      const volStr = fakeVolume(game.id);
      results.push({ home: homeCode, hs, away: awayCode, as, payout: volStr });

      // Accumulate for settled total
      const rawK = Number(game.id) || 1;
      totalVolK += ((rawK * 137 + 42) % 900) + 200;
    }

    const settledVol = totalVolK >= 1000 ? `$${(totalVolK / 1000).toFixed(1)}M` : `$${totalVolK}K`;

    return { results, settledVol };
  } catch {
    return { results: [], settledVol: "$0" };
  }
}
