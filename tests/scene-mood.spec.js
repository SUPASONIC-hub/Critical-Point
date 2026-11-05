import { expect, test } from "./helpers/network.js";
import { nodeOrders } from "../src/gameData.js";
import { SCENE_MOODS } from "../src/sceneMoods.js";
import { acceptConfirms } from "./helpers/dialogs.js";
import { startDebugNode } from "./helpers/gameFlow.js";

/**
 * The page's mood on <html data-mood> (src/mood.js, 메모-20261105/design-mood.md):
 * a tagged scene's mood while the table shows it, nothing on an untagged scene,
 * and nothing again on the start screen. The scenes are read off the tag table
 * and the case orders, so a retagged season moves the test, not its answer.
 */
function findScenes() {
  for (const [caseId, order] of Object.entries(nodeOrders)) {
    const tagged = order.find((id) => SCENE_MOODS[id]);
    const untagged = order.find((id) => !SCENE_MOODS[id]);
    if (tagged && untagged) return { caseId, tagged, mood: SCENE_MOODS[tagged], untagged };
  }
  throw new Error("no case order has both a tagged and an untagged scene");
}

const html = (page) => page.locator("html");

test("the table writes the scene's mood on <html>; an untagged scene and the start screen write nothing", async ({ page }) => {
  const { caseId, tagged, mood, untagged } = findScenes();
  await acceptConfirms(page);
  await startDebugNode(page, caseId, tagged);
  await expect(html(page)).toHaveAttribute("data-mood", mood);

  // 초기화 in the play header: back to the start screen, which is neutral --
  // no attribute, not data-mood="neutral".
  await page.getByRole("button", { name: /초기화/ }).click();
  await expect(page.locator(".intro")).toBeVisible();
  await expect.poll(() => html(page).getAttribute("data-mood")).toBeNull();

  // An untagged scene is neutral on the table too.
  await startDebugNode(page, caseId, untagged, { navigate: false, resetStorage: false });
  await expect(page.locator(".game-shell")).toBeVisible();
  await expect.poll(() => html(page).getAttribute("data-mood")).toBeNull();
});
