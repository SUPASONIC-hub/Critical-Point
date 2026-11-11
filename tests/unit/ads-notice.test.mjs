import assert from "node:assert/strict";
import test from "node:test";

import { analyticsFor } from "../../scripts/analytics-config.mjs";
import { adsEffectiveDate, adsNotice, adStage, ANALYTICS_EFFECTIVE_DATE } from "../../scripts/legal-pages.mjs";
import { renderStaticPages } from "../../scripts/site-pages.mjs";

/**
 * The ads' three stages on the plain pages (ADSENSE_ADS, ADSENSE_DATE;
 * draft #350): off, the notice seven days ahead (the policy's section 12), and
 * on. The notice is one paragraph at the top of the policy and of the terms
 * and changes nothing else; on, the notice is gone, the pages say what the ads
 * do -- section 6 now ending on how to limit what goes to them -- and both
 * pages carry the day as their date. Each in the three languages, with Google
 * Analytics off and on, the pair ANALYTICS_NOTICE and ANALYTICS_EFFECTIVE_DATE
 * make for the analytics.
 */
const ga = analyticsFor({ id: "G-ABC1234XYZ", command: "build", mode: "production", debug: false });
const DAY = "2026-12-01";
const WHEN = adsEffectiveDate(DAY);
const NOTICE = adsNotice(DAY);
const LANGUAGES = [
  ["ko", "privacy.html", "terms.html"],
  ["en", "en/privacy.html", "en/terms.html"],
  ["ja", "ja/privacy.html", "ja/terms.html"],
];
const effective = (html) => /<p class="effective">[^<]*<\/p>/.exec(html)?.[0];
const section6 = (html) => /<h2>6\. [\s\S]*?<h2>7\. /.exec(html)?.[0] ?? "";
const OPT_OUT = { ko: "광고를 위한 전송은 10번의 방법", en: "What is sent for the ads can be limited as described in section 10", ja: "広告のための送信は、10の方法" };

test("ADSENSE_DATE is written as each language writes a date", () => {
  assert.deepEqual(adsEffectiveDate("2026-12-01"), { ko: "2026년 12월 1일", en: "December 1, 2026", ja: "2026年12月1日" });
  assert.deepEqual(adsEffectiveDate("2027-01-15"), { ko: "2027년 1월 15일", en: "January 15, 2027", ja: "2027年1月15日" });
  for (const language of ["ko", "en", "ja"]) {
    assert.ok(NOTICE.privacy[language].includes(WHEN[language]), `privacy ${language} names the day`);
    assert.ok(NOTICE.terms[language].includes(WHEN[language]), `terms ${language} names the day`);
  }
});

test("the stage: off, on with the dates as they were, or what the build reads; a notice needs its day", () => {
  assert.deepEqual(adStage(false), { stage: "off", date: "" });
  assert.deepEqual(adStage(true), { stage: "on", date: "" });
  assert.deepEqual(adStage({ stage: "notice", date: DAY }), { stage: "notice", date: DAY });
  assert.throws(() => adStage({ stage: "notice" }), /ADSENSE_DATE/);
  assert.throws(() => adStage({ stage: "soon", date: DAY }), /"off", "notice" or "on"/);
});

for (const [name, analytics] of [
  ["Google Analytics off", null],
  ["Google Analytics on", ga],
]) {
  const off = renderStaticPages("", { analytics });
  const notice = renderStaticPages("", { analytics, ads: { stage: "notice", date: DAY } });
  const on = renderStaticPages("", { analytics, ads: { stage: "on", date: DAY } });
  const onUndated = renderStaticPages("", { analytics, ads: true });

  test(`${name}, the notice: the policy and the terms open with it, and nothing else changes`, () => {
    assert.deepEqual(Object.keys(notice), Object.keys(off));
    const changed = new Set(LANGUAGES.flatMap(([, privacy, terms]) => [privacy, terms]));
    for (const file of Object.keys(off)) if (!changed.has(file)) assert.equal(notice[file], off[file], `${file} is as it was`);
    for (const [language, privacy, terms] of LANGUAGES) {
      for (const [file, text] of [
        [privacy, NOTICE.privacy[language]],
        [terms, NOTICE.terms[language]],
      ]) {
        // The page without its notice is the page without ads, byte for byte; the notice comes right after the date line.
        assert.equal(notice[file].split(text).length, 2, `${file} has the notice once`);
        assert.equal(notice[file].replace(`${text}\n`, ""), off[file], `${file} is otherwise the page without ads`);
        assert.ok(notice[file].includes(`${effective(off[file])}\n${text}`), `${file}: the notice under the date line`);
        assert.equal(effective(notice[file]), effective(off[file]), `${file} keeps its date`);
      }
    }
  });

  test(`${name}, on: no notice, the ads' words with section 6's way to limit them, and the day as both pages' date`, () => {
    for (const [language, privacy, terms] of LANGUAGES) {
      for (const file of [privacy, terms]) {
        assert.ok(!on[file].includes(NOTICE.privacy[language]) && !on[file].includes(NOTICE.terms[language]), `${file}: no notice of the ads`);
        assert.ok(effective(on[file]).includes(WHEN[language]), `${file} is dated ${WHEN[language]}`);
        // Apart from the date, the dated build is the one the ad wording was written against.
        assert.equal(on[file].replace(effective(on[file]), ""), onUndated[file].replace(effective(onUndated[file]), ""), file);
      }
      assert.ok(section6(on[privacy]).includes(OPT_OUT[language]), `${privacy}: section 6 says how to limit what goes to the ads`);
      assert.ok(!section6(off[privacy]).includes(OPT_OUT[language]), `${privacy} (off): not before the ads`);
      assert.ok(!section6(notice[privacy]).includes(OPT_OUT[language]), `${privacy} (notice): not before the ads`);
    }
    // The other nine pages are the ones the ad wording writes, whatever the day.
    for (const file of Object.keys(on)) if (!/(privacy|terms)\.html$/.test(file)) assert.equal(on[file], onUndated[file], file);
    if (analytics) assert.ok(!effective(on["privacy.html"]).includes(ANALYTICS_EFFECTIVE_DATE.ko), "the ads' day replaces Google Analytics' on the policy");
  });
}
