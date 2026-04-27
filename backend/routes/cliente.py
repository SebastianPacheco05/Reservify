from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import text
from config import get_db
from functions.auth.dependencies import verificar_token
from functions.cruds import usuario as usuario_crud, list as list_queries
from functions.cruds.reservation_status import actualizar_estado_reserva
from functions.data_owner.data_owner import actualizar_motivo_cancelacion
from models import ClienteUpdate, ClienteDelete, CancelarReservaClienteSchema

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


@router.patch("/mis-reservas/{id_reserva}/cancelar")
async def cancelar_mi_reserva(
    id_reserva: int,
    body: CancelarReservaClienteSchema,
    usuario_actual: dict = Depends(verificar_token),
    db: Session = Depends(get_db),
):
    """
    Permite al cliente cancelar UNA de sus propias reservas.
    Reglas:
    - Solo si la reserva pertenece al cliente autenticado.
    - Solo si el estado actual es pendiente, confirmada o en curso.
    - Requiere motivo_cancelacion (máx. 250 caracteres).
    """
    id_credencial = usuario_actual.get("id")
    if not id_credencial:
        raise HTTPException(status_code=401, detail="Token inválido")

    # Obtener documento del cliente autenticado
    perfil = list_queries.obtener_usuario_por_id_credencial(db, id_credencial)
    if not perfil:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    documento = int(perfil["documento"])

    # Verificar que la reserva exista y pertenezca a este cliente
    row = db.execute(
        text('SELECT documento, estado_reserva FROM "Reserva" WHERE id_reserva = :id'),
        {"id": id_reserva},
    ).fetchone()
    if not row:
        raise HTTPException(status_code=404, detail="Reserva no encontrada")

    doc_reserva, estado_actual_raw = row[0], row[1]
    if int(doc_reserva) != documento:
        raise HTTPException(status_code=403, detail="No tienes permiso para cancelar esta reserva")

    estado_actual = (estado_actual_raw or "").strip().lower()
    if estado_actual == "cancelada":
        return {
            "ok": True,
            "id_reserva": id_reserva,
            "nuevo_estado": "cancelada",
            "mensaje": "La reserva ya estaba cancelada",
        }

    # Cliente puede cancelar si la reserva aún no ha finalizado
    if estado_actual not in ("pendiente", "confirmada", "en curso"):
        raise HTTPException(
            status_code=400,
            detail="Solo puedes cancelar reservas pendientes o activas.",
        )

    motivo = (body.motivo_cancelacion or "").strip()
    if not motivo:
        raise HTTPException(
            status_code=400,
            detail="El motivo de cancelación es obligatorio",
        )

    try:
        # Actualizar estado y motivo
        actualizar_estado_reserva(db, id_reserva, "cancelada")
        actualizar_motivo_cancelacion(db, id_reserva, motivo)
        return {"ok": True, "id_reserva": id_reserva, "nuevo_estado": "cancelada"}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/listar_cliente")
async def listar_cliente(
    documento: int = Query(..., description="Documento del cliente"),
    db: Session = Depends(get_db),
):
    respuesta = list_queries.obtener_usuario(db, str(documento))
    if not respuesta:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")

    rol = list_queries.obtener_rol(db, int(respuesta.get("id_rol")))
    nombre_rol = (rol or {}).get("nombre_rol", "").strip().lower()
    if nombre_rol != "cliente":
        raise HTTPException(status_code=404, detail="Cliente no encontrado")

    return {"respuesta": respuesta}

@router.get("/listar_clientes")
async def listar_clientes(db: Session = Depends(get_db)):
    respuesta = list_queries.obtener_usuarios_por_rol(db, "cliente")
    return {"respuesta": respuesta}

@router.put("/editarcliente")
async def editar(data: ClienteUpdate, db: Session = Depends(get_db)):
    existente = list_queries.obtener_usuario(db, str(data.documento))
    if not existente:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")
    rol = list_queries.obtener_rol(db, int(existente.get("id_rol")))
    if ((rol or {}).get("nombre_rol", "").strip().lower()) != "cliente":
        raise HTTPException(status_code=400, detail="El documento no pertenece a un cliente")

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
    existente = list_queries.obtener_usuario(db, str(data.documento))
    if not existente:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")
    rol = list_queries.obtener_rol(db, int(existente.get("id_rol")))
    if ((rol or {}).get("nombre_rol", "").strip().lower()) != "cliente":
        raise HTTPException(status_code=400, detail="El documento no pertenece a un cliente")

    usuario_crud.borrar_usuario(db, data.documento)
