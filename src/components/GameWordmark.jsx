/**
 * The title lockup: an English wordmark stacked over the Korean reading.
 *
 * Each line repeats its own text in `data-text` so the stylesheet can paint two
 * offset copies through ::before/::after for the chromatic-aberration flicker.
 * They are pseudo-elements on purpose -- no extra DOM, nothing for a screen
 * reader or the contrast audit to trip over.
 */
export function GameWordmark({ label = "CRITICAL POINT", reading = "임계점", hanja = "臨界點" }) {
  const [first, ...rest] = label.split(" ");
  const second = rest.join(" ");

  return (
    <h1 className="game-wordmark">
      <span className="wordmark-line" data-text={first}>
        {first}
      </span>
      {second && (
        <span className="wordmark-line wordmark-line-accent" data-text={second}>
          {second}
        </span>
      )}
      <span className="wordmark-rule" aria-hidden="true" />
      <span className="wordmark-reading">
        <b>{reading}</b>
        <i aria-hidden="true">{hanja}</i>
      </span>
    </h1>
  );
}
