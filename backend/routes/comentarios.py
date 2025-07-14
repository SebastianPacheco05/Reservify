from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from config import get_db
from funciones.auth.dependencies import verificar_token
from funciones.cruds import comentarios, list as comentarios_queries
from models import ComentarioBase, ComentarioUpdate, ComentarioDelete, ListarComentarios

router = APIRouter(
    prefix="/comentarios",
    tags=["Comentarios"],
    dependencies=[Depends(verificar_token)]
)

@router.post("/insertarcomentario")
async def insertar(data: ComentarioBase, db: Session = Depends(get_db)):
    comentarios.insertar_comentario(db, data.documento, data.nit, data.comentario)

@router.put("/editarcomentario")
async def editar(data: ComentarioUpdate, db: Session = Depends(get_db)):
    comentarios.editar_comentario(db, data.id_comentario, data.comentario)

@router.delete("/borrarcomentario")
async def borrar(data: ComentarioDelete, db: Session = Depends(get_db)):
    comentarios.borrar_comentario(db, data.id_comentario)

@router.get("/listar_comentario")
async def listar_comentario(data: ListarComentarios, db: Session = Depends(get_db)):
    respuesta = comentarios_queries.obtener_comentario(db, data.id_comentario)
    return {"respuesta": respuesta}

@router.get("/listar_comentarios")
async def listar_comentarios(db: Session = Depends(get_db)):
    respuesta = comentarios_queries.obtener_comentarios(db)
    return {"respuesta": respuesta}
