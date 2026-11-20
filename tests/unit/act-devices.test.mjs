// G5's acts 1, 2, 4, 6 and 8 (src/gauntlet/actTwists.js): the device twists, under the next rules.
process.env.RULES_NEXT = "1";
const assert = (await import("node:assert/strict")).default;
const { test } = await import("node:test");
const engine = await import("../../src/gauntlet/gauntletEngine.js");
const {
  ACT_DEVICE_CASES, ACT_DEVICE_TWIST_RULES, ACT_DEVICE_TWISTS_DEALT, ACT_DEVICES, ACT_TWIST_CASES, actTwistFor, LATE_BILL_CHIPS, LATE_BILL_SHARE, PASSED_DOWN_HARM, SIGN_NAME_CHIPS, SIGN_NAME_WALL, SIGN_TERMS_CHIPS, SIGN_TERMS_WALL, TRAINED_ABOVE, TRAINED_BELOW, TRAINED_MIN_WIDTH, twistHasDevice,
} = await import("../../src/gauntlet/actTwists.js");
const { caseDeviceOn, caseRuleFor, CASE_RULES } = await import("../../src/gauntlet/caseRules.js");
const { getActTwist, getCaseRule } = await import("../../src/gauntlet/weeklyRules.js");
const { HEAT_DEBT_GAUGE, HEAT_DEBT_SECONDS, INSURANCE_SHARE, PEAK_CASES, SCOUT_NARROW_REACH } = await import("../../src/gauntlet/tableRules.js");
const { NEXT_RULE, OLD_RULE } = await import("../../src/gauntlet/nextTableRules.js");
const koWeek = (await import("../../src/copy/weekRules.js")).default;
const enWeek = (await import("../../src/locales/en/screens/weekRules.js")).default;
const jaWeek = (await import("../../src/locales/ja/screens/weekRules.js")).default;

const DEVICE_TWISTS = Object.keys(ACT_DEVICE_TWIST_RULES);

test("each device twist names one device the list allows, and its act's cases leave out the quiet, the peak and the ladder", () => {
  assert.deepEqual(DEVICE_TWISTS, ["passedDown", "lateBill", "trainedWall", "onRecord", "signedByName"]);
  for (const id of DEVICE_TWISTS) {
    const { devices } = ACT_DEVICE_TWIST_RULES[id];
    assert.ok(devices.length > 0 && devices.every((device) => ACT_DEVICES.includes(device)), id);
    assert.equal(twistHasDevice(id, devices[0]), true, id);
  }
  assert.equal(twistHasDevice("lateBill", "trainedWall"), false, "a twist switches on only its own");
  assert.equal(twistHasDevice("merger", "lateBill"), false, "3, 5 and 7 move numbers only");
  assert.equal(twistHasDevice("lateBill", "erosion"), false, "a week's device is not a twist's");
  assert.equal(twistHasDevice(null, "lateBill"), false);
  const dealtIn = Object.keys(ACT_DEVICE_CASES);
  assert.equal(dealtIn.length, 15);
  for (const caseId of ["case01", "case02", "case03", "case07", "case08", "case19", "case21", "case24", "case31", "case36", "case42", "case43", "case45", "case47"]) {
    assert.ok(!dealtIn.includes(caseId), caseId);
  }
  for (const caseId of dealtIn) {
    assert.ok(!PEAK_CASES.includes(caseId), `${caseId} is a peak`);
    assert.ok(!Object.hasOwn(ACT_TWIST_CASES, caseId), `${caseId} has an act twist of 3, 5 or 7`);
  }
});

test("a device twist is dealt only once its engine part is in, behind a case's own rule and never beside a week's", () => {
  assert.deepEqual(ACT_DEVICE_TWISTS_DEALT, DEVICE_TWISTS, "all five are built");
  assert.equal(actTwistFor("case44", []), null, "a twist not built is not dealt");
  assert.equal(actTwistFor("case44"), "signedByName");
  assert.equal(actTwistFor("case05"), "passedDown");
  assert.equal(actTwistFor("case13"), "merger", "3, 5 and 7 as before");
  assert.equal(caseRuleFor("case10", {}), "lateBill");
  assert.equal(caseRuleFor("case10", { weekRule: "short-clock" }), null);
  assert.equal(caseRuleFor("case10", { story: true }), null);
  assert.equal(caseRuleFor("case10", {}, true, false), null, "the old table");
  assert.equal(caseRuleFor("case09", {}), CASE_RULES.case09, "N26's own rule stands where it was");
  assert.equal(caseDeviceOn("case10", {}, "lateBill"), true);
  assert.equal(caseDeviceOn("case10", { weekRule: "short-clock" }, "lateBill"), false);
  assert.equal(caseDeviceOn("case11", {}, "lateBill"), false);
});

test("the engine reads the case's twist under the case's rules", () => {
  const run = { open: { caseId: "case10" } };
  assert.equal(engine.getCaseTwist(run), "lateBill");
  assert.equal(engine.getCaseTwist(run, new Set([NEXT_RULE])), "lateBill");
  assert.equal(engine.getCaseTwist(run, new Set([OLD_RULE])), null, "a row played on the old table is checked on it");
  assert.equal(engine.getCaseTwist({ ...run, story: true }), null);
  assert.equal(engine.tableDeviceOn(run, "lateBill"), true);
  assert.equal(engine.tableDeviceOn({ open: { caseId: "case15" } }, "lateBill"), false);
});

test("2막 뒤늦은 청구서: sharper HEAT DEBT, thicker chips, HEAT SINK still wins", () => {
  const plain = engine.getTableSchema({});
  assert.equal(engine.getTableSchema({ open: { caseId: "case10" } }).chipsScale, plain.chipsScale * LATE_BILL_CHIPS);
  const cash = { outcome: "cash", gauge: 80, pushes: 2, streak: 0 };
  const billed = engine.buildNextSchema({ ...cash, twist: "lateBill" });
  const usual = engine.buildNextSchema(cash);
  assert.equal(billed.startGauge, Math.round(80 / LATE_BILL_SHARE));
  assert.equal(usual.startGauge, Math.round(80 / 3));
  assert.equal(billed.seconds, usual.seconds, "the clock's cut is the debt's as before");
  assert.equal(billed.lateBill, true);
  assert.equal(engine.normalizeSchema(billed).lateBill, true, "a saved board keeps it");
  assert.equal(engine.normalizeSchema(usual).lateBill, undefined);
  const sunk = engine.buildNextSchema({ ...cash, twist: "lateBill", relics: ["heatSink"] });
  assert.equal(sunk.startGauge, engine.buildNextSchema({ ...cash, relics: ["heatSink"] }).startGauge);
  assert.equal(sunk.lateBill, undefined);
  assert.equal(engine.buildNextSchema({ ...cash, gauge: HEAT_DEBT_GAUGE - 1, twist: "lateBill" }).lateBill, undefined, "under the debt's line, no bill");
  const [debt] = engine.describeMutations(billed);
  assert.equal(debt.id, "heatDebt");
  assert.match(debt.text, new RegExp(`${LATE_BILL_SHARE}분의 1`));
  assert.match(debt.text, new RegExp(`${HEAT_DEBT_SECONDS}초`));
  assert.match(engine.describeMutations(usual)[0].text, /3분의 1/);
});

test("1막 떠넘겨진 손실: the case's first BUST keeps a third of the pot and costs 사람 피해; the tool goes first, and never twice", () => {
  const bust = { status: "bust", cause: "push", gauge: 70, wall: 66, pushes: 3, elapsed: 10, focus: 0, focusMode: "strike" };
  const card = { id: "c", effect: { trust: 4 } };
  const at = (caseId, extra = {}) => engine.normalizeRunState({ open: { caseId }, runPot: 900, runHand: 300, ...extra });
  const first = engine.resolveWindow({ run: at("case05"), window: bust, card });
  assert.equal(first.verdict.passedDown, true);
  assert.equal(first.verdict.insuredPot, Math.floor(900 / INSURANCE_SHARE));
  assert.equal(first.verdict.lostPot, 900 - Math.floor(900 / INSURANCE_SHARE));
  assert.equal(first.nextRun.insuranceSpent, true);
  assert.deepEqual(engine.getBustEffect(first.verdict), { ...engine.BUST_EFFECT, humanCost: PASSED_DOWN_HARM });
  const second = engine.resolveWindow({ run: first.nextRun, window: bust, card });
  assert.equal(second.verdict.passedDown, undefined, "once a case");
  assert.equal(second.verdict.insuredPot, 0);
  const tooled = engine.resolveWindow({ run: at("case05", { relics: ["insurance"] }), window: bust, card });
  assert.equal(tooled.verdict.passedDown, undefined, "the insurance tool goes first, and costs no one");
  assert.equal(tooled.verdict.insuredPot, Math.floor(900 / INSURANCE_SHARE));
  assert.equal(engine.resolveWindow({ run: at("case07"), window: bust, card }).verdict.passedDown, undefined, "not the act's case");
  assert.equal(engine.resolveWindow({ run: at("case05", { weekRule: "short-clock" }), window: bust, card }).verdict.passedDown, undefined, "a week's season");
  assert.equal(engine.resolveWindow({ run: at("case05"), window: bust, card, rules: new Set([OLD_RULE]) }).verdict.passedDown, undefined, "the old table");
  assert.equal(engine.resolveWindow({ run: at("case05", { runPot: 0 }), window: bust, card }).verdict.passedDown, undefined, "nothing to keep, nothing spent");
  assert.equal(engine.getBustEffect({}), engine.BUST_EFFECT);
});

test("4막 학습된 벽: the band stands around the heat the last cash was made at, and its one look is the narrow one", () => {
  const board = { wallMin: 56, wallMax: 92 };
  assert.deepEqual(engine.getTrainedBand(80, board), { wallMin: 80 - TRAINED_BELOW, wallMax: 92 });
  assert.deepEqual(engine.getTrainedBand(65, board), { wallMin: 65 - TRAINED_BELOW, wallMax: 65 + TRAINED_ABOVE });
  assert.deepEqual(engine.getTrainedBand(45, board), { wallMin: 56, wallMax: 56 + TRAINED_MIN_WIDTH }, "a low cash: widened up");
  assert.deepEqual(engine.getTrainedBand(98, board), { wallMin: 92 - TRAINED_MIN_WIDTH, wallMax: 92 }, "past the band: widened down");
  for (let heat = 0; heat <= 100; heat += 1) {
    const band = engine.getTrainedBand(heat, board);
    assert.ok(band.wallMin >= 56 && band.wallMax <= 92 && band.wallMax - band.wallMin >= TRAINED_MIN_WIDTH, `heat ${heat}`);
  }
  const cash = { outcome: "cash", gauge: 65, pushes: 2, streak: 0, focusMode: "strike" };
  const trained = engine.buildNextSchema({ ...cash, twist: "trainedWall" });
  assert.equal(trained.trained, true);
  assert.equal(trained.wallMin, 65 - TRAINED_BELOW);
  assert.equal(trained.wallMax, 65 + TRAINED_ABOVE);
  assert.equal(engine.normalizeSchema(trained).trained, true);
  assert.equal(engine.buildNextSchema({ ...cash, outcome: "bust", cause: "push" , twist: "trainedWall" }).trained, undefined, "a BUST's board as usual");
  assert.equal(engine.buildNextSchema({ ...cash, caseClosed: true, twist: "trainedWall" }).trained, undefined, "the next case's first board as usual");
  assert.equal(engine.buildNextSchema(cash).trained, undefined);
  // One look, already the narrow one; the second is refused.
  let win = engine.createWindow({ schema: trained, seed: "trained" });
  win = engine.reduceWindow(win, { type: "SCOUT" });
  const band = engine.getWindowBand(win);
  assert.equal(win.scouted, true);
  assert.ok(band.wallMax - band.wallMin <= SCOUT_NARROW_REACH * 2 && band.wallMin <= win.wall && win.wall <= band.wallMax);
  assert.equal(engine.reduceWindow(win, { type: "SCOUT" }), win);
  assert.equal(caseRuleFor("case22", {}), "trainedWall");
  assert.equal(caseRuleFor("case21", {}), null, "the season's quietest case");
});
test("6막 진술 고정: the case's first cash puts its stance on record, every cash carries it, and no board changes it", () => {
  const cash = { outcome: "cash", gauge: 50, pushes: 2, streak: 0, focusMode: "steady", focusCharge: 0, focusHits: 0, twist: "onRecord" };
  const recorded = engine.buildNextSchema(cash);
  assert.equal(recorded.stanceLocked, "steady");
  assert.ok(recorded.mutations.includes("steadyLine"), "carried without a charge");
  assert.ok(!engine.buildNextSchema({ ...cash, twist: null }).mutations.includes("steadyLine"), "elsewhere the charge is still asked");
  assert.equal(engine.buildNextSchema({ ...cash, twist: null }).stanceLocked, undefined);
  assert.equal(engine.buildNextSchema({ ...cash, outcome: "bust", cause: "push", stanceLocked: "steady" }).stanceLocked, "steady", "a BUST keeps the record");
  assert.equal(engine.buildNextSchema({ ...cash, outcome: "bust", cause: "push" }).stanceLocked, undefined, "a BUST before the first cash records nothing");
  assert.equal(engine.buildNextSchema({ ...cash, caseClosed: true }).stanceLocked, undefined, "the next case starts free");
  assert.equal(engine.buildNextSchema({ ...cash, rules: new Set(["lock"]) }).stanceLocked, undefined, "a table without stances");
  let win = engine.createWindow({ schema: recorded, seed: "record" });
  assert.equal(win.focusMode, "steady", "the board opens in the recorded stance");
  assert.equal(engine.reduceWindow(win, { type: "SET_FOCUS_MODE", mode: "strike" }), win);
  assert.equal(engine.normalizeSchema(recorded).stanceLocked, "steady");
  assert.equal(engine.normalizeSchema({ stanceLocked: "nap" }).stanceLocked, undefined);
  win = engine.createWindow({ schema: engine.buildNextSchema({ ...cash, twist: null }), seed: "free" });
  assert.notEqual(engine.reduceWindow(win, { type: "SET_FOCUS_MODE", mode: "expose" }), win);
  assert.equal(caseRuleFor("case34", {}), "onRecord");
});
test("8막 실명 서명: the case is signed before its first board, by name or with conditions, and not choosing is conditions", () => {
  const opened = engine.stampCaseOpen(engine.normalizeRunState({ windowIndex: 7 }), { caseId: "case46" });
  const plain = engine.getTableSchema({ schema: opened.schema });
  assert.equal(engine.asksToSign(opened), true);
  const terms = engine.getTableSchema(opened);
  assert.equal(terms.wallMin, plain.wallMin + SIGN_TERMS_WALL);
  assert.equal(terms.chipsScale, plain.chipsScale * SIGN_TERMS_CHIPS);
  const named = engine.signCase(opened, "name");
  assert.equal(named.open.signed, "name");
  const board = engine.getTableSchema(named);
  assert.equal(board.wallMin, plain.wallMin - SIGN_NAME_WALL);
  assert.equal(board.chipsScale, plain.chipsScale * SIGN_NAME_CHIPS);
  assert.equal(engine.getTableSchema(named), board, "one board per saved board");
  assert.equal(engine.signCase(named, "terms").open.signed, "terms", "changed before the first board");
  assert.equal(engine.signCase(opened, "blank"), opened);
  assert.equal(engine.normalizeCaseOpen(named.open).signed, "name");
  assert.equal(engine.normalizeCaseOpen(opened.open).signed, undefined);
  assert.equal(engine.normalizeRunState(named).open.signed, "name", "a save keeps it");
  // Once a board of the case is played, the line is signed.
  const played = { ...named, windowIndex: named.windowIndex + 1 };
  assert.equal(engine.asksToSign(played), false);
  assert.equal(engine.signCase(played, "terms"), played);
  const elsewhere = engine.stampCaseOpen(engine.normalizeRunState({}), { caseId: "case45" });
  assert.equal(engine.asksToSign(elsewhere), false, "a rest case");
  assert.equal(engine.signCase(elsewhere, "name"), elsewhere);
  assert.equal(engine.asksToSign({ ...opened, weekRule: "short-clock" }), false, "a week's season");
});
test("each device twist's panel line is in ko, en and ja, its numbers filled", () => {
  for (const id of DEVICE_TWISTS) {
    for (const table of [koWeek, enWeek, jaWeek]) {
      const words = table.actTwists[id];
      assert.ok(words.title && words.text && words.world, id);
    }
    const rule = getActTwist(id);
    assert.equal(rule.act, ACT_DEVICE_TWIST_RULES[id].act);
    assert.doesNotMatch(rule.text, /\{|undefined|NaN/, id);
  }
  const bill = getCaseRule("case10", "lateBill");
  assert.ok(bill.world && /열기 60 이상/.test(bill.text) && /2분의 1/.test(bill.text) && /1\.2배/.test(bill.text), bill.text);
});
