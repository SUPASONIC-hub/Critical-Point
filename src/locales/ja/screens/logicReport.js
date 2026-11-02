/** src/copy/logicReport.js in Japanese: the closing report's ロジック維持力 panel. */
export default {
  label: "ロジック維持力",
  caseName: "{label}「{title}」",
  lead: "熱がいちばん高かった事件は{caseName}です。",
  held: "その事件の{windows}勝負のうち{count}勝負を'{type}'で閉じました。",
  heldAll: "その事件の{windows}勝負をすべて'{type}'で閉じました。",
  switched: "その事件では熱が上がった後にタイプを{count}回変え、ロジックコンボは途切れませんでした。",
  broken: "その事件ではひとつのタイプにとどまらず、ロジックコンボが{count}回途切れました。",
  unbroken: "その事件ではひとつのタイプにとどまりませんでしたが、ロジックコンボは途切れませんでした。",
  tooFew: "ロジックコンボの記録がある事件がまだ少ないため、熱がいちばん高かった事件は挙げません。",
  hold: "ロジック維持力 {score}点",
  best: "最高ロジックコンボ {streak}",
  caption: "ロジック維持力は、コンボが途切れうる勝負のうち途切れなかった勝負の割合です。視点の転換スコアとは逆に動くことがあります。",
  rank: {
    pending: "順位はシーズン記録が{floor}件集まると表示されます。",
    band: "上位{percent}%以内",
  },
};
