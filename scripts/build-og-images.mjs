/**
 * The link-preview pictures, one per language (유입, 2026-11-16), drawn as a
 * page of the game's audit ledger since design 2안 (2026-11-18, PR #613 판정
 * 「1」): ruled paper with a red margin, the game's lockup in ink, the one line
 * in that language with a red-pencil stroke under its second half, the key
 * visual as a taped photo with a rubber stamp 「free」 on it, and 「free, in the
 * browser」 on the start button's green. A link shared on KakaoTalk, X, Discord
 * or Reddit says what it is in the reader's language before anyone opens it.
 *
 *   node scripts/build-og-images.mjs [--social] [--out <folder>] [--logo <png or svg>]
 *
 * Writes public/og-ko.jpg, public/og-en.jpg and public/og-ja.jpg at 1200x675
 * (scripts/legal-pages.mjs `SHARE_IMAGE`); `--social` also writes the GitHub
 * social preview, docs/images/social-preview.png at 1280x640 (Korean line,
 * English under it), which the owner uploads in the repository's settings.
 * `--out` puts every file in one other folder instead (drafts). Run by hand
 * when the words or the art change, like build:art; the build only copies the
 * files. The art is the game's (public/triggerlab-key-visual.webp), nothing
 * from outside, and the logo docs/images/brand/lockup-light-transparent.svg
 * unless `--logo` names another. The type is Pretendard (the game's font,
 * OFL); Japanese kanji and kana Pretendard does not carry fall back to Noto
 * Sans KR (Source Han, OFL), which Windows ships as NotoSansKR-VF.ttf -- set
 * NOTO_SANS_KR to its path elsewhere. The colours are 2안's tokens
 * (src/styles/tokens.css: --ui-surface-1, --ui-text, --ui-heat, --c-acid).
 */
import { existsSync, mkdirSync, mkdtempSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "@playwright/test";

const OG_WORDS = {
  ko: { tagline: "판돈을 올릴수록, 벽이 가까워진다.", hit: "벽이 가까워진다.", stamp: "무료", badge: "무료 · 설치 없이 브라우저에서 바로", genre: "기업·금융 미스터리" },
  en: { tagline: "Every push of the stake brings the Wall closer.", hit: "brings the Wall closer.", stamp: "FREE", badge: "Free · plays in your browser, no install", genre: "Corporate & financial mystery" },
  ja: { tagline: "賭け金を上げるほど、壁が近づく。", hit: "壁が近づく。", stamp: "無料", badge: "無料・ブラウザですぐ遊べる", genre: "企業・金融ミステリー" },
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

const args = process.argv.slice(2);
const option = (name) => {
  const at = args.indexOf(name);
  return at >= 0 ? (args[at + 1] ?? "") : null;
};
const logo = resolve(option("--logo") ?? "docs/images/brand/lockup-light-transparent.svg");
if (!existsSync(logo)) throw new Error(`No logo at ${logo}`);
const out = option("--out");
const ogDir = resolve(out ?? "public");
const socialDir = resolve(out ?? "docs/images");
const noto = process.env.NOTO_SANS_KR ?? "C:/Windows/Fonts/NotoSansKR-VF.ttf";
if (!existsSync(noto)) throw new Error(`No Noto Sans KR at ${noto} (set NOTO_SANS_KR)`);

const url = (path) => pathToFileURL(resolve(path)).href;
const escapeHtml = (text) => String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** The tagline with its second half (`hit`) on a line of its own, marked for the red pencil. */
function taglineHtml({ tagline, hit }) {
  const at = tagline.lastIndexOf(hit);
  if (at < 0) return escapeHtml(tagline);
  return `${escapeHtml(tagline.slice(0, at).trim())}<br><span class="hit">${escapeHtml(hit)}</span>`;
}

/** The ledger page at `width`x`height`; `words` is a language's OG_WORDS or SOCIAL_WORDS. */
function page({ language, words, width, height }) {
  const sub = words.sub ? `<p class="sub">${escapeHtml(words.sub)}</p>` : "";
  const photoW = Math.round(width * 0.33);
  const photoH = Math.round(height * 0.6);
  const photoTop = Math.round((height - photoH) / 2) - 10;
  return `<!doctype html><html lang="${language}"><meta charset="utf-8"><style>
@font-face{font-family:P;src:url("${url("node_modules/pretendard/dist/public/variable/PretendardVariable.ttf")}");font-weight:100 900}
@font-face{font-family:N;src:url("${url(noto)}");font-weight:100 900}
*{margin:0;box-sizing:border-box}
:root{--paper:#f4eedf;--ink:#16181a;--ink-2:#3e3c38;--ink-3:#58544c;--heat:#b0261e;--acid:#16603e;--cream:#fdfbf5}
html,body{width:${width}px;height:${height}px;overflow:hidden}
body{position:relative;font-family:P,N,sans-serif;word-break:keep-all}
.ledger{position:absolute;inset:0;background-color:var(--paper);
 background-image:radial-gradient(120% 90% at 30% 20%,transparent 55%,rgb(120 90 40 / .10)),
  repeating-linear-gradient(180deg,transparent 0 47px,rgb(20 82 160 / .10) 47px 48px)}
.margin{position:absolute;top:0;bottom:0;left:44px;width:6px;border-left:2px solid rgb(176 38 30 / .42);border-right:2px solid rgb(176 38 30 / .42)}
.text{position:absolute;left:96px;top:52px;bottom:52px;width:${Math.round(width * 0.53)}px;display:flex;flex-direction:column;color:var(--ink)}
.genre{display:flex;align-items:center;gap:14px;font-size:22px;font-weight:800;letter-spacing:.16em;color:var(--ink-2);text-transform:uppercase}
.genre::after{content:"";flex:1;height:6px;border-top:2px solid var(--ink);border-bottom:2px solid var(--ink)}
.logo{display:block;width:100%;height:auto;margin:22px 0 0 -26px}
.tagline{margin-top:12px;font-size:${words.sub ? 52 : 58}px;font-weight:800;line-height:1.28;letter-spacing:-.01em;color:var(--ink)}
.hit{background:linear-gradient(transparent 70%,rgb(176 38 30 / .30) 70% 90%,transparent 90%);box-decoration-break:clone;-webkit-box-decoration-break:clone;color:var(--heat)}
.sub{margin-top:14px;font-size:24px;font-weight:600;letter-spacing:.04em;color:var(--ink-3)}
.badge{margin-top:auto;align-self:flex-start;display:flex;align-items:center;gap:12px;padding:12px 24px 12px 20px;border-radius:12px;background:var(--acid);color:var(--cream);font-size:28px;font-weight:800;box-shadow:0 5px 0 var(--ink)}
.badge::before{content:"";width:0;height:0;border-left:11px solid var(--cream);border-top:8px solid transparent;border-bottom:8px solid transparent}
.photo{position:absolute;right:64px;top:${photoTop}px;width:${photoW}px;height:${photoH}px;background:#fff;padding:12px;box-shadow:0 2px 0 rgb(22 24 26 / .08),0 14px 26px rgb(70 50 20 / .22)}
.photo img{display:block;width:100%;height:100%;object-fit:cover;object-position:78% 50%}
.tape{position:absolute;width:132px;height:36px;background:rgb(232 220 178 / .78);box-shadow:0 1px 2px rgb(70 50 20 / .18)}
.t1{right:${64 + photoW - 96}px;top:${photoTop - 18}px;transform:rotate(-8deg)}
.t2{right:40px;top:${photoTop + photoH - 20}px;transform:rotate(-6deg)}
.stamp{position:absolute;right:${64 + photoW - 150}px;top:${photoTop + photoH - 60}px;padding:6px 22px;border:5px solid var(--heat);outline:2px solid var(--heat);outline-offset:4px;border-radius:8px;background:rgb(244 238 223 / .55);color:var(--heat);font-size:58px;font-weight:900;letter-spacing:.12em;transform:rotate(-7deg);mix-blend-mode:multiply;opacity:.88}
</style><body>
<div class="ledger"></div><div class="margin"></div>
<div class="photo"><img src="${url("public/triggerlab-key-visual.webp")}" alt=""></div><div class="tape t1"></div><div class="tape t2"></div>
<div class="stamp">${escapeHtml(words.stamp)}</div>
<div class="text"><div class="genre">${escapeHtml(words.genre)}</div><img class="logo" src="${url(logo)}" alt=""><p class="tagline">${taglineHtml(words)}</p>${sub}<div class="badge">${escapeHtml(words.badge)}</div></div>
</body></html>`;
}

const shots = Object.keys(OG_WORDS).map((language) => ({
  out: join(ogDir, `og-${language}.jpg`),
  width: 1200,
  height: 675,
  html: () => page({ language, words: OG_WORDS[language], width: 1200, height: 675 }),
}));
if (args.includes("--social")) {
  shots.push({
    out: join(socialDir, "social-preview.png"),
    width: 1280,
    height: 640,
    html: () => page({ language: "ko", words: SOCIAL_WORDS, width: 1280, height: 640 }),
  });
}

// A page on file:, so it may read the art and the fonts from disk.
const scratch = mkdtempSync(join(tmpdir(), "og-"));
const browser = await chromium.launch();
try {
  for (const shot of shots) {
    mkdirSync(resolve(shot.out, ".."), { recursive: true });
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
