/**
 * The notes (노트): essays we write by hand, in Korean, one page each under
 * /notes/ (scripts/content-pages/notes.mjs writes them from the Markdown in
 * scripts/content-pages/notes/). This is their index: what the start screen's
 * reading section and the notes list need without the bodies.
 *
 * Each note has its own day (`published`, KST). A build writes only the notes
 * whose day has come, so a note written today and dated next week goes live
 * with the first build on or after that day (.github/workflows/notes-publish.yml
 * presses that build). Why the notes exist and why they go out a few a week
 * rather than all at once: cp-archive/메모-20261120/adsense-2차-분석.md, the
 * owner's decision 2026-11-20 「전부 1」.
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
    published: "2026-11-27",
    title: "손익계산서 두 장을 나란히 읽는 법",
    summary: "한 해 치만 보면 안 보이는 것들. 두 해를 나란히 놓고 어느 줄부터 비교하는지, 가상의 회사 숫자로 따라가 봅니다.",
  },
];

/** The notes' byline, the makers' names as every plain page's foot prints them (src/credits.js). */
export const NOTE_AUTHOR = "SUPASONIC & ALICE";

/** Today in Seoul as YYYY-MM-DD: the day a note's `published` is compared with, whatever zone the build runs in. */
export function seoulDay(now = new Date()) {
  return new Date(now.getTime() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

/** The notes whose day has come by `day` (YYYY-MM-DD), newest first. */
export function publishedNotes(day) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(day))) throw new Error(`notes: day must be YYYY-MM-DD, got ${day}`);
  return NOTES.filter((note) => note.published <= day).sort((a, b) => (a.published < b.published ? 1 : a.published > b.published ? -1 : 0));
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
