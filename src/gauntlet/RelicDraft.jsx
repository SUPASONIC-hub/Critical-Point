import { useEffect, useRef, useState } from "react";
import { Bandage, Fan, Gem, KeyRound, Lock, Repeat, ShieldCheck, Snowflake, Stethoscope, Timer } from "lucide-react";
import { RELIC_IDS, RELICS } from "./relics.js";
import { readRelicCodex } from "./useRelicTable.js";

const ICONS = {
  timer: Timer,
  snowflake: Snowflake,
  fan: Fan,
  key: KeyRound,
  bandage: Bandage,
  repeat: Repeat,
  shield: ShieldCheck,
  gem: Gem,
  stethoscope: Stethoscope,
};

export function RelicIcon({ id, size = 14 }) {
  const Icon = ICONS[RELICS[id]?.icon] ?? Lock;
  return <Icon size={size} aria-hidden="true" />;
}

/**
 * The draft a closed case deals at the next case's first table: three relics,
 * one kept for the rest of the season, or none.
 *
 * It is the only thing in front of the table because it is the decision on
 * that screen: the clock does not start until it is answered, and nothing
 * behind it can be staked or pushed. Keys 1-3 take a relic and Escape passes,
 * the same keys the hand uses, so a keyboard player never reaches for the
 * mouse. The codex strip underneath is the season's collection -- what is
 * carried, what is unlocked, and the next feat that opens a locked one.
 */
export function RelicDraft({ offer = [], owned = [], onPick, onSkip }) {
  const [codex] = useState(readRelicCodex);
  const firstOption = useRef(null);
  useEffect(() => {
    firstOption.current?.focus({ preventScroll: true });
  }, []);
  const unlockedCount = RELIC_IDS.filter((id) => !RELICS[id].unlock || codex.unlocked.includes(id)).length;
  const nextLocked = RELIC_IDS.find((id) => RELICS[id].unlock && !codex.unlocked.includes(id));

  return (
    <div className="gx-draft" role="dialog" aria-modal="true" aria-labelledby="gx-draft-title" data-testid="relic-draft">
      <div className="gx-draft-panel">
        <span className="gx-draft-kicker">CASE CLOSED · RELIC DRAFT</span>
        <h2 id="gx-draft-title">다음 사건에 가져갈 도구 하나</h2>
        <p className="gx-draft-lede">고른 도구는 시즌이 끝날 때까지 테이블의 규칙 하나를 바꾼다. 고를 때까지 시계는 멈춰 있다.</p>
        <ul className="gx-draft-hand">
          {offer.map((id, index) => {
            const relic = RELICS[id];
            return (
              <li key={id} style={{ "--gx-deal": index }}>
                <button
                  type="button"
                  ref={index === 0 ? firstOption : undefined}
                  className={`gx-relic-card relic-${id}${relic.unlock ? " is-rare" : ""}`}
                  data-testid="relic-option"
                  data-relic={id}
                  aria-keyshortcuts={String(index + 1)}
                  onClick={() => onPick(id)}
                >
                  <span className="gx-relic-key" aria-hidden="true">{index + 1}</span>
                  <span className="gx-relic-emblem">
                    <RelicIcon id={id} size={24} />
                  </span>
                  <span className="gx-relic-copy">
                    <b>{relic.label}</b>
                    <strong>{relic.name}</strong>
                    <small>{relic.text}</small>
                  </span>
                  {relic.unlock && <em className="gx-relic-tier">해금</em>}
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
                </li>
              );
            })}
          </ol>
          <small className="gx-codex-note">
            도감 {unlockedCount}/{RELIC_IDS.length}
            {nextLocked ? ` · 다음 해금: ${RELICS[nextLocked].unlock.text}` : " · 모두 해금"}
          </small>
          <button type="button" className="ghost gx-draft-skip" data-testid="relic-skip" aria-keyshortcuts="Escape" onClick={onSkip}>
            고르지 않고 진행
          </button>
        </div>
      </div>
    </div>
  );
}
