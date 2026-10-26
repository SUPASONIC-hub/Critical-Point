/** Rule of the Week on the start and ranking screens in English (src/copy/weekRule.js). */
export default {
  takeUp: "Start with the Rule of the Week (this week’s ranking)",
  turnDown: "Start without the Rule of the Week (usual ranking)",
  boardsLabel: "Choose a ranking",
  ordinaryBoard: "Usual ranking",
  weekBoard: "Rule of the Week · {label}",
  line: {
    kicker: "Rule of the Week",
    kickerFirst: "Rule of the Week for returning analysts",
    nextKicker: "Next week’s rule",
    first: " Your first season starts under the usual rules.",
    keeps: " A season started this week keeps this rule to the end, and is ranked separately.",
    after: " Next week’s rule is {label} ({title}), from midnight next Monday.",
    next: "{title}. From midnight Monday.",
  },
  rules: {
    "near-wall": {
      title: "The Wall is closer",
      text: "This week the Wall band stands 4 Heat earlier. The same Heat hits the Wall sooner.",
      world: "This week the group moved its audit forward.",
    },
    "heavy-fracture": {
      title: "The cracks run deep",
      text: "This week FRACTURE bills a cracked resource at 1.75 times.",
      world: "This week Accounting goes through the cracked books once more.",
    },
    "short-clock": {
      title: "Time is short",
      text: "This week every hand has 8 seconds less, and every card’s chips are worth 1.25 times as much.",
      world: "This week the board cut reporting time and raised the value of reports.",
    },
    audit: {
      title: "Audit Week",
      text: "Commit under 40 Heat after pushing at least once, and the audit goes +1. If a case closes with all 4 boxes filled, you lose 1/4 of the share bound for the Vault.",
    },
    cascade: {
      title: "Cascade Week",
      text: "Commit a card that burns 8 or more of one resource, and within 2–4 hands one hand’s Wall comes 6 closer. Links still open when a case closes carry into the next case.",
    },
    "audit-cascade": {
      title: "Audit and Cascade",
      text: "This week the audit and the cascade stand together. Commit under 40 Heat after pushing at least once, and the audit goes +1. If a case closes with all 4 boxes filled, you lose 1/4 of the share bound for the Vault. Commit a card that burns 8 or more of one resource, and within 2–4 hands one hand’s Wall comes 6 closer. Links still open when a case closes carry into the next case. A commit on a CASCADE hand doesn’t count toward the audit.",
    },
  },
};
