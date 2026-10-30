import { localizeTables } from "../locale.js";
import { DELETION_REQUEST_COPY } from "../appConfig.js";
import { OPERATOR_PROFILES, ORIGIN_PROLOGUES } from "../advancedSystems.js";
import { PLAYTEST_DATA_NOTICE } from "../privacyText.js";

/**
 * The start screen (IntroScreen.jsx, with the case status words of
 * introViewModel.js and the consent sentences of useConsentToggle.js): the
 * words it prints, read by key so another language can be laid over them
 * (src/locale.js, 다국어 틀). The Korean is the screen's own, moved here
 * unchanged. `subtitle` is appCopy's GAME_SUBTITLE, the same characters: a
 * string export cannot be written over in place.
 */
const introCopy = {
  subtitle: "45초마다 당신의 판단 기준이 기록된다",
  premise:
    "3년 전 당신은 대출 승인 문서에 혼자 반대 의견을 올렸습니다. 대출은 그대로 나갔고, 당신은 미국계 자본이 최대주주인 KD금융그룹 지하의 트리거랩으로 내려왔습니다. 오늘 케이스데스크에 올라온 첫 파일에, 그때 그 대출번호가 그대로 남아 있습니다. 오래 붙잡은 조건은 다음 사건의 압력이 되어 돌아옵니다. 이야기는 그보다 조금 앞, 수습 마지막 과제에서 시작합니다.",
  startButton: "프롤로그 시작",
  briefingLink: "브리핑 먼저 보기",
  ranking: "랭킹",
  board: "게시판",
  heroAlt: "해 질 녘 고층 옥상에서 도시를 내려다보는 두 분석관의 뒷모습",
  heroCaption: "선택지는 사건을 끝내지 않는다. 다음 압박의 모양을 바꾼다.",
  confirm: {
    startOver: "저장된 진행을 지우고 첫 사건부터 새로 시작할까요? 복구 지점은 남습니다.",
    newGamePlus: "저장된 진행을 지우고 NEW GAME+로 새로 시작할까요? 복구 지점은 남습니다.",
    replaceCase: "진행 중인 사건의 선택 기록을 지우고 이 사건을 열까요? 완료한 사건의 기록은 남습니다.",
    restartCase: "이 사건을 처음부터 다시 시작할까요? 지금 판의 선택 기록은 지워집니다.",
  },
  consentLine: {
    before: "플레이 기록은 플레이테스트용으로 익명 전송됩니다. 아래 ",
    link: "데이터 저장 안내",
    after: "에서 끌 수 있습니다.",
  },
  resume: {
    saved: "저장된 진행",
    title: " · 기록 칭호 {title}",
    currentCase: "현재 사건",
    savedAt: "{time} 저장 · {count}개 판단 기록",
    progress: " · 진행률 {progress}%",
    recap: "지난 이야기",
    continue: "이어하기",
  },
  // A season number from the second on, after the resume card's title and the memory panel's name.
  round: " · {round}회차",
  stats: { cases: "사건", oneCase: "한 사건", minutes: "분 안팎", answers: "정답" },
  previousMessage: "이전 참가자가 남긴 말: “{message}”",
  setup: {
    label: "게임 시작 준비",
    title: "기록 진입 설정",
    note: "이름과 판단 프로토콜은 시작 전 언제든 바꿀 수 있습니다.",
    identity: "분석관 호출명",
    nameLabel: "분석관 이름",
    namePlaceholder: "이름을 입력하세요",
    // {game} is the English name, drawn in an element of its own.
    newGamePlus: "{game} 시작",
  },
  pastRunLabel: "NEW GAME+ 이전 기록",
  briefing: {
    title: "시작 전에 알아둘 것",
    label: "시작 전 브리핑",
    note: "첫 사건의 상황과 판단 흐름을 먼저 확인한 뒤 플레이 조건을 고릅니다.",
    firstCase: "첫 사건",
    watch: "관찰 목표",
    watchTitle: "멈추지 못하는 지점",
    next: "다음 압박",
    nextTitle: "기록은 다음 사건으로 이동한다",
    nextText: "프롤로그에서 남긴 것이 3년 뒤 사건 01의 첫 장면을 정합니다.",
  },
  playStyle: {
    title: "어떤 방식으로 판단할까요?",
    label: "플레이 스타일 선택",
    note: "고른 방식은 내 다짐으로 기록됩니다. 판의 규칙을 바꾸는 스토리 모드는 편의 설정에 있습니다.",
    current: "현재 선택: {label} · {title}",
  },
  origin: {
    title: "당신은 무엇을 가장 오래 기억합니까?",
    label: "분석관의 기억 선택",
    note: "무엇을 가장 오래 기억하는지에 따라 프롤로그 01의 시작 수치가 조금 달라집니다.",
    current: "현재 선택: {title} · 프롤로그 01 시작 {start}",
    // The three memories and their prologues, kept in advancedSystems.js and named here.
    profiles: OPERATOR_PROFILES,
    prologues: ORIGIN_PROLOGUES,
  },
  comfortTitle: "편의 설정",
  season: {
    title: "생각을 깨우는 조건은 조종 가능한 조건이기도 하다.",
    text: "처음에는 내 판단이 깊어지는 순간을 찾습니다. 마지막에는 누군가 그 순간을 설계할 수 있다면, 나는 여전히 자유로운지 묻게 됩니다.",
  },
  goalsTitle: "시즌 목표",
  guide: { title: "처음 플레이 가이드", heading: "처음 플레이할 때 보는 기준" },
  data: {
    title: "데이터 저장 안내",
    consent: "플레이테스트 데이터 제공 동의",
    noRemote: "현재 배포 환경에는 원격 저장이 설정되어 있지 않습니다.",
    offline: "오프라인",
    ready: "원격 저장 준비됨",
    local: "로컬 저장",
    status: "저장 상태",
    sessionCode: "세션 코드 ",
    notice: "데이터 안내",
    privacy:
      "이름은 원격 저장하지 않습니다. 피드백에는 실명, 연락처, 회사명처럼 개인이나 조직을 식별할 수 있는 정보는 쓰지 마세요. 다른 기기에서 이어하기를 위한 온라인 저장은 이 동의와 별개로, 직접 켤 때만 진행 기록을 올리며 이름과 피드백 내용은 올리지 않습니다. ",
    more: "자세한 내용은 ",
    and: "과 ",
    end: "에 있습니다.",
    // The consent box's sentence and the deletion request, which the policy
    // pages and the support-contact test read from where they are kept
    // (privacyText.js, appConfig.js): named here, not copied.
    playtestNotice: PLAYTEST_DATA_NOTICE,
    deletion: DELETION_REQUEST_COPY,
  },
  // The consent box's sentences (src/state/useConsentToggle.js).
  consent: {
    revokeNotSaved: "동의 해제 내용을 브라우저 저장본에 반영하지 못했습니다. 저장소 권한을 확인한 뒤 다시 시도하세요.",
    grantNotSaved: "데이터 제공 동의를 브라우저 저장본에 반영하지 못했습니다.",
    revoked: "데이터 제공 동의를 해제했습니다. 미전송 원격 대기열도 삭제했습니다.",
    granted: "데이터 제공에 동의했습니다. 지금부터 마치는 사건에 적용됩니다.",
  },
  seasonLog: {
    title: "완료한 사건에서 반복적으로 활성화된 조건",
    result: "RANK {rank} · {seconds}초 · 판 다시 짜기 {count}",
    journeyLabel: "사건 간 결말 연결",
    carryover: "다음 사건 전달: {list}",
  },
  roadmap: {
    title: "사건은 완료한 판단 로그를 다음 압박으로 넘기며 순서대로 열립니다.",
    locked: "앞선 사건의 판단 로그가 필요합니다.",
    // After the card's English RANK.
    result: " · {thinking} · {seconds}초 · 판 다시 짜기 {count}",
  },
  // A case card's status chip (introViewModel.js, getCaseStatusText).
  status: { playing: "진행 중", open: "시작 가능", complete: "완료됨", locked: "이전 사건 필요" },
  legal: { about: "게임 소개", faq: "자주 묻는 질문", contact: "문의", privacy: "개인정보처리방침", terms: "이용약관" },
  opening: {
    firstCase: "첫 사건",
    entering: "{case} 진입 중",
    first: "첫 판단 조건 동기화 중",
    syncing: "{case} 판단 조건 동기화 중",
  },
};
export default introCopy;

/**
 * The NEW GAME+ button's text on either side of the blank its English name
 * fills ("{game} 시작" -> ["", " 시작"]). A function, read at render: a split
 * kept from when the module was read held the Korean on an English page.
 */
export function newGamePlusLabel() {
  return introCopy.setup.newGamePlus.split("{game}");
}

localizeTables("screens", { intro: introCopy });
