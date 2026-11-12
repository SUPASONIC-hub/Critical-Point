/**
 * Spoiler-free case pages, case05-case13: setting, premise, cast and question per case
 * in Korean, English and Japanese, written from the first two scenes of each case
 * (scripts/content-pages/cases.mjs renders them). Nothing past a case's second scene.
 */
export default {
  case05: {
    ko: {
      setting: "2025년 · 온새 운영 검토실 → 돌봄 배차 복구 통제실",
      premise: [
        "어제 하루 동안 312가구가 방문 돌봄을 받지 못했습니다. 혼자 사는 어르신과 몸이 불편한 사람들의 집에 돌봄 선생님이 끝내 가지 않은 것입니다. 당신은 돌봄 플랫폼 온새의 운영 검토실을 떠나, 배차(돌봄 인력을 어느 집에 보낼지 정하는 일)를 되살리는 복구 통제실로 들어갑니다. 벽면 지도에는 빨간 점이 312개 찍혀 있습니다.",
        "기자들은 책임자 이름부터 묻습니다. 그런데 이상합니다. 현장 직원은 안내서대로 일했고, 배차 시스템은 승인된 기준대로 돌아갔습니다. 감사팀 조사역 반재욱이 규정을 맨 위까지 거슬러 올라가 봤더니, 꼭대기에 있는 것은 사람이 아니라 예산 상한선이었습니다. 그 상한선은 온새가 은행에 돈을 갚기로 한 상환 조건표에서 그대로 내려온 숫자입니다. 그의 수첩에는 이름을 적을 줄 하나가 비어 있습니다.",
        "검증 시스템 에코가 세 부서의 결정을 한 장에 겹쳐 보여 줍니다. 예산팀은 상한을 지켰고, 운영팀은 우선순위 규칙을 따랐고, 시스템은 승인된 가중치(어떤 조건을 얼마나 무겁게 따질지 정한 값)를 그대로 썼습니다. 하나하나는 반듯한 조각인데, 겹쳐 놓으면 그 틈으로 312명이 빠져나갑니다. 가중치표의 승인 이력에는 마지막 검토자 이름이 하나 있고, 검토에 걸린 시간은 단 6분입니다.",
        "이번 사건에는 눈에 띄는 악당이 없습니다. 모두가 규칙을 지켰는데도 사람이 다쳤습니다. 누군가의 이름 하나를 적으면 기사는 끝나겠지만, 같은 실패가 다시 일어나지 않는다는 보장은 없습니다. 당신은 책임을 묻는 일과 고칠 수 있는 것을 찾는 일을 갈라내야 합니다. 이번 사건에서 당신에게 주어진 권한은 중단과 복구, 책임 배분의 순서를 조정하는 것입니다.",
      ],
      cast: [
        { name: "반재욱", note: "KD금융그룹 감사팀 조사역. 규정을 꼭대기까지 따라 올라가 보는 사람으로, 이름 칸이 빈 수첩을 들고 당신 앞에 섭니다." },
        { name: "에코", note: "트리거랩의 대출 판단 검증 시스템. 흩어진 결정들을 한 장으로 겹쳐, 아무도 보지 못한 틈을 보여 줍니다." },
        { name: "오진우", note: "당신과 경쟁해 온 분석관. 배차 가중치표의 마지막 검토자 칸에 그의 이름이 적혀 있습니다." },
      ],
      question: "모두가 규칙을 지켰는데 312명이 밀려났다면, 그 책임은 누구의 몫일까요? 한 사람의 이름을 적는 일과 같은 실패를 막는 일 중에서, 당신은 무엇을 먼저 하겠습니까?",
    },
    en: {
      setting: "2025 · Onsae operations review room → Care dispatch recovery control room",
      premise: [
        "Yesterday, 312 households missed their home care visit. Older people living alone, people who cannot easily get out of bed: no carer came to their door. You leave the operations review room of Onsae, a care platform, and step into the control room that is trying to restore dispatch, the system that decides which carer goes to which home. On the wall map there are 312 red dots.",
        "Reporters want a name. But something does not add up. The field staff followed the manual. The dispatch system ran on approved criteria. Ban Jaewook, an investigator from Internal Audit, has traced the rules all the way to the top, and what he found there was not a person but a budget cap. That cap came straight down from the repayment terms Onsae agreed with its bank. In his notebook, the line for a name is still blank.",
        "ECHO, the review system, lays the decisions of three departments onto a single sheet. The budget team kept to the cap. Operations followed the priority rules. The system applied the approved weights, the values that say how heavily each condition counts. Every piece is clean on its own, yet where they overlap, 312 people fall through the gap. The weighting table’s approval history shows one name in the final reviewer field, and a review time of just six minutes.",
        "There is no obvious villain this time. Everyone followed the rules, and people were still hurt. Writing down one name would end the news cycle, but it would not stop the same failure from happening again. Your job is to separate blame from the things that can actually be fixed. The authority you hold in this case is to set the order of stopping, restoring and assigning responsibility.",
      ],
      cast: [
        { name: "Ban Jaewook", note: "An investigator with KD Financial Group’s Internal Audit team. He follows rules to the very top, and arrives with a notebook whose name line is empty." },
        { name: "ECHO", note: "Trigger Lab’s loan-judgment review system. It stacks scattered decisions on one page and shows the gap no one else saw." },
        { name: "Oh Jinwoo", note: "The analyst you have been competing with. His name sits in the final reviewer field of the dispatch weighting table." },
      ],
      question: "If everyone followed the rules and 312 people were still left behind, whose responsibility is it? Between naming one person and stopping the same failure from happening again, which do you do first?",
    },
    ja: {
      setting: "2025年 · オンセ運営検討室 → ケア配車 復旧統制室",
      premise: [
        "昨日一日で、312世帯が訪問ケアを受けられませんでした。一人暮らしのお年寄りや体の不自由な人たちの家に、ケアの担当者が来なかったのです。あなたはケアプラットフォーム、オンセの運営検討室を出て、配車(ケア人員をどの家に送るかを決める仕組み)を立て直す復旧統制室に入ります。壁の地図には赤い点が312個打たれています。",
        "記者たちはまず責任者の名前を求めます。けれど、どこかおかしいのです。現場の職員はマニュアルどおりに働き、配車システムは承認された基準どおりに動いていました。監査チームの調査役パン・ジェウクが規定をいちばん上までたどると、そこにいたのは人ではなく予算の上限でした。その上限は、オンセが銀行と結んだ返済条件表からそのまま下りてきた数字です。彼の手帳には、名前を書く行が一つ空いたままです。",
        "検証システムのECHOが、三つの部署の決定を一枚に重ねて見せます。予算チームは上限を守り、運営チームは優先順位のルールに従い、システムは承認された重み(どの条件をどれだけ重く見るかを決めた値)をそのまま使いました。一つひとつはまっすぐな断片なのに、重ねるとそのすき間から312人が抜け落ちます。重み表の承認履歴には、最後の検討者の名前が一つ。検討にかかった時間は、わずか6分です。",
        "今回の事件には、わかりやすい悪人がいません。全員が規則を守ったのに、人が傷つきました。誰か一人の名前を書けばニュースは終わるでしょう。でも、同じ失敗が二度と起きない保証にはなりません。あなたは、責任を問うことと、直せるものを探すことを切り分けなければなりません。この事件であなたに与えられた権限は、停止と復旧、責任の割り振りの順番を調整することです。",
      ],
      cast: [
        { name: "パン・ジェウク", note: "KD金融グループ監査チームの調査役。規定をいちばん上までたどる人で、名前の行が空いた手帳を手にあなたの前に立ちます。" },
        { name: "ECHO", note: "トリガーラボの融資判断検証システム。ばらばらの決定を一枚に重ね、誰も見ていなかったすき間を示します。" },
        { name: "オ・ジヌ", note: "あなたと競ってきた分析官。配車の重み表の最終検討者欄に、彼の名前があります。" },
      ],
      question: "全員が規則を守ったのに312人が取り残されたなら、その責任は誰のものでしょうか。一人の名前を書くことと、同じ失敗を防ぐこと。あなたはどちらを先にしますか。",
    },
  },

  case06: {
    ko: {
      setting: "2025년 · 돌봄 배차 복구 통제실 → 트리거랩 4층 분석관실",
      premise: [
        "배차 사고의 소란이 지나간 뒤, 당신은 합정동 트리거랩 4층 분석관실로 돌아옵니다. 통로 끝 자리의 모니터가 사흘째 켜져 있습니다. 그 자리의 주인, 경쟁 분석관 오진우는 사흘째 출근하지 않았고 연락도 닿지 않습니다. 화면에는 끝내 제출하지 않은 배차 사고 검토 보고서가 열린 채입니다. 지난 사건에서 배차 가중치표의 마지막 검토자로 이름이 올랐던 바로 그 사람입니다.",
        "그룹은 그를 배차 실패의 공식 책임자로 세우려 합니다. 인사위원회(직원의 징계나 자리 이동을 정하는 회의)는 이틀 뒤입니다. 실장 한서윤은 이 지시가 그룹전략실에서 내려왔고, 뉴욕 대주주의 분기 리뷰 전에 닫으라는 주문이라고 전합니다. 오진우는 KD은행에서 온 파견 직원(다른 회사 소속으로 와서 일하는 사람)이라 그룹 인사 기록에 남지 않습니다. 정리하기 가장 쉬운 사람이라는 뜻입니다.",
        "그의 책상은 사흘 전 그대로입니다. 펜은 모니터와 나란히 각도가 맞춰져 있고, 메모지는 색깔별로 줄지어 있습니다. 창가 화분의 흙이 촉촉한 건 동료 도윤하가 두 달째 몰래 물을 주어 왔기 때문입니다. 단말에는 제출 직전에 지운 보고서 초안이 11개, 최근 3주의 퇴근 기록은 모두 자정 이후입니다. 서랍 안쪽에는 아버지 이름이 적힌 오래된 지점 표창장 사본이 놓여 있습니다.",
        "지금까지 당신은 바깥의 회사와 기관을 조사해 왔습니다. 이번 대상은 여덟 걸음 떨어진 옆자리 사람입니다. 게다가 그를 몰아붙인 압박 조건은 당신의 실험과 같은 번호를 쓰고 있었습니다. 바깥에 대던 잣대를 동료에게도 똑같이 댈 수 있는지, 당신 자신이 시험받는 사건입니다. 이번에 당신이 쥔 권한은 내부 인사 자료를 어디까지 공개할지 제안하는 것뿐입니다.",
      ],
      cast: [
        { name: "오진우", note: "KD은행 본점에서 파견 와 3년째 일하는 경쟁 분석관. 사흘째 자리를 비웠고, 사직서는 아직 내지 않았습니다." },
        { name: "한서윤", note: "트리거랩 실장. 오늘은 위에서 내려온 지시를 전하는 사람처럼, 보고하듯 말을 맺습니다." },
        { name: "도윤하", note: "트리거랩 현장 담당. 아무도 모르게 오진우의 화분에 물을 주어 온 동료입니다." },
      ],
      question: "무너진 동료 앞에서 먼저 지켜야 할 것은 그 사람일까요, 아니면 기록일까요? 당신은 바깥에 들이대던 기준을 옆자리 사람에게도 똑같이 세울 수 있습니까?",
    },
    en: {
      setting: "2025 · Care dispatch recovery control room → Trigger Lab, 4th-floor analyst room",
      premise: [
        "Once the noise of the dispatch failure dies down, you return to the analyst room on the 4th floor of Trigger Lab in Hapjeong-dong. The monitor at the end of the aisle has been on for three days. Its owner, rival analyst Oh Jinwoo, has not come in for three days and cannot be reached. On his screen sits a review of the dispatch failure that he never submitted. He is the man whose name appeared as final reviewer of the dispatch weighting table.",
        "The group wants to name him the official owner of that failure. The HR committee, the meeting that decides discipline and transfers, sits in two days. Lab Director Han Seoyun tells you the order came from the Group Strategy Office, with instructions to close it before the New York shareholder’s quarterly review. Oh Jinwoo is seconded from KD Bank, so he never enters the group’s own HR records. In other words, he is the easiest person to let go.",
        "His desk is exactly as he left it. The pen lies square with the monitor; the sticky notes are lined up by color. The soil in the pot on the windowsill is damp, because your colleague Do Yoonha has been quietly watering it for two months. The terminal holds 11 report drafts deleted just before submission, and every exit record from the past three weeks is after midnight. At the back of a drawer lies an old copy of a branch commendation in his father’s name.",
        "Until now you have investigated outside companies and agencies. This time the subject sits eight steps from your desk. And the pressure settings that drove him used the same number as your own experiment. This case tests whether you can hold a colleague to the standard you apply to everyone else. The only authority you hold is to propose how much of the internal HR file is made public.",
      ],
      cast: [
        { name: "Oh Jinwoo", note: "A rival analyst in his third year on secondment from KD Bank head office. He has been missing for three days but has not resigned." },
        { name: "Han Seoyun", note: "Director of Trigger Lab. Today she ends her sentences like someone passing on orders from above." },
        { name: "Do Yoonha", note: "Trigger Lab’s field officer, the colleague who has been watering Oh Jinwoo’s plant without anyone knowing." },
      ],
      question: "When a colleague falls apart, what do you protect first: the person, or the record? Can you hold the person next to you to the same standard you hold the outside world?",
    },
    ja: {
      setting: "2025年 · 復旧統制室 → トリガーラボ4階 分析官室",
      premise: [
        "配車事故の騒ぎが過ぎたあと、あなたはハプチョン洞にあるトリガーラボ4階の分析官室に戻ります。通路の突き当たりの席のモニターが、三日間ついたままです。席の主、競争相手の分析官オ・ジヌは三日間出勤しておらず、連絡もつきません。画面には、結局提出されなかった配車事故の検討報告書が開いています。配車の重み表の最終検討者として名前が挙がっていた、まさにその人です。",
        "グループは彼を配車失敗の公式な責任者に立てようとしています。人事委員会(職員の懲戒や異動を決める会議)は二日後。室長のハン・ソユンは、この指示がグループ戦略室から下りてきたもので、ニューヨークの大株主の四半期レビューの前に閉じろという注文だと伝えます。オ・ジヌはKD銀行からの派遣社員(別の会社に籍を置いたまま来て働く人)なので、グループの人事記録に残りません。いちばん整理しやすい人、という意味です。",
        "彼の机は三日前のままです。ペンはモニターと平行に角度がそろえられ、メモ用紙は色ごとに並んでいます。窓辺の鉢植えの土が湿っているのは、同僚のト・ユナが二か月こっそり水をやってきたからです。端末には提出直前に消した報告書の下書きが11個、直近3週間の退勤記録はすべて午前0時以降。引き出しの奥には、父親の名前が入った古い支店表彰状のコピーがあります。",
        "これまであなたが調べてきたのは、外の会社や機関でした。今回の相手は、八歩先の隣の席の人です。しかも彼を追い詰めた圧力の条件は、あなたの実験と同じ番号を使っていました。外に当ててきた物差しを同僚にも同じように当てられるのか、あなた自身が試される事件です。今回あなたが持つ権限は、内部の人事資料をどこまで公開するかを提案することだけです。",
      ],
      cast: [
        { name: "オ・ジヌ", note: "KD銀行本店から派遣されて3年目の競争相手の分析官。三日間席を空けていますが、辞表はまだ出していません。" },
        { name: "ハン・ソユン", note: "トリガーラボの室長。今日は上からの指示を伝える人のように、報告口調で言葉を結びます。" },
        { name: "ト・ユナ", note: "トリガーラボの現場担当。誰にも知られず、オ・ジヌの鉢植えに水をやってきた同僚です。" },
      ],
      question: "崩れた同僚を前にして、先に守るべきなのはその人でしょうか、それとも記録でしょうか。外に向けてきた基準を、あなたは隣の席の人にも同じように立てられますか。",
    },
  },

  case07: {
    ko: {
      setting: "2025년 · 트리거랩 4층 → 감사팀 자료실 → 강서지점 → 회기동 헌책방",
      premise: [
        "아침에 발령서 한 장이 도착합니다. 강원 영동지점 기업대출 담당, 48시간 뒤부터 적용. 서울에서 240km 떨어진 곳입니다. 징계가 아니라 인사라서 사유도 적혀 있지 않고, 이의를 제기할 절차도 없습니다. 발령이 적용되는 순간, 당신이 볼 수 있는 사내 기록은 그 지점 범위로 줄어듭니다. 파일은 여기 남고, 당신은 240km 밖에 있게 됩니다. 서류 한 장이 사람을 어디로 옮기는지, 당신은 3년 전에도 겪어 보았습니다.",
        "한서윤이 마지막 장을 넘깁니다. 최종 승인란이 비어 있습니다. 3년 전 그 서류와 같은 모양이라고 그는 말합니다. 이름 대신 자리로 서명하는 사람이 있다는 뜻입니다. 이상한 점이 하나 더 있습니다. 발령서 작성일이 오진우 조사가 시작된 날보다 12일이나 앞서 있습니다.",
        "감사팀 자료실 캐비닛에서 조사역 반재욱이 표지가 닳은 검은 수첩을 꺼냅니다. 그가 조사해서 자리를 잃은 47명의 이름과 날짜가 한 줄에 하나씩, 모두 볼펜으로 적혀 있습니다. 뒤쪽 한 줄만 연필입니다. 당신의 이름과 3주 전 날짜. 그날 그에게 내려온 건 사유 없는 이름 한 줄뿐이었다고 합니다. 연필로 쓴 건 아직 끝난 일이 아니기 때문이라고.",
        "남은 시간은 48시간입니다. 그 안에 출력본과 수첩처럼 시스템 밖에만 남은 것들을 모아야 합니다. 하지만 이 수첩을 내면 반재욱도 함께 조사 대상이 됩니다. 조사역이 사적인 기록을 갖고 있는 것 자체가 규정 위반이니까요. 도움에는 언제나 값이 붙고, 그 값은 도움을 받는 사람이 아니라 손을 내민 사람이 먼저 치릅니다. 이번에 당신은 묻는 쪽이 아니라 부탁하는 쪽입니다. 당신에게 허락된 권한은 누구의 이름을 문서에 올릴지 제안하는 것입니다.",
      ],
      cast: [
        { name: "한서윤", note: "트리거랩 실장. 빈 승인란을 보고 3년 전 서류를 떠올리는 사람입니다." },
        { name: "반재욱", note: "감사팀 조사역. 자신이 조사해 자리를 잃은 사람을 모두 수첩에 적어 두고, 지우지 않습니다." },
        { name: "오진우", note: "경쟁 분석관. 그에 대한 조사가 시작된 날짜가 이번 발령의 수상한 기준점이 됩니다." },
      ],
      question: "열람 권한이 닫히기 전 48시간 동안, 당신은 무엇을 손에 쥐고 떠나겠습니까? 그리고 그것을 가져가는 대가를 누구의 이름 위에 올리겠습니까?",
    },
    en: {
      setting: "2025 · Trigger Lab, 4th floor → Internal Audit records room → Gangseo Branch → Secondhand bookshop in Hoegi-dong",
      premise: [
        "A transfer order arrives in the morning. Corporate lending, Gangwon Yeongdong Branch, effective in 48 hours. That is 240km from Seoul. Because it is a personnel move and not discipline, there is no stated reason and no way to appeal. The moment it takes effect, the internal records you can open shrink to that one branch. The files stay here, and you will be 240km away. Three years ago you learned how far a single sheet of paper can move a person.",
        "Han Seoyun turns to the last page. The final approval field is empty. Same shape as that document three years ago, she says: someone here signs with a seat instead of a name. There is one more oddity. The order is dated twelve days before the investigation into Oh Jinwoo even began.",
        "From a cabinet in the Internal Audit records room, investigator Ban Jaewook pulls out a black notebook with a worn cover. In it are the names and dates of 47 people who lost their jobs after his investigations, one per line, all in ballpoint. Only one line near the back is in pencil: your name, and a date three weeks ago. What reached him that day, he says, was a single line with a name and no reason. He wrote it in pencil because it isn’t over yet.",
        "You have 48 hours to gather what exists only outside the system, printouts and notebooks like this one. But if the notebook is submitted, Ban Jaewook comes under investigation too, since an investigator keeping private records breaks the rules. Help always carries a price, and the person who reaches out pays it before the person who receives it. This time you are not the one asking questions. You are the one asking for favors. The authority you hold is to propose whose names go into the record.",
      ],
      cast: [
        { name: "Han Seoyun", note: "Director of Trigger Lab. One look at the blank approval field reminds her of a document from three years ago." },
        { name: "Ban Jaewook", note: "An investigator with Internal Audit. He writes down everyone his investigations have cost a job, and never erases them." },
        { name: "Oh Jinwoo", note: "Your rival analyst. The day the investigation into him began becomes the strange reference point for your transfer." },
      ],
      question: "In the 48 hours before your access closes, what will you carry out with you? And whose name will you put down as the price of taking it?",
    },
    ja: {
      setting: "2025年 · トリガーラボ4階 → 監査チーム資料室 → カンソ支店 → フェギ洞の古本屋",
      premise: [
        "朝、一枚の辞令が届きます。カンウォン・ヨンドン支店の企業融資担当、48時間後から適用。ソウルから240km離れた場所です。懲戒ではなく人事なので、事由も書かれておらず、異議を申し立てる手続きもありません。辞令が適用された瞬間、あなたが見られる社内記録はその支店の範囲に縮みます。ファイルはここに残り、あなたは240km先にいることになります。一枚の書類が人をどこへ運ぶのか、あなたは3年前にも身をもって知りました。",
        "ハン・ソユンが最後のページをめくります。最終承認欄が空いています。3年前のあの書類と同じ形だと彼女は言います。名前ではなく席で署名する人がいる、という意味です。おかしな点はもう一つあります。辞令の作成日が、オ・ジヌの調査が始まった日より12日も早いのです。",
        "監査チーム資料室のキャビネットから、調査役のパン・ジェウクが表紙のすり切れた黒い手帳を取り出します。彼の調査で職を失った47人の名前と日付が、一行に一人ずつ、すべてボールペンで書かれています。後ろの一行だけが鉛筆です。あなたの名前と、3週間前の日付。あの日彼のもとに来たのは、事由のない名前一行だけだったといいます。鉛筆なのは、まだ終わった件ではないからだと。",
        "残された時間は48時間。そのあいだに、印刷物や手帳のように、システムの外にしか残っていないものを集めなければなりません。けれどこの手帳を出せば、パン・ジェウクも調査の対象になります。調査役が私的な記録を持つこと自体が規定違反だからです。助けには必ず値段がつき、その値段は助けを受ける人より先に、手を差し伸べた人が払います。今回、あなたは問いただす側ではなく、頼む側です。あなたに許された権限は、誰の名前を文書に載せるかを提案することです。",
      ],
      cast: [
        { name: "ハン・ソユン", note: "トリガーラボの室長。空いた承認欄を見て、3年前の書類を思い出す人です。" },
        { name: "パン・ジェウク", note: "監査チームの調査役。自分の調査で職を失った人を全員手帳に書き、決して消しません。" },
        { name: "オ・ジヌ", note: "競争相手の分析官。彼への調査が始まった日が、今回の辞令の奇妙な基準点になります。" },
      ],
      question: "閲覧権限が閉じるまでの48時間で、あなたは何を手にして去りますか。そして、それを持ち出す代償を誰の名前の上に置きますか。",
    },
  },

  case08: {
    ko: {
      setting: "2025년 · 트리거랩 4층 → 강원 영동지점 → 청담동 갤러리 온 → 경포 해온 펜션",
      premise: [
        "강원 영동지점에 부임한 지 9일째입니다. 휴면 법인 계좌(오래 거래가 끊긴 회사 계좌)를 정리하던 당신의 손이 한 줄에서 멈춥니다. 경포의 한 펜션 주소로 등록된 컨설팅 회사, 해온파트너스. 3년 전부터 분기마다 자문료가 들어오는데, 들어온 바로 그날 전액이 청담동의 갤러리 온으로 빠져나갑니다. 돈을 넣는 쪽은 브릿지은행 계열 자문사 노바웍스입니다.",
        "오늘 아침에는 이 회사의 청산(회사를 정리해 없애는 절차) 신청서가 접수됐습니다. 등기까지 72시간, 그 뒤에는 계좌를 조회할 수도 없습니다. 지점장 나준혁이 믹스커피를 내려놓으며 말합니다. 전임자가 이 계좌를 세 번이나 위로 올렸는데, 세 번 모두 반려(받아 주지 않고 돌려보냄)됐다고.",
        "사직서를 내고 혼자 추적을 이어 온 오진우가 나머지 조각을 들고 옵니다. 갤러리 대표는 그룹전략실 윤상혁 상무의 배우자 명의이고, 펜션의 실소유주(서류상 이름과 상관없이 실제로 가진 사람)는 그의 처남입니다. 오진우는 아버지가 지점에서 밀려나던 날 들었다는 말을 꺼냅니다. 사람은 욕망을 갖고, 욕망은 돈을 쓰고, 돈은 흔적을 남긴다. 다만 그는 이제 개인 자격으로 움직이고 있어서, 그가 가져온 자료가 어디서 왔는지부터 따져야 합니다.",
        "분노는 추적을 빠르게 합니다. 하지만 출처가 불분명한 자료가 한 장이라도 섞이면 증거는 힘을 잃습니다. 당신을 240km 밖으로 보낸 조직이, 하필 이 흔적이 지나가는 창구에 당신을 앉혔습니다. 72시간 안에 이 흔적을 복수의 칼로 쓸지, 분노보다 오래 버티는 증거로 남길지 정해야 합니다. 당신이 쥔 권한은 이 흔적표를 어디에 쓸지 제안하는 것입니다.",
      ],
      cast: [
        { name: "나준혁", note: "30년을 지점에서 보낸 강원 영동지점장. 세 번 반려된 계좌 이야기를 믹스커피와 함께 건넵니다." },
        { name: "오진우", note: "트리거랩을 떠난 전 분석관. 사직서를 낸 뒤 개인 자격으로 돈의 흐름을 쫓고 있습니다." },
        { name: "윤상혁", note: "본사 33층 그룹전략실 상무, 전 기업금융전략팀장. 계좌가 닿는 곳마다 그의 가족 명의가 보입니다." },
      ],
      question: "당신을 밀어낸 사람에게 닿는 흔적을 손에 쥐었을 때, 그것을 복수가 아니라 증거로 남길 수 있습니까? 72시간 안에 무엇을 지키고 무엇을 버리겠습니까?",
    },
    en: {
      setting: "2025 · Trigger Lab, 4th floor → Yeongdong Branch, Gangwon → Gallery On, Cheongdam-dong → Haeon Guesthouse, Gyeongpo",
      premise: [
        "Day 9 at the Gangwon Yeongdong Branch. You are clearing out dormant corporate accounts, ones that have not seen business in years, when a single line stops you. Haeon Partners, a consulting firm registered to a guesthouse address in Gyeongpo. For three years it has received an advisory fee every quarter, and on the very same day the full amount leaves for Gallery On in Cheongdam-dong. The money comes in from Novaworks, an advisory firm in the Bridge Bank group.",
        "This morning the firm filed for liquidation. Registration takes 72 hours, and after that the account can no longer be looked up. Branch Manager Na Junhyuk sets down a cup of instant coffee and tells you that your predecessor sent this account up the chain three times. All three times it came back rejected.",
        "Oh Jinwoo, who resigned and has been following the money on his own, brings the missing pieces. Gallery On is registered to the wife of Managing Director Yoon Sanghyuk of the Group Strategy Office, and the real owner of the guesthouse is his brother-in-law. Oh Jinwoo repeats something his father told him the day he was pushed out of his branch: people have desires, desire spends money, and money leaves a trail. But he now acts as a private citizen, so you first have to ask where his material came from.",
        "Anger makes a hunt faster. But one sheet of material with an unclear source is enough to weaken the evidence. The organization that sent you 240km away happened to seat you at the very window this trail runs through. Within 72 hours you must decide whether this trail becomes a blade for revenge, or evidence that outlasts the anger. Your authority here is to propose where this trail map gets used.",
      ],
      cast: [
        { name: "Na Junhyuk", note: "Manager of the Gangwon Yeongdong Branch after 30 years in branches. He hands you the story of the thrice-rejected account along with instant coffee." },
        { name: "Oh Jinwoo", note: "A former Trigger Lab analyst. Since resigning, he has been tracing the money as a private citizen." },
        { name: "Yoon Sanghyuk", note: "Managing Director in the Group Strategy Office on the 33rd floor, former head of the Corporate Finance Strategy Team. Everywhere the account leads, his family’s names appear." },
      ],
      question: "With a trail in your hands that leads to the man who pushed you out, can you keep it as evidence rather than revenge? In 72 hours, what will you protect, and what will you let go?",
    },
    ja: {
      setting: "2025年 · トリガーラボ4階 → カンウォン・ヨンドン支店 → チョンダム洞ギャラリー・オン → キョンポのヘオン・ペンション",
      premise: [
        "カンウォン・ヨンドン支店に赴任して9日目。休眠法人口座(長く取引が途絶えた会社の口座)を整理していたあなたの手が、ある一行で止まります。キョンポのペンションの住所で登録されたコンサルティング会社、ヘオン・パートナーズ。3年前から四半期ごとに顧問料が入り、入ったその日に全額がチョンダム洞のギャラリー・オンへ出ていきます。入金元はブリッジ銀行系列の顧問会社、ノヴァワークスです。",
        "今朝、この会社の清算(会社をたたんでなくす手続き)申請書が受理されました。登記まで72時間、そのあとは口座を照会することもできません。支店長のナ・ジュニョクがスティックコーヒーを置きながら言います。前任者がこの口座を三回も上に上げたのに、三回とも差し戻されたのだと。",
        "辞表を出し、一人で追跡を続けてきたオ・ジヌが、残りのかけらを持ってやってきます。ギャラリーの代表はグループ戦略室のユン・サンヒョク常務の配偶者名義で、ペンションの実質的な所有者は彼の妻の弟です。オ・ジヌは、父親が支店から追い出された日に聞いたという言葉を口にします。人は欲望を持ち、欲望は金を使い、金は痕跡を残す。ただ、彼はいま個人の立場で動いているので、持ってきた資料がどこから来たのかをまず確かめなければなりません。",
        "怒りは追跡を速くします。けれど出どころの怪しい資料が一枚でも混じれば、証拠は力を失います。あなたを240km先へ送った組織が、よりによってこの痕跡が通る窓口にあなたを座らせました。72時間のうちに、この痕跡を復讐の刃にするのか、怒りより長く持ちこたえる証拠として残すのかを決めなければなりません。あなたが持つ権限は、この痕跡の表をどこに使うかを提案することです。",
      ],
      cast: [
        { name: "ナ・ジュニョク", note: "支店勤務30年のカンウォン・ヨンドン支店長。三度差し戻された口座の話を、スティックコーヒーと一緒に差し出します。" },
        { name: "オ・ジヌ", note: "トリガーラボを去った元分析官。辞表を出したあと、個人の立場でお金の流れを追っています。" },
        { name: "ユン・サンヒョク", note: "本社33階グループ戦略室の常務で、元企業金融戦略チーム長。口座がたどり着く先々に、彼の家族の名義が見えます。" },
      ],
      question: "あなたを押し出した人へと続く痕跡を手にしたとき、それを復讐ではなく証拠として残せますか。72時間で、何を守り、何を手放しますか。",
    },
  },

  case09: {
    ko: {
      setting: "2025년 · 영동지점 → 여의도 → 플로우온 채권단 회의실 → 풀필먼트센터",
      premise: [
        "3년 전 KD은행이 310억을 빌려준 물류 플랫폼 플로우온. 당신이 혼자 반대 의견을 냈던 바로 그 대출의 회사가, 다시 채권단(돈을 빌려준 금융회사들의 모임) 결의를 앞두고 있습니다. 이번 안건은 회생이 아니라 청산(회사를 정리해 없애는 절차)입니다. 결의까지 60시간. 직원 1,140명과 협력사 280곳이 그 결과를 기다립니다. 3년 전 당신은 그 회사의 숫자가 어떻게 만들어졌는지 직접 세어 본 사람입니다.",
        "청산을 밀어붙이는 쪽은 선순위 담보(회사가 무너지면 가장 먼저 돈을 가져갈 권리)를 쥔 브릿지은행입니다. 그 은행의 대표 심사역은 플로우온 창업주의 장남 권도현입니다. 채권단 명단을 내려놓으며 도윤하가 말합니다. 가업을 거절하고 은행에 들어간 사람이, 이번에는 은행 편에서 아버지의 회사를 닫으러 왔다고.",
        "권도현은 빈 종이에 세로줄을 긋고 칸을 나눕니다. 브릿지은행, KD은행, 직원, 협력사, 삼촌들, 그리고 당신. 자기를 돕겠다면 당신 칸부터 채우라고 합니다. 잃는 것과 얻는 것이 비어 있으면, 그 제안은 동정으로 읽고 거절하겠다고. 그의 칸은 이미 채워져 있습니다. 잃는 것은 가족, 얻는 것은 없음. 당신의 칸은 아직 비어 있습니다.",
        "숫자도 냉정합니다. 브릿지은행이 빌려준 돈을 돌려받는 비율은 회생이면 61%, 청산이면 78%입니다. 권도현이 회생 편에 서면 그는 자기 은행에서 자리를 잃을 수도 있습니다. 회사를 살리는 계산서와, 회사를 무너뜨린 사람들을 벌하는 계산서. 이번에는 그 둘을 한 테이블에 올려야 합니다. 이번에 당신이 쥔 권한은 회생안과 고발 중 무엇을 먼저 내놓을지 제안하는 것입니다.",
      ],
      cast: [
        { name: "권도현", note: "브릿지은행 기업구조개선부 심사역이자 플로우온 창업주의 장남. 동정은 받지 않고, 모든 것을 계산서로 말합니다." },
        { name: "도윤하", note: "트리거랩 현장 담당. 채권단 명단을 들고 와 권도현이 어떤 자리에 서 있는지 짚어 줍니다. 3년 전 강서지점 창구에 있던 사람입니다." },
      ],
      question: "3년 전 막지 못한 대출의 회사를 이번에는 살리면서, 동시에 무너뜨린 사람들에게 책임을 물을 수 있을까요? 권도현의 계산서에서 당신 칸에는 무엇을 적겠습니까?",
    },
    en: {
      setting: "2025 · Yeongdong Branch → Yeouido → FlowOn creditors’ meeting room → Fulfillment center",
      premise: [
        "Three years ago, KD Bank lent 31 billion won to the logistics platform FlowOn. The very loan you dissented on, alone, is back on the table: FlowOn faces another vote by its creditors’ committee, the group of lenders it owes. This time the agenda is not rehabilitation but liquidation. Sixty hours remain, and 1,140 employees and 280 suppliers are waiting on the result. Three years ago, you counted for yourself how that company’s numbers were made.",
        "The push for liquidation comes from Bridge Bank, which holds the senior collateral, the right to be paid first if the company collapses. Its representative credit officer is Kwon Dohyun, the founder’s eldest son. Setting the list of creditors down, Do Yoonha sums it up: a man who turned down the family business to join a bank has now come, from the bank’s side, to close his father’s company.",
        "Kwon Dohyun draws columns on a blank sheet and divides it into boxes. Bridge Bank, KD Bank, employees, suppliers, the uncles, and you. If you want to help him, he says, fill in your own box first. What you lose and what you gain. Leave it empty and he will read your offer as pity and turn it down. His own box is already filled. Lose: family. Gain: nothing. Your box is still blank.",
        "The numbers are cold, too. Bridge Bank gets back 61 percent of its money under rehabilitation and 78 percent under liquidation. If Kwon Dohyun backs rehabilitation, his own bank may remove him. One bill saves the company; the other punishes the people who brought it down. This time, both have to go on the same table. Your authority is to propose which goes first: the rescue plan or the criminal complaint.",
      ],
      cast: [
        { name: "Kwon Dohyun", note: "A credit officer in Bridge Bank’s corporate restructuring department and FlowOn’s founder’s eldest son. He refuses pity and speaks only in ledgers." },
        { name: "Do Yoonha", note: "Trigger Lab’s field officer. He brings the list of creditors and spells out exactly where Kwon Dohyun is standing. Three years ago he sat at a teller window in the Gangseo Branch." },
      ],
      question: "Can you save the company behind the loan you failed to stop three years ago, and still hold to account the people who brought it down? In Kwon Dohyun’s ledger, what will you write in your own box?",
    },
    ja: {
      setting: "2025年 · ヨンドン支店 → ヨイド → フロウオン債権団会議室 → フルフィルメントセンター",
      premise: [
        "3年前、KD銀行が310億ウォンを貸した物流プラットフォーム、フロウオン。あなたがひとりで反対意見を出した、まさにあの融資の会社が、再び債権団(お金を貸した金融機関の集まり)の決議を控えています。今回の議案は再生ではなく清算(会社をたたんでなくす手続き)です。決議まで60時間。従業員1,140人と協力会社280社が、その結果を待っています。3年前、あなたはその会社の数字がどう作られたのかを自分の目で数えた人です。",
        "清算を押し進めているのは、先順位担保(会社が倒れたとき、いちばん先にお金を回収できる権利)を握るブリッジ銀行です。その銀行の代表審査役は、フロウオン創業者の長男クォン・ドヒョン。債権団の名簿を置きながら、ト・ユナが言います。家業を断って銀行に入った人が、今度は銀行の側から父親の会社を閉じに来たのだと。",
        "クォン・ドヒョンは白紙に縦線を引いて欄を分けます。ブリッジ銀行、KD銀行、従業員、協力会社、叔父たち、そしてあなた。自分を助けるつもりなら、まずあなたの欄を埋めてほしいと言います。失うものと得るもの。そこが空なら、その提案は同情と読んで断ると。彼の欄はもう埋まっています。失うもの、家族。得るもの、なし。あなたの欄は、まだ空いたままです。",
        "数字も冷たいままです。ブリッジ銀行が貸したお金を取り戻せる割合は、再生なら61%、清算なら78%。クォン・ドヒョンが再生の側に立てば、彼は自分の銀行で職を失うかもしれません。会社を救う計算書と、会社を崩した人たちを罰する計算書。今回は、その二枚を同じテーブルに載せなければなりません。今回あなたが持つ権限は、再生案と告発のどちらを先に出すかを提案することです。",
      ],
      cast: [
        { name: "クォン・ドヒョン", note: "ブリッジ銀行企業構造改善部の審査役で、フロウオン創業者の長男。同情を受けつけず、すべてを計算書で語ります。" },
        { name: "ト・ユナ", note: "トリガーラボの現場担当。債権団の名簿を持ってきて、クォン・ドヒョンの立ち位置を言い当てます。3年前、カンソ支店の窓口にいた人です。" },
      ],
      question: "3年前に止められなかった融資の会社を今度は救いながら、それを崩した人たちに責任を問うことはできるでしょうか。クォン・ドヒョンの計算書のあなたの欄に、何を書きますか。",
    },
  },

  case10: {
    ko: {
      setting: "2025년 · 강서 이음병원 → 강서지점 4번 창구 → 인사위원회실 → 회기동 헌책방 2층",
      premise: [
        "이긴 다음 날 청구서가 날아옵니다. 어제 아침, 트리거랩 현장 담당 도윤하가 응급실로 실려 갔습니다. 과로와 탈진, 그리고 3년째 처방받아 온 수면제. 그룹은 이 일을 업무와 상관없는 개인 사정으로 분류했습니다. 이긴 판의 청구서가 누구 앞으로 왔는지 확인하는 사건입니다.",
        "실장 한서윤이 그의 사물함에서 나온 파일을 내놓습니다. 공식 문서가 아니라서 보존연한(기록을 몇 년 보관하고 버릴지 정해 둔 기간)이 0입니다. 96시간, 나흘 뒤면 자동으로 폐기됩니다. 아무도 지키라고 한 적 없는 기록이라, 아무도 지켜 주지 않습니다. 그룹은 그가 쓰러진 이유를 업무 밖의 일로 적었고, 그가 3년 동안 해 온 일도 여전히 업무 밖의 기록으로 남아 있습니다.",
        "파일을 넘기던 이민서의 손끝에서 이름들이 이어집니다. 강서지점 창구에서 팔린 대출로 무너진 사람 1,740명. 이름과 연락처 옆에 '해결' 또는 '미해결'이 적혀 있습니다. 해결 612명, 미해결 1,128명. 그의 급여 이체 내역에는 매달 나간 소액 송금이 47건 남아 있고, 명단 어디에도 그 자신의 이름은 없습니다. 마지막 장에는 그의 글씨로 한 줄이 더 있습니다. 반대 의견을 쓰고 지하로 내려간 사람, 미해결. 당신도 그가 세고 있던 사람이었습니다. 그는 자신은 세지 않으면서, 당신은 세고 있었습니다.",
        "한 사람의 집념으로 버티던 일은 그 사람이 쓰러지면 함께 끝납니다. 이 명단을 누군가의 선의가 아니라 부서지지 않는 구조로 옮겨야 합니다. 그런데 규칙을 만들면 그 규칙 밖으로 밀려나는 사람이 생깁니다. 나흘 안에 당신은 둘 다를 붙잡아야 합니다. 당신에게 주어진 권한은 명단을 어디까지 제도로 옮기고 누구에게 맡길지 제안하는 것입니다.",
      ],
      cast: [
        { name: "도윤하", note: "강서지점 창구 출신의 트리거랩 현장 담당. 3년 동안 혼자 명단을 들고 버티다 쓰러졌습니다." },
        { name: "한서윤", note: "트리거랩 실장. 폐기를 앞둔 사물함 파일을 당신 앞에 꺼내 놓습니다." },
        { name: "이민서", note: "트리거랩 데이터 기록 담당, 3년차 계약직. 명단을 한 장씩 넘기다 마지막 줄에서 손을 멈춥니다." },
      ],
      question: "한 사람이 혼자 들고 있던 1,740명의 명단을, 당신은 어떻게 무너지지 않는 제도로 옮기겠습니까? 그리고 그 제도 밖으로 밀려나는 사람은 누가 돌봅니까?",
    },
    en: {
      setting: "2025 · Ieum Hospital, Gangseo → Window 4, Gangseo Branch → HR committee room → Secondhand bookshop in Hoegi-dong, 2nd floor",
      premise: [
        "The bill arrives the day after a win. Yesterday morning, Trigger Lab’s field officer Do Yoonha was rushed to the emergency room. Overwork, exhaustion, and the sleeping pills he has been prescribed for three years. The group has filed it as a personal matter, nothing to do with work. This case is about finding out whose name the bill for that win was sent to.",
        "Lab Director Han Seoyun puts down a file found in his locker. It is not an official document, so its retention period, the time a record must be kept before disposal, is zero. In 96 hours, four days, it will be purged automatically. No one ever asked for this record to be kept, so no one is protecting it. The group wrote his collapse down as something outside work, and the work he did for three years still sits outside the official record too.",
        "As Lee Minseo turns the pages, the names keep coming. 1,740 people ruined by loans sold at the Gangseo Branch windows, each with a contact number and the word ‘resolved’ or ‘unresolved’. 612 resolved, 1,128 unresolved. His salary records show 47 small transfers going out month after month, and his own name appears nowhere on the list. On the last page there is one more line in his handwriting: the person who wrote the dissent and was sent down to the basement, unresolved. You were one of the people he was counting. He never counted himself, but he counted you.",
        "Work that rests on one person’s persistence ends when that person falls. This list has to move from someone’s goodwill into a structure that will not break. But every rule leaves someone outside it. In four days you have to hold on to both. Your authority is to propose how much of the list moves into policy, and who takes charge of it.",
      ],
      cast: [
        { name: "Do Yoonha", note: "Trigger Lab’s field officer, once a teller at the Gangseo Branch. He carried the list alone for three years until he collapsed." },
        { name: "Han Seoyun", note: "Director of Trigger Lab. She places the locker file, days from being purged, in front of you." },
        { name: "Lee Minseo", note: "Trigger Lab’s data records officer, on a contract in her third year. She turns the list page by page and stops at the last line." },
      ],
      question: "How do you turn a list of 1,740 names that one person carried alone into a system that will not collapse? And who looks after the people that system leaves out?",
    },
    ja: {
      setting: "2025年 · カンソ・イウム病院 → カンソ支店4番窓口 → 人事委員会室 → フェギ洞の古本屋2階",
      premise: [
        "勝った翌日に、請求書が届きます。昨日の朝、トリガーラボの現場担当ト・ユナが救急外来に運ばれました。過労と疲労困憊、そして3年間処方されてきた睡眠薬。グループはこれを、業務とは関係のない個人的事情に分類しました。勝った戦いの請求書が誰の前に届いたのかを確かめる事件です。",
        "室長のハン・ソユンが、彼のロッカーから出てきたファイルを差し出します。公式文書ではないので、保存年限(記録を何年保管して捨てるかを決めた期間)は0。96時間、4日後には自動で廃棄されます。誰も守れと言わなかった記録だから、誰も守ってくれないのです。グループは彼が倒れた理由を業務の外のことと記し、彼が3年間続けてきた仕事もまた、公式の記録の外に置かれたままです。",
        "ファイルをめくるイ・ミンソの指先から、名前が続いていきます。カンソ支店の窓口で売られた融資で崩れた1,740人。名前と連絡先の横に、'解決'か'未解決'が書かれています。解決612人、未解決1,128人。彼の給与振込の記録には毎月出ていく少額送金が47件残り、名簿のどこにも本人の名前はありません。最後のページには、彼の字でもう一行。反対意見を書いて地下へ降りた人、未解決。あなたも、彼が数えていた一人でした。彼は自分を数えずに、あなたを数えていたのです。",
        "一人の執念で持ちこたえていたことは、その人が倒れれば一緒に終わります。この名簿を誰かの善意から、壊れない仕組みへと移さなければなりません。けれど規則を作れば、その外に押し出される人が出てきます。4日のうちに、あなたはその両方をつかまなければなりません。あなたに与えられた権限は、名簿をどこまで制度に移し、誰に任せるかを提案することです。",
      ],
      cast: [
        { name: "ト・ユナ", note: "カンソ支店の窓口出身で、トリガーラボの現場担当。3年間ひとりで名簿を抱え、倒れました。" },
        { name: "ハン・ソユン", note: "トリガーラボの室長。廃棄を目前にしたロッカーのファイルを、あなたの前に置きます。" },
        { name: "イ・ミンソ", note: "トリガーラボのデータ記録担当で、契約社員3年目。名簿を一枚ずつめくり、最後の行で手を止めます。" },
      ],
      question: "一人の人がひとりで抱えていた1,740人の名簿を、あなたはどうやって崩れない制度に移しますか。そして、その制度の外に押し出される人は、誰が支えるのでしょうか。",
    },
  },

  case11: {
    ko: {
      setting: "2025년 · 망원동 리드라인 편집국 → 국회 의원회관 → 회기동 헌책방 2층 → 국회 본관 정무위원회 회의실",
      premise: [
        "탐사보도 매체 리드라인에 기사 하나가 실립니다. 「반대 의견은 왜 사라졌나 -- KD은행 2023-0412 대출의 3년」. 기사 속 '익명의 작성자 A씨'가 바로 당신입니다. 오전에만 조회수 41만. 지난주 당신의 영동지점 발령은 '원 소속 복귀'라는 한 줄로 거둬졌습니다. 사유도, 승인자도 없이.",
        "아홉 시, 그룹 홍보실은 '일부 직원의 개인적 판단'을 확인 중이라는 입장문을 냅니다. 정오에는 국회가 당신을 국정감사(국회가 공개적으로 따져 묻는 자리)에 부릅니다. 자격은 참고인, 곧 증언할 의무는 없지만 사실을 설명하러 나오는 사람입니다. 출석까지 5일. 증인으로 채택된 그룹전략실 윤상혁 상무는 해외 출장을 이유로 나오지 않을 예정입니다. 한서윤의 전화는 오늘 40번 울렸고, 그중 39번이 당신 번호를 묻는 전화였습니다.",
        "의원실 보좌관 차지원이 A4 두 장을 내밉니다. 의원실 대본의 마지막 줄은 당신이 할 대답, 윤상혁 상무가 반대 의견 삭제를 직접 지시했다는 문장입니다. 그룹 홍보실이 보낸 '참고 자료'는 정반대로 끝납니다. 당시 판단은 개인의 소신이었고 조직적 압력은 없었다는 문장. 두 대본 모두, 당신이 증명할 수 없는 문장으로 끝납니다. 회신 기한은 오늘 밤 12시입니다.",
        "질의 시간은 7분, 참고인의 답변은 평균 40초입니다. 7분 안에 들어가지 않는 진실은 그 방에서는 없는 진실이라고 차지원은 말합니다. 진실을 말하는 순간, 그 진실에 이름이 걸린 사람들도 함께 드러납니다. 지금까지는 닫힌 방에서 결정했다면, 이번에는 카메라 앞에서 말해야 합니다. 당신이 쥔 권한은 누구의 이름을 어떤 순서로 말할지 제안하는 것입니다.",
      ],
      cast: [
        { name: "한서윤", note: "트리거랩 실장. 하루 종일 당신을 찾는 전화를 대신 받아 내고 있습니다." },
        { name: "차지원", note: "국회 정무위원회 의원실 보좌관, 국정감사 4년차. 7분이라는 시간의 무게를 누구보다 잘 압니다." },
        { name: "윤상혁", note: "KD금융그룹 그룹전략실 상무. 증인으로 채택됐지만, 그의 자리는 비어 있을 예정입니다." },
      ],
      question: "모두가 지켜보는 방에서, 증명할 수 없는 문장 대신 당신은 무엇을 말하겠습니까? 그리고 그 말에는 누구의 이름을 걸겠습니까?",
    },
    en: {
      setting: "2025 · Leadline newsroom, Mangwon-dong → National Assembly Members’ Office Building → Secondhand bookshop in Hoegi-dong, 2nd floor → Policy Committee room, National Assembly main building",
      premise: [
        "The investigative outlet Leadline runs a story: “Why the Dissent Disappeared -- 3 Years of KD Bank Loan 2023-0412.” The ‘anonymous author, Source A’ in it is you. It reaches 410,000 views by noon. Last week your Yeongdong transfer was withdrawn with a single line, ‘return to original department’. No reason, no approver.",
        "At nine, the group PR office says it is looking into ‘the personal judgment of certain employees’. At noon, the National Assembly calls you to its parliamentary audit, the public hearing where lawmakers question institutions. You are summoned as an unsworn witness, someone with no duty to testify who comes to explain the facts. You appear in five days. Managing Director Yoon Sanghyuk of the Group Strategy Office has been summoned as a sworn witness, but is expected to skip it, citing an overseas trip. Han Seoyun’s phone rang 40 times today; 39 of those calls were asking for your number.",
        "Aide Cha Jiwon hands you two A4 sheets. The last line of the lawmaker’s script is your answer: that Yoon Sanghyuk personally ordered the dissent deleted. The ‘reference material’ from the group PR office ends the opposite way: that the decision back then was an individual’s conviction, with no organizational pressure. Both scripts end in a sentence you cannot prove. Both want a reply by midnight.",
        "Questioning gets seven minutes, and a witness answer averages forty seconds. A truth that does not fit in seven minutes, Cha Jiwon says, does not exist in that room. The moment you tell the truth, everyone whose name hangs on it is exposed with it. Until now the decisions were made behind closed doors. This time you speak in front of the cameras. Your authority is to propose whose names to say, and in what order.",
      ],
      cast: [
        { name: "Han Seoyun", note: "Director of Trigger Lab. All day she has been fielding the calls meant for you." },
        { name: "Cha Jiwon", note: "An aide in a lawmaker’s office on the National Assembly’s Policy Committee, in her fourth audit season. She knows exactly how much seven minutes weighs." },
        { name: "Yoon Sanghyuk", note: "Managing Director of KD Financial Group’s Group Strategy Office. Summoned as a sworn witness, his seat is expected to stay empty." },
      ],
      question: "In a room everyone is watching, what will you say instead of a sentence you cannot prove? And whose name will you stake on it?",
    },
    ja: {
      setting: "2025年 · マンウォン洞 リードライン編集局 → 国会議員会館 → フェギ洞の古本屋2階 → 国会本館 政務委員会会議室",
      premise: [
        "調査報道メディアのリードラインに、一本の記事が載ります。「反対意見はなぜ消えたのか -- KD銀行2023-0412融資の3年」。記事の中の'匿名の作成者A氏'が、あなたです。午前だけで閲覧数41万。先週、あなたのヨンドン支店行きは'元の所属に復帰'という一行で取り消されました。理由も、承認者もないまま。",
        "九時、グループ広報室は'一部職員の個人的判断'を確認中だという声明を出します。正午には国会があなたを国政監査(国会が公開の場で問いただす場)に呼びます。資格は参考人、つまり証言の義務はないけれど事実を説明しに出てくる人です。出席まで5日。証人に採択されたグループ戦略室のユン・サンヒョク常務は、海外出張を理由に欠席する予定です。ハン・ソユンの電話は今日40回鳴り、そのうち39回があなたの番号を訊く電話でした。",
        "議員室の補佐官チャ・ジウォンが、A4の紙を二枚差し出します。議員室の台本の最後の行は、あなたが答える一文。ユン・サンヒョク常務が反対意見の削除を直接指示した、という文です。グループ広報室が送ってきた'参考資料'は正反対で終わります。当時の判断は個人の信念で、組織的な圧力はなかった、という文。どちらの台本も、あなたが証明できない一文で終わっています。回答の期限は今夜12時です。",
        "質疑時間は7分、参考人の答弁は平均40秒。7分に収まらない真実は、あの部屋ではない真実なのだとチャ・ジウォンは言います。真実を口にした瞬間、その真実に名前がかかっている人たちも一緒にさらされます。これまでは閉ざされた部屋で決めてきました。今回は、カメラの前で話さなければなりません。あなたが持つ権限は、誰の名前をどの順番で口にするかを提案することです。",
      ],
      cast: [
        { name: "ハン・ソユン", note: "トリガーラボの室長。一日じゅう、あなたを探す電話を代わりに受け止めています。" },
        { name: "チャ・ジウォン", note: "国会政務委員会の議員室補佐官で、国政監査4年目。7分という時間の重さを誰よりも知っています。" },
        { name: "ユン・サンヒョク", note: "KD金融グループ、グループ戦略室の常務。証人に採択されましたが、その席は空いたままになる見込みです。" },
      ],
      question: "誰もが見ている部屋で、証明できない一文の代わりに、あなたは何を語りますか。そして、その言葉に誰の名前をかけますか。",
    },
  },

  case12: {
    ko: {
      setting: "2025년 가을 · 여의도 금융감독원 → 망원시장 가을떡방 → 인천 남동공단 → 인천 추모공원",
      premise: [
        "그룹이 2023-0412 대출 피해자에게 300억을 주는 '자율 배상안'을 발표합니다. 1인당 평균 1,700만 원. 조건은 하나, 부제소 합의(앞으로 이 일로 소송하지 않겠다는 약속)에 서명하는 것입니다. 금융감독원 분쟁조정 신청 마감까지는 10일이 남았습니다.",
        "도윤하가 공지문을 들고 와 전합니다. 피해자 모임 대표가 당신을 만나고 싶어 한다고. 망원시장에서 떡집을 하는 문가을이라는 사람이고, 고맙다는 말을 하려는 자리는 아닐 거라고. 피해자 모임에는 1,021명이 등록되어 있습니다. 지금까지 1,740이라는 숫자로만 불리던 사람들을, 당신은 처음으로 얼굴로 만나러 갑니다. 이 사건은 설명회장에서 시작해 가게와 공장, 그리고 추모공원으로 이어집니다.",
        "분쟁조정(금융회사와 고객 사이의 다툼을 법원 대신 중재하는 절차) 설명회장에는 340명이 모였습니다. 의자 200개로는 모자라 백 명 넘게 서 있습니다. 당신이 소개되자 웅성거림이 번지고, 맨 앞줄의 문가을이 일어섭니다. 반대 의견을 썼다면서 왜 막지 않았느냐고, 지하로 내려가 3년 동안 무엇을 했느냐고. 그의 남편은 협력사 가온정밀의 대표였고, 작년 가을 부도 직후 세상을 떠났습니다. 그 질문은 다른 누구도 아닌 당신의 3년을 향해 있습니다.",
        "객석에서 '그만해요'와 '들어야죠'가 엇갈립니다. 많은 사람이 그 돈을 받을지 망설이고 있습니다. 빨리 받는 배상은 대개 조용함을 함께 삽니다. 그 조용함의 값은 기준 밖에 있는 사람이 치릅니다. 서류가 없어 기준에 들지 못한 212명까지 품을 수 있는지가 이번 사건의 무게입니다. 당신의 권한은 배상 기준에 누구를 넣을지, 서명의 조건을 어떻게 할지 제안하는 것입니다.",
      ],
      cast: [
        { name: "문가을", note: "망원시장 가을떡방 주인이자 피해자 모임 대표. 등록된 1,021명을 대신해 당신의 3년을 묻습니다." },
        { name: "도윤하", note: "트리거랩 현장 담당. 피해자 모임의 연락을 전하며, 쉬운 자리가 아닐 거라고 미리 일러 줍니다." },
      ],
      question: "'왜 안 막았어요?'라는 물음 앞에서 당신은 무엇이라 답하겠습니까? 조건이 붙은 돈 앞에서, 서류가 없는 212명의 이름은 누가 기준에 올립니까?",
    },
    en: {
      setting: "Autumn 2025 · Financial Supervisory Service, Yeouido → Gaeul Rice Cake Shop, Mangwon Market → Namdong Industrial Complex, Incheon → Memorial park, Incheon",
      premise: [
        "The group announces a ‘voluntary compensation plan’: 30 billion won for the people harmed by loan 2023-0412, about 17 million won per person on average. There is one condition. Each recipient must sign a no-suit agreement, a promise never to take this matter to court. The deadline to apply for dispute mediation at the Financial Supervisory Service is ten days away.",
        "Do Yoonha brings in the notice with a message. The head of the victims’ group wants to meet you. Her name is Moon Gaeul, she runs a rice cake shop in Mangwon Market, and she is not, he warns, asking you over to say thank you. The victims’ group has 1,021 registered members. For the first time, you go to meet the people who until now have only been a number: 1,740. This case starts in a briefing hall and leads on to shops, a factory and a memorial park.",
        "At the dispute mediation briefing, where a regulator explains how disputes between banks and customers can be settled outside court, 340 people have turned up for 200 chairs. More than a hundred are standing. When you are introduced, a murmur spreads, and Moon Gaeul rises in the front row. You wrote a dissent, she says, so why didn’t you stop it? What did you do for three years after you went down to the basement? Her husband ran Gaon Precision, a supplier, and died right after it went bankrupt last autumn. The question is aimed at no one but you, and your three years.",
        "From the seats, ‘That’s enough’ collides with ‘No, we need to hear this.’ Many in the room are still deciding whether to take the money. Fast compensation usually buys silence along with it, and the price of that silence is paid by the people outside the criteria. Whether 212 people with no paperwork can be brought inside is the weight of this case. Your authority is to propose who goes into the compensation criteria and on what terms people sign.",
      ],
      cast: [
        { name: "Moon Gaeul", note: "Owner of Gaeul Rice Cake Shop in Mangwon Market and head of the victims’ group. On behalf of its 1,021 members, she asks about your three years." },
        { name: "Do Yoonha", note: "Trigger Lab’s field officer. He passes on the victims’ group’s request and warns you it will not be an easy meeting." },
      ],
      question: "Faced with ‘Why didn’t you stop it?’, what will you answer? And with money on the table that comes with strings, who puts the names of 212 people without paperwork inside the criteria?",
    },
    ja: {
      setting: "2025年秋 · ヨイド 金融監督院 → マンウォン市場のガウル餅房 → インチョン・ナムドン工業団地 → インチョン追悼公園",
      premise: [
        "グループが、2023-0412融資の被害者に300億ウォンを支払う'自主賠償案'を発表します。一人あたり平均1,700万ウォン。条件は一つ、不提訴合意(今後この件で訴訟を起こさないという約束)への署名です。金融監督院の紛争調停の申請締め切りまで、あと10日です。",
        "ト・ユナが告知文を持ってきて伝えます。被害者の会の代表があなたに会いたがっていると。マンウォン市場で餅屋を営むムン・ガウルという人で、お礼を言うための場ではないだろうと。被害者の会には1,021人が登録しています。これまで1,740という数字でしか呼ばれてこなかった人たちに、あなたは初めて顔を合わせに行きます。この事件は説明会場から始まり、店へ、工場へ、そして追悼公園へと続いていきます。",
        "紛争調停(金融会社と顧客の争いを、裁判所の代わりに仲裁する手続き)の説明会場には340人が集まりました。椅子200脚では足りず、百人以上が立っています。あなたが紹介されるとざわめきが広がり、最前列のムン・ガウルが立ち上がります。反対意見を書いたのなら、なぜ止めなかったのか。地下に降りて、3年間何をしていたのか。彼女の夫は協力会社カオン精密の代表で、昨年の秋、不渡りの直後に亡くなりました。問いの矛先は、ほかの誰でもなく、あなたの3年に向いています。",
        "客席では'やめてください'と'聞くべきでしょう'が交差します。多くの人が、そのお金を受け取るかどうか迷っています。早く受け取る賠償は、たいてい沈黙も一緒に買います。その沈黙の代価を払うのは、基準の外にいる人たちです。書類がなく基準に入れない212人まで抱えられるかどうか。それがこの事件の重さです。あなたの権限は、賠償基準に誰を入れるか、署名の条件をどうするかを提案することです。",
      ],
      cast: [
        { name: "ムン・ガウル", note: "マンウォン市場のガウル餅房の店主で、被害者の会の代表。登録した1,021人に代わって、あなたの3年を問いただします。" },
        { name: "ト・ユナ", note: "トリガーラボの現場担当。被害者の会からの連絡を伝え、楽な場ではないと前もって告げます。" },
      ],
      question: "'なぜ止めなかったんですか'という問いに、あなたは何と答えますか。条件つきのお金を前にして、書類のない212人の名前を基準に載せるのは誰でしょうか。",
    },
  },

  case13: {
    ko: {
      setting: "2025년 가을 · 본사 33층 그룹전략실 → 성수동 광고 스튜디오 → 망원시장 가을떡방 → 트리거랩 4층 → 생방송 세트장",
      premise: [
        "첫 배상금이 들어온 다음 날, 본사 33층 그룹전략실. 윤상혁 상무가 서명란 대신 태블릿을 밀어 줍니다. 'KD 혁신위원회' 외부 공개 위원 명단 맨 위에 당신의 이름이 있습니다. 국정감사(국회가 공개적으로 따져 묻는 자리) 뒤로 사람들은 얼굴을 원한다고 그는 말합니다. 반대 의견을 썼던 사람이 과거는 정리됐다고 말해 주는 얼굴을.",
        "대가도 분명합니다. 서류가 없던 212명의 배상 기준 확정, 그리고 트리거랩 동료 전원의 정규 부서 복귀. 혁신위원회 간사인 그룹전략실 차장 백아린이 명함을 내밉니다. 촬영은 내일, 생중계는 엿새 뒤. 출범 날짜는 뉴욕 대주주 킹스데일 파트너스의 분기 리뷰 주간에 맞춰져 있습니다. 이번에 내밀어진 것은 서명란이 아니라 출연 계약서이고, 칸은 하나뿐입니다.",
        "다음 날 성수동 광고 스튜디오. 크로마키(초록 벽 앞에서 찍고 배경은 나중에 합성하는 방식) 앞에서 NG가 17번 납니다. 웃는 얼굴이 '인질 같다'는 이유로 다섯 번, 'KD'가 '캐디'로 들린다는 이유로 세 번. 도장 찍는 장면에만 나오는 영동지점장 나준혁은 한 번에 통과하고, 봉영훈 감독은 주인공을 저분으로 바꾸면 안 되냐고 진지하게 묻습니다. 조명 스탠드 네 개는 강태민이 혼자 나릅니다.",
        "18번째 테이크, 프롬프터(읽을 문장을 렌즈 앞에 띄워 주는 화면)에 마지막 줄이 올라옵니다. '과거는 모두 정리되었습니다.' 얼굴을 빌려주는 순간, 그 얼굴이 읽은 문장은 당신의 서명이 됩니다. 웃음이 터지는 촬영장 한가운데서, 당신은 그 한 문장의 값을 따져야 합니다.",
      ],
      cast: [
        { name: "윤상혁", note: "KD금융그룹 그룹전략실 상무. 이번에는 서명이 아니라 당신의 얼굴을 원합니다." },
        { name: "백아린", note: "그룹전략실 차장이자 KD 혁신위원회 간사. 촬영과 생중계 일정을 손에 쥐고 있습니다." },
        { name: "봉영훈", note: "광고 감독. NG가 17번 나는 동안 모니터에 얼굴을 붙이고 있습니다." },
        { name: "나준혁", note: "강원 영동지점장. 도장 장면 카메오로 나와 한 번 만에 촬영을 끝냅니다." },
      ],
      question: "동료들의 자리와 212명의 배상을 얻는 대가로, 당신은 '과거는 정리됐다'는 문장을 읽겠습니까? 카메라 앞에서 읽을 마지막 문장은 누가 정합니까?",
    },
    en: {
      setting: "Autumn 2025 · Group Strategy Office, 33rd floor, group headquarters → Ad studio in Seongsu-dong → Gaeul Rice Cake Shop, Mangwon Market → Trigger Lab, 4th floor → Live broadcast set",
      premise: [
        "The day after the first compensation payments land, in the Group Strategy Office on the 33rd floor, Managing Director Yoon Sanghyuk slides a tablet across the table instead of a signature field. At the top of the list of public outside members for the ‘KD Innovation Committee’ is your name. Since the parliamentary audit, he says, people want a face. The face of the person who wrote the dissent, telling them the past is settled.",
        "The price is spelled out. A confirmed compensation standard for the 212 people without paperwork, and every Trigger Lab colleague returned to a regular department. Baek Arin, a deputy manager in the Group Strategy Office and the committee’s secretary, hands you her card. The shoot is tomorrow; the live broadcast is in six days, timed to the quarterly review week of the New York major shareholder, Kingsdale Partners. This time it is not a signature field but a performance contract, and there is only one box.",
        "The next day, at an ad studio in Seongsu-dong, the take is blown 17 times in front of the green screen. Five times because your smile looks ‘like a hostage’, three because ‘KD’ sounds like ‘caddie’. Na Junhyuk, manager of the Yeongdong Branch, who appears only in the stamping shot, nails it in one, and director Bong Younghoon asks, quite seriously, whether they could make him the lead instead. Kang Taemin carries all four light stands by himself.",
        "On take 18, the last line scrolls up the teleprompter: ‘The past has all been settled.’ The moment you lend your face, the sentence it reads becomes your signature. In the middle of a set full of laughter, you have to work out what that one sentence costs.",
      ],
      cast: [
        { name: "Yoon Sanghyuk", note: "Managing Director of KD Financial Group’s Group Strategy Office. This time he does not want your signature. He wants your face." },
        { name: "Baek Arin", note: "Deputy manager in the Group Strategy Office and secretary of the KD Innovation Committee. She holds the shoot and broadcast schedule." },
        { name: "Bong Younghoon", note: "The ad director, pressing his face to the monitor through 17 blown takes." },
        { name: "Na Junhyuk", note: "Manager of the Gangwon Yeongdong Branch, who turns up for a cameo in the stamping shot and finishes it in one take." },
      ],
      question: "In exchange for your colleagues’ jobs and compensation for 212 people, will you read the line ‘the past is settled’? Who decides the last sentence you say in front of the camera?",
    },
    ja: {
      setting: "2025年秋 · 本社33階 グループ戦略室 → ソンス洞の広告スタジオ → マンウォン市場のガウル餅房 → トリガーラボ4階 → 生放送のセット",
      premise: [
        "最初の賠償金が振り込まれた翌日、本社33階のグループ戦略室。ユン・サンヒョク常務が、署名欄の代わりにタブレットを差し出します。'KD革新委員会'の外部公開委員の名簿のいちばん上に、あなたの名前があります。国政監査(国会が公開の場で問いただす場)のあと、世間は顔を欲しがっていると彼は言います。反対意見を書いた人が、過去は整理されたと言ってくれる顔を。",
        "見返りもはっきりしています。書類のなかった212人の賠償基準の確定と、トリガーラボの同僚全員の正規部署への復帰。革新委員会の幹事で、グループ戦略室次長のペク・アリンが名刺を差し出します。撮影は明日、生中継は六日後。発足日はニューヨークの大株主キングスデール・パートナーズの四半期レビューの週に合わせてあります。今回差し出されたのは署名欄ではなく出演契約書で、欄は一つしかありません。",
        "翌日、ソンス洞の広告スタジオ。クロマキー(緑の壁の前で撮り、背景はあとで合成する方式)の前で、NGが17回出ます。笑顔が'人質みたい'で五回、'KD'が'キャディ'に聞こえるで三回。判を押す場面にだけ出るヨンドン支店長ナ・ジュニョクは一発で通り、ポン・ヨンフン監督は主役をあの方に替えられないかと真顔で尋ねます。照明スタンド四本は、カン・テミンがひとりで運びます。",
        "18回目のテイク、プロンプター(読む文をレンズの前に映す画面)に最後の行が上がってきます。'過去はすべて整理されました。' 顔を貸した瞬間、その顔が読んだ一文はあなたの署名になります。笑いが起きる撮影現場の真ん中で、あなたはその一文の値段を見極めなければなりません。",
      ],
      cast: [
        { name: "ユン・サンヒョク", note: "KD金融グループ、グループ戦略室の常務。今回欲しいのは署名ではなく、あなたの顔です。" },
        { name: "ペク・アリン", note: "グループ戦略室の次長で、KD革新委員会の幹事。撮影と生中継の日程を握っています。" },
        { name: "ポン・ヨンフン", note: "広告監督。NGが17回出るあいだ、モニターに顔を寄せ続けています。" },
        { name: "ナ・ジュニョク", note: "カンウォン・ヨンドン支店長。判を押す場面のカメオで登場し、一発で撮影を終えます。" },
      ],
      question: "同僚たちの席と212人の賠償と引き換えに、あなたは'過去は整理された'という一文を読みますか。カメラの前で読む最後の一文は、誰が決めるのでしょうか。",
    },
  },
};
