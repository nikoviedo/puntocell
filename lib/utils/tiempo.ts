export function tiempoTranscurrido(fecha: string): string {
  const diff = Date.now() - new Date(fecha).getTime();
  const minutos = Math.floor(diff / 60000);
  const horas = Math.floor(minutos / 60);
  const dias = Math.floor(horas / 24);

  if (dias > 0) return `${dias}d`;
  if (horas > 0) return `${horas}h`;
  if (minutos > 0) return `${minutos}m`;
  return 'Ahora';
}

export function formatFecha(fecha: string): string {
  return new Date(fecha).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
