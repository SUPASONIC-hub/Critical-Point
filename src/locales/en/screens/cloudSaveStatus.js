/** What online save says about itself, in English (src/copy/cloudSaveStatus.js). */
export default {
  phases: {
    idle: "No progress saved yet.",
    pending: "Saved on this device · Uploading soon.",
    syncing: "Uploading…",
    synced: "This device and online are both up to date.",
    offline: "Offline · Saved on this device; it uploads automatically once you’re connected.",
    conflict: "Uploads stopped: there is an online save that doesn’t continue from this device’s current progress. It was saved on another device, or before a reset. Choose below which one to keep.",
    error: "Online save failed. Your save on this device is safe, and it will try again shortly.",
    disabled: "Online save is off. Progress is saved only on this device.",
    unavailable: "This deployment has no online save server, so progress is saved only on this device.",
  },
  failures: {
    codeLimit: "This network has used up today’s new continue codes. Turn it on again tomorrow. Your save on this device is safe.",
    rateLimit: "Too many online save requests. It will try again shortly. Your save on this device is safe.",
    tooLarge: "Your progress is larger than the online save limit, so it couldn’t be uploaded. Your save on this device is safe.",
    unreachable: "Couldn’t reach the online save server. Check your connection and try again.",
    failed: "Online save failed. Your save on this device is safe, and it will try again shortly.",
  },
  badCode: "A continue code is 12 letters and numbers.",
  noServer: "This deployment has no online save server set up.",
  offlineLoad: "You’re offline, so it can’t be loaded. Try again once you’re connected.",
  offlineDelete: "You’re offline, so the online copy can’t be deleted. Try again once you’re connected.",
};
