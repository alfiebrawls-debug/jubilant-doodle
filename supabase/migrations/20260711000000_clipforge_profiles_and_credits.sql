-- ClipForge: user profiles + forge-credit tracking
-- (applied to the live project; kept here so `supabase db push` /
--  `supabase migration up` reproduces the schema anywhere)
--
-- Security model:
--   * clients can only SELECT their own profile (RLS)
--   * there are NO client write policies — every mutation goes through a
--     SECURITY DEFINER function so credits can never be edited directly
--   * credit decrement is a single guarded UPDATE => atomic under concurrency

create table public.clipforge_profiles (
  id            uuid primary key references auth.users (id) on delete cascade,
  email         text not null,
  display_name  text,
  tier_id       text not null default 'free'
                check (tier_id in ('free', 'pro', 'agency')),
  -- NULL = unlimited (paid tiers); free accounts start with exactly 1
  forge_credits integer default 1
                check (forge_credits is null or forge_credits >= 0),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

alter table public.clipforge_profiles enable row level security;

create policy "Users can view own profile"
  on public.clipforge_profiles
  for select
  to authenticated
  using ((select auth.uid()) = id);

-- Auto-provision a profile on signup (1 free forge credit via column default)
create function public.clipforge_handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.clipforge_profiles (id, email, display_name)
  values (new.id, new.email, split_part(new.email, '@', 1));
  return new;
end;
$$;

create trigger on_auth_user_created_clipforge
  after insert on auth.users
  for each row execute function public.clipforge_handle_new_user();

-- Atomically consume one forge credit for the calling user.
-- Returns whether the forge may proceed and the new balance
-- (credits_remaining is NULL for unlimited tiers).
create function public.consume_forge_credit()
returns table (allowed boolean, credits_remaining integer)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_tier    text;
  v_credits integer;
begin
  select p.tier_id, p.forge_credits into v_tier, v_credits
  from public.clipforge_profiles p
  where p.id = (select auth.uid());

  if v_tier is null then
    return query select false, 0;           -- no profile / not signed in
    return;
  end if;

  if v_credits is null then
    return query select true, null::integer; -- unlimited tier
    return;
  end if;

  -- The guard makes this safe under concurrent requests: only one of two
  -- simultaneous forges can win the last credit.
  update public.clipforge_profiles
     set forge_credits = forge_credits - 1,
         updated_at    = now()
   where id = (select auth.uid())
     and forge_credits > 0
  returning forge_credits into v_credits;

  if found then
    return query select true, v_credits;
  else
    return query select false, 0;
  end if;
end;
$$;

-- Refund a credit when a forge fails after the debit.
create function public.refund_forge_credit()
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_credits integer;
begin
  update public.clipforge_profiles
     set forge_credits = forge_credits + 1,
         updated_at    = now()
   where id = (select auth.uid())
     and forge_credits is not null
  returning forge_credits into v_credits;
  return v_credits;
end;
$$;

-- ⚠ DEMO ONLY: lets a signed-in user upgrade their own tier so the paywall
-- flow works end-to-end without a billing backend. In production, REVOKE
-- this and set tier_id from your Stripe / App Store webhook handler using
-- the service_role key.
create function public.demo_upgrade_tier(new_tier text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new_tier not in ('pro', 'agency') then
    raise exception 'invalid tier %', new_tier;
  end if;

  update public.clipforge_profiles
     set tier_id       = new_tier,
         forge_credits = null,   -- paid tiers are unlimited
         updated_at    = now()
   where id = (select auth.uid());
end;
$$;

-- Lock the functions down: only signed-in users may call the RPCs, and
-- the trigger function is not callable via the API at all.
revoke execute on function public.clipforge_handle_new_user() from public, anon, authenticated;
revoke execute on function public.consume_forge_credit() from public, anon;
revoke execute on function public.refund_forge_credit() from public, anon;
revoke execute on function public.demo_upgrade_tier(text) from public, anon;
grant execute on function public.consume_forge_credit() to authenticated;
grant execute on function public.refund_forge_credit() to authenticated;
grant execute on function public.demo_upgrade_tier(text) to authenticated;
