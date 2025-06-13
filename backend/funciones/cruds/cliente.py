from sqlalchemy.orm import Session
from sqlalchemy import text
from fastapi import HTTPException
from sqlalchemy.exc import IntegrityError, SQLAlchemyError


def insertar_clientes(
    db: Session,
    id_credencial: int,
    nombre1: str,
    nombre2: str,
    apellido1: str,
    apellido2: str,
    tipo_documento: str,
    documento: int,
    nacionalidad: str,
    telefono: str,
    id_rol: int,
):
    try:
        db.execute(
            text(
                "SELECT insertar_clientes(:id_credencial, :nombre1, :nombre2, :apellido1, :apellido2, :tipo_documento, :documento, :nacionalidad, :telefono, :id_rol)"
            ),
            {
                "id_credencial": id_credencial,
                "nombre1": nombre1,
                "nombre2": nombre2,
                "apellido1": apellido1,
                "apellido2": apellido2,
                "tipo_documento": tipo_documento,
                "documento": documento,
                "nacionalidad": nacionalidad,
                "telefono": telefono,
                "id_rol": id_rol,
            },
        )
        db.commit()
        raise HTTPException(status_code=201, detail="Cliente insertado correctamente")
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=400, detail="Error de integridad al insertar las credenciales"
        )
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=500, detail=f"Error de base de datos al insertar: {str(e)}"
        )


def editar_clientes(
    db: Session,
    id_cliente: int,
    id_credencial: int,
    nombre1: str,
    nombre2: str,
    apellido1: str,
    apellido2: str,
    tipo_documento: str,
    documento: int,
    nacionalidad: str,
    telefono: str,
    id_rol: int,
):
    try:
        db.execute(
            text(
                "SELECT editar_clientes(:id_cliente, :id_credencial, :nombre1, :nombre2, :apellido1, :apellido2, :tipo_documento, :documento, :nacionalidad, :telefono, :id_rol)"
            ),
            {
                "id_cliente": id_cliente,
                "id_credencial": id_credencial,
                "nombre1": nombre1,
                "nombre2": nombre2,
                "apellido1": apellido1,
                "apellido2": apellido2,
                "tipo_documento": tipo_documento,
                "documento": documento,
                "nacionalidad": nacionalidad,
                "telefono": telefono,
                "id_rol": id_rol,
            },
        )
        db.commit()
        raise HTTPException(status_code=200, detail="Cliente editado correctamente")

    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=400, detail="Error de integridad al editar las credenciales"
        )
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=500, detail=f"Error de base de datos al editar: {str(e)}"
        )


def borrar_clientes(db: Session, id_cliente: int):
    try:
        db.execute(
            text("SELECT borrar_clientes(:id_cliente)"), {"id_cliente": id_cliente}
        )
        db.commit()
        raise HTTPException(status_code=200, detail="Cliente eliminado correctamente")
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=500, detail=f"Error de base de datos al borrar: {str(e)}"
        )
