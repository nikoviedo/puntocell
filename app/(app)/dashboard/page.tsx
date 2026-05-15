import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { ESTADO_COLORES, ESTADO_DOT, ESTADO_LABELS, ESTADOS_ORDEN } from '@/lib/utils/estados';
import { tiempoTranscurrido } from '@/lib/utils/tiempo';
import type { EstadoPedido } from '@/types/database.types';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const supabase = createClient();
  const { data: pedidos } = await supabase
    .from('pedidos')
    .select('*')
    .order('fecha_actualizacion', { ascending: false });

  const lista = pedidos ?? [];

  const conteoEstados = ESTADOS_ORDEN.reduce((acc, estado) => {
    acc[estado] = lista.filter((p) => p.estado === estado).length;
    return acc;
  }, {} as Record<EstadoPedido, number>);

  const pendientes = lista.filter(
    (p) => p.estado !== 'Entregado' && p.estado !== 'Cancelado',
  ).length;

  const listos = lista.filter((p) => p.estado === 'ListoParaRetirar').length;

  const activos = lista.filter((p) => p.estado !== 'Entregado' && p.estado !== 'Cancelado');

  return (
    <div className="space-y-8">
      <section className="rise rise-1 relative overflow-hidden rounded-3xl bg-white/[0.04] backdrop-blur-md ring-1 ring-white/10 shadow-glass p-6 sm:p-10">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-violet-500/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-20 w-80 h-80 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none" />
        <div className="relative flex flex-col sm:flex-row sm:items-end gap-6 sm:justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground mb-3">
              Reparaciones activas
            </div>
            <div className="flex items-baseline gap-3">
              <span className="font-display text-7xl sm:text-8xl leading-none tnum aurora-text">
                {pendientes.toString().padStart(2, '0')}
              </span>
              <span className="text-sm text-muted-foreground">pendientes</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2 max-w-sm">
              {listos > 0
                ? `${listos} ${listos === 1 ? 'equipo está listo' : 'equipos están listos'} para retirar.`
                : 'Sin equipos listos para retirar todavía.'}
            </p>
          </div>
          <Link
            href="/dashboard/nuevo-pedido"
            className="self-start sm:self-auto inline-flex items-center gap-2 btn-aurora text-white font-semibold rounded-2xl px-5 py-3 text-sm"
          >
            <span className="text-lg leading-none">+</span> Nuevo pedido
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {ESTADOS_ORDEN.map((estado, i) => (
          <div
            key={estado}
            className={`rise rise-${(i % 6) + 1} rounded-2xl bg-white/[0.035] backdrop-blur-sm ring-1 ring-white/[0.08] p-4 hover:ring-white/15 transition`}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className={`w-1.5 h-1.5 rounded-full ${ESTADO_DOT[estado]}`} />
              <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                {ESTADO_LABELS[estado]}
              </span>
            </div>
            <div className="font-display text-4xl tnum text-foreground leading-none">
              {(conteoEstados[estado] || 0).toString().padStart(2, '0')}
            </div>
          </div>
        ))}
      </section>

      <section className="rise rise-4 rounded-3xl bg-white/[0.04] backdrop-blur-md ring-1 ring-white/10 shadow-glass overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
          <div>
            <h2 className="text-base font-semibold">Reparaciones recientes</h2>
            <p className="text-xs text-muted-foreground">Equipos en flujo, ordenados por última actualización.</p>
          </div>
          <Link href="/dashboard/kanban" className="text-xs text-muted-foreground hover:text-foreground transition">
            Ver tablero →
          </Link>
        </div>
        <div className="divide-y divide-white/[0.04]">
          {activos.map((pedido) => (
            <div
              key={pedido.id}
              className="flex items-center justify-between gap-4 px-6 py-3.5 hover:bg-white/[0.02] transition"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${ESTADO_DOT[pedido.estado]} shadow-[0_0_10px_2px] shadow-current/40`} />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground truncate">
                      {pedido.cliente_nombre}
                    </span>
                    <span className="text-xs text-muted-foreground shrink-0">· {pedido.equipo}</span>
                  </div>
                  <div className="text-[11px] text-muted-foreground/80 mt-0.5 font-mono">
                    #{pedido.token_publico} · actualizado {tiempoTranscurrido(pedido.fecha_actualizacion)}
                  </div>
                </div>
              </div>
              <span className={`text-[10px] font-medium uppercase tracking-widest rounded-full px-2.5 py-1 shrink-0 ${ESTADO_COLORES[pedido.estado]}`}>
                {ESTADO_LABELS[pedido.estado]}
              </span>
            </div>
          ))}
          {activos.length === 0 && (
            <div className="px-6 py-10 text-center text-sm text-muted-foreground">
              No hay reparaciones activas. Creá un pedido nuevo para empezar.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
