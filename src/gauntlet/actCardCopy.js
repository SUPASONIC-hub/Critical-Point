import { CASE_SEQUENCE } from "../gameCases.js";
import actCardCopy from "../copy/actCard.js";

/**
 * B-11(1), the act title card (막 표지): one card in front of the page that
 * opens 사건 01·08·13·19·25·31·37·43 -- the act's number and cases, its name,
 * one sentence, and how many cases are left to the season's end. The names
 * are the README's acts; 2막 had none and is named for 사건 10, 「그 집념의 값」.
 *
 * It holds nothing: one press of any key, a tap anywhere, or `ACT_CARD_MS`
 * running out, and the briefing comes up behind it (ActCardFold.jsx says when
 * it is shown). The card is a dialog named by the act and described by its
 * sentence and count, so a screen reader reads it once, as focus lands on 계속.
 * The bar under 계속 is the time left; it does not move under reduced motion
 * or calm effects.
 */
export const ACT_CARD_MS = 7000;

// The act's number by the case that opens it; its cases, name and sentence are src/copy/actCard.js.
const ACTS = { case01: 1, case08: 2, case13: 3, case19: 4, case25: 5, case31: 6, case37: 7, case43: 8 };

export const ACT_CARDS = Object.freeze(
  Object.fromEntries(Object.entries(ACTS).map(([caseId, act]) => [caseId, { act, ...actCardCopy.cards[caseId] }])),
);

/** The cases from this one to the season's last, this one counted. */
export const casesLeft = (caseId) => CASE_SEQUENCE.length - CASE_SEQUENCE.indexOf(caseId);
