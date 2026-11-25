/** How-to-play guide body, Korean/English/Japanese (scripts/content-pages/pages.mjs renders it). Every rule and number read from src/gauntlet and src/copy on 2026-11-09; the table rules of RULES_MARK 5 (G1~G7, N26) added 2026-11-20, and G5's acts 1, 2, 4, 6 and 8 (RULES_MARK 6, src/gauntlet/actTwists.js) on 2026-11-23. */

export const GUIDE_DESCRIPTION = {
  ko: "임계점의 테이블 규칙을 실제 수치로 풀어 쓴 안내서입니다. 열기와 벽, 심박, 다음 판을 바꾸는 규칙, 논리 콤보, 도구, 버스트 점수와 리그를 설명합니다.",
  en: "Every rule of the Critical Point table with its real numbers: Heat and the Wall, the heartbeat, next-hand rules, Logic Combo, tools, Burst Score and leagues.",
  ja: "『臨界点』のテーブルのルールを実際の数値で解説するガイドです。熱と壁、心拍、次の勝負を変えるルール、ロジックコンボ、ツール、スコアとリーグ。",
};

export const GUIDE_BODY = {
  ko: `<p>이 안내서는 「임계점: CRITICAL POINT」의 규칙을 게임 안의 실제 수치로 풀어 씁니다. 테이블의 숫자 하나하나가 무엇을 뜻하는지, 한 번의 판단이 다음 판에 어떤 흔적을 남기는지를 다룹니다. 이야기는 프롤로그의 출발점 이상 다루지 않으니 처음 하는 사람도 안심하고 읽어도 됩니다.</p>

<h2>한 사건의 흐름</h2>
<p>시즌은 프롤로그 다섯 사건과 본편 쉰 사건, 모두 쉰다섯 사건입니다. 사건은 여러 장면으로 이어지고, 장면은 늘 같은 순서로 지나갑니다. 브리핑을 읽고, 테이블에서 카드 한 장을 건 뒤 밀어붙이거나 확정하고, 판정 화면에서 그 결정이 무엇을 바꿨는지 봅니다. 이 테이블 한 번을 「판」이라고 부릅니다. 확정해서 번 몫은 사건의 판돈에 쌓이고, 사건의 마지막 장면이 닫혀야 금고로 옮겨집니다.</p>

<h2>브리핑 화면 읽기</h2>
<p>브리핑에는 장소와 시간, 말하는 사람, 접어 둔 「사건 파일」, 그리고 장면의 질문이 담긴 「당신의 판단」 상자가 있습니다. 장면마다 위험 압력 낮추기, 판 바꾸기 시도 같은 챌린지가 하나씩 걸려 있고, 이것을 맞히면 점수와 그 사건의 숨은 기록에 함께 도움이 됩니다.</p>
<p>읽는 시간은 본문과 규칙 설명의 길이에 따라 12초에서 94초 사이로 정해지고, 다 되면 판이 저절로 열립니다. 시계를 누르면 멈춥니다. 브리핑 아래의 카드를 누르면 그 카드를 건 채로 판이 열립니다. 「이월」이나 「이번 판의 규칙이 바뀌었다」가 보이면 꼭 읽으십시오. 지난 결정 때문에 이번 판의 벽, 시계, 카드가 달라졌다는 뜻입니다. 읽는 시간의 70% 이상을 브리핑에서 보냈다면, 판에서 빨리 골라도 즉답으로 치지 않습니다.</p>

<h2>테이블 해부</h2>
<h3>카드와 칩</h3>
<p>선택지 하나가 카드 한 장입니다. 카드에는 칩, 가장 크게 태우는 자원, 그리고 꼬리표 두 개가 붙습니다. 하나는 사람 쪽인지 자리 쪽인지를 나타내는 방향이고, 다른 하나는 위험 다루기, 꼼꼼히 확인하기, 끝까지 버티기, 판 바꾸기 가운데 하나인 생각 유형입니다. 이득이 큰 카드일수록 칩이 많습니다. 한 자원을 8 이상 태우는 카드에는 「균열 후보」 표시가 붙습니다.</p>
<h3>와일드 카드 「판을 다시 짠다」</h3>
<p>판을 바꿀 길이 있는 장면에는 이 카드가 끼어 있습니다. 기본 칩은 24이고, 남은 시간 6과 피로 5를 쓰는 대신 믿음과 공정함을 3씩 줍니다. 방향은 사람 쪽으로 칩니다. 이 카드로 벽에 닿지 않고 확정하면 그 사건의 숨은 경로가 열리고, BUST로 끝나면 열리지 않습니다.</p>
<h3>열기와 벽 구간</h3>
<p>열기는 0에서 100까지입니다. 「밀어붙인다」 한 번에 열기가 7에서 15 오르고, 배율은 열기 11마다 두 배가 됩니다. 열기 0에서 ×1, 22에서 ×4, 33에서 ×8, 60에서 약 ×44입니다. 게이지에는 벽이 있을 수 있는 구간이 그려지는데, 기본 판에서는 56에서 92 사이이고 벽은 그 안의 한 지점에 숨어 있습니다. 30과 60의 눈금은 COLD FEET 봉인이 풀리는 열기와 HEAT DEBT가 시작되는 열기입니다.</p>
<p>「현재 위험」 칸은 「벽까지 최소 N」, 「밀면 벽 사정권」, 「벽 구간 안」 가운데 하나를 보여 줍니다. 「안전선 ×N」은 벽이 어디 있든 닿을 수 없는 밀기가 N번 남았다는 뜻입니다.</p>
<h3>심박</h3>
<p>벽을 듣는 것은 심박뿐입니다. 열기가 벽에서 44 안으로 들어오면 가까워질수록 빨라지고, 최대 190까지 오릅니다. 다만 심박이 듣는 벽은 실제와 최대 18까지 어긋나고, 열기가 높거나 시계가 거의 다 되면 벽과 상관없이 빨라집니다. BUST 뒤에는 벽이 실제로 어디 있었는지와 심박이 어디로 들었는지가 함께 나오니, 귀를 맞추는 데 쓰십시오.</p>
<h3>조회</h3>
<p>프롤로그 03부터 「조회」로 믿음 1과 시간 3초를 내고 벽 구간을 20칸 폭으로 좁힐 수 있습니다. 판마다 한 번이고, 벽이 그 한가운데 있다는 뜻은 아닙니다. 한 번 더 누르면 시간 3초로 14칸까지 좁힙니다. 이 둘째 조회의 믿음은 한 사건 안에서 2, 2, 3, 3, 4, 4…로 오르고, 버튼에 이번 값이 나옵니다. 첫 조회도 한 사건 안에서 처음 세 번만 믿음 1이고, 그 뒤로 2, 2, 3, 3…으로 오릅니다. 우리는 「이번 판은 심박만 믿고 간다」도 고를 만한 선택이 되기를 바랐습니다.</p>
<h3>판돈, 확정, BUST</h3>
<p>「확정」을 누르면 칩 × 배율 × 콤보와 LOCK 보너스가 사건의 판돈에 더해집니다. 판돈은 사건이 닫힐 때까지 금고 밖에 있으므로, 사건 도중 한 번의 BUST가 그때까지의 판돈을 모두 지웁니다. 사건의 마지막 장면이거나 열기가 이미 벽 구간 안이라면, 확정을 약 0.6초 꾹 누르거나 3초 안에 「한 번 더」를 눌러야 합니다.</p>
<p>BUST는 밀어붙여 벽에 닿거나, 시계가 올린 열기가 벽에 닿거나, 시간이 다 될 때 납니다. 판돈은 0이 되고, 카드는 이득 없이 비용만 치르며, 믿음 6, 공정함 6, 남은 시간 4를 잃고 피로가 8 오릅니다. 이야기는 다음 장면을 건너뜁니다(프롤로그 01·02는 빼고). 금고는 건드리지 않습니다.</p>
<h3>테이블 시계</h3>
<p>판의 시간은 기본 45초이고, 열기 45부터 40초, 열기 65부터 35초로 줄며, 12초보다 짧아지지는 않습니다. 판이 열리고 4초가 지나면 시계가 스스로 열기를 올립니다. 초당 0.5이고, 밀 때마다 12%씩 빨라지며 「시계 열기 ×N」으로 표시됩니다.</p>
<h3>LOCK과 자세</h3>
<p>프롤로그 04부터 카드를 건 뒤 LOCK을 누를 수 있습니다. 한 번에 1.5초가 들고 충전이 쌓여, 카드의 자원 효과와 칩 배율이 커집니다(칩 배율은 1.5배까지). 프롤로그 05부터 자세를 고릅니다. STRIKE는 배율을 가장 빨리 키우고, 열기 60 이상에서 확정하면 상한이 1.55배로 오릅니다. STEADY는 한 번 민 뒤의 LOCK마다 열기를 1씩 식힙니다. EXPOSE는 자원 효과를 키우고, 가득 충전해 확정하면 감사가 차지 않고 적발되지 않으며 다음 판의 칩이 1.3배가 됩니다. 충전 70 이상으로 확정하면 자세가 다음 판으로 이어지고, 한 자세로 이렇게 세 번 확정하면 시즌 숙련이 생깁니다.</p>
<p>들고 온 연속이 이미 LOCK 상한(1.5배)을 채운 판에서는 LOCK이 닫힙니다. 더할 것이 없기 때문이고, 누르면 그 이유가 나옵니다. 시계가 짧은 판, 곧 SHORT CLOCK(이번 주의 규칙과 사건 09)과 7막 「청문회」에서는 LOCK 한 번이 1.15배인 약 1.7초를 씁니다. 버튼에 이번 값이 나오니, 충전 없이 빨리 끊는 판도 생각해 보십시오.</p>

<h2>판단이 남기는 흔적</h2>
<p>한 번의 결정은 다음 판의 규칙을 바꿉니다. 아래 규칙은 괄호 속 사건에서 열리고, 사건 05부터는 모두 켜지며, NEW GAME+는 처음부터 모두 켜져 있습니다.</p>
<dl>
<dt>BLACKOUT (프롤로그 02)</dt><dd>BUST 다음 판은 카드의 칩과 소모가 가려지고 벽 구간이 6 가까워집니다.</dd>
<dt>AFTERSHOCK (사건 04)</dt><dd>BUST 다음 판은 열기 22에서 시작합니다.</dd>
<dt>SILENCE (사건 05)</dt><dd>시간이 다 돼 BUST하면 다음 판은 심박이 벽을 가리키지 않고, 시간이 30초입니다.</dd>
<dt>COLD FEET (프롤로그 03)</dt><dd>한 번도 밀지 않고 확정하면 다음 판의 칩이 가장 많은 카드가 열기 30을 넘을 때까지 봉인되고, 칩이 0.6배가 됩니다.</dd>
<dt>HEAT DEBT (프롤로그 03)</dt><dd>열기 60 이상에서 확정하면 다음 판은 그 열기의 3분의 1을 안고, 12초 짧게 시작합니다.</dd>
<dt>FRACTURE (프롤로그 04)</dt><dd>확정이든 BUST든, 카드가 한 자원을 8 이상 태웠다면 다음 판에서 그 자원을 태우는 카드는 1.5배로 청구됩니다.</dd>
<dt>OVERCLOCK (사건 01)</dt><dd>×4 이상 확정을 두 번 잇달아 하면 다음 판의 칩이 2배가 되지만 밀 때 오르는 열기도 커집니다. ×4 이상 확정이 이어지는 동안 계속됩니다.</dd>
<dt>감사, AUDIT (사건 02)</dt><dd>한 번 이상 밀고 열기 40 미만에서 확정하면 감사가 한 칸 차고, 60 이상에서 확정하면 두 칸 줄어듭니다. 사건이 닫힐 때 4칸이 차 있으면 금고로 갈 몫의 4분의 1을 잃습니다. 한도까지 한 칸 남았을 때 지금 확정하면 감사가 차는 열기면 판에 「낮게 끊으면 감사」가 뜨고, 감사로 잃은 사건의 결과에는 「왜」 한 줄이 붙습니다.</dd>
<dt>연결, CASCADE (사건 03)</dt><dd>한 자원을 8 이상 태운 카드로 확정하면 연결이 생겨, 2~4판 뒤의 한 판에서 벽 구간이 6 가까워집니다. 다음 사건으로는 가장 최근 연결 하나만 넘어갑니다.</dd>
</dl>
<p>사건이 닫히면 REBOOT가 흔적을 지웁니다. 각 막의 마지막 사건은 「고점 판」이라 벽이 5 가까워지고 칩이 1.25배가 됩니다.</p>
<dl>
<dt>결재 판</dt><dd>사건의 마지막 판입니다. 판돈이 1.5배이고, 벽이 있을 수 있는 가장 가까운 칸 하나가 보입니다. 결과 장부에 크게 남습니다.</dd>
<dt>숨 고르기</dt><dd>BUST 바로 다음 판에서, 첫 밀기와 첫 조회 전에 한 번 누를 수 있습니다. 시계 2초를 쓰고 열기를 11 내리며(지난 판이 열기 60 이상에서 터졌다면 14) 벽을 3 뒤로 보냅니다. 버튼 옆에 「지난 판 N에서 터짐」이 나옵니다. 드래프트를 넘길 때의 「숨 고르기」와는 다른, 판 위의 버튼입니다.</dd>
</dl>

<h2>논리 콤보</h2>
<p>프롤로그 02부터 같은 방향(사람 쪽 또는 자리 쪽)을 고르면 논리 콤보가 쌓입니다. 세 번째로 잇달아 고를 때부터 한 단계씩 오르고, 한 단계마다 판돈이 6.25% 커져 콤보 10에서 ×1.6이 됩니다. 판이 닫힌 열기는 30 미만, 30~59, 60 이상의 세 구간으로 나뉘는데, 직전 판이 그 전 판보다 높은 구간에서 닫혔다면 방향을 바꿔도 전환으로 인정되어 콤보가 오릅니다. 열기가 오르지 않았는데 방향을 바꾸면 콤보는 반으로 줄고, BUST가 나면 0이 됩니다. 콤보와 LOCK을 합친 보너스는 ×1.6을 넘지 않습니다.</p>
<p><strong>눈에 띔.</strong> 같은 방향을 다섯 번째부터 이어 고르면 눈에 띔이 1씩 쌓입니다(최대 6). 눈에 띔이 있는 동안 열기 50 밑에서 확정하면 단계마다 5%, 최대 30% 확률로 적발됩니다. 적발된 판은 판돈이 없고 콤보가 반으로 줍니다. 방향을 바꾸면 눈에 띔이 풀립니다.</p>
<p>콤보는 벽을 움직이지 않으니, 콤보가 길다고 한 번 더 밀 이유가 되지는 않습니다. 리포트의 「관점 전환」은 생각 유형을 고르게 쓸수록 오르므로, 방향은 지키고 유형은 바꾸십시오.</p>

<h2>도구</h2>
<p>프롤로그 05부터 사건이 닫히면 다음 사건의 첫 테이블에서 드래프트가 열립니다. 시계가 멈춘 동안 도구 세 개 가운데 하나를 고릅니다. 도구는 다섯 개까지 들고, 다 차면 하나를 내려놓습니다. 아무것도 고르지 않으면 「숨 고르기」가 되어 첫 판의 시간이 10초 늘고 벽이 3 멀어집니다. 고르기 전에 금고에서 1,500을 내면 「다시 뽑기」를 드래프트마다 한 번, 12,000을 내면 「하나 더」를 시즌에 한 번 할 수 있습니다. 다시 뽑기는 싸니 셋이 약하면 다시 뽑으십시오.</p>
<p>도구마다 조건이 있고, 조건이 맞은 확정은 판돈이 크게 오릅니다. 「방열판」은 열기 75 이상에서 확정하면 +60%, 「감사실 연줄」은 한 번 이상 밀고 열기 50 밑에서 확정하면 +80%(눈에 띔에도 적발되지 않음), 「냉혈」은 BUST 다음 판을 AFTERSHOCK 없이 열기 0에서 시작하게 하고 벽을 2 물리며 그 판의 확정을 +100%로 만듭니다. 「도윤하의 현장 메모」는 같은 쪽 콤보 5 이상에서 +25%, 「메트로놈」은 방향을 바꾼 판에서 +70%, 「임경수의 사본」은 BLACKOUT 판에서 +70%, 「차지원의 1면」은 OVERCLOCK 판에서 +20%입니다. 그러니 내 플레이에 맞는 조건을 고르십시오. 조건을 채워야 풀리는 도구도 있습니다. 논리 콤보 8을 달성하면 BUST해도 콤보가 남는 「앙코르」(콤보 8 이상 확정 +15%)가, 판돈 5,000 이상을 벽에 잃으면 사건마다 한 번 판돈의 3분의 1을 지키는 「보험」이 풀립니다. 조건이 맞은 도구가 한 판에 둘 이상 겹치면 배수는 합쳐 1.6배에서 멈춥니다. 혼자서 그보다 큰 도구(감사실 연줄 1.8배, 냉혈 2배)는 그 값까지 받으니, 두 번째 도구가 첫 도구의 몫을 깎지는 않습니다.</p>

<h2>여섯 가지 자원</h2>
<p>남은 시간, 현금, 믿음, 공정함은 높을수록 좋고, 사람 피해와 피로는 오를수록 손해입니다. 사건은 남은 시간 72, 현금 100, 믿음 50, 공정함 50, 사람 피해 0, 피로 10에서 출발하되 앞 사건의 결과만큼 달라집니다. S 랭크 뒤에는 믿음 +4와 공정함 +3, C 랭크 뒤에는 공정함 −2와 피로 +4를 안고 시작하고, 시즌 후반의 사건일수록 더 지친 채 열립니다. 카드의 이득은 열기에 따라 커져 열기 60에서 1.9배, 100에서 2.5배가 되지만, 비용은 커지지 않습니다.</p>

<h2>이번 주의 규칙</h2>
<p>대체로 두 주에 한 번, 그 주에만 서는 규칙이 있습니다. 주는 한국 시간 월요일 0시에 바뀌고, 시즌을 시작할 때 이번 주의 규칙으로 할지(이번 주 순위), 하지 않을지(평소 순위) 고릅니다.</p>
<ul>
<li><strong>NEAR WALL (벽이 가깝다)</strong>: 벽 구간이 열기 4만큼 앞당겨집니다.</li>
<li><strong>HEAVY FRACTURE (균열이 깊다)</strong>: FRACTURE가 1.75배로 청구합니다.</li>
<li><strong>SHORT CLOCK (시간이 짧다)</strong>: 판마다 8초 짧고, 모든 카드의 칩이 1.25배입니다.</li>
<li><strong>CRISIS WEEK (위기 주간)</strong>: 벽 구간이 열기 3만큼 앞당겨지고, 모든 카드의 칩이 1.2배입니다.</li>
<li><strong>IDLE MONEY (묵힌 돈은 준다)</strong>: 사건이 닫힐 때마다 금고에 남아 있던 돈의 2%가 사라집니다. 도구를 고를 때 쓴 돈은 줄지 않습니다.</li>
<li><strong>MARKET SHOCK (시장 충격)</strong>: 사건마다 한 번, 4번째 판에 벽 구간이 열기 4만큼 앞당겨지고, 그때까지 쌓은 판돈이 최대 20% 오르거나 내립니다.</li>
</ul>
<p>시즌은 시작한 주의 규칙을 끝까지 지니고, 따로 순위가 쌓입니다. 스토리 모드에는 붙지 않습니다.</p>
<p><strong>이번 사건만.</strong> 몇몇 사건은 그 사건 동안만 규칙이 하나 섭니다. 사건 09는 SHORT CLOCK, 11은 NEAR WALL, 14는 HEAVY FRACTURE, 16은 CRISIS WEEK입니다. 3막(사건 13~18)은 「합병」으로 칩 1.35배에 벽 구간이 열기 3 앞당겨지고, 5막(사건 25~30)은 「흩어진 자리」로 벽 구간이 양쪽으로 4씩 넓어지며(칩은 그대로), 7막(사건 37~42)은 「청문회」로 판마다 시간이 30% 짧고 칩이 1.2배입니다. 규칙이 벽 구간을 당긴 판에는 열기 막대에 원래 구간 자리가 눈금으로 남습니다. 사건 14·16은 그 사건의 규칙이 막의 규칙보다 먼저입니다. 이번 주의 규칙으로 시작한 시즌과 스토리 모드에는 이 규칙들이 없습니다.</p>
<p><strong>나머지 막의 규칙.</strong> 우리는 1·2·4·6·8막에도 그 막의 이야기를 판의 규칙 하나로 옮겼습니다. 이 다섯은 판이 닫힐 때 내가 한 일을 읽으니, 이번 판만이 아니라 다음 판까지 생각하고 확정하십시오. 브리핑의 「이번 사건만」 패널에 그 사건의 규칙이 나옵니다.</p>
<dl>
<dt>떠넘겨진 손실 (1막, 사건 04~06)</dt><dd>판돈이 걸린 첫 BUST에도 판돈의 3분의 1이 남습니다. 대신 그 판의 사람 피해가 3 더 오릅니다. 보험을 들었다면 보험이 먼저 쓰이고, 둘을 합쳐 한 사건에 한 번만 지켜 줍니다.</dd>
<dt>뒤늦은 청구서 (2막, 사건 10)</dt><dd>열기 60 이상에서 확정하면 HEAT DEBT가 열기의 3분의 1이 아니라 4분의 3을 안고 다음 판을 시작하게 합니다(방열판을 들었다면 방열판의 값). 60 밑에서 확정하면 모든 카드의 칩이 1.25배입니다. 크게 확정할지, 깨끗하게 챙길지를 고르는 사건입니다.</dd>
<dt>학습된 벽 (4막, 사건 20·22·23)</dt><dd>판이 내가 확정한 열기를 배웁니다. 다음 판의 벽 구간은 그 열기보다 10 아래부터 18 위까지(폭은 34 이상)로 서되, 구간의 가운데가 원래 구간의 가운데보다 아래로 내려가지는 않습니다. 이렇게 선 판의 조회는 처음부터 14칸으로 좁히고, 한 번뿐입니다. BUST 다음 판은 평소 구간입니다.</dd>
<dt>진술 고정 (6막, 사건 32~35)</dt><dd>사건에서 처음 확정한 자세가 사건 끝까지 남고 바꿀 수 없습니다. 대신 확정할 때마다 충전이 모자라도 그 자세가 다음 판으로 이어집니다. 시즌 숙련은 평소처럼 충전 70 이상의 확정만 셉니다.</dd>
<dt>실명 서명 (8막, 사건 44·46·48·49)</dt><dd>첫 판 전에 브리핑에서 서명 방식을 고릅니다. 「이름만 쓴다」는 모든 카드의 칩이 1.25배이고 벽 구간이 1~3 앞당겨지며, 「조건을 단다」는 벽 구간이 3 물러서고 칩이 0.9배입니다. 고르지 않으면 조건을 단 것으로 칩니다.</dd>
</dl>
<p>이 다섯 규칙도 이번 주의 규칙으로 시작한 시즌과 스토리 모드에는 없습니다.</p>
<p>어느 주에 어떤 규칙이 서는지는 <a href="/weekly.html">주간 규칙 달력</a>에 미리 적어 둡니다.</p>
<p><strong>서명란의 값.</strong> 8막 「실명 서명」의 「이름만 쓴다」가 벽 구간을 앞당기는 폭은 사건마다 1~3으로 다릅니다. 서명란이 고르기 전에 이번 사건의 값을 먼저 보여 주고, 사건 49는 늘 3입니다. 우리는 같은 사람도 사건마다 서명을 다시 고민하게 하고 싶었습니다.</p>

<h2>리포트와 버스트 점수</h2>
<p>리포트는 사건마다 얼마나 벌었는지가 아니라 어떻게 판단했는지를 0~100점으로 매깁니다.</p>
<ul>
<li><strong>기준 유지</strong> (약 22%): 열기가 올라도 같은 방향을 지켰는지.</li>
<li><strong>판 읽기</strong> (20%): 벽이 보이는 사람이 같은 판에서 벌었을 몫에 견준 내 몫.</li>
<li><strong>관점 전환</strong> (16%): 네 가지 생각 유형을 고르게 썼는지. 두 유형만으로는 만점에 닿지 않습니다.</li>
<li><strong>구조 재설계</strong> (16%): 판을 다시 짜고, 숨은 경로를 열고, 챌린지를 맞히고, 숨은 기록을 찾은 정도.</li>
<li><strong>압박 대응</strong> (약 13%): 위험 압력을 낮추고, 치솟은 압력을 되돌린 흔적.</li>
<li><strong>생각 리듬</strong> (약 6%): 판이 열리고 결정하기까지의 시간. 8~28초가 만점입니다.</li>
</ul>
<p>챌린지를 연달아 맞힌 몫이 약 6% 더해집니다. <strong>즉답 패널티</strong>는 판을 다시 짜지도, 브리핑을 다 읽지도 않고 2초 안에 고른 결정마다 5점씩, 최대 18점을 깎습니다. 랭크는 88점 이상 S, 72점 이상 A, 52점 이상 B, 그 아래 C입니다.</p>

<h2>랭킹과 리그</h2>
<p>사건은 버스트 점수로, 시즌은 사건 점수의 평균으로 순위가 매겨집니다. 사건을 다시 해도 순위에는 처음 닫은 기록이 남으니, 첫 도전이 진짜입니다. 리그는 점수를 얻은 방식으로 나뉩니다.</p>
<ul>
<li><strong>REFRAME LEAGUE</strong>: 판을 한 번 이상 다시 짰고, 구조 재설계가 압박 대응 이상.</li>
<li><strong>RISK LEAGUE</strong>: 압박 대응이 구조 재설계보다 12점 이상 높음.</li>
<li><strong>SYSTEM LEAGUE</strong>: 그 밖에 구조 재설계가 55점 이상.</li>
<li><strong>FIELD LEAGUE</strong>: 나머지 모두.</li>
</ul>
<p>스토리 모드로 연 사건이 있는 시즌은 공개 랭킹에 오르지 않습니다.</p>
<p>2026년 11월 26일(목) 규칙 개편과 함께 공개 랭킹을 한 번 비웁니다. 명예의 전당 표는 그대로 남으며, 시작 화면에도 11월 16일부터 같은 안내가 나옵니다.</p>

<h2>시즌의 끝</h2>
<p>결말은 아홉 가지이고, 시즌 전체를 읽어 정해집니다. 사건이 닫힐 때마다의 믿음, 공정함, 현금의 평균, 사건당 평균 사람 피해, BUST한 판의 비율, 찾은 숨은 기록의 비율, 판을 다시 짜 숨은 경로를 연 비율, 압력이 얼마나 높게 이어졌는지, 그리고 마지막 사건의 결정입니다. 사람 피해가 사건당 평균 20 이상이거나, 판의 20% 이상에서 BUST하면서 사람 피해도 평균 10 이상이면 시즌은 버티지 못한 것으로 읽힙니다. BUST 없이 높은 배율을 지켰거나 콤보를 아주 길게 이었거나 사건당 금고를 넉넉히 쌓은 시즌은, 기록을 묻는 결말의 문턱이 조금 낮아집니다. 나머지는 직접 찾아보십시오.</p>

<h2>편의 설정과 키보드</h2>
<p>「스토리 모드」는 벽을 88~98로 옮기고, 시계를 2배 이상 늦추며, BLACKOUT부터 연결까지 아홉 규칙을 끄고, BUST해도 장면을 건너뛰지 않게 합니다. 「테이블 시간」은 시계를 1.5배나 2배로 늦추고, 「읽기 시계 자동 넘김 끄기」는 브리핑이 저절로 넘어가지 않게 합니다.</p>
<ul>
<li>브리핑: Space, Enter, W로 판을 열고, 숫자 키로 그 카드를 건 채 엽니다.</li>
<li>테이블: 1~9로 카드 걸기(와일드 카드는 마지막 카드 다음 번호), Space나 W로 밀기, Enter로 확정(꾹 눌러야 할 때는 누르고 있기), E는 LOCK, Q는 자세 바꾸기, R은 조회, S는 안전선까지 밀기.</li>
<li>드래프트: 1~9로 고르기, Esc는 건너뛰기, R은 다시 뽑기(1,500), B는 하나 더(시즌에 한 번).</li>
<li>P는 저장, Shift+P는 저장 후 나가기. 결과 화면에서 R은 그 사건 다시 하기, N은 다음 사건.</li>
</ul>

<h2>처음 하는 사람을 위한 조언</h2>
<ol>
<li><strong>한 번은 미십시오.</strong> 「안전선 ×N」 안의 밀기는 벽에 닿지 않고, 밀지 않으면 COLD FEET가 옵니다.</li>
<li><strong>판돈이 쌓일수록 조심하십시오.</strong> BUST는 사건의 판돈 전부를 가져가니, 사건 후반의 한 번 더는 앞의 모든 판을 건 도박입니다.</li>
<li><strong>시계를 다 쓰지 마십시오.</strong> 시간 초과는 BUST에 SILENCE까지 붙습니다. 낮은 열기라도 확정하는 편이 낫습니다.</li>
<li><strong>열기 40~59를 기억하십시오.</strong> 사건 02부터 이 구간의 확정은 감사도 채우지 않고 HEAT DEBT도 부르지 않습니다.</li>
<li><strong>방향은 지키고 유형은 바꾸십시오.</strong> 콤보와 관점 전환을 함께 올립니다. 눈에 띔이 쌓였다면 열기 50 이상에서 확정하거나 방향을 한 번 바꾸십시오.</li>
<li><strong>브리핑을 끝까지 읽으십시오.</strong> 바뀐 규칙이 거기 있고, 다 읽으면 즉답 패널티도 피합니다.</li>
<li><strong>BUST를 공부하십시오.</strong> 벽의 실제 위치와 심박이 들은 위치를 견주다 보면 귀가 빨리 트입니다.</li>
</ol>`,

  en: `<p>This guide walks through the rules of Critical Point with the game’s real numbers: what each figure on the table means, and how one call leaves its mark on the next hand. It covers nothing of the story beyond the prologue’s setup, so it is safe to read before you play.</p>

<h2>How a case flows</h2>
<p>A season is 55 cases, five in the prologue and fifty in the main story. Each case is a run of scenes, and every scene goes the same way: read the briefing, play one card at the table, push or commit, then see in the reveal what your decision changed. One visit to the table is a hand. What you earn by committing piles up in the case’s stake, which moves into the Vault only when the case’s last scene closes.</p>

<h2>Reading the briefing</h2>
<p>The briefing shows the place and time, who is speaking, a folded “Case File” and the “Your Call” box with the scene’s question. Each scene also carries a challenge, such as lowering risk pressure or trying a reframe; meeting it helps your score and your chance at the case’s hidden record.</p>
<p>The reading time runs from 12 to 94 seconds, set by the length of the text and its rule notes, and the table opens by itself when it ends. Press the clock to pause it. Press a card under the briefing to open the table with that card staked. If you see “Carried over” or “this hand’s rules have changed”, read it: your last decision changed this hand’s Wall, clock or cards. And if you spent at least 70% of the reading time on the page, a fast pick at the table is not counted as an instant answer.</p>

<h2>Anatomy of the table</h2>
<h3>Cards and chips</h3>
<p>Each choice is a card. It shows its chips, the resource it burns most, and two tags: its side, People or Position, and its way of thinking: Handle Risk, Double-Check, Hold Out or Change the Game. Bigger gains mean more chips. A card that burns 8 or more of one resource is marked “Fracture candidate”.</p>
<h3>The wild card, “Reframe the Table”</h3>
<p>Scenes with a way to change the game hold this card. It pays 24 chips before Heat, costs 6 Time left and 5 Fatigue, and gives 3 Trust and 3 Fairness. It counts as the People side. Commit it without hitting the Wall and the case’s hidden route opens; a BUST leaves the route shut.</p>
<h3>Heat and the Wall band</h3>
<p>Heat runs from 0 to 100. Each “Push” adds 7 to 15, and the multiplier doubles every 11 Heat: ×1 at 0, ×4 at 22, ×8 at 33, about ×44 at 60. The gauge draws the band the Wall can be in, 56 to 92 on a plain hand, and the Wall hides at one point inside it. The ticks at 30 and 60 mark where a COLD FEET seal opens and where HEAT DEBT starts.</p>
<p>“Current risk” reads “Wall at least N away”, “A push can reach the Wall” or “Inside the Wall band”. “Safe ×N” counts the pushes that cannot reach the Wall wherever it is.</p>
<h3>The heartbeat</h3>
<p>Only the heartbeat listens for the Wall. Within 44 Heat of it, the beat speeds up as you close in, up to 190. But the Wall it hears can be off by up to 18, and high Heat or a nearly empty clock make it race anyway. After a BUST the game shows where the Wall was and where the heartbeat heard it, so use that to tune your ear.</p>
<h3>Scout</h3>
<p>From Prologue 03, “Scout” narrows the Wall band to 20 wide for 1 Trust and 3 seconds, once per hand. The Wall is not necessarily in the middle of it. Press again to narrow it to 14 for 3 more seconds. Within a case this second look costs 2, 2, 3, 3, 4, 4… Trust, and the button shows this time’s price. The first look climbs too: within a case only the first three cost 1 Trust, then 2, 2, 3, 3… Trust. We wanted “this hand I trust the heartbeat alone” to be a choice worth making.</p>
<h3>Stake, Commit and BUST</h3>
<p>“Commit” adds chips × multiplier × your combo and LOCK bonus to the case’s stake. That stake sits outside the Vault until the case closes, so one BUST anywhere in the case wipes all of it. In a case’s last scene, or once Heat is inside the band, Commit must be held for about 0.6 seconds or pressed again (“Once more”) within 3 seconds.</p>
<p>You BUST by pushing into the Wall, letting the clock’s Heat creep into it, or running out of time. The stake drops to zero, the card pays its costs without its gains, and you lose 6 Trust, 6 Fairness and 4 Time left and gain 8 Fatigue. The story skips the next scene (except in Prologues 01 and 02). The Vault is never touched.</p>
<h3>The table clock</h3>
<p>A hand has 45 seconds, cut to 40 from Heat 45 and to 35 from Heat 65, never below 12. Four seconds after the table opens, the clock starts adding Heat by itself, 0.5 a second, 12% faster for each push, shown as “Clock heat ×N”.</p>
<h3>LOCK and Stances</h3>
<p>From Prologue 04 you can press LOCK after staking a card. Each press costs 1.5 seconds and builds charge, which grows the card’s resource effects and the chip multiplier, up to ×1.5. From Prologue 05 you pick a Stance: STRIKE grows the multiplier fastest, and committed at Heat 60 or more it lifts the cap to ×1.55. STEADY cools Heat by 1 with each LOCK after a push. EXPOSE boosts resource effects, and a fully charged EXPOSE commit fills no Audit box, can’t be caught, and makes the next hand’s chips ×1.3. Commit with a charge of 70 or more and the Stance carries into the next hand; three such commits in one Stance earn its season mastery.</p>
<p>On a hand where the streak you carried in already fills LOCK’s ×1.5 cap, LOCK is shut: it would add nothing, and pressing it tells you why. On a short clock, in SHORT CLOCK (the Rule of the Week, and Case 09) and in Act 7’s “The Hearing”, each LOCK press takes 1.15 times as long, about 1.7 seconds. The button shows the price, so think about a hand you close fast without charging.</p>

<h2>The marks your calls leave</h2>
<p>A decision changes the next hand’s rules. Each rule below opens in the case in brackets; from Case 05 all of them are on, and NEW GAME+ has them all from the start.</p>
<dl>
<dt>BLACKOUT (Prologue 02)</dt><dd>After a BUST, the cards’ chips and costs are hidden and the Wall band comes 6 closer.</dd>
<dt>AFTERSHOCK (Case 04)</dt><dd>After a BUST, the next hand starts at Heat 22.</dd>
<dt>SILENCE (Case 05)</dt><dd>After a BUST by running out of time, the heartbeat stops pointing at the Wall and the next hand has 30 seconds.</dd>
<dt>COLD FEET (Prologue 03)</dt><dd>Commit without a single push and the next hand seals its card with the most chips until Heat passes 30, with chips at ×0.6.</dd>
<dt>HEAT DEBT (Prologue 03)</dt><dd>Commit at Heat 60 or more and the next hand starts with a third of that Heat and 12 seconds less.</dd>
<dt>FRACTURE (Prologue 04)</dt><dd>If the card just burned 8 or more of one resource, commit or BUST, cards that burn it next hand are charged ×1.5.</dd>
<dt>OVERCLOCK (Case 01)</dt><dd>Two commits in a row at ×4 or more double the next hand’s chips, but each push adds more Heat. It lasts while the ×4 commits continue.</dd>
<dt>AUDIT (Case 02)</dt><dd>Commit below Heat 40 after at least one push and an Audit box fills; commit at 60 or more and two boxes clear. Four full boxes when the case closes cost a quarter of the share bound for the Vault. One box from the limit, if committing now would fill a box, the table shows “Low cash = audit”, and a case that lost to the audit gets a “Why” line on its result.</dd>
<dt>CASCADE (Case 03)</dt><dd>Commit a card that burns 8 or more of one resource and you make a link: one hand 2 to 4 hands later has its Wall band 6 closer. Only the newest link carries into the next case.</dd>
</dl>
<p>REBOOT clears these marks when a case closes. The last case of each act is a “Peak hand” case, with the Wall 5 closer and chips ×1.25.</p>
<dl>
<dt>Sign-off hand</dt><dd>The case’s last hand. The stake is ×1.5, and the nearest cell the Wall can be on is shown. The result ledger draws it large.</dd>
<dt>Catch breath</dt><dd>On the hand right after a BUST, once, before the first push or Scout: spend 2 seconds of clock to lower Heat by 11 (by 14 if the last hand burst at Heat 60 or more) and move the Wall back 3. “Last BUST at N” shows beside the button.</dd>
</dl>

<h2>Logic Combo</h2>
<p>From Prologue 02, picking the same side (People or Position) builds your Logic Combo. It rises one step from the third pick in a row, and each step adds 6.25% to the stake, up to ×1.6 at a combo of 10. Every hand closes in a Heat tier: under 30, 30 to 59, or 60 and up. If your last hand closed in a higher tier than the one before it, a change of side counts as a switch and still raises the combo. Change side without the Heat rising and the combo halves; BUST and it drops to 0. Combo and LOCK together never pay more than ×1.6.</p>
<p><strong>Noticed.</strong> From the fifth pick in a row on the same side, Noticed builds by 1 (up to 6). While you are Noticed, a commit under Heat 50 can be caught, 5% per point and 30% at most. A caught hand pays no stake and halves the combo. Changing side clears Noticed.</p>
<p>The combo never moves the Wall, so a long combo is no reason for one more push. The report’s “Perspective shifts” score rewards spreading your ways of thinking, so hold your side and vary your thinking.</p>

<h2>Tools</h2>
<p>From Prologue 05, each closed case is followed by a draft at the next case’s first table: pick one of three tools while the clock waits. You carry up to five, and when you are full you put one down. Pick nothing to “catch your breath”: the first hand gets 10 more seconds and the Wall moves 3 farther. Before you pick, “Reroll” costs 1,500 from the Vault, once per draft, and “One more” costs 12,000, once a Season. Rerolls are cheap: reroll a weak three.</p>
<p>Each tool has a condition, and a commit that meets it raises the stake a lot. “Heat Sink” pays +60% on a commit at Heat 75 or more; “Audit Contact” +80% when you push at least once and commit under Heat 50 (and Noticed never gets you caught); “Cold Blood” starts the hand after a BUST at Heat 0 with no AFTERSHOCK and the Wall 2 further, and pays +100% on that hand. “Do Yoonha’s Field Notes” pays +25% at a same-side combo of 5 or more, “Metronome” +70% on a hand where you switched sides, “Lim Kyungsoo’s Copy” +70% on a BLACKOUT hand and “Cha Jiwon’s Front Page” +20% on an OVERCLOCK hand. So pick the condition that fits how you play. Some tools unlock through feats: a Logic Combo of 8 opens “Encore”, which keeps your combo through a BUST (+15% on a commit at combo 8 or more), and losing a stake of 5,000 or more to the Wall opens “Insurance”, which saves a third of the stake once per case. When two or more tools meet their conditions on the same hand, their boosts together stop at ×1.6. A single tool worth more than that (Audit Contact ×1.8, Cold Blood ×2) keeps its own, so a second tool never takes from the first.</p>

<h2>The six resources</h2>
<p>Time left, Cash, Trust and Fairness are better high; Human cost and Fatigue hurt as they rise. A case starts from Time left 72, Cash 100, Trust 50, Fairness 50, Human cost 0 and Fatigue 10, shifted by your last case: after an S rank you start with Trust +4 and Fairness +3, after a C with Fairness −2 and Fatigue +4, and cases late in the season open more worn down. A card’s gains grow with Heat, ×1.9 at 60 and ×2.5 at 100, but its costs never do.</p>

<h2>Rule of the Week</h2>
<p>About one week in two brings an extra rule. Weeks turn at midnight on Monday, Korea time, and when you start a season you choose to play with the Rule of the Week (this week’s ranking) or without it (usual ranking).</p>
<ul>
<li><strong>NEAR WALL (The Wall is closer)</strong>: the Wall band stands 4 Heat earlier.</li>
<li><strong>HEAVY FRACTURE (The cracks run deep)</strong>: FRACTURE charges ×1.75.</li>
<li><strong>SHORT CLOCK (Time is short)</strong>: every hand has 8 seconds less, and every card’s chips are ×1.25.</li>
<li><strong>CRISIS WEEK (Crisis week)</strong>: the Wall band stands 3 Heat earlier, and every card’s chips are ×1.2.</li>
<li><strong>IDLE MONEY (Idle money shrinks)</strong>: each time a case closes, 2% of what sat in the Vault through it is gone. Money spent at the tool draft doesn’t shrink.</li>
<li><strong>MARKET SHOCK (Market shock)</strong>: once in every case, on hand 4, the Wall band stands 4 Heat earlier and the stake stacked so far moves up or down by as much as 20%.</li>
</ul>
<p>A season keeps the rule of the week it started in until it ends, on a ranking of its own. Story Mode never gets one.</p>
<p><strong>This case only.</strong> Some cases set a rule for themselves alone: Case 09 SHORT CLOCK, 11 NEAR WALL, 14 HEAVY FRACTURE and 16 CRISIS WEEK. Act 3 (Cases 13 to 18) is “The Merger”, chips ×1.35 with the Wall band 3 Heat earlier; Act 5 (Cases 25 to 30) is “Scattered Desks”, the Wall band 4 wider on each side (chips unchanged); Act 7 (Cases 37 to 42) is “The Hearing”, 30% less time each hand with chips ×1.2. On a hand where a rule pulls the Wall band closer, the Heat bar keeps a tick where the usual band starts. In Cases 14 and 16 the case’s own rule comes before the act’s. A season started with the Rule of the Week, and Story Mode, get none of these.</p>
<p><strong>The other acts’ rules.</strong> We gave Acts 1, 2, 4, 6 and 8 a table rule of their own too, each taken from its act’s story. These five read what you did when a hand closes, so commit with the next hand in mind, not only this one. The briefing’s “This case only” panel shows the case’s rule.</p>
<dl>
<dt>Passed Down (Act 1, Cases 04 to 06)</dt><dd>The first BUST with a stake on it still leaves a third of the stake. In return, that hand’s Human cost goes up by 3 more. If you hold Insurance it goes first, and the two together save a case only once.</dd>
<dt>The Late Bill (Act 2, Case 10)</dt><dd>Commit at Heat 60 or more and HEAT DEBT starts the next hand with three quarters of that Heat, not a third (Heat Sink’s own share if you hold it). Commit under 60 and every card’s chips are ×1.25. The case asks whether you commit big or bank clean.</dd>
<dt>The Trained Wall (Act 4, Cases 20, 22 and 23)</dt><dd>The table learns the Heat you commit at. On the next hand the Wall band stands from 10 below that Heat to 18 above it (at least 34 wide), but its middle never sits lower than the middle of its usual band. On such a hand, Scout narrows straight to 14 wide, once. The hand after a BUST has the usual band.</dd>
<dt>On the Record (Act 6, Cases 32 to 35)</dt><dd>The Stance of the case’s first commit stays until the case ends and can’t change. In return, every commit carries that Stance into the next hand, even without a full charge. Season mastery still counts only commits with a charge of 70 or more.</dd>
<dt>Signed by Name (Act 8, Cases 44, 46, 48 and 49)</dt><dd>Before the first hand, choose on the briefing how to sign. “Name only” makes every card’s chips ×1.25 and moves the Wall band 1 to 3 closer; “With conditions” moves the Wall band 3 further and makes chips ×0.9. Choose nothing and you sign with conditions.</dd>
</dl>
<p>A season started with the Rule of the Week, and Story Mode, get none of these five either.</p>
<p>Which week brings which rule is written ahead on the <a href="/en/weekly.html">Rule of the Week calendar</a>.</p>
<p><strong>The signature line’s number.</strong> In Act 8’s “Signed by Name”, how far “Name only” moves the Wall band closer changes from case to case, 1 to 3. The signature line shows this case’s number before you choose, and Case 49 is always 3. We wanted the same player to weigh the signature again in every case.</p>

<h2>The report and the Burst Score</h2>
<p>The report scores each case from 0 to 100 on how you judged, not on how much you banked:</p>
<ul>
<li><strong>Holding your line</strong> (about 22%): keeping your side as the Heat rose.</li>
<li><strong>Reading the hand</strong> (20%): what you earned against someone who could see the Wall on the same hands.</li>
<li><strong>Perspective shifts</strong> (16%): spreading the four ways of thinking; two alone never reach the top.</li>
<li><strong>Redesigning the table</strong> (16%): reframes, hidden routes, challenges met and hidden records found.</li>
<li><strong>Handling pressure</strong> (about 13%): lowering risk pressure, and winning back pressure that spiked.</li>
<li><strong>Thinking rhythm</strong> (about 6%): time taken after the table opens; 8 to 28 seconds is full marks.</li>
</ul>
<p>A run of met challenges adds about 6% more. The <strong>Quick-answer penalty</strong> takes 5 points, up to 18, for each pick made within 2 seconds that was neither a reframe nor made after a full read of the briefing. Ranks are S from 88, A from 72, B from 52 and C below.</p>

<h2>Ranking and leagues</h2>
<p>Cases are ranked by Burst Score and seasons by the average of their cases. Replaying a case keeps your first close on the ranking, so your first try is the one that counts. Leagues sort how you scored:</p>
<ul>
<li><strong>REFRAME LEAGUE</strong>: you reframed at least once, and Redesigning is at least Handling pressure.</li>
<li><strong>RISK LEAGUE</strong>: Handling pressure is 12 or more points above Redesigning.</li>
<li><strong>SYSTEM LEAGUE</strong>: otherwise, Redesigning is 55 or more.</li>
<li><strong>FIELD LEAGUE</strong>: everyone else.</li>
</ul>
<p>A season with any case opened in Story Mode stays off the public ranking.</p>
<p>On Thursday, November 26, 2026, the public ranking is cleared once as the rules change. The Hall of Fame stays as it is, and the start screen says the same from November 16.</p>

<h2>The end of a season</h2>
<p>There are nine endings, and yours is read from the whole season: your average Trust, Fairness and Cash as each case closed, your average Human cost per case, the share of hands that busted, the share of hidden records found, how often a reframe opened a hidden route, how high the pressure stayed, and your decision in the last case. An average Human cost of 20 a case, or busting in 20% of hands while averaging 10, reads as a season that could not hold. A season with no BUST at a high multiplier, a very long combo or a rich Vault per case needs slightly fewer records. The rest is yours to find.</p>

<h2>Comfort settings and keyboard</h2>
<p>“Story Mode” moves the Wall to 88 to 98, runs the clock at least twice as slow, turns off the nine rules from BLACKOUT to CASCADE, and keeps a BUST from skipping a scene. “Table Time” slows the table’s clock to ×1.5 or ×2, and “Turn off the reading clock” stops briefings from moving on by themselves.</p>
<ul>
<li>Briefing: Space, Enter or W opens the table; a number key opens it with that card staked.</li>
<li>Table: 1 to 9 stake a card (the wild card takes the next number), Space or W pushes, Enter commits (hold it when Commit must be held), E is LOCK, Q changes Stance, R scouts and S pushes to the safe line.</li>
<li>Draft: 1 to 9 pick, Esc skips, R rerolls (1,500) and B buys one more (once a Season).</li>
<li>P saves and Shift+P saves and exits. On a result screen, R replays the case and N opens the next one.</li>
</ul>

<h2>Tips for your first season</h2>
<ol>
<li><strong>Push at least once.</strong> Pushes within “Safe ×N” cannot hit the Wall, and never pushing brings COLD FEET.</li>
<li><strong>Grow careful as the stake grows.</strong> A BUST takes the whole case’s stake, so one more push late in a case bets every hand before it.</li>
<li><strong>Never let the clock run out.</strong> Timing out is a BUST with SILENCE on top; committing even at low Heat is better.</li>
<li><strong>Know Heat 40 to 59.</strong> From Case 02, a commit there fills no Audit box and brings no HEAT DEBT.</li>
<li><strong>Hold your side, vary your thinking.</strong> It feeds the combo and Perspective shifts at once. Once Noticed builds, commit at Heat 50 or more, or switch side once.</li>
<li><strong>Read the briefing through.</strong> Changed rules are written there, and a full read spares you the Quick-answer penalty.</li>
<li><strong>Study every BUST.</strong> Comparing where the Wall was with where the heartbeat heard it trains your ear fast.</li>
</ol>`,

  ja: `<p>このガイドは『臨界点: CRITICAL POINT』のルールを、ゲーム内の実際の数値で解説します。テーブルの数字の一つ一つが何を意味するのか、一度の判断が次の勝負にどんな跡を残すのかを扱います。物語についてはプロローグの出発点より先には触れないので、初めての人も安心して読めます。</p>

<h2>一つの事件の流れ</h2>
<p>シーズンはプロローグの五つの事件と本編の五十の事件、合わせて五十五の事件です。事件はいくつものシーンでつながり、シーンはいつも同じ順番で進みます。ブリーフィングを読み、テーブルでカードを一枚賭けて押し切るか確定し、判定の画面でその決定が何を変えたかを見ます。このテーブル一回を「勝負」と呼びます。確定して得た分は事件の賭け金に積まれ、事件の最後のシーンが閉じてはじめて金庫に移ります。</p>

<h2>ブリーフィングの読み方</h2>
<p>ブリーフィングには、場所と時刻、話す人、たたまれた「事件ファイル」、そしてシーンの質問が入った「あなたの判断」の枠があります。シーンごとに、リスク圧力を下げる、卓の組み替えを試す、といったチャレンジが一つずつ掛かっていて、これを満たすとスコアとその事件の隠れた記録の両方に役立ちます。</p>
<p>読む時間は本文とルール説明の長さに応じて12秒から94秒のあいだで決まり、時間が来ると卓が自動で開きます。時計を押すと止まります。ブリーフィングの下のカードを押すと、そのカードを賭けた状態で卓が開きます。「持ち越し」や「この勝負のルールが変わった」が出ていたら、必ず読んでください。前の決定のせいで、この勝負の壁、時計、カードが変わったという意味です。読む時間の70%以上をブリーフィングで過ごした場合は、卓ですばやく選んでも即答とは見なされません。</p>

<h2>テーブルの解剖</h2>
<h3>カードとチップ</h3>
<p>選択肢一つがカード一枚です。カードにはチップ、いちばん大きく燃やすリソース、そして二つのタグが付きます。一つは人の側か立場の側かを示す方向、もう一つはリスクを扱う、念入りに確かめる、最後まで粘る、卓を変える、のどれかにあたる思考タイプです。利益の大きいカードほどチップが多くなります。一つのリソースを8以上燃やすカードには「ひびの候補」の印が付きます。</p>
<h3>ワイルドカード「卓を組み替える」</h3>
<p>勝負を変える道があるシーンには、このカードが混ざっています。基本のチップは24で、残り時間6と疲労5を使う代わりに、信頼と公正さを3ずつくれます。方向は人の側として数えます。このカードで壁に触れずに確定するとその事件の隠れたルートが開き、BUSTで終わると開きません。</p>
<h3>熱と壁の区間</h3>
<p>熱は0から100までです。「押し切る」一回で熱が7から15上がり、倍率は熱11ごとに2倍になります。熱0で×1、22で×4、33で×8、60で約×44です。ゲージには壁がありうる区間が描かれ、通常の勝負では56から92のあいだで、壁はその中の一点に隠れています。30と60の目盛りは、COLD FEETの封印が解ける熱と、HEAT DEBTが始まる熱です。</p>
<p>「現在のリスク」の欄は、「壁まで最低 N」「押せば壁の射程内」「壁の区間内」のどれかを示します。「安全線 ×N」は、壁がどこにあっても届かない一押しがあとN回あるという意味です。</p>
<h3>心拍</h3>
<p>壁を聞き取るのは心拍だけです。熱が壁から44以内に入ると、近づくほど速くなり、最大190まで上がります。ただし心拍が聞いている壁は実際と最大18ずれ、熱が高いときや時計がほとんど残っていないときは、壁と関係なく速くなります。BUSTのあとには、壁が実際にどこにあったかと、心拍がどこに聞いていたかが一緒に示されるので、耳を合わせるのに使ってください。</p>
<h3>照会</h3>
<p>プロローグ03から、「照会」で信頼1と時間3秒を払い、壁の区間を20マス幅に絞れます。勝負ごとに一回で、壁がその真ん中にあるという意味ではありません。もう一度押すと、時間3秒で14マスまで絞ります。この二度目の照会の信頼は、一つの事件の中で2、2、3、3、4、4…と上がり、ボタンに今回の値が出ます。最初の照会も、一つの事件の中で信頼1なのは最初の三回だけで、その後は2、2、3、3…と上がります。私たちは「この勝負は心拍だけを信じる」も選ぶ価値のある選択にしたいと考えました。</p>
<h3>賭け金、確定、BUST</h3>
<p>「確定」を押すと、チップ × 倍率 × コンボとLOCKのボーナスが事件の賭け金に加わります。賭け金は事件が閉じるまで金庫の外にあるので、事件の途中の一度のBUSTが、それまでの賭け金をすべて消します。事件の最後のシーンや、熱がすでに壁の区間に入っているときは、確定を約0.6秒長押しするか、3秒以内に「もう一度」を押す必要があります。</p>
<p>BUSTは、押し切って壁に触れる、時計が上げた熱が壁に触れる、時間切れになる、のいずれかで起こります。賭け金は0になり、カードは利益なしにコストだけを払い、信頼6、公正さ6、残り時間4を失って疲労が8上がります。物語は次のシーンを飛ばします(プロローグ01・02を除く)。金庫には手を付けられません。</p>
<h3>テーブルの時計</h3>
<p>勝負の時間は標準で45秒、熱45から40秒、熱65から35秒に縮み、12秒より短くはなりません。卓が開いて4秒たつと、時計がひとりでに熱を上げはじめます。毎秒0.5で、押すたびに12%ずつ速くなり、「時計が上げる熱 N倍」と表示されます。</p>
<h3>LOCKと構え</h3>
<p>プロローグ04から、カードを賭けたあとにLOCKを押せます。一回に1.5秒かかってチャージがたまり、カードのリソース効果とチップ倍率が大きくなります（チップ倍率は1.5倍まで）。プロローグ05から構えを選びます。STRIKEは倍率をいちばん速く伸ばし、熱60以上で確定すると上限が1.55倍に上がります。STEADYは一度押したあとのLOCKごとに熱を1ずつ冷まします。EXPOSEはリソース効果を伸ばし、満タンまで溜めて確定すると監査が埋まらず摘発もされず、次の勝負のチップが1.3倍になります。チャージ70以上で確定すると構えが次の勝負に続き、一つの構えでこれを3回確定するとシーズンの熟練が付きます。</p>
<p>持ち込んだ連続がすでにLOCKの上限（1.5倍）を満たしている勝負では、LOCKが止まります。足すものがないからで、押すとその理由が出ます。時計の短い勝負、つまりSHORT CLOCK（今週のルールと事件09）と第7幕の「公聴会」では、LOCK一回が1.15倍の約1.7秒かかります。ボタンに今回の値が出るので、チャージせずに早く切る勝負も考えてみてください。</p>

<h2>判断が残す跡</h2>
<p>一度の決定は、次の勝負のルールを変えます。次のルールはかっこ内の事件で開き、事件05からはすべてオン、NEW GAME+では最初から全部オンです。</p>
<dl>
<dt>BLACKOUT（プロローグ02）</dt><dd>BUSTの次の勝負は、カードのチップと消耗が伏せられ、壁の区間が6近づきます。</dd>
<dt>AFTERSHOCK（事件04）</dt><dd>BUSTの次の勝負は、熱22から始まります。</dd>
<dt>SILENCE（事件05）</dt><dd>時間切れでBUSTすると、次の勝負は心拍が壁を指さず、時間が30秒になります。</dd>
<dt>COLD FEET（プロローグ03）</dt><dd>一度も押さずに確定すると、次の勝負でチップがいちばん多いカードが熱30を超えるまで封印され、チップが0.6倍になります。</dd>
<dt>HEAT DEBT（プロローグ03）</dt><dd>熱60以上で確定すると、次の勝負はその熱の3分の1を抱え、12秒短く始まります。</dd>
<dt>FRACTURE（プロローグ04）</dt><dd>確定でもBUSTでも、カードが一つのリソースを8以上燃やしていたら、次の勝負でそのリソースを燃やすカードは1.5倍で請求されます。</dd>
<dt>OVERCLOCK（事件01）</dt><dd>×4以上の確定を2回続けると次の勝負のチップが2倍になりますが、押したときに上がる熱も大きくなります。×4以上の確定が続くあいだ続きます。</dd>
<dt>監査、AUDIT（事件02）</dt><dd>一度以上押して熱40未満で確定すると監査が1マス埋まり、60以上で確定すると2マス減ります。事件が閉じるとき4マス埋まっていると、金庫へ行く取り分の4分の1を失います。上限まで1マスのとき、いま確定すると監査が埋まる熱なら卓に「低く確定で監査」が出て、監査で失った事件の結果には「なぜ」の一行が付きます。</dd>
<dt>連結、CASCADE（事件03）</dt><dd>一つのリソースを8以上燃やすカードで確定すると連結ができ、2〜4勝負あとのひとつの勝負で壁の区間が6近づきます。次の事件に持ち越されるのは、いちばん新しい連結一つだけです。</dd>
</dl>
<p>事件が閉じるとREBOOTが跡を消します。各幕の最後の事件は「山場の勝負」で、壁が5近づき、チップが1.25倍になります。</p>
<dl>
<dt>決裁の勝負</dt><dd>事件の最後の勝負です。賭け金は1.5倍で、壁がありうるいちばん近いマスが一つ見えます。結果の帳簿に大きく残ります。</dd>
<dt>息を整える</dt><dd>BUSTのすぐ次の勝負で、最初の押し込みと最初の照会の前に一度だけ押せます。時計を2秒使い、熱を11下げ（前の勝負が熱60以上でBUSTしていれば14）、壁を3遠ざけます。ボタンの横に「前回NでBUST」が出ます。</dd>
</dl>

<h2>ロジックコンボ</h2>
<p>プロローグ02から、同じ方向（人の側か立場の側）を選ぶとロジックコンボが積み上がります。3回続けて選んだときから一段ずつ上がり、一段ごとに賭け金が6.25%増えて、コンボ10で×1.6になります。勝負を閉じた熱は30未満、30〜59、60以上の三つの帯に分かれ、直前の勝負がその前の勝負より高い帯で閉じていれば、方向を変えても転換と認められてコンボが上がります。熱が上がっていないのに方向を変えるとコンボは半分になり、BUSTすると0になります。コンボとLOCKを合わせたボーナスは×1.6を超えません。</p>
<p><strong>目立ち。</strong>同じ方向を5回目から続けて選ぶと、目立ちが1ずつ積もります（最大6）。目立ちがあるあいだに熱50未満で確定すると、1段ごとに5%、最大30%の確率で摘発されます。摘発された勝負は賭け金がなく、コンボが半分になります。方向を変えると目立ちは消えます。</p>
<p>コンボは壁を動かさないので、コンボが長いことはもう一押しの理由になりません。レポートの「視点の転換」は思考タイプをまんべんなく使うほど上がるので、方向は守り、タイプは変えましょう。</p>

<h2>ツール</h2>
<p>プロローグ05から、事件が閉じると次の事件の最初のテーブルでドラフトが開きます。時計が止まっているあいだに、ツール三つのうち一つを選びます。ツールは五つまで持て、いっぱいになったら一つを置きます。何も選ばなければ「ひと息つく」になり、最初の勝負の時間が10秒延び、壁が3遠ざかります。選ぶ前に、金庫から1,500を払えば「引き直し」がドラフトごとに一回、12,000を払えば「もう一つ」がシーズンに一度できます。引き直しは安いので、三つが弱ければ引き直しましょう。</p>
<p>ツールにはそれぞれ条件があり、条件を満たした確定は賭け金が大きく上がります。「放熱板」は熱75以上で確定すると+60%、「監査室のつて」は一度以上押して熱50未満で確定すると+80%（目立ちがあっても見逃される）、「冷血」はBUSTの次の勝負をAFTERSHOCKなしに熱0から始めさせて壁を2遠ざけ、その勝負の確定を+100%にします。「ト・ユナの現場メモ」は同じ側のコンボ5以上で+25%、「メトロノーム」は向きを変えた勝負で+70%、「イム・ギョンスの写し」はBLACKOUTの勝負で+70%、「チャ・ジウォンの1面」はOVERCLOCKの勝負で+20%です。自分の遊び方に合う条件を選びましょう。条件を満たしてはじめて解放されるツールもあります。ロジックコンボ8を達成するとBUSTしてもコンボが残る「アンコール」（コンボ8以上の確定で+15%）が、賭け金5,000以上を壁に失うと事件ごとに一回賭け金の3分の1を守る「保険」が解放されます。条件を満たしたツールが一つの勝負で二つ以上重なると、倍率は合わせて1.6倍で止まります。一つでそれより大きいツール（監査室のつて1.8倍、冷血2倍）はその値まで受け取れるので、二つ目のツールが一つ目の分を削ることはありません。</p>

<h2>六つのリソース</h2>
<p>残り時間、現金、信頼、公正さは高いほど良く、人的被害と疲労は上がるほど損です。事件は残り時間72、現金100、信頼50、公正さ50、人的被害0、疲労10から出発し、前の事件の結果の分だけ変わります。Sランクのあとは信頼+4と公正さ+3、Cランクのあとは公正さ−2と疲労+4を抱えて始まり、シーズンの後半の事件ほど疲れた状態で開きます。カードの利益は熱に応じて大きくなり、熱60で1.9倍、100で2.5倍になりますが、コストは大きくなりません。</p>

<h2>今週のルール</h2>
<p>おおむね二週に一回、その週だけ立つルールがあります。週は韓国時間の月曜0時に切り替わり、シーズンを始めるときに、今週のルールで遊ぶか（今週のランキング）、遊ばないか（通常のランキング）を選びます。</p>
<ul>
<li><strong>NEAR WALL（壁が近い）</strong>: 壁の区間が熱4だけ手前に立ちます。</li>
<li><strong>HEAVY FRACTURE（ひびが深い）</strong>: FRACTUREが1.75倍で請求します。</li>
<li><strong>SHORT CLOCK（時間が短い）</strong>: 勝負ごとに8秒短く、すべてのカードのチップが1.25倍です。</li>
<li><strong>CRISIS WEEK（危機の週）</strong>: 壁の区間が熱3だけ手前に立ち、すべてのカードのチップが1.2倍です。</li>
<li><strong>IDLE MONEY（寝かせた金は目減りする）</strong>: 事件が閉じるたびに、金庫に残っていた額の2%が消えます。道具選びで使った分は減りません。</li>
<li><strong>MARKET SHOCK（市場ショック）</strong>: 事件ごとに一度、4回目の勝負で壁の区間が熱4だけ手前に立ち、それまで積んだ賭け金が最大20%上下します。</li>
</ul>
<p>シーズンは始めた週のルールを最後まで持ち続け、記録は別のランキングに積まれます。ストーリーモードには付きません。</p>
<p><strong>この事件だけ。</strong>いくつかの事件には、その事件のあいだだけのルールが一つ立ちます。事件09はSHORT CLOCK、11はNEAR WALL、14はHEAVY FRACTURE、16はCRISIS WEEKです。第3幕（事件13〜18）は「合併」でチップ1.35倍、壁の区間が熱3手前に、第5幕（事件25〜30）は「散らばった席」で壁の区間が両側に4ずつ広がり（チップはそのまま）、第7幕（事件37〜42）は「公聴会」で勝負ごとの時間が30%短くチップ1.2倍です。ルールが壁の区間を手前に寄せた勝負では、熱のバーにいつもの区間の位置が目盛りとして残ります。事件14・16では事件のルールが幕のルールより先です。今週のルールで始めたシーズンとストーリーモードには、これらのルールはありません。</p>
<p><strong>残りの幕のルール。</strong>私たちは第1・2・4・6・8幕にも、その幕の物語を勝負のルール一つに移しました。この五つは勝負が閉じるときにあなたがしたことを読むので、この勝負だけでなく次の勝負まで考えて確定してください。ブリーフィングの「この事件だけ」のパネルに、その事件のルールが出ます。</p>
<dl>
<dt>押しつけられた損失（第1幕、事件04〜06）</dt><dd>賭け金がかかった最初のBUSTでも、賭け金の3分の1が残ります。そのかわり、その勝負の人的被害がさらに3上がります。「保険」を持っていれば保険が先に使われ、二つ合わせて一つの事件で一度だけ守ってくれます。</dd>
<dt>遅れてきた請求書（第2幕、事件10）</dt><dd>熱60以上で確定すると、HEAT DEBTが熱の3分の1ではなく4分の3を抱えて次の勝負を始めさせます（「放熱板」を持っていれば放熱板の値）。60未満で確定すると、すべてのカードのチップが1.25倍です。大きく確定するか、きれいに取るかを選ぶ事件です。</dd>
<dt>学習された壁（第4幕、事件20・22・23）</dt><dd>卓があなたの確定した熱を学びます。次の勝負の壁の区間は、その熱の10下から18上まで（幅は34以上）に立ちますが、区間の真ん中がいつもの区間の真ん中より下に下がることはありません。こうして立った勝負の照会は、最初から14マスに絞り、一度だけです。BUSTの次の勝負はいつもの区間です。</dd>
<dt>供述の固定（第6幕、事件32〜35）</dt><dd>事件で最初に確定した構えが事件の終わりまで残り、変えられません。そのかわり、確定するたびにチャージが足りなくても、その構えが次の勝負に続きます。シーズンの熟練は、いつもどおりチャージ70以上の確定だけを数えます。</dd>
<dt>実名の署名（第8幕、事件44・46・48・49）</dt><dd>最初の勝負の前に、ブリーフィングで署名のしかたを選びます。「名前だけ書く」はすべてのカードのチップが1.25倍で壁の区間が1〜3手前に立ち、「条件をつける」は壁の区間が3下がってチップが0.9倍です。選ばなければ、条件をつけたことになります。</dd>
</dl>
<p>この五つのルールも、今週のルールで始めたシーズンとストーリーモードにはありません。</p>
<p>どの週にどのルールが立つかは、<a href="/ja/weekly.html">今週のルール カレンダー</a>に前もって書いておきます。</p>
<p><strong>署名欄の値。</strong>第8幕「実名の署名」で「名前だけ書く」が壁の区間を手前に寄せる幅は、事件ごとに1〜3で変わります。署名欄が選ぶ前に今回の事件の値を先に見せ、事件49はいつも3です。私たちは、同じ人でも事件ごとに署名をもう一度迷うようにしたいと考えました。</p>

<h2>レポートとバーストスコア</h2>
<p>レポートは事件ごとに、いくら稼いだかではなく、どう判断したかを0〜100点で採点します。</p>
<ul>
<li><strong>基準の維持</strong>（約22%）: 熱が上がっても同じ方向を守ったか。</li>
<li><strong>勝負の読み</strong>（20%）: 壁が見えている人が同じ勝負で稼いだはずの分と比べた、自分の分。</li>
<li><strong>視点の転換</strong>（16%）: 四つの思考タイプをまんべんなく使ったか。二つのタイプだけでは満点に届きません。</li>
<li><strong>構造の再設計</strong>（16%）: 卓を組み替え、隠れたルートを開き、チャレンジを満たし、隠れた記録を見つけた度合い。</li>
<li><strong>圧力への対応</strong>（約13%）: リスク圧力を下げ、跳ね上がった圧力を回収した跡。</li>
<li><strong>思考のリズム</strong>（約6%）: 卓が開いてから決めるまでの時間。8〜28秒が満点です。</li>
</ul>
<p>チャレンジを続けて満たした分が約6%加わります。<strong>即答ペナルティ</strong>は、卓を組み替えず、ブリーフィングも読み終えないまま2秒以内に選んだ決定ごとに5点、最大18点を引きます。ランクは88点以上がS、72点以上がA、52点以上がB、それ未満がCです。</p>

<h2>ランキングとリーグ</h2>
<p>事件はバーストスコアで、シーズンは事件スコアの平均で順位が付きます。事件をやり直しても、ランキングには最初に閉じた記録が残るので、最初の挑戦が本番です。リーグは、スコアの取り方で分かれます。</p>
<ul>
<li><strong>REFRAME LEAGUE</strong>: 一度以上卓を組み替え、構造の再設計が圧力への対応以上。</li>
<li><strong>RISK LEAGUE</strong>: 圧力への対応が構造の再設計より12点以上高い。</li>
<li><strong>SYSTEM LEAGUE</strong>: それ以外で、構造の再設計が55点以上。</li>
<li><strong>FIELD LEAGUE</strong>: 残りすべて。</li>
</ul>
<p>ストーリーモードで開いた事件があるシーズンは公開ランキングに載りません。</p>
<p>2026年11月26日(木)、ルールの改定とあわせて公開ランキングを一度リセットします。名誉の殿堂の表はそのまま残り、最初の画面でも11月16日から同じお知らせが出ます。</p>

<h2>シーズンの終わり</h2>
<p>結末は九つあり、シーズン全体を読んで決まります。読むのは、事件が閉じるたびの信頼、公正さ、現金の平均、事件あたりの平均の人的被害、BUSTした勝負の割合、見つけた隠れた記録の割合、卓を組み替えて隠れたルートを開いた割合、圧力がどれだけ高く続いたか、そして最後の事件の決定です。人的被害が事件あたり平均20以上、または勝負の20%以上でBUSTしつつ人的被害も平均10以上なら、シーズンは持ちこたえられなかったと読まれます。BUSTなしで高い倍率を守った、コンボをとても長く続けた、事件あたりの金庫をたっぷり積んだシーズンは、記録を求める結末の敷居が少し下がります。残りはご自身で見つけてください。</p>

<h2>快適設定とキーボード</h2>
<p>「ストーリーモード」は壁を88〜98に移し、時計を2倍以上遅くし、BLACKOUTから連結までの九つのルールをオフにし、BUSTしてもシーンを飛ばさないようにします。「テーブル時間」は時計を1.5倍か2倍に遅くし、「読書時計の自動送りをオフ」はブリーフィングが自動で進まないようにします。</p>
<ul>
<li>ブリーフィング: Space、Enter、Wで卓を開き、数字キーでそのカードを賭けた状態で開きます。</li>
<li>テーブル: 1〜9でカードを賭ける（ワイルドカードは最後のカードの次の番号）、SpaceかWで押す、Enterで確定（長押しが必要なときは押し続ける）、EはLOCK、Qは構えの切り替え、Rは照会、Sは安全線まで押す。</li>
<li>ドラフト: 1〜9で選ぶ、Escは選ばない、Rは引き直し（1,500）、Bはもう一つ（シーズンに一度）。</li>
<li>Pは保存、Shift+Pは保存して終了。結果画面では、Rでその事件をやり直し、Nで次の事件へ。</li>
</ul>

<h2>初めての人へのアドバイス</h2>
<ol>
<li><strong>一度は押しましょう。</strong>「安全線 ×N」の範囲の一押しは壁に届かず、押さないとCOLD FEETが来ます。</li>
<li><strong>賭け金が積まれるほど慎重に。</strong>BUSTは事件の賭け金をすべて持っていくので、事件の終盤のもう一押しは、それまでのすべての勝負を賭けることになります。</li>
<li><strong>時計を使い切らないでください。</strong>時間切れはBUSTにSILENCEまで付きます。低い熱でも確定するほうがましです。</li>
<li><strong>熱40〜59を覚えておきましょう。</strong>事件02から、この帯での確定は監査も埋めず、HEAT DEBTも呼びません。</li>
<li><strong>方向は守り、タイプは変えましょう。</strong>コンボと視点の転換が一緒に上がります。目立ちが積もったら、熱50以上で確定するか、一度方向を変えましょう。</li>
<li><strong>ブリーフィングは最後まで読みましょう。</strong>変わったルールがそこにあり、読み終えれば即答ペナルティも避けられます。</li>
<li><strong>BUSTから学びましょう。</strong>壁の実際の位置と心拍が聞いた位置を見比べるうちに、耳がすぐに慣れてきます。</li>
</ol>`,
};
