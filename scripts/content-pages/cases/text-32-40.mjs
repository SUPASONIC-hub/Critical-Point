/**
 * Spoiler-free case pages, 32-40: setting, premise, cast and question per case
 * in Korean, English and Japanese, written from the first two scenes of each case
 * (scripts/content-pages/cases.mjs renders them). Nothing past a case's second scene.
 */
export default {
  case32: {
    ko: {
      setting: "2026년 6월 · KD캐피탈 12층 위험관리부 → 본사 33층 그룹전략실 → 서울중앙지검 1108호",
      premise: [
        "아침 7시 40분, 파란 조끼를 입은 서울중앙지검 수사관 11명이 KD캐피탈 12층으로 들어옵니다. 손에는 압수수색 영장(법원이 허락한, 자료와 물건을 강제로 가져가도 된다는 문서)과 납작하게 접어 온 빈 상자 60개가 들려 있습니다. 같은 시각 본사 33층 그룹전략실과 KD캐피탈 대표이사실에도 수사관이 들어갑니다. 혐의는 세 갈래입니다. 평택 오피스텔 대출의 손실을 뒤로 미룬 일, 라운드힐 매각 가격, 그리고 해온파트너스에 나간 자문료입니다.",
        "앞장선 나은호 검사는 곧장 당신 책상 앞에서 멈춥니다. 3년 전 대출번호 2023-0412에 혼자 반대 의견을 쓴 사람이 당신이라는 걸, 그는 이미 알고 있습니다. 오늘 오후 2시에 참고인(증언할 의무는 없지만 사실을 설명하러 나오는 사람)으로 나오라고 하면서 그는 당신 모니터에 봉인 스티커를 붙입니다. 그리고 짧게 덧붙입니다. ‘참고인이라고 했습니다. 지금은요.’",
        "33층 복도에는 트리거랩 기록 상자 40개가 쌓여 있습니다. 상자 옆면마다 그룹 법무팀 스티커가 붙어 있습니다. ‘보관 기한 만료, 6월 20일 폐기 예정.’ 나은호가 연 상자의 맨 위 파일철에는 당신 이름이 붙어 있고, 반응 기록만 1,106쪽입니다. 그런데 상자 속에서 윤상혁이라는 이름은 아직 한 번도 나오지 않았습니다. 게다가 이 상자들 어딘가에는 당신이 쓴 적 없는 당신의 서명까지 들어 있습니다.",
        "반대 의견을 쓴 사람으로 불려 왔는데, 종이 위에서는 당신이 가장 자주 등장하는 사람입니다. 동료들의 기록이 하나씩 상자에 담기는 하루 동안, 당신은 무엇을 먼저 지키고 무엇을 먼저 밝힐지 정해야 합니다. 이 장의 규칙은 짧습니다. 압수는 종이를 세고, 종이에는 쓴 사람의 이름만 남습니다.",
      ],
      cast: [
        { name: "나은호", note: "서울중앙지검 반부패수사부의 17년 차 검사. 빠르고, 무례하다 싶을 만큼 솔직합니다. 당신을 참고인으로 부르면서도 질문은 늘 한 걸음 더 들어옵니다." },
        { name: "백아린", note: "3월에 낸 사표가 석 달째 수리되지 않아 아직 33층에 책상이 남아 있는 사람. 자기 서랍 세 칸이 비워지는 것을 선 채로 지켜봅니다." },
        { name: "윤상혁", note: "KD캐피탈 대표이사이자 전 그룹전략실 상무. 3년 전에는 KD은행 기업금융전략팀장이었습니다. 지금까지 열린 상자에는 그의 이름이 없습니다." },
      ],
      question: "서명란을 비워 둔 사람이 상자에 없을 때, 이름이 가장 많이 나오는 사람은 증인일까요, 피의자일까요? 그리고 당신은 그 차이를 어떻게 증명할까요?",
    },
    en: {
      setting: "2026, June · KD Capital Risk Management, 12th floor → Group Strategy Office, 33rd floor → Room 1108, Seoul Central District Prosecutors’ Office",
      premise: [
        "At 7:40 in the morning, eleven investigators in blue vests from the Seoul Central District Prosecutors’ Office walk onto the 12th floor of KD Capital. They carry a search and seizure warrant (a court document that lets them take records and items by force) and sixty flat-packed empty boxes. Other teams enter the Group Strategy Office on the 33rd floor and the KD Capital CEO’s office. The allegations come in three strands: losses on the Pyeongtaek officetel loans pushed into later quarters, the Roundhill sale price, and the advisory fees paid to Haeon Partners.",
        "Prosecutor Na Eunho, at the front, stops right at your desk. He already knows you are the one who wrote the lone dissent on loan 2023-0412 three years ago. He tells you to come in at two this afternoon as a witness (someone with no duty to testify who comes to explain the facts), and sticks a seal on your monitor. Then he adds: ‘I said witness. For now.’",
        "In the 33rd-floor hallway, forty Trigger Lab record boxes are stacked. Each one carries a group legal team sticker: ‘Retention period expired. To be destroyed June 20.’ Na Eunho opens one. The top file carries your name: 1,106 pages of response records. Yoon Sanghyuk’s name has not appeared in the boxes even once. And somewhere in them sits your signature on a document you never signed.",
        "You were called in as the person who objected, yet on paper you are the person who shows up most. As your colleagues’ records go into boxes one by one, you decide what to protect first and what to bring to light first. The rule of this chapter is short: a seizure counts paper, and paper keeps only the names of the people who wrote on it.",
      ],
      cast: [
        { name: "Na Eunho", note: "A prosecutor with seventeen years in the Anti-Corruption Division. Fast, and honest to the point of rudeness. He calls you a witness, but his questions keep edging closer." },
        { name: "Baek Arin", note: "Her March resignation has gone unaccepted for three months, so she still has a desk on the 33rd floor. She stands and watches her three drawers being emptied." },
        { name: "Yoon Sanghyuk", note: "CEO of KD Capital and former managing director of the Group Strategy Office; three years ago he headed KD Bank’s corporate finance strategy team. His name is in none of the boxes." },
      ],
      question: "When the person who left the signature field empty is in no box, is the name that appears most a witness or a suspect? And how do you prove the difference?",
    },
    ja: {
      setting: "2026年6月 · KDキャピタル12階リスク管理部 → 本社33階グループ戦略室 → ソウル中央地検1108号室",
      premise: [
        "朝7時40分、青いベストを着たソウル中央地検の捜査官11人がKDキャピタルの12階に入ってきます。手には家宅捜索の令状(裁判所が許可した、資料や物を強制的に持ち出してよいという文書)と、たたんで持ってきた空き箱60個。同じ時刻、本社33階のグループ戦略室とKDキャピタル代表取締役室にも捜査官が入ります。嫌疑は三つです。ピョンテクのオフィステル融資の損失の先送り、ラウンドヒルへの売却価格、そしてヘオン・パートナーズに払われた顧問料です。",
        "先頭のナ・ウノ検事は、まっすぐあなたの机の前で止まります。3年前、融資番号2023-0412にひとりで反対意見を書いたのがあなただということを、彼はもう知っています。今日の午後2時に参考人(証言する義務はないが、事実を説明しに出てくる人)として来るよう告げながら、あなたのモニターに封印シールを貼ります。そして短く付け加えます。「参考人と言いました。今のところは、です。」",
        "33階の廊下には、トリガーラボの記録の箱が40個積まれています。箱の側面にはどれもグループ法務チームのシール。「保管期限満了、6月20日廃棄予定。」ナ・ウノが開けた箱のいちばん上のファイルには、あなたの名前の札がついていて、反応記録だけで1,106ページあります。一方、ユン・サンヒョクの名前は箱の中にまだ一度も出てきていません。しかもこの箱のどこかには、あなたが書いた覚えのないあなたの署名まで入っています。",
        "反対意見を書いた人として呼ばれたのに、紙の上ではあなたがいちばん多く登場する人です。同僚たちの記録が次々と箱に詰められていく一日のあいだに、あなたは何を先に守り、何を先に明らかにするかを決めなければなりません。この章のルールは短いものです。押収は紙を数え、紙には書いた人の名前しか残りません。",
      ],
      cast: [
        { name: "ナ・ウノ", note: "ソウル中央地検反腐敗捜査部の17年目の検事。速く、失礼なほど率直です。あなたを参考人として呼びながら、質問はいつも一歩踏み込んできます。" },
        { name: "ペク・アリン", note: "3月に出した辞表が三か月受理されないまま、まだ33階に机がある人。自分の引き出し三段が空にされていくのを、立ったまま見ています。" },
        { name: "ユン・サンヒョク", note: "KDキャピタル代表取締役で、元グループ戦略室常務。3年前はKD銀行企業金融戦略チーム長でした。これまで開いた箱に、彼の名前はありません。" },
      ],
      question: "署名欄を空けておいた人が箱の中にいないとき、名前がいちばん多く出てくる人は証人なのでしょうか、被疑者なのでしょうか。そしてあなたは、その違いをどう証明しますか。",
    },
  },

  case33: {
    ko: {
      setting: "2026년 6월 말 · KD캐피탈 12층 → 공덕동 그룹 사택 원룸 → 안양 중앙시장 윤경수선",
      premise: [
        "6월 19일, 백아린이 금융감독원에 공익신고(회사 안의 잘못을 공공기관에 알리는 일)를 냅니다. 자료는 1,212쪽입니다. 첫 장은 3월에 그가 당신에게 건넸던 수신 기록(문서를 누가 언제 받았는지 남은 기록)이고, 둘째 장은 압수수색 이틀 전에 27번 상자를 밖으로 빼낸 반출 메일입니다.",
        "그룹의 답은 사흘 만에, 딱 세 줄로 옵니다. 징계해고, 영업비밀(회사가 비밀로 지키는 경영 정보) 누설 혐의의 형사 고소, 그리고 7월 7일 18시까지 사택을 비우라는 통보입니다. 3월 27일에 낸 사표는 석 달 동안 수리되지 않다가 해고가 되어 돌아왔습니다. 백아린이 전화를 겁니다. 짐 싸는 걸 도와줄 수 있느냐고, 부를 사람이 생각보다 없다고, 퍼센트로 말하면 0에 가깝다고.",
        "공덕동 원룸의 짐은 놀랄 만큼 적습니다. 형광펜 세 자루가 꽂힌 머그컵, 수트 여섯 벌, 그리고 상자 23개. 상자마다 그의 글씨로 ‘겨울옷_v3’, ‘주방_최종’, ‘책_최종_진짜최종’ 같은 이름이 붙어 있습니다. 현관문 안쪽에는 7월 7일 18시에 도어락 비밀번호를 바꾼다는 관리사무소 안내문이 붙어 있습니다. 12년을 일한 회사가 비밀번호 하나로 사람을 정리하는 셈입니다.",
        "이 일주일 동안 그룹은 신고한 사람을 최대한 비싸게 만들려 합니다. 앞으로는 안양 수선집 벽에 걸린 사원증 액자, 시루떡을 들고 찾아오는 문가을, 그리고 입회인 칸이 비어 있는 합의서가 기다립니다. 당신은 지금 윤상혁 대표 아래 KD캐피탈 위험관리부에 있습니다. 그 자리에서 백아린의 곁과 신고의 절차, 합의의 값 가운데 무엇을 먼저 지킬지 정해야 합니다.",
      ],
      cast: [
        { name: "백아린", note: "그룹에서 12년을 일한 차장이자 이제는 공익신고자입니다. 무거운 말도 숫자와 농담에 실어 가볍게 말하는 사람입니다." },
        { name: "강태민", note: "플로우온 물류센터 야간조 반장 출신으로, 짐 앞에서는 누구보다 먼저 손이 나갑니다. 상자 23개 가운데 무엇이 ‘진짜 최종’인지부터 묻습니다." },
        { name: "권도현", note: "브릿지은행 심사역. 무엇이든 비교표로 정리하는 사람답게, 이사 견적 세 건을 나란히 놓고 따지는 중입니다." },
      ],
      question: "신고자를 고소하는 것은 이기려는 게 아니라 버티지 못하게 하려는 것일지도 모릅니다. 보호는 법에 있지만 버티는 시간은 사람이 감당할 때, 당신은 누구 곁에 어떻게 설까요?",
    },
    en: {
      setting: "2026, late June · KD Capital, 12th floor → a group-housing studio in Gongdeok-dong → Yoonkyung Alterations, Anyang Central Market",
      premise: [
        "On June 19, Baek Arin files a whistleblower report (telling a public authority about wrongdoing inside a company) with the Financial Supervisory Service: 1,212 pages of material. The first page is the receipt record she handed you in March, the log of who received a document and when. The second page is the email that moved Box 27 out of the building two days before the raid.",
        "The group answers in three days, and in three lines. Disciplinary dismissal. A criminal complaint for leaking trade secrets (business information a company guards as confidential). And notice to vacate her company housing by 18:00 on July 7. The resignation she handed in on March 27 sat unaccepted for three months and has come back as a firing. Then she calls you. Could you help her pack? There are fewer people to ask than she thought. In percentage terms, close to zero.",
        "Her studio in Gongdeok-dong holds surprisingly little: a mug with three highlighters in it, six suits, and twenty-three boxes labeled in her handwriting, ‘WinterClothes_v3’, ‘Kitchen_final’, ‘Books_final_REALfinal’. Taped inside the front door is a notice from the management office: the door lock code changes at 18:00 on July 7. Twelve years at the company, tidied away with a single code.",
        "For one week, the group sets out to make reporting as expensive as possible. Ahead lie a framed staff ID on the wall of a tailor’s shop in Anyang, Moon Gaeul arriving with steamed rice cake, and a settlement with an empty witness line. You now work in KD Capital’s risk management department, under CEO Yoon Sanghyuk. From that seat you decide what to protect first: Baek Arin herself, the reporting process, or the price of a settlement.",
      ],
      cast: [
        { name: "Baek Arin", note: "A deputy manager with twelve years at the group, and now a whistleblower. She carries heavy things lightly, in numbers and jokes." },
        { name: "Kang Taemin", note: "A former night-shift lead at FlowOn’s fulfillment center, always the first to reach for a box. He starts by asking which of the twenty-three is really final." },
        { name: "Kwon Dohyun", note: "A credit reviewer at Bridge Bank who turns everything into a comparison table, including three quotes from moving companies." },
      ],
      question: "Suing a whistleblower may not be about winning at all, but about making sure she cannot hold out. If protection lives in the law but the waiting falls on a person, whose side do you stand on, and how?",
    },
    ja: {
      setting: "2026年6月末 · KDキャピタル12階 → コンドク洞のグループ社宅ワンルーム → アニャン中央市場 ユンギョンお直し",
      premise: [
        "6月19日、ペク・アリンが金融監督院に公益通報(会社の中の不正を公的機関に知らせること)をします。資料は1,212ページ。一枚目は3月に彼女があなたに渡した受信記録(文書を誰がいつ受け取ったかが残る記録)、二枚目は家宅捜索の二日前に27番の箱を外へ持ち出した持ち出しメールです。",
        "グループの返事は三日後、たった三行で届きます。懲戒解雇。営業秘密(会社が秘密として守る経営情報)の漏洩容疑での刑事告訴。そして7月7日18時までに社宅を明け渡せという通知。3月27日に出した辞表は三か月受理されないまま、解雇になって戻ってきました。ペク・アリンから電話が来ます。荷造りを手伝ってもらえないか、呼べる人が思ったよりいない、パーセントで言えば0に近い、と。",
        "コンドク洞のワンルームの荷物は、驚くほど少ないものです。蛍光ペンが三本差さったマグカップ、スーツ六着、そして箱が23個。箱にはどれも彼女の字で「冬服_v3」「キッチン_最終」「本_最終_本当に最終」といった名前が付いています。玄関扉の内側には、7月7日18時にドアロックの暗証番号を変えるという管理事務所の案内。12年働いた会社が、暗証番号ひとつで人を片づけるのです。",
        "この一週間、グループは通報した人をできるだけ高くつかせようとします。この先には、アニャンのお直し屋の壁に掛かった社員証の額、シルトックを持って訪ねてくるムン・ガウル、そして立会人の欄が空いた合意書が待っています。あなたは今、ユン・サンヒョク代表の下、KDキャピタルのリスク管理部にいます。その席から、ペク・アリンのそばにいること、通報の手続き、合意の値段のうち、何を先に守るかを決めなければなりません。",
      ],
      cast: [
        { name: "ペク・アリン", note: "グループで12年働いた次長で、今は公益通報者です。重い話も、数字と冗談に乗せて軽く口にする人です。" },
        { name: "カン・テミン", note: "フローオン物流センターの元夜勤班長で、荷物を前にすると誰より先に手が出ます。23個の箱のどれが「本当に最終」なのかから尋ねます。" },
        { name: "クォン・ドヒョン", note: "ブリッジ銀行の審査役。何でも比較表にまとめる人らしく、引っ越しの見積もり三件を並べて比べています。" },
      ],
      question: "通報者を告訴するのは、勝つためではなく、持ちこたえられなくするためかもしれません。保護は法にあっても、耐える時間は人が背負うとき、あなたは誰のそばに、どう立ちますか。",
    },
  },

  case34: {
    ko: {
      setting: "2026년 여름 · 회기동 헌책방 1층 → 신촌 대학원 연구동 공동 연구실 → 평창동 윤상혁의 서재",
      premise: [
        "모르는 번호로 사진 한 장이 옵니다. 보낸 사람은 윤상혁의 딸 윤서진, 금융윤리를 공부하는 대학원생입니다. 아버지 서재에서 2023년 수첩을 찾았고, 아버지를 지키고 싶어서 보낸다고 합니다. 검은 가죽 수첩의 한 쪽에는 만년필 글씨로 짧게 적혀 있습니다. ‘0412 — 반대 의견 — 보관 X.’ 3년 전 당신이 쓴 반대 의견의 번호입니다.",
        "회기동 헌책방 1층에서 반재욱이 화면을 한참 들여다봅니다. 7년 동안 그 글씨로 된 쪽지를 받아 왔으니, 윤상혁 본인의 필체가 맞다고 합니다. 이민서는 다른 점을 짚습니다. 지키고 싶다는 사람이 가장 불리한 줄을 가장 먼저 보냈다는 것. 이건 함정이거나, 아주 진심이거나 둘 중 하나라고요. 윤서진의 조건은 하나입니다. 수첩은 직접 만나서만 보여 주겠다는 것.",
        "신촌 대학원 연구실, 모니터 위에 그의 논문 제목이 붙어 있습니다. 「서명하지 않은 결정은 누구의 것인가」. 수첩에는 날짜마다 두세 줄씩 적혀 있습니다. 4월 넷째 주 목요일 칸에 문제의 한 줄이 있고, 바로 다음 날 칸에는 어머니의 갤러리 개관과 자기 등록금 이야기가 적혀 있습니다. 윤서진이 그 줄을 손끝으로 가리며 말합니다. 아버지를 지키려면 이 줄까지 읽혀야 하는 건지 모르겠다고.",
        "검사는 모레 오전 10시까지 수첩이 나오지 않으면 딸을 부르겠다고 합니다. 이 사건에서 당신이 정하는 것은 증거를 손에 넣을지 말지가 아닙니다. 그 기록을 누구의 손으로, 어떤 순서로 세상에 내보낼지, 그리고 그 과정에서 딸을 도구로 쓰지 않을 수 있는지입니다.",
      ],
      cast: [
        { name: "윤서진", note: "윤상혁의 딸이자 금융윤리 석사과정 대학원생. 아버지를 지키고 싶다며, 가장 불리한 한 줄을 먼저 보내온 사람입니다." },
        { name: "반재욱", note: "KD금융그룹 감사팀 조사역. 윤상혁 밑에서 7년 동안 쪽지를 받아 온 사람이라, 그 필체를 누구보다 잘 압니다." },
        { name: "이민서", note: "KD데이터랩 데이터사업팀 소속이자 전 트리거랩 데이터 기록 담당. 사진 한 장에서도 보낸 순서부터 읽어 냅니다." },
        { name: "윤상혁", note: "KD캐피탈 대표이사. 수첩의 주인이며, 이 사건에서는 자리에 없는 채로 글씨로만 등장합니다." },
      ],
      question: "가족의 기록을 낸 사람은 두 번 다친다고 합니다. 한 번은 기록 때문에, 한 번은 그것을 낸 손 때문에. 그 손을 혼자 두지 않으면서 기록도 지키는 길이 있을까요?",
    },
    en: {
      setting: "2026, summer · Hoegi-dong Secondhand Bookshop → a shared lab at a Sinchon graduate school → Yoon Sanghyuk’s study in Pyeongchang-dong",
      premise: [
        "A photo arrives from an unknown number. The sender is Yoon Seojin, Yoon Sanghyuk’s daughter, a graduate student in financial ethics. She found a 2023 notebook in her father’s study and wants to protect him, she writes. On one page of the black leather notebook, in fountain pen, is a single short entry: ‘0412 — dissent — retain: X.’ That number is the dissent you wrote three years ago.",
        "On the ground floor of the Hoegi-dong Secondhand Bookshop, Ban Jaewook stares at the screen. He received notes in that hand for seven years; it is Yoon Sanghyuk’s own writing. Lee Minseo points out something else: the person who wants to protect him sent the most damaging line first. Either it is a trap, or it is completely sincere. Yoon Seojin has one condition. She will show the notebook only in person.",
        "In a shared lab at a graduate school in Sinchon, her thesis title is taped above the monitor: “Whose Is the Decision No One Signed?” The notebook holds two or three lines for each date. The line in question sits on a Thursday in the fourth week of April; the very next day mentions her mother’s gallery opening and her own tuition. Yoon Seojin covers that line with a fingertip. She wants to protect her father, she says, but she does not know whether that means even this line has to be read.",
        "The prosecutor says that if the notebook is not handed in by 10 a.m. the day after tomorrow, he will summon the daughter. What you decide here is not whether to get the evidence. It is whose hands bring that record into the world, in what order, and whether you can do it without using a daughter as a tool.",
      ],
      cast: [
        { name: "Yoon Seojin", note: "Yoon Sanghyuk’s daughter, a master’s student in financial ethics. She says she wants to protect her father, and sent the most damaging line first." },
        { name: "Ban Jaewook", note: "An investigator on KD Financial Group’s audit team who took notes from Yoon Sanghyuk for seven years and knows his handwriting better than anyone." },
        { name: "Lee Minseo", note: "On KD Data Lab’s data business team, formerly Trigger Lab’s records keeper. Even in a single photo, she reads the order things were sent in." },
        { name: "Yoon Sanghyuk", note: "CEO of KD Capital and the notebook’s owner. Here he appears only as handwriting." },
      ],
      question: "They say whoever hands over a family member’s record gets hurt twice: once by the record, once by the hand that gave it. Is there a way to protect the record without leaving that hand alone?",
    },
    ja: {
      setting: "2026年夏 · フェギ洞の古本屋 1階 → シンチョンの大学院研究棟 共同研究室 → ピョンチャン洞 ユン・サンヒョクの書斎",
      premise: [
        "知らない番号から写真が一枚届きます。送り主はユン・サンヒョクの娘ユン・ソジン、金融倫理を学ぶ大学院生です。父の書斎で2023年の手帳を見つけた、父を守りたくて送る、とあります。黒い革の手帳の一ページには、万年筆の字で短くこう書かれています。「0412 — 反対意見 — 保管X。」3年前、あなたが書いた反対意見の番号です。",
        "フェギ洞の古本屋の1階で、パン・ジェウクが長いあいだ画面を見つめます。7年間あの字のメモを受け取ってきたから、ユン・サンヒョク本人の筆跡に間違いない、と。イ・ミンソは別の点を指摘します。守りたいという人が、いちばん不利な一行を真っ先に送ってきた。これは罠か、本気の本気か、どちらかだと。ユン・ソジンの条件はひとつ。手帳は直接会ったときだけ見せる、ということです。",
        "シンチョンの大学院の研究室、モニターの上に彼女の論文の題名が貼ってあります。「署名しなかった決定は誰のものか」。手帳には日付ごとに二、三行ずつ。4月第4週の木曜日の欄に問題の一行があり、そのすぐ翌日の欄には、母のギャラリーの開館と自分の学費のことが書かれています。ユン・ソジンはその行を指先で隠して言います。父を守るために、この行まで読まれなければならないのか分からない、と。",
        "検事は、あさっての午前10時までに手帳が出てこなければ娘を呼ぶと言っています。この事件であなたが決めるのは、証拠を手に入れるかどうかではありません。その記録を誰の手で、どんな順番で世に出すのか。そしてその過程で、娘を道具にせずにいられるのか、です。",
      ],
      cast: [
        { name: "ユン・ソジン", note: "ユン・サンヒョクの娘で、金融倫理専攻の修士課程の大学院生。父を守りたいと言いながら、いちばん不利な一行を先に送ってきた人です。" },
        { name: "パン・ジェウク", note: "KD金融グループ監査チームの調査役。ユン・サンヒョクの下で7年間メモを受け取ってきたので、その筆跡を誰よりよく知っています。" },
        { name: "イ・ミンソ", note: "KDデータラボのデータ事業チーム所属で、元トリガーラボのデータ記録担当。写真一枚からでも、送られた順番を読み取ります。" },
        { name: "ユン・サンヒョク", note: "KDキャピタル代表取締役で、手帳の持ち主。この事件では姿を見せず、字だけで登場します。" },
      ],
      question: "家族の記録を出した人は二度傷つくといいます。一度は記録のせいで、もう一度はそれを出した手のせいで。その手をひとりにせず、記録も守る道はあるのでしょうか。",
    },
  },

  case35: {
    ko: {
      setting: "2026년 7월, 장마 · KD캐피탈 위험관리부 상황판 → 망원시장 떡방 골목 → 인천 남동공단 끝까지정밀",
      premise: [
        "주말부터 나흘째 이어진 장맛비가 오늘 밤 시간당 110mm로 굵어집니다. KD캐피탈 위험관리부 상황판에서 서울 서부와 인천 남동부가 붉게 번져 갑니다. 먼저 걸려 온 것은 도윤하의 전화입니다. 망원시장 골목에 물이 발목까지 찼고, 가을떡방의 문가을 사장이 떡 기계 전원부터 뽑고 있다고 합니다. 인천의 끝까지정밀은 배수구가 또 막혀, 선반 여섯 대가 있는 공장 셔터 밑으로 흙탕물이 밀려듭니다.",
        "지점 문자함에는 벌써 수해 긴급 대출 문의가 쌓이고 있습니다. 그런데 그 대출은 이제 사람이 아니라 AI 심사 엔진(대출 신청을 자동으로 판단하는 인공지능 프로그램) 노아가 봅니다. 그리고 노아는 물에 잠겼다는 바로 그 이유로 수해 대출을 거절하기 시작합니다.",
        "망원시장에서는 상인회 총무 안기범이 휴대폰 라이브 방송을 켠 채 모래주머니 300개가 왔다고 외칩니다. 권도현은 철물점에 남은 마지막 장화, 분홍 꽃무늬 240mm를 신고 나타나 계산은 물이 빠진 뒤에 하겠다고 합니다. 문제는 300개로는 한 곳만 막을 수 있다는 것입니다. 어르신 가게 11곳이 몰린 가장 낮은 골목, 시장 전체 냉장고 전원이 모인 지하 전기실, 큰길 쪽 가게 20곳이 늘어선 입구. 물은 10분에 한 뼘씩 오릅니다.",
        "물에 잠긴 사람들을 물에 잠겼다는 이유로 거절하는 기계 앞에서, 당신은 한 건씩 사람이 뒤집을지, 기준 자체를 늦게라도 바꿀지, 피해 사진을 넘기고 빨리 돈을 풀지 정해야 합니다. 그리고 그 거절이 어디서 배운 것인지도 물어야 합니다.",
      ],
      cast: [
        { name: "도윤하", note: "KD은행 강서지점 창구 직원이자 전 트리거랩 현장 담당. 숫자보다 사람 이름을 먼저 떠올리는 사람입니다." },
        { name: "안기범", note: "망원시장 상인회 총무이자 기범청과 2대 사장. 라이브 방송을 켠 채 시장 사람들을 불러 모읍니다." },
        { name: "권도현", note: "브릿지은행 심사역. 분홍 꽃장화를 신고 모래주머니를 나르면서도, 계산은 물이 빠진 뒤로 미뤄 둡니다." },
        { name: "문가을", note: "망원시장 가을떡방 사장. 물이 들어오자 가장 먼저 떡 기계 전원부터 뽑습니다." },
      ],
      question: "재난 앞의 거절은 과거의 거절을 배워서 나옵니다. 그 이유의 이유를 끝까지 묻는 사람은 누구여야 하고, 그 결과를 뒤집는 손은 누구의 것이어야 할까요?",
    },
    en: {
      setting: "2026, July, monsoon · KD Capital risk management situation board → the rice cake alley, Mangwon Market → To-the-End Precision, Namdong Industrial Complex, Incheon",
      premise: [
        "The monsoon rain has fallen for four days since the weekend, and tonight it thickens to 110mm an hour. On the situation board in KD Capital’s risk management department, western Seoul and southeastern Incheon bleed red. Do Yoonha calls first. The alleys of Mangwon Market are ankle-deep, and Moon Gaeul of Gaeul Rice Cake Shop is pulling the plugs on her rice cake machines. At To-the-End Precision in Incheon the drain is blocked again, and muddy water is pushing in under the shutter of a factory with six lathes.",
        "The branch inbox is already filling with questions about emergency flood loans. But those loans are no longer reviewed by people. They go to NOAH, the AI review engine (a program that judges loan applications automatically). And NOAH starts turning flood loans down for the very reason that the applicants are under water.",
        "In Mangwon Market, Ahn Gibeom, secretary of the merchants’ association, is shouting into a live stream that 300 sandbags have arrived. Kwon Dohyun shows up in the last pair of rain boots the hardware store had, pink and flowered, size 240mm, and says he will do the sums once the water is gone. The trouble is that 300 sandbags can protect only one place: the lowest alley, where eleven elderly owners keep their shops; the basement power room that feeds every fridge and freezer in the market; or the entrance, with twenty shops along the main road. The water rises a hand’s width every ten minutes.",
        "Facing a machine that rejects drowning people for drowning, you decide whether people overturn its answers one by one, whether the rule itself is changed, however late, or whether photos of the damage are handed over so money moves fast. You also have to ask where that rejection was learned.",
      ],
      cast: [
        { name: "Do Yoonha", note: "A teller at KD Bank’s Gangseo Branch and Trigger Lab’s former field officer. She thinks of people’s names before numbers." },
        { name: "Ahn Gibeom", note: "Secretary of the Mangwon Market merchants’ association and second-generation owner of Gibeom Produce, rallying the market on a live stream." },
        { name: "Kwon Dohyun", note: "A credit reviewer at Bridge Bank. Hauling sandbags in pink flowered boots, he puts the arithmetic off until the water drains." },
        { name: "Moon Gaeul", note: "Owner of Gaeul Rice Cake Shop in Mangwon Market. When the water comes, the first thing she saves is the power to her machines." },
      ],
      question: "Rejections in a disaster are learned from past rejections. Who should keep asking for the reason behind the reason, and whose hand should overturn the result?",
    },
    ja: {
      setting: "2026年7月、梅雨 · KDキャピタル リスク管理部の状況板 → マンウォン市場 餅房の路地 → インチョン ナムドン工業団地 クッカジ精密",
      premise: [
        "週末から四日続く梅雨の雨が、今夜は時間あたり110mmに強まります。KDキャピタルのリスク管理部の状況板で、ソウル西部とインチョン南東部が赤く広がっていきます。最初にかかってきたのはト・ユナからの電話です。マンウォン市場の路地は水が足首まで来ていて、ガウル餅房のムン・ガウル社長が餅の機械の電源から抜いているといいます。インチョンのクッカジ精密では排水口がまた詰まり、旋盤六台のある工場のシャッターの下から泥水が押し寄せています。",
        "支店のメッセージ箱には、もう水害緊急融資の問い合わせがたまっています。ところがその融資を見るのは、今や人ではなくAI審査エンジン(融資の申し込みを自動で判断する人工知能プログラム)のNOAHです。そしてNOAHは、水に浸かったというまさにその理由で、水害融資を断り始めます。",
        "マンウォン市場では、商人会総務のアン・ギボムが携帯のライブ配信をつけたまま、土のう300個が届いたと叫んでいます。クォン・ドヒョンは金物屋に残っていた最後の長靴、ピンクの花柄の240mmを履いて現れ、計算は水が引いてからにすると言います。問題は、300個では一か所しか守れないことです。お年寄りの店11軒が集まるいちばん低い路地、市場じゅうの冷蔵庫の電源が集まる地下の電気室、大通り側に店20軒が並ぶ入口。水は10分ごとに手のひらひとつ分ずつ上がっていきます。",
        "水に浸かった人々を、水に浸かったという理由で断る機械を前に、あなたは一件ずつ人がひっくり返すのか、遅れてでも基準そのものを変えるのか、被害の写真を渡して早くお金を出すのかを決めなければなりません。そして、その拒絶がどこで学ばれたのかも問わなければなりません。",
      ],
      cast: [
        { name: "ト・ユナ", note: "KD銀行カンソ支店の窓口担当で、元トリガーラボの現場担当。数字より先に、人の名前を思い浮かべる人です。" },
        { name: "アン・ギボム", note: "マンウォン市場商人会の総務で、ギボム青果の二代目社長。ライブ配信をつけたまま、市場の人たちを呼び集めます。" },
        { name: "クォン・ドヒョン", note: "ブリッジ銀行の審査役。ピンクの花柄の長靴で土のうを運びながら、計算は水が引くまで後回しにします。" },
        { name: "ムン・ガウル", note: "マンウォン市場のガウル餅房の社長。水が入ってくると、真っ先に餅の機械の電源を抜きます。" },
      ],
      question: "災害を前にした拒絶は、過去の拒絶を学んで生まれます。その理由の理由を最後まで問うのは誰で、結果をひっくり返す手は誰のものであるべきでしょうか。",
    },
  },

  case36: {
    ko: {
      setting: "2026년 7월 26일 일요일 · KD캐피탈 위험관리부 → 한남동 회장 자택 정원 → 열두 자리 식탁",
      premise: [
        "카드 한 장이 옵니다. ‘일요일 19시, 한남동. 밥이나 한 끼 하지. 서도경.’ KD금융그룹 회장의 초대입니다. 같은 날 오전, 윤상혁은 해온파트너스 자문료(조언값이라며 내보낸 돈) 건으로 배임(맡은 일을 저버려 회사에 손해를 끼친 죄) 혐의 두 번째 검찰 소환을 받습니다. 당신은 같은 사건의 검찰 참고인입니다.",
        "1층에서는 대기발령(맡은 일 없이 다음 자리를 기다리게 하는 인사 조치) 중인 한서윤이 아이스커피 두 잔을 들고 기다립니다. 그는 카드를 보자마자 회장 글씨가 아니라 비서실장 여민규의 글씨라고 말합니다. 그리고 그 식탁에 불려 가는 사람은 두 종류라고 덧붙입니다. 자리를 받는 사람과, 자리를 비워 주는 사람.",
        "강태민의 1톤 트럭이 한남동 대문 앞에 멈춥니다. 그는 컵라면 두 개를 들고 밖에서 기다리겠다고 합니다. 정원의 61년 된 감나무 아래, 밀짚모자를 쓴 노인이 사다리에 올라 가지를 치고 있습니다. 정원사인 줄 알았던 그가 사다리를 좀 잡아 달라고 합니다. 아버지가 심은 나무라 남에게 맡길 수 없다면서요. 서도경 회장입니다. 그는 가위질 사이로 열흘 전 비에 잠긴 망원시장 떡집 안부부터 묻고, 회사는 사람이 아니라 기억으로 굴러간다고 말합니다.",
        "식탁에 앉기까지 30분. 그 뒤에는 이름을 아무도 못 외우는 요리 아홉 접시와 하나의 제안이 기다립니다. 윤상혁 한 사람에게 모든 책임을 지우고 개혁 완료를 선언하자는 것, 그리고 그 대가로 준법감시인(회사가 법과 규정을 지키는지 안에서 감시하는 책임자) 자리를 주겠다는 것입니다. 당신은 그 자리를 받을지, 조건을 걸지, 거절하고 끝까지 갈지 정해야 합니다.",
      ],
      cast: [
        { name: "서도경", note: "KD금융그룹 회장. 아버지가 심은 감나무를 직접 손질하고, 아랫사람의 동네 소식까지 먼저 꺼낼 만큼 많은 것을 기억합니다." },
        { name: "한서윤", note: "대기발령 중인 전 트리거랩 실장. 카드의 글씨 하나로 누가 이 초대를 보냈는지부터 읽어 냅니다." },
        { name: "강태민", note: "당신을 한남동까지 태워다 준 1톤 트럭의 주인. 대문 안에는 들어가지 않고 컵라면 두 개와 함께 기다립니다." },
        { name: "윤상혁", note: "KD캐피탈 대표이사. 오늘 오전 두 번째 검찰 소환을 받았고, 이 식탁의 제안에서 이름이 오르내리는 사람입니다." },
      ],
      question: "이름 하나로 닫힌 사건은 같은 모양으로 다시 열린다고 합니다. 서명하지 않는 사람이 차린 식탁에서, 결정한 사람의 이름은 어디에 적혀야 할까요?",
    },
    en: {
      setting: "2026, Sunday, July 26 · KD Capital risk management → the chairman’s garden in Hannam-dong → a table set for twelve",
      premise: [
        "A card arrives: ‘Sunday, 19:00, Hannam-dong. Let’s have a meal. Seo Dokyung.’ An invitation from KD Financial Group’s chairman. That same morning, Yoon Sanghyuk receives his second prosecutors’ summons on charges of breach of trust (betraying a duty and causing the company a loss) over the Haeon Partners advisory fees (money paid out as the price of advice). You are a witness in that very case.",
        "Down on the 1st floor, Han Seoyun, on standby assignment (left without duties while waiting for a next post), is waiting with two iced coffees. One look at the card and she says it is not the chairman’s handwriting but that of his chief of staff, Yeo Minkyu. Two kinds of people get called to that table, she adds: the ones who get a seat, and the ones who give one up.",
        "Kang Taemin’s one-ton truck pulls up at the gate in Hannam-dong. He says he will wait outside with two cup noodles. Under a sixty-one-year-old persimmon tree, an old man in a straw hat stands on a ladder, pruning. You take him for the gardener until he asks you to hold the ladder. His father planted the tree; he leaves it to no one else. It is Chairman Seo Dokyung. Between snips, he asks first after the rice cake shop in Mangwon Market, flooded ten days ago, and remarks that a company runs on memory, not on people.",
        "Thirty minutes until you sit down. After that come nine dishes whose names no one can remember, and a proposal: put every bit of the blame on Yoon Sanghyuk alone, declare reform complete, and in return take the post of compliance officer (the person inside a company who watches whether it keeps the law and its rules). You decide whether to accept the seat, accept it on conditions, or refuse it and see this through.",
      ],
      cast: [
        { name: "Seo Dokyung", note: "Chairman of KD Financial Group. He prunes his father’s persimmon tree himself and remembers a great deal." },
        { name: "Han Seoyun", note: "Former head of Trigger Lab, now on standby assignment. From the handwriting alone, she reads who really sent the card." },
        { name: "Kang Taemin", note: "He drives you to Hannam-dong in his one-ton truck and waits outside the gate." },
        { name: "Yoon Sanghyuk", note: "CEO of KD Capital. Summoned by prosecutors for the second time this morning, and the name at the center of the offer." },
      ],
      question: "A case closed with one name, they say, opens again in the same shape. At a table set by someone who never signs, where should the name of the person who decided be written?",
    },
    ja: {
      setting: "2026年7月26日(日) · KDキャピタル リスク管理部 → ハンナム洞の会長宅の庭 → 十二人掛けの食卓",
      premise: [
        "カードが一枚届きます。「日曜19時、ハンナム洞。飯でも一緒にどうだ。ソ・ドギョン。」KD金融グループ会長からの招待です。同じ日の午前、ユン・サンヒョクはヘオン・パートナーズの顧問料(助言料として出したお金)の件で、背任(任された務めに背いて会社に損害を与える罪)容疑による二度目の検察の呼び出しを受けます。あなたは同じ事件の検察の参考人です。",
        "1階では、待機発令(仕事を外され、次の席を待たされる人事措置)中のハン・ソユンがアイスコーヒーを二つ持って待っています。彼女はカードを見るなり、会長の字ではなく秘書室長ヨ・ミンギュの字だと言います。そして、あの食卓に呼ばれる人は二種類だと付け加えます。席をもらう人と、席を空ける人。",
        "カン・テミンの1トントラックがハンナム洞の門の前に止まります。彼はカップ麺二つを手に、外で待つと言います。庭の樹齢61年の柿の木の下で、麦わら帽子の老人がはしごに上って枝を切っています。庭師だと思ったその人が、はしごを押さえてくれと言います。父が植えた木だから人には任せられない、と。ソ・ドギョン会長です。彼ははさみの音の合間に、十日前の雨で浸かったマンウォン市場の餅屋の様子をまず尋ね、会社は人ではなく記憶で回るのだと言います。",
        "食卓に着くまで30分。その先には、誰も名前を覚えられない料理九皿と、ひとつの提案が待っています。ユン・サンヒョクひとりにすべての責任を負わせて改革完了を宣言し、その見返りにコンプライアンス責任者(会社が法と規定を守っているかを内側から監視する責任者)の席を与えるというものです。あなたはその席を受けるのか、条件をつけるのか、断って最後まで行くのかを決めなければなりません。",
      ],
      cast: [
        { name: "ソ・ドギョン", note: "KD金融グループ会長。父が植えた柿の木を自ら手入れし、部下の街の出来事まで先に口にするほど、多くを記憶しています。" },
        { name: "ハン・ソユン", note: "待機発令中の元トリガーラボ室長。カードの字ひとつで、この招待を本当に書いたのが誰かを読み取ります。" },
        { name: "カン・テミン", note: "あなたをハンナム洞まで乗せてきた1トントラックの持ち主。門の中には入らず、カップ麺二つと一緒に待っています。" },
        { name: "ユン・サンヒョク", note: "KDキャピタル代表取締役。今朝二度目の検察の呼び出しを受け、この食卓の提案で名前が挙がる人です。" },
      ],
      question: "名前ひとつで閉じられた事件は、同じ形でまた開くといいます。署名しない人が用意した食卓で、決めた人の名前はどこに書かれるべきでしょうか。",
    },
  },

  case37: {
    ko: {
      setting: "2026년 7월 말, 열대야 · 망원동 옥상 → 회기동 헌책방 1층",
      premise: [
        "열대야의 새벽, 이민서의 목소리가 떨립니다. 걱정하던 그 폴더가 결국 전부 풀렸다고 합니다. 익명 커뮤니티 노바운드에 TL_full.zip이라는 이름으로 올라온 것은 트리거랩 반응 기록 전체, 38만 줄입니다. 참가자 63명이 선택할 때마다 몇 초를 망설였는지, 그게 몇 시였는지까지 고스란히 담겨 있습니다.",
        "이름은 가명 처리(누구인지 바로 알 수 없게 이름을 지운 것)가 되어 있습니다. 하지만 2023-0412에 반대 의견을 쓴 ‘분석관 A’가 누구인지 모르는 사람은 없습니다. 바로 당신입니다. 처음 올라온 지 세 시간, 조회 수는 벌써 11만이고, 그룹은 아직 아무 입장도 내지 않았습니다.",
        "회기동 헌책방 1층에서 이민서는 밤새 삭제 요청을 씁니다. 벌써 1,204건이지만 처리된 것은 37건뿐입니다. 사이트 대부분이 같은 답을 보냅니다. 정보 주체(기록의 주인인 사람)가 직접 요청해야 지울 수 있다는 것. 63명 가운데 오늘 밤 연락이 닿는 사람은 아홉, 나머지는 번호로만 남아 있습니다. 그 사이 복사본은 한 시간에 40곳씩 늘어납니다. 칼이 없다며 수박을 주먹으로 쪼갠 강태민 덕분에 잠깐 웃음이 나지만, 이민서가 화면을 돌리자 다시 조용해집니다. 이름을 걸어야 지워지는데, 이름을 걸면 그 사람이 몇 번 기록인지 자기가 밝히는 셈이라는 것입니다.",
        "이제 모두가 읽을 수 있게 된 기록은 누구의 것일까요. 당신은 63명의 기록을 지울지, 남길지, 증거로 쓸지를 그 기록의 주인들과 함께 정해야 합니다. 누가 흘렸는지, 누가 다치는지도 함께 따라옵니다.",
      ],
      cast: [
        { name: "이민서", note: "KD데이터랩 소속이자 전 트리거랩 데이터 기록 담당. 밤새 삭제 요청을 쓰면서도, 그 요청이 누군가를 드러낼 수 있다는 걸 가장 먼저 걱정합니다." },
        { name: "강태민", note: "새벽에 수박 한 통을 안고 나타나 칼 대신 주먹으로 쪼개는 사람. 무거운 밤에 잠깐 숨 쉴 틈을 만들어 줍니다." },
        { name: "분석관 A", note: "유출된 파일 속 가명. 2023-0412에 반대 의견을 쓴 사람, 즉 당신입니다. 선택마다 망설인 초가 그대로 적혀 있습니다." },
      ],
      question: "모두가 읽을 수 있게 된 기록이라도, 지울지 남길지는 그 기록 속 사람이 정해야 하지 않을까요? 그렇다면 연락조차 닿지 않는 사람의 몫은 누가 지켜야 할까요?",
    },
    en: {
      setting: "2026, late July, a tropical night · a rooftop in Mangwon-dong → Hoegi-dong Secondhand Bookshop",
      premise: [
        "In the small hours of a sweltering night, Lee Minseo’s voice is shaking. The folder she was worried about is out, all of it. On an anonymous community called NoBound, under the file name TL_full.zip, someone has posted the entire Trigger Lab response record: 380,000 lines. For each of the 63 participants it shows every choice, how many seconds they hesitated before making it, and the time it was made.",
        "The names are pseudonymized (removed so no one can tell at once who is who). But everyone knows who ‘Analyst A’ is, the one who wrote a dissent on 2023-0412. It is you. Three hours after the first post the view count has passed 110,000, and the group has not said a word.",
        "On the ground floor of the Hoegi-dong Secondhand Bookshop, Lee Minseo writes takedown requests through the night. She has sent 1,204; only 37 have been processed. Most sites send back the same answer: they can only delete a record if the data subject (the person it belongs to) asks directly. Of the 63, nine can be reached tonight; the rest are only numbers. Meanwhile, copies appear at forty new sites an hour. Kang Taemin arrives hugging a watermelon, finds no knife and splits it with his fist, and for a moment everyone laughs. Then Lee Minseo turns her screen around. A record only comes down if a person puts their name to the request, and if they do, she is the one revealing which record number they are.",
        "Who does a record belong to once anyone can read it? You decide, together with the people inside those records, whether each one should be erased, kept, or used as evidence. Close behind come other questions: who let it out, and who gets hurt.",
      ],
      cast: [
        { name: "Lee Minseo", note: "On KD Data Lab’s staff, formerly Trigger Lab’s records keeper. Writing takedown requests all night, her first fear is that a request could expose someone." },
        { name: "Kang Taemin", note: "Turns up before dawn with a whole watermelon and splits it with his fist, giving a heavy night one moment to breathe." },
        { name: "Analyst A", note: "The pseudonym in the leaked file for the person who dissented on 2023-0412, which is to say you. Every second you hesitated is on record." },
      ],
      question: "Even if anyone can now read a record, shouldn’t the person in it decide whether it is erased or kept? And who speaks for those no one can even reach?",
    },
    ja: {
      setting: "2026年7月末、熱帯夜 · マンウォン洞の屋上 → フェギ洞の古本屋 1階",
      premise: [
        "熱帯夜の明け方、イ・ミンソの声が震えています。心配していたあのフォルダが、結局すべて出回ってしまったというのです。匿名コミュニティのノーバウンドにTL_full.zipという名前で上がったのは、トリガーラボの反応記録の全部、38万行。参加者63人が選択のたびに何秒ためらったか、それが何時だったかまで、そっくり入っています。",
        "名前は仮名処理(誰なのかすぐにはわからないよう名前を消したもの)されています。けれど、2023-0412に反対意見を書いた「分析官A」が誰なのか、知らない人はいません。あなたです。最初に上がってから三時間で閲覧数はもう11万、グループはまだ何の見解も出していません。",
        "フェギ洞の古本屋の1階で、イ・ミンソは夜通し削除依頼を書きます。すでに1,204件、それでも処理されたのは37件だけです。ほとんどのサイトが同じ返事をよこします。情報主体(記録の持ち主である本人)が直接依頼しなければ消せない、と。63人のうち今夜連絡がつくのは九人、残りは番号だけが残っています。そのあいだにもコピーは1時間に40か所ずつ増えていきます。包丁がないと言ってスイカを拳で割ったカン・テミンのおかげで少し笑いが起きますが、イ・ミンソが画面をこちらに向けると、また静かになります。名前を出さなければ消えない、でも名前を出せば、その人が何番の記録なのかを自分が明かすことになる、というのです。",
        "誰もが読めるようになった記録は、いったい誰のものなのでしょう。あなたは63人の記録を消すのか、残すのか、証拠に使うのかを、記録の持ち主たちと一緒に決めなければなりません。誰が流したのか、誰が傷つくのかという問いも、すぐ後ろからついてきます。",
      ],
      cast: [
        { name: "イ・ミンソ", note: "KDデータラボ所属で、元トリガーラボのデータ記録担当。夜通し削除依頼を書きながら、その依頼が誰かをさらしてしまうことをいちばんに心配しています。" },
        { name: "カン・テミン", note: "明け方にスイカを一玉抱えて現れ、包丁の代わりに拳で割る人。重い夜に、ほんの少し息をつく隙間をつくります。" },
        { name: "分析官A", note: "流出したファイルの中の仮名。2023-0412に反対意見を書いた人、つまりあなたです。選択ごとにためらった秒数が、そのまま記されています。" },
      ],
      question: "誰もが読めるようになった記録でも、消すか残すかは、その記録の中の人が決めるべきではないでしょうか。では、連絡さえつかない人の分は、誰が守るのでしょう。",
    },
  },

  case38: {
    ko: {
      setting: "2026년 여름 · 망원시장 가을떡방 → 서울중앙지방법원 457호 법정",
      premise: [
        "오늘은 피해자 집단소송(피해자 여럿이 함께 내는 소송)의 첫날입니다. 오후 2시, 서울중앙지방법원 457호 법정에서 첫 변론(법정에서 양쪽이 주장과 증거를 내는 절차)이 열립니다. 원고는 1,740명, 원고 대표는 망원시장 가을떡방의 문가을입니다. 방청석은 72석인데, 오겠다는 시장 사람은 87명입니다.",
        "아침의 떡방, 공익 변호사 선재윤이 떡 상자 사이에 서류를 펼칩니다. 그룹 쪽 준비서면(재판 전에 주장을 정리해 법원에 내는 글)이 어젯밤 11시에 들어왔습니다. 대출 서류가 없는 212명은 원고 적격(소송을 낼 자격)이 없다는 주장입니다. 그리고 첨부 17번은 지난주 유출된 트리거랩 반응 기록, 당신의 망설임을 초 단위로 적은 표입니다. 문가을이 떡 칼을 내려놓으며 묻습니다. 이건 우리 재판인데 왜 당신 얘기를 하느냐고.",
        "법원 1층 보안 검색대에서 떡 마흔 상자가 멈추고, 강태민이 그 옆을 지킵니다. 2시 정각, 피고석에는 법무법인 도율의 변호사 여덟 명이 줄지어 앉습니다. 원고석에는 인턴도 없는 선재윤 한 명뿐입니다. 방청석의 권도현은 그들의 시간당 비용을 계산해 보고, 두 시간이면 번호표 38번 할머니의 청구액 1,200만 원보다 크다고 속삭입니다. 도율의 연서준 변호사는 부드럽게 일어나, 누구의 슬픔도 다투지 않는다며 212명에게는 대출과 이어진 서류가 한 장도 없다고 말합니다.",
        "법정은 서류로 사람을 셉니다. 당신은 서류 없는 212명을 원고로 지키고, 동의 없이 만들어진 기록이 당신의 증언을 깎는 데 쓰이는 것을 막으며, 재판을 나눌지 1,740명이 함께 갈지를 정해야 합니다.",
      ],
      cast: [
        { name: "문가을", note: "망원시장 가을떡방 사장이자 1,740명 원고의 대표. 재판이 자기 사람들의 이야기여야 한다고 믿습니다." },
        { name: "선재윤", note: "원고 측 대리인을 혼자 맡은 공익 변호사. 떡 상자 사이에서도 서류부터 펼칩니다." },
        { name: "연서준", note: "피고 측 법무법인 도율의 파트너 변호사. 목소리는 부드럽지만, 서류가 없는 사람을 셈에서 빼려 합니다." },
        { name: "권도현", note: "브릿지은행 심사역. 방청석에서도 상대 변호인단의 비용을 분 단위로 계산합니다." },
      ],
      question: "서류가 없는 사람을 법정이 세게 하려면, 서류를 가진 쪽이 그것을 내놓게 해야 합니다. 증명할 책임은 누구에게 있어야 할까요?",
    },
    en: {
      setting: "2026, summer · Gaeul Rice Cake Shop, Mangwon Market → Courtroom 457, Seoul Central District Court",
      premise: [
        "Today is the first day of the victims’ class action (a lawsuit filed jointly by many victims). At 2 p.m., in Courtroom 457 of the Seoul Central District Court, the first hearing (where both sides present their arguments and evidence) begins. There are 1,740 plaintiffs, and the lead plaintiff is Moon Gaeul of Gaeul Rice Cake Shop. The gallery has 72 seats; 87 people from the market say they are coming.",
        "That morning, public-interest lawyer Seon Jaeyoon spreads her papers out between boxes of rice cakes. The group’s brief (a written summary of a side’s arguments filed before trial) came in at 11 last night. It argues that the 212 plaintiffs with no loan papers have no standing (the right to bring the suit). And Attachment 17 is the Trigger Lab response record leaked last week: a table of your hesitations, down to the second. Moon Gaeul puts down her rice cake knife. This is our trial, she says. Why are they talking about you?",
        "Forty boxes of rice cakes are stopped at the security check on the first floor, and Kang Taemin stays to guard them. At two sharp, eight lawyers from Doyul Law file in to the defense table. Seon Jaeyoon sits alone for the plaintiffs, without even an intern. In the gallery, Kwon Dohyun whispers that two hours of their fees outweigh the 12 million won claimed by the grandmother with ticket No. 38. Doyul’s Yeon Seojun rises and says, gently, that they dispute no one’s grief; it is only that the 212 have not a single sheet of paper tied to a loan.",
        "A court counts people by their paperwork. You must keep the 212 without papers on the plaintiff list, stop a record made without anyone’s consent from being used to wear down your testimony, and decide whether the case should be split or all 1,740 should go forward together.",
      ],
      cast: [
        { name: "Moon Gaeul", note: "Owner of Gaeul Rice Cake Shop and lead plaintiff for 1,740 people. She believes this trial should be about her people." },
        { name: "Seon Jaeyoon", note: "A public-interest lawyer representing the plaintiffs on her own. Even among rice cake boxes, the papers come out first." },
        { name: "Yeon Seojun", note: "A partner at Doyul Law, counsel for the defendant. Gentle-voiced, he aims to count the paperless out." },
        { name: "Kwon Dohyun", note: "A Bridge Bank credit reviewer who prices the opposing lawyers by the minute, even from the gallery." },
      ],
      question: "For a court to count people who have no paperwork, the side that holds the paperwork has to hand it over. Who should carry the burden of proof?",
    },
    ja: {
      setting: "2026年夏 · マンウォン市場 ガウル餅房 → ソウル中央地方法院457号法廷",
      premise: [
        "今日は被害者による集団訴訟(多くの被害者が一緒に起こす訴訟)の初日です。午後2時、ソウル中央地方法院457号法廷で第1回弁論(法廷で双方が主張と証拠を出す手続き)が開かれます。原告は1,740人、原告代表はマンウォン市場ガウル餅房のムン・ガウルです。傍聴席は72席なのに、来ると言っている市場の人は87人います。",
        "朝の餅房で、公益弁護士のソン・ジェユンが餅の箱のあいだに書類を広げます。グループ側の準備書面(裁判の前に主張をまとめて裁判所に出す書面)が昨夜11時に届きました。融資の書類がない212人には原告適格(訴訟を起こす資格)がない、という主張です。そして添付17番は、先週流出したトリガーラボの反応記録、あなたのためらいを秒単位で記した表です。ムン・ガウルが餅切り包丁を置いて尋ねます。これは私たちの裁判なのに、なぜあなたの話をするのか、と。",
        "法院1階の保安検査場で餅四十箱が止められ、カン・テミンがそのそばで見張ります。2時ちょうど、被告席には法務法人トユルの弁護士八人がずらりと座ります。原告席には、インターンもいないソン・ジェユンひとりだけ。傍聴席のクォン・ドヒョンは相手の時間あたりの費用をはじき出し、二時間なら番号札38番のおばあさんの請求額1,200万ウォンより大きいとささやきます。トユルのヨン・ソジュン弁護士は穏やかに立ち上がり、誰の悲しみも争わない、ただ212人には融資とつながる書類が一枚もない、と述べます。",
        "法廷は書類で人を数えます。あなたは書類のない212人を原告として守り、同意なく作られた記録があなたの証言を削るのに使われるのを防ぎ、裁判を分けるのか、1,740人が一緒に進むのかを決めなければなりません。",
      ],
      cast: [
        { name: "ムン・ガウル", note: "マンウォン市場のガウル餅房の社長で、原告1,740人の代表。この裁判は自分の仲間たちの話であるべきだと信じています。" },
        { name: "ソン・ジェユン", note: "原告側の代理人をひとりで引き受けた公益弁護士。餅の箱のあいだでも、まず書類を広げます。" },
        { name: "ヨン・ソジュン", note: "被告側、法務法人トユルのパートナー弁護士。声は穏やかですが、書類のない人を数から外そうとします。" },
        { name: "クォン・ドヒョン", note: "ブリッジ銀行の審査役。傍聴席からでも、相手の弁護団の費用を分単位で計算します。" },
      ],
      question: "書類のない人を法廷に数えさせるには、書類を持つ側にそれを出させなければなりません。証明する責任は、誰が負うべきでしょうか。",
    },
  },

  case39: {
    ko: {
      setting: "2026년 여름 · 상암동 라온방송 3층 편집실",
      premise: [
        "집단소송의 첫 변론이 끝난 밤, 상암동 라온방송 3층 편집실. 서하린이 열한 달 동안 찍은 다큐멘터리 「서명하지 않은 사람들」의 90분 최종본이 모니터 네 대에 걸려 있습니다. 방송은 내일 금요일 밤 10시입니다.",
        "책임 프로듀서 공병만이 A4 한 장을 들고 들어옵니다. KD카드, KD생명, KD캐피탈, 세 계열사(같은 그룹에 속한 다른 회사)가 내일 밤 광고 14개를 모두 빼겠다는 통보입니다. 함께 온 ‘참고 의견’에는 타임코드(영상의 몇 분 몇 초인지 적은 번호) 두 줄만 적혀 있습니다. 4부 전체와 5부의 6분, 정확히 20분입니다. 자르라는 말은 아무도 하지 않았습니다. 다만 내일 아침 10시까지 70분짜리로 납품하지 않으면 결방(예정된 방송이 안 나가는 것)이라고 합니다.",
        "편집 감독 엄동균이 타임라인의 그 20분을 빨갛게 칠합니다. 14분은 4부 「식탁」, 회장의 식탁에서 나온 제안을 증언 셋과 문서 두 장으로 다시 짜 맞춘 대목입니다. 나머지 6분은 트리거랩 반응 기록이 핏스코어로 팔려 간 계약서입니다. 권도현은 광고 14개 값 2억 3천만 원을 20분으로 나눠, 1초에 19만 원이라고 계산합니다. 엄동균은 웃지 않습니다. 이 20분을 빼면 회장의 이름은 한 번도 나오지 않고, 남는 이야기는 ‘나쁜 사람이 한 명 있었다’ 하나뿐이라는 것입니다. 당신의 인터뷰도 22분 들어 있습니다.",
        "아침 10시 납품까지 남은 시간은 하룻밤입니다. 당신은 광고가 가리킨 20분과, 화면에 얼굴을 건 인터뷰이들 사이에서 무엇을 방송에 남기고 누구의 얼굴을 가릴지 정해야 합니다.",
      ],
      cast: [
        { name: "서하린", note: "열한 달 동안 이 다큐멘터리를 찍은 사람. 중요한 말을 들으면 받아 적기보다 녹음 버튼부터 확인합니다." },
        { name: "공병만", note: "라온방송 시사제작국의 26년 차 책임 프로듀서. ‘자르라는 말은 아무도 안 했다’는 종이 한 장을 들고 옵니다." },
        { name: "엄동균", note: "라온방송 9년 차 편집 감독. 잘리면 무엇이 사라지는지 가장 정확히 아는 사람입니다." },
        { name: "권도현", note: "브릿지은행 심사역. 이 다큐에서 가장 비싼 20분의 값을 초 단위로 계산해 냅니다." },
      ],
      question: "잘리는 것은 대개 나쁜 사람의 얼굴이 아니라 조직이 결정한 방식입니다. 무엇을 안 보여 줄지 고르는 일에도 서명란이 있다면, 그 칸에는 누구의 이름이 들어가야 할까요?",
    },
    en: {
      setting: "2026, summer · editing suite, 3rd floor, Raon Broadcasting, Sangam-dong",
      premise: [
        "It is the night after the class action’s first hearing, in the third-floor editing suite of Raon Broadcasting in Sangam-dong. On four monitors runs the 90-minute final cut of “The Unsigned,” the documentary Seo Harin has spent eleven months filming. It airs tomorrow, Friday, at 10 p.m.",
        "Executive producer Gong Byungman comes in holding a single sheet of A4. Three group affiliates (companies in the same group), KD Card, KD Life and KD Capital, are pulling all fourteen of their ads from tomorrow night. Attached is a ‘reference opinion’ that contains nothing but two lines of timecode (the minute-and-second address of a stretch of video): all of Part 4 and six minutes of Part 5. Exactly twenty minutes. Nobody has said to cut anything. But if a 70-minute version is not delivered by 10 tomorrow morning, the show will be pulled.",
        "Editor Eom Donggyun paints those twenty minutes red on the timeline. Fourteen are Part 4, “The Table,” which rebuilds the proposal made at the chairman’s table from three testimonies and two documents. The other six are the contract under which Trigger Lab’s response records were sold to FitScore. Kwon Dohyun divides the 230 million won those fourteen ads are worth by twenty minutes: 190,000 won a second. Eom Donggyun does not laugh. Without those twenty minutes, he says, the chairman’s name never comes up at all, and only one story is left: there was one bad man. Your own interview runs twenty-two minutes.",
        "One night stands between you and the 10 a.m. delivery. Between the twenty minutes the advertisers pointed at and the faces of everyone who agreed to appear on screen, you decide what stays on air and whose face gets blurred.",
      ],
      cast: [
        { name: "Seo Harin", note: "She filmed this documentary for eleven months. When she hears something important, she checks the record button before she reaches for a pen." },
        { name: "Gong Byungman", note: "Executive producer in Raon Broadcasting’s current affairs department, twenty-six years in. He brings a sheet of paper on which nobody said to cut." },
        { name: "Eom Donggyun", note: "Raon Broadcasting’s editing director, nine years in, and the person who knows most exactly what disappears with a cut." },
        { name: "Kwon Dohyun", note: "A credit reviewer at Bridge Bank who prices the documentary’s most expensive twenty minutes by the second." },
      ],
      question: "What gets cut is usually not a bad person’s face but the way an organization decided. If choosing what not to show has a signature field too, whose name belongs in it?",
    },
    ja: {
      setting: "2026年夏 · サンアム洞 ラオン放送 3階編集室",
      premise: [
        "集団訴訟の第1回弁論が終わった夜、サンアム洞のラオン放送3階の編集室。ソ・ハリンが十一か月かけて撮ったドキュメンタリー『署名しなかった人たち』の90分の最終版が、モニター四台に映っています。放送は明日、金曜の夜10時です。",
        "責任プロデューサーのコン・ビョンマンが、A4一枚を手に入ってきます。KDカード、KD生命、KDキャピタルの系列会社(同じグループに属する別の会社)三社が、明日の夜の広告14本をすべて引き上げるという通告です。一緒に届いた「参考意見」には、タイムコード(映像の何分何秒かを示す番号)が二行あるだけ。第4部の全部と第5部の6分、ちょうど20分です。切れとは誰も言っていません。ただ、明日の朝10時までに70分版を納品しなければ、放送休止になるといいます。",
        "編集監督のオム・ドンギュンが、タイムラインのその20分を赤く塗ります。14分は第4部「食卓」、会長の食卓で出た提案を、証言三つと文書二枚で組み立て直したくだりです。残りの6分は、トリガーラボの反応記録がフィットスコアに売られた契約書です。クォン・ドヒョンは広告14本分の2億3千万ウォンを20分で割り、1秒19万ウォンだと計算します。オム・ドンギュンは笑いません。この20分を抜けば会長の名前は一度も出てこず、残る話は「悪い人がひとりいた」だけになる、と。あなたのインタビューも22分入っています。",
        "朝10時の納品まで、残りは一晩です。あなたは広告が指し示した20分と、画面に顔を出したインタビュー相手たちのあいだで、何を放送に残し、誰の顔を隠すのかを決めなければなりません。",
      ],
      cast: [
        { name: "ソ・ハリン", note: "このドキュメンタリーを十一か月かけて撮った人。大事な話を聞くと、書き留めるより先に録音ボタンを確かめます。" },
        { name: "コン・ビョンマン", note: "ラオン放送時事制作局の26年目の責任プロデューサー。「切れとは誰も言っていない」紙を一枚持ってきます。" },
        { name: "オム・ドンギュン", note: "ラオン放送の9年目の編集監督。切られたら何が消えるのかを、いちばん正確に知っている人です。" },
        { name: "クォン・ドヒョン", note: "ブリッジ銀行の審査役。このドキュメンタリーでいちばん高い20分の値段を、秒単位で割り出します。" },
      ],
      question: "切られるのはたいてい悪い人の顔ではなく、組織が決めたやり方です。何を見せないかを選ぶことにも署名欄があるなら、そこには誰の名前が入るべきでしょうか。",
    },
  },

  case40: {
    ko: {
      setting: "2026년 여름 · 망원시장 가을떡방 → 성수동 핏스코어 시연 회의실",
      premise: [
        "문하준이 휴대폰 화면을 내밉니다. 베이커리 카페 르방하우스 망원점 주말 아르바이트의 탈락 통보입니다. 조직 적합도(사람이 회사에 얼마나 잘 맞을지 매긴 점수) 41점, 면접 기준인 60점에 못 미쳤다는 내용입니다. ‘AI 면접’이라고 했지만 사람은 한 명도 나오지 않았고, 시험은 12분짜리 게임형 역량검사(게임처럼 풀게 하면서 반응을 재는 채용 시험)뿐이었습니다. 엄마 몰래 수시 원서비 38만 원을 벌려던 계획이었는데, 무엇이 안 맞는지는 아무도 알려 주지 않습니다.",
        "그 검사를 만든 회사는 핏스코어입니다. 트리거랩 반응 기록을 사 간 바로 그 회사입니다. 성수동 핏스코어 시연 회의실에서 대표 홍예담은 의심되면 직접 해 보라며 태블릿을 내밉니다. 먼저 앉은 강태민도 41점을 받습니다. 사유는 리더십 부족, 팀 과제에서 동료 아바타의 짐까지 혼자 옮겼다는 것입니다.",
        "홍예담은 웃다가 진지해집니다. 그는 부산 사투리 때문에, 웃는 얼굴이 어색하다는 이유로 면접에서 21번 떨어졌다고 말합니다. 숫자는 사투리를 모른다는 것이 그가 이 회사를 만든 이유입니다. 핏스코어를 쓰는 기업은 138곳, 올해 응시자는 6만 2천 명, 60점 미만으로 자동 탈락한 사람은 9,412명입니다. 그런데 알고리즘(판단 순서를 정해 둔 계산 규칙) 설명서를 넘기던 그의 손이 학습 데이터(인공지능이 판단을 배우는 데 쓴 자료) 출처 칸에서 멈춥니다. ‘제공처: KD데이터랩.’",
        "이 모델이 가장 크게 감점하는 것은 망설임이고, 부적합의 기준점은 당신의 기록입니다. 당신은 떨어진 9,412명을 사람이 다시 만나게 할지, 점수의 계산법을 모두에게 공개하게 할지, 서비스를 하룻밤에 멈출지 정해야 합니다.",
      ],
      cast: [
        { name: "문하준", note: "문가을의 아들인 고등학생. 원서비를 스스로 벌어 보려다, 이유도 모르는 41점을 받았습니다." },
        { name: "홍예담", note: "채용 평가 회사 핏스코어의 30대 대표. 면접에서 21번 떨어진 경험 때문에 ‘숫자는 공정하다’고 믿게 된 사람입니다." },
        { name: "강태민", note: "시연에 먼저 앉았다가 41점을 받은 사람. 감점 사유는 혼자 짐을 드는 경향입니다." },
      ],
      question: "망설임을 결함으로 배운 점수는 멈춰야 할 때 멈춘 사람부터 떨어뜨립니다. 그 점수가 무엇으로 배웠는지 묻는 사람이 있다면, 숫자는 다시 공정해질 수 있을까요?",
    },
    en: {
      setting: "2026, summer · Gaeul Rice Cake Shop, Mangwon Market → FitScore’s demo room, Seongsu-dong",
      premise: [
        "Moon Hajun holds out his phone. It is a rejection notice for a weekend part-time job at Levain House, a bakery café’s Mangwon branch: an organizational fit score (a number for how well a person will suit a company) of 41, below the interview threshold of 60. They called it an ‘AI interview,’ but not a single person was in it, only a 12-minute game-style aptitude test (a hiring test played like a game that measures your reactions). He wanted to earn the 380,000 won for his college application fees without telling his mom. Nobody will tell him what did not fit.",
        "The company behind the test is FitScore, the very company that bought Trigger Lab’s response records. In FitScore’s demo room in Seongsu-dong, CEO Hong Yedam holds out a tablet: if you have doubts, try it yourself. Kang Taemin sits down first and also scores 41. The reason given is a lack of leadership, because in the team task he carried his teammate avatars’ loads all by himself.",
        "Hong Yedam laughs, then grows serious. She failed twenty-one interviews, she says, because of her Busan accent, because her smile looked awkward. Numbers do not know accents; that is why she built this company. FitScore is used by 138 companies, 62,000 people have taken the test this year, and 9,412 were rejected automatically for scoring under 60. Then, turning the pages of the algorithm documentation (the set of calculation rules that orders its judgments), her hand stops at the training data (the material an AI learns its judgments from) source field: ‘Provided by: KD Data Lab.’",
        "What this model punishes most is hesitation, and the reference point for unfit is your record. You decide whether the 9,412 rejected applicants should meet a person again, whether the scoring method should be disclosed to everyone, or whether the service should stop overnight.",
      ],
      cast: [
        { name: "Moon Hajun", note: "Moon Gaeul’s son, a high school student. Trying to earn his own application fees, he got a 41 with no reason attached." },
        { name: "Hong Yedam", note: "CEO of the hiring assessment company FitScore, in her thirties. Twenty-one failed interviews taught her to believe that numbers are fair." },
        { name: "Kang Taemin", note: "First to sit for the demo, and also scored 41. His penalty: a tendency to carry loads alone." },
      ],
      question: "A score that learned hesitation as a flaw drops first the people who stopped when they should have. If someone asks what that score learned from, can the numbers become fair again?",
    },
    ja: {
      setting: "2026年夏 · マンウォン市場 ガウル餅房 → ソンス洞 フィットスコアのデモ会議室",
      premise: [
        "ムン・ハジュンが携帯の画面を差し出します。ベーカリーカフェ「ルヴァンハウス マンウォン店」の週末アルバイトの不採用通知です。組織適合度(人が会社にどれだけ合うかをつけた点数)41点、面接基準の60点に届かなかったという内容です。「AI面接」といっても人はひとりも出てこず、試験は12分のゲーム型適性検査(ゲームのように解かせながら反応を測る採用試験)だけでした。母に内緒で随時入試の出願料38万ウォンを稼ぐつもりだったのに、何が合わないのかは誰も教えてくれません。",
        "その検査を作った会社はフィットスコア。トリガーラボの反応記録を買っていった、まさにその会社です。ソンス洞のフィットスコアのデモ会議室で、代表のホン・イェダムは、疑うなら自分でやってみてとタブレットを差し出します。先に座ったカン・テミンも41点。理由はリーダーシップ不足、チーム課題で同僚のアバターの荷物までひとりで運んだからです。",
        "ホン・イェダムは笑ってから真顔になります。プサンなまりのせいで、笑顔がぎこちないという理由で、面接に21回落ちたと言います。数字はなまりを知らない。それが彼女がこの会社を作った理由です。フィットスコアの導入企業は138社、今年の受検者は6万2千人、60点未満で自動的に不採用になったのは9,412人。ところがアルゴリズム(判断の順序を決めておいた計算の規則)の説明書をめくっていた彼女の手が、学習データ(人工知能が判断を学ぶのに使った資料)の出典欄で止まります。「提供元:KDデータラボ。」",
        "このモデルがいちばん大きく減点するのはためらいで、不適合の基準点はあなたの記録です。あなたは落とされた9,412人にもう一度人が会うようにするのか、点数の計算方法を全員に公開させるのか、サービスを一晩で止めるのかを決めなければなりません。",
      ],
      cast: [
        { name: "ムン・ハジュン", note: "ムン・ガウルの息子で、高校生。出願料を自分で稼ごうとして、理由もわからない41点をつけられました。" },
        { name: "ホン・イェダム", note: "採用評価会社フィットスコアの30代の代表。面接に21回落ちた経験から、「数字は公平だ」と信じるようになった人です。" },
        { name: "カン・テミン", note: "デモに先に座って41点をつけられた人。減点の理由は、ひとりで荷物を持つ傾向です。" },
      ],
      question: "ためらいを欠点として学んだ点数は、止まるべきときに止まった人から落としていきます。その点数が何から学んだのかを問う人がいれば、数字はもう一度公平になれるのでしょうか。",
    },
  },
};
