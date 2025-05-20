from sqlalchemy.orm import Session
from sqlalchemy import text

def insertar_reserva(db: Session, id_mesa: int, id_cliente: int, id_encab_fact: int, horario: str, fecha: str):
    db.execute(
        text('SELECT insertar_reserva(:id_mesa, :id_cliente, :id_encab_fact, :horario, :fecha)'),
        {'id_mesa': id_mesa, 'id_cliente': id_cliente, 'id_encab_fact': id_encab_fact, 'horario': horario, 'fecha': fecha}
    )
    db.commit()

def editar_reserva(db: Session, id_reserva: int, id_mesa: int, id_cliente: int, id_encab_fact: int, horario: str, fecha: str):
    db.execute(
        text('SELECT editar_reserva(:id_reserva, :id_mesa, :id_cliente, :id_encab_fact, :horario, :fecha)'),
        {'id_reserva': id_reserva, 'id_mesa': id_mesa, 'id_cliente': id_cliente, 'id_encab_fact': id_encab_fact, 'horario': horario, 'fecha': fecha}
    )
    db.commit()

def borrar_reserva(db: Session, id_reserva: int):
    db.execute(
        text('SELECT borrar_reserva(:id_reserva)'),
        {'id_reserva': id_reserva}
    )
    db.commit()