import { type SyntheticEvent, useState } from "react";
import { handleApiError } from "../../../shared/api/handleApiError";
import EstadoError from "../../../shared/components/EstadoError";
import EstadoVacio from "../../../shared/components/EstadoVacio";
import Paginacion from "../../../shared/components/Paginacion";
import Skeleton from "../../../shared/components/Skeleton";
import Button from "../../../shared/ui/Button";
import { useCategorias } from "../../categorias/hooks/useCategorias";
import ProductoCard from "../components/ProductoCard";
import { useProductos } from "../hooks/useProductos";

const POR_PAGINA = 8;

function CatalogoPage() {
  // Estado de la interfaz: qué página y qué filtros eligió el usuario
  const [pagina, setPagina] = useState(0);
  const [textoBusqueda, setTextoBusqueda] = useState(""); // lo que se está escribiendo
  const [busqueda, setBusqueda] = useState(""); // lo que se buscó al apretar "Buscar"
  const [categoriaId, setCategoriaId] = useState<number | undefined>(undefined);

  // Estado del servidor: TanStack Query (paginado en el servidor: skip = página × limit)
  const { data, isPending, isError, error, refetch } = useProductos({
    skip: pagina * POR_PAGINA,
    limit: POR_PAGINA,
    search: busqueda || undefined,
    categoria_id: categoriaId,
  });
  const { data: categorias = [] } = useCategorias();

  const totalPaginas = data ? Math.ceil(data.total / POR_PAGINA) : 0;

  const buscar = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusqueda(textoBusqueda.trim());
    setPagina(0); // un filtro nuevo siempre arranca en la primera página
  };

  const cambiarCategoria = (valor: string) => {
    setCategoriaId(valor ? Number(valor) : undefined);
    setPagina(0);
  };

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Catálogo</h1>

      <form onSubmit={buscar} className="flex flex-wrap gap-2">
        <input
          type="search"
          placeholder="Buscar por nombre..."
          aria-label="Buscar por nombre"
          value={textoBusqueda}
          onChange={(e) => setTextoBusqueda(e.target.value)}
          className="min-w-48 flex-1 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
        />
        <select
          aria-label="Filtrar por categoría"
          value={categoriaId ?? ""}
          onChange={(e) => cambiarCategoria(e.target.value)}
          className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
        >
          <option value="">Todas las categorías</option>
          {categorias.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nombre}
            </option>
          ))}
        </select>
        <Button type="submit">Buscar</Button>
      </form>

      {/* Un estado por vez: carga → error → vacío → datos */}
      {isPending && <Skeleton tipo="tarjetas" cantidad={POR_PAGINA} />}
      {isError && <EstadoError mensaje={handleApiError(error)} onReintentar={() => refetch()} />}
      {data && data.items.length === 0 && (
        <EstadoVacio mensaje="No hay productos que coincidan con la búsqueda." />
      )}
      {data && data.items.length > 0 && (
        <>
          <p className="text-sm text-slate-500">{data.total} productos</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {data.items.map((producto) => (
              <ProductoCard key={producto.id} producto={producto} />
            ))}
          </div>
          <Paginacion
            pagina={pagina}
            totalPaginas={totalPaginas}
            onAnterior={() => setPagina(pagina - 1)}
            onSiguiente={() => setPagina(pagina + 1)}
          />
        </>
      )}
    </section>
  );
}

export default CatalogoPage;
