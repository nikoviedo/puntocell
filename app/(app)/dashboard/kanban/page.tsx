'use client';

import { useEffect, useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { Pedido, EstadoPedido } from '@/types';
import { ESTADOS_ORDEN } from '@/lib/utils/estados';
import { getCurrentUser } from '@/lib/auth';
import { KanbanCard } from '@/components/KanbanCard';
import { KanbanColumn } from '@/components/KanbanColumn';

export default function KanbanPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  useEffect(() => {
    fetch('/api/pedidos')
      .then((r) => r.json())
      .then((data) => { setPedidos(data); setLoading(false); });
  }, []);

  function getPedidosByEstado(estado: EstadoPedido) {
    return pedidos.filter((p) => p.estado === estado);
  }

  // La columna debe resaltarse si el cursor está sobre ella O sobre cualquier tarjeta dentro de ella
  function getColumnIsDragOver(estado: EstadoPedido): boolean {
    if (!overId || !activeId) return false;
    if (overId === estado) return true;
    return getPedidosByEstado(estado).some((p) => p.id === overId);
  }

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  function handleDragOver(event: DragOverEvent) {
    setOverId((event.over?.id as string) ?? null);
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveId(null);
    setOverId(null);

    if (!over) return;

    const pedidoId = active.id as string;
    const overedId = over.id as string;

    // Determinar el nuevo estado: puede ser el id de la columna o el id de una tarjeta
    let nuevoEstado: EstadoPedido;
    if (ESTADOS_ORDEN.includes(overedId as EstadoPedido)) {
      nuevoEstado = overedId as EstadoPedido;
    } else {
      // Cayó encima de una tarjeta — usar la columna de esa tarjeta
      const overPedido = pedidos.find((p) => p.id === overedId);
      if (!overPedido) return;
      nuevoEstado = overPedido.estado;
    }

    const pedido = pedidos.find((p) => p.id === pedidoId);
    if (!pedido || pedido.estado === nuevoEstado) return;

    const usuario = getCurrentUser();

    // Optimistic update
    setPedidos((prev) =>
      prev.map((p) =>
        p.id === pedidoId
          ? { ...p, estado: nuevoEstado, fecha_actualizacion: new Date().toISOString() }
          : p
      )
    );

    // Persist
    await fetch(`/api/pedidos/${pedidoId}/estado`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estado: nuevoEstado, usuario_id: usuario?.id || '1', usuario_nombre: usuario?.nombre || 'Sistema' }),
    });
  }

  const activePedido = pedidos.find((p) => p.id === activeId);

  if (loading) return <div className="text-gray-500">Cargando...</div>;

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-gray-900">Tablero Kanban</h1>
      <div className="flex gap-3 overflow-x-auto pb-4">
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          {ESTADOS_ORDEN.map((estado) => (
            <KanbanColumn
              key={estado}
              estado={estado}
              pedidos={getPedidosByEstado(estado)}
              isDragOver={getColumnIsDragOver(estado)}
            />
          ))}
          <DragOverlay>
            {activePedido && <KanbanCard pedido={activePedido} overlay />}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
}
