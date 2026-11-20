/** 9500 → "$ 9.500,00" (pesos argentinos) */
export function formatearPrecio(valor: number): string {
  return valor.toLocaleString("es-AR", { style: "currency", currency: "ARS" });
}

/** "2026-11-19T12:43:35" → "19/11/2026 12:43" */
export function formatearFecha(iso: string): string {
  return new Date(iso).toLocaleString("es-AR", { dateStyle: "short", timeStyle: "short" });
}
