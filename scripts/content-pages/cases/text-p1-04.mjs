/**
 * Spoiler-free case pages, p1-04: setting, premise, cast and question per case
 * in Korean, English and Japanese, written from the first two scenes of each case
 * (scripts/content-pages/cases.mjs renders them). Nothing past a case's second scene.
 */
export default {
  prologue01: {
    ko: {
      setting: "2022년 가을 · KD은행 본점 6층 기업금융전략팀 → 강서지점 대출 창구",
      premise: [
        "2022년 가을, 당신은 KD은행 본점 기업금융전략팀의 수습 3개월차입니다. 복사기와 창문 사이, 명패도 없는 책상이 당신 자리입니다. 오진우 대리가 수습 마지막 과제라며 심사 파일 하나를 띄워 줍니다. 강서지점이 올린 온새포장의 시설자금(기계나 설비를 사는 데 쓰는 돈) 대출 3억 8,000만 원, 승인은 이번 주 목요일입니다. 「숫자만 맞춰 보면 돼.」 쉬운 일처럼 들립니다.",
        "그런데 요약표의 부채 합계는 11억 4,200만 원인데, 항목을 하나씩 더하면 11억 8,200만 원이 나옵니다. 4,000만 원짜리 한 줄이 빠져 있습니다. 그 줄을 다시 넣으면 부채비율(회사 빚이 자기 돈의 몇 배인지 보는 숫자)이 178.4%에서 184.7%로 오릅니다. 180%를 넘으면 지점이 혼자 승인할 수 없고, 본점이 다시 봐야 합니다. 당신은 그 줄 옆에 연필로 작은 점을 찍습니다.",
        "답을 찾으러 강서지점에 내려갑니다. 4번 창구에서는 젊은 행원이 손님에게 「원금이 보장되는 건 아니고요」라고 말하다가, 잠깐 멈추고 「요즘 다들 하세요」라고 덧붙입니다. 대출 창구에는 온새포장 대표 정해린이 앉아 있습니다. 빠진 줄을 묻자 대답에 망설임이 없습니다. 7월에 새봄신협에서 빌린 돈, 직원 11명의 월급을 주려고 빌린 돈입니다. 원장(거래를 하나하나 적어 둔 원래 장부)에는 상환 일정까지 그대로 적혀 있고, 세무사가 만든 요약표에만 그 칸이 없었습니다.",
        "누가 숨긴 것도 아닌데 숫자는 비어 있습니다. 납품은 11월 1일에 시작합니다. 당신이 찾아낸 한 줄은 이제 누군가의 이름을 달고 어딘가에 올라가야 합니다. 사수의 이름일 수도, 당신의 이름일 수도, 아무 이름도 아닐 수도 있습니다. 한 달 뒤 제7조라는 이름으로 다시 만나게 될 숫자를, 당신은 여기서 처음 봅니다.",
      ],
      cast: [
        { name: "오진우", note: "기업금융전략팀 대리이자 당신의 사수. 수습 마지막 과제를 건네며, 무엇보다 속도를 중요하게 여깁니다." },
        { name: "정해린", note: "직원 11명의 온새포장을 꾸리는 대표. 질문을 받으면 대답하기 전에 장부의 해당 달부터 손가락으로 짚습니다." },
      ],
      question: "누가 찾았는지 적히지 않은 오차도 기록이 될 수 있을까요? 4,000만 원의 빈 줄을, 당신은 누구의 이름으로, 혹은 이름 없이 넘기겠습니까?",
    },
    en: {
      setting: "Fall 2022 · KD Bank head office, Corporate Finance Strategy Team, 6th floor → Gangseo Branch loan desk",
      premise: [
        "It is the fall of 2022, and you are three months into your traineeship on KD Bank’s Corporate Finance Strategy Team. Your desk sits between the copier and the window, and it has no nameplate yet. Assistant Manager Oh Jinwoo pulls up a review file and calls it your last trainee task: a 380-million-won facility loan for Onsae Packaging, filed by Gangseo Branch, due for approval on Thursday. “Just make sure the numbers add up.” It sounds easy.",
        "It isn’t. The summary sheet lists total debt of 1.142 billion won, but the items add up to 1.182 billion. One 40-million-won line is missing. Put it back and the debt-to-equity ratio climbs from 178.4% to 184.7%, past the 180% line below which a branch may approve a loan on its own. Above that line, head office has to look again. You put a small pencil dot beside the gap.",
        "You go down to Gangseo Branch for an answer. At Window 4, a young teller tells a customer the principal isn’t guaranteed, pauses, and adds that everyone is doing it these days. At the loan desk sits Jung Haerin, head of Onsae Packaging. Asked about the missing line, Jung answers without hesitation: a loan from Saebom Credit Union in July, taken out to pay eleven employees. The general ledger shows it plainly, repayment schedule and all. Only the summary sheet the tax accountant prepared had no box for it.",
        "Nobody hid anything, and yet the number is gone. Deliveries start on November 1. The line you found now has to go up somewhere under someone’s name: your mentor’s, your own, or no one’s at all. This is where you first meet the number that, a month from now, becomes Article 7.",
      ],
      cast: [
        { name: "Oh Jinwoo", note: "Assistant manager on the Corporate Finance Strategy Team and your mentor. He hands you the file and values speed above almost everything." },
        { name: "Jung Haerin", note: "Head of Onsae Packaging, a company of eleven people. Before answering any question, Jung puts a finger on the right month in the ledger." },
      ],
      question: "Does an error count as a record if nobody’s name is on it? Whose name, if any, goes on the 40-million-won line you found?",
    },
    ja: {
      setting: "2022年秋 · KD銀行本店6階 企業金融戦略チーム → カンソ支店 融資窓口",
      premise: [
        "2022年の秋、あなたはKD銀行本店・企業金融戦略チームの見習い3か月目です。コピー機と窓のあいだにある、名札のない机があなたの席です。オ・ジヌ代理が「見習い最後の課題だ」と言って、審査ファイルを一つ開いてくれます。カンソ支店が上げてきたオンセ包装の設備資金(機械や設備を買うためのお金)融資3億8,000万ウォンで、承認は今週の木曜日です。「数字を合わせるだけでいい」。簡単な仕事に聞こえます。",
        "ところが要約表の負債合計は11億4,200万ウォンなのに、項目を一つずつ足すと11億8,200万ウォンになります。4,000万ウォンの一行が抜けているのです。その行を戻すと、負債比率(会社の借金が自己資本の何倍かを見る数字)は178.4%から184.7%に上がります。180%を超えると支店だけでは承認できず、本店があらためて見ることになります。あなたはその行の横に、鉛筆で小さな点を打ちます。",
        "答えを探しにカンソ支店へ向かいます。4番窓口では若い行員が客に「元本が保証されるわけではないんですが」と説明し、少し間を置いて「でも最近はみなさんやってますよ」と付け加えます。融資窓口には、オンセ包装の代表チョン・ヘリンが座っています。抜けた一行について尋ねると、答えはすぐに返ってきます。7月にセボム信協から借りたお金、従業員11人の給料を払うためのお金です。会計元帳(取引をひとつひとつ記録した元の帳簿)には返済の日程までそのまま載っていて、税理士が作った要約表にだけ、その欄がなかったのです。",
        "誰も隠していないのに、数字は空いています。納品は11月1日に始まります。あなたが見つけた一行は、これから誰かの名前を付けてどこかへ上がらなければなりません。指導役の名前か、あなたの名前か、それとも誰の名前でもないのか。一か月後に第7条として再び出会う数字に、あなたはここで初めて触れます。",
      ],
      cast: [
        { name: "オ・ジヌ", note: "企業金融戦略チームの代理で、あなたの指導役です。最後の課題を渡し、何よりも速さを大切にしています。" },
        { name: "チョン・ヘリン", note: "従業員11人のオンセ包装を率いる代表です。質問されると、答える前に帳簿の該当する月を指で押さえます。" },
      ],
      question: "見つけた人の名前が書かれない誤差は、記録になるのでしょうか。4,000万ウォンの抜けた一行を、あなたは誰の名前で、あるいは名前なしで渡しますか。",
    },
  },

  prologue02: {
    ko: {
      setting: "2023년 4월 · KD은행 본점 6층 수습 책상 → 기업금융전략팀 심사실 → 플로우온 본사·김포 물류 현장",
      premise: [
        "2023년 4월, 당신 앞에 대출번호 2023-0412가 올라옵니다. 돈을 빌리려는 회사는 새벽 배송 물류 플랫폼 플로우온, 금액은 운영자금 310억 원입니다. 보고된 부채비율(회사 빚이 자기 돈의 몇 배인지 보는 숫자)은 179.6%. 은행이 정한 기준선 180%보다 겨우 0.4%포인트 낮습니다.",
        "윤상혁 팀장이 당신 모니터 위에 손바닥을 얹습니다. 그룹 전략 과제라고, 실사(현장에 직접 가서 확인하는 일)는 당신이 나가고 의견서는 다음 주 화요일 18시까지 내라고 합니다. 축하에 가까운 얼굴로 「자네 첫 단독 건」이라 부르며, 이런 회사는 10년에 한 번 나온다고 덧붙입니다. 심사위원회는 4월 27일입니다.",
        "당신은 플로우온 본사와 김포 제2풀필먼트센터(주문받은 물건을 보관하고 포장해 내보내는 물류 창고)로 첫 실사를 나갑니다. 안내는 창업주 권태호가 직접 맡습니다. 트럭 두 대로 시작해 여덟 해 만에 직원 1,140명, 하루 21만 상자를 움직이는 회사가 됐습니다. 그는 숫자보다 3번 라인을 먼저 보라고 합니다. 저기서 일하는 사람들이 곧 회사라고요. 179.6%가 적힌 자료를 펼치는 손에는 망설임이 없고, 오후 여섯 시가 되자 야간조 380명이 교대하러 들어옵니다.",
        "보이는 것은 모두 진짜입니다. 문제는 보이지 않는 곳에 있습니다. 매출을 장부에 올리는 시점이 4주 당겨져 있었고, 그걸 되돌리면 실제 부채비율은 184.2%입니다. 게다가 빚이 기준선을 넘으면 대출을 즉시 거둬들일 수 있게 한 제7조를 써 넣은 곳은 다름 아닌 당신의 팀입니다. 반대 의견서를 혼자 쓸지, 함께 쓸지, 누그러뜨려 쓸지는 이제 당신이 정합니다.",
      ],
      cast: [
        { name: "윤상혁", note: "기업금융전략팀장. 이 대출을 그룹 전략 과제라 부르며, 당신에게 첫 단독 건을 맡깁니다." },
        { name: "권태호", note: "플로우온 창업주. 장부보다 현장을 먼저 보여 주는 사람이고, 그가 보여 주는 현장은 꾸민 것이 아닙니다." },
      ],
      question: "0.4%포인트는 계산의 문제일까요, 누가 그 선을 그었느냐의 문제일까요? 기준선 바로 아래의 숫자 앞에서, 당신은 어떤 이름으로 반대를 적겠습니까?",
    },
    en: {
      setting: "April 2023 · KD Bank head office, 6th-floor trainee desk → Corporate Finance Strategy Team review room → FlowOn headquarters and Gimpo logistics site",
      premise: [
        "April 2023. Loan number 2023-0412 lands in front of you. The borrower is FlowOn, a dawn-delivery logistics platform, asking for 31 billion won in working capital. The reported debt-to-equity ratio is 179.6%, just 0.4 percentage points under the bank’s 180% line.",
        "Team Head Yoon Sanghyuk rests his palm on top of your monitor. It is a group strategy project, he says; you will handle the due diligence, and the written opinion is due next Tuesday at 6 p.m. He looks almost as if he is congratulating you. Your first solo file, he calls it, and a company like this comes along once in ten years. The credit committee meets on April 27.",
        "You head out to FlowOn’s headquarters and Gimpo Fulfillment Center 2 for your first due diligence. The founder, Kwon Taeho, gives the tour himself. The company he started with two trucks has grown in eight years to 1,140 employees moving 210,000 boxes a day. Bankers always look at the numbers first, he says, but he wants you to start with Line 3, because those people are the company. His finger doesn’t hesitate as he spreads out the papers showing 179.6%. At six in the evening, 380 night-shift workers come in for the changeover.",
        "Everything you are shown is real. The trouble is in what you are not shown. Revenue has been booked four weeks early, and undone, the real ratio is 184.2%. And Article 7, the clause that lets the bank call the loan the moment debt crosses the line, was written in by your own team. Whether you write your dissent alone, with others, or softened is now up to you.",
      ],
      cast: [
        { name: "Yoon Sanghyuk", note: "Head of the Corporate Finance Strategy Team. He calls this loan a group strategy project and hands you your first solo file." },
        { name: "Kwon Taeho", note: "FlowOn’s founder. He shows you the floor before the books, and nothing he shows you is staged." },
      ],
      question: "Is 0.4 percentage points a matter of arithmetic, or a matter of who drew the line? Facing a number just under the threshold, whose name goes on your dissent?",
    },
    ja: {
      setting: "2023年4月 · KD銀行本店6階の見習い席 → 企業金融戦略チーム審査室 → フロウオン本社・キンポ物流現場",
      premise: [
        "2023年4月、あなたの前に融資番号2023-0412が上がってきます。借り手は早朝配送の物流プラットフォーム、フロウオン。金額は運転資金310億ウォンです。報告された負債比率(会社の借金が自己資本の何倍かを見る数字)は179.6%。銀行が決めた基準線180%より、わずか0.4ポイント低い数字です。",
        "ユン・サンヒョクチーム長が、あなたのモニターの上に手のひらを載せます。これはグループの戦略課題で、デューデリジェンス(現場へ直接行って確かめること)は君が出て、意見書は来週火曜の18時までだ、と。祝福に近い顔で「君の初の単独案件だ」と言い、こういう会社は10年に一度しか出ないと付け加えます。審査委員会は4月27日です。",
        "あなたはフロウオン本社とキンポ第2フルフィルメントセンター(注文を受けた品物を保管し、梱包して出荷する物流倉庫)へ、初めてのデューデリジェンスに出ます。案内は創業者のクォン・テホが自ら務めます。トラック2台で始めた会社が、8年で従業員1,140人、一日21万箱を動かす会社になりました。彼は数字より先に3番ラインを見てほしいと言います。あそこで働く人たちがうちの会社なのだ、と。179.6%と書かれた資料を広げる指に迷いはなく、午後6時には夜間班の380人が交代に入ってきます。",
        "見せられるものは、どれも本物です。問題は見えないところにあります。売上を帳簿に載せる時期が4週間前倒しされていて、それを戻すと実際の負債比率は184.2%になります。しかも、借金が基準線を超えれば融資を即時に引き揚げられる第7条を書き込んだのは、ほかでもないあなたのチームです。反対意見書をひとりで書くか、連名で書くか、和らげて書くか。決めるのはあなたです。提出期限まで、残された時間は長くありません。",
      ],
      cast: [
        { name: "ユン・サンヒョク", note: "企業金融戦略チーム長です。この融資をグループの戦略課題と呼び、あなたに初の単独案件を任せます。" },
        { name: "クォン・テホ", note: "フロウオンの創業者です。帳簿より先に現場を見せる人で、彼が見せる現場は作りものではありません。" },
      ],
      question: "0.4ポイントは計算の問題でしょうか、それとも誰がその線を引いたかの問題でしょうか。基準線のすぐ下の数字を前に、あなたは誰の名前で反対を書きますか。",
    },
  },

  prologue03: {
    ko: {
      setting: "2023년 4월 · 본점 6층 심사실 → 8층 대출심사위원회 회의실 → 복도 → 지하 1층 문서 스캔실",
      premise: [
        "새벽 다섯 시, 대출심사위원회 안건 목록이 사내망에 올라옵니다. 네 번째 안건이 2023-0412, 플로우온 310억 원 대출입니다. 당신이 쓴 11쪽짜리 반대 의견서는 본문이 아니라 「첨부 7」로 붙어 있습니다. 하필 당신이 문제 삼은 조항도 제7조입니다. 기준선은 180%, 보고된 숫자는 179.6%입니다.",
        "오진우 대리가 종이컵을 내려놓으며 현실을 짚어 줍니다. 첨부 서류는 위원장이 요청해야 읽힌다고, 오늘 안건은 열한 개인데 회의는 한 시간뿐이라고요. 한 건에 몇 분이 남는지 계산해 봤느냐는 물음에, 당신은 마땅히 할 대답이 없습니다.",
        "개회 28분 전, 한서윤 과장이 당신의 반대 의견서를 팀 검토 단계에서 반려합니다. 오후 2시, 본점 8층 회의실. 위원장 진세라 부행장이 안건 4번을 부르고, 한서윤이 14줄을 읽습니다. 제7조를 달아 조건부 승인(조건을 달아서 내주는 승인)으로 올리자는 제안입니다. 진세라가 첨부 7을 언급하자 한서윤은 팀 검토 단계에서 반려했다고 답하고, 진세라는 「반려된 부속 의견은 안건이 아닙니다. 다음.」이라며 화면을 넘깁니다. 안건 4번에 걸린 시간은 4분 12초입니다.",
        "아무도 목소리를 높이지 않았고, 아무도 당신을 보지 않았습니다. 안건 열한 개가 47분 만에 처리됩니다. 회의가 끝난 복도에서 한서윤은 12년 전 자기가 썼던 의견서 이야기를 꺼냅니다. 재심을 걸지, 사본을 남길지, 지켜 주겠다는 상사의 말을 믿을지. 문은 아주 조용히 닫히고 있습니다.",
      ],
      cast: [
        { name: "오진우", note: "같은 팀 대리. 회의 시간을 분 단위로 계산하며, 늦는 쪽이 지는 쪽이라고 믿습니다." },
        { name: "한서윤", note: "기업금융전략팀 과장이자 당신의 상사. 당신의 의견서를 반려하고, 위원회에서 조건부 승인안을 읽습니다." },
        { name: "진세라", note: "KD은행 부행장이자 대출심사위원회 위원장. 규정 안에서만 움직이고, 요청하지 않은 서류는 읽지 않습니다." },
      ],
      question: "한 문장으로 닫힌 반대는 정말 사라진 걸까요? 지켜 주겠다는 말과 당신 이름이 적힌 의견서 가운데, 당신은 무엇을 붙잡겠습니까?",
    },
    en: {
      setting: "April 2023 · 6th-floor review room → Credit Committee room, 8th floor → hallway → document scanning room, basement 1",
      premise: [
        "At five in the morning the Credit Committee agenda goes up on the intranet. The fourth item is 2023-0412, the 31-billion-won loan to FlowOn. Your eleven-page dissent is not in the main file; it is filed as “Attachment 7.” The clause you challenged happens to be Article 7 too. The threshold is 180%; the reported figure is 179.6%.",
        "Assistant Manager Oh Jinwoo sets down a paper cup and spells out how things work. Attachments get read only if the chair asks for them. There are eleven items today and one hour of meeting. Has it occurred to you to work out how many minutes that leaves per item? You don’t have a good answer.",
        "Twenty-eight minutes before the meeting opens, Manager Han Seoyun returns your dissent at the team review stage. At 2 p.m., in the committee room on the 8th floor of head office, the chair, Deputy President Jin Sera, calls Item 4. Han Seoyun reads fourteen lines proposing a conditional approval with Article 7 attached. When Jin Sera mentions Attachment 7, Han Seoyun says it was returned at team review. “A returned annexed opinion is not an agenda item. Next.” Item 4 takes four minutes and twelve seconds.",
        "No one raised a voice, and no one looked at you. Eleven items pass in forty-seven minutes. Out in the hallway afterwards, Han Seoyun tells you about a written opinion she wrote twelve years ago. Request a review, keep a copy, or trust your boss when she says she is protecting you: a door is closing, very quietly.",
      ],
      cast: [
        { name: "Oh Jinwoo", note: "Assistant manager on your team. He counts meetings in minutes and believes whoever is late has already lost." },
        { name: "Han Seoyun", note: "Manager on the Corporate Finance Strategy Team and your boss. She returns your dissent and reads the conditional approval to the committee." },
        { name: "Jin Sera", note: "Deputy President of KD Bank and chair of the Credit Committee. She moves strictly within the rules and reads nothing nobody asked her to read." },
      ],
      question: "Does a dissent closed in one sentence really disappear? Between a promise of protection and an opinion with your name on it, which do you hold on to?",
    },
    ja: {
      setting: "2023年4月 · 本店6階 審査室 → 8階 融資審査委員会の会議室 → 廊下 → 地下1階 文書スキャン室",
      premise: [
        "明け方5時、融資審査委員会の議案リストが社内網に上がります。4番目の議案が2023-0412、フロウオンへの310億ウォンの融資です。あなたが書いた11ページの反対意見書は、本文ではなく「添付7」として付いています。よりによって、あなたが問題にした条項も第7条です。基準線は180%、報告された数字は179.6%です。",
        "オ・ジヌ代理が紙コップを置きながら、現実を教えてくれます。添付は委員長が求めないと読まれない、今日の議案は11件なのに会議は1時間しかない、と。一件に何分残るか計算してみたかと聞かれても、あなたには返す言葉が見つかりません。11ページかけて書いた理由が、読まれる前に時間切れになるかもしれないのです。",
        "開会28分前、ハン・ソユン課長があなたの反対意見書をチーム検討の段階で差し戻します。午後2時、本店8階の会議室。委員長のチン・セラ副頭取が議案4番を呼び、ハン・ソユンが14行を読み上げます。第7条を付けて、条件付き承認(条件を付けて出す承認)で上げるという提案です。チン・セラが添付7に触れると、ハン・ソユンはチーム検討の段階で差し戻したと答え、チン・セラは「差し戻された付属意見は議案ではありません。次」と画面を送ります。議案4番にかかった時間は4分12秒です。",
        "誰も声を荒らげず、誰もあなたを見ませんでした。議案11件が47分で処理されます。会議のあとの廊下で、ハン・ソユンは12年前に自分が書いた意見書の話をします。再審査を求めるか、写しを残すか、守ってあげるという上司の言葉を信じるか。扉はとても静かに、誰にも気づかれないまま閉じようとしています。",
      ],
      cast: [
        { name: "オ・ジヌ", note: "同じチームの代理です。会議の時間を分単位で計算し、遅れた側が負けだと信じています。" },
        { name: "ハン・ソユン", note: "企業金融戦略チームの課長で、あなたの上司です。あなたの意見書を差し戻し、委員会で条件付き承認案を読み上げます。" },
        { name: "チン・セラ", note: "KD銀行の副頭取で、融資審査委員会の委員長です。規定の内側だけで動き、求められていない書類は読みません。" },
      ],
      question: "一文で閉じられた反対は、本当に消えてしまったのでしょうか。守るという言葉と、あなたの名前が書かれた意見書。あなたはどちらをつかみますか。",
    },
  },

  prologue04: {
    ko: {
      setting: "2023년 5월 · 본점 심사실 → KD은행 강서지점 객장 → 지점 2층 회의실 → 망원시장",
      premise: [
        "대출이 승인된 지 두 시간 뒤, 그 돈은 창구의 상품이 됩니다. 2023년 5월, 본점에서 내려온 종이 한 장이 당신을 강서지점으로 보냅니다. 제목은 「판매 적정성 사후 점검」. 담당자 칸에는 당신 이름이 있고 검토자 칸은 비어 있습니다. 심사실에서 하던 일은 이미 다른 사람에게 넘어갔습니다.",
        "객장 실적판 2위는 4번 창구 도윤하입니다. 이름 아래에 판매왕 스티커가 두 장 붙어 있고, 5월 셋째 주에만 1억 9,200만 원어치를 팔았습니다. 지점장 배승호는 종이컵을 내밀며 웃습니다. 우리 지점은 민원이 한 건도 없으니 편하게 보라고, 저 숫자가 거의 다 「스마트물류 3호」이고 요즘은 그것만 나간다고요.",
        "일흔한 살 단골손님이 적금 만기 통장을 들고 4번 창구에 앉습니다. 상품의 정식 이름은 KD 스마트물류 제3호 특정금전신탁(손님이 맡긴 돈을 은행이 정해 둔 한 곳에 넣어 굴려 주는 계약)입니다. 도윤하는 그 이름 대신 서랍 속 3분짜리 대본을 읽습니다. 「어머니, 적금보다 조금 더 나와요.」 제시 수익률은 연 5.8%, 원금 보장은 아닙니다. 22쪽 설명서 가운데 창구에 놓인 건 앞 4쪽뿐이고, 회사가 흔들리면 이 돈이 후순위(돈을 돌려받는 차례가 뒤인 자리)가 된다는 내용은 12쪽에 있습니다.",
        "서명까지 3분 12초. 도윤하는 통장을 두 손으로 건네며 웃고, 그 웃음에는 거짓이 없습니다. 그래서 더 보기 힘듭니다. 그가 파는 사람들은 그가 이름을 아는 사람들입니다. 당신이 막으려던 대출이 지금 눈앞에서 누군가의 노후 자금이 되고 있습니다.",
      ],
      cast: [
        { name: "배승호", note: "KD은행 강서지점장. 직원들을 「우리 애들」이라 부르며, 판매 목표는 위에서 받은 대로 나눴을 뿐이라고 여깁니다." },
        { name: "도윤하", note: "강서지점 4번 창구 행원, 입행 3년차. 손님 이름을 기억하고, 진심으로 웃으며 상품을 권합니다." },
      ],
      question: "쉬운 말로 팔린 상품은 어려운 말로 청구됩니다. 판 사람을 지킬지, 판매 방식을 보고할지, 못 본 것으로 할지, 당신은 무엇을 누구 앞에 먼저 놓겠습니까?",
    },
    en: {
      setting: "May 2023 · Head office review room → KD Bank Gangseo Branch floor → branch meeting room, 2nd floor → Mangwon Market",
      premise: [
        "Two hours after the loan is approved, it becomes a product at the counter. In May 2023 a single sheet from head office sends you to Gangseo Branch. Its title is “Post-Sale Suitability Review.” Your name is in the assignee box; the reviewer box is empty. Your credit review work has already gone to someone else.",
        "Second place on the branch sales board belongs to Window 4, Do Yoonha, with two top-seller stickers under his name and 192 million won in sales in the third week of May alone. Branch Manager Bae Seungho holds out a paper cup and smiles. Not a single complaint at this branch, he says, so take your time. Almost all of those numbers are Smart Logistics No. 3. It’s the only thing selling these days.",
        "A seventy-one-year-old regular sits down at Window 4 with a matured savings passbook. The product’s full name is the KD Smart Logistics No. 3 Specified Money Trust, a contract in which the bank puts a customer’s money into one investment it has already chosen. Do Yoonha doesn’t use that name. He reads the three-minute script in his drawer instead: “Ma’am, it pays a little more than your savings.” The quoted return is 5.8% a year, and the principal isn’t guaranteed. Of the 22-page disclosure, only the first four pages are at the window. Page 12 is the one that says that if the company falters, this money is paid back last.",
        "The signature takes three minutes and twelve seconds. Do Yoonha hands back the passbook with both hands and smiles, and there is no lie in that smile, which makes it harder to watch. The people he sells to are people whose names he knows. The loan you tried to stop is turning into someone’s retirement savings right in front of you.",
      ],
      cast: [
        { name: "Bae Seungho", note: "Manager of KD Bank’s Gangseo Branch. He calls his staff “my kids” and believes he only divided up the sales targets he was handed." },
        { name: "Do Yoonha", note: "Teller at Window 4, three years at the bank. He remembers his customers’ names and recommends the product with a sincere smile." },
      ],
      question: "What is sold in easy words gets billed in hard ones. Protect the seller, report the sales method, or look away: what do you put in front of whom, and in what order?",
    },
    ja: {
      setting: "2023年5月 · 本店審査室 → KD銀行カンソ支店の店内 → 支店2階の会議室 → マンウォン市場",
      premise: [
        "融資が承認されて2時間後、そのお金は窓口の商品になります。2023年5月、本店から下りてきた一枚の紙が、あなたをカンソ支店へ送り出します。題は「販売適正性事後点検」。担当者欄にはあなたの名前があり、検討者欄は空いています。審査室でしていた仕事は、もう別の人に引き継がれました。",
        "店内の実績ボードで2位なのは4番窓口のト・ユナです。名前の下に販売王のステッカーが2枚貼られ、5月の第3週だけで1億9,200万ウォン分を売っています。支店長のペ・スンホが紙コップを差し出して笑います。うちの支店は苦情が一件もないので気楽に見てください、あの数字はほとんどが「スマート物流3号」で、最近はあれしか出ません、と。",
        "71歳の常連客が、積立預金の満期通帳を持って4番窓口に座ります。商品の正式な名前はKDスマート物流第3号特定金銭信託(客が預けたお金を、銀行があらかじめ決めた一か所に入れて運用する契約)です。ト・ユナはその名前の代わりに、引き出しの中の3分間の台本を読みます。「お母さん、積立よりちょっと多く付くんですよ」。提示利回りは年5.8%で、元本保証ではありません。22ページの説明書のうち窓口に置かれているのは最初の4ページだけで、会社が揺らげばこのお金が劣後(返してもらう順番が後ろの立場)になるという説明は12ページにあります。",
        "署名まで3分12秒。ト・ユナは通帳を両手で渡して笑います。その笑顔に嘘がないからこそ、見ているのがつらいのです。彼が売る相手は、彼が名前を知っている人たちです。あなたが止めようとした融資が、いま目の前で誰かの老後の資金に変わっていきます。苦情ゼロの支店で、あなたは何を「点検」すればいいのでしょうか。",
      ],
      cast: [
        { name: "ペ・スンホ", note: "KD銀行カンソ支店長です。行員を「うちの子たち」と呼び、販売目標は上から受け取ったとおりに分けただけだと考えています。" },
        { name: "ト・ユナ", note: "カンソ支店4番窓口の行員で、入行3年目です。客の名前を覚えていて、心からの笑顔で商品を勧めます。" },
      ],
      question: "やさしい言葉で売られたものは、難しい言葉で請求されます。売った人を守るか、販売のやり方を報告するか、見なかったことにするか。あなたは何を、誰の前に先に置きますか。",
    },
  },

  prologue05: {
    ko: {
      setting: "2023년 7월 · 강서지점 → 본점 7층 인사부 면담실 → 6층 팀 사무실 → 합정동 트리거랩 4층과 B2",
      premise: [
        "2023년 7월, 본점 7층 인사부 면담실. 인사부 남지형 대리가 종이 한 장을 당신 쪽으로 밉니다. 인사 제2023-1187호. 새 소속은 「그룹 인지·판단 연구랩」, 사내에서는 트리거랩이라고 부르는 곳입니다. 발령(근무지를 옮기라는 인사 명령)일은 7월 24일 월요일, 통지에서 딱 일주일 뒤입니다.",
        "이상한 건 빈칸입니다. 사유 칸도, 제안자 칸도 비어 있고, 맨 아래에는 인사부장의 전자 직인만 찍혀 있습니다. 남지형은 종이를 뒤집어 보며 사유는 원래 안 적는다고 말합니다. 그 말이 사실이 아니라는 걸 둘 다 압니다. 인사위원회(직원의 징계나 자리 이동을 정하는 회의) 기록에도 이 건은 「보고 사항」 한 줄뿐, 토의한 흔적이 없습니다.",
        "6층 팀 사무실로 돌아오니 발령 공지가 사내망에 세 줄로 올라와 있습니다. 아무도 왜냐고 묻지 않고, 다들 조금씩 더 바빠집니다. 한서윤 과장은 말없이 4월 28일자 반려 확인 접수증을 당신 책상에 두고 갑니다. 화이트보드에는 오진우 대리가 그려 둔 승패 점수판이 그대로 남아 있습니다. 그는 지우개를 들었다가 내려놓고, 오래 미뤄 둔 말을 꺼내려는 얼굴을 합니다.",
        "1년치 자료를 담은 상자는 네 개, 그중 두 건은 반출 승인이 필요합니다. 무엇을 들고 갈지, 첫날 자신을 어떻게 소개할지는 당신이 고릅니다. 합정동 옛 전산센터 4층, 모두가 지하 4층이라 부르는 방에서 에코가 첫 질문을 기다리고 있습니다. 그리고 그 뒤로 햇수로 3년이 흐릅니다.",
      ],
      cast: [
        { name: "남지형", note: "KD은행 인사부 대리, 4년차. 사유 없는 발령서를 읽어 주는 일을 맡았고, 곤란하면 종이를 뒤집어 뒷면을 봅니다." },
        { name: "한서윤", note: "당신의 반대 의견서를 반려했던 과장. 이번에는 아무 말 없이 접수증 한 장을 두고 갑니다." },
        { name: "오진우", note: "같은 팀 대리. 승패를 화이트보드에 적어 두는 사람이지만, 오늘은 그 점수판을 쉽게 지우지 못합니다." },
        { name: "에코", note: "트리거랩의 대출 판단 검증 시스템. 정답을 알려 주지 않고, 첫 판단의 약점을 찌르는 질문을 던집니다." },
      ],
      question: "사람을 옮기는 문서에 옮긴 사람의 이름이 없다면, 그 빈칸은 누구의 몫일까요? 아무도 이유를 말해 주지 않는 날, 당신은 무엇을 챙겨 내려가겠습니까?",
    },
    en: {
      setting: "July 2023 · Gangseo Branch → HR interview room, 7th floor of head office → team office, 6th floor → Trigger Lab, Hapjeong-dong, 4th floor and B2",
      premise: [
        "July 2023, an interview room in the HR department on the 7th floor of head office. Nam Jihyung of HR slides a single sheet of paper across the table. HR Order No. 2023-1187. Your new unit is the “Group Cognition & Judgment Research Lab,” known around the bank as Trigger Lab. The transfer takes effect on Monday, July 24, exactly one week after the notice.",
        "What stands out are the blanks. The reason field is empty, the proposer field is empty, and at the bottom there is only the HR director’s electronic seal. Nam Jihyung turns the sheet over and says reasons are never written down, as a rule. You both know that isn’t true. In the HR Committee minutes, too, this item is a single line marked “for report,” with no sign of discussion.",
        "Back in the team office on the 6th floor, the transfer notice is already on the intranet in three lines. Nobody asks why; everyone just gets a little busier. Without a word, Manager Han Seoyun leaves a return-confirmation receipt dated April 28 on your desk. On the whiteboard, Assistant Manager Oh Jinwoo’s win-loss scoreboard is still there. He picks up the eraser, puts it down again, and looks like he is about to say something he has long put off.",
        "Your year of files fills four boxes, and two items need approval before they can leave the building. What you take with you, and how you introduce yourself on the first day, are yours to choose. On the 4th floor of the old data center in Hapjeong-dong, in the room everyone calls the basement, ECHO is waiting to ask its first question. After that, three years go by.",
      ],
      cast: [
        { name: "Nam Jihyung", note: "HR staffer at KD Bank, four years in. His job is to read you an order with no reason on it, and when a question gets awkward he turns the paper over." },
        { name: "Han Seoyun", note: "The manager who returned your dissent. This time she leaves a single receipt on your desk and says nothing." },
        { name: "Oh Jinwoo", note: "Assistant manager on your team. He keeps score of wins and losses on the whiteboard, but today he can’t quite bring himself to wipe it." },
        { name: "ECHO", note: "Trigger Lab’s loan-judgment verification system. It never gives the answer; it asks the question that finds the weak spot in your first call." },
      ],
      question: "If the document that moves a person carries no name of the one who moved them, whose blank is it? On a day when no one will tell you why, what do you carry down with you?",
    },
    ja: {
      setting: "2023年7月 · カンソ支店 → 本店7階 人事部面談室 → 6階 チームの事務室 → ハプチョン洞 トリガーラボ4階とB2",
      premise: [
        "2023年7月、本店7階の人事部面談室。人事部のナム・ジヒョンが、一枚の紙をあなたのほうへ押し出します。人事第2023-1187号。新しい所属は「グループ認知・判断研究ラボ」、社内ではトリガーラボと呼ばれている部署です。辞令(勤務地を移れという人事命令)の日付は7月24日の月曜日、通知からちょうど一週間後です。",
        "おかしいのは空欄です。事由欄も提案者欄も空いていて、いちばん下には人事部長の電子印だけが押されています。ナム・ジヒョンは紙を裏返してみて、事由はもともと書かないんです、と言います。それが事実ではないことを、ふたりとも知っています。人事委員会(職員の懲戒や異動を決める会議)の記録でも、この件は「報告事項」の一行だけで、話し合った跡はありません。",
        "6階の事務室に戻ると、辞令の告知はもう社内網に3行で出ています。誰もなぜとは聞かず、みんなが少しずつ忙しくなります。ハン・ソユン課長は黙って、4月28日付の差し戻し確認の受付票をあなたの机に置いていきます。ホワイトボードには、オ・ジヌ代理が書いた勝敗のスコアボードがそのまま残っています。彼は消しゴムを手に取ってはまた置き、長く言えずにいたことを切り出しそうな顔をしています。",
        "1年分の資料を詰めた段ボールは4箱、そのうち2件は持ち出しの承認が必要です。何を持っていくか、初日に自分をどう紹介するかは、あなたが選びます。ハプチョン洞の旧電算センター4階、誰もが地下4階と呼ぶ部屋で、ECHOが最初の問いを用意して待っています。そしてそのあと、足かけ3年が過ぎます。",
      ],
      cast: [
        { name: "ナム・ジヒョン", note: "KD銀行人事部の代理で、4年目です。事由のない辞令を読み上げる役目を負い、答えにくい質問を受けると紙を裏返します。" },
        { name: "ハン・ソユン", note: "あなたの反対意見書を差し戻した課長です。今回は何も言わず、受付票を一枚置いていきます。" },
        { name: "オ・ジヌ", note: "同じチームの代理です。勝ち負けをホワイトボードに書き残す人ですが、今日はそのスコアボードをなかなか消せません。" },
        { name: "ECHO", note: "トリガーラボの融資判断検証システムです。正解は教えず、最初の判断の弱点を突く問いを投げかけます。" },
      ],
      question: "人を動かす文書に、動かした人の名前がないとしたら、その空欄は誰のものでしょうか。誰も理由を教えてくれない日、あなたは何を持って下りていきますか。",
    },
  },

  case01: {
    ko: {
      setting: "2025년 · 합정동 트리거랩 지하 분석실 → 플로우온 물류 현장",
      premise: [
        "2025년, 합정동 옛 전산센터 4층. 다들 지하라고 부르는 트리거랩에서 실장 한서윤이 단말에 사건 파일을 띄웁니다. 랩 기록에는 훈련용 사례로 적혀 있지만, 실제로는 KD은행이 요청한 실사(현장에 직접 가서 확인하는 일)입니다. 트리거랩이 할 일은 72시간 안에 권고서를 내는 것뿐입니다.",
        "대상은 새벽 배송 물류 플랫폼 플로우온. 남은 현금으로 버틸 수 있는 시간은 사흘입니다. 직원은 1,140명, 대금을 받지 못한 협력사는 14곳, KD은행 대출 잔액은 310억 원입니다. 표지 아래쪽에 적힌 대출번호는 2023-0412. 3년 전 그 건에 혼자 반대 의견을 쓴 사람이 당신이고, 그 의견서를 반려한 과장이 한서윤이었습니다. 그는 그 번호를 가리지 않습니다. 그리고 당신의 옛 의견서는 지금 사내 시스템에서 검색되지 않습니다.",
        "현장에서 재무책임자 배성준이 장부를 띄워 설명합니다. 3년 전 대출 때 한 번 당겨 잡았던 매출을, 지난 8개월 동안은 달마다 당겼다고요. 빼돌린 돈은 없습니다. 이유는 대출 계약서 제7조, 부채비율(회사 빚이 자기 돈의 몇 배인지 보는 숫자)이 180%를 넘으면 은행이 대출금을 즉시 회수할 수 있다는 조항입니다. 회사가 달마다 맞춰 온 숫자는 3년 전 보고치 179.6%, 손대기 전 숫자는 184%입니다.",
        "KD은행 감사팀 반재욱이 계약서를 당신 쪽으로 밉니다. 이 조항을 쓴 쪽이 이 숫자를 만들게 한 셈인데, 그럼 조작한 사람은 누구냐고 묻습니다. 그 조항을 쓴 부서에, 3년 전 당신의 책상이 있었습니다. 72시간 동안 당신은 누구의 월급과 어느 협력사의 대금을 먼저 지킬지, 무엇을 공개할지 정해야 합니다.",
      ],
      cast: [
        { name: "한서윤", note: "트리거랩 실장. 3년 전 당신의 반대 의견서를 반려했던 과장이었고, 그 사실을 숨기지 않은 채 이 사건을 맡깁니다." },
        { name: "배성준", note: "플로우온 재무책임자. 회사가 살아남도록 숫자의 시점을 옮겨 왔고, 옮겼다는 사실을 감추지 않습니다." },
        { name: "반재욱", note: "KD금융그룹 감사팀 조사역. 선의보다 근거와 승인 순서를 먼저 따지는 사람입니다." },
      ],
      question: "규칙을 만든 쪽과 그 규칙에 맞춰 숫자를 고친 쪽, 책임은 어디에 있을까요? 3년 전 막지 못한 대출의 마지막 72시간을, 당신은 어떻게 닫겠습니까?",
    },
    en: {
      setting: "2025 · Trigger Lab’s basement analysis room, Hapjeong-dong → FlowOn logistics site",
      premise: [
        "It is 2025. On the 4th floor of the old data center in Hapjeong-dong, at the place everyone calls the basement, Trigger Lab Director Han Seoyun puts a case file up on the terminal. In the lab’s records it is a training case. In reality it is due diligence requested by KD Bank, and all Trigger Lab has to do is deliver a recommendation report within 72 hours.",
        "The subject is FlowOn, the dawn-delivery logistics platform. Its remaining cash will last three days. It has 1,140 employees, 14 suppliers who haven’t been paid, and 31 billion won still owed to KD Bank. At the bottom of the cover is loan number 2023-0412. Three years ago you wrote the lone dissent on that loan, and the manager who returned it was Han Seoyun. She does not hide the number. And your old dissent no longer turns up in any search of the bank’s systems.",
        "On site, CFO Bae Sungjun puts the ledger on screen and walks you through it. Revenue they pulled forward once for the loan three years ago, they have pulled forward every month for the last eight months. Nobody pocketed a won. The reason is Article 7 of the loan agreement: if the debt-to-equity ratio goes above 180%, the bank can call the loan at once. The number they have hit every month is the 179.6% they reported three years ago. Untouched, it would be 184%.",
        "Ban Jaewook of KD Bank Internal Audit slides the agreement toward you. The side that wrote this clause effectively made them produce this number, he says, so who exactly is the one who manipulated it? Three years ago, your desk was in the department that wrote that clause. In 72 hours you must decide whose wages and which suppliers come first, and what gets disclosed.",
      ],
      cast: [
        { name: "Han Seoyun", note: "Director of Trigger Lab. Three years ago she was the manager who returned your dissent, and she hands you this case without hiding that fact." },
        { name: "Bae Sungjun", note: "FlowOn’s CFO. He has shifted the timing of the numbers to keep the company alive, and he makes no secret of having done it." },
        { name: "Ban Jaewook", note: "Investigator with the KD Financial Group audit team. He weighs evidence and the order of approvals before anyone’s good intentions." },
      ],
      question: "When one side writes the rule and the other bends its numbers to fit it, where does responsibility lie? How will you close the last 72 hours of a loan you couldn’t stop three years ago?",
    },
    ja: {
      setting: "2025年 · ハプチョン洞 トリガーラボ地下分析室 → フロウオン物流現場",
      premise: [
        "2025年、ハプチョン洞の旧電算センター4階。皆が地下と呼ぶトリガーラボで、室長のハン・ソユンが端末に事件ファイルを映します。ラボの記録上は訓練用の事例ですが、実際はKD銀行が依頼したデューデリジェンス(現場へ直接行って確かめること)です。トリガーラボの仕事は、72時間以内に勧告書を出すことだけです。",
        "対象は早朝配送の物流プラットフォーム、フロウオン。残った現金でもつのは三日です。従業員は1,140人、代金を受け取れていない協力会社は14社、KD銀行からの融資残高は310億ウォン。表紙の下のほうにある融資番号は2023-0412です。3年前、その案件にただ一人反対意見を書いたのがあなたで、それを差し戻した課長がハン・ソユンでした。彼女はその番号を隠しません。そして、あなたの昔の意見書は、いま社内システムで検索しても出てきません。",
        "現場では、財務責任者のペ・ソンジュンが帳簿を映して説明します。3年前の融資のとき一度だけ前倒しした売上を、この8か月は毎月前倒ししてきたのだ、と。着服したお金はありません。理由は融資契約書の第7条、負債比率(会社の借金が自己資本の何倍かを見る数字)が180%を超えれば銀行が融資金を即時回収できるという条項です。毎月合わせてきた数字は3年前の報告値179.6%で、手を加える前は184%です。",
        "KD銀行監査チームのパン・ジェウクが、契約書をあなたのほうへ押し出します。この条項を書いた側がこの数字を作らせたようなものなら、操作したのは誰なのか、と。その条項を書いた部署に、3年前あなたの机がありました。72時間のうちに、誰の給料とどの協力会社の代金を先に守るのか、何を公開するのかを決めなければなりません。",
      ],
      cast: [
        { name: "ハン・ソユン", note: "トリガーラボの室長です。3年前にあなたの反対意見書を差し戻した課長で、そのことを隠さないままこの事件を任せます。" },
        { name: "ペ・ソンジュン", note: "フロウオンの財務責任者です。会社が生き延びるように数字の時期を動かしてきて、動かしたこと自体は隠しません。" },
        { name: "パン・ジェウク", note: "KD金融グループ監査チームの調査役です。善意よりも先に、根拠と承認の順番を問いただします。" },
      ],
      question: "規則を作った側と、その規則に合わせて数字を直した側。責任はどこにあるのでしょうか。3年前に止められなかった融資の最後の72時間を、あなたはどう閉じますか。",
    },
  },

  case02: {
    ko: {
      setting: "2025년 · 플로우온 현장 → 트리거랩 보안 감사실",
      premise: [
        "플로우온에서 돌아온 다음 날 아침, 트리거랩 보안 감사실. 벽면 화면에 접속, 전송, 보안 알림 기록이 나란히 떠 있습니다. 셋 다 어젯밤 23시 41분, 같은 계정에서 나왔습니다. 계정 주인은 데이터 기록을 맡은 계약직 이민서, 재계약 심사를 2주 앞두고 있습니다.",
        "밖으로 넘어갔다는 파일이 더 문제입니다. 당신이 플로우온에서 열람을 신청했던 2023-0412 심사 보고서, 그중 서명란이 비어 있는 3페이지의 스캔본입니다. 그 페이지를 정리한 사람이 이민서였습니다. 감사팀 반재욱은 수첩에 시각을 적다가 멈춥니다. 1차 보고는 2시간 뒤인데, 기록이 이렇게 한목소리로 한 사람을 가리키는 경우는 별로 못 봤다고 말합니다.",
        "로그 단말을 열면 순서가 보입니다. 접속, 내려받기, 전송, 삭제 시도. 네 단계가 11분 안에 머뭇거림 없이 이어졌습니다. 삭제는 실패했는데 실패 기록만 깔끔하게 남았고, 전송받은 주소는 이미 닫혀 있습니다. 이민서의 평소 접속 습관과도 다릅니다. 에코는 이 순서가 사내 보안 교육 자료의 예시와 똑같다고 짚습니다. 그 자료를 만든 곳은 기업금융전략팀입니다. 능숙한 유출자이거나, 유출을 가르쳐 본 사람이라는 것이 에코의 말입니다.",
        "옆 단말에서는 오진우가 같은 기록으로 보고서 초안을 고치고 있습니다. 그 초안이 처음 저장된 시각은 새벽 한 시입니다. 남은 시간은 두 시간, 기록은 너무 완벽합니다. 당신은 기록이 가리키는 사람과 그 기록을 만든 손 가운데 무엇을 먼저 보고할지 정해야 하고, 그러면서도 증언할 사람의 말할 권리를 지켜야 합니다.",
      ],
      cast: [
        { name: "이민서", note: "트리거랩 데이터 기록 담당, 3년차 계약직. 기록이 지목한 사람이며, 변명보다 자기 이름이 적힌 줄을 먼저 가리킵니다." },
        { name: "반재욱", note: "감사팀 조사역. 2시간 안에 1차 보고를 내야 하고, 기록의 시각을 하나씩 수첩에 옮겨 적습니다." },
        { name: "에코", note: "트리거랩의 대출 판단 검증 시스템. 판단을 대신하지 않고, 기록 속 모순과 비용을 짚어 냅니다." },
        { name: "오진우", note: "트리거랩의 경쟁 분석관. 같은 기록을 놓고 따로 보고서 초안을 쓰고 있습니다." },
      ],
      question: "기록이 한목소리로 한 사람을 가리킬 때, 그 깔끔함은 증거일까요, 경고일까요? 두 시간 안에, 당신은 누구의 이름을 먼저 보고서에 올리겠습니까?",
    },
    en: {
      setting: "2025 · FlowOn site → Trigger Lab security audit room",
      premise: [
        "The morning after you get back from FlowOn, you are in Trigger Lab’s security audit room. Access, transfer and security-alert records sit side by side on the wall screen. All three came from the same account at 23:41 last night. The account belongs to Lee Minseo, the contract worker who keeps the lab’s data records, two weeks away from her contract renewal review.",
        "The file that went out is the bigger problem. It is a scan of page 3, the page with the blank signature line, from the 2023-0412 review report you asked to see while you were at FlowOn. The person who filed that page was Lee Minseo. Ban Jaewook of the audit team is copying the time into his notebook when he stops. The first report is due in two hours, he says, and he has rarely seen records point at one person with such a single voice.",
        "Open the log terminal and the sequence is right there: access, download, transfer, attempted deletion. Four steps in eleven minutes, without a moment’s hesitation. The deletion failed, yet the record of that failure is perfectly tidy, and the receiving address has already been shut down. None of it matches how Lee Minseo usually works. ECHO points out that the sequence matches the example in the bank’s internal security training material step for step, material written by the Corporate Finance Strategy Team. A skilled leaker, says ECHO, or someone who has taught leaking.",
        "At the next terminal, Oh Jinwoo is revising a report draft built on the same records. It was first saved at one in the morning. You have two hours, and the record is too perfect. You must decide which to report first, the person the record points to or the hand that made the record, while still protecting a witness’s right to speak.",
      ],
      cast: [
        { name: "Lee Minseo", note: "Data records clerk at Trigger Lab, three years on a contract. The record names her, and instead of making excuses she points to the line with her name on it." },
        { name: "Ban Jaewook", note: "Audit team investigator. He owes a first report in two hours and copies every timestamp into his notebook." },
        { name: "ECHO", note: "Trigger Lab’s loan-judgment verification system. It never decides for you; it points out the contradictions and costs in the record." },
        { name: "Oh Jinwoo", note: "Trigger Lab’s rival analyst. He is writing his own report draft from the same records." },
      ],
      question: "When the records all point at one person in a single voice, is that neatness evidence or a warning? Within two hours, whose name do you put in the report first?",
    },
    ja: {
      setting: "2025年 · フロウオン現場 → トリガーラボ セキュリティ監査室",
      premise: [
        "フロウオンから戻った翌朝、トリガーラボのセキュリティ監査室。壁面スクリーンに、アクセス、送信、セキュリティ警告の記録が並んで映っています。三つとも昨夜23時41分、同じアカウントから出たものです。アカウントの持ち主はデータ記録を担当する契約社員のイ・ミンソ。再契約審査を2週間後に控えています。",
        "もっと問題なのは、外に渡ったというファイルです。あなたがフロウオンで閲覧を申請した2023-0412審査報告書のうち、署名欄が空いている3ページ目のスキャンです。そのページを整理したのがイ・ミンソでした。監査チームのパン・ジェウクは手帳に時刻を書き写していて、ふと手を止めます。1次報告は2時間後だが、記録がここまで口をそろえて一人を指すのはあまり見たことがない、と。",
        "ログ端末を開くと、順番がはっきり見えます。アクセス、ダウンロード、送信、削除の試み。四つの段階が11分以内に、ためらいなく続いています。削除は失敗したのに失敗の記録だけがきれいに残り、送信先のアドレスはすでに閉じられています。イ・ミンソのふだんの接続の癖とも違います。ECHOは、この順番が社内セキュリティ教育資料の例とまったく同じだと指摘します。その資料を作ったのは企業金融戦略チームです。手慣れた流出者か、流出を教えたことのある人だ、というのがECHOの見立てです。",
        "隣の端末では、オ・ジヌが同じ記録をもとに報告書の草案を直しています。その草案が最初に保存されたのは深夜1時です。残り時間は2時間、記録は完璧すぎます。あなたは、記録が指す人とその記録を作った手のどちらを先に報告するかを決めなければなりません。そのうえで、証言する人の話す権利も守らなければなりません。",
      ],
      cast: [
        { name: "イ・ミンソ", note: "トリガーラボのデータ記録担当で、3年目の契約社員です。記録が名指しした人で、弁解より先に自分の名前が書かれた行を指さします。" },
        { name: "パン・ジェウク", note: "監査チームの調査役です。2時間以内に1次報告を出さなければならず、記録の時刻を一つずつ手帳に書き写します。" },
        { name: "ECHO", note: "トリガーラボの融資判断検証システムです。判断を肩代わりせず、記録の中の矛盾とコストを指摘します。" },
        { name: "オ・ジヌ", note: "トリガーラボの競争分析官です。同じ記録をもとに、別の報告書の草案を書いています。" },
      ],
      question: "記録が口をそろえて一人を指すとき、そのきれいさは証拠でしょうか、それとも警告でしょうか。2時間のうちに、あなたは誰の名前を先に報告書に載せますか。",
    },
  },

  case03: {
    ko: {
      setting: "2025년 · 트리거랩 감사실 → 노바웍스 입찰장",
      premise: [
        "노바웍스 본사의 입찰 대기실. 탁자 위에 봉인된 자료 봉투와 생수 두 병이 놓여 있고, 벽시계는 마감까지 4시간을 가리킵니다. KD은행에서 1,240억 원을 빌려 쓰는 노바웍스가 시스템 통합 공사를 공개 입찰에 부쳤습니다. 공사 대금은 그룹 계열사(같은 그룹에 속한 다른 회사)로 들어가고, 제안서는 트리거랩이 씁니다. 고객사가 바라는 것은 비용 18% 절감입니다.",
        "한서윤은 그 돈이 어디로 가는지는 묻지 말라고 합니다. 그리고 덧붙입니다. 옆방에서 오진우가 같은 자료로 안을 낸다고. 윗선은 이것을 생각의 품질 측정이라 부르지만 자기는 인사 자료라고 부른다고. 오진우가 받은 조건은 자기에게도 오지 않았다고요. 봉투 맨 뒤에는 익명 제보가 한 장 끼어 있습니다. 납품될 시스템에 로그인을 우회할 수 있는 결함이 있다는 내용입니다.",
        "곧 오진우의 1차안이 탁자에 놓입니다. 절감률 21%. 당신 안은 13%입니다. 그의 안은 보안 제보를 「확인되지 않은 위험」으로 묶어 맨 뒷장에 넣었습니다. 결함이 사실이면 계약 뒤에 드는 비용이 절감액보다 커지지만, 그 계산은 어디에도 없습니다. 그리고 고객사는 숫자가 분명한 안을 좋아합니다.",
        "문틀에 기댄 오진우가 아버지 이야기를 꺼냅니다. 승인을 하루 늦췄다가 밀려났고, 3년 뒤 그 건은 아무 문제 없던 일로 정리됐다고. 그래서 여기서는 늦으면 틀린 거라고. 게다가 이 입찰 자체가 플로우온의 손실을 다른 회사 장부로 옮기는 통로일지도 모릅니다. 당신은 더 빠른 답이 아니라, 3년 뒤에도 무너지지 않을 판을 짜야 합니다.",
      ],
      cast: [
        { name: "한서윤", note: "트리거랩 실장. 이번 경쟁이 사실상 인사 평가라는 걸 숨기지 않지만, 상대 쪽 조건은 그도 모릅니다." },
        { name: "오진우", note: "KD은행 기업금융전략팀에서 파견 온 경쟁 분석관. 늘 당신보다 빠른 안을 먼저 내놓고, 늦는 것을 무엇보다 두려워합니다." },
      ],
      question: "가장 빠른 답이 가장 싼 실패를 뜻하지는 않습니다. 21%와 13% 사이에서, 당신은 어떤 기준으로 이 입찰을 평가하겠습니까?",
    },
    en: {
      setting: "2025 · Trigger Lab audit room → Novaworks bid hall",
      premise: [
        "The bid waiting room at Novaworks headquarters. A sealed document envelope and two bottles of water sit on the table, and the wall clock shows four hours to the deadline. Novaworks, which owes KD Bank 124 billion won, has put a systems-integration contract out to open tender. The payment will flow to a group affiliate, and Trigger Lab is writing the bid. The client wants an 18% cost cut.",
        "Han Seoyun tells you not to ask where that money goes. Then she adds that Oh Jinwoo is submitting a bid from the same documents in the next room. Upstairs they call this measuring the quality of thinking; she calls it HR material. Whatever terms he was given never reached her. At the very back of the envelope is an anonymous tip: the system to be delivered has a flaw that lets someone bypass the login.",
        "Soon Oh Jinwoo’s first draft lands on the table. A 21% cost cut. Yours is at 13%. His bid lumps the security tip under “unconfirmed risk” and tucks it onto the last page. If the flaw is real, the cost after signing will outrun the savings, but that calculation appears nowhere. And the client likes a bid with clear numbers.",
        "Leaning on the doorframe, Oh Jinwoo brings up his father. He held an approval for one day and was pushed out, and three years later the file was closed as if nothing had ever been wrong. So here, late means wrong. Meanwhile, the bid itself may be a channel for moving FlowOn’s losses onto another company’s books. What you need is not a faster answer, but a deal that still stands three years from now.",
      ],
      cast: [
        { name: "Han Seoyun", note: "Director of Trigger Lab. She makes no secret that this contest is really a personnel evaluation, but even she doesn’t know the other side’s terms." },
        { name: "Oh Jinwoo", note: "Rival analyst seconded from KD Bank’s Corporate Finance Strategy Team. He always lands a faster draft than yours, and nothing scares him like being late." },
      ],
      question: "The fastest answer is not always the cheapest failure. Between 21% and 13%, by what standard will you judge this bid?",
    },
    ja: {
      setting: "2025年 · トリガーラボ監査室 → ノヴァワークス入札会場",
      premise: [
        "ノヴァワークス本社の入札待合室。テーブルには封印された資料の封筒と水のボトルが二本置かれ、壁の時計は締め切りまで4時間を示しています。KD銀行から1,240億ウォンを借りているノヴァワークスが、システム統合工事を公開入札にかけました。工事代金はグループの系列会社(同じグループに属する別の会社)に入り、提案書はトリガーラボが書きます。顧客が求めているのは、コストの18%削減です。",
        "ハン・ソユンは、そのお金がどこへ行くのかは聞かないでほしいと言います。そして付け加えます。隣の部屋で、オ・ジヌが同じ資料から案を出すのだと。上はこれを思考の品質測定と呼び、自分は人事資料と呼んでいる。オ・ジヌに出された条件は自分にも来ていない、と。封筒のいちばん後ろには、匿名の通報が一枚挟まっています。納品予定のシステムに、ログインを迂回できる欠陥があるという内容です。",
        "まもなく、オ・ジヌの1次案がテーブルに置かれます。削減率21%。あなたの案は13%です。彼の案はセキュリティの通報を「未確認のリスク」としてまとめ、最後のページに回しています。欠陥が事実なら契約後にかかるコストが削減額を上回りますが、その計算はどこにもありません。そして顧客は、数字がはっきりした案を好みます。リスクを正直に書くほど、あなたの案は遅く、高く見えてしまいます。",
        "ドア枠にもたれたオ・ジヌが、父親の話を持ち出します。承認を一日遅らせて外され、3年後、その件は何の問題もなかったことで片づけられた。だからここでは、遅れれば間違いなのだと。しかも、この入札そのものが、フロウオンの損失を別の会社の帳簿へ移す通り道かもしれません。あなたが組むべきなのは速い答えではなく、3年後も崩れない勝負です。",
      ],
      cast: [
        { name: "ハン・ソユン", note: "トリガーラボの室長です。この競争が事実上の人事評価であることを隠しませんが、相手側の条件は彼女も知りません。" },
        { name: "オ・ジヌ", note: "KD銀行企業金融戦略チームから派遣された競争分析官です。いつもあなたより速い案を先に出し、遅れることを何より恐れています。" },
      ],
      question: "いちばん速い答えが、いちばん安い失敗を意味するとは限りません。21%と13%のあいだで、あなたはどんな基準でこの入札を評価しますか。",
    },
  },

  case04: {
    ko: {
      setting: "2025년 · 노바웍스 입찰장 → 온새 운영 검토실",
      premise: [
        "온새 운영 검토실 벽에 「지원금 심사까지 9시간」이라고 적힌 종이가 붙어 있습니다. 돌봄 플랫폼 온새가 심사를 통과하면 취약계층(혼자 생활하기 어려운 노인·장애인 같은 이웃) 4,200명의 돌봄이 이어집니다. 그런데 이용자 한 명당 대면 돌봄 시간이 기준보다 정확히 3.0% 모자랍니다.",
        "그 3%는 우연이 아닙니다. 지난 분기 KD은행 기업금융전략팀이 대출 상환(빌린 돈을 갚는 일) 일정을 앞당기라고 요구했고, 온새는 42억 원을 앞당겨 갚느라 돌봄 인력을 줄였습니다. 한서윤이 산식(점수를 계산하는 공식) 종이를 밉니다. 이 한 줄을 손대면 통과한다고, 손댈지 말지가 오늘의 문제라고요. 온새라는 이름을 당신은 3년 전에도 한 번 심사한 적이 있습니다. 포장재를 만들던 전혀 다른 회사였습니다.",
        "탁자 가운데에는 돌봄을 기다리는 640명의 명단이 놓여 있습니다. 현장 담당자 넷 가운데 한 사람은 숫자 3% 때문에 서비스를 끊는 게 더 비윤리적이라고 말합니다. 도윤하는 상환 일정 변경 승인 서류를 꺼냅니다. 플로우온 심사 보고서처럼 맨 위 칸이 비어 있습니다. 3%를 만든 사람은 이 칸에 이름이 없는데, 메우라는 요구는 여기 사람들이 받는다고 그는 말합니다.",
        "반재욱은 수첩에서 눈을 들지 않은 채, 기록 없이 산식을 고치면 명백한 은폐라고 못 박습니다. 기록을 남기면 심사에서 떨어지고, 숨기면 감사 위험이 남습니다. 산식 해석을 넓히는 길은 법적으로 회색지대입니다. 은행의 요구가 만든 3%를, 당신은 어디까지 손대겠습니까.",
      ],
      cast: [
        { name: "한서윤", note: "트리거랩 실장. 산식 한 줄을 고칠 수 있는 길을 보여 주고, 결정은 당신에게 넘깁니다." },
        { name: "도윤하", note: "강서지점 창구 출신의 트리거랩 현장 담당. 숫자보다 그 뒤에 있는 사람의 하루를 먼저 묻습니다." },
        { name: "반재욱", note: "감사팀 조사역. 선의보다 기록과 승인 순서를 믿습니다." },
      ],
      question: "성과를 위해 허용한 예외에는 이름과 종료 조건이 필요합니다. 4,200명의 돌봄과 정직한 기록이 부딪칠 때, 당신은 어떤 예외에 누구의 이름을 붙이겠습니까?",
    },
    en: {
      setting: "2025 · Novaworks bid hall → Onsae operations review room",
      premise: [
        "A sheet taped to the wall of Onsae’s operations review room reads “9 hours to grant review.” If Onsae, a care platform, passes, care continues for 4,200 vulnerable neighbors, older people and people with disabilities who can’t easily manage alone. But face-to-face care hours per user fall exactly 3.0% short of the bar.",
        "That 3% is no accident. Last quarter, KD Bank’s Corporate Finance Strategy Team demanded an earlier repayment schedule, and Onsae cut care staff to pay back 4.2 billion won ahead of time. Han Seoyun slides the scoring formula across. Touch this one line and it passes, she says; whether to touch it is today’s question. You reviewed a company called Onsae once before, three years ago. It was a completely different company, one that made packaging.",
        "In the middle of the table lies a list of 640 people waiting for care. One of the four field staff says that cutting off the service over a 3% number would be the more unethical thing. Do Yoonha takes out the approval form for the repayment schedule change. Like the FlowOn review report, its top box is empty. The person who made the 3% has no name in this box, he says, but the people here are the ones told to fill the gap.",
        "Without looking up from his notebook, Ban Jaewook states flatly that changing the formula without a record is plain concealment. Leave a record and Onsae fails the review; hide it and the audit risk stays. Reading the formula more generously sits in a legal gray zone. How far will you go to touch a 3% the bank’s demand created?",
      ],
      cast: [
        { name: "Han Seoyun", note: "Director of Trigger Lab. She shows you the one line that could be changed, then leaves the decision to you." },
        { name: "Do Yoonha", note: "Trigger Lab field officer who used to work a teller window at Gangseo Branch. He asks about the people behind a number before the number itself." },
        { name: "Ban Jaewook", note: "Audit team investigator. He trusts records and the order of approvals over good intentions." },
      ],
      question: "An exception allowed for the sake of results needs a name and an end date. When care for 4,200 people collides with an honest record, which exception do you allow, and whose name goes on it?",
    },
    ja: {
      setting: "2025年 · ノヴァワークス入札会場 → オンセ運営検討室",
      premise: [
        "オンセ運営検討室の壁に、「助成金審査まで9時間」と書かれた紙が貼られています。ケアプラットフォームのオンセが審査を通れば、ひとりで暮らすのが難しい高齢者や障害者など、支援の必要な4,200人のケアが続きます。ところが、利用者一人あたりの対面ケア時間が基準にちょうど3.0%足りません。",
        "その3%は偶然ではありません。前の四半期、KD銀行の企業金融戦略チームが融資の返済(借りたお金を返すこと)日程の前倒しを求め、オンセは42億ウォンを早めに返すためにケア人員を減らしました。ハン・ソユンが算定式(点数を計算する式)の紙を押し出します。この一行に手を入れれば通る、手を入れるかどうかが今日の問題だ、と。オンセという名前を、あなたは3年前にも一度審査したことがあります。包装材を作っていた、まったく別の会社でした。",
        "テーブルの真ん中には、ケアを待っている640人の名簿が置かれています。現場担当者四人のうちの一人は、数字の3%のためにサービスを切るほうがよほど非倫理的だと言います。ト・ユナが返済日程変更の承認書類を取り出します。フロウオンの審査報告書と同じように、いちばん上の欄が空いています。3%を作った人はこの欄に名前がないのに、埋めろという要求はここにいる人たちが受けている、と彼は言います。",
        "パン・ジェウクは手帳から目を上げないまま、記録なしに算定式に手を入れれば明白な隠蔽だと言い切ります。記録を残せば審査に落ち、隠せば監査のリスクが残ります。算定式の解釈を広げる道は、法的にはグレーゾーンです。どの道を選んでも、誰かが代わりにその3%を払うことになります。銀行の要求が生んだ3%に、あなたはどこまで手を入れますか。",
      ],
      cast: [
        { name: "ハン・ソユン", note: "トリガーラボの室長です。算定式の一行を直せる道を示し、決定はあなたに委ねます。" },
        { name: "ト・ユナ", note: "カンソ支店の窓口出身で、トリガーラボの現場担当です。数字より先に、その向こうにいる人の一日を問います。" },
        { name: "パン・ジェウク", note: "監査チームの調査役です。善意よりも、記録と承認の順番を信じています。" },
      ],
      question: "成果のために認めた例外には、名前と終了条件が必要です。4,200人のケアと正直な記録がぶつかるとき、あなたはどんな例外に、誰の名前を付けますか。",
    },
  },
};
