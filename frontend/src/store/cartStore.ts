import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ItemCarrito {
  producto_id: number;
  nombre: string;
  precio_unitario: number;
  cantidad: number;
}

/** Lo mínimo de un producto que hace falta para agregarlo */
interface ProductoParaCarrito {
  id: number;
  nombre: string;
  precio_base: number;
}

interface CartState {
  items: ItemCarrito[];
  agregar: (producto: ProductoParaCarrito) => void;
  quitar: (productoId: number) => void;
  cambiarCantidad: (productoId: number, cantidad: number) => void;
  vaciar: () => void;
  total: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      // Si ya está en el carrito suma 1; si no, lo agrega con cantidad 1
      agregar: (producto) =>
        set((state) => {
          const existente = state.items.find((i) => i.producto_id === producto.id);
          if (existente) {
            return {
              items: state.items.map((i) =>
                i.producto_id === producto.id ? { ...i, cantidad: i.cantidad + 1 } : i,
              ),
            };
          }
          const nuevo: ItemCarrito = {
            producto_id: producto.id,
            nombre: producto.nombre,
            precio_unitario: producto.precio_base,
            cantidad: 1,
          };
          return { items: [...state.items, nuevo] };
        }),

      quitar: (productoId) =>
        set((state) => ({ items: state.items.filter((i) => i.producto_id !== productoId) })),

      cambiarCantidad: (productoId, cantidad) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.producto_id === productoId ? { ...i, cantidad: Math.max(1, cantidad) } : i,
          ),
        })),

      vaciar: () => set({ items: [] }),

      // Derivado: se calcula, no se guarda
      total: () => get().items.reduce((suma, i) => suma + i.precio_unitario * i.cantidad, 0),
    }),
    { name: "foodstore-carrito" }, // localStorage: el carrito sobrevive a la recarga
  ),
);
