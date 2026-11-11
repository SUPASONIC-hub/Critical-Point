import { CREATORS, studioName } from "../src/credits.js";
import { GAME_NAME, gamePath, pagePath, SHARE_IMAGE } from "./legal-pages.mjs";

/**
 * What a search engine reads about the site besides its words: schema.org
 * JSON-LD in the page's <head>, written by the build (no script runs it; a
 * `<script type="application/ld+json">` is data, which the CSP and
 * `inlineScriptProblems`, scripts/deploy-policy.mjs, let through).
 *
 *   the start page (index.html, /en/, /ja/) and the about page
 *     WebSite + VideoGame: the game's name, language, genre, the studio with
 *     its two creators (src/credits.js), free in the browser
 *   a case's page, the guide, the cast, how we made it
 *     BreadcrumbList: 사건 파일 > the case; the game > the page
 *
 * Why (2026-11-09): AdSense re-reviews the site for content and navigation,
 * and a search result names the game and the trail by these. No review or
 * rating is written here: the game has none, and a made-up one is against
 * Google's rules for structured data.
 *
 * Addresses are root-relative; the build makes them absolute on its origin
 * (`withAbsoluteSiteLinks`, scripts/site-pages.mjs), as it does the
 * canonical links.
 */

const CONTEXT = "https://schema.org";

/** The game's genres in each language, as the about page and the start page's no-script text put them. */
export const GAME_GENRES = {
  ko: ["기업·금융 미스터리", "푸시 유어 럭"],
  en: ["Corporate and financial mystery", "Push your luck"],
  ja: ["企業・金融ミステリー", "プッシュ・ユア・ラック"],
};

/** The currency the free price is named in, the page's own. */
const CURRENCY = { ko: "KRW", en: "USD", ja: "JPY" };

/** The studio, in the page's language and without the word studio, with both creators. */
export const studioOrganization = (language) => ({
  "@type": "Organization",
  name: studioName(language),
  member: CREATORS.map((creator) => ({ "@type": "Person", name: creator.name })),
});

/** The start page's and the about page's data: the site, and the game it is. `description` is the start page's own (START_PAGE). */
export function gameStructuredData({ language, description }) {
  const url = gamePath(language);
  return {
    "@context": CONTEXT,
    "@graph": [
      { "@type": "WebSite", name: GAME_NAME[language], url, inLanguage: language },
      {
        "@type": "VideoGame",
        name: GAME_NAME[language],
        url,
        inLanguage: language,
        description,
        image: SHARE_IMAGE.path,
        genre: GAME_GENRES[language],
        gamePlatform: "Web browser",
        applicationCategory: "Game",
        author: studioOrganization(language),
        offers: { "@type": "Offer", price: "0", priceCurrency: CURRENCY[language] },
      },
    ],
  };
}

/** A trail of `[name, path]` from the top, as a BreadcrumbList. */
export function breadcrumbStructuredData(trail) {
  return {
    "@context": CONTEXT,
    "@type": "BreadcrumbList",
    itemListElement: trail.map(([name, path], at) => ({ "@type": "ListItem", position: at + 1, name, item: path })),
  };
}

/** The trail of a page under the game: the game in its language, then the page. */
export const pageTrail = (kind, language, heading) => [
  [GAME_NAME[language], gamePath(language)],
  [heading, pagePath(kind, language)],
];

/**
 * The data as the tag the head carries: one line, and `<` written as `\u003c`
 * so no text inside can close the script early.
 */
export const structuredDataTag = (data) => `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, "\\u003c")}</script>`;

/** Every JSON-LD block in a page, parsed: what the tests read. */
export const readStructuredData = (html) =>
  [...String(html).matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((match) => JSON.parse(match[1]));
