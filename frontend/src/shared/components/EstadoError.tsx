interface EstadoErrorProps {
  mensaje: string;
  onReintentar?: () => void;
}

function EstadoError({ mensaje, onReintentar }: EstadoErrorProps) {
  return (
    <div role="alert" className="space-y-3 rounded-lg border border-red-300 bg-red-50 p-4 text-red-700">
      <p>{mensaje}</p>
      {onReintentar && (
        <button
          type="button"
          onClick={onReintentar}
          className="rounded-lg border border-red-600 px-3 py-1 text-sm font-medium hover:bg-red-100"
        >
          Reintentar
        </button>
      )}
    </div>
  );
}

export default EstadoError;
