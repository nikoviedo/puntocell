import { NextResponse } from 'next/server';
import { pedidos, cambiosEstado } from '@/lib/mocks';

export async function GET(_req: Request, { params }: { params: { token: string } }) {
  const pedido = pedidos.find((p) => p.token_publico === params.token);
  if (!pedido) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });

  const cambios = cambiosEstado
    .filter((c) => c.pedido_id === pedido.id)
    .sort((a, b) => new Date(b.fecha_cambio).getTime() - new Date(a.fecha_cambio).getTime());

  return NextResponse.json({ pedido, cambios });
}
