/**
 * What the speaker's balloon on the briefing page says (A-2 = D-2, 2026-10-23).
 *
 * The balloon beside the portrait held the scene's `question`, and 1,118 of the
 * 1,129 questions are the narrator asking the player ("…하겠습니까?"), some of
 * them naming the very speaker in the third person ("오진우가 묻습니다"). So
 * the question is now its own box, 「당신의 판단」, with no tail, and the
 * balloon carries what the speaker says in the scene. Nothing is rewritten:
 * the words are the scene's own, without their quotes, and a long speech gives
 * only its first sentences (the whole of it stays in the story's boxes).
 *
 * Nothing in the data says who speaks a line, so a speech ('…') is given to
 * the person the narration last named before it (`names`, every speaker,
 * SPEAKER_NAMES; a
 * name inside a speech does not count). The balloon is the first speech given
 * to the scene's speaker that is said rather than cited. A scene where none is gives its `lead` instead
 * (`fromLead`, drawn as a caption, not a balloon), and one with neither gives
 * no balloon: a wrong mouth is worse than none.
 *
 * `whoAt` are the caption boxes (captionSentences of `text`) that hold the
 * speaker's speech. They wear a name chip. Speech given to anyone else keeps
 * no chip. scripts/report-speaker-lines.mjs lists the scenes to read.
 *
 * The file is a chunk of its own (SPEAKER_LINE in vite.config.js) and imports
 * nothing, so neither proseMarks.js nor speakerPortraits.js is pulled out of
 * the chunks they live in: the two cuts it shares with them -- the speech
 * marks' quotes and the caption boxes' sentences -- are written here again,
 * and tests/unit/speaker-line.test.mjs holds them equal.
 */
export function getSpeakerLine(node, names = []) {
  const text = String(node?.text ?? "");
  const spans = speechSpans(text);
  const owners = speechOwners(text, spans, names);
  const theirs = spans.filter((span, index) => node?.speaker && owners[index] === node.speaker);
  // Words in quotes run straight into a particle are a phrase cited, not said:
  // '확인되지 않은 위험'으로, '은행 총각'으로 불리며. Speech ends a sentence or a clause.
  const said = theirs.find((span) => /[.?!…~]$/.test(text.slice(span.start + 1, span.end - 1).trim()) || /^(\s|$)/.test(text.slice(span.end, span.end + 1)));
  if (!said) return { line: node?.lead ?? "", fromLead: Boolean(node?.lead), whoAt: [] };

  // Each caption's place in the paragraph, so a speech can be found in its box.
  const starts = [];
  let cursor = 0;
  for (const sentence of captionSentences(text)) {
    cursor = text.indexOf(sentence, cursor);
    starts.push(cursor);
    cursor += sentence.length;
  }
  const boxOf = (offset) => starts.findLastIndex((start) => start <= offset);
  const whoAt = [...new Set(theirs.map((span) => boxOf(span.start)))];
  const { start, end } = said;
  return { line: firstSentences(text.slice(start + 1, end - 1).trim()), fromLead: false, whoAt };
}

/**
 * Where the speech in a prose string is: `{ start, end }`, quotes included,
 * `end` past the closing one. proseMarks.js's rule: an apostrophe between two
 * Latin letters is not a quote, and an unmatched last quote opens nothing.
 */
export function speechSpans(text = "") {
  const quotes = [];
  for (let index = 0; index < text.length; index += 1) {
    if (text[index] === "'" && !(/[A-Za-z]/.test(text[index - 1] ?? "") && /[A-Za-z]/.test(text[index + 1] ?? ""))) quotes.push(index);
  }
  const spans = [];
  for (let pair = 0; pair + 1 < quotes.length; pair += 2) spans.push({ start: quotes[pair], end: quotes[pair + 1] + 1 });
  return spans;
}

/** The briefing's caption boxes: one sentence to a box (Prose.jsx, ProseCaptions). */
export function captionSentences(text = "") {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}

/** For each speech, the name the narration last gave before it, or null. */
function speechOwners(text, spans, names) {
  const inSpeech = (offset) => spans.some((span) => offset >= span.start && offset < span.end);
  const mentions = [];
  for (const name of names) {
    for (let at = text.indexOf(name); at >= 0; at = text.indexOf(name, at + name.length)) {
      if (!inSpeech(at)) mentions.push({ at, name });
    }
  }
  mentions.sort((a, b) => a.at - b.at);
  return spans.map((span) => mentions.findLast((mention) => mention.at < span.start)?.name ?? null);
}

// A balloon is a line, not a speech: the whole sentences of it that fit in
// BALLOON_CHARACTERS, and at least the first. The rest is in the story's boxes.
const BALLOON_CHARACTERS = 80;

function firstSentences(speech) {
  let line = "";
  for (const sentence of captionSentences(speech)) {
    if (line && line.length + 1 + sentence.length > BALLOON_CHARACTERS) break;
    line = line ? `${line} ${sentence}` : sentence;
  }
  return line;
}
