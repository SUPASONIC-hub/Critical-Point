import { useEffect, useState } from "react";
import { weekHasNews } from "../gauntlet/weeklyCalendar.js";
import { loadedChunk, quietImport } from "../state/chunkReload.js";
import { weeklyRuleNow } from "../state/weeklyClock.js";
import { setWeekRuleTurnedDown, weekRuleTurnedDown } from "../state/weeklyRuleChoice.js";

/**
 * Where 이번 주의 규칙 shows on the start screen (`view="line"`) and the
 * ranking screen (`view="boards"`). The words and the controls are a chunk of
 * their own (WeeklyRuleViews.jsx), fetched only when the calendar has this
 * week or the next: most weeks, and every test build (whose weekly clock is
 * held on a week without a rule), fetch nothing and draw nothing.
 *
 * Fetched by hand, like the online-save panel's body: a chunk that fails here
 * leaves the line out rather than throwing into the root boundary.
 */
let views = null;

export function WeeklyRuleNotice({ view = "line", now }) {
  const at = now ?? weeklyRuleNow();
  const news = weekHasNews(at);
  const [loaded, setLoaded] = useState(views);

  useEffect(() => {
    if (!news || loaded) return undefined;
    let cancelled = false;
    quietImport(() => import("./WeeklyRuleViews.jsx").then(loadedChunk))
      .then((module) => {
        views = module;
        if (!cancelled) setLoaded(module);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [news, loaded]);

  if (!news || !loaded) return null;
  if (view === "boards") return <loaded.WeekBoards now={at} />;
  return <loaded.WeeklyRuleLine now={at} turnedDown={weekRuleTurnedDown} turnDown={setWeekRuleTurnedDown} />;
}
