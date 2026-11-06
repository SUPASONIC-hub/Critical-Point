/**
 * The words of B-3(1) 냉정한 오프닝 (state/coldOpening.js): the Korean here,
 * English and Japanese under src/locales/<lang>/coldOpening.js, all imported by
 * the page so they ship in its chunk and only when the switch is on. Every
 * fact is case 01's first scene and memo, cut down (canon numbers unchanged: 72시간, 1,140명, 2023-0412, 반대 1건), and the
 * last panel is the 「3년 전」 the prologue opens under (prologue01.js: October
 * 2022, the last probation task). Cut to fit 90 seconds: the timed walk read
 * 91.2 with the lab-record quote and 「수습 3개월차」 in, so both went.
 */
import en from "../locales/en/coldOpening.js";
import ja from "../locales/ja/coldOpening.js";

export const COLD_OPENING_COPY = {
  ko: {
    label: "COLD OPEN / 2025 / TRIGGERLAB",
    title: "냉정한 오프닝",
    next: "다음",
    skip: "건너뛰기",
    step: "{at}/{total}",
    panels: [
      { caption: "72시간", text: "새벽 배송 물류 플랫폼 플로우온. 직원 1,140명. 남은 돈으로 버틸 수 있는 시간은 사흘입니다." },
      { caption: "2023-0412", text: "실장 한서윤이 단말에 사건 파일을 띄웁니다. 표지 밑단에 대출번호 하나가 남아 있습니다." },
      { caption: "반대 1건", text: "3년 전 그 대출에 혼자 반대 의견을 쓴 사람이 당신입니다. 그 의견서는 지금 사내 시스템에서 검색되지 않습니다." },
      { caption: "3년 전", text: "2022년 10월, KD은행 기업금융전략팀. 이야기는 수습 마지막 과제에서 시작됩니다." },
    ],
  },
  en,
  ja,
};

/** The page's words in `lang`, Korean for a language the page does not have. */
export function coldOpeningCopy(lang) {
  return COLD_OPENING_COPY[lang] ?? COLD_OPENING_COPY.ko;
}
