from sqlalchemy.orm import Session
from sqlalchemy import text


def insertar_empleado(
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
    NIT: int,
):
    db.execute(
        text(
            "SELECT insertar_empleado(:id_credencial, :nombre1, :nombre2, :apellido1, :apellido2, :tipo_documento, :documento, :nacionalidad, :telefono, :id_rol, :NIT)"
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
            "NIT": NIT,
        },
    )
    db.commit()


def editar_empleado(
    db: Session,
    id_empleado: int,
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
    NIT: int,
):
    db.execute(
        text(
            "SELECT editar_empleado(:id_empleado, :id_credencial, :nombre1, :nombre2, :apellido1, :apellido2, :tipo_documento, :documento, :nacionalidad, :telefono, :id_rol, :NIT)"
        ),
        {
            "id_empleado": id_empleado,
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
            "NIT": NIT,
        },
    )
    db.commit()


def borrar_empleado(db: Session, id_empleado: int):
    db.execute(
        text("SELECT borrar_empleado(:id_empleado)"), {"id_empleado": id_empleado}
    )
    db.commit()
