/**
 * E-11 번외 사건: the side cases, outside the season.
 *
 * A side case is a short case of its own -- 8 to 12 scenes, one table, three
 * endings -- that opens at its place in the main story (2026-11-18 「현재
 * 준비된 번외 스토리 전부 공개해줘. 스토리 흐름 순서에 맞게 곳곳에.」): each
 * entry's `unlockAfter` is the season case whose in-world date comes just
 * before the side case's own (the dates below; tests/unit/side-cases.test.mjs
 * holds the order), and the side case is open on a device
 * once that case is closed in the run, once a finale is closed (NEW GAME+), or
 * once the side case is in the device's side record (`isSideCaseOpen`,
 * src/sideCases.js). Nothing is placed before 프롤로그 01, so a new player
 * meets none before the first case. Until 11-18 the slot opened only on a
 * closed finale. It is not in `CASE_SEQUENCE` and not in
 * `CASE_PACKS`, so adding one changes no season number: the score's ceiling,
 * the goals, the titles, the ranking and its tables stay as they are
 * (E11-번외사건-설계안 4절). Its id is `sideNN`, never `caseNN`: the server
 * accepts only `^case[0-9]{2}$` as a season case (`is_season_case_id`), so a
 * side row that ever reached it would be refused there too.
 *
 * This list is what the start screen's slot reads. Each entry is the case's
 * label and title, and `load`, which fetches the case file as its own chunk
 * the first time the case is opened. A release lists 번외 1 (side01, 2025년 12월
 * 20일 토요일), 번외 2 (side02, 2026년 1월 9일 금요일), 번외 3 (side03, 2025년 11월 8일 토요일), 번외
 * 4 (side04, 2025년 12월 11일 목요일), 번외 5 (side05, 2026년 2월 12일 목요일), 번외 6 (side06,
 * 2026년 5월 8일 금요일), 번외 7 (side07, 2026년 6월 12일 금요일), 번외 8 (side08, 2026년 7월 10일 금요일) and 번외 9 (side09,
 * 2026년 8월 13일 목요일) since their pull
 * requests; the slot is hidden while none is open (설계안 질문 7 (1)). In
 * story order they open after 사건 14 (번외 3), 16 (번외 4), 17 (번외 1), 18
 * (번외 2), 21 (번외 5), 27 (번외 6), 31 (번외 7), 34 (번외 8) and 40 (번외 9).
 * New content is released as a "Season" on a date the owner chooses, all at
 * once; there is no fixed monthly schedule (docs/work-status.md).
 *
 * `side00` is the framework's placeholder, not a case: it exists so the slot,
 * the side screen and the e2e test have something to open. It is listed only in
 * a debug build (the dev server) visited with `?side-fixture=1`; a release
 * folds `__CP_DEBUG_BUILD__` to false and drops the entry and its chunk.
 *
 * A page in another language reads the label and title from its dictionary
 * (`copy.sidePacks`, laid over this list before the first paint) and a side
 * case's scenes and endings from src/locales/<lang>/nodes/sideNN.js as the
 * case arrives (`localizeSidePack`, src/locale.js). The Korean label stays
 * 「번외 N」 (state/sidePackCheck.js).
 */
import { localizeSidePack } from "../locale.js";

const sideFixtureListed =
  typeof __CP_DEBUG_BUILD__ !== "undefined" &&
  __CP_DEBUG_BUILD__ &&
  new URLSearchParams(globalThis.location?.search ?? "").get("side-fixture") === "1";

/**
 * The next Season (2026-11-20 owner's answer: the first December Season opens
 * 2026-12-14, Monday, 00:00 KST). A side case written for it carries
 * `opensAt: NEXT_SEASON.opensAt`: the release ships it ahead (ops mode merges
 * on Tuesday and Friday only, docs/ops-mode.md), and the start screen keeps it
 * shut until that moment on the weekly clock (`releasedSides`,
 * src/sideCases.js), with a notice line from `noticeDays` before
 * (`seasonNoticeAt`). A Season is content and a release date, never a rule
 * number: no CASE_SEQUENCE, ranking or RULES_MARK change rides on it. While no
 * entry names it, nothing shows. A test build holds the weekly clock on
 * 2026-01-07, so its e2e spec moves `__weeklyRuleClock` past `opensAt`.
 */
export const NEXT_SEASON = Object.freeze({ id: "2026-12", opensAt: Date.parse("2026-12-14T00:00:00+09:00"), noticeDays: 7 });

export const SIDE_CASES = Object.freeze([
  { id: "side01", label: "번외 1", title: "아직 찾아가지 못한 일곱 명", unlockAfter: "case17", load: () => import("./side01.js").then(({ side01 }) => localizeSidePack(side01)) },
  { id: "side02", label: "번외 2", title: "돌려줄 것", unlockAfter: "case18", load: () => import("./side02.js").then(({ side02 }) => localizeSidePack(side02)) },
  { id: "side03", label: "번외 3", title: "보통의 밤", unlockAfter: "case14", load: () => import("./side03.js").then(({ side03 }) => localizeSidePack(side03)) },
  { id: "side04", label: "번외 4", title: "연말 정산", unlockAfter: "case16", load: () => import("./side04.js").then(({ side04 }) => localizeSidePack(side04)) },
  { id: "side05", label: "번외 5", title: "상장 전야", unlockAfter: "case21", load: () => import("./side05.js").then(({ side05 }) => localizeSidePack(side05)) },
  { id: "side06", label: "번외 6", title: "보증금", unlockAfter: "case27", load: () => import("./side06.js").then(({ side06 }) => localizeSidePack(side06)) },
  { id: "side07", label: "번외 7", title: "금요일 17시 58분", unlockAfter: "case31", load: () => import("./side07.js").then(({ side07 }) => localizeSidePack(side07)) },
  { id: "side08", label: "번외 8", title: "정상화", unlockAfter: "case34", load: () => import("./side08.js").then(({ side08 }) => localizeSidePack(side08)) },
  { id: "side09", label: "번외 9", title: "92일", unlockAfter: "case40", load: () => import("./side09.js").then(({ side09 }) => localizeSidePack(side09)) },
  { id: "side10", label: "번외 10", title: "인사 없이", unlockAfter: "case05", opensAt: NEXT_SEASON.opensAt, load: () => import("./side10.js").then(({ side10 }) => localizeSidePack(side10)) },
  { id: "side11", label: "번외 11", title: "부표까지", unlockAfter: "case42", opensAt: NEXT_SEASON.opensAt, load: () => import("./side11.js").then(({ side11 }) => localizeSidePack(side11)) },
  ...(sideFixtureListed
    ? [{ id: "side00", label: "번외 0", title: "틀 확인용 번외 사건", fixture: true, load: () => import("./side00.js").then(({ side00 }) => localizeSidePack(side00)) }]
    : []),
]);
