/**
 * The cases that arrive as one file each.
 *
 * Cases 01-11 were written into the season's shared tables -- aftermath,
 * connective and reaction scenes, their effects and copy, the side door, the
 * hidden route, the evidence turn, the openings, the voice and echo lines, the
 * scene context, the clue and the three outcome tables -- so adding a case
 * meant editing some twenty places in four files. From 사건 12 on, a case is a
 * pack: one object with a field for each of those tables, merged by the module
 * that owns the table (`gameData.js`, `gameLogic.js`, `sceneContext.js`). The
 * season order still lives in `CASE_SEQUENCE`; this list only says which cases
 * carry their own tables.
 */
import { case12 } from "./case12.js";
import { case13 } from "./case13.js";
import { case14 } from "./case14.js";
import { case15 } from "./case15.js";
import { case16 } from "./case16.js";
import { case17 } from "./case17.js";
import { case18 } from "./case18.js";
import { case19 } from "./case19.js";
import { case20 } from "./case20.js";
import { case21 } from "./case21.js";
import { case22 } from "./case22.js";
import { case23 } from "./case23.js";
import { case24 } from "./case24.js";

export const CASE_PACKS = [
  case12,
  case13,
  case14,
  case15,
  case16,
  case17,
  case18,
  case19,
  case20,
  case21,
  case22,
  case23,
  case24,
];
