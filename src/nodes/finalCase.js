/**
 * FINAL -- the authored scenes of the closing case.
 *
 * Six cases judged other people's paperwork. This one opens the folder the lab
 * was actually producing: an HR scoring appendix that tells the group which of
 * its employees will raise a hand, and under what pressure they stop. The man
 * who commissioned it is the man who left the signature box on 2023-0412 empty,
 * and 사건 01 happened because he wanted to know what the analyst would do the
 * second time.
 */
export const finalCaseNodes = {
  f_start: {
    phase: "FINAL CASE",
    title: "인사평가 보조지표",
    speaker: "에코",
    text:
      "모든 사건이 끝난 뒤, 케이스데스크에 숨겨진 폴더가 열립니다. 폴더 이름은 '인사평가_보조지표'입니다. 그 안에는 당신의 선택 기록과, 그 기록에 맞춰 다음 사건을 어떻게 고쳤는지가 함께 저장되어 있습니다. 파일 형식은 연구 자료가 아니라 인사 보고 양식입니다.",
    memo: [
      "사건 01 이후 보호와 책임 압박 증가",
      "사건 02 이후 신뢰와 증거 충돌 강화",
      "사건 03 이후 경쟁 점수판 노출",
      "사건 04 이후 명분 있는 위반 허용선 기록",
      "문서 양식: 그룹 인사평가 별첨 서식 7호",
    ],
    triggers: ["curiosity", "responsibility", "order"],
    choices: [
      {
        id: "f_start_map",
        label: "내 로그가 사건 설계에 어떻게 쓰였는지 추적한다",
        effect: { time: -10, legitimacy: 9, humanCost: 2, fatigue: 4 },
        next: "f_archive",
        cognition: { inference: 3, persistence: 1 },
      },
      {
        id: "f_start_expose",
        label: "즉시 외부 공개를 준비한다",
        effect: { trust: 5, legitimacy: 7, humanCost: -3, fatigue: 3 },
        next: "f_archive",
        cognition: { risk: 2 },
      },
      {
        id: "f_start_contain",
        label: "한서윤에게 내부 설명을 요구한다",
        effect: { trust: 6, legitimacy: 2, humanCost: 3, fatigue: 2 },
        next: "f_archive",
        cognition: { inference: 1, risk: 1 },
      },
      {
        id: "free",
        label: "다른 접근을 제안한다",
        type: "free",
        next: "f_archive",
      },
    ],
  },
  f_archive: {
    phase: "ARCHIVE",
    title: "왜 하필 그 파일이었나",
    speaker: "한서윤",
    text:
      "한서윤은 인정합니다. 트리거랩은 사람이 더 깊이 생각하게 만드는 조건을 연구했고, 같은 자료는 사람이 언제 더 쉽게 밀려나는지도 알려줬습니다. 그리고 마지막 한 가지를 말합니다. '사건 01의 훈련용 파일, 제가 고른 게 아닙니다. 위에서 번호를 지정해서 내려왔습니다. 2023-0412. 당신이 3년 전에 반대했던 그 건을, 당신 책상에 올리라고요. 두 번째에는 어떻게 하는지 보고 싶었던 겁니다.'",
    memo: [
      "기업 교육과 채용 심사에 일부 모델 제공",
      "개인별 판단 프로필은 익명 처리됐다고 주장",
      "익명 해제 가능성을 반재욱이 의심",
      "사건 01 사례 번호는 그룹전략실이 직접 지정",
    ],
    triggers: ["injustice", "curiosity", "responsibility"],
    choices: [
      {
        id: "f_archive_destroy",
        label: "판단 프로필 데이터 폐기를 요구한다",
        effect: { legitimacy: 6, trust: -4, humanCost: -5, fatigue: 4 },
        next: "f_confront",
        cognition: { persistence: 2, risk: 1 },
      },
      {
        id: "f_archive_reform",
        label: "투명한 동의와 감사 구조로 바꾸자고 제안한다",
        effect: { trust: 6, legitimacy: 5, fatigue: 4 },
        next: "f_confront",
        cognition: { reframing: 3 },
      },
      {
        id: "f_archive_seal",
        label: "외부 공개 전 증거와 피해 범위를 더 모은다",
        effect: { time: -12, legitimacy: 3, humanCost: -4, fatigue: 4 },
        next: "f_confront",
        cognition: { inference: 2, persistence: 1 },
      },
      {
        id: "free",
        label: "판을 바꿔 제안한다",
        type: "free",
        next: "f_confront",
      },
    ],
  },
  f_confront: {
    phase: "CONFRONTATION",
    title: "당신의 조건",
    speaker: "윤상혁",
    text:
      "그룹전략실 33층. 윤상혁 상무는 화내지 않습니다. 3년 전 그 서류를 직접 꺼내 서명란이 빈 3페이지를 펼쳐 놓습니다. '여기 이름을 안 넣은 건 실수가 아니라 설계였네. 이름이 없으면 책임도 없고, 책임이 없으면 다음 결정이 빨라지지.' 그리고 당신의 프로필을 옆에 놓습니다. '자네는 압박이 올라갈수록 더 깊이 생각하더군. 아주 귀한 성질이야. 그래서 이 방으로 부른 거고. 그런 사람을 어디에 둘지는 내가 정하네.'",
    memo: [
      "당신의 주 반응 조건이 최종 보고서에 표시됨",
      "오진우 역시 별도 프로필을 받았음이 확인됨",
      "도윤하는 당사자 동의 없는 실험에 반대",
      "반재욱이 외부 감사용 사본을 이미 확보함",
    ],
    triggers: ["responsibility", "curiosity", "order", "protection"],
    choices: [
      {
        id: "f_confront_seal",
        label: "내 프로필과 관련 데이터를 봉인한다",
        effect: { legitimacy: 5, trust: -2, humanCost: 4, fatigue: 2 },
        next: "f_choice",
        cognition: { risk: 2 },
      },
      {
        id: "f_confront_reform",
        label: "프로필을 공개하고 사용 규칙을 직접 설계한다",
        effect: { trust: 9, legitimacy: 6, humanCost: -4, fatigue: 5 },
        next: "f_choice",
        cognition: { reframing: 3, persistence: 1 },
      },
      {
        id: "f_confront_destroy",
        label: "트리거랩의 실험 구조를 폭로한다",
        effect: { trust: 5, legitimacy: 8, fatigue: 4 },
        next: "f_choice",
        cognition: { persistence: 2, risk: 1 },
      },
      {
        // The only route in the last case that buys trust with legitimacy. The
        // FIELD PACT ending asks for exactly that gap and had no way to open it.
        id: "f_confront_pact",
        label: "참가자들과 직접 합의하고 공식 절차는 건너뛴다",
        effect: { trust: 11, legitimacy: -8, humanCost: -4, time: -4, fatigue: 4 },
        next: "f_choice",
        cognition: { reframing: 2 },
      },
      {
        id: "free",
        label: "마지막으로 판을 바꾼다",
        type: "free",
        next: "f_choice",
      },
    ],
  },
  f_choice: {
    phase: "ENDING",
    title: "내가 생각을 멈추지 않는 조건",
    speaker: "한서윤",
    text:
      "시즌의 마지막 선택입니다. 당신은 자신의 조건을 약점으로만 볼 수도 있고, 도구로 쓸 수도 있습니다. 한서윤이 서랍에서 3년 묵은 봉투를 꺼내 책상에 올려놓습니다. 자기 사직서입니다. '어느 쪽을 고르든, 이번엔 저도 이름을 넣겠습니다.' 이제 그 조건을 모르는 척할 수는 없습니다.",
    memo: [
      "봉인: 악용 가능성을 줄이지만 활용도 막음",
      "개혁: 시스템을 남기되 감시와 동의를 붙임",
      "폭로: 구조를 무너뜨리지만 혼란을 감수함",
      "판 바꾸기: 기존 결말 밖의 책임 구조 제안",
    ],
    triggers: ["responsibility", "order", "curiosity"],
    choices: [
      {
        id: "ending_seal",
        label: "봉인 엔딩: 내 조건을 누구도 쓰지 못하게 한다",
        effect: { legitimacy: 6, trust: -4, humanCost: 5, fatigue: 2 },
        next: "final_result",
        cognition: { risk: 2 },
      },
      {
        id: "ending_reform",
        label: "개혁 엔딩: 조건을 공개하고 사용 규칙을 만든다",
        effect: { trust: 9, legitimacy: 6, humanCost: -5, fatigue: 4 },
        next: "final_result",
        cognition: { reframing: 3 },
      },
      {
        id: "ending_expose",
        label: "폭로 엔딩: 트리거랩의 구조를 외부에 넘긴다",
        effect: { legitimacy: 8, trust: 3, fatigue: 5 },
        next: "final_result",
        cognition: { persistence: 2, risk: 1 },
      },
      {
        id: "free",
        label: "나만의 결말을 제안한다",
        type: "free",
        next: "final_result",
      },
    ],
  },
};
