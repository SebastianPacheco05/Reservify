from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from config import get_db
from funciones.auth.dependencies import verificar_token
from funciones.cruds import categorias, list as categorias_queries
from models import insertarCategorias, editarCategorias, borrarCategorias, ListarCategorias

router = APIRouter(
    prefix="/categorias",
    tags=["Categorias"],
    dependencies=[Depends(verificar_token)]
)

@router.post("/insertarcategoria")
async def insertar(data: insertarCategorias, db: Session = Depends(get_db)):
    categorias.insertar_categoria(db, data.nombre_categoria)

@router.get("/listar_categoria")
async def listar_categoria(id_categoria: int = Query(...), db: Session = Depends(get_db)):
    respuesta = categorias_queries.obtener_categoria(db, id_categoria)
    return {"respuesta": respuesta}

@router.get("/listar_categorias")
async def listar_categorias(db: Session = Depends(get_db)):
    respuesta = categorias_queries.obtener_categorias(db)
    return {"respuesta": respuesta}

@router.put("/editarcategoria")
async def editar(data: editarCategorias, db: Session = Depends(get_db)):
    categorias.editar_categoria(db, data.id_categoria, data.nombre_categoria)

@router.delete("/borrar_categoria")
async def borrar(data: borrarCategorias, db: Session = Depends(get_db)):
    categorias.borrar_categoria(db, data.id_categoria)
