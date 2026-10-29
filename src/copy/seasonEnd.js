import { localizeTables } from "../locale.js";

/**
 * The season's end as the report reads it (runtimeSystems.js): each
 * ending's scene and name, the ending preview, why a season collapsed and
 * what would have held it, the authority review, the aftermath and the
 * carried-over cases, read by key so another language can be laid over them
 * (src/locale.js, 다국어 틀). The Korean is runtimeSystems.js's, moved here
 * unchanged; a word followed by its particle is a `{particle}` blank.
 */
const seasonEndCopy = {
  // Each ending's scene (`getEndingSceneProfile`); its location is English already.
  scenes: {
    "open-oversight": { cue: "여러 개의 기록 창이 동시에 열립니다.", choice: "모든 참가자에게 기준 편집 권한을 넘긴다" },
    "evidence-reform": { cue: "감사 화면과 보호 명부가 한 화면에 겹칩니다.", choice: "공개와 보호를 함께 운영 규칙으로 고정한다" },
    "human-record": { cue: "당신이 다시 짠 판이 증언자의 목소리와 겹쳐 재생됩니다.", choice: "다음 분석관에게 사람의 이름부터 전달한다" },
    "profitable-silence": { cue: "박수 소리 뒤에서 기록 잠금음이 들립니다.", choice: "수익 보고서에 침묵의 비용을 추가한다" },
    "cold-justice": { cue: "완벽한 절차표 옆에 비어 있는 의자가 남습니다.", choice: "절차에 관계 회복 단계를 추가한다" },
    "field-pact": { cue: "공식 승인 전 현장 라디오가 먼저 응답합니다.", choice: "현장 협약을 공식 권한으로 승격한다" },
    "quiet-cover": { cue: "열기는 낮지만 잠긴 폴더가 더 많아집니다.", choice: "안전한 기록 하나를 열어 다음 단서로 삼는다" },
    collapse: { cue: "경보와 사람들의 호출이 한꺼번에 끊깁니다.", choice: "압박을 분산할 기준을 남긴다" },
    "open-question": { cue: "다음 분석관의 출입증이 천천히 켜집니다.", choice: "답 대신 가장 위험한 질문을 인계한다" },
  },
  // What each ending is called in a sentence (`ENDING_NAMES`).
  names: {
    "open-oversight": "공개와 개입",
    "evidence-reform": "증거와 개혁",
    "human-record": "사람과 기록",
    "profitable-silence": "성과와 침묵",
    "cold-justice": "절차와 책임",
    "field-pact": "현장과 협약",
    "quiet-cover": "보호와 은폐",
    collapse: "압박과 붕괴",
    "open-question": "질문과 계승",
  },
  preview: {
    unnamed: "미확정 경로",
    failure: "현재 선택 패턴이 시스템 붕괴 쪽으로 기울고 있습니다.",
    building: "현재 선택 패턴이 이 엔딩의 조건을 강화하고 있습니다.",
  },
  delayed: "CASE {code}의 마지막 선택이 다음 사건의 기준으로 남아 있습니다.",
  failureObjectives: {
    harm: "사건마다 {harm}{particle} 평균 {gate} 아래로 닫기",
    overreach: "벽에 닿은 판을 전체의 {bust}% 아래로 줄이거나, {harm}{particle} 평균 {gate} 아래로 닫기",
  },
  unnamedChoice: "이름 없는 선택",
  failureCause: {
    harm: "사건마다 {harm}{particle} 평균 {perCase}{direction} 닫혔습니다.",
    overreach: "판의 {bust}%가 벽에 닿았고, {harmLine}",
    overreachRecovery: "심박이 빨라지면 확정하십시오.",
    harmRecovery: "{harm}{particle} 줄이는 카드를 먼저 고르십시오.",
  },
  authority: {
    analyst: "분석관",
    oversight: "당신은 기록을 읽는 사람에서 종료 조건을 제안하는 사람으로 이동했습니다. 이제 권한의 결과도 책임져야 합니다.",
    level: "현재 권한은 {level}입니다. {count}개의 검증 신호와 관계 기록이 다음 심사의 근거가 됩니다.",
    nextObserver: "증거와 관계자의 믿음을 확보하십시오.",
    nextField: "공정함과 사람 피해를 함께 관리하십시오.",
    nextOversight: "공개 이후의 피해 복구까지 설계하십시오.",
    // What each authority level may do (getAuthorityProfile).
    permissions: {
      OBSERVER: ["제한 열람", "질문 요청", "관찰 기록"],
      "FIELD ACCESS": ["기록 대조", "관계자 질문", "기준 제안"],
      OVERSIGHT: ["기록 공개", "현장 개입", "실험 종료"],
    },
  },
  origins: { courier: "현장 기록의 계승", lab: "반대 의견의 계승", public: "남긴 기록의 계승" },
  originEnding: "{origin} 경로에서 '{ending}'의 결과가 다르게 읽힙니다.",
  aftermath: "{operator}의 선택 이후, '{ending}' 경로는 다음 근무자의 질문과 현장의 대응으로 이어집니다.",
};
export default seasonEndCopy;

localizeTables("screens", { seasonEnd: seasonEndCopy });
