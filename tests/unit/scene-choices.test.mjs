import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

import { getSceneChoiceLine, RARE_CHOICE_PERCENT, readSceneChoiceRate, SCENE_CHOICE_COPY, SCENE_CHOICE_FLOOR } from "../../src/sceneChoices.js";

/**
 * The other players' card share under the decision reveal (E-6,
 * src/sceneChoices.js). The shape is `scene_choice_rates()`'s: case, scene,
 * [windows, { card: percent }], and the server leaves out a scene under fifty
 * windows from fifty runs (check:grants plays it).
 */
const ANSWER = {
  case01: { start: [64, { layoff: 47, funding: 41, start_sale: 12 }], payday: [49, { a: 80, b: 20 }] },
  case02: { c2_logs: [120, { x: 100 }] },
};
const at = (caseId, nodeId, choiceId) => ({ caseId, nodeId, choiceId });

test("a scene with enough windows prints the card's share, and 드문 선택 for the minority's", () => {
  assert.equal(getSceneChoiceLine(ANSWER, at("case01", "start", "layoff")), "같은 카드를 고른 분석관 47%");
  assert.equal(getSceneChoiceLine(ANSWER, at("case01", "start", "start_sale")), "같은 카드를 고른 분석관 12% · 드문 선택");
  assert.equal(getSceneChoiceLine(ANSWER, at("case02", "c2_logs", "x")), "같은 카드를 고른 분석관 100%");
  assert.deepEqual(readSceneChoiceRate(ANSWER, at("case01", "start", "funding")), { windows: 64, percent: 41, rare: false });
  assert.equal(RARE_CHOICE_PERCENT, 20);
  assert.equal(SCENE_CHOICE_COPY.line(19, true), "같은 카드를 고른 분석관 19% · 드문 선택");
  assert.equal(readSceneChoiceRate({ c: { n: [50, { k: RARE_CHOICE_PERCENT }] } }, at("c", "n", "k")).rare, false, "the threshold itself is not rare");
});

test("too small a sample, another scene or card, or an answer out of shape prints nothing", () => {
  assert.equal(SCENE_CHOICE_FLOOR, 50);
  assert.equal(getSceneChoiceLine(ANSWER, at("case01", "payday", "a")), null, "49 windows: under the floor, checked on the device too");
  for (const scene of [at("case01", "start", "other"), at("case01", "nowhere", "layoff"), at("case09", "start", "layoff"), null, {}]) {
    assert.equal(getSceneChoiceLine(ANSWER, scene), null, JSON.stringify(scene));
  }
  for (const data of [null, [], "x", { case01: [] }, { case01: { start: [64] } }, { case01: { start: [64.5, { layoff: 4 }] } }, { case01: { start: [64, []] } }, { case01: { start: [64, { layoff: 101 }] } }, { case01: { start: [64, { layoff: 4.5 }] } }]) {
    assert.equal(getSceneChoiceLine(data, at("case01", "start", "layoff")), null, JSON.stringify(data));
  }
  assert.equal(getSceneChoiceLine(ANSWER, at("case01", "start", "layoff"), false), null, "offline: hidden");
});

test("the request carries nothing of the player's", () => {
  const hook = readFileSync("src/state/useSceneChoiceRates.js", "utf8");
  assert.match(hook, /rpc = callSupabaseRpc\)/);
  assert.match(hook, /rpc\("scene_choice_rates"\)/, "no body: the server is told no case, scene, card or id");
  assert.doesNotMatch(hook, /dataConsent|getSessionId|runId/);
});

const { createElement } = await import("react");
const { renderToStaticMarkup } = await import("react-dom/server");
const { fetchSceneChoiceRates, useSceneChoiceLine } = await import("../../src/state/useSceneChoiceRates.js");

test("no server, no answer, a refusal or a lost network prints nothing", async () => {
  for (const rpc of [() => ({ skipped: true, data: null }), () => ({}), () => undefined, () => Promise.reject(new Error("x")), () => { throw new Error("y"); }]) {
    const data = await fetchSceneChoiceRates(rpc);
    assert.equal(data, null, String(rpc));
    assert.equal(getSceneChoiceLine(data, at("case01", "start", "layoff")), null);
  }
  assert.equal(await fetchSceneChoiceRates(), null, "the real call in a build with no server");
  assert.deepEqual(await fetchSceneChoiceRates(() => ({ data: ANSWER })), ANSWER);
});

test("before any answer the reveal renders no line, and a card the room played asks for none", () => {
  let line = "unset";
  function Probe({ scene }) {
    line = useSceneChoiceLine(scene);
    return createElement("p", null, line ?? "");
  }
  assert.equal(renderToStaticMarkup(createElement(Probe, { scene: at("case01", "start", "layoff") })), "<p></p>");
  assert.equal(line, null);
  assert.equal(renderToStaticMarkup(createElement(Probe, { scene: null })), "<p></p>");
});

test("the reveal reaches the line only through the hook module, which has a chunk of its own; the commit hands it the scene", () => {
  const reveal = readFileSync("src/components/DecisionReveal.jsx", "utf8");
  assert.match(reveal, /import \{ useSceneChoiceLine \} from "\.\.\/state\/useSceneChoiceRates\.js";/);
  assert.doesNotMatch(reveal, /sceneChoices\.js/, "a direct import would pull the wording into PlayScreen");
  assert.match(reveal, /data-testid="choice-share"/);
  const config = readFileSync("vite.config.js", "utf8");
  assert.match(config, /const SCENE_CHOICES = "src\/state\/useSceneChoiceRates\.js";/);
  assert.match(config, /id: path\.resolve\(SCENE_CHOICES\),\s+name: "sceneChoices",/);
  assert.match(readFileSync("scripts/check-bundle-size.mjs", "utf8"), /pattern: \/\^sceneChoices-/);
  assert.match(readFileSync("src/state/useChoiceCommit.js", "utf8"), /scene: forced \? null : \{ caseId: currentCase, nodeId: resolvedNodeId, choiceId: choice\.id \}/);
  // Once a day, the free plan's compute (D3's wall rate is hourly).
  assert.match(readFileSync("supabase/migrations/20261027010000_scene_choice_rates.sql", "utf8"), /cron\.schedule\('refresh-scene-choice-stats', '29 18 \* \* \*'/);
});
