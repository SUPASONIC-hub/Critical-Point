# Deployment Operations

## Render

Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in the Render dashboard.
After a successful deploy, confirm the deployed commit is the latest `main`
commit and run the smoke check locally:

```powershell
$env:DEPLOY_URL = "https://critical-point.onrender.com"
npm run check:deploy
```

To run the same check in GitHub Actions, add a repository secret named
`DEPLOY_URL`. The `Deployed Smoke Check` workflow runs after `Verify` and can
also be started manually.

## Supabase environments

Use a separate Supabase project for staging. Link and push each environment
from its own protected branch or deployment job; never put a service-role key
in Render or the browser. The Vite variables are intentionally the public URL
and anon key only.

Before applying a production migration:

```powershell
npx supabase migration list --linked
npx supabase db push --dry-run
npx supabase db push
```

## Telemetry retention

The migration `20260907010000_add_telemetry_retention_function.sql` creates the
privileged function `public.purge_old_telemetry(interval)`. It refuses a
retention period shorter than 30 days and defaults to 180 days. Schedule it in
Supabase Cron or an external scheduler with a service-role connection. Do not
grant the function to `anon` or `authenticated`.

Example SQL for a controlled manual cleanup:

```sql
select * from public.purge_old_telemetry(interval '180 days');
```
