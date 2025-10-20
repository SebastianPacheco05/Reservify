from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from config import get_db
from funciones.auth.dependencies import verificar_token
from funciones.cruds import empleado, list as empleado_queries
from models import EmpleadoBase, EmpleadoUpdate, EmpleadoDelete, ListarEmpleados

router = APIRouter(
    prefix="/empleado",
    tags=["Empleado"],
    dependencies=[Depends(verificar_token)]
)

@router.post("/insertarempleado")
async def insertar(data: EmpleadoBase, db: Session = Depends(get_db)):
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
    )

@router.get("/listar_empleado")
async def listar_empleado(data: ListarEmpleados, db: Session = Depends(get_db)):
    respuesta = empleado_queries.obtener_empleado(db, data.documento)
    return {"respuesta": respuesta}

@router.get("/listar_empleados")
async def listar_empleados(db: Session = Depends(get_db)):
    respuesta = empleado_queries.obtener_empleados(db)
    return {"respuesta": respuesta}

@router.put("/editarempleado")
async def editar(data: EmpleadoUpdate, db: Session = Depends(get_db)):
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
    )

@router.delete("/borrarempleado")
async def borrar(data: EmpleadoDelete, db: Session = Depends(get_db)):
    empleado.borrar_empleado(db, data.documento)
