import { useEffect, useMemo, useRef, useState } from "react";
import { Crosshair, Flame, HeartPulse, Lock, RefreshCcw, Skull, Vault, Zap } from "lucide-react";
import { getTabToken, STORAGE_KEY } from "../appConfig.js";
import { getAuthorityGate } from "../gameLogic.js";
import {
  BASE_SCHEMA,
  buildNextSchema,
  describeMutations,
  drawStep,
  equipRelic,
  FEVER_BONUS,
  FOCUS_MAX,
  FOCUS_MODES,
  FRACTURE_MIN_BURN,
  GAUGE_MAX,
  getCardBurn,
  getCardChips,
  REFRAME_CARD_ID,
  getFocusBonus,
  getFocusModeProfile,
  getForcedCard,
  getGrooveBonus,
  getHeartbeatBpm,
  getMultiplier,
  getReadingSeconds,
  getRemainingSeconds,
  getSealedCardId,
  judgeBeat,
  scoreBeat,
  scoreFocus,
  SEAL_BREAK_GAUGE,
  SLIP_SECONDS,
  splitOpenSeed,
  getStanceMasteryProfile,
  STANCE_MASTERY_GOAL,
} from "./gauntletEngine.js";
import { useGauntletWindow } from "./useGauntletWindow.js";
import { GauntletFx } from "./GauntletFx.jsx";
import {
  playBeatCue,
  playBustCue,
  playCashCue,
  playFeverCue,
  playFocusCue,
  playMutationCue,
  playPushCue,
  playRelicDealCue,
  playRelicEquipCue,
  playRelicProcCue,
} from "./gauntletAudio.js";
import { hasRelic, RELICS } from "./relics.js";
import { RelicDraft, RelicIcon } from "./RelicDraft.jsx";
import { SceneBriefing } from "./SceneBriefing.jsx";
import { playTargetLockCue } from "../components/AdaptiveMusic.jsx";
import { ScenePlate } from "../components/ScenePlate.jsx";
import { SpeakerPortrait } from "../components/SpeakerPortrait.jsx";

const RESOLVE_DELAY_MS = { cashed: 760, bust: 1350 };
const GRADE_COPY = { perfect: "PERFECT", good: "GOOD", miss: `SLIP −${SLIP_SECONDS}s` };
const FOCUS_COPY = { perfect: "LOCK PERFECT", good: "LOCK", miss: "JAM" };
const GRADE_FLASH = { perfect: 0.9, good: 0.45, miss: 0.6 };
const GRADE_RANK = { miss: 0, good: 1, perfect: 2 };
const monotonicNow = () => globalThis.performance?.now?.() ?? 0;
// The stance profiles are written for the engine; the table speaks Korean.
const FOCUS_MODE_COPY = {
  strike: "판돈 배율 크게 · 헛박자 가혹",
  steady: "보상 작게 · 락마다 테이블 냉각",
  expose: "카드의 자원 효과 증폭",
};

/**
 * When the player pressed, not when the handler got to it. An input event's
 * timeStamp is on the same clock as the frame loop's beats, so a press made on
 * the beat while the main thread was busy -- a slow phone, a render in flight --
 * is still graded where the hand landed.
 */
function pressedAt(event) {
  const now = monotonicNow();
  const stamp = Number(event?.timeStamp);
  return Number.isFinite(stamp) && stamp > 0 && stamp <= now ? stamp : now;
}

function formatNumber(value) {
  return Math.round(Number(value) || 0).toLocaleString("en-US");
}

function formatMultiplier(value) {
  return value >= 10 ? `×${Math.round(value)}` : `×${value.toFixed(1)}`;
}

function describeEffect(effect = {}, resourceMeta = {}) {
  return Object.entries(effect)
    .filter(([, value]) => Number(value) !== 0)
    .map(([key, value]) => ({
      key,
      value: Number(value),
      label: resourceMeta[key]?.label ?? key,
    }))
    .sort((left, right) => Math.abs(right.value) - Math.abs(left.value));
}

function joinRules(items) {
  if (!items.length) return "기본 규칙";
  return items.map((item) => item.label).join(" / ");
}

function getRuleHeat({ mutations, schema }) {
  return Math.min(
    100,
    mutations.length * 24
      + (schema.faceDown ? 18 : 0)
      + (schema.sedated ? 14 : 0)
      + (schema.sealHighest ? 12 : 0)
      + (schema.fracturedAxis ? 16 : 0)
      + (schema.stepMin > BASE_SCHEMA.stepMin ? 16 : 0),
  );
}

function getRuleObjective(mutations) {
  if (!mutations.length) return "규칙 안정. 지금은 판돈과 벽만 읽으면 된다.";
  const labels = mutations.map((mutation) => mutation.label).join(" / ");
  return `${labels} 해제 조건: 사건 결과까지 살아남아 판돈을 금고로 넘겨라.`;
}

function getOverdriveCopy({ run, multiplier, cashMutations }) {
  const willOverdrive = cashMutations.some((mutation) => mutation.id === "overclock");
  if (willOverdrive) return { label: "OVERCLOCK READY", text: "지금 확정하면 다음 판은 칩 2배, 푸시 폭 증가", progress: 100 };
  if (run.streak > 0 && multiplier >= 4) return { label: "CHAIN LIVE", text: "한 번 더 x4+ 확정하면 오버클럭", progress: 75 };
  if (run.streak > 0) return { label: "CHAIN HELD", text: "이번 판도 x4 이상으로 확정해야 이어진다", progress: 50 };
  if (multiplier >= 4) return { label: "IGNITION", text: "확정하면 오버클럭 체인 1단계", progress: 35 };
  return { label: "DORMANT", text: "x4 이상 확정부터 체인이 켜진다", progress: 12 };
}

/**
 * The table. One hand, one gauge, two verbs.
 *
 * The screen answers three questions in one glance, in this order: what is in
 * the pot, how close is the wall, and which card is staked. Everything the
 * old board printed about a choice -- temptations, observer previews, target
 * locks, forecasts -- is gone; a card says what it pays and what it burns.
 */
export function GauntletStage({
  seed,
  run,
  cards,
  reframeChoice,
  resources,
  resourceMeta,
  clueCount,
  isAdvancing,
  revealOpen,
  onResolve,
  onTouch,
  onPickRelic,
  onSuspendable = null,
  staleSave = false,
  onReload,
  scene,
}) {
  const schema = run?.schema ?? BASE_SCHEMA;
  const mutations = useMemo(() => describeMutations(schema), [schema]);
  const tabToken = getTabToken();
  // Read once, at mount: a save that already names this window means a bet was
  // placed on it and never settled. If this tab placed it, this is a reload and
  // the bet settles as a bust at once. If another tab holds it, that tab may
  // still be playing: ask before this tab takes the window and busts the bet.
  const [hold] = useState(() => splitOpenSeed(run?.openSeed));
  // A window the player put down on purpose comes back as it stood, whichever
  // tab or device picks it up; see useWindowSuspension.
  const [resume] = useState(() => (run?.suspended?.seed === seed ? run.suspended.window : null));
  const abandoned = hold.seed === seed && !resume;
  const heldByOtherTab = abandoned && hold.token !== tabToken;
  const [claimed, setClaimed] = useState(!heldByOtherTab);
  // Another tab settled this window or took hold of it. This table stops: no
  // clock, no input, nothing to write over the other tab's result.
  const [lostToTab, setLostToTab] = useState(false);
  const relics = run?.relics ?? [];
  const relicOffer = run?.relicOffer ?? [];
  const wideBeat = hasRelic(relics, "metronome");
  // A closed case's draft takes the breach's place: REBOOT is what it replaces.
  const draftPending = relicOffer.length > 0 && Boolean(onPickRelic) && !abandoned;
  const [equipped, setEquipped] = useState(null);
  const [relicPulse, setRelicPulse] = useState(null);
  const [impact, setImpact] = useState(null);
  const [flash, setFlash] = useState(null);
  // Written by the frame loop on every beat; read here when a push is pressed.
  const beatClock = useRef({ at: 0, period: 0 });
  // The previous verdict is still on screen while the next table mounts under
  // it; the clock and the briefing wait until the player has read it.
  const locked = lostToTab || staleSave;
  const awaitingClaim = heldByOtherTab && !claimed;
  const hidden = isAdvancing || revealOpen || locked || awaitingClaim;
  const draftOpen = draftPending && !hidden;
  /**
   * The window opens on the briefing page, with the table's clock held.
   *
   * Reading used to cost clock: the scene's story sat in a folded briefing
   * while 45 seconds ran, and the score's own 사고 리듬 band asks for 8 to 28
   * seconds of *deciding*. So the story is told first, as a page of its own
   * (`SceneBriefing`) with a reading clock sized to its text, and the table's
   * 45 seconds start when that page closes -- by the player opening the table,
   * staking a card from the page, or the reading clock running out.
   *
   * Keyed by the window's seed, so a new table -- or a relic re-deal -- always
   * comes back to the briefing instead of inheriting the last one's state.
   */
  const [openedSeed, setOpenedSeed] = useState(null);
  const tableOpen = openedSeed === seed;
  const paused = hidden || draftOpen || !tableOpen;
  const [win, dispatch] = useGauntletWindow({ schema, seed, paused, abandoned, beatCombo: run?.beatCombo ?? 0, resume });
  const briefingOpen = !tableOpen && !hidden && !draftOpen && win.status === "live";
  const readSeconds = useMemo(() => getReadingSeconds({ ...scene.node, question: scene.question }), [scene.node, scene.question]);
  const resolvedRef = useRef(false);
  const touchedRef = useRef(undefined);

  const sealedId = useMemo(() => getSealedCardId(cards, schema), [cards, schema]);
  const sealBroken = win.gauge >= schema.sealBreak;
  const reframeSelected = win.selectedId === REFRAME_CARD_ID;
  const selectedCard = reframeSelected ? reframeChoice : cards.find((card) => card.id === win.selectedId) ?? null;
  const selectedChips = selectedCard ? getCardChips(selectedCard, schema) : 0;
  const multiplier = getMultiplier(win.gauge);
  const grooveBonus = getGrooveBonus(win.groove);
  const focusBonus = getFocusBonus(win.focus, win.focusMode);
  const focusModeProfile = getFocusModeProfile(win.focusMode);
  const stanceMastery = useMemo(() => getStanceMasteryProfile(run?.stanceMastery), [run?.stanceMastery]);
  const activeStanceCount = stanceMastery[win.focusMode] ?? 0;
  const livePot = Math.round(selectedChips * multiplier * grooveBonus * focusBonus.pot);
  const live = win.status === "live";
  const fever = live && grooveBonus >= FEVER_BONUS;
  const comboTier = win.beatCombo >= 12 ? "blaze" : win.beatCombo >= 6 ? "hot" : win.beatCombo >= 3 ? "warm" : "cold";
  const settleImpact = useMemo(
    () => (!live && claimed ? { amount: win.status === "bust" ? 1 : 0.35 } : null),
    [claimed, live, win.status],
  );
  const remaining = getRemainingSeconds(win);
  const tellWall = win.wall + (win.tellOffset ?? 0);
  const bpm = getHeartbeatBpm(win.gauge, tellWall, schema.sedated, win.elapsed / schema.seconds);
  const sealedLock = selectedCard && selectedCard.id === sealedId && !sealBroken;
  const canCash = live && !paused && Boolean(selectedCard) && !sealedLock;
  const canFocus = canCash && win.focus < FOCUS_MAX;
  const canPush = live && !paused && win.gauge < GAUGE_MAX;
  const nextLow = Math.min(GAUGE_MAX, win.gauge + schema.stepMin);
  const nextHigh = Math.min(GAUGE_MAX, win.gauge + schema.stepMax);
  const selectedBurn = selectedCard ? getCardBurn(selectedCard, schema) : null;
  const selectedEffects = selectedCard ? describeEffect(selectedCard.effect, resourceMeta) : [];
  const visibleEffects = selectedEffects.slice(0, 4);
  const hiddenEffectCount = Math.max(0, selectedEffects.length - visibleEffects.length);
  const nextPotLow = Math.round(selectedChips * getMultiplier(nextLow) * grooveBonus * focusBonus.pot);
  const nextPotHigh = Math.round(selectedChips * getMultiplier(nextHigh) * grooveBonus * focusBonus.pot);
  const fractureAxis = selectedBurn && Math.abs(selectedBurn.value) >= FRACTURE_MIN_BURN ? selectedBurn.key : null;
  const cashSchema = buildNextSchema({
    outcome: "cash",
    cause: "cash",
    gauge: win.gauge,
    pushes: win.pushes,
    streak: multiplier >= 4 ? run.streak + 1 : 0,
    burnAxis: fractureAxis,
    caseClosed: false,
    relics,
    focusMode: win.focusMode,
    focusCharge: win.focus,
    focusHits: win.focusHits,
    stanceMastery: run.stanceMastery,
  });
  const bustSchema = buildNextSchema({
    outcome: "bust",
    cause: "push",
    gauge: Math.max(win.gauge, schema.wallMin),
    pushes: win.pushes + 1,
    streak: 0,
    burnAxis: fractureAxis,
    caseClosed: false,
    relics,
  });
  const cashMutations = describeMutations(cashSchema);
  const bustMutations = describeMutations(bustSchema);
  // What a bust would leave of the case pot: nothing, or a third with INSURANCE unspent.
  const bustKeeps = hasRelic(relics, "insurance") && !run.insuranceSpent ? Math.floor(run.runPot / 3) : 0;
  const runTension = Math.min(100, run.busts * 24 + run.streak * 16 + Math.min(40, Math.log10(Math.max(1, run.runPot)) * 11));
  // REBOOT is the rules resetting, not a rule bending the board. The draft and
  // the reveal already say the case closed; a panel saying so again cost a
  // phone 92px of the table at every case's first window.
  const tableRules = mutations.filter((mutation) => mutation.id !== "reboot");
  const ruleHeat = getRuleHeat({ mutations: tableRules, schema });
  const ruleObjective = getRuleObjective(tableRules);
  const overclockedBoard = schema.mutations.includes("overclock");
  const overdrive = getOverdriveCopy({ run, multiplier, cashMutations });
  // The situation board is three one-line cells, so its copy is written to fit
  // one: on a phone it was three stacked rows and 142px of the table.
  const dangerLine = nextHigh >= schema.wallMin
    ? "다음 푸시가 벽 사정권"
    : `벽까지 최소 ${Math.max(0, Math.ceil(schema.wallMin - nextHigh))}`;
  const handSize = cards.length + (reframeChoice ? 1 : 0);
  const currentRules = mutations.length
    ? `${joinRules(mutations)} 적용 중`
    : schema.faceDown || schema.sedated || schema.sealHighest || schema.fracturedAxis
      ? "숨은 규칙 적용 중"
      : "규칙 안정";

  useEffect(() => {
    if (draftOpen) playRelicDealCue(relicOffer.length);
    // The deal plays once, when the draft first shows.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draftOpen]);

  useEffect(() => {
    if (briefingOpen && mutations.length > 0) playMutationCue(mutations.length);
    // The breach sounds once, when the briefing that carries it first shows.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [briefingOpen]);

  // A stake or a push is written to the save before anything can be won or lost
  // in this window, with the card staked. Reading alone is not a touch, so a
  // save and exit taken before the bet is placed resumes a fresh window.
  const touched = win.pushes > 0 || Boolean(win.selectedId);
  const touchedCardId = win.selectedId && win.selectedId !== REFRAME_CARD_ID ? win.selectedId : null;
  useEffect(() => {
    if (!touched || abandoned || win.status !== "live") return;
    if (touchedRef.current === touchedCardId) return;
    touchedRef.current = touchedCardId;
    onTouch?.(`${seed}#${tabToken}`, touchedCardId);
  }, [abandoned, onTouch, seed, tabToken, touched, touchedCardId, win.status]);

  // What the runtime saves if the player leaves now: a touched, live window.
  useEffect(() => {
    onSuspendable?.(touched && live && !abandoned && !locked ? { seed, window: win } : null);
  });
  useEffect(() => () => onSuspendable?.(null), [onSuspendable]);

  // Taking a held window is a write of its own, before the settle: the other
  // tab sees the hold change and locks rather than cashing into a window that
  // is about to be settled here.
  function claimHeldWindow() {
    onTouch?.(`${seed}#${tabToken}`, run?.openCardId ?? null);
    setClaimed(true);
  }

  useEffect(() => {
    if (abandoned) return undefined;
    const onStorage = (event) => {
      if (event.key !== STORAGE_KEY || !event.newValue) return;
      let saved;
      try {
        saved = JSON.parse(event.newValue)?.dynamics;
      } catch {
        return;
      }
      if (!saved) return;
      const hold = splitOpenSeed(saved.openSeed);
      const settledElsewhere = Number(saved.windowIndex) !== Number(run?.windowIndex);
      const heldElsewhere = hold.seed === seed && hold.token !== tabToken;
      if (settledElsewhere || heldElsewhere) setLostToTab(true);
    };
    globalThis.addEventListener("storage", onStorage);
    return () => globalThis.removeEventListener("storage", onStorage);
  }, [abandoned, run?.windowIndex, seed, tabToken]);

  // A closed window settles once, after the slam has had time to land.
  useEffect(() => {
    if (live || resolvedRef.current || !claimed) return undefined;
    if (win.status === "bust") {
      playBustCue();
    } else {
      playCashCue(multiplier, grooveBonus);
    }
    const savedStake = abandoned ? cards.find((card) => card.id === run?.openCardId) ?? null : null;
    const staked = selectedCard ?? savedStake;
    const card = staked ?? getForcedCard(cards, schema);
    const timer = globalThis.setTimeout(() => {
      if (resolvedRef.current) return;
      resolvedRef.current = true;
      onResolve({ card, window: win, forced: !staked });
    }, RESOLVE_DELAY_MS[win.status] ?? 900);
    return () => globalThis.clearTimeout(timer);
    // The window closing (or being claimed from another tab) is the only trigger;
    // the card and pot are read as they stood.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [live, claimed]);

  /**
   * Takes a drafted relic, or passes with null. The window on the table has not
   * been touched -- the draft holds the clock -- so it is re-dealt at once under
   * the rules the relic bends, from the same pure function the runtime saves.
   */
  function pickRelic(relicId) {
    if (!draftOpen) return;
    if (relicId) {
      dispatch({ type: "REDEAL", schema: equipRelic(run, relicId).schema });
      playRelicEquipCue();
      setEquipped((previous) => ({ id: relicId, n: (previous?.n ?? 0) + 1 }));
    }
    onPickRelic(relicId);
  }

  function pulseRelic(id) {
    playRelicProcCue();
    setRelicPulse((previous) => ({ id, n: (previous?.n ?? 0) + 1 }));
  }

  function isCardOpen(card) {
    return getAuthorityGate(card, { clueCount, trust: resources.trust, legitimacy: resources.legitimacy }).unlocked;
  }

  /** Closes the briefing and starts the clock, with a card already staked if one was picked there. */
  function openTable(cardId = null) {
    if (!briefingOpen) return;
    const card = cards.find((item) => item.id === cardId);
    if (card && !isCardOpen(card)) return;
    setOpenedSeed(seed);
    if (card || (cardId === REFRAME_CARD_ID && reframeChoice)) {
      playTargetLockCue();
      dispatch({ type: "SELECT", id: cardId });
    }
  }

  function select(id) {
    if (!tableOpen) return;
    if (!live || isAdvancing || locked || draftOpen) return;
    playTargetLockCue();
    dispatch({ type: "SELECT", id: win.selectedId === id ? null : id });
  }

  function setFocusMode(mode) {
    if (!live || locked || draftOpen) return;
    playTargetLockCue();
    dispatch({ type: "SET_FOCUS_MODE", mode });
  }

  function cycleFocusMode() {
    const index = FOCUS_MODES.indexOf(win.focusMode);
    setFocusMode(FOCUS_MODES[(index + 1) % FOCUS_MODES.length]);
  }

  function push(event) {
    if (locked || draftOpen || !canPush) return;
    // Graded against the beat the frame loop last landed. With no beat on
    // screen yet -- the first pulse not in -- the press is ungraded: no combo,
    // no slip.
    const clock = beatClock.current;
    const since = pressedAt(event) - clock.at;
    const grade = judgeBeat(since, clock.period, wideBeat);
    const pushIndex = win.pushes + 1;
    const scored = scoreBeat(win, grade);
    const nextGauge = win.gauge + drawStep(win.schema, win.seed, pushIndex);
    dispatch({ type: "PUSH", grade });
    if (wideBeat && grade && GRADE_RANK[grade] > GRADE_RANK[judgeBeat(since, clock.period) ?? "miss"]) pulseRelic("metronome");
    if (sealedId && schema.sealBreak < SEAL_BREAK_GAUGE && win.gauge < schema.sealBreak && nextGauge >= schema.sealBreak && nextGauge < SEAL_BREAK_GAUGE) {
      pulseRelic("lockpick");
    }
    playPushCue(pushIndex, Math.min(1, win.gauge / 90));
    playBeatCue(grade, scored.beatCombo);
    if (grooveBonus < FEVER_BONUS && getGrooveBonus(scored.groove) >= FEVER_BONUS) playFeverCue();
    setImpact({ amount: grade === "miss" ? 0.5 : 0.28 });
    if (grade) setFlash({ amount: GRADE_FLASH[grade] });
  }

  function focus(event) {
    if (!canFocus) return;
    const clock = beatClock.current;
    const since = pressedAt(event) - clock.at;
    const grade = judgeBeat(since, clock.period, wideBeat);
    const scored = scoreFocus(win, grade);
    dispatch({ type: "FOCUS", grade });
    if (wideBeat && grade && GRADE_RANK[grade] > GRADE_RANK[judgeBeat(since, clock.period) ?? "miss"]) pulseRelic("metronome");
    playFocusCue(grade, scored.focus / FOCUS_MAX);
    if (grade === "miss") {
      setImpact({ amount: 0.42 });
      setFlash({ amount: GRADE_FLASH.miss });
    } else if (grade) {
      setImpact({ amount: 0.16 });
      setFlash({ amount: grade === "perfect" ? 0.75 : 0.38 });
    }
  }

  function cash() {
    if (!canCash) return;
    dispatch({ type: "CASH", locked: sealedLock });
  }

  // Keys: 1-9 stake a card, E/Shift locks focus, Space pushes, Enter cashes.
  const keyActions = useRef({});
  useEffect(() => {
    keyActions.current = { select, focus, push, cash, cycleFocusMode, cards, reframeChoice, draftOpen, relicOffer, pickRelic, briefingOpen, tableOpen, openTable };
  });
  useEffect(() => {
    const onKey = (event) => {
      if (event.repeat || event.defaultPrevented) return;
      const target = event.target;
      if (target instanceof HTMLElement && target.matches("input, textarea, select, [contenteditable='true']")) return;
      if (document.querySelector(".decision-reveal-backdrop")) return;
      const actions = keyActions.current;
      if (actions.draftOpen) {
        // The draft is the decision on screen: 1-3 take a relic, Escape passes,
        // and nothing reaches the table behind it.
        const pick = event.key === "Escape" ? null : actions.relicOffer[Number(event.key) - 1];
        if (event.key === "Escape" || pick) {
          event.preventDefault();
          actions.pickRelic(pick ?? null);
        } else if (event.key === " " || event.key === "Enter") {
          event.preventDefault();
        }
        return;
      }
      // The briefing opens the table on the key that pushes -- whatever the
      // player's hand is already resting on -- and a card key opens it with
      // that card staked.
      if (actions.briefingOpen) {
        const index = Number(event.key) - 1;
        const cardId = actions.cards[index]?.id ?? (index === actions.cards.length && actions.reframeChoice ? REFRAME_CARD_ID : null);
        if (event.key === " " || event.key === "Enter" || event.key.toLowerCase() === "w" || cardId) {
          event.preventDefault();
          actions.openTable(cardId);
        }
        return;
      }
      if (!actions.tableOpen) return;
      if (event.key.toLowerCase() === "e" || event.key === "Shift") {
        event.preventDefault();
        actions.focus(event);
        return;
      }
      if (event.key.toLowerCase() === "q") {
        event.preventDefault();
        actions.cycleFocusMode();
        return;
      }
      if (event.key === " " || event.key.toLowerCase() === "w") {
        event.preventDefault();
        actions.push(event);
        return;
      }
      if (event.key === "Enter") {
        event.preventDefault();
        actions.cash();
        return;
      }
      const index = Number(event.key) - 1;
      if (!Number.isInteger(index) || index < 0) return;
      const card = actions.cards[index];
      if (card) {
        event.preventDefault();
        actions.select(card.id);
      } else if (index === actions.cards.length && actions.reframeChoice) {
        event.preventDefault();
        actions.select(REFRAME_CARD_ID);
      }
    };
    globalThis.addEventListener("keydown", onKey);
    return () => globalThis.removeEventListener("keydown", onKey);
  }, []);

  const bandLeft = (schema.wallMin / GAUGE_MAX) * 100;
  const bandWidth = ((schema.wallMax - schema.wallMin + 1) / GAUGE_MAX) * 100;
  const verdictClass = win.status === "bust" ? " is-bust" : win.status === "cashed" ? " is-cashed" : "";
  const heatTier = win.status === "bust" ? "bust" : win.gauge >= schema.wallMin ? "critical" : win.gauge >= schema.wallMin - schema.stepMax ? "hot" : "cold";

  return (
    <section
      className={`gauntlet-stage heat-${heatTier}${verdictClass}${schema.faceDown ? " is-face-down" : ""}${schema.sedated ? " is-sedated" : ""}${fever ? " is-fever" : ""}`}
      data-testid="gauntlet-stage"
      data-gauge={Math.round(win.gauge)}
      data-status={win.status}
      data-combo={win.beatCombo}
      data-groove={win.groove}
      data-last-grade={win.lastGrade ?? ""}
      aria-label="임계점 테이블"
    >
      <GauntletFx
        window={win}
        paused={paused}
        wideBeat={wideBeat}
        impact={settleImpact ?? impact}
        flash={flash}
        beatClock={beatClock}
        grade={win.lastGrade}
        fever={fever}
      />

      <div className="gx-table">
        {/* What the player reads before choosing. On a wide screen it is the left
            pane and the hand is the right one, so the table is as tall as the
            taller of the two rather than their sum. */}
        <div className="gx-read">
        <div className="gx-hud">
          <div className="gx-pot" aria-live="off">
            <span className="gx-label">POT</span>
            <strong className="gx-pot-value" data-testid="gauntlet-pot">
              {win.status === "bust" ? 0 : formatNumber(livePot)}
            </strong>
            <span className="gx-pot-math">
              <b className="gx-chips">{selectedChips || "—"}</b>
              <i>×</i>
              <b className="gx-mult" data-testid="gauntlet-multiplier">{formatMultiplier(multiplier)}</b>
              {grooveBonus > 1 && (
                <>
                  <i>×</i>
                  <b className="gx-groove" data-testid="gauntlet-groove">GROOVE {grooveBonus.toFixed(2)}</b>
                </>
              )}
            </span>
            {(win.beatCombo > 0 || win.groove > 0) && (
              <span
                key={`combo-${win.pushes}`}
                className={`gx-combo combo-${comboTier}${win.lastGrade === "miss" ? " is-broken" : ""}`}
                data-testid="gauntlet-combo"
                style={{ "--gx-combo": Math.min(win.beatCombo, 16) }}
              >
                <b>{win.beatCombo}</b>
                <small>{fever ? "FEVER" : "COMBO"}</small>
              </span>
            )}
          </div>
          <div className="gx-bank">
            <span className={`gx-stat${run.runPot > 0 ? " gx-at-risk" : ""}`}>
              <Flame size={13} aria-hidden="true" />
              <small>판돈</small>
              <b data-testid="gauntlet-run-pot">{win.status === "bust" ? formatNumber(bustKeeps) : formatNumber(run.runPot)}</b>
            </span>
            <span className="gx-stat">
              <Vault size={13} aria-hidden="true" />
              <small>금고</small>
              <b>{formatNumber(run.vault)}</b>
            </span>
            <span className="gx-stat gx-run-signal" data-testid="gauntlet-run-signal">
              <small>연승</small> <b>{run.streak}</b> <small>BUST</small> <b>{run.busts}</b> <small>최고</small> <b>{formatMultiplier(run.bestMultiplier || 1)}</b>
              <i aria-hidden="true"><em style={{ width: `${runTension}%` }} /></i>
            </span>
            {relics.length > 0 && (
              <span className="gx-relics" data-testid="gauntlet-relics" aria-label={`장착한 도구: ${relics.map((id) => RELICS[id].name).join(", ")}`}>
                {relics.map((id) => (
                  <b
                    key={relicPulse?.id === id ? `${id}-${relicPulse.n}` : id}
                    className={`gx-relic-chip relic-${id}${relicPulse?.id === id ? " is-proc" : ""}`}
                    title={`${RELICS[id].label} · ${RELICS[id].text}`}
                  >
                    <RelicIcon id={id} size={12} />
                    <span className="gx-relic-name">{RELICS[id].name}</span>
                  </b>
                ))}
              </span>
            )}
          </div>
          <div className="gx-signals">
            <span className={`gx-overdrive od-${overdrive.label.split(" ")[0].toLowerCase()}`} data-testid="gauntlet-overdrive">
              <b>{overdrive.label}</b> <span>{overdrive.text}</span>
              <i aria-hidden="true"><em style={{ width: `${overdrive.progress}%` }} /></i>
            </span>
            <span className={`gx-focus-signal focus-${focusBonus.tier}${win.jammed ? " is-jammed" : ""}`} data-testid="gauntlet-focus">
              <Crosshair size={13} aria-hidden="true" />
              <b>{focusBonus.label} {Math.round(win.focus)}</b>
              <small>판돈 {formatMultiplier(focusBonus.pot)} · 자원 {formatMultiplier(focusBonus.resource)}</small>
              <i aria-hidden="true"><em style={{ width: `${Math.round(win.focus)}%` }} /></i>
            </span>
          </div>
          <div
            className={`gx-clock${remaining <= 10 ? " is-late" : ""}`}
            role="timer"
            aria-label={`남은 시간 ${Math.ceil(remaining)}초`}
            style={{ "--gx-clock": Math.max(0, Math.min(1, remaining / schema.seconds)) }}
          >
            <b>{Math.ceil(remaining)}</b>
            <i style={{ width: `${(remaining / schema.seconds) * 100}%` }} />
          </div>
        </div>

        {(tableRules.length > 0 || ruleHeat > 0) && (
          <section className="gx-active-rules" data-testid="active-mutations" aria-label="현재 적용 중인 변형 규칙">
            <div>
              <span>ACTIVE RULESET</span>
              <b>{joinRules(tableRules)}</b>
              <small>{currentRules}</small>
            </div>
            <i aria-hidden="true"><em style={{ width: `${ruleHeat}%` }} /></i>
            <ul>
              {tableRules.slice(0, 3).map((mutation) => (
                <li key={mutation.id} className={`mut-${mutation.id}`}>
                  <strong>{mutation.label}</strong>
                  <small>{mutation.title}</small>
                </li>
              ))}
            </ul>
            <p data-testid="active-rule-objective">{ruleObjective}</p>
          </section>
        )}

        <div
          className="gx-gauge"
          role="meter"
          aria-label="열기 게이지"
          aria-valuemin={0}
          aria-valuemax={GAUGE_MAX}
          aria-valuenow={Math.round(win.gauge)}
          aria-valuetext={`열기 ${Math.round(win.gauge)}, 벽은 ${schema.wallMin}에서 ${schema.wallMax} 사이 어딘가`}
        >
          <div className="gx-gauge-track">
            <span className="gx-gauge-band" style={{ left: `${bandLeft}%`, width: `${bandWidth}%` }} />
            {live && (
              <span
                className="gx-gauge-next"
                style={{ left: `${nextLow}%`, width: `${Math.max(0.5, nextHigh - nextLow)}%` }}
              />
            )}
            <span className="gx-gauge-fill" style={{ width: `${win.gauge}%` }} />
            {win.status === "bust" && win.cause !== "abandon" && (
              <span className="gx-gauge-wall" style={{ left: `${win.wall}%` }} />
            )}
            <span className="gx-gauge-seal" style={{ left: `${schema.sealBreak}%` }} hidden={!sealedId} />
          </div>
          <div className="gx-gauge-read">
            <span>
              열기 <b data-testid="gauntlet-gauge">{Math.round(win.gauge)}</b>
            </span>
            <span className="gx-band-label">
              벽 {schema.wallMin}–{schema.wallMax}
            </span>
            <span className="gx-bpm">
              <HeartPulse size={14} aria-hidden="true" />
              <b>{schema.sedated ? "??" : bpm}</b>
            </span>
          </div>
        </div>

        <header className="gx-scene">
          {/* The room, behind the words about it. Absolutely positioned and
              faded, so it costs the table no height -- priority 27 is what that
              costs nothing for -- while still being the first thing a player
              sees. The readable copy of the same drawing is in the briefing. */}
          <ScenePlate node={scene.node} nodeId={scene.nodeId} variant="backdrop" />
          <SpeakerPortrait className="gx-portrait" name={scene.node.speaker} src={scene.speakerPortrait} size={44} />
          <div>
            {/* Where and when, before who. The season walks two buildings and six
                cases, and the route split plays the authored middle out of
                written order, so a scene that does not place itself leaves the
                player asking which room this is and how they got here. */}
            {(scene.node.place || scene.node.clock) && (
              <p className="gx-dateline">
                {scene.node.place && <span className="gx-dateline-place">{scene.node.place}</span>}
                {scene.node.clock && <span className="gx-dateline-clock">{scene.node.clock}</span>}
              </p>
            )}
            <p className="gx-speaker">
              <b>{scene.node.speaker}</b> · {scene.speakerRole}
            </p>
            <p className="gx-question">{scene.question}</p>
            {/* The briefing page told this story before the clock started; this
                folded copy is for looking something up while it runs. */}
            <details className="gx-brief">
              <summary>사건 브리핑</summary>
              {/* The room, before the words about it. Ten raster files cannot
                  cover 169 scenes, so the picture is drawn from the scene's own
                  `place` and `phase` rather than shipped as art. Inside the
                  closed briefing because priority 27 gives the table its height
                  budget and a picture in front of the cards would spend it. */}
              <ScenePlate node={scene.node} nodeId={scene.nodeId} />
              {scene.node.lead && <p className="gx-brief-lead">{scene.node.lead}</p>}
              <p>{scene.node.text}</p>
              {/* The case facts. Every scene has carried a `memo` since the graph
                  was written and none of them ever reached the DOM, so the
                  briefing explained the table and never the situation the cards
                  are answering. */}
              {scene.node.memo?.length > 0 && (
                <ul className="gx-brief-memo">
                  {scene.node.memo.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
              <ul>
                <li>현재 판돈: {formatNumber(run.runPot)}. BUST면 금고 밖 판돈은 사라진다.</li>
                <li>이번 판 규칙: {currentRules}.</li>
                <li>다음 푸시 예고: 열기 {Math.round(win.gauge)} → {Math.round(nextLow)}–{Math.round(nextHigh)}.</li>
              </ul>
            </details>
          </div>
        </header>

        <section className="gx-situation" aria-label="현재 상황판">
          <article className="gx-situation-card gx-situation-risk">
            <span>현재 위험</span>
            <b>{dangerLine}</b>
            <small>
              벽 {schema.wallMin}–{schema.wallMax} · 심박 <span className="gx-situation-bpm">{schema.sedated ? "교란" : bpm}</span>
            </small>
          </article>
          <article className="gx-situation-card">
            <span>확정하면</span>
            <b>{selectedCard ? `+${formatNumber(livePot)}` : "카드를 먼저"}</b>
            <small>다음: {joinRules(cashMutations)}</small>
          </article>
          <article className="gx-situation-card">
            <span>밀어붙이면</span>
            <b>{selectedCard ? `${formatNumber(nextPotLow)}–${formatNumber(nextPotHigh)}` : "배율만 상승"}</b>
            <small>
              실패 {formatNumber(run.runPot)}→{formatNumber(bustKeeps)} · {joinRules(bustMutations)}
            </small>
          </article>
        </section>
        <div
          className={`gx-focus-modes gx-stance-mastery mode-${win.focusMode}`}
          role="group"
          aria-label={`Focus mode · ${focusModeProfile.label} mastery ${activeStanceCount}/${STANCE_MASTERY_GOAL}`}
          data-testid="gauntlet-stance-mastery"
        >
          {FOCUS_MODES.map((mode) => {
            const profile = getFocusModeProfile(mode);
            const active = win.focusMode === mode;
            const count = stanceMastery[mode] ?? 0;
            const mastered = stanceMastery.mastered.includes(mode);
            return (
              <button
                key={mode}
                type="button"
                className={`mode-${mode}${active ? " active" : ""}${mastered ? " is-mastered" : ""}`}
                aria-pressed={active}
                onClick={() => setFocusMode(mode)}
              >
                <span>{profile.label}</span>
                <em title="시즌 숙련: 차지한 채로 확정한 판">{mastered ? "MASTER" : `${count}/${STANCE_MASTERY_GOAL}`}</em>
                <small>{FOCUS_MODE_COPY[mode] ?? profile.text}</small>
                <i aria-hidden="true"><b style={{ width: `${Math.min(100, (count / STANCE_MASTERY_GOAL) * 100)}%` }} /></i>
              </button>
            );
          })}
        </div>
        </div>

        <div className="gx-hand-head" aria-hidden="true">
          <span>HAND</span>
          <b>카드 {handSize}장</b>
          <small>
            <kbd>1</kbd>–<kbd>{handSize}</kbd> 걸기 · <kbd>Space</kbd> 밀기 · <kbd>E</kbd> 락 · <kbd>Enter</kbd> 확정
          </small>
        </div>

        <div className={`choices gx-hand hand-${handSize}`} data-hand={handSize} role="group" aria-label="카드">
          {cards.map((card, index) => {
            const gate = getAuthorityGate(card, { clueCount, trust: resources.trust, legitimacy: resources.legitimacy });
            const burn = getCardBurn(card, schema);
            const chips = getCardChips(card, schema);
            const selected = win.selectedId === card.id;
            const sealed = card.id === sealedId && !sealBroken;
            return (
              <button
                type="button"
                key={card.id}
                className={`choice gx-card${selected ? " selected" : ""}${sealed ? " is-sealed" : ""}${burn?.fractured ? " is-fractured" : ""}${gate.unlocked ? "" : " locked-choice"}`}
                aria-pressed={selected}
                aria-disabled={!gate.unlocked || !live || isAdvancing || !tableOpen ? "true" : undefined}
                aria-keyshortcuts={String(index + 1)}
                onClick={() => (gate.unlocked ? select(card.id) : null)}
              >
                <span className="gx-card-key" aria-hidden="true">{index + 1}</span>
                <span className="gx-card-label">{card.label}</span>
                <span className="gx-card-stats">
                  <b className="gx-card-chips">{schema.faceDown ? "▒▒" : `+${chips}`}</b>
                  <b className="gx-card-burn">
                    {schema.faceDown
                      ? "▒▒▒▒"
                      : burn
                        ? `${resourceMeta[burn.key]?.label ?? burn.key} ${burn.value > 0 ? "+" : ""}${burn.value}`
                        : "소모 없음"}
                    {burn?.fractured && !schema.faceDown && <Zap size={11} aria-label="균열 축" />}
                  </b>
                  {/* A board rule that touches every card is a badge in the stats
                      row, not a line of its own on every card: on an overclocked
                      board those lines made each card 25px taller. The rules panel
                      says what the rule is; the badge says which cards it bills. */}
                  {burn?.fractured && !schema.faceDown && (
                    <i className="gx-card-rule-tax" data-testid="fracture-tax" title={`균열: ${resourceMeta[burn.key]?.label ?? burn.key} 청구 ${schema.fractureRate}배`}>
                      {schema.fractureRate}x
                    </i>
                  )}
                  {overclockedBoard && !schema.faceDown && (
                    <i className="gx-card-overclock" data-testid="overclock-card-boost" title="오버클럭: 칩 2배, 푸시 폭 증가">
                      x2
                    </i>
                  )}
                </span>
                {/* The staked card carries its own detail. It used to be a strip
                    fixed over the bottom of the hand, which covered the last row
                    of cards the moment one was chosen. */}
                {selected && !schema.faceDown && (
                  <span className="gx-card-preview" aria-label="선택한 카드의 상세 영향">
                    {visibleEffects.map((effect) => (
                      <i key={effect.key} className={effect.value > 0 ? "gain" : "cost"}>
                        {effect.label} {effect.value > 0 ? "+" : ""}{effect.value}
                      </i>
                    ))}
                    {hiddenEffectCount > 0 && <i>외 {hiddenEffectCount}</i>}
                    {fractureAxis && (
                      <i className="gx-card-crack" data-testid="fracture-candidate">
                        균열 후보 · {resourceMeta[fractureAxis]?.label ?? fractureAxis}
                      </i>
                    )}
                  </span>
                )}
                {sealed && (
                  <span className="gx-card-seal" data-testid="sealed-card-lock">
                    <Lock size={12} aria-hidden="true" /> 최고 칩 봉인 {schema.sealBreak}
                  </span>
                )}
                {!gate.unlocked && <span className="gx-card-seal">LOCKED · {gate.reason}</span>}
              </button>
            );
          })}
          {reframeChoice && (
            <button
              type="button"
              className={`choice gx-card gx-card-wild${reframeSelected ? " selected" : ""}`}
              aria-pressed={reframeSelected}
              aria-disabled={!live || isAdvancing ? "true" : undefined}
              aria-keyshortcuts={String(cards.length + 1)}
              onClick={() => select(REFRAME_CARD_ID)}
            >
              <span className="gx-card-key" aria-hidden="true">{cards.length + 1}</span>
              <span className="gx-card-label">{reframeChoice.label}</span>
              <span className="gx-card-stats">
                <b className="gx-card-chips">WILD +{getCardChips(reframeChoice, schema)}</b>
                <b className="gx-card-burn">이 판을 다시 연다</b>
              </span>
            </button>
          )}
        </div>
      </div>

      <div className="gx-actions">
        <button
          type="button"
          className="gx-push"
          data-testid="commit-push"
          onClick={push}
          disabled={!canPush}
          aria-keyshortcuts="Space"
          aria-label={`밀어붙인다. 열기 ${Math.round(win.gauge)}, 다음 열기 ${nextLow}에서 ${nextHigh}. 심박에 맞춰 누르면 콤보가 쌓인다`}
        >
          <i className="gx-beat-ring" aria-hidden="true" />
          <Flame size={18} aria-hidden="true" />
          <span>밀어붙인다</span>
          <small>+{schema.stepMin}~{schema.stepMax}</small>
          {win.lastGrade && (
            <em key={`grade-${win.pushes}`} className={`gx-grade gx-grade-${win.lastGrade}`} aria-hidden="true">
              {GRADE_COPY[win.lastGrade]}
              {win.lastGrade !== "miss" && win.beatCombo > 1 ? ` ×${win.beatCombo}` : ""}
            </em>
          )}
        </button>
        <button
          type="button"
          className={`gx-focus focus-${focusBonus.tier}${win.jammed ? " is-jammed" : ""}`}
          data-testid="commit-focus"
          onClick={focus}
          disabled={!canFocus}
          aria-keyshortcuts="E Shift"
          aria-label={`Lock focus. Current focus ${Math.round(win.focus)}. Press on the beat to raise pot and resource multipliers.`}
        >
          <i className="gx-focus-reticle" aria-hidden="true" />
          <Crosshair size={18} aria-hidden="true" />
          <span>LOCK</span>
          <small>{focusModeProfile.label} {Math.round(win.focus)}</small>
          {win.lastFocusGrade && (
            <em key={`focus-${win.focusHits}-${win.focusMisses}`} className={`gx-grade gx-grade-${win.lastFocusGrade}`} aria-hidden="true">
              {FOCUS_COPY[win.lastFocusGrade]}
              {win.focusCombo > 1 && win.lastFocusGrade !== "miss" ? ` ×${win.focusCombo}` : ""}
            </em>
          )}
        </button>
        <button
          type="button"
          className="gx-cash commit-confirm"
          data-testid="commit-confirm"
          onClick={cash}
          disabled={!canCash}
          aria-keyshortcuts="Enter"
        >
          <span>{win.status === "bust" ? "BUST" : sealedLock ? "봉인됨" : selectedCard ? "확정" : "카드를 고른다"}</span>
          <b>{live && selectedCard && !sealedLock ? formatNumber(livePot) : ""}</b>
        </button>
      </div>

      {draftOpen && (
        <RelicDraft offer={relicOffer} owned={relics} onPick={pickRelic} onSkip={() => pickRelic(null)} />
      )}

      {equipped && (
        <div key={`equip-${equipped.n}`} className={`gx-equip-toast relic-${equipped.id}`} role="status" data-testid="relic-equipped">
          <RelicIcon id={equipped.id} size={18} />
          <span>장착</span>
          <b>{RELICS[equipped.id].label}</b>
        </div>
      )}

      {briefingOpen && (
        <SceneBriefing
          node={scene.node}
          nodeId={scene.nodeId}
          portrait={scene.speakerPortrait}
          speakerRole={scene.speakerRole}
          question={scene.question}
          readSeconds={readSeconds}
          tableSeconds={schema.seconds}
          cards={cards}
          reframeChoice={reframeChoice}
          isCardOpen={isCardOpen}
          sealedId={sealBroken ? null : sealedId}
          selectedId={win.selectedId}
          mutations={mutations}
          resourceMeta={resourceMeta}
          onOpen={openTable}
        />
      )}

      {locked && (win.status === "live" || awaitingClaim) && (
        <div className="gx-breach gx-lost-tab" role="alert" data-testid="table-lost-to-tab">
          <span className="gx-breach-kicker">이 판은 다른 탭에서 잡혔다</span>
          <p>한 판은 한 테이블에서만 걸 수 있다. 이 탭의 판은 멈췄다.</p>
          <button type="button" className="ghost" onClick={() => (onReload ? onReload() : globalThis.location.reload())}>
            <RefreshCcw size={14} aria-hidden="true" /> 다시 불러오기
          </button>
        </div>
      )}

      {awaitingClaim && (
        <div className="gx-breach gx-held-elsewhere" role="alertdialog" data-testid="table-held-elsewhere">
          <span className="gx-breach-kicker">이 판은 다른 탭에서 걸려 있다</span>
          <p>
            다른 탭(또는 이전 세션)에서 카드를 걸어 둔 판입니다. 여기서 이어가면 그 판은 떠난 판으로 BUST 처리됩니다.
            아직 그 탭에서 하는 중이면 그대로 두세요.
          </p>
          <div className="gx-held-actions">
            <button type="button" className="ghost" data-testid="claim-held-window" onClick={claimHeldWindow}>
              여기서 이어가기 · BUST 처리
            </button>
            <button type="button" className="ghost" data-testid="leave-held-window" onClick={() => setLostToTab(true)}>
              그 탭에 두기
            </button>
          </div>
        </div>
      )}

      {win.status !== "live" && claimed && (
        <div className={`gx-slam gx-slam-${win.status}`} role="alert">
          {win.status === "bust" ? (
            <>
              <Skull size={56} aria-hidden="true" />
              <strong>BUST</strong>
              <span>
                {win.cause === "timeout"
                  ? "시간이 먼저 끝났다"
                  : win.cause === "abandon"
                    ? "테이블을 떠났다"
                    : `벽은 ${win.wall}에 있었다`}{" "}
                · 판돈 {formatNumber(run.runPot)} → {formatNumber(bustKeeps)}
              </span>
            </>
          ) : (
            <>
              <strong>{formatMultiplier(multiplier)}</strong>
              <span>
                +{formatNumber(livePot)}
                {grooveBonus > 1 ? ` · GROOVE ×${grooveBonus.toFixed(2)} · COMBO ${win.beatCombo}` : ""}
              </span>
            </>
          )}
        </div>
      )}
    </section>
  );
}
