import { formatearPrecio } from "../../../shared/utils/formato";
import type { Pedido } from "../types/pedido";

interface PedidoDetalleProps {
  pedido: Pedido;
}

// Las líneas muestran el nombre y el precio COPIADOS al crear el pedido (RN-05),
// aunque el producto haya cambiado después
function PedidoDetalle({ pedido }: PedidoDetalleProps) {
  return (
    <div className="space-y-3 text-sm">
      <table className="w-full text-left">
        <thead className="text-slate-500">
          <tr>
            <th className="py-1 font-medium">Producto</th>
            <th className="py-1 text-right font-medium">Precio</th>
            <th className="py-1 text-right font-medium">Cant.</th>
            <th className="py-1 text-right font-medium">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {pedido.items.map((item) => (
            <tr key={item.producto_id} className="border-t border-slate-100">
              <td className="py-1">{item.nombre_producto}</td>
              <td className="py-1 text-right">{formatearPrecio(item.precio_unitario)}</td>
              <td className="py-1 text-right">{item.cantidad}</td>
              <td className="py-1 text-right">{formatearPrecio(item.subtotal)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="grid gap-1 text-slate-600 sm:grid-cols-2">
        <p>
          <span className="font-medium">Dirección:</span> {pedido.direccion_entrega}
        </p>
        <p>
          <span className="font-medium">Pago:</span> {pedido.forma_pago}
        </p>
        {pedido.notas && (
          <p className="sm:col-span-2">
            <span className="font-medium">Notas:</span> {pedido.notas}
          </p>
        )}
      </div>
    </div>
  );
}

export default PedidoDetalle;
