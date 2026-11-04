import { RELIC_EXTRA_COST, RELIC_REROLL_COST } from "./relics.js";

/**
 * What the draft's two buttons say (C9, the KD은행 계좌 at the draft; the
 * engine's `rerollRelicOffer` and `buyExtraRelic` do the paying). Each button
 * is either open, or off with the one reason that holds, in this order:
 *
 *   practice  a Case played again: its vault is lent, not the season's
 *   story     Story mode: its wall is not the season's
 *   record    a draft from a save before the record (no `relicDraft`): it
 *             cannot be priced or checked, so it is only picked from
 *   used      bought already in this draft
 *   picked    a relic is already taken (both buys come before the first pick)
 *   few       one more needs two or more still offered
 *   short     the vault holds less than the price
 *
 * `second` is true while a draft that bought one more waits for its second
 * pick. Pure, so the rules the buttons show are the engine's (the unit tests
 * hold the two side by side).
 */
export function readDraftSpend(run) {
  const draft = run?.relicDraft ?? null;
  const offer = Array.isArray(run?.relicOffer) ? run.relicOffer : [];
  const vault = Math.max(0, Number(run?.vault) || 0);
  const picked = draft?.picked?.length ?? 0;
  const common = run?.practice ? "practice" : run?.story === true ? "story" : !draft ? "record" : null;
  const reason = (bought, cost, extra) => common ?? (bought ? "used" : picked ? "picked" : extra && offer.length < 2 ? "few" : vault < cost ? "short" : null);
  const reroll = reason(Boolean(draft?.reroll), RELIC_REROLL_COST, false);
  const extra = reason(Boolean(draft?.extra), RELIC_EXTRA_COST, true);
  return {
    reroll: { cost: RELIC_REROLL_COST, open: reroll === null, reason: reroll },
    extra: { cost: RELIC_EXTRA_COST, open: extra === null, reason: extra },
    second: Boolean(draft?.extra) && picked === 1 && offer.length > 0,
  };
}
