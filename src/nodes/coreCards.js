/**
 * The card copy of 사건 01-11 and the finale: the close of each hidden route,
 * the label of each evidence card, and what the memory cards answer.
 *
 * The cases from 사건 12 on carry these on their own pack (`routePlan.system`,
 * `evidencePlan`, `memoryPlan`). The first twelve have no pack -- their plans
 * are tables in `gameData.js`, which is held to a line budget -- so their copy
 * lives here and is laid onto those tables before the scenes are generated.
 */

/** Laid onto `dramaticRoutePlans[caseId].system`. */
const closings = {
  case01: {
    finalTitle: "같은 표를 지나간 세 안건",
    finalText: "현금이 바닥나기까지 여덟 시간, 상황실 화면에는 절감안과 자금안과 매각안이 아직 한 표 위에 겹쳐 있습니다. 에코가 한 줄을 띄웁니다. '세 안건은 같은 기준표를 통과했습니다. 표를 그대로 두면 네 번째 안건도 같은 자리에서 막힙니다.'",
    finalMemo: ["세 안건이 같은 기준표를 통과함", "기준표를 고친 사람과 날짜: 아직 열리지 않음", "현금 소진까지 8시간"],
  },
  case03: {
    finalTitle: "기준을 만든 사람",
    finalText: "발표를 앞둔 화면에서 점수판이 한 번 더 고쳐집니다. 새로 생긴 항목의 이름은 당신이 다시 짠 판에서 그대로 왔고, 고객 화면에는 바뀐 이유가 보이지 않습니다. 에코가 덧붙입니다. '이 입찰은 두 사람 가운데 하나를 고르지 않습니다. 기준을 만드는 사람을 고릅니다.'",
    finalMemo: ["새 평가 항목: 다시 짠 판에서 옮겨 옴", "오진우의 점수도 함께 다시 계산됨", "고객 화면에는 변경 사유가 없음"],
  },
  case04: {
    finalTitle: "양식이 된 예외",
    finalText: "심사 자료를 내기 직전, 이사회실 화면에 다른 기관의 신청서 초안이 뜹니다. 허용선 칸에는 당신이 다시 짠 조건이 글자 하나 바뀌지 않고 들어가 있습니다. 에코가 한 줄을 붙입니다. '선의는 복사됩니다. 복사본에는 온새의 4,200명이 들어 있지 않습니다.'",
    finalMemo: ["허용선 조건이 다른 기관 신청서 초안에 그대로 옮겨짐", "복사된 초안에는 피해자 명단이 없음", "심사 자료 제출 직전"],
  },
  case05: {
    finalTitle: "조용한 쪽이 밀리는 값",
    finalText: "공식 발표를 앞둔 통제실 화면에 가중치표(조건마다 얼마나 무겁게 따질지 적어 둔 표)가 아직 닫히지 않았습니다. 서비스를 받지 못한 312명 가운데 규정을 어긴 사람 때문에 밀린 사람은 없습니다. 에코의 글자가 표 아래에 뜹니다. '언론이 기다리는 것은 이름입니다. 312명을 뒤로 민 것은 이름이 아니라 숫자였습니다.'",
    finalMemo: ["누락 312명 -- 불만을 적게 낸 사람일수록 뒤로 밀림", "배차 시스템은 승인된 기준대로 작동함", "공식 발표 직전, 언론은 실명을 요구"],
  },
  case06: {
    finalTitle: "빈칸이 하나 남은 색인",
    finalText: "2층 회의실 화면에 실험 색인이 펼쳐져 있습니다. 같은 실험 번호 아래 오진우의 줄과 당신의 줄이 위아래로 붙어 있고, 그 밑의 다음 참가자 칸은 비어 있습니다. 에코가 한 줄을 보탭니다. '위원회가 묻는 것은 책임자 한 명입니다. 색인이 보여 주는 것은 한 실험의 두 줄입니다.'",
    finalMemo: ["두 프로필의 실험 번호가 같음", "다음 참가자 칸: 공란", "위원회는 결론을 기다리는 중"],
  },
  case07: {
    finalTitle: "열아홉 줄과 빈 한 줄",
    finalText: "발령(근무지를 옮기라는 인사 명령)까지 열두 시간, 인사 대장 단말에는 승인란이 빈 발령 열아홉 건이 한 표로 떠 있습니다. 열일곱 명이 기업금융전략팀을 거쳤고, 표의 마지막 줄은 아직 비어 있습니다. 에코가 묻습니다. '당신이 열기 전에 이것은 표가 아니었습니다. 따로 보관된 열아홉 장이었습니다. 다시 낱장으로 돌려놓겠습니까?'",
    finalMemo: ["승인란 공란 발령 19건이 한 표로 묶임", "표의 마지막 줄: 공란", "발령 적용까지 12시간"],
  },
  case08: {
    finalTitle: "일곱 번째 칸",
    finalText: "청산(회사를 정리해 없애는 절차) 등기까지 열 시간, 영동지점 단말에는 같은 주소와 같은 세무 대리인을 쓴 법인 일곱 곳이 한 줄로 서 있습니다. 앞선 여섯 곳은 감사가 시작되기 직전에 사라졌고, 일곱 번째인 해온파트너스가 같은 길에 올라 있습니다. 에코는 날짜 일곱 개를 세로로 늘어놓습니다. '여섯 번은 아무도 이어 보지 않았습니다. 일곱 번째는 지금 당신 화면에 있습니다.'",
    finalMemo: ["같은 주소·같은 세무 대리인 법인 7곳", "앞선 여섯 곳: 감사 착수 직전에 정리됨", "해온파트너스 청산 등기까지 10시간"],
  },
  case09: {
    finalTitle: "아무도 쓰지 않은 한 장",
    finalText: "채권단 결의까지 여섯 시간, 자료 단말에는 세 번째 계산서가 저장되지 않은 채 떠 있습니다. 회사를 닫으면 1,140명의 가족과 협력사가 치를 비용이고, 채권단의 두 장 어디에도 이 칸은 없습니다. 에코는 표의 제목 옆에 '추정'이라고 적어 둡니다. '추정이라는 말은 틀렸다는 뜻이 아닙니다. 추정이라서 아무도 서명하지 않았고, 서명이 없어서 회의에 오른 적이 없습니다.'",
    finalMemo: ["세 번째 계산서: 작성자 칸 공란", "채권단 자료에는 없는 비용", "채권단 결의까지 6시간"],
  },
  case10: {
    finalTitle: "서른한 달",
    finalText: "분담표 확정까지 여덟 시간, 실험 단말에는 소진율 표가 떠 있습니다. 서른네 명 가운데 스물아홉 명이 3년 안에 자리를 떠났고, 도윤하는 서른여섯 달째입니다. 에코가 한 줄을 남깁니다. '이 숫자를 제도에 올리면 관리 대상이 됩니다. 올리지 않으면 다음 사람도 혼자 셉니다.'",
    finalMemo: ["자발적 피해 추적자 34명 -- 29명이 3년 안에 이탈", "도윤하: 36개월째", "분담표 확정까지 8시간"],
  },
  case11: {
    finalTitle: "미루지 않을 한 가지",
    finalText: "출석 당일 새벽, 실험 단말의 통계는 밤새 한 줄도 바뀌지 않았습니다. 가장 많이 나온 답은 '확인해 보겠습니다'였고, 다음 해에 확인 결과가 보고된 것은 3%입니다. 에코가 마지막 줄을 띄웁니다. '오늘 당신에게 돌아올 답변 시간은 평균 40초입니다. 그 안에 들어가는 말 가운데 내년으로 넘어가지 않는 것은 몇 개입니까.'",
    finalMemo: ["'확인해 보겠습니다' 2,114번 -- 이행 보고 3%", "참고인 답변 평균 40초", "출석까지 몇 시간"],
  },
  final: {
    finalTitle: "다음 사람의 화면",
    finalText: "새벽의 보관소 단말에는 전송 대기열 두 줄이 나란히 깜빡입니다. 하나는 삭제, 하나는 공개입니다. 그 위에 다음 참가자의 첫 화면이 미리 그려져 있고, 선택지 하나는 당신이 다시 짠 판과 글자 하나 다르지 않습니다. 에코가 마지막으로 묻습니다. '이 사람은 아직 아무것도 고르지 않았습니다. 무엇을 고르게 두겠습니까?'",
    finalMemo: ["삭제 전송과 공개 전송: 둘 다 대기 중", "다음 참가자의 첫 화면에 당신이 다시 짠 판이 있음", "종료 권한: 아직 당신에게"],
  },
};

/** Laid onto `evidenceTurnaroundPlans[caseId]`. */
const entryLabels = {
  case01: { entryLabel: "세 안건이 지나간 기준표를 단서로 연다" },
  case02: { entryLabel: "유출 기록에 찍힌 시각을 증언과 다시 맞춘다" },
  case03: { entryLabel: "공개 점수판 밑에 깔린 두 번째 점수판을 연다" },
  case04: { entryLabel: "예외 파일을 처음 받은 사람의 칸을 연다" },
  case05: { entryLabel: "지도에서 밀려난 피해자의 순번을 되살린다" },
  case06: { entryLabel: "그의 조건이 바뀐 날짜들을 내 기록과 잇는다" },
  case07: { entryLabel: "발령서가 쓰인 날과 조사가 시작된 날의 순서를 연다" },
  case08: { entryLabel: "입금일과 승인일을 달력 한 장에 겹친다" },
  case09: { entryLabel: "청산 회수율 78%를 계산한 곳을 찾아간다" },
  case10: { entryLabel: "병가 사유란에서 보기가 사라진 날을 찾는다" },
  case11: { entryLabel: "반대 의견서가 폐기로 바뀐 시각을 잡아낸다" },
  final: { entryLabel: "선택지들이 만들어진 원본 폴더를 연다" },
};

/** Laid onto `continuityMemoryChoicePlans[caseId]`. */
const memoryEchoes = {
  case02: {
    routeEcho: "약속부터 확인하면 이민서는 기록보다 먼저 사람으로 불립니다. 보고서의 첫 줄은 그만큼 늦게 채워집니다.",
    systemEcho: "뜯어보면 유출 파일의 한 줄이 플로우온에서 당신이 다시 짠 판과 같은 순서로 적혀 있습니다. 혐의의 주어가 이민서에서 기록을 만든 쪽으로 옮겨 갑니다.",
    evidenceEcho: "급여표를 옆에 세우면 유출 파일이 만들어진 시각과 증언 시각이 어긋납니다. 누가 말했는지보다 누가 말을 막았는지가 먼저 남습니다.",
  },
  case03: {
    routeEcho: "대조하면 오진우의 안에서 책임 조항만 비어 있는 것이 보입니다. 그 빈칸이 실수인지 시험인지는 그에게 물어야 압니다.",
    systemEcho: "훑으면 점수판의 새 항목 하나가 당신이 다시 짠 판과 같은 말로 적혀 있습니다. 점수를 매기는 쪽이 당신을 읽고 있었습니다.",
    evidenceEcho: "어긋난 시간을 따라가면 고객에게 보이는 점수판 아래에서 심사용 점수판이 하나 더 열립니다. 두 판은 같은 항목을 다른 무게로 답니다.",
  },
  case04: {
    routeEcho: "대조하면 예외 승인표에는 누가 감시하는지를 적는 칸이 없습니다. 입찰장의 배점표에 '장기 실패 비용'이 없던 것과 같은 모양입니다.",
    systemEcho: "읽어 보면 온새의 예외 사유서가 당신이 입찰장에서 다시 짠 판을 근거로 인용하고 있습니다. 선의로 세운 기준이 허용선이 됐습니다.",
    evidenceEcho: "작성자를 견주면 예외 파일의 수신자 칸이 열립니다. 같은 이름이 이번 승인에만 있는 것이 아닙니다.",
  },
  case05: {
    routeEcho: "겹쳐 보면 온새의 예외 조건이 실패 지도의 화살표 하나와 같은 자리에 놓입니다. 누구의 단독 결정도 아닌 칸입니다.",
    systemEcho: "살펴보면 복구 우선순위표의 한 줄이 당신이 다시 짠 판과 같은 순서입니다. 그 아래에서 가중치 설계 파일이 함께 열립니다.",
    evidenceEcho: "되풀이된 이름을 찾다 보면 매번 뒤로 밀린 사람들의 공통점이 보입니다. 신고를 적게 한 사람들입니다.",
  },
  case06: {
    routeEcho: "기준을 옆자리에 대 보러 올라가면 옥상 난간에 오진우가 서 있습니다. 그는 책임을 묻기도 전에 질문 하나를 먼저 꺼냅니다.",
    systemEcho: "확인하면 오진우의 조건표에 당신이 다시 짠 판이 기준선으로 적혀 있습니다. 그의 시간이 줄어든 자리마다 당신의 선택이 있습니다.",
    evidenceEcho: "두 날짜를 포개 보면 그의 결정 창이 줄어든 날들이 한 줄로 섭니다. 날짜마다 하루 앞에 당신의 기록이 있습니다.",
  },
  case07: {
    systemEcho: "들추면 당신의 인사 기록 비고란에 그때 다시 짠 판이 옮겨져 있습니다. 그 아래로 같은 모양의 발령 기록부가 열립니다.",
    evidenceEcho: "실험 번호를 옆에 적으면 발령서 작성일이 조사 개시일보다 앞에 놓입니다. 순서가 바뀌면 이유와 결과도 자리를 바꿉니다.",
  },
  case08: {
    systemEcho: "더듬어도 등기 서류에는 당신의 판이 없습니다. 대신 같은 주소를 쓴 법인들의 이력이 줄줄이 열립니다.",
    evidenceEcho: "나란히 적으면 자문료가 들어온 날과 승인이 난 날이 달력 위에서 하루 차이로 붙습니다.",
  },
  case09: {
    systemEcho: "찾아봐도 채권단 자료에는 당신이 다시 짠 판이 들어갈 칸이 없습니다. 에코가 그 빈자리에 세 번째 표를 엽니다.",
    evidenceEcho: "작성일에 겹치면 청산 회수율을 계산한 곳의 이름이 나옵니다. 흔적표에서 본 세무 대리인을 같이 씁니다.",
  },
  case10: {
    systemEcho: "가려 보면 인사 기록에는 옮겨 적힌 것이 없습니다. 기록되지 않는 것이 하나 더 있다는 것만 알게 됩니다. 선의가 닳는 속도입니다.",
    evidenceEcho: "개정 이력을 따라가면 병가 신청서의 사유란에서 보기 하나가 사라진 날짜가 나옵니다.",
  },
  case11: {
    systemEcho: "대 보면 그룹 입장문은 당신의 판단을 '개인적 판단'이라는 말로 옮겨 적었습니다. 미룰 수 있는 문장을 고르는 법이 그 안에 있습니다.",
    evidenceEcho: "그 부서를 찾아보면 3년 전 승인 시스템의 변경 기록이 열립니다. 반려와 폐기 사이에 시각이 하나 더 찍혀 있습니다.",
  },
  final: {
    systemEcho: "비춰 보면 다음 참가자의 선택지 셋 중 하나에서 어제 당신이 다시 짠 판의 조건이 빠짐없이 읽힙니다.",
    evidenceEcho: "작성자를 따라가면 설계 로그의 잠금이 풀립니다. 매번 다르던 질문들이 같은 원본에서 갈라져 나온 것이 보입니다.",
  },
};

/**
 * One name, because `gameData.js` is also held to a count of imported names.
 */
export const coreCards = {
  closings,
  entryLabels,
  memoryEchoes,
  /** Lays one table of card copy onto the plans it belongs to. */
  lay(cards, planOf) {
    Object.entries(cards).forEach(([caseId, copy]) => Object.assign(planOf(caseId), copy));
  },
  /**
   * Files what each memory card answers under the id the card is dealt with
   * (`caseNN_memory_route`, `_system`, `_evidence`). The card is dealt at run
   * time, so it is no scene's choice and the authored echo table -- which is
   * checked against the graph -- cannot hold its reply; the plan carries it.
   */
  fileMemoryEchoes(memoryPlans, echoReplies) {
    Object.entries(memoryPlans).forEach(([caseId, plan]) => {
      for (const kind of ["route", "system", "evidence"]) {
        if (plan?.[`${kind}Echo`]) echoReplies[`${caseId}_memory_${kind}`] = plan[`${kind}Echo`];
      }
    });
  },
};
