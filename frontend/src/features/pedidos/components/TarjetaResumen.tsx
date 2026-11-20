import Card from "../../../shared/ui/Card";

interface TarjetaResumenProps {
  titulo: string;
  valor: string | number;
  color: string; // clase de Tailwind para el número (ej. "text-amber-600")
}

// Una tarjeta = un indicador del resumen
function TarjetaResumen({ titulo, valor, color }: TarjetaResumenProps) {
  return (
    <Card className="space-y-1">
      <p className="text-sm font-medium text-slate-500">{titulo}</p>
      <p className={`text-3xl font-bold ${color}`}>{valor}</p>
    </Card>
  );
}

export default TarjetaResumen;