import { useState } from "react";
import { useLocation } from "react-router-dom";
import { handleApiError } from "../../../shared/api/handleApiError";
import EstadoError from "../../../shared/components/EstadoError";
import EstadoVacio from "../../../shared/components/EstadoVacio";
import Paginacion from "../../../shared/components/Paginacion";
import Skeleton from "../../../shared/components/Skeleton";
import BadgeEstado from "../../../shared/ui/BadgeEstado";
import Button from "../../../shared/ui/Button";
import Card from "../../../shared/ui/Card";
import { formatearFecha, formatearPrecio } from "../../../shared/utils/formato";
import { useAuthStore } from "../../../store/authStore";
import PedidoDetalle from "../components/PedidoDetalle";
import { useCancelarPedido, usePedidos } from "../hooks/usePedidos";

const POR_PAGINA = 10;

function MisPedidosPage() {
  const usuario = useAuthStore((s) => s.usuario);
  const mensaje = (useLocation().state as { mensaje?: string } | null)?.mensaje;
  const [pagina, setPagina] = useState(0);
  const [abierto, setAbierto] = useState<number | null>(null); // id del pedido con el detalle visible

  const { data, isPending, isError, error, refetch } = usePedidos({
    skip: pagina * POR_PAGINA,
    limit: POR_PAGINA,
  });
  const cancelar = useCancelarPedido();

  const confirmarCancelacion = (id: number) => {
    if (window.confirm(`¿Cancelar el pedido #${id}? Se devolverá el stock.`)) {
      cancelar.mutate(id);
    }
  };

  const totalPaginas = data ? Math.ceil(data.total / POR_PAGINA) : 0;

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold text-slate-800">Mis pedidos</h1>
      {usuario?.role === "admin" && (
        <p className="text-sm text-slate-500">
          Como administrador ves los pedidos de todos los clientes. Para cambiarles el estado usá
          Panel admin → Pedidos.
        </p>
      )}
      {mensaje && <p className="rounded-md bg-green-50 p-3 text-sm text-green-700">{mensaje}</p>}
      {cancelar.isError && (
        <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">
          {handleApiError(cancelar.error)}
        </p>
      )}

      {isPending && <Skeleton cantidad={4} />}
      {isError && <EstadoError mensaje={handleApiError(error)} onReintentar={() => refetch()} />}
      {data && data.items.length === 0 && <EstadoVacio mensaje="Todavía no hiciste pedidos." />}

      {data &&
        data.items.map((pedido) => {
          // RN-04: el dueño solo puede cancelar si está PENDIENTE
          const puedeCancelar = pedido.estado === "PENDIENTE" && pedido.usuario_id === usuario?.id;
          return (
            <Card key={pedido.id} className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-slate-800">Pedido #{pedido.id}</span>
                  <BadgeEstado estado={pedido.estado} />
                  <span className="text-sm text-slate-500">{formatearFecha(pedido.created_at)}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold">{formatearPrecio(pedido.total)}</span>
                  <Button
                    variante="contorno"
                    onClick={() => setAbierto(abierto === pedido.id ? null : pedido.id)}
                  >
                    {abierto === pedido.id ? "Ocultar detalle" : "Ver detalle"}
                  </Button>
                  {puedeCancelar && (
                    <Button
                      variante="peligro"
                      disabled={cancelar.isPending}
                      onClick={() => confirmarCancelacion(pedido.id)}
                    >
                      Cancelar
                    </Button>
                  )}
                </div>
              </div>
              {abierto === pedido.id && <PedidoDetalle pedido={pedido} />}
            </Card>
          );
        })}

      <Paginacion
        pagina={pagina}
        totalPaginas={totalPaginas}
        onAnterior={() => setPagina(pagina - 1)}
        onSiguiente={() => setPagina(pagina + 1)}
      />
    </section>
  );
}

export default MisPedidosPage;
