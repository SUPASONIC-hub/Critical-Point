import { test } from "node:test";

import { layOver } from "./locale-gaps.shared.mjs";
import { assertKoreanPage, assertTranslated } from "./stored-lines.shared.mjs";

/** #496 질문 1-2 on a Japanese page (tests/unit/stored-lines.shared.mjs). The Korean test runs first: the second lays Japanese over the tables. */
test("a Korean page draws the memory line and the queue's rows as it stored them", () => {
  assertKoreanPage();
});

test("on a Japanese page, a season finished in Korean and rows queued in Korean read in Japanese", async () => {
  await layOver("ja");
  assertTranslated("ja", { line: "前のシーズン:封印 · QUIET COVER。NEW GAME+で始めると、最初のシーンにこの記録が戻ってきます。", collapse: "前のシーズン:QUIET COVER。NEW GAME+で始めると", open: "前のシーズン:QUIET COVER。 NEW GAME+では", rows: { case: "プロローグ01 ログ", feedback: "プロローグ01 フィードバック", error: "prologue01 / p1_start エラーログ" } });
});
