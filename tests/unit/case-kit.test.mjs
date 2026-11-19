import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

/**
 * N29: the side case skeleton (`npm run new:case`) and the warnings of
 * `npm run check:case` (scripts/case-kit.mjs). The skeleton has to pass the
 * checks a real side case passes; the warnings have to find what
 * writing-a-case.md's checklist asks by hand.
 */
const kit = await import("../../scripts/case-kit.mjs");
const { compareWords, sideSource } = await import("../../scripts/locale-words.mjs");
const { checkSidePack } = await import("../../src/state/sidePackCheck.js");

const read = (file) => readFileSync(file, "utf8");
const fromSource = async (source, name) => (await import(`data:text/javascript;base64,${Buffer.from(source).toString("base64")}`))[name];

test("side ids: the number a label says, and the next free one", () => {
  assert.equal(kit.sideNumber("side08"), 8);
  assert.equal(kit.sideNumber("case08"), null);
  assert.equal(kit.sideNumber(undefined), null);
  assert.equal(kit.nextSideId(["side00", "side07", "side03", "case12"]), "side08");
  assert.equal(kit.nextSideId([]), "side01");
});

test("the skeleton is a side case checkSidePack accepts, with TODO in every string", async () => {
  const pack = await fromSource(kit.sidePackSource({ id: "side09", title: "시험" }), "side09");
  assert.deepEqual(checkSidePack(pack), []);
  assert.equal(Object.keys(pack.nodes).length, kit.SKELETON_SCENES.length);
  assert.equal(pack.label, "번외 9");
  const strings = kit.allStrings({ nodes: pack.nodes, outcomes: pack.outcomes });
  const words = strings.filter(([path]) => /\.(title|text|question|lead|label|memo\[0\])$/.test(path));
  assert.ok(words.length > 30);
  assert.deepEqual(words.filter(([, text]) => !text.includes("TODO")), []);
  assert.deepEqual(kit.speakersOf(pack.nodes), ["반재욱"]);
  assert.throws(() => kit.sidePackSource({ id: "case50", title: "x" }), /not a side case id/);
});

test("the en/ja stubs answer every Korean path and nothing else, and are all TODO", async () => {
  const pack = await fromSource(kit.sidePackSource({ id: "side09", title: "시험" }), "side09");
  const words = sideSource(pack);
  for (const lang of ["en", "ja"]) {
    const stub = await fromSource(kit.localeStubSource({ id: "side09", lang, words }), "default");
    const compared = compareWords(words, stub, lang);
    assert.deepEqual([compared.missing, compared.stale, compared.numbers], [[], [], []]);
    const strings = kit.allStrings(stub);
    assert.equal(kit.findTodo(strings).length, strings.length);
  }
});

test("the side list gets its line before the fixture, once", () => {
  const source = read("src/nodes/sidePacks.js");
  const next = kit.addSideListing(source, { id: "side99", title: "끝" });
  const line = next.split("\n").findIndex((entry) => entry.includes('id: "side99"'));
  const fixture = next.split("\n").findIndex((entry) => entry.includes("...(sideFixtureListed"));
  assert.ok(line > 0 && line === fixture - 1);
  assert.match(next, /label: "번외 99", title: "끝", load: \(\) => import\("\.\/side99\.js"\)\.then\(\(\{ side99 \}\) => localizeSidePack\(side99\)\)/);
  assert.throws(() => kit.addSideListing(next, { id: "side99", title: "끝" }), /already/);
  assert.throws(() => kit.addSideListing("export const SIDE_CASES = [];", { id: "side99", title: "끝" }), /fixture line/);
});

test("both dictionaries get the label and title as the last entry of SIDE_CASES", () => {
  for (const lang of ["en", "ja"]) {
    const source = read(`src/locales/${lang}/index.js`);
    const next = kit.addLocaleSideTitle(source, { id: "side99", label: "L", title: 'T "q" {x}' });
    assert.equal(next.split('"side99"').length, 2);
    const block = next.slice(next.indexOf('"SIDE_CASES"'));
    const close = kit.matchingBrace(block, block.indexOf("{"));
    assert.match(block.slice(0, close + 1), /"side99": \{\n {8}"label": "L",\n {8}"title": "T \\"q\\" \{x\}"\n {6}\}\n {4}\}$/);
    // Everything outside the new entry is as it was.
    assert.equal(next.replace(/,?\n {6}"side99": \{[^]*?\n {6}\}/, ""), source.replace(/\s+(\n {4}\})(?=\n {2}\}\n\};\s*$)/, "$1"));
    assert.throws(() => kit.addLocaleSideTitle(next, { id: "side99", label: "L", title: "T" }), /already/);
  }
  const empty = kit.addLocaleSideTitle('x = { "sidePacks": { "SIDE_CASES": {} } };', { id: "side01", label: "L", title: "T" });
  assert.match(empty, /"SIDE_CASES": \{\n {6}"side01": \{/);
  assert.throws(() => kit.addLocaleSideTitle("x = {};", { id: "side01", label: "L", title: "T" }), /no "sidePacks"/);
});

test("matchingBrace skips braces in strings and comments", () => {
  const source = '{ a: "}", b: `}`, c: \'}\', // }\n /* } */ d: { e: 1 } } tail';
  assert.equal(source.slice(kit.matchingBrace(source, 0) + 1), " tail");
  assert.equal(kit.matchingBrace("{ open", 0), -1);
});

test("the canon section and the credits row land where a reader looks for them", () => {
  const canon = kit.addCanonSection(read("docs/canon.md"), { id: "side99", title: "끝" });
  assert.ok(canon.indexOf("### 번외 99, 끝 (side99)") < canon.indexOf("## Known and left alone"));
  assert.ok(canon.indexOf("### 번외 99, 끝 (side99)") > canon.indexOf("## The side cases"));
  assert.throws(() => kit.addCanonSection(canon, { id: "side99", title: "끝" }), /already/);
  assert.throws(() => kit.addCanonSection("# x", { id: "side99", title: "끝" }), /Known and left alone/);

  const credits = kit.addPortraitCreditRow(read("docs/portrait-credits.md"), { id: "side99" });
  const lines = credits.split("\n");
  const row = lines.findIndex((line) => line.startsWith("| TODO 번외 99 화자 |"));
  assert.ok(row > 0 && lines[row - 1].startsWith("| ") && !lines[row + 1].startsWith("|"));
  assert.ok(row < lines.findIndex((line) => line.startsWith("## 실존하지 않는")));
  assert.throws(() => kit.addPortraitCreditRow("# none", { id: "side99" }), /section/);
  assert.throws(() => kit.addPortraitCreditRow("x\n## 사진에서 만든 장\n\n글뿐\n## 다음", { id: "side99" }), /table/);
});

test("coverage floors: scenes and words are data, a logic module is not", () => {
  assert.equal(kit.needsCoverageFloor("src/nodes/side09.js"), false);
  assert.equal(kit.needsCoverageFloor("src/locales/en/nodes/side09.js"), false);
  assert.equal(kit.needsCoverageFloor("docs/canon.md"), false);
  assert.equal(kit.needsCoverageFloor("src/sideRunHelper.js"), true);
});

test("check:case finds $, TODO, long text, silhouettes and unnamed speakers", () => {
  const strings = [
    ["nodes.a.text", "300억 원"],
    ["nodes.b.text", "$12,345"],
    ["nodes.c.memo[0]", "TODO 메모"],
    ["nodes.d.text", "TODOS are fine"],
  ];
  assert.deepEqual(kit.findDollar(strings), ["nodes.b.text"]);
  assert.deepEqual(kit.findTodo(strings), ["nodes.c.memo[0]"]);
  assert.deepEqual(kit.findLongText({ a: { text: "가".repeat(421) }, b: { text: "가".repeat(420) }, c: {} }), ["a.text 421자"]);
  const nodes = { a: { speaker: "반재욱" }, b: { speaker: "새 사람" }, c: { speaker: "파일 없음" }, d: {} };
  assert.deepEqual(kit.speakersOf(nodes), ["반재욱", "새 사람", "파일 없음"]);
  const portraitOf = (name) => ({ 반재욱: "/a.webp", "파일 없음": "/gone.webp" })[name] ?? null;
  assert.deepEqual(kit.portraitProblems(kit.speakersOf(nodes), { portraitOf, fileExists: (src) => src === "/a.webp" }), [
    "새 사람: SPEAKER_PORTRAITS에 없음(실루엣)",
    "파일 없음: /gone.webp 파일 없음(실루엣)",
  ]);
  assert.deepEqual(kit.unnamedSpeakers(["반재욱", "새 사람"], { 반재욱: "Ban Jaewook" }), ["새 사람"]);
  assert.deepEqual(kit.unnamedSpeakers(["반재욱"], undefined), ["반재욱"]);
});

test("every season speaker the side cases use has a portrait (the check reads the real table)", async () => {
  const { getSpeakerPortrait } = await import("../../src/speakerPortraits.js");
  const { side07 } = await import("../../src/nodes/side07.js");
  assert.deepEqual(kit.portraitProblems(kit.speakersOf(side07.nodes), { portraitOf: getSpeakerPortrait, fileExists: () => true }), []);
  assert.deepEqual(kit.portraitProblems(["아무도 아닌 사람"], { portraitOf: getSpeakerPortrait, fileExists: () => true }).length, 1);
});

test("a block pasted twice is one finding, not one per line, and a heading inside it is not another", () => {
  const section = Array.from({ length: 12 }, (_, index) => `줄 ${index} 내용 ${index * 7}`);
  const text = ["# 문서", "## 하나", ...section, "", "## 둘", "다른 글", "## 하나", ...section, "끝"].join("\n");
  const found = kit.findDuplicateBlocks(text);
  assert.equal(found.length, 1);
  assert.deepEqual(found[0], { from: 18, to: 30, firstAt: 2, lines: 13 });
  assert.deepEqual(kit.duplicateHeadings(text), [{ heading: "## 하나", at: [2, 18] }]);
  // Table rules and fences alone repeat everywhere and are not a block.
  assert.deepEqual(kit.findDuplicateBlocks(Array.from({ length: 30 }, () => "|---|---|").join("\n")), []);
  assert.deepEqual(kit.findDuplicateBlocks("하나\n둘\n셋"), []);
});

test("the shipped side cases match their canon sections, and a mismatch is said", async () => {
  const canon = read("docs/canon.md");
  const { SIDE_CASES } = await import("../../src/nodes/sidePacks.js");
  for (const { id } of SIDE_CASES) {
    const pack = (await import(`../../src/nodes/${id}.js`))[id];
    assert.deepEqual(kit.canonProblems({ id, pack, canon }), [], id);
  }
  const { side07 } = await import("../../src/nodes/side07.js");
  assert.deepEqual(kit.canonProblems({ id: "side07", pack: { ...side07, title: "다른 제목" }, canon }), ["canon 제목 「### 번외 7, 금요일 17시 58분 (side07)」 ≠ 팩 「### 번외 7, 다른 제목 (side07)」"]);
  assert.deepEqual(kit.canonProblems({ id: "side07", pack: { ...side07, label: "번외 70" }, canon }), ["팩 label 「번외 70」 ≠ 「번외 7」"]);
  assert.deepEqual(kit.canonProblems({ id: "side98", pack: side07, canon }), ["docs/canon.md에 「### 번외 98, … (side98)」 절 없음"]);
  assert.deepEqual(kit.canonProblems({ id: "case07", pack: side07, canon }), []);
  const skeleton = kit.addCanonSection(canon, { id: "side99", title: "끝" });
  assert.deepEqual(kit.canonProblems({ id: "side99", pack: { label: "번외 99", title: "끝", nodes: {} }, canon: skeleton }), ["canon 절에 TODO 남음", "canon When 줄에 YYYY-MM-DD 날짜 없음"]);
  const dated = skeleton.replace("| When | TODO YYYY-MM-DD (요), between which two of the season's days |", "| When | 2026-07-10 (금) |").replace(/\| (Where|TODO person \(age\)|The endings) \|.*\n/g, "");
  assert.deepEqual(kit.canonProblems({ id: "side99", pack: { label: "번외 99", title: "끝", nodes: { a: { text: "7월 9일" } } }, canon: dated }), ["canon When 2026-07-10 → 팩 본문에 「7월 10일」 없음"]);
  assert.deepEqual(kit.canonProblems({ id: "side99", pack: { label: "번외 99", title: "끝", nodes: { a: { text: "7월 10일 (금)" } } }, canon: dated }), []);
});

test("check:changed hands check:case the case files a branch touched", () => {
  assert.deepEqual(
    kit.caseIdsOf([
      "src/nodes/side08.js",
      "src/locales/en/nodes/side08.js",
      "src/locales/ja/nodes/case12.js",
      "src/nodes/prologue01.js",
      "src/nodes/finalCase.js",
      "src/nodes/side00.js",
      "src/nodes/sidePacks.js",
      "src/locales/en/nodes/final.js",
      "docs/canon.md",
    ]),
    ["case12", "final", "prologue01", "side08"],
  );
  assert.ok(kit.CASE_DOCS.includes("docs/writing-a-case.md"));
});
