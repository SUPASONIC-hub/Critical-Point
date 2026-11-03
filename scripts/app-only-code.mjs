import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

/**
 * The site carries no ads (the user's decision of 2026-10-25: ads in the
 * store apps only). check-bundle-size.mjs runs this on dist/ after every site
 * build; tests/unit/app-ads.test.mjs runs it on files of its own.
 */

/**
 * Names only the store apps' ad and purchase code has (src/platform/ads.js,
 * adCopy.js, src/components/AppStorePanel.jsx, app/native/), and the test
 * and live AdMob ID prefix.
 */
export const APP_ONLY_MARKERS = /AdMob|ca-app-pub-|NativePurchases|remove_ads|TrackingAuthorization|cp:app-native|beforeNextCase|watchRewarded|AppStorePanel|광고 제거|광고와 개인정보/;

/** The first file in a site build that carries app-only code, said as a failure, or null. */
export function findAppOnlyCode(dir) {
  const walk = (folder) =>
    readdirSync(folder, { withFileTypes: true }).flatMap((entry) =>
      entry.isDirectory() ? walk(path.join(folder, entry.name)) : [path.join(folder, entry.name)],
    );
  for (const file of walk(dir).filter((name) => /\.(js|html|css|json|webmanifest)$/.test(name))) {
    const match = APP_ONLY_MARKERS.exec(readFileSync(file, "utf8"));
    if (match) return `${path.relative(dir, file)} carries the store apps' ad or purchase code ("${match[0]}"); the site has none (vite.config.js appNative).`;
  }
  return null;
}
