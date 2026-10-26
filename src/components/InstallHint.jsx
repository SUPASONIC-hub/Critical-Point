import { INSTALL_HINT_COPY } from "../appCopy.js";
import { dismissInstallHint, promptInstall } from "../state/installPrompt.js";

/**
 * The 홈 화면에 추가 hint, a chunk of its own: fetched by InstallHintSlot only
 * on a browser that has something to offer (state/installPrompt.js says when).
 */
export function InstallHint({ mode }) {
  return (
    <section className="install-hint" aria-label={INSTALL_HINT_COPY.title} data-testid="install-hint">
      <p>
        <b>{INSTALL_HINT_COPY.title}</b>
        <small>{mode === "prompt" ? INSTALL_HINT_COPY.prompt : INSTALL_HINT_COPY.ios}</small>
      </p>
      <div>
        {mode === "prompt" ? (
          <button type="button" className="install-hint-add" onClick={promptInstall}>
            {INSTALL_HINT_COPY.install}
          </button>
        ) : null}
        <button type="button" className="ghost" onClick={dismissInstallHint}>
          {INSTALL_HINT_COPY.dismiss}
        </button>
      </div>
    </section>
  );
}
