import { localizeTables } from "../locale.js";

/**
 * The briefing page before a table opens (SceneBriefing.jsx, its folded case
 * file's CaseCast.jsx) and the scene's derived copy the play screen shows
 * (viewModels/sceneViewModels.js: the stock speaker card, the authority line,
 * the bonus and the scene challenge): the words they print, read by key so
 * another language can be laid over them (src/locale.js, 다국어 틀). The
 * Korean is the screen's own, moved here unchanged.
 */
const briefingCopy = {
  // The panel's sound: drawn by position from the scene id (`pickSfx`).
  sfxCalm: ["째깍", "두근", "지이잉", "툭", "스윽", "딸깍"],
  sfxBroken: ["쾅!", "쩌억!", "콰직!"],
  timer: {
    label: "읽는 시간 멈춤",
    held: "멈춤 · 누르면 다시 흐른다",
    running: "초 뒤 판이 열린다 · 누르면 멈춤",
    heldSr: "{seconds}초에서 멈춰 있다. 누르면 다시 흐른다",
    runningSr: "{seconds}초 뒤 판이 열린다",
  },
  yourCall: "당신의 판단",
  caseFile: "사건 파일",
  carried: "이월 · 이번 판에 이어지는 규칙",
  // After the English PROTOCOL BREACH.
  breach: " · 이번 판의 규칙이 바뀌었다",
  hint: "카드를 고르면 그 카드를 건 채로 판이 열린다",
  cardsLabel: "바로 걸 카드",
  sealed: "봉인",
  locked: "잠김",
  open: "판 열기",
  openSeconds: "{seconds}초 시작",
  openLabel: "판 열기 {seconds}초 시작. 지금부터 시계가 흐르고 카드를 걸 수 있다",
  cast: {
    trail: "이 사건의 지난 장면",
    people: "등장인물",
    // Before the case's label.
    firstCase: "처음 나온 사건 · ",
  },
  scene: {
    // The card of a speaker with no profile.
    stockProfile: {
      role: "사건 관계자",
      stance: "상황 설명",
      job: "현재 국면의 핵심 정보를 전달한다.",
      appearance: "정돈되지 않은 자료 더미 앞에 사건 관계자가 앉아 있다.",
      thought: "이 장면에서 놓친 전제가 있는지 다시 확인한다.",
      gesture: "사건 관계자는 잠깐 말을 멈추고, 테이블 위 자료를 다시 바라본다.",
      voice: "상황을 과장하지 않고 필요한 정보만 전달한다.",
      line: "지금 결정하면, 무엇이 다음 장면으로 넘어갑니까?",
    },
    authority: {
      observer: "단서 {clues}개, 또는 {trust} {value}{particle} 필요합니다.",
      field: "{legitimacy} {value}, 단서 {clues}개를 모으면 감독 권한이 열립니다.",
      oversight: "감독 권한이 열려 최종 종료 조건을 제안할 수 있습니다.",
    },
    bonus: {
      reframe: "판 바꾸기 보너스",
      challenge: "연속 챌린지 보너스",
      deliberate: "숙고 보너스",
      run: "연속 판단 보너스",
      waiting: "보너스 대기",
    },
    // The challenge a case's opening inherits from how the case before it closed.
    inherited: {
      clearSignal: { title: "믿음을 다음 장면에 넘기기", text: "이전 사건에서 얻은 믿음을 잃지 않는 선택이 다음 압박의 문을 엽니다." },
      openWound: { title: "공정함의 균열 봉합하기", text: "공정함을 회복하는 선택으로 지난 사건의 균열을 먼저 봉합해야 합니다." },
      unfinishedCost: { title: "남은 비용 줄이기", text: "지난 사건에서 넘어온 비용을 줄이면 이번 장면의 회복 보너스가 붙습니다." },
      other: { title: "이전 판단의 비용 확인하기", text: "이전 판단이 남긴 숨은 비용을 찾아야 다음 사건의 기준을 다시 세울 수 있습니다." },
    },
    challenge: {
      lowerRisk: { title: "위험 압력 낮추기", text: "예상 위험이 내려가는 선택을 찾으면 압박 관리 보너스가 붙습니다." },
      useReframe: { title: "판 바꾸기 시도", text: "'판을 다시 짠다' 카드를 걸고 벽에 닿기 전에 확정하면 이 사건의 숨은 경로가 열립니다." },
      avoidRisk: { title: "속도에 말리지 않기", text: "위험 상승을 감수하지 않고 경쟁 압박을 통과하는 선택을 찾습니다." },
      findCost: { title: "숨은 비용 찾기", text: "가장 좋아 보이는 선택의 반대 비용을 확인하고 고릅니다." },
    },
  },
};
export default briefingCopy;

localizeTables("screens", { briefing: briefingCopy });
