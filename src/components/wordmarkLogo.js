/**
 * The game's logo as the title screen draws it: the GAUGE mark (a C-shaped
 * gauge with the point that has just left it -- C·P, the critical point) and
 * the wordmark CRITICAL POINT., its full stop the mark's point.
 *
 * Every letter is drawn by hand as a centreline path on a 100-unit cap height
 * (docs/images/brand/ has the same drawing as files), so no font and no outside
 * artwork is involved. GameWordmark.jsx and the static shell
 * (scripts/static-shell.mjs) both draw from this one table, so the shell and
 * the intro lay the title out the same.
 *
 * The letters touch the viewBox's top and bottom on purpose: the R's leg and
 * the N's diagonal run past it and the svg's own edge trims them square.
 */
export const WORDMARK_VIEWBOX = "0 0 1100 100";
export const WORDMARK_STROKE = 10;
/** [x, d]: each letter's left edge and its path, CRITICAL POINT left to right. */
export const WORDMARK_LETTERS = [
  [145, "M62,5 H23 Q5,5 5,23 V77 Q5,95 23,95 H62"],
  [229, "M5,100 V5 H39 Q57,5 57,23 V36 Q57,54 39,54 H5 M33,54 L61,106"],
  [313, "M5,0 V100"],
  [345, "M0,5 H60 M30,5 V100"],
  [427, "M5,0 V100"],
  [459, "M62,5 H23 Q5,5 5,23 V77 Q5,95 23,95 H62"],
  [543, "M5,100 V23 Q5,5 23,5 H39 Q57,5 57,23 V100 M5,60 H57"],
  [627, "M5,0 V95 H54"],
  [725, "M5,100 V5 H39 Q57,5 57,23 V38 Q57,56 39,56 H5"],
  [809, "M23,5 H39 Q57,5 57,23 V77 Q57,95 39,95 H23 Q5,95 5,77 V23 Q5,5 23,5 Z"],
  [893, "M5,0 V100"],
  [925, "M5,100 V0 M57,0 V100 M5,0 L57,100"],
  [1009, "M0,5 H60 M30,5 V100"],
];
export const WORDMARK_MARK = {
  transform: "translate(-11.4 -10) scale(1.2)",
  arc: "M67.74,73.04 A31,31 0 1 1 67.74,26.96",
  stroke: 13,
  point: { cx: 86.53, cy: 44.62, r: 10.5 },
};
/** The full stop after POINT, in the point's colour. */
export const WORDMARK_STOP = { cx: 1091, cy: 92, r: 8 };

/** The same drawing as an HTML string, for the static shell. */
export function wordmarkLogoMarkup() {
  const letters = WORDMARK_LETTERS.map(([x, d]) => `<path transform="translate(${x} 0)" d="${d}"/>`).join("");
  const { transform, arc, stroke, point } = WORDMARK_MARK;
  return (
    `<svg class="wordmark-logo" viewBox="${WORDMARK_VIEWBOX}" aria-hidden="true" focusable="false">` +
    `<g transform="${transform}"><path d="${arc}" fill="none" stroke="currentColor" stroke-width="${stroke}"/>` +
    `<circle class="wordmark-point" cx="${point.cx}" cy="${point.cy}" r="${point.r}"/></g>` +
    `<g fill="none" stroke="currentColor" stroke-width="${WORDMARK_STROKE}">${letters}</g>` +
    `<circle class="wordmark-point" cx="${WORDMARK_STOP.cx}" cy="${WORDMARK_STOP.cy}" r="${WORDMARK_STOP.r}"/></svg>`
  );
}

/**
 * Whether the reading line also prints the title's hanja: not when the reading
 * is already written in Han characters (the Japanese 臨界点), where 臨界點
 * beside it would say the same thing twice.
 */
export function showHanja(reading, hanja) {
  return Boolean(hanja) && !/\p{Script=Han}/u.test(String(reading));
}
