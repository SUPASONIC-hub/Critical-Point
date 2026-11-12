// Dev-only listening page (music-lab.html, served by `npm run dev`; the build
// never reaches it). Every score the game can play, one click each, plus the
// table gauge that brings the stake's layers in, the scene mood that picks the
// lead and voices the table's drone, and a place to rate them.
import { StrictMode, useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { AdaptiveMusic, MUSIC_MOODS, setMusicMood, setMusicStake } from "../components/AdaptiveMusic.jsx";
import { chapterMotifs, speakerMotifs } from "../components/musicData.js";
import { createSceneMode, isCrackleFixOn, moodLeads, setCrackleFix, STAKE_LAYER_GAUGES } from "../components/musicScore.js";
import { playZoneThud, startTensionDrone } from "../gauntlet/gauntletAudio.js";
import { DRONE_VOICINGS } from "../gauntlet/tensionDrone.js";
import { THUD_ATTACK, THUD_HZ, THUD_RELEASE } from "../gauntlet/zoneThud.js";

const MOOD_NAMES = { neutral: "중립", bright: "밝음", tense: "긴장", dread: "공포", sorrow: "슬픔" };

const NOTES_KEY = "critical-point-music-lab-notes";
const CASES = Object.keys(chapterMotifs).filter((id) => /^case\d+$/.test(id));
const TIERS = [
  ["controlled", "안정"],
  ["unstable", "불안"],
  ["critical", "위기"],
];

const GROUPS = [
  { title: "소개", tracks: [{ key: "intro:menu", name: "시작 화면" }] },
  {
    title: "선택 뒤 결과 시트 (세 곡 고정)",
    tracks: [
      { key: "reveal:gain", name: "많이 받음" },
      { key: "reveal:even", name: "비슷함" },
      { key: "reveal:cost", name: "많이 치름 / BUST" },
    ],
  },
  ...TIERS.map(([tier, label]) => ({
    title: `장면 음악 — ${label} (사건마다)`,
    tracks: CASES.map((id) => ({ key: `${tier}:${id}:scene:voice:0:public`, name: `${label} · ${id}` })),
  })),
  {
    title: "장면 음악 — 화자마다 (안정 · case01)",
    tracks: Object.keys(speakerMotifs).map((speaker) => ({
      key: `controlled:case01:scene:${speaker}:0:public`,
      name: speaker,
    })),
  },
  { title: "사건 결과 화면", tracks: CASES.map((id) => ({ key: `result:${id}`, name: `결과 · ${id}` })) },
  {
    title: "엔딩",
    tracks: [0, 1, 2, 3].map((step) => ({ key: `result:final:${step}`, name: `엔딩 ${step + 1}단계` })),
  },
];
const ALL = GROUPS.flatMap((group) => group.tracks);

function readNotes() {
  try {
    return JSON.parse(window.localStorage.getItem(NOTES_KEY) ?? "{}") ?? {};
  } catch {
    return {};
  }
}

function writeNotes(notes) {
  try {
    window.localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
  } catch {
    // A refused write only loses the notes on reload; the page still works.
  }
}

function describe(key, mood, crackleFix) {
  const mode = createSceneMode(key);
  const bpm = Math.round(60000 / (mode.interval * 4));
  const leads = moodLeads(mode, mood);
  const picks = mood === "sorrow" ? "슬픔 리드(많이 치름 선율을 단조로)" : `리드 ${leads.map((lead) => mode.leads.indexOf(lead) + 1).join("·")}번`;
  const drone = DRONE_VOICINGS[mood];
  return `${mode.label} · ${bpm} BPM · ${mode.wave} · drive ${mode.drive.toFixed(2)}${mode.bassPastDrive ? " · 베이스는 드라이브 밖" : ""}${crackleFix ? "" : " · 고치기 전"} · ${picks} · 드론 ${drone.voices.length}성 ×${drone.level}`;
}

function MusicLab() {
  const [current, setCurrent] = useState(null);
  const [gauge, setGauge] = useState(0);
  const [notes, setNotes] = useState(readNotes);
  const [copied, setCopied] = useState(false);
  const [mood, setMood] = useState("neutral");
  const [droneOn, setDroneOn] = useState(false);
  // 11-10: A/B the crackle fix on one passage. Toggling restarts the track from its first bar.
  const [crackleFix, setCrackleFixState] = useState(isCrackleFixOn);
  const gaugeRef = useRef(gauge);

  useEffect(() => {
    gaugeRef.current = gauge;
    setMusicStake(gauge);
  }, [gauge]);
  useEffect(() => {
    setMusicMood(mood);
  }, [mood]);
  // The table's drone, as GauntletFx drives it: closeness from the gauge, ten times a second.
  useEffect(() => {
    if (!droneOn) return undefined;
    const drone = startTensionDrone();
    const timer = window.setInterval(() => drone.set(gaugeRef.current / 100), 100);
    return () => {
      window.clearInterval(timer);
      drone.stop();
    };
  }, [droneOn]);
  useEffect(() => writeNotes(notes), [notes]);

  function toggleCrackleFix(on) {
    setCrackleFix(on);
    setCrackleFixState(on);
  }

  const index = ALL.findIndex((track) => track.key === current);
  const step = (offset) => setCurrent(ALL[(index + offset + ALL.length) % ALL.length].key);
  const rated = useMemo(() => ALL.filter((track) => notes[track.key]?.rating || notes[track.key]?.memo), [notes]);

  const setNote = (key, patch) => setNotes((all) => ({ ...all, [key]: { ...all[key], ...patch } }));

  async function copyNotes() {
    const lines = rated.map(({ key, name }) => {
      const { rating = "", memo = "" } = notes[key];
      return `- ${name} (${key}): ${rating}${memo ? ` — ${memo}` : ""}`;
    });
    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      window.prompt("복사해서 붙여넣어 주세요", lines.join("\n"));
    }
  }

  return (
    <main style={styles.page}>
      <h1 style={{ margin: "0 0 4px" }}>음악 듣기</h1>
      <p style={styles.muted}>
        곡 이름을 누르면 바로 바뀝니다. 장면 음악은 4마디(약 8~13초)마다 멜로디가 바뀌니 조금 오래 들어 보세요. 분위기(mood)를
        바꾸면 5초에 걸쳐 리드와 판 드론이 섞여 넘어갑니다(긴장 = 지금 그대로).
      </p>

      <section style={styles.bar}>
        <div>
          <strong>{current ? ALL[index].name : "곡을 고르세요"}</strong>
          {current && <div style={styles.muted}>{describe(current, mood, crackleFix)}</div>}
        </div>
        <div style={styles.row}>
          <button type="button" onClick={() => step(-1)} disabled={!current}>
            ◀ 이전
          </button>
          <button type="button" onClick={() => step(1)}>
            다음 ▶
          </button>
          <button type="button" onClick={() => setCurrent(null)} disabled={!current}>
            ■ 멈춤
          </button>
        </div>
        <label style={styles.row}>
          테이블 게이지 {gauge}
          <input type="range" min="0" max="100" value={gauge} onChange={(event) => setGauge(Number(event.target.value))} />
          <span style={styles.muted}>층: {STAKE_LAYER_GAUGES.filter((g) => gauge >= g).length}/3 (25·45·65에서 하나씩)</span>
        </label>
        <div style={styles.row} role="radiogroup" aria-label="분위기">
          분위기
          {MUSIC_MOODS.map((key) => (
            <label key={key} style={styles.rating}>
              <input type="radio" name="mood" checked={mood === key} onChange={() => setMood(key)} />
              {MOOD_NAMES[key]} ({key})
            </label>
          ))}
          <label style={styles.rating}>
            <input type="checkbox" checked={droneOn} disabled={!current} onChange={(event) => setDroneOn(event.target.checked)} />
            판 드론 듣기 (슬라이더 값이 가까움)
          </label>
        </div>
        {/* A1-1 · E3 (11-12): the step marker the table plays as the 현재 위험 line steps up. Needs a track playing (the cue runtime). */}
        <div style={styles.row}>
          <button type="button" onClick={() => playZoneThud()} disabled={!current}>
            쿵 — 위험 단계 오름 표지
          </button>
          <span style={styles.muted}>
            {THUD_HZ}Hz 사인 고정 · {Math.round(THUD_ATTACK * 1000)}ms에 걸쳐 커지고 {Math.round((THUD_ATTACK + THUD_RELEASE) * 1000)}ms에 사라짐 · drive 밖(곡을 켠 뒤 누르세요)
          </span>
        </div>
        <label style={styles.row}>
          <input type="checkbox" checked={crackleFix} onChange={(event) => toggleCrackleFix(event.target.checked)} />
          지직거림 고침 (11-10) — 끄면 고치기 전 소리. 바꾸면 같은 곡이 첫 마디부터 다시 시작합니다
        </label>
        <div style={styles.row}>
          <button type="button" onClick={copyNotes} disabled={!rated.length}>
            평가 {rated.length}개 복사
          </button>
          {copied && <span>복사됨 — 대화창에 붙여넣어 주세요</span>}
        </div>
        {current && <AdaptiveMusic key={crackleFix ? "fix" : "before"} modeKey={current} />}
      </section>

      {GROUPS.map((group) => (
        <details key={group.title} open={group.tracks.length <= 9} style={styles.group}>
          <summary style={{ fontWeight: 700, cursor: "pointer" }}>
            {group.title} ({group.tracks.length})
          </summary>
          {group.tracks.map(({ key, name }) => {
            const note = notes[key] ?? {};
            return (
              <div key={key} style={{ ...styles.track, ...(key === current ? styles.playing : null) }}>
                <button type="button" onClick={() => setCurrent(key)} style={{ minWidth: 150, textAlign: "left" }}>
                  {key === current ? "♪ " : "▶ "}
                  {name}
                </button>
                {["좋음", "보통", "별로"].map((rating) => (
                  <label key={rating} style={styles.rating}>
                    <input
                      type="radio"
                      name={key}
                      checked={note.rating === rating}
                      onChange={() => setNote(key, { rating })}
                    />
                    {rating}
                  </label>
                ))}
                <input
                  type="text"
                  placeholder="메모 (예: 찢어짐, 너무 밝음)"
                  value={note.memo ?? ""}
                  onChange={(event) => setNote(key, { memo: event.target.value })}
                  style={{ flex: 1, minWidth: 160 }}
                />
              </div>
            );
          })}
        </details>
      ))}
    </main>
  );
}

const styles = {
  page: { maxWidth: 920, margin: "0 auto", padding: 16, fontFamily: "system-ui, sans-serif", lineHeight: 1.5 },
  muted: { color: "#666", fontSize: 14, margin: 0 },
  bar: {
    position: "sticky",
    top: 0,
    zIndex: 1,
    display: "grid",
    gap: 8,
    padding: 12,
    margin: "12px 0",
    background: "#f4f4f6",
    border: "1px solid #ddd",
    borderRadius: 8,
  },
  row: { display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8 },
  group: { margin: "8px 0", padding: "8px 12px", border: "1px solid #e4e4e8", borderRadius: 8 },
  track: { display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8, padding: "4px 0" },
  playing: { background: "#fff6d6" },
  rating: { display: "inline-flex", alignItems: "center", gap: 2, fontSize: 14 },
};

createRoot(document.getElementById("lab")).render(
  <StrictMode>
    <MusicLab />
  </StrictMode>,
);
