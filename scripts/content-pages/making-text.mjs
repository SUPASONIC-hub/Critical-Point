/** The makers' story, in their own (plural) voice, Korean/English/Japanese. From README.md's 개발 노트 and docs/history.md. Rendered by scripts/content-pages/pages.mjs. */

export const MAKING_DESCRIPTION = {
  ko: "SUPASONIC과 ALICE가 「사람은 언제 똑똑해지는가」라는 질문 하나에서 쉰다섯 사건의 금융 미스터리 푸시 유어 럭 게임 임계점을 만들기까지의 이야기입니다.",
  en: "How SUPASONIC and ALICE turned one question, when does a person get smart, into CRITICAL POINT, a 55-case finance mystery built on push-your-luck.",
  ja: "SUPASONICとALICEが「人はいつ賢くなるのか」という一つの問いから、55の事件からなる金融ミステリーのプッシュ・ユア・ラック・ゲーム『臨界点』を作るまでの物語です。",
};

export const MAKING_BODY = {
  ko: `<p>임계점은 질문 하나에서 시작했습니다. 작업 폴더의 이름이 지금도 그 질문입니다. <strong>창의성은 언제 가장 크게 터지는가.</strong> 이 글은 그 질문이 2026년 8월부터 11월까지 쉰다섯 개의 사건을 가진 게임이 되기까지를 우리 두 사람이 함께 적은 기록입니다.</p>
<h2>질문이 생긴 날</h2>
<p>2026년 8월 7일, 우리는 이케이도 준의 은행 소설 《아키라와 아키라》와 《한자와 나오키》를 두고 긴 문답을 나눴습니다. 주인공들의 지성은 어디서 왔을까. 고난이 사람을 똑똑하게 만든다는 설명은 받아들이기 어려웠습니다. 우리가 보기에 생각을 깊게 만드는 것은 누군가를 돕고 싶다는 마음에서 나오는 집념이었고, 다른 이야기에서는 복수심이 같은 일을 하고 있었습니다. 그리고 그런 선의가 오래 유지된다는 것부터 의심했습니다.</p>
<p>에세이도, 원작을 빌린 2차 창작도 아닌 게임으로 만들기로 하자 질문이 한 줄로 줄었습니다. <strong>"얼마나 똑똑한가"가 아니라 "언제 똑똑해지는가."</strong> 같은 날 쓴 첫 기획 초안은 이 게임이 IQ 테스트도, 성격 분류도, 정답 맞히기도 아니라고 먼저 적었고, 원작의 인물과 회사와 사건은 하나도 가져오지 않기로 했습니다. 플레이어가 받을 보상은 이것이었습니다. 선택지만 고르던 사람이 어느 순간 스스로 판을 다시 짜고 싶어지는 것.</p>
<h2>왜 금융 미스터리인가</h2>
<p>그날 가장 오래 남은 생각은 사람이 돈을 쓰면 돈의 흐름이라는 흔적이 남는다는 것이었습니다. 아무리 비정한 자본이라도 움직이는 것은 사람이고, 그 사람을 움직이는 것은 사람에 대한 감정입니다. 9월 16일에는 이야기의 기준을 한 줄로 정했습니다. <strong>기준은 오로지 재미와 이야기의 개연성.</strong> 어려운 금융 용어는 처음 나오는 자리마다 괄호로 풀기로 했습니다.</p>
<h2>왜 푸시 유어 럭인가</h2>
<p>8월 13일의 첫 판은 사건 여섯 개짜리 텍스트 게임이었습니다. 첫 커밋 15분 안에 데이터 제공 동의와 익명 플레이 기록을 붙였습니다. 처음부터 다른 사람의 플레이 기록에서 답을 찾을 생각이었기 때문입니다.</p>
<p>9월 초에 우리는 막혔습니다. 개선할 때마다 패널이 늘어, 휴대폰에서 결정 하나를 하려면 화면을 4.7장 내려야 했습니다. 9월 10일, 우리는 핵심 규칙을 통째로 갈아엎었습니다. 걸수록 보상이 커지지만 선을 넘으면 전부 잃는 푸시 유어 럭, 심장 박동, 그리고 선택이 다음 판의 규칙을 부수는 구조입니다.</p>
<p>이유는 질문에 있었습니다. 압박이 없으면 생각은 느슨해지고, 압박에 짓눌리면 얕아집니다. 우리가 재고 싶었던 것은 그 사이, 판돈이 커지고 시계가 줄어드는데도 아직 생각할 여유가 남은 구간입니다. 그 전 화면은 터질 확률을 퍼센트로 보여 줘서 0%가 아닐 때까지 누르는 것이 최선이었습니다. 9월 14일의 새 테이블에서는 벽이 보이지 않고, 오차가 있는 심박만 그것을 가리킵니다. 숫자를 감추자 비로소 긴장이 생겼습니다. 이 교체로 코드 9,377줄이 빠졌고, 우리는 지난 모양에 미련을 두지 않기로 했습니다.</p>
<h2>단편집에서 하나의 사슬로</h2>
<p>9월 16일에 직접 플레이해 보니, 서로 무관한 사건 모음은 다음 사건을 궁금하게 만들지 못했습니다. 그날 우리는 모든 사건을 대출 한 건에 매달았습니다. KD은행이 물류 플랫폼 플로우온에 내준 310억 원 대출입니다. 플레이어가 맡는 분석관은 3년 전 그 대출에 혼자 반대 의견을 썼던 사람이 되었습니다.</p>
<p>시즌은 그 뒤 여드레 동안 아홉 번 길어졌고, 9월 23일에 3년 전을 다루는 프롤로그 다섯 장이 붙어 <strong>쉰다섯 개의 사건</strong>이 되었습니다. 장면마다 장소와 질문을 밝히고, 웃음과 슬픔이 쉬어 가는 막간을 넣고, 출퇴근길 같은 짧은 틈에 끊어서 하다가 다른 기기에서 이어 할 수 있게 했습니다.</p>
<h2>플레이 기록으로 다듬은 테이블</h2>
<p>테이블의 숫자는 플레이한 사람의 말과 기록, 그리고 수많은 시즌을 대신 치르는 시뮬레이션을 보고 고쳤습니다.</p>
<ul>
<li><strong>박자를 뺐습니다.</strong> 심박에 맞춰 누르는 박자는 생각을 재겠다는 목적과 어긋나, 들어온 지 26일 만에 같은 방향의 판단을 지킬 때 판돈이 커지는 논리 콤보로 바꿨습니다.</li>
<li><strong>읽는 시간을 돌려줬습니다.</strong> 읽는 시간을 판단 시계에서 떼어 냈고, 10월 13일에는 읽기 시계를 초당 16자·최대 50초에서 초당 10자·최대 95초로 늘렸습니다.</li>
<li><strong>무너짐의 원인을 찾았습니다.</strong> 10월 22일의 측정에서 테이블을 잘 다루는 손은 벽에 닿는 횟수를 3분의 1로 줄였지만 시즌 붕괴는 약 4%p만 바꿨습니다. 붕괴를 좌우한 것은 카드를 고르는 성향이었습니다.</li>
</ul>
<p>규칙이 많아 초반에 지친다는 지적을 받아들여, 지금은 프롤로그와 초반 사건에 걸쳐 규칙이 한 단계씩 열립니다.</p>
<h2>누구나 끝까지: 접근성과 세 언어</h2>
<p>우리의 원칙 하나는 <strong>플레이어가 읽고 생각할 시간을 게임이 빼앗지 않는다</strong>는 것입니다. 그래서 벽이 멀어지고 시계가 느려지는 스토리 모드, 테이블 시간 1.5배·2배, 번쩍임과 흔들림 줄이기, 소리를 꺼도 보이는 심박 계기, 화면 낭독기가 읽는 이름을 두었습니다.</p>
<p>10월 26일에는 영어와 일본어를 열었습니다. 처음에는 사건 10까지만 번역했지만, 그 언어를 고른 사람에게 반쪽짜리 경험이라고 보고 10월 28일에 시즌 전체를 열기로 했습니다. 기계 초벌에서 시작해 감수로 다듬고 있고. 길어진 카드 문구는 하나하나 줄여 360픽셀 폭 휴대폰에서도 넘치지 않게 했습니다.</p>
<h2>얼굴이 있는 사람들</h2>
<p>장면에서 말하는 사람은 87명이고, 10월 21일까지 그중 66명은 실루엣이었습니다. 우리는 실루엣으로 남는 인물이 없게 하기로 했습니다. 대부분은 무료 스톡 사진을 같은 톤으로 보정했고, 악역과 미성년자 열한 명에게는 실제 사람의 얼굴을 쓰지 않으려고 실존하지 않는 사람의 생성 사진을 썼습니다. 악역도 일부러 악해 보이게 고르지 않고 평범한 얼굴을 씁니다. 한나 아렌트가 말한 악의 평범성처럼, 평범한 얼굴이 저지르는 잘못이 더 현실적이고 더 무섭기 때문입니다.</p>
<h2>무료 플랜 위에서</h2>
<p>우리는 돈을 내는 서버 없이 이 게임을 만들었습니다. 무료 정적 호스팅과 Supabase 무료 플랜이 전부이고, 그 제약을 설계의 출발점으로 삼았습니다.</p>
<ul>
<li><strong>게임은 브라우저 안에서 완결됩니다.</strong> 테이블, 저장, 로컬 랭킹이 모두 브라우저에서 돌아, 원격이 꺼져도 게임은 그대로입니다.</li>
<li><strong>검증은 데이터베이스 안에 있습니다.</strong> 입력 검증, 행 단위 보안, 요청 한도, 하루 데이터 상한을 데이터베이스에 두어, 500MB 무료 용량이 넘치지 않고 누구도 남의 기록을 바꿀 수 없습니다.</li>
<li><strong>바이트를 셉니다.</strong> 첫 화면은 약 434KB이고, 사건은 필요할 때만 받으며, 한 번 연 게임은 연결 없이도 열립니다.</li>
</ul>
<h2>검사가 지키는 약속</h2>
<p>우리에게는 QA 팀이 없습니다. 그래서 정적 검사 28개와 유닛 테스트 1,950개 남짓, 실제 브라우저와 휴대폰 크기 화면의 테스트가 변경마다 돕니다. 모든 검사를 통과한 버전만 배포됩니다. 그러면서 배운 것이 <strong>초록불을 믿지 않는다</strong>는 것입니다. 한 번도 배포하지 않으면서 성공을 알리던 자동 배포, 프롤로그를 건너뛰던 쉬운 말 검사가 있었습니다. 고친 것을 되돌렸을 때 검사가 실패해야 고친 것입니다.</p>
<h2>우리가 배운 것</h2>
<p>석 달 동안 방향을 바꾼 것은 대개 계획서가 아니라 직접 플레이한 사람의 말이었습니다. 설명이 부족하다, 시간에 쫓긴다. 그 말을 원인으로 옮기고, 원인을 고쳤습니다. 더한 만큼 정리했고, 데이터는 동의한 만큼만 이름 없이 모았고, 모르는 것은 모른다고 적었습니다. 질문이 처음 모양을 갖춘 8월 7일의 문답부터 코드의 많은 부분까지 AI 도구와 함께 작업했지만, 이야기의 사실과 규칙의 방향은 언제나 우리 둘이 정했습니다.</p>
<blockquote>"얼마나 똑똑한가"가 아니라 "언제 똑똑해지는가."</blockquote>
<p>이 게임의 가설은 강한 감정이 지성을 방해하는 것이 아니라 방향을 정한다는 것입니다. 여러분의 임계점이 어디쯤인지, 테이블 위에서 확인해 보세요.</p>`,

  en: `<p>CRITICAL POINT began as a question, and the project folder still carries it as its name: <strong>when does creativity burst?</strong> This is the record, written by the two of us, of how that question became a game of fifty-five cases between August and November 2026.</p>
<h2>The day the question appeared</h2>
<p>On 7 August 2026 we had a long exchange about two banking novels by Jun Ikeido, Akira and Akira and Hanzawa Naoki. Where did their heroes' intelligence come from? The usual answer, that hardship makes people sharp, did not convince us. As we saw it, what deepened their thinking was a stubborn drive born from wanting to help someone; in the other story, revenge did the same work. And we doubted that such goodwill could last.</p>
<p>Once we chose to make a game, not an essay and not fan fiction, the question shrank to one line: <strong>not how smart are you, but when do you become smart.</strong> The first design draft, written that same day, began by saying the game is not an IQ test, not a personality quiz and not a hunt for right answers, and that it would take no characters, companies or events from the novels. The reward for the player was this: the moment when someone who has only been picking options suddenly wants to redraw the board.</p>
<h2>Why a finance mystery</h2>
<p>The thought that stayed longest that day was that when people spend money, money leaves a trail. However cold capital may be, people move it, and what moves people is how they feel about other people. On 16 September we set the standard for the story in one line: <strong>the only measure is fun and plausibility.</strong> Hard finance terms are explained in brackets where they first appear.</p>
<h2>Why push-your-luck</h2>
<p>The first build, on 13 August, was a text game with six cases. Within fifteen minutes of the first commit it had data consent and anonymous play logs, because from the start we meant to look for the answer in other people's play.</p>
<p>By early September we were stuck. Every round of improvement had added a panel, and on a phone a single decision meant scrolling through 4.7 screens. On 10 September we tore out the core rules and put in push-your-luck, where the reward grows the further you push but crossing the line loses everything, along with a heartbeat and choices that break the rules of the next round.</p>
<p>The reason lay in the question. With no pressure, thinking goes slack; crushed by pressure, it goes shallow. We wanted to measure the space in between, where the stakes rise and the clock shrinks but there is still room to think. The old screen showed the odds of busting as a percentage, so the best play was to press until it stopped reading 0%. On the new table of 14 September the wall is invisible, and only a heartbeat with some error points toward it. Hiding the number is what finally created tension. That rebuild removed 9,377 lines of code, and we decided not to cling to old shapes.</p>
<h2>From anthology to one chain</h2>
<p>Playing it ourselves on 16 September, we saw that unrelated cases gave no reason to wonder about the next one. That day we hung every case on a single loan: 31 billion won lent by KD Bank to the logistics platform FlowOn. The analyst the player becomes is the person who, three years earlier, wrote the lone objection to that loan.</p>
<p>Over the next eight days the season grew nine times, and on 23 September a five-chapter prologue set three years earlier made it <strong>fifty-five cases</strong>. Every scene began to state where it is and what it asks, interludes of laughter and sadness gave the tension a rest, and a season became something you can play in short pieces, like a commute, and continue on another device.</p>
<h2>A table tuned by play data</h2>
<p>The table's numbers were tuned from what players said and did, and from simulations that play many seasons for us.</p>
<ul>
<li><strong>We took out the rhythm.</strong> Presses timed to the heartbeat worked against measuring thought, so after 26 days they became a logic combo that raises the stakes when you hold one direction of judgement.</li>
<li><strong>We gave reading time back.</strong> Reading came off the decision clock, and on 13 October the reading clock went from 16 characters a second with a 50-second cap to 10 characters with a 95-second cap.</li>
<li><strong>We found what causes collapse.</strong> Measured on 22 October, a skilled hand cut busts to a third but changed the rate of collapsed seasons by only about four points. What decided collapse was the tendency of which cards a player picks.</li>
</ul>
<p>We also accepted that the rules tired people early, so they now open one step at a time across the prologue and early cases.</p>
<h2>Everyone to the end: accessibility and three languages</h2>
<p>One principle we kept is that <strong>the game does not steal the player's time to read and think.</strong> So there is a story mode where the wall moves away and the clock slows, table time at 1.5x or 2x, reduced flashes and shaking, a heartbeat gauge that works with the sound off, and names a screen reader can read.</p>
<p>On 26 October we opened English and Japanese. At first only cases up to case 10 were translated, but that was half an experience for anyone who chose those languages, so on 28 October we opened the whole season. The translations began as machine drafts and are being refined through review. Longer card texts were trimmed one by one so nothing overflows on a 360-pixel phone.</p>
<h2>People with faces</h2>
<p>Eighty-seven people speak in the scenes, and until 21 October sixty-six of them were silhouettes. We decided no character would stay one. Most portraits are free stock photos graded to one tone; for the eleven villains and minors we used generated photos of people who do not exist, so no real person's face plays those parts. Villains are not chosen to look sinister; they get ordinary faces. As in Hannah Arendt's banality of evil, wrongs done by ordinary-looking people are more real and more frightening.</p>
<h2>Built on free plans</h2>
<p>We made this game without paying for a server. Free static hosting and the Supabase free plan are all of it, and we treated those limits as the starting point of the design.</p>
<ul>
<li><strong>The game is complete inside the browser.</strong> The table, saves and local rankings all run there, so the game keeps going even if the remote side is down.</li>
<li><strong>Validation lives in the database.</strong> Input validation, row-level security, request limits and a daily data cap sit inside the database, so the 500 MB free tier does not overflow and nobody can change anyone else's records.</li>
<li><strong>We count bytes.</strong> The first screen is about 434 KB, cases load only when needed, and once opened the game works offline.</li>
</ul>
<h2>Promises kept by checks</h2>
<p>We have no QA team, so 28 static checks, more than 1,950 unit tests and tests in real browsers at phone sizes run on every change, and only a version that passes them all goes live. Along the way we learned <strong>not to trust a green light.</strong> There was an automatic deploy that reported success without ever deploying, and a plain-language check that skipped the prologue. A fix counts only if undoing it makes a check fail.</p>
<h2>What we learned</h2>
<p>Over three months, what changed our direction was usually not a plan but the words of someone who had played: the explanation is too thin, the clock is chasing us. We turned those words into causes and fixed the causes. We tidied up as much as we added, collected data only with consent and without names, and wrote down what we did not know. From the 7 August conversation where the question first took shape to much of the code, we worked alongside AI tools, but the facts of the story and the direction of the rules were always decided by the two of us.</p>
<blockquote>Not how smart are you, but when do you become smart.</blockquote>
<p>The game's hypothesis is that strong feelings do not get in the way of intelligence; they give it a direction. Find out where your critical point is, at the table.</p>`,

  ja: `<p>『臨界点』は一つの問いから始まりました。作業フォルダの名前は今もその問いのままです。<strong>創造性はいつ最も大きく弾けるのか。</strong>この文章は、その問いが2026年8月から11月までに55の事件を持つゲームになるまでを、私たち二人が一緒に書いた記録です。</p>
<h2>問いが生まれた日</h2>
<p>2026年8月7日、私たちは池井戸潤さんの銀行小説『アキラとあきら』と『半沢直樹』シリーズについて長い問答を交わしました。主人公たちの知性はどこから来たのか。苦難が人を賢くするという説明には納得できませんでした。私たちの見方では、思考を深くしていたのは誰かを助けたいという気持ちから生まれる執念であり、もう一方の物語では復讐心が同じ働きをしていました。そして、そうした善意が長く続くということ自体を疑っていました。</p>
<p>エッセイでも、原作を借りた二次創作でもなく、ゲームにすると決めると、問いは一行に縮まりました。<strong>「どれだけ賢いか」ではなく「いつ賢くなるか」。</strong>同じ日に書いた最初の企画書は、このゲームがIQテストでも、性格診断でも、正解当てでもないと最初に記し、原作の人物や会社や事件は一つも借りないと決めています。プレイヤーが受け取る報酬はこうでした。選択肢を選ぶだけだった人が、ある瞬間、自分で盤面を組み直したくなること。</p>
<h2>なぜ金融ミステリーなのか</h2>
<p>その日いちばん長く残った考えは、人がお金を使うとお金の流れという痕跡が残る、というものでした。どれほど非情な資本でも動かすのは人であり、その人を動かすのは人に対する感情です。9月16日には物語の基準を一行で決めました。<strong>基準はただ面白さと物語の説得力。</strong>難しい金融用語は初めて出てくる場所ごとに括弧で説明します。</p>
<h2>なぜプッシュ・ユア・ラックなのか</h2>
<p>8月13日の最初の版は、事件が六つのテキストゲームでした。最初のコミットから15分以内にデータ提供の同意と匿名のプレイ記録を付けました。最初から、他の人のプレイ記録の中に答えを探すつもりだったからです。</p>
<p>9月の初め、私たちは行き詰まりました。改善のたびにパネルが増え、スマートフォンでは一つの決定のために画面4.7枚分をスクロールしなければなりませんでした。9月10日、私たちは中心のルールを丸ごと作り替えました。賭けるほど報酬は大きくなるが、線を越えるとすべてを失うプッシュ・ユア・ラック、心拍、そして選択が次の勝負のルールを壊す構造です。</p>
<p>理由は問いの中にありました。プレッシャーがなければ思考は緩み、押しつぶされれば浅くなります。私たちが測りたかったのはその間、賭け金が膨らみ時計が縮んでも、まだ考える余裕が残っている区間です。以前の画面は破裂の確率をパーセントで表示していたので、0%でなくなるまで押し続けるのが最善でした。9月14日の新しいテーブルでは壁は見えず、誤差のある心拍だけがそれを指し示します。数字を隠したことで、ようやく緊張が生まれました。この作り替えでコード9,377行が消え、私たちは過去の形にこだわらないと決めました。</p>
<h2>短編集から一本の鎖へ</h2>
<p>9月16日に自分たちでプレイしてみると、互いに無関係な事件の寄せ集めでは次の事件が気になりませんでした。その日、私たちはすべての事件を一件の融資につなげました。KD銀行が物流プラットフォームのフロウオンに貸し出した310億ウォンの融資です。プレイヤーが演じる分析官は、3年前その融資にただ一人反対意見を書いた人物になりました。</p>
<p>シーズンはその後の8日間で9回長くなり、9月23日に3年前を描くプロローグ5章が加わって<strong>55の事件</strong>になりました。場面ごとに場所と問いを示し、笑いと悲しみで一息つける幕間を入れ、通勤のような短い時間に区切って遊び、別の端末で続けられるようにしました。</p>
<h2>プレイ記録で磨いたテーブル</h2>
<p>テーブルの数字は、プレイした人の言葉と記録、そして私たちの代わりに多くのシーズンを遊ぶシミュレーションを見て直しました。</p>
<ul>
<li><strong>拍子を外しました。</strong>心拍に合わせて押す拍子は思考を測るという目的とずれていたため、26日で、同じ方向の判断を守ると賭け金が大きくなるロジックコンボに替えました。</li>
<li><strong>読む時間を返しました。</strong>読む時間を判断の時計から切り離し、10月13日には読書時計を毎秒16文字・最大50秒から毎秒10文字・最大95秒へ延ばしました。</li>
<li><strong>崩壊の原因を見つけました。</strong>10月22日の測定では、テーブルの扱いがうまい手は壁に当たる回数を3分の1に減らしましたが、シーズンの崩壊は約4ポイントしか変えませんでした。崩壊を左右したのはカードを選ぶ傾向でした。</li>
</ul>
<p>ルールが多く序盤で疲れるという指摘も受け入れ、今はプロローグと序盤の事件にかけてルールが一段階ずつ開きます。</p>
<h2>誰もが最後まで:アクセシビリティと三つの言語</h2>
<p>私たちの原則の一つは、<strong>プレイヤーが読んで考える時間をゲームが奪わない</strong>ことです。そのため、壁が遠のき時計がゆっくりになるストーリーモード、テーブル時間1.5倍・2倍、点滅と揺れの軽減、音を消しても見える心拍メーター、スクリーンリーダーが読める名前を用意しました。</p>
<p>10月26日には英語と日本語を公開しました。最初は事件10までだけを翻訳しましたが、その言語を選んだ人には半分だけの体験だと考え、10月28日にシーズン全体を開きました。翻訳は機械による下訳から始めて校閲で磨いているところで。長くなったカードの文言は一つずつ縮めて、幅360ピクセルのスマートフォンでもはみ出さないようにしました。</p>
<h2>顔のある人々</h2>
<p>場面で話す人物は87人で、10月21日まではそのうち66人がシルエットでした。私たちはシルエットのまま残る人物をなくすと決めました。ほとんどは無料のストック写真を同じトーンに補正したもので、悪役と未成年の11人には、実在の人の顔を使わないよう、実在しない人物の生成写真を使いました。悪役も、わざと悪そうに見える顔は選ばず、普通の顔を使います。ハンナ・アーレントの言う悪の凡庸さのように、普通の顔が犯す過ちのほうが現実的で、より恐ろしいからです。</p>
<h2>無料プランの上で</h2>
<p>私たちはお金のかかるサーバーなしでこのゲームを作りました。無料の静的ホスティングとSupabaseの無料プランがすべてで、その制約を設計の出発点にしました。</p>
<ul>
<li><strong>ゲームはブラウザの中で完結します。</strong>テーブル、セーブ、ローカルランキングがすべてブラウザで動くので、リモートが止まってもゲームはそのままです。</li>
<li><strong>検証はデータベースの中にあります。</strong>入力検証、行単位のセキュリティ、リクエスト制限、1日のデータ上限をデータベースに置き、500MBの無料容量はあふれず、誰も他人の記録を書き換えられません。</li>
<li><strong>バイトを数えます。</strong>最初の画面は約434KBで、事件は必要なときだけ受け取り、一度開いたゲームは接続がなくても開きます。</li>
</ul>
<h2>検査が守る約束</h2>
<p>私たちにはQAチームがありません。そのため静的検査28個、ユニットテスト1,950個あまり、実際のブラウザとスマートフォンの画面サイズで動くテストが変更のたびに走り、すべてを通ったバージョンだけが公開されます。その中で学んだのが、<strong>緑のランプを信じない</strong>ことです。一度も公開していないのに成功を知らせていた自動公開や、プロローグを読み飛ばしていたやさしい言葉の検査がありました。直したものを元に戻したときに検査が失敗しなければ、直したことにはなりません。</p>
<h2>私たちが学んだこと</h2>
<p>3か月の間、方向を変えたのはたいてい計画書ではなく、実際にプレイした人の言葉でした。説明が足りない、時間に追われる。その言葉を原因に置き換え、原因を直しました。足した分だけ片付け、データは同意した分だけ名前なしで集め、分からないことは分からないと書きました。問いが初めて形になった8月7日の問答からコードの多くの部分まで、私たちはAIツールと一緒に作業しましたが、物語の事実とルールの方向は、いつも私たち二人が決めました。</p>
<blockquote>「どれだけ賢いか」ではなく「いつ賢くなるか」。</blockquote>
<p>このゲームの仮説は、強い感情は知性の邪魔をするのではなく、その向きを決めるというものです。あなたの臨界点がどのあたりにあるのか、テーブルの上で確かめてみてください。</p>`,
};
