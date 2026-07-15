-- Run this in your Supabase SQL editor (Database → SQL Editor → New query).
-- It fixes "Invalid code" on the invite/connect screen.
--
-- Root cause: RLS on `couples` correctly blocks a user from SELECTing a
-- row they don't yet belong to. So looking up the partner's invite_code
-- from the browser returns null → we render "Invalid code".
--
-- Fix: an atomic SECURITY DEFINER RPC that finds the row by code and
-- claims it for the current auth user in one transaction. RLS stays strict.

create or replace function public.join_couple_by_code(_code text)
returns table (
  id bigint,
  invite_code text,
  user1_id uuid,
  user2_id uuid,
  connected_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
declare
  _uid uuid := auth.uid();
  _row public.couples%rowtype;
begin
  if _uid is null then
    raise exception 'not_authenticated';
  end if;
  if _code is null or length(trim(_code)) = 0 then
    raise exception 'invalid_code';
  end if;

  select * into _row
  from public.couples
  where upper(invite_code) = upper(trim(_code))
  limit 1
  for update;

  if not found then
    raise exception 'invalid_code';
  end if;
  if _row.user1_id = _uid then
    raise exception 'own_code';
  end if;
  if _row.user2_id is not null then
    raise exception 'code_used';
  end if;

  update public.couples
     set user2_id = _uid,
         connected_at = now()
   where couples.id = _row.id
  returning * into _row;

  -- Best-effort notification for the code sharer (safe if table absent).
  begin
    insert into public.notifications (user_id, type, title, message, related_user_name, read)
    select _row.user1_id,
           'partner_joined',
           'You''re connected!',
           coalesce(u2.full_name, u2.name, 'Your partner') || ' joined using your invite code',
           coalesce(u2.full_name, u2.name, 'Your partner'),
           false
      from public.users u2
     where u2.auth_id = _uid
     limit 1;
  exception when undefined_table then null;
  end;

  return query
    select _row.id, _row.invite_code, _row.user1_id, _row.user2_id, _row.connected_at;
end;
$$;

revoke all on function public.join_couple_by_code(text) from public;
grant execute on function public.join_couple_by_code(text) to authenticated;

notify pgrst, 'reload schema';
