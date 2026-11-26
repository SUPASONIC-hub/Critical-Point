/** The tools and the Tool Draft (src/copy/relics.js) in English. */
export default {
  draft: {
    full: "Tool slots full",
    closed: "Case closed",
    handedBy: "Handed over by {name}",
    swapTitle: "Pick a tool to put down",
    title: "Pick one tool for the next Case",
    swapLede: "To take {name}, put down a tool you carry. A tool you put down stops changing the rules from this table on.",
    lede: "The tool you pick changes one rule of the table. You carry up to {slots} tools, and {when}. The clock is stopped until you choose.",
    ledeFull: "your slots are full, so taking one means putting one down",
    ledeRoom: "once they are full you swap one out",
    drop: "Put down",
    rare: "Unlocked",
    codexLabel: "Tool Index, {count} of {total} unlocked",
    lockedTitle: "Locked · {feat}",
    lockedSpoken: "Locked, {feat}",
    owned: ", equipped",
    codexCount: "Index {count}/{total}",
    nextFeats: "{codex} · Next unlock: {feat} · See {more} more",
    nextFeat: " · Next unlock: {feat}",
    allOpen: " · All unlocked",
    back: "See other tools",
    skip: "Skip and {name} · {short}",
    skipPaid: "Continue without picking",
    reroll: "Reroll · {cost}",
    extra: "One more · {cost}",
    refine: "Refine a tool · {cost}",
    refineGroup: "Tool to refine",
    refineOption: "Refine {name}, its condition pays ×{boost}",
    spendNote: "It comes straight out of your KD Bank account and can't be undone.",
    spendHint: "One more only when a slot is open. Buy every time and the Vault runs dry before the ending.",
    // G4 (relicsNext.js): under the next rules one more is once a season and the reroll is cheap.
    spendHintNext: "One more once a Season. Rerolls are cheap: reroll a weak three. Tools that pay on the same hand pay ×{cap} at most together (a single tool that pays more keeps its own).",
    secondTitle: "Pick one more tool",
    secondLede: "You bought one more: pick it from the two left.",
    off: {
      practice: "Not on a Case played again",
      story: "Not in Story mode",
      record: "Not on this save's draft",
      used: "Used this Case",
      picked: "Already picked",
      few: "Only one tool left",
      short: "Not enough in the account",
      season: "Already bought this Season",
      none: "No tool to refine",
    },
  },
  relics: {
    metronome: {
      name: "Metronome",
      text: "Until the scene after Heat rises, a change of side still counts as a switch.",
      proc: "Caught the switch",
      // G4: the condition that pays under the next rules (relicsNext.js).
      next: "Commit on a hand where you changed side (a switch), or the first hand after 6 in a row on one side: stake +{pct}%.",
    },
    coldBlood: {
      name: "Cold Blood",
      text: "After you hit the Wall, AFTERSHOCK starts at Heat {cold}, not {start}.",
      proc: "Cooled the aftershock by half",
      // G4: what it does under the next rules, in place of the line above.
      nextText: "The hand after a BUST has no AFTERSHOCK, starts at Heat 0 and its Wall stands {wall} further; cash on it: stake +{pct}%.",
      nextSoftens: "Cold Blood: no AFTERSHOCK",
      softens: "Cold Blood: starts at Heat {cold}",
    },
    heatSink: {
      name: "Heat Sink",
      text: "HEAT DEBT leaves only 1/{share} of the Heat and takes only {seconds} seconds.",
      proc: "Halved the heat debt",
      // G4: the condition that pays under the next rules (relicsNext.js).
      next: "Cash at Heat {hot} or more: stake +{pct}%.",
      softens: "Heat Sink: 1/{share} of the Heat, {seconds}s",
    },
    auditContact: {
      name: "Audit Contact",
      text: "Ban Jaewook of Internal Audit looks away from one box. The audit catches you only when {limit} boxes fill.",
      proc: "Ban Jaewook looked away from one box",
      // G4: the condition that pays under the next rules (relicsNext.js).
      next: "Push at least once and cash under Heat {low}: stake +{pct}%, and Noticed never gets you caught.",
    },
    carbonCopy: {
      name: "Lim Kyungsoo’s Copy",
      text: "There is a copy Lim Kyungsoo never burned. BLACKOUT pulls the Wall in only {pull}, not {shift}.",
      proc: "The copy held the Wall back",
      // G4: the condition that pays under the next rules (relicsNext.js).
      next: "Cash on a BLACKOUT hand: stake +{pct}%.",
      softens: "Copy: Wall pulled in only {pull}",
    },
    testimony: {
      name: "Oh Jinwoo’s Testimony",
      text: "The decision time limit was a setting. Even when time runs out and you BUST, 1/{share} of your stake stays.",
      proc: "Kept 1/{share} of the stake when time ran out",
      // G4: the condition that pays under the next rules (relicsNext.js).
      next: "Cash with more than half the clock left: stake +{pct}%.",
    },
    frontPage: {
      name: "Cha Jiwon’s Front Page",
      text: "Scoop after scoop, your hand stays steady. On OVERCLOCK hands, the extra Heat from each push is halved.",
      proc: "A steady hand on front-page deadline",
      // G4: the condition that pays under the next rules (relicsNext.js).
      next: "Cash on an OVERCLOCK hand: stake +{pct}%.",
      softens: "Front Page: pushes grow only half as much",
    },
    fieldNote: {
      name: "Do Yoonha’s Field Notes",
      text: "In the field, twice is enough to find the flow. The Logic Combo starts rising at card {hold} of the same type.",
      proc: "Built the combo early with the field notes",
      // G4: the condition that pays under the next rules (relicsNext.js).
      next: "Cash at a Logic Combo of {side} or more on one side: stake +{pct}%.",
    },
    encore: {
      name: "Encore",
      text: "Even when the Wall takes your stake, the Logic Combo stays.",
      proc: "The combo survived the Wall",
      // G4: the condition that pays under the next rules (relicsNext.js).
      next: "Cash at a Logic Combo of {long} or more: stake +{pct}%.",
      unlock: "Reach Logic Combo {combo}",
    },
    insurance: {
      name: "Insurance",
      text: "Once per Case, 1/{share} of your stake survives hitting the Wall.",
      proc: "Saved 1/{share} of the stake",
      unlock: "Lose {loss} or more stake to the Wall",
    },
    stethoscope: {
      name: "Stethoscope",
      text: "Even under SILENCE, the heartbeat keeps pointing at the Wall. Time is still {seconds} seconds.",
      proc: "Heard the heart in the silence",
      // G4: the condition that pays under the next rules (relicsNext.js).
      next: "Cash on a SILENCE hand: stake +{pct}%.",
      softens: "Stethoscope: heartbeat stays",
      unlock: "Live through SILENCE once",
    },
    kineticGrip: {
      name: "Kinetic Grip",
      text: "Takes away the 1 Heat STRIKE MASTERY adds to each push, and hands woken by STRIKE WAKE get ×{chips} thicker chips.",
      proc: "STRIKE mastery took hold",
      // G4: the condition that pays under the next rules (relicsNext.js).
      next: "Cash with STRIKE fully charged: stake +{pct}%.",
      softens: "Kinetic Grip: pushes add only their usual Heat",
      unlock: "STRIKE mastery {count} times",
    },
  },
  breather: {
    name: "catch your breath",
    short: "+{seconds}s",
    text: "If you pick nothing, this Case’s first hand gets {seconds} more seconds and the Wall moves {wall} further away.",
  },
};
