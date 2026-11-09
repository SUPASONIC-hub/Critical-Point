/** How-to-play guide body, Korean/English/Japanese (scripts/content-pages/pages.mjs renders it). Every rule and number read from src/gauntlet and src/copy on 2026-11-09. */

export const GUIDE_DESCRIPTION = {
  ko: "임계점의 테이블 규칙을 실제 수치로 풀어 쓴 안내서입니다. 열기와 벽, 심박, 다음 판을 바꾸는 규칙, 논리 콤보, 도구, 버스트 점수와 리그를 설명합니다.",
  en: "Every rule of the Critical Point table with its real numbers: Heat and the Wall, the heartbeat, next-hand rules, Logic Combo, tools, Burst Score and leagues.",
  ja: "『臨界点』のテーブルのルールを実際の数値で解説するガイドです。熱と壁、心拍、次の勝負を変えるルール、ロジックコンボ、ツール、スコアとリーグ。",
};

export const GUIDE_BODY = {
  ko: `<p>이 페이지는 「임계점: CRITICAL POINT」의 규칙을 하나씩 풀어 쓴 안내서입니다. 게임 소개 페이지가 큰 흐름을 보여 준다면, 여기서는 화면의 숫자 하나하나가 무엇을 뜻하고 한 번의 판단이 다음 판에 어떤 흔적을 남기는지를 게임 안의 실제 수치로 설명합니다. 이야기는 프롤로그의 출발점 이상 다루지 않으니 처음 하는 사람도 안심하고 읽어도 됩니다.</p>

<h2>한 사건의 흐름</h2>
<p>시즌은 프롤로그 다섯 사건과 본편 쉰 사건, 모두 쉰다섯 사건으로 이루어집니다. 사건 하나는 여러 장면으로 나뉘고, 장면 하나는 늘 같은 순서로 지나갑니다. 먼저 브리핑을 읽고, 테이블에서 카드 한 장을 건 뒤 밀어붙이거나 확정하고, 판정 화면에서 그 결정이 무엇을 바꿨는지 봅니다. 이 테이블 한 번을 「판」이라고 부릅니다. 판에서 확정해 번 몫은 그 사건의 판돈에 쌓이고, 사건의 마지막 장면이 닫혀야 판돈 전체가 금고로 옮겨집니다. 그다음 리포트가 사건을 버스트 점수로 매기고, 다음 사건의 첫 테이블에서 도구를 고르는 드래프트가 열립니다.</p>

<h2>브리핑 화면 읽기</h2>
<p>브리핑에는 장소와 시간, 말하는 사람의 초상과 대사, 접어 둔 「사건 파일」, 그리고 이 장면이 묻는 질문이 담긴 「당신의 판단」 상자가 있습니다. 장면마다 위험 압력 낮추기, 판 바꾸기 시도, 숨은 비용 찾기 같은 「챌린지」가 하나씩 걸려 있고, 이것을 맞히면 리포트 점수와 숨은 기록에 함께 쓰입니다.</p>
<p>읽는 시간은 본문과 그 판에 붙은 규칙 설명의 길이에 맞춰 12초에서 94초 사이로 정해지고, 다 되면 판이 저절로 열립니다. 시계를 누르면 멈추고 다시 누르면 흐릅니다. 「편의 설정」의 「읽기 시계 자동 넘김 끄기」를 켜면 아예 저절로 넘어가지 않습니다. 브리핑 아래의 카드를 누르면 그 카드를 건 채로 판이 열리고, 「판 열기」를 누르면 카드 없이 열립니다.</p>
<p>위쪽에 「이월 · 이번 판에 이어지는 규칙」이나 「이번 판의 규칙이 바뀌었다」가 붙어 있다면 꼭 읽으십시오. 지난 판의 결정 때문에 이번 판의 벽, 시계, 카드가 달라졌다는 뜻입니다. 또 읽는 시간의 70% 이상을 브리핑에서 보낸 뒤 판을 열었다면, 판에서 빨리 골라도 즉답으로 치지 않습니다.</p>

<h2>테이블 해부</h2>
<h3>카드와 칩</h3>
<p>선택지 하나가 카드 한 장입니다. 카드에는 확정했을 때 받는 칩, 가장 크게 태우는 자원, 그리고 꼬리표 두 개가 붙어 있습니다. 하나는 카드가 사람 쪽으로 기우는지 자리 쪽으로 기우는지를 보여 주는 방향이고, 다른 하나는 위험 다루기, 꼼꼼히 확인하기, 끝까지 버티기, 판 바꾸기 가운데 어떤 생각 유형인지입니다. 칩은 카드가 주는 이득이 클수록 많습니다. 한 자원을 8 이상 태우는 카드에는 「균열 후보」 표시가 붙습니다.</p>
<h3>와일드 카드 「판을 다시 짠다」</h3>
<p>판을 바꿀 길이 있는 장면에는 이 카드가 한 장 끼어 있습니다. 기본 칩은 24이고, 남은 시간 6과 피로 5를 쓰는 대신 믿음과 공정함을 3씩 줍니다. 방향은 사람 쪽, 생각 유형은 판 바꾸기로 칩니다. 이 카드로 벽에 닿지 않고 확정해야 그 사건의 숨은 경로가 열립니다. 같은 카드라도 BUST로 끝나면 경로는 열리지 않습니다.</p>
<h3>열기 게이지와 벽 구간</h3>
<p>열기는 0에서 100까지입니다. 「밀어붙인다」를 누를 때마다 열기가 7에서 15 사이로 오르고, 판돈의 배율은 열기 11마다 두 배가 됩니다. 열기 0에서 ×1, 22에서 ×4, 33에서 ×8, 60에서 약 ×44입니다. 게이지에는 벽이 있을 수 있는 구간이 그려져 있고, 기본 판에서는 56에서 92 사이입니다. 벽은 그 안의 한 지점에 숨어 있습니다. 게이지의 30과 60에 있는 눈금은 각각 COLD FEET 봉인이 풀리는 열기와 HEAT DEBT가 시작되는 열기입니다.</p>
<p>「현재 위험」 칸은 상황을 세 가지로 알려 줍니다. 「벽까지 최소 N」은 다음 밀기가 가장 크게 올라도 벽 구간까지 N이 남는다는 뜻이고, 「밀면 벽 사정권」은 다음 밀기가 구간에 닿을 수 있다는 뜻, 「벽 구간 안」은 이미 구간에 들어왔다는 뜻입니다. 「안전선 ×N」은 벽이 어디 있든 닿을 수 없는 밀기가 N번 남았다는 표시이고, 그 N번은 한 번에 누를 수도 있습니다.</p>
<h3>심박</h3>
<p>벽의 위치를 알려 주는 것은 심박뿐입니다. 열기가 벽에서 44 안쪽으로 들어오면 심박이 벽을 듣기 시작해 가까울수록 빨라지고, 최대 190까지 오릅니다. 다만 심박이 듣는 벽은 실제 벽에서 최대 18만큼 어긋나 있고, 열기가 높거나 시계가 거의 다 되면 벽과 상관없이 맥이 빨라집니다. 심박은 정답이 아니라 계기판입니다. BUST가 나면 벽이 실제로 어디 있었는지와 심박이 벽을 어디쯤으로 들었는지가 함께 공개되니, 자기 귀를 맞추는 데 쓰십시오.</p>
<h3>조회</h3>
<p>프롤로그 03부터 「조회」를 쓸 수 있습니다. 믿음 1과 판의 시간 3초를 내면 벽 구간이 20칸 폭으로 좁혀집니다. 판마다 한 번뿐이고, 좁혀진 구간의 한가운데에 벽이 있다는 뜻은 아닙니다.</p>
<h3>판돈과 확정</h3>
<p>카드를 걸고 「확정」을 누르면 이번 판의 몫, 곧 칩 × 열기 배율 × 논리 콤보와 LOCK의 보너스가 사건의 판돈에 더해집니다. 판돈은 사건이 닫힐 때까지 금고 밖에 있습니다. 사건 도중 한 번이라도 BUST가 나면 그때까지 쌓은 판돈 전부가 사라집니다. 사건의 마지막 장면이거나 열기가 이미 벽 구간 안에 있을 때는, 실수를 막기 위해 확정을 약 0.6초 꾹 누르거나 한 번 누른 뒤 3초 안에 「한 번 더」를 눌러야 확정됩니다.</p>
<h3>BUST</h3>
<p>BUST가 나는 길은 셋입니다. 밀어붙여 벽에 닿거나, 시계가 올린 열기가 벽에 닿거나, 시간이 다 되는 것입니다. BUST가 나면 사건의 판돈이 0이 되고, 카드는 이득 없이 비용만 치르며, 믿음 −6, 공정함 −6, 피로 +8, 남은 시간 −4가 더해집니다. 이야기의 다음 장면도 건너뜁니다. 금고에 이미 들어간 것은 그대로입니다.</p>
<h3>테이블 시계</h3>
<p>판의 기본 시간은 45초입니다. 판돈이 커지면 시계도 짧아져서 열기 45부터는 40초, 열기 65부터는 35초가 됩니다. 어떤 판도 12초보다 짧아지지는 않습니다. 판이 열리고 4초가 지나면 시계가 스스로 열기를 올리기 시작합니다. 기본 판에서 초당 0.5이고, 밀어붙일 때마다 그 속도가 12%씩 빨라지며 「시계 열기 ×N」으로 표시됩니다. 가만히 있는 것도 공짜가 아닙니다.</p>
<h3>LOCK과 자세</h3>
<p>프롤로그 04부터는 카드를 건 뒤 LOCK을 누를 수 있습니다. 한 번 누를 때마다 시간 1.5초가 들고 충전이 쌓이며, 카드의 자원 효과가 커지고 칩 배율이 최대 1.5배까지 오릅니다. 프롤로그 05부터는 자세를 고릅니다. STRIKE는 배율을 가장 빨리 키우고, STEADY는 배율이 작은 대신 한 번 민 뒤의 LOCK마다 열기를 2씩 식히며, EXPOSE는 카드의 자원 효과를 크게 키웁니다. 자세를 바꾸면 충전은 0으로 돌아갑니다. 충전 70 이상으로 확정하면 자세의 효과가 다음 판으로 넘어갑니다. STRIKE WAKE는 칩 1.25배에 밀기 폭이 커지고, STEADY LINE은 열기 8 낮게, 시간 4초 더, 벽 3 멀리에서 시작하며, EXPOSED HAND는 카드가 가려지지 않고 COLD FEET 봉인이 풀립니다. 같은 자세로 이렇게 세 판을 확정하면 시즌 숙련이 생겨 이후의 모든 새 판에 작은 효과가 붙습니다.</p>

<h2>판단이 남기는 흔적</h2>
<p>이 게임의 핵심은 한 판의 결정이 다음 판의 규칙을 바꾼다는 점입니다. 아래 규칙은 처음부터 다 켜지지 않고 괄호 속 사건에서 하나씩 열리며, 사건 03부터는 모두 켜져 있습니다. NEW GAME+로 시작한 시즌은 처음부터 전부 켜집니다.</p>
<dl>
<dt>BLACKOUT (프롤로그 02)</dt><dd>BUST 다음 판은 카드의 칩과 소모가 가려지고 벽 구간이 6 가까워집니다.</dd>
<dt>AFTERSHOCK (프롤로그 02)</dt><dd>BUST 다음 판은 열기 22에서 시작합니다.</dd>
<dt>SILENCE (프롤로그 02)</dt><dd>시간이 다 돼 BUST하면 다음 판은 심박이 벽을 알려 주지 않고, 시간이 30초입니다.</dd>
<dt>COLD FEET (프롤로그 03)</dt><dd>한 번도 밀지 않고 확정하면 다음 판에서 칩이 가장 많은 카드가 열기 30을 넘길 때까지 봉인되고, 그 판의 칩이 0.6배로 줄어듭니다.</dd>
<dt>HEAT DEBT (프롤로그 03)</dt><dd>열기 60 이상에서 확정하면 다음 판은 그 열기의 3분의 1을 안고 시작하고, 시간이 12초 줄어듭니다.</dd>
<dt>FRACTURE (프롤로그 04)</dt><dd>확정이든 BUST든, 방금 카드가 한 자원을 8 이상 태웠다면 다음 판에서 그 자원을 태우는 카드는 1.5배로 청구됩니다.</dd>
<dt>OVERCLOCK (사건 01)</dt><dd>×4 이상으로 두 번 잇달아 확정하면 다음 판의 칩이 2배가 되지만, 밀 때 오르는 열기도 커집니다. 벌칙이 아니라 기회이고, ×4 이상 확정을 이어 가는 동안 계속됩니다.</dd>
<dt>감사, AUDIT (사건 02)</dt><dd>한 번 이상 밀고 열기 40 미만에서 확정하면 감사가 한 칸 차고, 60 이상에서 확정하면 두 칸 줄어듭니다. 사건이 닫힐 때 4칸이 차 있으면 금고로 갈 몫의 4분의 1을 잃습니다.</dd>
<dt>연결, CASCADE (사건 03)</dt><dd>한 자원을 8 이상 태운 카드로 확정하면 연결이 생기고, 2~4판 뒤의 한 판에서 벽 구간이 6 가까워집니다. 사건이 닫힐 때 남은 연결은 가장 최근 것 하나만 다음 사건으로 넘어갑니다.</dd>
</dl>
<p>사건이 닫히면 REBOOT가 일어나 이런 흔적이 초기화됩니다. 이와 별도로 각 막의 마지막 사건은 「고점 판」이라 모든 판의 벽이 5 가까워지고 칩이 1.25배가 됩니다. 시즌이 길어질수록 테이블도 조금씩 기울어, 100판을 칠 때마다 벽 구간의 위쪽 끝이 2씩 내려오고 시계가 올리는 열기가 조금 늘어납니다(최대 네 번).</p>

<h2>논리 콤보</h2>
<p>프롤로그 02부터 열리는 논리 콤보는 카드의 방향으로 쌓입니다. 같은 방향(사람 쪽 또는 자리 쪽)을 세 번째로 잇달아 고를 때부터 한 단계씩 오르고, 한 단계마다 판돈이 6.25%씩 커져 콤보 10에서 최대 ×1.6이 됩니다. 판이 닫힌 열기는 30 미만, 30~59, 60 이상의 세 구간으로 나뉘는데, 직전 판이 그 전 판보다 높은 구간에서 닫혔다면 방향을 바꿔도 「전환」으로 인정되어 콤보가 오릅니다. 지키던 방향의 카드가 장면에 없었거나 어느 쪽으로도 기울지 않은 카드를 골랐다면 콤보는 그대로입니다. 반면 열기가 오르지 않았는데 방향을 바꾸면 0으로 끊기고, BUST가 나도 끊깁니다. 콤보와 LOCK을 합친 보너스는 ×1.6을 넘지 않습니다.</p>
<p>콤보는 벽도 밀기 폭도 움직이지 않습니다. 콤보가 길다고 그 판이 더 안전해지지는 않는다는 뜻입니다. 리포트의 「관점 전환」 점수는 생각 유형을 고르게 쓸수록 오르니, 방향은 지키면서 유형은 바꾸는 것이 두 쪽을 함께 챙기는 길입니다.</p>

<h2>도구</h2>
<p>프롤로그 05부터는 사건이 닫힐 때마다 다음 사건의 첫 테이블에서 도구 드래프트가 열립니다. 세 개 가운데 하나를 고르고, 고를 때까지 시계는 멈춰 있습니다. 도구는 다섯 개까지 들 수 있고, 다 찬 뒤에는 하나를 내려놓아야 새것을 듭니다. 아무것도 고르지 않으면 「숨 고르기」가 되어 그 사건 첫 판의 시간이 10초 늘고 벽이 3 멀어집니다. 금고에서 4,000을 내면 「다시 뽑기」, 12,000을 내면 「하나 더」를 할 수 있습니다. 둘 다 드래프트마다 한 번이고 도구를 고르기 전에만 되며, 하나 더를 산 드래프트는 건너뛰어도 숨 고르기가 없습니다. 하나 더는 금고를 크게 줄이니 칸이 빌 때만 쓰는 편이 낫습니다.</p>
<p>몇 가지 예를 들면, 「메트로놈」은 열기가 오른 다음 장면까지 방향을 바꿔도 전환으로 인정해 주고, 「냉혈」은 AFTERSHOCK를 열기 22가 아니라 11에서 시작하게 하며, 「방열판」은 HEAT DEBT를 열기 6분의 1과 6초로 줄입니다. 조건을 채워야 도감에서 풀리는 도구도 있습니다. 논리 콤보 8을 달성하면 BUST해도 콤보가 남는 「앙코르」가, 판돈 5,000 이상을 벽에 잃으면 사건마다 한 번 판돈의 3분의 1을 지켜 주는 「보험」이, SILENCE를 한 번 겪으면 그 속에서도 심박이 벽을 가리키는 「청진기」가 풀립니다.</p>

<h2>여섯 가지 자원</h2>
<p>자원은 남은 시간, 현금, 믿음, 공정함, 사람 피해, 피로 여섯 가지입니다. 기본 출발값은 남은 시간 72, 현금 100, 믿음 50, 공정함 50, 사람 피해 0, 피로 10입니다. 앞의 네 가지는 높을수록 좋고, 사람 피해와 피로는 오를수록 손해입니다. 카드의 이득은 확정할 때의 열기만큼 커져서 열기 60이면 1.9배, 100이면 2.5배가 되지만, 비용은 열기와 상관없이 그대로 청구됩니다.</p>
<p>사건마다 자원은 출발값에서 다시 시작하지만, 앞 사건의 결과가 출발을 바꿉니다. 직전 사건의 랭크가 S면 믿음 +4와 공정함 +3, A면 믿음 +2와 공정함 +1을 안고 시작하고, B면 피로 +2, C면 공정함 −2와 피로 +4를 안고 시작합니다. 시즌 후반일수록 사건은 더 지친 채 열려서, 마지막 사건에서는 피로 +14와 남은 시간 −8이 붙습니다.</p>

<h2>이번 주의 규칙</h2>
<p>「이번 주의 규칙」은 특정 주에만 서는 추가 규칙으로, 지금 편성은 대체로 두 주에 한 번입니다. 주는 한국 시간 월요일 0시에 바뀝니다. 시즌을 시작할 때 이번 주의 규칙으로 시작할지(이번 주 순위로), 규칙 없이 시작할지(평소 순위로) 고르며, 첫 시즌은 평소 규칙이 기본입니다.</p>
<ul>
<li><strong>NEAR WALL (벽이 가깝다)</strong>: 벽 구간이 열기 4만큼 앞당겨집니다.</li>
<li><strong>HEAVY FRACTURE (균열이 깊다)</strong>: FRACTURE가 금 간 자원을 1.75배로 청구합니다.</li>
<li><strong>SHORT CLOCK (시간이 짧다)</strong>: 판마다 시간이 8초 짧고, 모든 카드의 칩이 1.25배입니다.</li>
</ul>
<p>이번 주에 시작한 시즌은 주가 바뀌어도 끝까지 그 규칙으로 진행되고, 기록은 따로 쌓입니다. 스토리 모드에는 붙지 않습니다.</p>

<h2>리포트와 버스트 점수</h2>
<p>사건이 끝나면 리포트가 버스트 점수(0~100)를 매깁니다. 금고의 크기가 아니라 판단의 결을 보는 항목들로 이루어집니다.</p>
<ul>
<li><strong>기준 유지</strong> (가장 큰 몫, 약 22%): 열기가 올라간 장면에서도 같은 방향을 지켰는지.</li>
<li><strong>판 읽기</strong> (20%): 같은 판을 벽이 보이는 사람이 쳤다면 벌었을 금고에 견줘 내가 번 몫. 사건이 닫힐 때 「벽을 본 사람의 N%」로 나옵니다.</li>
<li><strong>관점 전환</strong> (16%): 네 가지 생각 유형을 얼마나 고르게 썼는지. 두 유형만 번갈아 써서는 만점에 닿지 않습니다.</li>
<li><strong>구조 재설계</strong> (16%): 판을 다시 짜고, 숨은 경로를 열고, 챌린지를 맞히고, 숨은 기록을 찾은 정도.</li>
<li><strong>압박 대응</strong> (약 13%): 위험 압력을 낮춘 결정과, 치솟은 압력을 뒤에서 되돌린 흔적.</li>
<li><strong>생각 리듬</strong> (약 6%): 판이 열리고 결정하기까지의 시간. 8~28초가 만점이고, 4초 미만이 가장 낮습니다.</li>
</ul>
<p>여기에 장면 챌린지를 연달아 맞힌 몫이 약 6% 더해집니다. <strong>즉답 패널티</strong>는 판을 다시 짜지 않았고 브리핑도 충분히 읽지 않은 채 2초 안에 고른 결정마다 5점씩, 최대 18점을 깎습니다. 랭크는 88점 이상이 S, 72점 이상이 A, 52점 이상이 B, 그 아래가 C입니다.</p>
<p>사건마다 숨은 기록이 하나씩 있습니다. 사건의 두 번째 결정부터, 챌린지를 맞히면서 위험 압력을 크게 움직이거나 12초 안에 결정했을 때, 또는 판을 다시 짜 숨은 경로를 열면서 챌린지를 맞히거나 위험을 낮췄을 때 열립니다.</p>

<h2>랭킹과 리그</h2>
<p>사건 기록은 버스트 점수로, 시즌 기록은 사건 점수의 평균으로 순위가 매겨집니다. 시즌 기록의 관점 전환만은 시즌 전체의 생각 유형을 모아 다시 읽습니다. 같은 사건을 다시 해도 순위에는 처음 닫은 기록이 남으니, 첫 플레이가 진짜 기록입니다. 리그는 점수를 어떻게 얻었는지로 나뉩니다.</p>
<ul>
<li><strong>REFRAME LEAGUE</strong>: 판을 한 번 이상 다시 짰고, 구조 재설계가 압박 대응 이상일 때.</li>
<li><strong>RISK LEAGUE</strong>: 압박 대응이 구조 재설계보다 12점 이상 높을 때.</li>
<li><strong>SYSTEM LEAGUE</strong>: 그 밖에 구조 재설계가 55점 이상일 때.</li>
<li><strong>FIELD LEAGUE</strong>: 나머지 모두.</li>
</ul>
<p>테이블 시간을 1배가 아닌 값으로 둔 기록에는 그 배율이 표시되고, 스토리 모드로 연 사건이 있는 시즌은 공개 랭킹에 오르지 않습니다.</p>

<h2>시즌의 끝</h2>
<p>결말은 아홉 가지이고, 마지막 사건 하나가 아니라 시즌 전체를 읽어서 정해집니다. 읽는 것은 각 사건이 닫힐 때의 믿음, 공정함, 현금의 시즌 평균, 사건당 평균 사람 피해, 전체 판 가운데 BUST한 판의 비율, 숨은 기록을 찾은 비율, 판을 다시 짜 숨은 경로를 연 비율, 시즌 내내 압력이 얼마나 높았는지, 그리고 마지막 사건에서 내린 결정입니다. 사람 피해가 사건당 평균 20 이상이거나, 판의 20% 이상에서 BUST하면서 사람 피해도 평균 10 이상이면 시즌은 버티지 못한 것으로 읽힙니다. 반대로 BUST 없이 높은 배율을 지켰거나, 논리 콤보를 아주 길게 이었거나, 사건당 금고를 넉넉히 쌓은 시즌은 기록을 묻는 결말의 문턱이 조금 낮아집니다. 어느 결말이 어떤 조건인지는 직접 확인해 보십시오.</p>

<h2>편의 설정과 키보드</h2>
<p>「스토리 모드」는 벽을 게이지의 마지막 구간(88~98)으로 옮기고, 시계를 2배 이상 느리게 하며, BLACKOUT부터 연결까지 다음 판을 망가뜨리는 아홉 규칙을 끕니다. BUST해도 장면을 건너뛰지 않습니다. 논리 콤보, LOCK, 자세, 도구는 그대로 남지만 드래프트에서 금고를 쓸 수는 없습니다. 「테이블 시간」은 판의 시계를 1배, 1.5배, 2배로 고릅니다.</p>
<p>컴퓨터에서는 키보드만으로 플레이할 수 있습니다.</p>
<ul>
<li>브리핑: Space, Enter, W로 판을 열고, 숫자 키로 그 카드를 건 채 엽니다.</li>
<li>테이블: 1~9로 카드를 겁니다(와일드 카드는 마지막 카드 다음 번호). Space나 W는 밀어붙이기, Enter는 확정(꾹 눌러야 할 때는 Enter를 누르고 있기), E는 LOCK, Q는 자세 바꾸기, R은 조회, S는 안전선까지 밀기입니다.</li>
<li>드래프트: 1~9로 도구를 고르고, Esc는 고르지 않기, R은 다시 뽑기, B는 하나 더입니다.</li>
<li>P는 저장, Shift+P는 저장 후 나가기. 사건 결과 화면에서 R은 그 사건 다시 하기, N은 다음 사건입니다.</li>
</ul>
<p>「한 글자 단축키 쓰기」를 끄면 Space, Enter, Esc만 남습니다.</p>

<h2>처음 하는 사람을 위한 조언</h2>
<ol>
<li><strong>한 번은 미십시오.</strong> 「안전선 ×N」이 보이는 동안의 밀기는 벽에 닿을 수 없습니다. 밀지 않고 확정하면 COLD FEET가 오니, 안전선까지는 공짜로 미는 셈입니다.</li>
<li><strong>판돈이 쌓일수록 조심하십시오.</strong> BUST는 이번 판만이 아니라 사건 판돈 전부를 가져갑니다. 사건 후반의 한 번 더는 앞의 모든 판을 건 도박입니다.</li>
<li><strong>시계를 방치하지 마십시오.</strong> 4초 뒤부터 시계가 열기를 올리고, 시간이 다 되면 BUST에 SILENCE까지 붙습니다. 정하지 못하겠다면 낮은 열기에서라도 확정하는 편이 낫습니다.</li>
<li><strong>열기 40~59를 기억하십시오.</strong> 사건 02부터는 40 미만 확정이 감사를 채우고, 60 이상 확정은 HEAT DEBT를 부릅니다. 그 사이는 둘 다 피하는 구간입니다.</li>
<li><strong>방향은 지키고 유형은 바꾸십시오.</strong> 논리 콤보와 관점 전환 점수를 함께 올리는 가장 쉬운 방법입니다.</li>
<li><strong>브리핑을 끝까지 읽으십시오.</strong> 바뀐 규칙이 거기 적혀 있고, 다 읽고 연 판은 빨리 골라도 즉답 패널티를 받지 않습니다. 결정 자체는 8~28초 안에 내리는 것이 리듬 점수에 가장 좋습니다.</li>
<li><strong>BUST를 기록으로 쓰십시오.</strong> 판정 화면은 벽이 어디 있었는지와 심박이 어디로 들었는지를 보여 줍니다. 몇 번만 비교해도 심박을 읽는 감이 빠르게 붙습니다.</li>
</ol>`,

  en: `<p>This page explains the rules of Critical Point one at a time. The About page gives the big picture; here you will find what each number on the screen means and how a single call leaves its mark on the next hand, using the game’s real numbers. Nothing about the story goes past the setup of the prologue, so it is safe to read before you play.</p>

<h2>How a case flows</h2>
<p>A season is 55 cases: five in the prologue and fifty in the main story. Each case is split into scenes, and every scene runs in the same order. You read the briefing, play one card at the table and either push or commit, then the reveal shows what your decision changed. One visit to the table is called a hand. What you earn by committing is added to the case’s stake, and only when the case’s last scene closes does the whole stake move into the Vault. Then the report gives the case a Burst Score, and the first table of the next case opens with a tool draft.</p>

<h2>Reading the briefing</h2>
<p>The briefing shows the place and time, the speaker’s portrait and words, a folded “Case File” and the “Your Call” box with the question the scene asks. Each scene also carries one challenge, such as lowering risk pressure, trying a reframe or finding a hidden cost. Meeting it helps both your score and your chances of finding the case’s hidden record.</p>
<p>The reading time is set by the length of the text and of any rule notes attached to the hand, from 12 to 94 seconds, and the table opens on its own when it runs out. Press the clock to pause it and press again to resume. Turn on “Turn off the reading clock” in “Comfort settings” and it never moves on by itself. Press a card under the briefing to open the table with that card already staked, or press “Open the table” to open it with no card.</p>
<p>If you see “Carried over · rules that continue into this hand” or “this hand’s rules have changed” at the top, read it. It means your last decision changed this hand’s Wall, clock or cards. And if you spent at least 70% of the reading time on the briefing before opening the table, a fast pick at the table is not counted as an instant answer.</p>

<h2>Anatomy of the table</h2>
<h3>Cards and chips</h3>
<p>Each choice is a card. A card shows the chips it pays when you commit, the resource it burns the most and two tags. One tag is its side: does it lean toward the People or toward the Position? The other is its way of thinking: Handle Risk, Double-Check, Hold Out or Change the Game. The bigger a card’s gains, the more chips it pays. A card that burns 8 or more of one resource is marked “Fracture candidate”.</p>
<h3>The wild card, “Reframe the Table”</h3>
<p>A scene with a way to change the game holds this card. It pays 24 chips before Heat, costs 6 Time left and 5 Fatigue, and gives 3 Trust and 3 Fairness. It counts as the People side and as Change the Game. Commit it without hitting the Wall and it opens the case’s hidden route; if the hand ends in a BUST, the route stays shut.</p>
<h3>The Heat gauge and the Wall band</h3>
<p>Heat runs from 0 to 100. Each press of “Push” adds between 7 and 15 Heat, and the stake’s multiplier doubles every 11 Heat: ×1 at 0, ×4 at 22, ×8 at 33 and about ×44 at 60. The gauge marks the band where the Wall may be, 56 to 92 on a plain hand, and the Wall hides at one point inside it. The ticks at 30 and 60 are where a COLD FEET seal opens and where HEAT DEBT starts.</p>
<p>The “Current risk” cell says one of three things. “Wall at least N away” means even the biggest next push leaves N to the band. “A push can reach the Wall” means the next push could enter the band. “Inside the Wall band” means you are already in it. “Safe ×N” counts the pushes that cannot reach the Wall wherever it is, and you can make all N in one press.</p>
<h3>The heartbeat</h3>
<p>Only the heartbeat points at the Wall. Once Heat is within 44 of the Wall it starts to hear it and speeds up as you get closer, up to 190. But the Wall it hears can be off by up to 18, and high Heat or a nearly empty clock make it race whatever the Wall is doing. Treat it as an instrument, not an answer. After a BUST, the game shows where the Wall really was and where the heartbeat heard it, so use that to tune your ear.</p>
<h3>Scout</h3>
<p>From Prologue 03 you can press “Scout”. For 1 Trust and 3 seconds of the hand’s clock, the Wall band narrows to 20 wide. You get one look per hand, and the Wall is not necessarily in the middle of the narrowed band.</p>
<h3>Stake and Commit</h3>
<p>Stake a card and press “Commit”, and this hand’s share, chips × Heat multiplier × your Logic Combo and LOCK bonus, is added to the case’s stake. The stake stays outside the Vault until the case closes, so a single BUST anywhere in the case wipes all of it. In a case’s last scene, or once Heat is inside the Wall band, Commit guards against slips: hold it for about 0.6 seconds, or press it and then press “Once more” within 3 seconds.</p>
<h3>BUST</h3>
<p>There are three ways to BUST: push into the Wall, let the clock’s Heat creep into it, or run out of time. A BUST drops the case’s stake to zero, makes the card pay its costs with none of its gains, and adds Trust −6, Fairness −6, Fatigue +8 and Time left −4. The story also skips the next scene. Whatever is already in the Vault stays.</p>
<h3>The table clock</h3>
<p>A hand has 45 seconds by default. The clock shrinks as the stake grows: 40 seconds from Heat 45 and 35 seconds from Heat 65, and no hand ever drops below 12 seconds. Four seconds after the table opens, the clock starts adding Heat on its own: 0.5 a second on a plain hand, 12% faster for every push you have made, shown as “Clock heat ×N”. Waiting is never free.</p>
<h3>LOCK and Stances</h3>
<p>From Prologue 04 you can press LOCK after staking a card. Each press costs 1.5 seconds and builds charge, which grows the card’s resource effects and lifts the chip multiplier up to ×1.5. From Prologue 05 you choose a Stance. STRIKE grows the multiplier fastest; STEADY grows it less but cools Heat by 2 with each LOCK after a push; EXPOSE boosts the card’s resource effects. Switching Stance resets the charge. Commit with a charge of 70 or more and the Stance carries into the next hand: STRIKE WAKE gives ×1.25 chips and bigger pushes, STEADY LINE starts 8 Heat lower with 4 more seconds and the Wall 3 farther, and EXPOSED HAND keeps every card face up and lifts the COLD FEET seal. Do this three times with one Stance and you earn its season mastery, a small effect on every new hand after that.</p>

<h2>The marks your calls leave</h2>
<p>The heart of the game is that one hand’s decision changes the next hand’s rules. These rules do not start all at once: each opens in the case shown in brackets, and from Case 03 every one is in play. A season started with NEW GAME+ has them all from the start.</p>
<dl>
<dt>BLACKOUT (Prologue 02)</dt><dd>After a BUST, the next hand hides the cards’ chips and costs, and the Wall band comes 6 closer.</dd>
<dt>AFTERSHOCK (Prologue 02)</dt><dd>After a BUST, the next hand starts at Heat 22.</dd>
<dt>SILENCE (Prologue 02)</dt><dd>If you BUST because time ran out, the next hand’s heartbeat no longer points at the Wall, and the hand has 30 seconds.</dd>
<dt>COLD FEET (Prologue 03)</dt><dd>Commit without a single push, and in the next hand the card with the most chips is sealed until Heat passes 30, and that hand’s chips shrink to ×0.6.</dd>
<dt>HEAT DEBT (Prologue 03)</dt><dd>Commit at Heat 60 or more, and the next hand starts carrying a third of that Heat, with 12 seconds less.</dd>
<dt>FRACTURE (Prologue 04)</dt><dd>Whether you committed or busted, if the card just burned 8 or more of one resource, cards that burn that resource next hand are charged ×1.5.</dd>
<dt>OVERCLOCK (Case 01)</dt><dd>Commit at ×4 or more twice in a row and the next hand’s chips double, but each push adds more Heat. It is a chance, not a penalty, and it lasts as long as you keep committing at ×4 or more.</dd>
<dt>Audit, AUDIT (Case 02)</dt><dd>Push at least once and commit below Heat 40, and one Audit box fills; commit at 60 or more and two boxes clear. If 4 boxes are full when the case closes, you lose a quarter of the share bound for the Vault.</dd>
<dt>Links, CASCADE (Case 03)</dt><dd>Commit with a card that burns 8 or more of one resource and you make a link: one hand 2 to 4 hands later has its Wall band 6 closer. When a case closes, only the newest open link carries into the next case.</dd>
</dl>
<p>When a case closes, REBOOT resets all of these marks. Separately, the last case of each act is a “Peak hand” case: every hand in it has the Wall 5 closer and chips ×1.25. The table also leans in as the season goes on: every 100 hands played, the top of the Wall band comes down by 2 and the clock’s Heat runs a little hotter, up to four times.</p>

<h2>Logic Combo</h2>
<p>The Logic Combo, which opens in Prologue 02, is built on a card’s side. It rises one step each time you pick the same side (People or Position) from the third time in a row, and every step adds 6.25% to the stake, up to ×1.6 at a combo of 10. A hand closes in one of three Heat tiers: under 30, 30 to 59, or 60 and up. If your last hand closed in a higher tier than the one before it, switching sides counts as a switch and the combo still rises. If the side you were holding was not on the table, or you picked a card that leans neither way, the combo stays as it is. But switch sides when the Heat did not rise and the combo drops to 0, and a BUST breaks it too. Combo and LOCK together never pay more than ×1.6.</p>
<p>The combo never moves the Wall or the size of a push, so a long combo does not make a hand any safer. The report’s “Perspective shifts” score rises the more evenly you use the four ways of thinking, so holding your side while changing your way of thinking earns both.</p>

<h2>Tools</h2>
<p>From Prologue 05, each time a case closes, a tool draft opens at the first table of the next case. You pick one of three, and the clock is stopped until you choose. You can carry up to five tools; when you are full, you put one down to take a new one. Pick nothing and you “catch your breath”: the case’s first hand gets 10 more seconds and the Wall moves 3 farther. You can also pay from the Vault: “Reroll” for 4,000 and “One more” for 12,000, each once per draft and only before you pick. A draft that bought one more gives no breather if you then skip. One more drains the Vault fast, so buy it only when a slot is open.</p>
<p>A few examples: “Metronome” keeps counting a change of side as a switch until the scene after Heat rises; “Cold Blood” makes AFTERSHOCK start at Heat 11 instead of 22; “Heat Sink” cuts HEAT DEBT to a sixth of the Heat and 6 seconds. Some tools unlock in the Tool Index only after a feat. Reach a Logic Combo of 8 to unlock “Encore”, which keeps your combo through a BUST; lose a stake of 5,000 or more to the Wall to unlock “Insurance”, which saves a third of the stake once per case; live through SILENCE once to unlock “Stethoscope”, which keeps the heartbeat pointing at the Wall even then.</p>

<h2>The six resources</h2>
<p>The six resources are Time left, Cash, Trust, Fairness, Human cost and Fatigue. The base starting values are Time left 72, Cash 100, Trust 50, Fairness 50, Human cost 0 and Fatigue 10. The first four are better high; Human cost and Fatigue hurt as they rise. A card’s gains grow with the Heat you commit at, ×1.9 at Heat 60 and ×2.5 at 100, but its costs are charged as written whatever the Heat.</p>
<p>Each case starts again from the base values, but the case before shapes the start. If your last case ranked S you start with Trust +4 and Fairness +3; A gives Trust +2 and Fairness +1; B adds Fatigue +2; C costs Fairness −2 and adds Fatigue +4. Cases late in the season also open more worn down, reaching Fatigue +14 and Time left −8 in the last case.</p>

<h2>Rule of the Week</h2>
<p>The Rule of the Week is an extra rule that holds only in certain weeks, currently about one week in two. Weeks change at midnight on Monday, Korea time. When you start a season you choose to start with the Rule of the Week (this week’s ranking) or without it (usual ranking); a first season starts with the usual rules by default.</p>
<ul>
<li><strong>NEAR WALL (The Wall is closer)</strong>: the Wall band stands 4 Heat earlier.</li>
<li><strong>HEAVY FRACTURE (The cracks run deep)</strong>: FRACTURE charges a cracked resource ×1.75.</li>
<li><strong>SHORT CLOCK (Time is short)</strong>: every hand has 8 seconds less, and every card’s chips are ×1.25.</li>
</ul>
<p>A season started in that week keeps its rule to the end, even after the week changes, and its records go on a separate ranking. Story Mode never gets a Rule of the Week.</p>

<h2>The report and the Burst Score</h2>
<p>When a case ends, the report gives it a Burst Score from 0 to 100. The score reads the grain of your judgment, not the size of your Vault:</p>
<ul>
<li><strong>Holding your line</strong> (the biggest share, about 22%): whether you kept the same side even as the Heat rose.</li>
<li><strong>Reading the hand</strong> (20%): what you earned against what someone who could see the Wall would have earned on the same hands, shown at the case’s close as “N% of what someone who could see the Wall would have”.</li>
<li><strong>Perspective shifts</strong> (16%): how evenly you used the four ways of thinking. Alternating just two can never reach the top.</li>
<li><strong>Redesigning the table</strong> (16%): reframing the table, opening hidden routes, meeting challenges and finding hidden records.</li>
<li><strong>Handling pressure</strong> (about 13%): decisions that lowered risk pressure, and pressure that rose and was later won back.</li>
<li><strong>Thinking rhythm</strong> (about 6%): how long you took after the table opened. 8 to 28 seconds is full marks; under 4 seconds is the lowest.</li>
</ul>
<p>A run of met scene challenges adds about 6% more. The <strong>Quick-answer penalty</strong> takes 5 points for each pick made within 2 seconds without reframing and without having read the briefing through, up to 18 points. Ranks are S from 88, A from 72, B from 52 and C below that.</p>
<p>Each case hides one record. From the case’s second decision on, it opens when you meet the scene’s challenge while moving risk pressure clearly or deciding within 12 seconds, or when a reframe opens the hidden route while meeting the challenge or lowering risk.</p>

<h2>Ranking and leagues</h2>
<p>Case records are ranked by Burst Score, and season records by the average of their case scores, with Perspective shifts read once more across the whole season. If you play a case again, the ranking keeps your first close, so your first play is the one that counts. Leagues split players by how they scored:</p>
<ul>
<li><strong>REFRAME LEAGUE</strong>: you reframed at least once and Redesigning is at least Handling pressure.</li>
<li><strong>RISK LEAGUE</strong>: Handling pressure is 12 or more points above Redesigning.</li>
<li><strong>SYSTEM LEAGUE</strong>: otherwise, Redesigning is 55 or more.</li>
<li><strong>FIELD LEAGUE</strong>: everyone else.</li>
</ul>
<p>A record played with Table Time other than ×1 shows that setting, and a season with any case opened in Story Mode stays off the public ranking.</p>

<h2>The end of a season</h2>
<p>There are nine endings, and the one you reach is read from the whole season, not the last case. It reads the season averages of your Trust, Fairness and Cash as each case closed, your average Human cost per case, the share of all hands that busted, the share of hidden records you found, how often a reframe opened a hidden route, how high the pressure stayed across the season, and the decision you make in the last case. An average Human cost of 20 or more a case, or busting in 20% or more of hands while averaging 10 or more Human cost, reads as a season that could not hold. On the other side, a season that kept a high multiplier without a single BUST, held a very long Logic Combo or banked a generous Vault per case needs slightly fewer records for the endings that ask for them. Which ending asks for what is yours to find out.</p>

<h2>Comfort settings and keyboard</h2>
<p>“Story Mode” moves the Wall to the last stretch of the gauge (88 to 98), runs the clock at least twice as slow, and switches off the nine rules that break a later hand, from BLACKOUT to Links. A BUST does not skip a scene. Logic Combo, LOCK, Stances and tools stay, but you cannot spend the Vault at the draft. “Table Time” sets the table’s clock to ×1, ×1.5 or ×2.</p>
<p>On a computer you can play with the keyboard alone.</p>
<ul>
<li>Briefing: Space, Enter or W opens the table; a number key opens it with that card staked.</li>
<li>Table: 1 to 9 stake a card (the wild card is the number after the last card). Space or W pushes, Enter commits (hold Enter when Commit has to be held), E is LOCK, Q changes Stance, R scouts and S pushes to the safe line.</li>
<li>Draft: 1 to 9 pick a tool, Esc picks nothing, R rerolls and B buys one more.</li>
<li>P saves and Shift+P saves and exits. On a case’s result screen, R plays the case again and N goes to the next case.</li>
</ul>
<p>Turn off “Use single-key shortcuts” and only Space, Enter and Esc remain.</p>

<h2>Tips for your first season</h2>
<ol>
<li><strong>Push at least once.</strong> While “Safe ×N” shows, a push cannot reach the Wall. Committing without a push brings COLD FEET, so pushes up to the safe line are free.</li>
<li><strong>Get more careful as the stake grows.</strong> A BUST takes the whole case’s stake, not just this hand. One more push late in a case bets every hand before it.</li>
<li><strong>Don’t leave the clock alone.</strong> After 4 seconds the clock adds Heat, and running out is a BUST with SILENCE on top. If you can’t decide, commit even at low Heat.</li>
<li><strong>Remember Heat 40 to 59.</strong> From Case 02, committing under 40 fills the Audit and committing at 60 or more brings HEAT DEBT. In between, you avoid both.</li>
<li><strong>Hold your side, change your thinking.</strong> It is the easiest way to raise your Logic Combo and your Perspective shifts score together.</li>
<li><strong>Read the briefing through.</strong> Changed rules are written there, and a table opened after a full read never draws the Quick-answer penalty. For the decision itself, 8 to 28 seconds is best for your rhythm.</li>
<li><strong>Use every BUST as data.</strong> The reveal shows where the Wall was and where the heartbeat heard it. Compare a few and your ear for the heartbeat sharpens fast.</li>
</ol>`,

  ja: `<p>このページは『臨界点: CRITICAL POINT』のルールを一つずつ解説するガイドです。ゲーム紹介のページが大きな流れを示すのに対して、ここでは画面の数字の一つ一つが何を意味し、一度の判断が次の勝負にどんな跡を残すのかを、ゲーム内の実際の数値で説明します。物語についてはプロローグの出発点より先には触れないので、初めての人も安心して読めます。</p>

<h2>一つの事件の流れ</h2>
<p>シーズンはプロローグの五つの事件と本編の五十の事件、合わせて五十五の事件でできています。事件は複数のシーンに分かれ、シーンはいつも同じ順番で進みます。まずブリーフィングを読み、テーブルでカードを一枚賭けて押し切るか確定し、判定の画面でその決定が何を変えたかを見ます。このテーブル一回を「勝負」と呼びます。確定して得た分はその事件の賭け金に積まれ、事件の最後のシーンが閉じてはじめて、賭け金全体が金庫に移ります。そのあとレポートが事件をバーストスコアで採点し、次の事件の最初のテーブルでツールを選ぶドラフトが開きます。</p>

<h2>ブリーフィングの読み方</h2>
<p>ブリーフィングには、場所と時刻、話す人の肖像とせりふ、たたまれた「事件ファイル」、そしてこのシーンが問う質問が入った「あなたの判断」の枠があります。シーンごとに、リスク圧力を下げる、卓の組み替えを試す、隠れたコストを見つける、といった「チャレンジ」が一つずつ掛かっていて、これを満たすとレポートのスコアと隠れた記録の両方に役立ちます。</p>
<p>読む時間は、本文とその勝負に付いたルール説明の長さに合わせて12秒から94秒のあいだで決まり、時間が来ると卓が自動で開きます。時計を押すと止まり、もう一度押すと再び流れます。「快適設定」の「読書時計の自動送りをオフ」をオンにすると、自動では進まなくなります。ブリーフィングの下のカードを押すとそのカードを賭けた状態で卓が開き、「卓を開く」を押すとカードなしで開きます。</p>
<p>上のほうに「持ち越し · この勝負に続くルール」や「この勝負のルールが変わった」が出ていたら、必ず読んでください。前の勝負の決定のせいで、この勝負の壁、時計、カードが変わったという意味です。また、読む時間の70%以上をブリーフィングで過ごしてから卓を開いた場合は、卓ですばやく選んでも即答とは見なされません。</p>

<h2>テーブルの解剖</h2>
<h3>カードとチップ</h3>
<p>選択肢一つがカード一枚です。カードには、確定したときにもらえるチップ、いちばん大きく燃やすリソース、そして二つのタグが付いています。一つはカードが人の側に傾くか立場の側に傾くかを示す方向で、もう一つはリスクを扱う、念入りに確かめる、最後まで粘る、卓を変える、のどれにあたるかという思考タイプです。チップは、カードがもたらす利益が大きいほど多くなります。一つのリソースを8以上燃やすカードには「ひびの候補」の印が付きます。</p>
<h3>ワイルドカード「卓を組み替える」</h3>
<p>勝負を変える道があるシーンには、このカードが一枚混ざっています。基本のチップは24で、残り時間6と疲労5を使う代わりに、信頼と公正さを3ずつくれます。方向は人の側、思考タイプは卓を変えるとして数えます。このカードで壁に触れずに確定してはじめて、その事件の隠れたルートが開きます。同じカードでもBUSTで終わればルートは開きません。</p>
<h3>熱ゲージと壁の区間</h3>
<p>熱は0から100までです。「押し切る」を押すたびに熱が7から15上がり、賭け金の倍率は熱11ごとに2倍になります。熱0で×1、22で×4、33で×8、60で約×44です。ゲージには壁がありうる区間が描かれていて、通常の勝負では56から92のあいだです。壁はその中の一点に隠れています。ゲージの30と60の目盛りは、それぞれCOLD FEETの封印が解ける熱と、HEAT DEBTが始まる熱です。</p>
<p>「現在のリスク」の欄は状況を三通りで伝えます。「壁まで最低 N」は次の一押しがいちばん大きく上がっても壁の区間までNが残るという意味、「押せば壁の射程内」は次の一押しが区間に届きうるという意味、「壁の区間内」はすでに区間に入っているという意味です。「安全線 ×N」は、壁がどこにあっても届かない一押しがあとN回あるという表示で、そのN回はまとめて押すこともできます。</p>
<h3>心拍</h3>
<p>壁の位置を教えてくれるのは心拍だけです。熱が壁から44以内に入ると心拍が壁を聞き取りはじめ、近いほど速くなり、最大190まで上がります。ただし、心拍が聞いている壁は実際の壁から最大18ずれていて、熱が高いときや時計がほとんど残っていないときは、壁と関係なく脈が速くなります。心拍は答えではなく計器です。BUSTすると、壁が実際にどこにあったかと、心拍が壁をどのあたりに聞いていたかが一緒に示されるので、自分の耳を合わせるのに使ってください。</p>
<h3>照会</h3>
<p>プロローグ03から「照会」が使えます。信頼1と勝負の時間3秒を払うと、壁の区間が20マス幅に絞られます。勝負ごとに一回だけで、絞られた区間の真ん中に壁があるという意味ではありません。</p>
<h3>賭け金と確定</h3>
<p>カードを賭けて「確定」を押すと、この勝負の取り分、つまりチップ × 熱の倍率 × ロジックコンボとLOCKのボーナスが、事件の賭け金に加わります。賭け金は事件が閉じるまで金庫の外にあります。事件の途中で一度でもBUSTすると、それまで積んだ賭け金はすべて消えます。事件の最後のシーンや、熱がすでに壁の区間に入っているときは、誤操作を防ぐため、確定を約0.6秒長押しするか、一度押してから3秒以内に「もう一度」を押すと確定します。</p>
<h3>BUST</h3>
<p>BUSTする道は三つです。押し切って壁に触れる、時計が上げた熱が壁に触れる、時間切れになる、の三つです。BUSTすると事件の賭け金が0になり、カードは利益なしにコストだけを払い、さらに信頼−6、公正さ−6、疲労+8、残り時間−4が加わります。物語の次のシーンも飛ばされます。すでに金庫に入ったものはそのままです。</p>
<h3>テーブルの時計</h3>
<p>勝負の標準の時間は45秒です。賭け金が大きくなると時計も短くなり、熱45からは40秒、熱65からは35秒になります。どの勝負も12秒より短くはなりません。卓が開いて4秒たつと、時計がひとりでに熱を上げはじめます。通常の勝負で毎秒0.5、押すたびにその速さが12%ずつ増え、「時計が上げる熱 N倍」と表示されます。じっとしていることもタダではありません。</p>
<h3>LOCKと構え</h3>
<p>プロローグ04からは、カードを賭けたあとにLOCKを押せます。一回押すたびに時間1.5秒がかかってチャージがたまり、カードのリソース効果が大きくなり、チップ倍率が最大1.5倍まで上がります。プロローグ05からは構えを選びます。STRIKEは倍率をいちばん速く伸ばし、STEADYは倍率が小さい代わりに、一度押したあとのLOCKごとに熱を2ずつ冷まし、EXPOSEはカードのリソース効果を大きく伸ばします。構えを変えるとチャージは0に戻ります。チャージ70以上で確定すると、構えの効果が次の勝負に持ち越されます。STRIKE WAKEはチップ1.25倍で一押しの幅が大きくなり、STEADY LINEは熱8低く、時間4秒多く、壁3遠くから始まり、EXPOSED HANDはカードが伏せられず、COLD FEETの封印も解けます。同じ構えでこれを3回確定すると、シーズンの熟練が付き、以後のすべての新しい勝負に小さな効果が乗ります。</p>

<h2>判断が残す跡</h2>
<p>このゲームの核心は、一つの勝負の決定が次の勝負のルールを変えることです。次のルールは最初から全部オンになるのではなく、かっこ内の事件で一つずつ開き、事件03からはすべてオンです。NEW GAME+で始めたシーズンは最初から全部オンです。</p>
<dl>
<dt>BLACKOUT（プロローグ02）</dt><dd>BUSTの次の勝負は、カードのチップと消耗が伏せられ、壁の区間が6近づきます。</dd>
<dt>AFTERSHOCK（プロローグ02）</dt><dd>BUSTの次の勝負は、熱22から始まります。</dd>
<dt>SILENCE（プロローグ02）</dt><dd>時間切れでBUSTすると、次の勝負は心拍が壁を知らせず、時間が30秒になります。</dd>
<dt>COLD FEET（プロローグ03）</dt><dd>一度も押さずに確定すると、次の勝負でチップがいちばん多いカードが熱30を超えるまで封印され、その勝負のチップが0.6倍に減ります。</dd>
<dt>HEAT DEBT（プロローグ03）</dt><dd>熱60以上で確定すると、次の勝負はその熱の3分の1を抱えて始まり、時間が12秒減ります。</dd>
<dt>FRACTURE（プロローグ04）</dt><dd>確定でもBUSTでも、直前のカードが一つのリソースを8以上燃やしていたら、次の勝負でそのリソースを燃やすカードは1.5倍で請求されます。</dd>
<dt>OVERCLOCK（事件01）</dt><dd>×4以上で2回続けて確定すると、次の勝負のチップが2倍になりますが、押したときに上がる熱も大きくなります。罰ではなくチャンスで、×4以上の確定を続けるあいだは続きます。</dd>
<dt>監査、AUDIT（事件02）</dt><dd>一度以上押して熱40未満で確定すると監査が1マス埋まり、60以上で確定すると2マス減ります。事件が閉じるとき4マス埋まっていると、金庫へ行く取り分の4分の1を失います。</dd>
<dt>連結、CASCADE（事件03）</dt><dd>一つのリソースを8以上燃やすカードで確定すると連結ができ、2〜4勝負あとのひとつの勝負で壁の区間が6近づきます。事件が閉じるとき、残った連結はいちばん新しい一つだけが次の事件に持ち越されます。</dd>
</dl>
<p>事件が閉じるとREBOOTが起き、こうした跡はリセットされます。これとは別に、各幕の最後の事件は「山場の勝負」で、すべての勝負の壁が5近づき、チップが1.25倍になります。シーズンが進むにつれてテーブルも少しずつ傾き、100勝負ごとに壁の区間の上端が2ずつ下がり、時計が上げる熱が少し増えます（最大4回）。</p>

<h2>ロジックコンボ</h2>
<p>プロローグ02から開くロジックコンボは、カードの方向で積み上がります。同じ方向（人の側か立場の側）を3回続けて選んだときから一段ずつ上がり、一段ごとに賭け金が6.25%ずつ増えて、コンボ10で最大×1.6になります。勝負を閉じた熱は30未満、30〜59、60以上の三つの帯に分かれ、直前の勝負がその前の勝負より高い帯で閉じていれば、方向を変えても「転換」と認められてコンボが上がります。守っていた方向のカードがシーンになかったときや、どちらにも傾かないカードを選んだときは、コンボはそのままです。一方、熱が上がっていないのに方向を変えると0に途切れ、BUSTでも途切れます。コンボとLOCKを合わせたボーナスは×1.6を超えません。</p>
<p>コンボは壁も一押しの幅も動かしません。コンボが長いからといって、その勝負が安全になるわけではないということです。レポートの「視点の転換」スコアは思考タイプをまんべんなく使うほど上がるので、方向は守りつつタイプは変えるのが、両方を取るいちばんの道です。</p>

<h2>ツール</h2>
<p>プロローグ05からは、事件が閉じるたびに、次の事件の最初のテーブルでツールのドラフトが開きます。三つのうち一つを選び、選ぶまで時計は止まっています。ツールは五つまで持て、いっぱいになったら一つを置いてから新しいものを持ちます。何も選ばなければ「ひと息つく」になり、その事件の最初の勝負の時間が10秒延び、壁が3遠ざかります。金庫から4,000を払えば「引き直し」、12,000を払えば「もう一つ」ができます。どちらもドラフトごとに一回で、ツールを選ぶ前だけです。もう一つを買ったドラフトは、選ばずに進んでもひと息つけません。もう一つは金庫を大きく減らすので、枠が空いているときだけにしましょう。</p>
<p>いくつか例を挙げると、「メトロノーム」は熱が上がった次のシーンまで方向を変えても転換として認めてくれ、「冷血」はAFTERSHOCKを熱22ではなく11から始めさせ、「放熱板」はHEAT DEBTを熱の6分の1と6秒に減らします。条件を満たしてはじめて図鑑で解放されるツールもあります。ロジックコンボ8を達成するとBUSTしてもコンボが残る「アンコール」が、賭け金5,000以上を壁に失うと事件ごとに一回賭け金の3分の1を守る「保険」が、SILENCEを一度経験するとその中でも心拍が壁を指し続ける「聴診器」が解放されます。</p>

<h2>六つのリソース</h2>
<p>リソースは、残り時間、現金、信頼、公正さ、人的被害、疲労の六つです。基本の出発値は、残り時間72、現金100、信頼50、公正さ50、人的被害0、疲労10です。最初の四つは高いほど良く、人的被害と疲労は上がるほど損です。カードの利益は確定したときの熱の分だけ大きくなり、熱60なら1.9倍、100なら2.5倍になりますが、コストは熱と関係なくそのまま請求されます。</p>
<p>事件ごとにリソースは出発値からやり直しますが、前の事件の結果が出発を変えます。直前の事件のランクがSなら信頼+4と公正さ+3、Aなら信頼+2と公正さ+1を持って始まり、Bなら疲労+2、Cなら公正さ−2と疲労+4を抱えて始まります。シーズンの後半ほど事件は疲れた状態で開き、最後の事件では疲労+14と残り時間−8が付きます。</p>

<h2>今週のルール</h2>
<p>「今週のルール」は特定の週にだけ立つ追加のルールで、今の編成はおおむね二週に一回です。週は韓国時間の月曜0時に切り替わります。シーズンを始めるときに、今週のルールで始めるか（今週のランキングへ）、ルールなしで始めるか（通常のランキングへ）を選び、最初のシーズンは通常のルールが基本です。</p>
<ul>
<li><strong>NEAR WALL（壁が近い）</strong>: 壁の区間が熱4だけ手前に立ちます。</li>
<li><strong>HEAVY FRACTURE（ひびが深い）</strong>: FRACTUREがひびの入ったリソースを1.75倍で請求します。</li>
<li><strong>SHORT CLOCK（時間が短い）</strong>: 勝負ごとに時間が8秒短く、すべてのカードのチップが1.25倍です。</li>
</ul>
<p>その週に始めたシーズンは、週が変わっても最後までそのルールで進み、記録は別に積まれます。ストーリーモードには付きません。</p>

<h2>レポートとバーストスコア</h2>
<p>事件が終わると、レポートがバーストスコア（0〜100）を付けます。金庫の大きさではなく、判断の質を見る項目でできています。</p>
<ul>
<li><strong>基準の維持</strong>（いちばん大きな割合、約22%）: 熱が上がったシーンでも同じ方向を守ったか。</li>
<li><strong>勝負の読み</strong>（20%）: 同じ勝負を壁が見えている人が打っていたら稼いだ金庫と比べた、自分の取り分。事件が閉じるとき「壁が見えていた人のN%」として出ます。</li>
<li><strong>視点の転換</strong>（16%）: 四つの思考タイプをどれだけまんべんなく使ったか。二つのタイプを交互に使うだけでは満点に届きません。</li>
<li><strong>構造の再設計</strong>（16%）: 卓を組み替え、隠れたルートを開き、チャレンジを満たし、隠れた記録を見つけた度合い。</li>
<li><strong>圧力への対応</strong>（約13%）: リスク圧力を下げた決定と、跳ね上がった圧力をあとで回収した跡。</li>
<li><strong>思考のリズム</strong>（約6%）: 卓が開いてから決めるまでの時間。8〜28秒が満点で、4秒未満がいちばん低くなります。</li>
</ul>
<p>これに、シーンチャレンジを続けて満たした分が約6%加わります。<strong>即答ペナルティ</strong>は、卓を組み替えず、ブリーフィングも十分に読まないまま2秒以内に選んだ決定一つごとに5点、最大18点を引きます。ランクは88点以上がS、72点以上がA、52点以上がB、それ未満がCです。</p>
<p>事件ごとに隠れた記録が一つずつあります。事件の二つ目の決定から、チャレンジを満たしながらリスク圧力を大きく動かすか12秒以内に決めたとき、または卓を組み替えて隠れたルートを開きながら、チャレンジを満たすかリスクを下げたときに開きます。</p>

<h2>ランキングとリーグ</h2>
<p>事件の記録はバーストスコアで、シーズンの記録は事件スコアの平均で順位が付きます。シーズン記録の視点の転換だけは、シーズン全体の思考タイプを集めて読み直します。同じ事件をやり直しても、ランキングには最初に閉じた記録が残るので、最初のプレイが本当の記録です。リーグは、スコアをどう取ったかで分かれます。</p>
<ul>
<li><strong>REFRAME LEAGUE</strong>: 一度以上卓を組み替え、構造の再設計が圧力への対応以上のとき。</li>
<li><strong>RISK LEAGUE</strong>: 圧力への対応が構造の再設計より12点以上高いとき。</li>
<li><strong>SYSTEM LEAGUE</strong>: それ以外で、構造の再設計が55点以上のとき。</li>
<li><strong>FIELD LEAGUE</strong>: 残りすべて。</li>
</ul>
<p>テーブル時間を1倍以外にした記録にはその倍率が表示され、ストーリーモードで開いた事件があるシーズンは公開ランキングに載りません。</p>

<h2>シーズンの終わり</h2>
<p>結末は九つあり、最後の事件一つではなく、シーズン全体を読んで決まります。読むのは、各事件が閉じたときの信頼、公正さ、現金のシーズン平均、事件あたりの平均の人的被害、全勝負のうちBUSTした勝負の割合、隠れた記録を見つけた割合、卓を組み替えて隠れたルートを開いた割合、シーズンを通して圧力がどれだけ高かったか、そして最後の事件で下す決定です。人的被害が事件あたり平均20以上、または勝負の20%以上でBUSTしつつ人的被害も平均10以上なら、シーズンは持ちこたえられなかったと読まれます。逆に、BUSTなしで高い倍率を守ったり、ロジックコンボをとても長く続けたり、事件あたりの金庫をたっぷり積んだりしたシーズンは、記録を求める結末の敷居が少し下がります。どの結末が何を求めるのかは、ご自身で確かめてください。</p>

<h2>快適設定とキーボード</h2>
<p>「ストーリーモード」は壁をゲージの最後の区間（88〜98）に移し、時計を2倍以上遅くし、BLACKOUTから連結まで、あとの勝負を崩す九つのルールをオフにします。BUSTしてもシーンは飛ばされません。ロジックコンボ、LOCK、構え、ツールはそのまま残りますが、ドラフトで金庫を使うことはできません。「テーブル時間」は卓の時計を1倍、1.5倍、2倍から選びます。</p>
<p>パソコンではキーボードだけで遊べます。</p>
<ul>
<li>ブリーフィング: Space、Enter、Wで卓を開き、数字キーでそのカードを賭けた状態で開きます。</li>
<li>テーブル: 1〜9でカードを賭けます（ワイルドカードは最後のカードの次の番号）。SpaceかWで押し切る、Enterで確定（長押しが必要なときはEnterを押し続ける）、EはLOCK、Qは構えの切り替え、Rは照会、Sは安全線まで押す、です。</li>
<li>ドラフト: 1〜9でツールを選び、Escは選ばない、Rは引き直し、Bはもう一つです。</li>
<li>Pは保存、Shift+Pは保存して終了。事件の結果画面では、Rでその事件をやり直し、Nで次の事件へ進みます。</li>
</ul>
<p>「1文字のショートカットキーを使う」をオフにすると、Space、Enter、Escだけが残ります。</p>

<h2>初めての人へのアドバイス</h2>
<ol>
<li><strong>一度は押しましょう。</strong>「安全線 ×N」が出ているあいだの一押しは壁に届きません。押さずに確定するとCOLD FEETが来るので、安全線までは無料で押せるということです。</li>
<li><strong>賭け金が積まれるほど慎重に。</strong>BUSTはこの勝負だけでなく、事件の賭け金をすべて持っていきます。事件の終盤の「もう一押し」は、それまでのすべての勝負を賭けた勝負です。</li>
<li><strong>時計を放っておかないでください。</strong>4秒後から時計が熱を上げ、時間切れはBUSTにSILENCEまで付きます。決めきれないなら、低い熱でも確定するほうがましです。</li>
<li><strong>熱40〜59を覚えておきましょう。</strong>事件02からは、40未満の確定は監査を埋め、60以上の確定はHEAT DEBTを呼びます。そのあいだは両方を避けられる帯です。</li>
<li><strong>方向は守り、タイプは変えましょう。</strong>ロジックコンボと視点の転換スコアを一緒に上げる、いちばん簡単な方法です。</li>
<li><strong>ブリーフィングは最後まで読みましょう。</strong>変わったルールがそこに書かれていて、読み終えてから開いた卓では、すばやく選んでも即答ペナルティを受けません。決定そのものは8〜28秒のあいだに下すのが、リズムのスコアにいちばん良いです。</li>
<li><strong>BUSTを記録として使いましょう。</strong>判定の画面は、壁がどこにあったかと、心拍がどこに聞いていたかを見せてくれます。何度か見比べるだけで、心拍を読む感覚がすぐに身につきます。</li>
</ol>`,
};
