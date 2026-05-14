export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-300">404</h1>
        <p className="text-gray-500 mt-2">Pedido no encontrado</p>
        <p className="text-sm text-gray-400 mt-1">El código de reparación no existe o es inválido</p>
      </div>
    </div>
  );
}
