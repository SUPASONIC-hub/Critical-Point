import { GameHeader } from "../components/GameHeader.jsx";
import { CASE_SEQUENCE } from "../gameData.js";
import { GauntletStage } from "../gauntlet/GauntletStage.jsx";

/**
 * The gauntlet table and nothing in front of it.
 *
 * The header says which case and how far; the stage owns everything else. The
 * scene's prose is one question and a folded briefing -- the choice is the
 * scene now, and it sits above the fold on a phone.
 */
export function PlayScreen({ view }) {
  const {
    common: {
      AdaptiveMusic, musicModeKey, renderDecisionReveal, renderRecoveryNotice, renderErrorLogPanel,
      renderSaveStatus, screenReaderStatus, simplifyPlayerText, currentCase, sceneTitleRef,
    },
    scene: { node, speakerProfile, speakerPortrait, narrativeSpine, resolvedNodeId },
    gauntlet: {
      gauntletRun, gauntletSeed, resolveGauntlet, isAdvancing, fixedChoices, clueCount, markWindowTouched,
      decisionRevealOpen, staleSave, reloadFromStorage,
    },
    freeInput: {
      freeChoice, freeText, updateFreeText, FREE_TEXT_MAX_LENGTH, freeTextBlockedByPrivacy,
      activePrivacySignals, anonymizeFreeText,
    },
    status: { resources, resourceMeta, progress, saveCurrentGame, reset, routeIndex, routeLength },
    debug: { debugToolsEnabled, fallbackCaseId, silentFailureCount, copyReplayLink, copyDiagnosticTrace },
  } = view;

  return (
    <main className="shell game-shell gauntlet-shell">
      <AdaptiveMusic modeKey={musicModeKey} />
      {renderDecisionReveal()}
      {renderRecoveryNotice()}
      {renderErrorLogPanel()}
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {screenReaderStatus}
      </p>
      <GameHeader
        node={node}
        simplify={simplifyPlayerText}
        sceneTitleRef={sceneTitleRef}
        onSave={() => saveCurrentGame()}
        onSaveAndExit={() => {
          // Leaving with a bet on the table settles it as a bust on resume; say so first.
          const betPlaced = gauntletRun.openSeed?.startsWith(`${gauntletSeed}#`);
          if (betPlaced && typeof globalThis.confirm === "function" && !globalThis.confirm("걸어 둔 판을 두고 나가면 BUST로 처리됩니다. 나갈까요?")) return;
          saveCurrentGame({ exit: true });
        }}
        onReset={reset}
        caseNumber={Math.max(1, CASE_SEQUENCE.indexOf(currentCase) + 1)}
        caseTotal={CASE_SEQUENCE.length}
        progress={progress}
      />
      {renderSaveStatus()}
      <GauntletStage
        key={gauntletSeed}
        seed={gauntletSeed}
        run={gauntletRun}
        cards={fixedChoices}
        freeChoice={freeChoice}
        resources={resources}
        resourceMeta={resourceMeta}
        clueCount={clueCount}
        isAdvancing={isAdvancing}
        revealOpen={decisionRevealOpen}
        onResolve={resolveGauntlet}
        onTouch={markWindowTouched}
        staleSave={staleSave}
        onReload={reloadFromStorage}
        freeInput={{
          freeText, updateFreeText, FREE_TEXT_MAX_LENGTH, freeTextBlockedByPrivacy, activePrivacySignals,
          anonymizeFreeText,
        }}
        scene={{
          node,
          speakerPortrait,
          speakerRole: speakerProfile.role,
          question: narrativeSpine.question,
        }}
      />
      {debugToolsEnabled && (
        <aside className="debug-overlay" data-testid="debug-overlay" aria-label="개발자 진행 추적">
          <div className="debug-overlay-heading">
            <span>DEBUG</span>
            <b>{fallbackCaseId} / {resolvedNodeId}</b>
          </div>
          <dl>
            <div><dt>path</dt><dd>{Math.max(0, routeIndex) + 1}/{routeLength}</dd></div>
            <div><dt>run</dt><dd>w{gauntletRun.windowIndex} pot {gauntletRun.runPot} vault {gauntletRun.vault}</dd></div>
            <div><dt>resources</dt><dd>{Object.entries(resources).map(([key, value]) => `${key}:${value}`).join(" ")}</dd></div>
            <div><dt>silent</dt><dd>{silentFailureCount}</dd></div>
          </dl>
          <button type="button" className="ghost" data-testid="copy-replay-link" onClick={copyReplayLink}>Copy replay link</button>
          <button type="button" className="ghost" onClick={copyDiagnosticTrace}>Copy trace</button>
        </aside>
      )}
    </main>
  );
}
