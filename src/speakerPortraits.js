/**
 * Who has a painted portrait, by the name a scene gives as its speaker
 * (`node.speaker`). Moved out of GameRuntime on 2026-10-16: the table grows
 * one line per painted speaker, and the runtime's line budget is for its logic.
 *
 * A speaker who is not here -- or whose file does not arrive -- is drawn as a
 * tinted silhouette by SpeakerPortrait.
 */
const SPEAKER_PORTRAITS = {
  "한서윤": "/portrait-han-seoyun.webp",
  "반재욱": "/portrait-ban-jaeuk.webp",
  "도윤하": "/portrait-do-yunha.webp",
  "오진우": "/portrait-oh-jinwoo.webp",
  "에코": "/portrait-echo.webp",
  // Painted next, most lines first. A line is switched on in the same commit
  // that adds its file under public/ (scripts/build-portrait.mjs). These are not
  // warmed by the service worker -- only the five above are -- so each is
  // fetched when its speaker first appears; a file that does not arrive is
  // drawn as the silhouette (SpeakerPortrait).
  "이민서": "/portrait-lee-minseo.webp",
  "강태민": "/portrait-kang-taemin.webp",
  // "권도현": "/portrait-kwon-dohyeon.webp",
  "문가을": "/portrait-moon-gaeul.webp",
  "나준혁": "/portrait-na-junhyeok.webp",
  // "백아린": "/portrait-baek-arin.webp",
  // "윤상혁": "/portrait-yoon-sanghyeok.webp",
  // "문하준": "/portrait-moon-hajun.webp",
  "서하린": "/portrait-seo-harin.webp",
  "류세아": "/portrait-ryu-sea.webp",
  "임경수": "/portrait-lim-gyeongsu.webp",
  "노아": "/portrait-noah.webp",
  "임소율": "/portrait-lim-soyul.webp",
  "윤서진": "/portrait-yoon-seojin.webp",
  "한지우": "/portrait-han-jiwoo.webp",
};

/** The portrait's path for a speaker, or null for one not painted yet. */
export function getSpeakerPortrait(speaker) {
  return SPEAKER_PORTRAITS[speaker] ?? null;
}
