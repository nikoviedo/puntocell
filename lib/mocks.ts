import { v4 as uuidv4 } from 'uuid';
import type { Pedido, Usuario, CambioEstado, EstadoPedido } from '@/types';

export const MOCK_USUARIOS: Usuario[] = [
  {
    id: '1',
    email: 'admin@localhost',
    password_hash: '123456',
    nombre: 'Admin Sistema',
    rol: 'admin',
  },
  {
    id: '2',
    email: 'tecnico@localhost',
    password_hash: '123456',
    nombre: 'Carlos Técnico',
    rol: 'tecnico',
  },
  {
    id: '3',
    email: 'recepcion@localhost',
    password_hash: '123456',
    nombre: 'Laura Recepción',
    rol: 'recepcionista',
  },
];

export function generarToken(): string {
  return uuidv4().replace(/-/g, '').substring(0, 12).toUpperCase();
}

// In-memory store (resets on server restart)
export let pedidos: Pedido[] = [
  {
    id: '1',
    token_publico: 'ABC123DEF456',
    cliente_nombre: 'Juan Pérez',
    cliente_telefono: '1122334455',
    equipo: 'iPhone 13 Pro',
    problema: 'Pantalla rota, no responde al tacto',
    tiempo_estimado: '3 días',
    estado: 'Recibido',
    fecha_ingreso: new Date(Date.now() - 86400000 * 2).toISOString(),
    fecha_actualizacion: new Date(Date.now() - 86400000 * 2).toISOString(),
    usuario_id: '3',
  },
  {
    id: '2',
    token_publico: 'XYZ789GHI012',
    cliente_nombre: 'María García',
    cliente_telefono: '5566778899',
    equipo: 'Samsung Galaxy S22',
    problema: 'No carga, conector USB dañado',
    tiempo_estimado: '1 día',
    estado: 'Diagnosticando',
    fecha_ingreso: new Date(Date.now() - 86400000 * 3).toISOString(),
    fecha_actualizacion: new Date(Date.now() - 86400000 * 1).toISOString(),
    usuario_id: '3',
  },
  {
    id: '3',
    token_publico: 'MNO345PQR678',
    cliente_nombre: 'Roberto Silva',
    cliente_telefono: '3344556677',
    equipo: 'MacBook Pro 2020',
    problema: 'Teclado con teclas pegadas, líquido derramado',
    tiempo_estimado: '5 días',
    estado: 'EsperandoRepuesto',
    fecha_ingreso: new Date(Date.now() - 86400000 * 5).toISOString(),
    fecha_actualizacion: new Date(Date.now() - 86400000 * 2).toISOString(),
    usuario_id: '3',
  },
  {
    id: '4',
    token_publico: 'STU901VWX234',
    cliente_nombre: 'Ana López',
    cliente_telefono: '9988776655',
    equipo: 'Motorola G84',
    problema: 'Se reinicia solo, posible problema de batería',
    tiempo_estimado: '2 días',
    estado: 'EnReparacion',
    fecha_ingreso: new Date(Date.now() - 86400000 * 4).toISOString(),
    fecha_actualizacion: new Date(Date.now() - 86400000 * 0.5).toISOString(),
    usuario_id: '2',
  },
  {
    id: '5',
    token_publico: 'YZA567BCD890',
    cliente_nombre: 'Carlos Méndez',
    cliente_telefono: '1133557799',
    equipo: 'iPad Air 4ta Gen',
    problema: 'Botón home no funciona',
    tiempo_estimado: '2 días',
    estado: 'ListoParaRetirar',
    fecha_ingreso: new Date(Date.now() - 86400000 * 6).toISOString(),
    fecha_actualizacion: new Date(Date.now() - 86400000 * 0.2).toISOString(),
    usuario_id: '2',
  },
  {
    id: '6',
    token_publico: 'EFG123HIJ456',
    cliente_nombre: 'Sofía Torres',
    cliente_telefono: '2244668800',
    equipo: 'Notebook Lenovo ThinkPad',
    problema: 'No enciende, posible problema de placa',
    tiempo_estimado: '7 días',
    estado: 'Entregado',
    fecha_ingreso: new Date(Date.now() - 86400000 * 10).toISOString(),
    fecha_actualizacion: new Date(Date.now() - 86400000 * 1).toISOString(),
    usuario_id: '2',
  },
];

export let cambiosEstado: CambioEstado[] = [
  {
    id: '1',
    pedido_id: '2',
    estado_anterior: 'Recibido',
    estado_nuevo: 'Diagnosticando',
    usuario_id: '2',
    usuario_nombre: 'Carlos Técnico',
    fecha_cambio: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: '2',
    pedido_id: '4',
    estado_anterior: 'Recibido',
    estado_nuevo: 'Diagnosticando',
    usuario_id: '2',
    usuario_nombre: 'Carlos Técnico',
    fecha_cambio: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: '3',
    pedido_id: '4',
    estado_anterior: 'Diagnosticando',
    estado_nuevo: 'EnReparacion',
    usuario_id: '2',
    usuario_nombre: 'Carlos Técnico',
    fecha_cambio: new Date(Date.now() - 86400000 * 0.5).toISOString(),
  },
];

export function agregarCambioEstado(
  pedidoId: string,
  estadoAnterior: EstadoPedido,
  estadoNuevo: EstadoPedido,
  usuarioId: string,
  usuarioNombre: string
) {
  cambiosEstado.push({
    id: uuidv4(),
    pedido_id: pedidoId,
    estado_anterior: estadoAnterior,
    estado_nuevo: estadoNuevo,
    usuario_id: usuarioId,
    usuario_nombre: usuarioNombre,
    fecha_cambio: new Date().toISOString(),
  });
}
