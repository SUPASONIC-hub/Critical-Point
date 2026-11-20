import { CREATOR_LINE, studioName } from "../../src/credits.js";
import { escapeHtml, gamePath, PAGE_LANGUAGES, pagePath, renderDocumentPage } from "../legal-pages.mjs";
import {
  CASE_INDEX_DESCRIPTION,
  CASE_INDEX_INTRO,
  CASE_PAGES,
  CASE_TEXT,
  CASE_WORDS,
  caseGroup,
  caseKind,
  caseName,
  caseRule,
  tellsEarlierCases,
} from "./cases.mjs";
import { CHARACTER_GROUPS, CHARACTERS_DESCRIPTION, CHARACTERS_INTRO } from "./characters-text.mjs";
import { GUIDE_BODY, GUIDE_DESCRIPTION } from "./guide-text.mjs";
import { MAKING_BODY, MAKING_DESCRIPTION } from "./making-text.mjs";
import { WEEKLY_DESCRIPTION, weeklyBody } from "./weekly-text.mjs";
import CASE_BACKGROUND from "./cases/background-ko.mjs";
import { notesDay } from "./notes.mjs";
import { notePath, publishedNotes } from "../../src/notes/noteIndex.js";
import { breadcrumbStructuredData, pageTrail, structuredDataTag } from "../structured-data.mjs";

/**
 * The site's content pages, written beside the five about the game and the
 * two policies (`renderStaticPages`, scripts/site-pages.mjs), in Korean,
 * English and Japanese, with the same look, header and foot
 * (`renderDocumentPage`, scripts/legal-pages.mjs):
 *
 *   /guide.html          how to play, rule by rule (./guide-text.mjs)
 *   /cases/index.html    the case files, and a page per case (./cases.mjs)
 *   /characters.html     the recurring cast as each is introduced (./characters-text.mjs)
 *   /making.html         how we made it, in our own plural voice (./making-text.mjs)
 *   /weekly.html         the weekly rule calendar, every booked week and its rule (./weekly-text.mjs)
 *
 * Why: AdSense turned the site down on 2026-11-08 for low-value content.
 * These are the site's own words, readable with no script, and none of them
 * tells the story past a case's second scene or names an ending
 * (tests/unit/content-pages.test.mjs).
 */

/** The page kinds this module writes, in the menu's order: the guide, the case files, every case, the cast, the making-of; then the weekly calendar, linked from the guide rather than the menu. */
export const CONTENT_KINDS = ["guide", "cases/index", ...CASE_PAGES.map(caseKind), "characters", "making", "weekly"];

const HEADINGS = {
  guide: { ko: "게임 방법", en: "How to Play", ja: "遊び方" },
  "cases/index": { ko: CASE_WORDS.ko.index, en: CASE_WORDS.en.index, ja: CASE_WORDS.ja.index },
  characters: { ko: "등장인물", en: "Characters", ja: "登場人物" },
  making: { ko: "우리가 만든 이야기", en: "How We Made It", ja: "私たちの制作の話" },
  weekly: { ko: "주간 규칙 달력", en: "Rule of the Week Calendar", ja: "今週のルール カレンダー" },
};

const paragraphs = (lines) => lines.map((line) => `<p>${escapeHtml(line)}</p>`).join("\n");
const link = (href, text, extra = "") => `<a href="${href}"${extra}>${escapeHtml(text)}</a>`;

/** `사건 01 · 72시간`; the prologue's second case is titled by its loan number. */
const caseHeading = (caseId, language) => {
  const { label, title } = caseName(caseId, language);
  return `${label} · ${title}`;
};

/* ------------------------------------------------------------- the case files */

function caseIndexBody(language) {
  const words = CASE_WORDS[language];
  const groups = ["prologue", "main", "final"].map((group) => {
    const items = CASE_PAGES.filter((caseId) => caseGroup(caseId) === group).map((caseId) => {
      const text = CASE_TEXT[caseId][language];
      const lines = `<p class="meta">${escapeHtml(text.setting)}</p>
<p>${escapeHtml(text.question)}</p>`;
      const shown = tellsEarlierCases(caseId) ? `<details><summary>${escapeHtml(words.reveal)}</summary>
${lines}
</details>` : lines;
      return `<li>${link(pagePath(caseKind(caseId), language), caseHeading(caseId, language))}
${shown}</li>`;
    });
    return items.length ? `<h2>${escapeHtml(words[group])}</h2>\n<ul class="case-list">\n${items.join("\n")}\n</ul>` : "";
  });
  return `${paragraphs(CASE_INDEX_INTRO[language])}
${groups.join("\n")}
<p class="note">${escapeHtml(words.fiction)}</p>`;
}

/* ------------------------------------------------------- 배경 지식 (Korean) */

const BACKGROUND_WORDS = {
  heading: "배경 지식",
  note: "배경 지식은 사건이 기대고 있는 금융·회사 개념을 우리가 일반적인 구조로 풀어 쓴 글입니다. 개별 상황에 대한 법률·투자 조언이 아닙니다.",
};

/** The box's own sheet: a ruled card under the case's question. */
export const BACKGROUND_STYLE = ".background{margin:28px 0;padding:6px 18px 4px;border:1px solid var(--line-strong);border-left:4px solid var(--accent);border-radius:4px;background:var(--surface)}.background h2{margin-top:14px}";

/**
 * A Korean case page's 「배경 지식」 box (./cases/background-ko.mjs), or "" for
 * a case or language without one. The term its note names is a link once the
 * note is out by `day` and plain text before: a `<span>` in place of the
 * `<a>`, so the page's words, and with them its sitemap date, stay the same
 * the day the link appears.
 */
export function backgroundBox(caseId, language, day) {
  const box = language === "ko" ? CASE_BACKGROUND[caseId] : null;
  if (!box) return "";
  const [slug, term] = box.note ?? [];
  const out = slug ? publishedNotes(day).some((note) => note.slug === slug) : false;
  let linked = false;
  const lines = box.text.map((line) => {
    const html = escapeHtml(line);
    const word = term ? escapeHtml(term) : "";
    if (!word || linked || !html.includes(word)) return `<p>${html}</p>`;
    linked = true;
    return `<p>${html.replace(word, () => (out ? link(notePath(slug), term) : `<span>${word}</span>`))}</p>`;
  });
  return `<section class="background" aria-labelledby="background">
<h2 id="background">${escapeHtml(BACKGROUND_WORDS.heading)}: ${escapeHtml(box.title)}</h2>
${lines.join("\n")}
<p class="note">${escapeHtml(BACKGROUND_WORDS.note)}</p>
</section>
`;
}

function caseBody(caseId, language, day = notesDay()) {
  const words = CASE_WORDS[language];
  const text = CASE_TEXT[caseId][language];
  const rule = caseRule(caseId, language);
  const at = CASE_PAGES.indexOf(caseId);
  const previous = CASE_PAGES[at - 1];
  const next = CASE_PAGES[at + 1];
  const cast = text.cast.map((person) => `<li><strong>${escapeHtml(person.name)}</strong> — ${escapeHtml(person.note)}</li>`).join("\n");
  const pager = [
    previous ? link(pagePath(caseKind(previous), language), `${words.previous}: ${caseHeading(previous, language)}`) : "",
    link(pagePath("cases/index", language), words.all),
    next ? link(pagePath(caseKind(next), language), `${words.next.replace(" →", "")}: ${caseHeading(next, language)} →`) : "",
  ]
    .filter(Boolean)
    .join("\n");
  const notice = tellsEarlierCases(caseId)
    ? `<p class="spoiler-note"><strong>${escapeHtml(words.earlier)}</strong> · ${link(pagePath("cases/index", language), words.back)}</p>\n`
    : "";
  return `${notice}<p class="meta">${escapeHtml(words.setting)}: ${escapeHtml(text.setting)}</p>
<h2>${escapeHtml(words.premise)}</h2>
${paragraphs(text.premise)}
${rule ? `<h2>${escapeHtml(words.rule)}: ${escapeHtml(rule.label)}</h2>\n<p>${escapeHtml(rule.rule)}</p>` : ""}
<h2>${escapeHtml(words.cast)}</h2>
<ul>
${cast}
</ul>
<h2>${escapeHtml(words.question)}</h2>
<p class="lede">${escapeHtml(text.question)}</p>
${backgroundBox(caseId, language, day)}<p>${link(gamePath(language), words.play)}</p>
<p class="note">${escapeHtml(words.fiction)}</p>
<div class="pager">
${pager}
</div>`;
}

/* ------------------------------------------------------------------ the cast */

const FICTION = {
  ko: "게임에 나오는 인물, 회사, 기관과 사건은 모두 허구입니다. 인물 소개는 각자 처음 등장할 때의 모습까지만 적었습니다.",
  en: "All people, companies, institutions and events in the game are fictional. Each profile describes a person only as they first appear.",
  ja: "ゲームに登場する人物、会社、機関、事件はすべて架空のものです。人物紹介は、それぞれが初めて登場するときの姿までを書いています。",
};

/** A portrait's text: whose face it is, since the name under it is a heading of its own. */
const PORTRAIT_ALT = {
  ko: (name) => `${name}의 초상`,
  en: (name) => `Portrait of ${name}`,
  ja: (name) => `${name}の肖像`,
};

function charactersBody(language) {
  const groups = CHARACTER_GROUPS.map((group) => {
    const people = group.people.map((person) => {
      const words = person[language];
      const picture = person.portrait
        ? `<img src="${person.portrait}" alt="${escapeHtml(PORTRAIT_ALT[language](words.name))}" width="72" height="72" loading="lazy" decoding="async" />\n`
        : "";
      const line = words.line ? `\n<p class="line">“${escapeHtml(words.line)}”</p>` : "";
      return `<li>${picture}<div>
<h3>${escapeHtml(words.name)}</h3>
<p class="meta">${escapeHtml(words.role)}</p>
${paragraphs(words.text)}${line}
</div></li>`;
    });
    return `<h2>${escapeHtml(group.title[language])}</h2>\n<ul class="cast">\n${people.join("\n")}\n</ul>`;
  });
  return `${paragraphs(CHARACTERS_INTRO[language])}
${groups.join("\n")}
<p class="note">${escapeHtml(FICTION[language])}</p>`;
}

/* -------------------------------------------------------------- how we made it */

const MAKERS_LINE = {
  ko: (studio) => `글: ${CREATOR_LINE} · ${studio}`,
  en: (studio) => `Written by ${CREATOR_LINE} · ${studio}`,
  ja: (studio) => `文: ${CREATOR_LINE} · ${studio}`,
};

const makingBody = (language) => `${MAKING_BODY[language].trim()}
<p class="meta">${escapeHtml(MAKERS_LINE[language](studioName(language)))}</p>`;

/* ----------------------------------------------------------------- the pages */

function pageOf(kind, language, day) {
  if (kind === "guide") return { body: GUIDE_BODY[language], description: GUIDE_DESCRIPTION[language], heading: HEADINGS.guide[language] };
  if (kind === "cases/index") return { body: caseIndexBody(language), description: CASE_INDEX_DESCRIPTION[language], heading: HEADINGS[kind][language] };
  if (kind === "characters") return { body: charactersBody(language), description: CHARACTERS_DESCRIPTION[language], heading: HEADINGS.characters[language] };
  if (kind === "weekly") return { body: weeklyBody(language, undefined, gamePath(language)), description: WEEKLY_DESCRIPTION[language], heading: HEADINGS.weekly[language] };
  if (kind === "making") return { body: makingBody(language), description: MAKING_DESCRIPTION[language], heading: HEADINGS.making[language] };
  const caseId = kind.slice("cases/".length);
  const style = CASE_BACKGROUND[caseId] && language === "ko" ? BACKGROUND_STYLE : "";
  return { body: caseBody(caseId, language, day), description: CASE_TEXT[caseId][language].question, heading: caseHeading(caseId, language), style };
}

/**
 * The page's trail for a search engine (BreadcrumbList, scripts/structured-data.mjs):
 * a case under the case files (사건 파일 > 사건 01 · 72시간), the guide, the
 * cast and the making-of under the game. The case files' own list has none.
 */
function trailOf(kind, language, heading) {
  if (kind === "cases/index") return "";
  const trail = kind.startsWith("cases/")
    ? [
        [HEADINGS["cases/index"][language], pagePath("cases/index", language)],
        [heading, pagePath(kind, language)],
      ]
    : pageTrail(kind, language, heading);
  return structuredDataTag(breadcrumbStructuredData(trail));
}

/** Every content page: `{ "guide.html": "<!doctype html>...", "en/cases/case01.html": ..., ... }`, keyed by path from the root without its slash. */
export function renderContentPages({ analytics = null, day = notesDay() } = {}) {
  const pages = {};
  for (const kind of CONTENT_KINDS) {
    for (const language of PAGE_LANGUAGES) {
      const page = pageOf(kind, language, day);
      pages[pagePath(kind, language).slice(1)] = renderDocumentPage({ kind, language, analytics, ...page, structuredData: trailOf(kind, language, page.heading) });
    }
  }
  return pages;
}
