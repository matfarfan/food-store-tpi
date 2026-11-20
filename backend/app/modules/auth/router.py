from typing import Annotated

from fastapi import APIRouter, Depends, Response, status
from fastapi.security import OAuth2PasswordRequestForm

from app.core.config import settings
from app.core.database import session_factory
from app.core.deps import get_current_active_user
from app.modules.auth.schemas import MensajeResponse
from app.modules.auth.service import AuthService
from app.modules.usuarios.schemas import UserCreate, UserPublic
from app.modules.usuarios.unit_of_work import UsuarioUnitOfWork

router = APIRouter(prefix="/auth", tags=["auth"])


def get_auth_service() -> AuthService:
    return AuthService(UsuarioUnitOfWork(session_factory))


AuthServiceDep = Annotated[AuthService, Depends(get_auth_service)]


@router.post("/register", response_model=UserPublic, status_code=status.HTTP_201_CREATED)
def register(data: UserCreate, service: AuthServiceDep):
    return service.registrar(data)


@router.post("/token", response_model=MensajeResponse)
def login(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    response: Response,
    service: AuthServiceDep,
):
    token = service.autenticar(form_data.username, form_data.password)
    # El JWT viaja en una cookie HttpOnly: JavaScript no puede leerla
    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,  # igual que el exp del JWT
        samesite="lax",
        secure=False,  # en producción con HTTPS: True
    )
    return {"message": "Login exitoso"}


@router.post("/logout", response_model=MensajeResponse)
def logout(response: Response):
    response.delete_cookie(key="access_token", httponly=True, samesite="lax", secure=False)
    return {"message": "Sesión cerrada"}


@router.get("/me", response_model=UserPublic)
def read_me(current_user: Annotated[UserPublic, Depends(get_current_active_user)]):
    return current_user
