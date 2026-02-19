from fastapi import APIRouter, Depends, Request, HTTPException
from sqlalchemy.orm import Session
from config import get_db
from functions.auth.login import login_usuario, renovar_token
from functions.auth.get_user_role import obtener_rol_usuario
from functions.auth.dependencies import verificar_token
from functions.cruds import credenciales, list as credenciales_queries
from models import CredencialBase, CredencialUpdate, CredencialDelete, LoginSchema, RefreshTokenRequest

router = APIRouter()


@router.post("/login")
def login_user(input: LoginSchema, request: Request, db: Session = Depends(get_db)):
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
async def editarcredencial(
    data: CredencialUpdate,
    usuario_actual: dict = Depends(verificar_token),
    db: Session = Depends(get_db),
):
    if usuario_actual.get("id") != data.id_credencial:
        raise HTTPException(status_code=403, detail="Solo puede editar sus propias credenciales")
    password_final = data.password
    if password_final is None or (isinstance(password_final, str) and password_final.strip() == ""):
        # No cambiar contraseña: obtener la actual
        from sqlalchemy import text
        row = db.execute(
            text('SELECT password FROM "Credenciales" WHERE id_credencial = :id'),
            {"id": data.id_credencial},
        ).fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Credencial no encontrada")
        password_final = row[0]
    else:
        password_final = credenciales.hash_password(password_final)
    credenciales.editar_credenciales(db, data.id_credencial, data.email, password_final)

@router.delete("/borrarcredencial")
async def borrarcredencial(data: CredencialDelete, db: Session = Depends(get_db)):
    credenciales.borrar_credenciales(db, data.id_credencial)
