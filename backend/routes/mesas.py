from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from uuid import UUID
from config import get_db
from functions.cruds import mesas, list as mesas_queries
from functions.auth.dependencies import verificar_token
from functions.data_owner.data_owner import puede_acceder_restaurante
from models import MesaBase, MesaUpdate, MesaDelete, ListarMesas

router = APIRouter(
    prefix="/mesas",
    tags=["Mesas"]
)


def _requerir_gestor_restaurante(usuario_actual: dict, restaurante_uid: str, db: Session) -> None:
    if not puede_acceder_restaurante(usuario_actual["id"], restaurante_uid, db):
        raise HTTPException(
            status_code=403,
            detail="No tienes permisos para gestionar las mesas de este restaurante.",
        )

@router.get("/restaurante/{restaurante_uid}")
async def obtener_mesas_por_restaurante(restaurante_uid: UUID, db: Session = Depends(get_db)):
    """Endpoint público para obtener las mesas de un restaurante por UID"""
    try:
        query = text('''
            SELECT 
                id_mesa,
                estado_de_disponibilidad,
                cant_personas,
                precio,
                "restaurante_uid" as restaurante_uid,
                descripcion
            FROM "Mesas"
            WHERE "restaurante_uid" = :restaurante_uid
        ''')
        result = db.execute(query, {"restaurante_uid": str(restaurante_uid)})
        rows = result.fetchall()

        return [
            {
                "id_mesa": row[0],
                "estado_de_disponibilidad": row[1],
                "cant_personas": row[2],
                "precio": float(row[3]) if row[3] else 0.0,
                "restaurante_uid": str(row[4]),
                "descripcion": row[5] or "",
            }
            for row in rows
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener mesas: {str(e)}")

@router.post("/insertarmesas")
async def insertar(
    data: MesaBase,
    usuario_actual: dict = Depends(verificar_token),
    db: Session = Depends(get_db),
):
    _requerir_gestor_restaurante(usuario_actual, data.restaurante_uid, db)

    mesas.insertar_mesas(
        db,
        data.estado_de_disponibilidad,
        data.cant_personas,
        data.restaurante_uid,
        data.precio,
        data.descripcion,
    )

@router.get("/listar_mesa")
async def listar_mesa(data: ListarMesas, db: Session = Depends(get_db)):
    respuesta = mesas_queries.obtener_mesa(db, data.id_mesa)
    return {"respuesta": respuesta}

@router.get("/listar_mesas")
async def listar_mesas(db: Session = Depends(get_db)):
    respuesta = mesas_queries.obtener_mesas(db)
    return {"respuesta": respuesta}

@router.put("/editarmesas")
async def editar(
    data: MesaUpdate,
    usuario_actual: dict = Depends(verificar_token),
    db: Session = Depends(get_db),
):
    _requerir_gestor_restaurante(usuario_actual, data.restaurante_uid, db)

    mesas.editar_mesas(
        db,
        data.id_mesa,
        data.estado_de_disponibilidad,
        data.cant_personas,
        data.restaurante_uid,
        data.precio,
        data.descripcion,
    )

@router.delete("/borrarmesas")
async def borrar(
    data: MesaDelete,
    usuario_actual: dict = Depends(verificar_token),
    db: Session = Depends(get_db),
):
    """
    Borra una mesa. Solo dueños/gestores del restaurante pueden hacerlo.
    """
    # Obtener UID de restaurante de la mesa antes de borrar
    row = db.execute(
        text('SELECT restaurante_uid FROM "Mesas" WHERE id_mesa = :id_mesa'),
        {"id_mesa": data.id_mesa},
    ).fetchone()
    if not row:
        raise HTTPException(status_code=404, detail="Mesa no encontrada")

    restaurante_uid = str(row[0])
    _requerir_gestor_restaurante(usuario_actual, restaurante_uid, db)

    mesas.borrar_mesas(db, data.id_mesa)
