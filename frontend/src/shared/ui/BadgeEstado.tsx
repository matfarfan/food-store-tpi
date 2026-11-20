interface BadgeEstadoProps {
  estado: string;
}

// Un color por cada estado del pedido
const colores: Record<string, string> = {
  PENDIENTE: "bg-amber-100 text-amber-800",
  EN_PREPARACION: "bg-blue-100 text-blue-800",
  ENTREGADO: "bg-green-100 text-green-800",
  CANCELADO: "bg-red-100 text-red-800",
};

function BadgeEstado({ estado }: BadgeEstadoProps) {
  return (
    <span
      className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${
        colores[estado] ?? "bg-slate-100 text-slate-700"
      }`}
    >
      {estado.replace("_", " ")}
    </span>
  );
}

export default BadgeEstado;
