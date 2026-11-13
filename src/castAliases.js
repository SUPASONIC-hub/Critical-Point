/**
 * People renamed on 2026-11-13 (docs/canon.md, "The people from abroad").
 *
 * KD's Singapore office, its Tokyo branch and the people it hires from abroad
 * came into the cast, so some people got a new name and face. A save or a run
 * log written before then still holds the old name in the words it kept
 * (`speaker`, `title`, `choice`, `spokenChoice`, `sourceChoice`): savedState
 * reads every entry through `renameCast`, so the records show the new name and
 * a card matched by its Korean words (`sourceChoice`) still matches. The start
 * screen lists the same table for a month (`castNoticeAt`).
 *
 * The old Korean names are written only here; check:canon (cast-old-names)
 * keeps them out of every other season file.
 */

/** Old name -> new name, per language (ko is also the `speaker` key). */
export const CAST_ALIASES = {
  ko: [
    ["류세아", "프리야 나이르"],
    ["주은채", "레이철 탄"],
    ["연시우", "응우옌 반 남"],
    ["도건우", "대니얼 강"],
    ["표세린", "미즈노 사키"],
    ["백다온", "마커스 림"],
    ["우지환", "토머스 리드"],
  ],
  en: [
    ["Ryu Seah", "Priya Nair"],
    ["Joo Eunchae", "Rachel Tan"],
    ["Yeon Siwoo", "Nguyen Van Nam"],
    ["Do Geonwoo", "Daniel Kang"],
    ["Pyo Serin", "Mizuno Saki"],
    ["Baek Daon", "Marcus Lim"],
    ["Woo Jihwan", "Thomas Reed"],
  ],
  ja: [
    ["リュ・セア", "プリヤ・ナイル"],
    ["チュ・ウンチェ", "レイチェル・タン"],
    ["ヨン・シウ", "グエン・ヴァン・ナム"],
    ["ト・ゴヌ", "ダニエル・カン"],
    ["ピョ・セリン", "水野咲"],
    ["ペク・ダオン", "マーカス・リム"],
    ["ウ・ジファン", "トーマス・リード"],
  ],
};

// A Korean particle after a name follows the name's last sound: 가/이, 는/은 ...
// [after a vowel, after a consonant]; the longer forms are tried first.
const PARTICLES = [
  ["예요", "이에요"], ["였", "이었"], ["라고", "이라고"], ["라는", "이라는"], ["랑", "이랑"], ["나", "이나"],
  ["가", "이"], ["는", "은"], ["를", "을"], ["와", "과"], ["로", "으로"],
];
const FORMS = [...new Set(PARTICLES.flat())].sort((a, b) => b.length - a.length);

function lastSound(word) {
  const code = word.charCodeAt(word.length - 1) - 0xac00;
  if (code < 0 || code > 11171) return "vowel";
  const tail = code % 28;
  return tail === 0 ? "vowel" : tail === 8 ? "rieul" : "consonant";
}

function particleFor(name, particle) {
  const pair = PARTICLES.find((forms) => forms.includes(particle));
  const sound = lastSound(name);
  if (pair[0] === "로") return sound === "consonant" ? "으로" : "로";
  return sound === "vowel" ? pair[0] : pair[1];
}

const KO_PATTERNS = CAST_ALIASES.ko.map(([from, to]) => [new RegExp(`${from}(${FORMS.join("|")})?`, "g"), to]);
const OTHER_PAIRS = [...CAST_ALIASES.en, ...CAST_ALIASES.ja];

/** `text` with every old name turned into the new one (a Korean particle after it follows the new name). */
export function renameCast(text) {
  if (typeof text !== "string" || !text) return text;
  let out = text;
  for (const [pattern, to] of KO_PATTERNS) out = out.replace(pattern, (match, particle) => to + (particle ? particleFor(to, particle) : ""));
  for (const [from, to] of OTHER_PAIRS) out = out.split(from).join(to);
  return out;
}

/** The start screen lists the renames from the change to the end of 12-13 KST. */
export const CAST_NOTICE_FROM_MS = Date.parse("2026-11-13T00:00:00+09:00");
export const CAST_NOTICE_UNTIL_MS = Date.parse("2026-12-14T00:00:00+09:00");

/** Whether the start screen tells of the renames at `ms`. */
export function castNoticeAt(ms) {
  const at = Number(ms);
  return Number.isFinite(at) && at >= CAST_NOTICE_FROM_MS && at < CAST_NOTICE_UNTIL_MS;
}

/** "old → new · old → new" in `lang` (ko when the language has no table). */
export function castAliasLine(lang) {
  return (CAST_ALIASES[lang] ?? CAST_ALIASES.ko).map(([from, to]) => `${from} → ${to}`).join(" · ");
}
