import type { EstadoPedido } from '@/types';

export const ESTADOS_ORDEN: EstadoPedido[] = [
  'Recibido',
  'Diagnosticando',
  'EsperandoRepuesto',
  'EnReparacion',
  'ListoParaRetirar',
  'Entregado',
];

export const ESTADO_COLORES: Record<EstadoPedido, string> = {
  Recibido: 'bg-gray-100 text-gray-700 border-gray-300',
  Diagnosticando: 'bg-blue-100 text-blue-700 border-blue-300',
  EsperandoRepuesto: 'bg-orange-100 text-orange-700 border-orange-300',
  EnReparacion: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  ListoParaRetirar: 'bg-green-100 text-green-700 border-green-300',
  Entregado: 'bg-gray-100 text-gray-500 border-gray-200',
  Cancelado: 'bg-red-100 text-red-700 border-red-300',
};

export const ESTADO_HEADER_COLORES: Record<EstadoPedido, string> = {
  Recibido: 'bg-gray-200',
  Diagnosticando: 'bg-blue-200',
  EsperandoRepuesto: 'bg-orange-200',
  EnReparacion: 'bg-yellow-200',
  ListoParaRetirar: 'bg-green-200',
  Entregado: 'bg-gray-300',
  Cancelado: 'bg-red-200',
};

export const ESTADO_LABELS: Record<EstadoPedido, string> = {
  Recibido: 'Recibido',
  Diagnosticando: 'Diagnosticando',
  EsperandoRepuesto: 'Esperando Repuesto',
  EnReparacion: 'En Reparación',
  ListoParaRetirar: 'Listo para Retirar',
  Entregado: 'Entregado',
  Cancelado: 'Cancelado',
};
