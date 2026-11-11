/**
 * B-3(1) 냉정한 오프닝 in Japanese (src/components/coldOpeningCopy.js has the
 * Korean and says where each fact comes from). Here, under src/locales/ja, so
 * the font subset is not cut from its kana and kanji (scripts/font-charset.mjs
 * reads no Japanese source); the page imports it, so it ships in the page's
 * chunk and only when the switch is on.
 */
export default {
  label: "COLD OPEN / 2025 / TRIGGERLAB",
  title: "冷たいオープニング",
  next: "次へ",
  skip: "スキップ",
  step: "{at}/{total}",
  panels: [
    { caption: "72時間", text: "早朝配送の物流プラットフォーム、フロウオン。従業員1,140人。残った金では三日しかもたない。" },
    { caption: "2023-0412", text: "室長ハン・ソユンが端末に事件ファイルを映す。表紙の下端に融資番号がひとつ残っている。" },
    { caption: "反対1件", text: "3年前、その融資にただ一人反対意見を書いたのがあなただ。その意見書は現在、社内システムで検索できない。" },
    { caption: "3年前", text: "2022年10月、KD銀行 企業金融戦略チーム。物語は試用期間最後の課題から始まる。" },
  ],
};
