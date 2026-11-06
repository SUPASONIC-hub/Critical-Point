/**
 * The words of B-3(1) 냉정한 오프닝 (state/coldOpening.js), in every language
 * the page has, kept beside the page so they ship in its chunk and only when
 * the switch is on. Every fact is case 01's first scene and memo, cut down
 * (canon numbers unchanged: 72시간, 1,140명, 2023-0412, 반대 1건), and the
 * last panel is the 「3년 전」 the prologue opens under (prologue01.js: October
 * 2022, three months into probation).
 */
export const COLD_OPENING_COPY = {
  ko: {
    label: "COLD OPEN / 2025 / TRIGGERLAB",
    title: "냉정한 오프닝",
    next: "다음",
    skip: "건너뛰기",
    step: "{at}/{total}",
    panels: [
      { caption: "72시간", text: "새벽 배송 물류 플랫폼 플로우온. 직원 1,140명. 남은 돈으로 버틸 수 있는 시간은 사흘입니다." },
      { caption: "2023-0412", text: "실장 한서윤이 단말에 사건 파일을 띄웁니다. '랩 기록에는 훈련용 사례예요.' 표지 밑단에 대출번호 하나가 남아 있습니다." },
      { caption: "반대 1건", text: "3년 전 그 대출에 혼자 반대 의견을 쓴 사람이 당신입니다. 그 의견서는 지금 사내 시스템에서 검색되지 않습니다." },
      { caption: "3년 전", text: "2022년 10월, KD은행 기업금융전략팀. 수습 3개월차인 당신의 마지막 과제에서 이야기가 시작됩니다." },
    ],
  },
  en: {
    label: "COLD OPEN / 2025 / TRIGGERLAB",
    title: "Cold open",
    next: "Next",
    skip: "Skip",
    step: "{at}/{total}",
    panels: [
      { caption: "72 hours", text: "FlowOn, a dawn-delivery logistics platform. 1,140 employees. The cash it has left lasts three days." },
      { caption: "2023-0412", text: "Director Han Seoyun puts a case file up on the terminal. 'In the lab's records, it's a training case.' A loan number is left at the bottom of the cover." },
      { caption: "1 dissent", text: "3 years ago you were the one who wrote the lone dissent on that loan. That opinion no longer shows up in the internal system." },
      { caption: "3 years earlier", text: "October 2022, KD Bank's Corporate Finance Strategy Team. The story starts with your last probation task, three months in." },
    ],
  },
  ja: {
    label: "COLD OPEN / 2025 / TRIGGERLAB",
    title: "冷たいオープニング",
    next: "次へ",
    skip: "スキップ",
    step: "{at}/{total}",
    panels: [
      { caption: "72時間", text: "早朝配送の物流プラットフォーム、フロウオン。従業員1,140人。残った金では三日しかもたない。" },
      { caption: "2023-0412", text: "室長ハン・ソユンが端末に事件ファイルを映す。'ラボの記録上は訓練用の事例です。' 表紙の下端に融資番号がひとつ残っている。" },
      { caption: "反対1件", text: "3年前、その融資にただ一人反対意見を書いたのがあなただ。その意見書は現在、社内システムで検索できない。" },
      { caption: "3年前", text: "2022年10月、KD銀行 企業金融戦略チーム。試用3か月目のあなたの最後の課題から、物語は始まる。" },
    ],
  },
};

/** The page's words in `lang`, Korean for a language the page does not have. */
export function coldOpeningCopy(lang) {
  return COLD_OPENING_COPY[lang] ?? COLD_OPENING_COPY.ko;
}
