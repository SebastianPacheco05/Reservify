from sqlalchemy.orm import Session
from sqlalchemy import text

def insertar_credenciales(db: Session, email: str, password: str):
    db.execute(
        text('SELECT insertar_credenciales(:email, :password)'),
        {'email': email, 'password': password}
    )
    db.commit()

def editar_credenciales(db: Session, id_credencial: int, email: str, password: str):
    db.execute(
        text('SELECT editar_credenciales(:id, :email, :password)'),
        {'id': id_credencial, 'email': email, 'password': password}
    )
    db.commit()

def borrar_credenciales(db: Session, id_credencial: int):
    db.execute(
        text('SELECT borrar_credenciales(:id)'),
        {'id': id_credencial}
    )
    db.commit()
