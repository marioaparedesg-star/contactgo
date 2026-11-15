-- ContactGo email marketing preferences and idempotent automation ledger.
-- This migration is intentionally additive. It does not alter orders, payments, AZUL, or existing cron schedules.

create table if not exists public.email_marketing_preferences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  email text not null,
  marketing_consent boolean not null default false,
  consented_at timestamptz,
  consent_source text,
  consent_version text,
  unsubscribed_at timestamptz,
  suppression_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint email_marketing_preferences_email_nonempty check (length(trim(email)) > 3),
  constraint email_marketing_preferences_consent_audit check (
    marketing_consent = false or (consented_at is not null and consent_source is not null and consent_version is not null)
  )
);

create unique index if not exists email_marketing_preferences_email_lower_uidx
  on public.email_marketing_preferences (lower(email));
create index if not exists email_marketing_preferences_user_id_idx
  on public.email_marketing_preferences (user_id);

alter table public.email_marketing_preferences enable row level security;

drop policy if exists "Users can read own email preferences" on public.email_marketing_preferences;
create policy "Users can read own email preferences"
  on public.email_marketing_preferences for select to authenticated
  using ((select auth.uid()) = user_id);

revoke all on public.email_marketing_preferences from anon;
grant select on public.email_marketing_preferences to authenticated;
grant all on public.email_marketing_preferences to service_role;

create table if not exists public.email_automation_events (
  id uuid primary key default gen_random_uuid(),
  recipient_email text not null,
  user_id uuid references auth.users(id) on delete set null,
  automation_key text not null,
  step_key text not null,
  event_key text not null unique,
  related_order_id uuid references public.orders(id) on delete set null,
  status text not null default 'pending'
    check (status in ('pending','processing','sent','failed','skipped','canceled')),
  scheduled_at timestamptz,
  sent_at timestamptz,
  provider_message_id text,
  attempts integer not null default 0 check (attempts >= 0),
  last_error text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists email_automation_events_due_idx
  on public.email_automation_events (status, scheduled_at);
create index if not exists email_automation_events_recipient_idx
  on public.email_automation_events (lower(recipient_email), created_at desc);
create index if not exists email_automation_events_order_idx
  on public.email_automation_events (related_order_id, automation_key);

alter table public.email_automation_events enable row level security;
revoke all on public.email_automation_events from anon, authenticated;
grant all on public.email_automation_events to service_role;

comment on table public.email_marketing_preferences is
  'Explicit opt-in, unsubscribe and suppression preferences for non-transactional ContactGo email.';
comment on table public.email_automation_events is
  'Idempotent delivery ledger for ContactGo email automations; service-role access only.';
