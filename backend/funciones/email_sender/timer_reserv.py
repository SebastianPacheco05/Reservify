# from sqlalchemy.orm import Session
# from models import EmailSchema
# from fastapi import HTTPException
# from sqlalchemy import text
# from funciones.email_sender.email_utils import send_email
# from datetime import datetime, timedelta


# async def enviar_correo(data: EmailSchema):
#     enviado = send_email(data.to, data.subject, data.message)
#     if enviado:
#         return {"mensaje": "Correo enviado correctamente"}
#     else:
#         raise HTTPException(status_code=500, detail="No se pudo enviar el correo")


# async def send2hbf(db: Session, id_reserva: int):
#     result = db.execute(
#         text(
#             'SELECT id_mesa, id_cliente, horario, fecha FROM "Reserva" WHERE id_reserva = :id_reserva'
#         ),
#         {"id_reserva": id_reserva},
#     )
#     row = result.fetchone()
#     if row is None:
#         return None

#     horario = row[2]
#     fecha = row[3]

#     if horario and fecha:
#         # Combinar fecha y hora en un solo datetime
#         reserva_datetime = datetime.combine(fecha, horario)

#         # Obtener la hora actual
#         ahora = datetime.now()

#         # Si faltan 2 horas o menos
#         if timedelta(hours=0) <= (reserva_datetime - ahora) <= timedelta(hours=2):
#             email_data = EmailSchema(
#                 to="isiku.978@gmail.com",
#                 subject="En 2 horas tienes una reserva",
#                 message=f"La reserva con ID {id_reserva} es a las {reserva_datetime.strftime('%H:%M')} del {fecha}",
#             )
#             return await enviar_correo(email_data)

#     return None
