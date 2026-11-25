/** src/copy/audit.js in Japanese: what the cash button, the table's voice and the ledger say about the audit. */
export default {
  ifCashUp: "いま確定すると監査 +1、{after}/{limit}",
  ifCashDown: "いま確定すると監査 −{relief}、{after}/{limit}",
  ifCashSame: "いま確定しても監査は{after}/{limit}のまま",
  spoken: "監査リスク {count}/{limit}。{limit}マスが埋まると、事件が閉じるとき金庫へ行く取り分の{share}分の1を失う",
  ledger: "監査{count}/{limit}マスで閉じた。",
  caught: " 摘発。",
  smoothWarn: "同じ位置で監査",
  smoothUp: "いま確定すると同じ位置の確定 {after}/{limit}",
  smoothSame: "いま確定しても同じ位置の確定は{after}/{limit}のまま",
  smoothSpoken: "帳簿のなめらかさ {count}/{limit}。ひとつの事件で熱±{span}以内の同じ位置で{limit}回確定すると、事件が閉じるとき金庫へ行く取り分の{share}分の1を失う",
};
