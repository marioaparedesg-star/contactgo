-- Server-verified WebAuthn credentials and one-time challenges.
-- Access is restricted to server-side service_role; browser clients cannot read credentials or challenges.
create table if not exists public.user_passkeys (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  credential_id text not null unique,
  public_key text not null,
  counter bigint not null default 0 check (counter >= 0),
  transports text[] not null default '{}',
  device_type text not null default 'singleDevice' check (device_type in ('singleDevice','multiDevice')),
  backed_up boolean not null default false,
  created_at timestamptz not null default now(),
  last_used_at timestamptz
);
create index if not exists user_passkeys_user_id_idx on public.user_passkeys(user_id);
alter table public.user_passkeys enable row level security;
revoke all on table public.user_passkeys from public, anon, authenticated;
grant select, insert, update, delete on table public.user_passkeys to service_role;
create table if not exists public.passkey_challenges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  challenge text not null,
  purpose text not null check (purpose in ('registration','authentication')),
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);
create index if not exists passkey_challenges_expiry_idx on public.passkey_challenges(expires_at);
alter table public.passkey_challenges enable row level security;
revoke all on table public.passkey_challenges from public, anon, authenticated;
grant select, insert, update, delete on table public.passkey_challenges to service_role;
