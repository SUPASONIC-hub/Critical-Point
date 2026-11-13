import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import * as espree from "espree";

/**
 * E4 (11-10, "en·ja 화면 문구 검사 한 번 더"): a Korean word written straight
 * into a screen, a hook or a view model never reaches the overlay
 * (src/locales/overlay.js), so it is printed in Korean on the English and
 * Japanese pages too. The recovery center (components/ErrorLogPanel.jsx), the
 * session code's 「복사됨」 and the remote-save queue's 「… 사건 로그」 were
 * such words. A screen's words belong in its copy module (src/copy/*.js),
 * which a language lays its dictionary over; this test reads every string
 * literal and JSX text of src/ outside the copy and the scenes and fails on
 * Hangul that is not one of the kinds listed here.
 */
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const HANGUL = /[가-힣ㄱ-ㅣ]/;

// Folders of words the overlay lays a language over (or the dev-only music lab).
const WORD_FOLDERS = /^src\/(copy|nodes|locales|dev)\//;

/**
 * Modules whose Korean is a source table another module lays a language over
 * (named from src/copy/*.js or by the overlay itself), a key or a pattern the
 * code matches Korean text with, or a record kept in Korean on purpose.
 */
const KOREAN_MODULES = {
  "src/ads/adSlotWords.js": "the ad box's words in all three languages, picked by appliedLocale() (kept out of the dictionaries so a build without ads is main's)",
  "src/advancedSystems.js": "OPERATOR_PROFILES and ORIGIN_PROLOGUES, laid over through src/copy/intro.js",
  "src/appConfig.js": "DELETION_REQUEST_COPY (src/copy/cloudSaveBody.js) and the default names a row keeps in Korean (ranking.js shows them in the page's words)",
  "src/appCopy.js": "the shell's tables, laid over before the first paint",
  "src/boardBlockedTerms.js": "the board's blocked words: a filter, never printed",
  "src/boardReport.js": "the report reasons and refusals, laid over through src/copy/board.js",
  "src/caseCopy.js": "the runtime's case tables, laid over as they load (localizeTables)",
  "src/castAliases.js": "the 11-13 renames: old and new speaker names as data, and Korean particles a saved line is fixed with (en and ja have their own tables beside them)",
  "src/components/coldOpeningCopy.js": "the Korean beside src/locales/<lang>/coldOpening.js",
  "src/components/musicData.js": "speaker names as keys",
  "src/components/proseMarks.js": "patterns for Korean prose",
  "src/gameCases.js": "the season's case list, laid over before the first paint",
  "src/gameConstants.js": "triggerLabels (src/copy/table.js) and cognitionLabels (keys only)",
  "src/gameData.js": "scene fallbacks; npm run check:locale counts them with the scenes",
  "src/gameDialogue.js": "the character profiles, laid over from src/locales/<lang>/late/",
  "src/gameLogic.js": "speechifyChoice turns a Korean label only, and the spine's unprinted Korean fields",
  "src/hallOfFame.js": "the docs' Korean hall of fame (scripts/verify-ranking-rows.mjs), not a screen",
  "src/hallOfFameBadges.js": "hallOfFameBoardLabel, read only by the docs' hall of fame",
  "src/playerLanguage.js": "the shell's plain labels, laid over before the first paint",
  "src/privacyText.js": "patterns for Korean names and the labels src/copy/report.js lays over",
  "src/scenePlate.js": "Korean places and clocks a scene's plate is picked by (sourcePlace, sourceClock)",
  "src/seasonRules.js": "branch condition notes nothing prints",
  "src/shellNotices.js": "laid over under screens.notices.save",
  "src/speakerPortraits.js": "speaker names as keys",
  "src/state/sidePackCheck.js": "E-11: a side pack's problems for scripts/validate-game-graph.mjs and the dev fixture, never printed on a screen; the label it checks is the pack's own data (a side case's words are its pack's, src/nodes/sidePacks.js)",
  "src/state/seasonRecord.js": "VERDICT_NAMES, the record's Korean; src/copy/seasonLines.js prints the page's",
  "src/state/useBoard.js": "a link pattern",
};

/** Single words kept in Korean where they are, and why. */
const KEPT_WORDS = {
  "src/components/GameWordmark.jsx": { "\"임계점\"": "the title's Korean reading, as every page's wordmark carries it" },
  "src/components/LanguagePicker.jsx": { "\"언어 · Language\"": "the picker is named in both languages" },
  "src/credits.js": { "\"찹쌀떡\"": "the studio's Korean name, on the Korean page only" },
  "src/locale.js": { "\"한국어\"": "the Korean page's name in the picker" },
  "src/state/errorRecovery.js": { "} 에러 로그`": "a queued error row's own label; src/screens/ReportArchive.jsx prints the page's (report.session.errorRow)" },
  "src/state/useChoiceCommit.js": { "\"익명 분석관\"": "the name a sent row carries (the server sets it too)" },
  "src/viewModels/seasonViewModels.js": { "\"익명 분석관\"": "the name a sent row carries (the server sets it too)" },
  "src/runtimeSystems.js": Object.fromEntries(["}에서 ${", "\"선택 없음\"", "} 처리 후 대기 큐 ${", "}건`"].map((word) => [word, "REPLAY DIAGNOSTICS, a debug build's"])),
  "src/screens/IntroScreen.jsx": Object.fromEntries(["에러 로그", "테스트용 전체 사건 열기", "\"개발용 장면 바로 시작\"", "특정 장면 바로 시작", "\"디버그 사건 선택\"", "\"디버그 장면 선택\"", "장면 시작"].map((word) => [word, "debug build only"])),
  "src/screens/PlayScreen.jsx": { "\"개발자 진행 추적\"": "debug build only" },
  "src/screens/ReportArchive.jsx": Object.fromEntries(["\"운영 진단\"", "\"플레이테스트 상태\"", "완료 사건", "재전송 대기", "로컬 오류", "분리된 런"].map((word) => [word, "debug build only"])),
  "src/screens/ResultScreen.jsx": Object.fromEntries(["에러 로그", "\"진단 로그에는 원문 선택 로그, 피드백 원문, 에러 stack, DOM 스냅샷, 복구 슬롯이 포함됩니다. 내보낼까요?\"", "진단 로그"].map((word) => [word, "debug build only"])),
};

function sourceFiles(dir) {
  return readdirSync(dir).flatMap((name) => {
    const file = path.join(dir, name);
    if (statSync(file).isDirectory()) return sourceFiles(file);
    return /\.(js|jsx)$/.test(name) ? [file] : [];
  });
}

/** Every string literal, template piece and JSX text with Hangul in a file, trimmed. */
function koreanWords(file) {
  const tokens = espree.tokenize(readFileSync(file, "utf8"), { ecmaVersion: "latest", sourceType: "module", ecmaFeatures: { jsx: true } });
  return tokens.filter((token) => ["String", "Template", "JSXText"].includes(token.type) && HANGUL.test(token.value)).map((token) => token.value.trim());
}

const files = sourceFiles(path.join(root, "src"))
  .map((file) => [path.relative(root, file).split(path.sep).join("/"), file])
  .filter(([relative]) => !WORD_FOLDERS.test(relative));

test("no screen, hook or view model writes a Korean word the overlay cannot reach", () => {
  const found = [];
  for (const [relative, file] of files) {
    if (Object.hasOwn(KOREAN_MODULES, relative)) continue;
    const kept = KEPT_WORDS[relative] ?? {};
    for (const word of koreanWords(file)) if (!Object.hasOwn(kept, word)) found.push(`${relative}: ${word}`);
  }
  assert.deepEqual(found, [], "move these into the screen's copy module (src/copy/*.js) and give src/locales/en and ja their words");
  assert.ok(files.length > 100, `the sweep read ${files.length} files`);
});

test("every module and word kept in Korean is still there, so the lists cannot go stale", () => {
  const present = new Map(files);
  for (const name of Object.keys(KOREAN_MODULES)) {
    assert.ok(present.has(name), `${name} is gone; take it off KOREAN_MODULES`);
    assert.ok(koreanWords(present.get(name)).length > 0, `${name} has no Korean left; take it off KOREAN_MODULES`);
  }
  for (const [name, kept] of Object.entries(KEPT_WORDS)) {
    assert.ok(present.has(name), `${name} is gone; take it off KEPT_WORDS`);
    const words = new Set(koreanWords(present.get(name)));
    for (const word of Object.keys(kept)) assert.ok(words.has(word), `${name}: ${word} is gone; take it off KEPT_WORDS`);
  }
});
