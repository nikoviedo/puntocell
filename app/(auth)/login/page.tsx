'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login, saveSession } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const usuario = login(email, password);
    if (usuario) {
      saveSession(usuario);
      router.push('/dashboard');
    } else {
      setError('Email o contraseña incorrectos');
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-4 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">🔧 Mi Reparaciones</h1>
          <p className="text-gray-500 text-sm mt-1">Sistema de gestión de reparaciones</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Iniciar sesión</CardTitle>
            <CardDescription>Ingresá con tu cuenta del sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="usuario@localhost"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Ingresando...' : 'Entrar'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Usuarios de prueba */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-4">
            <p className="text-xs font-semibold text-blue-700 mb-2">Usuarios de prueba:</p>
            <div className="space-y-1 text-xs text-blue-600 font-mono">
              <p>admin@localhost / 123456 (Admin)</p>
              <p>tecnico@localhost / 123456 (Técnico)</p>
              <p>recepcion@localhost / 123456 (Recepción)</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
