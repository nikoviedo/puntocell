import { NextResponse } from 'next/server';

// In this mock implementation, auth state is managed client-side via localStorage
export async function GET() {
  return NextResponse.json({ message: 'Check localStorage for current user' });
}
