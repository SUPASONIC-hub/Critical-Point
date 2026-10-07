import { createHash } from "node:crypto";

/**
 * The stylesheet scanner shared by the critical-CSS generator and the build
 * plugin that inlines its output.
 *
 * Vite's stylesheet is minified and comment-free, so a brace scanner that
 * understands string literals is enough; there is no comment case to lose its
 * place at, the way `check-css-structure` once did.
 *
 * One module rather than a copy in each because the two sides have to agree
 * exactly: the generator slices leaf rules out of the built sheet, and the
 * plugin proves each of those slices is still in it. A parser that drifted
 * between them would report staleness that is not there -- which is what a
 * copied version did on its first run, by comparing reconstructed `@media`
 * groups (which carry only the children the intro used) against the full groups
 * in the sheet.
 */

/** First line of the generated file: the sheet it was cut from. */
export const STYLESHEET_HASH_PREFIX = "/* built-stylesheet-sha256: ";

/** Splits the generated file into its source hash and its CSS. */
export function readGeneratedCritical(text) {
  if (!text.startsWith(STYLESHEET_HASH_PREFIX)) return { sourceHash: "", css: text.trim() };
  const end = text.indexOf("*/");
  return {
    sourceHash: text.slice(STYLESHEET_HASH_PREFIX.length, end).trim(),
    css: text.slice(end + 2).trim(),
  };
}

/**
 * Why the generated file cannot be inlined into this build, as the message of
 * a build error, or null when it was cut from exactly the sheet the build
 * made. `generated` is what `readGeneratedCritical` returned, `bundledCss`
 * the text of the app's sheet as the bundle holds it.
 *
 * The hash is the authority: a rule *added* to the intro leaves every
 * previously inlined rule intact, so a rule-by-rule comparison cannot see it,
 * and the intro would flash the part that is missing. The rule list is only
 * here to say what changed.
 *
 * Two cases used to pass by saying nothing: a generated file with no hash on
 * its first line, and a bundle the sheet could not be found in. Either is the
 * guard switched off, and a guard that can be switched off without a word is
 * not one -- so both are errors. `SKIP_CRITICAL_CSS=true` is the way to build
 * without it on purpose.
 */
export function criticalFreshnessProblem({ generated, bundledCss, file }) {
  const remedy = "Run `npm run build:critical` and commit the result.";
  if (!generated.sourceHash) {
    return `${file} does not say which stylesheet it was cut from (its first line should begin "${STYLESHEET_HASH_PREFIX}"), so this build cannot tell whether it is stale. ${remedy}`;
  }
  if (!bundledCss) {
    return `The app's stylesheet was not found in this build's bundle, so ${file} could not be checked against it. Inlining it unchecked is how a stale file reaches the site; set SKIP_CRITICAL_CSS=true to build without it on purpose.`;
  }
  if (generated.sourceHash === createHash("sha256").update(bundledCss).digest("hex")) return null;
  const missing = leafRuleTexts(generated.css).filter((rule) => !bundledCss.includes(rule));
  return (
    `${file} was cut from a different stylesheet than this build produced. ${remedy}\n` +
    (missing.length
      ? `${missing.length} inlined rules no longer appear at all; first: ${missing[0].slice(0, 120)}`
      : `Every inlined rule is still present, so the stylesheet gained rules the intro may paint with.`)
  );
}

const BACKSLASH = "\\";

/** Top-level items with byte spans; at-rule groups carry their children. */
export function parseRules(css, from = 0, to = css.length) {
  const items = [];
  let index = from;
  let preludeStart = from;
  while (index < to) {
    const ch = css[index];
    if (ch === '"' || ch === "'") {
      index += 1;
      while (index < to && css[index] !== ch) index += css[index] === BACKSLASH ? 2 : 1;
      index += 1;
      continue;
    }
    if (ch === ";") {
      const prelude = css.slice(preludeStart, index).trim();
      // A statement at-rule: @charset, @import, a @layer declaration.
      if (prelude.startsWith("@")) items.push({ kind: "statement", prelude, start: preludeStart, end: index + 1 });
      index += 1;
      preludeStart = index;
      continue;
    }
    if (ch === "{") {
      const prelude = css.slice(preludeStart, index).trim();
      let depth = 1;
      let cursor = index + 1;
      while (cursor < to && depth > 0) {
        const inner = css[cursor];
        if (inner === '"' || inner === "'") {
          cursor += 1;
          while (cursor < to && css[cursor] !== inner) cursor += css[cursor] === BACKSLASH ? 2 : 1;
        } else if (inner === "{") {
          depth += 1;
        } else if (inner === "}") {
          depth -= 1;
        }
        cursor += 1;
      }
      const isGroup =
        prelude.startsWith("@") &&
        !prelude.startsWith("@font-face") &&
        !prelude.startsWith("@keyframes") &&
        !prelude.startsWith("@page");
      items.push({
        kind: isGroup ? "group" : "rule",
        prelude,
        start: preludeStart,
        end: cursor,
        children: isGroup ? parseRules(css, index + 1, cursor - 1) : [],
      });
      index = cursor;
      preludeStart = index;
      continue;
    }
    index += 1;
  }
  return items;
}

/**
 * Every rule that actually carries declarations, flattened out of its groups.
 *
 * A group's own text is not comparable across the two sheets -- the critical one
 * keeps a subset of each group's children -- but a leaf rule is sliced verbatim,
 * so it either appears in the full sheet or the critical file is stale.
 */
export function leafRuleTexts(css) {
  const texts = [];
  const walk = (items) => {
    for (const item of items) {
      if (item.kind === "group") walk(item.children);
      else if (item.kind === "rule") texts.push(css.slice(item.start, item.end).trim());
    }
  };
  walk(parseRules(css));
  return texts;
}
