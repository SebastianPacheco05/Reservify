from fastapi import Depends, APIRouter
from sqlalchemy.orm import Session  
from Cruds import credenciales
from models import *
from main import get_db


router = APIRouter()

@router.post("/insertarcredencial")
def insertar(data: CredencialBase, db: Session = Depends(get_db)):
    credenciales.insertar_credenciales(db, data.email, data.password)
    return {"message": "Credenciales insertadas correctamente"}

@router.post("/editarcredencial")
def editar(data: CredencialUpdate, db: Session = Depends(get_db)):
    credenciales.editar_credenciales(db, data.id_credencial, data.email, data.password)
    return {"message": "Credenciales actualizadas correctamente"}

@router.post("/borrarcredencial")
def borrar(data: CredencialDelete, db: Session = Depends(get_db)):
    credenciales.borrar_credenciales(db, data.id_credencial)
    return {"message": "Credenciales eliminadas correctamente"}