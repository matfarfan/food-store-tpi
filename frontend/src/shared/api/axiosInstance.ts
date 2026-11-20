import axios from "axios";

// Instancia única de Axios: todas las llamadas a la API pasan por acá.
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // el navegador adjunta la cookie HttpOnly access_token
});

let alPerderSesion: (() => void) | null = null;

export function registrarAlPerderSesion(callback: () => void): void {
  alPerderSesion = callback;
}

const CUENTA_DESACTIVADA = "Cuenta de usuario desactivada";

api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error) && error.response) {
      const url = error.config?.url ?? "";
      const status = error.response.status;
      const data = error.response.data as { detail?: unknown } | undefined;

      // En el login y en /auth/me un 401 es normal (credenciales malas o sin sesión):
      // lo maneja cada pantalla, no el interceptor.
      const esLoginOMe = url.includes("/auth/token") || url.includes("/auth/me");
      const sesionVencida = status === 401 && !esLoginOMe;
      const cuentaDesactivada = status === 400 && data?.detail === CUENTA_DESACTIVADA;

      if (sesionVencida || cuentaDesactivada) {
        alPerderSesion?.(); // limpia el authStore; ProtectedRoute lleva a /login
      }
    }
    return Promise.reject(error);
  },
);
