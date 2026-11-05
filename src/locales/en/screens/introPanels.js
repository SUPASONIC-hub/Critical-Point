/** The start screen’s panels, the season’s first echo and the tab title’s tail, in English (src/copy/introPanels.js). */
export default {
  analystTitles: {
    prologue01: "Trainee Analyst",
    prologue02: "Analyst",
    case01: "Senior Analyst",
    case25: "Lead Analyst",
    finished: "Chief Analyst",
  },
  playStyles: {
    instinct: "A pledge to decide on first instinct",
    auditor: "A pledge to check the evidence before deciding",
    mediator: "A pledge to ease the pressure through talk",
  },
  newGamePlusOpen: "You can see last season’s ending again on this screen",
  newGamePlusLocked: "Finish the final record to unlock NEW GAME+",
  tutorial: {
    read: { label: "Read the scene", text: "Read the situation, the speaker and the question. Reading time doesn’t count toward your score." },
    weigh: { label: "Stake a card", text: "Pick one card and stake it. Each card gains and costs something different." },
    commit: { label: "Push and Commit", text: "The more you push, the higher the Heat and the multiplier. Commit before you hit the unseen Wall and the stake builds up; close the case and it goes to the vault." },
    replay: { label: "Play again", text: "Different records open different authority and endings." },
  },
  goals: {
    protect: "Finish the season keeping {harm} under an average of {gate} per case",
    evidence: "Open at least {percent}% of the case records",
    trust: "Keep {trust} at an average of {gate} or more per case",
  },
  veteranTable: "In NEW GAME+, every rule is on from Prologue 01, and you get your tools earlier.",
  pastCase: "Your earlier record kept your last choice in CASE {code}. This time, you can change how it turns out.",
  integrity: {
    linked: "This record is tied to a single run. The public ranking only takes seasons whose case records all reached the server over 15 minutes or more, and the server flags records whose score, rank or times don’t add up.",
    missing: "With no run ID, this is kept as a temporary local record.",
  },
  openingEcho: "I won’t ask how smart you are. Instead, I’ll watch for when you can’t stop thinking.",
  storageBanner: {
    offline: { title: "Offline", text: "Remote saving comes back when the connection does. For now, your record is saved in this browser." },
    ready: { title: "Remote saving ready", text: "Only the records you agreed to share are saved remotely, when a case ends and when you send feedback." },
    pending: { title: "Remote saving ready · Waiting for consent", text: "Tick the box and this session’s completed logs and feedback are saved remotely." },
    local: { title: "Local saving", text: "Remote saving isn’t set up, so only browser saving and the JSON export are used." },
  },
  defaultName: "Analyst",
};
