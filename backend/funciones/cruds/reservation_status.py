from sqlalchemy.orm import Session
from sqlalchemy import text
from fastapi import HTTPException


def actualizar_estado_reserva(db: Session, id_reserva: int, nuevo_estado: str) -> bool:
    """
    Actualiza el estado de una reserva.
    
    Args:
        db: Sesión de base de datos
        id_reserva: ID de la reserva a actualizar
        nuevo_estado: Nuevo estado de la reserva
        
    Returns:
        bool: True si se actualizó correctamente
        
    Raises:
        HTTPException: Si hay error en la actualización
    """
    try:
        resultado = db.execute(
            text("SELECT update_reservation_status(:id_reserva, :nuevo_estado)"),
            {
                "id_reserva": id_reserva,
                "nuevo_estado": nuevo_estado
            }
        ).scalar()
        
        if resultado:
            db.commit()
            return True
        else:
            raise HTTPException(
                status_code=404,
                detail=f"No se pudo actualizar la reserva con ID {id_reserva}"
            )
            
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Error al actualizar el estado de la reserva: {str(e)}"
        )


def confirmar_reserva(db: Session, id_reserva: int) -> bool:
    """
    Confirma una reserva cambiando su estado de 'pendiente' a 'confirmada'.
    
    Args:
        db: Sesión de base de datos
        id_reserva: ID de la reserva a confirmar
        
    Returns:
        bool: True si se confirmó correctamente
    """
    return actualizar_estado_reserva(db, id_reserva, "confirmada")
