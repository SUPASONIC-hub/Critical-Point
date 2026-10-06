const MODAL_PAGE = "[role='dialog'][aria-modal='true']";
// The intro inside the runtime is a lazy screen: a frame after the runtime
// leaves a scene it may still be on its way in. Long enough for a chunk that
// is already in the module cache, short enough to give up on one that is not.
const PAGE_WAIT_FRAMES = 30;

/** Runs `find` each frame until it returns an element, then hands it to `land`. */
function whenOnPage(find, land, framesLeft = PAGE_WAIT_FRAMES) {
  const target = find();
  if (target instanceof HTMLElement) {
    land(target);
  } else if (framesLeft > 0 && typeof globalThis.requestAnimationFrame === "function") {
    globalThis.requestAnimationFrame(() => whenOnPage(find, land, framesLeft - 1));
  }
}

function focusQuietly(target) {
  if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
  target.focus({ preventScroll: true });
}

/**
 * Puts focus on the scene's title, unless a modal page is in front of it.
 *
 * A window opens on the briefing page, and a case on the relic draft; both take
 * focus when they mount. The runtime focused the title a frame later, which
 * pulled focus out of the page that had just taken it: Tab then walked the
 * covered table, and Enter on the draft no longer took the focused relic. So
 * the title waits. When the page in front closes and leaves focus nowhere, the
 * title takes it then; when another page takes its place (the draft, then the
 * briefing), it waits for that one too.
 *
 * A page with no scene title -- the intro, when 저장 후 나가기 or 초기화 sends the
 * runtime back to it -- is entered at its own heading. The button that was
 * pressed is gone by then, and with nothing focused a keyboard or screen-reader
 * player was left on `<body>` with nothing said.
 *
 * `roadmap` is the one other way onto the intro: see `focusSeasonRoadmap`.
 */
export function focusSceneTitle(titleRef, { roadmap = false, behavior = "auto" } = {}) {
  if (roadmap) {
    focusSeasonRoadmap(behavior);
    return;
  }
  const modal = document.querySelector(MODAL_PAGE);
  if (!modal) {
    if (titleRef.current) titleRef.current.focus({ preventScroll: true });
    else whenOnPage(() => titleRef.current ?? document.querySelector("main h1"), focusQuietly);
    return;
  }
  if (typeof MutationObserver !== "function") return;
  const observer = new MutationObserver(() => {
    if (modal.isConnected) return;
    observer.disconnect();
    const focusLost = !document.activeElement || document.activeElement === document.body;
    if (focusLost || document.querySelector(MODAL_PAGE)) focusSceneTitle(titleRef);
  });
  // The whole page, not the modal's parent: the reveal leaves with its
  // backdrop, so the dialog's own parent never loses a child and a watcher
  // there waited for ever. The check is one property read per change.
  observer.observe(document.body, { childList: true, subtree: true });
}

/**
 * 시즌 로드맵 from the result page: the intro is entered at the roadmap, which
 * is the last thing on it, and at the case the season has reached. It used to
 * be entered at the top, and on a phone the roadmap is a rail of fifty-five
 * cards that started at the first.
 */
function focusSeasonRoadmap(behavior) {
  whenOnPage(
    () => document.getElementById("season-roadmap"),
    (heading) => {
      heading.scrollIntoView({ block: "start", behavior });
      focusQuietly(heading);
      const card = document.querySelector(".case-roadmap .active-case");
      const rail = card?.parentElement;
      // Only the phone's rail scrolls sideways; the page is not moved for it.
      if (rail && rail.scrollWidth > rail.clientWidth) {
        rail.scrollLeft += card.getBoundingClientRect().left - rail.getBoundingClientRect().left;
      }
    },
  );
}
