from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from config import get_db
from funciones.auth.dependencies import verificar_token
from funciones.cruds import dueno, list as dueno_queries
from models import DuenoBase, DuenoUpdate, DuenoDelete, ListarDuenos

router = APIRouter(
    prefix="/dueno",
    tags=["Dueno"],
    dependencies=[Depends(verificar_token)]
)

@router.post("/insertardueno")
async def insertar(data: DuenoBase, db: Session = Depends(get_db)):
    dueno.insertar_dueno(
        db,
        data.documento,
        data.tipo_documento,
        data.nombre,
        data.apellido,
        data.id_rol,
        data.id_credencial,
    )

@router.get("/listar_dueno")
async def listar_dueno(data: ListarDuenos, db: Session = Depends(get_db)):
    respuesta = dueno_queries.obtener_dueno(db, data.documento)
    return {"respuesta": respuesta}

@router.get("/listar_duenos")
async def listar_duenos(db: Session = Depends(get_db)):
    respuesta = dueno_queries.obtener_duenos(db)
    return {"respuesta": respuesta}

@router.put("/editardueno")
async def editar(data: DuenoUpdate, db: Session = Depends(get_db)):
    dueno.editar_dueno(
        db,
        data.documento,
        data.nombre,
        data.apellido,
        data.id_rol,
        data.id_credencial,
    )

@router.delete("/borrardueno")
async def borrar(data: DuenoDelete, db: Session = Depends(get_db)):
    dueno.borrar_dueno(db, data.documento)
