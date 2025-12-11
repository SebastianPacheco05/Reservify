from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from config import get_db
from funciones.reservar.enc_fac_reserva import registrar_factura_y_reserva
from models import FacturaReservaSchema
from funciones.auth.dependencies import verificar_token

router = APIRouter(prefix="/facturas", tags=["Facturas y Reservas"], dependencies=[Depends(verificar_token)])


@router.post("/reservar")
def registrar_factura_y_reserva_endpoint(
    data: FacturaReservaSchema, db: Session = Depends(get_db)
):
    try:
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
