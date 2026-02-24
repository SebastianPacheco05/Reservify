from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from datetime import datetime
from config import get_db
from functions.reservar.enc_fac_reserva import registrar_factura_y_reserva
from models import FacturaReservaSchema
from functions.auth.dependencies import verificar_token

router = APIRouter(prefix="/facturas", tags=["Facturas y Reservas"], dependencies=[Depends(verificar_token)])


@router.post("/reservar")
def registrar_factura_y_reserva_endpoint(
    data: FacturaReservaSchema, db: Session = Depends(get_db)
):
    try:
        # Validar antelación mínima del restaurante antes de registrar la reserva
        row = db.execute(
            text('SELECT min_anticipacion_horas FROM "Restaurante" WHERE nit = :nit'),
            {"nit": data.p_nit},
        ).fetchone()
        min_anticipacion_horas = int(row[0]) if row and row[0] is not None else 0
        if min_anticipacion_horas > 0:
            # Construir datetime de la reserva (fecha + hora)
            try:
                reserva_dt = datetime.fromisoformat(f"{data.p_fecha}T{data.p_horario}")
            except Exception:
                raise HTTPException(status_code=400, detail="Fecha u horario de reserva inválidos")
            ahora = datetime.now(reserva_dt.tzinfo) if reserva_dt.tzinfo else datetime.now()
            diff_hours = (reserva_dt - ahora).total_seconds() / 3600
            if diff_hours < min_anticipacion_horas:
                raise HTTPException(
                    status_code=400,
                    detail=(
                        "No es posible reservar con tan poca antelación. "
                        f"Este restaurante requiere al menos {min_anticipacion_horas} horas de antelación."
                    ),
                )

        id_encab_fact = registrar_factura_y_reserva(
            db,
            data.p_nit,
            data.p_nombre_restaurante,
            data.p_direccion,
            data.p_ciudad,
            data.p_email_cliente,
            data.p_id_mesa,
            data.p_num_comensales,
            data.p_horario,
            data.p_fecha,
            data.p_forma_pago,
            data.p_precio_total,
        )
        return {"id_encab_fact": id_encab_fact}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e
