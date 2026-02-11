from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from config import get_db
from funciones.cruds import comentarios, list as comentarios_queries
from funciones.cruds.cliente_utils import obtener_documento_por_email
from funciones.auth.dependencies import verificar_token
from models import ComentarioBase, ComentarioUpdate, ComentarioDelete, ListarComentarios, ComentarioCreate

# Router público (sin autenticación)
router = APIRouter(
    prefix="/comentarios",
    tags=["Comentarios"]
)

# Obtener comentarios por restaurante (público)
@router.get("/restaurante/{nit}")
async def obtener_comentarios_por_restaurante(nit: int, db: Session = Depends(get_db)):
    try:
        query = text('''
            SELECT 
                id_comentario,
                comentario,
                TO_CHAR(fecha, 'YYYY-MM-DD') as fecha,
                calificacion
            FROM "Comentarios"
            WHERE "nit" = :nit
            ORDER BY fecha DESC
        ''')
        result = db.execute(query, {"nit": nit})
        rows = result.fetchall()
        
        return [
            {
                "id_comentario": row[0],
                "comentario": row[1],
                "fecha": row[2],
                "calificacion": row[3]
            }
            for row in rows
        ]
    except Exception as e:
        import traceback
        print(f"Error en obtener_comentarios_por_restaurante: {str(e)}")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Error al obtener comentarios: {str(e)}")


# Verificar si el usuario ya tiene un comentario para un restaurante
@router.get("/verificar/{nit}")
async def verificar_comentario_existente(
    nit: int,
    db: Session = Depends(get_db),
    usuario_actual: dict = Depends(verificar_token),
):
    """Verifica si el usuario autenticado ya tiene un comentario para este restaurante"""
    try:
        documento = obtener_documento_por_email(db, usuario_actual["email"])
        existe = comentarios.verificar_comentario_existente(db, documento, nit)
        return {"ya_tiene_comentario": existe}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error al verificar comentario: {str(e)}",
        )


# Insertar comentario (requiere autenticación)
@router.post("/crear")
async def crear_comentario(
    data: ComentarioCreate,
    db: Session = Depends(get_db),
    usuario_actual: dict = Depends(verificar_token),
):
    """Crea un nuevo comentario con calificación. Requiere autenticación."""
    try:
        # Validar calificación
        if data.calificacion < 1 or data.calificacion > 5:
            raise HTTPException(
                status_code=400,
                detail="La calificación debe estar entre 1 y 5",
            )
        
        # Obtener documento del usuario
        documento = obtener_documento_por_email(db, usuario_actual["email"])
        
        # Verificar si ya tiene un comentario
        if comentarios.verificar_comentario_existente(db, documento, data.nit):
            raise HTTPException(
                status_code=400,
                detail="Ya has dejado una reseña para este restaurante. Solo puedes dejar una reseña por restaurante.",
            )
        
        # Insertar comentario
        resultado = comentarios.insertar_comentario(
            db, documento, data.nit, data.comentario, data.calificacion
        )
        return resultado
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error al crear comentario: {str(e)}",
        )


# Insertar comentario (endpoint antiguo, mantener para compatibilidad)
@router.post("/insertarcomentario")
async def insertar(data: ComentarioBase, db: Session = Depends(get_db)):
    comentarios.insertar_comentario(db, data.documento, data.nit, data.comentario, getattr(data, 'calificacion', 5))


# Editar comentario
@router.put("/editarcomentario")
async def editar(data: ComentarioUpdate, db: Session = Depends(get_db)):
    comentarios.editar_comentario(db, data.id_comentario, data.comentario)


# Borrar comentario
@router.delete("/borrarcomentario")
async def borrar(data: ComentarioDelete, db: Session = Depends(get_db)):
    comentarios.borrar_comentario(db, data.id_comentario)


# Listar comentario específico
@router.get("/listar_comentario")
async def listar_comentario(data: ListarComentarios, db: Session = Depends(get_db)):
    respuesta = comentarios_queries.obtener_comentario(db, data.id_comentario)
    return {"respuesta": respuesta}


# Listar todos los comentarios
@router.get("/listar_comentarios")
async def listar_comentarios(db: Session = Depends(get_db)):
    respuesta = comentarios_queries.obtener_comentarios(db)
    return {"respuesta": respuesta}
