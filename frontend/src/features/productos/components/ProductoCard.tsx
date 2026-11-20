import { useState } from "react";
import Button from "../../../shared/ui/Button";
import { formatearPrecio } from "../../../shared/utils/formato";
import { useCartStore } from "../../../store/cartStore";
import type { Producto } from "../types/producto";

interface ProductoCardProps {
  producto: Producto;
}

function ProductoCard({ producto }: ProductoCardProps) {
  const agregar = useCartStore((s) => s.agregar);
  const [imagenRota, setImagenRota] = useState(false); // la URL no cargó
  // Cuántas unidades de este producto ya hay en el carrito
  const enCarrito = useCartStore(
    (s) => s.items.find((i) => i.producto_id === producto.id)?.cantidad ?? 0,
  );

  // RN-01 en la interfaz: solo se vende si está disponible y queda stock
  // (el backend lo vuelve a validar al confirmar el pedido)
  const sinStock = producto.stock - enCarrito <= 0;
  const puedeAgregar = producto.disponible && !sinStock;

  let textoBoton = "Agregar al carrito";
  if (!producto.disponible) textoBoton = "No disponible";
  else if (sinStock) textoBoton = "Sin stock";

  return (
    <article className="flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      {producto.imagen_url && !imagenRota ? (
        <img
          src={producto.imagen_url}
          alt={producto.nombre}
          onError={() => setImagenRota(true)}
          className="h-40 w-full bg-slate-100 object-cover"
        />
      ) : (
        <div className="flex h-40 items-center justify-center bg-slate-100 text-sm text-slate-400">
          Sin imagen
        </div>
      )}

      <div className="flex flex-1 flex-col gap-1 p-4">
        <span className="text-xs font-medium uppercase text-blue-600">
          {producto.categoria.nombre}
        </span>
        <h3 className="font-semibold text-slate-800">{producto.nombre}</h3>
        {producto.descripcion && (
          <p className="text-sm text-slate-500">{producto.descripcion}</p>
        )}
        <div className="mt-auto flex items-end justify-between pt-3">
          <span className="text-lg font-bold text-slate-900">
            {formatearPrecio(producto.precio_base)}
          </span>
          <span className="text-xs text-slate-500">Stock: {producto.stock}</span>
        </div>
        {enCarrito > 0 && (
          <span className="text-xs text-green-700">En el carrito: {enCarrito}</span>
        )}
        <Button className="mt-2" disabled={!puedeAgregar} onClick={() => agregar(producto)}>
          {textoBoton}
        </Button>
      </div>
    </article>
  );
}

export default ProductoCard;
