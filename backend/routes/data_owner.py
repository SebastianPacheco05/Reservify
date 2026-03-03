from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from config import get_db
from functions.data_owner.data_owner import (
    obtener_estadisticas_gestor,
    obtener_reservas_gestor,
    obtener_restaurantes_gestor,
    obtener_reservas_por_nit,
    puede_acceder_restaurante,
    obtener_facturas_gestor,
    obtener_factura_detalle_gestor,
    enviar_factura_por_email,
    obtener_nit_por_reserva,
    obtener_email_cliente_por_reserva,
    actualizar_motivo_cancelacion,
    obtener_documento_dueno,
    es_dueño_de_restaurante,
    obtener_restaurante_completo_dueno,
    obtener_mesas_restaurante_dueno,
    obtener_mesas_restaurante_gestor,
    obtener_flujo_diario_gestor,
    obtener_metricas_mensuales_gestor,
    obtener_mi_balance_empleado,
    obtener_clientes_gestor,
    obtener_mi_restaurante_info,
    obtener_administrador_restaurante,
    asignar_administrador_restaurante,
    obtener_usuarios_asignables_dueno,
    obtener_empleados_con_restaurante_dueno,
    obtener_reservas_confirmadas_dueno,
    buscar_email_para_empleado,
    asignar_empleado_existente,
    crear_empleado_invitado,
    cambiar_rol_a_cliente,
)
from functions.auth.dependencies import verificar_token
from functions.cruds.reservation_status import actualizar_estado_reserva
from functions.email_sender.email_utils import send_email_with_config
from functions.email_sender.smtp_config_db import (
    get_smtp_config,
    get_smtp_config_para_dashboard,
    upsert_smtp_config,
    get_imap_config,
    get_imap_config_with_password,
    upsert_imap_config,
    insert_mails,
    get_mails_by_credencial,
    get_mail_by_uid,
)
from functions.email_sender.imap_inbox import fetch_inbox
from functions.data_owner.data_owner import obtener_contexto_gestor
from functions.cruds import restaurante as crud_restaurante, mesas as crud_mesas
from models import (
    ActualizarEstadoReservaSchema,
    SMTPConfigSchema,
    IMAPConfigSchema,
    ResponderCorreoSchema,
    RestauranteUpdate,
    MesaBase,
    MesaUpdate,
    MesaDelete,
    AsignarAdministradorSchema,
    BuscarEmailSchema,
    AsignarEmpleadoSchema,
    CrearEmpleadoSchema,
)

router = APIRouter(
    tags=["Data Owner"]
)

# Transiciones permitidas: pendiente -> confirmada | cancelada; confirmada/en curso -> cancelada
TRANSICIONES_PERMITIDAS = {
    "pendiente": ["confirmada", "cancelada"],
    "confirmada": ["cancelada"],
    "en curso": ["cancelada"],
}

@router.get("/metricas")
def get_estadisticas_gestor_actual(
    usuario_actual: dict = Depends(verificar_token),
    db: Session = Depends(get_db)
):
    """
    Métricas del gestor logueado (dueño: todos sus restaurantes; administrador: su único restaurante).
    """
    try:
        id_credencial = usuario_actual["id"]
        data = obtener_estadisticas_gestor(id_credencial, db)
        return data
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Error interno al obtener métricas del gestor",
        )


@router.get("/flujo-diario")
def get_flujo_diario(
    usuario_actual: dict = Depends(verificar_token),
    db: Session = Depends(get_db)
):
    """Flujo diario de reservas por hora (Dueño/Admin)."""
    try:
        id_credencial = usuario_actual["id"]
        data = obtener_flujo_diario_gestor(id_credencial, db)
        return data
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Error interno al obtener flujo diario",
        )


@router.get("/metricas-mensuales")
def get_metricas_mensuales(
    usuario_actual: dict = Depends(verificar_token),
    db: Session = Depends(get_db)
):
    """Métricas mensuales para gráfica (Dueño/Admin)."""
    try:
        id_credencial = usuario_actual["id"]
        data = obtener_metricas_mensuales_gestor(id_credencial, db)
        return data
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Error interno al obtener métricas mensuales",
        )


@router.get("/mi-balance")
def get_mi_balance(
    usuario_actual: dict = Depends(verificar_token),
    db: Session = Depends(get_db)
):
    """Balance del empleado (facturas con id_credencial_empleado = usuario)."""
    try:
        id_credencial = usuario_actual["id"]
        data = obtener_mi_balance_empleado(id_credencial, db)
        return data
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/clientes")
def get_clientes_gestor(
    usuario_actual: dict = Depends(verificar_token),
    db: Session = Depends(get_db)
):
    """Clientes con reservas en restaurantes del gestor (Dueño/Admin)."""
    try:
        id_credencial = usuario_actual["id"]
        data = obtener_clientes_gestor(id_credencial, db)
        return {"clientes": data}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/mi-restaurante-info")
def get_mi_restaurante_info(
    usuario_actual: dict = Depends(verificar_token),
    db: Session = Depends(get_db)
):
    """Info básica del restaurante del empleado/admin."""
    try:
        id_credencial = usuario_actual["id"]
        data = obtener_mi_restaurante_info(id_credencial, db)
        if not data:
            raise HTTPException(status_code=404, detail="No hay restaurante asignado.")
        return data
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/reservas")
def get_reservas_gestor_actual(
    usuario_actual: dict = Depends(verificar_token),
    db: Session = Depends(get_db)
):
    """
    Últimas 50 reservas del gestor (dueño: todos sus restaurantes; administrador: su restaurante).
    """
    try:
        id_credencial = usuario_actual["id"]
        reservas = obtener_reservas_gestor(id_credencial, db, limit=50)
        return {"reservas": reservas}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/reservas/todas")
def get_todas_reservas_gestor_actual(
    usuario_actual: dict = Depends(verificar_token),
    db: Session = Depends(get_db)
):
    """
    Todas las reservas del gestor (dueño o administrador).
    """
    try:
        id_credencial = usuario_actual["id"]
        reservas = obtener_reservas_gestor(id_credencial, db, limit=None)
        return {"reservas": reservas, "total": len(reservas)}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/restaurantes")
def get_restaurantes_gestor(
    usuario_actual: dict = Depends(verificar_token),
    db: Session = Depends(get_db)
):
    """
    Restaurantes del gestor (dueño: todos; administrador/empleado: solo el asignado).
    """
    try:
        id_credencial = usuario_actual["id"]
        restaurantes = obtener_restaurantes_gestor(id_credencial, db)
        return {"restaurantes": restaurantes}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


def _solo_dueno(id_credencial: int, db: Session) -> None:
    """Exige que el usuario sea dueño; si no, lanza 403."""
    obtener_documento_dueno(id_credencial, db)


def _puede_gestionar_restaurante(id_credencial: int, nit: int, db: Session) -> bool:
    """
    Devuelve True si el usuario actual puede gestionar la configuración del restaurante:
    - Dueño: cualquiera de sus restaurantes (por NIT)
    - Administrador: solo su restaurante asignado (mismo NIT)
    """
    ctx = obtener_contexto_gestor(id_credencial, db)
    if ctx["tipo"] == "dueno":
        return es_dueño_de_restaurante(id_credencial, nit, db)
    if ctx["tipo"] == "administrador" and ctx.get("nit") is not None:
        try:
            return int(ctx["nit"]) == int(nit)
        except Exception:
            return False
    return False


@router.get("/restaurantes/{nit}")
def get_restaurante_config(
    nit: int,
    usuario_actual: dict = Depends(verificar_token),
    db: Session = Depends(get_db),
):
    """
    Detalle completo del restaurante para editar (solo dueño, solo sus restaurantes).
    """
    try:
        _solo_dueno(usuario_actual["id"], db)
        data = obtener_restaurante_completo_dueno(usuario_actual["id"], nit, db)
        if not data:
            raise HTTPException(status_code=404, detail="Restaurante no encontrado o no es tuyo.")
        return data
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/restaurantes/{nit}")
def put_restaurante_config(
    nit: int,
    body: RestauranteUpdate,
    usuario_actual: dict = Depends(verificar_token),
    db: Session = Depends(get_db),
):
    """
    Editar restaurante (solo dueño, solo sus restaurantes). No incluye url_imagen.
    """
    try:
        _solo_dueno(usuario_actual["id"], db)
        if body.nit != nit:
            raise HTTPException(status_code=400, detail="NIT no coincide.")
        if not es_dueño_de_restaurante(usuario_actual["id"], nit, db):
            raise HTTPException(status_code=403, detail="No eres dueño de este restaurante.")
        crud_restaurante.editar_restaurante(
            db,
            body.nit,
            body.direccion,
            body.nombre_restaurante,
            body.descripcion_restaurante,
            body.horario_apertura,
            body.horario_cierre,
            body.documento,
            body.id_categoria,
        )
        # Actualizar la antelación mínima directamente (no rompemos la función SQL existente).
        from sqlalchemy import text as sql_text
        db.execute(
            sql_text(
                'UPDATE "Restaurante" SET min_anticipacion_horas = :min_anticipacion WHERE nit = :nit'
            ),
            {
                "min_anticipacion": max(0, int(getattr(body, "min_anticipacion_horas", 0) or 0)),
                "nit": body.nit,
            },
        )
        db.commit()
        return {"ok": True}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/restaurantes/{nit}/mesas")
def get_mesas_restaurante(
    nit: int,
    usuario_actual: dict = Depends(verificar_token),
    db: Session = Depends(get_db),
):
    """Lista mesas del restaurante (dueño/admin/empleado con puede_acceder)."""
    try:
        if not puede_acceder_restaurante(usuario_actual["id"], nit, db):
            raise HTTPException(status_code=403, detail="No tienes acceso a este restaurante.")
        mesas = obtener_mesas_restaurante_gestor(usuario_actual["id"], nit, db)
        return {"mesas": mesas}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/restaurantes/{nit}/mesas")
def post_mesa_restaurante(
    nit: int,
    body: MesaBase,
    usuario_actual: dict = Depends(verificar_token),
    db: Session = Depends(get_db),
):
    """Agregar mesa al restaurante (dueño o administrador de ese restaurante). Se ignora body.nit y se usa el nit de la URL."""
    try:
        if not _puede_gestionar_restaurante(usuario_actual["id"], nit, db):
            raise HTTPException(
                status_code=403,
                detail="No tienes permisos para gestionar las mesas de este restaurante.",
            )
        crud_mesas.insertar_mesas(
            db,
            body.estado_de_disponibilidad,
            body.cant_personas,
            nit,
            body.precio,
        )
        return {"ok": True}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/restaurantes/{nit}/mesas/{id_mesa}")
def put_mesa_restaurante(
    nit: int,
    id_mesa: int,
    body: MesaUpdate,
    usuario_actual: dict = Depends(verificar_token),
    db: Session = Depends(get_db),
):
    """Editar mesa (dueño o administrador del restaurante)."""
    try:
        if not _puede_gestionar_restaurante(usuario_actual["id"], nit, db):
            raise HTTPException(
                status_code=403,
                detail="No tienes permisos para gestionar las mesas de este restaurante.",
            )
        if body.nit != nit:
            raise HTTPException(status_code=400, detail="El NIT de la mesa debe ser el del restaurante.")
        crud_mesas.editar_mesas(
            db,
            id_mesa,
            body.estado_de_disponibilidad,
            body.cant_personas,
            nit,
            body.precio,
        )
        return {"ok": True}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/restaurantes/{nit}/mesas/{id_mesa}")
def delete_mesa_restaurante(
    nit: int,
    id_mesa: int,
    usuario_actual: dict = Depends(verificar_token),
    db: Session = Depends(get_db),
):
    """Eliminar mesa (dueño o administrador del restaurante)."""
    try:
        if not _puede_gestionar_restaurante(usuario_actual["id"], nit, db):
            raise HTTPException(
                status_code=403,
                detail="No tienes permisos para gestionar las mesas de este restaurante.",
            )
        crud_mesas.borrar_mesas(db, id_mesa)
        return {"ok": True}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/restaurantes/{nit}/administrador")
def get_administrador_restaurante(
    nit: int,
    usuario_actual: dict = Depends(verificar_token),
    db: Session = Depends(get_db),
):
    """Obtener el administrador asignado a este restaurante (solo dueño, un solo admin por restaurante)."""
    try:
        _solo_dueno(usuario_actual["id"], db)
        if not es_dueño_de_restaurante(usuario_actual["id"], nit, db):
            raise HTTPException(status_code=403, detail="No eres dueño de este restaurante.")
        admin = obtener_administrador_restaurante(nit, db)
        return {"administrador": admin}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/restaurantes/{nit}/administrador")
def put_administrador_restaurante(
    nit: int,
    body: AsignarAdministradorSchema,
    usuario_actual: dict = Depends(verificar_token),
    db: Session = Depends(get_db),
):
    """Asignar un único administrador al restaurante (solo dueño). Reemplaza al anterior si existía."""
    try:
        asignar_administrador_restaurante(usuario_actual["id"], nit, body.id_credencial, db)
        return {"ok": True}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/empleados")
def get_empleados_dueno(
    usuario_actual: dict = Depends(verificar_token),
    db: Session = Depends(get_db),
):
    """Lista usuarios que el dueño puede asignar como administrador (empleados/admins de sus restaurantes). Solo dueño."""
    try:
        _solo_dueno(usuario_actual["id"], db)
        lista = obtener_usuarios_asignables_dueno(usuario_actual["id"], db)
        return {"empleados": lista}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/empleados-con-reservas")
def get_empleados_con_reservas(
    usuario_actual: dict = Depends(verificar_token),
    db: Session = Depends(get_db),
):
    """Lista empleados del dueño con nombre de restaurante y todas las reservas aceptadas (confirmadas). Solo dueño."""
    try:
        _solo_dueno(usuario_actual["id"], db)
        empleados = obtener_empleados_con_restaurante_dueno(usuario_actual["id"], db)
        reservas_confirmadas = obtener_reservas_confirmadas_dueno(usuario_actual["id"], db, limit=200)
        return {"empleados": empleados, "reservas_confirmadas": reservas_confirmadas}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/buscar-email")
def post_buscar_email(
    body: BuscarEmailSchema,
    usuario_actual: dict = Depends(verificar_token),
    db: Session = Depends(get_db),
):
    """Comprueba si un email existe en la base de datos (para asignar o crear empleado). Solo dueño."""
    try:
        _solo_dueno(usuario_actual["id"], db)
        resultado = buscar_email_para_empleado(body.email, db)
        return resultado
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/restaurantes/{nit}/asignar-empleado")
def post_asignar_empleado(
    nit: int,
    body: AsignarEmpleadoSchema,
    usuario_actual: dict = Depends(verificar_token),
    db: Session = Depends(get_db),
):
    """Asigna un usuario existente como empleado del restaurante. Solo dueño."""
    try:
        _solo_dueno(usuario_actual["id"], db)
        if not es_dueño_de_restaurante(usuario_actual["id"], nit, db):
            raise HTTPException(status_code=403, detail="No eres dueño de este restaurante.")
        asignar_empleado_existente(usuario_actual["id"], body.id_credencial, nit, db)
        return {"ok": True}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/cambiar-rol-cliente")
def post_cambiar_rol_cliente(
    body: AsignarEmpleadoSchema,
    usuario_actual: dict = Depends(verificar_token),
    db: Session = Depends(get_db),
):
    """
    Cambia el rol de un empleado o administrador a cliente.
    - Dueño: puede cambiar empleados/admins de cualquiera de sus restaurantes.
    - Administrador: puede cambiar empleados/admins de su restaurante asignado.
    """
    try:
        cambiar_rol_a_cliente(usuario_actual["id"], body.id_credencial, db)
        return {"ok": True}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/restaurantes/{nit}/crear-empleado")
def post_crear_empleado(
    nit: int,
    body: CrearEmpleadoSchema,
    usuario_actual: dict = Depends(verificar_token),
    db: Session = Depends(get_db),
):
    """Crea un nuevo empleado para el restaurante (email + contraseña aleatoria). Solo dueño. Devuelve email y password."""
    try:
        _solo_dueno(usuario_actual["id"], db)
        resultado = crear_empleado_invitado(usuario_actual["id"], body.email, nit, db)
        return resultado
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/restaurantes/{nit}/reservas")
def get_reservas_por_restaurante(
    nit: int,
    fecha: str | None = None,
    usuario_actual: dict = Depends(verificar_token),
    db: Session = Depends(get_db)
):
    """
    Listado de reservas de un restaurante por NIT.
    Query param fecha (YYYY-MM-DD) opcional para filtrar reservas del día.
    Solo dueño (si es su restaurante), administrador o empleado (si es su restaurante asignado).
    """
    try:
        id_credencial = usuario_actual["id"]
        if not puede_acceder_restaurante(id_credencial, nit, db):
            raise HTTPException(status_code=403, detail="No tiene acceso a este restaurante")
        reservas = obtener_reservas_por_nit(nit, db, limit=None, fecha=fecha)
        return {"reservas": reservas, "total": len(reservas)}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.patch("/reservas/{id_reserva}/estado")
def actualizar_estado_reserva_gestor(
    id_reserva: int,
    body: ActualizarEstadoReservaSchema,
    usuario_actual: dict = Depends(verificar_token),
    db: Session = Depends(get_db)
):
    """
    Cambia el estado de una reserva: pendiente -> confirmada | cancelada; confirmada/en curso -> cancelada.
    Si se cancela, motivo_cancelacion es obligatorio y se envía por correo al cliente.
    """
    try:
        id_credencial = usuario_actual["id"]
        nit = obtener_nit_por_reserva(id_reserva, db)
        if nit is None:
            raise HTTPException(status_code=404, detail="Reserva no encontrada")
        if not puede_acceder_restaurante(id_credencial, nit, db):
            raise HTTPException(status_code=403, detail="No tiene acceso a esta reserva")

        # Normalizar estado recibido (frontend usa "activa" como alias)
        nuevo_estado = body.nuevo_estado.strip().lower()
        if nuevo_estado == "activa":
            # En DB el estado equivalente es "confirmada"
            nuevo_estado = "confirmada"
        motivo = (body.motivo_cancelacion or "").strip()

        if nuevo_estado == "cancelada" and not motivo:
            raise HTTPException(
                status_code=400,
                detail="El motivo de cancelación es obligatorio al cancelar una reserva"
            )
        if nuevo_estado == "cancelada" and len(motivo) > 250:
            raise HTTPException(
                status_code=400,
                detail="El motivo de cancelación no puede superar los 250 caracteres"
            )

        # Obtener estado actual de la reserva
        from sqlalchemy import text
        row = db.execute(
            text('SELECT estado_reserva FROM "Reserva" WHERE id_reserva = :id'),
            {"id": id_reserva}
        ).fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Reserva no encontrada")
        estado_actual = (row[0] or "").strip().lower()

        permitidos = TRANSICIONES_PERMITIDAS.get(estado_actual, [])
        if nuevo_estado not in permitidos:
            raise HTTPException(
                status_code=400,
                detail=f"No se puede pasar de '{estado_actual}' a '{nuevo_estado}'. Transiciones permitidas: {permitidos}"
            )

        actualizar_estado_reserva(db, id_reserva, nuevo_estado)

        if nuevo_estado == "cancelada":
            actualizar_motivo_cancelacion(db, id_reserva, motivo)
            email_cliente = obtener_email_cliente_por_reserva(id_reserva, db)
            if email_cliente:
                smtp_config = get_smtp_config(db, usuario_actual["id"])
                if smtp_config:
                    subject = "Reserva cancelada - Reservify"
                    message = f"Su reserva (ID {id_reserva}) ha sido cancelada.\n\nMotivo: {motivo}"
                    send_email_with_config(smtp_config, email_cliente, subject, message)

        return {"ok": True, "id_reserva": id_reserva, "nuevo_estado": nuevo_estado}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


# --- Facturas del gestor ---

@router.get("/facturas")
def get_facturas_gestor(
    limit: int = 100,
    usuario_actual: dict = Depends(verificar_token),
    db: Session = Depends(get_db),
):
    """
    Lista facturas del gestor (dueño: todos sus restaurantes; administrador/empleado: su restaurante).
    """
    try:
        facturas = obtener_facturas_gestor(usuario_actual["id"], db, limit=limit)
        return {"facturas": facturas}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/facturas/{id_encab_fact}")
def get_factura_detalle(
    id_encab_fact: int,
    usuario_actual: dict = Depends(verificar_token),
    db: Session = Depends(get_db),
):
    """
    Detalle de una factura (encabezado + líneas). Solo si el gestor tiene acceso.
    """
    try:
        data = obtener_factura_detalle_gestor(usuario_actual["id"], id_encab_fact, db)
        if not data:
            raise HTTPException(status_code=404, detail="Factura no encontrada o no tiene acceso")
        return data
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/facturas/{id_encab_fact}/enviar")
def post_enviar_factura(
    id_encab_fact: int,
    usuario_actual: dict = Depends(verificar_token),
    db: Session = Depends(get_db),
):
    """
    Envía la factura por email al cliente. Requiere SMTP configurado en Configuración.
    Solo si el gestor tiene acceso a la factura.
    """
    try:
        ok, mensaje = enviar_factura_por_email(usuario_actual["id"], id_encab_fact, db)
        if not ok:
            if "no tiene acceso" in mensaje or "no encontrada" in mensaje:
                raise HTTPException(status_code=404, detail=mensaje)
            if "SMTP" in mensaje:
                raise HTTPException(status_code=503, detail=mensaje)
            if "email del cliente" in mensaje:
                raise HTTPException(status_code=400, detail=mensaje)
            raise HTTPException(status_code=502, detail=mensaje)
        return {"ok": True, "message": "Factura enviada por email"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# --- Configuración SMTP e IMAP (solo admin, dueño, empleado en dashboard) ---

@router.get("/config/smtp")
def get_config_smtp(
    usuario_actual: dict = Depends(verificar_token),
    db: Session = Depends(get_db)
):
    """Obtiene la configuración SMTP del usuario actual (solo gestores). No devuelve la contraseña."""
    try:
        obtener_contexto_gestor(usuario_actual["id"], db)
        config = get_smtp_config_para_dashboard(db, usuario_actual["id"])
        return config if config is not None else {}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/config/smtp")
def put_config_smtp(
    body: SMTPConfigSchema,
    usuario_actual: dict = Depends(verificar_token),
    db: Session = Depends(get_db)
):
    """Crea o actualiza la configuración SMTP del usuario actual (solo gestores)."""
    try:
        obtener_contexto_gestor(usuario_actual["id"], db)
        upsert_smtp_config(
            db,
            id_credencial=usuario_actual["id"],
            host=body.host,
            port=body.port,
            usuario=body.usuario,
            from_email=body.from_email,
            password_encrypted=body.password_encrypted,
            consentimiento_archivo=body.consentimiento_archivo,
        )
        return {"ok": True}
    except HTTPException:
        raise
    except ValueError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/config/imap")
def get_config_imap(
    usuario_actual: dict = Depends(verificar_token),
    db: Session = Depends(get_db)
):
    """Obtiene la configuración IMAP del usuario actual (solo gestores). No devuelve la contraseña."""
    try:
        obtener_contexto_gestor(usuario_actual["id"], db)
        config = get_imap_config(db, usuario_actual["id"])
        return config if config is not None else {}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/config/imap")
def put_config_imap(
    body: IMAPConfigSchema,
    usuario_actual: dict = Depends(verificar_token),
    db: Session = Depends(get_db)
):
    """Crea o actualiza la configuración IMAP del usuario actual (solo gestores)."""
    try:
        obtener_contexto_gestor(usuario_actual["id"], db)
        upsert_imap_config(
            db,
            id_credencial=usuario_actual["id"],
            host=body.host,
            port=body.port,
            usuario=body.usuario,
            password_encrypted=body.password_encrypted,
            consentimiento_archivo=body.consentimiento_archivo,
        )
        return {"ok": True}
    except HTTPException:
        raise
    except ValueError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/correos")
def get_correos(
    limit: int = 50,
    usuario_actual: dict = Depends(verificar_token),
    db: Session = Depends(get_db)
):
    """
    Lista los correos no leídos (UNSEEN) de la bandeja IMAP y los archiva en la tabla Mails.
    Solo gestores. Requiere IMAP configurado y consentimiento_archivo = True en Configuración.
    """
    try:
        obtener_contexto_gestor(usuario_actual["id"], db)
        config = get_imap_config_with_password(db, usuario_actual["id"])
        if not config or not config.get("password_encrypted"):
            raise HTTPException(
                status_code=503,
                detail="Configura IMAP en Configuración (host, usuario y contraseña) para ver los correos.",
            )
        if not config.get("consentimiento_archivo"):
            raise HTTPException(
                status_code=403,
                detail="Debes aceptar el archivado y conservación de correos en Configuración para usar este apartado.",
            )
        correos = fetch_inbox(
            host=config["host"],
            port=config["port"],
            usuario=config["usuario"],
            password=config["password_encrypted"],
            limit=min(limit, 100),
        )
        id_credencial = usuario_actual["id"]
        insert_mails(db, correos, id_credencial)
        # Devolver desde BD filtrado por usuario (SELECT rápido con índice)
        correos_list = get_mails_by_credencial(db, id_credencial, limit=min(limit, 100))
        return {"correos": correos_list}
    except HTTPException:
        raise
    except ValueError as e:
        raise HTTPException(status_code=502, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/correos/{uid}")
def get_correo_por_uid(
    uid: int,
    usuario_actual: dict = Depends(verificar_token),
    db: Session = Depends(get_db)
):
    """
    Devuelve un correo completo por imap_uid (desde tabla Mails: body_text, body_html).
    Solo gestores con consentimiento.
    """
    try:
        obtener_contexto_gestor(usuario_actual["id"], db)
        config = get_imap_config(db, usuario_actual["id"])
        if not config or not config.get("consentimiento_archivo"):
            raise HTTPException(
                status_code=403,
                detail="Debes aceptar el archivado en Configuración para ver el contenido.",
            )
        mail = get_mail_by_uid(db, uid, usuario_actual["id"])
        if not mail:
            raise HTTPException(status_code=404, detail="Correo no encontrado.")
        return mail
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/correos/responder")
def responder_correo(
    body: ResponderCorreoSchema,
    usuario_actual: dict = Depends(verificar_token),
    db: Session = Depends(get_db)
):
    """
    Envía un correo de respuesta usando la configuración SMTP del dashboard.
    Solo gestores.
    """
    try:
        obtener_contexto_gestor(usuario_actual["id"], db)
        smtp = get_smtp_config(db, usuario_actual["id"])
        if not smtp or not smtp.get("password_encrypted"):
            raise HTTPException(
                status_code=503,
                detail="Configura SMTP en Configuración para poder enviar respuestas.",
            )
        ok = send_email_with_config(
            smtp,
            body.to_email,
            body.subject,
            body.body,
        )
        if not ok:
            raise HTTPException(status_code=502, detail="No se pudo enviar el correo.")
        return {"ok": True}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
