/** src/copy/comfort.js in Japanese. */
export default {
  label: "快適設定",
  tableTime: {
    legend: "テーブル時間",
    text: "テーブルの制限時間がこの倍率だけゆっくり流れます。1倍以外の記録はランキングに表示されます。",
    scale: "{scale}倍",
  },
  toggles: {
    storyMode: {
      label: "ストーリーモード",
      text: "壁が遠くなり、壁に触れた勝負が次の勝負に持ち越されません。壁に触れてもシーンを飛ばしません。時計は2倍ゆっくりです。次の事件から適用され、公開ランキングには載りません。",
    },
    holdReadingClock: {
      label: "読書時計の自動送りをオフ",
      text: "シーンの説明が自動で進みません。読み終えたら自分でテーブルを開きます。",
    },
    foldReadScenes: {
      label: "読んだシーンをたたむ",
      text: "NEW GAME+のシーズンで、前シーズンに読んだシーンの本文をたたみます。問いはそのまま表示されます。",
    },
    calmEffects: {
      label: "点滅・揺れを抑える",
      text: "赤い縁、判定のフラッシュ、画面の揺れを弱くします。",
    },
    edgeNotices: {
      label: "画面端の通知を出す",
      text: "押し込むほど、画面上の端にメッセンジャーやメールが一瞬表示されます。",
    },
    letterKeys: {
      label: "1文字のショートカットキーを使う",
      text: "1-9、W、E、Q、P、R、N。オフにするとSpace、Enter、Escだけが残ります。",
    },
    stillIntro: {
      label: "最初の画面の動きを止める",
      text: "流れる文字、動く絵、点滅するタイトルを止めます。",
    },
  },
  storyScale: {
    legend: "物語の文字サイズ",
    text: "シーンの説明、判定後の物語、事件の結末と幕間の文字を大きくします。テーブルはそのままです。",
    labels: ["標準", "大きく", "さらに大きく"],
  },
};
