interface PaginacionProps {
  pagina: number; // empieza en 0
  totalPaginas: number;
  onAnterior: () => void;
  onSiguiente: () => void;
}

function Paginacion({ pagina, totalPaginas, onAnterior, onSiguiente }: PaginacionProps) {
  if (totalPaginas <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-3 py-4 text-sm">
      <button
        type="button"
        onClick={onAnterior}
        disabled={pagina === 0}
        className="rounded-md border border-slate-300 px-3 py-1 hover:bg-slate-100 disabled:opacity-50"
      >
        Anterior
      </button>
      <span className="text-slate-600">
        Página {pagina + 1} de {totalPaginas}
      </span>
      <button
        type="button"
        onClick={onSiguiente}
        disabled={pagina + 1 >= totalPaginas}
        className="rounded-md border border-slate-300 px-3 py-1 hover:bg-slate-100 disabled:opacity-50"
      >
        Siguiente
      </button>
    </div>
  );
}

export default Paginacion;
