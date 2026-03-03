from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from config import get_db
from functions.auth.dependencies import verificar_token
from functions.cruds import det_fac, list as det_fac_queries
from functions.data_owner.data_owner import puede_acceder_restaurante
from models import Detalle_facturaBase, Detalle_facturaUpdate, Detalle_facturaDelete, ListarDetalleFactura

router = APIRouter(
    prefix="/detalle_factura",
    tags=["DetalleFactura"],
    dependencies=[Depends(verificar_token)]
)


def _requerir_acceso_a_detalle(
    usuario_actual: dict,
    id_det_fact: int,
    db: Session,
) -> int:
    """
    Verifica que el gestor tenga acceso al detalle de factura y devuelve el NIT asociado.
    """
    row = db.execute(
        text(
            """
            SELECT ef.nit
            FROM "Detalle_Factura" df
            JOIN "Encabezado_Factura" ef ON df.id_encab_fact = ef.id_encab_fact
            WHERE df.id_det_fact = :id
            """
        ),
        {"id": id_det_fact},
    ).fetchone()
    if not row:
        raise HTTPException(status_code=404, detail="Detalle de factura no encontrado")
    nit = int(row[0])
    if not puede_acceder_restaurante(usuario_actual["id"], nit, db):
        raise HTTPException(
            status_code=403,
            detail="No tienes acceso a este detalle de factura",
        )
    return nit

@router.post("/insertardetallefactura")
async def insertar(data: Detalle_facturaBase, db: Session = Depends(get_db)):
    det_fac.insertar_det_fac(
        db,
        data.descripcion,
        data.unidades,
        data.precio_unitario,
        data.precio_total,
        data.forma_pago,
        data.id_encab_fact,
    )

@router.get("/listar_detalle_factura")
async def listar_detalle_factura(
    data: ListarDetalleFactura,
    usuario_actual: dict = Depends(verificar_token),
    db: Session = Depends(get_db),
):
    _requerir_acceso_a_detalle(usuario_actual, data.id_det_fact, db)
    respuesta = det_fac_queries.obtener_detalle_factura(db, data.id_det_fact)
    return {"respuesta": respuesta}

@router.get("/listar_detalles_factura")
async def listar_detalles_factura(
    usuario_actual: dict = Depends(verificar_token),
    db: Session = Depends(get_db),
):
    """
    Lista detalles de factura solo de restaurantes a los que el gestor tiene acceso.
    """
    # Obtener todos los detalles y luego filtrar por acceso (mantiene compatibilidad simple)
    todos = det_fac_queries.obtener_detalles_factura(db)
    visibles = []
    for det in todos:
        id_det = det.get("id_det_fact")
        if id_det is None:
            continue
        try:
            _requerir_acceso_a_detalle(usuario_actual, int(id_det), db)
            visibles.append(det)
        except HTTPException:
            continue
    return {"respuesta": visibles}

@router.put("/editardetallefactura")
async def editar(
    data: Detalle_facturaUpdate,
    usuario_actual: dict = Depends(verificar_token),
    db: Session = Depends(get_db),
):
    _requerir_acceso_a_detalle(usuario_actual, data.id_det_fact, db)
    det_fac.editar_det_fac(
        db,
        data.id_det_fact,
        data.descripcion,
        data.unidades,
        data.precio_unitario,
        data.precio_total,
        data.forma_pago,
        data.id_encab_fact,
    )

@router.delete("/borrardetallefactura")
async def borrar(
    data: Detalle_facturaDelete,
    usuario_actual: dict = Depends(verificar_token),
    db: Session = Depends(get_db),
):
    _requerir_acceso_a_detalle(usuario_actual, data.id_det_fact, db)
    det_fac.borrar_det_fac(db, data.id_det_fact)
