/**
 * Studio and creator credit.
 *
 * A definition list rather than a sentence: the two are different roles, and
 * the labels keep that readable for screen readers as well as on screen.
 */
export function StudioCredit({ studio = "Tak'n Roll", creator = "SUPASONIC" }) {
  return (
    <div className="studio-credit">
      <img src="/profile.jpg" alt="" width="40" height="40" loading="lazy" decoding="async" />
      <dl>
        <div>
          <dt>STUDIO</dt>
          <dd>{studio}</dd>
        </div>
        <div>
          <dt>CREATOR</dt>
          <dd>{creator}</dd>
        </div>
      </dl>
    </div>
  );
}
