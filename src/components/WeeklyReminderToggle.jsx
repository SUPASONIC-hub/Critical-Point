import { useState } from "react";
import reminderCopy from "../copy/reminder.js";
import { reminderAvailability, reminderOn } from "../state/weeklyReminder.js";
import { turnReminderOff, turnReminderOn } from "../state/weeklyReminderPlan.js";

/**
 * 주 1회 알림's switch (N25, state/weeklyReminder.js), last in the comfort
 * settings, and only in a copy opened from the home screen
 * (AccessibilityPanel.jsx asks `reminderAvailability` before fetching this).
 * Off until tapped; the tap is what asks the browser for permission, and a
 * refusal leaves it off. A chunk of its own: it carries the calendar's words.
 */
export default function WeeklyReminderToggle({ scope = globalThis }) {
  const [on, setOn] = useState(reminderOn);
  const [denied, setDenied] = useState(() => reminderAvailability(scope) === "denied");
  const [openOnly, setOpenOnly] = useState(false);
  const [busy, setBusy] = useState(false);

  const change = async (wanted) => {
    setBusy(true);
    try {
      if (wanted) {
        const { permission, mode } = await turnReminderOn(scope);
        setOn(permission === "granted");
        setDenied(permission === "denied");
        setOpenOnly(mode === "open-only");
      } else {
        await turnReminderOff(scope);
        setOn(false);
        setOpenOnly(false);
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <label className="accessibility-toggle" data-testid="weekly-reminder">
      <input type="checkbox" checked={on} disabled={busy || (denied && !on)} onChange={(event) => change(event.target.checked)} />
      <span>
        <b>{reminderCopy.label}</b>
        <small>{reminderCopy.text}</small>
        {denied && <small role="status">{reminderCopy.denied}</small>}
        {on && openOnly && <small role="status">{reminderCopy.openOnly}</small>}
      </span>
    </label>
  );
}
