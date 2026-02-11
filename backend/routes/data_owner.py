from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from config import get_db
from funciones.data_owner.data_owner import obtener_estadisticas_gestor, obtener_reservas_gestor, obtener_restaurantes_gestor
from funciones.auth.dependencies import verificar_token

router = APIRouter(
    tags=["Data Owner"]
)

@router.get("/metricas")
def get_estadisticas_gestor_actual(
    usuario_actual: dict = Depends(verificar_token),
    db: Session = Depends(get_db)
):
    """
    Métricas del gestor logueado (dueño: todos sus restaurantes; administrador: su único restaurante).
    """
    try:
        id_credencial = usuario_actual["id"]
        data = obtener_estadisticas_gestor(id_credencial, db)
        return data
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/reservas")
def get_reservas_gestor_actual(
    usuario_actual: dict = Depends(verificar_token),
    db: Session = Depends(get_db)
):
    """
    Últimas 50 reservas del gestor (dueño: todos sus restaurantes; administrador: su restaurante).
    """
    try:
        id_credencial = usuario_actual["id"]
        reservas = obtener_reservas_gestor(id_credencial, db, limit=50)
        return {"reservas": reservas}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/reservas/todas")
def get_todas_reservas_gestor_actual(
    usuario_actual: dict = Depends(verificar_token),
    db: Session = Depends(get_db)
):
    """
    Todas las reservas del gestor (dueño o administrador).
    """
    try:
        id_credencial = usuario_actual["id"]
        reservas = obtener_reservas_gestor(id_credencial, db, limit=None)
        return {"reservas": reservas, "total": len(reservas)}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/restaurantes")
def get_restaurantes_gestor(
    usuario_actual: dict = Depends(verificar_token),
    db: Session = Depends(get_db)
):
    """
    Restaurantes del gestor (dueño: todos; administrador: solo el asignado).
    """
    try:
        id_credencial = usuario_actual["id"]
        restaurantes = obtener_restaurantes_gestor(id_credencial, db)
        return {"restaurantes": restaurantes}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
