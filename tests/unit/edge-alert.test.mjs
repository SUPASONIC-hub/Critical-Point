import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { EDGE_ALERT_MAX_HZ, EDGE_ALERT_PERIOD_MS, edgeAlertLevel, edgeAlertPulses } from "../../src/gauntlet/edgeAlert.js";
import { DEFAULT_ACCESSIBILITY, normalizeAccessibility } from "../../src/state/accessibilitySettings.js";

const read = (path) => readFileSync(new globalThis.URL(`../../src/${path}`, import.meta.url), "utf8");
const css = read("styles/app/comfort.css");

test("위기 가장자리 알림 is off unless turned on, and only a boolean turns it on (A5)", () => {
  assert.equal(DEFAULT_ACCESSIBILITY.crisisEdge, false);
  assert.equal(normalizeAccessibility({ crisisEdge: true }).crisisEdge, true);
  assert.equal(normalizeAccessibility({ crisisEdge: "on" }).crisisEdge, false);
  assert.equal(normalizeAccessibility(null).crisisEdge, false, "a device that never stored it has it off");
});

test("the frame follows the 현재 위험 line's step, on a live table with the switch on", () => {
  assert.equal(edgeAlertLevel({ enabled: true, zone: "inReach", live: true }), "inReach");
  assert.equal(edgeAlertLevel({ enabled: true, zone: "inBand", live: true }), "inBand");
  assert.equal(edgeAlertLevel({ enabled: true, zone: "distance", live: true }), "", "a line at a distance draws none");
  assert.equal(edgeAlertLevel({ enabled: true, zone: "", live: true }), "", "nor a line not yet known");
  assert.equal(edgeAlertLevel({ enabled: true, zone: "toString", live: true }), "", "only the line's own steps");
  assert.equal(edgeAlertLevel({ enabled: false, zone: "inBand", live: true }), "", "the switch off draws none");
  assert.equal(edgeAlertLevel({ enabled: true, zone: "inBand", live: false }), "", "a held or closed table draws none");
});

test("reduced motion, the calm setting and a quiet table hold the frame still", () => {
  assert.equal(edgeAlertPulses(), true);
  assert.equal(edgeAlertPulses({ reducedMotion: true }), false);
  assert.equal(edgeAlertPulses({ calm: true }), false);
  assert.equal(edgeAlertPulses({ quiet: true }), false);
  // GauntletFx asks the two settings; the OS preference is the sheet's.
  const reduced = css.slice(css.lastIndexOf("@media (prefers-reduced-motion: reduce)"));
  assert.match(reduced, /\.gx-fx-edge\.is-pulsing\s*\{\s*animation: none;/);
});

test("the frame breathes under three times a second, at the periods the sheet gives it", () => {
  const seconds = (selector) => {
    const at = css.indexOf(`${selector} {`);
    assert.ok(at >= 0, `${selector} is in comfort.css`);
    const rule = css.slice(at, css.indexOf("}", at));
    return Number(rule.match(/(?:animation-duration:|animation: gx-edge-breathe) ([\d.]+)s/)[1]);
  };
  assert.equal(seconds(".gx-fx-edge.is-pulsing") * 1000, EDGE_ALERT_PERIOD_MS.inReach);
  assert.equal(seconds('.gx-fx-edge.is-pulsing[data-level="inBand"]') * 1000, EDGE_ALERT_PERIOD_MS.inBand);
  for (const period of Object.values(EDGE_ALERT_PERIOD_MS)) assert.ok(1000 / period < EDGE_ALERT_MAX_HZ, `${period}ms is under ${EDGE_ALERT_MAX_HZ}Hz`);
  assert.ok(EDGE_ALERT_MAX_HZ <= 3);
  // It dims and returns; it never goes out.
  const keyframes = css.slice(css.indexOf("@keyframes gx-edge-breathe"));
  const low = Number(keyframes.match(/opacity: ([\d.]+)/)[1]);
  assert.ok(low >= 0.3, "the low point is still a frame");
});

test("the frame takes no room and covers nothing: a shadow on the fixed overlay", () => {
  const start = css.indexOf(".gx-fx-edge {");
  const rules = css.slice(start, css.indexOf("@keyframes gx-edge-breathe"));
  assert.doesNotMatch(rules, /\b(?:border|margin|padding|width|height|outline|background)\s*:/, "only a shadow and its opacity");
  for (const [, inset, blur] of rules.matchAll(/inset 0 0 (\d+)px(?: (\d+)px)?/g)) {
    assert.ok(Number(inset) <= 14 && Number(blur ?? 0) <= 4, "a few pixels at the edge");
  }
  const fx = read("gauntlet/GauntletFx.jsx");
  assert.match(fx, /className=\{`gx-fx-edge/);
  assert.match(fx, /aria-hidden="true"/, "inside the overlay a screen reader skips");
});

test("the switch is in the comfort panel, worded in Korean, English and Japanese", async () => {
  const { default: ko } = await import("../../src/copy/comfort.js");
  const { default: en } = await import("../../src/locales/en/screens/comfort.js");
  const { default: ja } = await import("../../src/locales/ja/screens/comfort.js");
  for (const copy of [ko, en, ja]) {
    assert.ok(copy.toggles.crisisEdge.label.length > 0);
    assert.ok(copy.toggles.crisisEdge.text.length > 0);
  }
  assert.equal(ko.toggles.crisisEdge.label, "위기 가장자리 알림");
  assert.notEqual(en.toggles.crisisEdge.label, ko.toggles.crisisEdge.label);
  assert.notEqual(ja.toggles.crisisEdge.label, ko.toggles.crisisEdge.label);
});
