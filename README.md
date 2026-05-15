# puntocell

Sistema de gestión de reparaciones con Next.js 14, TypeScript, Tailwind y Supabase self-hosted.

## Stack

- Next.js 14 (App Router) + TypeScript + Tailwind + shadcn/ui
- @dnd-kit (kanban con drag & drop)
- qrcode.react (QR para vista pública del cliente)
- Supabase self-hosted en VPS: Postgres + Auth + Realtime + RLS

## Setup

### 1. Aplicar el schema en Supabase

En tu Supabase Studio (`http://<tu-vps>:8000` o el dominio que uses), abrí **SQL Editor** y ejecutá en orden:

1. `supabase/migrations/0001_init.sql` — crea tablas, RLS, triggers, función pública por token.
2. `supabase/seed.sql` — crea usuarios de prueba y un pedido demo.

### 2. Variables de entorno

Copiá el ejemplo y completá con la URL y el `anon` key de tu Supabase (los encontrás en **Settings → API** de Studio):

```bash
cp .env.local.example .env.local
# editar .env.local con tu URL y anon key
```

### 3. Instalar y correr

```bash
npm install
npm run dev
```

Abrir http://localhost:3000

## Usuarios de prueba (después del seed)

| Email | Contraseña | Rol |
|---|---|---|
| admin@localhost | puntocell123 | admin |
| tecnico@localhost | puntocell123 | tecnico |
| recepcion@localhost | puntocell123 | recepcion |

> Cambiá las contraseñas antes de exponer la app a internet.

## Permisos (RLS)

- **admin** — todo (crear, editar, borrar pedidos; administrar perfiles)
- **recepcion** — crear y editar pedidos
- **tecnico** — actualizar estado de pedidos
- **anon** — ver el estado de un pedido por token vía función `get_pedido_publico`

## Flujo de uso

1. Login con un usuario del seed
2. Crear un nuevo pedido — se genera código + QR automáticamente
3. Compartir la URL pública con el cliente: `/r/{TOKEN}`
4. El equipo arrastra tarjetas en el Kanban — actualizaciones en tiempo real entre usuarios
5. El cliente refresca su URL pública y ve el estado actualizado y el historial

## Deploy en VPS Hostinger

```bash
# en el VPS, con Node 20+ y nginx + PM2 ya instalados
git clone https://github.com/nikoviedo/puntocell.git
cd puntocell
npm ci
cp .env.local.example .env.local  # editar con creds
npm run build
pm2 start "npm start" --name puntocell
# luego configurar reverse-proxy en nginx hacia 127.0.0.1:3000
```

## Regenerar tipos del schema (opcional)

```bash
npx supabase gen types typescript \
  --db-url "postgresql://postgres:<pass>@<host>:5432/postgres" \
  --schema public > types/database.types.ts
```
