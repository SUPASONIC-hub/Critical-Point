/**
 * The notes (노트): essays we write by hand, in Korean, one page each under
 * /notes/ (scripts/content-pages/notes.mjs writes them from the Markdown in
 * scripts/content-pages/notes/). This is their index: what the start screen's
 * reading section and the notes list need without the bodies.
 *
 * Each note has its own day (`published`, KST). A build writes only the notes
 * whose day has come, so a note written today and dated next week goes live
 * with the first build on or after that day (.github/workflows/notes-publish.yml
 * presses that build). Why the notes exist: cp-archive/메모-20261120/adsense-2차-분석.md,
 * the owner's decision 2026-11-20 「전부 1」.
 *
 * They were first spread out, one every two or three days to 2027-01-20. On
 * 2026-11-25 the owner chose (「2」) to publish what is ready at once, with no
 * schedule: every finished note went out that day. Several notes now share a
 * day; among them, the one later in this list counts as newer. A note still
 * dated ahead waits on code that has not shipped (its numbers or rules come
 * with the 11-30 rules, bundle R) and takes that bundle's day.
 *
 * `updated` is the day a note's words last changed after it went out, if they
 * did; the page and the sitemap date it by that.
 */
export const NOTES = [
  {
    slug: "debt-ratio-covenant",
    published: "2026-11-21",
    title: "부채비율 180% 조항은 어떻게 회사를 움직이나",
    summary: "대출 계약서 한 줄이 회사의 장부 습관까지 바꾸는 과정을, 우리가 사건을 쓰며 고친 문장과 함께 적었습니다.",
  },
  {
    slug: "revenue-pulled-forward",
    published: "2026-11-23",
    title: "「매출 당겨 잡기」는 왜 횡령 없이도 문제가 되나",
    summary: "돈을 빼돌리지 않았는데도 장부가 거짓이 되는 이유, 매출을 올리는 날짜가 왜 중요한지 풀었습니다.",
  },
  {
    slug: "due-diligence-72-hours",
    published: "2026-11-25",
    title: "실사 72시간에 실제로 보는 것",
    summary: "현금, 받을 돈, 줄 돈, 계약서, 사람. 사흘 안에 무엇부터 확인하는지, 그리고 「실사」라는 낱말 하나를 두고 우리가 한 일.",
  },
  {
    slug: "two-income-statements",
    published: "2026-11-25",
    title: "손익계산서 두 장을 나란히 읽는 법",
    summary: "한 해 치만 보면 안 보이는 것들. 두 해를 나란히 놓고 어느 줄부터 비교하는지, 가상의 회사 숫자로 따라가 봅니다.",
  },
  {
    slug: "internal-external-audit",
    published: "2026-11-25",
    title: "내부 감사와 외부 감사, 누가 무엇을 막나",
    summary: "회사 안의 감사팀과 바깥의 회계법인은 보는 것도, 못 보는 것도 다릅니다. 그리고 우리가 「감사」라는 낱말을 세 갈래로 나눠 쓰는 이유.",
  },
  {
    slug: "whistleblower-protection",
    published: "2026-11-25",
    title: "공익신고자 보호는 어디까지 지켜 주나(일반론)",
    summary: "무엇을 어디에 알려야 보호를 받는지, 제도가 지켜 주는 것과 지켜 주지 못하는 것. 반대 의견서가 신고와 어떻게 다른지도 적었습니다.",
  },
  {
    slug: "why-push-your-luck",
    published: "2026-11-25",
    title: "왜 「푸시 유어 럭」이었나: 패널 4.7화면을 버린 날",
    summary: "결정 하나에 휴대폰 화면 4.7장. 확률을 퍼센트로 보여 주던 판을 버리고 9,377줄을 지운 2026년 9월의 기록입니다.",
  },
  {
    slug: "first-thirty-minutes",
    published: "2026-11-25",
    title: "첫 시즌 30분 가이드: 프롤로그에서 배울 다섯 가지",
    summary: "표 읽기, 테이블에서 미는 법, 여섯 자원, 판단 리포트, 끊어서 하기. 결말 이야기 없이 처음 30분에 익힐 것만 모았습니다.",
  },
  {
    slug: "automated-scoring",
    published: "2026-11-25",
    title: "신용점수·적합도 점수 같은 자동 심사의 함정",
    summary: "산식, 가중치, 학습 데이터 각각에 숨은 함정과 결과를 받았을 때 물어볼 다섯 가지. 우리가 자동 채점 장치를 이틀 만에 걷어 낸 이야기도 함께.",
  },
  {
    slug: "noisy-heartbeat",
    published: "2026-11-25",
    title: "보이지 않는 벽: 심박에 오차를 넣은 이유와 수치",
    summary: "벽을 가리키는 심박을 일부러 최대 18만큼 틀리게 만든 이유와, 그 숫자를 시뮬레이션으로 다시 잰 결과입니다.",
  },
  {
    slug: "six-resources-mistakes",
    published: "2026-11-25",
    title: "자원 6개 관리 요령과 흔한 실수 10가지",
    summary: "남은 시간부터 피로까지 여섯 자원을 읽는 요령과, 규칙과 측정 숫자로 확인한 흔한 실수 열 가지를 모았습니다.",
  },
  {
    slug: "board-and-shareholders",
    published: "2026-11-25",
    title: "주주총회·이사회는 실제로 무엇을 결정하나",
    summary: "두 회의가 각각 정하는 일, 사외이사와 의사록이 중요한 이유. 안건 하나에 4분 12초가 걸린 프롤로그의 회의 장면과 함께 읽습니다.",
  },
  {
    slug: "forty-five-second-clock",
    published: "2026-11-25",
    title: "45초 시계를 정하기까지",
    summary: "8월의 첫 시계부터 읽기 시계를 떼어 낸 날, 초당 16자에서 10자로 늘린 날, 박자를 26일 만에 걷어 낸 날까지. 시계들의 기록입니다.",
  },
  {
    slug: "reframe-wild-card",
    published: "2026-12-20",
    title: "「판 바꾸기」 와일드카드 언제 쓰나",
    summary: "글 상자에서 카드 한 장이 된 「판을 다시 짠다」의 규칙과 값, 그리고 가상의 판 세 개로 따라가 보는 거는 때와 참는 때.",
  },
  {
    slug: "push-multiplier-and-bust",
    published: "2026-11-25",
    title: "판 1.5배 규칙과 BUST 확률을 맞춘 기록",
    summary: "한 번 밀면 적어도 1.5배. 그 규칙 위에서 벽의 자리와 BUST 빈도를 측정으로 맞추고, 맞지 않는 값을 버린 과정입니다.",
  },
  {
    slug: "faces-not-silhouettes",
    published: "2026-11-25",
    title: "얼굴 있는 인물: 초상 원칙(실루엣 금지)의 이유",
    summary: "말하는 사람 87명 가운데 66명이 실루엣이던 날부터, 악역도 평범한 얼굴로 그린다는 두 번째 규칙까지.",
  },
  {
    slug: "weekly-rules-table",
    published: "2026-12-26",
    title: "주간 규칙별 대응표: 바뀌는 숫자와 하지 말 것",
    summary: "그 주에만 서는 여섯 규칙이 무슨 숫자를 바꾸는지, 측정으로 확인한 하지 말 것과 함께 한 표로 모았습니다.",
  },
  {
    slug: "reading-the-report",
    published: "2026-11-25",
    title: "판단 리포트 읽는 법: 버스트 점수의 일곱 칸",
    summary: "금고와 점수는 무엇이 다른지, 칸마다 무엇을 묻는지, 글자와 리그는 어떻게 정해지는지 차례로 풀었습니다.",
  },
  {
    slug: "accessibility",
    published: "2026-11-25",
    title: "접근성: 낭독기·동작 줄이기·키보드로 끝까지",
    summary: "시계를 늦추는 설정, 움직임을 줄이는 설정, 키보드와 화면 낭독기로 끝까지 하는 법. 우리가 놓쳤다가 고친 것들도 적었습니다.",
  },
  {
    slug: "free-plan-operations",
    published: "2026-11-25",
    title: "무료 플랜만으로 게임 운영하기(Render·Supabase)",
    summary: "서버 없이, 운영비 0원으로. 데이터베이스 안의 검증, 바이트 예산, 검사를 통과한 것만 나가는 배포, 그리고 부딪힌 한계.",
  },
  {
    slug: "three-languages",
    published: "2026-11-25",
    title: "3개 언어를 두 사람이 만든 방법(용어집·검사)",
    summary: "한국어를 원문으로 두고 영어·일본어를 끝까지 연 과정. 번역보다 용어집과 검사가 더 큰 일이 된 이유입니다.",
  },
  {
    slug: "sales-explanation-duty",
    published: "2026-11-25",
    title: "설명서 22쪽 가운데 4쪽: 금융상품을 팔 때 지켜야 할 것(일반론)",
    summary: "맞는 사람에게만 권하고, 알아듣게 설명하고, 틀린 말로 끌어들이지 않는다. 파는 쪽의 의무와, 우리가 창구 장면에 적은 숫자들.",
  },
  {
    slug: "earphone-sound-fixes",
    published: "2026-11-25",
    title: "이어폰으로 고친 배경음: 감정 음악 다섯 가지와 지직거림",
    summary: "「옛날 라디오처럼 찢어진다」는 후기에서 시작해, 2.7밀리초의 어긋남을 찾아내기까지. 11월에 소리를 세 번 고친 기록입니다.",
  },
  {
    slug: "choosing-tools",
    published: "2027-01-13",
    title: "도구 고르기: 조건 붙은 열두 도구와 다시 뽑기",
    summary: "어느 도구가 센가보다 내가 어디서 확정하는가. 손마다 달라지는 도구의 값을 측정 숫자로 따라가 봅니다.",
  },
  {
    slug: "npl-discount",
    published: "2026-11-25",
    title: "부실채권은 왜 원금의 몇 분의 1에 팔리나(일반론)",
    summary: "은행이 돌려받기 어려운 대출을 싸게 넘기는 이유와 값을 매기는 방식, 그리고 그 묶음 안에 들어 있는 이름들.",
  },
  {
    slug: "trimming-the-prose",
    published: "2026-11-25",
    title: "장면 본문을 덜어 낸 기록: 줄인 문장과 되살린 대사",
    summary: "프롤로그의 첫 장면 393자가 286자가 되기까지. 무엇을 덜어 내고, 무엇을 남기고, 무엇을 다시 되살렸는지 적었습니다.",
  },
  {
    slug: "stances-and-lock",
    published: "2026-11-25",
    title: "자세 셋과 LOCK: 어느 판에서 무엇을 쥐나",
    summary: "STRIKE, STEADY, EXPOSE는 비슷한 값을 내도록 맞췄지만 이기는 자리는 서로 다릅니다. 치는 방식별로 맞는 자세를 정리했습니다.",
  },
  // A draft: 2099-12-31 keeps it out of every build until its day is set (12-01 once 11-21~30 is filled in on 11-30).
  {
    slug: "november-2026-log",
    published: "2099-12-31",
    title: "11월 제작 일지: 무엇을 고쳤고 왜",
    summary: "360픽셀의 판돈 줄부터 시즌 단위 공개 결정, 새 규칙까지. 11월에 바꾼 것을 날짜순으로, 그날의 기록에서 골라 적었습니다.",
  },
];

/** The notes' byline, the makers' names as every plain page's foot prints them (src/credits.js). */
export const NOTE_AUTHOR = "SUPASONIC & ALICE";

/** Today in Seoul as YYYY-MM-DD: the day a note's `published` is compared with, whatever zone the build runs in. */
export function seoulDay(now = new Date()) {
  return new Date(now.getTime() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

/** The notes whose day has come by `day` (YYYY-MM-DD), newest first; on a shared day, the later in NOTES first. */
export function publishedNotes(day) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(day))) throw new Error(`notes: day must be YYYY-MM-DD, got ${day}`);
  return NOTES.map((note, at) => ({ note, at }))
    .filter(({ note }) => note.published <= day)
    .sort((a, b) => (a.note.published < b.note.published ? 1 : a.note.published > b.note.published ? -1 : b.at - a.at))
    .map(({ note }) => note);
}

/** The day a note last changed: `updated` when it has one, else the day it went out. */
export const noteDay = (note) => note.updated ?? note.published;

/** A note's address: `/notes/<slug>.html`. The list is `/notes/index.html`. */
export const notePath = (slug) => `/notes/${slug}.html`;
export const NOTES_INDEX_PATH = "/notes/index.html";

/** How many notes the start screen's reading section shows (src/homeReading.js). */
export const RECENT_NOTE_COUNT = 3;

/** The newest notes out by `day`, as the start screen lists them: `{ href, title, summary, day, date }`. */
export function recentNotes(day, count = RECENT_NOTE_COUNT) {
  return publishedNotes(day)
    .slice(0, count)
    .map((note) => ({ href: notePath(note.slug), title: note.title, summary: note.summary, day: note.published, date: koreanDate(note.published) }));
}

/** `2026년 11월 21일` */
export function koreanDate(day) {
  const [year, month, date] = String(day).split("-").map(Number);
  return `${year}년 ${month}월 ${date}일`;
}
