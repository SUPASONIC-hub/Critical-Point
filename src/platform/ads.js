/**
 * The store apps' ads and Remove Ads purchase, as the game calls them
 * (docs/app-shell.md). Ads are in the app only, never on the web (the user's
 * decision of 2026-10-25).
 *
 * Nothing on the web reaches this file. Each place the game calls it is
 * behind `__CP_APP__`, which the bundler writes false for the site's builds
 * (vite.config.js), so the call folds away with the lazy import it makes and
 * the site's chunks carry none of it (check-bundle-size.mjs fails a site build
 * that does). And should the app's build ever be opened in a browser, every
 * call here first asks `appShell()` and does nothing on the web: no native
 * module is loaded, no ad is asked for (tests/unit/app-ads.test.mjs).
 *
 * The native side is `cp:app-native` (app/native/index.js), loaded the first
 * time a call needs it. It owns the plugins (AdMob with Google UMP and iOS
 * ATT; StoreKit 2 / Play Billing); this file owns when to ask (adPacing.js),
 * the reward counts and the lines (adCopy.js).
 *
 * Every call answers; none throws. A native side that is missing or fails is
 * an ad that is not shown and a purchase that did not complete.
 */
import { appShell } from "./appShell.js";
import { CASE_SEQUENCE } from "../gameCases.js";
import { adCopy, adLanguage } from "./adCopy.js";
import { closeCase, countsForAds, interstitialShown } from "./adPacing.js";

export const PACING_KEY = "cp.ads.pacing";
export const REWARDS_KEY = "cp.ads.rewards";

/** The two rewarded slots the user chose (memo B-7 (4) (1)). */
export const REWARD_SLOTS = Object.freeze(["reward-archive", "reward-ending-hint"]);

const loadAppNative = () => import("cp:app-native").then((module) => module.default);

/**
 * @param {object} [options]
 * @param {any} [options.scope] the window; a test passes its own.
 * @param {() => Promise<any>} [options.loadNative] loads the native side.
 * @param {() => number} [options.now]
 * @param {readonly string[]} [options.caseOrder]
 */
export function createAds({ scope = globalThis, loadNative = loadAppNative, now = () => Date.now(), caseOrder = CASE_SEQUENCE } = {}) {
  let nativeSide = null;
  const inApp = () => appShell(scope) !== "web";
  const copy = () => adCopy(adLanguage(scope));

  const storage = () => {
    try {
      return scope?.localStorage ?? null;
    } catch {
      return null;
    }
  };
  const read = (key) => {
    try {
      return JSON.parse(storage()?.getItem(key) ?? "null");
    } catch {
      return null;
    }
  };
  const write = (key, value) => {
    try {
      storage()?.setItem(key, JSON.stringify(value));
    } catch {
      // A full or refused storage loses a count, never a choice.
    }
  };

  /** The native side, or null on the web and when it cannot be loaded. */
  function native() {
    if (!inApp()) return Promise.resolve(null);
    nativeSide ??= Promise.resolve()
      .then(loadNative)
      .then(
        (side) => side ?? null,
        () => null,
      );
    return nativeSide;
  }
  const attempt = async (work, fallback) => {
    try {
      return await work();
    } catch {
      return fallback;
    }
  };
  const ownsRemoveAds = (side) => attempt(() => side.store.owned(), false);

  /**
   * The result page's 「다음 사건」 was pressed on a case that closed: count
   * it, ask for consent on the first case that counts (사건 01, memo B-4),
   * and show an interstitial when one is due (adPacing.js). Resolves once
   * the ad, if any, is closed, so the next case opens after it.
   */
  let between = null;
  function beforeNextCase(closedCaseId) {
    if (!inApp()) return Promise.resolve({ shown: false, reason: "web" });
    // A second press while the first is still on its ad does not open the case twice.
    if (between) return Promise.resolve({ shown: false, reason: "busy" });
    between = betweenCases(closedCaseId).finally(() => {
      between = null;
    });
    return between;
  }
  async function betweenCases(closedCaseId) {
    const side = await native();
    if (!side) return { shown: false, reason: "unavailable" };
    const removeAds = await ownsRemoveAds(side);
    const { pacing, show } = closeCase(read(PACING_KEY), { caseId: closedCaseId, caseOrder, now: now(), removeAds });
    write(PACING_KEY, pacing);
    if (removeAds) return { shown: false, reason: "remove-ads" };
    if (!countsForAds(closedCaseId, caseOrder)) return { shown: false, reason: "first-ten-minutes" };
    const ready = await attempt(() => side.prepare({ copy: copy() }), null);
    if (!show) return { shown: false, reason: "not-due" };
    if (!ready?.canRequestAds) return { shown: false, reason: "no-consent" };
    const shown = await attempt(() => side.showInterstitial({ copy: copy() }), false);
    if (shown === true) write(PACING_KEY, interstitialShown(pacing, now()));
    return { shown: shown === true, reason: shown === true ? "shown" : "unavailable" };
  }

  /** How many of a rewarded slot's rewards this device has earned. */
  function rewardCount(slot) {
    const counts = read(REWARDS_KEY);
    const value = counts?.[slot];
    return Number.isInteger(value) && value > 0 ? value : 0;
  }
  function grant(slot) {
    const counts = read(REWARDS_KEY);
    write(REWARDS_KEY, { ...(counts && typeof counts === "object" ? counts : {}), [slot]: rewardCount(slot) + 1 });
  }

  /**
   * A rewarded slot's button was pressed (memo B-2, B-3). A Remove Ads buyer
   * gets the reward without an ad (memo C-6 (2)). The reward never touches a
   * score or a ranking, and it is never tied to the tracking question (B-1 (7)).
   *
   * Resolves to { status, message }: "rewarded", "closed" (the ad was closed
   * early), "unavailable", "offline", or "web".
   */
  async function watchRewarded(slot) {
    const lines = copy();
    if (!inApp() || !REWARD_SLOTS.includes(slot)) return { status: "web", message: "" };
    const side = await native();
    if (!side) return { status: "unavailable", message: lines.adUnavailable };
    if (await ownsRemoveAds(side)) {
      grant(slot);
      return { status: "rewarded", message: "", free: true };
    }
    if (scope?.navigator?.onLine === false) return { status: "offline", message: lines.adOffline };
    const ready = await attempt(() => side.prepare({ copy: lines }), null);
    if (!ready?.canRequestAds) return { status: "unavailable", message: lines.adUnavailable };
    const status = await attempt(() => side.showRewarded({ copy: lines }), "unavailable");
    if (status === "rewarded") {
      grant(slot);
      return { status, message: "" };
    }
    if (status === "closed") return { status, message: lines.adClosedEarly };
    if (status === "offline") return { status, message: lines.adOffline };
    return { status: "unavailable", message: lines.adUnavailable };
  }

  /** Remove Ads as the store has it: { available, owned, price }. */
  async function removeAdsState() {
    if (!inApp()) return { available: false, owned: false, price: null };
    const side = await native();
    if (!side) return { available: false, owned: false, price: null };
    const [owned, price] = await Promise.all([ownsRemoveAds(side), attempt(() => side.store.price(), null)]);
    return { available: true, owned, price };
  }

  const PURCHASE_MESSAGES = {
    bought: "bought",
    owned: "owned",
    restored: "restored",
    nothing: "nothingToRestore",
    cancelled: "cancelled",
    pending: "pending",
    offline: "purchaseOffline",
    failed: "failed",
  };
  const answer = (status) => {
    const known = status in PURCHASE_MESSAGES ? status : "failed";
    return { status: known, message: copy()[PURCHASE_MESSAGES[known]] };
  };

  /** The buy button (memo C-2). Resolves to { status, message } (memo C-3). */
  async function buyRemoveAds() {
    if (!inApp()) return { status: "web", message: "" };
    const side = await native();
    if (!side) return answer("failed");
    if (scope?.navigator?.onLine === false) return answer("offline");
    return answer(await attempt(() => side.store.buy(), "failed"));
  }

  /** 구매 복원 (memo B-5, C-3): asks the store account again. */
  async function restorePurchases() {
    if (!inApp()) return { status: "web", message: "" };
    const side = await native();
    if (!side) return answer("failed");
    if (scope?.navigator?.onLine === false) return answer("offline");
    return answer(await attempt(() => side.store.restore(), "failed"));
  }

  /**
   * 광고 개인정보 설정 다시 열기 (memo B-5): Google's privacy options form
   * where the region has one. Resolves to { status, message }: "shown", or
   * "not-required" with the line for a region without choices.
   */
  async function reviewAdPrivacy() {
    if (!inApp()) return { status: "web", message: "" };
    const side = await native();
    if (!side) return { status: "unavailable", message: copy().adUnavailable };
    const shown = await attempt(() => side.privacyOptions(), false);
    return shown ? { status: "shown", message: "" } : { status: "not-required", message: copy().privacyNoChoices };
  }

  return {
    inApp,
    platform: () => appShell(scope),
    copy,
    beforeNextCase,
    watchRewarded,
    rewardCount,
    removeAdsState,
    buyRemoveAds,
    restorePurchases,
    reviewAdPrivacy,
  };
}

/** The page's own: what the game's call sites use. */
export const ads = createAds();
