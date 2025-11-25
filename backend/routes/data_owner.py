from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from config import get_db
from funciones.data_owner.data_owner import obtener_estadisticas_dueno
from funciones.auth.dependencies import verificar_token

router = APIRouter(
    tags=["Data Owner"]
)

@router.get("/metricas")
def get_estadisticas_dueno_actual(
    usuario_actual: dict = Depends(verificar_token),
    db: Session = Depends(get_db)
):
    """
    Obtiene las métricas del dueño que está logueado:
    - Total de restaurantes
    - Reservas activas
    - Ingresos del mes
    """
    try:
        id_credencial = usuario_actual["id"]
        data = obtener_estadisticas_dueno(id_credencial, db)
        return data
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener estadísticas: {str(e)}")
