interface SkeletonProps {
  tipo?: "tarjetas" | "filas"; // grilla del catálogo o lista/tabla
  cantidad?: number;
}

// Placeholder animado mientras se cargan los datos
function Skeleton({ tipo = "filas", cantidad = 3 }: SkeletonProps) {
  const items = Array.from({ length: cantidad }, (_, i) => i);

  if (tipo === "tarjetas") {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-busy="true">
        {items.map((i) => (
          <div key={i} className="animate-pulse rounded-lg border border-slate-200 bg-white p-4">
            <div className="mb-3 h-36 rounded-md bg-slate-200" />
            <div className="mb-2 h-4 w-3/4 rounded bg-slate-200" />
            <div className="mb-4 h-4 w-1/3 rounded bg-slate-200" />
            <div className="h-9 rounded-md bg-slate-200" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3" aria-busy="true">
      {items.map((i) => (
        <div key={i} className="h-10 animate-pulse rounded-lg bg-slate-200" />
      ))}
    </div>
  );
}

export default Skeleton;
