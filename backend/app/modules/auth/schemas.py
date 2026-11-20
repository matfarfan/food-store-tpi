from sqlmodel import SQLModel


class MensajeResponse(SQLModel):
    """Respuesta del login y del logout. El token NUNCA va en el cuerpo."""

    message: str
