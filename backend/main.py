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
    list,
    categorias,
)
from models import *

app = FastAPI()
# Credenciales


@app.post("/insertarcredencial")
async def insertar(data: CredencialBase, db: Session = Depends(get_db)):
    credenciales.insertar_credenciales(db, data.email, data.password)


@app.get("/listarcredenciales")
async def listar_credenciales(data: ListarCredenciales, db: Session = Depends(get_db)):
    respuesta = list.obtener_credenciales(db, data.id_credencial)
    return {"respuesta": respuesta}


@app.put("/editarcredencial")
async def editar(data: CredencialUpdate, db: Session = Depends(get_db)):
    credenciales.editar_credenciales(db, data.id_credencial, data.email, data.password)


@app.delete("/borrarcredencial")
async def borrar(data: CredencialDelete, db: Session = Depends(get_db)):
    credenciales.borrar_credenciales(db, data.id_credencial)


# Roles


@app.post("/insertaroles")
async def insertar(data: RolBase, db: Session = Depends(get_db)):
    roles.insertar_roles(db, data.nombre_rol, data.descripcion)


@app.get("/listarroles")
async def listar_roles(data: ListarRoles, db: Session = Depends(get_db)):
    respuesta = list.obtener_roles(db, data.id_rol)
    return {"respuesta": respuesta}


@app.put("/editaroles")
async def editar(data: RolUpdate, db: Session = Depends(get_db)):
    roles.editar_roles(db, data.id_rol, data.nombre_rol, data.descripcion)


@app.delete("/borraroles")
async def borrar(data: RolDelete, db: Session = Depends(get_db)):
    roles.borrar_roles(db, data.id_rol)


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


@app.delete("/borrardueno")
async def borrar(data: DuenoDelete, db: Session = Depends(get_db)):
    dueno.borrar_dueno(db, data.id_dueno)


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


@app.delete("/borrarrestaurante")
async def borrar(data: RestauranteDelete, db: Session = Depends(get_db)):
    restaurante.borrar_restaurante(db, data.id_restaurante)


# Mesas


@app.post("/insertarmesas")
async def insertar(data: MesaBase, db: Session = Depends(get_db)):
    mesas.insertar_mesas(
        db, data.estado_de_disponibilidad, data.cant_personas, data.NIT, data.precio
    )


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


@app.delete("/borrarmesas")
async def borrar(data: MesaDelete, db: Session = Depends(get_db)):
    mesas.borrar_mesas(db, data.id_mesa)


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


@app.delete("/borrarcliente")
async def borrar(data: ClienteDelete, db: Session = Depends(get_db)):
    cliente.borrar_clientes(db, data.id_cliente)


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


@app.delete("/borrarempleado")
async def borrar(data: EmpleadoDelete, db: Session = Depends(get_db)):
    empleado.borrar_empleado(db, data.id_empleado)


# Encabezado_factura


@app.post("/insertarencabezadofactura")
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


@app.get("/listarencabezadofactura")
async def listar_encabezado_factura(
    data: ListarEncabezadoFactura, db: Session = Depends(get_db)
):
    respuesta = list.obtener_encabezado_factura(db, data.id_encab_fact)
    return {"respuesta": respuesta}


@app.put("/editarencabezadofactura")
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


@app.delete("/borrarencabezadofactura")
async def borrar(data: Encabezado_facturaDelete, db: Session = Depends(get_db)):
    enc_fac.borrar_enc_fac(db, data.id_encab_fact)


# Detalle_factura


@app.post("/insertardetallefactura")
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


@app.get("/listardetallefactura")
async def listar_detalle_factura(
    data: ListarDetalleFactura, db: Session = Depends(get_db)
):
    respuesta = list.obtener_detalle_factura(db, data.id_det_fact)
    return {"respuesta": respuesta}


@app.put("/editardetallefactura")
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


@app.delete("/borrardetallefactura")
async def borrar(data: Detalle_facturaDelete, db: Session = Depends(get_db)):
    det_fac.borrar_det_fac(db, data.id_det_fact)


# Reserva


@app.post("/insertarreserva")
async def insertar(data: ReservaBase, db: Session = Depends(get_db)):
    reserva.insertar_reserva(
        db, data.id_mesa, data.id_cliente, data.id_encab_fact, data.horario, data.fecha
    )


@app.get("/listarreservas")
async def listar_reservas(data: ListarReservas, db: Session = Depends(get_db)):
    respuesta = list.obtener_reservas(db, data.id_reserva)
    return {"respuesta": respuesta}


@app.put("/editarreserva")
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


@app.delete("/borrarreserva")
async def borrar(data: ReservaDelete, db: Session = Depends(get_db)):
    reserva.borrar_reserva(db, data.id_reserva)


# Categorias


@app.post("/insertarcategoria")
async def insertar(data: insertarCategorias, db: Session = Depends(get_db)):
    categorias.insertar_categoria(db, data.nombre_categoria)


@app.get("/listarcategorias")
async def listar_categorias(data: ListarCategorias, db: Session = Depends(get_db)):
    respuesta = list.obtener_categorias(db, data.id_categoria)
    return {"respuesta": respuesta}


@app.put("/editarcategoria")
async def editar(data: editarCategorias, db: Session = Depends(get_db)):
    categorias.editar_categoria(db, data.id_categoria, data.nombre_categoria)


@app.delete("/borrar_categoria")
async def borrar(data: borrarCategorias, db: Session = Depends(get_db)):
    categorias.borrar_categoria(db, data.id_categoria)
