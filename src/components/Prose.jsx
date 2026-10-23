import { useEffect, useState } from "react";
import { captionGroups, markLines, markProse } from "./proseMarks.js";
import { markGlossesSeen, readSeenGlosses } from "./seenGlosses.js";

/**
 * Scene prose with its reading marks (proseMarks.js): speech, figures and
 * glossed words set apart by spans, and nothing else. The words, their order
 * and their punctuation are the string's own, so a screen reader reads what it
 * read before; base-intro-ranking.css draws the marks.
 *
 * A glossed word this save has already seen explained (seenGlosses.js, B-7)
 * is drawn with its bracket folded: the word keeps its dotted underline and
 * becomes a button that unfolds it. The bracket stays in the page, hidden from
 * the eye only, so a screen reader still reads it where it always did.
 */
function FoldedGloss({ term, note }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" className="pr-term pr-fold" aria-expanded={open} onClick={() => setOpen(!open)}>
        {term.text}
      </button>
      <span className={open ? undefined : "sr-only"}>
        <Marked segments={note} />
      </span>
    </>
  );
}

function Marked({ segments, seen = null }) {
  const out = [];
  for (let index = 0; index < segments.length; index += 1) {
    const segment = segments[index];
    if (seen && segment.marks.includes("term") && seen.has(segment.text)) {
      let end = index + 1;
      while (segments[end]?.marks.includes("note")) end += 1;
      if (end > index + 1) {
        out.push(<FoldedGloss key={index} term={segment} note={segments.slice(index + 1, end)} />);
        index = end - 1;
        continue;
      }
    }
    out.push(
      segment.marks.length ? (
        <span key={index} className={segment.marks.map((mark) => `pr-${mark}`).join(" ")}>
          {segment.text}
        </span>
      ) : (
        segment.text
      ),
    );
  }
  return out;
}

/**
 * What the save had seen explained when this text first drew, and the terms
 * it explains written down once it has: a term explained twice on one page is
 * open in both places, and folded on every page after.
 */
function useSeenGlosses(text, segmentLists) {
  const [seen] = useState(readSeenGlosses);
  useEffect(() => {
    markGlossesSeen(segmentLists.flat().filter((segment, index, all) => segment.marks.includes("term") && all[index + 1]?.marks.includes("note")).map((segment) => segment.text));
    // The segments are made from `text` on every render; `text` is what changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);
  return seen;
}

export function Prose({ text }) {
  const segments = markProse(text);
  const seen = useSeenGlosses(text, [segments]);
  return <Marked segments={segments} seen={seen} />;
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
 * Narration as a strip of caption boxes, two or three sentences to a box (the
 * briefing page; `captionGroups` says where a box breaks). The boxes are
 * marked as one paragraph, so speech that runs across a break is speech in
 * both boxes. It lives beside the marks rather than in the briefing so the
 * table's chunk carries only the call.
 */
export function ProseCaptions({ text = "" }) {
  const lines = markLines(captionGroups(text));
  const seen = useSeenGlosses(text, lines);
  return lines.map((segments, index) => (
    <p key={index} className="gx-caption">
      <Marked segments={segments} seen={seen} />
    </p>
  ));
}
