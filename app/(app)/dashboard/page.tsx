'use client';

import { useEffect, useState } from 'react';
import type { Pedido, EstadoPedido } from '@/types';
import { ESTADO_COLORES, ESTADO_LABELS, ESTADOS_ORDEN } from '@/lib/utils/estados';
import { tiempoTranscurrido } from '@/lib/utils/tiempo';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function DashboardPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/pedidos')
      .then((r) => r.json())
      .then((data) => {
        setPedidos(data);
        setLoading(false);
      });
  }, []);

  const conteoEstados = ESTADOS_ORDEN.reduce((acc, estado) => {
    acc[estado] = pedidos.filter((p) => p.estado === estado).length;
    return acc;
  }, {} as Record<EstadoPedido, number>);

  const pendientes = pedidos.filter(
    (p) => p.estado !== 'Entregado' && p.estado !== 'Cancelado'
  ).length;

  if (loading) return <div className="text-gray-500">Cargando...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500">{pendientes} reparaciones activas</p>
      </div>

      {/* Resumen por estado */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {ESTADOS_ORDEN.map((estado) => (
          <Card key={estado} className="text-center">
            <CardContent className="pt-4 pb-3">
              <div className="text-2xl font-bold text-gray-900">{conteoEstados[estado] || 0}</div>
              <div className="text-xs text-gray-500 mt-1">{ESTADO_LABELS[estado]}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Lista de pedidos recientes */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Reparaciones recientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {pedidos
              .filter((p) => p.estado !== 'Entregado' && p.estado !== 'Cancelado')
              .sort((a, b) => new Date(b.fecha_actualizacion).getTime() - new Date(a.fecha_actualizacion).getTime())
              .map((pedido) => (
                <div
                  key={pedido.id}
                  className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900 truncate">
                        {pedido.cliente_nombre}
                      </span>
                      <span className="text-xs text-gray-400 shrink-0">{pedido.equipo}</span>
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">
                      Actualizado {tiempoTranscurrido(pedido.fecha_actualizacion)} · #{pedido.token_publico}
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={`text-xs shrink-0 ml-2 ${ESTADO_COLORES[pedido.estado]}`}
                  >
                    {ESTADO_LABELS[pedido.estado]}
                  </Badge>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
