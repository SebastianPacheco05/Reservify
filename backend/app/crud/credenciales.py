from sqlalchemy.orm import Session

def insertar_credencial(db: Session, email: str, password: str):
    db.execute("SELECT insertar_credenciales(:email, :password)", {"email": email, "password": password})
    db.commit()

def editar_credencial(db: Session, id_credencial: int, email: str, password: str):
    db.execute("SELECT editar_credenciales(:id, :email, :password)", {
        "id": id_credencial,
        "email": email,
        "password": password
    })
    db.commit()

def borrar_credencial(db: Session, id_credencial: int):
    db.execute("SELECT borrar_credenciales(:id)", {"id": id_credencial})
    db.commit()
