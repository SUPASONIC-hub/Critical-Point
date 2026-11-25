/** src/copy/edge.js in Japanese: the week's panel, the reading clock's question and the comfort settings. */
export default {
  weekRule: "今週のルール · このシーズンが終わるまで",
  caseRule: "この事件だけ · この事件が閉じるまで",
  unfold: "前シーズンに読んだシーン · 開く",
  pastPick: {
    wildPicked: "前シーズンも組み替えた",
    wild: "この卓を組み替える",
    wildSr: " 前シーズンのあなたが選んだカード",
    shown: "前シーズン",
    clipped: "のあなた",
    heard: "が選んだカード",
  },
  ask: {
    kicker: "読む時間が終わった",
    question: "読み終えてから自分で開く方式に変えますか？",
    note: "変えるとシーンは自動で進まず、「卓を開く」を押すと勝負が始まります。快適設定で元に戻せます。",
    hold: "自分で開く方式に変える",
    keep: "時計に任せる",
  },
  sign: {
    kicker: "署名欄",
    question: "この事件の署名欄にどう書く？選ばなければ条件をつける。",
    name: "名前だけ書く",
    terms: "条件をつける",
    nameWall: "今回の署名欄は、名前だけ書けば壁の帯が{wall}手前に立つ。",
  },
  // G23 여는 판돈 (WeekRulePanel.jsx OpeningAsk).
  opening: { kicker: "開く賭け金", question: "この事件をどう開く?選ばなければ普通に開く。", normal: "普通に開く", big: "大きく開く", bigNote: "大きく開くと、この事件のすべてのカードのチップが{chips}倍。ただし壁が熱{wall}から立つことがある。" },
  comfort: {
    title: "快適設定",
    close: "閉じる",
    note: "このウィンドウが開いているあいだ、テーブルの時計は止まります。",
  },
};
