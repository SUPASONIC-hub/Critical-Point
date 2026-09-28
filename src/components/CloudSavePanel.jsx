import { useState } from "react";

import { CLOUD_SAVE_RETENTION_DAYS } from "../appConfig.js";
import { telemetryEnabled } from "../telemetry.js";

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
    import("./CloudSavePanelBody.jsx")
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
      <summary>다른 기기에서 이어하기</summary>
      <p>
        진행은 이 기기에만 저장됩니다. 온라인 저장을 켜면 그때부터 진행 기록(사건, 판단 로그, 자원)이
        이어하기 코드 아래 온라인에도 올라가고, 다른 기기에서 그 코드를 입력하면 멈춘 자리에서 이어집니다.
        이름과 피드백 내용은 올리지 않습니다. 올린 기록은 마지막으로 올린 날부터 {CLOUD_SAVE_RETENTION_DAYS}일 동안
        보관한 뒤 지우며, 그 전에도 여기서 지울 수 있습니다.
      </p>
      {!telemetryEnabled ? (
        <p className="cloud-save-status" role="status">
          이 배포에는 온라인 저장 서버가 없어 이 기기에만 저장합니다.
        </p>
      ) : Body ? (
        <Body />
      ) : failed ? (
        <p className="cloud-save-message" role="alert">
          온라인 저장 화면을 불러오지 못했습니다.{" "}
          <button type="button" className="ghost" onClick={loadBody}>
            다시 불러오기
          </button>
        </p>
      ) : (
        <p className="cloud-save-status" role="status">
          온라인 저장 화면을 불러오는 중입니다.
        </p>
      )}
    </details>
  );
}
