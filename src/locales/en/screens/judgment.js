/** gameLogic.js’s words in English (src/copy/judgment.js): the Judgment DNA’s modes and motives, the unrecorded aftermath, the trade-off sentence and a scene’s fallback question. */
export default {
  modes: {
    GUARDIAN: {
      title: "The one who stops harm from shifting",
      text: "You hold your judgment longest by checking who ends up carrying the cost, not how big the result is.",
    },
    "RE-FRAMER": {
      title: "The one who reframes the table itself",
      text: "Rather than follow the balance of the choices given, you rearrange the stakeholders and the terms.",
    },
    "PRESSURE PILOT": {
      title: "The one who steers under pressure",
      text: "Even as the risk grows you keep deciding, and choose which cost to pass on to the next scene.",
    },
  },
  motives: {
    affection: { label: "Affection", when: "when you see someone you want to save", path: "Affection → Obsession → Thinking it through → Rescue" },
    revenge: { label: "Revenge", when: "when you see an injustice you want to repay", path: "Anger → Obsession → Tracking the weak point → Correction" },
    responsibility: { label: "Responsibility", when: "when what you took on looks about to collapse", path: "Responsibility → Obsession → Weighing costs → Recovery" },
    curiosity: { label: "Curiosity", when: "when something is still unknown", path: "Curiosity → Obsession → Mapping the structure → Discovery" },
    mixed: { label: "Mixed", when: "when no single feeling woke your thinking alone", path: "Many feelings → Obsession → Thinking it through → Reading again" },
  },
  unrecordedOutcome: { tag: "Unrecorded ending", title: "A result not yet closed", text: "The ripples of this choice remain in the next record." },
  tradeoff: {
    still: "The numbers barely moved, but this choice left a standard for your judgment.",
    noGain: "little gained right away",
    noLoss: "little visible loss",
    both: "You gained {gains} at the cost of {losses}.",
    gainsOnly: "{gains} opened up, but that gain stays on as pressure in the next scene.",
    lossesOnly: "You took {losses}. The choice kept its cause, but your reserves wore down.",
  },
  question: "You have to decide what to protect first.",
  titledQuestion: "{title}: You have to decide what to protect first.",
  defaultEcho: "To hold that call, you have to count the hidden victims and the cost again. Will you apply the same principle under worse conditions?",
  sceneBeat: {
    stockProfile: {
      appearance: "Someone involved in the case sits before an untidy pile of papers.",
      thought: "This choice isn’t over yet.",
      gesture: "They take a moment to choose their words.",
      voice: "They respond in the tone of someone checking where things stand.",
      line: "Can you keep pushing that call?",
    },
    speaker: "The other side",
    said: "Instead of naming a prepared response, you leave only the conclusion and say: {said}",
    look: "{name} looks up. {voice}",
    still: "The numbers on the board barely move, but the silence in the meeting room runs a little longer.",
    gain: "{label} opens up. But that number didn’t come free.",
    cost: "{label} is left as the price. Someone will carry that share from where they stand.",
  },
};
