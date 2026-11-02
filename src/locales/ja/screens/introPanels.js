/** src/copy/introPanels.js in Japanese: the start screen's panels, the season's first echo and the tab title's tail. */
export default {
  analystTitles: {
    prologue01: "見習い分析官",
    case01: "分析官",
    case18: "上級分析官",
    case36: "主席分析官",
  },
  playStyles: {
    instinct: "最初の反応で決めるという誓い",
    auditor: "根拠を確かめてから決めるという誓い",
    mediator: "対話で圧力を下げるという誓い",
  },
  newGamePlusOpen: "前のシーズンの結末を、この画面でもう一度見られます",
  newGamePlusLocked: "最終記録を完了するとNEW GAME+を解放",
  tutorial: {
    read: { label: "シーンを読む", text: "状況と話し手、問いを読みます。読む時間はスコアに入りません。" },
    weigh: { label: "カードを賭ける", text: "カードを一枚選んで賭けます。カードごとに得るものと払うものが違います。" },
    commit: { label: "押し切りと確定", text: "押すほど熱と倍率が上がります。見えない壁に当たる前に確定すれば賭け金が積み上がり、事件を閉じると金庫に入ります。" },
    replay: { label: "もう一度見る", text: "違う記録は、違う権限とエンディングを開きます。" },
  },
  goals: {
    protect: "事件ごとの{harm}を平均{gate}未満に抑えてシーズンを完了",
    evidence: "事件記録の{percent}%以上を開く",
    trust: "{trust}を事件ごとに平均{gate}以上に保つ",
  },
  veteranTable: "NEW GAME+では、プロローグ01からすべてのルールがオンになり、ツールも早く受け取れます。",
  pastCase: "以前の記録に、CASE {code}の最後の選択が残っています。今回は、その結果を変えられます。",
  integrity: {
    linked: "ひとつのプレイにまとめられた記録です。公開ランキングは、すべての事件記録が15分以上かけてサーバーに届いたシーズンだけを受け付け、スコア・ランク・時間が合わない記録はサーバー側で別に印を付けます。",
    missing: "プレイ識別子がないため、一時的なローカル記録として扱われます。",
  },
  openingEcho: "どれだけ賢いかは問いません。代わりに、いつ考えるのをやめられないかを見ます。",
  tabSuffix: " · 臨界点",
};
