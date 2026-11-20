/**
 * 석간 원장's name, its fiction line and its list's address: what the start
 * screen's reading section prints before the articles arrive. The articles
 * themselves (src/news/newsIndex.js, thirty titles and summaries) load as a
 * chunk of their own once the section is drawn (HomeReading.jsx), so they cost
 * the first paint nothing; the section sits under the first screen.
 */

/** The paper's name and what it says about itself, Korean only like its articles. */
export const NEWS_PAPER = "석간 원장";
export const NEWS_PAPER_LINE = "게임 「임계점」 세계 속의 가상 경제 석간";

/** The line every article page prints above and below its words. */
export const NEWS_DISCLAIMER = "게임 속 가상 기사입니다 — 실제 사건·인물·회사와 관계없습니다";

/** An article's address: `/news/<slug>.html`. The list is `/news/index.html`. */
export const newsPath = (slug) => `/news/${slug}.html`;
export const NEWS_INDEX_PATH = "/news/index.html";
