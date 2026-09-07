# Autonomous Improvement Team

Run one improvement cycle from the repository root:

```powershell
npm run agents:cycle
```

Useful modes:

```powershell
npm run agents:cycle -- --dry-run
npm run agents:cycle -- --cycles 3
npm run agents:cycle -- --from qa
```

The orchestrator invokes the local `codex exec` command sequentially. Each role
gets a narrow prompt and writes its report to `.agents/runs/<timestamp>/`.
The directory is ignored by Git so generated deliberation does not pollute the
product history. Source changes remain in the working tree for review.

The default loop requires a clean working tree before it starts, never commits
or pushes, and stops when QA fails. Review `07-qa.md` and the final diff before
committing. Database migrations are files only; apply them separately through
the normal Supabase deployment process.

The cycle is intentionally sequential. PM, design, sound, and DBA work may look
parallel, but they all influence the same implementation contract and parallel
edits would create avoidable conflicts.
