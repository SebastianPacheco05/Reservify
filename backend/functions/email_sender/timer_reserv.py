import asyncio
from datetime import datetime, timedelta

from sqlalchemy import text
from sqlalchemy.exc import OperationalError
from sqlalchemy.orm import Session

from config import SessionLocal
from functions.email_sender.email_utils import send_email
from models import EmailSchema

# Ejecutar alineado a cuartos de hora: X:00, X:15, X:30, X:45.
INTERVALO_SEGUNDOS = 15 * 60

# Ventana para no "perder" el momento exacto (con intervalos de 15 min).
VENTANA_ENVIO = timedelta(minutes=10)

# Memoria en proceso para evitar duplicar correos (si el proceso no se reinicia).
enviados_2h = set()
enviados_1h = set()


def _formatear_hora_reserva(reserva_datetime: datetime) -> str:
    # Formato requerido: <Hora:Minuto:AM/PM>
    # Ej: "7:05:PM"
    return reserva_datetime.strftime("%I:%M:%p").lstrip("0")


def _construir_mensaje(
    nombre_usuario: str,
    nombre_restaurante: str,
    tiempo_faltante_texto: str,
    hora_formateada: str,
) -> str:
    return (
        f"Señor {nombre_usuario} tienes una reserva para el Restaurante \"{nombre_restaurante}\" "
        f"dentro de {tiempo_faltante_texto} es decir {hora_formateada}. "
        "Es importante que no faltes, porque no se reembolsara el dinero por cuestiones de tiempo.\n\n"
        "Gracias\nEquipo tecnico de Reservify"
    )


def _fetch_reservas_confirmadas_once(db: Session) -> list[tuple]:
    required_tables = {"Reserva", "Usuario", "Credenciales", "Mesas", "Restaurante"}
    tables_query = text(
        """
        SELECT tablename
        FROM pg_tables
        WHERE schemaname = 'public'
          AND tablename = ANY(:tables)
        """
    )
    existing_tables = {
        row[0]
        for row in db.execute(
            tables_query, {"tables": list(required_tables)}
        ).fetchall()
    }
    missing_tables = required_tables - existing_tables
    if missing_tables:
        print(
            "tarea_programada omitida: faltan tablas requeridas ->",
            ", ".join(sorted(missing_tables)),
        )
        return []

    query = text(
        """
        SELECT
            r.id_reserva,
            r.fecha,
            r.horario,
            u.nombre,
            u.apellido,
            c.email,
            re.nombre_restaurante
        FROM "Reserva" r
        JOIN "Usuario" u ON u.documento = r.documento
        JOIN "Credenciales" c ON c.id_credencial = u.id_credencial
        JOIN "Mesas" m ON m.id_mesa = r.id_mesa
        JOIN "Restaurante" re ON re.nit = m.nit
        WHERE
            r.estado_reserva = 'confirmada'
            AND r.fecha BETWEEN CURRENT_DATE AND (CURRENT_DATE + INTERVAL '1 day')::date
        """
    )
    return db.execute(query).fetchall()


def _fetch_reservas_confirmadas() -> list[tuple]:
    """
    Obtiene reservas confirmadas con lo necesario para construir el correo:
    nombre/apellido, email del cliente y nombre del restaurante.
    Reintenta una vez si la conexión se cerró (p. ej. SSL idle).
    """
    for attempt in range(2):
        db: Session = SessionLocal()
        try:
            return _fetch_reservas_confirmadas_once(db)
        except OperationalError:
            if attempt == 0:
                continue
            raise
        finally:
            db.close()


def _segundos_hasta_siguiente_cuarto_de_hora(now: datetime) -> float:
    """
    Devuelve los segundos hasta el siguiente minuto múltiplo de 15.
    Ejemplo: 10:07 -> hasta 10:15; 10:15 -> hasta 10:30.
    """
    siguiente_min = (now.minute // 15 + 1) * 15
    if siguiente_min >= 60:
        siguiente = (now + timedelta(hours=1)).replace(
            minute=0, second=0, microsecond=0
        )
    else:
        siguiente = now.replace(minute=siguiente_min, second=0, microsecond=0)
    return (siguiente - now).total_seconds()


async def tarea_programada():
    # Dar tiempo al servidor para completar el arranque.
    await asyncio.sleep(60)

    while True:
        try:
            ahora = datetime.now()
            segundos = _segundos_hasta_siguiente_cuarto_de_hora(ahora)
            if segundos > 0:
                await asyncio.sleep(segundos)
            ahora = datetime.now()

            print(f"[{ahora.strftime('%H:%M:%S')}] Ejecutando tarea_programada (15 min)...")

            reservas = await asyncio.to_thread(_fetch_reservas_confirmadas)

            for (
                id_reserva,
                fecha,
                horario,
                nombre,
                apellido,
                email_cliente,
                nombre_restaurante,
            ) in reservas:
                if not horario or not fecha:
                    continue

                reserva_datetime = datetime.combine(fecha, horario)

                # Solo reservas futuras (activa).
                if reserva_datetime <= ahora:
                    continue

                tiempo_restante = reserva_datetime - ahora

                # Envío a T-2h
                if (
                    id_reserva not in enviados_2h
                    and abs(tiempo_restante - timedelta(hours=2)) <= VENTANA_ENVIO
                ):
                    hora_formateada = _formatear_hora_reserva(reserva_datetime)
                    nombre_usuario = f"{nombre} {apellido}".strip()

                    email_data = EmailSchema(
                        to=email_cliente,
                        subject="Reservify - Recordatorio de tu reserva (2 horas)",
                        message=_construir_mensaje(
                            nombre_usuario=nombre_usuario,
                            nombre_restaurante=nombre_restaurante,
                            tiempo_faltante_texto="2 horas",
                            hora_formateada=hora_formateada,
                        ),
                    )
                    enviado = await asyncio.to_thread(
                        send_email, email_data.to, email_data.subject, email_data.message
                    )
                    if enviado:
                        enviados_2h.add(id_reserva)

                # Envío a T-1h
                if (
                    id_reserva not in enviados_1h
                    and abs(tiempo_restante - timedelta(hours=1)) <= VENTANA_ENVIO
                ):
                    hora_formateada = _formatear_hora_reserva(reserva_datetime)
                    nombre_usuario = f"{nombre} {apellido}".strip()

                    email_data = EmailSchema(
                        to=email_cliente,
                        subject="Reservify - Recordatorio de tu reserva (1 hora)",
                        message=_construir_mensaje(
                            nombre_usuario=nombre_usuario,
                            nombre_restaurante=nombre_restaurante,
                            tiempo_faltante_texto="1 hora",
                            hora_formateada=hora_formateada,
                        ),
                    )
                    enviado = await asyncio.to_thread(
                        send_email, email_data.to, email_data.subject, email_data.message
                    )
                    if enviado:
                        enviados_1h.add(id_reserva)

        except Exception as e:
            print("Error en tarea_programada:", e)

        # El siguiente ciclo se alinea en el encabezado del while.
