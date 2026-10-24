/**
 * E-11: what the side screen (screens/SideCaseScreen.jsx) plays a side case
 * with -- the side run (state/sideRun.js), the two readers of a scene the
 * table's header takes, the reading tally's keeper, and the table itself. GameRuntime.jsx
 * re-exports it, so it rides in the runtime's chunk, which holds the table's
 * modules already, and the side screen's own chunk stays a screen.
 */
import { getSpeakerPortrait } from "../speakerPortraits.js";
import { createSpeakerProfile } from "../viewModels/sceneViewModels.js";
import { loadedChunk } from "./chunkReload.js";
import { keepReadingTally } from "./readingTally.js";
import * as sideRun from "./sideRun.js";

export const sideCaseKit = {
  ...sideRun,
  getSpeakerPortrait,
  getSpeakerRole: (node) => createSpeakerProfile({ node }).role,
  keepReadingTally,
  // The play screen's table, fetched from here rather than from the side
  // screen: the play screen's chunk is then only ever loaded by this chunk,
  // as before, and the bundler keeps the files the two share as they were.
  loadStage: () => import("../screens/PlayScreen.jsx").then(loadedChunk).then(({ GauntletStage }) => GauntletStage),
};
