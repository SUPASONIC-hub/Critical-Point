import { GameHeader } from "../components/GameHeader.jsx";
import { CASE_SEQUENCE, seasonCasesBase } from "../gameData.js";
import { GauntletStage } from "../gauntlet/GauntletStage.jsx";

/**
 * The gauntlet table and nothing in front of it.
 *
 * The header says which case and how far; the stage owns everything else. The
 * scene's prose is one question and a folded briefing -- the choice is the
 * scene now, and it sits above the fold on a phone.
 */
export function PlayScreen({ view, renderers, sceneTitleRef: titleRef, actions }) {
  // The view is what the screen shows; `renderers` and `actions` are what it
  // calls. Every one of those used to arrive twice -- once in the view, where
  // the runtime filled it with a function that did nothing, and once here --
  // and the screen picked between them with `??` on thirteen names.
  const {
    common: { AdaptiveMusic, musicModeKey, screenReaderStatus, simplifyPlayerText, currentCase },
    scene: { node, speakerProfile, speakerPortrait, narrativeSpine, resolvedNodeId },
    gauntlet: { gauntletRun, gauntletSeed, isAdvancing, fixedChoices, clueCount, casesOpened, reframeChoice, decisionRevealOpen, staleSave },
    status: { resources, resourceMeta, progress, routeIndex, routeLength },
    debug: { debugToolsEnabled, fallbackCaseId, silentFailureCount },
  } = view;
  const { renderDecisionReveal, renderRecoveryNotice, renderErrorLogPanel, renderSaveStatus } = renderers;
  const { saveCurrentGame, resolveGauntlet, markWindowTouched, reloadFromStorage, pickRelic, onSuspendable = null, reset, copyReplayLink, copyDiagnosticTrace } = actions;

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
        sceneTitleRef={titleRef}
        onSave={() => saveCurrentGame()}
        // Leaving on purpose keeps a bet on the table exactly as it stands.
        onSaveAndExit={() => saveCurrentGame({ exit: true })}
        onReset={reset}
        /* The stamp is the case's own label, not its place in the list. The
           프롤로그 sits in front of 사건 01, so a position counter would read
           "사건 6" over 사건 01's own title. The position is still what the
           progress line measures. */
        caseLabel={seasonCasesBase.find((caseItem) => caseItem.id === currentCase)?.label ?? ""}
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
        reframeChoice={reframeChoice}
        resources={resources}
        resourceMeta={resourceMeta}
        clueCount={clueCount}
        casesOpened={casesOpened}
        isAdvancing={isAdvancing}
        revealOpen={decisionRevealOpen}
        onResolve={resolveGauntlet}
        onTouch={markWindowTouched} onPickRelic={pickRelic} onSuspendable={onSuspendable}
        staleSave={staleSave}
        onReload={reloadFromStorage}
        scene={{
          node, nodeId: resolvedNodeId,
          speakerPortrait,
          speakerRole: speakerProfile.role,
          question: narrativeSpine.question,
        }}
      />
      {__CP_DEBUG_BUILD__ && debugToolsEnabled && (
        <aside className="debug-overlay" data-testid="debug-overlay" aria-label="개발자 진행 추적">
          <div className="debug-overlay-heading">
            <span lang="en">DEBUG</span>
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
