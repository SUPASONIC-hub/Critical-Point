/**
 * The top of the about page (/about.html, /en/about.html, /ja/about.html):
 * the README's first screen, in the page's language, on the game's own key
 * visual -- the GAUGE lockup, the one line, the button into the game and the
 * three languages over the rooftop; then the six cards of 「한눈에」, the
 * screens (the table's animation and three phone screens) on a band of their
 * own, the bullets of 「어떤 게임인가」 and a last button. The page's own
 * text follows under 「자세히 보기」, whole.
 *
 * Why (2026-11-17): the user liked the GitHub page and found the about page
 * plain beside it, and of three proposals (README card, cinematic landing,
 * both) chose both: the landing's full-width hero and closing band around the
 * README's cards and screens. The long text stays (AdSense turned the site
 * down once for low-value content); the showcase is added above it.
 *
 * The pictures: the key visual the game already ships (public/, with its 480
 * and 960 cuts), and copies in public/about/ of the README's own (docs/images/,
 * which the build does not ship) -- the lockup for a dark page (the plain
 * pages are dark only), the animation as is and the three phone screens at
 * 480px, twice the width they are shown at. Below the hero every picture loads
 * lazily. On a phone the key visual is a 4:3 cut over the analyst on the right
 * with the words under it, so the first screen is not sky.
 */
import { CASE_SEQUENCE } from "../../src/gameCases.js";

const CASES = CASE_SEQUENCE.length;
const IMG = "/about";
const PHONE = { width: 480, height: 1039 };

/** Each language's words for the showcase: plain text, except `bullets` and `quote`, which are HTML. */
export const SHOWCASE = {
  ko: {
    keyAlt: "해 질 녘 고층 옥상에서 도시를 내려다보는 두 분석관의 뒷모습",
    lockupAlt: "CRITICAL POINT 임계점 로고: C자 게이지에서 막 벗어난 점",
    tagline: "판돈을 올릴수록 벽이 가까워진다.",
    lede: `은행 심사 분석관이 되어 ${CASES}개의 사건을 지나는 금융 미스터리 × 푸시 유어 럭 게임`,
    play: "지금 바로 플레이",
    meta: "무료 · 설치 없음 · 휴대폰과 PC",
    glance: "한눈에",
    cards: [
      ["🃏", "45초의 판단", "밀지, 멈출지. 시계는 판마다 돈다"],
      ["💓", "심박으로 읽는 벽", "벽은 안 보이고 심박만 흔들린다"],
      ["🧾", `${CASES}개의 사건`, "프롤로그 다섯 장과 번외 사건들"],
      ["🎭", "결말과 판단 리포트", "결말 카드와 칭호를 나눠 보세요"],
      ["🗓️", "매주 바뀌는 규칙", "위기 주간처럼 한 주씩 판이 바뀐다"],
      ["🌏", "세 언어, 어디서나", "한·영·일, 오프라인 PWA"],
    ],
    what: "어떤 게임인가",
    bullets: [
      "<strong>카드 한 장, 버튼 두 개.</strong> 카드 한 장을 걸고 「확정」할지 「밀어붙일지」 고릅니다. 밀 때마다 판돈은 1.5배 넘게 불어납니다.",
      "<strong>보이지 않는 벽.</strong> 벽의 자리는 오차 섞인 심박만 알려 줍니다. 닿으면 그 사건의 판돈이 모두 사라집니다.",
      "<strong>판단이 다음 판의 규칙을 부순다.</strong> 이번 선택이 다음 판을 바꾸고, 시즌 끝의 결말과 리포트가 당신의 판단 습관을 돌려줍니다.",
      "<strong>대출 한 건에서 시작된 사슬.</strong> 310억짜리 대출 한 건부터 본사 33층의 빈 서명란까지, 프롤로그 다섯 장과 본편 사건이 한 이야기로 이어집니다.",
    ],
    quote: "이 게임이 묻는 것은 “나는 얼마나 똑똑한가”가 아니라 <strong>“나는 언제 똑똑해지는가”</strong>입니다.",
    screens: "화면",
    demoAlt: "휴대폰 테이블에서 카드를 걸고 밀어붙일 때마다 판돈이 커지고 심박과 벽 범위가 바뀌는 한 판의 움직임",
    demoCaption: "한 판의 움직임: 걸고, 밀고, 심박을 읽습니다",
    shots: [
      ["briefing", "브리핑", "장면마다 읽고 판단할 것을 받습니다", "휴대폰에서 사수 오진우가 요약표 합계가 어긋났다고 묻는 프롤로그 브리핑"],
      ["result", "사건의 결과", "판단이 결말과 다음 사건을 바꿉니다", "휴대폰 결과 카드: 침묵을 택한 결말 「조용한 하루를 샀다」와 새벽 4시 막간"],
      ["report", "판단 리포트", "시즌 끝에 판단 습관이 남습니다", "휴대폰 시즌 결산 화면: 결말 「실험은 남았지만 혼자 결정할 수 없게 되었다」와 기록 칭호, 가장 가까웠던 다른 결말"],
    ],
    more: "자세히 보기",
    again: "벽은 어디쯤일까요?",
  },
  en: {
    keyAlt: "Two analysts seen from behind on a high-rise rooftop at dusk, looking down at the city",
    lockupAlt: "The Critical Point logo: a dot that has just left a C-shaped gauge",
    tagline: "The higher the stakes, the closer the Wall.",
    lede: `A financial-mystery push-your-luck game: as a bank's loan analyst, you work through ${CASES} cases.`,
    play: "Play now",
    meta: "Free · Nothing to install · Phone and PC",
    glance: "At a glance",
    cards: [
      ["🃏", "45-second calls", "Push or stop. The clock runs every hand"],
      ["💓", "A Wall you read by heartbeat", "You never see the Wall; only the heartbeat shakes"],
      ["🧾", `${CASES} cases`, "Five prologue cases and side cases"],
      ["🎭", "Endings and a judgment report", "Share your ending card and title"],
      ["🗓️", "Rules that change every week", "Like a crisis week, the table shifts week by week"],
      ["🌏", "Three languages, anywhere", "Korean, English, Japanese; works offline as a PWA"],
    ],
    what: "What kind of game is it?",
    bullets: [
      "<strong>One card, two buttons.</strong> Stake a card, then choose to “Commit” or “Push”. Every push grows the stake by more than 1.5 times.",
      "<strong>An unseen Wall.</strong> Only a heartbeat, with error in it, tells you where the Wall is. Hit it and the whole stake on that case is gone.",
      "<strong>Your call breaks the next hand's rules.</strong> This choice changes the next hand, and the ending and report at the season's end hand your habits of judgment back to you.",
      "<strong>A chain that began with one loan.</strong> From a single ₩31 billion loan to an empty signature line on the head office's 33rd floor, five prologue cases and the main story run as one tale.",
    ],
    quote: "The question this game asks is not “How smart am I?” but <strong>“When do I get smart?”</strong>",
    screens: "Screens",
    demoAlt: "One hand on a phone: a card is staked, and with each push the stake grows while the heartbeat and the Wall's range shift",
    demoCaption: "One hand: stake, push, read the heartbeat",
    shots: [
      ["briefing", "Briefing", "Each scene hands you something to read and decide", "A prologue briefing on a phone: senior Oh Jinwoo asks why the summary table's totals don't match"],
      ["result", "The case's outcome", "Your calls change the ending and the next case", "A result card on a phone: the ending “Bought a Quiet Day”, chosen by silence, and a 4 a.m. interlude"],
      ["report", "Judgment report", "At the season's end, your habits of judgment remain", "The season's closing record on a phone: the ending's name, the title it earned and the nearest other ending"],
    ],
    more: "The full story",
    again: "Where is the Wall?",
  },
  ja: {
    keyAlt: "日暮れの高層ビルの屋上から街を見下ろす、二人の分析官の後ろ姿",
    lockupAlt: "CRITICAL POINT 臨界点のロゴ: C字のゲージから飛び出したばかりの点",
    tagline: "賭け金を上げるほど、壁が近づく。",
    lede: `銀行の審査分析官として${CASES}の事件をたどる、金融ミステリー × プッシュ・ユア・ラックのゲーム`,
    play: "今すぐ遊ぶ",
    meta: "無料 · インストール不要 · スマホとPC",
    glance: "ひと目で",
    cards: [
      ["🃏", "45秒の判断", "押すか、止まるか。時計は勝負ごとに回る"],
      ["💓", "心拍で読む壁", "壁は見えず、心拍だけが揺れる"],
      ["🧾", `${CASES}の事件`, "プロローグの五章と番外事件"],
      ["🎭", "結末と判断レポート", "結末カードと称号をシェアしよう"],
      ["🗓️", "毎週変わるルール", "危機の週のように、一週ごとに勝負が変わる"],
      ["🌏", "三つの言語、どこでも", "日・韓・英、オフラインでも動くPWA"],
    ],
    what: "どんなゲームか",
    bullets: [
      "<strong>カード一枚、ボタン二つ。</strong>カードを一枚賭けて、「確定」するか「押し切る」かを選びます。押すたびに賭け金は1.5倍以上に膨らみます。",
      "<strong>見えない壁。</strong>壁の位置を教えてくれるのは、誤差の混じった心拍だけです。当たれば、その事件の賭け金はすべて消えます。",
      "<strong>判断が次の勝負のルールを壊す。</strong>今回の選択が次の勝負を変え、シーズンの終わりの結末とレポートが、あなたの判断の癖を返してくれます。",
      "<strong>一件の融資から始まった鎖。</strong>310億ウォンの融資一件から本社33階の空いた署名欄まで、プロローグの五章と本編の事件が一つの物語につながります。",
    ],
    quote: "このゲームが問うのは「自分はどれほど賢いか」ではなく、<strong>「自分はいつ賢くなるのか」</strong>です。",
    screens: "画面",
    demoAlt: "スマホのテーブルでカードを賭け、押し切るたびに賭け金が増え、心拍と壁の範囲が変わる一勝負の動き",
    demoCaption: "一勝負の動き: 賭けて、押して、心拍を読む",
    shots: [
      ["briefing", "ブリーフィング", "シーンごとに、読んで判断することを受け取ります", "スマホのプロローグのブリーフィング: 先輩のオ・ジヌが要約表の合計が合わないと尋ねる"],
      ["result", "事件の結果", "判断が結末と次の事件を変えます", "スマホの結果カード: 沈黙を選んだ結末「静かな一日を買った」と午前4時の幕間"],
      ["report", "判断レポート", "シーズンの終わりに、判断の癖が残ります", "スマホのシーズン決算画面: 結末の名前と記録の称号、いちばん近かったほかの結末"],
    ],
    more: "くわしく",
    again: "壁はどのあたりでしょう?",
  },
};

const LANGUAGE_LINKS = [
  ["ko", "/", "한국어"],
  ["en", "/en/", "English"],
  ["ja", "/ja/", "日本語"],
];
const gameOf = (language) => (language === "ko" ? "/" : `/${language}/`);

function languageRow(language) {
  const links = LANGUAGE_LINKS.map(([code, href, name]) =>
    code === language ? `<strong lang="${code}">${name}</strong>` : `<a href="${href}" hreflang="${code}" lang="${code}">${name}</a>`,
  );
  return `<p class="sc-langs">${links.join(" · ")}</p>`;
}

const play = (language, copy) => `<a class="cta sc-play" href="${gameOf(language)}"><span aria-hidden="true">▶ </span>${copy.play}</a>`;
const shotImg = ([name, , , alt]) => `<img src="${IMG}/${name}.webp" width="${PHONE.width}" height="${PHONE.height}" alt="${alt}" loading="lazy" decoding="async" />`;

function hero({ language, name, copy }) {
  return `<div class="sc-hero">
<img class="sc-key" src="/triggerlab-key-visual-960.webp" srcset="/triggerlab-key-visual-480.webp 480w, /triggerlab-key-visual-960.webp 960w, /triggerlab-key-visual.webp 1672w" sizes="100vw" width="960" height="540" alt="${copy.keyAlt}" fetchpriority="high" decoding="async" />
<div class="sc-hero-text">
<h1>${name}</h1>
<img class="sc-lockup" src="${IMG}/lockup.svg" width="1190" height="248" alt="${copy.lockupAlt}" />
<p class="sc-tagline">${copy.tagline}</p>
<p class="sc-lede">${copy.lede}</p>
${play(language, copy)}
<p class="sc-meta">${copy.meta}</p>
${languageRow(language)}
</div>
</div>
`;
}

function showcase(copy, language) {
  return `<section class="sc-section">
<h2>${copy.glance}</h2>
<ul class="sc-cards">
${copy.cards.map(([icon, title, text]) => `<li><span class="sc-icon" aria-hidden="true">${icon}</span><strong>${title}</strong><span>${text}</span></li>`).join("\n")}
</ul>
</section>
<section class="sc-band sc-screens">
<h2>${copy.screens}</h2>
<figure class="sc-demo"><img src="${IMG}/demo-table.webp" width="390" height="844" alt="${copy.demoAlt}" loading="lazy" decoding="async" /><figcaption>${copy.demoCaption}</figcaption></figure>
<div class="sc-shots">
${copy.shots.map((shot) => `<figure>${shotImg(shot)}<figcaption><strong>${shot[1]}</strong><span>${shot[2]}</span></figcaption></figure>`).join("\n")}
</div>
</section>
<section class="sc-section">
<h2>${copy.what}</h2>
<ul class="sc-bullets">
${copy.bullets.map((line) => `<li>${line}</li>`).join("\n")}
</ul>
<blockquote class="sc-quote"><p>${copy.quote}</p></blockquote>
</section>
<div class="sc-band sc-again"><p class="sc-tagline">${copy.again}</p>${play(language, copy)}</div>
<h2 class="sc-more">${copy.more}</h2>
`;
}

/*
 * The hero and the two bands run the window's full width out of the 760px
 * column (`calc(50% - 50vw)`); the body clips the few pixels of scrollbar
 * that 100vw counts, so no width scrolls sideways.
 */
const STYLE = `
body{overflow-x:clip}
.sc-hero,.sc-band{width:100vw;margin-left:calc(50% - 50vw)}
.sc-hero{position:relative;overflow:hidden;background:var(--bg)}
.sc-key{display:block;width:100%;height:auto;aspect-ratio:4/3;object-fit:cover;object-position:84% 60%}
.sc-hero-text{position:relative;z-index:1;width:min(760px,100%);margin:-72px auto 0;padding:48px 16px 32px;text-align:center;background:linear-gradient(to bottom,#06090a00,var(--bg) 64px)}
.sc-hero h1{margin:0 0 14px;color:var(--accent);font-size:.8125rem;font-weight:700;letter-spacing:.2em}
.sc-lockup{display:block;width:min(440px,90%);height:auto;margin:0 auto}
.sc-tagline{margin:20px 0 6px;color:var(--text);font-size:clamp(1.5rem,6vw,2.5rem);font-weight:800;line-height:1.25;letter-spacing:-.02em}
.sc-lede{margin:0 auto 22px;max-width:30em;color:var(--text)}
.sc-play{min-height:52px;padding:0 28px;font-size:1.0625rem}
.sc-meta{margin:12px 0 0;font-size:.875rem}
.sc-langs{margin:4px 0 0;font-size:.875rem}
.sc-langs a,.sc-langs strong{display:inline-flex;align-items:center;min-height:44px}
.sc-cards{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin:12px 0 0;padding:0;list-style:none}
.sc-cards li{display:flex;flex-direction:column;gap:2px;margin:0;padding:14px;border:1px solid var(--line);border-radius:12px;background:var(--surface)}
.sc-icon{font-size:1.5rem;line-height:1.2}
.sc-cards strong{font-size:.9375rem;line-height:1.4}
.sc-cards span:last-child{font-size:.8125rem;line-height:1.55}
.sc-band{padding:8px max(16px,calc(50vw - 364px)) 40px;border-top:1px solid var(--line);border-bottom:1px solid var(--line)}
.sc-screens{margin-top:32px;background:var(--surface)}
.sc-demo{margin:16px auto 0;text-align:center}
.sc-demo img{display:block;width:min(260px,72%);height:auto;margin:0 auto;border:1px solid var(--line);border-radius:22px;box-shadow:0 18px 48px #0009}
.sc-demo figcaption{margin-top:8px;color:var(--text-2);font-size:.8125rem}
.sc-shots{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin-top:20px}
.sc-shots figure{margin:0;text-align:center}
.sc-shots img{display:block;width:100%;height:auto;border:1px solid var(--line);border-radius:14px;box-shadow:0 18px 48px #0009}
.sc-shots figcaption{display:flex;flex-direction:column;margin-top:6px;font-size:.75rem;line-height:1.45;color:var(--text-2)}
.sc-shots figcaption strong{font-size:.8125rem}
.sc-bullets{padding-left:1.2em}
.sc-quote{margin:16px 0 0;padding:12px 16px;border-left:3px solid var(--accent);border-radius:0 8px 8px 0;background:var(--surface)}
.sc-quote p{margin:0}
.sc-again{margin-top:40px;padding-top:48px;padding-bottom:56px;text-align:center;background:radial-gradient(circle at 50% 0,#d9ff6222,transparent 70%);border-bottom:0}
.sc-more{margin-top:40px}
@media (min-width:640px){.sc-cards{grid-template-columns:repeat(3,minmax(0,1fr))}.sc-shots{gap:16px}.sc-shots figcaption{font-size:.8125rem}.sc-shots figcaption strong{font-size:.875rem}}
@media (min-width:760px){.sc-hero{display:flex;align-items:flex-end;min-height:min(78svh,680px);background:#000}.sc-key{position:absolute;inset:0;height:100%;aspect-ratio:auto;object-position:50% 50%;opacity:.78}.sc-hero::after{content:"";position:absolute;inset:0;background:linear-gradient(to bottom,#06090a00 30%,#06090acc 72%,var(--bg))}.sc-hero-text{margin-top:0;padding:0 16px 40px;background:none}}
`;

/**
 * The about page's hero and the showcase that goes before its text's first
 * paragraph, in `language`: `hero({ name })` for renderDocumentPage
 * (scripts/legal-pages.mjs), `body`, and `style` for the page's <style>.
 */
export function aboutShowcase(language) {
  const copy = SHOWCASE[language];
  return {
    hero: ({ name }) => hero({ language, name, copy }),
    body: showcase(copy, language),
    before: "<p>",
    style: STYLE.trim().replace(/\n/g, ""),
  };
}
