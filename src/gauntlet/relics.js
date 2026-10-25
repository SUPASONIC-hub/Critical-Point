/**
 * Relics: the tools a run carries between cases.
 *
 * Every mutation the table deals is a punishment for something the player did.
 * Until relics, nothing went the other way: a season could only be survived,
 * never built. A relic is drafted when a case closes -- three offered, one kept
 * -- and it bends one rule of the table for the rest of the season. Most of
 * them soften a specific punishment, so the draft is a read of how this player
 * tends to break the board; the rarest are unlocked by feats and stay unlocked
 * across seasons in the codex.
 *
 * C-7 (2026-10-25): five of the twelve -- LOCKPICK, SPLINT, HIGH ROLLER,
 * STEADY ANCHOR and GLASS LENS -- measured lifting the best heartbeat play by
 * -1.8% to +0.1% (check:pressure), and with five tools in the first draft and
 * five slots every first season ended holding the same five (80 of 80
 * seasons, no pass). They are gone; in their place five tools each tied to a
 * person of the season -- 반재욱 of the 감사팀, 임경수's paper, 오진우's time
 * limit, 차지원's front page, 도윤하's field notes -- and all five are in the
 * first draft, so it holds eight for five slots. A pass is a choice of its own
 * now: 「숨 고르기」 (`equipRelic`, BREATHER_* in tableRules.js).
 *
 * A relic never prints or narrows the wall. `check:pressure` plays every relic
 * alone and all of them together and holds the same invariants the bare table
 * holds: the heartbeat stays an instrument, and busting to skip stays a loss.
 *
 * This file is pure data and pure rules. The engine applies them; the codex
 * hook owns their persistence. The numbers a sentence quotes are the rule's own
 * (`tableRules.js`), so retuning a relic cannot leave its card saying the old one.
 */

import { subjectParticle } from "../playerLanguage.js";
import { AUDIT_CONTACT_SLACK, AUDIT_LIMIT } from "./auditRisk.js";
import {
  AFTERSHOCK_START,
  BLACKOUT_WALL_SHIFT,
  BREATHER_SECONDS,
  BREATHER_WALL,
  CARBON_COPY_HOLD,
  COLD_BLOOD_START,
  HEAT_SINK_SECONDS,
  HEAT_SINK_SHARE,
  INSURANCE_SHARE,
  KINETIC_GRIP_CHIPS,
  LOGIC_HOLD,
  SILENCE_SECONDS,
  TESTIMONY_SHARE,
} from "./tableRules.js";

export const RELIC_OFFER_SIZE = 3;
/**
 * How many relics a season carries at once. Twelve with no cap meant a season
 * that never passed held every relic open to it by case 15, and three of them
 * (INSURANCE, KINETIC GRIP, STETHOSCOPE) made 70% of what all twelve were
 * worth (day 10, item 6). With five, a draft that finds the slots full takes
 * the new relic only by putting one down, in the same answer.
 *
 * A season saved before the cap that already carries more keeps them: the cap
 * is checked when a relic is taken, never when a save is read, so such a run
 * still has to put one down to take another.
 */
export const RELIC_SLOTS = 5;
/** The logic streak that unlocks ENCORE: the streak at which the pot's bonus is full. */
const ENCORE_UNLOCK_COMBO = 8;
/** The pot the wall has to take from you before INSURANCE is on the table. */
export const INSURANCE_UNLOCK_LOSS = 5000;
/** A stance relic opens when its stance has reshaped enough charged cashes. */
export const STANCE_RELIC_UNLOCK_COUNT = 3;

export const RELICS = Object.freeze({
  metronome: {
    label: "METRONOME",
    name: "메트로놈",
    icon: "timer",
    text: "열기가 오른 다음 장면까지, 방향을 바꿔도 전환으로 인정된다.",
    proc: "전환을 붙잡았다",
    unlock: null,
  },
  coldBlood: {
    label: "COLD BLOOD",
    name: "냉혈",
    icon: "snowflake",
    text: `벽에 닿은 뒤의 AFTERSHOCK가 열기 ${AFTERSHOCK_START}${subjectParticle(String(AFTERSHOCK_START))} 아니라 ${COLD_BLOOD_START}에서 시작한다.`,
    proc: "여진을 절반으로 식혔다",
    softens: { mutation: "aftershock", text: `냉혈: 열기 ${COLD_BLOOD_START}에서 시작` },
    unlock: null,
  },
  heatSink: {
    label: "HEAT SINK",
    name: "방열판",
    icon: "fan",
    text: `HEAT DEBT가 열기의 ${HEAT_SINK_SHARE}분의 1만 남기고, 시간은 ${HEAT_SINK_SECONDS}초만 가져간다.`,
    proc: "열 빚을 절반으로 줄였다",
    softens: { mutation: "heatDebt", text: `방열판: 열기 ${HEAT_SINK_SHARE}분의 1, ${HEAT_SINK_SECONDS}초` },
    unlock: null,
  },
  // C-7's five, each a person of the season (2026-10-25).
  auditContact: {
    label: "AUDIT CONTACT",
    name: "감사실 연줄",
    icon: "clipboard",
    text: `감사팀 반재욱이 한 칸은 눈감아 준다. 감사는 ${AUDIT_LIMIT + AUDIT_CONTACT_SLACK}칸이 차야 적발된다.`,
    proc: "반재욱이 한 칸을 눈감았다",
    unlock: null,
  },
  carbonCopy: {
    label: "CARBON COPY",
    name: "임경수의 사본",
    icon: "files",
    text: `임경수가 태우지 않은 사본이 있다. BLACKOUT이 벽을 ${BLACKOUT_WALL_SHIFT}${subjectParticle(String(BLACKOUT_WALL_SHIFT))} 아니라 ${BLACKOUT_WALL_SHIFT - CARBON_COPY_HOLD}만 당긴다.`,
    proc: "사본이 벽을 붙잡았다",
    softens: { mutation: "blackout", text: `사본: 벽 ${BLACKOUT_WALL_SHIFT - CARBON_COPY_HOLD}만 당김` },
    unlock: null,
  },
  testimony: {
    label: "TESTIMONY",
    name: "오진우의 진술",
    icon: "hourglass",
    text: `결정 제한시간은 설정값이었다. 시간이 다 돼 BUST해도 판돈의 ${TESTIMONY_SHARE}분의 1은 남는다.`,
    proc: `시간이 다 돼도 판돈 ${TESTIMONY_SHARE}분의 1을 지켰다`,
    unlock: null,
  },
  frontPage: {
    label: "FRONT PAGE",
    name: "차지원의 1면",
    icon: "newspaper",
    text: "특종이 이어져도 손이 떨리지 않는다. OVERCLOCK 판에서 밀 때 늘어나는 열기가 절반이다.",
    proc: "1면 마감 앞에서도 손이 고요했다",
    softens: { mutation: "overclock", text: "1면: 밀기 폭 절반만 커짐" },
    unlock: null,
  },
  fieldNote: {
    label: "FIELD NOTES",
    name: "도윤하의 현장 메모",
    icon: "notebook",
    text: `현장에선 두 번이면 흐름이 선다. 같은 방향 ${LOGIC_HOLD - 1}번째부터 논리 콤보가 오른다.`,
    proc: "현장 메모로 콤보를 일찍 세웠다",
    unlock: null,
  },
  encore: {
    label: "ENCORE",
    name: "앙코르",
    icon: "repeat",
    text: "벽에 닿아 판돈을 잃어도 논리 콤보는 남는다.",
    proc: "벽에 닿고도 콤보가 살아남았다",
    unlock: { id: "combo", text: `논리 콤보 ${ENCORE_UNLOCK_COMBO} 달성` },
  },
  insurance: {
    label: "INSURANCE",
    name: "보험",
    icon: "shield",
    text: `사건마다 한 번, 벽에 닿아도 판돈의 ${INSURANCE_SHARE}분의 1은 남는다.`,
    proc: `판돈 ${INSURANCE_SHARE}분의 1을 지켰다`,
    unlock: { id: "loss", text: `판돈 ${INSURANCE_UNLOCK_LOSS.toLocaleString("en-US")} 이상을 벽에 잃기` },
  },
  stethoscope: {
    label: "STETHOSCOPE",
    name: "청진기",
    icon: "stethoscope",
    text: `SILENCE가 와도 심박이 계속 벽을 가리킨다. 시간은 여전히 ${SILENCE_SECONDS}초다.`,
    proc: "침묵 속에서 심장을 들었다",
    softens: { mutation: "silence", text: "청진기: 심박 유지" },
    unlock: { id: "silence", text: "SILENCE를 한 번 겪기" },
  },
  kineticGrip: {
    label: "KINETIC GRIP",
    name: "악력",
    icon: "crosshair",
    text: `STRIKE MASTERY가 밀 때마다 얹던 열기 1을 걷어 내고, STRIKE WAKE로 깨어난 판의 칩이 ${KINETIC_GRIP_CHIPS}배 더 두꺼워진다.`,
    proc: "STRIKE 숙련이 손에 붙었다",
    softens: { mutation: "strikeMastery", text: "악력: 밀 때 오르는 열기 그대로" },
    unlock: { id: "strikeMastery", text: `STRIKE 숙련 ${STANCE_RELIC_UNLOCK_COUNT}회` },
  },
});

/**
 * 「숨 고르기」: what a pass on a draft that offered something gives (C-7,
 * `equipRelic`). The draft's pass button says it, and the stage marks the board.
 */
export const BREATHER = Object.freeze({
  name: "숨 고르기",
  short: `+${BREATHER_SECONDS}초`,
  text: `고르지 않으면 이 사건 첫 판의 시간이 ${BREATHER_SECONDS}초 늘고, 벽이 ${BREATHER_WALL} 멀어진다.`,
});

export const RELIC_IDS = Object.freeze(Object.keys(RELICS));
/** Relics every season can draft without unlocking anything. */
export const DEFAULT_RELIC_POOL = Object.freeze(RELIC_IDS.filter((id) => !RELICS[id].unlock));

/**
 * Known ids, each once, in the order given. The default limit is every relic,
 * not `RELIC_SLOTS`: a season saved before the cap is read as it was saved.
 */
export function normalizeRelicIds(value, limit = RELIC_IDS.length) {
  if (!Array.isArray(value)) return [];
  const seen = new Set();
  for (const id of value) {
    if (typeof id === "string" && RELICS[id] && !seen.has(id)) seen.add(id);
    if (seen.size >= limit) break;
  }
  return [...seen];
}

export function hasRelic(relics, id) {
  return Array.isArray(relics) && relics.includes(id);
}

/** The relic that softened a mutation on this board, if the board carries it. */
export function getSofteningRelic(mutationId, relics) {
  return RELIC_IDS.find((id) => RELICS[id].softens?.mutation === mutationId && hasRelic(relics, id)) ?? null;
}

/**
 * The feats a settled window proves. Each unlock is keyed to a moment the
 * player will remember -- a combo, a loss, a hot cash, a silenced heart -- so
 * a relic arriving in the codex reads as something earned, not a timer.
 */
export function getRelicUnlocks({ verdict, nextRun } = {}, unlocked = []) {
  if (!verdict) return [];
  const earned = [];
  const maxCombo = Math.max(Number(verdict.logic?.streak) || 0, Number(nextRun?.logic?.best) || 0);
  const mastery = nextRun?.stanceMastery && typeof nextRun.stanceMastery === "object" ? nextRun.stanceMastery : {};
  if (maxCombo >= ENCORE_UNLOCK_COMBO) earned.push("encore");
  if (verdict.outcome === "bust" && (Number(verdict.lostPot) || 0) + (Number(verdict.insuredPot) || 0) >= INSURANCE_UNLOCK_LOSS) earned.push("insurance");
  if (Array.isArray(verdict.nextMutations) && verdict.nextMutations.some((mutation) => mutation.id === "silence")) earned.push("stethoscope");
  if ((Number(mastery.strike) || 0) >= STANCE_RELIC_UNLOCK_COUNT) earned.push("kineticGrip");
  return earned.filter((id) => !hasRelic(unlocked, id));
}

/** Everything a season can draft: the defaults plus whatever the codex holds. */
export function getRelicPool(unlocked = []) {
  return RELIC_IDS.filter((id) => !RELICS[id].unlock || hasRelic(unlocked, id));
}
