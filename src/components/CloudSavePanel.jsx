import { useState } from "react";

import { CLOUD_SAVE_RETENTION_DAYS } from "../appConfig.js";
import { telemetryEnabled } from "../telemetry.js";
import { loadedChunk, quietImport } from "../state/chunkReload.js";
import { fill } from "../locale.js";
import cloudSaveCopy from "../copy/cloudSave.js";

/**
 * 기기 간 이어하기, folded under the intro's primary action.
 *
 * It is folded because priority 24 gives the first viewport one button and
 * the intro a reading budget; it sits right under that button because the
 * player who needs it is holding a different device than the one they played
 * on.
 *
 * Online save is off until someone turns it on, so what it takes to run is not
 * part of what every visitor downloads: the fold and its one paragraph are
 * here, and the panel itself (`CloudSavePanelBody.jsx`, with `cloudSave.js`
 * behind it) arrives the first time the fold is opened. It is fetched by hand
 * rather than through `React.lazy`, because a chunk that fails to load there
 * throws into the root boundary, and a player who only opened a fold should be
 * offered another try, not a recovery screen.
 */
export function CloudSavePanel() {
  const [Body, setBody] = useState(null);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);

  function loadBody() {
    if (Body || loading || !telemetryEnabled) return;
    setLoading(true);
    setFailed(false);
    // `quietImport`: the retry below answers a failure, so the page does not
    // reload for it (state/chunkReload.js).
    quietImport(() => import("./CloudSavePanelBody.jsx").then(loadedChunk))
      .then(({ CloudSavePanelBody }) => setBody(() => CloudSavePanelBody))
      .catch(() => setFailed(true))
      .finally(() => setLoading(false));
  }

  return (
    <details
      className="cloud-save-panel"
      data-testid="cloud-save-panel"
      onToggle={(event) => {
        if (event.currentTarget.open) loadBody();
      }}
    >
      <summary>{cloudSaveCopy.summary}</summary>
      <p>{fill(cloudSaveCopy.text, { days: CLOUD_SAVE_RETENTION_DAYS })}</p>
      {!telemetryEnabled ? (
        <p className="cloud-save-status" role="status">
          {cloudSaveCopy.noServer}
        </p>
      ) : Body ? (
        <Body />
      ) : failed ? (
        <p className="cloud-save-message" role="alert">
          {cloudSaveCopy.loadFailed}
          <button type="button" className="ghost" onClick={loadBody}>
            {cloudSaveCopy.retry}
          </button>
        </p>
      ) : (
        <p className="cloud-save-status" role="status">
          {cloudSaveCopy.loading}
        </p>
      )}
    </details>
  );
}
