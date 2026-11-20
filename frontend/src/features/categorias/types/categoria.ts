// Mismos campos que CategoriaRead / CategoriaCreate del backend

export interface Categoria {
  id: number;
  nombre: string;
  descripcion: string | null;
  activo: boolean;
}

export interface CategoriaCreate {
  nombre: string;
  descripcion: string | null;
}
