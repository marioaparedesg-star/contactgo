alter table public.abandoned_carts
  add column if not exists email_reminder_1_sent_at timestamptz,
  add column if not exists email_reminder_2_sent_at timestamptz,
  add column if not exists email_attempts integer not null default 0,
  add column if not exists email_last_error text,
  add column if not exists email_lock_until timestamptz,
  add column if not exists email_lock_step text;

create index if not exists abandoned_carts_email_recovery_due_idx
  on public.abandoned_carts (updated_at)
  where recuperado = false;

comment on column public.abandoned_carts.email_reminder_1_sent_at is 'Timestamp of first abandoned-cart email (sent after 2 hours).';
comment on column public.abandoned_carts.email_reminder_2_sent_at is 'Timestamp of second abandoned-cart email (sent 24 hours after abandonment).';
comment on column public.abandoned_carts.email_lock_until is 'Short-lived claim lock to prevent duplicate cron sends.';
