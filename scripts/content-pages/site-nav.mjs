/**
 * The site's menu, at the head and the foot of every plain page: the game,
 * the pages about it (the guide, the case files, the cast, how we made it)
 * and the five that were there before them (about, FAQ, contact and the two
 * policies), in the page's language, and at the head the page in the other
 * two languages. `renderDocumentPage` (scripts/legal-pages.mjs) prints it;
 * everything about the menu lives here, so that file keeps one hook.
 *
 * Why a menu: AdSense turned the site down on 2026-11-08 for "low-value
 * content -- not enough unique content and good navigation". Every page now
 * reaches every other kind of page in one step, and the start page's static
 * shell and no-script text carry the same links (`MENU_KINDS`,
 * scripts/static-shell.mjs, scripts/site-pages.mjs).
 *
 * Self-contained on purpose: legal-pages.mjs imports this, so this imports
 * nothing of it.
 */

export const MENU_LANGUAGES = ["ko", "en", "ja"];

/** The pages the menu lists after the game, in its order. Each is `/<kind>.html`, `/en/<kind>.html`, `/ja/<kind>.html`. */
export const MENU_KINDS = ["about", "guide", "cases/index", "characters", "making", "faq", "contact", "privacy", "terms"];

/** The menu's words. `game` opens the game in the page's language. */
export const MENU_LABELS = {
  ko: {
    label: "사이트 메뉴",
    footer: "사이트 메뉴(아래)",
    game: "게임 시작",
    about: "게임 소개",
    guide: "게임 방법",
    "cases/index": "사건 파일",
    characters: "인물",
    making: "만든 이야기",
    faq: "FAQ",
    contact: "문의",
    privacy: "개인정보",
    terms: "약관",
    name: "한국어",
  },
  en: {
    label: "Site menu",
    footer: "Site menu (footer)",
    game: "Play",
    about: "About",
    guide: "How to Play",
    "cases/index": "Case Files",
    characters: "Characters",
    making: "How We Made It",
    faq: "FAQ",
    contact: "Contact",
    privacy: "Privacy",
    terms: "Terms",
    name: "English",
  },
  ja: {
    label: "サイトメニュー",
    footer: "サイトメニュー(下部)",
    game: "ゲームを始める",
    about: "ゲーム紹介",
    guide: "遊び方",
    "cases/index": "事件ファイル",
    characters: "登場人物",
    making: "制作の話",
    faq: "よくある質問",
    contact: "お問い合わせ",
    privacy: "プライバシー",
    terms: "利用規約",
    name: "日本語",
  },
};

const folderOf = (language) => (language === "ko" ? "" : `/${language}`);
/** A page's address from the root, as legal-pages.mjs's `pagePath` writes it. */
export const menuPath = (kind, language) => `${folderOf(language)}/${kind}.html`;
/** The game in a language: `/`, `/en/`, `/ja/` (legal-pages.mjs `gamePath`). */
export const menuGamePath = (language) => (language === "ko" ? "/" : `/${language}/`);

/** The section a page belongs to: a case's page is under the case files. */
const sectionOf = (kind) => (String(kind).startsWith("cases/") ? "cases/index" : kind);

function menuLinks(kind, language) {
  const words = MENU_LABELS[language];
  const section = sectionOf(kind);
  return MENU_KINDS.map((item) => {
    const current = item === kind ? ' aria-current="page"' : item === section ? ' aria-current="true"' : "";
    return `<a href="${menuPath(item, language)}"${current}>${words[item]}</a>\n`;
  }).join("");
}

/** The head's menu: the game, every page in the page's language, and this page in the other two. */
export function siteHeaderNav({ kind, language }) {
  const words = MENU_LABELS[language];
  const switches = MENU_LANGUAGES.filter((code) => code !== language)
    .map((other) => `<a href="${menuPath(kind, other)}" hreflang="${other}" lang="${other}">${MENU_LABELS[other].name}</a>\n`)
    .join("");
  return `<nav aria-label="${words.label}">
<a href="${menuGamePath(language)}">${words.game}</a>
${menuLinks(kind, language)}${switches}</nav>`;
}

/** The foot's menu: the same pages again, after the page's last word, for a reader who scrolled there. */
export function siteFooterNav({ kind, language }) {
  const words = MENU_LABELS[language];
  return `<nav class="site-foot" aria-label="${words.footer}">
<a href="${menuGamePath(language)}">${words.game}</a>
${menuLinks(kind, language).replace(/ aria-current="(?:page|true)"/g, "")}</nav>`;
}

/** What the menu and the content pages add to the plain pages' sheet. */
export const MENU_STYLE = `
nav a[aria-current=true]{color:var(--text)}
.site-foot{padding:12px 0 0;border-top:1px solid var(--line);border-bottom:0}
.site-foot+p{margin-top:16px;padding-top:12px;border-top:1px solid var(--line)}
.lede{font-size:1.0625rem;color:var(--text)}
.meta{margin:4px 0 0;color:var(--text-2);font-size:.875rem}
.case-list{list-style:none;padding:0}
.case-list li{margin:0;padding:14px 0;border-top:1px solid var(--line)}
.case-list a{font-weight:700}
.case-list p{margin:4px 0 0}
.cast{display:grid;gap:20px;padding:0;list-style:none}
.cast li{display:flex;gap:14px;margin:0;align-items:flex-start}
.cast img{flex:none;width:72px;height:72px;object-fit:cover;border-radius:12px;background:var(--surface)}
.cast p{margin:4px 0 0}
.cast .line{color:var(--text);font-style:italic}
.pager{display:flex;flex-wrap:wrap;justify-content:space-between;gap:8px 20px;margin-top:36px;padding-top:12px;border-top:1px solid var(--line)}
.pager a{display:inline-flex;align-items:center;min-height:44px}
.note{font-size:.875rem}
.spoiler-note{margin:12px 0 0;padding:10px 12px;border:1px solid var(--line);border-radius:8px;background:var(--surface);font-size:.9375rem}
details{margin-top:4px}
summary{cursor:pointer;color:var(--text-2);font-size:.875rem;min-height:32px;display:list-item}
`;
