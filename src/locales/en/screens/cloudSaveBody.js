/** The opened online-save panel in English (src/copy/cloudSaveBody.js). */
export default {
  toggle: "Use online save",
  myCode: "My continue code",
  copy: "Copy",
  loadOnline: "Load the online progress",
  overwrite: "Overwrite with this device’s progress",
  otherCode: "Code from another device",
  loadAndContinue: "Load and continue",
  uploadNow: "Upload now",
  deleteOnline: "Delete uploaded records",
  confirm: {
    load: "This replaces this device’s save with the loaded progress. Continue?",
    overwrite: "This replaces another device’s progress online with this device’s. It can’t be undone. Continue?",
    remove: "This deletes the progress you uploaded. The save on this device stays. Continue?",
  },
  outcome: {
    notFound: "No progress is saved under that code.",
    cannotWrite: "Couldn’t write to browser storage, so nothing was loaded.",
    uploaded: "This device’s progress was uploaded.",
    noServer: "This deployment has no online save server, so the online copy can’t be deleted here.",
    deleted: "Your uploaded progress was deleted.",
    nothingOnline: "There’s no progress left online.",
    copied: "Continue code copied.",
    writeDown: "Write the code down yourself: {code}",
    turnedOff: "Online save is off. You can delete progress you already uploaded below.",
  },
};
