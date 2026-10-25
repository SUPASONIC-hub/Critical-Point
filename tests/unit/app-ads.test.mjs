import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";

import { createAds, PACING_KEY, REWARDS_KEY } from "../../src/platform/ads.js";
import { adCopy, adLanguage, buyButtonText } from "../../src/platform/adCopy.js";
import { AD_RULES, closeCase, countsForAds, interstitialShown, isoWeek, localDay, readPacing } from "../../src/platform/adPacing.js";
import { CASE_SEQUENCE } from "../../src/gameCases.js";
import { findAppOnlyCode } from "../../scripts/app-only-code.mjs";

// The store apps' ads and Remove Ads purchase (docs/app-shell.md): in the app
// only, never on the web (the user's decision 3 of 2026-10-25), placed as the
// app-launch memo B says and sold as memo C says.

function memoryStorage() {
  const rows = new Map();
  return {
    getItem: (key) => (rows.has(key) ? rows.get(key) : null),
    setItem: (key, value) => rows.set(key, String(value)),
    rows,
  };
}

const MINUTE = 60_000;
// A Monday in October 2026, at noon local time: not the kill switch's week.
const MONDAY = new Date(2026, 9, 26, 12, 0, 0).getTime();

function appScope(platform = "ios", extra = {}) {
  return {
    Capacitor: { isNativePlatform: () => true, getPlatform: () => platform },
    localStorage: memoryStorage(),
    navigator: { onLine: true },
    document: { documentElement: { lang: "ko" } },
    ...extra,
  };
}

function fakeNative({ owned = false, canRequestAds = true, interstitial = true, rewarded = "rewarded", buy = "bought", restore = "restored", privacy = true } = {}) {
  const calls = [];
  const side = {
    calls,
    prepare: async () => {
      calls.push("prepare");
      return { canRequestAds };
    },
    showInterstitial: async () => {
      calls.push("interstitial");
      return interstitial;
    },
    showRewarded: async () => {
      calls.push("rewarded");
      return rewarded;
    },
    privacyOptions: async () => {
      calls.push("privacy");
      return privacy;
    },
    store: {
      owned: async () => owned,
      price: async () => "₩3,300",
      buy: async () => {
        calls.push("buy");
        return buy;
      },
      restore: async () => {
        calls.push("restore");
        return restore;
      },
    },
  };
  return side;
}

test("on the web no call loads the native side, asks for an ad, or writes anything", async () => {
  for (const scope of [
    { localStorage: memoryStorage(), document: { referrer: "" } },
    // The Capacitor web runtime (the app's build opened in a browser) is the web too.
    { Capacitor: { isNativePlatform: () => false, getPlatform: () => "web" }, localStorage: memoryStorage() },
    {},
  ]) {
    let loads = 0;
    const ads = createAds({
      scope,
      loadNative: async () => {
        loads += 1;
        return fakeNative();
      },
      now: () => MONDAY,
    });
    assert.equal(ads.inApp(), false);
    for (const caseId of CASE_SEQUENCE) assert.deepEqual(await ads.beforeNextCase(caseId), { shown: false, reason: "web" });
    assert.equal((await ads.watchRewarded("reward-ending-hint")).status, "web");
    assert.deepEqual(await ads.removeAdsState(), { available: false, owned: false, price: null });
    assert.equal((await ads.buyRemoveAds()).status, "web");
    assert.equal((await ads.restorePurchases()).status, "web");
    assert.equal((await ads.reviewAdPrivacy()).status, "web");
    assert.equal(ads.rewardCount("reward-ending-hint"), 0);
    assert.equal(loads, 0, "the native side is never loaded on the web");
    assert.equal(scope.localStorage?.rows.size ?? 0, 0, "nothing is written on the web");
  }
});

test("between cases: none in the first ten minutes, consent when 사건 01 closes, then one every three cases", async () => {
  let time = MONDAY;
  const side = fakeNative();
  const scope = appScope();
  const ads = createAds({ scope, loadNative: async () => side, now: () => time });
  for (const caseId of ["prologue01", "prologue02", "prologue03", "prologue04", "prologue05"]) {
    assert.equal((await ads.beforeNextCase(caseId)).reason, "first-ten-minutes");
  }
  assert.deepEqual(side.calls, [], "nothing is asked before 사건 01 closes");
  assert.equal((await ads.beforeNextCase("case01")).reason, "not-due");
  assert.deepEqual(side.calls, ["prepare"], "the consent questions come when 사건 01 closes (memo B-4)");
  assert.equal((await ads.beforeNextCase("case02")).reason, "not-due");
  assert.deepEqual(await ads.beforeNextCase("case03"), { shown: true, reason: "shown" });
  assert.equal(side.calls.filter((call) => call === "interstitial").length, 1);
  assert.equal(readPacing(JSON.parse(scope.localStorage.rows.get(PACING_KEY))).closed, 0);
  // Three more cases, but inside the eight minutes: due, held for the next case.
  time += 2 * MINUTE;
  for (const caseId of ["case04", "case05", "case06"]) assert.equal((await ads.beforeNextCase(caseId)).shown, false);
  time += 8 * MINUTE;
  assert.equal((await ads.beforeNextCase("case07")).shown, true, "a held ad comes on the next case after the eight minutes");
});

test("between cases: at most four a day, none for a buyer, none without consent, and a second press waits", async () => {
  let time = MONDAY;
  const side = fakeNative();
  const ads = createAds({ scope: appScope("android"), loadNative: async () => side, now: () => time });
  let shown = 0;
  for (const caseId of CASE_SEQUENCE.slice(5, 35)) {
    time += 10 * MINUTE;
    if ((await ads.beforeNextCase(caseId)).shown) shown += 1;
  }
  assert.equal(shown, AD_RULES.dailyMax);
  // The next day, the count of the day starts over.
  time = MONDAY + 24 * 60 * MINUTE;
  for (const caseId of ["case36", "case37", "case38"]) await ads.beforeNextCase(caseId);
  assert.equal(side.calls.filter((call) => call === "interstitial").length, AD_RULES.dailyMax + 1);

  const buyer = fakeNative({ owned: true });
  const bought = createAds({ scope: appScope(), loadNative: async () => buyer, now: () => MONDAY });
  for (const caseId of CASE_SEQUENCE.slice(5, 20)) assert.equal((await bought.beforeNextCase(caseId)).reason, "remove-ads");
  assert.deepEqual(buyer.calls, [], "a buyer is never asked for consent or shown an ad");

  const refused = fakeNative({ canRequestAds: false });
  const noConsent = createAds({ scope: appScope(), loadNative: async () => refused, now: () => MONDAY });
  for (const caseId of ["case01", "case02", "case03"]) await noConsent.beforeNextCase(caseId);
  assert.equal(refused.calls.includes("interstitial"), false);

  let release;
  const slow = { ...fakeNative(), prepare: () => new Promise((resolve) => (release = () => resolve({ canRequestAds: true }))) };
  const pressed = createAds({ scope: appScope(), loadNative: async () => slow, now: () => MONDAY });
  const first = pressed.beforeNextCase("case01");
  assert.equal((await pressed.beforeNextCase("case01")).reason, "busy");
  await new Promise((resolve) => setTimeout(resolve, 0));
  release();
  assert.equal((await first).reason, "not-due");
});

test("a native side that fails or is missing shows nothing and says so, and never throws", async () => {
  const missing = createAds({ scope: appScope(), loadNative: async () => null, now: () => MONDAY });
  assert.equal((await missing.beforeNextCase("case03")).reason, "unavailable");
  assert.equal((await missing.watchRewarded("reward-archive")).status, "unavailable");
  assert.equal((await missing.buyRemoveAds()).status, "failed");
  assert.equal((await missing.restorePurchases()).status, "failed");
  assert.equal((await missing.reviewAdPrivacy()).status, "unavailable");
  assert.deepEqual(await missing.removeAdsState(), { available: false, owned: false, price: null });

  const broken = createAds({
    scope: appScope(),
    loadNative: async () => {
      throw new Error("chunk failed");
    },
  });
  assert.equal((await broken.beforeNextCase("case03")).reason, "unavailable");

  const throwing = fakeNative();
  throwing.store.owned = async () => {
    throw new Error("billing unavailable");
  };
  throwing.showInterstitial = async () => {
    throw new Error("no fill");
  };
  throwing.store.buy = async () => {
    throw new Error("crash");
  };
  let time = MONDAY;
  const ads = createAds({ scope: appScope(), loadNative: async () => throwing, now: () => (time += 10 * MINUTE) });
  for (const caseId of ["case01", "case02"]) await ads.beforeNextCase(caseId);
  assert.deepEqual(await ads.beforeNextCase("case03"), { shown: false, reason: "unavailable" });
  assert.equal((await ads.beforeNextCase("case04")).shown, false, "a failed ad stays due and is tried again");
  assert.equal(throwing.calls.filter((call) => call === "prepare").length, 4);
  assert.deepEqual(await ads.buyRemoveAds(), { status: "failed", message: adCopy("ko").failed });
});

test("rewarded ads: a reward for a whole ad, free for a buyer, and the memo's line otherwise", async () => {
  const scope = appScope();
  const ads = createAds({ scope, loadNative: async () => fakeNative() });
  assert.deepEqual(await ads.watchRewarded("reward-ending-hint"), { status: "rewarded", message: "" });
  assert.deepEqual(await ads.watchRewarded("reward-ending-hint"), { status: "rewarded", message: "" });
  assert.equal(ads.rewardCount("reward-ending-hint"), 2);
  assert.equal(ads.rewardCount("reward-archive"), 0);
  assert.deepEqual(JSON.parse(scope.localStorage.rows.get(REWARDS_KEY)), { "reward-ending-hint": 2 });
  assert.equal((await ads.watchRewarded("reward-replay")).status, "web", "only the two slots the user chose");

  const buyer = fakeNative({ owned: true });
  const free = createAds({ scope: appScope(), loadNative: async () => buyer });
  assert.deepEqual(await free.watchRewarded("reward-archive"), { status: "rewarded", message: "", free: true });
  assert.deepEqual(buyer.calls, [], "a buyer's reward needs no ad and no consent");

  const ko = adCopy("ko");
  const closed = createAds({ scope: appScope(), loadNative: async () => fakeNative({ rewarded: "closed" }) });
  assert.deepEqual(await closed.watchRewarded("reward-archive"), { status: "closed", message: ko.adClosedEarly });
  assert.equal(closed.rewardCount("reward-archive"), 0);
  const empty = createAds({ scope: appScope(), loadNative: async () => fakeNative({ rewarded: "unavailable" }) });
  assert.deepEqual(await empty.watchRewarded("reward-archive"), { status: "unavailable", message: ko.adUnavailable });
  const lost = createAds({ scope: appScope(), loadNative: async () => fakeNative({ rewarded: "offline" }) });
  assert.deepEqual(await lost.watchRewarded("reward-archive"), { status: "offline", message: ko.adOffline });
  const offline = createAds({ scope: appScope("ios", { navigator: { onLine: false } }), loadNative: async () => fakeNative() });
  assert.deepEqual(await offline.watchRewarded("reward-archive"), { status: "offline", message: ko.adOffline });
  const refused = createAds({ scope: appScope(), loadNative: async () => fakeNative({ canRequestAds: false }) });
  assert.equal((await refused.watchRewarded("reward-archive")).status, "unavailable");
  const english = createAds({ scope: appScope("ios", { document: { documentElement: { lang: "en" } } }), loadNative: async () => fakeNative({ rewarded: "closed" }) });
  assert.equal((await english.watchRewarded("reward-archive")).message, adCopy("en").adClosedEarly);
});

test("Remove Ads: the store's answers in memo C-3's words, restore and privacy options", async () => {
  const ko = adCopy("ko");
  const cases = [
    ["bought", ko.bought],
    ["owned", ko.owned],
    ["cancelled", ko.cancelled],
    ["pending", ko.pending],
    ["offline", ko.purchaseOffline],
    ["failed", ko.failed],
    ["something new", ko.failed],
  ];
  for (const [status, message] of cases) {
    const ads = createAds({ scope: appScope(), loadNative: async () => fakeNative({ buy: status }) });
    assert.deepEqual(await ads.buyRemoveAds(), { status: status === "something new" ? "failed" : status, message });
  }
  const restored = createAds({ scope: appScope(), loadNative: async () => fakeNative() });
  assert.deepEqual(await restored.restorePurchases(), { status: "restored", message: ko.restored });
  const nothing = createAds({ scope: appScope(), loadNative: async () => fakeNative({ restore: "nothing" }) });
  assert.deepEqual(await nothing.restorePurchases(), { status: "nothing", message: ko.nothingToRestore });
  const offline = createAds({ scope: appScope("android", { navigator: { onLine: false } }), loadNative: async () => fakeNative() });
  assert.equal((await offline.buyRemoveAds()).status, "offline");
  assert.equal((await offline.restorePurchases()).status, "offline");
  assert.deepEqual(await restored.removeAdsState(), { available: true, owned: false, price: "₩3,300" });
  assert.equal(restored.platform(), "ios");
  assert.deepEqual(await restored.reviewAdPrivacy(), { status: "shown", message: "" });
  const noForm = createAds({ scope: appScope(), loadNative: async () => fakeNative({ privacy: false }) });
  assert.deepEqual(await noForm.reviewAdPrivacy(), { status: "not-required", message: ko.privacyNoChoices });
});

test("the pacing reads any stored count safely and names days and weeks as the rules do", () => {
  assert.deepEqual(readPacing(null), { closed: 0, day: "", shownToday: 0, lastShownAt: 0 });
  assert.deepEqual(readPacing({ closed: -1, day: 3, shownToday: "2", lastShownAt: Number.NaN }), { closed: 0, day: "", shownToday: 0, lastShownAt: 0 });
  assert.equal(localDay(new Date(2026, 0, 5, 23, 59).getTime()), "2026-01-05");
  assert.equal(isoWeek(new Date(2026, 10, 16).getTime()), "2026-W47");
  assert.equal(isoWeek(new Date(2026, 10, 22).getTime()), "2026-W47");
  assert.equal(isoWeek(new Date(2026, 10, 23).getTime()), "2026-W48");
  assert.equal(isoWeek(new Date(2027, 0, 1).getTime()), "2026-W53");
  assert.equal(countsForAds("case01", CASE_SEQUENCE), true);
  assert.equal(countsForAds("prologue05", CASE_SEQUENCE), false);
  assert.equal(countsForAds("case01", ["prologue01"]), false);
  // The test week (2026-W47) shows none, however many cases close.
  let pacing = null;
  const testWeek = new Date(2026, 10, 18, 12).getTime();
  for (const caseId of ["case01", "case02", "case03", "case04"]) {
    const next = closeCase(pacing, { caseId, caseOrder: CASE_SEQUENCE, now: testWeek });
    assert.equal(next.show, false);
    pacing = next.pacing;
  }
  assert.equal(closeCase(pacing, { caseId: "case05", caseOrder: CASE_SEQUENCE, now: MONDAY }).show, true);
  assert.deepEqual(interstitialShown({ day: "2026-10-25", shownToday: 3 }, MONDAY), { closed: 0, day: "2026-10-26", shownToday: 1, lastShownAt: MONDAY });
});

test("the lines are memo B's and C's, in Korean unless the page is English", () => {
  assert.equal(adLanguage({ document: { documentElement: { lang: "en-US" } } }), "en");
  assert.equal(adLanguage({ document: { documentElement: { lang: "ko" } } }), "ko");
  assert.equal(adLanguage({}), "ko");
  const hostile = {
    get document() {
      throw new Error("blocked");
    },
  };
  assert.equal(adLanguage(hostile), "ko");
  assert.equal(adCopy("fr"), adCopy("ko"));
  assert.equal(buyButtonText(adCopy("ko"), "₩3,300"), "₩3,300에 광고 제거");
  assert.equal(buyButtonText(adCopy("en"), "$2.99"), "Remove ads for $2.99");
  assert.equal(adCopy("ko").buyWithdrawal, "구매 즉시 적용되며 청약철회가 제한될 수 있습니다. 환불은 스토어 정책을 따릅니다.");
  assert.equal(adCopy("ko").rewardNote, "점수와 순위에는 영향이 없습니다.");
  assert.deepEqual(Object.keys(adCopy("en")).sort(), Object.keys(adCopy("ko")).sort());
});

test("every place the game reaches the app-only code is behind __CP_APP__", () => {
  const files = [];
  const walk = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (/\.(js|jsx)$/.test(entry.name)) files.push(full);
    }
  };
  walk("src");
  const appOnly = /platform\/ads\.js|AppStorePanel\.jsx|cp:app-native/;
  const own = new Set(["src/platform/ads.js", "src/components/AppStorePanel.jsx", "src/vite-env.d.ts"].map((file) => path.normalize(file)));
  const reached = [];
  for (const file of files.filter((name) => !own.has(path.normalize(name)))) {
    const lines = readFileSync(file, "utf8").split("\n");
    lines.forEach((line, index) => {
      if (!appOnly.test(line) || line.trim().startsWith("//") || line.trim().startsWith("*")) return;
      reached.push(file);
      const near = lines.slice(Math.max(0, index - 2), index + 1).join("\n");
      assert.match(near, /__CP_APP__/, `${file}:${index + 1} reaches app-only code outside __CP_APP__`);
      assert.match(line, /import\(/, `${file}:${index + 1} imports app-only code statically`);
    });
  }
  assert.deepEqual([...new Set(reached)].map((file) => path.basename(file)).sort(), ["GameRuntime.jsx", "IntroScreen.jsx"]);
});

test("the site-build check finds app-only code in a dist folder and passes a clean one", () => {
  const dir = mkdtempSync(path.join(os.tmpdir(), "cp-dist-"));
  try {
    mkdirSync(path.join(dir, "assets"));
    writeFileSync(path.join(dir, "index.html"), "<!doctype html><script src=/assets/index.js></script>");
    writeFileSync(path.join(dir, "assets", "index.js"), "export const game = 1;");
    assert.equal(findAppOnlyCode(dir), null);
    writeFileSync(path.join(dir, "assets", "ads-1.js"), 'const unit = "ca-app-pub-3940256099942544/1033173712";');
    assert.match(findAppOnlyCode(dir), /ads-1\.js carries the store apps' ad or purchase code \("ca-app-pub-"\)/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("a storage that is refused, full or holds junk loses counts, never an answer", async () => {
  const refused = appScope();
  Object.defineProperty(refused, "localStorage", {
    get() {
      throw new Error("SecurityError");
    },
  });
  const junk = appScope("android", {
    localStorage: {
      getItem: () => "{not json",
      setItem: () => {
        throw new Error("QuotaExceededError");
      },
    },
  });
  for (const scope of [refused, junk]) {
    const ads = createAds({ scope, loadNative: async () => fakeNative(), now: () => MONDAY });
    assert.equal((await ads.beforeNextCase("case01")).reason, "not-due");
    assert.equal((await ads.watchRewarded("reward-archive")).status, "rewarded");
    assert.equal(ads.rewardCount("reward-archive"), 0);
  }
});
