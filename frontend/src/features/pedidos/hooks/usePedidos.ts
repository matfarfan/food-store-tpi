import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  cambiarEstadoPedido,
  cancelarPedido,
  crearPedido,
  listarPedidos,
  obtenerResumen,
} from "../api/pedidos";
import type { EstadoPedido, FiltrosPedidos } from "../types/pedido";

// Todas las claves de pedidos empiezan con "pedidos": invalidar ["pedidos"]
// refresca a la vez los listados y el resumen
export const PEDIDOS_KEY = ["pedidos"];
const RESUMEN_KEY = ["pedidos", "resumen"];
const PRODUCTOS_KEY = ["productos"]; // crear o cancelar cambia el stock

export function usePedidos(filtros: FiltrosPedidos) {
  return useQuery({
    queryKey: ["pedidos", filtros],
    queryFn: () => listarPedidos(filtros),
    placeholderData: keepPreviousData,
  });
}

export function useResumenPedidos() {
  return useQuery({ queryKey: RESUMEN_KEY, queryFn: obtenerResumen });
}

/** Invalida pedidos (listados + resumen) y productos (stock) */
function useInvalidarPedidosYStock() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: PEDIDOS_KEY });
    queryClient.invalidateQueries({ queryKey: PRODUCTOS_KEY });
  };
}

export function useCrearPedido() {
  const invalidar = useInvalidarPedidosYStock();
  return useMutation({ mutationFn: crearPedido, onSuccess: invalidar });
}

export function useCancelarPedido() {
  const invalidar = useInvalidarPedidosYStock();
  return useMutation({ mutationFn: cancelarPedido, onSuccess: invalidar });
}

export function useCambiarEstadoPedido() {
  const invalidar = useInvalidarPedidosYStock();
  return useMutation({
    // mutate recibe un solo argumento: por eso id y estado van en un objeto
    mutationFn: ({ id, estado }: { id: number; estado: EstadoPedido }) =>
      cambiarEstadoPedido(id, estado),
    onSuccess: invalidar,
  });
}
