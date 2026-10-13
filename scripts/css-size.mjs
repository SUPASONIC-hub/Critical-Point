/**
 * What a stylesheet weighs against its budget in check-css-structure.mjs: its
 * lines and UTF-8 bytes with the comments taken out.
 *
 * Until 2026-10-13 the budget counted the file as written, comments included.
 * The build strips comments, so none of those bytes reached a player, and the
 * budget was charging for the one part of a sheet that costs nothing to ship:
 * with several sheets a few dozen bytes under their number, the cheapest way
 * to fit a new rule was to delete the note explaining an old one.
 *
 * The rule, in full:
 *
 *  1. Line endings are read as LF, so a CRLF checkout measures the same file.
 *  2. A comment is removed together with the spaces and tabs directly in
 *     front of it on its line. `/*` inside a quoted string or an unquoted
 *     `url(...)` is not a comment, as in CSS itself; a comment nobody closed
 *     runs to the end of the file, also as in CSS.
 *  3. A line that held a comment and has nothing left but spaces and tabs is
 *     removed with its line break, so a note on a line of its own -- or a block
 *     of ten such lines -- leaves nothing behind. (The text after the file's
 *     last line break has no line break to go with, and stays as the empty
 *     line it becomes.)
 *  4. Everything else counts exactly as written, including the blank lines
 *     and indentation the author (or prettier) put there. Nothing is minified.
 *
 * A sheet with no comments therefore measures what it always did.
 *
 * postcss is in node_modules, but only as a dependency of Vite; no script here
 * imports it and package.json does not name it, so this is a scanner instead of
 * a borrowed parser that a Vite upgrade could move.
 */

const isBlank = (text) => /^[ \t]*$/.test(text);

/** The stylesheet with its comments removed, by the rule above. */
export function stripCssComments(source) {
  const css = source.replace(/\r\n?/g, "\n");
  const lines = [];
  let line = "";
  let heldComment = false;

  const endLine = () => {
    if (!(heldComment && isBlank(line))) lines.push(line);
    line = "";
    heldComment = false;
  };
  const take = (text) => {
    for (const char of text) {
      if (char === "\n") endLine();
      else line += char;
    }
  };

  let index = 0;
  while (index < css.length) {
    const char = css[index];

    if (char === "/" && css[index + 1] === "*") {
      const close = css.indexOf("*/", index + 2);
      index = close === -1 ? css.length : close + 2;
      line = line.replace(/[ \t]+$/, "");
      heldComment = true;
      continue;
    }

    if (char === '"' || char === "'") {
      const end = stringEnd(css, index);
      take(css.slice(index, end));
      index = end;
      continue;
    }

    if ((char === "u" || char === "U") && /^url\($/i.test(css.slice(index, index + 4)) && !isNameChar(css[index - 1])) {
      const end = unquotedUrlEnd(css, index + 4);
      if (end !== -1) {
        take(css.slice(index, end));
        index = end;
        continue;
      }
    }

    take(char);
    index += 1;
  }
  // The text after the last line break is a line too (empty, in a file that
  // ends with one), which is how the line count has always been taken. It is
  // kept even when a comment was all it held: it has no line break of its own
  // to go with it, and dropping it would take the one that ends the line
  // above, so a comment at the very end of a file would measure a byte *less*
  // than no comment at all.
  lines.push(line);
  return lines.join("\n");
}

/** Lines and UTF-8 bytes of a stylesheet, comments not counted. */
export function measureCss(source) {
  const stripped = stripCssComments(source);
  return {
    lines: stripped.split("\n").length,
    // Bytes, not `length`: UTF-16 units undercount every Korean character in
    // a `content` string by two.
    bytes: Buffer.byteLength(stripped, "utf8"),
  };
}

/** Lines and UTF-8 bytes as written, comments included: what the budget counted before 2026-10-13. */
export function measureCssAsWritten(source) {
  const css = source.replace(/\r\n?/g, "\n");
  return { lines: css.split("\n").length, bytes: Buffer.byteLength(css, "utf8") };
}

const isNameChar = (char) => char !== undefined && /[-\w\u0080-￿]/.test(char);

/** Index just past the string that opens at `start`. An unescaped line break ends a string nobody closed. */
function stringEnd(css, start) {
  const quote = css[start];
  let index = start + 1;
  while (index < css.length) {
    const char = css[index];
    if (char === "\\") index += 2;
    else if (char === quote) return index + 1;
    else if (char === "\n") return index;
    else index += 1;
  }
  return css.length;
}

/**
 * Index just past the `)` of an unquoted `url(`, whose contents start at
 * `start`; -1 when the url is quoted, and the string scanner is what reads it.
 */
function unquotedUrlEnd(css, start) {
  let index = start;
  while (css[index] === " " || css[index] === "\t" || css[index] === "\n") index += 1;
  if (css[index] === '"' || css[index] === "'") return -1;
  while (index < css.length) {
    if (css[index] === "\\") index += 2;
    else if (css[index] === ")") return index + 1;
    else index += 1;
  }
  return css.length;
}
