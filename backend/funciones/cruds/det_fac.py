from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import List
from fastapi import HTTPException
from sqlalchemy.exc import IntegrityError, SQLAlchemyError


def insertar_det_fac(
    db: Session,
    descripcion: List[str],
    unidades: List[int],
    precio_unitario: List[float],
    precio_total: float,
    forma_pago: str,
    id_encab_fact: int,
):
    try:
        db.execute(
            text(
                """
                SELECT insertar_detalle_factura(
                    :descripcion,
                    :unidades,
                    :precio_unitario,
                    :precio_total,
                    :forma_pago,
                    :id_encab_fact
                )
                """
            ),
            {
                "descripcion": descripcion,
                "unidades": unidades,
                "precio_unitario": precio_unitario,
                "precio_total": precio_total,
                "forma_pago": forma_pago,
                "id_encab_fact": id_encab_fact,
            },
        )
        db.commit()
        raise HTTPException(
            status_code=201, detail="Detalle de factura insertado correctamente"
        )
    except IntegrityError as e:
        db.rollback()
        raise HTTPException(
            status_code=400, detail=f"Error al insertar detalle de factura: {str(e)}"
        )
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Error de base de datos al insertar detalle de factura: {str(e)}",
        )


def editar_det_fac(
    db: Session,
    id_det_fact: int,
    descripcion: List[str],
    unidades: List[int],
    precio_unitario: List[float],
    precio_total: float,
    forma_pago: str,
    id_encab_fact: int,
):
    try:
        db.execute(
            text(
                """
                SELECT editar_detalle_factura(
                    :id_det_fact,
                    :descripcion,
                    :unidades,
                    :precio_unitario,
                    :precio_total,
                    :forma_pago,
                    :id_encab_fact
                )
                """
            ),
            {
                "id_det_fact": id_det_fact,
                "descripcion": descripcion,
                "unidades": unidades,
                "precio_unitario": precio_unitario,
                "precio_total": precio_total,
                "forma_pago": forma_pago,
                "id_encab_fact": id_encab_fact,
            },
        )
        db.commit()
        raise HTTPException(
            status_code=200, detail="Detalle de la factura editado correctamente"
        )

    except IntegrityError as e:
        db.rollback()
        raise HTTPException(
            status_code=400, detail=f"Error al insertar detalle de factura: {str(e)}"
        )
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Error de base de datos al insertar detalle de factura: {str(e)}",
        )


def borrar_det_fac(db: Session, id_det_fact: int):
    try:
        db.execute(
            text("SELECT borrar_detalle_factura(:id_det_fact)"),
            {"id_det_fact": id_det_fact},
        )
        db.commit()
        raise HTTPException(
            status_code=200, detail="Detalle de la factura eliminada correctamente"
        )
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=500, detail=f"Error de base de datos al borrar: {str(e)}"
        )
