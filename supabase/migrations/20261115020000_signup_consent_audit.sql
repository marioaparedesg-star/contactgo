-- Record required legal acknowledgements separately from optional marketing opt-in.
alter table public.email_marketing_preferences
  add column if not exists terms_accepted_at timestamptz,
  add column if not exists terms_version text,
  add column if not exists privacy_accepted_at timestamptz,
  add column if not exists privacy_policy_version text;
