import { NextResponse } from 'next/server';
import { pedidos } from '@/lib/mocks';

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const pedido = pedidos.find((p) => p.id === params.id);
  if (!pedido) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
  return NextResponse.json(pedido);
}
