from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session
from config import get_db
from funciones.auth.login import login_usuario
from funciones.cruds import credenciales
from models import CredencialBase, CredencialUpdate, CredencialDelete, login

router = APIRouter()


@router.post("/login")
def login_user(input: login, request: Request, db: Session = Depends(get_db)):
    return login_usuario(db, input.email, input.password, request)

@router.put("/editarcredencial")
async def editarcredencial(data: CredencialUpdate, db: Session = Depends(get_db)):
    credenciales.editar_credenciales(db, data.id_credencial, data.email, data.password)

@router.delete("/borrarcredencial")
async def borrarcredencial(data: CredencialDelete, db: Session = Depends(get_db)):
    credenciales.borrar_credenciales(db, data.id_credencial)
