import { INSTALL_HINT_COPY } from "../appCopy.js";
import { readLeaveLine } from "../actProgress.js";
import resultCopy from "../copy/result.js";
import { TYPICAL_CASE_MINUTES } from "../gameCases.js";
import { fill } from "../locale.js";
import { promptInstall, useInstallHintMode } from "../state/installPrompt.js";

/**
 * N42 at the foot of the report of 프롤로그 05, 사건 03 and 사건 07
 * (actProgress.LEAVE_LINE_CASES): 「쉬어도 저장됩니다 · 다음: 사건 04 - … (약
 * 10분)」, and under it the intro's 홈 화면에 추가 in its smallest form -- the
 * button where the browser sent `beforeinstallprompt`, the share-menu line on
 * an iPhone, nothing elsewhere (state/installPrompt.js decides, and a player
 * who closed the intro's hint is not asked again here).
 *
 * TODO(#595): after 11-29, a 「주 1회 알림 켜기」 link here once the weekly
 * reminder has merged. No link until then.
 */
export function LeaveLine({ caseId, nextCaseSignal }) {
  const mode = useInstallHintMode();
  const line = readLeaveLine(caseId, nextCaseSignal, TYPICAL_CASE_MINUTES);
  if (!line) return null;
  return (
    <aside className="leave-line" aria-label={resultCopy.leaveLine.label} data-testid="leave-line">
      <p>{fill(resultCopy.leaveLine.text, line)}</p>
      {mode === "prompt" && (
        <button type="button" className="ghost" data-testid="leave-line-install" onClick={promptInstall}>
          {INSTALL_HINT_COPY.install}
        </button>
      )}
      {mode === "ios" && <small>{INSTALL_HINT_COPY.ios}</small>}
    </aside>
  );
}
