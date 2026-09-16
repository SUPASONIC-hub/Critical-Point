import { useState, useSyncExternalStore } from "react";
import { CloudDownload, Copy } from "lucide-react";

import {
  applyCloudSave,
  cloudSaveAvailable,
  describeCloudPhase,
  fetchCloudSave,
  flushCloudSave,
  formatCloudCode,
  getCloudCode,
  getCloudSaveSnapshot,
  isCloudSaveEnabled,
  setCloudSaveEnabled,
  subscribeCloudSave,
} from "../cloudSave.js";
import { readStoredValue, STORAGE_KEY } from "../appConfig.js";

function hasLocalRun() {
  try {
    const save = JSON.parse(readStoredValue(STORAGE_KEY, "null"));
    return Boolean(save && ((Array.isArray(save.log) && save.log.length) || (Array.isArray(save.completedCases) && save.completedCases.length)));
  } catch {
    return false;
  }
}

/**
 * 기기 간 이어하기, folded under the intro's primary action.
 *
 * It is folded because priority 24 gives the first viewport one button and
 * the intro a reading budget; it sits right under that button because the
 * player who needs it is holding a different device than the one they played
 * on. It owns its own state -- the sync status comes from `cloudSave.js`, not
 * from the intro view -- so the pre-start shell and the runtime draw it the
 * same way.
 */
export function CloudSavePanel() {
  const status = useSyncExternalStore(subscribeCloudSave, getCloudSaveSnapshot, getCloudSaveSnapshot);
  const [code] = useState(() => (cloudSaveAvailable ? getCloudCode() : ""));
  const [enabled, setEnabled] = useState(isCloudSaveEnabled);
  const [input, setInput] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function load(codeToLoad) {
    setBusy(true);
    setMessage("");
    try {
      const found = await fetchCloudSave(codeToLoad);
      if (!found) {
        setMessage("그 코드로 저장된 진행이 없습니다.");
        return;
      }
      const overwrite = hasLocalRun() && typeof globalThis.confirm === "function";
      if (overwrite && !globalThis.confirm("이 기기의 저장을 불러온 진행으로 바꿉니다. 계속할까요?")) return;
      if (!applyCloudSave(found)) {
        setMessage("브라우저 저장소에 쓸 수 없어 불러오지 못했습니다.");
        return;
      }
      globalThis.location.reload();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "불러오지 못했습니다.");
    } finally {
      setBusy(false);
    }
  }

  async function copyCode() {
    try {
      await globalThis.navigator.clipboard.writeText(formatCloudCode(code));
      setMessage("이어하기 코드를 복사했습니다.");
    } catch {
      setMessage(`코드를 직접 적어 두세요: ${formatCloudCode(code)}`);
    }
  }

  function toggle(event) {
    setEnabled(event.target.checked);
    setCloudSaveEnabled(event.target.checked);
  }

  return (
    <details className="cloud-save-panel" data-testid="cloud-save-panel">
      <summary>다른 기기에서 이어하기</summary>
      <p>
        진행은 이 기기에 먼저 저장되고, 인터넷이 연결되면 자동으로 온라인에도 올라갑니다. 판을 걸어 둔 채로
        나가도 그 판 그대로 보관됩니다. 다른 기기에서는 아래 코드를 입력하면 멈춘 자리에서 이어집니다.
      </p>
      {cloudSaveAvailable ? (
        <>
          <div className="cloud-save-code">
            <span>내 이어하기 코드</span>
            <strong data-testid="cloud-save-code">{formatCloudCode(code)}</strong>
            <button type="button" className="ghost" onClick={copyCode}>
              <Copy size={15} aria-hidden="true" />
              복사
            </button>
          </div>
          <p className="cloud-save-status" role="status" data-testid="cloud-save-status">
            {enabled ? describeCloudPhase(status.phase) : describeCloudPhase("disabled")}
          </p>
          {status.phase === "conflict" && (
            <button type="button" className="ghost" onClick={() => load(code)} disabled={busy}>
              <CloudDownload size={15} aria-hidden="true" />
              더 최근 저장 불러오기
            </button>
          )}
          <form
            className="cloud-save-load"
            onSubmit={(event) => {
              event.preventDefault();
              load(input);
            }}
          >
            <label htmlFor="cloud-save-input">다른 기기의 코드</label>
            <div>
              <input
                id="cloud-save-input"
                value={input}
                onChange={(event) => setInput(event.target.value.toUpperCase().slice(0, 14))}
                placeholder="XXXX-XXXX-XXXX"
                autoComplete="off"
                spellCheck="false"
              />
              <button type="submit" disabled={busy || !input.trim()}>
                불러와서 이어하기
              </button>
            </div>
          </form>
          <label className="cloud-save-toggle">
            <input type="checkbox" checked={enabled} onChange={toggle} />
            온라인 저장 사용
          </label>
          {enabled && status.phase !== "synced" && (
            <button type="button" className="ghost cloud-save-now" onClick={() => flushCloudSave()} disabled={busy}>
              지금 올리기
            </button>
          )}
        </>
      ) : (
        <p className="cloud-save-status" role="status">{describeCloudPhase("unavailable")}</p>
      )}
      {message && (
        <p className="cloud-save-message" role="alert">
          {message}
        </p>
      )}
    </details>
  );
}
