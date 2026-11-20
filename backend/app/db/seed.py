from sqlmodel import Session, select

from app.core.database import create_all_tables, engine
from app.core.security import hash_password
from app.modules.categorias.models import Categoria
from app.modules.productos.models import Producto
from app.modules.usuarios.models import Usuario

USUARIOS = [
    {
        "username": "admin",
        "full_name": "Administrador",
        "email": "admin@foodstore.com",
        "password": "Admin1234!",
        "role": "admin",
    },
]


CATEGORIAS = [
    {"nombre": "Pizzas", "descripcion": "Pizzas a la piedra"},
    {"nombre": "Hamburguesas", "descripcion": "Con papas fritas"},
    {"nombre": "Empanadas", "descripcion": "Al horno o fritas"},
    {"nombre": "Bebidas", "descripcion": "Frías y sin alcohol"},
]


def imagen(texto: str) -> str:
    return f"https://placehold.co/400x300?text={texto}"


# (nombre, categoría, precio, stock, descripción)
PRODUCTOS = [
    ("Pizza muzzarella", "Pizzas", 9500, 20, "Salsa de tomate, muzzarella y aceitunas"),
    ("Pizza napolitana", "Pizzas", 10500, 15, "Muzzarella, tomate en rodajas y ajo"),
    ("Pizza fugazzeta", "Pizzas", 11000, 10, "Muzzarella y cebolla"),
    ("Hamburguesa clásica", "Hamburguesas", 8500, 25, "Carne, lechuga, tomate y queso"),
    ("Hamburguesa doble cheddar", "Hamburguesas", 11500, 12, "Doble carne y doble cheddar"),
    ("Empanada de carne", "Empanadas", 1500, 60, "Carne cortada a cuchillo"),
    ("Empanada de jamón y queso", "Empanadas", 1400, 50, "Jamón cocido y muzzarella"),
    ("Empanada de humita", "Empanadas", 1400, 40, "Choclo cremoso"),
    ("Gaseosa 1,5 L", "Bebidas", 3500, 30, "Línea cola"),
    ("Agua mineral 500 ml", "Bebidas", 1500, 40, "Sin gas"),
]


def cargar_categorias(session: Session) -> dict[str, Categoria]:
    categorias: dict[str, Categoria] = {}
    for data in CATEGORIAS:
        categoria = session.exec(select(Categoria).where(Categoria.nombre == data["nombre"])).first()
        if categoria:
            print(f"  [=] Categoría ya existe: {data['nombre']}")
        else:
            categoria = Categoria(**data)
            session.add(categoria)
            session.flush()  # genera el id para usarlo en los productos
            print(f"  [+] Categoría creada: {data['nombre']}")
        categorias[data["nombre"]] = categoria
    return categorias


def cargar_productos(session: Session, categorias: dict[str, Categoria]) -> None:
    for nombre, categoria, precio, stock, descripcion in PRODUCTOS:
        if session.exec(select(Producto).where(Producto.nombre == nombre)).first():
            print(f"  [=] Producto ya existe: {nombre}")
            continue
        session.add(
            Producto(
                nombre=nombre,
                descripcion=descripcion,
                precio_base=precio,
                stock=stock,
                imagen_url=imagen(nombre.split()[0]),
                categoria_id=categorias[categoria].id,
            )
        )
        print(f"  [+] Producto creado: {nombre} (stock {stock})")


def cargar_usuarios(session: Session) -> None:
    for data in USUARIOS:
        existe = session.exec(select(Usuario).where(Usuario.username == data["username"])).first()
        if existe:
            print(f"  [=] Usuario ya existe: {data['username']}")
            continue
        session.add(
            Usuario(
                username=data["username"],
                full_name=data["full_name"],
                email=data["email"],
                hashed_password=hash_password(data["password"]),
                role=data["role"],
            )
        )
        print(f"  [+] Usuario creado: {data['username']} / {data['password']} ({data['role']})")


def run() -> None:
    print("=== Seed Food Store ===")
    create_all_tables()
    with Session(engine) as session:
        cargar_usuarios(session)
        categorias = cargar_categorias(session)
        cargar_productos(session, categorias)
        session.commit()
    print("Listo.")


if __name__ == "__main__":
    run()
