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

/** The paper's name and what it says about itself, Korean only like its articles. */
export const NEWS_PAPER = "석간 원장";
export const NEWS_PAPER_LINE = "게임 「임계점」 세계 속의 가상 경제 석간";

/** The line every article page prints above and below its words. */
export const NEWS_DISCLAIMER = "게임 속 가상 기사입니다 — 실제 사건·인물·회사와 관계없습니다";

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
];

/** An article's address: `/news/<slug>.html`. The list is `/news/index.html`. */
export const newsPath = (slug) => `/news/${slug}.html`;
export const NEWS_INDEX_PATH = "/news/index.html";

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
