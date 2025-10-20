from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from config import get_db
from funciones.cruds import comentarios, list as comentarios_queries
from models import ComentarioBase, ComentarioUpdate, ComentarioDelete, ListarComentarios

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


# Insertar comentario
@router.post("/insertarcomentario")
async def insertar(data: ComentarioBase, db: Session = Depends(get_db)):
    comentarios.insertar_comentario(db, data.documento, data.nit, data.comentario)


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
