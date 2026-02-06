from fastapi import APIRouter, Depends, Request, HTTPException
from sqlalchemy.orm import Session
from config import get_db
from funciones.auth.login import login_usuario, renovar_token
from funciones.auth.get_user_role import obtener_rol_usuario
from funciones.auth.dependencies import verificar_token
from funciones.cruds import credenciales
from models import CredencialBase, CredencialUpdate, CredencialDelete, login, RefreshTokenRequest

router = APIRouter()


@router.post("/login")
def login_user(input: login, request: Request, db: Session = Depends(get_db)):
    return login_usuario(db, input.email, input.password, request)


@router.post("/refresh")
def refresh_access_token(input: RefreshTokenRequest, request: Request, db: Session = Depends(get_db)):
    """
    Endpoint para renovar el access token usando un refresh token válido
    """
    return renovar_token(db, input.refresh_token, request)


@router.get("/me/role")
def get_current_user_role(
    current_user: dict = Depends(verificar_token),
    db: Session = Depends(get_db)
):
    """
    Obtiene el rol del usuario actual basado en su token.
    Solo accesible para usuarios autenticados.
    """
    id_credencial = current_user.get("id")
    if not id_credencial:
        raise HTTPException(status_code=401, detail="Token inválido")
    
    rol_info = obtener_rol_usuario(db, id_credencial)
    if not rol_info:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    return rol_info


@router.put("/editarcredencial")
async def editarcredencial(data: CredencialUpdate, db: Session = Depends(get_db)):
    credenciales.editar_credenciales(db, data.id_credencial, data.email, data.password)

@router.delete("/borrarcredencial")
async def borrarcredencial(data: CredencialDelete, db: Session = Depends(get_db)):
    credenciales.borrar_credenciales(db, data.id_credencial)
