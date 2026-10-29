/** The comfort settings in English (src/copy/comfort.js). */
export default {
  label: "Comfort settings",
  tableTime: {
    legend: "Table Time",
    text: "The table’s time limit runs this much slower. Records not at 1× are marked on the ranking.",
    scale: "{scale}×",
  },
  toggles: {
    storyMode: {
      label: "Story Mode",
      text: "The Wall moves further away, and a hand that hits the Wall doesn’t carry over to the next. Hitting the Wall doesn’t skip a scene. The clock runs 2× slower. Applies from the next case, and these runs don’t go on the public ranking.",
    },
    holdReadingClock: {
      label: "Turn off the reading clock",
      text: "Scene text doesn’t move on by itself. Read to the end, then open the table yourself.",
    },
    foldReadScenes: {
      label: "Fold scenes you’ve read",
      text: "In a NEW GAME+ season, folds the text of scenes you read last season. The question still shows.",
    },
    calmEffects: {
      label: "Reduce flashes and shaking",
      text: "Softens the red edges, verdict flashes and screen shake.",
    },
    edgeNotices: {
      label: "Show edge notifications",
      text: "The more you Push, the more messages and emails pop up briefly at the top edge.",
    },
    letterKeys: {
      label: "Use single-key shortcuts",
      text: "1-9, W, E, Q, P, R, N. Turned off, only Space, Enter and Esc remain.",
    },
    stillIntro: {
      label: "Stop motion on the start screen",
      text: "Stops the scrolling text, moving picture and blinking title.",
    },
  },
  storyScale: {
    legend: "Story text size",
    text: "Enlarges the text of scenes, the story after a verdict, case endings and interludes. The table stays the same.",
    labels: ["Default", "Large", "Larger"],
  },
};
