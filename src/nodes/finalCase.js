/** FINAL -- the authored scenes of the closing case. */
export const finalCaseNodes = {
  f_start: {
    phase: "FINAL CASE",
    title: "TRIGGER LAB",
    speaker: "에코",
    text:
      "모든 케이스가 끝난 뒤, 케이스데스크에 숨겨진 폴더가 열립니다. 폴더 이름은 'activation_use_cases'입니다. 그 안에는 당신의 선택 로그와 다음 사건 설계 변경 기록이 함께 저장되어 있습니다.",
    memo: [
      "CASE 01 이후 보호/책임 압박 증가",
      "CASE 02 이후 신뢰-증거 충돌 강화",
      "CASE 03 이후 경쟁 점수판 노출",
      "CASE 04 이후 명분 있는 위반 허용선 기록",
    ],
    triggers: ["curiosity", "responsibility", "order"],
    choices: [
      {
        id: "f_start_map",
        label: "내 로그가 사건 설계에 어떻게 쓰였는지 추적한다",
        effect: { time: -10, legitimacy: 8, humanCost: 2, fatigue: 4 },
        next: "f_archive",
        cognition: { inference: 3, persistence: 1 },
      },
      {
        id: "f_start_expose",
        label: "즉시 외부 공개를 준비한다",
        effect: { trust: 4, legitimacy: 6, humanCost: -2, fatigue: 3 },
        next: "f_archive",
        cognition: { risk: 2 },
      },
      {
        id: "f_start_contain",
        label: "한서윤에게 내부 설명을 요구한다",
        effect: { trust: 5, legitimacy: 1, humanCost: 3, fatigue: 2 },
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
    title: "활성 조건 사용례",
    speaker: "한서윤",
    text:
      "한서윤은 인정합니다. 트리거랩은 사람을 더 잘 생각하게 만드는 조건을 연구했습니다. 하지만 같은 데이터는 사람이 언제 더 쉽게 몰아붙여지는지 알려주는 자료이기도 했습니다.",
    memo: [
      "기업 교육 프로그램에 일부 모델 제공",
      "위기 협상, 채용, 내부 감사에 응용 가능",
      "개인별 트리거 프로필은 익명화됐다고 주장",
      "익명화 해제 가능성을 반재욱이 의심",
    ],
    triggers: ["injustice", "curiosity", "responsibility"],
    choices: [
      {
        id: "f_archive_destroy",
        label: "트리거 프로필 데이터 폐기를 요구한다",
        effect: { legitimacy: 5, trust: -4, humanCost: -4, fatigue: 4 },
        next: "f_confront",
        cognition: { persistence: 2, risk: 1 },
      },
      {
        id: "f_archive_reform",
        label: "투명한 동의와 감사 구조로 바꾸자고 제안한다",
        effect: { trust: 5, legitimacy: 4, fatigue: 4 },
        next: "f_confront",
        cognition: { reframing: 3 },
      },
      {
        id: "f_archive_seal",
        label: "외부 공개 전 증거와 피해 범위를 더 모은다",
        effect: { time: -12, legitimacy: 2, humanCost: -3, fatigue: 4 },
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
    speaker: "에코",
    text:
      "에코가 마지막 질문을 던집니다. '당신은 자신을 움직이는 조건을 알게 됐습니다. 그 조건은 당신을 더 깊이 생각하게 만들었습니다. 동시에 다른 사람이 당신을 더 정확히 압박할 수 있게 만들었습니다.'",
    memo: [
      "당신의 Primary Trigger가 최종 보고서에 표시됨",
      "오진우 역시 별도 프로필을 받았을 가능성",
      "도윤하는 피해자 동의 없는 실험에 반대",
      "반재욱은 외부 감사 파일을 확보함",
    ],
    triggers: ["responsibility", "curiosity", "order", "protection"],
    choices: [
      {
        id: "f_confront_seal",
        label: "내 프로필과 관련 데이터를 봉인한다",
        effect: { legitimacy: 4, trust: -2, humanCost: 4, fatigue: 2 },
        next: "f_choice",
        cognition: { risk: 2 },
      },
      {
        id: "f_confront_reform",
        label: "프로필을 공개하고 사용 규칙을 직접 설계한다",
        effect: { trust: 8, legitimacy: 5, humanCost: -3, fatigue: 5 },
        next: "f_choice",
        cognition: { reframing: 3, persistence: 1 },
      },
      {
        id: "f_confront_destroy",
        label: "트리거랩의 실험 구조를 폭로한다",
        effect: { trust: 4, legitimacy: 7, fatigue: 4 },
        next: "f_choice",
        cognition: { persistence: 2, risk: 1 },
      },
      {
        // The only route in the last case that buys trust with legitimacy. The
        // FIELD PACT ending asks for exactly that gap and had no way to open it.
        id: "f_confront_pact",
        label: "참가자들과 직접 합의하고 공식 절차는 건너뛴다",
        effect: { trust: 10, legitimacy: -8, humanCost: -3, time: -4, fatigue: 4 },
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
      "시즌의 마지막 선택입니다. 당신은 자신의 트리거를 약점으로만 볼 수도 있고, 도구로 사용할 수도 있습니다. 중요한 것은 이제 그 조건을 모르는 척할 수 없다는 사실입니다.",
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
        effect: { legitimacy: 5, trust: -4, humanCost: 5, fatigue: 2 },
        next: "final_result",
        cognition: { risk: 2 },
      },
      {
        id: "ending_reform",
        label: "개혁 엔딩: 조건을 공개하고 사용 규칙을 만든다",
        effect: { trust: 8, legitimacy: 5, humanCost: -4, fatigue: 4 },
        next: "final_result",
        cognition: { reframing: 3 },
      },
      {
        id: "ending_expose",
        label: "폭로 엔딩: 트리거랩의 구조를 외부에 넘긴다",
        effect: { legitimacy: 7, trust: 2, fatigue: 5 },
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
