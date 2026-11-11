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
    "audit-cascade": {
      title: "Audit and Cascade",
      text: "This week the audit and the cascade stand together. {audit} {cascade} A commit on a CASCADE hand doesn’t count toward the audit.",
    },
  },};
