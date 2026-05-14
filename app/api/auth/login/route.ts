import { NextResponse } from 'next/server';
import { MOCK_USUARIOS } from '@/lib/mocks';

export async function POST(request: Request) {
  const { email, password } = await request.json();
  const usuario = MOCK_USUARIOS.find((u) => u.email === email && u.password_hash === password);
  if (!usuario) return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
  const { password_hash, ...safe } = usuario;
  return NextResponse.json(safe);
}
