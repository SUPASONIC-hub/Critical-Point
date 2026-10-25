/**
 * AdMob ad unit IDs (docs/app-shell.md, 「광고」).
 *
 * Every build uses Google's published test units until the live ones are
 * filled in below AND the build asks for them (`VITE_ADMOB_LIVE=true` in
 * the environment of `npm run build:web`). A development build must never
 * show live ads, and nobody on the team taps a live ad (memo B-1 (6)).
 *
 * The AdMob *app* IDs are native settings, not here: Android's
 * `admob_app_id` in app/android/app/src/main/res/values/strings.xml and iOS's
 * `GADApplicationIdentifier` in app/ios/App/App/Info.plist. Both hold the
 * test app IDs today; `npm run check:app -- --release` fails while any of the
 * four places still holds a test or placeholder ID.
 *
 * Test IDs: https://developers.google.com/admob/android/test-ads and
 * https://developers.google.com/admob/ios/test-ads
 */

export const TEST_UNITS = Object.freeze({
  android: Object.freeze({
    interstitial: "ca-app-pub-3940256099942544/1033173712",
    rewarded: "ca-app-pub-3940256099942544/5224354917",
  }),
  ios: Object.freeze({
    interstitial: "ca-app-pub-3940256099942544/4411468910",
    rewarded: "ca-app-pub-3940256099942544/1712485313",
  }),
});

// Placeholder: the live units from AdMob › Apps › 임계점 › Ad units, one
// interstitial (`between-cases`) and one rewarded (`reward-archive` and
// `reward-ending-hint` share it) per platform.
export const LIVE_UNITS = Object.freeze({
  android: Object.freeze({
    interstitial: "ca-app-pub-0000000000000000/0000000000",
    rewarded: "ca-app-pub-0000000000000000/0000000000",
  }),
  ios: Object.freeze({
    interstitial: "ca-app-pub-0000000000000000/0000000000",
    rewarded: "ca-app-pub-0000000000000000/0000000000",
  }),
});

const PLACEHOLDER = /^ca-app-pub-0{16}\//;

/**
 * The units a build uses, and whether they are the test ones.
 * @param {"ios" | "android"} platform
 * @param {boolean} wantLive
 */
export function adUnits(platform, wantLive) {
  const live = LIVE_UNITS[platform];
  const liveReady = Boolean(live) && !Object.values(live).some((id) => PLACEHOLDER.test(id));
  if (wantLive && liveReady) return { ...live, testing: false };
  return { ...(TEST_UNITS[platform] ?? TEST_UNITS.android), testing: true };
}
