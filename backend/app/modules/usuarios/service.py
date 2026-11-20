from fastapi import HTTPException, status

from app.modules.usuarios.models import Usuario
from app.modules.usuarios.schemas import UserPublic
from app.modules.usuarios.unit_of_work import UsuarioUnitOfWork


class UsuarioService:
    def __init__(self, uow: UsuarioUnitOfWork) -> None:
        self.uow = uow

    def _obtener_o_404(self, uow: UsuarioUnitOfWork, usuario_id: int) -> Usuario:
        usuario = uow.usuarios.get_by_id(usuario_id)
        if usuario is None:
            raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado")
        return usuario

    def listar(self) -> list[UserPublic]:
        with self.uow as uow:
            return [UserPublic.model_validate(u) for u in uow.usuarios.get_all_ordenados()]

    def activar(self, usuario_id: int) -> UserPublic:
        with self.uow as uow:
            usuario = self._obtener_o_404(uow, usuario_id)
            usuario.disabled = False
            return UserPublic.model_validate(uow.usuarios.add(usuario))

    def desactivar(self, usuario_id: int, admin_id: int) -> UserPublic:
        with self.uow as uow:
            usuario = self._obtener_o_404(uow, usuario_id)
            if usuario.id == admin_id:
                raise HTTPException(
                    status.HTTP_400_BAD_REQUEST,
                    detail="No podés desactivar tu propia cuenta",
                )
            usuario.disabled = True
            return UserPublic.model_validate(uow.usuarios.add(usuario))
