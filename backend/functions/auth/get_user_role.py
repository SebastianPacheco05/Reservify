from sqlalchemy.orm import Session
from sqlalchemy import text

def obtener_rol_usuario(db: Session, id_credencial: int):
    """
    Obtiene el rol del usuario basado en su id_credencial desde la tabla Usuario.
    Retorna el nombre_rol, id_rol y tipo_usuario (dueno, empleado, cliente).
    """
    row = db.execute(
        text(
            """
            SELECT id_rol, nombre_rol
            FROM fn_auth_get_usuario_rol(:id_credencial)
            """
        ),
        {"id_credencial": id_credencial}
    ).fetchone()

    if not row:
        return None

    nombre_rol_raw = (row[1] or "").strip()
    nombre_rol = nombre_rol_raw.lower()
    if nombre_rol == "dueño":
        nombre_rol = "dueno"

    return {
        "id_rol": row[0],
        "nombre_rol": nombre_rol_raw,
        "tipo_usuario": nombre_rol or "cliente"
    }
