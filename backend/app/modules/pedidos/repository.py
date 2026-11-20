from collections.abc import Sequence

from sqlmodel import Session, col, func, select

from app.core.base_repository import BaseRepository
from app.modules.pedidos.models import Pedido


class PedidoRepository(BaseRepository[Pedido]):
    def __init__(self, session: Session) -> None:
        super().__init__(session, Pedido)

    def list_by_usuario(
        self,
        usuario_id: int | None,
        skip: int,
        limit: int,
        estado: str | None = None,
    ) -> tuple[int, Sequence[Pedido]]:
        query = select(Pedido)
        if usuario_id is not None:
            query = query.where(Pedido.usuario_id == usuario_id)
        if estado is not None:
            query = query.where(Pedido.estado == estado)

        total = self.session.exec(select(func.count()).select_from(query.subquery())).one()
        # Los más nuevos primero
        items = self.session.exec(query.order_by(col(Pedido.id).desc()).offset(skip).limit(limit)).all()
        return total, items

    def count_by_estado(self, estado: str) -> int:
        return self.session.exec(
            select(func.count()).select_from(Pedido).where(Pedido.estado == estado)
        ).one()

    def count_hoy(self) -> int:
        return self.session.exec(
            select(func.count()).select_from(Pedido).where(Pedido.created_at >= func.current_date())
        ).one()

    def sum_total_by_estado(self, estado: str) -> float:
        suma = self.session.exec(
            select(func.coalesce(func.sum(Pedido.total), 0)).where(Pedido.estado == estado)
        ).one()
        return float(suma)
