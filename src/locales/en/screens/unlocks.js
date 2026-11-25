/** src/copy/unlocks.js in English: what a prologue's (and 사건 01–03's) first briefing says about the rules it turns on. */
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
        "Hit the Wall and you lose this case’s whole stake. What’s in the Vault stays.",
      ],
    },
    prologue02: {
      intro: [
        "Pick cards leaning the same way (People side or Position side) three times in a row to build a Logic Combo and grow the multiplier. If you closed the last hand hotter, the combo carries on even when you switch sides. The Shifting View score rises the more evenly you use the thinking types, so you can hold your side and still change types.",
        "Hit the Wall and the next hand starts with the cards hidden.",
      ],
    },
    prologue03: {
      intro: [
        "Commit without a single Push and the next hand seals its most expensive card.",
        "Commit at Heat 60 or more and the next hand starts with Heat on and less time.",
        "Press Scout to spend 1 Trust and 3 seconds of time and narrow the Wall’s range to 20 wide. Once per hand, and it doesn’t mean the Wall is in the middle of it. Press it again to spend 2 more Trust and narrow it to 14.",
      ],
    },
    prologue04: {
      intro: [
        "The resource you burned most is charged at 1.5× in the next hand.",
        "Press LOCK after staking a card to raise the resource multiplier; the chip multiplier rises up to 1.5×. Each press costs time.",
      ],
    },
    prologue05: {
      intro: [
        "Your Stance decides what LOCK grows. STRIKE grows the multiplier (fastest to the 1.5× cap), STEADY cools (only after a PUSH), EXPOSE grows resources.",
        "Each time a case closes, you pick one of 3 tools. You can carry up to 5; when you’re full, put one down to swap.",
        "Once the chip multiplier reaches {cap}×, LOCK no longer adds to this hand’s multiplier; charge it to {charge} or more and Commit, and it pays out in the next hand.",
      ],
    },
    case01: {
      intro: ["Commit at ×4 or more twice in a row and the next hand’s chips go 2×, and each Push adds more Heat."],
    },
    case02: {
      introNine: ["From this case on, the Audit joins the table. If 4 of a case’s Commits, each pushed at least once, land at the same spot within ±2 Heat, you lose 1/4 of the share bound for the Vault when the case closes. Change where you cut to stay clear."],
      intro: ["From this case on, the Audit joins the table. Push at least once and Commit below Heat 40 and one box fills; Commit at 60 or more and 2 boxes clear. If 4 boxes are full when the case closes, you lose 1/4 of the share bound for the Vault."],
    },
    case03: {
      introNine: ["From this case on, Links join the table. Commit with a card that burns 8 or more of one resource, and in one hand 2–4 hands later the far end of the Wall band comes 10 closer."],
      intro: ["From this case on, Links join the table. Commit with a card that burns 8 or more of one resource, and in one hand 2–4 hands later the Wall comes 6 closer."],
    },
    case04: {
      intro: ["From this case on, hit the Wall and the next hand starts at Heat 22."],
    },
    case05: {
      intro: ["From this case on, let the clock run out and lose the hand, and the next hand’s heartbeat won’t point at the Wall, with 30 seconds to decide."],
    },
  },
};
