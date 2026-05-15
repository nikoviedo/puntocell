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
import { createClient } from '@/lib/supabase/client';
import type { Database, EstadoPedido } from '@/types/database.types';
import { ESTADOS_ORDEN } from '@/lib/utils/estados';
import { KanbanCard } from '@/components/KanbanCard';
import { KanbanColumn } from '@/components/KanbanColumn';

type Pedido = Database['public']['Tables']['pedidos']['Row'];

export default function KanbanPage() {
  const supabase = createClient();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  useEffect(() => {
    let mounted = true;

    async function load() {
      const { data } = await supabase
        .from('pedidos')
        .select('*')
        .order('fecha_actualizacion', { ascending: false });
      if (mounted && data) {
        setPedidos(data);
        setLoading(false);
      }
    }
    load();

    const channel = supabase
      .channel('pedidos-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'pedidos' },
        (payload) => {
          setPedidos((prev) => {
            if (payload.eventType === 'INSERT') {
              return [payload.new as Pedido, ...prev];
            }
            if (payload.eventType === 'UPDATE') {
              return prev.map((p) =>
                p.id === (payload.new as Pedido).id ? (payload.new as Pedido) : p,
              );
            }
            if (payload.eventType === 'DELETE') {
              return prev.filter((p) => p.id !== (payload.old as Pedido).id);
            }
            return prev;
          });
        },
      )
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  function getPedidosByEstado(estado: EstadoPedido) {
    return pedidos.filter((p) => p.estado === estado);
  }

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

    let nuevoEstado: EstadoPedido;
    if (ESTADOS_ORDEN.includes(overedId as EstadoPedido)) {
      nuevoEstado = overedId as EstadoPedido;
    } else {
      const overPedido = pedidos.find((p) => p.id === overedId);
      if (!overPedido) return;
      nuevoEstado = overPedido.estado;
    }

    const pedido = pedidos.find((p) => p.id === pedidoId);
    if (!pedido || pedido.estado === nuevoEstado) return;

    setPedidos((prev) =>
      prev.map((p) =>
        p.id === pedidoId
          ? { ...p, estado: nuevoEstado, fecha_actualizacion: new Date().toISOString() }
          : p,
      ),
    );

    const { error } = await supabase
      .from('pedidos')
      .update({ estado: nuevoEstado })
      .eq('id', pedidoId);

    if (error) {
      setPedidos((prev) => prev.map((p) => (p.id === pedidoId ? pedido : p)));
    }
  }

  const activePedido = pedidos.find((p) => p.id === activeId);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-10 w-48 rounded-xl bg-white/[0.03] ring-1 ring-white/[0.06] shimmer" />
        <div className="flex gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="w-64 h-96 rounded-2xl bg-white/[0.03] ring-1 ring-white/[0.06] shimmer" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rise rise-1">
        <div className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground mb-2">
          Flujo de trabajo · sincronizado en vivo
        </div>
        <h1 className="font-display text-4xl tracking-tight">Tablero</h1>
        <p className="text-sm text-muted-foreground mt-2 max-w-md">
          Arrastrá las tarjetas entre columnas para actualizar el estado. Los cambios se ven en tiempo real para todo el equipo.
        </p>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-4 -mx-4 sm:-mx-8 px-4 sm:px-8">
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          {ESTADOS_ORDEN.map((estado, i) => (
            <div key={estado} className={`rise rise-${(i % 6) + 1}`}>
              <KanbanColumn
                estado={estado}
                pedidos={getPedidosByEstado(estado)}
                isDragOver={getColumnIsDragOver(estado)}
              />
            </div>
          ))}
          <DragOverlay>
            {activePedido && <KanbanCard pedido={activePedido} overlay />}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
}
