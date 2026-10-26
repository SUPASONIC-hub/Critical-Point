/**
 * The Korean side of every other language (다국어 틀; 영어판 1단계,
 * 2026-10-26): which Korean strings a language's files answer, read the way
 * the app is shipped them. The same for every language (src/locale.js,
 * `SUPPORTED_LOCALES`).
 *
 * A language's case file (src/locales/<lang>/nodes/<caseId>.js) holds only
 * words, under the same ids as the Korean: `nodes.<scene id>.text`,
 * `nodes.<scene id>.choices.<card id>.label`, `echoReplies.<card id>`, and the
 * case pack's `clue` / `outcomes` / `continuityChallenges` under `pack`. Ids,
 * effects, `next` and cognition stay in the Korean file alone, so the table,
 * the score and the ranking do not depend on the language. The shape is the
 * built season's (scripts/season-split.mjs --emit-json), not the authored
 * file's: a generated scene's words are there too, and its id is the one the
 * app looks up.
 *
 * `speaker` is left out on purpose: it is a key (portraits, profiles, the run
 * log), and the name a page prints is the dictionary's (`speakers` in
 * src/locales/<lang>/index.js), put on at display time.
 *
 * The screen copy is read the same way from the modules that own it
 * (`readCopySource`), for the dictionary's `copy`.
 */
/** The cases a language is checked over until it says otherwise: the preview's 프롤로그 01-05 and 사건 01-10 (F-1 ①). */
import { existsSync, readdirSync } from "node:fs";

export const TRANSLATION_SCOPE = [
  "prologue01", "prologue02", "prologue03", "prologue04", "prologue05",
  "case01", "case02", "case03", "case04", "case05", "case06", "case07", "case08", "case09", "case10",
];

const HANGUL = /[가-힣ㄱ-ㅣ]/;
/** Keys whose strings are not words a player reads in this language. */
const KEY_FIELDS = new Set(["speaker", "id", "next", "caseId", "kind", "phase", "mood", "status", "cardOf"]);

export const hasHangul = (value) => typeof value === "string" && HANGUL.test(value);

/**
 * The Korean words of a value, in the shape an English file answers: objects
 * keep their keys, a list of objects with ids becomes an object keyed by id,
 * any other list keeps its positions (null where nothing is to be said).
 * Returns undefined when there is nothing to translate.
 */
export function wordsOf(value, key = "") {
  if (KEY_FIELDS.has(key)) return undefined;
  if (typeof value === "string") return hasHangul(value) ? value : undefined;
  if (Array.isArray(value)) {
    if (value.length && value.every((item) => item && typeof item === "object" && !Array.isArray(item) && typeof item.id === "string")) {
      return objectOf(value.map((item) => [item.id, wordsOf(item)]));
    }
    const list = value.map((item) => wordsOf(item));
    return list.some((item) => item !== undefined) ? list.map((item) => item ?? null) : undefined;
  }
  if (value && typeof value === "object") return objectOf(Object.entries(value).map(([childKey, child]) => [childKey, wordsOf(child, childKey)]));
  return undefined;
}

function objectOf(entries) {
  const kept = entries.filter(([, child]) => child !== undefined);
  return kept.length ? Object.fromEntries(kept) : undefined;
}

/** `{ "nodes.start.text": "…" }`: every string of an English or Korean words object, by path. */
export function flatten(value, prefix = "", out = {}) {
  if (typeof value === "string") out[prefix] = value;
  else if (Array.isArray(value)) value.forEach((item, index) => item !== null && flatten(item, `${prefix}[${index}]`, out));
  else if (value && typeof value === "object") {
    for (const [key, child] of Object.entries(value)) flatten(child, prefix ? `${prefix}.${key}` : key, out);
  }
  return out;
}

/** One case's Korean words: its built scenes, replies and lines, and its pack's result copy. */
export function caseSource(runtimeData, caseId) {
  const data = runtimeData.cases[caseId];
  const pack = runtimeData.index.packs.find((entry) => entry.id === caseId) ?? {};
  return wordsOf({
    nodes: data.nodes,
    echoReplies: data.echoReplies,
    choiceVoiceLines: data.choiceVoiceLines,
    pack: { clue: pack.clue, outcomes: pack.outcomes, continuityChallenges: pack.continuityChallenges },
  }) ?? {};
}

const pick = (table, ids) => Object.fromEntries(ids.filter((id) => table[id] !== undefined).map((id) => [id, table[id]]));

/** The screen copy in scope: the season's copy between cases for the cases in `scope`, and the play guide's tables. */
export async function readCopySource(root = "..", scope = TRANSLATION_SCOPE) {
  const [caseCopy, appCopy, playerLanguage, gameCases] = await Promise.all([
    import(`${root}/src/caseCopy.js`),
    import(`${root}/src/appCopy.js`),
    import(`${root}/src/playerLanguage.js`),
    import(`${root}/src/gameCases.js`),
  ]);
  // The screens' own copy (src/copy/<name>.js, each a default export laid
  // over as `copy.screens.<name>`).
  const copyDir = new URL("src/copy/", `${root}/`);
  const screenFiles = existsSync(copyDir) ? readdirSync(copyDir).filter((file) => file.endsWith(".js")).sort() : [];
  const screens = Object.fromEntries(
    await Promise.all(screenFiles.map(async (file) => [file.replace(/\.js$/, ""), (await import(new URL(file, copyDir).href)).default])),
  );
  return wordsOf({
    screens,
    caseCopy: {
      chapterRules: pick(caseCopy.chapterRules, scope),
      nextCaseSignals: pick(caseCopy.nextCaseSignals, scope),
      caseIntroEchoes: pick(caseCopy.caseIntroEchoes, scope),
      legacyProfiles: caseCopy.legacyProfiles,
      tableReactions: caseCopy.tableReactions,
    },
    appCopy: {
      resourceMeta: appCopy.resourceMeta,
      playStyleOptions: appCopy.playStyleOptions,
      playGuideItems: appCopy.playGuideItems,
      triggerLabSignals: pick(appCopy.triggerLabSignals, scope),
    },
    playerLanguage: {
      easyResourceLabels: playerLanguage.easyResourceLabels,
      easyCognitionLabels: playerLanguage.easyCognitionLabels,
    },
    gameCases: {
      caseObjectives: pick(gameCases.caseObjectives, scope),
      seasonCasesBase: gameCases.seasonCasesBase.filter((entry) => scope.includes(entry.id)),
    },
  }) ?? {};
}

/**
 * Korean money in the units English counts in: 310억 is 31 billion, 4000만
 * 40 million (G-6: 억 원 = 100 million won). Only for comparing digits.
 */
function inEnglishUnits(text) {
  // A month is a word in English ("4월 27일" -> "April 27"), and 만 after a
  // small figure is "only" ("첨부 7만"), not ten thousand.
  const months = text.replace(/\d{1,2}월/g, "월");
  return months.replace(/(\d+(?:\.\d+)?)\s*(조|억|만(?=\s*원)|(?<=\d{3})만)/g, (match, figure, unit) => {
    const value = Number(figure) * { 조: 1e12, 억: 1e8, 만: 1e4 }[unit];
    const scaled = value >= 1e12 ? value / 1e12 : value >= 1e9 ? value / 1e9 : value >= 1e6 ? value / 1e6 : value;
    return String(Number(scaled.toFixed(3)));
  });
}

/**
 * What a language's words leave unanswered against their Korean source:
 * `missing` (no translation, an empty one, or one still in Hangul), `stale`
 * (a path the Korean no longer has) and `numbers` (a string missing a digit
 * the Korean has: canon numbers are never changed, G-1 2).
 */
export function compareWords(source, english) {
  const ko = flatten(source);
  const en = flatten(english ?? {});
  const missing = [];
  const numbers = [];
  for (const [path, text] of Object.entries(ko)) {
    const answer = en[path];
    if (typeof answer !== "string" || !answer.trim() || hasHangul(answer)) {
      missing.push(path);
      continue;
    }
    const digits = (value) => (value.match(/\d+/g) ?? []).map((run) => run.replace(/^0+(?=\d)/, "")).sort().join(" ");
    const koDigits = digits(inEnglishUnits(text.replace(/(\d),(?=\d{3})/g, "$1")));
    const enDigits = digits(answer.replace(/(\d),(?=\d{3})/g, "$1"));
    if (koDigits && !koDigits.split(" ").every((run) => enDigits.split(" ").includes(run))) numbers.push(path);
  }
  const stale = Object.keys(en).filter((path) => !(path in ko));
  return { total: Object.keys(ko).length, missing, stale, numbers };
}
