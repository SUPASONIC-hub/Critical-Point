-- Give queued telemetry a stable server-side identity. Retries then become
-- harmless: the same queue item is accepted once and ignored afterwards.
alter table public.playtest_sessions add column if not exists event_id text;
alter table public.playtest_feedback add column if not exists event_id text;
alter table public.app_error_logs add column if not exists event_id text;

create unique index if not exists playtest_sessions_event_id_idx
  on public.playtest_sessions (event_id) where event_id is not null;
create unique index if not exists playtest_feedback_event_id_idx
  on public.playtest_feedback (event_id) where event_id is not null;
create unique index if not exists app_error_logs_event_id_idx
  on public.app_error_logs (event_id) where event_id is not null;

notify pgrst, 'reload schema';
