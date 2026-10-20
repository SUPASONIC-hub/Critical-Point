import { markLines, markProse } from "./proseMarks.js";

/**
 * Scene prose with its reading marks (proseMarks.js): speech, figures and
 * glossed words set apart by spans, and nothing else. The words, their order
 * and their punctuation are the string's own, so a screen reader reads what it
 * read before; base-intro-ranking.css draws the marks.
 */
export function Marked({ segments }) {
  return segments.map((segment, index) =>
    segment.marks.length ? (
      <span key={index} className={segment.marks.map((mark) => `pr-${mark}`).join(" ")}>
        {segment.text}
      </span>
    ) : (
      segment.text
    ),
  );
}

export function Prose({ text }) {
  return <Marked segments={markProse(text)} />;
}

/** A list's items, one fact to an item: the case file on the briefing and the table. */
export function ProseItems({ items }) {
  return (items ?? []).map((item) => (
    <li key={item}>
      <Prose text={item} />
    </li>
  ));
}

/**
 * Narration as a strip of caption boxes, one sentence to a box (the briefing
 * page). The sentences are marked as one paragraph, so speech that runs across
 * a sentence break is speech in both boxes. It lives beside the marks rather
 * than in the briefing so the table's chunk carries only the call.
 */
export function ProseCaptions({ text = "" }) {
  const sentences = text
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
  return markLines(sentences).map((segments, index) => (
    <p key={index} className="gx-caption">
      <Marked segments={segments} />
    </p>
  ));
}
