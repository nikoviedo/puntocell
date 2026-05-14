import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { pedidos, generarToken } from '@/lib/mocks';
import type { Pedido } from '@/types';

export async function GET() {
  return NextResponse.json(pedidos);
}

export async function POST(request: Request) {
  const body = await request.json();
  const nuevo: Pedido = {
    id: uuidv4(),
    token_publico: generarToken(),
    cliente_nombre: body.cliente_nombre,
    cliente_telefono: body.cliente_telefono || '',
    equipo: body.equipo,
    problema: body.problema,
    tiempo_estimado: body.tiempo_estimado || '',
    estado: 'Recibido',
    fecha_ingreso: new Date().toISOString(),
    fecha_actualizacion: new Date().toISOString(),
    usuario_id: body.usuario_id || '1',
  };
  pedidos.push(nuevo);
  return NextResponse.json(nuevo, { status: 201 });
}
