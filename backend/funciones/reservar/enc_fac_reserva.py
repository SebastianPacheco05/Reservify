from sqlalchemy import text
from sqlalchemy.orm import Session
from funciones.cruds.cliente_utils import obtener_documento_por_email

def registrar_factura_y_reserva(
    db: Session,
    p_nit: int,
    p_nombre_restaurante: str,
    p_direccion: str,
    p_ciudad: str,
    p_email_cliente: str,
    p_id_mesa: int,
    p_num_comensales: int,
    p_horario: str,
    p_fecha: str,
    p_forma_pago: str,
    p_precio_total: float
):
    # Obtener el documento del cliente usando su email
    p_documento_cliente = obtener_documento_por_email(db, p_email_cliente)
    
    query = text("""
        SELECT registrar_factura_y_reserva(
            :p_nit,
            :p_nombre_restaurante,
            :p_direccion,
            :p_ciudad,
            :p_documento_cliente,
            :p_id_mesa,
            :p_num_comensales,
            :p_horario,
            :p_fecha,
            :p_forma_pago,
            :p_precio_total
        ) AS id_encab_fact;
    """)

    result = db.execute(query, {
        "p_nit": p_nit,
        "p_nombre_restaurante": p_nombre_restaurante,
        "p_direccion": p_direccion,
        "p_ciudad": p_ciudad,
        "p_documento_cliente": p_documento_cliente,
        "p_id_mesa": p_id_mesa,
        "p_num_comensales": p_num_comensales,
        "p_horario": p_horario,
        "p_fecha": p_fecha,
        "p_forma_pago": p_forma_pago,
        "p_precio_total": p_precio_total
    })

    db.commit()
    id_encab_fact = result.scalar()
    return id_encab_fact
