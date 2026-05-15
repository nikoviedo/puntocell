// Re-export desde el schema generado de Supabase para que el resto del código
// siga importando `@/types` sin cambios.

export type { EstadoPedido, Rol, Database } from './database.types';

import type { Database } from './database.types';

export type Pedido = Database['public']['Tables']['pedidos']['Row'];
export type CambioEstado = Database['public']['Tables']['cambios_estado']['Row'];
export type Profile = Database['public']['Tables']['profiles']['Row'];
