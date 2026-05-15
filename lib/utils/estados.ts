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
  Recibido: 'bg-slate-400/15 text-slate-200 ring-1 ring-slate-400/30',
  Diagnosticando: 'bg-cyan-400/15 text-cyan-200 ring-1 ring-cyan-400/30',
  EsperandoRepuesto: 'bg-amber-400/15 text-amber-200 ring-1 ring-amber-400/30',
  EnReparacion: 'bg-violet-400/15 text-violet-200 ring-1 ring-violet-400/40',
  ListoParaRetirar: 'bg-emerald-400/15 text-emerald-200 ring-1 ring-emerald-400/40',
  Entregado: 'bg-white/[0.04] text-muted-foreground ring-1 ring-white/10',
  Cancelado: 'bg-rose-400/15 text-rose-200 ring-1 ring-rose-400/30',
};

export const ESTADO_DOT: Record<EstadoPedido, string> = {
  Recibido: 'bg-slate-300',
  Diagnosticando: 'bg-cyan-300',
  EsperandoRepuesto: 'bg-amber-300',
  EnReparacion: 'bg-violet-300',
  ListoParaRetirar: 'bg-emerald-300',
  Entregado: 'bg-white/30',
  Cancelado: 'bg-rose-300',
};

export const ESTADO_HEADER_COLORES: Record<EstadoPedido, string> = {
  Recibido: 'from-slate-400/30 to-slate-400/5',
  Diagnosticando: 'from-cyan-400/30 to-cyan-400/5',
  EsperandoRepuesto: 'from-amber-400/30 to-amber-400/5',
  EnReparacion: 'from-violet-400/30 to-violet-400/5',
  ListoParaRetirar: 'from-emerald-400/30 to-emerald-400/5',
  Entregado: 'from-white/15 to-white/0',
  Cancelado: 'from-rose-400/30 to-rose-400/5',
};

export const ESTADO_LABELS: Record<EstadoPedido, string> = {
  Recibido: 'Recibido',
  Diagnosticando: 'Diagnóstico',
  EsperandoRepuesto: 'Esperando repuesto',
  EnReparacion: 'En reparación',
  ListoParaRetirar: 'Listo para retirar',
  Entregado: 'Entregado',
  Cancelado: 'Cancelado',
};
