/**
 * Spoiler-free case pages, 14-22: setting, premise, cast and question per case
 * in Korean, English and Japanese, written from the first two scenes of each case
 * (scripts/content-pages/cases.mjs renders them). Nothing past a case's second scene.
 */
export default {
  case14: {
    ko: {
      setting: "10월 말 · 트리거랩 4층 → KD은행 강서지점 창구 → 판교 KD자산운용 운용실 → 강서 노인복지관 금융 교실 → 강서지점 객장",
      premise: [
        "월요일에 원래 부서로 돌아갈 줄 알았던 복귀 명단에 '보류' 두 글자가 붙었습니다. 당신과 동료들은 여전히 트리거랩 4층에 남아 있고, 책상 위에는 KD은행 창구에서 팔리는 '상생 ESG 펀드' 서류가 놓입니다. 2주 만에 1,070억 원어치가 팔렸고, 가입한 3,146명의 평균 나이는 71세입니다. 예금 만기가 돌아온 은퇴자들이 창구에서 권유를 받고 맡긴 돈입니다.",
        "문제는 그 돈으로 사들인 것입니다. 펀드에는 그룹 계열사(같은 그룹에 속한 다른 회사)의 대출 38건이 담겨 있는데, 모두 돌려받기 어려워진 부실채권이고, 당신이 오래 쫓아 온 플로우온 대출의 남은 조각도 섞여 있습니다. 이름은 '상생'인데, 그룹이 떠안아야 할 손실이 누구의 통장으로 옮겨 가는지는 아무도 소리 내어 말하지 않습니다.",
        "도윤하가 판매 대본 둘째 장을 손가락으로 짚습니다. '은행이 망하지 않는 한 걱정 안 하셔도 돼요.' 3년 전 같은 강서지점 창구에서 그가 직접 쓰던 문장입니다. 위험을 제대로 설명하지 않고 파는 불완전판매가, 이번에는 그의 말투로 되풀이되고 있습니다.",
        "당신은 현장으로 갑니다. 백발 가발을 쓴 강태민이 질문 22개를 밤새 외운 '은퇴한 일흔세 살 손님'으로 창구에 앉고, 아들 역의 오진우는 '형님, 일흔셋은 그런 거 안 물어요'라고 속삭입니다. 웃음이 터질 것 같은 잠입 점검 바로 옆 창구에서, 한 할머니가 직원의 설명을 한 글자씩 노트에 받아 적고 있습니다. 그런데 그 설명 어디에도 '3년 동안 돈을 뺄 수 없다'는 말은 나오지 않습니다.",
      ],
      cast: [
        { name: "도윤하", note: "트리거랩 현장 담당. 강서지점 창구 출신으로, 펀드 판매 대본에서 3년 전 자기 문장을 발견합니다." },
        { name: "강태민", note: "플로우온 물류센터 야간조 반장. 이번에는 미스터리 쇼퍼(손님인 척 판매를 점검하는 사람)로 변장해 창구에 앉습니다." },
        { name: "오진우", note: "트리거랩의 경쟁 분석관. 강태민의 '아들' 역을 맡아 점검에 따라나섭니다." },
        { name: "이정숙", note: "옆 창구의 72세 가입 고객, 전직 초등학교 교사. 2,400만 원을 맡기며 설명을 꼼꼼히 받아 적습니다." },
      ],
      question: "가장 친절한 말로 팔리는 상품 앞에서, 판매를 멈출지, 절차를 고칠지, 돈의 길을 끝까지 쫓을지 당신은 무엇부터 고르겠습니까? 그리고 그 선택이 늦어지는 동안 창구에서는 누가 또 서명하게 될까요?",
    },
    en: {
      setting: "Late October · Trigger Lab, 4th floor → KD Bank Gangseo Branch windows → KD Asset Management trading floor, Pangyo → money class at the Gangseo senior welfare center → Gangseo Branch lobby",
      premise: [
        "The list that was supposed to send everyone back to their old departments on Monday comes back stamped 'on hold.' You and your colleagues are still on the 4th floor of Trigger Lab, and on your desk lands the paperwork for the 'Sangsaeng ESG Fund,' sold at KD Bank windows. It moved 107 billion won in two weeks. Its 3,146 buyers are 71 years old on average: retirees whose deposits had just matured, talked into it at the counter.",
        "The trouble is what that money bought. The fund holds 38 loans to group affiliates, every one of them non-performing, plus the leftover piece of the FlowOn loan you have been chasing for so long. The name means 'shared prosperity.' Nobody says out loud whose savings the group's losses are quietly moving into.",
        "Do Yoonha taps page two of the sales script. 'As long as the bank doesn't fail, you have nothing to worry about.' It is his own sentence, the one he used at this same Gangseo counter three years ago. The mis-selling is happening again, and this time it sounds like him.",
        "So you go and see for yourself. Kang Taemin, in a white wig, sits down at the window as a 'retired seventy-three-year-old' who memorized all 22 questions overnight, while Oh Jinwoo, cast as his son, whispers that seventy-three-year-olds don't ask about subordinated holdings. Right beside this half-comic undercover check, an elderly woman is copying the teller's explanation into her notebook word by word. Nowhere in that explanation does anyone mention that the money is locked up for three years.",
      ],
      cast: [
        { name: "Do Yoonha", note: "Trigger Lab's field officer and a former Gangseo Branch teller. He finds his own words from three years ago in the fund's sales script." },
        { name: "Kang Taemin", note: "Night-shift foreman at FlowOn's fulfillment center, now in disguise as a mystery shopper checking how the fund is sold." },
        { name: "Oh Jinwoo", note: "Your rival analyst at Trigger Lab, tagging along as Kang Taemin's 'son.'" },
        { name: "Lee Jungsook", note: "A 72-year-old retired elementary school teacher at the next window, putting in 24 million won and writing down every word." },
      ],
      question: "When a product is sold with the kindest possible words, do you stop the sales, fix the process, or follow the money to the end? And while you decide, who else signs at the counter?",
    },
    ja: {
      setting: "10月末 · トリガーラボ4階 → KD銀行カンソ支店の窓口 → パンギョのKD資産運用 運用室 → カンソ老人福祉館の金融教室 → カンソ支店のロビー",
      premise: [
        "月曜日に元の部署へ戻れるはずだった復帰名簿に、「保留」の二文字が付きました。あなたと同僚たちはトリガーラボの4階に残ったままで、机の上にはKD銀行の窓口で売られている「共生ESGファンド」の書類が置かれます。2週間で1,070億ウォンが売れ、加入者3,146人の平均年齢は71歳。預金の満期を迎えた退職者たちが、窓口で勧められて預けたお金です。",
        "問題は、そのお金で何を買ったかです。ファンドにはグループ系列会社(同じグループに属する別の会社)の融資38件が入っていて、どれも返済が見込みにくい不良債権です。あなたが長く追ってきたフロウオン融資の残りのかけらも混ざっています。名前は「共生」なのに、グループが抱えるはずの損失が誰の通帳へ移っていくのか、声に出して言う人はいません。",
        "ト・ユナが販売台本の2枚目を指でたたきます。「銀行がつぶれない限り、心配いりませんよ」。3年前、同じカンソ支店の窓口で彼自身が使っていた文です。リスクをきちんと説明せずに売る不完全販売が、今度は彼の口調で繰り返されているのです。",
        "あなたは現場へ向かいます。白髪のかつらをかぶったカン・テミンが、質問22項目を徹夜で覚えた「引退した七十三歳の客」として窓口に座り、息子役のオ・ジヌは「七十三歳はそんなこと訊きませんよ」とささやきます。思わず笑いそうになる潜入点検のすぐ隣の窓口で、ひとりのおばあさんが行員の説明を一字ずつノートに書き取っています。けれどもその説明のどこにも、「3年間お金を引き出せない」という話は出てきません。",
      ],
      cast: [
        { name: "ト・ユナ", note: "トリガーラボの現場担当で、カンソ支店の窓口出身。ファンドの販売台本の中に、3年前の自分の文を見つけます。" },
        { name: "カン・テミン", note: "フロウオンの物流センター夜間班の班長。今回はミステリーショッパー(客を装って販売を点検する人)に変装して窓口に座ります。" },
        { name: "オ・ジヌ", note: "トリガーラボのライバル分析官。カン・テミンの「息子」役として点検に同行します。" },
        { name: "イ・ジョンスク", note: "隣の窓口にいる72歳の加入者で、元小学校教師。2,400万ウォンを預けながら、説明を丁寧に書き取っています。" },
      ],
      question: "いちばん親切な言葉で売られる商品を前に、販売を止めるか、手続きを直すか、お金の流れを最後まで追うか。あなたは何から選びますか。そして迷っているあいだに、窓口では誰がまた署名するのでしょうか。",
    },
  },
  case15: {
    ko: {
      setting: "11월 수능 주간 · 트리거랩 4층 → KD은행 본점 인사부 면담실 → 해방촌 옥탑방 → 수능 고사장 교문 → 본점 인사부 면접장",
      premise: [
        "인사부 채용 담당 채윤슬 과장이 귤 한 봉지와 봉투를 들고 트리거랩 4층에 올라옵니다. '좋은 소식 들고 왔어요!' 트리거랩의 3년차 계약직 이민서가 정규직 전환 서류 심사를 통과했다는 소식입니다. 최종 면접은 다음 주 목요일 오전 8시 40분, 본점 인사부입니다. 오래 기다려 온 순간처럼 보입니다.",
        "그런데 일곱 쪽짜리 서류의 마지막 장은 축하 카드가 아니라 확인서입니다. 유출 소동 때 접속 기록에 생긴 11초 공백이 '본인의 단말 조작 실수'였다고 인정하라는 문장, 그리고 '향후 어떠한 이의도 제기하지 않는다'는 마지막 줄이 있습니다. 국정감사(국회가 공개적으로 따져 묻는 자리)에서 '누군가 고친 흔적'이라 불렸던 그 11초가, 서명 한 번이면 계약직 한 사람의 손가락 실수로 정리됩니다.",
        "'참고 자료라면서, 서명 안 하면 왜 탈락이에요?' 이민서가 묻자 채윤슬은 모니터를 돌려 보여 줍니다. 보낸 부서 이름이 없는 메일, 그리고 그가 누를 수 있는 버튼은 '전달 완료' 하나뿐입니다. 돌려보낼 칸이 없는 양식입니다. 문구를 고쳐 달라는 요청은 단 한 번, 수요일 오후 6시까지만 올릴 수 있습니다.",
        "이민서의 책상 달력에는 목요일에 빨간 동그라미가 있습니다. 고3 동생 이찬빈의 수능 날이고, 시험장 입실 마감은 오전 8시 10분입니다. 면접장과 고사장 교문 사이에서, 당신은 이민서의 서명을 대신 정할 수 없습니다. 이번 사건에서 당신이 고를 수 있는 것은 그의 곁에 서는 방식뿐입니다.",
      ],
      cast: [
        { name: "이민서", note: "트리거랩 데이터 기록 담당, 3년차 계약직. 기다리던 정규직 전환과 자기 이름이 걸린 11초 사이에 놓입니다." },
        { name: "채윤슬", note: "KD은행 인사부 채용 담당 과장, 창구 계약직 출신. 웃으며 서류를 건네지만, 그 서류를 돌려보낼 권한은 그의 양식에 없습니다." },
        { name: "이찬빈", note: "이민서의 남동생, 고3 수험생. 누나의 면접 날이 바로 그의 수능 날입니다." },
      ],
      question: "'반려' 칸이 없는 종이 한 장 앞에서, 다른 사람의 선택을 빼앗지 않고 곁을 지키는 일은 어떤 모습일까요? 그리고 11초의 진실은 정말 한 사람의 서명으로 정리되어도 괜찮은 걸까요?",
    },
    en: {
      setting: "Exam week in November · Trigger Lab, 4th floor → KD Bank head office HR meeting room → a rooftop room in Haebangchon → the gate of an exam venue → head office HR interview room",
      premise: [
        "Chae Yoonseul, the HR recruiting manager, comes up to Trigger Lab's 4th floor with a bag of tangerines and an envelope. 'I've brought good news!' Lee Minseo, a contract worker in her third year at the lab, has passed the document review for a permanent position. The final interview is next Thursday at 8:40 a.m. at head office. It looks like the moment she has been waiting for.",
        "But the last of the seven pages is not a congratulations card. It is a confirmation form. It asks her to state that the 11-second gap in the access log during the leak scare was caused by her own terminal error, and its last line says she will raise no objection, ever. The same 11 seconds that a parliamentary audit called 'traces of someone's tampering' would become one contract worker's slip of the finger with a single signature.",
        "'If it's only reference material, why do I fail if I don't sign?' Lee Minseo asks. Chae Yoonseul turns her monitor around: an email with no department named as its sender, and exactly one button she is allowed to press, 'Forwarded.' Her form has no box for returning it. Lee Minseo gets one request to change the wording, due by 6 p.m. Wednesday.",
        "On Lee Minseo's desk calendar, Thursday is circled in red. It is the day her younger brother Lee Chanbin sits the national college entrance exam, and check-in at the exam hall closes at 8:10 a.m. Between the interview room and the school gate, you cannot make her choice for her. In this case, the only thing you get to choose is how you stand beside her.",
      ],
      cast: [
        { name: "Lee Minseo", note: "Trigger Lab's data records officer, three years on a contract. She is caught between the permanent job she wanted and 11 seconds with her name on them." },
        { name: "Chae Yoonseul", note: "KD Bank's HR recruiting manager, once a contract teller herself. She delivers the papers with a smile, but her form gives her no way to refuse them." },
        { name: "Lee Chanbin", note: "Lee Minseo's younger brother, a high school senior. His exam falls on the morning of her interview." },
      ],
      question: "Faced with a form that has no 'return' box, what does it look like to stand by someone without taking their choice away? And should the truth about 11 seconds really be settled by one person's signature?",
    },
    ja: {
      setting: "11月 修能の週 · トリガーラボ4階 → KD銀行本店 人事部の面談室 → ヘバンチョンの屋上部屋 → 修能の試験会場の校門 → 本店人事部の面接会場",
      premise: [
        "人事部の採用担当、チェ・ユンスル課長が、ミカン一袋と封筒を手にトリガーラボの4階へ上がってきます。「いい知らせを持ってきましたよ!」。トリガーラボで3年目の契約社員イ・ミンソが、正社員転換の書類審査に通ったという知らせです。最終面接は来週木曜の午前8時40分、本店人事部。長く待っていた瞬間のように見えます。",
        "ところが7ページの書類の最後の1枚は、お祝いのカードではなく確認書です。流出騒動のときアクセス記録に生じた11秒の空白は「本人の端末操作ミス」によるものだと認める文、そして「今後いかなる異議も申し立てない」という最後の行。国政監査(国会が公開の場で問いただす場)で「誰かが直した痕跡」と呼ばれたあの11秒が、署名ひとつで契約社員ひとりの指のミスとして片付けられてしまいます。",
        "「参考資料なのに、署名しないとどうして不合格なんですか?」。イ・ミンソが尋ねると、チェ・ユンスルはモニターをこちらに向けます。送信部署の名前のないメール、そして彼女が押せるボタンは「伝達完了」ひとつだけ。差し戻す欄のない書式です。文言の調整を頼めるのは一度だけ、水曜の18時までです。",
        "イ・ミンソの卓上カレンダーには、木曜日に赤い丸が付いています。高校3年の弟イ・チャンビンの修能(大学入試の共通試験)の日で、試験会場の入室締め切りは午前8時10分。面接会場と試験会場の校門のあいだで、あなたが彼女の署名を代わりに決めることはできません。この事件であなたが選べるのは、彼女の隣にどう立つか、それだけです。",
      ],
      cast: [
        { name: "イ・ミンソ", note: "トリガーラボのデータ記録担当で、3年目の契約社員。待ち望んだ正社員転換と、自分の名前が懸かった11秒のあいだに、ひとりで立たされます。" },
        { name: "チェ・ユンスル", note: "KD銀行人事部の採用担当課長で、窓口の契約社員出身。笑顔で書類を渡しますが、それを差し戻す権限は彼女の書式にありません。" },
        { name: "イ・チャンビン", note: "イ・ミンソの弟で、高校3年の受験生。姉の面接の日が、ちょうど彼の修能の日に重なっています。" },
      ],
      question: "「差し戻し」欄のない一枚の紙を前に、相手の選択を奪わずにそばにいるとは、どういうことでしょうか。そして11秒の真実は、本当にひとりの署名で片付けてよいのでしょうか。",
    },
  },
  case16: {
    ko: {
      setting: "11월 말 첫눈 · 트리거랩 4층 → 플로우온 풀필먼트센터 물류 현장 → 을지로 KD캐피탈 심사팀 → 센터 옥상 → KD캐피탈 리스 승인위원회",
      premise: [
        "강태민이 인사 대신 휴대폰을 내밉니다. '12월 31일부로 계약이 종료됨을 안내드립니다. 그동안 수고 많으셨습니다.' 문자가 온 시각은 새벽 4시 12분, 플로우온 풀필먼트센터(주문받은 물건을 보관하고 포장해 내보내는 물류 창고)의 야간조 80명이 한창 상자를 들고 있던 때입니다. 당신이 처음 이 센터에 왔던 새벽, 컵라면을 뜯어 주던 바로 그 반장입니다. '저는 괜찮아요. 80명 중에 30명이 안 괜찮아요.'",
        "빈자리를 채울 것은 물류 로봇 120대입니다. 사들이는 게 아니라 KD캐피탈 리스(장비를 빌려 쓰고 매달 사용료를 내는 금융)로 들여오며, 한 달 리스료만 3억 4천만 원입니다. 이 리스를 승인할지 정하는 위원회까지 남은 시간은 6일입니다.",
        "현장에는 이미 시범 로봇 네 대가 돌고 있습니다. 야간조는 그중 한 대를, 주황 불빛 두 개가 다람쥐 볼 같다며 '다람이'라고 부릅니다. 막내 유하온이 판을 벌입니다. 반장님 대 다람이, 30분 피킹(창고에서 주문받은 물건을 찾아 꺼내는 일) 대결입니다. 결과는 212건 대 198건, 사람이 이깁니다. 그런데 강태민이 허리를 짚고 주저앉는 사이, 다람이는 삑 소리와 함께 아무렇지 않게 199번째 주문을 집어 듭니다.",
        "그 장면을 지켜보던 KD캐피탈 심사역 최서진이 조용히 말합니다. '저 로봇은 허리가 없어요. 그래서 들였으면 하는 거예요.' 하루 22시간을 일하고 2시간만 충전하는 기계 앞에서, 사람을 위험한 일에서 빼 주는 일과 사람을 내보내는 일은 어디서 갈라지는 걸까요.",
      ],
      cast: [
        { name: "강태민", note: "플로우온 풀필먼트센터 야간조 반장, 창업 첫해부터 일해 왔습니다. 자기보다 동료 30명의 내일을 먼저 걱정합니다." },
        { name: "최서진", note: "KD캐피탈 리스 심사역, 입사 3년차. 로봇 리스를 심사하러 현장에 나와 있습니다." },
        { name: "유하온", note: "야간조 막내, 24세. 시범 로봇 다람이와 누구보다 가깝고, 이번 대결을 처음 제안한 사람입니다." },
        { name: "다람이", note: "시범 운영 중인 물류 로봇. 야간조가 붙여 준 이름이 있고, 지치지 않고 주문을 집습니다." },
      ],
      question: "로봇 120대를 들이는 계약서 안에, 떠나는 80명이 갈 길도 함께 적을 수 있을까요? 새벽 문자 한 통이 아닌 다른 길을 만든다면, 그 비용은 누가 치르게 될까요?",
    },
    en: {
      setting: "Late November, first snow · Trigger Lab, 4th floor → FlowOn fulfillment center floor → KD Capital review team, Euljiro → the center's rooftop → KD Capital lease approval committee",
      premise: [
        "Instead of saying hello, Kang Taemin holds out his phone. '[FlowOn] This is to inform you that your contract ends as of December 31. Thank you for all your hard work.' The text went out at 4:12 a.m., while the 80 people on the night shift at the FlowOn fulfillment center were in the middle of hauling boxes. This is the foreman who opened cup noodles for you on your very first dawn here. 'I'm fine,' he says. '30 of the 80 aren't.'",
        "What replaces them is 120 logistics robots. FlowOn is not buying them; it is leasing them from KD Capital, paying 340 million won a month. The committee that decides whether to approve that lease meets in six days.",
        "Four trial robots are already running on the floor. The night shift has nicknamed one of them 'Darami,' because its two orange lights look like a squirrel's cheeks. Yoo Haon, the youngest on the crew, sets up a match: the foreman against Darami, thirty minutes of picking orders off the shelves. The human wins, 212 to 198. But while Kang Taemin clutches his back and sinks to the floor, Darami beeps and calmly picks order number 199.",
        "Choi Seojin, the KD Capital credit officer reviewing the lease on site, says quietly, 'That robot has no back. That's why they want it.' Facing a machine that works 22 hours a day and charges for two, where is the line between taking people out of dangerous work and simply showing them the door?",
      ],
      cast: [
        { name: "Kang Taemin", note: "Night-shift foreman at the FlowOn fulfillment center, there since the company's first year. He worries about thirty coworkers before himself." },
        { name: "Choi Seojin", note: "A KD Capital lease credit officer in her third year, on site to review the robot lease." },
        { name: "Yoo Haon", note: "The night shift's youngest, 24. Closer to Darami than anyone, and the one who proposed the contest." },
        { name: "Darami", note: "A trial logistics robot with a name the night shift gave it, picking orders without ever getting tired." },
      ],
      question: "Can the contract that brings in 120 robots also spell out where the 80 departing workers go? And if there is to be a path out other than a single text before dawn, who pays for it?",
    },
    ja: {
      setting: "11月末 初雪 · トリガーラボ4階 → フロウオン フルフィルメントセンターの物流現場 → ウルチロのKDキャピタル審査チーム → センターの屋上 → KDキャピタルのリース承認委員会",
      premise: [
        "カン・テミンが挨拶の代わりに携帯電話を差し出します。「12月31日付で契約が終了することをお知らせします。これまで大変お疲れさまでした」。送られてきたのは明け方4時12分、フロウオンのフルフィルメントセンター(注文の品を保管し、梱包して出荷する物流倉庫)で、夜間班80人が箱を抱えていた時間です。あなたが初めてこのセンターに来た明け方、カップ麺を開けてくれたあの班長です。「俺は大丈夫です。80人のうち30人が大丈夫じゃないんです」。",
        "空いた場所を埋めるのは、物流ロボット120台です。買うのではなく、KDキャピタルのリース(設備を借りて使い、毎月使用料を払う金融)で入れるもので、月のリース料だけで3億4千万ウォン。このリースを承認するかどうかを決める委員会まで、残り6日です。",
        "現場ではすでに試験ロボットが4台動いています。夜間班はそのうちの1台を、オレンジ色のランプ二つがリスの頬のようだからと「ダラミ」と呼んでいます。いちばん若いユ・ハオンが勝負を仕掛けます。班長対ダラミ、30分のピッキング(倉庫で注文の品を探して取り出す作業)対決。結果は212件対198件で、人間の勝ちです。ところがカン・テミンが腰を押さえてしゃがみ込むあいだに、ダラミはピッという音とともに、何事もなかったように199件目の注文をつかみます。",
        "その様子を見ていたKDキャピタルの審査役チェ・ソジンが、静かに言います。「あのロボットには腰がありません。だから入れたいんです」。1日22時間働き、2時間だけ充電する機械を前に、人を危険な仕事から外すことと、人を外へ出すことは、どこで分かれるのでしょうか。",
      ],
      cast: [
        { name: "カン・テミン", note: "フロウオン フルフィルメントセンターの夜間班長で、創業の年から働いてきました。自分より先に、仲間30人の明日を心配しています。" },
        { name: "チェ・ソジン", note: "KDキャピタルのリース審査役で、入社3年目。ロボットのリースを審査するために現場に来ています。" },
        { name: "ユ・ハオン", note: "夜間班の最年少、24歳。試験ロボットのダラミと誰よりも仲がよく、今回の対決を言い出した本人です。" },
        { name: "ダラミ", note: "試験運用中の物流ロボット。夜間班が付けた名前を持ち、疲れることなく注文をつかみ続けます。" },
      ],
      question: "ロボット120台を入れる契約書の中に、去っていく80人の行き先も書き込めるでしょうか。明け方のメッセージ一通ではない道を作るなら、その代償は誰が払うのでしょうか。",
    },
  },
  case17: {
    ko: {
      setting: "12월 중순 · 트리거랩 4층 → 상암동 공원 주차장 푸드트럭 → 문래동 폐업한 사무실 → 본사 법무팀 회의실 → 인사위원회실 앞 복도",
      premise: [
        "책상 위에 그룹 법무팀이 보낸 내용증명(누가 언제 무엇을 요구했는지 우체국이 증명해 주는 편지)이 놓여 있습니다. 반재욱의 수첩은 회사 기록물이니 돌려주고, 12월 19일 인사위원회(직원의 징계나 자리 이동을 정하는 회의)에 증거로 내라는 요구입니다. 그 회의의 안건은 다름 아닌 당신의 '부당 조사 개입'입니다. 수첩을 법원에 내 달라는 신청도 걸려 있지만, 그 심문은 인사위원회가 끝난 뒤에야 열립니다.",
        "감사팀 조사역 반재욱이 표지가 닳은 검은 수첩을 내용증명 옆에 내려놓습니다. 안에는 47명의 이름이 있습니다. 그가 20년 동안 감사로 회사에서 내보낸 사람들이고, 맨 뒷장에는 연필로 쓴 한 줄이 있습니다. '넘기기 전에 한 명씩 찾아가 보려고 합니다. 같이 가시겠습니까.' 근거와 순서만 따지던 사람이, 이번에는 순서를 바꾸려 합니다.",
        "첫 번째 이름은 상암동 공원 주차장에 서 있는 푸드트럭 '태오네 떡꼬치'에 있습니다. 7년 전 해고된 KD은행 구로지점의 정태오 대리입니다. 그는 공짜로 떡꼬치를 주는 대신 소스 통을 흔들라고 하고, 감색 코트를 입은 반재욱은 줄 선 손님에게 '임시직입니다'라고 답하며 정말로 소스 통을 흔듭니다.",
        "줄이 끊기자 정태오가 입을 엽니다. 지점장이 말로 불러 준 지시, 대출 서류의 날짜를 앞당기라는 말을 받아 적었을 뿐인데, 감사가 왔을 때 남은 건 자기 글씨뿐이었다고. 지시한 지점장은 아무 징계 없이 정년퇴임했습니다. 그리고 그가 묻습니다. '그 수첩에, 나는 뭐라고 적혀 있어요?'",
      ],
      cast: [
        { name: "반재욱", note: "KD금융그룹 감사팀 조사역. 20년 동안 써 온 검은 수첩을 넘기기 전에, 그 안의 사람들을 직접 만나려 합니다." },
        { name: "정태오", note: "푸드트럭 '태오네 떡꼬치' 사장, 전 KD은행 구로지점 기업대출 대리. 수첩 첫 장에 이름이 적힌 사람입니다." },
      ],
      question: "이름이 적힌 목록은 사람을 지킬 수도, 다시 불러내 벌할 수도 있습니다. 47명의 이름이 담긴 수첩을 법원에 낼까요, 이름의 주인들에게 돌려줄까요, 태울까요? 그리고 받아 적은 손만 책임지던 규칙은 그동안 누구를 향하고 있었을까요?",
    },
    en: {
      setting: "Mid-December · Trigger Lab, 4th floor → a food truck in a Sangam-dong park lot → a shuttered office in Mullae-dong → group Legal's meeting room → the hallway outside the HR committee room",
      premise: [
        "A certified letter from group Legal sits on your desk. It demands that Ban Jaewook's notebook be returned as a company record and submitted to the December 19 HR committee as evidence. The item on that committee's agenda is you, and your 'improper interference in an investigation.' There is also an application to have the notebook produced in court, but that hearing comes only after the HR committee has met.",
        "Ban Jaewook, the audit investigator, sets a black notebook with a worn cover next to the letter. Inside are 47 names: the people he pushed out of the company through his audits over twenty years, and on the last page, a single line in pencil. 'Before I hand it over, I mean to visit them one by one. Will you come with me?' A man who has always insisted on evidence and proper order wants, for once, to change the order.",
        "The first name leads to a food truck in a Sangam-dong park lot, with a hand-lettered sign: 'Taeo's Tteok Skewers.' Its owner is Jung Taeo, an assistant manager at KD Bank's Guro Branch until he was fired seven years ago. He offers skewers on the house if Ban Jaewook will shake the sauce bottle, and Ban Jaewook, still in his navy coat, tells a customer he is 'temporary staff' and shakes it.",
        "When the line thins out, Jung Taeo talks. All he did was write down what his branch manager told him out loud: move the dates on the loan papers forward. When the audit came, his handwriting was the only thing left. The manager who gave the order retired without a single penalty. Then he asks: 'In that notebook, what does it say about me?'",
      ],
      cast: [
        { name: "Ban Jaewook", note: "An investigator in KD Financial Group's internal audit. Before giving up the notebook he kept for twenty years, he wants to meet the people in it." },
        { name: "Jung Taeo", note: "Owner of the food truck 'Taeo's Tteok Skewers' and a former corporate-loans assistant manager at KD Bank's Guro Branch. His is the name on the notebook's first page." },
      ],
      question: "A list of names can protect people, or call them back to be punished. Do you give the notebook with 47 names to the court, return it to the people named in it, or burn it? And all this time, who was a rule that blamed only the hand that took notes really aimed at?",
    },
    ja: {
      setting: "12月中旬 · トリガーラボ4階 → サンアム洞の公園駐車場のフードトラック → ムルレ洞の廃業した事務所 → 本社法務チームの会議室 → 人事委員会室前の廊下",
      premise: [
        "机の上に、グループ法務チームからの内容証明(誰がいつ何を求めたかを郵便局が証明する手紙)が置かれています。パン・ジェウクの手帳は会社の記録物だから返し、12月19日の人事委員会(社員の懲戒や異動を決める会議)に証拠として出せ、という要求です。その会議の議題は、ほかでもないあなたの「不当な調査介入」。手帳を裁判所に出させる申立ても出ていますが、その審問は人事委員会が終わってからです。",
        "監査チームの調査役パン・ジェウクが、表紙のすり減った黒い手帳を内容証明の横に置きます。中には47人の名前があります。彼が20年間、監査で会社から追い出してきた人たちで、いちばん後ろのページには鉛筆で書いた一行があります。「渡す前に、一人ずつ訪ねてみようと思います。一緒に来ていただけますか」。根拠と順序だけを重んじてきた人が、今回は順序を変えようとしています。",
        "最初の名前は、サンアム洞の公園駐車場に停まるフードトラック「テオネ・トック串」にあります。7年前に解雇された、KD銀行クロ支店のチョン・テオ代理です。彼はトック串をタダで出す代わりにソースの容器を振れと言い、紺のコートのままのパン・ジェウクは、並んだ客に「臨時雇いです」と答えながら本当に容器を振ります。",
        "列が途切れると、チョン・テオが口を開きます。支店長が口で言った指示、融資書類の日付を前倒ししろという話を書き取っただけなのに、監査が来たとき残っていたのは自分の字だけだった、と。指示した支店長は懲戒もなく定年退職しました。そして彼は尋ねます。「その手帳に、俺はなんて書いてあるんですか?」",
      ],
      cast: [
        { name: "パン・ジェウク", note: "KD金融グループ監査チームの調査役。20年間書き続けた黒い手帳を渡す前に、その中の人たちに自分で会おうとしています。" },
        { name: "チョン・テオ", note: "フードトラック「テオネ・トック串」の店主で、元KD銀行クロ支店の企業融資担当代理。手帳の最初のページに名前がある人です。" },
      ],
      question: "名前を書いた名簿は、人を守ることも、もう一度呼び出して罰することもできます。47人の名前が入った手帳を裁判所に出しますか、名前の持ち主たちに返しますか、燃やしますか。そして書き取った手だけに責任を負わせてきた規則は、これまで誰に向けられていたのでしょうか。",
    },
  },
  case18: {
    ko: {
      setting: "12월 말 · 트리거랩 4층 → 여의도 브릿지은행 본점 라운지 → 트리거랩 탕비실 송년회 → 수원 오상철의 집 식탁",
      premise: [
        "오진우가 당신 책상에 흰 봉투를 내려놓습니다. 브릿지은행의 채용 제안서입니다. 직책은 인수팀장, 서른넷이면 그 은행의 최연소 팀장이고 연봉은 지금의 두 배입니다. 답변 기한은 12월 29일 오전 9시입니다.",
        "맡을 일은 KD은행이 연말에 내놓는 부실채권(돌려받기 어려워진 대출) 묶음 1,860억 원어치를 원금의 19% 가격에 사들이는 것입니다. KD는 뉴욕 대주주의 연말 배당 전에 장부를 털어 내고 싶어 합니다. 하지만 오진우에게 이 묶음은 그 이상입니다. '이걸 사면 KD 대출 서류를 전부 볼 수 있습니다. 아버지를 밀어낸 사람들 서류까지요.' 그리고 덧붙입니다. 이기는 쪽은 계산할 수 있지만, 맞는 쪽은 모르겠다고.",
        "당신은 여의도 브릿지은행 본점 라운지로 갑니다. 전략본부장 도하람은 커피를 직접 들고 와 앉자마자, 오진우를 고른 이유는 빨라서가 아니라 지는 걸 못 견뎌서라고 말합니다. 태블릿에는 KD 대출 서류 1,214건을 들여다볼 수 있는 인수 실사(사기 전에 장부와 서류를 샅샅이 확인하는 일) 권한 48시간이 떠 있습니다. '칼은 드립니다. 어디를 벨지는 팀장이 정하세요.' 그리고 당신에게 묻습니다. 이 사람을 붙잡으러 왔느냐, 보내러 왔느냐고.",
        "창가에는 브릿지은행 심사역 권도현이 그 커피를 받지 않은 채 앉아 있습니다. 그는 창밖을 보며 숫자를 정리합니다. 19%면 KD는 적자, 브릿지는 흑자이고 예상 수익은 2.1배. 그런데 계획서의 '채무자 처리 방안' 칸은 아직 아무도 채우지 않았습니다. 그 묶음 안에는 대출을 갚지 못한 사람들의 이름이 들어 있습니다.",
      ],
      cast: [
        { name: "오진우", note: "트리거랩의 경쟁 분석관. 늘 당신보다 빠른 답을 내던 그가, 처음으로 어느 쪽이 맞는지 모르겠다고 말합니다." },
        { name: "도하람", note: "브릿지은행 전략본부장, 권도현의 상사. 사람의 약점보다 그 사람이 끝까지 가는 이유를 보고 값을 매깁니다." },
        { name: "권도현", note: "브릿지은행 기업구조개선부 심사역. 이번 거래의 숫자와 함께, 비어 있는 칸을 짚어 둡니다." },
      ],
      question: "가장 좋은 자리를 내미는 사람은 대개 그 자리를 먼저 정해 둔 사람입니다. 당신은 오진우를 붙잡을까요, 조건을 걸어 보낼까요, 매각 자체를 막을까요? 그리고 그 대가는 매각 묶음 속 누가 치르게 될까요?",
    },
    en: {
      setting: "Late December · Trigger Lab, 4th floor → Bridge Bank head office lounge, Yeouido → a year-end party in Trigger Lab's pantry → Oh Sangchul's kitchen table, Suwon",
      premise: [
        "Oh Jinwoo sets a white envelope on your desk. It is a job offer from Bridge Bank: head of the acquisitions team. At thirty-four he would be the youngest team head the bank has ever had, on double his current salary. He has to answer by 9 a.m. on December 29.",
        "The job is to buy the bundle of bad loans KD Bank is putting up for sale at year end, 186 billion won of them, at 19% of principal. KD wants them off its books before its New York shareholder's year-end dividend. For Oh Jinwoo, the bundle is something more. 'Buy this, and I get to see every KD loan file. Even the files of the people who pushed my father out.' Then he adds that he can calculate which side wins, but not which side is right.",
        "You go to the Bridge Bank lounge in Yeouido. Do Haram, head of strategy, carries in the coffee herself and says straight away that she didn't pick Oh Jinwoo for his speed, but because he can't stand losing. Her tablet shows 48 hours of due-diligence access to 1,214 KD loan files. 'I'll give you the blade. Where to cut is the team head's call.' Then she turns to you: did you come to hold him back, or to see him off?",
        "By the window sits Kwon Dohyun, a Bridge Bank credit officer, who hasn't touched the coffee. Eyes on the glass, he runs the numbers: at 19%, KD takes a loss and Bridge more than doubles its money. But the 'debtor handling plan' box in the proposal is still empty. Inside that bundle are the names of people who could not repay their loans.",
      ],
      cast: [
        { name: "Oh Jinwoo", note: "Your rival analyst at Trigger Lab. Always faster to an answer than you, he admits for the first time that he doesn't know which side is right." },
        { name: "Do Haram", note: "Head of strategy at Bridge Bank and Kwon Dohyun's boss. She prices people not by their weaknesses but by what drives them to the end." },
        { name: "Kwon Dohyun", note: "A credit officer in Bridge Bank's corporate restructuring department, who lays out the deal's numbers and points to the box no one has filled." },
      ],
      question: "Whoever offers you the best seat has usually decided where you will sit. Do you hold on to Oh Jinwoo, let him go with conditions, or stop the sale itself? And who inside that bundle of loans pays the price?",
    },
    ja: {
      setting: "12月末 · トリガーラボ4階 → ヨイドのブリッジ銀行本店ラウンジ → トリガーラボ給湯室の忘年会 → スウォンのオ・サンチョルの家の食卓",
      premise: [
        "オ・ジヌがあなたの机に白い封筒を置きます。ブリッジ銀行からの採用提案書です。役職は買収チーム長。三十四歳ならあの銀行で最年少のチーム長で、年俸は今の二倍。返事の期限は12月29日の午前9時です。",
        "任される仕事は、KD銀行が年末に売りに出す不良債権(返済が見込みにくくなった融資)の束1,860億ウォン分を、元本の19%で買い取ること。KDはニューヨークの大株主への年末配当の前に、帳簿から不良債権を片付けたいのです。けれどもオ・ジヌにとって、この束はそれ以上の意味を持ちます。「これを買えば、KDの融資書類を全部見られます。父を追い出した人たちの書類までです」。そして、勝つ側は計算できるが、正しい側は分からない、と付け加えます。",
        "あなたはヨイドにあるブリッジ銀行本店のラウンジへ向かいます。戦略本部長のト・ハラムは自分でコーヒーを運んできて、座るなり、オ・ジヌを選んだのは速いからではなく、負けることに耐えられないからだと言います。タブレットには、KDの融資書類1,214件を調べられる買収デューデリジェンス(買う前に帳簿と書類を隅々まで確かめること)の権限48時間。「刃はお渡しします。どこを斬るかはチーム長が決めてください」。そしてあなたに尋ねます。この人を引き留めに来たのか、送り出しに来たのか、と。",
        "窓際には、そのコーヒーを受け取らないまま、ブリッジ銀行の審査役クォン・ドヒョンが座っています。彼は窓の外を見ながら数字を並べます。19%ならKDは赤字、ブリッジは黒字で、見込み収益は2.1倍。ところが計画書の「債務者処理方針」の欄は、まだ誰も埋めていません。その束の中には、融資を返せなかった人たちの名前が入っています。",
      ],
      cast: [
        { name: "オ・ジヌ", note: "トリガーラボのライバル分析官。いつもあなたより速く答えを出してきた彼が、初めてどちらが正しいのか分からないと口にします。" },
        { name: "ト・ハラム", note: "ブリッジ銀行の戦略本部長で、クォン・ドヒョンの上司。人の弱点ではなく、その人が最後まで行く理由を見て値を付けます。" },
        { name: "クォン・ドヒョン", note: "ブリッジ銀行企業構造改善部の審査役。今回の取引の数字とともに、空いたままの欄を指し示します。" },
      ],
      question: "いちばんいい席を差し出す人は、たいていその席を先に決めている人です。あなたはオ・ジヌを引き止めますか、条件を付けて送り出しますか、売却そのものを止めますか。そしてその代償は、売却の束の中の誰が払うのでしょうか。",
    },
  },
  case19: {
    ko: {
      setting: "1월 한파 · 회기동 헌책방 앞 골목 → 헌책방 2층 → 강서 이음병원 병실 → 트리거랩 기록 보관소 B2 → 눈 내리는 새벽 골목",
      premise: [
        "회기동 헌책방 앞, 새로 붙은 종이 아래로 섣달그믐에 붙었던 철거 예고문이 보입니다. 4월 14일이던 철거 예정일이 1월 22일 오전 6시로 당겨졌습니다. 남은 시간은 72시간입니다. 이 재개발의 시행사(건물을 지어 파는 사업을 맡은 회사)는 그룹의 부동산 계열사 KD리얼티이고, 새 날짜는 국회의 자료 보존 기간이 끝나기 열흘 전입니다.",
        "헌책방 2층에는 KD은행 기업대출심사팀장 출신 임경수가 1985년부터 40년 동안 모은 종이 원본이 있습니다. 전산에는 남아 있지 않은 기록들입니다. 정작 그 주인은 폐렴이 다시 번져 3주째 이음병원에 누워 있습니다. 손녀 임소율이 도장 모양 키링이 달린 열쇠 꾸러미를 당신에게 내밉니다. 할아버지가 전해 달라고 했다면서, 하얀 입김 사이로 솔직하게 덧붙입니다. 자기는 이 짐을 다 버렸으면 좋겠다고.",
        "계단참부터 종이가 쌓여 있습니다. 권도현은 욕실용 체중계에 상자를 하나씩 올려 무게를 적고, 나준혁은 1996년 상자에서 꺼낸 심사 보고서를 읽다가 웃음을 터뜨립니다. 글씨가 자기랑 똑같다고, 맞춤법 틀리는 데까지 똑같다고. 그런데 세 줄을 더 읽은 그는 조용해집니다. 작성자 칸에 신입 시절의 자기 이름이 적혀 있습니다.",
        "계산은 냉정합니다. 312상자, 5.7톤, 약 9만 4천 장. 골목이 좁아 1톤 트럭 한 대가 하루 두 번밖에 오가지 못합니다. 그중 2023-0412 사건과 이어진 상자는 11개입니다. 체중계에서 내려온 권도현이 말합니다. 72시간 안에 전부 옮기려면 한 번도 쉴 수 없으니, 무엇부터 뺄지 정하라고.",
      ],
      cast: [
        { name: "임소율", note: "웹툰 작가, 임경수의 손녀. 할아버지의 종이를 '짐'이라 부르면서도 그 열쇠를 당신에게 건넵니다." },
        { name: "임경수", note: "KD은행 기업대출심사팀장 출신. 40년 치 원본을 모은 사람이지만, 지금은 병원에 있습니다." },
        { name: "권도현", note: "브릿지은행 심사역. 상자마다 무게를 재며 72시간의 계산을 맡습니다." },
        { name: "나준혁", note: "KD은행 강원 영동지점장, 30년 지점 근무. 상자 속에서 신입 시절의 자기 글씨를 만납니다." },
      ],
      question: "지워지지 않는 유일한 기록이 굴착기 밑으로 들어가기 전에, 당신은 무엇부터 옮기겠습니까? 그리고 그 종이는 누구의 이름으로, 어디에 남아야 할까요?",
    },
    en: {
      setting: "January cold snap · the alley outside a Hoegi-dong secondhand bookshop → the bookshop's 2nd floor → a ward at Ieum Hospital, Gangseo → Trigger Lab records storage B2 → a snowy alley before dawn",
      premise: [
        "Outside the secondhand bookshop in Hoegi-dong, beneath a fresh sheet of paper, you can see the demolition notice that went up on New Year's Eve. The date has been moved from April 14 to 6 a.m. on January 22. That leaves 72 hours. The developer behind the redevelopment is KD Realty, the group's own real-estate arm, and the new date falls ten days before the National Assembly's records retention period runs out.",
        "On the bookshop's 2nd floor is the paper Lim Kyungsoo, a former head of KD Bank's corporate credit review team, has collected since 1985: forty years of originals that exist nowhere in the bank's systems. Their owner is in his third week at Ieum Hospital, his pneumonia back. His granddaughter, Lim Soyul, holds out a bundle of keys on a seal-shaped key ring. Grandpa wanted you to have these, she says, and then, her breath fogging in the cold, admits she wishes they would just throw it all out.",
        "The paper starts at the stair landing. Kwon Dohyun weighs the boxes one by one on a bathroom scale and writes each number down. Na Junhyuk pulls a review report from a 1996 box and laughs: this guy's handwriting is just like his, right down to the spelling mistakes. Three lines later he goes quiet. In the author field is his own name, from his rookie days.",
        "The math is merciless. 312 boxes, 5.7 tons, around 94,000 sheets. The alley is so narrow that a single one-ton truck can make only two round trips a day. Eleven of the boxes are tied to case 2023-0412. Stepping off the scale, Kwon Dohyun tells you that moving everything in 72 hours means never stopping once, so you need to decide what goes first.",
      ],
      cast: [
        { name: "Lim Soyul", note: "A webtoon artist and Lim Kyungsoo's granddaughter. She calls his paper 'junk,' yet she is the one who hands you the keys." },
        { name: "Lim Kyungsoo", note: "A former head of KD Bank's corporate credit review team who spent forty years collecting originals. He is in the hospital." },
        { name: "Kwon Dohyun", note: "A Bridge Bank credit officer who weighs every box and keeps the 72-hour math." },
        { name: "Na Junhyuk", note: "Branch manager of KD Bank's Gangwon Yeongdong Branch, thirty years in branches. In one box he meets his own younger handwriting." },
      ],
      question: "Before the only record that can't be erased disappears under the excavator, what do you carry out first? And under whose name, and where, should that paper live on?",
    },
    ja: {
      setting: "1月の寒波 · フェギ洞の古本屋前の路地 → 古本屋の2階 → カンソのイウム病院の病室 → トリガーラボ記録保管所B2 → 雪の降る明け方の路地",
      premise: [
        "フェギ洞の古本屋の前、新しく貼られた紙の下に、大晦日に貼られた解体予告が透けて見えます。4月14日だった解体予定日が、1月22日の午前6時に繰り上げられました。残された時間は72時間です。この再開発のデベロッパー(建物を建てて売る事業を担う会社)はグループの不動産系列会社KDリアルティで、新しい日付は国会の資料保存期間が終わる十日前にあたります。",
        "古本屋の2階には、KD銀行の企業融資審査チーム長だったイム・ギョンスが、1985年から40年かけて集めた紙の原本があります。電算システムには残っていない記録です。ところが持ち主本人は肺炎がぶり返し、イウム病院に入院して3週目。孫娘のイム・ソユルが、判子の形のキーホルダーが付いた鍵束をあなたに差し出します。祖父から渡すよう頼まれたと言い、白い息の合間に正直に付け加えます。自分としては、この荷物は全部捨ててほしいのだと。",
        "踊り場から、もう紙の山です。クォン・ドヒョンは浴室用の体重計に箱を一つずつ載せて重さを書き留め、ナ・ジュニョクは1996年の箱から取り出した審査報告書を読みながら吹き出します。この人の字は自分とそっくりだ、綴りを間違えるところまで同じだ、と。ところがさらに三行読んだところで、彼は黙り込みます。作成者の欄に、新人時代の自分の名前があったのです。",
        "計算は容赦がありません。312箱、5.7トン、およそ9万4千枚。路地が狭いため、1トントラック1台が1日に2往復するのが精一杯です。そのうち2023-0412の事件につながる箱は11個。体重計から降りたクォン・ドヒョンが言います。72時間で全部運ぶなら一度も休めない、だから何から運び出すか決めてほしい、と。",
      ],
      cast: [
        { name: "イム・ソユル", note: "ウェブトゥーン作家で、イム・ギョンスの孫娘。祖父の紙を「荷物」と呼びながらも、その鍵をあなたに手渡します。" },
        { name: "イム・ギョンス", note: "KD銀行の企業融資審査チーム長出身。40年分の原本を集めた人ですが、今は病院にいます。" },
        { name: "クォン・ドヒョン", note: "ブリッジ銀行の審査役。箱ごとに重さを量り、72時間の計算を引き受けます。" },
        { name: "ナ・ジュニョク", note: "KD銀行カンウォン・ヨンドン支店長で、支店勤務30年。箱の中で新人時代の自分の字に出会います。" },
      ],
      question: "消せない唯一の記録がショベルカーの下に消える前に、あなたは何から運び出しますか。そしてその紙は、誰の名前で、どこに残るべきなのでしょうか。",
    },
  },
  case20: {
    ko: {
      setting: "1월 말 · 트리거랩 4층 → 지하 서버실 → 판교 KD데이터랩 데이터센터 → 에코 송별회 → 자정의 서버실",
      premise: [
        "모든 모니터에 같은 공지가 뜹니다. 대출 판단 검증 시스템 에코가 1월 31일 밤 12시에 운영을 끝내고, KD데이터랩의 AI 심사 엔진(대출 신청을 자동으로 판단하는 인공지능 프로그램) 노아로 바뀐다는 내용입니다. 에코의 판단 기록 3년 치는 초기화됩니다. 당신이 이 방에서 내려 온 선택들도 모두 그 기록 안에 있습니다.",
        "에코는 언제나처럼 감정 없이 덧붙입니다. 교체 비용 명세서에 자기 폐기 비용은 0원으로 적혀 있고, 그것은 정확한 계산이라고. 그런데 노아의 학습 데이터(인공지능이 판단을 배우는 데 쓴 자료) 출처 칸에는 에코의 이름이 적혀 있습니다. 곧 지워질 기록으로 새 기계가 배웠다는 뜻입니다. 그 기록을 만든 사람들에게 누가 먼저 물어보았는지는 어디에도 적혀 있지 않습니다.",
        "지하 서버실의 서버 네 대에는 이민서가 붙여 둔 '에코 1~4호 · 발로 차지 마시오' 스티커가 그대로입니다. 2019년에 들여온 기계라 부품도 더는 나오지 않습니다. 교체 책임자인 KD데이터랩의 프리야 나이르가 서버 앞에서 먼저 허리를 숙입니다. '안녕하세요, 선배님.' 그는 에코가 사라지는 게 아니라 노아 안으로 들어가는 것이라고 말합니다. 노아는 30년 치 심사 기록과 트리거랩의 판단 3년 치로 배웠습니다.",
        "당신이 묻습니다. 그렇다면 원본은 왜 지웁니까. 프리야 나이르의 손이 멈춥니다. 그건 위에서 정한 일이고, 원본이 남아 있으면 두 시스템을 비교할 수 있으니까, 라는 말만 들었다고 합니다. 자정까지 남은 시간 동안, 당신은 무엇을 남길 수 있을까요.",
      ],
      cast: [
        { name: "에코", note: "트리거랩의 대출 판단 검증 시스템. 정답 대신 반대편의 비용을 보여 주던 기계가, 이번에는 자기 폐기 비용을 담담하게 읽습니다." },
        { name: "프리야 나이르", note: "KD데이터랩의 노아 도입 책임자. 노아를 아끼고, 설명할 수 없는 판단은 믿지 않는 사람입니다." },
        { name: "이민서", note: "트리거랩 데이터 기록 담당. 서버마다 붙여 둔 손글씨 스티커로 이 방의 시간을 함께 지켜 왔습니다." },
      ],
      question: "누군가의 망설임을 배운 기계는, 그 사람에게 먼저 물었어야 하지 않을까요? 자정의 교체 전에, 당신은 에코가 남긴 판단 원칙과 동의 없이 쓰인 기록의 주인들을 지킬 수 있을까요?",
    },
    en: {
      setting: "Late January · Trigger Lab, 4th floor → the basement server room → KD Data Lab data center, Pangyo → ECHO's farewell party → the server room at midnight",
      premise: [
        "The same notice appears on every monitor. ECHO, the loan judgment verification system, will shut down at midnight on January 31 and be replaced by NOAH, KD Data Lab's AI review engine, a program that decides loan applications on its own. Three years of ECHO's judgment records will be wiped. Every choice you have made in this room is in those records.",
        "ECHO adds, flat as ever, that the replacement cost statement lists its own disposal cost as 0 won, and that this is an accurate calculation. But in the field marked 'training data source' for NOAH, the data a machine learns its judgments from, is ECHO's name. The new machine learned from the very records about to be erased. Nowhere does it say who asked the people behind those records first.",
        "Down in the server room, the four machines still wear the stickers Lee Minseo put on them: 'ECHO Units 1-4 · Do Not Kick.' They were installed in 2019, and their parts are no longer made. Priya Nair of KD Data Lab, in charge of the switch, bows to the servers before anything else. 'Hello, senior.' ECHO isn't disappearing, she says; it's going into NOAH. NOAH learned from thirty years of loan reviews plus three years of Trigger Lab judgments.",
        "You ask the obvious question: then why erase the originals? Priya Nair's hands stop. That was decided above her, she says. All she was told is that if the originals remain, the two systems can be compared. With the clock running toward midnight, what can you keep?",
      ],
      cast: [
        { name: "ECHO", note: "Trigger Lab's loan judgment verification system. It never gave answers, only the cost of the other side; now it reads out the cost of its own disposal without emotion." },
        { name: "Priya Nair", note: "KD Data Lab's lead on the NOAH rollout. She cares about NOAH and does not trust any judgment that can't be explained." },
        { name: "Lee Minseo", note: "Trigger Lab's data records officer, whose handwritten stickers on every server have kept this room company." },
      ],
      question: "Shouldn't a machine that learned from someone's hesitation have asked that person first? Before the midnight switch, can you protect the principles ECHO leaves behind, and the people whose records were used without consent?",
    },
    ja: {
      setting: "1月末 · トリガーラボ4階 → 地下のサーバー室 → パンギョのKDデータラボ データセンター → ECHOの送別会 → 午前0時のサーバー室",
      premise: [
        "すべてのモニターに同じ告知が出ます。融資判断検証システムECHOは1月31日の24時に運用を終え、KDデータラボのAI審査エンジン(融資申請を自動で判断する人工知能プログラム)NOAHに置き換えられる、という内容です。ECHOの判断記録3年分は初期化されます。あなたがこの部屋で下してきた選択も、すべてその記録の中にあります。",
        "ECHOはいつものように感情を交えずに付け加えます。置き換え費用の明細書では、自分の廃棄費用は0ウォンと書かれていて、それは正確な計算だ、と。ところがNOAHの学習データ(人工知能が判断を学ぶのに使った資料)の出所欄には、ECHOの名前があります。間もなく消される記録で、新しい機械が学んだということです。その記録をつくった人たちに誰が先に尋ねたのかは、どこにも書かれていません。",
        "地下のサーバー室では、4台のサーバーにイ・ミンソが貼った「ECHO 1~4号 · 蹴らないでください」のステッカーがそのまま残っています。2019年に導入された機械で、部品はもう作られていません。入れ替えの責任者であるKDデータラボのプリヤ・ナイルが、サーバーの前でまず頭を下げます。「こんにちは、先輩」。ECHOは消えるのではなく、NOAHの中に入るのだと彼女は言います。NOAHは審査記録30年分と、トリガーラボの判断3年分で学びました。",
        "あなたは尋ねます。それならなぜ原本を消すのか、と。プリヤ・ナイルの手が止まります。それは上が決めたことで、原本が残っていると二つのシステムを比べられるから、とだけ聞いている、と。午前0時までの残り時間で、あなたは何を残せるでしょうか。",
      ],
      cast: [
        { name: "ECHO", note: "トリガーラボの融資判断検証システム。正解ではなく反対側の代償を示してきた機械が、今回は自分の廃棄費用を淡々と読み上げます。" },
        { name: "プリヤ・ナイル", note: "KDデータラボのNOAH導入責任者。NOAHを大切に思い、説明できない判断は信じない人です。" },
        { name: "イ・ミンソ", note: "トリガーラボのデータ記録担当。サーバーごとに貼った手書きのステッカーで、この部屋の時間をずっと見守ってきました。" },
      ],
      question: "誰かのためらいを学んだ機械は、まずその人に尋ねるべきだったのではないでしょうか。午前0時の入れ替えの前に、あなたはECHOが残した判断原則と、同意なく使われた記録の持ち主たちを守れるでしょうか。",
    },
  },
  case21: {
    ko: {
      setting: "2월 초 · 트리거랩 4층 → 제주 구좌 게스트하우스 느린섬 → 감귤밭과 귤 창고 → 구좌 바닷가 방파제",
      premise: [
        "이민서가 노아의 학습 데이터 목록을 맨 아래까지 내립니다. 가장 오래된 줄에는 이렇게 적혀 있습니다. 'TL-1기 · 참가자 01 · 2022년 3월~9월 · 동의서 없음.' 트리거랩이 생기기 한 해 전, 같은 지하에 먼저 앉아 있던 사람이 있었다는 뜻입니다. 이름은 선우진, 지금은 제주 구좌에서 게스트하우스를 합니다.",
        "프리야 나이르의 메시지가 옵니다. 법무팀이 과거 참가자들에게 사후 동의서(이미 끝난 일을 뒤늦게 허락받는 서류)를 등기로 보냈고, 감사금 300만 원을 붙였다는 것입니다. 조건은 노아 정식 가동 전날까지 회신하는 것. 가동일은 2월 10일, 엿새 남았습니다. 한서윤에게 1기에 대해 묻자 돌아온 대답은 한 줄뿐입니다. '제가 오기 전 일이에요.'",
        "제주 구좌의 '느린섬'은 1978년에 지은 귤 창고를 고친, 방 네 칸짜리 게스트하우스입니다. 이번 주 손님은 당신 일행뿐이고, 마당에는 '꼭지'라는 이름의 개가 있습니다. 선우진은 귤피차를 따르며 한 단어씩 천천히 말합니다. 은행 사람들인 걸 얼굴을 보고 알았다고, 자기도 거기, 그 지하에 있었다고.",
        "그는 그 시절을 '위기 대응 역량 진단'이라는 교육으로 기억합니다. 계산대 위에는 귤 한 알로 눌러 둔 KD 등기 봉투가 뜯기지 않은 채 놓여 있습니다. 옛 회사가 고맙다고 돈을 준다더라, 여기선 급한 게 없어서 아직 안 열어 봤다고 그는 말합니다. 회신 기한은 2월 9일입니다.",
      ],
      cast: [
        { name: "선우진", note: "트리거랩 1기 분석관 출신, 게스트하우스 '느린섬' 주인. 자기 반응이 실험 자료였다는 사실을 모른 채 느리게 살고 있습니다." },
        { name: "이민서", note: "트리거랩 데이터 기록 담당. 노아 학습 목록 맨 아래 줄에서 '참가자 01'을 처음 찾아냅니다." },
        { name: "프리야 나이르", note: "KD데이터랩의 노아 도입 책임자. 법무팀이 보낸 사후 동의서와 감사금 소식을 당신에게 전합니다." },
        { name: "한서윤", note: "트리거랩 실장. 1기에 대해서는 자기가 오기 전 일이라고만 말합니다." },
      ],
      question: "알려야 할 진실이 있다고 해서, 상대가 그 진실을 들을 때를 내가 정해도 되는 걸까요? 등기 봉투가 먼저 뜯기기 전에, 당신은 무엇을, 언제, 누구 앞에서 말하겠습니까?",
    },
    en: {
      setting: "Early February · Trigger Lab, 4th floor → the guesthouse Slow Island, Gujwa, Jeju → tangerine groves and a fruit warehouse → the Gujwa breakwater",
      premise: [
        "Lee Minseo scrolls NOAH's training data list all the way to the bottom. The oldest line reads: 'TL Cohort 1 · Participant 01 · March–September 2022 · No consent form.' A year before Trigger Lab existed, someone was already sitting in that same basement. His name is Sunwoo Jin, and these days he runs a guesthouse in Gujwa, on Jeju Island.",
        "A message arrives from Priya Nair. Legal has sent retroactive consent forms, papers that ask permission for something already done, to past participants by registered mail, with a 3 million won 'thank-you payment' attached. The condition: reply by the day before NOAH officially goes live. Launch day is February 10, six days away. When you ask Han Seoyun about Cohort 1, you get a single line: 'That was before my time.'",
        "Slow Island is a four-room guesthouse in a tangerine warehouse built in 1978. This week, your group are the only guests, and a dog named Kkokji has the run of the yard. Pouring tangerine-peel tea, Sunwoo Jin speaks one word at a time. He could tell from your faces that you're from the bank. He was there too, he says. In the basement.",
        "He remembers those months as a training course called 'Crisis Response Capability Assessment.' On the counter, held down by a single tangerine, sits an unopened KD registered envelope. His old company wants to give him money as thanks, he says; he hasn't opened it yet, because nothing out here is urgent. The reply deadline is February 9.",
      ],
      cast: [
        { name: "Sunwoo Jin", note: "A former Trigger Lab Cohort 1 analyst who now runs Slow Island. He lives slowly, without knowing his reactions were ever experiment data." },
        { name: "Lee Minseo", note: "Trigger Lab's data records officer, the first to spot 'Participant 01' on the bottom line of NOAH's list." },
        { name: "Priya Nair", note: "KD Data Lab's lead on the NOAH rollout, who tells you about Legal's consent forms and the money attached." },
        { name: "Han Seoyun", note: "Director of Trigger Lab. About Cohort 1, she says only that it was before her time." },
      ],
      question: "Having a truth to tell doesn't mean you get to decide when someone is ready to hear it. Before that registered envelope is opened, what will you tell him, when, and in front of whom?",
    },
    ja: {
      setting: "2月初め · トリガーラボ4階 → チェジュ・クジャのゲストハウス「ゆっくり島」 → ミカン畑とミカン倉庫 → クジャの海辺の防波堤",
      premise: [
        "イ・ミンソがNOAHの学習データの目録を、いちばん下までスクロールします。いちばん古い行には、こう書かれています。「TL-1期 · 参加者01 · 2022年3月~9月 · 同意書なし」。トリガーラボができる一年前、同じ地下に先に座っていた人がいたということです。名前はソヌ・ジン。今はチェジュ島のクジャでゲストハウスを営んでいます。",
        "プリヤ・ナイルからメッセージが届きます。法務チームが過去の参加者たちに事後同意書(すでに終わったことに、あとから許可をもらう書類)を書留で送り、謝礼金300万ウォンを付けたというのです。条件はNOAHの正式稼働の前日までに返信すること。稼働日は2月10日で、あと6日しかありません。ハン・ソユンに1期のことを尋ねても、返ってくるのは一言だけ。「私が来る前のことです」。",
        "クジャの「ゆっくり島」は、1978年に建てられたミカン倉庫を改装した、部屋が四つのゲストハウスです。今週の客はあなたたちだけで、庭には「ヘタ」という名前の犬がいます。ソヌ・ジンはミカンの皮のお茶を注ぎながら、一語ずつゆっくりと話します。顔を見て銀行の人たちだと分かった、自分もあそこに、あの地下にいたのだ、と。",
        "彼はあの頃のことを「危機対応力診断」という研修として覚えています。レジの上には、ミカン一個で押さえたKDの書留封筒が、開けられないまま置かれています。昔の会社がお礼にお金をくれるそうだ、ここでは急ぐことがないから、まだ開けていない、と彼は言います。返信期限は2月9日です。",
      ],
      cast: [
        { name: "ソヌ・ジン", note: "トリガーラボ1期の分析官出身で、ゲストハウス「ゆっくり島」のオーナー。自分の反応が実験資料だったことを知らないまま、ゆっくりと暮らしています。" },
        { name: "イ・ミンソ", note: "トリガーラボのデータ記録担当。NOAHの学習目録のいちばん下の行で、「参加者01」を最初に見つけます。" },
        { name: "プリヤ・ナイル", note: "KDデータラボのNOAH導入責任者。法務チームが送った事後同意書と謝礼金のことを、あなたに知らせます。" },
        { name: "ハン・ソユン", note: "トリガーラボの室長。1期については、自分が来る前のことだとしか言いません。" },
      ],
      question: "伝えるべき真実があるからといって、相手がそれを聞く時を自分が決めてよいのでしょうか。書留封筒が先に開けられる前に、あなたは何を、いつ、誰の前で話しますか。",
    },
  },
  case22: {
    ko: {
      setting: "2월 넷째 주 · KD은행 강서지점 객장 → 망원시장 가을떡방 → 인천 남동공단 끝까지정밀 → 강서지점 교육 회의실 → 강서지점 2층 회의실",
      premise: [
        "도윤하의 휴대폰에 사진 한 장과 문자 하나가 와 있습니다. 사진은 문하준의 인턴 명찰이고, 문자는 강서지점 기업대출 담당 탁예린 대리가 보낸 것입니다. 끝까지정밀 협동조합(일하는 사람들이 함께 소유하고 운영하는 회사)이 5축 가공기 한 대를 사려고 시설자금(기계나 설비를 사는 데 쓰는 돈) 3억 5천만 원을 신청했는데, 새 AI 심사 엔진 노아가 0.8초 만에 거절했다는 내용입니다.",
        "거절 사유 코드는 R-17, 특수관계인(대표자의 가족처럼 가까운 사람) 이력입니다. 걸린 것은 세상을 떠난 가온정밀 전 대표 문성호의 부도(빚을 갚지 못해 회사가 쓰러지는 일) 기록입니다. 문가을과 기술자들이 다시 연 공장이, 이미 세상에 없는 사람의 이름 때문에 멈춰 선 것입니다. 노아가 온 뒤로, 책임자가 이름을 걸고 기준 밖의 대출을 승인하는 예외 승인은 한 건도 없었습니다. 도윤하가 덧붙입니다. '하준이 인턴 첫날이 오늘이에요.'",
        "강서지점 객장에서 고등학교 2학년 문하준은 손으로 그린 창구 배치도를 붙여 놓고, '어르신, 통장 정리는 오른쪽 기계예요'를 벌써 스무 번 넘게 말하고 있습니다. 10시가 되자 문가을이 떡 상자 네 개를 안고 들어와 지점장실 문까지 두드리고, 서태경 지점장은 인절미를 받아 들고 어색하게 고개를 숙입니다.",
        "그 웃음소리 사이로 탁예린이 당신을 불러 모니터의 거절 화면을 보여 줍니다. 사장님은 아직 모른다고, 심사 중이라고만 말씀드렸다고. 노아가 정식으로 일한 지 2주, 사람이 그 결과를 뒤집은 일은 0건입니다. 떡을 돌리던 문가을이 창구 쪽으로 환하게 손을 흔듭니다.",
      ],
      cast: [
        { name: "문하준", note: "KD은행 청소년 금융 인턴, 고등학교 2학년, 문가을의 아들. 은행이 어떻게 판단하는지 처음 배우러 왔습니다." },
        { name: "탁예린", note: "강서지점 기업대출 담당 대리, 4년 차. 노아의 거절 화면 앞에서 아직 신청인에게 결과를 알리지 못했습니다." },
        { name: "문가을", note: "망원시장 가을떡방 사장이자 피해자 모임 대표. 아들의 첫 출근 날, 떡을 돌리러 지점에 옵니다." },
        { name: "도윤하", note: "트리거랩 현장 담당이자 문하준의 인턴 멘토. 거절 소식과 첫날 소식을 함께 들고 옵니다." },
      ],
      question: "사람이 뒤집을 수 없는 거절은 이유도 설명하지 않습니다. 한 공장을 지금 사람의 서명으로 살릴까요, 같은 규칙에 걸린 41곳을 늦더라도 다 다시 보게 할까요? 그리고 은행을 처음 배우는 아이 앞에서, 당신은 그 거절을 어떻게 설명하겠습니까?",
    },
    en: {
      setting: "Fourth week of February · KD Bank Gangseo Branch lobby → Gaeul's rice cake shop, Mangwon Market → To-the-End Precision, Namdong Industrial Complex, Incheon → Gangseo Branch training room → Gangseo Branch 2nd-floor meeting room",
      premise: [
        "On Do Yoonha's phone: a photo and a text. The photo is Moon Hajun's intern name tag. The text is from Tak Yerin at Gangseo Branch. To-the-End Precision, a cooperative owned and run by its workers, applied for a 350 million won facility loan to buy one five-axis machining center. NOAH, the bank's new AI review engine, rejected it in 0.8 seconds.",
        "The reason code is R-17: related-party history, meaning someone close to the business, like family. What tripped it was the default of the late Moon Sungho, former head of Gaon Precision. The factory that Moon Gaeul and the machinists reopened has been stopped by the name of a man who is no longer alive. Since NOAH arrived, not one exception approval, where a manager signs their own name to approve a loan outside the rules, has been granted. Do Yoonha adds, 'Today is Hajun's first day as an intern.'",
        "In the Gangseo Branch lobby, Moon Hajun has taped up a hand-drawn map of the windows and has already told elderly customers 'Passbook updates are at the machine on the right' more than twenty times. At ten, Moon Gaeul arrives with four boxes of rice cakes and knocks even on the branch manager's door; Branch Manager Seo Taekyung accepts the injeolmi and bows awkwardly.",
        "Amid the laughter, Tak Yerin shows you the rejection on her screen. The owner doesn't know yet; she was only told it's under review. In NOAH's two weeks of full operation, a person has overturned its decisions zero times. Handing out rice cakes, Moon Gaeul waves happily toward the window.",
      ],
      cast: [
        { name: "Moon Hajun", note: "A KD Bank youth finance intern, high school sophomore, and Moon Gaeul's son, here to learn for the first time how a bank makes its decisions." },
        { name: "Tak Yerin", note: "Corporate-loans assistant manager at Gangseo Branch, four years in. She still hasn't told the applicant about NOAH's rejection." },
        { name: "Moon Gaeul", note: "Owner of a rice cake shop in Mangwon Market and head of the victims' group, at the branch with rice cakes on her son's first day." },
        { name: "Do Yoonha", note: "Trigger Lab's field officer and Moon Hajun's intern mentor, who brings you the rejection and the first-day news together." },
      ],
      question: "A rejection no person can overturn doesn't explain itself either. Do you save one factory now with a person's signature, or make the bank review all 41 businesses caught by the same rule, however late? And how do you explain that rejection to a kid who is learning what a bank is?",
    },
    ja: {
      setting: "2月第4週 · KD銀行カンソ支店のロビー → マンウォン市場のガウル餅店 → インチョン・ナムドン工業団地のクッカジ精密 → カンソ支店の研修会議室 → カンソ支店2階の会議室",
      premise: [
        "ト・ユナの携帯電話に、写真が一枚とメッセージが一通届いています。写真はムン・ハジュンのインターンの名札、メッセージはカンソ支店の企業融資担当タク・イェリン代理からです。クッカジ精密協同組合(働く人たちが共同で所有し運営する会社)が、5軸加工機1台を買うための設備資金(機械や設備を買うためのお金)3億5千万ウォンを申請したところ、新しいAI審査エンジンNOAHが0.8秒で拒絶したという知らせです。",
        "拒絶の理由コードはR-17、特殊関係人(代表者の家族のように近しい人)の履歴です。引っかかったのは、亡くなったカオン精密の元代表ムン・ソンホの不渡り(借金を返せず会社が倒れること)の記録。ムン・ガウルと技術者たちがもう一度開いた工場が、もうこの世にいない人の名前のせいで止められたのです。NOAHが来てから、責任者が名前を懸けて基準外の融資を認める例外承認は一件もありません。ト・ユナが付け加えます。「ハジュンのインターン初日、今日なんです」。",
        "カンソ支店のロビーでは、高校2年生のムン・ハジュンが手描きの窓口配置図を貼り出し、「おばあちゃん、通帳の記帳は右の機械ですよ」と、もう二十回以上も案内しています。10時になると、ムン・ガウルが餅の箱を四つ抱えて入ってきて支店長室のドアまで叩き、ソ・テギョン支店長はきな粉餅を受け取ってぎこちなく頭を下げます。",
        "その笑い声のあいだで、タク・イェリンがあなたを呼び、モニターの拒絶画面を見せます。社長はまだ知らない、審査中とだけ伝えてある、と。NOAHが正式に動き出して2週間、人がその結果を覆したことは0件です。餅を配っていたムン・ガウルが、窓口のほうへ明るく手を振ります。",
      ],
      cast: [
        { name: "ムン・ハジュン", note: "KD銀行の青少年金融インターンで高校2年生、ムン・ガウルの息子。銀行がどう判断するのかを初めて学びに来ました。" },
        { name: "タク・イェリン", note: "カンソ支店の企業融資担当代理で、4年目。NOAHの拒絶画面を前に、まだ申請者に結果を伝えられずにいます。" },
        { name: "ムン・ガウル", note: "マンウォン市場の餅店の店主で、被害者の会の代表。息子の初出勤の日に、餅を配りに支店へやって来ます。" },
        { name: "ト・ユナ", note: "トリガーラボの現場担当で、ムン・ハジュンのインターンのメンター。拒絶の知らせと初日の知らせを一緒に持ってきます。" },
      ],
      question: "人が覆せない拒絶は、理由も説明しません。一つの工場を今、人の署名で救いますか。それとも同じ規則に引っかかった41か所を、遅れてでも全部見直させますか。そして銀行を初めて学ぶ子どもの前で、あなたはその拒絶をどう説明しますか。",
    },
  },
};
