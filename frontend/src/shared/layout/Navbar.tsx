import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { useCartStore } from "../../store/cartStore";

const estiloLink = ({ isActive }: { isActive: boolean }) =>
  `rounded px-2 py-1 hover:bg-blue-700 ${isActive ? "bg-blue-700" : ""}`;

const LINKS_ADMIN = [
  { to: "/admin/resumen", texto: "Resumen" },
  { to: "/admin/categorias", texto: "Categorías" },
  { to: "/admin/productos", texto: "Productos" },
  { to: "/admin/pedidos", texto: "Pedidos" },
  { to: "/admin/usuarios", texto: "Usuarios" },
];

function Navbar() {
  const usuario = useAuthStore((s) => s.usuario);
  const logout = useAuthStore((s) => s.logout);
  // cantidad total de unidades en el carrito (se actualiza sola al agregar o quitar)
  const unidades = useCartStore((s) => s.items.reduce((suma, i) => suma + i.cantidad, 0));
  const navigate = useNavigate();

  const cerrarSesion = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="bg-blue-600 text-white shadow">
      <nav className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <Link to="/" className="mr-3 text-xl font-bold">
            Food Store
          </Link>
          <NavLink to="/" end className={estiloLink}>
            Catálogo
          </NavLink>
          <NavLink to="/carrito" className={estiloLink}>
            Carrito
            {unidades > 0 && (
              <span className="ml-1 rounded-full bg-white px-1.5 text-xs font-bold text-blue-600">
                {unidades}
              </span>
            )}
          </NavLink>
          {usuario && (
            <NavLink to="/mis-pedidos" className={estiloLink}>
              Mis pedidos
            </NavLink>
          )}
        </div>

        <div className="flex items-center gap-3 text-sm">
          {usuario ? (
            <>
              <span>
                {usuario.full_name}{" "}
                <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs uppercase">
                  {usuario.role}
                </span>
              </span>
              <button
                type="button"
                onClick={cerrarSesion}
                className="rounded-md border border-white/60 px-3 py-1 hover:bg-blue-700"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={estiloLink}>
                Ingresar
              </NavLink>
              <NavLink to="/register" className={estiloLink}>
                Registrarse
              </NavLink>
            </>
          )}
        </div>
      </nav>

      {/* Panel de administración: solo para admin */}
      {usuario?.role === "admin" && (
        <div className="bg-blue-800">
          <div className="mx-auto flex max-w-6xl flex-wrap gap-2 px-4 py-2 text-sm">
            <span className="mr-2 font-semibold text-blue-200">Panel admin:</span>
            {LINKS_ADMIN.map((link) => (
              <NavLink key={link.to} to={link.to} className={estiloLink}>
                {link.texto}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
