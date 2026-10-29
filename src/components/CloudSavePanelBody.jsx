import { useState, useSyncExternalStore } from "react";
import { CloudDownload, CloudUpload, Copy, Trash } from "lucide-react";

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
import { CLOUD_SAVE_CODE_KEY, readStoredValue, STORAGE_KEY } from "../appConfig.js";
import { confirmAction } from "../state/confirmAction.js";
import { fill } from "../locale.js";
import cloudSaveBodyCopy from "../copy/cloudSaveBody.js";

const { confirm: CONFIRM, outcome: OUTCOME } = cloudSaveBodyCopy;

function hasLocalRun() {
  try {
    const save = JSON.parse(readStoredValue(STORAGE_KEY, "null"));
    return Boolean(save && ((Array.isArray(save.log) && save.log.length) || (Array.isArray(save.completedCases) && save.completedCases.length)));
  } catch {
    return false;
  }
}

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
  // What the last action came to. `done` is news and `failed` is a problem:
  // both used to be drawn in the warning colour and announced as an alert, so
  // "이어하기 코드를 복사했습니다" interrupted like an error.
  const [outcome, setOutcome] = useState(null);
  const [busy, setBusy] = useState(false);
  const done = (text) => setOutcome({ tone: "done", text });
  const failed = (text) => setOutcome({ tone: "failed", text });

  async function load(codeToLoad) {
    setBusy(true);
    setOutcome(null);
    try {
      const found = await fetchCloudSave(codeToLoad);
      if (!found) {
        failed(OUTCOME.notFound);
        return;
      }
      if (hasLocalRun() && !(await confirmAction(CONFIRM.load))) return;
      if (!(await applyCloudSave(found))) {
        failed(OUTCOME.cannotWrite);
        return;
      }
      globalThis.location.reload();
    } catch (error) {
      failed(describeCloudFailure(error));
    } finally {
      setBusy(false);
    }
  }

  async function overwriteRemote() {
    if (!(await confirmAction(CONFIRM.overwrite))) return;
    setBusy(true);
    setOutcome(null);
    try {
      if (await flushCloudSave({ overwrite: true })) done(OUTCOME.uploaded);
    } finally {
      setBusy(false);
    }
  }

  async function removeRemote() {
    if (!(await confirmAction(CONFIRM.remove))) return;
    setBusy(true);
    setOutcome(null);
    try {
      const { deleted, unsupported } = await deleteCloudSave();
      if (unsupported) {
        // No server in this build, so no promise about a copy: it used to
        // say the copy is removed after the retention period, which nothing
        // here can know or do.
        failed(OUTCOME.noServer);
      } else {
        done(deleted ? OUTCOME.deleted : OUTCOME.nothingOnline);
      }
    } catch (error) {
      failed(describeCloudFailure(error));
    } finally {
      setBusy(false);
    }
  }

  async function copyCode() {
    try {
      await globalThis.navigator.clipboard.writeText(formatCloudCode(code));
      done(OUTCOME.copied);
    } catch {
      failed(fill(OUTCOME.writeDown, { code: formatCloudCode(code) }));
    }
  }

  function toggle(event) {
    const next = event.target.checked;
    if (next && !code) setCode(getCloudCode());
    setEnabled(next);
    setCloudSaveEnabled(next);
    if (next) setOutcome(null);
    else done(OUTCOME.turnedOff);
  }

  return (
    <>
          <label className="cloud-save-toggle">
            <input type="checkbox" checked={enabled} onChange={toggle} data-testid="cloud-save-toggle" />
            {cloudSaveBodyCopy.toggle}
          </label>
          {enabled && (
            <div className="cloud-save-code">
              <span>{cloudSaveBodyCopy.myCode}</span>
              <strong data-testid="cloud-save-code">{formatCloudCode(code)}</strong>
              <button type="button" className="ghost" onClick={copyCode}>
                <Copy size={15} aria-hidden="true" />
                {cloudSaveBodyCopy.copy}
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
                {cloudSaveBodyCopy.loadOnline}
              </button>
              <button type="button" className="ghost" onClick={overwriteRemote} disabled={busy}>
                <CloudUpload size={15} aria-hidden="true" />
                {cloudSaveBodyCopy.overwrite}
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
            <label htmlFor="cloud-save-input">{cloudSaveBodyCopy.otherCode}</label>
            <div>
              <input
                id="cloud-save-input"
                value={input}
                onChange={(event) => setInput(event.target.value.toUpperCase().slice(0, 14))}
                placeholder="XXXX-XXXX-XXXX"
                autoComplete="off"
                autoCapitalize="characters"
                autoCorrect="off"
                inputMode="text"
                spellCheck="false"
              />
              <button type="submit" disabled={busy || !input.trim()}>
                {cloudSaveBodyCopy.loadAndContinue}
              </button>
            </div>
          </form>
          {enabled && status.phase !== "synced" && status.phase !== "conflict" && (
            <button type="button" className="ghost cloud-save-now" onClick={() => flushCloudSave()} disabled={busy}>
              {cloudSaveBodyCopy.uploadNow}
            </button>
          )}
          {!enabled && code && (
            <button type="button" className="ghost cloud-save-now" onClick={removeRemote} disabled={busy} data-testid="cloud-save-delete">
              <Trash size={15} aria-hidden="true" />
              {cloudSaveBodyCopy.deleteOnline}
            </button>
          )}
      {/* Both regions are on the page before they have anything to say: one
          announces when it is polite to, the other interrupts. */}
      <p className="cloud-save-message is-done" role="status" aria-live="polite" aria-atomic="true" data-testid="cloud-save-done">
        {outcome?.tone === "done" ? outcome.text : ""}
      </p>
      <p className="cloud-save-message" role="alert" aria-atomic="true" data-testid="cloud-save-failed">
        {outcome?.tone === "failed" ? outcome.text : ""}
      </p>
    </>
  );
}
