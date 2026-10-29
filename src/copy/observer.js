import { localizeTables } from "../locale.js";

/**
 * What the observer writes about a run (gameLogic.js: `getObserverTag`,
 * `getObserverPattern`) and the season's endings' own lines (`ENDINGS`),
 * read by key so another language can be laid over them (src/locale.js,
 * 다국어 틀). The Korean is gameLogic.js's, moved here unchanged; a name
 * followed by its particle is a `{particle}` blank.
 */
const observerCopy = {
  tags: {
    reframe: {
      label: "거부 표본",
      text: "준비된 선택지 밖으로 나간 순간입니다. 다음 참가자의 사건에는 이 우회로가 새 조건으로 남습니다.",
    },
    opacity: {
      label: "은폐 표본",
      text: "공개를 늦춘 판단입니다. 트리거랩은 이 침묵이 누구를 보호하고 누구를 지우는지 따로 보관합니다.",
    },
    sacrifice: {
      label: "희생 표본",
      text: "사람에게 비용을 넘긴 판단입니다. 사건은 지나가도 이 손실은 다음 장면의 말투로 되돌아옵니다.",
    },
    compliance: {
      label: "순응 표본",
      text: "빠르게 닫힌 안정 선택입니다. 정답처럼 보인 길이 관찰자에게는 가장 읽기 쉬운 패턴이 됩니다.",
    },
    pressure: {
      label: "고압 표본",
      text: "압박 상승을 감수한 판단입니다. 이 선택은 해결책보다 허용선에 가까운 기록으로 분류됩니다.",
    },
    pattern: {
      label: "패턴 표본",
      text: "크게 튀지 않은 선택입니다. 그래서 더 오래 남습니다. 관찰자는 반복되는 기준을 먼저 찾습니다.",
    },
  },
  labels: {
    compliance: "순응 표본",
    defiance: "거부 표본",
    opacity: "은폐 표본",
    sacrifice: "희생 표본",
    pattern: "패턴 표본",
  },
  arc: {
    compliance: {
      label: "관찰자 학습",
      title: "안정적인 선택이 다음 사건의 기본값으로 굳고 있습니다.",
      text: "정답처럼 닫힌 길이 많을수록, 다음 장면은 더 빠른 결정을 유도하는 구조로 바뀝니다.",
    },
    defiance: {
      label: "관찰자 학습",
      title: "시스템이 예외 경로를 새 규칙 후보로 붙잡고 있습니다.",
      text: "준비된 선택지를 벗어난 흔적이 다음 참가자에게는 처음부터 열린 틈으로 나타납니다.",
    },
    opacity: {
      label: "관찰자 학습",
      title: "말하지 않은 판단이 사건의 어두운 조건으로 축적됩니다.",
      text: "공개하지 않은 선택은 사라지지 않고, 다음 장면에서 누가 배제됐는지 묻는 질문으로 돌아옵니다.",
    },
    sacrifice: {
      label: "관찰자 학습",
      title: "누군가에게 넘긴 비용이 다음 사건의 첫 압박이 됩니다.",
      text: "해결은 되었지만 손실의 방향이 남았습니다. 다음 참가자는 그 손실을 이미 떠안고 시작합니다.",
    },
    pattern: {
      label: "관찰자 학습",
      title: "반복된 기준이 아직 결말보다 선명하게 남아 있습니다.",
      text: "크게 튀지 않은 판단들이 모여, 다음 사건의 보이지 않는 기본 규칙을 만듭니다.",
    },
  },
  escalation: {
    repeated: "같은 표본이 연속으로 닫혀 관찰자가 당신의 기준을 확신하기 시작했습니다.",
    latest: "{label}{particle} 최근 기록으로 남아 다음 질문의 말투를 바꿉니다.",
    none: "아직 관찰자는 확정된 기준을 만들지 못했습니다.",
  },
  turningPoint: {
    label: "전환점 기록",
    title: "{label}{particle} 익숙한 패턴을 끊었습니다.",
    text: "“{choice}” 이후 관찰자는 같은 사람을 같은 방식으로 분류할 수 없게 됐습니다.",
  },
  endingRecord: {
    repeated: "다음 참가자의 첫 장면은 당신이 반복한 기준에서 시작됩니다.",
    most: "다음 참가자의 첫 장면은 당신이 가장 많이 남긴 표본에서 시작됩니다.",
  },
  // The endings' titles and lines (`ENDINGS`); their labels are English already.
  endings: {
    collapse: { title: "권한은 있었지만, 사람이 치른 값을 감당하지 못했다.", text: "기록은 남았지만 사람과 운영 모두를 지키지 못한 실패 엔딩입니다." },
    "open-oversight": { title: "당신은 사건을 해결한 사람이 아니라 기준을 만든 사람이 되었다.", text: "이번 시즌의 기록이 다음 분석관이 따를 기준으로 남았습니다." },
    "evidence-reform": { title: "증거를 공개하되, 사람을 다시 소모하지 않는 규칙을 만들었다.", text: "폭로와 보호 사이에 새 운영 기준이 생겼습니다." },
    "human-record": { title: "정답 대신, 누구의 목소리도 지워지지 않는 기록을 남겼다.", text: "당신이 다시 짠 판이 다음 참가자의 첫 단서가 됩니다." },
    "profitable-silence": { title: "조직은 살아남았지만, 아무도 같은 질문을 다시 하지 않았다.", text: "가장 높은 점수와 가장 낮은 믿음이 함께 기록되었습니다." },
    "cold-justice": { title: "절차는 완벽했지만, 그 절차 안의 사람은 돌아오지 않았다.", text: "공정함은 지켰지만 관계 비용이 다음 사건으로 넘어갑니다." },
    "field-pact": { title: "공식 승인보다 먼저, 현장의 약속이 다음 문을 열었다.", text: "당신의 관계망이 잠긴 기록에 접근할 수 있게 합니다." },
    "quiet-cover": { title: "위험은 낮췄지만, 진실도 아직 잠들어 있다.", text: "무너진 것도, 드러난 것도 없이 시즌이 닫혔습니다." },
  },
  // OPEN QUESTION, by what the run ended holding (`getOpenQuestionEnding`).
  openQuestion: {
    trust: { title: "답은 못 냈지만, 당신에게 말을 거는 사람은 남았다.", text: "사건마다 사람 피해 {value}{particle} 남긴 채 문을 닫았습니다. 다음 참가자는 당신을 아는 사람들에게서 시작합니다." },
    legitimacy: { title: "절차는 남았고, 그 절차가 무엇을 위한 것인지는 남지 않았다.", text: "공정함은 {value}에서 멈췄고 이유를 적어둔 문서는 없습니다. 다음 사람은 규칙만 물려받습니다." },
    capital: { title: "장부는 버텼고, 질문은 그대로 넘어갔다.", text: "현금 {value}{particle} 지킨 대신 닫히지 않은 기록이 남았습니다." },
  },
};
export default observerCopy;

localizeTables("screens", { observer: observerCopy });
