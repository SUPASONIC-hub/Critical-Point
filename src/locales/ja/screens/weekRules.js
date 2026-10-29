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
    audit: { title: "監査週間" },
    cascade: { title: "連鎖週間" },
    "audit-cascade": {
      title: "監査と連鎖",
      text: "今週は監査と連鎖が同時に立つ。{audit} {cascade} CASCADE勝負の確定は監査に数えない。",
    },
  },
};
