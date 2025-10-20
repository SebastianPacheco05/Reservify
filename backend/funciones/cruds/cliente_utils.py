from sqlalchemy.orm import Session
from sqlalchemy import text
from fastapi import HTTPException


def obtener_documento_por_email(db: Session, email: str) -> int:
    """
    Obtiene el documento del cliente a partir de su email.
    Esta función es segura ya que solo devuelve el documento si el email existe y pertenece a un cliente.
    
    Args:
        db: Sesión de base de datos
        email: Email del cliente
        
    Returns:
        int: Documento del cliente
        
    Raises:
        HTTPException: Si el email no pertenece a un cliente
    """
    try:
        resultado = db.execute(
            text("SELECT get_documento_by_email(:email)"),
            {"email": email}
        ).scalar()
        
        if resultado is None:
            raise HTTPException(
                status_code=404, 
                detail="No se encontró un cliente con este email"
            )
        
        return int(resultado)
        
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Error al obtener documento del cliente: {str(e)}"
        )
