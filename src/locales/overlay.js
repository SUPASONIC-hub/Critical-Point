/**
 * How a language's words are put over the Korean (다국어 틀, 2026-10-26).
 * The same for every language: a dictionary (src/locales/<lang>/index.js)
 * and a case's scenes (src/locales/<lang>/nodes/<caseId>.js) say only words,
 * under the Korean's keys and ids. Only a page in another language loads this
 * file (src/locale.js), and through it that language's files.
 *
 * The Korean copy keeps its home and its shape. The modules that own screen
 * copy are left as they are, and their exported tables are written over in
 * place: the shell's (appCopy.js, playerLanguage.js, gameCases.js) when the
 * dictionary arrives, before the first paint, and the runtime's caseCopy.js
 * as it loads (it hands its tables to `localizeTables`; importing it here
 * would put the runtime's copy within the shell's reach, and the bundler
 * then splits the runtime differently). A case's scenes are written over as
 * the case arrives. Whatever a language leaves out stays Korean.
 */
import { INSTALL_HINT_COPY, playGuideItems, playStyleOptions, resourceMeta, triggerLabSignals } from "../appCopy.js";
import { easyCognitionLabels, easyResourceLabels } from "../playerLanguage.js";
import { CASE_SEQUENCE, caseObjectives, seasonCasesBase } from "../gameCases.js";

// Hangul, and the corner brackets only Korean copy uses (「」『』).
const HANGUL = /[가-힣ㄱ-ㅣ「-』]/;
const isRecord = (value) => Boolean(value) && typeof value === "object" && !Array.isArray(value);

/**
 * Writes the strings of `words` over `target` where the paths meet: an object
 * by key, a list by position, and a list of objects with ids (a scene's
 * cards, the season's case list) by id. Only a string replaces a string,
 * and only a Korean one (scripts/locale-words.mjs reads the same strings): an
 * id, an effect or a `next` can never be written over, and a path the Korean
 * no longer has is passed by.
 */
export function overlayWords(target, words) {
  if (!target || typeof target !== "object" || !words || typeof words !== "object") return target;
  if (Array.isArray(target) && isRecord(words)) {
    for (const item of target) overlayWords(item, words[item?.id]);
    return target;
  }
  for (const [key, value] of Object.entries(words)) {
    if (typeof value === "string") {
      if (typeof target[key] === "string" && HANGUL.test(target[key])) target[key] = value;
    } else {
      overlayWords(target[key], value);
    }
  }
  return target;
}

// The shell's tables a dictionary's `copy` may name, by module and export.
// Named one by one: a namespace import would keep every export of the module
// in the build, the ones the app never reads included.
const SHELL_TABLES = {
  appCopy: { INSTALL_HINT_COPY, playGuideItems, playStyleOptions, resourceMeta, triggerLabSignals },
  playerLanguage: { easyCognitionLabels, easyResourceLabels },
  gameCases: { caseObjectives, seasonCasesBase },
};

/**
 * A dictionary's `copy` for `module` over that module's tables (`copy.caseCopy.chapterRules` over `chapterRules`).
 * A table keyed by case (the copy between cases, the case list) is laid over
 * only up to the preview's last case: the words for the cases after it wait
 * in the dictionary, and those cases keep their Korean with their scenes.
 */
export function overlayModule(copy, module, tables, through = dictionary?.previewThrough) {
  for (const [name, words] of Object.entries(copy?.[module] ?? {})) overlayWords(tables[name], previewWords(words, through));
}

function previewWords(words, through) {
  if (!through || !isRecord(words)) return words;
  return Object.fromEntries(Object.entries(words).filter(([key]) => !CASE_SEQUENCE.includes(key) || inPreview(key, through)));
}

let dictionary = null;
let language = null;
// The language's copy between cases for the cases after 사건 10
// (`<lang>/between/<first>-<last>.js`), the files the preview reaches.
let between = [];

/**
 * A language still in preview names its last case (`previewThrough` in its
 * dictionary). A case after it keeps its Korean, whatever files the language
 * has; without one, every case the language has a file for is shown.
 */
export function inPreview(caseId, through = dictionary?.previewThrough) {
  if (!through) return true;
  const at = CASE_SEQUENCE.indexOf(caseId);
  return at < 0 || at <= CASE_SEQUENCE.indexOf(through);
}

/** `{last}` and `{next}` of a preview line: the numbers of the preview's last case and of the case after it. */
export function fillPreview(text, through = dictionary?.previewThrough) {
  if (!through || typeof text !== "string") return text;
  const number = (caseId) => String(caseId ?? "").replace(/^case/, "");
  const next = CASE_SEQUENCE[CASE_SEQUENCE.indexOf(through) + 1];
  return text.replace(/\{last\}/g, number(through)).replace(/\{next\}/g, number(next));
}

/** The panel after the preview's last case says the English stops there (F-3, F-8 choice 1). */
export function markPreviewEnd(signals, preview, through) {
  const signal = through && signals?.[through];
  if (!signal || !preview?.endPremiseLead) return;
  signal.eyebrow = preview.endEyebrow ?? signal.eyebrow;
  signal.button = preview.endButtons?.korean ?? signal.button;
  signal.premise = `${fillPreview(preview.endPremiseLead, through)} ${signal.premise ?? ""}`.trim();
}

/** A module's own tables (caseCopy.js), as it loads. */
export function localizeTables(module, tables) {
  if (!dictionary) return;
  for (const source of [dictionary, ...between]) overlayModule(source.copy, module, tables);
  if (module === "caseCopy") markPreviewEnd(tables.nextCaseSignals, dictionary.preview, dictionary.previewThrough);
}

export function previewText(key) {
  return fillPreview(dictionary?.preview?.[key] ?? "");
}

/** A speaker's role in the loaded language: the dictionary's `roles`, then the `caseRoles` of the cases in the preview. */
export function roleName(role) {
  return dictionary?.roles?.[role] ?? caseRole(between, role) ?? role;
}

/** A role from the `caseRoles` of between/ files, for a case in the preview; undefined when none names it. */
export function caseRole(parts, role, through = dictionary?.previewThrough) {
  for (const part of parts) {
    for (const [caseId, table] of Object.entries(part?.caseRoles ?? {})) {
      if (table?.[role] && inPreview(caseId, through)) return table[role];
    }
  }
  return undefined;
}

export function speakerName(name) {
  return dictionary?.speakers?.[name] ?? name;
}

/**
 * One case's scenes, replies and lines, and its pack's result copy in the
 * season's index. A scene whose speaker the dictionary names (`speakers`) is
 * given `speakerName`, the name the page prints; `speaker` stays the Korean
 * key of the portrait, the profile and the run log.
 */
export function localizeCase(caseId, data, index, words, speakers = {}) {
  for (const scene of Object.values(data?.nodes ?? {})) {
    if (speakers[scene?.speaker]) scene.speakerName = speakers[scene.speaker];
  }
  if (!words) return data;
  overlayWords(data, { nodes: words.nodes, echoReplies: words.echoReplies, choiceVoiceLines: words.choiceVoiceLines });
  const pack = index?.packs?.find((entry) => entry.id === caseId);
  if (pack && words.pack) overlayWords(pack, words.pack);
  return data;
}

/**
 * A case as it arrives, in the loaded language; a case with no file, one that
 * cannot be fetched, or one after the preview keeps its Korean scenes (and,
 * after the preview, its Korean speaker names).
 */
export function localizeCaseData(caseId, data, index) {
  if (!inPreview(caseId)) return data;
  const speakers = dictionary?.speakers;
  const load = language && import.meta.glob("./*/nodes/*.js")[`./${language}/nodes/${caseId}.js`];
  if (!load) return localizeCase(caseId, data, index, null, speakers);
  return load().then(
    (module) => localizeCase(caseId, data, index, /** @type {{ default: object }} */ (module).default, speakers),
    () => localizeCase(caseId, data, index, null, speakers),
  );
}

const api = { localizeTables, previewText, roleName, speakerName, localizeCaseData };

/** A language's dictionary, laid over the shell's tables. Resolves to what src/locale.js calls, or null for a language with no dictionary. */
export function loadDictionary(lang) {
  const load = import.meta.glob("./*/index.js")[`./${lang}/index.js`];
  if (!load) return Promise.resolve(null);
  return load().then((module) => {
    const through = /** @type {{ previewThrough?: string }} */ (module).previewThrough;
    const parts = betweenFiles(import.meta.glob("./*/between/*.js"), lang, through);
    // A file that cannot be fetched leaves its cases' copy Korean, like a case's scenes.
    return Promise.all(parts.map((get) => get().catch(() => null))).then((loaded) => {
      dictionary = module;
      language = lang;
      between = loaded.filter(Boolean);
      for (const source of [dictionary, ...between]) {
        for (const [name, tables] of Object.entries(SHELL_TABLES)) overlayModule(source.copy, name, tables);
      }
      addStyle(dictionary.style);
      return api;
    });
  });
}

/**
 * Of a language's copy-between-cases files (`<lang>/between/case11-20.js`,
 * named by their first and last case), the ones whose first case is in the
 * preview: the rest are never fetched, so the words for cases the preview has
 * not reached cost an English page nothing.
 */
export function betweenFiles(files, lang, through) {
  return Object.entries(files)
    .filter(([file]) => {
      const first = /\/(case\d{2})-\d{2}\.js$/.exec(file)?.[1];
      return file.startsWith(`./${lang}/between/`) && Boolean(first) && inPreview(first, through);
    })
    .map(([, get]) => get);
}

/**
 * A language's own CSS (its dictionary's `style`), put on its pages before
 * the first paint: the Japanese page's face, the system's Japanese fonts,
 * since Pretendard has no kanji and a kanji subset would outweigh the whole
 * first-paint budget (일본어 1단계). Kept in the language's chunk, not the
 * app's stylesheet, so a Korean page's CSS stays byte for byte what it was.
 */
export function addStyle(css) {
  if (!css || !globalThis.document?.head) return;
  const element = document.createElement("style");
  element.textContent = css;
  document.head.append(element);
}
