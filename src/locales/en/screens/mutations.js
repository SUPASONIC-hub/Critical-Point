/** The next-board rules (src/copy/mutations.js) in English: what the briefing, the rule row and the reveal print. */
export default {
  rules: {
    blackout: {
      title: "The cards went face down",
      text: "The price of crossing the critical point. Next hand, the cards’ chips and costs are hidden, and the Wall comes {wall} closer.",
    },
    aftershock: {
      title: "The aftershock lingers",
      text: "Heat starts at {start}. The Heat that just hit the Wall hasn’t cooled yet.",
    },
    silence: {
      title: "The heart lies",
      text: "The price of letting the clock run. Next hand, the heartbeat won’t warn you of the Wall, and you have {seconds} seconds to decide.",
    },
    heatDebt: {
      title: "Greed leaves Heat behind",
      text: "The price of committing at a high multiplier. You start carrying 1/{share} of this Heat, and lose {seconds} seconds.",
    },
    overclock: {
      title: "Chips double",
      text: "You banked ×{multiplier} or better in a row. Chips are ×{chips}, but each push raises the Heat more.",
    },
    coldFeet: {
      title: "Your best card is sealed",
      text: "The price of committing without a push. The most expensive card opens only once Heat passes {seal}, and chips shrink.",
    },
    fracture: {
      title: "A cracked resource",
      text: "The resource you just burned most. Next hand, cards that burn it are charged ×{rate}.",
    },
    reboot: {
      title: "The case is closed",
      text: "Your stake has moved into the Vault and the rules are reset. You can’t lose it now.",
    },
    strikeWake: {
      title: "The next hand wakes up heavier",
      text: "LOCK charged with STRIKE. Next hand, chips are ×{chips}, but each push raises the Heat more.",
    },
    steadyLine: {
      title: "The next hand opens cool",
      text: "LOCK charged with STEADY. Next hand starts {cool} Heat lower with {seconds} more seconds, and the Wall moves {wall} farther away.",
    },
    exposedHand: {
      title: "The next hand can’t hide its cards",
      text: "LOCK charged with EXPOSE. Next hand, no card goes face down, and the COLD FEET seal is lifted.",
    },
    strikeMastery: {
      title: "The season learned to strike first",
      text: "The result of charging STRIKE LOCK again and again. Every new hand has thicker chips, and each push raises the Heat by 1 more.",
    },
    steadyMastery: {
      title: "The season learned to hold on",
      text: "The result of charging STEADY LOCK again and again. Every new hand starts cooler, with a little more time.",
    },
    exposeMastery: {
      title: "The season learned to read the table",
      text: "The result of charging EXPOSE LOCK again and again. Seals open earlier, and with more, even a face-down hand can’t hide.",
    },
  },
  lifted: {
    blackout: {
      title: "The Wall moved in",
      text: "The price of crossing the critical point. The Wall comes {wall} closer. EXPOSE mastery kept the cards face up.",
    },
    coldFeet: {
      title: "Chips shrank",
      text: "The price of committing without a push. Chips shrink. EXPOSE mastery lifted the seal.",
    },
  },
};
