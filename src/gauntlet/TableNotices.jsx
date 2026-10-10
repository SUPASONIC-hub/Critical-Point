import { useRef } from "react";
import { RefreshCcw, Skull } from "lucide-react";
import { RELICS } from "./relics.js";
import { RelicIcon } from "./RelicDraft.jsx";
import { formatMultiplier, formatNumber, getClockCall, getTabNotices, getTypeName, getTypeParts } from "./tableReadout.js";
import { STANCE_MASTERY_GOAL } from "./gauntletEngine.js";
import { getLogicType } from "./logicStreak.js";
import { useDialogFocus } from "./useDialogFocus.js";

/** This tab's table stopped because another tab has the window. */
function LostToTab({ onReload }) {
  return (
    <div className="gx-breach gx-lost-tab" role="alert" data-testid="table-lost-to-tab">
      <span className="gx-breach-kicker">이 판은 다른 탭에서 잡혔다</span>
      <p>한 판은 한 테이블에서만 걸 수 있다. 이 탭의 판은 멈췄다.</p>
      <button type="button" className="ghost" onClick={() => (onReload ? onReload() : globalThis.location.reload())}>
        <RefreshCcw size={14} aria-hidden="true" /> 다시 불러오기
      </button>
    </div>
  );
}

/**
 * The question a second tab asks before it takes a bet another tab is holding.
 * It is a dialog that wants an answer, so it has a name, takes focus when it
 * opens and keeps Tab inside: it said `alertdialog` and did none of the three.
 * Escape is the answer that changes nothing -- 그 탭에 두기 -- which is also
 * where focus starts.
 */
function HeldElsewhere({ onClaim, onLeave }) {
  const dialogRef = useRef(null);
  const leaveRef = useRef(null);
  const trapTab = useDialogFocus(dialogRef, leaveRef);
  const onKeyDown = (event) => {
    if (event.key !== "Escape") return trapTab(event);
    event.preventDefault();
    return onLeave();
  };
  return (
    <div
      ref={dialogRef}
      className="gx-breach gx-held-elsewhere"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="gx-held-title"
      aria-describedby="gx-held-text"
      data-testid="table-held-elsewhere"
      onKeyDown={onKeyDown}
    >
      <span id="gx-held-title" className="gx-breach-kicker">이 판은 다른 탭에서 걸려 있다</span>
      <p id="gx-held-text">
        다른 탭(또는 이전 세션)에서 카드를 걸어 둔 판입니다. 여기서 이어가면 그 판은 떠난 판으로 BUST 처리됩니다.
        아직 그 탭에서 하는 중이면 그대로 두세요.
      </p>
      <div className="gx-held-actions">
        <button type="button" className="ghost" data-testid="claim-held-window" onClick={onClaim}>
          여기서 이어가기 · BUST 처리
        </button>
        <button ref={leaveRef} type="button" className="ghost" data-testid="leave-held-window" onClick={onLeave}>
          그 탭에 두기
        </button>
      </div>
    </div>
  );
}

/** The verdict, slammed over the table for the beat before the reveal opens. */
function VerdictSlam({ window: win, multiplier, livePot, streak, runPot, bustKeeps }) {
  return (
    <div className={`gx-slam gx-slam-${win.status}`} role="alert">
      {win.status === "bust" ? (
        <>
          <Skull size={56} aria-hidden="true" />
          <strong lang="en">BUST</strong>
          <span>
            {win.cause === "timeout"
              ? "시간이 먼저 끝났다"
              : win.cause === "abandon"
                ? "테이블을 떠났다"
                : `벽은 ${win.wall}에 있었다`}{" "}
            · 판돈 {formatNumber(runPot)} → {formatNumber(bustKeeps)}
          </span>
        </>
      ) : (
        <>
          <strong>{formatMultiplier(multiplier)}</strong>
          <span>
            +{formatNumber(livePot)}
            {streak > 0 ? ` · 논리 콤보 ${streak}` : ""}
          </span>
        </>
      )}
    </div>
  );
}

/** Everything that lands over the table: the relic just taken, a table lost to or held by another tab, the verdict. */
export function TableNotices({ equipped, tab, clock, slam, onReload, onClaim, onLeave }) {
  const { lost, held } = getTabNotices(tab);
  return (
    <>
      {/* The clock's calls: silent to the eye, and on the page before they have anything to say. */}
      <span className="sr-only" role="status">{getClockCall(clock)}</span>
      {equipped && (
        <div key={`equip-${equipped.n}`} className={`gx-equip-toast relic-${equipped.id}`} role="status" data-testid="relic-equipped">
          <RelicIcon id={equipped.id} size={18} />
          <span>장착</span>
          <b>{RELICS[equipped.id].label}</b>
        </div>
      )}
      {lost && <LostToTab onReload={onReload} />}
      {held && <HeldElsewhere onClaim={onClaim} onLeave={onLeave} />}
      {slam && <VerdictSlam {...slam} />}
    </>
  );
}

/**
 * The logic streak in the HUD: the third of the hand's signals, beside the
 * chain and the LOCK charge. What it stands at, the type being held and how
 * far the hold has got, and a note -- what the staked card does to it, or
 * that a change of type would count. What it pays is in the pot's own line.
 *
 * It is not drawn over the pot's corner: on a 360px phone anything there ran
 * under the pot's own numbers, and the streak has more to say. In the
 * signals row it takes room that is its own and adds no height from 프롤로그
 * 04 on, where the row already is. A phone has the width for three words of
 * it: "논리", all of the type's name but one word, and the note are not drawn
 * there (play.css) -- the cards' tags say what each card would do -- and the
 * buttons' description reads all of it out.
 */
export function LogicLine({ logic }) {
  const [before, word, after] = getTypeParts(logic.type);
  return (
    <span className="gx-streak" data-testid="gauntlet-logic" data-streak={logic.after} data-move={logic.move ?? ""}>
      <b><i>논리 </i>콤보 {logic.after}</b>
      <span>
        {logic.type ? <>{before && <i>{before}</i>}{word}{after && <i>{after}</i>} {logic.held}</> : "첫 카드부터"}
      </span>
      {logic.note && <em>{logic.note}</em>}
    </span>
  );
}

/** The relics the run carries, in the bank row. On a phone a chip is its icon; what it does is read in the briefing. */
export function RelicChips({ relics, pulse }) {
  if (!relics.length) return null;
  return (
    <span className="gx-relics" data-testid="gauntlet-relics" role="group" aria-label="장착한 도구">
      {relics.map((id) => (
        <b
          key={pulse?.id === id ? `${id}-${pulse.n}` : id}
          className={`gx-relic-chip relic-${id}${pulse?.id === id ? " is-proc" : ""}`}
          title={`${RELICS[id].label} · ${RELICS[id].text}`}
        >
          <RelicIcon id={id} size={12} />
          <span className="gx-relic-name">{RELICS[id].name}</span>
          <span className="sr-only">: {RELICS[id].text}</span>
        </b>
      ))}
    </span>
  );
}

/**
 * What the table's badges stand for, in the folded briefing.
 *
 * A relic chip, a mastery count and the two card badges each explained
 * themselves in a `title`, which a phone never shows and a screen reader reads
 * late or not at all -- and on a phone the relic chip is an icon with its name
 * hidden. The briefing is already where the table is looked up while it runs,
 * so the explanations are lines in it rather than a panel in front of the hand.
 */
export function TableGlossary({ question, cards = [], mutations, relics, stanceMastery }) {
  return (
    <>
      {/* The question and the cards in full. On the table both are cut to a
          line count, and the briefing page that printed them whole cannot be
          opened again once the clock runs. A card's type is here in full too:
          a phone's card has room for one word of it. */}
      <li>{question}</li>
      {cards.map((card, index) => (
        <li key={card.id ?? index}>카드 {index + 1}: {card.label} ({getTypeName(getLogicType(card))})</li>
      ))}
      {mutations.map((mutation) => (
        <li key={mutation.id}>
          {mutation.label}: {mutation.text}
        </li>
      ))}
      {relics.map((id) => (
        <li key={id}>
          {RELICS[id].name} ({RELICS[id].label}): {RELICS[id].text}
        </li>
      ))}
      {/* No mastery to explain until the case lets the player choose a stance. */}
      {stanceMastery && (
        <li>
          시즌 숙련: 차지를 채운 채로 확정한 판의 수. 자세마다 {STANCE_MASTERY_GOAL}판을 채우면 새 판의 규칙이 바뀐다 (STRIKE {stanceMastery.strike} · STEADY {stanceMastery.steady} · EXPOSE{" "}
          {stanceMastery.expose}).
        </li>
      )}
    </>
  );
}
