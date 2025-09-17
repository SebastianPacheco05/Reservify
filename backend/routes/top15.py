from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from config import get_db
from funciones.auth.dependencies import verificar_token
from funciones.top.top15 import obtener_top15_restaurantes_temp

app = APIRouter()

@app.get("/top15")
async def get_top15_restaurantes(db: Session = Depends(get_db)):
    return obtener_top15_restaurantes_temp(db)