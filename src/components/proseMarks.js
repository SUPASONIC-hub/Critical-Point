/**
 * Reading marks for scene prose (2026-10-20).
 *
 * The scenes are long paragraphs of narration with speech, figures and plain-
 * language glosses run into them, all in one weight and one colour, so the eye
 * had nothing to land on. This splits a prose string into runs the page can set
 * apart, without touching a word of it: every character of the input is in
 * exactly one segment, in order, so what a screen reader reads is unchanged.
 *
 *   say   speech: from one single quote to the next ('...'), quotes included.
 *         An apostrophe between two Latin letters (analyst's) is not a quote.
 *   num   a figure: digits with their unit (184.7%, 18영업일, 3억 원, 1,140명),
 *         a date or time read as one (11월 1일, 7시 40분), or a number like
 *         2023-0412.
 *   term  the word a gloss explains: the word right before "(".
 *   note  the gloss: a parenthesis with Hangul in it, opened right after a word,
 *         as in 입찰장(여러 회사가 ... 자리). "(대출 잔액 310억)" after a space
 *         is an aside, not a gloss, and stays plain.
 *
 * A segment is `{ text, marks }`, `marks` a list of those names (speech can
 * hold a figure, so a segment can carry two). Marks are for the eye only; each
 * is also carried by the words themselves -- quotes, digits, parentheses.
 */

const UNIT = "(?:%p|%|퍼센트|포인트|영업일|개월|시간|년|월|일|시|분|초|억|만|천|조|원|명|곳|건|개|배|층|주|번|차례|쪽|줄|페이지|통|살|위|등|점|호|bp)";
const NUMBER = String.raw`(?<![\w.,])(?:\d{1,3}(?:,\d{3})+|\d+)(?:\.\d+)?(?:-\d+)*`;
const FIGURE = new RegExp(`${NUMBER}${UNIT}*`, "g");
// U+001F joins a captioned scene's lines (proseCaptions); a gloss never crosses it.
// It is a control character so the font check never counts it as printed.
// eslint-disable-next-line no-control-regex
const GLOSS = /([가-힣A-Za-z0-9·]+)(\([^()\n\u001f]*[가-힣][^()\n\u001f]*\))/g;
// A date or time reads as one figure across the space: 11월 1일, 7시 40분.
const DATE_HEAD = /(?:^| )\d+(?:년|월|일|시)$/;
const DATE_TAIL = /^\d+(?:월|일|시|분|초)$/;
// Money spoken in two words: 3억 원.
const WON_AFTER = /(?:억|만|천|조)$/;

function quoteToggles(text) {
  const toggles = [];
  for (let index = 0; index < text.length; index += 1) {
    if (text[index] !== "'") continue;
    if (/[A-Za-z]/.test(text[index - 1] ?? "") && /[A-Za-z]/.test(text[index + 1] ?? "")) continue;
    toggles.push(index);
  }
  // An unmatched quote marks nothing rather than everything after it.
  if (toggles.length % 2 === 1) toggles.pop();
  return toggles;
}

function markFigures(text, marks, out) {
  let last = 0;
  const found = [];
  for (const match of text.matchAll(FIGURE)) {
    const previous = found.at(-1);
    let end = match.index + match[0].length;
    if (previous && previous.end + 1 === match.index && text[previous.end] === " " && DATE_HEAD.test(text.slice(previous.start, previous.end)) && DATE_TAIL.test(match[0])) {
      previous.end = end;
      continue;
    }
    if (WON_AFTER.test(match[0]) && text.startsWith(" 원", end)) end += 2;
    found.push({ start: match.index, end });
  }
  for (const { start, end } of found) {
    if (start > last) out.push({ text: text.slice(last, start), marks });
    out.push({ text: text.slice(start, end), marks: [...marks, "num"] });
    last = end;
  }
  if (last < text.length) out.push({ text: text.slice(last), marks });
}

function markGlosses(text, marks, out) {
  let last = 0;
  for (const match of text.matchAll(GLOSS)) {
    if (match.index > last) markFigures(text.slice(last, match.index), marks, out);
    out.push({ text: match[1], marks: [...marks, "term"] });
    markFigures(match[2], [...marks, "note"], out);
    last = match.index + match[0].length;
  }
  if (last < text.length) markFigures(text.slice(last), marks, out);
}

/** The segments of one prose string. Empty and missing text give none. */
export function markProse(text = "") {
  const source = String(text ?? "");
  const out = [];
  const toggles = quoteToggles(source);
  let last = 0;
  for (let pair = 0; pair < toggles.length; pair += 2) {
    const start = toggles[pair];
    const end = toggles[pair + 1] + 1;
    if (start > last) markGlosses(source.slice(last, start), [], out);
    markGlosses(source.slice(start, end), ["say"], out);
    last = end;
  }
  if (last < source.length) markGlosses(source.slice(last), [], out);
  return out.filter((segment) => segment.text);
}

/**
 * The segments of several lines cut from one paragraph -- the briefing's
 * captions are its sentences -- read as one, so speech that runs across a
 * sentence break is speech in both lines.
 */
export function markLines(lines = []) {
  const result = lines.map(() => []);
  let line = 0;
  for (const segment of markProse(lines.join("\u001f"))) {
    const pieces = segment.text.split("\u001f");
    pieces.forEach((piece, index) => {
      if (index > 0) line += 1;
      if (piece) result[line].push({ text: piece, marks: segment.marks });
    });
  }
  return result;
}

/**
 * The briefing's caption boxes (improvement notes D-3, 2026-10-22): two or
 * three sentences to a box, not one. A box a sentence was eleven boxes for a
 * median scene, each with its own border and shadow, and a phone read them as
 * eleven interruptions. A box starts afresh before a sentence that opens
 * speech, so a line someone says leads its box, and after three sentences or
 * when the box would run past 120 characters. The sentences keep their words
 * and their order; only where the boxes break is decided here.
 */
export function captionGroups(text = "") {
  const groups = [];
  let open = false;
  for (const sentence of String(text ?? "").split(/(?<=[.!?])\s+/).map((part) => part.trim()).filter(Boolean)) {
    const last = groups.at(-1);
    const speech = !open && sentence.startsWith("'");
    const length = last ? last.join(" ").length + sentence.length : 0;
    if (!last || speech || last.length >= 3 || length > 120) groups.push([sentence]);
    else last.push(sentence);
    // An apostrophe between Latin letters is not a quote (quoteToggles).
    if ((sentence.match(/(?<![A-Za-z])'|'(?![A-Za-z])/g) ?? []).length % 2 === 1) open = !open;
  }
  return groups.map((group) => group.join(" "));
}
