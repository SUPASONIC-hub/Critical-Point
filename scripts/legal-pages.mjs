import { SUPPORT_CONTACT } from "../src/appConfig.js";
import { DATA_RETENTION_DAYS, PLAYTEST_DATA_NOTICE, PRIVACY_PAGE_PATH, SITE_PAGES } from "../src/privacyText.js";
import { analyticsTagLines, withSwaps } from "./analytics-config.mjs";

/**
 * The privacy policy and the terms of use, Korean, English and Japanese: six
 * plain pages the build writes beside `index.html` (`legalPages()` in
 * vite.config.js), at addresses a store listing can name.
 *
 *   /privacy.html  /en/privacy.html  /ja/privacy.html
 *   /terms.html    /en/terms.html    /ja/terms.html
 *
 * The Korean text is the one the others are translated from; each page's
 * header links the other two languages.
 *
 * Files and not screens of the app: a reviewer or a crawler opens the address
 * with no script, the entry chunk carries nothing of them but the two paths
 * (src/privacyText.js), and the host serves a file at its own name without a
 * rewrite rule -- the live service takes its settings from the dashboard, not
 * from render.yaml. The service worker answers them network first and keeps
 * a copy, so a device that has had a table up can read them offline
 * (src/serviceWorker/worker.js).
 *
 * What the policy lists is held to what the code sends. `REMOTE_FIELDS` names,
 * for every column anon may write (the column grants in supabase/migrations)
 * and every argument of the online save, which item of the policy covers it;
 * tests/unit/legal-pages.test.mjs reads the grants and the client and fails on
 * a column the policy does not name. The sentence beside the consent box is
 * `PLAYTEST_DATA_NOTICE`, quoted here as written there.
 *
 * Settled on 2026-10-25 (앱출시-문서초안, 사용자 결정 2·3): only what the law asks
 * for; no operator or officer name -- 「임계점 개발자」 and the support address;
 * the overseas transfer as one line naming the company and the country; the
 * consent box still starts ticked, and the policy says so; the web version has
 * no ads.
 */

const EFFECTIVE_DATE = { ko: "2026년 10월 25일", en: "October 25, 2026", ja: "2026年10月25日" };

/** Each item the policy lists, by key, in each language. */
export const DATA_ITEMS = {
  deviceId: {
    ko: "이 기기에서 만든 무작위 식별 번호(세션 번호)와 그 끝 8자리인 세션 코드",
    en: "a random ID created on this device (session ID) and its last 8 characters, the session code",
    ja: "この端末で作成したランダムな識別番号(セッション番号)と、その末尾8桁であるセッションコード",
  },
  runId: {
    ko: "판마다 새로 만드는 무작위 기록 번호",
    en: "a random run ID made for each playthrough",
    ja: "プレイごとに新しく作成するランダムな記録番号",
  },
  eventId: {
    ko: "같은 기록이 두 번 저장되지 않게 하는 무작위 전송 번호",
    en: "a random delivery ID that keeps a record from being stored twice",
    ja: "同じ記録が二重に保存されないようにするランダムな送信番号",
  },
  anonName: {
    ko: "랭킹 표시 이름(늘 「익명 분석관」으로 고정)",
    en: "the leaderboard name, always \"Anonymous analyst\"",
    ja: "ランキングの表示名(常に「匿名分析官」に固定)",
  },
  caseResult: {
    ko: "사건 결과(사건 이름, 결과 요약과 점수, 게임 속 자원·성향 수치, 완료 시각)",
    en: "case results (the case, its summary and score, in-game resources and tendencies, completion time)",
    ja: "事件の結果(事件名、結果の要約と点数、ゲーム内の資源・傾向の数値、完了時刻)",
  },
  locale: {
    ko: "화면 언어(이 기기에서 고른 한국어·영어·일본어 중 하나, 사건 결과와 함께)",
    en: "the screen language (Korean, English or Japanese, as chosen on this device, sent with each case result)",
    ja: "画面の言語(この端末で選んだ韓国語・英語・日本語のいずれか。事件の結果とともに送信)",
  },
  choiceLog: {
    ko: "선택 기록과 응답 시간(고른 카드, 결정에 걸린 시간, 판의 진행 기록)",
    en: "choices and response times (the cards played, the time each decision took, how the table went)",
    ja: "選択の記録と応答時間(選んだカード、判断にかかった時間、勝負の進行記録)",
  },
  feedback: {
    ko: "보낸 피드백(이해도·난이도 평가와 자유 의견)",
    en: "feedback you send (clarity and difficulty ratings and your comment)",
    ja: "送信したフィードバック(わかりやすさ・難易度の評価と自由記述の意見)",
  },
  errorReport: {
    ko: "오류 보고(오류 이름·내용·코드 위치, 글자 없이 요소 이름만 적은 화면 구조, 화면 크기, 오류가 난 사건·장면, 발생 시각)",
    en: "error reports (the error's name, message and code location, the screen's structure as element names without any text, screen size, the case and scene, the time)",
    ja: "エラー報告(エラーの名前・内容・コードの位置、文字を含まず要素名だけを記した画面構造、画面サイズ、エラーが起きた事件・シーン、発生時刻)",
  },
  boardPost: {
    ko: "닉네임, 글 내용(300자 이내), 작성 시각",
    en: "your nickname, your post (up to 300 characters) and when it was posted",
    ja: "ニックネーム、投稿内容(300文字以内)、投稿時刻",
  },
  boardWriterId: {
    ko: "게시판 전용 무작위 작성자 번호(플레이테스트 데이터의 식별 번호와 다름)",
    en: "a random writer ID used only by the board (not the playtest session ID)",
    ja: "掲示板専用のランダムな投稿者番号(プレイテストデータの識別番号とは別のもの)",
  },
  boardReport: {
    ko: "신고한 글의 번호와 고른 신고 사유(직접 적는 칸 없음)",
    en: "the number of the post you report and the reason you pick (there is no free text)",
    ja: "通報した投稿の番号と、選んだ通報理由(自由記入欄はありません)",
  },
  cloudSave: {
    ko: "게임 진행 저장본(분석관 이름, 피드백 자유 의견, 전송 대기 기록은 빼고 올림)과 저장 시각",
    en: "your save (without your analyst name, feedback comments or unsent records) and when it was saved",
    ja: "ゲーム進行のセーブデータ(分析官の名前、フィードバックの自由記述、送信待ちの記録は除いてアップロード)と保存時刻",
  },
  cloudCode: {
    ko: "이어하기 코드(서버에는 코드가 아닌 SHA-256 변환값으로 저장)",
    en: "your continue code (stored as a SHA-256 hash, never as the code itself)",
    ja: "続行コード(サーバーにはコードそのものではなく、SHA-256で変換した値で保存)",
  },
  address: { ko: "접속 IP 주소", en: "your IP address", ja: "接続元のIPアドレス" },
};

/**
 * Keys of a case row's `summary` (a `caseResult` column) that the policy names
 * as items of their own: the page's language (src/state/useChoiceCommit.js
 * toRowSummary; 앱출시-F F-6), which a reader would not take for a result.
 */
export const SUMMARY_FIELDS = { locale: "locale" };

/**
 * Every column anon may write and every online-save argument, and the item
 * that covers it. The test holds this to the grants and the client both ways.
 */
export const REMOTE_FIELDS = {
  playtest_sessions: {
    event_id: "eventId",
    session_id: "deviceId",
    session_code: "deviceId",
    run_id: "runId",
    player_name: "anonName",
    case_id: "caseResult",
    case_title: "caseResult",
    completed_at: "caseResult",
    summary: "caseResult",
    resources: "caseResult",
    triggers: "caseResult",
    cognition: "caseResult",
    decision_log: "choiceLog",
    dynamics: "choiceLog",
  },
  playtest_feedback: {
    event_id: "eventId",
    session_id: "deviceId",
    session_code: "deviceId",
    case_id: "feedback",
    feedback: "feedback",
  },
  app_error_logs: {
    event_id: "eventId",
    session_id: "deviceId",
    session_code: "deviceId",
    occurred_at: "errorReport",
    source: "errorReport",
    current_case: "errorReport",
    node_id: "errorReport",
    error_name: "errorReport",
    error_message: "errorReport",
    error_stack: "errorReport",
    component_stack: "errorReport",
    dom_snapshot: "errorReport",
    viewport: "errorReport",
    context: "errorReport",
    error: "errorReport",
  },
  board_posts: {
    event_id: "eventId",
    session_id: "boardWriterId",
    nickname: "boardPost",
    body: "boardPost",
  },
  board_reports: {
    event_id: "eventId",
    post_id: "boardReport",
    session_id: "boardWriterId",
    reason: "boardReport",
  },
  put_cloud_save: {
    p_code: "cloudCode",
    p_saved_at: "cloudSave",
    p_payload: "cloudSave",
    p_expected_revision: "cloudSave",
  },
};

const PLAYTEST_ITEMS = ["deviceId", "runId", "eventId", "anonName", "caseResult", "locale", "choiceLog", "feedback", "errorReport"];

const escapeHtml = (text) =>
  String(text).replace(/[&<>"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[character]);
const items = (keys, language) => `<ul>${keys.map((key) => `<li>${escapeHtml(DATA_ITEMS[key][language])}</li>`).join("")}</ul>`;
const mail = `<a href="mailto:${SUPPORT_CONTACT}">${SUPPORT_CONTACT}</a>`;
const days = DATA_RETENTION_DAYS;

const PRIVACY_KO = `
<p>임계점 개발자(이하 “개발자”)는 게임 「임계점: CRITICAL POINT」(이하 “게임”)를 운영하면서 「개인정보 보호법」에 따라 이용자의 개인정보를 보호하고 관련 고충을 빠르게 처리하기 위해 이 방침을 둡니다.</p>

<h2>1. 요약</h2>
<ul>
<li>회원가입과 로그인이 없습니다. 이름, 이메일, 전화번호, 주소를 받지 않습니다.</li>
<li>게임에서 정하는 분석관 이름은 이 기기에만 저장되고 서버로 보내지 않습니다.</li>
<li>진행은 기본적으로 이 기기(브라우저 저장소)에만 저장됩니다. 서버로 가는 정보는 아래 2번의 네 가지뿐입니다.</li>
<li>지금은 광고가 없고, 광고·분석용 쿠키나 외부 추적 도구를 쓰지 않습니다.</li>
</ul>

<h2>2. 처리하는 개인정보의 항목, 목적, 보유 기간</h2>
<h3>(1) 플레이테스트 데이터 — 첫 화면 「데이터 저장 안내」의 「플레이테스트 데이터 제공 동의」</h3>
<ul>
<li>동의 방식: 처음 실행할 때 동의 상자가 <strong>켜진 상태로 시작</strong>합니다. 첫 화면에 그 사실과 끄는 곳을 알리며, 상자를 끄면 그때부터 보내지 않습니다. 끈 기기는 꺼진 채로 남고, 게임을 초기화하면 다시 켜진 상태가 됩니다.</li>
<li>화면의 안내: “${escapeHtml(PLAYTEST_DATA_NOTICE)}”</li>
<li>항목: ${items(PLAYTEST_ITEMS, "ko")}</li>
<li>목적: 게임 난이도와 이야기를 고치기 위한 연구, 공개 랭킹 산정, 다른 참가자에게 보여 주는 집계 통계(장면별 선택·실패 비율처럼 개인을 알아볼 수 없는 수치), 오류 수정</li>
<li>보유 기간: 서버에 저장된 날부터 ${days}일 뒤 자동 삭제</li>
<li>동의를 끄면 아직 보내지 못한 대기 기록도 이 기기에서 지웁니다. 이미 보낸 기록을 지우려면 7번의 방법으로 요청해 주세요.</li>
<li>공개 랭킹에는 이름 대신 「익명 분석관」과 기록 번호 끝 8자리만 표시됩니다.</li>
</ul>
<h3>(2) 다른 기기에서 이어하기 — 「온라인 저장 사용」을 직접 켠 경우(기본은 꺼짐)</h3>
<ul>
<li>항목: ${items(["cloudSave", "cloudCode"], "ko")}</li>
<li>목적: 다른 기기에서 같은 진행을 이어 하기</li>
<li>보유 기간: 마지막 저장으로부터 ${days}일 뒤 자동 삭제. 「다른 기기에서 이어하기」 패널에서 서버 사본을 바로 지울 수 있습니다.</li>
</ul>
<h3>(3) 참가자 게시판 — 글을 쓰거나 신고한 경우</h3>
<ul>
<li>항목: ${items(["boardPost", "boardWriterId", "boardReport"], "ko")}</li>
<li>목적: 다른 참가자에게 글을 보여 주기(닉네임, 글, 작성 시각은 공개됩니다), 도배와 광고 글 막기, 신고된 글 검토(신고는 공개되지 않습니다)</li>
<li>보유 기간: 작성일로부터 ${days}일 뒤 자동 삭제. 신고는 그 글과 함께 지워집니다. 운영 원칙에 어긋나는 글은 숨길 수 있습니다.</li>
<li>글에 실명, 연락처, 회사 이름을 쓰지 마세요. 링크, 전화번호, 이메일 주소가 든 글은 등록되지 않습니다.</li>
</ul>
<h3>(4) 접속 정보 — 위 기능이 서버에 요청할 때 자동으로 생성</h3>
<ul>
<li>항목: ${items(["address"], "ko")}</li>
<li>목적: 자동 등록과 과도한 요청을 막는 요청 횟수 제한</li>
<li>처리 방법과 보유 기간: IP 주소 자체는 저장하지 않고, 서버만 아는 값을 섞어 되돌릴 수 없게 바꾼 값만 씁니다. 요청 횟수를 세는 값은 하루 안에 지우고, 게시판 글에 붙은 값은 글과 함께 ${days}일 뒤 지웁니다.</li>
</ul>

<h2>3. 이 기기에 저장하는 정보(자동 수집 장치)</h2>
<p>게임은 쿠키를 쓰지 않습니다. 진행, 설정, 로컬 순위, 복구 지점, 무작위 식별 번호는 브라우저 저장소(localStorage)에, 게임 파일은 오프라인 실행을 위한 캐시에 저장됩니다. 이 정보는 2번에서 켠 기능 말고는 기기 밖으로 나가지 않으며, 게임의 「초기화」나 브라우저의 사이트 데이터 삭제로 지울 수 있습니다.</p>

<h2>4. 개인정보의 파기</h2>
<p>보유 기간이 끝난 정보는 매일 실행되는 자동 작업으로 지체 없이 삭제합니다. 전자 파일은 복구할 수 없는 방법으로 삭제합니다.</p>

<h2>5. 개인정보의 제3자 제공</h2>
<p>이용자의 정보를 제3자에게 제공하거나 팔지 않습니다. 법령에 따라 요구되는 경우만 예외로 합니다.</p>

<h2>6. 처리 위탁과 국외 이전</h2>
<p>Supabase Inc.(미국): 2번 (1)~(4)의 정보를 저장하는 데이터베이스 운영을 맡기며, 기능을 쓸 때 네트워크로 전송되어 미국 회사의 서버에 2번의 보유 기간 동안 저장됩니다.</p>
<p>국외 이전을 원하지 않으면 플레이테스트 데이터 제공 동의를 끄고 온라인 저장과 게시판을 쓰지 않으면 됩니다. 게임의 이야기와 판은 이 기능 없이 끝까지 할 수 있습니다.</p>

<h2>7. 이용자의 권리와 행사 방법</h2>
<ul>
<li>이용자는 언제든 자신의 개인정보 열람, 정정, 삭제, 처리 정지를 요청하고 동의를 철회할 수 있습니다. 법정대리인이나 위임받은 사람을 통해서도 요청할 수 있습니다.</li>
<li>동의 철회와 처리 정지: 「데이터 저장 안내」의 동의 상자를 끄면 됩니다. 온라인 저장은 패널에서 끄고 서버 사본을 지울 수 있습니다.</li>
<li>열람·삭제 요청: 게임은 이름을 받지 않으므로 「데이터 저장 안내」와 결과 화면에 보이는 <strong>8자리 세션 코드</strong>를 ${mail}로 보내 주세요(온라인 저장은 이어하기 코드, 게시판 글은 닉네임과 작성 시각). 해당 기록을 찾아 처리하고 10일 안에 결과를 알려 드립니다.</li>
</ul>

<h2>8. 만 14세 미만 아동</h2>
<p>게임은 만 14세 미만 아동을 대상으로 하지 않습니다. 만 14세 미만이라면 플레이테스트 데이터 제공 동의를 끄고 온라인 저장과 게시판을 쓰지 마세요. 만 14세 미만 아동의 정보가 저장된 것을 알게 되면 지체 없이 삭제합니다.</p>

<h2>9. 안전성 확보 조치</h2>
<p>전송 구간 암호화(HTTPS), 데이터베이스 접근 권한 최소화(익명 사용자는 정해진 기능으로만 쓰고 다른 사람의 기록을 읽을 수 없음), 요청 횟수 제한, 이어하기 코드와 접속 주소의 변환 저장.</p>

<h2>10. 광고</h2>
<p>지금은 광고가 없습니다. 나중에 광고를 붙이게 되면, 붙이기 전에 광고와 관련한 처리 내용(광고 회사, 쿠키, 거부하는 법)을 이 방침에 더해 알립니다.</p>

<h2>11. 개인정보 보호 문의처</h2>
<ul>
<li>담당: 임계점 개발자</li>
<li>이메일: ${mail}</li>
<li>개인정보 침해 신고·상담: 개인정보침해신고센터(privacy.kisa.or.kr, 국번 없이 118), 개인정보분쟁조정위원회(www.kopico.go.kr, 1833-6972), 대검찰청(www.spo.go.kr, 국번 없이 1301), 경찰청(ecrm.police.go.kr, 국번 없이 182)</li>
</ul>

<h2>12. 방침의 변경</h2>
<p>이 방침을 바꾸면 시행 7일 전부터 이 페이지에 알리고, 이용자 권리에 중요한 변경은 30일 전부터 알립니다.</p>
`;

const PRIVACY_EN = `
<p>This policy explains what the developer of Critical Point (“we”) processes when you play the game, why, and for how long.</p>

<h2>1. In short</h2>
<ul>
<li>There is no sign-up or login. We do not collect your name, email address, phone number or postal address.</li>
<li>The analyst name you choose stays on your device and is never sent to our servers.</li>
<li>Your progress is saved on your device (browser storage) by default. Only the four kinds of data in section 2 ever reach a server.</li>
<li>The game currently shows no ads and uses no advertising or analytics cookies or third-party trackers.</li>
</ul>

<h2>2. What we process, why, and for how long</h2>
<h3>(a) Playtest data — “Playtest data sharing” (플레이테스트 데이터 제공 동의) in “Data storage” (데이터 저장 안내) on the start screen</h3>
<ul>
<li>How consent works: the box is <strong>ticked by default</strong> on first launch. The start screen says so and where to turn it off; untick it and nothing more is sent. A device that turned it off stays off; resetting the game turns it back on.</li>
<li>What we collect: ${items(PLAYTEST_ITEMS, "en")}</li>
<li>Why: research to improve the game's difficulty and story, the public leaderboard, aggregate statistics shown to other players (such as how often a scene's choices are picked or fail, which identify no one), and fixing bugs.</li>
<li>How long: deleted automatically ${days} days after it is stored.</li>
<li>Turning consent off also clears any records still waiting to be sent from your device. To delete records already sent, see section 7.</li>
<li>The leaderboard shows no names, only “Anonymous analyst” and the last 8 characters of a run ID.</li>
</ul>
<h3>(b) Continue on another device — only if you turn on “Use online save” (온라인 저장 사용; off by default)</h3>
<ul>
<li>What we collect: ${items(["cloudSave", "cloudCode"], "en")}</li>
<li>Why: to continue the same progress on another device.</li>
<li>How long: deleted automatically ${days} days after the last upload, or immediately from the “Continue on another device” (다른 기기에서 이어하기) panel.</li>
</ul>
<h3>(c) Player board — only if you post or report a post</h3>
<ul>
<li>What we collect: ${items(["boardPost", "boardWriterId", "boardReport"], "en")}</li>
<li>Why: to show your post to other players (nickname, post and time are public), to stop spam, and to review reported posts (reports are not public).</li>
<li>How long: deleted automatically ${days} days after posting; a report is deleted with its post. Posts that break the board's rules may be hidden.</li>
<li>Do not write real names, contact details or company names. Posts with links, phone numbers or email addresses are rejected.</li>
</ul>
<h3>(d) Connection data — created when one of the features above contacts the server</h3>
<ul>
<li>What we collect: ${items(["address"], "en")}</li>
<li>Why: to rate-limit requests and stop automated posting.</li>
<li>How: the address itself is never stored, only a one-way hash mixed with a value only the server knows. Request counters are cleared within a day; the hash attached to a board post is deleted with the post after ${days} days.</li>
</ul>

<h2>3. What is stored on your device</h2>
<p>The game uses no cookies. Progress, settings, local rankings, recovery points and the random ID are kept in browser storage (localStorage), and the game's files in a cache for offline play. None of it leaves your device except through the features in section 2, and “Reset” (초기화) in the game or clearing the site's data in your browser removes it.</p>

<h2>4. Deletion</h2>
<p>Data past its retention period is deleted by an automatic daily job, in a way that cannot be recovered.</p>

<h2>5. Sharing</h2>
<p>We do not sell your data or share it with third parties, except where required by law.</p>

<h2>6. Service provider and international transfer</h2>
<p>Supabase Inc. (USA) runs the database that stores the data in section 2 (a)–(d); it is sent over the network when you use those features and kept on that company's servers for the periods in section 2.</p>
<p>To avoid the transfer, turn playtest data sharing off and do not use online save or the board. The whole story and every table remain playable without them.</p>

<h2>7. Your rights</h2>
<ul>
<li>You can ask to access, correct or delete your data, or to stop its processing, and withdraw consent at any time, yourself or through a legal representative.</li>
<li>To withdraw consent: untick the box in “Data storage”. Online save can be turned off and its server copy deleted from its panel.</li>
<li>To access or delete records: because we do not know your name, send the <strong>8-character session code</strong> shown in “Data storage” and on the result screen to ${mail} (for online save, your continue code; for a board post, its nickname and time). We will find the records and reply within 10 days.</li>
<li>If you are in the EEA or the UK, you may also complain to your local data protection authority.</li>
</ul>

<h2>8. Children</h2>
<p>The game is not directed to children under 14. If you are under 14, turn playtest data sharing off and do not use online save or the board. If we learn that a child's data has been stored, we delete it without delay.</p>

<h2>9. Security</h2>
<p>HTTPS in transit, least-privilege database access (anonymous users reach only the game's own functions and cannot read anyone else's records), rate limiting, and hashed continue codes and addresses.</p>

<h2>10. Ads</h2>
<p>The game currently shows no ads. If ads are added later, this policy will describe them (the ad provider, cookies and how to opt out) before they appear.</p>

<h2>11. Contact</h2>
<ul>
<li>The Critical Point developer</li>
<li>Email: ${mail}</li>
</ul>

<h2>12. Changes</h2>
<p>We will post changes on this page 7 days before they take effect, or 30 days before for changes that matter to your rights.</p>
`;

const PRIVACY_JA = `
<p>臨界点開発者(以下「開発者」)は、ゲーム『臨界点: CRITICAL POINT』(以下「本ゲーム」)を運営するにあたり、大韓民国の「個人情報保護法」に従って利用者の個人情報を保護し、関連する苦情を速やかに処理するため、本方針を定めます。</p>

<h2>1. 概要</h2>
<ul>
<li>会員登録やログインはありません。氏名、メールアドレス、電話番号、住所は取得しません。</li>
<li>ゲーム内で決める分析官の名前はこの端末にのみ保存され、サーバーには送信しません。</li>
<li>進行は原則としてこの端末(ブラウザのストレージ)にのみ保存されます。サーバーに送られる情報は、下記2の4種類だけです。</li>
<li>現在、広告はなく、広告・分析用のCookieや外部のトラッキングツールも使用していません。</li>
</ul>

<h2>2. 取り扱う個人情報の項目、目的、保有期間</h2>
<h3>(1) プレイテストデータ — 最初の画面「データ保存の案内」の「プレイテストデータの提供に同意」</h3>
<ul>
<li>同意の方式: 初回起動時、同意のチェックボックスは<strong>オンの状態で始まります</strong>。最初の画面でそのことと、オフにする場所をお知らせしており、チェックを外すとその時点から送信しません。オフにした端末はオフのままとなり、ゲームをリセットすると再びオンの状態になります。</li>
<li>項目: ${items(PLAYTEST_ITEMS, "ja")}</li>
<li>目的: ゲームの難易度とストーリーを改善するための研究、公開ランキングの算出、他の参加者に表示する集計統計(シーンごとの選択・失敗の割合など、個人を識別できない数値)、エラーの修正</li>
<li>保有期間: サーバーに保存された日から${days}日後に自動削除</li>
<li>同意をオフにすると、まだ送信されていない待機中の記録もこの端末から削除します。すでに送信された記録の削除は、7の方法でご請求ください。</li>
<li>公開ランキングには、名前の代わりに「匿名分析官」と記録番号の末尾8桁だけが表示されます。</li>
</ul>
<h3>(2) 別の端末で続ける — 「オンライン保存を使う」をご自身でオンにした場合(初期設定はオフ)</h3>
<ul>
<li>項目: ${items(["cloudSave", "cloudCode"], "ja")}</li>
<li>目的: 別の端末で同じ進行を続けること</li>
<li>保有期間: 最後の保存から${days}日後に自動削除。「別の端末で続ける」パネルから、サーバー上のコピーをすぐに削除できます。</li>
</ul>
<h3>(3) 参加者掲示板 — 投稿または通報した場合</h3>
<ul>
<li>項目: ${items(["boardPost", "boardWriterId", "boardReport"], "ja")}</li>
<li>目的: 他の参加者に投稿を表示すること(ニックネーム、投稿内容、投稿時刻は公開されます)、連続投稿や広告投稿の防止、通報された投稿の確認(通報は公開されません)</li>
<li>保有期間: 投稿日から${days}日後に自動削除。通報はその投稿とともに削除されます。運営方針に反する投稿は非表示にすることがあります。</li>
<li>投稿に実名、連絡先、会社名を書かないでください。リンク、電話番号、メールアドレスを含む投稿は登録されません。</li>
</ul>
<h3>(4) 接続情報 — 上記の機能がサーバーにリクエストを送る際に自動的に生成</h3>
<ul>
<li>項目: ${items(["address"], "ja")}</li>
<li>目的: 自動登録や過剰なリクエストを防ぐための、リクエスト回数の制限</li>
<li>処理方法と保有期間: IPアドレスそのものは保存せず、サーバーだけが知る値を混ぜて元に戻せないように変換した値だけを使います。リクエスト回数を数える値は1日以内に削除し、掲示板の投稿に付いた値は投稿とともに${days}日後に削除します。</li>
</ul>

<h2>3. この端末に保存する情報(自動収集装置)</h2>
<p>本ゲームはCookieを使用しません。進行、設定、ローカル順位、復旧地点、ランダムな識別番号はブラウザのストレージ(localStorage)に、ゲームのファイルはオフラインで動かすためのキャッシュに保存されます。これらの情報は、2でオンにした機能を除いて端末の外に出ることはなく、ゲームの「リセット」やブラウザのサイトデータの削除で消去できます。</p>

<h2>4. 個人情報の破棄</h2>
<p>保有期間が終了した情報は、毎日実行される自動処理により遅滞なく削除します。電子ファイルは復元できない方法で削除します。</p>

<h2>5. 個人情報の第三者提供</h2>
<p>利用者の情報を第三者に提供したり、販売したりしません。法令に基づき求められる場合のみ例外とします。</p>

<h2>6. 処理の委託と国外移転</h2>
<p>Supabase Inc.(米国): 2の(1)~(4)の情報を保存するデータベースの運営を委託しています。これらの情報は、機能を使用する際にネットワークを通じて送信され、米国の同社のサーバーに2の保有期間のあいだ保存されます。</p>
<p>国外移転を望まない場合は、プレイテストデータの提供への同意をオフにし、オンライン保存と掲示板を使用しないでください。本ゲームのストーリーと勝負は、これらの機能がなくても最後まで遊べます。</p>

<h2>7. 利用者の権利とその行使方法</h2>
<ul>
<li>利用者はいつでも、自身の個人情報の閲覧、訂正、削除、処理の停止を請求し、同意を撤回できます。法定代理人や委任を受けた人を通じて請求することもできます。</li>
<li>同意の撤回と処理の停止: 「データ保存の案内」の同意のチェックを外してください。オンライン保存はパネルでオフにし、サーバー上のコピーを削除できます。</li>
<li>閲覧・削除の請求: 本ゲームは名前を取得しないため、「データ保存の案内」と結果画面に表示される<strong>8桁のセッションコード</strong>を${mail}までお送りください(オンライン保存は続行コード、掲示板の投稿はニックネームと投稿時刻)。該当する記録を探して対応し、10日以内に結果をお知らせします。</li>
</ul>

<h2>8. 満14歳未満の児童</h2>
<p>本ゲームは満14歳未満の児童を対象としていません。満14歳未満の方は、プレイテストデータの提供への同意をオフにし、オンライン保存と掲示板を使用しないでください。満14歳未満の児童の情報が保存されていることがわかった場合は、遅滞なく削除します。</p>

<h2>9. 安全性確保のための措置</h2>
<p>通信経路の暗号化(HTTPS)、データベースへのアクセス権限の最小化(匿名ユーザーは定められた機能でのみ書き込みができ、他人の記録を読むことはできません)、リクエスト回数の制限、続行コードと接続元アドレスの変換保存。</p>

<h2>10. 広告</h2>
<p>現在、広告はありません。将来広告を導入する場合は、導入する前に、広告に関する取り扱いの内容(広告会社、Cookie、拒否する方法)を本方針に追加してお知らせします。</p>

<h2>11. 個人情報保護に関するお問い合わせ先</h2>
<ul>
<li>担当: 臨界点開発者</li>
<li>メールアドレス: ${mail}</li>
<li>個人情報侵害の申告・相談(大韓民国): 個人情報侵害申告センター(privacy.kisa.or.kr、局番なしで118)、個人情報紛争調停委員会(www.kopico.go.kr、1833-6972)、大検察庁(www.spo.go.kr、局番なしで1301)、警察庁(ecrm.police.go.kr、局番なしで182)</li>
</ul>

<h2>12. 方針の変更</h2>
<p>本方針を変更する場合は、施行の7日前からこのページでお知らせし、利用者の権利に関わる重要な変更は30日前からお知らせします。</p>
`;

/**
 * Google Analytics in the policy (scripts/analytics-config.mjs), only in a
 * build that has it: each language's [off, on] pairs (`withSwaps`). The build
 * without it keeps every byte of the policy above -- which says there is no
 * analytics -- and the build with it says what is collected, why, who receives
 * it, for how long and how to refuse, and carries its own date.
 */
const GA_OPT_OUT = `<a href="https://tools.google.com/dlpage/gaoptout">https://tools.google.com/dlpage/gaoptout</a>`;

export const ANALYTICS_EFFECTIVE_DATE = { ko: "2026년 11월 12일", en: "November 12, 2026", ja: "2026年11月12日" };

export const ANALYTICS_POLICY = {
  ko: [
    [
      "서버로 가는 정보는 아래 2번의 네 가지뿐입니다.</li>",
      "게임 서버로 가는 정보는 아래 2번 (1)~(4)의 네 가지뿐이고, 방문 통계는 2번 (5)와 같이 Google 애널리틱스로 갑니다.</li>",
    ],
    [
      "<li>지금은 광고가 없고, 광고·분석용 쿠키나 외부 추적 도구를 쓰지 않습니다.</li>",
      "<li>지금은 광고가 없고 광고용 쿠키를 쓰지 않습니다. 방문 통계에는 Google 애널리틱스와 그 쿠키를 씁니다.</li>",
    ],
    [
      "<h2>3. 이 기기에 저장하는 정보",
      `<h3>(5) 방문 통계 — Google 애널리틱스, 게임과 안내 페이지를 열 때 자동으로</h3>
<ul>
<li>항목: 방문한 페이지(주소와 제목), 들어온 경로(이전 페이지나 검색·링크 출처), 방문 시각과 머문 시간, 기기·운영체제·브라우저 종류와 화면 크기·언어, 접속 IP 주소로 추정한 대략적 위치(국가·도시 수준), Google 애널리틱스 쿠키(_ga, _ga_로 시작하는 이름)에 담긴 무작위 방문자 번호</li>
<li>목적: 방문자 수, 많이 본 페이지, 유입 경로 같은 방문 통계로 게임과 안내 페이지를 고치기. 개인을 알아보는 데 쓰지 않고, 플레이테스트 데이터의 세션 코드나 게임 진행과 잇지 않습니다.</li>
<li>정보를 받는 곳: Google LLC(미국). 페이지를 열 때 네트워크로 Google의 서버에 전송됩니다(국외 이전, 6번). Google 애널리틱스는 IP 주소 자체를 저장하지 않으며, Google 신호와 광고 개인화는 꺼 두어 광고에 쓰지 않습니다.</li>
<li>보유 기간: Google 애널리틱스에서 수집한 날부터 2개월 뒤 자동 삭제. 쿠키는 브라우저에 최대 2년 남고 언제든 지울 수 있습니다.</li>
<li>거부 방법: 브라우저 설정에서 쿠키를 막거나, Google 애널리틱스 차단 부가기능(${GA_OPT_OUT})을 설치하면 됩니다. 플레이테스트 데이터 제공 동의를 꺼도 방문 통계는 멈추지 않으므로 이 방법을 쓰세요. 거부해도 게임은 그대로 할 수 있습니다.</li>
</ul>

<h2>3. 이 기기에 저장하는 정보`,
    ],
    ["<p>게임은 쿠키를 쓰지 않습니다. ", "<p>게임 자체는 쿠키를 쓰지 않습니다(방문 통계용 Google 애널리틱스 쿠키는 2번 (5)). "],
    [
      "<p>국외 이전을 원하지 않으면",
      "<p>Google LLC(미국): 2번 (5)의 방문 통계를 수집하고 집계하는 일을 맡기며, 페이지를 열 때 네트워크로 전송되어 미국 등에 있는 Google의 서버에 2번 (5)의 보유 기간 동안 저장됩니다.</p>\n<p>국외 이전을 원하지 않으면",
    ],
    ["게시판을 쓰지 않으면 됩니다. 게임의", "게시판을 쓰지 않고, 방문 통계는 2번 (5)의 방법으로 거부하면 됩니다. 게임의"],
  ],
  en: [
    [
      "Only the four kinds of data in section 2 ever reach a server.</li>",
      "Only the four kinds of data in section 2 (a)–(d) ever reach the game's server; visit statistics go to Google Analytics as described in (e).</li>",
    ],
    [
      "<li>The game currently shows no ads and uses no advertising or analytics cookies or third-party trackers.</li>",
      "<li>The game currently shows no ads and uses no advertising cookies. Visit statistics use Google Analytics and its cookies.</li>",
    ],
    [
      "<h2>3. What is stored on your device",
      `<h3>(e) Visit statistics — Google Analytics, automatically when you open the game or one of its pages</h3>
<ul>
<li>What is collected: the pages you visit (address and title), how you arrived (the previous page, or the search or link you came from), when you visited and for how long, your device, operating system, browser, screen size and language, your approximate location (country and city level) estimated from your IP address, and a random visitor ID in the Google Analytics cookies (_ga and names starting with _ga_)</li>
<li>Why: visit statistics such as the number of visitors, the most viewed pages and where visitors come from, to improve the game and its pages. They are not used to identify anyone and are not linked to your playtest session code or your progress.</li>
<li>Who receives it: Google LLC (USA). It is sent over the network to Google's servers when a page opens (an international transfer; see section 6). Google Analytics does not store IP addresses, and Google signals and ad personalization are turned off, so the data is not used for ads.</li>
<li>How long: deleted automatically by Google Analytics 2 months after collection. The cookies stay in your browser for up to 2 years and can be deleted at any time.</li>
<li>How to opt out: block cookies in your browser settings, or install the Google Analytics Opt-out Browser Add-on (${GA_OPT_OUT}). Turning off playtest data sharing does not stop visit statistics, so use one of these. The game plays the same either way.</li>
</ul>

<h2>3. What is stored on your device`,
    ],
    ["<p>The game uses no cookies. ", "<p>The game itself uses no cookies (the Google Analytics cookies for visit statistics are described in section 2 (e)). "],
    [
      "<p>To avoid the transfer,",
      "<p>Google LLC (USA) collects and aggregates the visit statistics in section 2 (e); they are sent over the network when a page opens and kept on Google's servers, in the USA and elsewhere, for the period in section 2 (e).</p>\n<p>To avoid the transfer,",
    ],
    ["do not use online save or the board. The whole", "do not use online save or the board, and opt out of visit statistics as described in section 2 (e). The whole"],
  ],
  ja: [
    [
      "サーバーに送られる情報は、下記2の4種類だけです。</li>",
      "ゲームのサーバーに送られる情報は下記2の(1)~(4)の4種類だけで、訪問統計は2の(5)のとおりGoogleアナリティクスに送られます。</li>",
    ],
    [
      "<li>現在、広告はなく、広告・分析用のCookieや外部のトラッキングツールも使用していません。</li>",
      "<li>現在、広告はなく、広告用のCookieも使用していません。訪問統計にはGoogleアナリティクスとそのCookieを使用します。</li>",
    ],
    [
      "<h2>3. この端末に保存する情報",
      `<h3>(5) 訪問統計 — Googleアナリティクス、ゲームや案内ページを開いたときに自動的に</h3>
<ul>
<li>項目: 訪問したページ(アドレスとタイトル)、訪問経路(直前のページ、または検索・リンク元)、訪問時刻と滞在時間、端末・OS・ブラウザの種類と画面サイズ・言語、接続元のIPアドレスから推定したおおよその位置(国・都市の単位)、GoogleアナリティクスのCookie(_ga、_ga_で始まる名前)に記録されるランダムな訪問者番号</li>
<li>目的: 訪問者数、よく見られたページ、訪問経路などの訪問統計により、ゲームと案内ページを改善すること。個人の識別には使用せず、プレイテストデータのセッションコードやゲームの進行とは結び付けません。</li>
<li>情報を受け取る者: Google LLC(米国)。ページを開く際にネットワークを通じてGoogleのサーバーに送信されます(国外移転、6を参照)。GoogleアナリティクスはIPアドレスそのものを保存せず、Googleシグナルと広告のパーソナライズはオフにしているため、広告には使われません。</li>
<li>保有期間: Googleアナリティクスにおいて収集日から2か月後に自動削除。Cookieはブラウザに最長2年残り、いつでも削除できます。</li>
<li>拒否する方法: ブラウザの設定でCookieをブロックするか、Googleアナリティクス オプトアウト アドオン(${GA_OPT_OUT})をインストールしてください。プレイテストデータの提供への同意をオフにしても訪問統計は止まらないため、これらの方法をお使いください。拒否してもゲームはそのまま遊べます。</li>
</ul>

<h2>3. この端末に保存する情報`,
    ],
    ["<p>本ゲームはCookieを使用しません。", "<p>本ゲーム自体はCookieを使用しません(訪問統計用のGoogleアナリティクスのCookieについては2の(5)をご覧ください)。"],
    [
      "<p>国外移転を望まない場合は",
      "<p>Google LLC(米国): 2の(5)の訪問統計の収集と集計を委託しています。これらの情報は、ページを開く際にネットワークを通じて送信され、米国などにある同社のサーバーに2の(5)の保有期間のあいだ保存されます。</p>\n<p>国外移転を望まない場合は",
    ],
    ["オンライン保存と掲示板を使用しないでください。本ゲームのストーリー", "オンライン保存と掲示板を使用せず、訪問統計は2の(5)の方法で拒否してください。本ゲームのストーリー"],
  ],
};

const TERMS_KO = `
<ol>
<li>이 약관은 임계점 개발자(이하 “개발자”)가 제공하는 게임 「임계점: CRITICAL POINT」(이하 “게임”)의 이용 조건을 정합니다. 게임을 이용하면 이 약관에 동의한 것으로 봅니다.</li>
<li>게임은 허구입니다. 등장하는 인물, 회사, 은행, 기관의 이름과 사건은 실제와 관계없고, 게임 속 금융 판단은 실제 투자나 금융 조언이 아닙니다.</li>
<li>웹판은 무료이며 광고와 유료 결제가 없습니다. 게임 안의 칩, 판돈, 금고, 점수는 실제 돈이나 재화가 아니며 사고팔거나 바꿀 수 없습니다.</li>
<li>공개 랭킹은 플레이테스트 순위입니다. 판의 규칙이 바뀌면 랭킹을 비울 수 있고, 규칙에 맞지 않는 기록은 표시하지 않을 수 있습니다.</li>
<li>참가자 게시판에는 다른 사람을 괴롭히거나, 남의 개인정보를 드러내거나, 광고나 불법 내용을 담은 글을 쓸 수 없습니다. 개발자는 이런 글을 알리지 않고 숨길 수 있습니다.</li>
<li>게임을 무단으로 복제·배포하거나, 서버에 자동화된 요청을 보내 랭킹이나 게시판을 방해해서는 안 됩니다.</li>
<li>개발자는 게임 내용을 바꾸거나, 미리 알린 뒤 서비스를 끝낼 수 있습니다. 진행은 이 기기에 저장되며, 기록 요약은 결과 화면의 「공유 요약」으로 파일로 받아 둘 수 있습니다.</li>
<li>개발자의 고의나 중대한 과실이 없는 한, 브라우저 저장소 삭제 등으로 사라진 진행에 대해 책임지지 않습니다.</li>
<li>개인정보는 <a href="${PRIVACY_PAGE_PATH}">개인정보처리방침</a>에 따라 처리합니다.</li>
<li>문의: ${mail}. 이 약관은 대한민국 법을 따릅니다.</li>
</ol>
`;

const TERMS_EN = `
<ol>
<li>These terms set the conditions for playing Critical Point (the “game”), provided by the Critical Point developer (“we”). By playing, you agree to them.</li>
<li>The game is fiction. Its people, companies, banks, institutions and events have nothing to do with real ones, and its financial judgments are not investment or financial advice.</li>
<li>The web version is free, with no ads and no payments. Chips, stakes, vaults and scores in the game are not money or goods and cannot be bought, sold or exchanged.</li>
<li>The public leaderboard is a playtest ranking. It may be cleared when the rules of the table change, and records that do not meet the rules may be left off it.</li>
<li>On the player board you may not harass anyone, reveal someone's personal information, or post ads or unlawful content. We may hide such posts without notice.</li>
<li>Do not copy or redistribute the game without permission, or send automated requests to the server to disrupt the leaderboard or the board.</li>
<li>We may change the game, or end the service after giving notice. Progress is saved on your device, and a summary of your records can be downloaded as a file with “Share summary” (공유 요약) on the result screen.</li>
<li>Unless we act intentionally or with gross negligence, we are not responsible for progress lost when browser storage is cleared.</li>
<li>Personal data is handled under the <a href="/en${PRIVACY_PAGE_PATH}">Privacy Policy</a>.</li>
<li>Contact: ${mail}. These terms are governed by the laws of the Republic of Korea.</li>
</ol>
`;

const TERMS_JA = `
<ol>
<li>この規約は、臨界点開発者(以下「開発者」)が提供するゲーム『臨界点: CRITICAL POINT』(以下「本ゲーム」)の利用条件を定めます。本ゲームを利用した場合、この規約に同意したものとみなします。</li>
<li>本ゲームはフィクションです。登場する人物、会社、銀行、機関の名称や事件は実在のものとは関係がなく、ゲーム内の金融判断は実際の投資や金融に関する助言ではありません。</li>
<li>ウェブ版は無料で、広告や有料の決済はありません。ゲーム内のチップ、賭け金、金庫、点数は実際のお金や財物ではなく、売買や交換はできません。</li>
<li>公開ランキングはプレイテストの順位です。勝負のルールが変わった場合はランキングをリセットすることがあり、ルールに合わない記録は表示しないことがあります。</li>
<li>参加者掲示板では、他人への嫌がらせ、他人の個人情報の暴露、広告や違法な内容を含む投稿をしてはなりません。開発者はこうした投稿を予告なく非表示にすることがあります。</li>
<li>本ゲームを無断で複製・配布したり、サーバーに自動化されたリクエストを送ってランキングや掲示板を妨害したりしてはなりません。</li>
<li>開発者は本ゲームの内容を変更し、または事前に告知したうえでサービスを終了することがあります。進行はこの端末に保存され、記録の要約は結果画面の「共有用の要約」からファイルとして保存しておけます。</li>
<li>開発者に故意または重大な過失がない限り、ブラウザのストレージの削除などにより失われた進行について、開発者は責任を負いません。</li>
<li>個人情報は<a href="/ja${PRIVACY_PAGE_PATH}">プライバシーポリシー</a>に従って取り扱います。</li>
<li>お問い合わせ: ${mail}。この規約は大韓民国の法律に準拠します。</li>
</ol>
`;


const PAGE_STYLE = `
:root{color-scheme:dark;--bg:#06090a;--surface:#0e1314;--line:#ffffff24;--text:#f2f6f3;--text-2:#becbc5;--accent:#d9ff62}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--text);font:1rem/1.75 -apple-system,BlinkMacSystemFont,system-ui,"Apple SD Gothic Neo","Malgun Gothic","Segoe UI",sans-serif;word-break:keep-all;overflow-wrap:anywhere}
main{width:min(760px,100%);margin:0 auto;padding:24px 16px 72px}
nav{display:flex;flex-wrap:wrap;gap:4px 20px;padding-bottom:12px;border-bottom:1px solid var(--line);font-size:.875rem}
nav a{display:inline-flex;align-items:center;min-height:44px}
nav a[aria-current]{color:var(--text);text-decoration:none}
a{color:var(--accent);text-underline-offset:4px}
h1{margin:32px 0 4px;font-size:clamp(1.625rem,5vw,2.25rem);line-height:1.2;letter-spacing:-.02em}
h2{margin:36px 0 8px;font-size:1.1875rem;line-height:1.4}
h3{margin:22px 0 6px;font-size:1rem;line-height:1.5;color:var(--text)}
p,li,dd{color:var(--text-2)}
ul,ol{padding-left:1.4em}
li{margin:4px 0}
li ul{margin:4px 0}
dd{margin:0 0 4px}
.effective{margin:0;color:var(--text-2);font-size:.875rem}
strong{color:var(--text)}
footer{margin-top:48px;padding-top:12px;border-top:1px solid var(--line);font-size:.875rem}
`;

/** The languages in the order each page's header links them: Korean at the root, the others in a folder of their code. */
export const PAGE_LANGUAGES = ["ko", "en", "ja"];

/**
 * The plain pages the build writes beside `index.html`, in the order every
 * page's header lists them: the three about the game (scripts/site-pages.mjs)
 * and the two this file writes. Each is `/<kind>.html` in Korean and
 * `/<lang>/<kind>.html` in the others -- the start screen's foot builds the
 * same addresses from the same list (`SITE_PAGES`, `legalPagePath`,
 * src/privacyText.js).
 */
export const PAGE_KINDS = SITE_PAGES;

const COPY = {
  ko: { game: "게임으로 돌아가기", about: "게임 소개", faq: "자주 묻는 질문", contact: "문의", privacy: "개인정보처리방침", terms: "이용약관", name: "한국어", effective: "시행일", mail: "문의" },
  en: { game: "Back to the game", about: "About", faq: "FAQ", contact: "Contact", privacy: "Privacy Policy", terms: "Terms of Use", name: "English", effective: "Effective", mail: "Contact" },
  ja: { game: "ゲームに戻る", about: "ゲーム紹介", faq: "よくある質問", contact: "お問い合わせ", privacy: "プライバシーポリシー", terms: "利用規約", name: "日本語", effective: "施行日", mail: "お問い合わせ" },
};

export const GAME_NAME = { ko: "임계점: CRITICAL POINT", en: "Critical Point", ja: "臨界点: CRITICAL POINT" };

/**
 * Japanese puts no spaces between words, so `keep-all` would hold a sentence
 * together until `overflow-wrap: anywhere` cut it mid-line. Only the Japanese
 * pages carry the line; the Korean and English ones are as they were.
 */
const STYLE_FOR = { ja: "\nbody{word-break:normal}" };

const folderOf = (language) => (language === "ko" ? "" : `/${language}`);

/** A page's address from the root: `/faq.html`, `/en/faq.html`. The policy's two are PRIVACY_PAGE_PATH and TERMS_PAGE_PATH. */
export const pagePath = (kind, language) => `${folderOf(language)}/${kind}.html`;

/** The game in a language, as the start page's own hreflang links name it (index.html). */
export const gamePath = (language) => (language === "ko" ? "/" : `/?lang=${language}`);

export { escapeHtml };

/**
 * One page: the header that links the game, every other page in the same
 * language and the page in the other two; the hreflang alternates (all three
 * and x-default, the Korean); the body; a foot with the contact address.
 * `effective` is the policy's date line, which only the two policies have;
 * `analytics` (scripts/analytics-config.mjs) puts Google's tag at the end of the head.
 */
export function renderDocumentPage({ kind, language, body, description, effective = null, analytics = null }) {
  const copy = COPY[language];
  const others = PAGE_LANGUAGES.filter((code) => code !== language);
  const title = `${copy[kind]} · ${GAME_NAME[language]}`;
  const alternates = [
    ...PAGE_LANGUAGES.map((code) => `<link rel="alternate" hreflang="${code}" href="${pagePath(kind, code)}" />\n`),
    `<link rel="alternate" hreflang="x-default" href="${pagePath(kind, "ko")}" />\n`,
  ].join("");
  const pages = PAGE_KINDS.map((other) =>
    other === kind
      ? `<a href="${pagePath(other, language)}" aria-current="page">${copy[other]}</a>\n`
      : `<a href="${pagePath(other, language)}">${copy[other]}</a>\n`,
  ).join("");
  const switches = others
    .map((other) => `<a href="${pagePath(kind, other)}" hreflang="${other}" lang="${other}">${COPY[other].name}</a>\n`)
    .join("");
  const dated = effective ? `<p class="effective">${copy.effective}: ${effective}</p>\n` : "";
  const tags = analytics ? analyticsTagLines(analytics).map((line) => `${line}\n`).join("") : "";
  return `<!doctype html>
<html lang="${language}">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${escapeHtml(title)}</title>
<meta name="description" content="${escapeHtml(description ?? copy[kind])}" />
<link rel="canonical" href="${pagePath(kind, language)}" />
${alternates}<link rel="icon" href="/icons/icon-192.png" />
<style>${PAGE_STYLE.trim()}${STYLE_FOR[language] ?? ""}</style>
${tags}</head>
<body>
<main>
<nav aria-label="${escapeHtml(GAME_NAME[language])}">
<a href="${gamePath(language)}">${copy.game}</a>
${pages}${switches}</nav>
<h1>${copy[kind]}</h1>
${dated}${body.trim()}
<footer><p>${escapeHtml(GAME_NAME[language])} · ${copy.mail}: ${mail}</p></footer>
</main>
</body>
</html>
`;
}

/**
 * Every page this file writes: `{ "privacy.html": "<!doctype html>...", ... }`, keyed by path from the root without its slash.
 * With `analytics` every page carries Google's tag, and the policy its Google Analytics section and that section's date.
 */
export function renderLegalPages({ analytics = null } = {}) {
  const privacy = (language, body) => (analytics ? withSwaps(body, ANALYTICS_POLICY[language]) : body);
  const dateOf = ({ kind, language }) => (analytics && kind === "privacy" ? ANALYTICS_EFFECTIVE_DATE : EFFECTIVE_DATE)[language];
  const pages = [
    { kind: "privacy", language: "ko", body: privacy("ko", PRIVACY_KO) },
    { kind: "privacy", language: "en", body: privacy("en", PRIVACY_EN) },
    { kind: "privacy", language: "ja", body: privacy("ja", PRIVACY_JA) },
    { kind: "terms", language: "ko", body: TERMS_KO },
    { kind: "terms", language: "en", body: TERMS_EN },
    { kind: "terms", language: "ja", body: TERMS_JA },
  ];
  return Object.fromEntries(
    pages.map((page) => [pagePath(page.kind, page.language).slice(1), renderDocumentPage({ ...page, effective: dateOf(page), analytics })]),
  );
}
