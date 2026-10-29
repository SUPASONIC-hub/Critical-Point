/**
 * What the ending screen says around the result card: the two buttons, the
 * line under them, and what the status paragraph announces.
 *
 * They are apart from the card's own modules because the screen needs them
 * before the card exists. It imports only its words (src/copy/resultCard.js,
 * where another language is laid over them), so the screen's chunk can take it
 * whole while the model and the canvas code stay behind a lazy import.
 */
import resultCardCopy from "./copy/resultCard.js";

export const RESULT_CARD_COPY = resultCardCopy;

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
