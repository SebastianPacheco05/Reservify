"""
Endpoints para el mapa: restaurantes con coordenadas desde tabla MAPA y actualización de posiciones.
GET /restaurantes: devuelve restaurantes con lat/lng (desde MAPA o generados).
PUT /mapa: actualiza o inserta coordenadas de un restaurante en MAPA.
"""
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from config import get_db
from funciones.cruds import list as restaurante_queries

router = APIRouter(tags=["Restaurantes (mapa)"])


class MapaUpdate(BaseModel):
    nit: int
    lat: float
    lng: float


@router.get("/restaurantes")
async def get_restaurantes_cercanos(
    lat: float = 4.6097,
    lng: float = -74.0817,
    db: Session = Depends(get_db),
):
    """
    Devuelve restaurantes con coordenadas (lat, lng) para el mapa.
    Usa la tabla MAPA cuando existe; si no, genera puntos cercanos a (lat, lng).
    """
    return restaurante_queries.obtener_restaurantes_para_mapa(db, lat_usuario=lat, lng_usuario=lng)


@router.put("/mapa")
async def actualizar_posicion_mapa(
    body: MapaUpdate,
    db: Session = Depends(get_db),
):
    """
    Inserta o actualiza las coordenadas de un restaurante en la tabla MAPA.
    Permite colocar todos los restaurantes en el mapa con su posición real.
    """
    try:
        restaurante_queries.upsert_mapa(db, body.nit, body.lat, body.lng)
        return {"ok": True, "nit": body.nit, "lat": body.lat, "lng": body.lng}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
