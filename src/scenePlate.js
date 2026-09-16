/**
 * A drawing for every scene, derived from the scene rather than shipped with it.
 *
 * The season has 169 scenes and ten raster files, six of which are reused as
 * ending backdrops, so the table showed the player a room name and nothing else.
 * Shipping 169 photographs is not an option the art budget allows -- the 480px
 * variants alone are capped at 26KB each -- and a picture that arrives as a file
 * has to be re-cut every time a scene moves to a different room.
 *
 * So the plate is computed. `getScenePlate` reads the two facts the scene
 * already states about itself -- `place`, which says what kind of room this is,
 * and `phase`, which says how much pressure is on it -- and returns a spec that
 * `ScenePlate.jsx` draws as inline SVG. No bytes are downloaded, `check:art`
 * has nothing new to police, and a scene that is rewritten into a different
 * building draws its new building on the next render.
 *
 * Everything here is deterministic: the same node always produces the same
 * plate, so a scene does not redraw itself differently on a reload or a resume.
 */

/** The rooms this season walks, reduced to what they look like. */
export const PLATE_MOTIFS = [
  "skyline",
  "street",
  "floor",
  "coast",
  "gallery",
  "control",
  "archive",
  "corridor",
  "hall",
  "counter",
  "desk",
];

/**
 * Which motif a room is, most specific first.
 *
 * Order matters twice. `입찰 대기실` is a room you work a bid in, not a place
 * you wait, so 입찰 is tested before 대기실; `야간조 대기실` is the warehouse
 * floor, so 야간조 is tested before both.
 *
 * The shore and the gallery are places before they are rooms: a 펜션's office
 * is still a room by the sea, and a 전시장 is a wall of canvases whatever
 * building it is in. So both are tested before the counter and every generic
 * room word -- a place that names a room after its `·` still gets that room,
 * because the room segment is matched first.
 */
const MOTIF_RULES = [
  ["skyline", ["옥상", "33층", "그룹전략실"]],
  ["street", ["헌책방", "포장마차", "퇴근길", "중앙시장", "골목", "주차장"]],
  ["floor", ["풀필먼트", "야간조", "물류"]],
  ["coast", ["경포", "바닷가", "펜션", "해변", "항구", "방파제"]],
  ["gallery", ["갤러리", "화랑", "전시장"]],
  ["counter", ["창구", "지점", "객장"]],
  ["control", ["통제실", "시스템 지도", "배차석", "상황판"]],
  ["archive", ["보관소", "자료실", "서버실", "기록실", "서고", "색인", "설계 로그", "승인 기록"]],
  ["hall", ["입찰", "발표장", "이사회", "위원회실", "회의실", "협의실", "협상실", "상황실", "브리핑룸"]],
  ["corridor", ["복도", "탕비실", "엘리베이터", "대기실", "면담실"]],
];

/** Beats where the room is closing in. Everything else reads cool. */
const PRESSURE_PHASES = new Set([
  "BREAK THE BOARD",
  "COUNTER PRESSURE",
  "TRAP",
  "LEAK",
  "PUBLIC PRESSURE",
  "COLLAPSE",
  "BOARD VOTE",
  "HEARING",
  "CONFRONTATION",
  "FINAL DECISION",
  "THE OTHER CONDITION",
  "AFTERMATH",
  "LAST EVIDENCE",
  "THE TRACE",
  "THE BAIT",
  "THE LEDGER",
  "THE TIMING",
]);

/** Clocks that say the lights are off outside. */
const NIGHT_MARKERS = ["새벽", "마지막 밤", "23:", "00:", "02:", "소등"];

/**
 * The buildings this season walks, in the order light was assigned to them.
 *
 * Every plate used to be lit the same grey, so 트리거랩 and 강서지점 read as the
 * same room with different furniture. A building keeps one colour of light
 * across every scene inside it, which is what makes the season's movement --
 * lab, client, branch, bookshop -- legible at a glance instead of only in the
 * dateline. The tone is the building's, not the case's, so a case that visits
 * three buildings looks like it visited three buildings.
 */
const PLATE_TONES = 4;

export function getPlateTone(place = "") {
  const building = String(place).split("·")[0].trim();
  if (!building) return 0;
  return hashString(building) % PLATE_TONES;
}

function hashString(value) {
  let hash = 0x811c9dc5;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash >>> 0;
}

/**
 * A small deterministic generator. Every plate pulls its jitter from one of
 * these seeded with the scene id, so two scenes in the same room differ in
 * which windows are lit and where the vanishing point sits, and the same scene
 * never differs from itself.
 */
export function createPlateRandom(seed) {
  let state = seed >>> 0;
  return function next() {
    state = (state + 0x6d2b79f5) >>> 0;
    let drawn = Math.imul(state ^ (state >>> 15), 1 | state);
    drawn = (drawn + Math.imul(drawn ^ (drawn >>> 7), 61 | drawn)) ^ drawn;
    return ((drawn ^ (drawn >>> 14)) >>> 0) / 4294967296;
  };
}

function matchMotif(text) {
  for (const [motif, markers] of MOTIF_RULES) {
    if (markers.some((marker) => text.includes(marker))) return motif;
  }
  return null;
}

/**
 * A place names its building and then, after a `·`, the room inside it. The
 * room wins: `돌봄 배차 복구 통제실 · 복도` is a corridor, not a wall of
 * screens. When the room names nothing this knows -- `· 이전 참가자 구역` --
 * the building answers instead, which puts that scene back in the archive.
 */
export function getPlateMotif(place = "") {
  const segments = place.split("·").map((segment) => segment.trim()).filter(Boolean);
  const room = segments.length > 1 ? matchMotif(segments[segments.length - 1]) : null;
  // Terminals, review seats, someone's chair, an interview room: a surface with
  // a screen and paper on it. Most of the lab is this.
  return room ?? matchMotif(place) ?? "desk";
}

/**
 * The spec one scene draws from.
 *
 * `nodeId` is the seed rather than the title, because a title can be shared and
 * an id cannot -- two scenes called "FINAL DECISION" in different cases have to
 * look like different rooms.
 */
export function getScenePlate(node = {}, nodeId = "") {
  const place = String(node.place ?? "");
  const clock = String(node.clock ?? "");
  const motif = getPlateMotif(place);
  const seed = hashString(`${nodeId}:${place}`);
  return {
    motif,
    seed,
    tone: getPlateTone(place),
    accent: PRESSURE_PHASES.has(node.phase) ? "heat" : "chip",
    night: NIGHT_MARKERS.some((marker) => clock.includes(marker)),
  };
}
