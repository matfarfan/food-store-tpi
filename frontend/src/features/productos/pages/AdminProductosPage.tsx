import { useForm } from "@tanstack/react-form";
import {
  createColumnHelper,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type PaginationState,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import { handleApiError } from "../../../shared/api/handleApiError";
import EstadoError from "../../../shared/components/EstadoError";
import EstadoVacio from "../../../shared/components/EstadoVacio";
import Skeleton from "../../../shared/components/Skeleton";
import Button from "../../../shared/ui/Button";
import Input from "../../../shared/ui/Input";
import Modal from "../../../shared/ui/Modal";
import { formatearPrecio } from "../../../shared/utils/formato";
import { useCategorias } from "../../categorias/hooks/useCategorias";
import ProductoTabla from "../components/ProductoTabla";
import {
  useActualizarProducto,
  useActualizarStock,
  useCrearProducto,
  useEliminarProducto,
  useProductos,
} from "../hooks/useProductos";
import type { Producto, ProductoStockUpdate } from "../types/producto";


interface ProductoFormValues {
  nombre: string;
  descripcion: string;
  precio_base: number;
  imagen_url: string;
  stock: number;
  disponible: boolean;
  categoria_id: number; // 0 = sin elegir
}


const sinProductos: Producto[] = [];

const columnHelper = createColumnHelper<Producto>();
const columnas = [
  columnHelper.accessor("id", { header: "ID" }),
  columnHelper.accessor("nombre", { header: "Nombre" }),
  columnHelper.accessor((p) => p.categoria.nombre, { id: "categoria", header: "Categoría" }),
  columnHelper.accessor("precio_base", {
    header: "Precio",
    cell: (info) => formatearPrecio(info.getValue()),
  }),
  columnHelper.accessor("stock", { header: "Stock" }),
  columnHelper.accessor("disponible", {
    header: "Disponible",
    cell: (info) => (info.getValue() ? "Sí" : "No"),
  }),
];

const valoresVacios: ProductoFormValues = {
  nombre: "",
  descripcion: "",
  precio_base: 0,
  imagen_url: "",
  stock: 0,
  disponible: true,
  categoria_id: 0,
};

const stockVacio: ProductoStockUpdate = { stock: 0, disponible: true };

function AdminProductosPage() {
  // ── Estado de la interfaz ──
  const [modalAbierto, setModalAbierto] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null);
  const [productoStock, setProductoStock] = useState<Producto | null>(null); // modal de stock
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 5 });

  // ── Estado del servidor: el panel pide limit=100 y pagina en el cliente ──
  const { data, isPending, isError, error, refetch } = useProductos({ skip: 0, limit: 100 });
  const productos = data?.items ?? sinProductos;
  const { data: categorias = [] } = useCategorias();
  const crear = useCrearProducto();
  const actualizar = useActualizarProducto();
  const cambiarStock = useActualizarStock();
  const eliminar = useEliminarProducto();

  // ── Tabla (TanStack Table) ──
  const table = useReactTable({
    data: productos,
    columns: columnas,
    state: { sorting, pagination },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  // ── Formulario de alta / edición ──
  const cerrarModal = () => {
    setModalAbierto(false);
    setProductoSeleccionado(null);
  };

  const form = useForm({
    defaultValues: valoresVacios,
    onSubmit: ({ value }) => {
      const datos = {
        ...value,
        nombre: value.nombre.trim(),
        descripcion: value.descripcion.trim() || null,
        imagen_url: value.imagen_url.trim() || null,
      };
      if (productoSeleccionado) {
        actualizar.mutate({ id: productoSeleccionado.id, ...datos }, { onSuccess: cerrarModal });
      } else {
        crear.mutate(datos, { onSuccess: cerrarModal });
      }
    },
  });

  const abrirParaCrear = () => {
    crear.reset();
    actualizar.reset();
    form.reset(valoresVacios, { keepDefaultValues: true });
    setProductoSeleccionado(null);
    setModalAbierto(true);
  };

  const abrirParaEditar = (producto: Producto) => {
    crear.reset();
    actualizar.reset();
    form.reset(
      {
        nombre: producto.nombre,
        descripcion: producto.descripcion ?? "",
        precio_base: producto.precio_base,
        imagen_url: producto.imagen_url ?? "",
        stock: producto.stock,
        disponible: producto.disponible,
        categoria_id: producto.categoria_id,
      },
      { keepDefaultValues: true },
    );
    setProductoSeleccionado(producto);
    setModalAbierto(true);
  };

  // ── Formulario de stock y disponibilidad (PATCH /productos/{id}/stock) ──
  const formStock = useForm({
    defaultValues: stockVacio,
    onSubmit: ({ value }) => {
      if (productoStock) {
        cambiarStock.mutate(
          { id: productoStock.id, ...value },
          { onSuccess: () => setProductoStock(null) },
        );
      }
    },
  });

  const abrirStock = (producto: Producto) => {
    cambiarStock.reset();
    formStock.reset(
      { stock: producto.stock, disponible: producto.disponible },
      { keepDefaultValues: true },
    );
    setProductoStock(producto);
  };

  const darDeBaja = (producto: Producto) => {
    if (window.confirm(`¿Dar de baja el producto "${producto.nombre}"?`)) {
      eliminar.mutate(producto.id);
    }
  };

  const errorApi = crear.error ?? actualizar.error;
  const guardando = crear.isPending || actualizar.isPending;

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Productos</h1>
        <Button onClick={abrirParaCrear}>Nuevo producto</Button>
      </div>

      {eliminar.isError && (
        <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">
          {handleApiError(eliminar.error)}
        </p>
      )}

      {/* Un estado por vez: carga → error → vacío → tabla */}
      {isPending && <Skeleton cantidad={5} />}
      {isError && <EstadoError mensaje={handleApiError(error)} onReintentar={() => refetch()} />}
      {data && productos.length === 0 && <EstadoVacio mensaje="No hay productos cargados." />}
      {productos.length > 0 && (
        <ProductoTabla
          table={table}
          onEdit={abrirParaEditar}
          onStock={abrirStock}
          onDelete={darDeBaja}
        />
      )}

      {/* ── Modal de alta / edición ── */}
      <Modal
        isOpen={modalAbierto}
        titulo={productoSeleccionado ? "Editar producto" : "Nuevo producto"}
        onClose={cerrarModal}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          <form.Field
            name="nombre"
            validators={{
              onChange: ({ value }) => (!value.trim() ? "El nombre es obligatorio" : undefined),
            }}
          >
            {(f) => (
              <Input
                id="nombre"
                label="Nombre"
                maxLength={150}
                value={f.state.value}
                onBlur={f.handleBlur}
                onChange={(e) => f.handleChange(e.target.value)}
                error={f.state.meta.errors[0]}
              />
            )}
          </form.Field>

          <form.Field
            name="categoria_id"
            validators={{
              onChange: ({ value }) => (value === 0 ? "Elegí una categoría" : undefined),
            }}
          >
            {(f) => (
              <div className="space-y-1">
                <label htmlFor="categoria_id" className="block text-sm font-medium text-slate-700">
                  Categoría
                </label>
                <select
                  id="categoria_id"
                  value={f.state.value}
                  onBlur={f.handleBlur}
                  onChange={(e) => f.handleChange(Number(e.target.value))}
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
                >
                  <option value={0}>Elegí una categoría…</option>
                  {categorias.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nombre}
                    </option>
                  ))}
                </select>
                {f.state.meta.errors[0] && (
                  <p className="text-sm text-red-600">{f.state.meta.errors[0]}</p>
                )}
              </div>
            )}
          </form.Field>

          <div className="grid grid-cols-2 gap-4">
            <form.Field
              name="precio_base"
              validators={{
                onChange: ({ value }) => (value < 0 ? "No puede ser negativo" : undefined),
              }}
            >
              {(f) => (
                <Input
                  id="precio_base"
                  label="Precio"
                  type="number"
                  min={0}
                  step="0.01"
                  value={f.state.value}
                  onBlur={f.handleBlur}
                  onChange={(e) => f.handleChange(Number(e.target.value))}
                  error={f.state.meta.errors[0]}
                />
              )}
            </form.Field>

            <form.Field
              name="stock"
              validators={{
                onChange: ({ value }) =>
                  value < 0 || !Number.isInteger(value) ? "Entero no negativo" : undefined,
              }}
            >
              {(f) => (
                <Input
                  id="stock"
                  label="Stock"
                  type="number"
                  min={0}
                  step={1}
                  value={f.state.value}
                  onBlur={f.handleBlur}
                  onChange={(e) => f.handleChange(Number(e.target.value))}
                  error={f.state.meta.errors[0]}
                />
              )}
            </form.Field>
          </div>

          <form.Field name="descripcion">
            {(f) => (
              <div className="space-y-1">
                <label htmlFor="descripcion" className="block text-sm font-medium text-slate-700">
                  Descripción
                </label>
                <textarea
                  id="descripcion"
                  rows={2}
                  value={f.state.value}
                  onBlur={f.handleBlur}
                  onChange={(e) => f.handleChange(e.target.value)}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                />
              </div>
            )}
          </form.Field>

          <form.Field name="imagen_url">
            {(f) => (
              <Input
                id="imagen_url"
                label="URL de la imagen (opcional)"
                type="url"
                placeholder="https://..."
                value={f.state.value}
                onBlur={f.handleBlur}
                onChange={(e) => f.handleChange(e.target.value)}
              />
            )}
          </form.Field>

          <form.Field name="disponible">
            {(f) => (
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={f.state.value}
                  onChange={(e) => f.handleChange(e.target.checked)}
                />
                Disponible para la venta
              </label>
            )}
          </form.Field>

          {errorApi && (
            <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{handleApiError(errorApi)}</p>
          )}

          <div className="flex justify-end gap-2">
            <Button variante="secundario" onClick={cerrarModal}>
              Cancelar
            </Button>
            <Button type="submit" disabled={guardando}>
              {guardando ? "Guardando..." : "Guardar"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* ── Modal de stock y disponibilidad ── */}
      <Modal
        isOpen={productoStock !== null}
        titulo={`Stock de ${productoStock?.nombre ?? ""}`}
        onClose={() => setProductoStock(null)}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            formStock.handleSubmit();
          }}
          className="space-y-4"
        >
          <formStock.Field
            name="stock"
            validators={{
              onChange: ({ value }) =>
                value < 0 || !Number.isInteger(value) ? "Entero no negativo" : undefined,
            }}
          >
            {(f) => (
              <Input
                id="stock_nuevo"
                label="Stock"
                type="number"
                min={0}
                step={1}
                value={f.state.value}
                onBlur={f.handleBlur}
                onChange={(e) => f.handleChange(Number(e.target.value))}
                error={f.state.meta.errors[0]}
              />
            )}
          </formStock.Field>

          <formStock.Field name="disponible">
            {(f) => (
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={f.state.value}
                  onChange={(e) => f.handleChange(e.target.checked)}
                />
                Disponible para la venta
              </label>
            )}
          </formStock.Field>

          {cambiarStock.isError && (
            <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">
              {handleApiError(cambiarStock.error)}
            </p>
          )}

          <div className="flex justify-end gap-2">
            <Button variante="secundario" onClick={() => setProductoStock(null)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={cambiarStock.isPending}>
              {cambiarStock.isPending ? "Guardando..." : "Guardar"}
            </Button>
          </div>
        </form>
      </Modal>
    </section>
  );
}

export default AdminProductosPage;