/**
 * 석간 원장: the newspaper of the game's world (세계관 신문). Made-up articles
 * about what happened, or could have, inside the season's world -- markets,
 * rules, company news, editorials, interviews, briefs -- one page each under
 * /news/ (scripts/content-pages/news.mjs writes them from the Markdown in
 * scripts/content-pages/news/). This is their index: what the list, each
 * page's head and the start screen's 「오늘의 1면」 need without the bodies.
 *
 * Why: a reader who never plays still finds something to read on the site,
 * and every page says, above and below its words, that it is fiction
 * (AdSense 2차 분석, cp-archive/메모-20261120; owner's decision 11-20 「1」).
 *
 * `day` is the date inside the world (YYYY-MM-DD), not the day the page went
 * up. No article tells more of a case than its case file page does (the first
 * two scenes), and none names a real company, person or newspaper.
 */

import { newsPath } from "./newsPaper.js";

// The paper's name, fiction line and addresses live in ./newsPaper.js, which the first paint carries.
export { NEWS_DISCLAIMER, NEWS_INDEX_PATH, NEWS_PAPER, NEWS_PAPER_LINE, newsPath } from "./newsPaper.js";

/** Each article: `slug`, `day` (inside the world), `section` (지면), `title`, `summary` and `cases`, the case files it touches. */
export const ARTICLES = [
  {
    slug: "kyungdong-bank-sold",
    day: "1998-04-06",
    section: "경제",
    title: "경동은행, 미국계 킹스데일 파트너스에 팔린다… 새 이름은 「KD은행」",
    summary: "넉 달을 끈 매각 협상이 끝났다. 소액 대출 정리 방침에 영업점 창구는 하루 종일 문의 전화였다.",
    cases: ["case19", "case27"],
  },
  {
    slug: "kd-group-launch",
    day: "2008-10-01",
    section: "경제",
    title: "KD금융그룹 오늘 출범… 은행·캐피탈·생명 한 지붕 아래로",
    summary: "지주회사 체제로 바뀐 첫날, 본사 33층에 그룹전략실이 새로 생겼다. 시장이 흔들리는 가을의 출발이다.",
    cases: ["case23", "case13"],
  },
  {
    slug: "debt-ratio-clauses",
    day: "2022-12-05",
    section: "해설",
    title: "[문답 해설] 기업 대출 계약서에 「부채비율 상한」 조항이 늘어나는 이유",
    summary: "금리가 뛰자 은행들이 계약서 한 줄을 고치고 있다. 그 숫자를 넘으면 무슨 일이 생기는지 물어 정리했다.",
    cases: ["prologue01", "prologue02"],
  },
  {
    slug: "flowon-founder-interview",
    day: "2023-03-20",
    section: "인터뷰",
    title: "[월요 인터뷰] 플로우온 권태호 창업주 「새벽 세 시의 컨베이어가 제 사무실입니다」",
    summary: "김포 제2풀필먼트센터 가동을 앞둔 새벽 배송 회사 창업주를 물류 현장에서 만났다.",
    cases: ["prologue02", "case01"],
  },
  {
    slug: "smart-logistics-3",
    day: "2023-05-22",
    section: "생활·재테크",
    title: "창구에서 요즘 많이 권하는 「스마트물류 3호」, 가입 전에 물어볼 다섯 가지",
    summary: "물류 회사 성장에 돈을 대는 상품이 동네 은행 창구에서 잘 팔린다. 원금이 보장되는지부터 확인하자.",
    cases: ["prologue04"],
  },
  {
    slug: "briefs-2023-08",
    day: "2023-08-01",
    section: "단신",
    title: "[금융·산업 단신] 합정동에 그룹 연구랩 문 열어 외",
    summary: "KD금융그룹 연구 조직 개소, 군산 새봄신협 창립 기념일, 망원시장 여름 장터 등 이번 주 단신.",
    cases: ["prologue05", "case27"],
  },
  {
    slug: "flowon-72-hours",
    day: "2025-05-12",
    section: "종합",
    title: "플로우온, 협력사 14곳 대금 밀려… 주거래은행 「72시간 실사」 착수",
    summary: "현금으로 버틸 수 있는 날은 사흘. 직원 1,140명의 새벽 배송 회사가 다시 숫자 앞에 섰다.",
    cases: ["case01", "prologue02"],
  },
  {
    slug: "onsae-312-homes",
    day: "2025-06-02",
    section: "사회",
    title: "돌봄 플랫폼 온새 배차 멈춰 312가구 방문 끊겨… 「책임자가 없다」",
    summary: "혼자 사는 어르신 집에 하루 동안 아무도 오지 않았다. 규정을 거슬러 올라가 보니 맨 위에는 숫자가 있었다.",
    cases: ["case05", "case04"],
  },
  {
    slug: "editorial-no-name-at-the-top",
    day: "2025-06-04",
    section: "사설",
    title: "[사설] 맨 위에 사람이 없는 규정은 누가 책임지나",
    summary: "온새 돌봄 공백은 현장 실수로 덮을 일이 아니다. 예산 상한선이 어디서 내려왔는지부터 밝혀야 한다.",
    cases: ["case05"],
  },
  {
    slug: "missing-dissent-hearing",
    day: "2025-09-22",
    section: "종합",
    title: "「사라진 반대 의견」 보도 파장… 국회, KD은행 직원 참고인 채택",
    summary: "3년 전 310억 대출에 혼자 반대한 의견서가 사내 시스템에서 검색되지 않는다는 보도에 국회가 움직였다.",
    cases: ["case11", "prologue03"],
  },
  {
    slug: "voluntary-compensation",
    day: "2025-10-01",
    section: "금융",
    title: "KD그룹 300억 「자율 배상안」… 받으려면 「소송 안 한다」 서명해야",
    summary: "1인당 평균 1,700만 원. 피해자 모임은 돈보다 조건을 먼저 읽고 있다. 분쟁조정 마감은 열흘 뒤다.",
    cases: ["case12"],
  },
  {
    slug: "gaeul-tteokbang-interview",
    day: "2025-10-08",
    section: "인터뷰",
    title: "[사람과 가게] 망원시장 가을떡방 문가을 「숫자 말고 이름으로 불러 달라는 거예요」",
    summary: "명절 대목이 끝난 떡집에서 피해자 모임 대표를 만났다. 떡 이야기를 하다가 장부 이야기가 됐다.",
    cases: ["case12", "case38"],
  },
  {
    slug: "sangsaeng-esg-fund",
    day: "2025-10-27",
    section: "금융",
    title: "「상생 ESG 펀드」 2주 만에 1,070억… 가입자 평균 나이 71세",
    summary: "예금 만기가 돌아온 은퇴자들이 창구에서 가입했다. 이름은 착한데, 무엇을 담았는지는 설명서 뒤쪽에 있다.",
    cases: ["case14"],
  },
  {
    slug: "reader-contract-worker",
    day: "2025-11-14",
    section: "독자투고",
    title: "[독자투고] 3년차 계약직이 정규직 면접 전날 쓰는 편지",
    summary: "수능 날 아침, 동생을 고사장에 데려다주고 돌아와 썼다는 금융권 계약직 독자의 글.",
    cases: ["case15"],
  },
  {
    slug: "robots-night-shift",
    day: "2025-11-28",
    section: "산업",
    title: "물류센터에 로봇 120대 들어온다… 야간조 80명엔 새벽 4시 문자",
    summary: "로봇은 사지 않고 빌린다. 한 달 리스료 3억 4천만 원, 승인 여부는 엿새 뒤 위원회가 정한다.",
    cases: ["case16"],
  },
  {
    slug: "hoegi-bookshop-72-hours",
    day: "2026-01-20",
    section: "르포",
    title: "[르포] 철거 예정일이 석 달 당겨진 회기동 헌책방 골목의 사흘",
    summary: "4월이던 날짜가 1월 22일 새벽 6시로 바뀌었다. 영하 11도 골목에서 종이 상자를 나르는 사람들을 따라갔다.",
    cases: ["case19"],
  },
  {
    slug: "noah-replaces-echo",
    day: "2026-01-27",
    section: "IT",
    title: "KD데이터랩 AI 심사 엔진 「노아」 다음 달 가동… 3년 쓴 「에코」는 이달 말 종료",
    summary: "대출 판단을 검증하던 시스템이 물러나고, 신청을 직접 판단하는 엔진이 들어선다. 학습 자료의 출처가 궁금하다.",
    cases: ["case20", "case21"],
  },
  {
    slug: "rejected-in-0-8-seconds",
    day: "2026-02-24",
    section: "사회",
    title: "0.8초 만에 「대출 거절」… 협동조합 공장 「세상 떠난 사람 기록 때문이라니」",
    summary: "다시 문을 연 인천 남동공단의 작은 공장이 기계 한 대를 사려다 멈춰 섰다. 사유 코드는 R-17.",
    cases: ["case22"],
  },
  {
    slug: "one-share-shareholders",
    day: "2026-03-09",
    section: "경제",
    title: "KD금융 주총 열하루 앞… 한 주씩 산 3,118명 「표가 아니라 이유를 모읍니다」",
    summary: "다 합쳐도 지분 0.0008%. 그래도 위임장을 들고 전국을 도는 사람들이 있다. 안건 제3호는 사내이사 선임이다.",
    cases: ["case23"],
  },
  {
    slug: "reporters-note-no-results",
    day: "2026-03-24",
    section: "기자수첩",
    title: "[기자수첩] 「운영 성과 없음」 네 글자에는 작성자가 없다",
    summary: "그룹 연구 조직 해체 공지를 받아 든 기자가 공지문 안에서 찾지 못한 한 줄에 대해.",
    cases: ["case24"],
  },
  {
    slug: "pyeongtaek-crane",
    day: "2026-04-14",
    section: "지역",
    title: "석 달째 멈춘 평택 고덕 22층 공사장… 타워크레인 위에 반장이 있다",
    summary: "짓다 만 오피스텔의 부동산 PF 대출 620억은 이달 27일 만기다. 크레인 아래에서 임금 명세서를 들고 기다리는 사람들.",
    cases: ["case26"],
  },
  {
    slug: "gunsan-credit-union-line",
    day: "2026-05-04",
    section: "지역",
    title: "군산 새봄신협 앞 새벽 4시부터 180명 줄… 단체방 캡처 한 장에서 시작",
    summary: "「이번 달을 못 넘긴다」는 한 줄짜리 소문이 금요일 밤부터 돌았다. 조합원 4,812명의 동네 금고에 무슨 일이.",
    cases: ["case27", "case26"],
  },
  {
    slug: "column-every-decade",
    day: "2026-05-11",
    section: "칼럼",
    title: "[경제 칼럼] 10년마다 내려오는 같은 주문 「숫자를 맞춰라」",
    summary: "1998년 봄, 2008년 가을, 그리고 금리가 뛴 몇 해. 은행 창구에서 오래 일한 이들이 기억하는 장면은 늘 비슷하다.",
    cases: ["case19", "case27", "prologue01"],
  },
  {
    slug: "fine-print-6-5-points",
    day: "2026-05-20",
    section: "생활·소비자",
    title: "6.5포인트 글씨로 적힌 약관, 보험금 거절 통보를 받았다면",
    summary: "작은 글씨 한 줄 때문에 거절됐다는 사연이 늘었다. 통보문을 받은 날부터 해 볼 수 있는 일을 순서대로 정리했다.",
    cases: ["case28"],
  },
  {
    slug: "bulk-sale-singapore",
    day: "2026-05-26",
    section: "금융",
    title: "KD캐피탈, 부실채권 4,270억 한 묶음으로 싱가포르 사모펀드에 판다",
    summary: "채무자 3,860명의 빚이 바다를 건넌다. 서명식은 목요일, 대주주의 분기 리뷰를 앞둔 일정이다.",
    cases: ["case29"],
  },
  {
    slug: "prosecutors-raid",
    day: "2026-06-16",
    section: "종합",
    title: "검찰, KD캐피탈·그룹전략실 동시 압수수색… 혐의는 세 갈래",
    summary: "금융감독원 정기검사가 시작된 지 여드레 만이다. 빈 상자 60개가 들어갔다.",
    cases: ["case32", "case31"],
  },
  {
    slug: "whistleblower-three-lines",
    day: "2026-06-23",
    section: "사회",
    title: "공익신고 사흘 만에 해고·고소·퇴거 통보… 「신고자 보호는 어디까지인가」",
    summary: "1,212쪽 자료를 낸 그룹 전 직원에게 회사의 답은 세 줄로 왔다. 제도가 실제로 지켜 주는 범위를 따져 봤다.",
    cases: ["case33"],
  },
  {
    slug: "monsoon-flood-loans",
    day: "2026-07-15",
    section: "사회",
    title: "시간당 110mm 장대비에 망원시장·남동공단 잠겨… 수해 대출은 「침수 이력」으로 거절",
    summary: "물이 빠지기도 전에 긴급 대출 문의가 쌓였다. 그런데 심사 엔진은 물에 잠겼다는 그 사실을 위험으로 읽는다.",
    cases: ["case35", "case22"],
  },
  {
    slug: "reaction-log-leak",
    day: "2026-07-29",
    section: "IT",
    title: "그룹 연구 조직 「반응 기록」 38만 줄 익명 커뮤니티에 유출",
    summary: "참가자 63명이 선택마다 몇 초를 망설였는지가 통째로 풀렸다. 가명 처리는 돼 있지만 안심하기 이르다.",
    cases: ["case37", "case30"],
  },
  {
    slug: "class-action-first-hearing",
    day: "2026-08-06",
    section: "사회",
    title: "원고 1,740명 집단소송 첫 변론… 방청석 72석에 시장 사람 87명",
    summary: "떡 상자를 들고 법원에 온 상인들. 쟁점은 대출 서류가 없는 212명이 원고가 될 수 있느냐다.",
    cases: ["case38", "case12"],
  },
  // 2차 30편 (2026-11-20, 31~60): 오늘의 1면이 한 달마다 되풀이되지 않도록.
  {
    slug: "lending-doors-narrow-1997",
    day: "1997-12-22",
    section: "경제",
    title: "환율 뛰는 연말, 은행들 기업 대출 문 좁혀… 「연장해 주던 대출도 다시 본다」",
    summary: "만기 연장까지 깐깐해진 12월. 심사 보고서는 예년의 두 배로 두꺼워졌고, 공단과 시장은 숨을 죽였다.",
    cases: ["case19"],
  },
  {
    slug: "small-loans-cleared-1998",
    day: "1998-05-18",
    section: "르포",
    title: "「20년 거래한 은행이 하루아침에 남」… 간판 바뀌는 은행, 시장 소액 대출부터 정리",
    summary: "매각을 앞둔 은행이 작은 대출부터 장부에서 덜어 내고 있다. 등기 우편을 받은 시장 상인들을 만났다.",
    cases: ["case19", "case27"],
  },
  {
    slug: "kingsdale-stake-sale-2014",
    day: "2014-06-10",
    section: "경제",
    title: "킹스데일, KD금융 지분 일부 매각… 30% 안팎으로 최대주주는 유지",
    summary: "경동은행 인수 16년 만의 첫 대규모 매각. 「떠나는 것이 아니라 무게를 덜어 내는 것」이라는 설명에도 분기 숫자의 압박을 걱정하는 목소리가 나온다.",
    cases: ["case23", "case24"],
  },
  {
    slug: "flowon-series-funding-2021",
    day: "2021-11-08",
    section: "산업",
    title: "새벽 배송 플로우온 대규모 투자 유치… 김포에 두 번째 대형 센터 짓는다",
    summary: "밤 11시 주문, 아침 7시 도착. 빠르게 크는 만큼 빠르게 쓰는 회사의 다음 고비는 은행 대출이다.",
    cases: ["prologue02", "case01"],
  },
  {
    slug: "small-factories-rates-2022",
    day: "2022-10-24",
    section: "지역",
    title: "금리 오른 가을, 화곡동 골목 공장들 「월급 주려고 빌린 돈이 제일 무섭다」",
    summary: "포장재 공장이 모인 골목에서 이자와 장부를 함께 걱정하는 사장들을 만났다.",
    cases: ["prologue01"],
  },
  {
    slug: "flowon-loan-secured-2023",
    day: "2023-04-28",
    section: "금융",
    title: "플로우온, KD은행서 운영자금 310억 확보… 김포 2센터 가동 탄력",
    summary: "대출심사위원회가 승인했다. 계약서의 재무 조건과 기준선에 붙은 숫자를 두고 신중론도 나온다.",
    cases: ["prologue03", "prologue02"],
  },
  {
    slug: "editorial-sales-stickers",
    day: "2023-11-20",
    section: "사설",
    title: "[사설] 은행 객장의 「판매왕」 스티커를 떼라",
    summary: "투자 상품은 많이 판 사람이 아니라 정확히 설명한 사람이 평가받아야 한다.",
    cases: ["prologue04"],
  },
  {
    slug: "explainer-ai-lending-2024",
    day: "2024-03-11",
    section: "해설",
    title: "[문답 해설] AI가 대출을 심사하면 무엇이 달라지나",
    summary: "빠르고 한결같지만, 거절 이유가 코드 하나로 오고 예외 승인이 사라질 수 있다. 기계 뒤의 서명란을 묻는다.",
    cases: ["case20", "case22"],
  },
  {
    slug: "onsae-care-selected-2024",
    day: "2024-07-15",
    section: "사회",
    title: "돌봄 플랫폼 온새, 통합 돌봄 지원 사업 선정… 취약계층 4,200명 방문 돌봄",
    summary: "같은 선생님이 같은 어르신을 꾸준히 찾아가게 하는 배차가 강점이다. 지원금과 은행 빚을 함께 진 구조는 숙제로 남았다.",
    cases: ["case04", "case05"],
  },
  {
    slug: "novaworks-tender-2025",
    day: "2025-05-20",
    section: "산업",
    title: "노바웍스 전산 통합 입찰 마감 앞둬… 「비용 18% 절감」 요구에 업계 긴장",
    summary: "잘 짜서 나오는 숫자인가, 무언가를 빼서 나오는 숫자인가. 공사 대금의 행방과 보안도 쟁점이다.",
    cases: ["case03"],
  },
  {
    slug: "haeon-partners-liquidation",
    day: "2025-07-07",
    section: "지역",
    title: "경포 펜션 주소의 컨설팅사 해온파트너스 청산 신청… 「사무실 쓰는 사람 못 봤다」",
    summary: "직원도 매출도 알려지지 않은 자문 회사가 사흘 뒤 사라진다. 분기마다 들어왔다는 자문료의 흐름이 궁금하다.",
    cases: ["case08"],
  },
  {
    slug: "flowon-creditors-liquidation-vote",
    day: "2025-07-14",
    section: "경제",
    title: "플로우온 채권단, 청산안 결의 60시간 앞… 직원 1,140명·협력사 280곳 촉각",
    summary: "선순위 담보를 쥔 은행은 청산을, 뒤 순서의 은행은 회생을 셈한다. 창업주의 장남은 은행 편에 섰다.",
    cases: ["case09"],
  },
  {
    slug: "innovation-committee-launch",
    day: "2025-10-20",
    section: "종합",
    title: "KD 혁신위원회 다음 주 생중계 출범… 외부 위원 명단은 「당일 공개」",
    summary: "국정감사 뒤 그룹이 꺼낸 외부 점검 기구. 권한과 회의록 공개 여부는 아직 정해지지 않았다.",
    cases: ["case13"],
  },
  {
    slug: "senior-finance-class",
    day: "2025-11-03",
    section: "교육",
    title: "[현장] 노인복지관 금융 교실에 가 보니… 어르신 질문 1위는 「원금」",
    summary: "화이트보드에 적힌 「원금」 옆의 별표 세 개. 창구 앞에서 물어볼 질문을 연습하는 교실을 찾았다.",
    cases: ["case14"],
  },
  {
    slug: "kd-bank-npl-sale-1860",
    day: "2025-12-22",
    section: "금융",
    title: "KD은행, 연말 부실채권 1,860억 한 묶음 매각… 가격은 원금의 19%",
    summary: "장부를 털어 내려는 연말 매각. 사는 쪽은 돈과 함께 대출 서류 뭉치도 넘겨받는다.",
    cases: ["case18"],
  },
  {
    slug: "year-in-numbers-2025",
    day: "2025-12-30",
    section: "기획",
    title: "[연말 기획] 숫자로 본 2025 금융가… 72, 312, 41만, 1,740",
    summary: "사람의 얼굴을 한 여덟 개의 숫자로 한 해를 돌아봤다.",
    cases: ["case01", "case05", "case11", "case12"],
  },
  {
    slug: "editorial-new-year-blank-boxes",
    day: "2026-01-02",
    section: "사설",
    title: "[신년 사설] 새해에는 빈칸에 이름을",
    summary: "사유 칸이 빈 발령서, 사람 대신 숫자가 적힌 규정. 금융가의 빈칸을 채우자는 세 가지 요구.",
    cases: ["case07", "case05"],
  },
  {
    slug: "consent-forms-registered-mail",
    day: "2026-02-04",
    section: "IT",
    title: "「끝난 실험」에 대한 동의서가 등기로 왔다… 감사금 300만 원 동봉",
    summary: "그룹 연구 프로그램의 과거 참가자들에게 사후 동의서가 날아들었다. 새 AI 엔진 가동 직전이다.",
    cases: ["case21", "case20"],
  },
  {
    slug: "personnel-notice-april",
    day: "2026-04-01",
    section: "인사",
    title: "KD금융 4월 1일자 인사… 윤상혁 전 그룹전략실 상무, KD캐피탈 대표로",
    summary: "「영전」인가 「이동」인가. 해체된 연구 조직 직원들도 여러 계열사로 흩어졌다.",
    cases: ["case25"],
  },
  {
    slug: "yeouido-cherry-blossoms",
    day: "2026-04-03",
    section: "생활",
    title: "여의도 윤중로 벚꽃 만개… 꽃길 위 직장인들 「올해는 꽃보다 인사」",
    summary: "사원증을 목에 건 점심 산책. 분기 말과 인사철이 겹친 금융가의 봄을 걸었다.",
    cases: ["case25"],
  },
  {
    slug: "documentary-ads-pulled",
    day: "2026-08-06",
    section: "방송",
    title: "다큐 「서명하지 않은 사람들」 방송 하루 앞… 금융 계열사 광고 14개 철회",
    summary: "광고 철회 통보와 함께 타임코드 두 줄이 적힌 「참고 의견」이 왔다는 말이 돈다.",
    cases: ["case39"],
  },
  {
    slug: "reader-courtroom-hallway",
    day: "2026-08-12",
    section: "독자투고",
    title: "[독자투고] 법정 복도에 서 있던 87명 가운데 한 사람입니다",
    summary: "집단소송 첫 변론 날, 방청석에 들어가지 못한 시장 상인이 보내온 글.",
    cases: ["case38"],
  },
  {
    slug: "fit-score-41-points",
    day: "2026-08-17",
    section: "IT",
    title: "12분 게임 하고 「적합도 41점」 불합격… 아르바이트 채용에 번지는 역량검사",
    summary: "면접은 없고 점수만 남는다. 점수 기준을 만든 「수많은 자료」의 출처도 논란이다.",
    cases: ["case40", "case30"],
  },
  {
    slug: "hearing-witness-will-attend",
    day: "2026-08-24",
    section: "종합",
    title: "국회 청문회 금요일 개회… 1년 전 빈 의자였던 증인 「성실히 출석」",
    summary: "빈 의자는 반박하지 않는다. 나오는 증인에게 7분 동안 무엇을 물을지 위원들이 고심하고 있다.",
    cases: ["case41", "case11"],
  },
  {
    slug: "gyeongpo-fireworks",
    day: "2026-09-04",
    section: "지역",
    title: "경포 불꽃축제 내일 밤 9시… 펜션 골목 만실, 방파제 명당 경쟁",
    summary: "늦여름 동해안의 축제. 붓펜으로 쓴 「휴가 명령서」를 들고 오는 회사원들도 있다.",
    cases: ["case42", "case08"],
  },
  {
    slug: "board-dismissal-agenda",
    day: "2026-09-07",
    section: "종합",
    title: "KD금융 이사회 오늘 오후 2시… 사내이사 해임안 상정, 여덟 표 중 다섯 표",
    summary: "표결 구조와 쟁점을 이사회 전에 정리했다. 설명서에 빠진 한 줄이 더 큰 쟁점이다.",
    cases: ["case43", "case23"],
  },
  {
    slug: "verdict-eve-haeon-fees",
    day: "2026-09-09",
    section: "법조",
    title: "자문료 배임 사건 내일 1심 선고… 선고 전날 은행 명의 처벌불원서 제출",
    summary: "피해자가 처벌을 원하지 않는다면 판사는 그것을 따져야 한다. 「3년을 쫓은 돈인데 용서는 회사가 한다」.",
    cases: ["case44", "case08"],
  },
  {
    slug: "loopnow-investment",
    day: "2026-09-21",
    section: "산업",
    title: "도심 15분 배송 루프나우, 싱가포르 사모펀드서 480억 투자 추진… 대출 확약이 조건",
    summary: "다크스토어로 크는 배송 회사가 몇 년 전 새벽 배송 회사의 길을 걷는다. 계약서 구조도 닮았다는 지적이다.",
    cases: ["case48", "case29"],
  },
  {
    slug: "chuseok-market-steamers",
    day: "2026-09-22",
    section: "생활",
    title: "추석 앞 망원시장 떡집, 찜기 여섯 대에 일손이 모자라",
    summary: "새벽 네 시부터 김이 오르는 떡집. 1년 전 은행 이야기를 하던 자리에서 올해는 송편을 빚는다.",
    cases: ["case47", "case12"],
  },
  {
    slug: "money-clinic-no-suit-agreement",
    day: "2025-10-03",
    section: "생활·소비자",
    title: "[돈 상담소] 배상금과 함께 온 「부제소 합의서」, 서명 전에 볼 다섯 가지",
    summary: "소송하지 않겠다는 한 문장 앞에서 망설이는 일흔세 살 독자의 질문에 답했다.",
    cases: ["case12"],
  },
];

/** `2025년 6월 2일` */
export function worldDate(day) {
  const [year, month, date] = String(day).split("-").map(Number);
  return `${year}년 ${month}월 ${date}일`;
}

/** Today in Seoul as YYYY-MM-DD, whatever zone the build or the reader is in. */
export function seoulToday(now = new Date()) {
  return new Date(now.getTime() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

/** Days since 1970-01-01 of a YYYY-MM-DD day: the same number all day, one more the next. */
export function dayNumber(day) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(day))) throw new Error(`news: day must be YYYY-MM-DD, got ${day}`);
  const [year, month, date] = day.split("-").map(Number);
  return Math.floor(Date.UTC(year, month - 1, date) / 86400000);
}

/** The articles in the order the front page walks them: by their date inside the world. */
export const FRONT_ORDER = [...ARTICLES].sort((a, b) => (a.day < b.day ? -1 : a.day > b.day ? 1 : 0));

/**
 * 오늘의 1면: the article for a day in Seoul (YYYY-MM-DD). It is fixed by the
 * day, not drawn at random: the same all day for everyone, the next one the
 * next day, round the list and again. As the start screen shows it:
 * `{ href, title, summary, section, day, date }`.
 */
export function frontPageFor(day, articles = FRONT_ORDER) {
  if (!articles.length) return null;
  const article = articles[((dayNumber(day) % articles.length) + articles.length) % articles.length];
  return { href: newsPath(article.slug), title: article.title, summary: article.summary, section: article.section, day: article.day, date: worldDate(article.day) };
}

/** 오늘의 1면 as a reader sees it now: the article for today in Seoul (`frontPageFor`). */
export const todayFrontPage = (now = new Date()) => frontPageFor(seoulToday(now));
