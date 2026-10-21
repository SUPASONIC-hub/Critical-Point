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
import { getSeasonRound } from "./appConfig.js";

const HARM = easyResourceLabels.humanCost;
const percent = (share) => Math.round(share * 100);

// One analyst, three things that analyst remembers longest. They used to be
// three careers (a branch desk, the strategy team, a regulator), and two of
// them were not the analyst every prologue writes. The only thing the pick
// changes is where 프롤로그 01's numbers start (getOriginStartEffects), so
// `start` says that and nothing more.
const operatorProfiles = {
  courier: {
    id: "courier",
    label: "SITE VISIT",
    title: "현장을 본 분석관",
    premise: "서류의 숫자보다 그 숫자 뒤에서 일하는 사람들을 가장 오래 기억합니다.",
  },
  lab: {
    id: "lab",
    label: "DISSENT",
    title: "반대 의견서를 쓴 분석관",
    premise: "모두가 맞다고 한 숫자에 혼자 아니라고 적었던 일을 가장 오래 기억합니다.",
  },
  public: {
    id: "public",
    label: "ON RECORD",
    title: "기록을 남긴 분석관",
    premise: "적어 두지 않은 판단은 아무 데도 남지 않는다는 것을 가장 오래 기억합니다.",
  },
};

const startLine = (origin) => Object.entries(getOriginStartEffects(origin))
  .filter(([, value]) => value !== 0)
  .map(([key, value]) => `${easyResourceLabels[key]} ${value > 0 ? "+" : "−"}${Math.abs(value)}`)
  .join(" · ");
const withStart = (profile) => ({ ...profile, start: startLine(profile.id) });

export function getOperatorProfiles() {
  return Object.values(operatorProfiles).map(withStart);
}

export function getOperatorProfile(origin = "courier") {
  return withStart(operatorProfiles[origin] ?? operatorProfiles.courier);
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
  return { ...base, newGamePlus: newGamePlus ? "지난 시즌의 결말을 이 화면에서 다시 볼 수 있습니다" : "최종 기록을 완료하면 NEW GAME+ 해금" };
}

// The steps described the decision board the gauntlet table replaced on
// 2026-09-14: read, compare the listed costs, confirm. Nothing said that a
// card is staked and pushed, or that there is a wall.
export function getTutorialSteps() {
  return [
    { id: "read", label: "장면 읽기", text: "상황과 화자, 질문을 읽습니다. 읽는 시간은 점수에 들어가지 않습니다." },
    { id: "weigh", label: "카드 걸기", text: "카드 한 장을 골라 겁니다. 카드마다 얻는 것과 치르는 것이 다릅니다." },
    { id: "commit", label: "밀기와 확정", text: "밀수록 열기와 배율이 오릅니다. 보이지 않는 벽에 닿기 전에 확정하면 판돈이 쌓이고, 사건을 닫으면 금고로 갑니다." },
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

const VETERAN_TABLE_LINE = "NEW\u00a0GAME+는 프롤로그 01부터 모든 규칙이 켜지고, 도구도 더 일찍 받습니다.";

/**
 * The start screen's NEW GAME+ panel (NEWGAMEPLUS 문구 질문 9-10, all (1)):
 * the season number from the second season on, and how the last finished
 * season ended. The sentence is written when the season is counted
 * (newGamePlusCarry.getMemoryLine) and kept in the record's `last.line`, so
 * the entry chunk, which had no room, carries neither the sentence's rules nor
 * the record's reader: it reads the stored line and the season number
 * (`getSeasonRound`, appConfig.js). `round` is the saved run's season number,
 * which the continue card prints too; the intro view has no room for a field
 * of its own; the panel's head is written in IntroScreen, with its English
 * name marked as English. A device with only the NEW GAME+ memory keeps the
 * old line.
 */
export function getPastRunMemory(memory = {}, record = null, runId = null) {
  const entries = Object.entries(memory ?? {}).filter(([, value]) => value?.outcomeChoiceId);
  const line = typeof record?.last?.line === "string" ? record.last.line : null;
  if (entries.length === 0 && !line) return null;
  const round = getSeasonRound(record, runId, memory);
  const [caseId] = entries.at(-1) ?? [];
  return {
    round,
    // What a NEW GAME+ table is, said as a fact (문구 질문 17, user's answer of
    // 2026-10-21 evening): measured beside a plain season it collapses as often
    // (22.8% / 22.0%) and banks a little more, so "harder" is not said.
    text: `${line ?? `이전 기록에서 CASE ${caseDisplayCode(caseId)}의 마지막 선택을 남겼습니다. 이번에는 그 결과를 바꿀 수 있습니다.`} ${VETERAN_TABLE_LINE}`,
  };
}

export function getOriginPrologue(origin = "courier") {
  const profiles = {
    courier: { title: "11명의 공장", text: "당신이 가장 오래 기억하는 것은 수습 마지막 과제의 온새포장입니다. 서류 한 장 뒤에 직원 11명의 11월이 걸려 있었습니다." },
    lab: { title: "반대 의견서를 쓴 밤", text: "당신이 가장 오래 기억하는 것은 혼자 쓴 반대 의견서입니다. 시작은 수습 마지막 과제에서 합계에 들어가지 않은 4,000만 원짜리 한 줄이었습니다." },
    public: { title: "비워 둔 서명란", text: "당신이 가장 오래 기억하는 것은 속도 칸 하나만 채워지고 서명란이 빈 수습 평가표입니다. 그날부터 당신은 판단을 적어 둡니다." },
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
 * It used to call any row with a run id "RUN VERIFIED", but the run id is
 * written by the same client that writes the score. The label says what is
 * true: the row is tied to one run. The sentence says what the server does
 * with a season (validate_telemetry_insert, *_ranking_suspicion_marks): it
 * takes one only when every case row is there and was spread over the time a
 * season takes, and marks -- does not refuse -- one whose score, rank, times
 * or walls do not add up. DRAFT copy (2026-10-14), for the user to decide.
 */
export function getRankingIntegrity(entry = {}) {
  const summary = entry.summary ?? {};
  return {
    valid: Boolean(entry.runId && entry.completedAt && summary.rank),
    label: entry.runId ? "RUN LINKED" : "RUN ID MISSING",
    text: entry.runId ? "한 플레이로 묶인 기록입니다. 공개 랭킹은 모든 사건 기록이 15분 이상에 걸쳐 서버에 도착한 시즌만 받고, 점수·등급·시간이 맞지 않는 기록은 서버에 따로 표시해 둡니다." : "플레이 식별자가 없어 임시 로컬 기록으로 처리됩니다.",
  };
}
