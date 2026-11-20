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
import CategoriaTabla from "../components/CategoriaTabla";
import {
  useActualizarCategoria,
  useCategorias,
  useCrearCategoria,
  useEliminarCategoria,
} from "../hooks/useCategorias";
import type { Categoria } from "../types/categoria";

// Valores que maneja el formulario (en el form la descripción es siempre texto)
interface CategoriaFormValues {
  nombre: string;
  descripcion: string;
}

const sinCategorias: Categoria[] = [];

const columnHelper = createColumnHelper<Categoria>();
const columnas = [
  columnHelper.accessor("id", { header: "ID" }),
  columnHelper.accessor("nombre", { header: "Nombre" }),
  columnHelper.accessor("descripcion", {
    header: "Descripción",
    cell: (info) => info.getValue() || "Sin descripción",
  }),
];

const valoresVacios: CategoriaFormValues = { nombre: "", descripcion: "" };

function AdminCategoriasPage() {
  // ── Estado de la interfaz ──
  const [modalAbierto, setModalAbierto] = useState(false);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<Categoria | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 5 });

  // ── Estado del servidor (TanStack Query) ──
  const { data: categorias = sinCategorias, isPending, isError, error, refetch } = useCategorias();
  const crear = useCrearCategoria();
  const actualizar = useActualizarCategoria();
  const eliminar = useEliminarCategoria();

  // ── Tabla (TanStack Table): paginación del lado del cliente ──
  const table = useReactTable({
    data: categorias,
    columns: columnas,
    state: { sorting, pagination },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  // ── Modal ──
  const cerrarModal = () => {
    setModalAbierto(false);
    setCategoriaSeleccionada(null);
  };

  // ── Formulario (TanStack Form) ──
  const form = useForm({
    defaultValues: valoresVacios,
    onSubmit: ({ value }) => {
      const datos = { nombre: value.nombre.trim(), descripcion: value.descripcion.trim() || null };
      if (categoriaSeleccionada) {
        actualizar.mutate({ ...categoriaSeleccionada, ...datos }, { onSuccess: cerrarModal });
      } else {
        crear.mutate(datos, { onSuccess: cerrarModal });
      }
    },
  });

  const abrirParaCrear = () => {
    crear.reset();
    actualizar.reset();
    form.reset(valoresVacios, { keepDefaultValues: true });
    setCategoriaSeleccionada(null);
    setModalAbierto(true);
  };

  const abrirParaEditar = (categoria: Categoria) => {
    crear.reset();
    actualizar.reset();
    form.reset(
      { nombre: categoria.nombre, descripcion: categoria.descripcion ?? "" },
      { keepDefaultValues: true },
    );
    setCategoriaSeleccionada(categoria);
    setModalAbierto(true);
  };

  const darDeBaja = (categoria: Categoria) => {
    if (window.confirm(`¿Dar de baja la categoría "${categoria.nombre}"?`)) {
      eliminar.mutate(categoria.id);
    }
  };

  // Error de la API (409 nombre repetido, etc.): se muestra DENTRO del modal
  const errorApi = crear.error ?? actualizar.error;
  const guardando = crear.isPending || actualizar.isPending;

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Categorías</h1>
        <Button onClick={abrirParaCrear}>Nueva categoría</Button>
      </div>

      {eliminar.isError && (
        <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">
          {handleApiError(eliminar.error)}
        </p>
      )}

      {/* Un estado por vez: carga → error → vacío → tabla */}
      {isPending && <Skeleton cantidad={5} />}
      {isError && <EstadoError mensaje={handleApiError(error)} onReintentar={() => refetch()} />}
      {!isPending && !isError && categorias.length === 0 && (
        <EstadoVacio mensaje="No hay categorías cargadas." />
      )}
      {categorias.length > 0 && (
        <CategoriaTabla table={table} onEdit={abrirParaEditar} onDelete={darDeBaja} />
      )}

      <Modal
        isOpen={modalAbierto}
        titulo={categoriaSeleccionada ? "Editar categoría" : "Nueva categoría"}
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
              onChange: ({ value }) => {
                const largo = value.trim().length;
                if (largo < 2) return "Mínimo 2 caracteres";
                if (largo > 100) return "Máximo 100 caracteres";
                return undefined;
              },
            }}
          >
            {(f) => (
              <Input
                id="nombre"
                label="Nombre"
                maxLength={100}
                value={f.state.value}
                onBlur={f.handleBlur}
                onChange={(e) => f.handleChange(e.target.value)}
                error={f.state.meta.errors[0]}
              />
            )}
          </form.Field>

          <form.Field name="descripcion">
            {(f) => (
              <div className="space-y-1">
                <label htmlFor="descripcion" className="block text-sm font-medium text-slate-700">
                  Descripción
                </label>
                <textarea
                  id="descripcion"
                  rows={3}
                  value={f.state.value}
                  onBlur={f.handleBlur}
                  onChange={(e) => f.handleChange(e.target.value)}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                />
              </div>
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
    </section>
  );
}

export default AdminCategoriasPage;