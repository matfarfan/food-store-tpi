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
import { useAuthStore } from "../../../store/authStore";
import type { Usuario } from "../../auth/types/auth";
import UsuarioTabla from "../components/UsuarioTabla";
import { useActivarUsuario, useDesactivarUsuario, useUsuarios } from "../hooks/useUsuarios";

// ── Fuera del componente: referencias estables (apunte A3 de la Unidad 8) ──
const sinUsuarios: Usuario[] = [];

const columnHelper = createColumnHelper<Usuario>();
const columnas = [
  columnHelper.accessor("username", { header: "Usuario" }),
  columnHelper.accessor("full_name", { header: "Nombre" }),
  columnHelper.accessor("email", { header: "Email" }),
  columnHelper.accessor("role", { header: "Rol" }),
  columnHelper.accessor("disabled", {
    header: "Estado",
    cell: (info) =>
      info.getValue() ? (
        <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-800">
          Inactivo
        </span>
      ) : (
        <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-800">
          Activo
        </span>
      ),
  }),
];

function AdminUsuariosPage() {
  // ── Estado de la interfaz ──
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 5 });

  // ── Estado global: quién está logueado (para no mostrar "Desactivar" en su fila) ──
  const usuarioActual = useAuthStore((state) => state.usuario);

  // ── Estado del servidor (TanStack Query) ──
  const { data: usuarios = sinUsuarios, isPending, isError, error, refetch } = useUsuarios();
  const activar = useActivarUsuario();
  const desactivar = useDesactivarUsuario();

  // ── Tabla (TanStack Table) ──
  const table = useReactTable({
    data: usuarios,
    columns: columnas,
    state: { sorting, pagination },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const activarUsuario = (usuario: Usuario) => {
    desactivar.reset();
    activar.mutate(usuario.id);
  };

  const desactivarUsuario = (usuario: Usuario) => {
    if (window.confirm(`¿Desactivar al usuario "${usuario.username}"?`)) {
      activar.reset();
      desactivar.mutate(usuario.id);
    }
  };

  const errorApi = activar.error ?? desactivar.error;

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold text-slate-800">Usuarios</h1>

      {errorApi && (
        <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{handleApiError(errorApi)}</p>
      )}

      {/* Un estado por vez: carga → error → vacío → tabla */}
      {isPending && <Skeleton cantidad={5} />}
      {isError && <EstadoError mensaje={handleApiError(error)} onReintentar={() => refetch()} />}
      {!isPending && !isError && usuarios.length === 0 && (
        <EstadoVacio mensaje="No hay usuarios registrados." />
      )}
      {usuarios.length > 0 && (
        <UsuarioTabla
          table={table}
          usuarioActualId={usuarioActual?.id}
          onActivar={activarUsuario}
          onDesactivar={desactivarUsuario}
        />
      )}
    </section>
  );
}

export default AdminUsuariosPage;