from sqlalchemy.orm import Session
from sqlalchemy import text
from fastapi import HTTPException
from sqlalchemy.exc import IntegrityError, SQLAlchemyError


def insertar_empleado(
    db: Session,
    id_credencial: int,
    nombre: str,
    apellido: str,
    tipo_documento: str,
    documento: int,
    nacionalidad: str,
    telefono: str,
    id_rol: int,
    NIT: int,
):
    try:
        db.execute(
            text(
                "SELECT insertar_empleado(:id_credencial, :nombre, :apellido, :tipo_documento, :documento, :nacionalidad, :telefono, :id_rol, :NIT)"
            ),
            {
                "id_credencial": id_credencial,
                "nombre": nombre,
                "apellido": apellido,
                "tipo_documento": tipo_documento,
                "documento": documento,
                "nacionalidad": nacionalidad,
                "telefono": telefono,
                "id_rol": id_rol,
                "NIT": NIT,
            },
        )
        db.commit()
        raise HTTPException(status_code=201, detail="Empleado insertado correctamente")
    except IntegrityError as e:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail=f"Error de integridad al insertar el empleado: {str(e)}",
        )
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Error de base de datos al insertar el empleado: {str(e)}",
        )


def editar_empleado(
    db: Session,
    id_empleado: int,
    id_credencial: int,
    nombre: str,
    apellido: str,
    tipo_documento: str,
    documento: int,
    nacionalidad: str,
    telefono: str,
    id_rol: int,
    NIT: int,
):
    try:
        db.execute(
            text(
                "SELECT editar_empleado(:id_empleado, :id_credencial, :nombre, :apellido, :tipo_documento, :documento, :nacionalidad, :telefono, :id_rol, :NIT)"
            ),
            {
                "id_empleado": id_empleado,
                "id_credencial": id_credencial,
                "nombre": nombre,
                "apellido": apellido,
                "tipo_documento": tipo_documento,
                "documento": documento,
                "nacionalidad": nacionalidad,
                "telefono": telefono,
                "id_rol": id_rol,
                "NIT": NIT,
            },
        )
        db.commit()
        raise HTTPException(status_code=200, detail="Empleado editado correctamente")
    except IntegrityError as e:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail=f"Error de integridad al editar el empleado: {str(e)}",
        )
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Error de base de datos al editar el empleado: {str(e)}",
        )


def borrar_empleado(db: Session, id_empleado: int):
    try:
        db.execute(
            text("SELECT borrar_empleado(:id_empleado)"), {"id_empleado": id_empleado}
        )
        db.commit()
        raise HTTPException(status_code=200, detail="Empleado eliminado correctamente")
    except IntegrityError as e:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail=f"Error de integridad al borrar el empleado: {str(e)}",
        )
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Error de base de datos al borrar el empleado: {str(e)}",
        )
