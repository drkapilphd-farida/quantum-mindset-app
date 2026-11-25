-- Brain Test v2 → WhatsApp result card (founder, 25 Nov 2026).
-- The bot puts a per-contact token in the test link (?c=…). The test page saves
-- progress after every step (numbers + a card image). When the contact finishes,
-- or leaves half-way for 10 minutes, the edge function `brain-test-send` sends the
-- card on WhatsApp with a personal message and the next step.
-- Visitors who came without a token are matched when they send "Ref: BU-…".
-- Safe to run more than once.

create extension if not exists pg_net;
create extension if not exists pg_cron;

alter table public.wa_contacts add column if not exists bt_token text;
create unique index if not exists wa_contacts_bt_token_key on public.wa_contacts (bt_token);

create table if not exists public.bt_progress (
  session_id text primary key,
  token text,
  contact_id uuid references public.wa_contacts(id) on delete set null,
  ref text unique,
  lang text not null default 'en' check (lang in ('en', 'hi')),
  role text,
  phases_done int not null default 0 check (phases_done between 0 and 6),
  facts jsonb not null default '{}'::jsonb,
  card_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  sent_partial_at timestamptz,
  sent_full_at timestamptz,
  send_result text
);
create index if not exists bt_progress_contact_idx on public.bt_progress (contact_id);
create index if not exists bt_progress_pending_idx on public.bt_progress (updated_at)
  where sent_full_at is null and sent_partial_at is null;

alter table public.bt_progress enable row level security;
drop policy if exists "bt progress admin read" on public.bt_progress;
create policy "bt progress admin read" on public.bt_progress for select using (public.wa_is_admin());

-- Shared secret between the database and the edge function (never leaves the server).
insert into public.wa_settings (key, value)
values ('bt_send_secret', replace(gen_random_uuid()::text || gen_random_uuid()::text, '-', ''))
on conflict (key) do nothing;

-- Calls the edge function for one session.
create or replace function public.bt_send(p_session text) returns void
language plpgsql security definer set search_path = public as $$
begin
  perform net.http_post(
    url := 'https://isdohdsscwumvmzgtgua.supabase.co/functions/v1/brain-test-send',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-bt-secret', (select value from public.wa_settings where key = 'bt_send_secret')
    ),
    body := jsonb_build_object('session_id', p_session)
  );
end $$;
revoke all on function public.bt_send(text) from public, anon, authenticated;

-- Finished test with a known contact → send the full card right away.
create or replace function public.bt_progress_kick() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if new.contact_id is not null and new.phases_done = 6 and new.sent_full_at is null then
    perform public.bt_send(new.session_id);
  end if;
  return new;
end $$;
drop trigger if exists bt_progress_kick on public.bt_progress;
create trigger bt_progress_kick
  after insert or update of phases_done, contact_id on public.bt_progress
  for each row execute function public.bt_progress_kick();

-- Left half-way: after 10 quiet minutes, send what they did + "finish the rest".
create or replace function public.bt_sweep_partial() returns int
language plpgsql security definer set search_path = public as $$
declare r record; n int := 0;
begin
  for r in
    select session_id from public.bt_progress
    where contact_id is not null and phases_done between 1 and 5
      and sent_partial_at is null and sent_full_at is null
      and updated_at < now() - interval '10 minutes'
      and updated_at > now() - interval '20 hours'
    limit 50
  loop
    perform public.bt_send(r.session_id);
    n := n + 1;
  end loop;
  return n;
end $$;
revoke all on function public.bt_sweep_partial() from public, anon, authenticated;

select cron.unschedule(jobid) from cron.job where jobname = 'bt-sweep-partial';
select cron.schedule('bt-sweep-partial', '*/5 * * * *', $$select public.bt_sweep_partial()$$);
