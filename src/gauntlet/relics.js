/**
 * Relics: the tools a run carries between cases.
 *
 * Every mutation the table deals is a punishment for something the player did.
 * Until relics, nothing went the other way: a season could only be survived,
 * never built. A relic is drafted when a case closes -- three offered, one kept
 * -- and it bends one rule of the table for the rest of the season. Most of
 * them soften a specific punishment, so the draft is a read of how this player
 * tends to break the board; HIGH ROLLER trades instead; the rarest are unlocked by
 * feats and stay unlocked across seasons in the codex.
 *
 * A relic never prints or narrows the wall. `check:pressure` plays every relic
 * alone and all of them together and holds the same invariants the bare table
 * holds: the heartbeat stays an instrument, and busting to skip stays a loss.
 *
 * This file is pure data and pure rules. The engine applies them; the codex
 * hook owns their persistence.
 */

export const RELIC_OFFER_SIZE = 3;
/** The combo that unlocks ENCORE: a hand that has learned the beat. */
export const ENCORE_UNLOCK_COMBO = 8;
/** The pot the wall has to take from you before INSURANCE is on the table. */
export const INSURANCE_UNLOCK_LOSS = 5000;
/** The cash multiplier that unlocks HIGH ROLLER. */
export const HIGH_ROLLER_UNLOCK_MULTIPLIER = 64;

export const RELICS = Object.freeze({
  metronome: {
    label: "METRONOME",
    name: "메트로놈",
    icon: "timer",
    text: "PERFECT와 GOOD 박자 판정 폭이 1.5배 넓어진다.",
    proc: "박자를 붙잡았다",
    unlock: null,
  },
  coldBlood: {
    label: "COLD BLOOD",
    name: "냉혈",
    icon: "snowflake",
    text: "BUST 뒤의 AFTERSHOCK가 열기 22가 아니라 11에서 시작한다.",
    proc: "여진을 절반으로 식혔다",
    softens: { mutation: "aftershock", text: "냉혈: 열기 11에서 시작" },
    unlock: null,
  },
  heatSink: {
    label: "HEAT SINK",
    name: "방열판",
    icon: "fan",
    text: "HEAT DEBT가 열의 6분의 1만 남기고, 시간은 6초만 가져간다.",
    proc: "열 빚을 절반으로 줄였다",
    softens: { mutation: "heatDebt", text: "방열판: 열 6분의 1, 6초" },
    unlock: null,
  },
  lockpick: {
    label: "LOCKPICK",
    name: "락픽",
    icon: "key",
    text: "COLD FEET로 봉인된 카드가 열기 30이 아니라 15에서 열린다.",
    proc: "봉인을 일찍 땄다",
    softens: { mutation: "coldFeet", text: "락픽: 열기 15에서 열림" },
    unlock: null,
  },
  splint: {
    label: "SPLINT",
    name: "부목",
    icon: "bandage",
    text: "FRACTURE로 금 간 축의 청구가 1.5배가 아니라 1.25배다.",
    proc: "균열을 받쳤다",
    softens: { mutation: "fracture", text: "부목: 1.25배 청구" },
    unlock: null,
  },
  encore: {
    label: "ENCORE",
    name: "앙코르",
    icon: "repeat",
    text: "BUST가 판돈은 가져가도 박자 콤보는 남겨 둔다.",
    proc: "콤보가 벽을 넘어 살아남았다",
    unlock: { id: "combo", text: `박자 콤보 ${ENCORE_UNLOCK_COMBO} 달성` },
  },
  insurance: {
    label: "INSURANCE",
    name: "보험",
    icon: "shield",
    text: "사건마다 한 번, BUST가 판돈의 3분의 1을 남겨 둔다.",
    proc: "판돈 3분의 1을 지켰다",
    unlock: { id: "loss", text: `판돈 ${INSURANCE_UNLOCK_LOSS.toLocaleString("en-US")} 이상을 벽에 잃기` },
  },
  highRoller: {
    label: "HIGH ROLLER",
    name: "하이롤러",
    icon: "gem",
    text: "모든 카드의 칩이 1.3배. 대신 벽 구간 전체가 4 가까워진다.",
    proc: "더 큰 칩을 걸었다",
    unlock: { id: "multiplier", text: `×${HIGH_ROLLER_UNLOCK_MULTIPLIER} 이상으로 확정하기` },
  },
  stethoscope: {
    label: "STETHOSCOPE",
    name: "청진기",
    icon: "stethoscope",
    text: "SILENCE가 와도 심박이 계속 벽을 가리킨다. 시간은 여전히 30초다.",
    proc: "침묵 속에서 심장을 들었다",
    softens: { mutation: "silence", text: "청진기: 심박 유지" },
    unlock: { id: "silence", text: "SILENCE를 한 번 겪기" },
  },
});

export const RELIC_IDS = Object.freeze(Object.keys(RELICS));
/** Relics every season can draft without unlocking anything. */
export const DEFAULT_RELIC_POOL = Object.freeze(RELIC_IDS.filter((id) => !RELICS[id].unlock));

/** Known ids, each once, in the order given. */
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
  const maxCombo = Math.max(Number(verdict.tempo?.maxCombo) || 0, Number(nextRun?.bestCombo) || 0);
  if (maxCombo >= ENCORE_UNLOCK_COMBO) earned.push("encore");
  if (verdict.outcome === "bust" && (Number(verdict.lostPot) || 0) + (Number(verdict.insuredPot) || 0) >= INSURANCE_UNLOCK_LOSS) earned.push("insurance");
  if (verdict.outcome === "cash" && (Number(verdict.multiplier) || 0) >= HIGH_ROLLER_UNLOCK_MULTIPLIER) earned.push("highRoller");
  if (Array.isArray(verdict.nextMutations) && verdict.nextMutations.some((mutation) => mutation.id === "silence")) earned.push("stethoscope");
  return earned.filter((id) => !hasRelic(unlocked, id));
}

/** Everything a season can draft: the defaults plus whatever the codex holds. */
export function getRelicPool(unlocked = []) {
  return RELIC_IDS.filter((id) => !RELICS[id].unlock || hasRelic(unlocked, id));
}
