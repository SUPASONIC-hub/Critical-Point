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
  "transit",
  "floor",
  "coast",
  "gallery",
  "bookshop",
  "cafe",
  "ward",
  "control",
  "archive",
  "lobby",
  "corridor",
  "hall",
  "chamber",
  "newsroom",
  "market",
  "memorial",
  "factory",
  "studio",
  "auditorium",
  "server",
  "orchard",
  "trading",
  "school",
  "construction",
  "courtroom",
  "airport",
  "callcenter",
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
  // The rooms the season's second half walks into. A set with lights on stands,
  // a hall that faces a stage, a room of racks, an orchard, a trading floor and
  // a school gate -- each named before the generic rules that would take it:
  // 서버실 is not the archive, 대강당's 무대 is not a meeting table, and a
  // 교문 in the snow is not the street.
  // The season's last stretch: a half-built tower, a courtroom, an airport and
  // a call centre. A 법정 is named before the hearing room so a trial is not a
  // 국정감사, and a 콜센터's rows of headsets are not a wall of screens.
  ["construction", ["공사 현장", "타워크레인", "현장 사무소", "골조"]],
  ["courtroom", ["법정", "재판정"]],
  ["airport", ["공항", "출국장", "탑승구", "입국장"]],
  ["callcenter", ["콜센터", "상담석"]],
  ["studio", ["스튜디오", "촬영장", "세트장", "크로마키", "방송국"]],
  ["auditorium", ["대강당", "주주총회장", "강당", "금융 교실", "설명회장"]],
  ["server", ["서버실", "데이터센터", "전산실"]],
  ["orchard", ["과수원", "감귤밭", "귤밭", "귤 창고", "농장"]],
  ["trading", ["운용실", "트레이딩룸", "딜링룸"]],
  ["school", ["교문", "고사장", "학교 앞", "운동장"]],
  ["skyline", ["옥상", "33층", "그룹전략실", "루프탑", "마리나"]],
  // The back of a car is not the road it is on. Tested before 도로 and 골목 so a
  // scene that names both lands in the seat rather than on the street.
  ["transit", ["택시", "뒷자리", "지하철", "전동차", "버스", "고속도로", "승강장", "기차"]],
  // A bookshop's second floor is a room made of paper, not the alley outside it,
  // so the interior is matched before 헌책방 reaches the street rule below.
  ["bookshop", ["헌책방 2층", "책장", "장부 더미", "계단참"]],
  ["ward", ["요양병원", "병실", "병동", "간호", "응급실", "침상"]],
  ["cafe", ["카페", "찻집", "커피", "창가 자리"]],
  ["street", ["헌책방", "포장마차", "퇴근길", "중앙시장", "골목", "주차장", "앞 도로", "횡단보도"]],
  ["floor", ["풀필먼트", "야간조", "물류"]],
  ["coast", ["경포", "바닷가", "펜션", "해변", "항구", "방파제"]],
  ["gallery", ["갤러리", "화랑", "전시장"]],
  ["counter", ["창구", "지점", "객장"]],
  ["control", ["통제실", "시스템 지도", "배차석", "상황판", "운영실"]],
  ["archive", ["보관소", "자료실", "기록실", "서고", "색인", "설계 로그", "승인 기록"]],
  // A 국정감사 room is a hall with a raised dais and a witness table, and it is
  // the one room in the season where the cameras are the point. Tested before
  // the generic hall so 정무위원회 회의실 does not fall into 회의실.
  ["chamber", ["정무위원회 회의실", "국정감사장", "참고인석", "증인석", "본회의장"]],
  ["newsroom", ["편집국", "보도국", "편집실"]],
  // The places the loan landed. A shop in a covered market, a columbarium, and
  // a machine floor nobody has switched on in a year -- each tested before the
  // street and floor rules that would otherwise swallow them.
  ["market", ["떡방", "떡집", "망원시장"]],
  ["memorial", ["추모공원", "봉안당", "납골당", "장례식장", "빈소"]],
  ["factory", ["공단", "공장", "선반"]],
  ["hall", ["입찰", "발표장", "이사회", "위원회실", "회의실", "협의실", "협상실", "상황실", "브리핑룸"]],
  ["lobby", ["로비", "안내데스크", "출입 게이트"]],
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

/** Rooms where someone is always taking a picture. */
const FLASH_MOTIFS = new Set(["chamber", "newsroom"]);

/** Rooms open to the sky, where daylight comes in as rays and a storm as lightning. */
const SKY_MOTIFS = new Set(["skyline", "street", "coast", "orchard", "school", "construction"]);

/** Rooms where snow can be seen falling: open sky, or mostly window. */
const SNOW_MOTIFS = new Set([...SKY_MOTIFS, "transit", "cafe", "memorial"]);

/** Rooms lit from the rig above: the light is the point of the room. */
const SPOT_MOTIFS = new Set(["studio", "auditorium"]);

/** Rooms where machines blink at each other all night. */
const LED_MOTIFS = new Set(["server", "trading", "control"]);

/** A city seen at night, out of focus: the lights become discs. */
const BOKEH_MOTIFS = new Set(["skyline", "street"]);

/** Rooms lit through high windows: daylight comes in as rays, but no storm reaches in. */
const SHAFT_MOTIFS = new Set(["factory", "memorial"]);

/** Rooms with something on the boil. */
const STEAM_MOTIFS = new Set(["market", "cafe"]);

/** Clocks that say the lights are off outside. */
const NIGHT_MARKERS = ["새벽", "마지막 밤", "23:", "00:", "02:", "소등"];

/**
 * Clocks that say it is winter. The season runs from 추석 to the next March, so
 * the middle cases stand in snow; a month is read as a whole word so 11월 is not
 * 1월 and 12월 is.
 */
const WINTER_MARKERS = ["첫눈", "눈발", "눈 오는", "폭설", "함박눈", "한파"];
const WINTER_MONTH = /(^|[^0-9])(12|1|2)월/;

/**
 * The other seasons the second year walks through, each read off the clock
 * the same way winter is: blossom in April, the monsoon in July, heat haze in
 * August, fireworks on a festival night, leaves in September, and the full
 * moon over 추석. A month is a whole word here too.
 */
const SEASON_MARKERS = {
  petals: { words: ["벚꽃", "꽃잎"], month: /(^|[^0-9])4월/ },
  monsoon: { words: ["장마", "폭우", "태풍"] },
  haze: { words: ["폭염", "열대야"] },
  fireworks: { words: ["불꽃", "축제"] },
  leaves: { words: ["낙엽", "단풍"], month: /(^|[^0-9])9월/ },
  moon: { words: ["추석", "보름달", "한가위"] },
};

function readSeason(clock, key) {
  const { words, month } = SEASON_MARKERS[key];
  return words.some((word) => clock.includes(word)) || Boolean(month?.test(clock));
}

/** Rooms with open sky or a window on it, where the weather is visible. */
const WEATHER_MOTIFS = new Set(["skyline", "street", "coast", "orchard", "school", "construction", "transit", "cafe", "memorial", "airport"]);

/**
 * The feeling a scene runs on, read from its first trigger, as a colour grade
 * laid over the drawing: warm when it is about people, hot when it is about a
 * wrong, cold when it is about being afraid or used. Everything else is left
 * ungraded so the organisation's light is what the eye reads.
 */
const MOOD_TRIGGERS = [
  ["warm", ["affection", "protection", "trust"]],
  ["hot", ["injustice", "revenge", "competition"]],
  ["cold", ["fear", "helplessness", "manipulation"]],
];

export function getPlateMood(triggers = []) {
  const first = triggers?.[0];
  return MOOD_TRIGGERS.find(([, keys]) => keys.includes(first))?.[0] ?? "none";
}

/**
 * The organisations this season walks, and the colour of light in each.
 *
 * Every plate used to be lit the same grey, so 트리거랩 and 강서지점 read as the
 * same room with different furniture. An organisation keeps one colour of light
 * across every scene inside it, which is what makes the season's movement --
 * lab, client, bank, care platform -- legible at a glance instead of only in the
 * dateline. The tone belongs to the organisation, not the case, so a case that
 * visits three of them looks like it visited three.
 *
 * It used to be `hashString(place.split("·")[0]) % 4`, which reads as though it
 * assigns one colour per building and does not: the text before the `·` is the
 * building *and the room*, so `플로우온 본사 8층 상황실` and `플로우온 본사 8층
 * 재무회의실` hash to different numbers. Measured over the season's 91 places
 * that gave 트리거랩 four different colours, 플로우온 four, 온새 three and
 * KD은행 two -- the lab alone changed colour sixteen times while standing
 * still, which is the exact effect the tone exists to prevent. Naming the
 * owners costs one table and makes the promise true.
 *
 * Order matters: 브릿지은행 is tested before the generic 은행 marker so the
 * counterparty does not get the home bank's light, and the outside world is
 * last so it only catches what no organisation claimed.
 */
const ORG_RULES = [
  ["lab", ["트리거랩"]],
  ["client", ["플로우온"]],
  ["rival", ["노바웍스", "브릿지은행", "넥스트마일"]],
  // The public: the legislature and the press. Nobody on the season's payroll
  // owns these rooms, but they are not off it either -- everyone is watching.
  ["public", ["국회", "리드라인", "금융감독원"]],
  ["bank", ["KD은행", "KD금융그룹", "은행"]],
  ["care", ["온새", "돌봄"]],
];

/** Every organisation's light, plus the world outside them all at index 0. */
export const PLATE_TONE_NAMES = ["outside", "lab", "client", "rival", "bank", "care", "public"];

/**
 * Which light a place is lit by. Anything no organisation owns -- the bookshop,
 * the market, the shore, the hospital, the café -- shares one tone on purpose:
 * off the season's payroll is itself a place, and the player reads it as relief
 * from the four corporate colours rather than as a sixth company.
 */
export function getPlateOrg(place = "") {
  const text = String(place);
  for (const [org, markers] of ORG_RULES) {
    if (markers.some((marker) => text.includes(marker))) return org;
  }
  return "outside";
}

export function getPlateTone(place = "") {
  return Math.max(0, PLATE_TONE_NAMES.indexOf(getPlateOrg(place)));
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
  const night = NIGHT_MARKERS.some((marker) => clock.includes(marker));
  const winter = WINTER_MARKERS.some((marker) => clock.includes(marker)) || WINTER_MONTH.test(clock);
  return {
    motif,
    seed,
    tone: getPlateTone(place),
    accent: PRESSURE_PHASES.has(node.phase) ? "heat" : "chip",
    night,
    // The effects layer. Each is a fact the scene already states: a public room
    // is being photographed, open sky by day lets light in, and a night under
    // pressure outdoors gets its storm.
    flash: FLASH_MOTIFS.has(motif) || getPlateOrg(place) === "public",
    rays: !night && (SKY_MOTIFS.has(motif) || SHAFT_MOTIFS.has(motif)),
    steam: STEAM_MOTIFS.has(motif),
    // Winter replaces the rain: a cold clock over open sky or glass snows,
    // night or day, and a storm does not break over snow.
    snow: winter && SNOW_MOTIFS.has(motif),
    lightning: night && !winter && SKY_MOTIFS.has(motif) && PRESSURE_PHASES.has(node.phase),
    spot: SPOT_MOTIFS.has(motif),
    leds: LED_MOTIFS.has(motif),
    bokeh: night && BOKEH_MOTIFS.has(motif),
    ticker: motif === "trading",
    mood: getPlateMood(node.triggers),
    // The second year's seasons, each only where there is sky to see it in.
    // The monsoon falls by day as well as night and takes the storm's place;
    // fireworks and the moon need a night; haze needs the heat outdoors.
    petals: !winter && WEATHER_MOTIFS.has(motif) && readSeason(clock, "petals"),
    monsoon: WEATHER_MOTIFS.has(motif) && readSeason(clock, "monsoon"),
    haze: !night && WEATHER_MOTIFS.has(motif) && readSeason(clock, "haze"),
    fireworks: night && SKY_MOTIFS.has(motif) && readSeason(clock, "fireworks"),
    leaves: WEATHER_MOTIFS.has(motif) && readSeason(clock, "leaves"),
    moon: night && SKY_MOTIFS.has(motif) && readSeason(clock, "moon"),
  };
}
