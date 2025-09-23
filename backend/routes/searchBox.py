from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from config import get_db
from funciones.auth.dependencies import verificar_token
from funciones.top.top import obtener_top_restaurantes
from funciones.filters.searchBox import busqueda_restaurante
from models import BuscarRestaurante

app = APIRouter()

@app.post("/buscar_restaurante")
async def buscar_restaurante(data: BuscarRestaurante, db: Session = Depends(get_db)):
    resultado = busqueda_restaurante(db, data.nombre_restaurante)
    return {"respuesta": resultado}