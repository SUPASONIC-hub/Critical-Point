/**
 * The two screens the native side draws over the page itself, in plain DOM so
 * the game's chunks carry none of it (docs/app-shell.md, 「광고」).
 *
 * - The ATT pre-prompt (memo B-4): one sheet right before iOS's own tracking
 *   question, with one button that always leads on to that question. It never
 *   asks the player to allow anything, and nothing in the game waits on the
 *   answer (memo B-1 (7), App Review 5.1.2(i)).
 * - The cover before an interstitial (memo B-3): 「다음 사건 전에 짧은 광고가
 *   나옵니다.」 on an opaque sheet over the result page, so the ad never sits
 *   over a score (memo B-1 (2)). It stays until the ad has closed.
 */

const SHEET_STYLE = [
  "position:fixed",
  "inset:0",
  "z-index:2147483000",
  "display:flex",
  "align-items:center",
  "justify-content:center",
  "padding:max(24px, env(safe-area-inset-top)) 24px max(24px, env(safe-area-inset-bottom))",
  "background:#06090a",
  "color:#e9efe9",
  "font:16px/1.6 system-ui, -apple-system, sans-serif",
  "text-align:left",
].join(";");

function sheet(documentRef, label) {
  const element = documentRef.createElement("div");
  element.setAttribute("role", "dialog");
  element.setAttribute("aria-modal", "true");
  element.setAttribute("aria-label", label);
  element.style.cssText = SHEET_STYLE;
  documentRef.body.append(element);
  return element;
}

/** The pre-prompt; resolves when 「계속」 is pressed. */
export function showTrackingPrePrompt(copy, documentRef = document) {
  return new Promise((resolve) => {
    const element = sheet(documentRef, copy.attTitle);
    const box = documentRef.createElement("div");
    box.style.cssText = "max-width:420px;width:100%";
    const title = documentRef.createElement("h2");
    title.textContent = copy.attTitle;
    title.style.cssText = "margin:0 0 12px;font-size:20px;line-height:1.4";
    const body = documentRef.createElement("p");
    body.textContent = copy.attBody;
    body.style.cssText = "margin:0 0 24px;opacity:.86";
    const button = documentRef.createElement("button");
    button.type = "button";
    button.textContent = copy.attContinue;
    button.style.cssText =
      "width:100%;min-height:48px;border:0;border-radius:10px;background:#e9efe9;color:#06090a;font:600 16px system-ui, sans-serif";
    button.addEventListener("click", () => {
      element.remove();
      resolve();
    });
    box.append(title, body, button);
    element.append(box);
    button.focus();
  });
}

/** The cover; returns a function that takes it down. */
export function showAdCover(copy, documentRef = document) {
  const element = sheet(documentRef, copy.interstitialNotice);
  const line = documentRef.createElement("p");
  line.textContent = copy.interstitialNotice;
  line.setAttribute("role", "status");
  line.style.cssText = "margin:0;opacity:.86";
  element.append(line);
  return () => element.remove();
}
