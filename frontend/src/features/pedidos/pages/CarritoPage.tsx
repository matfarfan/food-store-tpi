import { Link, useNavigate } from "react-router-dom";
import EstadoVacio from "../../../shared/components/EstadoVacio";
import Button from "../../../shared/ui/Button";
import Card from "../../../shared/ui/Card";
import { formatearPrecio } from "../../../shared/utils/formato";
import { useCartStore } from "../../../store/cartStore";

function CarritoPage() {
  const items = useCartStore((s) => s.items);
  const cambiarCantidad = useCartStore((s) => s.cambiarCantidad);
  const quitar = useCartStore((s) => s.quitar);
  const vaciar = useCartStore((s) => s.vaciar);
  const total = useCartStore((s) => s.total());
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <section className="space-y-4">
        <h1 className="text-2xl font-bold text-slate-800">Carrito</h1>
        <EstadoVacio mensaje="Tu carrito está vacío." />
        <Link to="/" className="inline-block text-blue-600 hover:underline">
          Ir al catálogo
        </Link>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold text-slate-800">Carrito</h1>

      <Card className="divide-y divide-slate-200 p-0">
        {items.map((item) => (
          <div key={item.producto_id} className="flex flex-wrap items-center gap-4 p-4">
            <div className="min-w-40 flex-1">
              <p className="font-medium text-slate-800">{item.nombre}</p>
              <p className="text-sm text-slate-500">{formatearPrecio(item.precio_unitario)} c/u</p>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                aria-label={`Quitar una unidad de ${item.nombre}`}
                onClick={() => cambiarCantidad(item.producto_id, item.cantidad - 1)}
                disabled={item.cantidad <= 1}
                className="h-8 w-8 rounded-md border border-slate-300 hover:bg-slate-100 disabled:opacity-40"
              >
                −
              </button>
              <span className="w-8 text-center font-medium" aria-label="Cantidad">
                {item.cantidad}
              </span>
              <button
                type="button"
                aria-label={`Agregar una unidad de ${item.nombre}`}
                onClick={() => cambiarCantidad(item.producto_id, item.cantidad + 1)}
                className="h-8 w-8 rounded-md border border-slate-300 hover:bg-slate-100"
              >
                +
              </button>
            </div>

            <p className="w-32 text-right font-semibold text-slate-800">
              {formatearPrecio(item.precio_unitario * item.cantidad)}
            </p>
            <button
              type="button"
              onClick={() => quitar(item.producto_id)}
              className="text-sm text-red-600 hover:underline"
            >
              Quitar
            </button>
          </div>
        ))}
      </Card>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <Button variante="secundario" onClick={vaciar}>
          Vaciar carrito
        </Button>
        <div className="flex items-center gap-4">
          <p className="text-xl">
            Total: <span className="font-bold">{formatearPrecio(total)}</span>
          </p>
          <Button onClick={() => navigate("/checkout")}>Confirmar pedido</Button>
        </div>
      </div>
      <p className="text-sm text-slate-500">
        El stock se verifica al confirmar el pedido. Para confirmar necesitás iniciar sesión.
      </p>
    </section>
  );
}

export default CarritoPage;
