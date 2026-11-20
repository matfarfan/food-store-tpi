import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  actualizarProducto,
  actualizarStock,
  crearProducto,
  eliminarProducto,
  listarProductos,
} from "../api/productos";
import type { FiltrosProductos } from "../types/producto";

export const PRODUCTOS_KEY = ["productos"];

/** Productos paginados en el servidor. La queryKey incluye los filtros:
 *  cada combinación (página, búsqueda, categoría) se cachea por separado. */
export function useProductos(filtros: FiltrosProductos) {
  return useQuery({
    queryKey: ["productos", filtros],
    queryFn: () => listarProductos(filtros),
    placeholderData: keepPreviousData, // al cambiar de página no "parpadea" la grilla
  });
}

/** Invalidar ["productos"] refresca TODAS las páginas y filtros guardados
 *  (catálogo y panel), porque todas sus claves empiezan con "productos". */
function useInvalidarProductos() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: PRODUCTOS_KEY });
}

export function useCrearProducto() {
  const invalidar = useInvalidarProductos();
  return useMutation({ mutationFn: crearProducto, onSuccess: invalidar });
}

export function useActualizarProducto() {
  const invalidar = useInvalidarProductos();
  return useMutation({ mutationFn: actualizarProducto, onSuccess: invalidar });
}

export function useActualizarStock() {
  const invalidar = useInvalidarProductos();
  return useMutation({ mutationFn: actualizarStock, onSuccess: invalidar });
}

export function useEliminarProducto() {
  const invalidar = useInvalidarProductos();
  return useMutation({ mutationFn: eliminarProducto, onSuccess: invalidar });
}