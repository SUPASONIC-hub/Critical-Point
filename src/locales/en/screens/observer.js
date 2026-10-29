/** What the observer writes about a run, and the endings' own lines, in English (src/copy/observer.js). */
export default {
  tags: {
    reframe: {
      label: "Defiance sample",
      text: "The moment you stepped outside the prepared choices. In the next participant’s case, this detour stays as a new condition.",
    },
    opacity: {
      label: "Concealment sample",
      text: "A judgment that delayed disclosure. Trigger Lab keeps a separate record of whom this silence protects and whom it erases.",
    },
    sacrifice: {
      label: "Sacrifice sample",
      text: "A judgment that passed the cost on to people. The case moves on, but this loss comes back in the tone of the next scene.",
    },
    compliance: {
      label: "Compliance sample",
      text: "A safe choice, closed quickly. The path that looked like the right answer becomes the easiest pattern for the observer to read.",
    },
    pressure: {
      label: "High-pressure sample",
      text: "A judgment that accepted rising pressure. This choice is filed closer to a tolerance line than to a solution.",
    },
    pattern: {
      label: "Pattern sample",
      text: "A choice that did not stand out. That is why it lasts longer. The observer looks for the standard that repeats first.",
    },
  },
  labels: {
    compliance: "Compliance sample",
    defiance: "Defiance sample",
    opacity: "Concealment sample",
    sacrifice: "Sacrifice sample",
    pattern: "Pattern sample",
  },
  arc: {
    compliance: {
      label: "Observer learning",
      title: "Safe choices are hardening into the next case’s defaults.",
      text: "The more paths close like right answers, the more the next scene is built to push for quicker decisions.",
    },
    defiance: {
      label: "Observer learning",
      title: "The system is holding on to your detours as candidates for new rules.",
      text: "The traces you left outside the prepared choices appear to the next participant as a gap that is open from the start.",
    },
    opacity: {
      label: "Observer learning",
      title: "Judgments left unspoken are piling up as the case’s dark conditions.",
      text: "Choices you kept undisclosed do not vanish. They come back in the next scene as a question about who was shut out.",
    },
    sacrifice: {
      label: "Observer learning",
      title: "The cost you passed to someone becomes the next case’s first pressure.",
      text: "It was resolved, but the direction of the loss remains. The next participant starts already carrying it.",
    },
    pattern: {
      label: "Observer learning",
      title: "A repeated standard still stands out more clearly than any ending.",
      text: "Judgments that did not stand out add up to the unseen ground rules of the next case.",
    },
  },
  escalation: {
    repeated: "The same sample closed several times in a row, and the observer has started to feel sure of your standard.",
    latest: "The {label} stays as your latest record and changes the tone of the next question.",
    none: "The observer has not yet settled on a standard for you.",
  },
  turningPoint: {
    label: "Turning-point record",
    title: "The {label} broke a familiar pattern.",
    text: "After “{choice},” the observer could no longer sort the same person the same way.",
  },
  endingRecord: {
    repeated: "The next participant’s first scene starts from the standard you repeated.",
    most: "The next participant’s first scene starts from the sample you left most often.",
  },
  endings: {
    collapse: { title: "You had the authority, but you could not carry what people paid.", text: "A failed ending: the record remains, but neither the people nor the operation were protected." },
    "open-oversight": { title: "You became not the one who solved the cases, but the one who set the standard.", text: "This season’s record stays as the standard the next analyst will follow." },
    "evidence-reform": { title: "You disclosed the evidence and made rules that don’t use people up again.", text: "A new operating standard now stands between exposure and protection." },
    "human-record": { title: "Instead of a right answer, you left a record where no one’s voice is erased.", text: "The tables you reframed become the next participant’s first clue." },
    "profitable-silence": { title: "The organization survived, but no one asked the same question again.", text: "The highest score and the lowest trust were recorded together." },
    "cold-justice": { title: "The procedure was flawless, but the people inside it did not come back.", text: "Fairness held, but the cost to relationships carries into the next case." },
    "field-pact": { title: "Before any official approval, a promise on the front line opened the next door.", text: "Your network of people gives you access to locked records." },
    "quiet-cover": { title: "The risk came down, but the truth is still asleep.", text: "The season closed with nothing collapsing and nothing coming out." },
  },
  openQuestion: {
    trust: { title: "You found no answer, but people still speak to you.", text: "You closed each case leaving {value} human cost behind. The next participant starts with the people who know you." },
    legitimacy: { title: "The procedure remains; what it was for does not.", text: "Fairness stopped at {value}, and no document records why. The next person inherits only the rules." },
    capital: { title: "The books held, and the question passed on unanswered.", text: "You kept {value} in cash, and left records that never closed." },
  },
};
