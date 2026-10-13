import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { test } from "node:test";

import { measureCss, measureCssAsWritten, stripCssComments } from "../../scripts/css-size.mjs";

/**
 * What a stylesheet weighs against its budget (scripts/css-size.mjs, read by
 * scripts/check-css-structure.mjs): lines and bytes with the comments out.
 * The point of the rule is that a comment is free and nothing else is, so
 * that is what these hold it to.
 */
const SHEET = [".card {", "  color: red;", "}", "", ".card strong {", "  font-weight: 700;", "}", ""].join("\n");
const bytesOf = (text) => Buffer.byteLength(text, "utf8");

test("a sheet with no comments measures exactly as it is written", () => {
  assert.equal(stripCssComments(SHEET), SHEET);
  assert.deepEqual(measureCss(SHEET), { lines: 8, bytes: bytesOf(SHEET) });
  assert.deepEqual(measureCss(SHEET), measureCssAsWritten(SHEET));
});

test("a comment added to a sheet does not change what it measures", () => {
  const before = measureCss(SHEET);
  const withComments = {
    "on a line of its own": SHEET.replace(".card strong {", "/* The name is the only bold thing on a card. */\n.card strong {"),
    "indented inside a rule": SHEET.replace("  color: red;", "  /* red until the tokens land */\n  color: red;"),
    "over several lines": SHEET.replace(".card strong {", "/* The name is the only bold thing on a card,\n   and it stays that way\n   on a phone. */\n.card strong {"),
    "after a declaration": SHEET.replace("  color: red;", "  color: red; /* red until the tokens land */"),
    "after a declaration, unspaced": SHEET.replace("  color: red;", "  color: red;/* red */"),
    "in Korean": SHEET.replace(".card {", "/* 카드의 이름만 굵게 쓴다. */\n.card {"),
    "at the head of the file": `/* cards */\n${SHEET}`,
    "at the foot of the file": `${SHEET}/* end of cards */\n`,
    "at the foot of the file, with no line break after it": `${SHEET}/* end of cards */`,
    "two on one line": SHEET.replace(".card {", "/* one */ /* two */\n.card {"),
    "holding what looks like a rule": SHEET.replace(".card {", "/* .old { color: 'blue'; } */\n.card {"),
  };
  for (const [where, css] of Object.entries(withComments)) {
    assert.deepEqual(measureCss(css), before, `a comment ${where} changed the measure`);
    assert.equal(stripCssComments(css), SHEET, `a comment ${where} left something behind`);
    assert.ok(measureCssAsWritten(css).bytes > before.bytes, `the comment ${where} was not in the sheet under test`);
  }
});

test("a declaration added to a sheet costs every byte of itself", () => {
  const declaration = "  background: blue;\n";
  const grown = SHEET.replace("  color: red;\n", `  color: red;\n${declaration}`);
  const before = measureCss(SHEET);
  assert.deepEqual(measureCss(grown), { lines: before.lines + 1, bytes: before.bytes + bytesOf(declaration) });

  // And so does a blank line or a Korean `content` string: only comments are free.
  assert.deepEqual(measureCss(`${SHEET}\n`), { lines: before.lines + 1, bytes: before.bytes + 1 });
  const korean = '  content: "임계점";\n';
  assert.equal(measureCss(SHEET.replace("  color: red;\n", `  color: red;\n${korean}`)).bytes, before.bytes + bytesOf(korean));
  assert.equal(bytesOf(korean), korean.length + 6);
});

test("the blank lines the author wrote are counted; only a comment's own line goes", () => {
  const css = "a {\n  color: red;\n}\n\n/* note */\n\nb {\n  color: blue;\n}\n";
  assert.equal(stripCssComments(css), "a {\n  color: red;\n}\n\n\nb {\n  color: blue;\n}\n");
});

test("a comment opener inside a string is not a comment", () => {
  const strings = [
    '.a::after {\n  content: "/* not a comment */";\n}\n',
    ".a::after {\n  content: '/* not a comment */';\n}\n",
    '.a::after {\n  content: "say \\"/* still not */\\"";\n}\n',
    ".a::after {\n  content: 'it\\'s /* not */';\n}\n",
    '.a {\n  background: url("/img/a/*b*/c.png");\n}\n',
  ];
  for (const css of strings) {
    assert.equal(stripCssComments(css), css);
    assert.deepEqual(measureCss(css), measureCssAsWritten(css));
  }

  // A real comment beside such a string still goes, and the string stays whole.
  const mixed = '.a::after {\n  /* the opener below is text */\n  content: "/*"; /* and this is not */\n}\n';
  assert.equal(stripCssComments(mixed), '.a::after {\n  content: "/*";\n}\n');

  // A quote inside a comment opens nothing.
  assert.equal(stripCssComments("/* don't */\n.a {\n  color: red;\n}\n"), ".a {\n  color: red;\n}\n");
});

test("a comment opener inside an unquoted url() is not a comment", () => {
  const css = ".a {\n  background: url(/img/a/*b*/c.png) no-repeat;\n}\n";
  assert.equal(stripCssComments(css), css);
  const upper = ".a {\n  background: URL( /img/*/c.png );\n}\n";
  assert.equal(stripCssComments(upper), upper);
  // `url(` is the function, not the tail of another name.
  assert.equal(stripCssComments(".a {\n  mask: my-url(/* gone */ 1);\n}\n"), ".a {\n  mask: my-url( 1);\n}\n");
  // After the url closes, comments are comments again.
  assert.equal(stripCssComments(".a {\n  background: url(a.png); /* gone */\n}\n"), ".a {\n  background: url(a.png);\n}\n");
});

test("a comment nobody closed runs to the end of the file, as it does in a browser", () => {
  assert.equal(stripCssComments(".a {\n  color: red;\n}\n/* unfinished\n.b {\n  color: blue;\n}\n"), ".a {\n  color: red;\n}\n");
});

test("a CRLF checkout measures the same file as an LF one", () => {
  const css = SHEET.replace(".card strong {", "/* a note\n   on two lines */\n.card strong {");
  const crlf = css.replace(/\n/g, "\r\n");
  assert.notEqual(bytesOf(crlf), bytesOf(css));
  assert.deepEqual(measureCss(crlf), measureCss(css));
  assert.deepEqual(measureCssAsWritten(crlf), measureCssAsWritten(css));
  assert.equal(stripCssComments(crlf), SHEET);
});

test("the app's own sheets: no comment survives, and one more costs nothing", () => {
  const directory = "src/styles/app";
  const sheets = readdirSync(directory).filter((entry) => entry.endsWith(".css"));
  assert.ok(sheets.length >= 9);
  for (const sheet of sheets) {
    const css = readFileSync(`${directory}/${sheet}`, "utf8");
    const stripped = stripCssComments(css);
    assert.ok(!stripped.includes("/*") && !stripped.includes("*/"), `${sheet} kept part of a comment`);
    // Stripping what is already stripped changes nothing.
    assert.equal(stripCssComments(stripped), stripped);
    // The rules themselves are untouched: the same text once whitespace is set aside.
    const naive = css.replace(/\r\n?/g, "\n").replace(/\/\*[\s\S]*?\*\//g, "");
    assert.equal(stripped.replace(/\s+/g, ""), naive.replace(/\s+/g, ""), `${sheet} lost something that was not a comment`);

    const measured = measureCss(css);
    const firstRule = css.indexOf("{");
    const commented = `/* a note at the head */\n${css.slice(0, firstRule + 1)}\n  /* a note inside the first rule,\n     on two lines */${css.slice(firstRule + 1)}/* and one at the foot */\n`;
    assert.deepEqual(measureCss(commented), measured, sheet);
  }
});
