import { Lock, Zap } from "lucide-react";
import { GuardedButton } from "../components/GuardedButton.jsx";
import { getCardBurn, getCardChips, REFRAME_CARD_ID } from "./gauntletEngine.js";
import { getLogicType } from "./logicStreak.js";
import { describeCardMove, getTypeParts } from "./tableReadout.js";
import { useShortcutHints } from "../state/accessibilitySettings.js";

/**
 * The hand: every card the scene deals, and 판을 다시 짠다 after them.
 *
 * A card says what it pays and what it burns. One guard decides whether any of
 * them can be pressed -- the table is live, open and not already advancing --
 * and each card adds its own lock on top. The cards and the wild card each
 * spelled that guard out, and the wild card's copy had lost `tableOpen`.
 *
 * A face-down card still has a name: the glyphs that hide its numbers are for
 * the eye, and a screen reader is told the numbers are hidden.
 *
 * Every card says its type (`CardType`): the logic streak is earned by which
 * type is picked from scene to scene, so a hand that cannot see the type
 * cannot play for it. The tag sits on the card's top edge, out of the card's
 * flow, because a phone's hand has no room to give it (measured at 360x740
 * and 390x844 on the heaviest boards: in the stats row it wrapped under the
 * burn and put a staked hand 5px under the action bar, and at the head of the
 * label it cost a three-line label its line and a sealed hand 13px). It is in
 * the button, so it is in the card's name.
 * `moveOf` says what picking a card would do to the streak, once the case has
 * the rule; the tag of a card that would not end the streak is lit. On a phone
 * the tag prints one word of the name and the rest is for a screen reader (the
 * `i` elements, which play.css clips there).
 */
export function CardType({ card, moveOf }) {
  const move = moveOf?.(card);
  const [before, word, after] = getTypeParts(getLogicType(card));
  return (
    <span className={`gx-card-type${move && move !== "break" ? " is-on" : ""}`} data-testid="card-type" data-move={move ?? ""}>
      <span className="sr-only">유형 </span>
      {before && <i>{before}</i>}
      {word}
      {after && <i>{after}</i>}
      {move && <span className="sr-only">{describeCardMove(move)}</span>}
    </span>
  );
}

export function GauntletHand({
  cards,
  reframeChoice,
  schema,
  resourceMeta,
  selectedId,
  sealedId,
  sealBroken,
  blocked,
  isCardOpen,
  getLockReason,
  visibleEffects,
  hiddenEffectCount,
  fractureAxis,
  moveOf,
  onSelect,
}) {
  // The digit on a card is its key. With the single-key shortcuts off it is
  // neither announced nor drawn.
  const { letterKeys, keys } = useShortcutHints();
  const handSize = cards.length + (reframeChoice ? 1 : 0);
  const overclocked = schema.mutations.includes("overclock");
  const reframeSelected = selectedId === REFRAME_CARD_ID;
  const labelOf = (key) => resourceMeta[key]?.label ?? key;

  return (
    <div className={`choices gx-hand hand-${handSize}`} data-hand={handSize} role="group" aria-label="카드">
      {cards.map((card, index) => {
        const open = isCardOpen(card);
        const burn = getCardBurn(card, schema);
        const selected = selectedId === card.id;
        const sealed = card.id === sealedId && !sealBroken;
        return (
          <GuardedButton
            type="button"
            key={card.id}
            className={`choice gx-card${selected ? " selected" : ""}${sealed ? " is-sealed" : ""}${burn?.fractured ? " is-fractured" : ""}${open ? "" : " locked-choice"}`}
            aria-pressed={selected}
            aria-keyshortcuts={keys(index + 1)}
            blocked={blocked || !open}
            onClick={() => onSelect(card.id)}
          >
            {letterKeys && <span className="gx-card-key" aria-hidden="true">{index + 1}</span>}
            <CardType card={card} moveOf={moveOf} />
            <span className="gx-card-label" data-testid="card-label">{card.label}</span>
            {schema.faceDown ? (
              <span className="gx-card-stats">
                <b className="gx-card-chips" aria-hidden="true">▒▒</b>
                <b className="gx-card-burn" aria-hidden="true">▒▒▒▒</b>
                <span className="sr-only">칩과 소모가 가려진 카드</span>
              </span>
            ) : (
              <span className="gx-card-stats">
                <b className="gx-card-chips">+{getCardChips(card, schema)}</b>
                <b className="gx-card-burn">
                  {burn ? `${labelOf(burn.key)} ${burn.value > 0 ? "+" : ""}${burn.value}` : "소모 없음"}
                  {burn?.fractured && <Zap size={11} aria-hidden="true" />}
                </b>
                {/* A board rule that touches every card is a badge in the stats
                    row, not a line of its own on every card: on an overclocked
                    board those lines made each card 25px taller. The rules panel
                    says what the rule is; the badge says which cards it bills. */}
                {burn?.fractured && (
                  <i className="gx-card-rule-tax" data-testid="fracture-tax">
                    <span className="sr-only">균열 청구 </span>
                    {schema.fractureRate}x
                  </i>
                )}
                {overclocked && (
                  <i className="gx-card-overclock" data-testid="overclock-card-boost">
                    <span className="sr-only">오버클럭 칩 </span>
                    x2
                  </i>
                )}
              </span>
            )}
            {/* The staked card carries its own detail. It used to be a strip
                fixed over the bottom of the hand, which covered the last row
                of cards the moment one was chosen. */}
            {selected && !schema.faceDown && (
              <span className="gx-card-preview">
                <span className="sr-only">선택한 카드의 상세 영향: </span>
                {/* First: it is the one chip about the next board rather than
                    this one, and a short phone shows a single line of them. */}
                {fractureAxis && (
                  <i className="gx-card-crack" data-testid="fracture-candidate">
                    균열 후보 · {labelOf(fractureAxis)}
                  </i>
                )}
                {visibleEffects.map((effect) => (
                  <i key={effect.key} className={effect.gain ? "gain" : "cost"}>
                    {effect.label} {effect.value > 0 ? "+" : ""}{effect.value}
                  </i>
                ))}
                {hiddenEffectCount > 0 && <i>외 {hiddenEffectCount}</i>}
              </span>
            )}
            {sealed && (
              <span className="gx-card-seal" data-testid="sealed-card-lock">
                <Lock size={12} aria-hidden="true" /> 최고 칩 봉인 {schema.sealBreak}
              </span>
            )}
            {!open && <span className="gx-card-seal">LOCKED · {getLockReason(card)}</span>}
          </GuardedButton>
        );
      })}
      {reframeChoice && (
        <GuardedButton
          type="button"
          className={`choice gx-card gx-card-wild${reframeSelected ? " selected" : ""}`}
          aria-pressed={reframeSelected}
          aria-keyshortcuts={keys(cards.length + 1)}
          blocked={blocked}
          onClick={() => onSelect(REFRAME_CARD_ID)}
        >
          {letterKeys && <span className="gx-card-key" aria-hidden="true">{cards.length + 1}</span>}
          <CardType card={reframeChoice} moveOf={moveOf} />
          <span className="gx-card-label" data-testid="card-label">{reframeChoice.label}</span>
          <span className="gx-card-stats">
            <b className="gx-card-chips">WILD +{getCardChips(reframeChoice, schema)}</b>
            <b className="gx-card-burn">이 판을 다시 연다</b>
          </span>
        </GuardedButton>
      )}
    </div>
  );
}
