from sqlalchemy.orm import Session
from sqlalchemy import text
from fastapi import HTTPException
from sqlalchemy.exc import IntegrityError, SQLAlchemyError




def editar_clientes(
    db: Session,
    id_credencial: int,
    nombre: str,
    apellido: str,
    tipo_documento: str,
    documento: int,
    nacionalidad: str,
    telefono: str,
    id_rol: int,
):
    try:
        db.execute(
            text(
                "SELECT editar_clientes(:id_credencial, :nombre, :apellido, :tipo_documento, :documento, :nacionalidad, :telefono, :id_rol)"
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


def borrar_clientes(db: Session, documento: int):
    try:
        db.execute(
            text("SELECT borrar_clientes(:documento)"), {"documento": documento}
        )
        db.commit()
        raise HTTPException(status_code=200, detail=f"Cliente con documento {documento} eliminado correctamente")
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=500, detail=f"Error de base de datos al borrar: {str(e)}"
        )
