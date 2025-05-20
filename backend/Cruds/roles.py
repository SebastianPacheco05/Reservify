from sqlalchemy.orm import Session
from sqlalchemy import text

def insertar_roles(db: Session, nombre_rol: str, descripcion: str):
    db.execute(
        text('SELECT insertar_roles(:nombre_rol, :descripcion)'),
        {'nombre_rol': nombre_rol, 'descripcion': descripcion}
    )
    db.commit()

def editar_roles(db: Session, id_rol: int, nombre_rol: str, descripcion: str):
    db.execute(
        text('SELECT editar_roles(:id_rol, :nombre_rol, :descripcion)'),
        {'id_rol': id_rol, 'nombre_rol': nombre_rol, 'descripcion': descripcion}
    )
    db.commit()

def borrar_roles(db: Session, id_rol: int):
    db.execute(
        text('SELECT borrar_roles(:id_rol)'),
        {'id_rol': id_rol}
    )
    db.commit()
