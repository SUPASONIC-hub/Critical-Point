import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Crosshair, Flame, HeartPulse, Vault } from "lucide-react";
import { getTabToken, STORAGE_KEY } from "../appConfig.js";
import { getAuthorityGate } from "../gameLogic.js";
import {
  createOpenSeed,
  drawStep,
  equipRelic,
  FOCUS_MAX,
  FOCUS_MODES,
  GAUGE_MAX,
  REFRAME_CARD_ID,
  getHandBonus,
  LOCK_CAP,
  lockpickOpensSeal,
  readRoomCards,
  scoreFocus,
  splitOpenSeed,
  STANCE_CHARGE,
  getStanceMasteryProfile,
  getTableSchema,
} from "./gauntletEngine.js";
import { useGauntletWindow } from "./useGauntletWindow.js";
import { isClosingScene } from "./holdConfirm.js";
import { useHoldConfirm } from "./useHoldConfirm.js";
import { describeEffect, formatMultiplier, formatNumber, joinRules, useTableForecast } from "./tableReadout.js";
import { readTableMeters } from "./tableMeters.js";
import { useTableKeys } from "./useTableKeys.js";
import { useTabTitle } from "../state/tabTitle.js";
import { listOfferedTypes } from "./logicStreak.js";
import { GAUGE_MARKS, LOCK_PRESS_SECONDS } from "./tableRules.js";
import { GauntletFx } from "./GauntletFx.jsx";
import { GauntletHand } from "./GauntletHand.jsx";
import { LogicLine, RelicChips, ScoutBand, TableGlossary, TableNotices } from "./TableNotices.jsx";
import {
  playBustCue,
  playCashCue,
  playFocusCue,
  playMutationCue,
  playPushCue,
  playRelicDealCue,
  playRelicEquipCue,
  playRelicProcCue,
} from "./gauntletAudio.js";
import { RelicDraft } from "./RelicDraft.jsx";
import { useActCard } from "./ActCardFold.jsx";
import { CaseFileStory, SceneBriefing } from "./SceneBriefing.jsx";
import { StanceRow } from "./StanceRow.jsx";
import { playTargetLockCue } from "../components/AdaptiveMusic.jsx";
import { useConfirmOpen } from "../state/confirmAction.js";
import { ComfortDialog, useComfortDialogOpen } from "../components/ComfortDialog.jsx";
import { ScenePlate } from "../components/ScenePlate.jsx";
import { SpeakerPortrait } from "../components/SpeakerPortrait.jsx";
import { prefetchScreenWhenIdle } from "../state/retryableLazy.js";
import { noteBriefing } from "../state/readingTally.js";
import tableCopy from "../copy/table.js";
import { fill } from "../locale.js";

const RESOLVE_DELAY_MS = { cashed: 760, bust: 1350 };
// C-9: the audit's 40 to HEAT DEBT's 60, where the audit counts: the wall band's box in green (no sheet had room for a rule).
const AUDIT_BAND_LOOK = { background: "rgb(156 203 180 / 0.14)", borderLeftColor: "var(--c-green-70)", boxShadow: "none" };
// The table's words (src/copy/table.js). Tab drafts (개선 포인트 A3): a cold table leaves the tab as index.html has it.
const { stage: say, keys: keyWords, tab: tabWords } = tableCopy;
const TAB_TITLES = { hot: () => tabWords.hot, critical: (gauge) => fill(tabWords.critical, { gauge }) };

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
  auditCount = 0,
  links = null,
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
  const schema = getTableSchema(run);
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
  // A closed case's draft takes the breach's place: REBOOT is what it replaces.
  const draftPending = relicOffer.length > 0 && Boolean(onPickRelic) && !abandoned;
  const [equipped, setEquipped] = useState(null);
  // The offered relic waiting for a slot: with the slots full, taking one asks what to put down.
  const [swapFor, setSwapFor] = useState(null);
  const [relicPulse, setRelicPulse] = useState(null);
  const [impact, setImpact] = useState(null);
  const [flash, setFlash] = useState(null);
  const stageRef = useRef(null);
  // The previous verdict is still on screen while the next table mounts under
  // it; the clock and the briefing wait until the player has read it.
  const locked = lostToTab || staleSave;
  const awaitingClaim = heldByOtherTab && !claimed;
  const hidden = isAdvancing || revealOpen || locked || awaitingClaim;
  // B-11(1): an act's first case opens on its title card, before the draft and the briefing.
  const act = useActCard({ scene, seed, windowIndex: run?.windowIndex, resumed: Boolean(resume) || abandoned, hidden });
  const draftOpen = draftPending && !hidden && !act.open;
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
  // The briefing's reading, which it reports and openTable notes (D-11, state/readingTally.js).
  const readingRef = useRef(null);
  const trackReading = (seconds, held) => {
    const page = (readingRef.current ??= { seconds: 0, held: false });
    page.seconds += seconds;
    if (held) page.held = true;
  };
  // The window the reading clock opened by itself, which is said aloud.
  const [clockOpenedSeed, setClockOpenedSeed] = useState(null);
  const tableOpen = openedSeed === seed;
  // A question (초기화 in the middle of play) holds the clock as the draft does.
  const asking = useConfirmOpen();
  // The comfort settings, opened from the play header, hold the clock as the
  // draft does: the table is covered, and nothing on it can be pressed.
  const comfortOpen = useComfortDialogOpen();
  const paused = hidden || draftOpen || !tableOpen || asking || comfortOpen;
  const [win, dispatch] = useGauntletWindow({ schema, seed, paused, abandoned, closedAs: hold.closedAs, resume, caseId: scene.node.caseId, run });
  const briefingOpen = !tableOpen && !hidden && !draftOpen && !act.open && win.status === "live";
  const resolvedRef = useRef(false);
  const touchedRef = useRef(undefined);
  const closedRef = useRef(false);

  const { sealedId, forcedCard } = useMemo(() => readRoomCards(cards, schema), [cards, schema]);
  const sealBroken = win.gauge >= schema.sealBreak;
  const getGate = (card) => getAuthorityGate(card, { clueCount, trust: resources.trust, legitimacy: resources.legitimacy, casesOpened });
  const isCardOpen = (card) => getGate(card).unlocked;
  const reframeSelected = win.selectedId === REFRAME_CARD_ID;
  // A card the run has no authority for is not staked, whatever the window
  // says: a save written while the number keys could still stake one resumes
  // with it selected.
  const heldCard = cards.find((card) => card.id === win.selectedId) ?? null;
  const selectedCard = reframeSelected ? reframeChoice : heldCard && isCardOpen(heldCard) ? heldCard : null;
  const {
    selectedChips, multiplier, focusBonus, remaining, bpm, nextLow, nextHigh, nextMultiplierLow, nextMultiplierHigh, dangerLine, belowRelief, band, audit, safe, auditBand,
  } = readTableMeters({ win, schema, selectedCard, run, audit: auditCount });
  const stanceMastery = useMemo(() => getStanceMasteryProfile(run?.stanceMastery), [run?.stanceMastery]);
  const live = win.status === "live";
  const settleImpact = useMemo(
    () => (!live && claimed ? { amount: win.status === "bust" ? 1 : 0.35 } : null),
    [claimed, live, win.status],
  );
  const sealedLock = selectedCard && selectedCard.id === sealedId && !sealBroken;
  const canCash = live && !paused && Boolean(selectedCard) && !sealedLock;
  const canFocus = canCash && win.focus < FOCUS_MAX;
  const canPush = live && !paused && win.gauge < GAUGE_MAX;
  // A stance cannot be changed on a closed or stopped table, and says so.
  const stanceBlocked = !live || locked;
  const selectedEffects = selectedCard ? describeEffect(selectedCard.effect, resourceMeta) : [];
  const visibleEffects = selectedEffects.slice(0, 4);
  const hiddenEffectCount = Math.max(0, selectedEffects.length - visibleEffects.length);
  // The types on the table, as the settlement will be handed them (useChoiceCommit).
  const standing = `${clueCount}:${resources.trust}:${resources.legitimacy}:${casesOpened}`;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const offered = useMemo(() => listOfferedTypes(scene.node.choices, isCardOpen), [scene.node, standing]);
  const {
    breach, tableRules, ruleHeat, ruleObjective, currentRules, fractureAxis,
    cashMutations, bustMutations, overdrive, bustKeeps, runTension, rules, logic, clockHeat,
  } = useTableForecast({ schema, run, win, selectedCard, multiplier, caseId: scene.node.caseId, offered });
  // What the hand adds to the pot: the logic streak as the staked card would
  // leave it (`logic`, nothing before the case has the rule), then LOCK on top
  // under the cap they share. The settlement pays the same two numbers.
  const earnedBonus = logic ? getHandBonus(win.groove, 0, win.focusMode, logic.after) : 1;
  const handBonus = getHandBonus(logic ? win.groove : 0, win.focus, win.focusMode, logic?.after);
  const lockPot = handBonus / earnedBonus;
  // At the cap a press adds nothing more to this hand's multiplier; what a
  // charge still pays is the resources and, with a stance, the next board.
  const lockCapped = handBonus >= LOCK_CAP;
  const livePot = Math.round(selectedChips * multiplier * handBonus);
  const nextPotLow = Math.round(selectedChips * nextMultiplierLow * handBonus);
  const nextPotHigh = Math.round(selectedChips * nextMultiplierHigh * handBonus);
  // What this case has turned on (`tableUnlocks`). A control whose rule is not
  // on yet is not drawn and its key is not the table's: no streak line, no
  // LOCK, no stances. What the run already holds is drawn whatever the step:
  // relics or a broken board carried in by an older save.
  const lockOn = rules.has("lock");
  const stanceOn = rules.has("stance");
  const chainOn = rules.has("overclock");
  const scoutOn = rules.has("scout");
  const canScout = scoutOn && live && !paused && !locked && !win.scouted;
  // A press of STEADY on a cold board cools nothing (`belowRelief`); the LOCK button says so.
  const steadyCold = lockOn && win.focusMode === "steady" && belowRelief;
  const handSize = cards.length + (reframeChoice ? 1 : 0);
  const handBlocked = !live || isAdvancing || !tableOpen;
  // The folded briefing on the table draws its own copy of the plate; nothing
  // is drawn into it until the player opens it.
  const [briefOpen, setBriefOpen] = useState(false);

  // The report's chunk, asked for while a table is up and the browser is idle,
  // so the case does not end on an empty page (state/retryableLazy.js).
  useEffect(() => prefetchScreenWhenIdle("result"), []);

  useEffect(() => {
    if (draftOpen) playRelicDealCue(relicOffer.length);
    // The deal plays once, when the draft first shows.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draftOpen]);

  useEffect(() => {
    if (briefingOpen && breach.length > 0) playMutationCue(breach.length);
    // The breach sounds once, when the briefing that carries it first shows.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [briefingOpen]);

  // A stake or a push is written to the save before anything can be won or lost
  // in this window, with the card staked. Reading alone is not a touch, so a
  // save and exit taken before the bet is placed resumes a fresh window. A
  // look is a touch: otherwise F5 hands back the clock SCOUT cost and the band
  // stays in the player's head.
  const touched = win.pushes > 0 || Boolean(win.selectedId) || win.scouted === true;
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
      playCashCue(multiplier, earnedBonus);
    }
    const savedStake = abandoned ? cards.find((card) => card.id === run?.openCardId) ?? null : null;
    // The runtime refuses a card the run has no authority for unless the room
    // played it, and a refused window never settles. So a locked card is never
    // handed over as the player's: the room plays its own.
    const staked = selectedCard ?? (savedStake && isCardOpen(savedStake) ? savedStake : null);
    const card = staked ?? forcedCard;
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
   * With the slots full the engine takes nothing until a relic is put down
   * (`dropId`), so the first answer only opens the swap step.
   */
  function pickRelic(relicId, dropId = null) {
    if (!draftOpen) return;
    if (relicId) {
      const next = equipRelic(run, relicId, dropId);
      if (next.relicOffer.length) {
        setSwapFor(relicId);
        return;
      }
      dispatch({ type: "REDEAL", schema: getTableSchema(next) });
      playRelicEquipCue();
      setEquipped((previous) => ({ id: relicId, n: (previous?.n ?? 0) + 1, dropped: dropId }));
    }
    setSwapFor(null);
    onPickRelic(relicId, dropId);
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
    // D-11: the page that just closed, as the case row will count it.
    noteBriefing({ caseId: scene.node.caseId, byClock, ...readingRef.current });
    readingRef.current = null;
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

  function push() {
    if (locked || draftOpen || !canPush) return;
    const pushIndex = win.pushes + 1;
    const nextGauge = win.gauge + drawStep(win.schema, win.seed, pushIndex);
    dispatch({ type: "PUSH" });
    if (sealedId && lockpickOpensSeal(relics, schema, win.gauge, nextGauge)) {
      pulseRelic("lockpick");
    }
    playPushCue(pushIndex, Math.min(1, win.gauge / 90));
    setImpact({ amount: 0.28 });
  }

  function pushToSafe() { // 안전선까지 (C-5): the pushes no wall can stop, at once, as the same PUSH events (tableAfterword.js readSafeLine).
    if (locked || draftOpen || !canPush || !safe.pushes) return;
    for (let n = 0; n < safe.pushes; n += 1) dispatch({ type: "PUSH" });
    if (sealedId && lockpickOpensSeal(relics, schema, win.gauge, safe.gauge)) pulseRelic("lockpick");
    playPushCue(win.pushes + safe.pushes, Math.min(1, win.gauge / 90));
    setImpact({ amount: 0.28 });
  }

  function focus() {
    if (!canFocus) return;
    dispatch({ type: "FOCUS" });
    playFocusCue(scoreFocus(win).focus / FOCUS_MAX);
    setImpact({ amount: 0.16 });
    setFlash({ amount: 0.38 });
  }

  function scout() {
    if (!canScout || draftOpen) return;
    playTargetLockCue();
    dispatch({ type: "SCOUT" });
  }

  function cash() {
    if (!canCash) return;
    dispatch({ type: "CASH", locked: sealedLock });
  }

  // The scene that closes the case is confirmed by a hold or a second press,
  // not a click (holdConfirm.js); every other table cashes as it always did.
  const holdsCash = isClosingScene(scene.node);
  const cashHold = useHoldConfirm({ enabled: holdsCash && canCash, resetKey: selectedCard?.id, onConfirm: cash });
  // Short enough for the dock's 108px on a 360px phone; the full sentence is the button's description.
  const cashLabel = win.status === "bust" ? "BUST" : sealedLock ? say.sealed : !selectedCard ? say.pickCard : !holdsCash ? say.commit : cashHold.phase === "armed" ? say.oneMore : say.holdToCommit;

  // The hook that owns the keys also says which of them a control may name.
  const { letterKeys, keys, drawn } = useTableKeys({
    select, focus: lockOn ? focus : null, push, safe: pushToSafe, cash, cashHold: holdsCash && canCash ? cashHold : null,
    cycleFocusMode: stanceOn ? cycleFocusMode : null, scout: scoutOn ? scout : null,
    cards, reframeChoice, draftOpen, relicOffer, pickRelic, swapFor, relics, cancelSwap: () => setSwapFor(null),
    briefingOpen, tableOpen, openTable,
  });

  const bandLeft = (band.wallMin / GAUGE_MAX) * 100;
  const bandWidth = ((band.wallMax - band.wallMin + 1) / GAUGE_MAX) * 100;
  const verdictClass = win.status === "bust" ? " is-bust" : win.status === "cashed" ? " is-cashed" : "";
  const heatTier = win.status === "bust" ? "bust" : win.gauge >= band.wallMin ? "critical" : win.gauge >= band.wallMin - schema.stepMax ? "hot" : "cold";
  // The tab says what the table shows (tabTitle.js): never the hidden wall. A
  // bust stays on it until the next table opens; the briefing leaves it be.
  const busted = win.status === "bust" && win.cause !== "abandon";
  const tabTitle = busted ? tabWords.bust : !tableOpen ? undefined : !live ? null : TAB_TITLES[heatTier]?.(Math.round(win.gauge)) ?? null;
  useTabTitle("table", tabTitle, { rank: 1, keep: busted });

  return (
    <section
      ref={stageRef}
      className={`gauntlet-stage heat-${heatTier}${verdictClass}${schema.faceDown ? " is-face-down" : ""}${schema.sedated ? " is-sedated" : ""}`}
      data-testid="gauntlet-stage"
      data-gauge={Math.round(win.gauge)}
      data-status={win.status}
      aria-label={say.label} style={{ "--gx-question": scene.question.length }}
    >
      <GauntletFx
        window={win}
        paused={paused}
        impact={settleImpact ?? impact}
        flash={flash}
        stageRef={stageRef}
        caseId={scene.node.caseId}
      />

      <div className="gx-table">
        {/* What the player reads before choosing. On a wide screen it is the left
            pane and the hand is the right one, so the table is as tall as the
            taller of the two rather than their sum. */}
        <div className="gx-read">
        <div className="gx-hud">
          <div className="gx-pot" aria-live="off">
            <span className="gx-label">{say.pot}</span>
            <strong className="gx-pot-value" data-testid="gauntlet-pot">
              {win.status === "bust" ? 0 : formatNumber(livePot)}
            </strong>
            <span className="gx-pot-math">
              <b className="gx-chips">{selectedChips || "—"}</b>
              <i>×</i>
              <b className="gx-mult" data-testid="gauntlet-multiplier">{formatMultiplier(multiplier)}</b>
              {earnedBonus > 1 && (
                <>
                  <i>×</i>
                  <b className="gx-logic-pill" data-testid="gauntlet-logic-bonus">{say.combo} {earnedBonus.toFixed(2)}</b>
                </>
              )}
            </span>
          </div>
          <div className="gx-bank">
            <span className={`gx-stat${run.runPot > 0 ? " gx-at-risk" : ""}`}>
              <Flame size={13} aria-hidden="true" />
              <small>{say.runPot}</small>
              <b data-testid="gauntlet-run-pot">{win.status === "bust" ? formatNumber(bustKeeps) : formatNumber(run.runPot)}</b>
            </span>
            <span className="gx-stat">
              <Vault size={13} aria-hidden="true" />
              <small>{say.vault}</small>
              <b>{formatNumber(run.vault)}</b>
            </span>
            <span className="gx-stat gx-run-signal" data-testid="gauntlet-run-signal">
              {chainOn && <><small>{say.streak}</small> <b>{run.streak}</b> </>}<small lang="en">BUST</small> <b>{run.busts}</b> <small>{say.best}</small> <b>{formatMultiplier(run.bestMultiplier || 1)}</b>
              {audit && <> <span className={audit.atRisk ? "gx-at-risk" : undefined} data-testid="gauntlet-audit"><small>{say.audit}</small> <b>{audit.count}/{audit.limit}</b></span></>}
              {links?.live > 0 && <> <span className={links.atRisk ? "gx-at-risk" : undefined} data-testid="gauntlet-links"><small>{say.links}</small> <b>{links.live}</b></span></>}
              <i aria-hidden="true"><em style={{ width: `${runTension}%` }} /></i>
            </span>
            <RelicChips relics={relics} pulse={relicPulse} />
          </div>
          {/* Rendered or not, never `hidden`: both signals set their own display,
              and the row's padding would stand over nothing. */}
          {(chainOn || lockOn || logic) && (
          <div className="gx-signals">
            {chainOn && (
            <span className={`gx-overdrive od-${overdrive.id}`} data-testid="gauntlet-overdrive">
              <b>{overdrive.label}</b> <span>{overdrive.text}</span>
              <i aria-hidden="true"><em style={{ width: `${overdrive.progress}%` }} /></i>
            </span>
            )}
            {lockOn && (
            <span className={`gx-focus-signal focus-${focusBonus.tier}`} data-testid="gauntlet-focus">
              <Crosshair size={13} aria-hidden="true" />
              <b lang="en">{focusBonus.label} {Math.round(win.focus)}</b>
              <small>{lockCapped ? say.lockCap : say.lockMultiplier} {formatMultiplier(lockPot)} · {say.lockResource} {formatMultiplier(focusBonus.resource)}</small>
              <i aria-hidden="true"><em style={{ width: `${Math.round(win.focus)}%` }} /></i>
            </span>
            )}
            {logic && <LogicLine logic={logic} />}
          </div>
          )}
          <div
            className={`gx-clock${remaining <= 10 ? " is-late" : ""}`}
            role="timer"
            aria-label={fill(say.clock, { seconds: Math.ceil(remaining) })}
            style={{ "--gx-clock": Math.max(0, Math.min(1, remaining / schema.seconds)) }}
          >
            <b>{Math.ceil(remaining)}</b>
          </div>
        </div>

        {(tableRules.length > 0 || ruleHeat > 0) && (
          <section className="gx-active-rules" data-testid="active-mutations" aria-label={say.rulesLabel}>
            <div>
              <span>{say.rulesHead}</span>
              <b>{joinRules(tableRules)}</b>
              <small>{currentRules}</small>
            </div>
            <i aria-hidden="true"><em style={{ width: `${ruleHeat}%` }} /></i>
            <ul>
              {tableRules.slice(0, 3).map((mutation) => (
                <li key={mutation.id} className={`mut-${mutation.id}`}>
                  <strong lang="en">{mutation.label}</strong>
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
            aria-label={say.gaugeLabel}
            aria-valuemin={0}
            aria-valuemax={GAUGE_MAX}
            aria-valuenow={Math.round(win.gauge)}
            aria-valuetext={fill(say.gaugeText, { gauge: Math.round(win.gauge), scouted: band.scouted ? say.gaugeScouted : "", min: band.wallMin, max: band.wallMax })}
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
            {/* The two heats the rules read: a window closed at 30 or 60 has risen a tier for the streak, and 60 is HEAT DEBT's. */}
            {logic && GAUGE_MARKS.map((at) => (
              <span key={at} className="gx-gauge-mark" data-testid="gauge-mark" style={{ left: `${at}%` }} />
            ))}
            {auditBand && <span className="gx-gauge-band" data-testid="gauge-audit" style={{ left: `${auditBand[0]}%`, width: `${auditBand[1] - auditBand[0]}%`, ...AUDIT_BAND_LOOK }} />}
            {win.status === "bust" && win.cause !== "abandon" && (
              <span className="gx-gauge-wall" style={{ left: `${win.wall}%` }} />
            )}
            <span className="gx-gauge-seal" style={{ left: `${schema.sealBreak}%` }} hidden={!sealedId} />
          </div>
          <div className="gx-gauge-read">
            {/* The meter says the first two. The pulse is named text and no live region: read when asked for. */}
            <span aria-hidden="true">
              {say.heat} <b data-testid="gauntlet-gauge">{Math.round(win.gauge)}</b>
            </span>
            <ScoutBand band={band} canScout={canScout} onScout={scout} shortcut={canScout ? keys("R") : undefined} />
            {canPush && !win.pushes && safe.pushes > 0 && <button type="button" className="gx-scout" data-testid="commit-safe" onClick={pushToSafe} aria-keyshortcuts={keys("S")}
              aria-label={fill(say.safeLabel, { count: safe.pushes, gauge: Math.round(safe.gauge) })}>{fill(say.safe, { count: safe.pushes })}</button>}
            {/* Each push makes the clock heat the gauge faster; said once it is.
                In this one-line row and before the pulse, so it moves nothing:
                in the bank rail it wrapped to a second line at 360px. */}
            {live && clockHeat && (
              <span data-testid="gauntlet-clock-heat">
                <span className="sr-only">{clockHeat.spoken}</span>
                <span aria-hidden="true">{say.clockHeat} <b>{clockHeat.text}</b></span>
              </span>
            )}
            <span className="gx-bpm" data-testid="gauntlet-bpm">
              <HeartPulse size={14} aria-hidden="true" />
              {say.bpm} <b>{schema.sedated ? say.sedated : bpm}</b>
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
              <b>{scene.node.speakerName ?? scene.node.speaker}</b> · {scene.speakerRole}
            </p>
            <p className="gx-question">{scene.question}</p>
            {/* The briefing page told this story before the clock started; this
                folded copy is for looking something up while it runs. */}
            <details className="gx-brief" onToggle={(event) => setBriefOpen(event.currentTarget.open)}>
              <summary>{say.caseFile}</summary>
              {/* The six numbers and the clue count a locked card states its condition in; the HUD prints none of them. */}
              {/* The standing, the room, the story and its facts: CaseFileStory
                  in SceneBriefing.jsx, which says why each is here. */}
              <CaseFileStory node={scene.node} nodeId={scene.nodeId} open={briefOpen} standing={[resources, resourceMeta, clueCount]} caseCast={scene.caseCast} />
              <ul>
                {scene.challenge && <li data-testid="brief-challenge">{fill(say.briefChallenge, { challenge: scene.challenge })}</li>}
                <li>{fill(say.briefPot, { pot: formatNumber(run.runPot) })}</li>
                <li>{fill(say.briefRules, { rules: currentRules })}</li>
                <li>{fill(say.briefNext, { gauge: Math.round(win.gauge), low: Math.round(nextLow), high: Math.round(nextHigh) })}</li>
                {briefOpen && <TableGlossary question={scene.question} cards={reframeChoice ? [...cards, reframeChoice] : cards} mutations={tableRules} relics={relics} stanceMastery={stanceOn ? stanceMastery : null} />}
              </ul>
            </details>
          </div>
        </header>

        <section className="gx-situation" aria-label={say.situationLabel}>
          <article className="gx-situation-card gx-situation-risk">
            <span>{say.risk}</span>
            <b>{dangerLine}</b>
            <small>
              {fill(say.wallRange, { min: band.wallMin, max: band.wallMax })} · {say.bpm} <span className="gx-situation-bpm">{schema.sedated ? say.sedated : bpm}</span>
            </small>
          </article>
          <article className="gx-situation-card">
            <span>{say.ifCommit}</span>
            <b>{selectedCard ? `+${formatNumber(livePot)}` : say.pickFirst}</b>
            <small>{fill(say.nextRules, { rules: joinRules(cashMutations) })}</small>
          </article>
          <article className="gx-situation-card">
            <span>{say.ifPush}</span>
            <b>{selectedCard ? `${formatNumber(nextPotLow)}–${formatNumber(nextPotHigh)}` : say.multiplierOnly}</b>
            <small>
              {say.fail} {formatNumber(run.runPot)}→{formatNumber(bustKeeps)} · {joinRules(bustMutations)}
            </small>
          </article>
        </section>
        {stanceOn && <StanceRow mode={win.focusMode} mastery={stanceMastery} blocked={stanceBlocked} onPick={setFocusMode} />}
        </div>

        <div className="gx-hand-head" aria-hidden="true">
          <span lang="en">HAND</span>
          <b>{fill(say.handCount, { count: handSize })}</b>
          {/* A key's piece ends on its separator, so the whole line is cut into the text it always was. A touch screen wide enough to show the line has no key to name, and gets none. */}
          <small>
            {letterKeys ? (
              <><kbd>1</kbd>–<kbd>{handSize}</kbd> {keyWords.stake} · <kbd>Space</kbd>/<kbd>W</kbd> {keyWords.push} · {lockOn && <><kbd>E</kbd> LOCK · </>}
                {stanceOn && <><kbd>Q</kbd> {keyWords.stance} · </>}{scoutOn && <><kbd>R</kbd> {keyWords.scout} · </>}<kbd>Enter</kbd> {keyWords.commit} · <kbd>P</kbd> {keyWords.save}</>
            ) : drawn && (
              <><kbd>Space</kbd> {keyWords.push} · <kbd>Enter</kbd> {keyWords.commit}</>
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
          linkBurn={schema.mutations.includes("blackout") ? null : links?.burn}
          moveOf={logic?.moveOf} past={scene.echo?.picked}
          onSelect={select}
        />
      </div>

      {/* Every sheet lays the dock out in three columns; without LOCK it is two. */}
      <div className="gx-actions" style={lockOn ? undefined : { gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.2fr)" }}>
        <button
          type="button"
          className="gx-push"
          data-testid="commit-push"
          onClick={push}
          disabled={!canPush}
          aria-keyshortcuts={keys("Space W")}
          // The name stays put, as the reading clock's does: with the gauge in
          // it, the button a screen reader is resting on was a new button after
          // every push. The numbers are its description. The name starts with
          // what the button shows, the step range too, so a voice command that
          // reads the button out finds it (WCAG 2.5.3); the range holds for the scene.
          aria-label={`${say.push} +${schema.stepMin}~${schema.stepMax}`}
          aria-describedby={logic ? "gx-push-detail gx-logic-detail" : "gx-push-detail"}
        >
          <Flame size={18} aria-hidden="true" />
          <span>{say.push}</span>
          <small>+{schema.stepMin}~{schema.stepMax}</small>
          <span id="gx-push-detail" className="sr-only">{fill(say.pushDetail, { gauge: Math.round(win.gauge), low: Math.round(nextLow), high: Math.round(nextHigh) })}</span>
          {/* What the streak stands at, for the two buttons that act on it. */}
          {logic && <span id="gx-logic-detail" className="sr-only">{logic.spoken}</span>}
        </button>
        {lockOn && (
        <button
          type="button"
          className={`gx-focus focus-${focusBonus.tier}`}
          data-testid="commit-focus"
          onClick={focus}
          disabled={!canFocus}
          aria-keyshortcuts={keys("E")}
          // The name is what the button shows, charge and price included (WCAG
          // 2.5.3): it changes when a press changes the charge, not on a clock.
          aria-label={`LOCK ${lockCapped ? say.lockCapped : Math.round(win.focus)} · ${fill(say.lockPrice, { seconds: LOCK_PRESS_SECONDS })}`}
          aria-describedby={steadyCold ? "gx-focus-detail gx-steady-cold" : "gx-focus-detail"}
        >
          {steadyCold && <span id="gx-steady-cold" className="sr-only">{say.steadyCold}</span>}
          <Crosshair size={18} aria-hidden="true" />
          {/* The space keeps LOCK and the charge two words to whoever reads the
              text; in the flex row a space between items is not drawn. */}
          <span lang="en">LOCK</span>{" "}
          {/* What a press costs is on the button: the clock is the only price.
              The stance is not named here: the HUD's signal beside the streak
              prints it with the same charge, and with it the line was 94 to
              112px in a button with 82px of room at 390px (74px at 360px). */}
          {/* At the cap the press still charges the resources, the stance and STEADY's cooling, so it still costs the clock (C-6): the price stays in the name. */}
          <small>{lockCapped ? say.lockCapped : <>{Math.round(win.focus)} · {fill(say.lockPrice, { seconds: LOCK_PRESS_SECONDS })}</>}</small>
          <span id="gx-focus-detail" className="sr-only">
            {fill(say.lockDetail, { charge: Math.round(win.focus), seconds: LOCK_PRESS_SECONDS })} {fill(lockCapped ? say.lockAtCap : say.lockUnderCap, { cap: LOCK_CAP })}
            {stanceOn && fill(say.lockStance, { charge: STANCE_CHARGE })}
          </span>
        </button>
        )}
        <button
          type="button"
          className={`gx-cash commit-confirm${cashHold.phase === "holding" ? " is-holding" : ""}`}
          data-testid="commit-confirm"
          data-hold={holdsCash ? cashHold.phase : undefined}
          {...(holdsCash ? cashHold.buttonProps : { onClick: cash })}
          disabled={!canCash}
          aria-keyshortcuts="Enter"
          aria-describedby={[holdsCash && "gx-cash-hold", logic && "gx-logic-detail", audit && "gx-audit-detail"].filter(Boolean).join(" ") || undefined}
        >
          <span>{cashLabel}</span>
          <b>{live && selectedCard && !sealedLock ? formatNumber(livePot) : ""}</b>
        </button>
        {/* Outside the button, so neither is read into its name. The second is
            what a press that did not hold says: one more confirms. */}
        {holdsCash && <span id="gx-cash-hold" className="sr-only">{say.holdHelp}</span>}
        {audit && <span id="gx-audit-detail" className="sr-only">{audit.spoken}</span>}
      </div>

      {act.card}
      {draftOpen && (
        <RelicDraft offer={relicOffer} owned={relics} swapFor={swapFor} onPick={pickRelic} onBack={() => setSwapFor(null)} onSkip={() => pickRelic(null)} />
      )}

      {briefingOpen && (
        <SceneBriefing
          node={scene.node}
          nodeId={scene.nodeId}
          portrait={scene.speakerPortrait}
          speakerRole={scene.speakerRole}
          question={scene.question} bridge={scene.bridge} reaction={scene.reaction} opening={scene.opening} echo={scene.echo}
          run={run}
          tableSeconds={schema.seconds}
          cards={cards}
          reframeChoice={reframeChoice}
          isCardOpen={isCardOpen}
          sealedId={sealBroken ? null : sealedId}
          selectedId={win.selectedId}
          mutations={tableRules}
          resourceMeta={resourceMeta}
          moveOf={logic?.moveOf}
          onOpen={openTable}
          reading={trackReading}
        />
      )}

      <TableNotices
        equipped={equipped}
        tab={{ locked, awaitingClaim, live }}
        caseId={scene.node.caseId}
        // What the table says aloud, in one polite region (tableVoice.js), the armed 확정 included.
        voice={{ win, live, speaking: live && !paused, dangerLine, cashMutations, run, band, audit, links, armed: holdsCash && cashHold.phase === "armed", clock: { remaining, elapsed: win.elapsed, openedByClock: clockOpenedSeed === seed } }}
        slam={win.status !== "live" && claimed ? { window: win, multiplier, livePot, streak: earnedBonus > 1 ? logic.after : 0, runPot: run.runPot, bustKeeps } : null}
        onReload={onReload}
        onClaim={claimHeldWindow}
        onLeave={() => setLostToTab(true)}
      />
      {/* A closed window is on its way to the reveal, which is a dialog of its
          own: the settings close when the window does (ComfortDialog.jsx). */}
      <ComfortDialog live={live} />
    </section>
  );
}
