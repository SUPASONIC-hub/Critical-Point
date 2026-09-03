/**
 * Responsive sources for the shipped art.
 *
 * Every scene image was authored at about 1,700px wide and shipped at that
 * width to every screen. A phone paints the key visual into a 356px slot and
 * was downloading 146KB for it. Each of these files also exists at 480px and
 * 960px, so the browser can pick the one that matches the slot.
 */

export const RESPONSIVE_ART = new Set([
  "/triggerlab-key-visual.webp",
  "/scene-case01.webp",
  "/scene-case02.webp",
  "/scene-case03.webp",
  "/scene-case04.webp",
  "/scene-case05.webp",
  "/scene-final.webp",
  "/ending-final-archive.webp",
  "/ending-oversight-room.webp",
  "/ending-system-collapse.webp",
]);

/** Where the phone layout stops and the wide layout starts. */
export const PHONE_ART_MEDIA = "(max-width: 700px)";

/**
 * The two `srcset` values for one image, or null when the art has no variants
 * and the caller should render the original on its own.
 */
export function getArtSources(src) {
  if (!RESPONSIVE_ART.has(src)) return null;
  const base = src.replace(/\.webp$/, "");
  return {
    // A 356px slot at 1x, the same slot on a retina phone at 2x.
    phone: `${base}-480.webp 1x, ${base}-960.webp 2x`,
    // A 918px slot at 1x, and the original for denser displays.
    wide: `${base}-960.webp 1x, ${src} 2x`,
  };
}
