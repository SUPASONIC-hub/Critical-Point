import { useEffect, useRef, useState } from "react";

import {
  BOARD_NICKNAME_KEY,
  BOARD_POST_MAX_LENGTH,
  PLAYER_NAME_MAX_LENGTH,
  limitText,
  readStoredValue,
  writeStoredValue,
} from "../appConfig.js";
// The same two checks the feedback panel runs, from a leaf module rather than
// from gameLogic.js: this hook is reached from the pre-start shell, and
// gameLogic.js drags the whole season into the entry chunk. See privacyText.js.
import { anonymizeSensitiveText, detectPrivacySignals } from "../privacyText.js";
import { fetchBoardPosts, getBoardWriterId, saveBoardPost } from "../telemetry.js";

/**
 * Owns the 참가자 게시판: the posts the board screen lists, and the one the
 * player is writing.
 *
 * The reading half is shaped exactly like useLeaderboard -- lazy, cancelled on
 * unmount, `skipped` means this deployment has no server -- because it is the
 * same job. The writing half is the part that is new here, and it is new for one
 * reason: this is the only place in the app where something the player typed,
 * under a name they chose, is published to everyone. Everywhere else the name
 * that leaves the device is '익명 분석관'. That is a deliberate departure, not an
 * oversight: a board with no names is a wall of anonymous strings, so the
 * nickname is the point of it. It is kept in BOARD_NICKNAME_KEY so the player
 * types it once.
 *
 * The checks below all have a copy on the server (the table's trigger is the
 * real defence, and it is the one a script has to get past). They are repeated
 * here so a person is told what is wrong before the round trip, and so the
 * cheapest automated posts never reach the network at all.
 */
const BOARD_NICKNAME_MIN_LENGTH = 2;
const BOARD_POST_MIN_LENGTH = 2;
/** One post per 30 seconds, as `validate_board_post_insert` counts it. */
const BOARD_POST_INTERVAL_MS = 30000;
/**
 * A form filled and submitted inside three seconds was not read. A person needs
 * longer than that to find the box; a script does not need any of it.
 */
const BOARD_DWELL_MS = 3000;
/**
 * The trigger's tests (`board_text_has_link` in 20260929020000,
 * `board_text_has_contact` and `clean_board_text` in 20260928010000), written
 * the same way so the two agree, and held to one list of cases
 * (tests/fixtures/board-filter-cases.json) so they keep agreeing. The server
 * applies them to the nickname as well as the body, so this does too.
 *
 * A TLD ends where the name ends -- `(?![a-z0-9-])` -- rather than at a word
 * boundary. A boundary is ASCII here and follows the database's locale there,
 * so `spam.com으로`, a domain with its particle attached, was a link in the
 * browser and prose on the server. The label before the dot may be Hangul.
 */
const BOARD_LINK_TLDS =
  "com|net|org|io|kr|co|xyz|top|ru|cn|me|ly|gg|app|link|site|online|shop|store|info|biz|tv|to|cc|be|us|uk|jp|de|fr|in|ai|dev|so|la|page|club|live|fun|icu|vip|win|pro|sh|ws|tk|ml|ga|cf|gq|gl|im|am|fm|one|click|lol|bio|zip|mov|pw|su|ooo|asia|cloud|space|website|tech|world|today|news|blog|한국|xn--[a-z0-9-]+";
const BOARD_LINK_PATTERN = new RegExp(
  String.raw`(https?:|hxxps?:|www\.|닷\s*컴|[a-z0-9가-힣-]+(\.|\s+dot\s+)(${BOARD_LINK_TLDS})(?![a-z0-9-]))`,
);
const BOARD_SPACED_LINK_PATTERN = /[a-z0-9-]+\.\s+(com|net|org|xyz|io|kr)(?![a-z0-9-])/;
const BOARD_EMAIL_PATTERN = /[^\s@]+@[^\s@]+\.[a-z]{2,}/i;
const BOARD_PHONE_PATTERN =
  /(^|[^0-9])(\+?82[-.\s]?1[016789]|01[016789]|0[2-6][0-9]?|070|050[0-9]?)[-.\s)]{0,2}[0-9]{3,4}[-.\s]?[0-9]{4}([^0-9]|$)/;
// eslint-disable-next-line no-control-regex -- control characters are exactly what this strips
const BOARD_INVISIBLE_PATTERN = /[\u0001-\u0008\u000B\u000C\u000E-\u001F\u007F\u00AD\u200B-\u200F\u202A-\u202E\u2060-\u2064\uFEFF]/g;

/** Invisible characters out, Unicode spaces trimmed from both ends. */
function cleanBoardText(value) {
  return String(value ?? "").replace(BOARD_INVISIBLE_PATTERN, "").trim();
}

function visibleLength(value) {
  return value.replace(/\s/g, "").length;
}

export function boardTextHasLink(value) {
  const folded = String(value ?? "")
    .toLowerCase()
    .replace(/\s*(\[\.\]|\(\.\)|\[dot\]|\(dot\)|\{dot\}|。|．|｡)\s*/g, ".")
    .replace(/([a-z0-9-])\s+\.\s*([a-z])/g, "$1.$2");
  return BOARD_LINK_PATTERN.test(folded) || BOARD_SPACED_LINK_PATTERN.test(folded);
}

export function boardTextHasContact(value) {
  const text = String(value ?? "");
  return BOARD_EMAIL_PATTERN.test(text) || BOARD_PHONE_PATTERN.test(text);
}

/**
 * Why a post cannot go up as written, or null. The order is the trigger's, so
 * a post that breaks two rules is refused for the same one on both sides.
 */
export function getBoardPostRefusal(nickname, body) {
  const name = cleanBoardText(String(nickname ?? "").replace(/\s+/g, " "));
  const text = cleanBoardText(body);
  if (name.length < BOARD_NICKNAME_MIN_LENGTH || name.length > PLAYER_NAME_MAX_LENGTH || visibleLength(name) < BOARD_NICKNAME_MIN_LENGTH) {
    return "nickname-characters";
  }
  if (text.length < BOARD_POST_MIN_LENGTH || text.length > BOARD_POST_MAX_LENGTH || visibleLength(text) < BOARD_POST_MIN_LENGTH) {
    return "body-characters";
  }
  if (boardTextHasLink(name)) return "nickname-link";
  if (boardTextHasLink(text)) return "body-link";
  if (boardTextHasContact(name) || boardTextHasContact(text)) return "contact";
  return null;
}

const BOARD_REFUSAL_COPY = {
  "nickname-characters": "이름은 2자 이상 24자 이하로 적어 주세요.",
  "body-characters": "글은 2자 이상 300자 이하로 적어 주세요.",
  "nickname-link": "이름에는 링크를 넣을 수 없습니다. 이름을 바꿔 다시 올려 주세요.",
  "body-link": "링크가 들어간 글은 올릴 수 없습니다. 링크를 빼고 다시 올려 주세요.",
  contact: "전화번호나 이메일이 들어간 글은 올릴 수 없습니다. 빼고 다시 올려 주세요.",
};

/**
 * Why the 글 남기기 button will not act at all, or null. These are the three
 * states a press cannot change: no board to post to, a post already on its
 * way, and text that has to be anonymised first. The button stays reachable
 * through all three (GuardedButton), and the screen points it at the words
 * that say which one it is.
 *
 * A name or a post that is too short is not here. The button used to be
 * `disabled` for those as well, with nothing said, so the sentences in
 * BOARD_REFUSAL_COPY could never be reached; now the press goes through and
 * `checkBoardSubmit` answers it.
 */
export function getBoardSubmitBlock({ boardStatus, isPosting = false, privacySignalCount = 0 }) {
  if (boardStatus !== "ready") return "offline";
  if (isPosting) return "posting";
  if (privacySignalCount > 0) return "privacy";
  return null;
}

/**
 * What a press on 글 남기기 is told instead of being sent, or null when the
 * post may go. The order is the order the checks have always run in.
 *
 * The honeypot used to answer with "글을 올렸습니다" and empty the post: right
 * for a script, and the same for a person whose browser or password manager
 * had filled the hidden field, who was told a post went up that went nowhere,
 * every time. It says so now and the hook empties the field, so a person's
 * second press goes through; a script that fills every field again is stopped
 * again, and the trigger on the table is still the defence that counts.
 */
export function checkBoardSubmit({ honeypot = "", sinceOpenedMs, privacySignalCount = 0, nickname, body, sinceLastPostMs = null }) {
  if (honeypot.trim().length > 0) {
    return { reason: "honeypot", message: "자동으로 채워진 칸이 있어 글을 올리지 않았습니다. 다시 눌러 주세요." };
  }
  if (sinceOpenedMs < BOARD_DWELL_MS) {
    return { reason: "dwell", message: "게시판이 열린 지 얼마 되지 않았습니다. 잠깐 읽어 보고 다시 눌러 주세요." };
  }
  if (privacySignalCount > 0) {
    return { reason: "privacy", message: "식별 정보로 보일 수 있는 표현을 익명화한 뒤 올려 주세요." };
  }
  const refusal = getBoardPostRefusal(nickname, body);
  if (refusal) return { reason: refusal, message: BOARD_REFUSAL_COPY[refusal] };
  if (sinceLastPostMs !== null && sinceLastPostMs < BOARD_POST_INTERVAL_MS) {
    const waitSeconds = Math.ceil((BOARD_POST_INTERVAL_MS - sinceLastPostMs) / 1000);
    return { reason: "interval", message: `글은 30초에 한 번만 올릴 수 있습니다. ${waitSeconds}초 뒤에 다시 눌러 주세요.` };
  }
  return null;
}

function normalizeBoardPost(row = {}) {
  return {
    id: row.id,
    nickname: limitText(String(row.nickname ?? ""), PLAYER_NAME_MAX_LENGTH),
    body: limitText(String(row.body ?? ""), BOARD_POST_MAX_LENGTH),
    createdAt: typeof row.created_at === "string" ? row.created_at : "",
  };
}

/**
 * The server refuses in English, because the messages are raised by a Postgres
 * trigger that also answers `curl`. The player reads Korean, so each refusal it
 * can raise has a sentence here; anything else falls back to the general one.
 */
function describeBoardFailure(error, isOnline) {
  const message = `${error?.serverMessage ?? ""} ${error instanceof Error ? error.message : ""}`;
  if (/nickname must not contain a link/.test(message)) return BOARD_REFUSAL_COPY["nickname-link"];
  if (/must not contain a link/.test(message)) return BOARD_REFUSAL_COPY["body-link"];
  if (/must not contain contact details/.test(message)) return BOARD_REFUSAL_COPY.contact;
  // Someone else on the same network wrote the same words. That used to be
  // answered with "글을 올렸습니다" for a post that was stored nowhere.
  if (/repeats a recent post/.test(message)) return "같은 글이 조금 전에 올라와 있습니다. 표현을 바꿔 다시 올려 주세요.";
  if (/at least 30 seconds apart/.test(message)) return "글은 30초에 한 번만 올릴 수 있습니다. 잠시 뒤에 다시 눌러 주세요.";
  if (/rate limit exceeded/.test(message)) return "한 시간에 열 번까지만 올릴 수 있습니다. 시간을 두고 다시 찾아와 주세요.";
  if (/nickname must be/.test(message)) return BOARD_REFUSAL_COPY["nickname-characters"];
  if (/post must be/.test(message)) return BOARD_REFUSAL_COPY["body-characters"];
  if (!isOnline) return "오프라인이라 글을 올리지 못했습니다. 연결된 뒤에 다시 눌러 주세요.";
  return "글을 올리지 못했습니다. 잠시 뒤에 다시 눌러 주세요.";
}

export function useBoard({ showBoard, isOnline }) {
  const [boardPosts, setBoardPosts] = useState([]);
  const [boardStatus, setBoardStatus] = useState("idle");
  const [boardError, setBoardError] = useState("");
  const [boardNickname, setBoardNicknameState] = useState(() =>
    limitText(readStoredValue(BOARD_NICKNAME_KEY, "") ?? "", PLAYER_NAME_MAX_LENGTH),
  );
  const [boardBody, setBoardBodyState] = useState("");
  // The honeypot's value. A person never sees the field, so anything in it was
  // put there by something that reads the markup rather than the page -- a
  // script, or a browser's autofill (see checkBoardSubmit).
  const [boardHoneypot, setBoardHoneypot] = useState("");
  const [boardPostStatus, setBoardPostStatus] = useState("");
  const [isPostingToBoard, setIsPostingToBoard] = useState(false);
  const [lastBoardPostAt, setLastBoardPostAt] = useState(0);
  const [boardReloadToken, setBoardReloadToken] = useState(0);
  const boardOpenedAtRef = useRef(0);

  useEffect(() => {
    if (!showBoard) return undefined;
    let cancelled = false;
    // The dwell gate counts from the first render of the form, not from each
    // reload of the list, so posting does not restart the player's three seconds.
    if (boardOpenedAtRef.current === 0) boardOpenedAtRef.current = Date.now();
    queueMicrotask(() => {
      if (cancelled) return;
      // A board that has answered stays open while it is read again. Every
      // post used to put the list back to "불러오는 중" and lock the fields the
      // player had just typed in.
      setBoardStatus((status) => (status === "ready" ? status : "loading"));
      setBoardError("");
    });
    fetchBoardPosts()
      .then(({ rows = [], skipped = false }) => {
        if (cancelled) return;
        setBoardPosts(rows.map(normalizeBoardPost));
        setBoardStatus(skipped ? "local" : "ready");
        setBoardError(skipped ? "이 배포에는 게시판 서버가 없어 글을 주고받을 수 없습니다." : "");
      })
      .catch((error) => {
        if (cancelled) return;
        console.warn(error);
        // The posts already fetched stay: losing the connection while reading
        // used to empty the list that was on the screen.
        setBoardStatus(isOnline ? "error" : "local");
        setBoardError(
          isOnline
            ? "게시판을 불러오지 못했습니다. 아래에서 다시 불러올 수 있습니다."
            : "오프라인이라 게시판을 불러오지 못했습니다. 연결되면 다시 열립니다.",
        );
      });
    return () => {
      cancelled = true;
    };
  }, [boardReloadToken, isOnline, showBoard]);

  const activeBoardPrivacySignals = detectPrivacySignals(boardBody).filter((signal) => signal.active);
  const trimmedBoardNickname = cleanBoardText(boardNickname.replace(/\s+/g, " "));
  const trimmedBoardBody = cleanBoardText(boardBody);
  // The composer is for a board that answered. It used to stay open with no
  // server in reach, and said so only after the player had written the post.
  const canWriteBoardPost = boardStatus === "ready";
  const boardSubmitBlock = getBoardSubmitBlock({
    boardStatus,
    isPosting: isPostingToBoard,
    privacySignalCount: activeBoardPrivacySignals.length,
  });

  function setBoardNickname(value) {
    setBoardNicknameState(limitText(value, PLAYER_NAME_MAX_LENGTH));
    setBoardPostStatus("");
  }

  function setBoardBody(value) {
    setBoardBodyState(limitText(value, BOARD_POST_MAX_LENGTH));
    setBoardPostStatus("");
  }

  function anonymizeBoardBody() {
    setBoardBody(anonymizeSensitiveText(boardBody));
  }

  function reloadBoard() {
    setBoardReloadToken((token) => token + 1);
  }

  async function submitBoardPost() {
    if (isPostingToBoard || !canWriteBoardPost) return;
    const stopped = checkBoardSubmit({
      honeypot: boardHoneypot,
      sinceOpenedMs: Date.now() - boardOpenedAtRef.current,
      privacySignalCount: activeBoardPrivacySignals.length,
      nickname: boardNickname,
      body: boardBody,
      sinceLastPostMs: lastBoardPostAt > 0 ? Date.now() - lastBoardPostAt : null,
    });
    if (stopped) {
      if (stopped.reason === "honeypot") setBoardHoneypot("");
      setBoardPostStatus(stopped.message);
      return;
    }

    setIsPostingToBoard(true);
    writeStoredValue(BOARD_NICKNAME_KEY, trimmedBoardNickname);
    // The board's own id, never the telemetry session's: see getBoardWriterId.
    const sessionId = getBoardWriterId();
    // One id per submit, so a double click that sends the same post twice lands
    // once: `board_posts.event_id` is unique. Random rather than derived from
    // the session, so the id could never tie two posts to one device.
    const eventId =
      globalThis.crypto?.randomUUID?.() ?? `board-${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;

    try {
      const { skipped = false } = await saveBoardPost(
        { session_id: sessionId, nickname: trimmedBoardNickname, body: trimmedBoardBody },
        eventId,
      );
      if (skipped) {
        setBoardPostStatus("이 배포에는 게시판 서버가 없어 글을 올리지 못했습니다.");
        return;
      }
      setBoardBodyState("");
      setLastBoardPostAt(Date.now());
      setBoardPostStatus("글을 올렸습니다.");
      reloadBoard();
    } catch (error) {
      console.warn(error);
      setBoardPostStatus(describeBoardFailure(error, isOnline));
    } finally {
      setIsPostingToBoard(false);
    }
  }

  return {
    // The limits travel with the hook rather than being imported again at each
    // call site: the composer's counters and the checks above have to be the
    // same two numbers, and the trigger is the third copy that already exists.
    nicknameMaxLength: PLAYER_NAME_MAX_LENGTH,
    bodyMaxLength: BOARD_POST_MAX_LENGTH,
    boardPosts,
    boardStatus,
    boardError,
    boardNickname,
    setBoardNickname,
    boardBody,
    setBoardBody,
    boardHoneypot,
    setBoardHoneypot,
    boardPostStatus,
    isPostingToBoard,
    canWriteBoardPost,
    boardSubmitBlock,
    activeBoardPrivacySignals,
    anonymizeBoardBody,
    submitBoardPost,
    reloadBoard,
  };
}
