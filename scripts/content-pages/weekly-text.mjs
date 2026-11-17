import {
  WEEK_RULE_CATALOGUE,
  IDLE_EROSION_PERCENT,
  MARKET_SHOCK_BOARD,
  MARKET_SHOCK_WALL,
  MARKET_SHOCK_WOBBLE,
} from "../../src/gauntlet/weeklyRules.js";
import { WEEKLY_RULES, weekStartMs } from "../../src/gauntlet/weeklyCalendar.js";
import weekRulesKo from "../../src/copy/weekRules.js";
import weekRulesEn from "../../src/locales/en/screens/weekRules.js";
import weekRulesJa from "../../src/locales/ja/screens/weekRules.js";
import { fill } from "../../src/locale.js";
import { escapeHtml } from "../legal-pages.mjs";

/**
 * The weekly rule calendar as a page (/weekly.html, /en/, /ja/; 방향 질의
 * Q12 (1), 2026-11-12: tell the next week's rule in the game and on the
 * site's pages, with no alert, mail or push). The start screen already says
 * this week's rule and the next one; this page lists every booked week
 * with its days and its rule, so a reader can see what is coming and when to
 * come back.
 *
 * Built from the calendar the game reads (src/gauntlet/weeklyCalendar.js),
 * from `FIRST_LISTED_WEEK`, and the rules' own words in each language, their
 * numbers taken off the catalogue's schema. The page is the same for the same
 * tree (no build date in it); a past week stays listed until the calendar's
 * entry goes.
 */

/** Weeks before this one (the test week and the week before it) are not listed. */
export const FIRST_LISTED_WEEK = "2026-W48";

const COPY = { ko: weekRulesKo, en: weekRulesEn, ja: weekRulesJa };

export const WEEKLY_DESCRIPTION = {
  ko: "임계점의 주간 규칙 달력: 어느 주에 어떤 규칙이 서는지, 날짜와 규칙 설명을 미리 알려 드립니다.",
  en: "The Critical Point Rule of the Week calendar: which week brings which rule, with its days and what it does.",
  ja: "臨界点の今週のルール カレンダー: どの週にどのルールが立つのか、日付と説明を前もってお知らせします。",
};

const INTRO = {
  ko: [
    "대체로 두 주에 한 번, 그 주에만 서는 규칙이 있습니다. 주는 한국 시간 월요일 0시에 바뀝니다.",
    "시즌을 시작할 때 이번 주의 규칙으로 할지(이번 주 순위), 하지 않을지(평소 순위) 고릅니다. 시즌은 시작한 주의 규칙을 끝까지 지니고, 스토리 모드에는 붙지 않습니다.",
    "아래는 정해 둔 주입니다. 게임 시작 화면도 이번 주와 다음 주의 규칙을 알려 줍니다. 알림이나 메일은 보내지 않습니다.",
  ],
  en: [
    "About one week in two brings a rule of its own. Weeks turn at midnight on Monday, Korea time.",
    "When you start a season you choose to play with the Rule of the Week (this week’s ranking) or without it (usual ranking). A season keeps the rule of the week it started in until it ends, and Story Mode never gets one.",
    "These are the weeks we have booked. The start screen also tells you this week’s rule and next week’s. We send no alerts or mail.",
  ],
  ja: [
    "おおむね二週に一回、その週だけ立つルールがあります。週は韓国時間の月曜0時に切り替わります。",
    "シーズンを始めるときに、今週のルールで遊ぶか（今週のランキング）、遊ばないか（通常のランキング）を選びます。シーズンは始めた週のルールを最後まで持ち続け、ストーリーモードには付きません。",
    "以下は決まっている週です。ゲームのスタート画面でも、今週と来週のルールをお知らせします。通知やメールは送りません。",
  ],
};

const WORDS = {
  ko: { world: "그 주의 이야기", play: "게임 시작", empty: "정해 둔 주가 아직 없습니다." },
  en: { world: "That week in the story", play: "Play", empty: "No week is booked yet." },
  ja: { world: "その週の物語", play: "ゲームを始める", empty: "決まっている週はまだありません。" },
};

/**
 * The numbers a rule's words name, off its schema (weeklyRules.js fills the same blanks from its constants).
 * A device rule (IDLE MONEY, MARKET SHOCK) has no schema; its numbers are the devices' constants.
 */
function ruleValues(schema = {}) {
  return {
    erosion: IDLE_EROSION_PERCENT,
    shockBoard: MARKET_SHOCK_BOARD + 1,
    shockWall: MARKET_SHOCK_WALL,
    shockSwing: MARKET_SHOCK_WOBBLE,
    shift: -(schema.wallShift ?? 0),
    crisisShift: -(schema.wallShift ?? 0),
    rate: schema.fractureRate,
    seconds: -(schema.secondsShift ?? 0),
    chips: schema.chipsFactor,
    crisisChips: schema.chipsFactor,
  };
}

/** A rule's title, text and line in the story in a language; null for a rule the page cannot say. */
export function ruleIn(id, language) {
  const rule = WEEK_RULE_CATALOGUE[id];
  const words = COPY[language]?.rules?.[id];
  if (!rule || !words) return null;
  const text = fill(words.text, ruleValues(rule.schema));
  if (/\{\w+\}/.test(text)) return null;
  return { label: rule.label, title: words.title, text, world: words.world ?? null };
}

const WEEKDAY = { ko: ["일", "월", "화", "수", "목", "금", "토"], ja: ["日", "月", "火", "水", "木", "金", "土"] };
const MONTH_EN = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** A KST day, in the page's language: 2026년 11월 23일(월) / Mon, Nov 23, 2026 / 2026年11月23日(月). */
export function dayIn(ms, language) {
  const d = new Date(ms + 9 * 3600 * 1000);
  const [y, m, day, w] = [d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), d.getUTCDay()];
  if (language === "en") return `${["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][w]}, ${MONTH_EN[m]} ${day}, ${y}`;
  if (language === "ja") return `${y}年${m + 1}月${day}日(${WEEKDAY.ja[w]})`;
  return `${y}년 ${m + 1}월 ${day}일(${WEEKDAY.ko[w]})`;
}

/** The booked weeks the page lists, in order, each with its Monday and Sunday. */
export function listedWeeks(calendar = WEEKLY_RULES) {
  return calendar
    .filter((entry) => entry.added !== "dev" && entry.week >= FIRST_LISTED_WEEK && weekStartMs(entry.week) !== null)
    .map((entry) => ({ ...entry, start: weekStartMs(entry.week), end: weekStartMs(entry.week) + 6 * 86400000 }))
    .sort((a, b) => a.start - b.start);
}

export function weeklyBody(language, calendar = WEEKLY_RULES, gamePath = "/") {
  const words = WORDS[language];
  const items = listedWeeks(calendar)
    .map((entry) => {
      const rule = ruleIn(entry.id, language);
      if (!rule) return "";
      const [, year, num] = /^(\d{4})-W(\d{2})$/.exec(entry.week);
      const weekName = { ko: `${year}년 ${Number(num)}주차`, en: `week ${Number(num)} of ${year}`, ja: `${year}年 第${Number(num)}週` }[language];
      const world = rule.world ? `\n<p class="meta">${escapeHtml(words.world)}: ${escapeHtml(rule.world)}</p>` : "";
      return `<li><p class="meta">${escapeHtml(dayIn(entry.start, language))} – ${escapeHtml(dayIn(entry.end, language))} · ${escapeHtml(weekName)}</p>
<p><strong>${escapeHtml(rule.label)}</strong> (${escapeHtml(rule.title)})</p>
<p>${escapeHtml(rule.text)}</p>${world}</li>`;
    })
    .filter(Boolean);
  const list = items.length ? `<ul class="case-list">\n${items.join("\n")}\n</ul>` : `<p>${escapeHtml(words.empty)}</p>`;
  return `${INTRO[language].map((line) => `<p>${escapeHtml(line)}</p>`).join("\n")}
${list}
<p><a href="${gamePath}">${escapeHtml(words.play)}</a></p>`;
}
