/**
 * src/copy/appStore.js in English: the store apps' ads and Remove Ads
 * purchase. App only -- not in screens/index.js, so the site's English chunk
 * does not carry it; src/platform/adCopy.js reads it in the app build.
 */
export default {
  rewardArchive: "Watch an ad for one more archive slot (~30s)",
  rewardHint: "Watch an ad for one more hint",
  rewardFree: "Get it now (no ads)",
  rewardNote: "This never affects your score or ranking.",
  adUnavailable: "No ad is available right now. Please try again in a moment.",
  adClosedEarly: "The ad was closed early, so no reward was given.",
  adOffline: "You're offline, so the ad can't load.",
  interstitialNotice: "A short ad before the next case.",
  attTitle: "About the ads you see",
  attBody:
    "Critical Point is supported by ads. If you allow it on the next screen, ads can be more relevant based on your activity in other apps and websites. If you don't, you'll see the same number of ads and the same game.",
  attContinue: "Continue",
  privacyTitle: "Ads & privacy",
  privacyReview: "Review ad privacy choices",
  privacyNoChoices: "There are no ad consent choices to make in your region.",
  privacyAtt: "You can change tracking in iPhone Settings › Privacy & Security › Tracking.",
  removeAdsRow: "Remove Ads (one-time purchase)",
  restoreRow: "Restore Purchases",
  buyTitle: "Play to the end, ad-free",
  buyLines: [
    "No more ads between cases or banners at the bottom of the screen.",
    "Archive slots and ending hints unlock instantly, no ad needed.",
    "Your score, ranking and hands stay exactly the same. Paying never gives an advantage.",
    "Pay once; it applies on every device signed in to the same store account.",
  ],
  buyButton: "Remove ads for {price}",
  buyWithdrawal: "Takes effect immediately; cancellation rights may be limited. Refunds follow the store's policy.",
  buyLinks: { restore: "Restore Purchases", privacy: "Privacy Policy", terms: "Terms" },
  owned: "Remove Ads is active.",
  bought: "Ads removed. Thank you!",
  restored: "We found your purchase and removed ads again.",
  nothingToRestore: "No Remove Ads purchase was found for this store account.",
  cancelled: "Purchase cancelled. You were not charged.",
  pending: "Waiting for payment confirmation. It will apply automatically.",
  failed: "The purchase couldn't be completed. Please try again later.",
  purchaseOffline: "You're offline, so purchases aren't available.",
};
