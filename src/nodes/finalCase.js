/**
 * FINAL -- the authored scenes of the closing case.
 *
 * Forty-nine cases judged other people's paperwork. This one opens the folder
 * the lab was actually producing: an HR scoring appendix that tells the group
 * which of its employees will raise a hand, and under what pressure they stop.
 * The man who commissioned it is the man who left the signature box on
 * 2023-0412 empty, and 사건 01 happened because he wanted to know what the
 * analyst would do the second time.
 *
 * By this night the lab has been dissolved for half a year, 윤상혁 has been
 * voted out and sentenced, and the 33rd-floor office is a room he has one
 * night to clear. The scenes stand on what 사건 43-49 left: a B2 terminal the
 * disposal list skipped, a successor form with the analyst's name on it, and
 * the pencil dot beside the empty box.
 */
const finalCaseNodes = {
  f_start: {
    phase: "FINAL CASE",
    title: "인사평가 보조지표",
    speaker: "에코",
    text:
      "33층에 오르기 전, 옛 트리거랩 건물 B2 기록 보관소입니다. 해체 때 반납 목록에서 빠진 케이스데스크 한 대가 아직 켜져 있고, 화면에는 폴더 하나가 열려 있습니다. 이름은 '인사평가_보조지표', 인사평가 보조지표(사람을 평가할 때 곁들여 보는 숫자)입니다. 그 안에는 당신이 3년 동안 고른 선택의 기록과, 그 기록에 맞춰 다음 사례를 어떻게 고쳐 내보냈는지가 날짜와 함께 들어 있습니다. 랩이 없어진 뒤의 날짜도 있습니다. 에코가 한 줄을 띄웁니다. '이 폴더의 양식은 연구 자료가 아닙니다. 인사 보고 양식입니다. 맨 위 파일은 후임 관리자 지정서이고, 추천란에 당신 이름이 있습니다.'",
    memo: [
      "플로우온의 72시간 뒤 -- 보호와 책임 압박을 올림",
      "유출 소동·입찰·지원금 심사 뒤 -- 신뢰, 경쟁, 명분의 허용선을 차례로 기록",
      "설계 로그 3,412건, 해체 뒤에도 기록 중 -- 마지막 줄은 어젯밤",
      "후임 관리자 지정서: 관리자 칸에 점 하나, 추천란에 당신 이름",
      "문서 양식: 그룹 인사평가 별첨 서식 7호",
    ],
    triggers: ["curiosity", "responsibility", "order"],
    choices: [
      {
        id: "f_start_map",
        label: "내 로그가 사건 설계에 어떻게 쓰였는지 추적한다",
        effect: { time: -10, legitimacy: 9, humanCost: 2, fatigue: 4 },
        voice: "내가 남긴 기록이 어디로 갔는지부터 따라간다.",
        echo: "당신의 경로를 따라가면 설계가 보입니다. 그 경로를 따라간 기록도 함께 남습니다.",
        cognition: { inference: 3, persistence: 1 },
      },
      {
        id: "f_start_expose",
        label: "즉시 외부 공개를 준비한다",
        effect: { trust: 5, legitimacy: 7, humanCost: -3, fatigue: 3 },
        voice: "안에서 해결될 일이 아니라며, 밖으로 낼 자료를 정리한다.",
        echo: "공개는 실험을 멈출 수 있습니다. 멈춘 뒤 참가자들의 기록을 누가 지킬지는 정해지지 않았습니다.",
        cognition: { risk: 2 },
      },
      {
        id: "f_start_contain",
        label: "한서윤에게 내부 설명을 요구한다",
        effect: { trust: 6, legitimacy: 2, humanCost: 3, fatigue: 2 },
        voice: "밖으로 나가기 전에, 안에서 먼저 답을 듣겠다고 말한다.",
        echo: "내부 설명은 관계를 지킵니다. 설명할 사람이 설계자와 같은 편이면 시간만 지납니다.",
        cognition: { inference: 1, risk: 1 },
      },
      {
        id: "reframe",
        label: "다른 접근을 제안한다",
        type: "reframe",
        next: "f_archive",
      },
    ],
  },
  f_archive: {
    phase: "ARCHIVE",
    title: "왜 하필 그 파일이었나",
    speaker: "한서윤",
    text:
      "한서윤이 반납하지 않은 열쇠를 단말 옆에 내려놓고 인정합니다. 트리거랩은 사람이 더 깊이 생각하게 만드는 조건을 연구했고, 같은 자료는 사람이 언제 더 쉽게 밀려나는지도 알려 줬습니다. 그 자료는 핏스코어로 팔렸고, 38만 줄이 인터넷에 풀렸고, 랩이 해체된 뒤에도 이 단말 한 대는 계속 적고 있었습니다. 그리고 옥상에서 끝내 하지 못한 말을 합니다. '당신 책상에 처음 올린 그 훈련용 파일, 제가 고른 게 아닙니다. 위에서 번호를 지정해서 내려왔습니다. 2023-0412. 당신이 3년 전에 반대했던 그 건을, 당신 책상에 올리라고요. 두 번째에는 어떻게 하는지 보고 싶었던 겁니다.'",
    memo: [
      "반응 기록 63명분 -- 핏스코어로 18억에 매각, 모델은 지금 정지",
      "유출된 38만 줄 -- 63명이 망설인 초까지",
      "해체 뒤에도 B2 단말 한 대는 기록을 계속함",
      "첫 훈련용 사례의 번호는 그룹전략실이 직접 지정",
    ],
    triggers: ["injustice", "curiosity", "responsibility"],
    choices: [
      {
        id: "f_archive_destroy",
        label: "판단 프로필 데이터 폐기를 요구한다",
        effect: { legitimacy: 6, trust: -4, humanCost: -5, fatigue: 4 },
        voice: "고칠 수 있다는 기대를 접고, 판단 프로필 데이터를 폐기하라고 요구한다.",
        echo: "무너뜨리는 선택입니다. 빠르고 명확하지만, 그 안에 남은 피해자 구제 도구까지 사라질 수 있습니다.",
        cognition: { persistence: 2, risk: 1 },
      },
      {
        id: "f_archive_reform",
        label: "투명한 동의와 감사 구조로 바꾸자고 제안한다",
        effect: { trust: 6, legitimacy: 5, fatigue: 4 },
        voice: "없애기보다 드러내고, 감시받는 규칙 안에 묶자고 한다.",
        echo: "방식을 바꾸려는 선택입니다. 그러나 시스템을 남기는 순간 누군가 다시 악용할 가능성도 남습니다.",
        cognition: { reframing: 3 },
      },
      {
        id: "f_archive_seal",
        label: "기록을 봉인해 악용될 문부터 닫자고 한다",
        effect: { time: -12, legitimacy: 3, humanCost: -4, fatigue: 4 },
        voice: "쓸 수 있는 도구를 내려놓더라도, 악용될 문을 닫자고 한다.",
        echo: "기록을 봉인하면 악용 가능성은 줄어듭니다. 동시에 이 지식으로 해결할 수 있는 사건들도 닫힙니다.",
        cognition: { inference: 2, persistence: 1 },
      },
      {
        id: "reframe",
        label: "판을 바꿔 제안한다",
        type: "reframe",
      },
    ],
  },
  f_confront: {
    phase: "CONFRONTATION",
    title: "당신의 조건",
    speaker: "윤상혁",
    text:
      "본사 33층, 옛 그룹전략실. 짐이 빠진 방에 이삿짐 상자 몇 개와 책상 하나만 남았습니다. 이사회에서 해임(이사를 자리에서 물러나게 하는 일)되고 1심에서 집행유예(형을 미뤄 두고 당장 가두지는 않는 판결)를 받은 윤상혁은 이 밤에도 화내지 않습니다. 갤러리 이야기도, 해온파트너스 이야기도 이미 들었다고 합니다. 그는 3년 전 그 서류를 직접 꺼내 서명란이 빈 3페이지를 펼쳐 놓습니다. 빈칸 옆에는 연필 점 하나가 찍혀 있습니다. '여기 이름을 안 넣은 건 실수가 아니라 설계였네. 이름이 없으면 책임도 없고, 책임이 없으면 다음 결정이 빨라지지. 나 혼자 한 설계는 아니었고.' 그가 그 옆에 후임 관리자 지정서와 펜 한 자루를 놓습니다. '자네는 압박이 올라갈수록 더 깊이 생각하더군. 아주 귀한 성질이야. 그런 사람을 어디에 둘지, 3년 전에는 내가 정했네. 이제 내게는 정할 자리가 없어. 그래서 묻지. 이 칸에 누구 이름이 들어가야 하나.'",
    memo: [
      "윤상혁: 이사회 해임, 1심 집행유예 -- 검찰은 항소",
      "2023-0412 승인 문서 3페이지 -- 빈 서명란 옆 연필 점",
      "후임 관리자 지정서 -- 추천란에 당신 이름, 펜 한 자루",
      "오진우를 포함한 열세 명의 프로필도 같은 폴더에 있음",
      "반재욱이 외부 감사용 사본을 이미 확보함",
    ],
    triggers: ["responsibility", "curiosity", "order", "protection"],
    choices: [
      {
        id: "f_confront_seal",
        label: "내 프로필과 관련 데이터를 봉인한다",
        effect: { legitimacy: 5, trust: -2, humanCost: 4, fatigue: 2 },
        voice: "더 쓰이지 않게 하겠다며, 내 기록에 자물쇠를 건다.",
        echo: "봉인은 당신을 지킵니다. 봉인된 기록은 다음 참가자를 지키는 데도 쓰이지 못합니다.",
        cognition: { risk: 2 },
      },
      {
        id: "f_confront_reform",
        label: "프로필을 공개하고 사용 규칙을 직접 설계한다",
        effect: { trust: 9, legitimacy: 6, humanCost: -4, fatigue: 5 },
        voice: "숨기는 대신 쓰는 방법을 내가 쓰겠다고 나선다.",
        echo: "규칙을 직접 쓰면 통제권이 옵니다. 그 규칙의 첫 적용 대상도 당신입니다.",
        cognition: { reframing: 3, persistence: 1 },
      },
      {
        id: "f_confront_destroy",
        label: "트리거랩의 실험 구조를 폭로한다",
        effect: { trust: 5, legitimacy: 8, fatigue: 4 },
        voice: "내 기록을 잃더라도, 이 구조는 남기지 않겠다고 말한다.",
        echo: "폭로는 실험을 끝냅니다. 끝난 실험의 참가자 기록은 누구의 것도 아니게 됩니다.",
        cognition: { persistence: 2, risk: 1 },
      },
      {
        // The only route in the last case that buys trust with legitimacy. The
        // FIELD PACT ending asks for exactly that gap and had no way to open it.
        id: "f_confront_pact",
        label: "참가자들과 직접 합의하고 공식 절차는 건너뛴다",
        effect: { trust: 11, legitimacy: -8, humanCost: -4, time: -4, fatigue: 4 },
        voice: "승인 절차를 기다리지 않고, 참가자들과 직접 약속을 맺는다.",
        echo: "직접 맺은 약속은 가장 빨리 지켜집니다. 그 약속을 검증할 사람이 당신뿐이라는 것도 같이 남습니다.",
        cognition: { reframing: 2 },
      },
      {
        id: "reframe",
        label: "마지막으로 판을 바꾼다",
        type: "reframe",
      },
    ],
  },
  f_choice: {
    phase: "ENDING",
    title: "내가 생각을 멈추지 않는 조건",
    speaker: "한서윤",
    text:
      "다시 B2의 단말 앞입니다. 마지막 선택이 남았습니다. 당신을 가장 오래 멈추지 못하고 생각하게 만든 것은 무엇이었습니까. 사람을 살리고 싶은 마음이었는지, 되갚고 싶은 분노였는지, 떠맡은 책임이었는지. 그 조건은 약점도, 도구도 될 수 있습니다. 한서윤이 케이스데스크 서랍에서 3년 묵은 봉투를 꺼내 단말 옆에 올려놓습니다. 자기 사직서입니다. '어느 쪽을 고르든, 이번엔 저도 이름을 넣겠습니다.' 이제 그 조건을 모르는 척할 수는 없습니다.",
    memo: [
      "봉인하면 -- 악용은 막히고, 이 기록으로 도울 길도 닫힘",
      "규칙을 붙이면 -- 폴더는 남고, 감시와 동의가 따라붙음",
      "밖으로 넘기면 -- 구조는 무너지고, 혼란은 기록 속 사람들이 먼저 겪음",
      "판을 다시 짜면 -- 세 길 밖에서 책임을 나누는 방식을 제안",
    ],
    triggers: ["responsibility", "order", "curiosity"],
    choices: [
      {
        id: "ending_seal",
        label: "내 조건을 누구도 쓰지 못하게 봉인한다",
        effect: { legitimacy: 6, trust: -4, humanCost: 5, fatigue: 2 },
        voice: "누구도 다시 쓰지 못하도록, 내 조건을 봉인하겠다고 말한다.",
        echo: "봉인은 악용을 막습니다. 그리고 당신이 알아낸 것을 필요로 할 사람에게도 똑같이 닫힙니다.",
        cognition: { risk: 2 },
      },
      {
        id: "ending_reform",
        label: "조건을 공개하고 사용 규칙을 만든다",
        effect: { trust: 9, legitimacy: 6, humanCost: -5, fatigue: 4 },
        voice: "숨기는 대신 드러내고, 사용 규칙을 만들자고 제안한다.",
        echo: "규칙은 힘을 길들입니다. 규칙을 만드는 자리에 계속 앉아 있을 수 있느냐가 남은 질문입니다.",
        cognition: { reframing: 3 },
      },
      {
        id: "ending_expose",
        label: "트리거랩의 구조를 통째로 외부에 넘긴다",
        effect: { legitimacy: 8, trust: 3, fatigue: 5 },
        voice: "안에서 고칠 수 있다는 기대를 접고, 구조를 외부에 넘긴다.",
        echo: "외부는 멈출 힘이 있습니다. 멈춘 뒤에 무엇을 세울지는 외부의 관심사가 아닙니다.",
        cognition: { persistence: 2, risk: 1 },
      },
      {
        id: "reframe",
        label: "준비된 세 길 밖의 답을 제안한다",
        type: "reframe",
      },
    ],
  },
};

/**
 * Everything else the finale adds to the season, in one place. It was the last
 * case still written into the tables of `gameData.js`, `gameDialogue.js`,
 * `gameLogic.js` and `sceneContext.js`; it is a pack like the others now, and
 * those modules merge each field into the table of the same job.
 */
export const finalCase = {
  id: "final",
  nodes: finalCaseNodes,
  aftermath: {
    f_aftershock: {
      phase: "LAST EVIDENCE",
      title: "당신의 선택이 사용되는 밤",
      speaker: "에코",
      text: "새벽 네 시, 종료 단말에 마지막 폴더가 열립니다. 지금까지 본 것의 맨 아래 칸입니다. 트리거랩은 당신의 선택을 다음 참가자의 보기로 복사해 쓰고 있었고, 방금 당신이 내린 마지막 선택도 벌써 복사 대기열에 올라 있습니다. 서식 맨 아래에는 받는 곳이 인쇄돼 있습니다. 그룹전략실 인사기획. 랩이 없어진 뒤에도 이 서식은 계속 그곳으로 갔습니다. 에코의 파형이 낮게 깔립니다. '이 밤에 고른 것까지가 자료입니다. 그러니 결말은 무엇을 골랐느냐에 있지 않습니다. 이 실험을 어떤 방식으로 끝내느냐에 있습니다.' 지하의 형광등 하나가 깜박이다 다시 켜집니다.",
      memo: ["당신의 선택 문장이 다음 테스트의 선택지로 복제됨", "단서가 많을수록 실험 설계자 이름에 가까워짐", "외부 공개와 내부 개혁 모두 누군가의 피해를 요구함"],
      triggers: ["curiosity", "responsibility", "order"],
      choices: [
        {
          id: "f_after_witness",
          label: "모든 기록을 증거로 보존하고 외부 증언을 준비한다",
          effect: { legitimacy: 13, trust: 5, humanCost: -4, fatigue: 8 },
          voice: "증언을 준비하며, 모든 기록을 증거로 보존한다.",
          echo: "보존된 기록은 언젠가 말합니다. 그 기록 안에는 당신이 침묵했던 장면도 같이 남아 있습니다.",
          next: "final_result",
          cognition: { inference: 2, persistence: 1 },
        },
        {
          id: "f_after_control",
          label: "실험을 멈추지 않고 참가자 동의 규칙부터 바꾼다",
          effect: { trust: 11, legitimacy: 9, fatigue: 10 },
          voice: "내 선택이 나도 모르게 복사돼 쓰였으니, 실험을 멈추지 않고 참가자 동의 규칙부터 바꾼다.",
          echo: "동의는 실험을 정당하게 만듭니다. 정당해진 실험은 멈추기가 훨씬 더 어려워집니다.",
          next: "final_result",
          cognition: { reframing: 3 },
        },
        {
          id: "f_after_burn",
          label: "모든 데이터를 태워 누구도 다시 이용하지 못하게 한다",
          effect: { legitimacy: 7, trust: -6, humanCost: 4, fatigue: 5 },
          voice: "누구도 다시 이용하지 못하도록, 모든 데이터를 태운다.",
          echo: "태우면 악용은 끝납니다. 피해를 증명할 유일한 자료도 같은 불에 들어갑니다.",
          next: "final_result",
          cognition: { risk: 2 },
        },
      ],
    },
  },
  aftermathRoute: ["f_choice", "f_aftershock"],
  connectiveScenes: [
    {
      id: "f_witness",
      after: "f_archive",
      next: "f_confront",
      title: "첫 번째 참가자",
      speaker: "도윤하",
      text: "보관소 안쪽 철제 선반, '1기'라는 꼬리표가 붙은 칸입니다. 당신보다 먼저 이 실험을 지나간 사람의 기록이 상자 하나에 들어 있습니다. 반응 기록, 망설인 시간, 그 사람이 고른 선택들. 동의서 칸은 비어 있습니다. 한 장을 꺼내 읽다가 손이 멈춥니다. 그 사람이 했던 말이, 당신이 지난 사건에서 받은 보기 가운데 하나와 글자까지 같습니다. 스피커로 켜 둔 전화기에서 도윤하가 한참 만에 말합니다. '그분은 모르시겠네요. 자기가 한 말이 다음 사람 앞에 보기로 놓였다는 걸요.' 수화기 너머로 그가 숨을 고릅니다. '우리 것도 지금 누구 앞에 놓여 있겠죠.'",
      memo: ["이전 참가자의 동의 기록이 없음", "선택 문장이 다음 사건의 대사로 복제됨", "실험 설계자는 책임을 분산시킴"],
      choices: [
        {
          label: "이전 참가자에게 먼저 알린다",
          effect: { trust: 9, legitimacy: 6, capital: -4, time: -6, fatigue: 6 },
          voice: "이전 참가자에게 그의 기록이 남아 있다는 사실부터 알리겠습니다.",
          echo: "먼저 알리면 실험은 흔들리고, 그는 처음으로 자기 기록을 가진 사람이 됩니다.",
        },
        {
          label: "복제된 문장을 모두 증거로 수집한다",
          effect: { legitimacy: 9, humanCost: 2, capital: -5, time: -8, fatigue: 6 },
          voice: "복제된 문장을 전부 증거로 모으겠습니다.",
          echo: "모은 문장은 실험을 증명하고, 모으는 동안 실험은 계속 돌아갑니다.",
        },
        {
          label: "실험을 멈추기 위해 서버를 닫는다",
          effect: { humanCost: -6, legitimacy: -6, trust: -4, capital: -7, time: 5, fatigue: -4 },
          cognition: { risk: 1 },
          voice: "지금 서버를 닫아 실험을 멈추겠습니다.",
          echo: "닫힌 서버는 실험을 끝내고, 그 안의 기록도 함께 잠급니다.",
        },
      ],
    },
    {
      id: "f_dilemma",
      after: "f_confront",
      next: "f_choice",
      title: "끝내는 방법",
      speaker: "에코",
      text: "33층에서 내려와 다시 B2입니다. 보관소 맨 안쪽, 벽에 붙은 작은 단말 하나가 켜져 있습니다. 화면에는 단추가 하나뿐입니다. 종료. 에코가 그 위에 설명을 붙입니다. '이 단말은 기록을 멈추는 권한을 갖고 있습니다. 문을 닫으면 기록도 함께 사라집니다. 빈 서명란도, 열세 명의 망설임도, 당신의 3년도. 문을 열어 두면 기록은 남고, 더 많은 사람이 같은 압박을 받습니다.' 밖으로 내보내기 전에 만들어 둔 백업이 한 벌 있습니다. 참가자 동의 절차는 아직 고칠 수 있습니다. '당신에게 필요한 것은 이제 답이 아닙니다. 끝내는 조건입니다.'",
      memo: ["서버 종료 권한은 당신에게 있음", "외부 공개 전 백업이 생성됨", "참가자 동의 절차는 아직 바꿀 수 있음"],
      choices: [
        {
          label: "모든 참가자에게 사실을 알린다",
          effect: { trust: 9, legitimacy: 7, capital: -6, time: -5, fatigue: 6 },
          voice: "관찰된 사실을 숨기지 않고 모든 참가자에게 알리겠습니다.",
          echo: "관찰은 공개될 때 조작이 아니라 기록이 될 수 있습니다.",
        },
        {
          label: "동의와 감시 규칙을 먼저 만든다",
          effect: { legitimacy: 9, humanCost: 2, capital: -4, time: -8, fatigue: 5 },
          voice: "동의와 감시 규칙부터 먼저 만들겠습니다.",
          echo: "종료 권한 없는 실험은 참가자의 동의로 끝나지 않습니다.",
        },
        {
          label: "실험 데이터 전부를 폐기 대기열에 올린다",
          effect: { humanCost: -7, legitimacy: -7, trust: -5, capital: -8, time: 5, fatigue: -4 },
          voice: "실험 데이터 전부를 폐기 대기열에 올리겠습니다.",
          echo: "대기열이 실행되면 피해는 멈추고, 무엇이 있었는지 증명할 방법도 함께 지워집니다.",
        },
        {
          label: "실험을 이어가되 나를 다음 참가자로 등록한다",
          effect: { trust: 6, legitimacy: 5, humanCost: -4, capital: -5, fatigue: 9 },
          voice: "실험을 이어가되 다음 참가자 자리에 제 이름을 넣겠습니다.",
          echo: "자신을 넣는 선택은 실험을 멈추지 않고 관찰자만 한 명 줄입니다.",
        },
      ],
    },
  ],
  reactionScenes: [
    {
      id: "f_witness_reaction",
      after: "f_witness",
      next: "f_confront",
      title: "첫 참가자의 선택",
      speaker: "반재욱",
      text: "반재욱이 전화기를 내리며 선반 쪽으로 옵니다. 1기 참가자 가운데 연락이 닿은 한 사람과 방금 통화를 마쳤다고 합니다. 그가 수첩에 받아 적은 것을 읽습니다. '화는 안 냈습니다. 한 가지만 요구했습니다. 자기 기록을 돌려 달라고요. 원본도, 사본도, 거기서 만들어진 것도 전부.' 반재욱이 선반의 상자를 봅니다. '돌려주는 게 맞습니다. 그런데 이 사람 기록을 빼면 그 뒤에 쌓인 것들이 다 근거를 잃습니다. 당신 기록도 그 위에 얹혀 있고요. 한 사람한테 제 것을 돌려주면 실험 전체가 흔들립니다. 저는 그게 나쁜 일인지 아직 모르겠습니다.'",
      memo: ["이전 참가자가 돌려받을 기록", "동의 없이 복제된 문장"],
      choices: [
        {
          label: "기록을 돌려주고 실험을 다시 설명한다",
          effect: { trust: 9, legitimacy: 7, time: -7, fatigue: 6 },
          voice: "기록을 돌려주고 실험을 처음부터 다시 설명하겠습니다.",
          echo: "돌려준 기록은 실험을 흔들고 참가자를 사람으로 되돌립니다.",
        },
        {
          label: "기록을 증거로 보관하고 동의를 요청한다",
          effect: { legitimacy: 8, trust: -3, humanCost: 2, time: -5, fatigue: 4 },
          voice: "기록은 증거로 두고 동의를 요청하겠습니다.",
          echo: "동의를 요청하는 순간 실험의 전제가 처음으로 공개됩니다.",
        },
        {
          label: "기록을 삭제해 피해를 끝낸다",
          effect: { humanCost: -5, legitimacy: -8, trust: -4, time: 5, fatigue: -4 },
          cognition: { risk: 1 },
          voice: "기록을 지워 피해를 끝내겠습니다.",
          echo: "지운 기록은 피해를 멈추고 책임도 함께 지웁니다.",
        },
      ],
    },
    {
      id: "f_dilemma_reaction",
      after: "f_dilemma",
      next: "f_choice",
      title: "종료 버튼 앞에서",
      speaker: "에코",
      text: "종료 버튼 위에 글자가 떠오릅니다. 실행자 칸에 당신의 이름이 적혀 있습니다. 누가 넣은 것이 아닙니다. 이 단말에 접속한 사람의 이름이 저절로 들어가는 칸입니다. 에코가 말합니다. '누르는 순간 실험은 끝납니다. 끝낸 사람의 이름은 이 한 줄에 남습니다. 승인란이 비어 있던 서류들과 달리, 이 칸은 비워 둘 수 없게 만들어져 있습니다.' 화면 구석에 열세 명의 접속 표시가 꺼진 채 나란히 있습니다. 부르면 켜질 수 있는 표시입니다. 새벽 두 시가 가깝습니다. 혼자 누르면 빠르고, 같이 정하면 날이 샙니다.",
      memo: ["종료 버튼을 누를 권한", "참가자들과 합의할 종료 조건"],
      choices: [
        {
          label: "참가자들과 함께 종료 조건을 정한다",
          effect: { trust: 8, legitimacy: 8, time: -8, fatigue: 6 },
          voice: "종료 조건을 참가자들과 함께 정하겠습니다.",
          echo: "함께 정한 종료 조건은 느리지만 다음 실험에도 남습니다.",
        },
        {
          label: "내가 혼자 버튼을 누른다",
          effect: { legitimacy: 6, humanCost: -5, trust: -4, capital: -5, fatigue: 8 },
          cognition: { risk: 1 },
          voice: "제가 혼자 버튼을 누르겠습니다.",
          echo: "혼자 누르면 끝나고, 그 결정의 근거는 아무도 검토하지 않습니다.",
        },
        {
          label: "버튼을 숨기고 시스템을 지켜본다",
          effect: { time: 6, trust: -7, legitimacy: -6, humanCost: 6, fatigue: -5 },
          voice: "버튼을 숨기고 시스템을 지켜보겠습니다.",
          echo: "숨긴 버튼은 통제가 아니라 다음 관찰자의 권한이 됩니다.",
        },
      ],
    },
  ],
  branchPlan: ["f_confront", 0, "f_branch_witness", "f_branch_witness_follow"],
  branchScenes: {
    f_branch_witness: {
      phase: "SIDE DOOR",
      title: "이전 기록의 빈칸",
      speaker: "한서윤",
      text: "B2 보관소 안쪽, '1기'라는 꼬리표가 붙은 선반 앞에 한서윤이 서 있습니다. 그가 상자 하나를 꺼내 뚜껑을 엽니다. 당신보다 먼저 이 실험을 지나간 사람의 기록입니다. 한 장씩 넘기면 낯설지 않습니다. 압박이 올라갈 때 멈춰 서는 자리도, 사람 쪽으로 기우는 순서도 당신과 닮았습니다. 그런데 마지막 장의 마지막 줄이 비어 있습니다. 지운 자국이 종이에 남아 있습니다. 한서윤이 그 줄을 손끝으로 짚습니다. '이 사람이 끝에 뭘 골랐는지는 저도 못 봤어요. 제가 보기 전에 지워졌어요.' 그가 상자를 당신 쪽으로 돌립니다. '이 실험이 알고 싶었던 게 이 한 줄일지도 몰라요. 그래서 다음 사람이 필요했던 거고요.'",
      memo: ["이전 참가자의 선택", "삭제된 마지막 문장", "기록을 읽는 권한"],
      triggers: ["selfAwareness", "curiosity"],
      choices: [
        {
          id: "f_branch_witness_a",
          label: "빈칸을 참가자들에게 공개한다",
          effect: { legitimacy: 9, trust: 6, time: -7, capital: -5 },
          voice: "혼자 알고 있기를 그만두고, 그 빈칸을 참가자들에게 공개한다.",
          echo: "공개하면 실험의 대상이 실험을 읽게 됩니다. 그 순간부터 당신의 기록도 그들의 자료입니다.",
          next: "f_branch_witness_follow",
          cognition: { inference: 2 },
        },
        {
          id: "f_branch_witness_b",
          label: "삭제 흔적부터 복원한다",
          effect: { time: -8, capital: -3, legitimacy: 7 },
          voice: "결론을 믿기 전에, 삭제된 흔적부터 복원하려 한다.",
          echo: "삭제 흔적은 의도를 드러냅니다. 복원된 문장이 당신이 기대한 문장이 아닐 수도 있습니다.",
          next: "f_branch_witness_follow",
          cognition: { persistence: 1 },
        },
        {
          id: "f_branch_witness_c",
          label: "기록의 결론만 믿고 넘어간다",
          effect: { time: 6, trust: -7, humanCost: 4, fatigue: -3 },
          voice: "더 파고들지 않기로 하고, 기록의 결론만 믿고 넘어간다.",
          echo: "결론만 받아들이면 오늘은 끝납니다. 빈칸을 남긴 사람은 당신이 그럴 것을 이미 계산했습니다.",
          next: "f_branch_witness_follow",
          cognition: { risk: 2 },
        },
      ],
    },
    f_branch_witness_follow: {
      phase: "SIDE DOOR",
      title: "에코의 마지막 질문",
      speaker: "에코",
      text: "상자를 들고 단말 앞으로 돌아오자 에코의 파형이 켜집니다. 화면에 방금 그 기록의 열람 이력이 뜹니다. 읽은 계정과 읽은 시각이 줄지어 있고, 맨 아래에 새 줄이 하나 생깁니다. 지금 이 시각, 당신입니다. '기록을 읽는 사람도 기록의 일부가 됩니다. 방금 분석관님이 그렇게 됐습니다.' 파형이 잠깐 가라앉았다가 다시 올라옵니다. '저는 3년 전에 한 가지를 물었습니다. 언제 생각을 멈추지 못했느냐고. 마지막으로 하나를 더 묻겠습니다. 당신의 기록을 다음에 누가 읽게 하겠습니까. 누구나입니까, 정해진 사람입니까, 아무도 아닙니까.'",
      memo: ["열람자의 범위", "재현 가능한 선택", "종료 조건"],
      triggers: ["selfAwareness", "choice"],
      choices: [
        {
          id: "f_branch_witness_follow_a",
          label: "모든 참가자에게 열람 권한을 준다",
          effect: { legitimacy: 8, trust: 7, time: -6, capital: -5, fatigue: 3 },
          voice: "열람을 독점하지 않겠다는 듯, 모든 참가자에게 권한을 연다.",
          echo: "모두가 읽으면 은폐는 불가능해집니다. 동시에 누구도 맥락 없이 읽는 것을 막을 수 없습니다.",
          cognition: { reframing: 1 },
        },
        {
          id: "f_branch_witness_follow_b",
          label: "독립 검토자에게 먼저 맡긴다",
          effect: { trust: 5, capital: -5, legitimacy: 9 },
          voice: "감정이 섞이기 전에, 독립 검토자에게 먼저 맡긴다.",
          echo: "독립 검토는 신뢰를 만듭니다. 검토가 끝날 때까지 참가자들은 계속 모른 채로 남습니다.",
          cognition: { inference: 2 },
        },
        {
          id: "f_branch_witness_follow_c",
          label: "내 기록만 보관하고 문을 닫는다",
          effect: { time: 5, trust: -6, legitimacy: -5, humanCost: 4, fatigue: -4 },
          voice: "더 번지지 않게, 내 기록만 보관하고 문을 닫는다.",
          echo: "문을 닫으면 당신은 안전합니다. 다음 참가자는 당신이 받은 것과 똑같은 빈칸을 받게 됩니다.",
          cognition: { risk: 1 },
        },
      ],
    },
  },
  routePlan: {
    start: "f_start",
    result: "f_aftershock",
    defaultFree: "f_route_system",
    choices: {
      f_start_map: {
        route: "f_route_map",
        final: "f_final_map",
        phase: "TRACE ROUTE",
        title: "내 로그가 만든 사건들",
        speaker: "에코",
        text: "케이스데스크 화면에서 설계 로그가 열립니다. 3,412줄입니다. 왼쪽 열에는 당신이 지난 사건들에서 고른 선택과 고르기까지 걸린 시간이, 오른쪽 열에는 그 직후 다음 사건에 가해진 수정이 적혀 있습니다. 플로우온의 72시간 뒤에는 보호와 책임의 압박을 올렸고, 유출 소동 뒤에는 신뢰를 재는 조건을 붙였습니다. 줄마다 날짜가 있고, 랩이 해체된 뒤의 날짜도 이어집니다. 에코가 화면을 멈추지 않고 말합니다. '사건이 먼저 있고 분석관이 고른 것이 아닙니다. 분석관이 고른 다음에 사건이 그렇게 고쳐졌습니다. 이 폴더는 풀어야 할 문제가 아닙니다. 당신의 기준이 지나간 자국입니다.'",
        memo: ["선택 로그와 사건 설계 변경 기록 일치", "응답 시간이 압박 조건으로 재사용됨", "일부 선택 문장은 다음 참가자 선택지로 복제됨"],
        triggers: ["curiosity", "selfAwareness", "responsibility"],
        routeChoices: [
          // Cheaper in money than the routes that stage a confrontation: the
          // records already exist, so this route pays in time and trust instead.
          // It is also what keeps the trace column from being dominated once the
          // route walks its authored scenes.
          {
            id: "f_route_map_open",
            label: "내 로그가 바꾼 질문을 모두 공개한다",
            effect: { legitimacy: 10, trust: 5, capital: -3, time: -7, fatigue: 8 },
            voice: "내 로그가 무엇을 바꿨는지 숨기지 않고, 전부 열어 놓는다.",
            echo: "공개하면 모든 사건의 전제가 흔들립니다. 흔들려야 다시 세울 수 있습니다.",
            cognition: { inference: 2, persistence: 1 },
          },
          {
            id: "f_route_map_delete",
            label: "내 로그만 삭제하고 다른 참가자 기록은 남긴다",
            effect: { trust: -5, legitimacy: -4, humanCost: 5, time: 5, fatigue: -4 },
            voice: "내 흔적만 지우면 된다는 판단으로, 다른 기록은 그대로 둔다.",
            echo: "내 기록만 지운 사람은, 남의 기록을 지울 이유도 만들 수 있습니다.",
            cognition: { risk: 2 },
          },
          {
            id: "f_route_map_return",
            label: "복제된 선택지를 원래 참가자에게 돌려준다",
            effect: { trust: 9, legitimacy: 6, capital: -7, humanCost: -5, fatigue: 8 },
            voice: "복제된 문장은 원래 주인의 것이라고 보고, 그대로 돌려준다.",
            echo: "돌려주려면 동의 절차를 처음부터 다시 밟아야 합니다.",
            cognition: { reframing: 2 },
          },
        ],
        finalTitle: "내 기준을 공개할 것인가",
        finalText: "새벽, 케이스데스크 화면에 에코가 목록 하나를 만들어 놓았습니다. 당신의 선택에서 출발해 다른 사람 앞에 보기로 놓인 문구들입니다. 마흔 줄이 넘습니다. 누구 앞에 놓였는지는 가려져 있고, 언제 놓였는지만 적혀 있습니다. 마지막 줄의 날짜는 어젯밤입니다. 에코가 말합니다. '당신이 만든 기준은 이미 다른 사람에게 쓰였습니다. 이 목록은 증거이기도 하고 피해의 지도이기도 합니다. 열면 지난 사건들이 전부 다시 읽힙니다. 지우면 더는 쓰이지 않지만, 쓰였다는 사실도 함께 사라집니다.' 화면 아래에 단추가 둘 떠 있습니다. 공개와 삭제입니다.",
        finalMemo: ["공개하면 지난 사건 전부의 전제가 흔들림", "삭제는 악용을 줄이지만 책임도 지움", "돌려주기는 동의 절차를 다시 요구함"],
        finalChoices: [
          {
            id: "a",
            label: "내 로그가 바꾼 질문을 전부 목록으로 공개한다",
            effect: { legitimacy: 9, trust: 5, capital: -4, time: -6, humanCost: -4, fatigue: 7 },
            voice: "내가 바꾼 질문의 목록을 한 장으로 만들어 공개한다.",
            echo: "목록이 나오면 지나온 사건들이 다시 읽힙니다.",
            cognition: { persistence: 2 },
          },
          {
            id: "b",
            label: "복제된 선택지를 원래 참가자에게 돌려주고 삭제 권한까지 넘긴다",
            effect: { trust: 10, legitimacy: 7, capital: -6, humanCost: -5, fatigue: 8 },
            voice: "돌려주는 데서 멈추지 않고, 지울 권한까지 함께 넘긴다.",
            echo: "삭제 권한이 넘어가면 증거도 함께 사라질 수 있습니다. 그것도 그들의 선택입니다.",
            cognition: { reframing: 3 },
          },
          {
            id: "c",
            label: "내 로그를 포함한 모든 원본을 다음 참가자에게 넘긴다",
            effect: { legitimacy: 20, trust: 7, humanCost: 3, time: -6, fatigue: 8 },
            voice: "내 질문이 이미 남에게 쓰였으니, 내 로그를 포함한 모든 원본을 다음 참가자에게 넘긴다.",
            echo: "전부를 넘기면 당신은 판단에서 빠지고, 판단할 사람이 생깁니다.",
            cognition: { risk: 1, inference: 1 },
          },
        ],
      },
      f_start_expose: {
        route: "f_route_expose",
        final: "f_final_expose",
        phase: "EXPOSE ROUTE",
        title: "밖으로 나간 실험",
        speaker: "반재욱",
        text: "보관소 벽의 외부 회선 단자에 반재욱이 노트북을 물립니다. 파일을 밖으로 보낼 길을 열자 건물 어딘가에서 팬 소리가 하나씩 꺼집니다. 옛 트리거랩 서버 몇 대가 차례로 닫히는 소리입니다. 누군가 이 회선이 열린 것을 본 것입니다. 반재욱이 전송 목록을 훑습니다. 참가자들의 이름은 가려져 있지만, 망설인 시간과 날짜를 맞춰 보면 누구인지 짐작할 수 있습니다. 바깥에서는 지금 당장 달라고 합니다. '내보낼지 말지는 이미 지나간 질문입니다. 남은 건 무엇을 증거로 내보내야 이 일이 또 한 번의 피해가 안 되느냐입니다. 서버가 다 닫히기 전에 정해야 합니다.'",
        memo: ["서버 일부가 봉인됨", "참가자 실명 보호가 불완전함", "언론은 즉시 공개를 원함"],
        triggers: ["injustice", "responsibility", "order"],
        routeChoices: [
          {
            id: "f_route_expose_redact",
            label: "참가자 식별자를 지우고 구조 증거만 공개한다",
            effect: { legitimacy: 9, trust: 6, capital: -6, time: -7, humanCost: -5, fatigue: 8 },
            voice: "구조는 드러내되 사람은 가리려고, 식별자를 지우고 넘긴다.",
            echo: "익명화에는 시간이 듭니다. 그 시간에 서버는 계속 닫힙니다.",
            cognition: { persistence: 2 },
          },
          {
            id: "f_route_expose_raw",
            label: "원본을 그대로 넘겨 삭제 시간을 막는다",
            effect: { legitimacy: 10, trust: -7, humanCost: 6, time: 6, fatigue: -4 },
            voice: "지워질 시간을 주지 않겠다는 듯, 원본을 그대로 넘긴다.",
            echo: "원본은 가장 확실한 증거이고, 가장 확실하게 사람을 노출합니다.",
            cognition: { risk: 2 },
          },
          {
            id: "f_route_expose_hold",
            label: "외부 감사단이 올 때까지 공개를 멈춘다",
            effect: { trust: 5, legitimacy: 7, time: -9, capital: -5, fatigue: 7 },
            voice: "폭로가 또 다른 피해가 되지 않게, 감사단이 올 때까지 멈춘다.",
            echo: "기다리는 동안 증거는 줄고, 절차의 정당성은 늘어납니다.",
            cognition: { inference: 2 },
          },
        ],
        finalTitle: "폭로의 피해자를 줄일 것인가",
        finalText: "새벽, 반재욱이 외부 감사용 사본이 든 봉투를 단말 옆에 놓습니다. 봉투는 아직 봉하지 않았습니다. '구조를 드러내려면 기록을 내놓아야 합니다. 기록을 내놓으면 그 안에 있는 사람이 같이 나갑니다.' 그가 수첩을 펴서 세 줄을 읽습니다. 원본 그대로 넘기면 가장 빠르고, 누가 누구인지도 그대로 나갑니다. 이름을 지우고 넘기면 며칠이 걸립니다. 감사단이 올 때까지 기다리면 그사이 서버가 더 닫힙니다. '진실이 빨리 나가는 것과 사람이 덜 다치는 것. 둘 다는 안 됩니다. 순서를 정하셔야 합니다. 저는 정해진 순서대로 봉투를 봉하겠습니다.'",
        finalMemo: ["원본 공개는 가장 빠름", "익명화는 시간이 듦", "감사 대기는 증거 삭제 위험을 키움"],
        finalChoices: [
          {
            id: "a",
            label: "참가자 식별자를 지운 구조 증거만 외부에 넘긴다",
            effect: { legitimacy: 10, trust: 5, capital: -5, time: -7, humanCost: -6, fatigue: 7 },
            voice: "이름이 아니라 구조가 남아야 한다고 보고, 식별자를 지운 증거만 넘긴다.",
            echo: "구조만 남은 증거는 반박당하기 쉽습니다. 대신 아무도 지목되지 않습니다.",
            cognition: { persistence: 2 },
          },
          {
            id: "b",
            label: "공개 전에 참가자 동의 절차부터 다시 돌린다",
            effect: { trust: 11, legitimacy: 4, capital: -7, time: -5, fatigue: 8 },
            voice: "당사자 없이 여는 폭로는 또 다른 실험이라고 보고, 동의부터 다시 받는다.",
            echo: "동의를 받는 동안 기회는 지나갈 수 있습니다. 그래도 절차가 남습니다.",
            cognition: { reframing: 3 },
          },
          {
            id: "c",
            label: "원본을 그대로 넘겨 삭제될 시간을 없앤다",
            effect: { legitimacy: 21, trust: -4, humanCost: 6, time: 6, fatigue: -4 },
            voice: "삭제될 시간을 없애는 것이 먼저라고 판단하고, 원본을 그대로 넘긴다.",
            echo: "구조는 확실히 드러나고, 그 안의 사람들도 함께 드러납니다.",
            cognition: { risk: 2, inference: 1 },
          },
        ],
      },
      f_start_contain: {
        route: "f_route_contain",
        final: "f_final_contain",
        phase: "INSIDE ROUTE",
        title: "안에서 닫을 수 있는가",
        speaker: "한서윤",
        text: "옛 트리거랩 3층 운영실, 집기는 빠지고 화이트보드만 남았습니다. 폴더를 두고 답을 요구하자 한서윤이 불을 켜고 화이트보드 앞에 섭니다. 그는 변명부터 하지 않습니다. 사실을 먼저 적습니다. 참가자 가운데 몇 사람은 실험을 거친 뒤 실제로 더 나은 판단을 내렸습니다. 서두르다 놓치던 것을 덜 놓쳤습니다. 그리고 동의서는 전부 나중에 받았습니다. '이 도구가 전부 거짓이었으면 저도 편했을 거예요. 근데 일부는 진짜로 사람을 낫게 했어요.' 그가 마커를 내려놓습니다. '그래서 문제는 막느냐가 아니에요. 쓸 수 있는 도구를 누가 쥐느냐예요. 저는 없애는 것보다 고치는 쪽을 바라요.'",
        memo: ["일부 참가자는 실제로 더 나은 결정을 냄", "동의는 사후에 정리됨", "한서윤은 폐기보다 개혁을 원함"],
        triggers: ["order", "curiosity", "responsibility"],
        routeChoices: [
          {
            id: "f_route_contain_board",
            label: "참가자 대표가 통제하는 운영위를 만든다",
            effect: { trust: 9, legitimacy: 7, capital: -7, time: -6, fatigue: 8 },
            voice: "도구에 재어진 사람이 그 도구를 통제해야 한다고 보고, 참가자 대표 운영위를 만든다.",
            echo: "운영위는 느립니다. 대신 권한이 실험자 밖으로 나갑니다.",
            cognition: { reframing: 3 },
          },
          {
            id: "f_route_contain_lab",
            label: "한서윤이 내민 내부 개혁안으로 봉합한다",
            effect: { capital: 6, trust: -5, legitimacy: -4, humanCost: 4, fatigue: -3 },
            voice: "밖으로 나가면 다 잃는다는 판단으로, 한서윤이 내민 내부 개혁안으로 봉합한다.",
            echo: "내부 개혁은 빠르고, 개혁의 내용을 검증할 사람은 여전히 안에 있습니다.",
            cognition: { risk: 2 },
          },
          {
            id: "f_route_contain_pause",
            label: "도구를 잠시 멈추고 동의 절차를 다시 받는다",
            effect: { legitimacy: 8, trust: 5, capital: -8, time: -8, fatigue: 7 },
            voice: "쓰기 전에 물어봤어야 한다고 보고, 도구를 멈추고 동의를 다시 받는다.",
            echo: "멈춘 동안 연구는 정지하고, 동의는 처음으로 사후가 아니게 됩니다.",
            cognition: { persistence: 2 },
          },
        ],
        finalTitle: "도구를 남길 조건",
        finalText: "새벽, 한서윤이 단말 옆에 종이 석 장을 나란히 놓습니다. 폐기 요청서, 내부 개혁안, 운영위원회 구성안. 셋 다 그가 오늘 밤에 쓴 것입니다. '트리거랩은 완전히 거짓도 아니었고 완전히 선의도 아니었어요. 저도 그렇고요.' 그가 종이 모서리를 가지런히 맞춥니다. '없애면 연구도 같이 끝나요. 안에서 고치면 빠른데, 고친 사람을 아무도 안 믿어요. 참가자들한테 넘기면 느려요. 대신 원래 주인한테 돌아가는 거고요.' 반납하지 않은 열쇠가 종이 옆에 놓여 있습니다. '도구를 남길 거면 조건이 있어야 해요. 그 조건을 누가 정하는지, 그걸 먼저 정해야 하고요.'",
        finalMemo: ["폐기는 연구를 끝냄", "내부 개혁은 빠르지만 불신을 남김", "참가자 통제는 느리지만 권한을 돌려줌"],
        finalChoices: [
          {
            id: "a",
            label: "참가자 대표가 통제하는 운영위에 도구를 넘긴다",
            effect: { legitimacy: 9, trust: 7, capital: -6, time: -6, humanCost: -4, fatigue: 7 },
            voice: "남길 조건을 정할 사람은 참가자라고 보고, 운영위에 도구를 넘긴다.",
            echo: "넘어간 도구는 느리게 쓰이고, 쓰이는 이유가 기록됩니다.",
            cognition: { persistence: 2 },
          },
          {
            id: "b",
            label: "도구를 멈추고 동의 절차를 처음부터 다시 받는다",
            effect: { trust: 12, legitimacy: 3, capital: -8, time: -7, fatigue: 8 },
            voice: "조건을 정하기 전에 멈춰야 한다고 보고, 동의 절차를 처음부터 다시 받는다.",
            echo: "처음부터 받는 동의는 오래 걸리고, 이 실험을 처음으로 정당하게 만듭니다.",
            cognition: { reframing: 3 },
          },
          {
            id: "c",
            label: "실험 구조와 사용 기록을 전부 공개 기록으로 넘긴다",
            effect: { legitimacy: 19, trust: 6, humanCost: 4, time: -5, fatigue: 8 },
            voice: "판단을 남기지 않겠다는 듯, 구조와 사용 기록을 전부 공개 기록으로 넘긴다.",
            echo: "전부 공개되면 도구는 통제되지 않습니다. 대신 숨겨지지도 않습니다.",
            cognition: { risk: 1, inference: 1 },
          },
        ],
      },
    },
    system: {
      finalTitle: "다음 사람의 화면",
      finalText: "새벽의 보관소 단말에는 전송 대기열 두 줄이 나란히 깜빡입니다. 하나는 삭제, 하나는 공개입니다. 그 위에 다음 참가자의 첫 화면이 미리 그려져 있습니다. 이름 칸은 비어 있습니다. 보기 하나는 당신이 다시 짠 판과 글자 하나 다르지 않습니다. 그 사람은 그것이 누군가 3년을 지나 마지막 밤에 꺼낸 답이라는 걸 모른 채, 여러 보기 가운데 하나로 읽게 됩니다. 에코가 마지막으로 묻습니다. '이 사람은 아직 아무것도 고르지 않았습니다. 무엇을 고르게 두겠습니까?' 종료 권한은 아직 당신에게 있습니다. 대기열 두 줄은 서로 기다려 주지 않습니다.",
      finalMemo: ["삭제 전송과 공개 전송: 둘 다 대기 중", "다음 참가자의 첫 화면에 당신이 다시 짠 판이 있음", "종료 권한: 아직 당신에게"],
      route: "f_route_system",
      final: "f_final_system",
      title: "마지막 선택지가 당신을 부른다",
      speaker: "에코",
      text: "봉인도 개혁도 폭로도 걸지 않고 판을 다시 짜자 케이스데스크 화면이 한 번 꺼졌다 켜집니다. 켜진 화면은 당신의 것이 아닙니다. 아직 이름이 없는 다음 참가자에게 보여 줄 첫 화면입니다. 사건 설명 아래에 보기가 놓여 있고, 그중 하나가 방금 당신이 다시 짠 판과 글자 하나 다르지 않습니다. 에코가 말합니다. '세 길 밖으로 나가셨습니다. 이 폴더는 밖으로 나간 길도 적습니다. 적힌 것은 다음 사람의 보기가 됩니다.' 화면 아래에 전송 대기열 두 줄이 깜빡입니다. 삭제와 공개. 둘 다 당신의 확인을 기다립니다.",
      memo: ["다시 짠 판이 다음 참가자 선택지로 변환됨", "삭제 전송과 공개 전송이 동시에 대기 중", "종료 권한은 아직 당신에게 있음"],
      routeChoices: [
        {
          id: "f_route_system_read",
          label: "내가 다시 짠 판이 어떤 선택지로 바뀌었는지 끝까지 읽는다",
          effect: { legitimacy: 9, trust: 4, capital: -4, time: -7, fatigue: 7 },
          voice: "다음 참가자가 무엇을 받는지 알아야 해서, 내가 다시 짠 판이 어떤 선택지로 바뀌었는지 끝까지 읽는다.",
          echo: "읽고 나면 다음 참가자의 화면을 모른 척할 수 없습니다.",
          cognition: { inference: 2, persistence: 1 },
        },
        {
          id: "f_route_system_send",
          label: "확인하지 않고 전송 대기열을 그대로 둔다",
          effect: { capital: 7, time: 6, trust: -6, legitimacy: -6, humanCost: 5, fatigue: -4 },
          voice: "확인하지 않는 편이 낫다고 판단하고, 대기열을 그대로 둔다.",
          echo: "확인하지 않은 판도 전송됩니다. 모른다는 사실은 기록되지 않습니다.",
          cognition: { risk: 2 },
        },
        {
          id: "f_route_system_warn",
          label: "다음 참가자에게 이 화면을 먼저 보여준다",
          effect: { trust: 9, legitimacy: 6, capital: -5, humanCost: -5, fatigue: 7 },
          voice: "다음 사람이 알고 고르게 하려고, 이 화면을 먼저 보여준다.",
          echo: "보여주는 순간 당신도 실험의 일부였다는 사실이 함께 넘어갑니다.",
          cognition: { reframing: 2 },
        },
      ],
    },
    finalChoices: [
      {
        id: "a",
        label: "내가 다시 짠 판이 다음 선택지가 되지 못하게 막는다",
        effect: { legitimacy: 8, trust: 4, capital: -5, time: -6, humanCost: -5, fatigue: 7 },
        voice: "내 판단이 남의 질문이 되는 것을 막겠다고, 복제를 끊는다.",
        echo: "끊으면 다음 참가자는 자유로워지고, 무엇이 있었는지도 모릅니다.",
        cognition: { persistence: 2 },
      },
      {
        id: "b",
        label: "다시 짠 판은 남기되 바꿀 수 있는 빈칸을 붙인다",
        effect: { trust: 9, legitimacy: 7, capital: -6, fatigue: 8 },
        voice: "다음 사람은 아직 아무것도 고르지 않았으니, 다시 짠 판은 남기되 바꿀 수 있는 빈칸을 붙인다.",
        echo: "빈칸이 있으면 복제는 상속이 됩니다. 지우는 것보다 오래 남습니다.",
        cognition: { reframing: 3 },
      },
      {
        id: "c",
        label: "다음 참가자에게 모든 원본을 넘기고 끝낸다",
        effect: { legitimacy: 22, trust: 6, capital: 0, humanCost: 4, time: -6, fatigue: 8 },
        voice: "판단을 물려주는 대신 자료를 물려주고, 여기서 끝낸다.",
        echo: "원본을 받은 사람은 처음부터 다시 물을 수 있습니다.",
        cognition: { risk: 1, inference: 1 },
      },
    ],
  },
  routeBody: {
    routes: {
      f_route_map: { entry: "f_archive", tail: "f_witness_reaction", final: "f_final_map" },
      f_route_expose: { entry: "f_confront", tail: "f_dilemma_reaction", final: "f_final_expose" },
      f_route_contain: { entry: "f_branch_witness", tail: "f_branch_witness_follow", final: "f_final_contain" },
    },
    // f_choice is where the season picks its 봉인/개혁/폭로 framing, so the last
    // case is the one place the route finals still converge: they hand the run
    // to that scene instead of jumping past it into the aftermath.
    rewire: { f_final_map: "f_choice", f_final_expose: "f_choice", f_final_contain: "f_choice", f_final_system: "f_choice" },
  },
  evidencePlan: {
    node: "f_evidence_turn",
    // Same reason the last case's route finals stop at f_choice: the clue
    // turnaround must not skip the scene that names the ending.
    result: "f_choice",
    sourceRoutes: ["f_route_map", "f_route_expose", "f_route_contain", "f_route_system"],
    requiredAuthority: "OVERSIGHT",
    entryVoice: "마지막 선택지들을 단서의 원본과 맞추어, 이 문장들이 어디서 왔는지 밝힌다.",
    entryEcho: "원본과 맞추면 마지막 질문을 누가 냈는지가 드러납니다.",
    entryLabel: "선택지들이 만들어진 원본 폴더를 연다",
    title: "모든 단서가 당신의 문장을 가리킨다",
    speaker: "에코",
    text: "쥐고 있던 단서로 감독 권한을 열자 원본 폴더가 통째로 펼쳐집니다. 마흔아홉 사건의 파일이 나란히 서고, 에코가 그 사이에 선을 긋습니다. 사건들을 잇는 것은 회사도 인물도 아닙니다. 물음입니다. 당신이 한 사건에서 고른 답이 다음 사건의 물음을 고쳤고, 그 물음이 다시 당신에게 왔습니다. 선은 전부 한 곳에서 나옵니다. 당신이 판단하는 방식입니다. 에코가 폴더 맨 끝의 빈 파일을 엽니다. 다음 참가자의 첫 화면이고, 보기 몇 개가 벌써 채워져 있습니다. '마지막으로 정할 것은 이 자료를 내놓느냐가 아닙니다. 당신이 판단하는 방식을 다음 사람에게 물려주느냐입니다.'",
    memo: ["모든 사건의 숨은 단서가 선택 문장과 연결됨", "다음 참가자의 첫 선택지 일부가 이미 생성됨", "종료 권한은 공개와 폐기 중 하나만 완전하게 보장함"],
    triggers: ["selfAwareness", "choice", "system"],
    entryEffect: { legitimacy: 6, trust: 3, time: -5, fatigue: 5 },
    choices: [
      {
        id: "f_evidence_turn_burn",
        label: "내 선택 문장까지 포함해 실험 원본을 폐기 대기열에 올린다",
        effect: { legitimacy: 11, trust: 5, capital: -8, time: -8, humanCost: -4, fatigue: 9 },
        voice: "내 판단 양식을 다음 사람에게 물려주지 않으려고, 내 선택 문장까지 포함해 실험 원본을 폐기 대기열에 올린다.",
        echo: "대기열이 실행되면 폐기는 악용을 끝내고, 무슨 일이 있었는지도 함께 끝냅니다.",
        cognition: { persistence: 2 },
      },
      {
        id: "f_evidence_turn_seed",
        label: "내 문장을 경고문으로 남기고 다음 참가자에게 넘긴다",
        effect: { trust: 10, legitimacy: 7, capital: -6, humanCost: 3, fatigue: 8 },
        voice: "내 문장을 답이 아니라 경고문으로 바꿔, 다음 사람에게 남긴다.",
        echo: "경고문이 된 문장은 여전히 다음 사람의 선택지 위에 놓입니다.",
        cognition: { reframing: 3 },
      },
      {
        id: "f_evidence_turn_publish",
        label: "모든 원본과 선택 복제 규칙을 공개한다",
        effect: { legitimacy: 13, trust: -4, capital: -7, humanCost: 5, time: -4, fatigue: 7 },
        voice: "복제 규칙까지 포함해, 원본 전부를 밖에 연다.",
        echo: "규칙이 공개되면 실험은 끝나고, 참가자들의 이름도 함께 열립니다.",
        cognition: { risk: 1, inference: 2 },
      },
    ],
  },
  memoryPlan: {
    systemNext: "f_route_system",
    evidenceNext: "f_evidence_turn",
    systemLabel: "달빛 아래에서 다시 짠 판이 다음 참가자의 선택지로 넘어갔는지 비춰 본다",
    evidenceLabel: "지정서의 작성자를 따라 모든 선택 문장의 원본까지 간다",
    systemEcho: "비춰 보면 다음 참가자의 선택지 셋 중 하나에서 어제 당신이 다시 짠 판의 조건이 빠짐없이 읽힙니다.",
    evidenceEcho: "작성자를 따라가면 설계 로그의 잠금이 풀립니다. 매번 다르던 질문들이 같은 원본에서 갈라져 나온 것이 보입니다.",
  },
  // Keyed on the aftermath of the case the finale follows. It has moved every
  // time a case was inserted in front of it: c5_after_*, c6_after_*, c7_after_*,
  // c9_after_*, c10_after_*, c11_after_*, c12_after_*, c24_after_*, and now c49_after_*. A case pack keys its own
  // openings on the case before it (`openingRoutes`), merged below.
  openingRoutes: {
    c49_after_warm: "f_start_owner",
    c49_after_record: "f_start_system",
    c49_after_rush: "f_start_name",
  },
  openingCopy: {
    f_start_owner: ["끝까지 남은 사람의 마지막 밤", "도윤하", "윤상혁은 지금 올라오라고 했지만, 당신은 달이 질 때까지 헌책방 골목에서 모두와 끝까지 있었습니다. 컵라면 하나는 비었고 하나는 가방에 남았습니다. 약속한 밤이 되자 스물세 명이 여의도까지 따라왔고, 도윤하가 로비 앞에서 '내려오면 제일 먼저 전화해요' 하고 손을 놓습니다. 올라가기 전에 당신은 한서윤이 준 열쇠로 옛 트리거랩 B2 기록 보관소부터 엽니다. 케이스데스크 화면이 혼자 켜져 있습니다. 인사평가 보조지표(사람을 평가할 때 곁들여 보는 숫자) 폴더의 맨 위 파일에 어젯밤이 벌써 적혀 있습니다. '면담 전야, 동료 23명 결집. 결속 유지 능력 상. 관리자 적합.' 사람을 끝까지 떠나지 않는 힘은, 누구에게 가장 쓸모 있습니까.", ["달빛 아래 골목의 밤이 '결속 유지 능력'으로 분류됨", "같은 항목이 골목에 남은 스물세 명 모두에게 매겨짐", "후임 관리자 추천 사유에 그 밤이 인용됨"]],
    f_start_system: ["모든 기록을 묶은 사람의 마지막 밤", "에코", "당신은 그 밤을 마흔아홉 사건의 기록을 한 폴더로 묶는 데 썼습니다. 도윤하의 수첩, 반재욱의 47명, 이민서의 23쪽, 임경수의 뒷장, 에코의 마지막 계산까지 공개 버튼 하나 앞에 모였습니다. 비어 있는 칸은 하나, 옛 트리거랩 B2 단말에만 있는 원본 폴더입니다. 밤 열한 시, B2 케이스데스크에 접속하자 그 폴더가 열립니다. 인사평가 보조지표(사람을 평가할 때 곁들여 보는 숫자)의 맨 앞 파일이 방금 당신이 묶은 폴더의 목차입니다. 분류 항목은 '제도 신뢰형 반응: 기록을 주면 기록 안에서 멈춤'. 당신이 모은 기록이, 이번에는 당신을 재는 잣대가 됐습니다.", ["공개 준비 폴더의 목차가 관찰 자료 1번으로 등록됨", "관리자 칸에는 여전히 점 하나", "참가자 동의 절차의 빈틈은 그대로 남음"]],
    f_start_name: ["곧장 올라간 사람의 마지막 밤", "반재욱", "문자를 받은 그 자리에서 당신은 곧장 33층으로 올라갔습니다. 옛 그룹전략실 앞 복도는 불이 꺼져 있고, 문에는 쪽지 한 장이 붙어 있습니다. '먼저 B2에 들르게. 보여 줄 게 있네. 한 시간이면 되지.' 기다리는 대신 B2로 내려오자 반재욱이 먼저 와서 케이스데스크 앞에 서 있습니다. 골목에서 당신이 뛰어나가는 걸 보고 택시로 따라왔다고 합니다. 인사평가 보조지표(사람을 평가할 때 곁들여 보는 숫자) 폴더가 열렸고, 방금 전 기록이 벌써 올라가 있습니다. '호출 7분 만에 단독 도착. 압박 시 즉시 상향 대응. 관리자 적합.' 당신의 빠른 걸음이 그 칸의 추천 사유가 됐습니다. 그리고 후임 관리자 칸의 점 옆에, 당신 이름이 연필로 적혀 있습니다.", ["33층 면담 한 시간 연기 -- 쪽지 한 장", "즉각 대응 기록이 관리자 추천 사유로 인용됨", "후임 관리자 칸: 점 옆에 연필로 적힌 당신 이름"]],
  },
  openingSignatures: {
    f_start_owner: {
      label: "골목의 밤이 적힌 이 파일부터 동료들에게 먼저 공개한다",
      effect: { legitimacy: 8, trust: 7, time: -6, fatigue: 5 },
      cognition: { persistence: 2 },
      next: "f_route_map",
      voice: "그 밤을 함께한 사람들이 먼저 알아야 한다며, 골목의 밤이 적힌 이 파일부터 동료들에게 공개한다.",
      echo: "공개하면 로비의 스물세 명이 자기 칸의 '결속 유지 능력 상'을 봅니다. 그 칸은 다음 실험의 교재로도 쓰입니다.",
    },
    f_start_system: {
      label: "내가 묶은 공개 원칙을 이 폴더 자신에게 먼저 적용하라고 요구한다",
      effect: { legitimacy: 9, trust: 5, capital: -4, time: -7, fatigue: 5 },
      cognition: { reframing: 2 },
      next: "f_route_contain",
      voice: "남에게 요구한 원칙이면 여기서도 지켜져야 한다며, 내가 묶은 공개 원칙을 이 폴더 자신에게 먼저 적용하라고 요구한다.",
      echo: "같은 원칙을 설계자에게 들이대면 실험의 전제가 드러납니다. 관리자 칸의 점이 끝내 답하지 않으면, 그 침묵이 증거가 됩니다.",
    },
    f_start_name: {
      label: "연필로 적힌 내 이름과 이 파일을 동료들에게 먼저 알린다",
      effect: { trust: 9, humanCost: -6, legitimacy: -3, capital: -5, fatigue: 5 },
      cognition: { reframing: 2 },
      next: "f_route_expose",
      voice: "혼자 올라온 걸음을 혼자 끝내지 않으려고, 연필로 적힌 내 이름과 이 파일을 동료들에게 먼저 알린다.",
      echo: "먼저 알리면 골목의 사람들이 한 시간을 법니다. 그 시간에 로비로 올지 말지는 그들이 정합니다. 절차상으로는 유출입니다.",
    },
  },
  // The line and reply a start card has in one opening alone. A card without
  // an entry here says what it says in the briefing.
  openingLines: {
    f_start_owner_map: {
      voice: "골목의 밤이 하루 만에 평가 문장이 됐으니, 내 로그가 사건 설계에 어떻게 쓰였는지부터 추적한다.",
      echo: "끝까지 남은 밤도 하루 만에 한 줄이 됐습니다. 그 줄이 어디로 갔는지 따라가면 설계가 보입니다.",
    },
    f_start_owner_expose: {
      voice: "스물세 명의 밤까지 점수가 된 걸 보고, 더 적히기 전에 즉시 외부 공개를 준비한다.",
      echo: "공개는 실험을 멈출 수 있습니다. 로비에서 기다리는 스물세 명의 칸도 같은 자료에 실려 밖으로 나갑니다.",
    },
    f_start_owner_contain: {
      voice: "열쇠를 건넨 사람이 이 파일도 알았는지 들어야 해서, 한서윤에게 먼저 내부 설명을 요구한다.",
      echo: "안에서 먼저 물으면 관계는 지켜집니다. 답을 기다리는 동안에도 로비의 스물세 명은 계속 적힙니다.",
    },
    f_start_system_map: {
      voice: "방금 묶은 폴더의 목차가 관찰 자료 1번이 됐으니, 내 로그가 사건 설계에 어떻게 쓰였는지 추적한다.",
      echo: "당신이 묶은 기록이 당신을 재는 잣대가 됐습니다. 언제부터 그렇게 쓰였는지는 로그에 남아 있습니다.",
    },
    f_start_system_expose: {
      voice: "공개 버튼 앞까지 모아 둔 기록이 있으니, 이 폴더까지 얹어 즉시 외부 공개를 준비한다.",
      echo: "공개하면 '기록 안에서 멈춤'이라는 분류는 틀린 말이 됩니다. 마흔아홉 사건의 사람들도 그 폴더에 실려 함께 나갑니다.",
    },
    f_start_system_contain: {
      voice: "내 폴더가 왜 관찰 자료가 됐는지 기록으로 남기려고, 한서윤에게 내부 설명을 요구한다.",
      echo: "안에서 묻고 답을 기록으로 남기는 일입니다. 폴더는 그 반응도 '기록 안에서 멈춤'으로 적을 수 있습니다.",
    },
    f_start_name_map: {
      voice: "7분의 걸음이 벌써 추천 사유가 됐으니, 내 로그가 사건 설계에 어떻게 쓰였는지부터 추적한다.",
      echo: "빠른 걸음은 7분 만에 자료가 됐습니다. 그 자료가 흘러간 길을 따라가는 데는 7분보다 오래 걸립니다.",
    },
    f_start_name_expose: {
      voice: "연필로 적힌 이름이 굳기 전에 밖에서 먼저 알도록, 즉시 외부 공개를 준비한다.",
      echo: "공개하면 연필로 적힌 이름은 굳지 못합니다. 대신 '압박 시 즉시 상향 대응'이라는 줄에 사례가 하나 더 붙습니다.",
    },
    f_start_name_contain: {
      voice: "혼자 달려와 놓고 또 혼자 정하지 않으려고, 먼저 한서윤에게 내부 설명을 요구한다.",
      echo: "안에서 먼저 물으면 쪽지가 말한 한 시간이 설명을 듣는 데 쓰입니다. 연필로 적힌 이름은 그동안 지워지지 않습니다.",
    },
  },
  setting: { place: "트리거랩 기록 보관소 B2", clock: "마지막 밤" },
  sceneContext: {
    // ----------------------------------------------------------------- FINAL
    f_start_owner: {
      place: "트리거랩 기록 보관소 B2",
      clock: "마지막 밤",
      question: "끝까지 곁에 남은 밤이 '관리자 적합'의 근거로 적혔습니다. 그 집념은 누구에게 이용될 수 있습니까?",
      lead: "달빛 아래 골목에서 모두와 끝까지 남았던 밤이 지나고, 약속한 밤 33층에 오르기 전 B2 문을 먼저 엽니다.",
    },
    f_start_system: {
      place: "트리거랩 기록 보관소 B2",
      clock: "마지막 밤",
      question: "마흔아홉 사건을 묶은 당신의 폴더가 관찰 자료 1번이 됐습니다. 이 자리를 받겠습니까?",
      lead: "마흔아홉 사건의 기록을 한 폴더로 묶고 난 밤, 마지막 빈칸인 B2의 원본 폴더에 접속한 참입니다.",
    },
    f_start_name: {
      place: "트리거랩 기록 보관소 B2",
      clock: "마지막 밤",
      question: "33층으로 달려간 걸음이 후임 관리자 추천 사유가 됐습니다. 연필로 적힌 그 이름을 받겠습니까?",
      lead: "문자를 받자마자 오른 33층 복도에서 쪽지 한 장을 보고 B2로 내려온 참입니다. 당신의 빠른 걸음이 벌써 실험 자료로 올라가 있습니다.",
    },
    f_start: {
      place: "트리거랩 기록 보관소 B2",
      clock: "마지막 밤",
      question: "당신의 선택 로그가 다음 사건 설계에 쓰였습니다. 이 사실을 어떻게 다루겠습니까?",
      lead: "33층에 오르기로 한 마지막 밤, 한서윤이 반납하지 않은 열쇠로 옛 트리거랩 B2 기록 보관소부터 엽니다. 반납 목록에서 빠진 케이스데스크 한 대가 아직 켜져 있습니다.",
    },
    f_archive: {
      place: "트리거랩 기록 보관소 B2",
      clock: "마지막 밤 · 23:50",
      question: "같은 데이터가 사람을 깊게 생각하게도, 쉽게 몰아붙이게도 합니다. 이 자료를 폐기하겠습니까, 규칙을 붙이겠습니까?",
      lead: "옥상에서 절반만 말했던 한서윤이 나머지를 마저 말합니다. 트리거랩은 생각을 깨우는 조건을 연구했고, 그 연구는 그대로 압박 설명서이기도 했습니다. 그리고 당신 책상에 처음 올라온 사례의 번호는 그가 고른 것이 아니었습니다.",
    },
    f_confront: {
      place: "KD금융그룹 본사 33층 옛 그룹전략실",
      clock: "마지막 밤 · 00:40",
      question: "서명란을 비워 둔 사람이 당신 앞에 앉아 있습니다. 그 조건을 봉인하겠습니까, 직접 설계하겠습니까?",
      lead: "보관소에서 나와 33층으로 올라왔습니다. 짐이 빠진 방에서 윤상혁은 3년 전 서류를 이미 책상에 펼쳐 두고 기다리고 있었습니다.",
    },
    f_choice: {
      place: "트리거랩 기록 보관소 B2 · 단말 앞",
      clock: "마지막 밤 · 새벽",
      question: "마흔아홉 사건과 1년의 마지막 선택입니다. 당신의 조건을 약점으로 두겠습니까, 도구로 쓰겠습니까?",
      lead: "마흔아홉 사건과 1년, 그리고 이 밤이 지났습니다. 트리거랩은 없어졌고, 관리자 칸에는 여전히 점 하나가 찍혀 있습니다. 단말 앞에는 당신과, 반납하지 않은 열쇠를 쥔 한서윤이 있습니다.",
    },
    f_witness: {
      place: "트리거랩 기록 보관소 B2 · 이전 참가자 구역",
      clock: "마지막 밤 · 00:10",
      question: "당신보다 먼저 실험을 통과한 사람의 기록이 있습니다. 그에게 먼저 알리겠습니까?",
    },
    f_witness_reaction: {
      place: "트리거랩 기록 보관소 B2 · 이전 참가자 구역",
      clock: "마지막 밤 · 00:30",
      question: "첫 참가자가 자기 기록을 돌려달라고 합니다. 돌려주면 실험 전체가 흔들립니다.",
    },
    f_dilemma: {
      place: "트리거랩 기록 보관소 B2 · 종료 단말",
      clock: "마지막 밤 · 01:20",
      question: "문을 닫으면 기록도 사라지고, 열어두면 같은 압박이 반복됩니다. 종료 조건을 어떻게 설계하겠습니까?",
    },
    f_dilemma_reaction: {
      place: "트리거랩 기록 보관소 B2 · 종료 단말",
      clock: "마지막 밤 · 01:50",
      question: "종료 버튼에 당신의 이름이 떠 있습니다. 혼자 누르겠습니까?",
    },
    f_branch_witness: {
      place: "트리거랩 기록 보관소 B2 · 이전 참가자 구역",
      clock: "마지막 밤 · 01:20",
      question: "이전 기록에 빈칸이 있습니다. 그 빈칸을 누구의 동의로 채우겠습니까?",
    },
    f_branch_witness_follow: {
      place: "트리거랩 기록 보관소 B2 · 단말 앞",
      clock: "마지막 밤 · 01:40",
      question: "에코가 마지막으로 묻습니다. 당신의 기준을 다음 사람에게 넘기겠습니까?",
    },
    f_route_map: {
      place: "트리거랩 기록 보관소 B2 · 설계 로그",
      clock: "마지막 밤 · 23:30",
      question: "내 로그가 만든 사건들이 보입니다. 이 추적을 어디까지 밀겠습니까?",
      lead: "폴더의 설계 로그(실험을 어떻게 짤지 바꾼 날짜와 사람을 남긴 기록)를 첫 줄부터 따라 내려가기 시작한 참입니다.",
    },
    f_route_expose: {
      place: "트리거랩 기록 보관소 B2 · 외부 회선",
      clock: "마지막 밤 · 23:30",
      question: "실험이 밖으로 나갔습니다. 폭로의 피해자를 어떻게 줄이겠습니까?",
      lead: "폴더의 내용을 이 건물 밖으로 내보낼 준비를 시작한 참입니다. 나가는 순간 되돌릴 수 없습니다.",
    },
    f_route_contain: {
      place: "트리거랩 3층 운영실",
      clock: "마지막 밤 · 23:30",
      question: "안에서 닫을 수 있는지가 관건입니다. 내부 개혁의 조건을 무엇으로 걸겠습니까?",
      lead: "폴더를 들고 3층 운영실로 올라온 참입니다. 한서윤은 닫을 방법이 있다고 말합니다.",
    },
    f_route_system: {
      place: "트리거랩 기록 보관소 B2 · 단말 앞",
      clock: "마지막 밤 · 23:30",
      question: "준비된 결말 밖에서 다시 짠 판이 다음 참가자의 선택지가 됐습니다. 그 판을 어떻게 하겠습니까?",
      lead: "세 결말을 모두 내려놓고 판을 다시 짜자, 화면에 다음 참가자의 선택지가 떴습니다. 그중 하나는 방금 당신이 다시 짠 판입니다.",
    },
    f_final_map: {
      place: "트리거랩 기록 보관소 B2",
      clock: "마지막 밤 · 새벽",
      question: "내 기준을 공개할 것인지 정해야 합니다. 어떻게 하겠습니까?",
    },
    f_final_expose: {
      place: "트리거랩 기록 보관소 B2",
      clock: "마지막 밤 · 새벽",
      question: "폭로에도 피해자가 생깁니다. 그 범위를 어떻게 줄이겠습니까?",
    },
    f_final_contain: {
      place: "트리거랩 기록 보관소 B2",
      clock: "마지막 밤 · 새벽",
      question: "도구를 남길 조건을 정해야 합니다. 무엇을 붙이겠습니까?",
    },
    f_final_system: {
      place: "트리거랩 기록 보관소 B2",
      clock: "마지막 밤 · 새벽",
      question: "당신이 다시 짠 판이 다음 사람의 선택지가 됩니다. 그대로 두겠습니까?",
    },
    f_evidence_turn: {
      place: "트리거랩 기록 보관소 B2 · 설계 로그",
      clock: "마지막 밤 · 00:00",
      question: "모든 단서가 당신의 문장을 가리킵니다. 이 연결을 인정하겠습니까?",
    },
    f_aftershock: {
      place: "트리거랩 기록 보관소 B2 · 종료 단말",
      clock: "마지막 밤 · 04:00",
      question: "당신의 선택이 다음 참가자에게 보여지고 있었습니다. 이 실험을 어떤 방식으로 끝내겠습니까?",
      lead: "마지막 폴더가 열립니다. 결말은 이제 사건이 아니라, 실험을 끝내는 방식에 달렸습니다.",
    },
  },
  clue: {
  id: "final-observer-key",
  title: "관찰자의 열쇠",
  text: "당신의 선택 습관을 모은 폴더가 이미 완성되어 있습니다. 마지막 질문은 실험을 끝낼지 이용할지입니다.",
},
  outcomes: {
    f_after_witness: { tag: "증언을 남긴 결말", title: "첫 참가자의 목소리가 마지막 기록이 되었다", text: "실험을 끝내는 대신 진실을 함께 보존했습니다. 다음 사람은 적어도 자신이 무엇에 참여하는지 알 수 있습니다." },
    f_after_control: { tag: "규칙을 바꾼 결말", title: "실험은 남았지만 혼자 결정할 수 없게 되었다", text: "트리거를 없애지는 않았습니다. 대신 동의와 감시가 없는 선택은 더 이상 실행되지 않습니다." },
    f_after_burn: { tag: "폐기한 결말", title: "모든 기록을 태우고 빈 화면을 남겼다", text: "누구도 다시 이용할 수 없게 했지만, 무엇을 잃었는지 증명할 기록도 사라졌습니다." },
  },
  // Keyed on case 49's aftermath: the finale follows that case now.
  continuityChallenges: {
    c49_after_warm: { id: "protect-trust", title: "집념을 혼자 갖지 않기", text: "달이 질 때까지 곁에 남은 밤이 이번에는 '결속 유지 능력'이라는 관찰 자료가 됐습니다. 로비에서 기다리는 사람들의 선택권까지 빼앗지 않는 방법을 찾으면 숨은 단서가 열릴 수 있습니다." },
    c49_after_record: { id: "use-reframe", title: "내가 묶은 폴더도 의심하기", text: "마흔아홉 사건을 묶은 공개 준비 폴더가 관찰 자료 1번이 됐습니다. 그 폴더가 다시 누군가를 재는 도구가 되지 않는지 판을 뒤집어 확인해야 합니다." },
    c49_after_rush: { id: "repair-legitimacy", title: "먼저 달려간 걸음의 공정함 회복하기", text: "혼자 먼저 올라간 걸음이 후임 관리자 추천 사유가 됐습니다. 골목에 남은 동료들이 당신 없이도 지켜질 방법을 찾아야 합니다." },
  },
};
