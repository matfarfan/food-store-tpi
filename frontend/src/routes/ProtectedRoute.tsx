import { Navigate, Outlet, useLocation } from "react-router-dom";
import type { Rol } from "../features/auth/types/auth";
import { useAuthStore } from "../store/authStore";

interface ProtectedRouteProps {
  allowedRoles?: Rol[]; // sin roles: alcanza con tener sesión
}

// Decide si muestra la ruta hija (<Outlet />) o redirige.
// Ojo: solo organiza la navegación. La protección real está en el backend (require_role).
function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const usuario = useAuthStore((s) => s.usuario);
  const cargando = useAuthStore((s) => s.cargando);
  const location = useLocation();

  // 1. Mientras checkSession confirma la sesión, no redirige: muestra un indicador
  if (cargando) {
    return (
      <div className="flex justify-center py-16" aria-busy="true">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  // 2. Sin sesión → login, recordando a dónde quería ir
  if (!usuario) {
    return <Navigate to="/login" replace state={{ desde: location.pathname }} />;
  }

  // 3. Con sesión pero sin el rol permitido → acceso denegado
  if (allowedRoles && !allowedRoles.includes(usuario.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // 4. Todo bien: muestra la página
  return <Outlet />;
}

export default ProtectedRoute;
