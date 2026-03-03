from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from config import get_db
from functions.auth.dependencies import verificar_token
from functions.data_owner.data_owner import obtener_documento_dueno
from functions.cruds import empleado, list as empleado_queries
from models import EmpleadoBase, EmpleadoUpdate, EmpleadoDelete, ListarEmpleados

router = APIRouter(
    prefix="/empleado",
    tags=["Empleado"],
    dependencies=[Depends(verificar_token)]
)

@router.post("/insertarempleado")
async def insertar(
    data: EmpleadoBase,
    db: Session = Depends(get_db),
    usuario_actual: dict = Depends(verificar_token),
):
    # Solo el dueño puede crear empleados
    empleado.insertar_empleado(
        db,
        data.id_credencial,
        data.nombre,
        data.apellido,
        data.tipo_documento,
        data.documento,
        data.nacionalidad,
        data.telefono,
        data.id_rol,
        data.nit,
        usuario_actual["id"],  # id_credencial del dueño
    )

@router.get("/listar_empleado")
async def listar_empleado(
    data: ListarEmpleados,
    usuario_actual: dict = Depends(verificar_token),
    db: Session = Depends(get_db),
):
    # Solo dueño puede listar empleados (de sus restaurantes, validado dentro del crud/list)
    obtener_documento_dueno(usuario_actual["id"], db)
    respuesta = empleado_queries.obtener_empleado(db, data.documento)
    return {"respuesta": respuesta}

@router.get("/listar_empleados")
async def listar_empleados(
    usuario_actual: dict = Depends(verificar_token),
    db: Session = Depends(get_db),
):
    obtener_documento_dueno(usuario_actual["id"], db)
    respuesta = empleado_queries.obtener_empleados(db)
    return {"respuesta": respuesta}

@router.put("/editarempleado")
async def editar(
    data: EmpleadoUpdate,
    db: Session = Depends(get_db),
    usuario_actual: dict = Depends(verificar_token),
):
    # Solo el dueño puede editar empleados
    empleado.editar_empleado(
        db,
        data.id_credencial,
        data.nombre,
        data.apellido,
        data.tipo_documento,
        data.documento,
        data.nacionalidad,
        data.telefono,
        data.id_rol,
        data.nit,
        usuario_actual["id"],  # id_credencial del dueño
    )

@router.delete("/borrarempleado")
async def borrar(
    data: EmpleadoDelete,
    usuario_actual: dict = Depends(verificar_token),
    db: Session = Depends(get_db),
):
    obtener_documento_dueno(usuario_actual["id"], db)
    empleado.borrar_empleado(db, data.documento)
