// Types alineados con el schema de supabase/migrations/0001_init.sql.
// Para regenerar automáticamente:
//   npx supabase gen types typescript --db-url postgresql://... > types/database.types.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Rol = 'admin' | 'tecnico' | 'recepcion';

export type EstadoPedido =
  | 'Recibido'
  | 'Diagnosticando'
  | 'EsperandoRepuesto'
  | 'EnReparacion'
  | 'ListoParaRetirar'
  | 'Entregado'
  | 'Cancelado';

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          nombre: string;
          rol: Rol;
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          nombre: string;
          rol?: Rol;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          nombre?: string;
          rol?: Rol;
          created_at?: string;
        };
        Relationships: [];
      };
      pedidos: {
        Row: {
          id: string;
          token_publico: string;
          cliente_nombre: string;
          cliente_telefono: string | null;
          equipo: string;
          problema: string;
          tiempo_estimado: string | null;
          estado: EstadoPedido;
          fecha_ingreso: string;
          fecha_actualizacion: string;
          creado_por: string | null;
        };
        Insert: {
          id?: string;
          token_publico?: string;
          cliente_nombre: string;
          cliente_telefono?: string | null;
          equipo: string;
          problema: string;
          tiempo_estimado?: string | null;
          estado?: EstadoPedido;
          fecha_ingreso?: string;
          fecha_actualizacion?: string;
          creado_por?: string | null;
        };
        Update: {
          id?: string;
          token_publico?: string;
          cliente_nombre?: string;
          cliente_telefono?: string | null;
          equipo?: string;
          problema?: string;
          tiempo_estimado?: string | null;
          estado?: EstadoPedido;
          fecha_ingreso?: string;
          fecha_actualizacion?: string;
          creado_por?: string | null;
        };
        Relationships: [];
      };
      cambios_estado: {
        Row: {
          id: string;
          pedido_id: string;
          estado_anterior: EstadoPedido | null;
          estado_nuevo: EstadoPedido;
          usuario_id: string | null;
          usuario_nombre: string | null;
          fecha_cambio: string;
        };
        Insert: {
          id?: string;
          pedido_id: string;
          estado_anterior?: EstadoPedido | null;
          estado_nuevo: EstadoPedido;
          usuario_id?: string | null;
          usuario_nombre?: string | null;
          fecha_cambio?: string;
        };
        Update: {
          id?: string;
          pedido_id?: string;
          estado_anterior?: EstadoPedido | null;
          estado_nuevo?: EstadoPedido;
          usuario_id?: string | null;
          usuario_nombre?: string | null;
          fecha_cambio?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      get_pedido_publico: {
        Args: { p_token: string };
        Returns: Json;
      };
      is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
      gen_token_publico: {
        Args: Record<string, never>;
        Returns: string;
      };
    };
    Enums: {
      rol_usuario: Rol;
      estado_pedido: EstadoPedido;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
