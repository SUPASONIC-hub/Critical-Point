/**
 * FINAL -- the authored scenes of the closing case.
 *
 * Forty-nine cases judged other people's paperwork. This one opens the folder
 * the lab was actually producing: an HR scoring appendix that tells the group
 * which of its employees will raise a hand, and under what pressure they stop.
 * The man who commissioned it is the man who left the signature box on
 * 2023-0412 empty, and 사건 01 happened because he wanted to know what the
 * analyst would do the second time.
 *
 * By this night the lab has been dissolved for half a year, 윤상혁 has been
 * voted out and sentenced, and the 33rd-floor office is a room he has one
 * night to clear. The scenes stand on what 사건 43-49 left: a B2 terminal the
 * disposal list skipped, a successor form with the analyst's name on it, and
 * the pencil dot beside the empty box.
 */
export const finalCaseNodes = {
  f_start: {
    phase: "FINAL CASE",
    title: "인사평가 보조지표",
    speaker: "에코",
    text:
      "33층에 오르기 전, 옛 트리거랩 건물 B2 기록 보관소입니다. 해체 때 반납 목록에서 빠진 케이스데스크 한 대가 아직 켜져 있고, 화면에는 폴더 하나가 열려 있습니다. 이름은 '인사평가_보조지표', 인사평가 보조지표(사람을 평가할 때 곁들여 보는 숫자)입니다. 그 안에는 당신이 3년 동안 고른 선택의 기록과, 그 기록에 맞춰 다음 사례를 어떻게 고쳐 내보냈는지가 날짜와 함께 들어 있습니다. 랩이 없어진 뒤의 날짜도 있습니다. 에코가 한 줄을 띄웁니다. '이 폴더의 양식은 연구 자료가 아닙니다. 인사 보고 양식입니다. 맨 위 파일은 후임 관리자 지정서이고, 추천란에 당신 이름이 있습니다.'",
    memo: [
      "플로우온의 72시간 뒤 -- 보호와 책임 압박을 올림",
      "유출 소동·입찰·지원금 심사 뒤 -- 신뢰, 경쟁, 명분의 허용선을 차례로 기록",
      "설계 로그 3,412건, 해체 뒤에도 기록 중 -- 마지막 줄은 어젯밤",
      "후임 관리자 지정서: 관리자 칸에 점 하나, 추천란에 당신 이름",
      "문서 양식: 그룹 인사평가 별첨 서식 7호",
    ],
    triggers: ["curiosity", "responsibility", "order"],
    choices: [
      {
        id: "f_start_map",
        label: "내 로그가 사건 설계에 어떻게 쓰였는지 추적한다",
        effect: { time: -10, legitimacy: 9, humanCost: 2, fatigue: 4 },
        cognition: { inference: 3, persistence: 1 },
      },
      {
        id: "f_start_expose",
        label: "즉시 외부 공개를 준비한다",
        effect: { trust: 5, legitimacy: 7, humanCost: -3, fatigue: 3 },
        cognition: { risk: 2 },
      },
      {
        id: "f_start_contain",
        label: "한서윤에게 내부 설명을 요구한다",
        effect: { trust: 6, legitimacy: 2, humanCost: 3, fatigue: 2 },
        cognition: { inference: 1, risk: 1 },
      },
      {
        id: "reframe",
        label: "다른 접근을 제안한다",
        type: "reframe",
        next: "f_archive",
      },
    ],
  },
  f_archive: {
    phase: "ARCHIVE",
    title: "왜 하필 그 파일이었나",
    speaker: "한서윤",
    text:
      "한서윤이 반납하지 않은 열쇠를 단말 옆에 내려놓고 인정합니다. 트리거랩은 사람이 더 깊이 생각하게 만드는 조건을 연구했고, 같은 자료는 사람이 언제 더 쉽게 밀려나는지도 알려 줬습니다. 그 자료는 핏스코어로 팔렸고, 38만 줄이 인터넷에 풀렸고, 랩이 해체된 뒤에도 이 단말 한 대는 계속 적고 있었습니다. 그리고 옥상에서 끝내 하지 못한 말을 합니다. '당신 책상에 처음 올린 그 훈련용 파일, 제가 고른 게 아닙니다. 위에서 번호를 지정해서 내려왔습니다. 2023-0412. 당신이 3년 전에 반대했던 그 건을, 당신 책상에 올리라고요. 두 번째에는 어떻게 하는지 보고 싶었던 겁니다.'",
    memo: [
      "반응 기록 63명분 -- 핏스코어로 18억에 매각, 모델은 지금 정지",
      "유출된 38만 줄 -- 열세 명이 망설인 초까지",
      "해체 뒤에도 B2 단말 한 대는 기록을 계속함",
      "첫 훈련용 사례의 번호는 그룹전략실이 직접 지정",
    ],
    triggers: ["injustice", "curiosity", "responsibility"],
    choices: [
      {
        id: "f_archive_destroy",
        label: "판단 프로필 데이터 폐기를 요구한다",
        effect: { legitimacy: 6, trust: -4, humanCost: -5, fatigue: 4 },
        cognition: { persistence: 2, risk: 1 },
      },
      {
        id: "f_archive_reform",
        label: "투명한 동의와 감사 구조로 바꾸자고 제안한다",
        effect: { trust: 6, legitimacy: 5, fatigue: 4 },
        cognition: { reframing: 3 },
      },
      {
        id: "f_archive_seal",
        label: "외부 공개 전 증거와 피해 범위를 더 모은다",
        effect: { time: -12, legitimacy: 3, humanCost: -4, fatigue: 4 },
        cognition: { inference: 2, persistence: 1 },
      },
      {
        id: "reframe",
        label: "판을 바꿔 제안한다",
        type: "reframe",
      },
    ],
  },
  f_confront: {
    phase: "CONFRONTATION",
    title: "당신의 조건",
    speaker: "윤상혁",
    text:
      "본사 33층, 옛 그룹전략실. 짐이 빠진 방에 이삿짐 상자 몇 개와 책상 하나만 남았습니다. 이사회에서 해임(이사를 자리에서 물러나게 하는 일)되고 1심에서 집행유예(형을 미뤄 두고 당장 가두지는 않는 판결)를 받은 윤상혁은 이 밤에도 화내지 않습니다. 갤러리 이야기도, 해온파트너스 이야기도 이미 들었다고 합니다. 그는 3년 전 그 서류를 직접 꺼내 서명란이 빈 3페이지를 펼쳐 놓습니다. 빈칸 옆에는 연필 점 하나가 찍혀 있습니다. '여기 이름을 안 넣은 건 실수가 아니라 설계였네. 이름이 없으면 책임도 없고, 책임이 없으면 다음 결정이 빨라지지. 나 혼자 한 설계는 아니었고.' 그가 그 옆에 후임 관리자 지정서와 펜 한 자루를 놓습니다. '자네는 압박이 올라갈수록 더 깊이 생각하더군. 아주 귀한 성질이야. 그런 사람을 어디에 둘지, 3년 전에는 내가 정했네. 이제 내게는 정할 자리가 없어. 그래서 묻지. 이 칸에 누구 이름이 들어가야 하나.'",
    memo: [
      "윤상혁: 이사회 해임, 1심 집행유예 -- 검찰은 항소",
      "2023-0412 승인 문서 3페이지 -- 빈 서명란 옆 연필 점",
      "후임 관리자 지정서 -- 추천란에 당신 이름, 펜 한 자루",
      "오진우를 포함한 열세 명의 프로필도 같은 폴더에 있음",
      "반재욱이 외부 감사용 사본을 이미 확보함",
    ],
    triggers: ["responsibility", "curiosity", "order", "protection"],
    choices: [
      {
        id: "f_confront_seal",
        label: "내 프로필과 관련 데이터를 봉인한다",
        effect: { legitimacy: 5, trust: -2, humanCost: 4, fatigue: 2 },
        cognition: { risk: 2 },
      },
      {
        id: "f_confront_reform",
        label: "프로필을 공개하고 사용 규칙을 직접 설계한다",
        effect: { trust: 9, legitimacy: 6, humanCost: -4, fatigue: 5 },
        cognition: { reframing: 3, persistence: 1 },
      },
      {
        id: "f_confront_destroy",
        label: "트리거랩의 실험 구조를 폭로한다",
        effect: { trust: 5, legitimacy: 8, fatigue: 4 },
        cognition: { persistence: 2, risk: 1 },
      },
      {
        // The only route in the last case that buys trust with legitimacy. The
        // FIELD PACT ending asks for exactly that gap and had no way to open it.
        id: "f_confront_pact",
        label: "참가자들과 직접 합의하고 공식 절차는 건너뛴다",
        effect: { trust: 11, legitimacy: -8, humanCost: -4, time: -4, fatigue: 4 },
        cognition: { reframing: 2 },
      },
      {
        id: "reframe",
        label: "마지막으로 판을 바꾼다",
        type: "reframe",
      },
    ],
  },
  f_choice: {
    phase: "ENDING",
    title: "내가 생각을 멈추지 않는 조건",
    speaker: "한서윤",
    text:
      "33층에서 내려와 다시 B2의 단말 앞입니다. 마지막 선택이 남았습니다. 당신을 가장 오래 멈추지 못하고 생각하게 만든 것은 무엇이었습니까. 사람을 살리고 싶은 마음이었는지, 되갚고 싶은 분노였는지, 떠맡은 책임이었는지. 그 조건은 약점도, 도구도 될 수 있습니다. 한서윤이 케이스데스크 서랍에서 3년 묵은 봉투를 꺼내 단말 옆에 올려놓습니다. 자기 사직서입니다. '어느 쪽을 고르든, 이번엔 저도 이름을 넣겠습니다.' 이제 그 조건을 모르는 척할 수는 없습니다.",
    memo: [
      "봉인하면 -- 악용은 막히고, 이 기록으로 도울 길도 닫힘",
      "규칙을 붙이면 -- 폴더는 남고, 감시와 동의가 따라붙음",
      "밖으로 넘기면 -- 구조는 무너지고, 혼란은 기록 속 사람들이 먼저 겪음",
      "판을 다시 짜면 -- 세 길 밖에서 책임을 나누는 방식을 제안",
    ],
    triggers: ["responsibility", "order", "curiosity"],
    choices: [
      {
        id: "ending_seal",
        label: "내 조건을 누구도 쓰지 못하게 봉인한다",
        effect: { legitimacy: 6, trust: -4, humanCost: 5, fatigue: 2 },
        cognition: { risk: 2 },
      },
      {
        id: "ending_reform",
        label: "조건을 공개하고 사용 규칙을 만든다",
        effect: { trust: 9, legitimacy: 6, humanCost: -5, fatigue: 4 },
        cognition: { reframing: 3 },
      },
      {
        id: "ending_expose",
        label: "트리거랩의 구조를 통째로 외부에 넘긴다",
        effect: { legitimacy: 8, trust: 3, fatigue: 5 },
        cognition: { persistence: 2, risk: 1 },
      },
      {
        id: "reframe",
        label: "준비된 세 길 밖의 답을 제안한다",
        type: "reframe",
      },
    ],
  },
};
