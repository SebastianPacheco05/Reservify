from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.credenciales import CredencialCreate, CredencialUpdate, CredencialDelete
from app.crud.credenciales import insertar_credencial, editar_credencial, borrar_credencial

router = APIRouter(prefix="/credenciales", tags=["Credenciales"])

@router.post("/")
def crear(credencial: CredencialCreate, db: Session = Depends(get_db)):
    insertar_credencial(db, credencial.email, credencial.password)
    return {"message": "Credencial creada"}

@router.put("/")
def actualizar(credencial: CredencialUpdate, db: Session = Depends(get_db)):
    editar_credencial(db, credencial.id_credencial, credencial.email, credencial.password)
    return {"message": "Credencial actualizada"}

@router.delete("/")
def eliminar(credencial: CredencialDelete, db: Session = Depends(get_db)):
    borrar_credencial(db, credencial.id_credencial)
    return {"message": "Credencial eliminada"}
