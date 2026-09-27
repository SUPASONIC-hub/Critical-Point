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
import { fetchBoardPosts, getSessionId, saveBoardPost } from "../telemetry.js";

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
 * The trigger's tests (`board_text_has_link`, `board_text_has_contact` and
 * `clean_board_text` in 20260928010000), written the same way so the two agree.
 * The server applies them to the nickname as well as the body, so this does too.
 */
const BOARD_LINK_TLDS =
  "com|net|org|io|kr|co|xyz|top|ru|cn|me|ly|gg|app|link|site|online|shop|store|info|biz|tv|to|cc|be|us|uk|jp|de|fr|in|ai|dev|so|la|page|club|live|fun|icu|vip|win|pro|sh|ws|tk|ml|ga|cf|gq|gl|im|am|fm|one|click|lol|bio|zip|mov|pw|su|ooo|asia|cloud|space|website|tech|world|today|news|blog|xn--[a-z0-9-]+";
const BOARD_LINK_PATTERN = new RegExp(String.raw`(https?:|hxxps?:|www\.|닷\s*컴|[a-z0-9-]+(\.|\s+dot\s+)(${BOARD_LINK_TLDS})\b)`);
const BOARD_SPACED_LINK_PATTERN = /[a-z0-9-]+\.\s+(com|net|org|xyz|io|kr)\b/;
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
  const message = error instanceof Error ? error.message : "";
  if (/nickname must not contain a link/.test(message)) return "이름에는 링크를 넣을 수 없습니다. 이름을 바꿔 다시 올려 주세요.";
  if (/must not contain a link/.test(message)) return "링크가 들어간 글은 올릴 수 없습니다. 링크를 빼고 다시 올려 주세요.";
  if (/must not contain contact details/.test(message)) return "전화번호나 이메일이 들어간 글은 올릴 수 없습니다. 빼고 다시 올려 주세요.";
  if (/at least 30 seconds apart/.test(message)) return "글은 30초에 한 번만 올릴 수 있습니다. 잠시 뒤에 다시 눌러 주세요.";
  if (/rate limit exceeded/.test(message)) return "한 시간에 열 번까지만 올릴 수 있습니다. 시간을 두고 다시 찾아와 주세요.";
  if (/nickname must be/.test(message)) return "이름은 2자 이상 24자 이하로 적어 주세요.";
  if (/post must be/.test(message)) return "글은 2자 이상 300자 이하로 적어 주세요.";
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
  // typed by something that reads the markup rather than the page.
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
      setBoardStatus("loading");
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
        setBoardPosts([]);
        setBoardStatus(isOnline ? "error" : "local");
        setBoardError(
          isOnline
            ? "게시판을 불러오지 못했습니다. 잠시 뒤에 다시 열어 주세요."
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
  const canSubmitBoardPost =
    !isPostingToBoard &&
    visibleLength(trimmedBoardNickname) >= BOARD_NICKNAME_MIN_LENGTH &&
    visibleLength(trimmedBoardBody) >= BOARD_POST_MIN_LENGTH &&
    activeBoardPrivacySignals.length === 0;

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

  async function submitBoardPost() {
    if (isPostingToBoard) return;
    // The honeypot is answered with a success the board never receives. A script
    // that is told it failed tries again; one that is told it worked moves on.
    if (boardHoneypot.trim().length > 0) {
      setBoardBodyState("");
      setBoardPostStatus("글을 올렸습니다.");
      return;
    }
    if (Date.now() - boardOpenedAtRef.current < BOARD_DWELL_MS) {
      setBoardPostStatus("게시판이 열린 지 얼마 되지 않았습니다. 잠깐 읽어 보고 다시 눌러 주세요.");
      return;
    }
    if (visibleLength(trimmedBoardNickname) < BOARD_NICKNAME_MIN_LENGTH) {
      setBoardPostStatus("이름은 2자 이상 24자 이하로 적어 주세요.");
      return;
    }
    if (visibleLength(trimmedBoardBody) < BOARD_POST_MIN_LENGTH) {
      setBoardPostStatus("글은 2자 이상 300자 이하로 적어 주세요.");
      return;
    }
    if (activeBoardPrivacySignals.length > 0) {
      setBoardPostStatus("식별 정보로 보일 수 있는 표현을 익명화한 뒤 올려 주세요.");
      return;
    }
    if (boardTextHasLink(trimmedBoardNickname)) {
      setBoardPostStatus("이름에는 링크를 넣을 수 없습니다. 이름을 바꿔 다시 올려 주세요.");
      return;
    }
    if (boardTextHasLink(trimmedBoardBody)) {
      setBoardPostStatus("링크가 들어간 글은 올릴 수 없습니다. 링크를 빼고 다시 올려 주세요.");
      return;
    }
    if (boardTextHasContact(trimmedBoardNickname) || boardTextHasContact(trimmedBoardBody)) {
      setBoardPostStatus("전화번호나 이메일이 들어간 글은 올릴 수 없습니다. 빼고 다시 올려 주세요.");
      return;
    }
    const sinceLastPost = Date.now() - lastBoardPostAt;
    if (lastBoardPostAt > 0 && sinceLastPost < BOARD_POST_INTERVAL_MS) {
      const waitSeconds = Math.ceil((BOARD_POST_INTERVAL_MS - sinceLastPost) / 1000);
      setBoardPostStatus(`글은 30초에 한 번만 올릴 수 있습니다. ${waitSeconds}초 뒤에 다시 눌러 주세요.`);
      return;
    }

    setIsPostingToBoard(true);
    writeStoredValue(BOARD_NICKNAME_KEY, trimmedBoardNickname);
    const sessionId = getSessionId();
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
      setBoardReloadToken((token) => token + 1);
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
    canSubmitBoardPost,
    activeBoardPrivacySignals,
    anonymizeBoardBody,
    submitBoardPost,
  };
}
