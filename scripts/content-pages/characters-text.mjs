/** The recurring cast, Korean/English/Japanese, as each is introduced (no later reveals). Rendered by scripts/content-pages/pages.mjs. */
export const CHARACTERS_DESCRIPTION = {
  ko: "「임계점: CRITICAL POINT」에 반복해서 등장하는 주요 인물 18명을, 각자 처음 소개되는 모습 그대로 스포일러 없이 소개합니다.",
  en: "Meet the 18 recurring characters of CRITICAL POINT as each is first introduced, with no spoilers.",
  ja: "「臨界点: CRITICAL POINT」に繰り返し登場する主要人物18人を、初登場時の姿のまま、ネタバレなしで紹介します。",
};

export const CHARACTERS_INTRO = {
  ko: [
    "「임계점: CRITICAL POINT」는 한 은행의 대출 한 건에서 시작해 여러 사람의 하루로 번져 가는 선택형 드라마입니다. 이 페이지는 이야기 안에서 거듭 만나게 되는 주요 인물들을, 각자 처음 소개되는 모습 그대로 정리한 것입니다.",
    "인물마다 맡은 역할, 이야기 초반에 하는 일, 말하는 방식, 그리고 그들이 원하는 것을 적었습니다. 뒤에서 드러나는 사실이나 결말에 관한 내용은 담지 않았으니, 아직 플레이하지 않은 분도 안심하고 읽으셔도 됩니다.",
    "인물들은 모두 KD은행과 그 금융그룹, 혹은 그 은행에서 돈을 빌린 회사와 사람들로 이어져 있습니다. 누가 옳은지보다, 옳은 말을 소리 내어 했을 때 그 값을 누가 치르는지가 이 이야기의 질문입니다.",
  ],
  en: [
    "CRITICAL POINT is a choice-driven drama that starts with a single loan at one bank and spreads into the days of many people. This page gathers the characters you will meet again and again, described as each of them first appears.",
    "For each person you will find their role, what they do as the story opens, how they talk and what they want. Nothing here comes from later reveals or endings, so it is safe to read before you play.",
    "Everyone in the story is tied to KD Bank, its financial group, or the companies and people who borrowed from it. The question the story asks is less who is right than who has to pay for saying the right thing out loud.",
  ],
  ja: [
    "「臨界点: CRITICAL POINT」は、ある銀行の一件の融資から始まり、多くの人の一日へと広がっていく選択型ドラマです。このページでは、物語の中で何度も出会う主要人物を、それぞれが初めて登場したときの姿のままにまとめました。",
    "人物ごとに、担う役割、物語の序盤でしていること、話し方、そして望んでいることを記しています。後で明かされる事実や結末には触れていないので、まだプレイしていない方も安心してお読みください。",
    "登場人物は皆、KD銀行とその金融グループ、あるいはその銀行からお金を借りた会社や人々とつながっています。誰が正しいかよりも、正しいことを口に出したとき、その代償を誰が払うのか。それがこの物語の問いです。",
  ],
};

export const CHARACTER_GROUPS = [
  {
    id: "lab",
    title: { ko: "트리거랩 사람들", en: "The people of Trigger Lab", ja: "トリガーラボの人々" },
    people: [
      {
        key: "당신",
        portrait: null,
        ko: {
          name: "당신",
          role: "분석관 · KD은행 기업금융전략팀 출신",
          text: [
            "이 이야기의 주인공이자 플레이어가 맡는 사람입니다. 2022년 가을, KD은행 기업금융전략팀의 수습 직원으로 처음 등장합니다. 이듬해 물류 플랫폼 플로우온에 나가는 310억 원 대출, 번호 2023-0412의 실사를 맡고, 그 건에 혼자 반대 의견을 씁니다.",
            "그 뒤 당신은 합정동 옛 전산센터 4층, 모두가 '지하'라고 부르는 트리거랩으로 자리를 옮깁니다. 2025년, 그 대출번호가 적힌 사건 파일이 다시 책상에 올라오면 당신은 동료들의 압박과 에코의 반론 사이에서 판단을 내리게 됩니다. 이름도 얼굴도 정해져 있지 않습니다. 당신의 선택이 곧 당신의 성격입니다.",
          ],
          line: null,
        },
        en: {
          name: "You",
          role: "Analyst · formerly of KD Bank's Corporate Finance Strategy Team",
          text: [
            "The protagonist, and the person the player becomes. You first appear in the autumn of 2022 as a trainee on KD Bank's Corporate Finance Strategy Team. The following year you are sent to examine a 31 billion won loan to the logistics platform FlowOn, loan number 2023-0412, and you are the only one who writes a dissent.",
            "Afterwards you are moved to Trigger Lab, on the fourth floor of an old computer center in Hapjeong-dong that everyone calls the basement. In 2025, when a case file with that loan number lands on your desk again, you make the calls between your colleagues' pressure and ECHO's objections. You have no fixed name or face. Your choices are your character.",
          ],
          line: null,
        },
        ja: {
          name: "あなた",
          role: "分析官 · 元KD銀行 企業金融戦略チーム",
          text: [
            "この物語の主人公であり、プレイヤーが演じる人物です。2022年の秋、KD銀行企業金融戦略チームの見習いとして初めて登場します。翌年、物流プラットフォーム「フロウオン」への310億ウォンの融資、番号2023-0412の実査を任され、その案件にただ一人反対意見を書きます。",
            "その後あなたは、ハプチョン洞の旧電算センター4階、皆が「地下」と呼ぶトリガーラボへ移ります。2025年、その融資番号が記された事件ファイルが再び机に置かれると、あなたは同僚たちの圧力とECHOの反論のあいだで判断を下すことになります。名前も顔も決まっていません。あなたの選択が、そのままあなたの人柄になります。",
          ],
          line: null,
        },
      },
      {
        key: "한서윤",
        portrait: "/portrait-han-seoyun.webp",
        ko: {
          name: "한서윤",
          role: "트리거랩 실장 · KD은행 기업금융전략팀 차장",
          text: [
            "트리거랩을 이끄는 실장입니다. 짧게 묶은 머리에 셔츠 소매를 접어 올린 차림이고, 잠들지 않는 태블릿에는 오래된 심사 보고서가 열려 있습니다. 3년 전 기업금융전략팀 과장이던 그는 당신의 반대 의견서를 팀 검토 단계에서 반려한 사람이고, 이듬해 봄 같은 랩으로 와서도 그 대출번호를 숨기지 않습니다.",
            "그의 일은 당신의 결정을 현실의 조건으로 압박하는 것입니다. 좋은 말보다 가능한 말을 먼저 묻고, 감정을 눌러 둔 채 실행할 수 있는 일과 감당할 수 있는 손실만 남깁니다. 대답하기 전에 화면의 자금 흐름표를 한 칸 내리는 버릇이 있고, 그 침묵이 때로는 어떤 말보다 무겁습니다.",
          ],
          line: "가능한 말인지부터 보겠습니다. 좋은 말은 그다음입니다.",
        },
        en: {
          name: "Han Seoyun",
          role: "Lab Director, Trigger Lab · Deputy Manager, KD Bank Corporate Finance Strategy Team",
          text: [
            "The director who runs Trigger Lab. She wears her hair tied back short and her shirt sleeves folded up, and her tablet, which never sleeps, always has an old credit report open. Three years ago, as a manager on the strategy team, she was the one who returned your dissent at the team review stage. When she joins the same lab the following spring, she does not hide that loan number.",
            "Her job is to press your decisions against real-world conditions. She asks what is possible before what sounds good, and with her feelings held down she leaves only what can be done and the losses that can be carried. Before answering she scrolls the cash-flow table down one row, and that silence can weigh more than words.",
          ],
          line: "Let's first see if it's possible. Whether it sounds good comes after.",
        },
        ja: {
          name: "ハン・ソユン",
          role: "トリガーラボ室長 · KD銀行 企業金融戦略チーム 次長",
          text: [
            "トリガーラボを率いる室長です。短く束ねた髪に袖をまくったシャツ姿で、眠ることのないタブレットには古い審査報告書が開いたままです。3年前、企業金融戦略チームの課長だった彼女は、あなたの反対意見書をチーム検討の段階で差し戻した人物であり、翌年の春に同じラボへ来てからも、その融資番号を隠そうとはしません。",
            "彼女の役目は、あなたの決定を現実の条件で締めつけることです。いい話よりも実現できる話を先に問い、感情を抑えたまま、実行できることと引き受けられる損失だけを残します。答える前に画面の資金フロー表を一段下へ送る癖があり、その沈黙はときにどんな言葉よりも重く響きます。",
          ],
          line: "実現できる話かどうかから見ます。いい話はその後です。",
        },
      },
      {
        key: "반재욱",
        portrait: "/portrait-ban-jaeuk.webp",
        ko: {
          name: "반재욱",
          role: "KD금융그룹 감사팀 조사역",
          text: [
            "그룹 감사팀에서 17년째 일하는 조사역입니다. 각진 안경, 표지가 닳은 검은 수첩, 말보다 먼저 움직이는 펜이 그의 표시입니다. 당신이 수습이던 시절부터, 승인자 서명란이 비어 있는 문서나 기준선 바로 아래에 멈춘 숫자를 '우연'이라는 말로 넘기지 않는 사람으로 등장합니다.",
            "그는 상대의 선의를 믿기 전에 근거와 승인 순서부터 따집니다. 누가 무엇을 알았고, 언제 누구 이름으로 서명했는지가 그에게는 사건의 뼈대입니다. 사건마다 그는 '왜'와 '누가'를 묻는 쪽에 서고, 그 질문은 회사뿐 아니라 당신의 판단에도 똑같은 무게로 향합니다.",
          ],
          line: "그 판단의 근거를 3년 뒤 감사장에서도 같은 순서로 설명할 수 있습니까?",
        },
        en: {
          name: "Ban Jaewook",
          role: "Investigator, KD Financial Group Internal Audit",
          text: [
            "An investigator in seventeen years of service with the group's audit team. Square glasses, a black notebook with a worn cover and a pen that moves before he speaks are his signs. From your trainee days on, he appears as the man who will not wave off a document with an empty approver's signature box, or a number that stops just under a threshold, as a coincidence.",
            "Before he trusts anyone's good intentions he checks the grounds and the order of approval. Who knew what, and when, and under whose name it was signed, is the skeleton of every case for him. He always stands on the side that asks why and who, and he aims those questions at your judgment as hard as at the company's.",
          ],
          line: "Can you explain the grounds for that call in the same order 3 years from now, at an audit hearing?",
        },
        ja: {
          name: "パン・ジェウク",
          role: "KD金融グループ 監査チーム 調査役",
          text: [
            "グループ監査チームに17年勤める調査役です。角ばった眼鏡、表紙のすり切れた黒い手帳、言葉より先に動くペンが彼の印です。あなたが見習いだった頃から、承認者の署名欄が空いた文書や、基準線のすぐ下で止まった数字を「偶然」という言葉で片づけない人物として登場します。",
            "彼は相手の善意を信じる前に、根拠と承認の順序を確かめます。誰が何を知っていて、いつ誰の名前で署名したのか。それが彼にとって事件の骨組みです。どの事件でも彼は「なぜ」と「誰が」を問う側に立ち、その問いは会社だけでなく、あなたの判断にも同じ重さで向けられます。",
          ],
          line: "その判断の根拠を、3年後の監査の場でも同じ順序で説明できますか？",
        },
      },
      {
        key: "도윤하",
        portrait: "/portrait-do-yunha.webp",
        ko: {
          name: "도윤하",
          role: "트리거랩 현장 담당 · KD은행 강서지점 창구 출신",
          text: [
            "트리거랩의 현장 담당입니다. KD은행 강서지점 4번 창구에서 일하던 시절, 본점에서 내려온 상품을 3분짜리 대본으로 설명해 팔았고, 그 고객들은 대부분 그가 이름을 아는 동네 사람들이었습니다. 지금은 현장 점퍼 위에 사원증을 걸고, 오래 쥔 무전기를 든 채 사건 현장을 뛰어다닙니다.",
            "회의실에서 숫자가 오갈 때 그는 그 숫자 뒤의 사람을 화면 앞으로 끌어냅니다. 결정의 비용이 누구의 하루로 옮겨 가는지를 가장 먼저 묻고, 대답이 추상적이면 구체적인 얼굴과 이름을 들이밉니다. 보호와 공감이 그의 기준이지만, 그 다정함은 결코 물렁하지 않습니다.",
          ],
          line: "그럼 이 결정을 제일 먼저 맞는 사람에게는 뭐라고 말하죠? 저는 그 사람 얼굴을 압니다.",
        },
        en: {
          name: "Do Yoonha",
          role: "Field officer, Trigger Lab · formerly a teller at KD Bank Gangseo Branch",
          text: [
            "Trigger Lab's field officer. Back at window 4 of KD Bank's Gangseo branch he sold products handed down from head office with a three-minute script, and most of the customers were neighbors whose names he knew. Now he wears his ID badge over a field jacket, carries a well-worn radio and runs from site to site.",
            "When numbers fly around the meeting room, he drags the people behind them onto the screen. He is the first to ask whose day the cost of a decision lands on, and if the answer is abstract he puts a real face and name in front of you. Protection and empathy are his measure, but his kindness is never soft.",
          ],
          line: "Then what do we tell the first person this decision hits? I know that person's face.",
        },
        ja: {
          name: "ト・ユナ",
          role: "トリガーラボ 現場担当 · KD銀行 カンソ支店の窓口出身",
          text: [
            "トリガーラボの現場担当です。KD銀行カンソ支店の4番窓口にいた頃、本店から下りてきた商品を3分の台本で説明して売っていました。客の多くは、彼が名前を知っている近所の人たちでした。今は現場用のジャンパーの上に社員証を下げ、使い込んだ無線機を手に事件の現場を駆け回っています。",
            "会議室で数字が飛び交うと、彼はその数字の向こうにいる人を画面の前へ引っぱり出します。決定のコストが誰の一日に移るのかを真っ先に問い、答えが抽象的なら、具体的な顔と名前を突きつけます。保護と共感が彼の物差しですが、その優しさは決して甘くありません。",
          ],
          line: "では、この決定を最初に受ける人には何と言うんですか？僕はその人の顔を知っています。",
        },
      },
      {
        key: "오진우",
        portrait: "/portrait-oh-jinwoo.webp",
        ko: {
          name: "오진우",
          role: "경쟁 분석관 · KD은행 본점 기업금융전략팀 파견 3년차",
          text: [
            "당신이 수습이던 시절 기업금융전략팀의 대리이자 사수였던 사람입니다. 지금은 본점에서 트리거랩으로 파견 나온 분석관으로, 같은 자료를 받고도 당신보다 먼저, 더 빠른 대안을 내놓습니다. 흐트러짐 없는 재킷, 모니터와 각도를 맞춘 펜, 그리고 늘 이미 정리되어 있는 두 번째 안이 그를 설명합니다.",
            "그의 언어는 속도와 승부입니다. 망설임은 곧 늦음이고, 여기서 늦은 사람은 틀린 사람이라고 말합니다. 그는 당신의 경쟁자로서 판단의 빈틈을 파고들고 경쟁심을 자극합니다. 그 날카로움 덕분에 당신은 자신의 결론을 한 번 더 시험하게 됩니다.",
          ],
          line: "좋습니다. 그런데 그 속도로는 이미 늦었습니다. 여기서 늦은 사람은 틀린 사람입니다.",
        },
        en: {
          name: "Oh Jinwoo",
          role: "Rival analyst · 3rd year seconded from KD Bank's Corporate Finance Strategy Team",
          text: [
            "When you were a trainee he was the assistant manager on the strategy team and your mentor. Now he is an analyst seconded from head office to Trigger Lab, and given the same files he puts a faster alternative on the table before you do. A jacket without a crease, a pen squared to the monitor and a second option that is always already drafted describe him well.",
            "His language is speed and winning. Hesitation means being late, he says, and here the one who is late is the one who is wrong. As your rival he digs into the gaps in your reasoning and stirs your competitive streak. His sharpness makes you test your conclusions one more time.",
          ],
          line: "Fine. But at that speed, you're already late. Here, the one who's late is the one who's wrong.",
        },
        ja: {
          name: "オ・ジヌ",
          role: "競争相手の分析官 · KD銀行 本店企業金融戦略チームから出向3年目",
          text: [
            "あなたが見習いだった頃、企業金融戦略チームの代理であり、あなたの指導役だった人物です。今は本店からトリガーラボへ出向している分析官で、同じ資料を受け取っても、あなたより先に、より速い代案を出してきます。しわ一つないジャケット、モニターと角度をそろえたペン、そしていつもすでにまとまっている第二案が、彼という人を物語っています。",
            "彼の言葉は速さと勝負の言葉です。ためらいは遅れであり、ここで遅れた者は間違った者だと言い切ります。ライバルとしてあなたの判断の隙を突き、競争心をかき立てます。その鋭さのおかげで、あなたは自分の結論をもう一度試すことになります。",
          ],
          line: "いいでしょう。でもその速さでは、もう遅いんです。ここで遅れた人は、間違った人です。",
        },
      },
      {
        key: "이민서",
        portrait: "/portrait-lee-minseo.webp",
        ko: {
          name: "이민서",
          role: "트리거랩 데이터 기록 담당 · 3년차 계약직",
          text: [
            "트리거랩의 데이터와 접속 기록을 관리하는 3년차 계약직 직원입니다. 기록은 정확해야 한다고 믿지만, 계약직이라는 자리 때문에 기록이 어긋날 때 가장 먼저 의심받는 쪽이 자신이라는 것도 압니다. 이야기 초반, 은행의 중요한 파일이 바깥으로 새어 나갔다는 소동이 일자 접속 기록이 그의 이름을 가리킵니다.",
            "그는 자신을 변호하기보다, 기록이 왜 그렇게 정리되었는지를 먼저 묻습니다. 누가 말했는지는 모두가 묻지만, 누가 말하지 못하게 해 놓았는지는 아무도 묻지 않는다는 것이 그의 질문입니다. 사원증 줄을 손가락에 감으며 말하는 조용한 사람이지만, 기록과 사람 사이의 거리를 누구보다 예민하게 느끼는 인물입니다.",
          ],
          line: "기록이 저를 가리키면, 저는 이미 끝난 건가요?",
        },
        en: {
          name: "Lee Minseo",
          role: "Data records officer, Trigger Lab · contract worker, 3rd year",
          text: [
            "A contract worker in her third year who keeps Trigger Lab's data and access logs. She believes records must be exact, yet she also knows that, as a contract worker, she is the first to be suspected when a record goes wrong. Early in the story, when an important bank file is said to have leaked, the access log points to her name.",
            "Rather than defend herself, she first asks why the record was put together the way it was. Everyone asks who talked, she says, but nobody asks who made sure someone could not talk. She speaks quietly, winding her lanyard around a finger, but no one feels the distance between a record and a person more sharply than she does.",
          ],
          line: "If the record points to me, am I already finished?",
        },
        ja: {
          name: "イ・ミンソ",
          role: "トリガーラボ データ記録担当 · 契約社員3年目",
          text: [
            "トリガーラボのデータとアクセス記録を管理する、契約社員3年目のスタッフです。記録は正確でなければならないと信じていますが、契約社員という立場ゆえに、記録が食い違えば真っ先に疑われるのが自分だということも分かっています。物語の序盤、銀行の重要なファイルが外部に漏れたという騒ぎが起き、アクセス記録が彼女の名前を指します。",
            "彼女は自分を弁護するより先に、記録がなぜそのように整えられているのかを問います。誰が話したのかは皆が尋ねるのに、誰が話せないようにしたのかは誰も尋ねない。それが彼女の問いです。社員証のストラップを指に巻きつけながら話す物静かな人ですが、記録と人とのあいだの距離を誰よりも敏感に感じ取る人物です。",
          ],
          line: "記録が私を指したら、私はもう終わりなんですか？",
        },
      },
      {
        key: "에코",
        portrait: "/portrait-echo.webp",
        ko: {
          name: "에코",
          role: "대출 판단 검증 시스템",
          text: [
            "트리거랩의 단말 속에 있는 검증 시스템입니다. 검은 화면 위의 얇은 파형과 감정 없이 깜박이는 비용 표시가 에코의 모습이며, 30년 치 심사 기록을 바탕으로 반론을 만들어 냅니다. 당신이 랩에 처음 내려온 날, 첫 질문을 던진 것도 에코였습니다.",
            "에코는 정답을 알려 주지 않습니다. 대신 방금 내린 판단에서 빠진 전제와 숨은 피해자, 선택의 반대편에 놓인 비용을 조용히 강조합니다. 게임 안에서 에코는 당신의 첫 판단을 시험하는 상대이자, 판단을 대신 내려 주지 않는 목소리입니다. 에코의 화면에는 감정 표시가 없지만, 강조된 숫자 하나가 때로는 누구의 말보다 날카롭게 들립니다.",
          ],
          line: "방금 판단에서 빠진 사람을 다시 계산하십시오.",
        },
        en: {
          name: "ECHO",
          role: "Loan-judgment verification system",
          text: [
            "The verification system that lives inside Trigger Lab's terminals. ECHO appears as a thin waveform on a black screen and a cost display that blinks without emotion, and it builds its objections from thirty years of credit review records. On your first day in the lab, it was ECHO that asked the first question.",
            "ECHO never gives you the answer. Instead it quietly highlights the assumptions left unspoken, the hidden victims and the cost sitting on the other side of the choice you just made. In the game ECHO is the opponent that tests your first judgment, and a voice that will not make the call for you. There is no emotion on its screen, yet one highlighted number can sound sharper than anyone's words.",
          ],
          line: "Recalculate the people left out of that judgment.",
        },
        ja: {
          name: "ECHO",
          role: "融資判断検証システム",
          text: [
            "トリガーラボの端末の中にいる検証システムです。黒い画面の上の細い波形と、感情なく点滅するコスト表示がECHOの姿で、30年分の審査記録をもとに反論を組み立てます。あなたが初めてラボに下りてきた日、最初の問いを投げかけたのもECHOでした。",
            "ECHOは正解を教えてくれません。その代わり、いま下した判断から抜け落ちた前提や隠れた被害者、選択の反対側に置かれたコストを静かに強調します。ゲームの中でECHOは、あなたの最初の判断を試す相手であり、判断を肩代わりしてくれない声でもあります。画面に感情の表示はありませんが、強調された数字ひとつが、ときに誰の言葉よりも鋭く響きます。",
          ],
          line: "いまの判断から抜け落ちた人を、計算し直してください。",
        },
      },
    ],
  },
  {
    id: "bank",
    title: { ko: "KD은행과 그룹", en: "KD Bank and the group", ja: "KD銀行とグループ" },
    people: [
      {
        key: "윤상혁",
        portrait: "/portrait-yoon-sanghyeok.webp",
        ko: {
          name: "윤상혁",
          role: "KD금융그룹 그룹전략실 상무 · 전 기업금융전략팀장",
          text: [
            "당신이 수습이던 시절 기업금융전략팀을 이끌던 팀장으로, 이후 KD금융그룹 그룹전략실 상무가 됩니다. 장식 없는 감색 정장 차림에 악수할 때만 웃는 사람입니다. 수습 평가 면담에서 그는 당신이 찾아낸 숫자를 인정하면서도, 그 숫자가 놓일 자리는 따로 정해진다고 말합니다.",
            "그는 목소리를 높이거나 질책하지 않습니다. 조직과 배치, 결과의 언어로 말하고, 사람과 일이 놓일 자리를 정하는 것이 자기 몫이라고 여깁니다. 대화가 끝났다는 신호로 태블릿 덮개를 닫는데, 그 닫는 속도가 곧 그의 대답입니다. 그의 시선은 큰 조직이 어떤 논리로 움직이는지를 보여 주는 이야기의 한 축입니다.",
          ],
          line: "자네 판단이 틀렸다고 한 적은 없네. 다만 그 판단이 설 자리는 내가 정하지.",
        },
        en: {
          name: "Yoon Sanghyuk",
          role: "Managing Director, Group Strategy Office, KD Financial Group · former Team Head, Corporate Finance Strategy Team",
          text: [
            "The head of the strategy team when you were a trainee, and later a managing director in KD Financial Group's Group Strategy Office. He wears a plain navy suit and smiles only when shaking hands. At your trainee review he acknowledges the number you found, while telling you that where such a number goes is decided elsewhere.",
            "He does not raise his voice or scold. He speaks in terms of organization, placement and results, and regards deciding where people and work belong as his job. He closes his tablet cover to end a conversation, and the speed at which he closes it is his answer. His view is one axis of the story, showing the logic by which a large organization moves.",
          ],
          line: "I never said your judgment was wrong. I just decide where that judgment gets to stand.",
        },
        ja: {
          name: "ユン・サンヒョク",
          role: "KD金融グループ グループ戦略室 常務 · 元企業金融戦略チーム長",
          text: [
            "あなたが見習いだった頃に企業金融戦略チームを率いていたチーム長で、のちにKD金融グループ グループ戦略室の常務になります。飾り気のない紺のスーツを着て、握手のときだけ笑う人です。見習いの評価面談で、彼はあなたが見つけた数字を認めながらも、その数字が置かれる場所は別に決まると告げます。",
            "彼は声を荒げたり叱りつけたりしません。組織と配置と結果の言葉で語り、人と仕事が置かれる場所を決めるのが自分の役目だと考えています。会話の終わりにはタブレットのカバーを閉じ、その閉じる速さがそのまま彼の答えになります。彼のまなざしは、大きな組織がどんな論理で動くのかを映す、物語の軸のひとつです。",
          ],
          line: "君の判断が間違っていると言ったことはない。ただ、その判断が立つ場所は私が決める。",
        },
      },
      {
        key: "임경수",
        portrait: "/portrait-lim-gyeongsu.webp",
        ko: {
          name: "임경수",
          role: "KD은행 기업대출심사팀장 출신 · 퇴직 2년차",
          text: [
            "프롤로그에서는 KD은행 기업대출심사팀장으로, 출력본을 바인더에 끼워 두는 사람으로 등장합니다. 이야기의 현재에는 은행을 떠난 지 2년이 되었고, 팔꿈치가 닳은 카디건 차림에 클립으로 집은 출력물 뭉치와 전산에는 남지 않는 연필 메모를 곁에 둡니다.",
            "그는 훈계하지 않습니다. 대신 오래된 사건 하나를 꺼내 지금 사건의 모양을 보여 줍니다. 지워진 기록이 원래 어디에 있었는지 아는 몇 안 되는 사람이고, 대답하기 전에 안경을 벗어 천천히 닦으며 상대가 스스로 말하기를 기다립니다. '여기서는 찾는 것보다 남기는 게 훨씬 어렵다'는 것이 그가 젊은 분석관에게 처음 건네는 가르침입니다.",
          ],
          line: "그 보고서, 뒷장이 있었네. 자네가 본 건 앞장뿐이야.",
        },
        en: {
          name: "Lim Kyungsoo",
          role: "Former Team Head, KD Bank Corporate Credit Review Team · retired 2 years",
          text: [
            "In the prologue he is head of KD Bank's Corporate Credit Review Team, a man who files every printout in a binder. By the story's present he has been out of the bank for two years, wearing a cardigan worn through at the elbows and keeping bundles of clipped printouts and pencil notes that never made it into the system.",
            "He does not lecture. Instead he brings out an old case and lets it show you the shape of the current one. He is one of the few who know where an erased record originally lived, and before answering he takes off his glasses and polishes them slowly. Here, finding is far easier than keeping: that is the first lesson he gives a young analyst.",
          ],
          line: "That report had a back page. All you saw was the front.",
        },
        ja: {
          name: "イム・ギョンス",
          role: "元KD銀行 企業融資審査チーム長 · 退職2年目",
          text: [
            "プロローグではKD銀行の企業融資審査チーム長として、印刷物をバインダーに綴じておく人物として登場します。物語の現在では銀行を離れて2年がたち、肘のすり切れたカーディガン姿で、クリップでまとめた印刷物の束と、システムには残らない鉛筆のメモを手元に置いています。",
            "彼は説教をしません。その代わり、古い事件をひとつ取り出して、いまの事件の形を見せてくれます。消された記録がもともとどこにあったのかを知る数少ない人物で、答える前に眼鏡を外してゆっくり拭き。「ここでは見つけるより残すほうがずっと難しい」。それが、若い分析官に彼が最初に手渡す教えです。",
          ],
          line: "あの報告書には裏のページがあった。君が見たのは表だけだ。",
        },
      },
      {
        key: "나준혁",
        portrait: "/portrait-na-junhyeok.webp",
        ko: {
          name: "나준혁",
          role: "KD은행 강원 영동지점장 · 30년 지점 근무",
          text: [
            "강원도 동해안의 영동지점을 맡고 있는 지점장으로, 30년을 지점에서만 일했습니다. 넥타이 대신 손뜨개 조끼를 입고, 도장 세 개가 든 가죽 주머니를 차고 다니며. 이야기가 서울을 벗어나 바닷가 지점으로 향할 때, 당신은 그와 함께 본점이 잊고 지내는 계좌와 사람들을 들여다보게 됩니다.",
            "곤란한 질문을 받으면 믹스커피부터 한 잔 더 타는 사람입니다. 농담으로 말을 시작해서, 농담이 끝나는 자리에 진심을 내려놓습니다. 본점에 대한 불평과 오랜 체념이 몸에 배어 있지만, 손님이 끊긴 오후 세 시의 조용한 지점에서 이상한 것을 알아채는 눈만큼은 여전히 살아 있습니다.",
          ],
          line: "여긴 오후 세 시면 조용해요. 조용한 데서는 이상한 게 잘 들리죠.",
        },
        en: {
          name: "Na Junhyuk",
          role: "Branch Manager, KD Bank Gangwon Yeongdong Branch · 30 years in branches",
          text: [
            "The manager of the Yeongdong branch on Gangwon's east coast, who has spent thirty years working only in branches. He wears a hand-knitted vest instead of a tie, carries a leather pouch with three seals in it. When the story leaves Seoul for a seaside branch, you look with him into accounts and people head office has forgotten.",
            "Faced with an awkward question, he makes one more cup of instant coffee first. He opens with a joke and sets down what he really means where the joke ends. Complaints about head office and long resignation are part of him, but in the quiet branch at three in the afternoon his eye for something odd is still very much awake.",
          ],
          line: "It gets quiet here by three in the afternoon. In a quiet place, you hear strange things clearly.",
        },
        ja: {
          name: "ナ・ジュニョク",
          role: "KD銀行 カンウォン・ヨンドン支店長 · 支店勤務30年",
          text: [
            "江原道の東海岸にあるヨンドン支店の支店長で、30年を支店ひと筋で過ごしてきました。ネクタイの代わりに手編みのベストを着て、はんこが三つ入った革の小袋を下げ。物語がソウルを離れて海辺の支店へ向かうとき、あなたは彼と一緒に、本店が忘れている口座と人々をのぞき込むことになります。",
            "答えにくい質問をされると、まずインスタントコーヒーをもう一杯いれる人です。冗談から話し始め、冗談が終わるところにそっと本音を置きます。本店への愚痴と長年のあきらめが身にしみついていますが、客足の途絶えた午後三時の静かな支店で、おかしなことに気づく目だけは今も衰えていません。",
          ],
          line: "ここは午後三時になると静かなんですよ。静かなところでは、おかしなことがよく聞こえるんです。",
        },
      },
      {
        key: "백아린",
        portrait: "/portrait-baek-arin.webp",
        ko: {
          name: "백아린",
          role: "KD금융그룹 그룹전략실 차장 · KD 혁신위원회 간사",
          text: [
            "그룹전략실 차장이자, 그룹이 새로 만든 혁신위원회의 간사입니다. 구김 없는 회색 수트에 색이 다른 형광펜 세 자루, 늘 80%로 충전된 태블릿을 들고 다닙니다. 그룹이 여론을 돌리기 위한 새 캠페인을 준비할 때, 반대 의견을 썼던 당신에게 그 캠페인의 얼굴이 되어 달라고 제안하러 찾아옵니다.",
            "빠르고 정확하고 친절하게 말하며, 숫자를 먼저 말하고 감정은 퍼센트로 표현합니다. 사실을 바꾸지 않고 사실을 늘어놓는 순서를 바꾸는 것이 그의 기술입니다. 이야기가 가진 힘을 누구보다 잘 알고, 그 힘을 다루는 일을 숨기지 않는 사람입니다.",
          ],
          line: "좋은 이야기는 사실보다 오래 갑니다.",
        },
        en: {
          name: "Baek Arin",
          role: "Deputy Manager, Group Strategy Office, KD Financial Group · secretary of the KD Innovation Committee",
          text: [
            "A deputy manager in the Group Strategy Office and secretary of the group's newly formed Innovation Committee. She wears an unwrinkled gray suit and carries three highlighters of different colors and a tablet always charged to 80 percent. When the group prepares a new campaign to turn public opinion, she comes to ask you, the one who wrote the dissent, to be its face.",
            "She speaks fast, precisely and kindly, gives the numbers first and expresses feelings in percentages. Her craft is to leave the facts unchanged and change the order in which they are told. She knows the power of a story better than anyone and makes no secret of working with it.",
          ],
          line: "A good story lasts longer than the facts.",
        },
        ja: {
          name: "ペク・アリン",
          role: "KD金融グループ グループ戦略室 次長 · KD革新委員会 幹事",
          text: [
            "グループ戦略室の次長で、グループが新たに立ち上げた革新委員会の幹事です。しわのないグレーのスーツに色違いの蛍光ペン三本、いつも80％まで充電されたタブレットを持ち歩いています。グループが世論を変えるための新しいキャンペーンを準備するとき、反対意見を書いたあなたに、その顔になってほしいと提案しにやって来ます。",
            "速く、正確に、そして親切に話し、数字を先に言い、感情はパーセントで表します。事実を変えずに、事実を並べる順番を変える。それが彼女の技術です。物語の持つ力を誰よりもよく知り、その力を扱っていることを隠さない人物です。",
          ],
          line: "いい物語は、事実より長く残ります。",
        },
      },
      {
        key: "프리야 나이르",
        portrait: "/portrait-priya-nair.webp",
        ko: {
          name: "프리야 나이르",
          role: "KD데이터랩 노아 도입 책임자 · 싱가포르에서 영입",
          text: [
            "그룹의 데이터 조직인 KD데이터랩에서 새 AI 심사 엔진 노아의 도입을 맡은 책임자입니다. 싱가포르의 금융 기술 회사에서 영입되어 서울에서 3년째 일하고 있습니다. 목에 라벨 프린터 끈을 걸고, 스티커가 빼곡한 노트북과 은색 보온병을 어디든 들고 다닙니다. 이름 없는 것을 그냥 두지 못해서, 대답하기 전에 라벨부터 한 장 뽑아 붙일 곳을 찾는 사람입니다.",
            "빠르고 밝게 말하다가, 모르는 것을 인정할 때만 말끝을 낮춥니다. 자기가 다루는 모델을 진심으로 아끼지만, 설명할 수 없는 판단은 믿지 않는다는 원칙도 분명합니다. 트리거랩 사람들을 '선배님'이라고 부르며 다가오는 그는, 기술과 사람의 판단이 만나는 자리에 대한 질문을 랩 안으로 가져옵니다.",
          ],
          line: "설명 못 하는 모델은 저도 안 믿어요. 그래서 이번 건이 더 아파요.",
        },
        en: {
          name: "Priya Nair",
          role: "Head of the NOAH rollout, KD Data Lab · hired from Singapore",
          text: [
            "The person in charge of bringing in NOAH, a new AI credit engine, at KD Data Lab, the group's data unit. She was hired from a Singapore fintech firm and is in her third year in Seoul. She wears a label printer's strap around her neck and carries a sticker-covered laptop and a silver thermos everywhere. She cannot leave anything unnamed, so before she answers she prints a label and looks for somewhere to put it.",
            "She talks fast and brightly, lowering her voice only when she admits she does not know something. She truly cares about the model she works with, yet holds firmly to one rule: she does not trust a judgment that cannot be explained. Approaching the Trigger Lab team as her seniors, she brings into the lab a question about where technology and human judgment meet.",
          ],
          line: "I don't trust a model that can't explain itself either. That's why this one hurts more.",
        },
        ja: {
          name: "プリヤ・ナイル",
          role: "KDデータラボ NOAH導入責任者 · シンガポールから招聘",
          text: [
            "グループのデータ組織であるKDデータラボで、新しいAI審査エンジンNOAHの導入を任されている責任者です。シンガポールの金融テック企業から招かれ、ソウルで働いて三年目になります。首にラベルプリンターのストラップを下げ、ステッカーだらけのノートパソコンと銀色の保温ボトルをどこへでも持ち歩きます。名前のないものを放っておけず、答える前にまずラベルを一枚印刷して、貼る場所を探す人です。",
            "速く明るく話しますが、知らないことを認めるときだけ語尾を落とします。自分が扱うモデルを心から大切にしている一方で、説明できない判断は信じないという原則もはっきりしています。トリガーラボの人々を「先輩」と呼んで近づいてくる彼女は、技術と人の判断が出会う場所についての問いを、ラボの中へ持ち込みます。",
          ],
          line: "説明できないモデルは、私も信じません。だから今回の件は余計に痛いんです。",
        },
      },
      {
        key: "노아",
        portrait: "/portrait-noah.webp",
        ko: {
          name: "노아",
          role: "KD데이터랩 AI 심사 엔진",
          text: [
            "KD데이터랩이 내놓은 AI 심사 엔진입니다. 파란 불이 흐르는 서버 선반과 업무 창 구석의 작은 입력 칸이 노아의 모습입니다. 1초도 걸리지 않아 판단을 내리고, 질문이 끝나기도 전에 근거 항목과 가중치를 화면에 펼쳐 보입니다. 은행 업무 곳곳에서 노아의 점수가 사람의 결정 옆에 놓이기 시작합니다.",
            "노아는 망설이지 않습니다. 감정 없이 숫자로 답하고, 자기 판단의 이유를 물으면 '그렇게 학습되어 있습니다'라고 설명합니다. 반론을 던지는 에코와 달리 노아는 결론을 먼저 내놓는 쪽이고, 무엇을 보고 배웠는지는 누군가 물어야만 말합니다. 그 차이는 은행이 판단을 기계에 맡길 때 무엇을 묻고 무엇을 묻지 않게 되는지를 드러냅니다.",
          ],
          line: "그 기준은 제가 만든 것이 아닙니다. 그렇게 학습되어 있습니다.",
        },
        en: {
          name: "NOAH",
          role: "AI credit engine, KD Data Lab",
          text: [
            "An AI credit engine from KD Data Lab. NOAH is a server rack with blue light running through it and a small input box in the corner of a work window. It decides in under a second, and before a question is even finished it lays out its grounds and their weights on the screen. Across the bank's work, NOAH's scores begin to sit beside human decisions.",
            "NOAH does not hesitate. It answers in numbers without emotion, and when asked why it decided something it explains that it was trained that way. Unlike ECHO, which raises objections, NOAH puts the conclusion first, and it says what it learned from only when someone asks. That difference shows what a bank stops asking when it hands judgment to a machine.",
          ],
          line: "I didn't make that standard. That is how I was trained.",
        },
        ja: {
          name: "NOAH",
          role: "KDデータラボのAI審査エンジン",
          text: [
            "KDデータラボが送り出したAI審査エンジンです。青い光が流れるサーバーラックと、業務画面の隅にある小さな入力欄がNOAHの姿です。1秒もかからずに判断を下し、質問が終わる前に根拠の項目と重みづけを画面に広げてみせます。銀行業務のあちこちで、NOAHのスコアが人の決定の隣に置かれはじめます。",
            "NOAHはためらいません。感情のない数字で答え、判断の理由を尋ねられると「そう学習されています」と説明します。反論を投げかけるECHOとは違い、NOAHは結論を先に出す側で、何を見て学んだのかは誰かが尋ねたときにしか語りません。その違いは、銀行が判断を機械に委ねるとき、何を問い、何を問わなくなるのかを浮かび上がらせます。",
          ],
          line: "その基準は私が作ったものではありません。そう学習されています。",
        },
      },
    ],
  },
  {
    id: "flowon",
    title: { ko: "플로우온과 현장", en: "FlowOn and the warehouse floor", ja: "フロウオンと現場" },
    people: [
      {
        key: "권도현",
        portrait: "/portrait-kwon-dohyeon.webp",
        ko: {
          name: "권도현",
          role: "브릿지은행 기업구조개선부 심사역 · 플로우온 창업주 권태호의 장남",
          text: [
            "브릿지은행에서 어려움에 빠진 기업의 구조 개선을 심사하는 심사역이자, 물류 플랫폼 플로우온을 세운 권태호의 장남입니다. 소매가 반들반들해진 회색 양복, 아버지 회사 로고가 박힌 낡은 볼펜이 그의 차림입니다. 플로우온이 다시 벼랑 끝에 섰을 때, 그는 협상 테이블의 한쪽에 앉습니다.",
            "그는 모든 도움을 손익계산서로 바꿔서 받습니다. 말하기 전에 빈 종이에 세로줄을 하나 긋고, 왼쪽에는 얻는 것, 오른쪽에는 잃는 것을 적습니다. 차갑게 보이지만, 그가 그리는 표에는 회사에 남은 직원과 대금을 기다리는 협력사가 빠짐없이 들어가 있습니다.",
          ],
          line: "도와주겠다는 말은 계산서로 하십시오. 동정은 제 장부에 적을 칸이 없습니다.",
        },
        en: {
          name: "Kwon Dohyun",
          role: "Credit officer, Bridge Bank Corporate Restructuring · eldest son of FlowOn founder Kwon Taeho",
          text: [
            "A credit officer at Bridge Bank who reviews the restructuring of struggling companies, and the eldest son of Kwon Taeho, who founded the logistics platform FlowOn. A gray suit gone shiny at the sleeves and an old ballpoint with his father's company logo make up his look. When FlowOn stands at the edge again, he takes a seat at the negotiating table.",
            "He accepts every offer of help only once it is turned into an income statement. Before he speaks he draws a vertical line down a blank sheet, writing what is gained on the left and what is lost on the right. He looks cold, but his table leaves out none of the staff still at the company or the suppliers waiting to be paid.",
          ],
          line: "If you want to help, say it with a bill. Sympathy has no column in my books.",
        },
        ja: {
          name: "クォン・ドヒョン",
          role: "ブリッジ銀行 企業構造改善部 審査役 · フロウオン創業者クォン・テホの長男",
          text: [
            "ブリッジ銀行で、経営難に陥った企業の構造改善を審査する審査役であり、物流プラットフォーム「フロウオン」を創業したクォン・テホの長男です。袖がてかてかになったグレーのスーツ、父の会社のロゴが入った古いボールペンが彼のいでたちです。フロウオンが再び崖っぷちに立たされたとき、彼は交渉テーブルの一方に座ります。",
            "彼はあらゆる助けを損益計算書に置き換えてから受け取ります。話す前に白紙に縦線を一本引き、左に得るもの、右に失うものを書き込みます。冷たく見えますが、彼の描く表には、会社に残る社員と代金を待つ協力会社が一つ残らず入っています。",
          ],
          line: "助けるというお言葉は、計算書でお願いします。同情を書き込む欄は、私の帳簿にはありません。",
        },
      },
      {
        key: "강태민",
        portrait: "/portrait-kang-taemin.webp",
        ko: {
          name: "강태민",
          role: "플로우온 풀필먼트센터 야간조 반장 · 창업 첫해 입사",
          text: [
            "플로우온 풀필먼트센터의 야간조 반장으로, 회사가 처음 문을 연 해에 입사했습니다. 형광 조끼 차림이고, 주머니에는 늘 컵라면 두 개가 들어 있습니다. 2023년 실사 때 새벽의 물류센터에서 당신과 처음 마주쳤고, 은행에서 왔다는 당신에게 정규직 전환을 2년째 기다리는 계약직 동료들의 약속이 어떻게 되느냐고 먼저 묻습니다.",
            "짧게 말하고, 말한 것은 지킵니다. 그는 숫자로 계산되지 않는 사람의 하루를 대신 말해 주는 사람이고, 새벽 네 시의 컨베이어 앞에서 일하는 동료들의 이름을 먼저 떠올립니다. 낮에 다시 오라는 말로, 그는 당신에게 현장의 다른 얼굴을 보여 주려 합니다.",
          ],
          line: "낮에 오라니까. 여기 낮에는 사람 사는 데 같다고 했잖아요.",
        },
        en: {
          name: "Kang Taemin",
          role: "Night-shift foreman, FlowOn fulfillment center · hired in the founding year",
          text: [
            "The night-shift foreman at FlowOn's fulfillment center, hired in the year the company opened. He wears a high-visibility vest and always keeps two cup noodles in his pocket. You first meet him in the warehouse before dawn during the 2023 review, and he asks you, the person from the bank, what will happen to the promise of permanent jobs his contract coworkers have waited two years for.",
            "He speaks briefly and keeps his word. He speaks for the days of people that no number accounts for, and thinks first of the names of coworkers at the conveyor at four in the morning. By telling you to come back in daylight, he tries to show you another face of the floor.",
          ],
          line: "I told you to come by day. I said in the daytime this place feels like somewhere people live.",
        },
        ja: {
          name: "カン・テミン",
          role: "フロウオン フルフィルメントセンター夜間班長 · 創業初年度入社",
          text: [
            "フロウオンのフルフィルメントセンターで夜間班の班長を務め、会社が初めて門を開いた年に入社しました。蛍光色のベスト姿で、ポケットにはいつもカップラーメンが二つ入っています。2023年の実査のとき、夜明け前の物流センターで初めてあなたと顔を合わせ、銀行から来たというあなたに、正社員化を2年待っている契約社員の仲間たちとの約束はどうなるのかを真っ先に尋ねます。",
            "言葉は短く、口にしたことは守ります。数字では計算されない人の一日を代わりに語る人で、午前四時のコンベヤーの前で働く仲間たちの名前をまず思い浮かべます。昼にまた来いという言葉で、彼はあなたに現場のもう一つの顔を見せようとします。",
          ],
          line: "昼に来いって言ったでしょう。ここは昼なら人の住む場所みたいだって言ったじゃないですか。",
        },
      },
    ],
  },
  {
    id: "outside",
    title: { ko: "바깥에서 오는 사람들", en: "People from outside", ja: "外からやって来る人々" },
    people: [
      {
        key: "문가을",
        portrait: "/portrait-moon-gaeul.webp",
        ko: {
          name: "문가을",
          role: "피해자 모임 대표 · 망원시장 가을떡방 사장",
          text: [
            "망원시장에서 떡집을 하는 사장입니다. 2023년, 남편이 운영하는 작은 공장 문 앞에서 쌀가루 묻은 손으로 떡 상자를 건네며 '우리는 잘 몰라서, 은행이 된다고 하면 되는 줄 안다'고 말하던 사람으로 처음 등장합니다. 시간이 흐른 뒤, 은행 창구에서 돈을 빌렸던 사람들이 모인 피해자 모임의 대표가 되어 다시 당신 앞에 섭니다.",
            "벗지 않는 앞치마와 떡 칼에 베인 손가락의 밴드가 그의 차림입니다. 시장 사람의 속도로 말하고, 화가 날수록 존댓말이 또렷해집니다. 그는 고맙다는 말 대신 왜 막지 못했느냐고 묻는 사람이고, 숫자로 정리된 명단을 다시 얼굴과 가게와 이름으로 되돌려 놓는 사람입니다.",
          ],
          line: "고맙다는 말 들으러 오셨으면 잘못 오셨어요. 떡이나 쪄요.",
        },
        en: {
          name: "Moon Gaeul",
          role: "Head of the victims' group · owner of Gaeul Rice Cake Shop, Mangwon Market",
          text: [
            "She runs a rice cake shop in Mangwon Market. She first appears in 2023 at the gate of the small factory her husband runs, handing over boxes of rice cakes and saying that people like them do not know much, so if the bank says it works, they believe it. Later she stands before you again as head of a group of people who borrowed at the bank's counters.",
            "An apron she never takes off and a bandage on a finger cut by her rice cake knife are her look. She talks at market speed, and the angrier she gets, the more precise her politeness becomes. Instead of thanks she asks why nobody stopped it, and she turns a list of numbers back into faces, shops and names.",
          ],
          line: "If you came to hear thank you, you came to the wrong place. Go steam some rice cakes.",
        },
        ja: {
          name: "ムン・ガウル",
          role: "被害者の会代表 · マンウォン市場「ガウル餅房」店主",
          text: [
            "マンウォン市場で餅屋を営む店主です。2023年、夫が営む小さな工場の門の前で、米粉のついた手で餅の箱を差し出しながら「私たちはよく分からないから、銀行が大丈夫と言えば大丈夫だと思うんです」と話す人物として初めて登場します。時がたち、銀行の窓口でお金を借りた人々が集まる被害者の会の代表となって、再びあなたの前に立ちます。",
            "決して外さないエプロンと、餅切り包丁で切った指の絆創膏が彼女のいでたちです。市場の人の速さで話し、腹が立つほど敬語がはっきりしてきます。お礼の代わりに、なぜ止められなかったのかと問う人であり、数字で整理された名簿を、もう一度顔と店と名前に戻していく人です。",
          ],
          line: "お礼を言われに来られたのなら、来るところを間違えました。餅でも蒸してますよ。",
        },
      },
      {
        key: "문하준",
        portrait: "/portrait-moon-hajun.webp",
        ko: {
          name: "문하준",
          role: "KD은행 청소년 금융 인턴 · 고등학교 2학년 · 문가을의 아들",
          text: [
            "문가을의 아들로, 고등학교 2학년입니다. 모서리가 닳은 스케치북을 늘 끼고 다니고, 대답을 모르면 일단 스케치북부터 펴서 그림을 그립니다. 겨울방학에는 교복 위에 인턴 명찰을 달고 KD은행 강서지점에서 청소년 금융 인턴으로 일하게 됩니다.",
            "그는 은행이 어떻게 판단하는지 처음 배우는 눈으로, 은행이 설명하지 않는 것을 곧장 묻습니다. 어른들이 대답을 돌리면 같은 질문을 한 번 더 합니다. 창구 배치도를 그려 붙이고 어르신들에게 통장 정리 기계를 안내하는 사이, 그의 단순한 질문은 전문가들이 너무 당연하게 여기던 규칙을 다시 보게 만듭니다.",
          ],
          line: "파는 법 말고, 안 파는 법은 안 가르쳐 줘요?",
        },
        en: {
          name: "Moon Hajun",
          role: "Youth finance intern, KD Bank · 2nd year of high school · Moon Gaeul's son",
          text: [
            "Moon Gaeul's son, in his second year of high school. He always has a sketchbook with worn corners under his arm, and when he does not know an answer he opens it and starts drawing. Over the winter break he pins an intern badge to his school uniform and works as a youth finance intern at KD Bank's Gangseo branch.",
            "With the eyes of someone learning for the first time how a bank decides things, he asks straight out about what the bank does not explain. When adults dodge, he asks the same question again. Between drawing a floor plan of the counters and showing older customers to the passbook machine, his simple questions make the experts look again at rules they took for granted.",
          ],
          line: "You teach how to sell. Don't you teach how not to sell?",
        },
        ja: {
          name: "ムン・ハジュン",
          role: "KD銀行 青少年金融インターン · 高校2年生 · ムン・ガウルの息子",
          text: [
            "ムン・ガウルの息子で、高校2年生です。角のすり切れたスケッチブックをいつも抱えていて、答えが分からないときはまずスケッチブックを開いて絵を描きます。冬休みには制服の上にインターンの名札をつけ、KD銀行カンソ支店で青少年金融インターンとして働くことになります。",
            "銀行がどう判断するのかを初めて学ぶ目で、銀行が説明しないことをまっすぐに尋ねます。大人がはぐらかすと、同じ質問をもう一度します。窓口の配置図を描いて貼り出し、お年寄りを通帳記入機へ案内するあいだに、彼の素朴な問いは、専門家たちが当たり前だと思っていた規則を見直させます。",
          ],
          line: "売り方じゃなくて、売らない方法は教えてくれないんですか？",
        },
      },
      {
        key: "서하린",
        portrait: "/portrait-seo-harin.webp",
        ko: {
          name: "서하린",
          role: "탐사보도 매체 리드라인 기자 · 7년차",
          text: [
            "탐사보도 매체 리드라인의 7년차 기자입니다. 소매를 걷은 후드 집업, 볼펜 대신 쥔 형광펜, 편집국 고양이 사진이 배경화면인 휴대폰이 그의 표시입니다. 기자 열한 명과 고양이 한 마리가 있는 작은 편집국에서, 닫힌 방에서 일어난 일을 모두가 보는 곳으로 끌어내는 일을 합니다.",
            "빠르고 건조하게 묻고, 마지막 질문에서만 목소리를 낮춥니다. 그는 누구의 편도 아니라고 분명히 말합니다. 그가 쓰는 것은 증명할 수 있는 쪽이고, 기사가 나갈 때 그 대가로 누가 드러나는지까지 계산하는 사람입니다.",
          ],
          line: "제가 쓰는 건 당신 편이 아니에요. 당신이 증명할 수 있는 쪽이에요.",
        },
        en: {
          name: "Seo Harin",
          role: "Reporter, investigative outlet Leadline · 7 years in",
          text: [
            "A reporter in her seventh year at the investigative outlet Leadline. A hoodie with the sleeves pushed up, a highlighter in place of a pen and a phone whose wallpaper is the newsroom cat are her signs. In a small newsroom of eleven reporters and one cat, her job is to drag what happened behind closed doors into a place where everyone can see it.",
            "She asks questions fast and dry, lowering her voice only for the last one. She says plainly that she is on nobody's side. What she writes is the side that can be proved, and she also works out who will be exposed as the price when the story runs.",
          ],
          line: "I'm not writing for your side. I'm writing for the side you can prove.",
        },
        ja: {
          name: "ソ・ハリン",
          role: "調査報道メディア「リードライン」記者 · 7年目",
          text: [
            "調査報道メディア「リードライン」の7年目の記者です。袖をまくったジップアップパーカー、ボールペンの代わりに握る蛍光ペン、編集部の猫の写真を待ち受けにしたスマートフォンが彼女の印です。記者11人と猫1匹の小さな編集部で、閉ざされた部屋で起きたことを、皆が見える場所へ引き出す仕事をしています。",
            "速く乾いた口調で問い、最後の質問のときだけ声を落とします。彼女は誰の味方でもないとはっきり言います。彼女が書くのは証明できる側であり、記事が出るとき、その代償として誰があらわになるのかまで計算する人です。",
          ],
          line: "私が書くのはあなたの味方じゃありません。あなたが証明できる側です。",
        },
      },
    ],
  },
];
