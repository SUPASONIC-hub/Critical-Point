import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { test } from "node:test";

import { captionGroups, markLines, markProse } from "../../src/components/proseMarks.js";

const show = (segments) => segments.map((s) => (s.marks.length ? `[${s.marks.join("+")}:${s.text}]` : s.text)).join("");

test("speech, figures and glosses are marked, and nothing else", () => {
  assert.equal(
    show(markProse("한서윤이 말합니다. '훈련용 사례예요. 제한 시간은 72시간이고요.' 직원이 1,140명입니다.")),
    "한서윤이 말합니다. [say:'훈련용 사례예요. 제한 시간은 ][say+num:72시간][say:이고요.'] 직원이 [num:1,140명]입니다.",
  );
  assert.equal(
    show(markProse("부채비율(회사 빚이 자기 돈의 몇 배인지 보는 숫자)이 184.7%로 올랐습니다.")),
    "[term:부채비율][note:(회사 빚이 자기 돈의 몇 배인지 보는 숫자)]이 [num:184.7%]로 올랐습니다.",
  );
  assert.equal(show(markProse("평범한 문장입니다.")), "평범한 문장입니다.");
  assert.deepEqual(markProse(""), []);
  assert.deepEqual(markProse(undefined), []);
});

test("a date, a time and money in two words read as one figure", () => {
  assert.equal(show(markProse("11월 1일 7시 40분까지 3억 원")), "[num:11월 1일 7시 40분]까지 [num:3억 원]");
  assert.equal(show(markProse("18영업일 2009년, 대출번호 2023-0412.")), "[num:18영업일] [num:2009년], 대출번호 [num:2023-0412].");
});

test("lines, pages and letters carry their unit: 1,740줄, 3페이지, 23통", () => {
  assert.equal(
    show(markProse("1,740줄 중 200줄 남짓, 서명란이 빈 3페이지를 펼치고 편지 23통에 답합니다.")),
    "[num:1,740줄] 중 [num:200줄] 남짓, 서명란이 빈 [num:3페이지]를 펼치고 편지 [num:23통]에 답합니다.",
  );
});

test("an aside after a space, an apostrophe and a number inside a word stay plain", () => {
  assert.equal(show(markProse("KD은행 (대출 잔액 310억)")), "KD은행 (대출 잔액 [num:310억])");
  assert.equal(show(markProse("the analyst's file, x1.00, KD2")), "the analyst's file, x1.00, KD2");
  // An unmatched quote marks nothing rather than the rest of the paragraph.
  assert.equal(show(markProse("그는 '그러니까 말했다.")), "그는 '그러니까 말했다.");
});

test("speech cut across lines is speech in each line", () => {
  const lines = ["그가 말합니다. '처음입니다.", "두 번째입니다.'", "끝."];
  assert.deepEqual(markLines(lines).map(show), ["그가 말합니다. [say:'처음입니다.]", "[say:두 번째입니다.']", "끝."]);
});

test("every scene's prose survives marking character for character", async () => {
  for (const file of readdirSync("src/nodes").filter((name) => /^(case\d+|prologue\d+|finalCase)\.js$/.test(name))) {
    const module = await import(`../../src/nodes/${file}`);
    const walk = (value) => {
      if (typeof value === "string") {
        assert.equal(markProse(value).map((segment) => segment.text).join(""), value, `${file}: ${value.slice(0, 40)}`);
      } else if (value && typeof value === "object") {
        Object.values(value).forEach(walk);
      }
    };
    walk(module);
  }
});

test("the briefing's caption boxes hold two or three sentences and break before speech (D-3)", () => {
  assert.deepEqual(captionGroups("하나. 둘. 셋. 넷."), ["하나. 둘. 셋.", "넷."]);
  assert.deepEqual(captionGroups("한서윤이 말합니다. '훈련용 사례예요. 72시간이고요.' 직원이 답합니다."), [
    "한서윤이 말합니다.",
    "'훈련용 사례예요. 72시간이고요.' 직원이 답합니다.",
  ]);
  // A sentence inside speech that runs on is not a new line of speech.
  assert.deepEqual(captionGroups("'첫 말. 둘째 말.' 끝."), ["'첫 말. 둘째 말.' 끝."]);
  // Two long sentences are a box each once they pass 120 characters together.
  const long = `${"가".repeat(70)}.`;
  assert.deepEqual(captionGroups(`${long} ${long}`), [long, long]);
  assert.deepEqual(captionGroups(""), []);
  // Every word, in order: the boxes joined are the paragraph.
  const text = "부채비율(회사 빚이 자기 돈의 몇 배인지 보는 숫자)이 올랐습니다. 그는 묻습니다. '왜요?' 아무도 답하지 않습니다. 시계가 갑니다.";
  assert.equal(captionGroups(text).join(" "), text);
});
