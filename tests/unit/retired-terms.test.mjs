import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

// Each game term has one name (one-name-per-term, 2026-10-14). The words it
// retired are listed here with the name that replaced them, so a new line that
// brings one back fails here instead of in a playtest. The story (`src/nodes/`)
// is not scanned: there 차지하다, 연락 and 터지다 are everyday Korean.
// 압박 is retired only as a name for the table's gauge (압박계, now 열기): the
// report's risk measures (압박 대응, 압박 누적/회수) and the everyday sense
// (시간 압박) keep the word.
const RETIRED = [
  { word: /푸시/, instead: "밀기" },
  { word: /(?<![가-힣])락(?!픽)/, instead: "LOCK" },
  { word: /(?<![가-힣])차지(?!원)/, instead: "충전" },
  { word: /케이스(?!데스크)/, instead: "사건" },
  { word: /체인/, instead: "연속" },
  { word: /연승/, instead: "연속" },
  { word: /게이지가|게이지 \d/, instead: "열기" },
  { word: /압박계/, instead: "열기" },
];

const ROOT = fileURLToPath(new URL("../../src/", import.meta.url));
const isComment = (line) => /^\s*(\/\/|\*|\/\*)/.test(line);

function* sourceFiles(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== "nodes") yield* sourceFiles(path);
    } else if (/\.(js|jsx)$/.test(entry.name) && !/\.test\./.test(entry.name)) {
      yield path;
    }
  }
}

test("no player line outside the story uses a retired term", () => {
  const found = [];
  for (const file of sourceFiles(ROOT)) {
    readFileSync(file, "utf8").split("\n").forEach((line, index) => {
      if (isComment(line)) return;
      for (const { word, instead } of RETIRED) {
        if (word.test(line)) found.push(`${relative(ROOT, file)}:${index + 1} ${word} -> ${instead}: ${line.trim().slice(0, 80)}`);
      }
    });
  }
  assert.deepEqual(found, []);
});

test("the names the retired words leave alone are not refused", () => {
  for (const line of ["락픽: 열기 30에서 열림", "차지원은 대답 대신", "케이스데스크", "연락이 왔다", "허락을 받았다", "압박 대응", "시간 압박"]) {
    assert.deepEqual(RETIRED.filter(({ word }) => word.test(line)), [], line);
  }
  for (const line of ["E 락 · 확정", "차지가 빠르다", "이전 케이스", "오버클럭 체인", "연승 2", "다음 푸시", "압박계는 낮지만"]) {
    assert.ok(RETIRED.some(({ word }) => word.test(line)), line);
  }
});
