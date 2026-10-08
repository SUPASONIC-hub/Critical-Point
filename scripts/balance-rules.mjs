/**
 * How a card's label is read against what the card does to the clock (rule 7
 * of `check-balance.mjs`). It lives apart from the check because that script
 * walks the whole season when it is imported, and a rule that cannot be asked
 * about one label cannot be tested on one.
 *
 * 시간 is time left today. The season's rule, as its echoes tell it, is that
 * putting a thing off buys today at a later price: "초안은 한 시간 만에
 * 끝납니다", "미루면 오늘 밤은 조용합니다". So:
 *
 * - A label that waits or puts a thing off (미룬다, 보류한다, 늦춘다, 뒤로
 *   돌린다, 기다린다) may gain time. It is refused only when the card LOSES
 *   time and the label is nothing but the putting-off: the wait word is its
 *   last verb, and nothing before it names a second act (…고, …며, …채,
 *   …부터) or a span that is waited through (…까지, 동안, 며칠, 하루, 곁).
 *   "공개를 미룬다" at time -4 has nothing in it that could have spent the
 *   four; "서명은 미루고 더 모은다" and "하루를 더 기다린다" do.
 * - A label that says it acts at once (바로, 즉시, 곧장) may not lose time.
 *   Acting at once is the claim that no time is taken, so a card that costs
 *   the clock for what it does (driving there, filing it) says so without the
 *   word.
 *
 * Only the words that say so outright are read, and not where the label
 * refuses them ("미루지 않고") or 바로 means something else (바로잡는다, 바로
 * 그 서류). A label that says both is not read: "미루지 말고 바로" is one
 * claim, and "기다리는 사람에게 곧장" is none about the card's own clock.
 *
 * Until 2026-10-08 the first half read the other way -- a label that waited
 * could not gain time -- and held 54 cards the season deals as exceptions,
 * every one of them a card whose echo says today was bought.
 */
const WAITS = /기다리|기다린|미루|미룬|보류|유예|늦추|늦춘|연기한|연기하|뒤로 돌리|뒤로 돌린/g;
const ACTS_NOW = /(?<!올)바로(?!잡| 그| 앞| 옆| 뒤| 위| 아래| 전| 다음)|즉시|곧장/g;

/** The word is refused, not said: 미루지 않고, 기다리지 말고, 보류하지 못한다. */
const refused = (label, match) => /^[가-힣]{0,2}지 (?:않|말|못)|^하지 (?:않|말|못)/.test(label.slice(match.index + match[0].length));
const said = (label, pattern) => [...label.matchAll(pattern)].filter((match) => !refused(label, match));

/** What is left after the wait word when it is the label's last verb: 다, 한다, 자고 한다, 라고 한다. */
const ENDS_THE_LABEL = /^[가-힣]{0,3}(?: 한다)?$/;
/** A second act the card does now, or a span it waits through. Either can cost the clock. */
const SPENDS_TIME = /[가-힣](?:고|며|면서|채|부터) |까지|동안|며칠|하루|이틀|사흘|밤새|곁/;

/** True when the label does nothing but put a thing off: no second act, no span waited through. */
export function onlyPutsOff(label = "") {
  const waits = said(label, WAITS);
  if (waits.length === 0) return false;
  const last = waits[waits.length - 1];
  return ENDS_THE_LABEL.test(label.slice(last.index + last[0].length)) && !SPENDS_TIME.test(label.slice(0, last.index));
}

/**
 * Why `label` disagrees with a card that moves the clock by `time`, or null
 * when it does not. The sentence is what the check prints after the card's id.
 */
export function clockMismatch(label = "", time = 0) {
  const waits = said(label, WAITS).length > 0;
  const actsNow = said(label, ACTS_NOW).length > 0;
  if (waits === actsNow) return null;
  if (waits && time < 0 && onlyPutsOff(label)) return `only puts a thing off and loses time (${time})`;
  if (actsNow && time < 0) return `acts at once and loses time (${time})`;
  return null;
}
