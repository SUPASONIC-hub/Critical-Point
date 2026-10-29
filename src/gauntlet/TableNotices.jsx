import { useRef } from "react";
import { RefreshCcw, Skull } from "lucide-react";
import { RELICS } from "./relics.js";
import { RelicIcon } from "./RelicDraft.jsx";
import { formatMultiplier, formatNumber, getDirectionName, getDirectionParts, getTabNotices, getTypeName } from "./tableReadout.js";
import { STANCE_MASTERY_GOAL } from "./gauntletEngine.js";
import { getLogicDirection, getLogicType } from "./logicStreak.js";
import { SCOUT_SECONDS } from "./tableRules.js";
import { useDialogFocus } from "./useDialogFocus.js";
import { useTableVoice } from "./tableVoice.js";
import { EdgeNotice } from "./EdgeNotice.jsx";
import tableCopy from "../copy/table.js";
import { fill } from "../locale.js";

// What lands over the table, in words (src/copy/table.js).
const say = tableCopy.notices;

/** This tab's table stopped because another tab has the window. */
function LostToTab({ onReload }) {
  return (
    <div className="gx-breach gx-lost-tab" role="alert" data-testid="table-lost-to-tab">
      <span className="gx-breach-kicker">{say.lostKicker}</span>
      <p>{say.lostText}</p>
      <button type="button" className="ghost" onClick={() => (onReload ? onReload() : globalThis.location.reload())}>
        <RefreshCcw size={14} aria-hidden="true" /> {say.reload}
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
      <span id="gx-held-title" className="gx-breach-kicker">{say.heldKicker}</span>
      <p id="gx-held-text">{say.heldText}</p>
      <div className="gx-held-actions">
        <button type="button" className="ghost" data-testid="claim-held-window" onClick={onClaim}>
          {say.claim}
        </button>
        <button ref={leaveRef} type="button" className="ghost" data-testid="leave-held-window" onClick={onLeave}>
          {say.leave}
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
              ? say.slamTimeout
              : win.cause === "abandon"
                ? say.slamAbandon
                : fill(say.slamWall, { wall: win.wall })}{" "}
            · {say.slamPot} {formatNumber(runPot)} → {formatNumber(bustKeeps)}
          </span>
        </>
      ) : (
        <>
          <strong>{formatMultiplier(multiplier)}</strong>
          <span>
            +{formatNumber(livePot)}
            {streak > 0 ? fill(say.slamCombo, { streak }) : ""}
          </span>
        </>
      )}
    </div>
  );
}

/** Everything that lands over the table: what it says aloud, the relic just taken, a table lost to or held by another tab, the verdict. */
export function TableNotices({ equipped, tab, caseId, voice, slam, onReload, onClaim, onLeave }) {
  const { lost, held } = getTabNotices(tab);
  const said = useTableVoice(voice);
  return (
    <>
      {/* The table's one voice (tableVoice.js): the push, the stance, the bank and the clock.
          Silent to the eye, and on the page before it has anything to say. */}
      <span className="sr-only" role="status" data-testid="table-voice">{said}</span>
      <EdgeNotice voice={voice} caseId={caseId} />
      {equipped && (
        <div key={`equip-${equipped.n}`} className={`gx-equip-toast relic-${equipped.id}`} role="status" data-testid="relic-equipped">
          <RelicIcon id={equipped.id} size={18} />
          <span>{say.equipped}</span>
          <b lang="en">{RELICS[equipped.id].label}</b>
          {equipped.dropped && <span>{fill(say.dropped, { name: RELICS[equipped.dropped].name })}</span>}
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
 * chain and the LOCK charge. What it stands at, the direction being held
 * (사람 or 자리) and how far the hold has got, and a note -- what the staked
 * card does to it, or that a change of direction would count. What it pays is in the pot's own line.
 *
 * It is not drawn over the pot's corner: on a 360px phone anything there ran
 * under the pot's own numbers, and the streak has more to say. In the
 * signals row it takes room that is its own and adds no height from 프롤로그
 * 04 on, where the row already is. A phone has the width for three words of
 * it: "논리", the " 쪽" after the direction, and the note are not drawn
 * there (play.css) -- the cards' tags say what each card would do -- and the
 * buttons' description reads all of it out.
 */
export function LogicLine({ logic }) {
  const [word, after] = getDirectionParts(logic.type);
  return (
    <span className="gx-streak" data-testid="gauntlet-logic" data-streak={logic.after} data-move={logic.move ?? ""}>
      <b><i>{say.logicWord}</i>{say.comboWord} {logic.after}</b>
      <span>
        {logic.type ? <>{word}{after && <i>{after}</i>} {logic.held}</> : say.firstCard}
      </span>
      {logic.note && <em>{logic.note}</em>}
    </span>
  );
}

/** The relics the run carries, in the bank row. On a phone a chip is its icon; what it does is read in the briefing. */
export function RelicChips({ relics, pulse }) {
  if (!relics.length) return null;
  return (
    <span className="gx-relics" data-testid="gauntlet-relics" role="group" aria-label={say.relicsLabel}>
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
 * The wall band in the gauge's read row, and SCOUT on it. SCOUT sits on the
 * band it narrows: no fourth button in the dock at 360px. Spent, the button
 * stays where it was, aria-disabled, so a focus on it is not dropped to the
 * page. Before the case has SCOUT the band is the plain label the meter
 * already reads out.
 */
export function ScoutBand({ band, canScout, onScout, shortcut }) {
  if (!canScout && !band.scouted) return <span className="gx-band-label" aria-hidden="true">{fill(tableCopy.stage.wallRange, { min: band.wallMin, max: band.wallMax })}</span>;
  return (
    <button type="button" className={`gx-band-label gx-scout${band.scouted ? " is-scouted" : ""}`} data-testid="commit-scout" onClick={onScout} aria-disabled={!canScout}
      aria-keyshortcuts={shortcut} aria-label={band.scouted ? undefined : fill(say.scoutLabel, { min: band.wallMin, max: band.wallMax, seconds: SCOUT_SECONDS })}>
      {fill(tableCopy.stage.wallRange, { min: band.wallMin, max: band.wallMax })} · {band.scouted ? say.scouted : say.scout}
    </button>
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
          opened again once the clock runs. A card's direction is here with
          its thinking type: the tag on the card has room for the direction
          alone, and the report's 관점 전환 reads the type. */}
      <li>{question}</li>
      {cards.map((card, index) => (
        <li key={card.id ?? index}>{fill(say.glossaryCard, { number: index + 1, label: card.label, type: `${getDirectionName(getLogicDirection(card))} · ${getTypeName(getLogicType(card))}` })}</li>
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
          {fill(say.glossaryMastery, { goal: STANCE_MASTERY_GOAL, strike: stanceMastery.strike, steady: stanceMastery.steady, expose: stanceMastery.expose })}
        </li>
      )}
    </>
  );
}
