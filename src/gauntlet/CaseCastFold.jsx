import { useEffect, useState } from "react";

/**
 * What fetches the case file's cast (CaseCast.jsx, D-8) the first time the
 * table's case file opens. It lives in the runtime's chunk, not the table's:
 * the runtime hands the table `caseCast` on the narrative spine
 * (useRunReadout.js) and the case file draws it while it is open
 * (SceneBriefing's CaseFileStory). Written in the table, the lazy import and
 * its list of files to preload cost the PlayScreen chunk about 900 bytes it
 * did not have (scripts/check-bundle-size.mjs, 2026-10-23).
 *
 * The fold is drawn only while open, so it is mounted again each time it
 * opens; the component, once arrived, is kept here. A fetch that fails --
 * offline before it was ever kept -- leaves the fold as it was, and the next
 * opening asks again.
 */
let loaded = null;

function CaseCastFold({ node, trail, Portrait }) {
  const [CaseCast, setCaseCast] = useState(() => loaded);
  useEffect(() => {
    if (!CaseCast) import("./CaseCast.jsx").then((module) => setCaseCast(() => (loaded = module.CaseCast)), () => {});
  }, [CaseCast]);
  return CaseCast && <CaseCast node={node} trail={trail} Portrait={Portrait} />;
}

/**
 * The case file's cast for a log, carried on the spine: `(node, Portrait) =>
 * element`, where `Portrait` is the table's SpeakerPortrait (CaseCast.jsx says why).
 */
export function caseCastFor(trail) {
  return (node, Portrait) => <CaseCastFold node={node} trail={trail} Portrait={Portrait} />;
}
