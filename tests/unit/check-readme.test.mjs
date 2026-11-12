import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { LIMITS, readmeProblems, tableCells } from "../../scripts/check-readme.mjs";

const TOP = `# 임계점

## 어떤 게임인가

- 짧게.

## 우리가 만든 방식

## 바로 해 보기

## 만든 이

## 자세히 보기

펼쳐 보세요.
`;

const block = (body, summary = "<b>검증</b> — 무엇을 지키나") => `\n<details>\n<summary>${summary}</summary>\n\n${body}\n\n</details>\n`;
const rules = (text, options) => readmeProblems(text, options).problems.map((problem) => problem.rule);

test("a page in the order, with its detail folded, passes", () => {
  assert.deepEqual(readmeProblems(TOP + block("| 검사 | 하는 일 |\n|---|---|\n| a | b |")).problems, []);
});

test("the README in the tree keeps its own rules", () => {
  const text = readFileSync("README.md", "utf8");
  const { problems } = readmeProblems(text, { imageBytes: () => 1 });
  assert.deepEqual(problems, []);
});

test("the expanded part has a length cap; text folded away does not count", () => {
  const long = `${"가".repeat(Math.ceil(LIMITS.expandedBytes / 3))}\n`;
  assert.ok(rules(TOP.replace("- 짧게.", long)).includes("length"));
  assert.ok(!rules(TOP + block(long)).includes("length"));
});

test("the sections come in order and 자세히 보기 is the last one", () => {
  const swapped = TOP.replace("## 우리가 만든 방식", "## 임시").replace("## 바로 해 보기", "## 우리가 만든 방식\n\n## 바로 해 보기");
  assert.ok(!rules(swapped).includes("order"), "another section may sit between");
  const missing = TOP.replace("## 만든 이\n", "");
  assert.ok(rules(missing).includes("order"));
  assert.ok(rules(`${TOP}\n## 덧붙임\n`).includes("order"));
  assert.ok(rules(`${TOP + block("x")}\n떠도는 글\n`).includes("order"), "nothing loose after the first <details>");
});

test("tables: at most three columns anywhere; short cells above the fold", () => {
  assert.ok(rules(`${TOP}\n| a | b | c | d |\n|---|---|---|---|\n| 1 | 2 | 3 | 4 |\n`).includes("table"));
  assert.ok(rules(TOP + block("| a | b | c | d |\n|---|---|---|---|\n| 1 | 2 | 3 | 4 |")).includes("table"));
  const cell = "가".repeat(LIMITS.expandedCellChars + 1);
  assert.ok(rules(`${TOP}\n| a | b |\n|---|---|\n| ${cell} | x |\n`).includes("table"));
  assert.ok(!rules(TOP + block(`| a | b |\n|---|---|\n| ${cell} | x |`)).includes("table"));
  assert.ok(rules(TOP + block(`| a | b |\n|---|---|\n| ${"가".repeat(LIMITS.detailCellChars + 1)} | x |`)).includes("table"));
  // A link's target and an escaped pipe do not make a cell longer or wider.
  assert.ok(!rules(`${TOP}\n| a | b |\n|---|---|\n| [짧은 글](https://example.com/${"x".repeat(60)}) | \`a \\| b\` |\n`).includes("table"));
});

test("table cells split on bare pipes only", () => {
  assert.deepEqual(tableCells("| `a \\| b` | c |"), ["`a | b`", "c"]);
});

test("a summary is one short line followed by a blank line", () => {
  assert.ok(rules(`${TOP}\n<details>\n<summary>\n검증</summary>\n\nx\n\n</details>\n`).includes("summary"));
  assert.ok(rules(TOP + block("x", "가".repeat(LIMITS.summaryChars + 1))).includes("summary"));
  assert.ok(rules(`${TOP}\n<details>\n<summary>검증</summary>\nx\n\n</details>\n`).includes("summary"));
  assert.ok(rules(`${TOP}\n<details>\n<summary>검증</summary>\n\nx\n</details>\n`).includes("details"));
  assert.ok(rules(`${TOP}\n<details>\n<summary>검증</summary>\n\nx\n`).includes("details"));
  assert.ok(rules(TOP + block("<details>\n<summary>안</summary>\n\ny\n\n</details>")).includes("details"));
});

test("images: <img> with alt and width, under docs/images/, at most 400 KB", () => {
  const page = (img) => TOP.replace("- 짧게.", img);
  const sizes = { "docs/images/ok.webp": 1000, "docs/images/big.png": LIMITS.imageBytes + 1 };
  const imageBytes = (src) => sizes[src] ?? null;
  assert.deepEqual(rules(page('<img src="docs/images/ok.webp" alt="첫 화면" width="320">'), { imageBytes }), []);
  assert.ok(rules(page("![첫 화면](docs/images/ok.webp)"), { imageBytes }).includes("image"));
  assert.ok(rules(page('<img src="docs/images/ok.webp" alt="" width="320">'), { imageBytes }).includes("image"));
  assert.ok(rules(page('<img src="docs/images/ok.webp" alt="a">'), { imageBytes }).includes("image"));
  assert.ok(rules(page('<img src="public/ok.webp" alt="a" width="1">'), { imageBytes }).includes("image"));
  assert.ok(rules(page('<img src="docs/images/none.webp" alt="a" width="1">'), { imageBytes }).includes("image"));
  assert.ok(rules(page('<img src="docs/images/big.png" alt="a" width="1">'), { imageBytes }).includes("image"));
});

test("a date above the fold reads as a work log; inside <details> it is fine", () => {
  assert.ok(rules(TOP.replace("- 짧게.", "- 2026-11-12에 고침.")).includes("log"));
  assert.ok(!rules(TOP + block("2026-11-12에 고침.")).includes("log"));
});

test("code fences are not read as tables or blocks", () => {
  assert.deepEqual(rules(TOP.replace("- 짧게.", "```\n| a | b | c | d |\n<details>\n```")), []);
});
