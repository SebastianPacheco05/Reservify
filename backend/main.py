from fastapi import FastAPI, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from config import SessionLocal
from scripts.Cruds import credenciales 

app = FastAPI()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

#Credenciales
class CredencialBase(BaseModel):
    email: str
    password: str

class CredencialUpdate(CredencialBase):
    id_credencial: int

class CredencialDelete(BaseModel):
    id_credencial: int
    

@app.post("/insertarcredencial")
def insertar(data: CredencialBase, db: Session = Depends(get_db)):
    credenciales.insertar_credenciales(db, data.email, data.password)
    return {"message": "Credenciales insertadas correctamente"}

@app.post("/editarcredencial")
def editar(data: CredencialUpdate, db: Session = Depends(get_db)):
    credenciales.editar_credenciales(db, data.id_credencial, data.email, data.password)
    return {"message": "Credenciales actualizadas correctamente"}

@app.post("/borrarcredencial")
def borrar(data: CredencialDelete, db: Session = Depends(get_db)):
    credenciales.borrar_credenciales(db, data.id_credencial)
    return {"message": "Credenciales eliminadas correctamente"}


