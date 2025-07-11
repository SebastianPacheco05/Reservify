from sqlalchemy.orm import Session
from sqlalchemy import text
from fastapi import HTTPException
from sqlalchemy.exc import IntegrityError, SQLAlchemyError


def insertar_enc_fac(
    db: Session,
    NIT: int,
    nombre_restaurante: str,
    direccion: str,
    ciudad: str,
    fecha: str,
    documento: str,
):
    try:
        db.execute(
            text(
                "SELECT insertar_enc_fac(:NIT, :nombre_restaurante, :direccion, :ciudad, :fecha, :documento)"
            ),
            {
                "NIT": NIT,
                "nombre_restaurante": nombre_restaurante,
                "direccion": direccion,
                "ciudad": ciudad,
                "fecha": fecha,
                "documento": documento,
            },
        )
        db.commit()
        raise HTTPException(
            status_code=201, detail="Encabezado de factura insertado correctamente"
        )
    except IntegrityError as e:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail=f"Error de integridad al insertar el encabezado de factura: {str(e)}",
        )
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Error de base de datos al insertar el encabezado de factura: {str(e)}",
        )


def editar_enc_fac(
    db: Session,
    id_encab_fact: int,
    NIT: int,
    nombre_restaurante: str,
    direccion: str,
    ciudad: str,
    fecha: str,
    documento: str,
):
    try:
        db.execute(
            text(
                "SELECT editar_enc_fac(:id_encab_fact, :NIT, :nombre_restaurante, :direccion, :ciudad, :fecha, :documento)"
            ),
            {
                "id_encab_fact": id_encab_fact,
                "NIT": NIT,
                "nombre_restaurante": nombre_restaurante,
                "direccion": direccion,
                "ciudad": ciudad,
                "fecha": fecha,
                "documento": documento,
            },
        )
        db.commit()
        raise HTTPException(
            status_code=200, detail="Encabezado de factura editado correctamente"
        )
    except IntegrityError as e:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail=f"Error de integridad al editar el encabezado de factura: {str(e)}",
        )
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Error de base de datos al editar el encabezado de factura: {str(e)}",
        )


def borrar_enc_fac(db: Session, id_encab_fact: int):
    try:
        db.execute(
            text("SELECT borrar_enc_fac(:id_encab_fact)"),
            {"id_encab_fact": id_encab_fact},
        )
        db.commit()
        raise HTTPException(
            status_code=200, detail="Encabezado de la factura eliminada correctamente"
        )
    except IntegrityError as e:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail=f"Error de integridad al borrar el encabezado de factura: {str(e)}",
        )
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Error de base de datos al borrar el encabezado de factura: {str(e)}",
        )
