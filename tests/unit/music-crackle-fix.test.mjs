import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { afterEach, test } from "node:test";

import { musicModes } from "../../src/components/musicData.js";
import {
  CRACKLE_FIX_BEFORE,
  createSceneMode,
  DRIVE_CEILING,
  isCrackleFixOn,
  setCrackleFix,
} from "../../src/components/musicScore.js";

// The 11-10 crackle in 불안 and 위기 (musicScore.js, CRACKLE_FIX_BEFORE).
const music = readFileSync(new URL("../../src/components/AdaptiveMusic.jsx", import.meta.url), "utf8");
const lab = readFileSync(new URL("../../src/dev/musicLab.jsx", import.meta.url), "utf8");
const scene = (tier) => `${tier}:case03:scene:voice:0:public`;

afterEach(() => setCrackleFix(true));

test("the fix is on unless the music lab turns it off", () => {
  assert.equal(isCrackleFixOn(), true);
  setCrackleFix(false);
  assert.equal(isCrackleFixOn(), false);
  setCrackleFix(true);
  assert.equal(isCrackleFixOn(), true);
  // Only the dev page calls the switch.
  assert.match(lab, /setCrackleFix\(on\)/);
  assert.doesNotMatch(music, /setCrackleFix/);
});

test("불안 and 위기 hold their bass out of the drive, trimmed, with a little less drive", () => {
  assert.deepEqual(
    { drive: musicModes.unstable.drive, bassPastDrive: musicModes.unstable.bassPastDrive, bassLevel: musicModes.unstable.bassLevel },
    { drive: 0.06, bassPastDrive: true, bassLevel: 0.6 },
  );
  assert.deepEqual(
    { drive: musicModes.critical.drive, bassPastDrive: musicModes.critical.bassPastDrive, bassLevel: musicModes.critical.bassLevel },
    { drive: 0.12, bassPastDrive: true, bassLevel: 0.6 },
  );
  for (const tier of ["unstable", "critical"]) {
    const mode = createSceneMode(scene(tier));
    assert.equal(mode.bassPastDrive, true, tier);
    assert.equal(mode.bassLevel, 0.6, tier);
    assert.ok(mode.drive < CRACKLE_FIX_BEFORE[tier].drive * mode.impact + 1e-9, tier);
    assert.ok(mode.drive > 0, `${tier} keeps some grit`);
  }
  // The tiers still climb: critical drives harder than unstable.
  assert.ok(createSceneMode(scene("critical")).drive > createSceneMode(scene("unstable")).drive);
});

test("turned off, the tiers play as they did before 11-10", () => {
  setCrackleFix(false);
  for (const tier of ["unstable", "critical"]) {
    const mode = createSceneMode(scene(tier));
    assert.equal(mode.bassPastDrive, false, tier);
    assert.equal(mode.bassLevel, 1, tier);
    assert.equal(mode.drive, Math.min(DRIVE_CEILING, CRACKLE_FIX_BEFORE[tier].drive * mode.impact), tier);
  }
  assert.equal(createSceneMode(scene("critical")).drive, DRIVE_CEILING);
});

test("the other scores are untouched either way", () => {
  for (const key of ["intro:menu", scene("controlled"), "result:case01", "result:final:0", "reveal:gain"]) {
    const fixed = createSceneMode(key);
    setCrackleFix(false);
    const before = createSceneMode(key);
    setCrackleFix(true);
    assert.deepEqual(fixed, before, key);
    assert.equal(fixed.bassPastDrive, false, key);
    assert.equal(fixed.bassLevel, 1, key);
  }
});

test("the dry path is delayed with the shaper's oversampling, and the bass goes to the clean bus", () => {
  // Same oversampling on an identity curve: dry and wet arrive together (no comb at 187 / 562 / 937 Hz).
  assert.match(music, /aligner\.curve = new Float32Array\(\[-1, 1\]\);/);
  assert.match(music, /aligner\.oversample = shaper\.oversample;/);
  assert.match(music, /input\.connect\(alignIn\);\n\s*alignIn\.connect\(aligner\);\n\s*aligner\.connect\(dry\);/);
  assert.match(music, /alignIn\.gain\.value = 1 \/ DRY_HEADROOM;/);
  // The two dry paths are only ever ramped, never set, on a change.
  assert.match(music, /drive\.dry\.gain\.setTargetAtTime\(aligned \? dry \* DRY_HEADROOM : 0, now, 0\.15\)/);
  assert.match(music, /drive\.dryUnaligned\.gain\.setTargetAtTime\(aligned \? 0 : dry, now, 0\.15\)/);
  assert.match(music, /currentMode\.bassPastDrive \? \(audioRuntime\.clean \?\? destination\) : destination/);
  assert.match(music, /BASS_GAIN \* impact \* texture\.bass \* currentMode\.bassLevel/);
});
