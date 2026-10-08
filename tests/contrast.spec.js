import { expect, test } from "./helpers/network.js";
import { cashStakedCard, dismissProtocolBreach } from "./helpers/gameFlow.js";

/**
 * Guards against text the eye cannot read.
 *
 * The stylesheet mixes light and dark panels, so a colour that is correct on
 * one surface is invisible on another. This walks every element that owns text,
 * composites the painted background stack behind it (background-color plus any
 * gradient stops, up to the first opaque layer) and checks the WCAG AA ratio.
 *
 * That composite knows only what CSS says about the element and its ancestors.
 * Two kinds of text stand on something it cannot know, and both used to pass
 * whatever was painted there (the 2026-10-07 audit, B4 finding 2):
 *
 *   - a photograph: a `url()` background somewhere in the stack. The header
 *     above said these were "reported separately"; the code said `continue`.
 *   - a sibling layer: a picture or a scrim that is not an ancestor of the text
 *     but is drawn behind it -- the ending's <img> and its scrim, the SVG plate
 *     behind the table's header.
 *
 * Those are marked here and measured from the pixels (`MEASURE_PAINTED`): the
 * text is made transparent, the screen is photographed, and the colour of the
 * text is held against what is actually behind each line of it.
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

  // What can be drawn behind text without being its ancestor: pictures, and
  // boxes laid over or under others by position. Small ones are icons.
  const layers = [...document.querySelectorAll("body img, body svg, body canvas, body video, body *")]
    .filter((el) => {
      const st = getComputedStyle(el);
      if (st.display === "none" || st.visibility === "hidden" || Number(st.opacity) === 0) return false;
      const picture = /^(img|svg|canvas|video)$/i.test(el.tagName);
      const laid = (st.position === "absolute" || st.position === "fixed") && ownLayers(el).layers.length > 0;
      if (!picture && !laid) return false;
      const box = el.getBoundingClientRect();
      return box.width >= 48 && box.height >= 24;
    })
    .map((el) => ({ el, box: el.getBoundingClientRect() }));

  /** The element's first ancestor with an opaque background of its own: nothing outside it shows through. */
  function opaqueHome(el) {
    for (let cur = el; cur; cur = cur.parentElement) if (ownLayers(cur).opaque) return cur;
    return document.body;
  }

  function siblingLayerBehind(el, box) {
    const home = opaqueHome(el);
    if (home === el) return null;
    return (
      layers.find(({ el: layer, box: other }) => {
        if (layer === el || layer.contains(el) || el.contains(layer) || !home.contains(layer) || layer === home) return false;
        const width = Math.min(box.right, other.right) - Math.max(box.left, other.left);
        const height = Math.min(box.bottom, other.bottom) - Math.max(box.top, other.top);
        return width > 0 && height > 0 && width * height >= box.width * box.height * 0.5;
      })?.el ?? null
    );
  }

  const findings = [];
  const painted = [];
  window.__contrastPainted = painted;
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
    const size = parseFloat(st.fontSize);
    const weight = Number(st.fontWeight) || 400;
    const need = size >= 24 || (size >= 18.66 && weight >= 700) ? 3 : 4.5;
    const name = `${el.tagName.toLowerCase()}${typeof el.className === "string" && el.className ? "." + el.className.trim().split(/\s+/).join(".") : ""}`;
    const layer = photo ? null : siblingLayerBehind(el, box);
    if (photo || layer) {
      // Not a ratio the composite can give: measured from the screen instead.
      painted.push({ el, name, color: fg0, need, own: own.slice(0, 40), behind: photo ? "a photograph" : `${layer.tagName.toLowerCase()}.${String(layer.getAttribute("class") ?? "").trim().split(/\s+/).join(".")}` });
      if (photo) continue;
    }

    let worst = null;
    for (const bg of bases) {
      const fg = fg0.a < 1 ? over(fg0, bg) : fg0;
      const r = ratio(fg, bg);
      if (!worst || r < worst.r) worst = { r, bg };
    }
    if (worst.r >= need) continue;

    findings.push(
      name +
        ` — ${st.color} on rgb(${Math.round(worst.bg.r)} ${Math.round(worst.bg.g)} ${Math.round(worst.bg.b)})` +
        ` = ${worst.r.toFixed(2)}:1 (needs ${need}:1) — "${own.slice(0, 40)}"`,
    );
  }
  return findings;
};

/**
 * The marked text against the photographed screen. `shot` is the viewport with
 * every glyph transparent, one image pixel to a CSS pixel. Each line box of the
 * text is sampled on a 3px grid, and the ratio reported is the one a twentieth
 * of the samples fall under: a hairline or a panel's edge crossing the text is
 * not what it is read against, and a band of the picture is.
 *
 * Text that is off the screen, or under something else, is not measured: there
 * is nothing of it in the photograph.
 */
const MEASURE_PAINTED = async (shot) => {
  const bitmap = await createImageBitmap(await (await fetch(`data:image/png;base64,${shot}`)).blob());
  const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
  const context = canvas.getContext("2d", { willReadFrequently: true });
  context.drawImage(bitmap, 0, 0);
  const pixels = context.getImageData(0, 0, bitmap.width, bitmap.height).data;
  const lum = ({ r, g, b }) => {
    const f = (c) => {
      const s = c / 255;
      return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
    };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  };
  const ratio = (a, b) => (Math.max(lum(a), lum(b)) + 0.05) / (Math.min(lum(a), lum(b)) + 0.05);
  const findings = [];
  let measured = 0;
  for (const { el, name, color, need, own, behind } of window.__contrastPainted ?? []) {
    const ratios = [];
    for (const node of el.childNodes) {
      if (node.nodeType !== 3 || !node.textContent.trim()) continue;
      const range = document.createRange();
      range.selectNodeContents(node);
      for (const rect of range.getClientRects()) {
        for (let y = rect.top + 1; y < rect.bottom; y += 3) {
          for (let x = rect.left + 1; x < rect.right; x += 3) {
            if (x < 0 || y < 0 || x >= bitmap.width || y >= bitmap.height) continue;
            const hit = document.elementFromPoint(x, y);
            // Under another element, or scrolled out of its box: not on the photograph.
            if (!hit || !(hit === el || el.contains(hit) || hit.contains(el))) continue;
            const at = (Math.floor(y) * bitmap.width + Math.floor(x)) * 4;
            const bg = { r: pixels[at], g: pixels[at + 1], b: pixels[at + 2] };
            const fg = color.a < 1 ? { r: color.r * color.a + bg.r * (1 - color.a), g: color.g * color.a + bg.g * (1 - color.a), b: color.b * color.a + bg.b * (1 - color.a) } : color;
            ratios.push(ratio(fg, bg));
          }
        }
      }
    }
    if (ratios.length < 8) continue;
    measured += 1;
    ratios.sort((a, b) => a - b);
    const low = ratios[Math.floor(ratios.length * 0.05)];
    if (low < need) findings.push(`${name} — rgb(${color.r} ${color.g} ${color.b}) over ${behind} = ${low.toFixed(2)}:1 (needs ${need}:1) — "${own}"`);
  }
  return { findings, measured, marked: (window.__contrastPainted ?? []).length };
};

const HIDE_GLYPHS = "*, *::before, *::after { color: transparent !important; -webkit-text-fill-color: transparent !important; text-shadow: none !important; caret-color: transparent !important; }";

const openDrawers = (page) => page.evaluate(() => document.querySelectorAll("details").forEach((d) => (d.open = true)));

/**
 * Colours are read once the screen has stopped changing: every drawer open
 * (opening one can mount another), and every finite animation and transition
 * finished. It used to be two fixed pauses of 200 and 150ms, which measured a
 * fading panel mid-fade whenever a frame ran slow. Infinite animations -- the
 * heartbeat, the gauge glow -- never finish and are left running.
 */
async function settle(page, { drawers = true } = {}) {
  if (drawers) {
    await expect
      .poll(async () => {
        await openDrawers(page);
        return page.evaluate(() => [...document.querySelectorAll("details")].every((details) => details.open));
      })
      .toBe(true);
  }
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

/** Text over a photograph or a sibling layer, measured from the screen. Call after `collect`, which marks it. */
async function collectPainted(page) {
  const marked = await page.evaluate(() => (window.__contrastPainted ?? []).length);
  if (!marked) return { findings: [], measured: 0, marked: 0 };
  const style = await page.addStyleTag({ content: HIDE_GLYPHS });
  const shot = await page.screenshot({ scale: "css", animations: "disabled", caret: "hide" });
  await style.evaluate((node) => node.remove());
  return page.evaluate(MEASURE_PAINTED, shot.toString("base64"));
}

async function collect(page) {
  await settle(page);
  return page.evaluate(COLLECT);
}

/**
 * Lines the pixel reading finds under their ratio and nobody has yet decided
 * how to fix. An entry is `{ screen, text, measured, floor }`: it is listed so
 * the reading can be on for everything else, and held to the ratio it measured
 * -- it may not get worse, and a new line may not join it. On a phone-sized
 * screen an entry that is no longer found fails too, so a fix is noticed and
 * the entry taken out with it. Do not add one without a decision.
 *
 * Empty since the two it began with (2026-10-08) were fixed: on a phone the
 * intro's 臨界點 (3.02:1) and its premise paragraph (3.08:1) stood on the bright
 * band of the key visual, and the reading line now carries its own shade.
 */
const PHONE_WIDTH = 480;
const KNOWN_OVER_A_PICTURE = [];

/** Both readings of one screen. Returns how much text was measured from the pixels. */
async function expectReadable(page, label) {
  expect(await collect(page), label).toEqual([]);
  const painted = await collectPainted(page);
  const unknown = painted.findings.filter((finding) => {
    const known = KNOWN_OVER_A_PICTURE.find((entry) => entry.screen === label && finding.includes(`"${entry.text}`));
    return !known || Number(finding.match(/= ([\d.]+):1/)?.[1]) < known.floor;
  });
  expect(unknown, `${label}: text over a picture`).toEqual([]);
  if (page.viewportSize().width <= PHONE_WIDTH) {
    const fixed = KNOWN_OVER_A_PICTURE.filter((entry) => entry.screen === label && !painted.findings.some((finding) => finding.includes(`"${entry.text}`)));
    expect(
      fixed.map((entry) => entry.text),
      `${label}: these lines now read at 4.5:1 or better over the picture. Take them out of KNOWN_OVER_A_PICTURE`,
    ).toEqual([]);
  }
  return painted.measured;
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
  await expectReadable(page, "intro");

  for (const [caseId, nodeId] of [["case01", "start"], ["case03", "c3_trap"], ["final", "f_archive"]]) {
    await startAt(page, caseId, nodeId);
    const measured = await expectReadable(page, `${caseId}/${nodeId}`);
    // The header stands on the scene's plate, an SVG that is its sibling.
    expect(measured, `${caseId}/${nodeId}: the header over its plate was measured`).toBeGreaterThan(0);
  }
});

test("the table and decision reveal stay readable", async ({ page }) => {
  await startAt(page, "case01", "start");

  await page.locator(".choices .choice").first().click();
  await page.waitForSelector(".gx-card.selected");
  await expectReadable(page, "gauntlet table");

  await page.getByTestId("commit-confirm").click();
  await page.waitForSelector("[data-testid='decision-next']");
  await expectReadable(page, "decision reveal");
});

/**
 * On a phone the question runs the whole width of the plate behind it, so the
 * plate fades as the question grows (`--gx-question`, plate.css). The season's
 * shortest question keeps the room as it was drawn. Its longest is four lines
 * at this width: it stands on a fainter room, and is measured from the pixels
 * like every other line over a picture. A wide screen keeps the room whatever
 * the question is.
 */
test("a long question on a phone stands on a fainter picture and stays readable", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const plate = page.locator(".gx-scene .gx-plate-backdrop");
  const opacity = () => plate.evaluate((element) => Number(getComputedStyle(element).opacity));
  const lines = () =>
    page.locator(".gx-question").evaluate((element) => {
      const range = document.createRange();
      range.selectNodeContents(element);
      return new Set([...range.getClientRects()].map((rect) => Math.round(rect.top))).size;
    });

  await startAt(page, "case05", "c5_final_redesign_route");
  // Polled: the table has only just taken the briefing's place.
  await expect.poll(lines, "the shortest question is one or two lines").toBeLessThanOrEqual(2);
  await expect.poll(opacity, "a short question keeps the room as drawn").toBeCloseTo(0.78, 2);

  await startAt(page, "case02", "c2_trace");
  await expect.poll(lines, "the longest question is more than two lines").toBeGreaterThan(2);
  await expect.poll(opacity, "the room behind a long question is fainter").toBeLessThanOrEqual(0.5);
  expect(await opacity(), "and is still a room").toBeGreaterThanOrEqual(0.4);
  // Read with the table's fold closed, as a player meets it. `expectReadable`
  // opens every drawer, and the open fold takes the question's row: the
  // question drops below the plate, and nothing of it is over the picture.
  // The composite reading is for a screen with its drawers open -- it reads
  // what a closed fold holds as if it were shown -- so only the question's own
  // line is taken from it here.
  await settle(page, { drawers: false });
  const composite = await page.evaluate(COLLECT);
  expect(composite.filter((finding) => finding.startsWith("p.gx-question")), "the question against its panel").toEqual([]);
  const marked = await page.evaluate(() => (window.__contrastPainted ?? []).some(({ el }) => el.matches(".gx-question")));
  expect(marked, "the question is one of the lines read from the pixels").toBe(true);
  const painted = await collectPainted(page);
  expect(painted.findings, "case02/c2_trace, fold closed: text over a picture").toEqual([]);
  expect(painted.measured, "the lines over the plate were measured").toBeGreaterThan(0);

  await page.setViewportSize({ width: 1366, height: 768 });
  await expect.poll(opacity, "a wide screen keeps the room as drawn").toBeCloseTo(0.78, 2);
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

  let measuredOverEndingArt = 0;
  for (let step = 0; step < 4; step += 1) {
    const measured = await expectReadable(page, `ending step ${step}`);
    if (await page.locator(".ending-sequence .ending-visual").count()) measuredOverEndingArt += measured;
    const advance = page.locator(".ending-sequence button").first();
    if (!(await advance.isVisible())) break;
    const before = await page.locator(".ending-sequence").innerText();
    await advance.click();
    // The next step is a new screen of text, not a pause.
    await expect.poll(() => page.locator(".ending-sequence, .result-page").first().innerText()).not.toBe(before);
  }
  // The ending's words stand on a picture and a scrim that are their siblings.
  expect(measuredOverEndingArt, "the ending's text over its picture was measured").toBeGreaterThan(0);
});
