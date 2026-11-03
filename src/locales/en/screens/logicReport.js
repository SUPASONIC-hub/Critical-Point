/** The closing report’s Logic hold panel in English (src/copy/logicReport.js). */
export default {
  label: "Logic hold",
  caseName: "{label} “{title}”",
  lead: "The case where the Heat ran highest was {caseName}.",
  held: "Of that case’s {windows} hands, you closed {count} on '{type}'.",
  heldAll: "You closed all {windows} of that case’s hands on '{type}'.",
  switched: "In that case you changed type {count} times after the Heat rose, and your logic combo never broke.",
  broken: "In that case you didn’t stay on one type, and your logic combo broke {count} times.",
  unbroken: "In that case you didn’t stay on one type, but your logic combo never broke.",
  tooFew: "Too few cases have a logic combo record yet, so the case where the Heat ran highest isn’t named.",
  hold: "Logic hold {score} pts",
  best: "Best logic combo {streak}",
  caption: "Logic hold is the share of hands that could have broken your combo and didn’t. It can move against your perspective-shift score.",
  rank: {
    pending: "Rankings appear once {floor} season records are in.",
    band: "Top {percent}%",
  },
};
