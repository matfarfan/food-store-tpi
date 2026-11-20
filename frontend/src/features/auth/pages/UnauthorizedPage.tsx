import { Link } from "react-router-dom";
import Card from "../../../shared/ui/Card";

function UnauthorizedPage() {
  return (
    <div className="mx-auto max-w-md text-center">
      <Card>
        <h1 className="mb-2 text-2xl font-bold text-slate-800">Acceso denegado</h1>
        <p className="mb-4 text-slate-600">No tenés permiso para ver esta página.</p>
        <Link to="/" className="text-blue-600 hover:underline">
          Volver al inicio
        </Link>
      </Card>
    </div>
  );
}

export default UnauthorizedPage;
