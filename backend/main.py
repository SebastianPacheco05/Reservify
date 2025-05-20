from fastapi import FastAPI, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from config import get_db
from Cruds import (
    credenciales,
    roles,
    dueno,
    restaurante,
    mesas,
    cliente,
    empleado,
    enc_fac,
    det_fac,
    reserva,
)
from models import *

app = FastAPI()
# Credenciales


@app.post("/insertarcredencial")
def insertar(data: CredencialBase, db: Session = Depends(get_db)):
    credenciales.insertar_credenciales(db, data.email, data.password)
    return {"message": "Credenciales insertadas correctamente"}


@app.put("/editarcredencial")
def editar(data: CredencialUpdate, db: Session = Depends(get_db)):
    credenciales.editar_credenciales(db, data.id_credencial, data.email, data.password)
    return {"message": "Credenciales actualizadas correctamente"}


@app.delete("/borrarcredencial")
def borrar(data: CredencialDelete, db: Session = Depends(get_db)):
    credenciales.borrar_credenciales(db, data.id_credencial)
    return {"message": "Credenciales eliminadas correctamente"}


# Roles


@app.post("/insertaroles")
def insertar(data: RolBase, db: Session = Depends(get_db)):
    roles.insertar_roles(db, data.nombre_rol, data.descripcion)
    return {"message": "Roles insertados correctamente"}


@app.put("/editaroles")
def editar(data: RolUpdate, db: Session = Depends(get_db)):
    roles.editar_roles(db, data.id_rol, data.nombre_rol, data.descripcion)
    return {"message": "Roles actualizados correctamente"}


@app.delete("/borraroles")
def borrar(data: RolDelete, db: Session = Depends(get_db)):
    roles.borrar_roles(db, data.id_rol)
    return {"message": "Roles eliminados correctamente"}


# Dueno


@app.post("/insertardueno")
def insertar(data: DuenoBase, db: Session = Depends(get_db)):
    dueno.insertar_dueno(
        db,
        data.nombre1,
        data.nombre2,
        data.apellido1,
        data.apellido2,
        data.id_rol,
        data.id_credencial,
    )
    return {"message": "Dueno insertado correctamente"}


@app.put("/editardueno")
def editar(data: DuenoUpdate, db: Session = Depends(get_db)):
    dueno.editar_dueno(
        db,
        data.id_dueno,
        data.nombre1,
        data.nombre2,
        data.apellido1,
        data.apellido2,
        data.id_rol,
        data.id_credencial,
    )
    return {"message": "Dueno actualizado correctamente"}


@app.delete("/borrardueno")
def borrar(data: DuenoDelete, db: Session = Depends(get_db)):
    dueno.borrar_dueno(db, data.id_dueno)
    return {"message": "Dueno eliminado correctamente"}


# Restaurante


@app.post("/insertarrestaurante")
def insertar(data: RestauranteBase, db: Session = Depends(get_db)):
    restaurante.insertar_restaurante(
        db,
        data.NIT,
        data.direccion,
        data.nombre_restaurante,
        data.descripcion_restaurante,
        data.horario_apertura,
        data.horario_cierre,
        data.id_dueno,
    )
    return {"message": "Restaurante insertado correctamente"}


@app.put("/editarrestaurante")
def editar(data: RestauranteUpdate, db: Session = Depends(get_db)):
    restaurante.editar_restaurante(
        db,
        data.NIT,
        data.direccion,
        data.nombre_restaurante,
        data.descripcion_restaurante,
        data.horario_apertura,
        data.horario_cierre,
        data.id_dueno,
    )
    return {"message": "Restaurante actualizado correctamente"}


@app.delete("/borrarrestaurante")
def borrar(data: RestauranteDelete, db: Session = Depends(get_db)):
    restaurante.borrar_restaurante(db, data.id_restaurante)
    return {"message": "Restaurante eliminado correctamente"}


# Mesas


@app.post("/insertarmesas")
def insertar(data: MesaBase, db: Session = Depends(get_db)):
    mesas.insertar_mesas(
        db, data.estado_de_disponibilidad, data.cant_personas, data.NIT, data.precio
    )
    return {"message": "Mesa insertada correctamente"}


@app.put("/editarmesas")
def editar(data: MesaUpdate, db: Session = Depends(get_db)):
    mesas.editar_mesas(
        db,
        data.id_mesa,
        data.estado_de_disponibilidad,
        data.cant_personas,
        data.NIT,
        data.precio,
    )
    return {"message": "Mesa actualizada correctamente"}


@app.delete("/borrarmesas")
def borrar(data: MesaDelete, db: Session = Depends(get_db)):
    mesas.borrar_mesas(db, data.id_mesa)
    return {"message": "Mesa eliminada correctamente"}


# Cliente


@app.post("/insertarcliente")
def insertar(data: ClienteBase, db: Session = Depends(get_db)):
    cliente.insertar_clientes(
        db,
        data.id_credencial,
        data.nombre1,
        data.nombre2,
        data.apellido1,
        data.apellido2,
        data.tipo_documento,
        data.documento,
        data.nacionalidad,
        data.telefono,
        data.id_rol,
    )
    return {"message": "Cliente insertado correctamente"}


@app.put("/editarcliente")
def editar(data: ClienteUpdate, db: Session = Depends(get_db)):
    cliente.editar_clientes(
        db,
        data.id_cliente,
        data.id_credencial,
        data.nombre1,
        data.nombre2,
        data.apellido1,
        data.apellido2,
        data.tipo_documento,
        data.documento,
        data.nacionalidad,
        data.telefono,
        data.id_rol,
    )
    return {"message": "Cliente actualizado correctamente"}


@app.delete("/borrarcliente")
def borrar(data: ClienteDelete, db: Session = Depends(get_db)):
    cliente.borrar_clientes(db, data.id_cliente)
    return {"message": "Cliente eliminado correctamente"}


# Empleado


@app.post("/insertarempleado")
def insertar(data: EmpleadoBase, db: Session = Depends(get_db)):
    empleado.insertar_empleado(
        db,
        data.id_credencial,
        data.nombre1,
        data.nombre2,
        data.apellido1,
        data.apellido2,
        data.tipo_documento,
        data.documento,
        data.nacionalidad,
        data.telefono,
        data.id_rol,
        data.NIT,
    )
    return {"message": "Empleado insertado correctamente"}


@app.put("/editarempleado")
def editar(data: EmpleadoUpdate, db: Session = Depends(get_db)):
    empleado.editar_empleado(
        db,
        data.id_empleado,
        data.id_credencial,
        data.nombre1,
        data.nombre2,
        data.apellido1,
        data.apellido2,
        data.tipo_documento,
        data.documento,
        data.nacionalidad,
        data.telefono,
        data.id_rol,
        data.NIT,
    )
    return {"message": "Empleado actualizado correctamente"}


@app.delete("/borrarempleado")
def borrar(data: EmpleadoDelete, db: Session = Depends(get_db)):
    empleado.borrar_empleado(db, data.id_empleado)
    return {"message": "Empleado eliminado correctamente"}


# Encabezado_factura


@app.post("/insertar_encabezado_factura")
def insertar(data: Encabezado_facturaBase, db: Session = Depends(get_db)):
    enc_fac.insertar_enc_fac(
        db,
        data.NIT,
        data.nombre_restaurante,
        data.direccion,
        data.ciudad,
        data.fecha,
        data.id_cliente,
    )
    return {"message": "Encabezado_factura insertado correctamente"}


@app.put("/editar_encabezado_factura")
def editar(data: Encabezado_facturaUpdate, db: Session = Depends(get_db)):
    enc_fac.editar_enc_fac(
        db,
        data.id_encab_fact,
        data.NIT,
        data.nombre_restaurante,
        data.direccion,
        data.ciudad,
        data.fecha,
        data.id_cliente,
    )
    return {"message": "Encabezado_factura actualizado correctamente"}


@app.delete("/borrar_encabezado_factura")
def borrar(data: Encabezado_facturaDelete, db: Session = Depends(get_db)):
    enc_fac.borrar_enc_fac(db, data.id_encab_fact)
    return {"message": "Encabezado_factura eliminado correctamente"}


# Detalle_factura


@app.post("/insertar_detalle_factura")
def insertar(data: Detalle_facturaBase, db: Session = Depends(get_db)):
    det_fac.insertar_det_fac(
        db,
        data.descripcion,
        data.unidades,
        data.precio_unitario,
        data.precio_total,
        data.forma_pago,
        data.id_encab_fact,
    )
    return {"message": "Detalle_factura insertado correctamente"}


@app.put("/editar_detalle_factura")
def editar(data: Detalle_facturaUpdate, db: Session = Depends(get_db)):
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
    return {"message": "Detalle_factura actualizado correctamente"}


@app.delete("/borrar_detalle_factura")
def borrar(data: Detalle_facturaDelete, db: Session = Depends(get_db)):
    det_fac.borrar_det_fac(db, data.id_det_fact)
    return {"message": "Detalle_factura eliminado correctamente"}


# Reserva


@app.post("/insertar_reserva")
def insertar(data: ReservaBase, db: Session = Depends(get_db)):
    reserva.insertar_reserva(
        db, data.id_mesa, data.id_cliente, data.id_encab_fact, data.horario, data.fecha
    )
    return {"message": "Reserva insertada correctamente"}


@app.put("/editar_reserva")
def editar(data: ReservaUpdate, db: Session = Depends(get_db)):
    reserva.editar_reserva(
        db,
        data.id_reserva,
        data.id_mesa,
        data.id_cliente,
        data.id_encab_fact,
        data.horario,
        data.fecha,
    )
    return {"message": "Reserva actualizada correctamente"}


@app.delete("/borrar_reserva")
def borrar(data: ReservaDelete, db: Session = Depends(get_db)):
    reserva.borrar_reserva(db, data.id_reserva)
    return {"message": "Reserva eliminada correctamente"}
