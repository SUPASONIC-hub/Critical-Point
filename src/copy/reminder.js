import { localizeTables } from "../locale.js";

/**
 * 주 1회 알림 (N25, state/weeklyReminder.js, components/WeeklyReminderToggle.jsx):
 * the switch in the comfort settings, what it says when it cannot be turned
 * on, and the notification itself, read by key so another language can be
 * laid over them (src/locale.js). `{label}` is the week's rule's
 * (gauntlet/weeklyRules.js); the notification's body is the rule's title and
 * its line in the story, one to a line.
 */
const reminderCopy = {
  label: "주 1회 알림 · 이번 주의 규칙",
  text: "규칙이 있는 주에, 그 주에 아직 게임을 열지 않았다면 한 번 알려 줍니다. 기본은 꺼짐이고 여기서 언제든 끕니다. 이 설정은 이 기기에만 저장되고 서버로 보내지 않습니다.",
  denied: "브라우저에서 이 사이트의 알림이 막혀 있습니다. 브라우저 설정에서 허용한 뒤 다시 켜 주세요.",
  openOnly: "이 기기는 앱이 닫혀 있을 때 확인하지 못해, 알림이 늦거나 오지 않을 수 있습니다.",
  title: "이번 주의 규칙: {label}",
};
export default reminderCopy;

localizeTables("screens", { reminder: reminderCopy });
