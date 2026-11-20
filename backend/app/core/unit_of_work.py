"""Unit of Work base: único lugar del proyecto que hace commit y rollback."""

from collections.abc import Callable
from typing import Self

from sqlmodel import Session


class UnitOfWork:
    def __init__(self, session_factory: Callable[[], Session]) -> None:
        self.session_factory = session_factory

    def __enter__(self) -> Self:
        self.session = self.session_factory()
        return self

    def __exit__(self, exc_type, exc_val, exc_tb) -> None:
        try:
            if exc_type:
                self.session.rollback()  # hubo excepción: no se guarda nada
            else:
                self.session.commit()  # todo salió bien: se confirma
        finally:
            self.session.close()
        # No devuelve True: la excepción sigue su camino hasta el Router
