import { CASE_SEQUENCE } from "./gameCases.js";
import { ENDING_GATES } from "./gameConstants.js";
import { isPeopleFirstEffect } from "./gameLogic.js";
import { easyResourceLabels, objectParticle, subjectParticle } from "./playerLanguage.js";
import { getOperatorProfile } from "./advancedSystems.js";
import { getSeasonStanding } from "./seasonStanding.js";



export function getOperatorReveal({ origin = "courier", completedCases = [] } = {}) {
  const count = completedCases.length;
  if (count < 2) return { level: 0, title: "OPERATOR FILE / SEALED", text: "주인공의 과거 권한은 아직 봉인되어 있습니다." };
  // The origin is a key (`courier`); the profile holds what it is called.
  const who = getOperatorProfile(origin).title;
  if (count < 4) return { level: 1, title: "OPERATOR FILE / PARTIAL", text: `${who}${subjectParticle(who)} 단순 관찰자가 아니라 기준을 설계한 인물이었다는 흔적이 남습니다.` };
  return { level: 2, title: "OPERATOR FILE / OPENED", text: "당신은 사건을 처리하는 사람인 동시에, 자동 추천이 고른 다음 사건에 '추천대로'를 눌러 온 사람 가운데 하나였습니다. 승인자 칸은 늘 비어 있었습니다." };
}

/**
 * What the season left behind, months after the last night.
 *
 * `getEndingVariant` resolves nine endings. Eight have an epilogue here, and
 * OPEN QUESTION closes on the fallback, which is written for it -- once, only
 * four had one, and five seasons in nine closed on a line that knew nothing
 * about the run. Each follows the same shape: the season's own places and
 * people first, the analyst second, the door the next participant walks
 * through last. Counts are read off the season, not written into the copy.
 *
 * They are written from the season the finale closes, not from its first six
 * cases: 트리거랩 was dissolved in 사건 24, so no epilogue may say it stands,
 * and the people they name are where `characterRoleSpans` puts them after
 * 사건 25 (윤상혁 removed and sentenced, 이민서 at KD데이터랩, the analyst at
 * KD캐피탈). The fixed facts -- 1,740명, the 31 still 확인 불가, 63명 -- are
 * docs/canon.md's.
 */
const NUMBERED_CASES = CASE_SEQUENCE.filter((caseId) => /^case\d+$/.test(caseId)).length;

export function getEndingEpilogue(endingId = "open-question") {
  const epilogues = {
    "open-oversight":
      "반년 뒤, 그룹 인사평가 별첨 서식 7호가 없어집니다. 63명은 자기 반응 기록을 가장 먼저 열어 봅니다. 문가을은 1,740명 소송의 원고 대표로 열람 위원 자리에 앉습니다. 첫 회의 자료 맨 앞 장은 당신이 3년 전에 쓴 반대 의견입니다. 이번에는 서명란에 이름이 있습니다. 다음 분석관은 빈칸이 아니라 이름이 적힌 서식을 물려받습니다.",
    "evidence-reform":
      "공개와 보호가 한 절차로 묶였습니다. 이민서는 KD데이터랩에서 63명에게 자기 기록을 돌려주는 일을 맡습니다. 첫 봉투는 제주의 선우진에게 갑니다. 봉투마다 어떤 기록이 들었는지는 에코가 읽기 쉬운 말로 옮깁니다. 당신의 로그도 그 봉투들 사이에 있습니다. 밖에 내기 전에 당사자에게 먼저 묻는다는 한 줄이 규정이 됩니다. 다음 사건은 공개된 기록이 아니라, 아직 아무도 묻지 않은 기록에서 시작합니다.",
    "human-record":
      "반년 뒤, 가을떡방 냉장고 문에 31명의 이름이 붙어 있습니다. '확인 불가' 옆에 문가을이 한 사람씩 적어 넣은 이야기입니다. 도윤하는 1,740명을 처음 적은 수첩을 그 옆에 둡니다. 당신이 다시 짠 판들도 그 이야기들과 함께 보관소에 남습니다. 다음 참가자의 첫 단서는 정답이 아니라 이 이름들입니다.",
    "profitable-silence":
      "장부는 살아남았습니다. KD캐피탈의 분기 실적은 좋고, 윤상혁의 항소심 기사는 경제면 맨 아래로 내려갑니다. 가을떡방 단체방에는 당신에게 보낸 문자가 읽지 않은 채 쌓입니다. 33층 인사기획의 당신 이름 옆에는 '조용히 성과를 내는 사람'이라는 한 줄이 붙습니다. 다음 분석관은 그 한 줄을 본보기로 받습니다.",
    "cold-justice":
      "절차는 한 줄도 어긋나지 않았습니다. 윤상혁의 항소심도, 1,740명의 배상 기준도 서류대로 갑니다. 다음 해 추석, 가을떡방 찜기 앞에 당신 자리는 없습니다. 문가을의 문자도 오지 않습니다. 당신의 보고서는 모두 통과했지만, 고맙다고 말하는 사람은 없습니다. 다음 분석관은 완벽한 규정집과 아무도 말을 걸지 않는 자리를 함께 물려받습니다.",
    "field-pact":
      "공식 승인보다 사람의 약속이 먼저 움직였습니다. 헌책방 골목에 남았던 사람들이 단체방 하나로 묶였습니다. 도윤하의 창구, 김 반장의 공장, 문가을의 떡방이 잠긴 기록 몇 개를 여는 길이 됩니다. 그 길은 문서가 아니라 당신의 연락처에 있습니다. 당신이 그 방을 나가면 길도 함께 닫힙니다. 다음 사람은 처음부터 사람을 찾아다녀야 합니다.",
    "quiet-cover":
      "반년이 지나도 바뀐 것은 없습니다. 윤상혁은 항소심을 기다리고, 31명은 여전히 '확인 불가'입니다. 당신은 KD캐피탈 위험관리부 자리로 돌아가 평소처럼 서류를 넘깁니다. B2의 단말은 꺼졌고, 에코의 파형을 다시 켜는 사람은 없습니다. 당신이 열지 않은 문 뒤의 기록은 다음 사람을 기다립니다.",
    collapse:
      `${NUMBERED_CASES}개 사건 가운데 여러 건이 정상화되지 못한 채 닫혔습니다. 회사가 버틸 때 사람들 몫으로 붙어 있던 것부터 거둬졌습니다. 강태민이 잃는 것 칸에 적은 야간 수당, 권도현이 서명의 값에 더한 가족 학자금 지원이 먼저였습니다. 남은 것은 기록뿐이고, 그 기록의 서명란에는 당신 이름도 없습니다. 다음 분석관은 그 빈칸에서 다시 시작합니다.`,
  };
  return (
    epilogues[endingId] ||
    "당신이 닫지 못한 질문은 폴더에 그대로 남았습니다. 다음 분석관은 답이 아니라 그 질문에서 사건을 시작합니다."
  );
}

/**
 * PEOPLE FIRST counts the season's decisions whose largest gain went to the
 * people in the scene (`isPeopleFirstEffect`). It used to match
 * /protect|people|witness|person/ on the choice id -- and generated scenes are
 * `<scene>_choice_N`, so every choice in a scene called `c1_witness` counted --
 * and it read only the case on screen, whose log the next case clears. Closed
 * cases now carry their count in their summary; the case being played is
 * counted from its log. The bar is three such decisions a case, across the
 * season: a player who leads with people clears it, one who weighs everything
 * evenly about half the time, and nobody by accident.
 */
const PEOPLE_FIRST_PER_CASE = 3;

export function getAchievementProgress({ log = [], completedCases = [], caseResults = {} } = {}) {
  const closed = caseResults ?? {};
  const peopleFirst =
    Object.values(closed).reduce((sum, summary) => sum + (Number(summary?.peopleFirstCount) || 0), 0) +
    log.filter((entry) => entry && !entry.isSystemEvent && !closed[entry.caseId] && isPeopleFirstEffect(entry.effect)).length;
  // The two season-shaped goals read the sequence, so a new case cannot leave a
  // badge that says 6/6 while the season has seven cases in it.
  return [
    { id: "people-first", label: "PEOPLE FIRST", value: peopleFirst, goal: PEOPLE_FIRST_PER_CASE * CASE_SEQUENCE.length },
    { id: "full-audit", label: "FULL AUDIT", value: Object.keys(closed).length, goal: CASE_SEQUENCE.length },
    { id: "route-keeper", label: "ROUTE KEEPER", value: completedCases.length, goal: CASE_SEQUENCE.length - 1 },
  ].map((item) => ({ ...item, unlocked: item.value >= item.goal }));
}

/**
 * What the next season has to do differently, from the gate that closed this
 * one. It promised a hidden choice for fewer investigations and a later rival
 * for protecting a witness -- neither exists. Each line now names the collapse
 * gate (`ENDING_GATES`) and nothing the game does not do.
 */
export function getFailureRecovery(ending = {}, resources = {}) {
  if (!ending.failure) return null;
  const harm = easyResourceLabels.humanCost;
  const { collapseHarmPerCase, collapseBustRate, collapseOverreachHarm } = ENDING_GATES;
  const key = ending.cause?.id ?? (Number(resources.humanCost) > 0 ? "harm" : "overreach");
  const text = key === "overreach"
    ? `다음 시즌에는 벽에 닿은 판을 전체의 ${Math.round(collapseBustRate * 100)}% 아래로 줄이거나, 사건마다 ${harm}${objectParticle(harm)} 평균 ${collapseOverreachHarm} 아래로 닫으면 무너지지 않습니다.`
    : `다음 시즌에는 사건마다 ${harm}${objectParticle(harm)} 평균 ${collapseHarmPerCase} 아래로 닫으면 무너지지 않습니다.`;
  return { key, title: "RECOVERY ROUTE", text };
}

/** What a season that collapsed is marked with on the result card (improvement note C6). */
export const COLLAPSED_SEASON_MARK = "붕괴한 시즌";

/**
 * What a collapse cost, in the words the collapse panel prints under its
 * ending (improvement note C4). Only what the season's summaries hold: the
 * case that closed on the most harm, as `getSeasonStanding` lists it, with its
 * label, title and the harm it closed on. The season's mean harm is not
 * repeated here; the report prints it beside this (`getFailureCause`).
 * A season over the line on the table's harm alone has no closed case to
 * name, and its toll is the first and last sentence.
 *
 * @param {{ caseResults?: Record<string, any>, resources?: Record<string, any>, cases?: Array<{ id: string, label: string, title: string }> }} [input]
 */
export function getCollapseToll({ caseResults = {}, resources = {}, cases = [] } = {}) {
  const harm = easyResourceLabels.humanCost;
  const [worst] = getSeasonStanding({ caseResults, resources }).harmCases;
  const named = worst && cases.find((caseItem) => caseItem.id === worst.caseId);
  return [
    `${harm}${subjectParticle(harm)} 감당할 수 있는 선을 넘은 것으로 기록되었습니다.`,
    named && `가장 큰 피해가 난 곳은 ${named.label} 「${named.title}」입니다. 그 사건 하나가 ${harm} ${worst.harm}${objectParticle(String(worst.harm))} 남겼습니다.`,
    "그 값은 장부가 아니라, 당신의 판단을 기다리던 사람들이 치렀습니다.",
  ].filter(Boolean).join(" ");
}

export function getOperationsSnapshot({ errors = [], pending = [], rankings = [], caseResults = {} } = {}) {
  return { errorCount: errors.length, pendingCount: pending.length, rankingCount: rankings.length, completedCount: Object.keys(caseResults).length, state: errors.length ? "ACTION REQUIRED" : pending.length ? "QUEUE ACTIVE" : "HEALTHY" };
}
