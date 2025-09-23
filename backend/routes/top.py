from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from config import get_db
from funciones.auth.dependencies import verificar_token
from funciones.top.top import obtener_top_restaurantes

app = APIRouter()

@app.get("/top")
async def get_top_restaurantes(db: Session = Depends(get_db)):
    return obtener_top_restaurantes(db)