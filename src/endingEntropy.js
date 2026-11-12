/**
 * 「언어의 엔트로피」 (개선 포인트 A2-1 (1), user decision 11-12): on the
 * collapse ending's first record, its headline -- the one line, never the
 * record under it or a button -- scatters into loose letters for 0.8 s and
 * comes back (result.css, ending-entropy). The season is decided by then, so
 * it asks for no decision and no sound is added.
 *
 * The letters move by `left`/`top` on relatively placed inline spans: the
 * line breaks where it did, and the heading's box keeps its size (an
 * inline-block or a transform would change where it wraps). The heading
 * keeps its sentence for a screen reader (aria-label), the spans are hidden
 * from it.
 *
 * With reduced motion or the comfort setting (data-calm-effects on <html>)
 * the line is not split at all and simply stands; result.css gates the
 * keyframes the same way, so a setting changed while the line is up stills it.
 */

export const ENTROPY_MS = 800;
export const ENTROPY_VISUAL_CLASS = "ending-visual-collapse";
const STILL = "(prefers-reduced-motion: reduce)";

/** True when the page asks for no motion: the OS's reduced motion, or the comfort setting. */
export function isStillPage(scope = globalThis) {
  if (scope.matchMedia?.(STILL)?.matches) return true;
  return Boolean(scope.document?.documentElement?.hasAttribute?.("data-calm-effects"));
}

/** The gate: the collapse ending, its first step and first record, on a page that allows motion. */
export function shouldScatterEndingLine({ endingVisualClass, endingStep, endingTwistIndex, still }) {
  return !still && endingStep === 0 && endingTwistIndex === 0 && endingVisualClass === ENTROPY_VISUAL_CLASS;
}

/**
 * The line cut into letters, each with where it flies to (in em, at most
 * a quarter of a letter each way, so nothing leaves the card). The offsets
 * come from the letter's place, not a random draw: the same line scatters the
 * same way every time. A space stays a plain space, so the line wraps as before.
 */
export function scatterGlyphs(text) {
  return Array.from(String(text ?? "")).map((glyph, index) => {
    if (!glyph.trim()) return { glyph, space: true };
    const dx = (((index * 7) % 9) - 4) * 0.06;
    const dy = (((index * 5) % 7) - 3) * 0.08;
    return { glyph, dx: `${Number(dx.toFixed(2))}em`, dy: `${Number(dy.toFixed(2))}em` };
  });
}
