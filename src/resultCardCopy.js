/**
 * What the ending screen says around the result card: the two buttons, the
 * line under them, and what the status paragraph announces.
 *
 * They are apart from the card's own modules because the screen needs them
 * before the card exists. This file imports nothing, so the screen's chunk can
 * take it whole while the model and the canvas code stay behind a lazy import.
 */
export const RESULT_CARD_COPY = Object.freeze({
  shareLabel: "결과 카드 공유",
  saveLabel: "결과 카드 저장",
  making: "카드를 만드는 중입니다.",
  saved: "결과 카드를 저장하고 소개 문구를 복사했습니다.",
  savedUncopied: "결과 카드를 저장했습니다. 문구는 복사하지 못했습니다.",
  shared: "결과 카드를 공유했습니다.",
  failed: "카드를 만들지 못했습니다. 다시 눌러 주세요.",
  note: "카드에는 이름이 들어가지 않습니다.",
});

/**
 * What to announce for each answer of `shareOrSave`. A share sheet the player
 * closed is not news, so "cancelled" announces nothing.
 */
export const RESULT_CARD_STATUS = Object.freeze({
  shared: RESULT_CARD_COPY.shared,
  saved: RESULT_CARD_COPY.saved,
  "saved-uncopied": RESULT_CARD_COPY.savedUncopied,
  cancelled: "",
  failed: RESULT_CARD_COPY.failed,
});
