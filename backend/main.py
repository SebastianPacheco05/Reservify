from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from config import get_db
from funciones import (
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
    list
)
from models import *

app = FastAPI()
# Credenciales


@app.post("/insertarcredencial")
async def insertar(data: CredencialBase, db: Session = Depends(get_db)):
    credenciales.insertar_credenciales(db, data.email, data.password)
    return {"message": "Credenciales insertadas correctamente"}

@app.get("/listarcredenciales")
async def listar_credenciales(data: ListarCredenciales, db: Session = Depends(get_db)):
    respuesta = list.obtener_credenciales(db, data.id_credencial)
    return {"respuesta": respuesta}


@app.put("/editarcredencial")
async def editar(data: CredencialUpdate, db: Session = Depends(get_db)):
    credenciales.editar_credenciales(db, data.id_credencial, data.email, data.password)
    return {"message": "Credenciales actualizadas correctamente"}


@app.delete("/borrarcredencial")
async def borrar(data: CredencialDelete, db: Session = Depends(get_db)):
    credenciales.borrar_credenciales(db, data.id_credencial)
    return {"message": "Credenciales eliminadas correctamente"}


# Roles


@app.post("/insertaroles")
async def insertar(data: RolBase, db: Session = Depends(get_db)):
    roles.insertar_roles(db, data.nombre_rol, data.descripcion)
    return {"message": "Roles insertados correctamente"}

@app.get("/listarroles")
async def listar_roles(data: ListarRoles, db: Session = Depends(get_db)):
    respuesta = list.obtener_roles(db, data.id_rol)
    return {"respuesta": respuesta}

@app.put("/editaroles")
async def editar(data: RolUpdate, db: Session = Depends(get_db)):
    roles.editar_roles(db, data.id_rol, data.nombre_rol, data.descripcion)
    return {"message": "Roles actualizados correctamente"}


@app.delete("/borraroles")
async def borrar(data: RolDelete, db: Session = Depends(get_db)):
    roles.borrar_roles(db, data.id_rol)
    return {"message": "Roles eliminados correctamente"}


# Dueno


@app.post("/insertardueno")
async def insertar(data: DuenoBase, db: Session = Depends(get_db)):
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

@app.get("/listarduenos")
async def listar_duenos(data: ListarDuenos, db: Session = Depends(get_db)):
    respuesta = list.obtener_duenos(db, data.id_dueno)
    return {"respuesta": respuesta}

@app.put("/editardueno")
async def editar(data: DuenoUpdate, db: Session = Depends(get_db)):
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
async def borrar(data: DuenoDelete, db: Session = Depends(get_db)):
    dueno.borrar_dueno(db, data.id_dueno)
    return {"message": "Dueno eliminado correctamente"}


# Restaurante


@app.post("/insertarrestaurante")
async def insertar(data: RestauranteBase, db: Session = Depends(get_db)):
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

@app.get("/listarrestaurantes")
async def listar_restaurantes(data: ListarRestaurantes, db: Session = Depends(get_db)):
    respuesta = list.obtener_restaurantes(db, data.id_restaurante)
    return {"respuesta": respuesta}

@app.put("/editarrestaurante")
async def editar(data: RestauranteUpdate, db: Session = Depends(get_db)):
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
async def borrar(data: RestauranteDelete, db: Session = Depends(get_db)):
    restaurante.borrar_restaurante(db, data.id_restaurante)
    return {"message": "Restaurante eliminado correctamente"}


# Mesas


@app.post("/insertarmesas")
async def insertar(data: MesaBase, db: Session = Depends(get_db)):
    mesas.insertar_mesas(
        db, data.estado_de_disponibilidad, data.cant_personas, data.NIT, data.precio
    )
    return {"message": "Mesa insertada correctamente"}

@app.get("/listarmesas")
async def listar_mesas(data: ListarMesas, db: Session = Depends(get_db)):
    respuesta = list.obtener_mesas(db, data.id_mesa)
    return {"respuesta": respuesta}

@app.put("/editarmesas")
async def editar(data: MesaUpdate, db: Session = Depends(get_db)):
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
async def borrar(data: MesaDelete, db: Session = Depends(get_db)):
    mesas.borrar_mesas(db, data.id_mesa)
    return {"message": "Mesa eliminada correctamente"}


# Cliente


@app.post("/insertarcliente")
async def insertar(data: ClienteBase, db: Session = Depends(get_db)):
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

@app.get("/listarclientes")
async def listar_clientes(data: ListarClientes, db: Session = Depends(get_db)):
    respuesta = list.obtener_clientes(db, data.id_cliente)
    return {"respuesta": respuesta}

@app.put("/editarcliente")
async def editar(data: ClienteUpdate, db: Session = Depends(get_db)):
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
async def borrar(data: ClienteDelete, db: Session = Depends(get_db)):
    cliente.borrar_clientes(db, data.id_cliente)
    return {"message": "Cliente eliminado correctamente"}


# Empleado


@app.post("/insertarempleado")
async def insertar(data: EmpleadoBase, db: Session = Depends(get_db)):
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

@app.get("/listarempleados")
async def listar_empleados(data: ListarEmpleados, db: Session = Depends(get_db)):
    respuesta = list.obtener_empleados(db, data.id_empleado)
    return {"respuesta": respuesta}

@app.put("/editarempleado")
async def editar(data: EmpleadoUpdate, db: Session = Depends(get_db)):
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
async def borrar(data: EmpleadoDelete, db: Session = Depends(get_db)):
    empleado.borrar_empleado(db, data.id_empleado)
    return {"message": "Empleado eliminado correctamente"}


# Encabezado_factura


@app.post("/insertar_encabezado_factura")
async def insertar(data: Encabezado_facturaBase, db: Session = Depends(get_db)):
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

@app.get("/listarencabezadofactura")
async def listar_encabezado_factura(data: ListarEncabezadoFactura, db: Session = Depends(get_db)):
    respuesta = list.obtener_encabezado_factura(db, data.id_encab_fact)
    return {"respuesta": respuesta}

@app.put("/editar_encabezado_factura")
async def editar(data: Encabezado_facturaUpdate, db: Session = Depends(get_db)):
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
async def borrar(data: Encabezado_facturaDelete, db: Session = Depends(get_db)):
    enc_fac.borrar_enc_fac(db, data.id_encab_fact)
    return {"message": "Encabezado_factura eliminado correctamente"}


# Detalle_factura


@app.post("/insertar_detalle_factura")
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
    return {"message": "Detalle_factura insertado correctamente"}

@app.get("/listardetallefactura")
async def listar_detalle_factura(data: ListarDetalleFactura, db: Session = Depends(get_db)):
    respuesta = list.obtener_detalle_factura(db, data.id_det_fact)
    return {"respuesta": respuesta}


@app.put("/editar_detalle_factura")
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
    return {"message": "Detalle_factura actualizado correctamente"}


@app.delete("/borrar_detalle_factura")
async def borrar(data: Detalle_facturaDelete, db: Session = Depends(get_db)):
    det_fac.borrar_det_fac(db, data.id_det_fact)
    return {"message": "Detalle_factura eliminado correctamente"}


# Reserva


@app.post("/insertar_reserva")
async def insertar(data: ReservaBase, db: Session = Depends(get_db)):
    reserva.insertar_reserva(
        db, data.id_mesa, data.id_cliente, data.id_encab_fact, data.horario, data.fecha
    )
    return {"message": "Reserva insertada correctamente"}

@app.get("/listarreservas")
async def listar_reservas(data: ListarReservas, db: Session = Depends(get_db)):
    respuesta = list.obtener_reservas(db, data.id_reserva)
    return {"respuesta": respuesta}

@app.put("/editar_reserva")
async def editar(data: ReservaUpdate, db: Session = Depends(get_db)):
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
async def borrar(data: ReservaDelete, db: Session = Depends(get_db)):
    reserva.borrar_reserva(db, data.id_reserva)
    return {"message": "Reserva eliminada correctamente"}
