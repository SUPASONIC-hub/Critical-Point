import { getCaseCast } from "./caseCastModel.js";

/**
 * The case so far and who is in it, under the table's folded case file
 * (improvement notes D-8 and B-6(2), 2026-10-22).
 *
 * 87 people speak in the season and 55 of them in one case only, and until
 * now the scenes already played could be read again only from the report's
 * drawer after the case had closed. So the case file says what happened in
 * this case -- each scene's title, the words picked and what they did -- and
 * who has spoken (caseCastModel.js says who and in what order): a face, a
 * name, the post they hold in this case, the one line of what they think, and
 * the case they first spoke in. A name opens its card; the one speaking now
 * is open.
 *
 * A chunk of its own, fetched when the case file is first opened
 * (CaseCastFold.jsx): the table's chunk had no room for it
 * (scripts/check-bundle-size.mjs). The face is the table's own
 * SpeakerPortrait, handed in as `Portrait`: imported here, it would be
 * shared by this chunk and the table's with neither loading the other, and
 * the build would split it into a file of its own.
 */
export function CaseCast({ node, trail = [], Portrait }) {
  return (
    <div className="gx-cast" data-testid="case-cast">
      {trail.length > 0 && (
        <>
          <p>
            <b>이 사건의 지난 장면</b>
          </p>
          <ol data-testid="case-trail">
            {trail.map((entry, index) => (
              <li key={`${entry.nodeId}-${index}`}>
                <b>{entry.title}</b> · {entry.spokenChoice || entry.choice}
                {entry.echo && <> · {entry.echo}</>}
              </li>
            ))}
          </ol>
        </>
      )}
      <p>
        <b>등장인물</b>
      </p>
      <ul>
        {getCaseCast({ node, trail }).map((person) => (
          <li key={person.name}>
            <details open={person.speaking} data-testid="cast-card">
              <summary>
                <Portrait name={person.name} src={person.portrait} size={32} />
                {person.name}
              </summary>
              {person.role && <span>{person.role}</span>}
              {person.thought && <q>{person.thought}</q>}
              <small>처음 나온 사건 · {person.firstCase}</small>
            </details>
          </li>
        ))}
      </ul>
    </div>
  );
}
