import { useEffect } from "react";
import { applyMood } from "../mood.js";

/**
 * The page's mood follows the screen: the shown scene's `mood` on the table
 * (src/mood.js; the build writes it on tagged scenes), neutral on the start,
 * result, ranking and board screens, and neutral again when the runtime goes.
 * Two effects, not one with a cleanup: a cleanup that said neutral between two
 * scenes would have the music start a fade to neutral it then had to undo.
 */
export function useSceneMood(mood) {
  useEffect(() => {
    applyMood(mood);
  }, [mood]);
  useEffect(() => () => applyMood("neutral"), []);
}
