from typing import Self

from app.core.base_repository import BaseRepository
from app.core.unit_of_work import UnitOfWork
from app.modules.pedidos.models import DetallePedido
from app.modules.pedidos.repository import PedidoRepository
from app.modules.productos.repository import ProductoRepository


class PedidoUnitOfWork(UnitOfWork):

    def __enter__(self) -> Self:
        super().__enter__()
        self.pedidos = PedidoRepository(self.session)
        self.detalles = BaseRepository(self.session, DetallePedido)
        self.productos = ProductoRepository(self.session)
        return self
