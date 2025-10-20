from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import text
from config import get_db
from funciones.auth.dependencies import verificar_token
from funciones.cruds import reserva, list as reserva_queries
from funciones.cruds.cliente_utils import obtener_documento_por_email
from models import ReservaBase, ReservaUpdate, ReservaDelete, ListarReservas

router = APIRouter(
    prefix="/reserva",
    tags=["Reserva"],
    dependencies=[Depends(verificar_token)]
)

# Router público para slots disponibles (no requiere autenticación)
public_router = APIRouter(
    prefix="/reserva",
    tags=["Reserva"]
)

@router.post("/insertarreserva")
async def insertar(data: ReservaBase, db: Session = Depends(get_db), current_user: dict = Depends(verificar_token)):
    # Obtener el documento del usuario autenticado usando su email
    documento_cliente = obtener_documento_por_email(db, current_user["email"])
    
    resultado = reserva.insertar_reserva(
        db, data.id_mesa, data.id_encab_fact, data.horario, data.fecha, documento_cliente
    )
    
    return resultado

@router.get("/listar_reserva")
async def listar_reserva(data: ListarReservas, db: Session = Depends(get_db)):
    respuesta = reserva_queries.obtener_reserva(db, data.id_reserva)
    return {"respuesta": respuesta}

@router.get("/listar_reservas")
async def listar_reservas(db: Session = Depends(get_db)):
    respuesta = reserva_queries.obtener_reservas(db)
    return {"respuesta": respuesta}

@router.put("/editarreserva")
async def editar(data: ReservaUpdate, db: Session = Depends(get_db), current_user: dict = Depends(verificar_token)):
    # Obtener el documento del usuario autenticado usando su email
    documento_cliente = obtener_documento_por_email(db, current_user["email"])
    
    reserva.editar_reserva(
        db,
        data.id_reserva,
        data.id_mesa,
        data.id_encab_fact,
        data.horario,
        data.fecha,
        documento_cliente,
    )

@router.delete("/borrarreserva")
async def borrar(data: ReservaDelete, db: Session = Depends(get_db)):
    reserva.borrar_reserva(db, data.id_reserva)

@router.put("/confirmar/{id_reserva}")
async def confirmar_reserva_endpoint(id_reserva: int, db: Session = Depends(get_db)):
    from funciones.cruds.reservation_status import confirmar_reserva
    try:
        resultado = confirmar_reserva(db, id_reserva)
        return {"message": "Reserva confirmada exitosamente", "success": resultado}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e

@public_router.get("/slots-disponibles")
async def obtener_slots_disponibles(
    nit: int = Query(..., description="NIT del restaurante"),
    fecha: str = Query(..., description="Fecha en formato YYYY-MM-DD"),
    db: Session = Depends(get_db)
):
    """Endpoint público para obtener slots de tiempo disponibles para un restaurante en una fecha específica"""
    try:
        # Consulta para obtener horarios disponibles basados en las mesas del restaurante
        # y excluyendo los horarios ya reservados
        query = text('''
            WITH horarios_base AS (
                SELECT DISTINCT 
                    CASE 
                        WHEN EXTRACT(hour FROM r.horario_apertura) < 12 THEN 
                            generate_series(
                                r.horario_apertura::time,
                                r.horario_cierre::time,
                                '30 minutes'::interval
                            )::time
                        ELSE 
                            generate_series(
                                r.horario_apertura::time,
                                r.horario_cierre::time,
                                '30 minutes'::interval
                            )::time
                    END as horario_disponible
                FROM "Restaurante" r
                WHERE r.nit = :nit
            ),
            horarios_reservados AS (
                SELECT DISTINCT res.horario::time as horario_ocupado
                FROM "Reserva" res
                INNER JOIN "Mesas" m ON res.id_mesa = m.id_mesa
                WHERE m.nit = :nit 
                AND res.fecha = :fecha::date
                AND res.estado_reserva IN ('pendiente', 'confirmada')
            )
            SELECT hb.horario_disponible::text as horario
            FROM horarios_base hb
            LEFT JOIN horarios_reservados hr ON hb.horario_disponible = hr.horario_ocupado
            WHERE hr.horario_ocupado IS NULL
            ORDER BY hb.horario_disponible
        ''')
        
        result = db.execute(query, {"nit": nit, "fecha": fecha})
        rows = result.fetchall()
        
        # Si no hay horarios disponibles, devolver horarios por defecto
        if not rows:
            return [
                "12:00:00", "12:30:00", "13:00:00", "13:30:00", "14:00:00",
                "20:00:00", "20:30:00", "21:00:00", "21:30:00", "22:00:00"
            ]
        
        return [row[0] for row in rows]
        
    except Exception:
        # En caso de error, devolver horarios por defecto
        return [
            "12:00:00", "12:30:00", "13:00:00", "13:30:00", "14:00:00",
            "20:00:00", "20:30:00", "21:00:00", "21:30:00", "22:00:00"
        ]
