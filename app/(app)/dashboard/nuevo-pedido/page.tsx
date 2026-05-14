'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';
import { getCurrentUser } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { Pedido } from '@/types';

export default function NuevoPedidoPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    cliente_nombre: '',
    cliente_telefono: '',
    equipo: '',
    problema: '',
    tiempo_estimado: '',
  });
  const [loading, setLoading] = useState(false);
  const [pedidoCreado, setPedidoCreado] = useState<Pedido | null>(null);
  const [copied, setCopied] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const usuario = getCurrentUser();
    const res = await fetch('/api/pedidos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, usuario_id: usuario?.id || '1' }),
    });

    if (res.ok) {
      const pedido = await res.json();
      setPedidoCreado(pedido);
    }
    setLoading(false);
  }

  const urlPublica = pedidoCreado
    ? `${window.location.origin}/r/${pedidoCreado.token_publico}`
    : '';

  function copiarURL() {
    navigator.clipboard.writeText(urlPublica);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="max-w-lg">
      <h1 className="text-xl font-bold text-gray-900 mb-6">Nuevo Pedido</h1>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="cliente_nombre">Nombre del cliente *</Label>
              <Input
                id="cliente_nombre"
                name="cliente_nombre"
                placeholder="Juan Pérez"
                value={form.cliente_nombre}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="cliente_telefono">Teléfono</Label>
              <Input
                id="cliente_telefono"
                name="cliente_telefono"
                placeholder="1122334455"
                value={form.cliente_telefono}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="equipo">Equipo *</Label>
              <Input
                id="equipo"
                name="equipo"
                placeholder="iPhone 13, Samsung S22, etc."
                value={form.equipo}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="problema">Problema *</Label>
              <Textarea
                id="problema"
                name="problema"
                placeholder="Describir el problema del equipo..."
                value={form.problema}
                onChange={handleChange}
                required
                rows={3}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="tiempo_estimado">Tiempo estimado</Label>
              <Input
                id="tiempo_estimado"
                name="tiempo_estimado"
                placeholder="2 días, 1 semana..."
                value={form.tiempo_estimado}
                onChange={handleChange}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Guardando...' : 'Crear pedido'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Modal de confirmación */}
      <Dialog open={!!pedidoCreado} onOpenChange={() => { setPedidoCreado(null); router.push('/dashboard'); }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>✅ Pedido creado</DialogTitle>
          </DialogHeader>
          {pedidoCreado && (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-3 text-sm space-y-1">
                <div><span className="font-medium">Código:</span> {pedidoCreado.token_publico}</div>
                <div><span className="font-medium">Cliente:</span> {pedidoCreado.cliente_nombre}</div>
                <div><span className="font-medium">Equipo:</span> {pedidoCreado.equipo}</div>
              </div>

              <div className="flex flex-col items-center gap-2">
                <p className="text-xs text-gray-500">URL pública para el cliente:</p>
                <QRCodeSVG value={urlPublica} size={150} />
                <p className="text-xs text-gray-600 break-all text-center">{urlPublica}</p>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={copiarURL}>
                  {copied ? '✓ Copiado' : 'Copiar URL'}
                </Button>
                <Button className="flex-1" onClick={() => { setPedidoCreado(null); router.push('/dashboard'); }}>
                  Cerrar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
