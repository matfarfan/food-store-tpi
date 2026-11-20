import axios from "axios";

interface ErrorValidacion {
  loc: (string | number)[];
  msg: string;
}

/** Convierte un error de la API en un mensaje para mostrar en pantalla. */
export function handleApiError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return "No se pudo conectar con el servidor. ¿Está corriendo el backend?";
    }
    const detail: unknown = (error.response.data as { detail?: unknown } | undefined)?.detail;

    // 400, 401, 403, 404 y 409: detail es un texto
    if (typeof detail === "string") return detail;

    // 422: detail es una lista de errores de validación de Pydantic
    if (Array.isArray(detail) && detail.length > 0) {
      const primero = detail[0] as ErrorValidacion;
      const campo = primero.loc[primero.loc.length - 1];
      return `Dato inválido en "${campo}": ${primero.msg}`;
    }
    return `Error ${error.response.status}`;
  }
  return error instanceof Error ? error.message : "Error inesperado";
}
