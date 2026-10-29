/** src/copy/unlocks.js in English: what a prologue's first briefing says about the rules it turns on. */
export default {
  kicker: "NEW PROTOCOL · more rules from this case on",
  peak: {
    kicker: "PEAK TABLE · Peak hand",
    intro: ["This is the last Case of the Act. Every hand in it has the Wall {wall} closer and chips ×{chips}."],
  },
  steps: {
    prologue01: {
      kicker: "FIRST TABLE · how this table works",
      intro: [
        "Push, and Heat and the multiplier go up. Commit before you hit the Wall. When the heartbeat speeds up, the Wall is close.",
        "Hit the Wall and you lose this case’s whole stake and the next scene. What’s in the Vault stays.",
      ],
    },
    prologue02: {
      intro: [
        "Pick cards of the same thinking type three times in a row to build a Logic Combo and grow the multiplier. If you closed the last hand hotter, the combo carries on even when you switch types. The case result’s Shifting View score works the other way: it rises the more evenly you use all four types.",
        "Hit the Wall and the next hand starts with the cards hidden and Heat already on.",
      ],
    },
    prologue03: {
      intro: [
        "Commit without a single Push and the next hand seals its most expensive card.",
        "Commit at Heat 60 or more and the next hand starts with Heat on and less time.",
        "Press Scout to spend 3 seconds of time and narrow the Wall’s range to 20 wide. Once per hand, and it doesn’t mean the Wall is in the middle of it.",
      ],
    },
    prologue04: {
      intro: [
        "The resource you burned most is charged at 1.5× in the next hand.",
        "Commit at ×4 or more twice in a row and the next hand’s chips go 2×, and each Push adds more Heat.",
        "Press LOCK after staking a card to raise the resource multiplier; the chip multiplier rises up to 1.5×. Each press costs time.",
        "From this case on, the Audit and Links join the table.",
      ],
    },
    prologue05: {
      intro: [
        "Your Stance decides what LOCK grows. STRIKE grows the multiplier (fastest to the 1.5× cap), STEADY cools (only after a PUSH), EXPOSE grows resources.",
        "Each time a case closes, you pick one of 3 tools. You can carry up to 5; when you’re full, put one down to swap.",
        "Once the chip multiplier reaches {cap}×, LOCK no longer adds to this hand’s multiplier; charge it to {charge} or more and Commit, and it pays out in the next hand.",
      ],
    },
  },
};
