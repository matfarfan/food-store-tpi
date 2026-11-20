import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  actualizarCategoria,
  crearCategoria,
  eliminarCategoria,
  listarCategorias,
} from "../api/categorias";

export const CATEGORIAS_KEY = ["categorias"];
const PRODUCTOS_KEY = ["productos"];

/** Categorías activas (filtro del catálogo y panel admin). */
export function useCategorias() {
  return useQuery({ queryKey: CATEGORIAS_KEY, queryFn: listarCategorias });
}

/** Después de crear, editar o dar de baja: refresca categorías y también productos,
 *  porque cada producto muestra el nombre de su categoría. */
function useInvalidarCategorias() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: CATEGORIAS_KEY });
    queryClient.invalidateQueries({ queryKey: PRODUCTOS_KEY });
  };
}

export function useCrearCategoria() {
  const invalidar = useInvalidarCategorias();
  return useMutation({ mutationFn: crearCategoria, onSuccess: invalidar });
}

export function useActualizarCategoria() {
  const invalidar = useInvalidarCategorias();
  return useMutation({ mutationFn: actualizarCategoria, onSuccess: invalidar });
}

export function useEliminarCategoria() {
  const invalidar = useInvalidarCategorias();
  return useMutation({ mutationFn: eliminarCategoria, onSuccess: invalidar });
}