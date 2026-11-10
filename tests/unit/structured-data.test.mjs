import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { inlineScriptProblems } from "../../scripts/deploy-policy.mjs";
import { CASE_PAGES } from "../../scripts/content-pages/cases.mjs";
import { CONTENT_KINDS } from "../../scripts/content-pages/pages.mjs";
import { GAME_NAME } from "../../scripts/legal-pages.mjs";
import { renderStartPages, renderStaticPages, startStructuredData, withAbsoluteSiteLinks } from "../../scripts/site-pages.mjs";
import { breadcrumbStructuredData, GAME_GENRES, readStructuredData, structuredDataTag } from "../../scripts/structured-data.mjs";
import { CREATORS, STUDIO_NAMES } from "../../src/credits.js";

/**
 * The JSON-LD the build writes (scripts/structured-data.mjs, 2026-11-09): the
 * site and the game on the three start pages and the about pages, a trail on
 * each case's page and on the guide, the cast and the making-of. Read here as
 * a search engine reads it: parsed out of the head, nothing run.
 */
const ORIGIN = "https://critical-point-wn6p.onrender.com";
const INDEX = readFileSync("index.html", "utf8");
const built = withAbsoluteSiteLinks(INDEX, ORIGIN);
const START = { ko: built, ...Object.fromEntries(Object.entries(renderStartPages(built, ORIGIN)).map(([file, html]) => [file.slice(0, 2), html])) };
const STATIC = renderStaticPages(ORIGIN);
const LANGUAGES = ["ko", "en", "ja"];
const FOLDER = { ko: "", en: "en/", ja: "ja/" };
const head = (html) => html.slice(0, html.indexOf("</head>"));

function expectGame(data, language, file) {
  assert.equal(data["@context"], "https://schema.org", file);
  const types = data["@graph"].map((item) => item["@type"]);
  assert.deepEqual(types, ["WebSite", "VideoGame"], `${file}: the site and the game`);
  const [site, game] = data["@graph"];
  const home = `${ORIGIN}/${FOLDER[language]}`;
  assert.deepEqual(site, { "@type": "WebSite", name: GAME_NAME[language], url: home, inLanguage: language }, file);
  assert.equal(game.name, GAME_NAME[language], file);
  assert.equal(game.url, home, file);
  assert.equal(game.inLanguage, language, file);
  assert.ok(game.description?.length > 40, `${file}: a description`);
  assert.equal(game.image, `${ORIGIN}/triggerlab-key-visual.jpg`, `${file}: the share image, absolute`);
  assert.deepEqual(game.genre, GAME_GENRES[language], file);
  assert.equal(game.gamePlatform, "Web browser", file);
  assert.deepEqual(game.offers, { "@type": "Offer", price: "0", priceCurrency: { ko: "KRW", en: "USD", ja: "JPY" }[language] }, `${file}: free`);
  // The studio in the page's language, without the word studio, and both creators.
  assert.equal(game.author["@type"], "Organization", file);
  assert.equal(game.author.name, STUDIO_NAMES[language], file);
  assert.doesNotMatch(game.author.name, /studio|스튜디오|スタジオ/i, `${file}: the studio's name has no "studio"`);
  assert.deepEqual(
    game.author.member,
    CREATORS.map(({ name }) => ({ "@type": "Person", name })),
    `${file}: SUPASONIC and ALICE`,
  );
  assert.deepEqual(
    game.author.member.map((person) => person.name),
    ["SUPASONIC", "ALICE"],
  );
}

test("index.html carries the Korean start page's JSON-LD as startStructuredData writes it, and the other two start pages theirs", () => {
  assert.ok(INDEX.includes(startStructuredData("ko")), "index.html holds the tag byte for byte");
  for (const language of LANGUAGES) {
    const html = START[language];
    const blocks = readStructuredData(head(html));
    assert.equal(blocks.length, 1, `/${FOLDER[language]}: one JSON-LD block, in the head`);
    expectGame(blocks[0], language, `/${FOLDER[language]}`);
    assert.deepEqual(inlineScriptProblems(html), [], `/${FOLDER[language]}: nothing the CSP would block`);
  }
});

test("the about page names the game as the start page does, in its language", () => {
  for (const language of LANGUAGES) {
    const file = `${FOLDER[language]}about.html`;
    const blocks = readStructuredData(head(STATIC[file]));
    assert.equal(blocks.length, 1, file);
    expectGame(blocks[0], language, file);
  }
});

test("each case's page, the guide, the cast and the making-of carry a two-step trail; the other plain pages none", () => {
  const trailed = new Set(CONTENT_KINDS.filter((kind) => kind !== "cases/index"));
  for (const language of LANGUAGES) {
    for (const kind of CONTENT_KINDS) {
      const file = `${FOLDER[language]}${kind}.html`;
      const blocks = readStructuredData(head(STATIC[file]));
      if (!trailed.has(kind)) {
        assert.equal(blocks.length, 0, file);
        continue;
      }
      assert.equal(blocks.length, 1, file);
      const [trail] = blocks;
      assert.equal(trail["@context"], "https://schema.org", file);
      assert.equal(trail["@type"], "BreadcrumbList", file);
      const items = trail.itemListElement;
      assert.equal(items.length, 2, file);
      items.forEach((item, at) => {
        assert.equal(item["@type"], "ListItem", file);
        assert.equal(item.position, at + 1, file);
        assert.ok(item.name, file);
        assert.match(item.item, new RegExp(`^${ORIGIN}/`), `${file}: absolute addresses`);
      });
      // The page itself is the last step, named as its heading.
      assert.equal(items[1].item, `${ORIGIN}/${file}`, file);
      assert.ok(STATIC[file].includes(`<h1>${items[1].name.replace(/&/g, "&amp;")}</h1>`), `${file}: the last step is the heading`);
      const first = kind.startsWith("cases/") ? [`${ORIGIN}/${FOLDER[language]}cases/index.html`] : [`${ORIGIN}/${FOLDER[language]}`, GAME_NAME[language]];
      assert.equal(items[0].item, first[0], `${file}: under the case files or the game`);
      if (first[1]) assert.equal(items[0].name, first[1], file);
    }
  }
  assert.equal(CASE_PAGES.length + 3, trailed.size);
  for (const file of ["privacy.html", "en/terms.html", "ja/faq.html", "contact.html"]) assert.equal(readStructuredData(STATIC[file]).length, 0, file);
});

test("no review, rating or made-up number anywhere in the structured data", () => {
  const every = [...Object.values(START), ...Object.values(STATIC)].flatMap((html) => readStructuredData(html));
  assert.ok(every.length > CASE_PAGES.length * 3);
  // Keys and types only: a case may be titled "Review" (사건 15).
  const keysAndTypes = (value) =>
    Array.isArray(value)
      ? value.flatMap(keysAndTypes)
      : value && typeof value === "object"
        ? Object.entries(value).flatMap(([key, inner]) => [key, ...(key === "@type" ? [inner] : keysAndTypes(inner))])
        : [];
  for (const data of every) {
    for (const word of keysAndTypes(data)) assert.doesNotMatch(String(word), /review|rating|aggregate/i, `no ${word} in the data`);
  }
});

test("the tag stays one line and closes only where it ends", () => {
  const tag = structuredDataTag(breadcrumbStructuredData([["a</script><b>", "/x.html"]]));
  assert.equal(tag.match(/<\/script>/g).length, 1);
  assert.ok(tag.includes("\\u003c/script>"));
  assert.deepEqual(readStructuredData(tag)[0].itemListElement[0].name, "a</script><b>");
  assert.doesNotMatch(tag, /\n/);
  // No origin, nothing changes: a local build keeps its addresses relative.
  assert.equal(withAbsoluteSiteLinks(tag, ""), tag);
});
