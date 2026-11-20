# Food Store — Trabajo Práctico Integrador

**Programación IV · Tecnicatura Universitaria en Programación a Distancia (UTN)**

Alumno: **Matías Farfán**

Aplicación de pedidos de comida: los clientes navegan el catálogo, arman el carrito y confirman pedidos.
El administrador gestiona categorías, productos, stock, pedidos y usuarios, y ve un resumen del negocio.

- **Repositorio:** https://github.com/matfarfan/food-store-tpi
- **Video de demostración:** _(completar con el link público del video)_

---

## Tecnologías

| Parte | Stack |
|---|---|
| Backend | Python, FastAPI, SQLModel, PostgreSQL, JWT en cookie HttpOnly (python-jose + passlib/bcrypt), pydantic-settings |
| Frontend | React 19 + TypeScript (strict), Vite, Tailwind CSS 4, TanStack Query / Form / Table, React Router 7, Zustand, Axios, pnpm |

Las versiones exactas están fijadas en `backend/requirements.txt` y `frontend/package.json`.

## Requisitos

- **Python** 3.11, 3.12 o 3.13
- **Node.js** 20.19 o superior (o 22.12 o superior)
- **pnpm** 9 o superior (`npm install -g pnpm`)
- **PostgreSQL** (con pgAdmin o `psql` para crear la base)
- **Git**

## Estructura

```
food-store-tpi/
├── backend/     API REST con FastAPI (app/core, app/modules, app/db/seed.py)
├── frontend/    SPA con React + TypeScript (src/features, src/shared, src/store, src/routes)
└── README.md
```

---

## Puesta en marcha

### 1. Clonar el repositorio

```bash
git clone https://github.com/matfarfan/food-store-tpi.git
cd food-store-tpi
```

### 2. Crear la base de datos

En PostgreSQL, crear una base vacía llamada `foodstore_db` (desde pgAdmin: *Databases → Create → Database*, o por consola):

```bash
createdb -U postgres foodstore_db
```

Las tablas **no se crean a mano**: las crea la aplicación al iniciar (y también el seed).

### 3. Backend

Desde la carpeta `backend/`:

```bash
cd backend

# Entorno virtual
python -m venv .venv
# Activarlo:
#   Windows (PowerShell):  .venv\Scripts\Activate.ps1
#   Linux / macOS:         source .venv/bin/activate

# Dependencias
pip install -r requirements.txt

# Variables de entorno: copiar el ejemplo y completar la contraseña de PostgreSQL
#   Windows:        copy .env.example .env
#   Linux / macOS:  cp .env.example .env

# Datos iniciales (admin, categorías y productos). Se puede ejecutar más de una vez.
python -m app.db.seed

# Servidor
uvicorn app.main:app --reload
```

- Verificación rápida: http://localhost:8000/health responde `{"status": "ok"}`
- Todos los endpoints de la API están bajo el prefijo `/api/v1` (por ejemplo, http://localhost:8000/api/v1/productos)
- Documentación Swagger: http://localhost:8000/docs (y ReDoc en http://localhost:8000/redoc)
- `backend/api.http` tiene todas las peticiones de prueba para la extensión REST Client de VS Code.

### 4. Frontend

En **otra terminal**, desde la carpeta `frontend/` (con el backend corriendo):

```bash
cd frontend

# Variables de entorno
#   Windows:        copy .env.example .env
#   Linux / macOS:  cp .env.example .env

pnpm install
pnpm dev
```

Abrir http://localhost:5173

Para generar la versión de producción: `pnpm build`.

---

## Variables de entorno

### `backend/.env`

| Variable | Descripción | Ejemplo |
|---|---|---|
| `DATABASE_URL` | Conexión a PostgreSQL | `postgresql://postgres:TU_CONTRASEÑA@localhost:5432/foodstore_db` |
| `SECRET_KEY` | Clave para firmar el JWT (mínimo 32 caracteres) | generar con `python -c "import secrets; print(secrets.token_urlsafe(48))"` |
| `ALGORITHM` | Algoritmo del JWT | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Duración de la sesión | `30` |
| `FRONTEND_ORIGIN` | Origen del frontend permitido por CORS | `http://localhost:5173` |

Para desarrollo sin PostgreSQL, el `.env.example` incluye comentada la alternativa SQLite
(`DATABASE_URL=sqlite:///./foodstore.db`).

### `frontend/.env`

| Variable | Descripción | Ejemplo |
|---|---|---|
| `VITE_API_URL` | URL base de la API, con el prefijo `/api/v1` | `http://localhost:8000/api/v1` |

---

## Usuario administrador (seed)

| Usuario | Contraseña | Rol |
|---|---|---|
| `admin` | `Admin1234!` | admin |

Los clientes se crean desde la pantalla **Registrarse** (rol `user`).
El seed también carga 4 categorías y 10 productos con stock.

---

## Funcionalidades

**Cliente:** registro e inicio de sesión · catálogo con búsqueda, filtro por categoría y paginación ·
carrito persistente · checkout con dirección y forma de pago · mis pedidos con detalle y cancelación
(solo en estado PENDIENTE, con devolución del stock).

**Administrador:** resumen con indicadores · ABM de categorías y productos (con cambio de stock y
disponibilidad) · gestión de pedidos según la máquina de estados
(PENDIENTE → EN_PREPARACION → ENTREGADO, o CANCELADO desde un estado no terminal) ·
activar y desactivar usuarios.

## Notas

- En el código se usaron **docstrings** de forma puntual para facilitar la comprensión de algunas
  clases y funciones.
