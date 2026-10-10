import { setAccessibility, TABLE_TIME_SCALES, useAccessibility } from "../state/accessibilitySettings.js";

// 스토리 모드 is first: it is the one that changes what the table asks, and
// the intro's play-style drawer shows the same switch.
const TOGGLES = [
  {
    key: "storyMode",
    label: "스토리 모드",
    text: "벽이 멀어지고, 깨진 판이 다음 판으로 넘어오지 않습니다. 벽에 닿아도 장면을 건너뛰지 않습니다. 시계는 2배 느립니다. 다음 사건부터 적용되고, 공개 랭킹에는 오르지 않습니다.",
  },
  {
    key: "holdReadingClock",
    label: "읽기 시계 자동 넘김 끄기",
    text: "장면 설명이 저절로 넘어가지 않습니다. 다 읽고 직접 테이블을 엽니다.",
  },
  {
    key: "calmEffects",
    label: "번쩍임·흔들림 줄이기",
    text: "붉은 가장자리, 판정 섬광, 화면 흔들림을 약하게 합니다.",
  },
  {
    key: "letterKeys",
    label: "한 글자 단축키 쓰기",
    text: "1-9, W, E, Q, P, R, N. 끄면 Space, Enter, Esc만 남습니다.",
  },
  {
    key: "stillIntro",
    label: "첫 화면 움직임 멈추기",
    text: "흐르는 문구, 움직이는 그림, 깜빡이는 제목을 멈춥니다.",
  },
];

/**
 * The comfort settings, in the intro's setup console (never a panel in front
 * of the table). Each one is stored the moment it changes and read where it
 * applies: src/state/accessibilitySettings.js says what each one does.
 */
export function AccessibilityPanel() {
  const settings = useAccessibility();
  return (
    <section className="accessibility-panel start-console-section" aria-label="편의 설정">
      <fieldset className="accessibility-time">
        <legend>테이블 시간</legend>
        <p>테이블의 제한 시간이 이만큼 느리게 흐릅니다. 1배가 아닌 기록은 랭킹에 표시됩니다.</p>
        <div>
          {TABLE_TIME_SCALES.map((scale) => (
            <label key={scale}>
              <input
                type="radio"
                name="accessibility-table-time"
                value={scale}
                checked={settings.tableTime === scale}
                onChange={() => setAccessibility({ tableTime: scale })}
              />
              <span>{scale}배</span>
            </label>
          ))}
        </div>
      </fieldset>
      {TOGGLES.map((toggle) => (
        <label key={toggle.key} className="accessibility-toggle">
          <input type="checkbox" checked={settings[toggle.key]} onChange={(event) => setAccessibility({ [toggle.key]: event.target.checked })} />
          <span>
            <b>{toggle.label}</b>
            <small>{toggle.text}</small>
          </span>
        </label>
      ))}
    </section>
  );
}
