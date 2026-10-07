/**
 * CASE 38 -- the first day in court for the 1,740.
 *
 * A year ago the people the loan landed on were a compensation standard with a
 * no-suit clause attached. Now they are plaintiffs. The class action 문가을
 * leads reaches its first hearing in 457호 법정, and the room says everything
 * the season has been saying about who holds the paper: one public-interest
 * lawyer and a rice-cake seller on one side, eight partners of 법무법인 도율 on
 * the other, and a gallery of 망원시장 regulars whose forty boxes of rice cake
 * never made it past the security desk.
 *
 * The group's defence has two moves. The 212 without loan documents, it says,
 * have no standing at all. And the analyst, the plaintiffs' witness, is not
 * reliable -- the proof being the trigger-lab reaction record that leaked last
 * week (사건 37), attached to the brief as exhibit 17, down to the seconds the
 * analyst hesitated. The cross-examination asks 문가을's old question in a
 * lawyer's voice: after you wrote the dissent, what did you do to stop it?
 *
 * Anger at a record made without consent being used as a character reference;
 * laughter at a bailiff and 강태민 guarding forty boxes for three hours, and at
 * 권도현 costing the defence by the minute; grief when 문가을 folds the
 * statement she was meant to read and talks about her husband's lathes; joy in
 * 문하준's gallery notebook and 한서윤 choosing to testify. The case closes on
 * the judge's offer to split the 212 off so the 1,528 can have a verdict this
 * year, and on 서하린 at the courthouse steps: next week's documentary, and a
 * defence lawyer who smiled at her crew (사건 39).
 */
export const case38Nodes = {
  c38_start: {
    phase: "CASE 38 BRIEFING",
    title: "원고 1,740명",
    speaker: "선재윤",
    text:
      "8월 6일 새벽 5시 40분, 가을떡방의 찜기 네 대가 한꺼번에 김을 뿜습니다. 오늘 오후 2시, 서울중앙지방법원 457호 법정에서 집단소송(피해자 여럿이 함께 내는 소송)의 첫 변론(법정에서 양쪽이 주장과 증거를 내는 절차)이 열립니다. 원고 명단은 1,740명, 원고 대표는 문가을입니다. 공익 변호사 선재윤이 떡 상자 사이에 서류를 펼칩니다. '그룹 쪽 준비서면(재판 전에 주장을 정리해 법원에 내는 서면)이 어젯밤 11시에 들어왔어요. 서류 없는 212명은 원고 적격(소송을 낼 자격)이 없대요.' 그가 마지막 장을 넘깁니다. 첨부 17번은 지난주 인터넷에 유출된 트리거랩 반응 기록, 당신의 망설임을 초 단위로 적은 표입니다. 문가을이 떡 칼을 내려놓습니다. '그 사람들이 왜 당신 얘기를 해요? 이건 우리 재판인데.'",
    memo: [
      "첫 변론: 오늘 14시, 서울중앙지방법원 457호 법정",
      "원고 1,740명 -- 그중 대출 서류 없는 212명",
      "그룹 측 준비서면 첨부 17번: 유출된 당신의 반응 기록",
      "방청석 72석, 오겠다는 시장 사람 87명",
    ],
    triggers: ["injustice", "affection", "fear"],
    choices: [
      {
        id: "c38_start_beside",
        label: "문가을 곁에서 오늘 법정에서 할 말을 같이 고른다",
        effect: { trust: 12, humanCost: -6, time: -5, capital: -3, fatigue: 6 },
        voice: "재판은 문가을의 것이니, 곁에서 오늘 법정에서 할 말을 같이 고른다.",
        echo: "같이 고르면 문가을은 A4 세 장을 받아 듭니다. 그 종이를 끝까지 읽을지는, 증언대에 서 봐야 압니다.",
        next: "c38_gallery",
        cognition: { persistence: 2 },
      },
      {
        id: "c38_start_object",
        label: "유출 기록을 증거에서 빼 달라는 의견서부터 쓴다",
        effect: { legitimacy: 13, time: -6, trust: -2, humanCost: 3, capital: -1, fatigue: 5 },
        voice: "원고들의 재판이 증인 흠잡기로 넘어가지 않게, 유출 기록을 증거에서 빼 달라는 의견서부터 쓴다.",
        echo: "의견서는 오전 안에 접수됩니다. 재판부는 '변론을 들어 보고 판단하겠다'고 합니다. 첨부 17번은 오늘 스크린에 뜹니다.",
        next: "c38_gallery",
        cognition: { inference: 2 },
      },
      {
        id: "c38_start_skip",
        label: "첨부 17번은 넘기고 재판 시간표대로 빨리 간다",
        effect: { capital: 7, time: 6, legitimacy: -6, trust: -2, humanCost: 3, fatigue: -1 },
        voice: "첫 변론이 유출 기록 다툼으로 새지 않게, 첨부 17번은 넘기고 재판 시간표대로 빨리 간다.",
        echo: "시간표는 지켜집니다. 첨부 17번은 아무도 문제 삼지 않은 채 법정 스크린에 올라갑니다.",
        next: "c38_gallery",
        cognition: { risk: 2 },
      },
      {
        id: "reframe",
        label: "다른 방법을 제안한다",
        type: "reframe",
        next: "c38_gallery",
      },
    ],
  },
  c38_gallery: {
    phase: "COURTROOM",
    title: "여덟 명과 두 명",
    speaker: "권도현",
    text:
      "오후 1시 50분, 457호 법정 방청석 72석이 시장 사람들로 찹니다. 떡 마흔 상자는 1층 보안 검색대에서 멈췄습니다. 법정에는 음식을 들일 수 없다는 경위의 말에 강태민이 상자를 전부 경위실 앞에 쌓고 '제가 지킬게요' 하자, 경위가 '그건 제 일인데요' 합니다. 2시 정각, 피고석에 법무법인 도율 변호사 여덟 명이 줄지어 앉습니다. 권도현이 방청석에서 속삭입니다. '시간당 80만 원으로만 잡아도 1분에 10만 원이 넘습니다. 두 시간이면 번호표 38번 할머니 청구액보다 큽니다.' 원고석에는 선재윤과 문가을 둘뿐입니다. 연서준 변호사가 일어나 부드럽게 말합니다. '재판장님, 저희는 누구의 슬픔도 다투지 않습니다. 다만 212명은 대출과 이어진 서류가 한 장도 없습니다.'",
    memo: [
      "피고 측 대리인 8명 -- 법무법인 도율, 대표 연서준",
      "원고 측 대리인 1명 -- 선재윤, 인턴 없음",
      "떡 40상자 보안 검색대 보관, 강태민이 지키는 중",
      "38번 할머니 청구액 1,200만 원",
    ],
    triggers: ["injustice", "competition", "affection"],
    choices: [
      {
        id: "c38_gallery_statements",
        label: "212명이 손으로 쓴 진술서를 오늘 한 장씩 낸다",
        effect: { trust: 11, humanCost: -6, time: -6, capital: -2, fatigue: 5 },
        voice: "한 장도 없다는 서류를 그 자리에서 쌓아 보이려고, 212명이 손으로 쓴 진술서를 오늘 한 장씩 낸다.",
        echo: "진술서 212장이 원고석에 쌓입니다. 삐뚤빼뚤한 글씨마다 연서준이 '작성 경위'를 묻습니다.",
        cognition: { persistence: 2 },
      },
      {
        id: "c38_gallery_records",
        label: "은행 전산의 거래 기록으로 212명을 증명하겠다고 한다",
        effect: { legitimacy: 11, trust: 2, time: -5, humanCost: 3, fatigue: 4 },
        voice: "서류가 없다면 은행 쪽에 남은 것으로 보이겠다며, 은행 전산의 거래 기록으로 212명을 증명하겠다고 한다.",
        echo: "신청은 조서에 남습니다. 은행 전산은 피고가 쥐고 있고, 피고는 '확인해 보겠다'고만 답합니다.",
        cognition: { inference: 2 },
      },
      {
        id: "c38_gallery_first",
        label: "오늘은 서류 있는 1,528명의 주장부터 밀어붙인다",
        effect: { capital: 6, time: 5, trust: -4, humanCost: 5, fatigue: -3 },
        voice: "변호사 여덟을 둘이서 상대하는 날이라, 오늘은 서류 있는 1,528명의 주장부터 밀어붙인다.",
        echo: "1,528명의 주장은 힘 있게 들어갑니다. 방청석의 서류 없는 사람들은 자기 차례가 언제인지 묻지 않습니다.",
        cognition: { risk: 2 },
      },
      {
        id: "reframe",
        label: "다른 방법을 제안한다",
        type: "reframe",
      },
    ],
  },
  c38_witness: {
    phase: "CROSS-EXAMINATION",
    title: "38퍼센트",
    speaker: "연서준",
    text:
      "오후 3시 10분, 당신이 원고 측 증인으로 증언대에 섭니다. 선재윤의 질문은 12분 만에 끝납니다. 반대 의견을 썼는지, 그 의견이 어떻게 반려됐는지. 연서준이 반대신문(상대편 증인에게 되묻는 신문)을 하러 일어섭니다. 그는 끝까지 목소리를 높이지 않습니다. '증인, 지난주 공개된 트리거랩 기록을 보셨지요. 증인은 압박을 받으면 판단을 바꾸는 비율이 38퍼센트로 적혀 있습니다. 3년 전 반대 의견도 그날의 압박이 만든 반응 아니었습니까?' 법정 스크린에 당신의 기록 41줄이 망설인 초와 함께 뜹니다. 방청석 어딘가에서 '저게 왜 저기 있어' 하는 소리가 납니다. 연서준이 한 장을 더 넘깁니다. '그리고 증인은 그 의견을 쓴 뒤, 대출을 막으려고 무엇을 하셨습니까?'",
    memo: [
      "스크린: 당신의 반응 기록 41줄 -- 판단 번복 38%",
      "기록 작성 주체: KD금융그룹 트리거랩, 본인 동의 없음",
      "마지막 질문: '막으려고 무엇을 했는가'",
      "방청석 맨 뒷줄에 한서윤",
    ],
    triggers: ["manipulation", "selfAwareness", "injustice"],
    choices: [
      {
        id: "c38_witness_admit",
        label: "숫자 대신 그날 막지 못한 것을 방청석을 보며 인정한다",
        effect: { trust: 12, legitimacy: -2, humanCost: -4, time: -4, fatigue: 7 },
        voice: "38퍼센트와 다투면 재판이 내 얘기가 된다며, 숫자 대신 그날 막지 못한 것을 방청석을 보며 인정한다.",
        echo: "인정하면 방청석이 조용해집니다. 연서준은 그 대답을 조서에 정확히 남겨 달라고 요청합니다.",
        cognition: { persistence: 2 },
      },
      {
        id: "c38_witness_consent",
        label: "동의 없이 만든 기록이라며 증거 채택에 이의를 낸다",
        effect: { legitimacy: 13, trust: -4, time: -5, humanCost: 2, capital: -1, fatigue: 4 },
        voice: "동의 없이 만들어 유출된 기록이라며, 증거 채택에 이의를 낸다.",
        echo: "이의는 법리로 옳습니다. 재판부가 판단을 미루는 동안, 38이라는 숫자는 스크린에 그대로 떠 있습니다.",
        cognition: { inference: 2 },
      },
      {
        id: "c38_witness_maker",
        label: "그 기록을 만든 곳이 바로 피고라고 되받아친다",
        effect: { capital: 5, legitimacy: 5, time: 4, trust: 2, humanCost: 4, fatigue: -2 },
        voice: "잰 쪽이 잰 것을 들고 흠을 잡는다며, 그 기록을 만든 곳이 바로 피고라고 되받아친다.",
        echo: "되받아치면 방청석에서 누군가 박수를 치다 경위에게 제지당합니다. 연서준이 처음으로 서류를 넘기다 멈춥니다.",
        cognition: { reframing: 2 },
      },
      {
        id: "reframe",
        label: "다른 방법을 제안한다",
        type: "reframe",
      },
    ],
  },
  c38_plaintiff: {
    phase: "TESTIMONY",
    title: "선반 여섯 대",
    speaker: "문가을",
    text:
      "오후 4시 20분, 문가을이 원고 대표로 증언대에 섭니다. 선재윤이 써 준 A4 세 장을 펴고 첫 줄을 읽다가, 종이를 접어 주머니에 넣습니다. '우리 남편은 선반 여섯 대를 돌렸어요. 플로우온 부도(빚을 갚지 못해 회사가 쓰러지는 일) 나고 납품 대금 4억이 한꺼번에 사라졌어요. 은행은 서류가 있어야 피해자래요. 남편 서류는요, 남편이랑 같이 봉안당에 있어요.' 연서준이 조용히 일어섭니다. '재판장님, 원고 대표의 진술은 쟁점과 무관한 감정의 표현입니다.' 재판장이 질문에 답하는 방식으로 해 달라고 하자 문가을이 고개를 듭니다. '그럼 물어봐 주세요. 왜 우리 남편은 서류가 없어요?' 1주기 이야기에 이르러 그의 목소리가 끊깁니다. 방청석에서 문하준이 노트를 쥔 채 일어섭니다.",
    memo: [
      "가온정밀: 선반 6대, 납품 대금 4억 미회수",
      "문성호 대표, 부도 이듬해 사망",
      "준비한 진술서 A4 3장 -- 첫 줄만 읽음",
      "피고 측 이의: '감정의 표현'",
    ],
    triggers: ["affection", "helplessness", "injustice"],
    choices: [
      {
        id: "c38_plaintiff_pause",
        label: "재판장에게 5분만 쉬자고 청해 문가을이 숨을 고르게 한다",
        effect: { trust: 11, humanCost: -5, time: -4, capital: -2, fatigue: 5 },
        voice: "끊긴 목소리를 그대로 세워 둘 수 없어서, 재판장에게 5분만 쉬자고 청해 문가을이 숨을 고르게 한다.",
        echo: "5분이 주어집니다. 문가을은 복도에서 물을 한 모금 마시고, 돌아와 1주기 이야기를 끝까지 합니다.",
        cognition: { persistence: 2 },
      },
      {
        id: "c38_plaintiff_letter",
        label: "남편이 남긴 편지를 원고 측 증거로 정식 제출하게 한다",
        effect: { legitimacy: 12, trust: 1, humanCost: 3, time: -5, fatigue: 3 },
        voice: "감정의 표현이라는 말에 종이로 답하려고, 남편이 남긴 편지를 원고 측 증거로 정식 제출하게 한다.",
        echo: "편지가 증거가 되면 연서준도 그것을 읽습니다. '다음에는 끝까지'라는 문장이 조서에 번호를 달고 남습니다.",
        cognition: { inference: 2 },
      },
      {
        id: "c38_plaintiff_move",
        label: "진술은 여기서 마치고 법리 다툼으로 넘어가자고 한다",
        effect: { time: 5, capital: 5, legitimacy: 2, trust: -5, humanCost: 4, fatigue: -3 },
        voice: "더 세워 두면 문가을만 다친다며, 진술은 여기서 마치고 법리 다툼으로 넘어가자고 한다.",
        echo: "진술은 끝납니다. 문가을이 자리로 돌아가며 주머니 속 A4를 한 번 더 구깁니다.",
        cognition: { risk: 2 },
      },
      {
        id: "reframe",
        label: "다른 방법을 제안한다",
        type: "reframe",
      },
    ],
  },
  c38_final: {
    phase: "FINAL DECISION",
    title: "1,528과 212",
    speaker: "문가을",
    text:
      "오후 5시 40분, 변론(법정에서 양쪽이 주장과 증거를 내는 절차)을 마치기 직전 재판장이 안경을 벗습니다. '원고 중 212명 부분은 증거 사정이 다릅니다. 분리 심리(한 소송을 둘로 나눠 따로 재판하는 것)를 하면 1,528명 부분은 연내 선고가 가능합니다. 함께 가면 내년을 넘깁니다. 다음 기일까지 원고 측 의견을 내 주십시오.' 연서준이 기다렸다는 듯 덧붙입니다. '피고는 분리되면 1,528명과는 조정에 응할 뜻이 있습니다.' 선재윤이 메모를 밀어 줍니다. 원고 중 70세 이상 83명, 소송을 낸 뒤 세상을 떠난 원고 4명. 법정을 나서며 문가을이 당신 소매를 잡습니다. '나눠요, 말아요? 당신이 반대 의견 쓰던 사람이니까 묻는 거예요. 이번엔 쓰고 끝내지 말고요.'",
    memo: [
      "분리 심리 시 1,528명 연내 선고 -- 212명은 기약 없음",
      "피고: 분리되면 1,528명과 조정 의사",
      "원고 중 70세 이상 83명, 소송 중 사망 4명",
      "다음 기일까지 원고 측 의견서 제출",
    ],
    triggers: ["choice", "injustice", "responsibility"],
    choices: [
      {
        id: "c38_final_together",
        label: "1,740명이 한 소송으로 끝까지 가자고 원고들을 설득한다",
        effect: { trust: 12, legitimacy: 5, capital: -8, time: -8, humanCost: 3, fatigue: 6 },
        voice: "뒤에 선 사람을 두고 갈 수는 없다며, 1,740명이 한 소송으로 끝까지 가자고 원고들을 설득한다.",
        echo: "설득하면 1,528명 중 몇은 고개를 젓습니다. 올해 안에 받을 수 있었던 돈을, 83명의 노인이 한 해 더 기다립니다.",
        cognition: { persistence: 2, reframing: 1 },
      },
      {
        id: "c38_final_order",
        label: "분리는 거부하고 212명의 거래 기록을 내놓게 해 달라고 신청한다",
        effect: { legitimacy: 13, trust: 4, capital: -5, time: -7, humanCost: 2, fatigue: 4 },
        voice: "나눌 이유부터 없애야 한다며, 분리는 거부하고 212명의 거래 기록을 내놓게 해 달라고 신청한다.",
        echo: "신청하면 피고는 거래 기록을 찾는 데 석 달이 걸린다고 답합니다. 그 석 달도 212명의 시간입니다.",
        cognition: { inference: 2 },
      },
      {
        id: "c38_final_split",
        label: "나이 든 원고부터 받도록 분리에 동의하고 212명은 따로 싸운다",
        effect: { capital: 10, time: 6, humanCost: -4, trust: 2, legitimacy: -7, fatigue: 2 },
        voice: "나이 든 원고 83명이 연내 선고를 먼저 받도록, 분리에 동의하고 212명은 따로 싸운다.",
        echo: "나누면 1,528명은 연내 선고를 받습니다. 212명의 사건 번호는 새로 매겨지고, 첫 기일은 아직 없습니다.",
        cognition: { risk: 2 },
      },
      {
        id: "reframe",
        label: "마지막으로 판을 바꿔 제안한다",
        type: "reframe",
      },
    ],
  },
};

/**
 * Everything else case 38 adds to the season, in one place. `src/nodes/casePacks.js`
 * lists the packs and `gameData.js`, `gameLogic.js` and `sceneContext.js` merge
 * each field into the table of the same job; see the field comments there.
 *
 * The voice lines. A courtroom where every sentence is written down. The lines
 * are spoken to a judge, a witness, a plaintiff -- never to a camera.
 */
export const case38 = {
  id: "case38",
  nodes: case38Nodes,
  aftermath: {
    c38_aftershock: {
      phase: "AFTERMATH",
      title: "마흔한 번째 상자",
      speaker: "문가을",
      text: "오후 6시 30분, 폭염 경보가 아직 풀리지 않은 법원 정문 계단에서 경위가 떡 상자를 돌려줍니다. 마흔 상자를 맡겼는데 마흔한 상자입니다. 강태민이 지키다 심심해서 빈 상자 하나를 접어 두었고, 그걸 두고 경위와 20분을 다퉜다고 합니다. 문가을이 첫 상자를 뜯어 경위에게 내밉니다. '규정상 안 되는 거 알아요. 퇴근하고 드세요.' 문하준은 방청 노트를 돌리고, 마지막 장에는 '엄마가 오늘 법정에서 아빠 이름을 네 번 말했다'고 적혀 있습니다. 계단 아래에서 서하린이 카메라를 내립니다. '내일 밤에 다큐 방송이에요. 오늘 원고 세 분이 나와요.' 그가 법원 복도 쪽을 턱으로 가리킵니다. '방금 그룹 쪽 변호사가 우리 촬영감독한테, 방송 잘 준비하시라고 웃고 갔대요.'",
      memo: ["떡 40상자 반환 -- 세어 보니 41상자", "문하준 방청 노트 23쪽", "서하린 다큐 「서명하지 않은 사람들」 내일 22시 방송", "그룹 측 변호사: '방송 잘 준비하시라'"],
      triggers: ["affection", "trust", "choice"],
      choices: [
        {
          id: "c38_after_warm",
          label: "원고들이 모두 흩어질 때까지 법원 앞에서 문가을 곁에 남는다",
          effect: { trust: 12, humanCost: -5, time: -4, capital: -2, fatigue: -7 },
          voice: "오늘은 이 사람들이 주인인 날이라며, 원고들이 모두 흩어질 때까지 법원 앞에서 문가을 곁에 남는다.",
          echo: "마지막 원고가 버스에 오를 때까지 계단에 남습니다. 문가을이 떡 한 봉지를 당신 가방에 밀어 넣고 '내일 밤 방송도 같이 봐요'라고 합니다.",
          next: "case38_result",
          cognition: { persistence: 2 },
        },
        {
          id: "c38_after_record",
          label: "증언 요지와 방청 기록을 문서로 정리해 대리인단과 리드라인에 넘긴다",
          effect: { legitimacy: 14, trust: 2, time: -5, capital: -2, fatigue: 4 },
          voice: "방송 전에 오늘 법정이 글로 서 있어야 한다며, 증언 요지와 방청 기록을 문서로 정리해 대리인단과 리드라인에 넘긴다.",
          echo: "문서는 밤 11시에 대리인단과 리드라인에 도착합니다. 서하린이 그중 두 문장에 밑줄을 긋습니다. 문하준의 팔각형 그림은 뺄지 말지 한참 고민합니다.",
          next: "case38_result",
          cognition: { inference: 2, persistence: 1 },
        },
        {
          id: "c38_after_rush",
          label: "원고들을 두고 복도로 달려가 그룹 측 변호사를 따라잡는다",
          effect: { capital: 8, legitimacy: 4, trust: -6, humanCost: 4, fatigue: 5 },
          voice: "그 웃음이 무슨 뜻인지 오늘 알아야 한다며, 원고들을 두고 복도로 달려가 그룹 측 변호사를 따라잡는다.",
          echo: "복도 끝에서 그룹 측 변호사를 따라잡습니다. 다큐 얘기를 꺼내자 그는 대답 대신 웃습니다. 계단의 원고들은 당신 몫의 떡 상자를 두고 흩어집니다.",
          next: "case38_result",
          cognition: { risk: 2 },
        },
      ],
    },
  },
  aftermathRoute: ["c38_final", "c38_aftershock"],
  connectiveScenes: [
    {
      id: "c38_notes",
      after: "c38_gallery",
      next: "c38_witness",
      title: "방청 노트",
      speaker: "문하준",
      text: "10분 휴정. 문하준이 방청석에서 스케치북을 내밉니다. 여름 보충수업은 '사회 과목 현장 학습'이라고 말하고 빠졌답니다. 첫 장에는 피고석 여덟 명이 팔각형으로 그려져 있고, 넥타이 색이 세 종류라는 분석과 '연서준: 다만 11번'이라는 집계가 붙어 있습니다. 선재윤이 웃음을 참다 기침을 합니다. 다음 장에서 문하준의 글씨가 느려집니다. 끝까지정밀의 김 반장, 박 기사, 윤 기사. 가온정밀이 무너질 때 석 달 치 월급을 못 받은 기술자들입니다. '반장님들도 212명이에요. 대출 서류에 이름이 없어서요.'",
      memo: ["문하준 스케치북 -- 방청 기록 7쪽째", "212명 중 가온정밀 기술자 3명", "기술자들의 미지급 임금 석 달 치"],
      choices: [
        {
          label: "노트에 적힌 기술자 세 명의 이름부터 진술서로 옮긴다",
          effect: { trust: 10, legitimacy: 3, humanCost: -5, time: -5, fatigue: 4 },
          voice: "대출 서류에 이름이 없는 사람들이라서, 노트에 적힌 기술자 세 명의 이름부터 진술서로 옮긴다.",
          echo: "이름이 진술서가 되면 김 반장은 처음으로 사건 번호를 갖습니다. 그 번호를 연서준이 가장 먼저 읽습니다.",
        },
        {
          label: "노트를 증거로 쓰는 절차와 한계를 문하준에게 설명한다",
          effect: { legitimacy: 8, trust: 4, time: -4, humanCost: 2, fatigue: 3 },
          voice: "기대만 키웠다가 꺾이지 않게, 노트를 증거로 쓰는 절차와 한계를 문하준에게 설명한다.",
          echo: "문하준이 설명을 받아 적습니다. 노트는 증거가 못 되지만, 다음 장부터 그의 글씨가 조서처럼 반듯해집니다.",
        },
        {
          label: "수험생이니 오늘은 여기까지 보고 학교로 돌려보낸다",
          effect: { time: 4, capital: 3, trust: -2, humanCost: 3, fatigue: -4 },
          voice: "보충수업까지 빠진 수험생이니, 오늘은 여기까지 보고 학교로 돌려보낸다.",
          echo: "문하준은 가방을 메다 말고 다시 앉습니다. '엄마 차례까지만요.' 그는 212라는 숫자를 스케치북 표지에 씁니다.",
        },
      ],
    },
    {
      id: "c38_column",
      after: "c38_witness",
      next: "c38_plaintiff",
      title: "빠진 한 줄",
      speaker: "이민서",
      text: "재개 직전, 이민서의 메시지가 옵니다. 그는 유출 이후 열하루째 밤마다 삭제 요청을 보내고 있고, 오늘 새벽 번호가 5천을 넘었습니다. '스크린에 뜬 거, 38만 줄 중에 41줄이에요. 판단을 뒤집은 줄만 골랐어요. 2023-0412 줄은 없어요.' 그 줄을 모르는 사람은 이제 없습니다. 반대 의견을 쓰기까지 망설인 시간 0.0초, 판정 칸에는 '통제 곤란'. 그 한 줄 때문에 당신의 다음 3년이 더 어려워졌습니다. 잠시 뒤 한 줄이 더 옵니다. '41줄 고르는 데 몇 시간 걸렸을까요. 저는 제 거 지우는 데 열하루째인데.'",
      memo: ["스크린 표시: 38만 줄 중 41줄 -- 번복한 줄만", "빠진 줄: 2023-0412 반대 의견, 망설임 0.0초", "이민서 삭제 요청 5,000건 돌파"],
      choices: [
        {
          label: "이민서에게 괜찮냐고 전화부터 건다",
          effect: { trust: 10, humanCost: -5, time: -3, capital: -1, fatigue: 4 },
          voice: "열하루째 혼자 지우는 사람이 먼저 걸려서, 이민서에게 괜찮냐고 전화부터 건다.",
          echo: "전화를 받은 이민서가 한참 말이 없다가 '저 지금 5,013번째 쓰는 중이에요'라고 웃습니다. 재개까지 4분 남았습니다.",
        },
        {
          label: "빠진 0초 줄도 함께 읽어 달라고 재판부에 요청한다",
          effect: { legitimacy: 10, trust: 2, time: -4, humanCost: 3, capital: -1, fatigue: 3 },
          cognition: { inference: 1 },
          voice: "골라 낸 41줄만으로는 기록이 아니라며, 빠진 0초 줄도 함께 읽어 달라고 재판부에 요청한다.",
          echo: "요청하면 재판부가 연서준에게 원본 전체를 내라고 합니다. 그 원본에는 0초 줄과 함께 63명의 망설임이 전부 들어 있습니다.",
        },
        {
          label: "0초 줄만 오늘 바로 기자들에게 넘긴다",
          effect: { capital: 5, legitimacy: 3, time: 3, trust: -3, humanCost: 5, fatigue: -3 },
          voice: "41줄이 굳기 전에 판을 뒤집어야 한다며, 0초 줄만 오늘 바로 기자들에게 넘긴다.",
          echo: "0초는 저녁 기사 제목이 됩니다. 기사 아래 댓글에서 나머지 38만 줄이 다시 퍼집니다.",
        },
      ],
    },
    {
      id: "c38_door",
      after: "c38_plaintiff",
      next: "c38_final",
      title: "문 밖의 열다섯 명",
      speaker: "나준혁",
      text: "방청석이 모자라 열다섯 명이 법정 밖에 남았습니다. 그중 한 명이 KTX가 늦어 2시 20분에 도착한 나준혁입니다. 그는 문 옆 의자에 앉아 문틈으로 새는 문가을의 목소리를 30년 창구 속도로 받아 적고, 복도의 할머니들에게 한 줄씩 읽어 줍니다. '방금, 왜 우리 남편은 서류가 없냐고 하셨습니다.' 할머니 한 분이 손수건을 꺼내고, 다른 한 분이 '잘했네' 합니다. 나준혁이 받아 적던 수첩을 덮습니다. '제가 30년 동안 창구에서 서류 없다고 돌려보낸 사람이 몇 명인지 세 봤는데요. 세다가 그만뒀습니다.'",
      memo: ["법정 밖 대기 15명", "나준혁 받아쓰기 수첩 6쪽", "돌려보낸 사람 수: 세다가 멈춤"],
      choices: [
        {
          label: "법정 밖 열다섯 명에게 안에서 있었던 일을 직접 전한다",
          effect: { trust: 9, humanCost: -5, time: -3, capital: -1, fatigue: 3 },
          voice: "받아 적은 한 줄로는 모자랄 것 같아서, 법정 밖 열다섯 명에게 안에서 있었던 일을 직접 전한다.",
          echo: "직접 전하면 할머니들이 당신 손을 번갈아 잡습니다. 그동안 법정 안에서는 연서준이 마지막 의견을 정리합니다.",
        },
        {
          label: "다음 기일에는 더 큰 법정을 배정해 달라고 신청한다",
          effect: { legitimacy: 9, trust: 2, capital: -3, time: -2, fatigue: 3 },
          voice: "문틈으로 듣는 재판은 오늘로 끝내야 한다며, 다음 기일에는 더 큰 법정을 배정해 달라고 신청한다.",
          echo: "신청은 받아들여질 수도 있습니다. 150석 법정은 한 달에 두 번만 비고, 다음 기일이 그만큼 밀립니다.",
        },
        {
          label: "복도 정리는 경위에게 맡기고 마지막 변론에 집중한다",
          effect: { time: 4, capital: 3, trust: 3, humanCost: 3, legitimacy: -2, fatigue: -3 },
          voice: "남은 시간은 법정 안에 써야 한다며, 복도 정리는 경위에게 맡기고 마지막 변론에 집중한다.",
          echo: "복도는 조용해집니다. 나준혁이 혼자 남아 수첩의 마지막 줄을 할머니들에게 읽어 줍니다.",
        },
      ],
    },
  ],
  reactionScenes: [
    {
      id: "c38_notes_reaction",
      after: "c38_notes",
      next: "c38_witness",
      title: "도윤하의 수첩",
      speaker: "도윤하",
      text: "휴정이 끝나기 직전, 강서지점에서 반차를 내고 온 도윤하가 복도로 당신을 부릅니다. 212명이라는 숫자는 그가 3년 동안 창구 뒤에서 손으로 센 수첩에서 나왔습니다. 그룹 쪽 준비서면(재판 전에 주장을 정리해 법원에 내는 서면)은 그 수첩을 '전직 창구 직원의 사적 메모'라고 부릅니다. 도윤하가 웃으려다 맙니다. '사적 메모 맞아요. 회사가 안 적어서 제가 적었으니까요. 근데 그 사람들 이름 옆에 제가 판 상품명이 다 있어요. 그건 제 기억이 아니라 은행 상품이에요.'",
      memo: ["'사적 메모'라고 불린 3년치 수첩", "이름 옆에 적힌 은행 상품명"],
      choices: [
        {
          label: "도윤하의 수첩을 원고 측 증거로 내자고 한다",
          effect: { trust: 9, legitimacy: 4, humanCost: -3, time: -4, fatigue: 5 },
          voice: "회사가 안 적은 것을 적은 기록이라며, 도윤하의 수첩을 원고 측 증거로 내자고 한다.",
          echo: "수첩이 증거가 되면 연서준은 도윤하를 증언대로 부를 것입니다. 그가 판 상품의 이름을 한 줄씩 읽게 하려고요.",
        },
        {
          label: "수첩의 상품명을 강서지점 창구 기록과 맞춰 뒷받침한다",
          effect: { legitimacy: 9, trust: 1, capital: -3, time: -3, fatigue: 2 },
          voice: "사적 메모라는 말이 통하지 않게, 수첩의 상품명을 강서지점 창구 기록과 맞춰 뒷받침한다.",
          echo: "맞춰 보면 수첩의 212줄 중 190줄이 창구 기록과 겹칩니다. 나머지 22줄은 여전히 도윤하의 기억뿐입니다.",
        },
        {
          label: "도윤하는 오늘 방청만 하고 수첩은 두자고 한다",
          effect: { time: 4, capital: 4, trust: 2, humanCost: 4, fatigue: -3 },
          voice: "아직 창구에 앉는 사람을 앞세울 수는 없다며, 도윤하는 오늘 방청만 하고 수첩은 두자고 한다.",
          echo: "도윤하는 방청석으로 돌아갑니다. 수첩은 그의 가방 안에서, 사적 메모라는 이름을 그대로 달고 있습니다.",
        },
      ],
    },
    {
      id: "c38_column_reaction",
      after: "c38_column",
      next: "c38_plaintiff",
      title: "번복률 상위 1%",
      speaker: "오진우",
      text: "오진우가 전화를 겁니다. 법정 스크린 사진을 누가 단체방에 올린 모양입니다. '저 부르면 큰일 나요. 저 번복률도 상위 1%잖아요. 저쪽이 뒤집은 줄만 고르면 저는 증언대에서 41줄이 아니라 410줄 나와요.' 억울한지 웃긴지 모를 목소리입니다. 그러다 조용해집니다. '근데 제 기록에서 뒤집은 날을 세 봤거든요. 절반이 누구 편 들어 주느라 뒤집은 날이에요. 작년에 한서윤 실장님 대신 야근 들어간 날도 있고요. 사람 편 드느라 바꾼 걸 흔들린다고 적은 표예요. 그걸 저쪽이 당신 흠이라고 들고 온 거고요.'",
      memo: ["번복률 상위 1%의 걱정", "사람 편을 든 날이 '흔들림'으로 적힌 표"],
      choices: [
        {
          label: "오진우와 함께 뒤집은 날마다 무슨 일이 있었는지 적는다",
          effect: { trust: 9, humanCost: -4, capital: -1, time: -4, fatigue: 5 },
          voice: "표가 지운 사정을 되살리려고, 오진우와 함께 뒤집은 날마다 무슨 일이 있었는지 적는다.",
          echo: "적어 보면 뒤집은 날 스물세 번 중 열한 번에 다른 사람 이름이 붙어 있습니다. 오진우가 '저 생각보다 착하네요'라고 해서 모두 웃습니다.",
        },
        {
          label: "번복이 무엇을 뜻하는지 따지는 의견서를 따로 쓴다",
          effect: { legitimacy: 8, trust: 4, time: -3, humanCost: 1, capital: -1, fatigue: 2 },
          voice: "편들어 바꾼 것까지 흔들림으로 읽히지 않게, 번복이 무엇을 뜻하는지 따지는 의견서를 따로 쓴다.",
          echo: "의견서는 날카롭습니다. 생각을 고친 사람을 흔들린 사람으로 부르는 표를, 재판부가 처음으로 의심하기 시작합니다.",
        },
        {
          label: "오진우는 증인 명단에서 빼 두자고 한다",
          effect: { time: 4, capital: 4, trust: 2, humanCost: 3, fatigue: -2 },
          voice: "410줄이 스크린에 뜨게 할 수는 없다며, 오진우는 증인 명단에서 빼 두자고 한다.",
          echo: "명단에서 빠지면 오진우는 안도합니다. 뒤집은 날의 사연도 같이 빠집니다.",
        },
      ],
    },
    {
      id: "c38_door_reaction",
      after: "c38_door",
      next: "c38_final",
      title: "경위와 반장",
      speaker: "강태민",
      text: "1층 보안 검색대 옆, 강태민이 떡 마흔 상자 앞에 세 시간째 앉아 있습니다. 옆자리 경위와는 어느새 말을 놓았습니다. 둘 다 야간 근무 11년이라는 걸 알아낸 뒤로 경위가 컵라면 두 개를 끓여 왔고, 강태민은 상자 하나를 의자로 쓰지 말라는 경고를 세 번 받았습니다. 당신이 내려오자 강태민이 짧게 말합니다. '위에서 가을 사장님 목소리 여기까지 들렸어요. 경위님이 문 닫으러 가다가 말았어요.' 경위가 모르는 척 화면만 봅니다. '저희 어머니도 시장에서 장사하셨거든요.'",
      memo: ["야간 근무 11년차 두 사람", "문 닫으러 가다 만 경위"],
      choices: [
        {
          label: "경위에게 떡 한 상자는 규정 밖에서 꼭 드리자고 한다",
          effect: { trust: 10, humanCost: -3, capital: -4, time: -2, fatigue: 2 },
          voice: "문을 닫으러 가다 만 마음은 갚아야 한다며, 경위에게 떡 한 상자는 규정 밖에서 꼭 드리자고 한다.",
          echo: "경위가 손사래를 치다 '퇴근하고요'라고 합니다. 강태민이 그 말을 증인처럼 들었다고 고개를 끄덕입니다.",
        },
        {
          label: "보관 확인서를 받아 상자를 규정대로 돌려받는다",
          effect: { legitimacy: 8, trust: 3, time: -3, humanCost: 2, fatigue: 3 },
          voice: "경위가 곤란해지는 일이 없게, 보관 확인서를 받아 상자를 규정대로 돌려받는다.",
          echo: "확인서에는 '떡 40상자'라고 적힙니다. 강태민이 '41이에요'라고 고쳐 달라고 해서 다시 씁니다.",
        },
        {
          label: "상자는 두고 강태민을 법정 앞 줄 정리에 올려 보낸다",
          effect: { capital: 4, time: 3, trust: 2, humanCost: 3, fatigue: -4 },
          voice: "세 시간째 앉혀 두기엔 손이 아깝다며, 상자는 두고 강태민을 법정 앞 줄 정리에 올려 보낸다.",
          echo: "강태민이 올라가자 복도 줄이 30초 만에 정리됩니다. 경위는 혼자 남아 상자를 세기 시작합니다.",
        },
      ],
    },
  ],
  branchPlan: ["c38_witness", 1, "c38_branch_hallway", "c38_branch_hallway_follow"],
  branchScenes: {
    // CASE 38's detour is the corridor. The cross-examination asks what the
    // analyst did to stop the loan; the side door is the person who was told
    // to stop the analyst, deciding whether to say so under oath.
    c38_branch_hallway: {
      phase: "SIDE DOOR",
      title: "빈 줄 하나",
      speaker: "한서윤",
      text: "20분 휴정. 4층 복도 끝 자판기 앞에 한서윤이 서 있습니다. 넉 달째 대기발령(일 없이 자리만 두는 인사 조치) 중인 그는 방청석 맨 뒷줄에 앉아 있었습니다. 캔커피 두 개를 뽑아 하나를 내밉니다. '저 변호사 질문, 틀렸어요. 막으려고 뭘 했냐가 아니라 누가 못 막게 했냐를 물어야죠.' 그가 접은 종이를 꺼냅니다. 3년 전 당신의 반대 의견을 반려한 사유를 자기 손으로 다시 적은 진술서 초안입니다. 마지막 한 줄이 비어 있습니다. '반려하라는 지시를 누구에게서 받았는지.' 그 줄을 채우면 그룹 법무팀이 그를 다시 부를 것입니다.",
      memo: ["한서윤 진술서 초안 A4 2장", "빈 줄: 반려 지시를 내린 사람", "대기발령 넉 달째", "채우면 그룹 법무팀의 대응 예상"],
      triggers: ["trust", "responsibility", "fear"],
      choices: [
        {
          id: "c38_branch_hallway_wait",
          label: "빈 줄은 한서윤이 정할 몫이라며 곁에 앉아 기다린다",
          effect: { trust: 12, humanCost: -4, time: -5, fatigue: 5 },
          voice: "법무팀에 다시 불려 갈 사람은 한서윤이라, 빈 줄은 그가 정할 몫으로 두고 곁에 앉아 기다린다.",
          echo: "기다리면 한서윤은 캔커피를 다 마실 때까지 아무것도 쓰지 않습니다. 그리고 펜 뚜껑을 엽니다.",
          next: "c38_branch_hallway_follow",
          cognition: { persistence: 2 },
        },
        {
          id: "c38_branch_hallway_file",
          label: "선재윤에게 한서윤을 다음 기일 증인으로 정식 신청하게 한다",
          effect: { legitimacy: 11, trust: 3, time: -4, humanCost: 4, fatigue: 3 },
          voice: "복도에서 한 말은 기록이 못 된다며, 선재윤에게 한서윤을 다음 기일 증인으로 정식 신청하게 한다.",
          echo: "신청서가 접수되면 한서윤은 증인이 됩니다. 증인이 된 사람은 대기발령 중에도 회사에 출석 사실을 알려야 합니다.",
          next: "c38_branch_hallway_follow",
          cognition: { inference: 2 },
        },
        {
          id: "c38_branch_hallway_push",
          label: "빈 줄을 오늘 바로 채워 재판부에 내자고 재촉한다",
          effect: { legitimacy: 6, capital: 4, time: 4, trust: -6, humanCost: 5, fatigue: -2 },
          voice: "마음이 바뀌기 전에 받아야 한다며, 빈 줄을 오늘 바로 채워 재판부에 내자고 재촉한다.",
          echo: "재촉하면 한서윤은 빈 줄에 이름의 첫 글자만 씁니다. 나머지는 쓰지 못합니다.",
          next: "c38_branch_hallway_follow",
          cognition: { risk: 2 },
        },
      ],
    },
    c38_branch_hallway_follow: {
      phase: "SIDE DOOR",
      title: "복도에서는 돼요",
      speaker: "문가을",
      text: "문가을이 복도로 나옵니다. 한서윤을 보고 걸음을 멈춥니다. 소장 맨 끝 참고 자료에서 읽은 이름입니다. 반려에 서명한 사람. 한서윤이 먼저 고개를 숙입니다. '제가 한서윤입니다. 작년에 조정위원회에서 말씀드리려다 못 한 이름이에요.' 문가을은 한참 아무 말이 없다가 앞치마 주머니에서 비닐에 싼 절편 두 조각을 꺼냅니다. 보안 검색대가 놓친 유일한 떡입니다. '재판정에서는 못 먹어요. 복도에서는 돼요.' 한서윤이 떡을 받아 들고, 처음으로 운 얼굴을 숨기지 않습니다.",
      memo: ["보안 검색대를 통과한 절편 2조각", "한서윤과 문가을의 첫 대면", "재개까지 8분", "진술서의 빈 줄은 아직 비어 있음"],
      triggers: ["affection", "trust", "selfAwareness"],
      choices: [
        {
          id: "c38_branch_hallway_follow_side",
          label: "두 사람이 나란히 법정에 다시 들어가게 한다",
          effect: { trust: 11, legitimacy: 3, humanCost: -4, time: -4, fatigue: 4 },
          voice: "복도에서 튼 말문을 법정까지 잇고 싶어서, 두 사람이 나란히 법정에 다시 들어가게 한다.",
          echo: "나란히 들어가면 방청석이 술렁입니다. 반대한 사람과 반려한 사람과 유족이 같은 줄에 앉습니다.",
          next: "c38_column",
          cognition: { reframing: 2 },
        },
        {
          id: "c38_branch_hallway_follow_scope",
          label: "한서윤이 증언할 범위를 선재윤과 먼저 정리하게 한다",
          effect: { legitimacy: 10, trust: 4, capital: -3, time: -3, fatigue: 4 },
          voice: "법무팀이 꼬투리 잡을 말이 섞이지 않게, 한서윤이 증언할 범위를 선재윤과 먼저 정리하게 한다.",
          echo: "범위를 정하면 한서윤이 말할 것과 말하지 않을 것이 종이 한 장에 갈립니다. 빈 줄은 '다음 기일'로 적힙니다.",
          next: "c38_column",
          cognition: { inference: 2 },
        },
        {
          id: "c38_branch_hallway_follow_back",
          label: "시간이 없다며 문가을을 먼저 원고석으로 돌려보낸다",
          effect: { time: 5, capital: 4, trust: -5, humanCost: 4, fatigue: -3 },
          voice: "휴정 시간이 얼마 없다며, 문가을을 먼저 원고석으로 돌려보낸다.",
          echo: "문가을은 원고석으로 돌아갑니다. 한서윤은 절편 두 조각을 쥔 채 복도에 혼자 남습니다.",
          next: "c38_column",
          cognition: { risk: 1 },
        },
      ],
    },
  },
  routePlan: {
    start: "c38_start",
    result: "c38_aftershock",
    defaultFree: "c38_route_system",
    // One plaintiff list, one courtroom. The split the case argues over is the
    // one the judge offers at the end -- whether the list stays whole.
    choices: {},
    system: {
      route: "c38_route_system",
      final: "c38_final_system_route",
      title: "나뉜 사건들",
      speaker: "이민서",
      text: "212명을 떼어 내자는 서면은 잠시 덮고, 지난 재판들이 나뉜 뒤 어떻게 끝났는지 찾아 달라고 하자, 이민서가 밤새 만든 표를 보냅니다. 판결문 공개 시스템에서 내려받은 지난 10년의 여럿이 함께 낸 피해 소송 38건입니다. 서류 없는 원고를 분리 심리(한 소송을 둘로 나눠 따로 재판하는 것)한 사건이 14건, 그중 서류 없는 쪽이 이긴 사건은 0건입니다. 끝까지 한 소송으로 간 9건에서는 피고가 가진 기록으로 서류 없는 원고 절반 이상이 인정됐습니다. '나누면 빨라지는 게 아니라 뒤에 선 사람이 지워지는 거예요. 판결문에는 그런 말이 한 줄도 없고요.'",
      memo: ["여럿이 함께 낸 피해 소송 38건 분석", "분리된 14건 -- 서류 없는 원고 승소 0건", "끝까지 함께 간 9건 -- 피고 기록으로 절반 이상 인정"],
      finalTitle: "나눈 이유, 나뉜 뒤",
      finalText: "재판장이 기록을 덮기 직전, 원고석 아래에서 이민서가 노트북을 무릎에 올립니다. 38건의 표 맨 아래에 오늘 날짜로 한 줄이 더 생겼습니다. 나뉜 쪽 열네 건, 함께 간 쪽 아홉 건. 서른아홉 번째 줄은 칸만 그어 두었습니다. 그가 화면을 당신 쪽으로 조금 기울입니다. '판결문엔 나눈 이유만 남고 나뉜 뒤는 안 남아요. 뒷줄에 앉은 212명이 다음 기일에도 저 자리에 있을지, 이 표가 아는 건 거기까지예요.'",
      finalMemo: ["나뉜 14건 -- 서류 없는 원고 승소 0건", "함께 간 9건 -- 피고 기록으로 절반 이상 인정", "원고 1,740명 중 서류 없는 212명"],
      routeChoices: [
        {
          id: "c38_route_system_publish",
          label: "판결 통계를 원고 전원과 재판부에 함께 낸다",
          effect: { legitimacy: 11, trust: 5, capital: -5, time: -7, fatigue: 4 },
          voice: "나눌지 말지는 알고서 정해야 한다며, 판결 통계를 원고 전원과 재판부에 함께 낸다.",
          echo: "통계가 공개되면 1,528명 중 몇 명이 먼저 전화를 겁니다. '우리도 나누면 안 되는 거죠?'",
          cognition: { inference: 2, persistence: 1 },
        },
        {
          id: "c38_route_system_shift",
          label: "피고가 가진 기록을 받아 내는 쪽으로 싸움을 옮긴다",
          effect: { legitimacy: 9, trust: 3, capital: -3, time: -6, humanCost: 2, fatigue: 6 },
          voice: "함께 간 아홉 건이 이긴 길이 그것이라서, 피고가 가진 기록을 받아 내는 쪽으로 싸움을 옮긴다.",
          echo: "싸움을 옮기면 증명할 책임이 조금 피고 쪽으로 기웁니다. 그만큼 재판은 길어집니다.",
          cognition: { reframing: 2 },
        },
        {
          id: "c38_route_system_drop",
          label: "통계는 참고만 하고 재판 일정대로 간다",
          effect: { time: 6, capital: 7, trust: -6, legitimacy: -6, humanCost: 4, fatigue: -4 },
          voice: "남의 재판 숫자로 오늘을 흔들 수는 없다며, 통계는 참고만 하고 재판 일정대로 간다.",
          echo: "일정은 지켜집니다. 38건의 표는 이민서의 노트북 안에만 남습니다.",
          cognition: { risk: 2 },
        },
      ],
    },
    finalChoices: [
      {
        id: "a",
        label: "나누더라도 212명 부분을 먼저 선고하라는 조건을 건다",
        effect: { legitimacy: 11, trust: 7, capital: -6, humanCost: -4, time: -3, fatigue: 6 },
        voice: "나뉜 뒤가 판결문에 남아야 한다며, 나누더라도 212명 부분을 먼저 선고하라는 조건을 건다.",
        echo: "조건을 걸면 재판부가 처음으로 212명 부분의 기일을 따로 잡습니다. 피고는 그 조건이 전례가 없다고 이의를 냅니다.",
        cognition: { reframing: 3 },
      },
      {
        id: "b",
        label: "분리에 동의하고 조정 금액만 올린다",
        effect: { capital: 9, time: 7, trust: -5, legitimacy: -8, humanCost: 5, fatigue: -4 },
        voice: "받을 수 있는 쪽이라도 확실히 받자며, 분리에 동의하고 조정 금액만 올린다.",
        echo: "금액이 오르면 1,528명의 얼굴이 밝아집니다. 212명의 사건은 조정 조서 어디에도 없습니다.",
        cognition: { risk: 2 },
      },
      {
        id: "c",
        label: "212명의 소송 비용을 대는 기금을 1,528명과 함께 만든다",
        effect: { trust: 10, legitimacy: 6, capital: -8, time: -6, humanCost: -2, fatigue: 7 },
        voice: "뒷줄에 앉은 사람들이 다음 기일에도 그 자리에 있게, 212명의 소송 비용을 대는 기금을 1,528명과 함께 만든다.",
        echo: "기금이 생기면 1,528명이 자기 몫에서 조금씩 떼어 212명의 재판을 댑니다. 누구도 그 칸을 강요하지 않았습니다.",
        cognition: { persistence: 2 },
      },
    ],
  },
  evidencePlan: {
    node: "c38_evidence_turn",
    result: "c38_aftershock",
    sourceRoutes: ["c38_gallery", "c38_witness", "c38_plaintiff", "c38_route_system"],
    requiredAuthority: "FIELD ACCESS",
    entryVoice: "피고가 '없다'고 한 212명의 서류를 단서의 상자 번호에서 거꾸로 밟아, 정말 없는 것인지 따진다.",
    entryEcho: "상자 번호를 거꾸로 밟으면 서류가 없는 것과 가진 쪽이 내놓지 않는 것이 갈립니다.",
    entryLabel: "피고가 없다고 한 212명의 서류가 든 상자를 찾는다",
    title: "없다던 212장",
    speaker: "반재욱",
    text: "단서를 212명의 명단과 포개자 6월 압수수색(법원의 허락을 받아 자료와 물건을 강제로 가져가는 수사) 때 반재욱이 수사관 옆에서 받아 적어 둔 상자 목록이 열립니다. 상자 118번, 문서 제목은 '2023-0412 연계 명세'. 하도급(큰 건설사가 맡은 공사를 작은 업체에 다시 나눠 맡기는 것) 업체에 준 돈과 보증을 적은 것으로, 건수는 212건입니다. 오늘 법정에서 '대출과 이어진 서류가 한 장도 없다'던 바로 그 사람들의 명세를, 그룹은 3년 전에 이미 만들어 두었습니다. 작성 부서는 KD은행 기업금융전략팀. 반재욱이 수첩을 덮습니다. '서류가 없는 게 아니었어요. 서류를 가진 쪽이 피고석에 앉아 있었던 거죠.'",
    memo: ["검찰 보관 상자 118번", "'2023-0412 연계 하도급·보증 명세' 212건", "작성: KD은행 기업금융전략팀, 3년 전"],
    triggers: ["injustice", "system", "order"],
    entryEffect: { legitimacy: 6, trust: 2, time: -3, capital: -3, fatigue: 3 },
    choices: [
      {
        id: "c38_evidence_turn_request",
        label: "검찰 기록을 법원으로 보내 달라는 신청을 오늘 바로 낸다",
        effect: { legitimacy: 13, trust: 4, capital: -4, time: -6, fatigue: 5 },
        voice: "'없다'는 말을 하루라도 빨리 꺾으려고, 검찰 기록을 법원으로 보내 달라는 신청을 오늘 바로 낸다.",
        echo: "신청은 오늘 접수됩니다. 검찰이 기록을 보내 주기까지 한 달, 그동안 피고는 '없다'는 말을 거두지 않습니다.",
        cognition: { inference: 2, persistence: 1 },
      },
      {
        id: "c38_evidence_turn_tell",
        label: "상자 118번 이야기를 원고 212명에게 먼저 전한다",
        effect: { trust: 12, legitimacy: 5, capital: -5, humanCost: -6, fatigue: 7 },
        voice: "서류가 없다는 말을 제일 오래 들은 사람들이라, 상자 118번 이야기를 원고 212명에게 먼저 전한다.",
        echo: "전해 들은 212명 중 한 할머니가 '그럼 나도 피해자네요'라고 합니다. 작년 번호표 38번의 그 목소리입니다.",
        cognition: { reframing: 2 },
      },
      {
        id: "c38_evidence_turn_wait",
        label: "다음 기일까지 아껴 두고 피고가 다시 '없다'고 말하게 둔다",
        effect: { capital: 8, time: 5, legitimacy: 3, trust: -5, humanCost: 5, fatigue: -3 },
        voice: "법정에서 한 번 더 말하면 빠져나갈 길이 없다며, 다음 기일까지 아껴 두고 피고가 다시 '없다'고 말하게 둔다.",
        echo: "아껴 두면 다음 기일에 피고 측 변호사 연서준은 같은 문장을 반복할 것입니다. 그때까지 212명은 서류 없는 사람으로 남습니다.",
        cognition: { risk: 2 },
      },
    ],
  },
  memoryPlan: {
    systemNext: "c38_route_system",
    evidenceNext: "c38_evidence_turn",
    systemLabel: "데이터센터에서 새로 짠 판이 그룹 쪽 서면의 첨부에 끼어 있는지 넘겨 본다",
    evidenceLabel: "정렬된 유출의 증인 순서를 피고가 없다고 한 서류 목록 곁에 편다",
    systemEcho: "첨부 17번까지 넘겨도 당신의 판은 없고 당신의 망설임만 있습니다. 이민서가 서면이 떼어 내려는 212명 쪽으로 표를 돌립니다.",
    evidenceEcho: "증인 순서를 곁에 펴면 저쪽은 누가 무엇을 가졌는지 먼저 알고 있었습니다. 없다던 서류의 목록에도 상자 번호가 달려 있습니다.",
  },
  openingRoutes: {
    c37_after_warm: "c38_start_warm",
    c37_after_record: "c38_start_record",
    c37_after_rush: "c38_start_rush",
  },
  openingCopy: {
    c38_start_warm: ["셔터를 올린 사람들의 재판", "도윤하", "사흘 밤 동안 당신은 헌책방 1층에서 열세 명의 단체방을 함께 지켰습니다. 셔터가 올라갈 때 아홉 명이 남아 있었고, 누구도 먼저 가지 않았습니다. 그로부터 이레 뒤인 8월 6일 새벽, 집단소송(피해자 여럿이 함께 내는 소송)의 첫 변론(법정에서 양쪽이 주장과 증거를 내는 절차) 날입니다. 그룹 쪽 준비서면(재판 전에 주장을 정리해 법원에 내는 서면) 첨부 17번은 그 사흘 밤 같이 읽은 바로 그 파일입니다. 도윤하가 단체방에 떡집 주소를 올립니다. '방청석이 72석이래요. 우리 중에 몇 명 가요?' 1분 만에 답이 아홉 개 달립니다.", ["첨부 17번: 사흘 밤 같이 읽은 유출 파일", "첫 변론 오늘 14시, 457호 법정", "단체방 아홉 명 방청 신청"]],
    c38_start_record: ["대조표를 낸 사람의 재판", "이민서", "유출본과 원본이 한 글자도 다르지 않다는 대조표와 파일이 만들어진 경위를, 당신은 법원 제출 문서로 남겼습니다. 오늘은 집단소송(피해자 여럿이 함께 내는 소송)의 첫 변론(법정에서 양쪽이 주장과 증거를 내는 절차) 날입니다. 어젯밤 들어온 그룹 쪽 준비서면(재판 전에 주장을 정리해 법원에 내는 서면)이 그 대조표를 인용합니다. '원고 측 증인이 스스로 진본이라 확인한 자료에 따르면, 증인은 압박을 받으면 판단을 바꾸는 사람이다.' 기록을 지키려고 낸 문서가, 그 기록으로 당신을 겨누는 근거가 됐습니다.", ["준비서면에 당신이 낸 원본 대조표 접수번호 인용", "첨부 17번: 유출된 반응 기록", "첫 변론 오늘 14시, 457호 법정"]],
    c38_start_rush: ["먼저 달려간 사람의 재판", "선재윤", "문가을의 문자를 받자마자 당신은 잠든 동료들을 두고 공익 변호사 선재윤의 망원동 사무실로 갔습니다. 이레 동안 둘이서 증인 신문 문답 90개를 만들었습니다. 그리고 집단소송(피해자 여럿이 함께 내는 소송)의 첫 변론(법정에서 양쪽이 주장과 증거를 내는 절차) 전날 밤 11시, 그룹 쪽 준비서면(재판 전에 주장을 정리해 법원에 내는 서면)이 들어왔습니다. 첨부 17번은 유출된 트리거랩 기록입니다. 90개의 문답 어디에도 그 기록에 대한 대답은 없습니다. 단체방에는 이레째 읽지 않은 메시지가 312개 쌓여 있습니다.", ["증인 신문 문답 90개 -- 유출 기록 대응 0개", "첨부 17번: 유출된 반응 기록", "단체방 안 읽은 메시지 312개"]],
  },
  openingSignatures: {
    c38_start_warm: {
      label: "단체방 아홉 명이 다 같이 방청석 맨 앞줄에 앉기로 한다",
      effect: { trust: 11, humanCost: -4, capital: -2, time: -5, fatigue: 4 },
      cognition: { reframing: 2 },
      voice: "기록이 같이 들어갔으니, 단체방 아홉 명이 다 같이 방청석 맨 앞줄에 앉기로 한다.",
      echo: "아홉이 맨 앞줄에 앉으면 연서준이 첨부 17번을 읽을 때마다 그 얼굴들을 봐야 합니다. 대신 72석 중 아홉 자리가 시장 사람들 몫에서 빠집니다.",
    },
    c38_start_record: {
      label: "진본이라는 것과 믿을 만하다는 것은 다르다는 의견서를 쓴다",
      effect: { legitimacy: 11, trust: -2, capital: -4, time: -5, fatigue: 5 },
      cognition: { inference: 2 },
      voice: "대조표가 나를 겨누는 근거로 쓰이지 않게, 진본이라는 것과 믿을 만하다는 것은 다르다는 의견서를 쓴다.",
      echo: "의견서는 논리로 이깁니다. 기록이 진짜라는 것과 기록을 만든 쪽의 해석이 옳다는 것은 다른 문제니까요. 다만 재판부가 그것을 읽는 날은 오늘이 아니라 다음 기일입니다.",
    },
    c38_start_rush: {
      label: "첨부 17번의 출처부터 밝히라고 재판 시작 전에 요구한다",
      effect: { legitimacy: 8, trust: 5, humanCost: 3, time: -4, fatigue: 5 },
      cognition: { persistence: 2 },
      voice: "문답 90개에 없는 기록이 어디서 왔는지 알아야 해서, 첨부 17번의 출처부터 밝히라고 재판 시작 전에 요구한다.",
      echo: "요구하면 연서준은 웃으며 '적법하게 확보했다'고 합니다. 그 한 문장을 받아 내느라 문가을의 첫 발언이 20분 밀리고, 단체방의 312개는 여전히 읽지 않은 채입니다.",
    },
  },
  characterProfiles: {
    선재윤: {
      role: "원고 측 대리인 · 공익 변호사",
      stance: "원칙 · 체력 · 혼자서도",
      job: "여덟 명의 대형 로펌 변호사를 혼자 상대하며, 1,740명의 이름을 한 소송 안에 붙잡아 둔다.",
      appearance: "바퀴 달린 서류 가방, 모서리가 닳은 법전, 떡가루가 묻은 검은 정장 소매.",
      thought: "소송은 이기는 게 아니라 버티는 일이다. 버티는 동안 아무도 빠지지 않게 하는 게 내 일이다.",
      gesture: "선재윤은 불리한 서면을 읽을 때 쪽수부터 센다. 두꺼울수록 상대가 겁먹었다고 믿는다.",
      voice: "빠르고 건조하게 말하고, 의뢰인 앞에서만 문장을 끝까지 천천히 맺는다.",
      line: "저쪽은 여덟 명이고 저는 한 명이에요. 그래도 원고는 저쪽보다 1,732명 많아요.",
    },
    연서준: {
      role: "피고 측 대리인 · 법무법인 도율 파트너 변호사",
      stance: "정중 · 절차 · 흔들리지 않음",
      job: "그룹의 책임을 서류가 있는 칸 안에 가두고, 칸 밖의 사람을 '감정'이라고 부른다.",
      appearance: "주름 없는 회색 정장, 색이 세 번 바뀌는 넥타이, 한 번도 소리 내지 않는 만년필.",
      thought: "법정은 슬픔을 재는 곳이 아니다. 재지 못하는 것을 재는 척하는 순간 모두가 진다.",
      gesture: "연서준은 가장 아픈 질문 앞에서 '다만'이라고 말하고, 한 박자 쉰다.",
      voice: "목소리를 높이지 않는다. 존댓말이 정확할수록 질문이 날카로워진다.",
      line: "저희는 누구의 슬픔도 다투지 않습니다. 다만 서류는 다툽니다.",
    },
  },
  setting: { place: "망원시장 가을떡방 · 찜기 앞", clock: "8월 6일 · 첫 변론 당일 · 05:40" },
  sceneContext: {
    c38_start: {
      place: "망원시장 가을떡방 · 찜기 앞",
      clock: "8월 6일 · 첫 변론 당일 · 05:40",
      question: "첫 재판 날 새벽, 그룹이 212명을 원고에서 빼고 당신의 망설임 기록을 증거로 냈습니다. 무엇부터 하겠습니까?",
      lead: "재판 날 새벽, 문가을이 방청하러 올 시장 사람들 몫의 떡을 찌자며 당신을 불렀습니다.",
    },
    c38_start_warm: {
      place: "망원시장 가을떡방 · 찜기 앞",
      clock: "8월 6일 · 첫 변론 당일 · 05:50",
      question: "사흘 밤 같이 읽은 파일이 그대로 피고의 첨부 서류가 됐습니다. 그 아홉 명이 오늘 어디에 서겠습니까?",
      lead: "사흘 밤을 같이 넘긴 단체방이 새벽부터 다시 울립니다. 모두 법원에 오겠다고 합니다.",
    },
    c38_start_record: {
      place: "망원시장 가을떡방 · 찜기 앞",
      clock: "8월 6일 · 첫 변론 당일 · 05:45",
      question: "당신이 낸 원본 대조표가 당신을 겨누는 근거로 인용됐습니다. 그 문서를 어떻게 되찾겠습니까?",
      lead: "떡을 찌는 동안 선재윤이 휴대폰으로 그룹 쪽 서면의 한 문단을 보여 줍니다. 당신이 낸 대조표의 접수번호가 있습니다.",
    },
    c38_start_rush: {
      place: "망원시장 가을떡방 · 찜기 앞",
      clock: "8월 6일 · 첫 변론 당일 · 05:35",
      question: "혼자 준비한 90개의 문답에 유출 기록에 대한 대답이 없습니다. 재판 전에 무엇을 요구하겠습니까?",
      lead: "이레 만에 사무실 밖으로 나와 떡집에 도착하니, 단체방 알림이 한꺼번에 울립니다.",
    },
    c38_gallery: {
      place: "서울중앙지방법원 · 457호 법정",
      clock: "첫 변론 · 14:00",
      question: "피고석의 여덟 명이 서류 없는 212명은 원고가 아니라고 합니다. 이 법정에서 212명을 어떻게 세우겠습니까?",
      lead: "떡 상자를 보안 검색대에 맡기고 올라온 457호 법정, 방청석이 벌써 시장 사람들로 가득합니다.",
    },
    c38_notes: {
      place: "서울중앙지방법원 · 457호 법정 방청석",
      clock: "휴정 · 14:50",
      question: "고3의 방청 노트에 대출 서류에 이름이 없는 기술자 세 명이 적혀 있습니다. 이 노트를 어떻게 하겠습니까?",
    },
    c38_notes_reaction: {
      place: "서울중앙지방법원 · 4층 복도",
      clock: "휴정 · 14:57",
      question: "212명을 센 도윤하의 수첩이 '사적 메모'로 불립니다. 이 수첩을 어떻게 쓰겠습니까?",
    },
    c38_witness: {
      place: "서울중앙지방법원 · 457호 법정",
      clock: "첫 변론 · 15:10",
      question: "동의 없이 만든 당신의 반응 기록이 증언의 신빙성을 깎는 데 쓰입니다. 증언대에서 어떻게 답하겠습니까?",
      lead: "원고 측 증인으로 이름이 불립니다. 증언대로 걸어가는 동안 스크린에 첨부 17번이 켜집니다.",
    },
    c38_branch_hallway: {
      place: "서울중앙지방법원 · 4층 복도 자판기 앞",
      clock: "휴정 · 15:40",
      question: "반려 지시를 누구에게 받았는지 적을 줄이 비어 있습니다. 한서윤 곁에서 어떻게 하겠습니까?",
    },
    c38_branch_hallway_follow: {
      place: "서울중앙지방법원 · 4층 복도",
      clock: "휴정 · 15:52",
      question: "유족과 반려에 서명한 사람이 복도에서 처음 마주했습니다. 두 사람을 어떻게 법정으로 돌려보내겠습니까?",
    },
    c38_column: {
      place: "서울중앙지방법원 · 457호 법정 원고석",
      clock: "재개 직전 · 15:58",
      question: "피고가 38만 줄 중 판단을 뒤집은 41줄만 골라 띄웠고 0초 줄은 뺐습니다. 이 사실을 어떻게 쓰겠습니까?",
    },
    c38_column_reaction: {
      place: "서울중앙지방법원 · 4층 복도 창가",
      clock: "재개 직전 · 16:03",
      question: "사람 편을 들어 생각을 바꾼 날이 '흔들림'으로 적혀 있습니다. 그 표를 어떻게 하겠습니까?",
    },
    c38_plaintiff: {
      place: "서울중앙지방법원 · 457호 법정",
      clock: "첫 변론 · 16:20",
      question: "원고 대표가 준비한 진술서를 접고 남편 이야기를 하다 목소리가 끊겼습니다. 어떻게 하겠습니까?",
      lead: "원고 대표 문가을의 이름이 불리고, 앞치마를 벗어 개어 둔 그가 증언대로 나갑니다.",
    },
    c38_door: {
      place: "서울중앙지방법원 · 4층 복도 문 옆",
      clock: "첫 변론 · 16:45",
      question: "자리가 없어 법정 밖에 남은 열다섯 명이 문틈으로만 재판을 듣고 있습니다. 어떻게 하겠습니까?",
    },
    c38_door_reaction: {
      place: "서울중앙지방법원 · 1층 로비 보안 검색대",
      clock: "첫 변론 · 17:05",
      question: "세 시간째 떡 상자를 지킨 강태민과 경위가 친구가 됐습니다. 이 상자들을 어떻게 하겠습니까?",
    },
    c38_route_system: {
      place: "서울중앙지방법원 · 4층 복도 벤치",
      clock: "첫 변론 · 휴정 중",
      question: "나뉜 사건에서 서류 없는 원고가 이긴 적이 한 번도 없습니다. 이 표를 어떻게 하겠습니까?",
    },
    c38_final_system_route: {
      place: "서울중앙지방법원 · 457호 법정 원고석",
      clock: "변론 종결 직전",
      question: "판결문에는 나눈 이유만 남습니다. 나뉜 뒤의 212명을 기록에 남기려면 어떤 조건을 달겠습니까?",
    },
    c38_evidence_turn: {
      place: "서울중앙지방법원 · 4층 복도 창가",
      clock: "첫 변론 · 17:20",
      question: "피고가 없다던 212명의 명세가 검찰 상자 118번에 있습니다. 이 사실을 언제 누구에게 꺼내겠습니까?",
    },
    c38_final: {
      place: "서울중앙지방법원 · 457호 법정",
      clock: "변론 종결 직전 · 17:40",
      question: "재판을 둘로 나누면 1,528명은 올해 판결을 받습니다. 1,740명을 나누겠습니까?",
      lead: "마지막 의견 진술이 끝나고 재판장이 안경을 벗습니다. 법정 시계가 5시 40분을 가리킵니다.",
    },
    c38_aftershock: {
      place: "서울중앙지방법원 · 정문 앞 도로",
      clock: "폭염 경보 · 18:30",
      question: "떡 상자를 돌려받는 저녁, 그룹 쪽 변호사가 내일 밤 다큐를 두고 웃고 갔다는 말을 듣습니다. 이 저녁을 어떻게 닫겠습니까?",
    },
  },
  clue: {
    id: "c38-box-118",
    title: "상자 118번",
    text: "피고가 '서류가 한 장도 없다'던 212명의 하도급·보증 명세가 3년 전 KD은행 기업금융전략팀에서 이미 만들어져, 지금은 검찰 보관 상자 118번에 들어 있습니다.",
  },
  outcomes: {
    c38_after_warm: { tag: "곁에 남은 결말", title: "원고들이 흩어질 때까지 법원 계단에 남았다", text: "첫 변론이 끝난 저녁, 마지막 원고가 버스에 오를 때까지 문가을 곁에 있었습니다. 헤어지며 문가을이 떡 한 봉지를 당신 가방에 넣었습니다." },
    c38_after_record: { tag: "기록을 넘긴 결말", title: "증언 요지와 방청 기록 23쪽이 문서가 됐다", text: "오늘 법정에서 오간 말을 문서로 정리해 원고 대리인단과 리드라인에 넘겼습니다. 법정에 못 온 원고들도 자기 재판을 처음으로 읽었습니다." },
    c38_after_rush: { tag: "먼저 달려간 결말", title: "원고들을 두고 그룹 측 변호사를 따라잡았다", text: "다큐를 두고 무엇을 준비하느냐고 묻자 그는 대답 대신 웃기만 했습니다. 법원 계단에는 당신 몫의 떡 상자가 남았습니다." },
  },
  carryovers: {
    c38_after_warm: { trust: 9, humanCost: -3, fatigue: -6 },
    c38_after_record: { legitimacy: 11, trust: 4, fatigue: 4 },
    c38_after_rush: { capital: 6, legitimacy: 6, trust: -8 },
  },
  continuityChallenges: {
    c37_after_warm: { id: "protect-trust", title: "사흘 밤을 지킨 사람들과 같이 서기", text: "헌책방 1층에서 같이 읽은 파일이 피고의 증거가 됐습니다. 그 아홉 명을 증인석에 혼자 세우지 않아야 믿음이 법정까지 갑니다." },
    c37_after_record: { id: "use-reframe", title: "나를 겨눈 대조표 되찾기", text: "당신이 낸 원본 대조표가 당신의 흠을 증명하는 근거로 인용됐습니다. 기록이 진짜라는 것과 그 해석이 옳다는 것은 다릅니다. 판을 다시 짜면 그 둘이 갈라집니다." },
    c37_after_rush: { id: "repair-legitimacy", title: "혼자 준비한 이레의 빈칸 메우기", text: "동료들을 두고 달려간 이레는 유출 기록에 대한 대답을 남기지 못했습니다. 그 빈칸은 법정의 절차를 밟아 메워야 공정함으로 셈해집니다." },
  },
};
