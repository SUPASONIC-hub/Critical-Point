/**
 * Its own module, with no imports, so the play view (viewModels/playViewModel.js)
 * reads it without taking caseCopy.js's whole copy table along.
 */

/**
 * Far callbacks: a scene late in the season that says one line about a choice
 * made dozens of cases earlier. Every other carry-over in the season reaches
 * one case ahead (the opening routes, the outcome tables); these reach across.
 *
 * Each reads a card of an earlier case off the save's `caseResults`, the one
 * record of a case that outlives it -- the run's log is cleared when the next
 * case opens. By default the outcome card (`outcomeChoiceId`); with `field:
 * "finalChoiceId"` the card of the case's last scene before its outcome
 * (`fromScene`), which the summary keeps for that (seasonRules
 * getFinalSceneChoiceId). The line goes into the scene's text right after
 * `after`, so the reading clock counts it like the rest of the scene. A save
 * with no result for that case (one from before the case was played, another
 * device, a replayed graph), one from before `finalChoiceId` was kept, or a
 * card the table does not name gets `fallback`, a sentence that holds on every
 * route.
 */
export const farCallbacks = {
  // 프롤로그 01: whose name the 40 million went on, the morning probation ended.
  // 사건 48: the first committee where every member signs by name.
  c48_final: {
    fromCase: "prologue01",
    after: "오늘은 당신 다음에 쓰겠습니다.'",
    lines: {
      p1_after_record: "수습 마지막 날 아침에도 당신은 의견란의 4,000만 원 밑에 당신 이름을 적었습니다. 그때는 반대를 적을 칸이 따로 없었습니다.",
      p1_after_credit: "수습 마지막 날 아침, 당신이 찾은 4,000만 원은 오진우 대리의 이름으로 올라갔습니다. 오늘 이 칸에는 빌려 쓸 이름이 없습니다.",
      p1_after_speed: "수습 마지막 날 아침, 당신은 4,000만 원을 말로만 알리고 서류를 그대로 내려보냈습니다. 오늘은 말로 넘길 수 있는 칸이 없습니다.",
    },
    fallback: "수습 마지막 날 아침의 의견란이 잠깐 떠오릅니다. 4,000만 원을 누구 이름으로 남길지 고르던 아침입니다.",
  },
  // 프롤로그 05: what the analyst kept of what they brought, the first night
  // at the lab. 사건 49: the night before going up to the 33rd floor.
  c49_aftershock: {
    fromCase: "prologue05",
    after: "마커 뚜껑을 닫습니다.",
    lines: {
      p5_after_hold: "당신 지갑 안쪽에는 트리거랩 첫날 밤 4층 벽에 붙였던 이름 목록이 접혀 있습니다. 네 귀퉁이에 테이프 자국이 남아 있습니다.",
      p5_after_record: "트리거랩 첫날 밤 B2의 그 상자 옆에 세워 둔 사본 묶음이 떠오릅니다. 그날 적은 날짜 넷은 이제 보지 않고도 읽습니다.",
      p5_after_alone: "트리거랩 첫날 밤 비우고 시작한 가방이 오늘은 발치에서 묵직합니다.",
    },
    fallback: "당신은 발치의 가방을 한 번 끌어당깁니다. 트리거랩 첫날 4층에 들고 들어갔던 그 가방입니다.",
  },
  // 사건 15: whether 이민서 signed the confirmation in the interview room, the
  // morning of the 수능. 사건 37: the group's offer to erase the records for a
  // signature saying they are distorted. Only `c15_final` decides the
  // signature; the system route, the evidence turn and a reframe close the
  // case without it, and read the fallback.
  c37_final: {
    fromCase: "case15",
    field: "finalChoiceId",
    fromScene: "c15_final",
    after: "다들 그걸 원하시잖아요.'",
    lines: {
      c15_final_fight: "수능 날 아침 면접실에서 당신은 이민서에게 서명하지 말자고 했고, 그는 만년필 뚜껑을 닫았습니다. 오늘 둘째 장에도 서명 한 줄을 받는 칸이 있습니다.",
      c15_final_respect: "수능 날 아침 면접실에서 이민서는 확인서에 서명하고 날짜 옆에 작은 점을 하나 찍었습니다. 당신은 그 선택을 존중했고, 오늘 이 서명란 앞에서 그 점이 먼저 떠오릅니다.",
      c15_final_publish: "수능 날 아침, 당신은 이민서의 확인서를 면접실 밖에 공개했고 원하지 않은 몇 사람의 이름도 함께 나갔습니다. 오늘 둘째 장에는 63명의 이름이 걸려 있습니다.",
    },
    fallback: "수능 날 아침 면접실 탁자에 놓였던 확인서와 만년필 한 자루가 잠깐 떠오릅니다. 그날도 서명 한 줄이 기록을 닫는 값이었습니다.",
  },
  // 사건 49: how the night before the 33rd floor was spent, and what came
  // along in the bag. 최종 사건: the 33rd floor itself. Each line names a thing
  // that route's opening already holds (f_start_owner/_system/_name).
  f_confront: {
    fromCase: "case49",
    after: "'나도 이걸 받은 사람일세.'",
    lines: {
      c49_after_warm: "당신은 가방에서 남은 컵라면 하나를 꺼내 책상에 올립니다. 강태민이 '그 사람 몫'이라던 것입니다. 윤상혁이 한참 보다가 묻습니다. '물은 어디서 붓나.'",
      c49_after_record: "가방 속 폴더의 목차 맨 끝 칸은 아직 비어 있습니다. 이 방에서 들은 답을 적을 칸입니다.",
      c49_after_rush: "주머니에는 복도 문에서 뗀 쪽지가 아직 있습니다. '한 시간이면 되지.' 그 한 시간은 오래전에 지났습니다.",
    },
    fallback: "당신은 발치의 가방을 한 번 끌어당깁니다. 무엇을 들고 왔든, 이 방에서는 아무도 그걸 묻지 않습니다.",
  },
};

/** The line a far callback prints for this run: the card's, or the fallback. */
export function resolveFarCallbackLine(callback, caseResults = {}) {
  if (!callback) return "";
  const choiceId = caseResults?.[callback.fromCase]?.[callback.field ?? "outcomeChoiceId"];
  return (typeof choiceId === "string" && callback.lines[choiceId]) || callback.fallback;
}

const calledBackScenes = new Map();

/**
 * The scene as this run reads it: the graph's own object for a scene with no
 * far callback, and for one with a callback a copy whose text carries the
 * line. Kept per text, so the runtime's memos see one object per render.
 */
export function withFarCallback(nodeId, node, caseResults) {
  const callback = farCallbacks[nodeId];
  if (!callback || typeof node?.text !== "string" || !node.text.includes(callback.after)) return node;
  const line = resolveFarCallbackLine(callback, caseResults);
  const key = `${nodeId}\n${line}`;
  if (!calledBackScenes.has(key)) {
    const text = node.text.replace(callback.after, `${callback.after} ${line}`);
    calledBackScenes.set(key, { ...node, text });
  }
  return calledBackScenes.get(key);
}
