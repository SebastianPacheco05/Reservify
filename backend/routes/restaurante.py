from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from config import get_db
from funciones.auth.dependencies import verificar_token
from funciones.cruds import restaurante, list as restaurante_queries
from models import RestauranteBase, RestauranteUpdate, RestauranteDelete, ListarRestaurantes

router = APIRouter(
    prefix="/restaurante",
    tags=["Restaurante"],
    dependencies=[Depends(verificar_token)]
)

@router.post("/insertarrestaurante")
async def insertar(data: RestauranteBase, db: Session = Depends(get_db)):
    restaurante.insertar_restaurante(
        db,
        data.NIT,
        data.direccion,
        data.nombre_restaurante,
        data.descripcion_restaurante,
        data.horario_apertura,
        data.horario_cierre,
        data.documento,
    )

@router.get("/listar_restaurante")
async def listar_restaurante(data: ListarRestaurantes, db: Session = Depends(get_db)):
    respuesta = restaurante_queries.obtener_restaurante(db, data.nit)
    return {"respuesta": respuesta}

@router.get("/listar_restaurantes")
async def listar_restaurantes(db: Session = Depends(get_db)):
    respuesta = restaurante_queries.obtener_restaurantes(db)
    return {"respuesta": respuesta}

@router.put("/editarrestaurante")
async def editar(data: RestauranteUpdate, db: Session = Depends(get_db)):
    restaurante.editar_restaurante(
        db,
        data.NIT,
        data.direccion,
        data.nombre_restaurante,
        data.descripcion_restaurante,
        data.horario_apertura,
        data.horario_cierre,
        data.documento,
    )

@router.delete("/borrarrestaurante")
async def borrar(data: RestauranteDelete, db: Session = Depends(get_db)):
    restaurante.borrar_restaurante(db, data.nit)
