from fastapi import APIRouter
from sqlalchemy.orm import Session
from fastapi import Depends
from config import get_db
from models import RegistrarCliente
from funciones.register.register import registrar_cliente

router = APIRouter(
    prefix="/register",
    tags=["Register"],
            
)

@router.post("/register")
def register(data: RegistrarCliente, db: Session = Depends(get_db)):
    return registrar_cliente(db, data.email, data.password, data.nombre, data.apellido, data.tipo_documento, data.documento, data.nacionalidad, data.telefono, data.id_rol)
