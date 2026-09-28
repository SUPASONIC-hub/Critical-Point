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
 * The check reads source text, not the built graph, so it needs no imports from
 * `src/` and cannot be fooled by a table a generator never reads.
 */
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const PROLOGUE = /src\/nodes\/prologue\d+\.js$/;
const SEASON = /src\//;

/** The loan, the people around it, and the building they worked in. */
export const CANON = [
  {
    id: "loan-number",
    fact: "the loan is 대출번호 2023-0412",
    files: SEASON,
    find: /대출번호 (\d{4}-\d{4})/g,
    allow: ["2023-0412"],
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
    find: /(?:승인된 |승인 -- )(\d+)월 (\d+)일|(\d+)월 (\d+)일 (?:반려와 )?승인|(\d+)\/(\d+) (?:반려·)?승인/g,
    allow: ["4 27"],
  },
  {
    id: "sale-start",
    fact: "the product went on sale the day the loan was approved",
    files: PROLOGUE,
    find: /판매 개시(?:일은)? (\d+)월 (\d+)일/g,
    allow: ["4 27"],
  },
  {
    id: "rejection-time",
    fact: "the dissent was returned at 13:32, twenty-eight minutes before the committee",
    files: SEASON,
    find: /반려 (?:처리 시각은|처리:|서명은|서명) ?(오후 )?(\d+)[시:] ?(\d+)/g,
    allow: ["13 32", "오후 1 32"],
  },
  {
    id: "disposal-time",
    fact: "the dissent was switched from 보관 to 폐기 at 18:44 the same day",
    files: SEASON,
    find: /폐기 처리(?:는)? (\d+):(\d+)|'폐기'로 바뀐 건 (저녁|밤) (\d+)시 (\d+)분/g,
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
    id: "team-floor",
    fact: "기업금융전략팀 works on the 6th floor of the head office",
    files: PROLOGUE,
    find: /본점 (\d+)층 기업금융전략팀/g,
    allow: ["6"],
  },
  {
    id: "review-team-floor",
    fact: "기업대출심사팀 and its records room are on the 8th floor",
    files: PROLOGUE,
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
    files: /src\/nodes\/(?:prologue02|case01)\.js$/,
    // Three digits and up: a supplier's seven people are not the borrower's.
    find: /직원 ([\d,]{3,})명/g,
    allow: ["1,140"],
  },
  {
    id: "father-branch",
    fact: "오상철 was the manager of 수원 매탄지점",
    files: SEASON,
    find: /(?:부천|수원) (\S+?지점)/g,
    allow: ["매탄지점"],
  },
  {
    id: "plaintiffs",
    fact: "1,740 people were harmed; 1,528 have papers and 212 do not",
    files: SEASON,
    find: /원고 ([\d,]{3,})명|서류 있는 ([\d,]+)명|서류(?:가)? 없는 ([\d,]+)명/g,
    // 31 is what is left of the 212 after the second compensation standard.
    allow: ["1,740", "1,528", "212", "31"],
  },
];

const valueOf = (match) => match.slice(1).filter((group) => group !== undefined).map((group) => group.trim()).join(" ");

const isComment = (line) => /^\s*(?:\/\/|\/\*|\*)/.test(line);

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
