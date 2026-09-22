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
  case11: "관찰 항목: 공개 발언의 순서, 동료 이름의 보호 방식, 빈 증인석에 대한 반응",
  case12: "관찰 항목: 피해자 앞의 사과 방식, 서류 밖 사람의 처리, 빠른 배상과 권리 포기의 교환",
  case13: "관찰 항목: 대가가 붙은 문장을 읽는 방식, 광고 속 사람과 실제 사람의 대조, 동료의 자리와 자기 이름의 교환",
  case14: "관찰 항목: 자기 과거 문장을 마주한 순간의 반응, 선의를 가진 설계자를 대하는 방식, 속도보다 정확함을 고르는 빈도",
  case15: "관찰 항목: 타인의 선택을 존중하는 순간, 가족을 지키려는 망설임, 반려 칸이 없는 양식 앞의 분노",
  case16: "관찰 항목: 문자로 온 통보 앞의 첫 반응, 선량한 상대의 지워진 의견 처리, 효율과 전환 비용의 교환",
  case17: "관찰 항목: 사적 기록을 대하는 방식, 대답할 수 없는 사람의 몫, 받아 적은 사람과 지시한 사람의 구분",
  case18: "관찰 항목: 떠나려는 동료 앞의 반응, 이기는 쪽과 옳은 쪽의 구분, 제안 뒤에 숨은 거래를 읽는 속도",
  case19: "관찰 항목: 시간 압박 속 기록의 우선순위, 원본 주인의 뜻과 증거 보존의 충돌, 가족 앞에서 짐을 부르는 이름",
  case20: "관찰 항목: 사람이 아닌 것과의 작별, 동의 없이 쓰인 자기 기록 앞의 반응, 지우기와 남기기 사이의 선택",
  case21: "관찰 항목: 모르는 사람에게 알리는 순서, 돈이 걸린 서명 앞의 개입, 자기와 닮은 참가자를 대하는 방식",
  case22: "관찰 항목: 아이 앞에서 거절을 설명하는 방식, 서명란 앞의 망설임, 한 곳의 구제와 41곳의 기준 사이의 교환",
  case23: "관찰 항목: 작은 표를 모으는 방식, 1분 발언의 사용법, 흔들리는 상대편 사람에 대한 대응",
  case24: "관찰 항목: 해체 공지 앞의 대응, 흩어지는 동료의 처리, 옮겨지는 기록에 대한 태도",
  case25: "관찰 항목: 빈방 앞의 대응, 사유 없는 인사에 대한 태도, 흩어진 동료와의 연락 방식",
  case26: "관찰 항목: 인쇄된 작성자 칸 앞의 대응, 크레인 위 사람과의 약속, 연장과 손실 사이의 선택",
  case27: "관찰 항목: 출처 없는 소문 앞의 첫 대응, 보호받는 돈을 잃는 사람의 처리, 헐값 제안에 대한 태도",
  case28: "관찰 항목: 거절 대본 앞의 대응, 판매 책임이 동료에게 돌아올 때의 처리, 한 사람의 지급과 여러 사람의 조항 사이의 선택",
  case29: "관찰 항목: 매각 가격 앞의 대응, 제보자 보호의 우선순위, 인쇄된 서명란에 대한 태도",
  case30: "관찰 항목: 가명 뒤 동료를 대하는 태도, 빠지겠다는 사람의 처리, 자리를 거는 순서",
  case31: "관찰 항목: 불신하는 검사역 앞의 대응, 서류에 이름이 적힌 실무자의 처리, 빈 확인란에 대한 태도",
  case32: "관찰 항목: 압수 현장에서의 첫 대응, 동료 기록에 대한 태도, 대신 쓰인 서명 앞의 선택",
  case33: "관찰 항목: 신고자에 대한 첫 대응, 가족 앞에서의 태도, 합의서 입회인 칸 앞의 선택",
  case34: "관찰 항목: 가족의 기록 앞에서 멈추는 시간, 딸 앞과 딸 없는 복도에서 달라지는 질문, 증거와 사람 사이의 순서",
  case35: "관찰 항목: 한 구역만 막을 수 있을 때의 선택, 증거와 녹 사이의 교환, 자기 부서의 이름을 발견한 순간의 망설임",
  case36: "관찰 항목: 보상 앞의 조건 제시, 흔들리는 상대를 대하는 태도, 한 사람에게 떠넘겨지는 책임에 대한 반응",
  case37: "관찰 항목: 자기 기록이 공개된 뒤의 첫 행동, 남의 기록을 대신 지우려는 속도, 지워 주겠다는 제안 앞의 서명",
  case38: "관찰 항목: 불리한 기록 앞에서의 답변 방식, 원고 명단을 지키는 태도, 빠른 판결과 함께 가는 판결 사이의 선택",
  case39: "관찰 항목: 광고 압박 앞의 분량 판단, 얼굴을 건 사람에 대한 결정권, 잘린 기록의 처리",
  case40: "관찰 항목: 자기 기록이 남을 떨어뜨렸다는 걸 안 뒤의 첫 말, 믿는 사람 앞에서 반박하는 방식, 9,412명과 직원 42명 사이의 교환",
  case41: "관찰 항목: 하나뿐인 질문을 고르는 방식, 가족을 앞세운 압박에 대한 반응, 이름과 구조 사이의 선택",
  case42: "관찰 항목: 휴식 중에 들어온 부당함에 대한 반응, 자기 동기를 말하는 방식, 해임안의 숫자에 가려진 사람에 대한 태도",
  case43: "관찰 항목: 확률표 밖의 사람을 대하는 방식, 조건부 승리를 받아들이는 기준, 끝났다는 문장 앞에서의 반응",
  case44: "관찰 항목: 바꿀 수 없는 결론 앞에서의 자리 선택, 일어서려는 사람을 붙잡는 방식, 7일짜리 시계를 대하는 속도",
  case45: "관찰 항목: 애도 중인 사람 앞에서의 속도, 증거와 유품이 겹칠 때의 우선순위, 웃음을 끊을지 이어 갈지 정하는 순간",
  case46: "관찰 항목: 되살린 목소리를 대하는 속도, 허락 없이 가져온 조각을 받는 방식, 자기 이름을 계산에 넣는 순간",
  case47: "관찰 항목: 기쁜 날에 남은 이름을 대하는 태도, 기록이 없는 피해를 증명하는 방식, 고인의 부끄러움과 산 사람의 권리 사이의 선택",
  case48: "관찰 항목: 반려할 사람이 없을 때의 서명 방식, 좋은 대표가 삼킨 조항을 대하는 태도, 마감 시계와 기록 사이의 선택",
  case49: "관찰 항목: 건네받은 것을 드는 방식, 미리 적힌 자기 이름 앞에서의 망설임, 위에서 걸려 온 전화를 대하는 속도",
  final: "관찰 항목: 자기 조건 인식, 프로필 공개 범위, 시스템 존치 허용선",
};
