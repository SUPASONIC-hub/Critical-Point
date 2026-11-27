/**
 * The store apps' native side (docs/app-shell.md, 「광고」): what
 * `cp:app-native` is in the app build (vite.config.js appNative). The site's
 * builds never resolve this file; src/platform/ads.js is the only caller and
 * decides when.
 *
 * Plugins (app/package.json, exact versions):
 * - @capacitor-community/admob 8.2.1 -- AdMob, Google UMP consent, iOS ATT.
 * - @capgo/native-purchases 8.9.2 -- StoreKit 2 / Play Billing (store.js).
 *
 * The consent order is memo B-4's, asked the first time an ad is needed
 * (사건 01 closing), never at the first launch: the game's own data notice has
 * long been answered by then -> Google's UMP message, in the regions that need
 * one -> on iOS, the pre-prompt and then the system's ATT question -> the
 * Mobile Ads SDK is started. Ads are personalised only as UMP and ATT allow;
 * the SDK reads both answers itself.
 */
import { Capacitor } from "@capacitor/core";
import {
  AdMob,
  AdmobConsentStatus,
  InterstitialAdPluginEvents,
  MaxAdContentRating,
  RewardAdPluginEvents,
} from "@capacitor-community/admob";
import { adUnits } from "./adUnits.js";
import { showAdCover, showTrackingPrePrompt } from "./screens.js";
import { createStore } from "./store.js";

const platform = Capacitor.getPlatform() === "ios" ? "ios" : "android";
const units = adUnits(platform, import.meta.env.VITE_ADMOB_LIVE === "true");
const LOAD_TIMEOUT_MS = 8_000;
// A full-screen ad reports its own close; this only keeps the game from
// waiting forever on a close that never comes.
const CLOSE_TIMEOUT_MS = 120_000;
const COVER_MS = 1_000;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const withTimeout = (promise, ms) =>
  Promise.race([promise, wait(ms).then(() => Promise.reject(new Error("timeout")))]);

let prepared = null;

/** UMP, then ATT, then the SDK; once a session. Resolves to { canRequestAds }. */
function prepare({ copy }) {
  prepared ??= (async () => {
    let consent = await AdMob.requestConsentInfo();
    if (consent.status === AdmobConsentStatus.REQUIRED && consent.isConsentFormAvailable) {
      consent = await AdMob.showConsentForm();
    }
    if (platform === "ios") {
      const { status } = await AdMob.trackingAuthorizationStatus();
      if (status === "notDetermined") {
        await showTrackingPrePrompt(copy);
        await AdMob.requestTrackingAuthorization();
      }
    }
    if (!consent.canRequestAds) return { canRequestAds: false };
    await AdMob.initialize({
      initializeForTesting: units.testing,
      // The store rating is 13+ (memo D-4 (1)).
      maxAdContentRating: MaxAdContentRating.Teen,
    });
    return { canRequestAds: true };
  })().catch((error) => {
    prepared = null;
    throw error;
  });
  return prepared;
}

/** Resolves when one of the events fires (or the time runs out), then stops listening. */
async function firstOf(events, ms) {
  const handles = [];
  let done;
  const fired = new Promise((resolve) => {
    done = resolve;
  });
  for (const event of events) handles.push(await AdMob.addListener(event, () => done(event)));
  const event = await Promise.race([fired, wait(ms).then(() => "timeout")]);
  await Promise.all(handles.map((handle) => handle.remove().catch(() => {})));
  return event;
}

/**
 * The interstitial between cases: the cover goes up over the result page, the
 * ad loads behind it, and both are gone once the ad is closed. Resolves true
 * when an ad was shown.
 */
async function showInterstitial({ copy }) {
  const takeDown = showAdCover(copy);
  try {
    await Promise.all([
      withTimeout(AdMob.prepareInterstitial({ adId: units.interstitial, isTesting: units.testing }), LOAD_TIMEOUT_MS),
      wait(COVER_MS),
    ]);
    const closed = firstOf([InterstitialAdPluginEvents.Dismissed, InterstitialAdPluginEvents.FailedToShow], CLOSE_TIMEOUT_MS);
    await AdMob.showInterstitial();
    return (await closed) === InterstitialAdPluginEvents.Dismissed;
  } catch {
    return false;
  } finally {
    takeDown();
  }
}

/**
 * A rewarded ad. Resolves "rewarded" when the player earned it, "closed" when
 * it was closed early, "unavailable" when none loaded.
 */
async function showRewarded() {
  try {
    await withTimeout(AdMob.prepareRewardVideoAd({ adId: units.rewarded, isTesting: units.testing }), LOAD_TIMEOUT_MS);
  } catch {
    return "unavailable";
  }
  let rewarded = false;
  const earned = await AdMob.addListener(RewardAdPluginEvents.Rewarded, () => {
    rewarded = true;
  });
  try {
    const closed = firstOf([RewardAdPluginEvents.Dismissed, RewardAdPluginEvents.FailedToShow], CLOSE_TIMEOUT_MS);
    // Resolves only when the reward is earned; a closed ad leaves it pending.
    AdMob.showRewardVideoAd().then(
      () => {
        rewarded = true;
      },
      () => {},
    );
    const event = await closed;
    if (event === RewardAdPluginEvents.FailedToShow) return "unavailable";
    // The reward's callback comes just before the close.
    await wait(300);
    return rewarded ? "rewarded" : "closed";
  } finally {
    await earned.remove().catch(() => {});
  }
}

/** Google's privacy options form, where the region has one. Resolves true when it was shown. */
async function privacyOptions() {
  const consent = await AdMob.requestConsentInfo();
  // The plugin types this status but does not export its enum.
  if (consent.privacyOptionsRequirementStatus !== "REQUIRED") return false;
  await AdMob.showPrivacyOptionsForm();
  return true;
}

export default {
  platform,
  testing: units.testing,
  prepare,
  showInterstitial,
  showRewarded,
  privacyOptions,
  store: createStore(),
};
