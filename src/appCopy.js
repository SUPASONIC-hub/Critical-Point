import {
  AlertTriangle,
  BarChart3,
  BriefcaseBusiness,
  Clock3,
  Shield,
  Users,
} from "lucide-react";
import { easyResourceLabels } from "./playerLanguage.js";

/**
 * Presentation copy and per-case content tables.
 * Data only — no state, no behaviour — so screens can import it directly.
 */

export const GAME_TITLE = "TRIGGERLAB: CRITICAL POINT";
export const GAME_TITLE_READING = "트리거랩";
/**
 * The subtitle names the genre, because nothing else on the screen does.
 *
 * "판단이 깊어지는 순간" described a mood and left the reader to guess whether
 * this was a novel, a quiz or a management sim. The title is a threshold and the
 * loop is a 45-second window in which somebody has to be charged for the
 * decision, so the subtitle says that.
 */
export const GAME_SUBTITLE = "45초마다 당신의 판단 기준이 기록된다";

export const resourceMeta = {
  time: { label: easyResourceLabels.time, suffix: "시간", icon: Clock3 },
  capital: { label: easyResourceLabels.capital, suffix: "", icon: BriefcaseBusiness },
  trust: { label: easyResourceLabels.trust, suffix: "", icon: Users },
  legitimacy: { label: easyResourceLabels.legitimacy, suffix: "", icon: Shield },
  humanCost: { label: easyResourceLabels.humanCost, suffix: "", icon: AlertTriangle },
  fatigue: { label: easyResourceLabels.fatigue, suffix: "", icon: BarChart3 },
};

export const playStyleOptions = [
  {
    id: "instinct",
    label: "감각형",
    title: "첫 반응을 믿는다",
    text: "전술 정보를 덜 보고 장면의 온도와 사람의 반응으로 결정합니다.",
    payoff: "직관 챌린지 보너스 강화",
  },
  {
    id: "auditor",
    label: "감사형",
    title: "근거를 끝까지 확인한다",
    text: "비용과 위험을 펼쳐 본 뒤, 설명 가능한 선택을 밀어붙입니다.",
    payoff: "전술 챌린지 보너스 강화",
  },
  {
    id: "mediator",
    label: "중재형",
    title: "대화로 압박을 낮춘다",
    text: "에코의 힌트와 관계의 맥락을 활용해 손실을 분산합니다.",
    payoff: "에코 힌트 비용 절감",
  },
];



export const operatorBriefs = {
  case01: {
    movement: "트리거랩 분석실 → 플로우온 물류 현장",
    reason: "첫 사건의 운영 데이터를 실제 이해관계자의 언어로 확인하기 위해",
  },
  case02: {
    movement: "플로우온 현장 → 트리거랩 보안 감사실",
    reason: "현장에서 남긴 보호와 공개의 기준이 내부 기록에 어떻게 반영됐는지 확인하기 위해",
  },
  case03: {
    movement: "트리거랩 감사실 → 고객사 입찰실",
    reason: "복원한 기록이 속도와 경쟁 압박 속에서도 판단 기준으로 남는지 시험하기 위해",
  },
  case04: {
    movement: "고객사 입찰실 → 트리거랩 운영 검토실",
    reason: "성과를 위해 허용한 예외가 서비스 이용자에게 어떤 비용으로 돌아가는지 확인하기 위해",
  },
  case05: {
    movement: "트리거랩 운영 검토실 → 현장 복구 통제실",
    reason: "규칙과 예외가 반복될 때 누가 책임을 떠안는지 직접 확인하기 위해",
  },
  case06: {
    movement: "현장 복구 통제실 → 트리거랩 4층 분석관실",
    reason: "바깥 기관에 적용해 온 판단 기준이 자기 조직의 동료에게도 그대로 서는지 확인하기 위해",
  },
  final: {
    movement: "트리거랩 4층 분석관실 → 트리거랩 기록 보관소 B2",
    reason: "여섯 사건에 남은 반응 패턴과, 이제 자기 이름이 걸린 프로필을 함께 검토하기 위해",
  },
};

export const chapterRules = {
  case01: { label: "현금과 사람", rule: "살아남는 속도보다 누구의 내일을 먼저 지킬지 결정합니다.", authority: "지급 순서와 공개 기준을 제안" },
  case02: { label: "증거와 보호", rule: "기록을 보존하면서도 증언자의 말할 권리를 지켜야 합니다.", authority: "접근 권한과 증언 절차를 조정" },
  case03: { label: "속도와 장기비용", rule: "가장 빠른 답이 가장 싼 실패를 뜻하지는 않습니다.", authority: "경쟁안의 평가 기준을 재설계" },
  case04: { label: "예외와 책임", rule: "성과를 위해 허용한 예외에는 반드시 이름과 종료 조건이 필요합니다.", authority: "예외 승인 조건과 감시 범위를 제안" },
  case05: { label: "규칙과 복구", rule: "반복을 막는 규칙이 현장의 피해를 키우지 않는지 확인합니다.", authority: "중단·복구·책임 배분 순서를 조정" },
  case06: { label: "동료와 기록", rule: "옆자리 사람에게도 같은 기준을 세울 수 있는지 확인합니다.", authority: "내부 인사 자료의 공개 범위를 제안" },
  final: { label: "관찰과 선택", rule: "이제 사건이 아니라 당신의 반응 패턴이 실험의 대상입니다.", authority: "실험 데이터의 공개·폐기·계승을 선택" },
};

export const legacyProfiles = {
  S: {
    label: "CLEAR SIGNAL",
    title: "이전 판단의 신뢰가 다음 사건을 받칩니다.",
    text: "직전 케이스에서 기준을 끝까지 설명해 냈습니다. 다음 사건은 작은 신뢰와 정당성을 품고 시작합니다.",
    effect: { trust: 4, legitimacy: 3 },
  },
  A: {
    label: "STABLE HAND",
    title: "이전 판단의 균형이 남아 있습니다.",
    text: "대부분의 압박을 통제했습니다. 다음 사건은 약간의 신뢰와 정당성을 가진 채 열립니다.",
    effect: { trust: 2, legitimacy: 1 },
  },
  B: {
    label: "UNFINISHED COST",
    title: "해결되지 않은 비용이 다음 사건으로 넘어왔습니다.",
    text: "사건은 통과했지만 설명되지 않은 손실이 남았습니다. 다음 사건은 피로를 안고 시작합니다.",
    effect: { fatigue: 2 },
  },
  C: {
    label: "OPEN WOUND",
    title: "지난 판단의 균열이 아직 닫히지 않았습니다.",
    text: "압박을 낮추지 못한 흔적이 다음 사건의 첫 질문이 됩니다. 정당성과 피로가 불리하게 출발합니다.",
    effect: { legitimacy: -2, fatigue: 4 },
  },
};

export const nextCaseSignals = {
  case01: {
    eyebrow: "NEXT CASE UNLOCKED",
    caseId: "case02",
    title: "사건 02 - 가짜 신호",
    button: "사건 02 시작",
    premise:
      "동료가 내부 정보 유출자로 지목됩니다. 증거는 명확하지만, 사람의 맥락은 다른 이야기를 합니다.",
    hook:
      "트리거랩은 방금 당신이 손실을 누구에게 먼저 배분했는지 기록했습니다. 다음 사건에서는 그 기준이 사람을 믿을지, 기록을 믿을지의 압박으로 바뀝니다.",
  },
  case02: {
    eyebrow: "NEXT CASE UNLOCKED",
    caseId: "case03",
    title: "사건 03 - 경쟁자의 반격",
    button: "사건 03 시작",
    premise:
      "오진우와 같은 자료를 받고 동시에 해결안을 냅니다. 이번에는 경쟁심이 판단을 빠르게 만드는지, 얕게 만드는지 확인합니다.",
    hook:
      "당신이 증거와 신뢰 사이에서 망설인 시간은 다음 테스트의 난이도가 됩니다. 오진우는 그 망설임을 점수판으로 바꿔 보여줄 것입니다.",
  },
  case03: {
    eyebrow: "NEXT CASE UNLOCKED",
    caseId: "case04",
    title: "사건 04 - 치러야 할 대가",
    button: "사건 04 시작",
    premise:
      "작은 규칙 위반이 수천 명을 살릴 수 있습니다. 이번에는 좋은 결과가 절차 훼손을 어디까지 정당화하는지 묻습니다.",
    hook:
      "경쟁 압박 속에서 당신이 줄인 검증과 남긴 근거가 분리됩니다. 다음 사건은 좋은 결과를 얻기 위해 어느 선까지 넘을 수 있는지 묻습니다.",
  },
  case04: {
    eyebrow: "NEXT CASE UNLOCKED",
    caseId: "case05",
    title: "사건 05 - 범인은 없었다",
    button: "사건 05 시작",
    premise:
      "명백한 악인은 없습니다. 모두가 합리적으로 움직였지만 시스템은 가장 조용한 사람들을 밀어냈습니다.",
    hook:
      "명분 있는 예외를 허용한 기록은 사라지지 않습니다. 다음 사건에서는 누구도 규칙을 어기지 않았는데도 피해가 생깁니다.",
  },
  case05: {
    eyebrow: "NEXT CASE UNLOCKED",
    caseId: "case06",
    title: "사건 06 - 같은 방의 사람",
    button: "사건 06 시작",
    premise:
      "경쟁 분석관 오진우가 사흘째 출근하지 않습니다. 이번 조사 대상은 바깥 기관이 아니라 당신 옆자리입니다.",
    hook:
      "악인이 없는 실패를 통과한 기준은 그대로 남습니다. 다음 사건은 그 기준을 당신이 아는 사람에게 적용할 수 있는지 묻습니다.",
  },
  case06: {
    eyebrow: "FINAL CASE UNLOCKED",
    caseId: "final",
    title: "마지막 사건 - 트리거랩의 진실",
    button: "마지막 사건 시작",
    premise:
      "모든 사건의 로그가 하나의 폴더로 연결됩니다. 이제 트리거랩이 당신의 사고 조건을 어떻게 사용했는지 마주합니다.",
    hook:
      "악인이 없는 실패까지 통과한 뒤, 남는 것은 사건이 아니라 당신의 반응 패턴입니다. 마지막 폴더에는 그 패턴이 사건 설계에 쓰인 흔적이 있습니다.",
  },
};

/**
 * The beat between two cases, keyed by the case that just closed.
 *
 * Six cases of the same register is a hard read: every scene is a 45-second
 * window with someone's job in it, and the report screen went straight from the
 * rank to the next crisis. These sit on the report with no bet, no clock and no
 * choice -- the one place in the season where the analyst is a person who ate
 * something, got a text back, or stood in a corridor. They also carry the
 * threads the cases cannot: 이민서 after 사건 02, 오진우 well before 사건 06.
 */
const seasonInterludes = {
  case01: {
    mood: "warm",
    label: "막간 · 새벽 4시",
    title: "야간조 반장이 컵라면을 하나 더 뜯었다",
    text: "그는 아무 말도 묻지 않고 뜨거운 물을 부어 당신 앞에 놓았습니다. 삼 분을 같이 기다리는 동안 둘 다 아무 말도 하지 않았고, 그게 그날 가장 편한 삼 분이었습니다. 나가는 길에 그가 딱 한 마디 했습니다. '다음에 올 때는 낮에 오세요. 여기 낮에는 사람 사는 데 같습니다.'",
  },
  case02: {
    mood: "quiet",
    label: "막간 · 퇴근길",
    title: "이민서에게서 문자가 한 통 왔다",
    text: "'그날 응급실 접수증 사진, 혹시 필요하시면 보낼게요.' 그리고 30분 뒤에 한 통 더. '아니요, 필요 없으실 것 같아서요. 그냥 제가 갖고 있을게요.' 답장을 뭐라고 써야 할지 몰라서, 당신은 지하철 두 정거장을 지나칠 때까지 화면만 보고 있었습니다.",
  },
  case03: {
    mood: "wry",
    label: "막간 · 자판기 앞",
    title: "오진우가 농담을 했다. 안 웃겼다",
    text: "그는 커피 두 개를 뽑아 하나를 내밀며 말했습니다. '아까 발표, 제 쪽 폰트가 더 좋았습니다.' 당신이 아무 반응을 안 하자 그는 조금 당황한 얼굴로 덧붙였습니다. '농담입니다.' 그러고는 자기 커피를 들고 먼저 갔습니다. 그가 농담을 시도한 건 이번이 처음이었습니다.",
  },
  case04: {
    mood: "grief",
    label: "막간 · 온새 사무실",
    title: "삐뚤빼뚤한 글씨의 편지가 도착했다",
    text: "돌봄 서비스를 받던 이용자가 보낸 손편지였습니다. 맞춤법이 여러 군데 틀렸고, 마지막 줄은 '고맙습니다'가 아니라 '안 끊겨서 다행이에요'였습니다. 현장 담당자는 그 편지를 코팅해서 벽에 붙였습니다. 당신은 그 벽 앞에서 한참 서 있었습니다.",
  },
  case05: {
    mood: "still",
    label: "막간 · 통제실 소등 후",
    title: "의자 하나가 끝까지 비어 있었다",
    text: "복구 통제실의 불을 끄고 나오는데, 맨 끝 자리 의자가 책상 밖으로 조금 빠져 있었습니다. 누가 급하게 일어선 자리입니다. 경비원이 문을 잠그며 말했습니다. '저 자리 주인은 사흘째 안 나옵니다. 다른 층 사람이라던데.' 당신은 그때 그 말을 흘려들었습니다.",
  },
  case06: {
    mood: "wry",
    label: "막간 · 회사 앞 포장마차",
    title: "반재욱이 술을 샀다. 그는 원래 안 마신다",
    text: "그는 소주 한 병을 시켜놓고 자기 잔은 채우지 않았습니다. 수첩도 펴지 않았습니다. 한참 뒤에 그가 말했습니다. '나는 사람을 믿는 걸 일로 만들지 않으려고 이 직업을 골랐습니다.' 그리고 잔을 당신 쪽으로 밀었습니다. '오늘은 실패했습니다.'",
  },
};

/**
 * The next-case panel is the season's only case-to-case seam, and the one place
 * a player can be told they are about to change buildings. `operatorBriefs` has
 * carried that move and the reason for it since the copy was written and nothing
 * ever read the table, so the report announced "사건 02" with no hint that it
 * happens in a different organisation from the one just left. Merged here rather
 * than in the runtime so the copy keeps one home.
 */
for (const [finishedCaseId, signal] of Object.entries(nextCaseSignals)) {
  Object.assign(signal, operatorBriefs[signal.caseId]);
  signal.interlude = seasonInterludes[finishedCaseId] ?? null;
}

export const playGuideItems = [
  {
    title: "에코",
    text: "정답을 주는 사람이 아니라, 방금 선택에서 빠진 점을 알려주는 도우미입니다.",
  },
  {
    title: "판 바꾸기",
    text: "보기 중 마음에 드는 답이 없을 때 사람, 조건, 순서를 직접 새로 정합니다.",
  },
  {
    title: "상태 변화",
    text: "선택 뒤에 달라지는 시간, 현금, 믿음, 공정함, 사람 피해, 지침을 보여줍니다.",
  },
  {
    title: "반응 버튼",
    text: "당신이 특히 오래 고민하거나 쉽게 움직이는 마음의 지점입니다. 다음 사건에도 영향을 줍니다.",
  },
];

export const triggerLabSignals = {
  case01: "관찰 항목: 손실 배분 순서, 보호 대상, 공개 지연 허용선",
  case02: "관찰 항목: 로그 신뢰도, 관계 신뢰도, 절차 밖 확인 허용선",
  case03: "관찰 항목: 경쟁 상황의 검증 생략, 속도 보상 반응, 점수판 민감도",
  case04: "관찰 항목: 좋은 결과를 위한 예외 허용선, 기록 은폐 저항, 공개 감사 선호",
  case05: "관찰 항목: 단일 책임 욕구, 구조 실패 인내, 조용한 피해자 감지",
  case06: "관찰 항목: 동료 보호와 기록 사이의 선택, 내부 고발 저항, 자기 노출 허용선",
  final: "관찰 항목: 자기 조건 인식, 프로필 공개 범위, 시스템 존치 허용선",
};
