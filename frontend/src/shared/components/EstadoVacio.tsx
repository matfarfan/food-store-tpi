interface EstadoVacioProps {
  mensaje: string;
}

function EstadoVacio({ mensaje }: EstadoVacioProps) {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 p-6 text-center text-slate-500">
      {mensaje}
    </div>
  );
}

export default EstadoVacio;
