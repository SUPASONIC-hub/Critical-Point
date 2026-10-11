/**
 * What the screen before a run reads: the analyst's three origins, the line
 * about the way of playing, the season's goals, and what a ranking row is
 * called. This is in the entry chunk, so it holds only that. What a run in
 * progress and its report read is in runtimeSystems.js, which arrives with the
 * runtime.
 */
import { caseDisplayCode } from "./gameCases.js";
import { ENDING_GATES } from "./gameConstants.js";
import { easyResourceLabels, objectParticle } from "./playerLanguage.js";

const HARM = easyResourceLabels.humanCost;
const percent = (share) => Math.round(share * 100);

const operatorProfiles = {
  courier: {
    id: "courier",
    label: "BRANCH DESK",
    title: "지점 창구 출신 분석관",
    authority: "현장 기록을 가장 먼저 보고, 고객에게 사실을 직접 전달할 권한",
    premise: "창구에서 판 대출이 어떻게 끝나는지를 끝까지 본 사람이 몇 없었습니다. 당신이 그중 하나입니다.",
  },
  lab: {
    id: "lab",
    label: "CREDIT REVIEW",
    title: "기업금융전략팀 출신 분석관",
    authority: "심사 기준과 검증 절차를 조정할 권한",
    premise: "승인 서류에 반대 의견을 한 줄 쓴 대가로 이 지하 분석실에 배치됐습니다.",
  },
  public: {
    id: "public",
    label: "PUBLIC AUDITOR",
    title: "금융감독 출신 파견 분석관",
    authority: "기록의 공개 범위와 피해 보호 순서를 조정할 권한",
    premise: "감독기관에서 이 그룹을 검사하다가, 그룹 안으로 자리를 옮겨 같은 기록을 다시 봅니다.",
  },
};

export function getOperatorProfiles() {
  return Object.values(operatorProfiles);
}

export function getOperatorProfile(origin = "courier") {
  return operatorProfiles[origin] ?? operatorProfiles.courier;
}

/**
 * The line under the season panel about the way of playing the player picked.
 * It says what the pick is -- a stance the player declares, which no rule of
 * the table reads -- and what NEW GAME+ gives, which is last season's record
 * on this screen. It used to promise choices, quests and endings the pick
 * unlocked (under two ids the picker does not offer), and "hidden choices"
 * from a past run; nothing in the game deals either.
 */
export function getPlayStyleUnlocks(playStyle = "instinct", newGamePlus = false) {
  const styles = {
    instinct: { label: "INSTINCT", unlock: "첫 반응으로 정하겠다는 다짐" },
    auditor: { label: "AUDIT", unlock: "근거를 확인하고 정하겠다는 다짐" },
    mediator: { label: "MEDIATE", unlock: "대화로 압박을 낮추겠다는 다짐" },
  };
  const base = styles[playStyle] ?? styles.instinct;
  return { ...base, newGamePlus: newGamePlus ? "지난 시즌의 마지막 선택을 이 화면에서 다시 볼 수 있습니다" : "최종 기록을 완료하면 NEW GAME+ 해금" };
}

export function getTutorialSteps() {
  return [
    { id: "read", label: "장면 읽기", text: "상황, 화자, 이번 장면의 한계를 확인합니다." },
    { id: "weigh", label: "대가 비교", text: "선택지의 자원 변화와 관계 영향을 비교합니다." },
    { id: "commit", label: "기록 확정", text: "선택을 확정하면 다음 장면과 랭킹에 남습니다." },
    { id: "replay", label: "다시 보기", text: "다른 기록은 다른 권한과 엔딩을 엽니다." },
  ];
}

export function getSeasonGoals() {
  return [
    // Read from the ending's gates, in the labels the chips print. These were
    // six-case numbers ("단서 5개") and a 관계 퀘스트 the game never counted.
    { id: "protect", label: "PROTECT SEASON", text: `사건마다 ${HARM}${objectParticle(HARM)} 평균 ${ENDING_GATES.collapseHarmPerCase} 아래로 닫고 시즌 완료` },
    { id: "evidence", label: "EVIDENCE SEASON", text: `사건 기록의 ${percent(ENDING_GATES.clueRate)}% 이상 열기` },
    { id: "trust", label: "TRUST SEASON", text: `${easyResourceLabels.trust}${objectParticle(easyResourceLabels.trust)} 사건마다 평균 ${ENDING_GATES.oversightTrust} 이상으로 지키기` },
  ];
}

export function getPastRunMemory(memory = {}) {
  const entries = Object.entries(memory ?? {}).filter(([, value]) => value?.outcomeChoiceId);
  if (entries.length === 0) return null;
  const [caseId] = entries.at(-1);
  return { label: "PAST RUN MEMORY", text: `이전 기록에서 CASE ${caseDisplayCode(caseId)}의 마지막 선택을 남겼습니다. 이번에는 그 결과를 바꿀 수 있습니다.` };
}

export function getOriginPrologue(origin = "courier") {
  const profiles = {
    courier: { title: "창구 마감이 늦어진 밤", text: "당신은 창구에서 직접 판 대출이 어떻게 끝나는지를 끝까지 본 사람입니다. 그 기억이 첫 번째 권한을 열었습니다." },
    lab: { title: "반대 의견을 쓴 밤", text: "당신은 승인 서류에 혼자 반대 의견을 썼고, 다음 인사에서 이 지하로 내려왔습니다. 3년이 지나 같은 번호의 파일이 책상에 올라옵니다." },
    public: { title: "검사 자료를 덮은 밤", text: "당신은 감독기관에서 이 그룹을 검사하다 안쪽으로 자리를 옮겼습니다. 공개 권한은 크지만, 보호해야 할 사람도 함께 늘어납니다." },
  };
  return profiles[origin] ?? profiles.courier;
}

export function getOriginStartEffects(origin = "courier") {
  return {
    courier: { capital: 4, trust: 4, legitimacy: 0, fatigue: 0 },
    lab: { capital: 0, trust: 1, legitimacy: 5, fatigue: 2 },
    public: { capital: -2, trust: 0, legitimacy: 8, fatigue: 3 },
  }[origin] ?? { capital: 0, trust: 0, legitimacy: 0, fatigue: 0 };
}

export function getRankingLeague(style = "FIELD DECIDER") {
  if (style.includes("RISK")) return "RISK LEAGUE";
  if (style.includes("BOARD")) return "REFRAME LEAGUE";
  if (style.includes("SYSTEM")) return "SYSTEM LEAGUE";
  return "FIELD LEAGUE";
}

/**
 * Whether a ranking row is well formed: a run id, a completion time, a rank.
 * It used to call any row with a run id "RUN VERIFIED", but nothing on the
 * server checks a run -- the id is written by the same client that writes the
 * score. The label says what is true: the row is tied to one run.
 */
export function getRankingIntegrity(entry = {}) {
  const summary = entry.summary ?? {};
  return {
    valid: Boolean(entry.runId && entry.completedAt && summary.rank),
    label: entry.runId ? "RUN LINKED" : "RUN ID MISSING",
    text: entry.runId ? "한 플레이로 묶인 기록입니다. 서버 검증은 없습니다." : "플레이 식별자가 없어 임시 로컬 기록으로 처리됩니다.",
  };
}
