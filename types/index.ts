export type EstadoPedido =
  | 'Recibido'
  | 'Diagnosticando'
  | 'EsperandoRepuesto'
  | 'EnReparacion'
  | 'ListoParaRetirar'
  | 'Entregado'
  | 'Cancelado';

export interface Pedido {
  id: string;
  token_publico: string;
  cliente_nombre: string;
  cliente_telefono: string;
  equipo: string;
  problema: string;
  tiempo_estimado: string;
  estado: EstadoPedido;
  fecha_ingreso: string;
  fecha_actualizacion: string;
  usuario_id: string;
}

export interface Usuario {
  id: string;
  email: string;
  password_hash: string;
  nombre: string;
  rol: 'admin' | 'tecnico' | 'recepcionista';
}

export interface CambioEstado {
  id: string;
  pedido_id: string;
  estado_anterior: EstadoPedido;
  estado_nuevo: EstadoPedido;
  usuario_id: string;
  usuario_nombre: string;
  fecha_cambio: string;
}
