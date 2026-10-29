import { localizeTables } from "../locale.js";

/**
 * The season's closing pages (EndingSequence.jsx, the twists ResultScreen.jsx
 * hands it, and endingCopy.js's verdicts, afterglows and axes) and 「당신의 세
 * 장면」 (threeScenes.js): the words they print, read by key so another
 * language can be laid over them (src/locale.js, 다국어 틀). The Korean is
 * the modules' own, moved here unchanged; endingCopy.js keeps its functions
 * and reads its tables from here.
 */
const endingCopy = {
  sequence: {
    label: "최종 엔딩 시퀀스",
    seasonComplete: "시즌 완료",
    announceOpened: "기록이 열렸습니다. {count}개의 기록이 아직 열리지 않았습니다.",
    witnessLabel: "엔딩 증거 기록",
    blueprintLabel: "다음 참가자에게 넘어갈 사건 설계도",
    next: "다음",
    skip: "이 화면 건너뛰기",
    messageLabel: "다음 참가자에게 남길 한 문장",
    messageSave: "기록 남기기",
    opened: "기록 열림",
    leftBehind: "당신이 남긴 것",
    unopened: "{count}개의 기록이 아직 열리지 않았다.",
    unopenedParts: "단서 {clues}개 · 밟지 않은 갈래 {branches}개",
    inherit: "다음 참가자는 이 빈칸을 이어받습니다.",
    readNow: "이제 기록 열람을 시작할 수 있습니다.",
  },
  // The three twists' kickers and the records under the last (ResultScreen.jsx).
  twists: { ruling: "판정", execution: "집행", cost: "대가" },
  finalChoiceFallback: "당신이 남긴 마지막 판단",
  witness: {
    first: "처음 내린 판단",
    longest: "가장 오래 붙잡은 판단",
    branch: "판을 흔든 판단",
  },
  // 「순응 표본」 read as a judgment type, 「순응형」.
  sampleSuffix: " 표본",
  typeSuffix: "형",
  observationLabels: { compliance: "순응", defiance: "거부", opacity: "은폐", sacrifice: "희생" },
  verdicts: {
    ending_seal: {
      title: "B2의 폴더는 봉인됩니다.",
      ruling: "인사평가 보조지표 폴더와 13명의 프로필은 다시 열리지 않습니다. 당신의 기록도 그 안에 잠깁니다. 피해는 더 커지지 않습니다. 다만 열쇠는 감사팀 몇 사람만 갖습니다.",
      execution: "그 밤 B2 단말의 기록이 멈춥니다. 33층 인사기획으로 가던 서식도 끊깁니다. 다음 참가자를 부르는 공고는 나가지 않습니다.",
      cost: "문을 닫았을 뿐, 서식을 고친 것은 아닙니다. 같은 서식이 다른 이름으로 돌아올 수 있습니다. 자기 기록을 돌려 달라던 선우진도 그 문 앞에서 기다립니다.",
    },
    ending_reform: {
      title: "폴더는 남고, 그 폴더를 쓰는 규칙이 붙습니다.",
      ruling: "당신의 기록은 약점 목록이 아니라 사용 규칙의 기준표가 됩니다. 본인이 동의하지 않으면 누구의 반응 기록도 인사평가에 쓸 수 없습니다. 63명은 자기 기록을 가장 먼저 열어 봅니다.",
      execution: "서식 7호의 관리자 칸은 이제 비워 둘 수 없습니다. 서식을 고칠 때마다 누가 고쳤는지 공개됩니다. 1기 네 사람의 기록부터 돌려줍니다.",
      cost: "폴더는 살아남습니다. 그래서 앞으로의 일은 없애는 것이 아니라 감시를 오래 지키는 것입니다. 규칙을 만든 자리에 누가 계속 앉을지는 아직 정해지지 않았습니다.",
    },
    ending_expose: {
      title: "B2의 폴더가 통째로 밖에 나갑니다.",
      ruling: "인사평가 보조지표는 더 이상 그룹 안의 자료가 아닙니다. 금융감독원과 기자들이 그 서식을 읽기 시작합니다. 그런데 공개된 자료는 13명의 이름 가까이까지 번집니다.",
      execution: "반재욱이 봉투를 봉해 외부 감사단에 넘깁니다. 33층 인사기획의 접근 권한이 회수됩니다. 그룹 전체에 같은 서식이 있는지 감사가 시작됩니다.",
      cost: "진실은 빠르게 움직입니다. 그 속도 때문에 누군가는 보호받기 전에 먼저 드러납니다. 지난여름 반응 기록이 풀렸을 때와 같습니다.",
    },
  },
  collapse: {
    title: "이 시즌은 무너졌습니다.",
    ruling: "권한은 있었지만 사건마다 쌓인 사람 피해를 감당하지 못했습니다. 기록은 남습니다. 다만 그 기록으로 지킬 사람들이 먼저 떠났습니다.",
    execution: "남은 사건은 멈춥니다. 다음 시즌에 무엇을 바꾸면 버틸 수 있는지만 따로 적힙니다.",
    cost: "잘 굴러갈 때 사람들에게 주던 수당과 지원이 가장 먼저 거둬집니다. 실패는 끝이 아니라 다음 시즌의 출발선이 됩니다.",
  },
  openCost: "결론을 미룬 만큼, 다음 참가자는 더 많은 권한과 더 무거운 질문을 함께 받습니다.",
  twistTitles: {
    execution: "당신의 마지막 선택은 그 밤 바로 실행됩니다.",
    cost: "끝난 것은 사건이고, 남은 것은 책임입니다.",
  },
  axes: [
    { label: "PROTECT", text: "사람과 현장의 피해를 얼마나 줄였는가" },
    { label: "EXPOSE", text: "구조와 숨은 비용을 얼마나 드러냈는가" },
    { label: "HANDOFF", text: "다음 참가자에게 선택지를 얼마나 남겼는가" },
  ],
  afterglows: {
    compliance: {
      title: "당신은 질서를 지켰고, 그 질서가 누구를 조용히 밀어냈는지도 남겼습니다.",
      text: "기록은 당신을 순응한 사람으로만 저장하지 않습니다. 무너지지 않게 붙잡은 순간과, 너무 늦게 질문한 순간을 함께 보관합니다.",
    },
    defiance: {
      title: "당신은 문을 열었고, 이제 그 문으로 들어올 사람의 몫까지 떠안았습니다.",
      text: "거부는 끝내는 버튼이 아니었습니다. 다음 사람에게 더 큰 선택지를 남기는 대신, 더 큰 책임도 함께 넘긴 일이었습니다.",
    },
    opacity: {
      title: "당신이 숨긴 것은 사라지지 않고, 다음 참가자의 첫 질문이 되었습니다.",
      text: "침묵은 흔적을 지우지 못했습니다. 다만 누가 그 흔적을 먼저 발견할지, 그 순서만 바꾸었습니다.",
    },
    sacrifice: {
      title: "당신은 누군가를 살리기 위해 자신의 이름을 기록의 가장 앞에 남겼습니다.",
      text: "희생은 깨끗한 결말이 아닙니다. 남은 사람들은 당신의 선택 덕분에 계속 말할 수 있지만, 그 말의 무게도 함께 기억합니다.",
    },
  },
  openAfterglow: {
    title: "당신의 선택은 결론보다 오래 남는 질문이 되었습니다.",
    text: "기록은 정답을 보관하지 않습니다. 다음 판단이 시작될 수 있도록, 당신이 멈춘 자리의 온도를 보관합니다.",
  },
  seasonRecord: {
    sent: "피날레를 마치면 이 회차의 시즌 기록이 이름 없이 온라인 랭킹으로 전송됩니다. 데이터 제공 동의를 켜기 전에 마친 사건이 있는 회차는 랭킹에 오르지 않습니다.",
    notSent: "데이터 제공 동의가 꺼져 있어, 피날레를 마쳐도 이 회차의 시즌 기록은 전송되지 않고 온라인 랭킹에도 오르지 않습니다. 이 기기의 순위 기록에는 남습니다.",
    beatTable: "지금 판 규칙이 생기기 전에 마친 사건이 있어, 피날레를 마쳐도 이 회차의 시즌 기록은 온라인 랭킹에 오르지 않습니다. 이 기기의 순위 기록에는 남습니다.",
  },
  // 「당신의 세 장면」 (threeScenes.js): the heading by count, and each scene's case.
  threeScenes: {
    heading: "당신의 {count} 장면",
    counts: ["", "한", "두", "세"],
    cases: { prologue01: "프롤로그 01", case48: "사건 48", final: "마지막 사건" },
  },
};
export default endingCopy;

localizeTables("screens", { ending: endingCopy });
