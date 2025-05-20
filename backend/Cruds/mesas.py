from sqlalchemy.orm import Session
from sqlalchemy import text

def insertar_mesas(db: Session, estado_de_disponibilidad: bool, cant_personas: int, NIT: int, precio: float):
    db.execute(
        text('SELECT insertar_mesas(:estado_de_disponibilidad, :cant_personas, :NIT, :precio)'),
        {'estado_de_disponibilidad': estado_de_disponibilidad, 'cant_personas': cant_personas, 'NIT': NIT, 'precio': precio}
    )
    db.commit()

def editar_mesas(db: Session, id_mesa: int, estado_de_disponibilidad: bool, cant_personas: int, NIT: int, precio: float):
    db.execute(
        text('SELECT editar_mesas(:id_mesa, :estado_de_disponibilidad, :cant_personas, :NIT, :precio)'),
        {'id_mesa': id_mesa, 'estado_de_disponibilidad': estado_de_disponibilidad, 'cant_personas': cant_personas, 'NIT': NIT, 'precio': precio}
    )
    db.commit()

def borrar_mesas(db: Session, id_mesa: int):
    db.execute(
        text('SELECT borrar_mesas(:id_mesa)'),
        {'id_mesa': id_mesa}
    )
    db.commit()
