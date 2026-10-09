import { RESULT_CARD_LABELS, wrapLines } from "./resultCardModel.js";

/**
 * The result card as a picture, and what a tap on its buttons does with it.
 *
 * The card is plain canvas text on a flat ground. An SVG `foreignObject`
 * cannot see the page's `@font-face` and taints the canvas in Safari, and
 * turning a piece of the page into a picture needs a library, so the card is
 * drawn line by line here instead.
 *
 * Everything these functions need from the browser is handed to them -- the
 * document, the navigator, the copy helper -- so the unit tests run them in
 * node with stand-ins. One import brings the whole card: the model's functions
 * are passed on from here.
 */
export { buildResultCardModel, buildShareText } from "./resultCardModel.js";

export const RESULT_CARD_WIDTH = 1080;
export const RESULT_CARD_HEIGHT = 1350;
export const RESULT_CARD_MARGIN = 80;
export const RESULT_CARD_FILE_NAME = "critical-point-result.png";

const CONTENT_WIDTH = RESULT_CARD_WIDTH - RESULT_CARD_MARGIN * 2;
const LEFT = RESULT_CARD_MARGIN;
const RIGHT = RESULT_CARD_WIDTH - RESULT_CARD_MARGIN;
// The row of three cells and the footer are measured up from the bottom edge;
// the two blocks above them flow down from the top and stop short of this.
const CELLS_TOP = 1000;
const CELLS_HEIGHT = 170;
const CELL_GAP = 20;
const CELL_PADDING = 28;
const FOOTER_RULE = 1206;
const FOOTER_BASELINE = 1256;
// The two weights the card is set in. `renderResultCardFile` asks for both
// before it draws.
const REGULAR = 500;
const HEAVY = 800;
const FONT_WAIT_MS = 3000;
const REVOKE_DELAY_MS = 1000;

/**
 * The card's colours and font family, read off the page at the moment of
 * drawing, so the tokens are written once (`src/styles/tokens.css`) and a
 * change there changes the card. A page that answers with nothing -- a
 * stylesheet that has not arrived -- gets white on black, which is legible and
 * is nobody's palette.
 */
export function readResultCardTheme(documentRef) {
  const style = documentRef?.defaultView?.getComputedStyle?.(documentRef.documentElement);
  const read = (token, fallback) => style?.getPropertyValue?.(token)?.replace(/\s+/g, " ").trim() || fallback;
  return {
    ground: read("--c-gx-felt", "black"),
    panel: read("--c-gx-felt-raised", "black"),
    text: read("--c-paper", "white"),
    dim: read("--c-gx-text-dim", "white"),
    accent: read("--c-acid", "white"),
    heat: read("--c-gx-heat", "white"),
    fontFamily: read("--font-sans", "sans-serif"),
  };
}

const fontOf = (theme, weight, size) => `${weight} ${size}px ${theme.fontFamily}`;

/**
 * Text set in as few lines as `maxLines`, at `size` when it fits and a step
 * smaller for as long as it does not. The game's own face fits every line the
 * game can produce at full size; this is for the system face the card falls
 * back to, whose Hangul can be wider. Text that is still too long at the
 * smallest size keeps every word: the overflow joins the last line, and
 * `fillText` narrows that line to the width it is given.
 */
function fitLines(ctx, theme, text, { weight, size, minSize, maxWidth, maxLines }) {
  for (let trial = size; ; trial -= 4) {
    ctx.font = fontOf(theme, weight, trial);
    const lines = wrapLines((value) => ctx.measureText(value).width, text, maxWidth);
    if (lines.length <= maxLines) return { size: trial, lines };
    if (trial - 4 < minSize) return { size: trial, lines: [...lines.slice(0, maxLines - 1), lines.slice(maxLines - 1).join(" ")] };
  }
}

/**
 * Draws the card on a 1080x1350 context. `theme` is what `readResultCardTheme`
 * returns; a test passes its own.
 */
export function drawResultCard(ctx, model, theme) {
  const accent = model.failure ? theme.heat : theme.accent;
  const write = (text, x, y, { weight = REGULAR, size, color = theme.text, align = "left", maxWidth = CONTENT_WIDTH }) => {
    ctx.font = fontOf(theme, weight, size);
    ctx.fillStyle = color;
    ctx.textAlign = align;
    ctx.fillText(text, x, y, maxWidth);
  };

  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = theme.ground;
  ctx.fillRect(0, 0, RESULT_CARD_WIDTH, RESULT_CARD_HEIGHT);

  // 1. The strip: whose record this is, over a hairline in the accent.
  write(RESULT_CARD_LABELS.game, LEFT, 112, { weight: HEAVY, size: 28, color: theme.dim, maxWidth: CONTENT_WIDTH / 2 });
  write(RESULT_CARD_LABELS.season, RIGHT, 112, { size: 28, color: theme.dim, align: "right", maxWidth: CONTENT_WIDTH / 2 - 20 });
  ctx.fillStyle = accent;
  ctx.fillRect(LEFT, 140, CONTENT_WIDTH, 2);

  // 2. 판단 DNA: its title large, then the mode as a chip beside the motive.
  let y = 220;
  write(RESULT_CARD_LABELS.dna, LEFT, y, { size: 26, color: theme.dim, maxWidth: CONTENT_WIDTH / 2 });
  if (model.story) {
    write(RESULT_CARD_LABELS.story, RIGHT, y, { size: 26, color: theme.dim, align: "right", maxWidth: CONTENT_WIDTH / 2 - 20 });
  }
  const title = fitLines(ctx, theme, model.modeTitle, { weight: HEAVY, size: 76, minSize: 48, maxWidth: CONTENT_WIDTH, maxLines: 2 });
  y += 4;
  for (const line of title.lines) {
    y += 92;
    write(line, LEFT, y, { weight: HEAVY, size: title.size });
  }
  y += 76;
  let x = LEFT;
  if (model.mode) {
    ctx.font = fontOf(theme, HEAVY, 26);
    const chipWidth = Math.min(CONTENT_WIDTH / 2, ctx.measureText(model.mode).width + 36);
    ctx.strokeStyle = accent;
    ctx.lineWidth = 2;
    ctx.strokeRect(x + 1, y - 39, chipWidth - 2, 54);
    write(model.mode, x + 18, y - 2, { weight: HEAVY, size: 26, color: accent, maxWidth: chipWidth - 36 });
    x += chipWidth + 24;
  }
  if (model.motiveLabel) write(model.motiveLabel, x, y, { size: 30, maxWidth: RIGHT - x });

  // 3. The ending: what it is called, its label, and its one line.
  y += 110;
  write(RESULT_CARD_LABELS.ending, LEFT, y, { size: 26, color: theme.dim });
  y += 84;
  write(model.endingName, LEFT, y, { weight: HEAVY, size: 64 });
  if (model.endingLabel) {
    y += 50;
    write(model.endingLabel, LEFT, y, { weight: HEAVY, size: 28, color: accent });
  }
  if (model.endingTitle) {
    const line = fitLines(ctx, theme, model.endingTitle, { weight: REGULAR, size: 40, minSize: 28, maxWidth: CONTENT_WIDTH, maxLines: 3 });
    y += 16;
    for (const text of line.lines) {
      y += 56;
      write(text, LEFT, y, { size: line.size });
    }
  }

  // 4. Three cells: the best table of the season, its rank, and the league.
  const cellWidth = (CONTENT_WIDTH - CELL_GAP * 2) / 3;
  const inner = cellWidth - CELL_PADDING * 2;
  const cells = [
    [RESULT_CARD_LABELS.burst, `${model.bestBurst}${RESULT_CARD_LABELS.points}`],
    [RESULT_CARD_LABELS.rank, model.bestRank],
    [RESULT_CARD_LABELS.league, model.league],
  ];
  cells.forEach(([label, value], index) => {
    const cellLeft = LEFT + index * (cellWidth + CELL_GAP);
    ctx.fillStyle = theme.panel;
    ctx.fillRect(cellLeft, CELLS_TOP, cellWidth, CELLS_HEIGHT);
    write(label, cellLeft + CELL_PADDING, CELLS_TOP + 50, { size: 24, color: theme.dim, maxWidth: inner });
    // A league is two words and is set smaller, on two lines; a score or a rank is one.
    const twoWords = /\s/.test(value);
    const set = fitLines(ctx, theme, value, { weight: HEAVY, size: twoWords ? 38 : 60, minSize: 24, maxWidth: inner, maxLines: twoWords ? 2 : 1 });
    const first = set.lines.length > 1 ? CELLS_TOP + 102 : CELLS_TOP + 128;
    set.lines.forEach((text, row) => {
      write(text, cellLeft + CELL_PADDING, first + row * 44, { weight: HEAVY, size: set.size, maxWidth: inner });
    });
  });

  // 5. The foot: where the game is, and that the record is an anonymous one.
  ctx.fillStyle = theme.panel;
  ctx.fillRect(LEFT, FOOTER_RULE, CONTENT_WIDTH, 2);
  if (model.host) write(model.host, LEFT, FOOTER_BASELINE, { weight: HEAVY, size: 28, color: accent, maxWidth: CONTENT_WIDTH / 2 + 60 });
  write(RESULT_CARD_LABELS.byline, RIGHT, FOOTER_BASELINE, { size: 28, color: theme.dim, align: "right", maxWidth: CONTENT_WIDTH / 2 - 80 });
}

/** Every string a card prints, for the font to be asked about before it is drawn. */
function cardText(model) {
  return [...Object.values(RESULT_CARD_LABELS), ...Object.values(model).filter((value) => typeof value === "string"), String(model.bestBurst)].join("");
}

/**
 * Waits for the game's face in both weights, and stops waiting after
 * `waitMs`. The file is preloaded and in the service worker's cache, so this
 * is normally immediate; when it fails, or the browser has no font loader, the
 * card is drawn in the next family of the stack.
 */
async function waitForFonts(documentRef, theme, text, waitMs) {
  const fonts = documentRef?.fonts;
  if (typeof fonts?.load !== "function") return;
  let timer;
  const gaveUp = new Promise((resolve) => {
    timer = setTimeout(resolve, waitMs);
  });
  try {
    await Promise.race([Promise.all([REGULAR, HEAVY].map((weight) => fonts.load(fontOf(theme, weight, 40), text))), gaveUp]);
  } catch {
    // A face that would not load is not a reason to make no card.
  } finally {
    clearTimeout(timer);
  }
}

/**
 * The card as a PNG file, or null when the browser could not make one. The
 * canvas is emptied afterwards: iOS counts canvas memory against the page, and
 * the file is all that is kept.
 *
 * @param {ReturnType<typeof import("./resultCardModel.js").buildResultCardModel>} model
 * @param {{ document: Document, theme?: ReturnType<typeof readResultCardTheme>, fontWaitMs?: number }} environment
 * @returns {Promise<File | null>}
 */
export async function renderResultCardFile(model, { document: documentRef, theme = readResultCardTheme(documentRef), fontWaitMs = FONT_WAIT_MS }) {
  let canvas = null;
  try {
    await waitForFonts(documentRef, theme, cardText(model), fontWaitMs);
    canvas = documentRef.createElement("canvas");
    canvas.width = RESULT_CARD_WIDTH;
    canvas.height = RESULT_CARD_HEIGHT;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    drawResultCard(ctx, model, theme);
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
    return blob ? new File([blob], RESULT_CARD_FILE_NAME, { type: "image/png" }) : null;
  } catch {
    return null;
  } finally {
    if (canvas) canvas.width = 0;
  }
}

/** The file through a link the page presses itself, as `downloadJson` saves an export. */
function saveFile(file, documentRef, urls) {
  const url = urls.createObjectURL(file);
  const anchor = documentRef.createElement("a");
  anchor.href = url;
  anchor.download = RESULT_CARD_FILE_NAME;
  anchor.type = "image/png";
  anchor.style.display = "none";
  documentRef.body.appendChild(anchor);
  anchor.click();
  setTimeout(() => {
    anchor.remove();
    urls.revokeObjectURL(url);
  }, REVOKE_DELAY_MS);
}

/**
 * What a press on either button does, and how it ended:
 *
 *   "shared"          the platform's share sheet took the file and the line;
 *   "cancelled"       the player closed the sheet -- nothing else is tried;
 *   "saved"           the file was downloaded and the line copied;
 *   "saved-uncopied"  the file was downloaded and the copy was refused;
 *   "failed"          there was no file, or the download could not start.
 *
 * Sharing is tried only where the platform says it can share this file (the
 * save button passes no navigator). A share that fails for any reason but the
 * player's own cancel falls through to the download, so the card is not lost.
 *
 * @param {object} request
 * @param {File | null} request.file What `renderResultCardFile` returned.
 * @param {string} request.text What `buildShareText` returned.
 * @param {Navigator | null} [request.navigator]
 * @param {Document} request.document
 * @param {(text: string) => Promise<boolean>} request.copyText `copyText` of `src/appConfig.js`.
 * @param {{ createObjectURL: Function, revokeObjectURL: Function }} [request.urls]
 * @returns {Promise<"shared" | "saved" | "saved-uncopied" | "cancelled" | "failed">}
 */
export async function shareOrSave({ file, text, navigator: navigatorRef, document: documentRef, copyText, urls = globalThis.URL }) {
  if (!file) return "failed";
  let shareable;
  try {
    shareable = Boolean(navigatorRef?.canShare?.({ files: [file] })) && typeof navigatorRef.share === "function";
  } catch {
    shareable = false;
  }
  if (shareable) {
    try {
      await navigatorRef.share({ files: [file], text });
      return "shared";
    } catch (error) {
      if (error?.name === "AbortError") return "cancelled";
    }
  }
  try {
    saveFile(file, documentRef, urls);
  } catch {
    return "failed";
  }
  try {
    return (await copyText(text)) ? "saved" : "saved-uncopied";
  } catch {
    return "saved-uncopied";
  }
}
