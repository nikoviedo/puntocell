-- =============================================================================
-- Seed inicial · usuarios de prueba + un pedido demo
-- Correr DESPUÉS de 0001_init.sql en Studio SQL editor.
-- Si los usuarios ya existen, este script falla por unique violation: ignorar.
-- =============================================================================

-- Helper: crea un user en auth.users + profile, todo en una transacción
-- (requiere acceso a auth.users, sólo posible desde Studio / service_role)

do $$
declare
  v_admin uuid := gen_random_uuid();
  v_tecnico uuid := gen_random_uuid();
  v_recepcion uuid := gen_random_uuid();
begin
  -- admin
  insert into auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, aud, role)
  values (
    v_admin,
    '00000000-0000-0000-0000-000000000000',
    'admin@localhost',
    crypt('puntocell123', gen_salt('bf')),
    now(),
    jsonb_build_object('nombre', 'Admin', 'rol', 'admin'),
    'authenticated',
    'authenticated'
  )
  on conflict (email) do nothing;

  -- técnico
  insert into auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, aud, role)
  values (
    v_tecnico,
    '00000000-0000-0000-0000-000000000000',
    'tecnico@localhost',
    crypt('puntocell123', gen_salt('bf')),
    now(),
    jsonb_build_object('nombre', 'Técnico', 'rol', 'tecnico'),
    'authenticated',
    'authenticated'
  )
  on conflict (email) do nothing;

  -- recepción
  insert into auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, aud, role)
  values (
    v_recepcion,
    '00000000-0000-0000-0000-000000000000',
    'recepcion@localhost',
    crypt('puntocell123', gen_salt('bf')),
    now(),
    jsonb_build_object('nombre', 'Recepción', 'rol', 'recepcion'),
    'authenticated',
    'authenticated'
  )
  on conflict (email) do nothing;
end $$;

-- Un pedido demo
insert into public.pedidos (cliente_nombre, cliente_telefono, equipo, problema, tiempo_estimado, estado)
values (
  'Juan Pérez',
  '11 2233-4455',
  'iPhone 13',
  'Pantalla rota, no responde al tacto en el cuadrante superior derecho.',
  '3 días',
  'Diagnosticando'
)
on conflict do nothing;
