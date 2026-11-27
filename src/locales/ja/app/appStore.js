/**
 * src/copy/appStore.js in Japanese: the store apps' ads and Remove Ads
 * purchase. App only -- not in screens/index.js, so the site's Japanese chunk
 * does not carry it; src/platform/adCopy.js reads it in the app build. A
 * draft with the glossary (앱출시-J: 事件, 勝負, 結末), not yet edited by a
 * person.
 */
export default {
  rewardArchive: "広告を見て保管庫の枠をもう1つ(約30秒)",
  rewardHint: "広告を見てヒントをもう1行",
  rewardFree: "広告なしですぐに受け取る",
  rewardNote: "スコアや順位には影響しません。",
  adUnavailable: "今は表示できる広告がありません。少し時間をおいて、もう一度押してください。",
  adClosedEarly: "最後まで視聴しなかったため、報酬は受け取れませんでした。",
  adOffline: "接続がないため、広告を読み込めません。",
  interstitialNotice: "次の事件の前に短い広告が流れます。",
  attTitle: "広告の選ばれ方について",
  attBody:
    "臨界点は広告で運営されています。次の画面で許可すると、他のアプリやウェブサイトでの行動にもとづいて、より関連性の高い広告が表示されます。許可しなくても、広告の数とゲームの内容は同じです。",
  attContinue: "続ける",
  privacyTitle: "広告とプライバシー",
  privacyReview: "広告のプライバシー設定をもう一度開く",
  privacyNoChoices: "この地域では、選択できる広告の同意項目はありません。",
  privacyAtt: "トラッキングの許可は、iPhoneの設定 › プライバシーとセキュリティ › トラッキングで変更できます。",
  removeAdsRow: "広告の削除(1回払い)",
  restoreRow: "購入を復元",
  buyTitle: "広告なしで最後まで",
  buyLines: [
    "事件のあいだの全画面広告と、画面下のバナーがなくなります。",
    "保管庫の枠・結末のヒントは、広告なしですぐに受け取れます。",
    "スコア、順位、勝負の結果はそのままです。購入でゲームが有利になることはありません。",
    "一度購入すると、同じストアアカウントの端末でずっと適用されます。",
  ],
  buyButton: "{price}で広告を削除",
  buyWithdrawal: "購入後すぐに適用され、申込みの撤回が制限される場合があります。返金はストアのポリシーに従います。",
  buyLinks: { restore: "購入を復元", privacy: "プライバシーポリシー", terms: "利用規約" },
  owned: "広告の削除が適用されています。",
  bought: "広告を削除しました。ありがとうございます。",
  restored: "以前の購入が見つかったため、広告の削除をもう一度適用しました。",
  nothingToRestore: "このストアアカウントでは、広告削除の購入が見つかりませんでした。",
  cancelled: "購入をキャンセルしました。料金は請求されていません。",
  pending: "支払いの確認を待っています。確認でき次第、自動的に適用されます。",
  failed: "購入を完了できませんでした。少し時間をおいて、もう一度お試しください。",
  purchaseOffline: "接続がないため、購入できません。",
};
