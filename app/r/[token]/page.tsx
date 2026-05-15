import { notFound } from 'next/navigation';
import { createAnonClient } from '@/lib/supabase/anon';
import type { Database, EstadoPedido } from '@/types/database.types';
import { ESTADO_COLORES, ESTADO_DOT, ESTADO_LABELS } from '@/lib/utils/estados';
import { formatFecha, tiempoTranscurrido } from '@/lib/utils/tiempo';

type Pedido = Database['public']['Tables']['pedidos']['Row'];
type Cambio = {
  id: string;
  pedido_id: string;
  estado_anterior: EstadoPedido | null;
  estado_nuevo: EstadoPedido;
  usuario_nombre: string | null;
  fecha_cambio: string;
};

interface Props {
  params: { token: string };
}

export const dynamic = 'force-dynamic';

async function getPedido(token: string): Promise<{ pedido: Pedido; cambios: Cambio[] } | null> {
  const supabase = createAnonClient();
  const { data, error } = await supabase.rpc('get_pedido_publico', { p_token: token });
  if (error || !data) return null;
  const result = data as unknown as { pedido: Pedido; cambios: Cambio[] } | null;
  if (!result?.pedido) return null;
  return result;
}

export default async function VistaPublicaPage({ params }: Props) {
  const data = await getPedido(params.token);
  if (!data) return notFound();

  const { pedido, cambios } = data;

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-md mx-auto space-y-5">
        <div className="text-center space-y-2 rise rise-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] ring-1 ring-white/10 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            <span className={`w-1.5 h-1.5 rounded-full ${ESTADO_DOT[pedido.estado]} shadow-[0_0_10px_2px] shadow-current/50`} />
            puntocell · seguimiento
          </div>
          <h1 className="font-display text-3xl tracking-tight">Tu reparación</h1>
          <p className="text-xs font-mono text-muted-foreground">#{pedido.token_publico}</p>
        </div>

        <div className="rise rise-2 relative overflow-hidden rounded-3xl bg-white/[0.04] backdrop-blur-2xl ring-1 ring-white/10 shadow-glass p-6">
          <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-violet-500/20 blur-3xl pointer-events-none" />
          <p className="relative text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-3">
            Estado actual
          </p>
          <p className="relative font-display text-4xl tracking-tight aurora-text">
            {ESTADO_LABELS[pedido.estado]}
          </p>
          <p className="relative text-xs text-muted-foreground mt-3">
            Actualizado {tiempoTranscurrido(pedido.fecha_actualizacion)}
          </p>
          <span className={`relative inline-flex mt-4 text-[10px] uppercase tracking-widest rounded-full px-2.5 py-1 ${ESTADO_COLORES[pedido.estado]}`}>
            {ESTADO_LABELS[pedido.estado]}
          </span>
        </div>

        <div className="rise rise-3 rounded-2xl bg-white/[0.04] backdrop-blur-xl ring-1 ring-white/10 divide-y divide-white/[0.06]">
          <Row label="Cliente" value={pedido.cliente_nombre} />
          <Row label="Equipo" value={pedido.equipo} />
          <Row label="Problema" value={pedido.problema} multiline />
          {pedido.tiempo_estimado && <Row label="Tiempo estimado" value={pedido.tiempo_estimado} />}
          <Row label="Ingresado" value={formatFecha(pedido.fecha_ingreso)} />
        </div>

        {cambios.length > 0 && (
          <div className="rise rise-4 rounded-2xl bg-white/[0.04] backdrop-blur-xl ring-1 ring-white/10 p-5">
            <h2 className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-4">
              Historial
            </h2>
            <ol className="space-y-3 relative">
              <span className="absolute left-[3px] top-2 bottom-2 w-px bg-white/10" aria-hidden />
              {cambios.map((c) => (
                <li key={c.id} className="relative pl-5 text-xs">
                  <span className={`absolute left-0 top-1 w-1.5 h-1.5 rounded-full ${ESTADO_DOT[c.estado_nuevo]} shadow-[0_0_8px_1px] shadow-current/50`} />
                  <p className="text-foreground/90">
                    Pasó a <span className="font-medium">{ESTADO_LABELS[c.estado_nuevo]}</span>
                  </p>
                  <p className="text-muted-foreground mt-0.5">
                    Hace {tiempoTranscurrido(c.fecha_cambio)} · por {c.usuario_nombre ?? 'Sistema'}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        )}

        <p className="text-center text-[11px] text-muted-foreground/70 pb-4">
          Para consultas, comunicate al local con el código de tu reparación.
        </p>
      </div>
    </div>
  );
}

function Row({ label, value, multiline }: { label: string; value: string; multiline?: boolean }) {
  return (
    <div className="px-5 py-3.5">
      <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1">{label}</p>
      <p className={multiline ? 'text-sm whitespace-pre-wrap text-foreground/90' : 'text-sm text-foreground/90'}>
        {value}
      </p>
    </div>
  );
}
