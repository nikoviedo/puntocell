import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-sm rise rise-1">
        <div className="font-display text-8xl tnum aurora-text leading-none">404</div>
        <h1 className="mt-4 text-lg font-medium">Pedido no encontrado</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          El código de reparación no existe o es inválido.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition"
        >
          ← Volver al inicio
        </Link>
      </div>
    </div>
  );
}
