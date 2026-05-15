'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { signOut } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import type { SessionUser } from '@/lib/auth';

interface Props {
  profile: SessionUser;
  children: React.ReactNode;
}

export default function AppShell({ profile, children }: Props) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await signOut();
    router.push('/login');
    router.refresh();
  }

  const navLinks = [
    { href: '/dashboard', label: 'Resumen', sub: 'panel general' },
    { href: '/dashboard/nuevo-pedido', label: 'Nuevo pedido', sub: 'alta + QR' },
    { href: '/dashboard/kanban', label: 'Tablero', sub: 'flujo de estados' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 bg-background/90 ring-1 ring-white/[0.06]">
        <div className="flex items-center justify-between px-4 sm:px-6 py-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl btn-aurora grid place-items-center text-white text-sm font-bold">
              p
            </div>
            <div className="leading-tight">
              <div className="font-display text-lg tracking-tight">puntocell</div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">control de reparaciones</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] ring-1 ring-white/10">
              <span className="w-6 h-6 rounded-full grid place-items-center bg-gradient-to-br from-violet-400 to-cyan-400 text-[10px] font-bold text-background">
                {profile.nombre.charAt(0).toUpperCase()}
              </span>
              <span className="text-sm text-foreground/90">{profile.nombre}</span>
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{profile.rol}</span>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Salir
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        <nav className="w-60 shrink-0 p-4 space-y-1 hidden sm:block">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-4 py-3 rounded-2xl transition-all group ${
                  active
                    ? 'bg-white/[0.06] ring-1 ring-white/15 shadow-glass'
                    : 'hover:bg-white/[0.03] ring-1 ring-transparent hover:ring-white/[0.06]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className={`text-sm font-medium ${active ? 'text-foreground' : 'text-foreground/80'}`}>
                    {link.label}
                  </div>
                  {active && <span className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_10px_2px] shadow-primary/60" />}
                </div>
                <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground mt-0.5">
                  {link.sub}
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="sm:hidden fixed bottom-3 left-3 right-3 z-50 rounded-2xl bg-background/70 backdrop-blur-md ring-1 ring-white/10 shadow-glass flex">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex-1 text-center py-3 text-[11px] font-medium uppercase tracking-wider rounded-2xl transition ${
                  active ? 'text-foreground bg-white/[0.06]' : 'text-muted-foreground'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <main className="flex-1 p-4 sm:p-8 pb-24 sm:pb-8 max-w-7xl mx-auto w-full">{children}</main>
      </div>
    </div>
  );
}
