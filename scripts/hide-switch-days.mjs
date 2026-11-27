/**
 * N45 (F1 숨김 스위치 켜는 날 판정, 2026-11-19): Verify Ranking(밤) 요약에 한 줄
 *
 *   거짓 표시 0 연속 N일 / 14 (판정한 행 M, 오늘 밤 K)
 *
 * 스위치(`ranking_hide_marked`, supabase/migrations/20261117000000_ranking_hide_switch.sql)는 「정직한 시즌을
 * 14일 동안 숨길 표시가 없으면」 켭니다. 지금 시즌은 모두 정직하게 친 것으로 보므로, 밤 보고의 끝줄
 * 「Hide switch (...): would hide X of Y checked runs.」의 X가 0이 아니면 그 밤은 거짓 표시가 있는 밤입니다.
 *
 * 연속 일수는 따로 적어 두지 않고, 지난 실행들의 요약 artifact(`verify-ranking-summary`, 45일 보관)를 그대로
 * 다시 읽어 셉니다: 상태 파일·저장소 쓰기·새 비밀값이 없고, 이 줄이 들어오기 전의 밤도 첫날부터 셉니다.
 *
 * - 하루는 실행 시각 −12시간의 KST 날짜(23:55 밤 실행이 GitHub 지연으로 다음 날 아침에 돌아도, 월요일 00:20
 *   실행도 그 전날로). 같은 날 실행이 여럿이면 하루로 셉니다.
 * - 끝줄이 없는 요약은 읽은 행이 0이면(「Read 0 runs」) 판정 0행의 깨끗한 밤, 아니면(읽기 실패) 세지 않음.
 *   artifact가 없는 실행(토큰 없음·실패)도 세지 않습니다: 그날은 판정하지 않은 날이라 연속을 끊지도 않습니다.
 * - M은 연속한 밤들이 판정한 행(시즌)을 더한 수(밤마다 다시 읽는 상위 20은 거듭 셈). M이 0이면 「거짓 0」은
 *   의미가 없으니, N이 14가 돼도 SQL을 보이지 않습니다.
 *
 *   node scripts/hide-switch-days.mjs runs.json prev tonight.md
 *     runs.json   gh run list --json databaseId,createdAt 의 결과(이번 실행 빼고)
 *     prev        실행마다 prev/<databaseId>/verify-ranking-summary.md
 *     tonight.md  이번 실행의 요약(지금 시각으로 셈)
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

/** 스위치를 켜기 전에 거짓 표시 없이 지나야 하는 날 수(F1-3 (1)). */
export const HIDE_SWITCH_DAYS = 14;
/** 하루를 셀 때 실행 시각에서 빼는 시간: 늦게 돈 밤 실행도 예약한 날로. */
export const DAY_SHIFT_HOURS = 12;
const KST_OFFSET_MS = 9 * 3600 * 1000;

/** 켜는 SQL(마이그레이션 머리말의 「On:」과 같은 문장, 한 줄). */
export const HIDE_SWITCH_ON_SQL =
  "insert into public.private_settings (name, value) values ('ranking_hide_marked', '1') on conflict (name) do update set value = excluded.value;";

/** 실행 시각(밀리초)이 셈하는 KST 날짜. */
export function streakDay(ms) {
  return new Date(ms - DAY_SHIFT_HOURS * 3600 * 1000 + KST_OFFSET_MS).toISOString().slice(0, 10);
}

/** 요약 한 벌에서 { checked, hiding }; 판정이 없었던(읽기 실패) 요약이면 null. */
export function readSummary(text) {
  const source = String(text ?? "");
  const end = /would hide (\d+) of (\d+) checked runs/.exec(source);
  if (end) return { hiding: Number(end[1]), checked: Number(end[2]) };
  if (/^Read 0 runs\b/m.test(source)) return { hiding: 0, checked: 0 };
  return null;
}

/**
 * 밤들(`{ ms, checked, hiding }`, 판정 없는 밤은 빼고)에서 가장 최근의 거짓 표시 뒤로 이어진 날 수와 행 수.
 * `today`는 이번 실행(`tonight: true`)이 판정한 행(이번 실행이 판정하지 못했거나 깨끗하지 않으면 null).
 */
export function hideSwitchStreak(nights) {
  const sorted = [...nights].filter((night) => Number.isFinite(night?.ms)).sort((a, b) => b.ms - a.ms);
  const days = new Set();
  let checked = 0;
  let flaggedOn = null;
  for (const night of sorted) {
    if (night.hiding > 0) {
      flaggedOn = streakDay(night.ms);
      break;
    }
    days.add(streakDay(night.ms));
    checked += night.checked;
  }
  // 거짓 표시가 난 날의 다른(앞선) 깨끗한 실행은 그날을 깨끗한 날로 만들지 못합니다.
  if (flaggedOn) days.delete(flaggedOn);
  const tonight = sorted.find((night) => night.tonight);
  return { days: days.size, checked, flaggedOn, today: tonight && tonight.hiding === 0 ? tonight.checked : null };
}

/** 요약에 붙일 줄들(마크다운). */
export function formatStreak(streak) {
  const tonight = streak.today === null ? "" : `, 오늘 밤 ${streak.today}`;
  const lines = [`- 거짓 표시 0 연속 ${streak.days}일 / ${HIDE_SWITCH_DAYS} (판정한 행 ${streak.checked}${tonight})`];
  if (streak.flaggedOn) lines.push(`- 마지막 거짓 표시: ${streak.flaggedOn} (위 보고의 「hide switch: hidden once on」 줄)`);
  if (streak.days >= HIDE_SWITCH_DAYS && streak.checked > 0) {
    lines.push("- 켤 날입니다. Supabase SQL 편집기에서 한 줄 (끄기: `delete from public.private_settings where name = 'ranking_hide_marked';`):");
    lines.push("", "```sql", HIDE_SWITCH_ON_SQL, "```");
  } else if (streak.days >= HIDE_SWITCH_DAYS) {
    lines.push("- 날 수는 찼지만 판정한 행이 0이라 「거짓 0」이 아직 아무것도 말하지 않습니다: 켜지 않습니다.");
  }
  return lines;
}

/** 지난 실행 목록·artifact 폴더·이번 요약에서 밤들을 모읍니다. */
export function collectNights({ runs, prevDir, tonight, now, read = (path) => (existsSync(path) ? readFileSync(path, "utf8") : null) }) {
  const nights = [];
  for (const run of runs) {
    const ms = Date.parse(run?.createdAt ?? "");
    const text = read(join(prevDir, String(run?.databaseId), "verify-ranking-summary.md"));
    const found = text === null ? null : readSummary(text);
    if (found && Number.isFinite(ms)) nights.push({ ms, ...found });
  }
  const tonightFound = readSummary(tonight);
  if (tonightFound) nights.push({ ms: now, ...tonightFound, tonight: true });
  return nights;
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  const [runsFile, prevDir, tonightFile] = process.argv.slice(2);
  if (!runsFile || !prevDir || !tonightFile) {
    console.error("node scripts/hide-switch-days.mjs runs.json prev tonight.md");
    process.exit(2);
  }
  const runs = existsSync(runsFile) ? JSON.parse(readFileSync(runsFile, "utf8")) : [];
  const tonight = existsSync(tonightFile) ? readFileSync(tonightFile, "utf8") : "";
  const streak = hideSwitchStreak(collectNights({ runs: Array.isArray(runs) ? runs : [], prevDir, tonight, now: Date.now() }));
  console.log(["### 숨김 스위치 켜는 날 (F1, N45)", "", ...formatStreak(streak)].join("\n"));
}
