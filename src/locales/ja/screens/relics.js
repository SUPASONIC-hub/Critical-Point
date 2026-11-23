/** src/copy/relics.js in Japanese: the Tool Draft and the tools. */
export default {
  draft: {
    full: "ツール枠がいっぱい",
    closed: "事件終了",
    swapTitle: "手放すツールをひとつ",
    title: "次の事件に持っていくツールをひとつ",
    swapLede: "{name}を持つには、手持ちのツールをひとつ手放す。手放したツールは、このテーブルからルールを変えない。",
    lede: "選んだツールはテーブルのルールをひとつ変える。ツールは{slots}個まで持て、{when}。選ぶまで時計は止まっている。",
    ledeFull: "枠がいっぱいなので、選ぶとひとつを手放す",
    ledeRoom: "いっぱいになったらひとつを手放して入れ替える",
    drop: "手放す",
    rare: "解放",
    codexLabel: "ツール図鑑、{total}個中{count}個を解放",
    lockedTitle: "ロック · {feat}",
    lockedSpoken: "ロック、{feat}",
    owned: "、装備中",
    codexCount: "図鑑 {count}/{total}",
    nextFeats: "{codex} · 次の解放: {feat} · 残り{more}個を見る",
    nextFeat: " · 次の解放: {feat}",
    allOpen: " · すべて解放",
    back: "ほかのツールを見る",
    skip: "選ばずに{name} · {short}",
    skipPaid: "選ばずに進む",
    reroll: "引き直し · {cost}",
    extra: "もう一つ · {cost}",
    spendNote: "押すとKD銀行口座からすぐ引かれ、取り消せない。",
    spendHint: "もう一つは枠が空いているときだけ。毎回買えば結末までに金庫が細る。",
    // G4 (relicsNext.js): under the next rules one more is once a season and the reroll is cheap.
    spendHintNext: "もう一つはシーズンに一度。引き直しは安い：弱い三つなら引き直そう。",
    secondTitle: "もう一つ選ぶ",
    secondLede: "買った一つを、残る二つから選ぶ。",
    off: {
      practice: "やり直しの事件では使えない",
      story: "ストーリーモードでは使えない",
      record: "このセーブのドラフトでは使えない",
      used: "この事件で使用済み",
      picked: "選択済み",
      few: "残りのツールが一つだけ",
      short: "残高不足",
      season: "今シーズンは購入済み",
    },
  },
  relics: {
    metronome: {
      name: "メトロノーム",
      text: "熱が上がった次のシーンまで、方向を変えても転換として認められる。",
      proc: "転換をつなぎとめた",
      // G4: the condition that pays under the next rules (relicsNext.js).
      next: "向きを変えた盤（転換）で確定すると賭け金 +{pct}%。",
    },
    coldBlood: {
      name: "冷血",
      text: "壁に触れたあとのAFTERSHOCKが、熱{start}ではなく{cold}から始まる。",
      proc: "余震を半分に冷ました",
      // G4: what it does under the next rules, in place of the line above.
      nextText: "BUSTの次の盤はAFTERSHOCKなしで熱0から始まり、壁が{wall}下がる。その盤で確定すると賭け金 +{pct}%。",
      nextSoftens: "冷血：AFTERSHOCK免除",
      softens: "冷血: 熱{cold}から開始",
    },
    heatSink: {
      name: "放熱板",
      text: "HEAT DEBTが熱の{share}分の1だけを残し、時間は{seconds}秒だけ持っていく。",
      proc: "熱の借りを半分に減らした",
      // G4: the condition that pays under the next rules (relicsNext.js).
      next: "熱{hot}以上で確定すると賭け金 +{pct}%。",
      softens: "放熱板: 熱{share}分の1、{seconds}秒",
    },
    auditContact: {
      name: "監査室のつて",
      text: "監査チームのパン・ジェウクが1マスは見逃してくれる。監査は{limit}マス埋まってはじめて摘発される。",
      proc: "パン・ジェウクが1マスを見逃した",
      // G4: the condition that pays under the next rules (relicsNext.js).
      next: "一度以上押して熱{low}未満で確定すると賭け金 +{pct}%、目立ちがあっても見逃される。",
    },
    carbonCopy: {
      name: "イム・ギョンスの写し",
      text: "イム・ギョンスが燃やさなかった写しがある。BLACKOUTが壁を{shift}ではなく{pull}だけ引き寄せる。",
      proc: "写しが壁を押しとどめた",
      // G4: the condition that pays under the next rules (relicsNext.js).
      next: "BLACKOUTの盤で確定すると賭け金 +{pct}%。",
      softens: "写し: 壁を{pull}だけ引き寄せる",
    },
    testimony: {
      name: "オ・ジヌの証言",
      text: "決定の制限時間は設定値だった。時間切れでBUSTしても、賭け金の{share}分の1は残る。",
      proc: "時間切れでも賭け金の{share}分の1を守った",
      // G4: the condition that pays under the next rules (relicsNext.js).
      next: "時間が半分以上残っているうちに確定すると賭け金 +{pct}%。",
    },
    frontPage: {
      name: "チャ・ジウォンの1面",
      text: "特ダネが続いても手は震えない。OVERCLOCKの勝負で押すときに増える熱が半分になる。",
      proc: "1面の締め切りを前にしても手は静かだった",
      // G4: the condition that pays under the next rules (relicsNext.js).
      next: "OVERCLOCKの盤で確定すると賭け金 +{pct}%。",
      softens: "1面: 押す幅の増え方が半分",
    },
    fieldNote: {
      name: "ト・ユナの現場メモ",
      text: "現場では二度あれば流れができる。同じタイプの{hold}枚目からロジックコンボが上がる。",
      proc: "現場メモでコンボを早く立てた",
      // G4: the condition that pays under the next rules (relicsNext.js).
      next: "同じ側の論理コンボ{side}以上で確定すると賭け金 +{pct}%。",
    },
    encore: {
      name: "アンコール",
      text: "壁に触れて賭け金を失っても、ロジックコンボは残る。",
      proc: "壁に触れてもコンボが生き残った",
      // G4: the condition that pays under the next rules (relicsNext.js).
      next: "論理コンボ{long}以上で確定すると賭け金 +{pct}%。",
      unlock: "ロジックコンボ{combo}を達成",
    },
    insurance: {
      name: "保険",
      text: "事件ごとに1回、壁に触れても賭け金の{share}分の1は残る。",
      proc: "賭け金の{share}分の1を守った",
      unlock: "賭け金{loss}以上を壁で失う",
    },
    stethoscope: {
      name: "聴診器",
      text: "SILENCEが来ても、心拍は壁を指し続ける。時間は変わらず{seconds}秒だ。",
      proc: "沈黙の中で心臓の音を聞いた",
      // G4: the condition that pays under the next rules (relicsNext.js).
      next: "SILENCEの盤で確定すると賭け金 +{pct}%。",
      softens: "聴診器: 心拍を維持",
      unlock: "SILENCEを一度経験する",
    },
    kineticGrip: {
      name: "握力",
      text: "STRIKE MASTERYが押すたびに上乗せしていた熱1を取り除き、STRIKE WAKEで目覚めた勝負のチップが{chips}倍厚くなる。",
      proc: "STRIKEの熟練が手になじんだ",
      // G4: the condition that pays under the next rules (relicsNext.js).
      next: "STRIKEを満タンまで溜めて確定すると賭け金 +{pct}%。",
      softens: "握力: 押したときの熱はそのまま",
      unlock: "STRIKE熟練{count}回",
    },
  },
  breather: {
    name: "ひと息つく",
    short: "+{seconds}秒",
    text: "選ばなければ、この事件の最初の勝負の時間が{seconds}秒延び、壁が{wall}遠ざかる。",
  },
};
