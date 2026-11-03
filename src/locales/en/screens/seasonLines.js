/** What NEW GAME+ says of the season before, and the ending book’s lines, in English (src/copy/seasonLines.js). */
export default {
  verdicts: { ending_seal: "Seal", ending_reform: "Reform", ending_expose: "Expose" },
  openingEchoes: {
    ending_seal: "Last season’s record was sealed, but the experiment came back under another name. This time, we’ll first see what you choose to close.",
    ending_reform: "Last season’s record became the benchmark for the rules of use. This time, we’ll see how long that oversight holds.",
    ending_expose: "Last season’s record is already out in the world. This time, we’ll see what you protect first.",
    collapse: "Last season stopped, unable to bear what people paid. That preserved record now sits beside this season’s first question.",
  },
  memory: {
    line: "Last season: {named}{ending}.{carry}",
    carry: " Start NEW GAME+ and this record returns in the first scene.",
  },
  comparison: {
    same: "You reached the same ending as last season again: {ending}.",
    versus: "Last season {before} · This season {now}",
    sameChanged: "You reached the same ending as last season again: {ending} · The first season since the table rules changed",
    versusChanged: "Last season {before} · This season {now} · The first season since the table rules changed",
    caseSame: "{tag} last season too",
  },
  caseEchoes: {
    prologue02: {
      ending_seal: "Last season’s record ended sealed. This time, we’ll see whose drawer this opinion ends up in.",
      ending_reform: "Last season’s record remained as a benchmark. This time, we’ll see whether this opinion becomes its first line.",
      ending_expose: "Last season’s record went outside. This time, we’ll see whose name goes out with this opinion.",
      collapse: "Last season stopped before what people paid. This time, we’ll see whether this opinion writes that price down first.",
    },
    case01: {
      ending_seal: "Last season’s record was sealed, but this folder has opened again. In these 72 hours, we’ll see what you close.",
      ending_reform: "The benchmark you left last season hasn’t reached this analyst room yet. In these 72 hours, we’ll see whether you set it up again.",
      ending_expose: "The record you sent out last season spread close to names that needed protecting. In these 72 hours, we’ll see whom you protect first.",
      collapse: "Last season’s operation collapsed under the human cost. In these 72 hours, we’ll first see who that price falls on.",
    },
    case48: {
      ending_seal: "Last season’s record was sealed, but the same clause came back under another name. This time, we’ll see who writes their name beside it.",
      ending_reform: "Last season’s record became the benchmark for the rules of use. This time, we’ll see whether that oversight reaches Article 7.",
      ending_expose: "Last season’s record was read outside. This time, we’ll see how far the names of the people who wrote Article 7 spread.",
      collapse: "Last season stopped, unable to bear what people paid. This time, we’ll see whether you stand to the end before the people this clause catches.",
    },
    final: {
      ending_seal: "Last season, you sealed this record. We’ll see whether you close the same door again.",
      ending_reform: "Last season, you turned this record into rules of use. We’ll see whether you choose the same rules again.",
      ending_expose: "Last season, you sent this record outside. We’ll see whether you open the same door again.",
      collapse: "Last season made it this far but couldn’t bear what people paid. This time, we’ll see what you count first.",
    },
  },
  recall: "Last season, this case closed on ‘{tag}’.",
  card: {
    round: "Season {round}",
    pastEnding: "Last season’s ending ‘{ending}’",
    weekRule: "This week’s rule {rule}",
  },
  book: {
    hints: {
      "open-oversight": "Reached by a season that opens at least {clue}% of the case records and keeps both Trust and Fairness high.",
      "evidence-reform": "Reached by a season that opens at least {clue}% of the case records and keeps Fairness high.",
      "human-record": "Reached by a season that opens every case record, reframes the table in at least seven of every ten cases, and keeps Trust too.",
      "profitable-silence": "Reached by a season that keeps its Cash to the end while Trust falls sharply.",
      "cold-justice": "Reached by a season whose Fairness is very high but whose Trust doesn’t keep up.",
      "field-pact": "Reached by a season whose Trust runs well ahead of its Fairness.",
      "quiet-cover": "Reached by a season that opens less than half the records, or closes its cases without much risk. A season that burns all the data in the finale reaches it too.",
      collapse: "A season collapses if the Human cost it leaves averages {harm} or more per case, or if {bust}% or more of its hands hit the Wall while that cost averages {overreach} or more.",
      "open-question": "Reached by a season that leans hard in no direction.",
    },
    paths: { ending_seal: "the way that seals it", ending_reform: "the way that puts rules on it", ending_expose: "the way that hands it outside" },
    verdictWhen: "Given when you choose {path} at the finale’s “How to Close That Field” and the ending is one of {endings}.",
    count: "Endings {endings}/{endingsTotal} · Rulings {verdicts}/{verdictsTotal}.",
    aimEnding: " An ending to aim for next season: {ending}. {hint}",
    aimVerdict: " A ruling to aim for next season: {verdict}. {when}",
    hintVerdict: "Ruling {verdict}: {when}",
  },
};
