from fastapi import FastAPI, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from config import SessionLocal
from scripts.Cruds import credenciales, roles  

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

#Roles
class RolBase(BaseModel):
    id_rol: int
    nombre_rol: str
    descripcion: str

class RolUpdate(RolBase):
    id_rol: int
    nombre_rol: str
    descripcion: str

class RolDelete(BaseModel):
    id_rol: int

@app.post("/insertaroles")
def insertar(data: RolBase, db: Session = Depends(get_db)):
    roles.insertar_roles(db, data.id_rol, data.nombre_rol, data.descripcion)
    return {"message": "Rol insertado correctamente"}

@app.post("/editaroles")
def editar(data: RolUpdate, db: Session = Depends(get_db)):
    roles.editar_roles(db, data.id_rol, data.nombre_rol, data.descripcion)
    return {"message": "Rol actualizado correctamente"}

@app.post("/borraroles")
def borrar(data: RolDelete, db: Session = Depends(get_db)):
    roles.borrar_roles(db, data.id_rol)
    return {"message": "Rol eliminado correctamente"}
