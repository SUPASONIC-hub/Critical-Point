import { expect, test } from "@playwright/test";

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

async function collect(page) {
  await openDrawers(page);
  await page.waitForTimeout(200);
  await openDrawers(page);
  await page.waitForTimeout(150);
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

test("the commit console and decision reveal stay readable", async ({ page }) => {
  await startAt(page, "case01", "start");

  await page.locator(".choices .choice").first().evaluate((button) => button.click());
  await page.waitForSelector(".commit-console");
  expect(await collect(page), "commit console").toEqual([]);

  await page.getByTestId("commit-confirm").evaluate((button) => button.click());
  await page.waitForSelector("[data-testid='decision-next']");
  expect(await collect(page), "decision reveal").toEqual([]);
});

test("the report and ending sequence stay readable", async ({ page }) => {
  test.setTimeout(90_000);
  await startAt(page, "final", "f_aftershock");

  for (let step = 0; step < 8; step += 1) {
    if (await page.locator(".result-page, .ending-sequence").first().isVisible().catch(() => false)) break;
    if (!(await page.locator(".choices .choice").count())) break;
    await page.locator(".choices .choice").first().evaluate((button) => button.click());
    const commit = page.getByTestId("commit-confirm");
    if (await commit.isVisible().catch(() => false)) await commit.evaluate((button) => button.click());
    await page.waitForTimeout(300);
    await page.evaluate(() => document.querySelector("[data-testid='decision-next']")?.click());
    await page.waitForTimeout(250);
  }

  for (let step = 0; step < 4; step += 1) {
    expect(await collect(page), `ending step ${step}`).toEqual([]);
    const next = page.locator(".ending-sequence button").first();
    if (!(await next.isVisible().catch(() => false))) break;
    await next.evaluate((button) => button.click());
    await page.waitForTimeout(400);
  }
});
