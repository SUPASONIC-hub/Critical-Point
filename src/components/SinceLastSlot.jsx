import { useEffect, useState } from "react";
import { SIDE_CASES } from "../sideCases.js";
import { loadedChunk, quietImport } from "../state/chunkReload.js";
import { takeVisit } from "../state/sinceLastVisit.js";

/**
 * Where 「지난번 이후」 (N24) goes on the start screen: one line in
 * IntroScreen.jsx mounts this. It reads and renews this device's visit stamp
 * (state/sinceLastVisit.js) and, on a return after three days or more,
 * fetches the card (SinceLastCard.jsx) as a chunk of its own; every other
 * visit, and every test that does not seed a stamp, fetches and draws nothing.
 * Closed, it stays closed for the rest of the page.
 */
let card = null;
let closed = false;

export function SinceLastSlot({ view }) {
  const [visit] = useState(() => takeVisit({ sides: SIDE_CASES.map((sideCase) => sideCase.id) }));
  const [loaded, setLoaded] = useState(card);
  const [shut, setShut] = useState(closed);
  const due = Boolean(visit?.due) && !shut;

  useEffect(() => {
    if (!due || loaded) return undefined;
    let cancelled = false;
    quietImport(() => import("./SinceLastCard.jsx").then(loadedChunk))
      .then((module) => {
        card = module;
        if (!cancelled) setLoaded(module);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [due, loaded]);

  if (!due || !loaded) return null;
  return (
    <loaded.SinceLastCard
      visit={visit}
      view={view}
      onClose={() => {
        closed = true;
        setShut(true);
      }}
    />
  );
}
