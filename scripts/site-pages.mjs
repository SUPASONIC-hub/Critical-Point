import { SUPPORT_CONTACT } from "../src/appConfig.js";
import { CASE_SEQUENCE, TYPICAL_CASE_MINUTES } from "../src/gameCases.js";
import { DATA_RETENTION_DAYS } from "../src/privacyText.js";
import { escapeHtml, gamePath, PAGE_KINDS, PAGE_LANGUAGES, pagePath, renderDocumentPage, renderLegalPages } from "./legal-pages.mjs";

/**
 * The three pages about the game -- what it is and how it is played, the
 * questions players ask, and how to reach the developer -- in Korean, English
 * and Japanese: nine plain pages the build writes beside `index.html` with
 * the policy's six (`staticPages()` in vite.config.js), and the two files a
 * crawler asks for first, /robots.txt and /sitemap.xml.
 *
 *   /about.html    /en/about.html    /ja/about.html
 *   /faq.html      /en/faq.html      /ja/faq.html
 *   /contact.html  /en/contact.html  /ja/contact.html
 *
 * Why they exist: the game is a script-drawn page, and what a crawler or an
 * AdSense reviewer is sent at `/` is a title and a stylesheet. These are the
 * site's text, readable with no script. The Korean is the one the others are
 * translated from (the terms of 앱출시-G and 앱출시-J); every sentence says
 * what the code does, and nothing of the story past the prologue's setup.
 * The numbers that the code holds are read from it: the season's length
 * (CASE_SEQUENCE), the minutes a case takes (TYPICAL_CASE_MINUTES), how long
 * the server keeps a record (DATA_RETENTION_DAYS) and the address
 * (SUPPORT_CONTACT). tests/unit/site-pages.test.mjs holds the rest.
 *
 * The same header as the policy's (`renderDocumentPage`, legal-pages.mjs):
 * the game, the five pages in the page's language, the page in the other two.
 */

const CASES = CASE_SEQUENCE.length;
const MAIN_CASES = CASES - 5;
const MINUTES = TYPICAL_CASE_MINUTES;
const days = DATA_RETENTION_DAYS;
const mail = `<a href="mailto:${SUPPORT_CONTACT}">${SUPPORT_CONTACT}</a>`;
const link = (kind, language, text) => `<a href="${pagePath(kind, language)}">${text}</a>`;

const DESCRIPTION = {
  about: {
    ko: `「임계점: CRITICAL POINT」는 판돈을 올릴수록 벽이 가까워지는 기업·금융 미스터리 게임입니다. ${CASES}개의 사건, 이야기의 시작, 플레이 방법과 점수를 소개합니다.`,
    en: `Critical Point is a corporate and financial mystery where every push of the stake brings the Wall closer. The ${CASES} cases, the setup, how to play and how scoring works.`,
    ja: `『臨界点: CRITICAL POINT』は、賭け金を上げるほど壁が近づく企業・金融ミステリーゲームです。${CASES}の事件、物語の始まり、遊び方とスコアを紹介します。`,
  },
  faq: {
    ko: "플레이 시간, 저장과 이어하기 코드, 오프라인 플레이, 랭킹, 언어 바꾸기, 데이터 삭제, 비용, 권장 기기에 관한 자주 묻는 질문과 답입니다.",
    en: "Answers to common questions: play time, saves and continue codes, offline play, the ranking, changing the language, deleting your data, cost and devices.",
    ja: "プレイ時間、セーブと続行コード、オフラインプレイ、ランキング、言語の切り替え、データの削除、費用、推奨端末についてのよくある質問と回答です。",
  },
  contact: {
    ko: "문의, 오류 제보, 게시판 글 신고, 개인정보 열람·삭제 요청을 보내는 곳과 방법, 답변까지 걸리는 시간을 안내합니다.",
    en: "How to reach the developer: questions, bug reports, reporting a board post, and requests to access or delete your data, and how soon we reply.",
    ja: "お問い合わせ、不具合の報告、掲示板の投稿の通報、個人情報の閲覧・削除の請求の送り先と方法、回答までの期間をご案内します。",
  },
};

/* ---------------------------------------------------------------- about */

const ABOUT_KO = `
<p>「임계점: CRITICAL POINT」는 기업·금융 미스터리이자 푸시 유어 럭(push your luck) 게임입니다. 판돈을 올릴수록 보이지 않는 벽이 가까워지고, 한 번의 판단은 다음 판의 규칙을 바꿉니다. 웹 브라우저에서 바로 실행되며 회원가입이나 설치 없이 무료로 플레이할 수 있습니다. 한국어, 영어, 일본어로 플레이할 수 있습니다.</p>

<h2>이야기의 시작</h2>
<p>플레이어는 KD은행에서 대출 심사를 맡은 분석관입니다. 3년 전 당신은 310억 원짜리 대출의 승인 문서에 혼자 반대 의견을 올렸습니다. 의견서는 반려되었고 대출은 그대로 나갔습니다. 그리고 당신은 사유 칸이 비어 있는 발령서 한 장으로, 미국계 자본이 최대주주인 KD금융그룹의 지하 연구소 트리거랩에 내려왔습니다.</p>
<p>게임은 그보다 조금 앞, 수습 마지막 과제에서 시작합니다. 처음 다섯 사건은 그 3년 전을 다루는 프롤로그이고, 프롤로그에서 남긴 것이 3년 뒤 사건 01의 첫 장면을 정합니다. 본편은 오늘 케이스데스크에 올라온 첫 파일에 그때 그 대출번호가 그대로 남아 있는 데서 시작합니다. 프롤로그 다섯 사건과 본편 ${MAIN_CASES}개 사건, 모두 ${CASES}개의 사건이 하나의 사슬로 이어집니다.</p>
<p>게임에 나오는 인물, 회사, 은행, 기관의 이름과 사건은 모두 허구이며 실제와 관계가 없습니다. 게임 속 금융 판단은 실제 투자나 금융 조언이 아닙니다.</p>

<h2>무엇을 묻는 게임인가</h2>
<p>이 게임은 “내 창의성은 언제 가장 크게 확장되는가”라는 질문에서 출발했습니다. 사람의 판단은 압박이 전혀 없을 때도, 압박에 짓눌릴 때도 얕아집니다. 판돈이 커지고 시계가 줄어드는데도 아직 생각할 여유가 남아 있는 구간에서 생각이 가장 깊어진다는 가설을, 플레이어가 직접 밀어붙이고 멈추는 행동으로 확인합니다. 질문을 한 줄로 줄이면 “나는 얼마나 똑똑한가”가 아니라 “나는 언제 똑똑해지는가”입니다. 선택은 사건을 끝내지 않고 다음 압박의 모양을 바꾸므로, 한 시즌을 마치면 자기 판단 습관이 결말과 리포트로 남습니다.</p>

<h2>플레이 방법</h2>
<h3>1. 브리핑을 읽는다</h3>
<p>장면이 열리면 먼저 그래픽 노블 한 페이지 같은 브리핑이 펼쳐집니다. 장소와 마감까지 남은 시간, 말하는 사람의 초상과 대사, 그리고 「당신의 판단」 상자에 이 장면이 묻는 질문이 적혀 있습니다. 브리핑에는 본문 길이에 맞춘 읽는 시간이 따로 있고, 다 되면 판이 저절로 열립니다. 남은 시간을 보여 주는 시계를 누르면 읽는 시간이 멈춥니다.</p>
<h3>2. 카드를 건다</h3>
<p>선택지 하나가 카드 한 장입니다. 카드에는 얻을 칩과 가장 크게 태우는 자원이 적혀 있습니다. 판을 바꾸는 선택지가 있는 장면에는 「판을 다시 짠다」라는 와일드 카드가 한 장 끼어 있고, 이 카드를 확정하면 사건마다 하나씩 숨어 있는 경로가 열립니다.</p>
<h3>3. 밀어붙이거나 확정한다</h3>
<p>「밀어붙인다」를 누를 때마다 열기가 오르고 판돈의 배율이 커집니다. 열기 게이지에는 벽이 있을 수 있는 구간이 그려져 있지만, 벽의 정확한 위치는 끝까지 나오지 않습니다. 벽이 얼마나 가까운지 알려 주는 것은 심박 하나뿐이고, 그마저 오차가 있습니다. 벽에 닿으면 BUST가 되어 이번 사건에 걸린 판돈이 0이 되고, 카드는 이득 없이 비용만 치릅니다. 「확정」을 누르면 그때까지 쌓은 판돈을 지킵니다. 사건이 닫힐 때 판돈은 금고로 옮겨지고, 금고는 벽이 가져가지 못합니다. 판에는 제한 시간(기본 45초)이 있어서 가만히 있어도 시계가 열기를 올립니다.</p>
<h3>4. 판단은 다음 판의 규칙을 바꾼다</h3>
<p>모든 결정은 다음 판에 흔적을 남깁니다. BUST 뒤에는 카드가 뒤집히고 벽이 가까워집니다(BLACKOUT, AFTERSHOCK). 한 번도 밀지 않고 확정하면 가장 좋은 카드가 봉인되고(COLD FEET), 너무 높은 배율로 확정하면 열기와 시간을 빚집니다(HEAT DEBT). 방금 가장 크게 태운 자원은 다음 판에서 1.5배로 청구됩니다(FRACTURE). 이런 규칙은 처음부터 한꺼번에 켜지지 않고 프롤로그 다섯 사건에 걸쳐 한 단계씩 열리며, 사건 01부터 모두 켜집니다.</p>
<h3>5. 논리 콤보와 도구</h3>
<p>카드마다 생각 유형(위험 다루기, 꼼꼼히 확인하기, 끝까지 버티기, 판 바꾸기)이 붙어 있습니다. 같은 유형을 이어 고르면 논리 콤보가 쌓여 판돈이 커지고, 유형을 바꾸면 대개 콤보가 끊깁니다. 콤보는 벽을 옮기지 않으므로 콤보가 길다고 한 번 더 미는 것은 함정이 될 수 있습니다. 프롤로그 후반부터는 사건이 닫힐 때마다 다음 사건의 첫 테이블에서 도구 세 개 가운데 하나를 고르며, 도구는 다섯 개까지 들 수 있습니다. 도구는 든 동안 판의 규칙 하나를 바꿉니다.</p>

<h2>점수와 결말</h2>
<p>사건이 끝나면 리포트가 그 과정이 얼마나 깊은 판단이었는지를 0부터 100까지의 버스트 점수로 매깁니다. 점수는 금고에 모은 칩이 아니라 판단의 결을 봅니다. 압박이 오른 장면에서도 앞서 지킨 기준을 뒤집지 않았는지(기준 유지), 한 가지 관점만 반복하지 않았는지(관점 전환), 판을 다시 짜 숨은 경로를 열었는지(구조 재설계), 치솟은 압박을 다음 장면에서 회수했는지(압박 대응), 즉답도 방치도 아닌 시간에 결정했는지(생각 리듬), 장면마다 걸린 챌린지를 맞췄는지(장면 챌린지)를 봅니다. 판을 다시 짜지 않고 2초 안에 누르는 즉답은 점수를 깎습니다. 점수에 따라 S, A, B, C 랭크가 붙습니다.</p>
<p>결말은 마지막 사건 하나가 아니라 시즌 전체를 읽습니다. 남은 시간, 현금, 믿음, 공정함, 사람 피해, 피로 같은 자원이 사건마다 닫힐 때의 평균, 벽에 닿은 판의 비율, 찾은 기록의 비율이 아홉 가지 결말 가운데 하나를 정합니다. 시즌이 끝나면 판단 DNA(생각이 깨어나는 조건)와 결말을 담은 결과 카드를 그림 한 장으로 저장할 수 있고, NEW GAME+로 기록과 이야기를 이어받아 다시 도전할 수 있습니다.</p>

<h2>함께 겨루는 곳</h2>
<p>랭킹 보드는 완료한 사건의 버스트 점수로 순위를 매기고, 같은 점수라도 어떤 방식으로 도달했는지에 따라 REFRAME, RISK, SYSTEM, FIELD 네 리그로 나눠 보여 줍니다. 공개 랭킹의 다른 참가자는 이름 없이 「익명 분석관」으로만 보입니다. 참가자 게시판에는 닉네임 하나로 300자까지 짧은 글을 남길 수 있고, 어떤 주에는 그 주에만 서는 「이번 주의 규칙」이 열립니다.</p>

<h2>편하게 플레이하기</h2>
<p>진행은 이 기기의 브라우저에 자동으로 저장되므로 어디서 멈춰도 그 자리에서 이어집니다. 「편의 설정」에서는 벽이 멀어지고 시계가 느려지는 스토리 모드, 판의 시계를 1.5배나 2배로 늦추는 테이블 시간, 번쩍임·흔들림 줄이기, 한 글자 단축키 끄기 같은 설정을 고를 수 있습니다. 컴퓨터에서는 키보드만으로도 플레이할 수 있습니다. 한 번 연결된 상태로 연 기기에서는 인터넷 연결이 없어도 게임이 열리고, 홈 화면에 추가해 앱처럼 쓸 수 있습니다. 더 궁금한 점은 ${link("faq", "ko", "자주 묻는 질문")}에, 연락처는 ${link("contact", "ko", "문의")} 페이지에 있습니다.</p>
`;

const ABOUT_EN = `
<p>Critical Point is a corporate and financial mystery and a push-your-luck game. The higher you raise the stake, the closer an unseen Wall comes, and every call you make changes the rules of the next hand. It runs in your web browser and is free to play, with no sign-up and nothing to install. You can play it in Korean, English or Japanese.</p>

<h2>How the story begins</h2>
<p>You are an analyst who reviews loans at KD Bank. Three years ago, you filed the only dissent on the approval of a ₩31 billion loan. Your written opinion was returned, and the loan went through anyway. Then a single transfer order with its reason left blank sent you down to Trigger Lab, the basement research lab of KD Financial Group, whose largest shareholder is American capital.</p>
<p>The game starts a little earlier, with the last assignment of your probation. The first five cases are the prologue, set three years before, and what you take from the prologue decides the first scene of Case 01 three years later. The main story begins on the day the first file on the case desk still carries that same loan number. The five cases of the prologue and the ${MAIN_CASES} of the main story, ${CASES} cases in all, form a single chain.</p>
<p>The game is fiction. Its people, companies, banks, institutions and events have nothing to do with real ones, and its financial judgments are not investment or financial advice.</p>

<h2>What the game asks</h2>
<p>The game began with one question: “When does my creativity stretch the furthest?” Judgment goes shallow when there is no pressure at all, and when pressure crushes it. The game tests the idea that thinking runs deepest somewhere in between, where the stake keeps growing and the clock keeps shrinking but there is still room to think, by watching when you push and when you stop. In one line, the question is not “How smart am I?” but “When do I get smart?” A choice doesn't end a case; it changes the shape of the next pressure, so a finished season leaves your habits of judgment behind as an ending and a report.</p>

<h2>How to play</h2>
<h3>1. Read the briefing</h3>
<p>Each scene opens with a briefing laid out like a page of a graphic novel: where you are and how long until the deadline, the portrait and words of whoever is speaking, and the question the scene asks in the “Your Call” box. The briefing has its own reading time, set by the length of the text, and the table opens by itself when it runs out. Tap the clock showing the time left to pause it.</p>
<h3>2. Play a card</h3>
<p>Each choice is a card. A card shows the chips it earns and the resource it burns the most. A scene with a choice that changes the game holds one wild card, “Reframe the Table”; commit it, and it opens the route hidden in each case.</p>
<h3>3. Push or commit</h3>
<p>Each time you press “Push”, the Heat rises and the stake's multiplier grows. The Heat gauge marks the stretch where the Wall may be, but its exact place is never shown. Only the heartbeat tells you how close it is, and even the heartbeat is not exact. Hit the Wall and you BUST: the stake on this case drops to zero, and the card costs you without paying anything. Press “Commit” to keep the stake you have built. When a case closes, its stake moves to the Vault, and the Wall can never take the Vault. Each hand has a time limit (45 seconds by default), and even while you wait the clock raises the Heat.</p>
<h3>4. Your call changes the next hand</h3>
<p>Every decision leaves a mark on the next hand. After a BUST, the cards turn face down and the Wall moves closer (BLACKOUT, AFTERSHOCK). Commit without a single push and your best card is sealed (COLD FEET); commit at too high a multiplier and you owe Heat and time (HEAT DEBT). The resource you just burned the most is charged at 1.5 times on the next hand (FRACTURE). These rules don't all switch on at once: they open one step at a time over the five cases of the prologue, and from Case 01 on they are all in play.</p>
<h3>5. Logic Combo and tools</h3>
<p>Every card has a way of thinking: Handle Risk, Double-Check, Hold Out or Change the Game. Keep picking the same way and your Logic Combo builds, raising the stake; switch, and the combo usually breaks. The combo never moves the Wall, so “one more push because the combo is long” can be a trap. From late in the prologue, each time a case closes you pick one of three tools at the first table of the next case, and you can hold up to five. While you hold a tool, it changes one rule of the table.</p>

<h2>Scores and endings</h2>
<p>When a case ends, the report scores how deep your judgment ran with a Burst Score from 0 to 100. The score looks at the grain of your judgment, not at the chips in your Vault: whether you kept the line you had held even as the pressure rose (Holding Your Line), whether you avoided repeating a single view (Shifting View), whether you reframed the table to open the hidden route (Redesign), whether you recovered from a spike of pressure in the next scene (Pressure Recovery), whether you decided at a pace that was neither instant nor idle (Thinking Rhythm), and whether you met each scene's challenge (Scene Challenge). Answering within 2 seconds without reframing the table costs points. The score earns a rank of S, A, B or C.</p>
<p>The ending reads the whole season, not just the last case. The averages of your resources (time left, cash, trust, fairness, human cost and fatigue) as each case closed, the share of hands that hit the Wall and the share of records you found decide which of nine endings you reach. At the end of a season you can save a result card, a single image of your Judgment DNA (the condition that wakes your thinking) and your ending, and start again in NEW GAME+, carrying your records and the story forward.</p>

<h2>Where players compete</h2>
<p>The ranking board orders completed cases by Burst Score, and splits players into four leagues, REFRAME, RISK, SYSTEM and FIELD, by how they got there, even at the same score. Other players on the public ranking appear without names, only as “Anonymous Analyst”. On the player board you can leave a short post of up to 300 characters under a nickname, and some weeks bring a Rule of the Week that holds only that week.</p>

<h2>Playing your way</h2>
<p>Your progress is saved automatically in this device's browser, so wherever you stop, you pick up from there. In “Comfort settings” you can choose Story Mode, which moves the Wall away and slows the clock, Table Time, which slows the table's clock to 1.5 or 2 times, fewer flashes and less shaking, or turning off single-key shortcuts. On a computer you can play with the keyboard alone. A device that has opened the game once while online can open it again without a connection, and you can add it to your home screen to use it like an app. More answers are in the ${link("faq", "en", "FAQ")}, and the address is on the ${link("contact", "en", "Contact")} page.</p>
`;

const ABOUT_JA = `
<p>『臨界点: CRITICAL POINT』は、企業・金融ミステリーであり、プッシュ・ユア・ラック(push your luck)のゲームです。賭け金を上げるほど見えない壁が近づき、一度の判断が次の勝負のルールを変えます。ウェブブラウザですぐに動き、会員登録やインストールなしに無料で遊べます。韓国語、英語、日本語で遊べます。</p>

<h2>物語の始まり</h2>
<p>プレイヤーは、KD銀行で融資審査を担当する分析官です。3年前、あなたは310億ウォンの融資の承認文書に、ひとりで反対意見を上げました。意見書は差し戻され、融資はそのまま実行されました。そしてあなたは、理由の欄が空いた辞令一枚で、米国系資本が筆頭株主のKD金融グループの地下研究所、トリガーラボへ下りてきました。</p>
<p>ゲームはそれより少し前、見習い最後の課題から始まります。最初の五つの事件は3年前を描くプロローグで、プロローグで残したものが、3年後の事件01の最初のシーンを決めます。本編は、今日ケースデスクに上がってきた最初のファイルに、あのときの融資番号がそのまま残っているところから始まります。プロローグの五つの事件と本編の${MAIN_CASES}の事件、合わせて${CASES}の事件が一本の鎖でつながっています。</p>
<p>ゲームに登場する人物、会社、銀行、機関の名称や事件はすべてフィクションで、実在のものとは関係がありません。ゲーム内の金融判断は、実際の投資や金融に関する助言ではありません。</p>

<h2>何を問うゲームか</h2>
<p>このゲームは「自分の創造性は、いついちばん大きく広がるのか」という問いから生まれました。人の判断は、圧力がまったくないときにも、圧力に押しつぶされるときにも浅くなります。賭け金が膨らみ、時計が減っていくのに、まだ考える余裕が残っている区間で思考がいちばん深くなる、という仮説を、プレイヤー自身が押し切り、止まる行動で確かめます。問いを一行にすると、「自分はどれほど賢いか」ではなく「自分はいつ賢くなるのか」です。選択は事件を終わらせず、次の圧力の形を変えるので、シーズンを終えると自分の判断の癖が結末とレポートとして残ります。</p>

<h2>遊び方</h2>
<h3>1. ブリーフィングを読む</h3>
<p>シーンが開くと、まずグラフィックノベルの一ページのようなブリーフィングが広がります。場所と締め切りまでの残り時間、話す人の肖像とせりふ、そして「あなたの判断」の枠に、このシーンが問う質問が書かれています。ブリーフィングには本文の長さに合わせた読む時間が別にあり、時間が来ると勝負が自動で開きます。残り時間を示す時計を押すと、読む時間が止まります。</p>
<h3>2. カードを賭ける</h3>
<p>選択肢一つがカード一枚です。カードには、得られるチップと、いちばん大きく消費する資源が書かれています。勝負を変える選択肢があるシーンには「卓を組み替える」というワイルドカードが一枚混ざっていて、このカードを確定すると、事件ごとに一つずつ隠れているルートが開きます。</p>
<h3>3. 押し切るか、確定する</h3>
<p>「押し切る」を押すたびに熱が上がり、賭け金の倍率が大きくなります。熱ゲージには壁がありうる区間が描かれていますが、壁の正確な位置は最後まで示されません。壁がどれだけ近いかを教えてくれるのは心拍だけで、それにも誤差があります。壁に当たるとBUSTとなり、この事件に賭けた賭け金がゼロになって、カードは利益なしにコストだけを払います。「確定」を押すと、それまでに積んだ賭け金を守れます。事件が閉じると賭け金は金庫に移され、金庫は壁に奪われません。勝負には制限時間(標準で45秒)があり、じっとしていても時計が熱を上げます。</p>
<h3>4. 判断は次の勝負のルールを変える</h3>
<p>すべての決定は、次の勝負に跡を残します。BUSTのあとはカードが裏返り、壁が近づきます(BLACKOUT、AFTERSHOCK)。一度も押さずに確定すると最も良いカードが封印され(COLD FEET)、高すぎる倍率で確定すると熱と時間を借りることになります(HEAT DEBT)。直前にいちばん大きく消費した資源は、次の勝負で1.5倍請求されます(FRACTURE)。こうしたルールは最初から一度にすべてオンになるのではなく、プロローグの五つの事件を通して一段階ずつ開き、事件01からはすべてオンになります。</p>
<h3>5. ロジックコンボとツール</h3>
<p>カードにはそれぞれ思考のタイプ(リスクを扱う、念入りに確かめる、最後まで粘る、卓を変える)が付いています。同じタイプを続けて選ぶとロジックコンボが積み上がって賭け金が大きくなり、タイプを変えると多くの場合コンボが途切れます。コンボは壁を動かさないので、コンボが長いからもう一度押す、というのは罠になりえます。プロローグの後半からは、事件が閉じるたびに次の事件の最初のテーブルでツール三つのうち一つを選び、ツールは五つまで持てます。ツールは持っているあいだ、勝負のルールを一つ変えます。</p>

<h2>スコアと結末</h2>
<p>事件が終わると、レポートがその過程がどれほど深い判断だったかを、0から100までのバーストスコアで採点します。スコアが見るのは金庫に集めたチップではなく、判断の質です。圧力が上がったシーンでも先に守った基準を覆さなかったか(基準の維持)、一つの視点だけを繰り返さなかったか(視点の転換)、卓を組み替えて隠れたルートを開いたか(構造の再設計)、跳ね上がった圧力を次のシーンで回収したか(圧力への対応)、即答でも放置でもない時間で決めたか(思考のリズム)、シーンごとのチャレンジを満たしたか(シーンチャレンジ)を見ます。卓を組み替えずに2秒以内に押す即答は減点になります。スコアに応じてS、A、B、Cのランクが付きます。</p>
<p>結末は最後の事件一つではなく、シーズン全体を読みます。残り時間、現金、信頼、公正さ、人への被害、疲労といった資源の、事件ごとに閉じたときの平均、壁に当たった勝負の割合、見つけた記録の割合が、九つの結末のうち一つを決めます。シーズンが終わると、判断DNA(思考が目覚める条件)と結末を収めた結果カードを画像一枚として保存でき、NEW GAME+で記録と物語を引き継いで再挑戦できます。</p>

<h2>競い合う場所</h2>
<p>ランキングボードは完了した事件のバーストスコアで順位を付け、同じスコアでもどのような方法でたどり着いたかによって、REFRAME、RISK、SYSTEM、FIELDの四つのリーグに分けて表示します。公開ランキングのほかの参加者は名前なしで、「匿名分析官」としてだけ表示されます。参加者掲示板にはニックネーム一つで300文字までの短い投稿を残すことができ、週によってはその週だけの「今週のルール」が開きます。</p>

<h2>快適に遊ぶために</h2>
<p>進行はこの端末のブラウザに自動で保存されるので、どこで止めてもその場所から続けられます。「快適設定」では、壁が遠くなり時計が遅くなるストーリーモード、勝負の時計を1.5倍または2倍に遅くするテーブル時間、点滅・揺れを減らす設定、一文字のショートカットをオフにする設定などを選べます。パソコンではキーボードだけでも遊べます。一度オンラインの状態で開いた端末では、インターネットに接続していなくてもゲームが開き、ホーム画面に追加してアプリのように使えます。そのほかの疑問は${link("faq", "ja", "よくある質問")}に、連絡先は${link("contact", "ja", "お問い合わせ")}のページにあります。</p>
`;

/* ------------------------------------------------------------------ faq */

const FAQ_KO = `
<p>플레이하면서 자주 묻는 것들을 모았습니다. 여기에 없는 질문은 ${link("contact", "ko", "문의")} 페이지의 이메일로 보내 주세요.</p>

<h2>시작하기</h2>
<h3>회원가입이나 설치가 필요한가요?</h3>
<p>필요 없습니다. 브라우저에서 주소를 열면 바로 시작할 수 있습니다. 이름, 이메일, 전화번호를 받지 않으며, 게임 안에서 정하는 분석관 이름은 이 기기에만 저장되고 서버로 보내지 않습니다. 원하면 홈 화면에 추가해 앱처럼 열 수 있습니다.</p>
<h3>비용이 드나요?</h3>
<p>웹판은 무료입니다. 지금은 광고와 유료 결제가 없습니다. 게임 안의 칩, 판돈, 금고, 점수는 실제 돈이나 재화가 아니며 사고팔거나 바꿀 수 없습니다.</p>
<h3>한 번 플레이하는 데 얼마나 걸리나요?</h3>
<p>사건 하나는 ${MINUTES}분 안팎입니다. 사건마다 여러 번의 결정이 있고, 결정마다 브리핑을 읽는 시간과 판의 제한 시간(기본 45초)이 있습니다. 시즌은 프롤로그 다섯 사건과 본편 ${MAIN_CASES}개 사건, 모두 ${CASES}개 사건이라 한 번에 끝내기보다 여러 번에 나눠 하도록 만들었습니다. 어디서 멈춰도 그 자리에서 이어집니다.</p>
<h3>어떤 기기에서 할 수 있나요?</h3>
<p>최신 웹 브라우저가 있는 휴대폰, 태블릿, 컴퓨터에서 할 수 있습니다. 판의 배치는 세로로 든 휴대폰, 옆으로 누인 휴대폰, 노트북과 데스크톱 화면에 맞춰 따로 짜여 있고, 넓은 화면에서는 읽을 것과 카드 패가 두 칸으로 나뉩니다. 컴퓨터에서는 숫자 키로 카드를 걸고, Space로 밀어붙이고, Enter로 확정하는 식으로 키보드만으로 플레이할 수 있습니다. 브라우저나 기기의 기본 글자 크기를 키우면 게임의 글자도 함께 커집니다.</p>
<h3>너무 어렵습니다.</h3>
<p>「편의 설정」의 스토리 모드를 켜면 벽이 멀어지고, 다음 판을 깨는 규칙이 꺼지며, 판의 시계가 느려집니다. 사건을 열 때 적용되므로 다음 사건부터 바뀝니다. 스토리 모드로 연 사건이 있는 시즌은 공개 시즌 랭킹에 오르지 않습니다. 읽는 시간이 모자라면 「읽기 시계 자동 넘김 끄기」를 켜거나, 브리핑의 시계를 눌러 멈출 수 있습니다.</p>
<h3>게임 속 회사와 사건은 실제인가요?</h3>
<p>아닙니다. 등장하는 인물, 회사, 은행, 기관의 이름과 사건은 모두 허구이며 실제와 관계가 없습니다. 게임 속 금융 판단은 실제 투자나 금융 조언이 아닙니다.</p>

<h2>저장과 기기</h2>
<h3>진행은 어디에 저장되나요?</h3>
<p>모든 진행은 이 기기의 브라우저 저장소(localStorage)에 자동으로 저장됩니다. 판을 걸어 둔 채로 「저장 후 나가기」(키보드 Shift+P)를 누르거나 앱을 백그라운드로 보내도, 걸어 둔 카드와 올린 열기, 흐른 시간이 그대로 보관됩니다. 이미 벽에 닿아 터진 판은 보관되지 않으므로, 멈췄다 돌아오는 것으로 BUST를 되돌릴 수는 없습니다. 일반 저장과 따로 최근 복구 지점 다섯 개도 둡니다. 브라우저에서 이 사이트의 데이터를 지우면 이 기기의 진행도 함께 지워집니다.</p>
<h3>다른 기기에서 이어 할 수 있나요? 이어하기 코드는 무엇인가요?</h3>
<p>시작 화면의 「다른 기기에서 이어하기」 패널에서 「온라인 저장 사용」을 켜면 됩니다. 기본은 꺼져 있습니다. 켜면 XXXX-XXXX-XXXX 모양의 이어하기 코드가 만들어지고, 그 뒤의 저장은 이 코드로 서버에도 올라갑니다. 다른 기기에서 같은 코드를 입력하면 멈춘 자리부터 이어지고, 그 뒤로는 두 기기가 같은 코드에 저장합니다. 올라가는 사본에서는 분석관 이름과 피드백의 자유 의견이 빠지고, 서버는 코드 자체가 아니라 되돌릴 수 없게 바꾼 값만 저장합니다. 서버 사본은 마지막 저장으로부터 ${days}일 뒤 자동으로 지워지며, 그 전에 패널에서 직접 지울 수도 있습니다. 코드를 아는 사람은 그 진행을 불러올 수 있으니 다른 사람에게 알려 주지 마세요.</p>
<h3>인터넷 연결 없이 할 수 있나요?</h3>
<p>할 수 있습니다. 한 번 연결된 상태로 연 기기에서는 연결이 없어도 게임이 열리고 저장한 자리에서 이어집니다. 첫 판이 열린 뒤 기기가 한가할 때 남은 사건과 화면을 미리 받아 두며, 브라우저의 데이터 절약 모드에서는 미리 받지 않습니다. 다 받기 전에 연결이 끊기면 아직 받지 못한 화면에서 다시 시도하라는 안내가 나옵니다. 랭킹, 참가자 게시판, 온라인 저장은 연결이 있어야 합니다.</p>
<h3>홈 화면에 추가하려면 어떻게 하나요?</h3>
<p>크롬, 엣지, 삼성 인터넷처럼 설치를 지원하는 브라우저에서는 시작 화면 「편의 설정」 서랍의 「홈 화면에 추가」 버튼을 누르면 브라우저의 설치 창이 뜹니다. iPhone과 iPad에서는 브라우저의 공유 버튼에서 홈 화면에 추가할 수 있고, 같은 서랍이 그 방법을 알려 줍니다. 홈 화면에 추가한 사본도 연결 없이 열립니다.</p>

<h2>랭킹과 언어</h2>
<h3>랭킹은 무엇으로 정해지나요?</h3>
<p>완료한 사건의 버스트 점수(0~100)로 순위를 매깁니다. 동점이면 랭크, 구조 재설계, 압박 대응, 관점 전환 순으로 가립니다. 한 런(처음부터 시작한 한 번의 시즌)은 가장 좋은 기록 하나만 오르고, 시즌을 끝낸 기록이 중간 기록보다 늘 앞섭니다. 공개 랭킹에는 이름 대신 「익명 분석관」과 기록 번호 끝 8자리만 표시됩니다. 공개 랭킹은 플레이테스트 데이터 제공 동의가 켜진 기기의 기록으로 만들고, 동의를 끈 기기의 기록은 이 기기의 로컬 랭킹에만 남습니다. 공개 랭킹은 플레이테스트 순위라서 판의 규칙이 바뀌면 비울 수 있습니다.</p>
<h3>언어는 어떻게 바꾸나요?</h3>
<p>시작 화면 머리의 「한국어 · English · 日本語」에서 고르면 됩니다. 고른 언어는 이 기기에 저장되고, 게임이 그 언어로 다시 열립니다. 아직 언어를 고른 적이 없는 기기라면 주소 끝에 ?lang=en(영어)이나 ?lang=ja(일본어)를 붙여 그 언어로 열 수도 있습니다. 영어판과 일본어판도 프롤로그부터 마지막 사건까지 모든 장면과 화면 문구가 그 언어로 나옵니다. 판의 규칙, 점수, 랭킹은 언어와 관계없이 같습니다.</p>

<h2>데이터와 개인정보</h2>
<h3>어떤 데이터가 서버로 가나요?</h3>
<p>시작 화면 「데이터 저장 안내」의 「플레이테스트 데이터 제공 동의」가 켜져 있으면 사건 결과, 선택 기록과 응답 시간, 화면 언어, 보낸 피드백, 오류 보고가 이 기기의 무작위 식별 번호와 함께 연구용으로 저장되고 ${days}일 뒤 지워집니다. 이 상자는 처음 실행할 때 켜진 상태로 시작하며, 끄면 그때부터 보내지 않습니다. 게임은 쿠키와 광고·분석용 추적 도구를 쓰지 않습니다. 자세한 내용은 ${link("privacy", "ko", "개인정보처리방침")}에 있습니다.</p>
<h3>데이터를 지우려면 어떻게 하나요?</h3>
<p>이 기기의 진행은 게임의 「초기화」로 지울 수 있습니다. 저장된 진행, 순위 기록, 복구 지점, 오류 기록이 지워지고 화면과 소리 설정, 도구 도감, NEW GAME+ 기록은 남으므로, 모두 지우려면 브라우저 설정에서 이 사이트의 데이터를 삭제하세요. 동의 상자를 끄면 아직 보내지 못한 기록도 이 기기에서 지웁니다. 이미 서버로 보낸 기록은 「데이터 저장 안내」와 결과 화면에 보이는 8자리 세션 코드를 ${mail}로 보내 주시면 찾아서 지우고 10일 안에 결과를 알려 드립니다. 온라인 저장 사본은 「다른 기기에서 이어하기」 패널에서 바로 지울 수 있습니다. 서버의 기록은 따로 요청하지 않아도 ${days}일 뒤 자동으로 삭제됩니다.</p>
`;

const FAQ_EN = `
<p>Here are the questions players ask most. For anything not covered here, write to the address on the ${link("contact", "en", "Contact")} page.</p>

<h2>Getting started</h2>
<h3>Do I need an account or an install?</h3>
<p>No. Open the address in your browser and you can start right away. We don't ask for your name, email address or phone number, and the analyst name you choose in the game stays on your device and is never sent to our servers. If you like, you can add the game to your home screen and open it like an app.</p>
<h3>Does it cost anything?</h3>
<p>The web version is free. There are currently no ads and no payments. Chips, stakes, vaults and scores in the game are not money or goods and cannot be bought, sold or exchanged.</p>
<h3>How long does it take to play?</h3>
<p>A case takes about ${MINUTES} minutes. Each case has several decisions, and each decision has a briefing with its own reading time and a hand with a time limit (45 seconds by default). A season is ${CASES} cases, five in the prologue and ${MAIN_CASES} in the main story, so it is made to be played over many sittings rather than in one. Wherever you stop, you pick up from there.</p>
<h3>What devices can I play on?</h3>
<p>Any phone, tablet or computer with an up-to-date web browser. The table has its own layouts for a phone held upright, a phone turned sideways, and laptop and desktop screens; on a wide screen, what you read and your hand of cards sit in two columns. On a computer you can play with the keyboard alone: number keys play a card, Space pushes and Enter commits. If you raise the default text size of your browser or device, the game's text grows with it.</p>
<h3>It's too hard.</h3>
<p>Turn on Story Mode in “Comfort settings”: the Wall moves away, the rules that break the next hand switch off and the table's clock slows down. It applies when a case opens, so it takes effect from the next case. A season with a case opened in Story Mode does not go on the public season ranking. If you need more time to read, turn on “Turn off the reading clock”, or tap the briefing's clock to pause it.</p>
<h3>Are the companies and events in the game real?</h3>
<p>No. Its people, companies, banks, institutions and events are all fiction and have nothing to do with real ones, and its financial judgments are not investment or financial advice.</p>

<h2>Saves and devices</h2>
<h3>Where is my progress saved?</h3>
<p>All progress is saved automatically in this device's browser storage (localStorage). If you press “Save and exit” (Shift+P on a keyboard) in the middle of a hand, or send the app to the background, the card you played, the Heat you pushed and the time that passed are all kept. A hand that has already hit the Wall is not kept, so stopping and coming back cannot undo a BUST. Apart from the regular save, the game also keeps your five most recent recovery points. Clearing this site's data in your browser removes the progress on this device as well.</p>
<h3>Can I continue on another device? What is a continue code?</h3>
<p>Turn on “Use online save” in the “Continue on another device” panel on the start screen. It is off by default. Once it is on, a continue code shaped like XXXX-XXXX-XXXX is created, and from then on your saves are also uploaded to the server under that code. Enter the same code on another device to pick up where you left off; after that, both devices save to the same code. The uploaded copy leaves out your analyst name and your feedback comments, and the server stores only a one-way hash of the code, never the code itself. The server copy is deleted automatically ${days} days after your last save, and you can delete it yourself from the panel before then. Anyone who knows your code can load that progress, so don't share it.</p>
<h3>Can I play without an internet connection?</h3>
<p>Yes. A device that has opened the game once while online can open it without a connection and continue from where you saved. After your first hand opens, the game fetches the remaining cases and screens while the device is idle; it does not do this in your browser's data saver mode. If the connection drops before everything has arrived, a screen not yet fetched asks you to try again. The ranking, the player board and online save need a connection.</p>
<h3>How do I add the game to my home screen?</h3>
<p>In a browser that supports installing, such as Chrome, Edge or Samsung Internet, press “Add to home screen” in the “Comfort settings” drawer on the start screen, and the browser's install window opens. On iPhone and iPad you can add it from the browser's share button, and the same drawer shows how. A copy added to the home screen also opens without a connection.</p>

<h2>Ranking and language</h2>
<h3>What does the ranking count?</h3>
<p>Completed cases are ranked by Burst Score (0 to 100). Ties are broken by rank, then Redesign, then Pressure Recovery, then Shifting View. A run (one season played from the start) puts up only its best record, and a record that finished the season always comes ahead of one partway through. The public ranking shows no names, only “Anonymous Analyst” and the last 8 characters of a run ID. It is built from the records of devices with playtest data sharing on; a device that turned it off keeps its records only on its local ranking. The public ranking is a playtest ranking, so it may be cleared when the rules of the table change.</p>
<h3>How do I change the language?</h3>
<p>Choose from “한국어 · English · 日本語” at the top of the start screen. Your choice is saved on this device, and the game opens again in that language. On a device that has never chosen a language, you can also add ?lang=en (English) or ?lang=ja (Japanese) to the end of the address to open the game in that language. In English and Japanese too, every scene and every line on screen, from the prologue to the last case, is in that language. The rules of the table, scores and rankings are the same in every language.</p>

<h2>Data and privacy</h2>
<h3>What data is sent to the server?</h3>
<p>When “Playtest data sharing” in “Data storage” on the start screen is on, case results, choices and response times, the screen language, feedback you send and error reports are stored for research with a random ID created on this device, and deleted after ${days} days. The box is ticked when you first launch the game, and once you untick it nothing more is sent. The game uses no cookies and no advertising or analytics trackers. The details are in the ${link("privacy", "en", "Privacy Policy")}.</p>
<h3>How do I delete my data?</h3>
<p>“Reset” in the game clears the progress on this device: your saved progress, rankings, recovery points and error log are erased, while your display and sound settings, Tool Index and NEW GAME+ record are kept, so to remove everything, delete this site's data in your browser settings. Unticking the consent box also clears any records still waiting to be sent from this device. For records already sent to the server, send the 8-character session code shown in “Data storage” and on the result screen to ${mail}; we will find and delete them and reply within 10 days. You can delete the online save copy right away from the “Continue on another device” panel. Records on the server are deleted automatically after ${days} days even if you don't ask.</p>
`;

const FAQ_JA = `
<p>プレイ中によく寄せられる質問をまとめました。ここにない質問は、${link("contact", "ja", "お問い合わせ")}のページのメールアドレスまでお送りください。</p>

<h2>はじめに</h2>
<h3>会員登録やインストールは必要ですか？</h3>
<p>必要ありません。ブラウザでアドレスを開けば、すぐに始められます。氏名、メールアドレス、電話番号は取得せず、ゲーム内で決める分析官の名前はこの端末にのみ保存され、サーバーには送信しません。必要に応じて、ホーム画面に追加してアプリのように開くこともできます。</p>
<h3>費用はかかりますか？</h3>
<p>ウェブ版は無料です。現在、広告や有料の決済はありません。ゲーム内のチップ、賭け金、金庫、点数は実際のお金や財物ではなく、売買や交換はできません。</p>
<h3>一回のプレイにどれくらいかかりますか？</h3>
<p>事件一つは${MINUTES}分前後です。事件ごとに何度かの決定があり、決定ごとにブリーフィングを読む時間と、勝負の制限時間(標準で45秒)があります。シーズンはプロローグの五つの事件と本編の${MAIN_CASES}の事件、合わせて${CASES}の事件なので、一度に終わらせるよりも、何回かに分けて遊ぶように作られています。どこで止めても、その場所から続けられます。</p>
<h3>どの端末で遊べますか？</h3>
<p>最新のウェブブラウザがあるスマートフォン、タブレット、パソコンで遊べます。勝負の画面配置は、縦に持ったスマートフォン、横向きのスマートフォン、ノートパソコンとデスクトップの画面に合わせて別々に組まれていて、広い画面では読むものと手札が二列に分かれます。パソコンでは、数字キーでカードを賭け、Spaceで押し切り、Enterで確定するというように、キーボードだけで遊べます。ブラウザや端末の標準の文字サイズを大きくすると、ゲームの文字も一緒に大きくなります。</p>
<h3>難しすぎます。</h3>
<p>「快適設定」のストーリーモードをオンにすると、壁が遠くなり、次の勝負を崩すルールがオフになり、勝負の時計が遅くなります。事件を開くときに適用されるため、次の事件から変わります。ストーリーモードで開いた事件があるシーズンは、公開のシーズンランキングには載りません。読む時間が足りなければ、「読書時計の自動送りをオフ」を使うか、ブリーフィングの時計を押して止めることができます。</p>
<h3>ゲームの会社や事件は実在しますか？</h3>
<p>いいえ。登場する人物、会社、銀行、機関の名称や事件はすべてフィクションで、実在のものとは関係がありません。ゲーム内の金融判断は、実際の投資や金融に関する助言ではありません。</p>

<h2>セーブと端末</h2>
<h3>進行はどこに保存されますか？</h3>
<p>すべての進行は、この端末のブラウザのストレージ(localStorage)に自動で保存されます。勝負の途中で「保存して終了」(キーボードではShift+P)を押したり、アプリをバックグラウンドに回したりしても、賭けたカード、上げた熱、経過した時間はそのまま保管されます。すでに壁に当たってBUSTした勝負は保管されないため、止めて戻ってくることでBUSTを取り消すことはできません。通常のセーブとは別に、直近の復旧地点を五つ残します。ブラウザでこのサイトのデータを消すと、この端末の進行も一緒に消えます。</p>
<h3>別の端末で続けられますか？ 続行コードとは何ですか？</h3>
<p>最初の画面の「別の端末で続ける」パネルで「オンライン保存を使う」をオンにしてください。初期設定はオフです。オンにすると XXXX-XXXX-XXXX の形の続行コードが作られ、それ以降のセーブはこのコードでサーバーにもアップロードされます。別の端末で同じコードを入力すると、止めたところから続けられ、それ以降は二つの端末が同じコードに保存します。アップロードされるコピーからは分析官の名前とフィードバックの自由記述が除かれ、サーバーにはコードそのものではなく、元に戻せないように変換した値だけが保存されます。サーバー上のコピーは最後の保存から${days}日後に自動で削除され、それより前にパネルから自分で削除することもできます。コードを知っている人はその進行を読み込めるので、他人には教えないでください。</p>
<h3>インターネットに接続せずに遊べますか？</h3>
<p>遊べます。一度オンラインの状態で開いた端末では、接続がなくてもゲームが開き、保存したところから続けられます。最初の勝負が開いたあと、端末に余裕があるときに残りの事件と画面を先に受け取っておきます。ブラウザのデータセーバーモードでは先に受け取りません。すべて受け取る前に接続が切れると、まだ受け取っていない画面で再試行の案内が出ます。ランキング、参加者掲示板、オンライン保存には接続が必要です。</p>
<h3>ホーム画面に追加するには？</h3>
<p>Chrome、Edge、Samsung Internetのようにインストールに対応したブラウザでは、最初の画面の「快適設定」の引き出しにある「ホーム画面に追加」ボタンを押すと、ブラウザのインストール画面が開きます。iPhoneとiPadでは、ブラウザの共有ボタンからホーム画面に追加でき、同じ引き出しにその方法が表示されます。ホーム画面に追加したコピーも、接続なしで開きます。</p>

<h2>ランキングと言語</h2>
<h3>ランキングは何で決まりますか？</h3>
<p>完了した事件のバーストスコア(0~100)で順位を付けます。同点の場合は、ランク、構造の再設計、圧力への対応、視点の転換の順で決めます。一つのラン(最初から始めた一回のシーズン)からは最も良い記録一つだけが載り、シーズンを終えた記録が途中の記録より常に上に来ます。公開ランキングには名前の代わりに「匿名分析官」と記録番号の末尾8桁だけが表示されます。公開ランキングはプレイテストデータの提供に同意した端末の記録で作られ、同意をオフにした端末の記録は、この端末のローカルランキングにだけ残ります。公開ランキングはプレイテストの順位のため、勝負のルールが変わった場合はリセットすることがあります。</p>
<h3>言語はどう切り替えますか？</h3>
<p>最初の画面の上にある「한국어 · English · 日本語」から選んでください。選んだ言語はこの端末に保存され、ゲームがその言語で開き直します。まだ言語を選んだことのない端末なら、アドレスの末尾に ?lang=en(英語)や ?lang=ja(日本語)を付けて、その言語で開くこともできます。英語版と日本語版も、プロローグから最後の事件まで、すべてのシーンと画面の文言がその言語で表示されます。勝負のルール、スコア、ランキングは言語に関係なく同じです。</p>

<h2>データと個人情報</h2>
<h3>どんなデータがサーバーに送られますか？</h3>
<p>最初の画面の「データ保存の案内」にある「プレイテストデータの提供に同意」がオンのときは、事件の結果、選択の記録と応答時間、画面の言語、送信したフィードバック、エラー報告が、この端末のランダムな識別番号とともに研究用に保存され、${days}日後に削除されます。このチェックボックスは初回起動時にオンの状態で始まり、オフにするとその時点から送信しません。本ゲームはCookieや、広告・分析用のトラッキングツールを使用しません。詳しくは${link("privacy", "ja", "プライバシーポリシー")}をご覧ください。</p>
<h3>データを削除するには？</h3>
<p>この端末の進行は、ゲームの「リセット」で消せます。保存された進行、ランキング記録、復旧地点、エラー記録が消え、画面と音の設定、ツール図鑑、NEW GAME+の記録は残るので、すべて消すにはブラウザの設定でこのサイトのデータを削除してください。同意のチェックを外すと、まだ送信されていない記録もこの端末から削除します。すでにサーバーに送信された記録は、「データ保存の案内」と結果画面に表示される8桁のセッションコードを${mail}までお送りいただければ、探して削除し、10日以内に結果をお知らせします。オンライン保存のコピーは、「別の端末で続ける」パネルからすぐに削除できます。サーバーの記録は、特に請求がなくても${days}日後に自動で削除されます。</p>
`;

/* -------------------------------------------------------------- contact */

const CONTACT_KO = `
<p>「임계점: CRITICAL POINT」에 관한 문의, 오류 제보, 게시판 글 신고, 개인정보 열람·삭제 요청은 아래 이메일 한 곳에서 받습니다. 게임은 회원가입과 로그인이 없으므로 이메일이 개발자에게 연락하는 창구입니다.</p>

<h2>연락처</h2>
<ul>
<li>운영: 임계점 개발자</li>
<li>이메일: ${mail}</li>
</ul>
<p>답장을 받을 수 있는 이메일 주소로 보내 주세요. 게임은 이름을 받지 않으므로, 기록에 관한 요청에는 이름 대신 아래에 적은 코드가 필요합니다.</p>

<h2>답변까지 걸리는 시간</h2>
<p>개인정보 열람, 정정, 삭제, 처리 정지 요청은 ${link("privacy", "ko", "개인정보처리방침")}에 따라 해당 기록을 찾아 처리하고 10일 안에 결과를 알려 드립니다. 그 밖의 문의와 오류 제보는 받은 순서대로 읽고 답합니다. 같은 내용을 여러 번 보내지 않아도 됩니다.</p>

<h2>오류 제보</h2>
<p>화면이 멈추거나 진행이 이상하면 다음을 적어 보내 주세요. 같은 상황을 다시 만들 수 있으면 원인을 훨씬 빨리 찾을 수 있습니다.</p>
<ul>
<li>기기와 브라우저(예: 안드로이드 휴대폰의 크롬, 윈도우 컴퓨터의 엣지)</li>
<li>화면 방향(세로·가로)과 대략의 화면 크기</li>
<li>사건과 장면(브리핑 위에 보이는 사건 이름과 장소)</li>
<li>무엇을 눌렀고 무엇이 일어났는지, 그리고 기대한 것</li>
<li>「데이터 저장 안내」와 결과 화면에 보이는 8자리 세션 코드(있으면)</li>
</ul>
<p>플레이테스트 데이터 제공 동의가 켜져 있으면, 오류가 났을 때 오류 이름과 코드 위치, 글자 없이 요소 이름만 적은 화면 구조, 화면 크기, 오류가 난 사건과 장면이 오류 보고로 함께 저장됩니다. 세션 코드를 알려 주시면 그 보고를 찾아 함께 봅니다. 화면을 찍은 사진을 붙이면 더 좋지만, 사진에 실명이나 연락처가 보이지 않게 해 주세요. 연결이 끊긴 채로 아직 받지 못한 화면을 열면 「다시 시도」 안내가 나오는데, 이것은 오류가 아니므로 연결한 뒤 다시 시도해 주세요.</p>

<h2>게임 안에서 의견 보내기</h2>
<p>이메일 말고도, 사건이 끝난 뒤 리포트 화면의 「플레이테스트 피드백」에서 이해도와 고민 강도를 고르고 짧은 의견을 남길 수 있습니다. 플레이테스트 데이터 제공 동의가 켜져 있으면 이 피드백이 저장되어 게임의 난이도와 이야기를 고치는 데 쓰입니다. 피드백에는 답장을 보낼 수 없으므로 답이 필요한 문의는 이메일로 보내 주세요. 피드백에도 이메일에도 실명, 연락처, 회사명, 다른 사람의 개인정보는 적지 마세요.</p>

<h2>게시판 글 신고</h2>
<p>참가자 게시판의 글이 괴롭힘, 개인정보 노출, 광고나 도배 같은 문제를 담고 있다면 글마다 있는 「신고」 버튼을 눌러 주세요. 사유 넷(광고·도배, 욕설·괴롭힘, 개인정보 노출, 그 밖의 문제) 가운데 하나를 고르면 글 번호와 사유만 전달됩니다. 적는 칸은 없고, 신고한 사람은 글쓴이에게 알려지지 않습니다. 신고 수로 글이 저절로 내려가지는 않으며, 사람이 읽고 판단해 운영 원칙에 어긋나는 글을 숨깁니다. 자신의 개인정보가 드러난 글처럼 서둘러 내려야 하는 글은 그 글의 닉네임과 작성 시각을 적어 이메일로도 알려 주세요. 링크, 전화번호, 이메일 주소가 든 글은 처음부터 등록되지 않습니다. 게시판 글은 작성일로부터 ${days}일 뒤 자동으로 지워집니다.</p>

<h2>개인정보 열람·삭제 요청</h2>
<p>이용자는 언제든 자신의 기록을 열람, 정정, 삭제하거나 처리를 멈추도록 요청할 수 있습니다. 게임은 이름을 받지 않으므로 다음 중 해당하는 것을 함께 보내 주세요.</p>
<ul>
<li>플레이테스트 데이터: 「데이터 저장 안내」와 결과 화면에 보이는 8자리 세션 코드</li>
<li>온라인 저장: 이어하기 코드(사본은 「다른 기기에서 이어하기」 패널에서 직접 지울 수도 있습니다)</li>
<li>게시판 글: 그 글의 닉네임과 작성 시각</li>
</ul>
<p>요청 없이 바로 할 수 있는 것도 있습니다. 「데이터 저장 안내」의 동의 상자를 끄면 그때부터 기록을 보내지 않고, 아직 보내지 못한 기록도 이 기기에서 지웁니다. 서버의 기록은 요청하지 않아도 ${days}일 뒤 자동으로 삭제됩니다. 개인정보 침해 신고와 상담을 받는 기관은 ${link("privacy", "ko", "개인정보처리방침")}의 문의처 항목에 있습니다.</p>

<h2>그 밖의 안내</h2>
<p>게임 소개와 플레이 방법은 ${link("about", "ko", "게임 소개")}에, 저장·오프라인·랭킹·언어에 관한 답은 ${link("faq", "ko", "자주 묻는 질문")}에 있습니다. 이용 조건은 ${link("terms", "ko", "이용약관")}을 따릅니다.</p>
`;

const CONTACT_EN = `
<p>Questions about Critical Point, bug reports, reports of board posts, and requests to access or delete your data all go to the one email address below. The game has no sign-up or login, so email is the way to reach the developer.</p>

<h2>Address</h2>
<ul>
<li>Run by: the Critical Point developer</li>
<li>Email: ${mail}</li>
</ul>
<p>Please write from an address that can receive our reply. Because the game never asks for your name, a request about your records needs one of the codes listed below instead.</p>

<h2>How soon we reply</h2>
<p>Requests to access, correct or delete your data, or to stop its processing, are handled under the ${link("privacy", "en", "Privacy Policy")}: we find the records, act on them and reply within 10 days. Other questions and bug reports are read and answered in the order they arrive. There is no need to send the same message more than once.</p>

<h2>Reporting a bug</h2>
<p>If the screen freezes or progress goes wrong, please include the following. If we can make the same thing happen, we can find the cause much faster.</p>
<ul>
<li>Your device and browser (for example, Chrome on an Android phone, or Edge on a Windows computer)</li>
<li>The screen orientation (upright or sideways) and roughly how large the screen is</li>
<li>The case and scene (the case name and place shown above the briefing)</li>
<li>What you pressed, what happened, and what you expected</li>
<li>The 8-character session code shown in “Data storage” and on the result screen, if you have one</li>
</ul>
<p>When playtest data sharing is on, an error also stores an error report: the error's name and code location, the screen's structure as element names without any text, the screen size, and the case and scene where it happened. Send us your session code and we will look at that report too. A screenshot helps, but please make sure no real name or contact detail shows in it. If you open a screen not yet fetched while the connection is down, you will see a “try again” notice; that is not a bug, so connect and try again.</p>

<h2>Sending feedback in the game</h2>
<p>Besides email, you can rate how clear the case was and how hard you had to think, and leave a short comment, in “Playtest feedback” on the report screen after a case ends. When playtest data sharing is on, this feedback is stored and used to improve the game's difficulty and story. We cannot reply to feedback, so send anything that needs an answer by email. In feedback and in email alike, please don't write real names, contact details, company names or anyone else's personal information.</p>

<h2>Reporting a board post</h2>
<p>If a post on the player board contains harassment, someone's personal information, ads, spam or another problem, press the “Report” button on the post. Pick one of four reasons (Ads · spam, Abuse · bullying, Personal info, Other problem), and only the post's number and the reason are sent. There is no free text, and the writer is never told who reported. Posts are never taken down automatically by the number of reports; a person reads them and hides posts that break the board's rules. For a post that needs to come down quickly, such as one revealing your own personal information, also email us the post's nickname and the time it was posted. Posts with links, phone numbers or email addresses are rejected from the start. Board posts are deleted automatically ${days} days after posting.</p>

<h2>Requests to access or delete your data</h2>
<p>You can ask at any time to access, correct or delete your records, or to stop their processing. Because the game never asks for your name, please include whichever of these applies.</p>
<ul>
<li>Playtest data: the 8-character session code shown in “Data storage” and on the result screen</li>
<li>Online save: your continue code (you can also delete the copy yourself from the “Continue on another device” panel)</li>
<li>A board post: the post's nickname and the time it was posted</li>
</ul>
<p>Some things you can do right away without asking. Untick the consent box in “Data storage” and nothing more is sent from then on, and any records still waiting to be sent are cleared from your device. Records on the server are deleted automatically after ${days} days even if you don't ask. If you are in the EEA or the UK, you may also complain to your local data protection authority.</p>

<h2>More</h2>
<p>What the game is and how to play it are on the ${link("about", "en", "About")} page, and answers about saves, offline play, the ranking and languages are in the ${link("faq", "en", "FAQ")}. Playing the game is subject to the ${link("terms", "en", "Terms of Use")}.</p>
`;

const CONTACT_JA = `
<p>『臨界点: CRITICAL POINT』に関するお問い合わせ、不具合の報告、掲示板の投稿の通報、個人情報の閲覧・削除の請求は、下記のメールアドレス一か所で受け付けています。本ゲームには会員登録やログインがないため、メールが開発者への連絡窓口です。</p>

<h2>連絡先</h2>
<ul>
<li>運営: 臨界点開発者</li>
<li>メールアドレス: ${mail}</li>
</ul>
<p>返信を受け取れるメールアドレスからお送りください。本ゲームは名前を取得しないため、記録に関する請求には、名前の代わりに下記のコードが必要です。</p>

<h2>回答までの期間</h2>
<p>個人情報の閲覧、訂正、削除、処理の停止の請求は、${link("privacy", "ja", "プライバシーポリシー")}に従って該当する記録を探して対応し、10日以内に結果をお知らせします。そのほかのお問い合わせや不具合の報告は、届いた順に読んでお返事します。同じ内容を何度も送っていただく必要はありません。</p>

<h2>不具合の報告</h2>
<p>画面が止まったり、進行がおかしくなったりした場合は、次のことを書いてお送りください。同じ状況を再現できれば、原因をずっと早く見つけられます。</p>
<ul>
<li>端末とブラウザ(例: AndroidスマートフォンのChrome、WindowsパソコンのEdge)</li>
<li>画面の向き(縦・横)と、おおよその画面サイズ</li>
<li>事件とシーン(ブリーフィングの上に表示される事件名と場所)</li>
<li>何を押して何が起きたか、そして本来どうなるはずだったか</li>
<li>「データ保存の案内」と結果画面に表示される8桁のセッションコード(あれば)</li>
</ul>
<p>プレイテストデータの提供への同意がオンになっていると、エラーが起きたときに、エラーの名前とコードの位置、文字を含まず要素名だけを記した画面構造、画面サイズ、エラーが起きた事件とシーンが、エラー報告として一緒に保存されます。セッションコードをお知らせいただければ、その報告も探して確認します。画面のスクリーンショットがあるとさらに助かりますが、実名や連絡先が写らないようにしてください。接続が切れた状態でまだ受け取っていない画面を開くと再試行の案内が出ますが、これは不具合ではないので、接続してからもう一度お試しください。</p>

<h2>ゲーム内で意見を送る</h2>
<p>メールのほかに、事件が終わったあとのレポート画面にある「プレイテストのフィードバック」で、わかりやすさと悩んだ度合いを選び、短い意見を残すこともできます。プレイテストデータの提供への同意がオンのときは、このフィードバックが保存され、ゲームの難易度やストーリーの改善に使われます。フィードバックには返信できないため、回答が必要なお問い合わせはメールでお送りください。フィードバックにもメールにも、実名、連絡先、会社名、他人の個人情報は書かないでください。</p>

<h2>掲示板の投稿の通報</h2>
<p>参加者掲示板の投稿に、嫌がらせ、個人情報の露出、広告や連投などの問題がある場合は、投稿ごとにある「通報」ボタンを押してください。四つの理由(広告・連投、暴言・嫌がらせ、個人情報の露出、そのほかの問題)から一つを選ぶと、投稿の番号と理由だけが伝わります。自由記入欄はなく、通報した人が投稿者に知られることはありません。通報の数で投稿が自動的に削除されることはなく、運営者が読んで判断し、運営方針に反する投稿を非表示にします。ご自身の個人情報が出ている投稿のように急いで削除すべきものは、その投稿のニックネームと投稿時刻を書いて、メールでもお知らせください。リンク、電話番号、メールアドレスを含む投稿は、最初から登録されません。掲示板の投稿は、投稿日から${days}日後に自動で削除されます。</p>

<h2>個人情報の閲覧・削除の請求</h2>
<p>利用者はいつでも、自身の記録の閲覧、訂正、削除、処理の停止を請求できます。本ゲームは名前を取得しないため、次のうち該当するものを一緒にお送りください。</p>
<ul>
<li>プレイテストデータ: 「データ保存の案内」と結果画面に表示される8桁のセッションコード</li>
<li>オンライン保存: 続行コード(コピーは「別の端末で続ける」パネルから自分で削除することもできます)</li>
<li>掲示板の投稿: その投稿のニックネームと投稿時刻</li>
</ul>
<p>請求しなくてもすぐにできることもあります。「データ保存の案内」の同意のチェックを外すと、その時点から記録を送信せず、まだ送信されていない記録もこの端末から削除します。サーバーの記録は、請求がなくても${days}日後に自動で削除されます。個人情報侵害の申告・相談を受け付ける機関は、${link("privacy", "ja", "プライバシーポリシー")}のお問い合わせ先の項目にあります。</p>

<h2>そのほかのご案内</h2>
<p>ゲームの紹介と遊び方は${link("about", "ja", "ゲーム紹介")}に、セーブ・オフライン・ランキング・言語についての回答は${link("faq", "ja", "よくある質問")}にあります。ご利用の条件は${link("terms", "ja", "利用規約")}に従います。</p>
`;

const BODIES = {
  about: { ko: ABOUT_KO, en: ABOUT_EN, ja: ABOUT_JA },
  faq: { ko: FAQ_KO, en: FAQ_EN, ja: FAQ_JA },
  contact: { ko: CONTACT_KO, en: CONTACT_EN, ja: CONTACT_JA },
};

/** The kinds this file writes, in the order of the header. */
export const SITE_PAGE_KINDS = Object.keys(BODIES);

/** The three pages about the game in the three languages: `{ "about.html": "<!doctype html>...", "en/faq.html": ... }`. */
export function renderSitePages() {
  const pages = {};
  for (const kind of SITE_PAGE_KINDS) {
    for (const language of PAGE_LANGUAGES) {
      pages[pagePath(kind, language).slice(1)] = renderDocumentPage({
        kind,
        language,
        body: BODIES[kind][language],
        description: DESCRIPTION[kind][language],
      });
    }
  }
  return pages;
}

/**
 * The page's text as a reader sees it, for counting: the body between the
 * heading and the foot, tags out, entities read, no spaces.
 */
export function readableCharacters(html) {
  const body = /<\/h1>([\s\S]*)<footer>/.exec(String(html))?.[1] ?? "";
  return body
    .replace(/<[^>]+>/g, "")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, "").length;
}

/* ----------------------------------------------------- crawler's files */

const HTTPS_ORIGIN = /^https:\/\/[^/\s]+$/;

/**
 * The site's own address, or "" when the build has none: `SITE_URL` when set
 * (a custom domain), else `RENDER_EXTERNAL_URL`, which Render sets on every
 * build. A local or CI build has neither and keeps every address relative,
 * as the start page's canonical and hreflang links are.
 */
export function siteOrigin(env = process.env) {
  const origin = String(env.SITE_URL || env.RENDER_EXTERNAL_URL || "").trim().replace(/\/+$/, "");
  if (origin && !HTTPS_ORIGIN.test(origin)) throw new Error(`SITE_URL must be an https origin, got ${origin}`);
  return origin;
}

/**
 * A page with its canonical and hreflang links (and, on the start page, the
 * og:url, og:image and twitter:image) made absolute on `origin`. Search
 * engines read those as full addresses; the links a reader clicks stay
 * relative. Nothing changes without an origin.
 */
export function withAbsoluteSiteLinks(html, origin) {
  if (!origin) return html;
  return String(html)
    .replace(/(<meta\s+(?:property="og:(?:url|image)"|name="twitter:image")\s+content=")\//g, `$1${origin}/`)
    .replace(/(<link\s+rel="(?:canonical|alternate)"\s+(?:hreflang="[a-zA-Z-]+"\s+)?href=")\//g, `$1${origin}/`);
}

/**
 * Every plain page the build writes, the policy's six and these nine, keyed by path from the root without its slash.
 * `ads` is the build's ADSENSE_ADS=on: the policy then says the web has ads (AD_EDITS, legal-pages.mjs).
 */
export function renderStaticPages(origin = "", { ads = false } = {}) {
  const pages = { ...renderLegalPages({ ads }), ...renderSitePages() };
  return Object.fromEntries(Object.entries(pages).map(([file, html]) => [file, withAbsoluteSiteLinks(html, origin)]));
}

/**
 * /robots.txt: everything may be crawled, and where the sitemap is. A
 * sitemap is named by its full address, so a build with no origin leaves
 * that line out.
 */
export function robotsTxt(origin = "") {
  return `User-agent: *\nAllow: /\n${origin ? `\nSitemap: ${origin}/sitemap.xml\n` : ""}`;
}

/**
 * The sitemap's entries: the start page, whose English and Japanese are the
 * same address with `?lang=` (its hreflang links, index.html), and each of
 * the five pages in each language. Every entry names its three languages and
 * x-default (the Korean).
 */
export function sitemapEntries() {
  const index = { loc: gamePath("ko"), alternates: Object.fromEntries(PAGE_LANGUAGES.map((code) => [code, gamePath(code)])) };
  const pages = PAGE_KINDS.flatMap((kind) =>
    PAGE_LANGUAGES.map((language) => ({
      loc: pagePath(kind, language),
      alternates: Object.fromEntries(PAGE_LANGUAGES.map((code) => [code, pagePath(kind, code)])),
    })),
  );
  return [index, ...pages];
}

/**
 * /sitemap.xml, every entry dated `date` (the build's day, YYYY-MM-DD). The
 * addresses are absolute on `origin`; with none (a local or CI build) they
 * stay relative to the root, as every other address of such a build is.
 */
export function sitemapXml({ origin = "", date }) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(date))) throw new Error(`sitemap date must be YYYY-MM-DD, got ${date}`);
  const at = (path) => escapeHtml(`${origin}${path}`);
  const urls = sitemapEntries().map(({ loc, alternates }) => {
    const links = [...Object.entries(alternates), ["x-default", alternates.ko]]
      .map(([code, path]) => `    <xhtml:link rel="alternate" hreflang="${code}" href="${at(path)}"/>\n`)
      .join("");
    return `  <url>\n    <loc>${at(loc)}</loc>\n    <lastmod>${date}</lastmod>\n${links}  </url>\n`;
  });
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join("")}</urlset>\n`;
}

/** The files a crawler reads, beside the pages: `{ "robots.txt": ..., "sitemap.xml": ... }`. */
export function crawlerFiles({ origin = "", date }) {
  return { "robots.txt": robotsTxt(origin), "sitemap.xml": sitemapXml({ origin, date }) };
}
