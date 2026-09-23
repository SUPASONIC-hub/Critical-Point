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
 *
 * The 프롤로그 is five packs of the same shape, and they are listed first
 * because that is the order they play in -- though this list does not decide
 * that either. They are what 사건 01 used to begin without: the loan review the
 * analyst dissented on, who rejected it, who sold it at a counter, and the day
 * the dissent became a posting to 트리거랩.
 */
import { prologue01 } from "./prologue01.js";
import { prologue02 } from "./prologue02.js";
import { prologue03 } from "./prologue03.js";
import { prologue04 } from "./prologue04.js";
import { prologue05 } from "./prologue05.js";
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
import { case25 } from "./case25.js";
import { case26 } from "./case26.js";
import { case27 } from "./case27.js";
import { case28 } from "./case28.js";
import { case29 } from "./case29.js";
import { case30 } from "./case30.js";
import { case31 } from "./case31.js";
import { case32 } from "./case32.js";
import { case33 } from "./case33.js";
import { case34 } from "./case34.js";
import { case35 } from "./case35.js";
import { case36 } from "./case36.js";
import { case37 } from "./case37.js";
import { case38 } from "./case38.js";
import { case39 } from "./case39.js";
import { case40 } from "./case40.js";
import { case41 } from "./case41.js";
import { case42 } from "./case42.js";
import { case43 } from "./case43.js";
import { case44 } from "./case44.js";
import { case45 } from "./case45.js";
import { case46 } from "./case46.js";
import { case47 } from "./case47.js";
import { case48 } from "./case48.js";
import { case49 } from "./case49.js";

export const CASE_PACKS = [
  prologue01,
  prologue02,
  prologue03,
  prologue04,
  prologue05,
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
  case25,
  case26,
  case27,
  case28,
  case29,
  case30,
  case31,
  case32,
  case33,
  case34,
  case35,
  case36,
  case37,
  case38,
  case39,
  case40,
  case41,
  case42,
  case43,
  case44,
  case45,
  case46,
  case47,
  case48,
  case49,
];
