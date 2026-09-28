import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

import { boardTextHasContact, boardTextHasLink, getBoardPostRefusal } from "../../src/state/useBoard.js";

/**
 * The browser's copy of the board's rules against the list the server's copy is
 * held to (`scripts/check-grants.mjs` posts the same cases to the trigger). The
 * two used to keep a list each, and agreed only on the cases someone had
 * thought to write down twice.
 */
const cases = JSON.parse(readFileSync(new URL("../fixtures/board-filter-cases.json", import.meta.url), "utf8"));

const REASON_OF = {
  "nickname-characters": "characters",
  "body-characters": "characters",
  "nickname-link": "link",
  "body-link": "link",
  contact: "contact",
};

test("the fixture holds enough cases to mean something", () => {
  assert.ok(cases.refused.length >= 10, "refused cases");
  assert.ok(cases.accepted.length >= 3, "accepted cases");
  assert.ok(cases.refused.some((entry) => /[가-힣]/.test(entry.body.split(".").at(-1)?.slice(0, 4) ?? "")), "an attached particle");
});

for (const { label, nickname, body, reason } of cases.refused) {
  test(`the browser refuses ${label}, for the reason the server gives`, () => {
    assert.equal(REASON_OF[getBoardPostRefusal(nickname, body)], reason, `${JSON.stringify(nickname)} / ${JSON.stringify(body)}`);
  });
}

for (const { label, nickname, body } of cases.accepted) {
  test(`the browser accepts ${label}`, () => {
    assert.equal(getBoardPostRefusal(nickname, body), null, body);
  });
}

test("a domain is a link whatever is written straight after it", () => {
  for (const tail of ["으로", "에서", "입니다", "!", ")", "", " 로"]) {
    assert.equal(boardTextHasLink(`spam.com${tail}`), true, `spam.com${tail}`);
  }
  // More of the name is not the end of the name.
  assert.equal(boardTextHasLink("3.communication"), false);
  assert.equal(boardTextHasLink("v1.internal-note"), false);
});

test("a phone number is contact details whatever is written straight after it", () => {
  assert.equal(boardTextHasContact("010-1234-5678로 주세요"), true);
  assert.equal(boardTextHasContact("2023-0412 대출"), false);
});
