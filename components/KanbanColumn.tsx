'use client';

import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { Pedido, EstadoPedido } from '@/types';
import { ESTADO_LABELS, ESTADO_HEADER_COLORES } from '@/lib/utils/estados';
import { KanbanCard } from './KanbanCard';

interface Props {
  estado: EstadoPedido;
  pedidos: Pedido[];
  isDragOver?: boolean;
}

export function KanbanColumn({ estado, pedidos, isDragOver }: Props) {
  const { setNodeRef } = useDroppable({ id: estado });

  return (
    <div className="flex-shrink-0 w-60">
      <div className={`rounded-t-lg px-3 py-2 ${ESTADO_HEADER_COLORES[estado]}`}>
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-700">{ESTADO_LABELS[estado]}</span>
          <span className="text-xs bg-white bg-opacity-60 rounded-full px-2 py-0.5 text-gray-600">
            {pedidos.length}
          </span>
        </div>
      </div>
      <div
        ref={setNodeRef}
        className={`min-h-32 rounded-b-lg p-2 space-y-2 transition-colors ${
          isDragOver ? 'bg-blue-50 border-2 border-dashed border-blue-300' : 'bg-gray-100'
        }`}
      >
        <SortableContext items={pedidos.map((p) => p.id)} strategy={verticalListSortingStrategy}>
          {pedidos.map((pedido) => (
            <KanbanCard key={pedido.id} pedido={pedido} />
          ))}
        </SortableContext>
        {pedidos.length === 0 && (
          <p className="text-xs text-gray-400 text-center py-4">Sin pedidos</p>
        )}
      </div>
    </div>
  );
}
