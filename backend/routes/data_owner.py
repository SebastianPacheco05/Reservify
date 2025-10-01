from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from config import get_db
from funciones.data_owner.data_owner import obtener_estadisticas_dueno

router = APIRouter(
    tags=["Data Owner"]
)

@router.get("/{documento_dueno}")
def get_estadisticas_dueno(documento_dueno: int, db: Session = Depends(get_db)):
    try:
        data = obtener_estadisticas_dueno(documento_dueno, db)
        return {"documento_dueno": documento_dueno, "estadisticas": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener estadísticas: {str(e)}")
