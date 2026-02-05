from fastapi import HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from datetime import datetime, timedelta
from funciones.email_sender.email_utils import send_email
from models import EmailSchema
from config import SessionLocal  # asegúrate de tener esto bien configurado
import asyncio

# Diccionario temporal para saber qué correos ya se enviaron
enviados = set()


async def enviar_correo(data: EmailSchema):
    enviado = send_email(data.to, data.subject, data.message)
    if enviado:
        return {"mensaje": "Correo enviado correctamente"}
    else:
        raise HTTPException(status_code=500, detail="No se pudo enviar el correo")


async def send2hbf(db: Session, id_reserva: int):
    if id_reserva in enviados:
        return None  # Ya se envió para esta reserva

    result = db.execute(
        text(
            'SELECT id_mesa, horario, fecha FROM "Reserva" WHERE id_reserva = :id_reserva'
        ),
        {"id_reserva": id_reserva},
    )
    row = result.fetchone()
    if row is None:
        return None

    horario = row[1]
    fecha = row[2]

    if horario and fecha:
        reserva_datetime = datetime.combine(fecha, horario)
        ahora = datetime.now()

        if timedelta(hours=0) <= (reserva_datetime - ahora) <= timedelta(hours=2):
            email_data = EmailSchema(
                to="nataliabarajas412@gmail.com",
                subject="En 2 horas tienes una reserva",
                message=f"La reserva con ID {id_reserva} es a las {reserva_datetime.strftime('%H:%M')} del {fecha}",
            )
            await enviar_correo(email_data)
            enviados.add(id_reserva)  # Marcar como enviado para no repetir
            return {"mensaje": f"Correo enviado para reserva {id_reserva}"}

    return None


async def tarea_programada():
    while True:
        ahora = datetime.now()
        hora_actual = ahora.hour

        # Verificar si está en horario de trabajo (8 AM a 8 PM)
        if 8 <= hora_actual < 20:  # 8 AM a 7:59 PM
            print(f"[{ahora.strftime('%H:%M:%S')}] Ejecutando tarea_programada...")

            try:
                db: Session = SessionLocal()
                reservas = db.execute(
                    text('SELECT id_reserva FROM "Reserva"')
                ).fetchall()

                for row in reservas:
                    id_reserva = row[0]
                    await send2hbf(db, id_reserva)

            except Exception as e:
                print("Error en tarea programada:", e)
            finally:
                db.close()

            # Esperar 1 hora (3600 segundos)
            await asyncio.sleep(3600)
        else:
            # Calcular cuánto tiempo esperar hasta las 8:00 AM
            if hora_actual >= 20:  # Después de las 8 PM
                # Esperar hasta las 8:00 AM del día siguiente
                siguiente_ejecucion = (ahora + timedelta(days=1)).replace(
                    hour=8, minute=0, second=0, microsecond=0
                )
            else:  # Antes de las 8 AM
                # Esperar hasta las 8:00 AM del mismo día
                siguiente_ejecucion = ahora.replace(
                    hour=8, minute=0, second=0, microsecond=0
                )

            tiempo_espera = (siguiente_ejecucion - ahora).total_seconds()
            print(
                f"[{ahora.strftime('%H:%M:%S')}] Fuera del horario de trabajo (8AM-8PM). "
                f"Esperando {tiempo_espera/3600:.1f} horas hasta las {siguiente_ejecucion.strftime('%H:%M')}..."
            )
            await asyncio.sleep(tiempo_espera)
