import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

import { nodeOrders, nodes } from "../../src/gameData.js";
import { getCaseCast } from "../../src/gauntlet/caseCastModel.js";

// The case file's cast (improvement notes D-8 and B-6(2), 2026-10-22).
test("the cast is the people already met, each with a post, a line and a first case", () => {
  const order = nodeOrders.case09.map((id) => nodes[id]).filter((node) => node?.speaker);
  const first = order[0];
  const node = order.find((scene) => scene.speaker !== first.speaker) ?? order.at(-1);
  const cast = getCaseCast({ node, trail: [{ speaker: first.speaker }] });
  const names = cast.map((person) => person.name);
  assert.deepEqual(new Set(names), new Set([first.speaker, node.speaker]));
  const later = order.map((scene) => scene.speaker).filter((name) => name !== first.speaker && name !== node.speaker);
  for (const name of later) assert.ok(!names.includes(name), `${name} has not spoken yet`);
  assert.equal(cast.filter((person) => person.speaking).length, 1);
  assert.equal(cast.find((person) => person.speaking).name, node.speaker);
  for (const person of cast) assert.match(person.firstCase, /^(프롤로그|사건|최종)/, `${person.name}: a case label`);
  // 오진우 speaks from the prologue on, and in 사건 09 his post is the span's.
  const ojinwoo = getCaseCast({ node: { speaker: "오진우", caseId: "case09" } })[0];
  assert.match(ojinwoo.firstCase, /^프롤로그/);
  assert.equal(ojinwoo.role, "트리거랩 분석관 · 한 번 떠났다 돌아온 동료");
  assert.ok(ojinwoo.thought.length > 0);
  assert.ok(ojinwoo.portrait, "a painted speaker has a portrait");
});

test("those who speak in more cases come first", () => {
  const cast = getCaseCast({ node: { speaker: "한서윤", caseId: "case30" }, trail: [{ speaker: "하은경" }] });
  assert.deepEqual(cast.map((person) => person.name), ["한서윤", "하은경"]);
});

test("the cast is a chunk of its own, fetched when the table's case file opens", () => {
  const fold = readFileSync(new globalThis.URL("../../src/gauntlet/CaseCastFold.jsx", import.meta.url), "utf8");
  assert.match(fold, /if \(!CaseCast\) import\("\.\/CaseCast\.jsx"\)/);
  assert.doesNotMatch(fold, /^import .*CaseCast\.jsx/m, "never a static import: that would write it into the runtime's chunk");
  // The fold is the runtime's (the spine), so the table's chunk carries neither the import nor its preload list.
  const readout = readFileSync(new globalThis.URL("../../src/state/useRunReadout.js", import.meta.url), "utf8");
  assert.match(readout, /caseCast: caseCastFor\(log\)/);
  const briefing = readFileSync(new globalThis.URL("../../src/gauntlet/SceneBriefing.jsx", import.meta.url), "utf8");
  assert.doesNotMatch(briefing, /import\(|^import .*CaseCast/m);
  assert.match(briefing, /\{open && caseCast\?\.\(node, SpeakerPortrait\)\}/);
  const stage = readFileSync(new globalThis.URL("../../src/gauntlet/GauntletStage.jsx", import.meta.url), "utf8");
  assert.match(stage, /<CaseFileStory [^>]*caseCast=\{scene\.caseCast\}/);
  const budgets = readFileSync(new globalThis.URL("../../scripts/check-bundle-size.mjs", import.meta.url), "utf8");
  assert.match(budgets, /pattern: \/\^CaseCast-/);
});
