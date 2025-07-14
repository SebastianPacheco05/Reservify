from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from config import get_db
from funciones.auth.dependencies import verificar_token
from funciones.cruds import cal_mensuales, list as cal_mensuales_queries
from models import CalculoMensualBase, CalculoMensualUpdate, CalculoMensualDelete, ListarCalculoMensual

router = APIRouter(
    prefix="/calculos_mensuales",
    tags=["CalculosMensuales"],
    dependencies=[Depends(verificar_token)]
)

@router.post("/insertar_calculo_mensual")
async def insertar(data: CalculoMensualBase, db: Session = Depends(get_db)):
    cal_mensuales.insertar_calculo_mensual(
        db,
        data.nit,
        data.mes,
        data.anio,
        data.total_reservas,
        data.revenue,
        data.total_clientes,
    )

@router.put("/editar_calculo_mensual")
async def editar(data: CalculoMensualUpdate, db: Session = Depends(get_db)):
    cal_mensuales.editar_calculo_mensual(
        db,
        data.id_calculo,
        data.nit,
        data.mes,
        data.anio,
        data.total_reservas,
        data.revenue,
        data.total_clientes,
    )

@router.delete("/borrar_calculo_mensual")
async def borrar(data: CalculoMensualDelete, db: Session = Depends(get_db)):
    cal_mensuales.borrar_calculo_mensual(db, data.id_calculo)

@router.get("/listar_calculo_mensual")
async def listar_calculo_mensual(
    data: ListarCalculoMensual, db: Session = Depends(get_db)
):
    respuesta = cal_mensuales_queries.obtener_calculo_mensual(db, data.id_calculo)
    return {"respuesta": respuesta}

@router.get("/listar_calculos_mensuales")
async def listar_calculos_mensuales(db: Session = Depends(get_db)):
    respuesta = cal_mensuales_queries.obtener_calculos_mensuales(db)
    return {"respuesta": respuesta}
