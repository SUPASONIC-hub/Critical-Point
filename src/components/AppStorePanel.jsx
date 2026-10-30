import { useEffect, useState } from "react";
import { ads } from "../platform/ads.js";
import { buyButtonText } from "../platform/adCopy.js";

/**
 * The store apps' 「광고와 개인정보」 drawer (memo B-5) with the Remove Ads
 * purchase (memo C-2, C-3, C-6 (4)), and the ending book's rewarded hint
 * (memo B-2 `reward-ending-hint`). App only: IntroScreen loads this chunk
 * behind `__CP_APP__`, which the site's builds fold to false, so the web never
 * draws, downloads or sells any of it (memo C-3: the web says nothing about
 * the app's purchase).
 *
 * It reuses the start console's classes, so the site's stylesheet does not
 * grow for a panel the site never shows.
 */

// Placeholder: the privacy policy and terms pages on the game's own domain
// (memo E); the links are drawn once these are set.
const POLICY_LINKS = { privacy: null, terms: null };

export default function AppStorePanel() {
  const copy = ads.copy();
  const [store, setStore] = useState({ available: false, owned: false, price: null });
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const ios = ads.platform() === "ios";

  useEffect(() => {
    let live = true;
    ads.removeAdsState().then((state) => live && setStore(state));
    return () => {
      live = false;
    };
  }, []);

  const run = async (work) => {
    setBusy(true);
    const result = await work();
    setMessage(result.message);
    setStore(await ads.removeAdsState());
    setBusy(false);
  };

  return (
    <section className="accessibility-panel start-console-section" aria-label={copy.privacyTitle}>
      <div className="accessibility-toggle">
        <span>
          <b>{copy.privacyTitle}</b>
          <small>{ios ? copy.privacyAtt : ""}</small>
        </span>
      </div>
      <button type="button" disabled={busy} onClick={() => run(() => ads.reviewAdPrivacy())}>
        {copy.privacyReview}
      </button>
      {store.available && (
        <fieldset className="accessibility-time">
          <legend>{copy.removeAdsRow}</legend>
          {store.owned ? (
            <p>{copy.owned}</p>
          ) : (
            <>
              <p>
                <b>{copy.buyTitle}</b>
              </p>
              {copy.buyLines.map((line) => (
                <p key={line}>{line}</p>
              ))}
              <button type="button" disabled={busy || !store.price} onClick={() => run(() => ads.buyRemoveAds())}>
                {buyButtonText(copy, store.price ?? "…")}
              </button>
              <p>
                <small>{copy.buyWithdrawal}</small>
              </p>
            </>
          )}
          <p>
            <button type="button" disabled={busy} onClick={() => run(() => ads.restorePurchases())}>
              {copy.buyLinks.restore}
            </button>
            {POLICY_LINKS.privacy && (
              <>
                {" · "}
                <a href={POLICY_LINKS.privacy}>{copy.buyLinks.privacy}</a>
              </>
            )}
            {POLICY_LINKS.terms && (
              <>
                {" · "}
                <a href={POLICY_LINKS.terms}>{copy.buyLinks.terms}</a>
              </>
            )}
          </p>
        </fieldset>
      )}
      <p role="status" aria-live="polite">
        {message}
      </p>
    </section>
  );
}

/**
 * The ending book's hints in the app: one, and one more for each rewarded ad
 * watched (or, for a Remove Ads buyer, each press of 「광고 없이 바로 받기」).
 * The web keeps showing every hint (IntroScreen); nothing here touches a
 * score, a ranking or a season (memo B-1 (1)).
 */
export function AppEndingHints({ hints }) {
  const copy = ads.copy();
  const [earned, setEarned] = useState(() => ads.rewardCount("reward-ending-hint"));
  const [owned, setOwned] = useState(false);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const shown = hints.slice(0, 1 + earned);

  useEffect(() => {
    let live = true;
    ads.removeAdsState().then((state) => live && setOwned(state.owned));
    return () => {
      live = false;
    };
  }, []);

  const watch = async () => {
    setBusy(true);
    const result = await ads.watchRewarded("reward-ending-hint");
    setMessage(result.message);
    setEarned(ads.rewardCount("reward-ending-hint"));
    setBusy(false);
  };

  return (
    <>
      {shown.map((hint) => (
        <p key={hint}>{hint}</p>
      ))}
      {shown.length < hints.length && (
        <p>
          <button type="button" disabled={busy} onClick={watch}>
            {owned ? copy.rewardFree : copy.rewardHint}
          </button>
          <br />
          <small>{copy.rewardNote}</small>
        </p>
      )}
      {message && <p role="status">{message}</p>}
    </>
  );
}
