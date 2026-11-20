import { QueryClient } from "@tanstack/react-query";

// Instancia única de TanStack Query (caché del estado del servidor)
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1, // un solo reintento: los errores se muestran rápido
      staleTime: 30_000, // 30 s sin volver a pedir los mismos datos
    },
  },
});