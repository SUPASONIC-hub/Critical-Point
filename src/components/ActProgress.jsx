import { useEffect, useState } from "react";

import { MINI_TALLY_FOR, readActProgress } from "../actProgress.js";
import resultCopy from "../copy/result.js";
import { fill } from "../locale.js";
import { quietImport } from "../state/chunkReload.js";

/**
 * N23 on the report of 사건 01 to 17 (actProgress.js says what it reads): one
 * line -- 「1막 · 3/7 · 중간 결산까지 4사건」 -- and on 사건 07's report, under
 * it, the N1 중간 결산 in its small form (ActTally.jsx with `compact`: the
 * three rows, no note and no share). The tally is a chunk of its own, fetched
 * only on that one report; a chunk that does not come leaves the line alone.
 */
export function ActProgress({ caseId }) {
  const progress = readActProgress(caseId);
  const tallyFor = MINI_TALLY_FOR[caseId] ?? null;
  const [Tally, setTally] = useState(null);
  useEffect(() => {
    if (!tallyFor) return undefined;
    let live = true;
    quietImport(() => import("../gauntlet/ActTally.jsx")).then((module) => live && setTally(() => module.default), () => {});
    return () => {
      live = false;
    };
  }, [tallyFor]);
  if (!progress) return null;
  return (
    <>
      <p className="act-progress" data-testid="act-progress">
        {fill(progress.left > 0 ? resultCopy.actProgress : resultCopy.actProgressHere, progress)}
      </p>
      {tallyFor && Tally && <Tally caseId={tallyFor} compact />}
    </>
  );
}
