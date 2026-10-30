/**
 * E-11 번외 사건: the side cases, outside the season.
 *
 * A side case is a short case of its own -- 8 to 12 scenes, one table, three
 * endings -- that a device opens once it has closed a finale
 * (`isSideSlotOpen`, src/sideCases.js). It is not in `CASE_SEQUENCE` and not in
 * `CASE_PACKS`, so adding one changes no season number: the score's ceiling,
 * the goals, the titles, the ranking and its tables stay as they are
 * (E11-번외사건-설계안 4절). Its id is `sideNN`, never `caseNN`: the server
 * accepts only `^case[0-9]{2}$` as a season case (`is_season_case_id`), so a
 * side row that ever reached it would be refused there too.
 *
 * This list is what the start screen's slot reads. Each entry is the case's
 * label and title, and `load`, which fetches the case file as its own chunk
 * the first time the case is opened. A release lists 번외 1 (side01, 2025년
 * 12월 20일 토요일) since its pull request; the slot is hidden while the list
 * is empty (설계안 질문 7 (1)).
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

export const SIDE_CASES = Object.freeze([
  { id: "side01", label: "번외 1", title: "아직 찾아가지 못한 일곱 명", load: () => import("./side01.js").then(({ side01 }) => localizeSidePack(side01)) },
  ...(sideFixtureListed
    ? [{ id: "side00", label: "번외 0", title: "틀 확인용 번외 사건", fixture: true, load: () => import("./side00.js").then(({ side00 }) => localizeSidePack(side00)) }]
    : []),
]);
