from sqlalchemy.orm import Session
from sqlalchemy import text
from fastapi import HTTPException
from sqlalchemy.exc import IntegrityError, SQLAlchemyError


def insertar_reserva(
    db: Session,
    id_mesa: int,
    id_cliente: int,
    id_encab_fact: int,
    horario: str,
    fecha: str,
):
    try:
        db.execute(
            text(
                "SELECT insertar_reserva(:id_mesa, :id_cliente, :id_encab_fact, :horario, :fecha)"
            ),
            {
                "id_mesa": id_mesa,
                "id_cliente": id_cliente,
                "id_encab_fact": id_encab_fact,
                "horario": horario,
                "fecha": fecha,
            },
        )
        db.commit()
        raise HTTPException(status_code=201, detail="Reserva insertada correctamente")
    except IntegrityError as e:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail=f"Error de integridad al insertar la reserva: {str(e)}",
        )
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Error de base de datos al insertar la reserva: {str(e)}",
        )


def editar_reserva(
    db: Session,
    id_reserva: int,
    id_mesa: int,
    id_cliente: int,
    id_encab_fact: int,
    horario: str,
    fecha: str,
):
    try:
        db.execute(
            text(
                "SELECT editar_reserva(:id_reserva, :id_mesa, :id_cliente, :id_encab_fact, :horario, :fecha)"
            ),
            {
                "id_reserva": id_reserva,
                "id_mesa": id_mesa,
                "id_cliente": id_cliente,
                "id_encab_fact": id_encab_fact,
                "horario": horario,
                "fecha": fecha,
            },
        )
        db.commit()
        raise HTTPException(status_code=200, detail="Reserva editada correctamente")
    except IntegrityError as e:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail=f"Error de integridad al editar la reserva: {str(e)}",
        )
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Error de base de datos al editar la reserva: {str(e)}",
        )


def borrar_reserva(db: Session, id_reserva: int):
    try:
        db.execute(
            text("SELECT borrar_reserva(:id_reserva)"), {"id_reserva": id_reserva}
        )
        db.commit()
        raise HTTPException(status_code=200, detail="Reserva eliminada correctamente")
    except IntegrityError as e:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail=f"Error de integridad al borrar la reserva: {str(e)}",
        )
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Error de base de datos al borrar la reserva: {str(e)}",
        )
