import { useEffect, useState } from "react";
import { quietImport } from "../state/chunkReload.js";
import { getActCard, markActCardShown, runOfSeed } from "./actCardGate.js";

/**
 * The act title card (B-11(1)), once its chunk is here (actCardGate.js says
 * when it is wanted). A chunk that will not come skips the card: it never
 * holds the case.
 */
let loaded = null;

function ActCardFold({ caseId, onDone }) {
  const [ActCard, setActCard] = useState(() => loaded);
  useEffect(() => {
    if (!ActCard) quietImport(() => import("./ActCard.jsx")).then((module) => setActCard(() => (loaded = module.ActCard)), onDone);
    // Asked for once, as the card is wanted.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return ActCard && <ActCard caseId={caseId} onDone={onDone} />;
}

/**
 * The table's side of it: whether the card is up (`open`, which holds the
 * draft and the briefing) and the card to draw (`card`). Read once, as the
 * window mounts -- the stage is keyed by the window's seed -- and the card
 * waits under the verdict of the window before (`hidden`).
 */
export function useActCard({ scene, seed, windowIndex, resumed, hidden }) {
  const [caseId, setCaseId] = useState(() => getActCard({ node: scene.node, nodeId: scene.nodeId, windowIndex, resumed, runId: runOfSeed(seed) }));
  const open = caseId !== null && !hidden;
  const close = () => {
    markActCardShown(runOfSeed(seed), caseId);
    setCaseId(null);
  };
  return { open, card: open ? <ActCardFold caseId={caseId} onDone={close} /> : null };
}
