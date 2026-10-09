import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Crosshair, Flame, HeartPulse, Vault } from "lucide-react";
import { getTabToken, STORAGE_KEY } from "../appConfig.js";
import { getAuthorityGate } from "../gameLogic.js";
import {
  BASE_SCHEMA,
  createOpenSeed,
  drawStep,
  equipRelic,
  FEVER_BONUS,
  FOCUS_MAX,
  FOCUS_MODES,
  GAUGE_MAX,
  getCardChips,
  REFRAME_CARD_ID,
  getFocusBonus,
  getFocusModeProfile,
  getForcedCard,
  getGrooveBonus,
  getHandBonus,
  getHeartbeatBpm,
  getMultiplier,
  getRemainingSeconds,
  getSealedCardId,
  scoreBeat,
  scoreFocus,
  SEAL_BREAK_GAUGE,
  SLIP_SECONDS,
  splitOpenSeed,
  getStanceMasteryProfile,
} from "./gauntletEngine.js";
import { useGauntletWindow } from "./useGauntletWindow.js";
import { describeEffect, formatMultiplier, formatNumber, joinRules, useTableForecast } from "./tableReadout.js";
import { getStageRules } from "./tableStaging.js";
import { useTableKeys } from "./useTableKeys.js";
import { press } from "./timing.js";
import { GauntletFx } from "./GauntletFx.jsx";
import { GauntletHand } from "./GauntletHand.jsx";
import { RelicChips, TableGlossary, TableNotices } from "./TableNotices.jsx";
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
import { hasRelic } from "./relics.js";
import { RelicDraft } from "./RelicDraft.jsx";
import { SceneBriefing } from "./SceneBriefing.jsx";
import { StanceRow } from "./StanceRow.jsx";
import { playTargetLockCue } from "../components/AdaptiveMusic.jsx";
import { ScenePlate } from "../components/ScenePlate.jsx";
import { SpeakerPortrait } from "../components/SpeakerPortrait.jsx";

const RESOLVE_DELAY_MS = { cashed: 760, bust: 1350 };
const GRADE_COPY = { perfect: "PERFECT", good: "GOOD", miss: `SLIP −${SLIP_SECONDS}s` };
const FOCUS_COPY = { perfect: "LOCK PERFECT", good: "LOCK", miss: "JAM" };
const GRADE_FLASH = { perfect: 0.9, good: 0.45, miss: 0.6 };

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
  casesOpened = 0,
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
  // When a press last went down on a timed button -- the pointer, or the key
  // that will click it at keyup: the click is graded there.
  const pressDownAt = useRef(0);
  const notePress = (event) => {
    if (press.down(event)) pressDownAt.current = event.timeStamp;
  };
  const stageRef = useRef(null);
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
   * while 45 seconds ran, and the score's own 생각 리듬 band asks for 8 to 28
   * seconds of *deciding*. So the story is told first, as a page of its own
   * (`SceneBriefing`) with a reading clock sized to its text, and the table's
   * 45 seconds start when that page closes -- by the player opening the table,
   * staking a card from the page, or the reading clock running out.
   *
   * Keyed by the window's seed, so a new table -- or a relic re-deal -- always
   * comes back to the briefing instead of inheriting the last one's state.
   */
  const [openedSeed, setOpenedSeed] = useState(null);
  // The window the reading clock opened by itself, which is said aloud.
  const [clockOpenedSeed, setClockOpenedSeed] = useState(null);
  const tableOpen = openedSeed === seed;
  const paused = hidden || draftOpen || !tableOpen;
  const [win, dispatch] = useGauntletWindow({ schema, seed, paused, abandoned, closedAs: hold.closedAs, beatCombo: run?.beatCombo ?? 0, resume, caseId: scene.node.caseId, run });
  const briefingOpen = !tableOpen && !hidden && !draftOpen && win.status === "live";
  const resolvedRef = useRef(false);
  const touchedRef = useRef(undefined);
  const closedRef = useRef(false);

  const sealedId = useMemo(() => getSealedCardId(cards, schema), [cards, schema]);
  const sealBroken = win.gauge >= schema.sealBreak;
  const getGate = (card) => getAuthorityGate(card, { clueCount, trust: resources.trust, legitimacy: resources.legitimacy, casesOpened });
  const isCardOpen = (card) => getGate(card).unlocked;
  const reframeSelected = win.selectedId === REFRAME_CARD_ID;
  // A card the run has no authority for is not staked, whatever the window
  // says: a save written while the number keys could still stake one resumes
  // with it selected.
  const heldCard = cards.find((card) => card.id === win.selectedId) ?? null;
  const selectedCard = reframeSelected ? reframeChoice : heldCard && isCardOpen(heldCard) ? heldCard : null;
  const selectedChips = selectedCard ? getCardChips(selectedCard, schema) : 0;
  const multiplier = getMultiplier(win.gauge);
  const grooveBonus = getGrooveBonus(win.groove);
  const handBonus = getHandBonus(win.groove, win.focus, win.focusMode);
  const focusBonus = getFocusBonus(win.focus, win.focusMode);
  // What LOCK is adding to the pot, under the cap it shares with the groove.
  const lockPot = handBonus / grooveBonus;
  const focusModeProfile = getFocusModeProfile(win.focusMode);
  const stanceMastery = useMemo(() => getStanceMasteryProfile(run?.stanceMastery), [run?.stanceMastery]);
  const livePot = Math.round(selectedChips * multiplier * handBonus);
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
  // A stance cannot be changed on a closed or stopped table, and says so.
  const stanceBlocked = !live || locked;
  const selectedEffects = selectedCard ? describeEffect(selectedCard.effect, resourceMeta) : [];
  const visibleEffects = selectedEffects.slice(0, 4);
  const hiddenEffectCount = Math.max(0, selectedEffects.length - visibleEffects.length);
  const nextPotLow = Math.round(selectedChips * getMultiplier(nextLow) * handBonus);
  const nextPotHigh = Math.round(selectedChips * getMultiplier(nextHigh) * handBonus);
  const {
    mutations, tableRules, ruleHeat, ruleObjective, currentRules, fractureAxis,
    cashMutations, bustMutations, overdrive, bustKeeps, runTension, rules: dealtRules,
  } = useTableForecast({ schema, run, win, selectedCard, multiplier, caseId: scene.node.caseId });
  // What this case has turned on (`tableUnlocks`). A control whose rule is not
  // on yet is not drawn and its key is not the table's: no ring, no LOCK, no
  // stances. What the window or the run already holds is drawn whatever the
  // step: a combo, relics or a broken board carried in by an older save.
  const rules = getStageRules(scene.node.caseId, run, dealtRules);
  const beatOn = rules.has("beat");
  const lockOn = rules.has("lock");
  const stanceOn = rules.has("stance");
  const chainOn = rules.has("overclock");
  // The situation board is three one-line cells, so its copy is written to fit
  // one: on a phone it was three stacked rows and 142px of the table.
  const dangerLine = nextHigh >= schema.wallMin
    ? "다음 푸시가 벽 사정권"
    : `벽까지 최소 ${Math.max(0, Math.ceil(schema.wallMin - nextHigh))}`;
  const handSize = cards.length + (reframeChoice ? 1 : 0);
  const handBlocked = !live || isAdvancing || !tableOpen;
  // The folded briefing on the table draws its own copy of the plate; nothing
  // is drawn into it until the player opens it.
  const [briefOpen, setBriefOpen] = useState(false);

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
  const touchedCardId = selectedCard && !reframeSelected ? selectedCard.id : null;
  useEffect(() => {
    if (!touched || abandoned || win.status !== "live") return;
    if (touchedRef.current === touchedCardId) return;
    touchedRef.current = touchedCardId;
    onTouch?.(createOpenSeed(seed, tabToken), touchedCardId);
  }, [abandoned, onTouch, seed, tabToken, touched, touchedCardId, win.status]);

  // A bust is written before it is painted. The slam prints the wall, and the
  // verdict is not committed until the slam has landed: a window that closed on
  // its first touch -- the clock ran out on a table nobody had staked, or the
  // first push went straight into the wall -- had left no hold behind, so F5
  // under the slam dealt the same seed again with the wall known. A layout
  // effect runs before the browser paints, so by the time the wall is on screen
  // the save already says this window is closed, and how.
  useLayoutEffect(() => {
    if (abandoned || locked || win.status !== "bust" || closedRef.current) return;
    closedRef.current = true;
    onTouch?.(createOpenSeed(seed, tabToken, win.cause), touchedCardId);
  }, [abandoned, locked, onTouch, seed, tabToken, touchedCardId, win.cause, win.status]);

  // What the runtime saves if the player leaves now: a touched, live window.
  // A closed window still on its slam is `settling` -- it has a verdict the
  // runtime has not committed yet, so leaving is refused until it has.
  useEffect(() => {
    const settling = !live && claimed && !resolvedRef.current;
    onSuspendable?.(settling ? { settling: true } : touched && live && !abandoned && !locked ? { seed, window: win } : null);
  });
  useEffect(() => () => onSuspendable?.(null), [onSuspendable]);

  // Taking a held window is a write of its own, before the settle: the other
  // tab sees the hold change and locks rather than cashing into a window that
  // is about to be settled here.
  function claimHeldWindow() {
    onTouch?.(createOpenSeed(seed, tabToken, hold.closedAs), run?.openCardId ?? null);
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
    // The runtime refuses a card the run has no authority for unless the room
    // played it, and a refused window never settles. So a locked card is never
    // handed over as the player's: the room plays its own.
    const staked = selectedCard ?? (savedStake && isCardOpen(savedStake) ? savedStake : null);
    const card = staked ?? getForcedCard(cards, schema);
    const timer = globalThis.setTimeout(() => {
      if (resolvedRef.current) return;
      resolvedRef.current = true;
      onSuspendable?.(null);
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

  /** Closes the briefing and starts the clock, with a card already staked if one was picked there. */
  function openTable(cardId = null, byClock = false) {
    if (!briefingOpen) return;
    const card = cards.find((item) => item.id === cardId);
    if (card && !isCardOpen(card)) return;
    setOpenedSeed(seed);
    if (byClock) setClockOpenedSeed(seed);
    if (card || (cardId === REFRAME_CARD_ID && reframeChoice)) {
      playTargetLockCue();
      dispatch({ type: "SELECT", id: cardId });
    }
  }

  // One gate for the click and the key. The card's button checked the run's
  // authority and the number key did not, so pressing 3 staked the card that
  // read LOCKED -- and the window it closed could never be settled.
  function select(id) {
    if (handBlocked || locked || draftOpen) return;
    const card = cards.find((item) => item.id === id);
    if (card ? !isCardOpen(card) : !(id === REFRAME_CARD_ID && reframeChoice)) return;
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
    const { grade, widened } = press.grade(event, pressDownAt, beatClock.current, wideBeat);
    const pushIndex = win.pushes + 1;
    const scored = scoreBeat(win, grade);
    const nextGauge = win.gauge + drawStep(win.schema, win.seed, pushIndex);
    dispatch({ type: "PUSH", grade });
    if (widened) pulseRelic("metronome");
    if (sealedId && hasRelic(relics, "lockpick") && win.gauge < schema.sealBreak && nextGauge >= schema.sealBreak && nextGauge < SEAL_BREAK_GAUGE) {
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
    const { grade, widened } = press.grade(event, pressDownAt, beatClock.current, wideBeat);
    const scored = scoreFocus(win, grade);
    dispatch({ type: "FOCUS", grade });
    if (widened) pulseRelic("metronome");
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

  // The hook that owns the keys also says which of them a control may name.
  const { letterKeys, keys } = useTableKeys({ select, focus: lockOn ? focus : null, push, cash, cycleFocusMode: stanceOn ? cycleFocusMode : null, cards, reframeChoice, draftOpen, relicOffer, pickRelic, briefingOpen, tableOpen, openTable });

  const bandLeft = (schema.wallMin / GAUGE_MAX) * 100;
  const bandWidth = ((schema.wallMax - schema.wallMin + 1) / GAUGE_MAX) * 100;
  const verdictClass = win.status === "bust" ? " is-bust" : win.status === "cashed" ? " is-cashed" : "";
  const heatTier = win.status === "bust" ? "bust" : win.gauge >= schema.wallMin ? "critical" : win.gauge >= schema.wallMin - schema.stepMax ? "hot" : "cold";

  return (
    <section
      ref={stageRef}
      className={`gauntlet-stage heat-${heatTier}${verdictClass}${schema.faceDown ? " is-face-down" : ""}${schema.sedated ? " is-sedated" : ""}${fever ? " is-fever" : ""}`}
      data-testid="gauntlet-stage"
      data-gauge={Math.round(win.gauge)}
      data-status={win.status}
      data-combo={win.beatCombo}
      data-groove={win.groove}
      data-last-grade={win.lastGrade ?? ""}
      aria-label="임계점 테이블" style={{ "--gx-question": scene.question.length }}
    >
      <GauntletFx
        window={win}
        paused={paused}
        wideBeat={wideBeat}
        impact={settleImpact ?? impact}
        flash={flash}
        beatClock={beatClock}
        stageRef={stageRef}
        grade={win.lastGrade}
        fever={fever}
        beat={beatOn}
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
              <small>연승</small> <b>{run.streak}</b> <small lang="en">BUST</small> <b>{run.busts}</b> <small>최고</small> <b>{formatMultiplier(run.bestMultiplier || 1)}</b>
              <i aria-hidden="true"><em style={{ width: `${runTension}%` }} /></i>
            </span>
            <RelicChips relics={relics} pulse={relicPulse} />
          </div>
          {/* Rendered or not, never `hidden`: both signals set their own display,
              and the row's padding would stand over nothing. */}
          {(chainOn || lockOn) && (
          <div className="gx-signals">
            {chainOn && (
            <span className={`gx-overdrive od-${overdrive.label.split(" ")[0].toLowerCase()}`} data-testid="gauntlet-overdrive">
              <b>{overdrive.label}</b> <span>{overdrive.text}</span>
              <i aria-hidden="true"><em style={{ width: `${overdrive.progress}%` }} /></i>
            </span>
            )}
            {lockOn && (
            <span className={`gx-focus-signal focus-${focusBonus.tier}${win.jammed ? " is-jammed" : ""}`} data-testid="gauntlet-focus">
              <Crosshair size={13} aria-hidden="true" />
              <b>{focusBonus.label} {Math.round(win.focus)}</b>
              <small>판돈 {formatMultiplier(lockPot)} · 자원 {formatMultiplier(focusBonus.resource)}</small>
              <i aria-hidden="true"><em style={{ width: `${Math.round(win.focus)}%` }} /></i>
            </span>
            )}
          </div>
          )}
          <div
            className={`gx-clock${remaining <= 10 ? " is-late" : ""}`}
            role="timer"
            aria-label={`남은 시간 ${Math.ceil(remaining)}초`}
            style={{ "--gx-clock": Math.max(0, Math.min(1, remaining / schema.seconds)) }}
          >
            <b>{Math.ceil(remaining)}</b>
          </div>
        </div>

        {(tableRules.length > 0 || ruleHeat > 0) && (
          <section className="gx-active-rules" data-testid="active-mutations" aria-label="현재 적용 중인 변형 규칙">
            <div>
              <span lang="en">ACTIVE RULESET</span>
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

        <div className="gx-gauge">
          {/* The meter is the track, not the block: a meter's children are not read out. */}
          <div
            className="gx-gauge-track"
            role="meter"
            aria-label="열기 게이지"
            aria-valuemin={0}
            aria-valuemax={GAUGE_MAX}
            aria-valuenow={Math.round(win.gauge)}
            aria-valuetext={`열기 ${Math.round(win.gauge)}, 벽은 ${schema.wallMin}에서 ${schema.wallMax} 사이 어딘가`}
          >
            <span className="gx-gauge-band" style={{ left: `${bandLeft}%`, width: `${bandWidth}%` }} />
            {live && (
              <span
                className="gx-gauge-next"
                style={{ left: `${nextLow}%`, width: `${Math.max(0.5, nextHigh - nextLow)}%` }}
              />
            )}
            <span className="gx-gauge-fill" style={{ transform: `scaleX(${Math.min(1, win.gauge / GAUGE_MAX)})` }} />
            {/* The pulse without sound: lit by --gx-rate, a level that drifts and never blinks. */}
            <span className="gx-gauge-ticks" aria-hidden="true" />
            {win.status === "bust" && win.cause !== "abandon" && (
              <span className="gx-gauge-wall" style={{ left: `${win.wall}%` }} />
            )}
            <span className="gx-gauge-seal" style={{ left: `${schema.sealBreak}%` }} hidden={!sealedId} />
          </div>
          <div className="gx-gauge-read">
            {/* The meter says the first two. The pulse is named text and no live region: read when asked for. */}
            <span aria-hidden="true">
              열기 <b data-testid="gauntlet-gauge">{Math.round(win.gauge)}</b>
            </span>
            <span className="gx-band-label" aria-hidden="true">
              벽 {schema.wallMin}–{schema.wallMax}
            </span>
            <span className="gx-bpm" data-testid="gauntlet-bpm">
              <HeartPulse size={14} aria-hidden="true" />
              심박 <b>{schema.sedated ? "교란" : bpm}</b>
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
            <details className="gx-brief" onToggle={(event) => setBriefOpen(event.currentTarget.open)}>
              <summary>사건 브리핑</summary>
              {/* The room, before the words about it. Ten raster files cannot
                  cover 169 scenes, so the picture is drawn from the scene's own
                  `place` and `phase` rather than shipped as art. Inside the
                  closed briefing because priority 27 gives the table its height
                  budget and a picture in front of the cards would spend it. */}
              {briefOpen && <ScenePlate node={scene.node} nodeId={scene.nodeId} />}
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
                {briefOpen && <TableGlossary question={scene.question} cards={reframeChoice ? [...cards, reframeChoice] : cards} mutations={tableRules} relics={relics} stanceMastery={stanceOn ? stanceMastery : null} />}
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
        {stanceOn && <StanceRow mode={win.focusMode} mastery={stanceMastery} blocked={stanceBlocked} onPick={setFocusMode} />}
        </div>

        <div className="gx-hand-head" aria-hidden="true">
          <span lang="en">HAND</span>
          <b>카드 {handSize}장</b>
          {/* A key's piece ends on its separator, so the whole line is cut into the text it always was. */}
          <small>
            {letterKeys ? (
              <><kbd>1</kbd>–<kbd>{handSize}</kbd> 걸기 · <kbd>Space</kbd>/<kbd>W</kbd> 밀기 · {lockOn && <><kbd>E</kbd> 락 · </>}{stanceOn && <><kbd>Q</kbd> 자세 · </>}<kbd>Enter</kbd> 확정 · <kbd>P</kbd> 저장</>
            ) : (
              <><kbd>Space</kbd> 밀기 · <kbd>Enter</kbd> 확정</>
            )}
          </small>
        </div>

        <GauntletHand
          cards={cards}
          reframeChoice={reframeChoice}
          schema={schema}
          resourceMeta={resourceMeta}
          selectedId={reframeSelected ? REFRAME_CARD_ID : selectedCard?.id ?? null}
          sealedId={sealedId}
          sealBroken={sealBroken}
          blocked={handBlocked}
          isCardOpen={isCardOpen}
          getLockReason={(card) => getGate(card).reason}
          visibleEffects={visibleEffects}
          hiddenEffectCount={hiddenEffectCount}
          fractureAxis={fractureAxis}
          onSelect={select}
        />
      </div>

      {/* Every sheet lays the dock out in three columns; without LOCK it is two. */}
      <div className="gx-actions" style={lockOn ? undefined : { gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.2fr)" }}>
        <button
          type="button"
          className="gx-push"
          data-testid="commit-push"
          onPointerDown={notePress}
          onKeyDown={notePress}
          onClick={push}
          disabled={!canPush}
          aria-keyshortcuts={keys("Space W")}
          // The name stays put, as the reading clock's does: with the gauge in
          // it, the button a screen reader is resting on was a new button after
          // every push. The numbers are its description.
          aria-label="밀어붙인다"
          aria-describedby="gx-push-detail"
        >
          {beatOn && <i className="gx-beat-ring" aria-hidden="true" />}
          <Flame size={18} aria-hidden="true" />
          <span>밀어붙인다</span>
          <small>+{schema.stepMin}~{schema.stepMax}</small>
          <span id="gx-push-detail" className="sr-only">
            열기 {Math.round(win.gauge)}, 다음 열기 {Math.round(nextLow)}에서 {Math.round(nextHigh)}{beatOn ? ". 심박에 맞춰 누르면 콤보가 쌓인다" : ""}
          </span>
          {win.lastGrade && (
            <em key={`grade-${win.pushes}`} className={`gx-grade gx-grade-${win.lastGrade}`} aria-hidden="true">
              {GRADE_COPY[win.lastGrade]}
              {win.lastGrade !== "miss" && win.beatCombo > 1 ? ` ×${win.beatCombo}` : ""}
            </em>
          )}
        </button>
        {lockOn && (
        <button
          type="button"
          className={`gx-focus focus-${focusBonus.tier}${win.jammed ? " is-jammed" : ""}`}
          data-testid="commit-focus"
          onPointerDown={notePress}
          onKeyDown={notePress}
          onClick={focus}
          disabled={!canFocus}
          aria-keyshortcuts={keys("E")}
          aria-label="락을 건다"
          aria-describedby="gx-focus-detail"
        >
          <i className="gx-focus-reticle" aria-hidden="true" />
          <Crosshair size={18} aria-hidden="true" />
          <span lang="en">LOCK</span>
          <small>{focusModeProfile.label} {Math.round(win.focus)}</small>
          <span id="gx-focus-detail" className="sr-only">
            지금 차지 {Math.round(win.focus)}. 심박에 맞춰 누르면 판돈과 자원 배율이 오른다
          </span>
          {win.lastFocusGrade && (
            <em key={`focus-${win.focusHits}-${win.focusMisses}`} className={`gx-grade gx-grade-${win.lastFocusGrade}`} aria-hidden="true">
              {FOCUS_COPY[win.lastFocusGrade]}
              {win.focusCombo > 1 && win.lastFocusGrade !== "miss" ? ` ×${win.focusCombo}` : ""}
            </em>
          )}
        </button>
        )}
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

      {briefingOpen && (
        <SceneBriefing
          node={scene.node}
          nodeId={scene.nodeId}
          portrait={scene.speakerPortrait}
          speakerRole={scene.speakerRole}
          question={scene.question}
          run={run}
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

      <TableNotices
        equipped={equipped}
        tab={{ locked, awaitingClaim, live }}
        clock={{ live, paused, remaining, elapsed: win.elapsed, openedByClock: clockOpenedSeed === seed }}
        slam={win.status !== "live" && claimed ? { window: win, multiplier, livePot, grooveBonus, runPot: run.runPot, bustKeeps } : null}
        onReload={onReload}
        onClaim={claimHeldWindow}
        onLeave={() => setLostToTab(true)}
      />
    </section>
  );
}
