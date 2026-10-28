/** src/copy/mutations.js in Japanese: the next-board rules as the briefing, the table's rule row and the reveal print them. */
export default {
  rules: {
    blackout: {
      title: "カードが伏せられた",
      text: "臨界点を越えた代償。次の勝負はカードのチップと消耗が隠され、壁が{wall}近づく。",
    },
    aftershock: {
      title: "余震が残った",
      text: "熱が{start}から始まる。いま壁に触れた熱が、まだ冷めていない。",
    },
    silence: {
      title: "心臓が嘘をつく",
      text: "時間を流した代償。次の勝負は心拍が壁を教えてくれず、決定時間は{seconds}秒だ。",
    },
    heatDebt: {
      title: "欲は熱を残す",
      text: "高い倍率で確定した代償。今回の熱の{share}分の1を抱えて始まり、{seconds}秒を失う。",
    },
    overclock: {
      title: "チップが倍に跳ね上がる",
      text: "続けて×{multiplier}以上を手にした。チップは{chips}倍だが、一度押すたびに上がる熱も大きくなる。",
    },
    coldFeet: {
      title: "いちばん良いカードが封印された",
      text: "押さずに確定した代償。いちばん高いカードは熱{seal}を越えないと開かず、チップが減る。",
    },
    fracture: {
      title: "ひびの入ったリソース",
      text: "いまいちばん大きく燃やしたリソース。次の勝負でそのリソースを燃やすカードは{rate}倍で請求される。",
    },
    reboot: {
      title: "事件が閉じた",
      text: "賭け金は金庫へ移され、ルールが初期化された。もう失うことはない。",
    },
    strikeWake: {
      title: "次の勝負がより厚く目覚める",
      text: "STRIKEでチャージしたLOCK。次の勝負はチップが{chips}倍だが、一度押すたびに上がる熱も大きくなる。",
    },
    steadyLine: {
      title: "次の勝負が冷えたまま開く",
      text: "STEADYでチャージしたLOCK。次の勝負は熱が{cool}低く始まり、時間が{seconds}秒延び、壁が{wall}遠ざかる。",
    },
    exposedHand: {
      title: "次の勝負は手札を隠せない",
      text: "EXPOSEでチャージしたLOCK。次の勝負はカードが伏せられず、COLD FEETの封印も解ける。",
    },
    strikeMastery: {
      title: "シーズンが先に打つ術を覚えた",
      text: "STRIKE LOCKを重ねてチャージした結果。新しい勝負のたびにチップが厚くなり、押すときに上がる熱が1増える。",
    },
    steadyMastery: {
      title: "シーズンが耐える術を覚えた",
      text: "STEADY LOCKを重ねてチャージした結果。新しい勝負のたびに冷えたまま始まり、時間が少し延びる。",
    },
    exposeMastery: {
      title: "シーズンが勝負を読む術を覚えた",
      text: "EXPOSE LOCKを重ねてチャージした結果。封印がより早く開き、さらに積み上がれば隠された勝負も隠れられない。",
    },
  },
  lifted: {
    blackout: {
      title: "壁が迫ってきた",
      text: "臨界点を越えた代償。壁が{wall}近づく。カードは、EXPOSEの熟練が伏せられないように防いだ。",
    },
    coldFeet: {
      title: "チップが減った",
      text: "押さずに確定した代償。チップが減る。封印は、EXPOSEの熟練が解いた。",
    },
  },
};
