/** src/copy/weekRules.js in Japanese: the Rule of the Week's catalogue. */
export default {
  auditLine: "一度以上押してから熱{heat}未満で確定すると監査 +1。{limit}マスが埋まったまま事件が閉じると、金庫へ行く取り分の{share}分の1を失う。",
  cascadeLine: "ひとつのリソースを8以上燃やすカードを確定すると、2〜4勝負のうちにひとつの勝負の壁が6近づく。事件が閉じるときに残った連結は、次の事件へ持ち越される。",
  rules: {
    "near-wall": {
      title: "壁が近い",
      text: "今週は壁の帯が熱{shift}だけ手前に立つ。同じ熱で、より早く壁に触れる。",
      world: "今週、グループは監査を前倒しした。",
    },
    "heavy-fracture": {
      title: "ひびが深い",
      text: "今週はFRACTUREが、ひびの入ったリソースを{rate}倍で請求する。",
      world: "今週、会計チームはひびの入った帳簿をもう一度めくってみる。",
    },
    "short-clock": {
      title: "時間が短い",
      text: "今週は勝負ごとに時間が{seconds}秒短く、すべてのカードのチップが{chips}倍だ。",
      world: "今週、取締役会は報告の時間を削り、報告書の値を上げた。",
    },
    "crisis-week": {
      title: "危機の週",
      text: "今週は壁の帯が熱{crisisShift}だけ手前に立ち、すべてのカードのチップが{crisisChips}倍だ。",
      world: "今週、市場が揺れると、本社はまず数字を合わせろと言った。",
    },
    "idle-erosion": {
      title: "寝かせた金は目減りする",
      text: "今週は事件が閉じるたびに、金庫に残っていた額の{erosion}%が消える。道具選びで使った分は減らない。",
      world: "今週は物価が上がり、寝かせた金の値打ちが下がる。",
    },
    "market-shock": {
      title: "市場ショック",
      text: "今週は事件ごとに一度、{shockBoard}回目の勝負で市場が揺れる。その勝負は壁の帯が熱{shockWall}だけ手前に立ち、それまで積んだ賭け金が最大{shockSwing}%上下する。",
      world: "今週は市場が揺れ、帳簿の数字も一緒に揺れた。",
    },
    "audit-cascade": {
      title: "監査と連鎖",
      text: "今週は監査と連鎖が同時に立つ。{audit} {cascade} CASCADE勝負の確定は監査に数えない。",
    },
  },
  // G5 (gauntlet/actTwists.js): the twist of acts 3, 5 and 7 under the next rules, by id.
  actTwists: {
    merger: {
      title: "合併",
      text: "この事件はすべてのカードのチップが{mergerChips}倍だが、壁の帯が熱{mergerShift}ぶん手前に立つ。",
      world: "グループは「改革」と称して系列会社を合併する。賭けは大きく、壁は近くなる。",
    },
    scattered: {
      title: "散らばった席",
      text: "この事件は壁の帯が両側に熱{spread}ずつ広がり、すべてのカードのチップが{scatterChips}倍。",
      world: "トリガーラボの人々があちこちに散り、席ごとに壁の立つ場所が違う。",
    },
    hearing: {
      title: "公聴会",
      text: "この事件は盤ごとの時間が{hearingCut}%短く、すべてのカードのチップが{hearingChips}倍。",
      world: "記録の持ち主を争う公聴会。答える時間は短く、一言の値は大きい。",
    },
    // G5's acts 1, 2, 4, 6 and 8 (actTwists.js `ACT_DEVICE_TWIST_RULES`).
    passedDown: {
      title: "押しつけられた損失",
      text: "この事件は、最初のBUSTでも賭け金の{downShare}分の1が残る。そのかわり、その勝負の人的被害が{downHarm}上がる。",
      world: "銀行が前倒しした返済は、ケアの時間へ、配車表へと降りていく。",
    },
    lateBill: {
      title: "遅れてきた請求書",
      text: "この事件は熱{billHeat}以上で確定すると、その熱の4分の3を抱えて次の勝負が始まる。それより下で確定すると、すべてのカードのチップが{billChips}倍。",
      world: "ひとりで耐えた十日分は、勝った翌日に請求される。",
    },
    trainedWall: {
      title: "学習された壁",
      text: "この事件は、NOAHがあなたの確定した熱を学ぶ。確定した次の勝負の壁の帯は、その熱のほうへ動くが、いつもの帯の真ん中より下には下がらない。",
      world: "NOAHは、あなたが選んだものと迷った秒数を学んだ。",
    },
    onRecord: {
      title: "供述の固定",
      text: "この事件は、最初の勝負で確定した構えを事件の終わりまで変えられない。そのかわり、確定するたびにチャージが足りなくても、その構えが次の勝負に残る。",
      world: "一度した供述は調書に残り、次の質問はその行から始まる。",
    },
    signedByName: {
      title: "実名の署名",
      text: "この事件は、最初の勝負の前に署名のしかたを選ぶ。名前だけ書けば、すべてのカードのチップが{nameChips}倍、壁の帯が{nameWall}手前に立つ。条件をつければ、壁の帯が{termsWall}下がり、チップが{termsChips}倍。",
      world: "もう署名欄に空欄はない。名前の横に条件をつけられるだけだ。",
    },
  },
  caseRules: {
    case09: {
      text: "この事件は勝負ごとに時間が{seconds}秒短く、すべてのカードのチップが{chips}倍だ。",
      world: "清算議案が72時間以内に採決に上がる。報告は短く、値は高く。",
    },
    case11: {
      text: "この事件は壁の帯が熱{shift}だけ手前に立つ。同じ熱で、より早く壁に触れる。",
      world: "国政監査の日程が一日早まった。",
    },
    case14: {
      text: "この事件はFRACTUREが、ひびの入ったリソースを{rate}倍で請求する。",
      world: "不良債権を92ウォンで買い取った帳簿だから、ひびはもう一度のぞき込む。",
    },
    case16: {
      text: "この事件は壁の帯が熱{crisisShift}だけ手前に立ち、すべてのカードのチップが{crisisChips}倍だ。",
      world: "ロボットリースの公示で市場が揺れると、本社はまず数字を合わせろと言った。",
    },
  },
};
