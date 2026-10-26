import { SUPPORT_CONTACT } from "../src/appConfig.js";
import { DATA_RETENTION_DAYS, PLAYTEST_DATA_NOTICE, PRIVACY_PAGE_PATH, TERMS_PAGE_PATH } from "../src/privacyText.js";

/**
 * The privacy policy and the terms of use, Korean and English: four plain
 * pages the build writes beside `index.html` (`legalPages()` in
 * vite.config.js), at addresses a store listing can name.
 *
 *   /privacy.html  /en/privacy.html  /terms.html  /en/terms.html
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

const EFFECTIVE_DATE = { ko: "2026년 10월 25일", en: "October 25, 2026" };

/** Each item the policy lists, by key, in both languages. */
export const DATA_ITEMS = {
  deviceId: {
    ko: "이 기기에서 만든 무작위 식별 번호(세션 번호)와 그 끝 8자리인 세션 코드",
    en: "a random ID created on this device (session ID) and its last 8 characters, the session code",
  },
  runId: { ko: "판마다 새로 만드는 무작위 기록 번호", en: "a random run ID made for each playthrough" },
  eventId: { ko: "같은 기록이 두 번 저장되지 않게 하는 무작위 전송 번호", en: "a random delivery ID that keeps a record from being stored twice" },
  anonName: { ko: "랭킹 표시 이름(늘 「익명 분석관」으로 고정)", en: "the leaderboard name, always \"Anonymous analyst\"" },
  caseResult: {
    ko: "사건 결과(사건 이름, 결과 요약과 점수, 게임 속 자원·성향 수치, 완료 시각)",
    en: "case results (the case, its summary and score, in-game resources and tendencies, completion time)",
  },
  choiceLog: {
    ko: "선택 기록과 응답 시간(고른 카드, 결정에 걸린 시간, 판의 진행 기록)",
    en: "choices and response times (the cards played, the time each decision took, how the table went)",
  },
  feedback: { ko: "보낸 피드백(이해도·난이도 평가와 자유 의견)", en: "feedback you send (clarity and difficulty ratings and your comment)" },
  errorReport: {
    ko: "오류 보고(오류 이름·내용·코드 위치, 글자 없이 요소 이름만 적은 화면 구조, 화면 크기, 오류가 난 사건·장면, 발생 시각)",
    en: "error reports (the error's name, message and code location, the screen's structure as element names without any text, screen size, the case and scene, the time)",
  },
  boardPost: { ko: "닉네임, 글 내용(300자 이내), 작성 시각", en: "your nickname, your post (up to 300 characters) and when it was posted" },
  boardWriterId: {
    ko: "게시판 전용 무작위 작성자 번호(플레이테스트 데이터의 식별 번호와 다름)",
    en: "a random writer ID used only by the board (not the playtest session ID)",
  },
  boardReport: {
    ko: "신고한 글의 번호와 고른 신고 사유(직접 적는 칸 없음)",
    en: "the number of the post you report and the reason you pick (there is no free text)",
  },
  cloudSave: {
    ko: "게임 진행 저장본(분석관 이름, 피드백 자유 의견, 전송 대기 기록은 빼고 올림)과 저장 시각",
    en: "your save (without your analyst name, feedback comments or unsent records) and when it was saved",
  },
  cloudCode: {
    ko: "이어하기 코드(서버에는 코드가 아닌 SHA-256 변환값으로 저장)",
    en: "your continue code (stored as a SHA-256 hash, never as the code itself)",
  },
  address: { ko: "접속 IP 주소", en: "your IP address" },
};

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

const PLAYTEST_ITEMS = ["deviceId", "runId", "eventId", "anonName", "caseResult", "choiceLog", "feedback", "errorReport"];

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

const PAGE_STYLE = `
:root{color-scheme:dark;--bg:#06090a;--surface:#0e1314;--line:#ffffff24;--text:#f2f6f3;--text-2:#becbc5;--accent:#d9ff62}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--text);font:1rem/1.75 -apple-system,BlinkMacSystemFont,system-ui,"Apple SD Gothic Neo","Malgun Gothic","Segoe UI",sans-serif;word-break:keep-all;overflow-wrap:anywhere}
main{width:min(760px,100%);margin:0 auto;padding:24px 16px 72px}
nav{display:flex;flex-wrap:wrap;gap:4px 20px;padding-bottom:12px;border-bottom:1px solid var(--line);font-size:.875rem}
nav a{display:inline-flex;align-items:center;min-height:44px}
a{color:var(--accent);text-underline-offset:4px}
h1{margin:32px 0 4px;font-size:clamp(1.625rem,5vw,2.25rem);line-height:1.2;letter-spacing:-.02em}
h2{margin:36px 0 8px;font-size:1.1875rem;line-height:1.4}
h3{margin:22px 0 6px;font-size:1rem;line-height:1.5;color:var(--text)}
p,li{color:var(--text-2)}
ul,ol{padding-left:1.4em}
li{margin:4px 0}
li ul{margin:4px 0}
.effective{margin:0;color:var(--text-2);font-size:.875rem}
strong{color:var(--text)}
`;

const COPY = {
  ko: { game: "게임으로 돌아가기", privacy: "개인정보처리방침", terms: "이용약관", other: "English", effective: "시행일" },
  en: { game: "Back to the game", privacy: "Privacy Policy", terms: "Terms of Use", other: "한국어", effective: "Effective" },
};

const pathFor = (kind, language) => `${language === "en" ? "/en" : ""}${kind === "privacy" ? PRIVACY_PAGE_PATH : TERMS_PAGE_PATH}`;

function renderPage({ kind, language, body }) {
  const copy = COPY[language];
  const other = language === "en" ? "ko" : "en";
  const sibling = kind === "privacy" ? "terms" : "privacy";
  const title = `${copy[kind]} · ${language === "en" ? "Critical Point" : "임계점: CRITICAL POINT"}`;
  return `<!doctype html>
<html lang="${language}">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${escapeHtml(title)}</title>
<meta name="description" content="${escapeHtml(copy[kind])}" />
<link rel="alternate" hreflang="${other}" href="${pathFor(kind, other)}" />
<link rel="icon" href="/icons/icon-192.png" />
<style>${PAGE_STYLE.trim()}</style>
</head>
<body>
<main>
<nav aria-label="${escapeHtml(copy[kind])}">
<a href="/">${copy.game}</a>
<a href="${pathFor(sibling, language)}">${copy[sibling]}</a>
<a href="${pathFor(kind, other)}" hreflang="${other}" lang="${other}">${COPY[language].other}</a>
</nav>
<h1>${copy[kind]}</h1>
<p class="effective">${copy.effective}: ${EFFECTIVE_DATE[language]}</p>
${body.trim()}
</main>
</body>
</html>
`;
}

/** Every page the build writes: `{ "privacy.html": "<!doctype html>...", ... }`, keyed by path from the root without its slash. */
export function renderLegalPages() {
  const pages = [
    { kind: "privacy", language: "ko", body: PRIVACY_KO },
    { kind: "privacy", language: "en", body: PRIVACY_EN },
    { kind: "terms", language: "ko", body: TERMS_KO },
    { kind: "terms", language: "en", body: TERMS_EN },
  ];
  return Object.fromEntries(pages.map((page) => [pathFor(page.kind, page.language).slice(1), renderPage(page)]));
}
