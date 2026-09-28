import { useState, useSyncExternalStore } from "react";
import { CloudDownload, CloudUpload, Copy, Trash2 } from "lucide-react";

import {
  applyCloudSave,
  deleteCloudSave,
  describeCloudFailure,
  describeCloudPhase,
  fetchCloudSave,
  flushCloudSave,
  formatCloudCode,
  getCloudCode,
  getCloudSaveSnapshot,
  isCloudSaveEnabled,
  normalizeCloudCode,
  setCloudSaveEnabled,
  subscribeCloudSave,
} from "../cloudSave.js";
import { CLOUD_SAVE_CODE_KEY, CLOUD_SAVE_RETENTION_DAYS, readStoredValue, STORAGE_KEY } from "../appConfig.js";

function hasLocalRun() {
  try {
    const save = JSON.parse(readStoredValue(STORAGE_KEY, "null"));
    return Boolean(save && ((Array.isArray(save.log) && save.log.length) || (Array.isArray(save.completedCases) && save.completedCases.length)));
  } catch {
    return false;
  }
}

const confirmed = (question) => typeof globalThis.confirm !== "function" || globalThis.confirm(question);

/**
 * What is inside 다른 기기에서 이어하기 once it has been opened: the switch, the
 * code, the status and the two ways out of a conflict. `CloudSavePanel.jsx` is
 * the fold around it, and loads this the first time it is opened.
 *
 * It owns its own state -- the sync status comes from `cloudSave.js`, not from
 * the intro view -- so the pre-start shell and the runtime draw it the same way.
 *
 * A conflict offers both ways out, side by side, because neither is the safe
 * default: the copy online may be the evening's play, or it may be the phone
 * that was left behind.
 */
export function CloudSavePanelBody() {
  const status = useSyncExternalStore(subscribeCloudSave, getCloudSaveSnapshot, getCloudSaveSnapshot);
  const [enabled, setEnabled] = useState(isCloudSaveEnabled);
  // The code is minted when the player opts in, not on the first visit.
  const [code, setCode] = useState(() => (enabled ? getCloudCode() : normalizeCloudCode(readStoredValue(CLOUD_SAVE_CODE_KEY, "")) ?? ""));
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
      if (hasLocalRun() && !confirmed("이 기기의 저장을 불러온 진행으로 바꿉니다. 계속할까요?")) return;
      if (!(await applyCloudSave(found))) {
        setMessage("브라우저 저장소에 쓸 수 없어 불러오지 못했습니다.");
        return;
      }
      globalThis.location.reload();
    } catch (error) {
      setMessage(describeCloudFailure(error));
    } finally {
      setBusy(false);
    }
  }

  async function overwriteRemote() {
    if (!confirmed("온라인에 있는 다른 기기의 진행을 이 기기의 진행으로 바꿉니다. 되돌릴 수 없습니다. 계속할까요?")) return;
    setBusy(true);
    setMessage("");
    try {
      if (await flushCloudSave({ overwrite: true })) setMessage("이 기기의 진행을 온라인에 올렸습니다.");
    } finally {
      setBusy(false);
    }
  }

  async function removeRemote() {
    if (!confirmed("온라인에 올린 진행 기록을 지웁니다. 이 기기의 저장은 그대로 남습니다. 계속할까요?")) return;
    setBusy(true);
    setMessage("");
    try {
      const { deleted, unsupported } = await deleteCloudSave();
      setMessage(
        unsupported
          ? `지금은 온라인 사본을 바로 지울 수 없습니다. 마지막으로 올린 날부터 ${CLOUD_SAVE_RETENTION_DAYS}일 뒤에 자동으로 지워집니다.`
          : deleted
            ? "온라인에 올린 진행 기록을 지웠습니다."
            : "온라인에 남아 있는 진행 기록이 없습니다.",
      );
    } catch (error) {
      setMessage(describeCloudFailure(error));
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
    const next = event.target.checked;
    if (next && !code) setCode(getCloudCode());
    setEnabled(next);
    setCloudSaveEnabled(next);
    setMessage(next ? "" : "온라인 저장을 껐습니다. 이미 올린 진행 기록은 아래에서 지울 수 있습니다.");
  }

  return (
    <>
          <label className="cloud-save-toggle">
            <input type="checkbox" checked={enabled} onChange={toggle} data-testid="cloud-save-toggle" />
            온라인 저장 사용
          </label>
          {enabled && (
            <div className="cloud-save-code">
              <span>내 이어하기 코드</span>
              <strong data-testid="cloud-save-code">{formatCloudCode(code)}</strong>
              <button type="button" className="ghost" onClick={copyCode}>
                <Copy size={15} aria-hidden="true" />
                복사
              </button>
            </div>
          )}
          <p className="cloud-save-status" role="status" data-testid="cloud-save-status">
            {enabled
              ? status.phase === "error" && status.message
                ? status.message
                : describeCloudPhase(status.phase)
              : describeCloudPhase("disabled")}
          </p>
          {enabled && status.phase === "conflict" && (
            <div className="cloud-save-code" data-testid="cloud-save-conflict">
              <button type="button" className="ghost" onClick={() => load(code)} disabled={busy}>
                <CloudDownload size={15} aria-hidden="true" />
                온라인의 진행 불러오기
              </button>
              <button type="button" className="ghost" onClick={overwriteRemote} disabled={busy}>
                <CloudUpload size={15} aria-hidden="true" />
                이 기기의 진행으로 덮어쓰기
              </button>
            </div>
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
          {enabled && status.phase !== "synced" && status.phase !== "conflict" && (
            <button type="button" className="ghost cloud-save-now" onClick={() => flushCloudSave()} disabled={busy}>
              지금 올리기
            </button>
          )}
          {!enabled && code && (
            <button type="button" className="ghost cloud-save-now" onClick={removeRemote} disabled={busy} data-testid="cloud-save-delete">
              <Trash2 size={15} aria-hidden="true" />
              온라인에 올린 기록 지우기
            </button>
          )}
      {message && (
        <p className="cloud-save-message" role="alert">
          {message}
        </p>
      )}
    </>
  );
}
