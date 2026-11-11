import { localizeTables } from "../locale.js";

/**
 * What NEW GAME+ says of the season before (state/newGamePlusCarry.js,
 * state/secondSeason.js) and the 결말 도감's lines (state/endingBook.js), read
 * by key so another language can be laid over them (src/locale.js, 다국어 틀).
 * The Korean is those modules', moved here unchanged (as the user settled it,
 * NEWGAMEPLUS 문구 질문 and E-3, all (1)); its blanks are named. A line that
 * is written into the season record (the start screen's `last.line`, the
 * book) is written in the page's language when the runtime writes it.
 */
const seasonLinesCopy = {
  // The line under a NEW GAME+ season's first scene, by the last ruling (newGamePlusCarry.js).
  openingEchoes: {
    ending_seal: "지난 시즌의 기록은 봉인되었지만 실험은 다른 이름으로 돌아왔습니다. 이번에는 무엇을 닫을지 먼저 보겠습니다.",
    ending_reform: "지난 시즌의 기록은 사용 규칙의 기준표가 되었습니다. 이번에는 그 감시가 얼마나 버티는지 보겠습니다.",
    ending_expose: "지난 시즌의 기록은 이미 바깥에 나가 있습니다. 이번에는 무엇을 먼저 지킬지 보겠습니다.",
    collapse: "지난 시즌은 사람이 치른 값을 감당하지 못하고 멈췄습니다. 보존된 그 기록이 이번 첫 질문 옆에 놓여 있습니다.",
  },
  // The finale's comparison line (getSeasonComparison) and a case result's (getCaseComparison).
  comparison: {
    same: "지난 시즌과 같은 결말 {ending}에 다시 닿았습니다.",
    versus: "지난 시즌 {before} · 이번 시즌 {now}",
    // After either line, on a season under other table rules than the one before (in place of the same line's full stop).
    sameChanged: "지난 시즌과 같은 결말 {ending}에 다시 닿았습니다 · 판 규칙이 바뀐 뒤의 첫 시즌",
    versusChanged: "지난 시즌 {before} · 이번 시즌 {now} · 판 규칙이 바뀐 뒤의 첫 시즌",
    caseSame: "지난 시즌에도 {tag}",
  },
  // B-14(2): the line the last ruling leaves on four cases' first pages (secondSeason.js CASE_ECHOES).
  caseEchoes: {
    prologue02: {
      ending_seal: "지난 시즌의 기록은 봉인된 채 끝났습니다. 이번 의견서가 누구의 서랍에 들어가는지 보겠습니다.",
      ending_reform: "지난 시즌의 기록은 기준표로 남았습니다. 이번 의견서가 그 기준의 첫 줄이 되는지 보겠습니다.",
      ending_expose: "지난 시즌의 기록은 바깥으로 나갔습니다. 이번 의견서에 누구의 이름이 함께 실리는지 보겠습니다.",
      collapse: "지난 시즌은 사람이 치른 값 앞에서 멈췄습니다. 이번 의견서가 그 값을 먼저 적는지 보겠습니다.",
    },
    case01: {
      ending_seal: "지난 시즌의 기록은 봉인되었지만 이 폴더는 다시 열렸습니다. 이번 72시간에는 무엇을 닫을지 보겠습니다.",
      ending_reform: "지난 시즌에 남긴 기준표는 이 분석관실에 아직 닿지 않았습니다. 이번 72시간에 그 기준을 다시 세우는지 보겠습니다.",
      ending_expose: "지난 시즌에 내보낸 기록은 보호받아야 할 이름 가까이까지 번졌습니다. 이번 72시간에는 누구를 먼저 지킬지 보겠습니다.",
      collapse: "지난 시즌의 운영은 사람 피해를 감당하지 못하고 무너졌습니다. 이번 72시간에는 그 값이 누구에게 가는지 먼저 보겠습니다.",
    },
    case48: {
      ending_seal: "지난 시즌의 기록은 봉인되었지만 같은 조항은 다른 이름으로 돌아왔습니다. 이번에는 그 조항 옆에 누가 이름을 적는지 보겠습니다.",
      ending_reform: "지난 시즌의 기록은 사용 규칙의 기준표가 되었습니다. 이번에는 그 감시가 제7조까지 닿는지 보겠습니다.",
      ending_expose: "지난 시즌의 기록은 바깥에서 읽혔습니다. 이번에는 제7조를 쓴 사람들의 이름이 어디까지 번지는지 보겠습니다.",
      collapse: "지난 시즌은 사람이 치른 값을 감당하지 못하고 멈췄습니다. 이번에는 이 조항에 걸린 사람들 앞에 끝까지 서 있는지 보겠습니다.",
    },
    final: {
      ending_seal: "지난 시즌의 당신은 이 기록을 봉인했습니다. 이번에도 같은 문을 닫을지 보겠습니다.",
      ending_reform: "지난 시즌의 당신은 이 기록을 사용 규칙으로 바꿨습니다. 이번에도 같은 규칙을 고를지 보겠습니다.",
      ending_expose: "지난 시즌의 당신은 이 기록을 바깥에 내보냈습니다. 이번에도 같은 문을 열지 보겠습니다.",
      collapse: "지난 시즌은 이 자리까지 왔지만 사람이 치른 값을 감당하지 못했습니다. 이번에는 무엇을 먼저 셀지 보겠습니다.",
    },
  },
  // E-2: the grey line on a case's first page (getCaseRecall). Every tag ends on 결말, so the particle is always 로.
  recall: "지난 시즌 이 사건은 ‘{tag}’로 닫혔습니다.",
  // E-5: the shared line's tail (getSeasonCard), each part only when it is known.
  card: {
    round: "{round}회차",
    pastEnding: "지난 시즌 결말 ‘{ending}’",
    weekRule: "이번 주의 규칙 {rule}",
  },
  // E-3 결말 도감 (endingBook.js).
  book: {
    hints: {
      "open-oversight": "사건 기록의 {clue}% 이상을 열고 믿음과 공정함을 함께 높게 지킨 시즌이 닿습니다.",
      "evidence-reform": "사건 기록의 {clue}% 이상을 열고 공정함을 높게 지킨 시즌이 닿습니다.",
      "human-record": "모든 사건의 기록을 열고, 열 사건 가운데 일곱 번 이상 판을 다시 짜고, 믿음도 지킨 시즌이 닿습니다.",
      "profitable-silence": "현금은 끝까지 지켰지만 믿음이 크게 떨어진 시즌이 닿습니다.",
      "cold-justice": "공정함은 아주 높은데 믿음이 그만큼 따라오지 못한 시즌이 닿습니다.",
      "field-pact": "믿음이 공정함보다 크게 앞선 시즌이 닿습니다.",
      "quiet-cover": "기록을 절반도 열지 않았거나, 큰 위험 없이 사건을 닫아 온 시즌이 닿습니다. 피날레에서 모든 데이터를 태운 시즌도 닿습니다.",
      collapse: "사건마다 남긴 사람 피해가 평균 {harm} 이상이거나, 벽에 닿은 판이 전체의 {bust}% 이상인 채 피해가 평균 {overreach} 이상이면 시즌이 무너집니다.",
      "open-question": "어느 쪽으로도 크게 기울지 않은 시즌이 닿습니다.",
    },
    // Each ruling's way, in the words of the finale scene's memo (f_choice, finalCase.js), with its particle.
    paths: { ending_seal: "봉인하는 길을", ending_reform: "규칙을 붙이는 길을", ending_expose: "밖으로 넘기는 길을" },
    verdictWhen: "피날레 「그 칸을 닫는 방법」에서 {path} 고르고, 결말이 {endings} 가운데 하나일 때 내려집니다.",
    count: "결말 {endings}/{endingsTotal} · 판결 {verdicts}/{verdictsTotal}.",
    aimEnding: " 다음 시즌에 노려 볼 결말은 {ending}입니다. {hint}",
    aimVerdict: " 다음 시즌에 노려 볼 판결은 {verdict}입니다. {when}",
    hintVerdict: "판결 {verdict}: {when}",
  },
};
export default seasonLinesCopy;

localizeTables("screens", { seasonLines: seasonLinesCopy });
