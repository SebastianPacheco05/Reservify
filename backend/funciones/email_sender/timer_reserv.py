from fastapi import FastAPI, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from datetime import datetime, timedelta
from funciones.email_sender.email_utils import send_email
from models import EmailSchema
from config import SessionLocal  # asegúrate de tener esto bien configurado
import asyncio

app = FastAPI()

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
            'SELECT id_mesa, id_cliente, horario, fecha FROM "Reserva" WHERE id_reserva = :id_reserva'
        ),
        {"id_reserva": id_reserva},
    )
    row = result.fetchone()
    if row is None:
        return None

    horario = row[2]
    fecha = row[3]

    if horario and fecha:
        reserva_datetime = datetime.combine(fecha, horario)
        ahora = datetime.now()

        if timedelta(hours=0) <= (reserva_datetime - ahora) <= timedelta(hours=2):
            email_data = EmailSchema(
                to="isiku.978@gmail.com",
                subject="En 2 horas tienes una reserva",
                message=f"La reserva con ID {id_reserva} es a las {reserva_datetime.strftime('%H:%M')} del {fecha}",
            )
            await enviar_correo(email_data)
            enviados.add(id_reserva)  # Marcar como enviado para no repetir
            return {"mensaje": f"Correo enviado para reserva {id_reserva}"}

    return None


# Tarea en segundo plano cada minuto
async def tarea_programada():
    while True:
        print(f"[{datetime.now().strftime('%H:%M:%S')}] Ejecutando tarea_programada...")

        try:
            db: Session = SessionLocal()
            reservas = db.execute(text('SELECT id_reserva FROM "Reserva"')).fetchall()

            for row in reservas:
                id_reserva = row[0]
                await send2hbf(db, id_reserva)

        except Exception as e:
            print("Error en tarea programada:", e)
        finally:
            db.close()

        await asyncio.sleep(60)  # espera 1 minuto


# Iniciar la tarea cuando arranca FastAPI
@app.on_event("startup")
async def iniciar():
    asyncio.create_task(tarea_programada())
