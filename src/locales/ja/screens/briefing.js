/** src/copy/briefing.js in Japanese: the briefing page, its case file's cast, and the scene's derived copy. */
export default {
  sfxCalm: ["カチッ", "ドクン", "ジジッ", "トン", "スッ", "カチャ"],
  sfxBroken: ["ドン！", "バキッ！", "ガシャン！"],
  timer: {
    label: "読む時間を止める",
    held: "停止中 · 押すと再び流れる",
    running: "秒後に卓が開く · 押すと停止",
    heldSr: "{seconds}秒で止まっている。押すと再び流れる",
    runningSr: "{seconds}秒後に卓が開く",
  },
  yourCall: "あなたの判断",
  caseFile: "事件ファイル",
  carried: "持ち越し · この勝負に続くルール",
  breach: " · この勝負のルールが変わった",
  hint: "カードを選ぶと、そのカードを賭けた状態で卓が開く",
  cardsLabel: "すぐ賭けるカード",
  sealed: "封印",
  locked: "ロック",
  open: "卓を開く",
  openSeconds: "{seconds}秒で開始",
  openLabel: "卓を開く、{seconds}秒で開始。ここから時計が流れ、カードを賭けられる",
  cast: {
    trail: "この事件のこれまでのシーン",
    people: "登場人物",
    firstCase: "初登場の事件 · ",
  },
  scene: {
    stockProfile: {
      role: "事件関係者",
      stance: "状況説明",
      job: "いまの局面の核心となる情報を伝える。",
      appearance: "整理されていない資料の山を前に、事件関係者が座っている。",
      thought: "このシーンで見落とした前提がないか、もう一度確かめる。",
      gesture: "事件関係者は少し言葉を止め、テーブルの上の資料をもう一度見る。",
      voice: "状況を大げさにせず、必要な情報だけを伝える。",
      line: "いま決めたら、何が次のシーンに持ち越されますか？",
    },
    authority: {
      observer: "手がかり{clues}個、または{trust}{value}が必要です。",
      field: "{legitimacy}{value}、手がかり{clues}個を集めると監督権限が開きます。",
      oversight: "監督権限が開き、最終的な終了条件を提案できます。",
    },
    bonus: {
      reframe: "卓を変えるボーナス",
      challenge: "連続チャレンジボーナス",
      deliberate: "熟考ボーナス",
      run: "連続判断ボーナス",
      waiting: "ボーナス待機",
    },
    inherited: {
      clearSignal: {
        title: "信頼を次のシーンへ渡す",
        text: "前の事件で得た信頼を失わない選択が、次の圧力の扉を開きます。",
      },
      openWound: {
        title: "公正さのひびを塞ぐ",
        text: "公正さを回復する選択で、前の事件のひびを先に塞がなければなりません。",
      },
      unfinishedCost: {
        title: "残ったコストを減らす",
        text: "前の事件から持ち越したコストを減らすと、このシーンの回復ボーナスが付きます。",
      },
      other: {
        title: "前の判断のコストを確かめる",
        text: "前の判断が残した隠れたコストを見つけて初めて、次の事件の基準を立て直せます。",
      },
    },
    challenge: {
      lowerRisk: {
        title: "リスクの圧力を下げる",
        text: "予想リスクが下がる選択を見つけると、圧力管理ボーナスが付きます。",
      },
      useReframe: {
        title: "卓を変えてみる",
        text: "'卓を組み替える' カードを賭け、壁に触れる前に確定すると、この事件の隠れた経路が開きます。",
      },
      avoidRisk: {
        title: "速さに巻き込まれない",
        text: "リスクの上昇を引き受けずに、競争の圧力を通り抜ける選択を探します。",
      },
      findCost: {
        title: "隠れたコストを探す",
        text: "いちばん良さそうに見える選択の、裏側のコストを確かめてから選びます。",
      },
    },
  },
};
