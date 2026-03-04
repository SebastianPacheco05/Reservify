from sqlalchemy.orm import Session
from sqlalchemy import text
from fastapi import HTTPException


def obtener_documento_por_email(db: Session, email: str) -> int:
    """
    Obtiene el documento del usuario a partir de su email usando la función
    del motor `get_documento_by_email`.
    """
    try:
        resultado = db.execute(
            text("SELECT get_documento_by_email(:email)"),
            {"email": email},
        ).scalar()

        if resultado is None:
            raise HTTPException(
                status_code=404,
                detail="No se encontró un usuario con este email",
            )

        return int(resultado)

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error al obtener documento del usuario: {str(e)}",
        )
