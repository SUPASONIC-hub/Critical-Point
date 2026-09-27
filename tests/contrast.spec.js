import { expect, test } from "@playwright/test";
import { cashStakedCard, dismissProtocolBreach } from "./helpers/gameFlow.js";

/**
 * Guards against text the eye cannot read.
 *
 * The stylesheet mixes light and dark panels, so a colour that is correct on
 * one surface is invisible on another. This walks every element that owns text,
 * composites the painted background stack behind it (background-color plus any
 * gradient stops, up to the first opaque layer) and checks the WCAG AA ratio.
 * Photographic backgrounds are reported separately because a flat ratio cannot
 * describe them.
 */
const COLLECT = () => {
  const parse = (s) => {
    const m = String(s).match(/rgba?\(([^)]+)\)/);
    if (!m) return null;
    const p = m[1].split(/[,\s/]+/).filter(Boolean).map(Number);
    return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 };
  };
  const lum = ({ r, g, b }) => {
    const f = (c) => {
      const s = c / 255;
      return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
    };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  };
  const over = (fg, bg) => ({
    r: fg.r * fg.a + bg.r * (1 - fg.a),
    g: fg.g * fg.a + bg.g * (1 - fg.a),
    b: fg.b * fg.a + bg.b * (1 - fg.a),
    a: 1,
  });
  const ratio = (a, b) => {
    const l1 = lum(a);
    const l2 = lum(b);
    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  };

  function ownLayers(el) {
    const st = getComputedStyle(el);
    const layers = [];
    let opaque = false;
    const bi = st.backgroundImage;
    if (bi && bi !== "none") {
      if (/url\(|image-set\(/.test(bi)) layers.push({ photo: true });
      for (const m of bi.matchAll(/rgba?\([^)]+\)/g)) {
        const c = parse(m[0]);
        if (c && c.a > 0) {
          layers.push({ c });
          if (c.a >= 0.92) opaque = true;
        }
      }
    }
    const bc = parse(st.backgroundColor);
    if (bc && bc.a > 0) {
      layers.push({ c: bc });
      if (bc.a >= 0.92) opaque = true;
    }
    return { layers, opaque };
  }

  function backgrounds(el) {
    const stack = [];
    let cur = el;
    let photo = false;
    while (cur) {
      const { layers, opaque } = ownLayers(cur);
      stack.push(layers);
      if (opaque) break;
      cur = cur.parentElement;
    }
    let bases = [{ r: 255, g: 255, b: 255, a: 1 }];
    for (let i = stack.length - 1; i >= 0; i -= 1) {
      const layers = stack[i];
      for (let j = layers.length - 1; j >= 0; j -= 1) {
        const l = layers[j];
        if (l.photo) {
          photo = true;
          continue;
        }
        bases = bases.map((b) => over(l.c, b));
        if (l.c.a >= 1) bases = [bases[bases.length - 1]];
      }
      const stops = layers.filter((l) => !l.photo).map((l) => l.c);
      if (stops.length > 1) {
        const widened = [];
        for (const b of bases) for (const c of stops) widened.push(c.a >= 1 ? c : over(c, b));
        bases = widened.slice(0, 8);
      }
    }
    return { bases, photo };
  }

  const findings = [];
  for (const el of document.querySelectorAll("body *")) {
    const own = Array.from(el.childNodes)
      .filter((n) => n.nodeType === 3)
      .map((n) => n.textContent.trim())
      .join(" ")
      .trim();
    if (!own) continue;
    const st = getComputedStyle(el);
    if (st.display === "none" || st.visibility === "hidden" || Number(st.opacity) < 0.15) continue;
    const box = el.getBoundingClientRect();
    if (box.width === 0 || box.height === 0) continue;
    // Visually hidden text is announced, never painted, so its ratio against
    // whatever happens to be behind it means nothing. The 1x1 clipped box is
    // the .sr-only signature (src/styles/app/base-intro-ranking.css:67): it
    // reported 1.01:1 the moment the page ground stopped being light, which is
    // a fact about the utility, not about anything a reader can see.
    if (box.width <= 1 && box.height <= 1 && (st.clip !== "auto" || st.clipPath !== "none")) continue;

    const fg0 = parse(st.color);
    if (!fg0) continue;
    const { bases, photo } = backgrounds(el);
    if (photo) continue;

    let worst = null;
    for (const bg of bases) {
      const fg = fg0.a < 1 ? over(fg0, bg) : fg0;
      const r = ratio(fg, bg);
      if (!worst || r < worst.r) worst = { r, bg };
    }
    const size = parseFloat(st.fontSize);
    const weight = Number(st.fontWeight) || 400;
    const need = size >= 24 || (size >= 18.66 && weight >= 700) ? 3 : 4.5;
    if (worst.r >= need) continue;

    findings.push(
      `${el.tagName.toLowerCase()}${typeof el.className === "string" && el.className ? "." + el.className.trim().split(/\s+/).join(".") : ""}` +
        ` — ${st.color} on rgb(${Math.round(worst.bg.r)} ${Math.round(worst.bg.g)} ${Math.round(worst.bg.b)})` +
        ` = ${worst.r.toFixed(2)}:1 (needs ${need}:1) — "${own.slice(0, 40)}"`,
    );
  }
  return findings;
};

const openDrawers = (page) => page.evaluate(() => document.querySelectorAll("details").forEach((d) => (d.open = true)));

/**
 * Colours are read once the screen has stopped changing: every drawer open
 * (opening one can mount another), and every finite animation and transition
 * finished. It used to be two fixed pauses of 200 and 150ms, which measured a
 * fading panel mid-fade whenever a frame ran slow. Infinite animations -- the
 * heartbeat, the gauge glow -- never finish and are left running.
 */
async function settle(page) {
  await expect
    .poll(async () => {
      await openDrawers(page);
      return page.evaluate(() => [...document.querySelectorAll("details")].every((details) => details.open));
    })
    .toBe(true);
  await page.evaluate(async () => {
    const finite = () =>
      document.getAnimations().filter((animation) => {
        const timing = animation.effect?.getComputedTiming();
        return animation.playState === "running" && timing && Number.isFinite(timing.endTime);
      });
    for (let round = 0; round < 5 && finite().length; round += 1) {
      await Promise.all(finite().map((animation) => animation.finished.catch(() => undefined)));
    }
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  });
}

async function collect(page) {
  await settle(page);
  return page.evaluate(COLLECT);
}

async function startAt(page, caseId, nodeId) {
  await page.goto("/?debug=1");
  await page.evaluate(() => {
    try {
      localStorage.clear();
    } catch {
      /* private mode */
    }
  });
  await page.goto("/?debug=1");
  await page.waitForSelector(".intro-shell");
  await page.getByTestId("debug-case-select").selectOption(caseId);
  await page.getByTestId("debug-node-select").selectOption(nodeId);
  await page.getByTestId("debug-start-node").click();
  await page.waitForSelector(".game-shell");
  // The window opens on its briefing page with the clock held; contrast is
  // measured on the live table.
  await dismissProtocolBreach(page);
}

test("intro and scene text stays readable against its panel", async ({ page }) => {
  await page.goto("/?debug=1");
  await page.waitForSelector(".intro-shell");
  expect(await collect(page)).toEqual([]);

  for (const [caseId, nodeId] of [["case01", "start"], ["case03", "c3_trap"], ["final", "f_archive"]]) {
    await startAt(page, caseId, nodeId);
    expect(await collect(page), `${caseId}/${nodeId}`).toEqual([]);
  }
});

test("the table and decision reveal stay readable", async ({ page }) => {
  await startAt(page, "case01", "start");

  await page.locator(".choices .choice").first().click();
  await page.waitForSelector(".gx-card.selected");
  expect(await collect(page), "gauntlet table").toEqual([]);

  await page.getByTestId("commit-confirm").click();
  await page.waitForSelector("[data-testid='decision-next']");
  expect(await collect(page), "decision reveal").toEqual([]);
});

test("the report and ending sequence stay readable", async ({ page }) => {
  test.setTimeout(90_000);
  await startAt(page, "final", "f_aftershock");

  // Play the last scenes until the report or the ending is up. The loop used to
  // end quietly when it ran out of steps, and the checks below then measured
  // whatever screen it had stopped on; reaching the target is now asserted.
  const finished = page.locator(".result-page, .ending-sequence").first();
  const liveChoice = page.locator(".choices .choice:not([aria-disabled='true'])").first();
  const next = page.getByTestId("decision-next");
  for (let step = 0; step < 8; step += 1) {
    await dismissProtocolBreach(page);
    await expect(finished.or(liveChoice).first()).toBeVisible();
    if (await finished.isVisible()) break;
    await liveChoice.click();
    await cashStakedCard(page);
    await expect(next.or(finished).first()).toBeVisible();
    if (await next.isVisible()) {
      await next.click();
      await expect(page.locator(".decision-reveal-backdrop")).toHaveCount(0);
    }
  }
  await expect(finished, "the walk reached the report or the ending").toBeVisible();

  for (let step = 0; step < 4; step += 1) {
    expect(await collect(page), `ending step ${step}`).toEqual([]);
    const advance = page.locator(".ending-sequence button").first();
    if (!(await advance.isVisible())) break;
    const before = await page.locator(".ending-sequence").innerText();
    await advance.click();
    // The next step is a new screen of text, not a pause.
    await expect.poll(() => page.locator(".ending-sequence, .result-page").first().innerText()).not.toBe(before);
  }
});
