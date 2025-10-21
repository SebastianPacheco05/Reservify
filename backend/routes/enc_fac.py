from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from config import get_db
from funciones.auth.dependencies import verificar_token
from funciones.cruds import enc_fac, list as enc_fac_queries
from models import Encabezado_facturaBase, Encabezado_facturaUpdate, Encabezado_facturaDelete, ListarEncabezadoFactura

router = APIRouter(
    prefix="/encabezado_factura",
    tags=["EncabezadoFactura"],
    dependencies=[Depends(verificar_token)]
)

@router.post("/insertarencabezadofactura")
async def insertar(data: Encabezado_facturaBase, db: Session = Depends(get_db), current_user: dict = Depends(verificar_token)):
    from funciones.reservar.cliente_utils import obtener_documento_por_email
    
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
    data: ListarEncabezadoFactura, db: Session = Depends(get_db)
):
    respuesta = enc_fac_queries.obtener_encabezado_factura(db, data.id_encab_fact)
    return {"respuesta": respuesta}

@router.get("/listar_encabezados_factura")
async def listar_encabezados_factura(db: Session = Depends(get_db)):
    respuesta = enc_fac_queries.obtener_encabezados_factura(db)
    return {"respuesta": respuesta}

@router.put("/editarencabezadofactura")
async def editar(data: Encabezado_facturaUpdate, db: Session = Depends(get_db)):
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
async def borrar(data: Encabezado_facturaDelete, db: Session = Depends(get_db)):
    enc_fac.borrar_enc_fac(db, data.id_encab_fact)
