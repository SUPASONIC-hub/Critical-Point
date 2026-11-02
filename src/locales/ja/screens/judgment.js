/** src/copy/judgment.js in Japanese: gameLogic.js's words (the 判断DNA's modes and motives, the unrecorded aftermath, the trade-off sentence and a scene's fallback question). */
export default {
  modes: {
    GUARDIAN: {
      title: "被害が移るのを先に止める人",
      text: "結果の大きさより、誰がコストを背負うのかを確かめながら、判断を長く保ちます。",
    },
    "RE-FRAMER": {
      title: "卓そのものを組み替える人",
      text: "与えられた選択肢のバランスに従うより、利害関係者と条件を並べ直します。",
    },
    "PRESSURE PILOT": {
      title: "圧力の中で方向を調整する人",
      text: "リスクが大きくなっても決定を止めず、次のシーンへ渡すコストを選びます。",
    },
  },
  motives: {
    affection: { label: "愛情型", when: "救いたい人が見えたとき", path: "愛情 → 執念 → 最後まで考える → 救済" },
    revenge: { label: "復讐型", when: "やり返したい理不尽が見えたとき", path: "怒り → 執念 → 弱点の追跡 → 是正" },
    responsibility: { label: "責任型", when: "背負ったものが崩れそうなとき", path: "責任 → 執念 → 損益の計算 → 再生" },
    curiosity: { label: "探究型", when: "まだ知らないことが残っているとき", path: "好奇心 → 執念 → 構造の把握 → 発見" },
    mixed: { label: "複合型", when: "ひとつの感情だけでは思考が目覚めなかったとき", path: "いくつもの感情 → 執念 → 最後まで考える → 読み直し" },
  },
  unrecordedOutcome: { tag: "記録されなかった結末", title: "まだ閉じていない結果", text: "この選択の波紋は、次の記録に残っています。" },
  tradeoff: {
    still: "数字はほとんど動きませんでしたが、この選択は判断の基準を残しました。",
    noGain: "すぐに得たものは少なく",
    noLoss: "目に見える損失は小さい",
    both: "{gains}を得る代わりに、{losses}を引き受けました。",
    gainsOnly: "{gains}が開けましたが、その利得は次のシーンの圧力として残ります。",
    lossesOnly: "{losses}を引き受けました。選択の大義は残りましたが、余力は削られました。",
  },
  question: "いま何を先に守るかを決めなければなりません。",
  titledQuestion: "{title}:いま何を先に守るかを決めなければなりません。",
  defaultEcho: "その判断を貫くなら、隠れた被害者とコストを計算し直さなければなりません。同じ原則を、もっと不利な条件でも適用しますか？",
  sceneBeat: {
    stockProfile: {
      appearance: "散らかった資料の山の前に、事件の関係者が座っている。",
      thought: "この選択はまだ終わっていない。",
      gesture: "相手は少し言葉を選ぶ。",
      voice: "状況を確かめる口調で応じる。",
      line: "その判断を押し通し続けられますか？",
    },
    speaker: "相手",
    said: "あなたは用意された対応案の名前ではなく、結論だけを残してこう言う。{said}",
    look: "{name}が視線を上げる。{voice}",
    still: "状況板の数字は大きく動かないが、会議室の沈黙が少し長くなる。",
    gain: "{label}が開ける。だがその数字は、ただで生まれたものではない。",
    cost: "{label}が代価として残る。誰かがその分を自分の持ち場で背負うことになる。",
  },
};
