/** The words of the Rule of the Week's catalogue in English (src/copy/weekRules.js). */
export default {
  auditLine: "Commit under {heat} Heat after pushing at least once, and the audit goes +1. If a case closes with all {limit} boxes filled, you lose 1/{share} of the share bound for the Vault.",
  cascadeLine: "Commit a card that burns 8 or more of one resource, and within 2–4 hands one hand’s Wall comes 6 closer. Links still open when a case closes carry into the next case.",
  rules: {
    "near-wall": {
      title: "The Wall is closer",
      text: "This week the Wall band stands {shift} Heat earlier. The same Heat hits the Wall sooner.",
      world: "This week the group moved its audit forward.",
    },
    "heavy-fracture": {
      title: "The cracks run deep",
      text: "This week FRACTURE bills a cracked resource at {rate} times.",
      world: "This week Accounting goes through the cracked books once more.",
    },
    "short-clock": {
      title: "Time is short",
      text: "This week every hand has {seconds} seconds less, and every card’s chips are worth {chips} times as much.",
      world: "This week the board cut reporting time and raised the value of reports.",
    },
    "crisis-week": {
      title: "Crisis week",
      text: "This week the Wall band stands {crisisShift} Heat earlier, and every card’s chips are worth {crisisChips} times as much.",
      world: "This week the market shook, and head office asked for the numbers first.",
    },
    "idle-erosion": {
      title: "Idle money shrinks",
      text: "This week, each time a case closes, {erosion}% of what sat in the Vault through it is gone. Money spent at the tool draft doesn’t shrink.",
      world: "This week prices rose, and money left sitting is worth less.",
    },
    "market-shock": {
      title: "Market shock",
      text: "This week, once in every case, the market shakes on hand {shockBoard}. That hand’s Wall band stands {shockWall} Heat earlier, and the stake stacked so far moves up or down by as much as {shockSwing}%.",
      world: "This week the market lurched, and the numbers in the books shook with it.",
    },
    "audit-cascade": {
      title: "Audit and Cascade",
      text: "This week the audit and the cascade stand together. {audit} {cascade} A commit on a CASCADE hand doesn’t count toward the audit.",
    },
  },
  // G5 (gauntlet/actTwists.js): the twist of acts 3, 5 and 7 under the next rules, by id.
  actTwists: {
    merger: {
      title: "The Merger",
      text: "This Case, every card’s chips are ×{mergerChips}, but the Wall band stands {mergerShift} Heat closer.",
      world: "The group merges its companies and calls it reform. Bigger stakes, a nearer Wall.",
    },
    scattered: {
      title: "Scattered Desks",
      text: "This Case, the Wall band is {spread} Heat wider on each side, and every card’s chips are ×{scatterChips}.",
      world: "The lab’s people are scattered across the group, and at every desk the Wall stands somewhere else.",
    },
    hearing: {
      title: "The Hearing",
      text: "This Case, every hand has half the time, and every card’s chips are ×{hearingChips}.",
      world: "A hearing over who owns the records. Little time to answer, and every word costs more.",
    },
  },
  caseRules: {
    case09: {
      text: "In this case every hand has {seconds} seconds less, and every card’s chips are worth {chips} times as much.",
      world: "The liquidation agenda goes to a vote within 72 hours. Reports short, and priced high.",
    },
    case11: {
      text: "In this case the Wall band stands {shift} Heat earlier. The same Heat hits the Wall sooner.",
      world: "The parliamentary audit has been moved up a day.",
    },
    case14: {
      text: "In this case FRACTURE bills a cracked resource at {rate} times.",
      world: "These are books that bought bad loans at 92 won, so every crack gets a second look.",
    },
    case16: {
      text: "In this case the Wall band stands {crisisShift} Heat earlier, and every card’s chips are worth {crisisChips} times as much.",
      world: "The robot-lease filing shook the market, and head office asked for the numbers first.",
    },
  },
};
