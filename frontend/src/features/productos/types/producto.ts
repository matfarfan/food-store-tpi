import type { Categoria } from "../../categorias/types/categoria";

// Mismos campos que ProductoRead y ProductosPaginados del backend

export interface Producto {
  id: number;
  nombre: string;
  descripcion: string | null;
  precio_base: number;
  imagen_url: string | null;
  stock: number;
  disponible: boolean;
  activo: boolean;
  categoria_id: number;
  categoria: Categoria;
}

export interface ProductosPaginados {
  total: number;
  items: Producto[];
}

/** Query params de GET /productos */
export interface FiltrosProductos {
  skip: number;
  limit: number;
  search?: string;
  categoria_id?: number;
  disponible?: boolean;
}

/** Body de POST /productos (y de PUT, que acepta los mismos campos) */
export interface ProductoCreate {
  nombre: string;
  descripcion: string | null;
  precio_base: number;
  imagen_url: string | null;
  stock: number;
  disponible: boolean;
  categoria_id: number;
}

/** Body de PATCH /productos/{id}/stock */
export interface ProductoStockUpdate {
  stock: number;
  disponible: boolean;
}