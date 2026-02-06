from sqlalchemy.orm import Session
from sqlalchemy import text

def obtener_rol_usuario(db: Session, id_credencial: int):
    """
    Obtiene el rol del usuario basado en su id_credencial.
    Retorna el nombre_rol y id_rol del usuario.
    """
    # Verificar en qué tabla está el usuario y obtener su rol
    # Primero intentar Dueno
    dueno = db.execute(
        text("""
            SELECT d.id_rol, r.nombre_rol 
            FROM "Dueno" d
            JOIN "Roles" r ON d.id_rol = r.id_rol
            WHERE d.id_credencial = :id_credencial
        """),
        {"id_credencial": id_credencial}
    ).fetchone()
    
    if dueno:
        return {
            "id_rol": dueno[0],
            "nombre_rol": dueno[1],
            "tipo_usuario": "dueno"
        }
    
    # Intentar Empleado
    empleado = db.execute(
        text("""
            SELECT e.id_rol, r.nombre_rol 
            FROM "Empleado" e
            JOIN "Roles" r ON e.id_rol = r.id_rol
            WHERE e.id_credencial = :id_credencial
        """),
        {"id_credencial": id_credencial}
    ).fetchone()
    
    if empleado:
        return {
            "id_rol": empleado[0],
            "nombre_rol": empleado[1],
            "tipo_usuario": "empleado"
        }
    
    # Intentar Cliente
    cliente = db.execute(
        text("""
            SELECT c.id_rol, r.nombre_rol 
            FROM "Cliente" c
            JOIN "Roles" r ON c.id_rol = r.id_rol
            WHERE c.id_credencial = :id_credencial
        """),
        {"id_credencial": id_credencial}
    ).fetchone()
    
    if cliente:
        return {
            "id_rol": cliente[0],
            "nombre_rol": cliente[1],
            "tipo_usuario": "cliente"
        }
    
    return None
