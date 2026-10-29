/**
 * The season's closing pages in English (src/copy/ending.js): the ending
 * sequence, the three twists, the verdicts and what the run leaves behind.
 * Story prose, written to the glossary (앱출시-G) and the final case's
 * English (the next participant, the approver field, the signature field,
 * Form No. 7, response records).
 */
export default {
  sequence: {
    label: "Final ending sequence",
    seasonComplete: "Season complete",
    announceOpened: "The record is open. {count} records are still unopened.",
    witnessLabel: "Ending evidence log",
    blueprintLabel: "The case blueprint handed to the next participant",
    next: "Next",
    skip: "Skip this screen",
    messageLabel: "One sentence for the next participant",
    messageSave: "Leave it on the record",
    opened: "Record opened",
    leftBehind: "What you left behind",
    unopened: "{count} records remain unopened.",
    unopenedParts: "Clues: {clues} · Paths not taken: {branches}",
    inherit: "The next participant inherits these blanks.",
    readNow: "You can start reading the record now.",
  },
  twists: { ruling: "Verdict", execution: "Execution", cost: "Cost" },
  finalChoiceFallback: "The last judgment you left",
  witness: {
    first: "Your first judgment",
    longest: "The judgment you held longest",
    branch: "The judgment that shook the table",
  },
  sampleSuffix: " sample",
  typeSuffix: " type",
  observationLabels: { compliance: "Compliance", defiance: "Defiance", opacity: "Concealment", sacrifice: "Sacrifice" },
  verdicts: {
    ending_seal: {
      title: "The B2 folder is sealed.",
      ruling: "The supplementary HR metric folder and the profiles of 13 people will not be opened again. Your record is locked inside it too. The harm grows no larger. But only a few people in Internal Audit hold the key.",
      execution: "That night the B2 terminal stops recording. The forms bound for HR Planning on the 33rd floor are cut off. No notice goes out calling the next participant.",
      cost: "You only closed the door; you did not fix the form. The same form can come back under another name. Sunwoo Jin, who asked for those records back, is left waiting at that door too.",
    },
    ending_reform: {
      title: "The folder stays, and rules for using it are attached.",
      ruling: "Your record becomes not a list of weaknesses but the baseline for the rules of use. No one’s response records can be used in an HR evaluation without their consent. The 63 people open their own records first.",
      execution: "The administrator field on Form No. 7 can no longer be left blank. Every change to the form is made public with the name of who made it. The records of the four people of Cohort 1 are returned first.",
      cost: "The folder survives. So the work ahead is not getting rid of it but keeping watch over it for a long time. Who will keep the seat where the rules were made is not yet decided.",
    },
    ending_expose: {
      title: "The B2 folder goes out whole.",
      ruling: "The supplementary HR metric is no longer the group’s internal material. The Financial Supervisory Service and reporters start reading the form. But what is made public spreads close to the names of the 13 people.",
      execution: "Ban Jaewook seals the envelope and hands it to the outside auditors. HR Planning on the 33rd floor loses its access. An audit begins into whether the same form exists anywhere in the group.",
      cost: "The truth moves fast. Because of that speed, someone is exposed before they are protected. Just as it was last summer, when the response records got out.",
    },
  },
  collapse: {
    title: "This season has collapsed.",
    ruling: "You had the authority, but you could not carry the human cost that piled up case after case. The record remains. But the people it was meant to protect left first.",
    execution: "The remaining cases stop. Only what would have to change for the next season to hold is written down.",
    cost: "The allowances and support people got while things ran well are the first to be taken back. Failure is not the end; it is the next season’s starting line.",
  },
  openCost: "For every conclusion you put off, the next participant gets more authority and a heavier question.",
  twistTitles: {
    execution: "Your last choice is carried out that same night.",
    cost: "What ended is the case. What remains is the responsibility.",
  },
  axes: [
    { text: "How much harm to people and the front line you reduced" },
    { text: "How much of the structure and its hidden costs you exposed" },
    { text: "How many choices you left for the next participant" },
  ],
  afterglows: {
    compliance: {
      title: "You kept order, and you also left a record of whom that order quietly pushed out.",
      text: "The record does not store you only as someone who complied. It keeps both the moments you held things together and the moments you asked too late.",
    },
    defiance: {
      title: "You opened the door, and now you carry the share of whoever comes through it.",
      text: "Refusal was not a button that ended things. It left the next person bigger choices, and handed over bigger responsibility with them.",
    },
    opacity: {
      title: "What you hid did not disappear. It became the next participant’s first question.",
      text: "Silence did not erase the traces. It only changed who would find them first.",
    },
    sacrifice: {
      title: "To save someone, you left your own name at the very top of the record.",
      text: "Sacrifice is not a clean ending. Thanks to your choice the others can keep speaking, but they remember the weight of those words too.",
    },
  },
  openAfterglow: {
    title: "Your choice became a question that outlasts any conclusion.",
    text: "The record does not keep right answers. It keeps the temperature of the place where you stopped, so the next judgment can begin.",
  },
  seasonRecord: {
    sent: "When you finish the finale, this run’s season record is sent to the online ranking without your name. A run with a case finished before data sharing was turned on does not make the ranking.",
    notSent: "Data sharing is off, so even when you finish the finale this run’s season record is not sent and does not make the online ranking. It stays in this device’s rankings.",
    beatTable: "This run has a case finished before the current table rules existed, so even when you finish the finale its season record does not make the online ranking. It stays in this device’s rankings.",
  },
  threeScenes: {
    heading: "Your {count}",
    counts: [null, "one scene", "two scenes", "three scenes"],
    cases: { prologue01: "Prologue 01", case48: "Case 48", final: "The Last Case" },
  },
};
