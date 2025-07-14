from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from config import get_db
from funciones.auth.dependencies import verificar_token
from funciones.cruds import det_fac, list as det_fac_queries
from models import Detalle_facturaBase, Detalle_facturaUpdate, Detalle_facturaDelete, ListarDetalleFactura

router = APIRouter(
    prefix="/detalle_factura",
    tags=["DetalleFactura"],
    dependencies=[Depends(verificar_token)]
)

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
    data: ListarDetalleFactura, db: Session = Depends(get_db)
):
    respuesta = det_fac_queries.obtener_detalle_factura(db, data.id_det_fact)
    return {"respuesta": respuesta}

@router.get("/listar_detalles_factura")
async def listar_detalles_factura(db: Session = Depends(get_db)):
    respuesta = det_fac_queries.obtener_detalles_factura(db)
    return {"respuesta": respuesta}

@router.put("/editardetallefactura")
async def editar(data: Detalle_facturaUpdate, db: Session = Depends(get_db)):
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
async def borrar(data: Detalle_facturaDelete, db: Session = Depends(get_db)):
    det_fac.borrar_det_fac(db, data.id_det_fact)
