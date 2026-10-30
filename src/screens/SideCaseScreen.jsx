import { useEffect, useRef, useState } from "react";
import { ChevronRight } from "lucide-react";
import { resourceMeta } from "../appCopy.js";
import { SIDE_CASES, readSideRecord } from "../sideCases.js";
import { loadGameRuntime } from "./IntroScreen.jsx";
import sideCaseCopy from "../copy/sideCase.js";
import { fill } from "../locale.js";

/**
 * E-11 번외 사건: a side case, played on the season's table and kept apart from
 * the season (E11-번외사건-설계안).
 *
 * Opened from the start screen's slot (IntroScreen), which it takes the place
 * of until the player leaves; leaving puts the start screen back as it was,
 * and the season save was never read or written in between. The side run is
 * state/sideRun.js, handed over by the runtime's chunk (`sideCaseKit`), and the
 * table is the play screen's own `GauntletStage`: this chunk is the screen
 * around them and nothing else.
 *
 * What the screen does not have, on purpose: no decision reveal, no report, no
 * score, no ranking row, no telemetry. The ending says 「랭킹 밖」 (설계안 8절),
 * so a score on the table is not read as one that ranks.
 */
// The words are src/copy/sideCase.js, read at render (a page in another
// language lays its words over the table in place).

function useSideCase(caseId) {
  const [loaded, setLoaded] = useState(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const entry = SIDE_CASES.find((item) => item.id === caseId);
    let live = true;
    if (!entry) return undefined;
    const table = loadGameRuntime().then(({ sideCaseKit }) => sideCaseKit.loadStage().then((Stage) => ({ kit: sideCaseKit, Stage })));
    Promise.all([table, entry.load()])
      .then(([{ kit, Stage }, pack]) => {
        if (!live) return;
        const prepared = kit.prepareSidePack(pack);
        // The run: the one the record kept, or a new one at the first scene.
        const kept = readSideRecord()[prepared.id]?.inProgress;
        const opened = kit.resumeSideRun(prepared, kept) ?? kit.createSideRun(prepared);
        setLoaded({ kit, Stage, pack: prepared, entry, opened });
      })
      .catch((error) => {
        console.warn(error);
        if (live) setFailed(true);
      });
    return () => {
      live = false;
    };
  }, [caseId]);
  return { loaded, failed };
}

export function SideCaseScreen({ caseId, Music, onClose }) {
  const { loaded, failed } = useSideCase(caseId);
  // The run as each step left it; null until the case has loaded.
  const [taken, setTaken] = useState(null);
  const titleRef = useRef(null);
  const stateRef = useRef(null);
  const kit = loaded?.kit;
  const state = taken ?? loaded?.opened ?? null;

  // The season case's reading tally is put back as it was when this screen closes.
  useEffect(() => kit?.keepReadingTally(), [kit]);

  useEffect(() => {
    titleRef.current?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, left: 0 });
  }, [state?.nodeId, state?.outcomeChoiceId]);

  if (failed) {
    return (
      <main className="shell game-shell" data-testid="side-case-screen">
        <section className="resume-panel" role="alert">
          <div>
            <span>{sideCaseCopy.name}</span>
            <strong>{sideCaseCopy.failed.title}</strong>
            <small>{sideCaseCopy.failed.text}</small>
          </div>
          <button type="button" onClick={onClose}>{sideCaseCopy.leave}</button>
        </section>
      </main>
    );
  }
  if (!loaded || !state) {
    return (
      <main className="shell game-shell" data-testid="side-case-screen" aria-busy="true">
        <p className="save-status" role="status">{sideCaseCopy.loading}</p>
      </main>
    );
  }

  const { Stage, pack, entry } = loaded;
  const node = pack.nodes[state.nodeId];
  const sceneIds = Object.keys(pack.nodes);
  const musicKey = `intro:${pack.id}:side:${node.speaker}:${sceneIds.indexOf(state.nodeId)}`;

  if (state.outcomeChoiceId) {
    const ending = pack.outcomes[state.outcomeChoiceId];
    return (
      <main className="shell game-shell" data-testid="side-case-screen" data-side-ending={state.outcomeChoiceId}>
        <Music modeKey={`intro:${pack.id}:side-ending`} />
        <header className="game-header">
          <div>
            <span className="case-chip">{fill(sideCaseCopy.endingChip, { label: entry.label })}</span>
            <h1 ref={titleRef} tabIndex={-1}>{ending.title}</h1>
          </div>
        </header>
        <section className="resume-panel" data-testid="side-case-ending">
          <div>
            <span>{entry.label} · {entry.title}</span>
            <strong>{ending.title}</strong>
            <small>{ending.text}</small>
            <small data-testid="side-case-out-of-ranking">{sideCaseCopy.outOfRanking}</small>
          </div>
          <button type="button" data-testid="side-case-close" onClick={onClose}>
            <ChevronRight size={18} />
            {sideCaseCopy.leave}
          </button>
        </section>
      </main>
    );
  }

  // Each step is written as it is taken, from the run as it last stood: a
  // touch and the verdict after it arrive before the screen has drawn again.
  function step(next) {
    stateRef.current = next;
    setTaken(next);
  }

  function resolve({ card, window: closedWindow, forced = false }) {
    const current = stateRef.current ?? state;
    if (!card || !current) return;
    const next = kit.advanceSideRun(pack, current, { choice: card, window: closedWindow, forced });
    if (next === current) return;
    if (next.outcomeChoiceId) kit.closeSideCase(next);
    else kit.saveSideProgress(next);
    step(next);
  }

  function touch(openSeed, cardId = null) {
    const current = stateRef.current ?? state;
    if (!current || current.outcomeChoiceId) return;
    const next = kit.touchSideRun(current, openSeed, cardId);
    kit.saveSideProgress(next);
    step(next);
  }

  const seed = kit.sideWindowSeed(state);
  return (
    <main className="shell game-shell gauntlet-shell" data-testid="side-case-screen" data-side-node={state.nodeId}>
      <Music modeKey={musicKey} />
      <header className="game-header">
        <div>
          <span className="case-chip">{entry.label} · {node.phase}</span>
          <h1 ref={titleRef} tabIndex={-1}>{node.title}</h1>
        </div>
        <div className="top-actions compact-actions">
          {/* The run is kept at every decision; leaving keeps it where it is. */}
          <button type="button" className="ghost" data-testid="side-case-leave" onClick={onClose} title={sideCaseCopy.exitTitle}>
            {sideCaseCopy.exit}
          </button>
        </div>
        <div className="status-bar" role="group" aria-label={sideCaseCopy.statusLabel}>
          <span>
            <b>{entry.label}</b>
            <i aria-hidden="true"> · </i>
            {sideCaseCopy.outOfRankingMark}
          </span>
        </div>
      </header>
      <Stage
        key={seed}
        seed={seed}
        run={state.run}
        auditCount={0}
        links={null}
        cards={node.choices}
        reframeChoice={null}
        resources={state.resources}
        resourceMeta={resourceMeta}
        clueCount={0}
        casesOpened={0}
        isAdvancing={false}
        revealOpen={false}
        onResolve={resolve}
        onTouch={touch}
        onPickRelic={null}
        staleSave={false}
        onReload={() => window.location.reload()}
        scene={{
          node,
          nodeId: state.nodeId,
          speakerPortrait: kit.getSpeakerPortrait(node.speaker),
          speakerRole: kit.getSpeakerRole(node),
          question: node.question,
          challenge: null,
          bridge: null,
          caseCast: null,
          reaction: null,
          opening: null,
          echo: null,
        }}
      />
    </main>
  );
}
