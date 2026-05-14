'use client';

import { useEffect, useRef, useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Pedido } from '@/types';
import { tiempoTranscurrido } from '@/lib/utils/tiempo';
import { ESTADO_LABELS } from '@/lib/utils/estados';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface Props {
  pedido: Pedido;
  overlay?: boolean;
}

export function KanbanCard({ pedido, overlay }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: pedido.id,
  });
  const [open, setOpen] = useState(false);
  const wasDragging = useRef(false);

  useEffect(() => {
    if (isDragging) wasDragging.current = true;
  }, [isDragging]);

  function handleClick() {
    if (overlay) return;
    if (wasDragging.current) {
      wasDragging.current = false;
      return;
    }
    setOpen(true);
  }

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={overlay ? undefined : style}
        {...attributes}
        {...listeners}
        onClick={handleClick}
        className={`bg-white rounded-md p-3 shadow-sm border border-gray-200 cursor-pointer select-none ${
          isDragging ? 'opacity-50' : ''
        } ${overlay ? 'shadow-lg rotate-1' : ''}`}
      >
        <div className="text-xs font-mono text-gray-400 mb-1">#{pedido.token_publico}</div>
        <div className="text-sm font-medium text-gray-900 truncate">{pedido.cliente_nombre}</div>
        <div className="text-xs text-gray-500 truncate">{pedido.equipo}</div>
        <div className="text-xs text-gray-400 line-clamp-2 mt-1">{pedido.problema}</div>
        <div className="text-xs text-gray-400 mt-2">
          Actualizado {tiempoTranscurrido(pedido.fecha_actualizacion)}
        </div>
      </div>

      {!overlay && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Pedido #{pedido.token_publico}</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-0.5">Cliente</p>
                <p className="font-medium">{pedido.cliente_nombre}</p>
                <p className="text-gray-500">{pedido.cliente_telefono}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-0.5">Equipo</p>
                <p>{pedido.equipo}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-0.5">Problema</p>
                <p className="whitespace-pre-wrap text-gray-800">{pedido.problema}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-0.5">Estado</p>
                  <p>{ESTADO_LABELS[pedido.estado]}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-0.5">Tiempo estimado</p>
                  <p>{pedido.tiempo_estimado || '—'}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-0.5">Fecha de ingreso</p>
                  <p>{new Date(pedido.fecha_ingreso).toLocaleDateString('es-AR')}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-0.5">Última actualización</p>
                  <p>{tiempoTranscurrido(pedido.fecha_actualizacion)}</p>
                </div>
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <DialogClose asChild>
                <Button variant="outline" size="sm">Cerrar</Button>
              </DialogClose>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
