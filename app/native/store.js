/**
 * Remove Ads, the one in-app product (memo C, the user's answers of
 * 2026-10-25, all (1)): `remove_ads`, a non-consumable on the App Store and a
 * one-time product on Google Play, 3,300원 / US$2.99.
 *
 * StoreKit 2 and Play Billing through @capgo/native-purchases. There is no
 * server (C-6 (3) (1)): the store account's own record is the receipt. Whether
 * the player owns it is asked of the store (`getPurchases`; on iOS the Apple
 * ID's current entitlements, so a refund or another account's purchase does
 * not count), once a session and again on 구매 복원. The answer is kept on
 * the device only as a fallback for a launch with no connection; it is never
 * moved with the continue code.
 *
 * Play asks for a purchase to be acknowledged within three days or it is
 * refunded: the plugin acknowledges on purchase, and a purchase that was
 * pending then is acknowledged here when it is found completed.
 */
import { Capacitor } from "@capacitor/core";
import { NativePurchases, PURCHASE_TYPE } from "@capgo/native-purchases";

export const REMOVE_ADS = "remove_ads";
const CACHE_KEY = "cp.store.removeAds";

const platform = () => Capacitor.getPlatform();
const isCompleted = (purchase) =>
  purchase?.productIdentifier === REMOVE_ADS &&
  !purchase.revocationDate &&
  (platform() !== "android" || purchase.purchaseState === "PURCHASED" || purchase.purchaseState === "1");

function cached() {
  try {
    return localStorage.getItem(CACHE_KEY) === "true";
  } catch {
    return false;
  }
}
function remember(owned) {
  try {
    localStorage.setItem(CACHE_KEY, String(owned));
  } catch {
    // The store still knows; the next launch asks it again.
  }
}

/** What a rejected purchase means, read off the plugin's code and message. */
function failureOf(error) {
  const text = `${error?.code ?? ""} ${error?.message ?? ""}`;
  if (/cancel/i.test(text)) return "cancelled";
  if (/pending/i.test(text)) return "pending";
  if (/ALREADY_OWNED/i.test(text)) return "owned";
  if (/NETWORK|SERVICE_UNAVAILABLE|offline|not connected/i.test(text)) return "offline";
  return "failed";
}

export function createStore() {
  let owned = null;
  let listening = false;

  function listen() {
    if (listening) return;
    listening = true;
    // A Play purchase that was pending completes later, and StoreKit reports
    // purchases made elsewhere (Ask to Buy, another device) here too.
    NativePurchases.addListener("transactionUpdated", (transaction) => {
      if (!isCompleted(transaction)) return;
      owned = true;
      remember(true);
    }).catch(() => {});
  }

  async function ask() {
    const { purchases } = await NativePurchases.getPurchases({ productType: PURCHASE_TYPE.INAPP, onlyCurrentEntitlements: true });
    const mine = purchases.filter(isCompleted);
    if (platform() === "android") {
      for (const purchase of mine) {
        if (purchase.isAcknowledged === false && purchase.purchaseToken) {
          await NativePurchases.acknowledgePurchase({ purchaseToken: purchase.purchaseToken }).catch(() => {});
        }
      }
    }
    owned = mine.length > 0;
    remember(owned);
    return owned;
  }

  return {
    async owned() {
      listen();
      if (owned !== null) return owned;
      try {
        return await ask();
      } catch {
        return cached();
      }
    },
    /** The store's price string for the button, 「₩3,300」 or 「$2.99」. */
    async price() {
      const { product } = await NativePurchases.getProduct({ productIdentifier: REMOVE_ADS, productType: PURCHASE_TYPE.INAPP });
      return product?.priceString ?? null;
    },
    async buy() {
      listen();
      if (owned) return "owned";
      try {
        const transaction = await NativePurchases.purchaseProduct({
          productIdentifier: REMOVE_ADS,
          productType: PURCHASE_TYPE.INAPP,
          quantity: 1,
        });
        if (platform() === "android" && transaction?.purchaseState && !isCompleted(transaction)) return "pending";
        owned = true;
        remember(true);
        return "bought";
      } catch (error) {
        const failure = failureOf(error);
        if (failure === "owned") {
          await ask().catch(() => {});
          return owned ? "owned" : "failed";
        }
        return failure;
      }
    },
    async restore() {
      listen();
      try {
        await NativePurchases.restorePurchases();
        return (await ask()) ? "restored" : "nothing";
      } catch (error) {
        return failureOf(error) === "offline" ? "offline" : "failed";
      }
    },
  };
}
