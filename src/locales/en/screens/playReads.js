/** What the table reads off a choice as it is played, in English (src/copy/playReads.js): the suspense signals and events, and a card’s tactical read. */
export default {
  signals: {
    QUIET: {
      title: "No one has made the first move yet.",
      text: "A quiet scene is not a safe one. Someone is already opening the next record.",
      cue: "The last premise you can still check",
    },
    WATCH: {
      title: "The numbers in the room and the moves outside it don’t line up.",
      text: "The moment you choose, a stakeholder no one has named can change the terms of the next scene.",
      cue: "Who hasn’t spoken yet?",
    },
    UNSTABLE: {
      title: "The case moves on without waiting for your decision.",
      text: "A single choice shifts the cost and, at the same time, tells someone where your line is.",
      cue: "What gets recorded is not the result but your line",
    },
    REDLINE: {
      title: "A hidden protocol has woken up.",
      text: "Your choices now read not as orders that solve the case, but as signals that test you.",
      cue: "Doubt the record before you trust the next screen",
    },
  },
  events: {
    "protocol-awake": {
      title: "The moment you crossed the critical line, another screen switched on.",
      text: "Trigger Lab now measures not the case’s outcome but how much you are willing to bear.",
    },
    "observer-awake": {
      title: "Someone has started reading your judgment in real time.",
      text: "From the next scene on, not just the cost of each choice is recorded, but the way you name that cost.",
    },
    "pattern-lock": {
      title: "Your repeated pattern has been fixed as the case’s next condition.",
      text: "That choice didn’t open a new case; it called back a reaction of yours already observed.",
    },
  },
  tactical: {
    grades: {
      S: "Breakthrough",
      A: "Strong play",
      B: "Steady line",
      C: "A choice with a price",
      D: "High-risk gamble",
    },
    challenge: "Challenge met",
    riskDown: "Risk pressure down",
    riskHeld: "Pressure held",
    riskUp: "Risk pressure +{delta}",
    lowCost: "Little immediate loss",
    thinking: "Thinking boost +{gain}",
    waited: "Wait and see",
  },
};
