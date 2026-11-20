import { api } from "../../../shared/api/axiosInstance";
import type { Categoria, CategoriaCreate } from "../types/categoria";

export async function listarCategorias(): Promise<Categoria[]> {
  const { data } = await api.get<Categoria[]>("/categorias");
  return data;
}

export async function crearCategoria(datos: CategoriaCreate): Promise<Categoria> {
  const { data } = await api.post<Categoria>("/categorias", datos);
  return data;
}

// Un solo argumento (como en U7): mutate recibe un solo valor
export async function actualizarCategoria(categoria: Categoria): Promise<Categoria> {
  const { id, nombre, descripcion } = categoria;
  const { data } = await api.put<Categoria>(`/categorias/${id}`, { nombre, descripcion });
  return data;
}

export async function eliminarCategoria(id: number): Promise<void> {
  await api.delete(`/categorias/${id}`); // 204: sin cuerpo
}