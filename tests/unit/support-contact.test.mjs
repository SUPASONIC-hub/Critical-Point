import assert from "node:assert/strict";
import { test } from "node:test";

import { getDeletionRequestText, SUPPORT_CONTACT } from "../../src/appConfig.js";

/**
 * The deletion-request contact (SUPPORT_CONTACT in appConfig.js): the support
 * mailbox the user chose on 2026-10-25. Changing it is a decision, so this
 * test names it and fails on any other value.
 */
test("the contact is the support mailbox decided on 2026-10-25", () => {
  assert.equal(SUPPORT_CONTACT, "from.logic.to.magic@gmail.com");
  assert.match(SUPPORT_CONTACT, /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i, "an e-mail address");
});

test("unset, the notice says the address is still to come and gives the session-code path", () => {
  const text = getDeletionRequestText(null);
  assert.equal(text.address, null);
  assert.match(text.before, /아직 정하지 않았습니다/);
  assert.match(text.after, /8자리 세션 코드/);
  assert.match(text.after, /코드 복사/);
  assert.equal(getDeletionRequestText("   ").address, null, "a blank address is no address");
});

test("set, the notice names the address and asks for the session code with it", () => {
  const text = getDeletionRequestText();
  assert.equal(text.address, SUPPORT_CONTACT);
  assert.equal(`${text.before}${text.address}${text.after}`.startsWith(`기록 삭제는 ${SUPPORT_CONTACT}로 요청해 주세요.`), true);
  assert.match(text.after, /8자리 세션 코드를 함께/);
  assert.doesNotMatch(`${text.before}${text.after}`, /아직 정하지 않았습니다/);
});
