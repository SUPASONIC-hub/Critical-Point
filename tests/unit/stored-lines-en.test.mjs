import { test } from "node:test";

import { layOver } from "./locale-gaps.shared.mjs";
import { assertKoreanPage, assertTranslated } from "./stored-lines.shared.mjs";

/** #496 질문 1-2 on a English page (tests/unit/stored-lines.shared.mjs). The Korean test runs first: the second lays English over the tables. */
test("a Korean page draws the memory line and the queue's rows as it stored them", () => {
  assertKoreanPage();
});

test("on a English page, a season finished in Korean and rows queued in Korean read in English", async () => {
  await layOver("en");
  assertTranslated("en", { line: "Last season: Seal · QUIET COVER. Start NEW GAME+ and this record returns in the first scene.", collapse: "Last season: QUIET COVER. Start NEW GAME+", open: "Last season: QUIET COVER. In NEW GAME+", rows: { case: "Prologue 01 log", feedback: "Prologue 01 feedback", error: "prologue01 / p1_start error log" } });
});
