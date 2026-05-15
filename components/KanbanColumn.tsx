'use client';

import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { Pedido, EstadoPedido } from '@/types';
import { ESTADO_DOT, ESTADO_HEADER_COLORES, ESTADO_LABELS } from '@/lib/utils/estados';
import { KanbanCard } from './KanbanCard';

interface Props {
  estado: EstadoPedido;
  pedidos: Pedido[];
  isDragOver?: boolean;
}

export function KanbanColumn({ estado, pedidos, isDragOver }: Props) {
  const { setNodeRef } = useDroppable({ id: estado });

  return (
    <div className="flex-shrink-0 w-64">
      <div className={`relative overflow-hidden rounded-t-2xl px-4 py-3 bg-gradient-to-br ${ESTADO_HEADER_COLORES[estado]} ring-1 ring-white/10 border-b border-white/[0.06]`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`w-1.5 h-1.5 rounded-full ${ESTADO_DOT[estado]}`} />
            <span className="text-xs uppercase tracking-[0.18em] text-foreground/90 font-medium">
              {ESTADO_LABELS[estado]}
            </span>
          </div>
          <span className="text-[11px] font-mono tabular-nums bg-white/10 rounded-full px-2 py-0.5 text-foreground/80 ring-1 ring-white/10">
            {pedidos.length.toString().padStart(2, '0')}
          </span>
        </div>
      </div>
      <div
        ref={setNodeRef}
        className={`min-h-32 rounded-b-2xl p-2 space-y-2 transition-all ${
          isDragOver
            ? 'bg-primary/[0.06] ring-2 ring-dashed ring-primary/40'
            : 'bg-white/[0.025] ring-1 ring-white/[0.06]'
        }`}
      >
        <SortableContext items={pedidos.map((p) => p.id)} strategy={verticalListSortingStrategy}>
          {pedidos.map((pedido) => (
            <KanbanCard key={pedido.id} pedido={pedido} />
          ))}
        </SortableContext>
        {pedidos.length === 0 && (
          <p className="text-xs text-muted-foreground/60 text-center py-6 italic">
            sin pedidos
          </p>
        )}
      </div>
    </div>
  );
}
