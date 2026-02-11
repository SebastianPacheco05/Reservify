"""
Endpoints para el mapa: restaurantes con coordenadas desde Restaurante.lat/lng y actualización de posiciones.
GET /restaurantes: devuelve restaurantes con lat/lng (desde Restaurante o generados).
PUT /mapa: actualiza coordenadas (lat/lng) directamente en Restaurante.
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
    Usa Restaurante.lat/lng cuando existen; si no, genera puntos cercanos a (lat, lng).
    """
    return restaurante_queries.obtener_restaurantes_para_mapa(db, lat_usuario=lat, lng_usuario=lng)


@router.put("/mapa")
async def actualizar_posicion_mapa(
    body: MapaUpdate,
    db: Session = Depends(get_db),
):
    """
    Actualiza las coordenadas (lat/lng) del restaurante.
    """
    try:
        restaurante_queries.actualizar_coordenadas_restaurante(db, body.nit, body.lat, body.lng)
        return {"ok": True, "nit": body.nit, "lat": body.lat, "lng": body.lng}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
