from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy.orm import Session
from sqlalchemy import text
from config import get_db
from funciones.cruds import restaurante, list as restaurante_queries
from funciones.auth.dependencies import verificar_token
from funciones.cloudinary_upload import upload_image
from models import RestauranteBase, RestauranteUpdate, RestauranteDelete, ListarRestaurantes

router = APIRouter(
    prefix="/restaurante",
    tags=["Restaurante"]
)

@router.get("/{nit}")
async def obtener_restaurante_publico(nit: int, db: Session = Depends(get_db)):
    """Endpoint público para obtener información detallada de un restaurante por NIT"""
    try:
        query = text('''
            SELECT 
                r.nit as nit,
                r.direccion,
                r.nombre_restaurante,
                r.descripcion_restaurante,
                r.rating,
                r.reviews,
                r.availabletoday,
                r.horario_apertura,
                r.horario_cierre,
                r.url_image,
                c.nombre_categoria
            FROM "Restaurante" r
            LEFT JOIN "Categorias" c ON r.id_categoria = c.id_categoria
            WHERE r.nit = :nit
        ''')
        result = db.execute(query, {"nit": nit})
        row = result.fetchone()

        if not row:
            raise HTTPException(status_code=404, detail="Restaurante no encontrado")

        return {
            "nit": row[0],
            "direccion": row[1],
            "nombre_restaurante": row[2],
            "descripcion_restaurante": row[3],
            "rating": float(row[4]) if row[4] else 0.0,
            "reviews": row[5],
            "availabletoday": row[6],
            "horario_apertura": str(row[7]),
            "horario_cierre": str(row[8]),
            "url_image": row[9],
            "nombre_categoria": row[10]
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener restaurante: {str(e)}")

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
async def insertar(data: RestauranteBase, db: Session = Depends(get_db)):
    imagenes_ref = data.imagenes_referencia if data.imagenes_referencia is not None else None
    if imagenes_ref and len(imagenes_ref) > 15:
        imagenes_ref = imagenes_ref[:15]
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
async def editar(data: RestauranteUpdate, db: Session = Depends(get_db)):
    restaurante.editar_restaurante(
        db,
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
async def borrar(data: RestauranteDelete, db: Session = Depends(get_db)):
    restaurante.borrar_restaurante(db, data.nit)
