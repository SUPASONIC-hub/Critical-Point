# Autonomous Improvement Team

Run one improvement cycle from the repository root:

```powershell
npm run agents:cycle
```

Useful modes:

```powershell
npm run agents:cycle -- --dry-run
npm run agents:cycle -- --cycles 3
npm run agents:cycle -- --brief "결과 화면에서 다음 사건으로 넘어가는 흐름을 개선"
npm run agents:cycle -- --from qa
npm run agents:cycle -- --provider claude
npm run agents:cycle -- --provider claude --model opus
```

The orchestrator drives a local agent CLI sequentially. `--provider codex`
(the default) runs `codex exec`; `--provider claude` runs `claude -p` and saves
the final message itself, because that CLI has no `-o`. Either can be preset
with `AGENT_PROVIDER`, and `--model` / `AGENT_MODEL` picks the model. Keep both
paths working: one vendor's usage limit should never be able to stop the loop.
Point `CODEX_CLI` or `CLAUDE_CLI` at an executable if it is not installed where
the script looks. Each role gets a narrow prompt and writes its report to
`.agents/runs/<timestamp>/`.
The directory is ignored by Git so generated deliberation does not pollute the
product history. Source changes remain in the working tree for review.

The default loop requires a clean working tree before it starts, never commits
or pushes, and stops when QA fails. Review `07-qa.md` and the final diff before
committing. Database migrations are files only; apply them separately through
the normal Supabase deployment process.

The cycle is intentionally sequential. PM, design, sound, and DBA work may look
parallel, but they all influence the same implementation contract and parallel
edits would create avoidable conflicts.
