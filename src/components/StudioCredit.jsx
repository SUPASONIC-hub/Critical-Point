import { CREATOR_LINE, CREATORS, creatorMailLabel, STUDIO } from "../credits.js";

/**
 * Studio and creator credit.
 *
 * A definition list rather than a sentence: the labels keep the studio, the
 * two creators and their addresses readable for screen readers as well as on
 * screen. Each address link is named for its owner (src/credits.js).
 */
export function StudioCredit() {
  return (
    <div className="studio-credit">
      <img src="/profile.jpg" alt="" width="40" height="40" loading="lazy" decoding="async" />
      <dl>
        <div>
          <dt lang="en">STUDIO</dt>
          <dd>{STUDIO}</dd>
        </div>
        <div>
          <dt lang="en">CREATOR</dt>
          <dd>{CREATOR_LINE}</dd>
        </div>
        <div className="studio-credit-mail">
          <dt lang="en">CONTACT</dt>
          <dd>
            {CREATORS.map((creator) => (
              <a key={creator.email} href={`mailto:${creator.email}`} aria-label={creatorMailLabel(creator)}>
                {creator.email}
              </a>
            ))}
          </dd>
        </div>
      </dl>
    </div>
  );
}
