/**
 * Who made the game, as the start screen's credit (StudioCredit.jsx) and the
 * foot of every plain page (renderDocumentPage, scripts/legal-pages.mjs) print
 * it. The studio has a name in each language (STUDIO_NAMES, studioName); the
 * creators' names are the same in all three. The two creators made it together from plan to build, so they share one
 * CREATOR line with no role between them (decided 2026-11-04).
 *
 * The support and deletion address is SUPPORT_CONTACT in appConfig.js, which
 * stays SUPASONIC's alone; these are the creators' own addresses.
 */
export const STUDIO_NAMES = {
  ko: "찹쌀떡 스튜디오",
  en: "Mochi Verse Studio",
  ja: "STUDIOもちぷよ",
};

/** The studio's name in a page's language (decided 2026-11-05, ko / en / ja). */
export const studioName = (language) => STUDIO_NAMES[language] ?? STUDIO_NAMES.ko;

/** The Korean name, the source language's. */
export const STUDIO = STUDIO_NAMES.ko;

export const CREATORS = [
  { name: "SUPASONIC", email: "from.logic.to.magic@gmail.com" },
  { name: "ALICE", email: "goeun.nam@gmail.com" },
];

/** "SUPASONIC & ALICE" */
export const CREATOR_LINE = CREATORS.map((creator) => creator.name).join(" & ");

/** A creator's mail link's accessible name: the owner, then the address it shows. */
export const creatorMailLabel = (creator) => `${creator.name}: ${creator.email}`;
