/**
 * Where a scene's sentences end (caption-split, 2026-11-03): one cut shared by
 * the briefing's caption boxes (proseMarks.js captionGroups, Prose.jsx) and the
 * balloon's box numbers (gauntlet/speakerLine.js), so the name chip lands on
 * the box that holds the speech.
 *
 * The cut was `split(/(?<=[.!?])\s+/)`, which missed two ends:
 *   - a speech closed right after its full stop, `…왔어요.' 봉투 맨 뒤에는`:
 *     the stop is followed by the quote, not a space, so the speech and the
 *     narration after it were one sentence (and one box) in 863 Korean scenes;
 *   - a Japanese full stop, exclamation or question mark (U+3002, U+FF01,
 *     U+FF1F), which no space follows: 1,118 Japanese scenes
 *     were a single box.
 * In Japanese a quote right after a full stop may close the speech before it
 * or open the one after it (the verb "says", a stop, then the quote), so the quotes are
 * counted in pairs (proseMarks.js's rule: an apostrophe between two Latin
 * letters is not a quote, and an unmatched last quote opens nothing) and a
 * quote after a stop belongs to the sentence only when it closes one.
 *
 * Imports nothing: speakerLine.js is a chunk of its own and must not pull the
 * marks' module out of theirs (vite.config.js, SPEAKER_LINE).
 */

const LATIN_STOP = /[.!?]/;
// Built from code points so the font check does not count them as printed
// copy: the Japanese page is set in the system face, and the Korean subset
// need not carry them (scripts/check-fonts.mjs).
const CJK_STOPS = String.fromCharCode(0x3002, 0xff01, 0xff1f);
const CJK_STOP = new RegExp(`[${CJK_STOPS}]`);
// A speech may close after these too ('그런데…' 그가 / '좋아요~' 그가).
const SPEECH_STOP = new RegExp(`[.!?…~${CJK_STOPS}]`);
const ANY_STOP = SPEECH_STOP;

/**
 * The indexes of the quotes that pair up: the one rule proseMarks.js (speech
 * marks), speakerLine.js (speech spans) and the sentence cut here share.
 *   - An apostrophe between two Latin letters (analyst's) is not a quote.
 *   - A plural possessive (the analysts' room, employees' catches) is not
 *     one either: a quote right after an "s", followed by a space and a
 *     lower-case letter, while no speech is open. Counted as a quote it
 *     shifted every pair after it, so 'Sit.' in "The analysts' room is cold.
 *     Kim says, 'Sit.' She waits." did not end its sentence (11-04).
 *   - An unmatched last quote opens nothing.
 */
export function pairedQuotes(text) {
  const quotes = [];
  for (let index = 0; index < text.length; index += 1) {
    if (text[index] !== "'") continue;
    const before = text[index - 1] ?? "";
    if (/[A-Za-z]/.test(before) && /[A-Za-z]/.test(text[index + 1] ?? "")) continue;
    const open = quotes.length % 2 === 1;
    if (!open && before === "s" && text[index + 1] === " " && /[a-z]/.test(text[index + 2] ?? "")) continue;
    quotes.push(index);
  }
  if (quotes.length % 2 === 1) quotes.pop();
  return quotes;
}

/**
 * The sentences of a prose string as `{ start, end, opensInSpeech, closesSpeech }`:
 * `start`/`end` index the string (trimmed of spaces), `opensInSpeech` is true
 * when the sentence starts inside a speech that opened before it, and
 * `closesSpeech` when it ends on the quote that closes a speech.
 */
export function proseSentences(text = "") {
  const source = String(text ?? "");
  const quotes = pairedQuotes(source);
  const role = new Map(quotes.map((at, order) => [at, order % 2 === 0 ? "open" : "close"]));
  const out = [];
  let start = 0;
  let open = false;
  let openAtStart = false;
  const push = (end) => {
    let from = start;
    while (from < end && /\s/.test(source[from])) from += 1;
    let to = end;
    while (to > from && /\s/.test(source[to - 1])) to -= 1;
    if (to > from) out.push({ start: from, end: to, opensInSpeech: openAtStart && source[from] !== "'", closesSpeech: role.get(to - 1) === "close" });
    start = end;
    openAtStart = open;
  };
  for (let index = 0; index < source.length; index += 1) {
    const ch = source[index];
    const kind = role.get(index);
    if (kind === "open") open = true;
    if (kind === "close") {
      open = false;
      // A speech closed after a stop ends the sentence when a space (or the
      // end) follows, or when the stop is a Japanese one.
      const before = source[index - 1] ?? "";
      const next = source[index + 1];
      if (SPEECH_STOP.test(before) && (next === undefined || /\s/.test(next) || CJK_STOP.test(before))) push(index + 1);
      continue;
    }
    if (kind === "open") continue;
    const next = source[index + 1];
    if (next !== undefined && ANY_STOP.test(next)) continue; // "?!", "..."
    if (next !== undefined && role.get(index + 1) === "close") continue; // the quote takes the stop with it
    if (LATIN_STOP.test(ch) && (next === undefined || /\s/.test(next))) push(index + 1);
    else if (CJK_STOP.test(ch)) push(index + 1);
  }
  push(source.length);
  return out;
}

/** The sentences as strings, in order. */
export function sentenceTexts(text = "") {
  const source = String(text ?? "");
  return proseSentences(source).map(({ start, end }) => source.slice(start, end));
}
