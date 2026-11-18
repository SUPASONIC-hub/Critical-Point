/**
 * N29 (2차 개선점, 2026-11-16 「전부 1」): what it costs to write a case.
 *
 * 번외 8 (#569) took more than a day -- portraits, en/ja, the canon row, the
 * credits -- and 11-15's writing-a-case.md came back with 938 lines pasted
 * into it twice (#572). This module is the pure half of two commands:
 *
 *   npm run new:case -- side09 "제목" [--en=Title] [--ja=タイトル] [--dry-run]
 *       (scripts/new-case.mjs) writes a side case's skeleton: the Korean pack
 *       after side00's shape, the en/ja word files with the same ids, the
 *       side list's line (src/nodes/sidePacks.js), the side list's label and
 *       title in both dictionaries, a canon section and a portrait-credits
 *       row to fill. Every string it writes says TODO, so check:case finds
 *       what is left.
 *   npm run check:case -- [ids...]   (scripts/check-case.mjs) warns on what
 *       writing-a-case.md's checklist asks by hand: en/ja keys missing,
 *       speakers without a portrait (a silhouette), `$` in a case's words
 *       (18장: money in a scene is 원), text over 420 characters, TODO left,
 *       a canon section that does not match the pack, and a block of a case
 *       document pasted twice. A warning only: it always exits 0 (Q6 (1),
 *       「처음엔 경고만」).
 *
 * Season cases (caseNN) are not scaffolded: putting one on the season is
 * writing-a-case.md 6장 (gameCases.js six places, the server's case list
 * migration), not a template. check:case reads them all the same.
 */

/** sideNN -> 8 (the number a label says, 「번외 8」). Null for anything else. */
export function sideNumber(id) {
  const match = /^side(\d{2})$/.exec(String(id ?? ""));
  return match ? Number(match[1]) : null;
}

/** The next free side id after the ones given (side00 is the fixture and counts). */
export function nextSideId(ids) {
  const used = ids.map(sideNumber).filter((value) => value !== null);
  const next = (used.length ? Math.max(...used) : 0) + 1;
  return `side${String(next).padStart(2, "0")}`;
}

const json = (value) => JSON.stringify(value);

/**
 * The skeleton's eight scenes, the fewest a side case has (8 to 12,
 * `checkSidePack`): a briefing, six in a line, the aftershock. Rename,
 * branch and add as the case needs; check:graph walks whatever is written.
 */
export const SKELETON_SCENES = ["start", "scene2", "scene3", "scene4", "scene5", "scene6", "scene7", "aftershock"];
const CARD_EFFECTS = [["a", "{ time: -4, trust: 4, fatigue: 2 }"], ["b", "{ time: -6, legitimacy: 4, fatigue: 2 }"], ["c", "{ time: 2, trust: -3, fatigue: 1 }"]];
const ENDING_EFFECTS = [["a", "{ trust: 3 }"], ["b", "{ legitimacy: 3 }"], ["c", "{ time: 2 }"]];

/**
 * The Korean pack of a new side case: three scenes in side00's shape
 * (src/nodes/side00.js; state/sidePackCheck.js `checkSidePack`), the last of
 * them `sN_aftershock` with the three cards whose ids name the endings. The
 * speaker is 반재욱, a season speaker with a portrait, until the case's own
 * people are written: a new speaker needs a portrait the same day (13장).
 */
export function sidePackSource({ id, title }) {
  const n = sideNumber(id);
  if (n === null) throw new Error(`"${id}" is not a side case id (sideNN).`);
  const p = `s${n}_`;
  const label = `번외 ${n}`;
  const card = (cardId, next, effect) => `        { id: ${json(cardId)}, label: "TODO 카드 라벨", effect: ${effect}, cognition: { inference: 1 }, next: ${json(next)} },`;
  const scene = (sceneId, { phase, kind, next, cards }) => [
    `    ${sceneId}: {`,
    `      phase: ${json(phase)},`,
    `      title: "TODO 장면 제목",`,
    `      speaker: "반재욱",`,
    `      kind: ${json(kind)},`,
    `      place: "TODO 건물 · 방",`,
    `      clock: "TODO 시각",`,
    `      question: "TODO 이 장면의 질문을 씁니다.",`,
    ...(kind === "briefing" ? [`      lead: "TODO 처음 읽는 사람을 위한 한 줄을 씁니다.",`] : []),
    `      text: "TODO 장면 본문을 씁니다(길이와 금액 표시는 writing-a-case.md를 따릅니다).",`,
    `      memo: ["TODO 메모 한 줄"],`,
    `      triggers: ["trust"],`,
    `      choices: [`,
    ...cards.map(([suffix, effect]) => card(`${sceneId === `${p}aftershock` ? `${p}after_` : `${sceneId}_`}${suffix}`, next, effect)),
    `      ],`,
    `    },`,
  ];
  return [
    "/**",
    ` * ${label}, ${title} -- TODO: when and where it is set, and what it states for`,
    ` * the first time (docs/canon.md 「${label}, ${title} (${id})」). Written from`,
    " * the skeleton `npm run new:case` makes; side00.js says the shape.",
    " */",
    `export const ${id} = {`,
    `  id: ${json(id)},`,
    `  label: ${json(label)},`,
    `  title: ${json(title)},`,
    `  startNode: ${json(`${p}start`)},`,
    "  startState: {",
    "    resources: { time: 60, capital: 80, trust: 50, legitimacy: 50, humanCost: 10, fatigue: 20 },",
    "  },",
    "  nodes: {",
    ...SKELETON_SCENES.flatMap((name, index) => {
      const last = index === SKELETON_SCENES.length - 1;
      const kind = index === 0 ? "briefing" : last ? "aftermath" : "scene";
      const phase = `SIDE ${String(n).padStart(2, "0")} ${index === 0 ? "BRIEFING" : last ? "AFTERMATH" : `SCENE ${index + 1}`}`;
      const next = last ? `${p}result` : `${p}${SKELETON_SCENES[index + 1]}`;
      return scene(`${p}${name}`, { phase, kind, next, cards: last ? ENDING_EFFECTS : CARD_EFFECTS });
    }),
    "  },",
    "  outcomes: {",
    ...["a", "b", "c"].map((suffix) => `    ${p}after_${suffix}: { title: "TODO 결말 제목", text: "TODO 결말 본문을 씁니다." },`),
    "  },",
    "};",
    "",
  ].join("\n");
}

/** Every string of a value with its path (`nodes.s9_start.text`), Hangul or not. */
export function allStrings(value, prefix = "", out = []) {
  if (typeof value === "string") out.push([prefix, value]);
  else if (Array.isArray(value)) value.forEach((item, index) => allStrings(item, `${prefix}[${index}]`, out));
  else if (value && typeof value === "object") for (const [key, child] of Object.entries(value)) allStrings(child, prefix ? `${prefix}.${key}` : key, out);
  return out;
}

/**
 * An en/ja word file for a pack: its words' shape (scripts/locale-words.mjs
 * `sideSource`, passed in as `words`) with every string TODO. check:locale
 * counts a TODO as translated, so check:case is what says it is not.
 */
export function localeStubSource({ id, lang, words }) {
  const todo = (value) => {
    if (typeof value === "string") return `TODO(${lang})`;
    if (Array.isArray(value)) return value.map((item) => (item === null ? null : todo(item)));
    if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, todo(child)]));
    return value;
  };
  const language = lang === "en" ? "English" : lang === "ja" ? "Japanese" : lang;
  return [
    "/**",
    ` * ${id} (src/nodes/${id}.js) in ${language}: the skeleton \`npm run new:case\``,
    " * wrote. Words only, under the pack's ids (scripts/locale-words.mjs); every",
    " * TODO is a string still to translate, and `npm run check:case` lists them.",
    " */",
    `export default ${JSON.stringify(todo(words), null, 2)};`,
    "",
  ].join("\n");
}

/** The side list's line, after the last real side case and before the fixture. */
export function addSideListing(source, { id, title }) {
  const n = sideNumber(id);
  if (new RegExp(`id: "${id}"`).test(source)) throw new Error(`${id} is already in SIDE_CASES.`);
  const line = `  { id: ${json(id)}, label: ${json(`번외 ${n}`)}, title: ${json(title)}, load: () => import("./${id}.js").then(({ ${id} }) => localizeSidePack(${id})) },\n`;
  const anchor = source.indexOf("  ...(sideFixtureListed");
  if (anchor < 0) throw new Error("src/nodes/sidePacks.js: the fixture line (`...(sideFixtureListed`) was not found.");
  return source.slice(0, anchor) + line + source.slice(anchor);
}

/** Index of the brace closing the one at `open`, past strings and comments. */
export function matchingBrace(source, open) {
  let depth = 0;
  for (let i = open; i < source.length; i += 1) {
    const ch = source[i];
    if (ch === '"' || ch === "'" || ch === "`") {
      for (i += 1; i < source.length && source[i] !== ch; i += 1) if (source[i] === "\\") i += 1;
      continue;
    }
    if (ch === "/" && source[i + 1] === "/") {
      i = source.indexOf("\n", i);
      if (i < 0) return -1;
      continue;
    }
    if (ch === "/" && source[i + 1] === "*") {
      i = source.indexOf("*/", i) + 1;
      if (i <= 0) return -1;
      continue;
    }
    if (ch === "{") depth += 1;
    else if (ch === "}") {
      depth -= 1;
      if (depth === 0) return i;
    }
  }
  return -1;
}

/**
 * The side list's label and title in a dictionary (src/locales/<lang>/index.js,
 * `copy.sidePacks.SIDE_CASES`), as the last entry of that object.
 */
export function addLocaleSideTitle(source, { id, label, title }) {
  const block = source.indexOf('"sidePacks"');
  const start = block < 0 ? -1 : source.indexOf('"SIDE_CASES"', block);
  if (start < 0) throw new Error('the dictionary has no "sidePacks" > "SIDE_CASES" object.');
  const open = source.indexOf("{", start);
  const close = matchingBrace(source, open);
  if (close < 0) throw new Error('"SIDE_CASES" is not closed.');
  const inner = source.slice(open + 1, close);
  if (inner.includes(`"${id}"`)) throw new Error(`${id} already has a label and title here.`);
  const body = inner.replace(/\s+$/, "");
  const comma = body.length && !body.endsWith(",") && body.trim().length ? "," : "";
  const entry = `\n      "${id}": {\n        "label": ${json(label)},\n        "title": ${json(title)}\n      }`;
  return `${source.slice(0, open + 1)}${body}${comma}${entry}\n    ${source.slice(close)}`;
}

/** The canon section a new side case starts from, before 「Known and left alone」. */
export function addCanonSection(source, { id, title }) {
  const n = sideNumber(id);
  if (source.includes(`(${id})`)) throw new Error(`docs/canon.md already has a section for ${id}.`);
  const section = [
    `### 번외 ${n}, ${title} (${id})`,
    "",
    "| Fact | Value |",
    "|---|---|",
    "| When | TODO YYYY-MM-DD (요), between which two of the season's days |",
    "| Where | TODO |",
    "| TODO person (age) | TODO what the case states for the first time |",
    "| The endings | TODO the first line of each of the three |",
    "",
    "",
  ].join("\n");
  const anchor = source.indexOf("## Known and left alone");
  if (anchor < 0) throw new Error("docs/canon.md: 「## Known and left alone」 was not found.");
  return source.slice(0, anchor) + section + source.slice(anchor);
}

/** A row to fill in the photographs' table of docs/portrait-credits.md, for the case's first new speaker. */
export function addPortraitCreditRow(source, { id }) {
  const n = sideNumber(id);
  const heading = source.indexOf("\n## 사진에서 만든");
  if (heading < 0) throw new Error("docs/portrait-credits.md: the photographs' section was not found.");
  const lines = source.slice(heading + 1).split("\n");
  let last = -1;
  let inTable = false;
  for (let i = 1; i < lines.length; i += 1) {
    if (lines[i].startsWith("## ")) break;
    if (lines[i].startsWith("|")) {
      inTable = true;
      last = i;
    } else if (inTable) break;
  }
  if (last < 0) throw new Error("docs/portrait-credits.md: the photographs' table was not found.");
  lines.splice(last + 1, 0, `| TODO 번외 ${n} 화자 | \`portrait-TODO.webp\` | TODO 원본 주소 | TODO 사진가 | TODO 라이선스 |`);
  return source.slice(0, heading + 1) + lines.join("\n");
}

/**
 * Whether a new file needs a line in scripts/coverage-floors.json. Authored
 * words and scenes do not (scripts/check-coverage.mjs `DATA_MODULES`); a
 * logic module under src/ does.
 */
const DATA_MODULES = [/^src\/nodes\//, /^src\/locales\/[^/]+\//, /^src\/copy\//, /^src\/(gameData|gameDialogue|gameCases|caseCopy|appCopy)\.js$/];
export const needsCoverageFloor = (file) => /^src\/.+\.(js|mjs)$/.test(file) && !DATA_MODULES.some((pattern) => pattern.test(file));

// --- check:case ---------------------------------------------------------------

/** 18장: a case's words say 원; `formatMoney` prints the table's $, never a scene. */
export const findDollar = (strings) => strings.filter(([, text]) => text.includes("$")).map(([path]) => path);

/** What the skeleton left: a TODO in any string. */
export const findTodo = (strings) => strings.filter(([, text]) => /\bTODO\b/.test(text)).map(([path]) => path);

/** 16장 2: 본문 420자 이하. */
export const TEXT_LIMIT = 420;
export function findLongText(nodes) {
  return Object.entries(nodes ?? {})
    .filter(([, node]) => typeof node?.text === "string" && [...node.text].length > TEXT_LIMIT)
    .map(([nodeId, node]) => `${nodeId}.text ${[...node.text].length}자`);
}

/** Every speaker a case's scenes name. */
export function speakersOf(nodes) {
  return [...new Set(Object.values(nodes ?? {}).map((node) => node?.speaker).filter((name) => typeof name === "string" && name))].sort();
}

/**
 * Speakers drawn as a silhouette (13장, 10-21 결정): no line in
 * SPEAKER_PORTRAITS, or a line whose file is not in public/.
 */
export function portraitProblems(speakers, { portraitOf, fileExists }) {
  const problems = [];
  for (const name of speakers) {
    const src = portraitOf(name);
    if (!src) problems.push(`${name}: SPEAKER_PORTRAITS에 없음(실루엣)`);
    else if (!fileExists(src)) problems.push(`${name}: ${src} 파일 없음(실루엣)`);
  }
  return problems;
}

/** Speakers a language's dictionary does not name: the page prints their Korean name. */
export const unnamedSpeakers = (speakers, names) => speakers.filter((name) => typeof names?.[name] !== "string");

/**
 * Blocks of a document pasted twice: every run of `minLines` non-blank lines
 * that appears again later, merged into one finding per repeated stretch.
 * #557 left writing-a-case.md with its sections 1 to 18 twice (938 lines);
 * tables' separator rows and fences alone are too common to count, so a
 * window must hold at least one line of words.
 */
export function findDuplicateBlocks(text, { minLines = 8 } = {}) {
  const lines = text.split(/\r?\n/).map((line, index) => ({ line: line.trim(), number: index + 1 })).filter((entry) => entry.line);
  const seen = new Map();
  const found = [];
  let open = null;
  for (let i = 0; i + minLines <= lines.length; i += 1) {
    const window = lines.slice(i, i + minLines);
    const key = window.map((entry) => entry.line).join("\n");
    const wordy = window.some((entry) => /[A-Za-z가-힣ぁ-んァ-ン一-龥]{2}/.test(entry.line));
    const first = wordy ? seen.get(key) : undefined;
    if (first !== undefined && first < i) {
      if (open && open.lastIndex === i - 1) {
        open.lastIndex = i;
        open.to = window.at(-1).number;
      } else {
        open = { from: window[0].number, to: window.at(-1).number, firstAt: lines[first].number, lastIndex: i };
        found.push(open);
      }
    } else if (wordy && !seen.has(key)) seen.set(key, i);
  }
  return found.map(({ from, to, firstAt }) => ({ from, to, firstAt, lines: to - from + 1 }));
}

/** The same `## ` heading twice in one document. */
export function duplicateHeadings(text) {
  const counts = new Map();
  text.split(/\r?\n/).forEach((line, index) => {
    if (/^#{2,3} /.test(line)) counts.set(line, [...(counts.get(line) ?? []), index + 1]);
  });
  return [...counts].filter(([, at]) => at.length > 1).map(([heading, at]) => ({ heading, at }));
}

/**
 * A side case against its canon section (docs/canon.md 「번외 N, 제목
 * (sideNN)」): the section is there, its title is the pack's, and the When
 * row's first date is one the pack says (as 「M월 D일」). check:canon holds
 * the weekdays; this holds the pairing.
 */
export function canonProblems({ id, pack, canon }) {
  const n = sideNumber(id);
  if (n === null) return [];
  const heading = canon.split(/\r?\n/).find((line) => line.startsWith("### ") && line.includes(`(${id})`));
  if (!heading) return [`docs/canon.md에 「### 번외 ${n}, … (${id})」 절 없음`];
  const problems = [];
  const expected = `### 번외 ${n}, ${pack?.title} (${id})`;
  if (heading.trim() !== expected) problems.push(`canon 제목 「${heading.trim()}」 ≠ 팩 「${expected}」`);
  if (pack?.label && pack.label !== `번외 ${n}`) problems.push(`팩 label 「${pack.label}」 ≠ 「번외 ${n}」`);
  const start = canon.indexOf(heading);
  const next = canon.slice(start + heading.length).search(/\n#{2,3} /);
  const section = canon.slice(start, next < 0 ? undefined : start + heading.length + next);
  const when = /^\| When \| (.*)$/m.exec(section)?.[1] ?? "";
  if (/TODO/.test(section)) problems.push("canon 절에 TODO 남음");
  const date = /(\d{4})-(\d{2})-(\d{2})/.exec(when);
  if (!date) {
    problems.push("canon When 줄에 YYYY-MM-DD 날짜 없음");
    return problems;
  }
  const said = `${Number(date[2])}월 ${Number(date[3])}일`;
  const words = allStrings(pack).map(([, text]) => text).join("\n");
  if (!words.includes(said)) problems.push(`canon When ${date[0]} → 팩 본문에 「${said}」 없음`);
  return problems;
}

/** Changed files -> the case ids check:case reads (a scene file in any language). */
export function caseIdsOf(files) {
  const ids = new Set();
  for (const file of files) {
    const match = /^src\/(?:locales\/[a-z]{2}\/)?nodes\/((?:side|case|prologue)\d{2}|final)\.js$/.exec(file);
    if (match && match[1] !== "side00") ids.add(match[1]);
  }
  return [...ids].sort();
}

/** The documents check:case reads for blocks pasted twice. */
export const CASE_DOCS = ["docs/writing-a-case.md", "docs/canon.md", "docs/portrait-credits.md"];
