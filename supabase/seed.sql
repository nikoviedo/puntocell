-- =============================================================================
-- Seed inicial · pedido demo
-- Correr DESPUÉS de 0001_init.sql en Studio SQL editor.
--
-- IMPORTANTE: los usuarios NO se crean acá. Insertar directo en auth.users
-- deja columnas en NULL que rompen GoTrue. Crear los usuarios con la API
-- admin (ver supabase/seed-users.sh) o desde Studio → Authentication → Users.
-- =============================================================================

insert into public.pedidos (cliente_nombre, cliente_telefono, equipo, problema, tiempo_estimado, estado)
select 'Juan Perez', '11 2233-4455', 'iPhone 13',
       'Pantalla rota, no responde al tacto en el cuadrante superior derecho.',
       '3 dias', 'Diagnosticando'
where not exists (
  select 1 from public.pedidos where cliente_nombre = 'Juan Perez' and equipo = 'iPhone 13'
);
