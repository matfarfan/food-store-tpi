import { Fragment } from "react";
import BadgeEstado from "../../../shared/ui/BadgeEstado";
import { formatearFecha, formatearPrecio } from "../../../shared/utils/formato";
import type { EstadoPedido, Pedido } from "../types/pedido";
import PedidoDetalle from "./PedidoDetalle";


const TRANSICIONES: Record<EstadoPedido, EstadoPedido[]> = {
  PENDIENTE: ["EN_PREPARACION", "CANCELADO"],
  EN_PREPARACION: ["ENTREGADO", "CANCELADO"],
  ENTREGADO: [],
  CANCELADO: [],
};

const textoBoton: Record<EstadoPedido, string> = {
  PENDIENTE: "",
  EN_PREPARACION: "Preparar",
  ENTREGADO: "Entregar",
  CANCELADO: "Cancelar",
};

interface PedidoTablaProps {
  pedidos: Pedido[];
  abierto: number | null; // id del pedido con el detalle visible
  deshabilitado: boolean; // mientras se guarda un cambio de estado
  onVerDetalle: (pedido: Pedido) => void;
  onCambiarEstado: (pedido: Pedido, estado: EstadoPedido) => void;
}

function PedidoTabla({
  pedidos,
  abierto,
  deshabilitado,
  onVerDetalle,
  onCambiarEstado,
}: PedidoTablaProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-100 text-slate-700">
          <tr>
            <th className="px-4 py-3 font-semibold">N.º</th>
            <th className="px-4 py-3 font-semibold">Cliente</th>
            <th className="px-4 py-3 font-semibold">Fecha</th>
            <th className="px-4 py-3 font-semibold">Estado</th>
            <th className="px-4 py-3 font-semibold">Total</th>
            <th className="px-4 py-3 text-right font-semibold">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {pedidos.map((pedido) => (
            <Fragment key={pedido.id}>
              <tr className="border-t border-slate-200 hover:bg-slate-50">
                <td className="px-4 py-3 text-slate-700">#{pedido.id}</td>
                <td className="px-4 py-3 text-slate-700">Usuario #{pedido.usuario_id}</td>
                <td className="px-4 py-3 text-slate-700">{formatearFecha(pedido.created_at)}</td>
                <td className="px-4 py-3">
                  <BadgeEstado estado={pedido.estado} />
                </td>
                <td className="px-4 py-3 font-semibold text-slate-800">
                  {formatearPrecio(pedido.total)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => onVerDetalle(pedido)}
                      className="rounded-md border border-slate-400 px-3 py-1 text-slate-700 hover:bg-slate-100"
                    >
                      {abierto === pedido.id ? "Ocultar" : "Detalle"}
                    </button>
                    {TRANSICIONES[pedido.estado].map((estado) => (
                      <button
                        key={estado}
                        type="button"
                        disabled={deshabilitado}
                        onClick={() => onCambiarEstado(pedido, estado)}
                        className={
                          estado === "CANCELADO"
                            ? "rounded-md bg-red-600 px-3 py-1 text-white hover:bg-red-700 disabled:opacity-50"
                            : "rounded-md bg-blue-600 px-3 py-1 text-white hover:bg-blue-700 disabled:opacity-50"
                        }
                      >
                        {textoBoton[estado]}
                      </button>
                    ))}
                  </div>
                </td>
              </tr>
              {abierto === pedido.id && (
                <tr className="bg-slate-50">
                  <td colSpan={6} className="px-4 py-3">
                    <PedidoDetalle pedido={pedido} />
                  </td>
                </tr>
              )}
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PedidoTabla;