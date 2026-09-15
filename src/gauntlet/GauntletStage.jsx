import { useEffect, useMemo, useRef, useState } from "react";
import { AlertTriangle, Flame, HeartPulse, Lock, RefreshCcw, Skull, Vault, Zap } from "lucide-react";
import { getTabToken, STORAGE_KEY } from "../appConfig.js";
import { getAuthorityGate } from "../gameLogic.js";
import {
  BASE_SCHEMA,
  buildNextSchema,
  describeMutations,
  FEVER_BONUS,
  FRACTURE_MIN_BURN,
  GAUGE_MAX,
  getCardBurn,
  getCardChips,
  getForcedCard,
  getGrooveBonus,
  getHeartbeatBpm,
  getMultiplier,
  getRemainingSeconds,
  getSealedCardId,
  judgeBeat,
  scoreBeat,
  SEAL_BREAK_GAUGE,
  SLIP_SECONDS,
  splitOpenSeed,
} from "./gauntletEngine.js";
import { useGauntletWindow } from "./useGauntletWindow.js";
import { GauntletFx } from "./GauntletFx.jsx";
import { playBeatCue, playBustCue, playCashCue, playFeverCue, playMutationCue, playPushCue } from "./gauntletAudio.js";
import { playTargetLockCue } from "../components/AdaptiveMusic.jsx";

const RESOLVE_DELAY_MS = { cashed: 760, bust: 1350 };
const BREACH_AUTO_DISMISS_MS = 2600;
const GRADE_COPY = { perfect: "PERFECT", good: "GOOD", miss: `SLIP −${SLIP_SECONDS}s` };
const GRADE_FLASH = { perfect: 0.9, good: 0.45, miss: 0.6 };
const monotonicNow = () => globalThis.performance?.now?.() ?? 0;

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
  if (mutations.some((mutation) => mutation.id === "reboot")) return "사건을 닫았다. 다음 결정은 기본 규칙으로 재부팅된다.";
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
  freeChoice,
  resources,
  resourceMeta,
  clueCount,
  isAdvancing,
  revealOpen,
  onResolve,
  onTouch,
  staleSave = false,
  onReload,
  freeInput,
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
  const abandoned = hold.seed === seed;
  const heldByOtherTab = abandoned && hold.token !== tabToken;
  const [claimed, setClaimed] = useState(!heldByOtherTab);
  // Another tab settled this window or took hold of it. This table stops: no
  // clock, no input, nothing to write over the other tab's result.
  const [lostToTab, setLostToTab] = useState(false);
  const [breachOpen, setBreachOpen] = useState(mutations.length > 0 && !abandoned);
  const [impact, setImpact] = useState(null);
  const [flash, setFlash] = useState(null);
  // Written by the frame loop on every beat; read here when a push is pressed.
  const beatClock = useRef({ at: 0, period: 0 });
  // The previous verdict is still on screen while the next table mounts under
  // it; the clock and the breach wait until the player has read it.
  const locked = lostToTab || staleSave;
  const awaitingClaim = heldByOtherTab && !claimed;
  const hidden = isAdvancing || revealOpen || locked || awaitingClaim;
  const paused = breachOpen || hidden;
  const [win, dispatch] = useGauntletWindow({ schema, seed, paused, abandoned, beatCombo: run?.beatCombo ?? 0 });
  const resolvedRef = useRef(false);
  const touchedRef = useRef(undefined);

  const sealedId = useMemo(() => getSealedCardId(cards, schema), [cards, schema]);
  const sealBroken = win.gauge >= SEAL_BREAK_GAUGE;
  const wildSelected = win.selectedId === "__wild__";
  const selectedCard = wildSelected ? freeChoice : cards.find((card) => card.id === win.selectedId) ?? null;
  const selectedChips = selectedCard ? getCardChips(selectedCard, schema) : 0;
  const multiplier = getMultiplier(win.gauge);
  const grooveBonus = getGrooveBonus(win.groove);
  const livePot = Math.round(selectedChips * multiplier * grooveBonus);
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
  const wildBlocked = wildSelected && (!freeInput.freeText.trim() || freeInput.freeTextBlockedByPrivacy);
  const canCash = live && !paused && Boolean(selectedCard) && !sealedLock && !wildBlocked;
  const canPush = live && !paused && win.gauge < GAUGE_MAX;
  const nextLow = Math.min(GAUGE_MAX, win.gauge + schema.stepMin);
  const nextHigh = Math.min(GAUGE_MAX, win.gauge + schema.stepMax);
  const selectedBurn = selectedCard ? getCardBurn(selectedCard, schema) : null;
  const selectedEffects = selectedCard ? describeEffect(selectedCard.effect, resourceMeta) : [];
  const visibleEffects = selectedEffects.slice(0, 4);
  const hiddenEffectCount = Math.max(0, selectedEffects.length - visibleEffects.length);
  const nextPotLow = Math.round(selectedChips * getMultiplier(nextLow) * grooveBonus);
  const nextPotHigh = Math.round(selectedChips * getMultiplier(nextHigh) * grooveBonus);
  const fractureAxis = selectedBurn && Math.abs(selectedBurn.value) >= FRACTURE_MIN_BURN ? selectedBurn.key : null;
  const cashSchema = buildNextSchema({
    outcome: "cash",
    cause: "cash",
    gauge: win.gauge,
    pushes: win.pushes,
    streak: multiplier >= 4 ? run.streak + 1 : 0,
    burnAxis: fractureAxis,
    caseClosed: false,
  });
  const bustSchema = buildNextSchema({
    outcome: "bust",
    cause: "push",
    gauge: Math.max(win.gauge, schema.wallMin),
    pushes: win.pushes + 1,
    streak: 0,
    burnAxis: fractureAxis,
    caseClosed: false,
  });
  const cashMutations = describeMutations(cashSchema);
  const bustMutations = describeMutations(bustSchema);
  const runTension = Math.min(100, run.busts * 24 + run.streak * 16 + Math.min(40, Math.log10(Math.max(1, run.runPot)) * 11));
  const ruleHeat = getRuleHeat({ mutations, schema });
  const ruleObjective = getRuleObjective(mutations);
  const overclockedBoard = schema.mutations.includes("overclock");
  const overdrive = getOverdriveCopy({ run, multiplier, cashMutations });
  const dangerLine = nextHigh >= schema.wallMin
    ? "다음 푸시가 벽 구간에 닿을 수 있다"
    : `벽 구간까지 최소 ${Math.max(0, Math.ceil(schema.wallMin - nextHigh))} 열기`;
  const currentRules = mutations.length
    ? `${joinRules(mutations)} 적용 중`
    : schema.faceDown || schema.sedated || schema.sealHighest || schema.fracturedAxis
      ? "숨은 규칙 적용 중"
      : "규칙 안정";

  useEffect(() => {
    if (!breachOpen || hidden) return undefined;
    playMutationCue(mutations.length);
    const timer = globalThis.setTimeout(() => setBreachOpen(false), BREACH_AUTO_DISMISS_MS);
    return () => globalThis.clearTimeout(timer);
  }, [breachOpen, hidden, mutations.length]);

  // A stake or a push is written to the save before anything can be won or lost
  // in this window, with the card staked. Reading alone is not a touch, so a
  // save and exit taken before the bet is placed resumes a fresh window.
  const touched = win.pushes > 0 || Boolean(win.selectedId);
  const touchedCardId = win.selectedId && win.selectedId !== "__wild__" ? win.selectedId : null;
  useEffect(() => {
    if (!touched || abandoned || win.status !== "live") return;
    if (touchedRef.current === touchedCardId) return;
    touchedRef.current = touchedCardId;
    onTouch?.(`${seed}#${tabToken}`, touchedCardId);
  }, [abandoned, onTouch, seed, tabToken, touched, touchedCardId, win.status]);

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
    const staked = selectedCard && !(wildSelected && wildBlocked) ? selectedCard : savedStake;
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

  function select(id) {
    if (!live || isAdvancing || locked) return;
    setBreachOpen(false);
    playTargetLockCue();
    dispatch({ type: "SELECT", id: win.selectedId === id ? null : id });
  }

  function push(event) {
    if (locked || (!canPush && !(breachOpen && live))) return;
    // Graded against the beat the frame loop last landed. With no beat on
    // screen -- the breach still up, the first pulse not yet in -- the press is
    // ungraded: no combo, no slip.
    const clock = beatClock.current;
    const grade = breachOpen ? null : judgeBeat(pressedAt(event) - clock.at, clock.period);
    setBreachOpen(false);
    const pushIndex = win.pushes + 1;
    const scored = scoreBeat(win, grade);
    dispatch({ type: "PUSH", grade });
    playPushCue(pushIndex, Math.min(1, win.gauge / 90));
    playBeatCue(grade, scored.beatCombo);
    if (grooveBonus < FEVER_BONUS && getGrooveBonus(scored.groove) >= FEVER_BONUS) playFeverCue();
    setImpact({ amount: grade === "miss" ? 0.5 : 0.28 });
    if (grade) setFlash({ amount: GRADE_FLASH[grade] });
  }

  function cash() {
    if (!canCash) return;
    dispatch({ type: "CASH", locked: sealedLock || wildBlocked });
  }

  // Keys: 1-9 stake a card, Space pushes, Enter cashes.
  const keyActions = useRef({});
  useEffect(() => {
    keyActions.current = { select, push, cash, cards, freeChoice };
  });
  useEffect(() => {
    const onKey = (event) => {
      if (event.repeat || event.defaultPrevented) return;
      const target = event.target;
      if (target instanceof HTMLElement && target.matches("input, textarea, select, [contenteditable='true']")) return;
      if (document.querySelector(".decision-reveal-backdrop")) return;
      const actions = keyActions.current;
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
      } else if (index === actions.cards.length && actions.freeChoice) {
        event.preventDefault();
        actions.select("__wild__");
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
        impact={settleImpact ?? impact}
        flash={flash}
        beatClock={beatClock}
        grade={win.lastGrade}
        fever={fever}
      />

      <div className="gx-table">
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
            <span className={run.runPot > 0 ? "gx-at-risk" : ""}>
              <Flame size={13} aria-hidden="true" /> 판돈 <b data-testid="gauntlet-run-pot">{win.status === "bust" ? 0 : formatNumber(run.runPot)}</b>
            </span>
            <span>
              <Vault size={13} aria-hidden="true" /> 금고 <b>{formatNumber(run.vault)}</b>
            </span>
            <span className="gx-run-signal" data-testid="gauntlet-run-signal">
              런 <b>연승 {run.streak}</b> · BUST <b>{run.busts}</b> · 최고 <b>{formatMultiplier(run.bestMultiplier || 1)}</b>
              <i aria-hidden="true"><em style={{ width: `${runTension}%` }} /></i>
            </span>
            <span className="gx-overdrive" data-testid="gauntlet-overdrive">
              <b>{overdrive.label}</b> {overdrive.text}
              <i aria-hidden="true"><em style={{ width: `${overdrive.progress}%` }} /></i>
            </span>
          </div>
          <div className={`gx-clock${remaining <= 10 ? " is-late" : ""}`} role="timer" aria-label={`남은 시간 ${Math.ceil(remaining)}초`}>
            <b>{Math.ceil(remaining)}</b>
            <i style={{ width: `${(remaining / schema.seconds) * 100}%` }} />
          </div>
        </div>

        {(mutations.length > 0 || ruleHeat > 0) && (
          <section className="gx-active-rules" data-testid="active-mutations" aria-label="현재 적용 중인 변형 규칙">
            <div>
              <span>ACTIVE RULESET</span>
              <b>{joinRules(mutations)}</b>
              <small>{currentRules}</small>
            </div>
            <i aria-hidden="true"><em style={{ width: `${ruleHeat}%` }} /></i>
            <ul>
              {mutations.slice(0, 3).map((mutation) => (
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
            <span className="gx-gauge-seal" style={{ left: `${SEAL_BREAK_GAUGE}%` }} hidden={!sealedId} />
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
          <img
            className="gx-portrait"
            src={scene.speakerPortrait ?? "/speaker-profile-160.webp"}
            alt=""
            width="44"
            height="44"
            loading="lazy"
            decoding="async"
          />
          <div>
            <p className="gx-speaker">
              <b>{scene.node.speaker}</b> · {scene.speakerRole}
            </p>
            <p className="gx-question">{scene.question}</p>
            <details className="gx-brief">
              <summary>사건 브리핑</summary>
              <p>{scene.node.text}</p>
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
              벽은 {schema.wallMin}–{schema.wallMax}, 심박 {schema.sedated ? "교란" : bpm}
            </small>
          </article>
          <article className="gx-situation-card">
            <span>확정하면</span>
            <b>{selectedCard ? `+${formatNumber(livePot)} 판돈` : "카드 선택 필요"}</b>
            <small>
              다음 규칙: {joinRules(cashMutations)}
            </small>
          </article>
          <article className="gx-situation-card">
            <span>밀어붙이면</span>
            <b>{selectedCard ? `${formatNumber(nextPotLow)}–${formatNumber(nextPotHigh)}` : "배율만 상승"}</b>
            <small>실패 시 판돈 {formatNumber(run.runPot)} → 0 / {joinRules(bustMutations)}</small>
          </article>
        </section>

        <div className="choices gx-hand" role="group" aria-label="카드">
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
                aria-disabled={!gate.unlocked || !live || isAdvancing ? "true" : undefined}
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
                </span>
                {selected && !schema.faceDown && (
                  <span className="gx-card-preview">
                    {describeEffect(card.effect, resourceMeta).slice(0, 3).map((effect) => (
                      <i key={effect.key} className={effect.value > 0 ? "gain" : "cost"}>
                        {effect.label} {effect.value > 0 ? "+" : ""}{effect.value}
                      </i>
                    ))}
                  </span>
                )}
                {sealed && (
                  <span className="gx-card-seal" data-testid="sealed-card-lock">
                    <Lock size={12} aria-hidden="true" /> 최고 칩 봉인 · 열기 {SEAL_BREAK_GAUGE}
                  </span>
                )}
                {burn?.fractured && !schema.faceDown && (
                  <span className="gx-card-rule-tax" data-testid="fracture-tax">
                    1.5x 청구 · {resourceMeta[burn.key]?.label ?? burn.key}
                  </span>
                )}
                {overclockedBoard && !schema.faceDown && (
                  <span className="gx-card-overclock" data-testid="overclock-card-boost">
                    x2 칩 · 푸시 폭 증가
                  </span>
                )}
                {!gate.unlocked && <span className="gx-card-seal">LOCKED · {gate.reason}</span>}
              </button>
            );
          })}
          {freeChoice && (
            <button
              type="button"
              className={`choice gx-card gx-card-wild${wildSelected ? " selected" : ""}`}
              aria-pressed={wildSelected}
              aria-disabled={!live || isAdvancing ? "true" : undefined}
              aria-keyshortcuts={String(cards.length + 1)}
              onClick={() => select("__wild__")}
            >
              <span className="gx-card-key" aria-hidden="true">{cards.length + 1}</span>
              <span className="gx-card-label">직접 말한다</span>
              <span className="gx-card-stats">
                <b className="gx-card-chips">WILD +{getCardChips(freeChoice, schema)}</b>
                <b className="gx-card-burn">문장이 곧 조건</b>
              </span>
            </button>
          )}
        </div>

        {wildSelected && (
          <div className="reframe-box gx-wild">
            <textarea
              value={freeInput.freeText}
              maxLength={freeInput.FREE_TEXT_MAX_LENGTH}
              onChange={(event) => freeInput.updateFreeText(event.target.value)}
              placeholder="사람, 조건, 순서를 바꾸는 한 문장. 시계는 멈추지 않는다."
              aria-label="직접 말할 문장"
              autoFocus
            />
            {freeInput.freeTextBlockedByPrivacy && (
              <p className="privacy-warning">
                실명·연락처로 보이는 표현: {freeInput.activePrivacySignals.map((signal) => signal.label).join(", ")}
                <button type="button" className="ghost" onClick={freeInput.anonymizeFreeText}>익명화</button>
              </p>
            )}
          </div>
        )}
      </div>

      {selectedCard && !schema.faceDown && (
        <aside className="gx-stake-strip" aria-label="선택한 카드의 상세 영향">
          <AlertTriangle size={15} aria-hidden="true" />
          <b>{selectedCard.label}</b>
          {visibleEffects.map((effect) => (
            <span key={effect.key} className={effect.value > 0 ? "gain" : "cost"}>
              {effect.label} {effect.value > 0 ? "+" : ""}{effect.value}
            </span>
          ))}
          {hiddenEffectCount > 0 && <span>외 {hiddenEffectCount}</span>}
          <small>{selectedBurn ? `${resourceMeta[selectedBurn.key]?.label ?? selectedBurn.key} 소모가 다음 판 균열 후보` : "소모 없는 선택"}</small>
        </aside>
      )}

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

      {breachOpen && mutations.length > 0 && (
        <div className="gx-breach" role="status" data-testid="protocol-breach" onClick={() => setBreachOpen(false)}>
          <span className="gx-breach-kicker">PROTOCOL BREACH · 이번 판의 규칙이 바뀌었다</span>
          <ul>
            {mutations.map((mutation) => (
              <li key={mutation.id} className={`gx-mutation mut-${mutation.id}`}>
                <b>{mutation.label}</b>
                <strong>
                  {mutation.title}
                  {mutation.axis ? ` · ${resourceMeta[mutation.axis]?.label ?? mutation.axis}` : ""}
                </strong>
                <small>{mutation.text}</small>
              </li>
            ))}
          </ul>
        </div>
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
                · 판돈 {formatNumber(run.runPot)} → 0
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
