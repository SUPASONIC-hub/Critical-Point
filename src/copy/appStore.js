/**
 * The store apps' ad and Remove Ads lines (src/platform/adCopy.js picks the
 * page's language), as the app-launch memos B (B-3, B-4, B-5) and C (C-2,
 * C-3, C-6 (4)) wrote them and the user approved on 2026-10-25 (all (1)).
 * The English and Japanese are src/locales/<lang>/app/appStore.js.
 *
 * Only the app build carries any of it: nothing on the web imports this
 * (src/platform/ads.js and AppStorePanel.jsx are behind `__CP_APP__`), and
 * the two dictionaries are not in `<lang>/screens/index.js`, so the site's
 * language chunks do not grow by a byte for a panel the site never shows.
 * The web sells nothing and says nothing about the app's purchase (memo C-3).
 * check:locale still counts these lines, from src/locales/<lang>/app/
 * (scripts/locale-words.mjs readLanguageCopy).
 *
 * `{price}` is the store's own price string (3,300원 / US$2.99, memo C-1).
 */
const appStoreCopy = {
  rewardArchive: "광고 보고 보관함 한 칸 더 (약 30초)",
  rewardHint: "광고 보고 힌트 한 줄 더",
  rewardFree: "광고 없이 바로 받기",
  rewardNote: "점수와 순위에는 영향이 없습니다.",
  adUnavailable: "지금은 볼 수 있는 광고가 없습니다. 잠시 뒤 다시 눌러 주세요.",
  adClosedEarly: "끝까지 보지 않아 보상을 받지 못했습니다.",
  adOffline: "연결이 없어 광고를 불러올 수 없습니다.",
  interstitialNotice: "다음 사건 전에 짧은 광고가 나옵니다.",
  attTitle: "광고를 고르는 방식에 대해",
  attBody:
    "임계점은 광고로 운영됩니다. 다음 화면에서 허용하면 다른 앱과 웹사이트의 활동을 바탕으로 더 관련 있는 광고가 나옵니다. 허용하지 않아도 광고 수와 게임 내용은 똑같습니다.",
  attContinue: "계속",
  privacyTitle: "광고와 개인정보",
  privacyReview: "광고 개인정보 설정 다시 열기",
  privacyNoChoices: "이 지역에서는 따로 고를 광고 동의 항목이 없습니다.",
  privacyAtt: "추적 허용은 iPhone 설정 › 개인정보 보호 및 보안 › 추적에서 바꿀 수 있습니다.",
  removeAdsRow: "광고 제거 (1회 결제)",
  restoreRow: "구매 복원",
  buyTitle: "광고 없이 끝까지",
  buyLines: [
    "사건 사이의 전면 광고와 화면 아래 배너가 사라집니다.",
    "보관함 칸·결말 힌트는 광고 없이 바로 받습니다.",
    "점수, 순위, 판의 결과는 그대로입니다. 결제는 게임을 유리하게 만들지 않습니다.",
    "한 번 결제하면 같은 스토어 계정의 기기에서 계속 적용됩니다.",
  ],
  buyButton: "{price}에 광고 제거",
  buyWithdrawal: "구매 즉시 적용되며 청약철회가 제한될 수 있습니다. 환불은 스토어 정책을 따릅니다.",
  buyLinks: { restore: "구매 복원", privacy: "개인정보처리방침", terms: "이용약관" },
  owned: "광고 제거가 적용되어 있습니다.",
  bought: "광고를 제거했습니다. 고맙습니다.",
  restored: "지난 구매를 찾아 광고 제거를 다시 적용했습니다.",
  nothingToRestore: "이 스토어 계정에서 광고 제거 구매를 찾지 못했습니다.",
  cancelled: "구매를 취소했습니다. 요금은 청구되지 않았습니다.",
  pending: "결제 확인을 기다리는 중입니다. 확인되면 자동으로 적용됩니다.",
  failed: "결제를 마치지 못했습니다. 잠시 뒤 다시 시도해 주세요.",
  purchaseOffline: "연결이 없어 결제할 수 없습니다.",
};
export default appStoreCopy;
