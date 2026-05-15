'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { Database } from '@/types/database.types';

type Pedido = Database['public']['Tables']['pedidos']['Row'];

export default function NuevoPedidoPage() {
  const router = useRouter();
  const supabase = createClient();
  const [form, setForm] = useState({
    cliente_nombre: '',
    cliente_telefono: '',
    equipo: '',
    problema: '',
    tiempo_estimado: '',
  });
  const [loading, setLoading] = useState(false);
  const [pedidoCreado, setPedidoCreado] = useState<Pedido | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data: { user } } = await supabase.auth.getUser();

    const { data, error: err } = await supabase
      .from('pedidos')
      .insert({
        cliente_nombre: form.cliente_nombre,
        cliente_telefono: form.cliente_telefono || null,
        equipo: form.equipo,
        problema: form.problema,
        tiempo_estimado: form.tiempo_estimado || null,
        creado_por: user?.id ?? null,
      })
      .select()
      .single();

    if (err) {
      setError(err.message);
    } else if (data) {
      setPedidoCreado(data);
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
    <div className="max-w-2xl">
      <div className="rise rise-1 mb-8">
        <div className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground mb-2">
          Alta de equipo
        </div>
        <h1 className="font-display text-4xl tracking-tight">Nuevo pedido</h1>
        <p className="text-sm text-muted-foreground mt-2 max-w-md">
          Registrá el equipo y generá automáticamente un código y QR para que el cliente consulte el estado.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rise rise-2 rounded-3xl bg-white/[0.04] backdrop-blur-2xl ring-1 ring-white/10 shadow-glass p-6 sm:p-8 space-y-5"
      >
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="cliente_nombre" className="text-xs uppercase tracking-widest text-muted-foreground">
              Nombre del cliente
            </Label>
            <Input
              id="cliente_nombre"
              name="cliente_nombre"
              placeholder="Juan Pérez"
              value={form.cliente_nombre}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="cliente_telefono" className="text-xs uppercase tracking-widest text-muted-foreground">
              Teléfono
            </Label>
            <Input
              id="cliente_telefono"
              name="cliente_telefono"
              placeholder="11 2233-4455"
              value={form.cliente_telefono}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="equipo" className="text-xs uppercase tracking-widest text-muted-foreground">
            Equipo
          </Label>
          <Input
            id="equipo"
            name="equipo"
            placeholder="iPhone 13, Samsung S22, etc."
            value={form.equipo}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="problema" className="text-xs uppercase tracking-widest text-muted-foreground">
            Diagnóstico inicial
          </Label>
          <Textarea
            id="problema"
            name="problema"
            placeholder="Describí el problema reportado por el cliente…"
            value={form.problema}
            onChange={handleChange}
            required
            rows={4}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="tiempo_estimado" className="text-xs uppercase tracking-widest text-muted-foreground">
            Tiempo estimado
          </Label>
          <Input
            id="tiempo_estimado"
            name="tiempo_estimado"
            placeholder="2 días · 1 semana…"
            value={form.tiempo_estimado}
            onChange={handleChange}
          />
        </div>

        {error && (
          <p className="text-xs text-rose-300 bg-rose-500/10 ring-1 ring-rose-400/30 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            className="sm:flex-none"
            onClick={() => router.push('/dashboard')}
          >
            Cancelar
          </Button>
          <Button type="submit" size="lg" disabled={loading} className="sm:flex-1">
            {loading ? 'Generando…' : 'Crear pedido →'}
          </Button>
        </div>
      </form>

      <Dialog
        open={!!pedidoCreado}
        onOpenChange={() => {
          setPedidoCreado(null);
          router.push('/dashboard');
          router.refresh();
        }}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_12px_2px] shadow-emerald-400/60" />
                Pedido creado
              </div>
            </DialogTitle>
          </DialogHeader>
          {pedidoCreado && (
            <div className="space-y-4">
              <div className="rounded-2xl bg-white/[0.04] ring-1 ring-white/10 p-4 text-sm space-y-1.5">
                <Row label="Código" value={`#${pedidoCreado.token_publico}`} mono />
                <Row label="Cliente" value={pedidoCreado.cliente_nombre} />
                <Row label="Equipo" value={pedidoCreado.equipo} />
              </div>

              <div className="flex flex-col items-center gap-3 py-2">
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  Compartir con el cliente
                </p>
                <div className="p-3 rounded-2xl bg-white">
                  <QRCodeSVG value={urlPublica} size={140} />
                </div>
                <p className="text-[11px] text-muted-foreground break-all text-center font-mono">
                  {urlPublica}
                </p>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={copiarURL}>
                  {copied ? '✓ Copiado' : 'Copiar URL'}
                </Button>
                <Button
                  className="flex-1"
                  onClick={() => {
                    setPedidoCreado(null);
                    router.push('/dashboard');
                    router.refresh();
                  }}
                >
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

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className={mono ? 'text-sm font-mono text-foreground' : 'text-sm text-foreground'}>
        {value}
      </span>
    </div>
  );
}
