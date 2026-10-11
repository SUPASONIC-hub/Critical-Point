import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

import { seasonCasesBase } from "../../src/gameCases.js";
import { createCaseSummary, getSeasonLogic } from "../../src/gameLogic.js";
import {
  createLogicReport,
  describeLogicCase,
  getHottestCase,
  getLogicRankLine,
  LOGIC_RANK_BANDS,
  LOGIC_RANK_COPY,
  LOGIC_RANK_FLOOR,
  LOGIC_REPORT_COPY,
  LOGIC_REPORT_MIN_CASES,
  LOGIC_STANDING_PENDING,
} from "../../src/logicReport.js";
import { easyCognitionLabels } from "../../src/playerLanguage.js";

/**
 * The season's logic panel (src/logicReport.js): which case it names, which
 * sentence it says of that case, the score's line and its rank, and what a
 * story season and an old save print.
 */
const record = (values = {}) => ({ windows: 6, heat: 3, peak: 1, top: ["inference", 2], grows: 0, switches: 0, breaks: 0, busts: 0, keeps: 0, best: 0, ...values });
// Seven cases as the season lists them (id, label, title); the titles are this file's own, so a retitled case moves no assertion.
const CASES = ["72시간", "가짜 신호", "이름 없는 승인", "넷째", "다섯째", "여섯째", "일곱째"].map((title, index) => ({ id: `case0${index + 1}`, label: `사건 0${index + 1}`, title }));
const seasonOf = (records) => Object.fromEntries(records.map((values, index) => [CASES[index].id, values ? { logicRecord: record(values) } : { rank: "B" }]));

/** Six cases at a mean heat of 0.5, and 사건 03 at 2.0 with five of its eight windows on 위험 다루기. */
const SEASON = seasonOf([{}, { breaks: 1 }, { windows: 8, heat: 16, peak: 3, top: ["risk", 5], grows: 3, switches: 1, breaks: 1, busts: 1, best: 9 }, {}, { keeps: 2 }, {}, { best: 4 }]);

test("the panel names the hottest case, what the hand closed it on, and the season's score", () => {
  const report = createLogicReport({ caseResults: SEASON, cases: CASES });
  assert.deepEqual(report, {
    label: "논리 유지력",
    mark: "LOGIC HOLD",
    lines: [
      "열기가 가장 높았던 사건은 사건 03 「이름 없는 승인」입니다. 그 사건의 8판 가운데 5판을 '위험 다루기'로 닫았습니다.",
      "논리 유지력 93점 · 최고 논리 콤보 9 · 순위는 시즌 기록이 50건 모이면 나옵니다.",
      "논리 유지력은 콤보가 끊길 수 있던 판 가운데 끊기지 않은 판의 비율입니다. 관점 전환 점수와는 반대로 움직일 수 있습니다.",
    ],
  });
  // 44 windows, 2 kept for want of the type, 3 ended: 100 x 39 / 42.
  assert.deepEqual(getSeasonLogic(SEASON), { logicHold: 93, bestLogic: 9 });
});

test("the score is the stored season's, whatever the live summary of a replayed case reads", () => {
  // A replay's log would make another record; the season keeps the first (createCaseSummary's replayOf).
  const first = SEASON[CASES[2].id];
  const replayLog = [{ caseId: CASES[2].id, threshold: { logic: { type: "inference", tier: 0, move: "break", streak: 0 } } }];
  assert.deepEqual(createCaseSummary({}, {}, replayLog, { resources: {}, replayOf: first }).logicRecord, first.logicRecord);
  assert.notDeepEqual(createCaseSummary({}, {}, replayLog, { resources: {} }).logicRecord, first.logicRecord);
});

test("the hottest case is the highest mean closing tier, then the most busts, then the later case", () => {
  const pick = (records) => getHottestCase(seasonOf(records), CASES)?.id;
  assert.equal(pick([{ windows: 4, heat: 4 }, { windows: 8, heat: 9 }, { windows: 3, heat: 3 }]), CASES[1].id, "1.125 over 1.0");
  // 2 of 3 and 4 of 6 are one mean; no rounding parts them.
  assert.equal(pick([{ windows: 3, heat: 2, busts: 1 }, { windows: 6, heat: 4 }]), CASES[0].id, "the same mean: more busts");
  assert.equal(pick([{ windows: 3, heat: 2, busts: 1 }, { windows: 6, heat: 4, busts: 1 }, { windows: 9, heat: 5 }]), CASES[1].id, "the same mean and busts: the later");
  // A case too short to average is not compared, however hot.
  assert.equal(pick([{ windows: 2, heat: 6 }, { windows: 3, heat: 0 }]), CASES[1].id);
  assert.equal(pick([{ windows: 2, heat: 6 }, null]), undefined);
  assert.equal(getHottestCase(undefined, CASES), null);
  assert.equal(getHottestCase({ [CASES[0].id]: { logicRecord: "x" } }, CASES), null);
  const hottest = getHottestCase(SEASON, CASES);
  assert.deepEqual([hottest.label, hottest.title, hottest.record.heat], ["사건 03", "이름 없는 승인", 16]);
});

test("one case reads as held, as switched, or as not staying on a type", () => {
  // Held: half the windows or more on one type, with the count; every window says so.
  assert.equal(describeLogicCase(record({ windows: 8, top: ["risk", 5], breaks: 2 })), "그 사건의 8판 가운데 5판을 '위험 다루기'로 닫았습니다.");
  assert.equal(describeLogicCase(record({ windows: 8, top: ["persistence", 4] })), "그 사건의 8판 가운데 4판을 '끝까지 버티기'로 닫았습니다.");
  assert.equal(describeLogicCase(record({ windows: 6, top: ["reframing", 6] })), "그 사건의 6판을 모두 '판 바꾸기'로 닫았습니다.");
  assert.equal(describeLogicCase(record({ windows: 3, top: ["inference", 9] })), "그 사건의 3판을 모두 '꼼꼼히 확인하기'로 닫았습니다.", "a count past the windows is the windows");
  // Not held, and nothing ended the streak.
  assert.equal(describeLogicCase(record({ windows: 8, top: ["risk", 3], switches: 2 })), "그 사건에서 열기가 오른 뒤 유형을 2번 바꿨고, 논리 콤보는 끊기지 않았습니다.");
  assert.equal(describeLogicCase(record({ windows: 8, top: ["risk", 3], keeps: 3 })), "그 사건에서는 한 유형에 머물지 않았지만, 논리 콤보는 끊기지 않았습니다.");
  // Not held, and it ended: breaks and busts together, as the score counts them.
  assert.equal(describeLogicCase(record({ windows: 8, top: ["risk", 3], switches: 2, breaks: 2, busts: 1 })), "그 사건에서는 한 유형에 머물지 않았고, 논리 콤보가 3번 끊겼습니다.");
  // A record with no type picked (every window run out), or one this build has no name for.
  assert.equal(describeLogicCase(record({ windows: 4, top: null, busts: 4 })), "그 사건에서는 한 유형에 머물지 않았고, 논리 콤보가 4번 끊겼습니다.");
  assert.equal(describeLogicCase(record({ windows: 4, top: ["unknown", 4] })), LOGIC_REPORT_COPY.unbroken);
  assert.equal(describeLogicCase(undefined), LOGIC_REPORT_COPY.unbroken);
  // Every type's name takes 로.
  for (const label of Object.values(easyCognitionLabels)) assert.match(LOGIC_REPORT_COPY.held(8, 5, label), new RegExp(`'${label}'로 닫았습니다`));
});

test("a season with few recorded cases names none, and one with no record prints no panel", () => {
  assert.equal(LOGIC_REPORT_MIN_CASES, 5);
  const four = seasonOf([{}, null, { windows: 8, heat: 16, breaks: 2, best: 3 }, {}, null, {}, null]);
  assert.deepEqual(createLogicReport({ caseResults: four, cases: CASES }).lines, [
    "논리 콤보 기록이 있는 사건이 아직 적어, 열기가 가장 높았던 사건을 짚지 않습니다.",
    "논리 유지력 92점 · 최고 논리 콤보 3 · 순위는 시즌 기록이 50건 모이면 나옵니다.",
    LOGIC_REPORT_COPY.caption,
  ]);
  const five = seasonOf([{}, null, { windows: 8, heat: 16, top: ["risk", 2], breaks: 2, best: 3 }, {}, {}, {}, null]);
  assert.match(createLogicReport({ caseResults: five, cases: CASES }).lines[0], /^열기가 가장 높았던 사건은 사건 03 「이름 없는 승인」입니다\. 그 사건에서는 한 유형에 머물지 않았고, 논리 콤보가 2번 끊겼습니다\.$/);
  // Five recorded cases, none long enough to average.
  assert.equal(createLogicReport({ caseResults: seasonOf(Array(5).fill({ windows: 2, heat: 2 })), cases: CASES }).lines[0], LOGIC_REPORT_COPY.tooFew);
  // An old save: summaries from before the streak.
  for (const none of [{}, undefined, seasonOf([null, null]), { [CASES[0].id]: { logicRecord: "x" } }]) assert.equal(createLogicReport({ caseResults: none, cases: CASES }), null);
  assert.equal(createLogicReport(), null);
  // No window that could have ended a streak: no score, so no rank, and the streak alone.
  assert.equal(createLogicReport({ caseResults: seasonOf([{ windows: 2, keeps: 2, best: 5 }]), cases: CASES }).lines[1], "최고 논리 콤보 5");
});

test("a story-mode season prints the sentence and the score, and no rank", () => {
  const story = { ...SEASON, [CASES[4].id]: { ...SEASON[CASES[4].id], assistStory: true } };
  for (const standing of [undefined, LOGIC_STANDING_PENDING, { band: 10 }, { below: true }, null]) {
    const report = createLogicReport({ caseResults: story, cases: CASES, ...(standing === undefined ? {} : { standing }) });
    assert.deepEqual(report.lines, [
      "열기가 가장 높았던 사건은 사건 03 「이름 없는 승인」입니다. 그 사건의 8판 가운데 5판을 '위험 다루기'로 닫았습니다.",
      "논리 유지력 93점 · 최고 논리 콤보 9",
      LOGIC_REPORT_COPY.caption,
    ]);
  }
});

test("the rank beside the score: waiting for the floor, a band, under the median, or nothing", () => {
  assert.equal(LOGIC_RANK_FLOOR, 50);
  assert.deepEqual(LOGIC_RANK_BANDS, [1, 5, 10, 25, 50]);
  assert.equal(getLogicRankLine(LOGIC_STANDING_PENDING), "순위는 시즌 기록이 50건 모이면 나옵니다.");
  assert.deepEqual(LOGIC_RANK_BANDS.map((band) => getLogicRankLine({ band })), ["상위 1% 안", "상위 5% 안", "상위 10% 안", "상위 25% 안", "상위 50% 안"]);
  assert.equal(getLogicRankLine({ below: true }), "상위 50% 밖");
  // A ranking that could not be read, and anything that is not a standing.
  for (const none of [null, undefined, {}, { band: 7 }, { band: "10" }, { pending: 1 }, { below: "yes" }, "pending", 10]) assert.equal(getLogicRankLine(none), "");
  assert.equal(LOGIC_RANK_COPY.none, "");

  const line = (standing) => createLogicReport({ caseResults: SEASON, cases: CASES, standing }).lines[1];
  assert.equal(line({ band: 10 }), "논리 유지력 93점 · 최고 논리 콤보 9 · 상위 10% 안");
  assert.equal(line({ below: true }), "논리 유지력 93점 · 최고 논리 콤보 9 · 상위 50% 밖");
  assert.equal(line(null), "논리 유지력 93점 · 최고 논리 콤보 9");
});

test("the report says 열기 and never 압박, and every character it can print is in the game's font", () => {
  const charset = new Set(
    readFileSync(new URL("../../src/assets/fonts/pretendard-cp.charset.txt", import.meta.url), "utf8")
      .split("\n")
      .filter(Boolean)
      .map((line) => String.fromCodePoint(parseInt(line.slice(0, line.indexOf(" ")), 16))),
  );
  assert.ok(charset.size > 1000, "the charset file was read");
  const strings = new Set(["0123456789", ...LOGIC_RANK_BANDS.map((band) => LOGIC_RANK_COPY.band(band)), LOGIC_RANK_COPY.pending, LOGIC_RANK_COPY.below]);
  for (const entry of Object.values(LOGIC_REPORT_COPY)) {
    if (typeof entry === "string") strings.add(entry);
  }
  for (const label of Object.values(easyCognitionLabels)) strings.add(LOGIC_REPORT_COPY.held(8, 5, label)).add(LOGIC_REPORT_COPY.heldAll(8, label));
  strings.add(LOGIC_REPORT_COPY.switched(2)).add(LOGIC_REPORT_COPY.broken(3)).add(LOGIC_REPORT_COPY.hold(100)).add(LOGIC_REPORT_COPY.best(24));
  // Any case of the season can be the one named.
  for (const caseItem of seasonCasesBase) strings.add(LOGIC_REPORT_COPY.lead(`${caseItem.label} 「${caseItem.title}」`));
  assert.ok(strings.size > 70);
  for (const text of strings) {
    assert.deepEqual([...text].filter((character) => !charset.has(character)), [], `"${text}" has characters the font was not cut with`);
    assert.doesNotMatch(text, /압박/);
  }
});
