from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from config import get_db
from functions.auth.dependencies import verificar_token
from functions.cruds import usuario as usuario_crud, list as list_queries
from models import ClienteUpdate, ClienteDelete, ListarClientes

router = APIRouter(
    prefix="/cliente",
    tags=["Cliente"],
    dependencies=[Depends(verificar_token)]
)


@router.get("/mi-perfil")
async def mi_perfil(
    usuario_actual: dict = Depends(verificar_token),
    db: Session = Depends(get_db),
):
    """Perfil completo del usuario autenticado (nombre, apellido, email, etc.)."""
    id_credencial = usuario_actual.get("id")
    if not id_credencial:
        raise HTTPException(status_code=401, detail="Token inválido")
    perfil = list_queries.obtener_usuario_por_id_credencial(db, id_credencial)
    if not perfil:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return {"respuesta": perfil}


@router.get("/mis-reservas")
async def mis_reservas(
    usuario_actual: dict = Depends(verificar_token),
    db: Session = Depends(get_db),
):
    """Reservas del usuario autenticado (cliente)."""
    id_credencial = usuario_actual.get("id")
    if not id_credencial:
        raise HTTPException(status_code=401, detail="Token inválido")
    perfil = list_queries.obtener_usuario_por_id_credencial(db, id_credencial)
    if not perfil:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    documento = perfil["documento"]
    reservas = list_queries.obtener_reservas_por_documento(db, int(documento))
    return {"reservas": reservas}


@router.get("/listar_cliente")
async def listar_cliente(
    data: ListarClientes,
    db: Session = Depends(get_db),
):
    respuesta = list_queries.obtener_usuario(db, str(data.documento))
    return {"respuesta": respuesta}

@router.get("/listar_clientes")
async def listar_clientes(db: Session = Depends(get_db)):
    respuesta = list_queries.obtener_usuarios(db)
    return {"respuesta": respuesta}

@router.put("/editarcliente")
async def editar(data: ClienteUpdate, db: Session = Depends(get_db)):
    nit = getattr(data, "nit", None)
    usuario_crud.editar_usuario(
        db,
        data.id_credencial,
        data.nombre,
        data.apellido,
        data.tipo_documento,
        data.documento,
        data.nacionalidad,
        data.telefono,
        data.id_rol,
        nit=nit,
    )

@router.delete("/borrarcliente")
async def borrar(data: ClienteDelete, db: Session = Depends(get_db)):
    usuario_crud.borrar_usuario(db, data.documento)
