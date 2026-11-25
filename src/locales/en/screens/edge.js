/** src/copy/edge.js in English: the week's panel, the reading clock's question and the comfort settings. */
export default {
  weekRule: "Rule of the Week · until this season ends",
  caseRule: "This case only · until this case closes",
  unfold: "Read last season · Show",
  pastPick: {
    wildPicked: "Reframed last season too",
    wild: "Reopens this hand",
    wildSr: " the card you picked last season",
    shown: "Last season",
    clipped: "’s pick",
    heard: "",
  },
  ask: {
    kicker: "Reading time’s up",
    question: "Open each table yourself once you’ve read?",
    note: "Then scenes won’t move on by themselves; the table opens when you press Open the table. You can change this in Comfort settings.",
    hold: "I’ll open it myself",
    keep: "Leave it to the clock",
  },
  sign: {
    kicker: "The signature line",
    question: "How will you sign this Case? If you don’t choose, you sign with conditions.",
    name: "Name only",
    terms: "With conditions",
    nameWall: "On this signature line, Name only stands the Wall band {wall} closer.",
  },
  // G23 여는 판돈 (WeekRulePanel.jsx OpeningAsk).
  opening: { kicker: "Opening stake", question: "How do you open this Case? If you don't choose, it opens normally.", normal: "Open normally", big: "Open big", bigNote: "Open big and every card's chips are ×{chips} this Case, but the Wall can stand as low as {wall} Heat." },
  comfort: {
    title: "Comfort settings",
    close: "Close",
    note: "The table clock stops while this window is open.",
  },
};
