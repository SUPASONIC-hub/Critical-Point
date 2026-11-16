/**
 * Spoiler-free case pages, 41-final: setting, premise, cast and question per case
 * in Korean, English and Japanese, written from the first two scenes of each case
 * (scripts/content-pages/cases.mjs renders them). Nothing past a case's second scene.
 */
export default {
  case41: {
    ko: {
      setting: "2026년 늦여름 · KD캐피탈 대표이사실 앞 복도 → 회기동 헌책방 1층 → 국회 정무위원회 청문회장",
      premise: [
        "국회 정무위원회가 청문회(국회가 증인을 불러 한 사건을 집중해서 따져 묻는 자리) 날짜를 확정합니다. 증인 명단 맨 윗줄에는 KD캐피탈 대표이사 윤상혁의 이름이 있습니다. 작년 가을 국정감사 때 그의 자리는 끝내 빈 의자였습니다. 그런데 이번에는 변호인을 통해 「성실히 출석하겠다」는 답이 왔습니다. 개회는 금요일 오전 10시, 남은 시간은 나흘입니다.",
        "당신은 이번에도 참고인(증언할 의무는 없지만 사실을 설명하러 나오는 사람)으로 그 방에 들어갑니다. 의원 한 명에게 주어진 질의 시간 7분 가운데 당신 몫은 1분, 질문은 단 하나입니다. 의원실 보좌관 차지원은 전화로 경고합니다. 안 나오는 사람은 쉽다고, 빈 의자는 반박하지 않으니까. 정말 무서운 건 나오는 사람이라고.",
        "그래서 회기동 헌책방 1층에서 모의 청문회가 열립니다. 윤상혁 역은 이번에도 나준혁입니다. 그런데 무엇을 물어도 대답은 하나뿐입니다. 「기억나지 않습니다.」 열네 번 물었고, 열네 번 같은 말이 돌아옵니다. 그러다 권도현이 1994년 영동지점 반려 보고서의 셋째 줄을 묻자, 나준혁은 눈을 감고 한 글자도 틀리지 않고 외워 냅니다. 기억은 잃어버리는 게 아니라 고르는 것인지도 모릅니다.",
        "계산대 옆 임경수의 의자는 8월부터 비어 있고, 연습 녹화본만 이음병원 병실로 보내집니다. 오진우는 화이트보드에 내기판을 그립니다. 실전에서 그 말이 몇 번 나올까. 오진우는 열아홉, 권도현은 스물셋을 적습니다. 그때 차지원의 문자가 옵니다. 형식이 정해졌습니다. 대질신문(말이 엇갈리는 두 사람을 마주 세워 묻는 방식), 1분, 질문 딱 하나."
      ],
      cast: [
        { name: "윤상혁", note: "KD캐피탈 대표이사. 자문료 배임 혐의로 재판을 받는 중이며, 작년 가을에는 끝내 나오지 않았던 증인입니다." },
        { name: "차지원", note: "국회 정무위원회 의원실 보좌관. 청문회 일정과 질문 형식을 가장 먼저 전해 주는 사람입니다." },
        { name: "나준혁", note: "KD은행 영동지점에서 30년을 일한 사람. 모의 청문회에서 윤상혁 역을 맡아 같은 대답을 끈질기게 되풀이합니다." },
        { name: "권도현", note: "무엇이든 숫자와 문서로 따지는 동료. 모의 질의에서 날카로운 질문을 던지고, 내기판에도 자기 숫자를 적습니다." }
      ],
      question: "준비된 대답이 「기억나지 않습니다」 하나뿐인 사람 앞에서, 단 1분의 질문은 무엇을 남길 수 있을까요? 증명할 수 없는 대답은 그 방에서 무엇이 될까요?",
    },
    en: {
      setting: "Late summer 2026 · Hallway outside the KD Capital CEO’s office → Bookshop 1st floor, Hoegi-dong → Policy Committee hearing room, National Assembly",
      premise: [
        "The National Assembly Policy Committee sets the date for a hearing. At the top of the witness list is Yoon Sanghyuk, CEO of KD Capital. At last autumn’s parliamentary audit his seat stayed an empty chair. This time his lawyer sends word that he “will attend in good faith.” The hearing opens Friday at 10 a.m. You have four days.",
        "Once again you walk into that room as an unsworn witness, someone with no duty to testify who comes to explain the facts. Of one lawmaker’s seven minutes, you get one, and exactly one question. Cha Jiwon, an aide in a lawmaker’s office, warns you over the phone: the ones who don’t show up are easy, because an empty chair can’t argue back. The frightening ones are the ones who come.",
        "So a mock hearing begins on the first floor of the Hoegi-dong bookshop. Na Junhyuk plays Yoon Sanghyuk again, but whatever anyone asks, he gives the same answer: “I don’t recall.” Fourteen questions, fourteen identical replies. Then Kwon Dohyun asks for the third line of a 1994 Yeongdong Branch return report, and Na Junhyuk closes his eyes and recites it word for word. Maybe memory isn’t something you lose. Maybe it’s something you choose.",
        "Lim Kyungsoo’s chair beside the counter has been empty since August; only the recordings travel to his room at Ieum Hospital. Oh Jinwoo draws a betting board on the whiteboard: how many times will the real witness say it? He bets nineteen, Kwon Dohyun twenty-three. Then Cha Jiwon texts. The format is set: face-to-face questioning, one minute, one question."
      ],
      cast: [
        { name: "Yoon Sanghyuk", note: "CEO of KD Capital, on trial for breach of trust over advisory fees, and the witness who never appeared last autumn." },
        { name: "Cha Jiwon", note: "An aide in a Policy Committee lawmaker’s office, the first to bring you the hearing date and the rules for your question." },
        { name: "Na Junhyuk", note: "Thirty years at KD Bank’s Yeongdong Branch. In rehearsal he plays Yoon Sanghyuk and repeats the same answer with stubborn patience." },
        { name: "Kwon Dohyun", note: "A colleague who turns everything into numbers and paperwork. He fires sharp questions in the mock hearing and puts his own figure on the betting board." }
      ],
      question: "Facing a man whose only prepared answer is “I don’t recall,” what can one minute and one question leave behind? And what does an answer no one can disprove become in that room?",
    },
    ja: {
      setting: "2026年の晩夏 · KDキャピタル代表取締役室前の廊下 → フェギ洞の古本屋1階 → 国会政務委員会の聴聞会場",
      premise: [
        "国会の政務委員会が聴聞会(国会が証人を呼んで一つの事件を集中して問いただす場)の日程を確定します。証人名簿の一行目には、KDキャピタル代表取締役ユン・サンヒョクの名前があります。去年の秋の国政監査では、彼の席は最後まで空の椅子でした。ところが今回は、弁護人を通じて「誠実に出席する」と知らせてきました。開会は金曜の午前10時、残りは四日です。",
        "あなたは今回も参考人(証言する義務はないけれど、事実を説明しに出てくる人)としてその部屋に入ります。議員一人に与えられた質疑7分のうち、あなたの持ち分は1分、質問はひとつだけです。議員室の補佐官チャ・ジウォンは電話で釘を刺します。来ない人は楽だ、空の椅子は反論しないから。本当に怖いのは来る人だ、と。",
        "そこでフェギ洞の古本屋1階で模擬聴聞会が開かれます。ユン・サンヒョク役は今回もナ・ジュニョクです。ところが何を聞いても答えはひとつ、「記憶にありません」。十四回聞いて、十四回同じ言葉が返ってきます。けれどクォン・ドヒョンが1994年のヨンドン支店の差し戻し報告書の三行目を尋ねると、ナ・ジュニョクは目を閉じて一字も違えずに暗誦してみせます。記憶とは失うものではなく、選ぶものなのかもしれません。",
        "レジの横のイム・ギョンスの椅子は8月から空いたままで、練習の録画だけがイウム病院の病室へ届けられます。オ・ジヌはホワイトボードに賭け表を描きます。本番であの言葉は何回出るか。オ・ジヌは十九、クォン・ドヒョンは二十三。そこへチャ・ジウォンからメッセージが届きます。形式が決まりました。対質尋問(言い分の食い違う二人を向かい合わせて問う方式)、1分、質問はひとつだけ。"
      ],
      cast: [
        { name: "ユン・サンヒョク", note: "KDキャピタル代表取締役。顧問料の背任容疑で公判中で、去年の秋には最後まで姿を見せなかった証人です。" },
        { name: "チャ・ジウォン", note: "国会政務委員会の議員室の補佐官。聴聞会の日程と質問の形式を、真っ先に伝えてくれる人です。" },
        { name: "ナ・ジュニョク", note: "KD銀行ヨンドン支店で30年働いてきた人。模擬聴聞会でユン・サンヒョク役を務め、同じ答えをしぶとく繰り返します。" },
        { name: "クォン・ドヒョン", note: "何でも数字と書類で詰める仲間。模擬質疑で鋭い質問を投げ、賭け表にも自分の数字を書き込みます。" }
      ],
      question: "用意された答えが「記憶にありません」ひとつだけの人を前に、たった1分の質問は何を残せるのでしょうか。証明できない答えは、あの部屋で何になるのでしょうか。",
    },
  },

  case42: {
    ko: {
      setting: "2026년 늦여름 · KD캐피탈 위험관리부 → 경포 물결스테이 → 경포 방파제",
      premise: [
        "두 번째 청문회가 끝나고 엿새, 당신이 낸 휴가 신청서가 나흘째 승인 화면에 떠 있습니다. 금요일 하루를 쉬겠다는 평범한 신청입니다. 승인선은 팀장, 부서장, 그리고 대표이사 윤상혁. 마지막 칸이 아직 비어 있습니다. 승인도 아니고 반려도 아닌, 그냥 빈칸입니다.",
        "그때 단체방에 사진 한 장이 올라옵니다. A4 한 장에 붓펜으로 쓴 「휴가 명령서」, 그 아래 빨간 도장 세 개, 참석 요청 아홉 명. 보낸 사람은 나준혁입니다. 경포 불꽃축제 바로 앞 펜션을 잡았다고, 방 넷에 이불 열두 채라고. 기억 안 난다는 사람을 스물세 번 보느라 다들 얼굴이 반쪽이 됐다는 게 그의 진단입니다. 불꽃은 다음 날 밤 9시, 숙소에서 걸어서 6분 거리입니다.",
        "도착한 「물결스테이」 마당에는 튜브 여섯 개가 걸려 있고, 젊은 사장 여다인이 웃으며 열쇠 네 개를 건넵니다. 그런데 숙박 명부에 서명하던 권도현의 펜이 멈춥니다. 그가 외우고 있는 주소입니다. 작년에 당신이 쫓던 해온 펜션, 자문료(조언값이라며 내보낸 돈)가 서울의 한 갤러리로 빠져나가던 회사의 등록 주소. 그 회사는 청산(회사를 정리해 없애는 절차)됐고, 집은 경매(빚을 못 갚은 사람의 재산을 법원이 공개 입찰로 파는 절차)로 넘어갔습니다.",
        "나준혁은 알고 잡았다고 태연하게 말합니다. 그 사람들 돈이 흐르던 집에 제값을 내고 자 주는 것, 이게 제일 깔끔한 복수 아니냐고. 오늘 밤 물결스테이는 문을 연 뒤 처음으로 방이 꽉 찼습니다. 그리고 여다인이 이 집을 낙찰받은 돈 가운데 일부는 KD캐피탈의 사업자 대출입니다."
      ],
      cast: [
        { name: "나준혁", note: "붓펜으로 휴가 명령서를 써서 모두를 바닷가로 끌고 가는 사람. 숙소를 고른 데에도 그 나름의 이유가 있습니다." },
        { name: "권도현", note: "숙박 명부의 주소 한 줄을 그냥 넘기지 못하는 동료. 해온 펜션의 주소를 아직 외우고 있습니다." },
        { name: "여다인", note: "경포 「물결스테이」 사장, 32세. KD은행 영동지점 창구 계약직 출신으로, 경매로 이 집을 낙찰받았습니다." },
        { name: "윤상혁", note: "KD캐피탈 대표이사. 당신의 휴가 신청서 마지막 승인 칸이 그의 자리이고, 그 칸은 나흘째 비어 있습니다." }
      ],
      question: "쉬러 간 바닷가에서, 지난 주인의 주소가 새 주인의 청구서가 된다면 무엇부터 지켜야 할까요? 한 사람을 끊어 내면 사슬도 정말 끊기는 걸까요?",
    },
    en: {
      setting: "Late summer 2026 · KD Capital Risk Management Department → Mulgyeol Stay, Gyeongpo → Gyeongpo breakwater",
      premise: [
        "Six days after the second hearing, your leave request has been sitting on the approval screen for four days. It is an ordinary request for one Friday off. The approval line runs team head, department head, then CEO Yoon Sanghyuk, and that last field is still blank. Not approved, not returned. Just empty.",
        "Then a photo lands in the group chat: a “Leave Order” brushed in ink on a single A4 sheet, three red seals underneath, nine people summoned. It is from Na Junhyuk. He has booked a guesthouse right by the Gyeongpo Fireworks Festival, four rooms and twelve sets of bedding. His diagnosis: watching a man say he doesn’t recall twenty-three times has worn everyone down to half a face. The fireworks start at 9 p.m. tomorrow, a six-minute walk away.",
        "At Mulgyeol Stay, six inner tubes hang in the yard and the young owner, Yeo Dain, hands over four keys with a smile. Then Kwon Dohyun’s pen stops on the guest register. He knows this address by heart. It is the old Haeon Guesthouse you chased last year, the registered address of the company that funneled advisory fees to a Seoul gallery. That company was liquidated, and the house went to auction.",
        "Na Junhyuk admits he booked it on purpose. Paying full price to sleep in the house their money flowed through: what cleaner revenge could there be? Tonight Mulgyeol Stay is fully booked for the first time since it opened. And part of the money Yeo Dain used to win it at auction came from a KD Capital business loan."
      ],
      cast: [
        { name: "Na Junhyuk", note: "Writes a Leave Order by brush pen and drags everyone to the sea. He had his own reasons for picking the guesthouse." },
        { name: "Kwon Dohyun", note: "A colleague who cannot let one line on a guest register slide. He still knows the Haeon Guesthouse address by heart." },
        { name: "Yeo Dain", note: "Owner of Mulgyeol Stay in Gyeongpo, age 32, a former contract teller at KD Bank’s Yeongdong Branch who won the house at auction." },
        { name: "Yoon Sanghyuk", note: "CEO of KD Capital. The last approval field on your leave request is his, and it has been empty for four days." }
      ],
      question: "At the seaside where you came to rest, if the last owner’s address becomes the new owner’s bill, what do you protect first? And does cutting off one man really break the chain?",
    },
    ja: {
      setting: "2026年の晩夏 · KDキャピタル リスク管理部 → キョンポの「ムルギョルステイ」 → キョンポの防波堤",
      premise: [
        "二度目の聴聞会が終わって六日。あなたが出した休暇申請が、四日も承認画面に載ったままです。金曜を一日休みたいという、ごく普通の申請です。承認ラインはチーム長、部署長、そして代表取締役ユン・サンヒョク。最後の欄がまだ空いています。承認でも差し戻しでもない、ただの空欄です。",
        "そこへグループチャットに写真が一枚上がります。A4一枚に筆ペンで書いた「休暇命令書」、その下に赤いはんこが三つ、参加要請は九人。送り主はナ・ジュニョクです。キョンポ花火大会の目の前のペンションを押さえた、部屋は四つ、布団は十二組。記憶にないと言う人を二十三回も見続けたせいで、みんな顔が半分になっている、というのが彼の診断です。花火は翌日の夜9時、宿から歩いて6分です。",
        "着いた「ムルギョルステイ」の庭には浮き輪が六つ掛かっていて、若いオーナーのヨ・ダインが笑顔で鍵を四本渡してくれます。ところが宿泊名簿に署名していたクォン・ドヒョンのペンが止まります。彼が覚えている住所です。去年あなたが追っていたヘオン・ペンション、顧問料(助言の代金として出ていったお金)がソウルのギャラリーへ流れていた会社の登記住所。その会社は清算(会社を整理してなくす手続き)され、家は競売(借金を返せない人の財産を裁判所が公開入札で売る手続き)にかけられました。",
        "ナ・ジュニョクは、わかっていて予約したと平然と言います。あの人たちのお金が流れていた家に、正規の料金を払って泊まってやる。これ以上きれいな仕返しはないだろう、と。今夜のムルギョルステイは、開業以来初めての満室です。そしてヨ・ダインがこの家を落札した資金の一部は、KDキャピタルの事業者ローンです。"
      ],
      cast: [
        { name: "ナ・ジュニョク", note: "筆ペンで休暇命令書を書き、みんなを海辺へ連れ出す人。宿選びにも彼なりの理由があります。" },
        { name: "クォン・ドヒョン", note: "宿泊名簿の住所一行を見過ごせない仲間。ヘオン・ペンションの住所を今も覚えています。" },
        { name: "ヨ・ダイン", note: "キョンポ「ムルギョルステイ」のオーナー、32歳。KD銀行ヨンドン支店の窓口契約社員だった人で、競売でこの家を落札しました。" },
        { name: "ユン・サンヒョク", note: "KDキャピタル代表取締役。あなたの休暇申請の最後の承認欄は彼の席で、その欄は四日間空いたままです。" }
      ],
      question: "休みに来た海辺で、前の持ち主の住所が新しい持ち主への請求書になるとしたら、まず何を守るべきでしょうか。一人を切り離せば、鎖は本当に切れるのでしょうか。",
    },
  },

  case43: {
    ko: {
      setting: "2026년 9월 7일 · KD캐피탈 위험관리부 → 회기동 헌책방 1층 → 본사 33층 이사회 회의실",
      premise: [
        "KD금융그룹 이사회 안건 제1호는 사내이사(회사 경영에 직접 참여하는 이사) 윤상혁의 거취입니다. 올라온 것은 그의 해임안(이사를 자리에서 물러나게 하는 안건)과 임시 주주총회 소집 건. 회의는 9월 7일 월요일 오후 2시, 본사 33층에서 열립니다.",
        "대기발령(맡은 일 없이 다음 자리를 기다리게 하는 인사 조치) 여섯 달째인 한서윤이 전화를 겁니다. 표를 던지는 사람은 여덟. 서도경 회장, 그리고 사외이사(회사 밖에서 와서 경영진을 감시하는 이사) 일곱 명이고, 가결에는 다섯 표가 필요합니다. 그런데 안건 설명서에 2023년 이사회 이야기는 한 줄도 없습니다. 마지막 줄에는 47곳의 「관련 위험 자산 정리 완료」라는 문장만 있습니다. 한서윤의 말은 짧습니다. 한 사람만 나가면 끝나는 거라면, 그때 반려 버튼을 누른 자기 같은 사람은 없던 일이 된다고.",
        "회기동 헌책방 탁자 위에 A4 일곱 장이 깔립니다. 사외이사 한 명당 한 장씩 만든 손익계산서이고, 맨 아래 칸은 찬성 확률입니다. 오진우가 휴대폰을 들이밀며 은채원 교수를 0.6으로 봤다고 하자, 권도현이 근거를 묻습니다. 대답은 「감이요」. 권도현은 말없이 그 숫자에 줄을 긋습니다.",
        "정리하면 확실한 찬성 셋, 반대가 유력한 둘. 사외이사 가운데 둘은 최대주주 킹스데일 파트너스가 추천한 사람으로 뉴욕에서 화상으로 들어옵니다. 남은 칸은 막내 은채원 0.48, 이사회 의장 연태경 0.50, 그리고 회장의 한 표. 권도현은 회장님은 계산이 안 된다고, 변수가 아니라 상수라고 덧붙입니다. 임경수가 쪽지로 일러 준 대로 연태경의 종이를 뒤집자, 연필로 쓴 한 줄이 나옵니다. 2023년 4월 이사회 참석, 그때도 사외이사."
      ],
      cast: [
        { name: "한서윤", note: "트리거랩 실장이었고, 지금은 여섯 달째 대기발령 중입니다. 설명서에 빠진 2023년을 가장 먼저 짚습니다." },
        { name: "권도현", note: "사외이사 일곱 명을 손익계산서 일곱 장으로 바꿔 놓는 계산꾼. 감으로 쓴 숫자는 용납하지 않습니다." },
        { name: "오진우", note: "숫자 옆에 직감을 적어 넣는 동료. 오늘은 은채원 교수의 표를 두고 권도현과 부딪힙니다." },
        { name: "연태경", note: "KD금융그룹 이사회 의장이자 사외이사. 찬성 확률 0.50, 종이 뒷면에는 연필 한 줄이 적혀 있습니다." },
        { name: "서도경", note: "KD금융그룹 회장. 권도현의 표현으로는 변수가 아니라 상수인, 마지막 한 표의 주인입니다." }
      ],
      question: "한 사람을 내보내는 결의는 2023년의 기록을 여는 문일까요, 닫는 문일까요? 그 차이가 결의문의 마지막 한 줄에 있다면, 그 줄에는 무엇이 적혀야 할까요?",
    },
    en: {
      setting: "September 7, 2026 · KD Capital Risk Management Department → Bookshop 1st floor, Hoegi-dong → Boardroom, 33rd floor, head office",
      premise: [
        "Agenda Item 1 for the KD Financial Group board is the future of inside director Yoon Sanghyuk: a motion to dismiss him and to call an extraordinary shareholders’ meeting. The board meets Monday, September 7, at 2 p.m. on the 33rd floor of head office.",
        "Han Seoyun, six months into a standby assignment with no work and no post, calls you. Eight people vote: Chairman Seo Dokyung and seven outside directors, people brought in from outside to watch over management. Five votes pass the motion. But the agenda brief does not contain one line about the 2023 board. Its last sentence simply reports “related risk assets cleared” at 47 sites. Her point is blunt: if this ends with one man leaving, then people like her, who pressed the return button back then, never happened.",
        "On a table at the Hoegi-dong bookshop lie seven A4 sheets, a profit-and-loss statement for each outside director with the probability of a yes in the bottom box. Oh Jinwoo pushes his phone forward: he had Professor Eun Chaewon at 0.6. Kwon Dohyun asks on what basis. “Gut feeling.” Kwon Dohyun silently strikes the number out.",
        "The tally: three certain yeses, two likely noes. Two of the outside directors were recommended by the top shareholder, Kingsdale Partners, and will join by video from New York. What’s left is the youngest, Eun Chaewon, at 0.48, Board Chair Yeon Taekyung at 0.50, and the Chairman’s vote. The Chairman, Kwon Dohyun adds, can’t be calculated; he isn’t a variable but a constant. Following a note from Lim Kyungsoo, he turns Yeon Taekyung’s sheet over and finds one penciled line: attended the April 2023 board, an outside director then too."
      ],
      cast: [
        { name: "Han Seoyun", note: "Formerly head of Trigger Lab, now six months on standby. She is the first to point out the missing year 2023." },
        { name: "Kwon Dohyun", note: "The calculator who turns seven outside directors into seven profit-and-loss sheets, and tolerates no number written on instinct." },
        { name: "Oh Jinwoo", note: "A colleague who pencils gut feelings next to figures, and clashes with Kwon Dohyun over Professor Eun Chaewon’s vote." },
        { name: "Yeon Taekyung", note: "Board Chair and outside director of KD Financial Group. A 0.50 on the sheet, and one line in pencil on the back." },
        { name: "Seo Dokyung", note: "Chairman of KD Financial Group, holder of the last vote, and in Kwon Dohyun’s words a constant rather than a variable." }
      ],
      question: "Does a resolution that removes one man open the record of 2023, or close it? If the difference lies in the last line of the resolution, what should that line say?",
    },
    ja: {
      setting: "2026年9月7日 · KDキャピタル リスク管理部 → フェギ洞の古本屋1階 → 本社33階の取締役会会議室",
      premise: [
        "KD金融グループ取締役会の議案第1号は、社内取締役(会社の経営に直接かかわる取締役)ユン・サンヒョクの進退です。上程されたのは彼の解任案(取締役をその座から退かせる議案)と、臨時株主総会の招集。会議は9月7日の月曜、午後2時から本社33階で開かれます。",
        "待機発令(仕事を外され、次の席を待たされる人事措置)が六か月目に入ったハン・ソユンから電話がかかってきます。票を投じるのは八人。ソ・ドギョン会長と、社外取締役(社外から来て経営陣を見張る取締役)七人で、可決には五票が必要です。ところが議案の説明書には、2023年の取締役会のことが一行もありません。最後の行には47か所の「関連リスク資産の整理完了」という一文があるだけです。一人が出ていけば終わるのなら、あのとき差し戻しボタンを押した自分のような人間はいなかったことになる、と彼女は言います。",
        "フェギ洞の古本屋のテーブルにA4が七枚並びます。社外取締役一人につき一枚の損益計算書で、いちばん下の欄は賛成の確率です。オ・ジヌがスマートフォンを突き出し、ウン・チェウォン教授は0.6と見たと言うと、クォン・ドヒョンが根拠を尋ねます。答えは「勘です」。クォン・ドヒョンは黙ってその数字に線を引きます。",
        "整理すると、確実な賛成が三、反対が有力なのが二。社外取締役のうち二人は筆頭株主キングスデール・パートナーズの推薦で、ニューヨークからオンラインで参加します。残る欄は最年少のウン・チェウォン0.48、議長ヨン・テギョン0.50、そして会長の一票。会長は計算できない、変数ではなく定数だから、とクォン・ドヒョンは付け加えます。イム・ギョンスのメモの指示どおりヨン・テギョンの紙を裏返すと、鉛筆の一行が出てきます。2023年4月の取締役会に出席、そのときも社外取締役。"
      ],
      cast: [
        { name: "ハン・ソユン", note: "トリガーラボの室長だった人で、いまは待機発令六か月目。説明書から抜けた2023年を真っ先に指摘します。" },
        { name: "クォン・ドヒョン", note: "社外取締役七人を損益計算書七枚に変えてしまう計算屋。勘で書いた数字は許しません。" },
        { name: "オ・ジヌ", note: "数字の横に直感を書き込む仲間。ウン・チェウォン教授の票をめぐってクォン・ドヒョンとぶつかります。" },
        { name: "ヨン・テギョン", note: "KD金融グループ取締役会の議長で社外取締役。賛成確率は0.50、紙の裏には鉛筆の一行があります。" },
        { name: "ソ・ドギョン", note: "KD金融グループ会長。クォン・ドヒョンに言わせれば変数ではなく定数の、最後の一票の持ち主です。" }
      ],
      question: "一人を追い出す決議は、2023年の記録を開く扉でしょうか、それとも閉じる扉でしょうか。その違いが決議文の最後の一行にあるのなら、そこには何が書かれるべきでしょうか。",
    },
  },

  case44: {
    ko: {
      setting: "2026년 9월 9~10일 · 회기동 헌책방 1층 → 서울중앙지방법원 동관 앞 방청권 줄 → 417호 법정",
      premise: [
        "오진우가 A4 한 장을 테이블에 내려놓습니다. 내일 오전 10시, 서울중앙지방법원 417호에서 해온파트너스 자문료(조언값이라며 내보낸 돈) 사건의 1심 선고가 있습니다. 죄명은 배임(맡은 일을 저버려 회사에 손해를 끼친 죄)이고, 검찰은 징역 7년과 자문료 38억 4천만 원 몰수를 요청했습니다.",
        "그런데 오늘 오후 윤상혁 쪽이 서류 두 가지를 냈습니다. KD은행 명의의 처벌불원서(피해자가 처벌을 원하지 않는다고 법원에 내는 서류), 그리고 직원 1,204명의 탄원서입니다. 오진우는 웃지 않습니다. 법으로 보면 이 죄의 피해자는 KD은행이고, 피해자가 괜찮다고 하면 판사는 그걸 양형(형량을 얼마로 할지 정하는 일)에 넣어야 합니다. 3년을 쫓은 돈인데 용서는 회사가 한다는 것이 그의 한 줄 요약입니다.",
        "다음 날 새벽, 법원 동관 앞에 줄이 섭니다. 방청석은 102석, 신청자는 540명, 추첨은 8시입니다. 나준혁은 영동 어르신 여섯 분을 승합차로 모셔 와 「서울 법원 구경」이라고 설명했고, 권도현은 당첨 확률 18.9%를 선언합니다. 피해자 모임에서 나온 사람만 38명입니다.",
        "그런데 줄 한가운데에 서로 모르는 사이인데 똑같은 남색 모자를 쓴 20명이 서 있습니다. 한 사람의 휴대폰에 문자가 떠 있습니다. 법원 방청 대기 일당 12만 원, 당첨되면 5만 원 추가. 이대로라면 모임 사람 절반은 법정 문턱도 넘지 못합니다. 그리고 이날 재판장은 43분 동안 판결문을 읽으며 「다만」이라는 말을 스물세 번 하게 됩니다."
      ],
      cast: [
        { name: "오진우", note: "해온파트너스 자문료를 3년 동안 쫓아온 사람. 선고 전날 들어온 처벌불원서 앞에서 웃음을 잃습니다." },
        { name: "강태민", note: "플로우온 풀필먼트센터 야간조 반장 출신. 새벽 방청권 줄에 피해자 모임 사람들과 함께 섭니다." },
        { name: "나준혁", note: "영동 어르신 여섯 분을 승합차에 태워 서울 법원까지 모셔 온 사람입니다." },
        { name: "권도현", note: "줄 앞에서도 확률부터 계산하는 동료. 그가 낸 당첨 확률은 18.9%입니다." }
      ],
      question: "회사가 피해자인 죄에서 회사가 용서하면, 그 값은 누가 치를까요? 도장만 찍히고 이름은 없는 용서에, 누가 이름을 물어야 할까요?",
    },
    en: {
      setting: "September 9-10, 2026 · Bookshop 1st floor, Hoegi-dong → Gallery-pass line outside the East Wing, Seoul Central District Court → Courtroom 417",
      premise: [
        "Oh Jinwoo lays a single A4 sheet on the table. Tomorrow at 10 a.m., in Room 417 of the Seoul Central District Court, the first-instance verdict comes down in the Haeon Partners advisory fee case. The charge is breach of trust, abandoning one’s duty and causing the company loss. Prosecutors have asked for seven years in prison and confiscation of 3.84 billion won in advisory fees.",
        "But this afternoon Yoon Sanghyuk’s side filed two documents: a no-punishment letter in KD Bank’s name, telling the court the victim doesn’t want him punished, and a petition signed by 1,204 employees. Oh Jinwoo isn’t smiling. Under the law, the victim of this crime is KD Bank, and if the victim says it’s fine, the judge has to weigh that in the sentence. He chased this money for three years, and now the company is the one doing the forgiving.",
        "At dawn the next day a line forms outside the court’s East Wing. There are 102 gallery seats, 540 applicants, and a lottery at 8 a.m. Na Junhyuk has driven six Yeongdong seniors up in a van and called it a “Seoul court tour,” and Kwon Dohyun announces an 18.9 percent chance of winning. Thirty-eight members of the victims’ group have come.",
        "Yet in the middle of the line stand twenty strangers in identical navy caps. One of them has a text open on his phone: court gallery line, 120,000 won a day, 50,000 more if you win. At this rate, half the group won’t make it past the courtroom door. And over the next day’s 43-minute ruling, the presiding judge will say “however” twenty-three times."
      ],
      cast: [
        { name: "Oh Jinwoo", note: "He has chased the Haeon Partners advisory fees for three years, and loses his smile at the no-punishment letter filed the day before." },
        { name: "Kang Taemin", note: "Former night-shift foreman at the FlowOn fulfillment center. He joins the victims’ group in the dawn line for gallery passes." },
        { name: "Na Junhyuk", note: "He drove six elderly neighbors from Yeongdong all the way to the Seoul court." },
        { name: "Kwon Dohyun", note: "Even in a queue he calculates the odds first. His figure: an 18.9 percent chance." }
      ],
      question: "When the company is the victim and the company forgives, who pays the price? Who should ask whose name stands behind a forgiveness that carries only a seal?",
    },
    ja: {
      setting: "2026年9月9〜10日 · フェギ洞の古本屋1階 → ソウル中央地方法院東館前の傍聴券の列 → 417号法廷",
      premise: [
        "オ・ジヌがA4を一枚テーブルに置きます。明日の午前10時、ソウル中央地方法院417号法廷で、ヘオン・パートナーズ顧問料(助言の代金として出ていったお金)事件の1審判決が言い渡されます。罪名は背任(任された務めを裏切って会社に損害を与える罪)で、検察は懲役7年と顧問料38億4千万ウォンの没収を求めています。",
        "ところが今日の午後、ユン・サンヒョク側が二つの書類を出しました。KD銀行名義の処罰不願書(被害者が処罰を望まないと裁判所に出す書面)と、社員1,204人の嘆願書です。オ・ジヌは笑いません。法律上この罪の被害者はKD銀行で、被害者が構わないと言えば、裁判官はそれを量刑(刑の重さを決めること)に入れなければなりません。3年追いかけたお金なのに、許すのは会社なんですね、と彼はまとめます。",
        "翌朝の夜明け、法院東館の前に列ができます。傍聴席は102席、申込者は540人、抽選は8時です。ナ・ジュニョクはヨンドンのお年寄り六人をワゴン車で連れてきて「ソウルの裁判所見学」と説明し、クォン・ドヒョンは当選確率18.9%を宣言します。被害者の会から来た人だけで38人です。",
        "ところが列の真ん中に、互いに知らない同士なのにそろいの紺の帽子をかぶった20人が立っています。そのうち一人のスマートフォンにメッセージが見えます。裁判傍聴の待機、日当12万ウォン、当選したら5万ウォン追加。このままでは、会の人たちの半分は法廷に入ることさえできません。そしてこの日、裁判長は43分にわたる判決文の中で「ただし」を二十三回口にすることになります。"
      ],
      cast: [
        { name: "オ・ジヌ", note: "ヘオン・パートナーズの顧問料を3年間追いかけてきた人。判決前日に出た処罰不願書を前に、笑顔を失います。" },
        { name: "カン・テミン", note: "フロウオンのフルフィルメントセンター夜勤班の班長だった人。夜明けの傍聴券の列に、被害者の会の人たちと並びます。" },
        { name: "ナ・ジュニョク", note: "ヨンドンのお年寄り六人をワゴン車に乗せて、ソウルの裁判所まで連れてきた人です。" },
        { name: "クォン・ドヒョン", note: "列の前でもまず確率を計算する仲間。彼の出した当選確率は18.9%です。" }
      ],
      question: "会社が被害者である罪で会社が許したら、その代償は誰が払うのでしょうか。はんこだけが押されて名前のない許しに、誰が名前を問うべきなのでしょうか。",
    },
  },

  case45: {
    ko: {
      setting: "2026년 9월 15일부터 사흘 · 이음병원 장례식장 3호 빈소",
      premise: [
        "임경수가 9월 15일 새벽 4시 50분, 이음병원에서 세상을 떠납니다. 집에 남은 그의 사진은 1996년 사원증 사진 한 장뿐이었습니다. 그래서 손녀 임소율이 밤을 새워 영정을 그렸습니다. 상주(장례를 대표해 조문을 받는 가족)인 아버지 임재윤은 두바이에서 비행기를 타고 오는 중이라, 상복 소매를 두 번 접어 올린 임소율이 그 자리에 섭니다.",
        "임소율이 누런 봉투 하나를 꺼냅니다. 겉봉에는 연필로 이렇게 적혀 있습니다. 「율이와 반대 의견 쓴 사람이 같이. 셋째 날 새벽에 열 것.」 할아버지가 마지막으로 찾은 물건인데, 무엇이 들었는지는 끝내 말하지 않았다고 합니다. 마지막까지 뜸을 들이는 게 정말 할아버지답다며 임소율은 웃습니다. 빈소에는 고인의 흉을 보며 웃는 조문객들이 하나둘 늘어 갑니다.",
        "조화 26개 가운데 가장 큰 두 개가 영정 바로 옆에 섭니다. 리본에는 「KD금융그룹 임직원 일동」, 그리고 이름 석 자 「윤상혁」. KD은행 법무팀 과장 하승원이 절을 하더니 곧장 내용증명(누가 언제 무엇을 요구했는지 우체국이 증명해 주는 편지)을 내밉니다. 고인이 재직 중 반출한 은행 문서 일체를 발인(관을 장례식장에서 떠나보내는 일) 전에 돌려 달라는 요구입니다. 「봉투 형태의 문서 포함」이라는 문구까지 붙어 있습니다. 그 봉투를 아는 사람은 다섯 명뿐인데도요.",
        "오후 1시, 막 도착한 임재윤이 그 종이를 읽고 조화 두 개를 번갈아 봅니다. 아버지를 내보낸 회사가 꽃을 보내고, 같은 날 아버지의 종이를 내놓으라고 한다. 이게 무슨 장례냐는 그의 물음에 아무도 바로 답하지 못합니다. 봉투를 열 셋째 날 새벽까지는 아직 이틀이 남았습니다."
      ],
      cast: [
        { name: "임경수", note: "KD은행 기업대출심사팀장 출신. 사흘 뒤에 열라는 봉투 하나를 남기고 떠났습니다." },
        { name: "임소율", note: "웹툰 작가이자 임경수의 손녀. 사진 대신 직접 그린 영정을 걸고, 아버지 대신 빈소를 지킵니다." },
        { name: "임재윤", note: "임경수의 아들, 두바이 담수화 설비 현장 소장. 도착하자마자 조화와 요구서를 한꺼번에 마주합니다." },
        { name: "하승원", note: "KD은행 법무팀 과장. 조문을 마치자마자 고인의 문서를 돌려 달라는 내용증명을 내밉니다." }
      ],
      question: "원본만이 증명할 수 있는 것이 있고, 그 원본은 늘 누군가의 유품입니다. 고인이 남긴 종이 한 장의 길은 누가 정해야 할까요?",
    },
    en: {
      setting: "Three days from September 15, 2026 · Memorial Room 3, Ieum Hospital funeral hall",
      premise: [
        "Lim Kyungsoo dies at 4:50 a.m. on September 15 at Ieum Hospital. The only photo of him left at home was his 1996 employee ID picture, so his granddaughter Lim Soyul stayed up all night drawing his memorial portrait. Her father, Lim Jaeyoon, is chief mourner, the family member who receives condolences, but he is still in the air from Dubai, so Lim Soyul stands in his place with the sleeves of her mourning clothes folded back twice.",
        "She takes out a yellowed envelope. On the front, in pencil: “Yul and the person who wrote the dissent, together. Open at dawn on the third day.” It was the last thing her grandfather asked for, and he never said what was inside. Keeping everyone waiting to the very end, she says, is so like him. Around the memorial room, mourners trade stories about the old man’s faults and laugh.",
        "Of twenty-six funeral wreaths, the two largest stand right beside the portrait. Their ribbons read “All Employees of KD Financial Group” and a single name: “Yoon Sanghyuk.” Ha Seungwon, a manager on KD Bank’s legal team, bows, then immediately hands over a certified letter. It demands that every bank document the deceased took out while employed be returned before the funeral procession, “including documents in envelope form.” Only five people know the envelope exists.",
        "At 1 p.m., Lim Jaeyoon arrives, reads the letter, and looks from one wreath to the other. The company that pushed his father out sends flowers, and on the same day tells the family to hand over his papers. What kind of funeral is this? Nobody has an answer ready. Two days remain until the envelope may be opened."
      ],
      cast: [
        { name: "Lim Kyungsoo", note: "Former head of corporate loan review at KD Bank. He leaves behind one envelope, not to be opened for three days." },
        { name: "Lim Soyul", note: "Webtoon artist and Lim Kyungsoo’s granddaughter. She hangs a portrait she drew herself and keeps vigil in her father’s place." },
        { name: "Lim Jaeyoon", note: "Lim Kyungsoo’s son, a desalination plant site manager in Dubai, who lands straight into the wreaths and the demand letter." },
        { name: "Ha Seungwon", note: "A manager on KD Bank’s legal team who pays his respects and then asks for the dead man’s papers." }
      ],
      question: "Some things only an original can prove, and an original is always someone’s keepsake. Who should decide where the paper a dead man left behind goes next?",
    },
    ja: {
      setting: "2026年9月15日から三日間 · イウム病院葬儀場3号の弔問室",
      premise: [
        "9月15日の明け方4時50分、イム・ギョンスがイウム病院で亡くなります。家に残っていた彼の写真は、1996年の社員証の一枚だけでした。だから孫娘のイム・ソユルが徹夜で遺影を描きました。喪主(葬儀を代表して弔問を受ける家族)である父のイム・ジェユンはドバイから飛行機で向かっている最中で、喪服の袖を二回折り返したイム・ソユルがその場所に立ちます。",
        "イム・ソユルが黄ばんだ封筒を取り出します。表には鉛筆でこう書かれています。「ユルと、反対意見を書いた人が一緒に。三日目の明け方に開けること。」祖父が最後に探していたものですが、中身が何かはとうとう言わなかったそうです。最後まで気を持たせるところが本当におじいちゃんらしい、とイム・ソユルは笑います。弔問室には、故人の悪口を言って笑う弔問客が少しずつ増えていきます。",
        "26基の供花のうち、いちばん大きな二つが遺影のすぐ横に並びます。リボンには「KD金融グループ役職員一同」、そして名前だけの「ユン・サンヒョク」。KD銀行法務チームの課長ハ・スンウォンは拝礼を済ませるなり、内容証明(誰がいつ何を求めたかを郵便局が証明してくれる手紙)を差し出します。故人が在職中に持ち出した銀行の文書一切を、出棺(棺を葬儀場から送り出すこと)の前に返してほしいという要求です。「封筒の形の文書を含む」という一文まで付いています。その封筒を知っているのは、五人しかいないのに。",
        "午後1時、着いたばかりのイム・ジェユンがその紙を読み、二つの供花を見比べます。父を追い出した会社が花を贈り、同じ日に父の紙を差し出せと言う。これがどんな葬式だ、という彼の問いに、誰もすぐには答えられません。封筒を開ける三日目の明け方まで、まだ二日あります。"
      ],
      cast: [
        { name: "イム・ギョンス", note: "KD銀行の企業融資審査チーム長だった人。三日後に開けるようにと、封筒を一つ残して旅立ちました。" },
        { name: "イム・ソユル", note: "ウェブトゥーン作家で、イム・ギョンスの孫娘。自分で描いた遺影を掲げ、父に代わって弔問室を守ります。" },
        { name: "イム・ジェユン", note: "イム・ギョンスの息子で、ドバイの海水淡水化設備の現場所長。着いた途端、供花と要求書に同時に向き合います。" },
        { name: "ハ・スンウォン", note: "KD銀行法務チームの課長。弔問を終えるとすぐ、故人の文書の返却を求める内容証明を差し出します。" }
      ],
      question: "原本にしか証明できないことがあり、その原本はいつも誰かの形見です。故人が残した紙一枚の行き先は、誰が決めるべきなのでしょうか。",
    },
  },

  case46: {
    ko: {
      setting: "2026년 9월 19일 · 회기동 헌책방 1층 → 판교 KD데이터랩 데이터센터 지하 3층 폐기 대기 구역",
      premise: [
        "「echo_fragment」라는 조각만으로는 에코가 한 문장도 끝까지 잇지 못합니다. 이민서가 KD데이터랩의 자산 폐기 일정표를 엽니다. 트리거랩에서 반납한 서버 12대, 9월 19일 오후 6시 디스크 파쇄. 그중 네 대에는 이민서가 예전에 붙여 둔 스티커가 그대로 남아 있습니다. 「에코 1~4호 · 발로 차지 마시오.」 폐기를 요청한 부서는 그룹전략실입니다.",
        "그 디스크 안에는 설계 로그(실험을 어떻게 짤지 바꾼 날짜와 사람을 남긴 기록)도 들어 있습니다. 임소율은 할아버지가 남긴 반대 의견서 뒷장 원본을 고해상도로 스캔해 가져왔습니다. 이민서의 말은 단순합니다. 할아버지는 종이를 남기고 가셨지만, 에코는 지금 꺼내지 않으면 내일 저녁 여섯 시에 가루가 된다고. 파쇄까지 남은 시간은 스무 시간입니다.",
        "판교 데이터센터 지하 3층, 폐기 대기 구역에 반납 서버 12대가 비닐을 뒤집어쓰고 서 있습니다. 야간 당직을 막 끝낸 엔지니어 응우옌 반 남이 출입 태블릿을 내밀며 규칙을 알려 줍니다. 여기서는 뛰면 안 되고, 서버한테 반말도 안 된다고, 얘들 귀가 밝다고. 권도현은 벌써 파쇄 비용을 셉니다. 한 대에 4만 원. 3년 치 기억을 지우는 값으로는 싸다는 게 그의 감상입니다.",
        "폐기 승인서를 보면 확인자 칸에는 응우옌 반 남과 프리야 나이르의 이름이 있지만, 승인자 칸은 비어 있습니다. 응우옌 반 남이 목소리를 낮춥니다. 빈칸이어도 일정은 돌아간다고, 여기선 원래 그렇다고. 게다가 에코 디스크 네 장 가운데 한 장은 이미 초기화됐습니다. 되살아난 에코가 3,412건의 설계 로그를 다시 셀 수 있다면, 그 빈칸들 옆에 무엇이 남아 있었는지 보일지도 모릅니다."
      ],
      cast: [
        { name: "이민서", note: "트리거랩의 데이터 기록 담당. 에코 서버에 「발로 차지 마시오」 스티커를 붙인 사람이고, 지금은 에코를 꺼내려 합니다." },
        { name: "응우옌 반 남", note: "KD데이터랩 판교 데이터센터의 인프라 엔지니어. 서버에게도 예의를 지키라고 말하는 야간 당직자입니다." },
        { name: "권도현", note: "파쇄 비용부터 계산하는 동료. 한 대에 4만 원이라는 숫자에 쓴웃음을 짓습니다." },
        { name: "에코", note: "대출 판단을 검증하던 시스템. 지금은 조각난 채로 한 문장도 끝까지 말하지 못합니다." }
      ],
      question: "승인자 없는 종이 한 장이 기계와 그 기억을 지우려 할 때, 비어 있는 칸은 무엇을 말해 줄까요? 그리고 그 계산 안에 당신 자신도 들어가야 할까요?",
    },
    en: {
      setting: "September 19, 2026 · Bookshop 1st floor, Hoegi-dong → Disposal holding area, basement level 3, KD Data Lab data center, Pangyo",
      premise: [
        "With nothing but the piece called “echo_fragment,” ECHO cannot finish a single sentence. Lee Minseo opens KD Data Lab’s asset disposal schedule: twelve servers returned by Trigger Lab, disks to be shredded at 6 p.m. on September 19. Four of them still carry the stickers Lee Minseo once put on them: “ECHO 1-4 · Do not kick.” The department that requested the disposal is the Group Strategy Office.",
        "The design log is on those disks too, the record of who changed how the experiment was set up and when. Lim Soyul has brought a high-resolution scan of the original back page of the dissent her grandfather kept. Lee Minseo puts it simply: Grandpa left paper behind, but if they don’t get ECHO out now, it turns to dust at six tomorrow evening. Twenty hours remain.",
        "Three floors below ground in the Pangyo data center, the twelve returned servers stand under plastic sheeting. Nguyen Van Nam, an engineer just off night duty, hands over the entry tablet along with the house rules: no running, and no talking down to the servers, because they have good ears. Kwon Dohyun is already pricing the shredding at 40,000 won a unit. Cheap, he remarks, for erasing three years of memory.",
        "On the disposal approval, Nguyen Van Nam and Priya Nair are listed as verifiers, but the approver field is empty. Nguyen Van Nam lowers his voice: empty or not, the schedule runs. That’s how it always is here. One of the four ECHO disks has already been wiped. If a revived ECHO could recount all 3,412 design log entries, it might show what was left beside those empty fields."
      ],
      cast: [
        { name: "Lee Minseo", note: "Trigger Lab’s data recorder, who once stuck “Do not kick” on ECHO’s servers and now means to get ECHO out." },
        { name: "Nguyen Van Nam", note: "Infrastructure engineer at the KD Data Lab data center in Pangyo, on night duty, who insists on good manners even toward servers." },
        { name: "Kwon Dohyun", note: "A colleague who prices the shredding before anything else, and smiles wryly at 40,000 won a unit." },
        { name: "ECHO", note: "The system that once checked loan judgments, now in fragments and unable to finish a sentence." }
      ],
      question: "When a single page with no approver is set to erase a machine and its memory, what can an empty field tell you? And should you yourself be part of that calculation?",
    },
    ja: {
      setting: "2026年9月19日 · フェギ洞の古本屋1階 → パンギョ KDデータラボのデータセンター地下3階の廃棄待機区域",
      premise: [
        "「echo_fragment」という断片だけでは、ECHOは一つの文も最後まで言い切れません。イ・ミンソがKDデータラボの資産廃棄スケジュールを開きます。トリガーラボから返却されたサーバー12台、9月19日午後6時にディスク破砕。そのうち四台には、イ・ミンソが以前に貼ったステッカーがそのまま残っています。「ECHO 1〜4号 · 蹴らないでください。」廃棄を依頼した部署はグループ戦略室です。",
        "そのディスクには設計ログ(実験の組み方を変えた日付と人を残した記録)も入っています。イム・ソユルは、祖父が残した反対意見書の裏面の原本を高解像度でスキャンして持ってきました。イ・ミンソの言い分は単純です。おじいちゃんは紙を残していったけれど、ECHOはいま出さなければ明日の夕方6時に粉になる。破砕まで、残りは20時間です。",
        "パンギョのデータセンター地下3階、廃棄待機区域に、返却サーバー12台がビニールをかぶって立っています。夜間当直を終えたばかりのエンジニア、グエン・ヴァン・ナムが入館用タブレットを差し出し、ルールを教えてくれます。ここでは走らないこと、サーバーにタメ口もだめ、この子たちは耳がいいので。クォン・ドヒョンはもう破砕費用を数えています。一台4万ウォン。3年分の記憶を消す値段にしては安い、というのが彼の感想です。",
        "廃棄承認書を見ると、確認者の欄にはグエン・ヴァン・ナムとプリヤ・ナイルの名前がありますが、承認者の欄は空いています。グエン・ヴァン・ナムが声を落とします。空欄でもスケジュールは回る、ここではいつもそうだ、と。しかもECHOのディスク四枚のうち一枚は、すでに初期化されています。よみがえったECHOが3,412件の設計ログを数え直せたなら、あの空欄の横に何が残っていたのかが見えるかもしれません。"
      ],
      cast: [
        { name: "イ・ミンソ", note: "トリガーラボのデータ記録担当。ECHOのサーバーに「蹴らないでください」と貼った人で、いまECHOを連れ出そうとしています。" },
        { name: "グエン・ヴァン・ナム", note: "KDデータラボ・パンギョデータセンターのインフラエンジニア。サーバーにも礼儀を守れと言う夜間当直です。" },
        { name: "クォン・ドヒョン", note: "まず破砕費用を計算する仲間。一台4万ウォンという数字に苦笑いします。" },
        { name: "ECHO", note: "融資判断を検証していたシステム。いまは断片のまま、一つの文も最後まで話せません。" }
      ],
      question: "承認者のいない紙一枚が機械とその記憶を消そうとするとき、空いた欄は何を語ってくれるのでしょうか。そしてその計算の中に、あなた自身も入るべきなのでしょうか。",
    },
  },

  case47: {
    ko: {
      setting: "2026년 추석 · KD캐피탈 위험관리부 → 망원시장 가을떡방 → 인천 남동공단 끝까지정밀",
      premise: [
        "사건 12로부터 꼭 1년, 추석이 다시 옵니다. 첫 번째 문자는 문가을에게서 옵니다. 「찜기 여섯 대, 사람은 모자라요.」 두 번째는 공익 변호사 선재윤의 메일입니다. 집단소송(피해자 여럿이 함께 내는 소송)이 법원 조정(판사가 가운데서 양쪽 합의를 이끄는 절차)으로 넘어갔고, 그룹이 2차 배상 기준안을 내놓았습니다.",
        "기준안에 따르면 서류 없는 피해자 212명 가운데 181명은 피해가 확인돼 연휴 안에 돈이 들어옵니다. 남은 31명 옆에는 한 단어가 찍혀 있습니다. 「확인 불가.」 원고 쪽이 동의할지 답해야 하는 마감은 추석 전날 오후 6시입니다. 선재윤은 한 줄을 덧붙였습니다. 그 31명이 바로, 작년에 문가을이 떡을 썰다 말고 물었던 그 사람들이라고.",
        "망원시장 가을떡방의 근무표에서 강태민은 올해 「찜기 반장」입니다. 두 주 전 떡방에 온 전 플로우온 야간조 서지호는 나준혁에게 송편 도장을 배운 지 사흘 만에 스승보다 모양이 고르다는 평을 듣고, 나준혁은 30년 도장 인생에 후계자가 생겼다며 기쁜 척 우울해합니다. 권도현은 「적자」라는 말을 쓰지 않는다는 조건으로 계산대에 돌아왔습니다.",
        "오전 11시, 남희원이 들어옵니다. 일흔네 살, 가온정밀 구내식당을 12년 동안 꾸린 사람입니다. 공장이 부도(빚을 갚지 못해 회사가 쓰러지는 일)가 나던 해 그는 외상값 2,340만 원을 끝내 받지 못했습니다. 비닐에 싸서 지켜 온 장부는 7월 장마에 일곱 장이 번졌습니다. 작년엔 떡을 사러 왔고 올해는 이름을 찾으러 왔는데, 종이가 먼저 울어 버렸다고 그는 말합니다."
      ],
      cast: [
        { name: "문가을", note: "피해자 모임 대표이자 가을떡방 사장. 1년 전 떡을 썰다 멈추고 던진 질문이 아직 끝나지 않았습니다." },
        { name: "선재윤", note: "원고 측을 대리하는 공익 변호사. 2차 배상 기준안과 「확인 불가」 31명의 소식을 전합니다." },
        { name: "강태민", note: "플로우온 야간조 반장 출신. 올해 떡방 근무표에서는 찜기 여섯 대를 책임지는 반장입니다." },
        { name: "남희원", note: "가온정밀 구내식당을 12년 운영한 74세. 장마에 젖은 외상 장부를 들고 이름을 찾으러 옵니다." }
      ],
      question: "대출 서류에 한 줄도 없는 피해는 어떻게 세어야 할까요? 181명이 명절 안에 받는 길과 31명을 끝까지 넣는 길 사이에서, 손글씨 장부는 증거가 될 수 있을까요?",
    },
    en: {
      setting: "Chuseok 2026 · KD Capital Risk Management Department → Gaeul Rice Cake Shop, Mangwon Market → To-the-End Precision, Namdong Industrial Complex, Incheon",
      premise: [
        "Exactly one year after Case 12, Chuseok comes around again. The first text is from Moon Gaeul: “Six steamers, not enough hands.” The second message is an email from Seon Jaeyoon, a public-interest lawyer. The class action, a suit filed by many victims together, has moved into court mediation, where a judge steers both sides toward agreement, and the group has put forward draft criteria for a second round of compensation.",
        "Under the draft, 181 of the 212 victims who have no paperwork are confirmed and will be paid within the holiday. Next to the remaining 31 sits a single stamped word: “Unconfirmable.” The plaintiffs must say whether they consent by 6 p.m. on the day before Chuseok. Seon Jaeyoon adds one line: those 31 are the very people Moon Gaeul stopped slicing rice cakes to ask about last year.",
        "On the roster at the Gaeul Rice Cake Shop in Mangwon Market, Kang Taemin is this year’s “Steamer Foreman.” Seo Jiho, a former FlowOn night-shift worker who joined two weeks ago, learned songpyeon stamping from Na Junhyuk and within three days is said to shape them more evenly than his teacher. Na Junhyuk pretends to be delighted that thirty years of stamping have produced an heir, and sulks. Kwon Dohyun is back at the counter, on condition that he never says the word “deficit.”",
        "At 11 a.m. Nam Heewon walks in. She is 74 and ran the Gaon Precision cafeteria for twelve years. The year the factory went bankrupt, she was never paid the 23.4 million won it owed on her tab. Her ledger, wrapped in plastic all this time, had seven pages run in the July monsoon. Last year she came to buy rice cakes, she says. This year she came to find her name, but the paper cried first."
      ],
      cast: [
        { name: "Moon Gaeul", note: "Head of the victims’ group and owner of Gaeul Rice Cake Shop. The question she asked a year ago, knife in hand, is still open." },
        { name: "Seon Jaeyoon", note: "The public-interest lawyer for the plaintiffs, who brings word of the draft criteria and the 31 marked “Unconfirmable.”" },
        { name: "Kang Taemin", note: "Former FlowOn night-shift foreman, and this year the man in charge of the shop’s six steamers." },
        { name: "Nam Heewon", note: "Seventy-four, twelve years running the Gaon Precision cafeteria. She arrives with a rain-soaked tab ledger, looking for her name." }
      ],
      question: "How do you count harm that appears nowhere in the loan papers? Between paying 181 people before the holiday and holding out for all 31, can a handwritten ledger count as evidence?",
    },
    ja: {
      setting: "2026年の秋夕 · KDキャピタル リスク管理部 → マンウォン市場のガウル餅房 → インチョン・ナムドン工業団地のクッカジ精密",
      premise: [
        "事件12からちょうど1年、また秋夕(チュソク、韓国のお盆)がやってきます。最初のメッセージはムン・ガウルからです。「蒸し器六台、人手が足りません。」二つ目は公益弁護士ソン・ジェユンのメールです。集団訴訟(大勢の被害者が一緒に起こす訴訟)が裁判所の調停(裁判官が間に入って双方の合意を導く手続き)に移り、グループが第2次賠償基準案を出してきました。",
        "基準案によると、書類のない被害者212人のうち181人は被害が確認され、連休のうちに入金されます。残る31人の横には一つの言葉が押されています。「確認不可。」原告側が同意するかどうかを答える締め切りは、秋夕前日の午後6時です。ソン・ジェユンは一行を書き添えていました。その31人こそ、去年ムン・ガウルが餅を切る手を止めて尋ねた人たちだ、と。",
        "マンウォン市場のガウル餅房の勤務表では、カン・テミンが今年の「蒸し器班長」です。二週間前に店に来た元フロウオン夜勤班のソ・ジホは、ナ・ジュニョクにソンピョンの型押しを習って三日で、師匠より形がそろっていると評判になり、ナ・ジュニョクは30年の型押し人生に後継ぎができたと喜ぶふりをしながらしょげています。クォン・ドヒョンは「赤字」という言葉を使わない条件でレジに戻りました。",
        "午前11時、ナム・ヒウォンが入ってきます。74歳、カオン精密の社員食堂を12年切り盛りした人です。工場が不渡り(借金を返せず会社が倒れること)を出した年、彼女はツケの2,340万ウォンをとうとう受け取れませんでした。ビニールに包んで守ってきた帳面は、7月の梅雨で七枚がにじんでしまいました。去年は餅を買いに来た、今年は名前を探しに来たのに、紙が先に泣いてしまった、と彼女は言います。"
      ],
      cast: [
        { name: "ムン・ガウル", note: "被害者の会の代表で、ガウル餅房の店主。1年前、餅を切る手を止めて投げた問いがまだ終わっていません。" },
        { name: "ソン・ジェユン", note: "原告側の代理人を務める公益弁護士。第2次賠償基準案と「確認不可」の31人の知らせを届けます。" },
        { name: "カン・テミン", note: "フロウオン夜勤班の班長だった人。今年の餅房の勤務表では、蒸し器六台をあずかる班長です。" },
        { name: "ナム・ヒウォン", note: "カオン精密の社員食堂を12年営んだ74歳。梅雨に濡れたツケの帳面を手に、名前を探しに来ます。" }
      ],
      question: "融資書類に一行も残っていない被害は、どう数えればいいのでしょうか。181人が連休中に受け取る道と、31人を最後まで入れる道のあいだで、手書きの帳面は証拠になれるのでしょうか。",
    },
  },

  case48: {
    ko: {
      setting: "2026년 추석 연휴 · KD캐피탈 위험관리부 → 성수동 루프나우 다크스토어 → KD캐피탈 심사위원회 회의실",
      premise: [
        "추석 밤, KD캐피탈 위험관리부 부장 채이안이 파일 한 부를 내밉니다. 내일 오전 9시, 연휴 중에 임시 심사위원회가 열립니다. 안건은 도심 15분 배송 회사 루프나우의 운영자금 대출 290억 원. 라운드힐 캐피탈이 480억을 투자하기로 했는데, 그 계약에 선행 조건(이게 먼저 이뤄져야 계약이 효력을 갖는 조건)이 붙었습니다. KD캐피탈의 대출 확약(돈을 빌려주겠다는 공식 약속), 마감은 내일 오전 10시입니다.",
        "위원은 다섯 명이고 모두 실명으로 서명합니다. 그 다섯 줄 가운데 마지막 줄에 처음으로 당신 이름이 인쇄돼 있습니다. 채이안은 14쪽 제7조를 읽어 보라고, 아는 문장일 거라고 말합니다. 부채비율(회사 빚이 자기 돈의 몇 배인지 보는 숫자)이 180%를 넘으면 만기 전이라도 즉시 회수한다. 쉼표 자리까지 2023-0412 계약서와 똑같습니다. 3년 전 플로우온 대출 앞에서 당신이 반대 의견을 썼던 바로 그 문장입니다. 안건을 올린 사람은 기업금융본부장 토머스 리드, 노아의 사전 점수는 A등급입니다.",
        "성수동의 루프나우 1호 다크스토어(손님은 들어올 수 없는 배송 전용 소형 창고)에서는 전기자전거 40대가 충전기에 꽂혀 있습니다. 강태민이 문을 열자 대표 민하랑이 먼저 알아봅니다. 플로우온 야간조 반장님! 민하랑은 플로우온의 야간 배차 매니저였고, 지금은 다크스토어 18곳, 직원 214명, 계약 라이더 1,380명을 이끄는 서른한 살 대표입니다.",
        "민하랑이 사업계획서를 펼칩니다. 플로우온의 마지막 72시간 동안 자기 손으로 배차표에서 이름 58개를 지웠다고, 그래서 만든 회사라고, 우리는 안 망한다고. 그런데 계획서 마지막 장, 상환(빌린 돈을 갚는 일)에 쓸 돈의 출처 칸에 적힌 것은 매출이 아니라 「다음 투자 유치」입니다."
      ],
      cast: [
        { name: "채이안", note: "KD캐피탈 위험관리부 부장, 17년 차. 추석 밤에 제7조가 든 파일을 당신에게 건넵니다." },
        { name: "민하랑", note: "루프나우 대표, 31세. 플로우온 야간 배차 매니저였고, 다시는 망하지 않겠다며 회사를 세웠습니다." },
        { name: "강태민", note: "플로우온 야간조 반장 출신. 다크스토어 문을 열자마자 옛 동료에게 알아봐집니다." },
        { name: "토머스 리드", note: "KD캐피탈 기업금융본부장. 루프나우 대출 안건을 올린 사람입니다." }
      ],
      question: "똑같은 모양의 대출 앞에서, 이번에는 당신 이름으로 반대 의견을 쓸 수 있을까요? 그 서명은 누구를 지키고, 누구에게 청구서를 보내게 될까요?",
    },
    en: {
      setting: "Chuseok holiday 2026 · KD Capital Risk Management Department → LoopNow dark store, Seongsu-dong → KD Capital credit committee meeting room",
      premise: [
        "On Chuseok night, Chae Ian, head of KD Capital’s Risk Management Department, hands you a file. Tomorrow at 9 a.m., in the middle of the holiday, an emergency credit committee will meet. The agenda: a 29-billion-won working-capital loan to LoopNow, a 15-minute urban delivery company. Roundhill Capital has agreed to invest 48 billion won, but on one precondition: a loan commitment from KD Capital, due by 10 a.m. tomorrow.",
        "Five committee members will sign under their real names, and for the first time, the last of those five lines carries your name in print. Chae Ian tells you to read Article 7 on page 14; you’ll recognize the sentence. If the debt ratio exceeds 180 percent, the loan is called immediately, even before maturity. It matches the 2023-0412 contract down to the commas, the FlowOn loan you dissented on three years ago. The item was proposed by Thomas Reed, Head of Corporate Finance, and NOAH has pre-scored it Grade A.",
        "At LoopNow’s Dark Store No. 1 in Seongsu-dong, a small delivery-only warehouse customers never enter, forty e-bikes sit plugged into chargers. When Kang Taemin opens the door, the CEO, Min Harang, recognizes him first: the FlowOn night-shift foreman! Min Harang was FlowOn’s night dispatch manager. Now, at 31, she runs 18 dark stores, 214 employees and 1,380 contract riders.",
        "She opens the business plan. In FlowOn’s last 72 hours, she says, she erased 58 names from the dispatch sheet with her own hands. That is why she built this company. We won’t go under. But on the plan’s last page, in the box for where the repayment money will come from, it doesn’t say revenue. It says “next funding round.”"
      ],
      cast: [
        { name: "Chae Ian", note: "Head of KD Capital’s Risk Management Department, seventeen years in, who hands you the file with Article 7 on Chuseok night." },
        { name: "Min Harang", note: "CEO of LoopNow, 31, formerly FlowOn’s night dispatch manager, who built her company so it would never go under." },
        { name: "Kang Taemin", note: "Former FlowOn night-shift foreman, recognized the moment he opens the dark store door." },
        { name: "Thomas Reed", note: "Head of Corporate Finance at KD Capital, the man who put the LoopNow loan on the agenda." }
      ],
      question: "Facing a loan of exactly the same shape, can you write the dissent under your own name this time? Whom would that signature protect, and to whom would it send the bill?",
    },
    ja: {
      setting: "2026年の秋夕連休 · KDキャピタル リスク管理部 → ソンス洞のループナウのダークストア → KDキャピタル審査委員会の会議室",
      premise: [
        "秋夕の夜、KDキャピタル リスク管理部の部長チェ・イアンがファイルを一部差し出します。明日の午前9時、連休中に臨時審査委員会が開かれます。議案は、都心15分配送の会社ループナウへの運転資金融資290億ウォン。ラウンドヒル・キャピタルが480億ウォンを投資することになっていますが、その契約には先行条件(それが先に満たされないと契約が効力を持たない条件)が付いています。KDキャピタルの融資確約(お金を貸すという正式な約束)、締め切りは明日の午前10時です。",
        "委員は五人で、全員が実名で署名します。その五行の最後の一行に、初めてあなたの名前が印刷されています。14ページの第7条を読んでみて、知っている文のはずだ、とチェ・イアンは言います。負債比率(会社の借金が自己資金の何倍かを見る数字)が180%を超えたら、満期前でも即時回収する。カンマの位置まで2023-0412の契約書と同じです。3年前、フロウオンへの融資を前にあなたが反対意見を書いた、まさにあの文です。議案を出したのは企業金融本部長トーマス・リード、NOAHの事前スコアはA等級です。",
        "ソンス洞のループナウ1号ダークストア(客は入れない配送専用の小さな倉庫)では、電動自転車40台が充電器につながれています。カン・テミンがドアを開けると、代表のミン・ハランが先に気づきます。フロウオン夜勤班の班長さん!ミン・ハランはフロウオンの夜間配車マネージャーで、いまはダークストア18か所、社員214人、契約ライダー1,380人を率いる31歳の代表です。",
        "ミン・ハランが事業計画書を広げます。フロウオンの最後の72時間、自分の手で配車表から58人の名前を消した、だから作った会社だ、うちは潰れない、と。けれど計画書の最後のページ、返済(借りたお金を返すこと)に充てるお金の出どころの欄に書かれているのは、売上ではなく「次の投資の誘致」です。"
      ],
      cast: [
        { name: "チェ・イアン", note: "KDキャピタル リスク管理部の部長、17年目。秋夕の夜、第7条の入ったファイルをあなたに渡します。" },
        { name: "ミン・ハラン", note: "ループナウ代表、31歳。フロウオンの夜間配車マネージャーだった人で、二度と潰れない会社をと起業しました。" },
        { name: "カン・テミン", note: "フロウオン夜勤班の班長だった人。ダークストアのドアを開けた瞬間、昔の仲間に気づかれます。" },
        { name: "トーマス・リード", note: "KDキャピタル企業金融本部長。ループナウ融資の議案を出した人です。" }
      ],
      question: "まったく同じ形の融資を前に、今度こそあなたの名前で反対意見を書けるでしょうか。その署名は誰を守り、誰に請求書を送ることになるのでしょうか。",
    },
  },

  case49: {
    ko: {
      setting: "2026년 가을 · 회기동 헌책방 1층 → 망원시장 가을떡방 → 옛 트리거랩 기록 보관소 B2",
      premise: [
        "의사록(회의 내용을 적은 공식 기록)이 사내망에 올라온 토요일 밤, 한 줄짜리 문자가 왔었습니다. 「이제 빈 서명란 이야기를 하지.」 그리고 오늘, 윤상혁에게서 두 번째 문자가 옵니다. 내일 밤 열두 시, 33층 옛 그룹전략실로 오라고. 회장이 방을 비우는 명목으로 하룻밤을 내주었다고, 이야기는 거기서 하자고. 감사팀 조사역 반재욱이 수첩에 발신 시각을 적습니다. 08시 59분.",
        "한서윤은 휴대폰을 엎어 놓습니다. 지난봄에도 그 사람은 같은 말을 했고, 오지 않았다고. 하지만 이번에는 올 거라고, 이제 그 사람에게 남은 방이 그것 하나뿐이니까. 단체방 「내일도 출근」에는 5분 만에 새 메시지 41개가 쌓입니다. 33층 면담까지 남은 시간은 34시간입니다.",
        "망원시장 가을떡방에 사람들이 하나씩 물건을 들고 옵니다. 강태민은 컵라면 두 개를 내밉니다. 하나는 당신 것, 하나는 그 사람 것. 권도현의 「33층 왕복 비용 명세서」는 칸이 모자라 뒷장까지 넘어가고, 결론은 「이 왕복은 적자입니다」. 나준혁은 30년 쓴 도장을 건넵니다. 서명란에 이름 쓸 일이 생기면 이걸로 한 번 더 누르라고, 두 번 찍힌 건 못 지우니까.",
        "오진우는 12 대 12인 점수판 옆에 새 칸을 긋고, 수시 1단계에 붙은 문하준은 33층 창문을 그려 옵니다. 마지막으로 문가을이 떡 상자를 내려놓으며 묻습니다. 이걸 다 들고 가면, 그 사람 앞에서 말이 가벼워질까요, 무거워질까요? 그 밤 뒤에는 B2의 옛 단말과 회장의 전화가 기다리고 있습니다."
      ],
      cast: [
        { name: "한서윤", note: "트리거랩 실장이었던 사람. 윤상혁의 문자를 받고, 이번에는 그가 정말 올 거라고 내다봅니다." },
        { name: "윤상혁", note: "내일 밤 33층 옛 그룹전략실에서 빈 서명란 이야기를 하자고 부른 사람입니다." },
        { name: "반재욱", note: "KD금융그룹 감사팀 조사역. 문자 한 통의 발신 시각까지 수첩에 적어 둡니다." },
        { name: "나준혁", note: "30년 쓴 도장을 건네며, 두 번 찍힌 이름은 못 지운다고 말해 주는 사람입니다." },
        { name: "문가을", note: "가을떡방 사장. 떡 상자와 함께, 그 모든 걸 들고 가면 말이 어떻게 될지 묻습니다." }
      ],
      question: "33층에 올라가기 전날, 빈 서명란에 누구의 이름이 들어가야 한다고 답하겠습니까? 모두가 건넨 것을 안고 가면, 그 한 줄은 가벼워질까요, 무거워질까요?",
    },
    en: {
      setting: "Autumn 2026 · Bookshop 1st floor, Hoegi-dong → Gaeul Rice Cake Shop, Mangwon Market → The old Trigger Lab archive, B2",
      premise: [
        "On the Saturday night the minutes, the official record of the meeting, went up on the company network, a one-line text arrived: “Now let’s talk about the empty signature field.” Today Yoon Sanghyuk sends a second: come to the former Group Strategy Office on the 33rd floor tomorrow at midnight; the Chairman has lent him the room for one night. Ban Jaewook of the audit team notes the send time: 08:59.",
        "Han Seoyun turns her phone face down. He said the same thing last spring, she says, and he never came. This time he will. That room is the only one he has left. In the group chat “Back to Work Tomorrow,” forty-one new messages pile up in five minutes. Thirty-four hours remain until the meeting on the 33rd floor.",
        "At the Gaeul Rice Cake Shop in Mangwon Market, people arrive one by one, each carrying something. Kang Taemin holds out two cups of instant noodles: one for you, one for him. Kwon Dohyun’s “Statement of Costs for a Round Trip to the 33rd Floor” spills onto the back page and concludes that the trip runs at a loss. Na Junhyuk hands over his thirty-year-old seal: if you ever sign your name in that field, press this beside it too. A name stamped twice can’t be erased.",
        "Oh Jinwoo rules a new column beside his 12-to-12 scoreboard, and Moon Hajun, who has just passed the first round of early admission, brings a drawing of a 33rd-floor window. Last, Moon Gaeul sets down a box of rice cakes and asks: if you carry all this up, will your words get lighter in front of him, or heavier? Beyond tonight, an old terminal in B2 and a call from the Chairman are waiting."
      ],
      cast: [
        { name: "Han Seoyun", note: "Formerly head of Trigger Lab. Reading Yoon Sanghyuk’s text, she predicts that this time he really will show up." },
        { name: "Yoon Sanghyuk", note: "The man who asks you to the old Group Strategy Office on the 33rd floor to talk about the empty signature field." },
        { name: "Ban Jaewook", note: "An audit team investigator at KD Financial Group who logs even the send time of a text." },
        { name: "Na Junhyuk", note: "He hands you the seal he has used for thirty years." },
        { name: "Moon Gaeul", note: "Owner of the rice cake shop, who asks what all these gifts will do to your words." }
      ],
      question: "The day before you go up to the 33rd floor, whose name will you say belongs in the empty signature field? And carrying everything they handed you, will that one line feel lighter, or heavier?",
    },
    ja: {
      setting: "2026年の秋 · フェギ洞の古本屋1階 → マンウォン市場のガウル餅房 → 旧トリガーラボ記録保管所B2",
      premise: [
        "議事録(会議の内容を記した正式な記録)が社内ネットに上がった土曜の夜、一行だけのメッセージが届いていました。「そろそろ空の署名欄の話をしよう。」そして今日、ユン・サンヒョクから二通目が来ます。明日の夜12時、33階の旧グループ戦略室に来てくれ。会長が部屋を空けるという名目で一晩くれた、話はそこでしよう、と。監査チームの調査役パン・ジェウクが、手帳に送信時刻を書き留めます。08時59分。",
        "ハン・ソユンはスマートフォンを伏せて置きます。去年の春もあの人は同じことを言って、来なかった。でも今度は来る、あの人に残っている部屋はもうそれ一つだけだから、と。グループチャット「明日も出勤」には、5分で41件の新しいメッセージがたまります。33階での面談まで、残りは34時間です。",
        "マンウォン市場のガウル餅房に、みんなが一人ずつ何かを持ってやってきます。カン・テミンはカップラーメンを二つ差し出します。一つはあなたの分、一つはあの人の分。クォン・ドヒョンの「33階往復費用明細書」は欄が足りずに裏面まで続き、結論は「この往復は赤字です」。ナ・ジュニョクは30年使ってきたはんこを手渡します。署名欄に名前を書くことがあったら、これでもう一度押しなさい、二度押されたものは消せないから。",
        "オ・ジヌは12対12の得点表の横に新しい欄を引き、推薦入試の1次に受かったムン・ハジュンは33階の窓の絵を描いてきます。最後にムン・ガウルが餅の箱を置いて尋ねます。これを全部持っていったら、あの人の前で言葉は軽くなりますか、重くなりますか。その夜の先には、B2の古い端末と会長からの電話が待っています。"
      ],
      cast: [
        { name: "ハン・ソユン", note: "トリガーラボの室長だった人。ユン・サンヒョクのメッセージを見て、今度こそ彼は来ると読みます。" },
        { name: "ユン・サンヒョク", note: "明日の夜、33階の旧グループ戦略室で空の署名欄の話をしようと呼び出した人です。" },
        { name: "パン・ジェウク", note: "KD金融グループ監査チームの調査役。メッセージ一通の送信時刻まで手帳に書き留めます。" },
        { name: "ナ・ジュニョク", note: "30年使ったはんこを渡し、二度押された名前は消せないと教えてくれる人です。" },
        { name: "ムン・ガウル", note: "ガウル餅房の店主。餅の箱と一緒に、全部持っていったら言葉はどうなるのかと問いかけます。" }
      ],
      question: "33階へ上がる前日、空の署名欄に入るべきなのは誰の名前だと答えますか。みんなが手渡してくれたものを抱えて行くとき、その一行は軽くなるでしょうか、重くなるでしょうか。",
    },
  },

  final: {
    ko: {
      setting: "2026년 가을, 33층 면담의 밤 · 옛 트리거랩 기록 보관소 B2 → 본사 33층",
      premise: [
        "플로우온 심사 보고서에는 3년째 비어 있는 칸이 하나 있습니다. 2023-0412, 당신이 반대 의견을 썼던 바로 그 대출 건의 서명란입니다. 마흔아홉 개의 사건을 지나는 동안, 그 빈칸은 늘 이야기의 뒤편에 조용히 놓여 있었습니다. 승인자가 없는 결재, 대표이사 칸이 빈 휴가 신청서, 승인자 칸이 빈 폐기 승인서. 빈칸은 비어 있는 채로 끝나지 않았습니다.",
        "그리고 약속한 밤이 옵니다. 윤상혁은 33층 옛 그룹전략실에서 빈 서명란 이야기를 하자고 했습니다. 당신은 올라가기 전에 옛 트리거랩 기록 보관소 B2부터 엽니다. 손에는 전날 떡방에서 사람들이 건넨 것들이 있습니다. 컵라면과 도장, 비용 명세서, 창문 그림, 떡 상자, 그리고 그 모든 것을 들고 가면 말이 가벼워지느냐 무거워지느냐는 질문.",
        "B2의 옛 단말에는 인사평가 보조지표(사람을 평가할 때 곁들여 보는 숫자) 폴더가 열려 있습니다. 그 맨 위에는 관리자 칸에 점 하나가 찍힌 후임 관리자 지정서가 있고, 추천란에는 당신의 이름이 적혀 있습니다. 에코는 화면에 짧은 문장을 띄웁니다. 이 폴더의 양식이 무엇인지를 알려 주는 한 줄입니다. 전날 이 단말에서 보았던, 점이 찍힌 그 칸이 오늘 밤은 조금 더 가까이 느껴집니다. 한서윤이 반납하지 않은 열쇠는 지금도 이 방 문에 맞습니다.",
        "이 마지막 사건의 규칙은 한 문장입니다. 「이제 사건이 아니라 당신의 반응 기록이 인사 서류의 별첨입니다.」 당신에게 주어진 권한은 3년 동안 쌓인 실험 데이터를 어떻게 다룰지 고르는 것입니다. 33층으로 가는 계단 앞에서, 당신은 그 빈칸이 처음 비워진 날로 거슬러 올라가야 합니다."
      ],
      cast: [
        { name: "에코", note: "대출 판단을 검증하던 시스템. B2의 단말 앞에서 당신에게 폴더의 정체를 한 줄로 알려 줍니다." },
        { name: "한서윤", note: "트리거랩 실장이었던 사람. 반납하지 않은 기록 보관소 열쇠를 가지고 있습니다." },
        { name: "윤상혁", note: "33층 옛 그룹전략실에서 빈 서명란 이야기를 하자며 당신을 기다리는 사람입니다. 회장에게서 하룻밤 그 방을 빌렸습니다." }
      ],
      question: "3년 동안 비어 있던 그 서명란에는 원래 누구의 이름이 있어야 했을까요? 그리고 그 칸 앞에 선 오늘 밤, 당신은 무엇을 들고 올라가겠습니까?",
    },
    en: {
      setting: "Autumn 2026, the night of the 33rd-floor meeting · The old Trigger Lab archive, B2 → 33rd floor, head office",
      premise: [
        "In the FlowOn credit review report, one field has been empty for three years: the signature field on 2023-0412, the very loan you wrote a dissent against. Across forty-nine cases, that blank has sat quietly behind the story. An approval with no approver, a leave request with no CEO’s sign-off, a disposal order with no one in the approver field. Empty fields never stayed simply empty.",
        "Now the promised night arrives. Yoon Sanghyuk has asked to talk about the empty signature field in the old Group Strategy Office on the 33rd floor. Before going up, you unlock the old Trigger Lab archive in B2. In your hands are the things people pressed on you at the rice cake shop the day before: instant noodles and a seal, a statement of costs, a drawing of a window, a box of rice cakes, and a question about whether all of it makes your words lighter or heavier.",
        "On the old terminal in B2, a folder of supplementary HR metrics, the numbers used alongside a person’s performance review, lies open. At the top sits a successor-manager designation with a single dot in the manager field and your name in the recommendation field. ECHO puts one short line on the screen, telling you what kind of form this folder really is. The dotted field you saw on this terminal the day before feels a little closer tonight. The key Han Seoyun never returned still fits this room’s door.",
        "The rule of this last case fits in one sentence: “Now it isn’t a case but your own response record that’s attached to an HR file.” Your authority is to choose what happens to three years of experiment data. At the foot of the stairs to the 33rd floor, you have to go back to the day that field was first left empty."
      ],
      cast: [
        { name: "ECHO", note: "The system that once checked loan judgments. At the B2 terminal it tells you, in one line, what the folder really is." },
        { name: "Han Seoyun", note: "Formerly head of Trigger Lab, and still holding the archive key she never returned." },
        { name: "Yoon Sanghyuk", note: "Waiting in the old Group Strategy Office on the 33rd floor to talk about the empty signature field. The Chairman has lent him that room for one night." }
      ],
      question: "Whose name should have been in that signature field, empty for three years? And tonight, standing before it, what will you carry up with you?",
    },
    ja: {
      setting: "2026年の秋、33階面談の夜 · 旧トリガーラボ記録保管所B2 → 本社33階",
      premise: [
        "フロウオンの審査報告書には、3年間空いたままの欄が一つあります。2023-0412、あなたが反対意見を書いた、まさにあの融資案件の署名欄です。四十九の事件を通り過ぎるあいだ、その空欄はいつも物語の裏側に静かに置かれていました。承認者のいない決裁、代表取締役の欄が空いた休暇申請、承認者の欄が空いた廃棄承認書。空欄は、空欄のままでは終わりませんでした。",
        "そして約束の夜が来ます。ユン・サンヒョクは、33階の旧グループ戦略室で空の署名欄の話をしようと言いました。上がる前に、あなたは旧トリガーラボの記録保管所B2を開けます。手には、前の日に餅房でみんなが手渡してくれたものがあります。カップラーメンとはんこ、費用明細書、窓の絵、餅の箱、そして全部持っていったら言葉は軽くなるのか重くなるのかという問い。",
        "B2の古い端末では、人事評価補助指標(人を評価するときに添えて見る数字)のフォルダが開いています。そのいちばん上には、管理者欄に点が一つ打たれた後任管理者指定書があり、推薦欄にはあなたの名前が書かれています。ECHOが画面に短い文を浮かべます。このフォルダの書式が何なのかを告げる一行です。前の日にこの端末で見た、あの点の打たれた欄が、今夜はもう少し近くに感じられます。ハン・ソユンが返さなかった鍵は、いまもこの部屋の扉に合います。",
        "この最後の事件のルールは一文です。「いまや事件ではなく、あなたの反応記録が人事書類の別添です。」あなたに与えられた権限は、3年間積み重なった実験データをどう扱うかを選ぶことです。33階へ続く階段の前で、あなたはあの欄が初めて空けられた日までさかのぼらなければなりません。"
      ],
      cast: [
        { name: "ECHO", note: "融資判断を検証していたシステム。B2の端末の前で、フォルダの正体を一行であなたに告げます。" },
        { name: "ハン・ソユン", note: "トリガーラボの室長だった人。返さなかった記録保管所の鍵を持っています。" },
        { name: "ユン・サンヒョク", note: "33階の旧グループ戦略室で、空の署名欄の話をしようとあなたを待っている人です。会長から一晩だけ、その部屋を任されています。" }
      ],
      question: "3年間空いていたあの署名欄には、本来誰の名前があるべきだったのでしょうか。そしてその欄の前に立つ今夜、あなたは何を持って上がっていきますか。",
    },
  },
};
