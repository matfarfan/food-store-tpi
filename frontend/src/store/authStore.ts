import { create } from "zustand";
import { persist } from "zustand/middleware";
import * as authApi from "../features/auth/api/auth";
import type { Usuario } from "../features/auth/types/auth";
import { registrarAlPerderSesion } from "../shared/api/axiosInstance";
import { queryClient } from "../shared/api/queryClient";

interface AuthState {
  usuario: Usuario | null;
  cargando: boolean; // true mientras checkSession confirma la sesión con /auth/me
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
  limpiar: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      usuario: null,
      cargando: true,

      login: async (username, password) => {
        await authApi.login({ username, password }); // el backend deja la cookie
        const usuario = await authApi.obtenerPerfil(); // datos del usuario de la sesión
        set({ usuario });
      },

      logout: async () => {
        try {
          await authApi.logout(); // el backend borra la cookie
        } finally {
          set({ usuario: null });
          queryClient.clear(); // que no queden en caché los datos del usuario anterior
        }
      },

      checkSession: async () => {
        set({ cargando: true });
        try {
          const usuario = await authApi.obtenerPerfil();
          set({ usuario });
        } catch {
          set({ usuario: null }); // sin cookie, vencida o cuenta desactivada
        } finally {
          set({ cargando: false });
        }
      },

      limpiar: () => set({ usuario: null }),
    }),
    {
      name: "foodstore-auth",
      // Solo se guarda el usuario en localStorage; nunca el token (vive en la cookie HttpOnly)
      partialize: (state) => ({ usuario: state.usuario }),
    },
  ),
);

// El interceptor de Axios llama a esto ante un 401 o una cuenta desactivada
registrarAlPerderSesion(() => useAuthStore.getState().limpiar());
