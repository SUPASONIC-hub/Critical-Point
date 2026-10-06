import { useState } from "react";

const REVOKE_NOT_SAVED = "동의 해제 내용을 브라우저 저장본에 반영하지 못했습니다. 저장소 권한을 확인한 뒤 다시 시도하세요.";
const GRANT_NOT_SAVED = "데이터 제공 동의를 브라우저 저장본에 반영하지 못했습니다.";
const REVOKED = "데이터 제공 동의를 해제했습니다. 미전송 원격 대기열도 삭제했습니다.";

/**
 * What a tick or an untick of the consent box writes, and what it says when
 * the browser will not keep it.
 *
 * Consent is only real once it is in the save. A tick the storage refused
 * snaps back, and so does an untick -- the queue it would have emptied is put
 * back too, because rows that were going to be withheld must not look sent.
 * `setNote` takes what to say beside the box, or null when there is nothing.
 */
export function createConsentChange({ pendingTelemetry, persist, setDataConsent, setPendingTelemetry, setTelemetryStatus, setNote }) {
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
      return;
    }
    const previousQueue = pendingTelemetry;
    if (!persist({ dataConsent: false, pendingTelemetry: [] }).storageSaved) {
      event.target.checked = true;
      setDataConsent(true);
      setPendingTelemetry(previousQueue);
      say("error", REVOKE_NOT_SAVED);
      return;
    }
    setDataConsent(false);
    setPendingTelemetry([]);
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
