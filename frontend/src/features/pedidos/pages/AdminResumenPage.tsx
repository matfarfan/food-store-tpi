import { handleApiError } from "../../../shared/api/handleApiError";
import EstadoError from "../../../shared/components/EstadoError";
import Skeleton from "../../../shared/components/Skeleton";
import { formatearPrecio } from "../../../shared/utils/formato";
import TarjetaResumen from "../components/TarjetaResumen";
import { useResumenPedidos } from "../hooks/usePedidos";

function AdminResumenPage() {
  const { data: resumen, isPending, isError, error, refetch } = useResumenPedidos();

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold text-slate-800">Resumen</h1>

      {isPending && <Skeleton tipo="tarjetas" cantidad={6} />}
      {isError && <EstadoError mensaje={handleApiError(error)} onReintentar={() => refetch()} />}

      {resumen && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <TarjetaResumen titulo="Pendientes" valor={resumen.pendientes} color="text-amber-600" />
          <TarjetaResumen
            titulo="En preparación"
            valor={resumen.en_preparacion}
            color="text-blue-600"
          />
          <TarjetaResumen titulo="Entregados" valor={resumen.entregados} color="text-green-600" />
          <TarjetaResumen titulo="Cancelados" valor={resumen.cancelados} color="text-red-600" />
          <TarjetaResumen titulo="Pedidos de hoy" valor={resumen.pedidos_hoy} color="text-slate-800" />
          <TarjetaResumen
            titulo="Ingresos (entregados)"
            valor={formatearPrecio(resumen.ingresos_entregados)}
            color="text-slate-800"
          />
        </div>
      )}
    </section>
  );
}

export default AdminResumenPage;