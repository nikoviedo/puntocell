# Mi Reparaciones

Sistema de gestión de reparaciones con Next.js 14, TypeScript y Tailwind CSS.

## Iniciar desarrollo

npm run dev

Abrir http://localhost:3000

## Usuarios de prueba

| Email | Contraseña | Rol |
|-------|-----------|-----|
| admin@localhost | 123456 | Admin |
| tecnico@localhost | 123456 | Técnico |
| recepcion@localhost | 123456 | Recepción |

## Flujo de uso

1. Login con uno de los usuarios de prueba
2. Crear un nuevo pedido desde "Nuevo Pedido"
3. Ver el QR y la URL pública generada
4. Mover estados en el tablero Kanban arrastrando tarjetas
5. El cliente puede ver su reparación en /r/{TOKEN}

## Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- @dnd-kit para drag & drop
- qrcode.react para QR
- Mock data en memoria (sin BD real)

## Fase 2 (próximamente)

- Integración MySQL con Prisma
- Autenticación real con NextAuth
- Notificaciones SMS/WhatsApp
- Impresión de tickets
