import { flexRender, type Table } from "@tanstack/react-table";
import type { Producto } from "../types/producto";

interface ProductoTablaProps {
  table: Table<Producto>;
  onEdit: (producto: Producto) => void;
  onStock: (producto: Producto) => void;
  onDelete: (producto: Producto) => void;
}

const flechas: Record<string, string> = { asc: " ▲", desc: " ▼" };

// Igual que CategoriaTabla, con un botón más: "Stock"
function ProductoTabla({ table, onEdit, onStock, onDelete }: ProductoTablaProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-100 text-slate-700">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="px-4 py-3 font-semibold">
                  {header.isPlaceholder ? null : (
                    <button
                      type="button"
                      onClick={header.column.getToggleSortingHandler()}
                      disabled={!header.column.getCanSort()}
                      className="font-semibold hover:text-blue-600"
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {flechas[header.column.getIsSorted() as string] ?? null}
                    </button>
                  )}
                </th>
              ))}
              <th className="px-4 py-3 text-right font-semibold">Acciones</th>
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="border-t border-slate-200 hover:bg-slate-50">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-4 py-3 text-slate-700">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
              <td className="px-4 py-3">
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => onEdit(row.original)}
                    className="rounded-md border border-blue-600 px-3 py-1 text-blue-600 hover:bg-blue-50"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => onStock(row.original)}
                    className="rounded-md border border-slate-400 px-3 py-1 text-slate-700 hover:bg-slate-100"
                  >
                    Stock
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(row.original)}
                    className="rounded-md bg-red-600 px-3 py-1 text-white hover:bg-red-700"
                  >
                    Dar de baja
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-4 py-3 text-sm">
        <button
          type="button"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="rounded-md border border-slate-300 px-3 py-1 hover:bg-white disabled:opacity-50"
        >
          Anterior
        </button>
        <span className="text-slate-600">
          Página {table.getState().pagination.pageIndex + 1} de {Math.max(table.getPageCount(), 1)}
        </span>
        <button
          type="button"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="rounded-md border border-slate-300 px-3 py-1 hover:bg-white disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}

export default ProductoTabla;