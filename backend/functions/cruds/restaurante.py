from sqlalchemy.orm import Session
from sqlalchemy import text
from fastapi import HTTPException
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from datetime import datetime, timedelta


def _parse_hora(value: str) -> datetime.time:
    formatos = ("%H:%M:%S", "%H:%M")
    for fmt in formatos:
        try:
            return datetime.strptime(value, fmt).time()
        except ValueError:
            continue
    raise HTTPException(
        status_code=400,
        detail=f"Formato de hora inválido: {value}. Usa HH:MM o HH:MM:SS.",
    )


def _validar_horario_apertura_cierre(horario_apertura: str, horario_cierre: str) -> None:
    apertura = _parse_hora(horario_apertura)
    cierre = _parse_hora(horario_cierre)

    if apertura == cierre:
        raise HTTPException(
            status_code=400,
            detail="El horario de apertura no puede ser igual al de cierre.",
        )

    # Caso nocturno (cruza medianoche): máximo 8 horas de operación.
    if apertura > cierre:
        hoy = datetime.today().date()
        dt_apertura = datetime.combine(hoy, apertura)
        dt_cierre = datetime.combine(hoy + timedelta(days=1), cierre)
        if (dt_cierre - dt_apertura) > timedelta(hours=8):
            raise HTTPException(
                status_code=400,
                detail=(
                    "Cuando el horario cruza medianoche, la duración máxima "
                    "permitida es de 8 horas."
                ),
            )


def insertar_restaurante(
    db: Session,
    nit: int,
    direccion: str,
    nombre_restaurante: str,
    descripcion_restaurante: str,
    horario_apertura: str,
    horario_cierre: str,
    documento: int,
    id_categoria: int,
    url_imagen: str = "",
    imagenes_referencia: list = None,
    min_anticipacion_horas: int = 0,
):
    try:
        _validar_horario_apertura_cierre(horario_apertura, horario_cierre)
        # Función con 9 parámetros: incluye url_imagen e inserta rating, reviews, availableToday en la tabla
        db.execute(
            text(
                "SELECT insertar_restaurante(:nit, :direccion, :nombre_restaurante, :descripcion_restaurante, :horario_apertura, :horario_cierre, :documento, :id_categoria, :url_imagen)"
            ),
            {
                "nit": nit,
                "direccion": direccion,
                "nombre_restaurante": nombre_restaurante,
                "descripcion_restaurante": descripcion_restaurante,
                "horario_apertura": horario_apertura,
                "horario_cierre": horario_cierre,
                "documento": documento,
                "id_categoria": id_categoria,
                "url_imagen": url_imagen or "",
            },
        )
        db.commit()
        # Imágenes de referencia por restaurante_uid (función SQL espera UUID)
        if imagenes_referencia:
            try:
                uid_row = db.execute(
                    text('SELECT restaurante_uid FROM "Restaurante" WHERE nit = :nit'),
                    {"nit": nit},
                ).fetchone()
                if not uid_row or uid_row[0] is None:
                    raise HTTPException(
                        status_code=500,
                        detail="No se obtuvo restaurante_uid tras insertar el restaurante.",
                    )
                restaurante_uid_str = str(uid_row[0])
                for orden, url in enumerate(imagenes_referencia[:15]):
                    if url and str(url).strip():
                        db.execute(
                            text(
                                "SELECT insertar_imagen_referencia_restaurante("
                                "CAST(:restaurante_uid AS uuid), :url_imagen, :orden)"
                            ),
                            {
                                "restaurante_uid": restaurante_uid_str,
                                "url_imagen": url.strip(),
                                "orden": orden,
                            },
                        )
                db.commit()
            except SQLAlchemyError:
                db.rollback()
        raise HTTPException(
            status_code=201, detail="Restaurante insertado correctamente"
        )
    except HTTPException:
        raise
    except IntegrityError as e:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail=f"Error de integridad al insertar el restaurante: {str(e)}",
        )
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Error de base de datos al insertar el restaurante: {str(e)}",
        )


def editar_restaurante(
    db: Session,
    restaurante_uid: str,
    nit: int,
    direccion: str,
    nombre_restaurante: str,
    descripcion_restaurante: str,
    horario_apertura: str,
    horario_cierre: str,
    documento: int,
    id_categoria: int,
):
    try:
        _validar_horario_apertura_cierre(horario_apertura, horario_cierre)
        db.execute(
            text(
                "SELECT editar_restaurante(:restaurante_uid, :nit, :direccion, :nombre_restaurante, :descripcion_restaurante, :horario_apertura, :horario_cierre, :documento, :id_categoria)"
            ),
            {
                "restaurante_uid": restaurante_uid,
                "nit": nit,
                "direccion": direccion,
                "nombre_restaurante": nombre_restaurante,
                "descripcion_restaurante": descripcion_restaurante,
                "horario_apertura": horario_apertura,
                "horario_cierre": horario_cierre,
                "documento": documento,
                "id_categoria": id_categoria,
            },
        )
        db.commit()
        raise HTTPException(status_code=200, detail="Restaurante editado correctamente")
    except IntegrityError as e:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail=f"Error de integridad al editar el restaurante: {str(e)}",
        )
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Error de base de datos al editar el restaurante: {str(e)}",
        )


def borrar_restaurante(db: Session, restaurante_uid: str):
    try:
        db.execute(
            text("SELECT borrar_restaurante(CAST(:restaurante_uid AS uuid))"),
            {"restaurante_uid": restaurante_uid},
        )
        db.commit()
        raise HTTPException(
            status_code=200, detail="Restaurante eliminado correctamente"
        )
    except IntegrityError as e:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail=f"Error de integridad al borrar el restaurante: {str(e)}",
        )
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Error de base de datos al borrar el restaurante: {str(e)}",
        )
