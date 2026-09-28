import { Lock, Zap } from "lucide-react";
import { GuardedButton } from "../components/GuardedButton.jsx";
import { getCardBurn, getCardChips, REFRAME_CARD_ID } from "./gauntletEngine.js";

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
 */
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
  onSelect,
}) {
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
            aria-keyshortcuts={String(index + 1)}
            blocked={blocked || !open}
            onClick={() => onSelect(card.id)}
          >
            <span className="gx-card-key" aria-hidden="true">{index + 1}</span>
            <span className="gx-card-label">{card.label}</span>
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
                {visibleEffects.map((effect) => (
                  <i key={effect.key} className={effect.gain ? "gain" : "cost"}>
                    {effect.label} {effect.value > 0 ? "+" : ""}{effect.value}
                  </i>
                ))}
                {hiddenEffectCount > 0 && <i>외 {hiddenEffectCount}</i>}
                {fractureAxis && (
                  <i className="gx-card-crack" data-testid="fracture-candidate">
                    균열 후보 · {labelOf(fractureAxis)}
                  </i>
                )}
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
          aria-keyshortcuts={String(cards.length + 1)}
          blocked={blocked}
          onClick={() => onSelect(REFRAME_CARD_ID)}
        >
          <span className="gx-card-key" aria-hidden="true">{cards.length + 1}</span>
          <span className="gx-card-label">{reframeChoice.label}</span>
          <span className="gx-card-stats">
            <b className="gx-card-chips">WILD +{getCardChips(reframeChoice, schema)}</b>
            <b className="gx-card-burn">이 판을 다시 연다</b>
          </span>
        </GuardedButton>
      )}
    </div>
  );
}
