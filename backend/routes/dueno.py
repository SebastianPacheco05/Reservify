from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from config import get_db
from functions.auth.dependencies import verificar_token
from functions.data_owner.data_owner import obtener_documento_dueno
from functions.cruds import dueno, list as dueno_queries
from models import DuenoBase, DuenoUpdate, DuenoDelete, ListarDuenos

router = APIRouter(
    prefix="/dueno",
    tags=["Dueno"],
    dependencies=[Depends(verificar_token)]
)


def _requerir_dueno(usuario_actual: dict, db: Session) -> None:
    """
    Solo un usuario con rol dueño puede gestionar registros de dueños.
    """
    obtener_documento_dueno(usuario_actual["id"], db)


@router.post("/insertardueno")
async def insertar(
    data: DuenoBase,
    usuario_actual: dict = Depends(verificar_token),
    db: Session = Depends(get_db),
):
    _requerir_dueno(usuario_actual, db)
    dueno.insertar_dueno(
        db,
        data.documento,
        data.tipo_documento,
        data.nombre,
        data.apellido,
        data.id_rol,
        data.id_credencial,
    )


@router.get("/listar_dueno")
async def listar_dueno(
    data: ListarDuenos,
    usuario_actual: dict = Depends(verificar_token),
    db: Session = Depends(get_db),
):
    _requerir_dueno(usuario_actual, db)
    respuesta = dueno_queries.obtener_dueno(db, data.documento)
    return {"respuesta": respuesta}


@router.get("/listar_duenos")
async def listar_duenos(
    usuario_actual: dict = Depends(verificar_token),
    db: Session = Depends(get_db),
):
    _requerir_dueno(usuario_actual, db)
    respuesta = dueno_queries.obtener_duenos(db)
    return {"respuesta": respuesta}


@router.put("/editardueno")
async def editar(
    data: DuenoUpdate,
    usuario_actual: dict = Depends(verificar_token),
    db: Session = Depends(get_db),
):
    _requerir_dueno(usuario_actual, db)
    dueno.editar_dueno(
        db,
        data.documento,
        data.nombre,
        data.apellido,
        data.id_rol,
        data.id_credencial,
    )


@router.delete("/borrardueno")
async def borrar(
    data: DuenoDelete,
    usuario_actual: dict = Depends(verificar_token),
    db: Session = Depends(get_db),
):
    _requerir_dueno(usuario_actual, db)
    dueno.borrar_dueno(db, data.documento)
