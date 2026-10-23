import { ensureCase, nodeOrders, nodes } from "./gameData.js";

/**
 * Who has a painted portrait, by the name a scene gives as its speaker
 * (`node.speaker`). Moved out of GameRuntime on 2026-10-16: the table grows
 * one line per painted speaker, and the runtime's line budget is for its logic.
 *
 * A speaker who is not here -- or whose file does not arrive -- is drawn as a
 * tinted silhouette by SpeakerPortrait.
 */
const SPEAKER_PORTRAITS = {
  "한서윤": "/portrait-han-seoyun.webp",
  "반재욱": "/portrait-ban-jaeuk.webp",
  "도윤하": "/portrait-do-yunha.webp",
  "오진우": "/portrait-oh-jinwoo.webp",
  "에코": "/portrait-echo.webp",
  // Added after them, most lines first (every speaker with eight lines or more
  // has one since 2026-10-20; from 2026-10-21 the speakers of fewer scenes
  // follow in batches, each in its own block at the end). A line goes in with
  // its file under public/ (scripts/build-portrait.mjs);
  // docs/portrait-credits.md says where each picture came from. These are not
  // warmed by the service worker -- only the five above are -- so each is
  // fetched when its case opens (warmCasePortraits, below); a file that does
  // not arrive is drawn as the silhouette (SpeakerPortrait).
  "이민서": "/portrait-lee-minseo.webp",
  "강태민": "/portrait-kang-taemin.webp",
  "권도현": "/portrait-kwon-dohyeon.webp",
  "문가을": "/portrait-moon-gaeul.webp",
  "나준혁": "/portrait-na-junhyeok.webp",
  "백아린": "/portrait-baek-arin.webp",
  "윤상혁": "/portrait-yoon-sanghyeok.webp",
  "문하준": "/portrait-moon-hajun.webp",
  "서하린": "/portrait-seo-harin.webp",
  "류세아": "/portrait-ryu-sea.webp",
  "임경수": "/portrait-lim-gyeongsu.webp",
  "노아": "/portrait-noah.webp",
  "임소율": "/portrait-lim-soyul.webp",
  "윤서진": "/portrait-yoon-seojin.webp",
  "한지우": "/portrait-han-jiwoo.webp",
  "나은호": "/portrait-na-eunho.webp",
  // B1 (2026-10-21): twenty speakers of three to seven scenes, from photos, most scenes first.
  "선우진": "/portrait-seon-ujin.webp",
  "탁예린": "/portrait-tak-yerin.webp",
  "차지원": "/portrait-cha-jiwon.webp",
  "채이안": "/portrait-chae-ian.webp",
  "남궁솔": "/portrait-namgung-sol.webp",
  "최서진": "/portrait-choi-seojin.webp",
  "채윤슬": "/portrait-chae-yunseul.webp",
  "표세린": "/portrait-pyo-serin.webp",
  "지강현": "/portrait-ji-ganghyeon.webp",
  "안기범": "/portrait-an-gibeom.webp",
  "민하랑": "/portrait-min-harang.webp",
  "정해린": "/portrait-jeong-haerin.webp",
  "이정숙": "/portrait-lee-jeongsuk.webp",
  "유하온": "/portrait-yoo-haon.webp",
  "정태오": "/portrait-jeong-taeo.webp",
  "연하진": "/portrait-yeon-hajin.webp",
  "홍예담": "/portrait-hong-yedam.webp",
  "여다인": "/portrait-yeo-dain.webp",
  "임재윤": "/portrait-lim-jaeyun.webp",
  "신영란": "/portrait-shin-yeongran.webp",
  // B2 (2026-10-21): speakers of one to three scenes, most scenes first.
  "고은비": "/portrait-go-eunbi.webp",
  "주은채": "/portrait-joo-eunchae.webp",
  "배수경": "/portrait-bae-sugyeong.webp",
  "오상철": "/portrait-oh-sangcheol.webp",
  "구태형": "/portrait-koo-taehyeong.webp",
  "허윤경": "/portrait-heo-yungyeong.webp",
  "황혜원": "/portrait-hwang-hyewon.webp",
  "석문호": "/portrait-seok-munho.webp",
  "선재윤": "/portrait-seon-jaeyun.webp",
  "엄동균": "/portrait-eom-donggyun.webp",
  "은채원": "/portrait-eun-chaewon.webp",
  "연시우": "/portrait-yeon-siu.webp",
  "변유진": "/portrait-byeon-yujin.webp",
  "곽민재": "/portrait-kwak-minjae.webp",
  "백다온": "/portrait-baek-daon.webp",
  "진서우": "/portrait-jin-seou.webp",
  "하도율": "/portrait-ha-doyul.webp",
  "연지안": "/portrait-yeon-jian.webp",
  "진태윤": "/portrait-jin-taeyun.webp",
  "하예솔": "/portrait-ha-yesol.webp",
  "채도훈": "/portrait-chae-dohun.webp",
  "남지형": "/portrait-nam-jihyeong.webp",
  // B3 (2026-10-21): the speakers first listed for generated pictures, most
  // scenes first. Villains keep a generated face of someone who does not
  // exist; 배승호, 공병만, 은시온, 여민규 and 배성준 turned out not to be
  // villains and are photos.
  "서도경": "/portrait-seo-dogyeong.webp",
  "조현석": "/portrait-jo-hyeonseok.webp",
  "도하람": "/portrait-do-haram.webp",
  "공병만": "/portrait-gong-byeongman.webp",
  "배승호": "/portrait-bae-seungho.webp",
  "이찬빈": "/portrait-lee-chanbin.webp",
  "반서아": "/portrait-ban-seoa.webp",
  "은시온": "/portrait-eun-sion.webp",
  "여민규": "/portrait-yeo-mingyu.webp",
  "봉영훈": "/portrait-bong-yeonghun.webp",
  "석재우": "/portrait-seok-jaeu.webp",
  "연서준": "/portrait-yeon-seojun.webp",
  "진세라": "/portrait-jin-sera.webp",
  "편종구": "/portrait-pyeon-jonggu.webp",
  "도건우": "/portrait-do-geonu.webp",
  "배성준": "/portrait-bae-seongjun.webp",
  // B4 (2026-10-21): speakers of one scene whose first photo was weak.
  "하은경": "/portrait-ha-eungyeong.webp",
  "송하율": "/portrait-song-hayul.webp",
  "하정희": "/portrait-ha-jeonghui.webp",
  "김 반장": "/portrait-kim-banjang.webp",
  "문성호": "/portrait-moon-seongho.webp",
  "은재하": "/portrait-eun-jaeha.webp",
  "이하경": "/portrait-lee-hagyeong.webp",
  "권태호": "/portrait-kwon-taeho.webp",
};

/** Every speaker's name: the briefing gives a scene's speech to the one the narration last named (speakerLine.js). */
export const SPEAKER_NAMES = Object.keys(SPEAKER_PORTRAITS);

/** The portrait's path for a speaker, or null for one not painted yet. */
export function getSpeakerPortrait(speaker) {
  return SPEAKER_PORTRAITS[speaker] ?? null;
}

/**
 * Fetches the portraits of everyone who speaks in a case, as the case opens
 * (improvement notes D-14, 2026-10-22). The service worker warms only the
 * five portraits that shipped first; every later one came when its speaker
 * first spoke, so on a slow line the page drew the silhouette while it was on
 * its way, and offline it drew it for good -- a speaker with a face shown
 * without one. A case has five to ten speakers. The service worker keeps each
 * file it sees (the root-image rule in worker.js), so a case opened online
 * has its faces offline from then on.
 *
 * Each path is asked for once a page, and once more when a service worker
 * first takes the page: asked before it did, the file went past it and was
 * never kept. `fetch`, not an image: a second image of the same address is
 * answered from the document's own memory and never reaches the worker. A
 * case not yet arrived is warmed when it lands.
 */
const warmed = new Set();

function fetchPortraits(paths) {
  for (const src of paths) globalThis.fetch(src, { priority: "low" }).catch(() => {});
}

export function warmCasePortraits(caseId) {
  if (!caseId || typeof globalThis.fetch !== "function") return;
  const order = nodeOrders[caseId] ?? [];
  if (order.length === 0) {
    ensureCase(caseId).then(() => (nodeOrders[caseId]?.length ? warmCasePortraits(caseId) : null), () => {});
    return;
  }
  const paths = [...new Set(order.map((nodeId) => getSpeakerPortrait(nodes[nodeId]?.speaker)))].filter((src) => src && !warmed.has(src));
  if (paths.length === 0) return;
  paths.forEach((src) => warmed.add(src));
  fetchPortraits(paths);
  const worker = globalThis.navigator?.serviceWorker;
  if (worker && !worker.controller) worker.addEventListener("controllerchange", () => fetchPortraits(paths), { once: true });
}
