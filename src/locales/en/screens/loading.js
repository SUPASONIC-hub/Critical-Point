/** src/copy/loading.js in English: what a lazy screen shows while its file arrives, and when it can’t. */
export default {
  offline: {
    title: "You’re offline.",
    text: "This screen’s file didn’t arrive. Your saved progress is safe. Check your connection and try again.",
    retry: "Try again",
  },
  reload: {
    title: "This screen needs to be reloaded.",
    kept: " Your saved progress is safe.",
    button: "Reload",
    reasons: {
      reload: "The game was updated, so this screen’s file couldn’t be found.",
      "reload-offline": "The game was updated, so this screen’s file couldn’t be found. Even offline, reloading opens the new version saved on this device.",
      "reload-retried": "This screen’s file still didn’t arrive. Open the page again to get it.",
    },
  },
  status: "Loading the scene.",
  progressLabel: "Loading cases",
  progress: "Case {done}/{total}",
  slow: "The connection is slow, so this is taking a while. Your saved progress is safe.",
  slowRetry: "Load again",
};
