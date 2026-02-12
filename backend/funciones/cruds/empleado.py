from sqlalchemy.orm import Session
from sqlalchemy import text
from fastapi import HTTPException
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from funciones.data_owner.data_owner import obtener_documento_dueno


def _verificar_es_admin(id_rol: int, db: Session) -> bool:
    """Verifica si el id_rol corresponde al rol 'administrador'"""
    result = db.execute(
        text('SELECT LOWER(TRIM(nombre_rol)) FROM "Roles" WHERE id_rol = :id_rol'),
        {"id_rol": id_rol}
    ).fetchone()
    if result:
        return result[0] == "administrador"
    return False


def _verificar_dueno_restaurante(documento_dueno: int, nit: int, db: Session) -> bool:
    """Verifica que el dueño (documento) sea dueño del restaurante (nit)"""
    result = db.execute(
        text('SELECT 1 FROM "Restaurante" WHERE nit = :nit AND documento = :documento'),
        {"nit": nit, "documento": documento_dueno}
    ).fetchone()
    return result is not None


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
    nit: int,
    id_credencial_dueno: int,  # Credencial del dueño que está creando el empleado
):
    try:
        # 1) Verificar que el usuario actual es dueño
        documento_dueno = obtener_documento_dueno(id_credencial_dueno, db)
        
        # 2) Verificar que si el rol es administrador, nit es obligatorio
        if _verificar_es_admin(id_rol, db):
            if nit is None:
                raise HTTPException(
                    status_code=400,
                    detail="Un administrador debe estar vinculado a un restaurante (nit es obligatorio)"
                )
        
        # 3) Verificar que el dueño es dueño del restaurante al que se asigna el empleado
        if nit is not None:
            if not _verificar_dueno_restaurante(documento_dueno, nit, db):
                raise HTTPException(
                    status_code=403,
                    detail="Solo puedes asignar empleados a restaurantes de tu propiedad"
                )
        
        db.execute(
            text(
                "SELECT insertar_empleado(:id_credencial, :nombre, :apellido, :tipo_documento, :documento, :nacionalidad, :telefono, :id_rol, :nit)"
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
                "nit": nit,
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
    id_credencial: int,
    nombre: str,
    apellido: str,
    tipo_documento: str,
    documento: int,
    nacionalidad: str,
    telefono: str,
    id_rol: int,
    nit: int,
    id_credencial_dueno: int,  # Credencial del dueño que está editando el empleado
):
    try:
        # 1) Verificar que el usuario actual es dueño
        documento_dueno = obtener_documento_dueno(id_credencial_dueno, db)
        
        # 2) Verificar que si el rol es administrador, nit es obligatorio
        if _verificar_es_admin(id_rol, db):
            if nit is None:
                raise HTTPException(
                    status_code=400,
                    detail="Un administrador debe estar vinculado a un restaurante (nit es obligatorio)"
                )
        
        # 3) Verificar que el dueño es dueño del restaurante al que se asigna el empleado
        if nit is not None:
            if not _verificar_dueno_restaurante(documento_dueno, nit, db):
                raise HTTPException(
                    status_code=403,
                    detail="Solo puedes asignar empleados a restaurantes de tu propiedad"
                )
        
        db.execute(
            text(
                "SELECT editar_empleado(:id_credencial, :nombre, :apellido, :tipo_documento, :documento, :nacionalidad, :telefono, :id_rol, :nit)"
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
                "nit": nit,
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


def borrar_empleado(db: Session, documento: int):
    try:
        db.execute(
            text("SELECT borrar_empleado(:documento)"), {"documento": documento}
        )
        db.commit()
        raise HTTPException(status_code=200, detail=f"Empleado con documento {documento} eliminado correctamente")
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
