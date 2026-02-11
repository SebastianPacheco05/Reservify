from sqlalchemy.orm import Session
from sqlalchemy import text
from fastapi import HTTPException


def obtener_documento_por_email(db: Session, email: str) -> int:
    """
    Obtiene el documento del usuario a partir de su email.
    Solo devuelve el documento si el email existe y pertenece a un usuario (tabla Usuario).
    
    Args:
        db: Sesión de base de datos
        email: Email del usuario
        
    Returns:
        int: Documento del usuario
        
    Raises:
        HTTPException: Si el email no pertenece a un usuario
    """
    try:
        resultado = db.execute(
            text("SELECT get_documento_by_email(:email)"),
            {"email": email}
        ).scalar()
        
        if resultado is None:
            raise HTTPException(
                status_code=404, 
                detail="No se encontró un usuario con este email"
            )
        
        return int(resultado)
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Error al obtener documento del usuario: {str(e)}"
        )
