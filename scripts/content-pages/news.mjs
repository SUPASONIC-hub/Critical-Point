import { readFileSync } from "node:fs";
import { ARTICLES, FRONT_ORDER, NEWS_DISCLAIMER, NEWS_INDEX_PATH, NEWS_PAPER, NEWS_PAPER_LINE, newsPath, worldDate } from "../../src/news/newsIndex.js";
import { NOTE_AUTHOR } from "../../src/notes/noteIndex.js";
import { escapeHtml, GAME_NAME, gamePath, renderDocumentPage } from "../legal-pages.mjs";
import { breadcrumbStructuredData, structuredDataTag } from "../structured-data.mjs";
import { caseName } from "./cases.mjs";
import { markdownToHtml } from "./notes.mjs";

/**
 * 석간 원장, the game world's newspaper (세계관 신문), in Korean only like the
 * notes (owner's decision 2026-11-20 「1」):
 *
 *   /news/index.html      every article, newest inside the world first
 *   /news/<slug>.html     one article (scripts/content-pages/news/<slug>.md)
 *
 * Every article is made up and says so twice, above and below its words
 * (`NEWS_DISCLAIMER`); its date is the world's, not the site's, and its data
 * is a CreativeWork marked as fiction, never a NewsArticle, so nothing reads it
 * as a report of a real event. Each links the case files it touches and tells
 * no more of them than those pages do. The words are Markdown written by hand
 * in the subset the notes use (`markdownToHtml`, ./notes.mjs).
 *
 * A page is dated in the sitemap by its words' hash like the other content
 * pages (scripts/sitemap-dates.json): the world's date is not the day it went up.
 */

const NEWS_DIR = new URL("./news/", import.meta.url);

/** An article's Markdown, read from scripts/content-pages/news/<slug>.md. */
export const articleSource = (slug) => readFileSync(new URL(`${slug}.md`, NEWS_DIR), "utf8");

/** The articles as the list prints them: newest inside the world first. */
export const LIST_ORDER = [...FRONT_ORDER].reverse();

/** Every page this file writes, as a kind: the list, then each article in the list's order. */
export const NEWS_KINDS = ["news/index", ...LIST_ORDER.map((article) => `news/${article.slug}`)];

const worldTime = (day) => `<time datetime="${day}">${worldDate(day)}</time>`;
const disclaimer = `<p class="news-fiction" role="note">${escapeHtml(NEWS_DISCLAIMER)}</p>`;

/** The line under an article's heading: the paper, its page, the world's date. */
export const articleMeta = (article) => `<p class="news-meta">${escapeHtml(NEWS_PAPER)} · ${escapeHtml(article.section)} · ${worldTime(article.day)} (게임 속 날짜)</p>`;

/** The case files an article touches, by the game's own names. */
function relatedCases(article) {
  const links = article.cases.map((caseId) => {
    const { label, title } = caseName(caseId, "ko");
    return `<li><a href="/cases/${caseId}.html">${escapeHtml(label)} ${escapeHtml(title)}</a></li>`;
  });
  return `<h2>관련 사건 파일</h2>
<ul class="news-cases">
${links.join("\n")}
</ul>`;
}

const NEWS_STYLE = `
.news-fiction{margin:12px 0;padding:10px 14px;border:1px solid var(--line-strong);border-radius:6px;font-size:.9375rem;font-weight:700}
.news-meta{margin:8px 0 20px;color:var(--text-2);font-size:.9375rem}
.news-list{list-style:none;padding:0}
.news-list li{margin:0;padding:16px 0;border-top:1px solid var(--line-strong)}
.news-list a{font-weight:700;font-size:1.0625rem}
.news-list p{margin:4px 0 0}
.news-cases{padding-left:1.25em}
blockquote{margin:16px 0;padding:4px 0 4px 14px;border-left:3px solid var(--pencil)}
`;

const LIST_INTRO = [
  `${NEWS_PAPER}은 ${NEWS_PAPER_LINE}입니다. 게임 「임계점」의 사건들이 벌어지는 세계에서, 그 세계의 신문이 썼을 법한 기사를 우리가 지어 실었습니다.`,
  "여기 실린 기사는 모두 꾸며 낸 이야기이고, 날짜도 게임 속 날짜입니다. 실제 사건·인물·회사와는 관계없습니다. 사건의 결말이나 반전은 쓰지 않고, 사건 파일 페이지에 공개된 첫 장면까지만 다룹니다.",
];

function listBody() {
  const items = LIST_ORDER.map(
    (article) => `<li><a href="${newsPath(article.slug)}">${escapeHtml(article.title)}</a>
<p class="meta">${escapeHtml(article.section)} · ${worldTime(article.day)}</p>
<p>${escapeHtml(article.summary)}</p></li>`,
  );
  return `${disclaimer}
${LIST_INTRO.map((line) => `<p>${escapeHtml(line)}</p>`).join("\n")}
<ul class="news-list">
${items.join("\n")}
</ul>
${disclaimer}`;
}

function articleBody(article) {
  const at = LIST_ORDER.indexOf(article);
  // The list is newest first: the one after it in the list happened before it.
  const later = LIST_ORDER[at - 1];
  const earlier = LIST_ORDER[at + 1];
  const pager = [
    earlier ? `<a href="${newsPath(earlier.slug)}">이전 기사: ${escapeHtml(earlier.title)}</a>` : "",
    `<a href="${NEWS_INDEX_PATH}">${escapeHtml(NEWS_PAPER)} 목록</a>`,
    later ? `<a href="${newsPath(later.slug)}">다음 기사: ${escapeHtml(later.title)} →</a>` : "",
  ]
    .filter(Boolean)
    .join("\n");
  return `${disclaimer}
${articleMeta(article)}
${markdownToHtml(articleSource(article.slug))}
${relatedCases(article)}
${disclaimer}
<p><a href="${gamePath("ko")}">임계점 무료로 플레이하기</a></p>
<div class="pager">
${pager}
</div>`;
}

/**
 * An article's data: a CreativeWork whose genre says it is fiction, part of the
 * game, written by us. Not a NewsArticle: no search engine should take it for news.
 */
function articleStructuredData(article) {
  const work = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: article.title,
    description: article.summary,
    genre: "게임 세계관 픽션(가상 기사)",
    inLanguage: "ko",
    url: newsPath(article.slug),
    temporalCoverage: article.day,
    isPartOf: { "@type": "VideoGame", name: GAME_NAME.ko, url: gamePath("ko") },
    author: NOTE_AUTHOR.split(" & ").map((name) => ({ "@type": "Person", name })),
  };
  const trail = breadcrumbStructuredData([
    [NEWS_PAPER, NEWS_INDEX_PATH],
    [article.title, newsPath(article.slug)],
  ]);
  return `${structuredDataTag(work)}\n${structuredDataTag(trail)}`;
}

const LIST_DESCRIPTION = `${NEWS_PAPER}: 게임 「임계점」 세계 속 가상 신문. 실제 사건·인물·회사와 관계없는 꾸며 낸 기사 ${ARTICLES.length}편.`;

/** Every news page: `{ "news/index.html": "<!doctype html>...", "news/<slug>.html": ... }`. */
export function renderNewsPages({ analytics = null } = {}) {
  const pages = {};
  const write = (kind, page) => {
    pages[`${kind}.html`] = renderDocumentPage({ kind, language: "ko", analytics, languages: ["ko"], style: NEWS_STYLE, ...page });
  };
  write("news/index", { heading: NEWS_PAPER, description: LIST_DESCRIPTION, body: listBody() });
  for (const article of LIST_ORDER) {
    write(`news/${article.slug}`, {
      heading: article.title,
      description: `[게임 속 가상 기사] ${article.summary}`,
      body: articleBody(article),
      structuredData: articleStructuredData(article),
    });
  }
  return pages;
}
