import { readFileSync } from "node:fs";
import { koreanDate, NOTE_AUTHOR, noteDay, NOTES, NOTES_INDEX_PATH, notePath, publishedNotes, seoulDay } from "../../src/notes/noteIndex.js";
import { escapeHtml, gamePath, renderDocumentPage } from "../legal-pages.mjs";
import { breadcrumbStructuredData, structuredDataTag } from "../structured-data.mjs";

/**
 * The notes (노트), in Korean only (owner's decision 2026-11-20 「전부 1」, Q2
 * and Q3): essays we write by hand -- finance the cases stand on, how we
 * designed the table, guides -- one page each, and a list of them.
 *
 *   /notes/index.html      every note out so far, newest first
 *   /notes/<slug>.html     one note (scripts/content-pages/notes/<slug>.md)
 *
 * A note's words are a Markdown file written by hand, not built from a
 * template: paragraphs, `##`/`###` headings, `-` and `1.` lists, `**bold**`,
 * `>` quotes and `|` tables, and nothing else (`markdownToHtml`). Its title,
 * summary and day are in src/notes/noteIndex.js, which the start screen reads
 * too. A build writes the notes whose day has come by `day` (KST), so the
 * notes go out as dated (several on one day when they are ready together;
 * the owner's 「2」 of 2026-11-25), without anyone pressing anything but a
 * build (.github/workflows/notes-publish.yml).
 *
 * Every note shows the day it went out (and the day it changed, if it did)
 * and who wrote it, as a `<time>` and an Article in JSON-LD: the content pages
 * had neither (cp-archive/메모-20261120/adsense-2차-분석.md, 1).
 */

const NOTES_DIR = new URL("./notes/", import.meta.url);

/**
 * The day a build reads the notes at: today in Seoul, or `CP_NOTES_DAY=YYYY-MM-DD`
 * to see on a local build or dev server the notes as they will stand on that
 * day. Nothing in CI or on Render sets it.
 */
export function notesDay(env = process.env) {
  const day = env.CP_NOTES_DAY;
  if (!day) return seoulDay();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) throw new Error(`CP_NOTES_DAY must be YYYY-MM-DD, got ${day}`);
  return day;
}

/** A note's Markdown, read from scripts/content-pages/notes/<slug>.md. */
export const noteSource = (slug) => readFileSync(new URL(`${slug}.md`, NOTES_DIR), "utf8");

/** `**bold**` inside an escaped line. */
const inline = (text) => escapeHtml(text).replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");

/** One table row's cells: `| a | b |` -> ["a", "b"]. */
const cells = (line) => line.trim().replace(/^\||\|$/g, "").split("|").map((cell) => cell.trim());

/** The Markdown this file accepts, as HTML. A line it does not know is a paragraph's. */
export function markdownToHtml(markdown) {
  const blocks = String(markdown).replace(/\r\n/g, "\n").trim().split(/\n{2,}/);
  return blocks
    .map((block) => {
      const lines = block.split("\n");
      const heading = /^(#{2,3}) (.+)$/.exec(block);
      if (heading && lines.length === 1) return `<h${heading[1].length}>${inline(heading[2])}</h${heading[1].length}>`;
      if (lines.every((line) => line.startsWith("- "))) return `<ul>\n${lines.map((line) => `<li>${inline(line.slice(2))}</li>`).join("\n")}\n</ul>`;
      if (lines.every((line) => /^\d+\. /.test(line))) return `<ol>\n${lines.map((line) => `<li>${inline(line.replace(/^\d+\. /, ""))}</li>`).join("\n")}\n</ol>`;
      if (lines.every((line) => line.startsWith("> "))) return `<blockquote>${inline(lines.map((line) => line.slice(2)).join(" "))}</blockquote>`;
      if (lines.length >= 3 && lines.every((line) => line.startsWith("|")) && /^\|[\s|:-]+\|$/.test(lines[1])) {
        const head = cells(lines[0]).map((cell) => `<th scope="col">${inline(cell)}</th>`).join("");
        const rows = lines.slice(2).map((line) => `<tr>${cells(line).map((cell, at) => (at === 0 ? `<th scope="row">${inline(cell)}</th>` : `<td>${inline(cell)}</td>`)).join("")}</tr>`);
        return `<div class="table-wrap"><table>\n<thead><tr>${head}</tr></thead>\n<tbody>\n${rows.join("\n")}\n</tbody>\n</table></div>`;
      }
      return `<p>${inline(lines.join(" "))}</p>`;
    })
    .join("\n");
}

/** `2026년 11월 21일` in a `<time>`. */
const dateTag = (day) => `<time datetime="${day}">${koreanDate(day)}</time>`;

/** The line under a note's heading: when it went out, when it changed, who wrote it. */
export function bylineOf(note) {
  const changed = note.updated && note.updated !== note.published ? ` · 고친 날 ${dateTag(note.updated)}` : "";
  return `<p class="byline">${dateTag(note.published)}${changed} · 글: ${escapeHtml(NOTE_AUTHOR)}</p>`;
}

const LIST_INTRO = [
  "노트는 임계점을 만드는 우리 두 사람이 직접 쓰는 글입니다. 게임 속 사건이 기대고 있는 금융 이야기, 테이블을 설계하며 잰 숫자와 버린 안, 처음 하는 사람을 위한 안내를 한 편씩 올립니다.",
  "사건의 결말이나 반전은 쓰지 않습니다. 사건 이야기는 사건 파일 페이지에 공개된 첫 장면까지만 다룹니다. 새 글은 준비되는 대로 한국어로 먼저 올립니다.",
];

const NOTE_STYLE = `
.byline{margin:8px 0 20px;color:var(--text-2);font-size:.9375rem}
.note-list{list-style:none;padding:0}
.note-list li{margin:0;padding:16px 0;border-top:1px solid var(--line-strong)}
.note-list a{font-weight:700;font-size:1.0625rem}
.note-list p{margin:4px 0 0}
.table-wrap{overflow-x:auto;margin:16px 0}
table{border-collapse:collapse;min-width:100%;font-size:.9375rem}
th,td{padding:8px 10px;border-bottom:1px solid var(--line);text-align:left;white-space:nowrap}
thead th{border-bottom:2px solid var(--text)}
td{text-align:right;font-variant-numeric:tabular-nums}
blockquote{margin:16px 0;padding:4px 0 4px 14px;border-left:3px solid var(--pencil)}
`;

function listBody(notes) {
  const items = notes.map(
    (note) => `<li><a href="${notePath(note.slug)}">${escapeHtml(note.title)}</a>
<p class="meta">${dateTag(note.published)} · 글: ${escapeHtml(NOTE_AUTHOR)}</p>
<p>${escapeHtml(note.summary)}</p></li>`,
  );
  const list = items.length ? `<ul class="note-list">\n${items.join("\n")}\n</ul>` : "<p>첫 글을 준비하고 있습니다.</p>";
  return `${LIST_INTRO.map((line) => `<p>${escapeHtml(line)}</p>`).join("\n")}
${list}`;
}

function noteBody(note, notes) {
  const at = notes.indexOf(note);
  // The list is newest first: the one after it in the list is older.
  const newer = notes[at - 1];
  const older = notes[at + 1];
  const pager = [
    older ? `<a href="${notePath(older.slug)}">이전 글: ${escapeHtml(older.title)}</a>` : "",
    `<a href="${NOTES_INDEX_PATH}">노트 목록</a>`,
    newer ? `<a href="${notePath(newer.slug)}">다음 글: ${escapeHtml(newer.title)} →</a>` : "",
  ]
    .filter(Boolean)
    .join("\n");
  return `${bylineOf(note)}
${markdownToHtml(noteSource(note.slug))}
<p><a href="${gamePath("ko")}">임계점 무료로 플레이하기</a></p>
<div class="pager">
${pager}
</div>`;
}

/** The note as an Article, and its trail under the notes list. */
function noteStructuredData(note) {
  const article = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: note.title,
    description: note.summary,
    inLanguage: "ko",
    url: notePath(note.slug),
    datePublished: note.published,
    dateModified: noteDay(note),
    author: NOTE_AUTHOR.split(" & ").map((name) => ({ "@type": "Person", name })),
  };
  const trail = breadcrumbStructuredData([
    ["노트", NOTES_INDEX_PATH],
    [note.title, notePath(note.slug)],
  ]);
  return `${structuredDataTag(article)}\n${structuredDataTag(trail)}`;
}

const LIST_DESCRIPTION = "임계점을 만드는 두 사람이 쓰는 노트: 사건이 기대고 있는 금융 이야기, 게임 설계 기록, 처음 하는 사람을 위한 안내.";

/** The kinds a build on `day` writes: the list, then each note out by then (`notes/<slug>`), newest first. */
export const noteKinds = (day) => ["notes/index", ...publishedNotes(day).map((note) => `notes/${note.slug}`)];

/** The note a kind is, or null for the list. */
export const noteOfKind = (kind) => NOTES.find((note) => `notes/${note.slug}` === kind) ?? null;

/** The day a note page last changed, for the sitemap: a note's own day; the list's is its newest note's (or null when it has none). */
export function noteLastmod(kind, day) {
  const note = noteOfKind(kind);
  if (note) return noteDay(note);
  const notes = publishedNotes(day);
  return notes.length ? notes.map(noteDay).sort().at(-1) : null;
}

/** Every note page out by `day`: `{ "notes/index.html": "<!doctype html>...", "notes/<slug>.html": ... }`. */
export function renderNotePages({ analytics = null, day }) {
  const notes = publishedNotes(day);
  const pages = {};
  const write = (kind, page) => {
    pages[`${kind}.html`] = renderDocumentPage({ kind, language: "ko", analytics, languages: ["ko"], style: NOTE_STYLE, ...page });
  };
  write("notes/index", { heading: "노트", description: LIST_DESCRIPTION, body: listBody(notes) });
  for (const note of notes) {
    write(`notes/${note.slug}`, { heading: note.title, description: note.summary, body: noteBody(note, notes), structuredData: noteStructuredData(note) });
  }
  return pages;
}
