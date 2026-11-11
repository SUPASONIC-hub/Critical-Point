import { localizeTables } from "../locale.js";

/**
 * The season's 판단 습관 by id (judgementHabit.js): the name the result card
 * prints in large type and the line the report's 당신이 반복한 방식 box draws
 * under it, read by key so another language can be laid over them (src/locale.js,
 * 다국어 틀). The Korean is judgementHabit.js's, moved here unchanged. Here,
 * on the runtime's side, for the reason judgementHabit.js gives: the card's
 * chunk had no room, and is handed the finished name.
 */
const habitsCopy = {
  bulldozer: { title: "실적 우선 불도저형", line: "판은 이겼는데, 사람 피해가 뒤에 쌓였습니다." },
  moth: { title: "하이리스크 불나방형", line: "벽이 가까워질수록 손이 더 빨라집니다." },
  tightrope: { title: "벽 앞 줄타기 장인형", line: "벽 바로 앞까지 밀고도 멀쩡히 돌아옵니다." },
  reframer: { title: "판 뒤집기 상습범형", line: "카드가 마음에 안 들면 판부터 다시 짭니다." },
  shield: { title: "사람 먼저 방패형", line: "숫자보다 그 숫자 뒤의 사람을 먼저 셉니다." },
  "one-track": { title: "외길 논리형", line: "한 번 정한 논리는 열기가 올라도 놓지 않습니다." },
  "card-shopper": { title: "카드 쇼핑형", line: "판마다 다른 카드를 집고, 콤보는 신경 안 씁니다." },
  "stepping-stone": { title: "돌다리 두들김형", line: "벽 근처엔 가지도 않고 일찍 LOCK을 누릅니다." },
  marathon: { title: "생각 마라톤형", line: "결론보다 생각이 오래 걸려야 마음이 놓입니다." },
  lightning: { title: "속전속결형", line: "읽자마자 고르고, 고르자마자 밉니다." },
  steady: { title: "무난한 균형형", line: "튀지 않게, 그러나 끝까지 판을 닫았습니다." },
  // D1: the one line the result card and its copied line say the name in,
  // made here (judgementHabit.habitCardLine) and handed to the card's chunk.
  cardLine: "당신의 심사 성향은 「{habit}」입니다.",
};
export default habitsCopy;

localizeTables("screens", { habits: habitsCopy });
