from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from config import get_db
from funciones.auth.dependencies import verificar_token
from funciones.cruds import reserva, list as reserva_queries
from models import ReservaBase, ReservaUpdate, ReservaDelete, ListarReservas

router = APIRouter(
    prefix="/reserva",
    tags=["Reserva"],
    dependencies=[Depends(verificar_token)]
)

@router.post("/insertarreserva")
async def insertar(data: ReservaBase, db: Session = Depends(get_db)):
    reserva.insertar_reserva(
        db, data.id_mesa, data.documento, data.id_encab_fact, data.horario, data.fecha
    )

@router.get("/listar_reserva")
async def listar_reserva(data: ListarReservas, db: Session = Depends(get_db)):
    respuesta = reserva_queries.obtener_reserva(db, data.id_reserva)
    return {"respuesta": respuesta}

@router.get("/listar_reservas")
async def listar_reservas(db: Session = Depends(get_db)):
    respuesta = reserva_queries.obtener_reservas(db)
    return {"respuesta": respuesta}

@router.put("/editarreserva")
async def editar(data: ReservaUpdate, db: Session = Depends(get_db)):
    reserva.editar_reserva(
        db,
        data.id_reserva,
        data.id_mesa,
        data.documento,
        data.id_encab_fact,
        data.horario,
        data.fecha,
    )

@router.delete("/borrarreserva")
async def borrar(data: ReservaDelete, db: Session = Depends(get_db)):
    reserva.borrar_reserva(db, data.id_reserva)
