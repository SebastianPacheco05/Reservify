from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from config import get_db
from funciones.auth.dependencies import verificar_token
from funciones.cruds import usuario as usuario_crud, list as list_queries
from models import UsuarioBase, UsuarioUpdate, UsuarioDelete, ListarUsuarios

router = APIRouter(
    prefix="/usuario",
    tags=["Usuario"],
    dependencies=[Depends(verificar_token)],
)

@router.post("/insertar")
async def insertar(data: UsuarioBase, db: Session = Depends(get_db)):
    usuario_crud.insertar_usuario(
        db,
        data.id_credencial,
        data.nombre,
        data.apellido,
        data.tipo_documento,
        data.documento,
        data.nacionalidad or "",
        data.telefono or "",
        data.id_rol,
        nit=data.nit,
    )

@router.get("/listar_usuario")
async def listar_usuario(data: ListarUsuarios, db: Session = Depends(get_db)):
    respuesta = list_queries.obtener_usuario(db, str(data.documento))
    return {"respuesta": respuesta}

@router.get("/listar_usuarios")
async def listar_usuarios(db: Session = Depends(get_db)):
    respuesta = list_queries.obtener_usuarios(db)
    return {"respuesta": respuesta}

@router.get("/listar_usuarios_por_rol")
async def listar_usuarios_por_rol(rol: str, db: Session = Depends(get_db)):
    respuesta = list_queries.obtener_usuarios_por_rol(db, rol)
    return {"respuesta": respuesta}

@router.put("/editar")
async def editar(data: UsuarioUpdate, db: Session = Depends(get_db)):
    usuario_crud.editar_usuario(
        db,
        data.id_credencial,
        data.nombre,
        data.apellido,
        data.tipo_documento,
        data.documento,
        data.nacionalidad or "",
        data.telefono or "",
        data.id_rol,
        nit=data.nit,
    )

@router.delete("/borrar")
async def borrar(data: UsuarioDelete, db: Session = Depends(get_db)):
    usuario_crud.borrar_usuario(db, data.documento)
