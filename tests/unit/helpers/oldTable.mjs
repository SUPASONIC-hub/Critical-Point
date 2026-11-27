// The table before the next rules (G4·G5, src/gauntlet/nextTableRules.js): a test
// file that holds the old numbers imports this first, so every module it then
// loads reads the old table (nextTableRules.js `wantsNextRules`). The next rules' own tests are rules-next.test.mjs.
process.env.RULES_NEXT = "0";
