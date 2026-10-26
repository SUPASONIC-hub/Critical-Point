import { localizeTables } from "../locale.js";

/**
 * The comfort settings (AccessibilityPanel.jsx, on the intro and in the play
 * header's dialog): the words it prints, read by key so another language can
 * be laid over them (src/locale.js, 다국어 틀). The Korean is the panel's own,
 * moved here unchanged. `toggles` is keyed by the setting each switch writes.
 */
const comfortCopy = {
  label: "편의 설정",
  tableTime: {
    legend: "테이블 시간",
    text: "테이블의 제한 시간이 이만큼 느리게 흐릅니다. 1배가 아닌 기록은 랭킹에 표시됩니다.",
    scale: "{scale}배",
  },
  toggles: {
    storyMode: {
      label: "스토리 모드",
      text: "벽이 멀어지고, 벽에 닿은 판이 다음 판으로 넘어오지 않습니다. 벽에 닿아도 장면을 건너뛰지 않습니다. 시계는 2배 느립니다. 다음 사건부터 적용되고, 공개 랭킹에는 오르지 않습니다.",
    },
    holdReadingClock: {
      label: "읽기 시계 자동 넘김 끄기",
      text: "장면 설명이 저절로 넘어가지 않습니다. 다 읽고 직접 테이블을 엽니다.",
    },
    foldReadScenes: {
      label: "읽은 장면 접기",
      text: "NEW GAME+ 시즌에 지난 시즌에 읽은 장면의 본문을 접습니다. 질문은 그대로 보입니다.",
    },
    calmEffects: {
      label: "번쩍임·흔들림 줄이기",
      text: "붉은 가장자리, 판정 섬광, 화면 흔들림을 약하게 합니다.",
    },
    edgeNotices: {
      label: "가장자리 알림 띄우기",
      text: "밀어붙일수록 화면 위 가장자리에 메신저·메일이 잠깐 뜹니다.",
    },
    letterKeys: {
      label: "한 글자 단축키 쓰기",
      text: "1-9, W, E, Q, P, R, N. 끄면 Space, Enter, Esc만 남습니다.",
    },
    stillIntro: {
      label: "첫 화면 움직임 멈추기",
      text: "흐르는 문구, 움직이는 그림, 깜빡이는 제목을 멈춥니다.",
    },
  },
  storyScale: {
    legend: "이야기 글 크기",
    text: "장면 설명, 판정 뒤 이야기, 사건 결말과 막간의 글자를 키웁니다. 테이블은 그대로입니다.",
    // 이야기 글 크기 (D-5), by what a player sees rather than by the factor.
    labels: ["기본", "크게", "더 크게"],
  },
};
export default comfortCopy;

localizeTables("screens", { comfort: comfortCopy });
