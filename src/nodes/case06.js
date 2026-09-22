/**
 * CASE 06 -- the authored scenes of the colleague case.
 *
 * The season's five other cases judge someone else's organisation. The finale
 * tells the analyst they were the subject all along. This is the rung between:
 * the first case where the desk under investigation is in the same room as
 * yours. It also pays off two threads the graph had left hanging -- 사건 03 and
 * 사건 05 both say 오진우 was given his own pressure condition, and nothing ever
 * answered them.
 */
export const case06Nodes = {
  c6_start: {
    phase: "CASE 06 BRIEFING",
    title: "THE ROOM NEXT DOOR",
    speaker: "한서윤",
    text:
      "경쟁 분석관 오진우가 사흘째 출근하지 않았습니다. 그의 자리에는 제출되지 않은 사건 05 검토 보고서가 열린 채 남아 있습니다. 그룹은 배차(돌봄 인력을 보낼 곳을 정하는 일) 실패의 공식 책임자로 그를 세우려 하고, 인사위원회(직원의 징계나 자리 이동을 정하는 회의)는 이틀 뒤입니다. 한서윤이 덧붙입니다. '그룹전략실에서 내려온 안입니다. 파견 직원(다른 회사 소속으로 와서 일하는 직원)은 그룹 인사 기록에 남지 않습니다. 정리하기 제일 쉬운 사람이라는 뜻입니다.'",
    memo: [
      "오진우는 배차 가중치표의 최종 검토자였음",
      "사흘간 연락 두절, 사직서는 제출되지 않음",
      "인사위원회까지 48시간",
      "이번 조사 대상은 외부 기관이 아니라 옆자리 동료",
    ],
    triggers: ["competition", "responsibility", "affection"],
    choices: [
      {
        id: "c6_start_defend",
        label: "오진우를 먼저 찾아 상태를 확인한다",
        effect: { time: -10, trust: 11, legitimacy: -3, fatigue: 3 },
        next: "c6_desk",
        cognition: { persistence: 2 },
      },
      {
        id: "c6_start_record",
        label: "그의 검토 기록부터 열어 사실관계를 정리한다",
        effect: { time: -8, legitimacy: 9, trust: -4, fatigue: 2 },
        next: "c6_desk",
        cognition: { inference: 2 },
      },
      {
        id: "c6_start_panel",
        label: "인사위원회에 조사 기간 연장을 요청한다",
        effect: { time: 8, capital: -9, legitimacy: 5, fatigue: 2 },
        next: "c6_desk",
        cognition: { risk: 1, persistence: 1 },
      },
      {
        id: "free",
        label: "다른 방법을 제안한다",
        type: "free",
        next: "c6_desk",
      },
    ],
  },
  c6_desk: {
    phase: "EMPTY DESK",
    title: "각도가 맞춰진 펜",
    speaker: "도윤하",
    text:
      "오진우의 책상은 그대로입니다. 펜은 모니터와 나란히 각도가 맞춰져 있고, 메모지는 색깔별로 줄을 섰습니다. 도윤하가 말합니다. '저 사람 화분, 제가 두 달째 물 주고 있었어요. 본인은 모릅니다.' 서랍 안쪽에는 뜯지 않은 수면제 상자와, 아버지 이름으로 된 오래된 지점 표창장 사본이 함께 들어 있습니다.",
    memo: [
      "최근 3주간 퇴근 기록이 모두 자정 이후",
      "제출 직전에 지운 보고서 초안이 11개",
      "책상 달력의 마지막 표시는 사건 05 발표일",
      "서랍 안에 아버지의 지점 표창장 사본",
    ],
    triggers: ["affection", "protection", "curiosity"],
    choices: [
      {
        id: "c6_desk_person",
        label: "그를 아는 사람들에게 먼저 묻는다",
        effect: { time: -9, trust: 12, humanCost: -5, fatigue: 3 },
        next: "c6_logs",
        cognition: { persistence: 1, reframing: 1 },
      },
      {
        id: "c6_desk_draft",
        label: "지워진 보고서 초안 11개를 복원한다",
        effect: { time: -12, legitimacy: 8, fatigue: 4 },
        next: "c6_logs",
        cognition: { inference: 3 },
      },
      {
        id: "c6_desk_seal",
        label: "책상을 증거로 봉인하고 조사에 넘긴다",
        effect: { legitimacy: 10, trust: -11, humanCost: 6, fatigue: 2 },
        next: "c6_logs",
        cognition: { risk: 2 },
      },
      {
        id: "free",
        label: "다른 방법을 제안한다",
        type: "free",
        next: "c6_logs",
      },
    ],
  },
  c6_logs: {
    phase: "THE OTHER CONDITION",
    title: "반대편 조건",
    speaker: "에코",
    text:
      "오진우의 실험 프로필이 열립니다. 그는 당신과 같은 연구의 반대편에 배정돼 있었습니다. 당신의 결정 창이 조금씩 길어지는 동안, 그의 창은 시즌 내내 조금씩 짧아졌습니다. 사건 03의 그 속도도, 사건 05의 6분짜리 검토도 재능이 아니라 설정값이었습니다. 그는 그 사실을 모릅니다.",
    memo: [
      "오진우의 결정 제한시간: 45초에서 31초로 단계적 축소",
      "축소 시점은 매번 당신이 검증을 선택한 직후",
      "두 사람의 프로필은 같은 실험 번호를 공유함",
      "이 자료를 공개하면 그의 모든 판단 기록이 함께 열림",
    ],
    triggers: ["injustice", "system", "selfAwareness"],
    choices: [
      {
        id: "c6_logs_tell",
        label: "오진우에게 그의 조건을 그대로 알린다",
        effect: { trust: 13, legitimacy: 4, humanCost: 5, fatigue: 4 },
        next: "c6_panel",
        cognition: { persistence: 2 },
      },
      {
        id: "c6_logs_shield",
        label: "그의 판단 기록은 덮고 설정값만 문제 삼는다",
        effect: { time: -8, trust: 7, legitimacy: -5, humanCost: -6, fatigue: 3 },
        next: "c6_panel",
        cognition: { reframing: 3 },
      },
      {
        id: "c6_logs_expose",
        label: "두 사람의 프로필을 함께 감사에 제출한다",
        effect: { legitimacy: 14, trust: -6, capital: -8, fatigue: 5 },
        next: "c6_panel",
        cognition: { risk: 2, inference: 1 },
      },
      {
        id: "free",
        label: "판을 바꿔 제안한다",
        type: "free",
        next: "c6_panel",
      },
    ],
  },
  c6_panel: {
    phase: "HEARING",
    title: "변호하지 마십시오",
    speaker: "오진우",
    text:
      "인사위원회(징계를 정하는 회의) 대기실에서 오진우가 처음으로 당신을 봅니다. 그는 넥타이를 고쳐 매고 말합니다. '변호하지 마십시오.' 설정값 이야기를 꺼내면 자기가 빨랐다는 사실까지 설정으로 읽힌다는 것을 그는 이미 압니다. 그가 지키고 싶은 것은 경력이 아니라 그 한 가지입니다. '아버지도 그랬습니다. 억울한 걸 증명하려다 평생 억울한 사람으로 정리됐어요.'",
    memo: [
      "오진우는 설정값 자료의 제출을 거부함",
      "그가 실제로 놓친 검증 항목도 두 건 있음",
      "위원회는 30분 뒤 시작",
      "그의 동의 없이 제출해도 자료는 유효함",
    ],
    triggers: ["recognition", "responsibility", "choice"],
    choices: [
      {
        id: "c6_panel_respect",
        label: "그의 뜻대로 설정값을 빼고 변론한다",
        effect: { trust: 12, legitimacy: -8, humanCost: 7, fatigue: 3 },
        next: "c6_final",
        cognition: { persistence: 2 },
      },
      {
        id: "c6_panel_submit",
        label: "동의 없이 설정값 자료를 제출한다",
        effect: { legitimacy: 13, trust: -12, humanCost: -6, fatigue: 4 },
        next: "c6_final",
        cognition: { risk: 2 },
      },
      {
        id: "c6_panel_both",
        label: "그가 놓친 두 건과 설정값을 같은 문서에 쓴다",
        effect: { time: -10, legitimacy: 7, trust: 5, fatigue: 5 },
        next: "c6_final",
        cognition: { reframing: 3, inference: 1 },
      },
      {
        id: "free",
        label: "판을 바꿔 제안한다",
        type: "free",
        next: "c6_final",
      },
    ],
  },
  c6_final: {
    phase: "FINAL DECISION",
    title: "옆자리의 값",
    speaker: "한서윤",
    text:
      "위원회는 결론을 요구합니다. 오진우를 책임자로 세우면 사건 05는 오늘 닫히고, 설정값을 꺼내면 트리거랩 전체가 조사 대상이 됩니다. 어느 쪽이든 옆자리 사람의 이름이 값으로 쓰입니다. 그리고 당신은 이제 압니다. 같은 폴더 안에 당신의 프로필도 있고, 그 폴더의 관리자 계정은 그룹전략실에 있습니다.",
    memo: [
      "책임자를 세우면 사건 05는 즉시 종결",
      "설정값을 꺼내면 실험 전체가 열림",
      "오진우는 어느 쪽에도 동의하지 않음",
      "같은 폴더의 관리자 계정: 그룹전략실",
    ],
    triggers: ["responsibility", "affection", "selfAwareness", "system"],
    choices: [
      {
        id: "c6_final_person",
        label: "오진우를 지키고 사건 종결을 미룬다",
        effect: { time: -9, trust: 14, legitimacy: -6, humanCost: -7, fatigue: 4 },
        next: "case06_result",
        cognition: { persistence: 2 },
      },
      {
        id: "c6_final_record",
        label: "설정값을 공개하고 실험을 조사 대상으로 만든다",
        effect: { legitimacy: 15, trust: -5, capital: -10, fatigue: 5 },
        next: "case06_result",
        cognition: { risk: 1, inference: 2 },
      },
      {
        id: "c6_final_close",
        label: "책임자를 세우고 사건 05를 오늘 닫는다",
        effect: { capital: 17, trust: -13, legitimacy: -4, humanCost: 9, fatigue: 2 },
        next: "case06_result",
        cognition: { risk: 2 },
      },
      {
        id: "free",
        label: "마지막으로 판을 바꿔 제안한다",
        type: "free",
        next: "case06_result",
      },
    ],
  },
};
