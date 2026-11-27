import { localizeTables } from "../locale.js";

/**
 * 주 1회 알림 (N25, state/weeklyReminder.js, components/WeeklyReminderToggle.jsx):
 * the switch in the comfort settings, what it says when it cannot be turned
 * on, and the notification's title, read by key so another language can be
 * laid over them (src/locale.js). The weekly sender
 * (scripts/send-weekly-push.mjs) reads `title` in each language; `{label}` is
 * the week's rule's (gauntlet/weeklyRules.js), and the body is the rule's
 * title and its line in the story, one to a line.
 */
const reminderCopy = {
  label: "주 1회 알림 · 이번 주의 규칙",
  text: "규칙이 있는 주의 월요일 아침에 그 주의 규칙을 한 번 알려 줍니다. 기본은 꺼짐이고 여기서 언제든 끕니다. 켜면 이 브라우저의 알림 받을 주소(구독 정보)를 알림을 보내는 데에만 우리 서버에 저장하고, 끄면 지웁니다.",
  denied: "브라우저에서 이 사이트의 알림이 막혀 있습니다. 브라우저 설정에서 허용한 뒤 다시 켜 주세요.",
  failed: "알림을 켜지 못했습니다. 인터넷 연결을 확인하고 잠시 뒤 다시 켜 주세요.",
  title: "이번 주의 규칙: {label}",
};
export default reminderCopy;

localizeTables("screens", { reminder: reminderCopy });
