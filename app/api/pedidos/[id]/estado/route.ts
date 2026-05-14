import { NextResponse } from 'next/server';
import { pedidos, agregarCambioEstado } from '@/lib/mocks';
import type { EstadoPedido } from '@/types';

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json();
  const pedido = pedidos.find((p) => p.id === params.id);

  if (!pedido) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });

  const estadoAnterior = pedido.estado;
  pedido.estado = body.estado as EstadoPedido;
  pedido.fecha_actualizacion = new Date().toISOString();

  agregarCambioEstado(
    pedido.id,
    estadoAnterior,
    pedido.estado,
    body.usuario_id || '1',
    body.usuario_nombre || 'Sistema'
  );

  return NextResponse.json(pedido);
}
