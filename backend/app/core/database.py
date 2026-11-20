"""Engine, creación de tablas y fábrica de sesiones."""

from sqlmodel import Session, SQLModel, create_engine

from app.core.config import settings

engine = create_engine(settings.DATABASE_URL, echo=False)


def create_all_tables() -> None:
    """Crea las tablas que todavía no existen.

    Los modelos se importan acá adentro para que SQLModel los registre
    en su metadata antes de llamar a create_all.
    """
    import app.modules.categorias.models  # noqa: F401
    import app.modules.pedidos.models  # noqa: F401
    import app.modules.productos.models  # noqa: F401
    import app.modules.usuarios.models  # noqa: F401

    SQLModel.metadata.create_all(engine)


def session_factory() -> Session:
    """La usa el Unit of Work para abrir una sesión nueva en cada operación."""
    return Session(engine)
