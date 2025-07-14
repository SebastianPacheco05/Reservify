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
async def insertar(data: Encabezado_facturaBase, db: Session = Depends(get_db)):
    enc_fac.insertar_enc_fac(
        db,
        data.NIT,
        data.nombre_restaurante,
        data.direccion,
        data.ciudad,
        data.fecha,
        data.documento,
    )

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
        data.NIT,
        data.nombre_restaurante,
        data.direccion,
        data.ciudad,
        data.fecha,
        data.documento,
    )

@router.delete("/borrarencabezadofactura")
async def borrar(data: Encabezado_facturaDelete, db: Session = Depends(get_db)):
    enc_fac.borrar_enc_fac(db, data.id_encab_fact)
