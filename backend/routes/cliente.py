from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from config import get_db
from funciones.auth.dependencies import verificar_token
from funciones.cruds import cliente, list as cliente_queries
from models import ClienteBase, ClienteUpdate, ClienteDelete, ListarClientes

router = APIRouter(
    prefix="/cliente",
    tags=["Cliente"],
    dependencies=[Depends(verificar_token)]
)

@router.get("/listar_cliente")
async def listar_cliente(
    data: ListarClientes,
    db: Session = Depends(get_db),
):
    respuesta = cliente_queries.obtener_cliente(db, data.documento)
    return {"respuesta": respuesta}

@router.get("/listar_clientes")
async def listar_clientes(db: Session = Depends(get_db)):
    respuesta = cliente_queries.obtener_clientes(db)
    return {"respuesta": respuesta}

@router.put("/editarcliente")
async def editar(data: ClienteUpdate, db: Session = Depends(get_db)):
    cliente.editar_clientes(
        db,
        data.id_credencial,
        data.nombre,
        data.apellido,
        data.tipo_documento,
        data.documento,
        data.nacionalidad,
        data.telefono,
        data.id_rol,
    )

@router.delete("/borrarcliente")
async def borrar(data: ClienteDelete, db: Session = Depends(get_db)):
    cliente.borrar_clientes(db, data.documento)
