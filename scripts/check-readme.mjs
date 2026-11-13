/**
 * `npm run check:readme`: the measurable half of docs/readme-rules.md.
 *
 * The README is the game's portfolio page first. The part a visitor sees
 * without clicking (everything outside `<details>`) stays short and in a fixed
 * order; the detail lives below it in `<details>` blocks, one topic each. Both
 * halves are edited nearly every day, and on 2026-11-12 the page had grown to
 * 242 KB with four-column tables a phone could not read, so the rules are a
 * check rather than a habit.
 *
 * `readmeProblems(text, { imageBytes })` is pure: it takes the README's text
 * and a function that returns an image's size in bytes (or null when the file
 * is missing), and returns a list of problems, each `{ line, rule, message }`.
 */
import { existsSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

export const LIMITS = {
  /** UTF-8 bytes of the expanded part (outside `<details>`). */
  expandedBytes: 12_000,
  /** Columns in any table. */
  tableColumns: 3,
  /** Characters in a table cell outside `<details>` (link targets not counted). */
  expandedCellChars: 40,
  /** Characters in a table cell inside `<details>`. */
  detailCellChars: 160,
  /** Characters of a `<summary>`'s visible text. */
  summaryChars: 60,
  /** Bytes of one image under docs/images/. */
  imageBytes: 400 * 1024,
};

/** The expanded part's `##` sections, in this order (others may sit between). */
export const SECTION_ORDER = ["어떤 게임인가", "우리가 만든 방식", "바로 해 보기", "만든 이", "자세히 보기"];

const IMAGE_DIR = "docs/images/";

/** A table row's cells, `\|` kept inside its cell. */
export function tableCells(row) {
  const body = row.trim().replace(/^\|/, "").replace(/\|$/, "");
  const cells = [];
  let cell = "";
  for (let i = 0; i < body.length; i += 1) {
    if (body[i] === "\\" && body[i + 1] === "|") {
      cell += "|";
      i += 1;
    } else if (body[i] === "|") {
      cells.push(cell.trim());
      cell = "";
    } else {
      cell += body[i];
    }
  }
  cells.push(cell.trim());
  return cells;
}

/** What a reader sees of a cell: link text without its target, tags dropped. */
const visible = (text) => text.replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1").replace(/<[^>]+>/g, "");
const chars = (text) => [...text].length;

const attribute = (tag, name) => tag.match(new RegExp(`\\b${name}\\s*=\\s*"([^"]*)"`, "i"))?.[1];

export function readmeProblems(text, { imageBytes = () => null } = {}) {
  const problems = [];
  const add = (line, rule, message) => problems.push({ line, rule, message });
  const lines = text.split("\n");

  let fence = false;
  let inDetails = 0;
  let openedAt = 0;
  let firstDetails = 0;
  let expandedBytes = 0;
  const sections = [];

  lines.forEach((line, index) => {
    const n = index + 1;
    if (/^\s*```/.test(line)) fence = !fence;
    const outside = inDetails === 0;

    if (!fence && /^<details>\s*$/.test(line.trim())) {
      if (inDetails) add(n, "details", "a <details> inside another <details>: keep one level");
      if (!firstDetails) firstDetails = n;
      inDetails += 1;
      openedAt = n;
      const summary = lines[index + 1] ?? "";
      const match = summary.match(/^<summary>(.*)<\/summary>\s*$/);
      if (!match) add(n + 1, "summary", "the line after <details> is one `<summary>…</summary>` line");
      else {
        const shown = visible(match[1]).trim();
        if (!shown) add(n + 1, "summary", "the summary is empty");
        if (chars(shown) > LIMITS.summaryChars) add(n + 1, "summary", `the summary is ${chars(shown)} characters; at most ${LIMITS.summaryChars}`);
        if ((lines[index + 2] ?? "").trim() !== "") add(n + 2, "summary", "leave a blank line after </summary> so GitHub renders the Markdown inside");
      }
      return;
    }
    if (!fence && /^<\/details>\s*$/.test(line.trim())) {
      if (!inDetails) add(n, "details", "</details> without its <details>");
      else {
        inDetails -= 1;
        if ((lines[index - 1] ?? "").trim() !== "") add(n, "details", "leave a blank line before </details>");
      }
      return;
    }

    if (outside) {
      expandedBytes += Buffer.byteLength(`${line}\n`);
      if (firstDetails && line.trim() !== "") add(n, "order", "after the first <details>, everything sits inside a <details> block");
      const heading = !fence && line.match(/^## (.+?)\s*$/);
      if (heading) sections.push({ title: heading[1], line: n });
      if (!fence && /\b20\d\d-\d\d-\d\d\b/.test(line)) add(n, "log", "a date in the expanded part reads as a work log; put it inside <details> or docs/history.md");
    }

    if (!fence && /^\s*\|.*\|\s*$/.test(line) && !/^\s*\|[\s:|-]+\|\s*$/.test(line)) {
      const cells = tableCells(line);
      if (cells.length > LIMITS.tableColumns) add(n, "table", `a table with ${cells.length} columns; at most ${LIMITS.tableColumns} (a list reads better on a phone)`);
      const limit = outside ? LIMITS.expandedCellChars : LIMITS.detailCellChars;
      const longest = Math.max(...cells.map((cell) => chars(visible(cell))));
      if (longest > limit) add(n, "table", `a table cell of ${longest} characters ${outside ? "outside" : "inside"} <details>; at most ${limit}`);
    }

    if (!fence && /!\[[^\]]*\]\([^)]*\)/.test(line)) add(n, "image", "write images as <img src alt width>, not ![](…), so their width is set");
    if (!fence) {
      for (const [tag] of line.matchAll(/<img\b[^>]*>/gi)) {
        const src = attribute(tag, "src");
        const alt = attribute(tag, "alt");
        if (!alt?.trim()) add(n, "image", "an <img> without alt text");
        if (!attribute(tag, "width")) add(n, "image", "an <img> without a width");
        if (!src) add(n, "image", "an <img> without src");
        else if (!src.startsWith(IMAGE_DIR)) add(n, "image", `images live under ${IMAGE_DIR} (got ${src})`);
        else {
          const bytes = imageBytes(src);
          if (bytes == null) add(n, "image", `${src} does not exist`);
          else if (bytes > LIMITS.imageBytes) add(n, "image", `${src} is ${Math.round(bytes / 1024)} KB; at most ${LIMITS.imageBytes / 1024} KB`);
        }
      }
    }
  });

  if (inDetails) add(openedAt, "details", "a <details> that is never closed");
  if (!/^# \S/m.test(lines.slice(0, 20).join("\n"))) add(1, "order", "the page opens with its # title within the first lines");
  if (expandedBytes > LIMITS.expandedBytes) add(1, "length", `the expanded part is ${expandedBytes} bytes; at most ${LIMITS.expandedBytes} (move detail into a <details> block)`);

  let at = -1;
  for (const title of SECTION_ORDER) {
    const found = sections.findIndex((section, i) => i > at && section.title === title);
    if (found < 0) {
      add(1, "order", `the expanded part has no "## ${title}" after "## ${SECTION_ORDER[SECTION_ORDER.indexOf(title) - 1] ?? "(title)"}"`);
    } else at = found;
  }
  const last = sections.at(-1);
  if (last && last.title !== SECTION_ORDER.at(-1)) add(last.line, "order", `"## ${SECTION_ORDER.at(-1)}" is the last section above the <details> blocks`);

  return { problems, expandedBytes };
}

function main() {
  const root = process.cwd();
  const file = process.argv[2] ?? "README.md";
  const text = readFileSync(path.join(root, file), "utf8");
  const imageBytes = (src) => {
    const full = path.join(root, src);
    return existsSync(full) ? statSync(full).size : null;
  };
  const { problems, expandedBytes } = readmeProblems(text, { imageBytes });
  for (const problem of problems) console.error(`${file}:${problem.line}: [${problem.rule}] ${problem.message}`);
  if (problems.length) {
    console.error(`\n${problems.length} README rule(s) broken. The rules and why: docs/readme-rules.md.`);
    process.exit(1);
  }
  console.log(`check:readme: ${file} keeps docs/readme-rules.md (expanded part ${expandedBytes.toLocaleString("en-US")} of ${LIMITS.expandedBytes.toLocaleString("en-US")} bytes).`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();
