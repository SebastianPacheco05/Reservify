from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.crud import cliente as crud


app = FastAPI()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/usuarios/")
def crear_usuario(nombre: str, email: str, db: Session = Depends(get_db)):
    return crud.crear_usuario(db, nombre, email)
