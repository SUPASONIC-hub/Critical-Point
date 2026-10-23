import { useEffect, useRef } from "react";
import { getAccessibility, setAccessibility } from "../state/accessibilitySettings.js";

/**
 * The reading clock, asked about once (improvement notes A-11 = D-4, user's
 * choice 1 on 2026-10-22).
 *
 * The page's clock opens the table by itself at ten characters a second
 * (gauntletEngine.js), and the first scenes of the season are the ones with
 * the most to read. So until the player has answered, 프롤로그 01-02 open with
 * the clock held -- the table opens when they press 판 열기 -- and the first
 * page the clock would open by itself stops at nought and asks instead:
 * 「다 읽고 직접 열기로 바꿀까요?」. Yes is the comfort setting
 * (`holdReadingClock`); no opens the table as the clock would have. Either is
 * the answer, written as `readingClockAsked`, and the page never asks again.
 * A player who already holds the clock is never asked.
 *
 * Reading time is not in the score: the table's 45 seconds start when the page
 * closes, whoever closes it. A file of its own (READING_CLOCK_ASK in
 * vite.config.js) for the same reason as WeekRulePanel: the PlayScreen chunk
 * has no room.
 */
const READ_FIRST_CASES = new Set(["prologue01", "prologue02"]);

/** How this page's clock starts: held or not, and whether running out asks first. */
export function readingClockStart(caseId) {
  const { holdReadingClock, readingClockAsked } = getAccessibility();
  const ask = !holdReadingClock && !readingClockAsked;
  return { held: holdReadingClock || (ask && READ_FIRST_CASES.has(caseId)), ask };
}

/** The question, under the page's grid. `onAnswer(true)` keeps the page held; `false` opens the table. */
export function ReadingClockAsk({ onAnswer }) {
  const first = useRef(null);
  useEffect(() => first.current?.focus(), []);
  const answer = (hold) => {
    setAccessibility(hold ? { readingClockAsked: true, holdReadingClock: true } : { readingClockAsked: true });
    onAnswer(hold);
  };
  return (
    <div className="gx-panel gx-panel-breach gx-carry" data-testid="reading-clock-ask" role="group" aria-labelledby="gx-read-ask" style={{ gridArea: "auto" }}>
      <p className="gx-breach-kicker">읽는 시간이 끝났다</p>
      <p id="gx-read-ask">다 읽고 직접 열기로 바꿀까요?</p>
      <small>바꾸면 장면이 저절로 넘어가지 않고, 판 열기를 눌러야 판이 열린다. 편의 설정에서 되돌릴 수 있다.</small>
      <div className="gx-comic-cards">
        <button type="button" ref={first} className="gx-comic-card" data-testid="reading-clock-hold" onClick={() => answer(true)}>
          직접 열기로 바꾼다
        </button>
        <button type="button" className="gx-comic-card" data-testid="reading-clock-keep" onClick={() => answer(false)}>
          시계에 맡긴다
        </button>
      </div>
    </div>
  );
}
