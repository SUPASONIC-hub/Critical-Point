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
/** Where the March vote of 사건 23 is counted: the case, the Monday after, the summaries. */
const AGM = new RegExp(`${caseFiles("case23|case24").source}${SUMMARIES}`);

// A clock time the way copy writes one: 13:32, 13시 32분, 오후 1시 32분.
const TIME = "(오후 |저녁 |밤 )?(\\d{1,2})(?:시 ?|:)(\\d{1,2})분?";
// What may sit between a word and the time it is given: a particle, a name, a
// label's colon. No full stop, comma or double quote, so the time belongs to
// the same clause, and no digit, so "반려 3시간 뒤" is not a time of day.
const GAP = '[^.,"\\d]{0,14}?';
// A rank the bank prints beside a name. The longer of two that share a head
// comes first, so 대표이사 is not read as 대표.
const RANK = "(팀장|상무|전무|부장|차장|과장|실장|대리|부회장|회장|사장|본부장|대표이사|대표|주임|계장)";

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

  // The afternoon of 27 April 2023 ("The loan's timeline" in docs/canon.md).
  // Four of its clock times were in the table; these are the rest.
  {
    id: "committee-hour",
    fact: "대출심사위원회 opens at 14:00 on 27 April, and the loan is approved there",
    files: PROLOGUE,
    find: /(오후 )?(\d{1,2})시(?: (\d+)분)?,? (?:본점 \d+층 )?대출심사위원회|오늘 (오후 )?(\d{1,2})시(?: (\d+)분)?에 승인된/g,
    allow: ["오후 2", "14"],
  },
  {
    id: "committee-countdown",
    fact: "13:32 is 28 minutes before the committee opens, and 08:20 is 5시간 40분 before",
    files: PROLOGUE,
    find: /개회 (\d+)분 전|개회까지 (\d+)시간 (\d+)분/g,
    allow: ["28", "5 40"],
  },
  {
    id: "committee-countdown-summary",
    fact: "the case summaries put the rejection 28 minutes before the committee",
    files: new RegExp(SUMMARIES.slice(1)),
    find: /개회 (\d+)분 전, (?:한서윤|그것은 회의실)/g,
    allow: ["28"],
  },
  {
    id: "agenda-length",
    fact: "안건 4번, the loan, takes 4분 12초",
    files: PROLOGUE,
    find: /안건 4번(?: 소요 시간 --)? (\d+)분 (\d+)초/g,
    allow: ["4 12"],
  },
  {
    id: "call-before-rejection",
    fact: "the call from 팀장실 to 한서윤's desk is logged at 13:21",
    files: PROLOGUE,
    find: new RegExp(`${TIME}, (?:6층 )?팀장실 내선`, "g"),
    allow: ["13 21"],
  },
  {
    id: "call-length",
    fact: "that call lasts eleven minutes and ends as the dissent is returned",
    files: caseFiles("prologue03"),
    find: /통화 시간 (\d+)분|한서윤 자리, (\d+)분|한서윤 자리로 (\d+)분짜리 통화|(\d+)분짜리 통화가 끝나자|'(\d+)분 통화가 끝나자/g,
    allow: ["11"],
  },
  {
    id: "script-written",
    fact: "「스마트물류 3호 응대 요령」 was written at 16:05 on 27 April, two hours after the approval",
    files: PROLOGUE,
    find: /응대 요령[^"]{0,90}?4월 (\d+)일 (\d{1,2})시 0?(\d{1,2})분|대본 작성: [^"]{0,30}?4월 (\d+)일 (\d{1,2})시 0?(\d{1,2})분/g,
    allow: ["27 16 5"],
  },
  {
    id: "script-after-approval",
    fact: "the product reaches the counter two hours after the approval",
    files: new RegExp(`${PROLOGUE.source}${SUMMARIES}`),
    find: /승인(?:이 난 지|된 날)? (\S+) ?시간 (?:뒤|만에)|승인된 대출이 (\S+) 시간 만에/g,
    allow: ["두", "2"],
  },
  {
    id: "script-pages",
    fact: "the 22-page 설명서 reaches the counters as 4 pages",
    files: caseFiles("prologue04"),
    find: /(\d+)쪽에서 (\d+)쪽으로|배포본 (\d+)쪽 (?:→|\/) (?:원본 )?(\d+)쪽|설명서 (\d+)쪽 -- 창구 배포본 (\d+)쪽|(\d+)쪽 중 (\d+)쪽|배포본 (\d+)쪽과 원본 (\d+)쪽/g,
    allow: ["22 4", "4 22"],
  },
  {
    id: "second-standard",
    fact: "the second compensation standard accepts 181 of the 212 without papers and leaves 31",
    files: new RegExp(`${caseFiles("case47").source}${SUMMARIES}`),
    find: /212명 (?:중|가운데) (\d+)명|(?<![\d,])(\d+)명(?:은|의|이)? (?:연휴 안|연휴 중|오늘 18시|오늘 동의|입금|추석 안에|추석을 쇠고)|(\d+)명에게 (?:나갈 돈은 )?118억|-- (\d+)명 118억/g,
    allow: ["181", "31"],
  },

  // The people ("The people" in docs/canon.md): what each is called and when,
  // in the shapes copy writes it. A rank is read wherever it stands beside the
  // name; the dated turns are read where the season states them.
  {
    id: "yun-post-2023",
    fact: "윤상혁 was 기업금융전략팀장 in 2022-23",
    files: SEASON,
    find: /(?:당시|전) (\S+?팀)장 윤상혁|전 (기업\S+?팀)장(?! 임경수)/g,
    allow: ["기업금융전략팀"],
  },
  {
    id: "yun-rank-2023",
    fact: "윤상혁 is 팀장 in the 프롤로그",
    files: PROLOGUE,
    find: new RegExp(`윤상혁 ${RANK}|${RANK} 윤상혁`, "g"),
    allow: ["팀장"],
  },
  {
    id: "yun-rank",
    fact: "윤상혁 is 팀장, then 그룹전략실 상무, then KD캐피탈 대표이사",
    files: SEASON,
    find: new RegExp(`윤상혁 ${RANK}|${RANK} 윤상혁`, "g"),
    allow: ["팀장", "상무", "대표", "대표이사"],
  },
  {
    id: "han-rank-2023",
    fact: "한서윤 is 과장 in the 프롤로그",
    files: PROLOGUE,
    find: new RegExp(`한서윤 ${RANK}|${RANK} 한서윤`, "g"),
    allow: ["과장"],
  },
  {
    id: "han-rank",
    fact: "한서윤 is 기업금융전략팀 과장, then 트리거랩 실장",
    files: SEASON,
    find: new RegExp(`한서윤 ${RANK}|${RANK} 한서윤`, "g"),
    allow: ["과장", "실장"],
  },
  {
    id: "oh-rank",
    fact: "오진우 is 대리",
    files: SEASON,
    find: new RegExp(`오진우 ${RANK}|${RANK} 오진우`, "g"),
    allow: ["대리"],
  },
  {
    id: "baek-rank",
    fact: "백아린 is 그룹전략실 차장",
    files: SEASON,
    find: new RegExp(`백아린 ${RANK}|${RANK} 백아린`, "g"),
    allow: ["차장"],
  },
  {
    id: "im-post",
    fact: "임경수 is 기업대출심사팀장",
    files: SEASON,
    find: /(\S*팀장) 임경수/g,
    allow: ["기업대출심사팀장", "심사팀장"],
  },
  {
    id: "do-window",
    fact: "도윤하's window at 강서지점 is 4번 창구",
    files: SEASON,
    find: /강서지점 (\d+)번 창구/g,
    allow: ["4"],
  },
  {
    id: "do-tenure-2023",
    fact: "도윤하 is 입행 3년차 in 2023",
    files: SEASON,
    find: /입행 (\d+)년차|(\d+)년차 행원 도윤하/g,
    allow: ["3"],
  },
  {
    id: "minseo-code",
    fact: "이민서 is A-017",
    files: SEASON,
    find: /(A-\d{3})(?:은|이|는)? 이민서|(A-\d{3}) = 이민서|이민서의 (A-\d{3})/g,
    allow: ["A-017"],
  },
  {
    id: "participant-codes",
    fact: "the list of 63 runs A-001 to A-063",
    files: SEASON,
    find: /A-001(?:부터| ~) (A-\d{3})/g,
    allow: ["A-063"],
  },
  {
    id: "agm-vote",
    fact: "윤상혁's appointment passes at 찬성 50.6% (사건 23)",
    files: AGM,
    // "찬성 55%" is the pre-count and "찬성률 97.1%" last year's: neither is
    // a decimal standing right after the word.
    find: /(?:찬성|가결) (\d+\.\d)%/g,
    allow: ["50.6"],
  },
  {
    id: "agm-against",
    fact: "49.4% vote against the appointment (사건 23)",
    files: AGM,
    find: /반대 (\d+\.\d)%/g,
    allow: ["49.4"],
  },
  {
    id: "agm-followers",
    fact: "of the 49.4%, 22.7% is foreign institutions that follow 클리어보트",
    files: AGM,
    find: /외국인 기관(?:이)? (\d+\.\d)%/g,
    allow: ["22.7"],
  },
  {
    id: "agm-others",
    fact: "of the 49.4%, 18.7% is the other institutions; 국민연금's 8% is the rest",
    files: AGM,
    find: /그 밖의 기관(?:이)? (\d+\.\d)%/g,
    allow: ["18.7"],
  },
  {
    id: "yun-dismissal",
    fact: "윤상혁 is dismissed 5 to 3 (사건 43)",
    files: SEASON,
    find: /해임안 가결 -- 찬성 (\d+) · 반대 (\d+)|해임은 (\d+) ?대 (\d+)/g,
    allow: ["5 3"],
  },
  {
    id: "yun-sentence",
    fact: "the first trial gives 윤상혁 징역 3년, 집행유예 5년 (사건 44)",
    files: SEASON,
    find: /징역 (\d+)년(?:,|에)? 집행유예(?:\([^)]*\))? (\d+)년/g,
    allow: ["3 5"],
  },
  {
    id: "baek-resignation",
    fact: "백아린 hands in her resignation on 3월 27일",
    files: SEASON,
    find: /(\d+)월 (\d+)일에 낸 사표/g,
    allow: ["3 27"],
  },
  {
    id: "baek-report",
    fact: "백아린 files the 공익신고 on 6월 19일",
    files: SEASON,
    find: /공익신고 접수 (\d+)월 (\d+)일|(\d+)월 (\d+)일, 그가 금융감독원에 공익신고/g,
    allow: ["6 19"],
  },
  {
    id: "im-death",
    fact: "임경수 dies before dawn on 9월 15일 (사건 45)",
    files: SEASON,
    find: /임경수 별세: (\d+)월 (\d+)일/g,
    allow: ["9 15"],
  },
  {
    id: "echo-replaced",
    fact: "노아 replaces 에코 at 2월 1일 00:00 (사건 20)",
    files: SEASON,
    find: /노아 전환 완료: (\d+)월 (\d+)일 (\d+):(\d+)/g,
    allow: ["2 1 00 00"],
  },
  {
    id: "father-year",
    fact: "오상철 delayed the approval in 2009",
    files: SEASON,
    find: /(\d{4})년, 수원 매탄지점장|오상철 -- (\d{4})년|(\d{4})년 (?:지점장 교체 검토서|인사 공고 사본)/g,
    allow: ["2009"],
  },
  {
    id: "father-after",
    fact: "오상철 was moved three months later and retired five years after",
    files: caseFiles("prologue01"),
    find: /([^\s"']+ 달) 뒤 (?:오상철은|관리 부서 발령)|(\d+)년 뒤 명예퇴직/g,
    allow: ["석 달", "5"],
  },
  {
    id: "han-borrowed-line",
    fact: "한서윤's one 자네 is '이건 자네를 위한 겁니다', borrowed from 윤상혁",
    files: caseFiles("prologue03"),
    find: /이건 (\S+?)[을를] 위한 겁니다/g,
    allow: ["자네"],
  },
  {
    id: "han-one-jane",
    fact: "in the 프롤로그 a scene 한서윤 speaks has 자네 only in that one line",
    files: PROLOGUE,
    // Read only under `speaker: "한서윤"`: the scenes other people speak are
    // full of 자네, and it is theirs.
    speaker: "한서윤",
    find: /(자네)(?!를 위한 겁니다)/g,
    allow: [],
  },
];

const valueOf = (match) => match.slice(1).filter((group) => group !== undefined).map((group) => group.trim()).join(" ");

const isComment = (line) => /^\s*(?:\/\/|\/\*|\*)/.test(line);

// What an `except` is read against: the statement and the clause leading up to
// it, not the whole line -- one line of a case file can hold a whole scene.
const nearby = (line, match) => line.slice(Math.max(0, match.index - 30), match.index + match[0].length + 10);

/**
 * The lines of a file that copy can stand on, each with its line number and the
 * speaker of the scene it is in: from a `speaker: "…"` line to the next one.
 * The facts and the calendar are both read from this one list, so a file is
 * split, and its comments are told from its copy, once however many passes
 * read it. A comment still names a speaker, as it did when every pass split the
 * text for itself.
 */
function copyLines(text) {
  const lines = [];
  let speaker = "";
  for (const [index, line] of text.split(/\r?\n/).entries()) {
    speaker = line.match(/speaker: "([^"]+)"/)?.[1] ?? speaker;
    if (!isComment(line)) lines.push({ number: index + 1, line, speaker });
  }
  return lines;
}

/**
 * Every place the lines of `file` state a canon fact, agreeing or not. An entry
 * with a `speaker` is read only on the lines of a scene that speaker has.
 */
function* canonStatements(lines, file) {
  for (const entry of CANON) {
    if (!entry.files.test(file)) continue;
    for (const { number, line, speaker } of lines) {
      if (entry.speaker && speaker !== entry.speaker) continue;
      for (const match of line.matchAll(entry.find)) {
        const value = valueOf(match);
        const agrees = entry.allow.includes(value) || Boolean(entry.except?.test(nearby(line, match)));
        yield { entry, agrees, file, line: number, found: match[0], value };
      }
    }
  }
}

/**
 * The year a date in `file` belongs to when it does not say ("The main
 * season's calendar" in docs/canon.md). The files that sum up every case can
 * be speaking of any of the four.
 */
export function canonYears(file) {
  const normalized = file.replaceAll("\\", "/");
  const prologue = normalized.match(/src\/nodes\/prologue(\d+)\.js$/);
  if (prologue) return Number(prologue[1]) === 1 ? [2022] : [2023];
  const numbered = normalized.match(/src\/nodes\/case(\d+)\.js$/);
  if (numbered) return Number(numbered[1]) <= 18 ? [2025] : [2026];
  if (/src\/nodes\/finalCase\.js$/.test(normalized)) return [2026];
  return [2022, 2023, 2025, 2026];
}

// A date written with its weekday: "4월 27일 목요일", "1월 16일 (금)", with or
// without a year in front.
const DATED_WEEKDAY = /(?:(\d{4})년 )?(\d{1,2})월 (\d{1,2})일(?: ?\(([월화수목금토일])\)| ([월화수목금토일])요일)/g;
const WEEKDAYS = "일월화수목금토";
const weekdayOf = (year, month, day) => WEEKDAYS[new Date(Date.UTC(year, month - 1, day)).getUTCDay()];

/** Every date in the lines of `file` that is written with a weekday, and whether the weekday fits its year. */
function* datedWeekdays(lines, file) {
  for (const { number, line } of lines) {
    for (const match of line.matchAll(DATED_WEEKDAY)) {
      const [, year, month, day] = match;
      const weekday = match[4] ?? match[5];
      const years = year ? [Number(year)] : canonYears(file);
      const agrees = years.some((candidate) => weekdayOf(candidate, Number(month), Number(day)) === weekday);
      yield { agrees, years, file, line: number, found: match[0], value: weekday, actual: years.map((candidate) => `${candidate}: ${weekdayOf(candidate, Number(month), Number(day))}요일`).join(", ") };
    }
  }
}

/**
 * Everything the check reads in `text`: each statement of a canon fact, each
 * date written with a weekday, and the ones among them the canon does not
 * allow. The run needs all three -- what contradicts, and how much was read at
 * all -- and used to read every file three times over to get them.
 */
export function readCanon(text, file) {
  const normalized = file.replaceAll("\\", "/");
  const lines = copyLines(text);
  const statements = [...canonStatements(lines, normalized)];
  const dates = [...datedWeekdays(lines, normalized)];
  const violations = [];
  for (const { entry, agrees, ...where } of statements) {
    if (!agrees) violations.push({ ...where, id: entry.id, fact: entry.fact });
  }
  for (const { agrees, actual, ...where } of dates) {
    if (!agrees) violations.push({ ...where, id: "weekday", fact: `a date stated with a weekday fits its year (${actual})` });
  }
  return { statements, dates, violations };
}

/** Every statement in `text` that gives a canon fact a value the canon does not allow. */
export function findCanonViolations(text, file) {
  return readCanon(text, file).violations;
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
  let weekdays = 0;
  for (const file of COPY_FILES()) {
    const read = readCanon(readFileSync(file, "utf8"), file);
    violations.push(...read.violations);
    // A fact nothing states any more is a pattern that has rotted, not a pass.
    for (const { entry } of read.statements) seen.set(entry.id, seen.get(entry.id) + 1);
    weekdays += read.dates.length;
  }
  const silent = CANON.filter((entry) => entry.allow.length > 0 && seen.get(entry.id) === 0);
  // The same for the calendar: the season prints a weekday beside some two
  // hundred dates, and a pattern that finds none of them has stopped reading.
  if (weekdays === 0) silent.push({ id: "weekday" });

  // `--list` prints what each fact matched, for reading a new pattern's hits.
  if (process.argv.includes("--list")) {
    for (const entry of CANON) console.log(`${String(seen.get(entry.id)).padStart(4)}  ${entry.id}`);
    console.log(`${String(weekdays).padStart(4)}  weekday`);
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
  console.log(`Canon check passed (${CANON.length} facts, ${total} statements agree; ${weekdays} dates fit the weekday they are written with).`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
