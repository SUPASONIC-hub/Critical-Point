import { gzipSync } from "node:zlib";
import { pathToFileURL } from "node:url";

/**
 * The season's authored data, split by case and put back together.
 *
 * Step 1 of the per-case chunk split (docs/work-status.md, "Still open"). The
 * runtime chunk carries every scene of all 55 cases before the first one is
 * drawn; about 950KB gzip of it is four tables -- the built scenes, the
 * replies, the voice lines and the scene context -- of which the first case
 * needs about 11KB. The plan is to ship those tables as one data file per
 * case, built from the graph `gameData.js` already assembles, and to fill the
 * same objects the runtime reads today as each case arrives, so no reader has
 * to become asynchronous.
 *
 * This module is that split and its inverse, and nothing reads it at run time
 * yet. `tests/unit/season-split.test.mjs` holds it to the one property the
 * rest of the plan stands on: merging the split gives back exactly the tables
 * it was cut from, and every value survives JSON.
 *
 * Where a key belongs:
 *   - a scene, and its scene context, to the scene's own `caseId`;
 *   - a reply or a voice line, to the case of the scene that deals that card;
 *   - a reply for a card the runtime deals itself (a memory card,
 *     `case07_memory_system`), to the case its id names.
 * Anything left over is `shared`, which the test expects to be empty.
 */
export const SPLIT_TABLES = ["nodes", "echoReplies", "choiceVoiceLines", "sceneContext"];

/** The fields of a case pack that `gameLogic.js` reads (its `packTable`), all small. */
export const PACK_LOGIC_FIELDS = ["clue", "outcomes", "carryovers", "continuityChallenges"];

export async function loadSeasonTables() {
  const [data, dialogue, context] = await Promise.all([
    import("../src/gameData.js"),
    import("../src/gameDialogue.js"),
    import("../src/nodes/sceneContext.js"),
  ]);
  return {
    caseSequence: data.CASE_SEQUENCE,
    // What every case needs from the start, small enough to ship whole: the
    // orders and openings, the memory-card plans, each case's fork, the people,
    // and the pack fields the rules read.
    index: {
      nodeOrders: data.nodeOrders,
      caseOpeningRoutes: data.caseOpeningRoutes,
      reframeRouteNodes: data.reframeRouteNodes,
      memoryPlans: data.continuityMemoryChoicePlans,
      caseBranchNodes: data.getCaseBranchNodes(),
      characterProfiles: dialogue.characterProfiles,
      roleSpans: dialogue.characterRoleSpans,
      characterOverrides: dialogue.packCharacterOverrides,
      packs: data.CASE_PACKS.map((pack) => Object.fromEntries([["id", pack.id], ...PACK_LOGIC_FIELDS.map((field) => [field, pack[field]])])),
    },
    tables: {
      nodes: data.nodes,
      echoReplies: data.echoReplies,
      choiceVoiceLines: dialogue.choiceVoiceLines,
      sceneContext: context.sceneContext,
    },
  };
}

function caseNamedById(id, caseSequence) {
  const prefix = String(id).split("_")[0];
  return caseSequence.includes(prefix) ? prefix : null;
}

export function splitSeason({ caseSequence, tables }) {
  const cases = Object.fromEntries(caseSequence.map((caseId) => [caseId, Object.fromEntries(SPLIT_TABLES.map((table) => [table, {}]))]));
  const shared = Object.fromEntries(SPLIT_TABLES.map((table) => [table, {}]));
  const choiceCase = {};
  for (const [nodeId, scene] of Object.entries(tables.nodes)) {
    for (const choice of scene.choices ?? []) choiceCase[choice.id] ??= scene.caseId;
    const bucket = cases[scene.caseId] ?? shared;
    bucket.nodes[nodeId] = scene;
  }
  const place = (table, key, value, caseId) => ((caseId && cases[caseId]) || shared)[table][key] = value;
  for (const [key, value] of Object.entries(tables.sceneContext)) place("sceneContext", key, value, tables.nodes[key]?.caseId);
  for (const table of ["echoReplies", "choiceVoiceLines"]) {
    for (const [key, value] of Object.entries(tables[table])) place(table, key, value, choiceCase[key] ?? caseNamedById(key, caseSequence));
  }
  return { cases, shared };
}

export function mergeSeason({ cases, shared }) {
  const merged = Object.fromEntries(SPLIT_TABLES.map((table) => [table, { ...shared[table] }]));
  for (const bucket of Object.values(cases)) {
    for (const table of SPLIT_TABLES) Object.assign(merged[table], bucket[table]);
  }
  return merged;
}

/**
 * What the app is shipped: the index with the one shared reply added, and for
 * each case its scenes, replies and voice lines. The scene context is left
 * out -- it is already built into the scenes -- and so is nothing else.
 */
export function buildRuntimeData(season) {
  const { cases, shared } = splitSeason(season);
  return {
    index: { ...season.index, sharedEcho: shared.echoReplies },
    cases: Object.fromEntries(
      Object.entries(cases).map(([caseId, bucket]) => [caseId, { nodes: bucket.nodes, echoReplies: bucket.echoReplies, choiceVoiceLines: bucket.choiceVoiceLines }]),
    ),
  };
}

/**
 * Objects reachable from two different top-level keys, by the property they
 * sit under: a JSON copy would give each key its own. The generators reuse one
 * `triggers` list and one `effect` / `cognition` object across scenes; nothing
 * at run time writes to them or compares them by identity, so a copy behaves
 * the same. The test holds the sharing to those three.
 */
export function findSharedReferences(table) {
  const owner = new Map();
  const shared = new Set();
  const walk = (value, key, property) => {
    if (!value || typeof value !== "object") return;
    const seen = owner.get(value);
    if (seen !== undefined) {
      if (seen !== key) shared.add(property);
      return;
    }
    owner.set(value, key);
    for (const [childProperty, child] of Object.entries(value)) walk(child, key, Array.isArray(value) ? property : childProperty);
  };
  for (const [key, value] of Object.entries(table)) walk(value, key, "(root)");
  return [...shared].sort();
}

const gz = (value) => gzipSync(JSON.stringify(value)).length;

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  const season = await loadSeasonTables();
  const { shared } = splitSeason(season);
  const whole = gz(season.tables);
  console.log(`The index every case needs: ${(gz(season.index) / 1024).toFixed(1)}KB gzip.`);
  const shipped = buildRuntimeData(season);
  const sizes = Object.entries(shipped.cases).map(([caseId, bucket]) => [caseId, gz(bucket)]);
  const largest = [...sizes].sort((a, b) => b[1] - a[1]).slice(0, 3);
  console.log(`The four tables: ${(whole / 1024).toFixed(0)}KB gzip in one piece.`);
  console.log(`Shipped per case (no scene context). First case (${sizes[0][0]}): ${(sizes[0][1] / 1024).toFixed(1)}KB gzip. Largest: ${largest.map(([id, size]) => `${id} ${(size / 1024).toFixed(1)}KB`).join(", ")}.`);
  console.log(`Shared (no case): ${SPLIT_TABLES.map((table) => `${table} ${Object.keys(shared[table]).length}`).join(", ")}.`);
}
