from sqlalchemy.orm import Session
from sqlalchemy import text

def insertar_dueno(db: Session, nombre1: str, nombre2: str, apellido1: str, apellido2: str, id_rol: int, id_credencial: int):
    db.execute(
        text('SELECT insertar_dueno(:nombre1, :nombre2, :apellido1, :apellido2, :id_rol, :id_credencial)'),
        {'nombre1': nombre1, 'nombre2': nombre2, 'apellido1': apellido1, 'apellido2': apellido2, 'id_rol': id_rol, 'id_credencial': id_credencial}
    )
    db.commit()

def editar_dueno(db: Session, id_dueno: int, nombre1: str, nombre2: str, apellido1: str, apellido2: str, id_rol: int, id_credencial: int):
    db.execute(
        text('SELECT editar_dueno(:id_dueno, :nombre1, :nombre2, :apellido1, :apellido2, :id_rol, :id_credencial)'),
        {'id_dueno': id_dueno, 'nombre1': nombre1, 'nombre2': nombre2, 'apellido1': apellido1, 'apellido2': apellido2, 'id_rol': id_rol, 'id_credencial': id_credencial}
    )
    db.commit()

def borrar_dueno(db: Session, id_dueno: int):
    db.execute(
        text('SELECT borrar_dueno(:id_dueno)'),
        {'id_dueno': id_dueno}
    )
    db.commit()
