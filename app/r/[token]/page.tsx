import { notFound } from 'next/navigation';
import type { Pedido, CambioEstado } from '@/types';
import { ESTADO_COLORES, ESTADO_LABELS } from '@/lib/utils/estados';
import { formatFecha, tiempoTranscurrido } from '@/lib/utils/tiempo';

interface Props {
  params: { token: string };
}

async function getPedido(token: string): Promise<{ pedido: Pedido; cambios: CambioEstado[] } | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/pedidos/token/${token}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function VistaPublicaPage({ params }: Props) {
  const data = await getPedido(params.token);

  if (!data) return notFound();

  const { pedido, cambios } = data;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-md mx-auto space-y-4">
        <div className="text-center">
          <h1 className="text-xl font-bold text-gray-900">🔧 Estado de tu reparación</h1>
          <p className="text-sm text-gray-500 font-mono mt-1">#{pedido.token_publico}</p>
        </div>

        {/* Estado principal */}
        <div className={`rounded-xl p-5 border-2 ${ESTADO_COLORES[pedido.estado]}`}>
          <p className="text-xs font-medium uppercase tracking-wide opacity-70 mb-1">Estado actual</p>
          <p className="text-2xl font-bold">{ESTADO_LABELS[pedido.estado]}</p>
          <p className="text-sm opacity-70 mt-1">
            Actualizado {tiempoTranscurrido(pedido.fecha_actualizacion)}
          </p>
        </div>

        {/* Datos del pedido */}
        <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
          <Row label="Cliente" value={pedido.cliente_nombre} />
          <Row label="Equipo" value={pedido.equipo} />
          <Row label="Problema" value={pedido.problema} />
          {pedido.tiempo_estimado && <Row label="Tiempo estimado" value={pedido.tiempo_estimado} />}
          <Row label="Ingresado" value={formatFecha(pedido.fecha_ingreso)} />
        </div>

        {/* Historial de cambios */}
        {cambios.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h2 className="text-sm font-semibold text-gray-700 mb-3">Historial</h2>
            <div className="space-y-2">
              {cambios.map((c) => (
                <div key={c.id} className="text-xs text-gray-600 flex items-start gap-2">
                  <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                  <span>
                    Pasó a <strong>{ESTADO_LABELS[c.estado_nuevo]}</strong>{' '}
                    hace {tiempoTranscurrido(c.fecha_cambio)} · por {c.usuario_nombre}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <p className="text-center text-xs text-gray-400 pb-4">
          Si tenés dudas, comunicate al local con el código de tu reparación
        </p>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex px-4 py-3 gap-3">
      <span className="text-xs text-gray-500 w-28 shrink-0">{label}</span>
      <span className="text-sm text-gray-900">{value}</span>
    </div>
  );
}
