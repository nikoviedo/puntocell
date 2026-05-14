'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser, logout } from '@/lib/auth';
import type { Usuario } from '@/types';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const u = getCurrentUser();
    if (!u) {
      router.push('/login');
    } else {
      setUsuario(u);
    }
  }, [router]);

  function handleLogout() {
    logout();
    router.push('/login');
  }

  if (!mounted || !usuario) return null;

  const navLinks = [
    { href: '/dashboard', label: '📊 Dashboard' },
    { href: '/dashboard/nuevo-pedido', label: '➕ Nuevo Pedido' },
    { href: '/dashboard/kanban', label: '📋 Kanban' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-bold text-gray-900">🔧 Mi Reparaciones</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Avatar className="w-7 h-7">
              <AvatarFallback className="text-xs bg-blue-100 text-blue-700">
                {usuario.nombre.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-gray-700 hidden sm:block">{usuario.nombre}</span>
            <span className="text-xs text-gray-400 hidden sm:block">({usuario.rol})</span>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            Salir
          </Button>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <nav className="w-48 bg-white border-r border-gray-200 p-4 space-y-1 hidden sm:block">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                pathname === link.href
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile nav */}
        <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex z-50">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex-1 text-center py-3 text-xs font-medium ${
                pathname === link.href ? 'text-blue-700 bg-blue-50' : 'text-gray-600'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Main content */}
        <main className="flex-1 p-4 sm:p-6 pb-20 sm:pb-6">{children}</main>
      </div>
    </div>
  );
}
