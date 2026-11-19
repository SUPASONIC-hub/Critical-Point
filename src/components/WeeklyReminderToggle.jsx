import { useState } from "react";
import reminderCopy from "../copy/reminder.js";
import { reminderAvailability, reminderOn } from "../state/weeklyReminder.js";
import { turnReminderOff, turnReminderOn } from "../state/weeklyReminderPush.js";

/**
 * 주 1회 알림's switch (N25, state/weeklyReminder.js), last in the comfort
 * settings, and only in a copy opened from the home screen of a build with a
 * Web Push key (AccessibilityPanel.jsx asks `reminderAvailability` before
 * fetching this). Off until tapped; the tap is what asks the browser for
 * permission, and a refusal, or a subscription the server could not store,
 * leaves it off.
 */
export default function WeeklyReminderToggle({ scope = globalThis }) {
  const [on, setOn] = useState(reminderOn);
  const [denied, setDenied] = useState(() => reminderAvailability(scope) === "denied");
  const [failed, setFailed] = useState(false);
  const [busy, setBusy] = useState(false);

  const change = async (wanted) => {
    setBusy(true);
    setFailed(false);
    try {
      if (wanted) {
        const { permission, on: stored } = await turnReminderOn({ scope });
        setOn(stored);
        setDenied(permission === "denied");
        setFailed(permission === "granted" && !stored);
      } else {
        await turnReminderOff({ scope });
        setOn(false);
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
        {failed && <small role="status">{reminderCopy.failed}</small>}
      </span>
    </label>
  );
}
