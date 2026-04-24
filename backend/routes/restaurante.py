from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy.orm import Session
from sqlalchemy import text
from uuid import UUID
from config import get_db
from functions.cruds import restaurante, list as restaurante_queries
from functions.auth.dependencies import verificar_token
from functions.cloudinary_upload import upload_image
from functions.data_owner.data_owner import (
    puede_acceder_restaurante,
    es_dueño_de_restaurante,
    validar_nit_restaurante_para_empleados,
)
from models import RestauranteBase, RestauranteUpdate, RestauranteDelete, ListarRestaurantes

router = APIRouter(
    prefix="/restaurante",
    tags=["Restaurante"]
)


def _requerir_dueno_restaurante(usuario_actual: dict, restaurante_uid: str, db: Session) -> None:
    row = db.execute(
        text('SELECT nit FROM "Restaurante" WHERE restaurante_uid = :restaurante_uid'),
        {"restaurante_uid": restaurante_uid},
    ).fetchone()
    if not row:
        raise HTTPException(status_code=404, detail="Restaurante no encontrado.")
    nit = int(row[0])
    if not es_dueño_de_restaurante(usuario_actual["id"], nit, db):
        raise HTTPException(
            status_code=403,
            detail="Solo el dueño del restaurante puede realizar esta acción.",
        )


def _requerir_gestor_restaurante(usuario_actual: dict, restaurante_uid: str, db: Session) -> None:
    row = db.execute(
        text('SELECT nit FROM "Restaurante" WHERE restaurante_uid = :restaurante_uid'),
        {"restaurante_uid": restaurante_uid},
    ).fetchone()
    if not row:
        raise HTTPException(status_code=404, detail="Restaurante no encontrado.")
    nit = int(row[0])
    if not puede_acceder_restaurante(usuario_actual["id"], nit, db):
        raise HTTPException(
            status_code=403,
            detail="No tienes permisos para gestionar este restaurante.",
        )

@router.post("/upload-imagen")
async def subir_imagen(
    file: UploadFile = File(...),
    usuario_actual: dict = Depends(verificar_token),
):
    """Sube una imagen a Cloudinary (CLOUDINARY_URL) y devuelve la URL. Para imagen principal o de referencia."""
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="El archivo debe ser una imagen.")
    content = await file.read()
    url = upload_image(content)
    return {"url": url}


@router.post("/insertarrestaurante")
async def insertar(
    data: RestauranteBase,
    usuario_actual: dict = Depends(verificar_token),
    db: Session = Depends(get_db),
):
    """
    Crea un restaurante. Solo el dueño (documento del usuario) puede crear sus propios restaurantes.
    """
    # Asegurar que el documento del restaurante coincide con el del dueño autenticado
    from functions.data_owner.data_owner import obtener_documento_dueno

    documento_dueno = obtener_documento_dueno(usuario_actual["id"], db)
    if int(data.documento) != int(documento_dueno):
        raise HTTPException(
            status_code=403,
            detail="Solo puedes crear restaurantes asociados a tu propio documento.",
        )

    imagenes_ref = data.imagenes_referencia if data.imagenes_referencia is not None else None
    if imagenes_ref and len(imagenes_ref) > 15:
        imagenes_ref = imagenes_ref[:15]
    validar_nit_restaurante_para_empleados(int(data.nit))
    restaurante.insertar_restaurante(
        db,
        data.nit,
        data.direccion,
        data.nombre_restaurante,
        data.descripcion_restaurante,
        data.horario_apertura,
        data.horario_cierre,
        data.documento,
        data.id_categoria,
        url_imagen=data.url_imagen or "",
        imagenes_referencia=imagenes_ref,
    )

@router.get("/listar_restaurante")
async def listar_restaurante(data: ListarRestaurantes, db: Session = Depends(get_db)):
    respuesta = restaurante_queries.obtener_restaurante(db, data.nit)
    return {"respuesta": respuesta}

@router.get("/listar_restaurantes")
async def listar_restaurantes(db: Session = Depends(get_db)):
    respuesta = restaurante_queries.obtener_restaurantes(db)
    return {"respuesta": respuesta}

@router.put("/editarrestaurante")
async def editar(
    data: RestauranteUpdate,
    usuario_actual: dict = Depends(verificar_token),
    db: Session = Depends(get_db),
):
    """
    Edita un restaurante existente. Solo el dueño del restaurante puede editarlo.
    """
    _requerir_dueno_restaurante(usuario_actual, data.restaurante_uid, db)
    validar_nit_restaurante_para_empleados(int(data.nit))

    restaurante.editar_restaurante(
        db,
        data.restaurante_uid,
        data.nit,
        data.direccion,
        data.nombre_restaurante,
        data.descripcion_restaurante,
        data.horario_apertura,
        data.horario_cierre,
        data.documento,
        data.id_categoria,
    )

@router.delete("/borrarrestaurante")
async def borrar(
    data: RestauranteDelete,
    usuario_actual: dict = Depends(verificar_token),
    db: Session = Depends(get_db),
):
    """
    Borra un restaurante. Solo el dueño del restaurante puede borrarlo.
    """
    _requerir_dueno_restaurante(usuario_actual, data.restaurante_uid, db)
    restaurante.borrar_restaurante(db, data.restaurante_uid)


@router.get("/{restaurante_uid}")
async def obtener_restaurante_publico(restaurante_uid: UUID, db: Session = Depends(get_db)):
    """Endpoint público para obtener información detallada de un restaurante por UID"""
    try:
        query = text('''
            SELECT 
                r.restaurante_uid,
                r.nit,
                r.direccion,
                r.nombre_restaurante,
                r.descripcion_restaurante,
                r.rating,
                r.reviews,
                r.availabletoday,
                r.horario_apertura,
                r.horario_cierre,
                r.url_image,
                c.nombre_categoria,
                r.lat,
                r.lng
            FROM "Restaurante" r
            LEFT JOIN "Categorias" c ON r.id_categoria = c.id_categoria
            WHERE r.restaurante_uid = :restaurante_uid
        ''')
        result = db.execute(query, {"restaurante_uid": str(restaurante_uid)})
        row = result.fetchone()

        if not row:
            raise HTTPException(status_code=404, detail="Restaurante no encontrado")

        uid_str = str(row[0])
        imagenes_referencia = []
        try:
            imagenes_ref_query = text('''
                SELECT url_imagen
                FROM "Imagen_referencia_restaurante"
                WHERE restaurante_uid = CAST(:restaurante_uid AS uuid)
                ORDER BY orden ASC
            ''')
            imagenes_ref_result = db.execute(imagenes_ref_query, {"restaurante_uid": uid_str})
            imagenes_referencia = [r[0] for r in imagenes_ref_result.fetchall()]
        except Exception:
            imagenes_referencia = []

        lat_val = float(row[12]) if row[12] is not None else None
        lng_val = float(row[13]) if row[13] is not None else None
        return {
            "restaurante_uid": str(row[0]),
            "nit": row[1],
            "direccion": row[2],
            "nombre_restaurante": row[3],
            "descripcion_restaurante": row[4],
            "rating": float(row[5]) if row[5] else 0.0,
            "reviews": row[6],
            "availabletoday": row[7],
            "horario_apertura": str(row[8]),
            "horario_cierre": str(row[9]),
            "url_image": row[10],
            "nombre_categoria": row[11],
            "imagenes_referencia": imagenes_referencia,
            "lat": lat_val,
            "lng": lng_val,
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener restaurante: {str(e)}")
