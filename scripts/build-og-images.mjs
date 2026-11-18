/**
 * The link-preview pictures, one per language (유입, 2026-11-16): the game's
 * own key visual with the game's name, one line and 「free, in the browser」
 * laid over it, so a link shared on KakaoTalk, X, Discord or Reddit says what
 * it is in the reader's language before anyone opens it.
 *
 *   node scripts/build-og-images.mjs [--logo <path to a png or svg>]
 *     [--style classic|night|paper|mix] [--out <folder>] [--social]
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
 *
 * `--style` (2026-11-18, design 2안 「감사 장부」): `classic` is the picture
 * shipped on 11-16 and the default. The other three are the drafts for the
 * paper redesign, each with its own logo when `--logo` is not given:
 *   night  1안, the dark picture made easier to read at preview size (bigger
 *          line, logo and badge, a darker reading side, the red dot of the logo)
 *   paper  2안, a ledger page: ruled paper, ink type, a red-pencil stroke under
 *          the line's second half, the key visual as a taped photo and a
 *          rubber stamp 「free」 on it
 *   mix    3안, the ledger page on the left and the dark key visual bleeding
 *          off the right edge, taped at the seam with the stamp over it
 * `--out` writes into another folder (drafts), and `--social` also writes the
 * GitHub social preview (social-preview.png, 1280x640) in the same style.
 */
import { existsSync, mkdirSync, mkdtempSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "@playwright/test";

const OG_WORDS = {
  ko: { name: "임계점", tagline: "판돈을 올릴수록, 벽이 가까워진다.", hit: "벽이 가까워진다.", stamp: "무료", badge: "무료 · 설치 없이 브라우저에서 바로", genre: "기업·금융 미스터리" },
  en: { name: "", tagline: "Every push of the stake brings the Wall closer.", hit: "brings the Wall closer.", stamp: "FREE", badge: "Free · plays in your browser, no install", genre: "Corporate & financial mystery" },
  ja: { name: "臨界点", tagline: "賭け金を上げるほど、壁が近づく。", hit: "壁が近づく。", stamp: "無料", badge: "無料・ブラウザですぐ遊べる", genre: "企業・金融ミステリー" },
};
/** The GitHub social preview's words: Korean line, English under it (as the hand-made one of 11-16). */
const SOCIAL_WORDS = {
  tagline: "판돈을 올릴수록, 벽이 가까워진다.",
  hit: "벽이 가까워진다.",
  sub: "The higher the stakes, the closer the wall.",
  stamp: "FREE",
  badge: "FREE WEB GAME · KO · EN · 日本語",
  genre: "STUDIO 찹쌀떡 · CREATOR SUPASONIC & ALICE",
};
const STYLES = ["classic", "night", "paper", "mix"];
const STYLE_LOGO = {
  night: "docs/images/brand/lockup-dark-transparent.svg",
  paper: "docs/images/brand/lockup-light-transparent.svg",
  mix: "docs/images/brand/lockup-light-transparent.svg",
};

const args = process.argv.slice(2);
const option = (name) => {
  const at = args.indexOf(name);
  return at >= 0 ? (args[at + 1] ?? "") : null;
};
const style = option("--style") ?? "classic";
if (!STYLES.includes(style)) throw new Error(`--style is one of ${STYLES.join(", ")}`);
const logoArg = option("--logo") ?? STYLE_LOGO[style] ?? null;
const logo = logoArg ? resolve(logoArg) : null;
if (logo && !existsSync(logo)) throw new Error(`No logo at ${logo}`);
const outDir = resolve(option("--out") ?? "public");
const social = args.includes("--social");
const noto = process.env.NOTO_SANS_KR ?? "C:/Windows/Fonts/NotoSansKR-VF.ttf";
if (!existsSync(noto)) throw new Error(`No Noto Sans KR at ${noto} (set NOTO_SANS_KR)`);

const url = (path) => pathToFileURL(resolve(path)).href;
const escapeHtml = (text) => String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const ART = url("public/triggerlab-key-visual.webp");
const FONTS = `@font-face{font-family:P;src:url("${url("node_modules/pretendard/dist/public/variable/PretendardVariable.ttf")}");font-weight:100 900}
@font-face{font-family:N;src:url("${url(noto)}");font-weight:100 900}`;

function page(language) {
  const words = OG_WORDS[language];
  const mark = logo
    ? `<img class="logo" src="${url(logo)}" alt="">`
    : `${words.name ? `<div class="name">${escapeHtml(words.name)}</div>` : ""}<div class="latin">CRITICAL POINT</div>`;
  return `<!doctype html><html lang="${language}"><meta charset="utf-8"><style>
${FONTS}
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
<img class="art" src="${ART}" alt="">
<div class="shade"></div>
<div class="text"><div class="genre">${escapeHtml(words.genre)}</div><div class="mark">${mark}</div><p class="tagline">${escapeHtml(words.tagline)}</p><div class="badge">${escapeHtml(words.badge)}</div></div>
</body></html>`;
}

/** The tagline with its second half (`hit`) on a line of its own, marked for the red pencil. */
function taglineHtml({ tagline, hit }) {
  const at = tagline.lastIndexOf(hit);
  if (at < 0) return escapeHtml(tagline);
  return `${escapeHtml(tagline.slice(0, at).trim())}<br><span class="hit">${escapeHtml(hit)}</span>`;
}

// 2안's ink and paper (src/styles/tokens.css: --ui-surface-1, --ui-text, --ui-heat, --c-acid).
const PAPER = `--paper:#f4eedf;--ink:#16181a;--ink-2:#3e3c38;--ink-3:#58544c;--heat:#b0261e;--acid:#16603e;--cream:#fdfbf5`;
const LEDGER_CSS = `
.ledger{position:absolute;inset:0;background-color:var(--paper);
 background-image:radial-gradient(120% 90% at 30% 20%,transparent 55%,rgb(120 90 40 / .10)),
  repeating-linear-gradient(180deg,transparent 0 47px,rgb(20 82 160 / .10) 47px 48px)}
.margin{position:absolute;top:0;bottom:0;left:44px;width:6px;border-left:2px solid rgb(176 38 30 / .42);border-right:2px solid rgb(176 38 30 / .42)}
.text{position:absolute;display:flex;flex-direction:column;color:var(--ink)}
.genre{display:flex;align-items:center;gap:14px;font-size:22px;font-weight:800;letter-spacing:.16em;color:var(--ink-2);text-transform:uppercase}
.genre::after{content:"";flex:1;height:6px;border-top:2px solid var(--ink);border-bottom:2px solid var(--ink)}
.logo{display:block;width:100%;height:auto;margin-left:-26px}
.tagline{font-weight:800;line-height:1.28;letter-spacing:-.01em;color:var(--ink)}
.hit{background:linear-gradient(transparent 70%,rgb(176 38 30 / .30) 70% 90%,transparent 90%);box-decoration-break:clone;-webkit-box-decoration-break:clone;color:var(--heat)}
.sub{font-weight:600;letter-spacing:.04em;color:var(--ink-3)}
.badge{align-self:flex-start;display:flex;align-items:center;gap:12px;padding:12px 24px 12px 20px;border-radius:12px;background:var(--acid);color:var(--cream);font-weight:800;box-shadow:0 5px 0 var(--ink)}
.badge::before{content:"";width:0;height:0;border-left:11px solid var(--cream);border-top:8px solid transparent;border-bottom:8px solid transparent}
.photo{position:absolute;background:#fff;padding:12px;box-shadow:0 2px 0 rgb(22 24 26 / .08),0 14px 26px rgb(70 50 20 / .22)}
.photo img{display:block;width:100%;height:100%;object-fit:cover}
.tape{position:absolute;width:132px;height:36px;background:rgb(232 220 178 / .78);box-shadow:0 1px 2px rgb(70 50 20 / .18)}
.stamp{position:absolute;padding:6px 22px;border:5px solid var(--heat);outline:2px solid var(--heat);outline-offset:4px;border-radius:8px;color:var(--heat);font-weight:900;letter-spacing:.12em;transform:rotate(-7deg);mix-blend-mode:multiply;opacity:.88}`;

/** One of the three drafts at `width`x`height`; `words` is a language's OG_WORDS or SOCIAL_WORDS. */
function draftPage({ language, words, width, height }) {
  const tagline = taglineHtml(words);
  const sub = words.sub ? `<p class="sub">${escapeHtml(words.sub)}</p>` : "";
  const mark = logo ? `<img class="logo" src="${url(logo)}" alt="">` : `<div class="latin">CRITICAL POINT</div>`;
  const head = `<!doctype html><html lang="${language}"><meta charset="utf-8"><style>
${FONTS}
*{margin:0;box-sizing:border-box}
:root{${PAPER}}
html,body{width:${width}px;height:${height}px;overflow:hidden}
body{position:relative;font-family:P,N,sans-serif;word-break:keep-all}`;
  if (style === "night") {
    return `${head}
body{background:#06090a;color:#f2f6f3}
.art{position:absolute;top:0;right:-120px;height:100%;width:calc(100% + 120px);object-fit:cover;object-position:70% 50%}
.shade{position:absolute;inset:0;background:linear-gradient(90deg,#06090afa 0%,#06090aeb 44%,#06090a66 66%,transparent 84%),linear-gradient(0deg,#06090ae6,transparent 40%)}
.text{position:absolute;left:68px;top:56px;bottom:56px;width:${Math.round(width * 0.58)}px;display:flex;flex-direction:column}
.genre{display:flex;align-items:center;gap:12px;font-size:24px;font-weight:800;letter-spacing:.14em;color:#d9ff62}
.genre::before{content:"";width:14px;height:14px;border-radius:50%;background:#ff5c48}
.logo{display:block;width:100%;height:auto;margin:14px 0 0 -30px}
.tagline{margin-top:6px;font-size:${words.sub ? 50 : 52}px;font-weight:800;line-height:1.24;letter-spacing:-.01em}
.hit{color:#d9ff62}
.sub{margin-top:14px;font-size:24px;font-weight:600;letter-spacing:.06em;color:#b9c4bf}
.badge{margin-top:auto;align-self:flex-start;padding:14px 28px;border-radius:999px;background:#d9ff62;color:#06090a;font-size:30px;font-weight:850}
</style><body>
<img class="art" src="${ART}" alt=""><div class="shade"></div>
<div class="text"><div class="genre">${escapeHtml(words.genre)}</div>${mark}<p class="tagline">${tagline}</p>${sub}<div class="badge">${escapeHtml(words.badge)}</div></div>
</body></html>`;
  }
  if (style === "paper") {
    const photoW = Math.round(width * 0.33);
    const photoH = Math.round(height * 0.6);
    return `${head}
${LEDGER_CSS}
.text{left:96px;top:52px;bottom:52px;width:${Math.round(width * 0.53)}px}
.logo{margin-top:22px}
.tagline{margin-top:12px;font-size:${words.sub ? 52 : 58}px}
.sub{margin-top:14px;font-size:24px}
.badge{margin-top:auto;font-size:28px}
.photo{right:64px;top:${Math.round((height - photoH) / 2) - 10}px;width:${photoW}px;height:${photoH}px}
.photo img{object-position:78% 50%}
.t1{right:${64 + photoW - 96}px;top:${Math.round((height - photoH) / 2) - 28}px;transform:rotate(-8deg)}
.t2{right:40px;top:${Math.round((height + photoH) / 2) - 30}px;transform:rotate(-6deg)}
.stamp{right:${64 + photoW - 150}px;top:${Math.round((height + photoH) / 2) - 70}px;font-size:58px;background:rgb(244 238 223 / .55)}
</style><body>
<div class="ledger"></div><div class="margin"></div>
<div class="photo"><img src="${ART}" alt=""></div><div class="tape t1"></div><div class="tape t2"></div>
<div class="stamp">${escapeHtml(words.stamp)}</div>
<div class="text"><div class="genre">${escapeHtml(words.genre)}</div>${mark}<p class="tagline">${tagline}</p>${sub}<div class="badge">${escapeHtml(words.badge)}</div></div>
</body></html>`;
  }
  // mix
  const seam = Math.round(width * 0.62);
  return `${head}
${LEDGER_CSS}
.ledger{right:${width - seam}px}
.margin{left:40px}
.art{position:absolute;top:0;left:${seam}px;width:${width - seam}px;height:100%;object-fit:cover;object-position:84% 50%;filter:saturate(1.05)}
.edge{position:absolute;top:0;bottom:0;left:${seam - 4}px;width:14px;background:linear-gradient(90deg,rgb(70 50 20 / .28),transparent)}
.text{left:88px;top:50px;bottom:50px;width:${seam - 130}px}
.logo{margin-top:20px}
.tagline{margin-top:10px;font-size:${words.sub ? 50 : 56}px}
.sub{margin-top:12px;font-size:23px}
.badge{margin-top:auto;font-size:27px}
.t1{left:${seam - 66}px;top:44px;transform:rotate(-12deg)}
.t2{left:${seam - 66}px;bottom:56px;transform:rotate(9deg)}
.stamp{left:${seam - 96}px;top:${Math.round(height * 0.42)}px;font-size:56px;background:rgb(244 238 223 / .72)}
</style><body>
<div class="ledger"></div><div class="margin"></div>
<img class="art" src="${ART}" alt=""><div class="edge"></div><div class="tape t1"></div><div class="tape t2"></div>
<div class="stamp">${escapeHtml(words.stamp)}</div>
<div class="text"><div class="genre">${escapeHtml(words.genre)}</div>${mark}<p class="tagline">${tagline}</p>${sub}<div class="badge">${escapeHtml(words.badge)}</div></div>
</body></html>`;
}

const shots = Object.keys(OG_WORDS).map((language) => ({
  out: join(outDir, `og-${language}.jpg`),
  width: 1200,
  height: 675,
  html: () => (style === "classic" ? page(language) : draftPage({ language, words: OG_WORDS[language], width: 1200, height: 675 })),
}));
if (social) {
  if (style === "classic") throw new Error("--social draws the drafts only (the 11-16 social preview was made by hand)");
  shots.push({
    out: join(outDir, "social-preview.png"),
    width: 1280,
    height: 640,
    html: () => draftPage({ language: "ko", words: SOCIAL_WORDS, width: 1280, height: 640 }),
  });
}

// A page on file:, so it may read the art and the fonts from disk.
mkdirSync(outDir, { recursive: true });
const scratch = mkdtempSync(join(tmpdir(), "og-"));
const browser = await chromium.launch();
try {
  for (const shot of shots) {
    const tab = await browser.newPage({ viewport: { width: shot.width, height: shot.height }, deviceScaleFactor: 1 });
    const file = join(scratch, "page.html");
    writeFileSync(file, shot.html());
    await tab.goto(pathToFileURL(file).href, { waitUntil: "load" });
    await tab.evaluate(() => globalThis.document.fonts.ready);
    const png = shot.out.endsWith(".png");
    await tab.screenshot({ path: shot.out, type: png ? "png" : "jpeg", ...(png ? {} : { quality: 82 }) });
    console.log(`${shot.out} ${statSync(shot.out).size} bytes`);
    await tab.close();
  }
} finally {
  await browser.close();
  rmSync(scratch, { recursive: true, force: true });
}
