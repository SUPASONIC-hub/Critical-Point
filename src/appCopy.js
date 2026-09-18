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



const operatorBriefs = {
  case01: {
    movement: "트리거랩 지하 분석실 → 플로우온 물류 현장",
    reason: "3년 전 반대 의견을 냈던 그 대출이 실제로 어떻게 무너지는지 두 눈으로 확인하기 위해",
  },
  case02: {
    movement: "플로우온 현장 → 트리거랩 보안 감사실",
    reason: "현장에서 들고 나온 심사 보고서 원본이 왜 하루 만에 유출 사건으로 바뀌었는지 확인하기 위해",
  },
  case03: {
    movement: "트리거랩 감사실 → 세움테크 입찰장",
    reason: "플로우온에서 난 손실이 어느 회사 장부로 옮겨지는지, 그 통로를 직접 보기 위해",
  },
  case04: {
    movement: "세움테크 입찰장 → 온새 운영 검토실",
    reason: "은행이 앞당긴 상환 일정이 돌봄 현장에서 몇 퍼센트로 나타나는지 확인하기 위해",
  },
  case05: {
    movement: "온새 운영 검토실 → 돌봄 배차 복구 통제실",
    reason: "아무도 규칙을 어기지 않았는데 312명이 밀려난 경로를 끝까지 따라가기 위해",
  },
  case06: {
    movement: "복구 통제실 → 트리거랩 4층 분석관실",
    reason: "바깥 기관에 적용해 온 기준이 여덟 걸음 떨어진 동료에게도 그대로 서는지 확인하기 위해",
  },
  case07: {
    movement: "트리거랩 4층 → 감사팀 서고 → 강서지점 → 회기동 헌책방",
    reason: "48시간 뒤면 닫히는 열람 권한으로, 종이에만 남은 것들을 마지막으로 모으기 위해",
  },
  case08: {
    movement: "트리거랩 4층 → 강원 영동지점 → 경포 해온 펜션 → 청담동 갤러리 온",
    reason: "좌천된 창구에서 발견한 계좌 하나가 누구의 욕망으로 이어지는지, 청산 등기 전에 끝까지 따라가기 위해",
  },
  case09: {
    movement: "영동지점 → 여의도 → 플로우온 채권단 회의실 → 풀필먼트센터",
    reason: "처음 무너진 그 회사를 이번에는 살리면서, 무너뜨린 사람의 계산서도 같은 테이블에 올리기 위해",
  },
  case10: {
    movement: "강서 이음병원 → 강서지점 4번 창구 → 인사위원회실 → 회기동 헌책방 2층",
    reason: "이긴 판의 청구서가 누구 앞으로 왔는지 확인하고, 한 사람이 들고 있던 명단을 부서지지 않는 구조로 옮기기 위해",
  },
  final: {
    movement: "트리거랩 4층 → 기록 보관소 B2 → 본사 33층",
    reason: "열 사건의 반응 기록이 어떤 서식으로 정리됐는지, 그리고 그 서식을 주문한 사람이 누구인지 확인하기 위해",
  },
};

export const chapterRules = {
  case01: { label: "현금과 사람", rule: "살아남는 속도보다 누구의 내일을 먼저 지킬지 결정합니다.", authority: "지급 순서와 공개 기준을 제안" },
  case02: { label: "증거와 보호", rule: "기록을 보존하면서도 증언자의 말할 권리를 지켜야 합니다.", authority: "접근 권한과 증언 절차를 조정" },
  case03: { label: "속도와 장기비용", rule: "가장 빠른 답이 가장 싼 실패를 뜻하지는 않습니다.", authority: "경쟁안의 평가 기준을 재설계" },
  case04: { label: "예외와 책임", rule: "성과를 위해 허용한 예외에는 반드시 이름과 종료 조건이 필요합니다.", authority: "예외 승인 조건과 감시 범위를 제안" },
  case05: { label: "규칙과 복구", rule: "반복을 막는 규칙이 현장의 피해를 키우지 않는지 확인합니다.", authority: "중단·복구·책임 배분 순서를 조정" },
  case06: { label: "동료와 기록", rule: "옆자리 사람에게도 같은 기준을 세울 수 있는지 확인합니다.", authority: "내부 인사 자료의 공개 범위를 제안" },
  case07: { label: "부탁과 대가", rule: "도움을 받는 일에는 언제나 받는 사람이 아닌 쪽의 값이 붙습니다.", authority: "누구의 이름을 문서에 올릴지 제안" },
  case08: { label: "흔적과 복수", rule: "분노는 추적을 빠르게 하지만, 증거는 분노보다 오래 버텨야 합니다.", authority: "흔적표를 어디에 쓸지 제안" },
  case09: { label: "구제와 신상필벌", rule: "회사를 살리는 계산과 사람을 벌하는 계산은 한 테이블에 올라가야 둘 다 설명됩니다.", authority: "회생안과 고발의 순서를 제안" },
  case10: { label: "선의와 지속", rule: "한 사람의 집념으로 버티는 일은 반드시 그 사람과 함께 끝납니다.", authority: "명단을 제도로 옮길 범위와 담당자를 제안" },
  final: { label: "이름과 서명란", rule: "이제 사건이 아니라 당신의 반응 기록이 인사 서류의 별첨입니다.", authority: "실험 데이터의 공개·폐기·계승을 선택" },
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
      "당신이 열람을 신청한 심사 보고서 원본이 하룻밤 만에 '유출 사건'이 됩니다. 지목된 사람은 재계약을 2주 앞둔 계약직입니다.",
    hook:
      "당신이 그 대출의 서명란을 들여다본 건 어제 오후였습니다. 오늘 아침 그 서류는 증거물이 되었고, 열람 기록은 다른 사람 이름으로 정리돼 있습니다.",
  },
  case02: {
    eyebrow: "NEXT CASE UNLOCKED",
    caseId: "case03",
    title: "사건 03 - 경쟁자의 반격",
    button: "사건 03 시작",
    premise:
      "세움테크 입찰에서 오진우와 같은 자료로 겨룹니다. 이 공사 대금이 어느 손실을 지우는 데 쓰이는지는 아무도 말해 주지 않습니다.",
    hook:
      "기록과 사람 사이에서 당신이 머문 시간은 그대로 점수가 됐습니다. 다음 판의 배점표는 입찰이 아니라 두 사람을 비교하려고 만들어졌습니다.",
  },
  case03: {
    eyebrow: "NEXT CASE UNLOCKED",
    caseId: "case04",
    title: "사건 04 - 치러야 할 대가",
    button: "사건 04 시작",
    premise:
      "돌봄 4,200명이 걸린 심사에서 점수가 딱 3% 모자랍니다. 그 3%를 만든 건 온새가 아니라 은행이 앞당긴 상환 일정입니다.",
    hook:
      "손실은 사라지지 않고 옮겨 다닙니다. 입찰장에서 지워진 숫자가 이번에는 돌봄 시간 3%로 나타납니다.",
  },
  case04: {
    eyebrow: "NEXT CASE UNLOCKED",
    caseId: "case05",
    title: "사건 05 - 범인은 없었다",
    button: "사건 05 시작",
    premise:
      "312명이 방문 서비스를 받지 못했습니다. 아무도 규정을 어기지 않았고, 규정의 맨 위에는 사람 대신 예산 상한선이 있습니다.",
    hook:
      "당신이 그은 예외의 선은 사라지지 않습니다. 다음 사건에서 그 선은 배차 시스템의 가중치가 되어 가장 조용한 사람들부터 밀어냅니다.",
  },
  case05: {
    eyebrow: "NEXT CASE UNLOCKED",
    caseId: "case06",
    title: "사건 06 - 같은 방의 사람",
    button: "사건 06 시작",
    premise:
      "가중치표를 6분 만에 넘긴 최종 검토자가 사흘째 출근하지 않습니다. 이름은 오진우이고, 자리는 당신에게서 여덟 걸음입니다.",
    hook:
      "책임자를 세우는 방식은 조직의 습관입니다. 이번에는 그 습관이 당신이 매일 얼굴을 보던 사람에게 적용됩니다.",
  },
  case06: {
    eyebrow: "NEXT CASE UNLOCKED",
    caseId: "case07",
    title: "사건 07 - 되갚는 자리",
    button: "사건 07 시작",
    premise:
      "위원회가 끝난 다음 날 아침, 발령서가 도착합니다. 징계가 아니라 인사이므로 사유도 이의 절차도 없습니다. 48시간 뒤면 파일은 여기 남고 당신은 240km 밖에 있습니다.",
    hook:
      "옆자리 사람의 조건을 확인한 사람은 다음 차례가 됩니다. 이번에는 당신이 묻는 쪽이 아니라 부탁하는 쪽입니다.",
  },
  case07: {
    eyebrow: "NEXT CASE UNLOCKED",
    caseId: "case08",
    title: "사건 08 - 돈의 흔적",
    button: "사건 08 시작",
    premise:
      "강원 영동지점 부임 9일째. 오래 거래가 끊긴 회사 계좌 하나가 분기마다 자문료를 받아 같은 날 서울의 갤러리로 보냅니다. 그 회사는 72시간 뒤 청산됩니다.",
    hook:
      "사람은 욕망을 갖고, 욕망은 돈을 쓰고, 돈은 흔적을 남깁니다. 당신을 240km 밖으로 보낸 사람은 하필 그 흔적이 지나가는 창구로 당신을 보냈습니다.",
  },
  case08: {
    eyebrow: "NEXT CASE UNLOCKED",
    caseId: "case09",
    title: "사건 09 - 두 장의 손익계산서",
    button: "사건 09 시작",
    premise:
      "플로우온이 다시 72시간 앞에 섰습니다. 이번 안건은 청산입니다. 청산을 밀어붙이는 은행의 대표 심사역은 창업주의 장남입니다.",
    hook:
      "흔적은 사람을 벌할 수 있습니다. 사람을 살리려면 다른 계산서가 필요합니다. 그 계산서의 절반은 당신이 도우려는 사람이 쥐고 있고, 그는 동정을 받지 않습니다.",
  },
  case09: {
    eyebrow: "NEXT CASE UNLOCKED",
    caseId: "case10",
    title: "사건 10 - 멈추지 못하는 사람",
    button: "사건 10 시작",
    premise:
      "회사는 살았고 장부를 부풀린 사람들은 법정에 섰습니다. 열흘 뒤, 그 판을 끝까지 밀었던 사람이 응급실로 실려 갑니다.",
    hook:
      "선의는 이 조직의 장부 어디에도 지출로 잡히지 않습니다. 잡히지 않는 비용은 줄어들지도 않습니다. 이번 사건은 그 청구서가 누구 앞으로 오는지 묻습니다.",
  },
  case10: {
    eyebrow: "FINAL CASE UNLOCKED",
    caseId: "final",
    title: "마지막 사건 - 빈 서명란",
    button: "마지막 사건 시작",
    premise:
      "열 사건의 기록이 하나의 폴더로 모입니다. 그 폴더의 관리자 계정은 3년 전 서명란을 비워 둔 사람의 것입니다.",
    hook:
      "애정이었는지, 복수였는지, 책임이었는지. 무엇이 당신을 멈추지 않고 생각하게 만드는지 이제 압니다. 마지막 폴더에는 그 조건과, 그 조건을 설계한 사람의 이름이 함께 있습니다.",
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
 * threads the cases cannot: 이민서 after 사건 02, 임경수 who holds the paper
 * original, 오진우 well before 사건 06.
 */
const seasonInterludes = {
  case01: {
    mood: "warm",
    label: "막간 · 새벽 4시",
    title: "야간조 반장이 컵라면을 하나 더 뜯었다",
    text: "그는 아무것도 묻지 않고 뜨거운 물을 부어 당신 앞에 놓았습니다. 삼 분을 같이 기다리는 동안 둘 다 말이 없었고, 그게 그날 가장 편한 삼 분이었습니다. 나가는 길에 그가 딱 한 마디 했습니다. '다음에 올 때는 낮에 오세요. 여기 낮에는 사람 사는 데 같습니다.'",
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
    text: "그는 커피 두 개를 뽑아 하나를 내밀며 말했습니다. '아까 발표, 제 쪽 글씨체가 더 좋았습니다.' 당신이 아무 반응을 안 하자 그는 조금 당황한 얼굴로 덧붙였습니다. '농담입니다.' 그러고는 자기 커피를 들고 먼저 갔습니다. 그가 농담을 시도한 건 이번이 처음이었습니다.",
  },
  case04: {
    mood: "grief",
    label: "막간 · 온새 사무실",
    title: "삐뚤빼뚤한 글씨의 편지가 도착했다",
    text: "돌봄을 받던 이용자가 보낸 손편지였습니다. 맞춤법이 여러 군데 틀렸고, 마지막 줄은 '고맙습니다'가 아니라 '안 끊겨서 다행이에요'였습니다. 현장 담당자는 그 편지를 코팅해서 벽에 붙였습니다. 당신은 그 벽 앞에서 한참 서 있었습니다.",
  },
  case05: {
    mood: "still",
    label: "막간 · 헌책방 2층",
    title: "임경수가 종이 한 장을 내밀었다",
    text: "퇴직한 전 심사팀장은 헌책방 2층에서 옛 서류를 정리하며 지냅니다. 그는 커피도 권하지 않고 종이 한 장을 밀어 놓았습니다. 3년 전 심사 보고서의 뒷장, 전산에는 없는 페이지입니다. '전산은 고치면 그만이지만 종이는 태워야 해. 그런데 태운 자리는 표가 나거든.' 그리고 덧붙였습니다. '자네 의견서, 내가 마지막으로 읽은 사람이야.'",
  },
  case07: {
    mood: "warm",
    label: "막간 · 새벽 5시 20분",
    title: "역 앞 국밥집이 한 시간 일찍 열었다",
    text: "06시 40분 기차를 앞두고 역 앞을 지나는데 국밥집 불이 켜져 있었습니다. 주인이 말했습니다. '첫차 손님 때문에 일찍 엽니다. 다들 어디로 가는지는 안 물어봐요.' 당신은 국밥 한 그릇을 다 먹고, 표를 주머니에 넣은 채 가게를 나왔습니다. 어느 쪽으로 걸을지는 그때까지도 정하지 않았습니다.",
  },
  case08: {
    mood: "wry",
    label: "막간 · 영동지점 숙직실",
    title: "지점장이 가자미 사진을 서른 장 보여 줬다",
    text: "숙직실 전기장판 위에서 나준혁 지점장이 휴대폰 사진첩을 넘깁니다. 전부 같은 방파제, 같은 각도, 같은 크기의 가자미입니다. '이게 다 다른 날이에요.' 당신이 구분을 못 하자 그는 진심으로 서운해했습니다. 사진이 끝날 무렵 그가 말했습니다. '본점 사람이 여기 와서 이렇게 오래 앉아 있는 건 처음 봐요. 다들 금방 올라가던데.'",
  },
  case09: {
    mood: "warm",
    label: "막간 · 결혼식 5주 전",
    title: "권도현이 축가를 부탁했다",
    text: "결의가 끝나고 한 달 뒤, 권도현에게서 메시지가 왔습니다. '축가 부를 사람이 없습니다. 오진우는 음치고 반재욱 씨는 거절했습니다.' 노래를 못 한다고 답하자 곧바로 답장이 왔습니다. '압니다. 계산해 봤는데, 그래도 당신이 제일 덜 손해입니다.' 같이 온 좌석표 사진에는 혼주석 옆 작은아버지 자리가 비어 있었고, 맨 끝 원탁에 '강태민 외 10명'이라고 적혀 있었습니다.",
  },
  case10: {
    mood: "warm",
    label: "막간 · 분담표 3주차",
    title: "나준혁이 오징어순대를 보내왔다",
    text: "분담표가 돌기 시작한 지 3주째, 사무실로 아이스박스가 하나 도착했습니다. 보낸 사람은 나준혁, 내용물은 오징어순대 여섯 인분과 손글씨 쪽지 한 장입니다. '여섯 칸이니까 여섯 인분입니다. 강태민 씨 건 두 배로 넣었어요. 야간조는 많이 먹어야 해요.' 이민서가 그날 처음으로 정시에 퇴근했고, 오진우는 자기 몫을 냉장고에 넣어 두고 이틀 뒤에 먹었습니다.",
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

/**
 * What 에코 says as a case opens. It lived in `GameRuntime` as a ternary chain
 * that stopped at 사건 06, so 사건 07 opened on 사건 01's line. A table keyed by
 * case cannot fall behind the season the same way without a missing key showing.
 */
export const caseIntroEchoes = {
  case01: "얼마나 똑똑한지는 묻지 않겠습니다. 대신 언제 생각을 멈추지 못하는지 보겠습니다.",
  case02: "이번 사건의 핵심은 증거와 신뢰의 충돌입니다. 에코는 당신이 무엇을 믿고 싶은지와 무엇을 증명할 수 있는지를 분리해서 묻습니다.",
  case03: "이번 사건의 핵심은 경쟁 압박입니다. 에코는 당신이 이기려는 순간 무엇을 덜 검증하는지 추적합니다.",
  case04: "이번 사건의 핵심은 명분 있는 위반입니다. 에코는 좋은 결과가 규칙 훼손을 어디까지 정당화하는지 묻습니다.",
  case05: "이번 사건의 핵심은 악인이 없는 실패입니다. 에코는 책임자를 찾고 싶은 충동과 구조를 끝까지 보려는 사고를 분리해 묻습니다.",
  case06: "이번 사건의 핵심은 옆자리입니다. 에코는 바깥 조직에 쓰던 기준을 아는 사람에게도 세울 수 있는지 묻습니다.",
  case07: "이번 사건의 핵심은 부탁입니다. 에코는 당신이 도움을 받을 때 그 값을 누구에게 지우는지 계산합니다.",
  case08: "이번 사건의 핵심은 복수심입니다. 에코는 분노가 당신을 얼마나 빨리 생각하게 만드는지, 그리고 어디서 선을 넘게 만드는지 함께 잽니다.",
  case09: "이번 사건의 핵심은 사람을 살리는 계산입니다. 에코는 애정이 계산서가 될 때 무엇이 남고 무엇이 빠지는지 묻습니다.",
  case10: "이번 사건의 핵심은 지속 가능성입니다. 에코는 당신의 선의가 몇 개월치 연료인지, 그리고 그 연료가 떨어졌을 때 누가 남는지 잽니다.",
  final: "마지막 사건입니다. 에코는 더 이상 조언자처럼 말하지 않습니다. 당신의 조건이 어떻게 사용됐는지 직접 묻습니다.",
};

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
  case07: "관찰 항목: 부탁의 허용선, 타인의 비용 계산, 자기 이름을 거는 조건",
  case08: "관찰 항목: 복수심의 추적 속도, 함정 허용선, 가족 명의 추적 저항",
  case09: "관찰 항목: 사적 연대의 계산 방식, 보상 요구, 구제와 처벌의 동시 수행",
  case10: "관찰 항목: 소진 인지 시점, 선의의 제도화 허용선, 규정 밖 대상에 대한 처리",
  final: "관찰 항목: 자기 조건 인식, 프로필 공개 범위, 시스템 존치 허용선",
};
