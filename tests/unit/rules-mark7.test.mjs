import assert from "node:assert/strict";
import test from "node:test";
import {
  applyGauntletEffect,
  BASE_SCHEMA,
  createWindow,
  getLockPressSeconds,
  getNameWall,
  getTableSchema,
  normalizeRunState,
  normalizeSchema,
  reduceWindow,
  resolveWindow,
  RULES_MARK,
  RUN_INITIAL_STATE,
  signCase,
  stampCaseOpen,
} from "../../src/gauntlet/gauntletEngine.js";
import {
  BEFORE_SEVEN_RULE,
  countScouts,
  isMarkSevenOn,
  isNextOn,
  RULES_SEVEN_MARK,
  scoutTrustAt,
  SEVEN_RULE,
  wantsMarkSeven,
  withMarkSeven,
  withNextRules,
} from "../../src/gauntlet/nextTableRules.js";
import { getRelicBoost, readRelicBoost, RELIC_BOOST_CAP, RELIC_BOOSTS } from "../../src/gauntlet/relicsNext.js";
import { SIGN_LAST_CASE, SIGN_NAME_CHIPS, SIGN_NAME_WALL, SIGN_NAME_WALL_HIGH, SIGN_NAME_WALL_LOW } from "../../src/gauntlet/actTwists.js";
import { LOCK_DRAG, LOCK_PRESS_SECONDS, SCOUT_TRUST } from "../../src/gauntlet/tableRules.js";
import { readTableMeters } from "../../src/gauntlet/tableMeters.js";
import { ALL_RULES } from "../../src/gauntlet/tableUnlocks.js";
import { getActTwist, getCaseRule, getWeekRule } from "../../src/gauntlet/weeklyRules.js";
import { getRowRules } from "../../src/rankingRecheck.js";
import koWeek from "../../src/copy/weekRules.js";
import enWeek from "../../src/locales/en/screens/weekRules.js";
import jaWeek from "../../src/locales/ja/screens/weekRules.js";
import koEdge from "../../src/copy/edge.js";
import enEdge from "../../src/locales/en/screens/edge.js";
import jaEdge from "../../src/locales/ja/screens/edge.js";
import koRelics from "../../src/copy/relics.js";
import enRelics from "../../src/locales/en/screens/relics.js";
import jaRelics from "../../src/locales/ja/screens/relics.js";

/**
 * RULES_MARK 7 (2026-11-25, with the wipe; 게임성 개선점 2026-11-20 G11b·c,
 * G13, G16, G18): what each rule does, and that a row of 6 is played as it
 * was. What they are worth is check:pressure's (`--compare`, the `mark7` rows).
 */
const SEVEN = withMarkSeven(ALL_RULES, true);
const SIX = withMarkSeven(ALL_RULES, false);
const OLD = withNextRules(ALL_RULES, false);
const card = { id: "c", label: "c", effect: { trust: 10, capital: -4 } };

test("RULES_MARK 7: this engine's mark, its rules on by default, and a row of 6 or older played without them", () => {
  assert.ok(RULES_MARK >= 7, "RULES_MARK 8 keeps 7's rules");
  assert.equal(RULES_SEVEN_MARK, 7);
  assert.equal(wantsMarkSeven({}), true);
  assert.equal(wantsMarkSeven({ process: { env: { RULES_MARK7: "0" } } }), false);
  assert.equal(isMarkSevenOn(ALL_RULES), true, "a case's own set plays what the page plays");
  assert.equal(isMarkSevenOn(SEVEN), true);
  assert.equal(isMarkSevenOn(SIX), false);
  assert.ok(SIX.has(BEFORE_SEVEN_RULE) && !SIX.has(SEVEN_RULE) && SIX.has("lock"));
  assert.equal(withMarkSeven(ALL_RULES, true), ALL_RULES, "already so: the same set");
  assert.equal(withMarkSeven(ALL_RULES, false), SIX, "the same set each time");
  assert.equal(isMarkSevenOn(OLD), false, "the old rules play none of these");
  assert.equal(isMarkSevenOn(withMarkSeven(OLD, true)), false, "and naming 7 on them does not switch the next rules on");
  assert.equal(isMarkSevenOn(withMarkSeven({ has: () => true }, true)), false, "a stand-in that names every id is the old table");
  for (const [mark, next, seven] of [[4, false, false], [5, true, false], [6, true, false], [7, true, true], [8, true, true]]) {
    const rules = getRowRules("case20", {}, mark);
    assert.equal(isNextOn(rules), next, `mark ${mark}: next`);
    assert.equal(isMarkSevenOn(rules), seven, `mark ${mark}: 7`);
  }
  assert.equal(isMarkSevenOn(getRowRules("case20", {})), true, "no mark: what this engine plays");
});

test("G11c: tools that pay on one cash pay RELIC_BOOST_CAP at most together, never less than the biggest alone", () => {
  const hotOverclock = { gauge: 80, pushes: 2, move: "hold", streak: 0, afterBust: true, mutations: ["overclock"], clockLeft: 0.2, focusMode: "strike", focusCharged: false };
  // HEAT SINK ×1.6 and FRONT PAGE ×1.15: ×1.84 before, the cap now.
  const pair = readRelicBoost(["heatSink", "frontPage"], hotOverclock, RELIC_BOOST_CAP);
  assert.deepEqual(pair, { fired: ["heatSink", "frontPage"], factor: RELIC_BOOST_CAP, capped: true });
  assert.equal(readRelicBoost(["heatSink", "frontPage"], hotOverclock).factor, RELIC_BOOSTS.heatSink.boost * getRelicBoost("frontPage"), "no cap: the product (FRONT PAGE ×1.12 from 14, G51)");
  // COLD BLOOD ×2 with HEAT SINK: no less than COLD BLOOD alone.
  assert.equal(readRelicBoost(["coldBlood", "heatSink"], hotOverclock, RELIC_BOOST_CAP).factor, RELIC_BOOSTS.coldBlood.boost);
  assert.deepEqual(readRelicBoost(["coldBlood"], hotOverclock, RELIC_BOOST_CAP), { fired: ["coldBlood"], factor: RELIC_BOOSTS.coldBlood.boost }, "one tool alone is never cut");
  assert.equal(readRelicBoost(["frontPage", "testimony"], { ...hotOverclock, clockLeft: 0.9 }, RELIC_BOOST_CAP).capped, undefined, "under the cap: as it was");
  // In the settlement: the same hot cash after a bust, under 7 and under 6.
  const run = normalizeRunState({ relics: ["heatSink", "coldBlood"], lastOutcome: "bust" });
  const window = { status: "cashed", gauge: 80, wall: 95, pushes: 3, seed: "g11c" };
  const seven = resolveWindow({ run, window, card, rules: SEVEN }).verdict;
  const six = resolveWindow({ run, window, card, rules: SIX }).verdict;
  assert.ok(seven.relicProcs.includes("heatSink") && seven.relicProcs.includes("coldBlood"), "both still fire");
  assert.ok(Math.abs(seven.pot / six.pot - RELIC_BOOSTS.coldBlood.boost / (RELIC_BOOSTS.coldBlood.boost * RELIC_BOOSTS.heatSink.boost)) < 0.01, `${seven.pot} against ${six.pot}`);
});

test("G13: the case's first looks climb in price 1, 1, 1, 2, 2, 3, and the settle bills the price the verdict carries", () => {
  assert.deepEqual([0, 1, 2, 3, 4, 5, 6, 7].map(scoutTrustAt), [1, 1, 1, 2, 2, 3, 3, 4]);
  assert.equal(scoutTrustAt(0), SCOUT_TRUST, "the first three at the old price");
  assert.equal(countScouts([{ threshold: { scouted: true } }, { threshold: { scouted: false } }, {}, { threshold: { scouted: true, narrowed: true } }]), 2);
  const scouted = { status: "cashed", gauge: 50, wall: 90, pushes: 2, scouted: true };
  const verdict = resolveWindow({ run: RUN_INITIAL_STATE, window: scouted, card, rules: SEVEN, scouts: 5 }).verdict;
  assert.equal(verdict.scoutTrust, 3);
  assert.equal(resolveWindow({ run: RUN_INITIAL_STATE, window: scouted, card, rules: SIX, scouts: 5 }).verdict.scoutTrust, undefined, "6: the old price, not written");
  assert.equal(resolveWindow({ run: RUN_INITIAL_STATE, window: { ...scouted, scouted: false }, card, rules: SEVEN, scouts: 5 }).verdict.scoutTrust, undefined, "no look, no price");
  assert.equal(applyGauntletEffect({ trust: 0 }, { outcome: "cash", gauge: 50, scouted: true, scoutTrust: verdict.scoutTrust }).trust, -3);
  assert.equal(applyGauntletEffect({ trust: 0 }, { outcome: "cash", gauge: 50, scouted: true }).trust, -SCOUT_TRUST, "an older entry: the old price");
  assert.equal(applyGauntletEffect({ trust: 0 }, { outcome: "cash", gauge: 50, scouted: true, narrowed: true, narrowTrust: 4, scoutTrust: 2 }).trust, -6, "both looks");
  // The table sells the look only to a run that can pay the case's price.
  const win = createWindow({ schema: BASE_SCHEMA, seed: "g13" });
  const meters = (trust, scoutCount) => readTableMeters({ win, schema: win.schema, selectedCard: null, run: null, audit: null, resources: { trust }, caseId: "case20", scoutCount });
  assert.equal(meters(2, 5).scoutPrice, 3);
  assert.equal(meters(2, 5).canPayScout, false);
  assert.equal(meters(2, 2).canPayScout, true);
});

test("G16: by name, the wall stands 1 to 3 closer as the case drew it, 사건 49 always 3, and the board deals it", () => {
  const open = (caseId, windowIndex) => stampCaseOpen(normalizeRunState({ windowIndex }), { caseId });
  const drawn = new Set();
  for (let windowIndex = 0; windowIndex < 60; windowIndex += 1) {
    for (const caseId of ["case44", "case46", "case48"]) {
      const wall = getNameWall(open(caseId, windowIndex));
      assert.ok(wall >= SIGN_NAME_WALL_LOW && wall <= SIGN_NAME_WALL_HIGH);
      drawn.add(wall);
      assert.equal(getNameWall(open(caseId, windowIndex)), wall, "the same case opened on the same window draws the same");
    }
    assert.equal(getNameWall(open(SIGN_LAST_CASE, windowIndex)), SIGN_NAME_WALL_HIGH);
  }
  assert.deepEqual([...drawn].sort(), [1, 2, 3], "every wall is drawn somewhere");
  assert.equal(getNameWall(open("case44", 3), SIX), SIGN_NAME_WALL, "6: the fixed wall");
  // The board dealt by name moves by the drawn wall, and with conditions as before.
  for (let windowIndex = 0; windowIndex < 12; windowIndex += 1) {
    const opened = open("case46", windowIndex);
    const plain = getTableSchema({ schema: opened.schema });
    const named = signCase(opened, "name");
    const board = getTableSchema(named);
    assert.equal(board.wallMin, plain.wallMin - getNameWall(named));
    assert.equal(board.chipsScale, plain.chipsScale * SIGN_NAME_CHIPS);
    assert.equal(getTableSchema(named), board, "one board per saved board");
  }
});

test("G18: on a short clock's board a LOCK press takes LOCK_DRAG of the clock under 7, and anywhere else what it took", () => {
  const shortClock = getTableSchema({ schema: BASE_SCHEMA, weekRule: "short-clock" });
  assert.equal(shortClock.lockDrag, true);
  assert.equal(normalizeSchema(shortClock).lockDrag, true, "the board keeps it (a save, a replay record)");
  assert.equal(normalizeSchema(BASE_SCHEMA).lockDrag, undefined);
  const hearing = getTableSchema(stampCaseOpen(normalizeRunState({}), { caseId: "case40" }));
  assert.equal(hearing.lockDrag, true, "7막 청문회");
  const at = (schema) => reduceWindow(createWindow({ schema, seed: "g18" }), { type: "SELECT", id: "c" }, SEVEN);
  assert.equal(getLockPressSeconds(at(shortClock), SEVEN), LOCK_PRESS_SECONDS * LOCK_DRAG);
  assert.equal(getLockPressSeconds(at(shortClock), SIX), LOCK_PRESS_SECONDS);
  assert.equal(getLockPressSeconds(at(BASE_SCHEMA), SEVEN), LOCK_PRESS_SECONDS);
  const pressed = (schema, rules) => reduceWindow(at(schema), { type: "FOCUS" }, rules).elapsed;
  assert.ok(Math.abs(pressed(shortClock, SEVEN) - LOCK_PRESS_SECONDS * LOCK_DRAG) < 1e-9);
  assert.ok(Math.abs(pressed(shortClock, SIX) - LOCK_PRESS_SECONDS) < 1e-9, "a row of 6 replays as it was");
  assert.ok(Math.abs(pressed(BASE_SCHEMA, SEVEN) - LOCK_PRESS_SECONDS) < 1e-9);
});

test("RULES_MARK 7's words are in ko, en and ja, their numbers filled", () => {
  for (const [week, edge, relics] of [[koWeek, koEdge, koRelics], [enWeek, enEdge, enRelics], [jaWeek, jaEdge, jaRelics]]) {
    for (const text of [week.rules["short-clock"].text, week.caseRules.case09.text, week.actTwists.hearing.text]) assert.match(text, /\{lockDrag\}/);
    assert.match(week.actTwists.signedByName.text, /\{nameWallLow\}.*\{nameWallHigh\}/);
    assert.match(edge.sign.nameWall, /\{wall\}/);
    assert.match(relics.draft?.spendHintNext ?? relics.spendHintNext ?? JSON.stringify(relics), /\{cap\}/);
  }
  for (const rule of [getWeekRule("short-clock"), getCaseRule("case09", "short-clock"), getActTwist("hearing")]) {
    assert.ok(rule.text.includes(String(LOCK_DRAG)), rule.text);
    assert.doesNotMatch(rule.text, /\{/);
  }
  const sign = getActTwist("signedByName").text;
  assert.ok(sign.includes(`${SIGN_NAME_WALL_LOW}~${SIGN_NAME_WALL_HIGH}`), sign);
});

test("G13's climbing price says no particle on its number, in ko, en and ja (2, 4: never 「2과」 or 「2을」)", async () => {
  const { describeScout } = await import("../../src/gauntlet/tableVoice.js");
  const { default: koTable } = await import("../../src/copy/table.js");
  const { fill } = await import("../../src/locale.js");
  for (const trust of [1, 2, 3, 4]) {
    const said = describeScout({ wallMin: 70, wallMax: 90 }, trust);
    assert.ok(said.includes(`믿음 −${trust}`), said);
    const label = fill(koTable.notices.scoutLabel, { min: 70, max: 90, trust, seconds: 3 });
    assert.equal(label, `벽 70–90 · 조회, 믿음 ${trust} · 시간 3초`);
  }
  for (const text of [koTable.notices.scoutLabel, koTable.voice?.scout ?? ""]) assert.doesNotMatch(text, /\{trust\}[과와을를이가은는]/);
});

test("G16: the sign panel's drawn wall describes the group and 「이름만」, so tabbing to the buttons hears it", async () => {
  const { readFileSync } = await import("node:fs");
  const panel = readFileSync(new URL("../../src/gauntlet/WeekRulePanel.jsx", import.meta.url), "utf8");
  const ask = panel.slice(panel.indexOf("export function SignAsk("), panel.indexOf("function SeasonEchoPanel("));
  assert.match(ask, /role="group" aria-labelledby="gx-sign-ask" aria-describedby="gx-sign-name-wall"/);
  assert.match(ask, /<p id="gx-sign-name-wall" data-testid="sign-name-wall">\{fill\(edgeCopy\.sign\.nameWall, \{ wall: getNameWall\(run\) \}\)\}<\/p>/);
  assert.match(ask, /aria-describedby=\{way === "name" \? "gx-sign-name-wall" : undefined\}/);
  for (const edge of [koEdge, enEdge, jaEdge]) assert.ok(edge.sign.nameWall.length > 0 && !/\{(?!wall\})/.test(edge.sign.nameWall));
});
