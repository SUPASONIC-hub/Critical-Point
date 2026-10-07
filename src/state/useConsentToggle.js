import { useState } from "react";

import { takeQueuedErrorTelemetry } from "./errorRecovery.js";

const REVOKE_NOT_SAVED = "동의 해제 내용을 브라우저 저장본에 반영하지 못했습니다. 저장소 권한을 확인한 뒤 다시 시도하세요.";
const GRANT_NOT_SAVED = "데이터 제공 동의를 브라우저 저장본에 반영하지 못했습니다.";
const REVOKED = "데이터 제공 동의를 해제했습니다. 미전송 원격 대기열도 삭제했습니다.";
const GRANTED = "데이터 제공에 동의했습니다. 지금부터 마치는 케이스에 적용됩니다.";

/**
 * What a tick or an untick of the consent box writes, and what it says when
 * the browser will not keep it.
 *
 * Consent is only real once it is in the save. A tick the storage refused
 * snaps back, and so does an untick. A refused untick changes nothing else:
 * the queue was not emptied, so there is nothing to put back. It used to be
 * set back to the queue this render held, which dropped the error rows the
 * failed write had just folded into it (useAppPersistence.persist).
 * `setNote` takes what to say beside the box, or null when there is nothing.
 */
export function createConsentChange({ persist, setDataConsent, setPendingTelemetry, setTelemetryStatus, setNote }) {
  function say(tone, text) {
    setNote({ tone, text });
    setTelemetryStatus({ tone, text });
  }

  return function onChange(event) {
    if (event.target.checked) {
      if (!persist({ dataConsent: true }).storageSaved) {
        event.target.checked = false;
        say("error", GRANT_NOT_SAVED);
        return;
      }
      setDataConsent(true);
      setNote(null);
      // The report's status line still said the consent had been withdrawn and
      // the queue deleted. Only that sentence is replaced: any other is about
      // something else (the connection, a batch) and is still true.
      setTelemetryStatus((status) => (status?.text === REVOKED ? { tone: "ready", text: GRANTED } : status));
      return;
    }
    if (!persist({ dataConsent: false, pendingTelemetry: [] }).storageSaved) {
      event.target.checked = true;
      setDataConsent(true);
      say("error", REVOKE_NOT_SAVED);
      return;
    }
    setDataConsent(false);
    setPendingTelemetry([]);
    // The error path keeps its own list of rows it queued since the last save
    // (errorRecovery.queueSavedErrorTelemetry), and the runtime's next save
    // folds that list into the queue: without this, an untick on the intro
    // before the run started left those rows to come back into a save whose
    // consent is off.
    takeQueuedErrorTelemetry();
    say("local", REVOKED);
  };
}

/**
 * The consent checkbox on the intro.
 *
 * All of this lived inside the checkbox's `onChange` in `IntroScreen`,
 * thirty-five lines with each sentence written twice, and what it said went to
 * the save status line: a bare paragraph at the top of the page, several
 * screens above the box that had just snapped back, with no role. The `note`
 * returned here is drawn beside the checkbox, in a status region that is on
 * the page before the text is.
 */
export function useConsentToggle(deps) {
  const [note, setNote] = useState(null);
  return { note, onChange: createConsentChange({ ...deps, setNote }) };
}
