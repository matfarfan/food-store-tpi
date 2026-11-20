import { useState } from "react";
import { handleApiError } from "../../../shared/api/handleApiError";
import EstadoError from "../../../shared/components/EstadoError";
import EstadoVacio from "../../../shared/components/EstadoVacio";
import Paginacion from "../../../shared/components/Paginacion";
import Skeleton from "../../../shared/components/Skeleton";
import PedidoTabla from "../components/PedidoTabla";
import { useCambiarEstadoPedido, usePedidos } from "../hooks/usePedidos";
import type { EstadoPedido, Pedido } from "../types/pedido";

const POR_PAGINA = 10;

const ESTADOS: EstadoPedido[] = ["PENDIENTE", "EN_PREPARACION", "ENTREGADO", "CANCELADO"];

function AdminPedidosPage() {
  // ── Estado de la interfaz ──
  const [estado, setEstado] = useState<EstadoPedido | "">(""); // "" = todos
  const [pagina, setPagina] = useState(0);
  const [abierto, setAbierto] = useState<number | null>(null);

  // ── Estado del servidor: el backend pagina y filtra (el admin recibe todos los pedidos) ──
  const { data, isPending, isError, error, refetch } = usePedidos({
    skip: pagina * POR_PAGINA,
    limit: POR_PAGINA,
    estado: estado || undefined, // sin filtro no se manda el parámetro
  });
  const cambiarEstado = useCambiarEstadoPedido();

  const filtrar = (nuevo: EstadoPedido | "") => {
    setEstado(nuevo);
    setPagina(0); // al cambiar el filtro se vuelve a la primera página
  };

  const confirmarCambio = (pedido: Pedido, nuevo: EstadoPedido) => {
    const pregunta =
      nuevo === "CANCELADO"
        ? `¿Cancelar el pedido #${pedido.id}? Se devolverá el stock.`
        : `¿Pasar el pedido #${pedido.id} a ${nuevo.replace("_", " ")}?`;
    if (window.confirm(pregunta)) {
      cambiarEstado.mutate({ id: pedido.id, estado: nuevo });
    }
  };

  const totalPaginas = data ? Math.ceil(data.total / POR_PAGINA) : 0;

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-slate-800">Pedidos</h1>
        <select
          value={estado}
          onChange={(e) => filtrar(e.target.value as EstadoPedido | "")}
          className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
        >
          <option value="">Todos los estados</option>
          {ESTADOS.map((e) => (
            <option key={e} value={e}>
              {e.replace("_", " ")}
            </option>
          ))}
        </select>
      </div>

      {cambiarEstado.isError && (
        <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">
          {handleApiError(cambiarEstado.error)}
        </p>
      )}

      {/* Un estado por vez: carga → error → vacío → tabla */}
      {isPending && <Skeleton cantidad={5} />}
      {isError && <EstadoError mensaje={handleApiError(error)} onReintentar={() => refetch()} />}
      {data && data.items.length === 0 && <EstadoVacio mensaje="No hay pedidos para mostrar." />}
      {data && data.items.length > 0 && (
        <PedidoTabla
          pedidos={data.items}
          abierto={abierto}
          deshabilitado={cambiarEstado.isPending}
          onVerDetalle={(pedido) => setAbierto(abierto === pedido.id ? null : pedido.id)}
          onCambiarEstado={confirmarCambio}
        />
      )}

      <Paginacion
        pagina={pagina}
        totalPaginas={totalPaginas}
        onAnterior={() => setPagina(pagina - 1)}
        onSiguiente={() => setPagina(pagina + 1)}
      />
    </section>
  );
}

export default AdminPedidosPage;