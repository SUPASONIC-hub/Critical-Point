/** What the participant board's hook says, in English (src/copy/boardPost.js). */
export default {
  refusals: {
    "nickname-characters": "Names must be 2 to 24 characters long.",
    "body-characters": "Posts must be 2 to 300 characters long.",
    "nickname-link": "Names can’t contain links. Change the name and post again.",
    "body-link": "Posts with links can’t be posted. Remove the link and post again.",
    contact: "Posts with phone numbers or email addresses can’t be posted. Remove them and post again.",
  },
  honeypot: "A field was filled in automatically, so nothing was posted. Please press again.",
  dwell: "The board only just opened. Take a moment to read, then press again.",
  privacy: "Anonymize the words that could identify someone, then post.",
  interval: "You can post once every 30 seconds. Press again in {seconds} seconds.",
  failures: {
    repeat: "The same post went up a moment ago. Change the wording and post again.",
    interval: "You can post once every 30 seconds. Please press again in a moment.",
    limit: "You can post up to 10 times an hour. Please come back a little later.",
    offline: "You’re offline, so the post didn’t go up. Press again once you’re connected.",
    failed: "Couldn’t post. Please press again in a moment.",
  },
  noServer: "This deployment has no board server, so posts can’t be sent or received.",
  loadFailed: "Couldn’t load the board. You can try again below.",
  loadOffline: "You’re offline, so the board couldn’t load. It will open again once you’re connected.",
  alreadyPosted: "You already posted this. The same post appears on the board only once.",
  noServerPost: "This deployment has no board server, so the post didn’t go up.",
  posted: "Posted.",
  signals: { email: "email address", phone: "phone number", organization: "company or organization name" },
};
