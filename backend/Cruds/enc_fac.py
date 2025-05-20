from sqlalchemy.orm import Session
from sqlalchemy import text

def insertar_enc_fac(db: Session, NIT: int, nombre_restaurante: str, direccion: str, ciudad: str, fecha: str, id_cliente: int):
    db.execute(
        text('SELECT insertar_enc_fac(:NIT, :nombre_restaurante, :direccion, :ciudad, :fecha, :id_cliente)'),
        {'NIT': NIT, 'nombre_restaurante': nombre_restaurante, 'direccion': direccion, 'ciudad': ciudad, 'fecha': fecha, 'id_cliente': id_cliente}
    )
    db.commit()

def editar_enc_fac(db: Session, id_encab_fact: int, NIT: int, nombre_restaurante: str, direccion: str, ciudad: str, fecha: str, id_cliente: int):
    db.execute(
        text('SELECT editar_enc_fac(:id_encab_fact, :NIT, :nombre_restaurante, :direccion, :ciudad, :fecha, :id_cliente)'),
        {'id_encab_fact': id_encab_fact, 'NIT': NIT, 'nombre_restaurante': nombre_restaurante, 'direccion': direccion, 'ciudad': ciudad, 'fecha': fecha, 'id_cliente': id_cliente}
    )
    db.commit()

def borrar_enc_fac(db: Session, id_encab_fact: int):
    db.execute(
        text('SELECT borrar_enc_fac(:id_encab_fact)'),
        {'id_encab_fact': id_encab_fact}
    )
    db.commit()