import { useEffect, useRef, useState } from "react";
import { ClipboardCheck, Crosshair, Fan, Files, Hourglass, Lock, Newspaper, NotebookPen, Repeat, ShieldCheck, Snowflake, Stethoscope, Timer } from "lucide-react";
import { BREATHER, RELIC_IDS, RELIC_SLOTS, RELICS } from "./relics.js";
import { objectParticle } from "../playerLanguage.js";
import { readRelicCodex } from "./useRelicTable.js";
import { useDialogFocus } from "./useDialogFocus.js";
import { useShortcutHints } from "../state/accessibilitySettings.js";

const ICONS = {
  timer: Timer,
  snowflake: Snowflake,
  fan: Fan,
  clipboard: ClipboardCheck,
  files: Files,
  hourglass: Hourglass,
  newspaper: Newspaper,
  notebook: NotebookPen,
  repeat: Repeat,
  shield: ShieldCheck,
  stethoscope: Stethoscope,
  crosshair: Crosshair,
};

export function RelicIcon({ id, size = 14 }) {
  const Icon = ICONS[RELICS[id]?.icon] ?? Lock;
  return <Icon size={size} aria-hidden="true" />;
}

/**
 * The draft a closed case deals at the next case's first table: three relics,
 * one kept for the rest of the season, or none -- and none is 「숨 고르기」
 * (C-7, `BREATHER`): the pass button says what it gives, so passing is a
 * choice and not only a way out.
 *
 * It is the only thing in front of the table because it is the decision on
 * that screen: the clock does not start until it is answered, and nothing
 * behind it can be staked or pushed. Keys 1-3 take a relic and Escape passes,
 * the same keys the hand uses, so a keyboard player never reaches for the
 * mouse; Tab stays inside the draft and Enter takes the focused relic. The codex strip underneath is the season's collection -- what is
 * carried, what is unlocked, and the next feat that opens a locked one.
 *
 * With `RELIC_SLOTS` full, taking a relic is a swap (`swapFor`, held by the
 * stage so the keys see it too): the hand turns into the relics carried, 1-9
 * put one down, Escape goes back to the offer, and the pass stays. The swap is
 * answered in one call (`onPick(id, dropId)`), so nothing half-made is saved.
 */
export function RelicDraft({ offer = [], owned = [], swapFor = null, onPick, onBack, onSkip }) {
  const [codex] = useState(readRelicCodex);
  const { letterKeys, keys } = useShortcutHints();
  const dialogRef = useRef(null);
  const firstOption = useRef(null);
  const trapTab = useDialogFocus(dialogRef, firstOption);
  const unlockedCount = RELIC_IDS.filter((id) => !RELICS[id].unlock || codex.unlocked.includes(id)).length;
  const lockedFeats = RELIC_IDS.filter((id) => RELICS[id].unlock && !codex.unlocked.includes(id)).map((id) => RELICS[id].unlock.text);
  const codexCount = `도감 ${unlockedCount}/${RELIC_IDS.length}`;
  const full = owned.length >= RELIC_SLOTS;
  const hand = swapFor ? owned : offer;
  // The hand changed under the keyboard: focus goes to its first card.
  useEffect(() => {
    if (swapFor !== null) firstOption.current?.focus({ preventScroll: true });
  }, [swapFor]);

  return (
    <div ref={dialogRef} className="gx-draft" role="dialog" aria-modal="true" aria-labelledby="gx-draft-title" data-testid="relic-draft" onKeyDown={trapTab}>
      <div className="gx-draft-panel">
        <span className="gx-draft-kicker">{swapFor ? <>도구 칸 가득 · <span lang="en">SWAP</span></> : <>사건 종료 · <span lang="en">RELIC DRAFT</span></>}</span>
        <h2 id="gx-draft-title">{swapFor ? "내려놓을 도구 하나" : "다음 사건에 가져갈 도구 하나"}</h2>
        {/* Polite, so the swap step is read out when the hand turns over. */}
        <p className="gx-draft-lede" aria-live="polite">
          {swapFor
            ? `${RELICS[swapFor].name}${objectParticle(RELICS[swapFor].name)} 들려면 가진 도구 하나를 내려놓는다. 내려놓은 도구는 이 테이블부터 규칙을 바꾸지 않는다.`
            : `고른 도구는 테이블의 규칙 하나를 바꾼다. 도구는 ${RELIC_SLOTS}개까지 들고, ${full ? "칸이 다 찼으니 고르면 하나를 내려놓는다" : "다 차면 하나를 내려놓고 바꾼다"}. 고를 때까지 시계는 멈춰 있다.`}
        </p>
        <ul className="gx-draft-hand">
          {hand.map((id, index) => {
            const relic = RELICS[id];
            return (
              <li key={id} style={{ "--gx-deal": index }}>
                <button
                  type="button"
                  ref={index === 0 ? firstOption : undefined}
                  className={`gx-relic-card relic-${id}${relic.unlock ? " is-rare" : ""}`}
                  data-testid={swapFor ? "relic-drop" : "relic-option"}
                  data-relic={id}
                  aria-keyshortcuts={index < 9 ? keys(index + 1) : undefined}
                  onClick={() => (swapFor ? onPick(swapFor, id) : onPick(id))}
                >
                  {letterKeys && index < 9 && <span className="gx-relic-key" aria-hidden="true">{index + 1}</span>}
                  <span className="gx-relic-emblem">
                    <RelicIcon id={id} size={24} />
                  </span>
                  <span className="gx-relic-copy">
                    <b lang="en">{relic.label}</b>
                    <strong>{relic.name}</strong>
                    <small>{relic.text}</small>
                  </span>
                  {swapFor ? <em className="gx-relic-tier">내려놓기</em> : relic.unlock && <em className="gx-relic-tier">해금</em>}
                </button>
              </li>
            );
          })}
        </ul>
        <div className="gx-draft-foot">
          <ol className="gx-codex" aria-label={`도구 도감, ${RELIC_IDS.length}개 중 ${unlockedCount}개 해금`}>
            {RELIC_IDS.map((id) => {
              const locked = Boolean(RELICS[id].unlock) && !codex.unlocked.includes(id);
              const state = owned.includes(id) ? "is-owned" : locked ? "is-locked" : "is-open";
              return (
                <li key={id} className={state} title={locked ? `잠김 · ${RELICS[id].unlock.text}` : `${RELICS[id].label} · ${RELICS[id].name}`}>
                  {locked ? <Lock size={12} aria-hidden="true" /> : <RelicIcon id={id} size={12} />}
                  {/* The strip is icons; what each one is was only in its tooltip. */}
                  <span className="sr-only">
                    {locked ? `잠김, ${RELICS[id].unlock.text}` : `${RELICS[id].name}${owned.includes(id) ? ", 장착" : ""}`}
                  </span>
                </li>
              );
            })}
          </ol>
          {/* Every locked feat, not only the next one. The rest were each in
              their icon's tooltip, which a touch screen never shows. Folded,
              so the draft is no taller until it is asked. */}
          {lockedFeats.length > 1 ? (
            <details className="gx-codex-note" data-testid="relic-unlock-feats">
              <summary>
                {codexCount} · 다음 해금: {lockedFeats[0]} · 나머지 {lockedFeats.length - 1}개 보기
              </summary>
              {lockedFeats.slice(1).join(" · ")}
            </details>
          ) : (
            <small className="gx-codex-note">
              {codexCount}
              {lockedFeats.length ? ` · 다음 해금: ${lockedFeats[0]}` : " · 모두 해금"}
            </small>
          )}
          {swapFor && (
            <button type="button" className="ghost gx-draft-skip" data-testid="relic-swap-back" aria-keyshortcuts="Escape" onClick={onBack}>
              다른 도구 보기
            </button>
          )}
          <button type="button" className="ghost gx-draft-skip" data-testid="relic-skip" aria-keyshortcuts={swapFor ? undefined : "Escape"} aria-describedby="gx-draft-breather" onClick={onSkip}>
            고르지 않고 {BREATHER.name} · {BREATHER.short}
          </button>
          {/* The whole of it for a screen reader; the eye reads the button's short form (no line more on a phone). */}
          <span className="sr-only" id="gx-draft-breather">{BREATHER.text}</span>
        </div>
      </div>
    </div>
  );
}
