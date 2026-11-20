import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { activarUsuario, desactivarUsuario, listarUsuarios } from "../api/usuarios";

export const USUARIOS_KEY = ["usuarios"];

export function useUsuarios() {
  return useQuery({ queryKey: USUARIOS_KEY, queryFn: listarUsuarios });
}

export function useActivarUsuario() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: activarUsuario,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: USUARIOS_KEY }),
  });
}

export function useDesactivarUsuario() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: desactivarUsuario,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: USUARIOS_KEY }),
  });
}