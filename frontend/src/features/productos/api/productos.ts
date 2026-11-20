import { api } from "../../../shared/api/axiosInstance";
import type {
  FiltrosProductos,
  Producto,
  ProductoCreate,
  ProductosPaginados,
  ProductoStockUpdate,
} from "../types/producto";

export async function listarProductos(filtros: FiltrosProductos): Promise<ProductosPaginados> {
  // Axios arma la query string: ?skip=0&limit=8&search=...; omite los undefined
  const { data } = await api.get<ProductosPaginados>("/productos", { params: filtros });
  return data;
}

export async function crearProducto(datos: ProductoCreate): Promise<Producto> {
  const { data } = await api.post<Producto>("/productos", datos);
  return data;
}

// Un solo argumento (mutate recibe un solo valor): el id va en la URL y el resto en el body
export async function actualizarProducto({
  id,
  ...datos
}: ProductoCreate & { id: number }): Promise<Producto> {
  const { data } = await api.put<Producto>(`/productos/${id}`, datos);
  return data;
}

export async function actualizarStock({
  id,
  ...datos
}: ProductoStockUpdate & { id: number }): Promise<Producto> {
  const { data } = await api.patch<Producto>(`/productos/${id}/stock`, datos);
  return data;
}

export async function eliminarProducto(id: number): Promise<void> {
  await api.delete(`/productos/${id}`); // 204: sin cuerpo
}