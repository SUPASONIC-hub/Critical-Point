/** The audit's lines in English (src/copy/audit.js). */
export default {
  ifCashUp: "Commit now and the audit goes +1, {after}/{limit}",
  ifCashDown: "Commit now and the audit goes −{relief}, {after}/{limit}",
  ifCashSame: "Commit now and the audit stays at {after}/{limit}",
  spoken: "Audit risk {count}/{limit}. If all {limit} boxes fill, you lose 1/{share} of the share bound for the Vault when the case closes",
  ledger: "Closed with the audit at {count}/{limit} boxes.",
  caught: " Caught.",
  smoothWarn: "Same spot = audit",
  smoothUp: "Commit now and same-spot commits go to {after}/{limit}",
  smoothSame: "Commit now and same-spot commits stay at {after}/{limit}",
  smoothSpoken: "Ledger too smooth {count}/{limit}. Commit {limit} times in one case at the same spot, within ±{span} Heat, and you lose 1/{share} of the share bound for the Vault when the case closes",
};
