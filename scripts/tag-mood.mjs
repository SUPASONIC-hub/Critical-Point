/**
 * The season's scene moods, drafted from the words (메모-20261105/design-mood.md).
 *
 *   node scripts/tag-mood.mjs                 draft every scene, print a table per
 *                                             case, write src/sceneMoods.js and the
 *                                             review tables
 *   node scripts/tag-mood.mjs --from-review   the same, but a filled 검토 column in a
 *                                             review table wins over the draft
 *   node scripts/tag-mood.mjs --dry           print only; write nothing
 *   node scripts/tag-mood.mjs --review-dir D  where the review tables live (default:
 *                                             ../cp-archive/메모-20261105/mood-review
 *                                             beside the repository; skipped when that
 *                                             folder's parent does not exist)
 *
 * A scene has one mood -- neutral, bright, tense, dread or sorrow -- and the
 * table colours its surfaces and picks its music by it (data-mood). The draft
 * is a script's reading and a person's review is what ships: the review table
 * (장면 id | 제목/첫 줄 | 근거 | 초안 mood | 검토) is read back with
 * --from-review, and src/sceneMoods.js is the generated result either way.
 * Scores, balance and ranking never read it.
 *
 * The rules, in the order they are added up (every score starts at 0):
 *
 *   1. Words. Each mood has a list of Korean words with a weight (WORDS below).
 *      A word is counted in the scene's own prose -- title, body, memo, the
 *      question and the lead -- at full weight, at most 3 times, and in the
 *      cards' words -- label, voice line, reply -- at half weight, at most
 *      2 times, because a card describes a move the player may not make.
 *      Words are chosen to be whole enough not to match verb endings
 *      (겁니다 is not fear, 감사팀 is not thanks); 감사 by itself counts for
 *      nothing.
 *        bright: humour, warmth, laughter, family meals, thanks, applause,
 *                gifts, relief (농담 웃음 박수 고맙 따뜻 케이크 잔치 다행 ...)
 *        tense : review, pressure, deadlines, hearings, committees, audits,
 *                prosecutors, seizure, dismissal, recordings (압박 심사 마감
 *                청문 징계 검찰 압수 감사팀 녹취 ...)
 *        dread : threat, bodies, darkness, collapse, fire, suicide notes,
 *                accidents, violence, fear (협박 시신 어둠 붕괴 화재 유서 쓰러
 *                무서 ...)
 *        sorrow: death, tears, parting, funerals, mourning (죽음 눈물 이별 장례
 *                빈소 조문 弔問 영정 고인 ...)
 *   2. The room closing in. A scene the graph marks as a pressure beat
 *      (`pressure`, src/nodes/sceneBuild.js) adds 1.5 to tense; a case's
 *      closing decision adds 0.5.
 *   3. The briefing's sound word. The same hash the briefing uses
 *      (pickSfx, src/gauntlet/SceneBriefing.jsx) names the calm-pool word:
 *      째깍 and 지이잉 add 1 to tense, 두근 adds 0.5. (쾅! and the broken pool
 *      are a run-time state, not a scene's.)
 *   4. The phase chip. A few authored chips name the room: HEARING, TRAP,
 *      INTERROGATION, COURTROOM ... add 1 to tense; MEMORIAL, FAREWELL, THE
 *      WAKE, THE WREATHS, SEND-OFF add 2 to sorrow; COLLAPSE, LEAK, NIGHT
 *      CLIMB, SEIZED BOXES, THE CAGE add 2 to dread; YEAR-END PARTY, FAMILY
 *      TABLE, REUNION, KARAOKE, FIREWORKS, HARVEST ... add 1.5 to bright.
 *   5. The cards' cost. The mean of the cards' own pressure
 *      (getRiskPressure over each card's effect, src/riskLogic.js) is a tier:
 *      3 or more (the top tenth of scenes) adds 1 to tense, 4 or more adds 2.
 *      A scene where half the cards or more read like a bust -- fatigue +4 or
 *      worse with trust or legitimacy -5 or worse -- adds 1 to dread.
 *   6. The pick. The highest score wins when it reaches the mood's floor
 *      (tense 4, the others 3) and leads the runner-up by 1; otherwise the
 *      scene is neutral. Ties above the floor go to dread, sorrow, bright,
 *      tense in that order (the rarer reading is the more deliberate one).
 *   7. The case cap. No mood may hold more than 70% of a case's scenes: the
 *      scenes with the smallest lead go back to neutral (`cap70` in the
 *      review table) until it fits. A funeral case or a raid case really is
 *      one colour, and the reviewer may put the scenes back by hand; such a
 *      case gets its own share in CASE_CAP_OVERRIDES (with the reason), which
 *      this rule and `check:mood` both read.
 *
 * `npm run check:mood` (scripts/check-mood.mjs) then holds the generated file
 * to the graph and to that one smell.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { gzipSync } from "node:zlib";
import { CASE_SEQUENCE, choiceVoiceLines, echoReplies, nodeOrders, nodes } from "../src/gameData.js";
import briefingCopy from "../src/copy/briefing.js";
import { hashSeed } from "../src/gauntlet/gauntletEngine.js";
import { getRiskPressure } from "../src/riskLogic.js";

export const MOODS = ["neutral", "bright", "tense", "dread", "sorrow"];

/** [word, weight] per mood. A word may serve two moods (사망 is both grief and dread). */
export const WORDS = {
  bright: [
    ["웃음소리", 2], ["웃음", 1], ["웃으며", 1], ["웃는", 1], ["웃었", 1], ["함께 웃", 2], ["같이 웃", 2],
    ["농담", 2], ["유머", 2], ["미담", 2], ["장난", 1.5], ["익살", 2],
    ["박수", 1.5], ["환호", 1.5], ["축하", 2], ["선물", 1.5], ["생일", 2], ["결혼", 1.5], ["잔치", 2], ["케이크", 2],
    ["맛있", 2], ["국수", 1], ["밥 한", 1], ["저녁을 같이", 1.5], ["같이 먹", 1.5],
    ["고맙", 1.5], ["고마워", 1.5], ["고마운", 1.5], ["감사합니다", 1.5], ["감사해요", 1.5], ["감사드", 1.5], ["덕분", 1.5],
    ["따뜻", 2], ["다정", 1.5], ["포옹", 2], ["안아 ", 1], ["어깨를 두드", 1.5], ["손을 잡", 0.5],
    ["다행", 1.5], ["안도", 1], ["안심", 1], ["환하", 1.5], ["햇살", 1.5], ["반가", 1.5], ["흐뭇", 2], ["뿌듯", 2],
    ["든든", 1], ["응원", 1], ["격려", 1], ["칭찬", 1.5], ["아기", 1.5], ["아이들", 0.5], ["가족", 0.5], ["할머니", 0.5],
  ],
  tense: [
    ["압박", 1.5], ["심사", 0.5], ["마감", 1], ["기한", 0.5], ["시한", 1.5], ["초읽기", 2],
    ["청문", 1.5], ["위원회", 0.5], ["이사회", 0.5], ["징계", 1.5], ["소환", 1.5], ["고발", 1], ["고소", 1], ["소송", 1],
    ["검찰", 1.5], ["경찰", 1], ["수사", 1.5], ["압수", 2], ["영장", 2], ["심문", 2], ["추궁", 1.5], ["대질", 2],
    ["감사팀", 1], ["감사실", 1], ["감사원", 1], ["감사 보고", 1], ["감사 결과", 1], ["내부감사", 1], ["회계감사", 1], ["특별감사", 1],
    ["해고", 1], ["감원", 1], ["정리해고", 1], ["통보", 1], ["최후통첩", 2], ["경고", 1], ["회수", 0.5],
    ["증인", 1], ["법정", 1], ["재판", 1], ["녹취", 1], ["녹음", 1], ["폭로", 1.5], ["몰래", 1], ["미행", 2], ["도청", 2],
    ["기자", 0.5], ["카메라", 1], ["보도", 0.5], ["쫓", 1], ["부도", 1], ["압류", 1.5], ["경매", 1], ["독촉", 1.5],
    ["긴장", 2], ["침묵", 1], ["떨리", 1], ["식은땀", 2], ["숨을 죽", 2], ["숨이 막", 1.5], ["노려", 1.5], ["싸늘", 1.5], ["굳은", 1],
    ["째깍", 1], ["지이잉", 1],
  ],
  dread: [
    ["협박", 3], ["시체", 3], ["시신", 3], ["주검", 3], ["어둠", 1.5], ["어두운", 1.5], ["어둡", 1.5],
    ["붕괴", 3], ["무너진", 1], ["무너져", 1], ["무너질", 1], ["무너지", 1], ["화재", 2.5], ["불길", 2.5], ["불에 타", 2.5], ["불이 났", 2.5], ["폭발", 3],
    ["비명", 2.5], ["공포", 3], ["두려", 1.5], ["무서", 1.5], ["무섭", 1.5], ["소름", 3], ["섬뜩", 3],
    ["납치", 3], ["흉기", 3], ["살인", 3], ["살해", 3], [/(?<!사)유서/, 2.5], ["자살", 2.5], ["투신", 2.5], ["자해", 2.5], ["목숨", 2.5],
    ["추락", 2], ["실종", 2.5], ["위협", 2], ["감금", 2.5], ["폭행", 2.5], ["구타", 2.5], ["학대", 2.5], ["스토킹", 2.5],
    ["멱살", 1.5], [/주먹(?!밥)/, 1.5], ["고함을", 1.5], ["고함 소리", 1.5], ["욕설", 1.5], ["핏자국", 1.5], ["핏기", 1.5], ["핏물", 1.5],
    ["피를 흘", 1.5], ["피가 나", 1.5], ["피투성", 2], ["창백", 1.5],
    ["응급", 1.5], ["구급", 1.5], ["119", 1.5], ["쓰러", 1.5], ["사고 현장", 2], ["깨진", 1], ["재해", 1], ["침수", 1], ["폭우", 1],
    ["정전", 1.5], ["산재", 1.5], ["감전", 2.5], ["화상을 입", 1.5], ["숨어", 1], ["지하실", 1], ["도망", 1],
    ["사망", 1.5], ["죽은", 1.5], ["죽었", 1.5], ["죽음", 1.5],
  ],
  sorrow: [
    ["죽음", 2], ["죽었", 2], ["죽은", 2], ["숨졌", 2], ["숨을 거", 2], ["사망", 1.5], ["세상을 떠", 2.5], ["세상을 떴", 2.5], ["돌아가셨", 2.5], ["돌아가신", 2.5],
    ["눈물", 2.5], ["울음", 2], ["울었", 2], ["울고", 2], ["흐느", 2], ["울먹", 2], ["목이 메", 2], ["먹먹", 2],
    ["이별", 2.5], ["장례", 2.5], ["빈소", 2.5], ["조문", 2.5], ["弔問", 2.5], ["영정", 2.5], ["유족", 1.5], ["유골", 2], ["납골", 2],
    ["상복", 2], ["국화", 1.5], ["애도", 2.5], ["고인", 1], ["임종", 2.5], ["유언", 2], ["마지막 인사", 2],
    ["그리움", 1.5], ["그립", 1.5], ["슬픔", 2.5], ["슬프", 2.5], ["슬픈", 2.5], ["외로", 1.5], ["쓸쓸", 2], ["허전", 1.5], ["상실", 1.5],
    ["잃었", 1], ["잃은", 1], ["후회", 1], ["병실", 1], ["병원", 0.5], ["산재", 1],
  ],
};

const PHASE_RULES = [
  ["tense", 1, /HEARING|TRAP|INTERROGATION|COURTROOM|CROSS-EXAMINATION|PRESSURE|COMMITTEE|BOARD VOTE|PROSECUTION|TAKEDOWN|CONFRONTATION|PROBATION REVIEW|REVIEW ROOM|TESTIMONY/],
  ["sorrow", 2, /MEMORIAL|FAREWELL|THE WAKE|THE WREATHS|SEND-OFF|EMPTY DESK/],
  ["dread", 2, /COLLAPSE|LEAK|NIGHT CLIMB|SEIZED BOXES|THE CAGE|BLACKOUT/],
  ["bright", 1.5, /YEAR-END PARTY|FAMILY TABLE|REUNION|KARAOKE|FIREWORKS|HARVEST|FIRST SNOW|^HOME$|ROOFTOP WELCOME|HAWKER NIGHT|THE GARDEN|THE STEAMERS|UNLIKELY PAIR|MENTOR/],
];

const BODY_CAP = 3;
const CARD_CAP = 2;
const CARD_WEIGHT = 0.5;
const PRESSURE_BONUS = 1.5;
const DECISION_BONUS = 0.5;
const SOUND_BONUS = { 째깍: 1, 지이잉: 1, 두근: 0.5 };
const RISK_TIERS = [
  [4, 2],
  [3, 1],
];
const BUST_SHARE = 0.5;
const FLOOR = { bright: 3, tense: 4, dread: 3, sorrow: 3 };
const LEAD = 1;
const TIE_ORDER = ["dread", "sorrow", "bright", "tense"];

const countIn = (text, word, cap) =>
  Math.min(cap, typeof word === "string" ? text.split(word).length - 1 : (text.match(new RegExp(word.source, "g")) ?? []).length);
/** A word's name in the review table: the regex's letters without its look-arounds. */
const wordLabel = (word) => (typeof word === "string" ? word : word.source.replace(/\(\?<?[!=][^)]*\)/g, ""));

/** The calm-pool sound word the briefing letters on this scene (Korean copy). */
export function sceneSound(nodeId) {
  const pool = briefingCopy.sfxCalm;
  return pool[hashSeed(`sfx:${nodeId}`) % pool.length];
}

function cardPressure(effect = {}) {
  return getRiskPressure({
    time: 72 + (effect.time ?? 0),
    capital: 100 + (effect.capital ?? 0),
    humanCost: Math.max(0, effect.humanCost ?? 0),
    fatigue: Math.max(0, effect.fatigue ?? 0),
  });
}

const isBustLike = (effect = {}) => (effect.fatigue ?? 0) >= 4 && ((effect.trust ?? 0) <= -5 || (effect.legitimacy ?? 0) <= -5);

/**
 * One scene's scores and the rules that fired, from the scene and the two
 * tables its cards' lines are filed in.
 */
export function scoreScene(nodeId, node, lines = { voice: choiceVoiceLines, echo: echoReplies }) {
  const scores = { bright: 0, tense: 0, dread: 0, sorrow: 0 };
  const reasons = [];
  const body = [node.title, node.text, node.question ?? "", node.lead ?? "", ...(node.memo ?? [])].join("\n");
  const cards = node.choices.flatMap((choice) => [choice.label ?? "", lines.voice[choice.id] ?? "", lines.echo[choice.id] ?? ""]).join("\n");

  for (const [mood, list] of Object.entries(WORDS)) {
    const hits = [];
    for (const [word, weight] of list) {
      const inBody = countIn(body, word, BODY_CAP);
      const inCards = countIn(cards, word, CARD_CAP);
      const gained = inBody * weight + inCards * weight * CARD_WEIGHT;
      if (gained > 0) {
        scores[mood] += gained;
        hits.push(`${wordLabel(word)}×${inBody + inCards}`);
      }
    }
    if (hits.length) reasons.push(`${mood}:${hits.join(",")}`);
  }

  if (node.pressure) {
    scores.tense += PRESSURE_BONUS;
    reasons.push("pressure");
  }
  if (node.kind === "decision") {
    scores.tense += DECISION_BONUS;
    reasons.push("decision");
  }
  const sound = sceneSound(nodeId);
  if (SOUND_BONUS[sound]) {
    scores.tense += SOUND_BONUS[sound];
    reasons.push(`sfx:${sound}`);
  }
  for (const [mood, weight, pattern] of PHASE_RULES) {
    if (pattern.test(node.phase ?? "")) {
      scores[mood] += weight;
      reasons.push(`phase:${node.phase}`);
    }
  }
  const effects = node.choices.filter((choice) => choice.effect).map((choice) => choice.effect);
  if (effects.length) {
    const mean = effects.reduce((sum, effect) => sum + cardPressure(effect), 0) / effects.length;
    const tier = RISK_TIERS.find(([floor]) => mean >= floor);
    if (tier) {
      scores.tense += tier[1];
      reasons.push(`risk:${mean.toFixed(1)}`);
    }
    const busts = effects.filter(isBustLike).length / effects.length;
    if (busts >= BUST_SHARE) {
      scores.dread += 1;
      reasons.push(`bust:${Math.round(busts * 100)}%`);
    }
  }

  const ranked = Object.entries(scores).sort(([a, x], [b, y]) => y - x || TIE_ORDER.indexOf(a) - TIE_ORDER.indexOf(b));
  const [[best, top], [, second]] = ranked;
  const mood = top >= FLOOR[best] && top - second >= LEAD ? best : "neutral";
  return { mood, scores, reasons };
}

export const CASE_SHARE_CAP = 0.7;

/**
 * The cases a reviewer read as one colour from end to end, with the share that
 * mood may hold there instead of 70% and why (2026-11-06 review). Rule 7 and
 * check:mood both read it through caseShareCap.
 */
export const CASE_CAP_OVERRIDES = {
  // 사건 32 압수수색: the raid day is pressure from the briefing to the boxes; 15 of 20 scenes tense.
  // The notebook and the lunchbox scenes stay sorrow and bright, so 75%, not more.
  case32: { cap: 0.75, why: "압수수색 하루 전체가 조사·추궁의 긴장" },
};

export const caseShareCap = (caseId) => CASE_CAP_OVERRIDES[caseId]?.cap ?? CASE_SHARE_CAP;

/**
 * Rule 7: no mood may hold more than 70% of a case. The scenes of that mood
 * with the smallest lead over their runner-up go back to neutral until the
 * share fits, and the review table says so (`cap70`), because that is where a
 * person decides whether the case really is one colour from end to end.
 */
export function capCaseShare(rows, cap = CASE_SHARE_CAP) {
  const limit = Math.floor(rows.length * cap);
  for (const mood of MOODS.filter((candidate) => candidate !== "neutral")) {
    const tagged = rows.filter((row) => row.mood === mood);
    if (tagged.length <= limit) continue;
    const lead = (row) => row.scores[mood] - Math.max(...Object.entries(row.scores).filter(([key]) => key !== mood).map(([, value]) => value));
    tagged.sort((a, b) => lead(a) - lead(b));
    for (const row of tagged.slice(0, tagged.length - limit)) {
      row.mood = "neutral";
      row.reasons.push(`cap70:${mood}`);
    }
  }
  return rows;
}

/** Every scene, in case order, scored. */
export function draftMoods() {
  const rows = [];
  for (const caseId of CASE_SEQUENCE) {
    const caseRows = [];
    for (const nodeId of nodeOrders[caseId] ?? []) {
      const node = nodes[nodeId];
      if (!node) continue;
      caseRows.push({ caseId, nodeId, node, ...scoreScene(nodeId, node) });
    }
    rows.push(...capCaseShare(caseRows, caseShareCap(caseId)));
  }
  return rows;
}

// --- the generated file ------------------------------------------------------

export function renderSceneMoods(moods, { reviewed = 0 } = {}) {
  const tagged = Object.entries(moods)
    .filter(([, mood]) => mood !== "neutral")
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));
  const counts = Object.fromEntries(MOODS.map((mood) => [mood, 0]));
  for (const mood of Object.values(moods)) counts[mood] += 1;
  const lines = [
    "// Generated by scripts/tag-mood.mjs -- do not edit by hand; edit the review",
    "// tables (메모-20261105/mood-review) and run it with --from-review.",
    `// ${Object.keys(moods).length} scenes: ${MOODS.map((mood) => `${mood} ${counts[mood]}`).join(", ")}` +
      (reviewed ? `; ${reviewed} set by review` : "") +
      ". Neutral is omitted.",
    `export const MOODS = ${JSON.stringify(MOODS)};`,
    "export const SCENE_MOODS = {",
    ...tagged.map(([id, mood]) => `  ${JSON.stringify(id)}: ${JSON.stringify(mood)},`),
    "};",
    'export const sceneMood = (id) => SCENE_MOODS[id] ?? "neutral";',
    "",
  ];
  return lines.join("\n");
}

// --- the review tables -------------------------------------------------------

const cell = (text) => String(text ?? "").replace(/\|/g, "／").replace(/\s+/g, " ").trim();
const firstLine = (node) => `${node.title} / ${node.text.slice(0, 20)}`;

export function renderReview(caseId, rows) {
  const lines = [
    `# ${caseId} mood 검토표`,
    "",
    "초안은 scripts/tag-mood.mjs의 규칙이 읽은 값입니다. 바꿀 장면만 검토 칸에",
    "neutral / bright / tense / dread / sorrow 중 하나를 적고, 비워 두면 초안대로 갑니다.",
    "",
    "| 장면 id | 제목/첫 줄 20자 | 근거(맞은 규칙) | 초안 mood | 검토 |",
    "|---|---|---|---|---|",
    ...rows.map((row) => `| ${row.nodeId} | ${cell(firstLine(row.node))} | ${cell(row.reasons.join("; ")) || "-"} | ${row.mood} | ${cell(row.review ?? "")} |`),
    "",
  ];
  return lines.join("\n");
}

/** The 검토 column of a review table: scene id -> what the reviewer wrote (non-empty only). */
export function parseReview(markdown) {
  const review = {};
  for (const line of markdown.split("\n")) {
    if (!line.startsWith("|")) continue;
    const cells = line.split("|").slice(1, -1).map((part) => part.trim());
    if (cells.length < 5 || cells[0] === "장면 id" || /^-+$/.test(cells[0])) continue;
    if (cells[4]) review[cells[0]] = cells[4];
  }
  return review;
}

function readReviews(dir) {
  const review = {};
  if (!fs.existsSync(dir)) return review;
  for (const file of fs.readdirSync(dir)) {
    if (!file.endsWith(".md") || file === "README.md") continue;
    Object.assign(review, parseReview(fs.readFileSync(path.join(dir, file), "utf8")));
  }
  return review;
}

function renderReadme(rows, counts, reviewed, topByCase) {
  const rules = fs
    .readFileSync(fileURLToPath(import.meta.url), "utf8")
    .match(/The rules, in the order they are added up[\s\S]*?\*\/\n/)[0]
    .split("\n")
    .map((line) => line.replace(/^\s*\*\s?/, ""))
    .filter((line) => !line.startsWith("/"))
    .join("\n");
  return [
    "# mood 검토표 (2026-11-05 초안)",
    "",
    `장면 ${rows.length}개를 scripts/tag-mood.mjs가 읽어 초안을 냈습니다. 사람 검토가 최종입니다.`,
    "",
    "## 초안 집계",
    "",
    "| mood | 장면 수 |",
    "|---|---|",
    ...MOODS.map((mood) => `| ${mood} | ${counts[mood]} |`),
    "",
    reviewed ? `검토 칸으로 정해진 장면: ${reviewed}개.` : "검토 칸으로 정해진 장면은 아직 없습니다.",
    "",
    "## 사건별 가장 많은 mood",
    "",
    "| 사건 | 장면 수 | 가장 많은 mood | 그 수 | neutral |",
    "|---|---|---|---|---|",
    ...topByCase.map((row) => `| ${row.caseId} | ${row.total} | ${row.top} | ${row.topCount} | ${row.neutral} |`),
    "",
    "## 고치는 법",
    "",
    "1. 사건 파일(`<caseId>.md`)의 **검토** 칸에 `neutral`, `bright`, `tense`, `dread`, `sorrow` 중 하나를 적습니다. 비워 두면 초안대로입니다.",
    "2. 저장소에서 `node scripts/tag-mood.mjs --from-review`를 돌립니다. 검토 칸이 채워진 장면은 그 값으로 `src/sceneMoods.js`가 다시 생성되고, 이 폴더의 표도 다시 쓰이되 검토 칸은 보존됩니다.",
    "3. `npm run check:mood`로 없는 장면 id, 모르는 값, 한 사건의 70%를 넘는 한 가지 mood를 잡습니다.",
    "4. 다른 PC에 폴더가 없으면 `--review-dir <폴더>`로 가리킵니다.",
    "",
    "## 규칙(tag-mood.mjs 머리말 그대로)",
    "",
    "```",
    rules.trimEnd(),
    "```",
    "",
  ].join("\n");
}

// --- the CLI -----------------------------------------------------------------

function repoRoot() {
  const here = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
  // A worktree under .claude/worktrees/<name> shares the main checkout's archive.
  return here.replace(/[\\/]\.claude[\\/]worktrees[\\/][^\\/]+$/, "");
}

function defaultReviewDir() {
  return path.resolve(repoRoot(), "..", "cp-archive", "메모-20261105", "mood-review");
}

function main(argv) {
  const fromReview = argv.includes("--from-review");
  const dry = argv.includes("--dry");
  const dirFlag = argv.indexOf("--review-dir");
  const reviewDir = dirFlag >= 0 ? path.resolve(argv[dirFlag + 1]) : defaultReviewDir();
  const here = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

  const rows = draftMoods();
  const existing = readReviews(reviewDir);
  const unknown = Object.entries(existing).filter(([, value]) => !MOODS.includes(value));
  if (unknown.length) {
    console.error(`review values that are not a mood: ${unknown.map(([id, value]) => `${id}=${value}`).join(", ")}`);
    process.exit(1);
  }
  let reviewed = 0;
  const moods = {};
  for (const row of rows) {
    row.review = existing[row.nodeId] ?? "";
    row.final = fromReview && row.review ? row.review : row.mood;
    if (fromReview && row.review) reviewed += 1;
    moods[row.nodeId] = row.final;
  }

  const counts = Object.fromEntries(MOODS.map((mood) => [mood, 0]));
  for (const mood of Object.values(moods)) counts[mood] += 1;
  const topByCase = [];
  for (const caseId of CASE_SEQUENCE) {
    const caseRows = rows.filter((row) => row.caseId === caseId);
    const caseCounts = Object.fromEntries(MOODS.map((mood) => [mood, 0]));
    for (const row of caseRows) caseCounts[row.final] += 1;
    const [top, topCount] = Object.entries(caseCounts)
      .filter(([mood]) => mood !== "neutral")
      .sort(([, a], [, b]) => b - a)[0];
    topByCase.push({ caseId, total: caseRows.length, top: topCount ? top : "-", topCount, neutral: caseCounts.neutral });
    console.log(
      `${caseId.padEnd(10)} ${String(caseRows.length).padStart(3)}  ` +
        MOODS.map((mood) => `${mood} ${String(caseCounts[mood]).padStart(3)}`).join("  "),
    );
  }
  console.log(`${"total".padEnd(10)} ${String(rows.length).padStart(3)}  ` + MOODS.map((mood) => `${mood} ${String(counts[mood]).padStart(3)}`).join("  "));
  if (fromReview) console.log(`${reviewed} scenes set by the review tables (${reviewDir})`);

  const source = renderSceneMoods(moods, { reviewed });
  const raw = Buffer.byteLength(source);
  console.log(`src/sceneMoods.js: ${raw} bytes raw, ${gzipSync(source).length} gzip`);
  if (dry) return;

  fs.writeFileSync(path.join(here, "src", "sceneMoods.js"), source);
  if (!fs.existsSync(path.dirname(reviewDir))) {
    console.log(`review tables skipped: ${path.dirname(reviewDir)} does not exist`);
    return;
  }
  fs.mkdirSync(reviewDir, { recursive: true });
  for (const caseId of CASE_SEQUENCE) {
    fs.writeFileSync(path.join(reviewDir, `${caseId}.md`), renderReview(caseId, rows.filter((row) => row.caseId === caseId)));
  }
  fs.writeFileSync(path.join(reviewDir, "README.md"), renderReadme(rows, counts, reviewed, topByCase));
  console.log(`review tables: ${reviewDir}`);
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) main(process.argv.slice(2));
