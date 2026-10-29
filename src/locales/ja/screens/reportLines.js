/** src/copy/reportLines.js in Japanese: the report's derived lines. */
export default {
  rankLines: {
    S: "思考のリズム、視点の転換、圧力からの回復が同時に高まりました。",
    A: "正解を選んだのではなく、圧力の中で判断のパターンがはっきり表れました。",
    B: "事件は通過しました。次のプレイでは、別の考え方で揺さぶってみる余地があります。",
  },
  rankLineFallback: "事件は通過しましたが、バーストの信号はまだ弱めです。即答より、根拠・コスト・回復の道筋をもっと残してみてください。",
  bridge: {
    longest: "{trigger}の圧力がいちばん長く残り、「{title}」で判断の時間が長くなりました。",
    plain: "{trigger}の圧力がいちばん長く残りました。",
  },
  feedback: {
    longest: "「{title}」で実際に手が止まった理由はありましたか？",
    longestFallback: "いちばん長くとどまったシーン",
    reframed: "卓を組み替えて開いた経路は、選択肢になかった道のように感じましたか？",
    notReframed: "構造の再設計を使わなかったなら、既存の選択肢で十分に答えに見えましたか？",
    nextCase: "次の事件「{title}」まで続けて見たい理由ができましたか？",
    finale: "最後の選択は、トリガーラボの実験の構造と自然につながりましたか？",
  },
  tabTitle: {
    collapse: "[SYSTEM COLLAPSE] シーズン崩壊",
    season: "[{ending}] シーズン判定",
    case: "[事件終了] {tag}",
  },
  rationaleClues: "手がかり {count}",
  standing: {
    clear: "崩壊線の下",
    near: "崩壊線に接近",
    over: "崩壊線を超過",
    harm: "シーズン平均 {harmLabel} {perCase} / {gate} · 弾けた勝負 {bustPercent}%",
    overreach: "シーズン平均 {harmLabel} {perCase} / {gate} · 弾けた勝負 {bustPercent}% / {bustGate}%",
    harmCase: "{caseLabel} 再挑戦 · {harmLabel} {harm}",
  },
  score: {
    points: "{score}点",
    penalty: "-{score}点",
    none: "なし",
    consistency: {
      label: "基準の維持",
      note: "熱が上がったシーンでも同じ方向を守ったかを見ます。バーストスコアでいちばん大きな割合です。",
    },
    rhythm: {
      label: "思考のリズム",
      note: "即答や放置ではなく、圧力を読んで結論まで押し切った時間帯です。スコアの比重はいちばん小さいです。",
    },
    cognition: {
      label: "視点の転換",
      note: "同じやり方だけを繰り返さず、推論・リスク・再構成・粘りのあいだを行き来した跡です。",
    },
    pressureAdapt: {
      label: "圧力への対応",
      note: "リスクをひたすら避けた点数ではなく、上がった圧力をもう一度回収した力です。",
    },
    reading: {
      label: "勝負の読み",
      note: "同じ勝負を壁が見えている人が打っていたら稼いだ金庫と比べた、この事件で稼いだ分です(「壁が見えていた人のN%」)。",
    },
    reflection: {
      label: "構造の再設計",
      note: "卓を組み替えて隠れた経路を開き、シーンチャレンジを当て、隠れた記録を見つけ出した度合いです。",
    },
    exploit: {
      label: "即答ペナルティ",
      note: "表示された情報だけに従って素早く押すプレイが繰り返されたときだけ減点されます。",
    },
  },
  badges: {
    burst: "思考バースト{score}点を記録しました。",
    boardBreaker: "選択肢の外で卓を組み替えました。",
    routeFollower: "与えられた選択肢の中でコストを比べました。",
    slowThinker: "ひとつ以上のシーンで、判断を長く抱えました。",
    fastCloser: "素早く結論を閉じるプレイを見せました。",
    riskCutter: "{count}回、リスク圧力を下げました。",
    heatTaker: "リスクを下げるより、別の目標を優先しました。",
    challengeClear: "{count}個のシーンチャレンジを達成しました。",
    openQuest: "シーンチャレンジは残り、選択ログだけが記録されました。",
    perfectRun: "{count}連続でシーン目標を当て、最高の報酬を開きました。",
    streak: "{count}連続でシーン目標を当て、追加の報酬を開きました。",
    chainStarter: "シーン目標を連続で当てると、追加の報酬が開きます。",
    flowSurge: "{count}回、ボーナスのリソース回復を生み出しました。",
    noSurge: "チャレンジとリスク制御が、まだボーナスにつながっていません。",
    crisisRunner: "高い圧力の状態で事件を通過しました。",
    pressureKeeper: "リスク圧力を制御できる範囲にとどめました。",
  },
  pace: {
    same: "前半の{count}回も後半の{count}回も、平均{last}秒で選びました。",
    faster: "後半の{count}回は平均{last}秒で選びました。前半の{count}回は{first}秒でした。",
    slower: "後半の{count}回は平均{last}秒かけて選びました。前半の{count}回は{first}秒でした。",
  },
};
