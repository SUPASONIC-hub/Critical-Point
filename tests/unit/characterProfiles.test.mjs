import assert from "node:assert/strict";
import { test } from "node:test";

import { CASE_SEQUENCE } from "../../src/gameCases.js";
import { nodes } from "../../src/gameData.js";
import { characterProfileCollisions, characterProfiles, getCharacterProfile } from "../../src/gameDialogue.js";
import { createSpeakerProfile } from "../../src/viewModels/sceneViewModels.js";

test("a speaker's role is the one they held in the case being played", () => {
  const roleOf = (name, caseId) => getCharacterProfile(name, caseId).role;
  // 2022-23: the lab does not exist and nobody has been promoted or pushed out.
  assert.match(roleOf("한서윤", "prologue03"), /과장/);
  assert.doesNotMatch(roleOf("한서윤", "prologue03"), /트리거랩/);
  assert.match(roleOf("윤상혁", "prologue02"), /기업금융전략팀장/);
  assert.doesNotMatch(roleOf("윤상혁", "prologue02"), /상무/);
  assert.match(roleOf("임경수", "prologue01"), /심사팀장/);
  assert.doesNotMatch(roleOf("임경수", "prologue01"), /퇴직/);
  assert.match(roleOf("오진우", "prologue01"), /대리/);
  // The season proper keeps the profile's own role.
  assert.equal(roleOf("윤상혁", "case11"), characterProfiles.윤상혁.role);
  assert.equal(roleOf("한서윤", "case24"), characterProfiles.한서윤.role);
  // 트리거랩 closes with 사건 24.
  for (const name of ["한서윤", "도윤하", "오진우", "이민서"]) {
    assert.doesNotMatch(roleOf(name, "case25").split("·")[0], /트리거랩/, `${name} still works at the lab in 사건 25`);
  }
  assert.match(roleOf("윤상혁", "case25"), /KD캐피탈 대표/);
  assert.match(roleOf("윤상혁", "case43"), /KD캐피탈 대표/);
  // The board removes him in 사건 43.
  assert.match(roleOf("윤상혁", "case44"), /해임/);
  assert.match(roleOf("윤상혁", "final"), /해임/);
});

test("only the role moves, and an unknown case or name changes nothing", () => {
  const late = getCharacterProfile("한서윤", "case30");
  assert.notEqual(late.role, characterProfiles.한서윤.role);
  assert.deepEqual({ ...late, role: characterProfiles.한서윤.role }, characterProfiles.한서윤);
  assert.equal(getCharacterProfile("한서윤", "no-such-case").role, characterProfiles.한서윤.role);
  assert.equal(getCharacterProfile("없는 사람", "case01"), null);
  assert.equal(getCharacterProfile(undefined, "case01"), null);
});

test("every speaker of every scene has a profile, and no name is introduced twice", () => {
  assert.deepEqual(characterProfileCollisions, []);
  for (const [nodeId, node] of Object.entries(nodes)) {
    assert.ok(CASE_SEQUENCE.includes(node.caseId), `${nodeId} does not know its case`);
    if (!node.speaker) continue;
    assert.ok(getCharacterProfile(node.speaker, node.caseId), `${nodeId}: ${node.speaker} has no profile`);
    assert.notEqual(createSpeakerProfile({ node }).role, "사건 관계자", `${nodeId}: ${node.speaker} falls back to the stock card`);
  }
});

test("the two people who shared a name are two people", () => {
  assert.equal(nodes.p5_final.speaker, "변유진");
  assert.match(getCharacterProfile("변유진", "prologue05").role, /연구랩/);
  assert.match(getCharacterProfile("여다인", "case42").role, /물결스테이/);
});
