from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from config import get_db
from functions.auth.dependencies import verificar_token
from functions.cruds import enc_fac, list as enc_fac_queries
from functions.data_owner.data_owner import obtener_facturas_gestor, puede_acceder_restaurante
from models import Encabezado_facturaBase, Encabezado_facturaUpdate, Encabezado_facturaDelete, ListarEncabezadoFactura

router = APIRouter(
    prefix="/encabezado_factura",
    tags=["EncabezadoFactura"],
    dependencies=[Depends(verificar_token)]
)


def _requerir_acceso_a_factura(
    usuario_actual: dict,
    id_encab_fact: int,
    db: Session,
) -> None:
    row = db.execute(
        text('SELECT nit FROM "Encabezado_Factura" WHERE id_encab_fact = :id'),
        {"id": id_encab_fact},
    ).fetchone()
    if not row:
        raise HTTPException(status_code=404, detail="Factura no encontrada")
    nit = int(row[0])
    if not puede_acceder_restaurante(usuario_actual["id"], nit, db):
        raise HTTPException(
            status_code=403,
            detail="No tienes acceso a esta factura",
        )

@router.post("/insertarencabezadofactura")
async def insertar(data: Encabezado_facturaBase, db: Session = Depends(get_db), current_user: dict = Depends(verificar_token)):
    from functions.cruds.cliente_utils import obtener_documento_por_email
    
    # Obtener el documento del usuario autenticado usando su email
    documento_cliente = obtener_documento_por_email(db, current_user["email"])
    
    resultado = enc_fac.insertar_enc_fac(
        db,
        data.nit,
        data.nombre_restaurante,
        data.direccion,
        data.ciudad,
        data.fecha,
        documento_cliente,
    )
    
    return resultado

@router.get("/listar_encabezado_factura")
async def listar_encabezado_factura(
    data: ListarEncabezadoFactura,
    usuario_actual: dict = Depends(verificar_token),
    db: Session = Depends(get_db),
):
    _requerir_acceso_a_factura(usuario_actual, data.id_encab_fact, db)
    respuesta = enc_fac_queries.obtener_encabezado_factura(db, data.id_encab_fact)
    return {"respuesta": respuesta}

@router.get("/listar_encabezados_factura")
async def listar_encabezados_factura(
    usuario_actual: dict = Depends(verificar_token),
    db: Session = Depends(get_db),
):
    """
    Lista facturas solo del ámbito del gestor (dueño/admin/empleado).
    """
    facturas = obtener_facturas_gestor(usuario_actual["id"], db, limit=500)
    return {"respuesta": facturas}

@router.put("/editarencabezadofactura")
async def editar(
    data: Encabezado_facturaUpdate,
    usuario_actual: dict = Depends(verificar_token),
    db: Session = Depends(get_db),
):
    _requerir_acceso_a_factura(usuario_actual, data.id_encab_fact, db)
    enc_fac.editar_enc_fac(
        db,
        data.id_encab_fact,
        data.nit,
        data.nombre_restaurante,
        data.direccion,
        data.ciudad,
        data.fecha,
        data.documento,
    )

@router.delete("/borrarencabezadofactura")
async def borrar(
    data: Encabezado_facturaDelete,
    usuario_actual: dict = Depends(verificar_token),
    db: Session = Depends(get_db),
):
    _requerir_acceso_a_factura(usuario_actual, data.id_encab_fact, db)
    enc_fac.borrar_enc_fac(db, data.id_encab_fact)
