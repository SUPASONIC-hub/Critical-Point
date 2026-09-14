import { isResourceGain } from "../gameConstants.js";

/**
 * The gauntlet: one hand of cards, one gauge, one wall you cannot see.
 *
 * A decision window is a bet. The player stakes a card, then either CASHES it
 * at the current multiplier or PUSHES for a bigger one. Every push adds a drawn
 * step of heat; the clock creeps heat in on its own. The wall sits somewhere in
 * a drawn band -- the band is on screen, the wall is not -- and the heartbeat is
 * the only honest instrument pointed at it. Reach the wall and the window busts:
 * the card resolves with none of its gains, the case pot is wiped, and the next
 * board is broken in the way this one went wrong.
 *
 * Everything here is pure and seeded. The live window and the balance script
 * draw the same walls and the same steps from the same seeds.
 */

export const WINDOW_SECONDS = 45;
/** Seconds of reading before the clock starts creeping heat into the gauge. */
export const READ_GRACE_SECONDS = 4;
export const GAUGE_MAX = 100;
const WALL_FLOOR = 38;

export const BASE_SCHEMA = Object.freeze({
  seconds: WINDOW_SECONDS,
  wallMin: 56,
  wallMax: 92,
  stepMin: 7,
  stepMax: 15,
  creep: 0.5,
  startGauge: 0,
  chipsScale: 1,
  faceDown: false,
  sedated: false,
  sealHighest: false,
  fracturedAxis: null,
  mutations: [],
});

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const round2 = (value) => Math.round(value * 100) / 100;

export function hashSeed(seed) {
  let hash = 2166136261;
  for (const character of String(seed)) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

/** A uniform [0, 1) from a string seed. */
export function seededUnit(seed) {
  let value = hashSeed(seed) || 1;
  value = (Math.imul(value, 1664525) + 1013904223) >>> 0;
  value ^= value >>> 15;
  value = Math.imul(value, 2246822519) >>> 0;
  value ^= value >>> 13;
  return (value >>> 0) / 4294967296;
}

export function drawWall(schema, seed) {
  const { wallMin, wallMax } = normalizeSchema(schema);
  return wallMin + Math.floor(seededUnit(`wall:${seed}`) * (wallMax - wallMin + 1));
}

export function drawStep(schema, seed, pushIndex) {
  const { stepMin, stepMax } = normalizeSchema(schema);
  return stepMin + Math.floor(seededUnit(`step:${seed}:${pushIndex}`) * (stepMax - stepMin + 1));
}

/**
 * The pot multiplier doubles every 11 points of heat: x1 cold, x44 at 60, x199
 * at 84. The smallest push (7) is worth x1.55 on its own, so every press
 * visibly buys something -- and every press is visibly more to lose.
 */
export const DOUBLING_HEAT = 11;

export function getMultiplier(gauge) {
  const raw = Math.pow(2, clamp(Number(gauge) || 0, 0, GAUGE_MAX) / DOUBLING_HEAT);
  if (raw >= 100) return Math.round(raw);
  return raw >= 10 ? Math.round(raw * 10) / 10 : Math.round(raw * 100) / 100;
}

/**
 * What heat does to the card's own resource gains. Damped on purpose: the pot is
 * the exponential reward, the resources are the story, and a x26 trust swing
 * would end the story in one card.
 */
export function getResourceMultiplier(gauge) {
  return round2(1 + (clamp(Number(gauge) || 0, 0, GAUGE_MAX) / GAUGE_MAX) * 1.5);
}

/**
 * 0 far from the wall, 1 touching it. The stage feeds it the window's *tell*
 * wall -- the real wall plus a seeded error of up to TELL_ERROR -- so the
 * heartbeat is an instrument, not an answer key. `npm run check:pressure`
 * measures it: at 8 the best heartbeat policy banked 80% of what a player who
 * could see the wall banks, at 18 it banks 57% and still beats every blind
 * policy by half again.
 */
export function getCloseness(gauge, wall) {
  return clamp(1 - ((Number(wall) || GAUGE_MAX) - (Number(gauge) || 0)) / 44, 0, 1);
}

/**
 * The pulse. Two things raise it and only one of them is secret.
 *
 * The tell reads the (noisy) wall. Under it sits a floor built from what the
 * player can already see -- the heat on the gauge and the time gone from the
 * clock -- so a hot gauge or a late window always races, whatever the tell
 * says, and an idle window no longer sits at a resting 60 while it runs out.
 * The floor carries no information about the wall, so it cannot turn the
 * heartbeat into an answer key; `check:pressure` holds that.
 */
export function getHeartbeatBpm(gauge, wall, sedated = false, urgency = 0) {
  const heat = clamp(Number(gauge) || 0, 0, GAUGE_MAX) / GAUGE_MAX;
  const late = clamp(Number(urgency) || 0, 0, 1);
  const floor = 60 + heat * heat * 94 + late * late * 50;
  const tell = sedated ? 88 : 60 + Math.pow(getCloseness(gauge, wall), 1.35) * 124;
  return Math.round(Math.min(190, Math.max(tell, floor)));
}

export function normalizeSchema(value) {
  const source = value && typeof value === "object" ? value : {};
  const schema = { ...BASE_SCHEMA };
  for (const key of ["seconds", "wallMin", "wallMax", "stepMin", "stepMax", "creep", "startGauge", "chipsScale"]) {
    const numeric = Number(source[key]);
    if (Number.isFinite(numeric)) schema[key] = numeric;
  }
  for (const key of ["faceDown", "sedated", "sealHighest"]) {
    if (typeof source[key] === "boolean") schema[key] = source[key];
  }
  schema.fracturedAxis = typeof source.fracturedAxis === "string" ? source.fracturedAxis : null;
  schema.mutations = Array.isArray(source.mutations)
    ? source.mutations.filter((id) => typeof id === "string").slice(0, 8)
    : [];
  schema.seconds = clamp(Math.round(schema.seconds), 12, 60);
  schema.wallMin = clamp(Math.round(schema.wallMin), WALL_FLOOR, 96);
  schema.wallMax = clamp(Math.round(schema.wallMax), schema.wallMin, 98);
  schema.stepMin = clamp(Math.round(schema.stepMin), 1, 30);
  schema.stepMax = clamp(Math.round(schema.stepMax), schema.stepMin, 40);
  schema.creep = clamp(schema.creep, 0, 4);
  schema.startGauge = clamp(Math.round(schema.startGauge), 0, schema.wallMin - 8);
  schema.chipsScale = clamp(schema.chipsScale, 0.25, 4);
  return schema;
}

/* ------------------------------------------------------------------ cards */

/** What the wild card -- a sentence the player writes -- is worth before heat. */
export const WILD_CARD_CHIPS = 24;

/** Chips: what a card is worth before heat. The sum of what it gains. */
export function getCardChips(choice, schema = BASE_SCHEMA) {
  if (choice?.type === "free") return Math.round(WILD_CARD_CHIPS * normalizeSchema(schema).chipsScale);
  const effect = choice?.effect ?? {};
  const gains = Object.entries(effect)
    .filter(([key, value]) => isResourceGain(key, value))
    .reduce((sum, [, value]) => sum + Math.abs(value), 0);
  return Math.max(5, Math.round((10 + gains * 2) * normalizeSchema(schema).chipsScale));
}

/** What the card burns, with the fractured axis billed half again. */
export function getCardBurn(choice, schema = BASE_SCHEMA) {
  const { fracturedAxis } = normalizeSchema(schema);
  const costs = Object.entries(applyFracture(choice?.effect ?? {}, fracturedAxis))
    .filter(([key, value]) => value !== 0 && !isResourceGain(key, value))
    .sort(([, a], [, b]) => Math.abs(b) - Math.abs(a));
  if (!costs.length) return null;
  const [key, value] = costs[0];
  return { key, value, fractured: key === fracturedAxis };
}

function applyFracture(effect, fracturedAxis) {
  if (!fracturedAxis) return { ...effect };
  return Object.fromEntries(
    Object.entries(effect).map(([key, value]) =>
      key === fracturedAxis && value !== 0 && !isResourceGain(key, value) ? [key, Math.round(value * 1.5)] : [key, value],
    ),
  );
}

/** The card a sealed hand locks: the richest one. Ties go to the earlier card. */
export function getSealedCardId(choices = [], schema = BASE_SCHEMA) {
  const normalized = normalizeSchema(schema);
  if (!normalized.sealHighest) return null;
  const playable = choices.filter((choice) => choice && choice.type !== "free");
  if (playable.length < 2) return null;
  let best = playable[0];
  for (const choice of playable) {
    if (getCardChips(choice, normalized) > getCardChips(best, normalized)) best = choice;
  }
  return best.id;
}

export const SEAL_BREAK_GAUGE = 30;

/**
 * The effect a resolved card actually applies. Gains ride the heat; costs on
 * the fractured axis are billed half again; a bust strips every gain and keeps
 * every cost, which is the entire shape of losing.
 */
export function applyGauntletEffect(effect = {}, { outcome = "cash", gauge = 0, fracturedAxis = null } = {}) {
  const fractured = applyFracture(effect, fracturedAxis);
  if (outcome === "bust") {
    return Object.fromEntries(Object.entries(fractured).map(([key, value]) => [key, isResourceGain(key, value) ? 0 : value]));
  }
  const multiplier = getResourceMultiplier(gauge);
  return Object.fromEntries(
    Object.entries(fractured).map(([key, value]) => [key, isResourceGain(key, value) ? Math.round(value * multiplier) : value]),
  );
}

export const BUST_EFFECT = Object.freeze({ trust: -6, legitimacy: -6, fatigue: 8, time: -4 });

/* --------------------------------------------------------------- window */

export const TELL_ERROR = 18;

export function drawTellOffset(seed) {
  return Math.round((seededUnit(`tell:${seed}`) * 2 - 1) * TELL_ERROR);
}

export function createWindow({ schema = BASE_SCHEMA, seed = "0", abandoned = false } = {}) {
  const normalized = normalizeSchema(schema);
  const window = {
    seed: String(seed),
    schema: normalized,
    wall: drawWall(normalized, seed),
    tellOffset: drawTellOffset(seed),
    gauge: normalized.startGauge,
    pushes: 0,
    lastStep: 0,
    elapsed: 0,
    selectedId: null,
    status: "live",
    cause: null,
  };
  // A window the player touched and then walked away from -- a reload, a tab
  // closed mid-bet -- is settled as a bust. Otherwise F5 undoes the wall.
  // The gauge stays where the window opened: an abandoned window must not
  // print the wall it was hiding, or a second tab becomes a way to read it.
  return abandoned ? { ...window, status: "bust", cause: "abandon" } : window;
}

export function getRemainingSeconds(window) {
  return Math.max(0, window.schema.seconds - window.elapsed);
}

/**
 * The live window. `TICK` carries elapsed seconds since the last tick; the
 * reducer owns the arithmetic so a slow frame and a fast one land the same.
 */
export function reduceWindow(window, event = {}) {
  if (!window || window.status !== "live") return window;
  switch (event.type) {
    case "TICK": {
      const delta = clamp(Number(event.delta) || 0, 0, 1);
      const elapsed = window.elapsed + delta;
      const creepFrom = Math.max(window.elapsed, READ_GRACE_SECONDS);
      const creeping = Math.max(0, elapsed - creepFrom);
      const gauge = clamp(window.gauge + creeping * window.schema.creep * (1 + window.pushes * 0.12), 0, GAUGE_MAX);
      if (gauge >= window.wall) return { ...window, elapsed, gauge: window.wall, status: "bust", cause: "creep" };
      if (elapsed >= window.schema.seconds) return { ...window, elapsed: window.schema.seconds, gauge, status: "bust", cause: "timeout" };
      return { ...window, elapsed, gauge };
    }
    case "PUSH": {
      const pushes = window.pushes + 1;
      const step = drawStep(window.schema, window.seed, pushes);
      const gauge = clamp(window.gauge + step, 0, GAUGE_MAX);
      if (gauge >= window.wall) return { ...window, pushes, lastStep: step, gauge, status: "bust", cause: "push" };
      return { ...window, pushes, lastStep: step, gauge };
    }
    case "SELECT":
      return { ...window, selectedId: typeof event.id === "string" ? event.id : null };
    case "CASH": {
      if (!window.selectedId || event.locked) return window;
      return { ...window, status: "cashed", cause: "cash" };
    }
    default:
      return window;
  }
}

/* ------------------------------------------------------------------ run */

export const RUN_INITIAL_STATE = Object.freeze({
  windowIndex: 0,
  runPot: 0,
  vault: 0,
  streak: 0,
  busts: 0,
  cashes: 0,
  bestMultiplier: 1,
  lastOutcome: "none",
  lastGauge: 0,
  // The seed of a window the player has already touched and not yet settled.
  // Saved the moment the window is touched, so a reload cannot un-bust it.
  openSeed: null,
  // The card staked in that window, so an abandoned window settles the card the
  // player chose rather than the worst one on the table.
  openCardId: null,
  schema: BASE_SCHEMA,
});

export function normalizeRunState(value) {
  const source = value && typeof value === "object" && !Array.isArray(value) ? value : {};
  const run = { ...RUN_INITIAL_STATE };
  for (const key of ["windowIndex", "runPot", "vault", "streak", "busts", "cashes", "bestMultiplier", "lastGauge"]) {
    const numeric = Number(source[key]);
    if (Number.isFinite(numeric)) run[key] = numeric;
  }
  run.windowIndex = Math.max(0, Math.trunc(run.windowIndex));
  run.runPot = Math.max(0, Math.round(run.runPot));
  run.vault = Math.max(0, Math.round(run.vault));
  run.streak = Math.max(0, Math.trunc(run.streak));
  run.busts = Math.max(0, Math.trunc(run.busts));
  run.cashes = Math.max(0, Math.trunc(run.cashes));
  run.bestMultiplier = clamp(run.bestMultiplier, 1, 512);
  run.lastGauge = clamp(run.lastGauge, 0, GAUGE_MAX);
  run.lastOutcome = ["none", "cash", "bust"].includes(source.lastOutcome) ? source.lastOutcome : "none";
  run.openSeed = typeof source.openSeed === "string" ? source.openSeed.slice(0, 200) : null;
  run.openCardId = run.openSeed && typeof source.openCardId === "string" ? source.openCardId.slice(0, 200) : null;
  run.schema = normalizeSchema(source.schema);
  return run;
}

export function serializeRunState(value) {
  const run = normalizeRunState(value);
  return { ...run, schema: { ...run.schema, mutations: [...run.schema.mutations] } };
}

/**
 * The catalogue of ways a decision breaks the next board. Each one is keyed to
 * something the player did, and each one changes a rule, not a number on a
 * report.
 */
export const MUTATIONS = Object.freeze({
  blackout: {
    label: "BLACKOUT",
    title: "카드가 뒤집혔다",
    text: "임계점을 넘긴 대가. 다음 판은 카드의 칩과 소모가 가려지고, 벽이 6 가까워진다.",
  },
  aftershock: {
    label: "AFTERSHOCK",
    title: "여진이 남았다",
    text: "게이지가 22에서 시작한다. 방금 터진 열이 아직 식지 않았다.",
  },
  silence: {
    label: "SILENCE",
    title: "심장이 거짓말을 한다",
    text: "시간을 흘려보낸 대가. 다음 판은 심박이 벽을 알려주지 않고, 결정 시간이 30초다.",
  },
  heatDebt: {
    label: "HEAT DEBT",
    title: "탐욕은 열을 남긴다",
    text: "높은 배율로 확정한 대가. 이번 열의 3분의 1을 안고 시작하고, 12초를 잃는다.",
  },
  overclock: {
    label: "OVERCLOCK",
    title: "판돈이 두 배로 뛴다",
    text: "연속으로 x4 이상을 챙겼다. 칩이 두 배지만, 한 번 밀 때 오르는 열도 커진다.",
  },
  coldFeet: {
    label: "COLD FEET",
    title: "가장 좋은 카드가 봉인됐다",
    text: "밀지 않고 확정한 대가. 가장 비싼 카드는 게이지 30을 넘겨야 열리고, 칩이 줄어든다.",
  },
  fracture: {
    label: "FRACTURE",
    title: "균열이 난 축",
    text: "방금 가장 크게 태운 축. 다음 판에서 그 축을 태우는 카드는 1.5배로 청구된다.",
  },
  reboot: {
    label: "REBOOT",
    title: "사건이 닫혔다",
    text: "판돈은 금고로 옮겨졌고, 규칙이 초기화됐다. 이제 잃을 수 없다.",
  },
});

export function describeMutations(schema) {
  const { mutations, fracturedAxis } = normalizeSchema(schema);
  return mutations
    .filter((id) => MUTATIONS[id])
    .map((id) => ({ id, ...MUTATIONS[id], axis: id === "fracture" ? fracturedAxis : null }));
}

/** Builds the next board from what just happened. */
/** A burn smaller than this is a scratch, not a fracture. */
export const FRACTURE_MIN_BURN = 10;

export function buildNextSchema({ outcome, cause, gauge, pushes, streak, burnAxis, caseClosed }) {
  if (caseClosed) return normalizeSchema({ ...BASE_SCHEMA, mutations: ["reboot"] });
  const schema = { ...BASE_SCHEMA, mutations: [] };
  if (outcome === "bust") {
    schema.faceDown = true;
    schema.wallMin -= 6;
    schema.wallMax -= 6;
    schema.startGauge = 22;
    schema.mutations.push("blackout", "aftershock");
    if (cause === "timeout") {
      schema.sedated = true;
      schema.seconds = 30;
      schema.mutations.push("silence");
    }
  } else {
    if (gauge >= 60) {
      schema.startGauge = Math.round(gauge / 3);
      schema.seconds -= 12;
      schema.mutations.push("heatDebt");
    }
    if (streak >= 2) {
      schema.chipsScale *= 2;
      schema.stepMin += 4;
      schema.stepMax += 6;
      schema.mutations.push("overclock");
    }
    if (pushes === 0) {
      schema.sealHighest = true;
      schema.chipsScale *= 0.6;
      schema.mutations.push("coldFeet");
    }
  }
  if (burnAxis) {
    schema.fracturedAxis = burnAxis;
    schema.mutations.push("fracture");
  }
  return normalizeSchema(schema);
}

/**
 * Settles a closed window against the run. Returns the verdict the runtime logs
 * and the reveal prints, and the run state the next window is dealt from.
 */
export function resolveWindow({ run, window, card, caseClosed = false }) {
  const current = normalizeRunState(run);
  const outcome = window?.status === "cashed" ? "cash" : "bust";
  const cause = outcome === "cash" ? "cash" : window?.cause ?? "push";
  const gauge = clamp(Number(window?.gauge) || 0, 0, GAUGE_MAX);
  const multiplier = outcome === "cash" ? getMultiplier(gauge) : 0;
  const chips = card ? getCardChips(card, current.schema) : 0;
  const pot = outcome === "cash" ? Math.round(chips * multiplier) : 0;
  const lostPot = outcome === "bust" ? current.runPot : 0;
  const streak = outcome === "cash" && multiplier >= 4 ? current.streak + 1 : 0;
  const runPotAfter = outcome === "cash" ? current.runPot + pot : 0;
  const secured = caseClosed ? runPotAfter : 0;
  const burn = card ? getCardBurn(card, current.schema) : null;
  const fractureAxis = burn && Math.abs(burn.value) >= FRACTURE_MIN_BURN ? burn.key : null;
  const nextSchema = buildNextSchema({
    outcome,
    cause,
    gauge,
    pushes: Number(window?.pushes) || 0,
    streak,
    burnAxis: fractureAxis,
    caseClosed,
  });
  const verdict = {
    outcome,
    cause,
    gauge: Math.round(gauge),
    wall: Number(window?.wall) || 0,
    pushes: Number(window?.pushes) || 0,
    elapsed: round2(Number(window?.elapsed) || 0),
    chips,
    multiplier,
    resourceMultiplier: outcome === "cash" ? getResourceMultiplier(gauge) : 0,
    pot,
    lostPot,
    secured,
    fracturedAxis: current.schema.fracturedAxis,
    nextMutations: describeMutations(nextSchema),
  };
  const nextRun = normalizeRunState({
    windowIndex: current.windowIndex + 1,
    runPot: caseClosed ? 0 : runPotAfter,
    vault: current.vault + secured,
    streak,
    busts: current.busts + (outcome === "bust" ? 1 : 0),
    cashes: current.cashes + (outcome === "cash" ? 1 : 0),
    bestMultiplier: Math.max(current.bestMultiplier, multiplier || 1),
    lastOutcome: outcome,
    lastGauge: gauge,
    schema: nextSchema,
  });
  return { verdict, nextRun };
}

/**
 * Who holds a window. The saved `openSeed` is `<window seed>#<tab token>`: the
 * seed says which window was touched, the token says which tab touched it, so
 * a second tab on the same window can be told apart from a reload of the first.
 */
export function splitOpenSeed(openSeed) {
  if (typeof openSeed !== "string" || !openSeed) return { seed: null, token: null };
  const index = openSeed.lastIndexOf("#");
  return index < 0 ? { seed: openSeed, token: null } : { seed: openSeed.slice(0, index), token: openSeed.slice(index + 1) };
}

/**
 * Whether the stored save is ahead of the run this tab is about to write.
 *
 * A newer revision alone is not a conflict: another tab that only opened the
 * game, resumed it, or looked at a held bet writes the same run back. What this
 * tab must never write over is play it has not seen -- a different run, a
 * window settled past this tab's, or a window another tab has taken hold of.
 */
export function isSaveAheadOf(stored, payload, tabToken) {
  if (!stored || typeof stored !== "object") return false;
  if (stored.runId !== payload?.runId) return true;
  const storedRun = stored.dynamics ?? {};
  const ownRun = payload?.dynamics ?? {};
  const storedWindow = Number(storedRun.windowIndex) || 0;
  const ownWindow = Number(ownRun.windowIndex) || 0;
  if (storedWindow > ownWindow) return true;
  if (storedWindow < ownWindow) return false;
  const storedHold = splitOpenSeed(storedRun.openSeed);
  if (!storedHold.seed) return false;
  const ownHold = splitOpenSeed(ownRun.openSeed);
  return storedHold.token !== tabToken && storedHold.token !== ownHold.token;
}

/**
 * A recovery slot is a way back from a broken save, not a way back from the
 * wall. Restoring one rolls the story back to the slot; the table record since
 * the slot comes along. Busts settled after the slot stay in the log (as system
 * entries the ledger and the ending read), the pot they wiped stays wiped, the
 * board they broke stays broken, and the window count never goes backwards, so
 * the next window is a fresh draw.
 */
export function carryTableRecordIntoRestore(restored, current) {
  if (!restored || !current || restored.runId !== current.runId) return restored;
  const restoredRun = normalizeRunState(restored.dynamics);
  const currentRun = normalizeRunState(current.dynamics);
  if (currentRun.windowIndex <= restoredRun.windowIndex) return restored;
  const restoredLog = Array.isArray(restored.log) ? restored.log : [];
  const currentLog = Array.isArray(current.log) ? current.log : [];
  const sameCase = restored.currentCase === current.currentCase;
  const lostBusts = sameCase
    ? currentLog.slice(restoredLog.length).filter((entry) => entry?.threshold?.busted)
    : [];
  const bustedSince = currentRun.busts > restoredRun.busts;
  const carried = lostBusts.map((entry) => ({
    isSystemEvent: true,
    nodeId: entry.nodeId,
    caseId: entry.caseId,
    choiceId: "table-record-carry",
    title: "TABLE RECORD",
    choice: "복구 전에 난 BUST",
    effect: {},
    threshold: entry.threshold,
    resourcesBefore: restored.resources,
    resourcesAfter: restored.resources,
  }));
  return {
    ...restored,
    log: [...restoredLog, ...carried],
    dynamics: serializeRunState({
      ...restoredRun,
      windowIndex: currentRun.windowIndex,
      busts: Math.max(restoredRun.busts, currentRun.busts),
      cashes: Math.max(restoredRun.cashes, currentRun.cashes),
      bestMultiplier: Math.max(restoredRun.bestMultiplier, currentRun.bestMultiplier),
      runPot: bustedSince ? 0 : restoredRun.runPot,
      streak: bustedSince ? 0 : restoredRun.streak,
      schema: bustedSince ? currentRun.schema : restoredRun.schema,
      lastOutcome: bustedSince ? "bust" : restoredRun.lastOutcome,
      openSeed: null,
      openCardId: null,
    }),
  };
}

/** The card the room plays for you when the window busts with nothing staged. */
export function getForcedCard(choices = [], schema = BASE_SCHEMA) {
  const playable = choices.filter((choice) => choice && choice.type !== "free");
  if (!playable.length) return null;
  const weight = (choice) => Math.abs(getCardBurn(choice, schema)?.value ?? 0);
  return playable.reduce((worst, choice) => (weight(choice) > weight(worst) ? choice : worst), playable[0]);
}

/**
 * The run's push record, rebuilt from the decision log so a resumed save and a
 * live run agree on it.
 */
export function createGauntletLedger(log = []) {
  let busts = 0;
  let cashes = 0;
  let bestMultiplier = 1;
  let potBanked = 0;
  let potLost = 0;
  let pushes = 0;
  for (const entry of log) {
    const threshold = entry?.threshold;
    if (!threshold) continue;
    if (threshold.busted) busts += 1;
    else cashes += 1;
    bestMultiplier = Math.max(bestMultiplier, Number(threshold.potMultiplier) || 1);
    potBanked += Number(threshold.pot) || 0;
    potLost += Number(threshold.lostPot) || 0;
    pushes += Number(threshold.pushes) || 0;
  }
  return { busts, cashes, bestMultiplier: round2(bestMultiplier), potBanked, potLost, pushes };
}

export function createRunSummary(run) {
  const state = normalizeRunState(run);
  return {
    windowIndex: state.windowIndex,
    runPot: state.runPot,
    vault: state.vault,
    streak: state.streak,
    busts: state.busts,
    cashes: state.cashes,
    bestMultiplier: state.bestMultiplier,
    lastOutcome: state.lastOutcome,
    lastGauge: Math.round(state.lastGauge),
    mutations: [...state.schema.mutations],
  };
}
