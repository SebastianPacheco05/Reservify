from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from config import get_db
from models import RolBase, RolUpdate, RolDelete, ListarRoles
from funciones.auth.dependencies import verificar_token
from funciones.cruds import roles, list as roles_queries

protected_router = APIRouter(
    prefix="/admin",
    tags=["Roles"],
    dependencies=[Depends(verificar_token)]
)

@protected_router.post("/insertaroles")
async def insertar(data: RolBase, db: Session = Depends(get_db)):
    roles.insertar_roles(db, data.nombre_rol, data.descripcion)
    return {"detail": "Rol creado"}

@protected_router.get("/listar_rol")
async def listar_rol(data: ListarRoles, db: Session = Depends(get_db)):
    resultado = roles_queries.obtener_rol(db, data.id_rol)
    return {"respuesta": resultado}

@protected_router.get("/listar_roles")
async def listar_roles(db: Session = Depends(get_db)):
    resultado = roles_queries.obtener_roles(db)
    return {"respuesta": resultado}

@protected_router.put("/editaroles")
async def editar(data: RolUpdate, db: Session = Depends(get_db)):
    roles.editar_roles(db, data.id_rol, data.nombre_rol, data.descripcion)
    return {"detail": "Rol actualizado"}

@protected_router.delete("/borraroles")
async def borrar(data: RolDelete, db: Session = Depends(get_db)):
    roles.borrar_roles(db, data.id_rol)
    return {"detail": "Rol eliminado"}
