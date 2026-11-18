/**
 * The link-preview pictures, one per language (유입, 2026-11-16): the game's
 * own key visual with the game's name, one line and 「free, in the browser」
 * laid over it, so a link shared on KakaoTalk, X, Discord or Reddit says what
 * it is in the reader's language before anyone opens it.
 *
 *   node scripts/build-og-images.mjs [--logo <path to a png or svg>]
 *
 * Writes public/og-ko.jpg, public/og-en.jpg and public/og-ja.jpg at 1200x675
 * (scripts/legal-pages.mjs `shareImage`). Run by hand when the words or the art
 * change, like build:art; the build only copies the files. The art is the
 * game's (public/triggerlab-key-visual.webp), nothing from outside. The type
 * is Pretendard (the game's font, OFL); Japanese kanji and kana Pretendard
 * does not carry fall back to Noto Sans KR (Source Han, OFL), which Windows
 * ships as NotoSansKR-VF.ttf -- set NOTO_SANS_KR to its path elsewhere.
 *
 * `--logo` puts a logo picture where the wordmark's first line is (top left,
 * 132px high at most); without one that spot is the game's name in text.
 */
import { existsSync, mkdtempSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "@playwright/test";

const OG_WORDS = {
  ko: { name: "임계점", tagline: "판돈을 올릴수록, 벽이 가까워진다.", badge: "무료 · 설치 없이 브라우저에서 바로", genre: "기업·금융 미스터리" },
  en: { name: "", tagline: "Every push of the stake brings the Wall closer.", badge: "Free · plays in your browser, no install", genre: "Corporate & financial mystery" },
  ja: { name: "臨界点", tagline: "賭け金を上げるほど、壁が近づく。", badge: "無料・ブラウザですぐ遊べる", genre: "企業・金融ミステリー" },
};

const args = process.argv.slice(2);
const logoAt = args.indexOf("--logo");
const logo = logoAt >= 0 ? resolve(args[logoAt + 1] ?? "") : null;
if (logo && !existsSync(logo)) throw new Error(`No logo at ${logo}`);
const noto = process.env.NOTO_SANS_KR ?? "C:/Windows/Fonts/NotoSansKR-VF.ttf";
if (!existsSync(noto)) throw new Error(`No Noto Sans KR at ${noto} (set NOTO_SANS_KR)`);

const url = (path) => pathToFileURL(resolve(path)).href;
const escapeHtml = (text) => String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function page(language) {
  const words = OG_WORDS[language];
  const mark = logo
    ? `<img class="logo" src="${url(logo)}" alt="">`
    : `${words.name ? `<div class="name">${escapeHtml(words.name)}</div>` : ""}<div class="latin">CRITICAL POINT</div>`;
  return `<!doctype html><html lang="${language}"><meta charset="utf-8"><style>
@font-face{font-family:P;src:url("${url("node_modules/pretendard/dist/public/variable/PretendardVariable.ttf")}");font-weight:100 900}
@font-face{font-family:N;src:url("${url(noto)}");font-weight:100 900}
*{margin:0;box-sizing:border-box}
html,body{width:1200px;height:675px;overflow:hidden;background:#06090a}
body{position:relative;font-family:P,N,sans-serif;color:#f2f6f3;word-break:keep-all}
.art{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.shade{position:absolute;inset:0;background:linear-gradient(90deg,#06090af0 0%,#06090acc 38%,#06090a33 70%,transparent),linear-gradient(0deg,#06090ad9,transparent 45%)}
.text{position:absolute;left:72px;top:64px;bottom:60px;width:660px;display:flex;flex-direction:column}
.genre{font-size:22px;font-weight:700;letter-spacing:.14em;color:#d9ff62}
.mark{margin-top:18px}
.name{font-size:108px;font-weight:850;line-height:1.02;letter-spacing:-.02em}
.latin{font-size:${words.name ? 44 : 92}px;font-weight:800;line-height:1.05;letter-spacing:.06em;color:${words.name ? "#d9ff62" : "#f2f6f3"};margin-top:${words.name ? 10 : 0}px}
.logo{display:block;max-width:520px;max-height:132px}
.tagline{margin-top:28px;font-size:36px;font-weight:600;line-height:1.35;color:#f2f6f3}
.badge{margin-top:auto;align-self:flex-start;padding:12px 24px;border-radius:999px;background:#d9ff62;color:#06090a;font-size:26px;font-weight:800}
</style><body>
<img class="art" src="${url("public/triggerlab-key-visual.webp")}" alt="">
<div class="shade"></div>
<div class="text"><div class="genre">${escapeHtml(words.genre)}</div><div class="mark">${mark}</div><p class="tagline">${escapeHtml(words.tagline)}</p><div class="badge">${escapeHtml(words.badge)}</div></div>
</body></html>`;
}

// A page on file:, so it may read the art and the fonts from disk.
const scratch = mkdtempSync(join(tmpdir(), "og-"));
const browser = await chromium.launch();
try {
  const tab = await browser.newPage({ viewport: { width: 1200, height: 675 }, deviceScaleFactor: 1 });
  for (const language of Object.keys(OG_WORDS)) {
    const file = join(scratch, `${language}.html`);
    writeFileSync(file, page(language));
    await tab.goto(pathToFileURL(file).href, { waitUntil: "load" });
    await tab.evaluate(() => globalThis.document.fonts.ready);
    const out = `public/og-${language}.jpg`;
    await tab.screenshot({ path: out, type: "jpeg", quality: 82 });
    console.log(`${out} ${statSync(out).size} bytes`);
  }
} finally {
  await browser.close();
  rmSync(scratch, { recursive: true, force: true });
}
