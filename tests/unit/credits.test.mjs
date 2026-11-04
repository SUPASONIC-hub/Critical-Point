import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

import { SUPPORT_CONTACT } from "../../src/appConfig.js";
import { CREATOR_LINE, CREATORS, creatorMailLabel, STUDIO } from "../../src/credits.js";
import { renderLegalPages } from "../../scripts/legal-pages.mjs";
import { renderSitePages } from "../../scripts/site-pages.mjs";

/**
 * The credit the user decided on 2026-11-04: Tak'n Roll, and SUPASONIC and
 * ALICE as equal creators, each with an address. The support and deletion
 * address stays SUPASONIC's alone (support-contact.test.mjs names it too).
 */
const DECIDED = [
  { name: "SUPASONIC", email: "from.logic.to.magic@gmail.com" },
  { name: "ALICE", email: "goeun.nam@gmail.com" },
];

test("the credit names the studio and both creators on one line, with their addresses", () => {
  assert.equal(STUDIO, "Tak'n Roll");
  assert.deepEqual(CREATORS, DECIDED);
  assert.equal(CREATOR_LINE, "SUPASONIC & ALICE");
  assert.equal(creatorMailLabel(CREATORS[1]), "ALICE: goeun.nam@gmail.com");
});

test("the support contact stays SUPASONIC's address only", () => {
  assert.equal(SUPPORT_CONTACT, "from.logic.to.magic@gmail.com");
  assert.ok(!SUPPORT_CONTACT.includes(DECIDED[1].email));
});

test("the start screen's credit is a labeled list with both names and both mail links", () => {
  const source = readFileSync(new URL("../../src/components/StudioCredit.jsx", import.meta.url), "utf8");
  assert.match(source, /src="\/profile\.jpg"/, "the profile picture stays");
  for (const label of ["STUDIO", "CREATOR", "CONTACT"]) assert.match(source, new RegExp(`<dt lang="en">${label}</dt>`));
  assert.match(source, /<dd>\{STUDIO\}<\/dd>/);
  assert.match(source, /<dd>\{CREATOR_LINE\}<\/dd>/);
  assert.match(source, /CREATORS\.map\(/);
  assert.match(source, /href=\{`mailto:\$\{creator\.email\}`\}/);
  assert.match(source, /aria-label=\{creatorMailLabel\(creator\)\}/);
});

test("every plain page's foot carries the credit: both names and both mail links, each named for its owner", () => {
  const pages = { ...renderLegalPages(), ...renderSitePages() };
  assert.equal(Object.keys(pages).length, 15);
  for (const [file, html] of Object.entries(pages)) {
    const foot = /<footer>([\s\S]*)<\/footer>/.exec(html)?.[1] ?? "";
    assert.ok(foot.includes(`mailto:${SUPPORT_CONTACT}">${SUPPORT_CONTACT}</a>`), `${file}: the contact line is as it was`);
    assert.ok(foot.includes('<img src="/profile.jpg"'), `${file}: the profile picture`);
    assert.ok(foot.includes(`<dt lang="en">STUDIO</dt><dd>Tak'n Roll</dd>`), `${file}: the studio`);
    assert.ok(foot.includes(`<dt lang="en">CREATOR</dt><dd>SUPASONIC &amp; ALICE</dd>`), `${file}: both creators`);
    for (const { name, email } of DECIDED) {
      assert.ok(foot.includes(`<a href="mailto:${email}" aria-label="${name}: ${email}">${email}</a>`), `${file}: ${name}'s address`);
    }
  }
});

test("the about page says in each language that the two made the game together", () => {
  const site = renderSitePages();
  assert.ok(site["about.html"].includes("<p>기획부터 제작까지 SUPASONIC과 ALICE가 함께 만들었습니다.</p>"));
  assert.ok(site["en/about.html"].includes("<p>SUPASONIC and ALICE made the game together, from the first plan to the finished build.</p>"));
  assert.ok(site["ja/about.html"].includes("<p>企画から制作まで、SUPASONICとALICEが一緒に作りました。</p>"));
});
