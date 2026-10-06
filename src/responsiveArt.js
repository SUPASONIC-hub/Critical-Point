/**
 * Responsive sources for the shipped art.
 *
 * Every scene image was authored 1,672px wide and shipped at that width to
 * every screen. A phone paints the key visual into a 356px slot and was
 * downloading 146KB for it. Each of these files also exists at 480px and
 * 960px, so the browser can pick the one that matches the slot.
 */

export const RESPONSIVE_ART = new Set([
  "/triggerlab-key-visual.webp",
  "/scene-case01.webp",
  "/scene-case02.webp",
  "/scene-case03.webp",
  "/scene-case04.webp",
  "/scene-case05.webp",
  "/ending-final-archive.webp",
  "/ending-oversight-room.webp",
  "/ending-system-collapse.webp",
]);

/** Where the phone layout stops and the wide layout starts. */
export const PHONE_ART_MEDIA = "(max-width: 700px)";

/** The width every original is painted at (scripts/check-art-budget.mjs reads the files). */
const ORIGINAL_WIDTH = 1672;

/**
 * The `srcset` values for one image, or null when the art has no variants and
 * the caller should render the original on its own. `wide` is given by width,
 * so it needs `wideSizes` beside it on the `<source>`.
 */
export function getArtSources(src) {
  if (!RESPONSIVE_ART.has(src)) return null;
  const base = src.replace(/\.webp$/, "");
  return {
    // A 356px slot at 1x, the same slot on a retina phone at 2x.
    phone: `${base}-480.webp 1x, ${base}-960.webp 2x`,
    // Past the phone layout the art is a full-bleed backdrop: as wide as the
    // screen. It was described by density (960 at 1x) from when the slot was
    // 918px, so a 1440px or 1920px monitor at 1x drew the 960px file up to
    // twice its size. By width, the browser takes 960 up to a 960px screen
    // and the original past it. `index.html` preloads the same list.
    wide: `${base}-960.webp 960w, ${src} ${ORIGINAL_WIDTH}w`,
    wideSizes: "100vw",
  };
}
