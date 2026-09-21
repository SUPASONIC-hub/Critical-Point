import { useEffect, useRef, useState } from "react";
import { Flame, Lock, TriangleAlert } from "lucide-react";
import { hashSeed } from "./gauntletEngine.js";
import { RELICS } from "./relics.js";
import { RelicIcon } from "./RelicDraft.jsx";
import { ScenePlate } from "../components/ScenePlate.jsx";
import { SpeakerPortrait } from "../components/SpeakerPortrait.jsx";

const monotonicNow = () => globalThis.performance?.now?.() ?? Date.now();

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

/**
 * The scene, told as a page of a graphic novel before the table opens.
 *
 * A splash panel of the room with its caption and sound, the speaker with the
 * scene's question in a balloon, the narration as caption boxes, the case file
 * pinned beside it, and -- when the last decision broke this board -- the new
 * rules as a red panel. The page has its own clock: when it runs out the table
 * opens by itself. The player can open it sooner, or stake a card straight
 * from the page, which opens the table with that card already on it.
 *
 * The page holds the table's clock the whole time it is up; its own countdown
 * is the only thing ticking, and it stops while the browser tab is hidden.
 */
export function SceneBriefing({
  node,
  nodeId,
  portrait,
  speakerRole,
  question,
  readSeconds,
  tableSeconds,
  cards,
  freeChoice,
  isCardOpen,
  sealedId,
  selectedId,
  mutations,
  resourceMeta,
  onOpen,
}) {
  const [left, setLeft] = useState(readSeconds);
  const onOpenRef = useRef(onOpen);
  const dialogRef = useRef(null);

  useEffect(() => {
    onOpenRef.current = onOpen;
  });

  useEffect(() => {
    dialogRef.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    let frame = 0;
    let spent = 0;
    let last = monotonicNow();
    const loop = () => {
      const now = monotonicNow();
      if (!document.hidden) spent += Math.min(0.25, (now - last) / 1000);
      last = now;
      const remaining = Math.max(0, readSeconds - spent);
      // Tenths are all the page shows; an unchanged value skips the render.
      setLeft(Math.ceil(remaining * 10) / 10);
      if (remaining <= 0) {
        onOpenRef.current(null);
        return;
      }
      frame = globalThis.requestAnimationFrame(loop);
    };
    frame = globalThis.requestAnimationFrame(loop);
    return () => globalThis.cancelAnimationFrame(frame);
  }, [readSeconds]);

  const broken = mutations.length > 0;
  const sfx = pickSfx(nodeId, broken);
  const captions = splitCaptions(node.text);
  const shown = Math.ceil(left);
  const late = left <= 5;

  return (
    <div className="gx-comic" data-testid="scene-briefing">
      <div
        ref={dialogRef}
        className={`gx-comic-page${broken ? " is-broken" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="gx-comic-title"
        tabIndex={-1}
      >
        <header className="gx-comic-top">
          <p className="gx-comic-kicker">{node.phase}</p>
          <p id="gx-comic-title" className="gx-comic-title">{node.title}</p>
          <div
            className={`gx-comic-timer${late ? " is-late" : ""}`}
            role="timer"
            aria-label={`읽는 시간 ${shown}초 남음`}
            data-testid="reading-timer"
            style={{ "--read-left": Math.max(0, Math.min(1, left / readSeconds)) }}
          >
            <b>{shown}</b>
            <small>초 뒤 판이 열린다</small>
            <i aria-hidden="true" />
          </div>
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
              <b>{node.speaker}</b>
              <span>{speakerRole}</span>
            </figcaption>
            <blockquote className="gx-balloon">{question}</blockquote>
          </figure>

          <div className="gx-panel gx-panel-story">
            {node.lead && <p className="gx-caption gx-caption-lead">{node.lead}</p>}
            {captions.map((caption, index) => (
              <p key={index} className="gx-caption">{caption}</p>
            ))}
          </div>

          {node.memo?.length > 0 && (
            <div className="gx-panel gx-panel-file">
              <p className="gx-file-tab">사건 파일</p>
              <ul>
                {node.memo.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {broken && (
            <div className="gx-panel gx-panel-breach" role="status" data-testid="protocol-breach">
              <p className="gx-breach-kicker">
                <TriangleAlert size={14} aria-hidden="true" /> PROTOCOL BREACH · 이번 판의 규칙이 바뀌었다
              </p>
              <ul>
                {mutations.map((mutation) => (
                  <li key={mutation.id} className={`gx-mutation mut-${mutation.id}`}>
                    <b>{mutation.label}</b>
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
            </div>
          )}
        </div>

        <footer className="gx-comic-actions">
          <p className="gx-comic-hint">
            카드를 고르면 그 카드를 건 채로 판이 열린다 · <kbd>1</kbd>–<kbd>{cards.length + (freeChoice ? 1 : 0)}</kbd>
          </p>
          <div className="gx-comic-cards" role="group" aria-label="바로 걸 카드">
            {cards.map((card, index) => {
              const open = isCardOpen(card);
              return (
                <button
                  type="button"
                  key={card.id}
                  className={`gx-comic-card${selectedId === card.id ? " selected" : ""}`}
                  data-testid="briefing-card"
                  disabled={!open}
                  aria-keyshortcuts={String(index + 1)}
                  onClick={() => onOpen(card.id)}
                >
                  <kbd>{index + 1}</kbd>
                  <span>{card.label}</span>
                  {(card.id === sealedId || !open) && <Lock size={12} aria-label={open ? "봉인" : "잠김"} />}
                </button>
              );
            })}
            {freeChoice && (
              <button
                type="button"
                className={`gx-comic-card is-wild${selectedId === "__wild__" ? " selected" : ""}`}
                data-testid="briefing-card"
                aria-keyshortcuts={String(cards.length + 1)}
                onClick={() => onOpen("__wild__")}
              >
                <kbd>{cards.length + 1}</kbd>
                <span>직접 말한다</span>
              </button>
            )}
          </div>
          <button
            type="button"
            className="gx-open-table"
            data-testid="open-table"
            onClick={() => onOpen(null)}
            aria-keyshortcuts="Space"
            aria-label="판을 연다. 지금부터 시계가 흐르고 카드를 걸 수 있다"
          >
            <Flame size={18} aria-hidden="true" />
            <span>판 열기</span>
            <small>{tableSeconds}초 시작</small>
          </button>
        </footer>
      </div>
    </div>
  );
}
