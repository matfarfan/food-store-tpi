import { Link, useNavigate } from "react-router-dom";
import { handleApiError } from "../../../shared/api/handleApiError";
import EstadoVacio from "../../../shared/components/EstadoVacio";
import Card from "../../../shared/ui/Card";
import { formatearPrecio } from "../../../shared/utils/formato";
import { useCartStore } from "../../../store/cartStore";
import CheckoutForm from "../components/CheckoutForm";
import { useCrearPedido } from "../hooks/usePedidos";
import type { DatosCheckout } from "../types/pedido";

function CheckoutPage() {
  const items = useCartStore((s) => s.items);
  const total = useCartStore((s) => s.total());
  const vaciar = useCartStore((s) => s.vaciar);
  const crearPedido = useCrearPedido();
  const navigate = useNavigate();

  const confirmar = (datos: DatosCheckout) => {
    crearPedido.mutate(
      {
        // El backend solo necesita producto y cantidad: el precio lo toma él (RN-01)
        items: items.map((i) => ({ producto_id: i.producto_id, cantidad: i.cantidad })),
        forma_pago: datos.forma_pago,
        direccion_entrega: datos.direccion_entrega.trim(),
        notas: datos.notas.trim() || null,
      },
      {
        onSuccess: (pedido) => {
          vaciar();
          navigate("/mis-pedidos", {
            state: { mensaje: `¡Pedido #${pedido.id} confirmado!` },
          });
        },
      },
    );
  };

  if (items.length === 0) {
    return (
      <section className="space-y-4">
        <h1 className="text-2xl font-bold text-slate-800">Confirmar pedido</h1>
        <EstadoVacio mensaje="No hay productos en el carrito." />
        <Link to="/" className="inline-block text-blue-600 hover:underline">
          Ir al catálogo
        </Link>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold text-slate-800">Confirmar pedido</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <h2 className="mb-3 font-semibold text-slate-800">Tu pedido</h2>
          <ul className="space-y-2 text-sm">
            {items.map((i) => (
              <li key={i.producto_id} className="flex justify-between gap-2">
                <span>
                  {i.cantidad} × {i.nombre}
                </span>
                <span>{formatearPrecio(i.precio_unitario * i.cantidad)}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 border-t border-slate-200 pt-3 text-right text-lg">
            Total: <span className="font-bold">{formatearPrecio(total)}</span>
          </p>
          <Link to="/carrito" className="text-sm text-blue-600 hover:underline">
            Modificar carrito
          </Link>
        </Card>

        <Card>
          <h2 className="mb-3 font-semibold text-slate-800">Datos de entrega</h2>
          <CheckoutForm
            enviando={crearPedido.isPending}
            errorApi={crearPedido.isError ? handleApiError(crearPedido.error) : null}
            onConfirmar={confirmar}
          />
        </Card>
      </div>
    </section>
  );
}

export default CheckoutPage;
