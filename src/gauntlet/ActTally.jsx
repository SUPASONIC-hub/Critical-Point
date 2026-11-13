import { useState } from "react";

import { readStoredValue, STORAGE_KEY } from "../appConfig.js";
import { buildActTallyModel, buildActTallyShareText, toResultCardModel } from "../actTally.js";
import ResultCardShare from "../components/ResultCardShare.jsx";
import actTallyCopy from "../copy/actTally.js";

/**
 * N1 막 끝 중간 결산 on the act card (actTally.js says what it reads). A chunk
 * of its own, fetched by ActCard.jsx only on the three act cards that carry
 * it, so neither the first paint nor any other act card downloads it.
 *
 * The season is read from the save the run wrote as its last case closed --
 * the act card opens on the next case's first page, after that write -- so
 * the table hands it nothing. A save that will not read draws no tally.
 */
function readSeason() {
  try {
    return JSON.parse(readStoredValue(STORAGE_KEY, "null"));
  } catch {
    return null;
  }
}

// A press or a key inside the tally is the tally's: the act card around it goes on at any other.
// Tab still reaches the card, which keeps focus inside it.
const keep = (event) => {
  if (event.key !== "Tab") event.stopPropagation();
};

export default function ActTally({ caseId }) {
  const [model] = useState(() => buildActTallyModel(caseId, readSeason()));
  if (!model) return null;
  const build = (host, origin) => ({ model: toResultCardModel(model, host), text: buildActTallyShareText(model, origin) });
  return (
    <section className="gx-tally" data-testid="act-tally" aria-labelledby="gx-tally-title" onClick={keep} onKeyDown={keep}>
      <h3 id="gx-tally-title">{model.heading}</h3>
      <dl>
        <div>
          <dt>{actTallyCopy.habit}</dt>
          <dd data-testid="act-tally-habit">
            <b>{model.habitTitle}</b>
            {model.habitLine && <small>{model.habitLine}</small>}
          </dd>
        </div>
        <div>
          <dt>{actTallyCopy.stake}</dt>
          <dd data-testid="act-tally-stake"><b>{model.stakeLine}</b></dd>
        </div>
        <div>
          <dt>{actTallyCopy.ending}</dt>
          <dd data-testid="act-tally-ending" className={model.failure ? "gx-tally-failure" : undefined}>
            <b>
              {model.endingName} <span lang="en">{model.endingLabel}</span>
            </b>
            {model.nearLine && <small>{model.nearLine}</small>}
          </dd>
        </div>
      </dl>
      <p className="gx-tally-note">{actTallyCopy.note}</p>
      <ResultCardShare build={build} words={actTallyCopy.buttons} />
    </section>
  );
}
