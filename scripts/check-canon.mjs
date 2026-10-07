/**
 * Canon check.
 *
 * Every case hangs off one loan -- 대출번호 2023-0412 -- and fifty-five cases
 * written by many hands restate its facts: the day the committee sat, the minute
 * the dissent was returned, the floor the team worked on, how many people the
 * borrower employed. By 2026-09 the five 프롤로그 chapters gave three approval
 * dates and three rejection times, and two of those were evidence-turn reveals,
 * so a player who unlocked both held facts that could not both be true.
 *
 * `docs/canon.md` is the prose; `CANON` below is the same table in a form a
 * script can hold the copy to. Each fact says how copy states it (`find`, whose
 * capture groups are the value) and what it is allowed to say (`allow`). A fact
 * is looked for only in the files that talk about it (`files`), because the
 * season has other committees, other floors and other 12 Aprils.
 *
 * A pattern is written as wide as the copy lets it be. The first table matched
 * one sentence shape per fact, in the files that held it that day, so "반려 시각
 * 13:40" and a wrong head-count in 사건 11 both passed (audit of 2026-10-07).
 * A fact is now read in every file that can state it, and a time or a count is
 * matched by what it stands next to rather than by the sentence around it.
 *
 * The check reads source text, not the built graph, so it needs no imports from
 * `src/` and cannot be fooled by a table a generator never reads.
 */
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const PROLOGUE = /src\/nodes\/prologue\d+\.js$/;
const SEASON = /src\//;
/** The named case files, and every file but them. */
const caseFiles = (names) => new RegExp(`src/nodes/(?:${names})\\.js$`);
const seasonBut = (names) => new RegExp(`src/(?!nodes/(?:${names})\\.js$)`);
/** The two files that sum every case up in a line or two. */
const SUMMARIES = "|src/gameCases\\.js$|src/caseCopy\\.js$";

// A clock time the way copy writes one: 13:32, 13시 32분, 오후 1시 32분.
const TIME = "(오후 |저녁 |밤 )?(\\d{1,2})(?:시 ?|:)(\\d{1,2})분?";
// What may sit between a word and the time it is given: a particle, a name, a
// label's colon. No full stop, comma or double quote, so the time belongs to
// the same clause, and no digit, so "반려 3시간 뒤" is not a time of day.
const GAP = '[^.,"\\d]{0,14}?';

/** The loan, the people around it, and the building they worked in. */
export const CANON = [
  {
    id: "loan-number",
    fact: "the loan is 대출번호 2023-0412",
    files: SEASON,
    // The second shape is the number standing alone: 2023-0421 is a typo of
    // this loan wherever it is. 인사 제2023-1187호 is not a 2023-0... number.
    find: /대출번호 (\d{4}-\d{4})|(?<![\d-])(2023-0\d{3})(?![\d-])/g,
    allow: ["2023-0412"],
  },
  {
    id: "loan-amount",
    fact: "the loan is 310억 원",
    files: SEASON,
    find: /플로우온(?:,| 운영자금|에 나갈|이 은행에서)? ([\d,]+)억|KD은행이 ([\d,]+)억을 빌려준 플로우온|\(대출 잔액 ([\d,]+)억\)/g,
    allow: ["310"],
  },
  {
    id: "loan-amount-named",
    fact: "a loan the 프롤로그 and the case summaries put a figure on is this one, 310억",
    files: new RegExp(`${PROLOGUE.source}${SUMMARIES}`),
    find: /(?<![\d,])([\d,]+)억(?: 원)?(?:짜리)? (?:대출|심사)|(?<![\d,])([\d,]+)억은 (?:승인됐|나갔)/g,
    // 사건 48's loan is 루프나우's 290억, and the summaries name it.
    except: /루프나우/,
    allow: ["310"],
  },
  {
    id: "committee-date",
    fact: "the loan committee sat on 27 April 2023",
    files: PROLOGUE,
    find: /심사위원회(?:는|까지|로)? ?(?:이달 |4월 )(\d+)일/g,
    allow: ["27"],
  },
  {
    id: "approval-date",
    fact: "2023-0412 was approved on 27 April 2023, not on the day the file landed",
    files: SEASON,
    find: /(?:승인된 |승인 -- )(\d+)월 (\d+)일|(\d+)월 (\d+)일(?:에)? (?:반려와 )?승인|(\d+)\/(\d+) (?:반려·)?승인/g,
    allow: ["4 27"],
  },
  {
    id: "sale-start",
    fact: "the product went on sale the day the loan was approved",
    files: SEASON,
    find: /판매 개시(?:일은)? (\d+)월 (\d+)일/g,
    allow: ["4 27"],
  },
  {
    id: "rejection-time",
    fact: "the dissent was returned at 13:32, twenty-eight minutes before the committee",
    files: SEASON,
    // Either order: "반려 서명은 13:32", "13시 32분에 반대 의견을 반려한".
    // "반려된 지 세 시간 뒤" and "반려 3시간 뒤" date something else by it.
    find: new RegExp(`반려(?!된 지| \\d+시간)${GAP}${TIME}|${TIME}(?:에|,)? (?:반대 의견서?[가을를] )?반려(?!된 지| \\d+시간)`, "g"),
    allow: ["13 32", "오후 1 32"],
  },
  {
    id: "disposal-time",
    fact: "the dissent was switched from 보관 to 폐기 at 18:44 the same day",
    files: SEASON,
    find: new RegExp(`폐기${GAP}${TIME}|변경 신청: 윤상혁 계정 ${TIME}`, "g"),
    allow: ["18 44", "저녁 6 44"],
  },
  {
    id: "transfer-draft",
    fact: "the transfer notice was drafted at 16:32 on the day of the rejection",
    files: PROLOGUE,
    find: /작성 시각(?:은)? 4월 (\d+)일 (\d+)시 (\d+)분 -- 반려|작성 시각은 4월 (\d+)일 (\d+)시 (\d+)분, 반대 의견서가|공용 계정이 4월 (\d+)일 (\d+)시 (\d+)분에/g,
    allow: ["27 16 32"],
  },
  {
    id: "reported-ratio",
    fact: "the reported debt ratio was 179.6%",
    files: SEASON,
    find: /(?:보고된|보고) 부채비율[^.]{0,40}?(\d+\.\d)%|보고치 (\d+\.\d)%/g,
    allow: ["179.6"],
  },
  {
    id: "ratio-values",
    fact: "a ratio around the 180% line is one of the loan's two: 179.6% reported, 184.2% rebuilt",
    // 프롤로그 01 is 온새포장's file, the autumn before: it has its own two.
    files: seasonBut("prologue01"),
    find: /(?<![\d.])(1[78]\d\.\d)%/g,
    allow: ["179.6", "184.2"],
  },
  {
    id: "trainee-ratio-values",
    fact: "온새포장's ratio goes from 178.4% to 184.7% (프롤로그 01)",
    files: caseFiles("prologue01"),
    find: /(?<![\d.])(1[78]\d\.\d)%/g,
    allow: ["178.4", "184.7", "179.6", "184.2"],
  },
  {
    id: "ratio-is-a-ratio",
    fact: "179.6 is a percentage, never an amount of money",
    files: SEASON,
    find: /(179\.6억)/g,
    allow: [],
  },
  {
    id: "true-ratio",
    fact: "the debt ratio before the revenue was moved was 184.2%",
    files: SEASON,
    find: /(?:다시 세운 부채비율|조정 전 실제치|실제 부채비율)[^.]{0,12}?(\d+\.\d)%/g,
    allow: ["184.2"],
  },
  {
    id: "moved-revenue",
    fact: "268억 of December's 412억 was booked four weeks early",
    files: SEASON,
    find: /매출 (\d+)억 (?:가운데|중) (\d+)억/g,
    allow: ["412 268"],
  },
  {
    id: "dissent-team",
    fact: "the analyst wrote the dissent in 기업금융전략팀",
    files: SEASON,
    find: /KD은행 (기업\S+팀)에서[^.]{0,30}반대 의견/g,
    allow: ["기업금융전략팀"],
  },
  {
    id: "dissent-pages",
    fact: "the dissent is eleven pages, 첨부 7",
    files: SEASON,
    find: /의견서(?:는| 최대)? (열\S*?|\d+) ?[장쪽]|(열\S*?|\d+) ?[장쪽]짜리 (?:반대 의견|문서가 일곱 번째)|첨부 7(?:'|의 쪽수:),? (\d+)쪽|(?:빠진|사라진) (\S+) 쪽|그 (\S+) 쪽을 쓴 사람/g,
    allow: ["열한", "11"],
  },
  {
    id: "team-floor",
    fact: "기업금융전략팀, its 심사실 and its 팀장실 are on the 6th floor of the head office",
    files: SEASON,
    find: /본점 (\d+)층 (?:기업금융전략팀|팀장실|심사실)/g,
    allow: ["6"],
  },
  {
    id: "review-team-floor",
    fact: "기업대출심사팀 and its records room are on the 8th floor",
    files: SEASON,
    find: /(\d+)층 기업대출심사팀/g,
    allow: ["8"],
  },
  {
    id: "committee-floor",
    fact: "대출심사위원회 meets on the 8th floor",
    files: SEASON,
    find: /(\d+)층 대출심사위원회/g,
    allow: ["8"],
  },
  {
    id: "borrower-staff",
    fact: "플로우온 employs 1,140 people",
    // The three files that are about 플로우온 itself. Elsewhere 직원 counts
    // other firms: 루프나우's 214, a 계열사's 400.
    files: caseFiles("prologue02|case01|case09"),
    // Three digits and up: a supplier's seven people are not the borrower's.
    find: /직원(?:은|이)? ([\d,]{3,})명/g,
    allow: ["1,140"],
  },
  {
    id: "borrower-staff-named",
    fact: "wherever 플로우온 직원 are counted, there are 1,140",
    files: SEASON,
    find: /플로우온,? 직원(?:은|이)? ([\d,]+)명/g,
    allow: ["1,140"],
  },
  {
    id: "night-shift-2023",
    fact: "플로우온's night shift is 380 people, 181 of them on contract",
    files: caseFiles("prologue\\d+|case09"),
    find: /야간조 ([\d,]+)명(?: 중 계약직 ([\d,]+)명)?/g,
    allow: ["380", "380 181"],
  },
  {
    id: "night-shift-later",
    fact: "the night shift is 80 people by 사건 16",
    files: new RegExp(`${caseFiles("case16|case17|case23").source}${SUMMARIES}`),
    find: /야간조 ([\d,]+)명|야간 인력 ([\d,]+)명/g,
    // 사건 16 sets one robot against one person: "야간조 1명".
    allow: ["80", "1"],
  },
  {
    id: "father-branch",
    fact: "오상철 was the manager of 수원 매탄지점",
    files: SEASON,
    find: /(?:부천|수원) (\S+?지점)/g,
    allow: ["매탄지점"],
  },
  {
    id: "father-branch-city",
    fact: "매탄지점 is in 수원",
    files: SEASON,
    find: /(\S+) 매탄지점장/g,
    allow: ["수원"],
  },
  {
    id: "auditor-tenure",
    fact: "반재욱 is 감사팀 17년차 in 2023 and twenty years at the bank by the main season; never 3년차",
    files: SEASON,
    find: /(?:감사팀|조사역) (\d+)년차|(\d+)년차 조사역|반재욱(?:은|이|의)? (\d+)년차/g,
    allow: ["17"],
  },
  {
    id: "auditor-notebook",
    fact: "반재욱's notebook holds 47 names",
    files: SEASON,
    // 도윤하's 스프링 수첩 also holds 47 (프롤로그 04); it is written "이름
    // 47개" and is not read here.
    find: /수첩(?:에 적힌| 속)? 이름 (\d+)명|반재욱의 수첩 (?:속 )?(\S+?) ?명|내보낸 (\S+?) ?명의 이름|수첩 (\d+)명 (?:중|가운데)|반재욱의 (\d+)명|(\d+)명의 이름이 적힌 수첩|적힌 이름 (\d+)개\. 정리된/g,
    allow: ["47", "마흔일곱"],
  },
  {
    id: "plaintiffs",
    fact: "1,740 people were harmed; 1,528 have papers and 212 do not",
    files: SEASON,
    find: /원고 ([\d,]{3,})명|피해자 ([\d,]{3,})명|서류 있는 ([\d,]+)명|서류(?:가)? 없는 ([\d,]+)명/g,
    // 31 is what is left of the 212 after the second compensation standard.
    allow: ["1,740", "1,528", "212", "31"],
  },
  {
    id: "reaction-participants",
    fact: "the 트리거랩 반응 기록 that was sold and then leaked is 63 people's",
    // 사건 46 burns or keeps the 원본 of that same record; it said 14 people
    // until this fact was read there. 사건 13's survey and 사건 19's 1기 are
    // other head-counts, so the fact is read only where the record is.
    files: new RegExp(`${caseFiles("case30|case37|case46|finalCase").source}${SUMMARIES}`),
    find: /참가자 (\d+)명|(\d+)명의 반응 기록|반응 기록 (\d+)명분/g,
    allow: ["63"],
  },
  {
    id: "case19-days",
    fact: "사건 19 runs from 1월 19일 to 1월 22일",
    files: caseFiles("case19"),
    find: /clock: "1월 (\d+)일/g,
    allow: ["19", "20", "21", "22"],
  },
  {
    id: "case19-demolition",
    fact: "the 헌책방 is to come down on 1월 22일 06시, moved up from 4월 14일",
    files: new RegExp(`${caseFiles("case19").source}${SUMMARIES}`),
    find: /철거 예정(?:일이 '| )1월 (\d+)일|새 예고문: 1월 (\d+)일|셔터의 1월 (\d+)일|날짜가 1월 (\d+)일로|4월에서 1월 (\d+)일로/g,
    allow: ["22"],
  },
  {
    id: "case19-change-notice",
    fact: "the change of date was filed on 1월 16일, a Friday evening",
    files: caseFiles("case19"),
    find: /변경 신고일은 1월 (\d+)일|철거일이 1월 (\d+)일 금요일/g,
    allow: ["16"],
  },
  {
    id: "tower-floors",
    fact: "르하임 고덕, the 평택 tower, is 22 floors in April and in June",
    files: /src\/nodes\/case(?:26|31)\.js$/,
    find: /(\d+)층(?:짜리)? (?:오피스텔|건물)|(\d+)층 중/g,
    allow: ["22"],
  },
];

const valueOf = (match) => match.slice(1).filter((group) => group !== undefined).map((group) => group.trim()).join(" ");

const isComment = (line) => /^\s*(?:\/\/|\/\*|\*)/.test(line);

// What an `except` is read against: the statement and the clause leading up to
// it, not the whole line -- one line of a case file can hold a whole scene.
const nearby = (line, match) => line.slice(Math.max(0, match.index - 30), match.index + match[0].length + 10);

/** Every statement in `text` that gives a canon fact a value the canon does not allow. */
export function findCanonViolations(text, file) {
  const violations = [];
  const normalized = file.replaceAll("\\", "/");
  const lines = text.split(/\r?\n/);
  for (const entry of CANON) {
    if (!entry.files.test(normalized)) continue;
    lines.forEach((line, index) => {
      if (isComment(line)) return;
      for (const match of line.matchAll(entry.find)) {
        const value = valueOf(match);
        if (entry.allow.includes(value)) continue;
        if (entry.except?.test(nearby(line, match))) continue;
        violations.push({ file: normalized, line: index + 1, id: entry.id, fact: entry.fact, found: match[0], value });
      }
    });
  }
  return violations;
}

const COPY_FILES = () => [
  ...readdirSync("src/nodes")
    .filter((name) => name.endsWith(".js"))
    .sort()
    .map((name) => `src/nodes/${name}`),
  "src/gameData.js",
  "src/gameDialogue.js",
  "src/gameLogic.js",
  "src/gameCases.js",
  "src/caseCopy.js",
  "src/appCopy.js",
  "src/advancedSystems.js",
  "src/featurePack.js",
];

function main() {
  const violations = [];
  const seen = new Map(CANON.map((entry) => [entry.id, 0]));
  for (const file of COPY_FILES()) {
    const text = readFileSync(file, "utf8");
    violations.push(...findCanonViolations(text, file));
    // A fact nothing states any more is a pattern that has rotted, not a pass.
    for (const entry of CANON) {
      if (!entry.files.test(file)) continue;
      const stated = text.split(/\r?\n/).filter((line) => !isComment(line)).join("\n").match(entry.find)?.length ?? 0;
      seen.set(entry.id, seen.get(entry.id) + stated);
    }
  }
  const silent = CANON.filter((entry) => entry.allow.length > 0 && seen.get(entry.id) === 0);

  // `--list` prints what each fact matched, for reading a new pattern's hits.
  if (process.argv.includes("--list")) {
    for (const entry of CANON) console.log(`${String(seen.get(entry.id)).padStart(4)}  ${entry.id}`);
  }

  if (violations.length || silent.length) {
    for (const item of violations) {
      console.error(`${item.file}:${item.line} [${item.id}] "${item.found}" -- ${item.fact}`);
    }
    for (const entry of silent) {
      console.error(`[${entry.id}] no copy states this fact any more; the pattern no longer matches how it is written`);
    }
    console.error(`Canon check failed: ${violations.length} contradicting statements, ${silent.length} facts unmatched. See docs/canon.md.`);
    process.exit(1);
  }
  const total = [...seen.values()].reduce((sum, count) => sum + count, 0);
  console.log(`Canon check passed (${CANON.length} facts, ${total} statements agree).`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
