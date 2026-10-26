import { useEffect, useMemo, useRef, useState } from "react";
import { Flame, Lock, TriangleAlert } from "lucide-react";
import { CardType, WildName } from "./GauntletHand.jsx";
import { getReadingSeconds, hashSeed, isPenaltyMutation, REFRAME_CARD_ID } from "./gauntletEngine.js";
import { RELICS } from "./relics.js";
import { RelicIcon } from "./RelicDraft.jsx";
import { describeStanding } from "./tableReadout.js";
import { getBriefingIntro, getBriefingOpening, getBriefingWeekRuleId } from "./tableStaging.js";
import { getSpeakerLine } from "./speakerLine.js";
import { SPEAKER_NAMES } from "../speakerPortraits.js";
import { speakerName } from "../locale.js";
import { pastPick, useSceneFold, useWeekRulePanel } from "./WeekRulePanel.jsx";
import { getUnlockKicker } from "./tableUnlocks.js";
import { monotonicNow } from "./fxVariables.js";
import { useDialogFocus } from "./useDialogFocus.js";
import { GuardedButton } from "../components/GuardedButton.jsx";
import { Prose, ProseCaptions, ProseItems } from "../components/Prose.jsx";
import { ScenePlate } from "../components/ScenePlate.jsx";
import { SpeakerPortrait } from "../components/SpeakerPortrait.jsx";
import { useShortcutHints } from "../state/accessibilitySettings.js";
import { ReadingClockAsk, readingClockStart } from "./ReadingClockAsk.jsx";
import { useSceneTraceLine } from "../state/useSceneBustRates.js";

// The sound a panel makes. A board that just broke slams; everything else is
// drawn from the scene id so the same scene always makes the same noise.
const SFX_CALM = ["째깍", "두근", "지이잉", "툭", "스윽", "딸깍"];
const SFX_BROKEN = ["쾅!", "쩌억!", "콰직!"];

function pickSfx(nodeId, broken) {
  const pool = broken ? SFX_BROKEN : SFX_CALM;
  return pool[hashSeed(`sfx:${nodeId}`) % pool.length];
}

/** A rule of this board as a row: its label, what it is, what it does, the relic that softened it. */
function RuleRows({ rules, resourceMeta }) {
  return (
    <ul>
      {rules.map((mutation) => (
        <li key={mutation.id} className={`gx-mutation mut-${mutation.id}`}>
          <b lang="en">{mutation.label}</b>
          <strong>
            {mutation.title}
            {mutation.axis ? ` · ${resourceMeta[mutation.axis]?.label ?? mutation.axis}` : ""}
          </strong>
          <small>{mutation.text}</small>
          {mutation.softenedBy && (
            <em className="gx-mutation-relic">
              <RelicIcon id={mutation.softenedBy} size={11} /> {RELICS[mutation.softenedBy].softens.text}
            </em>
          )}
        </li>
      ))}
    </ul>
  );
}

/**
 * The scene, told as a page of a graphic novel before the table opens.
 *
 * A splash panel of the room with its caption and sound, the speaker with a
 * line of their own in a balloon (speakerLine.js) and under it the scene's
 * question in a box with no tail, 「당신의 판단」 -- the question is the
 * narrator's to the player, not the speaker's -- the narration as caption
 * boxes, the speaker's own speech among them wearing a name chip, the case file
 * pinned beside it, and -- when the last decision broke this board -- the new
 * rules as a red panel. `mutations` is the table's own list (`tableRules`, so
 * no REBOOT), and only the penalties in it are a breach: the red panel, the
 * slam and the glitch used to answer a charged stance, an OVERCLOCK and the
 * season's mastery too. Those are told in a panel of the introduction's form,
 * above the breach when the board carries both. The page has its own clock:
 * when it runs out the table opens by itself. The player can open it sooner,
 * or stake a card straight from the page, which opens the table with that card already on it. A card
 * there says its type as it does in the hand (`CardType`), and `moveOf` what
 * staking it would do to the logic streak.
 *
 * The page a case opens on, when the case turns rules on (`tableUnlocks`),
 * says so in a panel of the same form. It is the last panel, under the story,
 * the case file and the week's rule, straight above the cards and 판 열기
 * (improvement notes D-6, 2026-10-22): from 2026-10-09 to then it sat between
 * the speaker and the story, so the first sentence of the game a player read
 * was 「밀면 열기와 배율이 오릅니다」 and not the story. Read last, it is the
 * rule in front of the button it is about.
 *
 * The page holds the table's clock the whole time it is up; its own countdown
 * is the only thing ticking, and it stops while the browser tab is hidden.
 *
 * The countdown is also a button. A reading clock that opens the table by
 * itself is a time limit on reading, and a player who reads slowly -- or with
 * a screen reader -- needs a way to stop it (WCAG 2.2.1): pressing the clock
 * holds it until it is pressed again. It is part of the page, not a panel in
 * front of the table, so priority 27 is untouched.
 *
 * It renders once a second, not once a frame: the bar under the number is a
 * CSS variable the loop writes on the element, and the number only changes
 * when a whole second has gone.
 */
/**
 * The table's folded case file, under its summary: the six numbers and the
 * clue count a locked card states its condition in (the HUD prints none of
 * them), then the scene told again for looking something up while the clock
 * runs. `standing` is the resources, their labels and the clue count.
 *
 * The room comes before the words about it. Ten raster files cannot cover 169
 * scenes, so the picture is drawn from the scene's own `place` and `phase`
 * rather than shipped as art. It is drawn only while the fold is open because
 * priority 27 gives the table its height budget and a picture in front of the
 * cards would spend it.
 *
 * Then the case facts. Every scene has carried a `memo` since the graph was
 * written and none of them ever reached the DOM, so the briefing explained the
 * table and never the situation the cards are answering.
 *
 * Then the case so far and who is in it (D-8): `caseCast`, from the runtime
 * (CaseCastFold.jsx), which fetches CaseCast, a chunk of its own, the first
 * time the fold opens.
 */
export function CaseFileStory({ node, nodeId, open, standing, caseCast }) {
  return (
    <>
      <p data-testid="brief-standing">{describeStanding(...standing)}</p>
      {open && <ScenePlate node={node} nodeId={nodeId} />}
      {node.lead && (
        <p className="gx-brief-lead">
          <Prose text={node.lead} />
        </p>
      )}
      <p>
        <Prose text={node.text} />
      </p>
      {node.memo?.length > 0 && (
        <ul className="gx-brief-memo">
          <ProseItems items={node.memo} />
        </ul>
      )}
      {open && caseCast?.(node, SpeakerPortrait)}
    </>
  );
}

export function SceneBriefing({
  node,
  nodeId,
  portrait,
  speakerRole,
  question,
  bridge = null,
  reaction = null,
  opening,
  echo,
  run,
  tableSeconds,
  cards,
  reframeChoice,
  isCardOpen,
  sealedId,
  selectedId,
  mutations,
  resourceMeta,
  moveOf,
  onOpen,
  reading,
}) {
  const { letterKeys, keys } = useShortcutHints();
  const intro = getBriefingIntro(node, nodeId, run);
  // The names as the page prints them: prose in another language names people in it (src/locale.js).
  const speech = useMemo(() => getSpeakerLine(node?.speakerName ? { ...node, speaker: node.speakerName } : node, SPEAKER_NAMES.map(speakerName)), [node]);
  // A lead the balloon carries is narration: a caption's box, not speech.
  const Balloon = speech.fromLead ? "p" : "blockquote";
  // The case's opening voice, on its first page only, read after the title and
  // on the reading clock (Q8 (1)). In the place reading-layout gives its
  // 「지난 장면에서 —」 line, which this stands in for on that page.
  // Not on a NEW GAME+ season's first page, whose run line is the season's
  // carried one (`echo.echo`, drawn by WeekRulePanel.jsx) and not a case voice.
  const openingLine = echo?.echo ? "" : getBriefingOpening(node, nodeId, opening);
  // The other players' wall rate here, pinned last in the case file (D3).
  const trace = useSceneTraceLine(node.caseId, nodeId);
  // 이번 주의 규칙, a panel of its own under the page (결정 28), on the same
  // clock; above it, on a NEW GAME+ season's first page of a case, what the
  // season before left there (`echo`, an object of two lines: secondSeason.js).
  // All are drawn by WeekRulePanel.jsx.
  const [weekRules, weekRulePanel] = useWeekRulePanel(getBriefingWeekRuleId(node, nodeId, run), echo);
  // E-1: on a NEW GAME+ season, the scene as the page tells it (`told`: a
  // scene a season before read, folded), the button that unfolds it and the
  // NEW mark of one none read. Also WeekRulePanel.jsx's, for the same reason.
  const [told, unfold, newMark] = useSceneFold(node, echo);
  // The page prints the changed rules, the carried ones and the new ones under
  // the scene, so all three are on its clock, a sentence of any counted the
  // same way. `mutations` is exactly the two lists printed below. The line
  // from the scene before (`bridge`, D-7) is read on it too.
  const readSeconds = useMemo(
    () => getReadingSeconds({ ...told, question }, [...mutations, ...intro.map((text) => ({ text })), ...weekRules, { text: bridge }, { text: openingLine }]),
    [told, question, mutations, intro, weekRules, bridge, openingLine],
  );
  const [shown, setShown] = useState(() => Math.ceil(readSeconds));
  // Held from the start when the player asked for a reading clock that waits,
  // and on 프롤로그 01-02 until the page has asked once (ReadingClockAsk.jsx).
  const [start] = useState(() => readingClockStart(node.caseId));
  const [held, setHeld] = useState(start.held);
  const [asking, setAsking] = useState(false);
  const askRef = useRef(start.ask);
  const heldRef = useRef(held);
  const onOpenRef = useRef(onOpen);
  const dialogRef = useRef(null);
  const timerRef = useRef(null);
  const trapTab = useDialogFocus(dialogRef);

  useEffect(() => {
    onOpenRef.current = onOpen;
  });

  // D-11: how long this page is up (visible) and whether it was ever held, for
  // the stage to note when the table opens, by whatever key or button. Each
  // frame reports both, so a page held from the start or held later is caught.
  const readingRef = useRef(reading);
  useEffect(() => {
    readingRef.current = reading;
  });

  useEffect(() => {
    let frame = 0;
    let spent = 0;
    let last = monotonicNow();
    const loop = () => {
      const now = monotonicNow();
      const step = document.hidden ? 0 : Math.min(0.25, (now - last) / 1000);
      if (!heldRef.current) spent += step;
      readingRef.current?.(step, heldRef.current);
      last = now;
      const remaining = Math.max(0, readSeconds - spent);
      timerRef.current?.style.setProperty("--read-left", Math.max(0, Math.min(1, remaining / readSeconds)).toFixed(3));
      // Whole seconds are all the page prints; an unchanged value skips the render.
      setShown(Math.ceil(remaining));
      if (remaining <= 0 && askRef.current) {
        // The first time the clock would open a table, it stops and asks.
        askRef.current = false;
        heldRef.current = true;
        setHeld(true);
        setAsking(true);
      } else if (remaining <= 0 && !heldRef.current) {
        // Opened by the clock, not by the player: the table says so aloud.
        // While the question is open the clock is held, so it waits for the
        // answer instead of opening the table on the very next frame.
        onOpenRef.current(null, true);
        return;
      }
      frame = globalThis.requestAnimationFrame(loop);
    };
    frame = globalThis.requestAnimationFrame(loop);
    return () => globalThis.cancelAnimationFrame(frame);
  }, [readSeconds]);

  function toggleHold() {
    heldRef.current = !heldRef.current;
    setHeld(heldRef.current);
  }

  // The grid's three rows are the picture and the speaker, the story and the
  // file, the breach. A board that carries both kinds of rule has one more
  // panel than the grid has rows under the story, and names the row (`row`).
  // On a phone the panels are a column in the order they are written, and
  // this is not read.
  const at = (row) => (row ? { gridArea: `${row} / 1 / ${row + 1} / -1` } : undefined);
  const penalties = mutations.filter(isPenaltyMutation);
  const carried = mutations.filter((mutation) => !isPenaltyMutation(mutation));
  const broken = penalties.length > 0;
  const sfx = pickSfx(nodeId, broken);
  const late = !held && shown <= 5;

  return (
    <div className="gx-comic" data-testid="scene-briefing">
      <div
        ref={dialogRef}
        className={`gx-comic-page${broken ? " is-broken" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="gx-comic-title"
        tabIndex={-1}
        onKeyDown={trapTab}
      >
        <header className={`gx-comic-top${openingLine ? " has-opening" : ""}`}>
          {/* A phone's picture of the room, behind the title (D-13); briefing.css shows it there only. */}
          <ScenePlate node={node} nodeId={nodeId} variant="backdrop" />
          <p className="gx-comic-kicker" lang="en">
            {node.phase}
            {newMark}
          </p>
          <p id="gx-comic-title" className="gx-comic-title">{node.title}</p>
          {openingLine && <p className="gx-comic-opening" data-testid="briefing-opening">{openingLine}</p>}
          <button
            type="button"
            ref={timerRef}
            className={`gx-comic-timer${late ? " is-late" : ""}${held ? " is-held" : ""}`}
            // A switch: what it shows is its state, the seconds and whether they
            // run, and a switch's shown text is its value, not its name (axe
            // reads it so for label-in-name, WCAG 2.5.3).
            role="switch"
            aria-checked={held}
            // The name stays put. With the seconds in it, a screen reader read
            // the focused button out again every second, over the briefing the
            // player had stopped the clock to hear. The count is its description.
            aria-label="읽는 시간 멈춤"
            aria-describedby="gx-comic-timer-left"
            data-testid="reading-timer"
            onClick={toggleHold}
          >
            <b aria-hidden="true">{shown}</b>
            <small aria-hidden="true">{held ? "멈춤 · 누르면 다시 흐른다" : "초 뒤 판이 열린다 · 누르면 멈춤"}</small>
            <span id="gx-comic-timer-left" className="sr-only" role="timer" aria-live="off">
              {held ? `${shown}초에서 멈춰 있다. 누르면 다시 흐른다` : `${shown}초 뒤 판이 열린다`}
            </span>
            <i aria-hidden="true" />
          </button>
        </header>

        <div className="gx-comic-grid">
          <figure className="gx-panel gx-panel-splash">
            <ScenePlate node={node} nodeId={nodeId} />
            {(node.place || node.clock) && (
              <figcaption className="gx-caption gx-caption-place">
                {node.place && <b>{node.place}</b>}
                {node.clock && <span>{node.clock}</span>}
              </figcaption>
            )}
            <strong className="gx-sfx" aria-hidden="true">{sfx}</strong>
          </figure>

          <figure className="gx-panel gx-panel-speaker">
            <div className="gx-speaker-frame">
              <SpeakerPortrait name={node.speaker} src={portrait} size={240} />
            </div>
            <figcaption className="gx-speaker-tag">
              <b>{node.speakerName ?? node.speaker}</b>
              <span>{speakerRole}</span>
            </figcaption>
            {speech.line && (
              <Balloon className={`gx-balloon${speech.fromLead ? " is-lead" : ""}`}>
                <Prose text={speech.line} />
              </Balloon>
            )}
            <div className="gx-judgment" data-testid="briefing-question">
              <b>당신의 판단</b>
              <p><Prose text={question} /></p>
            </div>
          </figure>

          <div className="gx-panel gx-panel-story">
            {unfold}
            {/* Where the last scene left off (D-7): its echo, or the ending of the case before. */}
            {bridge && <p className="gx-bridge" data-testid="scene-bridge">{bridge}</p>}
            {/* The speaker on the last table, before the scene (C-13): a line of the runtime's, picked by its heat. */}
            {reaction && (
              <p className="gx-caption gx-caption-reaction" data-testid="table-reaction">
                <small>{reaction.recap}</small>
                {node.speakerName ?? node.speaker}: “{reaction.line}”
              </p>
            )}
            {/* A lead the balloon carries is not told twice. */}
            {told.lead && !speech.fromLead && <p className="gx-caption gx-caption-lead"><Prose text={told.lead} /></p>}
            <ProseCaptions text={told.text} who={node.speakerName ?? node.speaker} whoAt={speech.whoAt} />
          </div>

          {(told.memo?.length > 0 || trace) && (
            <div className="gx-panel gx-panel-file">
              <p className="gx-file-tab">사건 파일</p>
              <ul>
                <ProseItems items={told.memo} />
                {trace && <li data-testid="scene-trace">{trace}</li>}
              </ul>
            </div>
          )}

          {carried.length > 0 && (
            <div className="gx-panel gx-panel-breach gx-carry" data-testid="carried-rules" style={at(broken ? 3 : 0)}>
              <p className="gx-breach-kicker">이월 · 이번 판에 이어지는 규칙</p>
              <RuleRows rules={carried} resourceMeta={resourceMeta} />
            </div>
          )}

          {broken && (
            <div className="gx-panel gx-panel-breach" data-testid="protocol-breach" style={at(carried.length > 0 ? 4 : 0)}>
              <p className="gx-breach-kicker">
                <TriangleAlert size={14} aria-hidden="true" /> <span><span lang="en">PROTOCOL BREACH</span> · 이번 판의 규칙이 바뀌었다</span>
              </p>
              <RuleRows rules={penalties} resourceMeta={resourceMeta} />
            </div>
          )}
        </div>

        {/* Under the page's grid, so it takes none of its rows. */}
        {weekRulePanel}

        {intro.length > 0 && (
          <div className="gx-panel gx-panel-breach gx-carry" data-testid="unlock-intro" style={{ gridArea: "auto" }}>
            <p className="gx-breach-kicker">{getUnlockKicker(node.caseId)}</p>
            <ul>
              {intro.map((line) => (
                <li key={line} className="gx-mutation">
                  <strong style={{ gridColumn: "1 / -1" }}>{line}</strong>
                </li>
              ))}
            </ul>
          </div>
        )}

        {asking && (
          <ReadingClockAsk
            onAnswer={(hold) => {
              setAsking(false);
              if (!hold) onOpen(null, true);
            }}
          />
        )}

        <footer className="gx-comic-actions">
          <p className="gx-comic-hint">
            카드를 고르면 그 카드를 건 채로 판이 열린다
            {letterKeys && <> · <kbd>1</kbd>–<kbd>{cards.length + (reframeChoice ? 1 : 0)}</kbd></>}
          </p>
          <div className="gx-comic-cards" role="group" aria-label="바로 걸 카드">
            {cards.map((card, index) => {
              const open = isCardOpen(card);
              return (
                // A locked card stays reachable: it says 잠김, and a disabled
                // button would be skipped before a keyboard player heard it.
                <GuardedButton
                  type="button"
                  key={card.id}
                  className={`gx-comic-card${selectedId === card.id ? " selected" : ""}${open ? "" : " is-locked"}`}
                  data-testid="briefing-card"
                  blocked={!open}
                  aria-keyshortcuts={keys(index + 1)}
                  onClick={() => onOpen(card.id)}
                >
                  {letterKeys && <kbd>{index + 1}</kbd>}
                  <span>{card.label}</span>
                  <CardType card={card} moveOf={moveOf} />
                  {pastPick(echo?.picked, card.id)}
                  {(card.id === sealedId || !open) && (
                    <>
                      <Lock size={12} aria-hidden="true" />
                      <span className="sr-only">{open ? "봉인" : "잠김"}</span>
                    </>
                  )}
                </GuardedButton>
              );
            })}
            {reframeChoice && (
              <button
                type="button"
                className={`gx-comic-card is-wild${selectedId === REFRAME_CARD_ID ? " selected" : ""}`}
                data-testid="briefing-card"
                aria-keyshortcuts={keys(cards.length + 1)}
                onClick={() => onOpen(REFRAME_CARD_ID)}
              >
                {letterKeys && <kbd>{cards.length + 1}</kbd>}
                <span>{reframeChoice.label}</span>
                <CardType card={reframeChoice} moveOf={moveOf} />
                <WildName />
                {pastPick(echo?.picked, reframeChoice.id, 1)}
              </button>
            )}
          </div>
          <button
            type="button"
            className="gx-open-table"
            data-testid="open-table"
            onClick={() => onOpen(null)}
            aria-keyshortcuts={keys("Space Enter W")}
            // The name starts with what the button shows (WCAG 2.5.3); the space
            // after the label is not drawn in the flex row.
            aria-label={`판 열기 ${tableSeconds}초 시작. 지금부터 시계가 흐르고 카드를 걸 수 있다`}
          >
            <Flame size={18} aria-hidden="true" />
            <span>판 열기</span>{" "}
            <small>{tableSeconds}초 시작</small>
          </button>
        </footer>
      </div>
    </div>
  );
}
