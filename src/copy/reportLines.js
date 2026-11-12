import { localizeTables } from "../locale.js";

/**
 * The report's lines the runtime writes before the result screen draws them
 * (state/useResultReport.js and viewModels/reportViewModels.js): the rank's
 * line, the score's parts, the badges, the season's standing, the decision
 * pace, the feedback questions and the tab's title, read by key so another
 * language can be laid over them (src/locale.js, 다국어 틀). The Korean is the
 * modules' own, moved here unchanged. A table of its own rather than the
 * screen's (src/copy/result.js, src/copy/report.js): these are read in the
 * runtime's chunk, the screen's words only in the result screen's.
 * `createEndingProfile`'s three framings are the finale's and stay with it.
 */
const reportLinesCopy = {
  rankLines: {
    S: "생각 리듬, 관점 전환, 압박 회복이 동시에 솟았습니다.",
    A: "정답을 고른 것이 아니라, 압박 속에서 판단 패턴이 선명하게 드러났습니다.",
    B: "사건은 통과했습니다. 다음 플레이에서는 다른 생각 방식으로 흔들어볼 여지가 있습니다.",
  },
  rankLineFallback: "사건은 통과했지만 버스트 신호는 아직 약합니다. 즉답보다 근거, 비용, 회복 경로를 더 남겨보세요.",
  bridge: {
    longest: "{trigger} 압박이 가장 오래 남았고, \"{title}\"에서 판단 시간이 길어졌습니다.",
    plain: "{trigger} 압박이 가장 오래 남았습니다.",
  },
  feedback: {
    longest: "{title}에서 실제로 멈칫한 이유가 있었나요?",
    longestFallback: "가장 오래 머문 장면",
    reframed: "판을 다시 짜서 열린 경로가 보기에 없던 길처럼 느껴졌나요?",
    notReframed: "구조 재설계를 쓰지 않았다면, 기존 선택지가 충분히 답처럼 보였나요?",
    nextCase: "다음 사건 「{title}」까지 이어서 보고 싶은 이유가 생겼나요?",
    finale: "최종 선택이 트리거랩의 실험 구조와 자연스럽게 연결됐나요?",
  },
  rationaleClues: "단서 {count}",
  standing: {
    clear: "붕괴선 아래",
    near: "붕괴선 가까움",
    over: "붕괴선 넘음",
    harm: "시즌 평균 {harmLabel} {perCase} / {gate} · 터진 판 {bustPercent}%",
    overreach: "시즌 평균 {harmLabel} {perCase} / {gate} · 터진 판 {bustPercent}% / {bustGate}%",
    harmCase: "{caseLabel} 다시 도전 · {harmLabel} {harm}",
    // 개선 포인트 C3 (2026-11-05 초안): the sentence after the line when the
    // season's cases closed on a mean cash under the start and harm under the
    // line (createSeasonStandingReadout `held`). A season that lost money but
    // kept people reads as that, not as a loss.
    held: "{capitalLabel}{capitalParticle} 평균 {capital}까지 내려갔지만 {harmLabel}{harmParticle} 붕괴선 아래입니다.",
  },
  // C3: the sentence after an ending's own line on the finale, by the ending,
  // printed only on that same season (`endingHeld`). SYSTEM COLLAPSE is over
  // the line and PROFITABLE SILENCE kept its cash, so neither has one.
  heldEndings: {
    "open-oversight": "현금을 잃었지만 진 것이 아니라, 사람 피해를 선 아래에 두고 기준을 남긴 시즌입니다.",
    "evidence-reform": "현금을 잃었지만 진 것이 아니라, 사람 피해를 선 아래에 두고 공개와 보호의 규칙을 남긴 시즌입니다.",
    "human-record": "현금을 잃었지만 진 것이 아니라, 사람 피해를 선 아래에 두고 이름들을 남긴 시즌입니다.",
    "cold-justice": "현금을 잃었지만 진 것이 아니라, 사람 피해를 선 아래에 두고 절차를 지킨 시즌입니다.",
    "field-pact": "현금을 잃었지만 진 것이 아니라, 사람 피해를 선 아래에 두고 사람들의 약속을 남긴 시즌입니다.",
    "quiet-cover": "현금을 잃었지만 진 것이 아니라, 사람 피해를 선 아래에 두고 조용히 닫은 시즌입니다.",
    "open-question": "현금을 잃었지만 진 것이 아니라, 사람 피해를 선 아래에 두고 질문을 넘긴 시즌입니다.",
  },
  // C3-4 (1), 2026-11-11: the paragraph after the ending's own on the finale
  // when its last answer was 폭로 (f_after_witness) on a held season
  // (`endingWitness`). The ending is the same one; only its words grow.
  witnessHeld: "마지막에 당신은 폭로를 골랐습니다. 현금은 줄었고 점수에도 남지 않지만, 사람 피해를 선 아래에 둔 채 숨긴 기록을 밖으로 꺼냈습니다. 이 시즌이 이긴 자리는 숫자 밖에 있습니다.",
  // C2-1 (1), 2026-11-11: the finale's line on the ending the season came
  // closest to and did not reach (src/nearestEnding.js), by what it lacked.
  // {label} in a gap is the resource's own word (easyResourceLabels).
  nearest: {
    line: "가장 가까웠던 다른 결말: {ending}까지 {gaps}",
    gaps: {
      trust: "{label} {value} 모자람",
      legitimacy: "{label} {value} 모자람",
      capital: "{label} {value} 모자람",
      trustOver: "{label} {value} 넘침",
      clues: "단서 {value}개 모자람",
      reframes: "판 다시 짜기 {value}번 모자람",
      coldGap: "{legitimacy}{particle} {trust}보다 {value} 더 높아야 함",
      pactGap: "{trust}{particle} {legitimacy}보다 {value} 더 높아야 함",
    },
    burn: "마지막에 봉인을 골라, 기록이 남아야 열리는 결말(OPEN OVERSIGHT · EVIDENCE REFORM · HUMAN RECORD)은 이번 시즌 닫혀 있었습니다.",
  },
  score: {
    points: "{score}점",
    penalty: "-{score}점",
    none: "없음",
    consistency: { label: "기준 유지", note: "열기가 올라간 장면에서도 같은 방향을 지켰는지 봅니다. 버스트 점수에서 가장 큰 몫입니다." },
    rhythm: { label: "생각 리듬", note: "즉답이나 방치가 아니라, 압박을 읽고 결론까지 밀어낸 시간대입니다. 점수 비중은 가장 작습니다." },
    cognition: { label: "관점 전환", note: "같은 방식만 반복하지 않고 추론, 위험, 재구성, 버티기 사이를 오간 흔적입니다." },
    pressureAdapt: { label: "압박 대응", note: "위험을 무조건 피한 점수가 아니라, 상승한 압박을 다시 회수한 능력입니다." },
    reading: { label: "판 읽기", note: "같은 판을 벽이 보이는 사람이 쳤다면 번 금고에 견줘, 이번 사건에서 번 몫입니다(「벽을 본 사람의 N%」)." },
    reflection: { label: "구조 재설계", note: "판을 다시 짜 숨은 경로를 열고, 장면 챌린지를 맞히고, 숨은 기록을 찾아낸 정도입니다." },
    exploit: { label: "즉답 패널티", note: "읽지 않고 판을 열어 바로 누르는 플레이가 반복될 때만 감점됩니다." },
  },
  // The badges' texts; their titles are English already and are the list's keys.
  badges: {
    burst: "생각 버스트 {score}점을 기록했습니다.",
    boardBreaker: "선택지 밖에서 판을 다시 짰습니다.",
    routeFollower: "주어진 선택지 안에서 비용을 비교했습니다.",
    slowThinker: "한 장면 이상에서 판단을 오래 붙잡았습니다.",
    fastCloser: "빠르게 결론을 닫는 플레이를 보였습니다.",
    riskCutter: "{count}번 위험 압력을 낮췄습니다.",
    heatTaker: "위험을 낮추기보다 다른 목표를 우선했습니다.",
    challengeClear: "{count}개 장면 도전을 달성했습니다.",
    openQuest: "장면 도전은 남았고, 선택 로그만 기록됐습니다.",
    perfectRun: "{count}연속 장면 목표를 맞혀 최고 보상을 열었습니다.",
    streak: "{count}연속 장면 목표를 맞혀 추가 보상을 열었습니다.",
    chainStarter: "장면 목표를 연속으로 맞히면 추가 보상이 열립니다.",
    flowSurge: "{count}번 보너스 자원 회복을 만들었습니다.",
    noSurge: "챌린지와 위험 제어가 아직 보너스로 이어지지 않았습니다.",
    crisisRunner: "높은 압력 상태로 사건을 통과했습니다.",
    pressureKeeper: "위험 압력을 통제 가능한 범위에 묶었습니다.",
  },
  pace: {
    same: "앞의 {count}번도 뒤의 {count}번도 평균 {last}초 만에 골랐습니다.",
    faster: "뒤의 {count}번은 평균 {last}초 만에 골랐습니다. 앞의 {count}번은 {first}초였습니다.",
    slower: "뒤의 {count}번은 평균 {last}초를 들여 골랐습니다. 앞의 {count}번은 {first}초였습니다.",
  },
  // The finale's ruling as the report frames it (createEndingProfile), by the finale's last choice.
  endingProfiles: {
    ending_seal: {
      tag: "봉인",
      title: "당신은 문을 닫았지만, 흔적은 남겼다.",
      text: "데이터를 봉인해 다시 이용되지 않게 했습니다. 그러나 마지막 후폭풍에서 고른 태도는 당신이 지키려는 것이 침묵인지 안전인지 드러냈습니다.",
    },
    ending_reform: {
      tag: "개혁",
      title: "당신은 실험을 규칙으로 바꾸었다.",
      text: "트리거를 없애는 대신 동의와 감시를 붙였습니다. 사람을 읽는 힘을 누가, 언제, 어디까지 쓸 수 있는지 직접 정했습니다.",
    },
    ending_expose: {
      tag: "폭로",
      title: "당신은 관찰자를 세상 밖으로 끌어냈다.",
      text: "실험의 구조를 공개했습니다. 혼란은 시작됐지만, 적어도 다음 참가자는 자신이 관찰당하고 있다는 사실을 알고 선택할 수 있습니다.",
    },
    open: {
      tag: "미확정",
      title: "당신의 마지막 선택은 아직 기록 중이다.",
      text: "마지막 폴더의 문장이 완전히 닫히지 않았습니다. 다음 플레이에서는 다른 결말의 조건을 시험해 보십시오.",
    },
  },
};
export default reportLinesCopy;

localizeTables("screens", { reportLines: reportLinesCopy });
