import reportCopy from "../copy/report.js";
import runLines from "../copy/runLines.js";
import { seasonCasesBase } from "../gameCases.js";
import { fill } from "../locale.js";

/**
 * A row of the remote-save queue as the report lists it while it waits
 * (ReportArchive), in the page's language. The row keeps the label it was
 * queued with (useChoiceCommit, useFeedback, errorRecovery.js), in the
 * language of that page: a row queued on a Korean page before the label was
 * read from the copy (#496) said 「프롤로그 01 사건 로그」 on an English one
 * until it was sent (#496 질문 2). So the label is drawn again from what the
 * row's payload names -- its case for a case or feedback row, its scene for an
 * error row -- and the stored one is shown only for a row that names neither
 * (the season's own row, whose label is its English case title).
 */
export function pendingRowLabel(item) {
  const payload = item?.payload;
  if (item?.type === "error" && payload?.current_case) return fill(reportCopy.session.errorRow, { scene: `${payload.current_case} / ${payload.node_id}` });
  const words = item?.type === "case" || item?.type === "feedback" ? runLines.queue[item.type] : null;
  const caseLabel = words && seasonCasesBase.find((caseItem) => caseItem.id === payload?.case_id)?.label;
  return caseLabel ? fill(words, { case: caseLabel }) : item?.label;
}
