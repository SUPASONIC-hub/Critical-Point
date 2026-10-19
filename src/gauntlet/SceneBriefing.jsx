import { useEffect, useMemo, useRef, useState } from "react";
import { Flame, Lock, TriangleAlert } from "lucide-react";
import { CardType, WildName } from "./GauntletHand.jsx";
import { getReadingSeconds, hashSeed, isPenaltyMutation, REFRAME_CARD_ID } from "./gauntletEngine.js";
import { RELICS } from "./relics.js";
import { RelicIcon } from "./RelicDraft.jsx";
import { getBriefingIntro } from "./tableStaging.js";
import { getUnlockKicker } from "./tableUnlocks.js";
import { monotonicNow } from "./fxVariables.js";
import { useDialogFocus } from "./useDialogFocus.js";
import { GuardedButton } from "../components/GuardedButton.jsx";
import { ScenePlate } from "../components/ScenePlate.jsx";
import { SpeakerPortrait } from "../components/SpeakerPortrait.jsx";
import { getAccessibility, useShortcutHints } from "../state/accessibilitySettings.js";

// The sound a panel makes. A board that just broke slams; everything else is
// drawn from the scene id so the same scene always makes the same noise.
const SFX_CALM = ["째깍", "두근", "지이잉", "툭", "스윽", "딸깍"];
const SFX_BROKEN = ["쾅!", "쩌억!", "콰직!"];

function pickSfx(nodeId, broken) {
  const pool = broken ? SFX_BROKEN : SFX_CALM;
  return pool[hashSeed(`sfx:${nodeId}`) % pool.length];
}

/** Narration reads as a strip of caption boxes, one sentence to a box. */
function splitCaptions(text = "") {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
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
 * A splash panel of the room with its caption and sound, the speaker with the
 * scene's question in a balloon, the narration as caption boxes, the case file
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
 * says so in a panel of the same form. It sits straight under the speaker and
 * the question, so it is on the first screen with them; the breach panel
 * stays where it always was, at the end of the page.
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
export function SceneBriefing({
  node,
  nodeId,
  portrait,
  speakerRole,
  question,
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
}) {
  const { letterKeys, keys } = useShortcutHints();
  const intro = getBriefingIntro(node, nodeId, run);
  // The page prints the changed rules, the carried ones and the new ones under
  // the scene, so all three are on its clock, a sentence of any counted the
  // same way. `mutations` is exactly the two lists printed below.
  const readSeconds = useMemo(
    () => getReadingSeconds({ ...node, question }, [...mutations, ...intro.map((text) => ({ text }))]),
    [node, question, mutations, intro],
  );
  const [shown, setShown] = useState(() => Math.ceil(readSeconds));
  // Held from the start when the player asked for a reading clock that waits.
  const [held, setHeld] = useState(() => getAccessibility().holdReadingClock);
  const heldRef = useRef(held);
  const onOpenRef = useRef(onOpen);
  const dialogRef = useRef(null);
  const timerRef = useRef(null);
  const trapTab = useDialogFocus(dialogRef);

  useEffect(() => {
    onOpenRef.current = onOpen;
  });

  useEffect(() => {
    let frame = 0;
    let spent = 0;
    let last = monotonicNow();
    const loop = () => {
      const now = monotonicNow();
      if (!document.hidden && !heldRef.current) spent += Math.min(0.25, (now - last) / 1000);
      last = now;
      const remaining = Math.max(0, readSeconds - spent);
      timerRef.current?.style.setProperty("--read-left", Math.max(0, Math.min(1, remaining / readSeconds)).toFixed(3));
      // Whole seconds are all the page prints; an unchanged value skips the render.
      setShown(Math.ceil(remaining));
      if (remaining <= 0) {
        // Opened by the clock, not by the player: the table says so aloud.
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

  // The grid has no row for the introduction: its three are the picture and
  // the speaker, the story and the file, the breach. A page that carries one
  // places every panel by line instead, a row further down from the story on.
  // On a phone the panels are a column in the order they are written, and
  // this is not read.
  // A board that carries both kinds of rule has one more panel than the grid
  // has rows under the story, and names the row (`row`) whatever the page.
  const at = (gridArea, row = 0) => (row ? { gridArea: `${row} / 1 / ${row + 1} / -1` } : intro.length > 0 ? { gridArea } : undefined);
  const penalties = mutations.filter(isPenaltyMutation);
  const carried = mutations.filter((mutation) => !isPenaltyMutation(mutation));
  const broken = penalties.length > 0;
  const carryRow = intro.length > 0 ? 4 : 3;
  const sfx = pickSfx(nodeId, broken);
  const captions = splitCaptions(node.text);
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
        <header className="gx-comic-top">
          <p className="gx-comic-kicker" lang="en">{node.phase}</p>
          <p id="gx-comic-title" className="gx-comic-title">{node.title}</p>
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
          <figure className="gx-panel gx-panel-splash" style={at("1 / 1")}>
            <ScenePlate node={node} nodeId={nodeId} />
            {(node.place || node.clock) && (
              <figcaption className="gx-caption gx-caption-place">
                {node.place && <b>{node.place}</b>}
                {node.clock && <span>{node.clock}</span>}
              </figcaption>
            )}
            <strong className="gx-sfx" aria-hidden="true">{sfx}</strong>
          </figure>

          <figure className="gx-panel gx-panel-speaker" style={at("1 / 2")}>
            <div className="gx-speaker-frame">
              <SpeakerPortrait name={node.speaker} src={portrait} size={240} />
            </div>
            <figcaption className="gx-speaker-tag">
              <b>{node.speaker}</b>
              <span>{speakerRole}</span>
            </figcaption>
            <blockquote className="gx-balloon">{question}</blockquote>
          </figure>

          {intro.length > 0 && (
            <div className="gx-panel gx-panel-breach gx-carry" data-testid="unlock-intro" style={at("2 / 1 / 3 / -1")}>
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

          <div className="gx-panel gx-panel-story" style={at("3 / 1")}>
            {node.lead && <p className="gx-caption gx-caption-lead">{node.lead}</p>}
            {captions.map((caption, index) => (
              <p key={index} className="gx-caption">{caption}</p>
            ))}
          </div>

          {node.memo?.length > 0 && (
            <div className="gx-panel gx-panel-file" style={at("3 / 2")}>
              <p className="gx-file-tab">사건 파일</p>
              <ul>
                {node.memo.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {carried.length > 0 && (
            <div className="gx-panel gx-panel-breach gx-carry" data-testid="carried-rules" style={at("4 / 1 / 5 / -1", broken ? carryRow : 0)}>
              <p className="gx-breach-kicker">이월 · 이번 판에 이어지는 규칙</p>
              <RuleRows rules={carried} resourceMeta={resourceMeta} />
            </div>
          )}

          {broken && (
            <div className="gx-panel gx-panel-breach" data-testid="protocol-breach" style={at("4 / 1 / 5 / -1", carried.length > 0 ? carryRow + 1 : 0)}>
              <p className="gx-breach-kicker">
                <TriangleAlert size={14} aria-hidden="true" /> <span><span lang="en">PROTOCOL BREACH</span> · 이번 판의 규칙이 바뀌었다</span>
              </p>
              <RuleRows rules={penalties} resourceMeta={resourceMeta} />
            </div>
          )}
        </div>

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
