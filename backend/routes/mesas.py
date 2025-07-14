from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from config import get_db
from funciones.auth.dependencies import verificar_token
from funciones.cruds import mesas, list as mesas_queries
from models import MesaBase, MesaUpdate, MesaDelete, ListarMesas

router = APIRouter(
    prefix="/mesas",
    tags=["Mesas"],
    dependencies=[Depends(verificar_token)]
)

@router.post("/insertarmesas")
async def insertar(data: MesaBase, db: Session = Depends(get_db)):
    mesas.insertar_mesas(
        db, data.estado_de_disponibilidad, data.cant_personas, data.NIT, data.precio
    )

@router.get("/listar_mesa")
async def listar_mesa(data: ListarMesas, db: Session = Depends(get_db)):
    respuesta = mesas_queries.obtener_mesa(db, data.id_mesa)
    return {"respuesta": respuesta}

@router.get("/listar_mesas")
async def listar_mesas(db: Session = Depends(get_db)):
    respuesta = mesas_queries.obtener_mesas(db)
    return {"respuesta": respuesta}

@router.put("/editarmesas")
async def editar(data: MesaUpdate, db: Session = Depends(get_db)):
    mesas.editar_mesas(
        db,
        data.id_mesa,
        data.estado_de_disponibilidad,
        data.cant_personas,
        data.NIT,
        data.precio,
    )

@router.delete("/borrarmesas")
async def borrar(data: MesaDelete, db: Session = Depends(get_db)):
    mesas.borrar_mesas(db, data.id_mesa)
