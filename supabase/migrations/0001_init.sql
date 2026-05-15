-- =============================================================================
-- puntocell · schema inicial
-- Postgres / Supabase self-hosted
-- =============================================================================

-- Enums ----------------------------------------------------------------------

create type rol_usuario as enum ('admin', 'tecnico', 'recepcion');

create type estado_pedido as enum (
  'Recibido',
  'Diagnosticando',
  'EsperandoRepuesto',
  'EnReparacion',
  'ListoParaRetirar',
  'Entregado',
  'Cancelado'
);

-- profiles  (1:1 con auth.users) ----------------------------------------------

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  nombre text not null,
  rol rol_usuario not null default 'recepcion',
  created_at timestamptz not null default now()
);

-- pedidos ---------------------------------------------------------------------

create table public.pedidos (
  id uuid primary key default gen_random_uuid(),
  token_publico text not null unique,
  cliente_nombre text not null,
  cliente_telefono text,
  equipo text not null,
  problema text not null,
  tiempo_estimado text,
  estado estado_pedido not null default 'Recibido',
  fecha_ingreso timestamptz not null default now(),
  fecha_actualizacion timestamptz not null default now(),
  creado_por uuid references public.profiles(id) on delete set null
);

create index pedidos_estado_idx on public.pedidos(estado);
create index pedidos_fecha_actualizacion_idx on public.pedidos(fecha_actualizacion desc);

-- cambios_estado --------------------------------------------------------------

create table public.cambios_estado (
  id uuid primary key default gen_random_uuid(),
  pedido_id uuid not null references public.pedidos(id) on delete cascade,
  estado_anterior estado_pedido,
  estado_nuevo estado_pedido not null,
  usuario_id uuid references public.profiles(id) on delete set null,
  usuario_nombre text,
  fecha_cambio timestamptz not null default now()
);

create index cambios_estado_pedido_idx on public.cambios_estado(pedido_id, fecha_cambio desc);

-- token_publico helper: 6 caracteres alfanuméricos en mayúsculas --------------

create or replace function public.gen_token_publico() returns text
language plpgsql as $$
declare
  alphabet text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  result text := '';
  i int;
begin
  for i in 1..6 loop
    result := result || substr(alphabet, 1 + floor(random() * length(alphabet))::int, 1);
  end loop;
  return result;
end
$$;

-- Trigger: token + audit cambio_estado en updates de estado ------------------

create or replace function public.set_token_publico() returns trigger
language plpgsql as $$
begin
  if new.token_publico is null or new.token_publico = '' then
    loop
      new.token_publico := public.gen_token_publico();
      exit when not exists (select 1 from public.pedidos where token_publico = new.token_publico);
    end loop;
  end if;
  return new;
end
$$;

create trigger pedidos_set_token
before insert on public.pedidos
for each row execute function public.set_token_publico();

-- security definer: la tabla cambios_estado tiene RLS y sólo se escribe
-- desde este trigger; bypass RLS para que UPDATE de pedidos no rebote.
create or replace function public.log_cambio_estado() returns trigger
language plpgsql security definer set search_path = public as $$
declare
  v_nombre text;
begin
  if (tg_op = 'UPDATE' and new.estado is distinct from old.estado) then
    select nombre into v_nombre from public.profiles where id = auth.uid();

    insert into public.cambios_estado (pedido_id, estado_anterior, estado_nuevo, usuario_id, usuario_nombre)
    values (new.id, old.estado, new.estado, auth.uid(), coalesce(v_nombre, 'Sistema'));

    new.fecha_actualizacion := now();
  end if;
  return new;
end
$$;

create trigger pedidos_log_estado
before update on public.pedidos
for each row execute function public.log_cambio_estado();

-- Auto-crear profile al crear auth.user ---------------------------------------

create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, nombre, rol)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'nombre', split_part(new.email, '@', 1)),
    coalesce((new.raw_user_meta_data->>'rol')::rol_usuario, 'recepcion')
  );
  return new;
end
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- =============================================================================
-- Row Level Security
-- =============================================================================

alter table public.profiles enable row level security;
alter table public.pedidos enable row level security;
alter table public.cambios_estado enable row level security;

-- Helper: ¿es admin?
create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and rol = 'admin');
$$;

-- profiles: ver todos los autenticados; cada uno actualiza su nombre; admin todo
create policy profiles_select_authed on public.profiles
  for select to authenticated using (true);

create policy profiles_update_self on public.profiles
  for update to authenticated
  using (id = auth.uid())
  with check (id = auth.uid() and rol = (select rol from public.profiles where id = auth.uid()));

create policy profiles_admin_all on public.profiles
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- pedidos: autenticados ven todo; insert admin+recepcion; update admin+tecnico+recepcion
create policy pedidos_select_authed on public.pedidos
  for select to authenticated using (true);

create policy pedidos_insert_staff on public.pedidos
  for insert to authenticated with check (
    exists (select 1 from public.profiles
            where id = auth.uid() and rol in ('admin', 'recepcion'))
  );

create policy pedidos_update_staff on public.pedidos
  for update to authenticated using (
    exists (select 1 from public.profiles
            where id = auth.uid() and rol in ('admin', 'recepcion', 'tecnico'))
  );

create policy pedidos_delete_admin on public.pedidos
  for delete to authenticated using (public.is_admin());

-- cambios_estado: lectura para autenticados; inserción sólo por trigger (security definer)
create policy cambios_select_authed on public.cambios_estado
  for select to authenticated using (true);

-- =============================================================================
-- Acceso público (anon) por token
-- =============================================================================

create or replace function public.get_pedido_publico(p_token text)
returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare
  v_pedido jsonb;
  v_cambios jsonb;
begin
  select to_jsonb(p) - 'creado_por' into v_pedido
    from public.pedidos p
   where p.token_publico = upper(p_token)
   limit 1;

  if v_pedido is null then
    return null;
  end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', c.id,
    'pedido_id', c.pedido_id,
    'estado_anterior', c.estado_anterior,
    'estado_nuevo', c.estado_nuevo,
    'usuario_nombre', c.usuario_nombre,
    'fecha_cambio', c.fecha_cambio
  ) order by c.fecha_cambio desc), '[]'::jsonb)
  into v_cambios
  from public.cambios_estado c
  where c.pedido_id = (v_pedido->>'id')::uuid;

  return jsonb_build_object('pedido', v_pedido, 'cambios', v_cambios);
end
$$;

grant execute on function public.get_pedido_publico(text) to anon, authenticated;

-- =============================================================================
-- Realtime (kanban)
-- =============================================================================

alter publication supabase_realtime add table public.pedidos;
alter publication supabase_realtime add table public.cambios_estado;
