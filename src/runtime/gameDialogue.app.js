// The app build's gameDialogue.js (scripts/vite-season-data.mjs swaps it in).
import { season } from "virtual:season";
import { localizeTables } from "../locale.js";

export const { characterProfiles, choiceVoiceLines, getCharacterProfile } = season;

// The profiles in the page's language (src/gameDialogue.js says why).
localizeTables("gameDialogue", { characterProfiles });
