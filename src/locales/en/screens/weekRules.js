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
      text: "This week every hand has {seconds} seconds less, and every card’s chips are worth {chips} times as much. Charging LOCK takes {lockDrag} times the time.",
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
      text: "This Case, every card’s chips are ×{mergerChips}, but the far end of the Wall band stands {mergerTop} Heat closer.",
      world: "The group merges its companies and calls it reform. Bigger stakes, a nearer Wall.",
    },
    scattered: {
      title: "Scattered Desks",
      text: "This Case, the Wall band is {spread} Heat wider on each side. The Wall could stand anywhere in a wider stretch.",
      world: "The lab’s people are scattered across the group, and at every desk the Wall stands somewhere else.",
    },
    hearing: {
      title: "The Hearing",
      text: "This Case, every hand’s clock is {hearingCut}% shorter, and every card’s chips are ×{hearingChips}. Charging LOCK takes {lockDrag} times the time.",
      world: "A hearing over who owns the records. Little time to answer, and every word costs more.",
    },
    // G5's acts 1, 2, 4, 6 and 8 (actTwists.js `ACT_DEVICE_TWIST_RULES`).
    passedDown: {
      title: "Passed Down",
      text: "This Case, your first BUST still leaves 1/{downShare} of your stake. That hand’s Human cost goes up by {downHarm}.",
      world: "The repayment the bank pulled forward runs down into care hours and dispatch rosters.",
    },
    lateBill: {
      title: "The Late Bill",
      text: "This Case, commit at {billHeat} Heat or more and the next hand starts with 3/4 of that Heat. Commit under it and every card’s chips are ×{billChips}.",
      world: "The ten days someone carried alone are billed the day after the win.",
    },
    trainedWall: {
      title: "The Trained Wall",
      text: "This Case, NOAH learns the Heat you commit at. On the next hand the Wall band moves toward that Heat, but never below the middle of its usual band.",
      world: "NOAH learned what you chose, and the seconds you hesitated.",
    },
    onRecord: {
      title: "On the Record",
      text: "This Case, the Stance you commit with on the first hand can’t change until the Case ends. In return, every commit carries that Stance into the next hand, even without a full charge.",
      world: "What you said once stays in the record, and the next question starts from that line.",
    },
    signedByName: {
      title: "Signed by Name",
      text: "This Case, you choose how to sign before the first hand. Name only: every card’s chips ×{nameChips}, and the Wall band stands {nameWallLow}–{nameWallHigh} closer, drawn for each Case (the signature line shows this one). With conditions: the Wall band stands {termsWall} further, and chips ×{termsChips}.",
      world: "There are no blank boxes now. You can only add conditions beside your name.",
    },
  },
  caseRules: {
    case09: {
      text: "In this case every hand has {seconds} seconds less, and every card’s chips are worth {chips} times as much. Charging LOCK takes {lockDrag} times the time.",
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
