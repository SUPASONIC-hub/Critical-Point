import { WORDMARK_LETTERS, WORDMARK_MARK, WORDMARK_STOP, WORDMARK_STROKE, WORDMARK_VIEWBOX } from "./wordmarkLogo.js";

/**
 * The title lockup: the game's logo (the GAUGE mark and the drawn wordmark
 * CRITICAL POINT., src/components/wordmarkLogo.js) over the Korean reading.
 *
 * The logo is a picture of words, so it is hidden from assistive technology and
 * the heading's name is the title itself, as text in `.sr-only`. The static
 * shell (scripts/static-shell.mjs) writes the same markup from the same table.
 *
 * The English line under it is the game's question, kept outside the heading so
 * the page's name stays the title. As a direct child of `.intro-hero-copy` it
 * takes the premise paragraph's size and colour; `.wordmark-sub` only slants it.
 */
export function GameWordmark({ label = "CRITICAL POINT", reading = "임계점", hanja = "臨界點", tagline = "When does my creativity burst?" }) {
  const { transform, arc, stroke, point } = WORDMARK_MARK;
  return (
    <>
    <h1 className="game-wordmark">
      <span className="sr-only">{label}</span>
      <svg className="wordmark-logo" viewBox={WORDMARK_VIEWBOX} aria-hidden="true" focusable="false">
        <g transform={transform}>
          <path d={arc} fill="none" stroke="currentColor" strokeWidth={stroke} />
          <circle className="wordmark-point" cx={point.cx} cy={point.cy} r={point.r} />
        </g>
        <g fill="none" stroke="currentColor" strokeWidth={WORDMARK_STROKE}>
          {WORDMARK_LETTERS.map(([x, d]) => (
            <path key={x} transform={`translate(${x} 0)`} d={d} />
          ))}
        </g>
        <circle className="wordmark-point" cx={WORDMARK_STOP.cx} cy={WORDMARK_STOP.cy} r={WORDMARK_STOP.r} />
      </svg>
      <span className="wordmark-rule" aria-hidden="true" />
      <span className="wordmark-reading">
        <b>{reading}</b>
        <i aria-hidden="true">{hanja}</i>
      </span>
    </h1>
    {tagline && (
      <p className="wordmark-sub" lang="en">
        {tagline}
      </p>
    )}
    </>
  );
}
