/**
 * Which workflows GitHub turned off for inactivity (N7 of the 2026-11-12
 * next-improvements note), for .github/workflows/workflow-keepalive.yml.
 *
 * A public repository's scheduled workflows are turned off after 60 days with
 * no activity (state `disabled_inactivity`). The keepalive run lists the
 * workflows (`gh api repos/{repo}/actions/workflows`), turns those back on
 * with `gh workflow enable <id>`, and writes what it did to the Job Summary.
 * It never commits: a dummy commit to main is not how this is kept alive.
 * Workflows the owner turned off by hand (`disabled_manually`) are left off.
 *
 *   node scripts/workflow-keepalive.mjs --ids <workflows.json>       ids to enable, one per line
 *   node scripts/workflow-keepalive.mjs --summary <workflows.json> [lastCommitIso]
 */
import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

import { describeInactivity, quietDays } from "./report-ops-health.mjs";

export const INACTIVE = "disabled_inactivity";

export function readWorkflows(parsed) {
  const list = Array.isArray(parsed) ? parsed : Array.isArray(parsed?.workflows) ? parsed.workflows : [];
  return list.map((w) => ({ id: Number(w.id), name: String(w.name ?? ""), path: String(w.path ?? ""), state: String(w.state ?? "") }));
}

export const toEnable = (workflows) => workflows.filter((w) => w.state === INACTIVE && Number.isInteger(w.id) && w.id > 0);

export function describeKeepalive(workflows, days = null) {
  const off = toEnable(workflows);
  const manual = workflows.filter((w) => w.state === "disabled_manually");
  const lines = ["## 예약 워크플로 살리기", ""];
  lines.push(off.length ? `비활성으로 꺼진 워크플로 ${off.length}개를 다시 켰습니다: ${off.map((w) => `\`${w.name}\``).join(", ")}` : "비활성으로 꺼진 워크플로는 없습니다.");
  if (manual.length) lines.push("", `손으로 끈 워크플로는 그대로 둡니다: ${manual.map((w) => `\`${w.name}\``).join(", ")}`);
  const inactivity = describeInactivity(days);
  if (inactivity) lines.push("", inactivity);
  return lines.join("\n");
}

const args = import.meta.url === pathToFileURL(process.argv[1] ?? "").href ? process.argv.slice(2) : [];
if (args[0] === "--ids") {
  const ids = toEnable(readWorkflows(JSON.parse(readFileSync(args[1], "utf8")))).map((w) => w.id);
  process.stdout.write(ids.length ? `${ids.join("\n")}\n` : "");
} else if (args[0] === "--summary") {
  process.stdout.write(`${describeKeepalive(readWorkflows(JSON.parse(readFileSync(args[1], "utf8"))), quietDays(args[2]))}\n`);
}
