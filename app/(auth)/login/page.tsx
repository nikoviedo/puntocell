'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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

    const { user, error: err } = await signIn(email, password);
    if (user) {
      router.push('/dashboard');
      router.refresh();
    } else {
      setError(err ?? 'Email o contraseña incorrectos');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2 rise rise-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] ring-1 ring-white/10 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_12px_2px] shadow-emerald-400/50" />
            servicio operativo
          </div>
          <h1 className="font-display text-5xl tracking-tight leading-none">
            <span className="aurora-text">puntocell</span>
          </h1>
          <p className="text-sm text-muted-foreground">
            Control de reparaciones · acceso al panel
          </p>
        </div>

        <div className="rise rise-2 rounded-3xl bg-white/[0.04] backdrop-blur-md ring-1 ring-white/10 shadow-glass p-6 sm:p-8 space-y-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs uppercase tracking-widest text-muted-foreground">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="usuario@dominio.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs uppercase tracking-widest text-muted-foreground">
                Contraseña
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && (
              <p className="text-xs text-rose-300 bg-rose-500/10 ring-1 ring-rose-400/30 rounded-lg px-3 py-2">
                {error}
              </p>
            )}
            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? 'Verificando…' : 'Entrar al panel →'}
            </Button>
          </form>
        </div>

        <div className="rise rise-3 rounded-2xl bg-white/[0.025] backdrop-blur-sm ring-1 ring-white/[0.06] p-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground/80 mb-2">
            Usuarios de prueba (después del seed)
          </p>
          <div className="space-y-1 text-xs font-mono text-muted-foreground">
            <p><span className="text-foreground/90">admin@localhost</span> · puntocell123 · <span className="text-violet-300">admin</span></p>
            <p><span className="text-foreground/90">tecnico@localhost</span> · puntocell123 · <span className="text-cyan-300">técnico</span></p>
            <p><span className="text-foreground/90">recepcion@localhost</span> · puntocell123 · <span className="text-emerald-300">recepción</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}
