from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from config import get_db
from funciones.cruds import mesas, list as mesas_queries
from models import MesaBase, MesaUpdate, MesaDelete, ListarMesas

router = APIRouter(
    prefix="/mesas",
    tags=["Mesas"]
)

@router.get("/restaurante/{nit}")
async def obtener_mesas_por_restaurante(nit: int, db: Session = Depends(get_db)):
    """Endpoint público para obtener las mesas de un restaurante por NIT"""
    try:
        query = text('''
            SELECT 
                id_mesa,
                estado_de_disponibilidad,
                cant_personas,
                precio,
                "nit" as nit
            FROM "Mesas"
            WHERE "nit" = :nit
        ''')
        result = db.execute(query, {"nit": nit})
        rows = result.fetchall()

        return [
            {
                "id_mesa": row[0],
                "estado_de_disponibilidad": row[1],
                "cant_personas": row[2],
                "precio": float(row[3]) if row[3] else 0.0,
                "nit": row[4]
            }
            for row in rows
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener mesas: {str(e)}")

@router.post("/insertarmesas")
async def insertar(data: MesaBase, db: Session = Depends(get_db)):
    mesas.insertar_mesas(
        db, data.estado_de_disponibilidad, data.cant_personas, data.nit, data.precio
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
        data.nit,
        data.precio,
    )

@router.delete("/borrarmesas")
async def borrar(data: MesaDelete, db: Session = Depends(get_db)):
    mesas.borrar_mesas(db, data.id_mesa)
