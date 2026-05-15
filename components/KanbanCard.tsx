'use client';

import { useEffect, useRef, useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Pedido } from '@/types';
import { tiempoTranscurrido } from '@/lib/utils/tiempo';
import { ESTADO_DOT, ESTADO_LABELS } from '@/lib/utils/estados';
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
        className={`group relative rounded-xl bg-white/[0.05] backdrop-blur-sm ring-1 ring-white/10 hover:ring-white/20 hover:bg-white/[0.07] p-3 cursor-pointer select-none transition-all ${
          isDragging ? 'opacity-40' : ''
        } ${overlay ? 'shadow-glass ring-white/20 rotate-1 scale-105' : ''}`}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-mono text-muted-foreground/80">
            #{pedido.token_publico}
          </span>
          <span className={`w-1.5 h-1.5 rounded-full ${ESTADO_DOT[pedido.estado]} opacity-80`} />
        </div>
        <div className="text-sm font-medium text-foreground truncate">{pedido.cliente_nombre}</div>
        <div className="text-xs text-muted-foreground truncate mt-0.5">{pedido.equipo}</div>
        <div className="text-[11px] text-muted-foreground/70 line-clamp-2 mt-2">{pedido.problema}</div>
        <div className="text-[10px] text-muted-foreground/60 mt-2 uppercase tracking-wider">
          · {tiempoTranscurrido(pedido.fecha_actualizacion)}
        </div>
      </div>

      {!overlay && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${ESTADO_DOT[pedido.estado]} shadow-[0_0_10px_2px] shadow-current/60`} />
                  <span className="font-mono text-base">#{pedido.token_publico}</span>
                </div>
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 text-sm">
              <Field label="Cliente" value={pedido.cliente_nombre} sub={pedido.cliente_telefono ?? undefined} />
              <Field label="Equipo" value={pedido.equipo} />
              <Field label="Problema" value={pedido.problema} multiline />
              <div className="grid grid-cols-2 gap-3">
                <Field label="Estado" value={ESTADO_LABELS[pedido.estado]} />
                <Field label="Tiempo estimado" value={pedido.tiempo_estimado || '—'} />
                <Field label="Ingreso" value={new Date(pedido.fecha_ingreso).toLocaleDateString('es-AR')} />
                <Field label="Actualizado" value={tiempoTranscurrido(pedido.fecha_actualizacion)} />
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

function Field({
  label,
  value,
  sub,
  multiline,
}: {
  label: string;
  value: string;
  sub?: string;
  multiline?: boolean;
}) {
  return (
    <div>
      <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-[0.2em] mb-1">
        {label}
      </p>
      <p className={multiline ? 'whitespace-pre-wrap text-foreground/90' : 'text-foreground/90'}>
        {value}
      </p>
      {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
    </div>
  );
}
